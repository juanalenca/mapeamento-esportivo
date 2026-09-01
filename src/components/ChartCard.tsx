import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CountItem } from '../types'

const colors = ['#0d7475', '#14a08a', '#e9ad46', '#3989a7', '#d96b48']

export function ChartCard({ title, description, data }: { title: string; description: string; data: CountItem[] }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 520)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const yAxisWidth = isMobile ? 100 : 136

  return (
    <section className="chart-card">
      <div className="chart-heading">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="chart" role="img" aria-label={`${title}: ${data.map((item) => `${item.name}, ${item.value}`).join('; ')}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: isMobile ? 12 : 24, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e8eeeb" />
            <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#6e7d79' }} />
            <YAxis
              dataKey="name"
              type="category"
              width={yAxisWidth}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: isMobile ? 11 : 12, fill: '#44514d' }}
            />
            <Tooltip cursor={{ fill: '#f4f7f5' }} formatter={(value: number) => [value, 'Respostas']} />
            <Bar dataKey="value" radius={[0, 5, 5, 0]} maxBarSize={24}>
              {data.map((entry, index) => (
                <Cell key={`${entry.name}-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
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
