export function formatKoreanUnit(value: number): string {
  if (value >= 1e8) {
    return `$${(value / 1e8).toFixed(2)}억`
  } else if (value >= 1e4) {
    return `$${(value / 1e4).toFixed(2)}만`
  } else {
    return `$${value.toLocaleString()}`
  }
}
