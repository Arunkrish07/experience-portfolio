import Reveal, { RevealWord } from './Reveal'
import { howIBuild } from '../data'

export default function HowIBuild() {
  return (
    <section id="how-i-build" data-nav-label="how i build" className="paper-grain border-t border-ink/10 px-6 py-24 md:px-10 md:py-32">
      <Reveal>
        <p className="hand text-2xl">{howIBuild.note}</p>
      </Reveal>
      <h2 className="serif mt-2 text-5xl sm:text-6xl md:text-8xl">
        <RevealWord text={howIBuild.heading} stagger={0.04} />
      </h2>

      <ul className="mt-14 grid gap-x-16 gap-y-6 md:grid-cols-2">
        {howIBuild.steps.map((s, i) => (
          <Reveal key={s} delay={i * 0.05} className="flex items-baseline gap-4 border-b border-ink/10 pb-4">
            <span className="serif text-xl text-accent">{String(i + 1).padStart(2, '0')}</span>
            <span className="text-lg text-ink/80">{s}</span>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
