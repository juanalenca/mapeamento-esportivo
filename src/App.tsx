import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Dashboard } from './pages/Dashboard'
import { Survey } from './pages/Survey'
import { About } from './pages/About'

type Page = 'dashboard' | 'survey' | 'about'
const validPages: Page[] = ['dashboard', 'survey', 'about']

export default function App() {
  const initial = window.location.hash.slice(1) as Page
  const [page, setPage] = useState<Page>(validPages.includes(initial) ? initial : 'dashboard')
  const navigate = (next: Page) => { window.location.hash = next; setPage(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  useEffect(() => { const listener = () => { const next = window.location.hash.slice(1) as Page; if (validPages.includes(next)) setPage(next) }; window.addEventListener('hashchange', listener); return () => window.removeEventListener('hashchange', listener) }, [])
  return <div className="app-shell"><Header page={page} onNavigate={navigate}/>{page === 'dashboard' && <Dashboard onSurvey={() => navigate('survey')}/>} {page === 'survey' && <Survey onBack={() => navigate('dashboard')}/>} {page === 'about' && <About onSurvey={() => navigate('survey')}/>}<Footer/></div>
}
