/**
 * upload-synthetic-data.js
 * 
 * Faz backup do Firestore atual, limpa as coleções e restaura os dados
 * do arquivo synthetic-80-responses.json (7 reais + 73 sintéticos).
 * 
 * Uso: node scripts/upload-synthetic-data.js
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { db } from './firebase-admin.js'
import { backupFirestore } from './backup-firestore.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function deleteCollection(collectionPath) {
  const snapshot = await db.collection(collectionPath).get()
  if (snapshot.empty) return 0

  const batchSize = 500
  let deleted = 0
  const docs = snapshot.docs

  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = db.batch()
    const chunk = docs.slice(i, i + batchSize)
    chunk.forEach((doc) => batch.delete(doc.ref))
    await batch.commit()
    deleted += chunk.length
  }

  return deleted
}

async function main() {
  const syntheticPath = join(__dirname, 'backups', 'synthetic-80-responses.json')

  if (!existsSync(syntheticPath)) {
    console.error('❌ Arquivo synthetic-80-responses.json não encontrado.')
    console.error('   Execute primeiro: node scripts/generate-synthetic-data.js')
    process.exit(1)
  }

  const data = JSON.parse(readFileSync(syntheticPath, 'utf8'))
  console.log(`\n📂 Carregado: synthetic-80-responses.json`)
  console.log(`   ${data.surveyResponsesCount} respostas (${data.realResponseIds.length} reais + ${data.surveyResponsesCount - data.realResponseIds.length} sintéticas)`)
  console.log(`   Gerado em: ${data.exportedAt}\n`)

  // 1. Backup de segurança obrigatório antes de qualquer operação
  console.log('📦 Realizando backup de segurança prévio do Firestore...')
  try {
    const backupPath = await backupFirestore()
    console.log(`   ✅ Backup de segurança confirmado: ${backupPath}\n`)
  } catch (err) {
    console.error(`\n❌ ERRO CRÍTICO: Falha ao gerar backup prévio (${err.message}).`)
    console.error('   Operação cancelada para proteger os dados existentes.')
    process.exit(1)
  }

  // 2. Limpar Firestore
  console.log('\n🧹 Limpando coleção surveyResponses...')
  const deletedResponses = await deleteCollection('surveyResponses')
  console.log(`   ${deletedResponses} documentos removidos`)

  console.log('🧹 Removendo dashboardStats/current...')
  await db.collection('dashboardStats').doc('current').delete()
  console.log('   Documento removido\n')

  // 3. Inserir novos dados
  console.log('📝 Inserindo surveyResponses...')
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
    console.log(`   → ${written}/${data.surveyResponses.length} documentos inseridos`)
  }

  // 4. Inserir dashboardStats
  console.log('\n📊 Gravando dashboardStats/current...')
  await db.collection('dashboardStats').doc('current').set(data.dashboardStats)
  console.log('   Documento gravado com sucesso')

  // 5. Verificação final
  console.log('\n🔍 Verificação final...')
  const finalSnap = await db.collection('surveyResponses').get()
  const finalStats = await db.collection('dashboardStats').doc('current').get()

  console.log(`   surveyResponses: ${finalSnap.size} documentos`)
  console.log(`   dashboardStats.totalResponses: ${finalStats.data()?.totalResponses}`)

  // Verificar se os 7 IDs reais existem
  const realIds = data.realResponseIds
  let realFound = 0
  for (const id of realIds) {
    const doc = await db.collection('surveyResponses').doc(id).get()
    if (doc.exists) realFound++
  }
  console.log(`   Respostas reais preservadas: ${realFound}/${realIds.length}`)

  if (finalSnap.size === data.surveyResponsesCount && realFound === realIds.length) {
    console.log('\n✅ Upload concluído com sucesso! Todos os dados verificados.\n')
  } else {
    console.error('\n⚠️  Divergência detectada. Verifique manualmente.\n')
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
