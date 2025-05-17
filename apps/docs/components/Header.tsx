'use client'

import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-background text-foreground border-b">
      <div className="mx-auto flex items-center px-6 py-6 pl-4 pr-4">
        <div className="text-white-500 text-lg font-bold">Binance RSI</div>
        <nav className="flex gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-foreground px-10 text-sm text-gray-500 no-underline hover:text-white"
          >
            수익률 비교
          </Link>
        </nav>
      </div>
    </header>
  )
}
