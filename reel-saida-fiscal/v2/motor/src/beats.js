// VSL preto/dourado · "Saída Fiscal: agora é lei?" v2 (61,0 s, voz do cliente cortada) · mapa completo em assets/map.md
// Vídeo SEM apresentador: a voz é o áudio enviado pelo cliente (respirações cortadas, 1,08×) e a "câmera" é um fundo animado (assets/clean.mp4).
// Por isso tudo é tela de interface (takeover permanente): o conteúdo ocupa o miolo (y 260–1250) e a legenda
// fica fixa em ~y 1400 (rastreio sintético em assets/face-track.json). Nenhuma imagem de terceiro: só HTML/SVG próprio.
const A = (p, n = 1, after = 0) => K.at(p, n, after);
const E = (p, n = 1, after = 0) => K.end(p, n, after);
const TOP = 280;          // topo do conteúdo
const RED = "#ff6a4a";    // alerta (mesmo vermelho do risco da referência)
const SVG = (d, s = 44, extra = "") => `<svg viewBox="0 0 24 24" style="width:${s}px;height:${s}px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;${extra}">${d}</svg>`;
const IC = {
  plane: '<path d="M10.5 13.5L3 11l1.5-1.5 8 .5 4-4c1-1 2.5-1.5 3.5-.5s.5 2.5-.5 3.5l-4 4 .5 8L14.5 22l-2.5-7.5"/><path d="M6 17l-2 1 1-2"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
  alert: '<path d="M12 3.5l9.5 17h-19z"/><path d="M12 10v4.5M12 17.5v.2"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  money: '<circle cx="12" cy="12" r="9"/><path d="M15 9c-.6-1-1.7-1.5-3-1.5-1.7 0-3 .9-3 2.2 0 3 6 1.6 6 4.6 0 1.3-1.3 2.2-3 2.2-1.4 0-2.6-.6-3.2-1.6M12 6v12"/>',
};
const BADGE = (ic, bg = "linear-gradient(135deg,var(--btnA),var(--btnB))", s = 76) =>
  `<span style="flex:none;width:${s}px;height:${s}px;border-radius:${s * 0.26}px;background:${bg};display:inline-flex;align-items:center;justify-content:center;color:#fff;box-shadow:var(--glow)">${SVG(IC[ic], s * 0.55)}</span>`;
const CHIP = "display:inline-flex;align-items:center;gap:14px;padding:14px 24px 14px 14px;border-radius:999px;background:rgba(var(--panel2RGB),.9);border:1.5px solid rgba(var(--hiRGB),.45);font:700 30px/1 var(--fS);white-space:nowrap";

K.drift(0, CFG.dur, 0.06); // respiração lenta do fundo

// 1) GANCHO "Saída Fiscal: agora é lei?" — HUD de filmadora → glitch → título empilhado
const tG = A("agora é lei") - 0.05;
K.camcorder(0, tG, { label: "SAÍDA FISCAL · BRASIL" });
K.glitch(tG);
K.stack([
  { text: "Saída Fiscal:", t: A("saída fiscal") + 0.02, style: "blur" },
  { text: "agora é lei?", t: A("agora é lei"), style: "glow" },
], { top: 800, size: 104, gap: 128, until: A("você sabia") - 0.06 });
K.hideMouth(0, A("você sabia"));

