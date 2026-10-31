/* =========================================================
   Portafolio de Alexander Mejía Ospina
   Sin dependencias. Cada bloque funciona por su cuenta: si uno
   falla (por ejemplo, la API no responde), el resto sigue.
   ========================================================= */

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const API = 'https://cinex-api-lt2q.onrender.com';
const OBS_DATA = 'https://alexanderm-code.github.io/observatorio-salud-antioquia/data/eventos_por_anio.json';

/* ---------------------------------------------------------
   Textos que escribe el JavaScript, en los dos idiomas.
   Los textos fijos de la página llevan su inglés en data-en.
   --------------------------------------------------------- */
const T = {
  es: {
    title: 'Alexander Mejía Ospina | Desarrollador full stack y datos',
    description: 'Portafolio de Alexander Mejía Ospina, estudiante de Ingeniería de Software en Medellín. APIs, sitios web y análisis de datos en producción, con pruebas automáticas y despliegue. Disponible para práctica empresarial.',
    langButton: 'EN', langLabel: 'EN, read this page in English', langAttr: 'en',
    apiChecking: 'Comprobando…',
    apiOk: (ms) => `En línea · responde en ${ms} ms`,
    apiWaking: (n, max) => `Despertando el servidor gratuito… (intento ${n} de ${max})`,
    apiDown: 'Fuera de línea. El resto del sitio funciona igual.',
    checkedAt: 'comprobado',
    chartLoading: 'Cargando datos del observatorio…',
    chartLive: 'Datos en vivo del observatorio',
    chartFallback: 'Sin conexión con el observatorio: se muestran los datos de dengue guardados',
    chartLabel: (ev, max, year) => `Casos anuales de ${ev} en Antioquia, 2007 a 2022. Máximo: ${max} casos en ${year}.`,
    readout: (year, n, ev) => `${year} · ${n} casos de ${ev}`,
    cases: 'casos',
    events: { 210: 'dengue', 490: 'malaria vivax', 831: 'varicela' },
    demoIdle: 'Pulsa el botón para enviar la petición real.',
    demoSending: 'Enviando la petición…',
    demoSlow: 'El servidor gratuito está despertando; puede tardar hasta un minuto…',
    demoDone: (status, ms) => `HTTP ${status} · ${ms} ms · respuesta real de la API`,
    demoFail: 'No hubo respuesta. Es un servidor gratuito: vuelve a intentarlo en un minuto.',
    copy: 'Copiar', copied: 'Copiado', copiedMsg: 'Correo copiado al portapapeles.',
    copyFail: 'No se pudo copiar. Selecciona el correo y cópialo a mano.',
    skillsHint: 'Pasa el cursor o enfoca una habilidad para ver dónde la usé.',
    caseMore: 'Ver caso completo', caseLess: 'Ocultar',
    themeDark: 'Cambiar a tema oscuro', themeLight: 'Cambiar a tema claro',
    localTime: (time) => `${/^1:/.test(time) ? 'Ahora es la' : 'Ahora son las'} ${time} en Medellín (UTC−5)`,
    siteUpdated: (when) => `Última actualización del sitio: ${when}`,
    locale: 'es-CO'
  },
  en: {
    title: 'Alexander Mejia Ospina | Full stack and data developer',
    description: 'Portfolio of Alexander Mejia Ospina, a Software Engineering student in Medellin, Colombia. APIs, websites and data analysis running in production, with automated tests and deployment. Available for an internship.',
    langButton: 'ES', langLabel: 'ES, leer esta página en español', langAttr: 'es',
    apiChecking: 'Checking…',
    apiOk: (ms) => `Online · responds in ${ms} ms`,
    apiWaking: (n, max) => `Waking up the free server… (attempt ${n} of ${max})`,
    apiDown: 'Offline. The rest of the site works the same.',
    checkedAt: 'checked',
    chartLoading: 'Loading data from the observatory…',
    chartLive: 'Live data from the observatory',
    chartFallback: 'No connection to the observatory: showing the saved dengue data',
    chartLabel: (ev, max, year) => `Yearly ${ev} cases in Antioquia, 2007 to 2022. Peak: ${max} cases in ${year}.`,
    readout: (year, n, ev) => `${year} · ${n} ${ev} cases`,
    cases: 'cases',
    events: { 210: 'dengue', 490: 'vivax malaria', 831: 'chickenpox' },
    demoIdle: 'Press the button to send the real request.',
    demoSending: 'Sending the request…',
    demoSlow: 'The free server is waking up; it can take up to a minute…',
    demoDone: (status, ms) => `HTTP ${status} · ${ms} ms · real API response`,
    demoFail: 'No response. It is a free server: try again in a minute.',
    copy: 'Copy', copied: 'Copied', copiedMsg: 'Email copied to the clipboard.',
    copyFail: 'Could not copy. Select the email and copy it by hand.',
    skillsHint: 'Hover or focus a skill to see where I used it.',
    caseMore: 'See full case study', caseLess: 'Hide',
    themeDark: 'Switch to dark theme', themeLight: 'Switch to light theme',
    localTime: (time) => `It is ${time} in Medellin right now (UTC−5)`,
    siteUpdated: (when) => `Site last updated ${when}`,
    locale: 'en-US'
  }
};

let lang = 'es';
const t = () => T[lang];
const fmt = (n, decimals = 0) => n.toLocaleString(t().locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const langListeners = [];

/* ---------------------------------------------------------
   Idioma
   --------------------------------------------------------- */
const langToggle = document.getElementById('lang-toggle');

function swapAttr(selector, attr, dataKey) {
  document.querySelectorAll(selector).forEach((el) => {
    const esKey = `es${dataKey}`;
    if (el.dataset[esKey] === undefined) el.dataset[esKey] = el.getAttribute(attr) || '';
    el.setAttribute(attr, lang === 'en' ? el.dataset[`en${dataKey}`] : el.dataset[esKey]);
  });
}

function setLang(next, { save = true } = {}) {
  lang = next;
  document.querySelectorAll('[data-en]').forEach((el) => {
    if (el.dataset.es === undefined) el.dataset.es = el.innerHTML;
    el.innerHTML = next === 'en' ? el.dataset.en : el.dataset.es;
  });
  swapAttr('[data-en-href]', 'href', 'Href');
  swapAttr('[data-en-aria]', 'aria-label', 'Aria');
  swapAttr('[data-en-alt]', 'alt', 'Alt');
  swapAttr('[data-en-placeholder]', 'placeholder', 'Placeholder');

  root.lang = next;
  document.title = t().title;
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = next === 'en' ? 'https://alexanderm-code.github.io/?lang=en' : 'https://alexanderm-code.github.io/';
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', t().description);
  langToggle.querySelector('span').textContent = t().langButton;
  langToggle.setAttribute('aria-label', t().langLabel);
  langToggle.lang = t().langAttr;

  langListeners.forEach((fn) => { try { fn(); } catch (e) { /* un bloque no tumba a los demás */ } });
  if (save) { try { localStorage.setItem('lang', next); } catch (e) { /* sin almacenamiento */ } }
}

langToggle.addEventListener('click', () => {
  const next = lang === 'es' ? 'en' : 'es';
  if (reduceMotion) { setLang(next); return; }
  root.classList.add('lang-swap');
  setTimeout(() => { setLang(next); root.classList.remove('lang-swap'); }, 120);
});

/* ---------------------------------------------------------
   Tema claro / oscuro. Sin elección guardada, sigue al sistema.
   --------------------------------------------------------- */
const themeToggle = document.getElementById('theme-toggle');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
const currentTheme = () => root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');

function syncThemeButton() {
  themeToggle.setAttribute('aria-label', currentTheme() === 'dark' ? t().themeLight : t().themeDark);
}
// La barra del navegador (theme-color) sigue al tema elegido a mano
const THEME_COLORS = { light: '#f3efe6', dark: '#121418' };
function syncThemeColor() {
  const chosen = root.getAttribute('data-theme');
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    const own = m.media.includes('dark') ? THEME_COLORS.dark : THEME_COLORS.light;
    m.setAttribute('content', chosen ? THEME_COLORS[chosen] : own);
  });
}
themeToggle.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  const apply = () => {
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* sin almacenamiento */ }
    syncThemeButton();
    syncThemeColor();
  };
  if (!document.startViewTransition || reduceMotion) { apply(); return; }
  // Revelado circular desde el botón; si el botón está oculto (menú cerrado), desde la esquina
  const box = themeToggle.getBoundingClientRect();
  const x = box.width ? box.left + box.width / 2 : window.innerWidth - 32;
  const y = box.height ? box.top + box.height / 2 : 32;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  document.startViewTransition(apply).ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 420, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', pseudoElement: '::view-transition-new(root)' }
    );
  }).catch(() => { /* sin transición: el tema ya cambió */ });
});
systemDark.addEventListener?.('change', syncThemeButton);
langListeners.push(syncThemeButton);

