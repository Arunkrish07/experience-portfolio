import Reveal from './Reveal'
import { highlight } from '../highlight'
import { profile } from '../data'

const BIO_MARKS = [
  { p: 'requirement to deployment', t: 'underline' },
  { p: 'React, React Native, Python, Django', t: 'underline' },
  { p: 'published apps on Google Play', t: 'circle' },
]

export default function Intro() {
  return (
    <section data-nav-label="hello" className="relative px-6 py-24 md:px-10 md:py-36">
      <Reveal>
        <p className="hand text-3xl md:text-4xl">Curriculum Vitae</p>
      </Reveal>

      <div className="mt-14 grid gap-14 lg:grid-cols-[320px_1fr] lg:gap-20">
        {/* photo with crop-mark frame + handwritten traits */}
        <Reveal x={-20} className="relative mx-auto w-full max-w-[300px]">
          <div className="crop-frame">
            <img
              src={profile.photo}
              alt={profile.name}
              className="aspect-[4/5] w-full object-cover grayscale"
            />
            <span className="absolute -left-2 -top-2 h-5 w-5 border-l-2 border-t-2 border-accent" />
            <span className="absolute -right-2 -top-2 h-5 w-5 border-r-2 border-t-2 border-accent" />
            <span className="absolute -bottom-2 -left-2 h-5 w-5 border-b-2 border-l-2 border-accent" />
            <span className="absolute -bottom-2 -right-2 h-5 w-5 border-b-2 border-r-2 border-accent" />
          </div>
          <span className="hand absolute -right-4 top-6 rotate-6 text-xl sm:text-2xl">{profile.traits[3]}</span>
          <span className="hand absolute -left-6 bottom-10 -rotate-6 text-xl sm:text-2xl">{profile.traits[4]}</span>
          <span className="hand absolute -bottom-7 right-8 text-xl sm:text-2xl">{profile.traits[5]}</span>
        </Reveal>

        {/* bio */}
        <div className="relative">
          <div className="mb-6 flex flex-wrap gap-x-5 gap-y-1">
            {profile.traits.slice(0, 3).map((t) => (
              <span key={t} className="hand text-xl sm:text-2xl">
                {t}
              </span>
            ))}
          </div>
          <Reveal>
            <p className="serif text-4xl md:text-5xl">{profile.bioLead}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-lg leading-[1.9] text-ink/80">{highlight(profile.bio, BIO_MARKS)}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
