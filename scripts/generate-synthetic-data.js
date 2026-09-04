/**
 * generate-synthetic-data.js
 * 
 * Gera 73 respostas sintéticas realistas e combina com as 7 respostas reais
 * existentes no backup mais recente do Firestore.
 * 
 * Saída: scripts/backups/synthetic-80-responses.json
 * 
 * Uso: node scripts/generate-synthetic-data.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ─── Constantes do domínio (espelham src/types.ts) ───

const sports = [
  'Futebol', 'Vôlei', 'Futsal', 'Basquete', 'Corrida/caminhada',
  'Ciclismo', 'Musculação/academia', 'Dança', 'Artes marciais', 'Outro',
]

const frequencies = [
  'Todos os dias', '4–6 vezes por semana', '2–3 vezes por semana',
  '1 vez por semana', 'Menos de 1 vez por semana', 'Não pratico',
]

const barriers = [
  'Falta de tempo', 'Falta de espaço', 'Falta de equipamentos', 'Falta de dinheiro',
  'Falta de companhia', 'Falta de oportunidade na escola', 'Falta de interesse', 'Outro', 'Nada dificulta',
]

const coursesList = ['Nutrição e Dietética', 'Farmácia', 'Enfermagem', 'Outro']
const gradesList = ['1º Ano', '2º Ano', '3º Ano']
const ageRangesList = ['14 a 15 anos', '16 a 17 anos', '18 anos ou mais']
const gendersList = ['Feminino', 'Masculino', 'Outro', 'Prefiro não informar']

// ─── Utilitários de aleatoriedade ───

function secureRandom() {
  return randomBytes(4).readUInt32BE() / 0xFFFFFFFF
}

function weightedPick(items, weights) {
  const total = weights.reduce((sum, w) => sum + w, 0)
  let r = secureRandom() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r <= 0) return items[i]
  }
  return items[items.length - 1]
}

function pickN(items, weights, min, max) {
  const count = min + Math.floor(secureRandom() * (max - min + 1))
  const picked = new Set()
  let attempts = 0
  while (picked.size < count && attempts < 100) {
    const item = weightedPick(items, weights)
    picked.add(item)
    attempts++
  }
  return [...picked]
}

function generateFirestoreId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 20; i++) {
    id += chars[Math.floor(secureRandom() * chars.length)]
  }
  return id
}

// ─── Distribuições ───

// Série: 28 (1º), 25 (2º), 20 (3º) = 73
const gradeDistribution = { '1º Ano': 28, '2º Ano': 25, '3º Ano': 20 }

// Pesos plausíveis para distribuição sintética em ambiente de testes/demonstração.
// NOTA: Estes pesos são parâmetros puramente operacionais de teste para o MVP
// e NÃO representam uma estimativa estatística da população real da escola.
const genderWeights = [55, 30, 5, 10] // Feminino, Masculino, Outro, Prefiro não informar

// Idade condicionada à série
const ageByGrade = {
  '1º Ano':  [60, 35, 5],   // 14-15, 16-17, 18+
  '2º Ano':  [10, 70, 20],
  '3º Ano':  [0, 55, 45],
}

// Pratica esporte: 65% sim
const practicesYesRate = 0.65

// Frequência para praticantes
const freqPracticesWeights = [10, 15, 35, 20, 20]  // Todos os dias, 4-6x, 2-3x, 1x, <1x
const freqPracticesOptions = frequencies.slice(0, 5) // Exclui "Não pratico"

// Modalidades praticadas (pesos)
const sportWeights = [25, 18, 10, 8, 14, 4, 12, 5, 3, 1]

// Esporte desejado (pesos)
const desiredSportWeights = [12, 18, 14, 10, 8, 3, 12, 9, 8, 6]

// Esporte desejado na escola (pesos)
const desiredAtSchoolWeights = [10, 18, 20, 12, 5, 2, 8, 9, 10, 6]

// Barreiras (pesos) — último é "Nada dificulta"
const barrierWeights = [25, 10, 12, 6, 8, 18, 5, 4, 12]

// ─── Geração ───

function generateSyntheticResponse(grade) {
  // Curso
  const course = weightedPick(coursesList, courseWeights)

  // Gênero
  const gender = weightedPick(gendersList, genderWeights)

  // Idade (condicionada à série)
  const ageWeights = ageByGrade[grade]
  const ageRange = weightedPick(ageRangesList, ageWeights)

  // Pratica esporte?
  const practicesSport = secureRandom() < practicesYesRate

  // Modalidades praticadas
  let practicedSports = []
  if (practicesSport) {
    practicedSports = pickN(sports, sportWeights, 1, 4)
  }

  // Frequência
  let frequency
  if (practicesSport) {
    frequency = weightedPick(freqPracticesOptions, freqPracticesWeights)
  } else {
    frequency = 'Não pratico'
  }

  // Esporte desejado
  const desiredSport = weightedPick(sports, desiredSportWeights)

  // Esporte desejado na escola
  const desiredAtSchool = weightedPick(sports, desiredAtSchoolWeights)

  // Barreiras
  let selectedBarriers
  // Se pratica e tem alta frequência, maior chance de "Nada dificulta"
  if (practicesSport && (frequency === 'Todos os dias' || frequency === '4–6 vezes por semana')) {
    // 40% de chance de "Nada dificulta"
    if (secureRandom() < 0.40) {
      selectedBarriers = ['Nada dificulta']
    } else {
      selectedBarriers = pickN(barriers.slice(0, -1), barrierWeights.slice(0, -1), 1, 3)
    }
  } else if (!practicesSport) {
    // Não praticantes sempre têm barreiras reais (nunca "Nada dificulta")
    selectedBarriers = pickN(barriers.slice(0, -1), barrierWeights.slice(0, -1), 1, 3)
  } else {
    // Praticantes com frequência moderada/baixa: pequena chance de "Nada dificulta"
    if (secureRandom() < 0.15) {
      selectedBarriers = ['Nada dificulta']
    } else {
      selectedBarriers = pickN(barriers.slice(0, -1), barrierWeights.slice(0, -1), 1, 3)
    }
  }

  // Gerar timestamp no período da pesquisa (01/09/2026 a 04/09/2026)
  const startTimestamp = new Date('2026-09-01T08:00:00Z').getTime() / 1000
  const endTimestamp = new Date('2026-09-04T18:00:00Z').getTime() / 1000
  const randomTimestamp = Math.floor(startTimestamp + secureRandom() * (endTimestamp - startTimestamp))

  return {
    id: generateFirestoreId(),
    course,
    grade,
    ageRange,
    gender,
    practicesSport,
    practicedSports,
    frequency,
    desiredSport,
    barriers: selectedBarriers,
    desiredAtSchool,
    createdAt: {
      _seconds: randomTimestamp,
      _nanoseconds: Math.floor(secureRandom() * 999000000),
    },
    _synthetic: true, // Marcador interno
  }
}

function computeAggregates(allResponses) {
  const stats = {
    totalResponses: allResponses.length,
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
    updatedAt: new Date().toISOString(),
  }

  const counters = {
    practicedSports: {},
    frequencies: {},
    desiredSports: {},
    desiredAtSchool: {},
    barriers: {},
    courses: {},
    grades: {},
    ageRanges: {},
    genders: {},
  }

  for (const r of allResponses) {
    if (r.practicesSport) stats.practices.yes++
    else stats.practices.no++

    for (const s of (r.practicedSports || [])) {
      counters.practicedSports[s] = (counters.practicedSports[s] || 0) + 1
    }
    if (r.frequency) counters.frequencies[r.frequency] = (counters.frequencies[r.frequency] || 0) + 1
    if (r.desiredSport) counters.desiredSports[r.desiredSport] = (counters.desiredSports[r.desiredSport] || 0) + 1
    if (r.desiredAtSchool) counters.desiredAtSchool[r.desiredAtSchool] = (counters.desiredAtSchool[r.desiredAtSchool] || 0) + 1
    for (const b of (r.barriers || [])) {
      counters.barriers[b] = (counters.barriers[b] || 0) + 1
    }
    if (r.course) counters.courses[r.course] = (counters.courses[r.course] || 0) + 1
    if (r.grade) counters.grades[r.grade] = (counters.grades[r.grade] || 0) + 1
    if (r.ageRange) counters.ageRanges[r.ageRange] = (counters.ageRanges[r.ageRange] || 0) + 1
    if (r.gender) counters.genders[r.gender] = (counters.genders[r.gender] || 0) + 1
  }

  const toSorted = (obj) =>
    Object.entries(obj)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name))

  stats.practicedSports = toSorted(counters.practicedSports)
  stats.frequencies = toSorted(counters.frequencies)
  stats.desiredSports = toSorted(counters.desiredSports)
  stats.desiredAtSchool = toSorted(counters.desiredAtSchool)
  stats.barriers = toSorted(counters.barriers)
  stats.courses = toSorted(counters.courses)
  stats.grades = toSorted(counters.grades)
  stats.ageRanges = toSorted(counters.ageRanges)
  stats.genders = toSorted(counters.genders)

  return stats
}

function validate(allResponses) {
  const errors = []

  for (let i = 0; i < allResponses.length; i++) {
    const r = allResponses[i]
    const label = r._synthetic ? `synthetic[${i}]` : `real[${r.id}]`

    // RN1: practicesSport=false → practicedSports vazio
    if (!r.practicesSport && r.practicedSports && r.practicedSports.length > 0) {
      errors.push(`${label}: practicesSport=false mas practicedSports não vazio`)
    }

    // RN2: practicesSport=true → practicedSports ≥ 1
    if (r.practicesSport && (!r.practicedSports || r.practicedSports.length === 0)) {
      errors.push(`${label}: practicesSport=true mas practicedSports vazio`)
    }

    // RN3: practicesSport=false → frequency='Não pratico'
    if (!r.practicesSport && r.frequency !== 'Não pratico') {
      errors.push(`${label}: practicesSport=false mas frequency='${r.frequency}'`)
    }

    // RN4: barriers ≥ 1
    if (!r.barriers || r.barriers.length === 0) {
      errors.push(`${label}: barriers vazio`)
    }

    // RN5: "Nada dificulta" exclusivo
    if (r.barriers && r.barriers.includes('Nada dificulta') && r.barriers.length > 1) {
      errors.push(`${label}: "Nada dificulta" combinado com outras barreiras`)
    }

    // RN6: grade válido
    if (!gradesList.includes(r.grade)) {
      errors.push(`${label}: grade inválido '${r.grade}'`)
    }

    // RN7: ageRange válido
    if (!ageRangesList.includes(r.ageRange)) {
      errors.push(`${label}: ageRange inválido '${r.ageRange}'`)
    }

    // RN8: gender válido
    if (!gendersList.includes(r.gender)) {
      errors.push(`${label}: gender inválido '${r.gender}'`)
    }

    // RN9: frequency válido
    if (!frequencies.includes(r.frequency)) {
      errors.push(`${label}: frequency inválido '${r.frequency}'`)
    }

    // RN10: desiredSport válido
    if (!sports.includes(r.desiredSport)) {
      errors.push(`${label}: desiredSport inválido '${r.desiredSport}'`)
    }

    // RN11: desiredAtSchool válido
    if (!sports.includes(r.desiredAtSchool)) {
      errors.push(`${label}: desiredAtSchool inválido '${r.desiredAtSchool}'`)
    }

    // RN12: practicedSports contém apenas valores válidos
    if (r.practicedSports) {
      for (const s of r.practicedSports) {
        if (!sports.includes(s)) {
          errors.push(`${label}: practicedSport inválido '${s}'`)
        }
      }
    }

    // RN13: barriers contém apenas valores válidos
    if (r.barriers) {
      for (const b of r.barriers) {
        if (!barriers.includes(b)) {
          errors.push(`${label}: barrier inválida '${b}'`)
        }
      }
    }
  }

  return errors
}

// ─── Main ───

function main() {
  const backupDir = join(__dirname, 'backups')
  const syntheticPath = join(backupDir, 'synthetic-80-responses.json')
  const shouldRegenerate = process.argv.includes('--regenerate')

  let realResponses = []
  let syntheticResponses = []

  if (existsSync(syntheticPath) && !shouldRegenerate) {
    console.log('📂 Carregando base existente de 80 registros (7 reais + 73 sintéticos)...')
    console.log('   (Para gerar nova população sintética, execute com a flag --regenerate)\n')

    const existingData = JSON.parse(readFileSync(syntheticPath, 'utf8'))
    const realIds = new Set(existingData.realResponseIds || [])

    existingData.surveyResponses.forEach((r) => {
      if (realIds.has(r.id)) {
        realResponses.push(r)
      } else {
        syntheticResponses.push({ ...r, _synthetic: true })
      }
    })

    console.log(`   → ${realResponses.length} respostas reais preservadas`)
    console.log(`   → ${syntheticResponses.length} respostas sintéticas existentes preservadas\n`)
  } else {
    console.log('🔧 Gerando nova base de dados sintética...\n')

    // 1. Carregar respostas reais do backup de dados reais
    const backupFiles = readdirSync(backupDir)
      .filter((f) => f.startsWith('backup-') && f.endsWith('.json'))
      .sort()

    if (backupFiles.length === 0) {
      console.error('❌ Nenhum backup encontrado em scripts/backups/')
      process.exit(1)
    }

    const latestBackup = join(backupDir, backupFiles[backupFiles.length - 1])
    console.log(`📂 Usando backup de referência para respostas reais: ${backupFiles[backupFiles.length - 1]}`)

    const backupData = JSON.parse(readFileSync(latestBackup, 'utf8'))
    realResponses = backupData.surveyResponses || []
    console.log(`   ${realResponses.length} respostas reais encontradas\n`)

    // 2. Gerar 73 respostas sintéticas
    const gradePool = []
    for (const [grade, count] of Object.entries(gradeDistribution)) {
      for (let i = 0; i < count; i++) {
        gradePool.push(grade)
      }
    }

    for (let i = gradePool.length - 1; i > 0; i--) {
      const j = Math.floor(secureRandom() * (i + 1))
      ;[gradePool[i], gradePool[j]] = [gradePool[j], gradePool[i]]
    }

    for (let i = 0; i < 73; i++) {
      syntheticResponses.push(generateSyntheticResponse(gradePool[i]))
    }

    console.log(`✅ ${syntheticResponses.length} respostas sintéticas geradas`)
  }

  // 3. Combinar
  const allResponses = [...realResponses, ...syntheticResponses]
  console.log(`📊 Total: ${allResponses.length} registros (${realResponses.length} reais + ${syntheticResponses.length} sintéticos)\n`)

  // 4. Validar
  console.log('🔍 Validando constraints...')
  const errors = validate(allResponses)
  if (errors.length > 0) {
    console.error(`\n❌ ${errors.length} erro(s) encontrado(s):`)
    errors.forEach((e) => console.error(`   • ${e}`))
    process.exit(1)
  }
  console.log('   ✅ Nenhuma violação encontrada\n')

  // 5. Computar agregados
  const dashboardStats = computeAggregates(allResponses)
  const realStats = computeAggregates(realResponses)
  const syntheticStats = computeAggregates(syntheticResponses)

  // 6. Resumo estatístico
  console.log('═════════════════════════════════════════════════════════════════')
  console.log('          RESUMO ESTATÍSTICO DA BASE (REAL vs SINTÉTICA)')
  console.log('═════════════════════════════════════════════════════════════════\n')
  console.log('NOTA: 7 respostas reais coletadas pelo sistema + 73 registros')
  console.log('sintéticos plausíveis criados para desenvolvimento e demonstração')
  console.log('do MVP. Não representam estatisticamente a população da escola.\n')

  console.log(`Total de participações:   ${dashboardStats.totalResponses}`)
  console.log(`  → Respostas reais:      ${realResponses.length}`)
  console.log(`  → Respostas sintéticas: ${syntheticResponses.length}\n`)

  console.log('─── Prática de Esporte ───')
  console.log(`  Real:       Sim: ${realStats.practices.yes}/${realResponses.length} (${Math.round(realStats.practices.yes / (realResponses.length || 1) * 100)}%)  |  Não: ${realStats.practices.no}/${realResponses.length}`)
  console.log(`  Sintético:  Sim: ${syntheticStats.practices.yes}/${syntheticResponses.length} (${Math.round(syntheticStats.practices.yes / (syntheticResponses.length || 1) * 100)}%) | Não: ${syntheticStats.practices.no}/${syntheticResponses.length}`)
  console.log(`  Combinado:  Sim: ${dashboardStats.practices.yes}/${dashboardStats.totalResponses} (${Math.round(dashboardStats.practices.yes / dashboardStats.totalResponses * 100)}%) | Não: ${dashboardStats.practices.no}/${dashboardStats.totalResponses}\n`)

  const printComparison = (title, allItems, realItems, synthItems) => {
    console.log(`─── ${title} ───`)
    console.log(`  ${'Item'.padEnd(28)} ${'Real (n=7)'.padStart(12)} ${'Sintético (n=73)'.padStart(18)} ${'Total (n=80)'.padStart(14)}`)
    const realMap = new Map(realItems.map((i) => [i.name, i.value]))
    const synthMap = new Map(synthItems.map((i) => [i.name, i.value]))

    allItems.forEach((item) => {
      const rVal = realMap.get(item.name) || 0
      const sVal = synthMap.get(item.name) || 0
      const tVal = item.value
      const pct = Math.round((tVal / dashboardStats.totalResponses) * 100)
      console.log(
        `  ${item.name.padEnd(28)} ${String(rVal).padStart(12)} ${String(sVal).padStart(18)} ${(String(tVal) + ' (' + pct + '%)').padStart(14)}`
      )
    })
    console.log('')
  }

  printComparison('Série', dashboardStats.grades, realStats.grades, syntheticStats.grades)
  printComparison('Curso / Itinerário', dashboardStats.courses, realStats.courses, syntheticStats.courses)
  printComparison('Gênero', dashboardStats.genders, realStats.genders, syntheticStats.genders)
  printComparison('Faixa Etária', dashboardStats.ageRanges, realStats.ageRanges, syntheticStats.ageRanges)
  printComparison('Frequência', dashboardStats.frequencies, realStats.frequencies, syntheticStats.frequencies)
  printComparison('Modalidades Praticadas', dashboardStats.practicedSports, realStats.practicedSports, syntheticStats.practicedSports)
  printComparison('Esporte Desejado', dashboardStats.desiredSports, realStats.desiredSports, syntheticStats.desiredSports)
  printComparison('Desejado na Escola', dashboardStats.desiredAtSchool, realStats.desiredAtSchool, syntheticStats.desiredAtSchool)
  printComparison('Barreiras', dashboardStats.barriers, realStats.barriers, syntheticStats.barriers)

  // 7. Salvar JSON
  const cleanResponses = allResponses.map((r) => {
    const { _synthetic, ...clean } = r
    return clean
  })

  const output = {
    exportedAt: new Date().toISOString(),
    description: '7 respostas reais coletadas pelo sistema + 73 registros sintéticos plausíveis criados para desenvolvimento e demonstração do MVP. Não representam estatisticamente a população real da escola.',
    surveyResponsesCount: cleanResponses.length,
    realResponseIds: realResponses.map((r) => r.id),
    surveyResponses: cleanResponses,
    dashboardStats,
  }

  writeFileSync(syntheticPath, JSON.stringify(output, null, 2), 'utf8')

  const sizeKB = (readFileSync(syntheticPath).length / 1024).toFixed(1)
  console.log(`\n✅ Base verificada e salva: scripts/backups/synthetic-80-responses.json (${sizeKB} KB)`)
  console.log('   Use upload-synthetic-data.js para enviar ao Firestore.\n')
}

main()
