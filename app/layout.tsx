import type { Metadata } from 'next';
import { Fraunces, Montserrat, Caveat, Poppins, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';

// Fontes da Pralís — MadeType Dillan e TR Freehand 575 são pagas (sem os arquivos no
// projeto); Fraunces e Caveat são as substitutas gratuitas mais próximas visualmente.
// Montserrat é a fonte oficial de texto corrido/web e é usada exatamente como especificada.
// Ver PROJECT_BRAIN/02-identidade-pralis.md e PROJECT_BRAIN/05-decisoes.md.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['500', '600', '700'],
  style: ['normal'],
});
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', weight: ['400', '500', '600', '700'] });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat', weight: ['600', '700'] });

// Fontes da Hora Mineira
const poppins = Poppins({ subsets: ['latin'], variable: '--font-poppins', weight: ['400', '500', '600', '700'] });
const beVietnam = Be_Vietnam_Pro({ subsets: ['latin'], variable: '--font-be-vietnam', weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'Marketing Hub — Pralís & Hora Mineira',
  description: 'Plataforma de gestão de marketing das marcas Pralís e Hora Mineira',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${montserrat.variable} ${caveat.variable} ${poppins.variable} ${beVietnam.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
