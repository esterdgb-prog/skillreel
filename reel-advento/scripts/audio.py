# Gera a trilha (música sintetizada), os efeitos e a mixagem com a narração.
# Uso: python3 scripts/audio.py <orig.wav> <saida_dir>
import sys, wave, os
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
import importlib
_tl = importlib.import_module(os.environ.get("TIMELINE", "timeline"))
VOICE, SFX, BPM, BEAT, DUR = _tl.VOICE, _tl.SFX, _tl.BPM, _tl.BEAT, _tl.DUR

SR = 44100
rng = np.random.default_rng(7)
N = int(DUR * SR) + SR * 3


def read_wav(p):
    w = wave.open(p)
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    return x.reshape(-1, w.getnchannels())


def write_wav(p, x):
    x = np.clip(x, -1, 1)
    w = wave.open(p, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()


def db(g): return 10 ** (g / 20)


def t_(d): return np.arange(int(d * SR)) / SR


def onepole_lp(x, a):
    # a pode ser escalar ou vetor (coeficiente por amostra)
    y = np.empty_like(x); s = 0.0
    a = np.broadcast_to(a, x.shape)
    for i in range(len(x)):
        s += a[i] * (x[i] - s); y[i] = s
    return y


def lp_fast(x, fc):
    # passa-baixa de fase zero via FFT (corte suave)
    n = len(x); X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR)
    X *= 1 / (1 + (f / fc) ** 4)
    return np.fft.irfft(X, n)


def hp_fast(x, fc):
    n = len(x); X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR)
    X *= (f / fc) ** 4 / (1 + (f / fc) ** 4)
    return np.fft.irfft(X, n)


def bp_fast(x, lo, hi): return hp_fast(lp_fast(x, hi), lo)


def pink(n):
    w = rng.standard_normal(n); X = np.fft.rfft(w); f = np.fft.rfftfreq(n, 1 / SR)
    X[1:] /= np.sqrt(f[1:]); X[0] = 0
    y = np.fft.irfft(X, n); return y / (np.abs(y).max() + 1e-9)


def norm(x, peak=1.0): return x / (np.abs(x).max() + 1e-9) * peak


def stereo(x, pan=0.0):
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    return np.stack([x * l * 1.414, x * r * 1.414], 1)


def make_ir(d=2.6, seed=3):
    r = np.random.default_rng(seed); n = int(d * SR); t = np.arange(n) / SR
    ir = np.zeros((n, 2))
    for c in range(2):
        e = r.standard_normal(n) * np.exp(-t / (d / 6.5))
        ir[:, c] = lp_fast(e, 6500)
    ir[: int(0.012 * SR)] = 0
    return ir / np.sqrt((ir ** 2).sum(0)).max()


IR = make_ir()


def reverb(x, wet=0.3):
    n = len(x) + len(IR); nf = 1 << (n - 1).bit_length(); y = np.zeros((n, 2))
    for c in range(2):
        y[:, c] = np.fft.irfft(np.fft.rfft(x[:, c], nf) * np.fft.rfft(IR[:, c], nf), nf)[:n]
    out = np.zeros((n, 2)); out[: len(x)] = x * (1 - wet * 0.5)
    return out + y * wet


# ---------------------------------------------------------------- efeitos
def sfx_whoosh(d=0.55, lo=300, hi=5500, peak_at=0.55):
    n = int(d * SR); t = np.arange(n) / n
    env = np.where(t < peak_at, (t / peak_at) ** 2, ((1 - t) / (1 - peak_at)) ** 1.5)
    x = pink(n)
    # filtro que abre e fecha com o envelope
    fc = lo + (hi - lo) * env
    a = 1 - np.exp(-2 * np.pi * fc / SR)
    y = onepole_lp(x, a); y = hp_fast(y, lo * 0.6)
    y = norm(y * env)
    pan = np.linspace(-0.6, 0.6, n)
    return np.stack([y * np.cos((pan + 1) * np.pi / 4), y * np.sin((pan + 1) * np.pi / 4)], 1) * 1.3


def sfx_swish():
    return sfx_whoosh(0.26, 900, 7000, 0.45) * 0.9


def sfx_whip():
    w = sfx_whoosh(0.34, 600, 8000, 0.35)
    return w[:, [1, 0]]  # varre da direita p/ esquerda


