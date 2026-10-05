import { useState, useEffect } from 'react'
import { CFG, IMG, LOGO, SLIDES, SERV, CUIS, HALAL, WHY, STEPS, QUAL, PROJ, PF, MENU, MT, FAQ, NAV, FIELDS, S } from './data'

const Plate = ({ h }) => (
  <svg width="54" height="54" viewBox="0 0 54 54" aria-hidden="true">
    <circle cx="27" cy="30" r="14" fill="none" stroke={`hsl(${h} 45% 35%)`} strokeWidth="3" />
    <path d="M12 20a18 18 0 0 1 30 0" fill="none" stroke={`hsl(${h} 55% 45%)`} strokeWidth="3" strokeLinecap="round" />
    <path d="M27 18c4-6 9-6 10-4-1 4-6 5-10 4z" fill="#3f6b4a" />
  </svg>
)

/* FINAL LOGO: replace public/images/logo.png (or swap this <img> for an inline SVG) with the approved logo. */
const Logo = () => (
  <img src={LOGO} alt="SISCO Catering سيسكو للتموين" width="110" height="48"
    style={{ background: '#fff', borderRadius: 10, padding: '4px 8px', height: 48, width: 'auto' }} />
)

export default function App() {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('l') || 'en' } catch { return 'en' } })
  const [si, setSi] = useState(0)
  const [paused, setPaused] = useState(false)
  const [pf, setPf] = useState('*')
  const [mt, setMt] = useState('Breakfast')
  const [scrolled, setScrolled] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [errs, setErrs] = useState({})
  const [status, setStatus] = useState({ type: '', text: '' })
  const [sending, setSending] = useState(false)
  const [x0, setX0] = useState(0)

  const ar = lang === 'ar'
  const L = (a) => a[ar ? 1 : 0]
  const T = (k) => S[lang][k]
  const wa = `https://wa.me/${CFG.wa}`
  const go = (n) => setSi((p) => (p + n + SLIDES.length) % SLIDES.length)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = ar ? 'rtl' : 'ltr'
    document.title = ar ? 'سيسكو للتموين | خدمات التموين والضيافة في السعودية' : 'SISCO Catering | Catering and Hospitality Services in Saudi Arabia'
    try { localStorage.setItem('l', lang) } catch { /* storage unavailable */ }
  }, [lang, ar])

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => go(1), 6000)
    return () => clearInterval(t)
  }, [paused])

  const onKey = (e) => {
    if (e.key === 'ArrowRight') go(ar ? -1 : 1)
    if (e.key === 'ArrowLeft') go(ar ? 1 : -1)
  }
  const onTouchEnd = (e) => {
    setPaused(false)
    const dx = e.changedTouches[0].clientX - x0
    if (Math.abs(dx) > 40) go((dx < 0 ? 1 : -1) * (ar ? -1 : 1))
  }

  const submit = async (e) => {
    e.preventDefault()
    const f = e.currentTarget
    const next = {}
    FIELDS.forEach(([id, , , type, req]) => {
      const v = f.elements[id].value.trim()
      if (req && !v) next[id] = T('req')
      else if (v && type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) next[id] = T('inv')
      else if (v && type === 'tel' && !/^\+?[\d\s\-()]{7,16}$/.test(v)) next[id] = T('inv')
    })
    if (!f.elements.consent.checked) next.consent = T('req')
    setErrs(next)
    if (Object.keys(next).length) { setStatus({ type: 'bad', text: T('bad') }); return }
    setSending(true)
    try {
      /* TODO: connect to your backend, e.g.
         await fetch('/api/proposal', { method: 'POST', body: new FormData(f) }) */
      await new Promise((r) => setTimeout(r, 900))
      setStatus({ type: 'ok', text: T('ok') })
      f.reset()
    } catch {
      setStatus({ type: 'bad', text: T('bad') })
    }
    setSending(false)
  }

  const projects = PROJ.filter((p) => pf === '*' || p[2] === pf)
  const bare = { display: 'inline', marginInlineEnd: 14 }

  return (
    <>
      <a className="skip" href="#main">{T('skip')}</a>

      <div className="ann"><div className="w">
        <span>{T('ann')}</span>
        <span className="l">
          <a href={`tel:${CFG.phone.replace(/[^+\d]/g, '').slice(0, 13)}`}><bdi>{CFG.phone}</bdi></a>
          <a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href={`mailto:${CFG.email}`}><bdi>{CFG.email}</bdi></a>
          <a href="#proposal">{T('prop')}</a>
          <button className="lang" onClick={() => setLang(ar ? 'en' : 'ar')}>{T('lang')}</button>
        </span>
      </div></div>

      <header className={scrolled ? 's' : ''}><div className="w hb">
        <a className="logo" href="#top"><Logo /></a>
        <button className="burger" aria-expanded={navOpen} aria-controls="nv" aria-label="Menu" onClick={() => setNavOpen(!navOpen)}>☰</button>
        <nav id="nv" className={navOpen ? 'o' : ''} aria-label="Main">
          <ul>
            {NAV.map((n) => <li key={n[2]}><a href={`#${n[2]}`} onClick={() => setNavOpen(false)}>{L(n)}</a></li>)}
            <li><a className="btn" href="#proposal" style={{ color: '#123a5c' }}>{T('prop')}</a></li>
          </ul>
        </nav>
      </div></header>

      <main id="main">
        <section className="hero" id="top"><div className="w in">
          {/* TODO: for a real hero photo, set background in .hero (index.css) to url(/images/catering-hero.webp) */}
          <p className="tag">{T('tr')}</p>
          <h1>{T('h1')}</h1>
          <p>{T('hp')}</p>
          <p><a className="btn" href="#proposal">{T('b1')}</a> <a className="btn o" href="#services">{T('b2')}</a></p>
          <div className="fl">{T('fc').map((x) => <span key={x}>✓ {x}</span>)}</div>
        </div></section>

        <div className="sl" role="region" aria-roledescription="carousel" aria-label={T('sv')} tabIndex={0}
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} onKeyDown={onKey}
          onTouchStart={(e) => { setPaused(true); setX0(e.touches[0].clientX) }} onTouchEnd={onTouchEnd}>
          {SLIDES.map((s, k) => (
            <div key={k} className={'sd' + (k === si ? ' a' : '')} role="group" aria-roledescription="slide"
              aria-label={L(s)} aria-hidden={k !== si}
              style={{ background: `url(${IMG[s[4]]}) ${s[5]}/cover no-repeat` }}>
              <div className="c"><h3>{L(s)}</h3><p>{ar ? s[3] : s[2]}</p></div>
            </div>
          ))}
          <button className="ar p" aria-label="Previous" onClick={() => go(-1)}>❮</button>
          <button className="ar n" aria-label="Next" onClick={() => go(1)}>❯</button>
          <div className="dots">
            {SLIDES.map((_, k) => <button key={k} className={k === si ? 'a' : ''} aria-label={`${k + 1}`} onClick={() => setSi(k)} />)}
          </div>
        </div>

        <div className="w">
          <div className="facts">
            <div><b>28,000+</b><span>{ar ? 'وجبة يومياً*' : 'meals daily*'}</span></div>
            <div><b>HACCP</b><span>*</span></div>
            <div><b>ISO</b><span>9001 · 22000 · 14001 · 45001*</span></div>
            <div><b>8,000+</b><span>{ar ? 'مقيم في مواقع متعددة*' : 'residents housed*'}</span></div>
          </div>
          <p className="note">{T('fn')} {T('cf')}</p>
        </div>

        <section id="about"><div className="w"><h2>{T('ab')}</h2><p className="lead">{T('abp')}</p></div></section>

        <section className="alt" id="services"><div className="w"><h2>{T('sv')}</h2>
          <div className="g">{SERV.map((s, k) => (
            <article className="cd" key={k}>
              <div className="im" style={{ background: `hsl(${30 + k * 38} 40% 88%)` }}><Plate h={30 + k * 38} /></div>
              <div className="bd"><h3>{L(s)}</h3><p>{ar ? s[3] : s[2]}</p><a className="m" href="#proposal">{T('lm')}</a></div>
            </article>))}
          </div>
        </div></section>

        <section id="menus"><div className="w"><h2>{T('cu')}</h2><p className="lead">{T('cp')}</p>
          <div className="g">{CUIS.map((c, k) => (
            <article className="cd" key={k}>
              <div className="im" style={{ background: `hsl(${100 + k * 45} 30% 85%)` }}><Plate h={100 + k * 45} /></div>
              <div className="bd"><h3>{L(c)}</h3><p>{ar ? c[3] : c[2]}</p></div>
            </article>))}
          </div>
        </div></section>

        <section className="dk" id="halal"><div className="w"><h2>{T('hl')}</h2><p className="lead">{T('hp2')}</p>
          <ul className="ck">{HALAL.map((h, k) => <li key={k}>{L(h)}</li>)}</ul>
          <p className="note">{ar ? 'لا نذكر شهادة حلال ما لم تُقدَّم وثائق رسمية.' : 'Halal certification is only stated when official documentation is supplied.'}</p>
        </div></section>

        <section id="sectors"><div className="w"><h2>{T('sec')}</h2><p className="lead">{T('secp')}</p>
          <h2 style={{ marginTop: 50 }}>{T('wy')}</h2>
          <div className="g">{WHY.map((s, k) => <article className="cd pl" key={k}><h3>{L(s)}</h3><p>{ar ? s[3] : s[2]}</p></article>)}</div>
        </div></section>

        <section className="alt"><div className="w"><h2>{T('pc')}</h2>
          <div className="pr">{STEPS.map((s, k) => <div key={k}>{L(s)}</div>)}</div>
          <p className="note">{T('pcs')}</p>
        </div></section>

        <section className="dk"><div className="w"><h2>{T('ql')}</h2>
          <ul className="ck">{QUAL.map((h, k) => <li key={k}>{L(h)}</li>)}</ul>
          <p className="note">{T('qn')}</p>
        </div></section>

        <section id="projects"><div className="w"><h2>{T('pj')}</h2><p className="lead">{T('pn')}</p>
          <div className="tabs" role="group">{PF.map((f) => <button key={f[2]} aria-pressed={pf === f[2]} onClick={() => setPf(f[2])}>{L(f)}</button>)}</div>
          <div className="g">{projects.map((p, k) => <article className="cd pl" key={k}><h3>{L(p)}</h3></article>)}</div>
        </div></section>

        <section className="alt"><div className="w"><h2>{T('mn')}</h2><p className="lead">{T('mnn')}</p>
          <div className="tabs" role="tablist">{Object.keys(MENU).map((k) => <button key={k} role="tab" aria-selected={mt === k} onClick={() => setMt(k)}>{ar ? MT[k] : k}</button>)}</div>
          <div className="g">{MENU[mt].map((x, k) => <article className="cd pl" key={k}><h3>{x.split('|')[ar ? 1 : 0]}</h3></article>)}</div>
          <p><a className="btn n" href="#proposal">{T('md')}</a></p>
        </div></section>

        <section id="media"><div className="w"><h2>{T('tt')}</h2>
          {/* TODO: replace this sample testimonial with an approved real testimonial */}
          <blockquote className="cd pl" style={{ margin: '20px 0' }}><p>{T('tq')}</p><small>{T('ts')}</small></blockquote>
          <h2>{T('md2')}</h2><p className="lead">{T('mdp')}</p>
        </div></section>

        <section className="dk" id="proposal"><div className="w"><h2>{T('fm')}</h2>
          <form onSubmit={submit} noValidate>
            {FIELDS.map(([id, en, arb, type, req]) => (
              <div key={id}>
                <label htmlFor={id}>{ar ? arb : en}{req ? ' *' : ''}</label>
                {type === 'select'
                  ? <select id={id} required={!!req} aria-invalid={!!errs[id]}><option value="">{T('fs')}</option>{T('fo').map((o) => <option key={o}>{o}</option>)}</select>
                  : <input id={id} type={type} required={!!req} aria-invalid={!!errs[id]} dir={type === 'tel' || type === 'email' ? 'ltr' : undefined} inputMode={type === 'tel' ? 'tel' : undefined} />}
                <span className="er">{errs[id]}</span>
              </div>
            ))}
            <div className="f"><label htmlFor="message">{T('msg')}</label><textarea id="message" rows="4" /></div>
            <div className="f"><label htmlFor="file">{T('up')}</label><input id="file" type="file" style={{ background: 'none', color: '#fff', border: 0, padding: 0 }} /></div>
            <div className="f"><label style={{ fontWeight: 400 }}><input type="checkbox" id="consent" /> {T('cs')} *</label><span className="er">{errs.consent}</span></div>
            <div className="f">
              <button className="btn" type="submit" disabled={sending}>{sending ? T('sending') : T('sb')}</button>{' '}
              <a className="btn o" href={wa} target="_blank" rel="noopener noreferrer">{T('wb')}</a>
              <div id="msg" className={status.type} role="status" aria-live="polite">{status.text}</div>
            </div>
          </form>
        </div></section>

        <section id="contact"><div className="w"><h2>{T('ct')}</h2>
          <p><bdi>{CFG.phone}</bdi><br /><bdi>{CFG.email}</bdi><br />{L(CFG.city)}<br />{T('wh')}: {L(CFG.hours)}<br />{T('ar')}</p>
          {/* TODO: embed Google Map once the office address is confirmed */}
        </div></section>

        <section className="alt"><div className="w"><h2>{T('fq')}</h2>
          {FAQ.map((q, k) => <details key={k}><summary>{L(q)}</summary><p>{ar ? q[3] : q[2]}</p></details>)}
        </div></section>
      </main>

      <footer><div className="w">
        <div className="g">
          <div><a className="logo" href="#top"><Logo /></a><p>{ar ? 'سيسكو للتموين، الخبر، المملكة العربية السعودية.' : 'SISCO Catering, Khobar, Saudi Arabia.'}</p></div>
          <div><h3>{T('sv')}</h3>{SERV.slice(0, 4).map((s, k) => <a key={k} href="#services">{L(s)}</a>)}</div>
          <div><h3>{T('ab')}</h3><a href="#about">{T('ab')}</a><a href="#projects">{L(NAV[5])}</a><a href="#contact">{L(NAV[7])}</a></div>
          <div><h3>{T('ct')}</h3><a href={wa}><bdi>{CFG.phone}</bdi></a><a href={`mailto:${CFG.email}`}><bdi>{CFG.email}</bdi></a>{/* TODO: social links */}</div>
        </div>
        <p style={{ marginTop: 30 }}><a style={bare} href="#">{T('ft')}</a><a style={bare} href="#">{T('ft2')}</a><a style={{ display: 'inline' }} href="#">{T('ft3')}</a></p>
        <p>{T('cr')}</p>
      </div></footer>

      <a className="wa" href={wa} target="_blank" rel="noopener noreferrer" aria-label={T('wb')}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.2 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.3 2.5 1.5.3.1.5.1.7-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.1 1.4z" /></svg>
      </a>
    </>
  )
}
