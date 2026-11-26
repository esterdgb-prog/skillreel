#!/usr/bin/env python3
"""pixabay.py — busca e baixa imagens e vídeos de apoio do Pixabay para o reel (material com licença, R3).

A chave vem de PIXABAY_API_KEY (R10). Nunca é impressa nem gravada em arquivo.

  buscar   python3 pixabay.py buscar "pessoa digitando no notebook" [--tipo foto|video] [--n 9]
                   [--orientacao vertical|horizontal|todas] [--lang pt] [--folha qa/px-busca.jpg]
           Lista id, tamanho, duração, tags e autor. Com --folha monta uma folha de miniaturas numerada
           (para olhar antes de escolher).
  baixar   python3 pixabay.py baixar <id> [<id> ...] --projeto <pasta do reel> [--tipo foto|video]
                   [--ate 6] [--nome slug]
           Foto  → <P>/assets/banco/px-<id>.jpg (1280 px)
           Vídeo → <P>/assets/banco/px-<id>.mp4 (≤ 1080 px, 30 fps, keyframe a cada 1 s, sem áudio,
                   cortado em --ate segundos; sem keyframe a cada 1 s o render congela quadros)
           Copia também para <P>/motor/assets/img/ (foto) ou <P>/motor/assets/broll/ (vídeo) se o motor
           já existir, e acrescenta uma linha em <P>/assets/SOURCES.md (arquivo, página, autor, licença, data).

Uso no beats.js: foto → "assets/img/px-<id>.jpg" em K.fan / K.grid / K.orbit / K.wall / K.panel;
vídeo → K.broll("px-<id>.mp4", t0, t1) (ESTILO.md · vídeo de apoio).

Regras (R3): o Pixabay é banco de imagem de CONTEXTO (cena, objeto, ambiente, gesto). Nunca use como logo,
print de produto, capa, resultado ou "prova" — isso continua vindo da página oficial. Pessoa reconhecível em
foto/vídeo do banco não pode parecer cliente, aluno ou depoimento. Respostas da API ficam em cache por 24 h
(exigência dos termos do Pixabay) em ~/.cache/pixabay/.
"""
import argparse, datetime, hashlib, json, os, shutil, subprocess, sys, tempfile, time, urllib.parse, urllib.request

API = {"foto": "https://pixabay.com/api/", "video": "https://pixabay.com/api/videos/"}
CACHE = os.path.join(os.path.expanduser(os.environ.get("XDG_CACHE_HOME", "~/.cache")), "pixabay")
LICENCA = "Pixabay Content License (uso livre, sem atribuição obrigatória) — https://pixabay.com/service/license-summary/"
UA = {"User-Agent": "reel-skill/1.0"}


def chave():
    k = os.environ.get("PIXABAY_API_KEY", "").strip()
    if not k:
        sys.exit("PIXABAY_API_KEY não definida. Crie a chave em pixabay.com/api/docs/ e exporte a variável.")
    return k


def api(tipo, **params):
    """GET na API com cache de 24 h (a chave fica fora da chave do cache)."""
    params = {k: v for k, v in params.items() if v not in (None, "")}
    ident = hashlib.sha1(json.dumps([tipo, sorted(params.items())], ensure_ascii=False).encode()).hexdigest()
    os.makedirs(CACHE, exist_ok=True)
    cp = os.path.join(CACHE, ident + ".json")
    if os.path.exists(cp) and time.time() - os.path.getmtime(cp) < 86400:
        return json.load(open(cp, encoding="utf-8"))
    url = API[tipo] + "?" + urllib.parse.urlencode(dict(params, key=chave()))
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
            d = json.load(r)
    except urllib.error.HTTPError as e:
        msg = e.read().decode(errors="replace")[:200]
        sys.exit(f"Pixabay respondeu HTTP {e.code}: {msg}" + (" (chave inválida?)" if e.code in (400, 401, 403) else ""))
    json.dump(d, open(cp, "w", encoding="utf-8"), ensure_ascii=False)
    return d


def baixar_url(url, destino):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r, open(destino, "wb") as f:
        shutil.copyfileobj(r, f)


