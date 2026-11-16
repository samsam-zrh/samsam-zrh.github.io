import { motion } from 'motion/react'
import { Code2, Cpu, Cloud, Shield, Users, Waves, Plane, Wind } from 'lucide-react'
import { useLang } from '../lib/i18n'
import { Reveal, SectionHeader, SpotlightCard } from './ui'

const gIcons = [Code2, Cpu, Cloud, Shield, Users]
const hIcons = [Waves, Plane, Wind]

export default function Skills() {
  const { t } = useLang()
  return (
    <section id="skills" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-28 md:px-10">
      <SectionHeader kicker={t.skills.kicker} title={t.skills.title} />
      <div className="grid gap-4 md:grid-cols-6">
        {t.skills.groups.map((g, i) => {
          const Icon = gIcons[i]
          const span = i < 2 ? 'md:col-span-3' : 'md:col-span-2'
          return (
            <Reveal key={g.t} delay={i * 0.07} className={span}>
              <SpotlightCard className="h-full">
                <div className="flex items-center gap-3">
                  <Icon size={20} className="text-cyan" aria-hidden />
                  <h3 className="font-display text-xl font-semibold text-white">{g.t}</h3>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {g.items.map((s, k) => (
                    <motion.li
                      key={s}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + k * 0.04, type: 'spring', stiffness: 300, damping: 20 }}
                      whileHover={{ y: -3 }}
                      className="cursor-default rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-zinc-200 transition-colors hover:border-cyan/50 hover:bg-cyan/10 hover:text-white"
                    >
                      {s}
                    </motion.li>
                  ))}
                </ul>
              </SpotlightCard>
            </Reveal>
          )
        })}
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <Reveal><h3 className="font-display text-2xl font-semibold text-white">{t.skills.langTitle}</h3></Reveal>
          <div className="mt-6 space-y-6">
            {t.skills.langs.map((l, i) => (
              <Reveal key={l.l} delay={i * 0.1}>
                <div className="flex justify-between text-sm">
                  <span className="text-white">{l.l}</span>
                  <span className="font-mono text-zinc-400">{l.lvl}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5" role="meter" aria-valuenow={l.v} aria-valuemin={0} aria-valuemax={100} aria-label={`${l.l} ${l.lvl}`}>
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan via-violet to-fuchsia shadow-[0_0_12px_rgba(47,95,208,.6)]"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${l.v}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div>
          <Reveal><h3 className="font-display text-2xl font-semibold text-white">{t.skills.hobbyTitle}</h3></Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {t.skills.hobbies.map((h, i) => {
              const Icon = hIcons[i]
              return (
                <Reveal key={h.t} delay={i * 0.1}>
                  <motion.div whileHover={{ y: -6, rotate: i === 1 ? 0 : i === 0 ? -2 : 2 }} className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-panel p-5">
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-cyan/30 to-violet/30 blur-2xl transition-transform duration-700 group-hover:scale-[2.5]" />
                    <Icon size={26} className="relative text-cyan" aria-hidden />
                    <h4 className="relative mt-6 font-display text-lg font-semibold text-white">{h.t}</h4>
                    <p className="relative mt-1 text-sm text-zinc-400">{h.d}</p>
                  </motion.div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
