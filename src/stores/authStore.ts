import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MMKV } from 'react-native-mmkv'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '@/types/supabase'
import { CLES_MMKV } from '@/lib/constants'

const mmkv = new MMKV({ id: 'auth-store' })

const stockageMMKV = {
  getItem: (name: string) => mmkv.getString(name) ?? null,
  setItem: (name: string, value: string) => mmkv.set(name, value),
  removeItem: (name: string) => mmkv.delete(name),
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
  reinitialiser: () => void
}

const etatInitial: EtatAuth = {
  utilisateur: null,
  session: null,
  profil: null,
  chargement: true,
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

      reinitialiser: () => set({ ...etatInitial, chargement: false }),
    }),
    {
      name: CLES_MMKV.SESSION_AUTH,
      storage: createJSONStorage(() => stockageMMKV),
      partialize: (state) => ({
        session: state.session,
        utilisateur: state.utilisateur,
        profil: state.profil,
      }),
    }
  )
)

export const selectRole = (state: EtatAuth) => state.profil?.role
export const selectProfil = (state: EtatAuth) => state.profil
export const selectEstAuthentifie = (state: EtatAuth & ActionsAuth) => state.estAuthentifie
