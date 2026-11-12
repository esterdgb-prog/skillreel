# Regras da casa — valem para TODOS os estilos

*Lições de produção real. Todo estilo obedece a este bloco. Quando uma regra daqui conflitar com a
regra de um estilo, **vale esta**.*

## R1 · O rosto nunca é coberto
Nenhuma imagem, card, chip, painel, carimbo, título ou motion fica sobre o rosto do apresentador (da
testa ao queixo), nem escurecido, nem "só por um instante". Para mostrar algo enquanto ele fala, em
ordem de preferência:
1. **Tela dividida:** gráficos na metade de cima (y 270–810), câmera na metade de baixo com o rosto
   inteiro (o vídeo desce ≈ 990 − topo da cabeça) e legenda na costura (y ≈ 830). Corte instantâneo
   quando uma cena de tela cheia esconde a troca; senão, um deslize de 0,4 s com a legenda escondida.
2. **Abaixo do rosto:** objetos pequenos (chips, 2–3 cards pequenos, lettering) entre o queixo e a legenda.
3. **Cena de fundo própria:** uma tela sem o apresentador, com os elementos distribuídos.

Títulos "atrás da cabeça" (com recorte do apresentador) só quando sobra espaço acima da cabeça: meça
o topo da cabeça (`ferramentas/rosto.py`). Com menos de ~300 px livres, troque por lettering no
peito. Todo snapshot é conferido para esta regra; um quadro com algo sobre o rosto é reprovado.

## R2 · Efeitos sonoros com parcimônia
No máximo **~0,85 SFX por segundo** (um reel de 40 s tem ~34, não 45).
- O whoosh entra só em troca de cena de verdade.
- A batida/hit entra só em carimbo, X ou momento de impacto.
- Sem som em chip pequeno, em item de lista menor ou em elemento que entra < 0,6 s depois de outro som.
- Volumes baixos (0,1–0,2 do volume da voz).
- Digitação: sample natural, ritmo humano (~9 teclas/s), contínua sobre o trecho inteiro, nunca
  rajada sintética; ≈ 12 dB abaixo da voz.
- Sons gerados localmente, sem licença envolvida (`ferramentas/sfx.sh`):
  - whoosh: `ffmpeg -f lavfi -i "anoisesrc=color=pink:d=0.55" -af "highpass=f=300,lowpass=f=5500,afade=t=in:d=0.28,afade=t=out:st=0.3:d=0.25" whoosh.wav`;
  - hit: seno de 52 Hz com decaimento de 0,6 s;
  - pop: 1,25 kHz por 90 ms;
  - tick: ruído branco de 50 ms com passa-alta.

## R3 · Material real e verificado
- Toda afirmação falada que vira tela é conferida numa **página oficial** (data da consulta anotada).
- Todo número na tela tem fonte (preço oficial, plano, período).
- **Prioridade de imagem:** 1. print/logo oficial; 2. Wikimedia Commons / Openverse com licença;
  3. arquivos do próprio apresentador; 4. **ilustração declarada**: HTML próprio, empresa fictícia,
  rotulada como ilustração.
- **Nunca invente:** logo, capa, print, número, resultado ou contagem de seguidores. Marca sem logo
  livre entra só como texto.
- CAPTCHA/anti-robô nunca se burla: troque de ferramenta ou peça o print ao apresentador.
- Tudo listado em `assets/SOURCES.md` (arquivo, origem, licença, data).
- Se fala e tela usarem moedas ou unidades diferentes, confira a coerência e avise na entrega.

## R4 · Cor natural no rosto
Nada de grade agressiva: o rosto fica natural. A identidade de cor vive nos gráficos (cards,
pílulas, brilhos), não na pele. Valores aprovados quando há grade:
`saturate(1.04) contrast(1.05) brightness(0.97)`; camadas de tinta ≤ 0,3.
Grade mais forte só com antes × depois mostrado e aprovado. Nesta skill a cor da câmera é só o filtro
aprovado do `vsl.json`; qualquer grade a mais respeita este teto.

## R5 · Corte: nenhuma palavra comida
- Tire pausas, respirações, "ééé", gaguejos e retomadas, ficando com a **última** tomada certa. Uma
  frase repetida para corrigir o sentido também conta; quem decide é o sentido.
- O corte pelo som come início e final de palavras em fala rápida. **Toda emenda é conferida** com
  uma transcrição em janelas no fim de cada segmento.
