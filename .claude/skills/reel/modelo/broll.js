// ===== K.broll — vídeo de apoio (banco Pixabay: ferramentas/pixabay.py) =====
// Injetado por montar.mjs ANTES dos beats quando existe assets/broll/. Não mexe no kit: usa K.mk, K.show e a timeline.
//   K.broll("px-10822.mp4", t0, t1)                          quadro de vidro na metade de cima (use num trecho SPLIT, R1)
//   K.broll("px-10822.mp4", t0, t1, { box: {x,y,w,h} })      outra caixa (abaixo do queixo, peito…) — nunca sobre o rosto
//   K.broll("px-10822.mp4", t0, t1, { tela: "cheia" })        cena de fundo própria: cobre a câmera inteira (R1, opção 3);
//                                                             esconde a legenda no intervalo; volte com a câmera depois
//   opções: from (s do clipe onde começa, padrão 0) · pos (object-position, padrão "50% 50%") · zoom (1 = sem zoom; o
//           clipe faz um zoom lento até ele, padrão 1.06) · titulo (kicker no canto) · sfx (false = sem whoosh)
// O clipe precisa durar ≥ (t1 − t0) a partir de `from` (pixabay.py baixar --ate N). Vídeo do banco é CONTEXTO, nunca
// prova, logo ou print (R3), e entra em assets/SOURCES.md (o pixabay.py já escreve a linha).
(() => {
  let n = 0;
  K.broll = (file, t0, t1, opt = {}) => {
    if (!(t1 > t0)) throw new Error(`K.broll("${file}"): t1 (${t1}) precisa ser maior que t0 (${t0})`);
    const cheia = opt.tela === "cheia";
    const b = cheia ? { x: 0, y: 0, w: 1080, h: 1920 } : Object.assign({ x: 90, y: 290, w: 900, h: 506 }, opt.box);
    const g = K.mk("#ui", cheia ? "k" : "k panel", "", {
      left: b.x + "px", top: b.y + "px", width: b.w + "px", height: b.h + "px", overflow: "hidden",
      padding: "0", borderRadius: cheia ? "0" : "26px",
    });
    if (cheia) g.setAttribute("data-safe", "ignore");   // fundo pode sangrar (R7)
    const v = document.createElement("video");
    v.id = `broll${++n}`;
    v.src = `assets/broll/${file}`;
    v.muted = true; v.playsInline = true;
    v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
    v.setAttribute("data-start", String(+t0.toFixed(3)));
    v.setAttribute("data-duration", String(+(t1 - t0).toFixed(3)));
    v.setAttribute("data-media-start", String(opt.from || 0));
    v.setAttribute("data-track-index", String(20 + n));
    Object.assign(v.style, { position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover",
      objectPosition: opt.pos || "50% 50%", transformOrigin: "50% 50%" });
    g.appendChild(v);
    if (opt.titulo) K.mk(g, "kicker", String(opt.titulo).replace(/[<>&]/g, ""), { position: "absolute", left: "34px", top: "28px", color: "var(--lavT)" });
    if (!cheia) K.occupy(t0, t1, b.y);
    else K.hideMouth(t0 - 0.05, t1 + 0.05);
    K.tl.fromTo(g, { opacity: 0, y: cheia ? 0 : 24, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.35, ease: "power2.out", immediateRender: false }, t0);
    K.tl.fromTo(v, { scale: 1 }, { scale: opt.zoom || 1.06, duration: t1 - t0, ease: "none", immediateRender: false }, t0);
    K.out(g, t1 - 0.25);
    if (opt.sfx !== false) K.sfx("whoosh", t0, 0.22);
    K.ev("MOTION", `vídeo ${file}`, t0, t1 - t0);
    return g;
  };
})();
