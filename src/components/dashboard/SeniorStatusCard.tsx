import React from 'react'
import { View, StyleSheet } from 'react-native'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react-native'
import { Carte } from '@/components/ui/Card'
import { Texte } from '@/components/ui/Text'
import { Avatar } from '@/components/ui/Avatar'
import { couleurs, espacement, arrondi } from '@/lib/theme'
import type { Profile, RitualCompletion } from '@/types/supabase'
import { humeurEmoji, humeurLabel, formaterTempsEcoule } from '@/lib/utils'

interface CarteStatutSeniorProps {
  senior: Profile
  rituel: RitualCompletion | null
  onPress?: () => void
}

type Statut = 'complet' | 'en-cours' | 'absent'

function determinerStatut(rituel: RitualCompletion | null): Statut {
  if (!rituel) return 'absent'
  if (rituel.completed) return 'complet'
  if (rituel.mood != null || rituel.steps_done.length > 0) return 'en-cours'
  return 'absent'
}

const CONFIG_STATUT: Record<Statut, { couleur: string; icone: React.ReactNode; label: string }> = {
  complet: {
    couleur: couleurs.succes,
    icone: <CheckCircle size={20} color={couleurs.succes} strokeWidth={2} />,
    label: 'Rituel complété ✓',
  },
  'en-cours': {
    couleur: couleurs.attention,
    icone: <Clock size={20} color={couleurs.attention} strokeWidth={2} />,
    label: 'Rituel en cours…',
  },
  absent: {
    couleur: couleurs.erreur,
    icone: <AlertCircle size={20} color={couleurs.erreur} strokeWidth={2} />,
    label: 'Pas encore de check-in',
  },
}

export function CarteStatutSenior({ senior, rituel, onPress }: CarteStatutSeniorProps) {
  const statut = determinerStatut(rituel)
  const config = CONFIG_STATUT[statut]

  return (
    <Carte onPress={onPress} padding="lg" style={styles.carte}>
      <View style={styles.entete}>
        <View style={styles.infoProfil}>
          <Avatar nom={senior.display_name} uri={senior.avatar_url} taille="lg" />
          <View style={styles.nomStatut}>
            <Texte variante="titre">{senior.display_name}</Texte>
            <View style={styles.ligneStatut}>
              {config.icone}
              <Texte variante="corpsPetit" couleur={config.couleur}>
                {config.label}
              </Texte>
            </View>
          </View>
        </View>

        {/* Indicateur coloré */}
        <View
          style={[
            styles.indicateur,
            { backgroundColor: config.couleur + '20', borderColor: config.couleur },
          ]}
        >
          <View style={[styles.point, { backgroundColor: config.couleur }]} />
        </View>
      </View>

      {/* Humeur du jour */}
      {rituel?.mood != null && (
        <View style={styles.humeur}>
          <Texte variante="displayMd">{humeurEmoji(rituel.mood)}</Texte>
          <View>
            <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>
              Humeur du matin
            </Texte>
            <Texte variante="corpsgrand">{humeurLabel(rituel.mood)}</Texte>
          </View>
        </View>
      )}

      {/* Heure de complétion */}
      {rituel?.completed_at && (
        <Texte variante="legende" couleur={couleurs.texteSecondaire}>
          Complété {formaterTempsEcoule(rituel.completed_at)}
        </Texte>
      )}
    </Carte>
  )
}

const styles = StyleSheet.create({
  carte: {
    gap: espacement.md,
  },
  entete: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoProfil: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.md,
    flex: 1,
  },
  nomStatut: {
    gap: espacement.xs,
    flex: 1,
  },
  ligneStatut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.xs,
  },
  indicateur: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  point: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  humeur: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.md,
    backgroundColor: couleurs.brumeLight,
    borderRadius: arrondi.md,
    padding: espacement.md,
  },
})
