#!/usr/bin/env python3
"""Mixa os efeitos sonoros do kit direto na voz.

O kit cria os <audio> dos efeitos em tempo de execução, e o renderizador só lê os áudios que já estão no HTML
estático — por isso os efeitos não saíam no vídeo. Aqui eles entram por fora: cada efeito de ../sons.json
(t, arquivo, volume) é somado à voz no tempo exato, com o volume do kit × GANHO.

uso: mixar-sfx.py voz.wav sons.json pasta-sfx saida.wav [--ganho-db 0]
Imprime o nível de cada tipo de efeito contra a voz no mesmo trecho (RMS).
"""
import sys, json, subprocess, collections, numpy as np
a = sys.argv[1:]
voz, sons, pasta, out = a[:4]
G = 10 ** ((float(a[a.index("--ganho-db") + 1]) if "--ganho-db" in a else 0.0) / 20)
SR = 48000
ld = lambda f: np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout, np.float32).copy()
v = ld(voz); fx = np.zeros_like(v); cache = {}
ev = json.load(open(sons))["efeitos"]
stat = collections.defaultdict(list)
for e in ev:
    s = cache.setdefault(e["arquivo"], ld(f"{pasta}/{e['arquivo']}"))
    i = int(e["t"] * SR); j = min(len(v), i + len(s))
    if i >= len(v): continue
    seg = s[:j - i] * e["volume"] * G
    fx[i:j] += seg
    act = np.abs(seg) > 1e-3
    if act.any():
        rf = np.sqrt(np.mean(seg[act] ** 2)); rv = np.sqrt(np.mean(v[i:j][act] ** 2)) + 1e-9
        stat[e["arquivo"]].append(20 * np.log10(rf / rv))
y = v + fx
pk = np.max(np.abs(y))
if pk > 0.99: y = y / pk * 0.99
pcm = (y * 32767).astype(np.int16).tobytes()
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-", out], input=pcm, check=True)
print(f"{len(ev)} efeitos mixados · ganho {20*np.log10(G):+.1f} dB")
for k, l in sorted(stat.items()): print(f"  {k:12s} ×{len(l):2d}  efeito vs voz {np.median(l):+6.1f} dB")
