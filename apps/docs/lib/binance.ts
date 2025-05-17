/**
 * 바이낸스에서 거래량 상위 코인 심볼들을 가져온다.
 *
 * @param limit 가져올 코인 수 (기본값 50)
 * @returns USDT 마켓에서 거래량 상위 코인 심볼 배열 (ex: ["BTCUSDT", "ETHUSDT", ...])
 *
 * 필터 기준:
 * - USDT 마켓에 속한 코인만 (symbol.endsWith('USDT'))
 * - 레버리지 토큰은 제외 (symbol.includes('UP' or 'DOWN') 제외)
 * - quoteVolume 기준으로 내림차순 정렬
 */
export async function fetchTopVolumeSymbols(limit = 100): Promise<string[]> {
  const res = await fetch('https://api.binance.com/api/v3/ticker/24hr')
  const data = await res.json()

  return data
    .filter(
      (d: any) =>
        d.symbol.endsWith('USDT') && !d.symbol.includes('UP') && !d.symbol.includes('DOWN'),
    )
    .sort((a: any, b: any) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
    .slice(0, limit)
    .map((d: any) => d.symbol)
}

// 종가 리스트 반환
export async function fetchKlines(
  symbol: string,
  interval: string,
  limit = 100,
): Promise<number[]> {
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
  )
  const data = await res.json()
  return data.map((d: any) => parseFloat(d[4])) // 종가(close)
}

// 최신 봉 기준 거래량 반환
export async function fetchVolume(symbol: string, interval: string): Promise<number> {
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1`,
  )
  const data = await res.json()
  return parseFloat(data[0][7])
}

// 24시간 거래량
export async function fetch24hVolume(symbol: string): Promise<number> {
  const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
  const data = await res.json()
  return parseFloat(data.quoteVolume) // 24시간 기준 USDT 거래량
}
