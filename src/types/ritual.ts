export type NiveauHumeur = 1 | 2 | 3 | 4 | 5

export type EtapeRituel =
  | 'meteo'
  | 'citation'
  | 'humeur'
  | 'mouvement'
  | 'medicaments'

export interface EtatRituel {
  profileId: string
  date: string
  mood: NiveauHumeur | null
  moodNote: string | null
  stepsDone: EtapeRituel[]
  medicationsChecked: boolean
  completed: boolean
  completedAt: Date | null
  note: string | null
}

export interface CitationJour {
  texte: string
  auteur: string
}

export const CITATIONS: CitationJour[] = [
  { texte: "La retraite n'est pas une fin, c'est un nouveau commencement.", auteur: 'Proverbe' },
  { texte: "Chaque matin apporte une nouvelle chance.", auteur: 'Anonyme' },
  { texte: "La sagesse commence avec l'émerveillement.", auteur: 'Socrate' },
  { texte: "Vieillir est un privilège refusé à beaucoup.", auteur: 'Anonyme' },
  { texte: "Un sourire partagé est un bonheur multiplié.", auteur: 'Proverbe suisse' },
  { texte: "Le mouvement c'est la vie, le repos c'est la mort.", auteur: "Honoré de Balzac" },
  { texte: "La famille est la boussole qui nous guide.", auteur: 'Brad Henry' },
  { texte: "Prenez soin de votre corps — c'est le seul endroit où vous vivez.", auteur: 'Jim Rohn' },
  { texte: "Le temps que l'on prend pour soi, c'est du temps gagné pour les autres.", auteur: 'Anonyme' },
  { texte: "Chaque journée est un cadeau — c'est pourquoi on l'appelle le présent.", auteur: 'Anonyme' },
]

export function getCitationDuJour(): CitationJour {
  const index = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % CITATIONS.length
  return CITATIONS[index]
}
