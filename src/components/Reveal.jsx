import { motion } from 'framer-motion'

// Scroll-triggered reveal. Fades + rises into place once, when scrolled into view.
export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  y = 28,
  x = 0,
  duration = 0.7,
  once = true,
  amount = 0.3,
  className = '',
  ...rest
}) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

// Per-letter spring reveal for large display type.
// Words stay intact (can wrap between words) while each letter springs up.
export function RevealWord({ text, className = '', stagger = 0.06 }) {
  const words = text.split(' ')
  let count = 0
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {Array.from(word).map((ch) => {
            const i = count++
            return (
              <motion.span
                key={i}
                aria-hidden
                className="inline-block"
                initial={{ opacity: 0, y: '0.55em', rotate: 8 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18, delay: i * stagger }}
              >
                {ch}
              </motion.span>
            )
          })}
          {wi < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  )
}