/* ---------------------------------------------------------
   Barra: se compacta al bajar, marca la sección visible y en
   celulares abre un menú accesible.
   --------------------------------------------------------- */
const nav = document.getElementById('nav');
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
const navLinks = [...document.querySelectorAll('.menu-links a')];
const sectionToLink = [
  ['proyectos', '#proyectos'], ['datos', '#datos'], ['mas-proyectos', '#proyectos'],
  ['habilidades', '#habilidades'], ['como-trabajo', '#habilidades'],
  ['trayectoria', '#trayectoria'], ['sobre-mi', '#trayectoria'], ['contacto', '#contacto']
].map(([id, href]) => [document.getElementById(id), href]).filter(([el]) => el);

// Barra compacta y progreso de lectura
const progressBar = document.getElementById('progress-bar');
let ticking = false;
function onScroll() {
  ticking = false;
  nav.classList.toggle('is-scrolled', window.scrollY > 24);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
}
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });
requestAnimationFrame(onScroll);

// Sección visible: la que cruza una línea al 40 % de la pantalla. El fondo
// del enlace activo se desliza de un enlace al siguiente.
const indicator = document.getElementById('menu-indicator');
const visible = new Set();
let activeHref = null;

function placeIndicator({ instant = false } = {}) {
  const link = navLinks.find((a) => a.getAttribute('href') === activeHref);
  indicator.classList.toggle('is-instant', instant);
  indicator.classList.toggle('is-on', Boolean(link));
  if (!link) return;
  indicator.style.width = `${link.offsetWidth}px`;
  indicator.style.transform = `translateX(${link.parentElement.offsetLeft}px)`;
}

function setActiveLink(href) {
  const first = activeHref === null;
  activeHref = href;
  navLinks.forEach((a) => {
    const on = a.getAttribute('href') === href;
    a.classList.toggle('is-active', on);
    if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
  });
  placeIndicator({ instant: first || reduceMotion });
}

if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target); });
    // La última coincidencia en el orden de la lista es la más específica (Datos dentro de Proyectos)
    let href = null;
    sectionToLink.forEach(([el, h]) => { if (visible.has(el)) href = h; });
    if (href !== activeHref) setActiveLink(href);
  }, { rootMargin: '-40% 0px -59% 0px' });
  sectionToLink.forEach(([el]) => spy.observe(el));
}
const replaceIndicator = () => placeIndicator({ instant: true });
window.addEventListener('resize', replaceIndicator, { passive: true });
document.fonts?.ready.then(replaceIndicator);
langListeners.push(replaceIndicator);

function setMenu(open, { focus = true } = {}) {
  nav.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  if (open && focus) navLinks[0]?.focus();
}
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false, { focus: false });
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    setMenu(false);
    menuToggle.focus();
  }
});
document.addEventListener('click', (event) => {
  if (nav.classList.contains('is-open') && !nav.contains(event.target)) setMenu(false, { focus: false });
});

/* ---------------------------------------------------------
   Estado del sistema: petición real a la API de CineX.
   Si el servidor gratuito está dormido, reintenta cada 10 s.
   --------------------------------------------------------- */
const apiRow = document.getElementById('api-row');
const apiDetail = document.getElementById('api-detail');
const apiMs = document.getElementById('api-ms');
const statusClock = document.getElementById('status-clock');
const MAX_TRIES = 6;
let apiState = { kind: 'checking' };

function renderApi() {
  const s = apiState;
  apiRow.dataset.state = s.kind;
  if (s.kind === 'ok') {
    apiDetail.textContent = t().apiOk(fmt(s.ms));
    apiMs.textContent = `${fmt(s.ms)} ms`;
  } else if (s.kind === 'waking') {
    apiDetail.textContent = t().apiWaking(s.attempt, MAX_TRIES);
    apiMs.textContent = '…';
  } else if (s.kind === 'down') {
    apiDetail.textContent = t().apiDown;
    apiMs.textContent = '—';
  } else {
    apiDetail.textContent = t().apiChecking;
    apiMs.textContent = '';
  }
  if (s.at) statusClock.textContent = `${t().checkedAt} ${s.at.toLocaleTimeString(t().locale, { hour: '2-digit', minute: '2-digit' })}`;
}
langListeners.push(renderApi);

async function timedGet(path, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const start = performance.now();
  try {
    const res = await fetch(API + path, { signal: controller.signal, headers: { Accept: 'application/json' }, cache: 'no-store' });
    const body = await res.text();
    return { res, body, ms: Math.round(performance.now() - start) };
  } finally {
    clearTimeout(timer);
  }
}

