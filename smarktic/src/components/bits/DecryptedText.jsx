import { useCallback, useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/'

// Scrambles text and resolves it left to right — on view and on hover.
export default function DecryptedText({ text, className = '', speed = 28 }) {
  const [output, setOutput] = useState(text)
  const ref = useRef(null)
  const timer = useRef(null)

  const run = useCallback(() => {
    clearInterval(timer.current)
    let frame = 0
    timer.current = setInterval(() => {
      frame += 1
      const revealed = Math.floor(frame / 1.6)
      setOutput(
        [...text]
          .map((ch, i) => (i < revealed || ch === ' ' ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]))
          .join(''),
      )
      if (revealed >= text.length) clearInterval(timer.current)
    }, speed)
  }, [text, speed])

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run()
          io.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    io.observe(ref.current)
    return () => {
      io.disconnect()
      clearInterval(timer.current)
    }
  }, [run])

  return (
    <span ref={ref} className={`decrypted ${className}`} onMouseEnter={run} aria-label={text}>
      <span aria-hidden="true">{output}</span>
    </span>
  )
}
