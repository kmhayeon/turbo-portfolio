'use client'

import { useEffect, useState } from 'react'
import { Github } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [visitorCount, setVisitorCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/visitor', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        console.log('data.count', data.count)
        setVisitorCount(data.count)
      })
  }, [])

  return (
    <footer className="border-t px-4 py-8">
      <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          Total Visitors: {visitorCount !== null && `${visitorCount.toLocaleString()}`}
        </p>

        <div className="mt-2 flex items-center justify-center gap-2 sm:mt-0 sm:justify-end">
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
      </div>
    </footer>
  )
}
