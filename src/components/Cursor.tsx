import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export default function Cursor() {
  const x = useMotionValue(-200), y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 150, damping: 20, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 150, damping: 20, mass: 0.6 })
  const [hover, setHover] = useState(false)
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    if (!enabled) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY)
      setHover(!!(e.target as HTMLElement).closest('a,button,[data-hover]'))
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [enabled, x, y])
  if (!enabled) return null
  return (
    <>
      <motion.div aria-hidden style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-[70] -translate-x-1/2 -translate-y-1/2">
        <motion.div animate={{ scale: hover ? 2.4 : 1 }} className="h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/60 mix-blend-difference" />
      </motion.div>
      <motion.div aria-hidden style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 -z-0">
        <div className="h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,.07),transparent_60%)]" />
      </motion.div>
    </>
  )
}