- Palavra comida → proteger o trecho (manter o intervalo do bruto inteiro) e cortar de novo.
- Nunca misture tempos do bruto com os do vídeo limpo. Depois de qualquer recorte, retranscreva e
  remapeie tudo o que dependia dos tempos.
- O corte é do motor de corte (`corte/`); o estilo recebe o vídeo já limpo (`clean.mp4`).

## R6 · Legenda com o texto certo
- Corrija o transcript à mão antes de montar. Erros típicos da transcrição neste nicho:

  | Transcrição | Correto |
  |---|---|
  | Cloud | Claude |
  | A | IA |
  | Gama | Gamma |
  | carrocéis | carrosséis |
  | vim | envio |
  | Powerpoint | PowerPoint |

- Nomes de produto sempre como a marca escreve.
- Palavra-código do CTA em CAIXA ALTA.
- Guarde o original (`transcript-bruto.json`) e corrija por tempo, não por texto, quando a palavra
  se repete ("A" de "IA" × "A partir").

## R7 · Zona segura
- **Reels/Shorts orgânico:** todo texto/UI em x 90–990, y 220–1520, e nada na coluna de botões
  (x > 940 e y > 1150).
- **Anúncio:** x 65–1015, y 270–1248.
- Fundos e decoração podem sangrar.
- Confira com `ferramentas/zona-segura.py` (varredura a cada 0,25 s).

## R8 · Áudio final
- Integrado **−14 LUFS (±0,5)**, pico ≤ −0,5 dBFS, sem recodificar a imagem (`-c:v copy`).
- loudnorm em duas passadas, ou ganho + limitador quando o loudnorm linear deixar o pico em 0 dBFS.
- No zsh, use `${var}` com chaves dentro de filtros.

## R9 · Verificação antes de entregar
1. lint com 0 erros; 2. snapshot em cada beat e em cada transição; 3. rosto (R1), zona segura (R7),
texto legível e nada cortado; 4. render; 5. áudio (R8); 6. folha de quadros do final; 7. `VERIFY.md`
com duração, LUFS, o que foi protegido no corte, as correções da legenda e os pontos abertos.
**Nunca publicar nem enviar o vídeo.**

## R10 · Ambiente isolado
Os caminhos vêm de variáveis de ambiente (`WHISPER_PYTHON`, `FACE_MODEL`, `RVM_MODEL`, `CHROME`),
nunca de pastas fixas do usuário. Problemas já vistos: transcrição "terminando" sem arquivo → fixar
`av==16.1.0`; snapshot quebrando com erro do postcss → `npm ci` na raiz; pasta de cache que não
existe → criar antes de baixar.

## R11 · Perfil do apresentador
Nome, @ e avatar vêm do `perfil.json` do apresentador. O avatar pode ser um quadro do próprio vídeo,
recortado. Contagem de seguidores só se o apresentador informar. **Nenhum nome de terceiro** (outro
criador, curso ou produto que não seja do apresentador) aparece no vídeo ou nos arquivos do projeto.

---

# Regras aprovadas pelo cliente (nov/2026)

*Vieram de três rodadas de ajuste num anúncio real ("Método 40", v1 → v3, aprovado como "ficou perfeito") e num reel de
notícia. Valem por cima do exemplo e das regras de estilo.*

## R12 · A legenda nunca come palavra
Toda palavra falada aparece na tela — na legenda ou num lettering — e nenhuma some rápido demais.
- A legenda v3 (`modelo/legenda.js`, `"legenda": "v3"` no `vsl.json`) não se esconde nas trocas de layout nem no SPLIT
  (no SPLIT fica fixa no topo do card da câmera).
- Ela só pula as palavras que um lettering está mostrando: `hideCap(A("primeira palavra do lettering"),
  K.end("última palavra"))`. **Nunca** estique essa janela: 0,2 s a mais engoliu "Eu" e "O Método" na v3.
- Cada palavra aparece na hora em que é dita (invisível antes) e cada bloco fica ≥ 0,4 s na tela. Na v2, o "não" de
  "Saiba Mais **não** estiver aparecendo" sumia em 0,13 s, e o sentido do CTA se invertia.
- A legenda fica 48 px abaixo do queixo, seguindo o rosto **pelo tempo**. O `face-track.json` só guarda os quadros em que
  o rosto foi detectado; o kit lia pelo número do quadro, e a legenda caía em cima do rosto, seguindo outro momento.
