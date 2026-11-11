// =============================================================
//  DUCK VIDEO  — plays the micro-duck clips.
//  Idle loops a resting clip; when a reaction fires it plays that
//  clip once, then (via onReactionEnd) returns to idle.
//  Files live in /public/duck/ and are served from /duck/*.webm
// =============================================================
import { useEffect, useRef } from 'react'

const BASE = '/duck/'

// The clip shown while resting (loops) and while scrolling the page.
export const IDLE_CLIP = 'sitstand.webm' // duck sits/stands at rest
export const SCROLL_CLIP = 'walk.webm' // duck walks while the page scrolls

// reaction name -> { file, lines[] }  (lines = random speech-bubble text)
export const VIDEO_REACTIONS = {
  walk: { file: 'walk.webm', lines: ['Waddle waddle…', 'Just stretching my legs!'] },
  sitstand: { file: 'sitstand.webm', lines: ['Taking a little break!', 'Sit… and up!'] },
  kick: { file: 'kickL.webm', lines: ['Goooal! ⚽', "And it's in!"] },
  grab: { file: 'grab.webm', lines: ['Gotcha!', "Ooh, what's this?"] },
  drive: { file: 'drive.webm', lines: ['Vroom vroom! 🚗', 'Going for a drive!'] },
  standup: { file: 'standup.webm', lines: ['Up we go!', 'On my feet!'] },
}
export const VIDEO_REACTION_KEYS = Object.keys(VIDEO_REACTIONS)

export default function DuckVideo({ reaction = null, scrolling = false, onReactionEnd }) {
  const ref = useRef(null)
  const lastFile = useRef(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    // priority: a reaction (plays once) > walking while scrolling > sit-stand idle
    const entry = reaction && VIDEO_REACTIONS[reaction]
    const file = entry ? entry.file : scrolling ? SCROLL_CLIP : IDLE_CLIP
    const loop = !reaction

    // only reconfigure when the target clip actually changes, so toggling
    // `scrolling` mid-reaction never restarts the reaction clip
    if (lastFile.current === file) {
      v.loop = loop
      return
    }
    lastFile.current = file
    v.src = BASE + file
    v.loop = loop
    v.muted = true
    try {
      v.currentTime = 0
    } catch {
      /* ignore */
    }
    const p = v.play()
    if (p && p.catch) p.catch(() => {})
  }, [reaction, scrolling])

  return (
    <video
      ref={ref}
      className="duck-video"
      muted
      playsInline
      autoPlay
      preload="auto"
      onEnded={() => {
        if (reaction) onReactionEnd?.()
      }}
      onError={() => {
        // if a reaction clip fails, don't get stuck — return to idle
        if (reaction) onReactionEnd?.()
      }}
    />
  )
}
