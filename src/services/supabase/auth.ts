import { supabase } from './client'

export async function seConnecter(email: string, motDePasse: string) {
  return supabase.auth.signInWithPassword({ email, password: motDePasse })
}

export async function sInscrire(
  email: string,
  motDePasse: string,
  options: { displayName: string; role: 'profite' | 'accompagne'; language?: 'fr' | 'de' | 'it' }
) {
  return supabase.auth.signUp({
    email,
    password: motDePasse,
    options: {
      data: {
        display_name: options.displayName,
        role: options.role,
        language: options.language ?? 'fr',
      },
    },
  })
}

export async function seDeconnecter() {
  return supabase.auth.signOut()
}

export async function reinitialiserMotDePasse(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'seniorplus://reset-password',
  })
}

export async function mettreAJourMotDePasse(nouveauMotDePasse: string) {
  return supabase.auth.updateUser({ password: nouveauMotDePasse })
}

export async function mettreAJourEmail(nouvelEmail: string) {
  return supabase.auth.updateUser({ email: nouvelEmail })
}

export async function getSession() {
  return supabase.auth.getSession()
}

export function ecouterChangementsAuth(
  callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
) {
  return supabase.auth.onAuthStateChange(callback)
}
