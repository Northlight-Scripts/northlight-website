/* ═══════════════════════════════════════════════════════════
   NORTHLIGHT ANIMATION STUDIOS – script.js v2
   Cinematic Aurora · Stars · Typewriter · Nav · DE/EN
   ═══════════════════════════════════════════════════════════ */
'use strict';

/* ── LANGUAGE SWITCHER ───────────────────────────────────── */
const LangSwitcher = (() => {
  const HTML   = document.documentElement;
  const toggle = document.getElementById('lang-toggle');
  const STOR   = 'nl-lang';

  const TW_WORDS = {
    de: ['Animationen', 'Trailer', 'Machinimas', 'Welten', 'Geschichten'],
    en: ['animations', 'trailers', 'machinimas', 'worlds', 'stories'],
  };

  function getLang() { return localStorage.getItem(STOR) || 'de'; }

  function apply(lang) {
    HTML.setAttribute('lang', lang);
    HTML.setAttribute('data-lang', lang);
    localStorage.setItem(STOR, lang);
    document.querySelectorAll('[data-de]').forEach(el => { el.style.display = lang==='de' ? '' : 'none'; });
    document.querySelectorAll('[data-en]').forEach(el => { el.style.display = lang==='en' ? '' : 'none'; });
    const inp = document.getElementById('newsletter-email');
    if (inp) inp.placeholder = lang==='de' ? 'deine@email.de' : 'your@email.com';
    Typewriter.setWords(TW_WORDS[lang] || TW_WORDS.de);
  }

  function init() {
    apply(getLang());
    if (toggle) toggle.addEventListener('click', () => apply(getLang()==='de' ? 'en' : 'de'));
  }

  return { init, getLang };
})();

