'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const portfolioItems = [
  {
    alt: 'D.aid',
    description:
      'D.aid는 마케팅 데이터를 시각화하여<br />효율적인 세그먼트를 사용해 타겟팅을 높이는 플랫폼입니다.',
    images: ['/01.png', '/01-1.png', '/01-2.png', '/01-3.png'],
  },
  {
    alt: 'Yellowbus',
    description: 'Yellowbus는 통학 차량 관리를 위한<br />실시간 위치 추적 및 관리 서비스입니다.',
    images: ['/02.png', '/02-1.png', '/02-2.png', '/02-3.png'],
  },
  {
    alt: 'Medipangpang',
    description: 'Medipangpang은 병원과 환자를 연결하는<br />스마트 예약 및 상담 시스템입니다.',
    images: [
      '/03.png',
      '/03-1.png',
      '/03-2.png',
      '/03-3.png',
      '/03-4.png',
      '/03-5.png',
      '/03-6.png',
    ],
  },
  {
    alt: 'VivityAI',
    description: '중공업의 공정을 시각화하고<br />분석하는 AI 기반 솔루션입니다.',
    images: [
      '/04.png',
      '/04-1.png',
      '/04-2.png',
      '/04-3.png',
      '/04-4.png',
      '/04-5.png',
      '/04-6.png',
    ],
  },
]

export default function Portfolio() {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [slideIndex, setSlideIndex] = useState(0)

  const closeModal = () => {
    setCurrentIndex(null)
    setSlideIndex(0)
  }

  const showPrevSlide = () => {
    if (currentIndex === null) return
    const images = portfolioItems[currentIndex]!.images.slice(1)
    setSlideIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const showNextSlide = () => {
    if (currentIndex === null) return
    const images = portfolioItems[currentIndex]!.images.slice(1)
    setSlideIndex((prev) => (prev + 1) % images.length)
  }

  return (
    <section id="portfolio" className="mx-auto max-w-6xl border-t px-4 py-16">
      <h2 className="mb-8 text-xl font-semibold">Portfolio</h2>

      <div className="grid grid-cols-2 gap-6">
        {portfolioItems.map((item, idx) => (
          <div
            key={idx}
            className="group relative w-full max-w-[500px] cursor-pointer overflow-hidden rounded-md"
            onClick={() => {
              setCurrentIndex(idx)
              setSlideIndex(0)
            }}
          >
            <Image
              src={item.images[0]!}
              alt={item.alt}
              width={500}
              height={300}
              className="block h-auto w-full rounded-md transition duration-300"
              priority
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition duration-300 group-hover:opacity-100" />
          </div>
        ))}
      </div>

      {currentIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative h-[550px] w-full max-w-4xl rounded-lg bg-white p-6">
            <button
              className="absolute right-4 top-4 text-2xl text-gray-600 hover:text-black"
              onClick={closeModal}
            >
              ✕
            </button>

            <div className="flex h-full items-center justify-between">
              <button onClick={showPrevSlide} className="p-2">
                <ChevronLeft className="h-6 w-6 text-gray-700 hover:text-black" />
              </button>

              <div className="flex max-h-full flex-col items-center overflow-y-auto px-4 text-center">
                <Image
                  src={portfolioItems[currentIndex]!.images[1 + slideIndex]!}
                  alt={portfolioItems[currentIndex]!.alt}
                  width={480}
                  height={288}
                  className="rounded-md"
                  priority
                />
                <p
                  className="mt-8 text-gray-700"
                  dangerouslySetInnerHTML={{ __html: portfolioItems[currentIndex]!.description }}
                />
                <p className="mt-4 text-sm text-gray-500">
                  ({slideIndex + 1}/{portfolioItems[currentIndex]!.images.length - 1})
                </p>
              </div>

              <button onClick={showNextSlide} className="p-2">
                <ChevronRight className="h-6 w-6 text-gray-700 hover:text-black" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
