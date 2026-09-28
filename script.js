/* ===== TEXTOS DA TELA INICIAL (edite aqui) ===== */
const LINE1 = "Eu pensei em mandar uma mensagem normal…";
const LINE2 = "Mas aparentemente meu cérebro achou mais razoável fazer um site inteiro.";
/* ===== EASTER EGG (5 toques no título "Relatório técnico") ===== */
const EGG = "Tá procurando bug no meu site ou desculpa pra ficar aqui mais tempo?";
/* =============================================== */

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --- Poeira/brasas sutis no fundo (canvas leve) --- */
const cv = $('#dust'), ctx = cv.getContext('2d');
let dust = [];
function sizeDust(){
  cv.width = innerWidth; cv.height = innerHeight;
  dust = Array.from({length: 40}, () => ({x: Math.random() * cv.width, y: Math.random() * cv.height,
    r: Math.random() * 1.1 + .3, v: Math.random() * .18 + .04, red: Math.random() < .2, p: Math.random() * 6}));
}
function drawDust(t){
  ctx.clearRect(0, 0, cv.width, cv.height);
  for (const s of dust){
    s.y -= s.v; if (s.y < 0) s.y = cv.height;
    ctx.globalAlpha = .12 + .18 * Math.sin(t / 1100 + s.p) ** 2;
    ctx.fillStyle = s.red ? '#a52a3a' : '#9a9a9a';
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
  }
  if (!reduced) requestAnimationFrame(drawDust);
}
addEventListener('resize', sizeDust); sizeDust(); requestAnimationFrame(drawDust);

/* --- Digitação da tela inicial --- */
function type(el, text, speed){
  return new Promise(res => {
    let i = 0; el.classList.add('cursor');
    (function tick(){
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, speed);
      else { el.classList.remove('cursor'); res(); }
    })();
  });
}
(async () => {
  await type($('#l1'), LINE1, 38);
  await new Promise(r => setTimeout(r, 500));
  await type($('#l2'), LINE2, 30);
  $('#enter').hidden = false;
})();

/* --- Entrar no site --- */
$('#enter').onclick = () => {
  $('#intro').classList.add('leave');
  setTimeout(() => {
    const intro = $('#intro');
    const site = $('#site');
    intro.hidden = true;
    intro.style.display = 'none';
    site.hidden = false;
    scrollTo({ top: 0, left: 0, behavior: 'auto' });
    watch();
  }, 850);
};

/* --- Animações ao rolar (IntersectionObserver) --- */
function watch(){
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; el.classList.add('in'); io.unobserve(el);
    el.querySelectorAll('.rep').forEach((r, i) =>
      setTimeout(() => r.querySelector('i').style.width = Math.min(r.dataset.v, 100) + '%', 200 + i * 180));
    el.querySelectorAll('[data-n]').forEach(countUp);
  }), {threshold: .2});
  $$('.reveal,.fade,.line').forEach(el => io.observe(el));
}

/* --- Números subindo nas estatísticas --- */
function countUp(el){
  const end = +el.dataset.n, d = +el.dataset.d, s = el.dataset.s || '', t0 = performance.now();
  (function f(t){
    const p = Math.min((t - t0) / 1500, 1);
    el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(d).replace('.', ',') + s;
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}

/* --- Easter eggs --- */
function toast(msg){
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 3500);
}
let taps = 0;
$('#secretTitle').onclick = () => { if (++taps >= 5){ taps = 0; toast(EGG); } };
$('#dot').onclick = () => $('#credit').hidden = false;

/* --- Resposta final: corações vinho subindo, discretos --- */
$$('.answer').forEach(b => b.onclick = () => {
  $('#ask').hidden = true; $('#done').hidden = false;
  for (let i = 0; i < 22; i++){
    const h = document.createElement('span');
    h.className = 'ember'; h.textContent = i % 3 ? '❤' : '•';
    h.style.cssText = `left:${Math.random() * 94}vw;font-size:${10 + Math.random() * 14}px;--dx:${(Math.random() - .5) * 60}px;animation-duration:${3 + Math.random() * 3}s;animation-delay:${Math.random() * 1.2}s`;
    document.body.appendChild(h); setTimeout(() => h.remove(), 7500);
  }
});



/* --- Trilha sonora local: começa em 0:54 --- */
const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicPlay');
const MUSIC_START = 54;
let musicStarted = false;

if (music && musicBtn) {
  music.addEventListener('loadedmetadata', () => {
    if (!musicStarted && Number.isFinite(music.duration) && music.duration > MUSIC_START) {
      music.currentTime = MUSIC_START;
    }
  });

  musicBtn.addEventListener('click', async () => {
    try {
      if (music.paused) {
        if (!musicStarted || music.currentTime < MUSIC_START - 1) {
          music.currentTime = MUSIC_START;
        }
        await music.play();
        musicStarted = true;
        musicBtn.textContent = '❚❚ Pausar música';
      } else {
        music.pause();
        musicBtn.textContent = '▶ Continuar música';
      }
    } catch (err) {
      toast('Não consegui iniciar a música. Toca de novo no botão 🎧');
    }
  });

  music.addEventListener('ended', () => {
    musicBtn.textContent = '▶ Tocar de novo';
    musicStarted = false;
    music.currentTime = MUSIC_START;
  });
}


/* --- Corações discretos caindo pelas laterais --- */
let sideHeartsTimer = null;

function spawnSideHeart(initial = false){
  if (document.hidden) return;

  const current = document.querySelectorAll('.side-heart').length;
  if (current >= 14) return;

  const h = document.createElement('span');
  h.className = 'side-heart';
  h.textContent = Math.random() < .72 ? '♥' : '♡';

  const leftSide = Math.random() < .5;
  const edge = 10 + Math.random() * 22;
  h.style.left = leftSide ? `${edge}px` : 'auto';
  h.style.right = leftSide ? 'auto' : `${edge}px`;
  h.style.fontSize = `${12 + Math.random() * 8}px`;
  h.style.animationDuration = `${7.5 + Math.random() * 4}s`;
  h.style.setProperty('--heart-opacity', (0.28 + Math.random() * 0.18).toFixed(2));
  h.style.setProperty('--heart-drift', `${(leftSide ? 1 : -1) * (5 + Math.random() * 18)}px`);
  h.style.setProperty('--heart-rot', `${(Math.random() < .5 ? -1 : 1) * (40 + Math.random() * 120)}deg`);

  // Os primeiros já surgem dentro da tela, para o efeito ficar visível na hora.
  if (initial) {
    h.style.top = `${6 + Math.random() * 76}vh`;
    h.style.animationDelay = `${-Math.random() * 4}s`;
  }

  document.body.appendChild(h);
  h.addEventListener('animationend', () => h.remove(), {once:true});
}

function startSideHearts(){
  if (sideHeartsTimer) return;

  // Preenche as duas laterais imediatamente.
  for (let i = 0; i < 8; i++) spawnSideHeart(true);

  sideHeartsTimer = setInterval(() => {
    spawnSideHeart(false);
    if (Math.random() < .55) {
      setTimeout(() => spawnSideHeart(false), 260 + Math.random() * 300);
    }
  }, 1100);
}

// Começa o efeito quando ela entra de verdade no site.
const originalEnterHandler = $('#enter').onclick;
$('#enter').onclick = () => {
  originalEnterHandler();
  setTimeout(startSideHearts, 900);
};
