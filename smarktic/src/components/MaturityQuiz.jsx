import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { assessmentAreas, scaleLabels, serviceById } from '../data/content.js'
import { scoreAssessment } from '../lib/assessment.js'
import { Link } from '../lib/router.jsx'
import { AnimatedNumber } from './bits/CountUp.jsx'

const SIZE = 300
const C = SIZE / 2
const R = 110

const point = (i, value) => {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / assessmentAreas.length
  const dist = (value / 5) * R
  return [C + dist * Math.cos(angle), C + dist * Math.sin(angle)]
}

const polygon = (values) => values.map((v, i) => point(i, v).map((n) => n.toFixed(1)).join(',')).join(' L ')

function Radar({ values, step }) {
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="radar" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((ring) => (
        <path key={ring} d={`M ${polygon(Array(5).fill(ring))} Z`} className="radar-ring" />
      ))}
      {assessmentAreas.map((a, i) => {
        const [x, y] = point(i, 5)
        const [lx, ly] = point(i, 6.3)
        return (
          <g key={a.id}>
            <line x1={C} y1={C} x2={x} y2={y} className="radar-axis" />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className={`radar-label ${step === i ? 'is-active' : ''}`}>
              {a.label}
            </text>
          </g>
        )
      })}
      <motion.path
        className="radar-shape"
        initial={false}
        animate={{ d: `M ${polygon(values)} Z` }}
        transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      />
      {values.map((v, i) => {
        const [x, y] = point(i, v)
        return <motion.circle key={i} r="4" className="radar-point" initial={false} animate={{ cx: x, cy: y }} />
      })}
    </svg>
  )
}

export default function MaturityQuiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const area = assessmentAreas[step]
  const values = assessmentAreas.map((a) => answers[a.id] ?? 0.4)
  const done = assessmentAreas.every((a) => answers[a.id])

  const answer = (value) => {
    const next = { ...answers, [area.id]: value }
    setAnswers(next)
    if (step < assessmentAreas.length - 1) setTimeout(() => setStep((s) => s + 1), 280)
    else finish(next)
  }

  const finish = async (final) => {
    setLoading(true)
    const res = await scoreAssessment(final)
    setResult(res)
    setLoading(false)
  }

  const restart = () => {
    setAnswers({})
    setResult(null)
    setStep(0)
  }

  // Keys 1–5 answer the current question.
  useEffect(() => {
    if (result) return
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return
      const n = Number(e.key)
      if (n >= 1 && n <= 5 && e.target.closest?.('.quiz')) answer(n)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const service = result && serviceById[result.recommendation]

  return (
    <div className="quiz" tabIndex={-1}>
      <div className="quiz-visual">
        <Radar values={values} step={result ? -1 : step} />
        {result && (
          <div className="quiz-score">
            <span className="quiz-score-num">
              <AnimatedNumber value={result.score} />
            </span>
            <span className="quiz-score-label">/ 100</span>
          </div>
        )}
      </div>

      <div className="quiz-panel">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <div className="quiz-progress">
                {assessmentAreas.map((a, i) => (
                  <span key={a.id} className={`quiz-progress-bar ${i < step || answers[a.id] ? 'is-done' : ''} ${i === step ? 'is-current' : ''}`} />
                ))}
              </div>
              <span className="eyebrow">
                Question {step + 1} of {assessmentAreas.length} · {area.label}
              </span>
              <h3 className="quiz-question">{area.question}</h3>
              <div className="quiz-scale" role="radiogroup" aria-label={area.question}>
                {scaleLabels.map((label, i) => {
                  const value = i + 1
                  const selected = answers[area.id] === value
                  return (
                    <motion.button
                      key={label}
                      role="radio"
                      aria-checked={selected}
                      className={`quiz-option ${selected ? 'is-selected' : ''}`}
                      onClick={() => answer(value)}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.94 }}
                      disabled={loading}
                    >
                      <span className="quiz-option-num">{value}</span>
                      <span>{label}</span>
                    </motion.button>
                  )
                })}
              </div>
              <div className="quiz-nav">
                <button className="link-button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                  <ArrowLeft size={16} /> Back
                </button>
                <span className="quiz-hint">Tip: press 1–5</span>
                {done && (
                  <button className="link-button" onClick={() => finish(answers)}>
                    See results <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="eyebrow">Your indicative maturity level</span>
              <h3 className="quiz-level">{result.level}</h3>
              <p className="quiz-focus">
                Focus area{result.focus.length > 1 ? 's' : ''}:{' '}
                <strong>{result.focus.map((id) => assessmentAreas.find((a) => a.id === id).label).join(', ')}</strong>
              </p>
              <div className="quiz-reco" style={{ '--accent': service.accent }}>
                <span>Suggested starting point</span>
                <strong>
                  {service.number} · {service.title}
                </strong>
                <p>{service.tagline}</p>
              </div>
              <p className="quiz-disclaimer">
                This self-check is indicative. The full Executive Digital Maturity Scorecard comes from our audit.
              </p>
              <div className="quiz-actions">
                <Link to="/contact?type=diagnostic" className="btn btn-primary">
                  Book an Executive Diagnostic Call <ArrowRight size={16} />
                </Link>
                <button className="btn btn-ghost" onClick={restart}>
                  <RotateCcw size={16} /> Retake
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
