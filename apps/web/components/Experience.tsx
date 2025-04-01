'use client'
import { useEffect } from 'react'
import AOS from 'aos'

export default function Experience() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true })
  }, [])

  const experiences = [
    {
      company: '오스카앤블록',
      period: '2022.12 ~ 2023.04',
      projects: [
        {
          title: '자사 홈페이지 개발',
          env: 'Typescript / React / Next.js / Styled Components',
          desc: ['오스카앤블록 자사 홈페이지 개발/운영/배포'],
        },
        {
          title: 'Finut 웹뷰 개발',
          env: 'Typescript / React / Next.js / Styled Components / Tanstack Query',
          desc: ['서비스 Finut 웹뷰 데모 개발/운영/배포'],
        },
      ],
    },
    {
      company: '에비드넷',
      period: '2021.07 ~ 2022.07',
      projects: [
        {
          title: '메디팡팡 앱 개발',
          env: 'Typescript / React Native / GraphQL',
          desc: [
            '메디팡팡 앱 아이디어툴 과제 수행 및 관련 서비스 개발',
            '앱 유저수 10,000명+ 증가',
          ],
        },
        {
          title: '메디팡팡 웹 개발',
          env: 'Typescript / React / GraphQL',
          desc: [
            '메디팡팡 웹 원무진 기능 개발/운영/배포',
            '메디팡팡 병원 웹 기능 개발/운영/배포',
            '메디팡팡 의사 웹 추가기능, 회원가입 개발/운영/배포',
            '메디팡팡 약사 웹 기능, 회원가입 개발/운영/배포',
          ],
        },
      ],
    },
    {
      company: '리버스랩',
      period: '2020.06 ~ 2021.02',
      projects: [
        {
          title: '자사 홈페이지 개발 및 유지보수',
          env: 'Html / Styled Components / Javascript',
          desc: ['자사 홈페이지 UI 수정 및 기능 개선'],
        },
        {
          title: '정산 어드민 기능 개발',
          env: 'Javascript / React / Styled Components',
          desc: ['정산 어드민 기능 개발'],
        },
        {
          title: '옐로우버스 어드민 1.0 개발 및 유지보수',
          env: 'Javascript / React / Styled Components',
          desc: ['자사 서비스 어드민 1.0 ver 기능 추가 개발 및 유지보수'],
        },
      ],
    },
  ]


  return (
    <section id="experience" className="mx-auto max-w-6xl px-4 py-16 border-t">
      <h2 className="mb-12 text-xl font-semibold">Work Experience</h2>

      <ul className="space-y-16">
        {experiences.map((exp, idx) => (
          <li
            key={idx}
            className="flex flex-col md:flex-row"
            data-aos="fade-up"
            data-aos-delay={idx * 100}
          >
            {/* 타임라인 (좌측) */}
            <div className="relative flex md:w-12 md:flex-col items-center md:items-center mb-4 md:mb-0">
              {/* 동그라미 */}
              <div className="w-3 h-3 bg-yellow-400 rounded-full border border-white shadow z-10" />
              {/* 선 */}
              {idx !== experiences.length - 1 && (
                <div className="hidden md:block flex-1 w-px bg-gray-300 mt-1" />
              )}
            </div>

            {/* 회사명 및 기간 */}
            <div className="md:w-1/3 w-full md:pr-6 mb-2 md:mb-0 text-center md:text-left">
              <p className="font-semibold">{exp.company}</p>
              <p className="text-sm text-gray-500">{exp.period}</p>
            </div>

            {/* 프로젝트 내용 */}
            <div className="md:w-2/3 w-full md:pl-6">
              {exp.projects.map((proj, pIdx) => (
                <div key={pIdx} className="mb-6">
                  <p className="font-bold">{proj.title}</p>
                  <p className="text-sm text-gray-600 mb-1">개발환경: {proj.env}</p>
                  <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                    {proj.desc.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </li>

        ))}
      </ul>
    </section>
  )
}
