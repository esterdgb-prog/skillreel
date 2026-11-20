// Reel "Fundador do Nubank no Uruguai → Saída Definitiva" · Resultax Internacional · v2 COLORIDA
// Estilo pedido pelo cliente: ilustração plana colorida e dinâmica (como o reel de referência dos músculos):
// mapa real (Natural Earth) com seta e zoom, personagem, objetos preenchidos, câmera que aproxima.
// A legenda é a do reel "Saída Fiscal" (mouthCaps, ~y 1190). Conteúdo em y 240–1120. MAPAS vem de src/mapas.js.
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

// ============ 1) "Quando o fundador do Nubank mudou a residência fiscal para o Uruguai" — app/cartão → mapa real → seta → ZOOM no Uruguai
const tR = A("mudou") - 0.05, tU0 = A("uruguai"), t1a = Math.max(A("muito se falou") - 0.1, tU0 + 1.5), t2s = t1a + 0.05;
{
  const g = scene(`<div class="halo" style="position:absolute;left:140px;top:280px;width:800px;height:800px;border-radius:50%;background:radial-gradient(circle,rgba(138,5,190,.55) 0%,rgba(138,5,190,.15) 45%,rgba(138,5,190,0) 70%)"></div>
    <div class="nu" style="position:absolute;left:190px;top:330px;width:700px;${SH}"><img src="assets/img/nubank-app-cartao.png" style="width:100%;display:block"></div>
    ${CHIP("Fundador do Nubank", 540, 1010, "fd", C.purple, "#fff")}`, 0.05, null, { d: 0.2 });
  const nu = q1(g, ".nu");
  K.fromTo(nu, { scale: 0.3, rotation: -18, y: 200 }, { scale: 1, rotation: 0, y: 0, duration: 0.7, ease: "back.out(1.7)" }, 0.05);
  K.fromTo(q1(g, ".halo"), { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.1);
  float(nu, 0.8, tR, 16, 2);
  pop($$(g, ".fd"), A("fundador"));
  K.sfx("whoosh", 0.05, 0.35); K.sfx("pop", A("fundador"), 0.3);
  K.glitch(A("nubank"));
  tl.to(nu, { scale: 0.2, x: -330, y: -300, rotation: -20, opacity: 0, duration: 0.35, ease: "power3.in" }, tR);
  K.out([q1(g, ".fd"), q1(g, ".halo")], tR, 0.25);
  K.out(g, tR + 0.5, 0.1);
}
{
  const M = MAPAS.sa, S = 0.8, OX = 262, OY = 240;
  const P = (n) => [OX + M.pts[n][0] * S, OY + M.pts[n][1] * S];
  const [sx, sy] = P("saoPaulo"), [mx, my] = P("montevideo"), [ux, uy] = P("uyC"), [bx, by] = P("brC");
  const arc = `M${sx} ${sy} Q${sx + 180} ${(sy + my) / 2 + 40} ${mx + 14} ${my - 6}`;
  const lands = Object.entries(M.paths).map(([id, d]) => `<path class="ct c${id}" d="${d}" style="fill:${id === "076" ? "url(#gBR)" : id === "858" ? "url(#gUY)" : C.land};stroke:${id === "076" ? "#0e6b33" : id === "858" ? "#1f5fbf" : C.landS};stroke-width:1.6;stroke-linejoin:round"/>`).join("");
  const g = scene(`<div class="cm" style="${FULL}"><svg style="${FULL}">
      <g transform="translate(${OX} ${OY}) scale(${S})">${lands}</g>
      <path class="arw" d="${arc}" style="fill:none;stroke:${C.yellow};stroke-width:9;stroke-linecap:round;filter:drop-shadow(0 0 10px rgba(255,210,63,.8))"/>
      <g class="ahd" opacity="0"><path d="M14 0 L-12 -13 L-6 0 L-12 13 Z" fill="${C.yellow}"/></g>
      <circle class="dotS" cx="${sx}" cy="${sy}" r="9" fill="#fff"/>
    </svg></div>
    ${CHIP("Residência fiscal", 540, 300, "rf", C.yellow, C.ink)}`, tR + 0.3, t1a);
  const cm = q1(g, ".cm"), cts = $$(g, ".ct");
  camSet(cm, bx, by + 120, 0.92, tR, 540, 680);
  cts.forEach((c, i) => { if (c.classList.contains("c076") || c.classList.contains("c858")) return; c.style.opacity = "0"; K.fromTo(c, { opacity: 0 }, { opacity: 1, duration: 0.3 }, tR + 0.05 + i * 0.02); });
  const brEl = q1(g, ".c076"), uyEl = q1(g, ".c858");
  svgO(brEl); K.fromTo(brEl, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.8)" }, tR + 0.1);
  uyEl.style.opacity = "0";
  K.sfx("swoosh", tR + 0.05, 0.35);
  const lb = scene(LEAD("Brasil", bx + 40, by + 10, bx + 150, by - 70, "lbB", { size: 32 }), tR + 0.45, A("uruguai") - 0.1);
  pop($$(g, ".rf"), A("residência fiscal"));
  pop($$(g, ".dotS"), A("residência fiscal"));
  draw($$(g, ".arw"), A("residência fiscal") + 0.1, 1.1, 0, "power2.inOut");
  along(q1(g, ".ahd"), q1(g, ".arw"), A("residência fiscal") + 0.1, 1.1, { ease: "power2.inOut", scale: 1.6 });
  K.sfx("whoosh", A("residência fiscal") + 0.1, 0.35);
  // "Uruguai": o país acende e a câmera mergulha nele
  const tU = A("uruguai");
  svgO(uyEl); K.fromTo(uyEl, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.4)" }, tU - 0.1);
  cam(cm, ux, uy + 4, 3.6, tU - 0.05, 0.75, 540, 700);
  K.sfx("boom", tU, 0.3);
  K.out(q1(g, ".rf"), tU - 0.05, 0.2);
  // bandeira e rótulo na tela (fora da câmera)
  const f = scene(`<div class="fl" style="position:absolute;left:470px;top:420px;width:200px;height:200px">
      <svg viewBox="0 0 200 200" width="200" height="200" style="overflow:visible;${SH}"><path d="M30 150 V20" style="stroke:#ddd;stroke-width:8;stroke-linecap:round"/><g transform="translate(34 22)">${FLAG_UY(150, 100)}</g></svg></div>
    ${CHIP("Uruguai", 540, 940, "uyc", C.sky, "#fff", 40)}`, tU + 0.35, t1a);
  K.fromTo(q1(f, ".fl"), { opacity: 0, y: 80, scale: 0.4 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(2)" }, tU + 0.35);
  tl.fromTo(q1(f, ".fl"), { rotation: -3 }, { rotation: 3, duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, tU + 0.9);
  pop($$(f, ".uyc"), tU + 0.55);
  K.sfx("pop", tU + 0.55, 0.35);
}

// ============ 2) "muito se falou na economia de impostos" — manchetes chovendo → cofrinho enchendo de moedas
{
  const t0 = t2s, t1 = A("mas você") - 0.1;
  const g = scene(`<div class="n1" style="position:absolute;left:70px;top:300px;transform:rotate(-8deg)">${NEWS("", "NOTÍCIAS", C.red, "Bilionário muda de país")}</div>
    <div class="n2" style="position:absolute;left:630px;top:270px;transform:rotate(7deg)">${NEWS("", "ECONOMIA", C.blue, "Uruguai atrai brasileiros")}</div>
    <div class="n3" style="position:absolute;left:350px;top:430px;transform:rotate(-2deg)">${NEWS("", "MERCADO", C.ink, "E os impostos?")}</div>`, t0, A("economia") + 0.1);
  ["n1", "n2", "n3"].forEach((c, i) => { const e = q1(g, "." + c); e.style.opacity = "0"; K.fromTo(e, { opacity: 0, y: -420, rotation: (i - 1) * 25 }, { opacity: 1, y: 0, rotation: [-8, 7, -2][i], duration: 0.55, ease: "back.out(1.4)" }, t0 + i * 0.18); });
  K.sfx("swoosh", t0, 0.35);
  // cofrinho
  const p = scene(`<svg style="${FULL}"><g transform="translate(540 760)"><g class="pg">${PIGGY("pig")}</g></g>
      ${[0, 1, 2, 3, 4].map((k) => `<g transform="translate(${490 + (k % 3) * 25} 560)"><g class="cn">${COIN("", 34)}</g></g>`).join("")}</svg>
    ${CHIP("Economia de impostos", 540, 1010, "ec", C.green, "#fff", 34)}`, A("economia") - 0.05, t1);
  const pg = q1(p, ".pg"); pg.style.opacity = "0";
  svgO(pg); K.fromTo(pg, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, A("economia") - 0.05);
  $$(p, ".cn").forEach((c, i) => { c.style.opacity = "0"; const t = A("economia") + 0.35 + i * 0.22;
    K.fromTo(c, { opacity: 0, y: -380 }, { opacity: 1, y: 70, duration: 0.42, ease: "power2.in" }, t);
    K.out(c, t + 0.42, 0.06); tl.fromTo(pg, { scale: 1 }, { scale: 1.04, duration: 0.08, yoyo: true, repeat: 1, immediateRender: false }, t + 0.42); });
  K.sfx("tick", A("economia") + 0.8, 0.3); K.sfx("tick", A("economia") + 1.2, 0.3);
  pop($$(p, ".ec"), A("impostos"));
  K.sfx("ding", A("impostos") + 0.2, 0.35);
}

// ============ 3) "Mas você não precisa ser bilionário pra cair na mesma lógica" — ouro + dinheiro → X → personagem "você"
const tL = A("mesma lógica");
{
  const t0 = A("mas você") - 0.05;
  const g = scene(`<svg style="${FULL}">
      ${CASH(40, 1000, "cs")}${CASH(850, 1000, "cs")}
      ${BAR(240, 960, "br")}${BAR(440, 960, "br")}${BAR(640, 960, "br")}${BAR(340, 900, "br")}${BAR(540, 900, "br")}${BAR(440, 840, "br")}
      <g class="dm" transform="translate(540 700)"><path d="M-50 -20 L-25 -50 H25 L50 -20 L0 45 Z" fill="#9fe6ff"/><path d="M-50 -20 H50 L0 45 Z" fill="#5cc8f0"/><path d="M-25 -50 L-10 -20 L10 -20 L25 -50 Z" fill="#d6f6ff"/></g>
      <path class="x" d="M200 620 L880 1000" style="stroke:${C.red};stroke-width:30;stroke-linecap:round"/><path class="x" d="M880 620 L200 1000" style="stroke:${C.red};stroke-width:30;stroke-linecap:round"/>
    </svg>${CHIP("Bilionário", 540, 470, "bl", C.gold, C.ink, 40)}`, t0, tL - 0.05);
  drop($$(g, ".br"), A("não precisa"), 0.07);
  slide($$(g, ".cs"), A("não precisa") + 0.2, 0, 0.1);
  K.sfx("swoosh", A("não precisa"), 0.35);
  pop($$(g, ".bl"), A("bilionário"));
  const dm = q1(g, ".dm"); pop([dm], A("bilionário") + 0.1); tl.to(dm, { rotation: 360, duration: 1.4, ease: "power2.out", transformOrigin: "50% 50%" }, A("bilionário") + 0.1);
  K.sfx("shimmer", A("bilionário") + 0.1, 0.3);
  draw($$(g, ".x"), A("pra cair") - 0.15, 0.18, 0.12, "power3.out");
  K.sfx("stamp", A("pra cair") - 0.05, 0.5);
  shake(g, A("pra cair") + 0.15);
}
{
  const t1 = A("quem vai morar") + 0.6;
  const g = scene(`<svg style="${FULL}"><g class="pc" transform="translate(540 600) scale(1.5)">${CHAR("ch")}</g></svg>${CHIP("Você", 540, 1030, "vc", "#fff", C.ink, 36)}`, tL - 0.05, t1);
  const pc = q1(g, ".pc .ch"); svgO(pc);
  K.fromTo(pc, { opacity: 0, y: 300, scale: 0.6 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.8)" }, tL - 0.05);
  pop($$(g, ".vc"), tL + 0.25);
  K.sfx("pop", tL + 0.2, 0.3);
  K.out(q1(g, ".vc"), A("quem vai morar") - 0.05, 0.2);
  tl.to(q1(g, ".pc"), { opacity: 0, duration: 0.3 }, A("quem vai morar") + 0.3);
}

// ============ 4) "quem vai morar fora do Brasil, seja para trabalhar, estudar ou recomeçar a vida" — mala, avião, 3 motivos
{
  const t0 = A("quem vai morar"), t1 = A("precisa de planejamento") - 0.1;
  const g = scene(`<svg style="${FULL}">
      <g class="pc2" transform="translate(420 470) scale(1.1)">${CHAR("ch2")}</g>
      <g class="sc" transform="translate(540 590)">${SUITCASE("su")}</g>
      <path class="trl" d="M60 330 Q540 170 1020 300" style="fill:none;stroke:#fff;stroke-width:5;stroke-dasharray:14 14;opacity:.5"/>
      <g class="pl" opacity="0"><path d="M38 0 C38 -6 30 -8 22 -8 H8 L-14 -40 H-26 L-10 -8 H-30 L-40 -20 H-50 L-44 0 L-50 20 H-40 L-30 8 H-10 L-26 40 H-14 L8 8 H22 C30 8 38 6 38 0 Z" fill="#fff"/><path d="M-50 -20 H-40 L-30 -8 H-44 Z M-50 20 H-40 L-30 8 H-44 Z" fill="${C.blue}"/></g>
    </svg>`, t0 - 0.05, t1);
  const c2 = q1(g, ".ch2"); svgO(c2);
  K.fromTo(c2, { opacity: 0, x: -200 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }, t0 - 0.05);
  const su = q1(g, ".su"); svgO(su);
  K.fromTo(su, { opacity: 0, x: 300, rotation: 20 }, { opacity: 1, x: 0, rotation: 0, duration: 0.5, ease: "back.out(1.6)" }, A("morar fora"));
  K.sfx("swoosh", A("morar fora"), 0.3);
  draw($$(g, ".trl"), A("fora do brasil"), 1.0);
  along(q1(g, ".pl"), q1(g, ".trl"), A("fora do brasil"), 1.0, { scale: 1.5 });
  K.sfx("whoosh", A("fora do brasil"), 0.35);
  const ICON = {
    t: `<rect x="40" y="70" width="100" height="74" rx="12" fill="#8b5a2b"/><rect x="40" y="70" width="100" height="26" rx="10" fill="#a8703a"/><path d="M70 70 V54 H110 V70" style="stroke:#5b3a1b;stroke-width:10;fill:none"/><rect x="82" y="88" width="16" height="16" rx="3" fill="${C.gold}"/>`,
    e: `<path d="M20 78 L90 46 L160 78 L90 110 Z" fill="${C.navy}"/><path d="M50 92 V124 C70 140 110 140 130 124 V92 L90 110 Z" fill="#2c3f75"/><path d="M150 82 V118" style="stroke:${C.gold};stroke-width:6"/><circle cx="150" cy="124" r="9" fill="${C.gold}"/>`,
    r: `<path d="M90 150 V84" style="stroke:#2f7d32;stroke-width:10;stroke-linecap:round"/><path d="M90 100 C90 66 64 50 34 50 C34 82 56 100 90 100 Z" fill="#4caf50"/><path d="M90 86 C90 54 118 36 148 36 C148 68 126 86 90 86 Z" fill="#7bd17e"/><rect x="56" y="140" width="68" height="18" rx="9" fill="#8d6e63"/>`,
  };
  const c = scene(TILE("m1", 220, 930, C.orange, ICON.t, "Trabalhar") + TILE("m2", 540, 930, C.sky, ICON.e, "Estudar") + TILE("m3", 860, 930, C.green, ICON.r, "Recomeçar"),
    A("trabalhar") - 0.1, t1);
  pop($$(c, ".m1"), A("trabalhar")); K.sfx("pop", A("trabalhar"), 0.3);
  pop($$(c, ".m2"), A("estudar")); K.sfx("pop", A("estudar"), 0.3);
  pop($$(c, ".m3"), A("recomeçar")); K.sfx("pop", A("recomeçar"), 0.3);
}

// ============ 5) "precisa de planejamento para não pagar imposto em dobro" — prancheta → duas contas de imposto → ×2
{
  const t0 = A("precisa de planejamento") - 0.05, tD = A("pagar imposto") - 0.1, t1 = A("e não basta") - 0.1;
  const cb = scene(`<div class="cbd" style="position:absolute;left:330px;top:330px;width:420px;height:560px;border-radius:30px;background:#8d5a2b;box-shadow:0 22px 40px rgba(0,0,0,.5)">
      <div style="position:absolute;left:30px;top:50px;right:30px;bottom:30px;border-radius:14px;background:${C.paper}"></div>
      <div style="position:absolute;left:140px;top:-22px;width:140px;height:64px;border-radius:16px;background:#c0c6d0;box-shadow:inset 0 -6px 0 rgba(0,0,0,.2)"></div>
      ${[0, 1, 2, 3].map((k) => `<div class="row" style="position:absolute;left:70px;top:${120 + k * 95}px;display:flex;align-items:center;gap:24px">
        <div style="width:52px;height:52px;border-radius:12px;border:5px solid #c9c0ad;position:relative"><svg class="ck" viewBox="0 0 52 52" width="52" height="52" style="position:absolute;left:-5px;top:-5px"><path d="M10 27 L22 39 L44 13" style="stroke:${C.green};stroke-width:9;fill:none;stroke-linecap:round;stroke-linejoin:round"/></svg></div>
        <div style="height:16px;border-radius:8px;background:#cfc6b4;width:${[190, 150, 200, 130][k]}px"></div></div>`).join("")}
    </div>${CHIP("Planejamento", 540, 950, "pj", C.yellow, C.ink, 34)}`, t0, tD);
  const cbd = q1(cb, ".cbd"); K.fromTo(cbd, { y: 400, rotation: 10 }, { y: 0, rotation: 0, duration: 0.5, ease: "back.out(1.5)" }, t0);
  draw($$(cb, ".ck path"), A("planejamento"), 0.2, 0.12, "power3.out");
  pop($$(cb, ".pj"), A("planejamento") + 0.1);
  K.sfx("swoosh", t0, 0.3); K.sfx("click", A("planejamento") + 0.1, 0.4);
  const BILL = (cls, x, rot, flag, lab) => `<div class="${cls}" style="position:absolute;left:${x}px;top:400px;width:330px;height:470px;border-radius:22px;background:${C.paper};transform:rotate(${rot}deg);box-shadow:0 22px 40px rgba(0,0,0,.5);overflow:hidden">
      <div style="height:120px;background:${C.ink};display:flex;align-items:center;gap:18px;padding-left:24px"><svg width="90" height="63" viewBox="0 0 180 126">${flag}</svg>
        <div style="font:900 30px/1 var(--fS);color:#fff">IMPOSTO<div style="font:700 20px/1.3 var(--fS);color:${C.muted};letter-spacing:.1em">${lab}</div></div></div>
      ${[0, 1, 2].map((k) => `<div style="margin:${k ? 18 : 34}px 28px 0;height:14px;border-radius:7px;background:#d8d0c0;width:${[250, 200, 230][k]}px"></div>`).join("")}
      <div style="position:absolute;left:28px;bottom:30px;font:900 52px/1 var(--fS);color:${C.red}">R$ ●●●</div></div>`;
  const GLOBEF = `<rect width="180" height="126" rx="6" fill="${C.blue}"/><circle cx="90" cy="63" r="44" fill="#7cc3ff"/><path d="M60 40 q20 10 14 30 q-8 16 10 30 M110 34 q-12 18 4 30 q16 10 6 26" style="stroke:#2e7d32;stroke-width:12;fill:none;stroke-linecap:round"/>`;
  const d = scene(BILL("b1", 120, -6, FLAG_BR(), "NO BRASIL") + BILL("b2", 630, 6, GLOBEF, "NO EXTERIOR") +
    `<div class="x2" style="position:absolute;left:540px;top:520px;transform:translateX(-50%);width:200px;height:200px;border-radius:50%;background:${C.red};color:#fff;display:flex;align-items:center;justify-content:center;font:900 96px/1 var(--fS);box-shadow:0 0 0 12px rgba(255,77,77,.25),0 0 60px rgba(255,77,77,.7)">×2</div>`, tD, t1);
  slide($$(d, ".b1"), A("pagar imposto"), -500, 0, -20);
  slide($$(d, ".b2"), A("imposto") + 0.25, 500, 0, 20);
  K.sfx("swoosh", A("pagar imposto"), 0.35);
  pop($$(d, ".x2"), A("em dobro"), 0, 0.2);
  K.sfx("stamp", A("em dobro") + 0.05, 0.5);
  shake(q1(d, ".b1"), A("em dobro") + 0.2, 5, 8); shake(q1(d, ".b2"), A("em dobro") + 0.2, 5, -8);
  pulse(q1(d, ".x2"), A("em dobro") + 0.6, t1, 1.08, 0.7);
}

// ============ 6) "E não basta arrumar as malas. O processo tem dois passos:" — mala abre, roupas entram, fecha → 1 e 2
{
  const t0 = A("e não basta") - 0.05, tP = A("o processo") - 0.08, t1 = A("primeiro") - 0.1;
  const g = scene(`<svg style="${FULL}">
      <rect x="290" y="640" width="500" height="320" rx="40" fill="${C.orange}"/><rect x="320" y="660" width="440" height="140" rx="26" fill="#7a3510"/>
      <g transform="translate(380 675) scale(.85)"><g class="it"><path d="M0 40 L40 0 H100 L140 40 L118 62 L100 46 V140 H40 V46 L22 62 Z" fill="${C.sky}"/></g></g>
      <g transform="translate(520 670) scale(.85)"><g class="it"><rect width="90" height="130" rx="12" fill="${C.navy}"/><rect x="14" y="18" width="62" height="20" rx="4" fill="${C.gold}"/><text x="45" y="90" text-anchor="middle" style="font:900 22px var(--fS);fill:${C.gold}">PASS</text></g></g>
      <g transform="translate(625 680) scale(.85)"><g class="it"><rect width="110" height="120" rx="16" fill="${C.pink}"/><rect y="40" width="110" height="18" fill="#fff" opacity=".6"/></g></g>
      <g transform="translate(290 640)"><g class="lid"><rect x="0" y="-250" width="500" height="250" rx="40" fill="#e46f22"/><rect x="0" y="-250" width="500" height="250" rx="40" fill="url(#gShade)"/><rect x="190" y="-200" width="120" height="40" rx="12" fill="#fff" opacity=".85"/></g></g>
      <circle cx="350" cy="985" r="20" fill="#222"/><circle cx="730" cy="985" r="20" fill="#222"/>
    </svg>`, t0, tP);
  K.pill("Não basta", A("não basta"), { y: 290, kind: "strike", up: true, until: tP });
  const lid = q1(g, ".lid");
  drop($$(g, ".it"), A("arrumar"), 0.15, -500);
  K.sfx("swoosh", A("arrumar"), 0.3);
  tl.fromTo(lid, { y: 0 }, { y: 250, duration: 0.3, ease: "power2.in", immediateRender: false }, A("malas"));
  K.sfx("click", A("malas") + 0.3, 0.45);
  shake(g, A("malas") + 0.3, 4, 6);
  // dois passos
  K.sfx("riser", tP - 0.2, 0.25);
  const s = scene(`<svg style="${FULL}"><path class="pth" d="M330 720 Q540 560 750 720" style="fill:none;stroke:#fff;stroke-width:8;stroke-dasharray:4 22;stroke-linecap:round;opacity:.7"/></svg>
      ${BADGE("1", 300, 760, 120, "s1", C.gold)}${BADGE("2", 780, 760, 120, "s2", C.sky, "#fff")}
      <div class="tt" style="position:absolute;left:0;width:1080px;top:960px;text-align:center;font:900 64px/1 var(--fS);color:#fff;text-transform:uppercase">2 passos</div>`, tP, t1);
  pop($$(s, ".s1"), tP + 0.05);
  draw($$(s, ".pth"), tP + 0.35, 0.6);
  pop($$(s, ".s2"), A("dois passos"));
  pop($$(s, ".tt"), A("dois passos") + 0.15);
  K.sfx("pop", tP + 0.05, 0.3); K.sfx("ding", A("dois passos") + 0.2, 0.35);
}

// ============ 7) "Primeiro: formalizar a sua Saída Definitiva do País junto à Receita Federal." — formulário se preenche, carimbo verde
{
  const t0 = A("primeiro") - 0.05, t1 = A("sem isso") - 0.1;
  const g = scene(`${BADGE("1", 200, 360, 80, "bg1", C.gold)}
    <div class="doc" style="position:absolute;left:300px;top:300px;width:560px;height:760px;border-radius:24px;background:#fff;box-shadow:0 26px 50px rgba(0,0,0,.55);overflow:hidden">
      <div style="height:22px;background:linear-gradient(90deg,#009c3b 0 60%,#ffdf00 60% 80%,#002776 80%)"></div>
      <div style="padding:36px 40px 0;font:700 22px/1 var(--fS);letter-spacing:.14em;color:#6b7280">RECEITA FEDERAL · FORMULÁRIO</div>
      <div class="ttl" style="padding:20px 40px 0;font:900 50px/1.02 var(--fS);color:${C.ink};text-transform:uppercase">Saída Definitiva<br><span style="color:${C.green}">do País</span></div>
      ${["Nome", "CPF", "Data de saída", "País de destino"].map((l, k) => `<div style="padding:${k ? 20 : 34}px 40px 0"><div style="font:700 20px/1 var(--fS);color:#9aa3b2;text-transform:uppercase;letter-spacing:.08em">${l}</div>
        <div style="margin-top:10px;height:44px;border-radius:10px;background:#f1f3f6;position:relative;overflow:hidden"><div class="fil" style="position:absolute;left:14px;top:14px;height:16px;border-radius:8px;background:${C.navy};width:${[300, 220, 160, 200][k]}px"></div></div></div>`).join("")}
    </div>
    <div class="stp" style="position:absolute;left:520px;top:880px;padding:16px 30px;border:8px solid ${C.green};border-radius:18px;color:${C.green};font:900 52px/1 var(--fS);letter-spacing:.06em;transform:rotate(-12deg);background:rgba(255,255,255,.9)">ENVIADA ✓</div>`, t0, t1);
  pop($$(g, ".bg1"), A("primeiro"));
  K.sfx("boom", A("primeiro"), 0.3);
  const doc = q1(g, ".doc"); K.fromTo(doc, { y: 600, rotation: 8 }, { y: 0, rotation: 0, duration: 0.55, ease: "back.out(1.4)" }, A("formalizar") - 0.1);
  K.sfx("swoosh", A("formalizar") - 0.1, 0.35);
  K.fromTo(q1(g, ".ttl"), { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.4 }, A("saída definitiva"));
  $$(g, ".fil").forEach((e, i) => { gsap.set(e, { transformOrigin: "0 50%" }); K.fromTo(e, { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: "power2.out" }, A("país") + i * 0.22); });
  K.sfx("type", A("país"), 0.25);
  const stp = q1(g, ".stp"); stp.style.opacity = "0";
  K.fromTo(stp, { opacity: 0, scale: 2.2 }, { opacity: 1, scale: 1, duration: 0.18, ease: "power4.in" }, A("receita federal") + 0.1);
  K.sfx("stamp", A("receita federal") + 0.25, 0.5);
  shake(doc, A("receita federal") + 0.28, 3, 5);
}

// ============ 8) "Sem isso, você pode continuar sendo tratado como residente fiscal aqui, mesmo morando lá fora."
// mapa-múndi real: começa no Brasil (alerta), recua e revela você em Portugal, puxado por uma corda vermelha
{
  const t0 = A("sem isso") - 0.05, t1 = A("segundo") - 0.1;
  const M = MAPAS.world, S = 0.86, OX = 110, OY = 220;
  const P = (n) => [OX + M.pts[n][0] * S, OY + M.pts[n][1] * S];
  const [bx, by] = P("brC"), [lx, ly] = P("lisboa"), [sx, sy] = P("saoPaulo");
  const lands = Object.entries(M.paths).map(([id, d]) => `<path class="${id === "076" ? "wbr" : id === "620" ? "wpt" : "wl"}" d="${d}" style="fill:${id === "076" ? "url(#gBR)" : id === "620" ? "url(#gUY)" : C.land};stroke:${C.landS};stroke-width:1.2"/>`).join("");
  const rope = `M${sx} ${sy - 10} Q${(sx + lx) / 2 + 120} ${(sy + ly) / 2 + 60} ${lx} ${ly + 30}`;
  const g = scene(`<div class="cm" style="${FULL}"><svg style="${FULL}"><g transform="translate(${OX} ${OY}) scale(${S})">${lands}</g>
      <path class="rope" d="${rope}" style="fill:none;stroke:${C.red};stroke-width:7;stroke-dasharray:18 12;stroke-linecap:round;filter:drop-shadow(0 0 8px rgba(255,77,77,.8))"/>
      <circle class="ring" cx="${bx}" cy="${by}" r="120" style="fill:none;stroke:${C.red};stroke-width:8;opacity:0"/>
      <g class="me" transform="translate(${lx} ${ly - 70}) scale(0.32)">${CHAR("mec", C.orange)}</g>
    </svg></div>`, t0, t1);
  const cm = q1(g, ".cm");
  camSet(cm, bx, by, 2.1, t0, 540, 700);
  const w = scene(`<div class="wn" style="position:absolute;left:470px;top:300px;width:140px;height:124px">
      <svg viewBox="0 0 140 124" width="140" height="124" style="filter:drop-shadow(0 0 18px rgba(255,77,77,.8))"><path d="M70 6 L134 116 H6 Z" fill="${C.red}" stroke="#fff" stroke-width="6" stroke-linejoin="round"/><path d="M70 42 V78" style="stroke:#fff;stroke-width:12;stroke-linecap:round"/><circle cx="70" cy="98" r="7" fill="#fff"/></svg></div>`, t0, A("tratado"));
  pop($$(w, ".wn"), t0 + 0.05); K.sfx("boom", t0 + 0.05, 0.3);
  const ring = q1(g, ".ring"); svgO(ring);
  for (let s = A("residente fiscal"); s < A("mesmo morando"); s += 0.7) tl.fromTo(ring, { opacity: 0.9, scale: 0.6 }, { opacity: 0, scale: 1.4, duration: 0.7, ease: "power1.out", immediateRender: false }, s);
  const tg = scene(CHIP("Residente fiscal no Brasil", 540, 960, "rtag", C.red, "#fff", 34), A("tratado") - 0.05, t1);
  pop($$(tg, ".rtag"), A("residente fiscal"));
  K.sfx("pop", A("residente fiscal"), 0.35);
  // "mesmo morando lá fora": câmera recua e revela você do outro lado do oceano, ainda preso ao Brasil
  const tM = A("mesmo morando");
  cam(cm, (bx + lx) / 2, (by + ly) / 2 + 30, 1.05, tM - 0.1, 1.0, 540, 660);
  K.sfx("whoosh", tM - 0.1, 0.35);
  const me = q1(g, ".me .mec"); svgO(me);
  K.fromTo(me, { opacity: 0, y: -200 }, { opacity: 1, y: 0, duration: 0.5, ease: "bounce.out" }, tM + 0.3);
  draw($$(g, ".rope"), A("lá fora"), 0.6);
  const lf = scene(LEAD("Lá fora", 760, 420, 860, 330, "lfl", { size: 32 }), A("lá fora") + 0.1, t1);
}

// ============ 9+10) "Segundo: organizar o que você deixa pra trás. Conta, investimentos, imóvel, empresa, declaração de imposto de renda.
// Se ficar solto, vira pendência, e pendência vira dor de cabeça e malha fina." — 5 ícones coloridos → soltos → ! → lupa + malha
{
  const t0 = A("segundo") - 0.05, tS = A("se ficar solto"), t1 = A("vai morar no exterior") - 0.1;
  const hd = scene(`${BADGE("2", 200, 360, 80, "bg2", C.sky, "#fff")}
    <div class="ft" style="position:absolute;left:310px;top:322px;font:900 46px/1.05 var(--fS);color:#fff;text-transform:uppercase">O que fica<br><span style="color:${C.sky}">no Brasil</span></div>`, t0, tS);
  pop($$(hd, ".bg2"), A("segundo")); K.sfx("boom", A("segundo"), 0.3);
  slide($$(hd, ".ft"), A("organizar"), 120);
  const IC = {
    conta: `<rect x="26" y="52" width="128" height="80" rx="12" fill="url(#gUY)"/><rect x="26" y="70" width="128" height="16" fill="#1d2b53"/><rect x="40" y="100" width="34" height="22" rx="4" fill="${C.gold}"/>`,
    inv: `<rect x="34" y="104" width="24" height="44" rx="5" fill="#fff"/><rect x="72" y="80" width="24" height="68" rx="5" fill="#fff"/><rect x="110" y="56" width="24" height="92" rx="5" fill="#fff"/><path d="M32 82 L72 52 L100 64 L146 30" style="stroke:${C.yellow};stroke-width:9;fill:none;stroke-linecap:round;stroke-linejoin:round"/><path d="M128 28 H148 V48" style="stroke:${C.yellow};stroke-width:9;fill:none;stroke-linecap:round"/>`,
    imovel: `<path d="M26 86 L90 36 L154 86 Z" fill="${C.red}"/><rect x="44" y="84" width="92" height="66" fill="#f6e7c8"/><rect x="78" y="108" width="26" height="42" fill="#8d5a2b"/><rect x="52" y="96" width="20" height="20" fill="${C.sky}"/><rect x="110" y="96" width="20" height="20" fill="${C.sky}"/>`,
    empresa: `<rect x="40" y="34" width="66" height="118" rx="6" fill="#cfe6ff"/><rect x="106" y="74" width="40" height="78" rx="6" fill="#9ccaff"/>${[0, 1, 2, 3].map((r) => [0, 1].map((c) => `<rect x="${52 + c * 26}" y="${48 + r * 24}" width="16" height="14" fill="#3d8bfd"/>`).join("")).join("")}`,
    ir: `<path d="M44 26 H118 L142 50 V156 H44 Z" fill="#fff"/><path d="M118 26 V50 H142" fill="#d9dde3"/><rect x="58" y="70" width="70" height="38" rx="8" fill="${C.yellow}"/><text x="93" y="99" text-anchor="middle" style="font:900 30px var(--fS);fill:${C.ink}">IR</text><rect x="58" y="120" width="70" height="9" rx="4" fill="#cfd4dc"/><rect x="58" y="136" width="50" height="9" rx="4" fill="#cfd4dc"/>`,
  };
  const items = [["conta", "Conta", 220, 600, C.navy, "conta"], ["inv", "Investimentos", 540, 600, C.green, "investimentos"], ["imovel", "Imóvel", 860, 600, C.orange, "imóvel"],
    ["empresa", "Empresa", 380, 870, C.blue, "empresa"], ["ir", "Declaração de IR", 700, 870, C.purple, "declaração"]];
  const g = scene(items.map(([k, lab, x, y, bg]) => TILE(`it it-${k}`, x, y, bg, IC[k], lab)).join(""), A("conta") - 0.1, t1);
  items.forEach(([k, , , , , wd]) => { pop($$(g, `.it-${k}`), A(wd), 0, 0.2); K.sfx(k === "ir" ? "ding" : "click", A(wd) + 0.05, k === "ir" ? 0.3 : 0.4); });
  // soltos
  $$(g, ".it").forEach((e, i) => tl.to(e, { x: [-50, 40, 60, -60, 45][i], y: [-40, 50, -30, 40, -50][i], rotation: [-18, 12, 20, -15, 10][i], duration: 1.1, ease: "back.out(1.4)" }, tS + i * 0.06));
  K.sfx("swoosh", tS, 0.3);
  pop($$(g, ".bd"), A("pendência"), 0.08, 0.2);
  K.pill("Pendência", A("pendência"), { y: 290, kind: "dark", icon: "clock", up: true, until: t1 });
  K.sfx("pop", A("pendência"), 0.35);
  // dor de cabeça: tremor + pulso vermelho na tela
  shake(g, A("dor de cabeça"), 8, 12);
  const rv = scene(`<div style="position:absolute;inset:0;box-shadow:inset 0 0 220px 60px rgba(255,40,40,.55)"></div>`, A("dor de cabeça"), A("dor de cabeça") + 0.7, { d: 0.12 });
  K.sfx("glitch", A("dor de cabeça"), 0.25);
  // malha fina: rede vermelha cai + lupa varre
  const tF = A("malha fina");
  const net = scene(`<svg style="${FULL};filter:drop-shadow(0 0 10px rgba(255,77,77,.7))"><g class="nt">
      ${[...Array(9)].map((_, k) => `<path d="M${100 + k * 110} 440 V1080" style="stroke:${C.red};stroke-width:6"/>`).join("")}
      ${[...Array(7)].map((_, k) => `<path d="M80 ${460 + k * 100} H1000" style="stroke:${C.red};stroke-width:6"/>`).join("")}</g>
      <g class="lp"><circle cx="0" cy="0" r="110" style="fill:rgba(160,220,255,.22);stroke:#e8e8e8;stroke-width:22"/><path d="M78 78 L170 170" style="stroke:#8d5a2b;stroke-width:38;stroke-linecap:round"/></g></svg>`, tF - 0.05, t1, { d: 0.1 });
  K.fromTo(q1(net, ".nt"), { y: -700 }, { y: 0, duration: 0.55, ease: "bounce.out" }, tF - 0.05);
  const lp = q1(net, ".lp");
  tl.fromTo(lp, { x: 1250, y: 520 }, { x: 330, y: 640, duration: 0.6, ease: "power3.out", immediateRender: false }, tF + 0.1);
  tl.to(lp, { x: 760, y: 820, duration: 0.9, ease: "sine.inOut" }, tF + 0.7);
  K.set(lp, { x: 1250, y: 520 }, 0);
  K.stamp("MALHA FINA", tF + 0.4, { x: 560, y: 760, rot: -10, until: t1 });
}

// ============ 11) "Vai morar no exterior e quer fazer tudo isso 100% dentro da lei?" — anel enche até 100%, escudo verde, confete
{
  const t0 = A("vai morar no exterior"), t1 = A("na resultax") - 0.08;
  K.pill("Vai morar no exterior?", t0, { y: 290, icon: "user", up: true, until: t1 });
  K.sfx("whoosh", t0, 0.3);
  const R = 200, L = 2 * Math.PI * R;
  const g = scene(`<svg style="${FULL}">
      <circle cx="540" cy="720" r="${R}" style="fill:none;stroke:#2a2f3a;stroke-width:34"/>
      <circle class="rg" cx="540" cy="720" r="${R}" transform="rotate(-90 540 720)" style="fill:none;stroke:${C.green};stroke-width:34;stroke-linecap:round;stroke-dasharray:${L.toFixed(1)};stroke-dashoffset:${L.toFixed(1)};filter:drop-shadow(0 0 14px rgba(34,164,85,.8))"/>
      <g class="sh" transform="translate(540 725) scale(0.85)"><path d="M0 -150 L120 -105 V-10 C120 75 60 125 0 150 C-60 125 -120 75 -120 -10 V-105 Z" fill="url(#gBR)"/><path d="M0 -150 L120 -105 V-10 C120 75 60 125 0 150 Z" fill="#000" opacity=".12"/><path d="M-52 4 L-14 42 L58 -40" style="stroke:#fff;stroke-width:22;fill:none;stroke-linecap:round;stroke-linejoin:round"/></g>
      ${[...Array(18)].map((_, k) => `<rect class="cf" x="-7" y="-14" width="14" height="28" rx="4" fill="${[C.yellow, C.sky, C.pink, C.green, C.orange][k % 5]}" transform="translate(540 720)"/>`).join("")}
    </svg>
    <div style="position:absolute;left:0;width:1080px;top:350px;text-align:center"><span class="pc" style="font:900 120px/1 var(--fS);color:#fff;text-shadow:0 0 30px rgba(34,164,85,.7)"><span class="n">0</span>%</span></div>
    ${CHIP("Dentro da lei", 540, 975, "dl", C.green, "#fff", 36)}`, A("100%") - 0.2, t1);
  const rg = q1(g, ".rg"); tl.fromTo(rg, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.out", immediateRender: false }, A("100%"));
  count(q1(g, ".n"), 0, 100, A("100%"), 0.8);
  for (let k = 1; k <= 3; k++) K.sfx("tick", A("100%") + k * 0.2, 0.25);
  const sh = q1(g, ".sh"); pop([sh], A("dentro da lei"), 0, 0.2);
  pop($$(g, ".dl"), A("lei"));
  K.sfx("ding", A("lei") + 0.1, 0.4);
  $$(g, ".cf").forEach((c, k) => { c.style.opacity = "0"; const a = (k / 18) * Math.PI * 2, r = 300 + (k % 3) * 60;
    K.fromTo(c, { opacity: 1, x: 0, y: 0, rotation: 0 }, { opacity: 0, x: Math.cos(a) * r, y: Math.sin(a) * r + 120, rotation: 360 + k * 40, duration: 1.3, ease: "power2.out" }, A("lei") + 0.05); });
  K.sfx("shimmer", A("lei") + 0.05, 0.3);
}

// ============ 12) CTA "Na Resultax Internacional a gente cuida do processo todo. Clica no link da bio e agende o seu diagnóstico."
K.logo({ img: "assets/img/logo-resultax.png" }, A("resultax"), CFG.dur - A("resultax") + 0.3, { y: 290, h: 380 });
{ // partículas douradas
  const t0 = A("resultax") + 0.4;
  const g = scene(Array.from({ length: 16 }, (_, i) => {
    const x = 160 + ((i * 137) % 760), y = 420 + ((i * 89) % 300), r = 3 + (i % 4);
    return `<div class="pt" style="position:absolute;left:${x}px;top:${y}px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:#e7d8a1;box-shadow:0 0 10px #e7d8a1;opacity:0"></div>`;
  }).join(""), t0, null, { d: 0.2 });
  $$(g, ".pt").forEach((p, i) => {
    for (let s = t0 + (i % 5) * 0.35; s < CFG.dur - 0.3; s += 1.9)
      tl.fromTo(p, { y: 0, opacity: 0 }, { y: -120, opacity: 0, duration: 1.8, ease: "none", immediateRender: false,
        onUpdate() { const k = this.progress(); p.style.opacity = (Math.sin(k * Math.PI) * 0.9).toFixed(2); } }, s);
  });
}
K.pill("Cuidamos do processo todo", A("cuida"), { y: 760, icon: "check", up: true });
K.cta("Link na bio", A("clica"), { y: 870, w: 760, clickAt: A("link da bio") - A("clica") + 0.1 });
K.pill("Agende seu diagnóstico", A("agende"), { y: 1040, icon: "clock", up: true });
K.hideMouth(A("agende") - 0.05, CFG.dur + 1); // a pílula repete a fala; a legenda subiria sobre o botão

// legenda (a mesma do reel "Saída Fiscal") — SEMPRE por último
K.mouthCaps({ accent: ["Nubank", "residência", "fiscal", "Uruguai", "economia", "impostos", "bilionário", "lógica", "Brasil", "trabalhar", "estudar",
  "recomeçar", "planejamento", "dobro", "malas", "dois", "passos", "Primeiro", "Saída", "Definitiva", "País", "Receita", "Federal", "residente",
  "Segundo", "Conta", "investimentos", "imóvel", "empresa", "declaração", "renda", "pendência", "cabeça", "malha", "fina", "100%", "lei",
  "Resultax", "Internacional", "link", "bio", "diagnóstico"] });
