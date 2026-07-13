# Arquitetura técnica

## Sistema de temas por marca

`lib/brands.ts` exporta `BRANDS: Record<'pralis' | 'hora', BrandTheme>`. Cada `BrandTheme` tem: `slug`, `name`, `fullName`, `tagline`, `logo`, `icon`, `personality[]`, `colors{...}`, `fontHeading`, `fontBody`, `fontAccent` (script/decorativo), `radius`, `chartPalette[]`.

`app/[brand]/layout.tsx` lê `params.brand`, chama `getBrand(slug)`, e aplica **todas as cores como CSS custom properties inline** no elemento raiz da página (`--brand-primary`, `--brand-bg`, etc.) mais `--font-heading`/`--font-body`/`--font-accent` apontando para as variáveis de fonte carregadas em `app/layout.tsx`. O Tailwind config (`tailwind.config.ts`) mapeia classes como `bg-brand-primary`, `text-brand-textMuted` para essas CSS vars — é assim que a mesma classe Tailwind resolve para cores diferentes dependendo da marca ativa, sem duplicar CSS.

**Nunca hardcode uma cor de marca fora de `lib/brands.ts`** (exceto cores fixas de status nos badges em `lib/modules.ts`, que são independentes de marca/tema).

## Fontes

Todas as fontes das duas marcas são carregadas de uma vez em `app/layout.tsx` (raiz), cada uma com sua própria `variable` CSS, e disponibilizadas globalmente via `className` no elemento `<html>`. `app/[brand]/layout.tsx` decide qual `--font-*` var usar baseado na marca ativa. Isso evita re-carregar fontes ao trocar de marca (troca é só de qual variável é referenciada).

## Motor genérico de CRUD (`components/DataModule.tsx`)

Fluxo:
1. Recebe `brandSlug` + `moduleConfig` (de `lib/modules.ts`) como props.
2. Busca `brand_id` via `getBrandId(brandSlug)` (lib/data.ts), depois busca todas as linhas da tabela (`moduleConfig.table`) filtradas por esse `brand_id`, direto via `getSupabaseClient()`.
3. Renderiza tabela com só as colunas marcadas `showInTable: true` em cada `FieldConfig`.
4. Busca/filtro client-side por `searchableKeys` + filtro de `status` (se o módulo tiver campo `status`).
5. Criar/editar abre `Modal` com `RecordForm`, que renderiza um input por `FieldConfig`, agrupado visualmente por `section` (campo opcional em `FieldConfig`, adicionado em 2026-07-07 para organizar formulários longos em blocos com título, em vez de uma lista corrida de campos).
6. Campos com `computed: true` (ex: custo por seguidor no Tráfego Pago) são calculados em `lib/calc.ts` e nunca editáveis diretamente — aparecem com estilo visual diferenciado (borda tracejada, ícone, itálico) para não confundir com campos normais.
7. Salvar faz `insert`/`update` direto no Supabase; excluir pede confirmação num segundo `Modal`.

**Para adicionar um módulo novo**: 1) tipo em `types/database.ts`, 2) tabela em `sql/schema.sql`, 3) `ModuleConfig` em `lib/modules.ts`, 4) pasta de rota `app/[brand]/nome-do-modulo/page.tsx` com wrapper de 5 linhas chamando `<DataModule>`. Não criar componente novo.

## Modal — cuidado com centralização + overflow

`components/Modal.tsx` **não usa `flex items-center` para centralizar verticalmente** o conteúdo. Isso foi tentado e causou um bug real em produção (2026-07-07): quando o formulário é mais alto que a viewport, `flex items-center` com `overflow-y-auto` corta o topo do conteúdo e não permite rolar até vê-lo — bug conhecido de CSS (flexbox centraliza conteúdo maior que o container cortando os dois lados igualmente, sem criar espaço de rolagem acima). A correção usa padding (`md:py-10`) em vez de centralização flex. **Não reintroduzir `items-center` no wrapper do modal.**

## Schema do banco (`sql/schema.sql`)

8 tabelas: `brands`, `paid_traffic`, `monthly_analysis`, `posting_schedule`, `partnerships`, `campaigns`, `marketing_calendar`, `action_plan`. Todas com `brand_id uuid references brands(id)`. RLS ativado mas **permissivo** (`using (true)`) — qualquer um com a chave anon lê/escreve tudo. Trigger genérico mantém `updated_at`. Seed inicial cria as 2 marcas + calendário de datas comemorativas de 2026 (replicado para ambas).

### Multi-ano (`monthly_analysis.year`)

