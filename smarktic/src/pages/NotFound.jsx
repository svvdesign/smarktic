import { ArrowRight } from 'lucide-react'
import { Link } from '../lib/router.jsx'
import DotGrid from '../components/bits/DotGrid.jsx'
import SplitText from '../components/bits/SplitText.jsx'

export default function NotFound() {
  return (
    <section className="page-hero not-found">
      <DotGrid />
      <div className="container page-hero-inner">
        <span className="eyebrow">404</span>
        <SplitText text="This page took a different path." className="page-title" />
        <Link to="/" className="btn btn-primary">
          Back home <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}
