# Marketing Hub — Pralís & Hora Mineira

Plataforma web de gestão de marketing para as marcas **Pralís** (padaria artesanal) e **Hora Mineira** (restaurante mineiro), com identidade visual própria e isolada para cada marca, dashboard, CRUD completo de tráfego pago, análise mensal, cronograma de postagens, parcerias, campanhas, calendário 2026, plano de ação (5W2H) e relatórios inteligentes.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (tema por marca via CSS variables — nada de estilos misturados)
- **Supabase** (Postgres + API) como banco de dados
- **Recharts** para os gráficos
- **lucide-react** para ícones
- Pronto para deploy na **Vercel**

## Estrutura de pastas

```
marketing-hub/
├── app/
│   ├── layout.tsx              # layout raiz (fontes das duas marcas)
│   ├── page.tsx                # redireciona para /pralis
│   └── [brand]/                # rotas dinâmicas: /pralis ou /hora
│       ├── layout.tsx          # aplica o tema da marca (CSS vars) + sidebar
│       ├── page.tsx            # Dashboard
│       ├── trafego-pago/
│       ├── analise-mensal/
│       ├── cronograma/
│       ├── parcerias/
│       ├── campanhas/
│       ├── calendario/
│       ├── plano-de-acao/
│       └── relatorios/
├── components/                 # Sidebar, Topbar, DataModule (motor de CRUD), Dashboard, Reports, Charts...
├── lib/
│   ├── brands.ts                # paleta de cores e tipografia de cada marca
│   ├── modules.ts                # configuração declarativa dos 7 módulos de dados
│   ├── calc.ts                   # cálculos automáticos (custo por seguidor, diagnóstico etc.)
│   ├── data.ts / supabase.ts     # acesso ao banco
│   └── format.ts                 # formatação de moeda (R$) e datas (pt-BR)
├── types/database.ts            # tipos TypeScript espelhando o schema SQL
├── sql/schema.sql               # script completo para criar as tabelas no Supabase
└── .env.example
```

### Como funciona o CRUD

Em vez de duplicar uma página por módulo por marca (o que geraria 16 páginas quase idênticas), a plataforma usa um **motor genérico** (`components/DataModule.tsx`) que lê a configuração declarativa de cada módulo (`lib/modules.ts` — campos, tipos, opções de status, quais colunas aparecem na tabela) e renderiza automaticamente: listagem com busca/filtro, formulário de criação/edição com validação, e exclusão com confirmação. Isso deixa o código enxuto e fácil de manter — para adicionar um campo novo em qualquer módulo, basta editar o array `fields` correspondente em `lib/modules.ts` e a coluna em `sql/schema.sql`.

## Rodando localmente

### 1. Pré-requisitos
- Node.js 18.18+ instalado
- Uma conta gratuita em [supabase.com](https://supabase.com)

### 2. Instalar dependências
```bash
npm install
```

### 3. Criar o banco de dados no Supabase
1. Crie um novo projeto em [supabase.com](https://supabase.com).
2. Abra **SQL Editor** no painel do Supabase.
3. Cole todo o conteúdo do arquivo `sql/schema.sql` e execute (`Run`).
   Isso cria as 8 tabelas, os índices, as policies de acesso e já insere as duas marcas (Pralís e Hora Mineira) e o calendário de datas comemorativas de 2026.

### 4. Configurar variáveis de ambiente
```bash
cp .env.example .env.local
```
Preencha com os dados do seu projeto (em **Project Settings → API** no Supabase):
```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

### 5. Rodar em modo desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:3000` — você será redirecionado para `/pralis`. Troque para a Hora Mineira pelo link "Ir para Hora Mineira" no rodapé do menu lateral, ou acesse `http://localhost:3000/hora` diretamente.

## Importando os dados das planilhas atuais

As planilhas `marketing Pralís 2026.xlsx` e `marketing hora 2026.xlsx` foram usadas como base para desenhar os campos de cada módulo (Tráfego Pago, Análise Mensal, Cronograma, Parcerias, Campanhas, Calendário e Plano de Ação). Para trazer os dados que já existem nas planilhas para o sistema:

1. Abra cada aba da planilha e, para cada linha preenchida, use o botão **"Novo registro"** no módulo correspondente da plataforma para cadastrá-la (o formulário tem os mesmos campos da planilha, mais os campos extras de marketing recomendados no briefing).
2. Como alternativa mais rápida para grandes volumes, é possível escrever um script simples de importação em Node.js usando `@supabase/supabase-js` e a biblioteca `xlsx`, lendo cada aba e inserindo via `supabase.from('tabela').insert([...])`. Isso não foi incluído por padrão para manter o pacote de entrega enxuto, mas a estrutura das tabelas em `sql/schema.sql` já está pronta para receber esses dados.

## Deploy na Vercel

1. Suba este projeto para um repositório no GitHub/GitLab/Bitbucket.
2. Em [vercel.com](https://vercel.com), clique em **New Project** e importe o repositório.
3. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Clique em **Deploy**. O Next.js é detectado automaticamente (build command `next build`, output padrão) — nenhuma configuração extra é necessária.
5. Depois do primeiro deploy, toda vez que você der `git push` na branch principal a Vercel publica uma nova versão automaticamente.

## Identidade visual

O tema de cada marca é isolado via variáveis CSS aplicadas em `app/[brand]/layout.tsx` — a Pralís nunca herda cor ou fonte da Hora Mineira e vice-versa. As paletas usadas seguem exatamente o briefing:

**Pralís** — dourado `#B8860B`, laranja `#F37435`, marrom `#5E3731`, fundo claro/off-white com leve textura de papel kraft, tipografia serifada (Playfair Display) nos títulos e Mulish no corpo do texto.

**Hora Mineira** — preto `#141414`, verde escuro `#354D1D`, verde médio `#688E42`, marrom `#29170D`/`#7C3916`, laranja queimado `#D0641D`, cinzas `#969997`/`#D6D6D6`, tipografia Poppins nos títulos e Be Vietnam Pro no corpo do texto (fonte "Be Vietnam" do manual, disponível no Google Fonts como "Be Vietnam Pro").

## Segurança e próximos passos recomendados

- O `sql/schema.sql` cria políticas de Row Level Security **permissivas** (liberado para a chave `anon`), pensadas para colocar o sistema no ar rapidamente para uso interno da equipe. Antes de usar com dados sensíveis em produção, recomenda-se:
  - Ativar o **Supabase Auth** (login por e-mail/senha ou magic link) para a equipe de marketing.
  - Trocar as policies de `using (true)` para checagens de `auth.uid()`/`auth.role()`.
- Como melhoria futura, os campos de upload de imagem (logo das marcas, artes de posts) podem usar o **Supabase Storage**.
