// BIBLIOTECA da skill-internacional · reels da Resultax Internacional em motion graphics colorido (sem apresentador).
// O montar.mjs põe este arquivo (e src/mapas.js) ANTES do src/beats.js: as cenas usam tudo daqui sem importar nada.
// Fundo neutro escuro, ilustração plana colorida, câmera (cam/camSet), objetos andando por caminho (along), desenhos prontos
// (CHAR, SUITCASE, FLAG_UY, FLAG_BR, COIN, CASH, BAR, PIGGY, NEWS, TILE, BADGE, CHIP, LEAD) e a mixagem dos efeitos (GAIN).
// Conteúdo em y 240–1120; a legenda (K.mouthCaps no fim do beats.js) fica em ~y 1190. Não declare uma variável chamada $ (o kit já usa); use q1 e $$.
const A = (p, n = 1, after = 0) => K.at(p, n, after);
const UI = document.querySelector("#ui");
const FULL = `position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:visible`;
const C = { green: "#22a455", green2: "#16803f", yellow: "#ffd23f", blue: "#3d8bfd", sky: "#5aa9e6", navy: "#1d2b53", red: "#ff4d4d",
  orange: "#ff8a3d", purple: "#8a05be", pink: "#ff8fb1", gold: "#f5c542", gold2: "#c9971c", skin: "#e3a77c", land: "#2a2f3a", landS: "#4b5262",
  white: "#ffffff", paper: "#f6f1e7", ink: "#1b1d24", teal: "#20b2a0", muted: "#9aa3b2" };
const SH = "filter:drop-shadow(0 18px 30px rgba(0,0,0,.55))";

/** cena: div absoluta; entra com blur→nítido em t, sai em until */
const scene = (html, t, until, opt = {}) => {
  const g = document.createElement("div");
  g.className = "k"; g.style.inset = "0"; g.innerHTML = html; UI.appendChild(g);
  K.fromTo(g, { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)", duration: opt.d || 0.3, ease: "power3.out" }, t);
  if (until) K.out(g, until, 0.25);
  return g;
};
const q1 = (g, s) => g.querySelector(s);
const $$ = (g, s) => [...g.querySelectorAll(s)];
const svgO = (e) => { if (e instanceof SVGElement) gsap.set(e, { transformOrigin: "50% 50%", transformBox: "fill-box" }); };
/** entra com pop elástico */
const pop = (els, t, stagger = 0.08, from = 0.2) => els.forEach((e, i) => {
  e.style.opacity = "0"; svgO(e);
  K.fromTo(e, { opacity: 0, scale: from }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.2)" }, t + i * stagger);
});
/** cai de cima com quique */
const drop = (els, t, stagger = 0.08, dy = -260) => els.forEach((e, i) => {
  e.style.opacity = "0"; svgO(e);
  K.fromTo(e, { opacity: 0, y: dy }, { opacity: 1, y: 0, duration: 0.6, ease: "bounce.out" }, t + i * stagger);
});
/** desliza de um lado */
const slide = (els, t, dx = -300, stagger = 0.1, rot = 0) => els.forEach((e, i) => {
  e.style.opacity = "0"; svgO(e);
  K.fromTo(e, { opacity: 0, x: dx, rotation: rot }, { opacity: 1, x: 0, rotation: 0, duration: 0.5, ease: "power3.out" }, t + i * stagger);
});
/** desenha um traço */
const draw = (els, t, d = 0.6, stagger = 0, ease = "power2.inOut") => els.forEach((e, i) => {
  const L = Math.ceil(e.getTotalLength()) + 2;
  e.style.strokeDasharray = L; e.style.strokeDashoffset = L;
  tl.fromTo(e, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: d, ease, immediateRender: false }, t + i * stagger);
});
/** objeto (HTML ou SVG <g>) andando por um <path>, girando na direção */
const along = (e, path, t, d, opt = {}) => {
  const L = path.getTotalLength(), P = { u: 0 }, svg = e instanceof SVGElement;
  const put = (u) => { const a = path.getPointAtLength(u * L), b = path.getPointAtLength(Math.min(L, u * L + 2)), c = path.getPointAtLength(Math.max(0, u * L - 2));
    const ang = Math.atan2(b.y - c.y, b.x - c.x) * 180 / Math.PI + (opt.rot || 0);
    if (svg) e.setAttribute("transform", `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${ang.toFixed(1)})${opt.scale ? ` scale(${opt.scale})` : ""}`);
    else e.style.transform = `translate(${(a.x - (opt.w || 0) / 2).toFixed(1)}px,${(a.y - (opt.w || 0) / 2).toFixed(1)}px) rotate(${ang.toFixed(1)}deg)`; };
  put(0);
  tl.fromTo(P, { u: 0 }, { u: 1, duration: d, ease: opt.ease || "power1.inOut", immediateRender: false, onUpdate() { put(P.u); } }, t);
  K.fromTo(e, { opacity: 0 }, { opacity: 1, duration: 0.12 }, t);
};
/** câmera: leva o ponto (x,y) do conteúdo para (cx,cy) da tela com escala s */
const cam = (e, x, y, s, t, d = 0.9, cx = 540, cy = 680, ease = "power3.inOut") => {
  gsap.set(e, { transformOrigin: "0 0" });
  tl.to(e, { x: cx - x * s, y: cy - y * s, scale: s, duration: d, ease }, t);
};
const camSet = (e, x, y, s, t, cx = 540, cy = 680) => { gsap.set(e, { transformOrigin: "0 0" }); K.set(e, { x: cx - x * s, y: cy - y * s, scale: s }, t); };
/** pulso */
const pulse = (e, a, b, k = 1.08, per = 0.8) => { svgO(e);
  for (let s = a; s < b - per; s += per) tl.fromTo(e, { scale: 1 }, { scale: k, duration: per / 2, yoyo: true, repeat: 1, ease: "sine.inOut", immediateRender: false }, s); };
