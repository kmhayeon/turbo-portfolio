'use client'

import Image from 'next/image'

export default function Hero() {
  return (
    <section id="hero" className="flex flex-col items-center bg-gray-100 py-16 text-center">
      <Image src="/avatar.svg" alt="avatar" width={120} height={120} className="rounded-full" />
      <h1 className="mt-4 text-3xl font-bold">Hi, I'm Hayeon.</h1>
      <p className="text-gray-600">FrontEnd Developer</p>
      <p className="mt-2 text-sm text-gray-500">kmhayeon12@gmail.com</p>
    </section>
  )
}
