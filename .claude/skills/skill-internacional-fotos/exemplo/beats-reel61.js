// Reel 61 · Resultax Internacional · pele preta e dourada da logo (../pele-resolvida.json) · "Legal lá fora não significa regular aqui" (58,3 s)
// Sem apresentador (skill-internacional-fotos): a câmera é a montagem de 13 cenas do Pixabay (../assets/montagem.json),
// cortada nas viradas de frase. Cada troca FULL ↔ SPLIT cai junto com um corte de cena. Régua: exemplo/beats-reel65.js.
const A = (p, n = 1, after = 0) => K.at(p, n, after);
const E = (p, n = 1, after = 0) => K.end(p, n, after);
const IMG = (f) => `assets/img/${f}`;
const SPLIT_TOP = 240;
const CHEST = 1250;
const toFull = (t) => { K.layout("full", t); K.hideMouth(t - 0.05, t + 0.5); };
const toSplit = (t) => { K.layout("split", t); K.hideMouth(t - 0.05, t + 0.5); };
const ROW = "display:flex;justify-content:space-between;align-items:center;padding:22px 0;border-bottom:1px solid rgba(255,255,255,.12);font:700 40px/1.1 var(--fS)";
const ICO = (n, c = "var(--lav)", w = 2.2) => K.icon(n).replace("<svg", `<svg style="width:46px;height:46px;stroke:${c};fill:none;stroke-width:${w};flex:none"`);
const OK = ICO("check", "var(--lav)", 2.6);
const NO = ICO("x", "#ff6a4a", 2.6);

// 1) GANCHO "Você conseguiu o visto" — painel de partidas do aeroporto, EM COR (sem filmadora/dessaturação), com o
//    título da cliente no alto; glitch forte (imagem + som) na 1ª transição
const tG = A("recebeu") - 0.04;
const tituloGancho = (linhas, t0, t1) => {
  const v = K.mk("#ui", "k", "", { left: "0", top: "0", width: "1080px", height: "1920px",
    background: "linear-gradient(180deg,rgba(6,5,3,.80) 0%,rgba(6,5,3,.55) 30%,rgba(6,5,3,0) 50%)" });
  v.setAttribute("data-safe", "ignore");
  K.tl.fromTo(v, { opacity: 0 }, { opacity: 1, duration: 0.25, immediateRender: false }, t0);
  K.out(v, t1);
  const g = K.mk("#ui", "k", linhas.map((l, i) => `<div class="tl${i}" style="opacity:0">${l}</div>`).join(""),
    { left: "90px", width: "900px", top: "290px", textAlign: "center",
      font: "900 55px/1.1 var(--fD)", fontStretch: "110%", letterSpacing: "-.005em", textTransform: "uppercase", color: "#f7f3ea",
      textShadow: "0 4px 26px rgba(0,0,0,.65)" });
  K.tl.set(g, { opacity: 1 }, t0);
  linhas.forEach((_, i) => K.tl.fromTo(g.querySelector(".tl" + i), { opacity: 0, y: 18, filter: "blur(10px)" },
    { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.35, ease: "power3.out", immediateRender: false }, t0 + 0.12 + i * 0.22));
  K.out(g, t1);
};
const OURO = (x) => `<span style="color:var(--lav);text-shadow:0 0 28px rgba(var(--accRGB),.55)">${x}</span>`;
tituloGancho(["Estar legal no exterior", "não resolve sua", `${OURO("saída fiscal")} no Brasil`], 0, A("mas isso") - 0.12);
K.glitch(tG);
K.punch(tG + 0.05, 1.1);

// 2) "recebeu o documento de residência e está totalmente legal no país onde mora" — pai com a filha, vida lá fora
K.chain([
  { text: "Visto", t: A("recebeu") + 0.1, icon: "check" },
  { text: "Documento de residência", t: A("documento"), icon: "check" },
  { text: "Legal no país onde mora", t: A("totalmente"), icon: "check" },
], { y: CHEST - 120, sep: "↓", up: true, until: A("mas isso") - 0.12 });
K.hideMouth(tG, A("mas isso"));

