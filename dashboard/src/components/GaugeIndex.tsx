import type { StabilityLevel } from '../data/methodology'

interface GaugeIndexProps {
  value: number
  level: StabilityLevel
  size?: number
}

export function GaugeIndex({ value, level, size = 220 }: GaugeIndexProps) {
  const radius = size / 2 - 14
  const circumference = Math.PI * radius // полукруг
  const clamped = Math.min(100, Math.max(0, value))
  const progress = (clamped / 100) * circumference
  const center = size / 2

  return (
    <div className="relative flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        <path
          d={`M 14 ${center} A ${radius} ${radius} 0 0 1 ${size - 14} ${center}`}
          fill="none"
          stroke="#1f2937"
          strokeWidth={16}
          strokeLinecap="round"
        />
        <path
          d={`M 14 ${center} A ${radius} ${radius} 0 0 1 ${size - 14} ${center}`}
          fill="none"
          stroke={level.color}
          strokeWidth={16}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{
            transition: 'stroke-dasharray 0.6s ease, stroke 0.6s ease',
            filter: `drop-shadow(0 0 8px ${level.glow})`,
          }}
        />
      </svg>
      <div className="absolute top-[58%] flex flex-col items-center -translate-y-1/2">
        <span className="text-5xl font-bold tabular-nums" style={{ color: level.color }}>
          {clamped.toFixed(1)}
        </span>
        <span className="text-xs uppercase tracking-widest text-slate-400 mt-1">из 100 баллов</span>
      </div>
    </div>
  )
}