// 2) "Você sabia que a obrigação relacionada à Saída Fiscal não é uma novidade?" — documento + carimbo
K.section({ kicker: "Você sabia?", title: "A obrigação da Saída Fiscal", acc: [3, 4] }, A("você sabia"), { y: TOP, until: A("muita gente") - 0.12 });
K.panel(`
  <div style="position:absolute;left:44px;top:44px;display:flex;align-items:center;gap:22px">${BADGE("doc")}
    <div><div style="font:500 20px/1 var(--fM);letter-spacing:.16em;color:var(--lavT)">OBRIGAÇÃO FISCAL</div>
    <div style="font:800 40px/1.15 var(--fS);margin-top:10px">Declaração de Saída Definitiva</div></div></div>
  ${[0, 1, 2, 3].map((i) => `<div class="ln" style="position:absolute;left:44px;top:${190 + i * 58}px;height:22px;width:${[640, 520, 700, 420][i]}px;border-radius:11px;background:rgba(255,255,255,.12)"></div>`).join("")}
  <div class="tag" style="position:absolute;left:44px;bottom:40px;${CHIP};font-size:26px">${BADGE("plane", undefined, 46)}Quem deixa o Brasil</div>`,
  A("obrigação") - 0.05, {
  box: { x: 90, y: 470, w: 900, h: 500 },
  steps: [
    { sel: ".ln", t: A("relacionada"), anim: "slide", sfx: false },
    { sel: ".tag", t: A("saída fiscal", 2) },
  ],
  until: A("muita gente") - 0.12,
});
K.stamp("NÃO É NOVIDADE", A("não é uma novidade"), { x: 470, y: 850, rot: -7, until: A("muita gente") - 0.12 });

// 3) "Muita gente pensa que essa é uma exigência recente, mas isso não é verdade!" — mito riscado
K.kickerTop("Muita gente pensa que…", A("muita gente"), { y: 520, size: 26, until: A("desde") - 0.1 });
const mito = K.panel(`
  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:800 54px/1 var(--fS);gap:18px">
    <span style="color:var(--lavT)">“</span>É uma exigência recente<span style="color:var(--lavT)">”</span></div>
  <i class="x" style="position:absolute;left:40px;right:40px;top:50%;height:8px;margin-top:-4px;border-radius:4px;background:${RED};box-shadow:0 0 16px ${RED}"></i>`,
  A("exigência recente") - 0.1, {
  box: { x: 90, y: 600, w: 900, h: 170 },
  steps: [{ sel: ".x", t: A("não é verdade"), anim: "strike" }],
  until: A("desde") - 0.1,
});
K.flash(A("não é verdade") - 0.1, { peak: 0.35, sfx: false });
K.stamp("MITO ✗", A("verdade"), { x: 380, y: 860, rot: -8, until: A("desde") - 0.1 });

// 4) "Desde 1958, a legislação brasileira já previa…" + "ao longo dos anos… atualizados" — linha do tempo
const tL = A("desde") - 0.05;
K.panel(`
  <div style="position:absolute;left:0;right:0;top:40px;text-align:center;font:500 22px/1 var(--fM);letter-spacing:.3em;color:var(--lavT)">DESDE</div>
  <div class="yr" style="position:absolute;left:0;right:0;top:78px;text-align:center"><span class="disp glow" style="font-size:190px">1958</span></div>
  <svg style="position:absolute;left:60px;top:330px;width:780px;height:60px;overflow:visible" viewBox="0 0 780 60">
    <path class="trk" d="M10 30H770" stroke="rgba(var(--hiRGB),.9)" stroke-width="6" stroke-linecap="round" fill="none"/>
  </svg>
  <div class="d0" style="position:absolute;left:52px;top:342px;width:36px;height:36px;border-radius:50%;background:var(--lav);box-shadow:var(--glowT)"></div>
  ${[1, 2, 3, 4].map((i) => `<div class="dm" style="position:absolute;left:${62 + i * 150}px;top:350px;width:20px;height:20px;border-radius:50%;background:var(--lavT);box-shadow:0 0 14px rgba(var(--accRGB),.8)"></div>`).join("")}
  <div class="d1" style="position:absolute;left:812px;top:342px;width:36px;height:36px;border-radius:50%;background:#fff;box-shadow:var(--glowT)"></div>
  <div class="l0" style="position:absolute;left:44px;top:400px;font:800 30px/1 var(--fS)">1958</div>
  <div class="l1" style="position:absolute;right:44px;top:400px;font:800 30px/1 var(--fS);color:var(--lavT)">HOJE</div>
  <div class="c1" style="position:absolute;left:44px;top:480px;${CHIP}">${BADGE("doc", undefined, 50)}Legislação brasileira</div>
  <div class="c2" style="position:absolute;left:44px;top:572px;${CHIP}">${BADGE("plane", undefined, 50)}Saída em caráter definitivo</div>
  <div class="c3" style="position:absolute;left:44px;top:664px;${CHIP};border-color:rgba(var(--hiRGB),.9);box-shadow:var(--glow)">${BADGE("check", undefined, 50)}Regras e procedimentos atualizados</div>`,
  tL, {
  box: { x: 90, y: TOP, w: 900, h: 780 },
  steps: [
    { sel: ".yr", t: A("1958"), sfx: "ding" },
    { sel: ".d0, .l0", t: A("legislação brasileira"), sfx: false },
    { sel: ".c1", t: A("legislação brasileira") + 0.1 },
    { sel: ".c2", t: A("deixava o país") },
    { sel: ".trk", t: A("ao longo dos anos"), anim: "draw", d: 2.6 },
    { sel: ".dm", t: A("ao longo dos anos") + 0.3, anim: "pop", sfx: false },
    { sel: ".d1, .l1", t: A("atualizados") - 0.2, sfx: false },
    { sel: ".c3", t: A("atualizados") },
  ],
  until: A("e hoje") - 0.1,
});

