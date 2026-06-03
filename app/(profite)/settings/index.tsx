import React from 'react'
import { View, StyleSheet, Switch } from 'react-native'
import { useRouter } from 'expo-router'
import {
  User, Bell, Lock, CreditCard, Shield, HelpCircle, LogOut,
  ChevronRight, Smartphone
} from 'lucide-react-native'
import { Ecran } from '@/components/layout/Screen'
import { Texte } from '@/components/ui/Text'
import { Carte } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { couleurs, espacement } from '@/lib/theme'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { ROUTES } from '@/lib/constants'
import { Platform } from 'react-native'

function LigneReglage({
  icone: Icone,
  label,
  soustitre,
  onPress,
  droite,
  couleurIcone,
}: {
  icone: any
  label: string
  soustitre?: string
  onPress?: () => void
  droite?: React.ReactNode
  couleurIcone?: string
}) {
  return (
    <Carte onPress={onPress} padding="md" ombre={false} bordure>
      <View style={styles.ligneCarte}>
        <View style={[styles.iconeContainer, { backgroundColor: (couleurIcone ?? couleurs.primaire) + '15' }]}>
          <Icone size={20} color={couleurIcone ?? couleurs.primaire} strokeWidth={2} />
        </View>
        <View style={styles.ligneContenu}>
          <Texte variante="corps">{label}</Texte>
          {soustitre && (
            <Texte variante="legende" couleur={couleurs.texteSecondaire}>{soustitre}</Texte>
          )}
        </View>
        {droite ?? (onPress && <ChevronRight size={20} color={couleurs.ardoiseLighter} strokeWidth={2} />)}
      </View>
    </Carte>
  )
}

export default function ReglagesScreen() {
  const router = useRouter()
  const { profil, seDeconnecter } = useAuth()
  const { droits, plan } = useSubscription()

  const nomPlan = plan === 'free' ? 'Gratuit' : plan === 'famille' ? 'Famille' : 'Sérénité'

  return (
    <Ecran>
      {/* Profil */}
      <View style={styles.profilSection}>
        <Avatar nom={profil?.display_name ?? 'Utilisateur'} uri={profil?.avatar_url} taille="xl" />
        <View style={styles.profilTexte}>
          <Texte variante="titre">{profil?.display_name}</Texte>
          <Badge
            texte={`Senior + ${nomPlan}`}
            variante={plan === 'free' ? 'neutre' : 'primaire'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Texte variante="etiquettePetite" couleur={couleurs.texteSecondaire}>Mon compte</Texte>
        <LigneReglage icone={User} label="Mon profil" onPress={() => {}} />
        <LigneReglage icone={Bell} label="Notifications" onPress={() => {}} />
        <LigneReglage
          icone={Smartphone}
          label="Accessibilité"
          soustitre="Grand affichage, mode voix, contraste"
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Texte variante="etiquettePetite" couleur={couleurs.texteSecondaire}>Abonnement</Texte>
        <LigneReglage
          icone={CreditCard}
          label={`Plan ${nomPlan}`}
          soustitre={droits.estEnEssai ? 'Essai en cours' : undefined}
          onPress={() => {
            if (Platform.OS === 'web') {
              router.push(ROUTES.WEB.CHECKOUT as any)
            } else {
              router.push(ROUTES.WEB.CHECKOUT as any)
            }
          }}
        />
      </View>

      <View style={styles.section}>
        <Texte variante="etiquettePetite" couleur={couleurs.texteSecondaire}>Confidentialité</Texte>
        <LigneReglage icone={Shield} label="Politique de confidentialité" onPress={() => {}} />
        <LigneReglage icone={Lock} label="Conditions d'utilisation" onPress={() => {}} />
      </View>

      <View style={styles.section}>
        <LigneReglage icone={HelpCircle} label="Aide & Support" onPress={() => {}} />
        <LigneReglage
          icone={LogOut}
          label="Se déconnecter"
          couleurIcone={couleurs.erreur}
          onPress={seDeconnecter}
        />
      </View>

      <Texte variante="legende" couleur={couleurs.texteTertiaire} align="center" style={styles.version}>
        Senior + v1.0.0 · Données hébergées en Suisse
      </Texte>
    </Ecran>
  )
}

const styles = StyleSheet.create({
  profilSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.lg,
    paddingVertical: espacement.lg,
  },
  profilTexte: {
    gap: espacement.sm,
    flex: 1,
  },
  section: {
    gap: espacement.sm,
    marginBottom: espacement.xl,
  },
  ligneCarte: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.md,
  },
  iconeContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ligneContenu: {
    flex: 1,
    gap: 2,
  },
  version: {
    marginTop: espacement.xl,
  },
})
