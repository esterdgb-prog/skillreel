# Renderiza a nova montagem quadro a quadro (OpenCV), a partir do vídeo original.
# Uso:
#   python3 scripts/video.py <original.mp4> <saida.mp4>
#   python3 scripts/video.py <original.mp4> <pasta_png> --at 1.0,6.5,...   (quadros de conferência)
import sys, os, subprocess
import numpy as np, cv2
sys.path.insert(0, os.path.dirname(__file__))
from timeline import DUR

W, H, FPS = 1080, 1920, 30
WHITE = np.array([222, 241, 255], np.float32)   # branco quente (BGR), o mesmo tom dos flashes originais

# ------------------------------------------------------------------ planos
# src: [(t_saida, t_original), ...]   cam: [(t_saida, zoom, cx, cy), ...]   kick: soco de zoom na entrada
def S(name, a, b, src, cam, kick=0.0):
    return dict(name=name, a=a, b=b, src=src, cam=cam, kick=kick)

SHOTS = [
    S("porta-1 aberta", 0.00, 1.55, [(0, 0.60), (1.55, 2.15)], [(0, 1.00, 540, 960), (1.55, 1.07, 540, 990)]),
    S("porta-1 luz", 1.55, 3.30, [(1.55, 2.15), (3.30, 3.90)], [(1.55, 1.55, 540, 1330), (3.30, 1.62, 560, 1310)], 0.06),
    S("porta-1 trinco", 3.30, 4.75, [(3.30, 3.90), (4.75, 5.35)], [(3.30, 1.32, 600, 1150), (4.75, 1.40, 630, 1130)], 0.06),
    S("porta-1 abre", 4.75, 6.60, [(4.75, 5.35), (6.60, 8.85)], [(4.75, 1.00, 540, 960), (6.60, 1.18, 660, 980)], 0.04),
    S("velas", 6.60, 8.75, [(6.60, 11.65), (8.75, 13.80)], [(6.60, 1.04, 500, 960), (8.75, 1.12, 580, 940)]),
    S("velas close", 8.75, 11.40, [(8.75, 13.90), (11.40, 16.60)], [(8.75, 1.28, 560, 900), (11.40, 1.36, 540, 820)], 0.06),
    S("sino", 11.40, 14.85, [(11.40, 19.35), (14.85, 22.80)], [(11.40, 1.00, 540, 960), (14.85, 1.07, 540, 930)]),
    S("sino close", 14.85, 17.40, [(14.85, 22.90), (17.40, 25.45)], [(14.85, 1.38, 520, 1040), (17.40, 1.46, 520, 1040)], 0.07),
    S("corredor", 17.40, 20.95, [(17.40, 28.65), (20.95, 32.75)], [(17.40, 1.00, 540, 960), (20.95, 1.08, 540, 980)]),
    S("corredor punch", 20.95, 23.40, [(20.95, 32.75), (23.40, 35.50)], [(20.95, 1.32, 540, 1000), (23.40, 1.42, 540, 1000)], 0.07),
    S("portas lateral", 23.40, 28.15, [(23.40, 38.40), (28.15, 44.10)], [(23.40, 1.06, 540, 960), (28.15, 1.06, 540, 960)]),
    S("porta dupla", 28.15, 31.20, [(28.15, 39.40), (31.20, 42.00)], [(28.15, 1.20, 540, 1000), (31.20, 1.30, 520, 1000)], 0.07),
    S("porta abrindo", 31.20, 36.00, [(31.20, 48.95), (36.00, 54.70)], [(31.20, 1.00, 540, 960), (36.00, 1.16, 430, 1040)]),
    S("cada uma 1", 36.00, 36.60, [(36.00, 3.00), (36.60, 3.60)], [(36.00, 1.12, 540, 1000), (36.60, 1.18, 540, 1000)], 0.06),
    S("cada uma 2", 36.60, 37.20, [(36.60, 44.00), (37.20, 44.60)], [(36.60, 1.12, 500, 1000), (37.20, 1.18, 500, 1000)], 0.06),
    S("cada uma 3", 37.20, 37.80, [(37.20, 71.50), (37.80, 72.10)], [(37.20, 1.10, 540, 1000), (37.80, 1.16, 540, 1000)], 0.06),
    S("cada uma 4", 37.80, 38.40, [(37.80, 39.80), (38.40, 40.40)], [(37.80, 1.10, 540, 1000), (38.40, 1.16, 540, 1000)], 0.06),
    S("cada uma 5", 38.40, 39.00, [(38.40, 49.30), (39.00, 49.90)], [(38.40, 1.00, 540, 960), (39.00, 1.08, 540, 960)], 0.06),
    S("relogio", 39.00, 40.80, [(39.00, 56.45), (40.80, 58.25)], [(39.00, 1.00, 540, 960), (40.80, 1.07, 540, 900)]),
    S("relogio zoom", 40.80, 43.20, [(40.80, 61.00), (43.20, 66.80)], [(40.80, 1.00, 540, 960), (43.20, 1.08, 540, 960)], 0.06),
    S("porta-2", 43.20, 45.70, [(43.20, 69.60), (45.70, 73.20)], [(43.20, 1.00, 540, 960), (45.70, 1.05, 540, 960)]),
    S("porta-2 abre", 45.70, 49.20, [(45.70, 73.20), (49.20, 78.30)], [(45.70, 1.25, 640, 1080), (49.20, 1.38, 760, 1100)], 0.06),
    S("anel e logo", 49.20, DUR, [(49.20, 80.00), (51.20, 84.20), (DUR, 84.20 + DUR - 51.20)], [(49.20, 1.00, 540, 960), (DUR, 1.07, 540, 960)]),
]

