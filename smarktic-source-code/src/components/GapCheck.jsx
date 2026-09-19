import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Compass, Gauge, Scale, ShieldAlert } from 'lucide-react'

const gaps = [
  { id: 'governance', icon: Scale, label: 'Clear governance on data and technology use' },
  { id: 'alignment', icon: Compass, label: 'Leadership alignment on digital priorities' },
  { id: 'return', icon: Gauge, label: 'Systems to measure real business return' },
  { id: 'risk', icon: ShieldAlert, label: 'Safeguards against ethical and reputational risks' },
]

const outcomes = ['Fragmented efforts', 'Rising costs', 'Growing uncertainty']

// "Which of these are missing in your organization?" — the meter shows the result.
export default function GapCheck() {
  const [missing, setMissing] = useState(new Set())
  const toggle = (id) =>
    setMissing((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const level = missing.size / gaps.length

  return (
    <div className="gapcheck">
      <div className="gapcheck-list">
        <p className="gapcheck-prompt">
          Many organizations invest in digital initiatives <strong>without</strong>… <span>Tap what sounds familiar.</span>
        </p>
        {gaps.map(({ id, icon: Icon, label }, i) => {
          const on = missing.has(id)
          return (
            <motion.button
              key={id}
              className={`gap-item ${on ? 'is-on' : ''}`}
              onClick={() => toggle(id)}
              aria-pressed={on}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <span className="gap-icon">
                <Icon size={20} />
              </span>
              <span className="gap-label">{label}</span>
              <span className="gap-check">{on && <Check size={16} />}</span>
            </motion.button>
          )
        })}
      </div>

      <div className="gapcheck-meter">
        <span className="eyebrow">The result?</span>
        <div className="meter">
          <motion.div className="meter-fill" animate={{ height: `${Math.max(level * 100, 4)}%` }} transition={{ type: 'spring', stiffness: 120, damping: 18 }} />
          <div className="meter-scale">
            {outcomes.map((o, i) => (
              <motion.span
                key={o}
                className="meter-outcome"
                animate={{ opacity: missing.size > i ? 1 : 0.25, x: missing.size > i ? 0 : 8 }}
              >
                {o}
              </motion.span>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={missing.size}
            className="meter-caption"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {missing.size === 0
              ? 'Select the gaps you recognize.'
              : missing.size < 3
                ? `${missing.size} of 4 foundations missing — risk is building.`
                : `${missing.size} of 4 foundations missing: fragmented efforts, rising costs, and growing uncertainty.`}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
