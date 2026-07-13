export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '0';
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function formatPercent(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '0%';
  return `${value.toFixed(digits).replace('.', ',')}%`;
}

export function formatDateBR(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(d);
}

export function formatDateTimeBR(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(d);
}

export function monthLabel(month: string | null | undefined): string {
  if (!month) return '—';
  const map: Record<string, string> = {
    JANEIRO: 'Janeiro', FEVEREIRO: 'Fevereiro', MARÇO: 'Março', ABRIL: 'Abril',
    MAIO: 'Maio', JUNHO: 'Junho', JULHO: 'Julho', AGOSTO: 'Agosto',
    SETEMBRO: 'Setembro', OUTUBRO: 'Outubro', NOVEMBRO: 'Novembro', DEZEMBRO: 'Dezembro',
  };
  return map[month.toUpperCase()] ?? month;
}

// Nomes de mês, independentes de ano — o ano é controlado pelo campo "year" de cada registro.
export const MONTHS = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
];
