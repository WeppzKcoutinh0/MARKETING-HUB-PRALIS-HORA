# Identidade visual oficial — Hora Mineira

Fonte: dois PDFs enviados pelo usuário — `hora_idv.pdf` (conceito/posicionamento da marca "Hora", restaurante & botequim) e `Identidade hora.pdf` ("Manual da Marca — Hora Mineira", com paleta e tipografia formais). Lidos e documentados em 2026-07-07/08.

## Conceito

Restaurante & botequim em Juiz de Fora. Conceito central: tempo/momento — "a letra 'o' vem em formato circular representando um relógio". A seta formada pelo garfo+faca na letra "A" é um símbolo universal de comunicação, associado a satisfação, crescimento, centralização, prazer.

**Posicionamento**: ocupar o lugar de conexão agradável, deliciosa e interativa em Juiz de Fora — para quem está insatisfeito com tendências atuais de restaurantes (preço abusivo, localização inviável, sem opções saudáveis).

**Promessa oficial**: *"A melhor hora do seu dia."*

## Cores oficiais (9 cores, do Manual da Marca)

| Hex | Papel |
|---|---|
| `#141414` | Fundo principal (quase preto) |
| `#354D1D` | Verde escuro |
| `#688E42` | Verde médio |
| `#29170D` | Marrom quase preto |
| `#7C3916` | Marrom |
| `#D0641D` | Laranja queimado (cor primária de ação) |
| `#969997` | Cinza (texto secundário) |
| `#D6D6D6` | Cinza claro |
| `#FDFDFD` | Branco/quase branco (texto principal sobre fundo escuro) |

Cores derivadas (não oficiais, criadas para a UI e não presentes no manual): `surface: #1D1B17`, `surface2: #26221B`, `border: #312C23` — tons intermediários entre o preto de fundo e os cards, para dar profundidade sem fugir da paleta.

## Tipografia oficial

| Uso | Fonte | Status |
|---|---|---|
| Títulos | **Poppins** | Gratuita, Google Fonts — já configurada corretamente desde o início. |
| Textos corridos | **Be Vietnam** (usamos "Be Vietnam Pro" do Google Fonts, variante web da mesma família) | Gratuita — já configurada corretamente. |

Não há pendência de fonte paga para a Hora (diferente da Pralís).

## Personalidade e tom de voz (tabela "Brand Personal")

- **Personalidade**: acolhedora, bem-humorada, elegante, familiar, cheia de afeto, sonhadora, em busca de experiências.
- **Tom de voz**: suave, leve, sincero, inspirador.
- **Valores**: autenticidade, igualdade, respeito, hospitalidade, disponibilidade, alegria.

## Logo

Wordmark "HORA" com a letra "O" estilizada como círculo com ponto central (relógio) e o "A" formado por garfo + faca cruzados. Subtítulo "Restaurante" em fonte leve abaixo. Existe uma versão mais recente/completa vista no manual: "HORA" (linha 1, escuro) + "MINEIRA" (linha 2, marrom) + badge laranja arredondado "RESTAURANTE" — **essa versão completa com "MINEIRA" e o badge não está presente como arquivo isolado no projeto ainda**, só dentro do PDF do manual. O projeto hoje usa `public/brands/hora/logo.png` (só "HORA" + "Restaurante" em texto pequeno, sem o "MINEIRA").

Ícone à parte (recebido como imagem separada, muito mais refinado): garfo + faca formando os ponteiros de um relógio, com um prato circular como mostrador. **Ainda não salvo no projeto** — pendente do usuário salvar o arquivo (ver `07-proximos-passos.md`).

## Decisão de tema: escuro, não claro

Em 2026-07-08 o tema da Hora foi temporariamente mudado para **claro** (a pedido do usuário), depois **revertido para escuro** no mesmo dia, ao perceber que o tema claro fazia a Hora parecer visualmente parecida com a Pralís (que também é clara). O manual oficial confirma que o fundo `#141414` é a cor dominante da paleta — a marca é conceitualmente "restaurante à noite, elegante". Ver decisão completa em `05-decisoes.md`.

**Não aplicar tema claro na Hora sem confirmação explícita do usuário** — já foi tentado e revertido uma vez.
