import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { Check, Shield, MapPin } from 'lucide-react-native'
import { Ecran } from '@/components/layout/Screen'
import { Texte } from '@/components/ui/Text'
import { Bouton } from '@/components/ui/Button'
import { Carte } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { couleurs, espacement, arrondi } from '@/lib/theme'

type PlanKey = 'famille' | 'serenite'
type Billing = 'monthly' | 'annual'

const PLANS: Record<PlanKey, {
  nom: string
  prixMensuel: number
  prixAnnuel: number
  description: string
  fonctionnalites: string[]
  populaire?: boolean
}> = {
  famille: {
    nom: 'Famille',
    prixMensuel: 24.90,
    prixAnnuel: 249,
    description: 'Pour un quotidien serein en famille',
    fonctionnalites: [
      'Rituel du matin complet',
      'Médicaments illimités',
      'Famille entière',
      'Activités illimitées',
      'Décodage de courriers IA',
      'Cercle d\'aidants complet',
      'Résumé hebdo famille',
      'Support prioritaire',
    ],
    populaire: true,
  },
  serenite: {
    nom: 'Sérénité',
    prixMensuel: 39.90,
    prixAnnuel: 399,
    description: 'La tranquillité d\'esprit complète',
    fonctionnalites: [
      'Tout le plan Famille',
      'Bilan retraite AVS/LPP',
      'Coffre-fort documents',
      'Conseiller prioritaire',
      'Livre de mémoires',
    ],
  },
}

export default function CheckoutPage() {
  const router = useRouter()
  const [planSelectionne, setPlanSelectionne] = useState<PlanKey>('famille')
  const [billing, setBilling] = useState<Billing>('annual')
  const [chargement, setChargement] = useState(false)

  const plan = PLANS[planSelectionne]
  const prix = billing === 'annual' ? plan.prixAnnuel : plan.prixMensuel
  const prixMoisAnnuel = plan.prixAnnuel / 12

  const handleAbonner = async () => {
    setChargement(true)
    try {
      // Appel Edge Function → URL Stripe Checkout
      const { supabase } = await import('@/services/supabase/client')
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { plan: planSelectionne, billing },
      })
      if (error) throw error
      if (Platform.OS === 'web' && data?.url) {
        window.location.href = data.url
      }
    } catch (e) {
      console.error('Erreur checkout:', e)
    } finally {
      setChargement(false)
    }
  }

  return (
    <Ecran>
      <View style={styles.container}>
        <View style={styles.entete}>
          <Texte variante="displayMd" align="center">Choisissez votre plan</Texte>
          <Texte variante="corps" couleur={couleurs.texteSecondaire} align="center">
            1er mois offert · Sans engagement
          </Texte>
        </View>

        {/* Toggle mensuel / annuel */}
        <View style={styles.billingToggle}>
          {(['monthly', 'annual'] as Billing[]).map((b) => (
            <TouchableOpacity
              key={b}
              onPress={() => setBilling(b)}
              style={[
                styles.toggleOption,
                billing === b && styles.toggleOptionActive,
              ]}
            >
              <Texte
                variante="corpsPetit"
                couleur={billing === b ? couleurs.blanc : couleurs.texteSecondaire}
              >
                {b === 'monthly' ? 'Mensuel' : 'Annuel'}
              </Texte>
              {b === 'annual' && (
                <Badge texte="-17%" variante="succes" style={styles.badgeEconomie} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Plans */}
        <View style={styles.plans}>
          {(Object.entries(PLANS) as [PlanKey, typeof PLANS[PlanKey]][]).map(([key, p]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setPlanSelectionne(key)}
              style={[
                styles.planCarte,
                planSelectionne === key && styles.planCarteActive,
              ]}
            >
              {p.populaire && (
                <Badge texte="Le plus populaire" variante="primaire" style={styles.badgePopulaire} />
              )}
              <View style={styles.planEntete}>
                <Texte variante="titre">{p.nom}</Texte>
                <View style={styles.prixContainer}>
                  <Texte variante="displayMd" couleur={couleurs.accent}>
                    {billing === 'annual'
                      ? `CHF ${prixMoisAnnuel.toFixed(2)}`
                      : `CHF ${p.prixMensuel.toFixed(2)}`}
                  </Texte>
                  <Texte variante="legende" couleur={couleurs.texteSecondaire}>/mois</Texte>
                </View>
                {billing === 'annual' && (
                  <Texte variante="legende" couleur={couleurs.texteSecondaire}>
                    CHF {p.prixAnnuel}/an · 1er mois offert
                  </Texte>
                )}
              </View>
              <View style={styles.fonctionnalites}>
                {p.fonctionnalites.map((f) => (
                  <View key={f} style={styles.fonctionnalite}>
                    <Check size={16} color={couleurs.primaire} strokeWidth={2.5} />
                    <Texte variante="corpsPetit">{f}</Texte>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Bouton
          variante="accent"
          pleineLargeur
          chargement={chargement}
          onPress={handleAbonner}
          accessibilityLabel={`S'abonner au plan ${plan.nom}`}
        >
          Essayer gratuitement — 1 mois offert
        </Bouton>

        {/* Garanties */}
        <View style={styles.garanties}>
          <View style={styles.garantie}>
            <Shield size={16} color={couleurs.primaire} strokeWidth={2} />
            <Texte variante="legende" couleur={couleurs.texteSecondaire}>
              Paiement sécurisé par Stripe
            </Texte>
          </View>
          <View style={styles.garantie}>
            <MapPin size={16} color={couleurs.primaire} strokeWidth={2} />
            <Texte variante="legende" couleur={couleurs.texteSecondaire}>
              Données hébergées en Suisse
            </Texte>
          </View>
        </View>
      </View>
    </Ecran>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: espacement.xl,
    paddingTop: espacement.xl,
  },
  entete: {
    gap: espacement.sm,
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: couleurs.brumeLight,
    borderRadius: arrondi.lg,
    padding: 4,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: espacement.sm,
    borderRadius: arrondi.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: espacement.xs,
  },
  toggleOptionActive: {
    backgroundColor: couleurs.primaire,
  },
  badgeEconomie: {
    paddingVertical: 2,
  },
  plans: {
    gap: espacement.md,
  },
  planCarte: {
    backgroundColor: couleurs.blanc,
    borderRadius: arrondi.xl,
    padding: espacement.lg,
    borderWidth: 2,
    borderColor: couleurs.bordure,
    gap: espacement.md,
  },
  planCarteActive: {
    borderColor: couleurs.primaire,
    backgroundColor: couleurs.saugeLighter + '20',
  },
  badgePopulaire: {
    alignSelf: 'flex-start',
  },
  planEntete: {
    gap: espacement.xs,
  },
  prixContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: espacement.xs,
  },
  fonctionnalites: {
    gap: espacement.sm,
  },
  fonctionnalite: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.sm,
  },
  garanties: {
    gap: espacement.sm,
  },
  garantie: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.sm,
    justifyContent: 'center',
  },
})
