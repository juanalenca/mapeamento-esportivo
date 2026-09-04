import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { backupFirestore } from './backup-firestore.js'
import { db } from './firebase-admin.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function deleteBatch(collectionRef, batchSize = 500) {
  let totalDeleted = 0
  let snapshot = await collectionRef.limit(batchSize).get()

  while (!snapshot.empty) {
    const batch = db.batch()
    snapshot.docs.forEach((doc) => batch.delete(doc.ref))
    await batch.commit()
    totalDeleted += snapshot.size
    console.log(`  → ${totalDeleted} documentos deletados...`)
    snapshot = await collectionRef.limit(batchSize).get()
  }

  return totalDeleted
}

async function wipeFirestore() {
  console.log('🔒 Etapa 1: Backup automático antes de apagar\n')
  const backupPath = await backupFirestore()
  console.log(`   Backup salvo em: ${backupPath}\n`)

  console.log('🗑️  Etapa 2: Deletando surveyResponses...')
  const deleted = await deleteBatch(db.collection('surveyResponses'))
  console.log(`   Total: ${deleted} documentos removidos.\n`)

  console.log('🗑️  Etapa 3: Deletando dashboardStats/current...')
  const statsRef = db.collection('dashboardStats').doc('current')
  const statsSnap = await statsRef.get()
  if (statsSnap.exists) {
    await statsRef.delete()
    console.log('   Documento removido.\n')
  } else {
    console.log('   Documento já não existia.\n')
  }

  console.log('✅ Firestore zerado com sucesso!')
  console.log(`   Para restaurar: node scripts/restore-firestore.js\n`)
}

wipeFirestore().catch((err) => {
  console.error('❌ Erro ao limpar:', err.message)
  process.exit(1)
})
