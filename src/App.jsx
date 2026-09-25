import { useEffect, useRef, useState } from 'react'
import { BRAND, CATEGORIES, COLLECTIONS, FINISHES, SPECS, SERVICES, IMAGES } from './data'
import HeroSection from './hero/HeroSection'

/* ---------- helpers ---------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]:not(.in)')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  })
}

function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / 1400)
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    ref.current && io.observe(ref.current)
    return () => io.disconnect()
  }, [to])
  return <span ref={ref}>{n}{suffix}</span>
}

const Flame = ({ size = 22 }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 40 50" aria-hidden="true">
    <path d="M20 1C16 13 5 23 5 34a15 15 0 0 0 30 0C35 23 24 13 20 1Zm0 24c3.5 6.5 8 9.5 8 14a8 8 0 0 1-16 0c0-4.5 4.5-7.5 8-14Z" fill="currentColor" fillRule="evenodd" />
  </svg>
)

const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const waLink = (text) => `https://wa.me/${BRAND.whatsappRaw}?text=${encodeURIComponent(text)}`

/* ---------- sections ---------- */
function Loader() {
  const [gone, setGone] = useState(false)
  useEffect(() => { const t = setTimeout(() => setGone(true), 1500); return () => clearTimeout(t) }, [])
  return (
    <div className={`loader ${gone ? 'gone' : ''}`} aria-hidden="true">
      <div className="loader-mark"><Flame size={34} /></div>
      <div className="loader-word">KAIRVI LIGHTING</div>
      <div className="loader-bar"><span /></div>
    </div>
  )
}

function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const links = [['About', '#about'], ['Collections', '#collections'], ['Finishes', '#finishes'], ['Services', '#services'], ['Catalogue', '#catalogue'], ['Contact', '#contact']]
  return (
    <header className={`nav ${solid ? 'solid' : ''} ${open ? 'open' : ''}`}>
      <a href="#top" className="logo" onClick={() => setOpen(false)}>
        <Flame /><span>KAIRVI <em>LIGHTING</em></span>
      </a>
      <nav className="nav-links">
        {links.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}
      </nav>
      <a className="btn btn-ghost nav-cta" href={BRAND.catalogue} download>
        Get Catalogue
      </a>
      <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}><span /><span /></button>
    </header>
  )
}

function Marquee() {
  const items = COLLECTIONS.map((c) => c.name)
  const row = [...items, ...items]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.map((n, k) => <span key={k}>{n}<Flame size={12} /></span>)}
      </div>
    </div>
  )
}

function About() {
  return (
    <section className="about section" id="about">
      <div className="wrap about-grid">
        <div>
          <p className="eyebrow" data-reveal>About Kairvi</p>
          <h2 className="display" data-reveal>
            We don't just light rooms — <i>we sculpt moods</i> through the interplay of light and shadow.
          </h2>
        </div>
        <div className="about-copy" data-reveal>
          <p>
            Kairvi Lighting merges cutting-edge LED technology with exquisite design. Our range spans LED fixtures,
            spotlights, linear lights, magnetic track, recessed and architectural-grade systems — selected and engineered
            for the aesthetics and demands of every project.
          </p>
          <p>
            From timeless elegance to futuristic sophistication, every fixture is built to perform consistently, last long,
            and turn ordinary spaces into captivating experiences.
          </p>
          <a href="#services" className="link-arrow">How we work with designers <Arrow /></a>
        </div>
      </div>
      <div className="wrap stats">
        <div className="stat" data-reveal><b><CountUp to={12} /></b><span>Collections</span></div>
        <div className="stat" data-reveal><b><CountUp to={100} suffix="+" /></b><span>Fixtures catalogued</span></div>
        <div className="stat" data-reveal><b>&gt;<CountUp to={90} /></b><span>Colour rendering (CRI)</span></div>
        <div className="stat" data-reveal><b><CountUp to={5} /></b><span>Reflector finishes</span></div>
      </div>
    </section>
  )
}

