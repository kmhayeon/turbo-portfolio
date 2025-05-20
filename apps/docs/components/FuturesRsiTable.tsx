'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@repo/ui'
import { ArrowDownUp, Bell, BellOff, RefreshCw } from 'lucide-react'
import { isEqual } from 'lodash'
import { toast } from '@repo/ui'

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
import { TooltipProvider } from '../../../packages/ui/src/tooltip'
import { calculateWilderRSI } from '../lib/rsi'
import {
  fetchFuturesAmount,
  fetchFuturesKlines,
  fetchTopFuturesSymbolsWithVolume,
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
      const symbolsWithVolume = await fetchTopFuturesSymbolsWithVolume(100)

      const results = await Promise.all(
        symbolsWithVolume.map(async ({ symbol, volume24h }) => {
          try {
            const closes = await fetchFuturesKlines(symbol, interval)
            const rsi = calculateWilderRSI(closes)
            const amount = await fetchFuturesAmount(symbol, interval)

            return { symbol, rsi, amount, volume24h }
          } catch {
            return null
          }
        }),
      )

      const failedCount = results.filter((r) => r === null).length
      const filtered = results.filter(
        (r): r is { symbol: string; rsi: number; amount: number; volume24h: number } =>
          r !== null && r.amount > 0,
      )

      const isSame = isEqual(data, filtered)

      if (!isSame) {
        setData(filtered)
        setLastUpdated(new Date())
        setCountdown(REFRESH_INTERVAL_MS / 1000)
      }

      // ✅ 실패한 심볼이 있으면 토스트 출력
      if (failedCount > 0) {
        toast({
          title: `${failedCount}개의 심볼 데이터 불러오기 실패`,
          description: (
            <>
              일부 코인은 표시되지 않을 수 있습니다.
              <br />
              1분 뒤에 새로고침을 클릭해주세요.
            </>
          ),
          variant: 'destructive',
        })
      }
    } catch (err: any) {
      if (err.message.includes('429')) {
        toast({
          title: '데이터 갱신 실패',
          description: '1분 뒤에 다시 시도해주세요.',
          variant: 'destructive',
        })
      } else if (err.message.includes('418')) {
        toast({
          title: '요청 차단',
          description: (
            <>
              과도한 요청으로 바이낸스에서 일시적으로 차단되었습니다.
              <br />
              IP 변경 또는 잠시 후 다시 시도해주세요.
            </>
          ),
          variant: 'destructive',
        })
      } else {
        console.error('선물 마켓 데이터 로딩 실패:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // 컴포넌트 마운트 시 1회 실행
    loadData()

    const intervalId = window.setInterval(() => {
      loadData()
    }, REFRESH_INTERVAL_MS)

    const countdownId = window.setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => {
      clearInterval(intervalId)
      clearInterval(countdownId)
    }
  }, []) // ✅ 타이머는 최초 1번만 설정

  useEffect(() => {
    // ✅ interval이 바뀔 때마다 데이터 즉시 갱신 (타이머는 건들지 않음)
    loadData()
  }, [interval])

  const sortedData = [...data].sort((a, b) => {
    const key = sortBy
    return sortOrder === 'asc' ? a[key] - b[key] : b[key] - a[key]
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
  const getCoinLogo = (symbol: string) =>
    `https://cryptoicon-api.pages.dev/api/icon/${getCoinName(symbol).toLowerCase()}`

  const alertAudioRef = useRef<HTMLAudioElement | null>(null)
  const [alertEnabled, setAlertEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rsi-alert-enabled') !== 'false'
    }
    return true
  })
  const lastAlertTimeRef = useRef<number | null>(null)

  useEffect(() => {
    localStorage.setItem('rsi-alert-enabled', alertEnabled.toString())
  }, [alertEnabled])

  useEffect(() => {
    if (interval !== '5m') return
    if (loading) return // ⛔ 로딩 중일 땐 무시

    const now = Date.now()
    const hasHighRsi = data.some((d) => d.rsi >= 75)

    const shouldAlert = alertEnabled && hasHighRsi

    if (shouldAlert) {
      alertAudioRef.current?.play().catch((e) => {
        console.warn('🔕 Audio play failed:', e)
      })
      lastAlertTimeRef.current = now
    }
  }, [data, interval, loading])

  return (
    <>
      <div className="flex items-center">
        <h1 className="pl-2 pr-3 pt-3 text-lg font-bold lg:pl-6">Futures Trading</h1>
        <div className="pt-3">
          {interval === '5m' && (
            <div className="flex items-center gap-2">
              <audio ref={alertAudioRef} src="/alert.mp3" preload="auto" />
              <button
                onClick={() => setAlertEnabled((prev) => !prev)}
                className="text-muted-foreground flex items-center gap-1 hover:text-white"
              >
                {alertEnabled ? <Bell size={18} /> : <BellOff size={18} />}
              </button>
            </div>
          )}
        </div>
      </div>

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
            <div className="text-muted-foreground flex items-center justify-between gap-4 pt-2 text-sm sm:ml-auto sm:justify-normal sm:pt-0">
              {lastUpdated && (
                <span className="text-muted-foreground pt-2 text-sm sm:ml-auto sm:pt-0">
                  UPDATE: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={() => {
                  loadData()
                  setCountdown(REFRESH_INTERVAL_MS / 1000)
                }}
                className="border-muted-foreground hover:bg-muted/20 rounded-md border p-1 transition"
                title="새로고침"
              >
                <RefreshCw size={16} className="text-muted-foreground" />
              </button>
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
                            src={`/${getCoinName(coin.symbol).toUpperCase()}.png`}
                            alt={coin.symbol}
                            width={20}
                            height={20}
                            onError={(e) => {
                              const symbol = getCoinName(coin.symbol).toLowerCase()
                              const fallbackURL = `https://cryptoicon-api.pages.dev/api/icon/${symbol}`

                              // 첫 실패 시 외부 API로 대체
                              if (!e.currentTarget.dataset.retry) {
                                e.currentTarget.src = fallbackURL
                                e.currentTarget.dataset.retry = '1'
                              } else {
                                // 두 번째 실패 시 기본 아이콘
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
