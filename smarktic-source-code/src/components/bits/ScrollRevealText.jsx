import { Fragment, useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

function Word({ children, progress, range, accent }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  const blur = useTransform(progress, range, ['blur(4px)', 'blur(0px)'])
  return (
    <motion.span className={accent ? 'accent-text' : undefined} style={{ opacity, filter: blur }}>
      {children}
    </motion.span>
  )
}

// Each word lights up as the paragraph is scrolled through.
export default function ScrollRevealText({ text, className = '', accentWords = [] }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')

  return (
    <p ref={ref} className={`scroll-reveal ${className}`}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <Word
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
            accent={accentWords.includes(word.replace(/[.,:;!?’']/g, ''))}
          >
            {word}
          </Word>{' '}
        </Fragment>
      ))}
    </p>
  )
}
