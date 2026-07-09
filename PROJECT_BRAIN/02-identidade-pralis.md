# Identidade visual oficial — Pralís

Fonte: manual institucional `pralís 2022 - institucional - identidade visual.pdf` (25 páginas) e pacote `Design SVG.zip`, ambos em `Referencias design pralis/` (fora do repositório de código, na pasta de trabalho `marketing-hub-pralis-hora/`). Lido e documentado integralmente em 2026-07-08.

## Conceito

Padaria artesanal. Conceito central: **trigo → pão → partilhar → sorriso**. O símbolo da marca (duas folhas/pétalas construídas a partir da proporção áurea) representa esse ciclo. Tagline oficial: **"é provar e ser feliz"**.

Frases de campanha (tom de voz, usadas em peças/redes sociais, sempre no padrão "Deixa [algo negativo] pra lá! Traz sua/seu [algo positivo] PRALÍS."):
- "Deixa a vontade pra lá! Traz sua fome PRALÍS."
- "Deixa a tristeza pra lá! Traz sua felicidade PRALÍS."
- "Deixa o stress pra lá! Traz seu momento PRALÍS."

## Cores oficiais

| Nome | Hex | RGB | CMYK | Pantone |
|---|---|---|---|---|
| Dourado | `#B8860B` | 184, 134, 11 | 27 45 100 6 | 7556 C |
| Laranja | `#F37435` | 243, 116, 53 | 0 70 100 0 | 151 C |
| Marrom | `#5E3731` | 94, 55, 49 | 25 75 73 68 | 4975 C |

Essas três cores **já estavam corretamente configuradas** em `lib/brands.ts` antes do redesign de 2026-07-08 — não precisaram de correção. O logo tem 3 variantes de cor (uma por cor da marca) mais uma versão branca e uma preta para uso sobre fotos/fundos escuros ou claros.

## Tipografia oficial

| Uso | Fonte oficial | Observação |
|---|---|---|
| Wordmark / títulos de destaque | **MadeType Dillan** (serifa arredondada, leve, com ajustes de kerning customizados) | Fonte paga — sem os arquivos no projeto. Substituída por **Fraunces** (Google Fonts) desde 2026-07-08 por decisão registrada em `05-decisoes.md`. |
| Textos corridos / web / digital | **Montserrat** (família com 37 estilos) | Gratuita — usada exatamente como especificado, via `next/font/google`. |
| Frases de destaque / script decorativo | **TR Freehand 575** | Fonte paga — sem os arquivos. Substituída por **Caveat** (Google Fonts) desde 2026-07-08. Uso é decorativo e esporádico (ex: frases de campanha), não para UI funcional. |

## Símbolo

Duas folhas/pétalas assimétricas, construídas geometricamente a partir de espirais da proporção áurea (φ ≈ 1,618). Aparece:
- Como acento sobre o "í" de "pralís" no wordmark
- Sozinho, como ícone/selo da marca (várias composições: par de folhas, "espiga" com 4-5 folhas, cruz de 4 folhas)
- Nas 3 cores da marca

Arquivo de referência: `Referencias design pralis/Design SVG/Design SVG/Simbolos 1 - Coloridos.svg` (e variantes 2 a 5).

## Padrão gráfico (pattern)

Um padrão repetido de "pétalas/círculos" (motivo floral geométrico de 4 pontas, baseado no mesmo símbolo da folha) usado como textura de fundo em aplicações reais — sacola de pão kraft, embalagens, cartão de visita. Aparece nas 3 cores da marca (dourado, laranja, marrom) e em baixo contraste (tom sobre tom) atrás de texto.

Arquivos: `pattern1.svg`, `pattern2.svg` na mesma pasta do SVG.

## Logo

- Wordmark: **"pralís"** sempre em minúsculas no logotipo principal (o "P" maiúsculo só aparece no texto pequeno "Padaria" acima, quando presente).
- Variante horizontal com "Padaria" pequeno acima de "pralís" grande — usada em aplicações institucionais (sacola, embalagem, cartão).
- Variante isolada "pralís" (sem "Padaria") — usada em contextos mais compactos (vitrine, caneca).
- Arquivo vetorial oficial (preto, para uso sobre fundo claro): `Referencias design pralis/Design SVG/Design SVG/logo-preta.svg`
- Arquivo vetorial oficial (branco, para uso sobre fundo escuro/foto): `logo-branca.svg`
- Versões raster coloridas (dourada, laranja) recebidas separadamente e copiadas para `public/brands/pralis/`.

## Aplicações reais observadas no manual (para referência de tom visual)

- Sacola de papel kraft com o wordmark marrom + padrão de pétalas sutil + endereços das duas lojas no rodapé
- Etiquetas/tags penduradas em produtos, laranja e marrom, com preço e nome do item
- Caneca marrom com wordmark laranja / caneca laranja com símbolo marrom
- Embalagem de pão em papel branco com pattern repetido + selo de cor sólida
- Avental marrom com wordmark laranja bordado/estampado no peito
- Cartão de visita branco/kraft com padrão de pétalas dourado no rodapé

## Regra de aplicação neste projeto

Interface web é **produto digital, não impresso** — a plataforma não precisa (nem deve) replicar padrões de embalagem física. A textura de pétalas/kraft é usada com muita moderação (hero do dashboard, fundos sutis), nunca como ruído visual que atrapalhe leitura de dados/tabelas.
