#!/usr/bin/env bash
# Recorta os clipes do Pixabay em 9:16 (1080x1920, 30 fps), com cor aproximada à do reel.
# Uso: bash scripts/clipes.sh <pasta_clipes_pixabay> clipes
set -euo pipefail
S="$1"; D="$2"; mkdir -p "$D"
SH="unsharp=5:5:0.6:5:5:0.0"
WARM="eq=brightness=-0.10:saturation=0.80:gamma=0.82,colorbalance=rs=0.04:gs=0.0:bs=-0.06:rm=0.03:bm=-0.04,vignette=PI/4.5"
cut() { # nome entrada inicio duracao largura_corte x_corte altura filtro_extra
  ffmpeg -v error -y -ss "$3" -t "$4" -i "$S/$2" -an -vf "fps=30,crop=$5:$7:$6:0,scale=1080:1920:flags=lanczos,$SH${8:+,$8}" \
    -c:v libx264 -crf 14 -preset medium -pix_fmt yuv420p "$D/$1.mp4"
}
cut martelo   martelo.mp4   0.0 2.4  607 697  1080
cut ampulheta ampulheta.mp4 1.5 3.0 1215 1563 2160
cut fogos     fogos.mp4     5.0 2.2  607 503  1080 "eq=saturation=0.9"
cut feira     feira.mp4     2.0 2.2  607 656  1080 "eq=brightness=-0.04:gamma=0.95,vignette=PI/5"
cut ceia      ceia.mp4      2.4 2.2  607 656  1080 "eq=gamma=0.95,vignette=PI/5"
cut presentes presentes.mp4 4.0 2.2  607 465  1080 "$WARM"
ls -la "$D"
