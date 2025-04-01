'use client'

export default function Header() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-white shadow">
      <nav className="flex justify-center gap-6 p-4 text-sm font-medium">
        <a href="#hero">Home</a>
        <a href="#about">About</a>
        <a href="#education">Education</a>
        <a href="#experience">Experience</a>
        <a href="#portfolio">Portfolio</a>
        <a href="#skills">Skills</a>
      </nav>
    </header>
  )
}
