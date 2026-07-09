// Configuração central de identidade visual das marcas.
// Cada marca tem sua paleta, tipografia e personalidade próprias — nunca misturadas.

export type BrandSlug = 'pralis' | 'hora';

export interface BrandTheme {
  slug: BrandSlug;
  name: string;
  fullName: string;
  tagline: string;
  logo: string;
  icon: string;
  personality: string[];
  colors: {
    bg: string;
    surface: string;
    surface2: string;
    primary: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
  };
  fontHeading: string;
  fontBody: string;
  fontAccent?: string; // fonte script/decorativa, uso esporádico (frases de destaque)
  radius: string;
  chartPalette: string[];
}

export const BRANDS: Record<BrandSlug, BrandTheme> = {
  pralis: {
    slug: 'pralis',
    name: 'Pralís',
    fullName: 'Pralís Padaria Artesanal',
    tagline: 'é provar e ser feliz',
    logo: '/brands/pralis/logo-oficial.png',
    icon: '/brands/pralis/icon.svg',
    personality: ['artesanal', 'acolhedora', 'premium', 'humana', 'alegre'],
    colors: {
      bg: '#FFFBF5',
      surface: '#FFFFFF',
      surface2: '#FCF3E3',
      primary: '#B8860B',
      primaryDark: '#8A6508',
      secondary: '#F37435',
      accent: '#5E3731',
      text: '#3A2A22',
      textMuted: '#8A7365',
      border: '#EEDFC4',
      success: '#6B8E4E',
      warning: '#F37435',
      danger: '#B14435',
    },
    fontHeading: "'Fraunces', Georgia, serif",
    fontBody: "'Montserrat', 'Segoe UI', sans-serif",
    fontAccent: "'Caveat', cursive",
    radius: '1rem',
    chartPalette: ['#B8860B', '#F37435', '#5E3731', '#D9A441', '#8A6508', '#C97B4A'],
  },
  hora: {
    slug: 'hora',
    name: 'Hora Mineira',
    fullName: 'Hora Mineira Restaurante',
    tagline: 'A melhor hora do seu dia',
    logo: '/brands/hora/logo.png',
    icon: '/brands/hora/icon.png',
    personality: ['acolhedora', 'bem-humorada', 'elegante', 'familiar', 'cheia de afeto', 'sonhadora'],
    colors: {
      bg: '#141414',
      surface: '#1D1B17',
      surface2: '#26221B',
      primary: '#D0641D',
      primaryDark: '#7C3916',
      secondary: '#688E42',
      accent: '#354D1D',
      text: '#FDFDFD',
      textMuted: '#969997',
      border: '#312C23',
      success: '#688E42',
      warning: '#D0641D',
      danger: '#B14435',
    },
    fontHeading: "'Poppins', sans-serif",
    fontBody: "'Be Vietnam Pro', sans-serif",
    radius: '0.75rem',
    chartPalette: ['#D0641D', '#688E42', '#354D1D', '#7C3916', '#969997', '#E08A4F'],
  },
};

export function getBrand(slug: string): BrandTheme {
  const brand = BRANDS[slug as BrandSlug];
  if (!brand) throw new Error(`Marca desconhecida: ${slug}`);
  return brand;
}

export const BRAND_SLUGS: BrandSlug[] = ['pralis', 'hora'];
