import React, { useState } from 'react'
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, ScrollView, Linking } from 'react-native'
import { useRouter } from 'expo-router'
import { Phone, MessageCircle, ChevronRight, TrendingUp } from 'lucide-react-native'
import { Texte } from '@/components/ui/Text'
import { Carte } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Bouton } from '@/components/ui/Button'
import { Cadenas } from '@/components/ui/FeatureLock'
import { couleurs, espacement, arrondi, palette } from '@/lib/theme'
import { useAuth } from '@/hooks/useAuth'
import { formaterDateLong } from '@/lib/utils'

const SENIOR_DEMO = {
  nom: 'Marie Dubois',
  initiales: 'MD',
  rituelCompleteAujourd: true,
  rituelHeure: '08h32',
  humeurAujourd: 4,
  humeurLabel: '😊 Bien',
  medicamentsPris: true,
  derniereActivite: 'Yoga · Lundi',
  rituelsSemaine: [true, true, true, true, false, false, false],
  humeursSemaine: [4, 3, 4, 4, 0, 0, 0],
  telephone: 'tel:+41791234567',
}

const AGENDA_DEMO = [
  { jour: 'Lundi', date: '9 juin', heure: '09h00', titre: 'Cardiologue Dr. Müller', type: 'medical', emoji: '🏥' },
  { jour: 'Mardi', date: '10 juin', heure: '10h00', titre: 'Aquagym seniors', type: 'activite', emoji: '🏊' },
  { jour: 'Mercredi', date: '11 juin', heure: '11h30', titre: 'Renouvellement ordonnance', type: 'medical', emoji: '💊' },
  { jour: 'Vendredi', date: '13 juin', heure: '14h00', titre: 'Visite familiale Sophie', type: 'famille', emoji: '👨‍👩‍👧' },
]

const CERCLE_DEMO = [
  { initiales: 'SM', nom: 'Sophie Martin', lien: 'Fille (vous)', role: 'Admin', actif: true },
  { initiales: 'JL', nom: 'Jean-Louis Dubois', lien: 'Mari', role: 'Aidant', actif: true },
  { initiales: 'DM', nom: 'Dr. Müller', lien: 'Médecin traitant', role: 'Lecture seule', actif: false },
]

