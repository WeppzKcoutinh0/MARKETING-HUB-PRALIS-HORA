# PROJECT_BRAIN

Documentação viva do Marketing Hub — Pralís & Hora Mineira.

**Regra de trabalho: antes de qualquer alteração no projeto, leia os arquivos relevantes desta pasta primeiro.** Depois de qualquer alteração relevante (schema, identidade visual, decisão de arquitetura, deploy), atualize o arquivo correspondente aqui. Isso é o que garante continuidade de contexto entre conversas.

## Índice

| Arquivo | Conteúdo |
|---|---|
| [01-visao-geral.md](01-visao-geral.md) | O que é o projeto, stack, estrutura de pastas, como rodar local |
| [02-identidade-pralis.md](02-identidade-pralis.md) | Identidade visual oficial da Pralís (cores, tipografia, logo, padrões, tom de voz) |
| [03-identidade-hora.md](03-identidade-hora.md) | Identidade visual oficial da Hora Mineira (cores, tipografia, logo, personalidade) |
| [04-arquitetura.md](04-arquitetura.md) | Como o código é organizado — motor genérico de CRUD, schema do banco, componentes |
| [05-decisoes.md](05-decisoes.md) | Log de decisões importantes tomadas ao longo do projeto, com data e motivo |
| [06-deploy.md](06-deploy.md) | Ambiente de deploy — Vercel + Supabase, variáveis de ambiente, checklist |
| [07-proximos-passos.md](07-proximos-passos.md) | O que está pendente / em aberto |

## Como manter isso atualizado

- **Mudou uma cor, fonte ou logo de marca?** Atualize `02-identidade-pralis.md` ou `03-identidade-hora.md`.
- **Mudou schema do banco, adicionou módulo novo, mudou como um componente funciona?** Atualize `04-arquitetura.md`.
- **Tomou uma decisão de produto/arquitetura não óbvia (ex: "Hora ficou escura porque..." )?** Registre em `05-decisoes.md` — isso evita repetir a mesma pergunta ou reverter a mesma decisão sem querer no futuro.
- **Mudou algo do processo de deploy?** Atualize `06-deploy.md`.

Última atualização geral: 2026-07-09.
