import React from 'react'
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { couleurs, espacement, arrondi, ombres } from '@/lib/theme'
import * as Haptics from 'expo-haptics'

interface CarteProps {
  children: React.ReactNode
  onPress?: () => void
  padding?: keyof typeof espacement
  style?: ViewStyle
  ombre?: boolean
  bordure?: boolean
  couleurFond?: string
  accessible?: boolean
  accessibilityLabel?: string
}

export function Carte({
  children,
  onPress,
  padding = 'md',
  style,
  ombre = true,
  bordure = false,
  couleurFond,
  accessible = true,
  accessibilityLabel,
}: CarteProps) {
  const containerStyle: ViewStyle = {
    backgroundColor: couleurFond ?? couleurs.blanc,
    borderRadius: arrondi.lg,
    padding: espacement[padding],
    ...(ombre ? (ombres.md as ViewStyle) : {}),
    ...(bordure ? { borderWidth: 1, borderColor: couleurs.bordure } : {}),
  }

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          onPress()
        }}
        accessible={accessible}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={[containerStyle, style]}
        activeOpacity={0.85}
      >
        {children}
      </TouchableOpacity>
    )
  }

  return (
    <View style={[containerStyle, style]}>
      {children}
    </View>
  )
}
