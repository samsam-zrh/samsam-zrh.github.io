import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, ChromaticAberration, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'

const CA_OFFSET = new THREE.Vector2(0.0009, 0.0012)

const N = 620
const R = 2.25
const PULSES = 70

const vert = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixel;
  uniform vec3 uMouse;
  uniform float uHover;
  uniform vec3 uWaveO;
  uniform float uWaveT;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    float dm = distance(p, uMouse);
    float near = uHover * smoothstep(1.4, 0.0, dm);
    p += normalize(p - uMouse + 1e-4) * near * 0.32;
    float ring = exp(-pow((distance(position, uWaveO) - uWaveT * 5.0) * 2.6, 2.0)) * smoothstep(1.4, 0.2, uWaveT);
    p += normalize(position) * ring * 0.28;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float tw = 0.6 + 0.4 * sin(uTime * 2.0 + aSeed * 30.0);
    gl_PointSize = aSize * uPixel * tw * (26.0 / -mv.z) * (1.0 + near * 2.4 + ring * 2.8);
    gl_Position = projectionMatrix * mv;
    float k = clamp((position.y + 2.5) / 5.0, 0.0, 1.0);
    vColor = mix(vec3(0.30, 0.55, 1.0), vec3(0.18, 0.37, 0.82), k);
    vColor = mix(vColor, vec3(0.75, 0.85, 1.0), smoothstep(0.85, 1.0, fract(aSeed * 7.0)) * 0.8);
    vColor = mix(vColor, vec3(0.88, 0.94, 1.0), clamp(near + ring, 0.0, 1.0));
    vAlpha = smoothstep(-9.0, -3.0, mv.z) * (1.0 + near + ring);
  }
`
const pulseVert = /* glsl */ `
  uniform float uPixel;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uPixel * (110.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`
const pulseFrag = /* glsl */ `
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.12, 0.0, d);
    float halo = pow(smoothstep(0.5, 0.0, d), 3.0) * 0.8;
    gl_FragColor = vec4(mix(vec3(0.55, 0.75, 1.0), vec3(1.0), core), core + halo);
  }
`
const frag = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a = pow(a, 1.6);
    gl_FragColor = vec4(vColor * (1.0 + a), a * vAlpha);
  }
`

function useGraph() {
  return useMemo(() => {
    const pos = new Float32Array(N * 3)
    const sizes = new Float32Array(N)
    const seeds = new Float32Array(N)
    const pts: THREE.Vector3[] = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
      const rad = Math.sqrt(1 - y * y)
      const th = golden * i
      const jitter = R * (0.82 + Math.random() * 0.3)
      const v = new THREE.Vector3(Math.cos(th) * rad, y, Math.sin(th) * rad).multiplyScalar(jitter)
      pts.push(v)
      pos.set([v.x, v.y, v.z], i * 3)
      sizes[i] = 1.2 + Math.random() * 2.4
      seeds[i] = Math.random()
    }
    const edges: [number, number][] = []
    const seen = new Set<string>()
    for (let i = 0; i < N; i++) {
      const d = pts.map((p, j) => [p.distanceToSquared(pts[i]), j] as [number, number])
      d.sort((a, b) => a[0] - b[0])
      for (let k = 1; k <= 3; k++) {
        const j = d[k][1]
        const key = i < j ? `${i}-${j}` : `${j}-${i}`
        if (!seen.has(key)) { seen.add(key); edges.push([i, j]) }
      }
    }
    const linePos = new Float32Array(edges.length * 6)
    const lineCol = new Float32Array(edges.length * 6)
    const c1 = new THREE.Color('#4d8dff'), c2 = new THREE.Color('#2f5fd0')
    edges.forEach(([a, b], e) => {
      linePos.set([pts[a].x, pts[a].y, pts[a].z, pts[b].x, pts[b].y, pts[b].z], e * 6)
      const ca = c1.clone().lerp(c2, (pts[a].y + R) / (2 * R))
      const cb = c1.clone().lerp(c2, (pts[b].y + R) / (2 * R))
      lineCol.set([ca.r, ca.g, ca.b, cb.r, cb.g, cb.b], e * 6)
    })
    return { pos, sizes, seeds, pts, edges, linePos, lineCol }
  }, [])
}