# transições nas fronteiras: tipo, duração antes, duração depois
TRANS = {
    6.60: ("flash", 0.35, 0.50), 11.40: ("zoomblur", 0.20, 0.26), 17.40: ("flash", 0.20, 0.32),
    23.40: ("whip", 0.15, 0.15), 31.20: ("zoomblur", 0.20, 0.26), 36.00: ("flash", 0.28, 0.22),
    39.00: ("flash", 0.16, 0.26), 43.20: ("flash", 0.25, 0.32), 49.20: ("flash", 0.40, 0.55),
}
GLOW = [14.85, 20.95, 28.15, 51.35]          # pulsos de luz nas palavras-chave (com o impacto sonoro)


def interp(keys, t, idx):
    ts = [k[0] for k in keys]
    if t <= ts[0]:
        if len(keys) > 1 and idx == 1:   # extrapola src para trás (pré-rolagem)
            sl = (keys[1][1] - keys[0][1]) / (keys[1][0] - keys[0][0]); return keys[0][1] + (t - ts[0]) * sl
        return keys[0][idx]
    if t >= ts[-1]:
        if len(keys) > 1 and idx == 1:
            sl = (keys[-1][1] - keys[-2][1]) / (keys[-1][0] - keys[-2][0]); return keys[-1][1] + (t - ts[-1]) * sl
        return keys[-1][idx]
    for i in range(len(ts) - 1):
        if ts[i] <= t <= ts[i + 1]:
            p = (t - ts[i]) / (ts[i + 1] - ts[i]); return keys[i][idx] + (keys[i + 1][idx] - keys[i][idx]) * p


def speed_at(sh, t):
    e = 1 / FPS; return abs(interp(sh["src"], t + e, 1) - interp(sh["src"], t, 1)) * FPS


