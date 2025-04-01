'use client'

import Image from 'next/image'

export default function Hero() {
  return (
    <section id="hero" className="flex flex-col items-center bg-gray-100 py-16 pt-20 text-center">
      <Image src={'../public/avatar.png'} width={250} height={250} alt="avatar" />
      <h1 className="mt-4 text-3xl font-bold">Hi, I'm Hayeon.</h1>
      <p className="text-gray-600">FrontEnd Developer</p>
      <a
        href="mailto:kmhayeon12@gmail.com"
        className="mt-2 text-sm text-gray-500 transition-colors hover:text-yellow-400"
      >
        kmhayeon12@gmail.com
      </a>
    </section>
  )
}
