import { openAgendaClient } from './client'
import { normaliserEvenementOpenAgenda } from './normalizer'
import type { ActivityNormalisee, FiltresActivite } from '@/types/activity'
import { OPENAGENDA_AGENDAS } from '@/lib/constants'

interface OpenAgendaSearchResult {
  total: number
  events: ActivityNormalisee[]
  after?: string[]
}

// Agendas genevois à surveiller
const AGENDAS_GENEVE = [
  OPENAGENDA_AGENDAS.PRO_SENECTUTE_GE,
  OPENAGENDA_AGENDAS.SPORTS_VILLE_GE,
  OPENAGENDA_AGENDAS.GENEVE_AGENDA,
]

export async function rechercherActivites(
  filtres: FiltresActivite & { agendaUid?: string; size?: number; after?: string[] }
): Promise<OpenAgendaSearchResult> {
  const agendaId = filtres.agendaUid ?? AGENDAS_GENEVE[0]

  const params: Record<string, unknown> = {
    size: filtres.size ?? 20,
    detailed: 1,
    includeLabels: 1,
    lang: 'fr',
  }

  if (filtres.keyword) params.search = filtres.keyword
  if (filtres.dateFrom) params['timings[gte]'] = filtres.dateFrom.toISOString()
  if (filtres.dateTo) params['timings[lte]'] = filtres.dateTo.toISOString()
  if (filtres.city) params['location[city]'] = filtres.city
  if (filtres.isFree) params['registration[free]'] = 1
  if (filtres.after) params.after = filtres.after.join(',')

  // Filtre par tags selon la catégorie
  if (filtres.category === 'sport') {
    params['tags[0]'] = 'sport'
  } else if (filtres.category === 'culture') {
    params['tags[0]'] = 'culture'
  }

  try {
    const response = await openAgendaClient.get(`/agendas/${agendaId}/events`, { params })
    const { events = [], total = 0, after } = response.data

    return {
      total,
      events: events.map(normaliserEvenementOpenAgenda),
      after,
    }
  } catch (error) {
    console.error('[OpenAgenda] Erreur rechercherActivites:', error)
    return { total: 0, events: [] }
  }
}

export async function getActivite(agendaUid: string, eventUid: string): Promise<ActivityNormalisee | null> {
  try {
    const response = await openAgendaClient.get(`/agendas/${agendaUid}/events/${eventUid}`, {
      params: { detailed: 1, lang: 'fr' },
    })
    return normaliserEvenementOpenAgenda(response.data.event)
  } catch {
    return null
  }
}

export async function rechercherActivitesGeneve(
  category?: string,
  dateFrom?: Date
): Promise<ActivityNormalisee[]> {
  const resultats: ActivityNormalisee[] = []

  for (const agendaId of AGENDAS_GENEVE) {
    try {
      const { events } = await rechercherActivites({
        agendaUid: agendaId,
        category,
        dateFrom: dateFrom ?? new Date(),
        city: 'Genève',
        size: 10,
      })
      resultats.push(...events)
    } catch (error) {
      console.warn(`[OpenAgenda] Erreur agenda ${agendaId}:`, error)
    }
  }

  // Déduplication par externalId
  const vus = new Set<string>()
  return resultats.filter((a) => {
    if (vus.has(a.externalId)) return false
    vus.add(a.externalId)
    return true
  })
}
