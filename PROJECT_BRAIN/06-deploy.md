# Deploy — Vercel + Supabase

## Supabase (banco de dados)

- **Status**: projeto real já criado e conectado (não é mais placeholder).
- Schema completo (`sql/schema.sql`) já rodado no SQL Editor do painel Supabase — 8 tabelas, RLS, seed das 2 marcas + calendário 2026.
- `.env.local` (local, nunca commitado — está no `.gitignore`) tem `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` reais.
- RLS é **permissivo** hoje (`using (true)` para a chave anon) — funcional para uso interno da equipe, mas **não é seguro para dados sensíveis em produção pública**. A plataforma agora tem um login único na frente (`middleware.ts`, ver `05-decisoes.md`), o que barra acesso casual à interface — mas não substitui RLS de verdade: quem tiver a `NEXT_PUBLIC_SUPABASE_ANON_KEY` (pública, vai no bundle) ainda consegue ler/escrever direto na API REST do Supabase, sem passar pelo login. Se isso virar preocupação real, ativar Supabase Auth e trocar as policies para checar `auth.uid()`/`auth.role()`.

## Vercel (frontend)

**Status: no ar.** Primeiro deploy feito em 2026-07-13.
- URL de produção: **https://marketing-hub-pralis-hora.vercel.app**
- Conta Vercel: `kaylanecoutinhos-projects` (Hobby), projeto `marketing-hub-pralis-hora`, conectado ao GitHub via `WeppzKcoutinh0`.
- Toda vez que der `git push` na branch `master`, a Vercel publica automaticamente uma nova versão (sem precisar repetir nenhum passo abaixo).

Passos que foram seguidos no primeiro deploy (referência, caso precise recriar o projeto do zero um dia):

1. ✅ `git init` rodado em **`marketing-hub/`** (2026-07-08) — ou seja, a raiz do repositório Git **é** a raiz do projeto Next.js. Isso é importante: **não configurar "Root Directory" na Vercel**, deixar em branco/padrão. (A pasta `Referencias design pralis/` e outros arquivos soltos na pasta de trabalho `marketing-hub-pralis-hora/`, um nível acima, **não fazem parte** deste repositório — só o conteúdo de `marketing-hub/` está versionado.)
2. ✅ Repositório remoto criado pelo usuário e conectado: [github.com/WeppzKcoutinh0/MARKETING-HUB-PRALIS-HORA](https://github.com/WeppzKcoutinh0/MARKETING-HUB-PRALIS-HORA) (`origin`). Push feito em 2026-07-13 — branch `master`, 2 commits (inicial + o redesign completo/login/relatórios/responsividade). **`.env.local` nunca foi commitado** (confirmado antes do push — só `.env.example` com placeholders está no repositório).
3. Em vercel.com → New Project → importar esse repositório do GitHub.
4. Environment Variables (Production + Preview + Development) — copiar do `.env.local` local (não do GitHub, já que ele não está lá):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET` (login único da plataforma — sem essas 3, ninguém consegue passar do `/login` em produção)
5. Build command / output: detecção automática do Next.js (`next build`), nenhuma configuração extra necessária — sem `vercel.json` customizado.
6. Deploy. Depois do primeiro deploy, todo `git push` na branch principal publica automaticamente.

## Checklist pré-deploy

- [x] Repositório Git criado e primeiro commit feito (2026-07-08, local — `git log` tem 1 commit)
- [x] `npm run build` local passa sem erro (verificado em 2026-07-08 — 22 rotas geradas)
- [x] `npx tsc --noEmit` limpo (verificado em 2026-07-08, e de novo em 2026-07-13 depois do redesign/login/relatórios)
- [x] Repositório remoto criado no GitHub + `git push` — feito em 2026-07-13 ([github.com/WeppzKcoutinh0/MARKETING-HUB-PRALIS-HORA](https://github.com/WeppzKcoutinh0/MARKETING-HUB-PRALIS-HORA), branch `master`)
- [x] Projeto importado na Vercel — feito em 2026-07-13
- [x] Variáveis de ambiente cadastradas na Vercel — feito em 2026-07-13. **Pegadinha que rolou nessa configuração**: no primeiro preenchimento, o campo `SESSION_SECRET` foi preenchido com o texto literal `.env.local` (nome do arquivo) em vez do valor de dentro dele — corrigido antes do deploy final. Se um dia o login em produção parar de funcionar do nada, checar esse campo primeiro.
- [x] Deploy publicado e confirmado no ar — https://marketing-hub-pralis-hora.vercel.app (2026-07-13)
- [ ] Decidir se RLS permissivo é aceitável pro uso atual ou se autenticação/RLS precisa evoluir (ver nota de segurança acima)
- [ ] Domínio próprio (hoje usa o `*.vercel.app` gerado automaticamente)

## Notas de ambiente Windows/OneDrive (relevante para builds locais antes do deploy)

O projeto vive dentro do OneDrive, que pode travar arquivos do `node_modules` durante `npm install`/build (erros `ENOTEMPTY`/`EPERM`). Se o build local falhar de forma inconsistente por esse motivo: pausar sync do OneDrive temporariamente, ou considerar mover o projeto pra fora da pasta sincronizada antes do primeiro deploy real (decisão ainda em aberto com o usuário — ver `07-proximos-passos.md`).
