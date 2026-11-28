#!/usr/bin/env python3
"""trilha-alerta.py — música de fundo original de ALERTA/tensão para os reels da Resultax (só numpy, sem banco de áudio:
a API do Pixabay não entrega música). Ré menor, 100 bpm: pad escuro (Dm–B♭–Gm–A), pulso de baixo em colcheias, tique de
relógio em semicolcheias, bumbo leve e um motivo de alerta (semitom lá–si♭) a cada 2 compassos. Entra cheia no
"drop" (a 1ª transição, onde vai o glitch) e resolve em Ré maior no CTA, com fade no fim.

Uso:  python3 trilha-alerta.py <duração s> <saída.wav> [--drop 1.61] [--cta 55.18] [--bpm 100]
Sai:  wav 48 kHz estéreo, pico −1 dBFS (o volume na mixagem é do mixar-trilha.py, não daqui).
"""
import argparse
import wave

import numpy as np

SR = 48000


def nota(n):  # nome → Hz (A4 = 440)
    tons = {"C": -9, "C#": -8, "D": -7, "D#": -6, "Eb": -6, "E": -5, "F": -4, "F#": -3, "G": -2, "G#": -1, "Ab": -1,
            "A": 0, "A#": 1, "Bb": 1, "B": 2}
    nome, oit = n[:-1], int(n[-1])
    return 440.0 * 2 ** ((tons[nome] + 12 * (oit - 4)) / 12)


def lowpass(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x); acc = 0.0
    # filtro de 1 polo, vetorizado por blocos via recursão simples (rápido o bastante para 60 s)
    for i in range(0, len(x), 4800):
        seg = x[i:i + 4800]
        out = np.empty_like(seg)
        for j, v in enumerate(seg):
            acc = (1 - a) * v + a * acc
            out[j] = acc
        y[i:i + 4800] = out
    return y


