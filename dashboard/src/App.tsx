import { useState } from 'react'
import { Header } from './components/Header'
import { NavTabs, type TabId } from './components/NavTabs'
import { OverviewPage } from './pages/OverviewPage'
import { BlocksPage } from './pages/BlocksPage'
import { RegionsPage } from './pages/RegionsPage'
import { ScenariosPage } from './pages/ScenariosPage'
import { AboutPage } from './pages/AboutPage'
import { useIpuData } from './hooks/useIpuData'

function App() {
  const [tab, setTab] = useState<TabId>('overview')
  const data = useIpuData()

  return (
    <div className="min-h-screen flex flex-col">
      <Header trafficLight={data.trafficLight} onRefresh={data.regenerateNational} />
      <NavTabs active={tab} onChange={setTab} />
      <main className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 py-5 flex-1">
        {tab === 'overview' && <OverviewPage data={data} />}
        {tab === 'blocks' && <BlocksPage data={data} />}
        {tab === 'regions' && <RegionsPage data={data} />}
        {tab === 'scenarios' && <ScenariosPage data={data} />}
        {tab === 'about' && <AboutPage />}
      </main>
      <footer className="border-t border-slate-800/70 py-4 text-center text-[11px] text-slate-600">
        Демонстрационный дашборд на основе Методики оценки политической устойчивости Кыргызской Республики
        (ИПУ-КР 2026) · Данные условные, сгенерированы для целей демонстрации
      </footer>
    </div>
  )
}

export default App
