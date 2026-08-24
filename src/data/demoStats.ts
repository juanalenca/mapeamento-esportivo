import type { DashboardStats } from '../types'

export const demoStats: DashboardStats = {
  totalResponses: 42,
  practices: { yes: 29, no: 13 },
  practicedSports: [
    { name: 'Futebol', value: 15 }, { name: 'Vôlei', value: 8 },
    { name: 'Corrida/caminhada', value: 7 }, { name: 'Musculação/academia', value: 6 },
    { name: 'Outros', value: 6 },
  ],
  frequencies: [
    { name: '2–3 vezes por semana', value: 14 },
    { name: 'Não pratico', value: 13 },
    { name: '4–6 vezes por semana', value: 7 },
    { name: 'Todos os dias', value: 5 },
    { name: '1 vez por semana', value: 3 },
  ],
  desiredSports: [
    { name: 'Vôlei', value: 12 }, { name: 'Futsal', value: 9 },
    { name: 'Basquete', value: 7 }, { name: 'Dança', value: 6 }, { name: 'Futebol', value: 5 },
  ],
  desiredAtSchool: [
    { name: 'Futsal', value: 14 }, { name: 'Vôlei', value: 11 },
    { name: 'Basquete', value: 8 }, { name: 'Dança', value: 5 }, { name: 'Artes marciais', value: 4 },
  ],
  barriers: [
    { name: 'Falta de tempo', value: 18 }, { name: 'Falta de oportunidade na escola', value: 14 },
    { name: 'Falta de equipamentos', value: 10 }, { name: 'Falta de espaço', value: 8 },
  ],
}

