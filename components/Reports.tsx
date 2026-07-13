'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { BrandTheme } from '@/lib/brands';
import { BRANDS } from '@/lib/brands';
import { getBrandId } from '@/lib/data';
import { getSupabaseClient } from '@/lib/supabase';
import { formatCurrency, formatNumber, formatDateBR, monthLabel, MONTHS } from '@/lib/format';
import { diagnoseMonthGrowth } from '@/lib/calc';
import { TrendLineChart, ComparisonBarChart, SimplePieChart } from './Charts';
import StatCard from './StatCard';
import BakeryPattern from './BakeryPattern';
import HoraPattern from './HoraPattern';
import {
  CheckCircle2, AlertTriangle, Lightbulb, Croissant, Clock, Download, Loader2,
  FileText, UserPlus, Eye, DollarSign, Megaphone, RefreshCw, ChevronDown, Check,
} from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

type ReportType = 'geral' | 'seguidores' | 'visualizacoes' | 'investimento' | 'campanhas';

const REPORT_TYPES: { key: ReportType; label: string; icon: any }[] = [
  { key: 'geral', label: 'Geral', icon: FileText },
  { key: 'seguidores', label: 'Seguidores', icon: UserPlus },
  { key: 'visualizacoes', label: 'Visualizações', icon: Eye },
  { key: 'investimento', label: 'Investimento', icon: DollarSign },
  { key: 'campanhas', label: 'Campanhas', icon: Megaphone },
];

