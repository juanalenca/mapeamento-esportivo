import { useEffect, useState } from 'react'
import {
  ArrowRight,
  ClipboardList,
  Users,
  Sparkles,
  Trophy,
  Clock,
  ShieldAlert,
  Activity,
  Award,
  Target,
  BarChart3,
} from 'lucide-react'
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

  const percent = (number: number) =>
    stats.totalResponses ? Math.round((number / stats.totalResponses) * 100) : 0

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Tecnologia + esporte + comunidade</p>
          <h1>Qual é o perfil esportivo da nossa escola?</h1>
          <p className="lead">
            Uma pesquisa simples para entender interesses, hábitos e oportunidades de atividade física
            no Colégio EREM Santa Ana.
          </p>
          <button className="primary-button" onClick={onSurvey}>
            Participar da pesquisa <ArrowRight size={18} />
          </button>
        </div>
        <div className="hero-illustration" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="ball">
            <span />
          </div>
          <div className="spark spark-one">+</div>
          <div className="spark spark-two">+</div>
        </div>
      </section>

      {loading ? (
        <section className="dashboard-section" aria-labelledby="data-title">
          <div className="loading-container">
            <div className="loading-spinner" />
            <p className="loading">Sincronizando indicadores do painel...</p>
          </div>
        </section>
      ) : empty ? (
        <section className="dashboard-section" aria-labelledby="data-title">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Sparkles size={40} />
            </div>
            <h2 id="data-title">A pesquisa começou!</h2>
            <p className="empty-state-lead">
              Ainda não temos respostas registradas. Seja um dos primeiros a participar e ajude a
              revelar o perfil esportivo da nossa escola. <strong>Cada resposta conta!</strong>
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
                  <span className="empty-preview-icon teal">
                    <Trophy size={20} />
                  </span>
                  <div>
                    <h3>Esportes favoritos</h3>
                    <p>As modalidades mais praticadas e desejadas pelos estudantes.</p>
                  </div>
                </article>
                <article className="empty-preview-card">
                  <span className="empty-preview-icon gold">
                    <Clock size={20} />
                  </span>
                  <div>
                    <h3>Frequência de prática</h3>
                    <p>Com que regularidade os alunos praticam atividades físicas.</p>
                  </div>
                </article>
                <article className="empty-preview-card">
                  <span className="empty-preview-icon coral">
                    <ShieldAlert size={20} />
                  </span>
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
          <div className="section-heading">
            <div>
              <p className="eyebrow">Painel de Indicadores</p>
              <h2 id="data-title">Visão Geral dos Resultados</h2>
            </div>
            {demo && <span className="demo-badge">Modo demonstrativo</span>}
          </div>

          <div className="stat-grid">
            <article className="stat-card stat-teal">
              <span className="stat-icon teal">
                <Users size={22} />
              </span>
              <div className="stat-body">
                <p>Total de Respostas</p>
                <strong>{stats.totalResponses}</strong>
                <small>Participações registradas</small>
              </div>
            </article>

            <article className="stat-card stat-gold">
              <span className="stat-icon gold">
                <Activity size={22} />
              </span>
              <div className="stat-body">
                <p>Praticam Atividade</p>
                <strong>{percent(stats.practices.yes)}%</strong>
                <small>{stats.practices.yes} estudantes ativos</small>
              </div>
            </article>

            <article className="stat-card stat-blue">
              <span className="stat-icon blue">
                <ClipboardList size={22} />
              </span>
              <div className="stat-body">
                <p>Não Praticam</p>
                <strong>{percent(stats.practices.no)}%</strong>
                <small>{stats.practices.no} estudantes sedentários</small>
              </div>
            </article>

            <article className="stat-card stat-coral">
              <span className="stat-icon coral">
                <Award size={22} />
              </span>
              <div className="stat-body">
                <p>Principal Interesse</p>
                <strong>{stats.desiredSports[0]?.name ?? '—'}</strong>
                <small>{stats.desiredSports[0]?.value ?? 0} estudantes desejam</small>
              </div>
            </article>
          </div>

          {/* Seção 1: Perfil Demográfico */}
          <div className="section-heading sub-heading">
            <div>
              <p className="eyebrow">Demografia Discente</p>
              <h2>Quem São os Participantes</h2>
            </div>
          </div>
          <div className="chart-grid">
            <ChartCard
              categoryBadge="Curso / Itinerário"
              title="Distribuição por curso / itinerário"
              description="Distribuição dos participantes por curso ou itinerário na EREM Santa Ana"
              data={stats.courses?.length ? stats.courses : (demoStats.courses ?? [])}
            />
            <ChartCard
              categoryBadge="Gênero"
              title="Distribuição por gênero"
              description="Identificação informada pelos participantes"
              data={stats.genders?.length ? stats.genders : (demoStats.genders ?? [])}
            />
            <ChartCard
              categoryBadge="Série"
              title="Distribuição por série"
              description="Ano letivo dos estudantes respondentes"
              data={stats.grades?.length ? stats.grades : (demoStats.grades ?? [])}
            />
            <ChartCard
              categoryBadge="Idade"
              title="Distribuição por faixa etária"
              description="Faixas de idade dos estudantes da escola"
              data={stats.ageRanges?.length ? stats.ageRanges : (demoStats.ageRanges ?? [])}
            />
          </div>

          {/* Seção 2: Hábitos e Interesses Esportivos */}
          <div className="section-heading sub-heading">
            <div>
              <p className="eyebrow">Diagnóstico Esportivo</p>
              <h2>Hábitos, Interesses e Demandas</h2>
            </div>
          </div>
          <div className="chart-grid">
            <ChartCard
              categoryBadge="Prática Atual"
              title="Modalidades mais praticadas"
              description="Atividades esportivas realizadas com frequência"
              data={stats.practicedSports?.length ? stats.practicedSports : demoStats.practicedSports}
            />
            <ChartCard
              categoryBadge="Regularidade"
              title="Frequência semanal de prática"
              description="Quantas vezes por semana praticam atividade"
              data={stats.frequencies?.length ? stats.frequencies : (demoStats.frequencies ?? [])}
            />
            <ChartCard
              categoryBadge="Interesse Pessoal"
              title="Atividades que gostariam de praticar"
              description="Modalidades de maior interesse para aprender"
              data={stats.desiredSports?.length ? stats.desiredSports : demoStats.desiredSports}
            />
            <ChartCard
              categoryBadge="Demanda Escolar"
              title="Modalidades desejadas na escola"
              description="Projetos e esportes para incentivo na EREM Santa Ana"
              data={stats.desiredAtSchool?.length ? stats.desiredAtSchool : (demoStats.desiredAtSchool ?? [])}
            />
            <ChartCard
              categoryBadge="Obstáculos"
              title="Principais dificuldades enfrentadas"
              description="O que mais limita os alunos de praticarem esportes"
              data={stats.barriers?.length ? stats.barriers : demoStats.barriers}
            />

            <section className="participation-card">
              <div className="participation-header">
                <span className="chart-category-badge">Taxa de Adesão</span>
                <h2>Participação Esportiva Geral</h2>
                <p>Proporção de estudantes ativos vs não praticantes na amostra.</p>
              </div>

              <div className="participation-visual">
                <div className="progress-track">
                  <span style={{ width: `${percent(stats.practices.yes)}%` }} />
                </div>
                <div className="legend">
                  <span className="legend-item">
                    <i className="yes" /> Praticam <strong>{percent(stats.practices.yes)}%</strong>
                  </span>
                  <span className="legend-item">
                    <i className="no" /> Não praticam <strong>{percent(stats.practices.no)}%</strong>
                  </span>
                </div>
              </div>

              <button onClick={onSurvey} className="primary-button participation-cta">
                Responder à pesquisa <ArrowRight size={16} />
              </button>
            </section>
          </div>
        </section>
      )}
    </main>
  )
}
