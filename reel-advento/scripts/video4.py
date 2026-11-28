# v4: v3 + trilha natalina constante, imposto (calculadora, moeda, palavras na tela), convite antes da logo; 60 s.
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import video2 as v
import video3 as v3
from video2 import V
import timeline_v4 as tl

v.DUR = tl.DUR
P = v3.P
S = {sh["name"]: sh for sh in v3.SHOTS}
SHOTS = []
for sh in v3.SHOTS:
    n = sh["name"]
    if n == "feira":
        SHOTS.append(V("calculadora", 22.20, 23.40, [(22.20, 0.0), (23.40, 1.2)], [(22.20, 1.04, 540, 960), (23.40, 1.12, 560, 980)], 0.05, path=P("calculadora")))
    elif n == "corredor":
        SHOTS.append(V("moeda girando", 26.15, 28.15, [(26.15, 0.10), (28.15, 2.10)], [(26.15, 1.00, 540, 960), (28.15, 1.06, 540, 960)], 0.05, path=P("moeda_gira")))
    elif n == "anel e logo":
        SHOTS.append(V("anel e logo", 49.20, tl.DUR, [(49.20, 80.00), (53.60, 84.20), (tl.DUR, 84.20 + tl.DUR - 53.60)], [(49.20, 1.00, 540, 960), (tl.DUR, 1.08, 540, 960)]))
    else:
        SHOTS.append(sh)
v.SHOTS = SHOTS
v.CAPTIONS = tl.CAPTIONS
v.GLOW = [14.85, 19.70, 20.95, 28.20, 53.75]


def main():
    legenda = "--legenda" in sys.argv
    sempre = v.Captions(body=84, deco=96, items=tl.TEXTOS_SEMPRE)
    layers = [sempre]
    if not legenda: layers.append(v.Captions(body=84, deco=84, items=tl.TEXTOS_SEM_LEGENDA))
    orig_main_ctx = v.main.__code__  # noqa: só para documentar que reaproveitamos o main
    # injeta as camadas de texto no ctx via render_frame
    rf = v.render_frame
    def render_frame(t, ctx):
        ctx["textos"] = layers
        return rf(t, ctx)
    v.render_frame = render_frame
    v.main()


if __name__ == "__main__":
    main()
