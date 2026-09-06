import type { CountItem } from '../types'

export function ObstaclesCard({ data }: { data: CountItem[] }) {
  const totalChoices = data.reduce((acc, item) => acc + (item.value || 0), 0)
  const topObstacle = data[0] || { name: '—', value: 0 }
  const maxVal = Math.max(...data.map((d) => d.value || 0), 1)

  return (
    <section className="chart-card obstacles-card">
      <div className="chart-heading">
        <div>
          <span className="chart-category-badge">Diagnóstico</span>
          <h2>O que dificulta a prática esportiva?</h2>
          <p>Fatores apontados pelos estudantes que limitam a rotina de exercícios</p>
        </div>

        <div className="chart-header-badges">
          <span className="chart-total-pill">
            <strong>{totalChoices}</strong> escolhas
          </span>
          <span className="chart-choice-badge" title="Cada participante pôde selecionar mais de uma opção">
            Múltiplas respostas
          </span>
        </div>
      </div>

      <div className="obstacles-card-layout">
        <div className="obstacles-list" role="list" aria-label="Ranking dos obstáculos para a prática esportiva">
          {data.map((item, index) => {
            const isTop = index === 0
            const pct = Math.round((item.value / maxVal) * 100)

            return (
              <div key={item.name} className={`obstacle-item ${isTop ? 'is-top' : ''}`}>
                <div className="obstacle-ordinal" aria-hidden="true">
                  <span>{index + 1}º</span>
                </div>
                <div className="obstacle-content">
                  <div className="obstacle-meta">
                    <span className="obstacle-name">{item.name}</span>
                    <strong className="obstacle-count">{item.value}</strong>
                  </div>
                  <div className="obstacle-track" aria-hidden="true">
                    <div
                      className={`obstacle-fill ${isTop ? 'fill-top' : 'fill-normal'}`}
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {topObstacle.value > 0 && (
          <aside className="obstacles-synthesis-box">
            <span className="synthesis-eyebrow">Principal Barreira</span>
            <strong className="synthesis-name">{topObstacle.name}</strong>
            <div className="synthesis-value-pill">
              <strong>{topObstacle.value} estudantes</strong>
            </div>
            <p className="synthesis-desc">
              Obstáculo com maior incidência entre os respondentes da escola, indicando o principal fator a ser mitigado nas propostas pedagógicas.
            </p>
          </aside>
        )}
      </div>
    </section>
  )
}
