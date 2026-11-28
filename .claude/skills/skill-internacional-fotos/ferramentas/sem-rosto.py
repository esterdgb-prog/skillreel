#!/usr/bin/env python3
"""sem-rosto.py — aplica no motor de um reel da Resultax Internacional tudo o que o Reel 65 (aprovado) precisou,
logo depois do `bash preparar.sh`. Rode dentro de <projeto>/motor:

    python3 ../../.claude/skills/skill-internacional-fotos/ferramentas/sem-rosto.py   (ou o caminho da skill)

Faz, sem perguntar:
1. Rastreio de boca FIXO (x 540, queixo 1130): a legenda fica centralizada no terço de baixo. O rastreio real
   acharia rostos nas cenas de banco e a legenda pularia de um lado para o outro. O real fica em
   assets/face-track-mediapipe.json.
2. vsl.json: enquadramento de cena de banco (fullPos 50% 50%, splitPos/pipPos 50% 45%, head/face de tela inteira) e
   trilha de efeitos manual ("sfxModo": "manual", "sfxVol": 1 — o volume vem da trilha desenhada no beats.js).
3. Pele preta e dourada da logo → ../pele-resolvida.json.
4. Logo transparente → assets/img/resultax-logo.png (e ../assets/oficiais/).
5. Paleta de 18 sons para celular → sfx-projeto/ (substitui os do kit) e volumes calibrados em sfx-projeto/volumes.json.
6. Transcript: "Result Tax"/"ResultTax"/"Resulttax" → "Resultax"; "Bill"/"Bil" → "Bio"; "Receita federal" → "Receita Federal".
   O original continua em assets/transcript-whisper.json. Confira o resto à mão (R6).
"""
import json
import os
import re
import shutil
import sys

SK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def rastreio_fixo():
    p = "assets/face-track.json"
    if not os.path.exists(p):
        print("sem assets/face-track.json — rode o preparar.sh antes"); sys.exit(1)
    d = json.load(open(p))
    if "_nota" not in d:
        shutil.copy(p, "assets/face-track-mediapipe.json")
    t_ = json.load(open("assets/transcript.json")); dur = t_.get("audio_duration_secs") or t_.get("duration") or (d["rows"][-1][0] if d.get("rows") else 60)
    n = int(float(dur) * 30) + 30
    base = [540.0, 1060.0, 160.0, 1130.0, 900.0, 380.0, 700.0]
    d["rows"] = [[round(i / 30, 3)] + base[: len(d["cols"]) - 1] for i in range(n)]
    d["_nota"] = "reel sem rosto: rastreio fixo (legenda centralizada); o de verdade está em face-track-mediapipe.json"
    json.dump(d, open(p, "w"))
    print(f"rastreio fixo: {n} linhas")


def vsl():
    v = json.load(open("vsl.json"))
    v.update({"fullPos": "50% 50%", "splitPos": "50% 45%", "pipPos": "50% 45%", "head": {"x": 540, "y": 420},
              "face": {"x": 290, "y": 700, "w": 500, "h": 560}, "sfxModo": "manual", "sfxVol": 1,
              "_semRosto": "reel sem apresentador: a câmera é a montagem de cenas do Pixabay (../assets/montagem.json); "
                           "rastreio da boca fixo em x 540 para a legenda; trilha de efeitos desenhada à mão no beats.js"})
    v.pop("sfxAlvo", None)
    json.dump(v, open("vsl.json", "w"), ensure_ascii=False, indent=2)
    print("vsl.json: enquadramento de cena + sfxModo manual")


def marca():
    shutil.copy(os.path.join(SK, "marca", "pele-resolvida.json"), "../pele-resolvida.json")
    os.makedirs("assets/img", exist_ok=True); os.makedirs("../assets/oficiais", exist_ok=True)
    for dst in ("assets/img/resultax-logo.png", "../assets/oficiais/resultax-logo.png"):
        shutil.copy(os.path.join(SK, "marca", "resultax-logo.png"), dst)
    src = "../assets/SOURCES.md"
    s = open(src).read() if os.path.exists(src) else "# Fontes\n"
    if "resultax-logo.png" not in s:
        s += ("\n## Marca\n| arquivo | origem |\n|---|---|\n| `resultax-logo.png` | logo oficial da Resultax Internacional "
              "enviada pela cliente (skill-internacional-fotos/marca/) |\n")
        open(src, "w").write(s)
    print("pele preta e dourada + logo")


def sons():
    os.makedirs("sfx-projeto", exist_ok=True)
    for f in os.listdir(os.path.join(SK, "sons")):
        if f.endswith((".wav", ".json")):
            shutil.copy(os.path.join(SK, "sons", f), os.path.join("sfx-projeto", f))
    print("sfx-projeto: 18 sons + volumes.json")


def transcript():
    p = "assets/transcript.json"
    d = json.load(open(p)); W = d["words"]; out = []; fixes = []; i = 0
    while i < len(W):
        w = W[i]; t = w["text"]
        if re.match(r"^Result$", t.strip(), re.I) and i + 1 < len(W) and re.match(r"^tax", W[i + 1]["text"], re.I):
            tail = re.sub(r"^tax", "", W[i + 1]["text"], flags=re.I)
            out.append({"text": "Resultax" + tail, "start": w["start"], "end": W[i + 1]["end"]}); fixes.append("Result Tax→Resultax"); i += 2; continue
        m = re.match(r"^(Result+ax|ResultTax|Resulttax|Resultaks|Resultex)(\W*)$", t, re.I)
        if m and m.group(1) != "Resultax":
            out.append(dict(w, text="Resultax" + m.group(2))); fixes.append(f"{t}→Resultax"); i += 1; continue
        m = re.match(r"^(Bill|Bil|Biu|Byo)(\W*)$", t)
        if m and i > 0 and W[i - 1]["text"].lower().strip(".,") == "da":
            out.append(dict(w, text="Bio" + m.group(2))); fixes.append(f"{t}→Bio"); i += 1; continue
        if t.lower().startswith("federal") and out and out[-1]["text"].lower() == "receita" and t[0] == "f":
            out.append(dict(w, text="F" + t[1:])); fixes.append("federal→Federal"); i += 1; continue
        out.append(w); i += 1
    d["words"] = out
    json.dump(d, open(p, "w"), ensure_ascii=False)
    print("transcript:", ", ".join(fixes) if fixes else "nada a corrigir automaticamente")


if __name__ == "__main__":
    rastreio_fixo(); vsl(); marca(); sons(); transcript()
    print("pronto — agora: corrija o resto do transcript à mão, escreva src/beats.js a partir de exemplo/beats-reel65.js")
