import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { CheckCircle } from 'lucide-react-native'
import { Ecran } from '@/components/layout/Screen'
import { Texte } from '@/components/ui/Text'
import { Bouton } from '@/components/ui/Button'
import { couleurs, espacement, arrondi, ombres } from '@/lib/theme'
import { ROUTES } from '@/lib/constants'
import * as Haptics from 'expo-haptics'

type Profil = 'profite' | 'accompagne'

interface CarteProfilProps {
  profil: Profil
  selectionne: boolean
  onSelect: () => void
}

function CarteProfil({ profil, selectionne, onSelect }: CarteProfilProps) {
  const config = CONFIGS[profil]

  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        onSelect()
      }}
      accessible
      accessibilityRole="radio"
      accessibilityLabel={config.titre}
      accessibilityState={{ selected: selectionne }}
      style={[
        styles.carte,
        selectionne && styles.carteSelectionnee,
      ]}
    >
      <View style={styles.enteteCarte}>
        <Texte variante="displayMd">{config.emoji}</Texte>
        {selectionne && (
          <CheckCircle size={24} color={couleurs.primaire} strokeWidth={2} />
        )}
      </View>

      <Texte variante="titre">{config.titre}</Texte>
      <Texte variante="corpsPetit" couleur={couleurs.primaire} style={styles.soustitre}>
        {config.soustitre}
      </Texte>
      <Texte variante="corps" couleur={couleurs.texteSecondaire}>
        {config.description}
      </Texte>

      <View style={styles.avantages}>
        {config.avantages.map((a) => (
          <View key={a} style={styles.avantage}>
            <Texte variante="corpsPetit" couleur={couleurs.primaireFonce}>• </Texte>
            <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>{a}</Texte>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  )
}

export default function ChoixProfil() {
  const router = useRouter()
  const [selectionne, setSelectionne] = useState<Profil | null>(null)

  function continuer() {
    if (!selectionne) return
    const route = selectionne === 'profite'
      ? ROUTES.AUTH.ONBOARDING.PROFITE.NOM
      : ROUTES.AUTH.ONBOARDING.ACCOMPAGNE.NOM
    router.push(route as any)
  }

  return (
    <Ecran>
      <View style={styles.container}>
        <View style={styles.entete}>
          <Texte variante="displayMd">Comment souhaitez-vous utiliser Senior + ?</Texte>
          <Texte variante="corps" couleur={couleurs.texteSecondaire}>
            Vous pourrez changer à tout moment.
          </Texte>
        </View>

        <View style={styles.cartes}>
          {(['profite', 'accompagne'] as Profil[]).map((p) => (
            <CarteProfil
              key={p}
              profil={p}
              selectionne={selectionne === p}
              onSelect={() => setSelectionne(p)}
            />
          ))}
        </View>

        <Bouton
          variante="primaire"
          pleineLargeur
          desactive={!selectionne}
          onPress={continuer}
        >
          Continuer
        </Bouton>
      </View>
    </Ecran>
  )
}

const CONFIGS = {
  profite: {
    emoji: '🌟',
    titre: 'Je profite',
    soustitre: 'Retraité·e actif·ve',
    description: 'Découvrez des activités, gérez votre quotidien et restez connecté·e.',
    avantages: [
      'Activités adaptées près de chez vous',
      'Rituel du matin bienveillant',
      'Agenda et rappels intelligents',
    ],
  },
  accompagne: {
    emoji: '💛',
    titre: 'J\'accompagne',
    soustitre: 'Proche aidant·e',
    description: 'Gardez un œil bienveillant sur votre proche et coordonnez les soins.',
    avantages: [
      'Tableau de bord rassurant au quotidien',
      'Cercle d\'aidants et partage des tâches',
      'Alertes douces si quelque chose change',
    ],
  },
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: espacement.xl,
    paddingTop: espacement.xl,
  },
  entete: {
    gap: espacement.sm,
  },
  cartes: {
    gap: espacement.md,
    flex: 1,
  },
  carte: {
    backgroundColor: couleurs.blanc,
    borderRadius: arrondi.xl,
    padding: espacement.lg,
    gap: espacement.sm,
    borderWidth: 2,
    borderColor: couleurs.bordure,
    ...(ombres.md as object),
  },
  carteSelectionnee: {
    borderColor: couleurs.primaire,
    backgroundColor: couleurs.saugeLighter + '30',
  },
  enteteCarte: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  soustitre: {
    fontFamily: 'Nunito-Bold',
  },
  avantages: {
    gap: espacement.xs,
    marginTop: espacement.xs,
  },
  avantage: {
    flexDirection: 'row',
  },
})