def sfx_zoomwhoosh():
    a = sfx_whoosh(0.5, 200, 4500, 0.8); tail = sfx_whoosh(0.4, 200, 2500, 0.05) * 0.5
    out = np.zeros((len(a) + len(tail) - int(0.1 * SR), 2)); out[: len(a)] += a
    out[len(a) - int(0.1 * SR):] += tail
    return out, len(a) / SR - 0.02   # alinhado no pico


def sfx_flashwhoosh():
    a = sfx_whoosh(0.45, 400, 7000, 0.75)
    return a, 0.45 * 0.75


def sfx_boom():
    t = t_(1.8)
    f = 38 + 55 * np.exp(-t * 9)
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * np.exp(-t * 2.6) + 0.35 * np.sin(2 * ph) * np.exp(-t * 6)
    thump = lp_fast(rng.standard_normal(len(t)), 250) * np.exp(-t * 28)
    y = norm(y + norm(thump) * 0.5)
    y[: int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))
    return stereo(y)


def sfx_shimmer(d=1.4):
    n = int((d + 1.0) * SR); out = np.zeros(n)
    notes = [74, 78, 81, 86, 90, 93, 98, 102, 105]  # D maior agudo
    for k in range(int(26 * d)):
        st = rng.uniform(0, d) ** 1.3 / d ** 0.3
        f = 440 * 2 ** ((rng.choice(notes) - 69) / 12) * rng.uniform(0.998, 1.002)
        tt = t_(0.9); dec = rng.uniform(3, 7)
        tone = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2.01 * tt)) * np.exp(-tt * dec)
        i = int(st * SR); m = min(len(tone), n - i)
        out[i:i + m] += tone[:m] * rng.uniform(0.3, 1) * (1 - st / (d + 0.1)) ** 0.5
    out = norm(out)
    l = np.roll(out, 0); r = np.roll(out, int(0.011 * SR))
    return reverb(np.stack([l, r], 1) * 0.8, 0.55)


def sfx_sparkle_sweep(d=1.8):
    # brilho girando (para o anel dourado)
    n = int(d * SR); out = np.zeros((n + SR, 2))
    for k in range(60):
        st = k / 60 * d; f = 2000 + 3500 * (k / 60) + rng.uniform(-200, 200)
        tt = t_(0.35); tone = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 14) * rng.uniform(0.4, 1)
        pan = np.sin(2 * np.pi * k / 20)
        i = int(st * SR); out[i:i + len(tone)] += stereo(tone, pan * 0.8)
    env = np.ones(len(out)); env[:n] = np.sin(np.linspace(0, np.pi, n)) ** 0.7
    return reverb(norm(out * env[:, None]) * 0.7, 0.5)


def sfx_riser(d=1.5):
    t = t_(d); p = t / d
    x = pink(len(t)); fc = 300 + 7000 * p ** 2
    y = onepole_lp(x, 1 - np.exp(-2 * np.pi * fc / SR)) * p ** 2.2
    tone = np.sin(2 * np.pi * np.cumsum(220 + 660 * p ** 2) / SR) * p ** 3 * 0.25
    y = norm(y + tone)
    return stereo(y)


def bell_tone(f, d, partials, decays, amps):
    t = t_(d); y = np.zeros(len(t))
    for r, dc, a in zip(partials, decays, amps):
        y += a * np.sin(2 * np.pi * f * r * t + rng.uniform(0, 6)) * np.exp(-t * dc)
    att = int(0.003 * SR); y[:att] *= np.linspace(0, 1, att)
    return norm(y)


def sfx_bell(d=2.2):
    y = bell_tone(1174.66, d + 1.5, [0.5, 1, 1.183, 1.506, 2.0, 2.514, 2.662, 3.011, 4.166],
                  [1.2, 1.6, 2.2, 2.4, 2.8, 3.8, 4.2, 5.0, 7.0], [0.25, 1, 0.5, 0.35, 0.6, 0.25, 0.2, 0.15, 0.1])
    # leve vibração do balanço
    t = t_(len(y) / SR); y *= 1 + 0.12 * np.sin(2 * np.pi * 2.2 * t)
    return reverb(stereo(y) * 0.9, 0.35)


