# v3: v2 + clipes do Pixabay (martelo, fogos, feira, ampulheta, ceia, presentes) no lugar dos pontos fracos.
# Uso igual ao video2.py:  python3 scripts/video3.py <original.mp4> <imgs_dir> <saida|pasta> [--legenda] [--at ...]
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import video2 as v
from video2 import V, I
from timeline import DUR
from timeline_v3 import CAPTIONS

C = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "clipes")
def P(n): return os.path.join(C, n + ".mp4")

S = {sh["name"]: sh for sh in v.SHOTS}
def keep(name, a=None, b=None, cam=None, kick=None):
    sh = dict(S[name])
    if a is not None: sh["a"] = a
    if b is not None: sh["b"] = b
    if cam is not None: sh["cam"] = cam
    if kick is not None: sh["kick"] = kick
    return sh

SHOTS = [
    keep("porta-1"), keep("livro"), keep("livro pagina"), keep("porta-1 abre"), keep("coroa"), keep("velas close"),
    V("martelo", 11.40, 12.95, [(11.40, 0.10), (12.95, 1.65)], [(11.40, 1.00, 540, 960), (12.95, 1.06, 540, 1000)], path=P("martelo")),
    keep("balanca", 12.95, 14.85, [(12.95, 1.08, 774, 1380), (14.85, 1.18, 774, 1330)], 0.06),
    keep("selo"),
    keep("1 janeiro", 17.40, 19.65, [(17.40, 1.02, 820, 1360), (19.65, 1.14, 850, 1340)]),
    V("fogos", 19.65, 20.95, [(19.65, 0.30), (20.95, 1.60)], [(19.65, 1.00, 540, 900), (20.95, 1.08, 540, 900)], 0.06, path=P("fogos")),
    keep("sacola e nota", 20.95, 22.20, [(20.95, 1.12, 800, 1820), (22.20, 1.20, 840, 1870)]),
    V("feira", 22.20, 23.40, [(22.20, 0.30), (23.40, 1.50)], [(22.20, 1.06, 540, 960), (23.40, 1.12, 540, 980)], 0.05, path=P("feira")),
    keep("sino"), keep("corredor"), keep("porta abrindo"), keep("calendario advento"), keep("portinha 1"),
    keep("armario"), keep("moeda"), keep("nota fiscal"), keep("casinha"), keep("carrinho"),
    V("ampulheta real", 39.00, 40.20, [(39.00, 0.40), (40.20, 1.60)], [(39.00, 1.00, 540, 960), (40.20, 1.08, 540, 1000)], path=P("ampulheta")),
    keep("ampulheta", 40.20, 41.40, [(40.20, 1.04, 768, 1500), (41.40, 1.10, 768, 1520)], 0.06),
    keep("relogio zoom"),
    V("ceia", 43.20, 44.40, [(43.20, 0.30), (44.40, 1.50)], [(43.20, 1.00, 540, 960), (44.40, 1.07, 540, 980)], path=P("ceia")),
    V("presentes", 44.40, 45.70, [(44.40, 0.30), (45.70, 1.60)], [(44.40, 1.05, 540, 1000), (45.70, 1.12, 560, 1000)], 0.05, path=P("presentes")),
    keep("porta-2 abre"), keep("anel e logo"),
]
# a areia da imagem da ampulheta não tem mais o primeiro trecho: o sweep começa junto
SHOTS[[s["name"] for s in SHOTS].index("ampulheta")]["fx"] = dict(S["ampulheta"]["fx"], sweep=(40.25, 1.0))
SHOTS[[s["name"] for s in SHOTS].index("balanca")]["fx"] = dict(S["balanca"]["fx"], sweep=(13.2, 1.0))

v.SHOTS = SHOTS
v.CAPTIONS = CAPTIONS
v.GLOW = [14.85, 19.70, 20.95, 28.20, 51.35]
v.TRANS = dict(v.TRANS)

if __name__ == "__main__":
    v.main()
