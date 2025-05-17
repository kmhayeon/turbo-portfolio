// apps/rsi-app/app/api/rsi/route.ts

import { fetchKlines } from '../../../lib/binance'
import { calculateRSI } from '../../..//lib/rsi'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const symbol = searchParams.get('symbol')
  const interval = searchParams.get('interval') ?? '5m'

  if (!symbol) {
    return NextResponse.json({ error: 'Missing symbol' }, { status: 400 })
  }

  try {
    const closes = await fetchKlines(symbol, interval, 100)
    const rsi = calculateRSI(closes)
    const result = rsi.map((value, index) => ({ index, value }))

    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch RSI' }, { status: 500 })
  }
}
