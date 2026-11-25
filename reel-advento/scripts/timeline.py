# Mapa único de tempos (segundos). Todos os scripts leem daqui.
BPM = 100
BEAT = 60 / BPM          # 0.6 s
DUR = 57.6               # 96 tempos

# Narração: (início no vídeo novo, início no original, fim no original, texto)
VOICE = [
    (0.40,  2.30,  3.10, "Advento."),
    (1.55,  3.33,  4.95, "Uma palavra que vem do latim"),
    (3.35,  5.26,  6.20, "adventus."),
    (4.75,  7.49,  9.25, "Significa: chegada."),
    (7.00, 11.97, 13.42, "Na tradição cristã,"),
    (8.75, 13.78, 15.66, "é o tempo que prepara o Natal."),
    (11.85, 20.88, 21.65, "No direito,"),
    (12.95, 22.09, 23.70, "guarda o mesmo sentido:"),
    (14.85, 24.24, 26.45, "a chegada de uma nova norma."),
    (17.75, 30.12, 35.18, "No primeiro dia de janeiro, começa a valer a Reforma Tributária do Consumo."),
    (23.70, 39.23, 41.46, "Por isso, durante o mês de dezembro,"),
    (26.15, 41.73, 43.40, "iniciaremos uma campanha:"),
    (28.15, 44.20, 46.50, "o Advento da Reforma Tributária."),
    (31.50, 50.20, 53.35, "Vamos abrir 30 portas durante o mês inteiro,"),
    (34.85, 54.04, 54.97, "uma por dia."),
    (36.20, 57.97, 60.60, "Cada uma abordará um tema específico."),
    (39.30, 61.76, 64.75, "Será uma contagem regressiva até janeiro."),
    (43.60, 70.40, 72.12, "É um assunto de todos."),
    (45.70, 73.25, 73.85, "Amanhã"),
    (46.60, 74.17, 76.35, "será aberta a primeira porta."),
    # removido: "Ficou com dúvida? Comente aqui embaixo." (80.74–83.10)
    (51.50, 84.36, 85.46, "Resultax."),
    (52.90, 85.76, 88.70, "Transformando confiança em resultados."),
]

# Efeitos sonoros: (tempo, tipo, ganho_dB, extra)
SFX = [
    (0.00, "swell", -22, 1.2),
    (1.55, "whoosh_s", -24, 0),
    (3.30, "whoosh_s", -24, 0),
    (4.75, "latch", -16, 0),
    (5.00, "doorswing", -20, 1.4),
    (6.60, "riser_end", -20, 1.6),
    (6.60, "boom", -16, 0),
    (6.60, "shimmer", -20, 1.4),
    (6.90, "ignite", -18, 0),
    (8.75, "ignite", -19, 0),
    (11.40, "zoomwhoosh", -18, 0),
    (11.45, "bell", -15, 1.0),
    (14.85, "bell", -18, 0.7),
    (17.40, "riser_end", -24, 0.8),
    (17.40, "flashwhoosh", -18, 0),
    (20.95, "boom", -17, 0),
    (23.40, "whip", -17, 0),
    (28.15, "boom", -20, 0),
    (28.15, "shimmer", -22, 1.0),
    (31.20, "zoomwhoosh", -18, 0),
    (33.30, "latch", -19, 0),
    (33.50, "doorswing", -22, 1.2),
    (36.00, "riser_end", -21, 1.2),
    (36.00, "flashwhoosh", -18, 0),
    (36.60, "swish", -24, 0),
    (37.20, "swish", -24, 0),
    (37.80, "swish", -24, 0),
    (38.40, "swish", -24, 0),
    (39.00, "flashwhoosh", -19, 0),
    (40.80, "boom", -22, 0),
    (41.60, "chime", -14, 0),     # "janeiro": badalada do relógio
    (43.20, "flashwhoosh", -18, 0),
    (45.70, "whoosh_s", -24, 0),
    (47.30, "latch", -17, 0),
    (47.50, "doorswing", -20, 1.6),
    (49.20, "riser_end", -18, 2.2),
    (49.20, "boom", -14, 0),
    (49.20, "shimmer", -18, 1.8),
    (49.40, "sparkle_sweep", -20, 1.8),
    (51.30, "boom", -18, 0),
    (51.30, "logo_chime", -16, 0),
]
# Tique-taque do relógio (no tempo da música) entre 39.0 e 43.2
for i in range(7):
    SFX.append((39.0 + i * BEAT, "tick" if i % 2 == 0 else "tock", -21, 0))
