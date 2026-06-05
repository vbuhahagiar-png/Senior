import React, { useState } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { Search, Calendar, X, Link } from 'lucide-react-native'
import { Ecran } from '@/components/layout/Screen'
import { Texte } from '@/components/ui/Text'
import { Bouton } from '@/components/ui/Button'
import { Carte } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Cadenas } from '@/components/ui/FeatureLock'
import { couleurs, espacement, arrondi } from '@/lib/theme'

const CATEGORIES = [
  { id: 'toutes', label: 'Toutes', emoji: '🌟' },
  { id: 'sport', label: 'Sport', emoji: '🏊' },
  { id: 'culture', label: 'Culture', emoji: '🎭' },
  { id: 'benevolat', label: 'Bénévolat', emoji: '🤝' },
  { id: 'yoga', label: 'Yoga & Bien-être', emoji: '🧘' },
  { id: 'sorties', label: 'Sorties', emoji: '🚶' },
  { id: 'ateliers', label: 'Ateliers', emoji: '🎨' },
]

const JOURS = [
  { id: 'aujourd', label: "Aujourd'hui" },
  { id: 'semaine', label: 'Cette semaine' },
  { id: 'weekend', label: 'Ce weekend' },
  { id: 'mois', label: 'Ce mois' },
]

const ACTIVITES = [
  {
    id: '1', emoji: '🏊', titre: 'Aquagym seniors', categorie: 'sport',
    date: 'Mar & Jeu', heure: '10h-11h', lieu: 'Piscine des Bains des Pâquis',
    organisateur: 'Ville de Genève', prix: 'Gratuit', distance: '0.8 km',
    places: 8, badge: '⭐ Populaire', intensite: 'Douce',
  },
  {
    id: '2', emoji: '🧘', titre: 'Yoga doux pour seniors', categorie: 'yoga',
    date: 'Lun & Jeu', heure: '10h-11h', lieu: 'Centre sportif Frontenex',
    organisateur: 'Pro Senectute GE', prix: 'CHF 8/séance', distance: '1.2 km',
    places: 12, badge: null, intensite: 'Douce',
  },
  {
    id: '3', emoji: '🎭', titre: 'Visite guidée musée Rath', categorie: 'culture',
    date: 'Mercredi', heure: '14h-16h', lieu: 'Musée Rath',
    organisateur: 'Musées de Genève', prix: 'Gratuit', distance: '2.1 km',
    places: 20, badge: '🆕 Nouveau', intensite: null,
  },
  {
    id: '4', emoji: '🤝', titre: 'Bénévolat bibliothèque', categorie: 'benevolat',
    date: 'Vendredi', heure: '9h-12h', lieu: 'Bibliothèque de la Cité',
    organisateur: 'Bibliothèques Genève', prix: 'Bénévolat', distance: '1.5 km',
    places: 5, badge: null, intensite: null,
  },
  {
    id: '5', emoji: '🎨', titre: 'Atelier peinture aquarelle', categorie: 'ateliers',
    date: 'Jeudi', heure: '14h-16h', lieu: 'Maison des arts du Grütli',
    organisateur: 'Arts & Seniors GE', prix: 'CHF 15', distance: '1.8 km',
    places: 10, badge: null, intensite: null,
  },
  {
    id: '6', emoji: '🚶', titre: 'Marche nordique en groupe', categorie: 'sorties',
    date: 'Samedi', heure: '9h-10h30', lieu: 'Parc des Bastions',
    organisateur: 'Club Marche Genève', prix: 'Gratuit', distance: '0.5 km',
    places: 15, badge: '⭐ Populaire', intensite: 'Modérée',
  },
  {
    id: '7', emoji: '💃', titre: 'Cours de danse de salon', categorie: 'sorties',
    date: 'Mercredi', heure: '18h-19h30', lieu: 'Salle Plainpalais',
    organisateur: 'Académie de danse GE', prix: 'CHF 12', distance: '2.3 km',
    places: 14, badge: null, intensite: 'Modérée',
  },
  {
    id: '8', emoji: '📚', titre: 'Club de lecture seniors', categorie: 'culture',
    date: 'Mardi', heure: '15h-17h', lieu: 'Bibliothèque des Eaux-Vives',
    organisateur: 'Bibliothèques Genève', prix: 'Gratuit', distance: '3.1 km',
    places: 20, badge: null, intensite: null,
  },
  {
    id: '9', emoji: '🏋️', titre: 'Gym douce en salle', categorie: 'sport',
    date: 'Lun Mer Ven', heure: '11h-12h', lieu: 'Centre sportif des Vernets',
    organisateur: 'Ville de Genève', prix: 'CHF 6', distance: '2.7 km',
    places: 16, badge: null, intensite: 'Douce',
  },
  {
    id: '10', emoji: '🎵', titre: 'Chorale seniors', categorie: 'culture',
    date: 'Jeudi', heure: '17h-18h30', lieu: 'Temple de la Fusterie',
    organisateur: 'Chœur Seniors GE', prix: 'Gratuit', distance: '1.9 km',
    places: 30, badge: null, intensite: null,
  },
  {
    id: '11', emoji: '🌱', titre: 'Jardinage partagé', categorie: 'ateliers',
    date: 'Samedi', heure: '10h-12h', lieu: 'Jardin partagé Champel',
    organisateur: 'Jardins urbains GE', prix: 'Gratuit', distance: '2.5 km',
    places: 8, badge: null, intensite: 'Douce',
  },
  {
    id: '12', emoji: '🎯', titre: 'Pétanque en plein air', categorie: 'sorties',
    date: 'Dimanche', heure: '14h-16h', lieu: 'Place du Bourg-de-Four',
    organisateur: 'Club Pétanque GE', prix: 'Gratuit', distance: '1.6 km',
    places: 20, badge: null, intensite: 'Douce',
  },
]