// 5) "E hoje, se você sai do Brasil em caráter permanente ou… não residente após uma saída temporária, precisa cumprir…"
K.section({ kicker: "E hoje?", title: "Quem precisa cumprir", acc: [2] }, A("e hoje"), { y: TOP, until: A("então") - 0.1 });
K.panel(`
  <div class="p1" style="position:absolute;left:34px;top:34px;width:390px;height:300px;border-radius:22px;background:rgba(var(--panel2RGB),.85);border:1.5px solid rgba(var(--hiRGB),.4);padding:30px;box-sizing:border-box">
    ${BADGE("plane")}<div style="font:800 36px/1.15 var(--fS);margin-top:24px">Saída<br>permanente</div>
    <div style="font:600 22px/1.3 var(--fS);color:var(--muted);margin-top:10px">sai do Brasil em definitivo</div></div>
  <div class="ou" style="position:absolute;left:426px;top:160px;width:48px;text-align:center;font:800 28px/1 var(--fS);color:var(--lavT)">OU</div>
  <div class="p2" style="position:absolute;right:34px;top:34px;width:390px;height:300px;border-radius:22px;background:rgba(var(--panel2RGB),.85);border:1.5px solid rgba(var(--hiRGB),.4);padding:30px;box-sizing:border-box">
    ${BADGE("clock")}<div style="font:800 36px/1.15 var(--fS);margin-top:24px">Saída<br>temporária</div>
    <div style="font:600 22px/1.3 var(--fS);color:var(--muted);margin-top:10px">vira <b style="color:var(--lavT)">não residente</b></div></div>
  <svg style="position:absolute;left:0;top:334px;width:900px;height:120px" viewBox="0 0 900 120">
    <path class="ar" d="M229 6 C229 70 450 50 450 110M671 6 C671 70 450 50 450 110" stroke="var(--lav)" stroke-width="5" fill="none" stroke-linecap="round"/></svg>
  <div class="ob" style="position:absolute;left:34px;right:34px;top:460px;height:150px;border-radius:22px;background:linear-gradient(90deg,var(--btnA),var(--btnB));box-shadow:var(--glow);display:flex;align-items:center;gap:24px;padding:0 34px">
    ${BADGE("check", "rgba(255,255,255,.18)", 84)}<div><div style="font:800 40px/1.1 var(--fS)">Cumprir as obrigações fiscais</div>
    <div style="font:600 24px/1.3 var(--fS);color:rgba(255,255,255,.85);margin-top:6px">aplicáveis à sua situação</div></div></div>`,
  A("se você sai") - 0.05, {
  box: { x: 90, y: 420, w: 900, h: 650 },
  steps: [
    { sel: ".p1", t: A("caráter permanente") },
    { sel: ".ou", t: A("ou passa"), anim: "fade", sfx: false },
    { sel: ".p2", t: A("condição") },
    { sel: ".ar", t: A("precisa cumprir") - 0.15, anim: "draw", d: 0.45 },
    { sel: ".ob", t: A("obrigações fiscais"), sfx: "ding" },
  ],
  until: A("então") - 0.1,
});