/* ── AURORA CANVAS (Cinematic Multi-layer) ───────────────── */
const AuroraCanvas = (() => {
  let canvas, ctx, W, H, animId;

  // Each band: hue shift range, base y%, height%, speed, opacity
  const BANDS = [
    { r:0,   g:102, b:255, baseY:0.28, h:0.22, speed:0.00045, phase:0,    alpha:0.22, wobble:1.2 },
    { r:0,   g:229, b:212, baseY:0.38, h:0.18, speed:0.00035, phase:1.5,  alpha:0.28, wobble:0.8 },
    { r:139, g:53,  b:255, baseY:0.22, h:0.20, speed:0.00055, phase:3.1,  alpha:0.16, wobble:1.5 },
    { r:0,   g:180, b:140, baseY:0.48, h:0.12, speed:0.00028, phase:4.7,  alpha:0.12, wobble:2.0 },
    { r:26,  g:111, b:255, baseY:0.15, h:0.14, speed:0.00065, phase:2.0,  alpha:0.10, wobble:0.6 },
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function drawBand(b, t) {
    const { r, g, blue: bv = b.b, baseY, h, speed, phase, alpha, wobble } = b;
    const blue = b.b;

    // Build a wavy path
    ctx.beginPath();
    ctx.moveTo(0, H);

    const steps = Math.ceil(W / 3);
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * W;
      const px = i / steps;

      const y = H * baseY
        + Math.sin(px * Math.PI * wobble       + t * speed * 1000 + phase)       * H * h * 0.45
        + Math.sin(px * Math.PI * wobble * 1.8 + t * speed * 700  + phase + 1.1) * H * h * 0.30
        + Math.sin(px * Math.PI * wobble * 0.5 + t * speed * 500  + phase + 2.3) * H * h * 0.25;

      ctx.lineTo(x, y);
    }

    ctx.lineTo(W, H);
    ctx.closePath();

    // Gradient: fade left and right, peak alpha in middle
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0,    `rgba(${r},${g},${blue},0)`);
    grad.addColorStop(0.12, `rgba(${r},${g},${blue},${alpha * 0.6})`);
    grad.addColorStop(0.4,  `rgba(${r},${g},${blue},${alpha})`);
    grad.addColorStop(0.6,  `rgba(${r},${g},${blue},${alpha})`);
    grad.addColorStop(0.88, `rgba(${r},${g},${blue},${alpha * 0.6})`);
    grad.addColorStop(1,    `rgba(${r},${g},${blue},0)`);

    ctx.fillStyle = grad;
    ctx.fill();

    // Top edge glow line
    ctx.beginPath();
    ctx.moveTo(0, H);
    const stepsG = Math.ceil(W / 6);
    for (let i = 0; i <= stepsG; i++) {
      const x = (i / stepsG) * W;
      const px = i / stepsG;
      const y = H * baseY
        + Math.sin(px * Math.PI * wobble       + t * speed * 1000 + phase)       * H * h * 0.45
        + Math.sin(px * Math.PI * wobble * 1.8 + t * speed * 700  + phase + 1.1) * H * h * 0.30
        + Math.sin(px * Math.PI * wobble * 0.5 + t * speed * 500  + phase + 2.3) * H * h * 0.25;
      ctx.lineTo(x, y);
    }

    const glowGrad = ctx.createLinearGradient(0, 0, W, 0);
    glowGrad.addColorStop(0,    `rgba(${r},${g},${blue},0)`);
    glowGrad.addColorStop(0.2,  `rgba(${r},${g},${blue},${alpha * 1.5})`);
    glowGrad.addColorStop(0.5,  `rgba(${r},${g},${blue},${alpha * 2})`);
    glowGrad.addColorStop(0.8,  `rgba(${r},${g},${blue},${alpha * 1.5})`);
    glowGrad.addColorStop(1,    `rgba(${r},${g},${blue},0)`);

    ctx.strokeStyle = glowGrad;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function frame(ts) {
    ctx.clearRect(0, 0, W, H);

    // Deep space background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0,   '#010308');
    bg.addColorStop(0.4, '#04091a');
    bg.addColorStop(1,   '#020510');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Draw all aurora bands (back to front)
    BANDS.forEach(b => drawBand(b, ts));

    // Vignette overlay
    const vig = ctx.createRadialGradient(W/2, H*0.4, 0, W/2, H*0.4, Math.max(W,H)*0.8);
    vig.addColorStop(0,   'rgba(0,0,0,0)');
    vig.addColorStop(0.7, 'rgba(0,0,0,0)');
    vig.addColorStop(1,   'rgba(1,3,8,0.7)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    animId = requestAnimationFrame(frame);
  }

  function init() {
    canvas = document.getElementById('aurora-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    new ResizeObserver(resize).observe(canvas);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      BANDS.slice(0,2).forEach(b => drawBand(b, 0));
      return;
    }
    animId = requestAnimationFrame(frame);
  }

  return { init };
})();

/* ── STAR FIELD ──────────────────────────────────────────── */
const StarField = (() => {
  const STAR_COUNT = 120;

  function init() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const style = document.createElement('style');
    style.textContent = `
      .star {
        position: absolute; border-radius: 50%; pointer-events: none;
        background: rgba(255,255,255,0.9);
        animation: starTwinkle var(--dur) var(--delay) ease-in-out infinite alternate;
      }
      @keyframes starTwinkle {
        0%   { opacity: var(--min-op); transform: scale(0.8); }
        100% { opacity: var(--max-op); transform: scale(1.2); }
      }
    `;
    document.head.appendChild(style);

    const frag = document.createDocumentFragment();
    for (let i = 0; i < STAR_COUNT; i++) {
      const el = document.createElement('div');
      el.className = 'star';
      const size = Math.random() * 1.8 + 0.4;
      const minOp = (Math.random() * 0.2 + 0.05).toFixed(2);
      const maxOp = (parseFloat(minOp) + Math.random() * 0.5 + 0.1).toFixed(2);
      el.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random()*100}%; top:${Math.random()*100}%;
        --dur:${(Math.random()*5+3).toFixed(1)}s;
        --delay:${(Math.random()*8).toFixed(1)}s;
        --min-op:${minOp}; --max-op:${maxOp};
        box-shadow: 0 0 ${size*2}px rgba(255,255,255,0.5);
      `;
      frag.appendChild(el);
    }

    // Insert into hero before particles
    const particles = document.getElementById('particles');
    if (particles) hero.insertBefore(frag, particles);
    else hero.appendChild(frag);
  }

  return { init };
})();

/* ── PARTICLES ───────────────────────────────────────────── */
const Particles = (() => {
  const COUNT = 40;

  function init() {
    const container = document.getElementById('particles');
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const style = document.createElement('style');
    style.textContent = `
      .particle {
        position: absolute; border-radius: 50%; pointer-events: none;
        animation: pFloat var(--dur) var(--delay) ease-in-out infinite;
      }
      @keyframes pFloat {
        0%   { opacity:0; transform: translateY(0) translateX(0) scale(0.5); }
        15%  { opacity: var(--alpha); }
        85%  { opacity: calc(var(--alpha) * 0.6); }
        100% { opacity:0; transform: translateY(-90px) translateX(var(--dx)) scale(1); }
      }
    `;
    document.head.appendChild(style);

    const frag = document.createDocumentFragment();
    const colors = [
      [0,229,212], [0,180,220], [26,111,255], [139,53,255], [0,255,136]
    ];

    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('div');
      el.className = 'particle';
      const [r,g,b] = colors[i % colors.length];
      const size  = Math.random() * 3 + 1;
      const alpha = (Math.random() * 0.5 + 0.3).toFixed(2);
      el.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        background: rgba(${r},${g},${b},0.85);
        box-shadow: 0 0 ${size*3}px rgba(${r},${g},${b},0.8);
        --dur:${(Math.random()*16+10).toFixed(1)}s;
        --delay:${(Math.random()*14).toFixed(1)}s;
        --alpha:${alpha};
        --dx:${((Math.random()-0.5)*16).toFixed(1)}px;
      `;
      frag.appendChild(el);
    }
    container.appendChild(frag);
  }

  return { init };
})();

