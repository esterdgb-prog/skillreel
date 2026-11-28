# Reel 61 · Resultax Internacional · "Legal lá fora não significa regular aqui"

Feito em 28/11/2026 com esta skill. Áudio de 64,5 s (mp3 24 kHz mono) → corte de 58,3 s (só pausas; tomada única,
nenhuma retomada). 13 cenas do Pixabay + 4 fotos nos cards. O `beats.js` (v2) está em `beats-reel61.js`.

## Roteiro (texto do corte, já corrigido)
Você conseguiu o visto, recebeu o documento de residência e está totalmente legal no país onde mora. Mas isso não
significa que a sua situação fiscal no Brasil esteja resolvida. Uma coisa é estar legalizado no exterior. Outra,
completamente diferente, é estar regularizado perante a Receita Federal brasileira. O seu visto ou documento de
residência não comunica automaticamente ao Brasil que você deixou o país. Para isso, é necessário verificar quando
você passou à condição de não residente e cumprir as obrigações relacionadas à sua saída fiscal. Se isso não foi feito
corretamente, podem existir declarações pendentes, multas, impostos e até rendimentos no exterior que deveriam ter
sido informados durante o período em que você ainda era considerado residente fiscal no Brasil. Então, atenção: tá
legal lá fora não significa tá regular aqui. Mora no exterior e ainda não regularizou sua saída fiscal? Clique no
link da Bio e fale com a Resultax Internacional.

(Whisper: "Bill" → Bio, "Resultex" → Resultax, "a condição" → "à condição".)

## Mapa
| tempo | fala | câmera · cena | peça | som |
|---|---|---|---|---|
| 0,0–1,6 | "Você conseguiu o visto" | FULL · painel de partidas no aeroporto (c01 134789), **em cor** | título "ESTAR LEGAL NO EXTERIOR / NÃO RESOLVE SUA / SAÍDA FISCAL NO BRASIL" (até 7 s) | glitch-forte no corte · música entra |
| 1,6–7,1 | "recebeu o documento de residência e está totalmente legal…" | FULL · pai com a filha no frio (c02 253998) | título continua · corrente no peito (legenda escondida): Visto ↓ Documento de residência ↓ Legal no país onde mora | pop1 · check |
| 7,1–12,0 | "Mas isso não significa… situação fiscal no Brasil esteja resolvida" | SPLIT · laptop com painel financeiro (c03 148596) | "Situação fiscal resolvida" · ✓ Legal no país / Situação fiscal no Brasil RESOLVIDA? | sopro-sobe · check · erro |
| 12,0–14,6 | "Uma coisa é estar legalizado no exterior" | FULL · cidade europeia (c04 270049) | lettering "legalizado / no exterior" | sopro-desce |
| 14,6–20,8 | "Outra, completamente diferente, é estar regularizado perante a Receita Federal brasileira" | SPLIT · bandeira do Brasil (c05 140351) | "Lá fora ≠ aqui" · 2 cards: No exterior LEGALIZADO ≠ No Brasil REGULARIZADO | sopro-sobe · pop1 · pop3 |
| 20,8–26,7 | "O seu visto… não comunica automaticamente ao Brasil que você deixou o país" | FULL · saindo pelo aeroporto (c06 30870) | pílula "Visto ou documento de residência" · lettering "não avisa / o Brasil" | sopro-desce · alerta |
| 26,7–34,3 | "Para isso, é necessário verificar… não residente… obrigações… saída fiscal" | **TELA CHEIA de gráficos** (sem cena) | "Verificar e cumprir" · linha do tempo Residente → Não residente com o marcador "QUANDO?" andando · card "Cumprir as obrigações da saída fiscal" | sopro-sobe · tick · check |
| 34,3–39,3 | "Se isso não foi feito corretamente, podem existir declarações pendentes, multas, impostos" | SPLIT · assinatura de contrato com martelo (c08 198890) | "Podem existir pendências" · cards com foto na palavra | sopro-curto · pop1-2-3 |
| 39,3–43,0 | "e até rendimentos no exterior que deveriam ter sido informados" | SPLIT · moedas (c09 138315) | 4º card "Rendimentos no exterior" | sopro-curto · moeda |
| 43,0–47,3 | "durante o período em que você ainda era considerado residente fiscal no Brasil" | FULL · praia e prédios do Rio, céu azul (c10 336132) | pílula "Deveriam ter sido informados" · lettering "ainda era / residente fiscal" | sopro-desce · ding |
| 47,3–52,0 | "Então, atenção: tá legal lá fora não significa tá regular aqui" | SPLIT · homem pensativo (c11 137264) | flash · "Legal não é regular" · ✓ Legal lá fora / ✕ Regular aqui · carimbo "NÃO É A MESMA COISA" | sopro-sobe · impacto · check · erro · carimbo |
| 52,0–55,2 | "Mora no exterior e ainda não regularizou sua saída fiscal?" | FULL · homem no home office ao telefone (c12 86866) | pílula "Mora no exterior?" · lettering "saída / fiscal?" | sopro-desce · pop2 |
| 55,2–58,3 | "Clique no link da Bio e fale com a Resultax Internacional" | FULL · mãos com celular vermelho (c13 204527) | logo com degradê no topo · botão "LINK NA BIO" | sopro-curto · brilho · click |

`assets/montagem.json` → `"cortes": [0, 1.61, 7.08, 12.02, 14.58, 20.8, 26.7, 34.28, 39.32, 42.99, 47.26, 51.98, 55.18, "fim"]`

Fotos dos cards: 2004856 (declarações), 1537123 (multas · martelo com cifrão), 385506 (impostos · calculadora),
69523 (rendimentos no exterior · notas de várias moedas).

Sem número nem regra na tela além do que a fala diz: nada a checar em fonte oficial.

## v2 — o que a cliente pediu e o que mudou
- *"Título logo no gancho: ESTAR LEGAL NO EXTERIOR NÃO RESOLVE SUA SAÍDA FISCAL NO BRASIL"* → `tituloGancho()` no alto,
  3 linhas, "SAÍDA FISCAL" em dourado, de 0 a 7 s.
- *"Não use preto e branco no gancho"* → saiu o `K.camcorder` (dessaturava).
- *"1ª transição após o gancho: glitch"* → som `glitch-forte` (0,42 s) junto com o `K.glitch`.
- *"Inclua música de fundo, cuidado com a altura, algo de alerta"* → `trilha-alerta.py` + `mixar-trilha.py` (20 LU abaixo
  da voz, ducking).
- *"Não gostei da imagem de papel branco (verificar e cumprir)"* → virou tela cheia de motion graphics.
- *"Não repetir mídias"* → c03, c08 e c13 repetiam o Reel 65 (293084, 87146, 3180): trocados. Nasceu o `midias.py`.
- *"Paisagens mais bonitas"* → São Paulo cinza (25911) → Rio com céu azul (336132).
