#!/usr/bin/env python3
"""montar-camera.py — monta a "câmera" de um reel sem rosto: as cenas do Pixabay em sequência, cada uma cortada
exatamente numa virada de frase, com a narração já cortada por baixo.

Uso (na pasta do projeto reel-<slug>/):
    python3 montar-camera.py assets/montagem.json

assets/montagem.json:
    {"cortes": [0, 2.45, 4.41, ..., <duração do corte>],      # N+1 tempos (s) no áudio CORTADO (corte/corte.wav)
     "clipes": ["assets/banco/px-228563-c01.mp4", ...]}       # N clipes 1080×1920 (pixabay.py baixar --vertical)
    Sem "clipes", usa assets/banco/px-*-cNN.mp4 em ordem de NN. O último corte pode ser "fim" (= duração do corte.wav).

Sai: corte/clean-916.mp4 (1080×1920, 30 fps, GOP de 1 s — sem keyframe a cada 1 s o render congela quadros),
que o preparar.sh do motor usa como câmera. Clipe mais curto que o trecho → avisa (congelaria no último quadro).
"""
import glob
import json
import subprocess
import sys


def dur(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p],
                       capture_output=True, text=True)
    return float(r.stdout.strip())


def main():
    cfg_path = sys.argv[1] if len(sys.argv) > 1 else "assets/montagem.json"
    m = json.load(open(cfg_path))
    total = dur("corte/corte.wav")
    b = [total if (x == "fim") else float(x) for x in m["cortes"]]
    b[-1] = total  # o último trecho vai até o fim da narração
    import os
    clips = m.get("clipes") if m.get("clipes") and all(os.path.exists(c) for c in m["clipes"]) else sorted(glob.glob("assets/banco/px-*-c*.mp4"), key=lambda f: int(f.rsplit("-c", 1)[-1][:-4]))
    assert len(clips) == len(b) - 1, f"{len(clips)} clipes para {len(b) - 1} trechos"
    args, fc = ["ffmpeg", "-v", "error", "-y"], []
    for i, c in enumerate(clips):
        d = b[i + 1] - b[i]
        dc = dur(c)
        if dc + 0.02 < d:
            print(f"AVISO: {c} tem {dc:.2f} s e o trecho {i + 1} pede {d:.2f} s (baixe com --ate maior)")
        args += ["-i", c]
        fc.append(f"[{i}:v]trim=0:{d:.4f},setpts=PTS-STARTPTS,fps=30,format=yuv420p[v{i}]")
    n = len(clips)
    args += ["-i", "corte/corte.wav"]
    fc.append("".join(f"[v{i}]" for i in range(n)) + f"concat=n={n}:v=1:a=0[v]")
    args += ["-filter_complex", ";".join(fc), "-map", "[v]", "-map", f"{n}:a", "-c:v", "libx264", "-crf", "17",
             "-preset", "medium", "-g", "30", "-keyint_min", "30", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
             "-ar", "48000", "-t", f"{total:.3f}", "-movflags", "+faststart", "corte/clean-916.mp4"]
    subprocess.run(args, check=True)
    m["cortes"], m["clipes"] = [round(x, 3) for x in b], clips
    json.dump(m, open(cfg_path, "w"), indent=1)
    print(f"corte/clean-916.mp4 · {n} cenas · {total:.2f} s · cortes {[round(x, 2) for x in b]}")


if __name__ == "__main__":
    main()
