// apps/rsi-app/lib/binance.ts

export async function fetchSupportedSymbols(): Promise<string[]> {
  const res = await fetch('https://api.binance.com/api/v3/exchangeInfo', {
    cache: 'no-store',
  })
  const data = await res.json()

  return data.symbols
    .filter((s: any) => s.status === 'TRADING' && s.quoteAsset === 'USDT')
    .map((s: any) => s.symbol)
}

export async function fetchPriceStats(symbol: string) {
  const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
  const data = await res.json()

  return {
    price: parseFloat(data.lastPrice),
    change1h: parseFloat(data.priceChangePercent), // 대안: 직접 1시간 전 Kline과 비교도 가능
    change24h: parseFloat(data.priceChangePercent),
    volume: parseFloat(data.quoteVolume), // ✅ USDT 거래량 기준
  }
}

export async function fetchKlines(
  symbol: string,
  interval: string,
  limit = 100,
): Promise<number[]> {
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
  )
  const data = await res.json()
  return data.map((d: any) => parseFloat(d[4])) // Close price
}

export async function fetchVolume(
  symbol: string,
  interval: string,
  limit: number,
): Promise<number> {
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
  )
  const data = await res.json()
  const volume = data.reduce((acc: number, kline: any) => acc + parseFloat(kline[7]), 0) // quoteVolume (USDT 기준)
  return parseFloat(volume.toFixed(2))
}