function CarteActivite({ item, onPress }: { item: typeof ACTIVITES[0]; onPress: () => void }) {
  const [sauvegarde, setSauvegarde] = useState(false)
  return (
    <Carte onPress={onPress} padding="md" style={styles.activiteCarte}>
      <View style={styles.activiteHeader}>
        <View style={styles.activiteEmoji}>
          <Texte variante="displayMd">{item.emoji}</Texte>
        </View>
        <View style={{ flex: 1 }}>
          <Texte variante="corpsgrand">{item.titre}</Texte>
          <Texte variante="legende" couleur={couleurs.texteSecondaire}>{item.organisateur}</Texte>
        </View>
        <TouchableOpacity onPress={() => setSauvegarde(!sauvegarde)} style={styles.heartBtn}>
          <Texte variante="corpsgrand">{sauvegarde ? '❤️' : '🤍'}</Texte>
        </TouchableOpacity>
      </View>
      <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>📅 {item.date} · {item.heure}</Texte>
      <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>📍 {item.lieu}</Texte>
      <View style={styles.activiteBadges}>
        <Badge texte={item.prix === 'Gratuit' ? '✓ Gratuit' : item.prix} variante={item.prix === 'Gratuit' ? 'succes' : 'neutre'} />
        <Badge texte={item.distance} variante="neutre" />
        {item.places <= 10 && <Badge texte={`${item.places} places`} variante="attention" />}
        {item.badge && <Badge texte={item.badge} variante="primaire" />}
      </View>
    </Carte>
  )
}

function CalendarImportModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [icalUrl, setIcalUrl] = useState('')
  const [synced, setSynced] = useState(false)

  const handleImport = () => {
    setSynced(true)
    setTimeout(() => { setSynced(false); onClose() }, 2500)
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Texte variante="titre">Importer mon calendrier</Texte>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={24} color={couleurs.texte} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire} style={{ marginBottom: espacement.xl }}>
          Synchronisez vos rendez-vous avec Senior +
        </Texte>

        {synced ? (
          <View style={styles.syncedState}>
            <Texte variante="displayMd" align="center">✅</Texte>
            <Texte variante="titre" align="center">Calendrier synchronisé !</Texte>
            <Texte variante="corps" couleur={couleurs.texteSecondaire} align="center">
              3 nouveaux rendez-vous importés avec succès
            </Texte>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {[
              { emoji: '🗓️', titre: 'Google Calendar', sous: 'Connecter mon compte Google', couleur: '#4285F4' },
              { emoji: '📧', titre: 'Outlook / Office 365', sous: 'Connecter mon compte Microsoft', couleur: '#0078D4' },
              { emoji: '🍎', titre: 'Apple Calendar', sous: 'Synchroniser iCloud Calendar', couleur: '#555' },
            ].map((opt) => (
              <TouchableOpacity key={opt.titre} style={styles.importOption} onPress={handleImport}>
                <View style={[styles.importIcone, { backgroundColor: opt.couleur + '15' }]}>
                  <Texte variante="displayMd">{opt.emoji}</Texte>
                </View>
                <View style={{ flex: 1 }}>
                  <Texte variante="corpsgrand">{opt.titre}</Texte>
                  <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>{opt.sous}</Texte>
                </View>
                <Texte variante="legende" couleur={couleurs.primaire}>→</Texte>
              </TouchableOpacity>
            ))}

            <View style={styles.icalSection}>
              <View style={styles.icalHeader}>
                <Link size={18} color={couleurs.texteSecondaire} strokeWidth={2} />
                <Texte variante="corpsgrand">Lien iCal / URL</Texte>
              </View>
              <TextInput
                style={styles.icalInput}
                placeholder="https://calendar.example.com/..."
                value={icalUrl}
                onChangeText={setIcalUrl}
                autoCapitalize="none"
                keyboardType="url"
                placeholderTextColor={couleurs.ardoiseLighter}
              />
              <Bouton variante="secondaire" pleineLargeur onPress={handleImport}>
                Importer depuis cette URL
              </Bouton>
            </View>

            <Carte padding="md" couleurFond={couleurs.infoBackground} ombre={false}>
              <Texte variante="corpsPetit" couleur={couleurs.info}>
                🔒 Senior + n'accède qu'aux événements que vous sélectionnez. Vos données restent strictement privées.
              </Texte>
            </Carte>
          </ScrollView>
        )}
      </View>
    </Modal>
  )
}

