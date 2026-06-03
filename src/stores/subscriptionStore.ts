import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { calclerDroits } from '@/types/subscription'
import type { Droits } from '@/types/subscription'
import { CLES_MMKV } from '@/lib/constants'
import { creerStockage } from '@/lib/storage'

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
  activerPlanFamilleDemo: () => void
}

// Plan gratuit par défaut — suffisant pour le rituel du matin et les activités basiques
const droitsDefaut = calclerDroits('free', 'active')
// Plan famille pour la démo aidant
const droitsFamilleDemo = calclerDroits('famille', 'active')

export const useSubscriptionStore = create<EtatAbonnement & ActionsAbonnement>()(
  persist(
    (set, get) => ({
      droits: droitsFamilleDemo, // Démo en plan Famille pour tout voir
      chargement: false,
      derniereSync: null,

      setDroits: (droits) => set({ droits, chargement: false, derniereSync: new Date().toISOString() }),
      setChargement: (c) => set({ chargement: c }),
      reinitialiser: () => set({ droits: droitsDefaut, chargement: false, derniereSync: null }),

      activerPlanFamilleDemo: () => set({ droits: droitsFamilleDemo }),

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
      storage: createJSONStorage(() => creerStockage('subscription-store')),
    }
  )
)
