'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen((prev) => !prev)

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-white shadow">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between p-4 md:px-8">
        <div className="text-lg font-bold">H folio</div>

        <nav className="hidden gap-6 text-sm font-medium md:flex md:items-center">
          <a href="#hero" className="hover:text-gray-400">
            Home
          </a>
          <a href="#about" className="hover:text-gray-400">
            About
          </a>
          <a href="#education" className="hover:text-gray-400">
            Education
          </a>
          <a href="#experience" className="hover:text-gray-400">
            Experience
          </a>
          <a href="#portfolio" className="hover:text-gray-400">
            Portfolio
          </a>
          <a href="#skills" className="hover:text-gray-400">
            Skills
          </a>
          {/*<a*/}
          {/*  href="/blog"*/}
          {/*  className="ml-4 rounded-full border border-gray-300 px-4 py-1 transition-colors hover:bg-gray-100"*/}
          {/*>*/}
          {/*  Blog*/}
          {/*</a>*/}
        </nav>

        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="max-h-[80vh] overflow-y-auto border-t bg-white shadow md:hidden">
          <nav className="flex flex-col items-start text-base font-semibold">
            {[
              { label: 'Home', href: '#hero' },
              { label: 'About', href: '#about' },
              { label: 'Education', href: '#education' },
              { label: 'Experience', href: '#experience' },
              { label: 'Portfolio', href: '#portfolio' },
              { label: 'Skills', href: '#skills' },
              // { label: 'Blog', href: '/blog' },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={toggleMenu}
                className="w-full border-b border-gray-200 px-6 py-4 hover:bg-gray-50"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
