'use client'

export default function Header() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-white shadow">
      <nav className="flex justify-center gap-6 p-4 text-sm font-medium">
        <a href="#hero" className="transition-colors duration-200 hover:text-yellow-400">
          Home
        </a>
        <a href="#about" className="transition-colors duration-200 hover:text-yellow-400">
          About
        </a>
        <a href="#education" className="transition-colors duration-200 hover:text-yellow-400">
          Education
        </a>
        <a href="#experience" className="transition-colors duration-200 hover:text-yellow-400">
          Experience
        </a>
        <a href="#portfolio" className="transition-colors duration-200 hover:text-yellow-400">
          Portfolio
        </a>
        <a href="#skills" className="transition-colors duration-200 hover:text-yellow-400">
          Skills
        </a>
      </nav>
    </header>
  )
}
