import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '../data'
import { useActiveLabel } from '../hooks'
import Glass from './Glass'

// Section links + which active [data-nav-label]s should light each one up.
const NAV = [
  { label: 'About', href: '#top', match: ['cover', 'hello'] },
  { label: 'Experience', href: '#experience', match: ['experience'] },
  { label: 'Skills', href: '#skills', match: ['skills'] },
  {
    label: 'Projects',
    href: '#projects',
    match: ['projects', 'healthcare', 'tender', 'property', 'attendance', 'fintech', 'how', 'fun'],
  },
  { label: 'Contact', href: '#contact', match: ['thank'] },
]

const isActive = (n, label) => n.match.some((m) => label.toLowerCase().includes(m))

export default function Header() {
  const label = useActiveLabel('cover')
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-4 md:top-5">
      <div className="w-full max-w-5xl">
        <Glass
          refract
          style={{ '--lg-opacity': 0.5 }}
          className="flex items-center justify-between gap-3 rounded-full px-4 py-2 md:px-6 md:py-2.5"
        >
          {/* brand */}
          <a href="#top" className="flex items-center gap-2.5 text-ink/85" onClick={() => setOpen(false)}>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[11px] font-semibold tracking-wide text-paper">
              AK
            </span>
            <span className="hidden text-[13px] tracking-wide sm:inline">
              {profile.name.split(' ')[0]}
            </span>
          </a>

          {/* desktop / tablet links */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`rounded-full px-3 py-1.5 text-[13px] tracking-wide transition-colors ${
                  isActive(n, label) ? 'bg-ink/10 text-ink' : 'text-ink/60 hover:text-ink'
                }`}
              >
                {n.label}
              </a>
            ))}
          </nav>

          {/* right: live handwritten label (wide screens) + mobile menu toggle */}
          <div className="flex items-center gap-2">
            <span className="hand hidden min-w-[64px] text-right text-xl leading-none text-accent lg:inline">
              {label}
            </span>
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-8 w-8 place-items-center rounded-full text-ink/80 hover:bg-ink/10 md:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                {open ? (
                  <>
                    <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </Glass>

        {/* mobile dropdown menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-2 md:hidden"
            >
              <Glass style={{ '--lg-opacity': 0.55 }} className="flex flex-col gap-1 rounded-3xl p-2">
                {NAV.map((n) => (
                  <a
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-2xl px-4 py-2.5 text-[15px] tracking-wide transition-colors ${
                      isActive(n, label) ? 'bg-ink/10 text-ink' : 'text-ink/70 hover:bg-ink/5'
                    }`}
                  >
                    {n.label}
                  </a>
                ))}
              </Glass>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
