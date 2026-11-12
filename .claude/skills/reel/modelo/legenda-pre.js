// ===== legenda v3 · parte 1 (injetada por montar.mjs ANTES do src/beats.js quando vsl.json "legenda": "v3") =====
// Aprovado em produção (nov/2026, reel "Método 40" v3). Ajudantes que o beats.js usa:
//   hideCap(a, b)   a legenda PULA as palavras ditas em [a, b): use SÓ quando um lettering mostra exatamente essas palavras.
//                   a = A("primeira palavra do lettering"), b = K.end("última palavra do lettering") (ou A("palavra seguinte")).
//                   Nunca estique a janela: palavra fora do lettering que cair nela some da tela (foi o erro "comeu a legenda").
//   stackOut(u)     a legenda espera 0,3 s depois de u (o fade de saída do lettering que termina em u) sem pular palavras.
//   LEG.destaques   lista de palavras-destaque do vídeo (fonte de destaque + palavras subindo de baixo para cima).
//   LOGO_CANTO(src, t, until, {split, w})  logo do cliente sem fundo no canto superior direito (FULL) ou no canto do card
//                   da câmera (SPLIT), com impacto (impacto2.wav); a legenda continua normal enquanto a logo está na tela.
// K.hideMouth(a, b) passa a só ESPERAR (não pula palavras): pode ficar nos beats antigos sem comer legenda.
const LEG = { hide: [], wait: [], occ: [], destaques: [] };
const hideCap = (a, b) => LEG.hide.push([a, b]);
const stackOut = (u) => LEG.wait.push([u, u + 0.3]);
K.hideMouth = (a, b) => LEG.wait.push([a, b]);
K.mouthCaps = () => {};   // a legenda v3 (legenda.js) substitui a do kit; chamadas antigas não duplicam a legenda
const LOGO_CANTO = (src, t, until, o = {}) => {
  const split = !!o.split, w = o.w || (split ? 270 : 340), sf = K.cfg.safe || { top: 220 };
  const pos = split ? { left: 1080 - 72 - w + "px", top: (o.top || 1100) + "px" } : { left: 1080 - 70 - w + "px", top: (o.top || sf.top + 22) + "px" };
  // brilho branco difuso em volta do desenho (logo escura sobre fundo escuro); a logo em si não muda. o.brilho === false desliga
  const glow = o.brilho === false ? "none" : "drop-shadow(0 0 6px rgba(255,255,255,.95)) drop-shadow(0 0 18px rgba(255,255,255,.75)) drop-shadow(0 0 36px rgba(255,255,255,.45))";
  const g = K.mk("#ui", "k", `<img src="${src}" style="width:${w}px;display:block">`, Object.assign({ width: w + "px", filter: glow }, pos));
  K.tl.fromTo(g, { opacity: 0, scale: 1.35 }, { opacity: 1, scale: 1, duration: 0.28, ease: "power4.in", immediateRender: false }, t - 0.12);
  K.tl.to(g, { x: 5, duration: 0.04, yoyo: true, repeat: 3, immediateRender: false }, t + 0.16);
  K.sfx("impacto2", t, 1);
  if (until) K.out(g, until);
  return g;
};
