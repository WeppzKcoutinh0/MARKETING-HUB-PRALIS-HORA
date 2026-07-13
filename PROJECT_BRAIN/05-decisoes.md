# Log de decisões

Ordem cronológica. Só registra decisões não óbvias — coisas que, se esquecidas, levariam a repetir um erro já corrigido ou reverter uma escolha intencional.

---

### 2026-07-09 — Gráficos mensais do Dashboard: sempre os 12 meses do ano, com seletor de ano

**Contexto**: usuário reparou que o gráfico de "Visualizações e seguidores por mês" só ia até Março mesmo estando em Julho — o gráfico só desenhava os meses que tinham registro na tabela, em vez dos 12 meses do ano com zero nos que faltam. Ele também pediu suporte a múltiplos anos (buscar um ano específico e ver os meses vazios daquele ano).
**Causa raiz mais funda que o gráfico**: `monthly_analysis` nunca teve coluna de ano — só `month text` (`'JANEIRO'`), com `unique(brand_id, month)`. Ou seja, era **estruturalmente impossível** ter dois anos de dados pro mesmo mês; o app não tava pronto pra multi-ano de verdade, o gráfico incompleto era só o sintoma visível.
**Decisão**: adicionada coluna `year integer` em `monthly_analysis` (com migração pra bancos já existentes — ver `sql/schema.sql`), constraint virou `unique(brand_id, year, month)`. Dashboard ganhou um seletor de ano (`<select>` ao lado de "Visão geral") que filtra todos os cards e gráficos pro ano escolhido; a lista de anos disponíveis é calculada a partir dos dados reais + sempre inclui o ano atual. Os gráficos de linha/barra por mês agora sempre desenham os 12 meses (Jan-Dez) do ano selecionado, com 0 nos meses sem registro — usando `MONTHS.map(...)` em vez de `monthly.map(...)`.
**Efeito colateral bom**: como o gráfico agora sempre tem 12 pontos (nunca fica vazio por falta de meses), o estado "sem dados" dos gráficos (`components/Charts.tsx`) precisou mudar de "checar se a lista tá vazia" pra "checar se todos os valores são zero" — senão o empty-state (ícone de croissant) nunca mais apareceria mesmo com o ano inteiro zerado.
**Pendência pro usuário**: como só tenho a chave anon (não dá pra rodar `ALTER TABLE` via API REST do Supabase), **é necessário rodar o `sql/schema.sql` atualizado de novo no SQL Editor do Supabase** pra essa mudança funcionar — o arquivo é idempotente (seguro rodar em cima do banco já existente), só adiciona a coluna que falta.
**Nomenclatura**: `lib/format.ts` teve a constante `MONTHS_2026` renomeada pra `MONTHS` — ela é só uma lista de nomes de mês (Janeiro-Dezembro), não tinha nada de específico de 2026, e manter esse nome ficaria enganoso agora que o app suporta múltiplos anos de verdade.

### 2026-07-09 — `components/Charts.tsx` é compartilhado entre as duas marcas: cuidado ao decorar

**Contexto**: ao dar identidade Pralís pros gráficos vazios (sem dados ainda), quase deixei o ícone de croissant fixo dentro de `Charts.tsx` — mas esse arquivo é usado tanto pelo `Dashboard.tsx` quanto pelo `Reports.tsx` **das duas marcas**. Um ícone fixo ali vazaria pra Hora Mineira.
**Decisão**: `TrendLineChart`, `ComparisonBarChart` e `SimplePieChart` agora aceitam um prop opcional `emptyIcon?: LucideIcon` (default neutro `BarChart3`), usado só quando não há dados. Quem decide qual ícone usar é o componente que CHAMA o gráfico (`Dashboard.tsx`/`Reports.tsx`), passando `emptyIcon={isPralis ? Croissant : undefined}`.
**Regra derivada**: qualquer componente em `components/` que não recebe `brand` como prop (como `Charts.tsx`, `Badge.tsx`) **não deve ter nada hardcoded de uma marca específica** — cores, ícones, textos. Se precisar de algo assim, adicione um prop opcional e deixe quem chama decidir.

### 2026-07-09 — Grade de indicadores do Dashboard: matemática de colunas tem que fechar

