import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '@/types/supabase'
import { CLES_MMKV } from '@/lib/constants'
import { creerStockage } from '@/lib/storage'

// Profil démo pour tests sans Supabase
export const PROFIL_DEMO_PROFITE: Profile = {
  id: '11111111-1111-1111-1111-111111111111',
  role: 'profite',
  display_name: 'Marie Dubois',
  avatar_url: null,
  city: 'Genève',
  canton: 'GE',
  birth_date: '1954-03-15',
  language: 'fr',
  interests: ['yoga', 'jardinage', 'lecture', 'peinture'],
  timezone: 'Europe/Zurich',
  push_token: null,
  accessibility_large_text: false,
  accessibility_voice: false,
  accessibility_high_contrast: false,
  morning_ritual_time: '08:00:00',
  onboarding_done: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const PROFIL_DEMO_ACCOMPAGNE: Profile = {
  id: '22222222-2222-2222-2222-222222222222',
  role: 'accompagne',
  display_name: 'Pierre Dubois',
  avatar_url: null,
  city: 'Lausanne',
  canton: 'VD',
  birth_date: null,
  language: 'fr',
  interests: [],
  timezone: 'Europe/Zurich',
  push_token: null,
  accessibility_large_text: false,
  accessibility_voice: false,
  accessibility_high_contrast: false,
  morning_ritual_time: '08:00:00',
  onboarding_done: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

interface EtatAuth {
  utilisateur: User | null
  session: Session | null
  profil: Profile | null
  chargement: boolean
  estAuthentifie: boolean
}

interface ActionsAuth {
  setUtilisateur: (utilisateur: User | null) => void
  setSession: (session: Session | null) => void
  setProfil: (profil: Profile | null) => void
  setChargement: (chargement: boolean) => void
  chargerProfitDeDemo: () => void
  chargerAccompagneDemo: () => void
  reinitialiser: () => void
}

const etatInitial: EtatAuth = {
  utilisateur: null,
  session: null,
  profil: null,
  chargement: false,
  estAuthentifie: false,
}

export const useAuthStore = create<EtatAuth & ActionsAuth>()(
  persist(
    (set) => ({
      ...etatInitial,

      setUtilisateur: (utilisateur) =>
        set({ utilisateur, estAuthentifie: utilisateur !== null }),

      setSession: (session) =>
        set({ session, utilisateur: session?.user ?? null, estAuthentifie: session !== null }),

      setProfil: (profil) => set({ profil }),

      setChargement: (chargement) => set({ chargement }),

      // Accès démo direct sans auth
      chargerProfitDeDemo: () =>
        set({
          profil: PROFIL_DEMO_PROFITE,
          estAuthentifie: true,
          chargement: false,
          utilisateur: { id: PROFIL_DEMO_PROFITE.id, email: 'marie.demo@seniorplus.ch' } as any,
        }),

      chargerAccompagneDemo: () =>
        set({
          profil: PROFIL_DEMO_ACCOMPAGNE,
          estAuthentifie: true,
          chargement: false,
          utilisateur: { id: PROFIL_DEMO_ACCOMPAGNE.id, email: 'pierre.demo@seniorplus.ch' } as any,
        }),

      reinitialiser: () => set({ ...etatInitial }),
    }),
    {
      name: CLES_MMKV.SESSION_AUTH,
      storage: createJSONStorage(() => creerStockage('auth-store')),
      partialize: (state) => ({ profil: state.profil, estAuthentifie: state.estAuthentifie }),
    }
  )
)

export const selectRole = (state: EtatAuth) => state.profil?.role
export const selectProfil = (state: EtatAuth) => state.profil
export const selectEstAuthentifie = (state: EtatAuth & ActionsAuth) => state.estAuthentifie
