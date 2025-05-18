/**
 * 선물 마켓에서 USDT 마켓의 거래량 상위 코인 심볼 목록을 가져옵니다.
 *
 * @param limit 가져올 심볼 수 (기본값: 100)
 * @returns 거래량 기준으로 내림차순 정렬된 심볼 문자열 배열 (ex: ["BTCUSDT", "ETHUSDT", ...])
 *
 * 필터 기준:
 * - USDT 마켓에 속한 심볼만
 * - 1000단위 토큰 및 레버리지 토큰(UP/DOWN)은 제외
 */
export async function fetchTopFuturesSymbols(limit = 100): Promise<string[]> {
  const res = await fetch('https://fapi.binance.com/fapi/v1/ticker/24hr')
  const data = await res.json()

  return data
    .filter(
      (d: any) =>
        d.symbol.endsWith('USDT') &&
        !d.symbol.includes('1000') &&
        !d.symbol.includes('DOWN') &&
        !d.symbol.includes('UP'),
    )
    .sort((a: any, b: any) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
    .slice(0, limit)
    .map((d: any) => d.symbol)
}

/**
 * 지정된 선물 마켓 심볼의 캔들 종가 목록을 가져옵니다.
 *
 * @param symbol 예: "BTCUSDT"
 * @param interval 예: "5m", "15m", "1h" 등
 * @param limit 가져올 캔들 수 (기본값: 100)
 * @returns 종가(close) 값 배열
 */
export async function fetchFuturesKlines(
  symbol: string,
  interval: string,
  limit = 100,
): Promise<number[]> {
  const res = await fetch(
    `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
  )
  const data = await res.json()
  return data.map((d: any) => parseFloat(d[4])) // [4]: 종가
}

/**
 * 지정된 심볼의 최근 interval 기간 동안의 거래대금(= 종가 × 거래량)을 계산합니다.
 * 내부적으로 1분봉 데이터를 여러 개 가져와 합산합니다.
 *
 * @param symbol 예: "BTCUSDT"
 * @param interval 예: "5m", "15m", ...
 * @returns 총 거래대금 (USD 기준 추정치)
 */
// export async function fetchFuturesAmount(symbol: string, interval: string): Promise<number> {
//   const res = await fetch(
//     `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=1m&limit=${intervalTo1mCount[interval]}`,
//   )
//   const data = await res.json()
//   return data.reduce((sum: number, d: any) => {
//     const close = parseFloat(d[4]) // 종가
//     const volume = parseFloat(d[5]) // 거래량
//     return sum + close * volume // 거래대금 = 종가 × 거래량
//   }, 0)
// }
export async function fetchFuturesAmount(symbol: string, interval: string): Promise<number> {
  const res = await fetch(
    `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=1`,
  )
  const data = await res.json()
  return parseFloat(data[0][7]) // ✅ quoteVolume (거래대금, USDT 기준)
}

/**
 * interval 값을 1분 단위 봉 개수로 변환하는 매핑 객체입니다.
 * 예: 5m → 5개, 1h → 60개, 1d → 1440개
 */
export const intervalTo1mCount: Record<string, number> = {
  '5m': 5,
  '15m': 15,
  '1h': 60,
  '4h': 240,
  '12h': 720,
  '1d': 1440,
}

/**
 * 선물 마켓에서 심볼의 최근 24시간 거래대금을 반환합니다.
 *
 * @param symbol 예: "BTCUSDT"
 * @returns 24시간 거래대금 (quoteVolume, USDT 기준)
 */
export async function fetchFutures24hVolume(symbol: string): Promise<number> {
  const res = await fetch(`https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${symbol}`)
  const data = await res.json()
  return parseFloat(data.quoteVolume)
}
