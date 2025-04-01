'use client'

import Image from 'next/image'

export default function Portfolio() {
  return (
    <section id="portfolio" className="mx-auto max-w-6xl border-t px-4 py-16">
      <h2 className="mb-8 text-xl font-semibold">Portfolio</h2>
      <div className="grid grid-cols-2 gap-6">
        <Image src="/d-aid.png" alt="D.aid" width={500} height={300} className="rounded-md" />
        <Image
          src="/yellowbus.png"
          alt="Yellowbus"
          width={500}
          height={300}
          className="rounded-md"
        />
        <Image src="/medipang.png" alt="Medipang" width={500} height={300} className="rounded-md" />
        <Image src="/finut.png" alt="Finut" width={500} height={300} className="rounded-md" />
      </div>
    </section>
  )
}
