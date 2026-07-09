import { notFound } from 'next/navigation';
import { BRAND_SLUGS, getBrand } from '@/lib/brands';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export function generateStaticParams() {
  return BRAND_SLUGS.map((brand) => ({ brand }));
}

export default function BrandLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { brand: string };
}) {
  if (!BRAND_SLUGS.includes(params.brand as any)) notFound();
  const brand = getBrand(params.brand);
  const c = brand.colors;

  const themeVars = {
    '--brand-bg': c.bg,
    '--brand-surface': c.surface,
    '--brand-surface-2': c.surface2,
    '--brand-primary': c.primary,
    '--brand-primary-dark': c.primaryDark,
    '--brand-secondary': c.secondary,
    '--brand-accent': c.accent,
    '--brand-text': c.text,
    '--brand-text-muted': c.textMuted,
    '--brand-border': c.border,
    '--brand-success': c.success,
    '--brand-warning': c.warning,
    '--brand-danger': c.danger,
    '--brand-radius': brand.radius,
    '--font-heading': brand.slug === 'pralis' ? 'var(--font-fraunces)' : 'var(--font-poppins)',
    '--font-body': brand.slug === 'pralis' ? 'var(--font-montserrat)' : 'var(--font-be-vietnam)',
    '--font-accent': brand.slug === 'pralis' ? 'var(--font-caveat)' : 'var(--font-poppins)',
  } as React.CSSProperties;

  return (
    <div
      style={themeVars}
      className={`min-h-screen bg-brand-bg text-brand-text font-body ${brand.slug === 'pralis' ? 'texture-kraft' : ''}`}
    >
      <div className="flex min-h-screen">
        <Sidebar brand={brand} />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar brand={brand} />
          <main className="flex-1 p-4 md:p-8 max-w-[1600px] w-full mx-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
