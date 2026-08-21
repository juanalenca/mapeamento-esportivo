import type { DashboardStats } from '../types'

export const demoStats: DashboardStats = {
  totalResponses: 42,
  practices: { yes: 29, no: 13 },
  practicedSports: [
    { name: 'Futebol', value: 15 }, { name: 'Vôlei', value: 8 },
    { name: 'Corrida/caminhada', value: 7 }, { name: 'Musculação/academia', value: 6 },
    { name: 'Outros', value: 6 },
  ],
  desiredSports: [
    { name: 'Vôlei', value: 12 }, { name: 'Futsal', value: 9 },
    { name: 'Basquete', value: 7 }, { name: 'Dança', value: 6 }, { name: 'Futebol', value: 5 },
  ],
  barriers: [
    { name: 'Falta de tempo', value: 18 }, { name: 'Falta de oportunidade na escola', value: 14 },
    { name: 'Falta de equipamentos', value: 10 }, { name: 'Falta de espaço', value: 8 },
  ],
}
