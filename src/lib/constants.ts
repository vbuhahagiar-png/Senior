// Clés de stockage MMKV
export const CLES_MMKV = {
  SESSION_AUTH: 'auth_session',
  PROFIL: 'profil_utilisateur',
  RITUEL_AUJOURD_HUI: 'rituel_auj',
  ABONNEMENT: 'abonnement_etat',
  ACTIVITES_CACHE: 'activites_cache',
  QUEUE_HORS_LIGNE: 'queue_hors_ligne',
  PREFERENCES_NOTIF: 'prefs_notif',
  ACCESSIBILITE: 'accessibilite',
  LANGUE: 'langue_selectionnee',
  ONBOARDING_ETAPE: 'onboarding_etape',
} as const

// Clés React Query
export const CLES_QUERY = {
  PROFIL: (id: string) => ['profil', id] as const,
  RITUEL: (id: string, date: string) => ['rituel', id, date] as const,
  RITUELS_HISTORIQUE: (id: string) => ['rituels', 'historique', id] as const,
  CERCLE: (seniorId: string) => ['cercle', seniorId] as const,
  TACHES: (circleId: string) => ['taches', circleId] as const,
  FIL_FAMILLE: (seniorId: string) => ['fil', seniorId] as const,
  ACTIVITES: (filtres: Record<string, unknown>) => ['activites', filtres] as const,
  ACTIVITE: (id: string) => ['activite', id] as const,
  ACTIVITES_SAUVEGARDEES: (profileId: string) => ['activites', 'sauvegardees', profileId] as const,
  COURRIERS: (seniorId: string) => ['courriers', seniorId] as const,
  COURRIER: (id: string) => ['courrier', id] as const,
  ABONNEMENT: (profileId: string) => ['abonnement', profileId] as const,
  SESSIONS_COMPAGNON: (profileId: string) => ['compagnon', 'sessions', profileId] as const,
  RENDEZ_VOUS: (profileId: string) => ['rdv', profileId] as const,
} as const

// Noms de routes
export const ROUTES = {
  AUTH: {
    ACCUEIL: '/(auth)/',
    CONNEXION: '/(auth)/sign-in',
    INSCRIPTION: '/(auth)/sign-up',
    MOT_DE_PASSE: '/(auth)/forgot-password',
    ONBOARDING: {
      BIENVENUE: '/(auth)/onboarding/welcome',
      CHOIX: '/(auth)/onboarding/profile-choice',
      PROFITE: {
        NOM: '/(auth)/onboarding/profite/step-1-name',
        ANNIVERSAIRE: '/(auth)/onboarding/profite/step-2-birthday',
        VILLE: '/(auth)/onboarding/profite/step-3-city',
        INTERETS: '/(auth)/onboarding/profite/step-4-interests',
      },
      ACCOMPAGNE: {
        NOM: '/(auth)/onboarding/accompagne/step-1-name',
        SENIOR: '/(auth)/onboarding/accompagne/step-2-senior',
        CONFIRMATION: '/(auth)/onboarding/accompagne/step-3-confirm',
      },
    },
  },
  PROFITE: {
    ACCUEIL: '/(profite)/home/',
    ACTIVITES: '/(profite)/activities/',
    ACTIVITE_DETAIL: (id: string) => `/(profite)/activities/${id}` as const,
    COMPAGNON: '/(profite)/companion/',
    COURRIERS: '/(profite)/letters/',
    CERCLE: '/(profite)/circle/',
    REGLAGES: '/(profite)/settings/',
    ABONNEMENT: '/(profite)/subscription/',
    CONTACT: '/(profite)/contact/',
  },
  ACCOMPAGNE: {
    TABLEAU: '/(accompagne)/dashboard/',
    CERCLE: '/(accompagne)/circle/',
    ACTIVITES: '/(accompagne)/activities/',
    COURRIERS: '/(accompagne)/letters/',
    ALERTES: '/(accompagne)/alerts/',
    REGLAGES: '/(accompagne)/settings/',
    ABONNEMENT: '/(accompagne)/subscription/',
    CONTACT: '/(accompagne)/contact/',
  },
  WEB: {
    CHECKOUT: '/(web)/checkout/',
    PORTAIL: '/(web)/portal',
  },
} as const

// Plans d'abonnement
export const PLANS = {
  GRATUIT: 'free',
  FAMILLE: 'famille',
  SERENITE: 'serenite',
} as const

// Prix Stripe (IDs configurés dans le dashboard Stripe)
export const STRIPE_PRICE_IDS = {
  FAMILLE_MENSUEL: process.env.EXPO_PUBLIC_STRIPE_FAMILLE_MENSUEL ?? '',
  FAMILLE_ANNUEL: process.env.EXPO_PUBLIC_STRIPE_FAMILLE_ANNUEL ?? '',
  SERENITE_MENSUEL: process.env.EXPO_PUBLIC_STRIPE_SERENITE_MENSUEL ?? '',
  SERENITE_ANNUEL: process.env.EXPO_PUBLIC_STRIPE_SERENITE_ANNUEL ?? '',
} as const

// OpenAgenda — identifiants des agendas genevois
export const OPENAGENDA_AGENDAS = {
  PRO_SENECTUTE_GE: '25783296',
  SPORTS_VILLE_GE: '39823412',
  GENEVE_AGENDA: '40127863',
} as const

// Cantons suisses
export const CANTONS = ['VD', 'GE', 'VS', 'FR', 'NE', 'JU', 'BE', 'AG', 'ZH', 'BS', 'BL', 'SO', 'LU', 'SG', 'GR', 'TI'] as const
export type Canton = (typeof CANTONS)[number]

// Durée d'essai en jours
export const DUREE_ESSAI_JOURS = 30

// Limite gratuite
export const LIMITE_GRATUIT = {
  ACTIVITES_PAR_JOUR: 5,
  MEDICAMENTS: 1,
  PROCHES: 1,
} as const
