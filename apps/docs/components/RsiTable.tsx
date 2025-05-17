'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronsUpDown } from 'lucide-react'

const RSI_INTERVALS = ['5m', '15m', '1h', '4h', '12h', '1d']
const INTERVAL_LABELS: Record<string, string> = {
  '5m': '5분',
  '15m': '15분',
  '1h': '1시간',
  '4h': '4시간',
  '12h': '12시간',
  '1d': '24시간',
}

type RsiData = {
  symbol: string
  price: number
  change1h: number
  change24h: number
  volume: number
  volume_5m?: number
  volume_1h?: number
  [key: string]: number | string | undefined
}

export default function RsiTable() {
  const [data, setData] = useState<RsiData[]>([])
  const [page, setPage] = useState(1)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [timer, setTimer] = useState<number>(300)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchData = async () => {
    const res = await fetch(`/api/rsi-table?page=${page}&sort=volume&order=${sortOrder}`)
    const json = await res.json()
    setData(json.data)
    setLastUpdated(json.updatedAt)
    setTimer(300)
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(() => fetchData(), 300_000)
    return () => clearInterval(interval)
  }, [page, sortOrder])

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(countdown)
  }, [])

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          {`${String(Math.floor(timer / 60)).padStart(2, '0')}분 ${String(timer % 60).padStart(2, '0')}초 후 갱신`}
        </span>
        <span className="text-muted-foreground text-sm">
          마지막 갱신:{' '}
          {lastUpdated
            ? new Date(lastUpdated).toLocaleTimeString('ko-KR', { hour12: false })
            : '로딩 중...'}
        </span>
      </div>

      <div className="bg-card text-card-foreground rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Symbol</TableHead>
              <TableHead
                className="cursor-pointer select-none text-right"
                onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              >
                <span className="inline-flex items-center gap-1">
                  거래량
                  <ChevronsUpDown className="text-muted-foreground h-4 w-4" />
                </span>
              </TableHead>
              <TableHead className="text-right">거래량(5분)</TableHead>
              <TableHead className="text-right">거래량(1시간)</TableHead>
              {RSI_INTERVALS.map((int) => (
                <TableHead key={int} className="text-right">
                  RSI({INTERVAL_LABELS[int]})
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.symbol}>
                <TableCell className="flex items-center gap-2 font-medium">
                  <img
                    src={`https://cryptoicon-api.pages.dev/api/icon/${row.symbol.replace('USDT', '').toLowerCase()}`}
                    alt={row.symbol}
                    className="h-5 w-5 rounded-full"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                  {row.symbol.replace('USDT', '')}
                </TableCell>
                <TableCell className="text-right">
                  {row.volume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </TableCell>
                <TableCell className="text-right">{row.volume_5m?.toLocaleString()}</TableCell>
                <TableCell className="text-right">{row.volume_1h?.toLocaleString()}</TableCell>
                {RSI_INTERVALS.map((int) => {
                  const value = row[`rsi_${int}`]
                  const color =
                    typeof value !== 'number'
                      ? ''
                      : value >= 70
                        ? 'text-red-500'
                        : value <= 30
                          ? 'text-primary'
                          : ''
                  return (
                    <TableCell key={int} className={`text-right ${color}`}>
                      {typeof value === 'number' ? value.toFixed(2) : '-'}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          이전
        </Button>
        <span className="text-sm">Page {page}</span>
        <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
          다음
        </Button>
      </div>
    </div>
  )
}
