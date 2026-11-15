// VSL preto/dourado · "Saída Fiscal: agora é lei?" v3 (68,2 s) · voz do cliente (respirações cortadas, 1,08×)
// Sem apresentador: tudo é motion graphics desenhado em SVG próprio (ilustração declarada, nenhum print/logo de terceiro
// além da logo do próprio cliente). Cada desenho se traça / entra na palavra falada (K.at). Legenda fixa em ~y 1190,
// logo abaixo do conteúdo (que fica em y 260–1120).
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
const PLANE = (w = 64, c = GOLDL) => `<div class="pl" style="position:absolute;left:0;top:0;width:${w}px;height:${w}px;opacity:0;${GLOW}"><svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:${c}"><path d="M21.5 12c0-.8-.7-1.4-1.5-1.4h-5.2L10 3H8l2.4 7.6H5.3L3.6 8.4H2l1 3.6-1 3.6h1.6l1.7-2.2h5.1L8 21h2l4.8-7.6H20c.8 0 1.5-.6 1.5-1.4z"/></svg></div>`;
const LABEL = (txt, x, y, opt = {}) => `<div class="${opt.cls || "lb"}" style="position:absolute;left:${x}px;top:${y}px;${opt.center ? "transform:translateX(-50%);" : ""}white-space:nowrap;font:${opt.font || "800 30px/1 var(--fS)"};color:${opt.color || WHITE};letter-spacing:${opt.ls || "0"};${opt.css || ""}">${txt}</div>`;
const TAG = (txt, x, y, cls, c = GOLD) => `<div class="${cls}" style="position:absolute;left:${x}px;top:${y}px;transform:translateX(-50%);white-space:nowrap;padding:12px 22px;border-radius:999px;background:rgba(var(--panel2RGB),.92);border:2px solid ${c};font:800 24px/1 var(--fS);letter-spacing:.08em;text-transform:uppercase;color:${WHITE};box-shadow:0 0 22px rgba(var(--accRGB),.35)">${txt}</div>`;

K.drift(0, CFG.dur, 0.06);
document.querySelector("#vsl").style.setProperty("--cyanRGB", "205,205,205"); // glitch prata em vez de ciano

// ============ 1) GANCHO "Saída Fiscal: agora é lei?" — HUD → glitch · avião risca o céu atrás do título
const tG = A("agora é lei") - 0.05;
K.camcorder(0, tG, { label: "SAÍDA FISCAL · BRASIL" });
K.glitch(tG);
{
  const g = scene(`<svg style="${FULL}"><path class="tr" d="M110 560 Q520 250 960 420" ${ST(GOLDL, 4)} stroke-dasharray="1 0"/></svg>${PLANE(70)}`, tG, A("você sabia") - 0.05);
  draw($$(g, ".tr"), tG + 0.05, 1.1);
  fly(g.querySelector(".pl"), [110, 560], [520, 250], [960, 420], tG + 0.05, 1.1, { w: 70 });
  K.sfx("whoosh", tG + 0.25, 0.35);
}
K.stack([
  { text: "Saída Fiscal:", t: A("saída fiscal") + 0.02, style: "blur" },
  { text: "agora é lei?", t: A("agora é lei"), style: "glow" },
], { top: 640, size: 104, gap: 128, until: A("você sabia") - 0.06 });
K.hideMouth(0, A("você sabia"));

// ============ 2) "Você sabia que a obrigação relacionada à Saída Fiscal não é uma novidade?" — documento se desenha
{
  const t0 = A("você sabia"), t1 = A("muita gente") - 0.1;
  K.kickerTop("Você sabia?", t0, { y: 300, size: 28, until: t1 });
  const g = scene(`<svg style="${FULL};${GLOW}">
      <path class="o" d="M330 400 H650 L750 500 V980 H330 Z" ${ST(GOLD, 7)}/>
      <path class="o" d="M650 400 V500 H750" ${ST(GOLD, 7)}/>
      ${[560, 620, 680, 740, 800].map((y, i) => `<path class="ln" d="M390 ${y} H${[690, 640, 700, 600, 660][i]}" ${ST(SILVER, 10)} opacity=".55"/>`).join("")}
      <path class="sg" d="M400 900 c25 -40 45 35 70 -5 s40 -40 65 0 s35 30 60 -15" ${ST(GOLDL, 5)}/>
      <circle class="seal" cx="690" cy="900" r="34" ${ST(GOLD, 5, "rgba(var(--accRGB),.18)")}/>
    </svg>
    ${LABEL("SAÍDA FISCAL", 390, 455, { cls: "tt", font: "800 30px/1 var(--fS)", color: GOLDL, ls: ".12em" })}`, A("obrigação") - 0.05, t1);
  draw($$(g, ".o"), A("obrigação"), 0.7, 0.15);
  K.sfx("swoosh", A("obrigação"), 0.4);
  pop($$(g, ".tt"), A("obrigação") + 0.5);
  draw($$(g, ".ln"), A("relacionada"), 0.35, 0.12);
  draw($$(g, ".sg"), A("saída fiscal", 2), 0.5);
  pop($$(g, ".seal"), A("saída fiscal", 2) + 0.3);
  K.stamp("NÃO É NOVIDADE", A("não é uma novidade"), { x: 470, y: 760, rot: -10, until: t1 });
}

