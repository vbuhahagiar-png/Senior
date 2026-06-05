import React, { useState } from 'react'
import { View, StyleSheet, Switch, ScrollView, TouchableOpacity, Linking } from 'react-native'
import { useRouter } from 'expo-router'
import {
  User, Bell, Smartphone, CreditCard, Shield, HelpCircle, LogOut,
  ChevronRight, Globe, MessageCircle, Edit3, Star, Lock, Eye,
} from 'lucide-react-native'
import { Texte } from '@/components/ui/Text'
import { Carte } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Bouton } from '@/components/ui/Button'
import { couleurs, espacement, arrondi } from '@/lib/theme'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { ROUTES } from '@/lib/constants'

function SectionHeader({ titre }: { titre: string }) {
  return (
    <Texte variante="etiquettePetite" couleur={couleurs.texteSecondaire} style={styles.sectionHeader}>
      {titre.toUpperCase()}
    </Texte>
  )
}

function LigneReglage({
  icone: Icone,
  label,
  soustitre,
  onPress,
  droite,
  couleurIcone,
  danger,
}: {
  icone: any
  label: string
  soustitre?: string
  onPress?: () => void
  droite?: React.ReactNode
  couleurIcone?: string
  danger?: boolean
}) {
  const ic = danger ? couleurs.erreur : (couleurIcone ?? couleurs.primaire)
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1} disabled={!onPress}>
      <View style={styles.ligneCarte}>
        <View style={[styles.iconeContainer, { backgroundColor: ic + '18' }]}>
          <Icone size={20} color={ic} strokeWidth={2} />
        </View>
        <View style={styles.ligneContenu}>
          <Texte variante="corps" couleur={danger ? couleurs.erreur : undefined}>{label}</Texte>
          {soustitre && (
            <Texte variante="legende" couleur={couleurs.texteSecondaire}>{soustitre}</Texte>
          )}
        </View>
        {droite ?? (onPress && <ChevronRight size={18} color={couleurs.ardoiseLighter} strokeWidth={2} />)}
      </View>
    </TouchableOpacity>
  )
}

function GroupeReglages({ children }: { children: React.ReactNode }) {
  return <View style={styles.groupe}>{children}</View>
}

