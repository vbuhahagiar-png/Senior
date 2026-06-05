import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Plus, CheckSquare, Square, Phone, Mail, ChevronRight, Bell } from 'lucide-react-native'
import { Texte } from '@/components/ui/Text'
import { Carte } from '@/components/ui/Card'
import { Bouton } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Cadenas } from '@/components/ui/FeatureLock'
import { couleurs, espacement, arrondi } from '@/lib/theme'
import { Linking } from 'react-native'

const SENIOR_DEMO = {
  nom: 'Marie Dubois',
  age: 71,
  ville: 'Genève',
  telephone: 'tel:+41791234567',
  rituelAujourd: true,
  humeurAujourd: '😊 Bien',
  medicamentsPris: true,
}

const MEMBRES_DEMO = [
  {
    id: '1', nom: 'Sophie Martin', initiales: 'SM', lien: 'Fille (vous)',
    role: 'Admin', telephone: 'tel:+41797654321', actif: true,
    derniereConnexion: "Aujourd'hui",
  },
  {
    id: '2', nom: 'Jean-Louis Dubois', initiales: 'JL', lien: 'Mari',
    role: 'Aidant', telephone: 'tel:+41791111222', actif: true,
    derniereConnexion: "Aujourd'hui",
  },
  {
    id: '3', nom: 'Pierre Dubois', initiales: 'PD', lien: 'Fils',
    role: 'Aidant', telephone: 'tel:+41793333444', actif: true,
    derniereConnexion: 'Hier',
  },
  {
    id: '4', nom: 'Dr. Müller', initiales: 'DM', lien: 'Médecin traitant',
    role: 'Lecture seule', telephone: 'tel:+41229876543', actif: false,
    derniereConnexion: 'il y a 5j',
  },
]

const TACHES_DEMO = [
  {
    id: '1', titre: 'Appel du matin', assigne: 'Sophie', fait: true,
    echeance: "Aujourd'hui 09h00", priorite: 'normale',
  },
  {
    id: '2', titre: 'Accompagner au cardiologue', assigne: 'Sophie', fait: false,
    echeance: 'Lundi 9 juin · 09h00', priorite: 'haute',
  },
  {
    id: '3', titre: 'Renouveler ordonnance Doliprane', assigne: 'Jean-Louis', fait: false,
    echeance: 'Avant le 13 juin', priorite: 'haute',
  },
  {
    id: '4', titre: 'Courses alimentaires', assigne: 'Pierre', fait: false,
    echeance: 'Vendredi', priorite: 'normale',
  },
  {
    id: '5', titre: 'Réserver taxi médical', assigne: 'Sophie', fait: false,
    echeance: 'Dimanche soir', priorite: 'normale',
  },
]

const ACTIVITE_RECENTE = [
  { id: '1', qui: 'Marie', quoi: 'a complété son rituel du matin', quand: 'il y a 2h', icone: '✅' },
  { id: '2', qui: 'Marie', quoi: 'a pris ses médicaments du midi', quand: 'il y a 4h', icone: '💊' },
  { id: '3', qui: 'Jean-Louis', quoi: 'a laissé un message dans le fil famille', quand: 'il y a 5h', icone: '💬' },
  { id: '4', qui: 'Marie', quoi: "s'est inscrite à l'aquagym", quand: 'il y a 2j', icone: '🏊' },
]

