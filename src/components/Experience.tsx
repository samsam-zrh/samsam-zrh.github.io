import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { Briefcase, GraduationCap } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { Reveal, SectionHeader, SpotlightCard, Tag } from './ui'

export default function Experience() {
  const { t } = useLang()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const h = useSpring(scrollYProgress, { stiffness: 90, damping: 25 })

  return (
    <section id="xp" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-28 md:px-10">
      <SectionHeader kicker={t.xp.kicker} title={t.xp.title} />
      <div ref={ref} className="relative pl-10 md:pl-16">
        <div aria-hidden className="absolute left-3 top-0 h-full w-px bg-white/10 md:left-6" />
        <motion.div aria-hidden style={{ scaleY: h }} className="absolute left-3 top-0 h-full w-px origin-top bg-gradient-to-b from-cyan via-violet to-fuchsia shadow-[0_0_12px_2px_rgba(77,141,255,.6)] md:left-6" />

        {t.xp.items.map((x, i) => (
          <div key={i} className="relative mb-16">
            <Dot><Briefcase size={14} /></Dot>
            <Reveal>
              <p className="font-mono text-sm text-cyan">{x.when}</p>
              <h3 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">{x.role}</h3>
              <p className="mt-1 text-lg text-zinc-400">{x.org} · {x.place}</p>
            </Reveal>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {x.points.map((p, k) => (
                <Reveal key={k} delay={k * 0.08}>
                  <SpotlightCard className="h-full">
                    <span className="font-mono text-xs text-violet">0{k + 1}</span>
                    <p className="mt-2 leading-relaxed text-zinc-300">{p}</p>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">{x.tags.map((tg) => <Tag key={tg}>{tg}</Tag>)}</div>
          </div>
        ))}

        <div className="relative">
          <Dot><GraduationCap size={14} /></Dot>
          <Reveal><h3 className="font-display text-3xl font-semibold text-white">{t.xp.eduTitle}</h3></Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {t.xp.edu.map((e, k) => (
              <Reveal key={k} delay={k * 0.1}>
                <SpotlightCard className="h-full">
                  <p className="font-mono text-sm text-cyan">{e.when}</p>
                  <h4 className="mt-3 font-display text-xl font-semibold text-white">{e.t}</h4>
                  <p className="mt-2 text-zinc-400">{e.o}</p>
                  {e.p && <p className="mt-1 text-sm text-zinc-500">{e.p}</p>}
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Dot({ children }: { children: React.ReactNode }) {
  return (
    <div aria-hidden className="absolute -left-10 top-1 flex h-7 w-7 -translate-x-[1px] items-center justify-center rounded-full border border-cyan/50 bg-ink text-cyan shadow-[0_0_20px_rgba(77,141,255,.5)] md:-left-16 md:translate-x-[10px]">
      {children}
    </div>
  )
}
