// Configuração declarativa de cada módulo da plataforma.
// Um único componente de tabela + formulário (DataModule) usa esta config
// para renderizar CRUD completo de qualquer uma das 7 áreas de dados,
// evitando duplicar código entre as duas marcas e entre as áreas.

export type FieldType =
  | 'text' | 'textarea' | 'number' | 'currency' | 'date'
  | 'select' | 'url' | 'boolean' | 'rating';

export interface FieldOption {
  value: string;
  label: string;
  color?: string;
}

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: FieldOption[];
  placeholder?: string;
  showInTable?: boolean;
  computed?: boolean; // calculado automaticamente, não editável
  help?: string;
  colSpan?: 1 | 2;
  section?: string; // agrupa campos visualmente no formulário
}

export interface ModuleConfig {
  slug: string;
  table: string;
  title: string;
  description: string;
  icon: string;
  fields: FieldConfig[];
  defaultSort: { key: string; direction: 'asc' | 'desc' };
  searchableKeys: string[];
  primaryLabelKey: string;
}

export const STATUS_TRAFEGO: FieldOption[] = [
  { value: 'planejado', label: 'Planejado', color: '#969997' },
  { value: 'em_andamento', label: 'Em andamento', color: '#D0641D' },
  { value: 'finalizado', label: 'Finalizado', color: '#688E42' },
  { value: 'pausado', label: 'Pausado', color: '#B14435' },
];

export const TIPOS_TRAFEGO: FieldOption[] = [
  { value: 'reels', label: 'Reels' },
  { value: 'post', label: 'Post' },
  { value: 'stories', label: 'Stories' },
  { value: 'campanha', label: 'Campanha' },
  { value: 'outro', label: 'Outro' },
];

export const STATUS_POSTAGEM: FieldOption[] = [
  { value: 'ideia', label: 'Ideia', color: '#969997' },
  { value: 'roteiro', label: 'Roteiro', color: '#8A7365' },
  { value: 'gravando', label: 'Gravando', color: '#B8860B' },
  { value: 'editando', label: 'Editando', color: '#F37435' },
  { value: 'aguardando_aprovacao', label: 'Aguardando aprovação', color: '#D0641D' },
  { value: 'agendado', label: 'Agendado', color: '#688E42' },
  { value: 'publicado', label: 'Publicado', color: '#354D1D' },
  { value: 'cancelado', label: 'Cancelado', color: '#B14435' },
];

export const OBJETIVOS_CONTEUDO: FieldOption[] = [
  { value: 'atrair', label: 'Atrair' },
  { value: 'engajar', label: 'Engajar' },
  { value: 'vender', label: 'Vender' },
  { value: 'posicionar', label: 'Posicionar marca' },
  { value: 'relacionamento', label: 'Relacionamento' },
];

export const STATUS_PARCERIA: FieldOption[] = [
  { value: 'prospectando', label: 'Prospectando', color: '#969997' },
  { value: 'em_contato', label: 'Em contato', color: '#B8860B' },
  { value: 'negociando', label: 'Negociando', color: '#F37435' },
  { value: 'ativo', label: 'Ativo', color: '#688E42' },
  { value: 'finalizado', label: 'Finalizado', color: '#354D1D' },
  { value: 'recusado', label: 'Recusado', color: '#B14435' },
  { value: 'renovar', label: 'Renovar', color: '#D0641D' },
];

export const STATUS_CAMPANHA: FieldOption[] = [
  { value: 'planejamento', label: 'Planejamento', color: '#969997' },
  { value: 'ativa', label: 'Ativa', color: '#688E42' },
  { value: 'finalizada', label: 'Finalizada', color: '#354D1D' },
  { value: 'pausada', label: 'Pausada', color: '#B14435' },
];

export const CATEGORIAS_CAMPANHA: FieldOption[] = [
  { value: 'institucional', label: 'Institucional' },
  { value: 'venda', label: 'Venda' },
  { value: 'data_comemorativa', label: 'Data comemorativa' },
  { value: 'relacionamento', label: 'Relacionamento' },
  { value: 'trafego_pago', label: 'Tráfego pago' },
  { value: 'parceria', label: 'Parceria' },
  { value: 'lancamento', label: 'Lançamento' },
];

