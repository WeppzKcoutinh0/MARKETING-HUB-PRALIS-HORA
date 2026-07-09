# Log de decisões

Ordem cronológica. Só registra decisões não óbvias — coisas que, se esquecidas, levariam a repetir um erro já corrigido ou reverter uma escolha intencional.

---

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
