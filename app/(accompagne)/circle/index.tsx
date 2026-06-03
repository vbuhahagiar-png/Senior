import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { Plus, CheckSquare, Square, Phone } from 'lucide-react-native'
import { Ecran } from '@/components/layout/Screen'
import { Texte } from '@/components/ui/Text'
import { Carte } from '@/components/ui/Card'
import { Bouton } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Cadenas } from '@/components/ui/FeatureLock'
import { couleurs, espacement } from '@/lib/theme'
import { useAuth } from '@/hooks/useAuth'
import { getMesCercles } from '@/services/supabase/circle'

export default function CercleAidantsScreen() {
  const { utilisateur } = useAuth()

  const { data: cercles } = useQuery({
    queryKey: ['mes-cercles', utilisateur?.id],
    queryFn: () => getMesCercles(utilisateur!.id),
    enabled: !!utilisateur?.id,
  })

  const taches = [
    { id: '1', titre: 'Appel du matin', assigne: 'Pierre', fait: true, echeance: "Aujourd'hui" },
    { id: '2', titre: 'Accompagner au médecin', assigne: 'Sophie', fait: false, echeance: 'Jeudi 14h' },
    { id: '3', titre: 'Courses alimentaires', assigne: 'Pierre', fait: false, echeance: 'Vendredi' },
  ]

  return (
    <Ecran>
      <Texte variante="displayMd">Cercle d'aidants</Texte>
      <Texte variante="corps" couleur={couleurs.texteSecondaire}>
        Coordonnez les soins de votre proche en famille.
      </Texte>

      <Cadenas fonctionnalite="cercleCareComplet">
        <View style={styles.section}>
          <View style={styles.ligneSection}>
            <Texte variante="titre">Tâches & Rotations</Texte>
            <Bouton variante="primaire" taille="sm" onPress={() => {}}>
              + Ajouter
            </Bouton>
          </View>

          {taches.map((t) => (
            <Carte key={t.id} padding="md" style={styles.tacheCarte}>
              <View style={styles.tacheLigne}>
                {t.fait
                  ? <CheckSquare size={22} color={couleurs.succes} strokeWidth={2} />
                  : <Square size={22} color={couleurs.bordure} strokeWidth={2} />
                }
                <View style={styles.tacheContenu}>
                  <Texte variante="corps" style={t.fait && styles.texteFait}>
                    {t.titre}
                  </Texte>
                  <View style={styles.tacheMeta}>
                    <Texte variante="legende" couleur={couleurs.texteSecondaire}>
                      {t.assigne}
                    </Texte>
                    <Badge
                      texte={t.echeance}
                      variante={t.fait ? 'succes' : 'attention'}
                    />
                  </View>
                </View>
              </View>
            </Carte>
          ))}
        </View>

        <View style={styles.section}>
          <Texte variante="titre">Membres du cercle</Texte>

          {MEMBRES_DEMO.map((m) => (
            <Carte key={m.id} padding="md">
              <View style={styles.membreLigne}>
                <Avatar nom={m.nom} taille="md" />
                <View style={styles.membreContenu}>
                  <Texte variante="corps">{m.nom}</Texte>
                  <Texte variante="legende" couleur={couleurs.texteSecondaire}>{m.role}</Texte>
                </View>
                <Bouton
                  variante="fantome"
                  taille="sm"
                  icone={<Phone size={18} color={couleurs.primaire} strokeWidth={2} />}
                  onPress={() => {}}
                />
              </View>
            </Carte>
          ))}

          <Bouton variante="secondaire" pleineLargeur onPress={() => {}}>
            Inviter un proche
          </Bouton>
        </View>
      </Cadenas>
    </Ecran>
  )
}

const MEMBRES_DEMO = [
  { id: '1', nom: 'Pierre Dubois', role: 'Fils' },
  { id: '2', nom: 'Sophie Martin', role: 'Fille' },
]

const styles = StyleSheet.create({
  section: { gap: espacement.md, marginBottom: espacement.xl },
  ligneSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tacheCarte: { gap: espacement.sm },
  tacheLigne: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espacement.md,
  },
  tacheContenu: { flex: 1, gap: espacement.xs },
  tacheMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.sm,
  },
  texteFait: { textDecorationLine: 'line-through', opacity: 0.6 },
  membreLigne: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.md,
  },
  membreContenu: { flex: 1 },
})
