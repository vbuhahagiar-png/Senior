import React from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Phone, MessageCircle, FileText, BookOpen, Calendar, HelpCircle } from 'lucide-react-native'
import { Texte } from '@/components/ui/Text'
import { Bouton } from '@/components/ui/Button'
import { Carte } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SelecteurHumeur } from '@/components/ritual/MoodSelector'
import { Ecran } from '@/components/layout/Screen'
import { Cadenas } from '@/components/ui/FeatureLock'
import { couleurs, espacement, palette, arrondi, ombres } from '@/lib/theme'
import { useAuth } from '@/hooks/useAuth'
import { useRitual } from '@/hooks/useRitual'
import { formaterDateLong } from '@/lib/utils'
import { getCitationDuJour } from '@/types/ritual'
import type { NiveauHumeur } from '@/types/ritual'
import { ROUTES } from '@/lib/constants'

const SEMAINE = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const RITUELS_SEMAINE = [true, true, true, true, false, false, false]

const CERCLE_DEMO = [
  { initiales: 'S', nom: 'Sophie', lien: 'Fille', connectee: true, messages: 0 },
  { initiales: 'JL', nom: 'Jean-Louis', lien: 'Mari', connectee: true, messages: 2 },
  { initiales: 'DM', nom: 'Dr. Müller', lien: 'Médecin', connectee: false, messages: 0 },
]

