import { Wheat, Croissant, Cookie, Coffee } from 'lucide-react';

// Só nos 4 cantos, de propósito — evita ícone "flutuando" sozinho no meio do conteúdo.
const ICONS = [
  { Icon: Wheat, top: '8%', left: '3%', size: 60, rotate: -16, opacity: 0.14 },
  { Icon: Coffee, top: '10%', left: '95%', size: 34, rotate: 8, opacity: 0.16 },
  { Icon: Cookie, top: '86%', left: '5%', size: 38, rotate: -8, opacity: 0.14 },
  { Icon: Croissant, top: '84%', left: '93%', size: 46, rotate: 12, opacity: 0.16 },
] as const;

/** Fundo decorativo com ícones reais de padaria, ancorados nos 4 cantos — assinatura visual
 * discreta da Pralís. Uso pontual em heros, nunca em áreas densas de leitura de dados. */
export default function BakeryPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      {ICONS.map(({ Icon, top, left, size, rotate, opacity }, i) => (
        <Icon
          key={i}
          size={size}
          strokeWidth={1.5}
          className="absolute"
          style={{
            top,
            left,
            transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
            color: 'var(--brand-primary)',
            opacity,
          }}
        />
      ))}
    </div>
  );
}
