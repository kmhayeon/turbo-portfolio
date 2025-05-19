'use client'

import React from 'react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="text-muted-foreground w-full border-t border-gray-800 px-6 py-4 text-sm">
      <div className="flex items-center justify-end">
        Copyright {year}. Bukgeo. All rights reserved.
      </div>
    </footer>
  )
}
