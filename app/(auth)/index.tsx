import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Texte } from '@/components/ui/Text'
import { Bouton } from '@/components/ui/Button'
import { couleurs, espacement, palette, arrondi, ombres } from '@/lib/theme'
import { isDemoMode } from '@/services/supabase/client'
import { useAuthStore } from '@/stores/authStore'
import { useRitualStore } from '@/stores/ritualStore'
import { PROFIL_DEMO_PROFITE, PROFIL_DEMO_ACCOMPAGNE } from '@/stores/authStore'

export default function SplashScreen() {
  const router = useRouter()
  const [demoVisible, setDemoVisible] = useState(false)
  const { chargerProfitDeDemo, chargerAccompagneDemo } = useAuthStore()
  const { reinitialiserPourDemo } = useRitualStore()

  useEffect(() => {
    if (isDemoMode) setDemoVisible(true)
  }, [])

  const demarrerDemoProfite = () => {
    chargerProfitDeDemo()
    reinitialiserPourDemo(PROFIL_DEMO_PROFITE.id)
    router.replace('/(profite)/home/')
  }

  const demarrerDemoAccompagne = () => {
    chargerAccompagneDemo()
    router.replace('/(accompagne)/dashboard/')
  }

  return (
    <LinearGradient
      colors={[palette.ivoire, palette.saugeLighter + '60', palette.ivoire]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Logo */}
      <View style={styles.logo}>
        <View style={styles.logoInsigne}>
          <Texte variante="displayXl" couleur={palette.ivoire} align="center">+</Texte>
        </View>
        <Texte variante="displayXl" couleur={couleurs.primaireFonce} align="center">
          Senior +
        </Texte>
        <View style={styles.ornement} />
        <Texte variante="corps" couleur={couleurs.texteSecondaire} align="center">
          Votre compagnon de vie{'\n'}pour chaque journée
        </Texte>
      </View>

      {/* Valeurs */}
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

      {/* Actions principales */}
      <View style={styles.actions}>
        <Bouton
          variante="primaire"
          pleineLargeur
          onPress={() => router.push('/(auth)/onboarding/welcome')}
          accessibilityLabel="Commencer Senior +"
        >
          Commencer
        </Bouton>
        <Bouton
          variante="secondaire"
          pleineLargeur
          onPress={() => router.push('/(auth)/sign-in')}
        >
          J'ai déjà un compte
        </Bouton>
      </View>

      {/* Boutons démo rapide */}
      {demoVisible && (
        <View style={styles.demoSection}>
          <Texte variante="etiquettePetite" couleur={couleurs.texteTertiaire} align="center">
            ACCÈS DÉMO RAPIDE
          </Texte>
          <View style={styles.demoBoutons}>
            <TouchableOpacity
              onPress={demarrerDemoProfite}
              style={styles.demoBouton}
            >
              <Texte variante="corpsgrand" align="center">🌟</Texte>
              <Texte variante="corpsPetit" couleur={couleurs.primaireFonce} align="center">
                Je profite
              </Texte>
              <Texte variante="legende" couleur={couleurs.texteSecondaire} align="center">
                Retraité·e actif·ve
              </Texte>
            </TouchableOpacity>

            <View style={styles.demoSeparateur} />

            <TouchableOpacity
              onPress={demarrerDemoAccompagne}
              style={styles.demoBouton}
            >
              <Texte variante="corpsgrand" align="center">💛</Texte>
              <Texte variante="corpsPetit" couleur={couleurs.accentFonce} align="center">
                J'accompagne
              </Texte>
              <Texte variante="legende" couleur={couleurs.texteSecondaire} align="center">
                Proche aidant·e
              </Texte>
            </TouchableOpacity>
          </View>
          <Texte variante="legende" couleur={couleurs.texteTertiaire} align="center">
            Données fictives · Aucun compte requis
          </Texte>
        </View>
      )}

      <Texte variante="legende" couleur={couleurs.texteTertiaire} align="center" style={styles.mention}>
        🔒 Données hébergées en Suisse · Vie privée protégée
      </Texte>
    </LinearGradient>
  )
}

const VALEURS = [
  { emoji: '🌿', texte: 'Activités\nprès de vous' },
  { emoji: '👨‍👩‍👧', texte: 'Famille\nrassurée' },
  { emoji: '🔒', texte: 'Données\nen Suisse' },
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: espacement.xl,
    paddingTop: Platform.OS === 'web' ? 60 : espacement.xxxl,
    paddingBottom: espacement.xl,
    justifyContent: 'space-between',
  },
  logo: {
    alignItems: 'center',
    gap: espacement.md,
    flex: 1,
    justifyContent: 'center',
  },
  logoInsigne: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: couleurs.primaire,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espacement.sm,
    ...ombres.md,
  },
  ornement: {
    width: 48,
    height: 3,
    backgroundColor: couleurs.accent,
    borderRadius: 2,
  },
  valeurs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: espacement.lg,
  },
  valeur: {
    alignItems: 'center',
    gap: espacement.xs,
    flex: 1,
  },
  actions: {
    gap: espacement.md,
  },
  demoSection: {
    marginTop: espacement.xl,
    backgroundColor: couleurs.blanc,
    borderRadius: arrondi.xl,
    padding: espacement.lg,
    gap: espacement.md,
    ...(ombres.sm as object),
    borderWidth: 1,
    borderColor: couleurs.brumeLight,
  },
  demoBoutons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  demoBouton: {
    flex: 1,
    alignItems: 'center',
    gap: espacement.xs,
    paddingVertical: espacement.md,
    paddingHorizontal: espacement.sm,
  },
  demoSeparateur: {
    width: 1,
    height: 60,
    backgroundColor: couleurs.bordure,
  },
  mention: {
    marginTop: espacement.md,
  },
})
