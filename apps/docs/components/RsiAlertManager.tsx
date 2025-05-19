'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Bell, BellOff } from 'lucide-react'

interface RsiAlertManagerProps {
  data: { symbol: string; rsi: number }[]
  interval: string
}

export default function RsiAlertManager({ data, interval }: RsiAlertManagerProps) {
  const alertAudioRef = useRef<HTMLAudioElement | null>(null)
  const prevSymbolsRef = useRef<Set<string>>(new Set())
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem('rsi-alert-enabled')
    return saved !== 'false'
  })

  useEffect(() => {
    localStorage.setItem('rsi-alert-enabled', enabled.toString())
  }, [enabled])

  useEffect(() => {
    if (interval !== '5m') return // ✅ 조건 추가: 5분봉이 아닐 때 무시

    const currentHigh = new Set(data.filter((d) => d.rsi >= 60).map((d) => d.symbol))
    const newlyHigh = [...currentHigh].filter((symbol) => !prevSymbolsRef.current.has(symbol))

    if (enabled && newlyHigh.length > 0 && alertAudioRef.current) {
      alertAudioRef.current.play().catch((e) => {
        console.warn('Audio play failed:', e)
      })
    }

    prevSymbolsRef.current = currentHigh
  }, [data, enabled, interval])

  if (interval !== '5m') return null // ✅ 알림 아이콘도 5분봉에서만 렌더링

  return (
    <div className="flex items-center gap-2">
      <audio ref={alertAudioRef} src="/alert.mp3" preload="auto" />
      <button
        onClick={() => setEnabled((prev) => !prev)}
        className="text-muted-foreground flex items-center gap-1 hover:text-white"
      >
        {enabled ? <Bell size={18} /> : <BellOff size={18} />}
      </button>
    </div>
  )
}
