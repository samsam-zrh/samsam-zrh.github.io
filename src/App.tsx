import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'motion/react'
import Lenis from 'lenis'
import { dict, type Lang } from './data'
import { LangCtx } from './lib/i18n'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Terminal from './components/Terminal'
import Contact from './components/Contact'
import Cursor from './components/Cursor'
import MatrixRain from './components/MatrixRain'
import FluidCursor from './components/FluidCursor'

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App() {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || (navigator.language.startsWith('fr') ? 'fr' : 'en'))
  const [loading, setLoading] = useState(() => !reduceMotion() && !sessionStorage.getItem('booted'))
  const setLang = useCallback((l: Lang) => { setLangState(l); localStorage.setItem('lang', l) }, [])
  const done = useCallback(() => { setLoading(false); sessionStorage.setItem('booted', '1') }, [])
  const ctx = useMemo(() => ({ lang, t: dict[lang], setLang }), [lang, setLang])

  useEffect(() => { document.documentElement.lang = lang }, [lang])

  useEffect(() => {
    if (reduceMotion()) return
    const lenis = new Lenis({ duration: 1.15, anchors: { offset: -80 } })
    let raf = 0
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [])

  return (
    <LangCtx.Provider value={ctx}>
      <MotionConfig reducedMotion="user">
        <a href="#about" className="sr-only z-[90] rounded bg-white px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          {lang === 'fr' ? 'Aller au contenu' : 'Skip to content'}
        </a>
        <AnimatePresence>{loading && <Preloader onDone={done} />}</AnimatePresence>
        <div className="grain">
          <Cursor />
          <FluidCursor />
          <MatrixRain />
          <Nav />
          <main>
            <Hero ready={!loading} />
            <Marquee />
            <About />
            <Experience />
            <Projects />
            <Skills />
            <Terminal />
          </main>
          <Contact />
        </div>
      </MotionConfig>
    </LangCtx.Provider>
  )
}
