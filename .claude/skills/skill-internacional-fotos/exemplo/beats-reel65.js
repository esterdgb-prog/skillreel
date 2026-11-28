// Reel 65 · Resultax Internacional · pele preta e dourada da logo (../pele-resolvida.json) · "O maior erro de quem saiu do Brasil e deixou o imóvel alugado" (57,6 s)
// Sem apresentador: a câmera é a montagem de cenas do Pixabay (../assets/montagem.json), cortada nas viradas de frase.
// Cada troca FULL ↔ SPLIT cai junto com um corte de cena. Mapa em assets/map.md · fontes em ../assets/SOURCES.md.
const A = (p, n = 1, after = 0) => K.at(p, n, after);
const E = (p, n = 1, after = 0) => K.end(p, n, after);
const IMG = (f) => `assets/img/${f}`;
const SPLIT_TOP = 240;
const CHEST = 1250;
const toFull = (t) => { K.layout("full", t); K.hideMouth(t - 0.05, t + 0.5); };
const toSplit = (t) => { K.layout("split", t); K.hideMouth(t - 0.05, t + 0.5); };
const ROW = "display:flex;justify-content:space-between;align-items:center;padding:22px 0;border-bottom:1px solid rgba(255,255,255,.12);font:700 40px/1.1 var(--fS)";
const SRC = "font:500 17px/1.3 var(--fM);color:var(--muted);letter-spacing:.06em";

// 1) GANCHO "O maior erro de quem saiu do Brasil…" — avião com HUD de filmadora → glitch no corte para as chaves
const tG = A("deixou") - 0.02;
K.camcorder(0, tG, { label: "SAIU DO BRASIL?" });
K.glitch(tG);
K.punch(tG + 0.05, 1.12);
K.pill("Imóvel alugado no Brasil", A("alugado"), { y: CHEST + 40, icon: "folder", up: true, until: A("a pessoa") - 0.05 });

// 2) "A pessoa faz a saída fiscal, vai embora tranquila" — viajante no aeroporto
K.punch(A("a pessoa"), 1.06);
K.chain([
  { text: "Saída fiscal feita", t: A("saída fiscal"), icon: "check" },
  { text: "Vai embora tranquila", t: A("tranquila") - 0.1, icon: "send" },
], { y: CHEST - 10, sep: "↓", up: true, until: A("o aluguel continua") - 0.12 });

// 3) "o aluguel continua caindo na conta, ninguém tá recolhendo o imposto" — SPLIT: extrato × imposto não recolhido
const t3 = A("o aluguel continua") - 0.1;
toSplit(t3);
K.section({ kicker: "Todo mês", title: "O aluguel continua caindo", acc: [3] }, t3 + 0.1, { y: SPLIT_TOP, until: A("quem já fez") - 0.15 });
K.panel(`
  <div style="position:absolute;left:40px;right:40px;top:34px">
    <div class="r1" style="${ROW}"><span style="display:flex;align-items:center;gap:16px">${K.icon("money").replace("<svg", '<svg style="width:44px;height:44px;stroke:var(--lav);fill:none;stroke-width:2"')}Aluguel recebido</span><span style="color:var(--lav)">+ R$ •••</span></div>
    <div class="r2" style="${ROW};border:0"><span style="display:flex;align-items:center;gap:16px">${K.icon("x").replace("<svg", '<svg style="width:44px;height:44px;stroke:#ff6a4a;fill:none;stroke-width:2.4"')}Imposto</span><span style="color:#ff8a6a;font-size:34px;letter-spacing:.04em">NÃO RECOLHIDO</span></div>
  </div>`, A("caindo na conta") - 0.15, {
  box: { x: 90, y: 470, w: 900, h: 270 },
  steps: [
    { sel: ".r1", t: A("caindo na conta") },
    { sel: ".r2", t: A("ninguém") , sfx: "stamp" },
  ],
  until: A("quem já fez") - 0.15,
});

// 4) "Quem já fez a saída fiscal continua pagando o imposto sobre esse aluguel no Brasil" — São Paulo
const t4 = A("quem já fez") - 0.1;
toFull(t4);
K.pill("Já fez a saída fiscal", A("quem já fez") + 0.15, { y: CHEST + 40, icon: "check", up: true, until: A("continua pagando") - 0.05 });
K.punch(A("continua pagando"), 1.14);
K.stack([
  { text: "continua", t: A("continua pagando"), style: "blur" },
  { text: "no Brasil", t: A("no brasil"), style: "glow" },
], { top: 1150, size: 72, gap: 92, until: A("em regra") - 0.12 });
K.hideMouth(A("continua pagando") - 0.05, A("em regra"));

