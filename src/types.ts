export const sports = [
  'Futebol', 'Vôlei', 'Futsal', 'Basquete', 'Corrida/caminhada',
  'Ciclismo', 'Musculação/academia', 'Dança', 'Artes marciais', 'Outro',
] as const

export const frequencies = [
  'Todos os dias', '4–6 vezes por semana', '2–3 vezes por semana',
  '1 vez por semana', 'Menos de 1 vez por semana', 'Não pratico',
] as const

export const barriers = [
  'Falta de tempo', 'Falta de espaço', 'Falta de equipamentos', 'Falta de dinheiro',
  'Falta de companhia', 'Falta de oportunidade na escola', 'Falta de interesse', 'Outro', 'Nada dificulta',
] as const

export type Sport = (typeof sports)[number]
export type Frequency = (typeof frequencies)[number]
export type Barrier = (typeof barriers)[number]

export interface SurveyResponse {
  practicesSport: boolean
  practicedSports: Sport[]
  frequency: Frequency
  desiredSport: Sport
  barriers: Barrier[]
  desiredAtSchool: Sport
  createdAt?: unknown
}

export interface CountItem { name: string; value: number }

export interface DashboardStats {
  totalResponses: number
  practices: { yes: number; no: number }
  practicedSports: CountItem[]
  frequencies?: CountItem[]
  desiredSports: CountItem[]
  desiredAtSchool?: CountItem[]
  barriers: CountItem[]
  updatedAt?: unknown
}

