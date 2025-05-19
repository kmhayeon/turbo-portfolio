import React from 'react'
import './globals.css'

export const metadata = {
  title: 'Turtures',
  description: 'Turtures',
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
