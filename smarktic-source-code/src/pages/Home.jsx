import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowRight, BookOpen, Compass, FlaskConical, HeartHandshake, Sprout } from 'lucide-react'
import { Link } from '../lib/router.jsx'
import { scrollTo } from '../lib/scroll.js'
import Aurora from '../components/bits/Aurora.jsx'
import SplitText from '../components/bits/SplitText.jsx'
import DecryptedText from '../components/bits/DecryptedText.jsx'
import Magnet from '../components/bits/Magnet.jsx'
import Marquee from '../components/bits/Marquee.jsx'
import Reveal from '../components/bits/Reveal.jsx'
import ScrollRevealText from '../components/bits/ScrollRevealText.jsx'
import SpotlightCard from '../components/bits/SpotlightCard.jsx'
import { CountUp } from '../components/bits/CountUp.jsx'
import GapCheck from '../components/GapCheck.jsx'
import HelpVenn from '../components/HelpVenn.jsx'
import PersonaPicker from '../components/PersonaPicker.jsx'
import CtaSection from '../components/CtaSection.jsx'

const heroChips = [
  { label: 'Profitable', className: 'chip-a', depth: 30 },
  { label: 'Responsible', className: 'chip-b', depth: -40 },
  { label: 'Secure', className: 'chip-c', depth: 22 },
]

const approach = [
  { word: 'Strategy', text: 'Decision frameworks that align every digital initiative with business priorities.' },
  { word: 'Governance', text: 'Clear rules on data and technology use, so growth never outpaces responsibility.' },
  { word: 'People', text: 'Leadership posture and performance systems that make transformation truly work.' },
]

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="hero">
      <Aurora />
      <div className="hero-grid" aria-hidden="true" />
      <motion.div className="container hero-inner" style={{ y, opacity }}>
        <DecryptedText text="SMARKTIC · STRATEGIC DIGITAL ADVISORY" className="eyebrow" />
        <SplitText
          text="Building Digital Transformation That Is Profitable, Responsible, and Secure"
          className="hero-title"
          stagger={0.018}
          highlight={{ Profitable: 'grad-blue', Responsible: 'grad-green', Secure: 'grad-violet' }}
        />
        <motion.p className="hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.8 }}>
          We help organizations design the strategic, ethical, and performance foundations they need to grow in a complex digital world.
        </motion.p>
        <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8 }}>
          <Magnet>
            <Link to="/contact?type=diagnostic" className="btn btn-primary btn-lg">
              Book an Executive Diagnostic Call <ArrowRight size={18} />
            </Link>
          </Magnet>
          <Magnet>
            <Link to="/services" className="btn btn-ghost btn-lg">
              Explore Our Services
            </Link>
          </Magnet>
        </motion.div>
      </motion.div>

      {heroChips.map((c, i) => (
        <motion.span
          key={c.label}
          className={`hero-chip ${c.className}`}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1, y: [0, -c.depth / 3, 0] }}
          transition={{ opacity: { delay: 1.8 + i * 0.15 }, scale: { delay: 1.8 + i * 0.15 }, y: { repeat: Infinity, duration: 5 + i, ease: 'easeInOut' } }}
          aria-hidden="true"
        >
          {c.label}
        </motion.span>
      ))}

      <button className="scroll-hint" onClick={() => scrollTo('#problem')} aria-label="Scroll to next section">
        <ArrowDown size={18} />
      </button>
    </section>
  )
}

