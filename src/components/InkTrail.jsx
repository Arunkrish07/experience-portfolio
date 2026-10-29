import { useEffect, useRef } from 'react'

// A canvas that lets the visitor "write" over the hero by moving the cursor.
// Strokes are drawn where the pointer moves and slowly fade away.
export default function InkTrail({ color = '#2B2B2E', width = 3 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    const ctx = canvas.getContext('2d')
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let last = null
    let raf

    const resize = () => {
      const r = parent.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = r.width * dpr
      canvas.height = r.height * dpr
      canvas.style.width = r.width + 'px'
      canvas.style.height = r.height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
    resize()

    const point = (e) => {
      const r = canvas.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    const move = (e) => {
      const p = point(e)
      if (last) {
        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.beginPath()
        ctx.moveTo(last.x, last.y)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
      }
      last = p
    }
    const leave = () => { last = null }

    // fade loop — gently wipe the canvas so strokes dissolve
    const fade = () => {
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,0.045)'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(fade)
    }
    raf = requestAnimationFrame(fade)

    parent.addEventListener('pointermove', move)
    parent.addEventListener('pointerleave', leave)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      parent.removeEventListener('pointermove', move)
      parent.removeEventListener('pointerleave', leave)
      window.removeEventListener('resize', resize)
    }
  }, [color, width])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-10" />
}
