import { MAP_VIEWBOX, REGION_GEOMETRY } from '../data/kyrgyzstanMap'

const [, , VB_WIDTH, VB_HEIGHT] = MAP_VIEWBOX.split(' ').map(Number)

export interface MapRegionDatum {
  id: string
  shortLabel: string
  index: number
  color: string
  glow: string
  isSelected: boolean
  isCity?: boolean
}

interface KyrgyzstanMapProps {
  regions: MapRegionDatum[]
  onSelect: (id: string) => void
}

export function KyrgyzstanMap({ regions, onSelect }: KyrgyzstanMapProps) {
  return (
    <div className="relative w-full" style={{ aspectRatio: `${VB_WIDTH} / ${VB_HEIGHT}` }}>
      <svg
        viewBox={MAP_VIEWBOX}
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="Политическая карта Кыргызской Республики"
      >
        <g>
          {regions.map((r) => {
            const geometry = REGION_GEOMETRY[r.id]
            if (!geometry) return null
            return (
              <path
                key={r.id}
                d={geometry.d}
                fill={r.color}
                fillOpacity={r.isSelected ? 0.95 : 0.8}
                stroke={r.isSelected ? '#f8fafc' : '#0b0f1a'}
                strokeWidth={r.isSelected ? 2 : 1}
                style={{
                  cursor: 'pointer',
                  transition: 'fill-opacity 0.2s, stroke 0.2s',
                  filter: r.isSelected ? `drop-shadow(0 0 10px ${r.glow})` : undefined,
                }}
                onClick={() => onSelect(r.id)}
              >
                <title>
                  {r.shortLabel}: {r.index.toFixed(1)}
                </title>
              </path>
            )
          })}
        </g>
      </svg>

      {/* Подписи со значением индекса поверх областей */}
      {regions.map((r) => {
        const geometry = REGION_GEOMETRY[r.id]
        if (!geometry) return null
        const left = (geometry.labelX / VB_WIDTH) * 100
        const top = (geometry.labelY / VB_HEIGHT) * 100
        return (
          <button
            key={r.id}
            onClick={() => onSelect(r.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <span
              className={`rounded-full flex items-center justify-center font-bold text-[10px] leading-none transition-transform group-hover:scale-110 ${
                r.isSelected ? 'ring-2 ring-white' : ''
              }`}
              style={{
                width: r.isCity ? 26 : 30,
                height: r.isCity ? 26 : 30,
                background: '#0b0f1acc',
                border: `2px solid ${r.color}`,
                color: '#f8fafc',
                boxShadow: r.isSelected ? `0 0 10px ${r.glow}` : undefined,
              }}
            >
              {r.index.toFixed(0)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
