import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, CalendarCheck, CheckCircle2, FileText, MessageSquare, TrendingUp } from 'lucide-react'
import { priorities, requestTypes, roles, serviceById } from '../data/content.js'
import { postJSON } from '../lib/api.js'
import { Link } from '../lib/router.jsx'
import SplitText from '../components/bits/SplitText.jsx'
import DecryptedText from '../components/bits/DecryptedText.jsx'
import DotGrid from '../components/bits/DotGrid.jsx'
import SpotlightCard from '../components/bits/SpotlightCard.jsx'
import Reveal from '../components/bits/Reveal.jsx'

const typeIcons = { diagnostic: CalendarCheck, proposal: FileText, performance: TrendingUp, contact: MessageSquare }
const steps = ['Request', 'About you', 'Priorities']

export default function Contact({ params }) {
  const initialType = requestTypes.some((t) => t.id === params.get('type')) ? params.get('type') : 'diagnostic'
  const engagement = serviceById[params.get('engagement')]

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [status, setStatus] = useState('idle') // idle | sending | done
  const [serverError, setServerError] = useState('')
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    type: initialType,
    name: '',
    email: '',
    company: '',
    role: '',
    priorities: [],
    message: engagement ? `I'm interested in: ${engagement.title}.` : '',
  })

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const togglePriority = (p) =>
    set('priorities', form.priorities.includes(p) ? form.priorities.filter((x) => x !== p) : [...form.priorities, p])

  const validateStep = () => {
    const e = {}
    if (step === 1) {
      if (form.name.trim().length < 2) e.name = 'Please enter your name.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email.'
      if (!form.company.trim()) e.company = 'Please enter your organization.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const go = (delta) => {
    if (delta > 0 && !validateStep()) return
    setDirection(delta)
    setStep((s) => s + delta)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (step < steps.length - 1) return go(1)
    setStatus('sending')
    setServerError('')
    try {
      await postJSON('/api/contact', form)
      setStatus('done')
    } catch (err) {
      setServerError(err.message)
      setErrors(err.fields)
      setStatus('idle')
      if (err.fields?.name || err.fields?.email || err.fields?.company) setStep(1)
    }
  }

  const selectedType = requestTypes.find((t) => t.id === form.type)

  return (
    <section className="page-hero contact-page">
      <DotGrid />
      <div className="container contact-grid">
        <div className="contact-intro">
          <DecryptedText text="CONTACT" className="eyebrow" />
          <SplitText text="Let’s bring clarity to your digital strategy." className="page-title" stagger={0.02} highlight={{ clarity: 'grad-blue' }} />
          <Reveal as="p" className="lead" delay={0.6}>
            If your organization is moving from experimentation to structured digital growth, we should talk.
          </Reveal>
          <Reveal className="next-steps" delay={0.8}>
            <h4>What happens next</h4>
            <ol>
              <li><span>1</span> We review your request and priorities.</li>
              <li><span>2</span> We get back to you to schedule a conversation.</li>
              <li><span>3</span> You leave with clear next steps.</li>
            </ol>
          </Reveal>
        </div>

        <Reveal delay={0.3}>
          <SpotlightCard className="form-card">
            {status === 'done' ? (
              <motion.div className="form-success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <motion.span initial={{ scale: 0, rotate: -120 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}>
                  <CheckCircle2 size={72} />
                </motion.span>
                <h3>Thank you, {form.name.split(' ')[0]}.</h3>
                <p>Your “{selectedType.label}” request has been received. We’ll be in touch at {form.email}.</p>
                <Link to="/services" className="btn btn-ghost">
                  Explore our services <ArrowRight size={16} />
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="form" noValidate>
                <div className="stepper">
                  {steps.map((label, i) => (
                    <div key={label} className={`stepper-item ${i <= step ? 'is-done' : ''}`}>
                      <span className="stepper-dot">{i + 1}</span>
                      <span className="stepper-label">{label}</span>
                    </div>
                  ))}
                  <motion.div className="stepper-bar" animate={{ scaleX: step / (steps.length - 1) }} />
                </div>

                <div className="form-steps">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step}
                      custom={direction}
                      initial={{ opacity: 0, x: 50 * direction }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 * direction }}
                      transition={{ duration: 0.3 }}
                      className="form-step"
                    >
                      {step === 0 && (
                        <div className="type-grid" role="radiogroup" aria-label="Request type">
                          {requestTypes.map((t) => {
                            const Icon = typeIcons[t.id]
                            const on = form.type === t.id
                            return (
                              <motion.button
                                type="button"
                                key={t.id}
                                role="radio"
                                aria-checked={on}
                                className={`type-card ${on ? 'is-on' : ''}`}
                                onClick={() => set('type', t.id)}
                                whileTap={{ scale: 0.97 }}
                              >
                                <Icon size={22} />
                                <strong>{t.label}</strong>
                                <span>{t.hint}</span>
                              </motion.button>
                            )
                          })}
                        </div>
                      )}

                      {step === 1 && (
                        <div className="field-grid">
                          <Field label="Full name" error={errors.name}>
                            <input value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" />
                          </Field>
                          <Field label="Work email" error={errors.email}>
                            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" />
                          </Field>
                          <Field label="Organization" error={errors.company}>
                            <input value={form.company} onChange={(e) => set('company', e.target.value)} autoComplete="organization" />
                          </Field>
                          <Field label="Your role" error={errors.role}>
                            <select value={form.role} onChange={(e) => set('role', e.target.value)}>
                              <option value="">Select…</option>
                              {roles.map((r) => (
                                <option key={r}>{r}</option>
                              ))}
                            </select>
                          </Field>
                        </div>
                      )}

                      {step === 2 && (
                        <>
                          <p className="field-label">What matters most right now?</p>
                          <div className="chip-row">
                            {priorities.map((p) => (
                              <button type="button" key={p} className={`chip ${form.priorities.includes(p) ? 'is-on' : ''}`} onClick={() => togglePriority(p)} aria-pressed={form.priorities.includes(p)}>
                                {p}
                              </button>
                            ))}
                          </div>
                          <Field label="Anything we should know? (optional)" error={errors.message}>
                            <textarea rows={4} value={form.message} onChange={(e) => set('message', e.target.value)} maxLength={5000} data-lenis-prevent />
                          </Field>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {serverError && <p className="form-error">{serverError}</p>}

                <div className="form-actions">
                  {step > 0 ? (
                    <button type="button" className="btn btn-ghost" onClick={() => go(-1)}>
                      <ArrowLeft size={16} /> Back
                    </button>
                  ) : (
                    <span />
                  )}
                  <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                    {step < steps.length - 1 ? (
                      <>
                        Continue <ArrowRight size={16} />
                      </>
                    ) : status === 'sending' ? (
                      'Sending…'
                    ) : (
                      <>
                        Send request <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  )
}

function Field({ label, error, children }) {
  return (
    <label className={`field ${error ? 'has-error' : ''}`}>
      <span>{label}</span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.em initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {error}
          </motion.em>
        )}
      </AnimatePresence>
    </label>
  )
}
