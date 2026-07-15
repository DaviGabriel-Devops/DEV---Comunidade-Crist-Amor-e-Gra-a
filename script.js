/* ══════════════════════════════════════════════
   COMUNIDADE CRISTÃ AMOR E GRAÇA — script.js
   ══════════════════════════════════════════════ */

/* ── 1. REVEAL ON SCROLL ── */
const revealEls = document.querySelectorAll(
  '.reveal, #heroTitle, #heroSub, #heroActions'
);
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.18 });
revealEls.forEach(el => io.observe(el));

/* Revela hero imediatamente */
requestAnimationFrame(() => {
  document.getElementById('heroTitle').classList.add('in-view');
  document.getElementById('heroSub').classList.add('in-view');
  document.getElementById('heroActions').classList.add('in-view');
  const hp = document.getElementById('heroPhoto');
  if (hp) hp.classList.add('in-view');
});

/* ── 2. NAVBAR — scroll + active + mobile ── */
const floatNav  = document.getElementById('floatNav');
const navLinks  = document.querySelectorAll('#navLinks a');
const sections  = ['hero','manifesto','programas','aovivo','instagram','comunidade']
                  .map(id => document.getElementById(id));
const burger    = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

/* Hamburguer */
burger.addEventListener('click', () => {
  const isOpen = burger.classList.toggle('open');
  mobileMenu.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* Fecha menu ao clicar num link */
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ── 3. PARALLAX IMAGE BANDS ── */
const mobilePerformanceMode = window.matchMedia('(max-width: 860px), (prefers-reduced-motion: reduce)');
const parallaxLayers = document.querySelectorAll('[data-parallax] .layer');

function drawParallax() {
  if (mobilePerformanceMode.matches) return;
  parallaxLayers.forEach(el => {
    const band  = el.closest('.image-band');
    const rect  = band.getBoundingClientRect();
    const speed = parseFloat(el.dataset.speed || 0.15);
    const shift = (rect.top - window.innerHeight / 2) * speed;
    el.style.transform = `translateY(${shift}px)`;
  });
}

/* ── 4. LIGHT RAYS ── */
function buildRays(el, count) {
  if (!el || el.childElementCount) return;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.style.left    = (6 + Math.random() * 88) + '%';
    s.style.opacity = (0.15 + Math.random() * 0.35).toFixed(2);
    s.style.transform = `rotate(${(Math.random() * 10 - 5).toFixed(1)}deg)`;
    el.appendChild(s);
  }
}
if (!mobilePerformanceMode.matches) {
  buildRays(document.getElementById('rays1'), 10);
  buildRays(document.getElementById('rays2'), 10);
}

/* ── 5. INSTAGRAM — rail horizontal por scroll vertical ── */
const instaPin   = document.getElementById('instaPin');
const instaTrack = document.getElementById('instaTrack');
const instaBar   = document.getElementById('instaProgressBar');

function sizeInstaPin() {
  if (!instaPin || !instaTrack) return;
  const trackW  = instaTrack.scrollWidth;
  const viewW   = window.innerWidth;
  const travel  = Math.max(0, trackW - viewW + (viewW * 0.08));
  instaPin.style.height   = (window.innerHeight + travel) + 'px';
  instaPin.dataset.travel = travel;
}

function driveInstaRail() {
  if (!instaPin || !instaTrack) return;
  const rect    = instaPin.getBoundingClientRect();
  const travel  = parseFloat(instaPin.dataset.travel || 0);
  if (travel <= 0) return;
  const scrolled = -rect.top;
  const progress = Math.max(0, Math.min(1, scrolled / travel));
  instaTrack.style.transform = `translateX(-${progress * travel}px)`;
  if (instaBar) instaBar.style.transform = `scaleX(${progress})`;
}

/* No toque, o trilho é conduzido pelo scroll vertical. Disputar touchmove
   com o navegador gera engasgos, especialmente no Safari/iOS. */
(function initInstaTouch() {
  if (!instaTrack || mobilePerformanceMode.matches) return;
  let isDown = false, startX = 0, scrollLeft = 0;

  instaTrack.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - instaTrack.offsetLeft;
    scrollLeft = parseFloat(instaTrack.style.transform.replace(/[^-\d.]/g, '') || 0);
  });
  instaTrack.addEventListener('mouseleave', () => isDown = false);
  instaTrack.addEventListener('mouseup',    () => isDown = false);
  instaTrack.addEventListener('mousemove',  e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - instaTrack.offsetLeft;
    instaTrack.style.transform = `translateX(${scrollLeft + (x - startX) * 1.5}px)`;
  });

})();

sizeInstaPin();

/* ── 6. RIBBON SVG ── */
const svgEl     = document.getElementById('ribbonSvg');
const glowPath  = document.getElementById('ribbon-glow');
const lineA     = document.getElementById('ribbon-line-a');
const lineB     = document.getElementById('ribbon-line-b');
const lineC     = document.getElementById('ribbon-line-c');

