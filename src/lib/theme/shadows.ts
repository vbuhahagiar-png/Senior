import { Platform } from 'react-native'

const ombreCouleur = 'rgba(61, 61, 61, 0.08)'

export const ombres = {
  sm: Platform.select({
    ios: {
      shadowColor: ombreCouleur,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 3,
    },
    android: { elevation: 2 },
    web: { boxShadow: '0 1px 3px rgba(61, 61, 61, 0.08)' },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: ombreCouleur,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
    web: { boxShadow: '0 2px 8px rgba(61, 61, 61, 0.08)' },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: ombreCouleur,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 16,
    },
    android: { elevation: 8 },
    web: { boxShadow: '0 4px 16px rgba(61, 61, 61, 0.10)' },
    default: {},
  }),
} as const
