#!/usr/bin/env python3
"""Gera legendas dinâmicas (.ass) a partir do words.json do whisper.

Estilo: 1-3 palavras por vez, caixa alta, entrada com "pop", palavra falada
acende em amarelo; termos de erro ficam em vermelho e de acerto em verde
(as mesmas cores dos braços pintados no vídeo).
"""
import json, re, sys

SRC = sys.argv[1] if len(sys.argv) > 1 else "words.json"
OUT = sys.argv[2] if len(sys.argv) > 2 else "legenda.ass"

# ---- palavras do whisper ----
raw = []
for s in json.load(open(SRC))["transcription"]:
    t = s["text"].strip()
    if t:
        raw.append([t, s["offsets"]["from"] / 1000, s["offsets"]["to"] / 1000])

# ---- correções de texto (índice -> texto exibido) e de tempo ----
FIX_TXT = {"gangurra": "gangorra", "pudal": "pulldown"}
# inícios de frase em que o whisper comprimiu/adiantou as palavras
# (corrigidos pelas pausas medidas com silencedetect: fala volta em 0,49 · 8,00 · 17,86 · 24,83)
FIX_T = {
    0: (0.47, 0.60), 1: (0.60, 0.70), 2: (0.70, 0.96),
    24: (7.99, 8.13), 25: (8.13, 8.22), 26: (8.22, 8.41),
    61: (17.86, 17.97), 62: (17.97, 18.05), 63: (18.05, 18.30), 64: (18.30, 18.40),
    65: (18.40, 18.48), 66: (18.48, 18.80),
    83: (24.83, 24.90), 84: (24.90, 24.97), 85: (24.97, 25.04), 86: (25.04, 25.22),
    87: (25.22, 25.32), 88: (25.32, 25.49),
}
words = []
for i, (t, a, b) in enumerate(raw):
    clean = re.sub(r"[.,!?]", "", t)
    clean = FIX_TXT.get(clean.lower(), clean)
    if i in FIX_T:
        a, b = FIX_T[i]
    words.append({"t": clean.upper(), "a": a, "b": b, "pausa": t[-1] in ".,"})

# ---- grupos (feitos à mão para quebrar no sentido da frase) ----
GRUPOS = """
QUANDO ELE | ENTENDER QUE | NA PUXADA | TRIÂNGULO | ELE NÃO FICA | FAZENDO GANGORRA | PARA TRÁS | E SIM |
LEVEMENTE | INCLINADO | AÍ SIM | AS COSTAS | DELE VÊM |
QUANDO ELE | ENTENDER QUE | NO PULLDOWN | ELE NÃO FICA | EM PÉ | E SIM COM | O PEITO | APONTADO | PARA O CHÃO |
E QUANDO ELE | PUXAR O BRAÇO | NÃO FICA | DOBRANDO | E ESTICANDO | AÍ SIM | AS COSTAS | DELE VÊM |
QUANDO ELE | ENTENDER QUE | NA PUXADA | FRENTE | O COTOVELO | DELE FICA | PARA FRENTE | E NÃO | PARA TRÁS |
AÍ AS COSTAS | DELE VÊM |
E SE ELE | SEGUISSE | MEU PERFIL | ELE NÃO | ESTAVA | TREINANDO | ERRADO | ASSIM
"""
grupos = [g.split() for g in GRUPOS.replace("\n", " ").split("|") if g.strip()]

# cor por palavra (índice global): vermelho = erro, verde = acerto
VERMELHO = {"GANGORRA", "DOBRANDO", "ESTICANDO", "ERRADO"}
VERDE = {"LEVEMENTE", "INCLINADO", "PEITO", "APONTADO", "CHÃO", "COSTAS", "VÊM", "COTOVELO"}
# frases inteiras coloridas por contexto: (primeiro índice, último índice, cor)
FAIXAS = []

# ---- casa os grupos com as palavras ----
idx, blocos = 0, []
for g in grupos:
    bloco = []
    for w in g:
        assert words[idx]["t"] == w, f"descompasso em {idx}: {words[idx]['t']} != {w}"
        bloco.append(idx)
        idx += 1
    blocos.append(bloco)
assert idx == len(words), f"sobraram palavras: {[w['t'] for w in words[idx:]]}"

# erros/acertos que dependem do contexto
def marca(seq, cor):
    for b in blocos:
        ts = [words[i]["t"] for i in b]
        if ts == seq:
            for i in b:
                words[i]["cor"] = cor
for seq in (["PARA", "TRÁS"], ["EM", "PÉ"]):
    marca(seq, "R")
marca(["PARA", "FRENTE"], "G")
for w in words:
    if "cor" not in w:
        w["cor"] = "R" if w["t"] in VERMELHO else "G" if w["t"] in VERDE else ""

# ---- ASS ----
BRANCO, AMARELO = "&H00FFFFFF&", "&H0000E6FF&"
VERM, VERM_ON = "&H004040FF&", "&H002A2AFF&"
VERD, VERD_ON = "&H0050E24A&", "&H0040FF3C&"

def ts(x):
    x = max(0, x)
    h, r = divmod(x, 3600); m, s = divmod(r, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"

def cor(w, ativa):
    if w["cor"] == "R": return VERM_ON if ativa else VERM
    if w["cor"] == "G": return VERD_ON if ativa else VERD
    return AMARELO if ativa else BRANCO

head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Inter Black,100,&H00FFFFFF,&H00FFFFFF,&H00000000,&H90000000,-1,0,0,0,100,100,0,0,1,7,4,5,70,70,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
X, Y = 540, 1290
linhas = []
for k, b in enumerate(blocos):
    ini = words[b[0]]["a"]
    fim_fala = words[b[-1]]["b"]
    prox = words[blocos[k + 1][0]]["a"] if k + 1 < len(blocos) else fim_fala + 0.6
    # segura até o próximo grupo; numa pausa longa, some 0,25 s depois da fala
    fim = prox if prox - fim_fala < 0.4 else fim_fala + 0.25
    for j, i in enumerate(b):
        a = ini if j == 0 else words[i]["a"]
        z = words[b[j + 1]]["a"] if j + 1 < len(b) else fim
        if z <= a: continue
        pop = r"\fscx70\fscy70\t(0,90,\fscx106\fscy106)\t(90,160,\fscx100\fscy100)" if j == 0 else ""
        txt = " ".join(
            "{\\c%s}%s" % (cor(words[q], q == i), words[q]["t"]) for q in b
        )
        linhas.append(f"Dialogue: 0,{ts(a)},{ts(z)},Cap,,0,0,0,,{{\\an5\\pos({X},{Y}){pop}}}{txt}")

open(OUT, "w").write(head + "\n".join(linhas) + "\n")
print(f"{len(blocos)} grupos, {len(linhas)} eventos -> {OUT}")
