import type { TrafficLightLevel } from '../data/methodology'

export function TrafficLightBadge({ level, compact = false }: { level: TrafficLightLevel; compact?: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${compact ? 'text-xs' : 'text-sm'}`}
      style={{ borderColor: `${level.hex}55`, background: `${level.hex}1a` }}
    >
      <span
        className="rounded-full pulse-dot"
        style={{
          width: compact ? 8 : 10,
          height: compact ? 8 : 10,
          background: level.hex,
          boxShadow: `0 0 8px ${level.hex}`,
        }}
      />
      <span className="font-semibold" style={{ color: level.hex }}>
        {level.label}
      </span>
    </div>
  )
}