export default function ReglagesScreen() {
  const router = useRouter()
  const { profil, seDeconnecter } = useAuth()
  const { droits, plan } = useSubscription()

  const [notifRappels, setNotifRappels] = useState(true)
  const [notifMedic, setNotifMedic] = useState(true)
  const [notifActivites, setNotifActivites] = useState(false)
  const [notifCercle, setNotifCercle] = useState(true)
  const [grandTexte, setGrandTexte] = useState(false)
  const [hautContraste, setHautContraste] = useState(false)
  const [modeVoix, setModeVoix] = useState(false)

  const nomPlan = plan === 'free' ? 'Gratuit' : plan === 'famille' ? 'Famille ⭐' : 'Sérénité 💎'
  const variantePlan = plan === 'free' ? 'neutre' : plan === 'famille' ? 'primaire' : 'accent'

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Carte profil */}
      <View style={styles.profilCarte}>
        <View style={styles.profilAvatar}>
          <Avatar nom={profil?.display_name ?? 'Utilisateur'} uri={profil?.avatar_url} taille="xl" />
          <TouchableOpacity style={styles.editAvatarBtn}>
            <Edit3 size={14} color={couleurs.blanc} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
        <View style={styles.profilInfo}>
          <Texte variante="titre">{profil?.display_name ?? 'Marie Dubois'}</Texte>
          <Texte variante="legende" couleur={couleurs.texteSecondaire}>
            {profil?.email ?? 'marie.dubois@email.com'}
          </Texte>
          <View style={styles.profilBadges}>
            <Badge texte={`Senior + ${nomPlan}`} variante={variantePlan} />
            {droits.estEnEssai && <Badge texte="Essai 30j" variante="attention" />}
          </View>
        </View>
      </View>

      {/* Abonnement */}
      <View style={styles.section}>
        <SectionHeader titre="Abonnement" />
        <GroupeReglages>
          <LigneReglage
            icone={CreditCard}
            label={`Plan ${nomPlan}`}
            soustitre={plan === 'free' ? 'Passez à Famille pour plus de fonctionnalités' : 'Gérer votre abonnement'}
            couleurIcone={plan === 'free' ? couleurs.texteSecondaire : couleurs.accent}
            onPress={() => router.push(ROUTES.PROFITE.ABONNEMENT as any)}
          />
          {plan === 'free' && (
            <View style={styles.upgradeCard}>
              <Texte variante="corpsgrand">🌟 Débloquez toutes les fonctionnalités</Texte>
              <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire} style={{ marginTop: 4 }}>
                Compagnon Nia, courriers illimités, cercle familial complet
              </Texte>
              <Bouton
                variante="primaire"
                taille="sm"
                style={{ marginTop: espacement.md }}
                onPress={() => router.push(ROUTES.PROFITE.ABONNEMENT as any)}
              >
                Voir les offres
              </Bouton>
            </View>
          )}
        </GroupeReglages>
      </View>

      {/* Profil */}
      <View style={styles.section}>
        <SectionHeader titre="Mon compte" />
        <GroupeReglages>
          <LigneReglage
            icone={User}
            label="Modifier mon profil"
            soustitre="Nom, prénom, date de naissance, ville"
            onPress={() => {}}
          />
          <View style={styles.separateur} />
          <LigneReglage
            icone={Globe}
            label="Langue"
            soustitre="Français (Suisse)"
            onPress={() => {}}
          />
        </GroupeReglages>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <SectionHeader titre="Notifications" />
        <GroupeReglages>
          <LigneReglage
            icone={Bell}
            label="Rappels quotidiens"
            soustitre="Rituels du matin, médicaments"
            couleurIcone={couleurs.accent}
            droite={<Switch value={notifRappels} onValueChange={setNotifRappels} trackColor={{ true: couleurs.primaire, false: couleurs.bordure }} />}
          />
          <View style={styles.separateur} />
          <LigneReglage
            icone={Bell}
            label="Médicaments"
            soustitre="Rappels de prise"
            couleurIcone={couleurs.erreur}
            droite={<Switch value={notifMedic} onValueChange={setNotifMedic} trackColor={{ true: couleurs.primaire, false: couleurs.bordure }} />}
          />
          <View style={styles.separateur} />
          <LigneReglage
            icone={Bell}
            label="Nouvelles activités"
            soustitre="Suggestions près de chez vous"
            couleurIcone={couleurs.succes}
            droite={<Switch value={notifActivites} onValueChange={setNotifActivites} trackColor={{ true: couleurs.primaire, false: couleurs.bordure }} />}
          />
          <View style={styles.separateur} />
          <LigneReglage
            icone={Bell}
            label="Cercle familial"
            soustitre="Messages et publications"
            couleurIcone={couleurs.info}
            droite={<Switch value={notifCercle} onValueChange={setNotifCercle} trackColor={{ true: couleurs.primaire, false: couleurs.bordure }} />}
          />
        </GroupeReglages>
      </View>

      {/* Accessibilité */}
      <View style={styles.section}>
        <SectionHeader titre="Accessibilité" />
        <GroupeReglages>
          <LigneReglage
            icone={Smartphone}
            label="Grand affichage"
            soustitre="Texte et boutons plus grands"
            droite={<Switch value={grandTexte} onValueChange={setGrandTexte} trackColor={{ true: couleurs.primaire, false: couleurs.bordure }} />}
          />
          <View style={styles.separateur} />
          <LigneReglage
            icone={Eye}
            label="Haut contraste"
            soustitre="Meilleure lisibilité"
            droite={<Switch value={hautContraste} onValueChange={setHautContraste} trackColor={{ true: couleurs.primaire, false: couleurs.bordure }} />}
          />
          <View style={styles.separateur} />
          <LigneReglage
            icone={Smartphone}
            label="Mode vocal"
            soustitre="Navigation par commandes vocales"
            droite={<Switch value={modeVoix} onValueChange={setModeVoix} trackColor={{ true: couleurs.primaire, false: couleurs.bordure }} />}
          />
        </GroupeReglages>
      </View>

      {/* Confidentialité */}
      <View style={styles.section}>
        <SectionHeader titre="Confidentialité & sécurité" />
        <GroupeReglages>
          <LigneReglage
            icone={Shield}
            label="Politique de confidentialité"
            couleurIcone={couleurs.info}
            onPress={() => Linking.openURL('https://seniorplus.ch/privacy')}
          />
          <View style={styles.separateur} />
          <LigneReglage
            icone={Lock}
            label="Conditions d'utilisation"
            couleurIcone={couleurs.info}
            onPress={() => Linking.openURL('https://seniorplus.ch/terms')}
          />
          <View style={styles.separateur} />
          <LigneReglage
            icone={Shield}
            label="Mes données"
            soustitre="Hébergées en Suisse · RGPD"
            couleurIcone={couleurs.succes}
            onPress={() => {}}
          />
        </GroupeReglages>
      </View>

      {/* Aide */}
      <View style={styles.section}>
        <SectionHeader titre="Aide" />
        <GroupeReglages>
          <LigneReglage
            icone={MessageCircle}
            label="Contacter le support"
            soustitre="Nia ou formulaire de contact"
            couleurIcone={couleurs.accent}
            onPress={() => router.push(ROUTES.PROFITE.CONTACT as any)}
          />
          <View style={styles.separateur} />
          <LigneReglage
            icone={HelpCircle}
            label="FAQ & guide d'utilisation"
            couleurIcone={couleurs.primaire}
            onPress={() => router.push(ROUTES.PROFITE.CONTACT as any)}
          />
          <View style={styles.separateur} />
          <LigneReglage
            icone={Star}
            label="Donner mon avis"
            soustitre="Aidez-nous à améliorer l'app"
            couleurIcone={couleurs.attention}
            onPress={() => {}}
          />
        </GroupeReglages>
      </View>

      {/* Déconnexion */}
      <View style={styles.section}>
        <GroupeReglages>
          <LigneReglage
            icone={LogOut}
            label="Se déconnecter"
            danger
            onPress={seDeconnecter}
          />
        </GroupeReglages>
      </View>

      <Texte variante="legende" couleur={couleurs.texteTertiaire} align="center" style={styles.version}>
        Senior + v1.0.0 · Données hébergées en Suisse 🇨🇭
      </Texte>

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: couleurs.ivoire },
  container: { padding: espacement.lg, gap: 0 },
  profilCarte: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.lg,
    backgroundColor: couleurs.blanc,
    borderRadius: arrondi.xl,
    padding: espacement.lg,
    marginBottom: espacement.xl,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  profilAvatar: { position: 'relative' },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: couleurs.accent,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: couleurs.blanc,
  },
  profilInfo: { flex: 1, gap: espacement.xs },
  profilBadges: { flexDirection: 'row', gap: espacement.sm, flexWrap: 'wrap', marginTop: 2 },
  sectionHeader: {
    marginBottom: espacement.sm,
    paddingHorizontal: espacement.xs,
  },
  section: { marginBottom: espacement.xl },
  groupe: {
    backgroundColor: couleurs.blanc,
    borderRadius: arrondi.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  ligneCarte: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.md,
    paddingHorizontal: espacement.md,
    paddingVertical: espacement.md,
    minHeight: 60,
  },
  iconeContainer: {
    width: 38,
    height: 38,
    borderRadius: arrondi.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ligneContenu: {
    flex: 1,
    gap: 2,
  },
  separateur: {
    height: 1,
    backgroundColor: couleurs.bordure,
    marginLeft: 38 + espacement.md * 2,
  },
  upgradeCard: {
    margin: espacement.md,
    marginTop: 0,
    padding: espacement.md,
    backgroundColor: couleurs.accent + '12',
    borderRadius: arrondi.lg,
    borderWidth: 1,
    borderColor: couleurs.accent + '30',
  },
  version: {
    marginTop: espacement.md,
    marginBottom: espacement.sm,
  },
})
