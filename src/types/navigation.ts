export type ParamsAuth = {
  '/(auth)/': undefined
  '/(auth)/sign-in': undefined
  '/(auth)/sign-up': undefined
  '/(auth)/forgot-password': undefined
  '/(auth)/onboarding/welcome': undefined
  '/(auth)/onboarding/profile-choice': undefined
  '/(auth)/onboarding/profite/step-1-name': undefined
  '/(auth)/onboarding/profite/step-2-birthday': undefined
  '/(auth)/onboarding/profite/step-3-city': undefined
  '/(auth)/onboarding/profite/step-4-interests': undefined
  '/(auth)/onboarding/accompagne/step-1-name': undefined
  '/(auth)/onboarding/accompagne/step-2-senior': undefined
  '/(auth)/onboarding/accompagne/step-3-confirm': undefined
}

export type ParamsProfite = {
  '/(profite)/home/': undefined
  '/(profite)/activities/': undefined
  '/(profite)/activities/[id]': { id: string }
  '/(profite)/companion/': undefined
  '/(profite)/letters/': undefined
  '/(profite)/circle/': undefined
  '/(profite)/settings/': undefined
}

export type ParamsAccompagne = {
  '/(accompagne)/dashboard/': undefined
  '/(accompagne)/circle/': undefined
  '/(accompagne)/activities/': undefined
  '/(accompagne)/letters/': undefined
  '/(accompagne)/alerts/': undefined
  '/(accompagne)/settings/': undefined
}

export type ParamsWeb = {
  '/(web)/checkout/': { plan?: string; billing?: string }
  '/(web)/portal': undefined
}

export type TousParams = ParamsAuth & ParamsProfite & ParamsAccompagne & ParamsWeb
