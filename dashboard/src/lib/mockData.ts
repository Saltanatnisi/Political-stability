// Генератор демонстрационных данных для дашборда.
// В реальной системе данные поступают из государственных информационных систем,
// социологических опросов, мониторинга СМИ/соцсетей и модуля Political Stability AI
// (см. Главу 5 и Приложение Л «API обмена данными»).

import { BLOCKS, REGIONS } from '../data/methodology'

// Простой детерминированный псевдослучайный генератор (mulberry32),
// чтобы данные были воспроизводимы для одного seed, но отличались между регионами/перезапусками.
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}

export type IndicatorValues = Record<number, number> // code -> 0..100

export function generateNationalIndicators(baseline = 72, seedKey = 'national'): IndicatorValues {
  const rand = mulberry32(hashString(seedKey) + Date.now() % 1000)
  const values: IndicatorValues = {}
  BLOCKS.forEach((block) => {
    // у каждого блока свой уровень "здоровья" вокруг baseline, чтобы срез был реалистичным
    const blockBias = (rand() - 0.5) * 22
    block.indicators.forEach((indicator) => {
      const noise = (rand() - 0.5) * 24
      const value = baseline + blockBias + noise
      values[indicator.code] = Math.round(Math.min(100, Math.max(2, value)))
    })
  })
  return values
}

export interface RegionBlockScores {
  regionId: string
  scores: Record<string, number> // blockId -> score 0..100
}

export function generateRegionalBlockScores(nationalBlockScores: Record<string, number>): RegionBlockScores[] {
  return REGIONS.map((region) => {
    const rand = mulberry32(hashString(region.id) * 7919 + 13)
    const regionOverallBias = (rand() - 0.45) * 18 // некоторые регионы систематически ниже/выше среднего
    const scores: Record<string, number> = {}
    BLOCKS.forEach((block) => {
      const base = nationalBlockScores[block.id] ?? 65
      const noise = (rand() - 0.5) * 20
      scores[block.id] = Math.round(Math.min(100, Math.max(3, base + regionOverallBias + noise)))
    })
    return { regionId: region.id, scores }
  })
}

export interface HistoryPoint {
  label: string
  index: number
  isForecast?: boolean
}

export function generateHistory(currentIndex: number, months = 12): HistoryPoint[] {
  const rand = mulberry32(Math.round(currentIndex * 1000) + 42)
  const points: number[] = []
  let value = currentIndex - (rand() - 0.3) * 10
  for (let i = 0; i < months - 1; i++) {
    value += (rand() - 0.48) * 4.5
    value = Math.min(97, Math.max(20, value))
    points.push(value)
  }
  points.push(currentIndex)

  const now = new Date()
  return points.map((v, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1)
    const label = d.toLocaleDateString('ru-RU', { month: 'short', year: '2-digit' })
    return { label, index: Math.round(v * 10) / 10 }
  })
}

export function generateForecast(currentIndex: number, trend: number, monthsAhead: number[] = [1, 3, 6, 12]): HistoryPoint[] {
  const now = new Date()
  return monthsAhead.map((m) => {
    const d = new Date(now.getFullYear(), now.getMonth() + m, 1)
    const label = d.toLocaleDateString('ru-RU', { month: 'short', year: '2-digit' })
    const value = Math.min(100, Math.max(0, currentIndex + trend * m))
    return { label, index: Math.round(value * 10) / 10, isForecast: true }
  })
}
