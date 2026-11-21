#!/usr/bin/env bash
# preparar-voz.sh — da narração do cliente até o motor sincronizado (rode na pasta do motor: <P>/motor).
# uso: bash ferramentas/preparar-voz.sh <audio da narração> <roteiro.txt> ["prompt de nomes próprios"]
#  1. corte SEGURO: só encurta pausas de silêncio, nunca toca na fala (→ ../corte/voz.wav)
#  2. transcrição palavra por palavra (faster-whisper medium) → ../corte/palavras-whisper.json
#  3. alinhamento ao roteiro (texto da legenda) → ../preparo/palavras.json
#  4. preparar.sh com um fundo preto do tamanho da voz (a biblioteca cobre o quadro com o fundo dela)
#  5. face-track FIXO (sem apresentador: a legenda fica parada em ~y 1190, como no reel "Saída Fiscal")
set -euo pipefail
AUDIO="$1"; ROTEIRO="$2"; PROMPT="${3:-Resultax Internacional, Receita Federal, Saída Definitiva do País, link da bio, diagnóstico.}"
M="$(cd "$(dirname "$0")/.." && pwd)"; cd "$M"; P="$(cd .. && pwd)"
mkdir -p "$P/corte" "$P/preparo" "$P/bruto"
python3 ferramentas/corte-seguro.py "$AUDIO" "$P/corte/voz.wav"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$P/corte/voz.wav")
ffmpeg -v error -y -f lavfi -i "color=c=black:s=1080x1920:r=30" -t "$DUR" -c:v libx264 -preset veryfast -pix_fmt yuv420p "$P/bruto/fundo-preto.mp4"
HF_HUB_DISABLE_XET=1 python3 -I ferramentas/transcrever.py "$P/corte/voz.wav" "$P/corte/palavras-whisper.json" --prompt "$PROMPT"
python3 ferramentas/alinhar-roteiro.py "$P/corte/palavras-whisper.json" "$ROTEIRO" "$P/preparo/palavras.json"
[[ -e node_modules ]] || npm install --no-audit --no-fund --ignore-scripts   # --ignore-scripts: o onnxruntime-node falha ao baixar atrás do proxy
[[ -f assets/transcript-whisper.json ]] && mv assets/transcript-whisper.json "assets/transcript-whisper.$(date +%s).bak"
bash preparar.sh --video "$P/bruto/fundo-preto.mp4" --audio "$P/corte/voz.wav" --palavras "$P/preparo/palavras.json"
python3 - <<'PY'
import json
d = json.load(open("assets/transcript.json")); dur = d["audio_duration_secs"]; n = int(dur * 30) + 3
json.dump({"fps": 30.0, "w": 1080, "h": 1920, "cols": ["t", "mx", "my", "mw", "chin", "top", "x0", "x1"],
           "rows": [[round(i / 30, 3), 540.0, 1100.0, 160.0, 1150.0, 600.0, 300.0, 780.0] for i in range(n)]}, open("assets/face-track.json", "w"))
print(f"face-track fixo · {dur:.2f} s · última palavra termina em {d['words'][-1]['end']:.2f} s")
PY
node montar.mjs
echo "pronto: escreva src/beats.js (cenas) e confira com: npx hyperframes snapshot --at <tempos> --no-end -o snaps"
