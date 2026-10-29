import Reveal, { RevealWord } from './Reveal'
import { highlight } from '../highlight'
import { education, experience, quickView } from '../data'

const EXP_MARKS = [
  { p: 'Python, Django, React and React Native', t: 'underline' },
  { p: 'Supabase (PostgreSQL)', t: 'circle' },
  { p: 'Claude Code and GenAI prompt engineering', t: 'underline' },
  { p: 'system-design', t: 'circle' },
]

export default function Credentials() {
  return (
    <section id="experience" data-nav-label="experience" className="px-6 pb-24 md:px-10">
      <h2 className="serif text-6xl md:text-8xl">
        <RevealWord text="Experience" stagger={0.04} />
      </h2>

      <div className="mt-12 grid gap-14 md:grid-cols-[1.4fr_1fr] md:gap-20">
        {/* left: experience + education timeline */}
        <div className="space-y-10">
          {experience.map((e) => (
            <Reveal key={e.company} className="border-t border-ink/15 pt-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="serif text-2xl">
                  {e.role} · <span className="text-ink/70">{e.company}</span>
                </p>
                <p className="text-xs text-muted">{e.year}</p>
              </div>
              <p className="text-sm text-muted">{e.place}</p>
              <ul className="mt-4 space-y-2">
                {e.points.map((p) => (
                  <li key={p} className="flex gap-3 text-sm leading-[1.9] text-ink/80">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span>{highlight(p, EXP_MARKS)}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}

          <div>
            <Reveal>
              <p className="hand mb-4 text-3xl">Education</p>
            </Reveal>
            {education.map((ed) => (
              <Reveal key={ed.school} className="border-t border-ink/15 pt-4">
                <p className="serif text-xl">{ed.detail}</p>
                <p className="text-sm text-ink/70">{ed.school}</p>
                <p className="mt-1 text-xs text-muted">{ed.year}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* right: recruiter quick view */}
        <Reveal x={20} className="h-fit rounded-2xl border border-ink/15 bg-paper-2/60 p-6">
          <p className="hand mb-4 text-3xl">Quick view</p>
          <dl className="space-y-4">
            {quickView.map((q) => (
              <div key={q.k} className="border-b border-ink/10 pb-3">
                <dt className="text-xs uppercase tracking-wide text-muted">{q.k}</dt>
                <dd className="mt-1 text-sm text-ink/85">{q.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
