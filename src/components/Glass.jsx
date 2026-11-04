// Reusable "vellum lens" liquid-glass surface.
// variant: 'light' | 'dark' | 'accent'   refract: adds rim refraction (Chromium)
export default function Glass({
  as: Tag = 'div',
  variant = 'light',
  refract = false,
  className = '',
  children,
  ...rest
}) {
  const v = variant === 'dark' ? 'lg--dark' : variant === 'accent' ? 'lg--accent' : ''
  const cls = ['lg', v, refract ? 'lg--refract' : '', className].filter(Boolean).join(' ')
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  )
}

// Rendered once (in App) — the SVG displacement filter the glass rim samples.
export function GlassDefs() {
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
    >
      <defs>
        <filter
          id="lg-refract"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.011 0.016"
            numOctaves="2"
            seed="11"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="1.1" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="68"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  )
}