// ============ 3) "Muita gente pensa que essa é uma exigência recente, mas isso não é verdade!" — pessoas + balão + X
{
  const t0 = A("muita gente") - 0.05, t1 = A("desde") - 0.1;
  const P = (cx) => `<circle class="hd" cx="${cx}" cy="790" r="44" ${ST(SILVER, 6)}/><path class="bd" d="M${cx - 85} 1020 Q${cx - 85} 870 ${cx} 870 Q${cx + 85} 870 ${cx + 85} 1020" ${ST(SILVER, 6)}/>`;
  const g = scene(`<svg style="${FULL}">
      ${P(320)}${P(540)}${P(760)}
      <path class="bb" d="M540 330 C820 330 900 400 900 470 C900 545 820 610 540 610 C260 610 180 545 180 470 C180 400 260 330 540 330 Z" ${ST(GOLD, 6, "rgba(var(--panel2RGB),.6)")}/>
      <circle class="tc" cx="520" cy="650" r="16" ${ST(GOLD, 5)}/><circle class="tc" cx="532" cy="694" r="9" ${ST(GOLD, 4)}/>
      <path class="x" d="M260 360 L820 590" ${ST(RED, 16)}/><path class="x" d="M820 360 L260 590" ${ST(RED, 16)}/>
    </svg>
    ${LABEL("“É uma exigência recente”", 540, 448, { cls: "bt", center: true, font: "800 46px/1 var(--fS)" })}`, t0, t1);
  draw($$(g, ".hd, .bd"), A("muita gente"), 0.45, 0.08);
  K.sfx("swoosh", A("muita gente"), 0.35);
  draw($$(g, ".bb"), A("pensa"), 0.55);
  pop($$(g, ".tc"), A("pensa") + 0.3, 0.1);
  rise($$(g, ".bt"), A("exigência recente"));
  K.sfx("pop", A("exigência recente"), 0.35);
  draw($$(g, ".x"), A("não é verdade"), 0.22, 0.14, "power3.out");
  K.sfx("stamp", A("não é verdade") + 0.05, 0.55);
  tl.to(g, { x: 10, duration: 0.05, yoyo: true, repeat: 5 }, A("não é verdade") + 0.3);
}

