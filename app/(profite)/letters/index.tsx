import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Camera, Upload, FileText, ChevronRight, CheckCircle, Clock } from 'lucide-react-native'
import { Texte } from '@/components/ui/Text'
import { Bouton } from '@/components/ui/Button'
import { Carte } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Cadenas } from '@/components/ui/FeatureLock'
import { couleurs, espacement, arrondi } from '@/lib/theme'

const COURRIERS_DEMO = [
  {
    id: '1',
    expediteur: 'Caisse maladie Assura',
    categorie: 'assurance',
    statut: 'traite',
    lu: false,
    date: 'il y a 1h',
    extrait: 'Votre franchise pour 2025 passe à CHF 300. Vous pouvez contester cette décision d\'ici le 31 janvier.',
    couleurBordure: couleurs.erreur,
    resume: "Votre assurance maladie modifie votre franchise. Vous avez jusqu'au 31 janvier pour contester si vous n'êtes pas d'accord.",
  },
  {
    id: '2',
    expediteur: 'AVS / Caisse de retraite',
    categorie: 'retraite',
    statut: 'en_cours',
    lu: true,
    date: 'il y a 3j',
    extrait: 'Votre rente AVS du mois de juin sera versée le 5 juin 2025. Montant : CHF 2\'340.—',
    couleurBordure: couleurs.succes,
    resume: 'Votre rente de retraite sera versée prochainement. Aucune action requise.',
  },
  {
    id: '3',
    expediteur: 'HUG - Hôpitaux Universitaires Genève',
    categorie: 'medical',
    statut: 'traite',
    lu: true,
    date: 'il y a 1 sem',
    extrait: 'Compte-rendu de consultation du Dr. Müller - Cardiologie. Résultats satisfaisants. Prochain contrôle dans 6 mois.',
    couleurBordure: couleurs.primaire,
    resume: 'Votre bilan cardiologique est satisfaisant. Votre médecin vous reverra dans 6 mois.',
  },
  {
    id: '4',
    expediteur: 'Office Cantonal Genevois (OCE)',
    categorie: 'officiel',
    statut: 'en_cours',
    lu: false,
    date: 'il y a 2 sem',
    extrait: 'Formulaire de demande de renouvellement de votre carte d\'identité. Veuillez vous présenter au guichet avant le 30 juin.',
    couleurBordure: couleurs.attention,
    resume: 'Votre carte d\'identité doit être renouvelée. Rendez-vous au guichet communal avant le 30 juin.',
  },
  {
    id: '5',
    expediteur: 'SIG - Services Industriels de Genève',
    categorie: 'facture',
    statut: 'traite',
    lu: true,
    date: 'il y a 3 sem',
    extrait: 'Votre facture d\'électricité pour la période mars–mai 2025. Montant à payer : CHF 187.50 avant le 15 juin.',
    couleurBordure: couleurs.info,
    resume: 'Facture d\'électricité à payer avant le 15 juin. Montant : CHF 187.50.',
  },
  {
    id: '6',
    expediteur: 'CSS Assurance Maladie',
    categorie: 'assurance',
    statut: 'traite',
    lu: true,
    date: 'il y a 1 mois',
    extrait: 'Remboursement de vos frais médicaux du mois d\'avril : CHF 345.20 crédités sur votre compte le 2 mai.',
    couleurBordure: couleurs.succes,
    resume: 'Remboursement médical reçu. CHF 345.20 ont été virés sur votre compte bancaire.',
  },
]

const CATEGORIES = ['Toutes', 'assurance', 'medical', 'retraite', 'officiel', 'facture']

const LABELS_CAT: Record<string, string> = {
  Toutes: 'Toutes', assurance: 'Assurance', medical: 'Médical',
  retraite: 'Retraite', officiel: 'Officiel', facture: 'Facture',
}

const VARIANTES_CAT: Record<string, any> = {
  assurance: 'erreur', medical: 'primaire', retraite: 'succes',
  officiel: 'attention', facture: 'info', Toutes: 'neutre',
}

