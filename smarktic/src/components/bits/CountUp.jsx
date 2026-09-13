import { useEffect, useRef } from 'react'
import { animate, useInView } from 'motion/react'

const format = (v, decimals) => v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

// Counts from `from` to `to` once the number scrolls into view.
export function CountUp({ to, from = 0, duration = 2, decimals = 0, prefix = '', suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })

  useEffect(() => {
    if (!inView) return
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${prefix}${format(v, decimals)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, from, to, duration, decimals, prefix, suffix])

  return (
    <span ref={ref}>
      {prefix}
      {format(from, decimals)}
      {suffix}
    </span>
  )
}

// Tweens from the previously shown value to the new one on every change.
export function AnimatedNumber({ value, format: fmt = (v) => Math.round(v).toString(), duration = 0.6 }) {
  const ref = useRef(null)
  const previous = useRef(value)

  useEffect(() => {
    const controls = animate(previous.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        previous.current = v
        if (ref.current) ref.current.textContent = fmt(v)
      },
    })
    return () => controls.stop()
  }, [value, fmt, duration])

  return <span ref={ref}>{fmt(value)}</span>
}
