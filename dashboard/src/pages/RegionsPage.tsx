import { useState } from 'react'
import { BLOCKS } from '../data/methodology'
import type { IpuData } from '../hooks/useIpuData'
import { TrafficLightBadge } from '../components/TrafficLightBadge'

export function RegionsPage({ data }: { data: IpuData }) {
  const { regionalResults, regenerateRegions } = data
  const [selectedId, setSelectedId] = useState<string>(regionalResults[0]?.region.id ?? '')

  const selected = regionalResults.find((r) => r.region.id === selectedId) ?? regionalResults[0]

  return (
    <div className="flex flex-col gap-5">
      <div className="card-surface rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">
            Политическая карта Кыргызской Республики (Глава 8)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Региональный индекс РИ = (Б₁+…+Б₁₀)/10 для 7 областей и городов Бишкек и Ош. Кликните по региону
            на карте или в списке, чтобы открыть его паспорт.
          </p>
        </div>
        <button
          onClick={regenerateRegions}
          className="self-start sm:self-auto rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700/70 transition px-3 py-1.5 text-xs font-medium text-slate-200 shrink-0"
        >
          Смоделировать региональный срез
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-5">
        {/* Схематическая тепловая карта */}
        <div className="card-surface rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Тепловая карта устойчивости регионов</h3>
          <div className="relative w-full aspect-[16/11] rounded-xl bg-[#0e1320] border border-slate-800 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="0" y1="25" x2="100" y2="25" stroke="#334155" strokeWidth="0.3" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#334155" strokeWidth="0.3" />
              <line x1="0" y1="75" x2="100" y2="75" stroke="#334155" strokeWidth="0.3" />
              <line x1="25" y1="0" x2="25" y2="100" stroke="#334155" strokeWidth="0.3" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="#334155" strokeWidth="0.3" />
              <line x1="75" y1="0" x2="75" y2="100" stroke="#334155" strokeWidth="0.3" />
            </svg>
            {regionalResults.map((r) => {
              const isSelected = r.region.id === selectedId
              return (
                <button
                  key={r.region.id}
                  onClick={() => setSelectedId(r.region.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
                  style={{ left: `${r.region.mapX}%`, top: `${r.region.mapY}%` }}
                >
                  <span
                    className={`rounded-full flex items-center justify-center font-bold text-[11px] transition-all ${
                      isSelected ? 'ring-2 ring-white' : ''
                    }`}
                    style={{
                      width: r.region.type === 'город' ? 34 : 44,
                      height: r.region.type === 'город' ? 34 : 44,
                      background: r.stability.color,
                      color: '#0b0f1a',
                      boxShadow: `0 0 14px ${r.stability.glow}`,
                    }}
                  >
                    {r.index.toFixed(0)}
                  </span>
                  <span className="mt-1 text-[10px] text-slate-400 whitespace-nowrap group-hover:text-slate-200 max-w-[90px] text-center leading-tight">
                    {r.region.name.replace('область', 'обл.').replace('город ', '')}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 flex-wrap text-xs text-slate-500">
            <LegendDot color="#16a34a" label="Очень высокая / высокая" />
            <LegendDot color="#eab308" label="Умеренная" />
            <LegendDot color="#f97316" label="Пониженная" />
            <LegendDot color="#ef4444" label="Низкая / критическая" />
          </div>
        </div>

        {/* Рейтинг регионов */}
        <div className="card-surface rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Рейтинг административно-территориальных единиц</h3>
          <div className="flex flex-col gap-1.5 max-h-[420px] overflow-y-auto pr-1">
            {regionalResults.map((r, i) => (
              <button
                key={r.region.id}
                onClick={() => setSelectedId(r.region.id)}
                className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition border ${
                  r.region.id === selectedId
                    ? 'border-sky-500/50 bg-sky-500/10'
                    : 'border-transparent bg-slate-800/30 hover:bg-slate-800/60'
                }`}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-slate-700/60 text-slate-300 text-xs flex items-center justify-center font-semibold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-200 truncate">{r.region.name}</span>
                </span>
                <span className="flex items-center gap-3 shrink-0">
                  <TrafficLightBadge level={r.trafficLight} compact />
                  <span className="font-bold text-sm w-10 text-right" style={{ color: r.stability.color }}>
                    {r.index.toFixed(1)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Региональный паспорт выбранного региона */}
      {selected && (
        <div className="card-surface rounded-2xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Региональный паспорт: {selected.region.name}
              </h3>
              <p className="text-xs text-slate-500">
                Население: {selected.region.population.toLocaleString('ru-RU')} чел. · Тип: {selected.region.type}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <TrafficLightBadge level={selected.trafficLight} />
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: selected.stability.color }}>
                  {selected.index.toFixed(1)}
                </div>
                <div className="text-xs text-slate-500">РИ · {selected.stability.label}</div>
              </div>
              <div className="text-right border-l border-slate-800 pl-3">
                <div className="text-2xl font-bold text-orange-400">{selected.risk.toFixed(1)}</div>
                <div className="text-xs text-slate-500">Риск региона</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {BLOCKS.map((block) => {
              const score = selected.blockScores[block.id] ?? 0
              return (
                <div key={block.id} className="rounded-lg bg-slate-800/40 p-3">
                  <div className="text-[11px] text-slate-500 mb-1 truncate" title={block.name}>
                    {block.shortName}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-slate-100">{score.toFixed(0)}</div>
                  </div>
                  <div className="h-1 mt-1.5 bg-slate-700 rounded overflow-hidden">
                    <div className="h-full bg-sky-500" style={{ width: `${score}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}
