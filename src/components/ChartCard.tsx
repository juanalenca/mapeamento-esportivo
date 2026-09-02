import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CountItem } from '../types'
import { BarChart2 } from 'lucide-react'

const colors = [
  '#0d7475',
  '#14a08a',
  '#2a8f82',
  '#e9ad46',
  '#3989a7',
  '#287994',
  '#d96b48',
  '#c55a38',
]

export function ChartCard({
  title,
  description,
  data,
  categoryBadge,
}: {
  title: string
  description: string
  data: CountItem[]
  categoryBadge?: string
}) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  )

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isSmallMobile = windowWidth < 420
  const isMobile = windowWidth < 640
  const yAxisWidth = isSmallMobile ? 95 : isMobile ? 115 : 140

  const hasData = data && data.length > 0 && data.some((d) => d.value > 0)
  const totalVotes = data.reduce((acc, item) => acc + (item.value || 0), 0)

  return (
    <section className="chart-card">
      <div className="chart-heading">
        <div>
          {categoryBadge && <span className="chart-category-badge">{categoryBadge}</span>}
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {hasData && (
          <span className="chart-total-pill">
            <strong>{totalVotes}</strong> {totalVotes === 1 ? 'voto' : 'votos'}
          </span>
        )}
      </div>

      {!hasData ? (
        <div className="chart-empty-state">
          <BarChart2 size={32} className="chart-empty-icon" />
          <p>Aguardando primeiras respostas...</p>
        </div>
      ) : (
        <div
          className="chart"
          role="img"
          aria-label={`${title}: ${data.map((item) => `${item.name}, ${item.value}`).join('; ')}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 6, right: isMobile ? 12 : 24, bottom: 4, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e8eeeb" />
              <XAxis
                type="number"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#6e7d79' }}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={yAxisWidth}
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: isSmallMobile ? 10.5 : isMobile ? 11.5 : 12,
                  fill: '#334844',
                  fontWeight: 500,
                }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(13, 116, 117, 0.05)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as CountItem
                    const pct = totalVotes ? Math.round((item.value / totalVotes) * 100) : 0
                    return (
                      <div className="custom-chart-tooltip">
                        <span className="tooltip-name">{item.name}</span>
                        <div className="tooltip-value-row">
                          <strong>{item.value} respostas</strong>
                          <span className="tooltip-pct">({pct}%)</span>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={isMobile ? 22 : 26}>
                {data.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <ul className="sr-only">
        {data.map((item) => (
          <li key={item.name}>
            {item.name}: {item.value} respostas
          </li>
        ))}
      </ul>
    </section>
  )
}
