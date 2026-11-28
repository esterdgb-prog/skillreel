#!/usr/bin/env python3
"""paleta-sfx.py — 18 efeitos limpos e curtos, na faixa que caixinha de celular reproduz (≥ 400 Hz), para uma trilha
de efeitos desenhada à mão. Gera os .wav na pasta atual (normalizados em −1 dBFS). Uso: cd motor/sfx-projeto && python3 ../ferramentas/paleta-sfx.py
Sopros (sobe/desce/curto) para trocas de cena; carimbo, impacto, pop1-3, tick, check, ding, moeda, brilho, erro, alerta, tictac, glitch, click.
"""
import wave
import numpy as np

SR = 48000
rng = np.random.default_rng(65)


def t_(d):
    return np.arange(int(d * SR)) / SR


def salvar(nome, x, pan=None):
    x = np.asarray(x, float)
    x = x - np.mean(x[: int(0.002 * SR)]) * 0
    fade = min(len(x), int(0.004 * SR))
    x[-fade:] *= np.linspace(1, 0, fade)
    x /= np.abs(x).max() + 1e-12
    x *= 10 ** (-1 / 20)
    if pan is None:
        L = R = x
    else:  # pan: curva de -1 (esq) a 1 (dir) ao longo do som
        p = np.interp(np.arange(len(x)), [0, len(x) - 1], pan)
        L, R = x * np.sqrt((1 - p) / 2), x * np.sqrt((1 + p) / 2)
        m = max(np.abs(L).max(), np.abs(R).max())
        L, R = L / m * 10 ** (-1 / 20), R / m * 10 ** (-1 / 20)
    s = (np.stack([L, R], 1) * 32767).astype(np.int16)
    with wave.open(f"{nome}.wav", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(s.tobytes())


def bandpass_varia(x, f, q):
    """filtro de estado variável com centro f[n] (Hz) variando no tempo → saída passa-faixa"""
    lo = bp = 0.0
    y = np.zeros_like(x)
    for n in range(len(x)):
        F = 2 * np.sin(np.pi * min(f[n], SR / 6) / SR)
        hi = x[n] - lo - bp / q
        bp += F * hi
        lo += F * bp
        y[n] = bp
    return y


def passa_alta(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); px = py = 0.0
    for n in range(len(x)):
        py = a * (py + x[n] - px); px = x[n]; y[n] = py
    return y


def env_ar(n, pico, curva=2.0):
    """envelope que sobe até `pico` (0–1 da duração) e desce, suave"""
    u = np.linspace(0, 1, n)
    up = np.clip(u / pico, 0, 1) ** curva
    dn = np.clip((1 - u) / (1 - pico), 0, 1) ** (curva * 0.8)
    return np.where(u < pico, up, dn)


# ---------------- sopros (trocas de cena): ar filtrado varrendo, sem grave, curto — nada de "vento"
def sopro(d, f0, f1, pico, q, pan):
    n = int(d * SR)
    x = rng.standard_normal(n)
    f = f0 * (f1 / f0) ** np.linspace(0, 1, n)
    y = bandpass_varia(x, f, q) + 0.35 * bandpass_varia(rng.standard_normal(n), f * 1.9, q * 1.4)
    y = passa_alta(y, 450)
    return y * env_ar(n, pico)


salvar("sopro-sobe", sopro(0.42, 650, 4200, 0.62, 1.6, [-0.6, 0.6]), pan=[-0.6, 0.6])
salvar("sopro-desce", sopro(0.40, 4200, 750, 0.38, 1.6, [0.6, -0.6]), pan=[0.6, -0.6])
salvar("sopro-curto", sopro(0.26, 1600, 5600, 0.45, 1.8, [0, 0]))

# ---------------- carimbo e impacto: estalo + "toc" médio (o que o celular reproduz) + corpo
t = t_(0.32)
corpo = np.sin(2 * np.pi * (180 * t - 120 * (1 - np.exp(-t / 0.05)) * 0.05 * 20)) * np.exp(-t * 32)
toc = np.sin(2 * np.pi * 900 * t) * np.exp(-t * 55) + 0.5 * np.sin(2 * np.pi * 1450 * t) * np.exp(-t * 70)
estalo = passa_alta(rng.standard_normal(len(t)), 1800) * np.exp(-t * 260)
papel = bandpass_varia(rng.standard_normal(len(t)), np.full(len(t), 2600.0), 1.2) * np.exp(-t * 28)
salvar("carimbo", 0.35 * corpo + 1.0 * toc + 1.0 * estalo + 0.6 * papel)

t = t_(0.6)
impacto = (0.4 * np.sin(2 * np.pi * (140 * t)) * np.exp(-t * 14) + 0.8 * np.sin(2 * np.pi * 620 * t) * np.exp(-t * 30)
           + 0.8 * passa_alta(rng.standard_normal(len(t)), 1500) * np.exp(-t * 120)
           + 0.35 * bandpass_varia(rng.standard_normal(len(t)), 3000 * np.exp(-t * 2.5), 0.9) * np.exp(-t * 9))
salvar("impacto", impacto)

# ---------------- entradas de elemento: "pop" em três alturas (sobem numa lista) e "tick"
for nome, f0 in (("pop1", 520), ("pop2", 660), ("pop3", 820)):
    t = t_(0.11)
    ph = 2 * np.pi * (f0 * t + f0 * 0.8 * t * t / 0.08)
    salvar(nome, np.sin(ph) * np.exp(-t * 48) + 0.25 * passa_alta(rng.standard_normal(len(t)), 3000) * np.exp(-t * 500))
t = t_(0.05)
salvar("tick", np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 240) + 0.3 * np.sin(2 * np.pi * 5200 * t) * np.exp(-t * 300))

