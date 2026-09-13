import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { AnimatedNumber } from './bits/CountUp.jsx'

const money = (currency) => (v) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(v)) + (currency === 'EUR' ? ' €' : ' MAD')
const ratio = (v) => `${v.toFixed(1)}x`

function Slider({ label, value, min, max, step, onChange, format }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <label className="slider">
      <span className="slider-head">
        <span>{label}</span>
        <strong>{format(value)}</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--pct': `${pct}%` }}
      />
    </label>
  )
}

function compute({ budget, cac, arpu, margin, lifetime }) {
  const customers = budget / cac
  const ltv = arpu * (margin / 100) * lifetime
  const revenue = customers * arpu * lifetime
  return { customers, ltv, ltvCac: ltv / cac, roas: revenue / budget, revenue }
}

// Illustrative simulator for the Digital Growth page (CAC, LTV, ROAS).
export default function RoiCalculator() {
  const [currency, setCurrency] = useState('MAD')
  const [budget, setBudget] = useState(50000)
  const [cac, setCac] = useState(400)
  const [arpu, setArpu] = useState(250)
  const [margin, setMargin] = useState(60)
  const [lifetime, setLifetime] = useState(8)
  const [cacGain, setCacGain] = useState(20)
  const [retentionGain, setRetentionGain] = useState(25)

  const fmt = useMemo(() => money(currency), [currency])
  const now = compute({ budget, cac, arpu, margin, lifetime })
  const next = compute({ budget, cac: cac * (1 - cacGain / 100), arpu, margin, lifetime: lifetime * (1 + retentionGain / 100) })

  const max = Math.max(now.revenue, next.revenue)
  const pct = (v) => `${Math.max((v / max) * 100, 3)}%`

  return (
    <div className="roi">
      <div className="roi-inputs">
        <div className="roi-head">
          <h3>Vos chiffres actuels</h3>
          <div className="toggle" role="group" aria-label="Devise">
            {['MAD', 'EUR'].map((c) => (
              <button key={c} className={currency === c ? 'is-on' : ''} onClick={() => setCurrency(c)}>
                {c === 'EUR' ? '€' : c}
                {currency === c && <motion.span layoutId="currency-pill" className="toggle-pill" />}
              </button>
            ))}
          </div>
        </div>
        <Slider label="Budget marketing mensuel" value={budget} min={5000} max={500000} step={5000} onChange={setBudget} format={fmt} />
        <Slider label="Coût d'acquisition client (CAC)" value={cac} min={20} max={3000} step={10} onChange={setCac} format={fmt} />
        <Slider label="Revenu mensuel par client" value={arpu} min={10} max={3000} step={10} onChange={setArpu} format={fmt} />
        <Slider label="Marge brute" value={margin} min={5} max={95} step={1} onChange={setMargin} format={(v) => `${v} %`} />
        <Slider label="Durée de vie client" value={lifetime} min={1} max={60} step={1} onChange={setLifetime} format={(v) => `${v} mois`} />

        <h3 className="roi-sub">Scénario d'optimisation</h3>
        <Slider label="Réduction du CAC (attribution, MarTech)" value={cacGain} min={0} max={50} step={1} onChange={setCacGain} format={(v) => `−${v} %`} />
        <Slider label="Hausse de la rétention (conversion & LTV)" value={retentionGain} min={0} max={100} step={1} onChange={setRetentionGain} format={(v) => `+${v} %`} />
      </div>

      <div className="roi-output">
        <div className="roi-kpis">
          {[
            { label: 'LTV', a: now.ltv, b: next.ltv, f: fmt },
            { label: 'LTV : CAC', a: now.ltvCac, b: next.ltvCac, f: ratio },
            { label: 'ROAS', a: now.roas, b: next.roas, f: ratio },
            { label: 'Clients / mois', a: now.customers, b: next.customers, f: (v) => Math.round(v).toLocaleString('fr-FR') },
          ].map((k) => (
            <div className="roi-kpi" key={k.label}>
              <span className="roi-kpi-label">{k.label}</span>
              <span className="roi-kpi-now">
                <AnimatedNumber value={k.a} format={k.f} />
              </span>
              <span className="roi-kpi-next">
                → <AnimatedNumber value={k.b} format={k.f} />
              </span>
            </div>
          ))}
        </div>

        <div className="roi-bars">
          <span className="roi-bars-title">Revenu généré par un mois d'acquisition</span>
          <div className="roi-bar-row">
            <span>Aujourd'hui</span>
            <div className="roi-bar">
              <motion.div className="roi-bar-fill is-now" animate={{ width: pct(now.revenue) }} />
            </div>
            <strong>
              <AnimatedNumber value={now.revenue} format={fmt} />
            </strong>
          </div>
          <div className="roi-bar-row">
            <span>Optimisé</span>
            <div className="roi-bar">
              <motion.div className="roi-bar-fill is-next" animate={{ width: pct(next.revenue) }} />
            </div>
            <strong>
              <AnimatedNumber value={next.revenue} format={fmt} />
            </strong>
          </div>
          <p className="roi-delta">
            +<AnimatedNumber value={Math.max(next.revenue - now.revenue, 0)} format={fmt} /> sur le même budget
          </p>
        </div>

        <p className="roi-note">
          Simulation illustrative basée sur vos hypothèses — pas une promesse de résultat. Le Diagnostic de Performance
          mesure vos chiffres réels.
        </p>
      </div>
    </div>
  )
}
