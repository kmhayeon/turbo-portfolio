// /**
//  * 주어진 종가 배열(closes)과 기간(period)을 바탕으로 RSI를 계산합니다.
//  *
//  * @param closes - 종가 배열 (최신 가격일수록 뒤쪽에 위치해야 함)
//  * @param period - RSI를 계산할 기준 기간 (기본값은 14)
//  * @returns RSI 값 (0~100 범위의 숫자)
//  */
// export function calculateRSI(closes: number[], period = 14): number {
//   let gains = 0,
//     losses = 0
//
//   // 최근 period 동안의 상승/하락폭 누적
//   for (let i = 1; i <= period; i++) {
//     const diff = closes[i]! - closes[i - 1]! // 현재 종가 - 이전 종가
//
//     if (diff >= 0)
//       gains += diff // 상승분은 gain에 누적
//     else losses -= diff // 하락분은 loss에 누적 (음수이므로 -로 보정)
//   }
//
//   const avgGain = gains / period // 평균 상승폭
//   const avgLoss = losses / period // 평균 하락폭
//
//   // 하락이 없으면 RSI는 100 (과매수 상태)
//   if (avgLoss === 0) return 100
//
//   const rs = avgGain / avgLoss // 상대강도(RS)
//   return 100 - 100 / (1 + rs) // RSI 계산 공식
// }

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