# ---------------- positivos: check (duas notas que sobem), ding (sino), moeda (dois brilhos metálicos), brilho da logo
def sino(f, d, dec, parciais=((1, 1), (2.76, 0.35), (5.4, 0.12))):
    t = t_(d)
    return sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * dec * (1 + 0.6 * (k - 1))) for k, a in parciais)


t = t_(0.7)
check = sino(784, 0.7, 9)
check[int(0.085 * SR):] += 0.9 * sino(1175, 0.7 - 0.085, 9)[: len(check) - int(0.085 * SR)]
salvar("check", check)
salvar("ding", sino(1047, 1.1, 4.2))
moeda = sino(2093, 0.55, 14, ((1, 1), (3.1, 0.3)))
moeda[int(0.065 * SR):] += 0.8 * sino(2637, 0.55, 14, ((1, 1), (3.1, 0.3)))[: len(moeda) - int(0.065 * SR)]
salvar("moeda", moeda)
brilho = np.zeros(int(1.0 * SR))
for i, f in enumerate((2093, 2637, 3136, 3951, 4699)):
    k = int(i * 0.045 * SR); s = sino(f, 1.0, 7, ((1, 1), (2.0, 0.2)))[: len(brilho) - k] * (0.85 ** i)
    brilho[k:] += s
salvar("brilho", brilho, pan=[-0.4, 0.4])

# ---------------- negativos: erro (duas notas que descem), alerta (dois pulsos)
def nota(f, d):
    t = t_(d); e = np.minimum(1, t / 0.006) * np.minimum(1, (d - t) / 0.02)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 3 * f * t) + 0.12 * np.sin(2 * np.pi * 5 * f * t)) * e


salvar("erro", np.concatenate([nota(660, 0.09), np.zeros(int(0.03 * SR)), nota(440, 0.13)]))
salvar("alerta", np.concatenate([nota(880, 0.07), np.zeros(int(0.06 * SR)), nota(880, 0.07)]))

# ---------------- relógio (bomba/ampulheta): três tique-taques de madeira
tt = np.zeros(int(0.85 * SR))
for i, f in enumerate((3200, 2500, 3200)):
    t = t_(0.06); k = int(i * 0.27 * SR)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 300) + 0.6 * np.sin(2 * np.pi * 1200 * t) * np.exp(-t * 160)
    tt[k:k + len(s)] += s
salvar("tictac", tt)

# ---------------- abertura: gagueira digital limpa (bipes picotados, sem ruído) e clique do botão
g = np.concatenate([np.sin(2 * np.pi * f * t_(0.028)) * np.hanning(int(0.028 * SR)) for f in (1800, 1200, 2400, 900)]
                   + [np.zeros(int(0.01 * SR))])
g = np.round(g * 12) / 12  # leve "bitcrush" — digital, não ruidoso
salvar("glitch", g)
t = t_(0.04)
cl = np.sin(2 * np.pi * 2100 * t) * np.exp(-t * 420)
cl[int(0.006 * SR):] += 0.8 * (np.sin(2 * np.pi * 3500 * t) * np.exp(-t * 520))[: len(cl) - int(0.006 * SR)]
salvar("click", cl)
print("paleta gerada")
