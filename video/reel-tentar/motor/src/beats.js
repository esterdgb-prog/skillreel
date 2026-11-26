// "O tentar não existe" — diálogo treinador × aluna na academia (54,1 s) · mapa em assets/map.md
// Plano aberto com duas pessoas: o "punch" do kit vira REENQUADRAMENTO (zoom no treinador, na aluna, plano de dois,
// aberto), sempre em corte seco entre frases. Letreiros de destaque na fonte display (Anybody 900, --fD);
// legenda em Poppins (--fS, pele do projeto), fixa no chão. Conteúdo 100 % do que é falado (sem fatos externos, R3).
const A = (p, n = 1, after = 0) => K.at(p, n, after);
const E = (p, n = 1, after = 0) => K.end(p, n, after);
const SPLIT_TOP = 240;
const W = 1080, H = 1920, F = { x: 540, y: 0.32 * 1920 }; // origem do zoom da .lens (C.focus "50% 32%")
const RED = "#ff2d2d", ORANGE = "var(--acc)";  // pedido: tudo o que era laranja agora é vermelho (pele: destaque vermelho)

// ---------- câmera: janela (x0, y0) do quadro-fonte com escala s → tela cheia, sem borda preta ----------
const SHOT = {
  aberto:  { s: 1.0,  x0: 0,   y0: 0 },
  dois:    { s: 1.2,  x0: 90,  y0: 150 },
  medio:   { s: 1.7,  x0: 3,   y0: 191 },  // treinador (rosto-fonte ≈ x144–247 · y456–600): na tela ≈ x 240–415 · y 450–695
  close:   { s: 2.3,  x0: 14,  y0: 330 },  // treinador: rosto na tela ≈ x 300–535 · y 290–620
  aluna:   { s: 1.6,  x0: 405, y0: 405 },  // aluna: rosto ≈ x 632–840 · y 504–696
  final:   { s: 1.15, x0: 70,  y0: 120 },
};
const lensXY = ({ s, x0, y0 }) => {
  x0 = Math.max(0, Math.min(W - W / s, x0)); y0 = Math.max(0, Math.min(H - H / s, y0));
  return { scale: s, x: -F.x - (x0 - F.x) * s, y: -F.y - (y0 - F.y) * s };
};
/** corte seco (d=0) ou movimento (d>0) para um enquadramento */
const cam = (t, shot, d = 0, ease = "power2.inOut") => {
  const v = lensXY(typeof shot === "string" ? SHOT[shot] : shot);
  if (d) K.tl.to(".lens", Object.assign({ duration: d, ease }, v), t); else K.set(".lens", v, t);
};
/** zoom lento contínuo a partir de um enquadramento (respiração da câmera) */
const drift = (t, shot, d, ds = 0.06) => { const b = SHOT[shot]; cam(t, shot); cam(t + 0.01, { s: b.s + ds, x0: b.x0 + 20, y0: b.y0 + 20 }, d - 0.02, "none"); };
const toSplit = (t) => { K.layout("split", t); K.tl.to(".lens", { x: 0, y: 0, scale: 1, duration: 0.45, ease: "power3.inOut" }, t); K.hideMouth(t - 0.05, t + 0.5); };
const toFull = (t, shot) => { K.layout("full", t); const v = lensXY(SHOT[shot]); K.tl.to(".lens", Object.assign({ duration: 0.45, ease: "power3.inOut" }, v), t); K.hideMouth(t - 0.05, t + 0.5); };

