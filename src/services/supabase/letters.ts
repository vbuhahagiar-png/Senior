import { supabase } from './client'
import type { Letter } from '@/types/supabase'

export async function getCourriers(seniorId: string) {
  return supabase
    .from('letters')
    .select(`
      *,
      uploadeur:profiles!letters_uploaded_by_fkey(id, display_name)
    `)
    .eq('senior_id', seniorId)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })
}

export async function getCourrier(id: string) {
  return supabase
    .from('letters')
    .select('*')
    .eq('id', id)
    .single()
}

export async function uploadCourrier(
  seniorId: string,
  uploadedBy: string,
  fichier: Blob,
  nomFichier: string
) {
  const extension = nomFichier.split('.').pop() ?? 'jpg'
  const chemin = `${seniorId}/${Date.now()}.${extension}`

  const { error: uploadError } = await supabase.storage
    .from('letters')
    .upload(chemin, fichier, { contentType: `image/${extension}` })

  if (uploadError) return { data: null, error: uploadError }

  return supabase
    .from('letters')
    .insert({
      senior_id: seniorId,
      uploaded_by: uploadedBy,
      storage_path: chemin,
      original_filename: nomFichier,
      decode_status: 'pending',
    })
    .select()
    .single()
}

export async function getURLCourrierSigne(storagePath: string, expiresIn = 3600) {
  return supabase.storage.from('letters').createSignedUrl(storagePath, expiresIn)
}

export async function marquerLu(id: string) {
  return supabase
    .from('letters')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', id)
}

export async function archiverCourrier(id: string) {
  return supabase
    .from('letters')
    .update({ is_archived: true })
    .eq('id', id)
}

export async function supprimerCourrier(id: string) {
  const { data } = await supabase.from('letters').select('storage_path').eq('id', id).single()
  if (data?.storage_path) {
    await supabase.storage.from('letters').remove([data.storage_path])
  }
  return supabase.from('letters').delete().eq('id', id)
}

export function abonnerStatutDecode(
  letterId: string,
  onMiseAJour: (lettre: Letter) => void
) {
  return supabase
    .channel(`lettre-${letterId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'letters',
        filter: `id=eq.${letterId}`,
      },
      (payload) => {
        if (payload.new) onMiseAJour(payload.new as Letter)
      }
    )
    .subscribe()
}