// 3) "Mas isso não significa que a sua situação fiscal no Brasil esteja resolvida" — SPLIT: lá fora ✓ × aqui ?
const t3 = A("mas isso") - 0.1;
toSplit(t3);
K.section({ kicker: "Mas isso não significa", title: "Situação fiscal resolvida", acc: [2] }, t3 + 0.1, { y: SPLIT_TOP, until: A("uma coisa") - 0.15 });
K.panel(`
  <div style="position:absolute;left:40px;right:40px;top:34px">
    <div class="r1" style="${ROW}"><span>Legal no país onde mora</span>${OK}</div>
    <div class="r2" style="${ROW};border:0"><span>Situação fiscal no Brasil</span><span style="color:#ff8a6a;font-size:34px;letter-spacing:.04em">RESOLVIDA?</span></div>
  </div>`, A("mas isso"), {
  box: { x: 90, y: 470, w: 900, h: 270 },
  steps: [
    { sel: ".r1", t: A("mas isso") + 0.15 },
    { sel: ".r2", t: A("situação fiscal") },
  ],
  until: A("uma coisa") - 0.15,
});

// 4) "Uma coisa é estar legalizado no exterior" — cidade europeia
const t4 = A("uma coisa") - 0.1;
toFull(t4);
K.punch(A("legalizado"), 1.12);
K.stack([
  { text: "legalizado", t: A("legalizado"), style: "blur" },
  { text: "no exterior", t: A("no exterior"), style: "glow" },
], { top: 1150, size: 76, gap: 96, until: A("outra") - 0.12 });
K.hideMouth(t4, A("outra"));

// 5) "Outra, completamente diferente, é estar regularizado perante a Receita Federal brasileira" — bandeira do Brasil
const t5 = A("outra") - 0.1;
toSplit(t5);
K.section({ kicker: "Completamente diferente", title: "Lá fora ≠ aqui", acc: [0, 3] }, t5 + 0.1, { y: SPLIT_TOP, until: A("o seu visto") - 0.15 });
const CARD = "position:absolute;top:30px;width:360px;height:330px;border-radius:24px;padding:30px 26px;box-sizing:border-box;background:rgba(255,255,255,.04);border:1px solid rgba(var(--accRGB),.35);text-align:center";
const CK = "font:600 22px/1 var(--fM);letter-spacing:.18em;color:var(--lavT);text-transform:uppercase;margin:18px 0 14px";
const CT = "font:800 40px/1.12 var(--fS)";
K.panel(`
  <div class="cA" style="${CARD};left:40px">${ICO("user")}<div style="${CK}">No exterior</div><div style="${CT}">Legalizado</div><div style="font:600 26px/1.3 var(--fS);color:var(--muted);margin-top:12px">visto e residência</div></div>
  <div class="neq" style="position:absolute;left:0;right:0;top:150px;text-align:center;font:900 76px/1 var(--fS);color:var(--lav);text-shadow:0 0 30px rgba(var(--accRGB),.8)">≠</div>
  <div class="cB" style="${CARD};right:40px">${ICO("folder")}<div style="${CK}">No Brasil</div><div style="${CT}">Regularizado</div><div style="font:600 26px/1.3 var(--fS);color:var(--muted);margin-top:12px">perante a Receita Federal</div></div>`, A("outra"), {
  box: { x: 90, y: 440, w: 900, h: 390 },
  steps: [
    { sel: ".cA", t: A("outra") + 0.1 },
    { sel: ".neq", t: A("completamente diferente"), anim: "fade" },
    { sel: ".cB", t: A("regularizado") },
  ],
  until: A("o seu visto") - 0.15,
});

// 6) "O seu visto ou documento de residência não comunica automaticamente ao Brasil que você deixou o país" — saindo pelo aeroporto
const t6 = A("o seu visto") - 0.1;
toFull(t6);
K.pill("Visto ou documento de residência", A("o seu visto") + 0.1, { y: CHEST + 40, icon: "folder", up: true, until: A("não comunica") - 0.05 });
K.punch(A("não comunica"), 1.12);
K.stack([
  { text: "não avisa", t: A("não comunica"), style: "blur" },
  { text: "o Brasil", t: A("ao brasil"), style: "glow" },
], { top: 1150, size: 80, gap: 100, until: A("para isso") - 0.12 });
K.hideMouth(A("não comunica") - 0.05, A("para isso"));

