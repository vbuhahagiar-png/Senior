import React from 'react'
import { Text as RNText, StyleSheet, TextProps as RNTextProps } from 'react-native'
import { typographie, couleurs, appliquerGrandTexte } from '@/lib/theme'
import type { VarianteTypo } from '@/lib/theme'
import { useAuthStore } from '@/stores/authStore'

interface TextProps extends RNTextProps {
  variante?: VarianteTypo
  couleur?: string
  align?: 'left' | 'center' | 'right'
  gras?: boolean
}

export function Texte({
  variante = 'corps',
  couleur,
  align,
  gras,
  style,
  children,
  ...props
}: TextProps) {
  const profil = useAuthStore((s) => s.profil)
  const grandTexte = profil?.accessibility_large_text ?? false

  let styleTypo = typographie[variante] as Record<string, unknown>
  if (grandTexte && (variante === 'corps' || variante === 'corpsPetit' || variante === 'legende')) {
    styleTypo = appliquerGrandTexte(styleTypo)
  }

  return (
    <RNText
      style={[
        styleTypo,
        { color: couleur ?? couleurs.texte },
        align ? { textAlign: align } : null,
        gras ? { fontFamily: 'Nunito-Bold' } : null,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  )
}

// Raccourcis sémantiques
export function Titre({ children, ...props }: Omit<TextProps, 'variante'>) {
  return <Texte variante="titre" {...props}>{children}</Texte>
}

export function Affichage({ children, ...props }: Omit<TextProps, 'variante'>) {
  return <Texte variante="displayLg" {...props}>{children}</Texte>
}

export function Corps({ children, ...props }: Omit<TextProps, 'variante'>) {
  return <Texte variante="corps" {...props}>{children}</Texte>
}

export function Legende({ children, ...props }: Omit<TextProps, 'variante'>) {
  return <Texte variante="legende" couleur={couleurs.texteSecondaire} {...props}>{children}</Texte>
}
