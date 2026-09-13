import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'

export default function Accordion({ items }) {
  const [open, setOpen] = useState(0)

  return (
    <div className="accordion">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className={`accordion-item ${isOpen ? 'is-open' : ''}`}>
            <button className="accordion-trigger" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
              <span className="accordion-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="accordion-q">{item.q}</span>
              <motion.span className="accordion-icon" animate={{ rotate: isOpen ? 45 : 0 }}>
                <Plus size={20} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  className="accordion-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p>{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
