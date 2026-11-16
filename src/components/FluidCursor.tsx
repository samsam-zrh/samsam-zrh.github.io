import { useEffect, useRef } from 'react'
import type WebGLFluidEnhanced from 'webgl-fluid-enhanced'

type RGB = { r: number; g: number; b: number }
type Sim = {
  hasStarted?: boolean
  handleMouseMove?: (e: { offsetX: number; offsetY: number }) => void
  splat?: (x: number, y: number, dx: number, dy: number, color: RGB) => void
}

export default function FluidCursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    let fluid: WebGLFluidEnhanced | null = null
    let disposed = false
    let last = { x: -1, y: -1 }

    let primed = false
    const onMove = (e: PointerEvent) => {
      const sim = (fluid as unknown as { simulation?: Sim } | null)?.simulation
      const jump = Math.hypot(e.clientX - last.x, e.clientY - last.y) > 320
      last = { x: e.clientX, y: e.clientY }
      if (!sim?.handleMouseMove) return
      const p = { offsetX: e.clientX, offsetY: e.clientY }
      sim.handleMouseMove(p)
      // A second identical move zeroes the delta, avoiding a streak from the previous position
      if (!primed || jump) { sim.handleMouseMove(p); primed = true }
    }

    // Click burst: ring of soft blue splats pushed outward
    const onDown = (e: PointerEvent) => {
      const sim = (fluid as unknown as { simulation?: Sim } | null)?.simulation
      if (!sim?.splat || !sim.hasStarted || e.button !== 0) return
      const W = window.innerWidth, H = window.innerHeight
      const n = 7
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.4
        const x = (e.clientX + Math.cos(a) * 28) / W
        const y = 1 - (e.clientY + Math.sin(a) * 28) / H
        const f = 700 + Math.random() * 300
        sim.splat(x, y, Math.cos(a) * f, -Math.sin(a) * f, { r: 0.022, g: 0.05, b: 0.13 })
      }
    }

    const onVis = () => {
      if (!fluid) return
      if (document.hidden) fluid.stop()
      else { primed = false; fluid.start() }
    }

    import('webgl-fluid-enhanced').then(({ default: Fluid }) => {
      if (disposed) return
      try {
        fluid = new Fluid(el)
        fluid.setConfig({
          simResolution: 128,
          dyeResolution: 768,
          densityDissipation: 2.2,
          velocityDissipation: 1.4,
          pressure: 0.2,
          curl: 22,
          splatRadius: 0.16,
          splatForce: 4200,
          shading: true,
          colorful: false,
          colorPalette: ['#4d8dff', '#2f5fd0', '#a9c6ff'],
          hover: true,
          transparent: true,
          backgroundColor: '#05060a',
          brightness: 0.42,
          bloom: true,
          bloomIntensity: 0.55,
          bloomThreshold: 0.35,
          sunrays: false,
        })
        fluid.start()
      } catch {
        fluid = null
      }
    })

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    document.addEventListener('visibilitychange', onVis)
    return () => {
      disposed = true
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.removeEventListener('visibilitychange', onVis)
      fluid?.stop()
      el.querySelector('canvas')?.remove()
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30 mix-blend-screen">
      <div ref={ref} className="h-full w-full [&>canvas]:pointer-events-none" />
    </div>
  )
}