# ------------------------------------------------------------------ leitura do original
class Reader:
    def __init__(self, path, t0):
        self.t0 = max(0.0, t0)
        self.p = subprocess.Popen(["ffmpeg", "-v", "error", "-ss", f"{self.t0:.3f}", "-i", path, "-f", "rawvideo",
                                   "-pix_fmt", "bgr24", "-"], stdout=subprocess.PIPE, bufsize=W * H * 3 * 4)
        self.frames = []   # (tempo, quadro)
        self.k = 0; self.eof = False

    def _read(self):
        b = self.p.stdout.read(W * H * 3)
        if len(b) < W * H * 3: self.eof = True; return False
        self.frames.append((self.t0 + self.k / FPS, np.frombuffer(b, np.uint8).reshape(H, W, 3)))
        self.k += 1
        if len(self.frames) > 8: self.frames.pop(0)
        return True

    def get(self, s, span):
        while not self.eof and (not self.frames or self.frames[-1][0] < s + 0.5 / FPS):
            self._read()
        fr = self.frames
        if span > 1.4 / FPS:   # acelerado: mistura os quadros do intervalo (desfoque de movimento)
            sel = [f for (tt, f) in fr if s - span + 0.5 / FPS <= tt <= s + 0.5 / FPS]
            if sel: return np.mean([x.astype(np.float32) for x in sel[-4:]], 0)
        # interpolação linear entre os dois quadros vizinhos
        prev = None
        for tt, f in fr:
            if tt <= s: prev = (tt, f)
        nxt = next(((tt, f) for tt, f in fr if tt > s), None)
        if prev is None: return fr[0][1].astype(np.float32)
        if nxt is None: return prev[1].astype(np.float32)
        p = (s - prev[0]) / (nxt[0] - prev[0])
        if p < 0.08: return prev[1].astype(np.float32)
        return prev[1].astype(np.float32) * (1 - p) + nxt[1].astype(np.float32) * p

    def close(self):
        try: self.p.stdout.close(); self.p.kill(); self.p.wait()
        except Exception: pass


class Still:
    """Leitura pontual (modo --at)."""
    def __init__(self, path): self.path = path

    def frame(self, s, span):
        r = Reader(self.path, s - 3 / FPS); f = r.get(s, span); r.close(); return f


# ------------------------------------------------------------------ câmera e efeitos
def cam_warp(img, z, cx, cy, extra=1.0):
    z = z * extra
    hw, hh = W / 2 / z, H / 2 / z
    cx = min(max(cx, hw), W - hw); cy = min(max(cy, hh), H - hh)
    M = np.float32([[z, 0, W / 2 - z * cx], [0, z, H / 2 - z * cy]])
    return cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)


def radial_blur(img, s, n=6):
    if s < 0.004: return img
    acc = np.zeros_like(img)
    for i in range(n):
        z = 1 + s * i / (n - 1)
        M = np.float32([[z, 0, W / 2 * (1 - z)], [0, z, H / 2 * (1 - z)]])
        acc += cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    return acc / n


