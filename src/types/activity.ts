// Type normalisé pour toutes les activités (indépendant de la source)
export interface ActivityNormalisee {
  id: string
  source: string
  externalId: string
  title: string
  description?: string
  category?: string
  locationName?: string
  locationAddress?: string
  lat?: number
  lng?: number
  city?: string
  canton?: string
  startsAt?: Date
  endsAt?: Date
  isRecurring: boolean
  recurrenceInfo?: string
  intensity?: 'douce' | 'moderee' | 'intense'
  priceCHF?: number
  isFree: boolean
  registrationUrl?: string
  sourceUrl: string
  organizerName?: string
  organizerPhone?: string
  organizerEmail?: string
  maxParticipants?: number
  minAge?: number
  maxAge?: number
  tags: string[]
  dateVerified: Date
  isNew: boolean
  isChanged: boolean
  // Ajouté côté client (non stocké)
  isSaved?: boolean
  distanceKm?: number
}

export interface FiltresActivite {
  city?: string
  canton?: string
  category?: string
  intensity?: 'douce' | 'moderee' | 'intense'
  isFree?: boolean
  dateFrom?: Date
  dateTo?: Date
  keyword?: string
  maxDistanceKm?: number
  userLat?: number
  userLng?: number
}

export type CategorieActivite =
  | 'sport'
  | 'culture'
  | 'benevolat'
  | 'social'
  | 'formation'
  | 'sorties'
  | 'voyage'
  | 'autre'

export interface SourceEvenements {
  id: string
  nom: string
  baseUrl: string
  fetchEvenements(filtres: FiltresActivite): Promise<ActivityNormalisee[]>
}
