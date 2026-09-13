import { ArrowRight } from 'lucide-react'
import { Link } from '../lib/router.jsx'
import Aurora from './bits/Aurora.jsx'
import Magnet from './bits/Magnet.jsx'
import SplitText from './bits/SplitText.jsx'
import Reveal from './bits/Reveal.jsx'

// Closing call-to-action shared by every page.
// `actions` = [{ label, to, variant: 'primary' | 'ghost' }]
export default function CtaSection({ eyebrow, title, text, actions, highlight = {}, children }) {
  return (
    <section className="cta-section">
      <Aurora colors={['#1e40af', '#06b6d4', '#7c3aed']} className="cta-aurora" />
      <div className="container cta-inner">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <SplitText as="h2" text={title} className="cta-title" by="words" stagger={0.06} highlight={highlight} />
        {text && (
          <Reveal as="p" className="cta-text" delay={0.2}>
            {text}
          </Reveal>
        )}
        <Reveal className="cta-actions" delay={0.35}>
          {actions.map((a) => (
            <Magnet key={a.label}>
              <Link to={a.to} className={`btn ${a.variant === 'ghost' ? 'btn-ghost' : 'btn-primary'} btn-lg`}>
                {a.label} <ArrowRight size={18} />
              </Link>
            </Magnet>
          ))}
        </Reveal>
        {children}
      </div>
    </section>
  )
}
