import { useRef } from 'react'
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { stack } from '../data'

const wrap = (min: number, max: number, v: number) => {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

function Row({ items, dir, speed }: { items: string[]; dir: 1 | -1; speed: number }) {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(vel, [-2500, 0, 2500], [-7, 0, 7], { clamp: false })
  const skew = useTransform(vel, [-2500, 2500], [dir * 14, dir * -14])
  const base = useMotionValue(0)
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)
  const sign = useRef<1 | -1>(dir)
  const hover = useRef(false)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    const f = factor.get()
    if (f < -0.05) sign.current = (-dir) as 1 | -1
    else if (f > 0.05) sign.current = dir
    const move = sign.current * speed * (delta / 1000) * (1 + Math.abs(f)) * (hover.current ? 0.15 : 1)
    base.set(base.get() - move)
  })

  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <motion.div
        style={{ x, skewX: reduce ? 0 : skew }}
        onPointerEnter={() => { hover.current = true }}
        onPointerLeave={() => { hover.current = false }}
        className="flex shrink-0 gap-4 pr-4 will-change-transform"
      >
        {[...items, ...items].map((s, i) => (
          <span key={i} className="whitespace-nowrap rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-display text-lg text-zinc-300 transition hover:border-cyan/50 hover:text-white">
            <span className="mr-2 text-cyan">◆</span>{s}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function Marquee() {
  const half = Math.ceil(stack.length / 2)
  return (
    <div aria-label="Technologies" className="relative space-y-4 py-16 [transform:perspective(900px)_rotateX(18deg)]">
      <Row items={stack.slice(0, half)} dir={1} speed={1.4} />
      <Row items={stack.slice(half)} dir={-1} speed={1.15} />
    </div>
  )
}
