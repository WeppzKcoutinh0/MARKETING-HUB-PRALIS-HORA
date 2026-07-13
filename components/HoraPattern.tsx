import { Clock, UtensilsCrossed, Soup, ChefHat } from 'lucide-react';

// Só nos 4 cantos, de propósito — evita ícone "flutuando" sozinho no meio do conteúdo.
// Espelha o BakeryPattern da Pralís, mas com a linguagem visual do restaurante & botequim.
const ICONS = [
  { Icon: Clock, top: '10%', left: '4%', size: 52, rotate: -12, opacity: 0.16 },
  { Icon: UtensilsCrossed, top: '12%', left: '95%', size: 32, rotate: 10, opacity: 0.18 },
  { Icon: ChefHat, top: '86%', left: '5%', size: 36, rotate: -8, opacity: 0.15 },
  { Icon: Soup, top: '84%', left: '93%', size: 42, rotate: 12, opacity: 0.17 },
] as const;

/** Fundo decorativo com ícones reais de restaurante, ancorados nos 4 cantos — assinatura
 * visual discreta da Hora Mineira. Uso pontual em heros, nunca em áreas densas de leitura. */
export default function HoraPattern() {
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
