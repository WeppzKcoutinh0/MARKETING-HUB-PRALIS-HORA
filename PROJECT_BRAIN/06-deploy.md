# Deploy — Vercel + Supabase

## Supabase (banco de dados)

- **Status**: projeto real já criado e conectado (não é mais placeholder).
- Schema completo (`sql/schema.sql`) já rodado no SQL Editor do painel Supabase — 8 tabelas, RLS, seed das 2 marcas + calendário 2026.
- `.env.local` (local, nunca commitado — está no `.gitignore`) tem `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` reais.
- RLS é **permissivo** hoje (`using (true)` para a chave anon) — funcional para uso interno da equipe, mas **não é seguro para dados sensíveis em produção pública**. Antes de divulgar a URL amplamente: ativar Supabase Auth e trocar as policies para checar `auth.uid()`/`auth.role()`.

## Vercel (frontend)

**Ainda não deployado.** Passos para o primeiro deploy:

1. **O projeto ainda não é um repositório Git** (confirmado em 2026-07-08 — não existe pasta `.git`). Precisa rodar `git init`, criar o primeiro commit, criar um repositório no GitHub e dar push antes de conseguir importar na Vercel.
2. Em vercel.com → New Project → importar o repositório.
3. **Root Directory**: apontar para `marketing-hub/` (o código Next.js não está na raiz do repositório de trabalho, está um nível abaixo).
4. Environment Variables (Production + Preview + Development):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Build command / output: detecção automática do Next.js (`next build`), nenhuma configuração extra necessária.
6. Deploy. Depois do primeiro deploy, todo `git push` na branch principal publica automaticamente.

## Checklist pré-deploy

- [ ] Repositório Git criado e código commitado (**pendente** — confirmado em 2026-07-08 que o projeto ainda não tem `.git`)
- [ ] `npm run build` local passa sem erro (rodar antes de subir, já que o build tenta baixar fontes do Google Fonts — precisa de internet disponível)
- [ ] `npx tsc --noEmit` limpo
- [ ] Variáveis de ambiente cadastradas na Vercel (as mesmas do `.env.local`)
- [ ] Decidir se RLS permissivo é aceitável para o lançamento inicial ou se autenticação precisa entrar antes (ver nota de segurança acima)
- [ ] Confirmar domínio (usar o `*.vercel.app` gerado automaticamente, ou domínio próprio?)

## Notas de ambiente Windows/OneDrive (relevante para builds locais antes do deploy)

O projeto vive dentro do OneDrive, que pode travar arquivos do `node_modules` durante `npm install`/build (erros `ENOTEMPTY`/`EPERM`). Se o build local falhar de forma inconsistente por esse motivo: pausar sync do OneDrive temporariamente, ou considerar mover o projeto pra fora da pasta sincronizada antes do primeiro deploy real (decisão ainda em aberto com o usuário — ver `07-proximos-passos.md`).
