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

      <div className="relative pl-6 md:pl-12">
        <div className="absolute bottom-0 left-3 top-0 w-[1.5px] bg-yellow-300" />

        <ul className="space-y-24">
          <li className="relative flex flex-col items-stretch md:flex-row">
            <div className="mb-6 w-full text-center md:mb-0 md:w-1/3 md:pl-6 md:text-left">
              <p className="text-lg font-semibold">2014.03 ~ 2017.02</p>
            </div>
            <div className="w-full md:w-2/3 md:pl-6">
              <p className="text-lg font-bold">계원예술대학교</p>
              <p className="text-sm font-semibold text-gray-600">디지털미디어디자인과</p>
            </div>
          </li>

          <li className="relative flex flex-col items-stretch md:flex-row">
            <div className="mb-6 w-full text-center md:mb-0 md:w-1/3 md:pl-6 md:text-left">
              <p className="text-lg font-semibold">2010.03 ~ 2013.02</p>
            </div>
            <div className="w-full md:w-2/3 md:pl-6">
              <p className="text-lg font-bold">송림고등학교</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}
