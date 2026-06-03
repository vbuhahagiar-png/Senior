import React, { useState } from 'react'
import { View, StyleSheet, FlatList, TextInput } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react-native'
import { Ecran } from '@/components/layout/Screen'
import { Texte } from '@/components/ui/Text'
import { CarteActivite } from '@/components/activities/EventCard'
import { Badge } from '@/components/ui/Badge'
import { couleurs, espacement, arrondi, cibleTactile } from '@/lib/theme'
import { rechercherActivitesGeneve } from '@/services/openagenda/events'
import { CLES_QUERY } from '@/lib/constants'
import type { ActivityNormalisee } from '@/types/activity'
import { useRouter } from 'expo-router'

const CATEGORIES = [
  { id: 'tous', label: 'Tout' },
  { id: 'sport', label: 'Sport doux' },
  { id: 'culture', label: 'Culture' },
  { id: 'benevolat', label: 'Bénévolat' },
  { id: 'social', label: 'Rencontres' },
  { id: 'formation', label: 'Ateliers' },
]

export default function ActivitesScreen() {
  const router = useRouter()
  const [recherche, setRecherche] = useState('')
  const [categorieActive, setCategorieActive] = useState('tous')

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: CLES_QUERY.ACTIVITES({ category: categorieActive }),
    queryFn: () =>
      rechercherActivitesGeneve(
        categorieActive === 'tous' ? undefined : categorieActive,
        new Date()
      ),
    staleTime: 1000 * 60 * 15,
  })

  const activitesFiltrees = (data ?? ACTIVITES_DEMO).filter((a) =>
    !recherche || a.title.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <Ecran scrollable={false} padding={false}>
      <View style={styles.entete}>
        <Texte variante="displayMd" style={styles.titre}>Activités</Texte>
        <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>
          Près de chez vous · Genève
        </Texte>

        {/* Barre de recherche */}
        <View style={styles.recherche}>
          <Search size={20} color={couleurs.texteSecondaire} strokeWidth={2} />
          <TextInput
            value={recherche}
            onChangeText={setRecherche}
            placeholder="Rechercher une activité…"
            placeholderTextColor={couleurs.texteTertiaire}
            style={styles.inputRecherche}
            accessible
            accessibilityLabel="Rechercher une activité"
          />
        </View>

        {/* Filtres catégories */}
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(c) => c.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtres}
          renderItem={({ item }) => (
            <Badge
              texte={item.label}
              variante={categorieActive === item.id ? 'primaire' : 'neutre'}
              style={[
                styles.filtre,
                categorieActive === item.id && styles.filtreActif,
              ]}
            />
          )}
        />
      </View>

      {/* Liste des activités */}
      <FlatList
        data={activitesFiltrees}
        keyExtractor={(a) => a.externalId}
        contentContainerStyle={styles.liste}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isRefetching}
        ListEmptyComponent={
          <View style={styles.vide}>
            <Texte variante="displayMd" align="center">🔍</Texte>
            <Texte variante="corps" align="center" couleur={couleurs.texteSecondaire}>
              {isLoading ? 'Chargement…' : 'Aucune activité trouvée.'}
            </Texte>
          </View>
        }
        renderItem={({ item }) => (
          <CarteActivite
            activite={item}
            onPress={() => router.push(`/(profite)/activities/${item.externalId}` as any)}
          />
        )}
      />
    </Ecran>
  )
}

// Données de démonstration (utilisées en l'absence de clé API)
const ACTIVITES_DEMO: ActivityNormalisee[] = [
  {
    id: 'demo-1',
    source: 'demo',
    externalId: 'demo-1',
    title: 'Aquagym seniors — Niveau débutant',
    description: 'Cours d\'aquagym adapté aux seniors. Encadré par un moniteur diplômé.',
    category: 'sport',
    locationName: 'Piscine des Bains des Pâquis',
    locationAddress: 'Quai du Mont-Blanc 30, 1201 Genève',
    lat: 46.2073,
    lng: 6.1489,
    city: 'Genève',
    canton: 'GE',
    startsAt: new Date(Date.now() + 86400000),
    isRecurring: true,
    intensity: 'douce',
    isFree: true,
    sourceUrl: 'https://example.com',
    organizerName: 'Service des sports Ville de Genève',
    tags: ['sport', 'natation', 'seniors'],
    dateVerified: new Date(),
    isNew: true,
    isChanged: false,
  },
  {
    id: 'demo-2',
    source: 'demo',
    externalId: 'demo-2',
    title: 'Yoga doux — Detente et équilibre',
    description: 'Séance de yoga adaptée aux personnes de 60 ans et plus. Tous niveaux.',
    category: 'sport',
    locationName: 'Maison de quartier des Grottes',
    locationAddress: 'Rue de l\'Industrie 5, 1201 Genève',
    city: 'Genève',
    canton: 'GE',
    startsAt: new Date(Date.now() + 172800000),
    isRecurring: true,
    intensity: 'douce',
    priceCHF: 5,
    isFree: false,
    sourceUrl: 'https://example.com',
    organizerName: 'Pro Senectute Genève',
    tags: ['sport', 'yoga', 'seniors', 'bien-etre'],
    dateVerified: new Date(),
    isNew: false,
    isChanged: false,
  },
  {
    id: 'demo-3',
    source: 'demo',
    externalId: 'demo-3',
    title: 'Atelier numérique — Smartphone & applications',
    description: 'Apprenez à utiliser votre smartphone avec des bénévoles passionnés.',
    category: 'formation',
    locationName: 'Bibliothèque de la Cité',
    locationAddress: 'Place des Trois-Perdrix 5, 1204 Genève',
    city: 'Genève',
    canton: 'GE',
    startsAt: new Date(Date.now() + 259200000),
    isRecurring: false,
    isFree: true,
    sourceUrl: 'https://example.com',
    organizerName: 'Pro Senectute Genève',
    tags: ['formation', 'numerique', 'seniors'],
    dateVerified: new Date(),
    isNew: true,
    isChanged: false,
  },
]

const styles = StyleSheet.create({
  entete: {
    paddingHorizontal: espacement.lg,
    paddingTop: espacement.xl,
    paddingBottom: espacement.md,
    gap: espacement.md,
    backgroundColor: couleurs.fond,
  },
  titre: {
    marginBottom: 0,
  },
  recherche: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.sm,
    backgroundColor: couleurs.blanc,
    borderRadius: arrondi.lg,
    paddingHorizontal: espacement.md,
    height: cibleTactile.confort,
    borderWidth: 1,
    borderColor: couleurs.bordure,
  },
  inputRecherche: {
    flex: 1,
    fontFamily: 'Nunito-Regular',
    fontSize: 18,
    color: couleurs.texte,
  },
  filtres: {
    gap: espacement.sm,
    paddingBottom: espacement.xs,
  },
  filtre: {
    paddingVertical: espacement.sm,
    paddingHorizontal: espacement.md,
    minHeight: 40,
    justifyContent: 'center',
  },
  filtreActif: {
    backgroundColor: couleurs.saugeLighter,
  },
  liste: {
    padding: espacement.lg,
  },
  vide: {
    padding: espacement.xxxl,
    alignItems: 'center',
    gap: espacement.md,
  },
})
