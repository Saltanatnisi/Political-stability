import { CheckCircle2 } from 'lucide-react'
import { SCENARIOS } from '../data/methodology'
import type { IpuData } from '../hooks/useIpuData'

export function ScenariosPage({ data }: { data: IpuData }) {
  const { scenario, adjustedIndex } = data

  return (
    <div className="flex flex-col gap-5">
      <div className="card-surface rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-slate-200 mb-1">
          Сценарное прогнозирование политической устойчивости (Глава 9)
        </h2>
        <p className="text-xs text-slate-500">
          Определение сценария осуществляется на основании интегрального значения ИПУ-КР, коэффициента
          политического риска, результатов мониторинга 100 индикаторов, динамики ситуации, региональных
          факторов, прогнозных моделей и экспертной оценки. Текущее значение индекса:{' '}
          <span className="font-semibold text-slate-200">{adjustedIndex.toFixed(1)}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {SCENARIOS.map((s) => {
          const isActive = s.id === scenario.id
          return (
            <div
              key={s.id}
              className="card-surface rounded-2xl p-5 flex flex-col gap-3 relative"
              style={{
                borderColor: isActive ? `${s.color}80` : undefined,
                boxShadow: isActive ? `0 0 0 1px ${s.color}55, 0 0 24px ${s.color}22` : undefined,
              }}
            >
              {isActive && (
                <span
                  className="absolute top-4 right-4 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-1"
                  style={{ background: `${s.color}22`, color: s.color }}
                >
                  <CheckCircle2 size={12} /> Текущий
                </span>
              )}
              <span className="text-xs font-mono text-slate-500">Сценарий {s.order}</span>
              <h3 className="text-base font-bold" style={{ color: s.color }}>
                {s.name}
              </h3>
              <span className="text-xs text-slate-500">
                ИПУ-КР: {s.min}–{s.max >= 100 ? 100 : s.max.toFixed(0)} баллов
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
              <ul className="flex flex-col gap-1.5 mt-1">
                {s.signs.map((sign, i) => (
                  <li key={i} className="text-[11px] text-slate-500 flex items-start gap-1.5">
                    <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ background: s.color }} />
                    {sign}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
