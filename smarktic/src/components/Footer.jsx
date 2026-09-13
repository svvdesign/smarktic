import { ArrowUpRight } from 'lucide-react'
import { Link } from '../lib/router.jsx'
import { scrollTo } from '../lib/scroll.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="nav-logo">
            <img src="/logo.svg" alt="" width="30" height="30" />
            <span>Smarktic</span>
          </Link>
          <p className="footer-tagline">
            Building digital transformation that is profitable, responsible, and secure.
          </p>
        </div>
        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/growth">Digital Growth</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer-col">
          <h4>Engagements</h4>
          <Link to="/services?engagement=audit">Maturity &amp; Governance Audit</Link>
          <Link to="/services?engagement=roadmap">Transformation Roadmap</Link>
          <Link to="/services?engagement=leadership">Leadership &amp; Culture</Link>
        </div>
        <div className="footer-col">
          <h4>Learn</h4>
          <a href="https://mindfull.ma" target="_blank" rel="noreferrer">
            DMI certifications · Mindfull.ma <ArrowUpRight size={14} />
          </a>
          <Link to="/contact?type=proposal">Request a Proposal</Link>
        </div>
      </div>

      <div className="footer-giant" aria-hidden="true">
        SMARKTIC
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Smarktic. Technology that serves people first.</span>
        <button className="link-button" onClick={() => scrollTo(0)}>
          Back to top ↑
        </button>
      </div>
    </footer>
  )
}
