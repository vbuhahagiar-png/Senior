import { supabase } from '@/services/supabase/client'
import { calclerDroits } from '@/types/subscription'
import type { Droits, PlanAbonnement, StatutAbonnement } from '@/types/subscription'

export type { Droits } from '@/types/subscription'

export async function fetchDroits(profileId: string): Promise<Droits> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('plan, status, trial_ends_at, current_period_end')
    .eq('profile_id', profileId)
    .single()

  if (error || !data) {
    return calclerDroits('free', 'active')
  }

  return calclerDroits(
    data.plan as PlanAbonnement,
    data.status as StatutAbonnement,
    data.trial_ends_at,
    data.current_period_end
  )
}

export { calclerDroits }
