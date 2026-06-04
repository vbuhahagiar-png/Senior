import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
  Modal,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react-native'
import { Ecran } from '@/components/layout/Screen'
import { Texte } from '@/components/ui/Text'
import { Bouton } from '@/components/ui/Button'
import { Carte } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { couleurs, espacement, arrondi, palette, ombres } from '@/lib/theme'
import { useSubscription } from '@/hooks/useSubscription'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlanInfo {
  id: 'free' | 'famille' | 'serenite'
  nom: string
  emoji: string
  prixMensuel: string
  prixAnnuel: string
  prixMensuelAnnuel: string
  description: string
  fonctionnalites: string[]
  recommande?: boolean
  couleurPrimaire: string
  couleurFond: string
  couleurBordure: string
}

interface FaqItem {
  question: string
  reponse: string
}

// ─── Données ──────────────────────────────────────────────────────────────────

const PLANS: PlanInfo[] = [
  {
    id: 'free',
    nom: 'Gratuit',
    emoji: '',
    prixMensuel: 'CHF 0',
    prixAnnuel: 'CHF 0',
    prixMensuelAnnuel: 'CHF 0',
    description: 'Pour commencer à accompagner',
    fonctionnalites: [
      'Tableau de bord aidant',
      'Suivi de 1 proche',
      '5 activités suggérées/jour',
    ],
    couleurPrimaire: couleurs.texteSecondaire,
    couleurFond: palette.brumeLighter,
    couleurBordure: palette.brume,
  },
  {
    id: 'famille',
    nom: 'Famille',
    emoji: '⭐',
    prixMensuel: 'CHF 24.90',
    prixAnnuel: 'CHF 249',
    prixMensuelAnnuel: 'CHF 20.75',
    description: 'Le plan le plus populaire pour les aidants',
    fonctionnalites: [
      'Tout le plan Gratuit',
      'Tableau de bord famille complet',
      'Suivi médicaments illimité',
      'Alertes et notifications en temps réel',
      'Fil famille partagé',
      'Cercle jusqu'à 3 proches',
      'Résumé hebdomadaire aidant',
    ],
    recommande: true,
    couleurPrimaire: couleurs.primaire,
    couleurFond: palette.saugeLighter,
    couleurBordure: palette.sauge,
  },
  {
    id: 'serenite',
    nom: 'Sérénité',
    emoji: '💎',
    prixMensuel: 'CHF 39.90',
    prixAnnuel: 'CHF 399',
    prixMensuelAnnuel: 'CHF 33.25',
    description: 'Accompagnement premium pour toute la famille',
    fonctionnalites: [
      'Tout le plan Famille',
      'Conseiller aidant prioritaire',
      'Bilan retraite du proche',
      'Coffre-fort numérique partagé',
      'Livre de mémoires familiales',
    ],
    couleurPrimaire: couleurs.accentFonce,
    couleurFond: palette.terracottaLighter,
    couleurBordure: palette.terracottaDark,
  },
]

const FAQ: FaqItem[] = [
  {
    question: 'Comment annuler mon abonnement ?',
    reponse:
      "Vous pouvez annuler à tout moment depuis vos réglages, rubrique Abonnement. L'annulation prend effet à la fin de la période en cours. Aucun remboursement partiel n'est effectué.",
  },
  {
    question: 'Mon proche doit-il aussi avoir un abonnement ?',
    reponse:
      "Non. L'abonnement est géré depuis votre compte aidant. Votre proche accède automatiquement aux fonctionnalités incluses dans votre plan, sans démarche supplémentaire.",
  },
  {
    question: 'Le partage familial inclut-il plusieurs aidants ?',
    reponse:
      "Oui. Le plan Famille permet d'inviter jusqu'à 3 proches (aidants ou seniors) dans le même cercle. Chacun dispose de son propre accès et profil.",
  },
  {
    question: "L'essai gratuit est-il vraiment sans engagement ?",
    reponse:
      "Oui. Les 30 premiers jours sont entièrement gratuits. Aucun paiement n'est demandé pendant l'essai. Vous pouvez annuler avant la fin de l'essai sans être débité.",
  },
]

// ─── Composants ───────────────────────────────────────────────────────────────

