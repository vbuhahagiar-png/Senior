import React, { useState, useRef } from 'react'
import { View, StyleSheet, TextInput, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Ecran } from '@/components/layout/Screen'
import { Texte } from '@/components/ui/Text'
import { Bouton } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { couleurs, espacement } from '@/lib/theme'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'

export default function ConnexionScreen() {
  const router = useRouter()
  const { seConnecter } = useAuth()

  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreurs, setErreurs] = useState<{ email?: string; motDePasse?: string }>({})
  const [chargement, setChargement] = useState(false)

  const refMotDePasse = useRef<TextInput>(null)

  function valider(): boolean {
    const nouvellesErreurs: typeof erreurs = {}
    if (!email || !email.includes('@')) {
      nouvellesErreurs.email = 'Veuillez entrer une adresse email valide.'
    }
    if (!motDePasse || motDePasse.length < 6) {
      nouvellesErreurs.motDePasse = 'Mot de passe trop court.'
    }
    setErreurs(nouvellesErreurs)
    return Object.keys(nouvellesErreurs).length === 0
  }

  async function handleConnexion() {
    if (!valider()) return
    setChargement(true)
    const { erreur } = await seConnecter(email, motDePasse)
    setChargement(false)
    if (erreur) {
      Alert.alert('Connexion impossible', 'Email ou mot de passe incorrect. Veuillez réessayer.')
    }
  }

  return (
    <Ecran>
      <View style={styles.container}>
        <View style={styles.entete}>
          <Texte variante="displayMd">Connexion</Texte>
          <Texte variante="corps" couleur={couleurs.texteSecondaire}>
            Bon retour sur Senior + !
          </Texte>
        </View>

        <View style={styles.formulaire}>
          <Input
            label="Adresse email"
            placeholder="votre@email.ch"
            valeur={email}
            onChangement={setEmail}
            erreur={erreurs.email}
            typeClavier="email-address"
            returnKeyType="next"
            onSubmit={() => refMotDePasse.current?.focus()}
            accessibilityLabel="Adresse email"
          />
          <Input
            inputRef={refMotDePasse}
            label="Mot de passe"
            placeholder="••••••••"
            valeur={motDePasse}
            onChangement={setMotDePasse}
            erreur={erreurs.motDePasse}
            secuirisé
            returnKeyType="done"
            onSubmit={handleConnexion}
            accessibilityLabel="Mot de passe"
          />

          <Bouton
            variante="fantome"
            taille="sm"
            onPress={() => router.push(ROUTES.AUTH.MOT_DE_PASSE as any)}
            style={styles.lienMdp}
          >
            Mot de passe oublié ?
          </Bouton>
        </View>

        <View style={styles.actions}>
          <Bouton
            variante="primaire"
            pleineLargeur
            chargement={chargement}
            onPress={handleConnexion}
            accessibilityLabel="Se connecter"
          >
            Se connecter
          </Bouton>

          <Bouton
            variante="secondaire"
            pleineLargeur
            onPress={() => router.push(ROUTES.AUTH.INSCRIPTION as any)}
          >
            Créer un compte
          </Bouton>
        </View>
      </View>
    </Ecran>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: espacement.xl,
    paddingTop: espacement.xl,
  },
  entete: {
    gap: espacement.sm,
  },
  formulaire: {
    gap: espacement.md,
  },
  actions: {
    gap: espacement.md,
  },
  lienMdp: {
    alignSelf: 'flex-end',
  },
})
