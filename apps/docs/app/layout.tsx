import React from 'react'
import './globals.css'

export const metadata = {
  title: 'RSI',
  description: 'RSI',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
