import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import Reveal from './Reveal'
import Phone, { CoverScreen } from './Phone'
import { projects } from '../data'
import { useIsMobile } from '../hooks'

function Labels({ project }) {
  return (
    <div className="mt-4 flex flex-col items-center">
      <p className="text-sm text-paper/60">
        <span className="text-paper">{project.index}.</span> {project.name}
      </p>
      <span className="hand text-xl text-accent">{project.tag}</span>
    </div>
  )
}

// desktop: scatter → converge driven by scroll progress
function PhoneCard({ project, i, count, progress }) {
  const mid = (count - 1) / 2
  const dir = i - mid
  const x = useTransform(progress, [0, 0.85], [dir * -150, 0])
  const y = useTransform(progress, [0, 0.85], [60 + Math.abs(dir) * 26, 0])
  const rotate = useTransform(progress, [0, 0.85], [dir * 5, 0])
  const scale = useTransform(progress, [0, 0.85], [0.86, 1])
  const opacity = useTransform(progress, [0, 0.25], [0, 1])
  const labelOpacity = useTransform(progress, [0.7, 0.95], [0, 1])

  return (
    <motion.div style={{ x, y, rotate, scale, opacity }} className="flex shrink-0 flex-col items-center">
      <a href={`#${project.id}`} className="block transition-transform duration-500 hover:-translate-y-2">
        <Phone w={168}>
          <CoverScreen project={project} />
        </Phone>
      </a>
      <motion.div style={{ opacity: labelOpacity }}>
        <Labels project={project} />
      </motion.div>
    </motion.div>
  )
}

function Head({ style }) {
  return (
    <motion.div
      style={style}
      className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between"
    >
      <h2 className="serif text-5xl leading-none text-paper sm:text-6xl md:text-8xl">Projects.</h2>
      <p className="hand text-xl text-accent md:text-right md:text-2xl">
        Hard skills? You'll find them all in here
      </p>
    </motion.div>
  )
}

export default function ProjectsOverview() {
  const ref = useRef(null)
  const isMobile = useIsMobile(768)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 })
  const headOpacity = useTransform(progress, [0, 0.15], [0, 1])
  const headY = useTransform(progress, [0, 0.15], [30, 0])

  // ---- mobile: simple horizontal rail, no pinning ----
  if (isMobile) {
    return (
      <section id="projects" data-nav-label="projects" className="bg-dark px-6 py-20 text-paper">
        <Reveal>
          <Head style={{}} />
        </Reveal>
        <div className="no-scrollbar -mx-6 mt-10 flex snap-x gap-5 overflow-x-auto px-6 pb-4">
          {projects.map((p) => (
            <Reveal key={p.id} className="shrink-0 snap-center">
              <a href={`#${p.id}`} className="block">
                <Phone w={158}>
                  <CoverScreen project={p} />
                </Phone>
              </a>
              <Labels project={p} />
            </Reveal>
          ))}
        </div>
      </section>
    )
  }

  // ---- desktop/tablet: pinned scatter → converge ----
  return (
    <section id="projects" ref={ref} data-nav-label="projects" className="relative h-[240vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden bg-dark px-6 text-paper md:px-10">
        <Head style={{ opacity: headOpacity, y: headY }} />
        <div className="no-scrollbar mt-10 flex items-start justify-center gap-4 overflow-x-auto md:gap-5">
          {projects.map((p, i) => (
            <PhoneCard key={p.id} project={p} i={i} count={projects.length} progress={progress} />
          ))}
        </div>
      </div>
    </section>
  )
}
