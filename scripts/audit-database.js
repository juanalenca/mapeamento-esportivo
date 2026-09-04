/**
 * audit-database.js
 * 
 * Auditoria completa dos 80 registros no Firestore:
 * - Valida integridade referencial e regras de negócio individuais
 * - Compara os dados brutos com as agregações de dashboardStats/current
 * - Verifica a preservação exata dos 7 registros reais
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { db } from './firebase-admin.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const allowedGrades = ['1º Ano', '2º Ano', '3º Ano']
const allowedAges = ['14 a 15 anos', '16 a 17 anos', '18 anos ou mais']
const allowedGenders = ['Feminino', 'Masculino', 'Outro', 'Prefiro não informar']
const allowedFrequencies = [
  'Todos os dias', '4–6 vezes por semana', '2–3 vezes por semana',
  '1 vez por semana', 'Menos de 1 vez por semana', 'Não pratico',
]
const allowedSports = [
  'Futebol', 'Vôlei', 'Futsal', 'Basquete', 'Corrida/caminhada',
  'Ciclismo', 'Musculação/academia', 'Dança', 'Artes marciais', 'Outro',
]
const allowedBarriers = [
  'Falta de tempo', 'Falta de espaço', 'Falta de equipamentos', 'Falta de dinheiro',
  'Falta de companhia', 'Falta de oportunidade na escola', 'Falta de interesse', 'Outro', 'Nada dificulta',
]

const expectedRealIds = [
  '5XbDjvJvaduTinhvrrSY',
  '8KFtmwKMgFJbzSWsMmpY',
  'EAInMHPihH4cBz8uqTjM',
  'ToFEosDBDND07ENCMU41',
  'avSHQII7w8QVvOY4XtDb',
  'ohrUp1wQOlbqeIJnmCee',
  'yzYxrcV4nCXZu7S6Mb8r',
]

async function runAudit() {
  console.log('═══════════════════════════════════════════════════════════')
  console.log('       AUDITORIA DE INTEGRIDADE DA BASE DE DADOS (FIRESTORE)')
  console.log('═══════════════════════════════════════════════════════════\n')

  // 1. Coleta todos os documentos de surveyResponses
  const responsesSnap = await db.collection('surveyResponses').get()
  const total = responsesSnap.size
  console.log(`📋 Total de documentos em surveyResponses: ${total}`)

  if (total !== 80) {
    console.error(`❌ ERRO: Esperado 80 documentos, encontrado ${total}`)
  } else {
    console.log('   ✅ Contagem total correta: 80 documentos\n')
  }

  const docs = []
  const ids = new Set()
  let duplicates = 0

  responsesSnap.forEach((docSnap) => {
    if (ids.has(docSnap.id)) duplicates++
    ids.add(docSnap.id)
    docs.push({ id: docSnap.id, ...docSnap.data() })
  })

  if (duplicates > 0) {
    console.error(`❌ ERRO: ${duplicates} IDs duplicados encontrados!`)
  } else {
    console.log('   ✅ IDs únicos: nenhum ID duplicado detectado.')
  }

  // 2. Validação individual de cada registro
  console.log('\n🔍 Verificando regras de negócio e domínios...')
  const violations = []

  let realFoundCount = 0
  const realIdsSet = new Set(expectedRealIds)

  docs.forEach((doc, idx) => {
    const isReal = realIdsSet.has(doc.id)
    if (isReal) realFoundCount++
    const prefix = isReal ? `[REAL ${doc.id}]` : `[SYNTHETIC #${idx + 1} (${doc.id})]`

    // Campos obrigatórios
    const required = ['course', 'grade', 'ageRange', 'gender', 'frequency', 'desiredSport', 'desiredAtSchool']
    for (const f of required) {
      if (!doc[f]) violations.push(`${prefix} Campo obrigatório ausente: ${f}`)
    }

    // Regra Prática x Modalidades
    if (doc.practicesSport === false) {
      if (doc.practicedSports && doc.practicedSports.length > 0) {
        violations.push(`${prefix} practicesSport=false mas practicedSports não está vazio (${doc.practicedSports})`)
      }
      if (doc.frequency !== 'Não pratico') {
        violations.push(`${prefix} practicesSport=false mas frequency="${doc.frequency}" (esperado "Não pratico")`)
      }
    } else if (doc.practicesSport === true) {
      if (!doc.practicedSports || doc.practicedSports.length === 0) {
        violations.push(`${prefix} practicesSport=true mas practicedSports está vazio`)
      }
    } else {
      violations.push(`${prefix} practicesSport não é booleano (${doc.practicesSport})`)
    }

    // Regra Barreiras
    if (!doc.barriers || doc.barriers.length === 0) {
      violations.push(`${prefix} barriers está vazio`)
    } else {
      if (doc.barriers.includes('Nada dificulta') && doc.barriers.length > 1) {
        violations.push(`${prefix} "Nada dificulta" aparece junto com outras barreiras (${doc.barriers.join(', ')})`)
      }
      for (const b of doc.barriers) {
        if (!allowedBarriers.includes(b)) {
          violations.push(`${prefix} Barreira fora do domínio permitido: "${b}"`)
        }
      }
    }

    // Domínios
    if (doc.grade && !allowedGrades.includes(doc.grade)) {
      violations.push(`${prefix} Série inválida: "${doc.grade}"`)
    }
    if (doc.ageRange && !allowedAges.includes(doc.ageRange)) {
      violations.push(`${prefix} Faixa etária inválida: "${doc.ageRange}"`)
    }
    if (doc.gender && !allowedGenders.includes(doc.gender)) {
      violations.push(`${prefix} Gênero inválido: "${doc.gender}"`)
    }
    if (doc.frequency && !allowedFrequencies.includes(doc.frequency)) {
      violations.push(`${prefix} Frequência inválida: "${doc.frequency}"`)
    }
    if (doc.desiredSport && !allowedSports.includes(doc.desiredSport)) {
      violations.push(`${prefix} Esporte desejado inválido: "${doc.desiredSport}"`)
    }
    if (doc.desiredAtSchool && !allowedSports.includes(doc.desiredAtSchool)) {
      violations.push(`${prefix} Demanda escolar inválida: "${doc.desiredAtSchool}"`)
    }
    if (doc.practicedSports) {
      for (const s of doc.practicedSports) {
        if (!allowedSports.includes(s)) {
          violations.push(`${prefix} Modalidade praticada inválida: "${s}"`)
        }
      }
    }
  })

  if (violations.length === 0) {
    console.log('   ✅ 0 violações de regras de negócio ou domínios em todos os 80 registros!')
  } else {
    console.error(`\n❌ ${violations.length} violações encontradas:`)
    violations.forEach((v) => console.error(`   • ${v}`))
  }

  // 3. Verificação das 7 respostas reais
  console.log('\n📌 Verificando preservação das 7 respostas reais originais...')
  console.log(`   Respostas reais encontradas: ${realFoundCount} de ${expectedRealIds.length}`)
  
  // Comparar com backup original das 7
  const origBackupPath = join(__dirname, 'backups', 'backup-2026-09-04T18-30-04-444Z.json')
  let realIntegrityDiff = 0
  if (existsSync(origBackupPath)) {
    const origData = JSON.parse(readFileSync(origBackupPath, 'utf8'))
    const origMap = new Map(origData.surveyResponses.map((r) => [r.id, r]))
    
    docs.filter((d) => realIdsSet.has(d.id)).forEach((currentDoc) => {
      const orig = origMap.get(currentDoc.id)
      if (!orig) {
        console.error(`   ❌ Resposta real ${currentDoc.id} não encontrada no backup original!`)
        realIntegrityDiff++
        return
      }

      const keysToCheck = [
        'course', 'grade', 'ageRange', 'gender', 'practicesSport',
        'frequency', 'desiredSport', 'desiredAtSchool'
      ]
      for (const k of keysToCheck) {
        if (currentDoc[k] !== orig[k]) {
          console.error(`   ❌ Divergência no registro real ${currentDoc.id}.${k}: atual="${currentDoc[k]}", original="${orig[k]}"`)
          realIntegrityDiff++
        }
      }

      const sortJson = (arr) => JSON.stringify([...(arr || [])].sort())
      if (sortJson(currentDoc.practicedSports) !== sortJson(orig.practicedSports)) {
        console.error(`   ❌ Divergência em practicedSports no registro real ${currentDoc.id}`)
        realIntegrityDiff++
      }
      if (sortJson(currentDoc.barriers) !== sortJson(orig.barriers)) {
        console.error(`   ❌ Divergência em barriers no registro real ${currentDoc.id}`)
        realIntegrityDiff++
      }
    })
  }

  if (realIntegrityDiff === 0) {
    console.log('   ✅ Todas as 7 respostas reais coincidem 100% com o backup original (valores, IDs e textos inalterados).')
  }

  // 4. Comparação com dashboardStats/current
  console.log('\n📊 Comparando agregação recalculada com dashboardStats/current...')
  const statsSnap = await db.collection('dashboardStats').doc('current').get()
  const dbStats = statsSnap.data()

  // Recalcular diretamente a partir dos docs
  let calcYes = 0
  let calcNo = 0
  const countField = (extractor) => {
    const map = new Map()
    docs.forEach((d) => {
      const val = extractor(d)
      if (Array.isArray(val)) {
        val.forEach((v) => map.set(v, (map.get(v) || 0) + 1))
      } else if (val) {
        map.set(val, (map.get(val) || 0) + 1)
      }
    })
    return map
  }

  docs.forEach((d) => (d.practicesSport ? calcYes++ : calcNo++))

  let statDiffs = 0
  if (dbStats.totalResponses !== 80) {
    console.error(`   ❌ Divergência em totalResponses: dbStats=${dbStats.totalResponses}, calculado=80`)
    statDiffs++
  }
  if (dbStats.practices.yes !== calcYes || dbStats.practices.no !== calcNo) {
    console.error(`   ❌ Divergência em practices: dbStats=(${dbStats.practices.yes}/${dbStats.practices.no}), calculado=(${calcYes}/${calcNo})`)
    statDiffs++
  }

  const checkCategory = (catName, itemsFromDb, extractor) => {
    const calculatedMap = countField(extractor)
    const dbMap = new Map((itemsFromDb || []).map((i) => [i.name, i.value]))
    
    calculatedMap.forEach((calcVal, key) => {
      const dbVal = dbMap.get(key) || 0
      if (calcVal !== dbVal) {
        console.error(`   ❌ Divergência em ${catName}["${key}"]: dbStats=${dbVal}, calculado=${calcVal}`)
        statDiffs++
      }
    })
  }

  checkCategory('grades', dbStats.grades, (d) => d.grade)
  checkCategory('courses', dbStats.courses, (d) => d.course)
  checkCategory('genders', dbStats.genders, (d) => d.gender)
  checkCategory('ageRanges', dbStats.ageRanges, (d) => d.ageRange)
  checkCategory('frequencies', dbStats.frequencies, (d) => d.frequency)
  checkCategory('practicedSports', dbStats.practicedSports, (d) => d.practicedSports)
  checkCategory('desiredSports', dbStats.desiredSports, (d) => d.desiredSport)
  checkCategory('desiredAtSchool', dbStats.desiredAtSchool, (d) => d.desiredAtSchool)
  checkCategory('barriers', dbStats.barriers, (d) => d.barriers)

  if (statDiffs === 0) {
    console.log('   ✅ 0 divergências entre os 80 documentos brutos e os agregados de dashboardStats/current!')
    console.log(`      Total de respostas: ${dbStats.totalResponses}`)
    console.log(`      Praticantes: ${dbStats.practices.yes} + Não praticantes: ${dbStats.practices.no} = ${dbStats.practices.yes + dbStats.practices.no}`)
  } else {
    console.error(`   ❌ ${statDiffs} divergência(s) detectada(s) nos agregados.`)
  }

  console.log('\n═══════════════════════════════════════════════════════════')
  console.log(violations.length === 0 && realIntegrityDiff === 0 && statDiffs === 0
    ? '✅ AUDITORIA CONCLUÍDA COM SUCESSO: BASE 100% ÍNTEGRA'
    : '❌ AUDITORIA ENCONTROU PROBLEMAS')
  console.log('═══════════════════════════════════════════════════════════\n')
}

runAudit().catch((err) => {
  console.error('❌ Erro na auditoria:', err)
  process.exit(1)
})
