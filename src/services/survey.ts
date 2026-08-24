import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db, firebaseEnabled } from '../lib/firebase'
import { demoStats } from '../data/demoStats'
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
    if (saved) return JSON.parse(saved) as DashboardStats
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
    frequencies: increment(base.frequencies ?? [], response.frequency ? [response.frequency] : []),
    desiredSports: increment(base.desiredSports, [response.desiredSport]),
    desiredAtSchool: increment(base.desiredAtSchool ?? [], response.desiredAtSchool ? [response.desiredAtSchool] : []),
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
      await addDoc(collection(db, 'surveyResponses'), { ...response, createdAt: serverTimestamp() })
    } catch (err) {
      console.warn('Firebase Firestore indisponível ou sem permissão remota. Salvando localmente para testes:', err)
    }
  } else {
    await new Promise((resolve) => setTimeout(resolve, 400))
  }
  updateLocalStats(response)
}

export async function getDashboardStats(): Promise<{ stats: DashboardStats; isDemo: boolean }> {
  if (firebaseEnabled && db) {
    try {
      const snapshot = await Promise.race([
        getDoc(doc(db, 'dashboardStats', 'current')),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Tempo esgotado ao carregar o painel.')), 3000)),
      ])
      if (snapshot.exists()) {
        return { stats: snapshot.data() as DashboardStats, isDemo: false }
      }
    } catch (err) {
      console.warn('Não foi possível carregar estatísticas do Firebase. Usando dados locais:', err)
    }
  }
  const local = getLocalStats()
  if (local) {
    return { stats: local, isDemo: true }
  }
  return { stats: demoStats, isDemo: true }
}
