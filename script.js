/* ═══════════════════════════════════════════════════════════
   NORTHLIGHT ANIMATION STUDIOS – script.js
   Aurora Canvas · Typewriter · Navigation · DE/EN · Reveals
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ───────────────────────────────────────────────
   LANGUAGE SWITCHER
─────────────────────────────────────────────── */
const LangSwitcher = (() => {
  const HTML   = document.documentElement;
  const toggle = document.getElementById('lang-toggle');
  const STOR   = 'nl-lang';

  const TYPEWRITER_WORDS = {
    de: ['Animationen', 'Trailer', 'Machinimas', 'Welten', 'Geschichten'],
    en: ['animations', 'trailers', 'machinimas', 'worlds', 'stories'],
  };

  function getLang() {
    return localStorage.getItem(STOR) || 'de';
  }

  function apply(lang) {
    HTML.setAttribute('lang', lang);
    HTML.setAttribute('data-lang', lang);
    localStorage.setItem(STOR, lang);

    // Show/hide DE elements
    document.querySelectorAll('[data-de]').forEach(el => {
      el.style.display = lang === 'de' ? '' : 'none';
    });
    document.querySelectorAll('[data-en]').forEach(el => {
      el.style.display = lang === 'en' ? '' : 'none';
    });

    // Update newsletter placeholder
    const emailInput = document.getElementById('newsletter-email');
    if (emailInput) {
      emailInput.placeholder = lang === 'de' ? 'deine@email.de' : 'your@email.com';
    }

    // Update typewriter words
    Typewriter.setWords(TYPEWRITER_WORDS[lang] || TYPEWRITER_WORDS.de);
  }

  function init() {
    const lang = getLang();
    apply(lang);

    if (toggle) {
      toggle.addEventListener('click', () => {
        const current = getLang();
        apply(current === 'de' ? 'en' : 'de');
      });
    }
  }

  return { init, getLang };
})();

