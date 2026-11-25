# Advento da Reforma Tributária: reel v2

Duas versões: `render2/reel-v2.mp4` (sem legenda) e `render2/reel-v2-legendado.mp4`.
Mesma narração, ritmo e trilha da v1 (57,6 s, 100 BPM). As portas repetidas foram substituídas pelas 10 imagens novas, animadas.

| Tempo | Fala | Imagem | Animação |
|---|---|---|---|
| 0,0–1,55 | "Advento." | Porta 1 (vídeo) | fade do preto |
| 1,55–3,3 | "Uma palavra que vem do latim" | **Livro antigo com velas** | zoom lento + giro 3D leve, chamas tremulando, poeira dourada |
| 3,3–4,75 | "adventus." | **Close na página do livro** | soco de zoom, chamas |
| 4,75–6,6 | "Significa: chegada." | Porta 1 abre (vídeo) | flash de luz |
| 6,6–8,75 | "Na tradição cristã," | **Coroa do Advento na mesa** | zoom + giro 3D, chamas tremulando |
| 8,75–11,4 | "é o tempo que prepara o Natal." | Velas em close (vídeo) | zoom com desfoque |
| 11,4–14,85 | "No direito, guarda o mesmo sentido:" | **Balança da justiça** | zoom + giro 3D, reflexo passando no metal |
| 14,85–17,4 | "a chegada de uma nova norma." | **Selo de cera dourado** | soco + pulso de luz, reflexo no selo |
| 17,4–20,95 | "No primeiro dia de janeiro, começa a valer" | **Calendário "1 JANEIRO"** | zoom + giro 3D |
| 20,95–23,4 | "a Reforma Tributária do Consumo." | **Sacola Resultax e nota fiscal** | soco + pulso, reflexo dourado; chicote na saída |
| 23,4–26,15 | "Por isso, durante o mês de dezembro," | Sino (vídeo) | sino tocando |
| 26,15–28,15 | "iniciaremos uma campanha:" | Corredor (vídeo) | |
| 28,15–31,2 | "o Advento da Reforma Tributária." | Porta se abrindo com luz (vídeo) | zoom com desfoque na entrada, flash na saída |
| 31,2–34,85 | "Vamos abrir 30 portas durante o mês inteiro," | **Calendário do Advento inteiro** | zoom lento |
| 34,85–36,0 | "uma por dia." | **Portinha 1 em destaque** | foco de luz dourada só na portinha 1 + trinco |
| 36,0–39,0 | "Cada uma abordará um tema específico." | **Armário: geral → moeda → nota → casinha → carrinho** (um por tempo) | cortes secos com soco, reflexo na moeda |
| 39,0–41,4 | "Será uma contagem regressiva" | **Ampulheta "Contagem Regressiva"** | areia caindo, brilho, tique-taque |
| 41,4–43,2 | "até janeiro." | Relógio (vídeo) | badalada em "janeiro" |
| 43,2–45,7 | "É um assunto de todos." | **"assunto de todos"** | zoom lento, poeira dourada; chicote na saída |
| 45,7–49,2 | "Amanhã será aberta a primeira porta." | Porta 2 abre (vídeo) | flash grande |
| 49,2–57,6 | "Resultax. Transformando confiança em resultados." | Anel dourado e logo (vídeo) | pulso de luz na logo, fade final |

## Legenda (versão legendada)
- Fontes iguais às das imagens: **Cormorant Garamond Bold** (texto, como "assunto de todos") e **Cinzel Decorative Bold** nas palavras de destaque (como "Contagem Regressiva").
- Dourado em degradê #E8D3A0 → #B8915A (medido nas letras das imagens), contorno escuro fino, sombra e faixa escura suave para ler sobre fundo claro.
- Entra no tempo de cada trecho da fala; sem legenda quando a imagem já traz o texto ("contagem regressiva", "assunto de todos") e na logo.

## Observação
O calendário do Advento gerado tem números errados (a 2ª fileira repete 5 e 6, faltam 11 e 12, o 27 aparece duas vezes).
Ele aparece inteiro de longe; em "uma por dia" o foco de luz fica só na portinha 1.

## Como refazer
```bash
python3 scripts/ampliar.py <pasta_imagens> imgs
TIMELINE=timeline_v2 python3 scripts/audio.py audio/orig.wav audio2
python3 scripts/video2.py <original.mp4> imgs render2/_v2.mp4
python3 scripts/video2.py <original.mp4> imgs render2/_v2-legenda.mp4 --legenda
bash scripts/finalizar.sh render2/_v2.mp4 audio2/mix-bruto.wav render2/reel-v2.mp4
bash scripts/finalizar.sh render2/_v2-legenda.mp4 audio2/mix-bruto.wav render2/reel-v2-legendado.mp4
```
