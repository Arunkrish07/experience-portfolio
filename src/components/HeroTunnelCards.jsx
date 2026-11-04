import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform, useMotionValue, useReducedMotion } from 'framer-motion'
import { projects, skillApps } from '../data'

// Flying project + skill cards for the hero tunnel. This is ONLY the animated
// cards layer — no background, no colors changed. It sits behind the existing
// hero content so the original design stays exactly the same.
const SKILL_LABEL = { React: 'React', RN: 'React Native', Py: 'Python', Dj: 'Django', Supa: 'Supabase' }

const CARDS = (() => {
  const out = []
  const max = Math.max(projects.length, skillApps.length)
  for (let i = 0; i < max; i++) {
    if (projects[i]) {
      const p = projects[i]
      out.push({ kind: 'project', title: p.name, sub: p.tag, from: p.accent, to: p.accent2 })
    }
    if (skillApps[i]) {
      const s = skillApps[i]
      out.push({ kind: 'skill', title: SKILL_LABEL[s.label] || s.label, bg: s.bg, fg: s.fg })
    }
  }
  return out.map((c, i) => {
    const golden = i * 137.5 * (Math.PI / 180)
    return {
      ...c,
      index: i,
      cos: Math.cos(golden),
      sin: Math.sin(golden),
      rX: 0.32 + (i % 3) * 0.08,
      rY: 0.3 + (i % 2) * 0.09,
      rot: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
    }
  })
})()

const SPRING = { stiffness: 60, damping: 25, mass: 0.5 }

function useCameraParallax(enabled) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, SPRING)
  const y = useSpring(rawY, SPRING)
  useEffect(() => {
    if (!enabled) return
    const onMove = (e) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2)
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled, rawX, rawY])
  return { x, y }
}

function TunnelCard({ card, progress, pointer, total, stage }) {
  const staggerSpan = 0.6
  const start = (card.index / total) * (1 - staggerSpan)
  const end = start + staggerSpan
  const local = useTransform(progress, [start, end], [0, 1])

  const farZ = stage.isMobile ? -1200 : -1700
  const nearZ = stage.isMobile ? 320 : 460
  const z = useTransform(local, [0, 1], [farZ, nearZ])
  const opacity = useTransform(local, [0, 0.18, 0.8, 0.99], [0, 1, 1, 0])

  const cardWidth = stage.isMobile
    ? Math.max(104, Math.min(150, stage.width * 0.34))
    : Math.max(120, Math.min(190, stage.width * 0.13))

  const baseX = card.cos * (stage.width * card.rX)
  const baseY = card.sin * (stage.height * card.rY)
  const pan = stage.isMobile ? 16 : 38

  const transform = useTransform([z, pointer.x, pointer.y], ([cz, px, py]) => {
    const ox = baseX - px * pan
    const oy = baseY - py * pan
    return `translate3d(calc(-50% + ${ox}px), calc(-50% + ${oy}px), ${cz}px) rotateZ(${card.rot}deg)`
  })

  return (
    <motion.div
      style={{ width: cardWidth, transform, opacity, zIndex: card.index + 1 }}
      className="pointer-events-none absolute left-1/2 top-1/2 aspect-[4/5] select-none will-change-transform"
    >
      <div className="relative flex h-full w-full flex-col justify-end overflow-hidden rounded-2xl p-3 shadow-[0_22px_45px_-18px_rgba(0,0,0,0.45)] ring-1 ring-black/10">
        {card.kind === 'project' ? (
          <>
            <span className="absolute inset-0" style={{ background: `linear-gradient(155deg, ${card.from}, ${card.to})` }} />
            <span className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent 55%)' }} />
            <span className="serif relative text-sm leading-tight text-white drop-shadow sm:text-base">{card.title}</span>
            <span className="hand relative text-sm text-white/90">{card.sub}</span>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: card.bg }}>
            <span className="serif text-lg font-semibold tracking-tight sm:text-xl" style={{ color: card.fg }}>
              {card.title}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function HeroTunnelCards({ progress }) {
  const reduce = useReducedMotion()
  const [stage, setStage] = useState({ width: 1440, height: 900, isMobile: false })

  useEffect(() => {
    const update = () =>
      setStage({ width: window.innerWidth, height: window.innerHeight, isMobile: window.innerWidth < 768 })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const pointer = useCameraParallax(!reduce)

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ perspective: stage.isMobile ? '900px' : '1200px', transformStyle: 'preserve-3d' }}
    >
      {CARDS.map((card) => (
        <TunnelCard key={card.index} card={card} progress={progress} pointer={pointer} total={CARDS.length} stage={stage} />
      ))}
    </div>
  )
}
