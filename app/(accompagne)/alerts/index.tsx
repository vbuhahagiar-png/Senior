import React, { useState } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react-native'
import { Ecran } from '@/components/layout/Screen'
import { Texte } from '@/components/ui/Text'
import { Carte } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { couleurs, espacement, arrondi } from '@/lib/theme'

type FiltreAlerte = 'toutes' | 'nonLues' | 'urgentes'

const ALERTES_DEMO = [
  {
    id: '1', type: 'succes', lue: false, urgente: false,
    emoji: '✅', titre: 'Rituel du matin complété',
    message: 'Marie a complété son rituel du matin à 08h32. Humeur : 😊 Bien.',
    temps: 'Il y a 2h', categorie: 'rituel',
  },
  {
    id: '2', type: 'info', lue: false, urgente: false,
    emoji: '📅', titre: 'Rappel rendez-vous demain',
    message: 'Marie a un rendez-vous avec le Dr. Müller demain à 9h00. Prévoyez d\'accompagner.',
    temps: 'Il y a 3h', categorie: 'agenda',
  },
  {
    id: '3', type: 'attention', lue: false, urgente: false,
    emoji: '💊', titre: "Médicaments non confirmés",
    message: "Marie n'a pas encore confirmé la prise de ses médicaments du midi.",
    temps: 'Il y a 5h', categorie: 'medicaments',
  },
  {
    id: '4', type: 'erreur', lue: true, urgente: true,
    emoji: '⚠️', titre: 'Rituel non effectué hier',
    message: "Marie n'a pas effectué son rituel du matin hier. Pensez à lui donner un coup de fil.",
    temps: 'Hier à 11h05', categorie: 'rituel',
  },
  {
    id: '5', type: 'succes', lue: true, urgente: false,
    emoji: '🏊', titre: "Marie s'est inscrite à l'aquagym",
    message: "Marie a rejoint l'activité 'Aquagym seniors' du mardi. Bravo pour cette initiative !",
    temps: 'Il y a 2 jours', categorie: 'activite',
  },
  {
    id: '6', type: 'info', lue: true, urgente: false,
    emoji: '💬', titre: 'Nouveau message de Marie',
    message: 'Marie vous a envoyé un message dans le fil famille : "Tout va bien, bonne journée !"',
    temps: 'Il y a 2 jours', categorie: 'famille',
  },
  {
    id: '7', type: 'succes', lue: true, urgente: false,
    emoji: '😊', titre: 'Humeur excellente cette semaine',
    message: "Marie a eu une humeur moyenne de 4.2/5 cette semaine. C'est le meilleur score du mois !",
    temps: 'Il y a 3 jours', categorie: 'humeur',
  },
  {
    id: '8', type: 'info', lue: true, urgente: false,
    emoji: '🔄', titre: 'Ordonnance à renouveler',
    message: "L'ordonnance de Marie pour le Doliprane expire dans 5 jours. Pensez à la renouveler.",
    temps: 'Il y a 4 jours', categorie: 'medicaments',
  },
  {
    id: '9', type: 'succes', lue: true, urgente: false,
    emoji: '🌟', titre: '5 rituels consécutifs !',
    message: 'Marie a complété 5 rituels du matin consécutifs. Un nouveau record pour elle !',
    temps: 'Il y a 5 jours', categorie: 'rituel',
  },
  {
    id: '10', type: 'info', lue: true, urgente: false,
    emoji: '👩‍⚕️', titre: 'Compte-rendu cardiologue disponible',
    message: "Le Dr. Müller a partagé un compte-rendu de la dernière consultation de Marie.",
    temps: 'Il y a 1 semaine', categorie: 'medical',
  },
]

const COULEURS_TYPE = {
  succes: { bg: couleurs.succesBackground, icone: couleurs.succes, bordure: couleurs.succes + '40' },
  info: { bg: couleurs.infoBackground, icone: couleurs.info, bordure: couleurs.info + '40' },
  attention: { bg: couleurs.attentionBackground, icone: couleurs.attention, bordure: couleurs.attention + '40' },
  erreur: { bg: couleurs.erreurBackground, icone: couleurs.erreur, bordure: couleurs.erreur + '40' },
}

