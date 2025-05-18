'use client'

import { useEffect, useState } from 'react'
import { Info } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../packages/ui/src/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../packages/ui/src/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../packages/ui/src/tooltip'
import { Card, CardContent } from '@repo/ui'
import { calculateWilderRSI } from '../lib/rsi'
import {
  fetchFuturesKlines,
  fetchFuturesAmount,
  fetchTopFuturesSymbols,
  fetchFutures24hVolume,
  intervalTo1mCount,
} from '../lib/binance-futures'
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

const REFRESH_INTERVAL_MS = 300_000 // 5분

export default function FuturesRsiTable() {
  const [interval, setInterval] = useState('5m')
  const [data, setData] = useState<
    { symbol: string; rsi: number; amount: number; volume24h: number }[]
  >([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<'rsi' | 'amount'>('amount')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState<number>(REFRESH_INTERVAL_MS / 1000)

  const loadData = async () => {
    setLoading(true)
    try {
      const symbols = await fetchTopFuturesSymbols(100)
      const results = await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const closes = await fetchFuturesKlines(symbol, interval)
            const rsi = calculateWilderRSI(closes)
            const amount = await fetchFuturesAmount(symbol, interval)
            const volume24h = await fetchFutures24hVolume(symbol)
            return { symbol, rsi, amount, volume24h }
          } catch {
            return null
          }
        }),
      )
      // const filtered = results.filter(
      //   (r): r is { symbol: string; rsi: number; amount: number; volume24h: number } => r !== null,
      // )
      const filtered = results.filter(
        (r): r is { symbol: string; rsi: number; amount: number; volume24h: number } =>
          r !== null && r.amount > 0,
      )
      setData(filtered)
      setLastUpdated(new Date())
      setCountdown(REFRESH_INTERVAL_MS / 1000)
    } catch (err) {
      console.error('선물 마켓 데이터 로딩 실패:', err)
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

  const toggleSort = (key: 'rsi' | 'amount') => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortOrder('desc')
    }
  }

  const getCoinName = (symbol: string) => symbol.replace('USDT', '')
  const getCoinLogo = (symbol: string) => {
    return `https://cryptoicon-api.pages.dev/api/icon/${getCoinName(symbol).toLowerCase()}`
  }

  return (
    <div className="p-6">
      <TooltipProvider>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={interval} onValueChange={setInterval}>
              <SelectTrigger className="w-[120px]">
                <SelectValue>{intervalLabels[interval]}</SelectValue>
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
                    onClick={() => toggleSort('amount')}
                  >
                    거래대금 {sortBy === 'amount' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </TableHead>
                  {/*<TableHead className="text-right">*/}
                  {/*  <div className="flex items-center justify-end gap-1">*/}
                  {/*    거래대금(24H)*/}
                  {/*    <Tooltip>*/}
                  {/*      <TooltipTrigger asChild>*/}
                  {/*        <Info className="text-muted-foreground h-4 w-4 cursor-help" />*/}
                  {/*      </TooltipTrigger>*/}
                  {/*      <TooltipContent>*/}
                  {/*        <div className="text-left text-sm">*/}
                  {/*          - 선택한 봉 간격의 누적 거래대금입니다.*/}
                  {/*          <br />- 24H 거래대금: 최근 24시간 동안의 선물 마켓 거래대금입니다.*/}
                  {/*        </div>*/}
                  {/*      </TooltipContent>*/}
                  {/*    </Tooltip>*/}
                  {/*  </div>*/}
                  {/*</TableHead>*/}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="p-4 text-center">
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
                        className={`text-right ${
                          coin.rsi >= 70 ? 'text-red-500' : coin.rsi <= 30 ? 'text-green-500' : ''
                        }`}
                      >
                        {coin.rsi.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">{formatKoreanUnit(coin.amount)}</TableCell>
                      {/*<TableCell className="text-right">*/}
                      {/*  {formatKoreanUnit(coin.volume24h)}*/}
                      {/*</TableCell>*/}
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
