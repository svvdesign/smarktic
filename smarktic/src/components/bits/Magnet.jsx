import { useEffect, useRef } from 'react'
import { motion, useSpring } from 'motion/react'

const spring = { stiffness: 260, damping: 18, mass: 0.6 }

// Pulls its child toward the pointer when the pointer is nearby.
export default function Magnet({ children, strength = 0.3, padding = 50, className = '' }) {
  const ref = useRef(null)
  const x = useSpring(0, spring)
  const y = useSpring(0, spring)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const onMove = (e) => {
      const r = ref.current.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const near = Math.abs(dx) < r.width / 2 + padding && Math.abs(dy) < r.height / 2 + padding
      x.set(near ? dx * strength : 0)
      y.set(near ? dy * strength : 0)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [x, y, strength, padding])

  // Measure the static wrapper so the translated child does not skew the math.
  return (
    <span ref={ref} className={`magnet ${className}`}>
      <motion.span className="magnet-inner" style={{ x, y }}>
        {children}
      </motion.span>
    </span>
  )
}
