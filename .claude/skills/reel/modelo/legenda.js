// ===== legenda v3 · parte 2 (injetada por montar.mjs DEPOIS do src/beats.js quando vsl.json "legenda": "v3") =====
// Substitui o K.mouthCaps do kit (o kit fica intocado). Aprovada em produção (nov/2026, reel "Método 40" v3).
// - posição: 48 px abaixo do queixo, seguindo o rosto pelo TEMPO (o face-track.json só guarda os quadros em que o rosto
//   foi detectado; o kit lia pelo número do quadro e a legenda seguia o rosto de outro momento → caía em cima do rosto);
//   sem rosto: última posição conhecida (até 2 s) ou um ponto fixo no peito; no SPLIT: fixa no topo do card da câmera.
// - nada some: a legenda NÃO se esconde nas trocas de layout nem no SPLIT; só pula as palavras de um lettering (hideCap).
// - cada palavra aparece na hora em que é dita (invisível antes) e cada bloco fica ≥ 0,4 s na tela.
// - blocos normais: palavras acendem na fala, sem movimento · blocos com destaque: palavras sobem de baixo para cima;
//   a palavra-destaque usa a fonte de destaque (Anton), branca, maior, com sublinhado na cor de destaque — sem caixa.
// - fontes: vsl.json "legendaFonte" / "legendaDestaque" (arquivos em assets/fonts-legenda/); padrão Poppins 600 / Anton (OFL).
(() => {
  const F1 = CFG.legendaFonte || "assets/fonts-legenda/poppins-latin-600-normal.woff2";
  const F1x = CFG.legendaFonte ? null : "assets/fonts-legenda/poppins-latin-ext-600-normal.woff2";
  const F2 = CFG.legendaDestaque || "assets/fonts-legenda/anton-latin-400-normal.woff2";
  const F2x = CFG.legendaDestaque ? null : "assets/fonts-legenda/anton-latin-ext-400-normal.woff2";
  const st = document.createElement("style");
  st.textContent = `
@font-face{font-family:Legenda;src:url(${F1})}${F1x ? `@font-face{font-family:Legenda;src:url(${F1x});unicode-range:U+0100-024F}` : ""}
@font-face{font-family:Destaque;src:url(${F2})}${F2x ? `@font-face{font-family:Destaque;src:url(${F2x});unicode-range:U+0100-024F}` : ""}
#vsl .cap2{position:absolute;left:0;top:0;transform:translateX(-50%);white-space:nowrap;text-align:center;font:600 ${CFG.legendaTamanho || 56}px/1.15 Legenda,sans-serif;color:#fff;letter-spacing:-.01em;
  text-shadow:0 2px 3px rgba(0,0,0,.6),0 6px 24px rgba(0,0,0,.45)}
#vsl .cap2 .w{display:inline-block;margin:0 .11em}
#vsl .cap2 .d{font-family:Destaque,sans-serif;font-weight:400;font-size:1.28em;line-height:1;text-transform:uppercase;letter-spacing:.02em;color:#fff;
  text-decoration:underline;text-decoration-color:var(--acc);text-decoration-thickness:.09em;text-underline-offset:.1em}`;
  document.head.appendChild(st);
  const norm = (x) => x.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9% ]+/g, "").trim();
  const ACC = new Set((LEG.destaques || []).map(norm));
  const pares = (CFG.legendaPares || [["saiba", "mais"]]).map((p) => p.map(norm));   // segunda palavra também em destaque
  const sf = Object.assign({ top: 220, bottom: 1520 }, CFG.safe || {});
  const R = (FACE && FACE.rows) || [];
  const faceAt = (t) => { let lo = 0, hi = R.length - 1; if (hi < 0) return null;
    while (lo < hi) { const m = (lo + hi) >> 1; if (R[m][0] < t) lo = m + 1; else hi = m; }
    const c = [R[lo], R[lo - 1]].filter(Boolean).sort((a, b) => Math.abs(a[0] - t) - Math.abs(b[0] - t))[0];
    return Math.abs(c[0] - t) < 0.4 ? c : null; };
  const lastFace = (t) => { let c = null; for (let i = R.length - 1; i >= 0; i--) if (R[i][0] <= t) { c = R[i]; break; } return c && t - c[0] < 2 ? c : null; };
  // 1) blocos de até 3 palavras / 18 caracteres, sem as palavras que um lettering já mostra
  const noLettering = (w) => !LEG.hide.some(([a, b]) => w.start >= a && w.start < b);
  const chunks = []; let cur = null;
  WORDS.filter((w) => w.text && w.text.trim() && noLettering(w)).forEach((w) => {
    const txt = w.text.replace(/[.,;:!?]+$/, "");
    if (cur && (w.start - cur.end > 0.32 || (cur.text + " " + txt).length > 18 || cur.n >= 3)) { chunks.push(cur); cur = null; }
    if (!cur) cur = { text: txt, words: [], start: w.start, end: w.end, n: 0 }; else cur.text += " " + txt;
    cur.words.push({ text: txt, t: w.start }); cur.end = w.end; cur.n++;
    if (/[.!?;:,]$/.test(w.text)) { chunks.push(cur); cur = null; }
  });
  if (cur) chunks.push(cur);
  // 2) a última palavra de um bloco precisa de tempo na tela: se o próximo começa < 0,35 s depois dela, ela passa para o próximo
  for (let k = 0; k < 3; k++) for (let i = 0; i < chunks.length - 1; i++) {
    const c = chunks[i], nx = chunks[i + 1], last = c.words[c.words.length - 1];
    if (c.words.length > 1 && nx.start - last.t < 0.35 && nx.words.length < 3 && (last.text + " " + nx.text).length <= 20 && nx.start - c.end < 0.32) {
      c.words.pop(); c.text = c.words.map((w) => w.text).join(" "); c.end = c.words[c.words.length - 1].t + 0.25;
      nx.words.unshift(last); nx.text = last.text + " " + nx.text; nx.start = last.t; nx.n = nx.words.length;
    }
  }
  // 3) quando cada bloco aparece e some: ≥ 0,4 s na tela, contado de quando ele realmente aparece
  const waitEnd = (t) => { const w = LEG.wait.find(([x, y]) => t >= x && t < y); return w ? w[1] : t; };
  chunks.forEach((ch, i) => {
    const prev = chunks[i - 1], nx = chunks[i + 1], lastT = ch.words[ch.words.length - 1].t;
    ch.show = waitEnd(prev ? Math.max(ch.start, prev.hide) : ch.start);
    ch.hide = Math.max(Math.min(nx ? nx.start : ch.end + 0.6, ch.end + 0.5), lastT + 0.4, ch.show + 0.4);
  });
  const holder = K.mk("#cap", "", "", { position: "absolute", left: "0", top: "0", opacity: "0" });
  chunks.forEach((ch, i) => {
    const el = K.mk(holder, "cap2 k", "");
    const isD = (w, j) => { const prevW = j ? ch.words[j - 1].text : (chunks[i - 1] ? chunks[i - 1].words.slice(-1)[0].text : "");
      return ACC.has(norm(w.text)) || pares.some(([a, b]) => norm(prevW) === a && norm(w.text) === b); };
    const dest = ch.words.some((w, j) => isD(w, j));
    ch.words.forEach((w, j) => {
      const sp = document.createElement("span"); sp.className = "w" + (isD(w, j) ? " d" : ""); sp.textContent = w.text; sp.style.opacity = "0"; el.appendChild(sp);
      if (dest) K.tl.fromTo(sp, { opacity: 0, y: 46, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.34, ease: "power3.out", immediateRender: false }, w.t);
      else K.tl.fromTo(sp, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "none", immediateRender: false }, w.t);
    });
    K.tl.set(el, { opacity: 1 }, ch.show);
    K.tl.set(el, { opacity: 0 }, ch.hide);
  });
  const follow = (t) => {
    const off = () => { holder.style.opacity = "0"; };
    if (LEG.hide.some(([a, b]) => t >= a && t < b) || LEG.wait.some(([a, b]) => t >= a && t < b)) return off();
    const f = faceAt(t) || lastFace(t);
    const [x, y, , fw] = f ? K.srcToCanvas(f[1], f[4]) : [540, 950, 0, K.srcToCanvas(540, 960)[3]];
    let cx, cy;
    if (fw < 1080 * 0.95) { cx = 540; cy = CFG.legendaSplitY || 1004; }        // SPLIT: topo do card da câmera
    else { cx = Math.max(340, Math.min(740, x)); cy = Math.max(sf.top + 30, Math.min(sf.bottom - 98, y + 48)); }
    if (LEG.occ.some(([a, b, top, bot]) => t >= a && t < b && cy + 84 > top && cy < bot)) return off();
    holder.style.opacity = "1";
    holder.style.transform = `translate(${cx.toFixed(1)}px,${cy.toFixed(1)}px)`;
  };
  const prev = K.tl.eventCallback("onUpdate");
  K.tl.eventCallback("onUpdate", function () { if (prev) prev.apply(this, arguments); follow(K.tl.time()); });
})();
