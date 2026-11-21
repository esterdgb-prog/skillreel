#!/usr/bin/env python3
"""Transcreve um áudio (ou vídeo) palavra por palavra com faster-whisper → [[início, fim, palavra], ...].

uso: transcrever.py entrada saida.json [--modelo medium] [--prompt "Nubank, Uruguai, Resultax Internacional"]
Rode com `python3 -I` e HF_HUB_DISABLE_XET=1 (o download do modelo pelo Xet falha atrás do proxy).
O áudio é decodificado pelo ffmpeg e entregue como array: o decodificador do faster-whisper quebra com o PyAV novo.
"""
import sys, json, subprocess, numpy as np
from faster_whisper import WhisperModel
a = sys.argv[1:]
src, out = a[0], a[1]
modelo = a[a.index("--modelo") + 1] if "--modelo" in a else "medium"
prompt = a[a.index("--prompt") + 1] if "--prompt" in a else "Resultax Internacional, Receita Federal, Saída Definitiva do País, link da bio, diagnóstico."
r = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True)
x = np.frombuffer(r.stdout, np.float32)
m = WhisperModel(modelo, device="cpu", compute_type="int8")
seg, _ = m.transcribe(x, language="pt", word_timestamps=True, initial_prompt=prompt)
W = [[round(w.start, 3), round(w.end, 3), w.word.strip()] for s in seg for w in s.words]
json.dump(W, open(out, "w", encoding="utf-8"), ensure_ascii=False)
print(len(W), "palavras ·", " ".join(w[2] for w in W))
