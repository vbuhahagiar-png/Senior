import { format, formatDistance, isToday, isYesterday, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

// ── Formatage de dates ──────────────────────────────────────────────────────

export function formaterDate(date: Date | string, formatStr = 'dd/MM/yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, formatStr, { locale: fr })
}

export function formaterDateLong(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'EEEE d MMMM yyyy', { locale: fr })
}

export function formaterHeure(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'HH:mm', { locale: fr })
}

export function formaterDateRelative(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (isToday(d)) return "Aujourd'hui"
  if (isYesterday(d)) return 'Hier'
  return format(d, 'EEEE d MMMM', { locale: fr })
}

export function formaterTempsEcoule(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistance(d, new Date(), { locale: fr, addSuffix: true })
}

export function dateAujourdhui(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

// ── Formatage monétaire ─────────────────────────────────────────────────────

export function formaterCHF(montant: number, decimales = 2): string {
  return `CHF ${montant.toFixed(decimales)}`
}

// ── Texte ───────────────────────────────────────────────────────────────────

export function getInitiales(nom: string): string {
  return nom
    .split(' ')
    .map((mot) => mot[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
}

export function pluraliser(count: number, singulier: string, pluriel?: string): string {
  if (count <= 1) return `${count} ${singulier}`
  return `${count} ${pluriel ?? singulier + 's'}`
}

export function capitaliser(texte: string): string {
  return texte.charAt(0).toUpperCase() + texte.slice(1).toLowerCase()
}

export function tronquer(texte: string, longueur = 100): string {
  if (texte.length <= longueur) return texte
  return texte.slice(0, longueur).trimEnd() + '…'
}

// ── Téléphone ───────────────────────────────────────────────────────────────

export function formaterTelephone(tel: string): string {
  const chiffres = tel.replace(/\D/g, '')
  if (chiffres.startsWith('41') && chiffres.length === 11) {
    return `+${chiffres.slice(0, 2)} ${chiffres.slice(2, 4)} ${chiffres.slice(4, 7)} ${chiffres.slice(7, 9)} ${chiffres.slice(9)}`
  }
  if (chiffres.length === 10 && chiffres.startsWith('0')) {
    return `${chiffres.slice(0, 3)} ${chiffres.slice(3, 6)} ${chiffres.slice(6, 8)} ${chiffres.slice(8)}`
  }
  return tel
}

// ── Géolocalisation ─────────────────────────────────────────────────────────

export function calculerDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formaterDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

// ── Humeur ──────────────────────────────────────────────────────────────────

export const EMOJIS_HUMEUR: Record<number, string> = {
  1: '😔',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😄',
}

export const LABELS_HUMEUR: Record<number, string> = {
  1: 'Difficile',
  2: 'Pas terrible',
  3: 'Moyen',
  4: 'Bien',
  5: 'Excellent',
}

export function humeurEmoji(niveau: number): string {
  return EMOJIS_HUMEUR[niveau] ?? '😐'
}

export function humeurLabel(niveau: number): string {
  return LABELS_HUMEUR[niveau] ?? 'Moyen'
}

// ── Validation ──────────────────────────────────────────────────────────────

export function estEmailValide(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function estDateValide(dateStr: string): boolean {
  const [jour, mois, annee] = dateStr.split('/').map(Number)
  if (!jour || !mois || !annee) return false
  const d = new Date(annee, mois - 1, jour)
  return d.getFullYear() === annee && d.getMonth() === mois - 1 && d.getDate() === jour
}

// ── Utilitaires React Native ────────────────────────────────────────────────

export function attendre(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
