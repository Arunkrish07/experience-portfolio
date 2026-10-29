// A tilted elliptical ring with a 4-point sparkle orbiting it.
// Drawn in two arcs (back + front) so the sparkle passes behind the far
// edge and in front of the near edge — a little Saturn-ring illusion.
// Sits absolutely centred over whatever it's placed on (the hero "o").

const ACCENT = '#7D84EF'

export default function OrbitStar({ size = 2.8, tilt = -14, className = '' }) {
  // size is relative to the parent letter (em-based)
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute left-1/2 top-1/2 ${className}`}
      style={{
        width: `${size}em`,
        height: `${size}em`,
        transform: `translate(-50%, -50%) rotate(${tilt}deg)`,
      }}
    >
      <svg viewBox="-100 -100 200 200" width="100%" height="100%" overflow="visible">
        {/* back arc (upper) */}
        <path
          d="M-92 0A92 30 0 0 1 92 0"
          fill="none"
          stroke={ACCENT}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* orbiting sparkle: squish group -> spin group -> star (counter-squished) */}
        <g transform="scale(1,0.3261)">
          <g className="orbit-spin">
            <g transform="translate(0 -92)">
              <path
                transform="scale(0.95 2.9)"
                d="M0 -13C1.1 -2.9 2.9 -1.1 13 0C2.9 1.1 1.1 2.9 0 13C-1.1 2.9 -2.9 1.1 -13 0C-2.9 -1.1 -1.1 -2.9 0 -13Z"
                fill={ACCENT}
              />
            </g>
          </g>
        </g>
        {/* front arc (lower) */}
        <path
          d="M92 0A92 30 0 0 1 -92 0"
          fill="none"
          stroke={ACCENT}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}