def sfx_chime():
    y = bell_tone(146.83, 4.5, [0.5, 1, 1.2, 1.5, 2.0, 2.5, 3.0, 4.2],
                  [0.5, 0.7, 1.0, 1.2, 1.4, 2.0, 2.4, 3.5], [0.5, 1, 0.6, 0.4, 0.5, 0.25, 0.2, 0.12])
    return reverb(stereo(y), 0.4)


def sfx_logo_chime():
    out = np.zeros((int(4.5 * SR), 2))
    for i, m in enumerate([62, 69, 74, 78, 81, 86]):
        f = 440 * 2 ** ((m - 69) / 12)
        y = bell_tone(f, 3.5, [1, 2, 3, 4.2], [1.2, 2, 3, 4], [1, 0.4, 0.2, 0.1]) * (0.9 - i * 0.08)
        s = int(i * 0.045 * SR); out[s:s + len(y)] += stereo(y, -0.5 + i * 0.2)
    return reverb(norm(out) * 0.8, 0.5)


def sfx_tick(f=2600):
    t = t_(0.06)
    y = np.sin(2 * np.pi * f * t) * np.exp(-t * 140) + hp_fast(rng.standard_normal(len(t)), 3000) * np.exp(-t * 400) * 0.6
    body = np.sin(2 * np.pi * 900 * t) * np.exp(-t * 90) * 0.5
    return reverb(stereo(norm(y + body)) * 0.9, 0.15)


def sfx_latch():
    out = np.zeros(int(0.5 * SR))
    for st, f, a in [(0.0, 2400, 1.0), (0.012, 3900, 0.6), (0.11, 1700, 0.8), (0.12, 3100, 0.5)]:
        t = t_(0.15); y = np.sin(2 * np.pi * f * t) * np.exp(-t * 60) * a
        y += hp_fast(rng.standard_normal(len(t)), 2000) * np.exp(-t * 300) * a * 0.5
        i = int(st * SR); out[i:i + len(y)] += y
    t = t_(0.5); out += lp_fast(rng.standard_normal(len(t)), 180) * np.exp(-t * 30) * 0.8
    return reverb(stereo(norm(out)), 0.2)


def sfx_doorswing(d=1.4):
    # ar se movendo + rangido suave e grave da madeira
    t = t_(d); p = t / d
    env = np.sin(np.pi * p) ** 1.5
    air = lp_fast(pink(len(t)), 700) * env
    f = 180 + 40 * np.sin(2 * np.pi * 1.3 * t) + 60 * p
    creak = np.sin(2 * np.pi * np.cumsum(f) / SR)
    creak = np.sign(creak) * np.abs(creak) ** 0.6  # um pouco de aspereza
    creak = bp_fast(creak, 300, 2500) * env * (0.5 + 0.5 * np.sin(2 * np.pi * 7 * t) ** 2) * 0.35
    return reverb(stereo(norm(air + creak), 0.3), 0.3)


def sfx_ignite():
    t = t_(0.7)
    y = bp_fast(rng.standard_normal(len(t)), 250, 2600) * (1 - np.exp(-t * 80)) * np.exp(-t * 7)
    y += lp_fast(rng.standard_normal(len(t)), 120) * np.exp(-t * 20) * 0.6
    return reverb(stereo(norm(y), 0.2), 0.25)


def sfx_swell(d=1.2):
    s = sfx_shimmer(d) * 0.6
    t = np.arange(len(s)) / SR; env = np.minimum(1, t / d) ** 2
    return s * env[:, None]


def sfx_sand(d=1.2):
    # areia escorrendo: chiado agudo e granulado, com entrada e saída suaves
    t = t_(d); x = hp_fast(rng.standard_normal(len(t)), 2500)
    grains = (rng.random(len(t)) < 0.02) * rng.standard_normal(len(t)) * 3
    y = lp_fast(x + hp_fast(grains, 3000), 9000)
    env = np.minimum(1, t / 0.15) * np.minimum(1, (d - t) / 0.3)
    return reverb(stereo(norm(y * env), 0.1) * 0.8, 0.15)


