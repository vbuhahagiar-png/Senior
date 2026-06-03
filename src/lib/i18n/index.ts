import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'

import frCommon from './fr/common.json'
import frOnboarding from './fr/onboarding.json'
import frRitual from './fr/ritual.json'
import frActivities from './fr/activities.json'
import frSubscription from './fr/subscription.json'
import frFamily from './fr/family.json'
import frLetters from './fr/letters.json'
import frCompanion from './fr/companion.json'
import frNotifications from './fr/notifications.json'

import deCommon from './de/common.json'
import itCommon from './it/common.json'

const ressources = {
  fr: {
    common: frCommon,
    onboarding: frOnboarding,
    ritual: frRitual,
    activities: frActivities,
    subscription: frSubscription,
    family: frFamily,
    letters: frLetters,
    companion: frCompanion,
    notifications: frNotifications,
  },
  de: {
    common: deCommon,
  },
  it: {
    common: itCommon,
  },
}

function detecterLangue(): string {
  const locales = Localization.getLocales()
  const languePref = locales[0]?.languageCode ?? 'fr'
  if (['fr', 'de', 'it'].includes(languePref)) {
    return languePref
  }
  return 'fr'
}

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: ressources,
      lng: detecterLangue(),
      fallbackLng: 'fr',
      defaultNS: 'common',
      ns: ['common', 'onboarding', 'ritual', 'activities', 'subscription', 'family', 'letters', 'companion', 'notifications'],
      interpolation: {
        escapeValue: false,
      },
      compatibilityJSON: 'v4',
    })
}

export default i18n
export { useTranslation } from 'react-i18next'

export function changerLangue(langue: 'fr' | 'de' | 'it'): void {
  i18n.changeLanguage(langue)
}
