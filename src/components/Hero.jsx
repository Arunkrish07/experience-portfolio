import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { profile } from '../data'
import OrbitStar from './OrbitStar'
import InkTrail from './InkTrail'
import Handwrite from './Handwrite'
import Mark from './Mark'

// One hero letter: an outer layer driven by scroll (split + rise + tilt),
// and an inner layer that springs up on mount.
function HeroLetter({ ch, i, total, progress, isLastO }) {
  const mid = (total - 1) / 2
  const d = mid ? (i - mid) / mid : 0 // -1 .. +1 from centre

  // scroll-linked targets (measured from the original)
  const x = useTransform(progress, [0, 1], [0, d * 70])
  const y = useTransform(progress, [0, 1], [0, -(45 + 55 * (1 - Math.abs(d)))])
  const rotate = useTransform(progress, [0, 1], [0, d * 6])

  return (
    <motion.span className="relative inline-block" style={{ x, y, rotate }}>
      <motion.span
        className="inline-block"
        initial={{ opacity: 0, y: '0.5em', rotate: 8 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18, delay: i * 0.05 }}
      >
        {ch}
      </motion.span>
      {isLastO && (
        <motion.span
          className="absolute left-1/2 top-[52%] inline-block"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: total * 0.05 + 0.2, duration: 0.6 }}
        >
          <OrbitStar size={1.15} tilt={-16} />
        </motion.span>
      )}
    </motion.span>
  )
}

function HeroTitle({ text, progress }) {
  const letters = Array.from(text)
  const lastO = text.toLowerCase().lastIndexOf('o')
  const scale = useTransform(progress, [0, 1], [1, 0.9])
  return (
    <motion.h1
      className="serif relative mx-auto whitespace-nowrap leading-[0.8] text-ink text-[clamp(2.6rem,15vw,16rem)]"
      style={{ scale }}
    >
      {letters.map((ch, i) => (
        <HeroLetter key={i} ch={ch} i={i} total={letters.length} progress={progress} isLastO={i === lastO} />
      ))}
    </motion.h1>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  return (
    <section
      id="top"
      ref={ref}
      data-nav-label="cover"
      className="paper-grain relative flex min-h-screen flex-col justify-between overflow-hidden px-6 pb-10 pt-28 md:px-10"
    >
      {/* visitor can "write" here with the cursor — blue ink */}
      <InkTrail color="#7D84EF" width={3.5} />

      {/* floating accent specks */}
      {[
        { top: '24%', left: '66%', s: 6 },
        { top: '58%', left: '74%', s: 4 },
        { top: '40%', left: '90%', s: 5 },
        { top: '80%', left: '16%', s: 4 },
      ].map((d, i) => (
        <motion.span
          key={i}
          className="absolute z-0 rounded-full bg-accent"
          style={{ top: d.top, left: d.left, width: d.s, height: d.s }}
          animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* handwritten signature + arrow */}
      <motion.div
        className="pointer-events-none absolute right-4 top-20 z-20 text-right sm:right-8 md:right-16 md:top-24"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.7 }}
      >
        <Handwrite
          text={profile.heroSignature}
          start="mount"
          delay={0.6}
          stagger={0.09}
          caret
          color="#7D84EF"
          className="hand inline-flex items-end text-2xl sm:text-4xl md:text-5xl"
        />
        <svg className="ml-auto mt-1 block h-7 w-16 md:h-10 md:w-24" viewBox="0 0 150 110" fill="none">
          <path d="M140 10 C 90 20, 40 35, 18 85" stroke="#7D84EF" strokeWidth="3" strokeLinecap="round" />
          <path d="M8 70 L18 88 L34 80" stroke="#7D84EF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      {/* giant display word with scroll-driven split + orbiting star */}
      <div className="relative z-0 flex flex-1 items-center justify-center">
        <HeroTitle text={profile.heroWord} progress={progress} />
      </div>

      {/* bottom meta row */}
      <motion.div
        className="relative z-0 flex flex-col justify-between gap-6 md:flex-row md:items-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/40 px-3 py-1 text-xs text-ink/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2E9E6B]" />
            {profile.badge}
          </span>
          <p className="serif mt-3 text-2xl md:text-3xl">{profile.name}</p>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <Mark type="circle" delay={1.3}>
              <span className="text-ink">{profile.role}</span>
            </Mark>
            <span>{profile.location} — {profile.year}</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">{profile.tagline}</p>
        </div>
        <motion.div
          className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          scroll
          <span className="block h-8 w-px bg-muted" />
        </motion.div>
      </motion.div>
    </section>
  )
}
