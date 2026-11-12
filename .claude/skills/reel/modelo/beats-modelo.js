// ============================================================================================================
// beats.js — o roteiro visual do reel no estilo 03 · VSL (motor da referência aprovada + legenda v3, nov/2026).
// Só chamadas K.* com tempos de K.at("frase exata do transcript"). K.at LANÇA ERRO se a frase não existir:
// corrija a frase, nunca chute segundos. Palavra repetida: K.at("frase", n) = n-ésima ocorrência;
// mais contexto resolve ("te entregar" em vez de "entregar"). Confira TODAS antes de montar:
//   node ferramentas/checar-ancoras.mjs -v      (FALHA = o vídeo sai sem nenhuma peça; confira também a ocorrência)
// Exemplo completo e aprovado (legenda antiga do kit): exemplo/beats-exemplo.js.
//
// Gramática (fala → câmera → peça), na ordem em que aparece num reel típico:
//   gancho                      FULL bruto      K.camcorder(0, t, {label}) → K.glitch(t) + ZOOM FORTE contínuo (K.drift)
//   frase-tese / número         FULL + punch    K.punch(t, 1.14–1.2) + K.stack com AS PALAVRAS EXATAS DA FALA no peito
//   fato com fonte              FULL            K.pill("texto curto", t, {y, icon, sm, up})
//   preço / comparação          SPLIT           K.section + K.panel(tabela com .r1 .r2 … revelados em steps na palavra)
//   lista de 2–4 coisas         SPLIT           K.section + K.grid([{img,label,icon,t}])
//   "é só pedir…"               SPLIT           K.panel(chat) + K.prompt("pedido", t, {cps, send})
//   resultado pronto            FULL            K.stamp no PEITO + K.panel(exportar) y ≥ 1170
//   jeito antigo × novo         FULL/SPLIT      item riscado: <i class="x"> + step {anim:"strike"} NA PALAVRA do item
//   marca/método do cliente     qualquer        LOGO_CANTO(IMG("logo.png"), A("nome do método"), until, {split})
//   CTA                         FULL            em ANÚNCIO com botão nativo ("Saiba mais"): NÃO desenhe botão — só pílulas
//
// Regras aprovadas pelo cliente (nov/2026) — valem por cima do exemplo:
// - LETTERING FIEL À FALA: K.stack mostra as palavras ditas, na ordem, sem resumir ("VOCÊ NÃO PRECISA / PASSAR MUITO
//   TEMPO / NA ACADEMIA", nunca "NÃO PRECISA DE HORAS"). Cada linha entra na sua palavra.
// - LEGENDA NUNCA COME PALAVRA: a legenda v3 (legenda.js, automática) não some em troca de layout nem no SPLIT.
//   Durante um lettering, pule SÓ as palavras dele:   hideCap(A("primeira palavra"), K.end("última palavra"));
//   e faça a legenda esperar o fade de saída:          stackOut(<o until do K.stack>);
//   Nunca estique a janela de hideCap além da última palavra do lettering. K.hideMouth antigo agora só espera.
//   Depois de montar:  node ferramentas/tempo-legenda.mjs  (puladas = exatamente as do lettering; nada < 0,3 s).
// - LOGO DO CLIENTE: PNG sem fundo, sem nenhuma alteração; canto superior direito (FULL) / canto do card (SPLIT); entra
//   com impacto (impacto2) em TODA menção; a legenda continua. Dentro de painéis, escreva o nome em texto.
// - nada sobre o rosto (R1); nada fora da zona segura (anúncio: y 270–1248, vsl.json "_anuncio");
// - toda troca FULL↔SPLIT com K.layout (animada, 0,45 s) — o som da troca (whoosh) é mixado depois (mixar-sfx.py);
// - LEG.destaques = palavras-chave do vídeo (fonte de destaque, sublinhado, palavras sobem de baixo para cima);
// - algo novo a cada 1,5–3 s; cada número e fato com fonte em ../assets/SOURCES.md.
// ============================================================================================================
const A = (p, n = 1, after = 0) => K.at(p, n, after);
const IMG = (f) => `assets/img/${f}`;
const SPLIT_TOP = 240;  // topo do conteúdo em SPLIT (reels: zona segura começa em 220; anúncio: use 290)
const CHEST = 1250;     // linha do peito para pílulas em tela cheia (anúncio: ~1130, a zona acaba em 1248)
LEG.destaques = [];     // ex.: ["método", "minutos", "espelho", "50%"]

