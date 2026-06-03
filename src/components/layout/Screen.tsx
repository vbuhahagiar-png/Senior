import React from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { couleurs, espacement } from '@/lib/theme'

interface EcranProps {
  children: React.ReactNode
  scrollable?: boolean
  padding?: boolean
  couleurFond?: string
  defilableStyle?: ViewStyle
  style?: ViewStyle
  rafraichissable?: boolean
  rafraichissement?: boolean
  onRafraichir?: () => void
  bords?: ('top' | 'bottom' | 'left' | 'right')[]
}

export function Ecran({
  children,
  scrollable = true,
  padding = true,
  couleurFond,
  defilableStyle,
  style,
  rafraichissable,
  rafraichissement,
  onRafraichir,
  bords = ['top', 'bottom'],
}: EcranProps) {
  const fond = couleurFond ?? couleurs.fond

  const contenu = scrollable ? (
    <ScrollView
      contentContainerStyle={[
        padding && styles.padding,
        defilableStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        rafraichissable ? (
          <RefreshControl
            refreshing={rafraichissement ?? false}
            onRefresh={onRafraichir}
            tintColor={couleurs.primaire}
            colors={[couleurs.primaire]}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, padding && styles.padding, defilableStyle]}>
      {children}
    </View>
  )

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: fond }, style]} edges={bords}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        {contenu}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  padding: {
    paddingHorizontal: espacement.lg,
    paddingBottom: espacement.xl,
  },
})