/* ───────────────────────────────────────────────
   AURORA CANVAS
─────────────────────────────────────────────── */
const AuroraCanvas = (() => {
  let canvas, ctx, W, H, animId;
  let time = 0;

  // Aurora wave parameters
  const WAVES = [
    { color: [0, 102, 255],   alpha: 0.18, speed: 0.0008, amp: 0.22, freq: 1.2, yOff: 0.3 },
    { color: [0, 212, 200],   alpha: 0.15, speed: 0.0006, amp: 0.18, freq: 0.8, yOff: 0.42 },
    { color: [123, 47, 255],  alpha: 0.13, speed: 0.0010, amp: 0.20, freq: 1.5, yOff: 0.25 },
    { color: [0, 255, 136],   alpha: 0.08, speed: 0.0005, amp: 0.12, freq: 2.0, yOff: 0.55 },
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function drawWave(wave, t) {
    const [r, g, b] = wave.color;
    const gradient = ctx.createLinearGradient(0, 0, W, 0);
    gradient.addColorStop(0,   `rgba(${r},${g},${b},0)`);
    gradient.addColorStop(0.3, `rgba(${r},${g},${b},${wave.alpha})`);
    gradient.addColorStop(0.7, `rgba(${r},${g},${b},${wave.alpha * 0.8})`);
    gradient.addColorStop(1,   `rgba(${r},${g},${b},0)`);

    ctx.beginPath();
    ctx.moveTo(0, H);

    const baseY = H * wave.yOff;
    const amplitude = H * wave.amp;

    for (let x = 0; x <= W; x += 4) {
      const progress = x / W;
      const y = baseY
        + Math.sin(progress * Math.PI * wave.freq + t * wave.speed * 1000) * amplitude * 0.5
        + Math.sin(progress * Math.PI * wave.freq * 1.7 + t * wave.speed * 800 + 1) * amplitude * 0.3
        + Math.sin(progress * Math.PI * wave.freq * 0.5 + t * wave.speed * 600 + 2) * amplitude * 0.2;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  function frame(timestamp) {
    time = timestamp;
    ctx.clearRect(0, 0, W, H);

    // Slight star/noise background
    ctx.fillStyle = 'rgba(5, 8, 16, 0.6)';
    ctx.fillRect(0, 0, W, H);

    WAVES.forEach(w => drawWave(w, timestamp));

    // Subtle radial vignette to darken edges
    const vignette = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.7);
    vignette.addColorStop(0,   'rgba(0,0,0,0)');
    vignette.addColorStop(1,   'rgba(0,0,0,0.45)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);

    animId = requestAnimationFrame(frame);
  }

  function init() {
    canvas = document.getElementById('aurora-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Draw a single static frame instead
      drawWave(WAVES[0], 0);
      drawWave(WAVES[1], 0);
      return;
    }

    animId = requestAnimationFrame(frame);
  }

  return { init };
})();

/* ───────────────────────────────────────────────
   PARTICLE SYSTEM
─────────────────────────────────────────────── */
const Particles = (() => {
  const COUNT = 55;
  let container;
  const particles = [];

  function createParticle() {
    const el = document.createElement('span');
    el.style.cssText = `
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      background: rgba(0, 212, 200, 0.6);
      box-shadow: 0 0 6px rgba(0, 212, 200, 0.8);
    `;

    const size  = Math.random() * 2.5 + 0.5;
    const x     = Math.random() * 100;
    const y     = Math.random() * 100;
    const dur   = Math.random() * 18 + 10;
    const delay = Math.random() * 12;
    const drift = (Math.random() - 0.5) * 6;

    el.style.width  = `${size}px`;
    el.style.height = `${size}px`;
    el.style.left   = `${x}%`;
    el.style.top    = `${y}%`;
    el.style.opacity = 0;
    el.style.animation = `particleFloat ${dur}s ${delay}s ease-in-out infinite`;

    // Store drift as custom property
    el.style.setProperty('--drift', `${drift}px`);

    container.appendChild(el);
    particles.push(el);
  }

  function injectStyles() {
    if (document.getElementById('particle-styles')) return;
    const style = document.createElement('style');
    style.id = 'particle-styles';
    style.textContent = `
      @keyframes particleFloat {
        0%   { opacity: 0; transform: translateY(0) translateX(0); }
        15%  { opacity: 0.8; }
        85%  { opacity: 0.5; }
        100% { opacity: 0; transform: translateY(-80px) translateX(var(--drift, 0px)); }
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    container = document.getElementById('particles');
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    injectStyles();
    for (let i = 0; i < COUNT; i++) createParticle();
  }

  return { init };
})();

/* ───────────────────────────────────────────────
   TYPEWRITER
─────────────────────────────────────────────── */
const Typewriter = (() => {
  let words   = ['Animationen', 'Trailer', 'Machinimas', 'Welten', 'Geschichten'];
  let el      = null;
  let idx     = 0;
  let charIdx = 0;
  let deleting = false;
  let timer   = null;

  const SPEED_TYPE   = 80;
  const SPEED_DELETE = 45;
  const PAUSE_WORD   = 1800;
  const PAUSE_EMPTY  = 300;

  function tick() {
    const word = words[idx % words.length];

    if (!deleting) {
      charIdx++;
      el.textContent = word.slice(0, charIdx);
      if (charIdx === word.length) {
        deleting = true;
        timer = setTimeout(tick, PAUSE_WORD);
        return;
      }
      timer = setTimeout(tick, SPEED_TYPE);
    } else {
      charIdx--;
      el.textContent = word.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % words.length;
        timer = setTimeout(tick, PAUSE_EMPTY);
        return;
      }
      timer = setTimeout(tick, SPEED_DELETE);
    }
  }

  function setWords(newWords) {
    words = newWords;
    idx = 0;
    charIdx = 0;
    deleting = false;
    clearTimeout(timer);
    if (el) {
      el.textContent = '';
      timer = setTimeout(tick, 500);
    }
  }

  function init() {
    el = document.getElementById('typewriter-word');
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = words[0];
      return;
    }
    timer = setTimeout(tick, 1200);
  }

  return { init, setWords };
})();

/* ───────────────────────────────────────────────
   STICKY NAVIGATION
─────────────────────────────────────────────── */
const Navigation = (() => {
  let header, hamburger, mobileMenu;
  let isOpen = false;

  function setScrolled() {
    const scrolled = window.scrollY > 30;
    header.classList.toggle('scrolled', scrolled);
  }

  function openMenu() {
    isOpen = true;
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isOpen = false;
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function init() {
    header     = document.getElementById('nav-header');
    hamburger  = document.getElementById('nav-hamburger');
    mobileMenu = document.getElementById('mobile-menu');

    if (!header || !hamburger || !mobileMenu) return;

    // Scroll handler (throttled)
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => { setScrolled(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });
    setScrolled();

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
      isOpen ? closeMenu() : openMenu();
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });

    // Close on outside click
    mobileMenu.addEventListener('click', e => {
      if (e.target === mobileMenu) closeMenu();
    });
  }

  return { init };
})();

/* ───────────────────────────────────────────────
   SCROLL REVEAL
─────────────────────────────────────────────── */
const ScrollReveal = (() => {
  function init() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    els.forEach(el => observer.observe(el));
  }

  return { init };
})();

/* ───────────────────────────────────────────────
   STAT COUNTER ANIMATION
─────────────────────────────────────────────── */
const StatCounter = (() => {
  function animateCount(el, target, duration = 1600) {
    const start = performance.now();
    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  function init() {
    const counters = document.querySelectorAll('.stat-item__number[data-count]');
    if (!counters.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      counters.forEach(el => { el.textContent = el.dataset.count; });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count, 10);
          animateCount(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  return { init };
})();

/* ───────────────────────────────────────────────
   COOKIE BANNER
─────────────────────────────────────────────── */
const CookieBanner = (() => {
  const KEY = 'nl-cookie-consent';

  function init() {
    const banner  = document.getElementById('cookie-banner');
    const accept  = document.getElementById('cookie-accept');
    const decline = document.getElementById('cookie-decline');

    if (!banner) return;
    if (localStorage.getItem(KEY)) return; // Already decided

    // Show after short delay
    setTimeout(() => banner.classList.add('is-visible'), 1500);

    if (accept) {
      accept.addEventListener('click', () => {
        localStorage.setItem(KEY, 'accepted');
        banner.classList.remove('is-visible');
        // TODO: Load analytics here after consent
        // Analytics.init();
      });
    }

    if (decline) {
      decline.addEventListener('click', () => {
        localStorage.setItem(KEY, 'declined');
        banner.classList.remove('is-visible');
      });
    }
  }

  function hasConsent() {
    return localStorage.getItem(KEY) === 'accepted';
  }

  return { init, hasConsent };
})();

/* ───────────────────────────────────────────────
   NEWSLETTER FORM
─────────────────────────────────────────────── */
const NewsletterForm = (() => {
  function init() {
    const form    = document.getElementById('newsletter-form');
    const message = document.getElementById('newsletter-message');
    if (!form || !message) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const lang     = LangSwitcher.getLang();
      const emailEl  = form.querySelector('#newsletter-email');
      const consent  = form.querySelector('#newsletter-consent');
      const honey    = form.querySelector('[name="_honey"]');

      // Honeypot check
      if (honey && honey.value) return;

      // Validation
      if (!emailEl.value || !emailEl.validity.valid) {
        message.className = 'newsletter-form__message error';
        message.textContent = lang === 'de'
          ? 'Bitte gib eine gültige E-Mail-Adresse ein.'
          : 'Please enter a valid email address.';
        return;
      }

      if (!consent.checked) {
        message.className = 'newsletter-form__message error';
        message.textContent = lang === 'de'
          ? 'Bitte stimme der Datenschutzerklärung zu.'
          : 'Please agree to the Privacy Policy.';
        return;
      }

      // Show loading state
      const btn = form.querySelector('.newsletter-form__btn');
      const originalText = btn.textContent;
      btn.textContent = lang === 'de' ? 'Wird gesendet…' : 'Sending…';
      btn.disabled = true;
      message.textContent = '';

      // NOTE: Replace ACTION_URL below with your actual form endpoint
      // Recommended: Web3Forms (https://web3forms.com) or Brevo API
      const ACTION_URL = 'https://api.web3forms.com/submit';

      try {
        const data = new FormData();
        data.append('access_key', 'YOUR_WEB3FORMS_KEY'); // ← Replace this
        data.append('email', emailEl.value);
        data.append('subject', 'Northlight Newsletter Anmeldung');
        data.append('from_name', 'Northlight Website');

        const res = await fetch(ACTION_URL, { method: 'POST', body: data });
        const json = await res.json();

        if (json.success) {
          message.className = 'newsletter-form__message success';
          message.textContent = lang === 'de'
            ? '✓ Danke! Bitte bestätige deine E-Mail.'
            : '✓ Thank you! Please confirm your email.';
          form.reset();
        } else {
          throw new Error('Server error');
        }
      } catch {
        message.className = 'newsletter-form__message error';
        message.textContent = lang === 'de'
          ? 'Fehler beim Senden. Bitte versuche es später erneut.'
          : 'Error sending. Please try again later.';
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }

  return { init };
})();

/* ───────────────────────────────────────────────
   FOOTER YEAR
─────────────────────────────────────────────── */
function setFooterYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll('#footer-year, #footer-year-en').forEach(el => {
    if (el) el.textContent = year;
  });
}

/* ───────────────────────────────────────────────
   SMOOTH ANCHOR SCROLL (hero scroll indicator)
─────────────────────────────────────────────── */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ───────────────────────────────────────────────
   INIT – DOM READY
─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  LangSwitcher.init();
  AuroraCanvas.init();
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
