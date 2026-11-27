#!/usr/bin/env python3
"""Versão 2 — no estilo do vídeo de exemplo.

- legenda pequena, minúscula, branca com sombra suave, no meio da tela,
  revelando palavra por palavra;
- título por seção no alto: linha pequena branca ("PRIMEIRO:") + nome do
  exercício grande em vermelho com contorno branco, letras entrando em cascata;
- ícone ❌ vermelho no erro e ✔ verde no acerto;
- fechamento: "e se ele seguisse / meu perfil" vira título, com ícone do Instagram.
Uso: python3 legendar_v2.py [words.json] [saida.ass]
"""
import json, math, re, sys
from PIL import ImageFont

SRC = sys.argv[1] if len(sys.argv) > 1 else "words.json"
OUT = sys.argv[2] if len(sys.argv) > 2 else "legenda-v2.ass"
FONTES = "fontes"

# ---------------- palavras (mesmas correções da v1) ----------------
raw = [[s["text"].strip(), s["offsets"]["from"] / 1000, s["offsets"]["to"] / 1000]
       for s in json.load(open(SRC))["transcription"] if s["text"].strip()]
FIX_TXT = {"gangurra": "gangorra", "pudal": "pulldown"}
FIX_T = {
    0: (0.47, 0.60), 1: (0.60, 0.70), 2: (0.70, 0.96),
    24: (7.99, 8.13), 25: (8.13, 8.22), 26: (8.22, 8.41),
    61: (17.86, 17.97), 62: (17.97, 18.05), 63: (18.05, 18.30), 64: (18.30, 18.40),
    65: (18.40, 18.48), 66: (18.48, 18.80),
    83: (24.83, 24.90), 84: (24.90, 24.97), 85: (24.97, 25.04), 86: (25.04, 25.22),
    87: (25.22, 25.32), 88: (25.32, 25.49),
}
W = []
for i, (t, a, b) in enumerate(raw):
    c = re.sub(r"[.,!?]", "", t).lower()
    c = FIX_TXT.get(c, c)
    a, b = FIX_T.get(i, (a, b))
    W.append({"t": c, "a": a, "b": b})
FIM_VIDEO = 27.60

def acha(seq, depois=0):
    """índice da primeira ocorrência da sequência de palavras a partir de `depois`."""
    seq = seq.split()
    for i in range(depois, len(W) - len(seq) + 1):
        if [w["t"] for w in W[i:i + len(seq)]] == seq:
            return i
    raise ValueError(seq)

# ---------------- grupos da legenda pequena ----------------
GRUPOS = """
quando ele | entender que | na puxada | triângulo | ele não fica | fazendo gangorra | para trás | e sim |
levemente | inclinado | aí sim | as costas | dele vêm |
quando ele | entender que | no pulldown | ele não fica | em pé | e sim com | o peito | apontado | para o chão |
e quando ele | puxar o braço | não fica | dobrando | e esticando | aí sim | as costas | dele vêm |
quando ele | entender que | na puxada | frente | o cotovelo | dele fica | para frente | e não | para trás |
aí as costas | dele vêm |
e se ele seguisse meu perfil |
ele não | estava | treinando | errado assim
"""
grupos, k = [], 0
for g in [x.split() for x in GRUPOS.replace("\n", " ").split("|") if x.strip()]:
    ids = list(range(k, k + len(g)))
    assert [W[i]["t"] for i in ids] == g, (g, [W[i]["t"] for i in ids])
    grupos.append(ids); k += len(g)
assert k == len(W)
CTA = acha("e se ele seguisse")          # daqui em diante a fala vira título
grupos = [g for g in grupos if g[0] != CTA]