def melhor_video(h):
    """A menor versão com largura ≥ 1080 (ou a maior que houver)."""
    vs = [v for v in h["videos"].values() if v.get("url")]
    ok = sorted([v for v in vs if min(v["width"], v["height"]) >= 1080 or v["width"] >= 1080], key=lambda v: v["width"] * v["height"])
    return ok[0] if ok else max(vs, key=lambda v: v["width"] * v["height"])


def eh_ia(h):
    t = (h.get("tags") or "").lower()
    return any(k in t for k in ("ai gerado", "ai generated", "gerado por ia", "gerado por ai", "ia gerado", "generative ai"))


def miniatura(h, tipo):
    if tipo == "foto":
        return h.get("previewURL") or h.get("webformatURL")
    return (h["videos"].get("tiny") or {}).get("thumbnail") or (h["videos"].get("small") or {}).get("thumbnail")


def cmd_buscar(a):
    p = {"q": a.termos, "lang": a.lang, "per_page": max(3, min(200, a.n)), "safesearch": "true", "order": "popular"}
    if a.tipo == "foto":
        p["image_type"] = "photo"
    if a.orientacao != "todas" and a.tipo == "foto":
        p["orientation"] = a.orientacao
    d = api(a.tipo, **p)
    hits = d.get("hits", [])
    if a.orientacao != "todas" and a.tipo == "video":  # a API de vídeo não filtra orientação
        vert = lambda h: (lambda v: v["height"] > v["width"])(melhor_video(h))
        hits = [h for h in hits if vert(h) == (a.orientacao == "vertical")]
    hits = hits[: a.n]
    print(f'Pixabay · {a.tipo} · "{a.termos}" · {d.get("totalHits", 0)} resultados (mostrando {len(hits)})')
    for i, h in enumerate(hits, 1):
        if a.tipo == "foto":
            dim, extra = f'{h["imageWidth"]}×{h["imageHeight"]}', ""
        else:
            v = melhor_video(h)
            dim, extra = f'{v["width"]}×{v["height"]}', f' · {h["duration"]} s'
        ia = " · ⚠ GERADO POR IA (evite: não é cena real)" if eh_ia(h) else ""
        print(f'{i:>2}. id {h["id"]} · {dim}{extra} · {h["tags"]} · por {h["user"]}{ia} · {h["pageURL"]}')
    if a.folha and hits:
        folha(hits, a.tipo, a.folha)
        print(f"folha de miniaturas: {a.folha}")


def folha(hits, tipo, saida):
    """Folha de miniaturas numerada (ffmpeg) para escolher olhando."""
    tmp = tempfile.mkdtemp(prefix="px-folha-")
    try:
        ims = []
        for i, h in enumerate(hits, 1):
            u = miniatura(h, tipo)
            if not u:
                continue
            f = os.path.join(tmp, f"{i:02d}.jpg")
            try:
                baixar_url(u, f)
            except Exception:
                continue
            g = os.path.join(tmp, f"t{i:02d}.png")
            txt = f"{i}  id {h['id']}"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f, "-vf",
                            "scale=320:320:force_original_aspect_ratio=increase,crop=320:320,pad=320:340:0:0:color=0x111111,"
                            f"drawtext=text='{txt}':x=8:y=318:fontsize=18:fontcolor=white", g], check=False)
            if os.path.exists(g):
                ims.append(g)
        if not ims:
            return
        cols = min(3, len(ims))
        rows = (len(ims) + cols - 1) // cols
        while len(ims) < cols * rows:
            ims.append(ims[-1])
        args = ["ffmpeg", "-v", "error", "-y"]
        for g in ims:
            args += ["-i", g]
        lay = "|".join(f"{(k % cols) * 320}_{(k // cols) * 340}" for k in range(len(ims)))
        os.makedirs(os.path.dirname(os.path.abspath(saida)), exist_ok=True)
        args += ["-filter_complex", f"xstack=inputs={len(ims)}:layout={lay}:fill=black", "-frames:v", "1", saida]
        if len(ims) == 1:
            args = ["ffmpeg", "-v", "error", "-y", "-i", ims[0], saida]
        subprocess.run(args, check=False)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def registrar(P, arquivo, h, tipo):
    os.makedirs(os.path.join(P, "assets"), exist_ok=True)
    sp = os.path.join(P, "assets", "SOURCES.md")
    novo = not os.path.exists(sp)
    linhas = open(sp, encoding="utf-8").read() if not novo else ""
    if f"`{arquivo}`" in linhas:
        return
    with open(sp, "a", encoding="utf-8") as f:
        if novo:
            f.write("# Fontes do material\n\n| arquivo | origem | autor | licença | data |\n|---|---|---|---|---|\n")
        elif "| arquivo |" not in linhas:
            f.write("\n| arquivo | origem | autor | licença | data |\n|---|---|---|---|---|\n")
        hoje = datetime.date.today().isoformat()
        f.write(f'| `{arquivo}` | Pixabay ({tipo} {h["id"]}, banco de contexto): {h["pageURL"]} | {h["user"]} | {LICENCA} | {hoje} |\n')


