// A reusable iPhone-style mockup. Screens are data-driven from a project.
// When a project has no `cover` image yet, a gradient of its two accent
// colours is shown as a placeholder (swap in real screenshots later).

export default function Phone({ children, className = '', w = 220 }) {
  // bezel + corners scale with the phone size → thin, realistic frame at any width
  const pad = Math.max(2, Math.round(w * 0.022))
  const outer = Math.round(w * 0.155)
  const inner = Math.max(6, outer - pad)
  const island = { w: Math.round(w * 0.32), h: Math.max(10, Math.round(w * 0.078)) }

  return (
    <div
      className={`relative bg-[#0d0d0f] shadow-[0_26px_55px_-22px_rgba(0,0,0,0.6)] ring-1 ring-black/50 ${className}`}
      style={{ width: w, aspectRatio: '9 / 19.5', padding: pad, borderRadius: outer }}
    >
      {/* side buttons */}
      <span className="absolute -left-[1.5px] top-[22%] h-[7%] w-[2px] rounded-l bg-[#26262a]" />
      <span className="absolute -left-[1.5px] top-[33%] h-[11%] w-[2px] rounded-l bg-[#26262a]" />
      <span className="absolute -right-[1.5px] top-[28%] h-[13%] w-[2px] rounded-r bg-[#26262a]" />
      <div className="relative h-full w-full overflow-hidden bg-dark" style={{ borderRadius: inner }}>
        {/* dynamic island */}
        <div
          className="pointer-events-none absolute left-1/2 top-[6px] z-20 -translate-x-1/2 rounded-full bg-black"
          style={{ width: island.w, height: island.h }}
        />
        {children}
      </div>
    </div>
  )
}

export function StatusBar({ light = true }) {
  const c = light ? 'text-white' : 'text-ink'
  return (
    <div className={`flex items-center justify-between px-5 pt-3 text-[10px] font-medium ${c}`}>
      <span>9:41</span>
      <span className="flex items-center gap-1 opacity-90">
        <span className="h-2 w-4 rounded-[2px] border border-current" />
      </span>
    </div>
  )
}

function Bg({ project }) {
  if (project.cover) {
    return <img src={project.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
  }
  return (
    <div
      className="absolute inset-0"
      style={{ background: `linear-gradient(150deg, ${project.accent}, ${project.accent2})` }}
    />
  )
}

// Cover-style screen: full-bleed background, name, tagline, platform chip.
export function CoverScreen({ project }) {
  return (
    <div className="relative h-full w-full">
      <Bg project={project} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/25" />
      <div className="relative flex h-full flex-col">
        <StatusBar />
        <div className="mt-auto px-5 pb-7 text-white">
          <h4 className="serif text-2xl leading-none">{project.name}</h4>
          <p className="mt-2 text-[11px] leading-snug text-white/80">{project.tagline}</p>
          <div
            className="mt-4 w-full rounded-full py-2.5 text-center text-[11px] font-semibold text-white ring-1 ring-white/40"
          >
            {project.comingSoon ? 'Coming soon' : 'View project'}
          </div>
        </div>
      </div>
    </div>
  )
}

// "Build" screen: light panel listing the stack.
export function HomeScreen({ project }) {
  return (
    <div className="flex h-full w-full flex-col bg-paper text-ink">
      <StatusBar light={false} />
      <div className="px-4 pt-3">
        <p className="text-[9px] uppercase tracking-wide text-muted">{project.category}</p>
        <h4 className="serif text-lg leading-tight">{project.name}</h4>
      </div>
      <div className="relative mt-2 flex-1 overflow-hidden">
        <Bg project={project} />
        <div className="absolute inset-0 bg-black/10" />
      </div>
      <div className="flex flex-wrap gap-1.5 px-4 py-3">
        {(project.stack.length ? project.stack : ['—']).map((s) => (
          <span key={s} className="rounded-full bg-black/5 px-2 py-0.5 text-[8px] font-medium">
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

// Detail screen: name, category, stack — no invented ratings.
export function DetailScreen({ project }) {
  return (
    <div className="flex h-full w-full flex-col bg-dark text-white">
      <StatusBar />
      <div className="flex items-center justify-between px-4 pt-3 text-xs">
        <span>‹</span>
        <span>↗</span>
      </div>
      <div className="relative mx-4 mt-3 flex-1 overflow-hidden rounded-2xl">
        <Bg project={project} />
      </div>
      <div className="px-4 py-4">
        <h4 className="serif text-lg leading-tight">{project.name}</h4>
        <p className="text-[10px] text-white/60">{project.category}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(project.stack.length ? project.stack : ['stack soon']).map((s) => (
            <span key={s} className="rounded-full px-2 py-0.5 text-[8px] font-medium" style={{ backgroundColor: project.accent }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
