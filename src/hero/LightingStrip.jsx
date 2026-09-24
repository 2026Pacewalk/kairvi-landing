/*
 * One architectural profile light, drawn in a local frame along its length so it
 * works for vertical, horizontal and perspective (diagonal) runs alike.
 * Three stacked layers — no blur filters, gradients only (cheap to composite):
 *   spill  — wide, very soft light falling on the surrounding surface
 *   glow   — medium halo of the diffuser
 *   core   — sharp, hot centre line of the LED profile
 */
export default function LightingStrip({ x1, y1, x2, y2, w, i = 1 }) {
  const len = Math.hypot(x2 - x1, y2 - y1)
  const deg = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
  const core = Math.max(1.2, w * 0.34)
  const glow = w * 3.2
  const spill = w * 12
  return (
    <g transform={`translate(${x1} ${y1}) rotate(${deg.toFixed(2)})`} opacity={i}>
      <rect className="profile-light-spill" x={-spill * 0.2} y={-spill / 2} width={len + spill * 0.4} height={spill} rx={spill / 2} fill="url(#lh-spill)" />
      <rect className="profile-light-glow" x={-glow * 0.25} y={-glow / 2} width={len + glow * 0.5} height={glow} rx={glow / 2} fill="url(#lh-glow)" />
      <rect className="profile-light-core" x={0} y={-core / 2} width={len} height={core} rx={core / 2} fill="url(#lh-core)" />
    </g>
  )
}

/* Dark aluminium channel of an unlit profile — visible in the OFF state */
export function ProfileChannel({ x1, y1, x2, y2, w }) {
  const cw = Math.max(1.6, w * 0.5)
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#050404" strokeWidth={cw + 1.4} strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4a3b2a" strokeOpacity="0.75" strokeWidth={cw * 0.55} strokeLinecap="round" />
    </g>
  )
}
