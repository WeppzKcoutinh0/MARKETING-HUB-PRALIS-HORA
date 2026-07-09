# Visão geral do projeto

## O que é

Plataforma web de gestão de marketing para duas marcas — um restaurante e uma padaria — que compartilham a mesma plataforma mas têm identidade visual e conteúdo totalmente separados:

- **Pralís** — padaria artesanal, com duas lojas físicas em Juiz de Fora (Pralís Catedral, Av. Rio Branco 2580; Pralís Halfeld, Av. Rio Branco 2173). Instagram: `@padariapralis`.
- **Hora Mineira** — restaurante & botequim mineiro, também em Juiz de Fora.

A plataforma substitui duas planilhas Excel (`marketing Pralís 2026.xlsx` e `marketing hora 2026.xlsx`) usadas pela equipe de marketing, digitalizando 7 áreas de trabalho: Tráfego Pago, Análise Mensal, Cronograma de Postagens, Parcerias, Campanhas, Calendário 2026 e Plano de Ação (5W2H). Também tem um Dashboard com indicadores/gráficos e uma página de Relatórios com diagnóstico automático e comparativo entre as duas marcas.

## Stack técnica

- **Next.js 14** (App Router) + **TypeScript** + React 18
- **Tailwind CSS** — tema de cada marca aplicado via CSS custom properties (não classes Tailwind fixas), para nunca misturar as duas identidades
- **Supabase** (Postgres) como banco, acessado direto do client via `@supabase/supabase-js` (sem camada de API própria)
- **Recharts** para gráficos, **lucide-react** para ícones
- Deploy alvo: **Vercel** (frontend) + **Supabase** (banco)

## Estrutura de pastas

O código do app fica em `marketing-hub/` (um nível abaixo da raiz do repositório de trabalho, que também contém pastas de referência de design como `Referencias design pralis/`).

```
marketing-hub/
├── PROJECT_BRAIN/          # esta documentação
├── app/
│   ├── layout.tsx           # layout raiz — carrega TODAS as fontes das duas marcas
│   ├── page.tsx              # redireciona para /pralis
│   └── [brand]/               # rotas dinâmicas: /pralis ou /hora
│       ├── layout.tsx          # aplica o tema da marca via CSS vars + sidebar/topbar
│       ├── page.tsx             # Dashboard
│       ├── trafego-pago/ analise-mensal/ cronograma/ parcerias/
│       │   campanhas/ calendario/ plano-de-acao/   # 7 módulos, wrapper de 5 linhas cada
│       └── relatorios/
├── components/              # Sidebar, Topbar, DataModule (motor de CRUD), RecordForm,
│                              Modal, Badge, StatCard, Dashboard, Reports, Charts
├── lib/
│   ├── brands.ts              # fonte única de verdade da identidade visual das 2 marcas
│   ├── modules.ts              # config declarativa dos 7 módulos de dados
│   ├── calc.ts                  # cálculos automáticos (custo por seguidor, diagnóstico)
│   ├── data.ts / supabase.ts     # acesso ao banco
│   └── format.ts                  # formatação de moeda (R$) e datas (pt-BR)
├── types/database.ts        # tipos TS espelhando o schema SQL
├── sql/schema.sql            # script completo do banco Supabase
└── public/brands/
    ├── pralis/                 # logo oficial, ícone, símbolos, patterns
    └── hora/                    # logo oficial, ícone
```

## Como funciona o CRUD (motor genérico)

Em vez de duplicar uma página por módulo por marca (16 páginas quase idênticas), a plataforma usa `components/DataModule.tsx` — um motor genérico que lê a configuração declarativa de cada módulo (`lib/modules.ts`: campos, tipos, opções de status coloridas, seções de agrupamento visual, quais colunas aparecem na tabela) e renderiza automaticamente: listagem com busca/filtro, formulário de criação/edição com validação, exclusão com confirmação.

**Para adicionar um campo novo em qualquer módulo**: edite o array `fields` correspondente em `lib/modules.ts`. O resto do sistema se adapta sozinho. Veja `04-arquitetura.md` para detalhes.

## Como rodar localmente

```bash
cd marketing-hub
npm install
cp .env.example .env.local   # preencher com URL + anon key do Supabase
npm run dev
```

Acesse `http://localhost:3000` — redireciona para `/pralis`. Troque para `/hora` pelo link no rodapé do menu lateral.

**Nota de ambiente (Windows + OneDrive)**: o projeto vive dentro de uma pasta sincronizada pelo OneDrive, o que pode causar erros `ENOTEMPTY`/`EPERM` durante `npm install` (o OneDrive trava arquivos do `node_modules` enquanto o npm escreve). Se isso acontecer: feche o OneDrive temporariamente (bandeja do sistema → Pausar sincronização) antes de instalar pacotes, ou mate processos `node.exe` travados antes de tentar de novo.

## Estado da infraestrutura (em 2026-07-08)

- ✅ Projeto Supabase real criado e conectado (`.env.local` preenchido com URL + chave `sb_publishable_...`, formato novo de API key do Supabase)
- ✅ `sql/schema.sql` já rodado no projeto Supabase — as 8 tabelas, RLS permissivo, seed das 2 marcas e calendário 2026 já existem no banco
- ❌ Deploy na Vercel ainda não feito
- ❌ Sem autenticação — RLS permissivo (`using (true)`), pensado para uso interno rápido da equipe
- ❌ Sem importação automática das planilhas antigas — os 6 módulos (exceto calendário) começam vazios
