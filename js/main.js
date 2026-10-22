// Marca que hay JavaScript: solo así se ocultan los elementos que entran con animación.
// Si el script falla, todo el contenido queda visible.
document.documentElement.classList.add('js');

// Año actual en el pie de página
document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------
   Barra: al bajar aparece el nombre y un fondo; el enlace
   de la sección visible queda marcado.
   --------------------------------------------------------- */
const nav = document.getElementById('nav');
const hero = document.getElementById('inicio');
const heroVisual = document.querySelector('.hero-visual');
const progressBar = document.querySelector('.progress');
const navLinks = [...document.querySelectorAll('.nav ul a:not(.btn)')];

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('is-scrolled', y > 40);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;

  // Las capturas del inicio se abren en abanico mientras el inicio sale de la pantalla
  if (!reduceMotion) {
    const p = Math.min(1, Math.max(0, y / (hero.offsetHeight * 0.7)));
    heroVisual.style.setProperty('--p', p.toFixed(3));
  }
  if (y < hero.offsetHeight * 0.5) navLinks.forEach((a) => a.classList.remove('is-active'));
  revealWords();
}
window.addEventListener('scroll', onScroll, { passive: true });

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['proyectos', 'habilidades', 'sobre-mi', 'contacto'].forEach((id) => sectionObserver.observe(document.getElementById(id)));
}

/* ---------------------------------------------------------
   Sobre mí: cada palabra se enciende a medida que el texto
   sube por la pantalla.
   --------------------------------------------------------- */
const wordsBox = document.querySelector('[data-words]');
let words = [];

function splitWords() {
  words = [];
  wordsBox.querySelectorAll('p').forEach((p) => {
    const parts = p.textContent.trim().split(/\s+/);
    p.textContent = '';
    parts.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'w';
      span.textContent = word;
      p.appendChild(span);
      if (i < parts.length - 1) p.appendChild(document.createTextNode(' '));
      words.push(span);
    });
  });
}

/* ---------------------------------------------------------
   Titular: cada palabra entra por separado. El texto completo
   queda en aria-label para los lectores de pantalla.
   --------------------------------------------------------- */
const headline = document.querySelector('.headline');

function splitHeadline() {
  if (reduceMotion) return;
  const text = headline.textContent.trim();
  headline.setAttribute('aria-label', text);
  headline.classList.add('split');
  headline.innerHTML = text.split(/\s+/)
    .map((word, i) => `<span class="hw" aria-hidden="true" style="--i:${i}">${word}</span>`)
    .join(' ');
}

/* ---------------------------------------------------------
   Idioma: cada texto guarda su versión en inglés en data-en.
   El botón las intercambia y la elección se recuerda.
   --------------------------------------------------------- */
const langToggle = document.getElementById('lang-toggle');
const meta = {
  es: { title: 'Alexander Mejía Ospina | Desarrollador Full Stack', button: 'EN', label: 'EN: read this page in English' },
  en: { title: 'Alexander Mejía Ospina | Full Stack Developer', button: 'ES', label: 'ES: leer esta página en español' }
};
let lang = 'es';

function setLang(next) {
  if (next === lang) return;
  document.querySelectorAll('[data-en]').forEach((el) => {
    if (el.dataset.es === undefined) el.dataset.es = el.closest('[data-words]') || el === headline ? el.textContent.trim() : el.innerHTML;
    el.innerHTML = next === 'en' ? el.dataset.en : el.dataset.es;
  });
  document.querySelectorAll('[data-en-href]').forEach((el) => {
    if (el.dataset.esHref === undefined) el.dataset.esHref = el.getAttribute('href');
    el.setAttribute('href', next === 'en' ? el.dataset.enHref : el.dataset.esHref);
  });
  document.querySelectorAll('[data-en-placeholder]').forEach((el) => {
    if (el.dataset.esPlaceholder === undefined) el.dataset.esPlaceholder = el.placeholder;
    el.placeholder = next === 'en' ? el.dataset.enPlaceholder : el.dataset.esPlaceholder;
  });
  lang = next;
  document.documentElement.lang = next;
  document.title = meta[next].title;
  langToggle.textContent = meta[next].button;
  langToggle.setAttribute('aria-label', meta[next].label);
  langToggle.lang = next === 'en' ? 'es' : 'en';
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  splitWords();
  splitHeadline();
  revealWords();
  try { localStorage.setItem('lang', next); } catch (e) { /* sin almacenamiento: no se recuerda */ }
}

const swapTargets = [document.querySelector('main'), document.querySelector('.footer'), document.querySelector('.nav nav')];

