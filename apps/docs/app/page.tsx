'use client'

import dynamic from 'next/dynamic'
import { Header } from '@/components/Header'
import React from 'react'
import Footer from '@/components/Footer'

const FuturesRsiTable = dynamic(() => import('../components/FuturesRsiTable'), { ssr: false })

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="flex min-h-[600px] flex-col gap-4 !p-2 p-2 lg:flex-row lg:p-6">
          <div className="w-full lg:w-1/2">
            <FuturesRsiTable />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
