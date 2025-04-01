'use client'

import Header from '../components/ui/Header'
import Hero from '../components/Hero'
import About from '../components/About'
import Education from '../components/Education'
import Experience from '../components/Experience'
import Portfolio from '../components/Portfolio'
import Skills from '../components/Skills'
import Footer from '../components/ui/Footer'

export default function Home() {
  return (
    <main className="scroll-smooth">
      <Header />
      <Hero />
      <About />
      <Education />
      <Experience />
      <Portfolio />
      <Skills />
      <Footer />
    </main>
  )
}
