# Advento da Reforma Tributária: reel v1

Original: 92,1 s → v1: 57,6 s. 1080×1920, 30 fps. Trilha a 100 BPM (1 tempo = 0,6 s); toda troca de cena cai num tempo da música.
Sem legenda. A frase "Ficou com dúvida? Comente aqui embaixo." foi removida.

| Tempo | Fala | Imagem | Transição | Som |
|---|---|---|---|---|
| 0,0–1,55 | "Advento." | Porta 1 aberta no plano, empurrando devagar | fade do preto | brilho subindo |
| 1,55–3,3 | "Uma palavra que vem do latim" | Close na luz que vaza da porta | soco de zoom | whoosh leve |
| 3,3–4,75 | "adventus." | Close na maçaneta | soco de zoom | whoosh leve |
| 4,75–6,6 | "Significa: chegada." | Porta abre acelerada, luz invade em "chegada" | soco de zoom | trinco + porta + riser |
| 6,6 | | | **flash de luz** | impacto + brilho |
| 6,6–8,75 | "Na tradição cristã," | Coroa do Advento, velas acesas | | vela acendendo |
| 8,75–11,4 | "é o tempo que prepara o Natal." | Close nas chamas | soco de zoom | vela acendendo |
| 11,4 | | | **zoom com desfoque** | whoosh + sino |
| 11,4–14,85 | "No direito, guarda o mesmo sentido:" | Sino balançando | | sino |
| 14,85–17,4 | "a chegada de uma nova norma." | Close no sino | soco + pulso de luz | sino (no "chegada") |
| 17,4 | | | **flash** | whoosh + riser |
| 17,4–20,95 | "No primeiro dia de janeiro, começa a valer" | Corredor de portas avançando | | pulsação da trilha |
| 20,95–23,4 | "a Reforma Tributária do Consumo." | Corredor, plano fechado | soco + pulso de luz | impacto em "Reforma" |
| 23,4 | | | **chicote lateral** | whip |
| 23,4–28,15 | "Por isso, durante o mês de dezembro, iniciaremos uma campanha:" | Portas passando de lado | | |
| 28,15–31,2 | "o Advento da Reforma Tributária." | Porta em destaque | soco + pulso de luz | impacto + brilho |
| 31,2 | | | **zoom com desfoque** | whoosh |
| 31,2–36,0 | "Vamos abrir 30 portas durante o mês inteiro, uma por dia." | Porta do corredor se abre, luz vaza | | trinco + porta |
| 36,0 | | | **flash** | whoosh + riser |
| 36,0–39,0 | "Cada uma abordará um tema específico." | 5 portas diferentes, uma por tempo (0,6 s cada) | cortes secos com soco | swish em cada corte |
| 39,0 | | | **flash** | whoosh |
| 39,0–40,8 | "Será uma contagem regressiva" | Relógio de pêndulo | | tique-taque no tempo da música |
| 40,8–43,2 | "até janeiro." | Zoom acelerado no mostrador (12h) | soco de zoom | badalada em "janeiro" |
| 43,2 | | | **flash** | whoosh |
| 43,2–45,7 | "É um assunto de todos." | Porta 2, luz por baixo | | pulsação em colcheias |
| 45,7–49,2 | "Amanhã será aberta a primeira porta." | Porta 2 de perto, abre e a luz invade | soco de zoom | trinco + porta + riser longo |
| 49,2 | | | **flash grande** | impacto + brilho (respiro da trilha antes) |
| 49,2–51,2 | | Anel dourado se formando (acelerado) | | brilho girando |
| 51,2–57,6 | "Resultax. Transformando confiança em resultados." | Logo RESULTAX no anel, empurrando devagar | pulso de luz na logo, fade final | impacto + acorde de sinos |

## Áudio
- Narração original, frases recortadas e aproximadas (nenhuma palavra cortada; conferido por transcrição).
- Trilha e efeitos sintetizados localmente, sem licença de terceiros (caixinha de música, pad, baixo, pulsação, sinos, tique-taque, whooshes).
- Música abaixa sob a voz (ducking) e volta nos respiros.
- Master: −14 LUFS, pico ≤ −1 dBTP.

## Como refazer
```bash
python3 scripts/audio.py audio/orig.wav audio
python3 scripts/video.py <original.mp4> render/_video.mp4
bash scripts/finalizar.sh render/_video.mp4 audio/mix-bruto.wav render/reel-v1.mp4
```
Todos os tempos ficam em `scripts/timeline.py` (narração e efeitos) e `scripts/video.py` (planos e transições).