async function checkApi(attempt = 0) {
  try {
    const { res, ms } = await timedGet('/productos', 8000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    apiState = { kind: 'ok', ms, at: new Date() };
  } catch (e) {
    const next = attempt + 1;
    apiState = next > MAX_TRIES ? { kind: 'down', at: new Date() } : { kind: 'waking', attempt: next, at: new Date() };
    if (next <= MAX_TRIES) setTimeout(() => checkApi(next), 10000);
  }
  renderApi();
}

/* ---------------------------------------------------------
   Cifras del inicio: cuentan desde cero cuando aparecen.
   --------------------------------------------------------- */
const counters = [...document.querySelectorAll('.count')];
const countFinal = (el) => {
  const value = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const suffix = lang === 'en' && el.dataset.enSuffix !== undefined ? el.dataset.enSuffix : (el.dataset.suffix || '');
  return { value, decimals, suffix };
};
const renderCount = (el, v) => {
  const { decimals, suffix } = countFinal(el);
  el.textContent = fmt(v, decimals) + suffix;
};
counters.forEach((el) => { el.dataset.done = '1'; });
langListeners.push(() => counters.forEach((el) => { if (el.dataset.done) renderCount(el, countFinal(el).value); }));

function runCounters() {
  if (reduceMotion) return;
  const start = performance.now();
  const duration = 1300;
  counters.forEach((el) => { el.dataset.done = ''; renderCount(el, 0); });
  const step = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(2, -10 * p);
    counters.forEach((el) => renderCount(el, countFinal(el).value * (p === 1 ? 1 : eased)));
    if (p < 1) requestAnimationFrame(step);
    else counters.forEach((el) => { el.dataset.done = '1'; });
  };
  requestAnimationFrame(step);
}

/* ---------------------------------------------------------
   Gráfica del Observatorio: datos reales con SVG propio.
   Se puede recorrer con el cursor o con las flechas.
   --------------------------------------------------------- */
const DENGUE_BACKUP = { anios: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
  eventos: [{ codigo: '210', nombre: 'Dengue', casos: [98, 2505, 1321, 25804, 1963, 1991, 5761, 6762, 6780, 27628, 4091, 3670, 4980, 2133, 1239, 2007] }] };

const chart = {
  el: document.getElementById('chart'),
  svg: document.getElementById('chart-svg'),
  tip: document.getElementById('chart-tip'),
  readout: document.getElementById('chart-readout'),
  source: document.getElementById('chart-source'),
  buttons: [...document.querySelectorAll('.segmented button')],
  data: null, live: false, code: '210', active: -1, drawn: false
};
const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(name, attrs, parent) {
  const node = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  if (parent) parent.appendChild(node);
  return node;
}

function niceMax(v) {
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 3 ? 3 : n <= 4 ? 4 : n <= 5 ? 5 : 10) * pow;
}

function currentSeries() {
  if (!chart.data) return null;
  const ev = chart.data.eventos.find((e) => String(e.codigo) === chart.code);
  return ev ? { years: chart.data.anios, values: ev.casos } : null;
}

function drawChart({ animate = false } = {}) {
  const series = currentSeries();
  if (!series) return;
  const { years, values } = series;
  const w = chart.svg.clientWidth || 600;
  const h = chart.svg.clientHeight || 300;
  const m = { top: 26, right: 4, bottom: 26, left: 52 };
  const iw = w - m.left - m.right;
  const ih = h - m.top - m.bottom;
  const max = niceMax(Math.max(...values));
  const band = iw / values.length;
  const barW = Math.max(4, band * 0.68);
  const y = (v) => m.top + ih - (v / max) * ih;

  // Barras destacadas: años muy por encima de lo normal (o el máximo)
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sd = Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length);
  let hot = values.map((v) => v > mean + 1.5 * sd);
  if (!hot.some(Boolean)) hot = values.map((v) => v === Math.max(...values));

  chart.svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  chart.svg.textContent = '';
  const grid = svgEl('g', {}, chart.svg);
  for (let i = 0; i <= 4; i += 1) {
    const v = (max / 4) * i;
    const gy = y(v);
    svgEl('line', { class: i === 0 ? 'base-line' : 'grid-line', x1: m.left, x2: w - m.right, y1: gy, y2: gy }, grid);
    const label = svgEl('text', { x: m.left - 8, y: gy + 4, 'text-anchor': 'end' }, grid);
    label.textContent = fmt(v);
  }
  const step = band < 30 ? 3 : 1;
  const bars = svgEl('g', { class: 'bars' }, chart.svg);
  values.forEach((v, i) => {
    const x = m.left + band * i + (band - barW) / 2;
    const cls = ['bar', hot[i] ? 'is-hot' : '', i === chart.active ? 'is-active' : ''].join(' ').trim();
    svgEl('rect', { class: cls, x, y: y(v), width: barW, height: Math.max(0, m.top + ih - y(v)), rx: 2, style: `--i:${i}` }, bars);
    if (hot[i]) {
      const lbl = svgEl('text', { class: 'bar-label', x: x + barW / 2, y: y(v) - 7, 'text-anchor': 'middle' }, bars);
      lbl.textContent = fmt(v);
    }
    if ((i % step === 0) || i === values.length - 1) {
      const yl = svgEl('text', { x: x + barW / 2, y: h - 6, 'text-anchor': 'middle' }, chart.svg);
      yl.textContent = band < 30 ? `'${String(years[i]).slice(2)}` : years[i];
    }
  });
  const hits = svgEl('g', {}, chart.svg);
  values.forEach((v, i) => {
    const hit = svgEl('rect', { class: 'hit', x: m.left + band * i, y: m.top, width: band, height: ih }, hits);
    hit.addEventListener('pointerenter', () => setActive(i));
  });

  chart.geom = { m, band, barW, y, w };
  const peak = values.indexOf(Math.max(...values));
  chart.el.setAttribute('aria-label', t().chartLabel(t().events[chart.code], fmt(values[peak]), years[peak]));

  if (animate && !reduceMotion) {
    chart.el.classList.remove('is-drawing');
    void chart.el.offsetWidth;
    chart.el.classList.add('is-drawing');
  }
  if (chart.active >= 0) setActive(chart.active, { announce: false });
}

function setActive(i, { announce = true } = {}) {
  const series = currentSeries();
  if (!series || !chart.geom) return;
  chart.active = Math.max(0, Math.min(series.values.length - 1, i));
  chart.svg.querySelectorAll('.bar').forEach((b, k) => b.classList.toggle('is-active', k === chart.active));
  const { m, band, y } = chart.geom;
  const v = series.values[chart.active];
  const yr = series.years[chart.active];
  const scale = chart.el.clientWidth / (chart.geom.w || chart.el.clientWidth);
  chart.tip.textContent = `${yr} · ${fmt(v)} ${t().cases}`;
  chart.tip.style.left = `${(m.left + band * chart.active + band / 2) * scale}px`;
  chart.tip.style.top = `${Math.max(14, y(v) - 6)}px`;
  chart.tip.classList.add('is-on');
  if (announce) chart.readout.textContent = t().readout(yr, fmt(v), t().events[chart.code]);
}

function clearActive() {
  chart.tip.classList.remove('is-on');
  chart.svg.querySelectorAll('.bar').forEach((b) => b.classList.remove('is-active'));
  chart.active = -1;
}

function renderChartSource() {
  if (!chart.data) { chart.source.textContent = t().chartLoading; return; }
  chart.source.textContent = chart.live ? t().chartLive : t().chartFallback;
  chart.source.classList.toggle('is-live', chart.live);
}

async function loadChart() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(OBS_DATA, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.anios) || !Array.isArray(data.eventos)) throw new Error('formato');
    chart.data = data;
    chart.live = true;
  } catch (e) {
    chart.data = DENGUE_BACKUP;
    chart.live = false;
    chart.code = '210';
    chart.buttons.forEach((b) => {
      const available = b.dataset.event === '210';
      b.disabled = !available;
      b.setAttribute('aria-pressed', String(available));
    });
  }
  renderChartSource();
  drawChart({ animate: !chart.drawn });
  chart.drawn = true;
}