export default function ActivitesScreen() {
  const router = useRouter()
  const [categorie, setCategorie] = useState('toutes')
  const [jour, setJour] = useState('semaine')
  const [recherche, setRecherche] = useState('')
  const [importModal, setImportModal] = useState(false)

  const activitesFiltrees = ACTIVITES.filter((a) => {
    const matchCat = categorie === 'toutes' || a.categorie === categorie
    const matchRech = a.titre.toLowerCase().includes(recherche.toLowerCase()) || recherche === ''
    return matchCat && matchRech
  })

  const activitesLibres = activitesFiltrees.slice(0, 5)
  const activitesPremium = activitesFiltrees.slice(5)

  return (
    <Ecran padding={false} scrollable={false}>
      <CalendarImportModal visible={importModal} onClose={() => setImportModal(false)} />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Texte variante="displayMd">Activités</Texte>
            <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>
              Genève · {activitesFiltrees.length} disponibles cette semaine
            </Texte>
          </View>
          <TouchableOpacity style={styles.calendarBtn} onPress={() => setImportModal(true)}>
            <Calendar size={22} color={couleurs.primaire} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={18} color={couleurs.ardoiseLighter} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une activité..."
            value={recherche}
            onChangeText={setRecherche}
            placeholderTextColor={couleurs.ardoiseLighter}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtresContent}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.filtrePill, categorie === c.id && styles.filtrePillActif]}
              onPress={() => setCategorie(c.id)}
            >
              <Texte variante="corpsPetit" couleur={categorie === c.id ? couleurs.blanc : couleurs.texte}>
                {c.emoji} {c.label}
              </Texte>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtresContent}>
          {JOURS.map((j) => (
            <TouchableOpacity
              key={j.id}
              style={[styles.jourPill, jour === j.id && styles.jourPillActif]}
              onPress={() => setJour(j.id)}
            >
              <Texte variante="legende" couleur={jour === j.id ? couleurs.primaire : couleurs.texteSecondaire}>
                {j.label}
              </Texte>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={activitesLibres}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CarteActivite
            item={item}
            onPress={() => router.push(`/(profite)/activities/${item.id}` as any)}
          />
        )}
        contentContainerStyle={styles.liste}
        ListFooterComponent={
          activitesPremium.length > 0 ? (
            <Cadenas fonctionnalite="activitesMax" afficherApercu={false}>
              {activitesPremium.map((item) => (
                <CarteActivite key={item.id} item={item} onPress={() => {}} />
              ))}
            </Cadenas>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
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
    borderBottomWidth: 1,
    borderBottomColor: couleurs.bordure,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  calendarBtn: {
    width: 44, height: 44, borderRadius: arrondi.lg,
    backgroundColor: couleurs.primaire + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', gap: espacement.sm,
    backgroundColor: couleurs.brumeLight, borderRadius: arrondi.xl,
    paddingHorizontal: espacement.md, height: 48,
  },
  searchInput: {
    flex: 1, fontSize: 16, color: couleurs.texte, fontFamily: 'Nunito-Regular',
  },
  filtresContent: { gap: espacement.sm, paddingRight: espacement.lg },
  filtrePill: {
    paddingHorizontal: espacement.md, paddingVertical: espacement.sm,
    borderRadius: arrondi.full, backgroundColor: couleurs.brumeLight,
  },
  filtrePillActif: { backgroundColor: couleurs.primaire },
  jourPill: {
    paddingHorizontal: espacement.md, paddingVertical: espacement.xs,
    borderRadius: arrondi.full, borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  jourPillActif: { borderBottomColor: couleurs.primaire },
  liste: { padding: espacement.lg, gap: espacement.md, paddingBottom: 100 },
  activiteCarte: { gap: espacement.sm },
  activiteHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: espacement.md },
  activiteEmoji: {
    width: 48, height: 48, borderRadius: arrondi.lg,
    backgroundColor: couleurs.saugeLighter + '40',
    alignItems: 'center', justifyContent: 'center',
  },
  heartBtn: { padding: espacement.xs },
  activiteBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: espacement.xs },
  modalContainer: {
    flex: 1, backgroundColor: couleurs.blanc, padding: espacement.xl,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: espacement.sm,
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: couleurs.brumeLight,
    alignItems: 'center', justifyContent: 'center',
  },
  importOption: {
    flexDirection: 'row', alignItems: 'center', gap: espacement.md,
    paddingVertical: espacement.lg,
    borderBottomWidth: 1, borderBottomColor: couleurs.bordure,
  },
  importIcone: {
    width: 52, height: 52, borderRadius: arrondi.lg,
    alignItems: 'center', justifyContent: 'center',
  },
  icalSection: { gap: espacement.md, paddingVertical: espacement.xl },
  icalHeader: { flexDirection: 'row', alignItems: 'center', gap: espacement.sm },
  icalInput: {
    height: 48, borderWidth: 1, borderColor: couleurs.bordure,
    borderRadius: arrondi.lg, paddingHorizontal: espacement.md,
    fontSize: 14, fontFamily: 'Nunito-Regular', color: couleurs.texte,
  },
  syncedState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: espacement.xl },
})