function LigneFonctionnalite({ texte, couleurCheck }: { texte: string; couleurCheck: string }) {
  return (
    <View style={styles.ligneFonctionnalite}>
      <View style={[styles.checkContainer, { backgroundColor: couleurCheck + '20' }]}>
        <Check size={14} color={couleurCheck} strokeWidth={2.5} />
      </View>
      <Texte variante="corpsPetit" style={styles.texteFonctionnalite}>
        {texte}
      </Texte>
    </View>
  )
}

function CartePlan({
  plan,
  periodique,
  estActuel,
  onChoisir,
}: {
  plan: PlanInfo
  periodique: 'mensuel' | 'annuel'
  estActuel: boolean
  onChoisir: () => void
}) {
  const prix = periodique === 'annuel' ? plan.prixMensuelAnnuel : plan.prixMensuel
  const unite = periodique === 'annuel' ? '/mo (facturé annuellement)' : '/mois'
  const estGratuit = plan.id === 'free'

  return (
    <View
      style={[
        styles.cartePlan,
        plan.recommande && styles.cartePlanRecommandee,
        { borderColor: plan.couleurBordure },
        estActuel && styles.cartePlanActuelle,
      ]}
    >
      {plan.recommande && (
        <View style={[styles.bandeauRecommande, { backgroundColor: plan.couleurPrimaire }]}>
          <Texte variante="legende" couleur={couleurs.blanc} style={styles.texteRecommande}>
            Recommandé pour les aidants
          </Texte>
        </View>
      )}

      <View style={[styles.enteteCartePlan, { backgroundColor: plan.couleurFond }]}>
        <View style={styles.ligneNomPlan}>
          <Texte variante="titre" couleur={plan.couleurPrimaire}>
            {plan.emoji ? `${plan.emoji} ${plan.nom}` : plan.nom}
          </Texte>
          {estActuel && (
            <Badge
              texte="Plan actuel"
              variante={
                plan.id === 'famille' ? 'primaire' : plan.id === 'serenite' ? 'accent' : 'neutre'
              }
            />
          )}
        </View>
        <Texte variante="legende" couleur={couleurs.texteSecondaire}>
          {plan.description}
        </Texte>
        <View style={styles.lignePrix}>
          <Texte variante="displayLg" couleur={plan.couleurPrimaire}>
            {prix}
          </Texte>
          {!estGratuit && (
            <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire} style={styles.unite}>
              {unite}
            </Texte>
          )}
        </View>
        {periodique === 'annuel' && !estGratuit && (
          <Texte variante="legende" couleur={couleurs.succes}>
            {plan.id === 'famille' ? 'Économisez CHF 50.80/an' : 'Économisez CHF 79.80/an'}
          </Texte>
        )}
      </View>

      <View style={styles.corpsCarte}>
        {plan.fonctionnalites.map((f, i) => (
          <LigneFonctionnalite key={i} texte={f} couleurCheck={plan.couleurPrimaire} />
        ))}

        {!estGratuit && !estActuel && (
          <Bouton
            variante={plan.id === 'famille' ? 'primaire' : 'accent'}
            taille="md"
            onPress={onChoisir}
            pleineLargeur
            style={styles.boutonPlan}
          >
            Essayer 30 jours gratuits
          </Bouton>
        )}
        {estGratuit && !estActuel && (
          <Bouton
            variante="secondaire"
            taille="md"
            onPress={onChoisir}
            pleineLargeur
            style={styles.boutonPlan}
          >
            Plan actuel par défaut
          </Bouton>
        )}
        {estActuel && (
          <View
            style={[
              styles.badgePlanActuel,
              {
                backgroundColor: plan.couleurPrimaire + '15',
                borderColor: plan.couleurPrimaire,
              },
            ]}
          >
            <Texte variante="corpsPetit" couleur={plan.couleurPrimaire} align="center">
              Votre plan actuel
            </Texte>
          </View>
        )}
      </View>
    </View>
  )
}

