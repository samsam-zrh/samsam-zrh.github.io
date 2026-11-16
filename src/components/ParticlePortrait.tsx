import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const SAMPLE = 190
const WIDTH = 3.7

const vert = /* glsl */ `
  attribute vec3 aTarget;
  attribute vec3 aScatter;
  attribute float aLum;
  attribute float aSeed;
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixel;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uBurst;
  uniform vec2 uBurstAt;
  varying float vLum;
  varying float vGlow;
  varying float vEdge;

  void main() {
    float t = clamp((uProgress - aSeed * 0.45) / 0.55, 0.0, 1.0);
    float e = 1.0 - pow(1.0 - t, 3.0);
    vec3 p = mix(aScatter, aTarget, e);
    // swirl while travelling
    float sw = sin(t * 3.14159) * (1.0 - e);
    p.xy += vec2(cos(aSeed * 50.0 + uTime), sin(aSeed * 40.0 + uTime)) * sw * 0.9;

    // idle breathing
    p += vec3(sin(uTime * 1.3 + aSeed * 40.0), cos(uTime * 1.1 + aSeed * 31.0), sin(uTime * 0.9 + aSeed * 23.0)) * 0.012;

    // cursor repulsion
    vec2 d = p.xy - uMouse;
    float dist = length(d);
    float f = smoothstep(0.75, 0.0, dist) * uHover;
    p.xy += normalize(d + 1e-4) * f * (0.35 + aSeed * 0.35);
    p.z += f * (1.4 * aSeed - 0.2);

    // click shockwave
    vec2 bd = p.xy - uBurstAt;
    float bl = length(bd);
    float wave = uBurst * smoothstep(1.8, 0.0, bl);
    p.xy += normalize(bd + 1e-4) * wave * (0.6 + aSeed * 1.4);
    p.z += wave * (aSeed * 3.0 - 1.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float size = (0.55 + aLum * 1.25) * (1.0 + f * 1.2);
    gl_PointSize = size * uPixel * 2.6 * (5.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
    vLum = aLum;
    vGlow = max(f, wave * 0.6);
    vEdge = smoothstep(${(WIDTH * 0.485).toFixed(2)}, ${(WIDTH * 0.26).toFixed(2)}, length(aTarget.xy));
  }
`

const frag = /* glsl */ `
  varying float vLum;
  varying float vGlow;
  varying float vEdge;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.1, d);
    vec3 deep = vec3(0.07, 0.16, 0.42);
    vec3 mid = vec3(0.30, 0.55, 1.0);
    vec3 hi = vec3(0.86, 0.92, 1.0);
    float l = pow(vLum, 1.15);
    vec3 col = l < 0.5 ? mix(deep, mid, l * 2.0) : mix(mid, hi, (l - 0.5) * 2.0);
    col = mix(col, vec3(1.0), vGlow * 0.7);
    gl_FragColor = vec4(col, a * vEdge * (0.55 + 0.45 * vLum));
  }
`

type Data = { target: Float32Array; scatter: Float32Array; lum: Float32Array; seed: Float32Array; count: number }

function sample(img: HTMLImageElement): Data {
  const c = document.createElement('canvas')
  c.width = c.height = SAMPLE
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, 0, 0, SAMPLE, SAMPLE)
  const px = ctx.getImageData(0, 0, SAMPLE, SAMPLE).data
  const target: number[] = [], scatter: number[] = [], lum: number[] = [], seed: number[] = []
  for (let y = 0; y < SAMPLE; y++) {
    for (let x = 0; x < SAMPLE; x++) {
      const i = (y * SAMPLE + x) * 4
      const cx = x / SAMPLE - 0.5, cy = y / SAMPLE - 0.5
      const r = Math.hypot(cx, cy)
      if (px[i + 3] < 200 || r > 0.485) continue
      // dissolve the frame edge: fewer, dimmer particles towards the rim
      const keep = Math.min(1, Math.max(0, (0.485 - r) / 0.2))
      if (Math.random() > 0.15 + 0.85 * keep) continue
      const raw = (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255
      const k = Math.min(1, Math.max(0, (raw - 0.12) / 0.75))
      const l = k * k * (3 - 2 * k) * (0.35 + 0.65 * keep)
      const jx = (Math.random() - 0.5) * 0.6, jy = (Math.random() - 0.5) * 0.6
      target.push(((x + jx) / SAMPLE - 0.5) * WIDTH, -((y + jy) / SAMPLE - 0.5) * WIDTH, (l - 0.5) * 0.5)
      const v = new THREE.Vector3().randomDirection().multiplyScalar(3 + Math.random() * 5)
      scatter.push(v.x, v.y, v.z)
      lum.push(l)
      seed.push(Math.random())
    }
  }
  return { target: new Float32Array(target), scatter: new Float32Array(scatter), lum: new Float32Array(lum), seed: new Float32Array(seed), count: lum.length }
}

