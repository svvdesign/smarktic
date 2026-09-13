import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { Link } from '../lib/router.jsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/growth', label: 'Digital Growth' },
  { to: '/contact', label: 'Contact' },
]

export default function Nav({ path }) {
  const { scrollY, scrollYProgress } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(null)

  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(v > 40)
    setHidden(v > prev && v > 320 && !open)
  })

  useEffect(() => setOpen(false), [path])

  const indicator = hovered ?? path

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
      <motion.header
        className={`nav ${scrolled ? 'is-scrolled' : ''}`}
        animate={{ y: hidden ? -110 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to="/" className="nav-logo" aria-label="Smarktic home">
          <img src="/logo.svg" alt="" width="30" height="30" />
          <span>Smarktic</span>
        </Link>

        <nav className="nav-links" onMouseLeave={() => setHovered(null)} aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link ${path === l.to ? 'is-active' : ''}`}
              onMouseEnter={() => setHovered(l.to)}
              aria-current={path === l.to ? 'page' : undefined}
            >
              {indicator === l.to && (
                <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
              )}
              <span className="nav-link-label">{l.label}</span>
            </Link>
          ))}
        </nav>

        <Link to="/contact?type=diagnostic" className="btn btn-primary btn-sm nav-cta">
          Book a Diagnostic
        </Link>

        <button className="nav-burger" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {links.map((l, i) => (
              <motion.div key={l.to} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07 }}>
                <Link to={l.to} className={`mobile-link ${path === l.to ? 'is-active' : ''}`}>
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <Link to="/contact?type=diagnostic" className="btn btn-primary">
              Book an Executive Diagnostic Call
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