// 6) "Então, o que mudou?"
K.stack([
  { text: "o que", t: A("o que mudou"), style: "blur" },
  { text: "mudou?", t: A("mudou"), style: "glow" },
], { top: 760, size: 120, gap: 140, until: A("hoje existem") - 0.1 });
K.hideMouth(A("o que mudou"), A("hoje existem"));
// 7) "Hoje existem acordos internacionais de troca automática de informações, como o CRS e o FATCA…"
K.section({ kicker: "Troca automática de informações", title: "Acordos internacionais", acc: [1] }, A("hoje existem"), { y: TOP, until: A("ignorar") - 0.1 });
const net = K.panel(`
  <div class="nb" style="position:absolute;left:44px;top:70px;width:230px;text-align:center">${BADGE("home", undefined, 110)}<div style="font:800 32px/1 var(--fS);margin-top:18px">Brasil</div></div>
  <div class="ne" style="position:absolute;right:44px;top:70px;width:230px;text-align:center">${BADGE("globe", undefined, 110)}<div style="font:800 32px/1 var(--fS);margin-top:18px">Exterior</div></div>
  <svg style="position:absolute;left:280px;top:90px;width:340px;height:90px" viewBox="0 0 340 90">
    <path class="lk" d="M10 28H330M330 62H10" stroke="var(--lav)" stroke-width="4" fill="none" stroke-dasharray="2 12" stroke-linecap="round"/></svg>
  <div class="pk1" style="position:absolute;left:290px;top:108px;width:18px;height:18px;border-radius:5px;background:#fff;box-shadow:var(--glowT)"></div>
  <div class="pk2" style="position:absolute;left:590px;top:142px;width:18px;height:18px;border-radius:5px;background:var(--lavT);box-shadow:var(--glowT)"></div>
  <div class="crs" style="position:absolute;left:44px;top:300px;${CHIP}"><b style="color:var(--lavT)">CRS</b>&nbsp;· padrão da OCDE</div>
  <div class="fat" style="position:absolute;left:44px;top:392px;${CHIP}"><b style="color:var(--lavT)">FATCA</b>&nbsp;· lei dos EUA</div>
  <div class="ia" style="position:absolute;left:44px;right:44px;top:500px;height:120px;border-radius:22px;background:linear-gradient(90deg,var(--btnA),var(--btnB));box-shadow:var(--glow);display:flex;align-items:center;gap:22px;padding:0 30px;overflow:hidden">
    ${BADGE("spark", "rgba(255,255,255,.18)", 72)}<div style="font:800 34px/1.15 var(--fS)">Cruzamentos cada vez mais precisos com IA</div>
    <i class="scan" style="position:absolute;top:0;bottom:0;left:-120px;width:90px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent)"></i></div>`,
  A("acordos internacionais") - 0.05, {
  box: { x: 90, y: 420, w: 900, h: 660 },
  steps: [
    { sel: ".nb", t: A("acordos internacionais"), sfx: false },
    { sel: ".ne", t: A("internacionais") },
    { sel: ".lk", t: A("troca automática"), anim: "fade", sfx: false },
    { sel: ".crs", t: A("crs") },
    { sel: ".fat", t: A("fatca") },
    { sel: ".ia", t: A("cruzamentos"), sfx: "ding" },
  ],
  until: A("ignorar") - 0.1,
});
{ // pacotes de dados indo e voltando entre Brasil e exterior (troca automática)
  const a = A("troca automática"), b = A("ignorar") - 0.1;
  const p1 = net.querySelector(".pk1"), p2 = net.querySelector(".pk2");
  for (let s = a; s < b - 0.9; s += 1.2) {
    tl.fromTo(p1, { x: 0, opacity: 1 }, { x: 300, opacity: 1, duration: 0.9, ease: "power1.inOut", immediateRender: false }, s);
    tl.fromTo(p2, { x: 0, opacity: 1 }, { x: -300, opacity: 1, duration: 0.9, ease: "power1.inOut", immediateRender: false }, s + 0.3);
  }
  K.set([p1, p2], { opacity: 0 }, 0);
  const sc = net.querySelector(".scan");
  for (let s = A("precisos") - 0.2; s < b - 0.8; s += 1.3) tl.fromTo(sc, { x: 0 }, { x: 1000, duration: 0.8, ease: "power2.inOut", immediateRender: false }, s);
}