// --- ponto de partida neutro (funciona com qualquer transcript; troque pelo mapa do vídeo) -------------------
const w = WORDS, t2 = w.length > 3 ? w[3].start : 1;
K.camcorder(0, t2 - 0.05, { label: "NOVIDADE" });
K.glitch(t2 - 0.05);
K.punch(0, 1.04);
K.drift(0, t2 + 1.5, 0.34);   // zoom forte e contínuo no gancho (1,04 → 1,38) — aprovado

// --- 1) GANCHO com lettering fiel -----------------------------------------------------------------------------
// const tG = A("primeiras palavras") - 0.05;
// K.camcorder(0, tG, { label: "TEMA · MARCA" });  K.glitch(tG);  K.punch(0, 1.04);  K.drift(0, A("frase seguinte") - 0.05, 0.34);
// K.stack([{ text: "mulher que tem", t: A("mulher") + 0.05, style: "blur" }, { text: "pouco tempo", t: A("pouco tempo"), style: "glow" },
//          { text: "para treinar", t: A("para treinar"), style: "blur" }], { top: 860, size: 74, gap: 90, until: A("precisa saber") - 0.05 });
// hideCap(0, A("precisa saber"));          // pula só "Mulher que tem pouco tempo para treinar"
// stackOut(A("precisa saber") - 0.05);     // espera o fade do lettering

// --- 2) SPLIT com painel revelado na palavra (e item riscado) -------------------------------------------------
// const t4 = A("frase do painel") - 0.08;
// K.layout("split", t4);
// K.section({ kicker: "Kicker curto", title: "Título de 3–5 palavras", acc: [3, 4] }, t4 + 0.1, { y: SPLIT_TOP, until: A("frase seguinte") - 0.15 });
// K.panel(`<div class="r1">…</div><div class="r2" style="position:relative">Horas na academia<i class="x" style="position:absolute;left:-6px;right:-6px;top:50%;height:5px;background:var(--acc)"></i></div>`,
//   A("palavra do 1º item") - 0.1, { box: { x: 90, y: 390, w: 900, h: 560 },
//   steps: [{ sel: ".r1", t: A("palavra do 1º item") }, { sel: ".r2", t: A("passando horas"), anim: "slide" },
//           { sel: ".x", t: A("horas na academia") + 0.12, anim: "strike", d: 0.4 }],   // o risco precisa caber ANTES do until
//   until: A("frase seguinte") - 0.15 });

// --- 3) logo do cliente (toda menção ao método/marca) -------------------------------------------------------
// LOGO_CANTO(IMG("logo.png"), A("metodo 40"), A("frase seguinte") - 0.12);            // FULL: canto superior direito
// LOGO_CANTO(IMG("logo.png"), A("o metodo 40 e"), A("eu sempre"), { split: true });    // SPLIT: canto do card da câmera

// --- 4) CTA de anúncio (sem botão desenhado) -----------------------------------------------------------------
// K.pill("Vagas encerradas", A("vagas ja se encerraram"), { y: CHEST, kind: "strike dark", up: true, until: A("mas se ele") - 0.05 });
// K.pill("Ainda tem vaga", A("ainda tem alguma vaga"), { y: CHEST, icon: "check", up: true });

// a legenda v3 é automática (legenda.js, injetada pelo montar.mjs): não chame K.mouthCaps
