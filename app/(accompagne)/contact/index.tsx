import React, { useState, useRef, useCallback } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Linking,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Send, ChevronDown } from 'lucide-react-native'
import { Texte } from '@/components/ui/Text'
import { Bouton } from '@/components/ui/Button'
import { Carte } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { couleurs, espacement, arrondi, ombres, palette } from '@/lib/theme'
import { useAuth } from '@/hooks/useAuth'

// ─── Types ────────────────────────────────────────────────────────────────────

type Onglet = 'nia' | 'formulaire'

interface Message {
  id: string
  role: 'user' | 'nia'
  texte: string
  anim: Animated.Value
}

// ─── Réponses pré-programmées de Nia (version aidant) ────────────────────────

const REPONSES_NIA: { mots: string[]; reponse: string }[] = [
  {
    mots: ['tableau', 'bord', 'dashboard', 'suivi', 'surveiller', 'voir'],
    reponse:
      "Le tableau de bord vous donne une vue en temps réel sur le bien-être de vos proches. Vous voyez si le rituel du matin a été complété, l'humeur déclarée, et les activités de la journée. Actualisé automatiquement toutes les minutes. 📊",
  },
  {
    mots: ['alerte', 'notification', 'absent', 'rituel', 'signal'],
    reponse:
      "Si votre proche n'a pas complété son rituel du matin avant l'heure habituelle, vous recevez une alerte push. Vous pouvez configurer les horaires et le type d'alertes dans l'onglet Réglages → Notifications.",
  },
  {
    mots: ['cercle', 'famille', 'inviter', 'aidant', 'ajouter', 'proche'],
    reponse:
      "Vous pouvez inviter plusieurs aidants à rejoindre le cercle familial d'un même proche. Allez dans l'onglet Cercle et appuyez sur + pour envoyer un lien d'invitation. Jusqu'à 5 aidants par proche avec le plan Famille.",
  },
  {
    mots: ['abonnement', 'plan', 'tarif', 'prix', 'gratuit', 'changer', 'payer', 'serenite', 'sérénité'],
    reponse:
      "Senior+ propose 3 plans : Gratuit (idéal pour commencer), Famille à CHF 24.90/mois (cercle familial complet + alertes avancées), et Sérénité à CHF 39.90/mois (conseiller dédié + services personnalisés). 30 jours d'essai gratuit !",
  },
  {
    mots: ['courrier', 'lettre', 'decodage', 'décodage', 'administratif', 'impot', 'assurance'],
    reponse:
      "Avec le plan Famille, vous pouvez aider votre proche à décoder ses courriers administratifs. Il vous partage une lettre depuis l'onglet Lettres, et l'IA l'explique en langage simple pour vous deux.",
  },
  {
    mots: ['securite', 'sécurité', 'donnees', 'données', 'prive', 'confidentialite', 'suisse', 'securise', 'sécurisé'],
    reponse:
      "Absolument. Toutes les données Senior+ sont hébergées en Suisse, conformes à la loi nLPD. Ni vous ni vos proches n'avez à craindre pour la confidentialité. Les données ne sont jamais revendues. Compte supprimable à tout moment.",
  },
  {
    mots: ['calendrier', 'importer', 'activite', 'activité', 'programme'],
    reponse:
      "Votre proche peut importer son calendrier (Google, Outlook, Apple) depuis l'onglet Activités. Vous verrez ses rendez-vous dans votre tableau de bord et pourrez lui envoyer des rappels doux.",
  },
]

const REPONSE_DEFAUT =
  "Merci pour votre question ! Notre équipe va vous répondre dans les 24 heures. Vous pouvez aussi nous écrire directement via l'onglet Formulaire. 😊"

