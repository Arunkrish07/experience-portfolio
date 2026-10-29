import Mark from './components/Mark'

// Wrap the first occurrence of each phrase in `marks` with an animated Mark.
// marks: [{ p: 'phrase', t: 'underline' | 'circle' }]
export function highlight(raw, marks = []) {
  const text = String(raw).replace(/\s+/g, ' ').trim()
  let nodes = [text]
  marks.forEach(({ p, t }, mi) => {
    const next = []
    nodes.forEach((node) => {
      if (typeof node !== 'string') return next.push(node)
      const idx = node.indexOf(p)
      if (idx === -1) return next.push(node)
      next.push(node.slice(0, idx))
      next.push(
        <Mark key={`m${mi}`} type={t} delay={0.15}>
          {p}
        </Mark>
      )
      next.push(node.slice(idx + p.length))
    })
    nodes = next
  })
  return nodes.map((n, i) => (typeof n === 'string' ? <span key={i}>{n}</span> : n))
}
