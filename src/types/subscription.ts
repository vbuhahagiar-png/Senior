export type PlanAbonnement = 'free' | 'famille' | 'serenite'
export type StatutAbonnement = 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
export type BillingPeriod = 'monthly' | 'annual'

export interface Droits {
  plan: PlanAbonnement
  statut: StatutAbonnement
  // Rituel
  rituelComplet: boolean
  suiwiMedicaments: boolean
  nombreMedicamentsMax: number
  // Famille & cercle
  nombreProchesMax: number
  cercleCareComplet: boolean
  // Activités
  activitesMax: number | 'illimite'
  // Fonctions IA
  decodageCourriers: boolean
  compagnonVocal: boolean
  resumeHebdo: boolean
  // Services+
  bilanRetraite: boolean
  coffreFort: boolean
  conseillerprioritaire: boolean
  livreMemoires: boolean
  // Essai
  estEnEssai: boolean
  essaiTermineLe: Date | null
  periodeActuelleTermineLe: Date | null
}

export function calclerDroits(
  plan: PlanAbonnement,
  statut: StatutAbonnement,
  trialEndsAt?: string | null,
  currentPeriodEnd?: string | null,
): Droits {
  const estActif = statut === 'active' || statut === 'trialing'
  const estEnEssai = statut === 'trialing'

  const base: Droits = {
    plan,
    statut,
    rituelComplet: false,
    suiwiMedicaments: false,
    nombreMedicamentsMax: 1,
    nombreProchesMax: 1,
    cercleCareComplet: false,
    activitesMax: 5,
    decodageCourriers: false,
    compagnonVocal: false,
    resumeHebdo: false,
    bilanRetraite: false,
    coffreFort: false,
    conseillerprioritaire: false,
    livreMemoires: false,
    estEnEssai,
    essaiTermineLe: trialEndsAt ? new Date(trialEndsAt) : null,
    periodeActuelleTermineLe: currentPeriodEnd ? new Date(currentPeriodEnd) : null,
  }

  if (!estActif) return base

  if (plan === 'famille' || plan === 'serenite') {
    return {
      ...base,
      rituelComplet: true,
      suiwiMedicaments: true,
      nombreMedicamentsMax: 99,
      nombreProchesMax: 99,
      cercleCareComplet: true,
      activitesMax: 'illimite',
      decodageCourriers: true,
      compagnonVocal: true,
      resumeHebdo: true,
    }
  }

  if (plan === 'serenite') {
    return {
      ...base,
      rituelComplet: true,
      suiwiMedicaments: true,
      nombreMedicamentsMax: 99,
      nombreProchesMax: 99,
      cercleCareComplet: true,
      activitesMax: 'illimite',
      decodageCourriers: true,
      compagnonVocal: true,
      resumeHebdo: true,
      bilanRetraite: true,
      coffreFort: true,
      conseillerprioritaire: true,
      livreMemoires: true,
    }
  }

  return base
}

export type FonctionnalitePremium = keyof Omit<
  Droits,
  'plan' | 'statut' | 'estEnEssai' | 'essaiTermineLe' | 'periodeActuelleTermineLe'
>

export const PLAN_REQUIS: Record<FonctionnalitePremium, PlanAbonnement> = {
  rituelComplet: 'famille',
  suiwiMedicaments: 'famille',
  nombreMedicamentsMax: 'famille',
  nombreProchesMax: 'famille',
  cercleCareComplet: 'famille',
  activitesMax: 'famille',
  decodageCourriers: 'famille',
  compagnonVocal: 'famille',
  resumeHebdo: 'famille',
  bilanRetraite: 'serenite',
  coffreFort: 'serenite',
  conseillerprioritaire: 'serenite',
  livreMemoires: 'serenite',
}
