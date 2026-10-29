import { motion } from 'framer-motion'

// Hand-drawn periwinkle annotation that DRAWS ON when scrolled into view.
// type="underline" → wavy line beneath the words
// type="circle"    → hand-drawn ellipse around the words
// The whileInView trigger lives on the wrapping <span> (reliable HTML
// intersection), and propagates to the path via variants.

const UNDERLINE = 'M4 13 C 55 4, 120 6, 170 11 S 250 17, 296 8'
const CIRCLE =
  'M150 5 C 72 3, 8 11, 6 27 C 4 45, 74 51, 150 49 C 228 51, 294 44, 293 27 C 292 11, 228 3, 150 5'

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: { pathLength: 1, opacity: 1 },
}

export default function Mark({ children, type = 'underline', color = '#7D84EF', delay = 0, className = '' }) {
  const isCircle = type === 'circle'
  return (
    <motion.span
      className={`relative inline-block ${isCircle ? 'px-2' : ''} ${className}`}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.5 }}
    >
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden
        className={
          isCircle
            ? 'pointer-events-none absolute -inset-x-2 -inset-y-[0.25em] z-0 h-[calc(100%+0.5em)] w-[calc(100%+1rem)]'
            : 'pointer-events-none absolute -bottom-[0.22em] left-0 z-0 h-[0.5em] w-full'
        }
        viewBox={isCircle ? '0 0 300 54' : '0 0 300 20'}
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path
          d={isCircle ? CIRCLE : UNDERLINE}
          stroke={color}
          strokeWidth={isCircle ? 2 : 3}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          variants={draw}
          transition={{ pathLength: { duration: 0.7, ease: 'easeInOut', delay }, opacity: { duration: 0.08, delay } }}
        />
      </svg>
    </motion.span>
  )
}
