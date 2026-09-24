/*
 * One-point-perspective architectural room, computed from the real viewport
 * size so the composition is correct on every aspect ratio (no photo cropping).
 *
 *   (0,0) ───────────── ceiling ───────────── (w,0)
 *     │ \                                   / │
 *     │  (L,T) ──────── back wall ──── (R,T)  │
 *   left │                               │ right
 *     │  (L,B) ─────────────────────── (R,B)  │
 *     │ /             floor               \ │
 *   (0,h) ─────────────────────────────── (w,h)
 */
const lerp = (a, b, t) => a + (b - a) * t
const r = (n) => Math.round(n * 10) / 10

export function buildRoom(w, h, text) {
  const a = w / h
  const portrait = a < 0.9
  // back-wall width ratio: wider rooms on wide screens, deeper corridor on phones
  const k = a >= 1.5 ? 0.5 : a >= 1.1 ? 0.54 : a >= 0.9 ? 0.6 : 0.7
  const bw = w * k
  const bh = Math.min(h * (portrait ? 0.4 : 0.5), bw * (portrait ? 1.45 : 0.62))
  const cy = h * (portrait ? 0.47 : 0.46)
  const L = (w - bw) / 2
  const R = L + bw
  let T = cy - bh / 2
  const B = cy + bh / 2
  // Keep the glowing ceiling/back-wall cove line out of the typography: move it to the
  // nearest clear band — above the eyebrow, or in the gap between eyebrow and headline.
  if (text) {
    const above = text.eyebrowTop - (portrait ? 22 : 30)
    const gap = text.titleTop - text.eyebrowBottom
    const between = gap >= 44 ? (text.eyebrowBottom + text.titleTop) / 2 : -Infinity
    const hitsText = T > above && T < text.titleTop + text.fs * 0.85 && !(gap >= 44 && Math.abs(T - between) < gap / 2 - 16)
    if (hitsText) T = Math.abs(T - between) < Math.abs(T - above) ? between : above
    T = Math.max(T, h * 0.08)
  }
  const bhFinal = B - T
  const u = Math.max(4, Math.min(w, h) * 0.009) // base strip width at the picture plane
  const depthScale = (t) => lerp(1, k, t)

  const wallAt = (side, t) => {
    const x = side === 'l' ? L * t : w - L * t
    return { x, top: T * t, bot: h + (B - h) * t }
  }

  /* 1 — primary: vertical profiles on the back wall */
  const pf = portrait ? [0.08, 0.2, 0.8, 0.92] : [0.07, 0.19, 0.81, 0.93]
  const primary = pf.map((f, i) => {
    const x = L + bw * f
    return { id: `p${i}`, x1: r(x), y1: r(T + bhFinal * 0.05), x2: r(x), y2: r(B - bhFinal * 0.05), w: u * k * 1.6 }
  })

  /* 2 — secondary: vertical profiles on the side walls */
  const secondary = []
  for (const side of ['l', 'r']) {
    for (const t of [0.34, 0.72]) {
      const p = wallAt(side, t)
      const span = p.bot - p.top
      secondary.push({
        id: `s${side}${t}`, side, t,
        x1: r(p.x), y1: r(p.top + span * 0.05), x2: r(p.x), y2: r(p.bot - span * 0.05),
        w: u * depthScale(t) * 1.6,
      })
    }
  }

  /* 3 — ceiling: two recessed linear profiles + perimeter coves */
  const ceiling = [0.3, 0.7].map((f, i) => ({
    id: `c${i}`, x1: r(w * f), y1: -6, x2: r(L + bw * f), y2: r(T - 2), w: u * ((1 + k) / 2) * 1.25,
  }))
  const coves = [
    { id: 'cb', x1: r(L + 2), y1: r(T + 1.5), x2: r(R - 2), y2: r(T + 1.5), w: u * k * 1.35 },
    { id: 'cl', x1: 0, y1: 0, x2: r(L), y2: r(T), w: u * 0.9, i: 0.55 },
    { id: 'cr', x1: w, y1: 0, x2: r(R), y2: r(T), w: u * 0.9, i: 0.55 },
  ]

  /* concealed skirting profile where the back wall meets the floor (horizontal line) */
  const skirting = { id: 'sk', x1: r(L + 3), y1: r(B - 1.5), x2: r(R - 3), y2: r(B - 1.5), w: u * k * 1.2 }

  /* architectural seams (panel joints / floor joints) */
  const seams = []
  for (const f of [0.34, 0.5, 0.66]) seams.push([L + bw * f, T, L + bw * f, B])
  for (const side of ['l', 'r']) for (const t of [0.14, 0.53, 0.88]) {
    const p = wallAt(side, t); seams.push([p.x, p.top, p.x, p.bot])
  }
  for (let i = 1; i < 8; i++) seams.push([(w * i) / 8, h, L + (bw * i) / 8, B])
  for (const t of [0.3, 0.6, 0.82]) {
    const y = lerp(h, B, t); seams.push([lerp(0, L, t), y, lerp(w, R, t), y])
  }

  return { w, h, k, L, R, T, B, bw, bh: bhFinal, u, portrait, primary, secondary, ceiling, coves, skirting, seams }
}
