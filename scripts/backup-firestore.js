import { createRequire } from 'module'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
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
    'Para obtê-lo:\n' +
    '  1. Acesse https://console.firebase.google.com\n' +
    '  2. Selecione o projeto "mapeamento-esportivo"\n' +
    '  3. Configurações > Contas de serviço > Gerar nova chave privada\n' +
    '  4. Salve o arquivo como scripts/serviceAccountKey.json\n'
  )
  process.exit(1)
}

const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'))

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

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
