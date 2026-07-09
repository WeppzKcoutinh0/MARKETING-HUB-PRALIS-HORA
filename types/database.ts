// Tipos das tabelas do Supabase, espelhando sql/schema.sql

export type BrandSlug = 'pralis' | 'hora';

export interface Brand {
  id: string;
  name: string;
  slug: BrandSlug;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  created_at: string;
}

export type PaidTrafficType = 'reels' | 'post' | 'stories' | 'campanha' | 'outro';
export type RecordStatus = 'planejado' | 'em_andamento' | 'finalizado' | 'pausado';

export interface PaidTraffic {
  id: string;
  brand_id: string;
  date: string;
  month: string;
  type: PaidTrafficType;
  content_link: string | null;
  description: string | null;
  organic_views: number;
  paid_views: number;
  paid_profile_visits: number;
  paid_interactions: number;
  followers_gained: number;
  amount_spent: number;
  daily_cost: number;
  days: number;
  cost_per_follower: number | null;
  cost_per_profile_visit: number | null;
  cost_per_interaction: number | null;
  status: RecordStatus;
  what_worked: string | null;
  what_to_improve: string | null;
  notes: string | null;
  responsible: string | null;
  created_at: string;
  updated_at: string;
}

export interface MonthlyAnalysis {
  id: string;
  brand_id: string;
  month: string;
  reels_posts_views: number;
  stories_views_pct: number | null;
  total_views: number;
  non_followers_percentage: number | null;
  reached_accounts: number;
  followers_gained: number;
  total_followers: number;
  growth_percentage: number | null;
  reels_quantity: number;
  posts_quantity: number;
  highlight_video_link: string | null;
  engagement_schedule: string | null;
  notes: string | null;
  diagnosis: string | null;
  next_actions: string | null;
  created_at: string;
  updated_at: string;
}

export type PostingStatus =
  | 'ideia' | 'roteiro' | 'gravando' | 'editando'
  | 'aguardando_aprovacao' | 'agendado' | 'publicado' | 'cancelado';
export type ContentObjective = 'atrair' | 'engajar' | 'vender' | 'posicionar' | 'relacionamento';

export interface PostingSchedule {
  id: string;
  brand_id: string;
  date: string;
  weekday: string | null;
  content_type: string | null;
  theme: string | null;
  description: string | null;
  responsible: string | null;
  status: PostingStatus;
  objective: ContentObjective | null;
  hook: string | null;
  cta: string | null;
  target_audience: string | null;
  script_link: string | null;
  art_link: string | null;
  published_link: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type PartnershipStatus =
  | 'prospectando' | 'em_contato' | 'negociando' | 'ativo'
  | 'finalizado' | 'recusado' | 'renovar';

export interface Partnership {
  id: string;
  brand_id: string;
  partner_name: string;
  partner_type: string | null;
  contact: string | null;
  social_network: string | null;
  followers_reach: number | null;
  counterpart: string | null;
  status: PartnershipStatus;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  generated_result: string | null;
  estimated_cost: number | null;
  responsible: string | null;
  profile_link: string | null;
  delivery_link: string | null;
  rating_communication: number | null;
  rating_delivery: number | null;
  rating_result: number | null;
  should_renew: boolean | null;
  created_at: string;
  updated_at: string;
}

export type CampaignStatus = 'planejamento' | 'ativa' | 'finalizada' | 'pausada';
export type CampaignCategory =
  | 'institucional' | 'venda' | 'data_comemorativa' | 'relacionamento'
  | 'trafego_pago' | 'parceria' | 'lancamento';

export interface Campaign {
  id: string;
  brand_id: string;
  name: string;
  objective: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  reach: number | null;
  cost: number | null;
  return_description: string | null;
  target_audience: string | null;
  channel: string | null;
  status: CampaignStatus;
  responsible: string | null;
  goal: string | null;
  result: string | null;
  learnings: string | null;
  next_steps: string | null;
  category: CampaignCategory | null;
  created_at: string;
  updated_at: string;
}

export interface MarketingCalendarEntry {
  id: string;
  brand_id: string;
  date: string;
  title: string;
  type: string | null;
  description: string | null;
  opportunity: string | null;
  campaign_idea: string | null;
  status: string | null;
  created_at: string;
}

export type ActionPriority = 'baixa' | 'media' | 'alta' | 'urgente';
export type ActionStatus = 'pendente' | 'em_andamento' | 'concluido' | 'atrasado';

export interface ActionPlanItem {
  id: string;
  brand_id: string;
  what: string;
  why: string | null;
  where_: string | null;
  when_date: string | null;
  who: string | null;
  how: string | null;
  how_much: number | null;
  status: ActionStatus;
  priority: ActionPriority;
  deadline: string | null;
  expected_result: string | null;
  final_result: string | null;
  created_at: string;
  updated_at: string;
}
