// apps/rsi-app/app/page.tsx
'use client'

import dynamic from 'next/dynamic'
import { Header } from '@/components/Header'
import React from 'react'

const RsiTable = dynamic(() => import('../components/RsiTable'), { ssr: false })

export default function Page() {
  return (
    <main>
      <Header />
      <RsiTable />
    </main>
  )
}
