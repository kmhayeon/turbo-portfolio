'use client'

import { Github } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t px-4 py-8">
      <div className="flex w-full items-center justify-end gap-2">
        <a
          href="https://github.com/kmhayeon"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 transition hover:text-black"
        >
          <Github className="h-5 w-5" />
        </a>

        <p className="text-sm text-gray-500">
          Copyright {currentYear}. Hayeon. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
