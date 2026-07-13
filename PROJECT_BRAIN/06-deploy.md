# Deploy — Vercel + Supabase

## Supabase (banco de dados)

- **Status**: projeto real já criado e conectado (não é mais placeholder).
- Schema completo (`sql/schema.sql`) já rodado no SQL Editor do painel Supabase — 8 tabelas, RLS, seed das 2 marcas + calendário 2026.
- `.env.local` (local, nunca commitado — está no `.gitignore`) tem `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` reais.
- RLS é **permissivo** hoje (`using (true)` para a chave anon) — funcional para uso interno da equipe, mas **não é seguro para dados sensíveis em produção pública**. A plataforma agora tem um login único na frente (`middleware.ts`, ver `05-decisoes.md`), o que barra acesso casual à interface — mas não substitui RLS de verdade: quem tiver a `NEXT_PUBLIC_SUPABASE_ANON_KEY` (pública, vai no bundle) ainda consegue ler/escrever direto na API REST do Supabase, sem passar pelo login. Se isso virar preocupação real, ativar Supabase Auth e trocar as policies para checar `auth.uid()`/`auth.role()`.

## Vercel (frontend)

**Ainda não deployado**, mas o repositório Git já está pronto. Passos para o primeiro deploy:

1. ✅ `git init` rodado em **`marketing-hub/`** (2026-07-08) — ou seja, a raiz do repositório Git **é** a raiz do projeto Next.js. Isso é importante: **não configurar "Root Directory" na Vercel**, deixar em branco/padrão. (A pasta `Referencias design pralis/` e outros arquivos soltos na pasta de trabalho `marketing-hub-pralis-hora/`, um nível acima, **não fazem parte** deste repositório — só o conteúdo de `marketing-hub/` está versionado.)
2. ✅ Primeiro commit já criado localmente (`git log` mostra "Commit inicial: Marketing Hub Pralís & Hora Mineira").
3. **Pendente, requer ação do usuário** (precisa da conta GitHub/Vercel dele): criar um repositório no GitHub e rodar `git remote add origin <url>` + `git push -u origin master`.
4. Em vercel.com → New Project → importar o repositório recém-criado no GitHub.
5. Environment Variables (Production + Preview + Development) — copiar do `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET` (login único da plataforma — sem essas 3, ninguém consegue passar do `/login` em produção)
6. Build command / output: detecção automática do Next.js (`next build`), nenhuma configuração extra necessária — sem `vercel.json` customizado.
7. Deploy. Depois do primeiro deploy, todo `git push` na branch principal publica automaticamente.

## Checklist pré-deploy

- [x] Repositório Git criado e primeiro commit feito (2026-07-08, local — `git log` tem 1 commit)
- [x] `npm run build` local passa sem erro (verificado em 2026-07-08 — 22 rotas geradas)
- [x] `npx tsc --noEmit` limpo (verificado em 2026-07-08)
- [ ] Repositório remoto criado no GitHub + `git push` (precisa da conta do usuário)
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente cadastradas na Vercel (as mesmas do `.env.local`)
- [ ] Decidir se RLS permissivo é aceitável para o lançamento inicial ou se autenticação precisa entrar antes (ver nota de segurança acima)
- [ ] Confirmar domínio (usar o `*.vercel.app` gerado automaticamente, ou domínio próprio?)

## Notas de ambiente Windows/OneDrive (relevante para builds locais antes do deploy)

O projeto vive dentro do OneDrive, que pode travar arquivos do `node_modules` durante `npm install`/build (erros `ENOTEMPTY`/`EPERM`). Se o build local falhar de forma inconsistente por esse motivo: pausar sync do OneDrive temporariamente, ou considerar mover o projeto pra fora da pasta sincronizada antes do primeiro deploy real (decisão ainda em aberto com o usuário — ver `07-proximos-passos.md`).
