import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uCenter;
  uniform vec2 uMouse;
  uniform float uScale;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
  float stars(vec2 p) {
    vec2 g = floor(p), f = fract(p) - 0.5;
    float h = hash(g);
    float s = step(0.965, h) * smoothstep(0.08, 0.0, length(f - (vec2(hash(g + 3.1), hash(g + 7.7)) - 0.5) * 0.6));
    return s * (0.5 + 0.5 * sin(uTime * 2.0 + h * 60.0));
  }

  // accretion disk sampled in the disk plane (tilted ellipse)
  vec3 disk(vec2 q, float rh) {
    float tilt = 3.2;
    vec2 d = vec2(q.x, q.y * tilt);
    float r = length(d);
    float a = atan(d.y, d.x);
    float inner = rh * 1.55, outer = rh * 5.2;
    if (r < inner * 0.85 || r > outer * 1.2) return vec3(0.0);
    float spin = a + uTime * 0.35 + 1.6 / (r + 0.05);
    float n = fbm(vec2(spin * 2.2, log(r) * 6.0 - uTime * 0.6));
    float streak = fbm(vec2(a * 9.0 + uTime * 0.9 + 3.0 / r, r * 18.0));
    float ring = smoothstep(inner * 0.85, inner * 1.05, r) * smoothstep(outer * 1.2, inner * 1.2, r);
    float heat = pow(1.0 - clamp((r - inner) / (outer - inner), 0.0, 1.0), 2.2);
    float beam = 0.55 + 0.45 * cos(a + 3.14159);
    float v = ring * (0.25 + n * 1.1 + streak * 0.35) * (0.35 + heat * 1.8) * (0.5 + beam);
    vec3 cold = vec3(0.10, 0.22, 0.60);
    vec3 mid = vec3(0.30, 0.55, 1.0);
    vec3 hot = vec3(0.90, 0.95, 1.0);
    vec3 col = mix(cold, mid, smoothstep(0.0, 0.5, heat));
    col = mix(col, hot, smoothstep(0.55, 1.0, heat * (0.6 + n * 0.6)));
    return col * v;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - uCenter) / (uRes.y * uScale);
    uv -= uMouse * 0.04;
    float rh = 0.11;
    float r = length(uv);

    // gravitational lensing of the star field
    vec2 lens = uv * (1.0 - (rh * rh * 1.6) / max(dot(uv, uv), 1e-4));
    vec3 col = vec3(0.55, 0.7, 1.0) * stars(lens * 70.0) * 0.9;
    col += vec3(0.18, 0.33, 0.8) * fbm(lens * 3.0 + uTime * 0.02) * 0.08;

    float behind = step(0.0, uv.y);
    col += disk(uv, rh) * behind;

    // lensed image of the far side of the disk, wrapped around the horizon
    float ang = atan(uv.y, uv.x);
    float band = smoothstep(rh * 1.04, rh * 1.16, r) * smoothstep(rh * 2.2, rh * 1.2, r);
    float ln = fbm(vec2(ang * 3.0 - uTime * 0.5, r * 22.0));
    float top = 0.2 + 0.8 * smoothstep(-0.25, 0.9, uv.y / max(r, 1e-4));
    vec3 lc = mix(vec3(0.30, 0.55, 1.0), vec3(0.92, 0.96, 1.0), smoothstep(rh * 1.7, rh * 1.1, r));
    col += lc * band * (0.35 + ln) * top * 1.15;

    // event horizon
    float horizon = smoothstep(rh * 1.02, rh * 0.96, r);
    col *= 1.0 - horizon;

    // photon ring + halo
    float photon = exp(-pow((r - rh * 1.08) / (rh * 0.06), 2.0));
    col += vec3(0.75, 0.86, 1.0) * photon * 1.2;
    col += vec3(0.18, 0.36, 0.9) * exp(-max(r - rh, 0.0) * 9.0) * 0.35 * (1.0 - horizon);

    // front half of the disk occludes the horizon
    vec3 front = disk(uv, rh) * (1.0 - behind);
    col += front;

    // vignette & tone map
    col *= smoothstep(1.4, 0.2, length((gl_FragCoord.xy / uRes - 0.5) * vec2(1.6, 1.0)));
    col = 1.0 - exp(-col * 1.6);
    float alpha = clamp(max(max(col.r, col.g), col.b) * 1.4 + horizon, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`

const vert = /* glsl */ `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`

function Hole({ centerY, reduce }: { centerY: number; reduce: boolean }) {
  const { size, gl } = useThree()
  const mouse = useRef(new THREE.Vector2())
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
          uTime: { value: 8 },
          uRes: { value: new THREE.Vector2() },
          uCenter: { value: new THREE.Vector2() },
          uMouse: { value: new THREE.Vector2() },
          uScale: { value: 1 },
        },
        transparent: true,
        depthWrite: false,
        depthTest: false,
      }),
    [],
  )

  useEffect(() => {
    const move = (e: PointerEvent) => mouse.current.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1))
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  useFrame((_, dt) => {
    const dpr = gl.getPixelRatio()
    const u = mat.uniforms
    if (!reduce) u.uTime.value += dt
    u.uRes.value.set(size.width * dpr, size.height * dpr)
    u.uCenter.value.set(size.width * 0.5 * dpr, size.height * (1 - centerY) * dpr)
    u.uScale.value = Math.min(1.25, (size.width / size.height) * 0.55)
    u.uMouse.value.lerp(mouse.current, 0.04)
  })

  return (
    <mesh frustumCulled={false} material={mat}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  )
}

export default function BlackHole({ centerY = 0.5, reduce }: { centerY?: number; reduce: boolean }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '200px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={wrap} className="h-full w-full" aria-hidden>
      <Canvas dpr={[1, 1.5]} gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }} frameloop={visible && !reduce ? 'always' : 'demand'}>
        <Hole centerY={centerY} reduce={reduce} />
      </Canvas>
    </div>
  )
}
