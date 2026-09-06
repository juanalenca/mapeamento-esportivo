import type { CountItem } from '../types'

export function FrequencyCard({ data }: { data: CountItem[] }) {
  const total = data.reduce((acc, item) => acc + (item.value || 0), 0)

  return (
    <section className="chart-card freq-distribution-card">
      <div className="chart-heading">
        <div>
          <span className="chart-category-badge">Regularidade</span>
          <h2>Frequência semanal de prática</h2>
          <p>Quantas vezes por semana os estudantes praticam atividade física</p>
        </div>
        <div className="chart-header-badges">
          <span className="chart-total-pill">
            <strong>{total}</strong> respostas
          </span>
        </div>
      </div>

      <div className="freq-list" role="list" aria-label="Distribuição da frequência semanal de prática esportiva">
        {data.map((item, index) => {
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0
          const isTop = index === 0

          return (
            <div key={item.name} className={`freq-row ${isTop ? 'is-top' : ''}`}>
              <div className="freq-info">
                <span className="freq-label">{item.name}</span>
                <span className="freq-pct">
                  <strong>{pct}%</strong>
                  <small className="freq-count">({item.value})</small>
                </span>
              </div>
              <div className="freq-track" aria-hidden="true">
                <div
                  className={`freq-fill ${isTop ? 'fill-top' : 'fill-normal'}`}
                  style={{ width: `${Math.max(pct, 2)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
