import { useEffect } from 'react'
import Lenis from 'lenis'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useRoute } from './lib/router.jsx'
import { scrollTo, setLenis } from './lib/scroll.js'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Cursor from './components/Cursor.jsx'
import ClickSpark from './components/bits/ClickSpark.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import Growth from './pages/Growth.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

const pages = {
  '/': Home,
  '/services': Services,
  '/growth': Growth,
  '/contact': Contact,
}

const titles = {
  '/': 'Smarktic — Profitable, Responsible & Secure Digital Transformation',
  '/services': 'Services — Smarktic',
  '/growth': 'Croissance Digitale — Smarktic',
  '/contact': 'Book a Diagnostic — Smarktic',
}

export default function App() {
  const route = useRoute()
  const Page = pages[route.path] ?? NotFound

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    setLenis(lenis)
    let raf
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  useEffect(() => {
    document.title = titles[route.path] ?? 'Smarktic'
    document.documentElement.lang = route.path === '/growth' ? 'fr' : 'en'
  }, [route.path])

  return (
    <MotionConfig reducedMotion="user">
      <div className="noise" aria-hidden="true" />
      <Cursor />
      <ClickSpark />
      <Nav path={route.path} />

      <AnimatePresence mode="wait" onExitComplete={() => scrollTo(0, { immediate: true })}>
        <motion.main
          key={route.path}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            className="page-curtain"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            aria-hidden="true"
          />
          <Page params={route.params} />
        </motion.main>
      </AnimatePresence>

      <Footer />
    </MotionConfig>
  )
}
