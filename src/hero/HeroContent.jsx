const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const LINES = [
  { text: 'Light', lit: true, d: '1.75s' },
  { text: 'Shapes', d: '1.92s' },
  { text: 'Space.', d: '2.09s' },
]

export default function HeroContent() {
  return (
    <div className="lh-content">
      <p className="lh-eyebrow">Kairvi Lighting</p>
      <h1 className="lh-title" aria-label="Light shapes space.">
        {LINES.map((l) => (
          <span className="lh-line" key={l.text} aria-hidden="true">
            <span className={`lh-word${l.lit ? ' lh-word--lit' : ''}`} data-text={l.text} style={{ '--d': l.d }}>{l.text}</span>
          </span>
        ))}
      </h1>
      <p className="lh-sub">Architectural lighting designed to transform spaces through precision, depth and atmosphere.</p>
      <div className="lh-actions">
        <a href="#collections" className="lh-cta">Explore Lighting <Arrow /></a>
        <a href="#catalogue" className="lh-link">View Collection</a>
      </div>
    </div>
  )
}
