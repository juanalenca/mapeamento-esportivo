import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { db } from './firebase-admin.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function backupFirestore() {
  console.log('📦 Iniciando backup do Firestore...\n')

  // Backup surveyResponses
  const responsesSnap = await db.collection('surveyResponses').get()
  const surveyResponses = []
  responsesSnap.forEach((doc) => {
    surveyResponses.push({ id: doc.id, ...doc.data() })
  })
  console.log(`  → ${surveyResponses.length} documentos em surveyResponses`)

  // Backup dashboardStats/current
  const statsSnap = await db.collection('dashboardStats').doc('current').get()
  const dashboardStats = statsSnap.exists ? statsSnap.data() : null
  console.log(`  → dashboardStats/current: ${dashboardStats ? 'encontrado' : 'não existe'}`)

  // Salvar arquivo
  const backupDir = join(__dirname, 'backups')
  if (!existsSync(backupDir)) mkdirSync(backupDir, { recursive: true })

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `backup-${timestamp}.json`
  const filepath = join(backupDir, filename)

  const payload = {
    exportedAt: new Date().toISOString(),
    surveyResponsesCount: surveyResponses.length,
    surveyResponses,
    dashboardStats,
  }

  writeFileSync(filepath, JSON.stringify(payload, null, 2), 'utf8')
  console.log(`\n✅ Backup salvo em: scripts/backups/${filename}`)
  console.log(`   Tamanho: ${(readFileSync(filepath).length / 1024).toFixed(1)} KB\n`)

  return filepath
}

// Executar diretamente
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url).includes(process.argv[1].replace(/\\/g, '/'))
if (isDirectRun || process.argv[1] === fileURLToPath(import.meta.url)) {
  backupFirestore().catch((err) => {
    console.error('❌ Erro no backup:', err.message)
    process.exit(1)
  })
}
