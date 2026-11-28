#!/usr/bin/env python3
"""Legenda com o texto certo: alinha as palavras transcritas (tempos certos, texto do Whisper) ao roteiro (texto certo).

uso: alinhar-roteiro.py palavras-whisper.json roteiro.txt saida.json
- O roteiro manda no texto. Escreva-o COMO FOI FALADO ("pra" onde a pessoa disse "pra"; o Whisper sempre escreve "para").
- Trocas 1:1 viram o texto do roteiro com o tempo do Whisper (ex.: "Risultex" → "Resultax", "Bill" → "bio", "agente" → "agende").
- Trechos com contagem diferente ("100 %" → "100%") repartem o intervalo; palavras que o Whisper não escreveu ("a" curto)
  entram coladas na anterior. Tudo é impresso: leia e confira.
saída: {"words": [{"text", "start", "end"}]} — o formato que o preparar.sh aceita em --palavras.
"""
import sys, json, re, difflib, unicodedata
cw = json.load(open(sys.argv[1], encoding="utf-8"))
fala = open(sys.argv[2], encoding="utf-8").read().split()
n = lambda s: unicodedata.normalize("NFD", re.sub(r"[^\w%]", "", s.lower())).encode("ascii", "ignore").decode()
A = [n(w[2]) for w in cw]; B = [n(w) for w in fala]
out = []
for op, a0, a1, b0, b1 in difflib.SequenceMatcher(a=A, b=B, autojunk=False).get_opcodes():
    if op == "equal" or (op == "replace" and a1 - a0 == b1 - b0):
        for k in range(a1 - a0): out.append({"text": fala[b0 + k], "start": cw[a0 + k][0], "end": cw[a0 + k][1]})
        if op == "replace": print("troca:", [cw[a0 + k][2] for k in range(a1 - a0)], "→", fala[b0:b1])
    elif op == "replace":
        s, e = cw[a0][0], cw[a1 - 1][1]; L = sum(len(x) for x in fala[b0:b1]); t = s
        for x in fala[b0:b1]:
            d = (e - s) * len(x) / L; out.append({"text": x, "start": round(t, 3), "end": round(t + d, 3)}); t += d
        print("reparte:", [w[2] for w in cw[a0:a1]], "→", fala[b0:b1])
    elif op == "insert":
        prev = out[-1] if out else {"end": 0}
        for x in fala[b0:b1]: out.append({"text": x, "start": prev["end"], "end": round(prev["end"] + 0.05, 3)})
        print("insere:", fala[b0:b1])
    elif op == "delete":
        print("descarta (confira se é fala fora do roteiro):", [w[2] for w in cw[a0:a1]])
json.dump({"words": out}, open(sys.argv[3], "w", encoding="utf-8"), ensure_ascii=False)
print(len(out), "palavras →", sys.argv[3])
