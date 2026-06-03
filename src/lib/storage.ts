import { Platform } from 'react-native'

// Adaptateur de stockage cross-platform
// - Web : localStorage
// - Native : MMKV (plus rapide, synchrone)
export function creerStockage(id: string) {
  if (Platform.OS === 'web') {
    return {
      getItem: (name: string): string | null => {
        try {
          return localStorage.getItem(`${id}_${name}`)
        } catch {
          return null
        }
      },
      setItem: (name: string, value: string): void => {
        try {
          localStorage.setItem(`${id}_${name}`, value)
        } catch {}
      },
      removeItem: (name: string): void => {
        try {
          localStorage.removeItem(`${id}_${name}`)
        } catch {}
      },
    }
  }

  // Native : MMKV
  try {
    const { MMKV } = require('react-native-mmkv')
    const mmkv = new MMKV({ id })
    return {
      getItem: (name: string): string | null => mmkv.getString(name) ?? null,
      setItem: (name: string, value: string): void => mmkv.set(name, value),
      removeItem: (name: string): void => mmkv.delete(name),
    }
  } catch {
    // Fallback mémoire si MMKV indisponible
    const store: Record<string, string> = {}
    return {
      getItem: (name: string) => store[name] ?? null,
      setItem: (name: string, value: string) => { store[name] = value },
      removeItem: (name: string) => { delete store[name] },
    }
  }
}
