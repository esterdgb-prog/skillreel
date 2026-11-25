# v2: mistura planos do vídeo original com as imagens novas animadas; opcionalmente legendada.
# Uso:
#   python3 scripts/video2.py <original.mp4> <imgs_dir> <saida.mp4> [--legenda]
#   python3 scripts/video2.py <original.mp4> <imgs_dir> <pasta_png> --at 1.0,2.0 [--legenda]
import sys, os, subprocess, math
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
sys.path.insert(0, os.path.dirname(__file__))
from timeline import DUR
from timeline_v2 import CAPTIONS
from video import Reader, Still, radial_blur, glow, flash, ease, interp, W, H, FPS, WHITE

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "..", "fonts")
GOLD_TOP, GOLD_BOT = (232, 211, 160), (184, 145, 90)       # degradê do dourado das letras das imagens (RGB)

# ------------------------------------------------------------------ planos
# vídeo: src=[(t, t_original)], cam=[(t, zoom, cx, cy)] em pixels do vídeo
# imagem: img="imgNN", cam=[(t, zoom, cx, cy)] em pixels da imagem ampliada; zoom 1 = imagem inteira na largura/altura
#   fx: efeitos — flames (auto), sweep=(t0, dur), dust=n, sand=(x, y0, y1), spot=(t0, x, y, r), yaw=graus
def V(name, a, b, src, cam, kick=0.0):
    return dict(kind="vid", name=name, a=a, b=b, src=src, cam=cam, kick=kick)


def I(name, a, b, img, cam, kick=0.0, **fx):
    return dict(kind="img", name=name, a=a, b=b, img=img, cam=cam, kick=kick, fx=fx)


SHOTS = [
    V("porta-1", 0.00, 1.55, [(0, 0.60), (1.55, 2.15)], [(0, 1.00, 540, 960), (1.55, 1.07, 540, 990)]),
    I("livro", 1.55, 3.30, "img04", [(1.55, 1.08, 760, 1500), (3.30, 1.20, 740, 1600)], 0.05, flames=True, dust=40, yaw=2.0),
    I("livro pagina", 3.30, 4.75, "img04", [(3.30, 2.05, 560, 1830), (4.75, 2.20, 600, 1820)], 0.06, flames=True, dust=25),
    V("porta-1 abre", 4.75, 6.60, [(4.75, 5.35), (6.60, 8.85)], [(4.75, 1.00, 540, 960), (6.60, 1.18, 660, 980)], 0.04),
    I("coroa", 6.60, 8.75, "img01", [(6.60, 1.05, 800, 1500), (8.75, 1.16, 820, 1580)], flames=True, dust=50, yaw=-2.0),
    V("velas close", 8.75, 11.40, [(8.75, 13.90), (11.40, 16.60)], [(8.75, 1.28, 560, 900), (11.40, 1.36, 540, 820)], 0.06),
    I("balanca", 11.40, 14.85, "img02", [(11.40, 1.02, 774, 1400), (14.85, 1.18, 774, 1330)], dust=45, yaw=3.0, sweep=(12.2, 1.1), flames=True),
    I("selo", 14.85, 17.40, "img03", [(14.85, 1.55, 960, 1640), (17.40, 1.70, 950, 1630)], 0.07, dust=30, sweep=(15.0, 0.9), yaw=-2.5),
    I("1 janeiro", 17.40, 20.95, "img08", [(17.40, 1.02, 820, 1360), (20.95, 1.20, 860, 1330)], dust=45, yaw=2.5),
    I("sacola e nota", 20.95, 23.40, "img05", [(20.95, 1.12, 800, 1820), (23.40, 1.24, 860, 1900)], 0.07, dust=35, sweep=(21.1, 1.0), yaw=-2.0),
    V("sino", 23.40, 26.15, [(23.40, 19.35), (26.15, 22.10)], [(23.40, 1.00, 540, 960), (26.15, 1.08, 540, 930)]),
    V("corredor", 26.15, 28.15, [(26.15, 29.20), (28.15, 31.80)], [(26.15, 1.05, 540, 980), (28.15, 1.14, 540, 990)], 0.05),
    V("porta abrindo", 28.15, 31.20, [(28.15, 48.95), (31.20, 54.70)], [(28.15, 1.00, 540, 960), (31.20, 1.18, 430, 1040)]),
    I("calendario advento", 31.20, 34.85, "img06", [(31.20, 1.95, 1420, 690), (34.85, 2.25, 1380, 660)], dust=50),
    I("portinha 1", 34.85, 36.00, "img06", [(34.85, 3.30, 1020, 420), (36.00, 3.55, 990, 400)], 0.07, dust=30, spot=(34.85, 934, 314, 125)),
    I("armario", 36.00, 36.60, "img07", [(36.00, 1.00, 768, 1450), (36.60, 1.05, 768, 1450)], dust=40),
    I("moeda", 36.60, 37.20, "img07", [(36.60, 2.25, 590, 1235), (37.20, 2.40, 590, 1235)], 0.06, sweep=(36.65, 0.5)),
    I("nota fiscal", 37.20, 37.80, "img07", [(37.20, 2.25, 1030, 1190), (37.80, 2.40, 1030, 1200)], 0.06),
    I("casinha", 37.80, 38.40, "img07", [(37.80, 2.25, 580, 1900), (38.40, 2.40, 580, 1900)], 0.06),
    I("carrinho", 38.40, 39.00, "img07", [(38.40, 2.25, 1040, 1960), (39.00, 2.40, 1040, 1960)], 0.06),
    I("ampulheta", 39.00, 41.40, "img10", [(39.00, 1.00, 768, 1400), (41.40, 1.10, 768, 1420)], dust=55, sand=(768, 1190, 1560), sweep=(39.4, 1.2)),
    V("relogio zoom", 41.40, 43.20, [(41.40, 62.60), (43.20, 66.80)], [(41.40, 1.00, 540, 960), (43.20, 1.08, 540, 960)], 0.06),
    I("assunto de todos", 43.20, 45.70, "img09", [(43.20, 1.00, 768, 1400), (45.70, 1.08, 768, 1420)], dust=45),
    V("porta-2 abre", 45.70, 49.20, [(45.70, 72.20), (49.20, 78.30)], [(45.70, 1.05, 560, 980), (49.20, 1.30, 740, 1080)]),
    V("anel e logo", 49.20, DUR, [(49.20, 80.00), (51.20, 84.20), (DUR, 84.20 + DUR - 51.20)], [(49.20, 1.00, 540, 960), (DUR, 1.07, 540, 960)]),
]