/* ── TYPEWRITER ──────────────────────────────────────────── */
const Typewriter = (() => {
  let words   = ['Animationen','Trailer','Machinimas','Welten','Geschichten'];
  let el      = null;
  let idx=0, charIdx=0, deleting=false, timer=null;

  function tick() {
    const word = words[idx % words.length];
    if (!deleting) {
      charIdx++;
      el.textContent = word.slice(0, charIdx);
      if (charIdx === word.length) { deleting=true; timer=setTimeout(tick, 2000); return; }
      timer = setTimeout(tick, 90);
    } else {
      charIdx--;
      el.textContent = word.slice(0, charIdx);
      if (charIdx === 0) { deleting=false; idx=(idx+1)%words.length; timer=setTimeout(tick, 300); return; }
      timer = setTimeout(tick, 50);
    }
  }

  function setWords(w) {
    words=w; idx=0; charIdx=0; deleting=false;
    clearTimeout(timer);
    if (el) { el.textContent=''; timer=setTimeout(tick, 400); }
  }

  function init() {
    el = document.getElementById('typewriter-word');
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent=words[0]; return; }
    timer = setTimeout(tick, 1500);
  }

  return { init, setWords };
})();

/* ── NAVIGATION ──────────────────────────────────────────── */
const Navigation = (() => {
  let header, hamburger, mobileMenu, isOpen=false;

  function setScrolled() { header.classList.toggle('scrolled', window.scrollY>20); }

  function open()  {
    isOpen=true;
    hamburger.setAttribute('aria-expanded','true');
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }
  function close() {
    isOpen=false;
    hamburger.setAttribute('aria-expanded','false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }

  function init() {
    header     = document.getElementById('nav-header');
    hamburger  = document.getElementById('nav-hamburger');
    mobileMenu = document.getElementById('mobile-menu');
    if (!header||!hamburger||!mobileMenu) return;

    let ticking=false;
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(()=>{setScrolled();ticking=false;}); ticking=true; }
    }, {passive:true});
    setScrolled();

    hamburger.addEventListener('click', () => isOpen ? close() : open());
    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(l => l.addEventListener('click', close));
    document.addEventListener('keydown', e => { if(e.key==='Escape'&&isOpen) close(); });
  }

  return { init };
})();

/* ── SCROLL REVEAL ───────────────────────────────────────── */
const ScrollReveal = (() => {
  function init() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(e=>e.classList.add('is-visible')); return; }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('is-visible'); obs.unobserve(e.target); } });
    }, {threshold:0.12});
    els.forEach(e => obs.observe(e));
  }
  return { init };
})();

