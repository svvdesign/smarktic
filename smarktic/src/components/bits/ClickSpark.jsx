import { useEffect, useRef } from 'react'

// Full-screen overlay that draws a burst of sparks on every click.
export default function ClickSpark({ color = '#67e8f9', count = 10, radius = 30, duration = 480 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let sparks = []
    let raf = null

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (now) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      sparks = sparks.filter((s) => {
        const p = (now - s.start) / duration
        if (p >= 1) return false
        const eased = p * (2 - p)
        const dist = eased * radius
        const len = 12 * (1 - eased)
        const cos = Math.cos(s.angle)
        const sin = Math.sin(s.angle)
        ctx.globalAlpha = 1 - p
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(s.x + dist * cos, s.y + dist * sin)
        ctx.lineTo(s.x + (dist + len) * cos, s.y + (dist + len) * sin)
        ctx.stroke()
        return true
      })
      ctx.globalAlpha = 1
      raf = sparks.length ? requestAnimationFrame(draw) : null
    }

    const onDown = (e) => {
      const start = performance.now()
      for (let i = 0; i < count; i++) {
        sparks.push({ x: e.clientX, y: e.clientY, angle: (Math.PI * 2 * i) / count, start })
      }
      if (!raf) raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', onDown)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [color, count, radius, duration])

  return <canvas ref={ref} className="click-spark" aria-hidden="true" />
}
