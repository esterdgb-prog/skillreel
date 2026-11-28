---
name: skill-internacional
description: Faz um REEL 9:16 da Resultax Internacional (ou no mesmo estilo) a partir de um ROTEIRO + ÁUDIO DE NARRAÇÃO, sem apresentador na tela — tudo em motion graphics ILUSTRADO E COLORIDO (mapas reais com seta e zoom no país, personagem, mala, avião, bandeiras, cofrinho, dinheiro, formulários, ícones coloridos, lupa da malha fina, carimbos), com a legenda do reel "Saída Fiscal", efeitos sonoros mixados e corte da voz que NUNCA come palavra. É o motor que fez o reel aprovado "Fundador do Nubank no Uruguai → Saída Definitiva" (nov/2026). Use quando pedirem "skill internacional", "reel da Resultax", "faz um reel com esse roteiro e esse áudio", "vídeo animado/colorido com mapa", "motion graphics de imposto/saída fiscal/morar fora", ou mandarem roteiro + narração para virar reel. NÃO serve para vídeo com a pessoa falando na câmera (isso é a skill `reel`) nem para o estilo com FOTOS e vídeos reais do Pixabay em preto e dourado, sem roteiro, só com o áudio (isso é a `skill-internacional-fotos`, o padrão dos Reels 61 e 65). Na dúvida entre as duas, pergunte qual estilo: ilustrado colorido ou fotos.
---

# skill-internacional · reel ilustrado e colorido a partir de roteiro + narração

**O que entrega:** `entrega/reel-vN.mp4`, 1080×1920, 30 fps, com:
- a voz do cliente completa (nenhuma palavra cortada);
- cenas ilustradas coloridas que entram na palavra falada;
- a legenda do reel "Saída Fiscal" (2–3 palavras por vez, palavra-chave em dourado, fixa em ~y 1190);
- efeitos sonoros audíveis (7–15 dB abaixo da voz);
- volume em −14 LUFS e pico ≤ −1 dBTP.

**Régua de qualidade:** `exemplo/` (o reel aprovado). Abra `exemplo/folha-final.png` e leia `exemplo/beats-nubank-uruguai.js` inteiro antes de escrever cenas.

## O que o cliente quer (lições do reel aprovado)
- **Colorido e dinâmico, não traço minimalista.** A 1ª versão em traço dourado fino foi reprovada: "nada a ver com os coloridos". O padrão é ilustração plana preenchida, com sombra, cores vivas e fundo escuro neutro (como reels de anatomia/curiosidade).
- **Quando a fala cita um lugar, mostre o MAPA REAL:** o país acende, uma seta anda até ele e a câmera dá zoom, com a bandeira e o nome. O cliente pediu exatamente isso para "Uruguai".
- **Câmera viva:** zoom e recuo (`cam`), objetos caindo com quique (`drop`), deslizando (`slide`), andando por um caminho (`along`), carimbos, tremor (`shake`), confete.
- **Legenda:** a do reel "Saída Fiscal". Não use a do vídeo de referência (caixas azuis com emoji).
- **Nenhuma palavra cortada.** O motor de corte da skill `reel` comeu "Bra-sil" e "diag-nóstico". Aqui o corte é `corte-seguro.py`, que só encurta pausas de silêncio total.
- **Efeitos sonoros:** o cliente quer ouvir. Eles só existem porque `finalizar.sh` os mixa por fora (veja as armadilhas abaixo).
- **Marcas de terceiros** (como a imagem do Nubank enviada pelo cliente) entram como citação de notícia. Avise para o cliente confirmar o uso.

## Fluxo
`S=<raiz desta skill>` (no repositório: `.claude/skills/skill-internacional`) · `P=<pasta do reel>` (ex.: `reel-<tema>/`).

1. **Material:**
   - roteiro em `P/voz/roteiro.txt`, escrito **como foi falado** ("pra" onde a pessoa disse "pra");
   - narração em `P/bruto/`;
   - imagens do cliente em `P/assets/oficiais/`. Tire o fundo com `rembg` (modelo `isnet-general-use`); logo sobre preto: alfa pela luminância.
2. **Motor:** `cp -R $S/motor P/motor && cd P/motor && npm install --no-audit --no-fund --ignore-scripts`. Copie as imagens para `assets/img/` (a logo da Resultax já vem).
3. **Voz → motor sincronizado:** `bash ferramentas/preparar-voz.sh ../bruto/<audio> ../voz/roteiro.txt "<nomes próprios>"`.
   - Leia a transcrição impressa inteira contra o roteiro.
   - As trocas listadas (ex.: "Risultex" → "Resultax", "Bill" → "bio") são esperadas.
   - Um "descarta" é fala fora do roteiro: confira.
4. **Mapas** (se a fala cita países): ajuste caixa, países e pontos em `ferramentas/gerar-mapas.cjs`.
   - Em `/tmp`: `npm i world-atlas@2.0.2 topojson-client@3.1.0`, depois `node gerar-mapas.cjs <motor>/src/mapas.js`.
   - O `src/mapas.js` que vem com a skill já tem a América do Sul (50m) e o Atlântico com Europa (110m), com São Paulo, Brasília, Montevidéu e Lisboa.
5. **Cenas em `src/beats.js`:** uma cena por ideia do roteiro, algo novo a cada 1,5–3 s, cada peça na palavra (`A("frase")`).
   - Termine com `K.mouthCaps({accent:[…]})`.
   - Monte e confira: `node montar.mjs && npx hyperframes lint`, depois `npx hyperframes snapshot --at <um tempo por cena> --no-end -o snaps` e **olhe a contact-sheet**.
   - Mostre ao cliente uma folha com um quadro por cena antes do render, se ele ainda não aprovou o visual.