def render_sfx(kind, extra):
    off = 0.0
    if kind == "whoosh_s": x = sfx_whoosh(0.45, 400, 5000, 0.6); off = 0.27
    elif kind == "swish": x = sfx_swish(); off = 0.12
    elif kind == "whip": x = sfx_whip(); off = 0.12
    elif kind == "zoomwhoosh": x, off = sfx_zoomwhoosh()
    elif kind == "flashwhoosh": x, off = sfx_flashwhoosh()
    elif kind == "boom": x = sfx_boom()
    elif kind == "shimmer": x = sfx_shimmer(extra or 1.2)
    elif kind == "sparkle_sweep": x = sfx_sparkle_sweep(extra or 1.8)
    elif kind == "riser_end": x = sfx_riser(extra or 1.5); off = extra or 1.5
    elif kind == "bell": x = sfx_bell() * (extra or 1)
    elif kind == "chime": x = sfx_chime()
    elif kind == "logo_chime": x = sfx_logo_chime()
    elif kind == "tick": x = sfx_tick(2600)
    elif kind == "tock": x = sfx_tick(2000)
    elif kind == "latch": x = sfx_latch()
    elif kind == "doorswing": x = sfx_doorswing(extra or 1.4)
    elif kind == "ignite": x = sfx_ignite()
    elif kind == "swell": x = sfx_swell(extra or 1.2)
    elif kind == "sand": x = sfx_sand(extra or 1.2)
    else: raise ValueError(kind)
    return x, off


# ---------------------------------------------------------------- música
def midi(m): return 440 * 2 ** ((m - 69) / 12)


CHORDS = {  # notas MIDI
    "D": [50, 57, 62, 66, 69], "Bm": [47, 54, 59, 62, 66], "G": [43, 55, 59, 62, 67],
    "A": [45, 57, 61, 64, 69], "Em": [40, 55, 59, 64, 67], "Dsus": [50, 57, 62, 67, 69],
}
BAR = BEAT * 4
PROG = ["D", "Bm", "G", "A"] * 5 + ["A", "D", "G", "D"]   # 24 compassos


def pad_voice(f, d):
    t = t_(d); y = np.zeros(len(t))
    for det in (-0.12, 0.0, 0.12):
        ff = f * 2 ** (det / 12 / 4)
        for h in range(1, 10):
            y += np.sin(2 * np.pi * ff * h * t + rng.uniform(0, 6)) / h ** 1.6
    a, r = min(0.8, d / 3), min(1.0, d / 3)
    env = np.minimum(1, t / a) * np.minimum(1, (d - t) / r)
    return y * env


def music_box(f, vel=1.0):
    t = t_(2.0)
    y = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 3.98 * t) * np.exp(-t * 6)
         + 0.15 * np.sin(2 * np.pi * f * 6.8 * t) * np.exp(-t * 12)) * np.exp(-t * 2.8)
    att = int(0.002 * SR); y[:att] *= np.linspace(0, 1, att)
    return y * vel


def kick(vel=1.0):
    t = t_(0.5); f = 45 + 70 * np.exp(-t * 30)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
    return y * vel


def section_level(t):
    # intensidade 0–1 por seção
    pts = [(0, 0.35), (6.6, 0.55), (17.4, 0.7), (36.0, 0.8), (43.2, 0.85), (49.0, 1.0), (49.2, 1.0), (53, 0.8), (DUR, 0.6)]
    xs, ys = zip(*pts); return np.interp(t, xs, ys)