/** flutua */
const float = (e, a, b, amp = 12, per = 2.2) => { for (let s = a; s < b - 0.2; s += per) tl.fromTo(e, { y: 0 }, { y: -amp, duration: per / 2, yoyo: true, repeat: 1, ease: "sine.inOut", immediateRender: false }, s); };
const shake = (e, t, n = 6, a = 10) => tl.to(e, { x: a, duration: 0.05, yoyo: true, repeat: n }, t);
const count = (e, a, b, t, d, fmt = (v) => Math.round(v)) => { const P = { v: a }; e.textContent = fmt(a);
  tl.fromTo(P, { v: a }, { v: b, duration: d, ease: "power2.out", immediateRender: false, onUpdate() { e.textContent = fmt(P.v); } }, t); };
/** rótulo fino com linha-guia (estilo do reel de referência) */
const LEAD = (txt, x1, y1, x2, y2, cls, opt = {}) => `<svg class="${cls}" style="${FULL}"><path d="M${x1} ${y1} L${x2} ${y2}" style="stroke:${opt.c || "#fff"};stroke-width:2.5;fill:none;opacity:.85"/><circle cx="${x1}" cy="${y1}" r="6" fill="${opt.c || "#fff"}"/></svg>
  <div class="${cls}" style="position:absolute;left:${x2}px;top:${y2 - 34}px;${opt.right ? "transform:translateX(-100%);" : ""}white-space:nowrap;font:800 ${opt.size || 30}px/1 var(--fS);letter-spacing:.12em;color:${opt.c || "#fff"};text-transform:uppercase">${txt}</div>`;
/** etiqueta (chip) colorida */
const CHIP = (txt, x, y, cls, bg = "#fff", fg = C.ink, size = 30) => `<div class="${cls}" style="position:absolute;left:${x}px;top:${y}px;transform:translateX(-50%);white-space:nowrap;padding:14px 26px;border-radius:999px;background:${bg};color:${fg};font:900 ${size}px/1 var(--fS);letter-spacing:.04em;text-transform:uppercase;box-shadow:0 10px 30px rgba(0,0,0,.45)">${txt}</div>`;
/** número grande em círculo (passo) */
const BADGE = (n, x, y, r, cls, bg, fg = C.ink) => `<div class="${cls}" style="position:absolute;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:${bg};color:${fg};display:flex;align-items:center;justify-content:center;font:900 ${Math.round(r * 1.15)}px/1 var(--fS);box-shadow:0 0 0 10px rgba(255,255,255,.08),0 14px 40px rgba(0,0,0,.5)">${n}</div>`;

// ---------- desenhos ----------
/** personagem plano: origem no centro da cabeça; pés em y≈250 */
const CHAR = (cls, shirt = C.teal) => `<g class="${cls}">
  <ellipse cx="0" cy="252" rx="70" ry="12" fill="rgba(0,0,0,.35)"/>
  <rect x="-36" y="150" width="30" height="100" rx="13" fill="${C.navy}"/><rect x="6" y="150" width="30" height="100" rx="13" fill="${C.navy}"/>
  <ellipse cx="-22" cy="248" rx="24" ry="10" fill="#15161b"/><ellipse cx="22" cy="248" rx="24" ry="10" fill="#15161b"/>
  <rect x="-74" y="52" width="24" height="96" rx="12" fill="${shirt}"/><rect x="50" y="52" width="24" height="96" rx="12" fill="${shirt}"/>
  <circle cx="-62" cy="150" r="13" fill="${C.skin}"/><circle cx="62" cy="150" r="13" fill="${C.skin}"/>
  <path d="M-54 168 V72 Q-54 40 -22 38 H22 Q54 40 54 72 V168 Z" fill="${shirt}"/>
  <path d="M-14 38 L0 58 L14 38 Z" fill="#fff" opacity=".9"/>
  <rect x="-11" y="22" width="22" height="20" rx="6" fill="#c98c62"/>
  <circle cx="0" cy="0" r="36" fill="${C.skin}"/>
  <path d="M-37 -2 Q-38 -44 0 -44 Q38 -44 37 -2 Q22 -26 -37 -2 Z" fill="#3b2416"/>
  <circle cx="-12" cy="4" r="4" fill="#2a1a10"/><circle cx="12" cy="4" r="4" fill="#2a1a10"/><path d="M-10 18 Q0 25 10 18" style="stroke:#7a3f22;stroke-width:3.5;fill:none;stroke-linecap:round"/></g>`;
