// Shared Lenis instance so any component can smooth-scroll.
let lenis = null

export function setLenis(instance) {
  lenis = instance
}

export function scrollTo(target, options = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset: -80, ...options })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : null
  if (el) el.scrollIntoView({ behavior: options.immediate ? 'auto' : 'smooth' })
  else if (typeof target === 'number') window.scrollTo(0, target)
}
