'use client'

import dynamic from 'next/dynamic'
import { Header } from '@/components/Header'
import React from 'react'

const RsiTable = dynamic(() => import('../components/RsiTable'), { ssr: false })
const FuturesRsiTable = dynamic(() => import('../components/FuturesRsiTable'), { ssr: false })

// export default function Page() {
//   return (
//     <main>
//       <Header />
//       {/*<div className="flex flex-col gap-4 p-6 lg:flex-row">*/}
//       <div className="w-full">
//         {/*<div className="w-full lg:w-1/2">*/}
//         {/*  <h1 className="mb-2 text-lg font-bold">현물 마켓</h1>*/}
//         {/*  <RsiTable />*/}
//         {/*</div>*/}
//         {/*<div className="w-full lg:w-1/2">*/}
//         {/*<h1 className="mb-2 text-lg font-bold">선물 마켓</h1>*/}
//         <FuturesRsiTable />
//         {/*</div>*/}
//       </div>
//     </main>
//   )
// }

export default function Page() {
  return (
    <main>
      <Header />
      <div className="flex flex-col gap-4 !p-2 p-2 lg:flex-row lg:p-6">
        <div className="w-full lg:w-1/2">
          <FuturesRsiTable />
        </div>
      </div>
    </main>
  )
}
