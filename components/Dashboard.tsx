'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import {
  Eye, DollarSign, UserPlus, TrendingUp, Target, Film,
  Percent, Users, Award, Video, Calendar as CalendarIcon,
  Croissant, Clock, PieChart as PieChartIcon, Trophy,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { BrandTheme } from '@/lib/brands';
import { getBrandId } from '@/lib/data';
import { getSupabaseClient } from '@/lib/supabase';
import { formatCurrency, formatNumber, formatPercent, monthLabel, MONTHS } from '@/lib/format';
import StatCard, { HORA_MARK } from './StatCard';
import BakeryPattern from './BakeryPattern';
import HoraPattern from './HoraPattern';
import { TrendLineChart, ComparisonBarChart, SimplePieChart } from './Charts';

const CURRENT_YEAR = new Date().getFullYear();

export default function Dashboard({ brand }: { brand: BrandTheme }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [traffic, setTraffic] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const brandId = await getBrandId(brand.slug);
        const supabase = getSupabaseClient();
        const [m, t, c] = await Promise.all([
          supabase.from('monthly_analysis').select('*').eq('brand_id', brandId),
          supabase.from('paid_traffic').select('*').eq('brand_id', brandId),
          supabase.from('campaigns').select('*').eq('brand_id', brandId),
        ]);
        if (m.error) throw m.error;
        if (t.error) throw t.error;
        if (c.error) throw c.error;
        setMonthly(m.data ?? []);
        setTraffic(t.data ?? []);
        setCampaigns(c.data ?? []);
      } catch (e: any) {
        setError(e.message ?? 'Erro ao carregar dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, [brand.slug]);

  // Todos os anos com algum dado (Análise Mensal ou Tráfego Pago), sempre incluindo o ano
  // atual mesmo se ainda estiver vazio — assim dá pra selecionar "esse ano" e ver os 12
  // meses zerados esperando serem preenchidos, em vez de não aparecer na lista.
  const availableYears = useMemo(() => {
    const years = new Set<number>([CURRENT_YEAR]);
    monthly.forEach((m) => m.year && years.add(m.year));
    traffic.forEach((t) => t.date && years.add(new Date(t.date).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  }, [monthly, traffic]);

  const monthlyFiltered = useMemo(() => monthly.filter((m) => m.year === selectedYear), [monthly, selectedYear]);
  const trafficFiltered = useMemo(
    () => traffic.filter((t) => t.date && new Date(t.date).getFullYear() === selectedYear),
    [traffic, selectedYear]
  );
  const campaignsFiltered = useMemo(
    () => campaigns.filter((c) => !c.start_date || new Date(c.start_date).getFullYear() === selectedYear),
    [campaigns, selectedYear]
  );

  if (loading) return <div className="p-12 text-center text-brand-textMuted text-sm">Carregando dashboard...</div>;
  if (error)
    return (
      <div className="p-6 rounded-brand bg-brand-danger/10 text-brand-danger text-sm">
        {error}
        <p className="mt-2 text-brand-textMuted">
          Configure as variáveis do Supabase em <code>.env.local</code> e rode o script <code>sql/schema.sql</code> para ver os dados aqui.
        </p>
      </div>
    );

  const totalOrganic = sum(monthlyFiltered, 'reels_posts_views');
  const totalPaidViews = sum(trafficFiltered, 'paid_views');
  const totalInvestment = sum(trafficFiltered, 'amount_spent');
  const totalFollowers = sum(monthlyFiltered, 'followers_gained');
  const avgCPF = avg(trafficFiltered.filter((t) => t.cost_per_follower).map((t) => t.cost_per_follower));
  const totalReach = sum(monthlyFiltered, 'reached_accounts');
  const totalReels = sum(monthlyFiltered, 'reels_quantity');
  const totalPosts = sum(monthlyFiltered, 'posts_quantity');

  const monthlySortedByMonth = [...monthlyFiltered].sort(
    (a, b) => MONTHS.indexOf(String(a.month).toUpperCase()) - MONTHS.indexOf(String(b.month).toUpperCase())
  );
  const lastGrowth = monthlySortedByMonth.length
    ? monthlySortedByMonth[monthlySortedByMonth.length - 1]?.growth_percentage
    : null;

  const bestCampaign = [...campaignsFiltered].sort((a, b) => (b.reach ?? 0) - (a.reach ?? 0))[0];
  const bestMonth = [...monthlyFiltered].sort((a, b) => (b.followers_gained ?? 0) - (a.followers_gained ?? 0))[0];
  const bestVideoRow = [...trafficFiltered].sort((a, b) => (b.paid_views ?? 0) - (a.paid_views ?? 0))[0];

  // Sempre os 12 meses do ano selecionado, mesmo os sem nenhum registro ainda (valor 0) —
  // em vez de só os meses que por acaso têm dado, o que fazia o gráfico "parar" no meio do ano.
  const monthlyByName = new Map(monthlyFiltered.map((m) => [String(m.month).toUpperCase(), m]));
  const monthlyChart = MONTHS.map((monthName) => {
    const row = monthlyByName.get(monthName);
    return {
      label: monthLabel(monthName).slice(0, 3),
      'Visualizações totais': row?.total_views ?? 0,
      'Seguidores ganhos': row?.followers_gained ?? 0,
    };
  });

  const investmentByMonth = MONTHS.map((monthName) => {
    const total = trafficFiltered
      .filter((t) => MONTHS[new Date(t.date).getMonth()] === monthName)
      .reduce((acc, t) => acc + Number(t.amount_spent ?? 0), 0);
    return { label: monthLabel(monthName).slice(0, 3), Investimento: total };
  });

  const organicVsPaid = [
    { label: 'Orgânico', value: totalOrganic },
    { label: 'Pago', value: totalPaidViews },
  ];

  const topContent = [...trafficFiltered]
    .filter((t) => t.paid_views || t.organic_views)
    .sort((a, b) => (b.followers_gained ?? 0) - (a.followers_gained ?? 0))
    .slice(0, 5);

  const isHora = brand.slug === 'hora';
  const isPralis = brand.slug === 'pralis';
  const heroBackground = isHora
    ? `radial-gradient(circle at 12% 10%, ${brand.colors.accent}70, transparent 55%), radial-gradient(circle at 90% 90%, ${brand.colors.secondary}45, transparent 50%), linear-gradient(150deg, ${brand.colors.surface}, ${brand.colors.bg})`
    : `radial-gradient(circle at 15% 20%, ${brand.colors.secondary}28, transparent 55%), radial-gradient(circle at 85% 80%, ${brand.colors.primary}22, transparent 50%), linear-gradient(135deg, ${brand.colors.surface2}, ${brand.colors.bg})`;

  const personalityTags = (
    <div className={`flex flex-wrap gap-2 mt-5 ${isHora ? 'justify-center' : ''}`}>
      {brand.personality.map((p) => (
        <span
          key={p}
          className="text-[11px] font-medium px-3 py-1 rounded-full border capitalize text-brand-textMuted"
          style={{ borderColor: brand.colors.border }}
        >
          {p}
        </span>
      ))}
    </div>
  );

  const yearSelect = (
    <select
      value={selectedYear}
      onChange={(e) => setSelectedYear(Number(e.target.value))}
      aria-label="Ano exibido no dashboard"
      className="px-3 py-1.5 rounded-lg border border-brand-border bg-brand-surface text-xs font-semibold text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
    >
      {availableYears.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  );

  return (
    <div className="space-y-8">
      {/* Hero de identidade da marca */}
      <section
        className={`animate-fade-in relative overflow-hidden rounded-2xl border border-brand-border p-7 md:p-10 ${isHora ? 'texture-hora' : ''}`}
        style={{ background: heroBackground }}
      >
        {isPralis && <BakeryPattern />}
        {isHora && <HoraPattern />}
        {isHora ? (
          <div className="relative flex flex-col items-center text-center gap-1 py-2">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: brand.colors.primary }}>
              Painel de Marketing
            </p>
            <div className="rounded-2xl p-5 shadow-cardHover" style={{ backgroundColor: '#FDFDFD' }}>
              <Image src={brand.logo} alt={brand.fullName} width={168} height={168} className="object-contain" priority />
            </div>
            <p className="text-sm text-brand-textMuted leading-relaxed max-w-md mt-4">{brand.tagline}</p>
            {personalityTags}
          </div>
        ) : (
          <div className="relative flex flex-col md:flex-row md:items-center gap-7 justify-between">
            <div className="max-w-xl">
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: brand.colors.primary }}>
                Painel de Marketing
              </p>
              <h2 className="font-heading text-2xl md:text-[28px] font-bold text-brand-text mb-1 leading-tight">
                {brand.fullName}
              </h2>
              <p className="font-accent text-2xl leading-none mb-3" style={{ color: brand.colors.secondary }}>
                {brand.tagline}
              </p>
              {personalityTags}
            </div>
            <div className="shrink-0 self-center">
              <Image src={brand.logo} alt={brand.fullName} width={236} height={133} className="object-contain drop-shadow-sm" />
            </div>
          </div>
        )}
      </section>

      {/* Cards de indicadores — organizado em linhas fechadas de propósito (4 colunas cada),
          sem sobra: card líder (2 colunas) + 2 cards de destaque completam a 1ª linha,
          duas linhas de 4 cards normais, e um card horizontal de fechamento no final.
          Tudo escopado ao ano selecionado no seletor ao lado do título. */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <SectionLabel brand={brand}>Visão geral</SectionLabel>
          {yearSelect}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          <StatCard label="Visualizações totais" value={formatNumber(sum(monthlyFiltered, 'total_views'))} icon={Eye} highlight brand={brand.slug} />
          <StatCard label="Investimento total" value={formatCurrency(totalInvestment)} icon={DollarSign} />
          <StatCard label="Seguidores ganhos" value={formatNumber(totalFollowers)} icon={UserPlus} tone={isHora ? 'secondary' : 'primary'} />

          <StatCard label="Visualizações orgânicas" value={formatNumber(totalOrganic)} icon={Eye} />
          <StatCard label="Visualizações pagas" value={formatNumber(totalPaidViews)} icon={Eye} />
          <StatCard label="Custo médio por seguidor" value={formatCurrency(avgCPF)} icon={Target} />
          <StatCard
            label="Crescimento (últ. mês)"
            value={formatPercent(lastGrowth)}
            icon={TrendingUp}
            trend={lastGrowth !== null ? { value: 'vs. mês anterior', positive: (lastGrowth ?? 0) >= 0 } : undefined}
          />

          <StatCard label="Contas alcançadas" value={formatNumber(totalReach)} icon={Users} tone={isHora ? 'secondary' : 'primary'} />
          <StatCard label="Posts/Reels publicados" value={formatNumber(totalReels + totalPosts)} icon={Film} />
          <StatCard label="Melhor campanha" value={bestCampaign?.name ?? '—'} icon={Award} />
          <StatCard label="Melhor mês" value={bestMonth ? monthLabel(bestMonth.month) : '—'} icon={CalendarIcon} />

          <StatCard
            label="Melhor vídeo (visualização paga)"
            value={bestVideoRow ? formatNumber(bestVideoRow.paid_views) : '—'}
            icon={Video}
            wide
          />
        </div>
      </div>

      {/* Gráficos */}
      <div>
        <div className="mb-3">
          <SectionLabel brand={brand}>Desempenho — {selectedYear}</SectionLabel>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Visualizações e seguidores por mês" icon={TrendingUp}>
            <TrendLineChart
              data={monthlyChart}
              lines={[
                { key: 'Visualizações totais', label: 'Visualizações totais' },
                { key: 'Seguidores ganhos', label: 'Seguidores ganhos' },
              ]}
              colors={brand.chartPalette}
              emptyIcon={isPralis ? Croissant : isHora ? Clock : undefined}
            />
          </ChartCard>
          <ChartCard title="Investimento em tráfego pago por mês" icon={DollarSign}>
            <ComparisonBarChart
              data={investmentByMonth}
              bars={[{ key: 'Investimento', label: 'Investimento (R$)' }]}
              colors={brand.chartPalette}
              emptyIcon={isPralis ? Croissant : isHora ? Clock : undefined}
            />
          </ChartCard>
          <ChartCard title="Orgânico x Pago (visualizações)" icon={PieChartIcon}>
            <SimplePieChart data={organicVsPaid} colors={brand.chartPalette} emptyIcon={isPralis ? Croissant : isHora ? Clock : undefined} />
          </ChartCard>
          <ChartCard title="Ranking dos melhores conteúdos (por seguidores ganhos)" icon={Trophy}>
            <ul className="divide-y divide-brand-border">
              {topContent.length === 0 && (
                <li className="py-8 flex flex-col items-center gap-2 text-center text-brand-textMuted">
                  {isPralis && <Croissant size={26} strokeWidth={1.5} className="text-brand-primary/40" />}
                  {isHora && <Clock size={26} strokeWidth={1.5} className="text-brand-primary/40" />}
                  <span className="text-xs">Sem dados suficientes ainda.</span>
                </li>
              )}
              {topContent.map((t, i) => (
                <li key={t.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-text truncate">
                      {i + 1}. {t.description || t.type}
                    </p>
                    <p className="text-xs text-brand-textMuted">{monthLabel(t.month)}</p>
                  </div>
                  <span className="text-sm font-semibold text-brand-primary shrink-0">+{formatNumber(t.followers_gained)} seg.</span>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children, brand }: { children: React.ReactNode; brand: BrandTheme }) {
  return (
    <h2 className="flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-wider text-brand-textMuted">
      {brand.slug === 'pralis' && (
        <svg viewBox="0 0 97.34 139.35" aria-hidden className="w-2.5 h-auto shrink-0" style={{ color: 'var(--brand-primary)' }}>
          <g fill="currentColor" fillRule="evenodd">
            <path d="M97.34,88.33c-14,2.58-23.62,7.13-32.81,18.19-7.44,8.85-9.84,15.98-11.81,26.92-.87,4.79,1.53,6.27,6.34,5.65,14.66-1.48,25.59-9.96,33.03-18.19,5.69-6.64,10.5-17.33,11.59-26.92.66-5.04-1.75-6.51-6.34-5.65" />
            <path d="M.23,94.55c2.58,14,7.13,23.62,18.19,32.81,8.85,7.44,15.98,9.84,26.92,11.81,4.79.87,6.27-1.53,5.65-6.34-1.48-14.66-9.96-25.59-18.19-33.03-6.64-5.69-17.33-10.5-26.92-11.59-5.04-.66-6.51,1.75-5.65,6.34" />
          </g>
        </svg>
      )}
      {brand.slug === 'hora' && (
        <svg viewBox="0 0 100 100" aria-hidden className="w-3 h-auto shrink-0" style={{ color: 'var(--brand-primary)' }}>
          {HORA_MARK}
        </svg>
      )}
      {children}
    </h2>
  );
}

function ChartCard({ title, icon: Icon, children }: { title: string; icon?: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-border bg-brand-surface p-5 md:p-6 shadow-card hover:shadow-cardHover transition-shadow">
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-secondary))' }}
      />
      <div className="flex items-center gap-2.5 mb-4">
        {Icon && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-brand-primary/12">
            <Icon size={15} className="text-brand-primary" />
          </div>
        )}
        <h3 className="font-heading font-semibold text-brand-text text-[15px]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function sum(rows: any[], key: string): number {
  return rows.reduce((acc, r) => acc + (Number(r[key]) || 0), 0);
}

function avg(values: number[]): number | null {
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}