export default function CourriersScreen() {
  const [categorieActive, setCategorieActive] = useState('Toutes')
  const [courrierOuvert, setCourrierOuvert] = useState<string | null>(null)

  const courriersFiltres = COURRIERS_DEMO.filter(
    (c) => categorieActive === 'Toutes' || c.categorie === categorieActive
  )
  const nonLus = COURRIERS_DEMO.filter((c) => !c.lu).length

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* En-tête */}
      <View style={styles.entete}>
        <View style={styles.enteteHaut}>
          <View>
            <Texte variante="displayMd">Courriers</Texte>
            {nonLus > 0 && (
              <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>
                {nonLus} nouveau{nonLus > 1 ? 'x' : ''} courrier{nonLus > 1 ? 's' : ''}
              </Texte>
            )}
          </View>
        </View>
        <Texte variante="corps" couleur={couleurs.texteSecondaire}>
          Photographiez un courrier pour le faire expliquer en langage clair.
        </Texte>
      </View>

      <Cadenas fonctionnalite="decodageCourriers">
        {/* Zone upload */}
        <View style={styles.uploadZone}>
          <View style={styles.uploadIcone}>
            <FileText size={36} color={couleurs.primaire} strokeWidth={1.5} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Texte variante="corpsgrand">Décoder un nouveau courrier</Texte>
            <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>
              Administratif, médical, assurance — en clair en 30 secondes
            </Texte>
          </View>
          <View style={styles.uploadBoutons}>
            <TouchableOpacity style={styles.uploadBtn} onPress={() => {}}>
              <Camera size={20} color={couleurs.primaire} strokeWidth={2} />
              <Texte variante="corpsPetit" couleur={couleurs.primaire}>Photo</Texte>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.uploadBtn, styles.uploadBtnSecondaire]} onPress={() => {}}>
              <Upload size={20} color={couleurs.accent} strokeWidth={2} />
              <Texte variante="corpsPetit" couleur={couleurs.accent}>Import</Texte>
            </TouchableOpacity>
          </View>
          <Texte variante="legende" couleur={couleurs.texteTertiaire} align="center">
            🔒 Données chiffrées · Hébergées en Suisse
          </Texte>
        </View>

        {/* Filtres catégories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtresRow}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filtrePill, categorieActive === cat && styles.filtrePillActif]}
              onPress={() => setCategorieActive(cat)}
            >
              <Texte
                variante="corpsPetit"
                couleur={categorieActive === cat ? couleurs.blanc : couleurs.texte}
              >
                {LABELS_CAT[cat]}
              </Texte>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Liste courriers */}
        <View style={styles.liste}>
          {courriersFiltres.map((c) => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setCourrierOuvert(courrierOuvert === c.id ? null : c.id)}
              activeOpacity={0.85}
            >
              <Carte padding="md" style={[styles.courrierCarte, { borderLeftColor: c.couleurBordure }]}>
                <View style={styles.courrierEntete}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <View style={styles.courrierTitreLigne}>
                      {!c.lu && <View style={[styles.nonLuDot, { backgroundColor: c.couleurBordure }]} />}
                      <Texte variante="corpsgrand" style={{ flex: 1 }}>{c.expediteur}</Texte>
                    </View>
                    <Texte variante="legende" couleur={couleurs.texteTertiaire}>{c.date}</Texte>
                  </View>
                  <View style={styles.courrierBadges}>
                    <Badge texte={LABELS_CAT[c.categorie] ?? c.categorie} variante={VARIANTES_CAT[c.categorie] ?? 'neutre'} />
                    {c.statut === 'traite' ? (
                      <View style={styles.statutTraite}>
                        <CheckCircle size={14} color={couleurs.succes} strokeWidth={2} />
                        <Texte variante="legende" couleur={couleurs.succes}>Traité</Texte>
                      </View>
                    ) : (
                      <View style={styles.statutEnCours}>
                        <Clock size={14} color={couleurs.attention} strokeWidth={2} />
                        <Texte variante="legende" couleur={couleurs.attention}>À faire</Texte>
                      </View>
                    )}
                  </View>
                </View>

                <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire} numberOfLines={courrierOuvert === c.id ? undefined : 2}>
                  {c.extrait}
                </Texte>

                {courrierOuvert === c.id && (
                  <View style={styles.resumeBox}>
                    <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>
                      💡 En clair :
                    </Texte>
                    <Texte variante="corps" style={{ lineHeight: 22 }}>
                      {c.resume}
                    </Texte>
                  </View>
                )}

                <View style={styles.courrierPied}>
                  <Texte variante="legende" couleur={couleurs.accent}>
                    {courrierOuvert === c.id ? 'Réduire ▲' : 'Voir l\'explication ▼'}
                  </Texte>
                </View>
              </Carte>
            </TouchableOpacity>
          ))}
        </View>

        {courriersFiltres.length === 0 && (
          <View style={styles.vide}>
            <Texte variante="displayMd" align="center">📭</Texte>
            <Texte variante="titre" align="center">Aucun courrier</Texte>
            <Texte variante="corps" couleur={couleurs.texteSecondaire} align="center">
              Aucun courrier dans cette catégorie.
            </Texte>
          </View>
        )}
      </Cadenas>

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: couleurs.ivoire },
  container: { padding: espacement.lg },
  entete: {
    gap: espacement.sm,
    marginBottom: espacement.xl,
  },
  enteteHaut: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  uploadZone: {
    backgroundColor: couleurs.blanc,
    borderRadius: arrondi.xl,
    padding: espacement.lg,
    marginBottom: espacement.lg,
    gap: espacement.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: couleurs.primaire + '30',
    borderStyle: 'dashed',
  },
  uploadIcone: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: couleurs.primaire + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  uploadBoutons: {
    flexDirection: 'row',
    gap: espacement.md,
    width: '100%',
  },
  uploadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacement.sm,
    paddingVertical: espacement.md,
    borderRadius: arrondi.lg,
    backgroundColor: couleurs.primaire + '12',
    borderWidth: 1,
    borderColor: couleurs.primaire + '30',
  },
  uploadBtnSecondaire: {
    backgroundColor: couleurs.accent + '12',
    borderColor: couleurs.accent + '30',
  },
  filtresRow: {
    gap: espacement.sm,
    marginBottom: espacement.lg,
  },
  filtrePill: {
    paddingHorizontal: espacement.md,
    paddingVertical: espacement.sm,
    borderRadius: arrondi.full,
    backgroundColor: couleurs.brumeLight,
  },
  filtrePillActif: {
    backgroundColor: couleurs.accent,
  },
  liste: { gap: espacement.md },
  courrierCarte: {
    gap: espacement.sm,
    borderLeftWidth: 4,
  },
  courrierEntete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: espacement.sm,
  },
  courrierTitreLigne: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacement.xs,
  },
  nonLuDot: {
    width: 8, height: 8, borderRadius: 4,
    flexShrink: 0,
  },
  courrierBadges: {
    gap: espacement.xs,
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  statutTraite: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  statutEnCours: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  resumeBox: {
    backgroundColor: couleurs.succesBackground,
    borderRadius: arrondi.lg,
    padding: espacement.md,
    gap: espacement.xs,
    borderWidth: 1,
    borderColor: couleurs.succes + '30',
  },
  courrierPied: {
    paddingTop: espacement.xs,
  },
  vide: {
    alignItems: 'center',
    gap: espacement.md,
    paddingVertical: espacement.xxxl,
  },
})
