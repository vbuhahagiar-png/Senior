import { useEffect, useCallback } from 'react'
import { AppState } from 'react-native'
import { useRitualStore } from '@/stores/ritualStore'
import { useAuthStore } from '@/stores/authStore'
import { upsertRituel, getRituelDuJour } from '@/services/supabase/rituals'
import type { NiveauHumeur, EtapeRituel } from '@/types/ritual'

export function useRitual() {
  const profil = useAuthStore((s) => s.profil)
  const {
    rituelDuJour,
    synchroEnCours,
    initialiserRituel,
    setHumeur,
    validerEtape,
    validerMedicaments,
    terminerRituel,
    reinitialiserSiNouveauJour,
    setSynchroEnCours,
    setErreur,
  } = useRitualStore()

  // Initialisation au montage et réinitialisation si nouveau jour
  useEffect(() => {
    if (!profil?.id) return
    initialiserRituel(profil.id)

    // Écoute le retour en avant-plan pour vérifier le changement de jour
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        reinitialiserSiNouveauJour(profil.id)
      }
    })

    return () => sub.remove()
  }, [profil?.id])

  // Synchro Supabase (optimistique — l'UI est déjà mise à jour)
  const synchroAvecServeur = useCallback(async () => {
    if (!profil?.id || !rituelDuJour) return
    setSynchroEnCours(true)
    try {
      await upsertRituel(profil.id, {
        mood: rituelDuJour.mood ?? undefined,
        mood_note: rituelDuJour.moodNote ?? undefined,
        steps_done: rituelDuJour.stepsDone,
        medications_checked: rituelDuJour.medicationsChecked,
        completed: rituelDuJour.completed,
        completed_at: rituelDuJour.completedAt?.toISOString() ?? undefined,
      })
      setErreur(null)
    } catch {
      setErreur('Synchronisation impossible — vos données sont sauvegardées localement.')
    } finally {
      setSynchroEnCours(false)
    }
  }, [profil?.id, rituelDuJour])

  const enregistrerHumeur = useCallback(
    async (humeur: NiveauHumeur, note?: string) => {
      setHumeur(humeur, note)
      validerEtape('humeur')
      await synchroAvecServeur()
    },
    [setHumeur, validerEtape, synchroAvecServeur]
  )

  const validerEtapeEtSynchro = useCallback(
    async (etape: EtapeRituel) => {
      validerEtape(etape)
      await synchroAvecServeur()
    },
    [validerEtape, synchroAvecServeur]
  )

  const confirmerMedicaments = useCallback(async () => {
    validerMedicaments()
    validerEtape('medicaments')
    await synchroAvecServeur()
  }, [validerMedicaments, validerEtape, synchroAvecServeur])

  const finaliserRituel = useCallback(async () => {
    terminerRituel()
    await synchroAvecServeur()
  }, [terminerRituel, synchroAvecServeur])

  return {
    rituelDuJour,
    estComplet: rituelDuJour?.completed ?? false,
    humeur: rituelDuJour?.mood ?? null,
    etapesEffectuees: rituelDuJour?.stepsDone ?? [],
    medicamentsConfirmes: rituelDuJour?.medicationsChecked ?? false,
    synchroEnCours,
    enregistrerHumeur,
    validerEtape: validerEtapeEtSynchro,
    confirmerMedicaments,
    finaliserRituel,
  }
}
