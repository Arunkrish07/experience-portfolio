import { motion } from 'framer-motion'
import Reveal, { RevealWord } from './Reveal'
import Phone, { CoverScreen, HomeScreen, DetailScreen } from './Phone'
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
  const sm = useIsMobile(640)
  const md = useIsMobile(1024)
  const w = sm ? 104 : md ? 148 : 200
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

export default function CaseStudy({ project, flip = false, dark = false }) {
  const theme = dark
    ? { bg: 'bg-dark', title: 'text-paper', body: 'text-paper/80', border: 'border-white/10', chip: 'border-white/25 text-paper/80' }
    : { bg: 'bg-paper', title: 'text-ink', body: 'text-ink/80', border: 'border-ink/10', chip: 'border-ink/20 text-ink/70' }

  const links = Object.entries(project.links || {}).filter(([, v]) => v)

  return (
    <section
      id={project.id}
      data-nav-label={project.name.split(' ')[0].toLowerCase()}
      className={`scroll-mt-20 border-t ${theme.border} ${theme.bg} px-6 py-24 md:px-10 md:py-32`}
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

      <div className={`mt-6 grid items-center gap-16 md:grid-cols-2 md:gap-20 ${flip ? 'md:[&>*:first-child]:order-2' : ''}`}>
        {/* text column */}
        <div>
          <h3 className={`serif text-5xl leading-none md:text-7xl ${theme.title}`}>
            <RevealWord text={project.name} stagger={0.04} />
          </h3>
          <Reveal delay={0.1}>
            <p className="mt-4 text-lg italic text-accent">{project.tagline}</p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className={`mt-4 max-w-xl text-lg leading-[1.9] ${theme.body}`}>
              {highlight(project.description, PROJECT_MARKS[project.id] || [])}
            </p>
          </Reveal>

          {project.stack.length > 0 && (
            <Reveal delay={0.18} className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span key={s} className={`rounded-full border px-3 py-1 text-xs ${theme.chip}`}>
                  {s}
                </span>
              ))}
            </Reveal>
          )}

          {links.length > 0 && (
            <Reveal delay={0.22} className="mt-8 flex flex-wrap gap-4">
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
    </section>
  )
}