chart.buttons.forEach((button) => {
  button.addEventListener('click', () => {
    chart.code = button.dataset.event;
    chart.buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    clearActive();
    chart.readout.textContent = '';
    drawChart({ animate: true });
  });
});
chart.el.addEventListener('pointerleave', clearActive);
chart.el.addEventListener('blur', clearActive);
chart.el.addEventListener('focus', () => {
  const series = currentSeries();
  if (series && chart.active < 0) setActive(series.values.indexOf(Math.max(...series.values)));
});
chart.el.addEventListener('keydown', (event) => {
  const series = currentSeries();
  if (!series) return;
  const last = series.values.length - 1;
  const moves = { ArrowRight: chart.active + 1, ArrowUp: chart.active + 1, ArrowLeft: chart.active - 1, ArrowDown: chart.active - 1, Home: 0, End: last };
  if (event.key in moves) {
    event.preventDefault();
    setActive(moves[event.key]);
  }
});
if ('ResizeObserver' in window) {
  let lastWidth = 0;
  new ResizeObserver(([entry]) => {
    const width = Math.round(entry.contentRect.width);
    if (width !== lastWidth && chart.data) { lastWidth = width; drawChart(); }
  }).observe(chart.el);
}
langListeners.push(() => {
  renderChartSource();
  if (chart.data) drawChart();
  if (chart.active >= 0) setActive(chart.active);
});

/* ---------------------------------------------------------
   Demo de CineX: solo lecturas (GET), nunca escrituras.
   --------------------------------------------------------- */
const demoOut = document.getElementById('demo-out');
const demoStatus = document.getElementById('demo-status');
const demoSeats = document.getElementById('demo-seats');
const demoButtons = [document.getElementById('demo-run'), document.getElementById('demo-404')];
let demoLast = null;

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function highlightJson(text) {
  let pretty = text;
  try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch (e) { /* no es JSON: se muestra tal cual */ }
  return escapeHtml(pretty).replace(
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(-?\d+(?:\.\d+)?)\b|\b(true|false|null)\b/g,
    (match, str, colon, num, lit) => {
      if (str) return colon ? `<span class="t-key">${str}</span>${colon}` : `<span class="t-str">${str}</span>`;
      if (num) return `<span class="t-num">${num}</span>`;
      return `<span class="t-num">${lit}</span>`;
    }
  );
}

function renderDemoStatus() {
  if (!demoLast) return;
  if (demoLast.kind === 'done') demoStatus.textContent = t().demoDone(demoLast.status, fmt(demoLast.ms));
  else if (demoLast.kind === 'fail') demoStatus.textContent = t().demoFail;
  else if (demoLast.kind === 'slow') demoStatus.textContent = t().demoSlow;
  else demoStatus.textContent = t().demoSending;
}
langListeners.push(renderDemoStatus);

async function runDemo(button) {
  const path = button.dataset.path;
  demoButtons.forEach((b) => { b.disabled = true; });
  demoOut.innerHTML = `<code><span class="t-dim">$ curl -s ${API}${path}</span>\n</code>`;
  demoLast = { kind: 'sending' };
  renderDemoStatus();
  const slowTimer = setTimeout(() => { demoLast = { kind: 'slow' }; renderDemoStatus(); }, 5000);
  try {
    const { res, body, ms } = await timedGet(path, 65000);
    const cls = res.ok ? 't-ok' : 't-err';
    demoOut.innerHTML = `<code><span class="t-dim">$ curl -s ${API}${path}</span>\n<span class="${cls}">HTTP ${res.status}</span>\n${highlightJson(body)}</code>`;
    demoLast = { kind: 'done', status: res.status, ms };
    let data = null;
    try { data = JSON.parse(body); } catch (e) { /* respuesta sin JSON */ }
    if (res.ok && data && typeof data.capacidad === 'number') {
      document.getElementById('seat-cap').textContent = fmt(data.capacidad);
      document.getElementById('seat-sold').textContent = fmt(data.vendidas);
      document.getElementById('seat-free').textContent = fmt(data.disponibles);
      const ratio = data.capacidad > 0 ? data.disponibles / data.capacidad : 0;
      document.getElementById('seat-fill').style.transform = `scaleX(${ratio})`;
      demoSeats.hidden = false;
    } else {
      demoSeats.hidden = true;
    }
    if (apiState.kind !== 'ok') { apiState = { kind: 'ok', ms, at: new Date() }; renderApi(); }
  } catch (e) {
    demoOut.innerHTML = `<code><span class="t-dim">$ curl -s ${API}${path}</span>\n<span class="t-err">${escapeHtml(t().demoFail)}</span></code>`;
    demoLast = { kind: 'fail' };
  } finally {
    clearTimeout(slowTimer);
    demoButtons.forEach((b) => { b.disabled = false; });
    renderDemoStatus();
  }
}
demoButtons.forEach((b) => b && b.addEventListener('click', () => runDemo(b)));

/* ---------------------------------------------------------
   Más proyectos: diálogos nativos. Esc cierra, el foco queda
   dentro mientras está abierto y vuelve al botón al cerrar.
   --------------------------------------------------------- */
let lastTrigger = null;
document.querySelectorAll('[data-dialog]').forEach((trigger) => {
  const dialog = document.getElementById(trigger.dataset.dialog);
  if (!dialog || typeof dialog.showModal !== 'function') return;
  trigger.addEventListener('click', () => {
    lastTrigger = trigger;
    dialog.showModal();
    root.style.overflow = 'hidden';
    const video = dialog.querySelector('video');
    if (video && video.dataset.src && !video.getAttribute('src')) {
      video.poster = video.dataset.poster || '';
      video.src = video.dataset.src;
    }
    if (video) {
      if (reduceMotion) { video.controls = true; video.preload = 'metadata'; } else video.play().catch(() => { video.controls = true; });
    }
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || event.target.closest('[data-close]')) dialog.close();
  });
  dialog.addEventListener('close', () => {
    root.style.overflow = '';
    dialog.querySelector('video')?.pause();
    lastTrigger?.focus();
  });
});

// Video de Numi en su caso de estudio: carga y se reproduce solo mientras se ve.
// Con movimiento reducido no arranca solo y muestra controles.
const numiVideo = document.getElementById('numi-video');
if (numiVideo) {
  const loadPoster = () => { if (!numiVideo.getAttribute('poster')) numiVideo.poster = numiVideo.dataset.poster; };
  const loadVideo = () => { loadPoster(); if (!numiVideo.getAttribute('src')) numiVideo.src = numiVideo.dataset.src; };
  if (!('IntersectionObserver' in window)) {
    numiVideo.controls = true;
    loadVideo();
  } else if (reduceMotion) {
    // Sin reproducción automática: póster y controles cuando se acerca
    numiVideo.controls = true;
    numiVideo.preload = 'metadata';
    const near = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { near.disconnect(); loadVideo(); }
    }, { rootMargin: '600px 0px' });
    near.observe(numiVideo);
  } else {
    // El póster llega un poco antes de que el video entre en pantalla
    const near = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { near.disconnect(); loadPoster(); }
    }, { rootMargin: '600px 0px' });
    near.observe(numiVideo);
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { loadVideo(); numiVideo.play().catch(() => { numiVideo.controls = true; }); }
      else numiVideo.pause();
    }, { threshold: 0.35 }).observe(numiVideo);
  }
}

