import { BarChart3, FileText, Layers, Map, Waypoints } from 'lucide-react'

export type TabId = 'overview' | 'blocks' | 'regions' | 'scenarios' | 'about'

const TABS: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
  { id: 'overview', label: 'Обзор', icon: BarChart3 },
  { id: 'blocks', label: 'Блоки и индикаторы', icon: Layers },
  { id: 'regions', label: 'Регионы', icon: Map },
  { id: 'scenarios', label: 'Сценарии', icon: Waypoints },
  { id: 'about', label: 'О методике', icon: FileText },
]

export function NavTabs({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
  return (
    <nav className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-3">
      <div className="flex gap-1 overflow-x-auto border-b border-slate-800/70 pb-0 scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? 'text-sky-400 border-sky-400'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
