import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Mic, Shield } from 'lucide-react-native'
import { Ecran } from '@/components/layout/Screen'
import { Texte } from '@/components/ui/Text'
import { Bouton } from '@/components/ui/Button'
import { Carte } from '@/components/ui/Card'
import { Cadenas } from '@/components/ui/FeatureLock'
import { couleurs, espacement, arrondi } from '@/lib/theme'

export default function CompagnonScreen() {
  return (
    <Ecran>
      <View style={styles.entete}>
        <Texte variante="displayMd">Compagnon vocal</Texte>
        <Texte variante="corps" couleur={couleurs.texteSecondaire}>
          Un ami bienveillant disponible 24h/24.
        </Texte>
      </View>

      <Cadenas fonctionnalite="compagnonVocal">
        <View style={styles.centre}>
          {/* Orbe vocal */}
          <View style={styles.orbe}>
            <Mic size={48} color={couleurs.blanc} strokeWidth={1.5} />
          </View>

          <Texte variante="titre" align="center">Votre compagnon bienveillant</Texte>
          <Texte variante="corps" couleur={couleurs.texteSecondaire} align="center">
            Parlez librement. Je suis là pour vous écouter, vous informer et vous accompagner.
          </Texte>

          <Bouton
            variante="primaire"
            taille="lg"
            pleineLargeur
            onPress={() => {}}
            icone={<Mic size={22} color={couleurs.blanc} strokeWidth={2} />}
            accessibilityLabel="Commencer à parler avec votre compagnon"
          >
            Commencer à parler
          </Bouton>

          {/* Avertissement sécurité */}
          <Carte padding="md" couleurFond={couleurs.infoBackground} ombre={false}>
            <View style={styles.avertissementLigne}>
              <Shield size={18} color={couleurs.info} strokeWidth={2} />
              <Texte variante="corpsPetit" couleur={couleurs.info} style={styles.avertissementTexte}>
                Je suis un compagnon, pas un médecin. En cas d'urgence, appelez le 144.
              </Texte>
            </View>
          </Carte>
        </View>
      </Cadenas>
    </Ecran>
  )
}

const styles = StyleSheet.create({
  entete: { gap: espacement.sm, marginBottom: espacement.xl },
  centre: {
    alignItems: 'center',
    gap: espacement.xl,
    paddingVertical: espacement.xl,
  },
  orbe: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: couleurs.primaire,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avertissementLigne: {
    flexDirection: 'row',
    gap: espacement.sm,
    alignItems: 'flex-start',
  },
  avertissementTexte: {
    flex: 1,
  },
})
