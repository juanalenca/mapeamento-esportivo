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
  RefreshCw,
} from 'lucide-react'
import { ChartCard } from '../components/ChartCard'
import { getDashboardStats, subscribeToDashboardStats } from '../services/survey'
import type { DashboardStats } from '../types'
import { demoStats } from '../data/demoStats'
import { emptyStats } from '../data/emptyStats'

function formatActivityTime(isoString: string) {
  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) {
      return { time: '--:--', date: '--/--/----', relative: '' }
    }
    const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    
    const diffSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))
    let relative = ''
    if (diffSeconds < 60) {
      relative = 'agora mesmo'
    } else if (diffSeconds < 3600) {
      const mins = Math.floor(diffSeconds / 60)
      relative = `há ${mins} ${mins === 1 ? 'min' : 'min'}`
    } else if (diffSeconds < 86400) {
      const hours = Math.floor(diffSeconds / 3600)
      relative = `há ${hours} ${hours === 1 ? 'h' : 'h'}`
    } else {
      const days = Math.floor(diffSeconds / 86400)
      relative = `há ${days} ${days === 1 ? 'd' : 'd'}`
    }
    return { time, date: dateStr, relative }
  } catch {
    return { time: '--:--', date: '--/--/----', relative: '' }
  }
}

export function Dashboard({ onSurvey }: { onSurvey: () => void }) {
  const [stats, setStats] = useState<DashboardStats>(emptyStats)
  const [demo, setDemo] = useState(true)
  const [empty, setEmpty] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const handleManualRefresh = () => {
    setRefreshing(true)
    getDashboardStats()
      .then((result) => {
        setStats(result.stats)
        setDemo(result.isDemo)
        setEmpty(result.isEmpty)
      })
      .catch(() => {
        setDemo(true)
      })
      .finally(() => {
        setRefreshing(false)
      })
  }

  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeToDashboardStats(
      (result) => {
        setStats(result.stats)
        setDemo(result.isDemo)
        setEmpty(result.isEmpty)
        setLoading(false)
        setRefreshing(false)
      },
      () => {
        setDemo(true)
        setEmpty(false)
        setLoading(false)
        setRefreshing(false)
      },
    )

    return () => {
      unsubscribe()
    }
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
            <div className="heading-actions">
              <div className="live-status-pill" title="Sincronização contínua em tempo real ativada">
                <span className="live-dot" />
                <span>Ao vivo</span>
              </div>
              {demo && <span className="demo-badge">Modo demonstrativo</span>}
              <button
                type="button"
                className="refresh-button"
                onClick={handleManualRefresh}
                disabled={refreshing}
                title="Sincronizar indicadores com o banco de dados"
                aria-label="Atualizar dados do painel"
              >
                <RefreshCw size={14} className={refreshing ? 'spinning-icon' : ''} />
                <span>{refreshing ? 'Atualizando...' : 'Atualizar dados'}</span>
              </button>
            </div>
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
                <small>{stats.practices.no} estudantes sem prática regular</small>
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

          {/* Feed de Atividades Recentes em Tempo Real */}
          <section className="recent-activity-card" aria-labelledby="recent-activity-title">
            <div className="activity-card-header">
              <div className="activity-card-title-group">
                <span className="chart-category-badge">Tempo Real</span>
                <h3 id="recent-activity-title">Últimas Participações Registradas</h3>
                <p>Acompanhamento instantâneo dos envios por série escolar, data e horário</p>
              </div>
              <div className="activity-pulse-indicator" title="Sincronização em tempo real ativa">
                <span className="live-dot" />
                <span className="pulse-text">Em tempo real</span>
              </div>
            </div>

            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              <ul className="activity-feed-list" role="list">
                {stats.recentActivity.map((item, index) => {
                  const { time, date, relative } = formatActivityTime(item.timestamp)
                  return (
                    <li key={`${item.timestamp}-${index}`} className="activity-feed-item">
                      <div className="activity-item-main">
                        <span className={`activity-grade-badge grade-${item.grade.toLowerCase().replace(/[^a-z0-9]/g, '')}`}>
                          {item.grade}
                        </span>
                        <div className="activity-item-details">
                          <p className="activity-item-title">
                            O(A) estudante do <strong>{item.grade}</strong> respondeu à pesquisa
                          </p>
                          <p className="activity-item-timestamp">
                            <Clock size={13} aria-hidden="true" />
                            <span>Às {time} — {date}</span>
                          </p>
                        </div>
                      </div>
                      {relative && (
                        <span className="activity-relative-badge" title={item.timestamp}>
                          {relative}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="activity-empty-state">
                <Clock size={20} className="activity-empty-icon" />
                <p>Aguardando novas participações no formulário. Os envios serão exibidos aqui instantaneamente.</p>
              </div>
            )}
          </section>


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
