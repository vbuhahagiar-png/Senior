import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MMKV } from 'react-native-mmkv'
import { calclerDroits } from '@/types/subscription'
import type { Droits } from '@/types/subscription'
import { CLES_MMKV } from '@/lib/constants'

const mmkv = new MMKV({ id: 'subscription-store' })
const stockageMMKV = {
  getItem: (name: string) => mmkv.getString(name) ?? null,
  setItem: (name: string, value: string) => mmkv.set(name, value),
  removeItem: (name: string) => mmkv.delete(name),
}

interface EtatAbonnement {
  droits: Droits
  chargement: boolean
  derniereSync: string | null
}

interface ActionsAbonnement {
  setDroits: (droits: Droits) => void
  setChargement: (c: boolean) => void
  reinitialiser: () => void
  peutAcceder: (fonctionnalite: keyof Droits) => boolean
}

const droitsDefaut = calclerDroits('free', 'active')

export const useSubscriptionStore = create<EtatAbonnement & ActionsAbonnement>()(
  persist(
    (set, get) => ({
      droits: droitsDefaut,
      chargement: true,
      derniereSync: null,

      setDroits: (droits) => set({ droits, chargement: false, derniereSync: new Date().toISOString() }),

      setChargement: (c) => set({ chargement: c }),

      reinitialiser: () => set({ droits: droitsDefaut, chargement: false, derniereSync: null }),

      peutAcceder: (fonctionnalite) => {
        const { droits } = get()
        const valeur = droits[fonctionnalite]
        if (typeof valeur === 'boolean') return valeur
        if (typeof valeur === 'number') return valeur > 0
        if (valeur === 'illimite') return true
        return false
      },
    }),
    {
      name: CLES_MMKV.ABONNEMENT,
      storage: createJSONStorage(() => stockageMMKV),
    }
  )
)