export default function AlertesScreen() {
  const [filtre, setFiltre] = useState<FiltreAlerte>('toutes')
  const [alertes, setAlertes] = useState(ALERTES_DEMO)

  const marquerLue = (id: string) => {
    setAlertes((prev) => prev.map((a) => a.id === id ? { ...a, lue: true } : a))
  }

  const alertesFiltrees = alertes.filter((a) => {
    if (filtre === 'nonLues') return !a.lue
    if (filtre === 'urgentes') return a.urgente
    return true
  })

  const nonLuesCount = alertes.filter((a) => !a.lue).length
  const urgentesCount = alertes.filter((a) => a.urgente).length

  const filtres: { id: FiltreAlerte; label: string; count?: number }[] = [
    { id: 'toutes', label: 'Toutes', count: alertes.length },
    { id: 'nonLues', label: 'Non lues', count: nonLuesCount },
    { id: 'urgentes', label: 'Urgentes', count: urgentesCount },
  ]

  return (
    <Ecran padding={false} scrollable={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Texte variante="displayMd">Alertes</Texte>
            {nonLuesCount > 0 && (
              <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>
                {nonLuesCount} notification{nonLuesCount > 1 ? 's' : ''} non lue{nonLuesCount > 1 ? 's' : ''}
              </Texte>
            )}
          </View>
          {nonLuesCount > 0 && (
            <TouchableOpacity onPress={() => setAlertes((prev) => prev.map((a) => ({ ...a, lue: true })))}>
              <Texte variante="corpsPetit" couleur={couleurs.accent}>Tout marquer lu</Texte>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtresContent}>
          {filtres.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[styles.filtrePill, filtre === f.id && styles.filtrePillActif]}
              onPress={() => setFiltre(f.id)}
            >
              <Texte variante="corpsPetit" couleur={filtre === f.id ? couleurs.blanc : couleurs.texte}>
                {f.label}
              </Texte>
              {f.count !== undefined && f.count > 0 && (
                <View style={[styles.filtreBadge, filtre === f.id ? styles.filtreBadgeActif : styles.filtreBadgeInactif]}>
                  <Texte variante="legende" couleur={filtre === f.id ? couleurs.accent : couleurs.texteSecondaire}>
                    {f.count}
                  </Texte>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {alertesFiltrees.length === 0 ? (
        <View style={styles.vide}>
          <Texte variante="displayMd" align="center">🔔</Texte>
          <Texte variante="titre" align="center">Aucune alerte</Texte>
          <Texte variante="corps" couleur={couleurs.texteSecondaire} align="center">
            Tout va bien pour Marie.
          </Texte>
        </View>
      ) : (
        <FlatList
          data={alertesFiltrees}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const couleurType = COULEURS_TYPE[item.type as keyof typeof COULEURS_TYPE] ?? COULEURS_TYPE.info
            return (
              <TouchableOpacity onPress={() => marquerLue(item.id)} style={styles.alerteWrapper}>
                <View style={[
                  styles.alerteCarte,
                  { backgroundColor: couleurType.bg, borderColor: couleurType.bordure },
                  !item.lue && styles.alerteNonLue,
                ]}>
                  {!item.lue && <View style={[styles.nonLueDot, { backgroundColor: couleurType.icone }]} />}
                  <View style={styles.alerteIconeContainer}>
                    <Texte variante="displayMd">{item.emoji}</Texte>
                  </View>
                  <View style={styles.alerteContenu}>
                    <View style={styles.alerteHeader}>
                      <Texte variante="corpsgrand" style={{ flex: 1 }}>{item.titre}</Texte>
                      <Texte variante="legende" couleur={couleurs.texteTertiaire}>{item.temps}</Texte>
                    </View>
                    <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire} numberOfLines={2}>
                      {item.message}
                    </Texte>
                    {item.urgente && <Badge texte="⚠️ Urgent" variante="erreur" />}
                  </View>
                </View>
              </TouchableOpacity>
            )
          }}
          contentContainerStyle={styles.liste}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Ecran>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: couleurs.blanc,
    paddingHorizontal: espacement.lg,
    paddingTop: espacement.lg,
    paddingBottom: espacement.sm,
    gap: espacement.md,
    borderBottomWidth: 1, borderBottomColor: couleurs.bordure,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  filtresContent: { gap: espacement.sm },
  filtrePill: {
    flexDirection: 'row', alignItems: 'center', gap: espacement.xs,
    paddingHorizontal: espacement.md, paddingVertical: espacement.sm,
    borderRadius: arrondi.full, backgroundColor: couleurs.brumeLight,
  },
  filtrePillActif: { backgroundColor: couleurs.accent },
  filtreBadge: {
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  filtreBadgeActif: { backgroundColor: 'rgba(255,255,255,0.3)' },
  filtreBadgeInactif: { backgroundColor: couleurs.brumeLight },
  vide: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    gap: espacement.lg, padding: espacement.xxxl,
  },
  liste: { padding: espacement.lg, gap: espacement.md, paddingBottom: 100 },
  alerteWrapper: {},
  alerteCarte: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: espacement.md, padding: espacement.md,
    borderRadius: arrondi.xl, borderWidth: 1,
    position: 'relative',
  },
  alerteNonLue: { ...({ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }) },
  nonLueDot: {
    position: 'absolute', top: espacement.md, right: espacement.md,
    width: 10, height: 10, borderRadius: 5,
  },
  alerteIconeContainer: {
    width: 44, height: 44, borderRadius: arrondi.lg,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },
  alerteContenu: { flex: 1, gap: espacement.xs },
  alerteHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: espacement.sm },
})
