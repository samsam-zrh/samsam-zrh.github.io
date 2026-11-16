import { lazy, Suspense, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { ArrowDown, Download, MapPin, Sparkles } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { contact } from '../data'
import { Magnetic, ScrambleText } from './ui'

const NeuralScene = lazy(() => import('./NeuralScene'))

const ease = [0.22, 1, 0.36, 1] as const

function SplitName({ text, delay }: { text: string; delay: number }) {
  return (
    <span className="inline-block overflow-hidden pb-2 align-bottom">
      {text.split('').map((c, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: '110%', rotate: 8 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ duration: 1, delay: delay + i * 0.045, ease }}
        >
          {c}
        </motion.span>
      ))}
    </span>
  )
}

export default function Hero({ ready }: { ready: boolean }) {
  const { t } = useLang()
  const reduce = !!useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 180])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.35])

  return (
    <section id="top" ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div aria-hidden className="grid-bg absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-aurora absolute -left-1/4 top-[-20%] h-[70vh] w-[70vw] rounded-full bg-cyan/20 blur-[120px]" />
        <div className="animate-aurora absolute -right-1/4 bottom-[-25%] h-[70vh] w-[60vw] rounded-full bg-violet/25 blur-[140px] [animation-delay:-6s]" />
        <div className="animate-aurora absolute left-1/3 top-1/3 h-[40vh] w-[30vw] rounded-full bg-fuchsia/10 blur-[120px] [animation-delay:-12s]" />
      </div>

      <motion.div style={{ scale: sceneScale, opacity }} className="absolute inset-0 md:left-[38%]">
        {ready && (
          <Suspense fallback={null}>
            <motion.div className="h-full w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
              <NeuralScene reduce={reduce} />
            </motion.div>
          </Suspense>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-transparent md:hidden" />
      </motion.div>

      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-28 pb-20 md:px-10">
        {ready && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs text-emerald-200 backdrop-blur"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {t.hero.status}
            </motion.div>

            <div className="mt-8 flex items-center gap-5">
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.2, ease }}
                className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24"
              >
                <div className="animate-spin-slow absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,#4d8dff,#2f5fd0,#a9c6ff,#4d8dff)] blur-[2px]" />
                <img src="/samuel.png" alt="Portrait de Samuel Zerah" width={96} height={96} className="relative h-full w-full rounded-full border-4 border-ink object-cover" />
              </motion.div>
              <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="font-mono text-sm text-zinc-400">
                {t.hero.hello}
                <br />
                <span className="inline-flex items-center gap-1 text-zinc-500"><MapPin size={13} /> {t.hero.location}</span>
              </motion.p>
            </div>

            <h1 className="mt-6 font-display text-[clamp(3.4rem,12vw,10rem)] font-bold leading-[0.88] tracking-[-0.04em] text-white">
              <SplitName text="Samuel" delay={0.3} />
              <br />
              <span className="text-gradient"><SplitName text="Zerah" delay={0.55} /></span>
            </h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-6 flex items-center gap-3 font-mono text-lg text-cyan sm:text-2xl">
              <Sparkles size={20} className="text-violet" aria-hidden />
              <ScrambleText words={t.hero.roles} />
              <span className="caret inline-block h-6 w-2.5 bg-cyan" aria-hidden />
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25, duration: 0.8, ease }} className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              {t.hero.pitch}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8, ease }} className="mt-10 flex flex-wrap gap-4">
              <Magnetic>
                <a href="#projects" className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-7 py-3.5 font-medium text-ink">
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan via-violet to-fuchsia transition-transform duration-500 group-hover:translate-x-0" />
                  <span className="relative">{t.hero.cta1}</span>
                  <ArrowDown size={16} className="relative transition-transform group-hover:translate-y-0.5" />
                </a>
              </Magnetic>
              <Magnetic>
                <a href={contact.cv} download className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-medium text-white backdrop-blur transition hover:border-cyan/60 hover:bg-cyan/10">
                  <Download size={16} /> {t.hero.cta2}
                </a>
              </Magnetic>
            </motion.div>
          </>
        )}
      </motion.div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 z-10 hidden md:flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500"
      >
        {t.hero.scroll}
        <span className="relative h-10 w-5 rounded-full border border-white/20">
          <motion.span animate={reduce ? {} : { y: [4, 20, 4] }} transition={{ repeat: Infinity, duration: 1.8 }} className="absolute left-1/2 top-0 h-2 w-1 -translate-x-1/2 rounded-full bg-cyan" />
        </span>
      </motion.a>
    </section>
  )
}
