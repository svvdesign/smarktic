import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

const INTERACTIVE = 'a, button, input, select, textarea, label, [data-cursor]'

// Soft ring that trails the native cursor and grows over interactive elements.
export default function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })
  const [hover, setHover] = useState(false)
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches)

  useEffect(() => {
    if (!enabled) return
    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setHover(Boolean(e.target.closest?.(INTERACTIVE)))
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled, x, y])

  if (!enabled) return null
  return (
    <motion.div
      className={`cursor-ring ${hover ? 'is-hover' : ''}`}
      style={{ x: sx, y: sy }}
      aria-hidden="true"
    />
  )
}
