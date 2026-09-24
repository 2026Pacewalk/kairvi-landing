import { useEffect, useRef, useState } from 'react'
import LightingScene from './LightingScene'
import HeroContent from './HeroContent'
import LightingToggle from './LightingToggle'
import './hero.css'

/* Desktop-only cursor parallax — eased with rAF, disabled on touch / reduced motion */
function useParallax(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    let raf = 0, tx = 0, ty = 0, x = 0, y = 0
    const tick = () => {
      x += (tx - x) * 0.07
      y += (ty - y) * 0.07
      el.style.setProperty('--px', x.toFixed(4))
      el.style.setProperty('--py', y.toFixed(4))
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.0015 ? requestAnimationFrame(tick) : 0
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick) }
    const move = (e) => {
      const r = el.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width) * 2 - 1
      ty = ((e.clientY - r.top) / r.height) * 2 - 1
      kick()
    }
    const leave = () => { tx = 0; ty = 0; kick() }
    el.addEventListener('pointermove', move, { passive: true })
    el.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [ref])
}

export default function HeroSection() {
  // Always starts OFF — the visitor triggers the transformation (not persisted).
  const [lightsOn, setLightsOn] = useState(false)
  const [ready, setReady] = useState(false)
  const ref = useRef(null)
  useParallax(ref)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 3400) // after intro reveal: unmask lines so the glow isn't clipped
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      ref={ref}
      id="top"
      className={`lh${ready ? ' lh--ready' : ''}`}
      data-lights={lightsOn ? 'on' : 'off'}
    >
      <LightingScene />
      <div className="lh-layer lh-ambient" aria-hidden="true" />
      <div className="lh-vignette" aria-hidden="true" />
      <HeroContent />
      <div className="lh-control">
        <LightingToggle on={lightsOn} onToggle={() => setLightsOn((v) => !v)} />
      </div>
      <a href="#about" className="lh-scroll">
        <span>Scroll to discover</span>
        <i aria-hidden="true" />
      </a>
    </section>
  )
}
