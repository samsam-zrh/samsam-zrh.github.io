import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Check, Copy, Download, Mail, Phone } from 'lucide-react'
import { Github, Linkedin } from './brands'
import { useLang } from '../lib/i18n'
import { contact } from '../data'
import { Magnetic, Reveal } from './ui'

export default function Contact() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(contact.email); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* clipboard blocked */ }
  }
  const links = [
    { icon: Mail, label: contact.email, href: `mailto:${contact.email}` },
    { icon: Phone, label: contact.phone, href: contact.phoneHref },
    { icon: Linkedin, label: 'LinkedIn', href: contact.linkedin },
    { icon: Github, label: 'GitHub · samsam-zrh', href: contact.github },
  ]
  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden px-6 pt-28 md:px-10">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan/20 via-violet/25 to-fuchsia/20 blur-[140px]" />
      <div className="relative mx-auto max-w-5xl text-center">
        <Reveal><p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">{t.contact.kicker}</p></Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-display text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.95] tracking-tight text-white">
            {t.contact.title.split(' ').map((w, i, a) => (
              <span key={i} className={i >= a.length - 1 ? 'text-gradient' : ''}>{w}{' '}</span>
            ))}
          </h2>
        </Reveal>
        <Reveal delay={0.2}><p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">{t.contact.text}</p></Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Magnetic>
              <a href={`mailto:${contact.email}`} className="relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-cyan via-violet to-fuchsia px-8 py-4 font-semibold text-ink shadow-[0_0_40px_rgba(47,95,208,.45)]">
                <Mail size={18} /> {contact.email}
              </a>
            </Magnetic>
            <button onClick={copy} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-4 text-white transition hover:border-cyan/60">
              {copied ? <Check size={18} className="text-emerald-300" /> : <Copy size={18} />} <span aria-live="polite">{copied ? t.contact.copied : t.contact.copy}</span>
            </button>
            <a href={contact.cv} download className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-4 text-white transition hover:border-cyan/60">
              <Download size={18} /> CV (PDF)
            </a>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {links.map(({ icon: Icon, label, href }, i) => (
            <Reveal key={href} delay={0.1 * i}>
              <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-panel/70 px-4 py-4 text-left text-sm text-zinc-300 backdrop-blur transition hover:-translate-y-1 hover:border-cyan/50 hover:text-white">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-cyan transition group-hover:bg-cyan group-hover:text-ink"><Icon size={16} /></span>
                <span className="truncate">{label}</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      <div aria-hidden className="relative mt-28 select-none overflow-hidden">
        <motion.p
          initial={reduce ? false : { y: '60%' }}
          whileInView={{ y: '0%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-display text-[22vw] font-bold leading-[0.8] tracking-[-0.06em] bg-gradient-to-b from-white/25 to-white/0 bg-clip-text text-transparent [-webkit-text-stroke:1px_rgba(47,95,208,.35)]"
        >
          ZERAH
        </motion.p>
      </div>
      <footer className="relative border-t border-white/10 py-8 text-center font-mono text-xs text-zinc-500">
        © {new Date().getFullYear()} Samuel Zerah · {t.contact.footer}
      </footer>
    </section>
  )
}
