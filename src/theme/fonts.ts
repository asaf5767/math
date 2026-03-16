export const googleFontsUrl =
  'https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Heebo:wght@400;500;700;800&display=swap'

export const fontFamilies = {
  display: '"Amatic SC", "Heebo", cursive',
  body: '"Heebo", sans-serif',
} as const

export const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.375rem',
  '2xl': '1.75rem',
  '3xl': '2.25rem',
  hero: 'clamp(3rem, 8vw, 5rem)',
} as const

export const lineHeights = {
  tight: 1.1,
  snug: 1.3,
  normal: 1.6,
  relaxed: 1.8,
} as const