**Contexto**: o card líder (`StatCard highlight`) ocupa 2 colunas (`sm:col-span-2`) numa grade `lg:grid-cols-4`. Com 12 cards no total (1 líder + 11 normais), o total de "slots" ocupados é 2 + 11 = 13 — não é múltiplo de 4, então sobrava 1 card sozinho na última linha com 3 colunas vazias do lado. Usuário reportou como "feio"/desorganizado.
**Decisão**: reorganizado em grupos fechados de propósito — linha 1 = líder(2) + 2 cards de destaque(1+1) = 4; linhas 2 e 3 = 4 cards normais cada; linha final = 1 card `wide` (`sm:col-span-2 lg:col-span-4`, layout horizontal) pro último indicador, em vez de deixá-lo do tamanho normal sobrando sozinho. Total continua sendo os mesmos 12 indicadores, nenhum dado foi removido.
**Regra derivada**: **sempre que adicionar ou remover um `StatCard` dessa grade, recalcular a soma de colunas ocupadas e garantir que seja múltiplo de 4** (contando o líder como 2). Se não fechar, usar o `wide` do último card como card de fechamento, não deixar sobra.
**Também nessa passada**: cards normais passaram de `bg-brand-surface` (branco puro, "frio") para `bg-brand-surface2` (creme, mais quente) e ganharam variação de cor no selo do ícone (`tone: 'primary' | 'secondary' | 'accent'`, alternando) — antes todos os ícones eram dourados, ficava monótono.
**Regra reaplicada em 2026-07-11**: na revisão de responsividade, achei o mesmo problema em 4 grades novas — as StatCard grids dos relatórios por tipo (`Reports.tsx` → `SeguidoresReport`, `VisualizacoesReport`, `InvestimentoReport`, `CampanhasReport`), cada uma com 1 líder(2) + 3 normais(1+1+1) = 5 "slots" numa grade de 4 colunas, sobrando 1 card órfão tanto no mobile (`grid-cols-2`) quanto no desktop (`lg:grid-cols-4`). Corrigido do mesmo jeito: o último card de cada uma virou `wide`. **Essa regra vale pra qualquer grade nova de `StatCard` no projeto, não só o Dashboard** — checar a matemática (líder=2, normal=1, total múltiplo de 4) toda vez.

### 2026-07-09 — Ícones reais de padaria como fundo decorativo (componente `BakeryPattern`)

**Contexto**: depois do primeiro passe de redesign (hierarquia, selo-folha discreto), o usuário achou "muito clean" e pediu algo mais impactante, com ícones de fundo, mais cara de padaria.
**Decisão**: criado `components/BakeryPattern.tsx` — espalha ícones reais do lucide-react (`Wheat`, `Croissant`, `Cookie`, `ChefHat`, `Coffee`, `CakeSlice`) em posições/rotações/opacidades variadas, absolutamente posicionados atrás do conteúdo. Usado nos heros do Dashboard e Relatórios, versão reduzida no cabeçalho do Sidebar, e ícones soltos (sem o componente, por causa do próximo ponto) nos cards da página inicial.
**Detalhe técnico importante**: `BakeryPattern` usa `var(--brand-primary)` etc. — essas CSS vars só existem dentro do wrapper de tema em `app/[brand]/layout.tsx`. A página inicial (`app/page.tsx`) fica **fora** desse wrapper, então lá os ícones foram inseridos diretamente com `brand.colors.primary` (valor JS/hex), não via `BakeryPattern`. Se um dia quiser usar `BakeryPattern` fora de uma rota `/pralis` ou `/hora`, ele não vai pegar cor nenhuma — precisa adaptar.
**Regra derivada**: esse é o padrão de "muita presença, mas com moderação" — ícones em heros/cards de destaque, nunca em tabelas ou áreas densas de dados (atrapalharia leitura). Só aplicado condicionalmente a `brand.slug === 'pralis'`; Hora Mineira não ganhou nada disso.

### 2026-07-09 — "Design premium" aplicado no motor genérico, não em telas individuais

