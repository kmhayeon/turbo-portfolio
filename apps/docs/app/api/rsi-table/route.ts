// apps/rsi-app/app/api/rsi-table/route.ts

import {
  fetchSupportedSymbols,
  fetchPriceStats,
  fetchKlines,
  fetchVolume,
} from '../../../lib/binance'
import { calculateRSI } from '../../../lib/rsi'
import { NextRequest, NextResponse } from 'next/server'

const RSI_INTERVALS = ['5m', '15m', '1h', '4h', '12h', '1d']
const PAGE_SIZE = 50

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const sort = searchParams.get('sort') // volume
  const order = searchParams.get('order') || 'desc' // asc | desc

  const allSymbols = await fetchSupportedSymbols()
  const pageSymbols = allSymbols.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const results = await Promise.all(
    pageSymbols.map(async (symbol) => {
      try {
        const [priceStats, volume5m, volume1h, ...rsiValues] = await Promise.all([
          fetchPriceStats(symbol),
          fetchVolume(symbol, '1m', 5), // 거래량(5m) → 1분봉 5개 합산
          fetchVolume(symbol, '1m', 60), // 거래량(1h) → 1분봉 60개 합산
          ...RSI_INTERVALS.map(async (interval) => {
            const closes = await fetchKlines(symbol, interval)
            return calculateRSI(closes)
          }),
        ])

        const rsiData = RSI_INTERVALS.reduce(
          (acc, interval, idx) => {
            // @ts-ignore
            acc[`rsi_${interval}`] = rsiValues[idx]
            return acc
          },
          {} as Record<string, number | null>,
        )

        return {
          symbol,
          ...priceStats,
          volume_5m: volume5m,
          volume_1h: volume1h,
          ...rsiData,
        }
      } catch (err) {
        console.error(`[RSI_TABLE] Error for ${symbol}`, err)
        return null
      }
    }),
  )

  let filtered = results.filter(Boolean)

  if (sort === 'volume') {
    filtered = filtered.sort((a, b) =>
      order === 'asc' ? a!.volume - b!.volume : b!.volume - a!.volume,
    )
  }

  return NextResponse.json({
    data: filtered,
    total: allSymbols.length,
    page,
    pageSize: PAGE_SIZE,
    updatedAt: new Date().toISOString(),
  })
}
