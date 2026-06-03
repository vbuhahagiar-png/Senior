import { supabase } from './client'

export async function getCercleAidants(seniorId: string) {
  return supabase
    .from('care_circles')
    .select(`
      *,
      caregiver:profiles!care_circles_caregiver_id_fkey(
        id, display_name, avatar_url, push_token, language
      )
    `)
    .eq('senior_id', seniorId)
    .order('invited_at', { ascending: true })
}

export async function getMesCercles(userId: string) {
  return supabase
    .from('care_circles')
    .select(`
      *,
      senior:profiles!care_circles_senior_id_fkey(
        id, display_name, avatar_url
      )
    `)
    .eq('caregiver_id', userId)
    .eq('status', 'active')
}

export async function inviterAidant(
  seniorId: string,
  invitedBy: string,
  email: string,
  relation?: string
) {
  const { data: utilisateur } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', (await supabase.auth.admin?.getUserByEmail?.(email))?.data?.user?.id ?? '')
    .maybeSingle()

  return supabase.functions.invoke('invite-caregiver', {
    body: { seniorId, email, relation, invitedBy },
  })
}

export async function accepterInvitation(circleId: string) {
  return supabase
    .from('care_circles')
    .update({ status: 'active', accepted_at: new Date().toISOString() })
    .eq('id', circleId)
}

export async function revoquerAcces(circleId: string) {
  return supabase
    .from('care_circles')
    .update({ status: 'revoked' })
    .eq('id', circleId)
}

export async function mettreAJourDroits(circleId: string, permissions: Record<string, boolean>) {
  return supabase
    .from('care_circles')
    .update({ permissions })
    .eq('id', circleId)
}

// ── Tâches du cercle ────────────────────────────────────────────────────────

export async function getTaches(circleId: string) {
  return supabase
    .from('circle_tasks')
    .select(`
      *,
      assignee:profiles!circle_tasks_assigned_to_fkey(id, display_name, avatar_url)
    `)
    .eq('circle_id', circleId)
    .order('due_date', { ascending: true, nullsFirst: false })
}

export async function creerTache(
  circleId: string,
  createdBy: string,
  donnees: { title: string; description?: string; assignedTo?: string; dueDate?: string; dueTime?: string; recurrence?: string }
) {
  return supabase
    .from('circle_tasks')
    .insert({
      circle_id: circleId,
      created_by: createdBy,
      title: donnees.title,
      description: donnees.description ?? null,
      assigned_to: donnees.assignedTo ?? null,
      due_date: donnees.dueDate ?? null,
      due_time: donnees.dueTime ?? null,
      recurrence: donnees.recurrence ?? 'none',
    })
    .select()
    .single()
}

export async function marquerTacheComplete(tacheId: string, completedBy: string) {
  return supabase
    .from('circle_tasks')
    .update({ completed: true, completed_at: new Date().toISOString(), completed_by: completedBy })
    .eq('id', tacheId)
}

// ── Fil familial ────────────────────────────────────────────────────────────

export async function getFilFamille(seniorId: string, limite = 30) {
  return supabase
    .from('family_posts')
    .select(`
      *,
      auteur:profiles!family_posts_author_id_fkey(id, display_name, avatar_url)
    `)
    .eq('senior_id', seniorId)
    .order('created_at', { ascending: false })
    .limit(limite)
}

export async function publierMessage(seniorId: string, authorId: string, content: string) {
  return supabase
    .from('family_posts')
    .insert({ senior_id: seniorId, author_id: authorId, content, post_type: 'message' })
    .select()
    .single()
}

export async function publierPhoto(seniorId: string, authorId: string, imageUrls: string[], content?: string) {
  return supabase
    .from('family_posts')
    .insert({
      senior_id: seniorId,
      author_id: authorId,
      content: content ?? null,
      image_urls: imageUrls,
      post_type: 'photo',
    })
    .select()
    .single()
}
