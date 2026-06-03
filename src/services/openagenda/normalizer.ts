import type { ActivityNormalisee } from '@/types/activity'

// Carte des catégories OpenAgenda → catégories Senior+
const MAP_CATEGORIES: Record<string, string> = {
  sport: 'sport',
  'sport-et-loisirs': 'sport',
  'sport-loisirs': 'sport',
  danse: 'sport',
  yoga: 'sport',
  natation: 'sport',
  culture: 'culture',
  'art-et-culture': 'culture',
  musique: 'culture',
  theatre: 'culture',
  exposition: 'culture',
  benevolat: 'benevolat',
  'bénévolat': 'benevolat',
  associatif: 'benevolat',
  sortie: 'sorties',
  excursion: 'sorties',
  voyage: 'voyage',
  formation: 'formation',
  atelier: 'formation',
  conference: 'formation',
  rencontre: 'social',
  social: 'social',
}

// Mots-clés → intensité pour les activités sportives
const MOT_CLES_DOUX = ['yoga', 'tai', 'qi', 'stretching', 'etirement', 'aqua gym', 'gym douce', 'pilates', 'marche', 'promenade', 'pétanque']
const MOT_CLES_INTENSE = ['course', 'tennis', 'football', 'basket', 'rugby', 'boxe', 'cyclisme intensif']

function detecterIntensite(titre: string, tags: string[]): 'douce' | 'moderee' | 'intense' | undefined {
  const texte = (titre + ' ' + tags.join(' ')).toLowerCase()
  if (MOT_CLES_DOUX.some((m) => texte.includes(m))) return 'douce'
  if (MOT_CLES_INTENSE.some((m) => texte.includes(m))) return 'intense'
  if (texte.includes('sport') || texte.includes('natation') || texte.includes('velo')) return 'moderee'
  return undefined
}

function extraireTexte(champ: unknown, langue = 'fr'): string | undefined {
  if (!champ) return undefined
  if (typeof champ === 'string') return champ
  if (typeof champ === 'object') {
    const obj = champ as Record<string, string>
    return obj[langue] ?? obj.fr ?? obj.en ?? Object.values(obj)[0]
  }
  return undefined
}

function extraireCoords(lieu: unknown): { lat?: number; lng?: number } {
  if (!lieu || typeof lieu !== 'object') return {}
  const l = lieu as Record<string, unknown>
  return {
    lat: typeof l.latitude === 'number' ? l.latitude : undefined,
    lng: typeof l.longitude === 'number' ? l.longitude : undefined,
  }
}

export function normaliserEvenementOpenAgenda(raw: Record<string, unknown>): ActivityNormalisee {
  const uid = String(raw.uid ?? raw.id ?? '')
  const titre = extraireTexte(raw.title) ?? 'Événement sans titre'
  const description = extraireTexte(raw.description ?? raw.longDescription)
  const lieu = raw.location as Record<string, unknown> | undefined
  const coords = extraireCoords(lieu)

  const tags: string[] = []
  if (Array.isArray(raw.tags)) {
    tags.push(...raw.tags.map(String))
  }
  if (Array.isArray(raw.keywords)) {
    tags.push(...raw.keywords.flatMap((k: unknown) =>
      typeof k === 'object' ? Object.values(k as object).map(String) : [String(k)]
    ))
  }

  const categorieRaw = tags.find((t) => MAP_CATEGORIES[t.toLowerCase()])
  const categorie = categorieRaw ? MAP_CATEGORIES[categorieRaw.toLowerCase()] : 'autre'

  const timings = Array.isArray(raw.timings) ? raw.timings : []
  const premierTiming = timings[0] as Record<string, string> | undefined
  const startsAt = premierTiming?.begin ? new Date(premierTiming.begin) : undefined
  const endsAt = premierTiming?.end ? new Date(premierTiming.end) : undefined

  const prix = raw.registration as Record<string, unknown> | undefined
  const isFree = !prix || prix.price === 0 || prix.free === true
  const priceCHF = typeof prix?.price === 'number' ? prix.price : undefined

  const villeRaw = (lieu?.city ?? lieu?.address) as unknown
  const ville = extraireTexte(villeRaw) ?? undefined

  return {
    id: uid,
    source: 'openagenda',
    externalId: uid,
    title: titre,
    description,
    category: categorie,
    locationName: extraireTexte(lieu?.name),
    locationAddress: extraireTexte(lieu?.address),
    ...coords,
    city: ville,
    canton: lieu?.postalCode ? 'GE' : undefined,
    startsAt,
    endsAt,
    isRecurring: timings.length > 1,
    intensity: detecterIntensite(titre, tags),
    priceCHF,
    isFree,
    registrationUrl: typeof raw.registrationUrl === 'string' ? raw.registrationUrl : undefined,
    sourceUrl: typeof raw.canonicalUrl === 'string' ? raw.canonicalUrl : `https://openagenda.com/agendas/${raw.agendaUid}/events/${uid}`,
    organizerName: extraireTexte(raw.organizer),
    tags,
    dateVerified: new Date(),
    isNew: true,
    isChanged: false,
  }
}
