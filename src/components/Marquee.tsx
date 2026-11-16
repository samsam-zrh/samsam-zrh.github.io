import { stack } from '../data'

function Row({ items, reverse, dur }: { items: string[]; reverse?: boolean; dur: string }) {
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div
        className="animate-marquee flex shrink-0 gap-4 pr-4 hover:[animation-play-state:paused]"
        style={{ ['--dur' as string]: dur, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {[...items, ...items].map((s, i) => (
          <span key={i} className="whitespace-nowrap rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 font-display text-lg text-zinc-300 transition hover:border-cyan/50 hover:text-white">
            <span className="mr-2 text-cyan">◆</span>{s}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Marquee() {
  const half = Math.ceil(stack.length / 2)
  return (
    <div aria-label="Technologies" className="relative space-y-4 py-16 [transform:perspective(900px)_rotateX(18deg)]">
      <Row items={stack.slice(0, half)} dur="45s" />
      <Row items={stack.slice(half)} reverse dur="55s" />
    </div>
  )
}
