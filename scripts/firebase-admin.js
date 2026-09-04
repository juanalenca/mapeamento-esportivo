/**
 * firebase-admin.js
 * 
 * Inicializador singleton do Firebase Admin SDK.
 * Garante que initializeApp seja chamado apenas uma vez e reusa a instância
 * caso múltiplos scripts sejam importados no mesmo processo Node.js.
 */

import { createRequire } from 'module'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const functionsDir = join(__dirname, '..', 'functions')
const require = createRequire(join(functionsDir, 'node_modules', '_'))

const { initializeApp, getApps, cert } = require('firebase-admin/app')
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

const app = getApps().length === 0
  ? initializeApp({ credential: cert(serviceAccount) })
  : getApps()[0]

export const db = getFirestore(app)
export { app }