function ItemFaq({ item }: { item: FaqItem }) {
  const [ouvert, setOuvert] = useState(false)

  return (
    <Carte ombre={false} bordure padding="md" style={styles.itemFaq}>
      <TouchableOpacity
        onPress={() => setOuvert((v) => !v)}
        style={styles.enteteItemFaq}
        accessibilityRole="button"
        accessibilityLabel={item.question}
        accessibilityState={{ expanded: ouvert }}
      >
        <Texte variante="corpsPetit" gras style={styles.questionFaq}>
          {item.question}
        </Texte>
        {ouvert ? (
          <ChevronUp size={20} color={couleurs.texteSecondaire} strokeWidth={2} />
        ) : (
          <ChevronDown size={20} color={couleurs.texteSecondaire} strokeWidth={2} />
        )}
      </TouchableOpacity>
      {ouvert && (
        <Texte variante="corps" couleur={couleurs.texteSecondaire} style={styles.reponseFaq}>
          {item.reponse}
        </Texte>
      )}
    </Carte>
  )
}

function ModalInfoMobile({
  visible,
  onFermer,
  plan,
}: {
  visible: boolean
  onFermer: () => void
  plan: PlanInfo | null
}) {
  if (!plan) return null
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onFermer}>
      <View style={styles.overlayModal}>
        <View style={styles.contenuModal}>
          <TouchableOpacity style={styles.fermerModal} onPress={onFermer}>
            <X size={24} color={couleurs.texteSecondaire} strokeWidth={2} />
          </TouchableOpacity>
          <Texte variante="titre" align="center">
            Abonnement {plan.nom}
          </Texte>
          <Texte
            variante="corps"
            couleur={couleurs.texteSecondaire}
            align="center"
            style={styles.texteModal}
          >
            Pour souscrire à l'abonnement Senior + {plan.nom}, rendez-vous sur notre site web
            depuis un navigateur ou téléchargez l'application sur l'App Store ou Google Play.
          </Texte>
          <Bouton variante="primaire" taille="md" onPress={onFermer} pleineLargeur>
            Compris
          </Bouton>
        </View>
      </View>
    </Modal>
  )
}

// ─── Écran principal ───────────────────────────────────────────────────────────

