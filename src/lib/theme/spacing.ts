// Grille d'espacement Senior+ (multiples de 4px)
export const espacement = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const

// Rayons de bordure
export const arrondi = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  plein: 999,
} as const

// Cibles tactiles minimales (WCAG 2.5.5 — 44px, Senior+ cible 56px)
export const cibleTactile = {
  min: 44,
  confort: 56,
  large: 72,
} as const

export type Espacement = typeof espacement
export type Arrondi = typeof arrondi
