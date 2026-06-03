import React from 'react'
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { Texte } from '@/components/ui/Text'
import { Carte } from '@/components/ui/Card'
import { CarteStatutSenior } from '@/components/dashboard/SeniorStatusCard'
import { Ecran } from '@/components/layout/Screen'
import { couleurs, espacement } from '@/lib/theme'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { Cadenas } from '@/components/ui/FeatureLock'
import { getSeniorsLiesAidant } from '@/services/supabase/profiles'
import { getRituelSeniorPourAidant } from '@/services/supabase/rituals'
import { CLES_QUERY } from '@/lib/constants'
import { formaterDateLong } from '@/lib/utils'

export default function TableauDeBordAidant() {
  const { profil, utilisateur } = useAuth()
  const { droits } = useSubscription()

  const { data: seniors, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['seniors-lies', utilisateur?.id],
    queryFn: () => getSeniorsLiesAidant(utilisateur!.id),
    enabled: !!utilisateur?.id,
  })

  const prenom = profil?.display_name?.split(' ')[0] ?? 'vous'
  const dateAujourdhuiLong = formaterDateLong(new Date())
  const seniorsData = seniors?.data ?? []

  return (
    <Ecran padding={false} scrollable={false}>
      <FlatList
        data={seniorsData}
        keyExtractor={(_, i) => String(i)}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={couleurs.accent}
          />
        }
        ListHeaderComponent={
          <View style={styles.entete}>
            <Texte variante="legende" couleur={couleurs.texteSecondaire}>
              {dateAujourdhuiLong}
            </Texte>
            <Texte variante="displayMd">Bonjour {prenom} 💛</Texte>
            <Texte variante="corps" couleur={couleurs.texteSecondaire}>
              {seniorsData.length === 0
                ? 'Invitez un proche pour voir son tableau de bord.'
                : `${seniorsData.length} proche${seniorsData.length > 1 ? 's' : ''} suivi${seniorsData.length > 1 ? 's' : ''}`}
            </Texte>
          </View>
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.vide}>
              <Texte variante="displayMd" align="center">💛</Texte>
              <Texte variante="titre" align="center">Invitez un proche</Texte>
              <Texte variante="corps" couleur={couleurs.texteSecondaire} align="center">
                Connectez-vous au profil Senior + de votre proche pour voir son tableau de bord quotidien.
              </Texte>
            </View>
          ) : null
        }
        renderItem={({ item }: { item: any }) => (
          <SeniorCard senior={item.senior} />
        )}
        contentContainerStyle={styles.liste}
      />
    </Ecran>
  )
}

function SeniorCard({ senior }: { senior: any }) {
  const { data: rituelData } = useQuery({
    queryKey: CLES_QUERY.RITUEL(senior.id, new Date().toISOString().split('T')[0]),
    queryFn: () => getRituelSeniorPourAidant(senior.id),
    enabled: !!senior.id,
    refetchInterval: 60000, // Rafraîchissement toutes les minutes
  })

  return (
    <View style={styles.seniorItem}>
      <CarteStatutSenior
        senior={senior}
        rituel={rituelData?.data ?? null}
      />

      {/* Résumé hebdo (Premium) */}
      <Cadenas fonctionnalite="resumeHebdo" afficherApercu={false}>
        <Carte padding="md" bordure style={styles.resumeHebdo}>
          <Texte variante="corpsgrand">📊 Résumé de la semaine</Texte>
          <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>
            5 rituels sur 7 · Humeur moyenne : Bien · 2 sorties cette semaine
          </Texte>
        </Carte>
      </Cadenas>
    </View>
  )
}

const styles = StyleSheet.create({
  entete: {
    paddingHorizontal: espacement.lg,
    paddingTop: espacement.xl,
    paddingBottom: espacement.md,
    gap: espacement.sm,
  },
  liste: {
    paddingBottom: espacement.xl,
  },
  seniorItem: {
    paddingHorizontal: espacement.lg,
    gap: espacement.md,
    marginBottom: espacement.xl,
  },
  vide: {
    paddingHorizontal: espacement.xl,
    paddingTop: espacement.xxxl,
    gap: espacement.lg,
    alignItems: 'center',
  },
  resumeHebdo: {
    gap: espacement.sm,
  },
})
