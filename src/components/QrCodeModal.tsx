import { useState } from 'react'
import { X, Download, Copy, Check, QrCode, ExternalLink } from 'lucide-react'

interface QrItem {
  id: string
  title: string
  subtitle: string
  url: string
  pngPath: string
  svgPath: string
  tag: string
}

const qrItems: QrItem[] = [
  {
    id: 'survey',
    title: 'Responder à Pesquisa',
    subtitle: 'Link direto para os estudantes da EREM Santa Ana responderem no celular.',
    url: 'https://mapeamento-esportivo.web.app/#survey',
    pngPath: '/qrcodes/qrcode-pesquisa.png',
    svgPath: '/qrcodes/qrcode-pesquisa.svg',
    tag: 'Principal',
  },
  {
    id: 'dashboard',
    title: 'Painel de Indicadores',
    subtitle: 'Acesso ao dashboard com estatísticas e gráficos em tempo real.',
    url: 'https://mapeamento-esportivo.web.app/#dashboard',
    pngPath: '/qrcodes/qrcode-painel.png',
    svgPath: '/qrcodes/qrcode-painel.svg',
    tag: 'Resultados',
  },
  {
    id: 'about',
    title: 'Sobre o Projeto',
    subtitle: 'Informações institucionais, metodologia e anonimato.',
    url: 'https://mapeamento-esportivo.web.app/#about',
    pngPath: '/qrcodes/qrcode-sobre.png',
    svgPath: '/qrcodes/qrcode-sobre.svg',
    tag: 'Institucional',
  },
]

export function QrCodeModal({ onClose }: { onClose: () => void }) {
  const [selectedId, setSelectedId] = useState<string>('survey')
  const [copied, setCopied] = useState(false)

  const activeItem = qrItems.find((item) => item.id === selectedId) || qrItems[0]

  const handleCopy = () => {
    navigator.clipboard.writeText(activeItem.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="qrcode-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <span className="modal-icon-badge">
              <QrCode size={22} />
            </span>
            <div>
              <h2>QR Codes da Aplicação</h2>
              <p>Escaneie ou baixe para divulgar na EREM Santa Ana</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Fechar modal">
            <X size={20} />
          </button>
        </div>

        {/* Abas dos links */}
        <div className="qrcode-tabs">
          {qrItems.map((item) => (
            <button
              key={item.id}
              className={`qrcode-tab-btn ${selectedId === item.id ? 'active' : ''}`}
              onClick={() => setSelectedId(item.id)}
            >
              <span className="tab-title">{item.title}</span>
              <span className="tab-tag">{item.tag}</span>
            </button>
          ))}
        </div>

        {/* Visualização do QR Code Ativo */}
        <div className="qrcode-display-card">
          <div className="qrcode-image-wrapper">
            <img
              src={activeItem.svgPath}
              alt={`QR Code para ${activeItem.title}`}
              className="qrcode-image"
              width={220}
              height={220}
            />
          </div>

          <div className="qrcode-details">
            <h3>{activeItem.title}</h3>
            <p className="qrcode-desc">{activeItem.subtitle}</p>

            <div className="url-chip-container">
              <span className="url-chip" title={activeItem.url}>
                {activeItem.url}
              </span>
              <button
                type="button"
                className="copy-button"
                onClick={handleCopy}
                title="Copiar endereço do link"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>

            <div className="qrcode-download-row">
              <a
                href={activeItem.pngPath}
                download={`${activeItem.id}-erem-santa-ana.png`}
                className="primary-button download-btn"
              >
                <Download size={16} /> Baixar PNG
              </a>
              <a
                href={activeItem.svgPath}
                download={`${activeItem.id}-erem-santa-ana.svg`}
                className="secondary-button download-btn"
              >
                <Download size={16} /> Baixar SVG (Vetor)
              </a>
              <a
                href={activeItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-button open-link-btn"
              >
                Abrir link <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="modal-footer-hint">
          <p>
            💡 <strong>Dica para professores e representantes:</strong> Projete o QR Code da Pesquisa no telão da sala ou imprima para afixar nos murais do colégio EREM Santa Ana.
          </p>
        </div>
      </div>
    </div>
  )
}
