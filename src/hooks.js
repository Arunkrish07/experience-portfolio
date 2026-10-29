import { useState, useEffect } from 'react'

// Tracks which [data-nav-label] section is at the centre of the viewport.
export function useActiveLabel(defaultLabel = 'cover') {
  const [label, setLabel] = useState(defaultLabel)
  useEffect(() => {
    const els = [...document.querySelectorAll('[data-nav-label]')]
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            const l = en.target.getAttribute('data-nav-label')
            if (l) setLabel(l)
          }
        })
      },
      { rootMargin: '-48% 0px -48% 0px', threshold: 0 }
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])
  return label
}

// True below the given breakpoint (px).
export function useIsMobile(bp = 768) {
  const [m, setM] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${bp - 1}px)`)
    const on = () => setM(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [bp])
  return m
}
