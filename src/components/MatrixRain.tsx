import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLang } from '../lib/i18n'

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン0123456789SAMUELZERAH<>{}[]=+*'

export const triggerMatrix = () => window.dispatchEvent(new Event('matrix'))

function Rain({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current!
    const ctx = c.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio, 2)
    const fs = 18
    let w = 0, h = 0, drops: number[] = [], speeds: number[] = []
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight
      c.width = w * dpr; c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cols = Math.ceil(w / fs)
      drops = Array.from({ length: cols }, () => -Math.random() * (h / fs) * 1.2)
      speeds = Array.from({ length: cols }, () => 0.45 + Math.random() * 0.7)
    }
    resize()
    ctx.fillStyle = '#05060a'; ctx.fillRect(0, 0, w, h)
    let raf = 0, last = performance.now()
    const start = last
    const tick = (now: number) => {
      const dt = Math.min(50, now - last) / 16.67
      last = now
      ctx.fillStyle = 'rgba(5,6,10,0.09)'
      ctx.fillRect(0, 0, w, h)
      ctx.font = `${fs}px "JetBrains Mono", ui-monospace, monospace`
      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * fs
        const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0]
        ctx.fillStyle = '#3f7bf0'
        ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], i * fs, y - fs)
        ctx.fillStyle = '#e6efff'
        ctx.fillText(ch, i * fs, y)
        drops[i] += speeds[i] * dt
        if (y > h && Math.random() > 0.975) drops[i] = -Math.random() * 20
      }
      if (now - start > 9000) onDone()
      else raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [onDone])
  return <canvas ref={ref} className="absolute inset-0 h-full w-full [filter:drop-shadow(0_0_6px_rgba(77,141,255,0.55))]" aria-hidden />
}

export default function MatrixRain() {
  const { lang } = useLang()
  const [on, setOn] = useState(false)
  useEffect(() => {
    let i = 0
    const open = () => { if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setOn(true) }
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOn(false); return }
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      i = k === KONAMI[i] ? i + 1 : k === KONAMI[0] ? 1 : 0
      if (i === KONAMI.length) { i = 0; open() }
    }
    window.addEventListener('matrix', open)
    window.addEventListener('keydown', key)
    return () => { window.removeEventListener('matrix', open); window.removeEventListener('keydown', key) }
  }, [])

  return (
    <AnimatePresence>
      {on && (
        <motion.div
          role="dialog"
          aria-label="Matrix"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(12px)' }}
          transition={{ duration: 0.6 }}
          onClick={() => setOn(false)}
          className="fixed inset-0 z-[95] cursor-pointer bg-ink"
        >
          <Rain onDone={() => setOn(false)} />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(5,6,10,0.85)_0%,transparent_60%)]">
            <motion.p
              initial={{ opacity: 0, letterSpacing: '1em' }}
              animate={{ opacity: 1, letterSpacing: '0.3em' }}
              transition={{ delay: 1.2, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-mono text-sm uppercase text-cyan"
            >
              {lang === 'fr' ? 'Réveille-toi, recruteur…' : 'Wake up, recruiter…'}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, scale: 1.4, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ delay: 2.4, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 font-display text-7xl font-bold tracking-tight text-white [text-shadow:0_0_40px_#4d8dff]"
            >
              Samuel Zerah
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.6 }}
              className="mt-6 font-mono text-xs text-zinc-400"
            >
              {lang === 'fr' ? 'Échap ou clic pour revenir · ↑↑↓↓←→←→BA' : 'Esc or click to return · ↑↑↓↓←→←→BA'}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
