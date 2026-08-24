import { useEffect, useState } from 'react'
import { ArrowRight, BarChart3, ClipboardList, Users } from 'lucide-react'
import { ChartCard } from '../components/ChartCard'
import { getDashboardStats } from '../services/survey'
import type { DashboardStats } from '../types'
import { demoStats } from '../data/demoStats'

export function Dashboard({ onSurvey }: { onSurvey: () => void }) {
  const [stats, setStats] = useState<DashboardStats>(demoStats)
  const [demo, setDemo] = useState(true)
  const [loading, setLoading] = useState(true)
  useEffect(() => { void getDashboardStats().then((result) => { setStats(result.stats); setDemo(result.isDemo); }).catch(() => setDemo(true)).finally(() => setLoading(false)) }, [])
  const percent = (number: number) => stats.totalResponses ? Math.round((number / stats.totalResponses) * 100) : 0
  return <main>
    <section className="hero">
      <div className="hero-copy"><p className="eyebrow">Tecnologia + esporte + comunidade</p><h1>Qual é o perfil esportivo da nossa escola?</h1><p className="lead">Uma pesquisa simples para entender interesses, hábitos e oportunidades de atividade física na ETE Chico Science.</p><button className="primary-button" onClick={onSurvey}>Participar da pesquisa <ArrowRight size={18} /></button></div>
      <div className="hero-illustration" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="ball"><span/></div><div className="spark spark-one">+</div><div className="spark spark-two">+</div></div>
    </section>
    <section className="dashboard-section" aria-labelledby="data-title">
      <div className="section-heading"><div><p className="eyebrow">Painel da pesquisa</p><h2 id="data-title">Visão geral</h2></div>{demo && <span className="demo-badge">Dados demonstrativos</span>}</div>
      {loading ? <p className="loading">Atualizando indicadores...</p> : <>
        <div className="stat-grid">
          <article className="stat-card"><span className="stat-icon teal"><Users size={21}/></span><div><p>Total de respostas</p><strong>{stats.totalResponses}</strong><small>Participações registradas</small></div></article>
          <article className="stat-card"><span className="stat-icon gold"><ActivityIcon /></span><div><p>Praticam esporte</p><strong>{percent(stats.practices.yes)}%</strong><small>{stats.practices.yes} estudantes</small></div></article>
          <article className="stat-card"><span className="stat-icon blue"><ClipboardList size={21}/></span><div><p>Não praticam</p><strong>{percent(stats.practices.no)}%</strong><small>{stats.practices.no} estudantes</small></div></article>
          <article className="stat-card"><span className="stat-icon coral"><BarChart3 size={21}/></span><div><p>Principal interesse</p><strong>{stats.desiredSports[0]?.name ?? '—'}</strong><small>{stats.desiredSports[0]?.value ?? 0} estudantes</small></div></article>
        </div>
        <div className="chart-grid">
          <ChartCard title="Modalidades praticadas" description="Atividades realizadas atualmente" data={stats.practicedSports} />
          <ChartCard title="Frequência de prática" description="Quantas vezes por semana praticam" data={stats.frequencies ?? []} />
          <ChartCard title="Interesses dos estudantes" description="Atividades que gostariam de praticar" data={stats.desiredSports} />
          <ChartCard title="Desejadas na escola" description="Modalidades para projetos e aulas" data={stats.desiredAtSchool ?? []} />
          <ChartCard title="Principais dificuldades" description="O que limita a prática de esportes" data={stats.barriers} />
          <section className="participation-card"><h2>Participação esportiva</h2><p>Proporção de estudantes que praticam atividade física atualmente.</p><div className="progress-track"><span style={{ width: `${percent(stats.practices.yes)}%` }} /></div><div className="legend"><span><i className="yes"/>Praticam <strong>{percent(stats.practices.yes)}%</strong></span><span><i className="no"/>Não praticam <strong>{percent(stats.practices.no)}%</strong></span></div><button onClick={onSurvey} className="text-button">Responder à pesquisa <ArrowRight size={16}/></button></section>
        </div>
      </>}
    </section>
  </main>
}

function ActivityIcon() { return <span className="activity-dot" aria-hidden="true"/> }
