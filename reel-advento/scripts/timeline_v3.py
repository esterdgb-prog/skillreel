# Mapa de tempos da v3 (copiado da v2) (mesma narração da v1; efeitos ajustados às cenas novas).
from timeline import BPM, BEAT, DUR, VOICE

SFX = [
    (0.00, "swell", -22, 1.2),
    (1.55, "whoosh_s", -24, 0),       # livro em latim
    (3.30, "whoosh_s", -24, 0),       # close na página
    (4.75, "latch", -16, 0),          # porta 1 abre
    (5.00, "doorswing", -20, 1.4),
    (6.60, "riser_end", -20, 1.6),
    (6.60, "boom", -16, 0),
    (6.60, "shimmer", -20, 1.4),
    (6.90, "ignite", -19, 0),         # coroa de velas
    (8.75, "ignite", -19, 0),         # velas em close
    (11.40, "zoomwhoosh", -18, 0),    # balança
    (12.95, "whoosh_s", -24, 0),      # balança
    (13.25, "shimmer", -23, 0.9),     # brilho no metal
    (14.85, "boom", -19, 0),          # selo: "a chegada de uma nova norma"
    (14.95, "shimmer", -22, 1.0),
    (17.40, "riser_end", -24, 0.8),
    (17.40, "flashwhoosh", -18, 0),   # calendário 1 de janeiro
    (19.65, "boom", -19, 0),          # fogos: "começa a valer"
    (19.70, "shimmer", -21, 1.2),
    (20.95, "boom", -17, 0),          # "Reforma Tributária" (sacola + nota)
    (21.05, "bell", -24, 0.5),        # sininho de loja
    (22.20, "whoosh_s", -24, 0),      # feira: "do Consumo"
    (23.40, "whip", -17, 0),          # sino (dezembro)
    (23.55, "bell", -17, 1.0),
    (26.15, "whoosh_s", -23, 0),      # corredor
    (28.15, "zoomwhoosh", -19, 0),    # porta abrindo: "o Advento da Reforma Tributária"
    (28.20, "boom", -21, 0),
    (28.30, "shimmer", -23, 1.0),
    (29.20, "doorswing", -22, 1.3),
    (31.20, "riser_end", -21, 1.0),
    (31.20, "flashwhoosh", -18, 0),   # calendário do Advento
    (34.85, "latch", -19, 0),         # "uma por dia": portinha 1 acende
    (34.90, "shimmer", -20, 1.0),
    (36.00, "flashwhoosh", -18, 0),   # armário com as 4 portinhas
    (36.60, "swish", -23, 0),
    (36.65, "tick", -26, 0),          # moeda
    (37.20, "swish", -23, 0),
    (37.80, "swish", -23, 0),
    (38.40, "swish", -23, 0),
    (39.00, "zoomwhoosh", -19, 0),    # ampulheta
    (39.05, "sand", -24, 1.2),        # areia caindo
    (40.20, "whoosh_s", -24, 0),
    (40.25, "sparkle_sweep", -25, 1.1),
    (41.40, "boom", -21, 0),          # relógio
    (41.60, "chime", -14, 0),         # "janeiro"
    (43.20, "flashwhoosh", -18, 0),   # assunto de todos
    (43.30, "shimmer", -24, 0.8),
    (44.40, "swish", -23, 0),         # família
    (45.70, "whip", -19, 0),          # porta 2
    (47.90, "latch", -17, 0),
    (48.05, "doorswing", -21, 1.1),
    (49.20, "riser_end", -18, 2.2),
    (49.20, "boom", -14, 0),
    (49.20, "shimmer", -18, 1.8),
    (49.40, "sparkle_sweep", -20, 1.8),
    (51.30, "boom", -18, 0),
    (51.30, "logo_chime", -16, 0),
]
# tique-taque da contagem (ampulheta → relógio), no tempo da música
for i in range(7):
    SFX.append((39.0 + i * BEAT, "tick" if i % 2 == 0 else "tock", -22, 0))

# Legendas (versão legendada): (início, fim, texto) — *palavra* = destaque na fonte decorativa.
# Sem legenda quando a própria imagem já traz o texto ("contagem regressiva") e na logo.
CAPTIONS = [
    (0.40, 1.30, "*Advento*"),
    (1.55, 3.20, "Uma palavra que vem do latim"),
    (3.35, 4.40, "*adventus*"),
    (4.75, 5.66, "Significa:"),
    (5.66, 6.60, "*chegada*"),
    (7.00, 8.60, "Na tradição cristã,"),
    (8.75, 10.90, "é o tempo que prepara o *Natal*"),
    (11.85, 12.85, "No *direito*,"),
    (12.95, 14.75, "guarda o mesmo sentido:"),
    (14.85, 17.20, "a chegada de uma *nova norma*"),
    (17.75, 19.58, "No primeiro dia de *janeiro*,"),
    (19.65, 20.76, "começa a valer"),
    (20.76, 23.10, "a *Reforma Tributária* do Consumo"),
    (23.70, 24.38, "Por isso,"),
    (24.43, 26.05, "durante o mês de dezembro,"),
    (26.15, 28.00, "iniciaremos uma campanha:"),
    (28.15, 30.80, "o *Advento* da *Reforma Tributária*"),
    (31.50, 33.19, "Vamos abrir *30 portas*"),
    (33.19, 34.78, "durante o mês inteiro,"),
    (34.85, 35.95, "uma por dia"),
    (36.20, 38.95, "Cada uma abordará um tema específico"),
    (39.30, 40.15, "Será uma contagem"),
    (41.55, 42.70, "até *janeiro*"),
    (43.60, 45.45, "É um assunto de *todos*"),
    (45.70, 47.25, "*Amanhã* será aberta"),
    (47.25, 49.00, "a *primeira porta*"),
    (52.90, 54.44, "Transformando confiança"),
    (54.44, 56.40, "em *resultados*"),
]
