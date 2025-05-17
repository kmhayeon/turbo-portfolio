// apps/rsi-app/app/api/symbols/route.ts

import { fetchSupportedSymbols } from '../../../lib/binance'
import { NextResponse } from 'next/server'

export async function GET() {
  const symbols = await fetchSupportedSymbols()
  return NextResponse.json(symbols.slice(0, 20)) // 일부만 반환
}
