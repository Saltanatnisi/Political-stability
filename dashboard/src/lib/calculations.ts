// Реализация математического аппарата Методики (Глава 4)

import {
  BLOCKS,
  RISK_SCALE,
  SCENARIOS,
  STABILITY_SCALE,
  TRAFFIC_LIGHT,
  type AnalyticalBlock,
  type Scenario,
  type StabilityLevel,
  type TrafficLightLevel,
  type RiskLevel,
} from '../data/methodology'

export const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value))

/**
 * 4.2 Расчёт аналитического блока
 * Б = (И1 + И2 + ... + И10) / 10
 */
export function calcBlockScore(indicatorValues: number[]): number {
  if (indicatorValues.length === 0) return 0
  const sum = indicatorValues.reduce((acc, v) => acc + clamp(v), 0)
  return clamp(sum / indicatorValues.length)
}

export interface BlockResult {
  block: AnalyticalBlock
  score: number
  weightedContribution: number
}

/**
 * 4.3 Расчёт интегрального Индекса политической устойчивости
 * ИПУ-КР = Σ (Бi × Весi)
 */
export function calcIntegralIndex(blockScores: Record<string, number>): {
  index: number
  results: BlockResult[]
} {
  const results: BlockResult[] = BLOCKS.map((block) => {
    const score = clamp(blockScores[block.id] ?? 0)
    return { block, score, weightedContribution: score * block.weight }
  })
  const index = clamp(results.reduce((sum, r) => sum + r.weightedContribution, 0))
  return { index, results }
}

/** 4.4 / 4.5 Расчёт уровня политического риска: ПР = 100 − ИПУ-КР */
export function calcRiskCoefficient(index: number): number {
  return clamp(100 - index)
}

/** 4.5 / 4.6 Коэффициент кризисного события: ИПУк = ИПУ × Ккс */
export function applyCrisisCoefficient(index: number, coefficient: number): number {
  return clamp(index * coefficient)
}

/** 4.7 Коэффициент динамики политической устойчивости: Кд = ИПУ2 − ИПУ1 */
export function calcDynamicsCoefficient(current: number, previous: number): number {
  return current - previous
}

/** 4.8 / 4.10 Прогнозное значение Индекса: ИПУпр = ИПУт + Кд (или Т — коэффициент тренда) */
export function calcForecastIndex(current: number, trend: number, periods = 1): number {
  return clamp(current + trend * periods)
}

export function getStabilityLevel(index: number): StabilityLevel {
  return (
    STABILITY_SCALE.find((level) => index >= level.min && index <= level.max) ??
    STABILITY_SCALE[STABILITY_SCALE.length - 1]
  )
}

export function getTrafficLight(index: number): TrafficLightLevel {
  return (
    TRAFFIC_LIGHT.find((level) => index >= level.min && index <= level.max) ??
    TRAFFIC_LIGHT[TRAFFIC_LIGHT.length - 1]
  )
}

export function getRiskLevel(riskCoefficient: number): RiskLevel {
  return (
    RISK_SCALE.find((level) => riskCoefficient >= level.min && riskCoefficient <= level.max) ??
    RISK_SCALE[RISK_SCALE.length - 1]
  )
}

export function getScenario(index: number): Scenario {
  return SCENARIOS.find((s) => index >= s.min && index <= s.max) ?? SCENARIOS[SCENARIOS.length - 1]
}

/** 4.6 Расчёт регионального индекса: РИ = (Б1 + Б2 + ... + Б10) / 10 */
export function calcRegionalIndex(blockScores: number[]): number {
  if (blockScores.length === 0) return 0
  return clamp(blockScores.reduce((a, b) => a + b, 0) / blockScores.length)
}

export function formatScore(value: number, digits = 1): string {
  return value.toFixed(digits)
}
