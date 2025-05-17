// apps/rsi-app/app/page.tsx
'use client'

import dynamic from 'next/dynamic'

const RsiTable = dynamic(() => import('../components/RsiTable'), { ssr: false })

export default function Page() {
  return (
    <main className="mx-auto max-w-screen-xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Binance RSI Dashboard</h1>
      <RsiTable />
    </main>
  )
}

// 'use client'
//
// import dynamic from 'next/dynamic'
// import CoinSelector from '../components/CoinSelector'
// import { useState } from 'react'
//
// const RsiChart = dynamic(() => import('../components/RsiViewer'), { ssr: false })
//
// const intervals = ['5m', '15m', '1h', '4h']
//
// export default function Home() {
//   const [symbol, setSymbol] = useState('BTCUSDT')
//   const [interval, setInterval] = useState('5m')
//
//   return (
//     <main className="p-4">
//       <h1 className="mb-4 text-2xl font-bold">Binance RSI 실시간 모니터링</h1>
//
//       <CoinSelector onSelect={setSymbol} />
//
//       <div className="mt-4 flex gap-2">
//         {intervals.map((int) => (
//           <button
//             key={int}
//             className={`rounded border px-3 py-1 ${interval === int ? 'bg-black text-white' : ''}`}
//             onClick={() => setInterval(int)}
//           >
//             {int}
//           </button>
//         ))}
//       </div>
//
//       <RsiChart symbol={symbol} interval={interval} />
//     </main>
//   )
// }