function enleverAccents(str: string): string {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function trouverReponse(message: string): string {
  const msg = enleverAccents(message.toLowerCase())
  for (const { mots, reponse } of REPONSES_NIA) {
    if (mots.some((mot) => msg.includes(enleverAccents(mot)))) {
      return reponse
    }
  }
  return REPONSE_DEFAUT
}

// ─── Chips de questions suggérées (version aidant) ────────────────────────────

const CHIPS: { label: string; message: string }[] = [
  { label: 'Tableau de bord ?', message: 'Comment fonctionne le tableau de bord ?' },
  { label: 'Alertes & notifications ?', message: 'Comment fonctionnent les alertes ?' },
  { label: 'Cercle familial ?', message: 'Comment inviter un autre aidant ?' },
  { label: 'Mon abonnement ?', message: 'Comment changer mon abonnement ?' },
  { label: 'Décodage de courriers ?', message: "Comment fonctionne le décodage de courriers ?" },
  { label: "Sécurité de l'app ?", message: "L'app est-elle sécurisée ?" },
]

// ─── Message de bienvenue Nia (version aidant) ────────────────────────────────

function creerMessageBienvenue(): Message {
  return {
    id: 'bienvenue',
    role: 'nia',
    texte: "Bonjour ! Je suis Nia, votre assistante Senior+. Comment puis-je vous aider à accompagner vos proches aujourd'hui ?",
    anim: new Animated.Value(1),
  }
}

// ─── Bulle de message ─────────────────────────────────────────────────────────

function BulleMessage({ message }: { message: Message }) {
  const estUser = message.role === 'user'
  return (
    <Animated.View
      style={[
        styles.bulleWrapper,
        estUser ? styles.bulleWrapperUser : styles.bulleWrapperNia,
        { opacity: message.anim },
      ]}
    >
      {!estUser && (
        <View style={styles.avatarNiaPetit}>
          <Texte style={styles.avatarNiaPetitTexte}>N</Texte>
        </View>
      )}
      <View style={[styles.bulle, estUser ? styles.bulleUser : styles.bulleNia]}>
        <Texte
          variante="corps"
          couleur={estUser ? couleurs.texteSurPrimaire : couleurs.texte}
          style={styles.bulleTexte}
        >
          {message.texte}
        </Texte>
      </View>
    </Animated.View>
  )
}

// ─── Sélecteur d'objet ────────────────────────────────────────────────────────

const OBJETS = [
  'Question générale',
  'Problème technique',
  'Mon abonnement',
  'Suggestion',
  'Autre',
]

function SelectObjet({ valeur, onChange }: { valeur: string; onChange: (v: string) => void }) {
  const [ouvert, setOuvert] = useState(false)

  return (
    <View style={styles.selectContainer}>
      <Texte variante="etiquette" style={styles.selectLabel}>
        Objet
      </Texte>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setOuvert(!ouvert)}
        accessible
        accessibilityLabel="Sélectionner l'objet du message"
        accessibilityRole="combobox"
        activeOpacity={0.8}
      >
        <Texte variante="corps" couleur={valeur ? couleurs.texte : couleurs.texteTertiaire}>
          {valeur || 'Choisir un objet…'}
        </Texte>
        <ChevronDown size={20} color={couleurs.texteSecondaire} strokeWidth={2} />
      </TouchableOpacity>
      {ouvert && (
        <Carte style={styles.selectDropdown} padding="xs">
          {OBJETS.map((o) => (
            <TouchableOpacity
              key={o}
              style={styles.selectItem}
              onPress={() => {
                onChange(o)
                setOuvert(false)
              }}
              accessible
              accessibilityRole="menuitem"
            >
              <Texte
                variante="corps"
                couleur={valeur === o ? couleurs.primaire : couleurs.texte}
                gras={valeur === o}
              >
                {o}
              </Texte>
            </TouchableOpacity>
          ))}
        </Carte>
      )}
    </View>
  )
}

// ─── Onglet Chat Nia ──────────────────────────────────────────────────────────