// ---------- letreiro display (Anybody 900): cada linha entra na sua palavra ----------
// lines: [{text, t, style:'pop'|'letters'|'glow', color, size, strike}] · opt {top, gap, until, hide}
const fit = (txt, max = 150) => Math.min(max, Math.floor(790 / (txt.length * 1.08)));  // Anybody 900 a 150 %: ~1,05 em por letra
function big(lines, opt = {}) {
  const top = opt.top ?? 240;
  const g = K.mk("#ui", "k center-x", "", { top: top + "px" });
  K.set(g, { opacity: 1 }, lines[0].t);
  let y = 0;
  lines.forEach((L, i) => {
    const size = fit(L.text, L.size || opt.max || 150);
    const d = K.mk(g, "disp" + (L.style === "glow" ? " glow" : ""), "", {
      position: "absolute", left: "0", width: W + "px", top: y + "px", fontSize: size + "px", textAlign: "center", whiteSpace: "nowrap",
      color: L.color || "#fff", textShadow: L.style === "glow" ? undefined : "0 5px 0 rgba(0,0,0,.35),0 0 34px rgba(0,0,0,.55)" });
    y += size * 0.98 + (opt.gap ?? 10);
    if (L.style === "letters") {
      d.innerHTML = [...L.text].map((c) => `<span style="display:inline-block">${c === " " ? "&nbsp;" : c}</span>`).join("");
      K.fromTo(d.querySelectorAll("span"), { opacity: 0, y: 46, scale: 0.4 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(2.4)", stagger: 0.035 }, L.t);
    } else {
      d.textContent = L.text;
      K.fromTo(d, { opacity: 0, scale: Math.min(1.25, 840 / (L.text.length * 1.05 * size)), filter: "blur(14px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.3, ease: "back.out(2)" }, L.t);
    }
    if (L.strike != null) {
      const bar = K.mk(d, "", "", { position: "absolute", left: "50%", top: "46%", height: Math.max(8, size * 0.09) + "px", width: Math.min(940, L.text.length * size * 1.05) + "px",
        marginLeft: -Math.min(940, L.text.length * size * 1.05) / 2 + "px", background: RED, borderRadius: "6px", boxShadow: `0 0 18px ${RED}`, transformOrigin: "0% 50%", transform: "scaleX(0)" });
      K.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: "power3.out" }, L.strike);
      K.sfx("stamp", L.strike, 0.3);
    }
    if (i === 0) K.sfx("pop", L.t, 0.28);
  });
  if (opt.until) K.out(g, opt.until);
  if (opt.hide !== false) K.hideMouth(lines[0].t - 0.02, opt.until || lines[lines.length - 1].t + 1);
  return g;
}

// ================= 0) ABERTURA — a aluna executando a série (sem corte, pedido) + gancho com a frase-tese
const tG = 1.0;   // gancho visual: não há fala antes de "Boa!" (6,6 s), então o glitch tem tempo fixo
K.camcorder(0, tG, { label: "TREINO · AO VIVO" });
K.glitch(tG);
drift(tG + 0.05, "aluna", 2.5, 0.1);
big([{ text: "O TENTAR", t: tG + 0.3, style: "letters", color: RED },
     { text: "NÃO EXISTE", t: tG + 1.1, style: "glow" }], { top: 240, until: tG + 2.5 });
drift(tG + 2.55, "aberto", A("boa") - tG - 2.6 - 1.4, 0.08);
drift(A("boa") - 1.45, "dois", 1.4, 0.05);

// 1) "Boa! Agora eu quero que você tenta fazer mais uma repetição"
cam(A("boa") - 0.04, "medio");
cam(A("mais uma") - 0.05, "aberto");
cam(A("mais uma"), { s: 1.08, x0: 40, y0: 60 }, A("repetição") + 0.5 - A("mais uma"), "none");
big([{ text: "MAIS UMA", t: A("mais uma"), style: "pop" }, { text: "REPETIÇÃO", t: A("repetição"), style: "glow", color: ORANGE }], { top: 236, max: 110, until: A("repetição") + 0.62 });

// 2) 1ª tentativa dela (sem fala, inteira) — zoom na aluna + HUD no rosto
const tTry = E("repetição") + 0.12;
cam(tTry, "aluna");
cam(tTry + 0.01, { s: 1.75, x0: 445, y0: 435 }, A("não não foi") - tTry - 0.15, "none");
K.faceHud(tTry + 0.05, { box: { x: 590, y: 450, w: 300, h: 290 }, label: "TENTANDO…", scan: false, until: A("não não foi") - 0.15 });

// 3) "Não, não foi isso que eu pedi. Eu pedi pra você tentar fazer mais uma repetição"
cam(A("não não foi") - 0.1, "medio");
drift(A("eu pedi pra"), "medio", A("tentar") - A("eu pedi pra") - 0.05, 0.05);
cam(A("tentar") - 0.04, "close");
big([{ text: "TENTAR", t: A("tentar"), style: "letters", color: RED, size: 150 }], { top: 1000, until: E("repetição", 2) + 0.1 });

// 3b) 2ª tentativa dela (sem fala, inteira) — aluna
const tTry2 = E("repetição", 2) + 0.12;
cam(tTry2, "aluna");
cam(tTry2 + 0.01, { s: 1.75, x0: 445, y0: 435 }, A("não presta") - tTry2 - 0.12, "none");

// 4) "Não, presta atenção no que eu tô falando" — close
cam(A("não presta") - 0.08, "close");
big([{ text: "PRESTA", t: A("presta"), style: "pop" }, { text: "ATENÇÃO", t: A("atenção"), style: "glow", color: ORANGE }], { top: 1060, max: 96, until: A("tenta fazer", 2) - 0.08 });

// 5) "Tenta fazer mais uma repetição" — aberto com push-in lento
drift(A("tenta fazer", 2) - 0.02, "aberto", A("eu já fiz") - A("tenta fazer", 2) - 0.1, 0.14);

// 6) "Eu já fiz" — aluna
cam(A("eu já fiz") - 0.08, "aluna");
big([{ text: "EU JÁ FIZ", t: A("eu já fiz") + 0.05, style: "pop", size: 112 }], { top: 270, until: A("exatamente") - 0.08 });

// 7) "Exatamente!" — flash + treinador
K.flash(A("exatamente") - 0.1, { peak: 0.55 });
cam(A("exatamente") - 0.04, "medio");
big([{ text: "EXATAMENTE!", t: A("exatamente"), style: "glow", color: ORANGE, size: 96 }], { top: 270, until: A("você conseguiu") + 0.3 });

// 8) "Você conseguiu perceber o que aconteceu aqui agora?" — plano de dois
drift(A("você conseguiu") + 0.25, "dois", A("não o que") - A("você conseguiu") - 0.3, 0.06);

// 9) "Não" — aluna · "O que acontece?" — treinador
cam(A("não o que") - 0.05, "aluna");
cam(A("o que acontece"), "medio");

// 10) "O tentar, ele não existe" — flash + close + letreiro no peito, TENTAR riscado em "não existe"
K.flash(A("o tentar ele") - 0.1, { peak: 0.6 });
cam(A("o tentar ele") - 0.04, "close");
const tNE = A("não existe");
big([{ text: "O TENTAR", t: A("o tentar ele") + 0.05, style: "letters", color: RED, size: 120, strike: tNE },
     { text: "NÃO EXISTE", t: tNE, style: "glow", size: 104 }], { top: 1040, until: A("ou a gente faz") - 0.1 });

// 11) "Ou a gente faz uma coisa, ou a gente não faz" — SPLIT: dois cards
const t11 = A("ou a gente faz") - 0.1;
toSplit(t11);
K.section({ kicker: "O tentar não existe", title: "Ou faz, ou não faz", acc: [1, 4] }, t11 + 0.1, { y: SPLIT_TOP, until: A("o tentar a gente") - 0.15 });
const CARD = (cls, txt, ic, good) => `<div class="${cls}" style="position:absolute;top:30px;${good ? "left:30px" : "right:30px"};width:400px;height:430px;border-radius:24px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;
  background:${good ? "linear-gradient(160deg,rgba(var(--accRGB),.35),rgba(var(--accRGB),.08))" : "rgba(255,255,255,.05)"};
  border:${good ? "3px solid rgba(var(--accRGB),.95);box-shadow:0 0 40px rgba(var(--accRGB),.5)" : "2px solid rgba(255,255,255,.2)"}">
  <svg viewBox="0 0 24 24" style="width:120px;height:120px;fill:none;stroke:${good ? "var(--lavT)" : RED};stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round">${ic}</svg>
  <div style="font:900 ${good ? 92 : 64}px/1 var(--fD);font-stretch:${good ? 150 : 110}%;white-space:nowrap;text-transform:uppercase;color:#fff">${txt}</div></div>`;
K.panel(CARD("faz", "Faz", '<path d="M5 12.5l4.5 4.5L19 7.5"/>', true) + CARD("nfaz", "Não faz", '<path d="M6 6l12 12M18 6L6 18"/>', false),
  A("faz uma coisa") - 0.15, {
    box: { x: 90, y: 400, w: 900, h: 490 },
    steps: [{ sel: ".faz", t: A("faz uma coisa") }, { sel: ".nfaz", t: A("não faz"), sfx: "stamp" }],
    until: A("o tentar a gente") - 0.15,
  });

// 12) "O tentar, a gente acaba usando isso pra sabotar a nossa mente" — volta com light leak
K.leak(A("o tentar a gente") - 0.15, 0.55);
toFull(A("o tentar a gente") - 0.1, "medio");
drift(A("o tentar a gente") + 0.4, "medio", A("sabotar") - A("o tentar a gente") - 0.45, 0.05);
cam(A("sabotar") - 0.02, "close");
big([{ text: "SABOTAR", t: A("sabotar"), style: "letters", color: RED, size: 140 },
     { text: "A NOSSA MENTE", t: A("nossa mente"), style: "pop", size: 84 }], { top: 1020, until: A("quando a gente fala") - 0.06 });

// 13) "Quando a gente fala que a gente vai tentar fazer alguma coisa" — aberto + pílula riscada no alto
drift(A("quando a gente fala") - 0.02, "aberto", A("a gente tem muito") - A("quando a gente fala") - 0.1, 0.1);
K.pill("“Eu vou tentar…”", A("vai tentar"), { y: 270, kind: "strike", up: true, until: A("a gente tem muito") - 0.08 });

// 14) "a gente tem muito mais chance de falhar nisso" — close + letreiro no peito
cam(A("a gente tem muito") - 0.05, "close");
big([{ text: "MUITO MAIS CHANCE", t: A("muito mais chance"), style: "pop", size: 70 },
     { text: "DE FALHAR", t: A("de falhar"), style: "letters", color: RED, size: 130 }], { top: 1060, until: A("por quê") - 0.06 });

// 15) "Por quê?" — médio
cam(A("por quê") - 0.04, "medio");
big([{ text: "POR QUÊ?", t: A("por quê"), style: "pop", size: 120 }], { top: 262, until: A("porque a gente fala") - 0.04 });

// 16) "Porque a gente fala, a gente fala, ah, eu tentei" — plano de dois + pílula no alto
drift(A("porque a gente fala") - 0.02, "dois", A("por exemplo") - A("porque a gente fala") - 0.15, 0.06);
K.pill("“Ah, eu tentei”", A("ah eu tentei"), { y: 240, kind: "strike", up: true, until: A("por exemplo") - 0.15 });

// 17) exemplos "eu vou tentar…" + "é muito mais fácil da gente falhar" — SPLIT com a lista, tudo riscado em "falhar"
const t17 = A("por exemplo") - 0.08;
toSplit(t17);
K.section({ kicker: "Por exemplo", title: "Eu vou tentar…", acc: [2] }, t17 + 0.1, { y: SPLIT_TOP, until: A("então a gente tem") - 0.12 });
const ROW = (cls, txt) => `<div class="${cls}" style="position:relative;display:flex;align-items:center;gap:22px;padding:21px 0;border-bottom:1px solid rgba(255,255,255,.12)">
  <span style="flex:none;font:800 21px/1 var(--fS);letter-spacing:.06em;text-transform:uppercase;color:#fff;background:${RED};padding:10px 14px;border-radius:10px">vou tentar</span>
  <span style="font:700 42px/1 var(--fS);color:#fff">${txt}</span>
  <i class="x" style="position:absolute;left:-8px;right:-8px;top:47%;height:6px;border-radius:3px;background:${RED};box-shadow:0 0 14px ${RED}"></i></div>`;
K.panel(`<div style="position:absolute;left:40px;right:40px;top:26px">
    ${ROW("r1", "Fazer uma dieta")}${ROW("r2", "Cardio todo dia")}${ROW("r3", "Me alimentar bem")}${ROW("r4", "Treinar todo dia")}
    <div class="res" style="margin-top:26px;text-align:center;font:900 46px/1 var(--fD);font-stretch:125%;text-transform:uppercase;color:${RED};text-shadow:0 0 20px rgba(255,61,61,.6)">Mais fácil de falhar</div></div>`,
  A("uma dieta") - 0.4, {
    box: { x: 90, y: 400, w: 900, h: 540 },
    steps: [
      { sel: ".r1", t: A("uma dieta"), anim: "slide" },
      { sel: ".r2", t: A("cardio"), anim: "slide", sfx: false },
      { sel: ".r3", t: A("me alimentar bem"), anim: "slide", sfx: false },
      { sel: ".r4", t: A("treinar todo dia"), anim: "slide", sfx: false },
      { sel: ".x", t: A("muito mais fácil"), anim: "strike" },
      { sel: ".res", t: A("gente falhar"), anim: "pop", sfx: false },
    ],
    until: A("então a gente tem") - 0.12,
  });

// 18) "Então a gente tem que pensar o quê? Eu vou fazer dieta essa semana, eu vou treinar bem, eu vou me alimentar"
const t18 = A("então a gente tem");
K.section({ kicker: "Então pensa assim", title: "Eu vou fazer", acc: [2] }, t18, { y: SPLIT_TOP, until: A("porque dessa forma") - 0.15 });
const OK = (cls, txt) => `<div class="${cls}" style="display:flex;align-items:center;gap:24px;padding:24px 0;border-bottom:1px solid rgba(255,255,255,.12)">
  <span style="flex:none;width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--btnA),var(--btnB));box-shadow:var(--glow);display:flex;align-items:center;justify-content:center">
  <svg viewBox="0 0 24 24" style="width:38px;height:38px;fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
  <span style="font:700 46px/1 var(--fS);color:#fff">${txt}</span></div>`;
K.panel(`<div style="position:absolute;left:40px;right:40px;top:30px">${OK("o1", "Dieta essa semana")}${OK("o2", "Treinar bem")}${OK("o3", "Me alimentar")}</div>`,
  A("eu vou fazer dieta") - 0.1, {
    box: { x: 90, y: 400, w: 900, h: 440 },
    steps: [
      { sel: ".o1", t: A("dieta essa semana"), sfx: "ding" },
      { sel: ".o2", t: A("treinar bem"), sfx: false },
      { sel: ".o3", t: A("eu vou me alimentar") + 0.25, sfx: false },
    ],
    until: A("porque dessa forma") - 0.15,
  });

// 19) "Porque dessa forma, a gente tem muito menos chance de falhar" — volta + close
K.leak(A("porque dessa forma") - 0.15, 0.55);
toFull(A("porque dessa forma") - 0.1, "medio");
cam(A("muito menos") - 0.06, "close");
big([{ text: "MUITO MENOS", t: A("muito menos"), style: "glow", color: ORANGE, size: 106 },
     { text: "CHANCE DE FALHAR", t: A("chance de falhar", 2), style: "pop", size: 72 }], { top: 1060, until: A("porque a gente não") - 0.06 });

// 20) "Porque a gente não vai estar tentando" — médio, TENTANDO riscado
cam(A("porque a gente não") - 0.05, "medio");
big([{ text: "NÃO VAI ESTAR", t: A("não vai estar"), style: "pop", size: 82 },
     { text: "TENTANDO", t: A("tentando"), style: "letters", color: RED, size: 112, strike: A("tentando") + 0.45 }], { top: 228, gap: 4, until: A("entendeu") - 0.04 });

// 21) "Entendeu?" — dois · "Verdade" — aluna
cam(A("entendeu") - 0.04, "dois");
cam(A("verdade") - 0.06, "aluna");
big([{ text: "VERDADE", t: A("verdade") + 0.04, style: "pop", size: 110 }], { top: 280, until: A("então bora") - 0.04 });

// 22) "Então bora, já deu um minuto" — aberto + carimbo · "faz mais uma" — flash + push-in
drift(A("então bora") - 0.04, "aberto", A("faz mais uma") - A("então bora") - 0.1, 0.08);
K.stamp("BORA!", A("bora") + 0.05, { x: 600, y: 270, rot: -7, until: A("faz mais uma") - 0.1 });
K.flash(A("faz mais uma") - 0.1, { peak: 0.45, sfx: false });
cam(A("faz mais uma") - 0.04, "final");
cam(A("faz mais uma"), { s: 1.3, x0: 150, y0: 260 }, 1.9, "power1.out");
big([{ text: "FAZ", t: A("faz mais uma"), style: "pop", size: 150 },
     { text: "MAIS UMA!", t: A("mais uma", 4), style: "glow", color: ORANGE, size: 120 }], { top: 1020, gap: 6 });

// legenda (Poppins, fixa no chão) — SEMPRE por último
K.mouthCaps({ accent: ["tentar", "tenta", "tentei", "tentando", "faz", "fazer", "falhar"], autoAccent: false });
