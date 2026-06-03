import { supabase } from './client'
import type { Profile } from '@/types/supabase'

export async function getProfil(id: string) {
  return supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()
}

export async function mettreAJourProfil(id: string, donnees: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) {
  return supabase
    .from('profiles')
    .update(donnees)
    .eq('id', id)
    .select()
    .single()
}

export async function marquerOnboardingTermine(id: string) {
  return supabase
    .from('profiles')
    .update({ onboarding_done: true })
    .eq('id', id)
}

export async function mettreAJourPushToken(id: string, token: string | null) {
  return supabase
    .from('profiles')
    .update({ push_token: token })
    .eq('id', id)
}

export async function getSeniorsLiesAidant(caregiverId: string) {
  return supabase
    .from('care_circles')
    .select(`
      id,
      relation,
      permissions,
      status,
      senior:profiles!care_circles_senior_id_fkey(*)
    `)
    .eq('caregiver_id', caregiverId)
    .eq('status', 'active')
}

export async function getAidantsLiesSenior(seniorId: string) {
  return supabase
    .from('care_circles')
    .select(`
      id,
      relation,
      permissions,
      status,
      caregiver:profiles!care_circles_caregiver_id_fkey(*)
    `)
    .eq('senior_id', seniorId)
    .eq('status', 'active')
}

export async function uploadAvatar(userId: string, fichier: Blob, extension = 'jpg') {
  const chemin = `${userId}/avatar.${extension}`
  const { error } = await supabase.storage
    .from('avatars')
    .upload(chemin, fichier, { upsert: true, contentType: `image/${extension}` })

  if (error) return { data: null, error }

  const { data } = supabase.storage.from('avatars').getPublicUrl(chemin)
  await mettreAJourProfil(userId, { avatar_url: data.publicUrl })
  return { data: data.publicUrl, error: null }
}
