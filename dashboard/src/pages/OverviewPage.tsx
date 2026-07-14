import { AlertTriangle, Gauge, TrendingDown, TrendingUp } from 'lucide-react'
import { GaugeIndex } from '../components/GaugeIndex'
import { KpiCard } from '../components/KpiCard'
import { BlocksRadarChart } from '../components/BlocksRadarChart'
import { TrendChart } from '../components/TrendChart'
import { TrafficLightBadge } from '../components/TrafficLightBadge'
import { CRISIS_COEFFICIENTS } from '../data/methodology'
import type { IpuData } from '../hooks/useIpuData'
import { BLOCKS } from '../data/methodology'

export function OverviewPage({ data }: { data: IpuData }) {
  const {
    adjustedIndex,
    index,
    riskCoefficient,
    riskLevel,
    stabilityLevel,
    trafficLight,
    scenario,
    blockResults,
    history,
    forecast,
    trend,
    crisisCoefficientId,
    setCrisisCoefficientId,
    regionalResults,
    indicatorValues,
  } = data

  const weakestBlocks = [...blockResults].sort((a, b) => a.score - b.score).slice(0, 3)
  const allIndicators = BLOCKS.flatMap((b) => b.indicators.map((ind) => ({ ...ind, blockName: b.shortName })))
  const weakestIndicators = [...allIndicators]
    .sort((a, b) => (indicatorValues[a.code] ?? 0) - (indicatorValues[b.code] ?? 0))
    .slice(0, 5)

  const topRegions = regionalResults.slice(0, 3)
  const bottomRegions = regionalResults.slice(-3).reverse()

  return (
    <div className="flex flex-col gap-5">
      {/* Верхняя панель: индекс + KPI */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
        <div className="card-surface rounded-2xl p-5 flex flex-col items-center justify-center gap-3">
          <span className="text-xs uppercase tracking-widest text-slate-400">Интегральный индекс ИПУ-КР</span>
          <GaugeIndex value={adjustedIndex} level={stabilityLevel} />
          <div className="flex flex-col items-center gap-1.5">
            <span className="font-semibold" style={{ color: stabilityLevel.color }}>
              Уровень устойчивости: {stabilityLevel.label}
            </span>
            {crisisCoefficientId !== 'stable' && (
              <span className="text-xs text-slate-400">
                Базовый индекс {index.toFixed(1)} × Ккс {CRISIS_COEFFICIENTS.find((c) => c.id === crisisCoefficientId)?.value}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KpiCard
            title="Коэффициент политического риска (КПР)"
            value={riskCoefficient.toFixed(1)}
            accent={riskLevel.color}
            icon={<AlertTriangle size={18} />}
            subtitle={<span style={{ color: riskLevel.color }}>{riskLevel.label} риск</span>}
            footer={<p className="text-xs text-slate-500 mt-1">{riskLevel.comment}</p>}
          />
          <KpiCard
            title="Текущий сценарий"
            value={scenario.name}
            accent={scenario.color}
            icon={<Gauge size={18} />}
            subtitle={<span className="text-slate-400">{scenario.min}–{scenario.max === 100 ? 100 : scenario.max.toFixed(0)} баллов</span>}
          />
          <KpiCard
            title="Динамика (месяц к месяцу)"
            value={
              <span className="inline-flex items-center gap-1.5">
                {trend >= 0 ? (
                  <TrendingUp size={22} className="text-emerald-400" />
                ) : (
                  <TrendingDown size={22} className="text-red-400" />
                )}
                {trend >= 0 ? '+' : ''}
                {trend.toFixed(1)}
              </span>
            }
            accent={trend >= 0 ? '#22c55e' : '#ef4444'}
            subtitle="Коэффициент динамики Кд = ИПУ₂ − ИПУ₁"
          />
          <KpiCard
            title="Политический светофор"
            value={<TrafficLightBadge level={trafficLight} />}
            accent={trafficLight.hex}
            subtitle={<span className="text-xs">{trafficLight.action}</span>}
          />
        </div>
      </div>

      {/* Радар блоков + тренд/прогноз */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card-surface rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-200">Структура 10 аналитических блоков</h2>
            <span className="text-xs text-slate-500">Второй уровень модели</span>
          </div>
          <BlocksRadarChart results={blockResults} />
        </div>
        <div className="card-surface rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-200">Динамика и прогноз ИПУ-КР</h2>
            <span className="text-xs text-slate-500">Четвёртый уровень модели · п.4.7–4.10</span>
          </div>
          <TrendChart history={history} forecast={forecast} />
        </div>
      </div>

      {/* Коэффициент кризисного события + слабые места */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
        <div className="card-surface rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-slate-200 mb-1">Коэффициент кризисного события (Ккс)</h2>
          <p className="text-xs text-slate-500 mb-3">
            п.4.5–4.6: ИПУₖ = ИПУ × Ккс. Выберите текущий характер общественно-политической ситуации.
          </p>
          <div className="flex flex-col gap-1.5">
            {CRISIS_COEFFICIENTS.map((option) => (
              <label
                key={option.id}
                className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm cursor-pointer border transition ${
                  crisisCoefficientId === option.id
                    ? 'border-sky-500/60 bg-sky-500/10 text-slate-100'
                    : 'border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="crisis"
                    checked={crisisCoefficientId === option.id}
                    onChange={() => setCrisisCoefficientId(option.id)}
                    className="accent-sky-500"
                  />
                  {option.label}
                </span>
                <span className="font-mono text-xs text-slate-500">×{option.value.toFixed(2)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="card-surface rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-slate-200 mb-3">Наиболее уязвимые зоны мониторинга</h2>
          <div className="mb-4">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Слабейшие аналитические блоки</span>
            <div className="flex flex-col gap-2 mt-2">
              {weakestBlocks.map(({ block, score }) => (
                <div key={block.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{block.name}</span>
                  <span className="font-semibold text-orange-400">{score.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wide">Индикаторы с наименьшими значениями</span>
            <div className="flex flex-col gap-2 mt-2">
              {weakestIndicators.map((ind) => (
                <div key={ind.code} className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 truncate pr-2">
                    #{ind.code} · {ind.name}
                  </span>
                  <span className="font-semibold text-red-400 shrink-0">{indicatorValues[ind.code]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Регионы: лучшие/худшие */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card-surface rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-slate-200 mb-3">Топ-3 региона по устойчивости</h2>
          <div className="flex flex-col gap-2">
            {topRegions.map((r, i) => (
              <div key={r.region.id} className="flex items-center justify-between rounded-lg bg-slate-800/40 px-3 py-2">
                <span className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  {r.region.name}
                </span>
                <span className="font-semibold" style={{ color: r.stability.color }}>
                  {r.index.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="card-surface rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-slate-200 mb-3">Регионы повышенного внимания</h2>
          <div className="flex flex-col gap-2">
            {bottomRegions.map((r, i) => (
              <div key={r.region.id} className="flex items-center justify-between rounded-lg bg-slate-800/40 px-3 py-2">
                <span className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  {r.region.name}
                </span>
                <span className="font-semibold" style={{ color: r.stability.color }}>
                  {r.index.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
