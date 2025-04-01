'use client'

export default function Skills() {
  const skillCategories = {
    'Plan & Design': ['Jira', 'Slack', 'Sketch', 'Figma', 'Illustrator', 'Photoshop'],
    Develop: [
      'React',
      'React Native',
      'Styled Components',
      'TailwindCss',
      'Context API',
      'GraphQL',
      'Tanstack Query',
    ],
  }

  return (
    <section id="skills" className="mx-auto max-w-6xl border-t px-4 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-xl font-semibold">Specialty</h2>

        <div className="space-y-16">
          {Object.entries(skillCategories).map(([category, skills]) => (
            <div key={category}>
              <h3 className="mb-4 text-base font-bold text-gray-800">{category}</h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-yellow-500 px-5 py-2 text-sm text-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
