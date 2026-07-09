// Cálculos automáticos usados nos módulos (substituem fórmulas manuais da planilha)

export function safeDiv(a: number, b: number): number | null {
  if (!b || Number.isNaN(a) || Number.isNaN(b)) return null;
  return a / b;
}

export function computePaidTrafficMetrics(input: {
  amount_spent: number;
  days: number;
  followers_gained: number;
  paid_profile_visits: number;
  paid_interactions: number;
}) {
  const daily_cost = input.days > 0 ? input.amount_spent / input.days : input.amount_spent;
  return {
    daily_cost: round2(daily_cost),
    cost_per_follower: round2(safeDiv(input.amount_spent, input.followers_gained)),
    cost_per_profile_visit: round2(safeDiv(input.amount_spent, input.paid_profile_visits)),
    cost_per_interaction: round2(safeDiv(input.amount_spent, input.paid_interactions)),
  };
}

export function round2(v: number | null): number | null {
  if (v === null || v === undefined || Number.isNaN(v)) return null;
  return Math.round(v * 100) / 100;
}

/** Diagnóstico automático de crescimento mês a mês, comparando com o mês anterior */
export function diagnoseMonthGrowth(current: number | null, previous: number | null): string {
  if (current === null || previous === null) return 'Dados insuficientes para comparação';
  if (previous === 0) return current > 0 ? 'O mês teve crescimento' : 'Sem variação';
  const diff = ((current - previous) / Math.abs(previous)) * 100;
  if (diff > 5) return `O mês teve crescimento (+${diff.toFixed(1).replace('.', ',')}%)`;
  if (diff < -5) return `O mês teve queda (${diff.toFixed(1).replace('.', ',')}%)`;
  return 'O mês ficou estável em relação ao anterior';
}

/** Classifica o desempenho de um anúncio de tráfego pago para ranking/alertas */
export function trafficPerformanceScore(row: {
  cost_per_follower: number | null;
  cost_per_interaction: number | null;
}): number {
  const cf = row.cost_per_follower ?? 999;
  const ci = row.cost_per_interaction ?? 999;
  // Score menor = melhor custo-benefício
  return cf * 0.6 + ci * 0.4;
}
