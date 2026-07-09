-- ============================================================
-- Marketing Hub — Pralís & Hora Mineira
-- Schema completo do banco de dados Supabase (PostgreSQL)
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase.
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Tabela: brands
-- ------------------------------------------------------------
create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  primary_color text,
  secondary_color text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Tabela: paid_traffic (Tráfego Pago)
-- ------------------------------------------------------------
create table if not exists paid_traffic (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  date date not null,
  month text,
  type text not null check (type in ('reels','post','stories','campanha','outro')),
  content_link text,
  description text,
  organic_views integer default 0,
  paid_views integer default 0,
  paid_profile_visits integer default 0,
  paid_interactions integer default 0,
  followers_gained integer default 0,
  amount_spent numeric(12,2) default 0,
  daily_cost numeric(12,2),
  days integer default 1,
  cost_per_follower numeric(12,2),
  cost_per_profile_visit numeric(12,2),
  cost_per_interaction numeric(12,2),
  status text default 'planejado' check (status in ('planejado','em_andamento','finalizado','pausado')),
  what_worked text,
  what_to_improve text,
  notes text,
  responsible text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Tabela: monthly_analysis (Análise Mensal)
-- ------------------------------------------------------------
create table if not exists monthly_analysis (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  month text not null,
  reels_posts_views integer default 0,
  stories_views_pct numeric(6,3),
  total_views integer default 0,
  non_followers_percentage numeric(6,3),
  reached_accounts integer default 0,
  followers_gained integer default 0,
  total_followers integer default 0,
  growth_percentage numeric(8,3),
  reels_quantity integer default 0,
  posts_quantity integer default 0,
  highlight_video_link text,
  engagement_schedule text,
  notes text,
  diagnosis text,
  next_actions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (brand_id, month)
);

-- ------------------------------------------------------------
-- Tabela: posting_schedule (Cronograma de Postagens)
-- ------------------------------------------------------------
create table if not exists posting_schedule (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  date date not null,
  weekday text,
  content_type text,
  theme text,
  description text,
  responsible text,
  status text default 'ideia' check (status in
    ('ideia','roteiro','gravando','editando','aguardando_aprovacao','agendado','publicado','cancelado')),
  objective text check (objective in ('atrair','engajar','vender','posicionar','relacionamento')),
  hook text,
  cta text,
  target_audience text,
  script_link text,
  art_link text,
  published_link text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Tabela: partnerships (Parcerias)
-- ------------------------------------------------------------
create table if not exists partnerships (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  partner_name text not null,
  partner_type text,
  contact text,
  social_network text,
  followers_reach integer,
  counterpart text,
  status text default 'prospectando' check (status in
    ('prospectando','em_contato','negociando','ativo','finalizado','recusado','renovar')),
  start_date date,
  end_date date,
  notes text,
  generated_result text,
  estimated_cost numeric(12,2),
  responsible text,
  profile_link text,
  delivery_link text,
  rating_communication smallint check (rating_communication between 1 and 5),
  rating_delivery smallint check (rating_delivery between 1 and 5),
  rating_result smallint check (rating_result between 1 and 5),
  should_renew boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Tabela: campaigns (Campanhas)
-- ------------------------------------------------------------
create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  name text not null,
  objective text,
  description text,
  start_date date,
  end_date date,
  reach integer,
  cost numeric(12,2),
  return_description text,
  target_audience text,
  channel text,
  status text default 'planejamento' check (status in ('planejamento','ativa','finalizada','pausada')),
  responsible text,
  goal text,
  result text,
  learnings text,
  next_steps text,
  category text check (category in
    ('institucional','venda','data_comemorativa','relacionamento','trafego_pago','parceria','lancamento')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Tabela: marketing_calendar (Calendário 2026)
-- ------------------------------------------------------------
create table if not exists marketing_calendar (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  date date not null,
  title text not null,
  type text check (type in ('feriado','data_comemorativa','evento','campanha','lembrete')),
  description text,
  opportunity text,
  campaign_idea text,
  status text default 'sugerido' check (status in ('sugerido','planejado','em_producao','concluido')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Tabela: action_plan (Plano de Ação 5W2H)
-- ------------------------------------------------------------
create table if not exists action_plan (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  what text not null,
  why text,
  where_ text,
  when_date date,
  who text,
  how text,
  how_much numeric(12,2),
  status text default 'pendente' check (status in ('pendente','em_andamento','concluido','atrasado')),
  priority text default 'media' check (priority in ('baixa','media','alta','urgente')),
  deadline date,
  expected_result text,
  final_result text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Índices para consultas mais rápidas por marca e data
-- ------------------------------------------------------------
create index if not exists idx_paid_traffic_brand on paid_traffic(brand_id);
create index if not exists idx_monthly_analysis_brand on monthly_analysis(brand_id);
create index if not exists idx_posting_schedule_brand on posting_schedule(brand_id, date);
create index if not exists idx_partnerships_brand on partnerships(brand_id);
create index if not exists idx_campaigns_brand on campaigns(brand_id);
create index if not exists idx_marketing_calendar_brand on marketing_calendar(brand_id, date);
create index if not exists idx_action_plan_brand on action_plan(brand_id);

-- ------------------------------------------------------------
-- Trigger genérico para manter updated_at sempre atualizado
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  t text;
begin
  foreach t in array array['paid_traffic','monthly_analysis','posting_schedule','partnerships','campaigns','action_plan']
  loop
    execute format('drop trigger if exists trg_set_updated_at on %I', t);
    execute format('create trigger trg_set_updated_at before update on %I for each row execute function set_updated_at()', t);
  end loop;
end $$;

-- ------------------------------------------------------------
-- Row Level Security
-- Este é um painel interno de equipe: liberamos leitura/escrita
-- para usuários autenticados. Ajuste as policies conforme sua
-- necessidade real de autenticação/autorização.
-- ------------------------------------------------------------
alter table brands enable row level security;
alter table paid_traffic enable row level security;
alter table monthly_analysis enable row level security;
alter table posting_schedule enable row level security;
alter table partnerships enable row level security;
alter table campaigns enable row level security;
alter table marketing_calendar enable row level security;
alter table action_plan enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array['brands','paid_traffic','monthly_analysis','posting_schedule','partnerships','campaigns','marketing_calendar','action_plan']
  loop
    execute format('drop policy if exists "allow_all_%s" on %I', t, t);
    -- Demo: acesso liberado (equivalente a uso com a chave anon).
    -- Para produção, troque "true" por checagens de auth.uid() / auth.role().
    execute format('create policy "allow_all_%s" on %I for all using (true) with check (true)', t, t);
  end loop;
end $$;

-- ------------------------------------------------------------
-- Seed: as duas marcas
-- ------------------------------------------------------------
insert into brands (name, slug, primary_color, secondary_color)
values
  ('Pralís', 'pralis', '#B8860B', '#F37435'),
  ('Hora Mineira', 'hora', '#D0641D', '#688E42')
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- Seed: Calendário de marketing 2026 (datas comemorativas
-- extraídas das planilhas originais), replicado para as duas marcas
-- ------------------------------------------------------------
insert into marketing_calendar (brand_id, date, title, type, opportunity)
select b.id, x.date::date, x.title, x.type, x.opportunity
from brands b
cross join (values
  ('2026-01-01','Ano Novo','feriado','Mensagem institucional de boas-vindas ao ano'),
  ('2026-01-25','Dia do Café','data_comemorativa','Promoção especial com café da casa'),
  ('2026-02-10','Dia da Pizza','data_comemorativa','Post ou promoção temática'),
  ('2026-02-17','Carnaval','feriado','Horário especial + conteúdo de bastidores'),
  ('2026-03-08','Dia da Mulher','data_comemorativa','Homenagem à equipe e clientes'),
  ('2026-03-26','Dia do Cacau','data_comemorativa','Destaque para produtos com chocolate'),
  ('2026-03-27','Dia do Bolo','data_comemorativa','Campanha de bolos e sobremesas'),
  ('2026-04-03','Sexta-feira Santa','feriado','Cardápio especial de Páscoa'),
  ('2026-04-05','Páscoa','feriado','Campanha de Páscoa'),
  ('2026-04-21','Tiradentes','feriado','Funcionamento especial'),
  ('2026-05-10','Dia das Mães','data_comemorativa','Campanha principal do mês — planejar com antecedência'),
  ('2026-05-28','Dia do Hambúrguer','data_comemorativa','Promoção temática'),
  ('2026-06-12','Dia dos Namorados','data_comemorativa','Combo para casais'),
  ('2026-06-21','Dia do Milho','data_comemorativa','Cardápio junino'),
  ('2026-07-10','Dia da Pizza','data_comemorativa','Promoção temática'),
  ('2026-07-26','Dia dos Avós','data_comemorativa','Campanha em família'),
  ('2026-08-16','Dia dos Pais','data_comemorativa','Campanha principal do mês'),
  ('2026-08-25','Dia do Feijão','data_comemorativa','Destaque para pratos típicos'),
  ('2026-09-07','Independência do Brasil','feriado','Funcionamento especial'),
  ('2026-09-10','Dia do Cachorro-Quente','data_comemorativa','Promoção temática'),
  ('2026-09-15','Dia do Cliente','data_comemorativa','Ação de fidelização'),
  ('2026-10-12','Dia das Crianças / N. Sra. Aparecida','feriado','Cardápio kids / funcionamento especial'),
  ('2026-10-16','Dia Mundial da Alimentação','data_comemorativa','Conteúdo institucional sobre qualidade'),
  ('2026-11-02','Finados','feriado','Funcionamento especial'),
  ('2026-11-15','Proclamação da República','feriado','Funcionamento especial'),
  ('2026-11-23','Dia da Culinária Mineira','data_comemorativa','Grande oportunidade para a Hora Mineira'),
  ('2026-12-25','Natal','feriado','Campanha de fim de ano')
) as x(date, title, type, opportunity)
where not exists (
  select 1 from marketing_calendar mc where mc.brand_id = b.id and mc.date = x.date::date and mc.title = x.title
);

-- ============================================================
-- Fim do schema. Depois de rodar este script, copie a URL e a
-- anon key do seu projeto (Project Settings > API) para o .env.local
-- ============================================================
