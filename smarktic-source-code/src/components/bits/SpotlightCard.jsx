import { useRef } from 'react'

// Card with a radial light that follows the pointer.
export default function SpotlightCard({ children, className = '', color = 'rgba(59, 130, 246, 0.22)', as: Tag = 'div', ...rest }) {
  const ref = useRef(null)

  const onPointerMove = (e) => {
    const el = ref.current
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <Tag ref={ref} className={`spotlight-card ${className}`} style={{ '--spot': color }} onPointerMove={onPointerMove} {...rest}>
      {children}
    </Tag>
  )
}