function Collections() {
  const [cat, setCat] = useState('All')
  const list = COLLECTIONS.filter((c) => cat === 'All' || c.cat === cat)
  return (
    <section className="section collections" id="collections">
      <div className="wrap head-row">
        <div>
          <p className="eyebrow" data-reveal>Catalogue 2024 – 25</p>
          <h2 className="display" data-reveal>The <i>Collections</i></h2>
        </div>
        <div className="tabs" role="tablist" data-reveal>
          {CATEGORIES.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
      </div>
      <div className="wrap grid">
        {list.map((c, k) => (
          <article className="card" key={c.id} style={{ '--k': k }}>
            <div className="card-img"><img src={c.img} alt={`${c.name} ${c.type}`} loading="lazy" /></div>
            <div className="card-body">
              <div className="card-top">
                <span className="card-idx">{String(COLLECTIONS.indexOf(c) + 1).padStart(2, '0')}</span>
                <span className="card-cat">{c.cat}</span>
              </div>
              <h3>{c.name}</h3>
              <p className="card-type">{c.type}</p>
              <dl className="card-specs">
                <div><dt>Power</dt><dd>{c.power}</dd></div>
                <div><dt>Optic</dt><dd>{c.optic}</dd></div>
                {c.variants && <div><dt>Models</dt><dd>{c.variants}</dd></div>}
              </dl>
              <p className="card-note">{c.note}</p>
              <a className="card-link" href={waLink(`Hi Kairvi Lighting, I'd like details & pricing for the ${c.name} (${c.type}) range.`)} target="_blank" rel="noreferrer">
                Enquire <Arrow />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Finishes() {
  const [f, setF] = useState(4)
  const cur = FINISHES[f]
  return (
    <section className="section finishes" id="finishes">
      <div className="wrap fin-grid">
        <div className="fin-visual" data-reveal>
          <div className="beam" style={{ '--glow': cur.glow }} />
          <div className="spot">
            <div className="spot-ring" />
            <div className="spot-reflector" style={{ background: cur.color }} />
            <div className="spot-lens" />
          </div>
        </div>
        <div>
          <p className="eyebrow" data-reveal>Optional reflector colours</p>
          <h2 className="display" data-reveal>Five finishes. <i>One signature glow.</i></h2>
          <p className="muted" data-reveal>
            Every recessed collection can be specified with a reflector that matches your palette — from quiet white and
            matte black to dark chrome, mirror chrome and warm gold.
          </p>
          <div className="swatches" data-reveal>
            {FINISHES.map((x, k) => (
              <button key={x.name} className={k === f ? 'on' : ''} onClick={() => setF(k)} aria-label={x.name}>
                <span style={{ background: x.color }} />
                <small>{x.name}</small>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="wrap spec-row">
        {SPECS.map((s) => (
          <div className="spec" key={s.k} data-reveal>
            <small>{s.k}</small>
            <b>{s.v}</b>
            <p>{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="section services" id="services">
      <div className="wrap head-row">
        <div>
          <p className="eyebrow" data-reveal>For architects · designers · developers</p>
          <h2 className="display" data-reveal>Consultancy, <i>not just catalogue.</i></h2>
        </div>
        <p className="muted head-aside" data-reveal>
          We work alongside your project team from concept to commissioning — guiding lighting design, product selection,
          energy efficiency and regulatory compliance.
        </p>
      </div>
      <div className="wrap svc-list">
        {SERVICES.map((s, k) => (
          <div className="svc" key={s.t} data-reveal>
            <span className="svc-n">{String(k + 1).padStart(2, '0')}</span>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Strip() {
  const imgs = COLLECTIONS.map((c) => c.img)
  const row = [...imgs, ...imgs]
  return (
    <section className="strip" aria-label="Gallery">
      <div className="strip-track">
        {row.map((src, k) => <img key={k} src={src} alt="" loading="lazy" />)}
      </div>
    </section>
  )
}

function Catalogue() {
  return (
    <section className="section catalogue" id="catalogue">
      <div className="wrap cat-grid">
        <a className="cat-book" href={BRAND.catalogue} target="_blank" rel="noreferrer" data-reveal aria-label="Open catalogue PDF">
          <img src={IMAGES.catalogueCover} alt="Kairvi Lighting catalogue 2024–25 cover" loading="lazy" />
          <span className="cat-badge">PDF</span>
        </a>
        <div>
          <p className="eyebrow" data-reveal>Product catalogue</p>
          <h2 className="display" data-reveal>The complete <i style={{ whiteSpace: 'nowrap' }}>2024–25</i> catalogue.</h2>
          <p className="muted cat-copy" data-reveal>
            Every fixture with full spec sheets — product codes, wattage, CCT, beam angles, lumens, CRI, cut-out sizes,
            IP ratings and reflector finishes. Built for architects, designers and dealers.
          </p>
          <ul className="cat-facts" data-reveal>
            <li><b>75</b><span>Pages</span></li>
            <li><b>12</b><span>Collections</span></li>
            <li><b>{BRAND.catalogueSize}</b><span>PDF</span></li>
          </ul>
          <div className="cat-actions" data-reveal>
            <a className="btn btn-gold" href={BRAND.catalogue} download>Download Catalogue <Arrow /></a>
            <a className="btn btn-ghost" href={BRAND.catalogue} target="_blank" rel="noreferrer">View Online</a>
          </div>
          <a className="link-arrow cat-wa" data-reveal href={waLink('Hi Kairvi Lighting, please send me the product catalogue and price list.')} target="_blank" rel="noreferrer">
            Or get it with the price list on WhatsApp <Arrow />
          </a>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', type: 'Residential', msg: '' })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    const text = `Hi Kairvi Lighting,\nName: ${form.name}\nPhone: ${form.phone}\nProject: ${form.type}\n${form.msg}`
    window.open(waLink(text), '_blank')
  }
  return (
    <section className="section contact" id="contact">
      <div className="contact-bg" style={{ backgroundImage: `url(${IMAGES.contact})` }} />
      <div className="wrap contact-grid">
        <div>
          <p className="eyebrow" data-reveal>Let's talk light</p>
          <h2 className="display big" data-reveal>Illuminating <i>your world.</i></h2>
          <div className="contact-info" data-reveal>
            <div><small>Visit</small><a href={BRAND.mapUrl} target="_blank" rel="noreferrer">{BRAND.company}<br />{BRAND.address}</a></div>
            <div><small>Call</small><a href={`tel:+${BRAND.phoneRaw}`}>{BRAND.phone}</a></div>
            <div><small>WhatsApp</small><a href={waLink('Hi Kairvi Lighting, I have an enquiry.')} target="_blank" rel="noreferrer">{BRAND.whatsapp}</a></div>
            <div><small>Write</small>{BRAND.emails.map((m) => <a key={m} href={`mailto:${m}`}>{m}</a>)}</div>
          </div>
        </div>
        <form className="form" onSubmit={submit} data-reveal>
          <h3>Project enquiry</h3>
          <label><span>Name</span><input required value={form.name} onChange={set('name')} placeholder="Your name" /></label>
          <label><span>Phone</span><input required type="tel" value={form.phone} onChange={set('phone')} placeholder="+91" /></label>
          <label><span>Project type</span>
            <select value={form.type} onChange={set('type')}>
              {['Residential', 'Commercial / Retail', 'Hospitality', 'Office', 'Outdoor / Landscape', 'Dealer enquiry'].map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label><span>Message</span><textarea rows="3" value={form.msg} onChange={set('msg')} placeholder="Tell us about the space, ceiling type, timeline…" /></label>
          <button className="btn btn-gold full" type="submit">Send on WhatsApp <Arrow /></button>
          <p className="form-note">Opens WhatsApp with your details pre-filled.</p>
        </form>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap foot-grid">
        <a href="#top" className="logo big"><Flame size={28} /><span>KAIRVI <em>LIGHTING</em></span></a>
        <p className="muted">{BRAND.tagline}</p>
        <div className="foot-links">
          <a href="#collections">Collections</a><a href="#finishes">Finishes</a><a href="#services">Services</a><a href="#catalogue">Catalogue</a><a href={BRAND.catalogue} download>Download PDF</a><a href="#contact">Contact</a>
        </div>
      </div>
      <div className="wrap foot-bottom">
        <span>© {new Date().getFullYear()} Kairvi Lighting · {BRAND.company}</span>
        <span>{BRAND.web}</span>
        <span className="foot-credit">
          Developed by Social Theory · <a href="https://socialtheory.in/" target="_blank" rel="noopener noreferrer">PACEWALK</a>
        </span>
      </div>
    </footer>
  )
}

function WhatsAppFab() {
  return (
    <a className="fab" href={waLink('Hi Kairvi Lighting, I have an enquiry.')} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
      <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.7c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.9 1 3.9.8a3.3 3.3 0 0 0 2.2-1.5 2.7 2.7 0 0 0 .2-1.6c-.1-.2-.3-.3-.6-.4Z" /></svg>
    </a>
  )
}

export default function App() {
  useReveal()
  return (
    <>
      <Loader />
      <Nav />
      <main>
        <HeroSection />
        <Marquee />
        <About />
        <Collections />
        <Strip />
        <Finishes />
        <Services />
        <Catalogue />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