function Network({ reduce }: { reduce: boolean }) {
  const g = useGraph()
  const group = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const pulseGeo = useRef<THREE.BufferGeometry>(null)
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
          uTime: { value: 0 },
          uPixel: { value: Math.min(window.devicePixelRatio, 2) },
          uMouse: { value: new THREE.Vector3(0, 0, 99) },
          uHover: { value: 0 },
          uWaveO: { value: new THREE.Vector3() },
          uWaveT: { value: 9 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )
  const pulseMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: pulseVert,
        fragmentShader: pulseFrag,
        uniforms: { uPixel: { value: Math.min(window.devicePixelRatio, 2) } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )
  const pulses = useMemo(
    () => Array.from({ length: PULSES }, () => ({ e: Math.floor(Math.random() * g.edges.length), t: Math.random(), s: 0.4 + Math.random() * 1.2 })),
    [g.edges.length],
  )
  const pulsePos = useMemo(() => new Float32Array(PULSES * 3), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const { camera, gl } = useThree()
  const ptr = useRef({ x: 0, y: 0, inside: false, boost: 0 })
  const ray = useMemo(() => new THREE.Raycaster(), [])
  const sphere = useMemo(() => new THREE.Sphere(new THREE.Vector3(), R * 0.92), [])
  const hit = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    if (reduce) return
    const el = gl.domElement
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      ptr.current.x = ((e.clientX - r.left) / r.width) * 2 - 1
      ptr.current.y = -((e.clientY - r.top) / r.height) * 2 + 1
      ptr.current.inside = e.clientY >= r.top && e.clientY <= r.bottom && e.clientX >= r.left - r.width * 0.3
    }
    const down = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      if (e.clientY < r.top || e.clientY > r.bottom || (e.target as HTMLElement).closest('a,button')) return
      const local = mat.uniforms.uMouse.value as THREE.Vector3
      mat.uniforms.uWaveO.value.copy(local)
      mat.uniforms.uWaveT.value = 0
      ptr.current.boost = 1
      // fire every pulse from the neurons nearest to the click
      const order = g.pts.map((v, i) => [v.distanceToSquared(local), i] as [number, number]).sort((a, b) => a[0] - b[0])
      const near = new Set(order.slice(0, 14).map(([, i]) => i))
      const starts = g.edges.map((e, i) => (near.has(e[0]) ? i : -1)).filter((i) => i >= 0)
      pulses.forEach((p, i) => { p.e = starts[i % starts.length]; p.t = 0; p.s = 1.2 + Math.random() * 1.6 })
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerdown', down) }
  }, [reduce, gl, mat, g, pulses])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    mat.uniforms.uTime.value = t
    const P = ptr.current
    if (group.current) {
      const speed = reduce ? 0 : 0.08 + P.boost * 0.9
      group.current.rotation.y += dt * speed
      const cx = Math.max(-1.2, Math.min(1.2, P.x)), cy = Math.max(-1.2, Math.min(1.2, P.y))
      group.current.rotation.x += (cy * -0.3 - group.current.rotation.x) * 0.04
      group.current.position.x += (cx * 0.18 - group.current.position.x) * 0.04
      // project the cursor onto the network surface, in the group's local frame
      ray.setFromCamera(new THREE.Vector2(P.x, P.y), camera)
      group.current.getWorldPosition(sphere.center)
      if (!ray.ray.intersectSphere(sphere, hit)) {
        ray.ray.closestPointToPoint(sphere.center, hit)
        hit.sub(sphere.center).setLength(R).add(sphere.center)
      }
      group.current.worldToLocal(hit)
      ;(mat.uniforms.uMouse.value as THREE.Vector3).lerp(hit, 0.25)
      mat.uniforms.uHover.value += ((P.inside ? 1 : 0) - mat.uniforms.uHover.value) * 0.08
      mat.uniforms.uWaveT.value += dt
      P.boost *= Math.pow(0.12, dt)
    }
    if (core.current && !reduce) {
      core.current.rotation.x = t * 0.2
      core.current.rotation.y = t * 0.3
      const s = 1 + Math.sin(t * 1.6) * 0.05
      core.current.scale.setScalar(s)
    }
    if (!reduce && pulseGeo.current) {
      pulses.forEach((p, i) => {
        p.t += dt * p.s * (1 + ptr.current.boost * 2)
        if (p.t > 1) {
          // hop to an adjacent edge so signals propagate through the graph
          const end = g.edges[p.e][1]
          const next = g.edges.findIndex(([a], idx) => a === end && idx !== p.e)
          p.e = next >= 0 && Math.random() > 0.15 ? next : Math.floor(Math.random() * g.edges.length)
          p.t = 0
        }
        const [a, b] = g.edges[p.e]
        tmp.copy(g.pts[a]).lerp(g.pts[b], p.t)
        pulsePos.set([tmp.x, tmp.y, tmp.z], i * 3)
      })
      pulseGeo.current.attributes.position.needsUpdate = true
    }
  })

  return (
    <group ref={group}>
      <points material={mat}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[g.pos, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[g.sizes, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[g.seeds, 1]} />
        </bufferGeometry>
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[g.linePos, 3]} />
          <bufferAttribute attach="attributes-color" args={[g.lineCol, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={reduce ? 0.28 : 0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <points material={pulseMat}>
        <bufferGeometry ref={pulseGeo}>
          <bufferAttribute attach="attributes-position" args={[pulsePos, 3]} />
        </bufferGeometry>
      </points>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshBasicMaterial color="#2f5fd0" wireframe transparent opacity={reduce ? 0.35 : 0.13} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#4d8dff" transparent opacity={reduce ? 0.12 : 0.025} />
      </mesh>
    </group>
  )
}

function Stars() {
  const ref = useRef<THREE.Points>(null)
  const pos = useMemo(() => {
    const a = new Float32Array(1400 * 3)
    for (let i = 0; i < 1400; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(6 + Math.random() * 10)
      a.set([v.x, v.y, v.z], i * 3)
    }
    return a
  }, [])
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y -= dt * 0.01 })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#9fb4ff" size={0.025} sizeAttenuation transparent opacity={0.6} depthWrite={false} />
    </points>
  )
}

export default function NeuralScene({ reduce }: { reduce: boolean }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={wrap} className="h-full w-full">
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={reduce || !visible ? 'demand' : 'always'}
      aria-hidden
    >
      <Stars />
      <Network reduce={reduce} />
      {!reduce && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.28} luminanceSmoothing={0.3} radius={0.72} />
          <ChromaticAberration offset={CA_OFFSET} radialModulation modulationOffset={0.35} />
        </EffectComposer>
      )}
    </Canvas>
    </div>
  )
}
