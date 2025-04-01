import React from 'react'
import './globals.css'
import 'aos/dist/aos.css'

export const metadata = {
  title: 'Turbo Portfolio',
  description: 'Made with Next.js 14 + Tailwind CSS + Turborepo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body className="font-nanum">{children}</body>
    </html>
  )
}