export const STATUS_ACAO: FieldOption[] = [
  { value: 'pendente', label: 'Pendente', color: '#969997' },
  { value: 'em_andamento', label: 'Em andamento', color: '#D0641D' },
  { value: 'concluido', label: 'Concluído', color: '#688E42' },
  { value: 'atrasado', label: 'Atrasado', color: '#B14435' },
];

export const PRIORIDADES: FieldOption[] = [
  { value: 'baixa', label: 'Baixa', color: '#969997' },
  { value: 'media', label: 'Média', color: '#B8860B' },
  { value: 'alta', label: 'Alta', color: '#D0641D' },
  { value: 'urgente', label: 'Urgente', color: '#B14435' },
];

export const MODULES: Record<string, ModuleConfig> = {
  'trafego-pago': {
    slug: 'trafego-pago',
    table: 'paid_traffic',
    title: 'Tráfego Pago',
    description: 'Investimentos em anúncios, retorno e custo por resultado',
    icon: 'TrendingUp',
    defaultSort: { key: 'date', direction: 'desc' },
    searchableKeys: ['description', 'responsible', 'month'],
    primaryLabelKey: 'description',
    fields: [
      { key: 'date', label: 'Data', type: 'date', required: true, showInTable: true, section: 'Sobre o conteúdo' },
      { key: 'month', label: 'Mês', type: 'select', options: [], showInTable: true, section: 'Sobre o conteúdo' },
      { key: 'type', label: 'Tipo', type: 'select', options: TIPOS_TRAFEGO, required: true, showInTable: true, section: 'Sobre o conteúdo' },
      { key: 'content_link', label: 'Link do vídeo/post', type: 'url', colSpan: 2, section: 'Sobre o conteúdo' },
      { key: 'description', label: 'Descrição', type: 'textarea', colSpan: 2, showInTable: true, section: 'Sobre o conteúdo' },
      { key: 'organic_views', label: 'Visualização orgânica', type: 'number', section: 'Alcance' },
      { key: 'paid_views', label: 'Visualização paga', type: 'number', showInTable: true, section: 'Alcance' },
      { key: 'paid_profile_visits', label: 'Visitas ao perfil pago', type: 'number', section: 'Alcance' },
      { key: 'paid_interactions', label: 'Interações pagas', type: 'number', section: 'Alcance' },
      { key: 'followers_gained', label: 'Seguidores ganhos', type: 'number', showInTable: true, section: 'Alcance' },
      { key: 'amount_spent', label: 'Valor investido', type: 'currency', showInTable: true, section: 'Investimento' },
      { key: 'days', label: 'Dias', type: 'number', section: 'Investimento' },
      { key: 'daily_cost', label: 'Custo por dia', type: 'currency', computed: true, section: 'Custos calculados' },
      { key: 'cost_per_follower', label: 'Custo por seguidor', type: 'currency', computed: true, showInTable: true, section: 'Custos calculados' },
      { key: 'cost_per_profile_visit', label: 'Custo por visita ao perfil', type: 'currency', computed: true, section: 'Custos calculados' },
      { key: 'cost_per_interaction', label: 'Custo por interação', type: 'currency', computed: true, section: 'Custos calculados' },
      { key: 'status', label: 'Status', type: 'select', options: STATUS_TRAFEGO, showInTable: true, section: 'Acompanhamento' },
      { key: 'what_worked', label: 'O que funcionou?', type: 'textarea', colSpan: 2, section: 'Acompanhamento' },
      { key: 'what_to_improve', label: 'O que fazer diferente na próxima?', type: 'textarea', colSpan: 2, section: 'Acompanhamento' },
      { key: 'responsible', label: 'Responsável', type: 'text', section: 'Acompanhamento' },
      { key: 'notes', label: 'Observações', type: 'textarea', colSpan: 2, section: 'Acompanhamento' },
    ],
  },
  'analise-mensal': {
    slug: 'analise-mensal',
    table: 'monthly_analysis',
    title: 'Análise Mensal',
    description: 'Evolução mês a mês de alcance, seguidores e crescimento',
    icon: 'BarChart3',
    defaultSort: { key: 'month', direction: 'asc' },
    searchableKeys: ['month', 'notes'],
    primaryLabelKey: 'month',
    fields: [
      { key: 'month', label: 'Mês', type: 'select', options: [], required: true, showInTable: true, section: 'Período' },
      { key: 'reels_posts_views', label: 'Visualizações reels/posts', type: 'number', showInTable: true, section: 'Alcance e visualizações' },
      { key: 'stories_views_pct', label: '% visualização em stories', type: 'number', section: 'Alcance e visualizações' },
      { key: 'total_views', label: 'Visualizações totais', type: 'number', showInTable: true, section: 'Alcance e visualizações' },
      { key: 'non_followers_percentage', label: '% não seguidores', type: 'number', section: 'Alcance e visualizações' },
      { key: 'reached_accounts', label: 'Contas alcançadas', type: 'number', showInTable: true, section: 'Alcance e visualizações' },
      { key: 'followers_gained', label: 'Seguidores ganhos', type: 'number', showInTable: true, section: 'Crescimento' },
      { key: 'total_followers', label: 'Total de seguidores', type: 'number', section: 'Crescimento' },
      { key: 'growth_percentage', label: 'Crescimento (%)', type: 'number', showInTable: true, section: 'Crescimento' },
      { key: 'reels_quantity', label: 'Qtd. reels', type: 'number', section: 'Conteúdo produzido' },
      { key: 'posts_quantity', label: 'Qtd. posts', type: 'number', section: 'Conteúdo produzido' },
      { key: 'highlight_video_link', label: 'Vídeo destaque', type: 'url', colSpan: 2, section: 'Conteúdo produzido' },
      { key: 'engagement_schedule', label: 'Horário de engajamento', type: 'text', colSpan: 2, section: 'Conteúdo produzido' },
      { key: 'diagnosis', label: 'Diagnóstico', type: 'text', showInTable: true, section: 'Diagnóstico e próximos passos' },
      { key: 'notes', label: 'Observações do mês', type: 'textarea', colSpan: 2, section: 'Diagnóstico e próximos passos' },
      { key: 'next_actions', label: 'Próximas ações', type: 'textarea', colSpan: 2, section: 'Diagnóstico e próximos passos' },
    ],
  },
  cronograma: {
    slug: 'cronograma',
    table: 'posting_schedule',
    title: 'Cronograma de Postagens',
    description: 'Planejamento semanal e mensal de conteúdo',
    icon: 'Calendar',
    defaultSort: { key: 'date', direction: 'asc' },
    searchableKeys: ['theme', 'description', 'responsible'],
    primaryLabelKey: 'theme',
    fields: [
      { key: 'date', label: 'Data', type: 'date', required: true, showInTable: true, section: 'Planejamento' },
      { key: 'content_type', label: 'Tipo de conteúdo', type: 'text', showInTable: true, section: 'Planejamento' },
      { key: 'theme', label: 'Tema', type: 'text', required: true, showInTable: true, section: 'Planejamento' },
      { key: 'description', label: 'Descrição', type: 'textarea', colSpan: 2, section: 'Planejamento' },
      { key: 'objective', label: 'Objetivo', type: 'select', options: OBJETIVOS_CONTEUDO, showInTable: true, section: 'Planejamento' },
      { key: 'target_audience', label: 'Público-alvo', type: 'text', section: 'Planejamento' },
      { key: 'hook', label: 'Gancho do conteúdo', type: 'text', colSpan: 2, section: 'Roteiro' },
      { key: 'cta', label: 'CTA usado', type: 'text', section: 'Roteiro' },
      { key: 'responsible', label: 'Responsável', type: 'text', showInTable: true, section: 'Roteiro' },
      { key: 'status', label: 'Status', type: 'select', options: STATUS_POSTAGEM, required: true, showInTable: true, section: 'Roteiro' },
      { key: 'script_link', label: 'Link do roteiro', type: 'url', section: 'Links' },
      { key: 'art_link', label: 'Link da arte', type: 'url', section: 'Links' },
      { key: 'published_link', label: 'Link publicado', type: 'url', section: 'Links' },
      { key: 'notes', label: 'Observações', type: 'textarea', colSpan: 2, section: 'Links' },
    ],
  },
  parcerias: {
    slug: 'parcerias',
    table: 'partnerships',
    title: 'Parcerias',
    description: 'Pipeline de influenciadores e parceiros de marca',
    icon: 'Handshake',
    defaultSort: { key: 'created_at', direction: 'desc' },
    searchableKeys: ['partner_name', 'partner_type', 'contact'],
    primaryLabelKey: 'partner_name',
    fields: [
      { key: 'partner_name', label: 'Nome do parceiro', type: 'text', required: true, showInTable: true, section: 'Dados do parceiro' },
      { key: 'partner_type', label: 'Tipo de parceiro', type: 'text', showInTable: true, section: 'Dados do parceiro' },
      { key: 'contact', label: 'Contato', type: 'text', section: 'Dados do parceiro' },
      { key: 'social_network', label: 'Rede social', type: 'text', showInTable: true, section: 'Dados do parceiro' },
      { key: 'followers_reach', label: 'Alcance/seguidores', type: 'number', section: 'Dados do parceiro' },
      { key: 'counterpart', label: 'Contrapartida', type: 'textarea', colSpan: 2, section: 'Negociação' },
      { key: 'status', label: 'Status', type: 'select', options: STATUS_PARCERIA, required: true, showInTable: true, section: 'Negociação' },
      { key: 'start_date', label: 'Data de início', type: 'date', section: 'Negociação' },
      { key: 'end_date', label: 'Data de fim', type: 'date', section: 'Negociação' },
      { key: 'estimated_cost', label: 'Custo estimado', type: 'currency', section: 'Negociação' },
      { key: 'responsible', label: 'Responsável', type: 'text', section: 'Negociação' },
      { key: 'profile_link', label: 'Link do perfil', type: 'url', section: 'Links' },
      { key: 'delivery_link', label: 'Link da entrega', type: 'url', section: 'Links' },
      { key: 'generated_result', label: 'Resultado gerado', type: 'textarea', colSpan: 2, section: 'Resultado e avaliação' },
      { key: 'rating_communication', label: 'Avaliação: comunicação', type: 'rating', section: 'Resultado e avaliação' },
      { key: 'rating_delivery', label: 'Avaliação: qualidade da entrega', type: 'rating', section: 'Resultado e avaliação' },
      { key: 'rating_result', label: 'Avaliação: resultado', type: 'rating', section: 'Resultado e avaliação' },
      { key: 'should_renew', label: 'Vale renovar?', type: 'boolean', showInTable: true, section: 'Resultado e avaliação' },
      { key: 'notes', label: 'Observações', type: 'textarea', colSpan: 2, section: 'Resultado e avaliação' },
    ],
  },
  campanhas: {
    slug: 'campanhas',
    table: 'campaigns',
    title: 'Campanhas',
    description: 'Briefing, meta x realizado e aprendizados de cada campanha',
    icon: 'Megaphone',
    defaultSort: { key: 'start_date', direction: 'desc' },
    searchableKeys: ['name', 'objective', 'description'],
    primaryLabelKey: 'name',
    fields: [
      { key: 'name', label: 'Nome da campanha', type: 'text', required: true, showInTable: true, section: 'Briefing' },
      { key: 'category', label: 'Categoria', type: 'select', options: CATEGORIAS_CAMPANHA, showInTable: true, section: 'Briefing' },
      { key: 'objective', label: 'Objetivo', type: 'text', colSpan: 2, section: 'Briefing' },
      { key: 'description', label: 'Descrição', type: 'textarea', colSpan: 2, section: 'Briefing' },
      { key: 'start_date', label: 'Data de início', type: 'date', showInTable: true, section: 'Briefing' },
      { key: 'end_date', label: 'Data final', type: 'date', section: 'Briefing' },
      { key: 'target_audience', label: 'Público-alvo', type: 'text', section: 'Briefing' },
      { key: 'channel', label: 'Canal', type: 'text', section: 'Briefing' },
      { key: 'goal', label: 'Meta (antes da campanha)', type: 'text', colSpan: 2, section: 'Meta x realizado' },
      { key: 'reach', label: 'Alcance', type: 'number', showInTable: true, section: 'Meta x realizado' },
      { key: 'cost', label: 'Custo', type: 'currency', showInTable: true, section: 'Meta x realizado' },
      { key: 'return_description', label: 'Retorno', type: 'textarea', colSpan: 2, section: 'Meta x realizado' },
      { key: 'status', label: 'Status', type: 'select', options: STATUS_CAMPANHA, required: true, showInTable: true, section: 'Resultado' },
      { key: 'responsible', label: 'Responsável', type: 'text', section: 'Resultado' },
      { key: 'result', label: 'Resultado', type: 'textarea', colSpan: 2, section: 'Resultado' },
      { key: 'learnings', label: 'Aprendizados', type: 'textarea', colSpan: 2, section: 'Resultado' },
      { key: 'next_steps', label: 'Próximos passos', type: 'textarea', colSpan: 2, section: 'Resultado' },
    ],
  },
  calendario: {
    slug: 'calendario',
    table: 'marketing_calendar',
    title: 'Calendário 2026',
    description: 'Datas comemorativas e oportunidades de marketing',
    icon: 'CalendarDays',
    defaultSort: { key: 'date', direction: 'asc' },
    searchableKeys: ['title', 'opportunity', 'campaign_idea'],
    primaryLabelKey: 'title',
    fields: [
      { key: 'date', label: 'Data', type: 'date', required: true, showInTable: true, section: 'Data e evento' },
      { key: 'title', label: 'Título', type: 'text', required: true, showInTable: true, section: 'Data e evento' },
      { key: 'type', label: 'Tipo', type: 'select', options: [
        { value: 'feriado', label: 'Feriado' },
        { value: 'data_comemorativa', label: 'Data comemorativa' },
        { value: 'evento', label: 'Evento' },
        { value: 'campanha', label: 'Campanha planejada' },
        { value: 'lembrete', label: 'Lembrete' },
      ], showInTable: true, section: 'Data e evento' },
      { key: 'opportunity', label: 'Oportunidade de marketing', type: 'textarea', colSpan: 2, showInTable: true, section: 'Oportunidade' },
      { key: 'campaign_idea', label: 'Ideia de campanha', type: 'textarea', colSpan: 2, section: 'Oportunidade' },
      { key: 'status', label: 'Status', type: 'select', options: [
        { value: 'sugerido', label: 'Sugerido' },
        { value: 'planejado', label: 'Planejado' },
        { value: 'em_producao', label: 'Em produção' },
        { value: 'concluido', label: 'Concluído' },
      ], showInTable: true, section: 'Oportunidade' },
      { key: 'description', label: 'Observações', type: 'textarea', colSpan: 2, section: 'Oportunidade' },
    ],
  },
  'plano-de-acao': {
    slug: 'plano-de-acao',
    table: 'action_plan',
    title: 'Plano de Ação (5W2H)',
    description: 'O quê, por quê, onde, quando, quem, como e quanto',
    icon: 'ListChecks',
    defaultSort: { key: 'deadline', direction: 'asc' },
    searchableKeys: ['what', 'who', 'why'],
    primaryLabelKey: 'what',
    fields: [
      { key: 'what', label: 'O quê?', type: 'text', required: true, showInTable: true, section: 'O quê e por quê' },
      { key: 'why', label: 'Por quê?', type: 'textarea', colSpan: 2, section: 'O quê e por quê' },
      { key: 'where_', label: 'Onde?', type: 'text', section: 'Onde, quando e quem' },
      { key: 'when_date', label: 'Quando?', type: 'date', section: 'Onde, quando e quem' },
      { key: 'who', label: 'Quem?', type: 'text', showInTable: true, section: 'Onde, quando e quem' },
      { key: 'how', label: 'Como?', type: 'textarea', colSpan: 2, section: 'Como e quanto' },
      { key: 'how_much', label: 'Quanto?', type: 'currency', section: 'Como e quanto' },
      { key: 'priority', label: 'Prioridade', type: 'select', options: PRIORIDADES, required: true, showInTable: true, section: 'Como e quanto' },
      { key: 'status', label: 'Status', type: 'select', options: STATUS_ACAO, required: true, showInTable: true, section: 'Como e quanto' },
      { key: 'deadline', label: 'Prazo', type: 'date', showInTable: true, section: 'Como e quanto' },
      { key: 'expected_result', label: 'Resultado esperado', type: 'textarea', colSpan: 2, section: 'Resultados' },
      { key: 'final_result', label: 'Resultado final', type: 'textarea', colSpan: 2, section: 'Resultados' },
    ],
  },
};

export function getModule(slug: string): ModuleConfig {
  const mod = MODULES[slug];
  if (!mod) throw new Error(`Módulo desconhecido: ${slug}`);
  return mod;
}

export const MODULE_SLUGS = Object.keys(MODULES);
