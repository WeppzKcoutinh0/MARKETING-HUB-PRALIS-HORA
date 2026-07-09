import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: 'var(--brand-bg)',
          surface: 'var(--brand-surface)',
          surface2: 'var(--brand-surface-2)',
          primary: 'var(--brand-primary)',
          primaryDark: 'var(--brand-primary-dark)',
          secondary: 'var(--brand-secondary)',
          accent: 'var(--brand-accent)',
          text: 'var(--brand-text)',
          textMuted: 'var(--brand-text-muted)',
          border: 'var(--brand-border)',
          success: 'var(--brand-success)',
          warning: 'var(--brand-warning)',
          danger: 'var(--brand-danger)',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        accent: ['var(--font-accent)'],
      },
      borderRadius: {
        brand: 'var(--brand-radius)',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.06)',
        cardHover: '0 8px 24px rgba(0,0,0,0.10)',
      },
      backgroundImage: {
        kraft: "url('/textures/kraft.svg')",
      },
    },
  },
  plugins: [],
};

export default config;
