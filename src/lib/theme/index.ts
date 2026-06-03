export { palette, couleurs } from './colors'
export type { Palette, Couleurs } from './colors'
export { typographie, familles, appliquerGrandTexte } from './typography'
export type { VarianteTypo } from './typography'
export { espacement, arrondi, cibleTactile } from './spacing'
export type { Espacement, Arrondi } from './spacing'
export { ombres } from './shadows'

import { couleurs } from './colors'
import { typographie } from './typography'
import { espacement, arrondi, ombres } from './spacing'
import { ombres as ombresFn } from './shadows'

export const theme = {
  couleurs,
  typographie,
  espacement,
  arrondi,
  ombres: ombresFn,
} as const

export type Theme = typeof theme