// 5) "em regra 15%, retido todo mês. E não basta pagar, isso também precisa ser informado à Receita Federal, todo mês"
const t5 = A("em regra") - 0.1;
toSplit(t5);
K.section({ kicker: "Já fez a saída fiscal", title: "Imposto sobre o aluguel", acc: [3] }, t5 + 0.1, { y: SPLIT_TOP, until: A("quem cuida") - 0.15 });
K.panel(`
  <div class="big" style="position:absolute;left:0;right:0;top:26px;text-align:center;font:900 210px/1 var(--fS);text-shadow:0 0 50px rgba(var(--accRGB),.85)">15<span style="font-size:120px">%</span></div>
  <div class="sub" style="position:absolute;left:0;right:0;top:250px;text-align:center;font:700 36px/1 var(--fS);color:var(--lavT);text-transform:uppercase;letter-spacing:.06em">retido todo mês</div>
  <div class="r2" style="position:absolute;left:40px;right:40px;top:322px;display:flex;align-items:center;gap:18px;padding:22px 26px;border-radius:20px;background:linear-gradient(90deg,var(--btnA),var(--btnB));box-shadow:var(--glow);font:800 34px/1.1 var(--fS);color:var(--onAcc,#fff)">
    ${K.icon("clock").replace("<svg", '<svg style="width:44px;height:44px;stroke:var(--onAcc,#fff);fill:none;stroke-width:2.2;flex:none"')}<span>Informar à Receita Federal</span><span class="tm" style="margin-left:auto;font-size:28px;opacity:.95">TODO MÊS</span></div>
  <div class="src" style="position:absolute;left:40px;right:40px;top:446px;${SRC}">EM REGRA · NÃO RESIDENTE · FONTE: RECEITA FEDERAL, PERGUNTAS E RESPOSTAS IRPF 2024 (3-13)</div>`, E("em regra"), {
  box: { x: 90, y: 400, w: 900, h: 510 },
  steps: [
    { sel: ".big", t: E("em regra") + 0.02, sfx: "ding" },
    { sel: ".sub", t: A("retido"), anim: "fade", sfx: false },
    { sel: ".src", t: A("retido") + 0.4, anim: "fade", sfx: false },
    { sel: ".r2", t: A("informado"), anim: "slide" },
  ],
  until: A("quem cuida") - 0.15,
});

// 6) "Quem cuida disso muda de caso pra caso" — dúvida
const t6 = A("quem cuida") - 0.1;
toFull(t6);
K.punch(A("quem cuida"), 1.12);
K.stack([
  { text: "Quem cuida", t: A("quem cuida") + 0.05, style: "blur" },
  { text: "disso?", t: A("disso"), style: "glow" },
], { top: 1290, until: A("depende") - 0.12 });
K.hideMouth(t6, A("depende"));

// 7) "Depende se o inquilino é empresa ou pessoa física, se tem imobiliária, se existe um procurador no Brasil"
const t7 = A("depende") - 0.1;
toSplit(t7);
K.section({ kicker: "Depende do caso", title: "Quem deve recolher?", acc: [2] }, t7 + 0.1, { y: SPLIT_TOP, until: A("muita gente") - 0.15 });
K.grid([
  { img: IMG("px-9682225-empresa.jpg"), label: "Inquilino empresa", icon: "grid", t: A("empresa") },
  { img: IMG("px-2155376-pessoa-fisica.jpg"), label: "Pessoa física", icon: "user", t: A("pessoa física") },
  { img: IMG("px-1163353-imobiliaria.jpg"), label: "Imobiliária", icon: "folder", t: A("imobiliária") },
  { img: IMG("px-3196481-procurador.jpg"), label: "Procurador", icon: "caption", t: A("procurador") },
], { top: 410, cols: 2, w: 420, h: 262, gx: 30, gy: 22, until: A("muita gente") - 0.15 });

// 8) "Muita gente acha que a imobiliária faz, a imobiliária acha que é o procurador, o procurador acha que é o inquilino,
//     no fim, ninguém faz" — um empurra para o outro → carimbo
K.section({ kicker: "Na prática", title: "Um empurra para o outro", acc: [1, 2, 3] }, A("muita gente"), { y: SPLIT_TOP, until: A("e a pendência") - 0.15 });
K.flow([
  { label: "Imobiliária", sub: "“é o procurador”", icon: "folder", t: A("a imobiliária faz") },
  { label: "Procurador", sub: "“é o inquilino”", icon: "caption", t: A("acha que é o procurador") },
  { label: "Inquilino", sub: "“é a imobiliária”", icon: "user", t: A("acha que é o inquilino") },
], { box: { x: 90, y: 430, w: 900, h: 300 }, until: A("e a pendência") - 0.15 });
K.stamp("NINGUÉM FAZ", A("ninguém faz"), { x: 300, y: 770, rot: -6, until: A("e a pendência") - 0.15 });

