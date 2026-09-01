import { createRequire } from 'module'
import { readFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Resolve firebase-admin from functions/ workspace
const __dirname = dirname(fileURLToPath(import.meta.url))
const functionsDir = join(__dirname, '..', 'functions')
const require = createRequire(join(functionsDir, 'node_modules', '_'))

const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

const keyPath = join(__dirname, 'serviceAccountKey.json')

if (!existsSync(keyPath)) {
  console.error(
    '\n❌ Arquivo serviceAccountKey.json não encontrado em scripts/\n' +
    'Consulte as instruções em backup-firestore.js\n'
  )
  process.exit(1)
}

const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'))
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

function findLatestBackup() {
  const backupDir = join(__dirname, 'backups')
  if (!existsSync(backupDir)) return null
  const files = readdirSync(backupDir)
    .filter((f) => f.startsWith('backup-') && f.endsWith('.json'))
    .sort()
  return files.length ? join(backupDir, files[files.length - 1]) : null
}

async function restoreFirestore(backupFilePath) {
  if (!backupFilePath) {
    backupFilePath = findLatestBackup()
    if (!backupFilePath) {
      console.error('❌ Nenhum arquivo de backup encontrado em scripts/backups/')
      process.exit(1)
    }
    console.log(`📂 Usando backup mais recente: ${backupFilePath}\n`)
  } else {
    console.log(`📂 Restaurando de: ${backupFilePath}\n`)
  }

  if (!existsSync(backupFilePath)) {
    console.error(`❌ Arquivo não encontrado: ${backupFilePath}`)
    process.exit(1)
  }

  const data = JSON.parse(readFileSync(backupFilePath, 'utf8'))
  console.log(`   Backup de: ${data.exportedAt}`)
  console.log(`   Respostas: ${data.surveyResponsesCount}\n`)

  // Restaurar surveyResponses em batches
  if (data.surveyResponses?.length) {
    console.log('📝 Restaurando surveyResponses...')
    const batchSize = 500
    let written = 0

    for (let i = 0; i < data.surveyResponses.length; i += batchSize) {
      const batch = db.batch()
      const chunk = data.surveyResponses.slice(i, i + batchSize)

      chunk.forEach((doc) => {
        const { id, ...fields } = doc
        const ref = db.collection('surveyResponses').doc(id)
        batch.set(ref, fields)
      })

      await batch.commit()
      written += chunk.length
      console.log(`  → ${written}/${data.surveyResponses.length} documentos restaurados...`)
    }
    console.log('')
  }

  // Restaurar dashboardStats/current
  if (data.dashboardStats) {
    console.log('📊 Restaurando dashboardStats/current...')
    await db.collection('dashboardStats').doc('current').set(data.dashboardStats)
    console.log('   Documento restaurado.\n')
  } else {
    console.log('ℹ️  dashboardStats não encontrado no backup (ignorado).\n')
  }

  console.log('✅ Restauração concluída!\n')
}

const backupArg = process.argv[2] || null
restoreFirestore(backupArg).catch((err) => {
  console.error('❌ Erro na restauração:', err.message)
  process.exit(1)
})