# ---------------- utilidades ASS ----------------
def ts(x):
    x = max(0.0, x); h, r = divmod(x, 3600); m, s = divmod(r, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"

def ev(a, b, estilo, txt, camada=0):
    return f"Dialogue: {camada},{ts(a)},{ts(b)},{estilo},,0,0,0,,{txt}"

def largura(txt, fam, tam):
    f = ImageFont.truetype(f"{FONTES}/{fam}.ttf", tam)
    return f.getlength(txt)

def p(v): return f"{v:.1f}".rstrip("0").rstrip(".")

def circulo(r):
    k = 0.5523 * r
    return (f"m 0 {p(-r)} b {p(k)} {p(-r)} {p(r)} {p(-k)} {p(r)} 0 b {p(r)} {p(k)} {p(k)} {p(r)} 0 {p(r)} "
            f"b {p(-k)} {p(r)} {p(-r)} {p(k)} {p(-r)} 0 b {p(-r)} {p(-k)} {p(-k)} {p(-r)} 0 {p(-r)}")

def barra(x1, y1, x2, y2, esp):
    """retângulo de espessura `esp` entre dois pontos (com pontas arredondadas aproximadas)."""
    dx, dy = x2 - x1, y2 - y1; n = math.hypot(dx, dy)
    ox, oy = -dy / n * esp / 2, dx / n * esp / 2
    pts = [(x1 + ox, y1 + oy), (x2 + ox, y2 + oy), (x2 - ox, y2 - oy), (x1 - ox, y1 - oy)]
    return "m " + " l ".join(f"{p(x)} {p(y)}" for x, y in pts)

def ret_arred(w, h, r):
    x0, y0, x1, y1 = -w / 2, -h / 2, w / 2, h / 2; k = 0.5523 * r
    return (f"m {p(x0 + r)} {p(y0)} l {p(x1 - r)} {p(y0)} b {p(x1 - r + k)} {p(y0)} {p(x1)} {p(y0 + r - k)} {p(x1)} {p(y0 + r)} "
            f"l {p(x1)} {p(y1 - r)} b {p(x1)} {p(y1 - r + k)} {p(x1 - r + k)} {p(y1)} {p(x1 - r)} {p(y1)} "
            f"l {p(x0 + r)} {p(y1)} b {p(x0 + r - k)} {p(y1)} {p(x0)} {p(y1 - r + k)} {p(x0)} {p(y1 - r)} "
            f"l {p(x0)} {p(y0 + r)} b {p(x0)} {p(y0 + r - k)} {p(x0 + r - k)} {p(y0)} {p(x0 + r)} {p(y0)}")

def caixa(d, B):
    """desloca o desenho para [0, 2B] e ancora a caixa, para \\an5 centralizar certo."""
    tok, out, eixo = d.split(), [], 0
    for t in tok:
        if re.fullmatch(r"-?[0-9.]+", t):
            out.append(p(float(t) + B)); eixo ^= 1
        else:
            out.append(t)
    return f"m 0 0 m {p(2*B)} {p(2*B)} " + " ".join(out)

def desloca(d, dx, dy):
    out, eixo = [], 0
    for t in d.split():
        if re.fullmatch(r"-?[0-9.]+", t):
            out.append(p(float(t) + (dx if eixo == 0 else dy))); eixo ^= 1
        else:
            out.append(t)
    return " ".join(out)

POP = r"\fscx40\fscy40\t(0,120,\fscx112\fscy112)\t(120,200,\fscx100\fscy100)"
SAI = lambda d: rf"\t({int(d*1000)-180},{int(d*1000)},\fscx60\fscy60\alpha&HFF&)"

# ---------------- layout (1080×1920) ----------------
LEG_Y = 1060                 # legenda pequena: meio da tela, como no exemplo
ICONE_Y = 935                # ❌/✔ logo acima da legenda
KICK_Y, TIT_Y = 290, 410     # título no alto, acima das cabeças
VERMELHO = "&H2C12E3&"       # #E3122C
VERDE = "&H45C21F&"          # #1FC245
TIT_MAX_W = 980

head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Leg,Mont700,76,&H00FFFFFF,&H00FFFFFF,&H78000000,&H00000000,0,0,0,0,100,100,0,0,1,3.5,0,5,40,40,0,1
Style: Kick,Mont600,84,&H00FFFFFF,&H00FFFFFF,&H70000000,&H00000000,0,0,0,0,100,100,0,0,1,3,0,5,40,40,0,1
Style: Tit,Mont600,170,&H002C12E3,&H00FFFFFF,&H00FFFFFF,&H90000000,0,0,0,0,100,100,0,0,1,3,5,5,40,40,0,1
Style: TitB,Mont600,170,&H00FFFFFF,&H00FFFFFF,&H70000000,&H00000000,0,0,0,0,100,100,0,0,1,4,0,5,40,40,0,1
Style: Ico,Mont700,10,&H00FFFFFF,&H00FFFFFF,&H00000000,&H90000000,0,0,0,0,100,100,0,0,1,0,3,7,0,0,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
L = []

# ---- 1. legenda pequena, revelando palavra por palavra ----
for n, g in enumerate(grupos):
    ini, fala_fim = W[g[0]]["a"], W[g[-1]]["b"]
    prox = W[grupos[n + 1][0]]["a"] if n + 1 < len(grupos) else FIM_VIDEO
    fim = min(prox if prox - fala_fim < 0.4 else fala_fim + 0.3, FIM_VIDEO)
    for j, i in enumerate(g):
        a = ini if j == 0 else W[i]["a"]
        z = W[g[j + 1]]["a"] if j + 1 < len(g) else fim
        if z <= a: continue
        partes = []
        for q in g:
            if q < i:   partes.append(W[q]["t"])
            elif q == i: partes.append(r"{\alpha&HFF&\t(0,90,\alpha&H00&)}" + W[q]["t"] + r"{\alpha&H00&}")
            else:       partes.append(r"{\alpha&HFF&}" + W[q]["t"])
        sub = r"{\blur3" + (r"\fad(60,0)" if j == 0 else "") + rf"\pos(540,{LEG_Y})}}" + " ".join(partes)
        L.append(ev(a, z, "Leg", sub))

# ---- 2. títulos por seção ----
def titulo(kicker, nome, a, z, estilo="Tit"):
    d = z - a
    tam = 170
    while largura(nome, "Mont600", tam) > TIT_MAX_W: tam -= 2
    L.append(ev(a, z, "Kick",
        rf"{{\move(540,{KICK_Y+22},540,{KICK_Y},0,260)\fad(180,220)\blur6\t(0,260,\blur0)\t({int(d*1000)-250},{int(d*1000)},\blur8)}}{kicker}", 2))
    letras = "".join(
        (c if c == " " else rf"{{\alpha&HFF&\t({180+i*32},{340+i*32},\alpha&H00&)}}{c}")
        for i, c in enumerate(nome))
    L.append(ev(a, z, estilo,
        rf"{{\fs{tam}\pos(540,{TIT_Y})\fad(0,220)\blur1\t({int(d*1000)-250},{int(d*1000)},\blur10)}}{letras}", 2))
    return tam

secoes = [("PRIMEIRO:", "Puxada triângulo", acha("quando ele"), acha("e sim")),
          ("SEGUNDO:", "Pulldown", acha("no pulldown") - 3, acha("e quando ele")),
          ("TERCEIRO:", "Puxada frente", acha("na puxada frente") - 3, acha("o cotovelo") + 3)]
for kick, nome, i0, i1 in secoes:
    titulo(kick, nome, W[i0]["a"], W[i1]["a"])

# ---- 3. ❌ no erro, ✔ no acerto ----
R = 56
X_DRAW = barra(-20, -20, 20, 20, 13) + " " + barra(20, -20, -20, 20, 13)
V_DRAW = barra(-23, 2, -7, 18, 13) + " " + barra(-7, 18, 24, -17, 13)
def icone(a, z, cor, simbolo):
    d = z - a
    base = rf"\an5\pos(540,{ICONE_Y})"
    L.append(ev(a, z, "Ico", rf"{{{base}\1c{cor}{POP}{SAI(d)}\p1}}{caixa(circulo(R), R)}", 1))
    L.append(ev(a, z, "Ico", rf"{{{base}\1c&HFFFFFF&\shad0{POP}{SAI(d)}\p1}}{caixa(simbolo, R)}", 1))

def fim_frase(i):   # fim da última palavra da frase que começa em i (até a pausa/vírgula)
    return W[i]["b"]
erros = [("não fica fazendo gangorra para trás", 0),
         ("não fica em pé", acha("no pulldown")),
         ("não fica dobrando e esticando", 0),
         ("e não para trás", 0)]
acertos = [("aí sim as costas dele vêm", 0), ("aí sim as costas dele vêm", acha("no pulldown")),
           ("aí as costas dele vêm", 0)]
for frase, depois in erros:
    i = acha(frase, depois); j = i + len(frase.split()) - 1
    icone(W[i]["a"], W[j]["b"] + 0.15, VERMELHO, X_DRAW)
for frase, depois in acertos:
    i = acha(frase, depois); j = i + len(frase.split()) - 1
    icone(W[i]["a"], W[j]["b"] + 0.3, VERDE, V_DRAW)

# ---- 4. fechamento: a fala vira título + ícone do Instagram ----
a_cta, a_perfil = W[CTA]["a"], W[acha("meu perfil")]["a"]
kick_cta = "e se ele seguisse"
ws = kick_cta.split()
partes = []
for n, w in enumerate(ws):   # o kicker entra palavra por palavra, junto da fala
    t0 = int((W[CTA + n]["a"] - a_cta) * 1000)
    partes.append(rf"{{\alpha&HFF&\t({t0},{t0+120},\alpha&H00&)}}{w}")
L.append(ev(a_cta, FIM_VIDEO, "Kick", rf"{{\pos(540,{KICK_Y})\blur0.6}}" + " ".join(partes), 2))
tam = 170
while largura("meu perfil", "Mont600", tam) > TIT_MAX_W - 170: tam -= 2
wt = largura("meu perfil", "Mont600", tam)
xt = 540 + 70                          # título desloca para dar lugar ao ícone
L.append(ev(a_perfil, FIM_VIDEO, "TitB",
    rf"{{\fs{tam}\pos({xt},{TIT_Y})\blur4\fscx70\fscy70\t(0,140,\fscx106\fscy106)\t(140,220,\fscx100\fscy100)}}meu perfil", 2))
xi = xt - wt / 2 - 80                  # centro do ícone, à esquerda do título
IG = rf"\an5\pos({p(xi)},{TIT_Y})"
anel = rf"{{{IG}\1a&HFF&\3c&HFFFFFF&\bord7\shad0{POP}\p1}}"
L.append(ev(a_perfil, FIM_VIDEO, "Ico", anel + caixa(ret_arred(88, 88, 26), 56), 3))
L.append(ev(a_perfil, FIM_VIDEO, "Ico", anel + caixa(circulo(20), 56), 3))
L.append(ev(a_perfil, FIM_VIDEO, "Ico",
    rf"{{\an5\pos({p(xi)},{TIT_Y})\1c&HFFFFFF&\shad0{POP}\p1}}" + caixa(desloca(circulo(7), 25, -25), 56), 3))

open(OUT, "w").write(head + "\n".join(L) + "\n")
print(f"{len(L)} eventos -> {OUT}")
