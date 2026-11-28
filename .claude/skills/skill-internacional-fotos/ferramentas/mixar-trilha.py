#!/usr/bin/env python3
"""mixar-trilha.py — põe a música de fundo por baixo da voz + efeitos, com o volume certo e ducking CONTROLADO
(a música abaixa exatamente --duck dB enquanto há fala, com transição suave). Rode DEPOIS do mixar-sfx.py e ANTES do
audio-final-vsl.sh. No fim MEDE a música no arquivo (mix − mix sem música) e imprime quantos LU ela ficou abaixo da voz.

Uso:  python3 mixar-trilha.py <render com voz+efeitos .mp4> <voz só .mp4> <musica.wav> <saida.mp4> [--abaixo 18] [--duck 5]

--abaixo: LU da música abaixo da voz nas pausas, medidos acima de 400 Hz (a faixa do celular; padrão 18). Com --duck 5, fica ~23 LU abaixo enquanto alguém fala.
          Faixa segura: 16–23. A cliente pediu cuidado com a altura, mas inaudível também não serve.
Lição do Reel 61: o sidechaincompress do ffmpeg abaixava a música 17 dB (ela sumia, −37 LU). Por isso o ducking é
calculado aqui, pela energia da voz, e não por compressor.
"""
import argparse
import json
import re
import subprocess

import numpy as np

SR = 48000


def lufs(path, extra=None):
    # medido ACIMA DE 400 Hz: é o que a caixinha do celular toca (grave não conta para "dá para ouvir")
    cmd = ["ffmpeg", "-hide_banner", "-nostats", "-i", path] + (extra or []) + ["-af", "highpass=f=400:poles=2,loudnorm=print_format=json", "-f", "null", "-"]
    r = subprocess.run(cmd, capture_output=True, text=True).stderr
    return float(json.loads(re.findall(r"\{[^{}]*\}", r, re.S)[-1])["input_i"])


def ler(path, ch):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vn", "-ac", str(ch), "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, ch).copy()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("mix"); ap.add_argument("voz"); ap.add_argument("musica"); ap.add_argument("saida")
    ap.add_argument("--abaixo", type=float, default=18); ap.add_argument("--duck", type=float, default=5)
    a = ap.parse_args()
    abaixo = min(max(a.abaixo, 16), 26)
    v_lufs, m_lufs = lufs(a.voz, ["-vn"]), lufs(a.musica)
    ganho = 10 ** (((v_lufs - abaixo) - m_lufs) / 20)

    voz = ler(a.voz, 1)[:, 0]; mus = ler(a.musica, 2)
    n = len(voz); mus = np.pad(mus, ((0, max(0, n - len(mus))), (0, 0)))[:n] * ganho
    # voz ativa: RMS em janelas de 20 ms acima de (mediana da fala − 15 dB)
    W = int(0.02 * SR); k = n // W
    rms = np.sqrt(np.mean(voz[:k * W].reshape(k, W) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(rms); fala = np.median(db[db > db.max() - 40])
    ativo = (db > fala - 15).astype(float)
    # suavização: ataque 80 ms, liberação 400 ms
    env = np.zeros(k); e = 0.0
    aa, ar = np.exp(-0.02 / 0.08), np.exp(-0.02 / 0.4)
    for i, x in enumerate(ativo):
        c = aa if x > e else ar
        e = c * e + (1 - c) * x; env[i] = e
    g = 10 ** (-a.duck * env / 20)
    g = np.interp(np.arange(n), np.arange(k) * W + W / 2, g)
    mus *= g[:, None]
    tmp = a.saida + ".musica.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", tmp],
                   input=mus.astype(np.float32).tobytes(), check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.mix, "-i", tmp, "-filter_complex",
                    "[0:a]aresample=48000[x];[x][1:a]amix=inputs=2:normalize=0:duration=first[a]",
                    "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-ar", "48000", a.saida],
                   check=True)
    real = lufs(tmp)
    print(f"voz {v_lufs:.1f} LUFS · música no arquivo {real:.1f} LUFS → {v_lufs - real:.1f} LU abaixo da voz "
          f"({abaixo:.0f} nas pausas, +{a.duck:g} dB de ducking na fala) → {a.saida}")


if __name__ == "__main__":
    main()
