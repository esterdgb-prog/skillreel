#!/usr/bin/env python3
"""mixar-sfx.py — mixa os efeitos sonoros do kit no áudio do render (o hyperframes não mixa os <audio> que o kit cria
em tempo de execução: sem este passo o vídeo sai SEM efeito nenhum, só com a voz).

Uso (na pasta do motor, depois do render e do `node ferramentas/sons.mjs`):
  python3 ferramentas/mixar-sfx.py ../render/_reel-bruto.mp4 ../sons.json ../render/_reel-sfx.mp4
  bash ferramentas/audio-final-vsl.sh ../render/_reel-sfx.mp4 ../render/reel-vN.mp4

Lê ../sons.json ({"efeitos":[{"t","arquivo","volume"}]}, exatamente o que a página agendou, já com o filtro
"enxuto" e o volume final de cada efeito) e os arquivos de assets/sfx/. A imagem não é recodificada (-c:v copy).
No fim mede o que entrou: energia da diferença (mixado − original) na janela de cada efeito — tem de ficar bem
acima do ruído de fundo, senão o efeito não existe para quem assiste.
"""
import json, os, subprocess, sys, tempfile, wave
import numpy as np


def ler_wav(p):
    w = wave.open(p)
    x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
    return x.reshape(-1, w.getnchannels()).mean(axis=1), w.getframerate()


def main():
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    vin, sons, vout = sys.argv[1:4]
    sfxdir = sys.argv[4] if len(sys.argv) > 4 else "assets/sfx"
    ef = json.load(open(sons))["efeitos"]
    if not ef:
        sys.exit("sons.json sem efeitos — nada a mixar")
    args = ["ffmpeg", "-v", "error", "-y", "-i", vin]
    fc = []
    for i, e in enumerate(ef, 1):
        f = os.path.join(sfxdir, e["arquivo"])
        if not os.path.exists(f):
            sys.exit(f"falta {f}")
        args += ["-i", f]
        ms = int(round(e["t"] * 1000))
        fc.append(f"[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={e['volume']:.4f},adelay={ms}|{ms}[s{i}]")
    fc.append("[0:a]aformat=sample_rates=48000:channel_layouts=stereo[v]")
    fc.append("[v]" + "".join(f"[s{i}]" for i in range(1, len(ef) + 1)) +
              f"amix=inputs={len(ef) + 1}:duration=first:dropout_transition=0:normalize=0[a]")
    args += ["-filter_complex", ";".join(fc), "-map", "0:v", "-map", "[a]", "-c:v", "copy",
             "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", vout]
    subprocess.run(args, check=True)

    # conferência: o efeito está mesmo no arquivo?
    with tempfile.TemporaryDirectory() as tmp:
        a, b = os.path.join(tmp, "a.wav"), os.path.join(tmp, "b.wav")
        for src, dst in ((vin, a), (vout, b)):
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vn", "-ac", "1", "-ar", "48000", dst], check=True)
        x, sr = ler_wav(a)
        y, _ = ler_wav(b)
    m = min(len(x), len(y))
    r = y[:m] - x[:m]
    db = lambda s: 20 * np.log10(np.sqrt(np.mean(s ** 2)) + 1e-9)
    fundo = db(r[: int(0.2 * sr)]) if ef[0]["t"] > 0.3 else -90
    linhas, fracos = [], 0
    for e in ef:
        j = r[int(e["t"] * sr): int((e["t"] + 0.25) * sr)]
        d = db(j)
        pk = 20 * np.log10(np.abs(j).max() + 1e-9)
        fracos += d < -45
        linhas.append(f"  {e['t']:6.2f} s  {e['arquivo']:12s} pico {pk:6.1f} dBFS · rms {d:6.1f} dB{'  ← FRACO' if d < -45 else ''}")
    print(f"{len(ef)} efeitos mixados → {vout}")
    print("\n".join(linhas))
    print(f"ruído de fundo da comparação ≈ {fundo:.1f} dB · {fracos} efeito(s) fraco(s)")
    if fracos:
        print("AVISO: efeito abaixo de −45 dB RMS não se ouve — suba o pico do arquivo (−4 a −11 dBFS) ou o sfxVol")


if __name__ == "__main__":
    main()
