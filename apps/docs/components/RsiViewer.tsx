// apps/rsi-app/components/RsiChart.tsx
'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

type Props = {
  symbol: string
  interval: string
}

type RsiPoint = { index: number; value: number }

export default function RsiChart({ symbol, interval }: Props) {
  const [rsiData, setRsiData] = useState<RsiPoint[]>([])

  const fetchRsi = async () => {
    const res = await fetch(`/api/rsi?symbol=${symbol}&interval=${interval}`)
    const data = await res.json()
    setRsiData(data)
  }

  useEffect(() => {
    fetchRsi()
    // const id = setInterval(fetchRsi, 60_000) // 1분마다 자동 갱신
    const id = setInterval(fetchRsi, 300_000) // 5분마다 자동 갱신
    return () => clearInterval(id)
  }, [symbol, interval])

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold">
        {symbol} RSI ({interval})
      </h2>
      <LineChart width={600} height={300} data={rsiData}>
        <XAxis dataKey="index" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
      </LineChart>
    </div>
  )
}

// // apps/rsi-app/components/RsiChart.tsx
// 'use client'
//
// import { useEffect, useState } from 'react'
// import { fetchKlines } from '../lib/binance'
// import { calculateRSI } from '../lib/rsi'
// import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
//
// type Props = {
//   symbol: string
//   interval: string
// }
//
// export default function RsiChart({ symbol, interval }: Props) {
//   const [rsiData, setRsiData] = useState<{ value: number; index: number }[]>([])
//
//   const update = async () => {
//     const closes = await fetchKlines(symbol, interval)
//     const rsi = calculateRSI(closes)
//     const result = rsi.map((value, index) => ({ index, value }))
//     setRsiData(result)
//   }
//
//   useEffect(() => {
//     update()
//     const id = setInterval(update, 60_000) // 1분마다
//     return () => clearInterval(id)
//   }, [symbol, interval])
//
//   return (
//     <div className="mt-4">
//       <h2>
//         {symbol} - RSI ({interval})
//       </h2>
//       <LineChart width={600} height={300} data={rsiData}>
//         <XAxis dataKey="index" />
//         <YAxis domain={[0, 100]} />
//         <Tooltip />
//         <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
//       </LineChart>
//     </div>
//   )
// }
