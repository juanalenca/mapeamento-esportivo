import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db, firebaseEnabled } from '../lib/firebase'
import { demoStats } from '../data/demoStats'
import type { DashboardStats, SurveyResponse } from '../types'

export async function sendSurveyResponse(response: SurveyResponse) {
  if (!firebaseEnabled || !db) {
    await new Promise((resolve) => setTimeout(resolve, 700))
    return
  }
  await addDoc(collection(db, 'surveyResponses'), { ...response, createdAt: serverTimestamp() })
}

export async function getDashboardStats(): Promise<{ stats: DashboardStats; isDemo: boolean }> {
  if (!firebaseEnabled || !db) return { stats: demoStats, isDemo: true }
  const snapshot = await Promise.race([
    getDoc(doc(db, 'dashboardStats', 'current')),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Tempo esgotado ao carregar o painel.')), 5000)),
  ])
  if (!snapshot.exists()) return { stats: demoStats, isDemo: true }
  return { stats: snapshot.data() as DashboardStats, isDemo: false }
}
