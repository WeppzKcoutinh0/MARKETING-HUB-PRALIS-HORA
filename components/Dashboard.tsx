'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Eye, DollarSign, UserPlus, TrendingUp, Target, Film,
  Percent, Users, Award, Video, Calendar as CalendarIcon,
} from 'lucide-react';
import type { BrandTheme } from '@/lib/brands';
import { getBrandId } from '@/lib/data';
import { getSupabaseClient } from '@/lib/supabase';
import { formatCurrency, formatNumber, formatPercent, monthLabel } from '@/lib/format';
import StatCard from './StatCard';
import { TrendLineChart, ComparisonBarChart, SimplePieChart } from './Charts';

export default function Dashboard({ brand }: { brand: BrandTheme }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [traffic, setTraffic] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);

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

  const totalOrganic = sum(monthly, 'reels_posts_views');
  const totalPaidViews = sum(traffic, 'paid_views');
  const totalInvestment = sum(traffic, 'amount_spent');
  const totalFollowers = sum(monthly, 'followers_gained');
  const avgCPF = avg(traffic.filter((t) => t.cost_per_follower).map((t) => t.cost_per_follower));
  const totalReach = sum(monthly, 'reached_accounts');
  const totalReels = sum(monthly, 'reels_quantity');
  const totalPosts = sum(monthly, 'posts_quantity');
  const lastGrowth = monthly.length ? monthly[monthly.length - 1]?.growth_percentage : null;

  const bestCampaign = [...campaigns].sort((a, b) => (b.reach ?? 0) - (a.reach ?? 0))[0];
  const bestMonth = [...monthly].sort((a, b) => (b.followers_gained ?? 0) - (a.followers_gained ?? 0))[0];
  const bestVideoRow = [...traffic].sort((a, b) => (b.paid_views ?? 0) - (a.paid_views ?? 0))[0];

  const monthlyChart = monthly.map((m) => ({
    label: monthLabel(m.month).slice(0, 3),
    'Visualizações totais': m.total_views ?? 0,
    'Seguidores ganhos': m.followers_gained ?? 0,
  }));

  const investmentByMonth = Object.values(
    traffic.reduce((acc: Record<string, any>, t) => {
      const key = t.month ?? 'N/A';
      acc[key] = acc[key] || { label: monthLabel(key).slice(0, 3), Investimento: 0 };
      acc[key].Investimento += Number(t.amount_spent ?? 0);
      return acc;
    }, {})
  );

  const organicVsPaid = [
    { label: 'Orgânico', value: totalOrganic },
    { label: 'Pago', value: totalPaidViews },
  ];

  const topContent = [...traffic]
    .filter((t) => t.paid_views || t.organic_views)
    .sort((a, b) => (b.followers_gained ?? 0) - (a.followers_gained ?? 0))
    .slice(0, 5);

  const isHora = brand.slug === 'hora';
  const heroBackground = isHora
    ? `radial-gradient(circle at 12% 10%, ${brand.colors.accent}55, transparent 55%), radial-gradient(circle at 90% 90%, ${brand.colors.secondary}30, transparent 50%), linear-gradient(150deg, ${brand.colors.surface}, ${brand.colors.bg})`
    : `radial-gradient(circle at 12% 15%, ${brand.colors.secondary}26, transparent 55%), radial-gradient(circle at 88% 85%, ${brand.colors.accent}1f, transparent 50%), linear-gradient(135deg, ${brand.colors.surface2}, ${brand.colors.bg})`;

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

  return (
    <div className="space-y-8">
      {/* Hero de identidade da marca */}
      <section
        className={`animate-fade-in relative overflow-hidden rounded-2xl border border-brand-border p-7 md:p-10 ${
          brand.slug === 'pralis' ? 'texture-petals' : 'texture-hora'
        }`}
        style={{ background: heroBackground }}
      >
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

      {/* Cards de indicadores */}
      <div>
        <SectionLabel>Visão geral</SectionLabel>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Visualizações totais" value={formatNumber(sum(monthly, 'total_views'))} icon={Eye} highlight />
          <StatCard label="Visualizações orgânicas" value={formatNumber(totalOrganic)} icon={Eye} />
          <StatCard label="Visualizações pagas" value={formatNumber(totalPaidViews)} icon={Eye} />
          <StatCard label="Investimento total" value={formatCurrency(totalInvestment)} icon={DollarSign} />
          <StatCard label="Custo médio por seguidor" value={formatCurrency(avgCPF)} icon={Target} />
          <StatCard label="Seguidores ganhos" value={formatNumber(totalFollowers)} icon={UserPlus} />
          <StatCard
            label="Crescimento (últ. mês)"
            value={formatPercent(lastGrowth)}
            icon={TrendingUp}
            trend={lastGrowth !== null ? { value: 'vs. mês anterior', positive: (lastGrowth ?? 0) >= 0 } : undefined}
          />
          <StatCard label="Contas alcançadas" value={formatNumber(totalReach)} icon={Users} />
          <StatCard label="Posts/Reels publicados" value={formatNumber(totalReels + totalPosts)} icon={Film} />
          <StatCard label="Melhor campanha" value={bestCampaign?.name ?? '—'} icon={Award} />
          <StatCard label="Melhor mês" value={bestMonth ? monthLabel(bestMonth.month) : '—'} icon={CalendarIcon} />
          <StatCard label="Melhor vídeo (visualização paga)" value={bestVideoRow ? formatNumber(bestVideoRow.paid_views) : '—'} icon={Video} />
        </div>
      </div>

      {/* Gráficos */}
      <div>
        <SectionLabel>Desempenho</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Visualizações e seguidores por mês">
            <TrendLineChart
              data={monthlyChart}
              lines={[
                { key: 'Visualizações totais', label: 'Visualizações totais' },
                { key: 'Seguidores ganhos', label: 'Seguidores ganhos' },
              ]}
              colors={brand.chartPalette}
            />
          </ChartCard>
          <ChartCard title="Investimento em tráfego pago por mês">
            <ComparisonBarChart data={investmentByMonth} bars={[{ key: 'Investimento', label: 'Investimento (R$)' }]} colors={brand.chartPalette} />
          </ChartCard>
          <ChartCard title="Orgânico x Pago (visualizações)">
            <SimplePieChart data={organicVsPaid} colors={brand.chartPalette} />
          </ChartCard>
          <ChartCard title="Ranking dos melhores conteúdos (por seguidores ganhos)">
            <ul className="divide-y divide-brand-border">
              {topContent.length === 0 && <li className="py-3 text-sm text-brand-textMuted">Sem dados suficientes ainda.</li>}
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-3">{children}</h2>;
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-brand-border bg-brand-surface p-5 md:p-6 shadow-card hover:shadow-cardHover transition-shadow">
      <h3 className="font-heading font-semibold text-brand-text mb-4 text-[15px]">{title}</h3>
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