Adicionado em 2026-07-09. A tabela `monthly_analysis` só tinha `month text` (ex: `'JANEIRO'`), sem ano — o que tornava **impossível** guardar dois anos diferentes do mesmo mês (constraint antiga era `unique(brand_id, month)`). Agora tem `year integer` e a constraint virou `unique(brand_id, year, month)`. `lib/modules.ts` gera `YEAR_OPTIONS` dinamicamente (ano atual -2 até +3) — nunca hardcoded num ano fixo. `lib/format.ts` também teve `MONTHS_2026` renomeado pra `MONTHS` (a lista de nomes de mês não tem nada a ver com ano nenhum, só o campo `year` controla isso). O Dashboard (`components/Dashboard.tsx`) tem um seletor de ano que filtra tudo (cards + gráficos) e sempre mostra os 12 meses do ano selecionado, preenchendo com zero os meses sem registro — nunca "para" no último mês com dado. Ver `05-decisoes.md`.

**`paid_traffic` não precisou dessa mudança** — já tinha `date` (com ano completo), o campo `month` texto ali é só um atalho de exibição/filtro, o ano de verdade sempre vem de `date`.

Se mudar uma coluna: atualizar **nessa ordem** — `sql/schema.sql` → `types/database.ts` → `lib/modules.ts` (se afetar um campo do formulário) — e rodar o SQL de novo manualmente no painel do Supabase (não há migration automática).

## Conexão Supabase

`.env.local` tem `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`. A chave usada é do **formato novo** do Supabase (`sb_publishable_...`), não o JWT antigo — funciona normalmente com `@supabase/supabase-js@2.110+` já instalado, sem nenhuma configuração extra.

## Relatórios (`components/Reports.tsx`)

Reescrito em 2026-07-10 pra ter filtro por tipo de relatório + exportação em PDF (pedido do usuário nas duas marcas).

- **Filtro por tipo**: 5 pills no topo (`Geral`, `Seguidores`, `Visualizações`, `Investimento`, `Campanhas`) trocam qual sub-componente é renderizado (`GeralReport`, `SeguidoresReport`, etc.) — cada um busca nos mesmos dados já carregados (sem novo round-trip ao Supabase), só filtra/agrega diferente. Tem também seletor de ano (mesmo padrão do Dashboard: `monthly_analysis.year`, sempre 12 meses zero-preenchidos no gráfico).
- **"Sempre atualizado"**: os dados são buscados direto do Supabase a cada `useEffect` (troca de marca) e há um botão de refresh manual (`RefreshCw`) — não tem cache/staleness pra se preocupar, é sempre a query mais recente. O timestamp "Atualizado em" aparece no topo do relatório.
- **Exportar PDF**: botão usa `html2canvas` + `jspdf` (novas dependências, `npm install jspdf html2canvas`), ambos importados dinamicamente (`await import(...)`) dentro do handler de clique pra não engordar o bundle inicial. Fluxo: tira um "screenshot" em canvas da `<div ref={reportRef}>` (só o conteúdo do relatório — a barra de filtros/botões fica fora, não aparece no PDF), fatia em páginas A4 se for mais alto que uma página, e baixa como `relatorio-{marca}-{tipo}-{ano}.pdf`.
  - **`foreignObjectRendering: true` foi REMOVIDO em 2026-07-11 — não reintroduzir.** A ideia inicial era usar essa opção pra suportar cores com opacidade via classe Tailwind (`bg-brand-primary/12`, que no Tailwind 3.4 compila pra `color-mix()`), mas ela tem um bug conhecido: captura com base na **posição de rolagem atual da página** em vez do elemento inteiro. Usuário testou e o PDF saiu com só um pedaço do relatório (o trecho que estava visível na tela no momento do clique) seguido de uma área em branco enorme no lugar do resto. Corrigido voltando pro modo padrão do html2canvas (que percorre a árvore DOM e captura a `scrollHeight` real do elemento, independente de rolagem) + `window.scrollTo(0,0)` antes de capturar, por segurança. **Trade-off aceito**: os selos de ícone dos `StatCard` (`bg-brand-primary/12` etc.) podem sair com o fundo levemente diferente/mais transparente no PDF do que na tela — é cosmético e menor, bem melhor que o relatório sair cortado.
  - Testado depois da correção: usuário confirmou que o PDF anterior saía quebrado; a correção ainda não recebeu uma segunda confirmação visual — pedir pra exportar de novo (das duas marcas, pelo menos um relatório de cada tipo) e conferir se saiu completo agora.
- **Bug corrigido de paisagem**: o comparativo "Pralís x Hora Mineira" no relatório Geral usava os dados de tráfego pago da **própria marca** pros dois lados do gráfico (nunca buscava o tráfego da outra marca). Agora busca `paid_traffic` da outra marca também (`otherTraffic`), com filtro de ano igual ao resto.
