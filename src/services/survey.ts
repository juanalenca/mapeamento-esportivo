import { addDoc, collection, doc, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore'
import { db, firebaseEnabled } from '../lib/firebase'
import { demoStats } from '../data/demoStats'
import { emptyStats } from '../data/emptyStats'
import type { CountItem, DashboardStats, SurveyResponse } from '../types'

const LOCAL_STORAGE_STATS_KEY = 'mapeamento_esportivo_local_stats'
const LOCAL_STORAGE_RESPONSES_KEY = 'mapeamento_esportivo_local_responses'

function increment(items: CountItem[], values: string[]): CountItem[] {
  const result = new Map(items.map((item) => [item.name, item.value]))
  values.forEach((value) => {
    if (value) result.set(value, (result.get(value) ?? 0) + 1)
  })
  return [...result.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name))
}

function getLocalStats(): DashboardStats | null {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_STATS_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as DashboardStats
      return {
        ...demoStats,
        ...parsed,
        practicedSports: parsed.practicedSports?.length ? parsed.practicedSports : demoStats.practicedSports,
        desiredSports: parsed.desiredSports?.length ? parsed.desiredSports : demoStats.desiredSports,
        barriers: parsed.barriers?.length ? parsed.barriers : demoStats.barriers,
        frequencies: parsed.frequencies?.length ? parsed.frequencies : (demoStats.frequencies ?? []),
        desiredAtSchool: parsed.desiredAtSchool?.length ? parsed.desiredAtSchool : (demoStats.desiredAtSchool ?? []),
      }
    }
  } catch {
    // ignore
  }
  return null
}

function updateLocalStats(response: SurveyResponse): DashboardStats {
  const base = getLocalStats() || demoStats
  const updated: DashboardStats = {
    totalResponses: base.totalResponses + 1,
    practices: response.practicesSport
      ? { yes: base.practices.yes + 1, no: base.practices.no }
      : { yes: base.practices.yes, no: base.practices.no + 1 },
    practicedSports: increment(base.practicedSports, response.practicedSports),
    frequencies: increment(base.frequencies ?? demoStats.frequencies ?? [], response.frequency ? [response.frequency] : []),
    desiredSports: increment(base.desiredSports, [response.desiredSport]),
    desiredAtSchool: increment(base.desiredAtSchool ?? demoStats.desiredAtSchool ?? [], response.desiredAtSchool ? [response.desiredAtSchool] : []),
    barriers: increment(base.barriers, response.barriers),
    updatedAt: new Date().toISOString(),
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(updated))
    const existingResponses: SurveyResponse[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_RESPONSES_KEY) || '[]')
    existingResponses.push({ ...response, createdAt: new Date().toISOString() })
    localStorage.setItem(LOCAL_STORAGE_RESPONSES_KEY, JSON.stringify(existingResponses))
  } catch (e) {
    console.warn('Não foi possível salvar no localStorage:', e)
  }
  return updated
}

export async function sendSurveyResponse(response: SurveyResponse) {
  if (firebaseEnabled && db) {
    try {
      // 1. Grava a resposta individual anônima
      await addDoc(collection(db, 'surveyResponses'), { ...response, createdAt: serverTimestamp() })

      // 2. Atualiza atomicamente os agregados no dashboardStats/current via transação
      const statsRef = doc(db, 'dashboardStats', 'current')
      await runTransaction(db, async (transaction) => {
        const statsDoc = await transaction.get(statsRef)
        const base: DashboardStats = statsDoc.exists()
          ? (statsDoc.data() as DashboardStats)
          : {
              totalResponses: 0,
              practices: { yes: 0, no: 0 },
              practicedSports: [],
              frequencies: [],
              desiredSports: [],
              desiredAtSchool: [],
              barriers: [],
            }

        const updated: DashboardStats = {
          totalResponses: (base.totalResponses || 0) + 1,
          practices: response.practicesSport
            ? { yes: (base.practices?.yes || 0) + 1, no: base.practices?.no || 0 }
            : { yes: base.practices?.yes || 0, no: (base.practices?.no || 0) + 1 },
          practicedSports: increment(base.practicedSports || [], response.practicedSports),
          frequencies: increment(base.frequencies || [], response.frequency ? [response.frequency] : []),
          desiredSports: increment(base.desiredSports || [], response.desiredSport ? [response.desiredSport] : []),
          desiredAtSchool: increment(base.desiredAtSchool || [], response.desiredAtSchool ? [response.desiredAtSchool] : []),
          barriers: increment(base.barriers || [], response.barriers),
          updatedAt: new Date().toISOString(),
        }

        transaction.set(statsRef, updated, { merge: true })
      })
    } catch (err) {
      console.warn('Firebase Firestore indisponível ou sem permissão remota. Salvando localmente para testes:', err)
    }
  } else {
    await new Promise((resolve) => setTimeout(resolve, 400))
  }
  updateLocalStats(response)
}

export async function getDashboardStats(): Promise<{ stats: DashboardStats; isDemo: boolean; isEmpty: boolean }> {
  if (firebaseEnabled && db) {
    try {
      const snapshot = await Promise.race([
        getDoc(doc(db, 'dashboardStats', 'current')),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Tempo esgotado ao carregar o painel.')), 3000)),
      ])
      if (snapshot.exists()) {
        const data = snapshot.data() as DashboardStats
        const realStats: DashboardStats = {
          ...emptyStats,
          ...data,
          practicedSports: data.practicedSports?.length ? data.practicedSports : [],
          desiredSports: data.desiredSports?.length ? data.desiredSports : [],
          barriers: data.barriers?.length ? data.barriers : [],
          frequencies: data.frequencies?.length ? data.frequencies : [],
          desiredAtSchool: data.desiredAtSchool?.length ? data.desiredAtSchool : [],
        }
        return {
          stats: realStats,
          isDemo: false,
          isEmpty: realStats.totalResponses === 0,
        }
      }
      // Documento não existe — banco está vazio
      return { stats: emptyStats, isDemo: false, isEmpty: true }
    } catch (err) {
      console.warn('Não foi possível carregar estatísticas do Firebase. Usando dados locais:', err)
    }
  }
  const local = getLocalStats()
  if (local) {
    return { stats: local, isDemo: true, isEmpty: false }
  }
  return { stats: demoStats, isDemo: true, isEmpty: false }
}
