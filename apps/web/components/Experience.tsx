'use client'

type I_Project = {
  title: string
  env?: string
  desc?: string[]
}

type I_ExperienceItem = {
  company: string
  period?: string
  projects: I_Project[]
}

export default function Experience() {
  const experiences: I_ExperienceItem[] = [
    {
      company: 'VivityAI',
      period: '2023.08 ~ 재직중',
      projects: [
        {
          title: '중공업 최적화 AI 플랫폼 개발',
          env: 'Typescript / Next.js / Tailwind CSS / Tanstack Query / Zustand',
          desc: [
            '모노레포 기반 프로젝트 관리 및 서브모듈 구조 설계',
            '중공업 데이터 시각화 및 Analytics 대시보드 개발',
            'Hyper Compressor / EVA Vibrating Screen 시스템 개발',
            '드론 기반 Yard 현황 관리 시스템 개발',
          ],
        },
      ],
    },
    {
      company: '에비드넷',
      period: '2021.07 ~ 2022.08',
      projects: [
        {
          title: '메디팡팡 앱 개발',
          env: 'Typescript / React Native / GraphQL',
          desc: [
            '메디팡팡 앱 마이데이터 과제 수행 및 관련 서비스 개발',
            '앱 유저수 10,000명+ 증가',
          ],
        },
        {
          title: '메디팡팡 웹 개발',
          env: 'Typescript / React / GraphQL',
          desc: [
            '메디팡팡 웹 사용자 기능 개발/운영/배포',
            '메디팡팡 병원 웹 기능 개발/운영/배포',
            '메디팡팡 의사 웹 추가기능, 회원가입 개발/운영/배포',
            '메디팡팡 약사 웹 기능, 회원가입 개발/운영/배포',
          ],
        },
      ],
    },
    {
      company: '리버스랩',
      period: '2020.06 ~ 2021.03',
      projects: [
        {
          title: '자사 홈페이지 개발 및 유지보수',
          env: 'Html / Styled Components / Javascript',
          desc: ['자사 홈페이지 UI 수정 및 기능 개선'],
        },
        {
          title: '정산 플랫폼 개발',
          env: 'Javascript / React / Styled Components',
          desc: ['정산 플랫폼 기능 개발'],
        },
        {
          title: '옐로우버스 1.0 개발 및 유지보수',
          env: 'Javascript / React / Styled Components',
          desc: ['자사 서비스 1.0 ver 기능 추가 개발 및 유지보수'],
        },
      ],
    },
  ]

  return (
    <section
      id="experience"
      className="mx-auto w-full max-w-6xl border-t px-4 py-12 sm:px-6 md:px-8 lg:px-12"
    >
      <h2 className="mb-12 text-xl font-semibold">Work Experience</h2>

      <div className="relative pl-6 md:pl-12">
        <div className="absolute bottom-0 left-[14px] top-0 hidden w-[1.5px] bg-gray-300 sm:block md:left-[12px]" />

        <ul className="space-y-24">
          {experiences.map((exp, idx) => (
            <li key={idx} className="relative flex flex-col items-stretch md:flex-row">
              <div className="mb-6 w-full text-center md:mb-0 md:w-1/3 md:pl-6 md:text-left">
                <p className="text-lg font-semibold">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.period}</p>
              </div>

              <div className="w-full md:w-2/3 md:pl-6">
                {exp.projects.map((proj, pIdx) => (
                  <div key={pIdx} className="mb-12">
                    <p className="text-lg font-bold">{proj.title}</p>
                    {proj.env && (
                      <p className="mb-2 text-sm font-semibold text-gray-600">
                        개발환경: {proj.env}
                      </p>
                    )}
                    <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                      {proj.desc?.map((line, i) => <li key={i}>{line}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
