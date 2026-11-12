# Efeitos extras (gerados localmente, sem licença de terceiros) — regenere com `ferramentas/gerar-sfx-extra.py`

| Arquivo | Uso | Como foi feito |
|---|---|---|
| `whoosh2.wav` | toda troca de layout (FULL↔SPLIT) e a entrada do gancho | ruído branco num passa-banda que sobe e desce (600 → 3200 → 900 Hz), envelope rápido, pan esquerda→direita, 0,5 s |
| `impacto2.wav` | toda entrada da logo do cliente | subida curta (0,25 s) + pancada grave 110 → 38 Hz + corpo 180 Hz + estalo + cauda grave, saturação leve, 1,4 s |

Aprovados pelo cliente em nov/2026 (o "transicao" de ruído rosa + seno grave foi reprovado: "parece que está arrastando
alguma coisa"; o glitch/boom do gancho também: "som de erro").
