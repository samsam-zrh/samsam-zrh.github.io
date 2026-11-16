import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useLang } from '../lib/i18n'

export default function Preloader({ onDone }: { onDone: () => void }) {
  const { t } = useLang()
  const [line, setLine] = useState(0)
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1700)
      setPct(Math.round(p * 100))
      setLine(Math.min(t.boot.length - 1, Math.floor(p * t.boot.length)))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setTimeout(onDone, 250)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone, t.boot.length])
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      role="status"
      aria-label="Chargement"
    >
      <div className="w-[min(420px,85vw)] font-mono text-sm">
        <div className="mb-6 font-display text-5xl font-bold tracking-tight text-white">
          SZ<span className="text-cyan">.</span>
        </div>
        {t.boot.slice(0, line + 1).map((l, i) => (
          <p key={i} className={i === line ? 'text-cyan' : 'text-zinc-500'}>
            <span className="text-violet">❯</span> {l}
          </p>
        ))}
        <div className="mt-6 h-px w-full bg-white/10">
          <div className="h-px bg-gradient-to-r from-cyan via-violet to-fuchsia" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-right text-xs text-zinc-500">{pct}%</p>
      </div>
    </motion.div>
  )
}