- Conferência obrigatória antes do render: `node ferramentas/tempo-legenda.mjs`. As palavras puladas têm de ser
  exatamente as dos letterings, e nenhuma palavra da legenda pode ficar < 0,3 s (exceção registrada: fala colada a um
  lettering que repete a palavra).
- Destaque: fonte de destaque (Anton), branca, maior, com sublinhado na cor de destaque. Nos blocos com destaque, as
  palavras sobem de baixo para cima; nos outros, só acendem. **Sem retângulo atrás da palavra** (reprovado) e sem palavra
  em vermelho sobre roupa vermelha (some).

## R13 · Lettering fiel à fala
O texto grande na tela (`K.stack`) repete as palavras ditas, na ordem, sem resumir nem parafrasear:
"VOCÊ NÃO PRECISA / PASSAR MUITO TEMPO / NA ACADEMIA", nunca "NÃO PRECISA DE HORAS"; "E AGORA VOCÊ / TAMBÉM PODE /
TER ACESSO A ELE", nunca "AGORA VOCÊ TAMBÉM PODE". Cada linha entra na sua palavra. Frase longa → 3 linhas de até
~18 caracteres (size 70–76). A legenda espera o fade de saída do lettering (`stackOut(until)`) para não encavalar.

## R14 · Logo do cliente
- Use o PNG que o cliente mandar, **sem fundo e sem nenhuma alteração** (nem recolorir, nem pôr card branco atrás).
  Sobre fundo escuro, um brilho branco difuso em volta do desenho (`LOGO_CANTO`, padrão) é aceito; `{brilho: false}` tira.
- Entra em **toda** menção ao método/marca, com um impacto forte (`impacto2.wav`).
- Lugar: canto superior direito em FULL; canto superior direito do card da câmera em SPLIT. A logo nunca substitui a
  legenda (a legenda continua) e nunca encavala com ela. Dentro de painéis, o nome vai em texto.

## R15 · Efeitos sonoros mixados de verdade
- O render do hyperframes **não leva** os `<audio>` que o kit cria (`K.sfx`). O áudio do render sai só com a voz:
  a v1 de um reel foi entregue assim, sem efeito nenhum.
- Os efeitos entram pelo `ferramentas/mixar-sfx.py`, com nível **relativo à voz**:
  - whoosh (`whoosh2.wav`) em toda troca de layout, ≈ 4 dB abaixo do RMS da fala;
  - impacto (`impacto2.wav`) em toda logo, o mais forte;
  - carimbo, ding e pop mais baixos;
  - ≈ 0,6 efeito/s.
- O `swoosh.wav` do kit é mudo (−59 dB). O som de "transição" com ruído rosa e seno grave foi reprovado ("parece
  arrastando"), e o glitch/boom do gancho também ("som de erro"); o mixador tira os dois.
- Confira medindo: a diferença entre o render e a mixagem tem de existir em cada evento.

## R16 · HDR, render e conferência
- O iPhone grava HDR (HLG): o `preparar.sh` converte a câmera para SDR BT.709. O render é sempre com `--sdr`.
  Em HDR, o hyperframes pôs a câmera **por cima** da interface em tela cheia, e o vídeo saiu sem nenhuma peça.
- Confira quadros do **render final** (não só os snapshots) antes de entregar.
- Antes de montar, rode `node ferramentas/checar-ancoras.mjs -v`. Uma âncora quebrada deixa o vídeo sem peça nenhuma;
  uma ocorrência errada (`A("na academia", 3)`) faz a peça entrar fora da hora (o risco que nunca apareceu).

## R17 · Anúncio e pedidos de estilo do cliente
- **Anúncio:** zona segura x 65–1015 · y 270–1248 (`_anuncio` do `vsl.json`). Use `--profile ads` no
  zona-segura-dom e `--perfil anuncio` no verificar.py.
- Com botão nativo ("Saiba mais"), **não desenhe botão de CTA**: só pílulas ("Vagas encerradas", "Ainda tem vaga").
- Gancho com **zoom forte e contínuo** (`K.drift(0, fim_do_gancho, 0.34)`, 1,04 → 1,38).
- "Cor mais viva": preset aprovado `_corViva` do `vsl.json` (`saturate(1.16) contrast(1.08) brightness(1.03)`, tinta
  0,18 / 0). Com destaque vermelho, sem tinta 2: ela tinge o rosto.
- Cores da marca do cliente → `pele-resolvida.json`. Fonte da marca → `"legendaFonte"` (o cliente manda o arquivo).
- **Desfoque de fundo: não** (testado e reprovado; também deixou halo em volta do apresentador).
