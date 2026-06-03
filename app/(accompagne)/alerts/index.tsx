import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react-native'
import { Ecran } from '@/components/layout/Screen'
import { Texte } from '@/components/ui/Text'
import { Carte } from '@/components/ui/Card'
import { couleurs, espacement } from '@/lib/theme'
import { formaterTempsEcoule } from '@/lib/utils'

interface AlerteDemo {
  id: string
  type: 'alerte' | 'info' | 'succes'
  titre: string
  message: string
  date: Date
}

const ALERTES_DEMO: AlerteDemo[] = [
  {
    id: '1',
    type: 'succes',
    titre: 'Rituel complété ✓',
    message: 'Marie a complété son rituel du matin — humeur : Bien 🙂',
    date: new Date(Date.now() - 1800000),
  },
  {
    id: '2',
    type: 'info',
    titre: 'Courrier décodé',
    message: 'Un courrier de la caisse maladie a été expliqué en clair pour Marie.',
    date: new Date(Date.now() - 7200000),
  },
  {
    id: '3',
    type: 'alerte',
    titre: 'Check-in manquant',
    message: 'Marie n\'a pas encore fait son rituel du matin (il est 11h05).',
    date: new Date(Date.now() - 86400000),
  },
]

const ICONES_TYPE = {
  succes: CheckCircle,
  info: Info,
  alerte: AlertCircle,
}

const COULEURS_TYPE = {
  succes: couleurs.succes,
  info: couleurs.info,
  alerte: couleurs.attention,
}

export default function AlertesScreen() {
  return (
    <Ecran>
      <View style={styles.entete}>
        <Texte variante="displayMd">Alertes</Texte>
        <Texte variante="corps" couleur={couleurs.texteSecondaire}>
          Événements récents concernant vos proches.
        </Texte>
      </View>

      {ALERTES_DEMO.length === 0 ? (
        <View style={styles.vide}>
          <Texte variante="displayMd" align="center">🔔</Texte>
          <Texte variante="titre" align="center">Tout va bien</Texte>
          <Texte variante="corps" couleur={couleurs.texteSecondaire} align="center">
            Aucune alerte pour le moment. Vous serez notifié·e si quelque chose change.
          </Texte>
        </View>
      ) : (
        <View style={styles.liste}>
          {ALERTES_DEMO.map((alerte) => {
            const Icone = ICONES_TYPE[alerte.type]
            const couleur = COULEURS_TYPE[alerte.type]
            return (
              <Carte key={alerte.id} padding="md">
                <View style={styles.alerteLigne}>
                  <View style={[styles.iconeContainer, { backgroundColor: couleur + '15' }]}>
                    <Icone size={20} color={couleur} strokeWidth={2} />
                  </View>
                  <View style={styles.alerteContenu}>
                    <Texte variante="corpsgrand">{alerte.titre}</Texte>
                    <Texte variante="corps" couleur={couleurs.texteSecondaire}>
                      {alerte.message}
                    </Texte>
                    <Texte variante="legende" couleur={couleurs.texteTertiaire}>
                      {formaterTempsEcoule(alerte.date)}
                    </Texte>
                  </View>
                </View>
              </Carte>
            )
          })}
        </View>
      )}
    </Ecran>
  )
}

const styles = StyleSheet.create({
  entete: { gap: espacement.sm, marginBottom: espacement.lg },
  vide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacement.lg,
    paddingHorizontal: espacement.xl,
  },
  liste: { gap: espacement.md },
  alerteLigne: {
    flexDirection: 'row',
    gap: espacement.md,
    alignItems: 'flex-start',
  },
  iconeContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alerteContenu: { flex: 1, gap: espacement.xs },
})
