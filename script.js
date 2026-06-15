'use strict';

/* ── LANG ── */
const LangSwitcher=(() => {
  const HTML=document.documentElement,toggle=document.getElementById('lang-toggle'),STOR='nl-lang';
  const TW={de:['Animationen','Trailer','Machinimas','Welten','Geschichten'],en:['animations','trailers','machinimas','worlds','stories']};
  function getLang(){return localStorage.getItem(STOR)||'de'}
  function apply(lang){
    HTML.setAttribute('lang',lang);HTML.setAttribute('data-lang',lang);localStorage.setItem(STOR,lang);
    document.querySelectorAll('[data-de]').forEach(el=>{el.style.display=lang==='de'?'':'none'});
    document.querySelectorAll('[data-en]').forEach(el=>{el.style.display=lang==='en'?'':'none'});
    const inp=document.getElementById('newsletter-email');if(inp)inp.placeholder=lang==='de'?'deine@email.de':'your@email.com';
    if(typeof Typewriter!=='undefined')Typewriter.setWords(TW[lang]||TW.de);
  }
  function init(){apply(getLang());if(toggle)toggle.addEventListener('click',()=>apply(getLang()==='de'?'en':'de'));}
  return{init,getLang};
})();

/* ── STARS ── */
const StarField=(() => {
  function init(){
    const hero=document.querySelector('.hero');if(!hero)return;
    if(window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    const s=document.createElement('style');
    s.textContent='.star{position:absolute;border-radius:50%;pointer-events:none;background:rgba(255,255,255,0.85);animation:starTwinkle var(--dur) var(--delay) ease-in-out infinite alternate}@keyframes starTwinkle{0%{opacity:var(--a);transform:scale(0.8)}100%{opacity:var(--b);transform:scale(1.3)}}';
    document.head.appendChild(s);
    const f=document.createDocumentFragment();
    for(let i=0;i<100;i++){
      const el=document.createElement('div');el.className='star';
      const sz=Math.random()*1.6+0.4,a=(Math.random()*0.15+0.04).toFixed(2),b=(parseFloat(a)+Math.random()*0.45+0.1).toFixed(2);
      el.style.cssText=`width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${Math.random()*100}%;--dur:${(Math.random()*5+3).toFixed(1)}s;--delay:${(Math.random()*8).toFixed(1)}s;--a:${a};--b:${b}`;
      f.appendChild(el);
    }
    hero.insertBefore(f,hero.querySelector('.hero__content'));
  }
  return{init};
})();

/* ── PARTICLES ── */
const Particles=(() => {
  function init(){
    const hero=document.querySelector('.hero');if(!hero)return;
    if(window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    const s=document.createElement('style');
    s.textContent='.particle{position:absolute;border-radius:50%;pointer-events:none;animation:pf var(--dur) var(--delay) ease-in-out infinite}@keyframes pf{0%{opacity:0;transform:translateY(0) scale(.5)}15%{opacity:var(--a)}85%{opacity:calc(var(--a)*.5)}100%{opacity:0;transform:translateY(-80px) translateX(var(--dx)) scale(1)}}';
    document.head.appendChild(s);
    const colors=[[0,212,180],[0,160,220],[26,111,255],[139,53,255],[0,255,136]];
    const f=document.createDocumentFragment();
    for(let i=0;i<35;i++){
      const el=document.createElement('div');el.className='particle';
      const[r,g,b]=colors[i%colors.length],sz=Math.random()*2.5+1,a=(Math.random()*.4+.25).toFixed(2);
      el.style.cssText=`width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${Math.random()*100}%;background:rgba(${r},${g},${b},.85);box-shadow:0 0 ${sz*3}px rgba(${r},${g},${b},.8);--dur:${(Math.random()*14+9).toFixed(1)}s;--delay:${(Math.random()*12).toFixed(1)}s;--a:${a};--dx:${((Math.random()-.5)*14).toFixed(1)}px`;
      f.appendChild(el);
    }
    hero.insertBefore(f,hero.querySelector('.hero__content'));
  }
  return{init};
})();

/* ── TYPEWRITER ── */
const Typewriter=(() => {
  let words=['Animationen','Trailer','Machinimas','Welten','Geschichten'],el=null,idx=0,ci=0,del=false,t=null;
  function tick(){
    const w=words[idx%words.length];
    if(!del){ci++;el.textContent=w.slice(0,ci);if(ci===w.length){del=true;t=setTimeout(tick,2000);return}t=setTimeout(tick,90);}
    else{ci--;el.textContent=w.slice(0,ci);if(ci===0){del=false;idx=(idx+1)%words.length;t=setTimeout(tick,300);return}t=setTimeout(tick,50);}
  }
  function setWords(w){words=w;idx=0;ci=0;del=false;clearTimeout(t);if(el){el.textContent='';t=setTimeout(tick,400);}}
  function init(){el=document.getElementById('typewriter-word');if(!el)return;if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){el.textContent=words[0];return}t=setTimeout(tick,1500);}
  return{init,setWords};
})();

/* ── NAV ── */
const Navigation=(() => {
  let hdr,ham,mob,open=false;
  function scrolled(){hdr.classList.toggle('scrolled',window.scrollY>20)}
  function o(){open=true;ham.setAttribute('aria-expanded','true');mob.classList.add('is-open');mob.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
  function c(){open=false;ham.setAttribute('aria-expanded','false');mob.classList.remove('is-open');mob.setAttribute('aria-hidden','true');document.body.style.overflow=''}
  function init(){
    hdr=document.getElementById('nav-header');ham=document.getElementById('nav-hamburger');mob=document.getElementById('mobile-menu');
    if(!hdr||!ham||!mob)return;
    let tk=false;window.addEventListener('scroll',()=>{if(!tk){requestAnimationFrame(()=>{scrolled();tk=false;});tk=true;}},{passive:true});
    scrolled();ham.addEventListener('click',()=>open?c():o());
    mob.querySelectorAll('.mobile-menu__link').forEach(l=>l.addEventListener('click',c));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&open)c()});
  }
  return{init};
})();

