import { lazy, Suspense, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { Brain, Eye, LineChart, ShieldCheck } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { CountUp, Reveal, ScrollWords, SectionHeader, SpotlightCard } from './ui'

const ParticlePortrait = lazy(() => import('./ParticlePortrait'))

const icons = [Brain, Eye, LineChart, ShieldCheck]

export default function About() {
  const { t, lang } = useLang()
  const reduce = !!useReducedMotion()
  const [count, setCount] = useState(0)
  return (
    <section id="about" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-28 md:px-10">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <SectionHeader kicker={t.about.kicker} title={t.about.title} />
          <ScrollWords text={t.about.text} className="font-display text-2xl font-medium leading-snug text-white md:text-[2rem]" />
        </div>
        <Reveal delay={0.1} className="relative mx-auto aspect-square w-full max-w-[560px]">
          <div aria-hidden className="absolute inset-[12%] rounded-full bg-cyan/10 blur-[80px]" />
          <Suspense fallback={null}>
            <ParticlePortrait reduce={reduce} onCount={setCount} />
          </Suspense>
          <p aria-hidden className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] text-zinc-500">
            <span className="text-cyan">samuel</span>.render(<span className="text-fuchsia">particles</span>={count.toLocaleString(lang)}) · {lang === 'fr' ? 'survolez · cliquez' : 'hover · click'}
          </p>
        </Reveal>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {t.about.stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <SpotlightCard className="h-full">
              <div className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl">
                <span className="text-gradient"><CountUp to={s.value} suffix={s.suffix} /></span>
              </div>
              <p className="mt-3 text-sm text-zinc-400">{s.label}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-4 md:grid-rows-2">
        {t.about.bento.map((b, i) => {
          const Icon = icons[i]
          const span = i === 0 ? 'md:col-span-2 md:row-span-2' : i === 3 ? 'md:col-span-2' : ''
          return (
            <Reveal key={i} delay={i * 0.08} className={span}>
              <SpotlightCard className="h-full">
                <div className="flex h-full flex-col justify-between gap-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-cyan/20 to-violet/20">
                    <Icon size={22} className="text-cyan" aria-hidden />
                  </div>
                  <div>
                    <h3 className={`font-display font-semibold text-white ${i === 0 ? 'text-3xl' : 'text-xl'}`}>{b.t}</h3>
                    <p className="mt-2 text-zinc-400">{b.d}</p>
                  </div>
                  {i === 0 && <TokenStream />}
                </div>
              </SpotlightCard>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

function TokenStream() {
  const tokens = ['<s>', 'Ana', 'lyse', ' →', ' appel', ' d’', 'offres', ' SSI', ' :', ' conformité', ' RGPD', ' ✓', '</s>']
  return (
    <div aria-hidden className="rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-xs leading-6">
      <p className="text-zinc-500">// llm.generate(prompt, temperature=0.2)</p>
      <div className="flex flex-wrap">
        {tokens.map((tk, i) => (
          <Reveal key={i} delay={0.3 + i * 0.12} y={0}>
            <span className={`mr-0.5 rounded px-1 ${i % 3 === 0 ? 'bg-cyan/15 text-cyan' : i % 3 === 1 ? 'bg-violet/15 text-violet' : 'bg-fuchsia/15 text-fuchsia'}`}>{tk}</span>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