export default function AccueilProfite() {
  const router = useRouter()
  const { profil } = useAuth()
  const { estComplet, humeur, etapesEffectuees, enregistrerHumeur, validerEtape, finaliserRituel } = useRitual()

  const dateAujourdhuiLong = formaterDateLong(new Date())
  const citation = getCitationDuJour()
  const prenom = profil?.display_name?.split(' ')[0] ?? 'vous'
  const progression = etapesEffectuees.length / 3

  const etapesMeta = [
    { id: 'humeur', label: 'Mon humeur', emoji: '😊', description: 'Comment vous sentez-vous ?' },
    { id: 'medicaments', label: 'Médicaments', emoji: '💊', description: 'Doliprane 500mg · Matin' },
    { id: 'mouvement', label: 'Mouvement', emoji: '🚶', description: '10 minutes de marche' },
  ]

  return (
    <Ecran scrollable>
      {/* En-tête */}
      <LinearGradient
        colors={[palette.saugeLighter + '50', palette.ivoire]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Texte variante="legende" couleur={couleurs.texteSecondaire}>{dateAujourdhuiLong}</Texte>
            <Texte variante="displayMd">Bonjour {prenom} 👋</Texte>
          </View>
          <View style={styles.streakBadge}>
            <Texte variante="displayMd">🔥</Texte>
            <Texte variante="corpsPetit" couleur={couleurs.primaireFonce}>5 jours</Texte>
          </View>
        </View>

        {/* Barre de progression rituel */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progression * 100}%` as any }]} />
          </View>
          <Texte variante="corpsPetit" couleur={couleurs.primaireFonce}>
            {estComplet ? 'Rituel complété ✓' : `Rituel du matin ${etapesEffectuees.length}/3`}
          </Texte>
        </View>
      </LinearGradient>

      {/* Bannière complété */}
      {estComplet && (
        <View style={styles.completBanner}>
          <Texte variante="corpsgrand" align="center">🌟 Bravo {prenom} !</Texte>
          <Texte variante="corpsPetit" couleur={couleurs.primaireFonce} align="center">
            Rituel du matin complété · Belle journée !
          </Texte>
        </View>
      )}

      {/* Rituel du matin */}
      {!estComplet && (
        <View style={styles.section}>
          <Texte variante="titre">Rituel du matin</Texte>

          <Carte padding="lg" style={styles.carteHumeur}>
            <Texte variante="corpsgrand">Comment vous sentez-vous ?</Texte>
            <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>
              Appuyez sur un emoji pour indiquer votre humeur
            </Texte>
            <SelecteurHumeur
              valeur={humeur}
              onChange={(h: NiveauHumeur) => enregistrerHumeur(h)}
            />
          </Carte>

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
                    <View style={[styles.etapeIcone, fait && styles.etapeIconeFaite]}>
                      <Texte variante="corpsgrand">{fait ? '✓' : e.emoji}</Texte>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Texte variante="corps" style={fait && { textDecorationLine: 'line-through' as any }}>
                        {e.label}
                      </Texte>
                      <Texte variante="legende" couleur={couleurs.texteSecondaire}>{e.description}</Texte>
                    </View>
                    {fait && <Badge texte="Fait" variante="succes" />}
                  </View>
                </Carte>
              )
            })}
          </View>

          {humeur && etapesEffectuees.length >= 1 && (
            <Bouton variante="primaire" pleineLargeur onPress={finaliserRituel}>
              Terminer le rituel du matin
            </Bouton>
          )}
        </View>
      )}

      {/* Ma semaine */}
      <Carte padding="md" style={styles.semaineCarte}>
        <Texte variante="corpsgrand" style={{ marginBottom: espacement.sm }}>Ma semaine 📅</Texte>
        <View style={styles.semaineJours}>
          {SEMAINE.map((jour, i) => (
            <View key={i} style={styles.semaineJour}>
              <Texte variante="legende" couleur={couleurs.texteSecondaire}>{jour}</Texte>
              <View style={[
                styles.jourDot,
                i === 3 && styles.jourAujourd,
                RITUELS_SEMAINE[i] && styles.jourFait,
                !RITUELS_SEMAINE[i] && i < 3 && styles.jourManque,
              ]}>
                {RITUELS_SEMAINE[i] && <Texte variante="legende" couleur={couleurs.blanc}>✓</Texte>}
              </View>
            </View>
          ))}
        </View>
        <Texte variante="corpsPetit" couleur={couleurs.primaireFonce}>
          🔥 4 jours consécutifs · Continuez comme ça !
        </Texte>
      </Carte>

      {/* Aujourd'hui */}
      <View style={styles.section}>
        <Texte variante="titre">Aujourd'hui</Texte>

        <Carte padding="md" style={styles.infoCard}>
          <View style={styles.infoLigne}>
            <Texte variante="displayMd">☀️</Texte>
            <View style={{ flex: 1 }}>
              <Texte variante="corpsgrand">22°C · Genève</Texte>
              <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>Parfait pour une sortie</Texte>
            </View>
          </View>
        </Carte>

        <Carte padding="md" onPress={() => router.push('/(profite)/activities/' as any)} style={styles.infoCard}>
          <View style={styles.infoLigne}>
            <View style={[styles.infoIcone, { backgroundColor: couleurs.primaire + '20' }]}>
              <Calendar size={22} color={couleurs.primaire} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Texte variante="corpsgrand">Aquagym seniors</Texte>
              <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>
                Mardi 10h · Piscine des Bains des Pâquis · Gratuit
              </Texte>
            </View>
            <Texte variante="legende" couleur={couleurs.primaire}>Voir →</Texte>
          </View>
        </Carte>

        <Carte padding="md" style={[styles.infoCard, { borderLeftWidth: 4, borderLeftColor: couleurs.erreur }]}>
          <View style={styles.infoLigne}>
            <Texte variante="displayMd">💊</Texte>
            <View style={{ flex: 1 }}>
              <Texte variante="corpsgrand">Doliprane 500mg</Texte>
              <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>
                À prendre avec le repas de midi
              </Texte>
            </View>
            <Badge texte="Midi" variante="attention" />
          </View>
        </Carte>
      </View>

      {/* Mon cercle */}
      <View style={styles.section}>
        <View style={styles.ligneSection}>
          <Texte variante="titre">Mon cercle 👨‍👩‍👧</Texte>
          <TouchableOpacity onPress={() => router.push('/(profite)/circle/' as any)}>
            <Texte variante="corpsPetit" couleur={couleurs.primaire}>Voir tout →</Texte>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cercleListe}>
          {CERCLE_DEMO.map((m) => (
            <Carte key={m.nom} padding="md" style={styles.membreCarte}>
              <View style={[styles.membreAvatar, { backgroundColor: m.connectee ? couleurs.primaire : couleurs.ardoiseLighter }]}>
                <Texte variante="corpsgrand" couleur={couleurs.blanc}>{m.initiales}</Texte>
              </View>
              <Texte variante="corpsPetit" align="center">{m.nom}</Texte>
              <Texte variante="legende" couleur={couleurs.texteSecondaire} align="center">{m.lien}</Texte>
              {m.messages > 0 && (
                <View style={styles.messageBadge}>
                  <Texte variante="legende" couleur={couleurs.blanc}>{m.messages}</Texte>
                </View>
              )}
              <View style={[styles.statusDot, { backgroundColor: m.connectee ? couleurs.succes : couleurs.ardoiseLighter }]} />
            </Carte>
          ))}
        </ScrollView>
      </View>

      {/* Activité du jour */}
      <View style={styles.section}>
        <View style={styles.ligneSection}>
          <Texte variante="titre">Activités près de vous</Texte>
          <TouchableOpacity onPress={() => router.push('/(profite)/activities/' as any)}>
            <Texte variante="corpsPetit" couleur={couleurs.primaire}>Voir tout →</Texte>
          </TouchableOpacity>
        </View>
        <Carte onPress={() => router.push('/(profite)/activities/' as any)} padding="lg" style={styles.activiteFeatured}>
          <Badge texte="⭐ Populaire" variante="primaire" />
          <Texte variante="titre">🏊 Aquagym seniors</Texte>
          <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>
            Mardi & Jeudi · 10h-11h · Piscine des Bains des Pâquis
          </Texte>
          <View style={styles.activiteMeta}>
            <Badge texte="Gratuit" variante="succes" />
            <Texte variante="legende" couleur={couleurs.texteSecondaire}>0.8 km · 8 places</Texte>
          </View>
          <Bouton variante="primaire" taille="sm" onPress={() => router.push('/(profite)/activities/' as any)}>
            S'inscrire
          </Bouton>
        </Carte>
      </View>

      {/* Citation du jour */}
      <Carte padding="lg" couleurFond={palette.saugeLighter + '30'} style={styles.citation}>
        <Texte variante="displayMd" couleur={couleurs.primaireFonce} align="center">"</Texte>
        <Texte variante="corps" couleur={couleurs.ardoise} align="center" style={styles.texteCitation}>
          {citation.texte}
        </Texte>
        <Texte variante="legende" couleur={couleurs.texteSecondaire} align="center">— {citation.auteur}</Texte>
      </Carte>

      {/* Accès rapide */}
      <View style={styles.section}>
        <Texte variante="titre">Accès rapide</Texte>
        <View style={styles.accesList}>
          {[
            { icone: FileText, label: 'Courriers', route: '/(profite)/letters/' as any, couleur: couleurs.accent },
            { icone: Calendar, label: 'Activités', route: '/(profite)/activities/' as any, couleur: couleurs.primaire },
            { icone: MessageCircle, label: 'Compagnon', route: '/(profite)/companion/' as any, couleur: '#7B68EE' },
            { icone: HelpCircle, label: 'Aide & Contact', route: '/(profite)/contact/' as any, couleur: couleurs.info },
          ].map(({ icone: Icone, label, route, couleur }) => (
            <TouchableOpacity key={label} style={styles.accesItem} onPress={() => router.push(route)}>
              <View style={[styles.accesIcone, { backgroundColor: couleur + '15' }]}>
                <Icone size={26} color={couleur} strokeWidth={1.8} />
              </View>
              <Texte variante="corpsPetit" align="center">{label}</Texte>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Ecran>
  )
}

const styles = StyleSheet.create({
  header: {
    gap: espacement.md,
    paddingVertical: espacement.lg,
    marginBottom: espacement.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  streakBadge: {
    alignItems: 'center',
    backgroundColor: couleurs.blanc,
    borderRadius: arrondi.lg,
    paddingHorizontal: espacement.md,
    paddingVertical: espacement.sm,
    ...ombres.sm as object,
  },
  progressContainer: { gap: espacement.xs },
  progressBar: {
    height: 8,
    backgroundColor: couleurs.brumeLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: couleurs.primaire,
    borderRadius: 4,
  },
  completBanner: {
    backgroundColor: couleurs.succesBackground,
    borderRadius: arrondi.lg,
    padding: espacement.lg,
    marginBottom: espacement.xl,
    gap: espacement.xs,
    borderWidth: 1,
    borderColor: couleurs.succes + '40',
  },
  section: { gap: espacement.md, marginBottom: espacement.xl },
  ligneSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carteHumeur: { gap: espacement.md },
  etapes: { gap: espacement.sm },
  etape: { borderWidth: 1, borderColor: couleurs.bordure },
  etapeFaite: {
    borderColor: couleurs.primaire + '40',
    backgroundColor: couleurs.saugeLighter + '20',
  },
  ligneEtape: { flexDirection: 'row', alignItems: 'center', gap: espacement.md },
  etapeIcone: {
    width: 44,
    height: 44,
    borderRadius: arrondi.lg,
    backgroundColor: couleurs.brumeLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  etapeIconeFaite: { backgroundColor: couleurs.primaire + '20' },
  semaineCarte: { marginBottom: espacement.xl, gap: espacement.sm },
  semaineJours: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: espacement.xs },
  semaineJour: { alignItems: 'center', gap: espacement.xs },
  jourDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: couleurs.brumeLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jourAujourd: { borderWidth: 2, borderColor: couleurs.primaire },
  jourFait: { backgroundColor: couleurs.primaire },
  jourManque: { backgroundColor: couleurs.erreurBackground },
  infoCard: { borderRadius: arrondi.lg },
  infoLigne: { flexDirection: 'row', alignItems: 'center', gap: espacement.md },
  infoIcone: {
    width: 44,
    height: 44,
    borderRadius: arrondi.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cercleListe: { marginHorizontal: -espacement.sm },
  membreCarte: {
    alignItems: 'center',
    gap: espacement.xs,
    marginHorizontal: espacement.sm,
    width: 90,
    position: 'relative',
  },
  membreAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: couleurs.erreur,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    position: 'absolute',
    bottom: 32,
    right: 14,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: couleurs.blanc,
  },
  activiteFeatured: { gap: espacement.sm },
  activiteMeta: { flexDirection: 'row', alignItems: 'center', gap: espacement.md },
  citation: { marginBottom: espacement.xl, gap: espacement.sm },
  texteCitation: { fontStyle: 'italic' },
  accesList: { flexDirection: 'row', justifyContent: 'space-between' },
  accesItem: { alignItems: 'center', gap: espacement.sm, flex: 1 },
  accesIcone: {
    width: 60,
    height: 60,
    borderRadius: arrondi.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