def make_music():
    L = N; pad = np.zeros(L); box = np.zeros((L, 2)); low = np.zeros(L); perc = np.zeros(L)
    for b, ch in enumerate(PROG):
        st = b * BAR; notes = CHORDS[ch]
        d = BAR + 0.6 if b < len(PROG) - 1 else 5.0
        i = int(st * SR)
        for m in notes[1:]:
            v = pad_voice(midi(m), d); pad[i:i + len(v)] += v[: L - i] * 0.22
        # baixo
        if st >= 6.6:
            v = pad_voice(midi(notes[0] - 12 if notes[0] > 45 else notes[0]), d) * 0.5
            low[i:i + len(v)] += lp_fast(v, 220)[: L - i]
        # caixinha de música (arpejo)
        tones = sorted(set([n + 12 for n in notes[2:]] + [n + 24 for n in notes[2:4]]))
        pattern = [0, 2, 4, 1, 3, 2, 4, 1]
        step = BEAT / 2 if st >= 6.6 else BEAT
        k = 0; tt = st
        while tt < st + BAR - 1e-6 and tt < DUR - 1.0:
            if st >= 49.2 or not (48.6 <= tt < 49.2):
                m = tones[pattern[k % 8] % len(tones)]
                v = music_box(midi(m), (0.9 if k % 2 == 0 else 0.6) * rng.uniform(0.85, 1))
                j = int(tt * SR); pan = 0.35 * np.sin(k * 1.3)
                box[j:j + len(v)] += stereo(v, pan)[: L - j] * 0.12
            k += 1; tt += step
        # pulsação (coração) — a partir do corredor
        for q in range(4):
            tb = st + q * BEAT
            if tb >= DUR - 2.0: continue
            on = (17.4 <= tb < 36.0 and q in (0, 2)) or (36.0 <= tb < 43.2) or (43.2 <= tb < 49.2)
            if on:
                v = kick(0.8 if q == 0 else 0.6); j = int(tb * SR); perc[j:j + len(v)] += v[: L - j]
            if 43.2 <= tb < 49.2:   # colcheias acelerando para o clímax
                v = kick(0.35); j = int((tb + BEAT / 2) * SR); perc[j:j + len(v)] += v[: L - j]
    # tirar música no instante do flash final (respiro) e voltar no impacto
    tt = np.arange(L) / SR
    lvl = section_level(tt)
    gap = 1 - 0.7 * np.clip((tt - 48.7) / 0.5, 0, 1) * (tt < 49.2)
    pad = lp_fast(pad, 2200)
    mus = stereo(pad * 0.5) + box + stereo(low * 0.9) + stereo(perc * 0.55)
    mus *= (lvl * gap)[:, None]
    mus = reverb(mus, 0.28)[:L]
    # fade final
    fe = np.clip((DUR + 0.4 - tt) / 2.8, 0, 1)
    return mus * fe[:, None]


# ---------------------------------------------------------------- narração
def make_voice(orig):
    v = np.zeros((N, 2)); act = np.zeros(N)
    for out_t, a, b, _ in VOICE:
        seg = orig[int(a * SR):int(b * SR)].copy()
        fi, fo = int(0.012 * SR), int(0.06 * SR)
        seg[:fi] *= np.linspace(0, 1, fi)[:, None]; seg[-fo:] *= np.linspace(1, 0, fo)[:, None]
        i = int(out_t * SR); v[i:i + len(seg)] += seg; act[i:i + len(seg)] = 1
    for c in range(2): v[:, c] = hp_fast(v[:, c], 75)
    return v, act


def main():
    orig_p, out_dir = sys.argv[1], sys.argv[2]
    orig = read_wav(orig_p)
    voice, act = make_voice(orig)
    music = make_music()
    sfx = np.zeros((N, 2))
    for t0, kind, g, extra in SFX:
        x, off = render_sfx(kind, extra)
        x = x / (np.abs(x).max() + 1e-9) * db(g + 6)
        i = int((t0 - off) * SR)
        if i < 0: x = x[-i:]; i = 0
        m = min(len(x), N - i); sfx[i:i + m] += x[:m]
    # ducking da música sob a voz (envelope suave)
    k = int(0.25 * SR); env = np.convolve(act, np.ones(k) / k, mode="same")
    duck = 1 - 0.55 * np.clip(env * 1.6, 0, 1)
    vr = np.sqrt((voice ** 2).mean()) if voice.any() else 0.1
    music = music / (np.sqrt((music ** 2).mean()) + 1e-9) * vr * db(-15) * 3.4
    mix = voice + music * duck[:, None] + sfx
    L = int(DUR * SR)
    mix = mix[:L]
    write_wav(os.path.join(out_dir, "voz.wav"), voice[:L])
    write_wav(os.path.join(out_dir, "musica.wav"), (music * duck[:, None])[:L])
    write_wav(os.path.join(out_dir, "sfx.wav"), sfx[:L])
    write_wav(os.path.join(out_dir, "mix-bruto.wav"), mix / max(1, np.abs(mix).max() / 0.95))
    print("ok", L / SR)


if __name__ == "__main__":
    main()
