import { Fragment } from 'react'
import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1]

// Reveals text letter by letter (or word by word) when it scrolls into view.
// `highlight` maps a word to a CSS class, e.g. { Secure: 'grad-cyan' }.
export default function SplitText({
  text,
  as = 'h1',
  className = '',
  by = 'chars',
  delay = 0,
  stagger = 0.025,
  highlight = {},
}) {
  const Tag = motion[as]
  const words = text.split(' ')
  let index = 0

  const variants = (i) => ({
    hidden: { opacity: 0, y: '0.55em', filter: 'blur(10px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { delay: delay + i * stagger, duration: 0.7, ease },
    },
  })

  return (
    <Tag
      className={`split-text ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      aria-label={text}
    >
      {words.map((word, wi) => {
        const clean = word.replace(/[.,:;!?]/g, '')
        const hl = highlight[clean]
        const units = by === 'chars' && !hl ? [...word] : [word]
        return (
          <Fragment key={wi}>
            <span className={`split-word ${hl || ''}`} aria-hidden="true">
              {units.map((unit, ui) => (
                <motion.span key={ui} className="split-unit" variants={variants(index++)}>
                  {unit}
                </motion.span>
              ))}
            </span>
            {wi < words.length - 1 && ' '}
          </Fragment>
        )
      })}
    </Tag>
  )
}
