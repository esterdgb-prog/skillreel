#!/usr/bin/env bash
# Masteriza o áudio (−14 LUFS, pico ≤ −1 dBTP) e junta com o vídeo sem recodificar a imagem.
# Uso: bash scripts/finalizar.sh render/_video.mp4 audio/mix-bruto.wav render/reel-v1.mp4
set -euo pipefail
V="$1"; A="$2"; OUT="$3"
J=$(ffmpeg -hide_banner -nostats -i "$A" -af "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | python3 -c "import sys,json;print(json.load(sys.stdin)['$1'])"; }
F="loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true"
ffmpeg -v error -y -i "$V" -i "$A" -map 0:v -map 1:a -c:v copy -af "$F,alimiter=limit=0.89:level=false" -ar 48000 -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT"
ffmpeg -hide_banner -nostats -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)"
