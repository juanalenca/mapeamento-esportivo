import { Activity, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface HeaderProps {
  page: string
  onNavigate: (page: 'dashboard' | 'survey' | 'about') => void
}

export function Header({ page, onNavigate }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const navigate = (target: 'dashboard' | 'survey' | 'about') => {
    onNavigate(target)
    setOpen(false)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <header className="header">
        <button className="brand" onClick={() => navigate('dashboard')} aria-label="Ir para página inicial">
          <span className="brand-icon">
            <Activity size={20} aria-hidden="true" />
          </span>
          <span>
            Mapa <strong>Esportivo</strong>
          </span>
        </button>
        <button
          className="menu-button"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        <nav className={open ? 'navigation open' : 'navigation'} aria-label="Navegação principal">
          <button className={page === 'dashboard' ? 'active' : ''} onClick={() => navigate('dashboard')}>
            Painel
          </button>
          <button className={page === 'survey' ? 'active' : ''} onClick={() => navigate('survey')}>
            Pesquisa
          </button>
          <button className={page === 'about' ? 'active' : ''} onClick={() => navigate('about')}>
            Sobre
          </button>
        </nav>
      </header>
      {open && <div className="nav-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />}
    </>
  )
}
