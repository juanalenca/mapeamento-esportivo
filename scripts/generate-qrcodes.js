import QRCode from 'qrcode'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const links = [
  {
    name: 'qrcode-painel',
    title: 'Painel Geral - Início',
    url: 'https://mapeamento-esportivo.web.app/',
    description: 'Acesso direto ao painel com indicadores, gráficos e resultados em tempo real da EREM Santa Ana.',
  },
  {
    name: 'qrcode-pesquisa',
    title: 'Questionário Discente - Pesquisa',
    url: 'https://mapeamento-esportivo.web.app/#survey',
    description: 'Link direto para os estudantes responderem ao questionário esportivo de forma rápida e anônima.',
  },
  {
    name: 'qrcode-sobre',
    title: 'Sobre o Projeto - EREM Santa Ana',
    url: 'https://mapeamento-esportivo.web.app/#about',
    description: 'Informações sobre a iniciativa, privacidade, objetivos e comunidade escolar.',
  },
]

const publicDir = path.resolve(__dirname, '../public/qrcodes')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

const brainDir = 'C:\\Users\\SAD\\.gemini\\antigravity\\brain\\e3270c44-9b38-4576-8151-cfcebc0e8ade'

async function generate() {
  console.log('Gerando QR Codes para os links da aplicação...\n')

  for (const item of links) {
    const pngPathPublic = path.join(publicDir, `${item.name}.png`)
    const svgPathPublic = path.join(publicDir, `${item.name}.svg`)

    // Opções de estilização dos QR Codes com as cores da identidade visual (verde petróleo #0d7475)
    const options = {
      color: {
        dark: '#0d7475', // Cor primária da marca
        light: '#ffffff',
      },
      width: 600,
      margin: 2,
      errorCorrectionLevel: 'H', // Alta tolerância a erros (permite leitura perfeita mesmo impresso)
    }

    // 1. Gerar PNG
    await QRCode.toFile(pngPathPublic, item.url, options)
    // 2. Gerar SVG
    const svgString = await QRCode.toString(item.url, { ...options, type: 'svg' })
    fs.writeFileSync(svgPathPublic, svgString, 'utf-8')

    // Copiar para o diretório de artefatos da conversa se existir
    if (fs.existsSync(brainDir)) {
      const pngPathBrain = path.join(brainDir, `${item.name}.png`)
      const svgPathBrain = path.join(brainDir, `${item.name}.svg`)
      fs.copyFileSync(pngPathPublic, pngPathBrain)
      fs.copyFileSync(svgPathPublic, svgPathBrain)
    }

    console.log(`✓ ${item.title}`)
    console.log(`  URL: ${item.url}`)
    console.log(`  PNG: ${pngPathPublic}`)
    console.log(`  SVG: ${svgPathPublic}\n`)
  }

  console.log('Todos os QR Codes foram gerados com sucesso!')
}

generate().catch((err) => {
  console.error('Erro ao gerar QR Codes:', err)
  process.exit(1)
})
