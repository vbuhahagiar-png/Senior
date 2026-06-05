import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native'
import {
  Users, Mail, Phone, Heart, Camera, Send, ChevronRight, Check,
} from 'lucide-react-native'
import { Texte } from '@/components/ui/Text'
import { Carte } from '@/components/ui/Card'
import { Bouton } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Cadenas } from '@/components/ui/FeatureLock'
import { couleurs, espacement, arrondi } from '@/lib/theme'
import { Linking } from 'react-native'

const MEMBRES_DEMO = [
  {
    id: '1', nom: 'Pierre Dubois', role: 'Fils', telephone: 'tel:+41791234567',
    statut: 'active' as const, derniereVisite: 'il y a 2h',
    partageHumeur: true, partageActivites: true, partageMedic: false,
  },
  {
    id: '2', nom: 'Sophie Martin', role: 'Fille', telephone: 'tel:+41797654321',
    statut: 'active' as const, derniereVisite: 'il y a 1j',
    partageHumeur: true, partageActivites: false, partageMedic: true,
  },
  {
    id: '3', nom: 'Jean-Louis Dubois', role: 'Mari', telephone: 'tel:+41791111222',
    statut: 'active' as const, derniereVisite: "aujourd'hui",
    partageHumeur: true, partageActivites: true, partageMedic: true,
  },
  {
    id: '4', nom: 'Dr. Müller', role: 'Médecin traitant', telephone: 'tel:+41229876543',
    statut: 'pending' as const, derniereVisite: 'il y a 5j',
    partageHumeur: false, partageActivites: false, partageMedic: true,
  },
]

const MESSAGES_DEMO = [
  {
    id: '1', auteur: 'Pierre', avatar: 'Pierre Dubois',
    texte: 'Bonjour maman ! Comment s\'est passée ta journée ? Je pense à toi 💛',
    date: 'il y a 2h', type: 'texte',
  },
  {
    id: '2', auteur: 'Sophie', avatar: 'Sophie Martin',
    texte: 'J\'ai vu que tu as complété ton rituel ce matin — bravo ! 🌟 On se voit vendredi ?',
    date: 'il y a 5h', type: 'texte',
  },
  {
    id: '3', auteur: 'Jean-Louis', avatar: 'Jean-Louis Dubois',
    texte: 'Bonne nuit ma chérie, à demain 🌙',
    date: 'hier à 22h', type: 'texte',
  },
]