/* ---------------------------------------------------------
   Casos de estudio: la ficha completa se pliega. Cerrada, queda
   inerte para que el teclado no entre en ella. Sin JavaScript,
   todo queda abierto.
   --------------------------------------------------------- */
document.querySelectorAll('.case-toggle').forEach((button) => {
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  const label = button.querySelector('.case-toggle-label');
  const time = button.querySelector('.case-toggle-time');
  if (!panel || !label) return;
  const render = () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    label.textContent = open ? t().caseLess : t().caseMore;
    // Tiempo de lectura de la ficha, en el idioma activo, a 200 palabras por minuto
    if (time) {
      const words = panel.textContent.trim().split(/\s+/).length;
      time.textContent = open ? '' : ` · ${Math.max(1, Math.round(words / 200))} min`;
    }
  };
  panel.inert = true;
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
    panel.inert = !open;
    render();
    // Al cerrar desde abajo, vuelve a dejar el botón a la vista
    if (!open && button.getBoundingClientRect().top < 0) {
      button.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  });
  langListeners.push(render);
});

/* ---------------------------------------------------------
   Habilidades: la lectura del instrumento dice dónde usé cada una.
   --------------------------------------------------------- */
document.querySelectorAll('.skills').forEach((list) => {
  const readout = document.createElement('p');
  readout.className = 'tier-readout';
  readout.setAttribute('aria-hidden', 'true');
  list.after(readout);
  const idle = () => { readout.textContent = t().skillsHint; };
  const show = (li) => {
    list.querySelectorAll('li').forEach((x) => x.classList.toggle('is-active', x === li));
    readout.innerHTML = '';
    const strong = document.createElement('strong');
    strong.textContent = li.querySelector('.s-name').textContent;
    readout.append(strong, ` — ${li.querySelector('.s-where').textContent}`);
  };
  list.querySelectorAll('li').forEach((li) => {
    li.addEventListener('pointerenter', () => show(li));
    li.addEventListener('focus', () => show(li));
  });
  list.addEventListener('pointerleave', () => {
    if (!list.contains(document.activeElement)) { list.querySelectorAll('li').forEach((x) => x.classList.remove('is-active')); idle(); }
  });
  list.addEventListener('focusout', (event) => {
    if (!list.contains(event.relatedTarget)) { list.querySelectorAll('li').forEach((x) => x.classList.remove('is-active')); idle(); }
  });
  idle();
  langListeners.push(() => {
    const on = list.querySelector('li.is-active');
    if (on) show(on); else idle();
  });
});

/* ---------------------------------------------------------
   Contacto: copiar el correo, con respaldo para navegadores
   sin portapapeles.
   --------------------------------------------------------- */
const copyButton = document.getElementById('copy-mail');
const copyStatus = document.getElementById('copy-status');
let copyTimer = null;

function legacyCopy(text) {
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
  area.remove();
  return ok;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    return legacyCopy(text);
  }
}

copyButton.addEventListener('click', async () => {
  const ok = await copyText(copyButton.dataset.mail);
  copyStatus.textContent = ok ? t().copiedMsg : t().copyFail;
  if (ok) {
    copyButton.textContent = t().copied;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { copyButton.textContent = t().copy; copyStatus.textContent = ''; }, 2400);
  }
});

/* ---------------------------------------------------------
   Capturas: aparecen con un fundido cuando terminan de cargar,
   sobre un fondo del color del papel. Las que ya cargaron no cambian.
   --------------------------------------------------------- */
document.querySelectorAll('.browser img, img.phone, .phone-shot, .more-media img').forEach((img) => {
  if (img.complete && img.naturalWidth) return;
  img.classList.add('fade-img');
  const done = () => img.classList.add('is-loaded');
  img.addEventListener('load', done, { once: true });
  img.addEventListener('error', done, { once: true });
});

// Al imprimir, las capturas diferidas se cargan para que no salgan en blanco
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
});

/* ---------------------------------------------------------
   Luz que sigue al cursor en las tarjetas de proyecto. Solo con
   mouse y sin movimiento reducido; se mueve con transform.
   --------------------------------------------------------- */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
  document.querySelectorAll('.case, .more-card').forEach((card) => {
    const spot = document.createElement('span');
    spot.className = 'spot';
    spot.setAttribute('aria-hidden', 'true');
    card.prepend(spot);
    let frame = 0;
    card.addEventListener('pointermove', (event) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const box = card.getBoundingClientRect();
        spot.style.setProperty('--x', `${Math.round(event.clientX - box.left)}px`);
        spot.style.setProperty('--y', `${Math.round(event.clientY - box.top)}px`);
      });
    });
  });
}

/* ---------------------------------------------------------
   Contacto: la hora en Medellín, al minuto.
   --------------------------------------------------------- */
const localTime = document.getElementById('local-time');
const localTimeText = document.getElementById('local-time-text');
// El formateador con zona horaria es caro de crear: se guarda uno por idioma
const clockFormats = {};
let clockStarted = false;
function renderLocalTime() {
  if (!clockStarted) return;
  try {
    clockFormats[lang] ||= new Intl.DateTimeFormat(t().locale, { hour: 'numeric', minute: '2-digit', timeZone: 'America/Bogota' });
    localTimeText.textContent = t().localTime(clockFormats[lang].format(new Date()));
    localTime.hidden = false;
  } catch (e) { localTime.hidden = true; }
}
langListeners.push(renderLocalTime);
// Arranca cuando la página ya cargó, para no competir con el primer pintado
function startClock() {
  clockStarted = true;
  renderLocalTime();
  // Se alinea con el cambio de minuto y luego avanza cada 60 s
  setTimeout(() => { renderLocalTime(); setInterval(renderLocalTime, 60000); }, 60000 - (Date.now() % 60000) + 50);
}

/* ---------------------------------------------------------
   Pie: cuándo se actualizó el sitio por última vez, según el
   último commit en GitHub. Si la API falla, la línea no aparece.
   --------------------------------------------------------- */
