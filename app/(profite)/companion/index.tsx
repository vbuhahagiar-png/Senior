import React, { useState, useRef } from 'react'
import {
  View, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native'
import { Send, Mic, Shield, Phone, Sparkles } from 'lucide-react-native'
import { Texte } from '@/components/ui/Text'
import { Carte } from '@/components/ui/Card'
import { Cadenas } from '@/components/ui/FeatureLock'
import { couleurs, espacement, arrondi } from '@/lib/theme'
import { Linking } from 'react-native'

type Message = {
  id: string
  role: 'nia' | 'user'
  texte: string
}

const SUGGESTIONS = [
  { id: '1', texte: "Comment me sentir moins seul·e ?" },
  { id: '2', texte: "Propose-moi une activité douce" },
  { id: '3', texte: "J'ai du mal à dormir" },
  { id: '4', texte: "Qu'est-ce que je peux faire aujourd'hui ?" },
  { id: '5', texte: "Parle-moi d'un conseil bien-être" },
]

const REPONSES_NIA: Record<string, string> = {
  seul: "La solitude peut être difficile à vivre, et vos sentiments sont tout à fait valides. Je suis là pour vous accompagner. Je vous conseille de consulter la section Activités — il y a des cours d'aquagym et de yoga avec d'autres seniors à Genève. La connexion humaine y est souvent très chaleureuse. 💛",
  activite: "Voici une idée douce pour aujourd'hui : une promenade de 20 minutes dans le parc, suivie d'une tasse de tisane. Si vous souhaitez quelque chose de plus structuré, le cours d'aquagym du mardi matin à la Piscine des Pâquis est vivement recommandé par nos membres. 🏊",
  dormir: "Le sommeil est fondamental pour le bien-être. Quelques conseils : évitez les écrans une heure avant le coucher, une tisane à la camomille peut aider, et essayez la respiration 4-7-8 (inspirez 4s, retenez 7s, expirez 8s). Si le problème persiste, n'hésitez pas à en parler à votre médecin. 🌙",
  "aujourd'hui": "Pour aujourd'hui, je suggère : 1) Compléter votre rituel du matin si ce n'est pas encore fait ✅, 2) Une courte sortie de 15 minutes au soleil ☀️, 3) Appeler un proche ou envoyer un message dans votre cercle familial 💬. Chaque petit geste compte !",
  bien: "Voici un conseil bien-être pour aujourd'hui : La cohérence cardiaque ! Respirez lentement pendant 5 minutes — 5 secondes d'inspiration, 5 secondes d'expiration. Cette technique réduit le stress et améliore l'humeur naturellement. À pratiquer 3 fois par jour pour de meilleurs résultats. 🌿",
  bonjour: "Bonjour ! Je suis Nia, votre compagnon bienveillant. Je suis là pour vous écouter, vous encourager et vous proposer des idées pour votre bien-être. Comment puis-je vous aider aujourd'hui ? 😊",
  merci: "Avec grand plaisir ! Je suis toujours là pour vous. N'hésitez pas à revenir me parler quand vous le souhaitez. Prenez bien soin de vous ! 💛",
}

function trouverReponse(texte: string): string {
  const t = texte.toLowerCase()
  for (const [cle, rep] of Object.entries(REPONSES_NIA)) {
    if (t.includes(cle)) return rep
  }
  return "Je vous entends. Chaque journée apporte son lot de défis et de joies. Avez-vous essayé de noter trois petites choses positives de votre journée ? Ce simple exercice peut vraiment améliorer le moral avec le temps. Je suis là pour vous accompagner pas à pas. 💛"
}

const MESSAGES_INITIAUX: Message[] = [
  {
    id: 'init',
    role: 'nia',
    texte: "Bonjour ! Je suis Nia, votre compagnon bienveillant Senior +. Je suis là pour vous écouter, vous encourager et vous proposer des idées pour prendre soin de vous. Comment vous sentez-vous aujourd'hui ? 😊",
  },
]

export default function CompagnonScreen() {
  const [messages, setMessages] = useState<Message[]>(MESSAGES_INITIAUX)
  const [saisie, setSaisie] = useState('')
  const [suggestionsMontrees, setSuggestionsMontrees] = useState(true)
  const scrollRef = useRef<ScrollView>(null)

  const envoyerMessage = (texte: string) => {
    if (!texte.trim()) return
    const msgUser: Message = { id: Date.now().toString(), role: 'user', texte: texte.trim() }
    const msgNia: Message = {
      id: (Date.now() + 1).toString(),
      role: 'nia',
      texte: trouverReponse(texte),
    }
    setMessages((prev) => [...prev, msgUser, msgNia])
    setSaisie('')
    setSuggestionsMontrees(false)
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)
  }

  return (
    <Cadenas fonctionnalite="compagnonVocal" afficherApercu={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {/* En-tête Nia */}
        <View style={styles.entete}>
          <View style={styles.niaAvatar}>
            <Sparkles size={28} color={couleurs.blanc} strokeWidth={1.5} />
          </View>
          <View style={styles.enteteTexte}>
            <Texte variante="titre">Nia</Texte>
            <View style={styles.statutLigne}>
              <View style={styles.statutDot} />
              <Texte variante="legende" couleur={couleurs.succes}>En ligne · Disponible 24h/24</Texte>
            </View>
          </View>
          <TouchableOpacity style={styles.micBtn}>
            <Mic size={22} color={couleurs.primaire} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.messagesZone}
          contentContainerStyle={styles.messagesContenu}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[styles.bulleWrapper, msg.role === 'user' ? styles.bulleWrapperUser : styles.bulleWrapperNia]}
            >
              {msg.role === 'nia' && (
                <View style={styles.niaAvatarPetit}>
                  <Sparkles size={14} color={couleurs.blanc} strokeWidth={2} />
                </View>
              )}
              <View style={[styles.bulle, msg.role === 'user' ? styles.bulleUser : styles.bulleNia]}>
                <Texte
                  variante="corps"
                  couleur={msg.role === 'user' ? couleurs.blanc : couleurs.texte}
                  style={{ lineHeight: 22 }}
                >
                  {msg.texte}
                </Texte>
              </View>
            </View>
          ))}

          {/* Suggestions */}
          {suggestionsMontrees && (
            <View style={styles.suggestions}>
              <Texte variante="legende" couleur={couleurs.texteSecondaire} style={{ marginBottom: espacement.sm }}>
                Suggestions rapides
              </Texte>
              <View style={styles.suggestionsPuces}>
                {SUGGESTIONS.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={styles.suggestionPuce}
                    onPress={() => envoyerMessage(s.texte)}
                  >
                    <Texte variante="corpsPetit" couleur={couleurs.primaire}>{s.texte}</Texte>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={{ height: 8 }} />
        </ScrollView>

        {/* Numéros d'urgence */}
        <View style={styles.urgences}>
          <Texte variante="legende" couleur={couleurs.texteSecondaire}>Urgences :</Texte>
          <TouchableOpacity onPress={() => Linking.openURL('tel:144')} style={styles.urgenceBtn}>
            <Phone size={12} color={couleurs.erreur} strokeWidth={2.5} />
            <Texte variante="legende" couleur={couleurs.erreur}>144</Texte>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('tel:143')} style={styles.urgenceBtn}>
            <Phone size={12} color={couleurs.info} strokeWidth={2.5} />
            <Texte variante="legende" couleur={couleurs.info}>La Main Tendue 143</Texte>
          </TouchableOpacity>
        </View>

        {/* Zone de saisie */}
        <View style={styles.saisieZone}>
          <TextInput
            style={styles.input}
            value={saisie}
            onChangeText={setSaisie}
            placeholder="Écrivez à Nia..."
            placeholderTextColor={couleurs.texteTertiaire}
            multiline
            maxLength={500}
            onSubmitEditing={() => envoyerMessage(saisie)}
          />
          <TouchableOpacity
            style={[styles.envoiBtn, !saisie.trim() && styles.envioBtnInactif]}
            onPress={() => envoyerMessage(saisie)}
            disabled={!saisie.trim()}
          >
            <Send size={20} color={couleurs.blanc} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Avertissement */}
        <View style={styles.avertissement}>
          <Shield size={12} color={couleurs.texteTertiaire} strokeWidth={2} />
          <Texte variante="legende" couleur={couleurs.texteTertiaire} style={{ flex: 1 }}>
            Nia est un compagnon, pas un médecin. En cas d'urgence médicale, appelez le 144.
          </Texte>
        </View>
      </KeyboardAvoidingView>
    </Cadenas>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: couleurs.ivoire },
  entete: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.md,
    backgroundColor: couleurs.blanc,
    paddingHorizontal: espacement.lg,
    paddingVertical: espacement.md,
    borderBottomWidth: 1,
    borderBottomColor: couleurs.bordure,
  },
  niaAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: couleurs.primaire,
    alignItems: 'center', justifyContent: 'center',
  },
  enteteTexte: { flex: 1, gap: 2 },
  statutLigne: { flexDirection: 'row', alignItems: 'center', gap: espacement.xs },
  statutDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: couleurs.succes },
  micBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: couleurs.primaire + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  messagesZone: { flex: 1 },
  messagesContenu: {
    padding: espacement.lg,
    gap: espacement.md,
  },
  bulleWrapper: { flexDirection: 'row', alignItems: 'flex-end', gap: espacement.sm },
  bulleWrapperNia: { justifyContent: 'flex-start' },
  bulleWrapperUser: { justifyContent: 'flex-end' },
  niaAvatarPetit: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: couleurs.primaire,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    marginBottom: 4,
  },
  bulle: {
    maxWidth: '78%',
    paddingHorizontal: espacement.md,
    paddingVertical: espacement.sm,
    borderRadius: arrondi.xl,
  },
  bulleNia: {
    backgroundColor: couleurs.blanc,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  bulleUser: {
    backgroundColor: couleurs.primaire,
    borderBottomRightRadius: 4,
  },
  suggestions: { marginTop: espacement.sm },
  suggestionsPuces: { flexDirection: 'row', flexWrap: 'wrap', gap: espacement.sm },
  suggestionPuce: {
    paddingHorizontal: espacement.md,
    paddingVertical: espacement.sm,
    borderRadius: arrondi.full,
    backgroundColor: couleurs.blanc,
    borderWidth: 1,
    borderColor: couleurs.primaire + '40',
  },
  urgences: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.md,
    paddingHorizontal: espacement.lg,
    paddingVertical: espacement.sm,
    backgroundColor: couleurs.blanc,
    borderTopWidth: 1,
    borderTopColor: couleurs.bordure,
  },
  urgenceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: espacement.sm,
    paddingVertical: 3,
    borderRadius: arrondi.sm,
    backgroundColor: couleurs.erreur + '10',
  },
  saisieZone: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: espacement.sm,
    paddingHorizontal: espacement.lg,
    paddingVertical: espacement.md,
    backgroundColor: couleurs.blanc,
  },
  input: {
    flex: 1,
    backgroundColor: couleurs.brumeLight,
    borderRadius: arrondi.xl,
    paddingHorizontal: espacement.md,
    paddingVertical: espacement.sm,
    color: couleurs.texte,
    fontSize: 15,
    maxHeight: 100,
    lineHeight: 22,
  },
  envoiBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: couleurs.primaire,
    alignItems: 'center', justifyContent: 'center',
  },
  envioBtnInactif: { opacity: 0.4 },
  avertissement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.xs,
    paddingHorizontal: espacement.lg,
    paddingBottom: espacement.md,
    backgroundColor: couleurs.blanc,
  },
})