// 7) "Para isso, é necessário verificar quando você passou à condição de não residente e cumprir as obrigações…"
//    TELA CHEIA de motion graphics (sem cena embaixo): linha do tempo residente → não residente + checklist
const telaGrafica = (t0, t1) => {
  const bg = K.mk("#ui", "k", "", { left: "0", top: "0", width: "1080px", height: "1920px",
    background: "radial-gradient(120% 70% at 50% 30%,rgba(201,168,92,.20) 0%,rgba(11,10,8,0) 55%),linear-gradient(180deg,#14110b 0%,#0b0a08 60%,#070605 100%)" });
  bg.setAttribute("data-safe", "ignore");
  K.tl.fromTo(bg, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, t0);
  K.out(bg, t1);
  K.hideMouth(t0 - 0.05, t1);
};
const t7 = A("para isso") - 0.1;
toFull(t7);
telaGrafica(t7, A("se isso") - 0.12);
K.section({ kicker: "Para isso, é necessário", title: "Verificar e cumprir", acc: [0, 2] }, t7 + 0.15, { y: 430, size: 88, until: A("se isso") - 0.15 });
const LINHA = "position:absolute;left:110px;right:110px;top:150px;height:6px;border-radius:3px;background:linear-gradient(90deg,rgba(255,255,255,.25),rgba(var(--accRGB),.9))";
const NO_ = (x, lbl, sub) => `<div style="position:absolute;left:${x}px;top:120px;width:0">
  <div style="position:absolute;left:-30px;top:0;width:60px;height:60px;border-radius:50%;background:#0b0a08;border:4px solid rgba(var(--accRGB),.9);box-shadow:0 0 24px rgba(var(--accRGB),.5)"></div>
  <div style="position:absolute;left:-170px;width:340px;top:84px;text-align:center;font:800 38px/1.1 var(--fS)">${lbl}</div>
  <div style="position:absolute;left:-170px;width:340px;top:134px;text-align:center;font:600 22px/1.2 var(--fM);letter-spacing:.14em;color:var(--lavT);text-transform:uppercase">${sub}</div></div>`;
const tl7 = K.panel(`
  <div class="ln" style="${LINHA}"></div>
  <div class="n1">${NO_(140, "Residente", "no Brasil")}</div>
  <div class="n2">${NO_(760, "Não residente", "saída fiscal")}</div>
  <div class="mk" style="position:absolute;left:140px;top:30px;width:0"><div style="position:absolute;left:-95px;width:190px;top:0;display:flex;align-items:center;justify-content:center;gap:10px;padding:12px 0;border-radius:40px;background:linear-gradient(90deg,var(--btnA),var(--btnB));color:var(--onAcc,#fff);font:800 26px/1 var(--fS)">${ICO("clock", "var(--onAcc,#fff)", 2.4).replace("46px;height:46px", "30px;height:30px")}QUANDO?</div></div>`,
  A("verificar"), {
  box: { x: 90, y: 720, w: 900, h: 340 },
  steps: [
    { sel: ".ln", t: A("verificar") + 0.05, anim: "fade", sfx: false },
    { sel: ".n1", t: A("verificar") + 0.15, sfx: false },
    { sel: ".mk", t: A("quando você passou"), sfx: false },
    { sel: ".n2", t: A("não residente"), sfx: false },
  ],
  until: A("se isso") - 0.15,
});
K.tl.to(tl7.querySelector(".mk"), { left: 760, duration: 0.7, ease: "power2.inOut" }, A("não residente") - 0.35);
K.panel(`
  <div class="c2" style="position:absolute;left:40px;right:40px;top:34px;display:flex;align-items:center;gap:22px;font:800 44px/1.1 var(--fS)">${ICO("check", "var(--lav)", 2.8).replace("46px;height:46px", "60px;height:60px")}<span>Cumprir as obrigações<br><span style="color:var(--lav)">da saída fiscal</span></span></div>`,
  A("cumprir") - 0.15, {
  box: { x: 90, y: 1130, w: 900, h: 200 },
  steps: [{ sel: ".c2", t: A("cumprir"), sfx: false }],
  until: A("se isso") - 0.15,
});

