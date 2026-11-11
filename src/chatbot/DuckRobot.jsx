// =============================================================
//  DUCK ROBOT  — cute SVG robot duck
//  Props:
//   - speaking: animates the beak while the bot talks
//   - reaction: 'idle' | 'angry' (changes colour); motion reactions
//     are driven by a CSS class on the wrapper (see chatbot.css)
//   - title: accessible label
// =============================================================
export default function DuckRobot({ speaking = false, reaction = 'idle', className = '', title = 'Assistant duck' }) {
  const angry = reaction === 'angry'
  const body = angry ? '#F2C14E' : '#FFD54A'
  const bodyDark = angry ? '#E0A32E' : '#F5B301'
  const beak = '#FF8A3D'
  const beakDark = '#E8641C'

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* antenna */}
      <line x1="60" y1="20" x2="60" y2="8" stroke={bodyDark} strokeWidth="3" strokeLinecap="round" />
      <circle className="duck-antenna" cx="60" cy="7" r="5" fill="#7D84EF" />

      {/* feet */}
      <g fill={beak}>
        <ellipse cx="46" cy="110" rx="10" ry="5" />
        <ellipse cx="74" cy="110" rx="10" ry="5" />
      </g>

      {/* body */}
      <ellipse cx="60" cy="72" rx="34" ry="30" fill={body} />
      <ellipse cx="60" cy="80" rx="26" ry="20" fill="#FFFFFF" opacity="0.35" />

      {/* wings */}
      <path className="duck-wing duck-wing-l" d="M28 66 q-12 6 -4 20 q10 6 14 -4 z" fill={bodyDark} />
      <path className="duck-wing duck-wing-r" d="M92 66 q12 6 4 20 q-10 6 -14 -4 z" fill={bodyDark} />

      {/* head */}
      <circle cx="60" cy="40" r="26" fill={body} />
      <circle cx="60" cy="40" r="26" fill="#FFFFFF" opacity="0.12" />

      {/* face plate (robot) */}
      <rect x="42" y="30" width="36" height="20" rx="10" fill="#2B2B2E" />
      {/* LED eyes */}
      <circle className="duck-eye" cx="52" cy="40" r="4.5" fill={angry ? '#FF4D4D' : '#8FE3FF'} />
      <circle className="duck-eye" cx="68" cy="40" r="4.5" fill={angry ? '#FF4D4D' : '#8FE3FF'} />
      {/* angry brows */}
      {angry && (
        <g stroke="#E0641C" strokeWidth="3" strokeLinecap="round">
          <line x1="46" y1="31" x2="56" y2="35" />
          <line x1="74" y1="31" x2="64" y2="35" />
        </g>
      )}

      {/* cheeks */}
      <circle cx="44" cy="48" r="3.5" fill="#FF9AA2" opacity="0.7" />
      <circle cx="76" cy="48" r="3.5" fill="#FF9AA2" opacity="0.7" />

      {/* beak — upper fixed, lower animates while speaking */}
      <g>
        <path d="M50 52 q10 -7 20 0 q-10 5 -20 0 z" fill={beak} />
        <path
          className={`duck-beak-lower${speaking ? ' is-talking' : ''}`}
          d="M51 53 q9 6 18 0 q-9 7 -18 0 z"
          fill={beakDark}
        />
      </g>
    </svg>
  )
}