// ============ 4) "Desde 1958… legislação… deixava o país em caráter definitivo. E ao longo dos anos… atualizados."
{
  const t0 = A("desde") - 0.05, tA = A("ao longo dos anos"), t1 = A("e hoje") - 0.1;
  const yr = scene(`${LABEL("DESDE", 540, 300, { center: true, font: "500 24px/1 var(--fM)", color: GOLDL, ls: ".4em" })}
    <div style="position:absolute;left:0;width:1080px;top:335px;text-align:center"><span class="disp glow yr" style="font-size:180px">1958</span></div>`, t0, t1);
  K.fromTo(yr.querySelector(".yr"), { scale: 1.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "power3.out" }, A("1958"));
  K.sfx("boom", A("1958"), 0.35);
  // edifício da lei se desenha + avião decola dele
  const b = scene(`<svg style="${FULL};${GLOW}">
      <path class="bl" d="M300 700 L480 600 L660 700 Z" ${ST(GOLD, 7)}/>
      <path class="bl" d="M300 722 H660" ${ST(GOLD, 7)}/>
      ${[350, 430, 530, 610].map((x) => `<path class="cl" d="M${x} 745 V900" ${ST(GOLD, 9)}/>`).join("")}
      <path class="bl" d="M290 922 H670 M270 952 H690" ${ST(GOLD, 7)}/>
      <path class="tr" d="M660 680 Q820 470 940 560" ${ST(GOLDL, 4)} stroke-dasharray="2 14"/>
    </svg>${PLANE(64)}
    ${TAG("Legislação brasileira", 480, 990, "c1")}${TAG("Caráter definitivo", 820, 610, "c2", GOLDL)}`, A("legislação brasileira") - 0.1, tA - 0.1);
  draw($$(b, ".bl"), A("legislação brasileira"), 0.5, 0.12);
  draw($$(b, ".cl"), A("legislação brasileira") + 0.3, 0.3, 0.08);
  K.sfx("swoosh", A("legislação brasileira"), 0.4);
  pop($$(b, ".c1"), A("previa"));
  K.sfx("pop", A("previa"), 0.3);
  fly(b.querySelector(".pl"), [660, 680], [820, 470], [940, 560], A("deixava o país"), 0.9, { w: 64 });
  K.sfx("whoosh", A("deixava o país"), 0.35);
  pop($$(b, ".c2"), A("caráter definitivo"));
  // linha do tempo: o ano corre de 1958 até hoje enquanto o marcador anda
  const tl2 = scene(`<svg style="${FULL}">
      <path class="ln" d="M140 720 H940" ${ST(GOLD, 6)}/>
      ${[0, 1, 2, 3, 4, 5].map((k) => `<path class="tk" d="M${140 + k * 160} 700 V740" ${ST(GOLDL, 5)}/>`).join("")}
      <circle class="mk" cx="140" cy="720" r="20" style="fill:${WHITE};filter:drop-shadow(0 0 14px rgba(var(--accRGB),.9))"/>
      <g class="rf" ${ST(GOLD, 9)}><path d="M610 850 A70 70 0 1 1 590 800"/><path d="M590 770 V805 H625"/></g>
      <path class="ck" d="M510 880 L535 905 L575 860" ${ST(GOLDL, 9)}/>
    </svg>
    ${LABEL("1958", 140, 770, { center: true, font: "800 30px/1 var(--fS)", color: SILVER })}
    ${LABEL("HOJE", 940, 770, { cls: "hj", center: true, font: "800 30px/1 var(--fS)", color: GOLDL })}
    ${TAG("Regras atualizadas", 540, 1000, "c3")}`, tA - 0.05, t1);
  draw($$(tl2, ".ln"), tA, 2.9, 0, "none");
  tl.fromTo(tl2.querySelector(".mk"), { attr: { cx: 140 } }, { attr: { cx: 940 }, duration: 2.9, ease: "none", immediateRender: false }, tA);
  pop($$(tl2, ".tk"), tA, 2.9 / 5);
  count(yr.querySelector(".yr"), 1958, 2026, tA, 2.9);
  for (let k = 1; k <= 4; k++) K.sfx("tick", tA + k * 0.58, 0.3);
  pop($$(tl2, ".hj"), tA + 2.8);
  draw($$(tl2, ".rf path"), A("atualizados") - 0.2, 0.45);
  const rf = tl2.querySelector(".rf"); gsap.set(rf, { transformOrigin: "50% 50%" });
  tl.fromTo(rf, { rotation: 0 }, { rotation: 360, duration: 0.8, ease: "power2.inOut", immediateRender: false }, A("atualizados") - 0.2);
  draw($$(tl2, ".ck"), A("atualizados") + 0.4, 0.3);
  pop($$(tl2, ".c3"), A("atualizados") + 0.2);
  K.sfx("ding", A("atualizados") + 0.4, 0.35);
}