// 8) "Ignorar essas obrigações pode gerar pendências com a Receita Federal, cobranças de impostos retroativos e multas."
K.section({ kicker: "Ignorar pode gerar", title: "Os riscos de não declarar", acc: [1] }, A("ignorar"), { y: TOP, until: A("por isso") - 0.1 });
const RISK = (cls, top, ic, a, b) => `<div class="${cls}" style="position:absolute;left:34px;right:34px;top:${top}px;height:150px;border-radius:22px;background:rgba(255,90,58,.10);border:1.5px solid rgba(255,106,74,.55);display:flex;align-items:center;gap:26px;padding:0 30px">
  ${BADGE(ic, `linear-gradient(135deg,#ff5a3a,#ff8a5a)`, 84)}<div><div style="font:800 40px/1.1 var(--fS)">${a}</div><div style="font:600 24px/1.3 var(--fS);color:var(--muted);margin-top:6px">${b}</div></div></div>`;
K.panel(
  RISK("r1", 34, "alert", "Pendências", "com a Receita Federal") +
  RISK("r2", 214, "money", "Impostos retroativos", "cobrança do que ficou para trás") +
  RISK("r3", 394, "alert", "Multas", "sobre o que não foi declarado"),
  A("essas obrigações") - 0.05, {
  box: { x: 90, y: 440, w: 900, h: 580 },
  steps: [
    { sel: ".r1", t: A("pendências") },
    { sel: ".r2", t: A("impostos retroativos") },
    { sel: ".r3", t: A("multas"), sfx: "stamp" },
  ],
  until: A("por isso") - 0.1,
});

// 9) "Por isso, se você mora no exterior e ainda não regularizou sua situação fiscal, não deixe para depois!"
K.pill("Mora no exterior?", A("mora no exterior"), { y: 560, icon: "user", up: true, until: A("não deixe") - 0.1 });
K.pill("Situação fiscal pendente", A("regularizou"), { y: 680, kind: "dark", icon: "clock", up: true, until: A("não deixe") - 0.1 });
K.flash(A("não deixe") - 0.1, { peak: 0.4 });
K.stack([
  { text: "Não deixe", t: A("não deixe"), style: "blur" },
  { text: "para depois!", t: A("para depois"), style: "letters" },
], { top: 620, size: 116, gap: 136, until: A("clique") - 0.06 });
K.hideMouth(A("não deixe"), A("clique"));

// 10) CTA "Clique no link da bio e fale com a equipe da Resultax Internacional…" — marca só em texto (sem logo)
K.cta("Link na bio", A("clique"), { y: 860, w: 760, clickAt: A("link da bio") - A("clique") + 0.1 });
K.logo({ img: "assets/img/logo-resultax.png" }, A("resultax"), CFG.dur - A("resultax") + 0.3, { y: 290, h: 380 });
K.pill("Regularize sua situação", A("como regularizar"), { y: 1080, icon: "check", up: true });
K.pill("Proteja seu patrimônio", A("proteger"), { y: 1180, icon: "check", up: true });
K.hideMouth(A("como regularizar"), CFG.dur + 1); // as pílulas carregam o fim da fala

// legenda (fixa sob o conteúdo) — SEMPRE por último
K.mouthCaps({ accent: ["Saída", "Fiscal", "novidade", "verdade", "1958", "legislação", "atualizados", "permanente", "residente", "temporária", "obrigações",
  "CRS", "FATCA", "inteligência", "artificial", "pendências", "Receita", "Federal", "retroativos", "multas", "exterior", "depois", "link", "bio", "Resultax", "Internacional", "patrimônio"] });
