import { ArrowRight, Cpu, Crown, Users } from 'lucide-react'
import { Link } from '../lib/router.jsx'
import { serviceById } from '../data/content.js'
import SpotlightCard from './bits/SpotlightCard.jsx'
import TiltCard from './bits/TiltCard.jsx'
import Reveal from './bits/Reveal.jsx'

const personas = [
  {
    icon: Crown,
    who: 'CEOs and General Managers',
    need: 'seeking clarity and control over digital investments',
    service: 'audit',
    color: 'rgba(59, 130, 246, 0.28)',
  },
  {
    icon: Cpu,
    who: 'Transformation, Innovation & Technology Leaders',
    need: 'building scalable systems',
    service: 'roadmap',
    color: 'rgba(34, 211, 238, 0.24)',
  },
  {
    icon: Users,
    who: 'HR and Learning Leaders',
    need: 'supporting culture and capability shifts',
    service: 'leadership',
    color: 'rgba(139, 92, 246, 0.28)',
  },
]

export default function PersonaPicker() {
  return (
    <div className="persona-grid">
      {personas.map((p, i) => {
        const Icon = p.icon
        const service = serviceById[p.service]
        return (
          <Reveal key={p.who} delay={i * 0.12}>
            <TiltCard className="persona-tilt">
              <SpotlightCard className="persona-card" color={p.color}>
                <span className="persona-icon" style={{ color: service.accent }}>
                  <Icon size={26} />
                </span>
                <h3>{p.who}</h3>
                <p>{p.need}</p>
                <div className="persona-fit">
                  <span>Relevant engagement</span>
                  <Link to={`/services?engagement=${service.id}`} className="persona-link">
                    {service.title} <ArrowRight size={16} />
                  </Link>
                </div>
              </SpotlightCard>
            </TiltCard>
          </Reveal>
        )
      })}
    </div>
  )
}
