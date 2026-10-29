import Reveal, { RevealWord } from './Reveal'
import { highlight } from '../highlight'
import { skillApps, books, skillsIntro, skillTags } from '../data'

const SKILL_MARKS = [
  { p: 'web and mobile', t: 'underline' },
  { p: 'AI-assisted development', t: 'circle' },
]

function AppIcon({ app }) {
  return (
    <div
      className="flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-semibold shadow-sm ring-1 ring-black/10"
      style={{ backgroundColor: app.bg, color: app.fg }}
    >
      {app.figma ? (
        // simple stylised figma-like glyph (generic dots, not the trademark)
        <span className="flex gap-[3px]">
          <span className="flex flex-col gap-[3px]">
            <span className="h-2 w-2 rounded-full bg-[#F24E1E]" />
            <span className="h-2 w-2 rounded-full bg-[#A259FF]" />
            <span className="h-2 w-2 rounded-full bg-[#0ACF83]" />
          </span>
          <span className="flex flex-col justify-center gap-[3px]">
            <span className="h-2 w-2 rounded-full bg-[#FF7262]" />
            <span className="h-2 w-2 rounded-full bg-[#1ABCFE]" />
          </span>
        </span>
      ) : (
        app.label
      )}
    </div>
  )
}

export default function Skills() {
  return (
    <section data-nav-label="skills" className="relative px-6 py-24 md:px-10">
      {/* heading */}
      <div className="relative inline-block">
        <h2 className="serif text-7xl md:text-9xl">
          <RevealWord text="Skills" stagger={0.05} />
        </h2>
        <Reveal delay={0.3} className="mt-1">
          <svg className="h-3 w-48" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
            <path d="M2 7 C 50 2, 150 2, 198 6" stroke="#7D84EF" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-16 md:grid-cols-2">
        {/* left: app icons lassoed */}
        <div className="relative">
          <Reveal className="relative inline-block">
            <div className="relative flex flex-wrap gap-4 px-6 py-5">
              {skillApps.map((a) => (
                <AppIcon key={a.label} app={a} />
              ))}
              {/* hand-drawn lasso ellipse around the icons */}
              <svg
                className="pointer-events-none absolute -inset-x-4 -inset-y-3"
                viewBox="0 0 200 60"
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  d="M8 32 C 6 12, 60 4, 110 5 C 170 6, 196 16, 194 32 C 192 50, 150 57, 96 56 C 40 55, 10 50, 8 32 Z"
                  stroke="#7D84EF"
                  strokeWidth="0.8"
                  opacity="0.85"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="hand mt-4 text-2xl">the stack I build with</p>
          </Reveal>
        </div>

        {/* right: book stack */}
        <div className="relative">
          {/* coffee doodle + annotation */}
          <Reveal className="mb-2 flex items-end justify-end gap-2">
            <svg className="h-8 w-10" viewBox="0 0 40 32" fill="none">
              <path d="M6 6 H30 V18 A8 8 0 0 1 22 26 H14 A8 8 0 0 1 6 18 Z" stroke="#7D84EF" strokeWidth="2" />
              <path d="M30 9 H34 A4 4 0 0 1 34 17 H30" stroke="#7D84EF" strokeWidth="2" />
              <path d="M13 2 C 11 4, 15 5, 13 7" stroke="#7D84EF" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M20 1 C 18 3, 22 4, 20 6" stroke="#7D84EF" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="hand text-2xl">learning</span>
          </Reveal>

          <div className="mx-auto flex max-w-sm flex-col items-center pt-2">
            {books.map((b, i) => {
              const rot = [-1.6, 1.2, -0.7, 1.5, -1.1][i % 5]
              const shift = [-3, 4, -2, 3, 0][i % 5]
              return (
                <Reveal
                  key={b.title}
                  delay={i * 0.07}
                  y={18}
                  className="w-full"
                  style={{ width: `${95 - i * 2.5}%`, marginTop: i === 0 ? 0 : -3, zIndex: books.length - i }}
                >
                  <div className="relative" style={{ transform: `rotate(${rot}deg) translateX(${shift}px)` }}>
                    {/* book cover (spine facing up) */}
                    <div
                      className="relative flex h-12 items-center rounded-[5px] pl-7 pr-4 shadow-[0_9px_16px_-9px_rgba(0,0,0,0.6)]"
                      style={{ backgroundColor: b.bg, color: b.fg }}
                    >
                      {/* spine band */}
                      <span className="absolute left-3 top-2 bottom-2 w-[3px] rounded-full" style={{ backgroundColor: b.fg, opacity: 0.4 }} />
                      {/* top highlight */}
                      <span className="absolute inset-x-[5px] top-[3px] h-px rounded bg-white/15" />
                      <span className="text-[11px] font-semibold uppercase leading-tight tracking-wide">{b.title}</span>
                    </div>
                    {/* page block (thickness of the book) */}
                    <div className="mx-[3px] h-[6px] rounded-b-[4px] bg-black/25" />
                    <div className="mx-[6px] h-[2px] rounded-b-[3px] bg-black/15" />
                  </div>
                </Reveal>
              )
            })}
          </div>
          <Reveal delay={0.2} className="mt-3 flex justify-center">
            <svg className="h-3 w-56" viewBox="0 0 220 12" fill="none" preserveAspectRatio="none">
              <path d="M2 6 C 60 10, 160 10, 218 5" stroke="#7D84EF" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </Reveal>
        </div>
      </div>

      {/* intro + two bulleted columns */}
      <div className="mt-20 grid gap-12 md:grid-cols-[1fr_1fr_1fr]">
        <Reveal>
          <p className="max-w-xs text-sm leading-[1.9] text-muted">{highlight(skillsIntro, SKILL_MARKS)}</p>
        </Reveal>
        {skillTags.map((col, ci) => (
          <ul key={ci} className="space-y-3">
            {col.map((tag, i) => (
              <Reveal key={tag} delay={i * 0.05} className="flex items-center gap-3 border-b border-ink/10 pb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                <span className="text-base text-ink/80">{tag}</span>
              </Reveal>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}
