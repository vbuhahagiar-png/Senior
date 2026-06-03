import { useSubscriptionStore } from '@/stores/subscriptionStore'
import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'
import { fetchDroits } from '@/services/stripe/entitlements'
import type { FonctionnalitePremium } from '@/types/subscription'

export function useSubscription() {
  const { droits, chargement, peutAcceder, setDroits, setChargement } = useSubscriptionStore()
  const profil = useAuthStore((s) => s.profil)

  useEffect(() => {
    if (!profil?.id) return
    setChargement(true)
    fetchDroits(profil.id).then(setDroits)
  }, [profil?.id])

  return {
    droits,
    chargement,
    plan: droits.plan,
    estEnEssai: droits.estEnEssai,
    peutAcceder: (fonctionnalite: FonctionnalitePremium) => peutAcceder(fonctionnalite),
    estPremium: droits.plan !== 'free',
  }
}
