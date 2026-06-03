import { supabase } from './client'
import { dateAujourdhui } from '@/lib/utils'
import type { RitualCompletion } from '@/types/supabase'

export async function getRituelDuJour(profileId: string) {
  const today = dateAujourdhui()
  return supabase
    .from('ritual_completions')
    .select('*')
    .eq('profile_id', profileId)
    .eq('date', today)
    .maybeSingle()
}

export async function upsertRituel(
  profileId: string,
  donnees: Partial<Omit<RitualCompletion, 'id' | 'profile_id' | 'created_at' | 'updated_at'>>
) {
  const today = dateAujourdhui()
  return supabase
    .from('ritual_completions')
    .upsert(
      { profile_id: profileId, date: today, ...donnees },
      { onConflict: 'profile_id,date', ignoreDuplicates: false }
    )
    .select()
    .single()
}

export async function getHistoriqueRituels(profileId: string, jours = 30) {
  const dateLimite = new Date()
  dateLimite.setDate(dateLimite.getDate() - jours)

  return supabase
    .from('ritual_completions')
    .select('*')
    .eq('profile_id', profileId)
    .gte('date', dateLimite.toISOString().split('T')[0])
    .order('date', { ascending: false })
}

export async function getRituelsRecents(profileId: string, limite = 7) {
  return supabase
    .from('ritual_completions')
    .select('*')
    .eq('profile_id', profileId)
    .order('date', { ascending: false })
    .limit(limite)
}

export async function getRituelSeniorPourAidant(seniorId: string, date?: string) {
  const cibleDate = date ?? dateAujourdhui()
  return supabase
    .from('ritual_completions')
    .select('*')
    .eq('profile_id', seniorId)
    .eq('date', cibleDate)
    .maybeSingle()
}

export function abonnerRituelEnTempsReel(
  seniorId: string,
  onChangement: (rituel: RitualCompletion) => void
) {
  return supabase
    .channel(`rituel-${seniorId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'ritual_completions',
        filter: `profile_id=eq.${seniorId}`,
      },
      (payload) => {
        if (payload.new) onChangement(payload.new as RitualCompletion)
      }
    )
    .subscribe()
}
