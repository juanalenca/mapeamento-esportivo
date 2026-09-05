import type { DashboardStats } from '../types'

export const emptyStats: DashboardStats = {
  totalResponses: 0,
  practices: { yes: 0, no: 0 },
  practicedSports: [],
  frequencies: [],
  desiredSports: [],
  desiredAtSchool: [],
  barriers: [],
  courses: [],
  grades: [],
  ageRanges: [],
  genders: [],
  recentActivity: [],
}
