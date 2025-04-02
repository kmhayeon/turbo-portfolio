'use client'

export default function Header() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-white shadow">
      <nav className="flex justify-center gap-10 p-4 text-sm font-medium">
        <a href="#hero" className="font-bold transition-colors duration-200 hover:text-gray-300">
          Home
        </a>
        <a href="#about" className="font-bold transition-colors duration-200 hover:text-gray-300">
          About
        </a>
        <a
          href="#education"
          className="font-bold transition-colors duration-200 hover:text-gray-300"
        >
          Education
        </a>
        <a
          href="#experience"
          className="font-bold transition-colors duration-200 hover:text-gray-300"
        >
          Experience
        </a>
        <a
          href="#portfolio"
          className="font-bold transition-colors duration-200 hover:text-gray-300"
        >
          Portfolio
        </a>
        <a href="#skills" className="transition-colors duration-200 hover:text-gray-300">
          Skills
        </a>
      </nav>
    </header>
  )
}
