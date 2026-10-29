import { motion } from 'framer-motion'
import Reveal, { RevealWord } from './Reveal'
import { funFacts } from '../data'

// simple hand-drawn line doodles (original art), each path draws on when in view
const DOODLES = [
  // lightbulb
  ['M20 8 C 12 8, 7 14, 7 21 C 7 26, 10 29, 12 32 L 12 37 L 28 37 L 28 32 C 30 29, 33 26, 33 21 C 33 14, 28 8, 20 8 Z', 'M15 41 L 25 41', 'M16 45 L 24 45'],
  // coffee cup
  ['M9 18 L 31 18 L 29 38 C 29 41, 27 43, 24 43 L 16 43 C 13 43, 11 41, 11 38 Z', 'M31 22 L 37 22 C 40 22, 40 30, 34 30 L 31 30', 'M16 8 C 14 11, 18 12, 16 15', 'M24 8 C 22 11, 26 12, 24 15'],
  // music note
  ['M16 40 C 16 44, 9 44, 9 40 C 9 36, 16 36, 16 40 Z', 'M16 40 L 16 12 L 32 8 L 32 36', 'M32 36 C 32 40, 25 40, 25 36 C 25 32, 32 32, 32 36 Z'],
  // location pin
  ['M20 44 C 20 44, 32 30, 32 19 C 32 12, 27 7, 20 7 C 13 7, 8 12, 8 19 C 8 30, 20 44, 20 44 Z', 'M20 24 C 17 24, 15 22, 15 19 C 15 16, 17 14, 20 14 C 23 14, 25 16, 25 19 C 25 22, 23 24, 20 24 Z'],
  // heart
  ['M20 40 C 6 30, 6 16, 14 13 C 18 11, 20 15, 20 17 C 20 15, 22 11, 26 13 C 34 16, 34 30, 20 40 Z'],
  // sparkle / star
  ['M20 6 C 22 16, 24 18, 34 20 C 24 22, 22 24, 20 34 C 18 24, 16 22, 6 20 C 16 18, 18 16, 20 6 Z', 'M33 7 C 34 10, 35 11, 38 12 C 35 13, 34 14, 33 17 C 32 14, 31 13, 28 12 C 31 11, 32 10, 33 7 Z'],
]

const drawV = { hidden: { pathLength: 0, opacity: 0 }, shown: { pathLength: 1, opacity: 1 } }

function Doodle({ i }) {
  const paths = DOODLES[i % DOODLES.length]
  return (
    <motion.span className="inline-block" initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.5 }}>
      <svg viewBox="0 0 44 50" className="h-12 w-12" fill="none">
        {paths.map((d, k) => (
          <motion.path
            key={k}
            d={d}
            stroke="#7D84EF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={drawV}
            transition={{ pathLength: { duration: 0.6, ease: 'easeInOut', delay: k * 0.12 }, opacity: { duration: 0.1, delay: k * 0.12 } }}
          />
        ))}
      </svg>
    </motion.span>
  )
}

export default function FunFacts() {
  return (
    <section id="fun-facts" data-nav-label="fun facts" className="border-t border-white/10 bg-dark px-6 py-24 text-paper md:px-10 md:py-32">
      <Reveal>
        <p className="hand text-2xl text-accent">{funFacts.note}</p>
      </Reveal>
      <h2 className="serif mt-2 text-5xl text-paper sm:text-6xl md:text-8xl">
        <RevealWord text={funFacts.heading} stagger={0.04} />
      </h2>

      <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-x-12 gap-y-12 sm:grid-cols-2">
        {funFacts.items.map((f, i) => (
          <Reveal key={i} delay={i * 0.06} className="flex items-center gap-5">
            <span className="shrink-0">
              <Doodle i={i} />
            </span>
            <span className="hand text-2xl leading-tight sm:text-3xl">{f}</span>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
