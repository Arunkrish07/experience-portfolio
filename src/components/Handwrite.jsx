import { motion } from 'framer-motion'

// Letter-by-letter "type / sign" reveal for handwritten text.
// start="mount" types on load (hero); start="view" signs when scrolled into view (footer).
export default function Handwrite({
  text,
  className = '',
  color,
  start = 'view',
  stagger = 0.07,
  delay = 0,
  caret = false,
}) {
  const letters = Array.from(text)
  const total = delay + letters.length * stagger
  const reveal =
    start === 'mount'
      ? { animate: { opacity: 1, y: 0 } }
      : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.5 } }

  return (
    <span className={className} style={color ? { color } : undefined} aria-label={text}>
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ opacity: 0, y: 8 }}
          {...reveal}
          transition={{ duration: 0.18, delay: delay + i * stagger, ease: 'easeOut' }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
      {caret && (
        <motion.span
          aria-hidden
          className="ml-[2px] inline-block w-[2px] self-stretch"
          style={{ backgroundColor: color || 'currentColor' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: total, times: [0, 0.1, 0.5, 0.6, 1] }}
        >
          &nbsp;
        </motion.span>
      )}
    </span>
  )
}
