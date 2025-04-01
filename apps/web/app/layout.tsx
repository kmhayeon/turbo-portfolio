import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Turbo Portfolio',
  description: 'Made with Next.js 14 + Tailwind CSS + Turborepo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
