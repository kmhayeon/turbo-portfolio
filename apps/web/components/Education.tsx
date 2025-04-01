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

export default function Education() {
  const experiences: I_ExperienceItem[] = [
    {
      company: '2014.03 ~ 2017.02',
      projects: [
        {
          title: '계원예술대학교',
          env: '디지털미디어디자인과',
        },
      ],
    },
    {
      company: '2010.03 ~ 2013.02',
      projects: [
        {
          title: '송림고등학교',
        },
      ],
    },
  ]

  return (
    <section id="education" className="mx-auto max-w-6xl border-t px-4 py-16">
      <h2 className="mb-12 text-xl font-semibold">Education</h2>

      <ul className="space-y-24">
        {experiences.map((exp, idx) => (
          <li key={idx} className="flex flex-col items-stretch md:flex-row">
            <div className="relative hidden md:flex md:w-12 md:flex-col md:items-center">
              <div className="z-10 mb-2 mt-2 h-3 w-3 rounded-full border border-white bg-yellow-400 shadow" />
              {idx !== experiences.length - 1 && <div className="w-px flex-1 bg-gray-300" />}
            </div>

            <div className="mb-6 w-full text-center md:mb-0 md:w-1/3 md:pl-6 md:text-left">
              <p className="text-lg font-semibold">{exp.company}</p>
              <p className="text-sm text-gray-500">{exp.period}</p>
            </div>

            {/* 기간 */}
            <div className="mb-6 w-full text-center md:mb-0 md:w-1/3 md:pl-6 md:text-left">
              <p className="text-lg font-semibold">{exp.company}</p>
            </div>

            {/* 프로젝트 상세 */}
            <div className="w-full md:w-2/3 md:pl-6">
              {exp.projects.map((proj, pIdx) => (
                <div key={pIdx} className="mb-12">
                  <p className="text-lg font-bold">{proj.title}</p>
                  {proj.env && <p className="text-sm font-semibold text-gray-600">{proj.env}</p>}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
