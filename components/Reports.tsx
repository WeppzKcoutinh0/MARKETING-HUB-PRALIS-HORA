'use client';

import { useEffect, useState } from 'react';
import type { BrandTheme } from '@/lib/brands';
import { BRANDS } from '@/lib/brands';
import { getBrandId } from '@/lib/data';
import { getSupabaseClient } from '@/lib/supabase';
import { formatCurrency, formatNumber, monthLabel } from '@/lib/format';
import { diagnoseMonthGrowth } from '@/lib/calc';
import { ComparisonBarChart } from './Charts';
import { CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

export default function Reports({ brand }: { brand: BrandTheme }) {
  const [loading, setLoading] = useState(true);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [traffic, setTraffic] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [partnerships, setPartnerships] = useState<any[]>([]);
  const [otherMonthly, setOtherMonthly] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const otherBrand = brand.slug === 'pralis' ? BRANDS.hora : BRANDS.pralis;

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = getSupabaseClient();
        const brandId = await getBrandId(brand.slug);
        const otherBrandId = await getBrandId(otherBrand.slug);
        const [m, t, c, p, om] = await Promise.all([
          supabase.from('monthly_analysis').select('*').eq('brand_id', brandId).order('month'),
          supabase.from('paid_traffic').select('*').eq('brand_id', brandId),
          supabase.from('campaigns').select('*').eq('brand_id', brandId),
          supabase.from('partnerships').select('*').eq('brand_id', brandId),
          supabase.from('monthly_analysis').select('*').eq('brand_id', otherBrandId).order('month'),
        ]);
        setMonthly(m.data ?? []);
        setTraffic(t.data ?? []);
        setCampaigns(c.data ?? []);
        setPartnerships(p.data ?? []);
        setOtherMonthly(om.data ?? []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [brand.slug, otherBrand.slug]);

  if (loading) return <div className="p-12 text-center text-brand-textMuted text-sm">Gerando relatórios...</div>;
  if (error) return <div className="p-6 rounded-brand bg-brand-danger/10 text-brand-danger text-sm">{error}</div>;

  const totalInvestment = sum(traffic, 'amount_spent');
  const totalFollowers = sum(monthly, 'followers_gained');
  const totalReach = sum(monthly, 'reached_accounts');
  const lastTwo = monthly.slice(-2);
  const growthDiagnosis =
    lastTwo.length === 2 ? diagnoseMonthGrowth(lastTwo[1]?.total_views, lastTwo[0]?.total_views) : 'Aguardando mais meses de dados';

  const bestPartners = [...partnerships].filter((p) => p.should_renew).slice(0, 5);
  const campaignsToRepeat = [...campaigns].filter((c) => (c.reach ?? 0) > 0).sort((a, b) => (b.reach ?? 0) - (a.reach ?? 0)).slice(0, 3);

  const comparisonData = [
    { label: 'Investimento (R$)', [brand.name]: totalInvestment, [otherBrand.name]: sum(traffic, 'amount_spent') },
  ];

  const comparisonFollowers = [
    { label: 'Seguidores ganhos', [brand.name]: totalFollowers, [otherBrand.name]: sum(otherMonthly, 'followers_gained') },
  ];

  const positives: string[] = [];
  const attentionPoints: string[] = [];
  const suggestions: string[] = [];

  if ((lastTwo[1]?.growth_percentage ?? 0) > 0) positives.push('O crescimento de seguidores está positivo no último mês registrado.');
  if (totalReach > 0) positives.push(`Alcance acumulado de ${formatNumber(totalReach)} contas no período analisado.`);
  if (campaignsToRepeat.length > 0) positives.push(`${campaignsToRepeat.length} campanha(s) com bom alcance, candidatas a repetição.`);

  const avgCostPerFollower = avg(traffic.filter((t) => t.cost_per_follower).map((t) => t.cost_per_follower));
  if (avgCostPerFollower && avgCostPerFollower > 5) attentionPoints.push('Custo médio por seguidor está acima de R$ 5 — vale revisar segmentação dos anúncios.');
  if (monthly.some((m) => !m.diagnosis)) attentionPoints.push('Alguns meses ainda não têm diagnóstico preenchido na Análise Mensal.');
  if (partnerships.filter((p) => p.status === 'ativo').length === 0) attentionPoints.push('Nenhuma parceria ativa no momento.');

  suggestions.push('Priorize replicar o formato dos conteúdos com melhor custo-benefício identificados no Tráfego Pago.');
  suggestions.push('Use o Calendário 2026 para planejar campanhas com 2-3 semanas de antecedência das datas comemorativas.');
  if (bestPartners.length) suggestions.push(`Considere renovar contrato com: ${bestPartners.map((p) => p.partner_name).join(', ')}.`);

  return (
    <div className="space-y-8">
      <section className="rounded-brand border border-brand-border bg-brand-surface p-6 shadow-card">
        <h3 className="font-heading font-semibold text-lg text-brand-text mb-1">Resumo geral</h3>
        <p className="text-sm text-brand-textMuted mb-4">Consolidado de {brand.name} com base nos dados cadastrados na plataforma</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <Metric label="Investimento total" value={formatCurrency(totalInvestment)} />
          <Metric label="Seguidores ganhos" value={formatNumber(totalFollowers)} />
          <Metric label="Contas alcançadas" value={formatNumber(totalReach)} />
          <Metric label="Diagnóstico" value={growthDiagnosis} small />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <InsightCard icon={CheckCircle2} color="var(--brand-success)" title="Pontos positivos" items={positives} empty="Sem destaques ainda — cadastre mais dados mensais." />
        <InsightCard icon={AlertTriangle} color="var(--brand-warning)" title="Pontos de atenção" items={attentionPoints} empty="Nenhum ponto de atenção identificado." />
        <InsightCard icon={Lightbulb} color="var(--brand-primary)" title="Sugestões de melhoria" items={suggestions} empty="—" />
      </div>

      <section className="rounded-brand border border-brand-border bg-brand-surface p-6 shadow-card">
        <h3 className="font-heading font-semibold text-lg text-brand-text mb-1">Comparativo Pralís x Hora Mineira</h3>
        <p className="text-sm text-brand-textMuted mb-4">Investimento em tráfego pago e seguidores ganhos, lado a lado</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ComparisonBarChart data={comparisonData} bars={[{ key: brand.name, label: brand.name }, { key: otherBrand.name, label: otherBrand.name }]} colors={[brand.colors.primary, otherBrand.colors.primary]} />
          <ComparisonBarChart data={comparisonFollowers} bars={[{ key: brand.name, label: brand.name }, { key: otherBrand.name, label: otherBrand.name }]} colors={[brand.colors.secondary, otherBrand.colors.secondary]} />
        </div>
      </section>

      <section className="rounded-brand border border-brand-border bg-brand-surface p-6 shadow-card">
        <h3 className="font-heading font-semibold text-lg text-brand-text mb-3">Parceiros que merecem renovação</h3>
        {bestPartners.length === 0 ? (
          <p className="text-sm text-brand-textMuted">Nenhum parceiro marcado para renovação ainda.</p>
        ) : (
          <ul className="space-y-2">
            {bestPartners.map((p) => (
              <li key={p.id} className="flex items-center justify-between text-sm border-b border-brand-border pb-2 last:border-0">
                <span className="text-brand-text font-medium">{p.partner_name}</span>
                <span className="text-brand-textMuted">{p.social_network}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-brand-textMuted mb-1">{label}</p>
      <p className={`font-heading font-semibold text-brand-text ${small ? 'text-sm' : 'text-xl'}`}>{value}</p>
    </div>
  );
}

function InsightCard({
  icon: Icon,
  color,
  title,
  items,
  empty,
}: {
  icon: any;
  color: string;
  title: string;
  items: string[];
  empty: string;
}) {
  return (
    <div className="rounded-brand border border-brand-border bg-brand-surface p-5 shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} color={color} />
        <h4 className="font-heading font-semibold text-brand-text">{title}</h4>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-brand-textMuted">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li key={i} className="text-sm text-brand-text flex gap-2">
              <span style={{ color }}>•</span>
              {it}
            </li>
          ))}
        </ul>
      )}
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