langToggle.addEventListener('click', () => {
  const next = lang === 'es' ? 'en' : 'es';
  if (reduceMotion) { setLang(next); return; }
  swapTargets.forEach((el) => el.classList.add('lang-swap'));
  setTimeout(() => {
    setLang(next);
    swapTargets.forEach((el) => { el.classList.add('lang-swap-in'); el.classList.remove('lang-swap'); });
    setTimeout(() => swapTargets.forEach((el) => el.classList.remove('lang-swap-in')), 240);
  }, 140);
});

function revealWords() {
  const box = wordsBox.getBoundingClientRect();
  const vh = window.innerHeight;
  // Empieza cuando la carta entra al 85 % de la pantalla y termina cuando su final llega al 45 %
  const start = vh * 0.85;
  const end = vh * 0.45;
  const progress = Math.min(1, Math.max(0, (start - box.top) / (box.height + start - end)));
  const lit = Math.round(progress * words.length);
  words.forEach((w, i) => w.classList.toggle('on', i < lit));
}

/* ---------------------------------------------------------
   Tarjetas de proyectos y demás bloques: entran una vez
   cuando aparecen en pantalla.
   --------------------------------------------------------- */
document.querySelectorAll('.card').forEach((card) => {
  card.querySelectorAll('.card-text > *').forEach((el, i) => el.style.setProperty('--i', i));
  card.querySelector('.card-media').style.setProperty('--i', 3);
});
document.querySelectorAll('.stack-row li').forEach((li, i) => li.style.setProperty('--i', i));
document.querySelectorAll('.card-media').forEach((media) => {
  [...media.children].filter((el) => el.tagName !== 'FIGCAPTION').forEach((el, i) => el.style.setProperty('--m', i));
});
document.querySelectorAll('.tech, .facts-panel, .contact-rows').forEach((list) => {
  list.classList.add('stagger');
  [...list.children].forEach((el, i) => el.style.setProperty('--i', i));
});

const revealTargets = document.querySelectorAll('.projects .section-title, .skills .giant, .skill-group, .about-letter .section-title, .sign, .sign-role, .facts-panel, .contact .section-title, .contact .read, .contact-rows');
revealTargets.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.card, .reveal').forEach((el) => io.observe(el));
} else {
  document.querySelectorAll('.card, .reveal').forEach((el) => el.classList.add('in'));
}

let saved = null;
try { saved = localStorage.getItem('lang'); } catch (e) { /* sin almacenamiento */ }
const preferred = saved || ((navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en');
splitWords();
if (preferred === 'en') setLang('en');
else splitHeadline();

onScroll();

/* ---------------------------------------------------------
   Capturas del inicio: se inclinan levemente hacia el puntero.
   Es decorativo, así que solo con mouse y sin movimiento reducido.
   --------------------------------------------------------- */
if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let raf = null;

  const tick = () => {
    current.x += (target.x - current.x) * 0.08;
    current.y += (target.y - current.y) * 0.08;
    heroVisual.style.transform = `perspective(1400px) rotateX(${current.y.toFixed(2)}deg) rotateY(${current.x.toFixed(2)}deg)`;
    if (Math.abs(target.x - current.x) > 0.01 || Math.abs(target.y - current.y) > 0.01) raf = requestAnimationFrame(tick);
    else raf = null;
  };

  hero.addEventListener('pointermove', (event) => {
    const box = hero.getBoundingClientRect();
    target.x = ((event.clientX - box.left) / box.width - 0.5) * 8;
    target.y = -((event.clientY - box.top) / box.height - 0.5) * 6;
    if (!raf) raf = requestAnimationFrame(tick);
  });
  hero.addEventListener('pointerleave', () => {
    target.x = 0;
    target.y = 0;
    if (!raf) raf = requestAnimationFrame(tick);
  });
}

/* ---------------------------------------------------------
   Video de Numi: se reproduce solo mientras está en pantalla.
   Con movimiento reducido no arranca solo y muestra controles.
   --------------------------------------------------------- */
const demo = document.querySelector('video.phone-main');
if (demo) {
  if (reduceMotion || !('IntersectionObserver' in window)) {
    demo.controls = true;
    demo.preload = 'metadata';
  } else {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) demo.play().catch(() => { demo.controls = true; });
      else demo.pause();
    }, { threshold: 0.4 }).observe(demo);
  }
}

/* ---------------------------------------------------------
   Contacto: el campo abre el correo con el mensaje escrito.
   Sin JavaScript, el formulario hace lo mismo con mailto.
   --------------------------------------------------------- */
const mailForm = document.getElementById('mail-form');

mailForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const body = mailForm.elements.body.value.trim();
  const params = new URLSearchParams({ subject: 'Práctica empresarial', body });
  window.location.href = `mailto:alexmejia0112@gmail.com?${params.toString().replace(/\+/g, '%20')}`;
});
