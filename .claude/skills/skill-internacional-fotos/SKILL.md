---
name: skill-internacional-fotos
description: Faz um REEL da Resultax Internacional (contabilidade/tributação para brasileiros que moram no exterior) a partir SÓ DO ÁUDIO da narração, sem rosto, no padrão aprovado do Reel 65 — a "câmera" é uma montagem de cenas e fotos do Pixabay (buscadas pela API, PIXABAY_API_KEY) trocando a cada frase, por cima entram as peças de interface animadas do motor VSL na pele PRETA E DOURADA da logo, legenda centralizada, logo oficial sem fundo, trilha de efeitos sonoros variados e balanceados para celular (sopros nas trocas, carimbo audível, check, moeda, sino…) mixada e medida no arquivo, −14 LUFS. Use SEMPRE que pedirem "skill internacional fotos", "reel da Resultax", "vídeo da Resultax Internacional", "faz o reel desse áudio", "reel 61/62/…" com áudio de locução da Resultax, ou mandarem uma narração sobre saída fiscal, imposto no Brasil para quem mora fora, aluguel, Receita Federal, residência fiscal — mesmo sem citar a skill. NÃO é para vídeo com a pessoa falando na câmera (isso é a skill `reel`) nem para o estilo ilustrado/colorido (isso é a `skill-internacional`).
---

# skill-internacional-fotos · reel da Resultax só com a narração

O padrão é o **Reel 65** ("O maior erro de quem saiu do Brasil e deixou o imóvel alugado"), aprovado na v5 depois
de 4 rodadas de ajuste. Tudo o que a cliente pediu naquelas rodadas já está aqui — **não espere ela lembrar**:

| pedido da cliente no Reel 65 | como esta skill já entrega |
|---|---|
| cores da logo, preto e dourado (nada de roxo/azul) | `marca/pele-resolvida.json` copiada para o projeto |
| logo **sem** retângulo preto | `marca/resultax-logo.png` (fundo transparente), solta, com sombra suave; na cena clara, degradê no topo |
| marca escrita **Resultax** (um T só), "link da **Bio**" | `ferramentas/sem-rosto.py` corrige o transcript; confira o resto |
| cenas que combinem com o público (adulto, profissional, com patrimônio no Brasil) | regras de escolha das cenas abaixo (nada de fundo amarelo, meme, criança, balada) |
| efeitos sonoros **incluídos**, poucos, discretos, sem "vento"/"móvel arrastando" | paleta tonal `sons/` (sem ruído largo), ~0,5 efeito/s |
| efeitos **audíveis** e **variados**: sopro nas trocas de cena, batida de carimbo | trilha desenhada à mão, volumes calibrados na faixa do celular (`sons/volumes.json`) |
| o vídeo saiu sem som (o render não mixa os efeitos) | `mixar-sfx.py` obrigatório + medição de cada efeito no arquivo final |

Base técnica: a skill **`reel`** (motor de corte + motor VSL + `pixabay.py` + `mixar-sfx.py`). Esta skill só diz
**como usá-la para a Resultax**. Leia antes, inteiros: `.claude/skills/reel/regras-da-casa.md` →
`.claude/skills/reel/SKILL.md` (seções 1, 1b, 2, 4) → `exemplo/beats-reel65.js` (a régua de qualidade) →
`exemplo/REEL65.md` (mapa, cenas, fontes e as lições).

```
SKILL.md                     este arquivo
marca/resultax-logo.png      logo oficial sem fundo (496×279, RGBA)        · logo-original-fundo-preto.jpg (a original)
marca/pele-resolvida.json    preto #0b0a08 · texto #f7f3ea · dourado #c9a85c · dourado claro #e6d29a · prata #a89e88
sons/                        18 efeitos ≥ 400 Hz (sopro-sobe/desce/curto, carimbo, impacto, pop1-3, tick, check, ding,
                             moeda, brilho, erro, alerta, tictac, glitch, click) + volumes.json calibrado
ferramentas/montar-camera.py cenas do Pixabay cortadas nas viradas de frase → corte/clean-916.mp4 (a "câmera")
ferramentas/sem-rosto.py     depois do preparar.sh: rastreio fixo, vsl.json, pele, logo, sons, transcript
exemplo/beats-reel65.js      o beats.js final do Reel 65 (v5), com a trilha de efeitos no fim
exemplo/REEL65.md            roteiro, mapa, as 15 cenas (ids do Pixabay), fotos, fontes, lições de cada rodada
```
`S=.claude/skills/reel` · `F=.claude/skills/skill-internacional-fotos` (caminhos a partir da raiz do repositório).
Chave do Pixabay: variável `PIXABAY_API_KEY` (já configurada no ambiente; **nunca** imprima o valor).