/* ── STAT COUNTERS ───────────────────────────────────────── */
const StatCounter = (() => {
  function animateCount(el, target, dur=1800) {
    const start = performance.now();
    (function update(now) {
      const p = Math.min((now-start)/dur, 1);
      const e = 1 - Math.pow(1-p, 4);
      el.textContent = Math.floor(e*target);
      if (p<1) requestAnimationFrame(update);
      else el.textContent = target;
    })(start);
  }
  function init() {
    const counters = document.querySelectorAll('.stat-item__number[data-count]');
    if (!counters.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      counters.forEach(el => { el.textContent=el.dataset.count; }); return;
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting){ animateCount(e.target, parseInt(e.target.dataset.count,10)); obs.unobserve(e.target); } });
    }, {threshold:0.5});
    counters.forEach(el => obs.observe(el));
  }
  return { init };
})();

/* ── COOKIE BANNER ───────────────────────────────────────── */
const CookieBanner = (() => {
  const KEY = 'nl-cookie-consent';
  function init() {
    const banner  = document.getElementById('cookie-banner');
    const accept  = document.getElementById('cookie-accept');
    const decline = document.getElementById('cookie-decline');
    if (!banner || localStorage.getItem(KEY)) return;
    setTimeout(() => banner.classList.add('is-visible'), 1800);
    if (accept)  accept.addEventListener('click',  () => { localStorage.setItem(KEY,'accepted'); banner.classList.remove('is-visible'); });
    if (decline) decline.addEventListener('click', () => { localStorage.setItem(KEY,'declined'); banner.classList.remove('is-visible'); });
  }
  function hasConsent() { return localStorage.getItem(KEY)==='accepted'; }
  return { init, hasConsent };
})();

/* ── NEWSLETTER FORM ─────────────────────────────────────── */
const NewsletterForm = (() => {
  function init() {
    const form    = document.getElementById('newsletter-form');
    const message = document.getElementById('newsletter-message');
    if (!form||!message) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const lang    = LangSwitcher.getLang();
      const emailEl = form.querySelector('#newsletter-email');
      const consent = form.querySelector('#newsletter-consent');
      const honey   = form.querySelector('[name="_honey"]');

      if (honey&&honey.value) return;

      if (!emailEl.value||!emailEl.validity.valid) {
        message.className='newsletter-form__message error';
        message.textContent = lang==='de' ? 'Bitte gib eine gültige E-Mail-Adresse ein.' : 'Please enter a valid email address.';
        return;
      }
      if (!consent.checked) {
        message.className='newsletter-form__message error';
        message.textContent = lang==='de' ? 'Bitte stimme der Datenschutzerklärung zu.' : 'Please agree to the Privacy Policy.';
        return;
      }

      const btn = form.querySelector('.newsletter-form__btn');
      const orig = btn.textContent;
      btn.textContent = lang==='de' ? 'Wird gesendet…' : 'Sending…';
      btn.disabled = true;
      message.textContent = '';

      try {
        const data = new FormData();
        data.append('access_key', 'YOUR_WEB3FORMS_KEY'); // ← Replace with your key from web3forms.com
        data.append('email', emailEl.value);
        data.append('subject', 'Northlight Newsletter');
        const res  = await fetch('https://api.web3forms.com/submit', {method:'POST', body:data});
        const json = await res.json();
        if (json.success) {
          message.className='newsletter-form__message success';
          message.textContent = lang==='de' ? '✓ Danke! Bitte bestätige deine E-Mail.' : '✓ Thank you! Please confirm your email.';
          form.reset();
        } else throw new Error();
      } catch {
        message.className='newsletter-form__message error';
        message.textContent = lang==='de' ? 'Fehler beim Senden. Bitte später versuchen.' : 'Error sending. Please try again.';
      } finally {
        btn.textContent = orig;
        btn.disabled = false;
      }
    });
  }
  return { init };
})();

/* ── FOOTER YEAR & ANCHORS ───────────────────────────────── */
function setFooterYear() {
  const y = new Date().getFullYear();
  document.querySelectorAll('#footer-year,#footer-year-en').forEach(el => { if(el) el.textContent=y; });
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  LangSwitcher.init();
  AuroraCanvas.init();
  StarField.init();
  Particles.init();
  Typewriter.init();
  Navigation.init();
  ScrollReveal.init();
  StatCounter.init();
  CookieBanner.init();
  NewsletterForm.init();
  setFooterYear();
  initSmoothAnchors();
});
