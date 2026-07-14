import { RefreshCw, ShieldAlert } from 'lucide-react'
import { TrafficLightBadge } from './TrafficLightBadge'
import type { TrafficLightLevel } from '../data/methodology'

interface HeaderProps {
  trafficLight: TrafficLightLevel
  onRefresh: () => void
}

export function Header({ trafficLight, onRefresh }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-[#0b0f1a]/90 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-700 flex items-center justify-center shrink-0">
            <ShieldAlert size={22} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-semibold text-slate-50 truncate">
              ИПУ-КР — Индекс политической устойчивости Кыргызской Республики
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400 truncate">
              Президентский избирательный цикл 2026–2027 · Political Stability AI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <TrafficLightBadge level={trafficLight} />
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700/70 transition px-3 py-1.5 text-xs font-medium text-slate-200"
            title="Смоделировать обновление данных мониторинга"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">Обновить данные</span>
          </button>
        </div>
      </div>
    </header>
  )
}
