import React from 'react'
import './globals.css'
import { Toaster } from '@repo/ui'

export const metadata = {
  title: 'Turtures',
  description: 'Turtures',
  icons: {
    icon: '/favicon.ico',
    apple: '/TURTURES_5.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
