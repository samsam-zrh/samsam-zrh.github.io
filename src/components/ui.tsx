import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react'
import { motion, useInView, useMotionValue, useSpring, useReducedMotion, useScroll, useTransform, animate, type MotionValue } from 'motion/react'

export function SectionHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-14 max-w-3xl">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">{kicker}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </Reveal>
    </div>
  )
}

export function Reveal({ children, delay = 0, y = 28, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SpotlightCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--x', `${e.clientX - r.left}px`)
    el.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-px transition-colors hover:border-white/20 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(420px circle at var(--x) var(--y), rgba(77,141,255,.16), rgba(47,95,208,.08) 40%, transparent 70%)' }}
      />
      <div className="relative h-full rounded-[calc(1.5rem-1px)] bg-panel/80 p-6 backdrop-blur-sm">{children}</div>
    </div>
  )
}

export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 })
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 })
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className="inline-block"
      onMouseMove={(e) => {
        if (reduce || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.div>
  )
}

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ΣλΔ'
export function ScrambleText({ words, className = '' }: { words: string[]; className?: string }) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [text, setText] = useState(words[0])
  useEffect(() => {
    if (reduce) { setText(words[i]); return }
    const target = words[i]
    let frame = 0
    const total = 24
    const id = setInterval(() => {
      frame++
      const progress = frame / total
      setText(
        target
          .split('')
          .map((c, k) => (k / target.length < progress || c === ' ' ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(''),
      )
      if (frame >= total) clearInterval(id)
    }, 35)
    return () => clearInterval(id)
  }, [i, words, reduce])
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % words.length), 2800)
    return () => clearInterval(id)
  }, [words.length])
  return <span className={className} aria-live="polite">{text}</span>
}

export function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(reduce ? to : 0)
  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(0, to, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setVal(Math.round(v)) })
    return () => c.stop()
  }, [inView, to, reduce])
  return <span ref={ref}>{val}{suffix}</span>
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-zinc-300">
      {children}
    </span>
  )
}

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.12, 1])
  const blur = useTransform(progress, range, ['blur(6px)', 'blur(0px)'])
  return <motion.span style={{ opacity, filter: blur }} className="inline-block whitespace-pre">{word} </motion.span>
}

export function ScrollWords({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  if (reduce) return <p ref={ref} className={className}>{text}</p>
  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />)}
      </span>
    </p>
  )
}
