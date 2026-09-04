import type { DashboardStats } from '../types'

/**
 * Dados de demonstração para fallback local (sem acesso ao Firebase).
 * Gerados a partir da base combinada de 80 registros:
 * 7 respostas reais + 73 respostas sintéticas para desenvolvimento/testes.
 */
export const demoStats: DashboardStats = {
  totalResponses: 80,
  practices: { yes: 63, no: 17 },
  practicedSports: [
    { name: 'Futebol', value: 35 }, { name: 'Vôlei', value: 25 },
    { name: 'Corrida/caminhada', value: 22 }, { name: 'Basquete', value: 21 },
    { name: 'Futsal', value: 17 }, { name: 'Musculação/academia', value: 14 },
    { name: 'Dança', value: 12 }, { name: 'Artes marciais', value: 4 },
    { name: 'Outro', value: 3 }, { name: 'Ciclismo', value: 2 },
  ],
  frequencies: [
    { name: '2–3 vezes por semana', value: 21 },
    { name: 'Não pratico', value: 17 },
    { name: 'Menos de 1 vez por semana', value: 13 },
    { name: '1 vez por semana', value: 11 },
    { name: '4–6 vezes por semana', value: 9 },
    { name: 'Todos os dias', value: 9 },
  ],
  desiredSports: [
    { name: 'Vôlei', value: 16 }, { name: 'Basquete', value: 11 },
    { name: 'Futsal', value: 11 }, { name: 'Dança', value: 9 },
    { name: 'Musculação/academia', value: 9 }, { name: 'Futebol', value: 7 },
    { name: 'Outro', value: 6 }, { name: 'Artes marciais', value: 5 },
    { name: 'Corrida/caminhada', value: 5 }, { name: 'Ciclismo', value: 1 },
  ],
  desiredAtSchool: [
    { name: 'Vôlei', value: 19 }, { name: 'Basquete', value: 14 },
    { name: 'Futebol', value: 12 }, { name: 'Futsal', value: 12 },
    { name: 'Artes marciais', value: 6 }, { name: 'Musculação/academia', value: 6 },
    { name: 'Outro', value: 6 }, { name: 'Corrida/caminhada', value: 2 },
    { name: 'Dança', value: 2 }, { name: 'Ciclismo', value: 1 },
  ],
  barriers: [
    { name: 'Falta de tempo', value: 29 }, { name: 'Falta de oportunidade na escola', value: 25 },
    { name: 'Falta de espaço', value: 19 }, { name: 'Falta de dinheiro', value: 15 },
    { name: 'Falta de equipamentos', value: 13 }, { name: 'Falta de companhia', value: 12 },
    { name: 'Nada dificulta', value: 12 }, { name: 'Falta de interesse', value: 9 },
    { name: 'Outro', value: 2 },
  ],
  courses: [
    { name: 'Nutrição e Dietética', value: 29 }, { name: 'Farmácia', value: 23 },
    { name: 'Enfermagem', value: 19 }, { name: 'Outro', value: 6 },
    { name: 'computação', value: 1 }, { name: 'Educação Física', value: 1 },
    { name: 'Educação física', value: 1 },
  ],
  grades: [
    { name: '1º Ano', value: 28 }, { name: '3º Ano', value: 27 },
    { name: '2º Ano', value: 25 },
  ],
  ageRanges: [
    { name: '16 a 17 anos', value: 39 }, { name: '18 anos ou mais', value: 22 },
    { name: '14 a 15 anos', value: 19 },
  ],
  genders: [
    { name: 'Feminino', value: 39 }, { name: 'Masculino', value: 28 },
    { name: 'Prefiro não informar', value: 8 }, { name: 'Outro', value: 5 },
  ],
}
