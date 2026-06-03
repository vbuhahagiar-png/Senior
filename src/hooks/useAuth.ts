import { useEffect, useCallback } from 'react'
import { useRouter } from 'expo-router'
import { useAuthStore } from '@/stores/authStore'
import { useSubscriptionStore } from '@/stores/subscriptionStore'
import { supabase } from '@/services/supabase/client'
import { getProfil } from '@/services/supabase/profiles'
import { fetchDroits } from '@/services/stripe/entitlements'
import * as AuthService from '@/services/supabase/auth'

export function useAuth() {
  const router = useRouter()
  const {
    utilisateur,
    profil,
    session,
    chargement,
    estAuthentifie,
    setSession,
    setProfil,
    setChargement,
    reinitialiser,
  } = useAuthStore()
  const { setDroits, reinitialiser: reinitDroits } = useSubscriptionStore()

  useEffect(() => {
    // Initialisation : lecture de la session existante
    AuthService.getSession().then(({ data: { session } }) => {
      setSession(session)
      setChargement(false)
    })

    // Écoute des changements d'état
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)

      if (session?.user) {
        // Chargement du profil
        const { data } = await getProfil(session.user.id)
        if (data) setProfil(data)

        // Chargement des droits d'abonnement
        const droits = await fetchDroits(session.user.id)
        setDroits(droits)
      } else {
        setProfil(null)
        reinitDroits()
      }

      setChargement(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const seConnecter = useCallback(async (email: string, motDePasse: string) => {
    const { data, error } = await AuthService.seConnecter(email, motDePasse)
    if (error) return { erreur: error.message }
    return { erreur: null }
  }, [])

  const sInscrire = useCallback(
    async (email: string, motDePasse: string, displayName: string, role: 'profite' | 'accompagne') => {
      const { data, error } = await AuthService.sInscrire(email, motDePasse, { displayName, role })
      if (error) return { erreur: error.message }
      return { erreur: null }
    },
    []
  )

  const seDeconnecter = useCallback(async () => {
    await AuthService.seDeconnecter()
    reinitialiser()
    reinitDroits()
    router.replace('/(auth)/')
  }, [router])

  const reinitialiserMotDePasse = useCallback(async (email: string) => {
    const { error } = await AuthService.reinitialiserMotDePasse(email)
    return { erreur: error?.message ?? null }
  }, [])

  return {
    utilisateur,
    profil,
    session,
    chargement,
    estAuthentifie,
    seConnecter,
    sInscrire,
    seDeconnecter,
    reinitialiserMotDePasse,
  }
}
