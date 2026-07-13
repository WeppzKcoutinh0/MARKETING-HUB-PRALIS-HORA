'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, LogOut, LayoutDashboard, TrendingUp, BarChart3, Calendar,
  Handshake, Megaphone, CalendarDays, ListChecks, FileText, ArrowLeftRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { BrandTheme } from '@/lib/brands';
import { BRANDS } from '@/lib/brands';
import { MODULES } from '@/lib/modules';

const NAV_ICONS: Record<string, any> = {
  '': LayoutDashboard,
  'trafego-pago': TrendingUp,
  'analise-mensal': BarChart3,
  cronograma: Calendar,
  parcerias: Handshake,
  campanhas: Megaphone,
  calendario: CalendarDays,
  'plano-de-acao': ListChecks,
  relatorios: FileText,
};
const NAV_ORDER = Object.keys(NAV_ICONS);

export default function Topbar({ brand }: { brand: BrandTheme }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const segment = pathname.split('/')[2] ?? '';
  const title = segment === '' ? 'Dashboard' : segment === 'relatorios' ? 'Relatórios' : MODULES[segment]?.title ?? '';
  const isHora = brand.slug === 'hora';
  const otherBrand = brand.slug === 'pralis' ? BRANDS.hora : BRANDS.pralis;

  // Trava o scroll de fundo e fecha com Esc enquanto a gaveta lateral está aberta —
  // mesmo padrão já usado no Modal.tsx.
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('keydown', onEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [open]);

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  return (
    <>
      <header className="sticky top-0 z-20 bg-brand-surface/90 backdrop-blur-md border-b border-brand-border">
        <div className="flex items-center justify-between px-4 md:px-8 h-16 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button className="md:hidden p-2 -ml-2 text-brand-textMuted" onClick={() => setOpen(true)} aria-label="Abrir menu">
              <Menu size={22} />
            </button>
            <div
              className="md:hidden w-8 h-8 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1"
              style={{ backgroundColor: isHora ? '#FDFDFD' : 'transparent' }}
            >
              <Image src={brand.icon} alt={brand.name} width={26} height={26} className="object-contain" />
            </div>
            <h1 className="font-heading text-lg md:text-xl font-semibold text-brand-text truncate">{title}</h1>
          </div>
          <span
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full shrink-0"
            style={{ backgroundColor: `${brand.colors.primary}1A`, color: brand.colors.primary }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: brand.colors.primary }} />
            {brand.fullName}
          </span>
        </div>
      </header>

      {/* Backdrop + gaveta ficam FORA do <header> de propósito: o header tem
          backdrop-blur (backdrop-filter), e qualquer filtro/transform num ancestral cria
          um novo "containing block" pra descendentes com position:fixed — na prática, os
          elementos fixed ficavam presos dentro da faixa de 64px do header em vez de
          cobrirem a tela inteira, e a gaveta abria toda quebrada/colapsada. Não aninhar
          elementos fixed dentro do header de novo. */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-brand-surface border-r border-brand-border shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-4 h-16 border-b border-brand-border shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1"
              style={{ backgroundColor: isHora ? '#FDFDFD' : 'transparent' }}
            >
              <Image src={brand.icon} alt={brand.name} width={26} height={26} className="object-contain" />
            </div>
            <span className="font-heading font-semibold text-brand-text truncate">{brand.name}</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 -mr-1 rounded-full text-brand-textMuted hover:bg-brand-surface2 hover:text-brand-text transition-colors shrink-0"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0.5">
          {NAV_ORDER.map((s) => {
            const href = `/${brand.slug}${s ? `/${s}` : ''}`;
            const active = pathname === href;
            const label = s === '' ? 'Dashboard' : s === 'relatorios' ? 'Relatórios' : MODULES[s]?.title;
            const Icon = NAV_ICONS[s];
            return (
              <Link
                key={s}
                href={href}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                  active ? 'text-white' : 'text-brand-textMuted hover:bg-brand-surface2 hover:text-brand-text'
                }`}
                style={active ? { backgroundColor: brand.colors.primary } : undefined}
                onClick={() => setOpen(false)}
              >
                <Icon size={17} className={active ? 'opacity-95' : 'opacity-70'} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-brand-border shrink-0 space-y-1">
          <Link
            href={`/${otherBrand.slug}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm text-brand-textMuted hover:bg-brand-surface2 hover:text-brand-text transition-colors"
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 text-white"
              style={{ backgroundColor: otherBrand.colors.primary }}
            >
              {otherBrand.name.charAt(0)}
            </span>
            <span className="flex-1 min-w-0 truncate">Ir para {otherBrand.name}</span>
            <ArrowLeftRight size={14} className="opacity-60 shrink-0" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm text-brand-textMuted hover:bg-brand-danger/10 hover:text-brand-danger transition-colors"
          >
            <LogOut size={17} />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