// ============ 5) "E hoje, se você sai do Brasil em caráter permanente ou… não residente após uma saída temporária, precisa cumprir…"
{
  const t0 = A("e hoje"), t1 = A("então") - 0.1;
  K.sfx("whoosh", t0, 0.3);
  const g = scene(`<svg style="${FULL};${GLOW}">
      <path class="pin" d="M240 590 C240 590 180 520 180 480 A60 60 0 1 1 300 480 C300 520 240 590 240 590 Z" ${ST(GOLD, 7, "rgba(var(--accRGB),.15)")}/>
      <circle class="pin" cx="240" cy="478" r="18" ${ST(GOLDL, 6)}/>
      <circle class="gl" cx="840" cy="490" r="80" ${ST(SILVER, 6)}/>
      <ellipse class="gl" cx="840" cy="490" rx="34" ry="80" ${ST(SILVER, 5)}/>
      <path class="gl" d="M760 490 H920" ${ST(SILVER, 5)}/>
      <path class="p1" d="M300 450 Q540 280 760 440" ${ST(GOLDL, 5)}/>
      <path class="p2" d="M300 540 Q540 720 760 560" ${ST(GOLD, 5)} stroke-dasharray="3 14"/>
    </svg>${PLANE(58)}<div class="pl2" style="position:absolute;left:0;top:0;opacity:0">${PLANE(58, SILVER).replace('class="pl"', 'class="plb"').replace("opacity:0;", "")}</div>
    ${LABEL("BRASIL", 240, 610, { cls: "lbB", center: true, font: "800 26px/1 var(--fS)", ls: ".14em" })}
    ${LABEL("EXTERIOR", 840, 590, { cls: "lbE", center: true, font: "800 26px/1 var(--fS)", ls: ".14em" })}
    ${TAG("Permanente", 540, 300, "tp")}${TAG("Temporária → não residente", 540, 650, "tt", SILVER)}`, A("sai do brasil") - 0.1, t1);
  draw($$(g, ".pin"), A("sai do brasil"), 0.5, 0.1);
  pop($$(g, ".lbB"), A("brasil"));
  draw($$(g, ".gl"), A("sai do brasil") + 0.3, 0.5, 0.1);
  pop($$(g, ".lbE"), A("sai do brasil") + 0.6);
  K.sfx("swoosh", A("sai do brasil"), 0.35);
  draw($$(g, ".p1"), A("caráter permanente"), 0.9);
  fly(g.querySelector(".pl"), [300, 450], [540, 280], [760, 440], A("caráter permanente"), 0.9, { w: 58 });
  K.sfx("whoosh", A("caráter permanente"), 0.3);
  pop($$(g, ".tp"), A("caráter permanente") + 0.4);
  // saída temporária: vai pela curva de baixo e volta
  const pb = g.querySelector(".pl2");
  draw($$(g, ".p2"), A("ou passa"), 0.8);
  fly(pb, [300, 540], [540, 720], [760, 560], A("ou passa"), 0.8, { w: 58 });
  fly(pb, [760, 560], [540, 720], [300, 540], A("temporária") - 0.4, 0.8, { w: 58 });
  pop($$(g, ".tt"), A("residente"));
  K.out(pb, A("temporária") + 0.4, 0.2);
  K.sfx("pop", A("residente"), 0.35);
  // lista que se marca sozinha
  const rows = [["Comunicar a saída", "obrigações"], ["Declarar a saída", "fiscais"], ["Regularizar o que se aplica", "aplicáveis"]];
  const c = scene(rows.map(([txt], i) => `<div class="rw" style="position:absolute;left:200px;top:${790 + i * 100}px;display:flex;align-items:center;gap:26px">
      <svg width="64" height="64" viewBox="0 0 64 64"><rect x="4" y="4" width="56" height="56" rx="14" ${ST(GOLD, 5, "rgba(var(--accRGB),.12)")}/><path class="ck" d="M17 33 L28 44 L48 21" ${ST(GOLDL, 7)}/></svg>
      <span style="font:800 40px/1 var(--fS)">${txt}</span></div>`).join(""), A("precisa cumprir") - 0.05, t1);
  rise($$(c, ".rw"), A("precisa cumprir"), 0.12);
  K.sfx("swoosh", A("precisa cumprir"), 0.3);
  const cks = $$(c, ".ck");
  rows.forEach(([, w], i) => { draw([cks[i]], A(w) + 0.05, 0.25, 0, "power3.out"); K.sfx(i === 2 ? "ding" : "click", A(w) + 0.1, i === 2 ? 0.35 : 0.45); });
}