// 8–9) "Se isso não foi feito corretamente, podem existir declarações pendentes, multas, impostos e até rendimentos no exterior
//       que deveriam ter sido informados" — SPLIT contínuo sobre duas cenas (pastas → moedas): 4 cards na palavra
const t8 = A("se isso") - 0.1;
toSplit(t8);
K.section({ kicker: "Se não foi feito corretamente", title: "Podem existir pendências", acc: [2] }, t8 + 0.1, { y: SPLIT_TOP, until: A("durante") - 0.15 });
K.grid([
  { img: IMG("px-2004856-declaracoes.jpg"), label: "Declarações pendentes", icon: "caption", t: A("declarações") },
  { img: IMG("px-1537123-multas.jpg"), label: "Multas", icon: "bolt", t: A("multas") },
  { img: IMG("px-385506-impostos.jpg"), label: "Impostos", icon: "money", t: A("impostos") },
  { img: IMG("px-69523-rendimentos.jpg"), label: "Rendimentos no exterior", icon: "layers", t: A("rendimentos") },
], { top: 410, cols: 2, w: 420, h: 262, gx: 30, gy: 22, until: A("durante") - 0.15 });

// 10) "durante o período em que você ainda era considerado residente fiscal no Brasil" — São Paulo
const t10 = A("durante") - 0.1;
toFull(t10);
K.pill("Deveriam ter sido informados", A("durante") + 0.05, { y: CHEST + 40, icon: "caption", up: true, until: A("ainda era") - 0.05 });
K.punch(A("residente fiscal"), 1.14);
K.stack([
  { text: "ainda era", t: A("ainda era"), style: "blur" },
  { text: "residente fiscal", t: A("residente fiscal"), style: "glow" },
], { top: 1150, size: 70, gap: 92, until: A("então") - 0.12 });
K.hideMouth(A("ainda era") - 0.05, A("então"));

// 11) "Então, atenção: tá legal lá fora não significa tá regular aqui" — SPLIT: ✓ × ✕ e carimbo
const t11 = A("então") - 0.1;
toSplit(t11);
K.flash(A("atenção") - 0.05, { peak: 0.4 });
K.section({ kicker: "Atenção", title: "Legal não é regular", acc: [0, 3] }, A("atenção"), { y: SPLIT_TOP, until: A("mora no exterior") - 0.15 });
K.panel(`
  <div style="position:absolute;left:40px;right:40px;top:34px">
    <div class="r1" style="${ROW}"><span>Legal lá fora</span>${OK}</div>
    <div class="r2" style="${ROW};border:0"><span>Regular aqui</span>${NO}</div>
  </div>`, A("tá legal") - 0.1, {
  box: { x: 90, y: 470, w: 900, h: 270 },
  steps: [
    { sel: ".r1", t: A("tá legal") + 0.1 },
    { sel: ".r2", t: A("regular aqui") },
  ],
  until: A("mora no exterior") - 0.15,
});
K.stamp("NÃO É A MESMA COISA", A("regular aqui") + 0.4, { x: 170, y: 790, rot: -6, until: A("mora no exterior") - 0.15 });

// 12) "Mora no exterior e ainda não regularizou sua saída fiscal?" — homem no home office
const t12 = A("mora no exterior") - 0.1;
toFull(t12);
K.pill("Mora no exterior?", A("mora no exterior") + 0.05, { y: CHEST + 40, icon: "user", up: true, until: A("ainda não") - 0.05 });
K.punch(A("saída fiscal", 2), 1.14);
K.stack([
  { text: "saída", t: A("saída fiscal", 2), style: "blur" },
  { text: "fiscal?", t: A("fiscal", 1, A("saída fiscal", 2) + 0.1), style: "glow" },
], { top: 1150, until: A("clique") - 0.12 });
K.hideMouth(A("saída fiscal", 2) - 0.05, A("clique"));