const siteUpdated = document.getElementById('site-updated');
let lastCommit = null;
function renderSiteUpdated() {
  if (!lastCommit) return;
  const days = Math.max(0, Math.round((Date.now() - lastCommit.getTime()) / 86400000));
  const rtf = new Intl.RelativeTimeFormat(t().locale, { numeric: 'auto' });
  const when = days < 45 ? rtf.format(-days, 'day') : rtf.format(-Math.round(days / 30), 'month');
  siteUpdated.textContent = t().siteUpdated(when);
  siteUpdated.hidden = false;
}
langListeners.push(renderSiteUpdated);
async function loadSiteUpdated() {
  try {
    let iso = null;
    try { iso = sessionStorage.getItem('site-updated'); } catch (e) { /* sin almacenamiento */ }
    if (!iso) {
      const res = await fetch('https://api.github.com/repos/AlexanderM-Code/AlexanderM-Code.github.io/commits?per_page=1', { headers: { Accept: 'application/vnd.github+json' } });
      if (!res.ok) return;
      const [commit] = await res.json();
      iso = commit?.commit?.committer?.date;
      if (!iso) return;
      try { sessionStorage.setItem('site-updated', iso); } catch (e) { /* sin almacenamiento */ }
    }
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return;
    lastCommit = date;
    renderSiteUpdated();
  } catch (e) { /* sin conexión o sin permiso: la línea sigue oculta */ }
}

/* ---------------------------------------------------------
   Aviso breve, para acciones que no tienen dónde mostrar su resultado.
   --------------------------------------------------------- */
const toast = document.getElementById('toast');
let toastTimer = null;
function showToast(text) {
  toast.textContent = text;
  toast.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.classList.remove('is-on'); setTimeout(() => { toast.textContent = ''; }, 250); }, 2200);
}

/* ---------------------------------------------------------
   Paleta de comandos: Ctrl/⌘ + K, o el botón de búsqueda.
   Un <dialog> modal deja el resto de la página inerte y cierra
   con Esc; las flechas recorren las opciones (aria-activedescendant).
   Sin animación de entrada: se usa con el teclado y debe ser inmediata.
   --------------------------------------------------------- */
const cmdk = document.getElementById('cmdk');
const cmdkInput = document.getElementById('cmdk-input');
const cmdkList = document.getElementById('cmdk-list');
const cmdkEmpty = document.getElementById('cmdk-empty');
const isMac = /Mac|iPhone|iPad/.test(navigator.userAgentData?.platform || navigator.platform || navigator.userAgent);
document.querySelectorAll('.cmdk-kbd').forEach((k) => { k.textContent = isMac ? '⌘K' : 'Ctrl K'; });

const CMDK_TEXT = {
  es: { sections: 'Secciones', projects: 'Proyectos', actions: 'Acciones', empty: (q) => `Nada coincide con «${q}».`, section: 'sección', project: 'proyecto', mailCopied: 'Correo copiado al portapapeles.', mailFail: 'No se pudo copiar el correo.' },
  en: { sections: 'Sections', projects: 'Projects', actions: 'Actions', empty: (q) => `Nothing matches “${q}”.`, section: 'section', project: 'project', mailCopied: 'Email copied to the clipboard.', mailFail: 'Could not copy the email.' }
};
const goTo = (hash) => () => {
  const target = document.querySelector(hash);
  if (!target) return;
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  history.pushState(null, '', hash);
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
};
const openDialog = (id) => () => document.querySelector(`[data-dialog="${id}"]`)?.click();
const openUrl = (url) => () => window.open(url, '_blank', 'noopener');
const download = (href) => () => {
  const a = document.createElement('a');
  a.href = href; a.download = '';
  document.body.appendChild(a); a.click(); a.remove();
};
const CV = 'cv/CV_Alexander_Mejia_Ospina.pdf';
const CV_EN = 'cv/Resume_Alexander_Mejia_Ospina_EN.pdf';
const CV_DATA = 'cv/CV_Alexander_Mejia_Ospina_Analista_Datos.pdf';

const CMDK_ITEMS = [
  ['sections', 'Inicio', 'Home', '', goTo('#inicio')],
  ['sections', 'Proyectos', 'Projects', 'casos', goTo('#proyectos')],
  ['sections', 'Datos: gráfica del Observatorio', 'Data: Observatory chart', 'dengue malaria varicela', goTo('#datos')],
  ['sections', 'Más proyectos', 'More projects', '', goTo('#mas-proyectos')],
  ['sections', 'Habilidades', 'Skills', '', goTo('#habilidades')],
  ['sections', 'Certificaciones', 'Certifications', 'google cloud cisco credly diplomados', goTo('#certificaciones')],
  ['sections', 'Cómo trabajo', 'How I work', 'hábitos habits', goTo('#como-trabajo')],
  ['sections', 'Trayectoria', 'Journey', '', goTo('#trayectoria')],
  ['sections', 'Sobre mí', 'About me', '', goTo('#sobre-mi')],
  ['sections', 'Contacto', 'Contact', 'correo email', goTo('#contacto')],
  ['projects', 'Observatorio de Salud Pública de Antioquia', 'Antioquia Public Health Observatory', 'python sql etl', goTo('#observatorio')],
  ['projects', 'Numi', 'Numi', 'flutter app rag ia ai', goTo('#numi')],
  ['projects', 'CineX', 'CineX', 'java spring api', goTo('#cinex')],
  ['projects', 'Casa Rendón', 'Casa Rendon', 'react cliente client', openDialog('dlg-casa')],
  ['projects', 'Datos con Python', 'Data with Python', 'regresión regression', openDialog('dlg-datos')],
  ['projects', 'Arduino y cerradura RFID', 'Arduino and RFID lock', 'computación ubicua iot sensores sensors', openDialog('dlg-rfid')],
  ['projects', 'BlackJack Royale', 'BlackJack Royale', 'juego game websockets', openDialog('dlg-blackjack')],
  ['actions', 'Descargar hoja de vida (español)', 'Download resume (Spanish)', 'cv pdf', download(CV), 'PDF'],
  ['actions', 'Descargar hoja de vida (inglés)', 'Download resume (English)', 'cv pdf', download(CV_EN), 'PDF'],
  ['actions', 'Descargar hoja de vida de analista de datos', 'Download data analyst resume (Spanish)', 'cv pdf datos', download(CV_DATA), 'PDF'],
  ['actions', 'Copiar correo', 'Copy email', 'mail gmail', async () => {
    const ok = await copyText(copyButton.dataset.mail);
    showToast(ok ? CMDK_TEXT[lang].mailCopied : CMDK_TEXT[lang].mailFail);
  }],
  ['actions', 'Abrir GitHub', 'Open GitHub', 'código code', openUrl('https://github.com/AlexanderM-Code'), '↗'],
  ['actions', 'Abrir LinkedIn', 'Open LinkedIn', '', openUrl('https://www.linkedin.com/in/alexander-mejia-ospina'), '↗'],
  ['actions', 'Cambiar tema claro / oscuro', 'Switch light / dark theme', 'dark light modo mode', () => themeToggle.click()],
  ['actions', 'Read this page in English', 'Leer esta página en español', 'idioma language ingles english espanol', () => langToggle.click()]
].map(([group, es, en, keywords, run, hint = ''], i) => ({ id: `cmdk-opt-${i}`, group, es, en, keywords, run, hint }));

const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
let cmdkResults = [];
let cmdkIndex = 0;
let cmdkOpener = null;

