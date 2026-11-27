#!/usr/bin/env bash
# Renderiza a versão 2: legendas (legenda-v2.ass) + luz de transição nos cortes de cena (8,0 s e 17,7 s).
set -euo pipefail
cd "$(dirname "$0")"
python3 legendar_v2.py words.json legenda-v2.ass
ffmpeg -v error -y -i ../bruto/video.mp4 \
 -loop 1 -t 0.75 -i luz.png -loop 1 -t 0.75 -i luz.png \
 -filter_complex "[0:v]scale=1080:1920:flags=lanczos,format=yuv420p[v];\
[1:v]format=rgba,fade=in:st=0:d=0.3:alpha=1,fade=out:st=0.32:d=0.43:alpha=1,setpts=PTS+7.70/TB[l1];\
[2:v]format=rgba,fade=in:st=0:d=0.3:alpha=1,fade=out:st=0.32:d=0.43:alpha=1,setpts=PTS+17.43/TB[l2];\
[v][l1]overlay=eof_action=pass[v1];[v1][l2]overlay=eof_action=pass[v2];\
[v2]subtitles=legenda-v2.ass:fontsdir=fontes[out]" -map "[out]" -map 0:a \
 -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a copy -movflags +faststart video-legendado-v2.mp4