export default function Reports({ brand }: { brand: BrandTheme }) {
  const [loading, setLoading] = useState(true);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [traffic, setTraffic] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [partnerships, setPartnerships] = useState<any[]>([]);
  const [otherMonthly, setOtherMonthly] = useState<any[]>([]);
  const [otherTraffic, setOtherTraffic] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [reportType, setReportType] = useState<ReportType>('geral');
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const otherBrand = brand.slug === 'pralis' ? BRANDS.hora : BRANDS.pralis;
  const isPralis = brand.slug === 'pralis';
  const isHora = brand.slug === 'hora';

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseClient();
      const brandId = await getBrandId(brand.slug);
      const otherBrandId = await getBrandId(otherBrand.slug);
      const [m, t, c, p, om, ot] = await Promise.all([
        supabase.from('monthly_analysis').select('*').eq('brand_id', brandId),
        supabase.from('paid_traffic').select('*').eq('brand_id', brandId),
        supabase.from('campaigns').select('*').eq('brand_id', brandId),
        supabase.from('partnerships').select('*').eq('brand_id', brandId),
        supabase.from('monthly_analysis').select('*').eq('brand_id', otherBrandId),
        supabase.from('paid_traffic').select('*').eq('brand_id', otherBrandId),
      ]);
      setMonthly(m.data ?? []);
      setTraffic(t.data ?? []);
      setCampaigns(c.data ?? []);
      setPartnerships(p.data ?? []);
      setOtherMonthly(om.data ?? []);
      setOtherTraffic(ot.data ?? []);
      setLastUpdated(new Date());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand.slug, otherBrand.slug]);

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
  const otherMonthlyFiltered = useMemo(() => otherMonthly.filter((m) => m.year === selectedYear), [otherMonthly, selectedYear]);
  const otherTrafficFiltered = useMemo(
    () => otherTraffic.filter((t) => t.date && new Date(t.date).getFullYear() === selectedYear),
    [otherTraffic, selectedYear]
  );

  async function handleExportPdf() {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const [{ default: html2canvas }, jspdfModule] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const JsPDF = jspdfModule.jsPDF;
      const target = reportRef.current;
      // Sem "foreignObjectRendering": esse modo captura com base na posição de rolagem
      // atual da página, então se o usuário tivesse rolado pra baixo antes de clicar em
      // "Exportar PDF", o PDF saía cortado (só o pedaço visível na tela) com um espaço em
      // branco enorme no lugar do resto do relatório. O modo padrão do html2canvas percorre
      // a árvore DOM e captura o elemento inteiro (altura real, `scrollHeight`), independente
      // de rolagem — por isso voltamos a rolar pro topo antes de capturar, por segurança extra.
      window.scrollTo(0, 0);
      const canvas = await html2canvas(target, {
        scale: 2,
        backgroundColor: brand.colors.bg,
        useCORS: true,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: target.scrollHeight,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new JsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      const reportLabel = REPORT_TYPES.find((r) => r.key === reportType)?.label ?? 'relatorio';
      pdf.save(`relatorio-${brand.slug}-${reportLabel.toLowerCase()}-${selectedYear}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Não foi possível gerar o PDF agora. Tente novamente.');
    } finally {
      setExporting(false);
    }
  }

  if (loading) return <div className="p-12 text-center text-brand-textMuted text-sm">Gerando relatórios...</div>;
  if (error) return <div className="p-6 rounded-brand bg-brand-danger/10 text-brand-danger text-sm">{error}</div>;

  const emptyIcon = isPralis ? Croissant : isHora ? Clock : undefined;

  return (
    <div className="space-y-6">
      {/* Barra de filtros — fora da área exportada em PDF */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <ReportTypeDropdown brand={brand} reportType={reportType} onChange={setReportType} />
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadData}
            title="Atualizar dados"
            className="w-9 h-9 rounded-xl border border-brand-border flex items-center justify-center text-brand-textMuted hover:text-brand-text hover:bg-brand-surface2 transition-colors shrink-0"
          >
            <RefreshCw size={15} />
          </button>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            aria-label="Ano do relatório"
            className="px-3 py-2 rounded-xl border border-brand-border bg-brand-surface text-xs font-semibold text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={handleExportPdf}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-card hover:shadow-cardHover transition-all duration-200 disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))` }}
          >
            {exporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            {exporting ? 'Gerando PDF...' : 'Exportar PDF'}
          </button>
        </div>
      </div>

      {/* Tudo dentro dessa div é o que vira o PDF */}
      <div ref={reportRef} className="space-y-6">
        {lastUpdated && (
          <p className="text-[11px] text-brand-textMuted">
            {REPORT_TYPES.find((r) => r.key === reportType)?.label} · {selectedYear} · Atualizado em{' '}
            {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(lastUpdated)}
          </p>
        )}

        {reportType === 'geral' && (
          <GeralReport
            brand={brand}
            otherBrand={otherBrand}
            isPralis={isPralis}
            isHora={isHora}
            selectedYear={selectedYear}
            monthlyFiltered={monthlyFiltered}
            trafficFiltered={trafficFiltered}
            campaignsFiltered={campaignsFiltered}
            partnerships={partnerships}
            otherMonthlyFiltered={otherMonthlyFiltered}
            otherTrafficFiltered={otherTrafficFiltered}
            emptyIcon={emptyIcon}
          />
        )}
        {reportType === 'seguidores' && (
          <SeguidoresReport
            brand={brand}
            selectedYear={selectedYear}
            monthlyFiltered={monthlyFiltered}
            trafficFiltered={trafficFiltered}
            emptyIcon={emptyIcon}
          />
        )}
        {reportType === 'visualizacoes' && (
          <VisualizacoesReport
            brand={brand}
            selectedYear={selectedYear}
            monthlyFiltered={monthlyFiltered}
            trafficFiltered={trafficFiltered}
            emptyIcon={emptyIcon}
          />
        )}
        {reportType === 'investimento' && (
          <InvestimentoReport
            brand={brand}
            selectedYear={selectedYear}
            trafficFiltered={trafficFiltered}
            emptyIcon={emptyIcon}
          />
        )}
        {reportType === 'campanhas' && (
          <CampanhasReport brand={brand} selectedYear={selectedYear} campaignsFiltered={campaignsFiltered} />
        )}
      </div>
    </div>
  );
}

// ---------- Relatório Geral ----------

function GeralReport({
  brand, otherBrand, isPralis, isHora, selectedYear,
  monthlyFiltered, trafficFiltered, campaignsFiltered, partnerships,
  otherMonthlyFiltered, otherTrafficFiltered, emptyIcon,
}: any) {
  const totalInvestment = sum(trafficFiltered, 'amount_spent');
  const totalFollowers = sum(monthlyFiltered, 'followers_gained');
  const totalReach = sum(monthlyFiltered, 'reached_accounts');
  const monthlySorted = [...monthlyFiltered].sort(
    (a, b) => MONTHS.indexOf(String(a.month).toUpperCase()) - MONTHS.indexOf(String(b.month).toUpperCase())
  );
  const lastTwo = monthlySorted.slice(-2);
  const growthDiagnosis =
    lastTwo.length === 2 ? diagnoseMonthGrowth(lastTwo[1]?.total_views, lastTwo[0]?.total_views) : 'Aguardando mais meses de dados';

  const bestPartners = [...partnerships].filter((p: any) => p.should_renew).slice(0, 5);
  const campaignsToRepeat = [...campaignsFiltered].filter((c: any) => (c.reach ?? 0) > 0).sort((a: any, b: any) => (b.reach ?? 0) - (a.reach ?? 0)).slice(0, 3);

  const comparisonData = [
    { label: 'Investimento (R$)', [brand.name]: totalInvestment, [otherBrand.name]: sum(otherTrafficFiltered, 'amount_spent') },
  ];
  const comparisonFollowers = [
    { label: 'Seguidores ganhos', [brand.name]: totalFollowers, [otherBrand.name]: sum(otherMonthlyFiltered, 'followers_gained') },
  ];

  const positives: string[] = [];
  const attentionPoints: string[] = [];
  const suggestions: string[] = [];

  if ((lastTwo[1]?.growth_percentage ?? 0) > 0) positives.push('O crescimento de seguidores está positivo no último mês registrado.');
  if (totalReach > 0) positives.push(`Alcance acumulado de ${formatNumber(totalReach)} contas no período analisado.`);
  if (campaignsToRepeat.length > 0) positives.push(`${campaignsToRepeat.length} campanha(s) com bom alcance, candidatas a repetição.`);

  const avgCostPerFollower = avg(trafficFiltered.filter((t: any) => t.cost_per_follower).map((t: any) => t.cost_per_follower));
  if (avgCostPerFollower && avgCostPerFollower > 5) attentionPoints.push('Custo médio por seguidor está acima de R$ 5 — vale revisar segmentação dos anúncios.');
  if (monthlyFiltered.some((m: any) => !m.diagnosis)) attentionPoints.push('Alguns meses ainda não têm diagnóstico preenchido na Análise Mensal.');
  if (partnerships.filter((p: any) => p.status === 'ativo').length === 0) attentionPoints.push('Nenhuma parceria ativa no momento.');

  suggestions.push('Priorize replicar o formato dos conteúdos com melhor custo-benefício identificados no Tráfego Pago.');
  suggestions.push('Use o Calendário 2026 para planejar campanhas com 2-3 semanas de antecedência das datas comemorativas.');
  if (bestPartners.length) suggestions.push(`Considere renovar contrato com: ${bestPartners.map((p: any) => p.partner_name).join(', ')}.`);

  return (
    <>
      <ReportHero brand={brand} isPralis={isPralis} isHora={isHora} title={`Resumo geral — ${brand.name}`} subtitle={`Com base nos dados de ${selectedYear} cadastrados na plataforma`}>
        <Metric label="Investimento total" value={formatCurrency(totalInvestment)} />
        <Metric label="Seguidores ganhos" value={formatNumber(totalFollowers)} />
        <Metric label="Contas alcançadas" value={formatNumber(totalReach)} />
        <Metric label="Diagnóstico" value={growthDiagnosis} small />
      </ReportHero>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <InsightCard icon={CheckCircle2} color="var(--brand-success)" title="Pontos positivos" items={positives} empty="Sem destaques ainda — cadastre mais dados mensais." />
        <InsightCard icon={AlertTriangle} color="var(--brand-warning)" title="Pontos de atenção" items={attentionPoints} empty="Nenhum ponto de atenção identificado." />
        <InsightCard icon={Lightbulb} color="var(--brand-primary)" title="Sugestões de melhoria" items={suggestions} empty="—" />
      </div>

      <section className="rounded-2xl border border-brand-border bg-brand-surface p-6 shadow-card">
        <h3 className="font-heading font-semibold text-lg text-brand-text mb-1">Comparativo Pralís x Hora Mineira</h3>
        <p className="text-sm text-brand-textMuted mb-4">Investimento em tráfego pago e seguidores ganhos, lado a lado — {selectedYear}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ComparisonBarChart
            data={comparisonData}
            bars={[{ key: brand.name, label: brand.name }, { key: otherBrand.name, label: otherBrand.name }]}
            colors={[brand.colors.primary, otherBrand.colors.primary]}
            emptyIcon={emptyIcon}
          />
          <ComparisonBarChart
            data={comparisonFollowers}
            bars={[{ key: brand.name, label: brand.name }, { key: otherBrand.name, label: otherBrand.name }]}
            colors={[brand.colors.secondary, otherBrand.colors.secondary]}
            emptyIcon={emptyIcon}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-brand-border bg-brand-surface p-6 shadow-card">
        <h3 className="font-heading font-semibold text-lg text-brand-text mb-3">Parceiros que merecem renovação</h3>
        {bestPartners.length === 0 ? (
          <p className="text-sm text-brand-textMuted">Nenhum parceiro marcado para renovação ainda.</p>
        ) : (
          <ul className="space-y-2">
            {bestPartners.map((p: any) => (
              <li key={p.id} className="flex items-center justify-between text-sm border-b border-brand-border pb-2 last:border-0">
                <span className="text-brand-text font-medium">{p.partner_name}</span>
                <span className="text-brand-textMuted">{p.social_network}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

// ---------- Relatório de Seguidores ----------

function SeguidoresReport({ brand, selectedYear, monthlyFiltered, trafficFiltered, emptyIcon }: any) {
  const totalFollowers = sum(monthlyFiltered, 'followers_gained');
  const monthlySorted = [...monthlyFiltered].sort(
    (a: any, b: any) => MONTHS.indexOf(String(a.month).toUpperCase()) - MONTHS.indexOf(String(b.month).toUpperCase())
  );
  const currentTotal = monthlySorted.length ? monthlySorted[monthlySorted.length - 1]?.total_followers ?? '—' : '—';
  const bestMonth = [...monthlyFiltered].sort((a: any, b: any) => (b.followers_gained ?? 0) - (a.followers_gained ?? 0))[0];

  const chartData = buildMonthlyChart(monthlyFiltered, [{ key: 'followers_gained', label: 'Seguidores ganhos' }]);
  const ranking = [...trafficFiltered].filter((t: any) => t.followers_gained).sort((a: any, b: any) => (b.followers_gained ?? 0) - (a.followers_gained ?? 0)).slice(0, 5);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        <StatCard label="Seguidores ganhos no ano" value={formatNumber(totalFollowers)} icon={UserPlus} highlight brand={brand.slug} />
        <StatCard label="Total de seguidores (último mês)" value={typeof currentTotal === 'number' ? formatNumber(currentTotal) : currentTotal} icon={UserPlus} />
        <StatCard label="Melhor mês" value={bestMonth ? monthLabel(bestMonth.month) : '—'} icon={FileText} />
        <StatCard label="Seguidores no melhor mês" value={bestMonth ? formatNumber(bestMonth.followers_gained) : '—'} icon={UserPlus} wide />
      </div>

      <section className="rounded-2xl border border-brand-border bg-brand-surface p-6 shadow-card">
        <h3 className="font-heading font-semibold text-lg text-brand-text mb-1">Seguidores ganhos por mês — {selectedYear}</h3>
        <p className="text-sm text-brand-textMuted mb-4">Todos os 12 meses do ano, mesmo os ainda sem registro</p>
        <TrendLineChart
          data={chartData}
          lines={[{ key: 'Seguidores ganhos', label: 'Seguidores ganhos' }]}
          colors={brand.chartPalette}
          emptyIcon={emptyIcon}
        />
      </section>

      <section className="rounded-2xl border border-brand-border bg-brand-surface p-6 shadow-card">
        <h3 className="font-heading font-semibold text-lg text-brand-text mb-3">Conteúdos que mais geraram seguidores</h3>
        {ranking.length === 0 ? (
          <p className="text-sm text-brand-textMuted">Sem dados suficientes ainda.</p>
        ) : (
          <ul className="divide-y divide-brand-border">
            {ranking.map((t: any, i: number) => (
              <li key={t.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-brand-text truncate">{i + 1}. {t.description || t.type}</p>
                  <p className="text-xs text-brand-textMuted">{formatDateBR(t.date)}</p>
                </div>
                <span className="text-sm font-semibold text-brand-primary shrink-0">+{formatNumber(t.followers_gained)} seg.</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

// ---------- Relatório de Visualizações ----------

function VisualizacoesReport({ brand, selectedYear, monthlyFiltered, trafficFiltered, emptyIcon }: any) {
  const totalViews = sum(monthlyFiltered, 'total_views');
  const totalOrganic = sum(monthlyFiltered, 'reels_posts_views');
  const totalPaidViews = sum(trafficFiltered, 'paid_views');

  const chartData = buildMonthlyChart(monthlyFiltered, [{ key: 'total_views', label: 'Visualizações totais' }]);
  const organicVsPaid = [
    { label: 'Orgânico', value: totalOrganic },
    { label: 'Pago', value: totalPaidViews },
  ];
  const ranking = [...trafficFiltered].filter((t: any) => t.paid_views).sort((a: any, b: any) => (b.paid_views ?? 0) - (a.paid_views ?? 0)).slice(0, 5);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        <StatCard label="Visualizações totais" value={formatNumber(totalViews)} icon={Eye} highlight brand={brand.slug} />
        <StatCard label="Visualizações orgânicas" value={formatNumber(totalOrganic)} icon={Eye} />
        <StatCard label="Visualizações pagas" value={formatNumber(totalPaidViews)} icon={Eye} />
        <StatCard label="% orgânico no total" value={totalViews ? `${((totalOrganic / totalViews) * 100).toFixed(1).replace('.', ',')}%` : '0%'} icon={FileText} wide />
      </div>

      <section className="rounded-2xl border border-brand-border bg-brand-surface p-6 shadow-card">
        <h3 className="font-heading font-semibold text-lg text-brand-text mb-1">Visualizações por mês — {selectedYear}</h3>
        <p className="text-sm text-brand-textMuted mb-4">Todos os 12 meses do ano, mesmo os ainda sem registro</p>
        <TrendLineChart
          data={chartData}
          lines={[{ key: 'Visualizações totais', label: 'Visualizações totais' }]}
          colors={brand.chartPalette}
          emptyIcon={emptyIcon}
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-brand-border bg-brand-surface p-6 shadow-card">
          <h3 className="font-heading font-semibold text-lg text-brand-text mb-1">Orgânico x Pago</h3>
          <p className="text-sm text-brand-textMuted mb-4">Proporção de visualizações no período</p>
          <SimplePieChart data={organicVsPaid} colors={brand.chartPalette} emptyIcon={emptyIcon} />
        </section>
        <section className="rounded-2xl border border-brand-border bg-brand-surface p-6 shadow-card">
          <h3 className="font-heading font-semibold text-lg text-brand-text mb-3">Melhores vídeos (visualização paga)</h3>
          {ranking.length === 0 ? (
            <p className="text-sm text-brand-textMuted">Sem dados suficientes ainda.</p>
          ) : (
            <ul className="divide-y divide-brand-border">
              {ranking.map((t: any, i: number) => (
                <li key={t.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-text truncate">{i + 1}. {t.description || t.type}</p>
                    <p className="text-xs text-brand-textMuted">{formatDateBR(t.date)}</p>
                  </div>
                  <span className="text-sm font-semibold text-brand-primary shrink-0">{formatNumber(t.paid_views)} views</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

// ---------- Relatório de Investimento ----------

function InvestimentoReport({ brand, selectedYear, trafficFiltered, emptyIcon }: any) {
  const totalInvestment = sum(trafficFiltered, 'amount_spent');
  const avgCPF = avg(trafficFiltered.filter((t: any) => t.cost_per_follower).map((t: any) => t.cost_per_follower));
  const avgCPI = avg(trafficFiltered.filter((t: any) => t.cost_per_interaction).map((t: any) => t.cost_per_interaction));
  const totalDays = sum(trafficFiltered, 'days');

  const investmentByMonth = MONTHS.map((monthName) => {
    const total = trafficFiltered
      .filter((t: any) => t.date && MONTHS[new Date(t.date).getMonth()] === monthName)
      .reduce((acc: number, t: any) => acc + Number(t.amount_spent ?? 0), 0);
    return { label: monthLabel(monthName).slice(0, 3), Investimento: total };
  });

  const rows = [...trafficFiltered].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        <StatCard label="Investimento total" value={formatCurrency(totalInvestment)} icon={DollarSign} highlight brand={brand.slug} />
        <StatCard label="Custo médio por seguidor" value={formatCurrency(avgCPF)} icon={UserPlus} />
        <StatCard label="Custo médio por interação" value={formatCurrency(avgCPI)} icon={FileText} />
        <StatCard label="Dias de veiculação" value={formatNumber(totalDays)} icon={FileText} wide />
      </div>

      <section className="rounded-2xl border border-brand-border bg-brand-surface p-6 shadow-card">
        <h3 className="font-heading font-semibold text-lg text-brand-text mb-1">Investimento por mês — {selectedYear}</h3>
        <p className="text-sm text-brand-textMuted mb-4">Valor investido em tráfego pago, mês a mês</p>
        <ComparisonBarChart
          data={investmentByMonth}
          bars={[{ key: 'Investimento', label: 'Investimento (R$)' }]}
          colors={brand.chartPalette}
          emptyIcon={emptyIcon}
        />
      </section>

      <section className="rounded-2xl border border-brand-border bg-brand-surface p-6 shadow-card overflow-x-auto">
        <h3 className="font-heading font-semibold text-lg text-brand-text mb-4">Detalhamento de tráfego pago</h3>
        {rows.length === 0 ? (
          <p className="text-sm text-brand-textMuted">Nenhum registro em {selectedYear}.</p>
        ) : (
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-brand-textMuted border-b border-brand-border">
                <th className="pb-2 pr-3 font-semibold">Data</th>
                <th className="pb-2 pr-3 font-semibold">Tipo</th>
                <th className="pb-2 pr-3 font-semibold">Investido</th>
                <th className="pb-2 pr-3 font-semibold">Custo/seguidor</th>
                <th className="pb-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t: any) => (
                <tr key={t.id} className="border-b border-brand-border last:border-0">
                  <td className="py-2.5 pr-3 text-brand-text whitespace-nowrap">{formatDateBR(t.date)}</td>
                  <td className="py-2.5 pr-3 text-brand-textMuted capitalize">{t.type}</td>
                  <td className="py-2.5 pr-3 text-brand-text font-medium">{formatCurrency(t.amount_spent)}</td>
                  <td className="py-2.5 pr-3 text-brand-textMuted">{t.cost_per_follower ? formatCurrency(t.cost_per_follower) : '—'}</td>
                  <td className="py-2.5 text-brand-textMuted capitalize">{t.status?.replace(/_/g, ' ') ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

// ---------- Relatório de Campanhas ----------

function CampanhasReport({ brand, selectedYear, campaignsFiltered }: any) {
  const activeCampaigns = campaignsFiltered.filter((c: any) => c.status === 'ativa').length;
  const totalReach = sum(campaignsFiltered, 'reach');
  const totalCost = sum(campaignsFiltered, 'cost');

  const rows = [...campaignsFiltered].sort((a: any, b: any) => new Date(b.start_date ?? 0).getTime() - new Date(a.start_date ?? 0).getTime());

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        <StatCard label="Campanhas no ano" value={formatNumber(campaignsFiltered.length)} icon={Megaphone} highlight brand={brand.slug} />
        <StatCard label="Campanhas ativas" value={formatNumber(activeCampaigns)} icon={Megaphone} />
        <StatCard label="Alcance total" value={formatNumber(totalReach)} icon={Eye} />
        <StatCard label="Custo total" value={formatCurrency(totalCost)} icon={DollarSign} wide />
      </div>

      <section className="rounded-2xl border border-brand-border bg-brand-surface p-6 shadow-card overflow-x-auto">
        <h3 className="font-heading font-semibold text-lg text-brand-text mb-4">Campanhas de {selectedYear}</h3>
        {rows.length === 0 ? (
          <p className="text-sm text-brand-textMuted">Nenhuma campanha registrada em {selectedYear}.</p>
        ) : (
          <table className="w-full text-sm min-w-[620px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-brand-textMuted border-b border-brand-border">
                <th className="pb-2 pr-3 font-semibold">Nome</th>
                <th className="pb-2 pr-3 font-semibold">Categoria</th>
                <th className="pb-2 pr-3 font-semibold">Status</th>
                <th className="pb-2 pr-3 font-semibold">Alcance</th>
                <th className="pb-2 pr-3 font-semibold">Custo</th>
                <th className="pb-2 font-semibold">Início</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c: any) => (
                <tr key={c.id} className="border-b border-brand-border last:border-0">
                  <td className="py-2.5 pr-3 text-brand-text font-medium">{c.name}</td>
                  <td className="py-2.5 pr-3 text-brand-textMuted capitalize">{c.category?.replace(/_/g, ' ') ?? '—'}</td>
                  <td className="py-2.5 pr-3 text-brand-textMuted capitalize">{c.status}</td>
                  <td className="py-2.5 pr-3 text-brand-text">{formatNumber(c.reach)}</td>
                  <td className="py-2.5 pr-3 text-brand-text">{formatCurrency(c.cost)}</td>
                  <td className="py-2.5 text-brand-textMuted whitespace-nowrap">{formatDateBR(c.start_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

// ---------- Componentes compartilhados ----------

function ReportTypeDropdown({
  brand,
  reportType,
  onChange,
}: {
  brand: BrandTheme;
  reportType: ReportType;
  onChange: (rt: ReportType) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = REPORT_TYPES.find((r) => r.key === reportType) ?? REPORT_TYPES[0];
  const CurrentIcon = current.icon;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative w-full sm:w-64">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-brand-border bg-brand-surface text-sm font-semibold text-brand-text shadow-card hover:shadow-cardHover transition-all duration-200"
      >
        <span
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${brand.colors.primary}1A`, color: brand.colors.primary }}
        >
          <CurrentIcon size={14} />
        </span>
        <span className="flex-1 text-left truncate">{current.label}</span>
        <ChevronDown size={15} className={`text-brand-textMuted transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-2 w-full rounded-xl border border-brand-border bg-brand-surface shadow-cardHover overflow-hidden py-1.5 animate-fade-in"
        >
          {REPORT_TYPES.map((rt) => {
            const Icon = rt.icon;
            const active = rt.key === reportType;
            return (
              <li key={rt.key} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(rt.key);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left transition-colors ${
                    active ? 'font-semibold' : 'text-brand-textMuted hover:bg-brand-surface2 hover:text-brand-text'
                  }`}
                  style={active ? { color: brand.colors.primary, backgroundColor: `${brand.colors.primary}12` } : undefined}
                >
                  <Icon size={15} className="shrink-0" />
                  <span className="flex-1 truncate">{rt.label}</span>
                  {active && <Check size={14} className="shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ReportHero({ brand, isPralis, isHora, title, subtitle, children }: any) {
  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-brand-border p-7 md:p-8 ${isHora ? 'texture-hora' : ''}`}
      style={{
        background: isPralis
          ? `radial-gradient(circle at 15% 15%, ${brand.colors.secondary}40, transparent 55%), radial-gradient(circle at 85% 85%, ${brand.colors.primary}30, transparent 50%), linear-gradient(135deg, ${brand.colors.surface2}, ${brand.colors.bg})`
          : `radial-gradient(circle at 10% 10%, ${brand.colors.accent}60, transparent 55%), radial-gradient(circle at 90% 90%, ${brand.colors.secondary}35, transparent 50%), linear-gradient(135deg, ${brand.colors.surface}, ${brand.colors.bg})`,
      }}
    >
      {isPralis && <BakeryPattern />}
      {isHora && <HoraPattern />}
      <p className="relative text-[11px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: brand.colors.primary }}>
        Relatório consolidado
      </p>
      <h3 className="relative font-heading font-bold text-xl md:text-2xl text-brand-text mb-1">{title}</h3>
      <p className="relative text-sm text-brand-textMuted mb-6">{subtitle}</p>
      <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">{children}</div>
    </section>
  );
}

function Metric({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-brand-textMuted mb-1.5">{label}</p>
      <p className={`font-heading font-bold text-brand-text ${small ? 'text-sm' : 'text-2xl'}`}>{value}</p>
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
    <div className="rounded-2xl border border-brand-border bg-brand-surface p-5 shadow-card">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}1A` }}>
          <Icon size={16} color={color} />
        </div>
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

function buildMonthlyChart(rows: any[], valueKeys: { key: string; label: string }[]) {
  const byName = new Map(rows.map((r) => [String(r.month).toUpperCase(), r]));
  return MONTHS.map((monthName) => {
    const row = byName.get(monthName);
    const out: Record<string, any> = { label: monthLabel(monthName).slice(0, 3) };
    valueKeys.forEach(({ key, label }) => {
      out[label] = row?.[key] ?? 0;
    });
    return out;
  });
}

function sum(rows: any[], key: string): number {
  return rows.reduce((acc, r) => acc + (Number(r[key]) || 0), 0);
}
function avg(values: number[]): number | null {
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}
