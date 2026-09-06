import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Sparkles,
  Trophy,
  Clock,
  ShieldAlert,
  RefreshCw,
} from 'lucide-react'
import { ChartCard } from '../components/ChartCard'
import { FrequencyCard } from '../components/FrequencyCard'
import { ObstaclesCard } from '../components/ObstaclesCard'
import { InterestsDemandsComparison } from '../components/InterestsDemandsComparison'
import { ParticipationConclusion } from '../components/ParticipationConclusion'
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
      relative = `há ${mins} min`
    } else if (diffSeconds < 86400) {
      const hours = Math.floor(diffSeconds / 3600)
      relative = `há ${hours} h`
    } else if (diffSeconds < 172800) {
      relative = 'ontem'
    } else {
      const days = Math.floor(diffSeconds / 86400)
      relative = `há ${days} d`
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
              <h2 id="data-title">Visão geral dos resultados</h2>
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

          {/* Painel Unificado de Visão Geral */}
          <section className="overview-story-card" aria-labelledby="data-title">
            <div className="overview-story-top">
              {/* 1. Participações (Elemento Principal) */}
              <div className="overview-stat-col col-main">
                <span className="overview-col-label">Participações</span>
                <div className="overview-metric-wrap">
                  <span className="overview-hero-number">{stats.totalResponses}</span>
                  <span className="overview-hero-text">respostas registradas</span>
                </div>
              </div>

              {/* 2. Prática de Atividade Física (Secundário) */}
              <div className="overview-stat-col col-practice">
                <span className="overview-col-label">Prática de atividade física</span>
                <div className="overview-metric-wrap">
                  <span className="overview-secondary-number">{percent(stats.practices.yes)}%</span>
                  <span className="overview-secondary-text">praticam regularmente</span>
                </div>
              </div>

              {/* 3. Descoberta Qualitativa (Principal Interesse) */}
              <div className="overview-stat-col col-interest">
                <div className="overview-interest-header">
                  <span className="overview-col-label">Interesse mais citado</span>
                  <span className="overview-rank-pill">1º mais citado</span>
                </div>
                <div className="overview-metric-wrap">
                  <span className="overview-discovery-name">{stats.desiredSports[0]?.name ?? '—'}</span>
                  <span className="overview-discovery-text">interesse mais citado</span>
                </div>
              </div>
            </div>

            <div className="overview-story-divider" aria-hidden="true" />

            <div className="overview-story-bottom">
              <div className="overview-bottom-col">
                <span className="overview-bottom-count">
                  <strong>{stats.practices.yes}</strong> estudantes
                </span>
                <span className="overview-bottom-label">praticam atividade física</span>
              </div>
              <div className="overview-bottom-col">
                <span className="overview-bottom-count">
                  <strong>{stats.practices.no}</strong> estudantes
                </span>
                <span className="overview-bottom-label">sem prática regular ({percent(stats.practices.no)}%)</span>
              </div>
              <div className="overview-bottom-col">
                <span className="overview-bottom-count">
                  <strong>{stats.desiredSports[0]?.value ?? 0}</strong> estudantes
                </span>
                <span className="overview-bottom-label">demonstraram interesse</span>
              </div>
            </div>
          </section>

          {/* Feed de Atividades Recentes em Tempo Real */}
          <section className="recent-activity-card" aria-labelledby="recent-activity-title">
            <div className="activity-card-header">
              <div className="activity-card-title-group">
                <h3 id="recent-activity-title">Últimas participações</h3>
                <p>Envios mais recentes da pesquisa</p>
              </div>
              <div className="activity-live-badge" title="Sincronização em tempo real ativa">
                <span className="live-dot" />
                <span>Ao vivo</span>
              </div>
            </div>

            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              <ul className="activity-feed-list" role="list">
                {stats.recentActivity.map((item, index) => {
                  const { time, date, relative } = formatActivityTime(item.timestamp)
                  const gradeClass = `grade-${item.grade.toLowerCase().replace(/[^a-z0-9]/g, '')}`
                  return (
                    <li key={`${item.timestamp}-${index}`} className="activity-feed-item">
                      <div className="activity-item-left">
                        <span className={`activity-bullet ${gradeClass}`} aria-hidden="true" />
                        <div className="activity-item-info">
                          <strong className="activity-grade-name">{item.grade}</strong>
                          <span className="activity-timestamp">{time} · {date}</span>
                        </div>
                      </div>
                      <div className="activity-item-right">
                        <span className="activity-action-label">Pesquisa respondida</span>
                        {relative && (
                          <span className="activity-relative-badge" title={item.timestamp}>
                            {relative}
                          </span>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="activity-empty-state">
                <Clock size={18} className="activity-empty-icon" />
                <p>Aguardando novos envios no formulário em tempo real.</p>
              </div>
            )}
          </section>


          {/* Seção 1: Perfil Demográfico */}
          <div className="section-heading sub-heading">
            <div>
              <p className="eyebrow">Demografia Discente</p>
              <h2>Quem são os participantes</h2>
              <p className="section-subtitle">
                <strong>{stats.totalResponses}</strong> estudantes responderam à pesquisa.
              </p>
            </div>
          </div>
          <div className="chart-grid">
            <ChartCard
              categoryBadge="Curso / Itinerário"
              title="Distribuição por curso / itinerário"
              description="Distribuição dos participantes por curso ou itinerário na EREM Santa Ana"
              data={stats.courses?.length ? stats.courses : (demoStats.courses ?? [])}
              hideTotalBadge={true}
              singleColorWithHighlight={true}
              cleanGrid={true}
              showValueLabels={true}
            />
            <ChartCard
              categoryBadge="Gênero"
              title="Distribuição por gênero"
              description="Identificação informada pelos participantes"
              data={stats.genders?.length ? stats.genders : (demoStats.genders ?? [])}
              hideTotalBadge={true}
              singleColorWithHighlight={true}
              cleanGrid={true}
              showValueLabels={true}
            />
            <ChartCard
              categoryBadge="Série"
              title="Distribuição por série"
              description="Ano letivo dos estudantes respondentes"
              data={stats.grades?.length ? stats.grades : (demoStats.grades ?? [])}
              hideTotalBadge={true}
              singleColorWithHighlight={true}
              cleanGrid={true}
              showValueLabels={true}
            />
            <ChartCard
              categoryBadge="Idade"
              title="Distribuição por faixa etária"
              description="Faixas de idade dos estudantes da escola"
              data={stats.ageRanges?.length ? stats.ageRanges : (demoStats.ageRanges ?? [])}
              hideTotalBadge={true}
              singleColorWithHighlight={true}
              cleanGrid={true}
              showValueLabels={true}
            />
          </div>

          {/* Seção 2: Hábitos e Interesses Esportivos */}
          <div className="section-heading sub-heading">
            <div>
              <p className="eyebrow">Diagnóstico Esportivo</p>
              <h2>Hábitos, interesses e demandas</h2>
              <p className="section-subtitle">
                O que os estudantes praticam, desejam praticar e esperam da escola.
              </p>
            </div>
          </div>

          {/* 1. Modalidades mais praticadas (Card Amplo Full-width) */}
          <div className="sports-fullwidth-wrap">
            <ChartCard
              categoryBadge="Prática Atual"
              title="Modalidades mais praticadas"
              description="Atividades esportivas realizadas com frequência pelos estudantes"
              data={stats.practicedSports?.length ? stats.practicedSports : demoStats.practicedSports}
              isMultipleChoice={true}
              singleColorWithHighlight={true}
              cleanGrid={true}
              showValueLabels={true}
              isFullWidth={true}
            />
          </div>

          {/* 2. Grid de Regularidade e Obstáculos */}
          <div className="chart-grid sports-diagnostic-grid">
            <FrequencyCard
              data={stats.frequencies?.length ? stats.frequencies : (demoStats.frequencies ?? [])}
            />
            <ObstaclesCard
              data={stats.barriers?.length ? stats.barriers : demoStats.barriers}
            />
          </div>

          {/* 3. Comparativo Integrado: Interesses Pessoais vs Demandas da Escola */}
          <InterestsDemandsComparison
            desiredSports={stats.desiredSports?.length ? stats.desiredSports : demoStats.desiredSports}
            desiredAtSchool={stats.desiredAtSchool?.length ? stats.desiredAtSchool : (demoStats.desiredAtSchool ?? [])}
          />

          {/* 4. Conclusão: Participação Esportiva Geral */}
          <ParticipationConclusion practices={stats.practices} />
        </section>
      )}
    </main>
  )
}
