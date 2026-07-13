import type { LucideIcon } from 'lucide-react';
import type { BrandSlug } from '@/lib/brands';

const BADGE_BG: Record<string, string> = {
  primary: 'bg-brand-primary/12',
  secondary: 'bg-brand-secondary/12',
  accent: 'bg-brand-accent/12',
};
const ICON_COLOR: Record<string, string> = {
  primary: 'text-brand-primary',
  secondary: 'text-brand-secondary',
  accent: 'text-brand-accent',
};

/** Selo-pétala oficial da Pralís (do manual de marca). */
export const PRALIS_LEAF = (
  <g fill="currentColor" fillRule="evenodd">
    <path d="M97.34,88.33c-14,2.58-23.62,7.13-32.81,18.19-7.44,8.85-9.84,15.98-11.81,26.92-.87,4.79,1.53,6.27,6.34,5.65,14.66-1.48,25.59-9.96,33.03-18.19,5.69-6.64,10.5-17.33,11.59-26.92.66-5.04-1.75-6.51-6.34-5.65" />
    <path d="M.23,94.55c2.58,14,7.13,23.62,18.19,32.81,8.85,7.44,15.98,9.84,26.92,11.81,4.79.87,6.27-1.53,5.65-6.34-1.48-14.66-9.96-25.59-18.19-33.03-6.64-5.69-17.33-10.5-26.92-11.59-5.04-.66-6.51,1.75-5.65,6.34" />
  </g>
);

/** Versão simplificada do símbolo oficial da Hora Mineira (prato-relógio com garfo e faca
 * como ponteiros) — traçado geométrico leve pra uso como marca d'água/detalhe de assinatura,
 * não o arquivo oficial (esse fica em public/brands/hora/icon.png). */
export const HORA_MARK = (
  <g fill="none" stroke="currentColor" strokeLinecap="round">
    <circle cx="50" cy="58" r="30" strokeWidth="13" />
    <line x1="20" y1="78" x2="50" y2="58" strokeWidth="8" />
    <line x1="50" y1="58" x2="50" y2="18" strokeWidth="7" />
    <line x1="44" y1="24" x2="44" y2="6" strokeWidth="3" />
    <line x1="50" y1="24" x2="50" y2="6" strokeWidth="3" />
    <line x1="56" y1="24" x2="56" y2="6" strokeWidth="3" />
    <circle cx="50" cy="58" r="4.5" fill="currentColor" stroke="none" />
  </g>
);

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  highlight,
  wide,
  tone = 'primary',
  brand = 'pralis',
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  trend?: { value: string; positive: boolean };
  highlight?: boolean;
  /** Cartão horizontal de fechamento, ocupa a linha inteira — usado como último item de uma grade que não fecha redondo. */
  wide?: boolean;
  /** Varia a cor do selo do ícone nos cards normais, pra não ficar tudo monocromático. */
  tone?: 'primary' | 'secondary' | 'accent';
  /** Decide qual selo de marca d'água aparece no card líder (Pralís x Hora Mineira). */
  brand?: BrandSlug;
}) {
  if (wide) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-brand-border bg-brand-surface p-5 md:p-6 flex items-center gap-4 sm:col-span-2 lg:col-span-4 shadow-card transition-all duration-200 hover:shadow-cardHover">
        {Icon && (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${BADGE_BG[tone]}`}>
            <Icon size={20} className={ICON_COLOR[tone]} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-textMuted">{label}</p>
          <p className="font-heading text-xl font-bold text-brand-text truncate">{value}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all duration-200 hover:shadow-cardHover hover:-translate-y-0.5 ${
        highlight
          ? 'border-transparent text-white shadow-cardHover p-7 md:p-8 sm:col-span-2'
          : 'border-brand-border bg-brand-surface shadow-card p-5'
      }`}
      style={highlight ? { background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))' } : undefined}
    >
      {/* Selo em marca d'água — só no card líder, onde tem espaço pra ser um detalhe
          de verdade (nos cards pequenos ficava um risquinho quase invisível no canto). */}
      {highlight && brand === 'hora' && (
        <svg viewBox="0 0 100 100" aria-hidden className="pointer-events-none select-none absolute -right-3 -bottom-5 h-auto w-24 opacity-[0.16] text-white">
          {HORA_MARK}
        </svg>
      )}
      {highlight && brand !== 'hora' && (
        <svg viewBox="0 0 97.34 139.35" aria-hidden className="pointer-events-none select-none absolute -right-4 -bottom-6 h-auto w-28 opacity-[0.14] text-white">
          {PRALIS_LEAF}
        </svg>
      )}
      <div className="relative flex items-start justify-between gap-2">
        <p className={`font-semibold uppercase tracking-wide ${highlight ? 'text-sm text-white/75' : 'text-[11px] text-brand-textMuted'}`}>
          {label}
        </p>
        {Icon && (
          <div
            className={`rounded-full flex items-center justify-center shrink-0 ${
              highlight ? 'w-11 h-11 bg-white/15' : `w-8 h-8 ${BADGE_BG[tone]}`
            }`}
          >
            <Icon size={highlight ? 20 : 15} className={highlight ? 'text-white' : ICON_COLOR[tone]} />
          </div>
        )}
      </div>
      <p className={`relative font-heading font-bold ${highlight ? 'mt-4 text-4xl md:text-5xl text-white' : 'mt-3 text-2xl text-brand-text'}`}>
        {value}
      </p>
      {trend && (
        <p className={`relative mt-1.5 text-xs font-medium ${trend.positive ? 'text-brand-success' : 'text-brand-danger'} ${highlight ? '!text-white/90' : ''}`}>
          {trend.positive ? '▲' : '▼'} {trend.value}
        </p>
      )}
    </div>
  );
}
