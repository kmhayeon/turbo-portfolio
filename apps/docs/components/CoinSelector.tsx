'use client'

import { useEffect, useState } from 'react'

type Props = {
  onSelect: (symbol: string) => void
}

export default function CoinSelector({ onSelect }: Props) {
  const [symbols, setSymbols] = useState<string[]>([])
  const [selected, setSelected] = useState<string>('BTCUSDT')

  useEffect(() => {
    fetch('/api/symbols')
      .then((res) => res.json())
      .then(setSymbols)
  }, [])

  useEffect(() => {
    onSelect(selected)
  }, [selected])

  return (
    <select value={selected} onChange={(e) => setSelected(e.target.value)} className="border p-2">
      {symbols.map((symbol) => (
        <option key={symbol} value={symbol}>
          {symbol}
        </option>
      ))}
    </select>
  )
}