**Contexto**: usuário achou o Dashboard e as 7 abas de módulo (Tráfego Pago, Cronograma, etc.) genéricas demais, "sem cara da Pralís", pediu redesign criativo de cada aba.
**Decisão**: como as 7 abas são todas renderizadas por `components/DataModule.tsx` (o motor genérico — ver `04-arquitetura.md`), o redesign foi feito **no motor**, não em 7 telas separadas. Isso respeita a arquitetura declarativa do projeto e propaga a melhoria pra todos os módulos de uma vez.
**O que mudou** (`DataModule.tsx`, `StatCard.tsx`, `Dashboard.tsx`, `Reports.tsx`):
- Hierarquia real nos cards de indicador do Dashboard: um "card líder" (2x mais largo, número gigante) em vez de 12 blocos idênticos — seguindo a metodologia da skill `premium-ui-design` (squint test: um elemento deve vencer visualmente, não vários competindo).
- Selo-folha da marca (o mesmo símbolo usado na página inicial) repetido com moderação como assinatura visual: marca d'água no card líder, bullet nos rótulos de seção, no estado vazio das tabelas — sempre condicionado a `brandSlug === 'pralis'`.
- Ícone do módulo (já vinha de `moduleConfig.icon`, resolvido dinamicamente via `lucide-react`) agora aparece num badge circular no cabeçalho de cada aba — dá identidade por módulo sem hardcode nenhum, só usando o que já existia na config.
- Linha de gradiente dourado→laranja no topo dos cards de gráfico e das tabelas — detalhe de assinatura repetido em vários lugares pra amarrar a identidade visual.
- Hero do Relatórios ganhou o mesmo tratamento do Dashboard (fundo com textura de pétalas + gradiente).
**Nota sobre a skill usada**: `premium-ui-design` tem um exemplo interno de referência com paleta roxa/escura de SaaS genérico — **isso não se aplica à Pralís**, só a metodologia (conceito antes de codar, hierarquia via squint test, escala tipográfica real, um detalhe de assinatura repetido com moderação) foi usada. As cores/tokens continuam sendo os da Pralís (`02-identidade-pralis.md`).
**A Hora Mineira** herdou só as melhorias estruturais genéricas (hierarquia do card líder, linha de gradiente nas tabelas/gráficos) — nenhum toque decorativo específico (selo-folha, script) foi aplicado a ela.

### 2026-07-07 — Modal não usa `flex items-center` para centralizar

**Contexto**: usuário reportou formulários "comidos"/cortados no topo do modal (campos aparecendo acima do cabeçalho "Novo registro").
**Causa raiz**: `flex items-center` + `overflow-y-auto` no wrapper do modal corta o topo do conteúdo quando ele é mais alto que a viewport — bug clássico de CSS, não falta de espaço.
**Decisão**: trocado para layout baseado em padding (`md:py-10`), sem centralização flex. Ver `04-arquitetura.md`.

---

### 2026-07-07 — Formulários agrupados por seção

**Contexto**: formulários de cadastro (Tráfego Pago, Cronograma, etc.) pareciam "uma parede de campos soltos", sem hierarquia.
**Decisão**: adicionado campo opcional `section?: string` em `FieldConfig` (`lib/modules.ts`). Todos os 7 módulos foram reorganizados em 3-5 seções lógicas cada (ex: Tráfego Pago → "Sobre o conteúdo" / "Alcance" / "Investimento" / "Custos calculados" / "Acompanhamento"). `RecordForm.tsx` agrupa e renderiza com título de seção + divisória.
**Por quê isso e não outra coisa**: mantém o motor 100% declarativo — nenhum componente novo, nenhuma lógica hardcoded por módulo, só configuração.

---

### 2026-07-08 — Hora Mineira: claro → escuro → escuro de novo

**Contexto**: usuário achou o tema escuro original da Hora "muito escuro" e pediu tema claro completo (mesma estrutura visual da Pralís, cores da Hora). Foi implementado. Depois, ao ver o resultado lado a lado com a Pralís, o usuário achou que "está muito parecido com a padaria, são restaurantes diferentes".
**Causa raiz**: duas marcas com fundo claro e tom quente inevitavelmente se parecem, independente da paleta específica de cada uma — a diferenciação mais forte vem do contraste claro/escuro, não só da cor.
**Decisão final**: revertido para tema escuro, agora usando a paleta oficial exata do manual da marca (9 cores documentadas — ver `03-identidade-hora.md`), que o usuário enviou depois desse vai-e-volta. Adicionada uma textura de linhas diagonais cruzadas (`texture-hora` em `globals.css`) como elemento de assinatura visual, inspirada no padrão hexagonal usado no próprio manual de marca.
**Regra derivada**: não propor tema claro pra Hora de novo sem pedido explícito — já foi tentado e revertido.

---

### 2026-07-08 — Pralís: fontes MadeType Dillan e TR Freehand substituídas

