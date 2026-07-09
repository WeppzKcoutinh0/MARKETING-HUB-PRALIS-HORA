import type { LucideIcon } from 'lucide-react';

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  highlight,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  trend?: { value: string; positive: boolean };
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-card transition-all duration-200 hover:shadow-cardHover hover:-translate-y-0.5 ${
        highlight ? 'border-transparent text-white' : 'border-brand-border bg-brand-surface'
      }`}
      style={highlight ? { background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))' } : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={`text-[11px] font-semibold uppercase tracking-wide ${highlight ? 'text-white/75' : 'text-brand-textMuted'}`}>
          {label}
        </p>
        {Icon && (
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              highlight ? 'bg-white/15' : 'bg-brand-primary/10'
            }`}
          >
            <Icon size={15} className={highlight ? 'text-white' : 'text-brand-primary'} />
          </div>
        )}
      </div>
      <p className={`mt-3 font-heading text-2xl font-bold ${highlight ? 'text-white' : 'text-brand-text'}`}>
        {value}
      </p>
      {trend && (
        <p className={`mt-1.5 text-xs font-medium ${trend.positive ? 'text-brand-success' : 'text-brand-danger'} ${highlight ? '!text-white/90' : ''}`}>
          {trend.positive ? '▲' : '▼'} {trend.value}
        </p>
      )}
    </div>
  );
}
