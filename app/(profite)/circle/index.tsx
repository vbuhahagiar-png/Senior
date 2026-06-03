import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Users, Mail } from 'lucide-react-native'
import { Ecran } from '@/components/layout/Screen'
import { Texte } from '@/components/ui/Text'
import { Carte } from '@/components/ui/Card'
import { Bouton } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { couleurs, espacement } from '@/lib/theme'

const MEMBRES_DEMO = [
  { id: '1', nom: 'Pierre Dubois', role: 'Fils', statut: 'active' as const },
  { id: '2', nom: 'Sophie Martin', role: 'Fille', statut: 'pending' as const },
]

export default function CercleProfiteScreen() {
  return (
    <Ecran>
      <View style={styles.entete}>
        <Texte variante="displayMd">Mon cercle familial</Texte>
        <Texte variante="corps" couleur={couleurs.texteSecondaire}>
          Vos proches qui vous accompagnent sur Senior +.
        </Texte>
      </View>

      <View style={styles.section}>
        {MEMBRES_DEMO.map((m) => (
          <Carte key={m.id} padding="md">
            <View style={styles.membreLigne}>
              <Avatar nom={m.nom} taille="lg" />
              <View style={styles.membreContenu}>
                <Texte variante="corps">{m.nom}</Texte>
                <Texte variante="legende" couleur={couleurs.texteSecondaire}>{m.role}</Texte>
              </View>
              <Badge
                texte={m.statut === 'active' ? 'Actif' : 'En attente'}
                variante={m.statut === 'active' ? 'succes' : 'attention'}
              />
            </View>
          </Carte>
        ))}

        <Bouton
          variante="secondaire"
          pleineLargeur
          icone={<Mail size={20} color={couleurs.primaire} strokeWidth={2} />}
          onPress={() => {}}
        >
          Inviter un proche
        </Bouton>
      </View>

      <View style={styles.section}>
        <Texte variante="titre">Fil familial</Texte>

        {MESSAGES_DEMO.map((msg) => (
          <Carte key={msg.id} padding="md">
            <View style={styles.messageLigne}>
              <Avatar nom={msg.auteur} taille="sm" />
              <View style={styles.messageContenu}>
                <Texte variante="corpsgrand">{msg.auteur}</Texte>
                <Texte variante="corps">{msg.texte}</Texte>
                <Texte variante="legende" couleur={couleurs.texteTertiaire}>{msg.date}</Texte>
              </View>
            </View>
          </Carte>
        ))}

        <Carte padding="md" couleurFond={couleurs.brumeLight} bordure>
          <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire} align="center">
            ✉️ Partagez un message ou une photo avec votre famille
          </Texte>
        </Carte>
      </View>
    </Ecran>
  )
}

const MESSAGES_DEMO = [
  { id: '1', auteur: 'Pierre', texte: 'Bonjour maman ! Comment s\'est passée ta journée ? 💛', date: 'il y a 2h' },
]

const styles = StyleSheet.create({
  entete: { gap: espacement.sm, marginBottom: espacement.lg },
  section: { gap: espacement.md, marginBottom: espacement.xl },
  membreLigne: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.md,
  },
  membreContenu: { flex: 1 },
  messageLigne: {
    flexDirection: 'row',
    gap: espacement.md,
    alignItems: 'flex-start',
  },
  messageContenu: { flex: 1, gap: espacement.xs },
})
