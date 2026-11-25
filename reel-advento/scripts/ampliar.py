# Amplia as imagens 2x com FSRCNN (OpenCV dnn_superres). Uso: python3 scripts/ampliar.py <entrada_dir> <saida_dir>
import sys, os, glob, cv2
src, dst = sys.argv[1], sys.argv[2]; os.makedirs(dst, exist_ok=True)
sr = cv2.dnn_superres.DnnSuperResImpl_create()
sr.readModel(os.path.join(os.path.dirname(__file__), "..", "models", "FSRCNN_x2.pb")); sr.setModel("fsrcnn", 2)
for f in sorted(glob.glob(os.path.join(src, "img*.jpg"))):
    out = os.path.join(dst, os.path.basename(f).replace(".jpg", ".png"))
    if os.path.exists(out): continue
    im = cv2.imread(f); up = sr.upsample(im)
    cv2.imwrite(out, up); print(os.path.basename(f), im.shape, "->", up.shape, flush=True)