function renderCmdk() {
  const text = CMDK_TEXT[lang];
  const words = normalize(cmdkInput.value.trim()).split(/\s+/).filter(Boolean);
  cmdkResults = CMDK_ITEMS.filter((item) => {
    const hay = normalize(`${item.es} ${item.en} ${item.keywords}`);
    return words.every((w) => hay.includes(w));
  });
  cmdkIndex = Math.min(cmdkIndex, Math.max(0, cmdkResults.length - 1));
  cmdkList.textContent = '';
  let group = null;
  cmdkResults.forEach((item, i) => {
    if (item.group !== group) {
      group = item.group;
      const head = document.createElement('li');
      head.className = 'cmdk-group';
      head.setAttribute('role', 'presentation');
      head.textContent = text[group];
      cmdkList.append(head);
    }
    const li = document.createElement('li');
    li.className = 'cmdk-item';
    li.id = item.id;
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', String(i === cmdkIndex));
    const label = document.createElement('span');
    label.className = 'cmdk-label';
    label.textContent = item[lang];
    label.lang = item === CMDK_ITEMS[CMDK_ITEMS.length - 1] ? (lang === 'es' ? 'en' : 'es') : lang;
    li.append(label);
    const hint = item.hint || (group === 'sections' ? text.section : group === 'projects' ? text.project : '');
    if (hint) {
      const h = document.createElement('span');
      h.className = 'cmdk-hint';
      h.setAttribute('aria-hidden', 'true');
      h.textContent = hint;
      li.append(h);
    }
    li.addEventListener('pointermove', () => { if (cmdkIndex !== i) { cmdkIndex = i; markCmdk(); } });
    li.addEventListener('click', () => runCmdk(i));
    cmdkList.append(li);
  });
  cmdkEmpty.hidden = cmdkResults.length > 0;
  cmdkEmpty.textContent = cmdkResults.length ? '' : text.empty(cmdkInput.value.trim());
  markCmdk();
}

function markCmdk() {
  const current = cmdkResults[cmdkIndex];
  cmdkList.querySelectorAll('.cmdk-item').forEach((li) => li.setAttribute('aria-selected', String(li.id === current?.id)));
  if (current) {
    cmdkInput.setAttribute('aria-activedescendant', current.id);
    document.getElementById(current.id)?.scrollIntoView({ block: 'nearest' });
  } else {
    cmdkInput.removeAttribute('aria-activedescendant');
  }
}

function runCmdk(i) {
  const item = cmdkResults[i];
  if (!item) return;
  cmdk.close();
  item.run();
}

function openCmdk(opener) {
  document.querySelectorAll('dialog.dlg[open]').forEach((d) => d.close());
  if (nav.classList.contains('is-open')) setMenu(false, { focus: false });
  cmdkOpener = opener || document.activeElement;
  cmdkInput.value = '';
  cmdkIndex = 0;
  renderCmdk();
  cmdk.showModal();
  root.style.overflow = 'hidden';
  cmdkInput.focus();
}

document.querySelectorAll('.cmdk-open').forEach((b) => b.addEventListener('click', () => openCmdk(b)));
cmdk.querySelector('.cmdk-close').addEventListener('click', () => cmdk.close());
cmdk.addEventListener('click', (event) => { if (event.target === cmdk) cmdk.close(); });
cmdk.addEventListener('close', () => {
  root.style.overflow = '';
  if (cmdkOpener && document.contains(cmdkOpener) && document.activeElement === document.body) cmdkOpener.focus();
});
cmdkInput.addEventListener('input', () => { cmdkIndex = 0; renderCmdk(); });
cmdkInput.addEventListener('keydown', (event) => {
  const n = cmdkResults.length;
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    if (!n) return;
    cmdkIndex = (cmdkIndex + (event.key === 'ArrowDown' ? 1 : -1) + n) % n;
    markCmdk();
  } else if (event.key === 'Home' && n) { event.preventDefault(); cmdkIndex = 0; markCmdk(); }
  else if (event.key === 'End' && n) { event.preventDefault(); cmdkIndex = n - 1; markCmdk(); }
  else if (event.key === 'Enter') { event.preventDefault(); runCmdk(cmdkIndex); }
});
document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (cmdk.open) cmdk.close(); else openCmdk();
  }
});

/* ---------------------------------------------------------
   Entradas al hacer scroll: una vez por bloque, escalonadas.
   Lo que ya está en pantalla al cargar no se esconde.
   --------------------------------------------------------- */
const revealGroups = [
  '.section-head > *', '.case', '.more-card', '.tier', '.habit', '.t-item', '.prose', '.facts-panel',
  '.contact-title', '.mail-box', '.contact-links'
];
const revealEls = [];
revealGroups.forEach((selector) => {
  document.querySelectorAll(selector).forEach((el) => {
    // C y D van dentro de .tier-side; se cuentan junto a A y B para mantener el orden de lectura.
    const siblings = el.matches('.tier')
      ? [...el.closest('.tiers').querySelectorAll('.tier')]
      : [...el.parentElement.children].filter((c) => c.matches(selector));
    el.style.setProperty('--i', Math.min(siblings.indexOf(el), 5));
    revealEls.push(el);
  });
});

if ('IntersectionObserver' in window && !reduceMotion) {
  const vh = window.innerHeight;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  revealEls.forEach((el) => {
    // Lo que ya se ve no se esconde. Lo que está dentro de una sección aún sin
    // pintar (content-visibility) mide 0 de alto: se anima cuando aparezca.
    const box = el.getBoundingClientRect();
    if (box.height && box.top < vh) return;
    el.classList.add('reveal');
    io.observe(el);
  });

  // La gráfica se dibuja y las cifras cuentan cuando aparecen
  const once = (el, fn, threshold = 0.35) => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { obs.disconnect(); fn(); }
    }, { threshold });
    obs.observe(el);
  };
  once(document.querySelector('.metrics'), runCounters, 0.4);
  once(chart.el, loadChart, 0.15);
} else {
  loadChart();
}

/* ---------------------------------------------------------
   Arranque
   --------------------------------------------------------- */
const pending = root.getAttribute('data-lang-pending');
let saved = null;
try { saved = localStorage.getItem('lang'); } catch (e) { /* sin almacenamiento */ }
const fromQuery = /[?&]lang=(es|en)\b/.exec(location.search);
if (pending === 'en' || (!saved && !fromQuery && !(navigator.language || 'es').toLowerCase().startsWith('es'))) {
  setLang('en', { save: Boolean(saved) || Boolean(fromQuery) });
} else {
  langListeners.forEach((fn) => { try { fn(); } catch (e) { /* sigue */ } });
}
root.removeAttribute('data-lang-pending');
// La API se consulta cuando la página terminó de cargar, para no competir con lo esencial
const afterLoad = () => {
  checkApi();
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1200));
  idle(startClock);
  idle(loadSiteUpdated);
};
if (document.readyState === 'complete') afterLoad();
else window.addEventListener('load', afterLoad, { once: true });

/* ---------------------------------------------------------
   Campo de datos del inicio: una superficie de puntos en
   perspectiva que ondula sin parar, como un mar de datos.
   El cursor levanta una colina azul, cada clic lanza una onda
   naranja que recorre la superficie y cada pocos segundos
   aparece un pulso suave. Con "reducir movimiento" se dibuja
   quieta y solo reacciona al cursor.
   --------------------------------------------------------- */
