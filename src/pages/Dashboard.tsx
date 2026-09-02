import { useEffect, useState } from 'react'
import { ArrowRight, BarChart3, ClipboardList, Users, Sparkles, Trophy, Clock, ShieldAlert } from 'lucide-react'
import { ChartCard } from '../components/ChartCard'
import { getDashboardStats } from '../services/survey'
import type { DashboardStats } from '../types'
import { demoStats } from '../data/demoStats'
import { emptyStats } from '../data/emptyStats'

export function Dashboard({ onSurvey }: { onSurvey: () => void }) {
  const [stats, setStats] = useState<DashboardStats>(emptyStats)
  const [demo, setDemo] = useState(true)
  const [empty, setEmpty] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void getDashboardStats()
      .then((result) => {
        setStats(result.stats)
        setDemo(result.isDemo)
        setEmpty(result.isEmpty)
      })
      .catch(() => {
        setDemo(true)
        setEmpty(false)
      })
      .finally(() => setLoading(false))
  }, [])

  const percent = (number: number) => stats.totalResponses ? Math.round((number / stats.totalResponses) * 100) : 0

  return <main>
    <section className="hero">
      <div className="hero-copy"><p className="eyebrow">Tecnologia + esporte + comunidade</p><h1>Qual é o perfil esportivo da nossa escola?</h1><p className="lead">Uma pesquisa simples para entender interesses, hábitos e oportunidades de atividade física na ETE Chico Science.</p><button className="primary-button" onClick={onSurvey}>Participar da pesquisa <ArrowRight size={18} /></button></div>
      <div className="hero-illustration" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="ball"><span/></div><div className="spark spark-one">+</div><div className="spark spark-two">+</div></div>
    </section>

    {loading ? (
      <section className="dashboard-section" aria-labelledby="data-title">
        <p className="loading">Atualizando indicadores...</p>
      </section>
    ) : empty ? (
      <section className="dashboard-section" aria-labelledby="data-title">
        <div className="empty-state">
          <div className="empty-state-icon">
            <Sparkles size={40} />
          </div>
          <h2 id="data-title">A pesquisa começou!</h2>
          <p className="empty-state-lead">
            Ainda não temos respostas registradas. Seja um dos primeiros a participar e ajude a revelar o perfil esportivo da nossa escola. <strong>Cada resposta conta!</strong>
          </p>
          <div className="empty-state-counter">
            <span className="empty-counter-number">0</span>
            <span className="empty-counter-label">respostas até agora</span>
          </div>
          <button className="primary-button empty-state-cta" onClick={onSurvey}>
            Participar agora <ArrowRight size={18} />
          </button>
          <div className="empty-state-preview">
            <p className="empty-preview-title">O que o painel vai revelar:</p>
            <div className="empty-preview-grid">
              <article className="empty-preview-card">
                <span className="empty-preview-icon teal"><Trophy size={20} /></span>
                <div>
                  <h3>Esportes favoritos</h3>
                  <p>As modalidades mais praticadas e desejadas pelos estudantes.</p>
                </div>
              </article>
              <article className="empty-preview-card">
                <span className="empty-preview-icon gold"><Clock size={20} /></span>
                <div>
                  <h3>Frequência de prática</h3>
                  <p>Com que regularidade os alunos praticam atividades físicas.</p>
                </div>
              </article>
              <article className="empty-preview-card">
                <span className="empty-preview-icon coral"><ShieldAlert size={20} /></span>
                <div>
                  <h3>Barreiras encontradas</h3>
                  <p>O que dificulta a prática esportiva na comunidade escolar.</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    ) : (
      <section className="dashboard-section" aria-labelledby="data-title">
        <div className="section-heading"><div><p className="eyebrow">Painel da pesquisa</p><h2 id="data-title">Visão geral</h2></div>{demo && <span className="demo-badge">Dados demonstrativos</span>}</div>
        <div className="stat-grid">
          <article className="stat-card"><span className="stat-icon teal"><Users size={21}/></span><div><p>Total de respostas</p><strong>{stats.totalResponses}</strong><small>Participações registradas</small></div></article>
          <article className="stat-card"><span className="stat-icon gold"><ActivityIcon /></span><div><p>Praticam esporte</p><strong>{percent(stats.practices.yes)}%</strong><small>{stats.practices.yes} estudantes</small></div></article>
          <article className="stat-card"><span className="stat-icon blue"><ClipboardList size={21}/></span><div><p>Não praticam</p><strong>{percent(stats.practices.no)}%</strong><small>{stats.practices.no} estudantes</small></div></article>
          <article className="stat-card"><span className="stat-icon coral"><BarChart3 size={21}/></span><div><p>Principal interesse</p><strong>{stats.desiredSports[0]?.name ?? '—'}</strong><small>{stats.desiredSports[0]?.value ?? 0} estudantes</small></div></article>
        </div>

        <div className="section-heading sub-heading"><div><p className="eyebrow">Perfil demográfico</p><h2>Quem são os participantes</h2></div></div>
        <div className="chart-grid">
          <ChartCard title="Distribuição por curso" description="Curso técnico dos participantes" data={stats.courses?.length ? stats.courses : (demoStats.courses ?? [])} />
          <ChartCard title="Distribuição por gênero" description="Gênero informado pelos participantes" data={stats.genders?.length ? stats.genders : (demoStats.genders ?? [])} />
          <ChartCard title="Distribuição por série" description="Série/turma dos participantes" data={stats.grades?.length ? stats.grades : (demoStats.grades ?? [])} />
          <ChartCard title="Distribuição por faixa etária" description="Faixa de idade dos participantes" data={stats.ageRanges?.length ? stats.ageRanges : (demoStats.ageRanges ?? [])} />
        </div>

        <div className="section-heading sub-heading"><div><p className="eyebrow">Hábitos e interesses</p><h2>Dados esportivos</h2></div></div>
        <div className="chart-grid">
          <ChartCard title="Modalidades praticadas" description="Atividades realizadas atualmente" data={stats.practicedSports?.length ? stats.practicedSports : demoStats.practicedSports} />
          <ChartCard title="Frequência de prática" description="Quantas vezes por semana praticam" data={stats.frequencies?.length ? stats.frequencies : (demoStats.frequencies ?? [])} />
          <ChartCard title="Interesses dos estudantes" description="Atividades que gostariam de praticar" data={stats.desiredSports?.length ? stats.desiredSports : demoStats.desiredSports} />
          <ChartCard title="Desejadas na escola" description="Modalidades para projetos e aulas" data={stats.desiredAtSchool?.length ? stats.desiredAtSchool : (demoStats.desiredAtSchool ?? [])} />
          <ChartCard title="Principais dificuldades" description="O que limita a prática de esportes" data={stats.barriers?.length ? stats.barriers : demoStats.barriers} />
          <section className="participation-card"><h2>Participação esportiva</h2><p>Proporção de estudantes que praticam atividade física atualmente.</p><div className="progress-track"><span style={{ width: `${percent(stats.practices.yes)}%` }} /></div><div className="legend"><span><i className="yes"/>Praticam <strong>{percent(stats.practices.yes)}%</strong></span><span><i className="no"/>Não praticam <strong>{percent(stats.practices.no)}%</strong></span></div><button onClick={onSurvey} className="text-button">Responder à pesquisa <ArrowRight size={16}/></button></section>
        </div>
      </section>
    )}
  </main>
}

function ActivityIcon() { return <span className="activity-dot" aria-hidden="true"/> }
