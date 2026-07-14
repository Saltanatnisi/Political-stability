import { BLOCKS, TOTAL_INDICATORS } from '../data/methodology'

export function AboutPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="card-surface rounded-2xl p-5">
        <h2 className="text-base font-semibold text-slate-100 mb-2">
          Методика оценки политической устойчивости Кыргызской Республики
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Индекс политической устойчивости Кыргызской Республики (ИПУ-КР 2026) — интегральная система
          количественной оценки состояния политической устойчивости государства в период президентского
          избирательного цикла 2026–2027 годов. Дашборд реализует архитектуру Методики: {TOTAL_INDICATORS}{' '}
          индикаторов, объединённых в {BLOCKS.length} аналитических блоков, четырёхуровневую модель расчёта и
          модуль искусственного интеллекта Political Stability AI (Глава 5, 10).
        </p>
      </div>

      <div className="card-surface rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Четырёхуровневая модель построения индекса</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { level: 'I', title: 'Первичные индикаторы', desc: `${TOTAL_INDICATORS} показателей, шкала 0–100 баллов, формулы п.4.1` },
            { level: 'II', title: 'Аналитические блоки', desc: `${BLOCKS.length} субиндексов, Б = среднее из 10 индикаторов` },
            { level: 'III', title: 'Интегральный индекс', desc: 'ИПУ-КР = Σ(Бᵢ × Весᵢ), КПР = 100 − ИПУ-КР' },
            { level: 'IV', title: 'Прогноз и сценарии', desc: 'ИПУпр = ИПУт + Кд, 5 сценариев, ИИ Political Stability AI' },
          ].map((step) => (
            <div key={step.level} className="rounded-xl bg-slate-800/40 p-4">
              <div className="text-2xl font-bold text-sky-400 mb-1">{step.level}</div>
              <div className="text-sm font-semibold text-slate-200 mb-1">{step.title}</div>
              <div className="text-xs text-slate-500">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-surface rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Структура аналитических блоков и весовые коэффициенты</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-800">
                <th className="py-2 pr-3">№</th>
                <th className="py-2 pr-3">Аналитический блок</th>
                <th className="py-2 pr-3">Индикаторов</th>
                <th className="py-2 pr-3">Вес</th>
              </tr>
            </thead>
            <tbody>
              {BLOCKS.map((block) => (
                <tr key={block.id} className="border-b border-slate-800/60 last:border-0">
                  <td className="py-2 pr-3 text-slate-500 font-mono text-xs">{block.order}</td>
                  <td className="py-2 pr-3 text-slate-200">{block.name}</td>
                  <td className="py-2 pr-3 text-slate-400">{block.indicators.length}</td>
                  <td className="py-2 pr-3 text-slate-300 font-semibold">{(block.weight * 100).toFixed(0)}%</td>
                </tr>
              ))}
              <tr>
                <td className="py-2 pr-3" />
                <td className="py-2 pr-3 text-slate-500 text-xs uppercase">Всего</td>
                <td className="py-2 pr-3 text-slate-300 font-semibold">{TOTAL_INDICATORS}</td>
                <td className="py-2 pr-3 text-slate-300 font-semibold">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-surface rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Основные формулы (Глава 4)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <Formula title="Значение индикатора (положительное влияние)" formula="И = (Ф / Ц) × 100" />
          <Formula title="Значение индикатора (риск-фактор)" formula="И = 100 − (Ф / К × 100)" />
          <Formula title="Аналитический блок" formula="Б = (И₁ + И₂ + … + И₁₀) / 10" />
          <Formula title="Интегральный индекс" formula="ИПУ-КР = Σ (Бᵢ × Весᵢ)" />
          <Formula title="Коэффициент политического риска" formula="КПР = 100 − ИПУ-КР" />
          <Formula title="Коэффициент кризисного события" formula="ИПУₖ = ИПУ × Ккс" />
          <Formula title="Региональный индекс" formula="РИ = (Б₁ + Б₂ + … + Б₁₀) / 10" />
          <Formula title="Прогнозное значение индекса" formula="ИПУпр = ИПУт + Кд" />
        </div>
      </div>

      <div className="card-surface rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-2">Ограничения демонстрационной версии</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Данный дашборд — программная реализация архитектуры и расчётных формул Методики для целей
          демонстрации и стратегического анализа. Значения 100 индикаторов на национальном уровне доступны для
          редактирования вручную (вкладка «Блоки и индикаторы»), а региональные срезы формируются
          демонстрационным генератором данных. В производственном контуре первичные данные должны поступать из
          государственных информационных систем, ЦИК, Нацстаткома, социологических исследований и модуля
          Political Stability AI в соответствии с Приложениями А, Ж и Л Методики, а итоговые выводы принимаются
          уполномоченными государственными органами на основе экспертной проверки.
        </p>
      </div>
    </div>
  )
}

function Formula({ title, formula }: { title: string; formula: string }) {
  return (
    <div className="rounded-lg bg-slate-800/40 p-3">
      <div className="text-xs text-slate-500 mb-1">{title}</div>
      <div className="font-mono text-sky-300 text-sm">{formula}</div>
    </div>
  )
}
