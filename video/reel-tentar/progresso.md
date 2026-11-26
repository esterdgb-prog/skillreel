# Progresso — reel "O tentar não existe"

## Corte (motor de corte)
- Bruto: `bruto.mov` 82,2 s, 2160×3840 (gravado em 4K rotacionado). Diálogo treinador × aluna, tomada única.
- O ffmpeg do corte morreu por memória com 39 trechos em 4K → proxy `bruto-1440.mp4` (1440×2560, mesmos tempos) e corte sobre ele.
- Keeps: 6,40–9,50 (fala) · 9,55–10,55 raw (esforço da aluna na 1ª tentativa, faz parte da história) · 12,50–75,20.
- Saiu: 0–6,4 s (ela no aparelho, ruído), silêncios, o fim depois de "faz mais uma" (+1 s de respiro mantido).
- Palavras comidas na 1ª passada e protegidas (`ajustes.json` force): "não **foi**", "**Eu** já fiz", "vou tentar treinar",
  "**Porque** a gente não vai…", "Verdade" (aluna, longe do microfone), cauda final.
- Resultado: 54,1 s. Repetições coladas ("Não, não", "eu pedi, eu pedi", "a gente fala, a gente fala") são fala real.
  Pausas > 0,25 s restantes ficam dentro de trechos protegidos (respiros do diálogo, ex.: "Entendeu?" → "Verdade").

## Transcript (R6)
- "Não," estava esticado sobre o esforço da aluna (2,30 s) → realocado para 3,95 s pelo nível do áudio.
- "Se a gente fala" → "Porque a gente fala" · "acontece," → "acontece?" · pontuação de fim de frase em 25 palavras
  (a legenda quebra bloco na pontuação: não junta mais a fala de um com a do outro).

## Enquadramento
- Plano aberto, duas pessoas, rostos pequenos (o MediaPipe não achou rosto: 0 de 1582 quadros).
- Medido no navegador: rosto do treinador ≈ x 144–247 · y 456–600; aluna ≈ x 800–930 · y 720–840 (quadro 1080×1920).
- "Punch" virou reenquadramento por janela (`SHOT` em `src/beats.js`): aberto 1,0 · dois 1,2 · médio 1,7 · close 2,3 · aluna 1,6.
- Câmera em 1440×2560 (não 1080) para o close 2,3× não ficar mole.
- Legenda fixa no chão (y 1430): `face-track.json` fixo (ponto central, "queixo" abaixo do quadro → o kit prende no limite da zona segura).

## Pele
- Legenda e UI em Poppins (pedido do usuário) · destaques em Anybody 900 (fonte display do motor) · tema laranja do kit.
- "tentar" sempre em vermelho (#ff3d3d), "fazer" em laranja.

## Verificação
- lint 0 erros · snapshots em cada beat (rosto livre; dois ajustes: letreiros quebrando linha → nowrap + tamanho calculado;
  topo da cabeça no plano médio → enquadramento desceu) · zona segura DOM OK (largura máx. 790 px, entrada com escala 1,25).

## v2 (pedido: execuções da aluna inteiras · laranja → vermelho · nenhuma palavra comida)
- **Corte refeito por outro critério** (registrado em `corte/keeps.json` → `_metodo`): 0–23,45 s sem corte nenhum (execuções e
  as duas tentativas da aluna); no resto, corte **só em silêncio digital** (< −70 dB por ≥ 0,35 s; o áudio tem gate e as pausas
  ficam a ~−95 dB), com 0,1 s de folga de cada lado, keeps `raw` (o detector de fala do motor não decide borda). 13 silêncios
  cortados, 71,4 s. Medição independente das 24 bordas no áudio-fonte: a mais alta a −82 dB (fala > −45 dB) → nenhuma emenda
  toca palavra. v1 guardada em `keeps-v1.json` / `ajustes-v1.json`.
- Transcript: 0–23 s com os tempos da transcrição por trecho (a longa estica as palavras sobre as execuções); final
  ("Então bora… faz mais uma") reposicionado pelo nível do áudio.
- Abertura nova: HUD → glitch em 1,0 s → zoom na aluna executando + gancho O TENTAR / NÃO EXISTE → aberto → dois → "Boa!".
  2ª tentativa dela também ganhou plano próprio.
- Cores: pele com destaque vermelho (#ff2d2d) e apoio #ff3b3b. O tema "laranja" do kit (`#vsl.t-laranja`) vencia a pele no
  CSS (especificidade maior) → `theme` voltou ao padrão e a pele manda. Rosto sem tinta vermelha visível nos snapshots.
- Zona segura: escala de entrada dos letreiros limitada pela largura (nunca passa de 840 px na animação).