function Points({ data, active, reduce }: { data: Data; active: boolean; reduce: boolean }) {
  const group = useRef<THREE.Group>(null)
  const { viewport, gl } = useThree()
  const mouse = useRef({ x: 0, y: 0, inside: false })
  const progress = useRef(reduce ? 1 : 0)
  const tmp = useMemo(() => new THREE.Vector2(), [])
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: progress.current },
          uPixel: { value: Math.min(window.devicePixelRatio, 2) },
          uMouse: { value: new THREE.Vector2(9, 9) },
          uHover: { value: 0 },
          uBurst: { value: 0 },
          uBurstAt: { value: new THREE.Vector2() },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  useEffect(() => {
    const el = gl.domElement
    const toLocal = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      return { x: ((e.clientX - r.left) / r.width - 0.5) * viewport.width, y: -((e.clientY - r.top) / r.height - 0.5) * viewport.height }
    }
    const move = (e: PointerEvent) => { const p = toLocal(e); mouse.current = { ...p, inside: true } }
    const leave = () => { mouse.current.inside = false }
    const down = (e: PointerEvent) => {
      if (reduce) return
      const p = toLocal(e)
      mat.uniforms.uBurstAt.value.set(p.x, p.y)
      mat.uniforms.uBurst.value = 1
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    el.addEventListener('pointerdown', down)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); el.removeEventListener('pointerdown', down) }
  }, [gl, viewport.width, viewport.height, mat, reduce])

  useFrame((state, dt) => {
    const u = mat.uniforms
    u.uTime.value = state.clock.elapsedTime
    if (active && !reduce) progress.current = Math.min(1, progress.current + dt / 2.6)
    u.uProgress.value = progress.current
    const m = mouse.current
    u.uMouse.value.lerp(tmp.set(m.x, m.y), 0.18)
    u.uHover.value += ((m.inside && !reduce ? 1 : 0) - u.uHover.value) * 0.08
    u.uBurst.value *= 0.94
    if (group.current && !reduce) {
      const tx = m.inside ? -m.y * 0.12 : 0
      const ty = m.inside ? m.x * 0.16 : Math.sin(state.clock.elapsedTime * 0.4) * 0.12
      group.current.rotation.x += (tx - group.current.rotation.x) * 0.05
      group.current.rotation.y += (ty - group.current.rotation.y) * 0.05
    }
  })

  return (
    <group ref={group}>
      <points material={mat} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.target, 3]} />
          <bufferAttribute attach="attributes-aTarget" args={[data.target, 3]} />
          <bufferAttribute attach="attributes-aScatter" args={[data.scatter, 3]} />
          <bufferAttribute attach="attributes-aLum" args={[data.lum, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[data.seed, 1]} />
        </bufferGeometry>
      </points>
    </group>
  )
}

export default function ParticlePortrait({ reduce, onCount }: { reduce: boolean; onCount?: (n: number) => void }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<Data | null>(null)
  const [visible, setVisible] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = '/samuel.png'
    img.onload = () => { const d = sample(img); setData(d); onCount?.(d.count) }
  }, [onCount])

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { setVisible(e.isIntersecting); if (e.intersectionRatio > 0.35) setStarted(true) }, { threshold: [0, 0.35] })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className="h-full w-full cursor-crosshair" aria-hidden>
      {data && (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
          frameloop={visible && !reduce ? 'always' : 'demand'}
        >
          <Points data={data} active={started} reduce={reduce} />
        </Canvas>
      )}
    </div>
  )
}