## Fluxo (ordem fixa)

### 0 · Projeto
`reel-<NN>-resultax/` na raiz do repositório (o `.gitignore` já deixa `reel-*/` fora do git) com `bruto/ corte/
render/ qa/ entrega/ assets/`. Diga em uma linha o que vai acontecer e avise antes das etapas lentas (render ≈ 20 min,
em segundo plano). Não pergunte "com rosto ou sem rosto": áudio da Resultax = sem rosto.

### 1 · Corte da narração (motor de corte, `S/corte/CORTE.md`)
```bash
ffmpeg -f lavfi -i color=c=black:s=1080x1920:r=30 -i bruto/<audio>.mp3 -shortest -c:v libx264 -crf 30 \
  -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 bruto/bruto.mp4
python3 $S/corte/scripts/1-tomadas.py bruto/bruto.mp4 corte && cat corte/tomadas.txt
# corte/keeps.json: locução limpa → um keep por frase, só saem as pausas (retomada/erro: a melhor tomada)
python3 $S/corte/scripts/2-vicios.py corte && python3 $S/corte/scripts/3-corte.py bruto/bruto.mp4 corte
python3 $S/corte/scripts/4-conferir.py corte --prompt "Resultax Internacional, Receita Federal, saída fiscal" && cat corte/conferencia.txt
```
Critério: texto do corte idêntico à fala, **nenhuma palavra comida** (no 65, "o imposto" sumia no fim de um trecho:
proteja com `force`/`raw` e corte de novo), nenhuma pausa > 0,25 s. Ritmo do 65: 66,5 s → 57,6 s.

### 2 · Cenas (a "câmera") — Pixabay pela API
1. Divida o corte em **uma cena por frase/ideia**, 1,5–7 s cada (o 65 teve 15 cenas em 57,6 s). Liste
   `tempo · fala · cena` e marque quais trechos serão **FULL** (cena + legenda + lettering) e quais **SPLIT**
   (painel/gráfico em cima). Alterne; cada troca FULL↔SPLIT cai **num corte de cena**.
2. Busque cada cena **em português** (a API devolve as tags em PT; termos em inglês trouxeram lixo no 65) e olhe a folha:
   ```bash
   python3 $S/ferramentas/pixabay.py buscar "avião decolando" --tipo video --n 9 --folha qa/busca/c01.jpg
   ```
   Rode as buscas em paralelo (`&` + `wait`) e **olhe as folhas** (Read) antes de escolher.
3. **Escolha para o público:** brasileiro adulto (35–60), profissional, com imóvel/conta/empresa no Brasil e vida
   no exterior. Prefira: aeroporto, avião, malas, prédios e cidades (São Paulo, cidade europeia/americana), chaves,
   escritório, documentos, contrato, calculadora, celular com app de banco, homem/mulher maduros de roupa social,
   casal revisando contas, globo, relógio/ampulheta. **Evite:** fundo de cor chapada (o homem do fundo amarelo foi
   recusado), chroma key, meme/caricatura, jovem de balada, criança, IA (a busca já marca e tira), marca de
   terceiros visível, texto em outra língua grande na tela, coronavírus. Rosto de banco: ok como contexto, nunca
   como "cliente" ou depoimento.
4. Baixe já em 1080×1920, com sobra (`--ate` ≥ duração do trecho + 0,3 s; `--de` pula o começo tremido; `--pos`
   centraliza o assunto, 0 = esquerda, 1 = direita):
   ```bash
   python3 $S/ferramentas/pixabay.py baixar 228563 --tipo video --vertical --ate 3 --de 1 --pos 0.5 --nome c01 --projeto .
   ```
   Confira o recorte de cada uma (um quadro por clipe numa folha) e refaça o `--pos` do que ficou fora do centro.