def glow(img, a):
    if a <= 0.002: return img
    small = cv2.resize(img, (W // 8, H // 8), interpolation=cv2.INTER_AREA)
    small = cv2.GaussianBlur(small, (0, 0), 6)
    g = cv2.resize(small, (W, H), interpolation=cv2.INTER_LINEAR)
    out = 255 - (255 - img) * (255 - g * a * 1.1) / 255     # "screen"
    return out


def flash(img, a):
    if a <= 0.002: return img
    img = glow(img, min(1, a * 1.6))
    return img + (WHITE - img) * (a ** 1.4)


def ease(p): p = min(max(p, 0), 1); return p * p * (3 - 2 * p)


# ------------------------------------------------------------------ composição de um quadro
def shot_frame(sh, t, getter, extra_zoom=1.0):
    s = interp(sh["src"], t, 1)
    sp = speed_at(sh, t)
    f = getter(sh, s, sp / FPS)
    z = interp(sh["cam"], t, 1); cx = interp(sh["cam"], t, 2); cy = interp(sh["cam"], t, 3)
    if sh["kick"]:
        p = (t - sh["a"]) / 0.35
        if 0 <= p < 1: z *= 1 + sh["kick"] * (1 - p) ** 3
    return cam_warp(f, z, cx, cy, extra_zoom)


def render_frame(t, getter):
    i = next((k for k, sh in enumerate(SHOTS) if sh["a"] <= t < sh["b"]), len(SHOTS) - 1)
    sh = SHOTS[i]
    out = None
    # transição na saída deste plano?
    tr_out = TRANS.get(round(sh["b"], 2)); tr_in = TRANS.get(round(sh["a"], 2))
    if tr_out and t >= sh["b"] - tr_out[1]:
        kind, d0, _ = tr_out; p = (t - (sh["b"] - d0)) / d0
        if kind == "flash":
            out = flash(shot_frame(sh, t, getter), p ** 2)
        elif kind == "zoomblur":
            f = shot_frame(sh, t, getter, 1 + 0.55 * p ** 2); out = radial_blur(f, 0.16 * p ** 1.5)
        elif kind == "whip":
            out = whip(SHOTS[i], SHOTS[i + 1], t, getter)
    elif tr_in and t < sh["a"] + tr_in[2]:
        kind, _, d1 = tr_in; p = (t - sh["a"]) / d1
        if kind == "flash":
            a = 1.0 if t < sh["a"] + 1 / FPS else (1 - p) ** 2
            out = flash(shot_frame(sh, t, getter), a)
        elif kind == "zoomblur":
            q = 1 - p; f = shot_frame(sh, t, getter, 1 + 0.32 * q ** 2); out = radial_blur(f, 0.13 * q ** 1.5)
            out = glow(out, 0.25 * q)
        elif kind == "whip":
            out = whip(SHOTS[i - 1], sh, t, getter)
    if out is None:
        out = shot_frame(sh, t, getter)
    # pulsos de luz
    for g in GLOW:
        if g <= t < g + 0.5:
            out = glow(out, 0.45 * (1 - (t - g) / 0.5) ** 2)
    # abertura e final
    if t < 0.35: out = out * ease(t / 0.35)
    if t > DUR - 0.8: out = out * ease((DUR - t) / 0.8)
    return np.clip(out, 0, 255).astype(np.uint8)


def whip(sa, sb, t, getter):
    T = sa["b"]; d = TRANS[round(T, 2)][1]
    e = ease((t - (T - d)) / (2 * d))
    v = np.sin(np.pi * e)                     # velocidade relativa
    fa = shot_frame(sa, t, getter); fb = shot_frame(sb, t, getter)
    k = int(8 + 220 * v)
    fa = cv2.blur(fa, (k, 1)); fb = cv2.blur(fb, (k, 1))
    dx = e * W
    Ma = np.float32([[1, 0, -dx], [0, 1, 0]]); Mb = np.float32([[1, 0, W - dx], [0, 1, 0]])
    out = cv2.warpAffine(fa, Ma, (W, H), borderMode=cv2.BORDER_CONSTANT) + \
        cv2.warpAffine(fb, Mb, (W, H), borderMode=cv2.BORDER_CONSTANT)
    return out


# ------------------------------------------------------------------ principal
def main():
    src, dst = sys.argv[1], sys.argv[2]
    if "--at" in sys.argv:
        ts = [float(x) for x in sys.argv[sys.argv.index("--at") + 1].split(",")]
        os.makedirs(dst, exist_ok=True); st = Still(src)
        getter = lambda sh, s, span: st.frame(s, span)
        for t in ts:
            cv2.imwrite(os.path.join(dst, f"t{t:06.2f}.jpg"), render_frame(t, getter), [cv2.IMWRITE_JPEG_QUALITY, 88])
        return
    readers = {}

    def getter(sh, s, span):
        key = sh["name"]
        if key not in readers:
            readers[key] = Reader(src, s - 2 / FPS)
        return readers[key].get(s, span)

    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}",
                            "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "16",
                            "-pix_fmt", "yuv420p", "-movflags", "+faststart", dst], stdin=subprocess.PIPE)
    n = int(round(DUR * FPS))
    for k in range(n):
        t = k / FPS
        enc.stdin.write(render_frame(t, getter).tobytes())
        # fecha leitores de planos que já passaram
        for sh in SHOTS:
            if sh["b"] + 0.3 < t and sh["name"] in readers:
                readers.pop(sh["name"]).close()
        if k % 150 == 0: print(f"{t:5.1f}s / {DUR}", flush=True)
    enc.stdin.close(); enc.wait()
    for r in readers.values(): r.close()
    print("ok", dst)


if __name__ == "__main__":
    main()
