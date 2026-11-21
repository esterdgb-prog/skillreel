#!/usr/bin/env bash
# finalizar.sh — render + efeitos + volume + conferência (rode na pasta do motor: <P>/motor).
# uso: bash ferramentas/finalizar.sh <N>      → ../render/reel-vN.mp4 e ../entrega/reel-vN.mp4
# Rode em segundo plano (o render de ~1 min de vídeo leva ~10 min).
set -euo pipefail
N="${1:?versão}"; M="$(cd "$(dirname "$0")/.." && pwd)"; cd "$M"; P="$(cd .. && pwd)"
mkdir -p "$P/render" "$P/entrega" "$P/qa"
CHROME="${CHROME:-$(ls -d /opt/pw-browsers/chromium-*/chrome-linux*/chrome 2>/dev/null | head -1)}"; export CHROME
node montar.mjs
npx hyperframes lint 2>&1 | grep "✗" && { echo "lint com erro"; exit 1; } || true
npx hyperframes render -q high -o "$P/render/_reel-bruto.mp4" > "$P/qa/render.log" 2>&1
# os efeitos nascem em tempo de execução e o renderizador NÃO os grava: lista e mixa por fora
node ferramentas/sons.mjs "$P/sons.json"
python3 ferramentas/mixar-sfx.py "$P/corte/voz.wav" "$P/sons.json" assets/sfx "$P/corte/voz-sfx.wav" ${SFX_GANHO_DB:+--ganho-db $SFX_GANHO_DB}
ffmpeg -v error -y -i "$P/render/_reel-bruto.mp4" -i "$P/corte/voz-sfx.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest "$P/render/_reel-sfx.mp4"
bash ferramentas/audio-final-vsl.sh "$P/render/_reel-sfx.mp4" "$P/render/reel-v$N.mp4"
bash ferramentas/folha.sh "$P/render/reel-v$N.mp4" "$P/qa/folha-final.png"
# conferência: nenhuma palavra comida (leia a transcrição inteira contra o roteiro)
HF_HUB_DISABLE_XET=1 python3 -I ferramentas/transcrever.py "$P/render/reel-v$N.mp4" "$P/qa/palavras-final.json"
ffmpeg -nostats -i "$P/render/reel-v$N.mp4" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2
cp "$P/render/reel-v$N.mp4" "$P/entrega/reel-v$N.mp4"
echo "entrega: $P/entrega/reel-v$N.mp4 · olhe $P/qa/folha-final.png"
