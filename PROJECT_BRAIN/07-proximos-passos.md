# Próximos passos / pendências conhecidas

Lista viva — remover item daqui quando resolvido, mover decisão relevante pra `05-decisoes.md` se houver algo a registrar.

## Pendências ativas

- **Ícone novo da Hora Mineira** (garfo + faca + prato formando relógio) — usuário enviou a imagem mas ainda não salvou o arquivo no projeto. Precisa ser salvo em `public/brands/hora/` para ser aplicado como marca d'água/assinatura visual no Dashboard.
- **Logo completo "HORA MINEIRA"** com a palavra "MINEIRA" e o badge laranja "RESTAURANTE" (visto no manual, página 3) — o projeto hoje só tem a versão sem "MINEIRA". Perguntar ao usuário se ele tem esse arquivo isolado (PNG/SVG), fora do PDF.
- **Repositório Git** — projeto ainda não versionado. Necessário antes de qualquer deploy na Vercel.
- **Autenticação** — não existe hoje. Decisão de produto em aberto: lançar sem auth (RLS permissivo, uso interno) ou implementar Supabase Auth antes do primeiro deploy público.
- **Importação de dados históricos** das planilhas antigas — não há script automático, seria manual pela interface ou um script Node ad-hoc com `xlsx` + `@supabase/supabase-js` (não incluído por padrão).
- **Fontes pagas da Pralís** (MadeType Dillan, TR Freehand 575) — usando substitutas gratuitas (Fraunces, Caveat). Se a marca comprar/ceder os arquivos originais no futuro, trocar para `next/font/local`.
- **Ambiente OneDrive** — projeto roda dentro de pasta sincronizada pelo OneDrive, o que já causou falhas de `npm install` (`ENOTEMPTY`/`EPERM`) mais de uma vez. Considerar mover para fora do OneDrive antes de operações pesadas (deploy, instalação de dependências grandes).

## Concluído recentemente (contexto, não é mais pendência)

- ~~Conectar projeto Supabase real~~ — feito em 2026-07-07
- ~~Rodar schema SQL~~ — feito em 2026-07-07
- ~~Logo oficial da Pralís~~ — feito em 2026-07-08 (versão laranja aplicada)
