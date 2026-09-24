import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { buildRoom } from './roomGeometry'
import LightingStrip, { ProfileChannel } from './LightingStrip'

/*
 * Layer stack (bottom → top). Every lit layer is its own composited <svg>/<div>
 * whose ONLY animated property is opacity — the sequence is pure CSS transitions
 * keyed off [data-lights] on the hero, so rapid toggling simply reverses mid-way.
 *   1 base architecture   2 dim (off-state) overlay   3a primary strips
 *   3b secondary strips   3c ceiling profiles   5 reflections / spill
 *   (4 ambient + 6 vignette live in HeroSection so they can parallax separately)
 */
function useSize(ref) {
  const [size, setSize] = useState(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const { width, height } = el.getBoundingClientRect()
      const w = Math.round(width), h = Math.round(height)
      // layout (untransformed) position of the typography, in scene coordinates
      const eb = el.parentElement?.querySelector('.lh-eyebrow')
      const ti = el.parentElement?.querySelector('.lh-title')
      let text = null
      if (eb && ti && eb.offsetParent) {
        const base = eb.offsetParent.offsetTop - el.offsetTop
        const fs = parseFloat(getComputedStyle(ti).fontSize) || 0
        text = {
          eyebrowTop: Math.round(base + eb.offsetTop),
          eyebrowBottom: Math.round(base + eb.offsetTop + eb.offsetHeight),
          titleTop: Math.round(base + ti.offsetTop + fs * 0.16),
          fs,
        }
      }
      const key = `${w}x${h}:${text ? text.eyebrowTop + ',' + text.titleTop : ''}`
      setSize((s) => (s && s.key === key ? s : { w, h, text, key }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return size
}

const Defs = () => (
  <svg className="lh-defs" width="0" height="0" aria-hidden="true" focusable="false">
    <defs>
      {/* profile light — gradients run ACROSS the strip (local y axis) */}
      <linearGradient id="lh-core" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" className="lh-t" stopOpacity="0" />
        <stop offset="0.22" className="lh-t" stopOpacity="0.9" />
        <stop offset="0.5" className="lh-hot" stopOpacity="1" />
        <stop offset="0.78" className="lh-t" stopOpacity="0.9" />
        <stop offset="1" className="lh-t" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="lh-glow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" className="lh-t" stopOpacity="0" />
        <stop offset="0.25" className="lh-t" stopOpacity="0.1" />
        <stop offset="0.42" className="lh-t" stopOpacity="0.38" />
        <stop offset="0.5" className="lh-t" stopOpacity="0.55" />
        <stop offset="0.58" className="lh-t" stopOpacity="0.38" />
        <stop offset="0.75" className="lh-t" stopOpacity="0.1" />
        <stop offset="1" className="lh-t" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="lh-spill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" className="lh-t" stopOpacity="0" />
        <stop offset="0.2" className="lh-t" stopOpacity="0.025" />
        <stop offset="0.35" className="lh-t" stopOpacity="0.07" />
        <stop offset="0.5" className="lh-t" stopOpacity="0.13" />
        <stop offset="0.65" className="lh-t" stopOpacity="0.07" />
        <stop offset="0.8" className="lh-t" stopOpacity="0.025" />
        <stop offset="1" className="lh-t" stopOpacity="0" />
      </linearGradient>
      {/* light pools / reflections */}
      <radialGradient id="lh-pool" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" className="lh-t" stopOpacity="0.3" />
        <stop offset="0.45" className="lh-t" stopOpacity="0.1" />
        <stop offset="1" className="lh-t" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="lh-refl-soft" cx="0.5" cy="0" r="0.5" fx="0.5" fy="0">
        <stop offset="0" className="lh-t" stopOpacity="0.2" />
        <stop offset="0.35" className="lh-t" stopOpacity="0.07" />
        <stop offset="1" className="lh-t" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="lh-refl-core" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" className="lh-hot" stopOpacity="0.42" />
        <stop offset="0.35" className="lh-t" stopOpacity="0.14" />
        <stop offset="1" className="lh-t" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="lh-wash-down" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" className="lh-t" stopOpacity="0.2" />
        <stop offset="0.3" className="lh-t" stopOpacity="0.07" />
        <stop offset="1" className="lh-t" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="lh-wash-up" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" className="lh-t" stopOpacity="0.26" />
        <stop offset="0.4" className="lh-t" stopOpacity="0.07" />
        <stop offset="1" className="lh-t" stopOpacity="0" />
      </linearGradient>
      {/* architecture surfaces */}
      <linearGradient id="lh-g-back" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#261e17" />
        <stop offset="1" stopColor="#1a1510" />
      </linearGradient>
      <linearGradient id="lh-g-left" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#0d0b09" />
        <stop offset="1" stopColor="#1f1913" />
      </linearGradient>
      <linearGradient id="lh-g-right" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0" stopColor="#0d0b09" />
        <stop offset="1" stopColor="#1f1913" />
      </linearGradient>
      <linearGradient id="lh-g-ceil" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0b0908" />
        <stop offset="1" stopColor="#1a1510" />
      </linearGradient>
      <linearGradient id="lh-g-floor" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#090807" />
        <stop offset="0.7" stopColor="#16120e" />
        <stop offset="1" stopColor="#211a13" />
      </linearGradient>
    </defs>
  </svg>
)

function Layer({ className, room, children }) {
  return (
    <svg className={`lh-layer ${className}`} viewBox={`0 0 ${room.w} ${room.h}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

function FloorReflection({ x, y, w, len }) {
  return (
    <g>
      <rect x={x - w * 4.5} y={y} width={w * 9} height={len * 2} fill="url(#lh-refl-soft)" />
      <rect x={x - w * 0.35} y={y} width={w * 0.7} height={len} fill="url(#lh-refl-core)" />
    </g>
  )
}

export default function LightingScene() {
  const ref = useRef(null)
  const size = useSize(ref)
  const room = useMemo(() => (size && size.w > 0 && size.h > 0 ? buildRoom(size.w, size.h, size.text) : null), [size])

  return (
    <div className="lh-scene" ref={ref} aria-hidden="true">
      <Defs />
      {room && (
        <>
          {/* 1 — base architecture (drawn at "lit" exposure; the dim layer darkens it) */}
          <svg className="lh-base" viewBox={`0 0 ${room.w} ${room.h}`} preserveAspectRatio="none" focusable="false">
            <polygon points={`0,0 ${room.w},0 ${room.R},${room.T} ${room.L},${room.T}`} fill="url(#lh-g-ceil)" />
            <polygon points={`0,${room.h} ${room.w},${room.h} ${room.R},${room.B} ${room.L},${room.B}`} fill="url(#lh-g-floor)" />
            <polygon points={`0,0 ${room.L},${room.T} ${room.L},${room.B} 0,${room.h}`} fill="url(#lh-g-left)" />
            <polygon points={`${room.w},0 ${room.R},${room.T} ${room.R},${room.B} ${room.w},${room.h}`} fill="url(#lh-g-right)" />
            <rect x={room.L} y={room.T} width={room.bw} height={room.bh} fill="url(#lh-g-back)" />
            <g stroke="#f3e2c6" strokeOpacity="0.045" strokeWidth="1">
              {room.seams.map(([a, b, c, d], k) => <line key={k} x1={a} y1={b} x2={c} y2={d} />)}
            </g>
            {/* room edges */}
            <g stroke="#000" strokeOpacity="0.55" strokeWidth="1.2">
              <line x1="0" y1="0" x2={room.L} y2={room.T} /><line x1={room.w} y1="0" x2={room.R} y2={room.T} />
              <line x1="0" y1={room.h} x2={room.L} y2={room.B} /><line x1={room.w} y1={room.h} x2={room.R} y2={room.B} />
            </g>
            {/* unlit profile channels */}
            {[...room.primary, ...room.secondary, ...room.ceiling, ...room.coves].map((s) => <ProfileChannel key={s.id} {...s} />)}
            <ProfileChannel {...room.skirting} />
          </svg>

          {/* 2 — off-state dim */}
          <div className="lh-dim" />

          {/* 3a — primary back-wall profiles */}
          <Layer className="lh-l-primary" room={room}>
            {room.primary.map((s) => <LightingStrip key={s.id} {...s} />)}
          </Layer>

          {/* 3b — side-wall profiles + skirting profile washing up the back wall */}
          <Layer className="lh-l-secondary" room={room}>
            {room.secondary.map((s) => (
              <g key={s.id}>
                <ellipse cx={s.x1 + (s.side === 'l' ? 1 : -1) * s.w * 2} cy={s.y2 + s.w * 1.2} rx={s.w * 8} ry={s.w * 2} fill="url(#lh-pool)" />
                <ellipse cx={s.x1 + (s.side === 'l' ? 1 : -1) * s.w * 2} cy={s.y1 - s.w} rx={s.w * 7} ry={s.w * 1.6} fill="url(#lh-pool)" />
                <LightingStrip {...s} />
              </g>
            ))}
            <rect x={room.L} y={room.B - room.bh * 0.34} width={room.bw} height={room.bh * 0.34} fill="url(#lh-wash-up)" />
            <ellipse cx={room.w / 2} cy={room.B + (room.h - room.B) * 0.02} rx={room.bw * 0.56} ry={(room.h - room.B) * 0.1} fill="url(#lh-pool)" opacity="0.8" />
            <LightingStrip {...room.skirting} />
          </Layer>

          {/* 3c — ceiling profiles + perimeter coves + cove wash on the back wall */}
          <Layer className="lh-l-ceiling" room={room}>
            <rect x={room.L} y={room.T} width={room.bw} height={room.bh * 0.42} fill="url(#lh-wash-down)" />
            <rect x={room.L} y={room.T - room.bh * 0.18} width={room.bw} height={room.bh * 0.18} fill="url(#lh-wash-up)" />
            {room.coves.map((s) => <LightingStrip key={s.id} {...s} />)}
            {room.ceiling.map((s) => <LightingStrip key={s.id} {...s} />)}
          </Layer>

          {/* 5 — golden reflections on the polished floor */}
          <Layer className="lh-l-reflect" room={room}>
                        {room.primary.map((s) => (
              <FloorReflection key={s.id} x={s.x1} y={room.B + 2} w={s.w} len={(room.h - room.B) * 0.42} />
            ))}
            {room.secondary.map((s) => (
              <FloorReflection key={s.id} x={s.x1} y={s.y2 + s.w * 2} w={s.w * 0.8} len={(room.h - s.y2) * 0.5} />
            ))}
          </Layer>
        </>
      )}
    </div>
  )
}
