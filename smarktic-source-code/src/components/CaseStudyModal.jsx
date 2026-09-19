import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, X } from 'lucide-react'
import { postJSON } from '../lib/api.js'

// Collects an email so the ROI case study can be sent to the visitor.
export default function CaseStudyModal({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [state, setState] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const t = setTimeout(() => inputRef.current?.focus(), 250)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(t)
    }
  }, [open, onClose])

  const submit = async (e) => {
    e.preventDefault()
    setState('sending')
    try {
      await postJSON('/api/case-study', { email, company })
      setState('done')
    } catch (err) {
      setError(err.message)
      setState('error')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} data-lenis-prevent>
          <motion.div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={onClose} aria-label="Fermer">
              <X size={20} />
            </button>
            {state === 'done' ? (
              <div className="modal-success">
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}>
                  <CheckCircle2 size={56} />
                </motion.span>
                <h3>Merci !</h3>
                <p>Votre demande est enregistrée. Nous vous enverrons l'étude de cas à {email}.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="form">
                <span className="eyebrow">Étude de cas</span>
                <h3 id="case-study-title">L'optimisation du ROI</h3>
                <p className="modal-text">Indiquez votre email professionnel pour recevoir notre étude de cas.</p>
                <label className="field">
                  <span>Email professionnel</span>
                  <input ref={inputRef} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@entreprise.com" />
                </label>
                <label className="field">
                  <span>Entreprise (optionnel)</span>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} />
                </label>
                {state === 'error' && <p className="form-error">{error}</p>}
                <button className="btn btn-primary" disabled={state === 'sending'}>
                  {state === 'sending' ? 'Envoi…' : "Recevoir l'étude de cas"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