6. **Final:** `bash ferramentas/finalizar.sh <N>` em segundo plano, cerca de 10 min por minuto de vídeo. Faz render, efeitos, mixagem, −14 LUFS, folha e a transcrição do vídeo final.
   - Confira `qa/palavras-final.json` contra o roteiro (todas as palavras inteiras, inclusive a última) e olhe `qa/folha-final.png`.
   - Efeitos mais altos ou baixos: `SFX_GANHO_DB=3 bash ferramentas/finalizar.sh <N>`.
   - Atalho: só remixar áudio e mux, sem re-render. Rode `mixar-sfx.py` → mux → `audio-final-vsl.sh`, as mesmas linhas do script.
7. **Entrega:** envie o `.mp4` ao cliente. Faça commit dos fontes (o `render/` fica no `.gitignore`) e relate em português:
   - o que mudou;
   - duração;
   - LUFS;
   - nº de efeitos;
   - pontos para o cliente confirmar.

## Biblioteca (`motor/src/biblioteca.js`, carregada antes das cenas)
| Peça | O que faz |
|---|---|
| `scene(html, t, until)` | camada 1080×1920 que entra com blur e sai em `until` |
| `pop` · `drop` · `slide` · `draw` · `pulse` · `float` · `shake` · `count` | entradas e movimentos (pop elástico, queda com quique, deslize, traço, pulso, flutuar, tremor, contador) |
| `cam(el, x, y, s, t, d, cx, cy)` · `camSet` | câmera: leva o ponto (x,y) do conteúdo para (cx,cy) da tela com escala s (zoom no país, recuo no mapa-múndi) |
| `along(el, path, t, d)` | objeto andando por um `<path>` e girando na direção (ponta da seta, avião) |
| `CHAR` · `SUITCASE` · `FLAG_UY` · `FLAG_BR` · `COIN` · `CASH` · `BAR` · `PIGGY` · `NEWS` · `TILE` · `BADGE` · `CHIP` · `LEAD` | personagem, mala, bandeiras, moeda, dinheiro, barra de ouro, cofrinho, cartão de notícia, ícone em azulejo (com selo "!"), número de passo, etiqueta, rótulo com linha-guia |
| `C` | paleta (verde Brasil, azul Uruguai, amarelo, vermelho, laranja, roxo Nubank, dourado…) |
| gradientes `#gGold #gShade #gBR #gUY` | já definidos no fundo |

Kit (`K.*`, do motor VSL): `K.pill`, `K.stamp`, `K.cta`, `K.logo`, `K.glitch`, `K.sfx`, `K.hideMouth`, `K.mouthCaps`, `K.at`.

## Armadilhas (todas aconteceram neste reel)
- **Efeitos que não tocam:** `K.sfx` cria `<audio>` em tempo de execução, e o `hyperframes render` só grava os áudios do HTML estático (o log mostra `audioCount: 1`). Por isso o `finalizar.sh` lista os efeitos (`sons.mjs`) e os soma à voz (`mixar-sfx.py`).
  - Para conferir, compare o áudio final com a voz pura: diferença de ~−52 dB significa sem efeitos; ~−30 dB, com efeitos.
- **Palavra comida:** nunca use o `3-corte.py` da skill `reel` nesta skill. Se a narração precisar ficar mais curta, peça ao cliente para regravar mais enxuto, ou use `corte-seguro.py --rel 26 --margem 0.2` e confira palavra por palavra.
- **SVG com `transform="translate(…)"` + animação de x/y no mesmo elemento:** o GSAP troca a posição e o objeto vai parar no canto. Ponha a posição num `<g>` externo e anime o `<g class>` interno. `CASH` e `BAR` já fazem isso.
- **Estado inicial:** `K.fromTo` não aplica o "de" antes da hora, então o objeto aparece pronto e depois "volta". Use `gsap.set` (ou `style.opacity = "0"`) no estado inicial. Foi o caso do formulário que surgia já preenchido.
- **Cena que nunca sai:** se uma peça entra depois do `until` da cena, ela fica até o fim do vídeo (foi o caso da bandeira do Uruguai em todas as cenas). Calcule `until = Math.max(próxima frase, último evento + 1 s)` e empurre o início da cena seguinte.
- **Preenchimento antes do traço:** um elemento com `fill` desenhado com `draw` mostra o fundo antes do traço. Use `fill: none` ou dê `pop` no preenchimento.
- **Legenda sobe:** uma pílula do kit (`K.pill`) abaixo de ~y 1040 empurra a legenda para cima, sobre o conteúdo. Use etiquetas da cena (`CHIP`) ou `K.hideMouth` no trecho, como no CTA.
- **Texto das cenas com `$`:** o `montar.mjs` desta skill insere as cenas com uma função no `replace`. Na versão antiga (texto), `$$` virava `$` e ``$` `` colava o começo da página de novo (vídeo e voz duplicados, lint `overlapping_clips_same_track`). Não volte para `replace` com texto.
- **Ambiente:**
  - `npm install --ignore-scripts`, porque o onnxruntime-node falha atrás do proxy;
  - `HF_HUB_DISABLE_XET=1` para baixar o Whisper;
  - `CHROME=/opt/pw-browsers/chromium-*/chrome-linux*/chrome` para `sons.mjs`;
  - python com `-I` quando ler arquivos baixados;
  - heredoc com `$$` dentro de `bash -c` dispara o bloqueio de segurança: escreva o script num arquivo.

## Verdade e fontes
- Toda afirmação que vira tela é conferida (data anotada) em `P/assets/SOURCES.md`.
- Mapas: Natural Earth (domínio público).
- Dado contestado: diga só o que é verdade. Ex.: "muito se falou na economia de impostos" é verdade; "ele economizou X" foi contestado por checadores.