5. Fotos para os cards (4 opções, pessoas, lugares): `buscar "<termo>" --n 6 --folha …` e
   `baixar <id> --tipo foto --nome <slug> --projeto .` → `assets/img/px-<id>-<slug>.jpg`.
6. `assets/montagem.json` = `{"cortes": [0, t1, …, "fim"]}` e
   `python3 $F/ferramentas/montar-camera.py` → `corte/clean-916.mp4`.

### 3 · Motor VSL
```bash
cp -R $S/modelo motor && cd motor && bash preparar.sh       # usa corte/clean-916.mp4 como câmera
python3 ../../$F/ferramentas/sem-rosto.py                    # rastreio fixo, vsl.json, pele, logo, sons, transcript
```
(Ajuste o caminho de `$F` à profundidade da pasta.) Depois corrija o transcript à mão (R6): nomes, siglas
(CPF, IR, IRPF, INSS, CRS, FATCA), números ("15%"), "Resultax" sempre com um T.

### 4 · beats.js — copie a estrutura do `exemplo/beats-reel65.js`
- **Cabeçalho igual** (`A`, `E`, `IMG`, `SPLIT_TOP = 240`, `CHEST = 1250`, `toFull`/`toSplit` com `hideMouth`, `ROW`, `SRC`).
- **Abertura:** `K.camcorder(0, t, {label: "<GANCHO EM CAIXA ALTA>?"})` + `K.glitch` + `K.punch` no primeiro corte.
- **FULL:** `K.pill` no peito (`y: CHEST + 40`), `K.chain`, lettering `K.stack` (`blur` → `glow`) em `top: 1150`, `K.flash`
  em virada forte. **SPLIT:** `K.section` (kicker + título) em `SPLIT_TOP` + `K.panel` (extrato, número gigante com
  fonte, checklist), `K.grid` (cards com foto), `K.flow` + `K.stamp`.
- Uma peça nova a cada 1,5–3 s, cada uma ancorada na palavra (`A("frase exata")`), nunca em segundos soltos.
- **Logo:** use a função `logo()` do exemplo — no SPLIT da fala "Resultax Internacional…" (`y: SPLIT_TOP + 10, h: 250`)
  e no CTA final (`y: 330, h: 290, escurecer: true`) acima de `K.cta("Link na bio", …)`.
- **Fato na tela** (alíquota, prazo, multa, regra): só com fonte oficial (gov.br/receitafederal) — escreva a fonte na
  própria tela em `SRC` e no `../assets/SOURCES.md`. Se não achar fonte oficial, mostre só o que a fala diz e
  avise na entrega ("vale um contador conferir"). Planalto (planalto.gov.br) é bloqueado na rede: use a busca na web.
- `K.mouthCaps({accent: [...]})` por último, com as palavras-chave da fala (inclua "Resultax", "Bio", "link").
- **Armadilhas já vistas (Reel 61):**
  - A legenda em FULL fica em y ≈ 1190. Uma `K.chain` de 3 itens no peito bate nela: ponha a corrente no alto
    (`y: 380`) ou esconda a boca (`K.hideMouth`) no trecho.
  - Toda peça com `until` precisa **começar antes** do `until`. Se começar depois, o `K.out` já passou e ela fica
    parada, borrada, nas cenas seguintes (aconteceu com um `K.stamp` em `E("aqui") + 0.1`).
  - `A("palavra")` pega a **1ª ocorrência**. Palavras repetidas ("mora", "fiscal", "saída fiscal", "no exterior")
    pedem `A("frase", n)` ou `A("palavra", 1, depoisDe)`. Confira cada âncora no snapshot.
  - Painel que entra antes da 1ª linha fica vazio: faça o painel entrar ≤ 0,5 s antes da primeira linha.