export default function CercleProfiteScreen() {
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState(MESSAGES_DEMO)
  const [membreActif, setMembreActif] = useState<string | null>(null)

  const envoyerMessage = () => {
    if (!messageInput.trim()) return
    setMessages((prev) => [{
      id: Date.now().toString(),
      auteur: 'Moi',
      avatar: 'Marie Dubois',
      texte: messageInput.trim(),
      date: "à l'instant",
      type: 'texte',
    }, ...prev])
    setMessageInput('')
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* En-tête */}
      <View style={styles.entete}>
        <Texte variante="displayMd">Mon cercle familial</Texte>
        <Texte variante="corps" couleur={couleurs.texteSecondaire}>
          Vos proches qui vous accompagnent sur Senior +.
        </Texte>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Texte variante="titre" couleur={couleurs.primaire}>
              {MEMBRES_DEMO.filter((m) => m.statut === 'active').length}
            </Texte>
            <Texte variante="legende" couleur={couleurs.texteSecondaire}>Actifs</Texte>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Texte variante="titre" couleur={couleurs.accent}>{MEMBRES_DEMO.length}</Texte>
            <Texte variante="legende" couleur={couleurs.texteSecondaire}>Membres</Texte>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Texte variante="titre" couleur={couleurs.succes}>3</Texte>
            <Texte variante="legende" couleur={couleurs.texteSecondaire}>Messages</Texte>
          </View>
        </View>
      </View>

      {/* Membres */}
      <View style={styles.section}>
        <View style={styles.ligneSection}>
          <Texte variante="titre">Membres ({MEMBRES_DEMO.length})</Texte>
          <Bouton
            variante="secondaire"
            taille="sm"
            icone={<Mail size={16} color={couleurs.primaire} strokeWidth={2} />}
            onPress={() => {}}
          >
            Inviter
          </Bouton>
        </View>

        {MEMBRES_DEMO.map((m) => (
          <View key={m.id}>
            <TouchableOpacity
              onPress={() => setMembreActif(membreActif === m.id ? null : m.id)}
              activeOpacity={0.8}
            >
              <Carte padding="md">
                <View style={styles.membreLigne}>
                  <View style={styles.membreAvatarWrap}>
                    <Avatar nom={m.nom} taille="lg" />
                    {m.statut === 'active' && <View style={styles.membreOnline} />}
                  </View>
                  <View style={styles.membreContenu}>
                    <Texte variante="corpsgrand">{m.nom}</Texte>
                    <Texte variante="legende" couleur={couleurs.texteSecondaire}>{m.role}</Texte>
                    <Texte variante="legende" couleur={couleurs.texteTertiaire}>Vu {m.derniereVisite}</Texte>
                  </View>
                  <View style={styles.membreDroite}>
                    <Badge
                      texte={m.statut === 'active' ? 'Actif' : 'En attente'}
                      variante={m.statut === 'active' ? 'succes' : 'attention'}
                    />
                    <TouchableOpacity
                      style={styles.appelBtn}
                      onPress={() => Linking.openURL(m.telephone)}
                    >
                      <Phone size={16} color={couleurs.primaire} strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Détails partage */}
                {membreActif === m.id && (
                  <View style={styles.partageSection}>
                    <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire} style={{ marginBottom: espacement.sm }}>
                      Ce que vous partagez avec {m.nom.split(' ')[0]} :
                    </Texte>
                    {[
                      { label: 'Mon humeur quotidienne', valeur: m.partageHumeur },
                      { label: 'Mes activités', valeur: m.partageActivites },
                      { label: 'Mes médicaments', valeur: m.partageMedic },
                    ].map((item) => (
                      <View key={item.label} style={styles.partageLigne}>
                        <View style={[styles.partageCheck, item.valeur && styles.partageCheckActif]}>
                          {item.valeur && <Check size={12} color={couleurs.blanc} strokeWidth={3} />}
                        </View>
                        <Texte variante="corpsPetit">{item.label}</Texte>
                      </View>
                    ))}
                  </View>
                )}
              </Carte>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Fil familial */}
      <Cadenas fonctionnalite="filFamille">
        <View style={styles.section}>
          <Texte variante="titre">Fil familial</Texte>

          {/* Zone de saisie */}
          <Carte padding="md" style={styles.saisieCard}>
            <TextInput
              style={styles.saisieInput}
              value={messageInput}
              onChangeText={setMessageInput}
              placeholder="Écrivez un message à votre famille..."
              placeholderTextColor={couleurs.texteTertiaire}
              multiline
              maxLength={300}
            />
            <View style={styles.saisieBtnRow}>
              <TouchableOpacity style={styles.saisieIconBtn}>
                <Camera size={20} color={couleurs.texteSecondaire} strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.saisieIconBtn}>
                <Heart size={20} color={couleurs.texteSecondaire} strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.envoiBtn, !messageInput.trim() && styles.envoiBtnInactif]}
                onPress={envoyerMessage}
                disabled={!messageInput.trim()}
              >
                <Send size={18} color={couleurs.blanc} strokeWidth={2} />
                <Texte variante="corpsPetit" couleur={couleurs.blanc}>Envoyer</Texte>
              </TouchableOpacity>
            </View>
          </Carte>

          {/* Messages */}
          {messages.map((msg) => (
            <Carte key={msg.id} padding="md" style={styles.messageCard}>
              <View style={styles.messageLigne}>
                <Avatar nom={msg.avatar} taille="sm" />
                <View style={styles.messageContenu}>
                  <View style={styles.messageHeader}>
                    <Texte variante="corpsgrand">{msg.auteur}</Texte>
                    <Texte variante="legende" couleur={couleurs.texteTertiaire}>{msg.date}</Texte>
                  </View>
                  <Texte variante="corps" style={{ lineHeight: 22 }}>{msg.texte}</Texte>
                  <View style={styles.reactionRow}>
                    <TouchableOpacity style={styles.reactionBtn}>
                      <Texte variante="legende">❤️ Aimer</Texte>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reactionBtn}>
                      <Texte variante="legende">💬 Répondre</Texte>
                    </TouchableOpacity>
                  </View>
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
  entete: {
    gap: espacement.sm,
    marginBottom: espacement.xl,
    backgroundColor: couleurs.blanc,
    padding: espacement.lg,
    borderRadius: arrondi.xl,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: espacement.sm,
    paddingTop: espacement.sm,
    borderTopWidth: 1,
    borderTopColor: couleurs.bordure,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: couleurs.bordure },
  section: { gap: espacement.md, marginBottom: espacement.xl },
  ligneSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  membreLigne: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espacement.md,
  },
  membreAvatarWrap: { position: 'relative' },
  membreOnline: {
    position: 'absolute', bottom: 2, right: 2,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: couleurs.succes,
    borderWidth: 2, borderColor: couleurs.blanc,
  },
  membreContenu: { flex: 1, gap: 2 },
  membreDroite: { gap: espacement.sm, alignItems: 'flex-end' },
  appelBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: couleurs.primaire + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  partageSection: {
    marginTop: espacement.md,
    paddingTop: espacement.md,
    borderTopWidth: 1,
    borderTopColor: couleurs.bordure,
    gap: espacement.sm,
  },
  partageLigne: { flexDirection: 'row', alignItems: 'center', gap: espacement.sm },
  partageCheck: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: couleurs.bordure,
    alignItems: 'center', justifyContent: 'center',
  },
  partageCheckActif: {
    backgroundColor: couleurs.succes,
    borderColor: couleurs.succes,
  },
  saisieCard: { gap: espacement.sm },
  saisieInput: {
    color: couleurs.texte,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 60,
    maxHeight: 120,
  },
  saisieBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.sm,
  },
  saisieIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: couleurs.brumeLight,
    alignItems: 'center', justifyContent: 'center',
  },
  envoiBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacement.xs,
    backgroundColor: couleurs.primaire,
    paddingHorizontal: espacement.md,
    paddingVertical: espacement.sm,
    borderRadius: arrondi.full,
  },
  envoiBtnInactif: { opacity: 0.4 },
  messageCard: {},
  messageLigne: {
    flexDirection: 'row',
    gap: espacement.md,
    alignItems: 'flex-start',
  },
  messageContenu: { flex: 1, gap: espacement.xs },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reactionRow: {
    flexDirection: 'row',
    gap: espacement.md,
    marginTop: espacement.xs,
  },
  reactionBtn: {
    paddingHorizontal: espacement.sm,
    paddingVertical: 3,
    borderRadius: arrondi.sm,
    backgroundColor: couleurs.brumeLight,
  },
})
