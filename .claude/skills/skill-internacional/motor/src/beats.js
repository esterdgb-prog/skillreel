// CENAS do reel (só isto muda de vídeo para vídeo). A biblioteca (src/biblioteca.js) e os mapas (src/mapas.js) já vêm antes.
// Régua: ../exemplo/beats-nubank-uruguai.js — leia inteiro antes de escrever. Uma cena por ideia do roteiro, algo novo a
// cada 1,5–3 s, cada peça entra NA PALAVRA (A("frase")). A("…") dá erro se a frase não existir no transcript: é de propósito.
//
// esqueleto de uma cena:
// {
//   const t0 = A("primeira frase") - 0.05, t1 = A("frase da próxima cena") - 0.1;
//   const g = scene(`<svg style="${FULL}">…</svg>${CHIP("Rótulo", 540, 980, "rt", C.yellow, C.ink)}`, t0, t1);
//   pop($$(g, ".rt"), A("palavra"));            K.sfx("pop", A("palavra"), 0.3);
// }
//
// CTA padrão da Resultax (troque as frases pelas do roteiro):
// K.logo({ img: "assets/img/logo-resultax.png" }, A("resultax"), CFG.dur - A("resultax") + 0.3, { y: 290, h: 380 });
// K.cta("Link na bio", A("clica"), { y: 870, w: 760, clickAt: A("link da bio") - A("clica") + 0.1 });

// legenda (a do reel "Saída Fiscal") — SEMPRE por último; accent = palavras-chave que acendem em dourado
K.mouthCaps({ accent: [] });
