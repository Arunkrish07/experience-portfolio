import { motion, useTransform } from 'framer-motion'
import Reveal, { RevealWord } from './Reveal'
import Phone, { CoverScreen, HomeScreen, DetailScreen } from './Phone'
import Glass from './Glass'
import { useIsMobile } from '../hooks'
import { highlight } from '../highlight'

// important phrases to annotate, per project
const PROJECT_MARKS = {
  'healthcare-op': [{ p: 'patient flow', t: 'circle' }, { p: 'seat allocation and queuing', t: 'underline' }],
  'tender-management': [{ p: 'status tracking', t: 'circle' }, { p: 'tender publishing', t: 'underline' }],
  'property-management': [{ p: 'across web and mobile', t: 'circle' }, { p: 'shared data layer', t: 'underline' }],
  'attendance-app': [{ p: 'real-time attendance', t: 'underline' }, { p: 'Google Play', t: 'circle' }],
  'fintech-app': [{ p: 'secure services', t: 'circle' }, { p: 'Google Play', t: 'underline' }],
}

const TILT = [
  { rot: -7, y: 24, z: 10, scale: 0.92 },
  { rot: 0, y: 0, z: 30, scale: 1.04 },
  { rot: 6, y: 30, z: 10, scale: 0.9 },
]

function Trio({ project }) {
  const screens = [CoverScreen, HomeScreen, DetailScreen]
  const xs = useIsMobile(420)
  const sm = useIsMobile(640)
  const md = useIsMobile(1024)
  const w = xs ? 56 : sm ? 70 : md ? 116 : 150
  const overlap = sm ? '-mx-4' : '-mx-6'
  return (
    <div className="relative flex items-center justify-center">
      {screens.map((Screen, i) => {
        const t = TILT[i]
        return (
          <motion.div
            key={i}
            className={i === 1 ? 'relative' : `relative ${overlap}`}
            style={{ zIndex: t.z }}
            initial={{ opacity: 0, y: 70, rotate: t.rot * 1.8, scale: t.scale * 0.9 }}
            whileInView={{ opacity: 1, y: t.y, rotate: t.rot, scale: t.scale }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18, delay: i * 0.12 }}
          >
            <Phone w={w}>
              <Screen project={project} />
            </Phone>
          </motion.div>
        )
      })}
    </div>
  )
}

const LINK_LABEL = { live: 'Live demo', play: 'Google Play', github: 'GitHub' }

export default function CaseStudy({ project, flip = false, dark = false, index = 0, total = 1, progress }) {
  const theme = dark
    ? { bg: 'bg-dark', title: 'text-paper', body: 'text-paper/80', border: 'border-white/10', chip: 'border-white/25 text-paper/80' }
    : { bg: 'bg-paper', title: 'text-ink', body: 'text-ink/80', border: 'border-ink/10', chip: 'border-ink/20 text-ink/70' }

  const links = Object.entries(project.links || {}).filter(([, v]) => v)

  // Stacking-cards motion: each card sticks, and earlier cards scale down as the
  // next one slides up over them. Card contents are untouched.
  const scaleTo = 1 - (total - 1 - index) * 0.035
  const scale = useTransform(progress, [index / total, 1], [1, scaleTo])

  return (
    <>
      {/* non-sticky anchor marker at this card's flow position, so hash links
          (e.g. a phone tap → #id) scroll here reliably despite the sticky stack */}
      <span id={project.id} aria-hidden className="block h-0 scroll-mt-24" />
      <div className="sticky px-4 md:px-6" style={{ top: `${76 + index * 12}px` }}>
        <motion.section
          data-nav-label={project.name.split(' ')[0].toLowerCase()}
          style={{ scale }}
          className={`mx-auto max-w-5xl origin-top overflow-hidden rounded-[32px] ${theme.bg} shadow-[0_30px_70px_-24px_rgba(0,0,0,0.5)]`}
        >
      <Glass
        variant={dark ? 'dark' : 'light'}
        refract
        className="rounded-[32px] px-5 py-6 md:px-10 md:py-8"
      >
      <Reveal className="flex items-center gap-3">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">
          {project.index} — {project.category}
        </p>
        {project.comingSoon && (
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: project.accent }}
          >
            Coming soon
          </span>
        )}
      </Reveal>

      <div className={`mt-4 grid items-center gap-5 md:grid-cols-2 md:gap-10 ${flip ? 'md:[&>*:first-child]:order-2' : ''}`}>
        {/* text column */}
        <div>
          <h3 className={`serif text-3xl leading-[1.08] sm:text-4xl md:text-5xl lg:text-6xl ${theme.title}`}>
            <RevealWord text={project.name} stagger={0.04} />
          </h3>
          <Reveal delay={0.1}>
            <p className="mt-2.5 text-base italic text-accent">{project.tagline}</p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className={`mt-2.5 max-w-xl text-sm leading-[1.6] md:text-[15px] ${theme.body}`}>
              {highlight(project.description, PROJECT_MARKS[project.id] || [])}
            </p>
          </Reveal>

          {project.stack.length > 0 && (
            <Reveal delay={0.18} className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span key={s} className={`rounded-full border px-3 py-1 text-xs ${theme.chip}`}>
                  {s}
                </span>
              ))}
            </Reveal>
          )}

          {links.length > 0 && (
            <Reveal delay={0.22} className="mt-5 flex flex-wrap gap-4">
              {links.map(([k, href]) => (
                <a
                  key={k}
                  href={href}
                  className={`text-sm underline-offset-4 hover:underline ${theme.title}`}
                >
                  {LINK_LABEL[k] || k} ↗
                </a>
              ))}
            </Reveal>
          )}
        </div>

        {/* fanned phone trio */}
        <Trio project={project} />
      </div>
        </Glass>
        </motion.section>
      </div>
    </>
  )
}
