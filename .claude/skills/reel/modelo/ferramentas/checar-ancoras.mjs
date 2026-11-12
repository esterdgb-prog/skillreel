#!/usr/bin/env node
// Confere TODAS as âncoras do src/beats.js contra assets/transcript.json, antes de abrir o navegador.
// Uso (na pasta do motor):  node ferramentas/checar-ancoras.mjs
// Uma âncora quebrada faz o K.at lançar erro e o vídeo sai SEM NENHUMA peça (snapshot vazio). Erros já vistos:
// - pedir a n-ésima ocorrência que não existe (A("se voce", 3) quando só há 2);
// - palavra com hífen: "e-book" vira "ebook" no transcript normalizado → âncora A("ebook");
// - ocorrência errada: A("na academia", 3) caiu numa fala 3 s depois do painel → o risco nunca apareceu.
// Imprime cada âncora com o tempo e o texto ao redor, para conferir que pegou a fala certa.
import { readFileSync } from "node:fs";
const words = JSON.parse(readFileSync("assets/transcript.json", "utf8")).words;
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9%$ ]+/g, " ").trim();
const WN = words.map((w) => ({ n: norm(w.text), s: w.start, e: w.end, raw: w.text })).filter((w) => w.n);
const find = (phrase, nth = 1) => {
  const p = norm(phrase).split(/\s+/); let hit = 0;
  for (let i = 0; i <= WN.length - p.length; i++) {
    let ok = true;
    for (let j = 0; j < p.length; j++) if (WN[i + j].n.replace(/ /g, "") !== p[j]) { ok = false; break; }
    if (ok && ++hit === nth) return i;
  }
  return -1;
};
const src = readFileSync("src/beats.js", "utf8");
const re = /(?:\bA|K\.at|K\.end)\("([^"]+)"(?:,\s*(\d+))?/g;
const seen = new Map(); let m, falhas = 0;
while ((m = re.exec(src))) {
  const k = `${m[1]}#${m[2] || 1}`; if (seen.has(k)) continue;
  const i = find(m[1], +(m[2] || 1)); seen.set(k, i);
  if (i < 0) { falhas++; console.log(`FALHA  "${m[1]}" #${m[2] || 1}`); continue; }
  const ctx = WN.slice(Math.max(0, i - 2), i + 6).map((w) => w.raw).join(" ");
  if (process.argv.includes("-v")) console.log(`${WN[i].s.toFixed(2).padStart(6)}  "${m[1]}" #${m[2] || 1}  …${ctx}…`);
}
console.log(`${seen.size} âncoras · ${falhas} falha(s)${falhas ? "" : " — ok"}${process.argv.includes("-v") ? "" : " (use -v para ver o contexto de cada uma)"}`);
process.exit(falhas ? 1 : 0);
