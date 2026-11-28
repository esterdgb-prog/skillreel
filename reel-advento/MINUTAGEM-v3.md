# Advento da Reforma Tributária: reel v3

Mesma montagem da v2 (`MINUTAGEM-v2.md`) com clipes gratuitos do Pixabay nos pontos fracos (origem em `FONTES.md`):

| Tempo | Fala | Antes (v2) | Agora (v3) |
|---|---|---|---|
| 11,4–12,95 | "No direito," | balança (imagem) | **martelo de juiz** (vídeo) |
| 12,95–14,85 | "guarda o mesmo sentido:" | balança | balança (imagem, com reflexo) |
| 19,65–20,95 | "começa a valer" | calendário 1 JANEIRO | **fogos dourados de Ano-Novo** (vídeo) |
| 22,2–23,4 | "…do Consumo" | sacola e nota | **feira de Natal com gente** (vídeo) |
| 39,0–40,2 | "Será uma contagem" | ampulheta (imagem) | **areia dourada caindo** (vídeo) |
| 40,2–41,4 | "regressiva" | ampulheta | ampulheta "Contagem Regressiva" (imagem) |
| 43,2–44,4 | "É um assunto…" | "assunto de todos" (ilustração) | **família na ceia** (vídeo) |
| 44,4–45,7 | "…de todos." | "assunto de todos" | **família abrindo presentes** (vídeo) |

Efeitos novos: estouro e brilho nos fogos, whoosh na feira, chiado de areia na ampulheta, swish na família.
Legendada: entra "Será uma contagem" e "É um assunto de TODOS" (a ilustração com o texto saiu).
O calendário do Advento continua sendo a imagem (o Pixabay não tem filmagem de calendário do Advento).

```bash
bash scripts/clipes.sh <pasta_clipes_pixabay> clipes
TIMELINE=timeline_v3 python3 scripts/audio.py audio/orig.wav audio3
python3 scripts/video3.py <original.mp4> imgs render3/_v3.mp4 [--legenda]
bash scripts/finalizar.sh render3/_v3.mp4 audio3/mix-bruto.wav render3/reel-v3.mp4
```
