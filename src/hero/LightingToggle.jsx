const PowerIcon = () => (
  <svg className="lh-switch-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M12 3v8" />
    <path d="M6.3 6.8a8 8 0 1 0 11.4 0" />
  </svg>
)

export default function LightingToggle({ on, onToggle }) {
  return (
    <div className="lh-toggle">
      <p className="lh-prompt" aria-hidden="true">Switch on the experience</p>
      <button
        type="button"
        className="lh-switch"
        aria-pressed={on}
        aria-label="Toggle architectural lighting"
        onClick={onToggle}
      >
        <span className="lh-switch-label"><PowerIcon />{on ? 'Lights on' : 'Lights off'}</span>
        <span className="lh-switch-row">
          <span className="lh-switch-off">Off</span>
          <span className="lh-track"><span className="lh-knob" /></span>
          <span className="lh-switch-on">On</span>
        </span>
      </button>
    </div>
  )
}