// 13) CTA "Clique no link da Bio e fale com a Resultax Internacional" — logo oficial + botão
const t13 = A("clique") - 0.1;
// logo solta, sem cartão (igual ao Reel 65): desfoque → nítido, sombra suave; degradê no topo para ler sobre a cena
const logo = (t, { y, h, until, escurecer }) => {
  if (escurecer) {
    const v = K.mk("#ui", "k", "", { left: "0", top: "0", width: "1080px", height: "1920px",
      background: "linear-gradient(180deg,rgba(6,5,3,.86) 0%,rgba(6,5,3,.62) 32%,rgba(6,5,3,0) 56%)" });
    v.setAttribute("data-safe", "ignore");
    K.tl.fromTo(v, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, t - 0.15);
    if (until) K.out(v, until);
  }
  const g = K.mk("#ui", "k", `<img src="${IMG("resultax-logo.png")}" style="height:${h}px;display:inline-block;filter:drop-shadow(0 6px 22px rgba(0,0,0,.7)) drop-shadow(0 0 22px rgba(201,168,92,.22))">`,
    { left: "0", width: "1080px", textAlign: "center", top: y + "px" });
  K.tl.fromTo(g, { opacity: 0, scale: 0.94, filter: "blur(12px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.55, ease: "power2.out", immediateRender: false }, t);
  if (until) K.out(g, until);
  return g;
};
logo(t13 + 0.15, { y: 330, h: 290, escurecer: true });
K.cta("Link na bio", A("clique"), { y: 1300, w: 760, clickAt: A("link") - A("clique") + 0.05 });

// legenda (rastreio fixo, centralizada; só em tela cheia)
K.mouthCaps({ accent: ["visto", "residência", "legal", "fiscal", "Brasil", "resolvida", "legalizado", "exterior", "regularizado", "Receita", "Federal",
  "comunica", "automaticamente", "residente", "obrigações", "declarações", "multas", "impostos", "rendimentos", "atenção", "regular", "Resultax", "Bio", "link"] });

// ===================== TRILHA DE EFEITOS — desenhada à mão (padrão skill-internacional-fotos) =====================
// Todos os sons automáticos do kit saem; entra uma trilha pensada momento a momento com a paleta sfx-projeto/ (≥ 400 Hz).
// Volumes calibrados em sfx-projeto/volumes.json (os mesmos do Reel 65 aprovado).
const V = {"glitch-forte": 0.135, "sopro-sobe": 0.156, "sopro-desce": 0.148, "sopro-curto": 0.12, "carimbo": 0.493, "impacto": 0.402, "pop1": 0.178, "pop2": 0.176, "pop3": 0.17, "tick": 0.257, "check": 0.131, "ding": 0.111, "moeda": 0.109, "brilho": 0.14, "erro": 0.052, "alerta": 0.05, "tictac": 0.33, "glitch": 0.098, "click": 0.313};
const S = (nome, t) => K.sfx(nome, t, V[nome]);
document.querySelectorAll('#vsl audio[src^="assets/sfx/"]').forEach((a) => a.remove());
// trocas de cena = sopros; o pico do sopro cai no corte (FULL→SPLIT sobe, SPLIT→FULL desce, corte simples curto)
const ANTES = { sobe: 0.26, desce: 0.15, curto: 0.12 };
[["glitch-forte", 1.61], ["sobe", 7.08], ["desce", 12.02], ["sobe", 14.58], ["desce", 20.8], ["sobe", 26.7], ["sobe", 34.28],
 ["curto", 39.32], ["desce", 42.99], ["sobe", 47.26], ["desce", 51.98], ["curto", 55.18]]
  .forEach(([k, t]) => (k.startsWith("glitch") ? S(k, t - 0.03) : S("sopro-" + k, t - ANTES[k])));
S("pop1", A("documento"));                     // corrente: documento de residência…
S("check", A("totalmente"));                   // …legal no país onde mora ✓
S("check", A("mas isso") + 0.15);              // legal lá fora ✓
S("erro", A("resolvida"));                     // situação fiscal resolvida?
S("pop1", A("outra") + 0.1);                   // card exterior
S("pop3", A("regularizado"));                  // card Brasil
S("alerta", A("não comunica"));                // não avisa o Brasil
S("tick", A("quando você passou"));                 // quando virou não residente
S("check", A("cumprir"));                      // obrigações ✓
S("pop1", A("declarações"));                   // cards em degrau
S("pop2", A("multas"));
S("pop3", A("impostos") - 0.1);
S("moeda", A("rendimentos"));                  // rendimentos no exterior
S("ding", A("residente fiscal"));              // ainda era residente fiscal
S("impacto", A("atenção") - 0.05);             // ATENÇÃO (flash)
S("check", A("tá legal") + 0.1);               // legal lá fora ✓
S("erro", A("regular aqui"));                  // regular aqui ✕
S("carimbo", A("regular aqui") + 0.5);                 // NÃO É A MESMA COISA
S("pop2", A("mora no exterior") + 0.3);       // mora no exterior?
S("brilho", t13 + 0.4);                        // logo
S("click", A("link") + 0.05);                  // clique no botão
