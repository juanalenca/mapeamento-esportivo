import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CountItem } from '../types'
import { BarChart2 } from 'lucide-react'

// Paleta de destaque: #0d7475 para o #1 e #5fa69a para os demais
const PRIMARY_HIGHLIGHT = '#0d7475'
const SECONDARY_BAR = '#64978d'

export function ChartCard({
  title,
  description,
  data,
  categoryBadge,
  hideTotalBadge = false,
  isMultipleChoice = false,
  singleColorWithHighlight = true,
  cleanGrid = true,
  showValueLabels = true,
  isFullWidth = false,
}: {
  title: string
  description: string
  data: CountItem[]
  categoryBadge?: string
  hideTotalBadge?: boolean
  isMultipleChoice?: boolean
  singleColorWithHighlight?: boolean
  cleanGrid?: boolean
  showValueLabels?: boolean
  isFullWidth?: boolean
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
  const yAxisWidth = isSmallMobile ? 95 : isMobile ? 115 : 138

  const hasData = data && data.length > 0 && data.some((d) => d.value > 0)
  const totalVotes = data.reduce((acc, item) => acc + (item.value || 0), 0)

  const chartHeight = Math.max(210, (data?.length || 0) * (isMobile ? 28 : 32) + 38)

  return (
    <section className={`chart-card ${isFullWidth ? 'is-full-width' : ''}`}>
      <div className="chart-heading">
        <div>
          {categoryBadge && <span className="chart-category-badge">{categoryBadge}</span>}
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        {!hideTotalBadge && hasData && (
          <div className="chart-header-badges">
            <span className="chart-total-pill">
              <strong>{totalVotes}</strong>{' '}
              {isMultipleChoice ? 'escolhas' : totalVotes === 1 ? 'resposta' : 'respostas'}
            </span>
            {isMultipleChoice && (
              <span className="chart-choice-badge" title="Cada participante pôde selecionar mais de uma opção">
                Múltiplas respostas
              </span>
            )}
          </div>
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
          style={{ height: chartHeight, minHeight: chartHeight }}
          role="img"
          aria-label={`${title}: ${data.map((item) => `${item.name}, ${item.value}`).join('; ')}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: isMobile ? 32 : 40, bottom: 4, left: 0 }}
            >
              {cleanGrid ? (
                <CartesianGrid stroke="#f0f4f2" horizontal={false} vertical={false} />
              ) : (
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e8eeeb" />
              )}
              <XAxis
                type="number"
                allowDecimals={false}
                tickLine={false}
                axisLine={{ stroke: '#edf2ef' }}
                tick={{ fontSize: 11, fill: '#6e7d79' }}
              />
              <YAxis
                dataKey="name"
                type="category"
                interval={0}
                width={yAxisWidth}
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: isSmallMobile ? 10.5 : isMobile ? 11.5 : 12,
                  fill: '#29433f',
                  fontWeight: 500,
                }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(13, 116, 117, 0.04)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as CountItem
                    const pct = totalVotes ? Math.round((item.value / totalVotes) * 100) : 0
                    return (
                      <div className="custom-chart-tooltip">
                        <span className="tooltip-name">{item.name}</span>
                        <div className="tooltip-value-row">
                          <strong>{item.value} {isMultipleChoice ? 'escolhas' : 'respostas'}</strong>
                          <span className="tooltip-pct">({pct}%)</span>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="value" radius={[0, 5, 5, 0]} maxBarSize={isMobile ? 22 : 25}>
                {showValueLabels && (
                  <LabelList
                    dataKey="value"
                    position="right"
                    offset={8}
                    fill="#4a5c58"
                    fontSize={11}
                    fontWeight={600}
                  />
                )}
                {data.map((entry, index) => (
                  <Cell
                    key={`${entry.name}-${index}`}
                    fill={singleColorWithHighlight ? (index === 0 ? PRIMARY_HIGHLIGHT : SECONDARY_BAR) : PRIMARY_HIGHLIGHT}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <ul className="sr-only">
        {data.map((item) => (
          <li key={item.name}>
            {item.name}: {item.value} {isMultipleChoice ? 'escolhas' : 'respostas'}
          </li>
        ))}
      </ul>
    </section>
  )
}

