import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import Phone, { CoverScreen } from './Phone'
import { projects } from '../data'
import { useIsMobile } from '../hooks'

// One phone card, absolutely centred, interpolating from a scattered stack
// to its final slot as the pinned section's scroll progress advances.
// Desktop = neat row; mobile/tablet = overlapping fan (so all 5 always fit).
function PhoneCard({ project, i, count, progress, cfg, showLabel }) {
  const mid = (count - 1) / 2
  const d = i - mid

  const x = useTransform(progress, [0, 0.85], [d * cfg.scatterX, d * cfg.finalGap])
  const y = useTransform(progress, [0, 0.85], [40 + Math.abs(d) * 22, 0])
  const rotate = useTransform(progress, [0, 0.85], [d * cfg.scatterRot, d * cfg.finalRot])
  const scale = useTransform(progress, [0, 0.85], [0.84, 1])
  const opacity = useTransform(progress, [0, 0.22], [0, 1])
  const labelOpacity = useTransform(progress, [0.75, 0.97], [0, 1])

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <motion.div style={{ x, y, rotate, scale, opacity, zIndex: count - Math.abs(Math.round(d)) }} className="flex flex-col items-center">
        <a href={`#${project.id}`} className="block transition-transform duration-500 hover:-translate-y-2">
          <Phone w={cfg.w}>
            <CoverScreen project={project} />
          </Phone>
        </a>
        {showLabel && (
          <motion.div
            style={{ opacity: labelOpacity, width: cfg.w }}
            className="mt-3 flex flex-col items-center text-center"
          >
            <p className="text-xs leading-snug text-paper/70">
              <span className="text-paper">{project.index}.</span> {project.name}
            </p>
            <span className="hand mt-0.5 text-lg leading-tight text-accent">{project.tag}</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default function ProjectsOverview() {
  const ref = useRef(null)
  const sm = useIsMobile(640)
  const md = useIsMobile(1024)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 })
  const headOpacity = useTransform(progress, [0, 0.15], [0, 1])
  const headY = useTransform(progress, [0, 0.15], [30, 0])

  // responsive layout config
  const cfg = sm
    ? { w: 100, scatterX: 58, scatterRot: 6, finalGap: 66, finalRot: 4 } // mobile: light fan, more spacing (fits ~380px)
    : md
    ? { w: 120, scatterX: 100, scatterRot: 6, finalGap: 132, finalRot: 0 } // tablet: row
    : { w: 150, scatterX: 135, scatterRot: 6, finalGap: 168, finalRot: 0 } // desktop: row
  const stageH = Math.round(cfg.w * 2.17) + 86

  return (
    <section id="projects" ref={ref} data-nav-label="projects" className="relative h-[220vh] md:h-[240vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden bg-dark px-6 text-paper md:px-10">
        <motion.div
          style={{ opacity: headOpacity, y: headY }}
          className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between"
        >
          <h2 className="serif text-5xl leading-none text-paper sm:text-6xl md:text-8xl">Projects.</h2>
          <p className="hand text-xl text-accent md:text-right md:text-2xl">Hard skills? You'll find them all in here</p>
        </motion.div>

        <div className="relative mx-auto mt-6 w-full md:mt-8" style={{ height: stageH }}>
          {projects.map((p, i) => (
            <PhoneCard key={p.id} project={p} i={i} count={projects.length} progress={progress} cfg={cfg} showLabel={!sm} />
          ))}
        </div>
      </div>
    </section>
  )
}