**Contexto**: manual oficial da Pralís especifica MadeType Dillan (serifa arredondada, wordmark/títulos) e TR Freehand 575 (script, frases de campanha) — ambas pagas, sem arquivos disponíveis no projeto ou na máquina do usuário.
**Decisão**: usar alternativas gratuitas do Google Fonts com visual próximo — **Fraunces** no lugar de Dillan, **Caveat** no lugar de TR Freehand. Montserrat (a terceira fonte oficial, para texto corrido/web) é gratuita e usada exatamente como especificada.
**Se algum dia a Pralís comprar/ceder os arquivos originais**: trocar de `next/font/google` para `next/font/local` com `@font-face`, sem mudar mais nada na estrutura (`fontHeading`/`fontAccent` em `lib/brands.ts` continuam sendo o único lugar que referencia a fonte).

---

### 2026-07-08 — Cores da Pralís confirmadas, sem alteração

**Contexto**: ao revisar o manual oficial da Pralís, as 3 cores já configuradas em `lib/brands.ts` desde o início do projeto (`#B8860B`, `#F37435`, `#5E3731`) bateram exatamente com o manual (incluindo Pantone/CMYK). Nenhuma mudança de cor foi necessária no redesign — só tipografia, logo real, tagline oficial e uso do padrão/símbolo da marca.

---

### 2026-07-09 — Redesign completo da Pralís concluído

**Contexto**: usuário pediu redesign total da tela da Pralís porque a identidade visual não estava seguindo o padrão oficial da marca (usava Playfair Display + Mulish, um wordmark placeholder desenhado à mão, tagline inventada, sem o símbolo real). Material de referência: manual institucional completo (25 páginas) + pacote de SVGs oficiais, ambos fornecidos pelo usuário.
**O que mudou**:
- Tipografia: `Fraunces` (títulos, no lugar de Playfair Display) + `Montserrat` (corpo, no lugar de Mulish, essa já era a fonte oficial) + `Caveat` novo (`fontAccent`, script decorativo — usado na tagline do hero do Dashboard).
- Tagline trocada de texto inventado para a promessa oficial: "é provar e ser feliz".
- Ícone da marca (`public/brands/pralis/icon.svg`) trocado do círculo com trigo desenhado à mão para a "espiga dourada" vetorial real, extraída do pacote de símbolos oficiais.
- Logo vetorial oficial (preto e branco) adicionados em `public/brands/pralis/logo-preta.svg` / `logo-branca.svg`, disponíveis para uso futuro (o logo principal em uso continua sendo o raster laranja `logo-oficial.png`, por preferência explícita do usuário).
- Nova textura `.texture-petals` (`app/globals.css`) — padrão de 4 pétalas construído em SVG leve inline, inspirado no padrão real da marca (visto em embalagens/sacolas no manual), aplicado no hero do Dashboard no lugar do dot-texture genérico anterior.
- Cores: **inalteradas**, já estavam certas (ver decisão de 2026-07-08 acima).
- Hora Mineira: **não foi tocada** neste redesign, por pedido explícito do usuário.
**Verificação**: `npx tsc --noEmit` limpo e `npm run build` gerando as 22 rotas sem erro, ambos confirmados após a mudança.

---

### 2026-07-09 — Nunca rodar `npm run build` com `npm run dev` ligado ao mesmo tempo

**Contexto**: depois de rodar `npm run build` (produção) para verificar o build enquanto o `npm run dev` (desenvolvimento) ainda estava rodando em background, o servidor de dev quebrou com `Error: Cannot find module './vendor-chunks/next.js'`.
**Causa raiz**: `next build` e `next dev` escrevem na mesma pasta `.next/` com formatos de manifest incompatíveis entre si — rodar os dois ao mesmo tempo corrompe o cache do dev server.
**Correção**: parar o processo do `npm run dev`, apagar a pasta `.next/` inteira (`rm -rf .next`), rodar `npm run dev` de novo do zero.
**Regra derivada**: se precisar verificar `npm run build` com o dev server já rodando, ou parar o dev server antes, ou aceitar que vai precisar reiniciar o dev server (com `.next` limpo) depois.

---

### 2026-07-10 — Login único e fixo (não é Supabase Auth)

