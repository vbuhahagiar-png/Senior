import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { Texte } from '@/components/ui/Text'
import { couleurs, espacement, arrondi, cibleTactile } from '@/lib/theme'
import type { NiveauHumeur } from '@/types/ritual'
import { humeurEmoji, humeurLabel } from '@/lib/utils'
import * as Haptics from 'expo-haptics'

interface SelecteurHumeurProps {
  valeur: NiveauHumeur | null
  onChange: (humeur: NiveauHumeur) => void
}

const NIVEAUX: NiveauHumeur[] = [1, 2, 3, 4, 5]

const COULEURS_HUMEUR: Record<NiveauHumeur, string> = {
  1: couleurs.humeurDifficile,
  2: couleurs.humeurPasTerrible,
  3: couleurs.humeurMoyen,
  4: couleurs.humeurBien,
  5: couleurs.humeurExcellent,
}

function BoutonHumeur({
  niveau,
  selectionne,
  onPress,
}: {
  niveau: NiveauHumeur
  selectionne: boolean
  onPress: () => void
}) {
  const scale = useSharedValue(1)

  const styleAnimé = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(1.3, { damping: 4 }),
      withSpring(1, { damping: 8 })
    )
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onPress()
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      accessible
      accessibilityRole="radio"
      accessibilityLabel={humeurLabel(niveau)}
      accessibilityState={{ selected: selectionne }}
      style={styles.boutonContainer}
    >
      <Animated.View
        style={[
          styles.bouton,
          selectionne && {
            backgroundColor: COULEURS_HUMEUR[niveau] + '20',
            borderColor: COULEURS_HUMEUR[niveau],
            borderWidth: 2,
          },
          styleAnimé,
        ]}
      >
        <Texte variante="displayMd">{humeurEmoji(niveau)}</Texte>
      </Animated.View>
      <Texte
        variante="legende"
        couleur={selectionne ? COULEURS_HUMEUR[niveau] : couleurs.texteSecondaire}
        align="center"
        style={selectionne && { fontFamily: 'Nunito-Bold' }}
      >
        {humeurLabel(niveau)}
      </Texte>
    </TouchableOpacity>
  )
}

export function SelecteurHumeur({ valeur, onChange }: SelecteurHumeurProps) {
  return (
    <View style={styles.container} accessible accessibilityRole="radiogroup">
      {NIVEAUX.map((niveau) => (
        <BoutonHumeur
          key={niveau}
          niveau={niveau}
          selectionne={valeur === niveau}
          onPress={() => onChange(niveau)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: espacement.sm,
  },
  boutonContainer: {
    flex: 1,
    alignItems: 'center',
    gap: espacement.xs,
  },
  bouton: {
    width: cibleTactile.confort,
    height: cibleTactile.confort,
    borderRadius: arrondi.xl,
    backgroundColor: couleurs.brumeLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
