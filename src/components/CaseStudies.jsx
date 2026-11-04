import { useRef } from 'react'
import { useScroll } from 'framer-motion'
import CaseStudy from './CaseStudy'

// Wraps the 5 project case studies and drives their stacking-cards scroll.
// Each CaseStudy is a sticky card; as you scroll they stack on top of each other.
export default function CaseStudies({ projects }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <div ref={ref} className="relative bg-paper pb-24 pt-8">
      {projects.map((p, i) => (
        <CaseStudy
          key={p.id}
          project={p}
          index={i}
          total={projects.length}
          progress={scrollYProgress}
          flip={i % 2 === 1}
          dark={i % 2 === 0}
        />
      ))}
    </div>
  )
}
