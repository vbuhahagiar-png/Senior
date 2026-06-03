import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { dateAujourdhui } from '@/lib/utils'
import type { EtatRituel, NiveauHumeur, EtapeRituel } from '@/types/ritual'
import { CLES_MMKV } from '@/lib/constants'
import { creerStockage } from '@/lib/storage'

interface EtatRituelStore {
  rituelDuJour: EtatRituel | null
  dateInitialise: string | null
  synchroEnCours: boolean
  derniereErreur: string | null
}

interface ActionsRituel {
  initialiserRituel: (profileId: string) => void
  setHumeur: (humeur: NiveauHumeur, note?: string) => void
  validerEtape: (etape: EtapeRituel) => void
  validerMedicaments: () => void
  terminerRituel: () => void
  reinitialiserSiNouveauJour: (profileId: string) => boolean
  setSynchroEnCours: (en: boolean) => void
  setErreur: (msg: string | null) => void
  reinitialiserPourDemo: (profileId: string) => void
}

function creerRituelVide(profileId: string): EtatRituel {
  return {
    profileId,
    date: dateAujourdhui(),
    mood: null,
    moodNote: null,
    stepsDone: [],
    medicationsChecked: false,
    completed: false,
    completedAt: null,
    note: null,
  }
}

export const useRitualStore = create<EtatRituelStore & ActionsRituel>()(
  persist(
    (set, get) => ({
      rituelDuJour: null,
      dateInitialise: null,
      synchroEnCours: false,
      derniereErreur: null,

      initialiserRituel: (profileId) => {
        const auj = dateAujourdhui()
        const { rituelDuJour } = get()
        if (rituelDuJour?.date === auj && rituelDuJour.profileId === profileId) return
        set({ rituelDuJour: creerRituelVide(profileId), dateInitialise: auj })
      },

      setHumeur: (humeur, note) =>
        set((state) => ({
          rituelDuJour: state.rituelDuJour
            ? { ...state.rituelDuJour, mood: humeur, moodNote: note ?? null }
            : null,
        })),

      validerEtape: (etape) =>
        set((state) => {
          if (!state.rituelDuJour) return {}
          const stepsDone = state.rituelDuJour.stepsDone.includes(etape)
            ? state.rituelDuJour.stepsDone
            : [...state.rituelDuJour.stepsDone, etape]
          return { rituelDuJour: { ...state.rituelDuJour, stepsDone } }
        }),

      validerMedicaments: () =>
        set((state) => ({
          rituelDuJour: state.rituelDuJour
            ? { ...state.rituelDuJour, medicationsChecked: true }
            : null,
        })),

      terminerRituel: () =>
        set((state) => ({
          rituelDuJour: state.rituelDuJour
            ? { ...state.rituelDuJour, completed: true, completedAt: new Date() }
            : null,
        })),

      reinitialiserSiNouveauJour: (profileId) => {
        const auj = dateAujourdhui()
        const { dateInitialise } = get()
        if (dateInitialise !== auj) {
          set({ rituelDuJour: creerRituelVide(profileId), dateInitialise: auj })
          return true
        }
        return false
      },

      reinitialiserPourDemo: (profileId) => {
        set({ rituelDuJour: creerRituelVide(profileId), dateInitialise: dateAujourdhui() })
      },

      setSynchroEnCours: (en) => set({ synchroEnCours: en }),
      setErreur: (msg) => set({ derniereErreur: msg }),
    }),
    {
      name: CLES_MMKV.RITUEL_AUJOURD_HUI,
      storage: createJSONStorage(() => creerStockage('rituel-store')),
    }
  )
)

export const selectRituelComplete = (state: EtatRituelStore) =>
  state.rituelDuJour?.completed ?? false

export const selectHumeur = (state: EtatRituelStore) =>
  state.rituelDuJour?.mood ?? null

export const selectEtapesEffectuees = (state: EtatRituelStore) =>
  state.rituelDuJour?.stepsDone ?? []
