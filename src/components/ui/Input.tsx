import React, { useState } from 'react'
import { View, TextInput, StyleSheet, ViewStyle, Platform } from 'react-native'
import { Texte } from './Text'
import { couleurs, espacement, arrondi, cibleTactile, typographie } from '@/lib/theme'

interface InputProps {
  label?: string
  placeholder?: string
  valeur?: string
  onChangement?: (val: string) => void
  erreur?: string
  aide?: string
  secuirisé?: boolean
  typeClavier?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad'
  multiline?: boolean
  lignes?: number
  desactive?: boolean
  autoFocus?: boolean
  returnKeyType?: 'done' | 'next' | 'send' | 'go' | 'search'
  onSubmit?: () => void
  style?: ViewStyle
  inputRef?: React.RefObject<TextInput>
  accessibilityLabel?: string
}

export function Input({
  label,
  placeholder,
  valeur,
  onChangement,
  erreur,
  aide,
  secuirisé,
  typeClavier,
  multiline,
  lignes = 4,
  desactive,
  autoFocus,
  returnKeyType = 'done',
  onSubmit,
  style,
  inputRef,
  accessibilityLabel,
}: InputProps) {
  const [focus, setFocus] = useState(false)

  const couleurBordure = erreur
    ? couleurs.erreur
    : focus
    ? couleurs.bordureFocused
    : couleurs.bordure

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Texte variante="etiquette" style={styles.label}>
          {label}
        </Texte>
      )}
      <TextInput
        ref={inputRef}
        value={valeur}
        onChangeText={onChangement}
        placeholder={placeholder}
        placeholderTextColor={couleurs.texteTertiaire}
        secureTextEntry={secuirisé}
        keyboardType={typeClavier}
        multiline={multiline}
        numberOfLines={multiline ? lignes : 1}
        editable={!desactive}
        autoFocus={autoFocus}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmit}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        accessible
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={aide}
        style={[
          styles.input,
          {
            borderColor: couleurBordure,
            backgroundColor: desactive ? couleurs.fond : couleurs.blanc,
            minHeight: multiline ? cibleTactile.confort * lignes * 0.4 : cibleTactile.confort,
            textAlignVertical: multiline ? 'top' : 'center',
          },
        ]}
      />
      {erreur && (
        <Texte variante="legende" couleur={couleurs.erreur} style={styles.message}>
          {erreur}
        </Texte>
      )}
      {aide && !erreur && (
        <Texte variante="legende" couleur={couleurs.texteSecondaire} style={styles.message}>
          {aide}
        </Texte>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: espacement.xs,
  },
  label: {
    marginBottom: espacement.xs,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: arrondi.md,
    paddingHorizontal: espacement.md,
    paddingVertical: espacement.sm,
    ...typographie.corps,
    color: couleurs.texte,
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
    }),
  },
  message: {
    marginTop: espacement.xs,
  },
})
