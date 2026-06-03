import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Camera, Upload, FileText } from 'lucide-react-native'
import { Ecran } from '@/components/layout/Screen'
import { Texte } from '@/components/ui/Text'
import { Bouton } from '@/components/ui/Button'
import { Carte } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Cadenas } from '@/components/ui/FeatureLock'
import { couleurs, espacement } from '@/lib/theme'
import { formaterTempsEcoule } from '@/lib/utils'

const COURRIERS_DEMO = [
  {
    id: '1',
    expediteur: 'Caisse maladie Assura',
    categorie: 'assurance',
    statut: 'done',
    lu: false,
    date: new Date(Date.now() - 3600000),
    extrait: 'Votre franchise pour 2025 passe à CHF 300. Vous pouvez contester cette décision d\'ici le 31 janvier.',
  },
]

export default function CourriersScreen() {
  return (
    <Ecran>
      <View style={styles.entete}>
        <Texte variante="displayMd">Courriers</Texte>
        <Texte variante="corps" couleur={couleurs.texteSecondaire}>
          Photographiez un courrier pour l'avoir expliqué en clair.
        </Texte>
      </View>

      <Cadenas fonctionnalite="decodageCourriers">
        {/* Bouton upload */}
        <Carte padding="lg" couleurFond={couleurs.saugeLighter + '30'} style={styles.uploadZone}>
          <FileText size={40} color={couleurs.primaire} strokeWidth={1.5} />
          <Texte variante="titre" align="center">Décoder un courrier</Texte>
          <Texte variante="corps" couleur={couleurs.texteSecondaire} align="center">
            Prenez en photo un courrier administratif ou médical.
          </Texte>
          <View style={styles.uploadBoutons}>
            <Bouton
              variante="primaire"
              icone={<Camera size={20} color={couleurs.blanc} strokeWidth={2} />}
              onPress={() => {}}
            >
              Photographier
            </Bouton>
            <Bouton
              variante="secondaire"
              icone={<Upload size={20} color={couleurs.primaire} strokeWidth={2} />}
              onPress={() => {}}
            >
              Importer
            </Bouton>
          </View>
          <Texte variante="legende" couleur={couleurs.texteTertiaire} align="center">
            🔒 Vos courriers restent strictement privés et chiffrés.
          </Texte>
        </Carte>

        {/* Liste des courriers */}
        {COURRIERS_DEMO.map((c) => (
          <Carte key={c.id} onPress={() => {}} padding="md" style={styles.courrierCarte}>
            <View style={styles.courrierEntete}>
              <View>
                <Texte variante="corpsgrand">{c.expediteur}</Texte>
                <Texte variante="legende" couleur={couleurs.texteTertiaire}>
                  {formaterTempsEcoule(c.date)}
                </Texte>
              </View>
              <View style={styles.courrierBadges}>
                {!c.lu && <Badge texte="Nouveau" variante="accent" />}
                <Badge texte={c.categorie} variante="neutre" />
              </View>
            </View>
            <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire} numberOfLines={3}>
              {c.extrait}
            </Texte>
          </Carte>
        ))}
      </Cadenas>
    </Ecran>
  )
}

const styles = StyleSheet.create({
  entete: { gap: espacement.sm, marginBottom: espacement.lg },
  uploadZone: {
    alignItems: 'center',
    gap: espacement.md,
    marginBottom: espacement.lg,
  },
  uploadBoutons: {
    flexDirection: 'row',
    gap: espacement.md,
    width: '100%',
  },
  courrierCarte: {
    gap: espacement.sm,
    marginBottom: espacement.md,
    borderLeftWidth: 4,
    borderLeftColor: couleurs.accent,
  },
  courrierEntete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  courrierBadges: {
    gap: espacement.xs,
    alignItems: 'flex-end',
  },
})
