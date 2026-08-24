import { initializeApp } from 'firebase-admin/app'
import { getFirestore, type DocumentData } from 'firebase-admin/firestore'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'

initializeApp()
const db = getFirestore()
const statsRef = db.collection('dashboardStats').doc('current')

type CountItem = { name: string; value: number }
type ResponseData = {
  practicesSport: boolean
  practicedSports: string[]
  frequency: string
  desiredSport: string
  barriers: string[]
  desiredAtSchool: string
}

function increment(items: CountItem[], values: string[]) {
  const result = new Map(items.map((item) => [item.name, item.value]))
  values.forEach((value) => result.set(value, (result.get(value) ?? 0) + 1))
  return [...result.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value || a.name.localeCompare(b.name))
}

function currentStats(data?: DocumentData) {
  return {
    totalResponses: Number(data?.totalResponses ?? 0),
    practices: { yes: Number(data?.practices?.yes ?? 0), no: Number(data?.practices?.no ?? 0) },
    practicedSports: (data?.practicedSports ?? []) as CountItem[],
    frequencies: (data?.frequencies ?? []) as CountItem[],
    desiredSports: (data?.desiredSports ?? []) as CountItem[],
    desiredAtSchool: (data?.desiredAtSchool ?? []) as CountItem[],
    barriers: (data?.barriers ?? []) as CountItem[],
  }
}

export const updateDashboardStats = onDocumentCreated('surveyResponses/{responseId}', async (event) => {
  const response = event.data?.data() as ResponseData | undefined
  if (!response) return
  await db.runTransaction(async (transaction) => {
    const current = currentStats((await transaction.get(statsRef)).data())
    transaction.set(statsRef, {
      totalResponses: current.totalResponses + 1,
      practices: response.practicesSport
        ? { yes: current.practices.yes + 1, no: current.practices.no }
        : { yes: current.practices.yes, no: current.practices.no + 1 },
      practicedSports: increment(current.practicedSports, response.practicedSports),
      frequencies: increment(current.frequencies, response.frequency ? [response.frequency] : []),
      desiredSports: increment(current.desiredSports, [response.desiredSport]),
      desiredAtSchool: increment(current.desiredAtSchool, response.desiredAtSchool ? [response.desiredAtSchool] : []),
      barriers: increment(current.barriers, response.barriers),
      updatedAt: new Date(),
    }, { merge: true })
  })
})

