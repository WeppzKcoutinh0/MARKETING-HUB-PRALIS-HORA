'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, TrendingUp, BarChart3, Calendar, Handshake,
  Megaphone, CalendarDays, ListChecks, FileText, ArrowLeftRight,
} from 'lucide-react';
import type { BrandTheme } from '@/lib/brands';
import { BRANDS } from '@/lib/brands';

const NAV = [
  { href: '', label: 'Dashboard', icon: LayoutDashboard },
  { href: 'trafego-pago', label: 'Tráfego Pago', icon: TrendingUp },
  { href: 'analise-mensal', label: 'Análise Mensal', icon: BarChart3 },
  { href: 'cronograma', label: 'Cronograma', icon: Calendar },
  { href: 'parcerias', label: 'Parcerias', icon: Handshake },
  { href: 'campanhas', label: 'Campanhas', icon: Megaphone },
  { href: 'calendario', label: 'Calendário 2026', icon: CalendarDays },
  { href: 'plano-de-acao', label: 'Plano de Ação', icon: ListChecks },
  { href: 'relatorios', label: 'Relatórios', icon: FileText },
];

export default function Sidebar({ brand }: { brand: BrandTheme }) {
  const pathname = usePathname();
  const otherBrand = brand.slug === 'pralis' ? BRANDS.hora : BRANDS.pralis;
  const isHora = brand.slug === 'hora';

  return (
    <aside className="hidden md:flex md:flex-col w-72 shrink-0 border-r border-brand-border bg-brand-surface min-h-screen sticky top-0">
      <div className="relative px-6 pt-8 pb-6 border-b border-brand-border overflow-hidden">
        <div
          className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ backgroundColor: brand.colors.primary }}
        />
        <div className="relative">
          {isHora ? (
            <div className="inline-flex rounded-2xl p-4 shadow-card" style={{ backgroundColor: '#FDFDFD' }}>
              <Image src={brand.logo} alt={brand.fullName} width={94} height={94} className="object-contain" priority />
            </div>
          ) : (
            <Image src={brand.logo} alt={brand.fullName} width={188} height={106} className="object-contain" priority />
          )}
          <p className="mt-4 text-xs leading-relaxed text-brand-textMuted max-w-[210px]">{brand.tagline}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV.map((item) => {
          const href = `/${brand.slug}${item.href ? `/${item.href}` : ''}`;
          const active = pathname === href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active ? 'text-white' : 'text-brand-textMuted hover:bg-brand-surface2 hover:text-brand-text'
              }`}
              style={
                active
                  ? { backgroundColor: brand.colors.primary, boxShadow: `0 8px 18px -6px ${brand.colors.primary}80` }
                  : undefined
              }
            >
              <Icon size={18} className={active ? 'opacity-95' : 'opacity-70'} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-brand-border">
        <Link
          href={`/${otherBrand.slug}`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-brand-textMuted hover:bg-brand-surface2 hover:text-brand-text transition-colors group"
        >
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 text-white"
            style={{ backgroundColor: otherBrand.colors.primary }}
          >
            {otherBrand.name.charAt(0)}
          </span>
          <span className="flex-1 min-w-0 truncate">Ir para {otherBrand.name}</span>
          <ArrowLeftRight size={15} className="opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
        </Link>
      </div>
    </aside>
  );
}
