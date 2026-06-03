import { Link, Stack } from 'expo-router'
import { View, StyleSheet } from 'react-native'
import { Texte } from '@/components/ui/Text'
import { Bouton } from '@/components/ui/Button'
import { Ecran } from '@/components/layout/Screen'
import { couleurs, espacement } from '@/lib/theme'

export default function PageNonTrouvee() {
  return (
    <Ecran>
      <Stack.Screen options={{ title: 'Page introuvable' }} />
      <View style={styles.container}>
        <Texte variante="displayMd" align="center">🔍</Texte>
        <Texte variante="titre" align="center">Page introuvable</Texte>
        <Texte variante="corps" couleur={couleurs.texteSecondaire} align="center">
          Cette page n'existe pas ou a été déplacée.
        </Texte>
        <Link href="/(auth)/" asChild>
          <Bouton variante="primaire">Retour à l'accueil</Bouton>
        </Link>
      </View>
    </Ecran>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacement.lg,
    paddingHorizontal: espacement.xl,
  },
})