export default function CercleAidantsScreen() {
  const [taches, setTaches] = useState(TACHES_DEMO)

  const toggleTache = (id: string) => {
    setTaches((prev) => prev.map((t) => t.id === id ? { ...t, fait: !t.fait } : t))
  }

  const tachesEnAttente = taches.filter((t) => !t.fait).length

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Statut rapide de Marie */}
      <View style={styles.seniorCard}>
        <View style={styles.seniorHeader}>
          <View style={styles.seniorAvatar}>
            <Texte variante="titre" couleur={couleurs.blanc}>MD</Texte>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Texte variante="corpsgrand">{SENIOR_DEMO.nom}</Texte>
            <Texte variante="legende" couleur={couleurs.texteSecondaire}>
              {SENIOR_DEMO.ville} · {SENIOR_DEMO.age} ans
            </Texte>
          </View>
          <View style={[styles.statutDot, { backgroundColor: couleurs.succes }]} />
          <Texte variante="legende" couleur={couleurs.succes}>Active</Texte>
        </View>

        <View style={styles.seniorStats}>
          <View style={styles.seniorStatItem}>
            <Texte variante="corpsgrand">
              {SENIOR_DEMO.rituelAujourd ? '✅' : '⏳'}
            </Texte>
            <Texte variante="legende" couleur={couleurs.texteSecondaire}>Rituel</Texte>
          </View>
          <View style={styles.seniorStatDivider} />
          <View style={styles.seniorStatItem}>
            <Texte variante="corpsgrand">{SENIOR_DEMO.humeurAujourd}</Texte>
            <Texte variante="legende" couleur={couleurs.texteSecondaire}>Humeur</Texte>
          </View>
          <View style={styles.seniorStatDivider} />
          <View style={styles.seniorStatItem}>
            <Texte variante="corpsgrand">{SENIOR_DEMO.medicamentsPris ? '💊✓' : '💊?'}</Texte>
            <Texte variante="legende" couleur={couleurs.texteSecondaire}>Médic.</Texte>
          </View>
        </View>

        <TouchableOpacity
          style={styles.appelSeniorBtn}
          onPress={() => Linking.openURL(SENIOR_DEMO.telephone)}
        >
          <Phone size={18} color={couleurs.primaire} strokeWidth={2} />
          <Texte variante="corpsPetit" couleur={couleurs.primaire}>Appeler Marie</Texte>
        </TouchableOpacity>
      </View>

      {/* Tâches & Rotations */}
      <Cadenas fonctionnalite="cercleCareComplet">
        <View style={styles.section}>
          <View style={styles.ligneSection}>
            <View>
              <Texte variante="titre">Tâches & Rotations</Texte>
              {tachesEnAttente > 0 && (
                <Texte variante="legende" couleur={couleurs.attention}>
                  {tachesEnAttente} tâche{tachesEnAttente > 1 ? 's' : ''} en attente
                </Texte>
              )}
            </View>
            <Bouton
              variante="primaire"
              taille="sm"
              icone={<Plus size={16} color={couleurs.blanc} strokeWidth={2.5} />}
              onPress={() => {}}
            >
              Ajouter
            </Bouton>
          </View>

          {taches.map((t) => (
            <TouchableOpacity key={t.id} onPress={() => toggleTache(t.id)} activeOpacity={0.8}>
              <Carte padding="md" style={styles.tacheCarte}>
                <View style={styles.tacheLigne}>
                  {t.fait
                    ? <CheckSquare size={24} color={couleurs.succes} strokeWidth={2} />
                    : <Square size={24} color={t.priorite === 'haute' ? couleurs.erreur : couleurs.bordure} strokeWidth={2} />
                  }
                  <View style={styles.tacheContenu}>
                    <Texte
                      variante="corpsgrand"
                      style={t.fait && styles.texteFait}
                      couleur={t.fait ? couleurs.texteSecondaire : undefined}
                    >
                      {t.titre}
                    </Texte>
                    <View style={styles.tacheMeta}>
                      <Badge
                        texte={t.assigne}
                        variante="neutre"
                      />
                      <Texte variante="legende" couleur={t.fait ? couleurs.texteTertiaire : t.priorite === 'haute' ? couleurs.erreur : couleurs.texteSecondaire}>
                        📅 {t.echeance}
                      </Texte>
                    </View>
                  </View>
                  {t.priorite === 'haute' && !t.fait && (
                    <View style={styles.urgenceTag}>
                      <Texte variante="legende" couleur={couleurs.erreur}>!</Texte>
                    </View>
                  )}
                </View>
              </Carte>
            </TouchableOpacity>
          ))}
        </View>

        {/* Membres du cercle */}
        <View style={styles.section}>
          <View style={styles.ligneSection}>
            <Texte variante="titre">Membres du cercle ({MEMBRES_DEMO.length})</Texte>
          </View>

          {MEMBRES_DEMO.map((m) => (
            <Carte key={m.id} padding="md">
              <View style={styles.membreLigne}>
                <View style={[styles.membreAvatar, { backgroundColor: m.actif ? couleurs.primaire : couleurs.ardoiseLighter }]}>
                  <Texte variante="corpsPetit" couleur={couleurs.blanc}>{m.initiales}</Texte>
                </View>
                <View style={styles.membreContenu}>
                  <Texte variante="corpsgrand">{m.nom}</Texte>
                  <Texte variante="legende" couleur={couleurs.texteSecondaire}>{m.lien}</Texte>
                  <Texte variante="legende" couleur={couleurs.texteTertiaire}>
                    Dernière connexion : {m.derniereConnexion}
                  </Texte>
                </View>
                <View style={styles.membreDroite}>
                  <Badge
                    texte={m.role}
                    variante={m.role === 'Admin' ? 'primaire' : m.role === 'Aidant' ? 'accent' : 'neutre'}
                  />
                  <View style={styles.membreActions}>
                    <TouchableOpacity
                      style={styles.membreBtn}
                      onPress={() => Linking.openURL(m.telephone)}
                    >
                      <Phone size={16} color={couleurs.primaire} strokeWidth={2} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.membreBtn}>
                      <Mail size={16} color={couleurs.accent} strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Carte>
          ))}

          <Bouton
            variante="secondaire"
            pleineLargeur
            icone={<Mail size={18} color={couleurs.primaire} strokeWidth={2} />}
            onPress={() => {}}
          >
            Inviter un proche
          </Bouton>
        </View>

        {/* Activité récente */}
        <View style={styles.section}>
          <Texte variante="titre">Activité récente</Texte>
          {ACTIVITE_RECENTE.map((a) => (
            <Carte key={a.id} padding="md">
              <View style={styles.activiteLigne}>
                <View style={styles.activiteIcone}>
                  <Texte variante="corpsgrand">{a.icone}</Texte>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Texte variante="corpsPetit">
                    <Texte variante="corpsgrand">{a.qui}</Texte>
                    {' '}{a.quoi}
                  </Texte>
                  <Texte variante="legende" couleur={couleurs.texteTertiaire}>{a.quand}</Texte>
                </View>
              </View>
            </Carte>
          ))}
        </View>
      </Cadenas>

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: couleurs.ivoire },
  container: { padding: espacement.lg, gap: 0 },
  seniorCard: {
    backgroundColor: couleurs.blanc,
    borderRadius: arrondi.xl,
    padding: espacement.lg,
    marginBottom: espacement.xl,
    gap: espacement.md,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  seniorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.md,
  },
  seniorAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: couleurs.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  statutDot: { width: 10, height: 10, borderRadius: 5 },
  seniorStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: espacement.sm,
    borderTopWidth: 1, borderBottomWidth: 1,
    borderColor: couleurs.bordure,
  },
  seniorStatItem: { flex: 1, alignItems: 'center', gap: 4 },
  seniorStatDivider: { width: 1, height: 30, backgroundColor: couleurs.bordure },
  appelSeniorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacement.sm,
    paddingVertical: espacement.sm,
    borderRadius: arrondi.lg,
    borderWidth: 1,
    borderColor: couleurs.primaire + '40',
    backgroundColor: couleurs.primaire + '08',
  },
  section: { gap: espacement.md, marginBottom: espacement.xl },
  ligneSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tacheCarte: {},
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
    flexWrap: 'wrap',
  },
  texteFait: { textDecorationLine: 'line-through' },
  urgenceTag: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: couleurs.erreur + '15',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: couleurs.erreur + '40',
  },
  membreLigne: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espacement.md,
  },
  membreAvatar: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  membreContenu: { flex: 1, gap: 2 },
  membreDroite: { gap: espacement.sm, alignItems: 'flex-end' },
  membreActions: { flexDirection: 'row', gap: espacement.sm },
  membreBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: couleurs.brumeLight,
    alignItems: 'center', justifyContent: 'center',
  },
  activiteLigne: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.md,
  },
  activiteIcone: {
    width: 40, height: 40, borderRadius: arrondi.lg,
    backgroundColor: couleurs.brumeLight,
    alignItems: 'center', justifyContent: 'center',
  },
})