TRANS = {
    6.60: ("flash", 0.35, 0.50), 11.40: ("zoomblur", 0.20, 0.26), 17.40: ("flash", 0.20, 0.32),
    23.40: ("whip", 0.15, 0.15), 28.15: ("zoomblur", 0.18, 0.24), 31.20: ("flash", 0.30, 0.35),
    36.00: ("flash", 0.20, 0.25), 39.00: ("zoomblur", 0.18, 0.24), 43.20: ("flash", 0.25, 0.32),
    45.70: ("whip", 0.15, 0.15), 49.20: ("flash", 0.40, 0.55),
}
GLOW = [14.85, 20.95, 28.20, 51.35]

# ------------------------------------------------------------------ imagens
_IMG = {}


def load_img(name, imgs_dir):
    if name not in _IMG:
        im = cv2.imread(os.path.join(imgs_dir, name + ".png")).astype(np.float32)
        h, w = im.shape[:2]
        sc = min(W / w, H / h)
        # fundo para quando a imagem não cobre o quadro (paisagem): versão desfocada e escurecida
        cov = max(W / w, H / h)
        bg = cv2.resize(im, (int(w * cov) + 2, int(h * cov) + 2), interpolation=cv2.INTER_AREA)
        y0 = (bg.shape[0] - H) // 2; x0 = (bg.shape[1] - W) // 2
        bg = cv2.GaussianBlur(bg[y0:y0 + H, x0:x0 + W], (0, 0), 28) * 0.55
        _IMG[name] = dict(im=im, sc=sc, bg=bg, flames=find_flames(im))
    return _IMG[name]


def find_flames(im):
    hsv = cv2.cvtColor(im.astype(np.uint8), cv2.COLOR_BGR2HSV)
    m = ((hsv[..., 2] > 248) & (hsv[..., 1] < 120)).astype(np.uint8)
    n, lab, st, cen = cv2.connectedComponentsWithStats(m)
    out = []
    for i in range(1, n):
        x, y, w, h, a = st[i]
        if 40 < a < 6000 and h > w * 1.1:      # chamas: manchas claras, mais altas que largas
            out.append((cen[i][0], cen[i][1], max(w, h)))
    return out