/* ── REVEAL ── */
const Reveal=(() => {
  function init(){
    const els=document.querySelectorAll('[data-reveal]');if(!els.length)return;
    if(!('IntersectionObserver'in window)){els.forEach(e=>e.classList.add('is-visible'));return}
    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target)}})},{threshold:0.1});
    els.forEach(e=>obs.observe(e));
  }
  return{init};
})();

/* ── STATS ── */
const Stats=(() => {
  function anim(el,target,dur=1600){
    const s=performance.now();
    (function u(now){const p=Math.min((now-s)/dur,1),e=1-Math.pow(1-p,4);el.textContent=Math.floor(e*target);if(p<1)requestAnimationFrame(u);else el.textContent=target;})(s);
  }
  function init(){
    const els=document.querySelectorAll('.stat__num[data-count]');if(!els.length)return;
    if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){els.forEach(e=>e.textContent=e.dataset.count);return}
    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){anim(e.target,parseInt(e.target.dataset.count));obs.unobserve(e.target)}})},{threshold:.5});
    els.forEach(e=>obs.observe(e));
  }
  return{init};
})();

/* ── COOKIE ── */
const Cookie=(() => {
  const K='nl-cookie';
  function init(){
    const b=document.getElementById('cookie-banner'),ac=document.getElementById('cookie-accept'),dc=document.getElementById('cookie-decline');
    if(!b||localStorage.getItem(K))return;
    setTimeout(()=>b.classList.add('is-visible'),1800);
    if(ac)ac.addEventListener('click',()=>{localStorage.setItem(K,'ok');b.classList.remove('is-visible')});
    if(dc)dc.addEventListener('click',()=>{localStorage.setItem(K,'no');b.classList.remove('is-visible')});
  }
  return{init};
})();