def cmd_baixar(a):
    P = os.path.abspath(a.projeto)
    banco = os.path.join(P, "assets", "banco")
    os.makedirs(banco, exist_ok=True)
    motor = os.path.join(P, "motor", "assets")
    for i, ident in enumerate(a.ids):
        d = api(a.tipo, id=ident, lang="pt")
        if not d.get("hits"):
            print(f"id {ident}: não encontrado como {a.tipo}")
            continue
        h = d["hits"][0]
        base = f"px-{ident}" + (f"-{a.nome}" if a.nome and len(a.ids) == 1 else "")
        if a.tipo == "foto":
            nome = base + ".jpg"
            out = os.path.join(banco, nome)
            baixar_url(h.get("largeImageURL") or h["webformatURL"], out)
            sub = "img"
            info = f'{h["imageWidth"]}×{h["imageHeight"]} (baixado 1280 px)'
        else:
            nome = base + ".mp4"
            out = os.path.join(banco, nome)
            v = melhor_video(h)
            with tempfile.TemporaryDirectory() as tmp:
                raw = os.path.join(tmp, "raw.mp4")
                baixar_url(v["url"], raw)
                vf = "scale='if(gt(iw,ih),-2,min(1080,iw))':'if(gt(iw,ih),min(1080,ih),-2)',fps=30"
                corte = ["-t", str(a.ate)] if a.ate else []
                cmd = ["ffmpeg", "-v", "error", "-y", "-i", raw, *corte, "-an", "-vf", vf, "-c:v", "libx264", "-crf", "18",
                       "-preset", "medium", "-g", "30", "-keyint_min", "30", "-pix_fmt", "yuv420p", "-movflags", "+faststart"]
                subprocess.run(cmd + [out], check=True)
            sub = "broll"
            dur = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out],
                                 capture_output=True, text=True).stdout.strip()
            info = f'{v["width"]}×{v["height"]} → 30 fps, {float(dur or 0):.1f} s, sem áudio'
        if os.path.isdir(motor):
            os.makedirs(os.path.join(motor, sub), exist_ok=True)
            shutil.copy2(out, os.path.join(motor, sub, nome))
        registrar(P, nome, h, a.tipo)
        uso = f"assets/img/{nome}" if a.tipo == "foto" else f'K.broll("{nome}", t0, t1)'
        print(f"{nome} · {info} · por {h['user']} · {h['tags']}\n   → assets/banco/{nome}"
              f"{' + motor/assets/' + sub + '/' if os.path.isdir(motor) else ''} · no beats.js: {uso}")
    print(f"SOURCES.md atualizado: {os.path.join(P, 'assets', 'SOURCES.md')}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest="cmd", required=True)
    b = sp.add_parser("buscar")
    b.add_argument("termos")
    b.add_argument("--tipo", choices=["foto", "video"], default="foto")
    b.add_argument("--n", type=int, default=9)
    b.add_argument("--orientacao", choices=["vertical", "horizontal", "todas"], default="todas")
    b.add_argument("--lang", default="pt")
    b.add_argument("--folha")
    d = sp.add_parser("baixar")
    d.add_argument("ids", nargs="+")
    d.add_argument("--projeto", required=True)
    d.add_argument("--tipo", choices=["foto", "video"], default="foto")
    d.add_argument("--ate", type=float, default=6.0, help="vídeo: segundos mantidos (0 = inteiro)")
    d.add_argument("--nome", help="sufixo legível do arquivo (só com um id)")
    a = ap.parse_args()
    (cmd_buscar if a.cmd == "buscar" else cmd_baixar)(a)


if __name__ == "__main__":
    main()
