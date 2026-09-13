import { useEffect, useRef } from 'react'

const rgb = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// Interactive dot field: dots swell and push away from the pointer,
// and clicks (plus a periodic pulse) send a shockwave across the grid.
export default function DotGrid({ gap = 30, base = '#1f2a44', active = '#22d3ee', radius = 150, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const c0 = rgb(base)
    const c1 = rgb(active)
    const pointer = { x: -9999, y: -9999 }
    let waves = []
    let dots = []
    let w = 0
    let h = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = []
      const offX = (w % gap) / 2 + gap / 2
      const offY = (h % gap) / 2 + gap / 2
      for (let y = offY; y < h; y += gap) for (let x = offX; x < w; x += gap) dots.push({ x, y })
    }

    const toLocal = (e) => {
      const r = canvas.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top, inside: e.clientY >= r.top && e.clientY <= r.bottom }
    }
    const onMove = (e) => {
      const p = toLocal(e)
      pointer.x = p.inside ? p.x : -9999
      pointer.y = p.inside ? p.y : -9999
    }
    const onDown = (e) => {
      const p = toLocal(e)
      if (p.inside) waves.push({ x: p.x, y: p.y, start: performance.now() })
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(canvas)

    let lastPulse = 0
    let raf
    const draw = (now) => {
      raf = requestAnimationFrame(draw)
      if (!visible) return
      if (!reduced && now - lastPulse > 3200) {
        lastPulse = now
        waves.push({ x: Math.random() * w, y: Math.random() * h, start: now })
      }
      waves = waves.filter((wv) => now - wv.start < 2200)
      ctx.clearRect(0, 0, w, h)

      for (const d of dots) {
        const dx = d.x - pointer.x
        const dy = d.y - pointer.y
        const dist = Math.hypot(dx, dy)
        let t = Math.max(0, 1 - dist / radius)
        let ox = dist > 0 ? (dx / dist) * t * 14 : 0
        let oy = dist > 0 ? (dy / dist) * t * 14 : 0

        for (const wv of waves) {
          const age = (now - wv.start) / 2200
          const ring = age * Math.max(w, h) * 0.9
          const wd = Math.hypot(d.x - wv.x, d.y - wv.y)
          const k = Math.max(0, 1 - Math.abs(wd - ring) / 40) * (1 - age)
          if (k > 0) {
            t = Math.max(t, k * 0.8)
            ox += ((d.x - wv.x) / (wd || 1)) * k * 6
            oy += ((d.y - wv.y) / (wd || 1)) * k * 6
          }
        }

        const r = Math.round(c0[0] + (c1[0] - c0[0]) * t)
        const g = Math.round(c0[1] + (c1[1] - c0[1]) * t)
        const b = Math.round(c0[2] + (c1[2] - c0[2]) * t)
        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.beginPath()
        ctx.arc(d.x + ox, d.y + oy, 1.3 + t * 2.6, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [gap, base, active, radius])

  return <canvas ref={ref} className={`dot-grid ${className}`} aria-hidden="true" />
}