### 5 · Trilha de efeitos — desenhada à mão (obrigatória)
No fim do `beats.js`, copie o bloco **TRILHA DE EFEITOS** do exemplo e reescreva os momentos:
```js
const V = <conteúdo de sfx-projeto/volumes.json>;           // já calibrado: não mude sem medir
const S = (nome, t) => K.sfx(nome, t, V[nome]);
document.querySelectorAll('#vsl audio[src^="assets/sfx/"]').forEach((a) => a.remove());   // tira os automáticos
const ANTES = { sobe: 0.26, desce: 0.15, curto: 0.12 };    // o pico do sopro cai no corte
[["glitch", <1º corte>], ["curto"|"sobe"|"desce", <cada corte de cena>], …].forEach(…);
```
- **Toda troca de cena** tem sopro: `sopro-sobe` (FULL→SPLIT), `sopro-desce` (SPLIT→FULL), `sopro-curto` (corte simples).
- Um som **por tipo de acontecimento**: `check` (feito/organiza ✓), `moeda` (dinheiro entrando), `erro`
  (NÃO/negativo), `ding` (número grande), `pop1→pop2→pop3` (cards e passos em degrau), `carimbo` (`K.stamp`),
  `alerta` (pendência/risco), `impacto` (flash, "pior", "multa"), `tictac` (prazo/tempo), `brilho` (logo), `click` (botão).
- Densidade ≈ 0,5 efeito/s (o 65: 31 efeitos em 57,6 s), nenhum par a menos de 0,35 s.

### 6 · Render, mixagem, medição, entrega (`S/SKILL.md` seção 4)
```bash
node montar.mjs && npx hyperframes lint                       # 0 erros
npx hyperframes snapshot --at <cada troca e cada peça> -o snapshots   # OLHE: nada cortado, texto legível no dourado
node ferramentas/zona-segura-dom.mjs . --strict               # "zona segura OK"
npx hyperframes render -q high -o ../render/_reel-bruto.mp4   # ~20 min, em segundo plano
node montar.mjs --so-camera && npx hyperframes render -q high -o ../render/_camera-so.mp4 && node montar.mjs
node ferramentas/sons.mjs
python3 ferramentas/mixar-sfx.py ../render/_reel-bruto.mp4 ../sons.json ../render/_reel-sfx.mp4   # SEM ISTO NÃO HÁ EFEITO
bash ferramentas/audio-final-vsl.sh ../render/_reel-sfx.mp4 ../render/reel-v1.mp4
bash ferramentas/folha.sh ../render/reel-v1.mp4 ../qa/folha-final.png
python3 ../../.claude/skills/reel/ferramentas/verificar.py .. --video render/reel-v1.mp4 --sfx ../sons.json --camera ../render/_camera-so.mp4
```
**Antes de entregar, meça os efeitos no arquivo final** (não na conta do `sons.json`): o `mixar-sfx.py` imprime o
pico de cada um; compare a intensidade acima de 400 Hz de cada efeito com a da fala — sopros e pops 3–6 dB abaixo,
carimbo/impacto no nível da fala. Nenhum "FRACO". Gere `entrega/amostra-efeitos-vN.mp3` (os sons em sequência,
numerados) para a cliente poder dizer "troca o 7".

Entrega: copie para `entrega/reel-<NN>-resultax-vN.mp4`, mande o vídeo e a folha com `SendUserFile`, e responda
com duração (bruto → corte → final), LUFS e pico, nº de cenas e de efeitos, a tabela "momento → som", correções de
legenda, fontes dos fatos e o que vale conferir antes de publicar. **Nunca publique.** Os vídeos não vão para o git
(pesados): avise que o arquivo fica no cartão do chat e no ambiente só enquanto a sessão existir.

## Regras que valem sempre
- Pele preta e dourada, logo sem fundo, "Resultax" com um T, fontes nativas do motor. Texto sobre dourado é escuro
  (o motor faz sozinho com `--onAcc`; nos seus painéis use `color:var(--onAcc,#fff)`).
- Nada de ruído largo nos efeitos (soa como vento/móvel arrastando). Discreto ≠ inaudível.
- Cada ajuste pedido vira `vN+1` completo e verificado; versões anteriores ficam em `render/`.
- Ajuste só de som? Não precisa renderizar de novo a imagem: refaça `sons.mjs` → `mixar-sfx.py` → `audio-final`.
- Lição nova numa rodada (pedido da cliente que se repetiria)? Acrescente à tabela do topo e ao `exemplo/REEL65.md`
  (ou crie `exemplo/REEL<NN>.md`) e faça commit da skill no branch da sessão.
