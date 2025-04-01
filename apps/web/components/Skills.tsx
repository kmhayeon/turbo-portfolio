'use client'

export default function Skills() {
  const skills = [
    'React',
    'React Native',
    'TailwindCSS',
    'Styled Components',
    'GraphQL',
    'Tanstack Query',
    'Context API',
    'Photoshop',
    'Figma',
    'Jira',
  ]

  return (
    <section id="skills" className="mx-auto max-w-4xl border-t px-4 py-16">
      <h2 className="mb-4 text-xl font-semibold">Specialty</h2>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-yellow-500 px-3 py-1 text-sm text-gray-700"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  )
}
