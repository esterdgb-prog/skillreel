#!/usr/bin/env node
// Mede, quadro a quadro, quanto tempo CADA palavra da legenda v3 fica visível (antes do render).
// Uso (na pasta do motor, depois de node montar.mjs):  node ferramentas/tempo-legenda.mjs
// Critério (aprovado nov/2026, "não coma a legenda"): toda palavra falada aparece — na legenda OU num lettering —
// e nenhuma palavra da legenda fica < 0,3 s na tela (só se aceita em fala colada a um lettering, registrado no VERIFY).
// Imprime: palavras da legenda, palavras puladas por lettering (devem ser exatamente as do lettering) e as curtas.
// Navegador: o Playwright do projeto; se ele não achar o Chromium, defina CHROME (ou use /opt/pw-browsers/chromium).
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(resolve("package.json"));
const { chromium } = require("playwright");
const exe = process.env.CHROME || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const opts = exe ? { executablePath: exe, args: ["--no-sandbox"] } : {};
let b;
try { b = await chromium.launch(opts); } catch (e) { b = await chromium.launch(); }
const p = await b.newPage();
const erros = []; p.on("pageerror", (e) => erros.push(e.message));
await p.goto("file://" + resolve("index.html")); await p.waitForTimeout(2500);
if (erros.length) { console.log("ERRO NA PÁGINA:", erros[0]); await b.close(); process.exit(1); }
const r = await p.evaluate(() => {
  const tl = window.__timelines.vsl, els = [...document.querySelectorAll("#vsl .cap2")];
  if (!els.length) return null;
  const hold = els[0].parentElement, vis = new Map();
  for (let t = 0; t < tl.duration(); t += 1 / 30) {
    tl.seek(t, false); if (+getComputedStyle(hold).opacity < 0.5) continue;
    els.forEach((el, i) => { if (+getComputedStyle(el).opacity < 0.5) return;
      [...el.querySelectorAll(".w")].forEach((w, j) => { if (+getComputedStyle(w).opacity > 0.6) vis.set(i + ":" + j, (vis.get(i + ":" + j) || 0) + 1 / 30); }); });
  }
  const res = []; els.forEach((el, i) => [...el.querySelectorAll(".w")].forEach((w, j) => res.push([w.textContent, +(vis.get(i + ":" + j) || 0).toFixed(2), [...el.querySelectorAll(".w")].map((x) => x.textContent).join(" ")])));
  const pulados = WORDS.filter((w) => LEG.hide.some(([a, z]) => w.start >= a && w.start < z)).map((w) => w.text);
  return { res, pulados, total: WORDS.length };
});
await b.close();
if (!r) { console.log("sem legenda v3 nesta montagem (vsl.json \"legenda\": \"v3\"?)"); process.exit(1); }
const curtas = r.res.filter((x) => x[1] < 0.3);
console.log(`palavras faladas: ${r.total} · na legenda: ${r.res.length} · nos letterings (puladas): ${r.pulados.length}`);
if (r.pulados.length) console.log(`  puladas: ${r.pulados.join(" ")}`);
console.log(`visíveis < 0,3 s: ${curtas.length}`); curtas.forEach((x) => console.log(`  "${x[0]}" ${x[1]} s  (bloco: ${x[2]})`));
if (r.res.length + r.pulados.length !== r.total) console.log("ATENÇÃO: legenda + letterings ≠ palavras faladas");
