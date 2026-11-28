#!/usr/bin/env python3
"""midias.py — controle das mídias do Pixabay já usadas nos reels da Resultax, para NÃO repetir cena/foto entre vídeos.
O registro fica em ../midias-usadas.json (versionado com a skill).

    python3 midias.py usadas                         lista tudo o que já foi usado, por reel
    python3 midias.py filtrar qa/busca/*.txt         marca nas buscas os ids já usados (⛔ JÁ USADA em reel-XX)
    python3 midias.py checar <projeto>               confere o assets/SOURCES.md do projeto: algum id repetido?
    python3 midias.py registrar <reel-NN> <projeto>  depois da entrega aprovada: grava os ids do SOURCES.md do projeto

Regra: nenhum id que já está no registro entra num vídeo novo (vale vídeo e foto). Se a busca só trouxer repetidos,
mude os termos (sinônimos, outro ângulo, outra cidade) em vez de repetir.
"""
import glob
import json
import os
import re
import sys

REG = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "midias-usadas.json")


def carregar():
    return json.load(open(REG)) if os.path.exists(REG) else {}


def usados(reg):
    m = {}
    for reel, ids in reg.items():
        if reel.startswith("_"):
            continue
        for i in ids:
            m.setdefault(str(i), []).append(reel)
    return m


def ids_do_projeto(proj):
    p = os.path.join(proj, "assets", "SOURCES.md")
    return sorted(set(re.findall(r"`px-(\d+)-", open(p).read()))) if os.path.exists(p) else []


def main():
    if len(sys.argv) < 2:
        print(__doc__); return
    cmd, reg = sys.argv[1], carregar()
    u = usados(reg)
    if cmd == "usadas":
        for reel, ids in reg.items():
            if not reel.startswith("_"):
                print(f"{reel}: {len(ids)} mídias · {' '.join(map(str, ids))}")
    elif cmd == "filtrar":
        for f in [x for a in sys.argv[2:] for x in glob.glob(a)]:
            print(f"== {f}")
            for ln in open(f):
                m = re.search(r"id (\d+)", ln)
                if m and m.group(1) in u:
                    ln = ln.rstrip() + f"   ⛔ JÁ USADA em {', '.join(u[m.group(1)])}\n"
                print(ln, end="")
    elif cmd == "checar":
        rep = [(i, u[i]) for i in ids_do_projeto(sys.argv[2]) if i in u]
        print("nenhuma mídia repetida" if not rep else "\n".join(f"⛔ px-{i} já usada em {', '.join(r)}" for i, r in rep))
        sys.exit(1 if rep else 0)
    elif cmd == "registrar":
        reel, ids = sys.argv[2], ids_do_projeto(sys.argv[3])
        reg[reel] = sorted(set(map(str, reg.get(reel, []))) | set(ids), key=int)
        json.dump(reg, open(REG, "w"), indent=1, ensure_ascii=False)
        print(f"{reel}: {len(reg[reel])} mídias registradas em {REG}")
    else:
        print(__doc__)


if __name__ == "__main__":
    main()
