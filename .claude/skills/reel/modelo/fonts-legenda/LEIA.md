# Fontes da legenda v3

| Arquivo | Fonte | Licença | Origem |
|---|---|---|---|
| `poppins-latin-600-normal.woff2`, `poppins-latin-ext-600-normal.woff2` | Poppins 600 (texto da legenda) | SIL Open Font License 1.1 | npm `@fontsource/poppins` 5.3.0 |
| `anton-latin-400-normal.woff2`, `anton-latin-ext-400-normal.woff2` | Anton (palavras-destaque) | SIL Open Font License 1.1 | npm `@fontsource/anton` 5.3.0 |

Para usar a fonte do cliente (ex.: Clarify-Md, que é paga e não vem com a skill), copie o arquivo para
`<P>/motor/assets/fonts-legenda/` e aponte no `vsl.json`: `"legendaFonte": "assets/fonts-legenda/Clarify-Md.otf"`
(e, se quiser, `"legendaDestaque": "..."` para a fonte dos destaques).
