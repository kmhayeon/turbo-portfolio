'use client'

import { useEffect } from 'react'

type ToastProps = {
  message: string
  onClose: () => void
  duration?: number
}

export default function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div className="animate-fade-in fixed bottom-6 right-6 z-50 rounded bg-black px-4 py-2 text-white shadow-md">
      {message}
    </div>
  )
}
