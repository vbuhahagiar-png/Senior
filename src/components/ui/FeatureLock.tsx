import React from 'react'
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native'
import { BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import { Lock } from 'lucide-react-native'
import { Texte } from './Text'
import { Bouton } from './Button'
import { Badge } from './Badge'
import { couleurs, espacement, arrondi } from '@/lib/theme'
import { useSubscription } from '@/hooks/useSubscription'
import type { FonctionnalitePremium } from '@/types/subscription'
import { PLAN_REQUIS } from '@/types/subscription'
import { ROUTES } from '@/lib/constants'

interface CadenasProps {
  fonctionnalite: FonctionnalitePremium
  children: React.ReactNode
  afficherApercu?: boolean
  style?: ViewStyle
  messagePremium?: string
}

export function Cadenas({
  fonctionnalite,
  children,
  afficherApercu = true,
  style,
  messagePremium,
}: CadenasProps) {
  const { peutAcceder } = useSubscription()
  const router = useRouter()

  if (peutAcceder(fonctionnalite)) {
    return <>{children}</>
  }

  const planRequis = PLAN_REQUIS[fonctionnalite]
  const nomPlan = planRequis === 'famille' ? 'Famille' : 'Sérénité'

  const allerVersOffre = () => {
    router.push(ROUTES.WEB.CHECKOUT as any)
  }

  return (
    <View style={[styles.container, style]}>
      {afficherApercu && (
        <View style={styles.apercu} pointerEvents="none">
          {children}
        </View>
      )}
      <BlurView
        intensity={afficherApercu ? 20 : 0}
        style={StyleSheet.absoluteFillObject}
        tint="light"
      />
      <View style={styles.superposition}>
        <View style={styles.contenu}>
          <View style={styles.iconeContainer}>
            <Lock size={28} color={couleurs.accent} strokeWidth={2} />
          </View>
          <Badge texte="Premium" variante="premium" />
          <Texte variante="titre" align="center" style={styles.titre}>
            {messagePremium ?? `Disponible avec Senior + ${nomPlan}`}
          </Texte>
          <Bouton
            variante="accent"
            taille="md"
            onPress={allerVersOffre}
            style={styles.bouton}
          >
            Essayer gratuitement
          </Bouton>
          <Texte variante="legende" couleur={couleurs.texteSecondaire} align="center">
            1er mois offert · Sans engagement
          </Texte>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: arrondi.lg,
    overflow: 'hidden',
  },
  apercu: {
    opacity: 0.3,
  },
  superposition: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espacement.lg,
  },
  contenu: {
    alignItems: 'center',
    gap: espacement.md,
    backgroundColor: 'rgba(245, 240, 232, 0.95)',
    borderRadius: arrondi.xl,
    padding: espacement.xl,
    maxWidth: 300,
    width: '100%',
  },
  iconeContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: couleurs.terracottaLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titre: {
    textAlign: 'center',
  },
  bouton: {
    width: '100%',
  },
})
