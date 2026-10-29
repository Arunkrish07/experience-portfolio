import { motion } from 'framer-motion'
import Reveal, { RevealWord } from './Reveal'
import Handwrite from './Handwrite'
import { contact, profile } from '../data'

export default function Footer() {
  return (
    <footer id="contact" data-nav-label="thank you" className="border-t border-ink/10 px-6 pb-10 pt-24 md:px-10">
      <div className="grid gap-14 md:grid-cols-2 md:gap-20">
        {/* left: heading + contact details */}
        <div>
          <h2 className="serif text-5xl leading-[0.95] sm:text-6xl md:text-8xl">
            <RevealWord text={contact.heading} stagger={0.04} />
          </h2>
          <Reveal className="mt-4">
            <span className="accent-rule block w-40" />
          </Reveal>

          <Reveal className="mt-12 space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Email</p>
              <a href={`mailto:${contact.email}`} className="break-token serif text-lg underline-offset-4 hover:underline sm:text-2xl">
                {contact.email}
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Phone</p>
              <a href={`tel:${contact.phone}`} className="serif text-2xl underline-offset-4 hover:underline">
                {contact.phone}
              </a>
            </div>
          </Reveal>

          <Reveal className="mt-8 flex flex-wrap items-center gap-6">
            {contact.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hand text-2xl hover:opacity-70">
                {s.label}
              </a>
            ))}
            <a
              href={profile.resumeUrl}
              className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper hover:bg-ink-2"
            >
              Download resume
            </a>
          </Reveal>
        </div>

        {/* right: closing note */}
        <div className="flex flex-col justify-end">
          <Reveal>
            <p className="hand text-2xl leading-relaxed md:text-3xl">
              {contact.closing.map((line, i) => (
                <span key={i} className="mb-5 block">
                  {line}
                </span>
              ))}
            </p>
          </Reveal>
          <div className="mt-6 flex items-center gap-4">
            <span className="relative inline-block h-16 w-16 shrink-0">
              <img
                src={profile.photo}
                alt={profile.name}
                className="h-16 w-16 rounded-full object-cover grayscale ring-2 ring-accent ring-offset-2 ring-offset-paper"
              />
            </span>
            <div className="inline-flex flex-col items-start">
              <Handwrite
                text={contact.signature}
                start="view"
                stagger={0.09}
                color="#7D84EF"
                className="hand text-5xl"
              />
              {/* signature flourish — draws on after the name finishes typing */}
              <motion.svg
                className="-mt-1 h-12 w-56"
                viewBox="0 0 260 60"
                fill="none"
                initial="hidden"
                whileInView="shown"
                viewport={{ once: true, amount: 0.6 }}
              >
                <motion.path
                  d="M6 34 C 50 18, 120 20, 182 26 C 214 29, 238 24, 244 12 C 250 1, 232 -3, 222 8 C 208 23, 214 44, 244 40 C 250 39, 254 36, 256 33"
                  stroke="#7D84EF"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  variants={{ hidden: { pathLength: 0, opacity: 0 }, shown: { pathLength: 1, opacity: 1 } }}
                  transition={{ pathLength: { duration: 1, ease: 'easeInOut', delay: 0.7 }, opacity: { duration: 0.1, delay: 0.7 } }}
                />
              </motion.svg>
            </div>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="mt-24 flex flex-col items-start justify-between gap-3 border-t border-ink/10 pt-6 text-xs text-muted md:flex-row md:items-center">
        <span>© {profile.year} {profile.name} · Chennai, India</span>
        <div className="flex gap-5">
          {contact.socials.map((s) => (
            <a key={s.label} href={s.href} className="hover:text-ink">{s.label}</a>
          ))}
        </div>
        <a href="#top" className="hand text-lg text-ink hover:text-accent">
          back to top ↑
        </a>
      </div>
    </footer>
  )
}