// 9) "E a pendência vai parar no CPF de quem mora fora" — preocupação
const t9 = A("e a pendência") - 0.1;
toFull(t9);
K.punch(A("cpf"), 1.14);
K.pill("Pendência no CPF de quem mora fora", A("cpf"), { y: CHEST + 40, icon: "bolt", up: true, until: A("pra quem ainda") - 0.05 });

// 10) "Pra quem ainda não fez a saída fiscal, a situação é ainda pior" — papelada
K.punch(A("pra quem ainda"), 1.06);
K.pill("Ainda não fez a saída fiscal", A("não fez"), { y: CHEST + 40, kind: "strike", up: true, until: A("a situação") - 0.05 });
K.flash(A("ainda pior") - 0.12, { peak: 0.45 });
K.stack([
  { text: "ainda", t: A("ainda pior"), style: "blur" },
  { text: "pior", t: A("pior"), style: "glow" },
], { top: 1150, until: A("o aluguel entra") - 0.12 });
K.hideMouth(A("ainda pior") - 0.05, A("o aluguel entra"));

// 11) "O aluguel entra na declaração como residente, junto com toda a renda obtida no exterior" — SPLIT: a soma
const t11 = A("o aluguel entra") - 0.1;
toSplit(t11);
K.section({ kicker: "Sem saída fiscal", title: "Declara como residente", acc: [2] }, t11 + 0.1, { y: SPLIT_TOP, until: A("não espere") - 0.15 });
K.panel(`
  <div style="position:absolute;left:40px;right:40px;top:34px">
    <div class="r1" style="${ROW}"><span>Aluguel no Brasil</span>${K.icon("folder").replace("<svg", '<svg style="width:44px;height:44px;stroke:var(--lav);fill:none;stroke-width:2"')}</div>
    <div class="plus" style="text-align:center;font:800 46px/1 var(--fS);color:var(--lav);padding:10px 0">+</div>
    <div class="r2" style="${ROW}"><span>Toda a renda do exterior</span>${K.icon("money").replace("<svg", '<svg style="width:44px;height:44px;stroke:var(--lav);fill:none;stroke-width:2"')}</div>
    <div class="r3" style="margin-top:24px;display:flex;align-items:center;gap:18px;padding:22px 26px;border-radius:20px;background:linear-gradient(90deg,var(--btnA),var(--btnB));box-shadow:var(--glow);font:800 36px/1 var(--fS);color:var(--onAcc,#fff)">${K.icon("caption").replace("<svg", '<svg style="width:44px;height:44px;stroke:var(--onAcc,#fff);fill:none;stroke-width:2.2"')}<span>Tudo na mesma declaração</span></div>
  </div>`, A("o aluguel entra") + 0.05, {
  box: { x: 90, y: 400, w: 900, h: 480 },
  steps: [
    { sel: ".r1", t: A("o aluguel entra") + 0.1 },
    { sel: ".plus", t: A("junto com"), anim: "fade", sfx: false },
    { sel: ".r2", t: A("toda a renda") },
    { sel: ".r3", t: A("exterior") + 0.15, anim: "slide" },
  ],
  until: A("não espere") - 0.15,
});

// 12) "Não espere a bomba estourar, vale olhar isso agora" — ampulheta
const t12 = A("não espere") - 0.1;
toFull(t12);
K.pill("Não espere a bomba estourar", A("não espere") + 0.1, { y: CHEST + 40, icon: "bolt", up: true, until: A("vale olhar") - 0.05 });
K.flash(A("estourar") + 0.15, { peak: 0.5 });
K.punch(A("vale olhar"), 1.16);
K.stack([
  { text: "olhe isso", t: A("vale olhar"), style: "blur" },
  { text: "agora", t: A("agora"), style: "glow" },
], { top: 1150, until: A("resultax") - 0.12 });
K.hideMouth(A("vale olhar") - 0.05, A("resultax"));

// 13) "A Resultax Internacional organiza sua situação fiscal no Brasil, inclusive a dos seus imóveis" — logo oficial do cliente
const t13 = A("resultax") - 0.1;
toSplit(t13);
// logo solta, sem cartão: entra do desfoque para o nítido; sombra suave para ler sobre qualquer fundo.
// escurecer = degradê do topo (sem bordas, sangra a tela) para a logo ler sobre a cena clara do final
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
  K.sfx("shimmer", t + 0.05, 0.22);
  if (until) K.out(g, until);
  return g;
};
logo(A("resultax"), { y: SPLIT_TOP + 10, h: 250, until: A("clica") - 0.15 });
K.panel(`
  <div style="position:absolute;left:40px;right:40px;top:34px">
    <div class="kick" style="font:600 22px/1 var(--fM);letter-spacing:.2em;color:var(--lavT);text-transform:uppercase;margin-bottom:10px">Organiza</div>
    <div class="c1" style="${ROW}"><span>Sua situação fiscal no Brasil</span>${K.icon("check").replace("<svg", '<svg style="width:46px;height:46px;stroke:var(--lav);fill:none;stroke-width:2.6"')}</div>
    <div class="c2" style="${ROW};border:0"><span>Inclusive a dos seus imóveis</span>${K.icon("check").replace("<svg", '<svg style="width:46px;height:46px;stroke:var(--lav);fill:none;stroke-width:2.6"')}</div>
  </div>`, A("organiza"), {
  box: { x: 90, y: 600, w: 900, h: 300 },
  steps: [
    { sel: ".kick", t: A("organiza"), anim: "fade", sfx: false },
    { sel: ".c1", t: A("situação fiscal") },
    { sel: ".c2", t: A("inclusive") },
  ],
  until: A("clica") - 0.15,
});

