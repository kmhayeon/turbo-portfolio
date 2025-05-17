import React from 'react'
import './globals.css'
import { Header } from '@/components/Header'

export const metadata = {
  title: 'Binance Futures',
  description: 'Binance Futures',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
