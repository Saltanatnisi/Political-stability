import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { HistoryPoint } from '../lib/mockData'

interface TrendChartProps {
  history: HistoryPoint[]
  forecast: HistoryPoint[]
}

export function TrendChart({ history, forecast }: TrendChartProps) {
  const combined = [
    ...history.map((p) => ({ label: p.label, actual: p.index, forecast: null as number | null })),
    ...forecast.map((p, i) => ({
      label: p.label,
      actual: null as number | null,
      forecast: p.index,
      bridge: i === 0 ? history[history.length - 1]?.index : undefined,
    })),
  ]
  // соединяем последнюю фактическую точку с первой прогнозной для непрерывности линии
  if (combined.length > history.length) {
    combined[history.length - 1].forecast = combined[history.length - 1].actual
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={combined} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
        <CartesianGrid stroke="#1f2534" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#2a3142' }} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
        <ReferenceLine y={55} stroke="#f97316" strokeDasharray="4 4" opacity={0.4} />
        <ReferenceLine y={85} stroke="#22c55e" strokeDasharray="4 4" opacity={0.4} />
        <Tooltip
          contentStyle={{ background: '#0f1420', border: '1px solid #2a3142', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#e2e8f0' }}
        />
        <Line type="monotone" dataKey="actual" name="Факт (ИПУ-КР)" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 2.5 }} connectNulls />
        <Line
          type="monotone"
          dataKey="forecast"
          name="Прогноз"
          stroke="#c084fc"
          strokeWidth={2.5}
          strokeDasharray="6 4"
          dot={{ r: 3 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