def saw(f, t, harm=10):
    s = np.zeros_like(t)
    for k in range(1, harm + 1):
        if f * k > 9000:
            break
        s += np.sin(2 * np.pi * f * k * t) / k
    return s


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("dur", type=float); ap.add_argument("saida")
    ap.add_argument("--drop", type=float, default=1.6); ap.add_argument("--cta", type=float, default=None)
    ap.add_argument("--bpm", type=float, default=100)
    a = ap.parse_args()
    dur, beat = a.dur, 60 / a.bpm
    bar, cta = 4 * beat, a.cta if a.cta else a.dur - 3
    n = int(dur * SR); t = np.arange(n) / SR
    L = np.zeros(n); R = np.zeros(n)

    # ---- pad: um acorde por compasso, com crossfade; detune L/R
    acordes = [["D3", "F3", "A3"], ["Bb2", "D3", "F3"], ["G2", "Bb2", "D3"], ["A2", "C#3", "E3"]]
    fim = ["D3", "F#3", "A3", "D4"]
    padL = np.zeros(n); padR = np.zeros(n)
    k, t0 = 0, 0.0
    while t0 < dur:
        t1 = min(dur, t0 + bar) if t0 + bar < cta else dur
        notas = fim if t0 >= cta - 1e-6 else acordes[k % 4]
        if t0 < cta < t0 + bar:  # corta o compasso no CTA para resolver ali
            t1 = cta
        i0, i1 = int(t0 * SR), int(min(dur, t1 + 0.25) * SR)
        tt = t[i0:i1] - t0
        env = np.minimum(1, tt / 0.25) * np.minimum(1, np.maximum(0, (t1 + 0.25 - t0 - tt)) / 0.25)
        for nn in notas:
            f = nota(nn)
            padL[i0:i1] += saw(f * 0.997, tt) * env
            padR[i0:i1] += saw(f * 1.003, tt) * env
        k += 1
        t0 = t1 if t1 > t0 else dur
    padL, padR = lowpass(padL, 1300), lowpass(padR, 1300)
    L += 0.16 * padL; R += 0.16 * padR

    # ---- baixo: colcheias na fundamental (com 2º e 3º harmônicos, para o celular ouvir), do drop ao CTA
    raizes = ["D2", "Bb1", "G1", "A1"]
    tb = a.drop
    while tb < cta - 0.01:
        idx = int((tb - a.drop) // bar) % 4
        f = nota(raizes[idx])
        i0 = int(tb * SR); m = int(0.28 * SR); tt = np.arange(min(m, n - i0)) / SR
        env = np.exp(-tt / 0.11) * np.minimum(1, tt / 0.004)
        s = (np.sin(2 * np.pi * f * tt) + 0.6 * np.sin(2 * np.pi * 2 * f * tt) + 0.35 * np.sin(2 * np.pi * 3 * f * tt)) * env
        acento = 1.0 if ((tb - a.drop) / (beat / 2)) % 2 < 0.5 else 0.7
        L[i0:i0 + len(s)] += 0.30 * acento * s; R[i0:i0 + len(s)] += 0.30 * acento * s
        tb += beat / 2

    # ---- bumbo leve nos tempos 1 e 3, do drop ao CTA
    tk = a.drop
    while tk < cta - 0.01:
        i0 = int(tk * SR); m = int(0.3 * SR); tt = np.arange(min(m, n - i0)) / SR
        f = 50 + 70 * np.exp(-tt / 0.03)
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.12)
        L[i0:i0 + len(s)] += 0.32 * s; R[i0:i0 + len(s)] += 0.32 * s
        tk += 2 * beat

    # ---- tique de relógio em semicolcheias (o "alerta" constante), a música inteira até o CTA
    tq = 0.0
    while tq < cta - 0.01:
        i0 = int(tq * SR); m = int(0.025 * SR); tt = np.arange(min(m, n - i0)) / SR
        forte = abs(((tq / beat) % 1)) < 1e-3
        f = 3400 if forte else 2700
        s = np.sin(2 * np.pi * f * tt) * np.exp(-tt / 0.006)
        g = 0.07 if forte else 0.035
        pan = 0.65 if int(round(tq / (beat / 4))) % 2 else 0.35
        L[i0:i0 + len(s)] += g * s * (1 - pan) * 2; R[i0:i0 + len(s)] += g * s * pan * 2
        tq += beat / 4

    # ---- motivo de alerta: lá4 → si♭4 (semitom), a cada 2 compassos depois do drop
    ta = a.drop + bar
    while ta < cta - bar / 2:
        for j, nn in enumerate(["A4", "Bb4"]):
            i0 = int((ta + j * beat) * SR); m = int(0.5 * SR); tt = np.arange(min(m, n - i0)) / SR
            f = nota(nn)
            s = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 3 * f * tt)) * np.exp(-tt / 0.18) * np.minimum(1, tt / 0.01)
            L[i0:i0 + len(s)] += 0.09 * s; R[i0:i0 + len(s)] += 0.09 * s
        ta += 2 * bar

    # ---- subida suave até o drop (seno de 220→660 Hz), sem ruído
    i1 = int(a.drop * SR); tt = t[:i1]
    f = 220 + 440 * (tt / max(a.drop, 0.01)) ** 2
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * (tt / max(a.drop, 0.01)) ** 2
    L[:i1] += 0.06 * s; R[:i1] += 0.06 * s

    # ---- fade-in 0,3 s, fade-out 1,8 s, pico −1 dBFS
    fade = np.ones(n); fi = int(0.3 * SR); fo = int(1.8 * SR)
    fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
    L *= fade; R *= fade
    pk = max(np.abs(L).max(), np.abs(R).max()); g = 10 ** (-1 / 20) / pk
    st = (np.stack([L, R], 1) * g * 32767).astype(np.int16)
    w = wave.open(a.saida, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes()); w.close()
    print(f"{a.saida} · {dur:.2f} s · drop {a.drop:.2f} s · CTA {cta:.2f} s · {a.bpm:g} bpm")


if __name__ == "__main__":
    main()
