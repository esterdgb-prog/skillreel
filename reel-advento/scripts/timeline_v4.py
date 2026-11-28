# v4: música natalina constante, mais referências a imposto, convite antes da logo (60 s).
from timeline import BPM, BEAT, VOICE as _V1

DUR = 60.0
MUSICA = "natal"
DUCK = 0.25          # música abaixa pouco sob a voz (constante)
MUSIC_DB = -16
GAP = 2.4            # pausa nova antes da logo ("Venha acompanhar essa jornada conosco")

# mesma narração; só "Resultax. Transformando confiança em resultados." anda 2,4 s
VOICE = [(t + (GAP if t >= 51 else 0), a, b, txt) for (t, a, b, txt) in _V1]

SFX = [
    (0.00, "handbell", -20, 0),
    (1.55, "whoosh_s", -25, 0),
    (3.30, "whoosh_s", -25, 0),
    (4.75, "latch", -17, 0),
    (5.00, "doorswing", -21, 1.4),
    (6.60, "riser_end", -22, 1.6),
    (6.60, "boom", -17, 0),
    (6.60, "handbell", -18, 0),
    (6.90, "ignite", -20, 0),
    (8.75, "ignite", -20, 0),
    (11.40, "zoomwhoosh", -19, 0),
    (12.95, "whoosh_s", -25, 0),
    (13.25, "shimmer", -24, 0.9),
    (14.85, "stamp", -15, 0),          # carimbo: "a chegada de uma nova norma"
    (17.40, "flashwhoosh", -19, 0),
    (19.65, "boom", -20, 0),           # fogos
    (19.70, "shimmer", -22, 1.2),
    (20.95, "boom", -18, 0),           # "Reforma Tributária"
    (22.20, "keys", -20, 5),           # calculadora
    (22.85, "register", -17, 0),       # "Consumo": caixa registradora
    (23.40, "whip", -18, 0),
    (23.55, "bell", -18, 1.0),         # sino
    (26.15, "whoosh_s", -24, 0),       # moeda girando
    (28.15, "zoomwhoosh", -20, 0),
    (28.20, "boom", -21, 0),
    (28.30, "shimmer", -24, 1.0),
    (29.20, "doorswing", -23, 1.3),
    (31.20, "flashwhoosh", -19, 0),    # calendário do Advento
    (31.25, "handbell", -19, 0),
    (34.85, "latch", -19, 0),
    (34.90, "shimmer", -21, 1.0),
    (36.00, "flashwhoosh", -19, 0),
    (36.60, "swish", -24, 0),
    (37.20, "swish", -24, 0),
    (37.80, "swish", -24, 0),
    (38.40, "swish", -24, 0),
    (39.00, "zoomwhoosh", -20, 0),
    (39.05, "sand", -25, 1.2),
    (40.20, "whoosh_s", -25, 0),
    (41.40, "boom", -22, 0),
    (41.60, "chime", -15, 0),          # "janeiro"
    (43.20, "flashwhoosh", -19, 0),
    (44.40, "swish", -24, 0),
    (45.70, "whip", -20, 0),
    (47.90, "latch", -18, 0),
    (48.05, "doorswing", -22, 1.1),
    (49.20, "riser_end", -20, 2.0),
    (49.20, "boom", -15, 0),
    (49.20, "handbell", -16, 0),
    (49.40, "sparkle_sweep", -22, 2.4),    # anel se formando + convite
    (53.70, "boom", -18, 0),               # logo
    (53.70, "logo_chime", -16, 0),
]
for i in range(7):
    SFX.append((39.0 + i * BEAT, "tick" if i % 2 == 0 else "tock", -23, 0))

# Texto na tela (as duas versões): abertura e convite.  "|" quebra a linha, *x* = fonte decorativa
TEXTOS_SEMPRE = [
    (0.30, 2.40, "*REFORMA TRIBUTÁRIA*|30 dias · 30 portas", 560),
    (49.70, 53.40, "Venha acompanhar|essa *jornada* conosco", 960),
]
# Palavras-chave na tela (só na versão sem legenda; na legendada a legenda faz esse papel)
TEXTOS_SEM_LEGENDA = [
    (14.95, 17.25, "*NOVA NORMA*", 1440),
    (20.80, 23.15, "*REFORMA TRIBUTÁRIA*|do consumo", 1440),
    (28.20, 30.90, "*ADVENTO DA*|*REFORMA TRIBUTÁRIA*", 1440),
    (31.50, 35.95, "*30 PORTAS*|uma por dia", 1440),
]

from timeline_v3 import CAPTIONS as _C3
CAPTIONS = [(a + (GAP if a >= 51 else 0), b + (GAP if a >= 51 else 0), t) for (a, b, t) in _C3]
