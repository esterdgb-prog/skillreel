// VSL preto/dourado · "Fundador do Nubank no Uruguai → Saída Definitiva" · Resultax Internacional
// Mesmo motor, paleta e legenda do reel "Saída Fiscal" v3: sem apresentador, tudo é motion graphics em SVG próprio,
// cada desenho entra na palavra falada (K.at). Imagens reais: a do Nubank (app + cartão, enviada pelo cliente, fundo
// removido) e a logo da Resultax. Conteúdo em y 260–1120; legenda fixa em ~y 1190, logo abaixo.
const A = (p, n = 1, after = 0) => K.at(p, n, after);
const GOLD = "var(--acc)", GOLDL = "var(--lav)", SILVER = "var(--muted)", RED = "#ff5a3a", WHITE = "#ffffff";
const UI = document.querySelector("#ui");
const ST = (c, w = 6, fill = "none") => `style="fill:${fill};stroke:${c};stroke-width:${w};stroke-linecap:round;stroke-linejoin:round"`;
const GLOW = "filter:drop-shadow(0 0 12px rgba(var(--accRGB),.55))";
const FULL = `position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:visible`;

/** cena em coordenadas absolutas do quadro (1080×1920): entra com blur→nítido em t, sai em until */
const scene = (html, t, until, opt = {}) => {
  const g = document.createElement("div");
  g.className = "k"; g.style.inset = "0"; g.innerHTML = html; UI.appendChild(g);
  K.fromTo(g, { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)", duration: opt.d || 0.35, ease: "power3.out" }, t);
  if (until) K.out(g, until, 0.25);
  return g;
};
const $$ = (g, s) => [...g.querySelectorAll(s)];
/** desenha traços SVG (stroke) do zero ao fim */
const draw = (els, t, d = 0.6, stagger = 0, ease = "power2.inOut") => els.forEach((e, i) => {
  const L = Math.ceil(e.getTotalLength()) + 2;
  e.style.strokeDasharray = L; e.style.strokeDashoffset = L;
  tl.fromTo(e, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: d, ease, immediateRender: false }, t + i * stagger);
});
/** entra com pop (escala + blur) */
const pop = (els, t, stagger = 0.08, from = 0.4) => els.forEach((e, i) => {
  e.style.opacity = "0";
  if (e instanceof SVGElement) gsap.set(e, { transformOrigin: "50% 50%" });
  K.fromTo(e, { opacity: 0, scale: from, filter: "blur(6px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.35, ease: "back.out(1.8)" }, t + i * stagger);
});
/** sobe com fade */
const rise = (els, t, stagger = 0.08) => els.forEach((e, i) => {
  e.style.opacity = "0";
  K.fromTo(e, { opacity: 0, y: 26, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power3.out" }, t + i * stagger);
});
/** pulso (escala) repetido entre a e b */
const pulse = (e, a, b, k = 1.08, per = 0.9) => {
  if (e instanceof SVGElement) gsap.set(e, { transformOrigin: "50% 50%" });
  for (let s = a; s < b - per; s += per) tl.fromTo(e, { scale: 1 }, { scale: k, duration: per / 2, yoyo: true, repeat: 1, ease: "sine.inOut", immediateRender: false }, s);
};
/** flutua (sobe e desce devagar) entre a e b */
const float = (e, a, b, amp = 12, per = 2.4) => {
  for (let s = a; s < b - 0.2; s += per) tl.fromTo(e, { y: 0 }, { y: -amp, duration: per / 2, yoyo: true, repeat: 1, ease: "sine.inOut", immediateRender: false }, s);
};
/** objeto HTML voando por uma curva quadrática p0→p1→p2 (gira na direção do voo) */
const fly = (e, p0, p1, p2, t, d, opt = {}) => {
  const P = { u: 0 }, w = opt.w || 64;
  const at = (u) => [(1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0], (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1]];
  const put = (u) => { const [x, y] = at(u), [x2, y2] = at(Math.min(1, u + 0.01)), [x1, y1] = at(Math.max(0, u - 0.01));
    const ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI + (opt.rot || 0);
    e.style.transform = `translate(${(x - w / 2).toFixed(1)}px,${(y - w / 2).toFixed(1)}px) rotate(${ang.toFixed(1)}deg)`; };
  put(0);
  tl.fromTo(P, { u: 0 }, { u: 1, duration: d, ease: opt.ease || "power1.inOut", immediateRender: false, onUpdate() { put(P.u); } }, t);
  K.fromTo(e, { opacity: 0 }, { opacity: 1, duration: 0.15 }, t);
};
/** contador numérico num elemento */
const count = (e, a, b, t, d, fmt = (v) => Math.round(v)) => {
  const P = { v: a }; e.textContent = fmt(a);
  tl.fromTo(P, { v: a }, { v: b, duration: d, ease: "power2.out", immediateRender: false, onUpdate() { e.textContent = fmt(P.v); } }, t);
};
const PLANE = (w = 64, c = GOLDL, cls = "pl") => `<div class="${cls}" style="position:absolute;left:0;top:0;width:${w}px;height:${w}px;opacity:0;${GLOW}"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:${c}"><path d="M21.5 12c0-.8-.7-1.4-1.5-1.4h-5.2L10 3H8l2.4 7.6H5.3L3.6 8.4H2l1 3.6-1 3.6h1.6l1.7-2.2h5.1L8 21h2l4.8-7.6H20c.8 0 1.5-.6 1.5-1.4z"/></svg></div>`;
const LABEL = (txt, x, y, opt = {}) => `<div class="${opt.cls || "lb"}" style="position:absolute;left:${x}px;top:${y}px;${opt.center ? "transform:translateX(-50%);" : ""}white-space:nowrap;font:${opt.font || "800 30px/1 var(--fS)"};color:${opt.color || WHITE};letter-spacing:${opt.ls || "0"};${opt.css || ""}">${txt}</div>`;
const TAG = (txt, x, y, cls, c = GOLD) => `<div class="${cls}" style="position:absolute;left:${x}px;top:${y}px;transform:translateX(-50%);white-space:nowrap;padding:12px 22px;border-radius:999px;background:rgba(var(--panel2RGB),.92);border:2px solid ${c};font:800 24px/1 var(--fS);letter-spacing:.08em;text-transform:uppercase;color:${WHITE};box-shadow:0 0 22px rgba(var(--accRGB),.35)">${txt}</div>`;
/** pino de mapa (traço) com a ponta em (x, y) */
const PIN = (x, y, cls = "pin", c = GOLD) => `<path class="${cls}" d="M${x} ${y} C${x} ${y} ${x - 60} ${y - 70} ${x - 60} ${y - 110} A60 60 0 1 1 ${x + 60} ${y - 110} C${x + 60} ${y - 70} ${x} ${y} ${x} ${y} Z" ${ST(c, 7)}/><circle class="${cls}" cx="${x}" cy="${y - 112}" r="18" ${ST(GOLDL, 6)}/>`;
/** globo (traço) */
const GLOBE = (cx, cy, r, cls = "gl", c = SILVER) => `<circle class="${cls}" cx="${cx}" cy="${cy}" r="${r}" ${ST(c, 6)}/><ellipse class="${cls}" cx="${cx}" cy="${cy}" rx="${(r * 0.42).toFixed(0)}" ry="${r}" ${ST(c, 5)}/><path class="${cls}" d="M${cx - r} ${cy} H${cx + r}" ${ST(c, 5)}/>`;
/** pessoa (traço): cabeça + ombros, centro x, topo da cabeça em y */
const PERSON = (cx, y, s = 1, cls = "ps", c = SILVER) => `<circle class="${cls}" cx="${cx}" cy="${y + 44 * s}" r="${44 * s}" ${ST(c, 6)}/><path class="${cls}" d="M${cx - 85 * s} ${y + 230 * s} Q${cx - 85 * s} ${y + 125 * s} ${cx} ${y + 125 * s} Q${cx + 85 * s} ${y + 125 * s} ${cx + 85 * s} ${y + 230 * s}" ${ST(c, 6)}/>`;

// mixagem dos efeitos (a mesma medida da v3: alvo −8 a −14 dB RMS abaixo da voz). swoosh do kit quase mudo → whoosh.
{
  const sfx0 = K.sfx, GAIN = { whoosh: 2.8, pop: 0.9, stamp: 0.55, boom: 0.45, click: 0.45, glitch: 0.75, ding: 0.8, riser: 1.3, shimmer: 1.1, tick: 1 };
  K.sfx = (name, t, vol = 0.5) => name === "swoosh" ? sfx0("whoosh", t, vol * 2.2) : sfx0(name, t, vol * (GAIN[name] ?? 1));
}
K.drift(0, CFG.dur, 0.06);
document.querySelector("#vsl").style.setProperty("--cyanRGB", "205,205,205"); // glitch prata em vez de ciano

// ============ 1) GANCHO "Quando o fundador do Nubank mudou a residência fiscal para o Uruguai" — HUD → glitch → app + cartão
const tN = A("nubank") - 0.08, tR = A("mudou") - 0.05, t1a = A("muito se falou") - 0.1;
K.camcorder(0, tN, { label: "RESIDÊNCIA FISCAL · URUGUAI" });
K.glitch(tN);
{
  const g = scene(`<div class="nu" style="position:absolute;left:190px;top:330px;width:700px;filter:drop-shadow(0 30px 60px rgba(0,0,0,.6)) drop-shadow(0 0 40px rgba(var(--accRGB),.25))">
      <img src="assets/img/nubank-app-cartao.png" style="width:100%;display:block"></div>
    ${TAG("Fundador do Nubank", 540, 1030, "fd")}`, tN, null, { d: 0.25 });
  const nu = g.querySelector(".nu");
  K.fromTo(nu, { scale: 0.7, rotation: -6 }, { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.6)" }, tN);
  float(nu, tN + 0.6, tR, 14, 2.2);
  pop($$(g, ".fd"), tN + 0.25);
  K.sfx("whoosh", tN, 0.35);
  // "mudou": o app encolhe e sobe, abrindo espaço para o mapa
  tl.to(nu, { scale: 0.42, x: -250, y: -150, rotation: -8, duration: 0.55, ease: "power3.inOut" }, tR);
  K.out(g.querySelector(".fd"), tR, 0.2);
  K.out(g, t1a, 0.25);
}
{
  // Brasil (alto, à direita) → Uruguai (embaixo, à esquerda): o avião desce pela curva
  const g = scene(`<svg style="${FULL};${GLOW}">
      ${PIN(780, 560, "pb")}${PIN(330, 1010, "pu", GOLDL)}
      <path class="tr" d="M800 640 Q790 920 390 925" ${ST(GOLDL, 5)} stroke-dasharray="3 16"/>
    </svg>${PLANE(64)}
    ${LABEL("BRASIL", 780, 590, { cls: "lbB", center: true, font: "800 28px/1 var(--fS)", ls: ".14em" })}
    ${LABEL("URUGUAI", 330, 1040, { cls: "lbU", center: true, font: "800 28px/1 var(--fS)", color: GOLDL, ls: ".14em" })}
    ${TAG("Nova residência fiscal", 680, 1000, "rf")}`, tR + 0.1, t1a);
  draw($$(g, ".pb"), tR + 0.15, 0.45, 0.1);
  pop($$(g, ".lbB"), tR + 0.35);
  draw($$(g, ".tr"), A("residência fiscal"), 1.0);
  fly(g.querySelector(".pl"), [800, 640], [790, 920], [390, 925], A("residência fiscal"), 1.0, { w: 64 });
  K.sfx("whoosh", A("residência fiscal"), 0.35);
  draw($$(g, ".pu"), A("uruguai") - 0.1, 0.4, 0.1);
  pop($$(g, ".lbU"), A("uruguai"));
  pop($$(g, ".rf"), A("uruguai") + 0.25);
  K.sfx("pop", A("uruguai") + 0.25, 0.35);
  pulse(g.querySelector(".pu"), A("uruguai") + 0.6, t1a, 1.06, 0.8);
}

// ============ 2) "muito se falou na economia de impostos" — manchetes se desenham, "economia de impostos" cresce
{
  const t0 = A("muito se falou") - 0.05, t1 = A("mas você") - 0.1;
  const PAPER = (x, y, r, cls, d0 = 150) => `<g class="${cls}" transform="rotate(${r} ${x + 210} ${y + 260})">
      <rect class="pp" x="${x}" y="${y}" width="420" height="520" rx="10" ${ST(SILVER, 5, "rgba(var(--panel2RGB),.85)")}/>
      <path class="pp" d="M${x + 40} ${y + 70} H${x + 380}" ${ST(GOLD, 14)}/>
      ${[0, 50, 100, 150, 200, 250, 300].map((k) => d0 + k).filter((dy) => dy <= 470).map((dy, i) => `<path class="pl2" d="M${x + 40} ${y + dy} H${x + [330, 380, 300, 360, 280, 380, 240][i]}" ${ST(SILVER, 9)} opacity=".45"/>`).join("")}
    </g>`;
  const g = scene(`<svg style="${FULL}">${PAPER(150, 400, -9, "p1")}${PAPER(510, 400, 8, "p2")}${PAPER(330, 360, 0, "p3", 330)}</svg>
    ${LABEL("MANCHETES", 540, 300, { cls: "kk", center: true, font: "500 24px/1 var(--fM)", color: GOLDL, ls: ".4em" })}
    <div class="hl" style="position:absolute;left:290px;top:520px;width:500px;text-align:left;font:900 64px/1.02 var(--fS);color:${WHITE};text-transform:uppercase">Economia<br><span style="color:${GOLDL}">de impostos</span></div>`, t0, t1);
  const [p1, p2, p3] = [".p1", ".p2", ".p3"].map((s) => g.querySelector(s));
  [p1, p2, p3].forEach((p, i) => { p.style.opacity = "0"; K.fromTo(p, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, A("muito se falou") + i * 0.15); });
  draw($$(g, ".p3 .pl2"), A("falou") + 0.2, 0.3, 0.06);
  K.sfx("swoosh", A("muito se falou"), 0.35);
  pop($$(g, ".kk"), A("falou"));
  rise($$(g, ".hl"), A("economia"));
  K.sfx("pop", A("economia"), 0.35);
  K.fromTo(g.querySelector(".hl"), { scale: 1 }, { scale: 1.06, duration: 0.4, ease: "power2.out" }, A("impostos"));
}

// ============ 3) "Mas você não precisa ser bilionário pra cair na mesma lógica" — barras de ouro → X → você
{
  const t0 = A("mas você") - 0.05, tL = A("mesma lógica"), t1 = A("quem vai morar") - 0.1;
  const BAR = (x, y) => `<path class="br" d="M${x} ${y} L${x + 30} ${y - 60} H${x + 170} L${x + 200} ${y} Z" ${ST(GOLD, 6, "rgba(var(--accRGB),.22)")}/>`;
  const g = scene(`<svg style="${FULL};${GLOW}">
      ${BAR(240, 900)}${BAR(440, 900)}${BAR(640, 900)}${BAR(340, 840)}${BAR(540, 840)}${BAR(440, 780)}
      <path class="sp" d="M540 600 l14 34 l34 14 l-34 14 l-14 34 l-14 -34 l-34 -14 l34 -14 Z" style="fill:${GOLDL};opacity:0"/>
      <path class="x" d="M250 640 L830 940" ${ST(RED, 16)}/><path class="x" d="M830 640 L250 940" ${ST(RED, 16)}/>
    </svg>${TAG("Bilionário", 540, 980, "bl")}`, t0, tL - 0.05);
  draw($$(g, ".br"), A("não precisa"), 0.35, 0.07);
  K.sfx("swoosh", A("não precisa"), 0.35);
  pop($$(g, ".bl"), A("bilionário"));
  const sp = g.querySelector(".sp"); gsap.set(sp, { transformOrigin: "50% 50%" });
  K.fromTo(sp, { opacity: 0, scale: 0, rotation: 0 }, { opacity: 1, scale: 1, rotation: 90, duration: 0.5, ease: "back.out(2)" }, A("bilionário") + 0.1);
  K.sfx("shimmer", A("bilionário") + 0.1, 0.25);
  draw($$(g, ".x"), A("pra cair") - 0.15, 0.2, 0.12, "power3.out");
  K.sfx("stamp", A("pra cair") - 0.05, 0.5);
  tl.to(g, { x: 10, duration: 0.05, yoyo: true, repeat: 5 }, A("pra cair") + 0.15);
  // a mesma lógica vale para qualquer um
  const p = scene(`<svg style="${FULL};${GLOW}">${PERSON(540, 520, 1.3, "ps", GOLDL)}</svg>${TAG("Mesma lógica", 540, 880, "ml")}`, tL - 0.05, t1);
  draw($$(p, ".ps"), tL, 0.45, 0.1);
  pop($$(p, ".ml"), tL + 0.3);
  K.sfx("pop", tL + 0.3, 0.3);
}

// ============ 4) "quem vai morar fora do Brasil, seja para trabalhar, estudar ou recomeçar a vida"
{
  const t0 = A("quem vai morar") - 0.05, t1 = A("precisa de planejamento") - 0.1;
  K.sfx("whoosh", t0, 0.3);
  const g = scene(`<svg style="${FULL};${GLOW}">
      ${PERSON(430, 370, 1.05, "ps", SILVER)}
      <rect class="sc" x="560" y="500" width="150" height="120" rx="16" ${ST(GOLD, 6, "rgba(var(--accRGB),.15)")}/>
      <path class="sc" d="M605 500 V470 H665 V500 M600 520 V600 M670 520 V600" ${ST(GOLD, 6)}/>
      <path class="tr" d="M150 330 Q540 180 930 300" ${ST(GOLDL, 4)} stroke-dasharray="2 14"/>
    </svg>${PLANE(60)}
    ${LABEL("FORA DO BRASIL", 540, 300, { cls: "kk", center: true, font: "500 24px/1 var(--fM)", color: GOLDL, ls: ".4em" })}`, t0, t1);
  draw($$(g, ".ps"), A("quem vai morar"), 0.45, 0.1);
  draw($$(g, ".sc"), A("morar fora") + 0.1, 0.4, 0.1);
  draw($$(g, ".tr"), A("fora do brasil"), 0.9);
  fly(g.querySelector(".pl"), [150, 330], [540, 180], [930, 300], A("fora do brasil"), 0.9, { w: 60 });
  pop($$(g, ".kk"), A("brasil"));
  // três motivos: trabalhar · estudar · recomeçar
  const CELL = (cx, cls, icon, label) => `<div class="${cls}" style="position:absolute;left:${cx - 120}px;top:800px;width:240px;text-align:center">
      <svg width="150" height="150" viewBox="0 0 150 150" style="overflow:visible;${GLOW}"><circle cx="75" cy="75" r="68" ${ST(GOLD, 5, "rgba(var(--panel2RGB),.9)")}/>${icon}</svg>
      <div style="font:800 32px/1 var(--fS);margin-top:16px">${label}</div></div>`;
  const c = scene(
    CELL(220, "m1", `<rect x="38" y="58" width="74" height="54" rx="8" ${ST(GOLDL, 6)}/><path d="M60 58 V46 H90 V58 M38 80 H112" ${ST(GOLDL, 6)}/>`, "Trabalhar") +
    CELL(540, "m2", `<path d="M30 66 L75 46 L120 66 L75 86 Z" ${ST(GOLDL, 6)}/><path d="M50 76 V98 C65 110 85 110 100 98 V76 M120 66 V92" ${ST(GOLDL, 6)}/>`, "Estudar") +
    CELL(860, "m3", `<path d="M75 112 V70" ${ST(GOLDL, 6)}/><path d="M75 80 C75 58 58 46 40 46 C40 66 54 80 75 80 Z M75 70 C75 50 92 38 110 38 C110 58 96 70 75 70 Z" ${ST(GOLDL, 6)}/><path d="M50 112 H100" ${ST(GOLDL, 6)}/>`, "Recomeçar"),
    A("trabalhar") - 0.1, t1);
  pop($$(c, ".m1"), A("trabalhar"), 0, 0.6); K.sfx("pop", A("trabalhar"), 0.3);
  pop($$(c, ".m2"), A("estudar"), 0, 0.6); K.sfx("pop", A("estudar"), 0.3);
  pop($$(c, ".m3"), A("recomeçar"), 0, 0.6); K.sfx("pop", A("recomeçar"), 0.3);
}

// ============ 5) "precisa de planejamento para não pagar imposto em dobro" — prancheta → dois impostos → EM DOBRO
{
  const t0 = A("precisa de planejamento") - 0.05, tD = A("pagar imposto") - 0.1, t1 = A("e não basta") - 0.1;
  K.sfx("whoosh", t0, 0.3);
  const cb = scene(`<svg style="${FULL};${GLOW}">
      <rect class="cb" x="370" y="380" width="340" height="440" rx="22" ${ST(GOLD, 7, "rgba(var(--accRGB),.08)")}/>
      <rect class="cb" x="470" y="350" width="140" height="60" rx="14" ${ST(GOLDL, 6, "rgba(var(--panel2RGB),1)")}/>
      ${[480, 580, 680].map((y) => `<path class="ck" d="M420 ${y} l18 18 l32 -36" ${ST(GOLDL, 8)}/><path class="ln" d="M500 ${y + 2} H650" ${ST(SILVER, 9)} opacity=".55"/>`).join("")}
    </svg>${TAG("Planejamento", 540, 880, "pj")}`, t0, tD);
  draw($$(cb, ".cb"), A("planejamento") - 0.1, 0.45, 0.1);
  draw($$(cb, ".ck, .ln"), A("planejamento") + 0.2, 0.18, 0.07);
  pop($$(cb, ".pj"), A("planejamento") + 0.2);
  // dois impostos sobre a mesma renda
  const DOC = (x, cls, lab) => `<div class="${cls}" style="position:absolute;left:${x}px;top:420px;width:300px;height:400px;border-radius:18px;border:3px solid ${SILVER};background:rgba(var(--panel2RGB),.92);box-shadow:0 0 26px rgba(var(--accRGB),.25)">
      <div style="margin:34px 30px 0;font:900 40px/1 var(--fS);color:${GOLDL}">IMPOSTO</div>
      <div style="margin:12px 30px 0;font:700 24px/1 var(--fS);letter-spacing:.12em;color:${SILVER}">${lab}</div>
      ${[0, 1, 2, 3].map((k) => `<div style="margin:${k ? 22 : 40}px 30px 0;height:12px;border-radius:6px;width:${[220, 180, 230, 150][k]}px;background:rgba(255,255,255,.18)"></div>`).join("")}
      <div style="position:absolute;left:30px;bottom:30px;font:900 44px/1 var(--fS);color:${WHITE}">R$ ••••</div></div>`;
  const d = scene(DOC(130, "d1", "NO BRASIL") + DOC(650, "d2", "NO EXTERIOR") +
    `<div class="x2" style="position:absolute;left:540px;top:560px;transform:translate(-50%,0);font:900 120px/1 var(--fD,var(--fS));color:${WHITE};text-shadow:0 0 30px rgba(var(--accRGB),.9)">×2</div>`, tD, t1);
  K.fromTo(d.querySelector(".d1"), { opacity: 0, x: -80, rotation: -6 }, { opacity: 1, x: 0, rotation: -4, duration: 0.4, ease: "power3.out" }, A("pagar imposto"));
  K.fromTo(d.querySelector(".d2"), { opacity: 0, x: 80, rotation: 6 }, { opacity: 1, x: 0, rotation: 4, duration: 0.4, ease: "power3.out" }, A("imposto") + 0.15);
  K.sfx("swoosh", A("pagar imposto"), 0.35);
  pop($$(d, ".x2"), A("em dobro"), 0, 0.3);
  K.stamp("EM DOBRO", A("em dobro") + 0.25, { x: 560, y: 860, rot: -10, until: t1 });
}

// ============ 6) "E não basta arrumar as malas. O processo tem dois passos:" — mala → "2 passos"
{
  const t0 = A("e não basta") - 0.05, tP = A("o processo") - 0.08, t1 = A("primeiro") - 0.1;
  const g = scene(`<svg style="${FULL};${GLOW}">
      <rect class="mm" x="300" y="470" width="480" height="420" rx="40" ${ST(GOLD, 8)}/>
      <path class="mm" d="M450 470 V400 C450 380 465 370 485 370 H595 C615 370 630 380 630 400 V470" ${ST(GOLD, 8)}/>
      <path class="mm" d="M420 470 V890 M660 470 V890" ${ST(GOLDL, 7)}/>
      <circle class="wh" cx="370" cy="915" r="22" ${ST(SILVER, 6)}/><circle class="wh" cx="710" cy="915" r="22" ${ST(SILVER, 6)}/>
    </svg>`, t0, tP);
  draw($$(g, ".mm"), A("arrumar"), 0.5, 0.12);
  pop($$(g, ".wh"), A("arrumar") + 0.4, 0.08);
  K.sfx("swoosh", A("arrumar"), 0.35);
  tl.to(g, { rotation: 3, transformOrigin: "50% 60%", duration: 0.08, yoyo: true, repeat: 5 }, A("malas") + 0.1);
  K.pill("Não basta", A("não basta"), { y: 300, kind: "strike", up: true, until: tP });
  // dois passos: 1 —— 2
  K.sfx("riser", tP - 0.2, 0.25);
  K.stack([{ text: "2 passos", t: A("dois passos"), style: "glow" }], { top: 470, size: 130, until: t1 });
  const s = scene(`<svg style="${FULL};${GLOW}">
      <path class="ln" d="M330 860 H750" ${ST(GOLD, 6)} stroke-dasharray="4 14"/>
      <circle class="n1" cx="300" cy="860" r="56" ${ST(GOLD, 7, "rgba(var(--accRGB),.18)")}/><circle class="n2" cx="780" cy="860" r="56" ${ST(GOLD, 7, "rgba(var(--accRGB),.18)")}/>
    </svg>${LABEL("1", 300, 828, { cls: "t1", center: true, font: "900 64px/1 var(--fS)" })}${LABEL("2", 780, 828, { cls: "t2", center: true, font: "900 64px/1 var(--fS)" })}`, tP, t1);
  pop($$(s, ".n1, .t1"), tP + 0.1, 0.05);
  draw($$(s, ".ln"), tP + 0.3, 0.6);
  pop($$(s, ".n2, .t2"), A("dois passos") + 0.2, 0.05);
  K.sfx("ding", A("dois passos") + 0.3, 0.35);
}

// ============ 7) "Primeiro: formalizar a sua Saída Definitiva do País junto à Receita Federal."
{
  const t0 = A("primeiro") - 0.05, t1 = A("sem isso") - 0.1;
  const num = scene(`${LABEL("PASSO", 540, 290, { center: true, font: "500 24px/1 var(--fM)", color: GOLDL, ls: ".4em" })}
    <div style="position:absolute;left:0;width:1080px;top:320px;text-align:center"><span class="disp glow nn" style="font-size:150px">1</span></div>`, t0, t1);
  K.fromTo(num.querySelector(".nn"), { scale: 1.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" }, A("primeiro"));
  K.sfx("boom", A("primeiro"), 0.3);
  const g = scene(`<svg style="${FULL};${GLOW}">
      <path class="o" d="M330 500 H650 L750 600 V1020 H330 Z" ${ST(GOLD, 7)}/>
      <path class="o" d="M650 500 V600 H750" ${ST(GOLD, 7)}/>
      ${[730, 785, 840].map((y, i) => `<path class="ln" d="M380 ${y} H${[700, 650, 690][i]}" ${ST(SILVER, 10)} opacity=".55"/>`).join("")}
      <path class="sg" d="M390 950 c25 -40 45 35 70 -5 s40 -40 65 0 s35 30 60 -15" ${ST(GOLDL, 5)}/>
      <circle class="seal" cx="680" cy="945" r="40" ${ST(GOLD, 5, "rgba(var(--accRGB),.18)")}/><path class="sck" d="M662 945 l12 12 l24 -26" ${ST(GOLDL, 7)}/>
    </svg>${TAG("✓ Receita Federal", 540, 1055, "rfx")}
    <div class="tt" style="position:absolute;left:380px;top:555px;font:900 36px/1.08 var(--fS);color:${GOLDL};text-transform:uppercase">Saída<br>Definitiva<br><span style="color:${WHITE};font-size:28px">do País</span></div>`, A("formalizar") - 0.05, t1);
  draw($$(g, ".o"), A("formalizar"), 0.6, 0.15);
  K.sfx("swoosh", A("formalizar"), 0.35);
  rise($$(g, ".tt"), A("saída definitiva"));
  draw($$(g, ".ln"), A("saída definitiva") + 0.3, 0.3, 0.1);
  draw($$(g, ".sg"), A("país") , 0.5);
  pop($$(g, ".seal"), A("receita federal"));
  draw($$(g, ".sck"), A("receita federal") + 0.2, 0.25);
  pop($$(g, ".rfx"), A("receita federal") + 0.1);
  K.sfx("ding", A("receita federal") + 0.2, 0.35);
}

// ============ 8) "Sem isso, você pode continuar sendo tratado como residente fiscal aqui, mesmo morando lá fora."
{
  const t0 = A("sem isso") - 0.05, t1 = A("segundo") - 0.1;
  const w = scene(`<svg style="${FULL};filter:drop-shadow(0 0 14px rgba(255,90,58,.7))">
      <path class="tri" d="M540 300 L620 440 L460 440 Z" ${ST(RED, 10)}/><path class="ex" d="M540 345 V395" ${ST(RED, 11)}/><circle class="exd" cx="540" cy="418" r="7" style="fill:${RED}"/></svg>`, t0, t1);
  draw($$(w, ".tri"), A("sem isso"), 0.4);
  draw($$(w, ".ex"), A("sem isso") + 0.3, 0.15);
  pop($$(w, ".exd"), A("sem isso") + 0.4);
  K.sfx("boom", A("sem isso"), 0.25);
  const g = scene(`<svg style="${FULL};${GLOW}">
      ${PIN(250, 780, "pb")}
      ${GLOBE(830, 630, 90)}
      ${PERSON(830, 760, 0.5, "ps", GOLDL)}
      <path class="ch" d="M330 620 Q540 500 735 600" ${ST(RED, 6)} stroke-dasharray="14 12"/>
    </svg>
    ${LABEL("BRASIL", 250, 810, { cls: "lbB", center: true, font: "800 26px/1 var(--fS)", ls: ".14em" })}
    ${LABEL("LÁ FORA", 830, 910, { cls: "lbE", center: true, font: "800 26px/1 var(--fS)", color: GOLDL, ls: ".14em" })}
    ${TAG("Residente fiscal no Brasil", 540, 990, "rf", RED)}`, A("você pode") - 0.1, t1);
  draw($$(g, ".pb"), A("você pode"), 0.45, 0.1);
  pop($$(g, ".lbB"), A("você pode") + 0.3);
  draw($$(g, ".gl"), A("você pode") + 0.2, 0.45, 0.1);
  draw($$(g, ".ps"), A("você pode") + 0.4, 0.4, 0.1);
  K.sfx("swoosh", A("você pode"), 0.3);
  draw($$(g, ".ch"), A("continuar"), 0.7);
  pop($$(g, ".rf"), A("residente fiscal"));
  K.sfx("pop", A("residente fiscal"), 0.35);
  pulse(g.querySelector(".pb"), A("aqui"), A("mesmo morando"), 1.08, 0.6);
  pop($$(g, ".lbE"), A("lá fora"));
}

// ============ 9+10) "Segundo: organizar o que você deixa pra trás. Conta, investimentos, imóvel, empresa, declaração de imposto
// de renda. Se ficar solto, vira pendência, e pendência vira dor de cabeça e malha fina." — grade de 5 itens → soltos → malha fina
{
  const t0 = A("segundo") - 0.05, tS = A("se ficar solto"), t1 = A("vai morar no exterior") - 0.1;
  const num = scene(`${LABEL("PASSO", 540, 290, { center: true, font: "500 24px/1 var(--fM)", color: GOLDL, ls: ".4em" })}
    <div style="position:absolute;left:0;width:1080px;top:320px;text-align:center"><span class="disp glow nn" style="font-size:150px">2</span></div>`, t0, tS);
  K.fromTo(num.querySelector(".nn"), { scale: 1.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" }, A("segundo"));
  K.sfx("boom", A("segundo"), 0.3);
  K.kickerTop("O que fica para trás", A("organizar"), { y: 500, size: 26, until: A("conta") - 0.05 });
  const IC = {
    conta: `<rect x="22" y="40" width="96" height="62" rx="10" ${ST(GOLDL, 6)}/><path d="M22 58 H118 M36 86 H64" ${ST(GOLDL, 6)}/>`,
    inv: `<path d="M26 108 H116" ${ST(GOLDL, 6)}/><path d="M36 100 V78 M62 100 V64 M88 100 V50" ${ST(GOLDL, 10)}/><path d="M30 60 L58 42 L80 52 L112 28 M98 28 H112 V42" ${ST(GOLDL, 6)}/>`,
    imovel: `<path d="M24 66 L70 28 L116 66" ${ST(GOLDL, 6)}/><path d="M36 58 V108 H104 V58 M60 108 V80 H80 V108" ${ST(GOLDL, 6)}/>`,
    empresa: `<path d="M30 110 V36 H80 V110 M80 60 H112 V110 M22 110 H120" ${ST(GOLDL, 6)}/><path d="M44 52 H66 M44 70 H66 M44 88 H66 M92 76 H100 M92 92 H100" ${ST(GOLDL, 5)}/>`,
    ir: `<path d="M34 22 H86 L106 42 V118 H34 Z M86 22 V42 H106" ${ST(GOLDL, 6)}/><text x="70" y="94" text-anchor="middle" style="font:900 34px var(--fS);fill:${GOLDL}">IR</text>`,
  };
  const items = [["conta", "Conta", 230, 600, "conta"], ["inv", "Investimentos", 540, 600, "investimentos"], ["imovel", "Imóvel", 850, 600, "imóvel"],
    ["empresa", "Empresa", 385, 850, "empresa"], ["ir", "Declaração de IR", 695, 850, "declaração"]];
  const g = scene(items.map(([k, lab, cx, cy]) => `<div class="it it-${k}" style="position:absolute;left:${cx - 130}px;top:${cy - 90}px;width:260px;text-align:center">
      <div style="position:relative;width:150px;height:150px;margin:0 auto;border-radius:30px;border:3px solid ${GOLD};background:rgba(var(--panel2RGB),.92);box-shadow:0 0 24px rgba(var(--accRGB),.3)">
        <svg width="140" height="140" viewBox="0 0 140 140" style="position:absolute;left:5px;top:5px;overflow:visible">${IC[k]}</svg>
        <div class="bd" style="position:absolute;right:-14px;top:-14px;width:46px;height:46px;border-radius:50%;background:${RED};color:#fff;font:900 30px/46px var(--fS);text-align:center;box-shadow:0 0 16px rgba(255,90,58,.8);opacity:0">!</div>
      </div>
      <div style="font:800 28px/1.1 var(--fS);margin-top:14px">${lab}</div></div>`).join(""), A("conta") - 0.1, t1);
  items.forEach(([k, , , , w]) => { pop($$(g, `.it-${k}`), A(w), 0, 0.5); K.sfx(k === "ir" ? "ding" : "click", A(w) + 0.05, k === "ir" ? 0.3 : 0.4); });
  // "se ficar solto": cada item se solta e flutua torto
  const its = $$(g, ".it");
  its.forEach((e, i) => tl.to(e, { x: [-40, 30, 50, -50, 35][i], y: [-30, 40, -20, 30, -40][i], rotation: [-14, 10, 16, -12, 9][i], duration: 1.2, ease: "power2.out" }, tS + i * 0.06));
  K.sfx("swoosh", tS, 0.3);
  // "vira pendência": selo vermelho em todos
  pop($$(g, ".bd"), A("pendência"), 0.07, 0.3);
  K.pill("Pendência", A("pendência"), { y: 300, kind: "dark", icon: "clock", up: true, until: t1 });
  K.sfx("pop", A("pendência"), 0.35);
  // "dor de cabeça": tremor
  tl.to(g, { x: 9, duration: 0.05, yoyo: true, repeat: 7 }, A("dor de cabeça"));
  K.sfx("glitch", A("dor de cabeça"), 0.25);
  // "malha fina": uma rede vermelha cai sobre tudo
  const net = scene(`<svg style="${FULL};filter:drop-shadow(0 0 10px rgba(255,90,58,.6))">
      <g class="nt" opacity=".85">${[0, 1, 2, 3, 4, 5, 6, 7].map((k) => `<path class="nl" d="M${120 + k * 120} 470 V1060" ${ST(RED, 4)}/>`).join("")}
      ${[0, 1, 2, 3, 4, 5].map((k) => `<path class="nl" d="M100 ${490 + k * 110} H980" ${ST(RED, 4)}/>`).join("")}</g></svg>`, A("malha fina") - 0.05, t1, { d: 0.15 });
  K.fromTo(net.querySelector(".nt"), { y: -260 }, { y: 0, duration: 0.45, ease: "bounce.out" }, A("malha fina") - 0.05);
  K.stamp("MALHA FINA", A("malha fina") + 0.35, { x: 560, y: 760, rot: -10, until: t1 });
}

// ============ 11) "Vai morar no exterior e quer fazer tudo isso 100% dentro da lei?"
{
  const t0 = A("vai morar no exterior"), t1 = A("na resultax") - 0.08;
  K.pill("Vai morar no exterior?", t0, { y: 300, icon: "user", up: true, until: t1 });
  K.sfx("whoosh", t0, 0.3);
  const g = scene(`<div style="position:absolute;left:0;width:1080px;top:430px;text-align:center"><span class="disp glow" style="font-size:190px"><span class="n">0</span>%</span></div>
    <svg style="${FULL};${GLOW}">
      <path class="sh" d="M540 690 L700 740 V860 C700 960 620 1020 540 1050 C460 1020 380 960 380 860 V740 Z" ${ST(GOLD, 8, "rgba(var(--accRGB),.12)")}/>
      <path class="sk" d="M470 870 l45 45 l90 -100" ${ST(GOLDL, 12)}/>
    </svg>${LABEL("DENTRO DA LEI", 540, 1080, { cls: "dl", center: true, font: "800 30px/1 var(--fS)", color: GOLDL, ls: ".18em" })}`, A("100%") - 0.15, t1);
  count(g.querySelector(".n"), 0, 100, A("100%"), 0.7);
  for (let k = 1; k <= 3; k++) K.sfx("tick", A("100%") + k * 0.18, 0.25);
  draw($$(g, ".sh"), A("dentro da lei"), 0.5);
  draw($$(g, ".sk"), A("lei"), 0.3, 0, "power3.out");
  pop($$(g, ".dl"), A("lei") + 0.1);
  K.sfx("ding", A("lei") + 0.2, 0.35);
}

// ============ 12) CTA "Na Resultax Internacional a gente cuida do processo todo. Clica no link da bio e agende o seu diagnóstico."
K.logo({ img: "assets/img/logo-resultax.png" }, A("resultax"), CFG.dur - A("resultax") + 0.3, { y: 290, h: 380 });
{ // partículas douradas subindo em volta da logo
  const t0 = A("resultax") + 0.4;
  const g = scene(Array.from({ length: 16 }, (_, i) => {
    const x = 160 + ((i * 137) % 760), y = 420 + ((i * 89) % 300), r = 3 + (i % 4);
    return `<div class="pt" style="position:absolute;left:${x}px;top:${y}px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:${GOLDL};box-shadow:0 0 10px ${GOLDL};opacity:0"></div>`;
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

// legenda fixa logo abaixo do conteúdo — SEMPRE por último
K.mouthCaps({ accent: ["Nubank", "residência", "fiscal", "Uruguai", "economia", "impostos", "bilionário", "lógica", "Brasil", "trabalhar", "estudar",
  "recomeçar", "planejamento", "dobro", "malas", "dois", "passos", "Primeiro", "Saída", "Definitiva", "País", "Receita", "Federal", "residente",
  "Segundo", "Conta", "investimentos", "imóvel", "empresa", "declaração", "renda", "pendência", "cabeça", "malha", "fina", "100%", "lei",
  "Resultax", "Internacional", "link", "bio", "diagnóstico"] });
