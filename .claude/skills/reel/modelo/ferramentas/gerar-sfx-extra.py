#!/usr/bin/env python3
"""Regera modelo/sfx-extra/whoosh2.wav e impacto2.wav (efeitos aprovados em nov/2026, sem licença de terceiros).
Uso: python3 ferramentas/gerar-sfx-extra.py [pasta de saída]   (padrão: ../sfx-extra ao lado desta pasta)"""
import os, sys, wave
import numpy as np

SR = 48000
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "sfx-extra")


def salvar(nome, st):
    st = np.asarray(st, dtype=np.float64)
    if st.ndim == 1:
        st = np.stack([st, st], 1)
    with wave.open(os.path.join(OUT, nome), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(st, -1, 1) * 32767).astype(np.int16).tobytes())


def whoosh():
    n = int(SR * 0.5); t = np.arange(n) / SR
    x = np.random.default_rng(7).standard_normal(n)
    fc = np.interp(t, [0, 0.2, 0.5], [600, 3200, 900])          # a "passagem": o filtro sobe e desce
    y = np.zeros(n); low = band = 0.0; q = 1.3
    for i in range(n):                                          # passa-banda de estado variável, variando no tempo
        f = 2 * np.sin(np.pi * fc[i] / SR)
        low += f * band; high = x[i] - low - band / q; band += f * high; y[i] = band
    env = np.interp(t, [0, 0.17, 0.24, 0.5], [0, 1, 0.85, 0]) ** 1.6
    y = y * env + np.diff(np.concatenate([[0], x])) * 0.12 * env
    pan = np.interp(t, [0, 0.5], [0.25, 0.75])
    st = np.stack([y * np.cos(pan * np.pi / 2), y * np.sin(pan * np.pi / 2)], 1)
    st /= np.abs(st).max(); st *= 10 ** (-3 / 20)
    st[-480:] *= np.linspace(1, 0, 480)[:, None]
    salvar("whoosh2.wav", st)


def impacto():
    rng = np.random.default_rng(3); pre = 0.25; n = int(SR * 1.4); t = np.arange(n) / SR
    y = np.zeros(n); m = t < pre; sw = rng.standard_normal(m.sum()); low = 0.0; out = np.zeros_like(sw)
    for i in range(len(sw)):                                    # subida curta até o impacto (em 0,25 s)
        a = 0.02 + 0.25 * (i / len(sw)); low += a * (sw[i] - low); out[i] = low
    y[m] += out * np.linspace(0, 1, m.sum()) ** 2.2 * 0.5
    ti = np.clip(t - pre, 0, None); h = t >= pre
    f = 38 + 72 * np.exp(-ti * 9)
    y += h * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-ti * 3.2)          # pancada grave 110 → 38 Hz
    y += h * np.sin(2 * np.pi * 180 * ti) * np.exp(-ti * 28) * 0.45                # corpo
    cr = np.diff(np.concatenate([[0], rng.standard_normal(n)]))
    y += h * cr * np.exp(-ti * 90) * 0.35                                         # estalo de ataque
    tail = rng.standard_normal(n); lo = 0.0; tl = np.zeros(n)
    for i in range(n):
        lo += 0.01 * (tail[i] - lo); tl[i] = lo
    y += h * tl * np.exp(-ti * 4) * 2.0                                           # cauda grave
    y = np.tanh(y * 1.6); y /= np.abs(y).max(); y *= 10 ** (-1 / 20)
    y[-2400:] *= np.linspace(1, 0, 2400)
    salvar("impacto2.wav", y)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True); whoosh(); impacto(); print("ok →", os.path.abspath(OUT))
