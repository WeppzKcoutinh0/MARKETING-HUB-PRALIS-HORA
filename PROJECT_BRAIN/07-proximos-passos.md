# Próximos passos / pendências conhecidas

Lista viva — remover item daqui quando resolvido, mover decisão relevante pra `05-decisoes.md` se houver algo a registrar.

## Pendências ativas

- **Logo completo "HORA MINEIRA"** com a palavra "MINEIRA" e o badge laranja "RESTAURANTE" (visto no manual, página 3) — o projeto hoje só tem a versão sem "MINEIRA" (`public/brands/hora/logo.png`). Perguntar ao usuário se ele tem esse arquivo isolado (PNG/SVG), fora do PDF.
- **Importação de dados históricos** das planilhas antigas — não há script automático, seria manual pela interface ou um script Node ad-hoc com `xlsx` + `@supabase/supabase-js` (não incluído por padrão). Nota: em 2026-07-09 foram inseridos 3 registros de exemplo (fictícios, não das planilhas reais) em cada um dos 6 módulos de dados da Pralís, só pra visualização da interface — ver item abaixo.
- **Fontes pagas da Pralís** (MadeType Dillan, TR Freehand 575) — usando substitutas gratuitas (Fraunces, Caveat). Se a marca comprar/ceder os arquivos originais no futuro, trocar para `next/font/local`. Ver `05-decisoes.md`.
- **Ambiente OneDrive** — projeto roda dentro de pasta sincronizada pelo OneDrive, o que já causou falhas de `npm install` (`ENOTEMPTY`/`EPERM`) mais de uma vez. Considerar mover para fora do OneDrive antes de operações pesadas (deploy, instalação de dependências grandes).

## Concluído recentemente (contexto, não é mais pendência)

- ~~Conectar projeto Supabase real~~ — feito em 2026-07-07
- ~~Rodar schema SQL~~ — feito em 2026-07-07
- ~~Logo oficial da Pralís~~ — feito em 2026-07-08 (versão laranja aplicada)
- ~~Redesign completo da identidade visual da Pralís~~ — feito em 2026-07-09, seguindo o manual institucional oficial: fontes trocadas (Fraunces/Montserrat/Caveat no lugar de Playfair/Mulish), tagline oficial "é provar e ser feliz", ícone da marca substituído pelo símbolo real (espiga dourada), textura de pétalas no hero do Dashboard. Cores já estavam corretas, não mudaram. Hora Mineira não foi tocada. Ver `02-identidade-pralis.md` e `05-decisoes.md`.
- ~~Criar PROJECT_BRAIN/~~ — feito em 2026-07-08/09, documentação completa do projeto em Markdown.
- ~~Inicializar Git local~~ — feito em 2026-07-09 (`git init` + primeiro commit dentro de `marketing-hub/`).
- ~~Dados de exemplo na Pralís~~ — feito em 2026-07-09, 3 registros fictícios em cada um dos 6 módulos (Tráfego Pago, Análise Mensal, Cronograma, Parcerias, Campanhas, Plano de Ação), inseridos direto no Supabase via script pontual (não versionado). Calendário 2026 já tinha os 27 registros do seed original. **São dados fictícios pra visualização — apagar antes de usar a plataforma de verdade** (pela própria interface, um por um, ou truncando as tabelas no Supabase).
- ~~Multi-ano no Dashboard (gráficos mensais)~~ — feito em 2026-07-09, coluna `year` em `monthly_analysis`, seletor de ano, gráficos sempre com os 12 meses. SQL já rodado pelo usuário no Supabase (confirmado — insert de dados de exemplo com `year` funcionou sem erro). Ver `04-arquitetura.md` e `05-decisoes.md`.
- ~~Redesign completo da identidade visual da Hora Mineira~~ — feito em 2026-07-09, seguindo o "Manual da Marca — Hora Mineira" oficial (2 PDFs + ícone/logo em PNG). Paleta/fontes já estavam corretas de uma passada anterior; essa rodada deu à Hora os mesmos elementos decorativos que a Pralís já tinha (ícones de canto no hero/landing/sidebar, selo em marca d'água no card líder, ícone customizado nos estados vazios de gráfico) — antes esses pontos ficavam "nus" pra Hora. Depois disso, o tema escuro foi clareado (carvão-oliva em vez de quase-preto) a pedido do usuário. Ver `03-identidade-hora.md`.
- ~~Dados de exemplo na Hora Mineira~~ — feito em 2026-07-09, 3 registros fictícios (temática restaurante & botequim, Juiz de Fora — feijoada de sábado, happy hour de quinta, campanha de aniversário) em cada um dos 6 módulos de dados, inseridos direto no Supabase via script pontual (não versionado). **São dados fictícios pra visualização — apagar antes de usar a plataforma de verdade.**
- ~~Autenticação~~ — feito em 2026-07-10. Login único e fixo (não é Supabase Auth, não tem cadastro de usuário) — ver `05-decisoes.md` pra detalhes técnicos e trade-offs de segurança dessa escolha.
- ~~Relatórios com filtro por tipo + exportação em PDF~~ — feito em 2026-07-10/11, revisado em 2026-07-11 (bug do PDF cortado por causa de `foreignObjectRendering`, corrigido). Ver `04-arquitetura.md` e `05-decisoes.md`.
- ~~Revisão de responsividade (mobile/tablet/notebook)~~ — feito em 2026-07-11 nas duas marcas. Ver `05-decisoes.md`.
- ~~Push para o GitHub~~ — feito em 2026-07-13. Repositório: [github.com/WeppzKcoutinh0/MARKETING-HUB-PRALIS-HORA](https://github.com/WeppzKcoutinh0/MARKETING-HUB-PRALIS-HORA), branch `master`. `.env.local` conferido fora do commit antes do push.
- ~~Deploy na Vercel~~ — feito em 2026-07-13. **No ar**: https://marketing-hub-pralis-hora.vercel.app. Ver `06-deploy.md` pra detalhes (inclui uma pegadinha que rolou: o campo `SESSION_SECRET` foi preenchido errado da primeira vez, com o texto ".env.local" em vez do valor de dentro do arquivo — corrigido antes do deploy final). Todo `git push` na `master` a partir de agora publica automaticamente.
