import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { getProfil, mettreAJourProfil, uploadAvatar } from '@/services/supabase/profiles'
import { CLES_QUERY } from '@/lib/constants'

export function useProfile() {
  const { profil, utilisateur, setProfil } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: profilComplet, isLoading } = useQuery({
    queryKey: CLES_QUERY.PROFIL(utilisateur?.id ?? ''),
    queryFn: () => getProfil(utilisateur!.id).then((r) => r.data),
    enabled: !!utilisateur?.id,
    initialData: profil,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const { mutateAsync: mettreAJour, isPending: miseAJourEnCours } = useMutation({
    mutationFn: (donnees: Parameters<typeof mettreAJourProfil>[1]) =>
      mettreAJourProfil(utilisateur!.id, donnees),
    onSuccess: ({ data }) => {
      if (data) {
        setProfil(data)
        queryClient.setQueryData(CLES_QUERY.PROFIL(utilisateur!.id), data)
      }
    },
  })

  const { mutateAsync: changerAvatar } = useMutation({
    mutationFn: (fichier: Blob) => uploadAvatar(utilisateur!.id, fichier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLES_QUERY.PROFIL(utilisateur!.id) })
    },
  })

  return {
    profil: profilComplet,
    isLoading,
    mettreAJour,
    miseAJourEnCours,
    changerAvatar,
  }
}
