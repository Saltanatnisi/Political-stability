import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { BlockResult } from '../lib/calculations'

export function BlocksRadarChart({ results }: { results: BlockResult[] }) {
  const data = results
    .slice()
    .sort((a, b) => a.block.order - b.block.order)
    .map((r) => ({
      name: r.block.shortName,
      fullName: r.block.name,
      score: Math.round(r.score * 10) / 10,
    }))

  return (
    <ResponsiveContainer width="100%" height={340}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="#2a3142" />
        <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 10 }} />
        <Radar name="Балл блока" dataKey="score" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.35} />
        <Tooltip
          contentStyle={{ background: '#0f1420', border: '1px solid #2a3142', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#e2e8f0' }}
          formatter={(value, _name, item) => [
            `${value} баллов`,
            (item?.payload as { fullName?: string } | undefined)?.fullName ?? 'Блок',
          ]}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