**Contexto**: usuário pediu uma tela de login onde só um usuário/senha específicos (fornecidos por ele) conseguem entrar — nada de cadastro, nada de múltiplos usuários.
**Decisão**: em vez de configurar Supabase Auth (que seria overkill pra "um usuário só, fixo"), implementei um gate simples com `middleware.ts` na raiz do projeto:
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` / `SESSION_SECRET` ficam em `.env.local`, **sem prefixo `NEXT_PUBLIC_`** — isso é o que garante que nunca vazam pro bundle do navegador (só existem em código que roda no servidor: middleware, API routes).
- `POST /api/login` compara usuário/senha recebidos contra as env vars; se bater, seta um cookie `hub_session` (`httpOnly`, `secure` em produção, `sameSite: lax`, 7 dias) com o valor de `SESSION_SECRET`.
- `middleware.ts` intercepta **toda** rota (exceto `/login`, `/api/login`, `/api/logout` e assets estáticos) e redireciona pra `/login?from=<rota>` se o cookie não bater com `SESSION_SECRET`.
- `POST /api/logout` zera o cookie. Botão de "Sair" existe em 3 lugares: `Sidebar` (desktop), `Topbar` (menu mobile) e `LogoutLink` (usado só na landing `/`, que não tem Sidebar/Topbar).
**Trade-off consciente (documentar pra não "descobrir" depois como bug)**: isso é uma checagem de segredo compartilhado num cookie, não um sistema de sessão de verdade — não tem expiração por inatividade, não tem hash de senha (a senha fica em texto puro no `.env.local`, comparação é `===` direto), não dá pra ter mais de um usuário nem revogar sessão de outro dispositivo sem trocar `SESSION_SECRET` (o que derruba todo mundo de uma vez). Isso é intencional e proporcional ao pedido ("só um usuário, ponto"), mas **se um dia precisar de múltiplos usuários, senha com hash, ou expiração real, migrar pra Supabase Auth** — não tentar remendar esse esquema.
**Pra trocar a senha/usuário**: editar `ADMIN_USERNAME`/`ADMIN_PASSWORD` em `.env.local` (e nas env vars da Vercel, se já tiver deployado) e reiniciar o servidor — não precisa mexer em código.
**Pendência de deploy**: ao publicar na Vercel, as 3 env vars (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`) precisam ser cadastradas lá também (Project Settings → Environment Variables), do mesmo jeito que `NEXT_PUBLIC_SUPABASE_*` já precisa ser. Ver `06-deploy.md`.

---

### 2026-07-11 — Auditoria de responsividade (mobile/tablet/notebook)

**Contexto**: usuário pediu pra revisar a plataforma inteira em todos os tamanhos de tela, nas duas marcas. Como a maior parte do app já foi construída com breakpoints Tailwind desde o início (`md:`/`lg:`/`sm:` já espalhados por Sidebar, Topbar, Dashboard, Modal, RecordForm), essa passada foi uma revisão de código componente por componente (não dá pra abrir DevTools/redimensionar navegador de verdade daqui), procurando especificamente por: grades que não fecham matematicamente, linhas de botões sem `flex-wrap` que podem estourar em telas pequenas, e falta de rede de segurança contra rolagem horizontal.
**Achados e correções**:
1. **Grade órfã em `Reports.tsx`** — as 4 telas de relatório por tipo tinham a mesma grade `grid-cols-2 lg:grid-cols-4` com 1 card líder + 3 normais (5 "unidades" numa grade de 4), sobrando card sozinho tanto no mobile quanto no desktop. Corrigido igual ao Dashboard: último card virou `wide`. Ver entrada de 2026-07-09 acima.
2. **Barra de ferramentas dos relatórios** (botão atualizar + seletor de ano + exportar PDF) — trocado `shrink-0` por `flex-wrap` no container, pra empilhar em vez de espremer em telas muito estreitas (~320px).
3. **Rede de segurança global** — `overflow-x: hidden` + `max-width: 100vw` em `html, body` (`globals.css`) — protege contra qualquer elemento decorativo posicionado (marca d'água, blur) que eventualmente escape do próprio container e crie scroll horizontal indesejado. Não afeta as áreas que já tem scroll horizontal intencional (tabelas com `overflow-x-auto` continuam rolando normalmente, é um container filho independente).
4. **Tela de login** — padding reduzido em telas pequenas (`px-6`→`px-4 sm:px-6`, `p-8`→`p-6 sm:p-8`) pra sobrar mais espaço de conteúdo em aparelhos de 320-360px de largura.
**O que já estava bem resolvido e não precisou mexer**: Sidebar/Topbar (troca pra menu mobile em `md`, já testado no fluxo de login), Modal (altura cheia no mobile, sem `items-center` — regra de 2026-07-07), RecordForm (`grid-cols-1 sm:grid-cols-2`), tabelas do `DataModule` (`overflow-x-auto` já presente), gráficos (Recharts `ResponsiveContainer` já é fluido por natureza).
**Limitação desta auditoria**: verificação por leitura de código + `tsc`/`curl`, não por teste visual real em dispositivo/DevTools — pedir pro usuário testar em pelo menos um celular de verdade e avisar se algo ainda ficar apertado.
