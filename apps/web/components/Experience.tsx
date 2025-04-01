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
      period: '2022.12 ~ 2023.04',
      projects: [
        {
          title: '자사 홈페이지 개발',
          env: 'Typescript / React / Next.js / Styled Components',
          desc: ['VivityAI 자사 홈페이지 개발/운영/배포'],
        },
        {
          title: '웹뷰 개발',
          env: 'Typescript / React / Next.js / Styled Components / Tanstack Query',
          desc: ['서비스 웹뷰 데모 개발/운영/배포'],
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
    <section id="experience" className="mx-auto max-w-6xl border-t px-4 py-16">
      <h2 className="mb-12 text-xl font-semibold">Work Experience</h2>

      <ul className="space-y-24">
        {experiences.map((exp, idx) => (
          <li key={idx} className="flex flex-col items-stretch md:flex-row">
            <div className="relative hidden md:flex md:w-12 md:flex-col md:items-center">
              <div className="z-10 mb-2 mt-2 h-3 w-3 rounded-full border border-white bg-yellow-400 shadow" />
              {idx !== experiences.length - 1 && <div className="mt-1 w-px flex-1 bg-gray-300" />}
            </div>

            <div className="mb-6 w-full text-center md:mb-0 md:w-1/3 md:pl-6 md:text-left">
              <p className="text-lg font-semibold">{exp.company}</p>
              <p className="text-sm text-gray-500">{exp.period}</p>
            </div>

            <div className="w-full md:w-2/3 md:pl-6">
              {exp.projects.map((proj, pIdx) => (
                <div key={pIdx} className="mb-12">
                  <p className="text-lg font-bold">{proj.title}</p>
                  <p className="mb-2 text-sm font-semibold text-gray-600">개발환경: {proj.env}</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                    {proj.desc?.map((line, i) => <li key={i}>{line}</li>)}
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