const JOURS_SEMAINE = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export default function TableauDeBordAidant() {
  const router = useRouter()
  const { profil } = useAuth()
  const [refreshing, setRefreshing] = useState(false)

  const prenom = profil?.display_name?.split(' ')[0] ?? 'vous'
  const dateAujourdhuiLong = formaterDateLong(new Date())

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1200)
  }

  const rituelsCompletes = SENIOR_DEMO.rituelsSemaine.filter(Boolean).length

  return (
    <FlatList
      data={[]}
      renderItem={null}
      keyExtractor={() => ''}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={couleurs.accent} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <>
          {/* En-tête */}
          <View style={styles.entete}>
            <Texte variante="legende" couleur={couleurs.texteSecondaire}>{dateAujourdhuiLong}</Texte>
            <Texte variante="displayMd">Bonjour {prenom} 💛</Texte>
            {SENIOR_DEMO.rituelCompleteAujourd && (
              <View style={styles.statusBanner}>
                <Texte variante="corpsPetit" couleur={couleurs.succes}>
                  ✓ Marie a complété son rituel du matin à {SENIOR_DEMO.rituelHeure}
                </Texte>
              </View>
            )}
            <View style={styles.resumeChips}>
              <Badge texte="1 proche suivi" variante="neutre" />
              <Badge texte="Rituel ✓" variante="succes" />
              <Badge texte="0 alerte" variante="neutre" />
            </View>
          </View>

          {/* Aperçu rapide 2×2 */}
          <View style={styles.section}>
            <Texte variante="titre">Aperçu de la semaine</Texte>
            <View style={styles.grille}>
              <Carte padding="md" style={styles.grilleCarte}>
                <View style={styles.grilleIcone}><TrendingUp size={20} color={couleurs.primaire} strokeWidth={2} /></View>
                <Texte variante="titre" couleur={couleurs.primaire}>{rituelsCompletes}/7</Texte>
                <Texte variante="legende" couleur={couleurs.texteSecondaire}>Rituels semaine</Texte>
                <View style={styles.miniBar}>
                  {SENIOR_DEMO.rituelsSemaine.map((done, i) => (
                    <View key={i} style={[styles.miniBarSegment, done && styles.miniBarFait]} />
                  ))}
                </View>
              </Carte>

              <Carte padding="md" style={styles.grilleCarte}>
                <Texte variante="displayMd">😊</Texte>
                <Texte variante="titre">{SENIOR_DEMO.humeurLabel}</Texte>
                <Texte variante="legende" couleur={couleurs.texteSecondaire}>Humeur aujourd'hui</Texte>
              </Carte>

              <Carte padding="md" style={styles.grilleCarte}>
                <Texte variante="displayMd">💊</Texte>
                <Texte variante="titre" couleur={couleurs.succes}>✓ Pris</Texte>
                <Texte variante="legende" couleur={couleurs.texteSecondaire}>Médicaments</Texte>
              </Carte>

              <Carte padding="md" style={styles.grilleCarte}>
                <Texte variante="displayMd">🏃</Texte>
                <Texte variante="titre">Yoga</Texte>
                <Texte variante="legende" couleur={couleurs.texteSecondaire}>Dernière activité</Texte>
              </Carte>
            </View>
          </View>

          {/* Carte statut senior */}
          <View style={styles.section}>
            <Texte variante="titre">Marie Dubois</Texte>
            <Carte padding="lg" style={{ gap: espacement.md }}>
              <View style={styles.seniorHeader}>
                <View style={styles.seniorAvatar}>
                  <Texte variante="titre" couleur={couleurs.blanc}>MD</Texte>
                </View>
                <View style={{ flex: 1 }}>
                  <Texte variante="corpsgrand">Marie Dubois</Texte>
                  <Texte variante="legende" couleur={couleurs.texteSecondaire}>Genève · 71 ans</Texte>
                </View>
                <View style={styles.seniorStatus}>
                  <View style={[styles.statusDot, { backgroundColor: couleurs.succes }]} />
                  <Texte variante="legende" couleur={couleurs.succes}>Active</Texte>
                </View>
              </View>

              {/* Rituels de la semaine */}
              <View style={{ gap: espacement.xs }}>
                <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>Rituels cette semaine</Texte>
                <View style={styles.semaineJours}>
                  {JOURS_SEMAINE.map((jour, i) => (
                    <View key={i} style={styles.semaineJour}>
                      <Texte variante="legende" couleur={couleurs.texteSecondaire}>{jour}</Texte>
                      <View style={[
                        styles.jourDot,
                        SENIOR_DEMO.rituelsSemaine[i] && styles.jourFait,
                        !SENIOR_DEMO.rituelsSemaine[i] && i < 4 && styles.jourManque,
                      ]}>
                        {SENIOR_DEMO.rituelsSemaine[i] && (
                          <Texte variante="legende" couleur={couleurs.blanc}>✓</Texte>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Actions rapides */}
              <View style={styles.actionsRapides}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => Linking.openURL(SENIOR_DEMO.telephone)}
                >
                  <Phone size={20} color={couleurs.primaire} strokeWidth={2} />
                  <Texte variante="corpsPetit" couleur={couleurs.primaire}>Appeler</Texte>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
                  <MessageCircle size={20} color={couleurs.accent} strokeWidth={2} />
                  <Texte variante="corpsPetit" couleur={couleurs.accent}>Message</Texte>
                </TouchableOpacity>
              </View>
            </Carte>
          </View>

          {/* Résumé hebdo — Premium */}
          <View style={styles.section}>
            <Cadenas fonctionnalite="resumeHebdo" afficherApercu={false}>
              <Carte padding="lg" style={{ gap: espacement.md }}>
                <Texte variante="corpsgrand">📊 Résumé de la semaine</Texte>
                <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>
                  {rituelsCompletes} rituels · Humeur moyenne : Bien · 2 sorties
                </Texte>
                <View style={styles.humeurGraphe}>
                  {SENIOR_DEMO.humeursSemaine.map((h, i) => (
                    <View key={i} style={styles.humeurBarCol}>
                      <View style={[styles.humeurBar, { height: h > 0 ? (h / 5) * 40 : 4, backgroundColor: h > 0 ? couleurs.primaire : couleurs.brumeLight }]} />
                      <Texte variante="legende" couleur={couleurs.texteSecondaire}>{JOURS_SEMAINE[i]}</Texte>
                    </View>
                  ))}
                </View>
              </Carte>
            </Cadenas>
          </View>

          {/* Agenda Marie */}
          <View style={styles.section}>
            <View style={styles.ligneSection}>
              <Texte variante="titre">Agenda de Marie</Texte>
              <TouchableOpacity>
                <Texte variante="corpsPetit" couleur={couleurs.accent}>Tout voir →</Texte>
              </TouchableOpacity>
            </View>
            {AGENDA_DEMO.map((rdv, i) => (
              <Carte key={i} padding="md" style={styles.rdvCarte}>
                <View style={styles.rdvLigne}>
                  <View style={[styles.rdvIcone, {
                    backgroundColor: rdv.type === 'medical' ? couleurs.erreurBackground
                      : rdv.type === 'activite' ? couleurs.succesBackground
                      : couleurs.infoBackground,
                  }]}>
                    <Texte variante="corpsgrand">{rdv.emoji}</Texte>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Texte variante="corpsgrand">{rdv.titre}</Texte>
                    <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>
                      {rdv.jour} {rdv.date} · {rdv.heure}
                    </Texte>
                  </View>
                  <Badge
                    texte={rdv.type === 'medical' ? 'Médical' : rdv.type === 'activite' ? 'Activité' : 'Famille'}
                    variante={rdv.type === 'medical' ? 'erreur' : rdv.type === 'activite' ? 'succes' : 'primaire'}
                  />
                </View>
              </Carte>
            ))}
          </View>

          {/* Cercle familial */}
          <View style={styles.section}>
            <Texte variante="titre">Cercle familial</Texte>
            {CERCLE_DEMO.map((m, i) => (
              <Carte key={i} padding="md" style={styles.membreLigne}>
                <View style={[styles.membreAvatar, { backgroundColor: m.actif ? couleurs.primaire : couleurs.ardoiseLighter }]}>
                  <Texte variante="corpsPetit" couleur={couleurs.blanc}>{m.initiales}</Texte>
                </View>
                <View style={{ flex: 1 }}>
                  <Texte variante="corpsgrand">{m.nom}</Texte>
                  <Texte variante="legende" couleur={couleurs.texteSecondaire}>{m.lien}</Texte>
                </View>
                <Badge texte={m.role} variante={m.role === 'Admin' ? 'primaire' : m.role === 'Aidant' ? 'accent' : 'neutre'} />
              </Carte>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </>
      }
    />
  )
}

const styles = StyleSheet.create({
  container: { paddingBottom: espacement.xl },
  entete: {
    paddingHorizontal: espacement.lg, paddingTop: espacement.xl,
    paddingBottom: espacement.lg, gap: espacement.sm,
    backgroundColor: palette.ivoireDark ?? couleurs.ivoire,
  },
  statusBanner: {
    backgroundColor: couleurs.succesBackground,
    borderRadius: arrondi.lg,
    paddingHorizontal: espacement.md,
    paddingVertical: espacement.sm,
    borderWidth: 1, borderColor: couleurs.succes + '40',
  },
  resumeChips: { flexDirection: 'row', gap: espacement.sm, flexWrap: 'wrap' },
  section: {
    paddingHorizontal: espacement.lg,
    paddingTop: espacement.xl,
    gap: espacement.md,
  },
  ligneSection: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  grille: { flexDirection: 'row', flexWrap: 'wrap', gap: espacement.md },
  grilleCarte: { width: '47%', gap: espacement.sm },
  grilleIcone: {
    width: 36, height: 36, borderRadius: arrondi.lg,
    backgroundColor: couleurs.primaire + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  miniBar: { flexDirection: 'row', gap: 2 },
  miniBarSegment: {
    flex: 1, height: 6, borderRadius: 3,
    backgroundColor: couleurs.brumeLight,
  },
  miniBarFait: { backgroundColor: couleurs.primaire },
  seniorHeader: { flexDirection: 'row', alignItems: 'center', gap: espacement.md },
  seniorAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: couleurs.accent, alignItems: 'center', justifyContent: 'center',
  },
  seniorStatus: { flexDirection: 'row', alignItems: 'center', gap: espacement.xs },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  semaineJours: { flexDirection: 'row', justifyContent: 'space-between' },
  semaineJour: { alignItems: 'center', gap: espacement.xs },
  jourDot: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: couleurs.brumeLight,
    alignItems: 'center', justifyContent: 'center',
  },
  jourFait: { backgroundColor: couleurs.primaire },
  jourManque: { backgroundColor: couleurs.erreurBackground },
  actionsRapides: { flexDirection: 'row', gap: espacement.md },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: espacement.sm,
    paddingVertical: espacement.md,
    borderRadius: arrondi.lg, borderWidth: 1, borderColor: couleurs.bordure,
  },
  humeurGraphe: {
    flexDirection: 'row', gap: espacement.sm,
    height: 60, alignItems: 'flex-end',
  },
  humeurBarCol: { flex: 1, alignItems: 'center', gap: espacement.xs },
  humeurBar: { width: '100%', borderRadius: 3 },
  rdvCarte: {},
  rdvLigne: { flexDirection: 'row', alignItems: 'center', gap: espacement.md },
  rdvIcone: {
    width: 44, height: 44, borderRadius: arrondi.lg,
    alignItems: 'center', justifyContent: 'center',
  },
  membreLigne: {},
  membreAvatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
})