function buildStrandD(points, ampScale, phaseShift) {
  const mid = points[Math.floor(points.length / 2)];
  const pts = points.map(([x, y]) => [
    (x - mid[0]) * ampScale + mid[0],
    y + phaseShift
  ]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function buildRibbonPath() {
  if (mobilePerformanceMode.matches) return;
  const docH = document.body.scrollHeight;
  const w    = window.innerWidth;
  const ribbonLayer = document.getElementById('ribbon-layer');
  ribbonLayer.style.height = docH + 'px';
  svgEl.setAttribute('viewBox', `0 0 ${w} ${docH}`);
  svgEl.style.height = docH + 'px';
  svgEl.style.width  = '100%';

  const isMobile = w < 860;
  const amp = isMobile ? w * 0.20 : w * 0.28;
  const cx  = w * 0.5;
  const step = docH / 9;
  const xs = [0.05, 0.5, -0.55, 0.6, -0.4, 0.5, -0.5, 0.45, 0.1];
  const points = [];
  for (let i = 0; i <= 9; i++) {
    points.push([cx + (xs[i] !== undefined ? xs[i] * amp : 0), i * step]);
  }

  const dA = buildStrandD(points, 1,    0);
  const dB = buildStrandD(points, 0.9,  26);
  const dC = buildStrandD(points, 1.08, -22);

  glowPath.setAttribute('d', dA);
  lineA.setAttribute('d', dA);
  lineB.setAttribute('d', dB);
  lineC.setAttribute('d', dC);

  [glowPath, lineA, lineB, lineC].forEach(p => {
    const len = p.getTotalLength();
    p.style.strokeDasharray  = len;
    p.style.strokeDashoffset = len;
    p.dataset.len = len;
  });
}

function drawRibbon() {
  if (mobilePerformanceMode.matches) return;
  const scrollTop = window.scrollY;
  const docH      = document.body.scrollHeight - window.innerHeight;
  const frac      = Math.min(1, Math.max(0, scrollTop / docH));
  [glowPath, lineA, lineB, lineC].forEach(p => {
    const len = parseFloat(p.dataset.len || 0);
    p.style.strokeDashoffset = len * (1 - frac);
  });
}

/* ── 7. ACTIVE LINKS + SCROLL HANDLER ── */
function onScroll() {
  floatNav.classList.toggle('scrolled', window.scrollY > 40);

  let current = sections[0];
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - window.innerHeight * 0.5) current = sec;
  });
  navLinks.forEach(a => a.classList.toggle('active', a.dataset.target === current.id));

  drawRibbon();
  drawParallax();
  driveInstaRail();
}

/* Um scroll pode disparar várias vezes no mesmo quadro. Consolidar o trabalho
   em requestAnimationFrame reduz leituras/escritas de layout repetidas. */
let scrollFrame = 0;
function requestScrollUpdate() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    onScroll();
  });
}

let resizeFrame = 0;
function requestResizeUpdate() {
  if (resizeFrame) cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    resizeFrame = 0;
    sizeInstaPin();
    buildRibbonPath();
    drawRibbon();
    requestScrollUpdate();
  });
}

window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestResizeUpdate, { passive: true });
buildRibbonPath();
drawRibbon();
onScroll();
window.addEventListener('load', requestResizeUpdate);
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(requestResizeUpdate);
}
setTimeout(requestResizeUpdate, 900);

/* ── 8. COUNTDOWN — America/Sao_Paulo (UTC-3, sem horário de verão) ── */
const SCHEDULE = [
  { day: 0, hour: 9  },   // Domingo 9h
  { day: 0, hour: 18 },   // Domingo 18h
  { day: 3, hour: 19 }    // Quarta 19h
];
const LIVE_WINDOW_MIN = 120; // janela de "ao vivo" em minutos

function nowSP() {
  const now   = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs - 3 * 3600000);
}

function nextOccurrence(item, from) {
  const d = new Date(from);
  d.setHours(item.hour, 0, 0, 0);
  let diffDays = (item.day - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diffDays);
  if (d.getTime() < from.getTime()) d.setDate(d.getDate() + 7);
  return d;
}

function updateCountdown() {
  const sp       = nowSP();
  let liveNow    = false;
  let nearest    = null;

  SCHEDULE.forEach(item => {
    const start      = new Date(sp);
    start.setHours(item.hour, 0, 0, 0);
    const todayMatch = sp.getDay() === item.day;
    if (todayMatch) {
      const diffMin = (sp - start) / 60000;
      if (diffMin >= 0 && diffMin <= LIVE_WINDOW_MIN) liveNow = true;
    }
    const occ = nextOccurrence(item, sp);
    if (!nearest || occ < nearest) nearest = occ;
  });

  const label = document.getElementById('countdownLabel');
  const box   = {
    d: document.getElementById('cd-d'),
    h: document.getElementById('cd-h'),
    m: document.getElementById('cd-m'),
    s: document.getElementById('cd-s')
  };

  /* Ao vivo agora */
  if (liveNow) {
    label.textContent = '🔴 Ao vivo agora!';
    box.d.textContent = '●';
    box.h.textContent = 'AO';
    box.m.textContent = 'VI';
    box.s.textContent = 'VO';
    return;
  }

  /* Countdown */
  label.textContent = 'Próxima transmissão em';
  const diff = Math.max(0, nearest - sp);
  const d    = Math.floor(diff / 86400000);
  const h    = Math.floor((diff % 86400000) / 3600000);
  const m    = Math.floor((diff % 3600000)  / 60000);
  const s    = Math.floor((diff % 60000)    / 1000);

  box.d.textContent = String(d).padStart(2, '0');
  box.h.textContent = String(h).padStart(2, '0');
  box.m.textContent = String(m).padStart(2, '0');
  box.s.textContent = String(s).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);
