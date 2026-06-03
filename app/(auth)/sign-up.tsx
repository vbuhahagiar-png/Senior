import React, { useState } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ecran } from '@/components/layout/Screen'
import { Texte } from '@/components/ui/Text'
import { Bouton } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { couleurs, espacement } from '@/lib/theme'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'

export default function InscriptionScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ role?: string; nom?: string }>()
  const { sInscrire } = useAuth()

  const [nom, setNom] = useState(params.nom ?? '')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [motDePasseConfirm, setMotDePasseConfirm] = useState('')
  const [erreurs, setErreurs] = useState<Record<string, string>>({})
  const [chargement, setChargement] = useState(false)

  const role = (params.role as 'profite' | 'accompagne') ?? 'profite'

  function valider(): boolean {
    const e: Record<string, string> = {}
    if (!nom || nom.length < 2) e.nom = 'Votre prénom doit avoir au moins 2 caractères.'
    if (!email || !email.includes('@')) e.email = 'Adresse email invalide.'
    if (!motDePasse || motDePasse.length < 8) e.motDePasse = 'Au moins 8 caractères.'
    if (motDePasse !== motDePasseConfirm) e.confirm = 'Les mots de passe ne correspondent pas.'
    setErreurs(e)
    return Object.keys(e).length === 0
  }

  async function handleInscription() {
    if (!valider()) return
    setChargement(true)
    const { erreur } = await sInscrire(email, motDePasse, nom, role)
    setChargement(false)

    if (erreur) {
      Alert.alert('Erreur lors de l\'inscription', erreur)
    } else {
      Alert.alert(
        'Compte créé !',
        'Vérifiez votre email pour confirmer votre compte, puis connectez-vous.',
        [{ text: 'OK', onPress: () => router.replace(ROUTES.AUTH.CONNEXION as any) }]
      )
    }
  }

  return (
    <Ecran>
      <View style={styles.container}>
        <View style={styles.entete}>
          <Texte variante="displayMd">Créer votre compte</Texte>
          <Texte variante="corps" couleur={couleurs.texteSecondaire}>
            Rejoignez Senior + pour profiter de chaque jour.
          </Texte>
        </View>

        <View style={styles.formulaire}>
          <Input
            label="Votre prénom"
            placeholder="Marie"
            valeur={nom}
            onChangement={setNom}
            erreur={erreurs.nom}
            returnKeyType="next"
          />
          <Input
            label="Adresse email"
            placeholder="marie@email.ch"
            valeur={email}
            onChangement={setEmail}
            erreur={erreurs.email}
            typeClavier="email-address"
            returnKeyType="next"
          />
          <Input
            label="Mot de passe"
            placeholder="Au moins 8 caractères"
            valeur={motDePasse}
            onChangement={setMotDePasse}
            erreur={erreurs.motDePasse}
            aide="Au moins 8 caractères."
            secuirisé
            returnKeyType="next"
          />
          <Input
            label="Confirmer le mot de passe"
            placeholder="Répétez votre mot de passe"
            valeur={motDePasseConfirm}
            onChangement={setMotDePasseConfirm}
            erreur={erreurs.confirm}
            secuirisé
            returnKeyType="done"
            onSubmit={handleInscription}
          />
        </View>

        <View style={styles.actions}>
          <Bouton
            variante="primaire"
            pleineLargeur
            chargement={chargement}
            onPress={handleInscription}
          >
            Créer mon compte
          </Bouton>
          <Texte variante="legende" couleur={couleurs.texteSecondaire} align="center">
            En créant un compte, vous acceptez nos{' '}
            <Texte variante="legende" couleur={couleurs.primaire}>
              Conditions d'utilisation
            </Texte>
            .
          </Texte>
        </View>
      </View>
    </Ecran>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: espacement.xl, paddingTop: espacement.xl },
  entete: { gap: espacement.sm },
  formulaire: { gap: espacement.md },
  actions: { gap: espacement.md },
})
