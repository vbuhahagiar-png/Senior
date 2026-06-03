import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { Texte } from './Text'
import { couleurs, arrondi } from '@/lib/theme'
import { getInitiales } from '@/lib/utils'

type TailleAvatar = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  nom: string
  uri?: string | null
  taille?: TailleAvatar
  couleurFond?: string
}

const DIMENSIONS: Record<TailleAvatar, number> = {
  sm: 32,
  md: 44,
  lg: 56,
  xl: 80,
}

export function Avatar({ nom, uri, taille = 'md', couleurFond }: AvatarProps) {
  const dim = DIMENSIONS[taille]
  const initiales = getInitiales(nom)

  return (
    <View
      style={[
        styles.container,
        {
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          backgroundColor: couleurFond ?? couleurs.saugeLighter,
        },
      ]}
      accessible
      accessibilityLabel={nom}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: dim, height: dim, borderRadius: dim / 2 }}
          contentFit="cover"
        />
      ) : (
        <Texte
          variante={taille === 'xl' ? 'titre' : taille === 'lg' ? 'corpsgrand' : 'corps'}
          couleur={couleurs.saugeDark}
        >
          {initiales}
        </Texte>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
})
