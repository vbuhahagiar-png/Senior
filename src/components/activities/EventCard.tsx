import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { MapPin, Clock, Bookmark, BookmarkCheck, Zap } from 'lucide-react-native'
import { Carte } from '@/components/ui/Card'
import { Texte } from '@/components/ui/Text'
import { Badge } from '@/components/ui/Badge'
import { couleurs, espacement } from '@/lib/theme'
import type { ActivityNormalisee } from '@/types/activity'
import { formaterDateRelative, formaterHeure, formaterDistance } from '@/lib/utils'
import * as Haptics from 'expo-haptics'

interface CarteActiviteProps {
  activite: ActivityNormalisee
  onPress?: () => void
  onSauvegarder?: () => void
  compact?: boolean
}

const COULEUR_INTENSITE: Record<string, string> = {
  douce: couleurs.intensiteDouce,
  moderee: couleurs.intensiteModeree,
  intense: couleurs.intensiteIntense,
}

const LABEL_INTENSITE: Record<string, string> = {
  douce: 'Douce',
  moderee: 'Modérée',
  intense: 'Intense',
}

export function CarteActivite({ activite, onPress, onSauvegarder, compact }: CarteActiviteProps) {
  const toggleSauvegarde = (e: any) => {
    e.stopPropagation?.()
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onSauvegarder?.()
  }

  return (
    <Carte onPress={onPress} padding="md" style={styles.carte}>
      <View style={styles.entete}>
        <View style={styles.badges}>
          {activite.isNew && <Badge texte="Nouveau" variante="accent" />}
          {activite.intensity && (
            <Badge
              texte={LABEL_INTENSITE[activite.intensity]}
              variante={activite.intensity === 'douce' ? 'succes' : activite.intensity === 'intense' ? 'erreur' : 'attention'}
            />
          )}
          {activite.isFree && <Badge texte="Gratuit" variante="primaire" />}
        </View>
        {onSauvegarder && (
          <TouchableOpacity
            onPress={toggleSauvegarde}
            accessible
            accessibilityLabel={activite.isSaved ? 'Retirer des sauvegardés' : 'Sauvegarder'}
            style={styles.boutonSauvegarde}
          >
            {activite.isSaved ? (
              <BookmarkCheck size={22} color={couleurs.primaire} strokeWidth={2} />
            ) : (
              <Bookmark size={22} color={couleurs.texteSecondaire} strokeWidth={2} />
            )}
          </TouchableOpacity>
        )}
      </View>

      <Texte variante="corpsgrand" style={styles.titre} numberOfLines={2}>
        {activite.title}
      </Texte>

      {!compact && (
        <View style={styles.infos}>
          {activite.startsAt && (
            <View style={styles.ligne}>
              <Clock size={16} color={couleurs.texteSecondaire} strokeWidth={2} />
              <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>
                {formaterDateRelative(activite.startsAt)} à {formaterHeure(activite.startsAt)}
              </Texte>
            </View>
          )}
          {(activite.locationName || activite.city) && (
            <View style={styles.ligne}>
              <MapPin size={16} color={couleurs.texteSecondaire} strokeWidth={2} />
              <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire} numberOfLines={1}>
                {activite.locationName ?? activite.city}
                {activite.distanceKm != null && ` · ${formaterDistance(activite.distanceKm)}`}
              </Texte>
            </View>
          )}
          {activite.organizerName && (
            <Texte variante="legende" couleur={couleurs.texteTertiaire}>
              {activite.organizerName}
            </Texte>
          )}
        </View>
      )}

      {activite.priceCHF != null && !activite.isFree && (
        <Texte variante="corpsgrand" couleur={couleurs.accent} style={styles.prix}>
          CHF {activite.priceCHF.toFixed(2)}
        </Texte>
      )}
    </Carte>
  )
}

const styles = StyleSheet.create({
  carte: {
    marginBottom: espacement.sm,
  },
  entete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: espacement.sm,
  },
  badges: {
    flexDirection: 'row',
    gap: espacement.xs,
    flexWrap: 'wrap',
    flex: 1,
  },
  boutonSauvegarde: {
    padding: espacement.xs,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titre: {
    marginBottom: espacement.sm,
  },
  infos: {
    gap: espacement.xs,
  },
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.xs,
  },
  prix: {
    marginTop: espacement.sm,
  },
})
