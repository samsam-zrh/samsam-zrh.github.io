import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { useLang } from '../lib/i18n'

const ids = ['about', 'xp', 'projects', 'skills', 'terminal', 'contact'] as const

export default function Nav() {
  const { t, lang, setLang } = useLang()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])
  return (
    <>
      <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-cyan via-violet to-fuchsia" />
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-4 z-40 flex justify-center px-4"
      >
        <nav aria-label="Navigation principale" className="flex items-center gap-1 rounded-full border border-white/10 bg-ink/60 p-1.5 pl-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <a href="#top" className="mr-2 font-display text-lg font-bold text-white">SZ<span className="text-cyan">.</span></a>
          <ul className="hidden items-center md:flex">
            {ids.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className={`relative block rounded-full px-3.5 py-2 text-sm transition-colors ${active === id ? 'text-white' : 'text-zinc-400 hover:text-white'}`}>
                  {active === id && <motion.span layoutId="pill" className="absolute inset-0 -z-10 rounded-full bg-white/10" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            className="ml-1 rounded-full border border-white/10 px-3 py-2 font-mono text-xs text-zinc-300 transition hover:border-cyan/60 hover:text-white"
            aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
          >
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <button className="ml-1 rounded-full px-3 py-2 text-sm text-zinc-300 md:hidden" aria-expanded={open} aria-controls="mnav" onClick={() => setOpen((o) => !o)}>
            {open ? '✕' : '☰'}<span className="sr-only">Menu</span>
          </button>
        </nav>
      </motion.header>
      {open && (
        <motion.ul id="mnav" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-x-4 top-20 z-40 rounded-3xl border border-white/10 bg-ink/90 p-3 backdrop-blur-xl md:hidden">
          {ids.map((id) => (
            <li key={id}><a onClick={() => setOpen(false)} href={`#${id}`} className="block rounded-2xl px-4 py-3 text-zinc-200 hover:bg-white/5">{t.nav[id]}</a></li>
          ))}
        </motion.ul>
      )}
    </>
  )
}
