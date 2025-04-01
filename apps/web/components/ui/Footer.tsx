'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t px-4 py-8">
      <div className="flex w-full justify-end">
        <p className="text-sm text-gray-500">
          Copyright {currentYear}. Hayeon. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