// 14) CTA "Clica no link da Bio e saiba mais"
const t14 = A("clica") - 0.1;
toFull(t14);
logo(t14 + 0.15, { y: 330, h: 290, escurecer: true });
K.cta("Link na bio", A("clica"), { y: 1300, w: 760, clickAt: A("link") - A("clica") + 0.05 });

// legenda (rastreio fixo, centralizada; só em tela cheia)
K.mouthCaps({ accent: ["imóvel", "alugado", "saída", "fiscal", "aluguel", "imposto", "15%", "Receita", "Federal", "inquilino", "imobiliária",
  "procurador", "ninguém", "CPF", "pior", "residente", "exterior", "bomba", "agora", "Resultax", "Bio", "link"] });

// ===================== TRILHA DE EFEITOS (v5) — desenhada à mão =====================
// O kit põe um som automático em cada peça; aqui todos saem e entra uma trilha pensada momento a momento, com
// sons diferentes por tipo de acontecimento. Paleta: sfx-projeto/gerar.py (tudo ≥ 400 Hz, para celular).
// Volume de cada som calibrado pela intensidade acima de 400 Hz: sfx-projeto/volumes.json (8–14 dB abaixo da voz).
// vsl.json: "sfxModo": "manual" (sem o filtro enxuto) e "sfxVol": 1 (o volume abaixo é o final).
const V = {"sopro-sobe": 0.156, "sopro-desce": 0.148, "sopro-curto": 0.12, "carimbo": 0.493, "impacto": 0.402, "pop1": 0.178, "pop2": 0.176, "pop3": 0.17, "tick": 0.257, "check": 0.131, "ding": 0.111, "moeda": 0.109, "brilho": 0.14, "erro": 0.052, "alerta": 0.05, "tictac": 0.33, "glitch": 0.098, "click": 0.313};
const S = (nome, t) => K.sfx(nome, t, V[nome]);
document.querySelectorAll('#vsl audio[src^="assets/sfx/"]').forEach((a) => a.remove());
// trocas de cena = sopros; o pico do sopro cai no corte (FULL→SPLIT sobe, SPLIT→FULL desce, corte simples curto)
const ANTES = { sobe: 0.26, desce: 0.15, curto: 0.12 };
[["glitch", 2.45], ["curto", 4.41], ["sobe", 7.72], ["desce", 12.36], ["sobe", 16.54], ["desce", 22.72], ["sobe", 24.80],
 ["curto", 30.90], ["desce", 37.94], ["curto", 40.28], ["sobe", 43.68], ["desce", 48.20], ["sobe", 51.22], ["desce", 56.08]]
  .forEach(([k, t]) => (k === "glitch" ? S("glitch", t - 0.02) : S("sopro-" + k, t - ANTES[k])));
S("check", A("saída fiscal"));                 // saída fiscal feita ✓
S("moeda", A("caindo na conta"));              // aluguel caindo na conta
S("erro", A("ninguém"));                       // imposto NÃO RECOLHIDO
S("ding", E("em regra") + 0.02);               // 15%
S("pop1", A("empresa"));                       // cards: inquilino empresa…
S("pop3", A("procurador"));                    // …procurador
S("pop1", A("a imobiliária faz"));             // empurra-empurra: três degraus que sobem
S("pop2", A("acha que é o procurador"));
S("pop3", A("acha que é o inquilino"));
S("carimbo", A("ninguém faz") + 0.1);          // NINGUÉM FAZ
S("alerta", A("cpf"));                         // pendência no CPF
S("impacto", A("ainda pior") - 0.1);           // ainda pior (flash)
S("tictac", A("não espere") + 0.15);           // a bomba / a ampulheta
S("impacto", A("estourar") + 0.15);            // estourar (flash)
S("brilho", A("resultax") + 0.05);             // logo
S("check", A("situação fiscal"));              // organiza ✓
S("click", A("link") + 0.05);                  // clique no botão
