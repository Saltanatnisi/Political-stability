import { useCallback, useMemo, useState } from 'react'
import { BLOCKS, CRISIS_COEFFICIENTS, REGIONS } from '../data/methodology'
import {
  applyCrisisCoefficient,
  calcBlockScore,
  calcDynamicsCoefficient,
  calcIntegralIndex,
  calcRegionalIndex,
  calcRiskCoefficient,
  getRiskLevel,
  getScenario,
  getStabilityLevel,
  getTrafficLight,
} from '../lib/calculations'
import {
  generateForecast,
  generateHistory,
  generateNationalIndicators,
  generateRegionalBlockScores,
  type IndicatorValues,
} from '../lib/mockData'

export function useIpuData() {
  const [indicatorValues, setIndicatorValues] = useState<IndicatorValues>(() => generateNationalIndicators())
  const [crisisCoefficientId, setCrisisCoefficientId] = useState<string>('stable')
  const [regionSeed, setRegionSeed] = useState(0)
  const [historySeed, setHistorySeed] = useState(0)

  const blockScores = useMemo(() => {
    const scores: Record<string, number> = {}
    BLOCKS.forEach((block) => {
      const values = block.indicators.map((ind) => indicatorValues[ind.code] ?? 0)
      scores[block.id] = calcBlockScore(values)
    })
    return scores
  }, [indicatorValues])

  const { index, results } = useMemo(() => calcIntegralIndex(blockScores), [blockScores])

  const crisisCoefficient = useMemo(
    () => CRISIS_COEFFICIENTS.find((c) => c.id === crisisCoefficientId) ?? CRISIS_COEFFICIENTS[0],
    [crisisCoefficientId],
  )

  const adjustedIndex = useMemo(
    () => applyCrisisCoefficient(index, crisisCoefficient.value),
    [index, crisisCoefficient],
  )

  const riskCoefficient = useMemo(() => calcRiskCoefficient(adjustedIndex), [adjustedIndex])
  const stabilityLevel = useMemo(() => getStabilityLevel(adjustedIndex), [adjustedIndex])
  const trafficLight = useMemo(() => getTrafficLight(adjustedIndex), [adjustedIndex])
  const riskLevel = useMemo(() => getRiskLevel(riskCoefficient), [riskCoefficient])
  const scenario = useMemo(() => getScenario(adjustedIndex), [adjustedIndex])

  const history = useMemo(
    () => generateHistory(adjustedIndex),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [adjustedIndex, historySeed],
  )

  const trend = useMemo(() => {
    if (history.length < 2) return 0
    const dyn = calcDynamicsCoefficient(history[history.length - 1].index, history[history.length - 2].index)
    return dyn
  }, [history])

  const forecast = useMemo(() => generateForecast(adjustedIndex, trend), [adjustedIndex, trend])

  const regionalScores = useMemo(
    () => generateRegionalBlockScores(blockScores),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [blockScores, regionSeed],
  )

  const regionalResults = useMemo(() => {
    return REGIONS.map((region) => {
      const record = regionalScores.find((r) => r.regionId === region.id)
      const scores = record?.scores ?? {}
      const blockScoreList = BLOCKS.map((b) => scores[b.id] ?? 0)
      const regionalIndex = calcRegionalIndex(blockScoreList)
      return {
        region,
        blockScores: scores,
        index: regionalIndex,
        risk: calcRiskCoefficient(regionalIndex),
        stability: getStabilityLevel(regionalIndex),
        trafficLight: getTrafficLight(regionalIndex),
      }
    }).sort((a, b) => b.index - a.index)
  }, [regionalScores])

  const updateIndicator = useCallback((code: number, value: number) => {
    setIndicatorValues((prev) => ({ ...prev, [code]: value }))
  }, [])

  const regenerateNational = useCallback(() => {
    setIndicatorValues(generateNationalIndicators(60 + Math.random() * 30, `seed-${Date.now()}`))
    setRegionSeed((s) => s + 1)
    setHistorySeed((s) => s + 1)
  }, [])

  const regenerateRegions = useCallback(() => {
    setRegionSeed((s) => s + 1)
  }, [])

  return {
    indicatorValues,
    updateIndicator,
    blockScores,
    blockResults: results,
    index,
    crisisCoefficient,
    crisisCoefficientId,
    setCrisisCoefficientId,
    adjustedIndex,
    riskCoefficient,
    stabilityLevel,
    trafficLight,
    riskLevel,
    scenario,
    history,
    forecast,
    trend,
    regionalResults,
    regenerateNational,
    regenerateRegions,
  }
}

export type IpuData = ReturnType<typeof useIpuData>
