import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react'
import { ArrowUpRight, X } from 'lucide-react'
import { useLang } from '../lib/i18n'
import type { Dict } from '../data'
import { Reveal, SectionHeader, Tag } from './ui'

type Project = Dict['projects']['items'][number]

function NewsVisual() {
  const reduce = useReducedMotion()
  const heads = [
    ['AAPL beats EPS', '+0.82'],
    ['Fed signals pause', '+0.31'],
    ['Supply chain risk', '−0.64'],
    ['TSLA guidance cut', '−0.47'],
    ['NVDA record DC', '+0.91'],
    ['ECB uncertainty', '−0.22'],
  ]
  const pts = Array.from({ length: 40 }, (_, i) => `${i * 10},${60 - Math.sin(i / 3) * 18 - Math.cos(i / 1.7) * 9 - i * 0.6}`).join(' ')
  return (
    <div className="relative h-full w-full overflow-hidden font-mono text-[10px]">
      <svg viewBox="0 0 390 100" className="absolute inset-x-0 bottom-0 h-1/2 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ng" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#4d8dff" stopOpacity=".5" /><stop offset="1" stopColor="#4d8dff" stopOpacity="0" /></linearGradient>
        </defs>
        <motion.polyline points={pts} fill="none" stroke="#4d8dff" strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.2 }} />
        <polygon points={`0,100 ${pts} 390,100`} fill="url(#ng)" opacity=".5" />
      </svg>
      <motion.div className="space-y-1.5 p-4" animate={reduce ? {} : { y: [0, -96] }} transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}>
        {[...heads, ...heads].map(([h, v], i) => (
          <div key={i} className="flex justify-between rounded-md bg-white/[0.04] px-2 py-1">
            <span className="text-zinc-300">{h}</span>
            <span className={v.startsWith('+') ? 'text-emerald-300' : 'text-rose-300'}>{v}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function EyeVisual() {
  const reduce = useReducedMotion()
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(47,95,208,.35),transparent_55%)]" />
      <svg viewBox="0 0 200 200" className="relative h-[85%]">
        {[70, 52, 34].map((r, i) => (
          <motion.circle key={r} cx="100" cy="100" r={r} fill="none" stroke={i === 1 ? '#2f5fd0' : '#4d8dff'} strokeOpacity=".5" strokeDasharray="4 6"
            animate={reduce ? {} : { rotate: i % 2 ? -360 : 360 }} transition={{ repeat: Infinity, duration: 20 + i * 6, ease: 'linear' }} style={{ transformOrigin: '100px 100px' }} />
        ))}
        <circle cx="100" cy="100" r="16" fill="#2f5fd0" fillOpacity=".5" />
        <circle cx="100" cy="100" r="6" fill="#fff" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2
          return <circle key={i} cx={100 + Math.cos(a) * 88} cy={100 + Math.sin(a) * 88} r="2" fill="#a9c6ff" />
        })}
      </svg>
      <motion.div className="absolute inset-x-0 h-0.5 bg-cyan shadow-[0_0_18px_4px_rgba(77,141,255,.7)]"
        animate={reduce ? { top: '50%' } : { top: ['8%', '92%', '8%'] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }} />
      <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 font-mono text-[10px] text-cyan">CLIP ⟶ proj ⟶ Gemma</div>
    </div>
  )
}

function GridVisual() {
  const { lang } = useLang()
  const real = Array.from({ length: 48 }, (_, i) => 55 - Math.sin(i / 3.8) * 22 - Math.sin(i / 1.3) * 5)
  const fc = real.map((v, i) => v + Math.sin(i * 1.7) * 3)
  const toPts = (a: number[], from = 0) => a.map((v, i) => `${(i + from) * 8.3},${v}`).join(' ')
  return (
    <div className="relative h-full w-full p-3">
      <svg viewBox="0 0 400 110" className="h-full w-full" preserveAspectRatio="none">
        {Array.from({ length: 6 }).map((_, i) => <line key={i} x1="0" x2="400" y1={i * 22} y2={i * 22} stroke="white" strokeOpacity=".06" />)}
        {Array.from({ length: 48 }).map((_, i) => (
          <motion.rect key={i} x={i * 8.3} width="5" rx="1" fill={i < 32 ? '#4d8dff' : '#2f5fd0'} fillOpacity=".18"
            initial={{ y: 110, height: 0 }} whileInView={{ y: real[i], height: 110 - real[i] }} viewport={{ once: true }} transition={{ delay: i * 0.02, duration: 0.6 }} />
        ))}
        <motion.polyline points={toPts(real.slice(0, 32))} fill="none" stroke="#4d8dff" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6 }} />
        <motion.polyline points={toPts(fc.slice(31), 31)} fill="none" stroke="#a9c6ff" strokeWidth="2" strokeDasharray="5 4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 1.5 }} />
        <line x1={31 * 8.3} x2={31 * 8.3} y1="0" y2="110" stroke="white" strokeOpacity=".3" strokeDasharray="2 3" />
      </svg>
      <div className="absolute left-5 top-3 flex gap-3 rounded bg-black/50 px-2 py-0.5 font-mono text-[10px]">
        <span className="text-cyan">● {lang === 'fr' ? 'réel' : 'actual'}</span><span className="text-fuchsia">● forecast</span>
      </div>
    </div>
  )
}

