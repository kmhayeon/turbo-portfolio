export function calculateWilderRSI(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 0

  let gainSum = 0
  let lossSum = 0

  // 1단계: 최초 period개로 초기 평균 계산
  for (let i = 1; i <= period; i++) {
    const diff = closes[i]! - closes[i - 1]!
    if (diff >= 0) gainSum += diff
    else lossSum -= diff
  }

  let avgGain = gainSum / period
  let avgLoss = lossSum / period

  // 2단계: smoothing (Wilder 방식)
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i]! - closes[i - 1]!
    const gain = diff > 0 ? diff : 0
    const loss = diff < 0 ? -diff : 0

    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
  }

  if (avgLoss === 0) return 100

  const rs = avgGain / avgLoss
  return 100 - 100 / (1 + rs)
}
