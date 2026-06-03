import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { Texte } from './Text'
import { couleurs, espacement, arrondi } from '@/lib/theme'

type VarianteBadge = 'primaire' | 'accent' | 'succes' | 'attention' | 'erreur' | 'neutre' | 'premium'

interface BadgeProps {
  texte: string
  variante?: VarianteBadge
  style?: ViewStyle
}

const stylesVariante: Record<VarianteBadge, { fond: string; texte: string }> = {
  primaire: { fond: couleurs.saugeLighter, texte: couleurs.primaireFonce },
  accent: { fond: couleurs.terracottaLighter, texte: couleurs.terracottaDark },
  succes: { fond: couleurs.succesBackground, texte: couleurs.succes },
  attention: { fond: couleurs.attentionBackground, texte: couleurs.attention },
  erreur: { fond: couleurs.erreurBackground, texte: couleurs.erreur },
  neutre: { fond: couleurs.brumeLight, texte: couleurs.ardoiseLight },
  premium: { fond: '#F5E6D3', texte: '#8B5E3C' },
}

export function Badge({ texte, variante = 'neutre', style }: BadgeProps) {
  const sv = stylesVariante[variante]
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: sv.fond },
        style,
      ]}
    >
      <Texte variante="legende" couleur={sv.texte} style={styles.texte}>
        {texte}
      </Texte>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: arrondi.plein,
    paddingHorizontal: espacement.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  texte: {
    fontFamily: 'Nunito-SemiBold',
  },
})
