# alinha as palavras do corte (tempos certos, texto do Whisper) ao roteiro (texto certo) → preparo/palavras.json
import json, re, difflib, unicodedata
P = "/home/user/skillreel/reel-nubank-uruguai/"
import sys
cw = json.load(open(sys.argv[1] if len(sys.argv) > 1 else P + "corte/cortepalavras.json"))
json.dump(cw, open(P + "preparo/transcript-bruto.json", "w", encoding="utf-8"), ensure_ascii=False)
rot = open(P + "voz/roteiro.txt", encoding="utf-8").read().split()
# como foi falado: "pra" (o roteiro diz "para" em dois desses lugares)
fala = []
for i, w in enumerate(rot):
    nxt = rot[i + 1] if i + 1 < len(rot) else ""
    if w.lower() == "para" and nxt.lower().strip(",.") in ("trabalhar", "não"): w = "pra"
    fala.append(w)
n = lambda s: unicodedata.normalize("NFD", re.sub(r"[^\w%]", "", s.lower())).encode("ascii", "ignore").decode()
A = [n(w[2]) for w in cw]; B = [n(w) for w in fala]
out = []
sm = difflib.SequenceMatcher(a=A, b=B, autojunk=False)
for op, a0, a1, b0, b1 in sm.get_opcodes():
    if op == "equal" or (op == "replace" and a1 - a0 == b1 - b0):
        for k in range(a1 - a0): out.append({"text": fala[b0 + k], "start": cw[a0 + k][0], "end": cw[a0 + k][1]})
        if op == "replace": print("troca:", [cw[a0 + k][2] for k in range(a1 - a0)], "→", fala[b0:b1])
    elif op == "replace":
        # n diferente: espalha as palavras do roteiro no intervalo do trecho
        s, e = cw[a0][0], cw[a1 - 1][1]; L = sum(len(x) for x in fala[b0:b1]); t = s
        for x in fala[b0:b1]:
            d = (e - s) * len(x) / L; out.append({"text": x, "start": round(t, 3), "end": round(t + d, 3)}); t += d
        print("reparte:", [w[2] for w in cw[a0:a1]], "→", fala[b0:b1])
    elif op == "insert":
        # palavra do roteiro que o Whisper não escreveu (ex.: "a" curto): encaixa no fim da anterior
        prev = out[-1] if out else {"end": 0}
        for x in fala[b0:b1]: out.append({"text": x, "start": prev["end"], "end": round(prev["end"] + 0.05, 3)})
        print("insere:", fala[b0:b1])
    elif op == "delete":
        print("descarta:", [w[2] for w in cw[a0:a1]])
json.dump({"words": out}, open(P + "preparo/palavras.json", "w", encoding="utf-8"), ensure_ascii=False)
print(len(out), "palavras ·", " ".join(w["text"] for w in out))
