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

export const courses = [
  'Desenvolvimento de Sistemas', 'Redes de Computadores', 'Administração', 'Outro',
] as const

export const grades = [
  '1º Ano', '2º Ano', '3º Ano', 'Módulo Subsequente',
] as const

export const ageRanges = [
  '14 a 15 anos', '16 a 17 anos', '18 anos ou mais',
] as const

export const genders = [
  'Feminino', 'Masculino', 'Outro', 'Prefiro não informar',
] as const

export type Sport = (typeof sports)[number]
export type Frequency = (typeof frequencies)[number]
export type Barrier = (typeof barriers)[number]
export type Course = (typeof courses)[number]
export type Grade = (typeof grades)[number]
export type AgeRange = (typeof ageRanges)[number]
export type Gender = (typeof genders)[number]

export interface SurveyResponse {
  course: Course
  grade: Grade
  ageRange: AgeRange
  gender: Gender
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
  courses?: CountItem[]
  grades?: CountItem[]
  ageRanges?: CountItem[]
  genders?: CountItem[]
  updatedAt?: unknown
}
