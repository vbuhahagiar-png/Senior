import React from 'react'
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native'
import { Texte } from './Text'
import { couleurs, espacement, arrondi, cibleTactile, typographie } from '@/lib/theme'
import * as Haptics from 'expo-haptics'

type VarianteBouton = 'primaire' | 'secondaire' | 'accent' | 'fantome' | 'danger'
type TailleBouton = 'sm' | 'md' | 'lg'

interface BoutonProps {
  variante?: VarianteBouton
  taille?: TailleBouton
  onPress?: () => void
  desactive?: boolean
  chargement?: boolean
  icone?: React.ReactNode
  iconePosition?: 'gauche' | 'droite'
  pleineLargeur?: boolean
  children: React.ReactNode
  style?: ViewStyle
  accessible?: boolean
  accessibilityLabel?: string
  accessibilityHint?: string
}

const stylesVariante: Record<VarianteBouton, { container: ViewStyle; texte: TextStyle }> = {
  primaire: {
    container: { backgroundColor: couleurs.primaire },
    texte: { color: couleurs.texteSurPrimaire },
  },
  secondaire: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: couleurs.primaire,
    },
    texte: { color: couleurs.primaire },
  },
  accent: {
    container: { backgroundColor: couleurs.accent },
    texte: { color: couleurs.texteSurAccent },
  },
  fantome: {
    container: { backgroundColor: 'transparent' },
    texte: { color: couleurs.texte },
  },
  danger: {
    container: { backgroundColor: couleurs.erreur },
    texte: { color: couleurs.blanc },
  },
}

const hauteursTaille: Record<TailleBouton, number> = {
  sm: 40,
  md: cibleTactile.confort,
  lg: cibleTactile.large,
}

const paddingTaille: Record<TailleBouton, ViewStyle> = {
  sm: { paddingHorizontal: espacement.md },
  md: { paddingHorizontal: espacement.lg },
  lg: { paddingHorizontal: espacement.xl },
}

export function Bouton({
  variante = 'primaire',
  taille = 'lg',
  onPress,
  desactive,
  chargement,
  icone,
  iconePosition = 'gauche',
  pleineLargeur,
  children,
  style,
  accessible = true,
  accessibilityLabel,
  accessibilityHint,
}: BoutonProps) {
  const stylesV = stylesVariante[variante]
  const hauteur = hauteursTaille[taille]
  const paddingH = paddingTaille[taille]

  const handlePress = () => {
    if (!desactive && !chargement) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      onPress?.()
    }
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={desactive || chargement}
      accessible={accessible}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: desactive || chargement }}
      style={[
        styles.base,
        stylesV.container,
        { height: hauteur, minHeight: cibleTactile.min },
        paddingH,
        pleineLargeur && styles.pleineLargeur,
        (desactive || chargement) && styles.desactive,
        style,
      ]}
    >
      {chargement ? (
        <ActivityIndicator color={stylesV.texte.color} />
      ) : (
        <View style={styles.contenu}>
          {icone && iconePosition === 'gauche' && <View style={styles.iconeGauche}>{icone}</View>}
          <Texte
            variante={taille === 'sm' ? 'boutonPetit' : 'bouton'}
            style={stylesV.texte}
          >
            {children}
          </Texte>
          {icone && iconePosition === 'droite' && <View style={styles.iconeDroite}>{icone}</View>}
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: arrondi.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pleineLargeur: {
    width: '100%',
  },
  desactive: {
    opacity: 0.5,
  },
  contenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.sm,
  },
  iconeGauche: {
    marginRight: espacement.xs,
  },
  iconeDroite: {
    marginLeft: espacement.xs,
  },
})