export default function AbonnementAccompagneScreen() {
  const router = useRouter()
  const { plan: planActuel } = useSubscription()
  const [periodique, setPeriodique] = useState<'mensuel' | 'annuel'>('annuel')
  const [modalPlan, setModalPlan] = useState<PlanInfo | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  const handleChoisirPlan = (plan: PlanInfo) => {
    if (plan.id === 'free') return

    if (Platform.OS === 'web') {
      Linking.openURL(`https://seniorplus.ch/checkout?plan=${plan.id}&period=${periodique}`)
    } else {
      setModalPlan(plan)
      setModalVisible(true)
    }
  }

  return (
    <Ecran>
      {/* En-tête */}
      <View style={styles.entete}>
        <Texte variante="displayMd" align="center">
          Choisissez votre plan
        </Texte>
        <Texte variante="corps" couleur={couleurs.texteSecondaire} align="center">
          30 jours d'essai gratuit, sans engagement
        </Texte>
        <Texte variante="legende" couleur={couleurs.texteSecondaire} align="center">
          Tableau de bord aidant · Alertes famille · Suivi complet
        </Texte>
      </View>

      {/* Bascule mensuel / annuel */}
      <View style={styles.basculePeriode}>
        <TouchableOpacity
          style={[
            styles.boutonPeriode,
            periodique === 'mensuel' && styles.boutonPeriodeActif,
          ]}
          onPress={() => setPeriodique('mensuel')}
          accessibilityRole="button"
          accessibilityState={{ selected: periodique === 'mensuel' }}
        >
          <Texte
            variante="etiquette"
            couleur={periodique === 'mensuel' ? couleurs.blanc : couleurs.texteSecondaire}
          >
            Mensuel
          </Texte>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.boutonPeriode,
            periodique === 'annuel' && styles.boutonPeriodeActif,
          ]}
          onPress={() => setPeriodique('annuel')}
          accessibilityRole="button"
          accessibilityState={{ selected: periodique === 'annuel' }}
        >
          <Texte
            variante="etiquette"
            couleur={periodique === 'annuel' ? couleurs.blanc : couleurs.texteSecondaire}
          >
            Annuel
          </Texte>
          <View style={styles.badgeEconomie}>
            <Texte variante="legende" couleur={couleurs.blanc} style={styles.texteEconomie}>
              -20%
            </Texte>
          </View>
        </TouchableOpacity>
      </View>

      {/* Plans */}
      <View style={styles.listePlans}>
        {PLANS.map((plan) => (
          <CartePlan
            key={plan.id}
            plan={plan}
            periodique={periodique}
            estActuel={plan.id === planActuel}
            onChoisir={() => handleChoisirPlan(plan)}
          />
        ))}
      </View>

      {/* Note légale */}
      <Texte variante="legende" couleur={couleurs.texteTertiaire} align="center" style={styles.noteLegale}>
        Prix en CHF TTC. Résiliation possible à tout moment.{'\n'}
        Données hébergées en Suisse · Conforme LPD
      </Texte>

      {/* FAQ */}
      <View style={styles.sectionFaq}>
        <Texte variante="sousTitre" style={styles.titreFaq}>
          Questions fréquentes
        </Texte>
        {FAQ.map((item, i) => (
          <ItemFaq key={i} item={item} />
        ))}
      </View>

      {/* Modal info mobile */}
      <ModalInfoMobile
        visible={modalVisible}
        onFermer={() => setModalVisible(false)}
        plan={modalPlan}
      />
    </Ecran>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  entete: {
    alignItems: 'center',
    gap: espacement.sm,
    paddingTop: espacement.lg,
    paddingBottom: espacement.xl,
  },
  basculePeriode: {
    flexDirection: 'row',
    backgroundColor: palette.brumeLighter,
    borderRadius: arrondi.lg,
    padding: 4,
    marginBottom: espacement.xl,
    gap: 4,
  },
  boutonPeriode: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: espacement.sm,
    borderRadius: arrondi.md,
    gap: espacement.xs,
  },
  boutonPeriodeActif: {
    backgroundColor: couleurs.primaire,
    ...(ombres.sm as object),
  },
  badgeEconomie: {
    backgroundColor: couleurs.succes,
    borderRadius: arrondi.plein,
    paddingHorizontal: espacement.xs,
    paddingVertical: 2,
  },
  texteEconomie: {
    fontFamily: 'Nunito-Bold',
  },
  listePlans: {
    gap: espacement.lg,
  },
  cartePlan: {
    borderRadius: arrondi.xl,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: couleurs.blanc,
    ...(ombres.md as object),
  },
  cartePlanRecommandee: {
    ...(ombres.lg as object),
  },
  cartePlanActuelle: {
    opacity: 0.85,
  },
  bandeauRecommande: {
    paddingVertical: espacement.xs,
    alignItems: 'center',
  },
  texteRecommande: {
    fontFamily: 'Nunito-Bold',
    letterSpacing: 0.5,
  },
  enteteCartePlan: {
    padding: espacement.lg,
    gap: espacement.xs,
  },
  ligneNomPlan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.sm,
    flexWrap: 'wrap',
  },
  lignePrix: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: espacement.xs,
    marginTop: espacement.xs,
  },
  unite: {
    marginBottom: espacement.xs,
  },
  corpsCarte: {
    padding: espacement.lg,
    gap: espacement.md,
  },
  ligneFonctionnalite: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espacement.sm,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: arrondi.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  texteFonctionnalite: {
    flex: 1,
  },
  boutonPlan: {
    marginTop: espacement.sm,
  },
  badgePlanActuel: {
    borderWidth: 1,
    borderRadius: arrondi.md,
    paddingVertical: espacement.sm,
    paddingHorizontal: espacement.md,
    marginTop: espacement.sm,
  },
  noteLegale: {
    marginTop: espacement.xl,
    marginBottom: espacement.sm,
  },
  sectionFaq: {
    marginTop: espacement.xl,
    gap: espacement.md,
  },
  titreFaq: {
    marginBottom: espacement.sm,
  },
  itemFaq: {
    gap: 0,
  },
  enteteItemFaq: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espacement.md,
    minHeight: 44,
  },
  questionFaq: {
    flex: 1,
  },
  reponseFaq: {
    marginTop: espacement.md,
  },
  overlayModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  contenuModal: {
    backgroundColor: couleurs.fond,
    borderTopLeftRadius: arrondi.xl,
    borderTopRightRadius: arrondi.xl,
    padding: espacement.xl,
    gap: espacement.lg,
    paddingBottom: espacement.xxl,
  },
  fermerModal: {
    alignSelf: 'flex-end',
    padding: espacement.xs,
  },
  texteModal: {
    lineHeight: 28,
  },
})
