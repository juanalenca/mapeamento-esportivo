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
  courses: [
    { name: 'Nutrição e Dietética', value: 18 }, { name: 'Farmácia', value: 13 },
    { name: 'Enfermagem', value: 8 }, { name: 'Outro', value: 3 },
  ],
  grades: [
    { name: '1º Ano', value: 18 }, { name: '2º Ano', value: 14 },
    { name: '3º Ano', value: 10 },
  ],
  ageRanges: [
    { name: '16 a 17 anos', value: 22 }, { name: '14 a 15 anos', value: 12 },
    { name: '18 anos ou mais', value: 8 },
  ],
  genders: [
    { name: 'Masculino', value: 23 }, { name: 'Feminino', value: 15 },
    { name: 'Outro', value: 2 }, { name: 'Prefiro não informar', value: 2 },
  ],
}
