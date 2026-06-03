import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Texte } from '@/components/ui/Text'
import { Bouton } from '@/components/ui/Button'
import { couleurs, espacement, palette } from '@/lib/theme'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/lib/constants'

export default function SplashScreen() {
  const router = useRouter()
  const { estAuthentifie, profil, chargement } = useAuthStore()

  useEffect(() => {
    if (chargement) return

    if (estAuthentifie && profil) {
      if (!profil.onboarding_done) {
        router.replace(ROUTES.AUTH.ONBOARDING.BIENVENUE as any)
      } else if (profil.role === 'profite') {
        router.replace(ROUTES.PROFITE.ACCUEIL as any)
      } else {
        router.replace(ROUTES.ACCOMPAGNE.TABLEAU as any)
      }
    }
  }, [estAuthentifie, profil, chargement])

  if (chargement) return null

  return (
    <LinearGradient
      colors={[palette.ivoire, palette.saugeLighter + '40']}
      style={styles.container}
    >
      <View style={styles.logo}>
        <Texte variante="displayXl" couleur={couleurs.primaireFonce} align="center">
          Senior +
        </Texte>
        <Texte variante="corps" couleur={couleurs.texteSecondaire} align="center">
          Votre compagnon de vie
        </Texte>
      </View>

      <View style={styles.actions}>
        <Bouton
          variante="primaire"
          pleineLargeur
          onPress={() => router.push(ROUTES.AUTH.ONBOARDING.BIENVENUE as any)}
          accessibilityLabel="Commencer l'application Senior +"
        >
          Commencer
        </Bouton>
        <Bouton
          variante="fantome"
          pleineLargeur
          onPress={() => router.push(ROUTES.AUTH.CONNEXION as any)}
        >
          Déjà un compte ? Se connecter
        </Bouton>
      </View>

      <Texte variante="legende" couleur={couleurs.texteTertiaire} align="center" style={styles.mention}>
        Données hébergées en Suisse · Vie privée protégée
      </Texte>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: espacement.xl,
    paddingTop: espacement.xxxl * 2,
    paddingBottom: espacement.xl,
    justifyContent: 'space-between',
  },
  logo: {
    alignItems: 'center',
    gap: espacement.md,
    flex: 1,
    justifyContent: 'center',
  },
  actions: {
    gap: espacement.md,
  },
  mention: {
    marginTop: espacement.lg,
  },
})