/* ── FORMS (Contact + Join) ── */
async function handleForm(formId,msgId){
  const form=document.getElementById(formId),msg=document.getElementById(msgId);if(!form||!msg)return;
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const lang=LangSwitcher.getLang();
    const honey=form.querySelector('[name="_honey"]');if(honey&&honey.value)return;
    const btn=form.querySelector('[type="submit"]');const orig=btn.textContent;
    btn.textContent=lang==='de'?'Wird gesendet…':'Sending…';btn.disabled=true;msg.textContent='';
    try{
      const data=new FormData();
      data.append('access_key','YOUR_WEB3FORMS_KEY'); // ← web3forms.com
      form.querySelectorAll('input:not([type=checkbox]):not([name=_honey]),textarea,select').forEach(el=>{if(el.name)data.append(el.name,el.value)});
      const res=await fetch('https://api.web3forms.com/submit',{method:'POST',body:data});
      const json=await res.json();
      if(json.success){msg.className='form-msg ok';msg.textContent=lang==='de'?'✓ Nachricht gesendet. Wir melden uns bald.':'✓ Message sent. We will get back to you soon.';form.reset();}
      else throw new Error();
    }catch{msg.className='form-msg err';msg.textContent=lang==='de'?'Fehler. Bitte versuche es später.':'Error. Please try again later.';}
    finally{btn.textContent=orig;btn.disabled=false;}
  });
}

/* ── NEWSLETTER ── */
const Newsletter=(() => {
  function init(){
    const form=document.getElementById('newsletter-form'),msg=document.getElementById('newsletter-msg');if(!form||!msg)return;
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const lang=LangSwitcher.getLang(),emailEl=document.getElementById('newsletter-email'),consent=form.querySelector('[name="consent"]'),honey=form.querySelector('[name="_honey"]');
      if(honey&&honey.value)return;
      if(!emailEl.validity.valid){msg.className='newsletter-form__msg err';msg.textContent=lang==='de'?'Bitte gültige E-Mail eingeben.':'Please enter a valid email.';return}
      if(consent&&!consent.checked){msg.className='newsletter-form__msg err';msg.textContent=lang==='de'?'Bitte Datenschutz zustimmen.':'Please agree to Privacy Policy.';return}
      const btn=form.querySelector('.newsletter-form__btn');const orig=btn.textContent;btn.textContent='…';btn.disabled=true;
      try{
        const data=new FormData();data.append('access_key','YOUR_WEB3FORMS_KEY');data.append('email',emailEl.value);data.append('subject','Newsletter Anmeldung – Northlight');
        const res=await fetch('https://api.web3forms.com/submit',{method:'POST',body:data});const json=await res.json();
        if(json.success){msg.className='newsletter-form__msg ok';msg.textContent=lang==='de'?'✓ Danke! Bitte E-Mail bestätigen.':'✓ Thank you! Please confirm your email.';form.reset();}
        else throw new Error();
      }catch{msg.className='newsletter-form__msg err';msg.textContent=lang==='de'?'Fehler. Bitte später versuchen.':'Error. Please try again.';}
      finally{btn.textContent=orig;btn.disabled=false;}
    });
  }
  return{init};
})();

/* ── FILTER (Projects) ── */
function initFilter(){
  const btns=document.querySelectorAll('.filter-btn'),cards=document.querySelectorAll('.project-card[data-category]');
  if(!btns.length)return;
  btns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      btns.forEach(b=>b.classList.remove('active'));btn.classList.add('active');
      const f=btn.dataset.filter;
      cards.forEach(c=>{c.style.display=(f==='all'||c.dataset.category===f)?'':'none'});
    });
  });
}

/* ── FOOTER YEAR ── */
function setYear(){document.querySelectorAll('#footer-year').forEach(el=>{if(el)el.textContent=new Date().getFullYear()})}

/* ── SMOOTH ANCHORS ── */
function smoothAnchors(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{const t=document.getElementById(a.getAttribute('href').slice(1));if(!t)return;e.preventDefault();t.scrollIntoView({behavior:'smooth'})});
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded',()=>{
  LangSwitcher.init();
  StarField.init();
  Particles.init();
  Typewriter.init();
  Navigation.init();
  Reveal.init();
  Stats.init();
  Cookie.init();
  Newsletter.init();
  handleForm('contact-form','contact-msg');
  handleForm('join-form','join-msg');
  initFilter();
  setYear();
  smoothAnchors();
});
