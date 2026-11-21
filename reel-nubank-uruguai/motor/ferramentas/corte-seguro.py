#!/usr/bin/env python3
"""Corte conservador da narração: só encurta PAUSAS, nunca encosta na fala.

Uma pausa é um trecho contínuo abaixo do limiar de silêncio (fala p90 − REL dB, padrão 32) por mais de MIN_PAUSA s.
Em cada pausa ficam MARGEM s colados à fala de cada lado (a respiração e o fim da palavra ficam inteiros);
só o miolo sai, com crossfade de 15 ms. O fim do áudio ganha CAUDA s depois da última palavra.

uso: corte-seguro.py entrada.(mp3|wav) saida.wav [--margem 0.18] [--min-pausa 0.5]
"""
import sys, subprocess, json, numpy as np
args = sys.argv[1:]
src, out = args[0], args[1]
MARGEM = float(args[args.index("--margem") + 1]) if "--margem" in args else 0.18
MIN_PAUSA = float(args[args.index("--min-pausa") + 1]) if "--min-pausa" in args else 0.5
CAUDA, SR, FR = 0.6, 48000, 0.01
x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout, np.float32)
hop = int(SR * FR); n = len(x) // hop
rms = np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2)) + 1e-9 for i in range(n)])
db = 20 * np.log10(rms)
REL = float(args[args.index("--rel") + 1]) if "--rel" in args else 32
lim = np.percentile(db, 90) - REL
sil = db < lim
# trechos de silêncio
spans, i = [], 0
while i < n:
    if sil[i]:
        j = i
        while j < n and sil[j]: j += 1
        spans.append((i * FR, j * FR)); i = j
    else: i += 1
fala_ini = next(a for a in np.where(~sil)[0]) * FR
fala_fim = (np.where(~sil)[0][-1] + 1) * FR
keep, t = [], max(0.0, fala_ini - MARGEM)
removido = []
for a, b in spans:
    if b <= fala_ini or a >= fala_fim: continue
    if b - a < MIN_PAUSA: continue
    c0, c1 = a + MARGEM, b - MARGEM
    if c1 - c0 < 0.05: continue
    keep.append((t, c0)); removido.append((round(c0, 2), round(c1, 2))); t = c1
keep.append((t, min(len(x) / SR, fala_fim + CAUDA)))
# monta com crossfade de 15 ms
xf = int(0.015 * SR); parts = []
for k, (a, b) in enumerate(keep):
    seg = x[int(a * SR):int(b * SR)].copy()
    if k > 0: seg[:xf] *= np.linspace(0, 1, xf)
    if k < len(keep) - 1: seg[-xf:] *= np.linspace(1, 0, xf)
    parts.append(seg)
y = parts[0]
for s in parts[1:]:
    y = np.concatenate([y[:-xf], y[-xf:] + s[:xf], s[xf:]])
pcm = (np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes()
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-", out], input=pcm, check=True)
json.dump({"keeps": keep, "removido": removido, "limiar_db": round(float(lim), 1), "margem": MARGEM, "min_pausa": MIN_PAUSA},
          open(out.rsplit(".", 1)[0] + "-mapa.json", "w"), indent=1)
print(f"{len(x)/SR:.2f}s → {len(y)/SR:.2f}s · {len(removido)} pausas encurtadas · limiar {lim:.1f} dB · margem {MARGEM}s")
