// Infinite ticker; the list is rendered twice so the CSS loop is seamless.
export default function Marquee({ items, reverse = false, className = '' }) {
  const row = items.map((item, i) => (
    <span className="marquee-item" key={i}>
      {item}
      <span className="marquee-dot" />
    </span>
  ))
  return (
    <div className={`marquee ${reverse ? 'marquee-reverse' : ''} ${className}`} aria-hidden="true">
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  )
}
