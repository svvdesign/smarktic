import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const pillars = [
  {
    id: 'strategy',
    title: 'Digital Strategy',
    text: 'Aligning technology and digital initiatives with business priorities.',
    color: '#3b82f6',
    cx: 150,
    cy: 140,
  },
  {
    id: 'governance',
    title: 'Governance & Responsibility',
    text: 'Designing frameworks that protect data, ensure fairness, and reduce risk.',
    color: '#34d399',
    cx: 250,
    cy: 140,
  },
  {
    id: 'growth',
    title: 'Digital Growth & Performance',
    text: 'Turning digital investments into measurable revenue and efficiency gains.',
    color: '#8b5cf6',
    cx: 200,
    cy: 225,
  },
]

const center = {
  title: 'Where Smarktic works',
  text: 'Our work sits at the intersection of all three — so that growth is not only fast, but sustainable, ethical, and measurable.',
}

export default function HelpVenn() {
  const [active, setActive] = useState(null)
  const current = pillars.find((p) => p.id === active) ?? center

  return (
    <div className="venn">
      <svg viewBox="0 0 400 360" className="venn-svg" role="group" aria-label="Three areas of expertise">
        <defs>
          <filter id="venn-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        {pillars.map((p) => {
          const isActive = active === p.id
          const dimmed = active && !isActive
          return (
            <g
              key={p.id}
              tabIndex={0}
              role="button"
              aria-label={p.title}
              onMouseEnter={() => setActive(p.id)}
              onFocus={() => setActive(p.id)}
              onMouseLeave={() => setActive(null)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(isActive ? null : p.id)}
              className="venn-circle"
            >
              {/* Scale instead of animating `r`, which motion can briefly set to undefined. */}
              <motion.circle
                cx={p.cx}
                cy={p.cy}
                r={88}
                fill={p.color}
                filter="url(#venn-glow)"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={{ scale: 1, opacity: 0.12 }}
                animate={{ scale: isActive ? 1.14 : 1, opacity: isActive ? 0.35 : 0.12 }}
              />
              <motion.circle
                cx={p.cx}
                cy={p.cy}
                r={88}
                fill={p.color}
                fillOpacity={0.14}
                stroke={p.color}
                strokeWidth="1.5"
                strokeOpacity={0.9}
                style={{ mixBlendMode: 'screen', transformBox: 'fill-box', transformOrigin: 'center' }}
                animate={{ scale: isActive ? 1.14 : 1, fillOpacity: isActive ? 0.28 : dimmed ? 0.05 : 0.14, strokeOpacity: dimmed ? 0.25 : 0.9 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              />
            </g>
          )
        })}
        <motion.circle
          cx="200"
          cy="170"
          r="7"
          fill="#fff"
          animate={{ scale: [1, 1.6, 1], opacity: [1, 0.6, 1] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          style={{ pointerEvents: 'none', transformOrigin: '200px 170px' }}
        />
        <text x="95" y="120" className="venn-label">Strategy</text>
        <text x="245" y="120" className="venn-label">Governance</text>
        <text x="200" y="275" textAnchor="middle" className="venn-label">Growth</text>
      </svg>

      <div className="venn-detail">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.title}
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
            transition={{ duration: 0.35 }}
          >
            <span className="venn-dot" style={{ background: current.color ?? '#fff' }} />
            <h3>{current.title}</h3>
            <p>{current.text}</p>
          </motion.div>
        </AnimatePresence>
        <div className="venn-tabs">
          {pillars.map((p) => (
            <button
              key={p.id}
              className={`chip ${active === p.id ? 'is-on' : ''}`}
              style={{ '--chip': p.color }}
              onMouseEnter={() => setActive(p.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(p.id)}
              onBlur={() => setActive(null)}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
