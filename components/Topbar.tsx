'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import type { BrandTheme } from '@/lib/brands';
import { MODULES } from '@/lib/modules';

const NAV_ORDER = ['', 'trafego-pago', 'analise-mensal', 'cronograma', 'parcerias', 'campanhas', 'calendario', 'plano-de-acao', 'relatorios'];

export default function Topbar({ brand }: { brand: BrandTheme }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const segment = pathname.split('/')[2] ?? '';
  const title = segment === '' ? 'Dashboard' : segment === 'relatorios' ? 'Relatórios' : MODULES[segment]?.title ?? '';
  const isHora = brand.slug === 'hora';

  return (
    <header className="sticky top-0 z-20 bg-brand-surface/90 backdrop-blur-md border-b border-brand-border">
      <div className="flex items-center justify-between px-4 md:px-8 h-16 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button className="md:hidden p-2 -ml-2 text-brand-textMuted" onClick={() => setOpen(!open)} aria-label="Abrir menu">
            {open ? <X size={22} /> : <Menu size={22} />}
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

      {open && (
        <nav className="md:hidden border-t border-brand-border px-4 py-3 flex flex-col gap-0.5 bg-brand-surface">
          {NAV_ORDER.map((s) => {
            const href = `/${brand.slug}${s ? `/${s}` : ''}`;
            const active = pathname === href;
            const label = s === '' ? 'Dashboard' : s === 'relatorios' ? 'Relatórios' : MODULES[s]?.title;
            return (
              <Link
                key={s}
                href={href}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium ${active ? 'text-white' : 'text-brand-text'}`}
                style={active ? { backgroundColor: brand.colors.primary } : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            );
          })}
          <button
            onClick={async () => {
              await fetch('/api/logout', { method: 'POST' });
              window.location.href = '/login';
            }}
            className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium text-brand-textMuted mt-1"
          >
            <LogOut size={15} />
            Sair
          </button>
        </nav>
      )}
    </header>
  );
}
