import React, { useEffect } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Texte } from '@/components/ui/Text'
import { Bouton } from '@/components/ui/Button'
import { Carte } from '@/components/ui/Card'
import { SelecteurHumeur } from '@/components/ritual/MoodSelector'
import { Ecran } from '@/components/layout/Screen'
import { couleurs, espacement, palette, arrondi } from '@/lib/theme'
import { useAuth } from '@/hooks/useAuth'
import { useRitual } from '@/hooks/useRitual'
import { formaterDateLong } from '@/lib/utils'
import type { NiveauHumeur } from '@/types/ritual'
import { getCitationDuJour as getCitation } from '@/types/ritual'

export default function AccueilProfite() {
  const router = useRouter()
  const { profil } = useAuth()
  const {
    rituelDuJour,
    estComplet,
    humeur,
    etapesEffectuees,
    enregistrerHumeur,
    validerEtape,
    finaliserRituel,
  } = useRitual()

  const dateAujourdhuiLong = formaterDateLong(new Date())
  const citation = getCitation()

  const prenom = profil?.display_name?.split(' ')[0] ?? 'vous'

  const etapesMeta = [
    { id: 'humeur', label: 'Mon humeur', emoji: '😊' },
    { id: 'medicaments', label: 'Médicaments', emoji: '💊' },
    { id: 'mouvement', label: 'Mouvement', emoji: '🚶' },
  ]

  const progression = etapesEffectuees.length / 3

  return (
    <Ecran scrollable>
      {/* En-tête avec dégradé */}
      <LinearGradient
        colors={[palette.saugeLighter + '40', palette.ivoire]}
        style={styles.header}
      >
        <Texte variante="legende" couleur={couleurs.texteSecondaire}>
          {dateAujourdhuiLong}
        </Texte>
        <Texte variante="displayMd">
          Bonjour {prenom} 👋
        </Texte>
        <Texte variante="corps" couleur={couleurs.texteSecondaire}>
          {estComplet
            ? 'Rituel du matin complété ✓ Belle journée !'
            : 'Comment commencez-vous cette journée ?'}
        </Texte>
      </LinearGradient>

      {/* Rituel du matin */}
      {!estComplet && (
        <View style={styles.section}>
          <Texte variante="titre">Rituel du matin</Texte>

          {/* Sélecteur d'humeur */}
          <Carte padding="lg" style={styles.carteHumeur}>
            <Texte variante="corpsgrand" style={styles.titreEtape}>Comment vous sentez-vous ?</Texte>
            <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire} style={styles.soustitreEtape}>
              Un seul tap suffit.
            </Texte>
            <SelecteurHumeur
              valeur={humeur}
              onChange={(h: NiveauHumeur) => enregistrerHumeur(h)}
            />
          </Carte>

          {/* Étapes restantes */}
          <View style={styles.etapes}>
            {etapesMeta.map((e) => {
              const fait = etapesEffectuees.includes(e.id as any)
              return (
                <Carte
                  key={e.id}
                  onPress={fait ? undefined : () => validerEtape(e.id as any)}
                  padding="md"
                  style={[styles.etape, fait && styles.etapeFaite]}
                >
                  <View style={styles.ligneEtape}>
                    <Texte variante="corpsgrand">{e.emoji}</Texte>
                    <Texte variante="corps" style={fait && { textDecorationLine: 'line-through' }}>
                      {e.label}
                    </Texte>
                    {fait && <Texte variante="corps" couleur={couleurs.succes}>✓</Texte>}
                  </View>
                </Carte>
              )
            })}
          </View>

          {humeur && (
            <Bouton
              variante="primaire"
              pleineLargeur
              onPress={finaliserRituel}
            >
              Terminer le rituel
            </Bouton>
          )}
        </View>
      )}

      {/* Citation du jour */}
      <Carte padding="lg" couleurFond={couleurs.saugeLighter + '30'} style={styles.citation}>
        <Texte variante="displayMd" couleur={couleurs.primaireFonce} align="center">
          "
        </Texte>
        <Texte variante="corps" couleur={couleurs.ardoise} align="center" style={styles.texteCitation}>
          {citation.texte}
        </Texte>
        <Texte variante="legende" couleur={couleurs.texteSecondaire} align="center">
          — {citation.auteur}
        </Texte>
      </Carte>

      {/* Activités du jour */}
      <View style={styles.section}>
        <View style={styles.ligneSection}>
          <Texte variante="titre">Activités près de vous</Texte>
          <Bouton
            variante="fantome"
            taille="sm"
            onPress={() => router.push('/(profite)/activities/' as any)}
          >
            Voir tout
          </Bouton>
        </View>

        <Carte
          onPress={() => router.push('/(profite)/activities/' as any)}
          padding="lg"
          style={styles.suggestActivite}
        >
          <Texte variante="corpsgrand">🏊 Aquagym seniors</Texte>
          <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>
            Mardi 10h · Piscine des Bains · Gratuit
          </Texte>
          <Texte variante="legende" couleur={couleurs.primaire} style={styles.voirActivite}>
            Voir les détails →
          </Texte>
        </Carte>
      </View>
    </Ecran>
  )
}

const styles = StyleSheet.create({
  header: {
    gap: espacement.sm,
    paddingVertical: espacement.lg,
    marginBottom: espacement.md,
  },
  section: {
    gap: espacement.md,
    marginBottom: espacement.xl,
  },
  ligneSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carteHumeur: {
    gap: espacement.md,
  },
  titreEtape: {
    marginBottom: 0,
  },
  soustitreEtape: {
    marginBottom: espacement.xs,
  },
  etapes: {
    gap: espacement.sm,
  },
  etape: {
    borderWidth: 1,
    borderColor: couleurs.bordure,
  },
  etapeFaite: {
    borderColor: couleurs.primaire + '40',
    backgroundColor: couleurs.saugeLighter + '20',
  },
  ligneEtape: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.md,
  },
  citation: {
    marginBottom: espacement.xl,
    gap: espacement.sm,
  },
  texteCitation: {
    fontStyle: 'italic',
  },
  suggestActivite: {
    gap: espacement.sm,
    borderLeftWidth: 4,
    borderLeftColor: couleurs.primaire,
  },
  voirActivite: {
    marginTop: espacement.xs,
  },
})
