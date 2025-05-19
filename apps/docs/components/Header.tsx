'use client'

export function Header() {
  return (
    <header className="bg-background text-foreground border-b">
      <div className="mx-auto flex items-center px-6 py-6">
        <img src="/logo.png" alt="Binance Futures Logo" width={25} height={25} />
        <div className="pl-2 text-xl font-bold text-white">Binance Futures</div>
      </div>
    </header>
  )
}
