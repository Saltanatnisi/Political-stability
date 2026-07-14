import type { ReactNode } from 'react'

interface KpiCardProps {
  title: string
  value: ReactNode
  subtitle?: ReactNode
  accent?: string
  icon?: ReactNode
  footer?: ReactNode
}

export function KpiCard({ title, value, subtitle, accent = '#38bdf8', icon, footer }: KpiCardProps) {
  return (
    <div className="card-surface rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</span>
        {icon && <span style={{ color: accent }}>{icon}</span>}
      </div>
      <div className="text-3xl font-bold text-slate-50 tabular-nums">{value}</div>
      {subtitle && <div className="text-sm text-slate-400">{subtitle}</div>}
      {footer}
    </div>
  )
}
