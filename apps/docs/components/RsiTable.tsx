'use client'

import { useEffect, useState } from 'react'

type RsiData = {
  symbol: string
  price: number
  change1h: number
  change24h: number
  volume: number
  [key: string]: number | string
}

const RSI_INTERVALS = ['5m', '15m', '1h', '4h', '12h', '1d']

export default function RsiTable() {
  const [data, setData] = useState<RsiData[]>([])
  const [page, setPage] = useState(1)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [timer, setTimer] = useState<number>(60)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchData = async () => {
    const res = await fetch(`/api/rsi-table?page=${page}&sort=volume&order=${sortOrder}`)
    const json = await res.json()
    setData(json.data)
    setLastUpdated(json.updatedAt)
    setTimer(60)
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(() => fetchData(), 60_000)
    return () => clearInterval(interval)
  }, [page, sortOrder]) // ✅ sortOrder도 의존성에 포함

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(countdown)
  }, [])

  return (
    <div className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          마지막 갱신:{' '}
          {lastUpdated
            ? new Date(lastUpdated).toLocaleTimeString('ko-KR', { hour12: false })
            : '로딩 중...'}
        </span>

        <div className="flex items-center gap-4">
          {/*<button*/}
          {/*  onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}*/}
          {/*  className="text-sm text-blue-600 underline"*/}
          {/*>*/}
          {/*  거래량 {sortOrder === 'asc' ? '🔼' : '🔽'}*/}
          {/*</button>*/}
          <span className="text-sm text-gray-500">
            {`다음 갱신까지 ${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`}
          </span>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">기호</th>
              <th className="p-2 text-right">가격</th>
              <th className="p-2 text-right">1시간%</th>
              <th className="p-2 text-right">24시간%</th>
              <th
                className="cursor-pointer p-2 text-right"
                onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              >
                거래량 {sortOrder === 'asc' ? '🔼' : '🔽'}
              </th>
              {RSI_INTERVALS.map((int) => (
                <th key={int} className="p-2 text-right">{`RSI(${int})`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.symbol} className="border-t border-gray-100">
                <td className="p-2 font-medium">{row.symbol}</td>
                <td className="p-2 text-right">${row.price.toFixed(4)}</td>
                <td
                  className={`p-2 text-right ${row.change1h >= 0 ? 'text-green-600' : 'text-red-500'}`}
                >
                  {row.change1h.toFixed(2)}%
                </td>
                <td
                  className={`p-2 text-right ${row.change24h >= 0 ? 'text-green-600' : 'text-red-500'}`}
                >
                  {row.change24h.toFixed(2)}%
                </td>
                <td className="p-2 text-right">
                  {row.volume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
                {RSI_INTERVALS.map((int) => {
                  const value = row[`rsi_${int}`]
                  const color =
                    typeof value !== 'number'
                      ? ''
                      : value >= 70
                        ? 'text-red-500'
                        : value <= 30
                          ? 'text-blue-500'
                          : ''
                  return (
                    <td key={int} className={`p-2 text-right ${color}`}>
                      {value !== null && typeof value === 'number' ? value.toFixed(2) : '-'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="rounded border px-4 py-1 disabled:opacity-50"
        >
          이전
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)} className="rounded border px-4 py-1">
          다음
        </button>
      </div>
    </div>
  )
}
