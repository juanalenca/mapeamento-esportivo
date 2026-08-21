import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CountItem } from '../types'

const colors = ['#0d7475', '#14a08a', '#e9ad46', '#3989a7', '#d96b48']

export function ChartCard({ title, description, data }: { title: string; description: string; data: CountItem[] }) {
  return <section className="chart-card">
    <div className="chart-heading"><h2>{title}</h2><p>{description}</p></div>
    <div className="chart" role="img" aria-label={`${title}: ${data.map((item) => `${item.name}, ${item.value}`).join('; ')}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 3, right: 24, bottom: 3, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e8eeeb" />
          <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
          <YAxis dataKey="name" type="category" width={136} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#44514d' }} />
          <Tooltip cursor={{ fill: '#f4f7f5' }} formatter={(value: number) => [value, 'Respostas']} />
          <Bar dataKey="value" radius={[0, 5, 5, 0]} maxBarSize={26}>
            {data.map((entry, index) => <Cell key={`${entry.name}-${index}`} fill={colors[index % colors.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
    <ul className="sr-only">{data.map((item) => <li key={item.name}>{item.name}: {item.value} respostas</li>)}</ul>
  </section>
}