// ============ 6) "Então, o que mudou nos últimos anos para gerar um aumento de 80% nas declarações de saída?"
{
  const t0 = A("então") - 0.05, tB = A("aumento") - 0.15, t1 = A("hoje existem") - 0.1;
  K.sfx("riser", t0 - 0.2, 0.3);
  const q = scene(`<svg style="${FULL};filter:drop-shadow(0 0 22px rgba(var(--accRGB),.8))">
      <path class="q" d="M440 450 C440 330 640 320 640 440 C640 520 540 530 540 610" ${ST(GOLD, 38)}/>
      <circle class="qd" cx="540" cy="690" r="24" style="fill:${GOLD}"/></svg>`, t0, tB);
  draw($$(q, ".q"), t0, 0.7);
  pop($$(q, ".qd"), t0 + 0.6);
  pulse(q.querySelector("svg"), t0 + 0.9, tB, 1.05, 0.8);
  K.stack([{ text: "O que mudou?", t: A("o que mudou"), style: "glow" }], { top: 790, size: 100, until: tB });
  K.hideMouth(t0, tB + 0.3);
  // gráfico que sobe + contador
  const pts = [[230, 900], [350, 880], [470, 850], [590, 790], [710, 690], [860, 560]];
  const d = "M" + pts.map((p) => p.join(" ")).join(" L");
  const c = scene(`<svg style="${FULL}">
      <path class="ax" d="M200 1010 V520 M200 1010 H920" ${ST(SILVER, 4)} opacity=".6"/>
      ${[640, 760, 880].map((y) => `<path class="gr" d="M200 ${y} H920" ${ST(SILVER, 2)} opacity=".18"/>`).join("")}
      <path class="ar" d="${d} L860 1010 L230 1010 Z" style="fill:rgba(var(--accRGB),.22);stroke:none"/>
      <path class="ln" d="${d}" ${ST(GOLDL, 9)} style2=""/>
      <circle class="dt" cx="860" cy="560" r="18" style="fill:${WHITE};filter:drop-shadow(0 0 14px rgba(var(--accRGB),.95))"/>
    </svg>
    <div style="position:absolute;left:0;width:1080px;top:280px;text-align:center"><span class="disp glow" style="font-size:140px">+<span class="n">0</span>%</span></div>
    ${LABEL("nas declarações de saída", 540, 445, { cls: "dl", center: true, font: "700 34px/1 var(--fS)", color: GOLDL })}`, tB, t1);
  draw($$(c, ".ax"), tB + 0.05, 0.4);
  draw($$(c, ".ln"), A("aumento"), 1.0, 0, "power2.out");
  K.fromTo(c.querySelector(".ar"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, A("aumento") + 0.5);
  pop($$(c, ".dt"), A("aumento") + 0.95);
  pulse(c.querySelector(".dt"), A("80%") + 0.4, t1, 1.35, 0.7);
  count(c.querySelector(".n"), 0, 80, A("80%"), 0.8);
  K.sfx("swoosh", A("aumento"), 0.35); K.sfx("ding", A("80%") + 0.7, 0.4);
  rise($$(c, ".dl"), A("declarações"));
}

// ============ 7) "Hoje existem acordos internacionais de troca automática… CRS e FATCA… cruzamentos… inteligência artificial."
{
  const t0 = A("hoje existem") - 0.05, t1 = A("ignorar") - 0.1;
  K.kickerTop("Troca automática de informações", t0, { y: 280, size: 24, until: t1 });
  K.sfx("whoosh", t0, 0.3);
  const C = [540, 650], R = 210;
  const N = [0, 60, 120, 180, 240, 300].map((a) => [C[0] + 300 * Math.cos((a - 90) * Math.PI / 180), C[1] + 270 * Math.sin((a - 90) * Math.PI / 180)].map((v) => +v.toFixed(1)));
  const pairs = [[0, 3], [1, 4], [2, 5], [0, 2], [3, 5], [1, 5]];
  const arc = ([a, b]) => { const [x1, y1] = N[a], [x2, y2] = N[b]; return `M${x1} ${y1} Q${C[0] + (x1 + x2 - 2 * C[0]) * -0.15} ${C[1] + (y1 + y2 - 2 * C[1]) * -0.15} ${x2} ${y2}`; };
  const g = scene(`<svg style="${FULL}">
      <circle class="g" cx="${C[0]}" cy="${C[1]}" r="${R}" ${ST(GOLD, 6, "rgba(var(--accRGB),.08)")}/>
      <ellipse class="g m1" cx="${C[0]}" cy="${C[1]}" rx="140" ry="${R}" ${ST(GOLD, 4)} opacity=".8"/>
      <ellipse class="g m2" cx="${C[0]}" cy="${C[1]}" rx="60" ry="${R}" ${ST(GOLD, 4)} opacity=".8"/>
      <path class="g" d="M${C[0] - R} ${C[1]} H${C[0] + R} M${C[0] - 182} ${C[1] - 105} H${C[0] + 182} M${C[0] - 182} ${C[1] + 105} H${C[0] + 182}" ${ST(GOLD, 4)} opacity=".7"/>
      ${pairs.map((p) => `<path class="lk" d="${arc(p)}" ${ST(GOLDL, 3)} opacity=".7"/>`).join("")}
      <g class="rad"><path d="M${C[0]} ${C[1]} L${C[0]} ${C[1] - R}" ${ST(WHITE, 4)}/><path d="M${C[0]} ${C[1]} L${C[0]} ${C[1] - R} A${R} ${R} 0 0 0 ${(C[0] - R * Math.sin(Math.PI / 5)).toFixed(1)} ${(C[1] - R * Math.cos(Math.PI / 5)).toFixed(1)} Z" style="fill:rgba(var(--hiRGB),.25);stroke:none"/></g>
      ${N.map(([x, y]) => `<circle class="nd" cx="${x}" cy="${y}" r="17" style="fill:${GOLD};stroke:${WHITE};stroke-width:4;filter:drop-shadow(0 0 12px rgba(var(--accRGB),.9))"/>`).join("")}
      ${[0, 1, 2, 3, 4, 5].map(() => `<circle class="pk" cx="0" cy="0" r="9" style="fill:${WHITE};filter:drop-shadow(0 0 10px #fff);opacity:0"/>`).join("")}
    </svg>
    ${TAG("CRS · padrão da OCDE", 330, 975, "crs")}${TAG("FATCA · lei dos EUA", 760, 975, "fat")}
    ${TAG("✦ Inteligência artificial", 540, 1055, "ia", GOLDL)}`, A("acordos") - 0.05, t1);
  draw($$(g, ".g"), A("acordos"), 0.7, 0.1);
  K.sfx("swoosh", A("acordos"), 0.4);
  pop($$(g, ".nd"), A("internacionais"), 0.07);
  K.sfx("pop", A("internacionais"), 0.3);
  draw($$(g, ".lk"), A("troca automática"), 0.5, 0.08);
  // globo "girando": meridianos abrem e fecham
  const m1 = g.querySelector(".m1"), m2 = g.querySelector(".m2");
  for (let s = A("acordos") + 0.8; s < t1 - 1.2; s += 2.4) {
    tl.fromTo(m1, { attr: { rx: 140 } }, { attr: { rx: 20 }, duration: 1.2, yoyo: true, repeat: 1, ease: "sine.inOut", immediateRender: false }, s);
    tl.fromTo(m2, { attr: { rx: 60 } }, { attr: { rx: 180 }, duration: 1.2, yoyo: true, repeat: 1, ease: "sine.inOut", immediateRender: false }, s);
  }
  // pacotes de dados correndo pelas ligações (troca automática)
  const pk = $$(g, ".pk");
  pairs.forEach((p, i) => {
    const [x1, y1] = N[p[0]], [x2, y2] = N[p[1]], cx = C[0] + (x1 + x2 - 2 * C[0]) * -0.15, cy = C[1] + (y1 + y2 - 2 * C[1]) * -0.15;
    for (let s = A("troca automática") + 0.5 + i * 0.3; s < t1 - 1; s += 1.8) {
      const P = { u: 0 }, e = pk[i];
      tl.fromTo(P, { u: 0 }, { u: 1, duration: 1.1, ease: "power1.inOut", immediateRender: false,
        onUpdate() { const u = P.u, x = (1 - u) ** 2 * x1 + 2 * (1 - u) * u * cx + u * u * x2, y = (1 - u) ** 2 * y1 + 2 * (1 - u) * u * cy + u * u * y2; e.setAttribute("cx", x.toFixed(1)); e.setAttribute("cy", y.toFixed(1)); e.style.opacity = u < 0.05 || u > 0.95 ? "0" : "1"; } }, s);
    }
  });
  pop($$(g, ".crs"), A("crs"));
  pop($$(g, ".fat"), A("fatca"));
  K.sfx("pop", A("crs"), 0.35);
  // cruzamentos: radar varrendo + nós piscando
  const rad = g.querySelector(".rad");
  rad.style.opacity = "0";
  K.fromTo(rad, { opacity: 0 }, { opacity: 1, duration: 0.3 }, A("cruzamentos"));
  tl.fromTo(rad, { rotation: 0 }, { rotation: 900, svgOrigin: `${C[0]} ${C[1]}`, duration: t1 - A("cruzamentos"), ease: "none", immediateRender: false }, A("cruzamentos"));
  K.sfx("riser", A("cruzamentos") - 0.1, 0.25);
  $$(g, ".nd").forEach((n, i) => gsap.set(n, { transformOrigin: "50% 50%" }) || tl.fromTo(n, { scale: 1 }, { scale: 1.6, duration: 0.2, yoyo: true, repeat: 1, immediateRender: false }, A("precisos") + i * 0.12));
  K.sfx("shimmer", A("precisos"), 0.3);
  pop($$(g, ".ia"), A("inteligência artificial"));
  K.sfx("ding", A("inteligência artificial") + 0.1, 0.35);
}

// ============ 8) "Ignorar essas obrigações pode gerar pendências com a Receita Federal, cobranças de impostos retroativos e multas."
{
  const t0 = A("ignorar") - 0.05, t1 = A("por isso") - 0.1;
  const w = scene(`<svg style="${FULL};filter:drop-shadow(0 0 16px rgba(255,90,58,.7))">
      <path class="tri" d="M540 290 L670 510 L410 510 Z" ${ST(RED, 12)}/>
      <path class="ex" d="M540 360 V440" ${ST(RED, 14)}/><circle class="exd" cx="540" cy="475" r="9" style="fill:${RED}"/></svg>`, t0, t1);
  draw($$(w, ".tri"), A("ignorar"), 0.5);
  draw($$(w, ".ex"), A("ignorar") + 0.4, 0.2);
  pop($$(w, ".exd"), A("ignorar") + 0.55);
  pulse(w.querySelector("svg"), A("ignorar") + 0.8, t1, 1.06, 0.8);
  K.sfx("boom", A("ignorar"), 0.3);
  const ROW = (cls, y, icon, a, b) => `<div class="${cls}" style="position:absolute;left:150px;top:${y}px;width:780px;height:130px;display:flex;align-items:center;gap:34px;border-bottom:2px solid rgba(255,90,58,.25)">
      <svg width="110" height="110" viewBox="0 0 110 110" style="flex:none;overflow:visible;filter:drop-shadow(0 0 10px rgba(255,90,58,.6))">${icon}</svg>
      <div><div style="font:800 46px/1.05 var(--fS)">${a}</div><div style="font:600 26px/1.3 var(--fS);color:${SILVER};margin-top:6px">${b}</div></div></div>`;
  const g = scene(
    ROW("r1", 570, `<path d="M25 10 H70 L88 28 V100 H25 Z M70 10 V28 H88 M38 50 H75 M38 66 H75 M38 82 H62" ${ST(WHITE, 5)}/><circle cx="88" cy="92" r="16" style="fill:${RED}"/><path d="M88 84 V94 M88 99 V100" ${ST(WHITE, 4)}/>`, "Pendências", "com a Receita Federal") +
    ROW("r2", 730, `<circle cx="55" cy="55" r="44" ${ST(WHITE, 5)}/><path class="hm" d="M55 55 V25" ${ST(RED, 6)}/><path class="hh" d="M55 55 H78" ${ST(WHITE, 6)}/><path d="M18 30 L10 18 M18 30 L30 24" ${ST(RED, 5)}/>`, "Impostos retroativos", "cobrança do que ficou para trás") +
    ROW("r3", 890, `<circle cx="55" cy="55" r="44" ${ST(RED, 6, "rgba(255,90,58,.15)")}/><text x="55" y="72" text-anchor="middle" style="font:900 52px var(--fS);fill:${WHITE}">$</text>`, "Multas", "sobre o que não foi declarado"),
    A("essas obrigações"), t1);
  K.fromTo(w, { y: 0 }, { y: -20, duration: 0.4 }, A("pendências"));
  rise($$(g, ".r1"), A("pendências")); K.sfx("pop", A("pendências"), 0.35);
  rise($$(g, ".r2"), A("impostos retroativos")); K.sfx("swoosh", A("impostos retroativos"), 0.3);
  const hm = g.querySelector(".hm"), hh = g.querySelector(".hh");
  tl.fromTo(hm, { rotation: 0 }, { rotation: -1080, svgOrigin: "55 55", duration: 1.5, ease: "power2.inOut", immediateRender: false }, A("impostos retroativos") + 0.1);
  tl.fromTo(hh, { rotation: 0 }, { rotation: -180, svgOrigin: "55 55", duration: 1.5, ease: "power2.inOut", immediateRender: false }, A("impostos retroativos") + 0.1);
  rise($$(g, ".r3"), A("multas"));
  K.stamp("MULTA!", A("multas") + 0.15, { x: 690, y: 890, rot: -12, until: t1 });
}

// ============ 9) "Por isso, se você mora no exterior e ainda não regularizou sua situação fiscal, não deixe para depois!"
{
  const t0 = A("mora no exterior"), tS = A("não deixe") - 0.1, t1 = A("clique") - 0.06;
  K.pill("Mora no exterior?", t0, { y: 300, icon: "user", up: true, until: tS });
  const g = scene(`<svg style="${FULL};${GLOW};transform:translateY(-50px)">
      <path class="hg" d="M430 440 H650 M430 900 H650" ${ST(GOLD, 9)}/>
      <path class="hg" d="M450 440 C450 590 520 620 540 670 C560 620 630 590 630 440 M450 900 C450 750 520 720 540 670 C560 720 630 750 630 900" ${ST(GOLD, 7)}/>
      <path class="sT" d="M470 470 H610 C605 570 560 600 540 640 C520 600 475 570 470 470 Z" style="fill:${GOLDL};opacity:.9"/>
      <path class="sB" d="M462 885 C480 800 520 790 540 760 C560 790 600 800 618 885 Z" style="fill:${GOLDL};opacity:.9"/>
      <path class="sS" d="M540 670 V880" ${ST(GOLDL, 4)}/></svg>`, A("ainda não") - 0.1, tS);
  draw($$(g, ".hg"), A("ainda não"), 0.5, 0.15);
  K.sfx("swoosh", A("ainda não"), 0.3);
  const sT = g.querySelector(".sT"), sB = g.querySelector(".sB"), sS = g.querySelector(".sS");
  [sT, sB].forEach((e) => gsap.set(e, { transformOrigin: "50% 100%" }));
  const a = A("regularizou"), d = tS - a;
  tl.fromTo(sT, { scaleY: 1, opacity: 0.9 }, { scaleY: 0.08, opacity: 0.9, duration: d, ease: "none", immediateRender: false }, a);
  tl.fromTo(sB, { scaleY: 0.05, opacity: 0.9 }, { scaleY: 1, opacity: 0.9, duration: d, ease: "none", immediateRender: false }, a);
  sS.style.opacity = "0"; K.fromTo(sS, { opacity: 0 }, { opacity: 1, duration: 0.15 }, a);
  for (let k = 0; k < 3; k++) K.sfx("tick", a + 0.2 + k * 0.5, 0.3);
  K.pill("Situação fiscal pendente", A("situação fiscal", 1, A("regularizou")), { y: 885, kind: "dark", icon: "clock", up: true, until: tS });
  K.flash(tS, { peak: 0.4 });
  K.stack([
    { text: "Não deixe", t: A("não deixe"), style: "blur" },
    { text: "para depois!", t: A("para depois"), style: "letters" },
  ], { top: 600, size: 116, gap: 136, until: t1 });
  K.hideMouth(tS, A("clique"));
}

// ============ 10) CTA "Clique no link da bio e fale com a equipe da Resultax Internacional…" — logo do cliente
K.cta("Link na bio", A("clique"), { y: 860, w: 760, clickAt: A("link da bio") - A("clique") + 0.1 });
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
        keyframes: undefined, onUpdate() { const k = this.progress(); p.style.opacity = (Math.sin(k * Math.PI) * 0.9).toFixed(2); } }, s);
  });
}
K.pill("Regularize sua situação", A("como regularizar"), { y: 1040, icon: "check", up: true });
K.pill("Proteja seu patrimônio", A("proteger"), { y: 1130, icon: "check", up: true });
K.hideMouth(A("como regularizar"), CFG.dur + 1);

// legenda fixa logo abaixo do conteúdo — SEMPRE por último
K.mouthCaps({ accent: ["Saída", "Fiscal", "novidade", "verdade", "1958", "legislação", "definitivo", "atualizados", "permanente", "residente", "temporária", "obrigações",
  "mudou", "80%", "CRS", "FATCA", "cruzamentos", "inteligência", "artificial", "pendências", "Receita", "Federal", "retroativos", "multas", "exterior", "depois", "link", "bio", "Resultax", "Internacional", "patrimônio"] });
