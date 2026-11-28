#!/usr/bin/env python3
"""mixar-trilha.py — põe a música de fundo por baixo da voz + efeitos, com o volume certo e ducking (a música abaixa
sozinha quando há fala). Rode DEPOIS do mixar-sfx.py e ANTES do audio-final-vsl.sh.

Uso:  python3 mixar-trilha.py <render com voz+efeitos .mp4> <voz só .mp4> <musica.wav> <saida.mp4> [--abaixo 20]

--abaixo: quantos LU a música fica abaixo da voz (loudness integrado, antes do ducking). Padrão 20 → "dá para sentir,
não disputa". Com o ducking (~5 dB a mais enquanto há fala), a música fica ~25 dB abaixo da voz quando alguém fala.
Nunca menos de 16 (a cliente pediu cuidado com a altura).
"""
import argparse
import json
import re
import subprocess


def lufs(path, extra=None):
    cmd = ["ffmpeg", "-hide_banner", "-nostats", "-i", path]
    if extra:
        cmd += extra
    cmd += ["-af", "loudnorm=print_format=json", "-f", "null", "-"]
    r = subprocess.run(cmd, capture_output=True, text=True).stderr
    return float(json.loads(re.findall(r"\{[^{}]*\}", r, re.S)[-1])["input_i"])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("mix"); ap.add_argument("voz"); ap.add_argument("musica"); ap.add_argument("saida")
    ap.add_argument("--abaixo", type=float, default=20)
    a = ap.parse_args()
    v, m = lufs(a.voz, ["-vn"]), lufs(a.musica)
    ganho = (v - max(a.abaixo, 16)) - m
    fc = (f"[2:a]aresample=48000,volume={ganho:.2f}dB[m];"
          f"[1:a]aresample=48000,asplit=1[sc];"
          f"[m][sc]sidechaincompress=threshold=0.02:ratio=4:attack=30:release=450:makeup=1[md];"
          f"[0:a]aresample=48000[vx];[vx][md]amix=inputs=2:normalize=0:duration=first[a]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.mix, "-i", a.voz, "-i", a.musica, "-filter_complex", fc,
                    "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-ar", "48000", a.saida],
                   check=True)
    print(f"voz {v:.1f} LUFS · música {m:.1f} → ganho {ganho:+.1f} dB (≈ {max(a.abaixo, 16):.0f} LU abaixo da voz, "
          f"+ ducking na fala) → {a.saida}")


if __name__ == "__main__":
    main()
