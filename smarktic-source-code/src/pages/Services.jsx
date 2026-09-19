import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, Check, CheckCircle2 } from 'lucide-react'
import { services } from '../data/content.js'
import { Link } from '../lib/router.jsx'
import { scrollTo } from '../lib/scroll.js'
import SplitText from '../components/bits/SplitText.jsx'
import DecryptedText from '../components/bits/DecryptedText.jsx'
import DotGrid from '../components/bits/DotGrid.jsx'
import Reveal from '../components/bits/Reveal.jsx'
import SpotlightCard from '../components/bits/SpotlightCard.jsx'
import MaturityQuiz from '../components/MaturityQuiz.jsx'
import CtaSection from '../components/CtaSection.jsx'

function Engagements({ initial }) {
  const [activeId, setActiveId] = useState(initial ?? services[0].id)
  const active = services.find((s) => s.id === activeId)

  useEffect(() => {
    if (initial) {
      setActiveId(initial)
      setTimeout(() => scrollTo('#engagements'), 500)
    }
  }, [initial])

  return (
    <div className="engagements" id="engagements" style={{ '--accent': active.accent }}>
      <div className="eng-tabs" role="tablist" aria-label="Engagements">
        {services.map((s) => {
          const on = s.id === activeId
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={on}
              className={`eng-tab ${on ? 'is-active' : ''}`}
              onClick={() => setActiveId(s.id)}
              style={{ '--tab': s.accent }}
            >
              {on && <motion.span layoutId="eng-indicator" className="eng-indicator" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />}
              <span className="eng-num">{s.number}</span>
              <span className="eng-title">{s.title}</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          role="tabpanel"
          className="eng-panel"
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eng-bignum" aria-hidden="true">{active.number}</span>
          <h3 className="eng-heading">{active.title}</h3>
          <p className="eng-tagline">{active.tagline}</p>
          <p className="eng-desc">{active.description}</p>

          <div className="eng-columns">
            <div>
              <h4>{active.listLabel}:</h4>
              <ul className="eng-list">
                {active.items.map((item, i) => (
                  <motion.li key={item} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.07 }}>
                    <Check size={16} /> {item}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div>
              <h4>{active.deliverablesLabel}:</h4>
              <div className="deliverables">
                {active.deliverables.map((d, i) => (
                  <motion.div key={d} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 + i * 0.08 }}>
                    <SpotlightCard className="deliverable" color={`${active.accent}40`}>
                      <CheckCircle2 size={20} />
                      <span>{d}</span>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <p className="eng-closing">{active.closing}</p>
          <Link to={`/contact?type=proposal&engagement=${active.id}`} className="btn btn-primary">
            Request a Proposal for this engagement <ArrowRight size={16} />
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Journey() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-66.666%'])
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section ref={ref} className="journey">
      <div className="journey-sticky">
        <div className="container journey-head">
          <span className="eyebrow">From fragmented to structured</span>
          <div className="journey-progress">
            <motion.div style={{ width: progress }} />
          </div>
        </div>
        <motion.div className="journey-track" style={{ x }}>
          {services.map((s) => (
            <div key={s.id} className="journey-panel" style={{ '--accent': s.accent }}>
              <span className="journey-num">{s.number}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.closing}</p>
                <Link to={`/services?engagement=${s.id}`} className="link-arrow">
                  See details <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default function Services({ params }) {
  const engagement = params.get('engagement')

  return (
    <>
      <section className="page-hero">
        <DotGrid />
        <div className="container page-hero-inner">
          <DecryptedText text="SERVICES" className="eyebrow" />
          <SplitText
            text="Three strategic engagements. One structured transformation."
            className="page-title"
            stagger={0.02}
            highlight={{ structured: 'grad-blue' }}
          />
          <Reveal as="p" className="lead" delay={0.8}>
            We offer three strategic engagements designed to help organizations move from fragmented digital initiatives to structured, responsible, and performance-driven transformation.
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Engagements initial={services.some((s) => s.id === engagement) ? engagement : null} />
        </div>
      </section>

      <Journey />

      <section className="section section-alt" id="self-check">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Not sure where to start?</span>
            <SplitText as="h2" by="words" stagger={0.05} className="section-title" text="Take the 60-second Digital Maturity Self-Check." highlight={{ 'Self-Check': 'grad-blue' }} />
            <Reveal as="p" className="lead" delay={0.2}>
              Five questions, drawn from our audit framework. Watch your maturity profile take shape in real time.
            </Reveal>
          </div>
          <Reveal>
            <MaturityQuiz />
          </Reveal>
        </div>
      </section>

      <CtaSection
        eyebrow="Closing"
        title="Digital transformation is not a project. It is a structural shift in how organizations think, decide, and perform."
        highlight={{ structural: 'grad-blue', shift: 'grad-blue' }}
        text="If you're ready to move beyond tools and into true strategic transformation:"
        actions={[
          { label: 'Book an Executive Diagnostic Call', to: '/contact?type=diagnostic' },
          { label: 'Request a Proposal', to: '/contact?type=proposal', variant: 'ghost' },
        ]}
      />
    </>
  )
}