function OngletNia() {
  const [messages, setMessages] = useState<Message[]>(() => [creerMessageBienvenue()])
  const [saisie, setSaisie] = useState('')
  const [chipsVisibles, setChipsVisibles] = useState(true)
  const scrollRef = useRef<ScrollView>(null)

  const envoyerMessage = useCallback((texte: string) => {
    if (!texte.trim()) return
    setChipsVisibles(false)

    const animUser = new Animated.Value(0)
    const msgUser: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      texte: texte.trim(),
      anim: animUser,
    }

    const animNia = new Animated.Value(0)
    const msgNia: Message = {
      id: `n-${Date.now() + 1}`,
      role: 'nia',
      texte: trouverReponse(texte),
      anim: animNia,
    }

    setMessages((prev) => [...prev, msgUser, msgNia])
    setSaisie('')

    Animated.sequence([
      Animated.timing(animUser, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(200),
      Animated.timing(animNia, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start()

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)
  }, [])

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 0}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        contentContainerStyle={styles.chatContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête avatar Nia */}
        <View style={styles.niaHeader}>
          <View style={styles.niaAvatar}>
            <Texte style={styles.niaAvatarInitiale}>N</Texte>
            <View style={styles.niaSparkleBadge}>
              <Texte style={styles.niaSparkleTexte}>✨</Texte>
            </View>
          </View>
          <View style={styles.niaHeaderTextes}>
            <Texte variante="titre">Nia</Texte>
            <Texte variante="legende" couleur={couleurs.texteSecondaire}>
              Assistante Senior+ · Toujours disponible
            </Texte>
          </View>
        </View>

        {/* Messages */}
        <View style={styles.messagesContainer}>
          {messages.map((msg) => (
            <BulleMessage key={msg.id} message={msg} />
          ))}
        </View>

        {/* Chips */}
        {chipsVisibles && (
          <View style={styles.chipsContainer}>
            <Texte variante="legende" couleur={couleurs.texteSecondaire} style={styles.chipsTitre}>
              Questions fréquentes
            </Texte>
            <View style={styles.chips}>
              {CHIPS.map((chip) => (
                <TouchableOpacity
                  key={chip.label}
                  style={styles.chip}
                  onPress={() => envoyerMessage(chip.message)}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={chip.message}
                  activeOpacity={0.7}
                >
                  <Texte variante="corpsPetit" couleur={couleurs.primaireFonce}>
                    {chip.label}
                  </Texte>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Zone de saisie */}
      <View style={styles.saisieContainer}>
        <TextInput
          value={saisie}
          onChangeText={setSaisie}
          placeholder="Posez votre question à Nia…"
          placeholderTextColor={couleurs.texteTertiaire}
          style={styles.saisieInput}
          returnKeyType="send"
          onSubmitEditing={() => envoyerMessage(saisie)}
          accessible
          accessibilityLabel="Champ de message pour Nia"
        />
        <TouchableOpacity
          style={[styles.saisieEnvoyer, !saisie.trim() && styles.saisieEnvoyerDesactive]}
          onPress={() => envoyerMessage(saisie)}
          disabled={!saisie.trim()}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Envoyer le message"
          activeOpacity={0.8}
        >
          <Send size={20} color={couleurs.blanc} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

// ─── Onglet Formulaire ────────────────────────────────────────────────────────

function OngletFormulaire() {
  const { profil, utilisateur } = useAuth()

  const [prenom, setPrenom] = useState(profil?.display_name?.split(' ')[0] ?? '')
  const [nom, setNom] = useState(profil?.display_name?.split(' ').slice(1).join(' ') ?? '')
  const [email, setEmail] = useState(utilisateur?.email ?? '')
  const [objet, setObjet] = useState('')
  const [messageTexte, setMessageTexte] = useState('')
  const [envoye, setEnvoye] = useState(false)
  const [envoi, setEnvoi] = useState(false)

  const peutEnvoyer = !!(prenom.trim() && email.trim() && objet && messageTexte.trim())

  const handleEnvoyer = async () => {
    if (!peutEnvoyer) return
    setEnvoi(true)
    const sujet = encodeURIComponent(`[Senior+] ${objet} — ${prenom} ${nom}`.trim())
    const corps = encodeURIComponent(
      `Prénom : ${prenom}\nNom : ${nom}\nEmail : ${email}\nObjet : ${objet}\n\n${messageTexte}`
    )
    try {
      await Linking.openURL(`mailto:vbuhahagiar@gmail.com?subject=${sujet}&body=${corps}`)
    } catch (_) {
      // mailto not supported in all environments
    }
    setEnvoye(true)
    setEnvoi(false)
  }

  if (envoye) {
    return (
      <View style={styles.succesContainer}>
        <Texte style={styles.succesEmoji}>✅</Texte>
        <Texte variante="titre" align="center">
          Message envoyé !
        </Texte>
        <Texte variante="corps" couleur={couleurs.texteSecondaire} align="center">
          Nous vous répondrons dans les 24 heures.
        </Texte>
        <Bouton
          variante="secondaire"
          taille="md"
          onPress={() => {
            setEnvoye(false)
            setMessageTexte('')
            setObjet('')
          }}
          style={styles.succesRetour}
        >
          Envoyer un autre message
        </Bouton>
      </View>
    )
  }

  return (
    <ScrollView
      contentContainerStyle={styles.formulaireContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Texte variante="titre" style={styles.formulaireTitre}>
        Contactez-nous
      </Texte>
      <Texte variante="corps" couleur={couleurs.texteSecondaire}>
        Notre équipe vous répond sous 24 heures.
      </Texte>

      <View style={styles.ligneDeuxChamps}>
        <View style={styles.champDemi}>
          <Input
            label="Prénom"
            placeholder="Pierre"
            valeur={prenom}
            onChangement={setPrenom}
            returnKeyType="next"
            accessibilityLabel="Votre prénom"
          />
        </View>
        <View style={styles.champDemi}>
          <Input
            label="Nom"
            placeholder="Dubois"
            valeur={nom}
            onChangement={setNom}
            returnKeyType="next"
            accessibilityLabel="Votre nom de famille"
          />
        </View>
      </View>

      <Input
        label="Email"
        placeholder="votre@email.ch"
        valeur={email}
        onChangement={setEmail}
        typeClavier="email-address"
        returnKeyType="next"
        accessibilityLabel="Votre adresse email"
      />

      <SelectObjet valeur={objet} onChange={setObjet} />

      <Input
        label="Message"
        placeholder="Décrivez votre question ou votre problème…"
        valeur={messageTexte}
        onChangement={setMessageTexte}
        multiline
        lignes={5}
        accessibilityLabel="Votre message"
      />

      <Bouton
        variante="primaire"
        taille="lg"
        onPress={handleEnvoyer}
        desactive={!peutEnvoyer}
        chargement={envoi}
        pleineLargeur
        accessibilityLabel="Envoyer le message"
      >
        Envoyer le message
      </Bouton>

      <View style={styles.confidentialite}>
        <Texte variante="legende" couleur={couleurs.texteSecondaire} align="center">
          🔒 Vos données ne sont jamais partagées avec des tiers.
        </Texte>
      </View>
    </ScrollView>
  )
}

// ─── Écran principal ──────────────────────────────────────────────────────────

export default function ContactAidantScreen() {
  const [ongletActif, setOngletActif] = useState<Onglet>('nia')

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* En-tête */}
        <View style={styles.entete}>
          <Texte variante="displayMd">Aide & Contact</Texte>
          <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>
            Posez vos questions ou envoyez-nous un message
          </Texte>
        </View>

        {/* Sélecteur d'onglets */}
        <View style={styles.onglets}>
          <TouchableOpacity
            style={[styles.onglet, ongletActif === 'nia' && styles.ongletActif]}
            onPress={() => setOngletActif('nia')}
            accessible
            accessibilityRole="tab"
            accessibilityLabel="Onglet Nia — assistante virtuelle"
            accessibilityState={{ selected: ongletActif === 'nia' }}
            activeOpacity={0.8}
          >
            <Texte
              variante="etiquette"
              couleur={ongletActif === 'nia' ? couleurs.primaire : couleurs.texteSecondaire}
            >
              ✨ Nia
            </Texte>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.onglet, ongletActif === 'formulaire' && styles.ongletActif]}
            onPress={() => setOngletActif('formulaire')}
            accessible
            accessibilityRole="tab"
            accessibilityLabel="Onglet Formulaire de contact"
            accessibilityState={{ selected: ongletActif === 'formulaire' }}
            activeOpacity={0.8}
          >
            <Texte
              variante="etiquette"
              couleur={ongletActif === 'formulaire' ? couleurs.primaire : couleurs.texteSecondaire}
            >
              Formulaire
            </Texte>
          </TouchableOpacity>
        </View>

        {/* Contenu */}
        <View style={styles.flex}>
          {ongletActif === 'nia' ? <OngletNia /> : <OngletFormulaire />}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1 },

  container: {
    flex: 1,
    backgroundColor: couleurs.fond,
  },

  // En-tête
  entete: {
    paddingHorizontal: espacement.lg,
    paddingTop: espacement.md,
    paddingBottom: espacement.sm,
    gap: espacement.xs,
  },

  // Onglets
  onglets: {
    flexDirection: 'row',
    marginHorizontal: espacement.lg,
    marginBottom: espacement.sm,
    backgroundColor: couleurs.surface,
    borderRadius: arrondi.lg,
    padding: 4,
    ...(ombres.sm as object),
  },
  onglet: {
    flex: 1,
    paddingVertical: espacement.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: arrondi.md,
    minHeight: 48,
  },
  ongletActif: {
    backgroundColor: couleurs.fond,
    ...(ombres.sm as object),
  },

  // Chat
  chatContent: {
    paddingHorizontal: espacement.lg,
    paddingBottom: espacement.xl,
    gap: espacement.md,
  },

  // Avatar Nia (grand)
  niaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.md,
    paddingTop: espacement.sm,
    paddingBottom: espacement.sm,
  },
  niaAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: palette.sauge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  niaAvatarInitiale: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    color: couleurs.blanc,
    lineHeight: 34,
  },
  niaSparkleBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: couleurs.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  niaSparkleTexte: {
    fontSize: 12,
    lineHeight: 16,
  },
  niaHeaderTextes: {
    gap: 2,
    flex: 1,
  },

  // Messages
  messagesContainer: {
    gap: espacement.md,
  },
  bulleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: espacement.sm,
  },
  bulleWrapperUser: {
    justifyContent: 'flex-end',
  },
  bulleWrapperNia: {
    justifyContent: 'flex-start',
  },
  avatarNiaPetit: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.sauge,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarNiaPetitTexte: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: couleurs.blanc,
    lineHeight: 18,
  },
  bulle: {
    maxWidth: '78%',
    borderRadius: arrondi.lg,
    paddingHorizontal: espacement.md,
    paddingVertical: espacement.sm + 2,
  },
  bulleUser: {
    backgroundColor: palette.sauge,
    borderBottomRightRadius: arrondi.xs,
  },
  bulleNia: {
    backgroundColor: couleurs.surface,
    borderBottomLeftRadius: arrondi.xs,
    ...(ombres.sm as object),
  },
  bulleTexte: {
    lineHeight: 24,
  },

  // Chips
  chipsContainer: {
    gap: espacement.sm,
  },
  chipsTitre: {
    marginBottom: espacement.xs,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espacement.sm,
  },
  chip: {
    backgroundColor: couleurs.surface,
    borderWidth: 1.5,
    borderColor: palette.saugeLight,
    borderRadius: arrondi.plein,
    paddingHorizontal: espacement.md,
    paddingVertical: espacement.sm,
    minHeight: 48,
    justifyContent: 'center',
  },

  // Saisie
  saisieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.sm,
    paddingHorizontal: espacement.lg,
    paddingVertical: espacement.md,
    borderTopWidth: 1,
    borderTopColor: couleurs.bordure,
    backgroundColor: couleurs.fond,
  },
  saisieInput: {
    flex: 1,
    minHeight: 48,
    backgroundColor: couleurs.surface,
    borderWidth: 1.5,
    borderColor: couleurs.bordure,
    borderRadius: arrondi.plein,
    paddingHorizontal: espacement.md,
    paddingVertical: espacement.sm,
    fontSize: 18,
    fontFamily: 'Nunito-Regular',
    color: couleurs.texte,
  },
  saisieEnvoyer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.sauge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saisieEnvoyerDesactive: {
    backgroundColor: couleurs.desactive,
  },

  // Formulaire
  formulaireContent: {
    paddingHorizontal: espacement.lg,
    paddingBottom: espacement.xxxl,
    gap: espacement.lg,
  },
  formulaireTitre: {
    marginTop: espacement.sm,
  },
  ligneDeuxChamps: {
    flexDirection: 'row',
    gap: espacement.md,
  },
  champDemi: {
    flex: 1,
  },

  // Select objet
  selectContainer: {
    gap: espacement.xs,
  },
  selectLabel: {
    marginBottom: espacement.xs,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: couleurs.surface,
    borderWidth: 1.5,
    borderColor: couleurs.bordure,
    borderRadius: arrondi.md,
    paddingHorizontal: espacement.md,
    paddingVertical: espacement.sm + 2,
    minHeight: 56,
  },
  selectDropdown: {
    marginTop: 2,
    zIndex: 100,
  },
  selectItem: {
    paddingHorizontal: espacement.md,
    paddingVertical: espacement.md,
    minHeight: 48,
    justifyContent: 'center',
  },

  // Succès
  succesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: espacement.xl,
    gap: espacement.lg,
  },
  succesEmoji: {
    fontSize: 56,
    lineHeight: 70,
  },
  succesRetour: {
    marginTop: espacement.md,
    alignSelf: 'stretch',
  },

  // Confidentialité
  confidentialite: {
    paddingTop: espacement.sm,
    paddingBottom: espacement.md,
  },
})
