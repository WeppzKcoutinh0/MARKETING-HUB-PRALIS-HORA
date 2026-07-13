import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Wheat, Croissant, Cookie, Clock, UtensilsCrossed, Soup } from 'lucide-react';
import { BRANDS, BRAND_SLUGS } from '@/lib/brands';
import LogoutLink from '@/components/LogoutLink';

export default function RootPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 md:py-20 relative" style={{ backgroundColor: '#FAF7F2' }}>
      <LogoutLink />
      <header className="text-center mb-14 md:mb-16 max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-5" style={{ color: '#8A7365' }}>
          Marketing Hub
        </p>
        <h1
          className="text-3xl md:text-4xl leading-snug"
          style={{ fontFamily: 'var(--font-fraunces)', color: '#3A2A22' }}
        >
          Selecione a marca para gerenciar campanhas, analytics e conteúdos integrados.
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {BRAND_SLUGS.map((slug) => (
          <BrandCard key={slug} brand={BRANDS[slug]} />
        ))}
      </div>
    </div>
  );
}

function BrandCard({ brand }: { brand: (typeof BRANDS)[keyof typeof BRANDS] }) {
  const isHora = brand.slug === 'hora';
  const description = isHora
    ? 'Hora do almoço... sempre a sua melhor hora!'
    : 'é provar e ser feliz';

  return (
    <Link
      href={`/${brand.slug}`}
      className={`group relative overflow-hidden rounded-3xl border p-10 md:p-14 flex flex-col min-h-[420px] md:min-h-[480px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
        isHora ? 'texture-hora' : 'texture-petals'
      }`}
      style={{
        borderColor: brand.colors.border,
        background: isHora
          ? `radial-gradient(circle at 85% 15%, ${brand.colors.secondary}35, transparent 55%), linear-gradient(155deg, ${brand.colors.accent}, ${brand.colors.bg})`
          : `radial-gradient(circle at 85% 15%, ${brand.colors.secondary}22, transparent 55%), linear-gradient(155deg, ${brand.colors.surface2}, ${brand.colors.bg})`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
      }}
    >
      {isHora ? (
        <>
          <Clock size={50} strokeWidth={1.5} className="absolute top-6 left-8 pointer-events-none" style={{ color: '#FDFDFD', opacity: 0.14, transform: 'rotate(-12deg)' }} />
          <UtensilsCrossed size={34} strokeWidth={1.5} className="absolute top-24 right-10 pointer-events-none" style={{ color: '#FDFDFD', opacity: 0.14, transform: 'rotate(10deg)' }} />
          <Soup size={30} strokeWidth={1.5} className="absolute bottom-24 left-10 pointer-events-none" style={{ color: '#FDFDFD', opacity: 0.13, transform: 'rotate(-8deg)' }} />
        </>
      ) : (
        <>
          <Wheat size={54} strokeWidth={1.5} className="absolute top-6 left-8 pointer-events-none" style={{ color: brand.colors.primary, opacity: 0.16, transform: 'rotate(-15deg)' }} />
          <Croissant size={38} strokeWidth={1.5} className="absolute top-24 right-10 pointer-events-none" style={{ color: brand.colors.secondary, opacity: 0.16, transform: 'rotate(12deg)' }} />
          <Cookie size={30} strokeWidth={1.5} className="absolute bottom-24 left-10 pointer-events-none" style={{ color: brand.colors.accent, opacity: 0.15, transform: 'rotate(-8deg)' }} />
        </>
      )}

      {/* Logo em marca d'água, centralizada embaixo — mesmo recurso que o próprio manual
          da Hora Mineira usa na capa (wordmark gigante e apagado atrás do texto) */}
      <Image
        src={brand.logo}
        alt=""
        width={isHora ? 340 : 420}
        height={isHora ? 340 : 236}
        aria-hidden
        className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 -bottom-8 object-contain"
        style={{
          opacity: isHora ? 0.16 : 0.14,
          filter: isHora ? 'invert(1) brightness(1.8)' : 'none',
        }}
      />

      <div className="relative flex items-center justify-end mb-10 md:mb-12">
        <ArrowRight
          size={20}
          className="opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
          style={{ color: isHora ? '#FDFDFD' : brand.colors.primary }}
        />
      </div>

      <div className="relative flex-1 flex flex-col justify-center">
        <p
          className="text-2xl md:text-3xl font-bold tracking-wide uppercase mb-4"
          style={{
            fontFamily: isHora ? 'var(--font-poppins)' : 'var(--font-fraunces)',
            color: isHora ? '#FDFDFD' : brand.colors.text,
          }}
        >
          {brand.name}
        </p>
        <p
          className="text-base md:text-lg leading-relaxed max-w-sm"
          style={{ color: isHora ? 'rgba(253,253,253,0.78)' : brand.colors.textMuted }}
        >
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mt-6">
          {brand.personality.slice(0, 4).map((p) => (
            <span
              key={p}
              className="text-[11px] font-medium px-3 py-1 rounded-full border capitalize"
              style={{
                borderColor: isHora ? 'rgba(253,253,253,0.25)' : brand.colors.border,
                color: isHora ? 'rgba(253,253,253,0.85)' : brand.colors.textMuted,
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      <div
        className="relative flex items-center gap-2 text-base font-semibold mt-10 pt-6 border-t"
        style={{
          color: isHora ? '#FDFDFD' : brand.colors.primary,
          borderColor: isHora ? 'rgba(253,253,253,0.15)' : brand.colors.border,
        }}
      >
        Entrar no Workspace
        <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
