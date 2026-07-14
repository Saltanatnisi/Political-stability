import { useState } from 'react'
import { ChevronDown, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { IpuData } from '../hooks/useIpuData'
import { getStabilityLevel } from '../lib/calculations'

export function BlocksPage({ data }: { data: IpuData }) {
  const { blockResults, indicatorValues, updateIndicator } = data
  const [openBlockId, setOpenBlockId] = useState<string | null>(blockResults[0]?.block.id ?? null)

  return (
    <div className="flex flex-col gap-4">
      <div className="card-surface rounded-2xl p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-slate-200 mb-1">
          Система из 100 индикаторов в 10 аналитических блоках (Глава 3)
        </h2>
        <p className="text-xs text-slate-500">
          Значение каждого индикатора рассчитывается по формуле И = (Ф/Ц)×100 либо И = 100 − (Ф/К×100) в
          зависимости от направления влияния показателя (п. 4.1) и приводится к шкале 0–100. Передвигайте
          слайдеры, чтобы смоделировать изменение первичных данных мониторинга — блок и интегральный индекс
          пересчитываются автоматически.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {blockResults
          .slice()
          .sort((a, b) => a.block.order - b.block.order)
          .map(({ block, score, weightedContribution }) => {
            const isOpen = openBlockId === block.id
            const level = getStabilityLevel(score)
            return (
              <div key={block.id} className="card-surface rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenBlockId(isOpen ? null : block.id)}
                  className="w-full flex items-center justify-between gap-4 px-4 sm:px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-slate-500 shrink-0">
                      Блок {block.order}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-100 truncate">{block.name}</h3>
                      <p className="text-xs text-slate-500 truncate hidden sm:block">{block.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs text-slate-500">Вес {(block.weight * 100).toFixed(0)}%</div>
                      <div className="text-xs text-slate-500">Вклад {weightedContribution.toFixed(1)}</div>
                    </div>
                    <div className="w-16 text-right font-bold text-lg" style={{ color: level.color }}>
                      {score.toFixed(1)}
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                <div className="h-1 bg-slate-800">
                  <div
                    className="h-full transition-all"
                    style={{ width: `${score}%`, background: level.color }}
                  />
                </div>

                {isOpen && (
                  <div className="px-4 sm:px-5 py-4 border-t border-slate-800/70 flex flex-col gap-3">
                    {block.indicators.map((indicator) => {
                      const value = indicatorValues[indicator.code] ?? 0
                      return (
                        <div key={indicator.code} className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 sm:gap-4 items-center">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[11px] font-mono text-slate-600 shrink-0">#{indicator.code}</span>
                            <span className="text-sm text-slate-300 truncate">{indicator.name}</span>
                            {indicator.direction === 'negative' ? (
                              <span title="Рост показателя увеличивает риск">
                                <ArrowDownRight size={13} className="text-orange-400 shrink-0" />
                              </span>
                            ) : (
                              <span title="Рост показателя повышает устойчивость">
                                <ArrowUpRight size={13} className="text-emerald-400 shrink-0" />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 min-w-[180px]">
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={value}
                              onChange={(e) => updateIndicator(indicator.code, Number(e.target.value))}
                              className="w-full accent-sky-500"
                            />
                            <span className="w-9 text-right text-sm font-mono text-slate-300 tabular-nums">
                              {value}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
