import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useLang } from '../lib/i18n'
import { contact } from '../data'
import { Reveal, SectionHeader } from './ui'
import { triggerMatrix } from './MatrixRain'

type Line = { kind: 'in' | 'out'; node: ReactNode }
const CMDS = ['help', 'whoami', 'xp', 'projects', 'skills', 'edu', 'contact', 'cv', 'sudo hire samuel', 'matrix', 'clear']

export default function Terminal() {
  const { t, lang } = useLang()
  const [lines, setLines] = useState<Line[]>([])
  const [value, setValue] = useState('')
  const [hist, setHist] = useState<string[]>([])
  const [hi, setHi] = useState(-1)
  const body = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => { setLines([{ kind: 'out', node: <span className="text-zinc-400">{t.term.welcome}</span> }]) }, [t.term.welcome])
  useEffect(() => { body.current?.scrollTo({ top: body.current.scrollHeight, behavior: 'smooth' }) }, [lines])

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return
    setHist((h) => [raw, ...h]); setHi(-1)
    if (cmd === 'clear') { setLines([]); return }
    let out: ReactNode
    const fr = lang === 'fr'
    switch (cmd) {
      case 'help':
        out = <div className="grid grid-cols-2 gap-x-6 sm:grid-cols-3">{CMDS.map((c) => <span key={c} className="text-cyan">{c}</span>)}</div>
        break
      case 'whoami':
        out = <span>Samuel Zerah — {t.hero.pitch}</span>
        break
      case 'xp':
        out = <div>{t.xp.items.map((x) => <div key={x.org}><span className="text-violet">{x.when}</span> {x.role} @ {x.org}{x.points.map((p) => <div key={p} className="pl-4 text-zinc-400">↳ {p}</div>)}</div>)}</div>
        break
      case 'projects':
        out = <div>{t.projects.items.map((p) => <div key={p.id}><span className="text-fuchsia">▸ {p.name}</span> <span className="text-zinc-500">({p.when})</span><div className="pl-4 text-zinc-400">{p.short}</div></div>)}</div>
        break
      case 'skills':
        out = <div>{t.skills.groups.map((g) => <div key={g.t}><span className="text-violet">{g.t.padEnd(26, '.')}</span> {g.items.join(', ')}</div>)}</div>
        break
      case 'edu':
        out = <div>{t.xp.edu.map((e) => <div key={e.t}><span className="text-violet">{e.when}</span> {e.t} — {e.o}</div>)}</div>
        break
      case 'contact':
        out = <div>✉ <a className="text-cyan underline" href={`mailto:${contact.email}`}>{contact.email}</a><br />☎ {contact.phone}<br />in <a className="text-cyan underline" href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> · gh <a className="text-cyan underline" href={contact.github} target="_blank" rel="noreferrer">GitHub</a></div>
        break
      case 'cv':
        window.open(contact.cv, '_blank')
        out = <span>{fr ? 'Ouverture du CV…' : 'Opening résumé…'}</span>
        break
      case 'matrix':
        setTimeout(triggerMatrix, 350)
        out = <span className="text-cyan">{fr ? 'Suivez le lapin blanc… (astuce : ↑↑↓↓←→←→BA marche partout)' : 'Follow the white rabbit… (tip: ↑↑↓↓←→←→BA works anywhere)'}</span>
        break
      case 'sudo hire samuel':
      case 'sudo hire-samuel':
        out = <span className="text-emerald-300">[sudo] ✓ {fr ? 'Permission accordée. Samuel est disponible dès février 2027 — écrivez-lui !' : 'Permission granted. Samuel is available from February 2027 — reach out!'}</span>
        break
      default:
        out = <span className="text-rose-300">{fr ? `commande introuvable : ${cmd}. Essayez 'help'.` : `command not found: ${cmd}. Try 'help'.`}</span>
    }
    setLines((l) => [...l, { kind: 'in', node: raw }, { kind: 'out', node: out }])
  }

  const submit = (e: FormEvent) => { e.preventDefault(); run(value); setValue('') }

  return (
    <section id="terminal" className="relative mx-auto max-w-5xl scroll-mt-24 px-6 py-28 md:px-10">
      <SectionHeader kicker={t.term.kicker} title={t.term.title} />
      <Reveal>
        <div className="relative">
          <div aria-hidden className="absolute -inset-px rounded-3xl bg-gradient-to-r from-cyan/50 via-violet/50 to-fuchsia/50 opacity-60 blur-xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#07080d]/95 shadow-2xl transition-colors focus-within:border-cyan/60" onClick={() => input.current?.focus({ preventScroll: true })}>
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" /><span className="h-3 w-3 rounded-full bg-[#febc2e]" /><span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-xs text-zinc-500">samuel@portfolio: ~</span>
            </div>
            <div ref={body} data-lenis-prevent className="h-80 overflow-y-auto p-5 font-mono text-[13px] leading-6 text-zinc-200" aria-live="polite">
              {lines.map((l, i) => (
                <div key={i} className={l.kind === 'in' ? 'mt-2' : ''}>
                  {l.kind === 'in' ? <><span className="text-emerald-400">➜</span> <span className="text-cyan">~</span> {l.node}</> : l.node}
                </div>
              ))}
              <form onSubmit={submit} className="mt-2 flex items-center gap-2">
                <label htmlFor="term-in" className="text-emerald-400">➜ <span className="text-cyan">~</span></label>
                <input
                  id="term-in"
                  ref={input}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp') { e.preventDefault(); const n = Math.min(hi + 1, hist.length - 1); if (n >= 0) { setHi(n); setValue(hist[n]) } }
                    if (e.key === 'ArrowDown') { e.preventDefault(); const n = hi - 1; setHi(n); setValue(n >= 0 ? hist[n] : '') }
                    if (e.key === 'Tab') { const m = CMDS.find((c) => c.startsWith(value.toLowerCase())); if (m && value) { e.preventDefault(); setValue(m) } }
                  }}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={t.term.hint}
                  aria-label={t.term.hint}
                  className="flex-1 bg-transparent text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus-visible:outline-none"
                />
              </form>
            </div>
          </div>
        </div>
      </Reveal>
      <div className="mt-5 flex flex-wrap gap-2">
        {CMDS.filter((c) => c !== 'clear').map((c) => (
          <button key={c} onClick={() => run(c)} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-zinc-300 transition hover:border-cyan/60 hover:text-white">
            $ {c}
          </button>
        ))}
      </div>
    </section>
  )
}