/** mala de rodinha: origem no canto sup. esq., 150×190 */
const SUITCASE = (cls, col = C.orange) => `<g class="${cls}">
  <path d="M45 0 H105 V30 H93 V12 H57 V30 H45 Z" fill="#3a3a44"/>
  <rect x="0" y="28" width="150" height="170" rx="22" fill="${col}"/><rect x="0" y="28" width="150" height="170" rx="22" fill="url(#gShade)"/>
  <rect x="34" y="28" width="12" height="170" fill="rgba(0,0,0,.18)"/><rect x="104" y="28" width="12" height="170" fill="rgba(0,0,0,.18)"/>
  <rect x="58" y="70" width="40" height="28" rx="6" fill="#fff" opacity=".9"/><circle cx="118" cy="150" r="14" fill="${C.yellow}"/>
  <circle cx="26" cy="206" r="11" fill="#222"/><circle cx="124" cy="206" r="11" fill="#222"/></g>`;
/** bandeira do Uruguai (w×h, origem sup. esq.) */
const FLAG_UY = (w = 180, h = 120) => { const sh = h / 9;
  return `${[...Array(9)].map((_, i) => `<rect x="0" y="${(i * sh).toFixed(2)}" width="${w}" height="${(sh + 0.5).toFixed(2)}" fill="${i % 2 ? "#0038a8" : "#fff"}"/>`).join("")}
  <rect x="0" y="0" width="${(w * 0.4).toFixed(1)}" height="${(sh * 5).toFixed(1)}" fill="#fff"/>
  <g transform="translate(${(w * 0.2).toFixed(1)} ${(sh * 2.5).toFixed(1)})">${[...Array(16)].map((_, i) => `<path d="M0 -${(sh * 2.2).toFixed(1)} L${(sh * 0.35).toFixed(1)} -${(sh * 1.2).toFixed(1)} L-${(sh * 0.35).toFixed(1)} -${(sh * 1.2).toFixed(1)} Z" fill="#fcd116" transform="rotate(${i * 22.5})"/>`).join("")}<circle r="${(sh * 1.15).toFixed(1)}" fill="#fcd116" stroke="#7b3f00" stroke-width="1.5"/></g>`; };
/** bandeira do Brasil */
const FLAG_BR = (w = 180, h = 126) => `<rect width="${w}" height="${h}" rx="6" fill="#009c3b"/><path d="M${w * 0.08} ${h / 2} L${w / 2} ${h * 0.1} L${w * 0.92} ${h / 2} L${w / 2} ${h * 0.9} Z" fill="#ffdf00"/><circle cx="${w / 2}" cy="${h / 2}" r="${h * 0.24}" fill="#002776"/><path d="M${w / 2 - h * 0.24} ${h / 2 - 4} Q${w / 2} ${h / 2 - 14} ${w / 2 + h * 0.24} ${h / 2 + 4}" style="stroke:#fff;stroke-width:4;fill:none"/>`;
/** moeda */
const COIN = (cls, r = 34) => `<g class="${cls}"><circle r="${r}" fill="${C.gold2}"/><circle r="${r - 5}" fill="${C.gold}"/><text y="${r * 0.38}" text-anchor="middle" style="font:900 ${Math.round(r * 1.05)}px var(--fS);fill:${C.gold2}">$</text></g>`;
/** maço de dinheiro */
const CASH = (x, y, cls) => `<g transform="translate(${x} ${y})"><g class="${cls}">${[0, 1, 2, 3, 4].map((k) => `<rect x="0" y="${-k * 14}" width="190" height="90" rx="8" fill="${k % 2 ? "#2fa860" : "#38c172"}" stroke="#1e7a44" stroke-width="3"/>`).join("")}<rect x="78" y="-56" width="34" height="90" fill="#f0e3b0"/><circle cx="95" cy="-11" r="22" fill="#1e7a44" opacity=".6"/></g></g>`;
/** barra de ouro */
const BAR = (x, y, cls) => `<g transform="translate(${x} ${y})"><g class="${cls}"><path d="M0 0 L30 -56 H170 L200 0 Z" fill="url(#gGold)"/><path d="M30 -56 H170 L160 -40 H40 Z" fill="#fff3b0" opacity=".55"/><path d="M0 0 L30 -56 L40 -40 L14 0 Z" fill="${C.gold2}" opacity=".7"/></g></g>`;
/** cofrinho */
const PIGGY = (cls) => `<g class="${cls}">
  <ellipse cx="0" cy="30" rx="170" ry="130" fill="${C.pink}"/><ellipse cx="-40" cy="-20" rx="90" ry="50" fill="#ffc2d4" opacity=".6"/>
  <path d="M-70 -80 L-40 -150 L-10 -95 Z" fill="#ff6f9a"/>
  <ellipse cx="170" cy="40" rx="42" ry="48" fill="#ff6f9a"/><circle cx="160" cy="30" r="8" fill="#a8325a"/><circle cx="182" cy="50" r="8" fill="#a8325a"/>
  <circle cx="100" cy="-10" r="11" fill="#2a1a20"/>
  <rect x="-110" y="130" width="46" height="60" rx="14" fill="#ff6f9a"/><rect x="60" y="130" width="46" height="60" rx="14" fill="#ff6f9a"/>
  <rect x="-60" y="-104" width="110" height="18" rx="9" fill="#a8325a"/>
  <path d="M-170 20 q-40 -10 -36 -40 q4 -22 26 -12" style="stroke:#ff6f9a;stroke-width:12;fill:none;stroke-linecap:round"/></g>`;
/** cartão de notícia */
const NEWS = (cls, head, col, line) => `<div class="${cls}" style="position:absolute;width:380px;height:250px;border-radius:20px;background:${C.paper};box-shadow:0 20px 40px rgba(0,0,0,.5);overflow:hidden">
  <div style="height:56px;background:${col};color:#fff;font:900 26px/56px var(--fS);padding-left:24px;letter-spacing:.08em">${head}</div>
  <div style="padding:18px 24px;font:900 30px/1.1 var(--fS);color:${C.ink}">${line}</div>
  <div style="margin:0 24px;height:12px;border-radius:6px;background:#d8d0c0;width:300px"></div><div style="margin:12px 24px;height:12px;border-radius:6px;background:#d8d0c0;width:230px"></div></div>`;
/** ícone colorido em azulejo arredondado */
const TILE = (cls, x, y, bg, svg, label) => `<div class="${cls}" style="position:absolute;left:${x - 110}px;top:${y - 110}px;width:220px;text-align:center">
  <div style="position:relative;width:180px;height:180px;margin:0 auto;border-radius:44px;background:${bg};box-shadow:inset 0 -10px 0 rgba(0,0,0,.18),0 18px 34px rgba(0,0,0,.5)">
    <svg viewBox="0 0 180 180" width="180" height="180" style="position:absolute;left:0;top:0">${svg}</svg>
    <div class="bd" style="position:absolute;right:-16px;top:-16px;width:58px;height:58px;border-radius:50%;background:${C.red};color:#fff;font:900 38px/58px var(--fS);text-align:center;box-shadow:0 0 0 6px #111,0 0 24px rgba(255,77,77,.9);opacity:0">!</div>
  </div><div style="font:800 30px/1.1 var(--fS);margin-top:16px;color:#fff">${label}</div></div>`;

// ---------- fundo neutro escuro (como o reel de referência) + gradientes comuns ----------
scene(`<div style="position:absolute;inset:0;background:radial-gradient(120% 70% at 50% 38%,#1c1d24 0%,#101116 55%,#08080b 100%)"></div>
  <svg width="0" height="0" style="position:absolute"><defs>
    <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe27a"/><stop offset="1" stop-color="#d9a21e"/></linearGradient>
    <linearGradient id="gShade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>
    <linearGradient id="gBR" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#34c26a"/><stop offset="1" stop-color="#138a43"/></linearGradient>
    <linearGradient id="gUY" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8fd0ff"/><stop offset="1" stop-color="#3d8bfd"/></linearGradient>
  </defs></svg>`, 0, null, { d: 0.01 });

// mixagem dos efeitos (a mesma da v3: −8 a −14 dB RMS abaixo da voz); swoosh do kit quase mudo → whoosh
{ const sfx0 = K.sfx, GAIN = { whoosh: 2.8, pop: 0.9, stamp: 0.55, boom: 0.45, click: 0.45, glitch: 0.75, ding: 0.8, riser: 1.3, shimmer: 1.1, tick: 1 };
  K.sfx = (name, t, vol = 0.5) => name === "swoosh" ? sfx0("whoosh", t, vol * 2.2) : sfx0(name, t, vol * (GAIN[name] ?? 1)); }

