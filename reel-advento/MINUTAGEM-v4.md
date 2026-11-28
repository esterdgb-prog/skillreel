# Advento da Reforma Tributária: reel v4 (prévia, 60 s)

Mesma narração (sem cortes). Mudanças sobre a v3:
- **Trilha natalina nova, constante** (LRA 2,6 LU; a referência tem 2,9): guizos em colcheias, piano elétrico, baixo, bumbo e vassourinha,
  melodia original em glockenspiel, tom maior, 100 BPM; abaixa só ~2,5 dB sob a voz. Sino de mão nas viradas.
- **Imposto**: abertura "REFORMA TRIBUTÁRIA · 30 dias · 30 portas" (0,3–2,4 s); palavras na tela (só sem legenda):
  NOVA NORMA, REFORMA TRIBUTÁRIA do consumo, ADVENTO DA REFORMA TRIBUTÁRIA, 30 PORTAS uma por dia.
  Calculadora em "…do Consumo" (no lugar da feira) com teclas + caixa registradora; moeda girando em "iniciaremos uma campanha:"
  (no lugar do corredor); carimbo no selo.
- **Convite**: pausa nova de 2,4 s antes da logo com "Venha acompanhar essa JORNADA conosco" dentro do anel dourado (49,7–53,4 s).
  Logo e "Resultax. Transformando confiança em resultados." passam a 53,7 s.
- Slogan novo ainda não entra (a voz atual diz o slogan antigo).

```bash
bash scripts/clipes.sh <pasta_clipes_pixabay> clipes
TIMELINE=timeline_v4 python3 scripts/audio.py audio/orig.wav audio4
python3 scripts/video4.py <original.mp4> imgs render4/_v4.mp4 [--legenda]
bash scripts/finalizar.sh render4/_v4.mp4 audio4/mix-bruto.wav render4/reel-v4.mp4
```