function Approach() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.6', 'end 0.6'] })
  const line = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="section" ref={ref}>
      <div className="container approach">
        <div className="approach-sticky">
          <span className="eyebrow">04 — Our Approach</span>
          <SplitText
            as="h2"
            by="words"
            stagger={0.05}
            className="section-title"
            text="Digital transformation succeeds when strategy, governance, and people evolve together."
            highlight={{ together: 'grad-blue' }}
          />
          <Reveal as="p" className="lead" delay={0.2}>
            We don’t implement tools. We help organizations design the decision frameworks, leadership posture, and performance systems that make digital transformation truly work.
          </Reveal>
        </div>
        <div className="approach-steps">
          <div className="approach-line">
            <motion.div className="approach-line-fill" style={{ height: line }} />
          </div>
          {approach.map((step, i) => (
            <Reveal key={step.word} className="approach-step" delay={i * 0.05}>
              <span className="approach-index">0{i + 1}</span>
              <h3>{step.word}</h3>
              <p>{step.text}</p>
            </Reveal>
          ))}
          <Reveal className="belief-card">
            <Sprout size={28} />
            <p>
              We believe technology should serve <strong>people first</strong> — creating not only economic value, but also well-being, inclusiveness, and meaningful impact for individuals and society.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />

      <Marquee items={['Digital Strategy', 'Governance', 'Responsibility', 'Performance', 'Leadership', 'Measurable Growth', 'Human-Centered Innovation']} />

      <section className="section" id="problem">
        <div className="container">
          <span className="eyebrow">01 — The Problem Leaders Face</span>
          <ScrollRevealText
            className="statement"
            text="Digital transformation is no longer about tools. It’s about decisions, responsibility, and long-term impact."
            accentWords={['decisions', 'responsibility', 'long-term', 'impact']}
          />
          <GapCheck />
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">02 — How We Help</span>
            <SplitText
              as="h2"
              by="words"
              stagger={0.05}
              className="section-title"
              text="The strategic infrastructure behind digital transformation."
              highlight={{ infrastructure: 'grad-blue' }}
            />
            <Reveal as="p" className="lead" delay={0.2}>
              We work with leadership teams to ensure that growth is not only fast, but sustainable, ethical, and measurable. Hover the circles to explore.
            </Reveal>
          </div>
          <Reveal>
            <HelpVenn />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">03 — Who We Work With</span>
            <SplitText as="h2" by="words" stagger={0.05} className="section-title" text="We partner with the leaders who carry transformation." highlight={{ leaders: 'grad-violet' }} />
          </div>
          <PersonaPicker />
          <Reveal className="talk-banner">
            <p>
              If your organization is moving from <em>experimentation</em> to <strong>structured digital growth</strong>, we should talk.
            </p>
            <Link to="/contact" className="btn btn-ghost">
              Let’s talk <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <Approach />

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">05 — Credibility</span>
            <SplitText as="h2" by="words" stagger={0.05} className="section-title" text="Practical and long-term perspectives, combined." />
          </div>
          <div className="stats">
            <Reveal className="stat">
              <span className="stat-num"><CountUp to={3} /></span>
              <span>strategic engagements</span>
            </Reveal>
            <Reveal className="stat" delay={0.1}>
              <span className="stat-num"><CountUp to={12} />–<CountUp to={18} /></span>
              <span>month strategic priority roadmaps</span>
            </Reveal>
            <Reveal className="stat" delay={0.2}>
              <span className="stat-num"><CountUp to={3} /></span>
              <span>disciplines at one intersection</span>
            </Reveal>
          </div>
          <div className="cred-grid">
            {[
              { icon: Compass, title: 'Strategic advisory', text: 'Guiding leadership teams through high-stakes digital decisions.' },
              { icon: BookOpen, title: 'Executive education', text: 'Building the capabilities leaders need to carry the strategy forward.' },
              { icon: FlaskConical, title: 'Research-driven insight', text: 'Grounding recommendations in evidence and long-term thinking.' },
            ].map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.1}>
                <SpotlightCard className="cred-card">
                  <Icon size={24} />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </SpotlightCard>
              </Reveal>
            ))}
            <Reveal delay={0.3} className="cred-wide">
              <SpotlightCard className="cred-card cred-advocacy" color="rgba(52, 211, 153, 0.22)">
                <HeartHandshake size={24} />
                <h3>Advocates for responsible technology</h3>
                <p>
                  We are committed advocates for responsible technology and children’s digital well-being, ensuring that innovation remains human-centered and future-conscious.
                </p>
              </SpotlightCard>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaSection
        eyebrow="Final step"
        title="Ready to bring clarity, responsibility, and measurable performance to your digital strategy?"
        highlight={{ clarity: 'grad-blue', responsibility: 'grad-green', performance: 'grad-violet' }}
        actions={[
          { label: 'Book an Executive Diagnostic Call', to: '/contact?type=diagnostic' },
          { label: 'Contact Us', to: '/contact', variant: 'ghost' },
        ]}
      />
    </>
  )
}
