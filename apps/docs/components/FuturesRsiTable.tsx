'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@repo/ui'
import { ArrowDownUp } from 'lucide-react'
import RsiAlertManager from './RsiAlertManager'
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
import { calculateWilderRSI } from '../lib/rsi'
import {
  fetchFuturesKlines,
  fetchFuturesAmount,
  fetchTopFuturesSymbols,
  fetchFutures24hVolume,
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
    <>
      <h1 className="pl-2 pt-8 text-lg font-bold lg:pl-6">Futures Trading</h1>
      <div className="p-2 lg:p-6">
        <TooltipProvider>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
                <span className="text-muted-foreground pl-2 text-sm">
                  {Math.floor(countdown / 60)}분 {countdown % 60}초 후 갱신
                </span>
              )}
            </div>

            <div className="flex justify-between gap-3.5">
              {lastUpdated && (
                <span className="text-muted-foreground pt-2 text-sm sm:ml-auto sm:pt-0">
                  UPDATE: {lastUpdated.toLocaleTimeString()}
                </span>
              )}

              {/* 알림 아이콘 */}
              <RsiAlertManager
                interval={interval}
                data={data.map(({ symbol, rsi }) => ({ symbol, rsi }))}
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-0" style={{ backgroundColor: '#0d1116' }}>
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20px] px-1 text-center">-</TableHead>
                    <TableHead className="w-[120px] px-2">SYMBOL</TableHead>
                    <TableHead
                      className="w-[60px] cursor-pointer px-2 text-right hover:text-white"
                      onClick={() => toggleSort('rsi')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>RSI</span>
                        <ArrowDownUp
                          size={14}
                          className={sortBy === 'rsi' ? 'text-white' : 'text-muted-foreground'}
                        />
                      </div>
                    </TableHead>
                    <TableHead
                      className="w-[100px] cursor-pointer px-4 text-right hover:text-white"
                      onClick={() => toggleSort('amount')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>거래대금</span>
                        <ArrowDownUp
                          size={14}
                          className={sortBy === 'amount' ? 'text-white' : 'text-muted-foreground'}
                        />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-[500px] p-4 text-center">
                        <div className="flex h-[400px] flex-col items-center justify-center gap-4">
                          <span className="text-4xl">🐢</span>
                          <p className="text-sm text-white">Loading...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedData.map((coin, index) => (
                      <TableRow key={coin.symbol}>
                        <TableCell className="text-muted-foreground px-1 text-center text-sm">
                          {index + 1}
                        </TableCell>
                        <TableCell className="flex items-center gap-2 px-2">
                          <img
                            src={getCoinLogo(coin.symbol)}
                            alt={coin.symbol}
                            width={20}
                            height={20}
                            onError={(e) => {
                              const symbol = getCoinName(coin.symbol).toUpperCase()
                              const fallbackPath = `/${symbol}.png`
                              if (!e.currentTarget.dataset.retry) {
                                e.currentTarget.src = fallbackPath
                                e.currentTarget.dataset.retry = '1'
                              } else {
                                e.currentTarget.src = '/fallback-icon.png'
                              }
                            }}
                          />
                          {getCoinName(coin.symbol)}
                        </TableCell>
                        <TableCell
                          className={`w-[60px] px-2 text-right ${
                            coin.rsi >= 70 ? 'text-red-500' : coin.rsi <= 30 ? 'text-green-500' : ''
                          }`}
                        >
                          {coin.rsi.toFixed(2)}
                        </TableCell>
                        <TableCell className="w-[100px] px-4 text-right">
                          {formatKoreanUnit(coin.amount)}
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
    </>
  )
}
