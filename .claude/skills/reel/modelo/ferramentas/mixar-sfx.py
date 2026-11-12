#!/usr/bin/env python3
"""Mixa os efeitos sonoros no áudio do render. OBRIGATÓRIO: o hyperframes NÃO renderiza os <audio> que o kit cria em
runtime (K.sfx) — o render sai só com a voz (confirmado em nov/2026: áudio do render idêntico com e sem efeitos).
Rode na pasta do motor, depois de `node ferramentas/sons.mjs` (que escreve ../sons.json):
    python3 ferramentas/mixar-sfx.py ../render/_reel-bruto.mp4 ../sons.json assets/sfx ../render/_reel-mix.mp4 [--com-glitch]
e depois `bash ferramentas/audio-final-vsl.sh ../render/_reel-mix.mp4 ../render/reel-vN.mp4`.
Escreve ../render/sons-mixados.json (para o verificar.py --sfx).

Regras aprovadas (nov/2026):
- toda troca de layout (o 'swoosh' do kit marca as trocas; o swoosh.wav do kit é praticamente mudo) → whoosh2.wav;
  mais um whoosh na entrada do gancho; whoosh de painel/leak colado numa troca (< 0,6 s) sai;
- toda entrada de logo (LOGO_CANTO → 'impacto2') → impacto2.wav, o efeito mais forte do vídeo;
- glitch e boom do gancho saem por padrão ("som de erro", reprovado) — --com-glitch mantém;
- nível RELATIVO À VOZ: RMS de cada efeito em relação ao RMS da fala do render (a voz muda de gravação para gravação;
  níveis absolutos deixaram os efeitos 20 dB abaixo da voz numa gravação alta). Transição ≈ −4 dB da fala ("um pouco
  mais baixo" que −1 dB, que também foi aceito); pops pequenos a < 0,5 s de outro efeito saem."""
import json, os, subprocess, sys

args = [a for a in sys.argv[1:] if not a.startswith("--")]
if len(args) < 4:
    sys.exit(__doc__)
video, sons, sfxdir, out = args[:4]
COM_GLITCH = "--com-glitch" in sys.argv
ALVO = {"logo": -1.5, "troca": -4, "painel": -10, "stamp": -8, "ding": -10, "pop": -12, "shimmer": -12, "clique": -8, "glitch": -8, "boom": -6}
ARQ = {"logo": "impacto2", "troca": "whoosh2", "painel": "whoosh2", "stamp": "stamp", "ding": "ding", "pop": "pop",
       "shimmer": "shimmer", "clique": "click", "glitch": "glitch", "boom": "boom"}
PRE = {"whoosh2": 0.17, "impacto2": 0.25}     # o pico do whoosh / a pancada do impacto caem no instante do evento


def rms(f, extra=()):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", f, *extra, "-af",
                        "silenceremove=stop_periods=-1:stop_threshold=-45dB,volumedetect", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    return float(r.split("mean_volume:")[1].split("dB")[0])


ef = sorted(json.load(open(sons))["efeitos"], key=lambda e: e["t"])
trocas = [e["t"] for e in ef if e["arquivo"] == "swoosh.wav"]
logos = [e["t"] for e in ef if e["arquivo"] == "impacto2.wav"]
lista = []
for e in ef:
    n = e["arquivo"].replace(".wav", "")
    if n == "impacto2": tipo = "logo"
    elif n == "swoosh": tipo = "troca"
    elif n in ("whoosh", "transicao"):
        if any(abs(e["t"] - t) < 0.6 for t in trocas + logos): continue
        tipo = "painel"
    elif n == "click": tipo = "clique"
    elif n in ("glitch", "boom"):
        if not COM_GLITCH: continue
        tipo = n
    elif n in ALVO: tipo = n
    else: continue                                   # type/tick/riser e outros
    if lista and tipo in ("pop", "shimmer") and e["t"] - lista[-1][0] < 0.5: continue
    lista.append((e["t"], tipo))
glitch = [e["t"] for e in ef if e["arquivo"] == "glitch.wav"]
if glitch and not any(abs(t - glitch[0]) < 0.3 for t, _ in lista):
    lista.append((glitch[0], "troca"))                # entrada do gancho: um whoosh no lugar do glitch
lista.sort()
pk = {a: rms(os.path.join(sfxdir, a + ".wav")) for a in {ARQ[t] for _, t in lista}}
VOZ = rms(video, ("-map", "0:a"))
cmd = ["ffmpeg", "-v", "error", "-y", "-i", video]; fc = []
for i, (t, tipo) in enumerate(lista, start=1):
    a = ARQ[tipo]; cmd += ["-i", os.path.join(sfxdir, a + ".wav")]
    g = 10 ** ((VOZ + ALVO[tipo] - pk[a]) / 20); ms = int(round(max(0, t - PRE.get(a, 0)) * 1000))
    fc.append(f"[{i}:a]aresample=48000,aformat=channel_layouts=stereo,volume={g:.4f},adelay={ms}|{ms}[s{i}]")
fc.append("[0:a]aresample=48000,aformat=channel_layouts=stereo[v]")
fc.append("[v]" + "".join(f"[s{i}]" for i in range(1, len(lista) + 1)) + f"amix=inputs={len(lista) + 1}:normalize=0:duration=first[a]")
os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
tmp = out.rsplit(".", 1)[0] + ".mov"
subprocess.run(cmd + ["-filter_complex", ";".join(fc), "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "pcm_s24le", tmp], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-c:v", "copy", "-c:a", "aac", "-b:a", "320k", out], check=True)
os.remove(tmp)
json.dump({"efeitos": [{"t": t, "arquivo": ARQ[tipo] + ".wav", "tipo": tipo} for t, tipo in lista]},
          open(os.path.join(os.path.dirname(os.path.abspath(out)), "sons-mixados.json"), "w"), indent=1)
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video], capture_output=True, text=True).stdout)
print(f"voz {VOZ:.1f} dB RMS · {len(lista)} efeitos mixados ({len(lista) / dur:.2f}/s) → {out}")