def img_matrix(d, z, cx, cy, yaw_deg):
    s = d["sc"] * z
    hw, hh = W / 2 / s, H / 2 / s
    ih, iw = d["im"].shape[:2]
    if iw * s >= W: cx = min(max(cx, hw), iw - hw)
    else: cx = iw / 2
    if ih * s >= H: cy = min(max(cy, hh), ih - hh)
    else: cy = ih / 2
    src = np.float32([[cx - hw, cy - hh], [cx + hw, cy - hh], [cx + hw, cy + hh], [cx - hw, cy + hh]])
    # leve rotação 3D (yaw): encolhe um lado do retângulo de origem
    k = math.tan(math.radians(yaw_deg)) * 0.5
    dy = hh * k
    src[0, 1] += dy; src[3, 1] -= dy; src[1, 1] -= dy; src[2, 1] += dy
    dst = np.float32([[0, 0], [W, 0], [W, H], [0, H]])
    return cv2.getPerspectiveTransform(src, dst)


def img_frame(sh, t, imgs_dir, extra=1.0):
    d = load_img(sh["img"], imgs_dir); fx = sh["fx"]
    z = interp(sh["cam"], t, 1); cx = interp(sh["cam"], t, 2); cy = interp(sh["cam"], t, 3)
    if sh["kick"]:
        p = (t - sh["a"]) / 0.35
        if 0 <= p < 1: z *= 1 + sh["kick"] * (1 - p) ** 3
    z *= extra
    p = (t - sh["a"]) / max(0.01, sh["b"] - sh["a"])
    yaw = fx.get("yaw", 0) * (p - 0.5) * 2
    M = img_matrix(d, z, cx, cy, yaw)
    ih, iw = d["im"].shape[:2]
    covers = iw * d["sc"] * z >= W - 1 and ih * d["sc"] * z >= H - 1
    if covers:
        out = cv2.warpPerspective(d["im"], M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
    else:
        out = cv2.warpPerspective(d["im"], M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT,
                                  borderValue=(-1, -1, -1))
        hole = out[..., 0] < 0
        out[hole] = d["bg"][hole]
        # costura suave entre imagem e fundo
        mk = cv2.GaussianBlur((~hole).astype(np.float32), (0, 0), 6)[..., None]
        out = out * mk + d["bg"] * (1 - mk)
    seed = sum(map(ord, sh["name"])) * 7 % 10000
    if fx.get("flames"): out = flicker(out, d["flames"], M, t, seed)
    if "sweep" in fx: out = sweep(out, t, *fx["sweep"])
    if "sand" in fx: out = sand(out, M, t, *fx["sand"], seed=seed)
    if "spot" in fx: out = spot(out, M, t, *fx["spot"])
    if fx.get("dust"): out = dust(out, t, fx["dust"], seed)
    return out


def warp_pt(M, x, y):
    v = M @ np.array([x, y, 1.0]); return v[0] / v[2], v[1] / v[2]


def _noise(t, k):
    return (0.55 * math.sin(t * 11.3 + k * 1.7) + 0.3 * math.sin(t * 23.1 + k * 3.1) + 0.15 * math.sin(t * 41.7 + k))


def flicker(out, flames, M, t, seed):
    if not flames: return out
    layer = np.zeros((H // 4, W // 4), np.float32)
    for k, (x, y, sz) in enumerate(flames):
        ox, oy = warp_pt(M, x, y)
        if -100 < ox < W + 100 and -100 < oy < H + 100:
            a = 0.55 + 0.45 * _noise(t, k + seed)
            r = max(6, int(sz * 0.6 / 4 * (M[0, 0] if M[0, 0] > 0 else 1)))
            cv2.circle(layer, (int(ox / 4), int(oy / 4)), r, a, -1)
    if layer.max() <= 0: return out
    layer = cv2.GaussianBlur(layer, (0, 0), 9)
    layer = cv2.resize(layer, (W, H), interpolation=cv2.INTER_LINEAR)[..., None]
    warm = np.array([120, 190, 255], np.float32)
    return out + layer * warm * 0.35


def sweep(out, t, t0, d):
    p = (t - t0) / d
    if not (0 <= p <= 1): return out
    hsv = cv2.cvtColor(np.clip(out, 0, 255).astype(np.uint8), cv2.COLOR_BGR2HSV)
    metal = ((hsv[..., 0] > 8) & (hsv[..., 0] < 35) & (hsv[..., 1] > 70) & (hsv[..., 2] > 110)).astype(np.float32)
    metal = cv2.GaussianBlur(metal, (0, 0), 3)
    yy, xx = np.mgrid[0:H:4, 0:W:4]
    pos = (xx + yy * 0.55) / (W + H * 0.55)            # faixa diagonal
    c = -0.2 + 1.4 * ease(p)
    band = np.exp(-((pos - c) / 0.06) ** 2).astype(np.float32)
    band = cv2.resize(band, (W, H), interpolation=cv2.INTER_LINEAR)
    return out + (band * metal * math.sin(math.pi * p))[..., None] * np.array([150, 215, 255], np.float32) * 0.9


def dust(out, t, n, seed):
    r = np.random.default_rng(seed)
    x0 = r.uniform(0, W, n); y0 = r.uniform(0, H, n); sp = r.uniform(12, 45, n)
    sz = r.uniform(1.2, 3.6, n); ph = r.uniform(0, 6.28, n); fr = r.uniform(0.6, 1.8, n)
    layer = np.zeros((H, W), np.float32)
    for i in range(n):
        x = (x0[i] + 18 * math.sin(t * 0.7 + ph[i])) % W
        y = (y0[i] - sp[i] * t) % H
        a = 0.35 + 0.65 * (0.5 + 0.5 * math.sin(t * fr[i] * 3 + ph[i]))
        cv2.circle(layer, (int(x), int(y)), int(round(sz[i])), float(a), -1, lineType=cv2.LINE_AA)
    layer = cv2.GaussianBlur(layer, (0, 0), 1.6)
    return out + layer[..., None] * np.array([150, 205, 255], np.float32) * 0.8


def sand(out, M, t, x, y0, y1, seed=0):
    ox, oy0 = warp_pt(M, x, y0); _, oy1 = warp_pt(M, x, y1)
    layer = np.zeros((H, W), np.float32)
    r = np.random.default_rng(seed)
    L = oy1 - oy0
    for i in range(70):
        ph = r.uniform(0, 1); spd = r.uniform(0.9, 1.3)
        q = (ph + t * spd * 1.6) % 1.0
        yy = oy0 + L * q ** 1.6
        xx = ox + r.uniform(-2.5, 2.5) * (0.4 + q)
        cv2.circle(layer, (int(xx), int(yy)), 2, float(0.6 + 0.4 * r.uniform()), -1, lineType=cv2.LINE_AA)
    cv2.line(layer, (int(ox), int(oy0)), (int(ox), int(oy0 + L * 0.85)), 0.35, 2, lineType=cv2.LINE_AA)
    layer = cv2.GaussianBlur(layer, (0, 0), 1.2)
    return out + layer[..., None] * np.array([120, 200, 255], np.float32)


def spot(out, M, t, t0, x, y, r):
    p = ease((t - t0) / 0.35)
    if p <= 0: return out
    ox, oy = warp_pt(M, x, y); rr = r * M[0, 0] if M[0, 0] > 0 else r
    yy, xx = np.mgrid[0:H:4, 0:W:4]
    d = np.sqrt((xx - ox) ** 2 + (yy - oy) ** 2) / rr
    m = np.clip(1.25 - d * 0.75, 0, 1).astype(np.float32)
    m = cv2.resize(m, (W, H), interpolation=cv2.INTER_LINEAR)[..., None]
    g = np.exp(-(d / 1.0) ** 2).astype(np.float32)
    g = cv2.resize(g, (W, H), interpolation=cv2.INTER_LINEAR)[..., None]
    pulse = 0.85 + 0.15 * math.sin((t - t0) * 9)
    out = out * (1 - p * 0.78 * (1 - m)) + g * np.array([110, 200, 255], np.float32) * 0.7 * p * pulse
    return out


# ------------------------------------------------------------------ legendas
_yy = np.arange(H, dtype=np.float32)[:, None] * np.ones((1, W), np.float32)
BAND = np.clip(1 - np.abs(_yy - 1440) / 230, 0, 1) ** 1.5      # faixa escura suave atrás da legenda
class Captions:
    def __init__(self):
        self.body = ImageFont.truetype(os.path.join(FONTS, "CormorantGaramond-VF.ttf"), 90)
        try: self.body.set_variation_by_name(b"Bold")
        except Exception: pass
        self.deco = ImageFont.truetype(os.path.join(FONTS, "CinzelDecorative-Bold.ttf"), 78)
        self.cache = {}

    def _tokens(self, text):
        out = []; deco = False
        for part in text.split("*"):
            for w in part.split():
                out.append((w, deco))
            deco = not deco
        return out

    def render(self, text):
        if text in self.cache: return self.cache[text]
        toks = self._tokens(text); maxw = 800; space = 22
        lines, cur, cw = [], [], 0
        for w, dc in toks:
            f = self.deco if dc else self.body
            ww = f.getlength(w)
            if cur and cw + space + ww > maxw: lines.append(cur); cur, cw = [], 0
            cur.append((w, dc, ww)); cw += (space if len(cur) > 1 else 0) + ww
        if cur: lines.append(cur)
        lh = 104; pad = 44
        Wc, Hc = W, lh * len(lines) + pad * 2
        mask = Image.new("L", (Wc, Hc), 0); d = ImageDraw.Draw(mask)
        for li, line in enumerate(lines):
            tw = sum(x[2] for x in line) + space * (len(line) - 1)
            x = (Wc - tw) / 2; base = pad + li * lh + 76
            for w, dc, ww in line:
                f = self.deco if dc else self.body
                d.text((x, base), w, font=f, fill=255, anchor="ls"); x += ww + space
        stroke = Image.new("L", (Wc, Hc), 0); ds = ImageDraw.Draw(stroke)
        for li, line in enumerate(lines):
            tw = sum(x[2] for x in line) + space * (len(line) - 1)
            x = (Wc - tw) / 2; base = pad + li * lh + 76
            for w, dc, ww in line:
                f = self.deco if dc else self.body
                ds.text((x, base), w, font=f, fill=255, anchor="ls", stroke_width=3, stroke_fill=255); x += ww + space
        m = np.asarray(mask, np.float32) / 255
        # degradê dourado vertical por linha
        grad = np.zeros((Hc, Wc, 3), np.float32)
        for li in range(len(lines)):
            y0 = pad + li * lh + 10; y1 = y0 + 72
            for c in range(3):
                col = np.interp(np.arange(Hc), [y0, y1], [GOLD_TOP[2 - c], GOLD_BOT[2 - c]])
                sel = slice(pad + li * lh - 10, pad + (li + 1) * lh + 10)
                grad[sel, :, c] = col[sel, None]
        shadow = np.asarray(stroke.filter(ImageFilter.GaussianBlur(9)), np.float32) / 255
        shadow = np.roll(shadow, 4, axis=0)
        st = np.asarray(stroke, np.float32) / 255
        res = (grad, m, np.clip(shadow * 1.6, 0, 1), st)
        self.cache[text] = res
        return res

    def apply(self, out, t):
        for a, b, text in CAPTIONS:
            if a - 0.01 <= t < b:
                grad, m, sh, st = self.render(text)
                fi = ease((t - a) / 0.16); fo = ease((b - t) / 0.14); al = min(fi, fo)
                rise = int((1 - fi) * 18)
                Hc = m.shape[0]; yc = 1440 + rise; y0 = int(yc - Hc / 2)
                y0 = max(0, min(H - Hc, y0))
                out *= (1 - np.roll(BAND, int(yc - 1440), axis=0)[..., None] * 0.55 * al)
                reg = out[y0:y0 + Hc]
                reg[:] = reg * (1 - sh[..., None] * 0.85 * al)
                reg[:] = reg * (1 - st[..., None] * 0.8 * al) + np.array([8, 14, 26], np.float32) * st[..., None] * 0.8 * al
                reg[:] = reg * (1 - m[..., None] * al) + grad * m[..., None] * al
        return out


# ------------------------------------------------------------------ composição
def make_getter(src):
    readers = {}

    def get(sh, s, span):
        if sh["name"] not in readers: readers[sh["name"]] = Reader(src, s - 2 / FPS)
        return readers[sh["name"]].get(s, span)
    return get, readers


def vid_frame(sh, t, getter, extra=1.0):
    from video import speed_at, cam_warp
    s = interp(sh["src"], t, 1); sp = speed_at(sh, t)
    f = getter(sh, s, sp / FPS)
    z = interp(sh["cam"], t, 1); cx = interp(sh["cam"], t, 2); cy = interp(sh["cam"], t, 3)
    if sh["kick"]:
        p = (t - sh["a"]) / 0.35
        if 0 <= p < 1: z *= 1 + sh["kick"] * (1 - p) ** 3
    return cam_warp(f, z, cx, cy, extra)


def shot_frame(sh, t, ctx, extra=1.0):
    if sh["kind"] == "img": return img_frame(sh, t, ctx["imgs"], extra)
    return vid_frame(sh, t, ctx["get"], extra)


def whip(sa, sb, t, ctx):
    T = sa["b"]; d = TRANS[round(T, 2)][1]
    e = ease((t - (T - d)) / (2 * d)); v = math.sin(math.pi * e)
    fa = shot_frame(sa, t, ctx); fb = shot_frame(sb, t, ctx)
    k = int(8 + 220 * v); fa = cv2.blur(fa, (k, 1)); fb = cv2.blur(fb, (k, 1))
    dx = e * W
    return cv2.warpAffine(fa, np.float32([[1, 0, -dx], [0, 1, 0]]), (W, H)) + \
        cv2.warpAffine(fb, np.float32([[1, 0, W - dx], [0, 1, 0]]), (W, H))


def render_frame(t, ctx):
    i = next((k for k, sh in enumerate(SHOTS) if sh["a"] <= t < sh["b"]), len(SHOTS) - 1)
    sh = SHOTS[i]; out = None
    tr_out = TRANS.get(round(sh["b"], 2)); tr_in = TRANS.get(round(sh["a"], 2))
    if tr_out and t >= sh["b"] - tr_out[1]:
        kind, d0, _ = tr_out; p = (t - (sh["b"] - d0)) / d0
        if kind == "flash": out = flash(shot_frame(sh, t, ctx), p ** 2)
        elif kind == "zoomblur": out = radial_blur(shot_frame(sh, t, ctx, 1 + 0.55 * p ** 2), 0.16 * p ** 1.5)
        elif kind == "whip": out = whip(sh, SHOTS[i + 1], t, ctx)
    elif tr_in and t < sh["a"] + tr_in[2]:
        kind, _, d1 = tr_in; p = (t - sh["a"]) / d1
        if kind == "flash":
            a = 1.0 if t < sh["a"] + 1 / FPS else (1 - p) ** 2
            out = flash(shot_frame(sh, t, ctx), a)
        elif kind == "zoomblur":
            q = 1 - p; out = glow(radial_blur(shot_frame(sh, t, ctx, 1 + 0.32 * q ** 2), 0.13 * q ** 1.5), 0.25 * q)
        elif kind == "whip": out = whip(SHOTS[i - 1], sh, t, ctx)
    if out is None: out = shot_frame(sh, t, ctx)
    for g in GLOW:
        if g <= t < g + 0.5: out = glow(out, 0.45 * (1 - (t - g) / 0.5) ** 2)
    if t < 0.35: out = out * ease(t / 0.35)
    if t > DUR - 0.8: out = out * ease((DUR - t) / 0.8)
    out = np.clip(out, 0, 255)
    if ctx.get("cap"): out = ctx["cap"].apply(out, t)
    return np.clip(out, 0, 255).astype(np.uint8)


def main():
    src, imgs, dst = sys.argv[1], sys.argv[2], sys.argv[3]
    ctx = dict(imgs=imgs, cap=Captions() if "--legenda" in sys.argv else None)
    if "--at" in sys.argv:
        ts = [float(x) for x in sys.argv[sys.argv.index("--at") + 1].split(",")]
        os.makedirs(dst, exist_ok=True); st = Still(src)
        ctx["get"] = lambda sh, s, span: st.frame(s, span)
        for t in ts:
            cv2.imwrite(os.path.join(dst, f"t{t:06.2f}.jpg"), render_frame(t, ctx), [cv2.IMWRITE_JPEG_QUALITY, 88])
        return
    get, readers = make_getter(src); ctx["get"] = get
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}",
                            "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "16",
                            "-pix_fmt", "yuv420p", "-movflags", "+faststart", dst], stdin=subprocess.PIPE)
    n = int(round(DUR * FPS))
    for k in range(n):
        t = k / FPS
        enc.stdin.write(render_frame(t, ctx).tobytes())
        for sh in SHOTS:
            if sh["kind"] == "vid" and sh["b"] + 0.3 < t and sh["name"] in readers: readers.pop(sh["name"]).close()
        if k % 150 == 0: print(f"{t:5.1f}s / {DUR}", flush=True)
    enc.stdin.close(); enc.wait()
    for r in readers.values(): r.close()
    print("ok", dst)


if __name__ == "__main__":
    main()
