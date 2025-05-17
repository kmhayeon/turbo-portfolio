'use client'

import { useEffect, useState } from 'react'
import { Info } from 'lucide-react'
import { Card, CardContent } from '@repo/ui'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../packages/ui/src/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../packages/ui/src/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../packages/ui/src/table'
import { calculateWilderRSI } from '../lib/rsi'
import { fetch24hVolume, fetchKlines, fetchTopVolumeSymbols, fetchVolume } from '../lib/binance'
import { formatKoreanUnit } from '../lib/format'

const intervals = ['5m', '15m', '1h', '4h', '12h', '1d']
const intervalLabels: Record<string, string> = {
  '5m': '5분봉',
  '15m': '15분봉',
  '1h': '1시간봉',
  '4h': '4시간봉',
  '12h': '12시간봉',
  '1d': '24시간봉',
}
const REFRESH_INTERVAL_MS = 300_000

export default function Dashboard() {
  const [interval, setInterval] = useState('5m')
  const [data, setData] = useState<
    { symbol: string; rsi: number; volume: number; volume24h: number }[]
  >([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<'rsi' | 'volume'>('volume')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState<number>(REFRESH_INTERVAL_MS / 1000)

  const loadData = async () => {
    setLoading(true)
    try {
      const symbols = await fetchTopVolumeSymbols(50)
      const results = await Promise.all(
        symbols.map(async (symbol, index) => {
          try {
            const closes = await fetchKlines(symbol, interval)

            // if (index === 0) {
            //   console.log(`📊 ${symbol} (${interval}) closes:`, closes.slice(0, 20))
            // }

            const volume = await fetchVolume(symbol, interval)
            const volume24h = await fetch24hVolume(symbol)
            const rsi = calculateWilderRSI(closes)

            return { symbol, rsi, volume, volume24h }
          } catch (err) {
            console.error(`Failed to fetch ${symbol}`, err)
            return null
          }
        }),
      )

      const filtered = results.filter(
        (r): r is { symbol: string; rsi: number; volume: number; volume24h: number } => r !== null,
      )
      setData(filtered)
      setLastUpdated(new Date())
      setCountdown(REFRESH_INTERVAL_MS / 1000)
    } catch (err) {
      console.error('Failed to load data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()

    const intervalId: number = window.setInterval(() => {
      loadData()
    }, REFRESH_INTERVAL_MS)

    const countdownId: number = window.setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => {
      clearInterval(intervalId)
      clearInterval(countdownId)
    }
  }, [interval])

  const sortedData = [...data].sort((a, b) => {
    const key = sortBy
    if (sortOrder === 'asc') return a[key] - b[key]
    return b[key] - a[key]
  })

  const toggleSort = (key: 'rsi' | 'volume') => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortOrder('desc')
    }
  }

  const getCoinName = (symbol: string) => symbol.replace('USDT', '')
  const getCoinLogo = (symbol: string) => {
    const name = getCoinName(symbol).toLowerCase()
    return `https://cryptoicon-api.pages.dev/api/icon/${name}`
  }

  return (
    <div className="p-6">
      <TooltipProvider>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={interval} onValueChange={setInterval}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="봉 간격" defaultValue={interval}>
                  {intervalLabels[interval]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {intervals.map((item) => (
                  <SelectItem key={item} value={item}>
                    {intervalLabels[item]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {lastUpdated && (
              <span className="text-muted-foreground text-sm">
                {Math.floor(countdown / 60)}분 {countdown % 60}초 후 갱신
              </span>
            )}
          </div>
          {lastUpdated && (
            <span className="text-muted-foreground text-sm">
              업데이트: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>코인</TableHead>
                  <TableHead
                    className="cursor-pointer text-right hover:text-white"
                    onClick={() => toggleSort('rsi')}
                  >
                    RSI {sortBy === 'rsi' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-right hover:text-white"
                    onClick={() => toggleSort('volume')}
                  >
                    거래량 {sortBy === 'volume' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      거래량(24H)
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="text-muted-foreground h-4 w-4 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-left text-sm">
                            - 24시간봉 거래량: 오늘 자정부터 누적된 값입니다. (실시간 증가)
                            <br />- 24H 거래량: 현재 시점 기준 최근 24시간 동안의 거래량입니다.
                            (선택된 봉 간격과는 무관)
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="p-4 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedData.map((coin) => (
                    <TableRow key={coin.symbol}>
                      <TableCell className="flex items-center gap-2">
                        <img
                          src={getCoinLogo(coin.symbol)}
                          alt={coin.symbol}
                          width={20}
                          height={20}
                          onError={(e) => {
                            e.currentTarget.src = '/fallback-icon.png'
                          }}
                        />
                        {getCoinName(coin.symbol)}
                      </TableCell>
                      <TableCell
                        className={`text-right ${coin.rsi >= 70 ? 'text-red-500' : coin.rsi <= 30 ? 'text-green-500' : ''}`}
                      >
                        {coin.rsi.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">{formatKoreanUnit(coin.volume)}</TableCell>
                      <TableCell className="text-right">
                        {formatKoreanUnit(coin.volume24h)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TooltipProvider>
    </div>
  )
}
