import { Platform } from 'react-native'

export const familles = {
  display: {
    regular: 'Fraunces-Regular',
    semiBold: 'Fraunces-SemiBold',
    bold: 'Fraunces-Bold',
  },
  body: {
    regular: 'Nunito-Regular',
    semiBold: 'Nunito-SemiBold',
    bold: 'Nunito-Bold',
  },
} as const

// Facteur d'agrandissement pour l'accessibilité (activé par le profil)
export const FACTEUR_GRAND_TEXTE = 1.2

export const typographie = {
  displayXl: {
    fontFamily: familles.display.bold,
    fontSize: 40,
    lineHeight: 50,
    letterSpacing: -0.5,
  },
  displayLg: {
    fontFamily: familles.display.semiBold,
    fontSize: 32,
    lineHeight: 42,
    letterSpacing: -0.3,
  },
  displayMd: {
    fontFamily: familles.display.regular,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.2,
  },
  titre: {
    fontFamily: familles.body.bold,
    fontSize: 22,
    lineHeight: 30,
  },
  sousTitre: {
    fontFamily: familles.body.semiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  corpsgrand: {
    fontFamily: familles.body.semiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  corps: {
    fontFamily: familles.body.regular,
    fontSize: 18,
    lineHeight: 26,
  },
  corpsPetit: {
    fontFamily: familles.body.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  etiquette: {
    fontFamily: familles.body.semiBold,
    fontSize: 18,
    lineHeight: 24,
  },
  etiquettePetite: {
    fontFamily: familles.body.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  legende: {
    fontFamily: familles.body.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  bouton: {
    fontFamily: familles.body.bold,
    fontSize: 18,
    lineHeight: 24,
  },
  boutonPetit: {
    fontFamily: familles.body.semiBold,
    fontSize: 16,
    lineHeight: 20,
  },
} as const

export type VarianteTypo = keyof typeof typographie

export function appliquerGrandTexte(style: Record<string, any>): Record<string, any> {
  return {
    ...style,
    fontSize: style.fontSize * FACTEUR_GRAND_TEXTE,
    lineHeight: style.lineHeight * FACTEUR_GRAND_TEXTE,
  }
}
