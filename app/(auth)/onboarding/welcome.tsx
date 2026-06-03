import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Texte } from '@/components/ui/Text'
import { Bouton } from '@/components/ui/Button'
import { couleurs, espacement, palette } from '@/lib/theme'
import { ROUTES } from '@/lib/constants'

export default function BienvenuePage() {
  const router = useRouter()

  return (
    <LinearGradient
      colors={[palette.ivoire, palette.saugeLighter + '60']}
      style={styles.container}
    >
      <View style={styles.hero}>
        <Texte variante="displayXl" couleur={couleurs.primaireFonce} align="center">
          Senior +
        </Texte>
        <View style={styles.ornement} />
        <Texte variante="displayMd" couleur={couleurs.ardoise} align="center" style={styles.tagline}>
          Votre compagnon{'\n'}de chaque journée
        </Texte>
        <Texte variante="corps" couleur={couleurs.texteSecondaire} align="center">
          Fait pour vous, avec votre famille.{'\n'}Simple. Bienveillant. En Suisse.
        </Texte>
      </View>

      <View style={styles.valeurs}>
        {VALEURS.map((v) => (
          <View key={v.emoji} style={styles.valeur}>
            <Texte variante="displayMd">{v.emoji}</Texte>
            <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire} align="center">
              {v.texte}
            </Texte>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Bouton
          variante="primaire"
          pleineLargeur
          onPress={() => router.push(ROUTES.AUTH.ONBOARDING.CHOIX as any)}
          accessibilityLabel="Démarrer la configuration de Senior +"
        >
          Commencer
        </Bouton>
        <Bouton
          variante="fantome"
          pleineLargeur
          onPress={() => router.push(ROUTES.AUTH.CONNEXION as any)}
        >
          J'ai déjà un compte
        </Bouton>
      </View>
    </LinearGradient>
  )
}

const VALEURS = [
  { emoji: '🌿', texte: 'Activités adaptées\nnear de chez vous' },
  { emoji: '👨‍👩‍👧', texte: 'Famille rassurée\nchaque matin' },
  { emoji: '🔒', texte: 'Données privées\nen Suisse' },
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: espacement.xl,
    paddingTop: espacement.xxxl,
    paddingBottom: espacement.xl,
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'center',
    gap: espacement.lg,
    flex: 1,
    justifyContent: 'center',
  },
  ornement: {
    width: 60,
    height: 3,
    backgroundColor: couleurs.accent,
    borderRadius: 2,
  },
  tagline: {
    lineHeight: 42,
  },
  valeurs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: espacement.xl,
  },
  valeur: {
    alignItems: 'center',
    gap: espacement.sm,
    flex: 1,
  },
  actions: {
    gap: espacement.md,
  },
})