(() => {
  const field = document.querySelector('.hero-field');
  const canvas = document.getElementById('hero-canvas');
  const hero = document.getElementById('inicio');
  if (!field || !canvas || !hero || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  let COLS = 34, ROWS = 22;
  let w = 0, h = 0, dpr = 1, pts = [], col = {};
  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, on: 0, target: 0 };
  let waves = [];
  let running = false, visible = true, raf = 0, ultimoPulso = 0, ultimoUso = -99;
  const t0 = performance.now();
  const ahora = () => (performance.now() - t0) / 1000;

  // Convierte cualquier color CSS a [r, g, b]
  const rgb = (c) => {
    ctx.fillStyle = '#000'; ctx.fillStyle = c;
    const v = ctx.fillStyle;
    if (v[0] === '#') return [1, 3, 5].map((k) => parseInt(v.slice(k, k + 2), 16));
    return v.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
  };
  const mezcla = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));

  const leerColores = () => {
    const cs = getComputedStyle(root);
    col = {
      ink: rgb(cs.getPropertyValue('--ink').trim() || '#17181c'),
      blue: rgb(cs.getPropertyValue('--blue').trim() || '#2141b5'),
      orange: rgb(cs.getPropertyValue('--orange').trim() || '#e2560e'),
    };
  };

  // Cuadrícula en perspectiva: las filas lejanas arriba y más juntas
  const medir = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    COLS = Math.max(18, Math.min(56, Math.round(w / 30)));
    ROWS = Math.max(16, Math.min(30, Math.round(h / 26)));
    pts = [];
    for (let j = 0; j < ROWS; j++) {
      const d = j / (ROWS - 1);                  // 0 = fondo, 1 = frente
      const s = 0.32 + 0.68 * d ** 1.15;         // escala por profundidad
      const y = h * (0.06 + 0.9 * d ** 1.3);
      for (let i = 0; i < COLS; i++) {
        const u = i / (COLS - 1) - 0.5;
        pts.push({ i, j, d, s, bx: w * (0.5 + u * 1.25 * s), by: y, x: 0, y: 0, alt: 0 });
      }
    }
    if (!running) pintar();
  };

  const pintar = () => {
    const t = ahora();
    ctx.clearRect(0, 0, w, h);
    // El cursor se mueve con suavidad
    mouse.x += (mouse.tx - mouse.x) * 0.14;
    mouse.y += (mouse.ty - mouse.y) * 0.14;
    mouse.on += (mouse.target - mouse.on) * 0.08;
    waves = waves.filter((o) => t - o.t < 3.2);

    for (const p of pts) {
      // Mar de fondo: tres olas suaves que se cruzan
      let alt = Math.sin(p.i * 0.32 + t * 1.15) * 0.55
              + Math.sin(p.j * 0.42 - t * 0.9 + p.i * 0.08) * 0.45
              + Math.sin((p.i + p.j) * 0.16 + t * 0.6) * 0.35;
      let azul = 0, naranja = 0;
      // Colina bajo el cursor
      if (mouse.on > 0.01) {
        const dx = p.bx - mouse.x, dy = (p.by - mouse.y) * 1.6;
        const k = Math.exp(-(dx * dx + dy * dy) / (2 * 120 * 120)) * mouse.on;
        alt += k * 3.6; azul = k;
      }
      // Ondas de clics y pulsos
      for (const o of waves) {
        const edad = t - o.t;
        const dist = Math.hypot(p.bx - o.x, (p.by - o.y) * 1.6);
        const frente = edad * 340;
        const k = Math.exp(-((dist - frente) ** 2) / (2 * 34 * 34)) * (1 - edad / 3.2) * o.fuerza;
        alt += k * 2.6;
        if (o.clic) naranja = Math.max(naranja, k); else azul = Math.max(azul, k * 0.6);
      }
      p.alt = alt; p.azul = azul; p.nar = naranja;
      p.x = p.bx;
      p.y = p.by - alt * 15 * p.s;
    }

    // Líneas de cada fila: dan la sensación de superficie
    ctx.lineWidth = 1;
    for (let j = 0; j < ROWS; j++) {
      const fila = pts.slice(j * COLS, (j + 1) * COLS);
      ctx.strokeStyle = `rgba(${col.ink.join(',')},${0.05 + 0.12 * fila[0].d})`;
      ctx.beginPath();
      fila.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
    }

    // Puntos, del fondo hacia el frente
    for (const p of pts) {
      const cresta = Math.max(0, Math.min(1, (p.alt + 1.2) / 3));
      let c = mezcla(col.ink, col.blue, Math.min(1, cresta * 0.7 + p.azul));
      if (p.nar > 0.04) c = mezcla(c, col.orange, Math.min(1, p.nar * 1.4));
      ctx.fillStyle = `rgb(${c.join(',')})`;
      ctx.globalAlpha = Math.min(1, 0.22 + p.d * 0.5 + cresta * 0.3 + p.azul * 0.4 + p.nar * 0.5);
      ctx.beginPath();
      ctx.arc(p.x, p.y, (0.9 + 2 * p.s) * (0.8 + cresta * 0.7), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  const ciclo = () => {
    const t = ahora();
    // Un pulso suave cada pocos segundos si nadie está interactuando
    if (t - ultimoPulso > 4.2 && t - ultimoUso > 3) {
      ultimoPulso = t;
      waves.push({ x: w * (0.45 + Math.random() * 0.45), y: h * (0.3 + Math.random() * 0.45), t, fuerza: 0.7, clic: false });
    }
    pintar();
    raf = requestAnimationFrame(ciclo);
  };
  const iniciar = () => {
    if (running || reduceMotion || !visible || document.hidden) return;
    running = true; raf = requestAnimationFrame(ciclo);
  };
  const parar = () => { running = false; cancelAnimationFrame(raf); };

  const local = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const dentro = (q) => q.x >= 0 && q.x <= w && q.y >= 0 && q.y <= h;
  hero.addEventListener('pointermove', (e) => {
    const q = local(e);
    mouse.tx = q.x; mouse.ty = q.y;
    if (mouse.x < -999) { mouse.x = q.x; mouse.y = q.y; }
    mouse.target = dentro(q) ? 1 : 0;
    if (dentro(q)) { field.classList.add('is-used'); ultimoUso = ahora(); }
    if (reduceMotion) { mouse.x = q.x; mouse.y = q.y; mouse.on = mouse.target; pintar(); }
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { mouse.target = 0; if (reduceMotion) { mouse.on = 0; pintar(); } });
  hero.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button')) return;
    const q = local(e);
    if (!dentro(q)) return;
    waves.push({ ...q, t: ahora(), fuerza: 1, clic: true });
    field.classList.add('is-used'); ultimoUso = ahora();
    if (reduceMotion) pintar();
  });

  leerColores();
  medir();
  new ResizeObserver(medir).observe(canvas);
  const recolor = () => { leerColores(); if (!running) pintar(); };
  new MutationObserver(recolor).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', recolor);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? iniciar() : parar(); }).observe(hero);
  document.addEventListener('visibilitychange', () => (document.hidden ? parar() : iniciar()));
  iniciar();
})();
