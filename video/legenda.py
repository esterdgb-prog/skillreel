"""Gera legenda.ass (Poppins) a partir dos tempos por trecho (trechos/palavras.json)
e do roteiro abaixo.  Marcação do roteiro:
  /        quebra de bloco (cada bloco aparece sozinho na tela)
  *palavra*  destaque amarelo (frase/palavra importante)
  ~palavra~  destaque vermelho (a palavra "tentar" — o vilão do vídeo)
  _        palavra transcrita que não entra na legenda (mantém o tempo)
Cada trecho do roteiro precisa ter o mesmo número de palavras que o trecho transcrito.
"""
import json, re, sys

ROTEIRO = {
    3:  "Boa! / Agora eu quero / que você tenta / fazer mais uma / repetição aí",
    5:  "Não, não foi / isso que eu pedi / Eu pedi pra você / ~tentar~ fazer / mais uma repetição",
    6:  "Não, presta atenção / no que eu tô falando / ~Tenta~ fazer / mais uma repetição / Eu já fiz",
    7:  "*Exatamente!* / Você conseguiu perceber / o que aconteceu / aqui agora?",
    8:  "Não",
    9:  "O que acontece? / O ~tentar,~ / ele *não* *existe* / Ou a gente *faz* / uma coisa / ou a gente *não* *faz*",
    10: "O ~tentar,~ / a gente acaba / usando isso pra / *sabotar* *a* *nossa* *mente*",
    11: "Quando a gente fala / que a gente vai / ~tentar~ fazer / alguma coisa, / a gente tem / *muito* *mais* *chance* / *de* *falhar* nisso / Por quê? / Porque a gente fala, _ / a gente fala: / \"Ah, eu ~tentei~\"",
    12: "Por exemplo, / eu_vou ~tentar~ / fazer uma dieta / eu_vou ~tentar~ / fazer cardio / todos os dias / da semana",
    13: "Eu vou ~tentar~ / me alimentar bem / eu_vou ~tentar~ / treinar todo dia / Quando a gente bota / isso na cabeça / é *muito* *mais* *fácil* / da gente *falhar*",
    14: "Então a gente tem / que pensar o quê? / *Eu* *vou* *fazer* / dieta essa semana / *eu* *vou* *treinar* bem / *eu* *vou* me alimentar",
    15: "Porque dessa forma / a gente tem / *muito* *menos* *chance* / *de* *falhar* / porque a gente / *não* *vai* *estar* ~tentando~",
    16: "Entendeu? / Verdade / Então bora, / já deu um minuto / faz mais uma",
}

AMARELO = "&H0000D7FF&"   # #FFD700 (ASS usa BGR)
VERMELHO = "&H004040FF&"  # #FF4040
BRANCO = "&H00FFFFFF&"

def ts(t):
    t = max(0, t); h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f"{h}:{m:02d}:{s:05.2f}"

def main():
    pal = json.load(open("trechos/palavras.json", encoding="utf-8"))
    por_trecho = {}
    for p in pal: por_trecho.setdefault(p["r"], []).append(p)
    blocos = []  # (inicio, fim, [(texto, cor)])
    for r, rot in ROTEIRO.items():
        ws = por_trecho[r]
        toks = rot.split()
        palavras = [t for t in toks if t != "/"]
        if len(palavras) != len(ws):
            sys.exit(f"trecho {r}: roteiro {len(palavras)} palavras x transcrição {len(ws)}: "
                     + " ".join(w["t"] for w in ws))
        k = 0; atual = []
        for t in toks + ["/"]:
            if t == "/":
                if atual: blocos.append(atual); atual = []
                continue
            w = ws[k]; k += 1
            cor = BRANCO
            if t.startswith("*") and t.endswith("*") and len(t) > 1: cor, t = AMARELO, t[1:-1]
            elif t.startswith("~") and len(t) > 1:
                cor = VERMELHO; t = re.sub(r"^~(.*)~(\W*)$", r"\1\2", t)
            t = t.replace("_", " ").strip()
            atual.append((t, cor, w["i"], w["f"]))
    eventos = []
    for n, b in enumerate(blocos):
        ini = b[0][2]
        fim = b[-1][3] + 0.35
        if n + 1 < len(blocos): fim = min(fim, blocos[n + 1][0][2])
        fim = max(fim, ini + 0.45)
        if n + 1 < len(blocos): fim = min(fim, blocos[n + 1][0][2])
        partes = []
        destaque = any(c != BRANCO for _, c, _, _ in b)
        for t, c, _, _ in b:
            if not t: continue
            if c == BRANCO: partes.append(t)
            else: partes.append(f"{{\\c{c}\\b800\\fs{TAM_DESTAQUE}}}{t}{{\\c{BRANCO}\\b1\\fs{TAM}}}")
        texto = " ".join(partes).replace("} {", "} {")
        # entrada com "pop": 85% -> 104% -> 100%  (destaque pula um pouco mais)
        g = 112 if destaque else 104
        anim = f"{{\\fscx85\\fscy85\\t(0,70,\\fscx{g}\\fscy{g})\\t(70,140,\\fscx100\\fscy100)}}"
        eventos.append(f"Dialogue: 0,{ts(ini)},{ts(fim)},Legenda,,0,0,0,,{anim}{texto}")
    cab = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Legenda,Poppins,{TAM},&H00FFFFFF,&H00FFFFFF,&H00000000,&H90000000,-1,0,0,0,100,100,0,0,1,6,3,2,90,90,{MARGEM_V},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    open("legenda.ass", "w", encoding="utf-8").write(cab + "\n".join(eventos) + "\n")
    print(f"{len(eventos)} blocos")

TAM = 84            # Poppins Bold — equivale ao tamanho ~14 do CapCut num vídeo 1080x1920
TAM_DESTAQUE = 94   # destaque: Poppins ExtraBold, um pouco maior
MARGEM_V = 340      # base do texto a 340 px do rodapé (acima da interface do Reels, abaixo dos pés)

if __name__ == "__main__": main()
