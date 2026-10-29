import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '../data'
import { useActiveLabel } from '../hooks'

export default function Header() {
  const label = useActiveLabel('cover')
  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <div className="flex items-center justify-between px-5 py-4 text-[12px] text-white md:px-10 md:py-5 md:text-[13px]">
        <span className="tabular-nums tracking-wide">{profile.year}</span>
        <span className="hidden tracking-wide md:block">Curriculum Vitae</span>
        <span className="flex items-center gap-2 md:gap-3">
          <span className="hidden tracking-wide sm:inline">{profile.name}</span>
          <span className="relative inline-flex h-6 min-w-[70px] items-center justify-end overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.a
                key={label}
                href="#top"
                className="hand whitespace-nowrap text-xl leading-none text-white md:text-2xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {label}
              </motion.a>
            </AnimatePresence>
          </span>
        </span>
      </div>
    </header>
  )
}
