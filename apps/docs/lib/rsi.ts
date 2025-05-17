// apps/rsi-app/lib/rsi.ts

export function calculateRSI(closes: number[], period = 14): number | null {
  if (closes.length < period + 1) return null

  let gains = 0
  let losses = 0

  for (let i = 1; i <= period; i++) {
    const change = closes[i]! - closes[i - 1]!
    if (change >= 0) gains += change
    else losses -= change
  }

  gains /= period
  losses /= period

  let rs = gains / losses
  let rsi = 100 - 100 / (1 + rs)

  return parseFloat(rsi.toFixed(2))
}