const visuals: Record<string, () => React.JSX.Element> = { news: NewsVisual, eye: EyeVisual, grid: GridVisual }

function TiltCard({ p, i, onOpen, label }: { p: Project; i: number; onOpen: () => void; label: string }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0.5), my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 200, damping: 20 })
  const ry = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 200, damping: 20 })
  const glare = useTransform([mx, my], ([x, y]: number[]) => `radial-gradient(600px circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,.12), transparent 45%)`)
  const onMove = (e: MouseEvent) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height)
  }
  const Visual = visuals[p.id]
  return (
    <Reveal delay={i * 0.12} className={i === 0 ? 'lg:col-span-2' : ''}>
      <motion.article
        layoutId={`card-${p.id}`}
        onMouseMove={onMove}
        onMouseLeave={() => { mx.set(0.5); my.set(0.5) }}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
        className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-panel"
      >
        <motion.div aria-hidden style={{ background: glare }} className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity group-hover:opacity-100" />
        <div className={`relative border-b border-white/10 bg-black/40 ${i === 0 ? 'h-64' : 'h-52'}`}>
          <Visual />
        </div>
        <div className="relative p-7" style={{ transform: 'translateZ(40px)' }}>
          <p className="font-mono text-xs text-violet">{p.when}</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-white md:text-3xl">{p.name}</h3>
          <p className="mt-3 text-zinc-400">{p.short}</p>
          <div className="mt-5 flex flex-wrap gap-2">{p.tags.map((tg) => <Tag key={tg}>{tg}</Tag>)}</div>
          <button onClick={onOpen} className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-cyan after:absolute after:inset-0 after:z-30 after:content-['']">
            {label} — {p.name} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </motion.article>
    </Reveal>
  )
}

function Modal({ p, onClose, closeLabel }: { p: Project; onClose: () => void; closeLabel: string }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    document.documentElement.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.documentElement.style.overflow = '' }
  }, [onClose])
  const Visual = visuals[p.id]
  return (
    <motion.div className="fixed inset-0 z-[80] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <motion.div layoutId={`card-${p.id}`} role="dialog" aria-modal="true" aria-labelledby={`t-${p.id}`} data-lenis-prevent
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/15 bg-panel shadow-2xl shadow-cyan/10">
        <div className="h-64 border-b border-white/10 bg-black/40"><Visual /></div>
        <div className="p-8">
          <p className="font-mono text-xs text-violet">{p.when}</p>
          <h3 id={`t-${p.id}`} className="mt-2 font-display text-4xl font-semibold text-white">{p.name}</h3>
          <p className="mt-2 inline-block rounded-full bg-cyan/10 px-3 py-1 font-mono text-xs text-cyan">{p.metric}</p>
          <ul className="mt-6 space-y-3">
            {p.points.map((pt, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.08 }} className="flex gap-3 text-zinc-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-cyan to-violet" />{pt}
              </motion.li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">{p.tags.map((tg) => <Tag key={tg}>{tg}</Tag>)}</div>
        </div>
        <button ref={closeRef} onClick={onClose} aria-label={closeLabel} className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/60 p-2 text-white backdrop-blur hover:border-cyan">
          <X size={18} />
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const { t } = useLang()
  const [open, setOpen] = useState<string | null>(null)
  const current = t.projects.items.find((p) => p.id === open)
  const close = useCallback(() => setOpen(null), [])
  return (
    <section id="projects" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-28 md:px-10">
      <SectionHeader kicker={t.projects.kicker} title={t.projects.title} />
      <div className="grid gap-6 lg:grid-cols-2">
        {t.projects.items.map((p, i) => (
          <TiltCard key={p.id} p={p} i={i} onOpen={() => setOpen(p.id)} label={t.projects.open} />
        ))}
      </div>
      <AnimatePresence>{current && <Modal p={current} onClose={close} closeLabel={t.projects.close} />}</AnimatePresence>
    </section>
  )
}
