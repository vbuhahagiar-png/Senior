import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { ArrowLeft, Heart, Share2, MapPin, Clock, Euro, Users, Bus, Car } from 'lucide-react-native'
import { Texte } from '@/components/ui/Text'
import { Bouton } from '@/components/ui/Button'
import { Carte } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { couleurs, espacement, palette, arrondi, ombres } from '@/lib/theme'
import { SafeAreaView } from 'react-native-safe-area-context'

const ACTIVITES: Record<string, any> = {
  '1': {
    emoji: '🏊', titre: 'Aquagym seniors', categorie: 'Sport',
    date: 'Mardi & Jeudi', heure: '10h00 – 11h00',
    lieu: 'Piscine des Bains des Pâquis', adresse: 'Quai du Mont-Blanc 30, 1201 Genève',
    organisateur: 'Ville de Genève – Service des sports', note: 4.9,
    prix: 'Gratuit', places: 8, inscrits: 12,
    description: "L'aquagym seniors est un cours d'aquafitness adapté aux personnes de 60 ans et plus. Dans une eau à 30°C, les exercices doux renforcent les muscles, améliorent l'équilibre et soulagent les articulations. Aucune aptitude à la natation requise — l'eau arrive à la taille.\n\nLes séances sont encadrées par des professeurs diplômés en activité physique adaptée (APA). Ambiance conviviale garantie !",
    badge: '⭐ Populaire', intensite: 'Douce',
    transports: 'Bus 1, 7, 36 · Arrêt Rive (5 min à pied)',
    parking: 'Parking Rive (payant) · 5 min à pied',
    pme: true,
    avis: [
      { nom: 'Françoise M.', note: 5, texte: 'Super cours, professeur très patient et attentif. Je viens chaque semaine depuis 6 mois !' },
      { nom: 'Roger B.', note: 5, texte: "L'eau chaude fait du bien aux articulations. Parfait pour mes genoux fragiles." },
    ],
    couleurHero: palette.sauge,
  },
  '2': {
    emoji: '🧘', titre: 'Yoga doux pour seniors', categorie: 'Yoga & Bien-être',
    date: 'Lundi & Jeudi', heure: '10h00 – 11h00',
    lieu: 'Centre sportif Frontenex', adresse: 'Rue Gustave-Moynier 5, 1207 Genève',
    organisateur: 'Pro Senectute Genève', note: 4.8,
    prix: 'CHF 8/séance', places: 12, inscrits: 8,
    description: 'Cours de yoga adapté aux seniors, axé sur la souplesse, la respiration et la relaxation. Les postures sont adaptées pour respecter les limites physiques de chacun. Tapis fournis.',
    badge: null, intensite: 'Douce',
    transports: 'Bus 8, 27 · Arrêt Frontenex',
    parking: 'Parking souterrain Frontenex',
    pme: true,
    avis: [
      { nom: 'Monique L.', note: 5, texte: 'Cours fantastique, je rends mieux depuis que je pratique le yoga.' },
      { nom: 'André P.', note: 4, texte: 'Professeure très professionnelle. Les exercices de respiration m\'aident beaucoup.' },
    ],
    couleurHero: '#8A9E85',
  },
}

const ACTIVITE_DEFAUT = {
  emoji: '🎭', titre: 'Activité', categorie: 'Culture',
  date: 'Cette semaine', heure: 'À confirmer',
  lieu: 'Genève', adresse: 'Genève, Suisse',
  organisateur: 'Association Senior+', note: 4.7,
  prix: 'Gratuit', places: 15, inscrits: 5,
  description: 'Une activité enrichissante organisée pour les seniors genevois. Ambiance conviviale et animateurs qualifiés.',
  badge: null, intensite: null,
  transports: 'Transports publics TPG', parking: 'Parking à proximité',
  pme: true,
  avis: [
    { nom: 'Marie C.', note: 5, texte: 'Excellente activité, je recommande !' },
  ],
  couleurHero: '#C4714A',
}

export default function ActiviteDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [sauvegarde, setSauvegarde] = useState(false)
  const [inscrit, setInscrit] = useState(false)

  const activite = ACTIVITES[id ?? ''] ?? ACTIVITE_DEFAUT

  const handleShare = async () => {
    await Share.share({
      message: `Découvrez "${activite.titre}" sur Senior+ · ${activite.lieu} · ${activite.date} ${activite.heure}`,
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: activite.couleurHero ?? couleurs.primaire }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color={couleurs.blanc} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.heroActions}>
          <TouchableOpacity style={styles.heroBtn} onPress={() => setSauvegarde(!sauvegarde)}>
            <Heart size={22} color={sauvegarde ? '#FF6B6B' : couleurs.blanc} fill={sauvegarde ? '#FF6B6B' : 'none'} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.heroBtn} onPress={handleShare}>
            <Share2 size={22} color={couleurs.blanc} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <Texte variante="displayMd" style={styles.heroEmoji}>{activite.emoji}</Texte>
        {activite.badge && <Badge texte={activite.badge} variante="primaire" />}
        {activite.intensite && (
          <Badge texte={`Intensité ${activite.intensite}`} variante="neutre" />
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Titre + organisateur */}
        <View style={styles.section}>
          <Badge texte={activite.categorie} variante="neutre" />
          <Texte variante="displayMd">{activite.titre}</Texte>
          <View style={styles.organisateurLigne}>
            <View style={styles.orgAvatar}>
              <Texte variante="corpsPetit" couleur={couleurs.blanc}>
                {activite.organisateur.charAt(0)}
              </Texte>
            </View>
            <View style={{ flex: 1 }}>
              <Texte variante="corpsgrand">{activite.organisateur}</Texte>
              <View style={styles.noteLigne}>
                {'⭐⭐⭐⭐⭐'.slice(0, Math.round(activite.note)).split('').map((s, i) => (
                  <Texte key={i} variante="legende">{s}</Texte>
                ))}
                <Texte variante="legende" couleur={couleurs.texteSecondaire}> {activite.note}/5</Texte>
              </View>
            </View>
          </View>
        </View>

        {/* Infos clés */}
        <View style={styles.infoGrid}>
          {[
            { icone: Clock, label: activite.heure, sous: activite.date, couleur: couleurs.primaire },
            { icone: MapPin, label: activite.lieu, sous: activite.adresse, couleur: couleurs.accent },
            { icone: Euro, label: activite.prix, sous: 'Par séance', couleur: couleurs.succes },
            { icone: Users, label: `${activite.places} places`, sous: `${activite.inscrits} inscrits`, couleur: couleurs.info },
          ].map(({ icone: Icone, label, sous, couleur }) => (
            <Carte key={label} padding="md" style={styles.infoCarteItem}>
              <View style={[styles.infoIcone, { backgroundColor: couleur + '15' }]}>
                <Icone size={20} color={couleur} strokeWidth={2} />
              </View>
              <Texte variante="corpsgrand" numberOfLines={1}>{label}</Texte>
              <Texte variante="legende" couleur={couleurs.texteSecondaire} numberOfLines={1}>{sous}</Texte>
            </Carte>
          ))}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Texte variante="titre">À propos</Texte>
          <Texte variante="corps" couleur={couleurs.ardoise} style={{ lineHeight: 28 }}>
            {activite.description}
          </Texte>
        </View>

        {/* Carte / localisation */}
        <View style={styles.section}>
          <Texte variante="titre">Lieu</Texte>
          <Carte padding="lg" style={styles.mapPlaceholder} ombre={false}>
            <Texte variante="displayMd" align="center">🗺️</Texte>
            <Texte variante="corpsgrand" align="center">{activite.lieu}</Texte>
            <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire} align="center">{activite.adresse}</Texte>
            <Bouton variante="secondaire" taille="sm" onPress={() => {}}>
              Voir sur la carte
            </Bouton>
          </Carte>
        </View>

        {/* Accessibilité & transport */}
        <View style={styles.section}>
          <Texte variante="titre">Accessibilité & transports</Texte>
          <Carte padding="md" ombre={false} bordure style={{ gap: espacement.md }}>
            {activite.pme && (
              <View style={styles.accessLigne}>
                <Texte variante="corpsgrand">♿</Texte>
                <Texte variante="corps">Accessible personnes à mobilité réduite</Texte>
              </View>
            )}
            <View style={styles.accessLigne}>
              <Bus size={20} color={couleurs.info} strokeWidth={2} />
              <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire} style={{ flex: 1 }}>
                {activite.transports}
              </Texte>
            </View>
            <View style={styles.accessLigne}>
              <Car size={20} color={couleurs.texteSecondaire} strokeWidth={2} />
              <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire} style={{ flex: 1 }}>
                {activite.parking}
              </Texte>
            </View>
          </Carte>
        </View>

        {/* Avis */}
        <View style={styles.section}>
          <Texte variante="titre">Avis participants</Texte>
          {activite.avis.map((avis: any, i: number) => (
            <Carte key={i} padding="md" style={{ gap: espacement.sm }}>
              <View style={styles.avisHeader}>
                <View style={styles.avisAvatar}>
                  <Texte variante="corpsPetit" couleur={couleurs.blanc}>{avis.nom.charAt(0)}</Texte>
                </View>
                <View>
                  <Texte variante="corpsgrand">{avis.nom}</Texte>
                  <Texte variante="legende" couleur={couleurs.attention}>{'⭐'.repeat(avis.note)}</Texte>
                </View>
              </View>
              <Texte variante="corpsPetit" couleur={couleurs.texteSecondaire}>{avis.texte}</Texte>
            </Carte>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* CTA fixe en bas */}
      <View style={styles.ctaContainer}>
        {inscrit ? (
          <Carte padding="md" couleurFond={couleurs.succesBackground} ombre={false} style={{ alignItems: 'center' }}>
            <Texte variante="corpsgrand" couleur={couleurs.succes}>✓ Vous êtes inscrit·e !</Texte>
            <Texte variante="corpsPetit" couleur={couleurs.succes}>Ajouté à votre calendrier</Texte>
          </Carte>
        ) : (
          <Bouton variante="primaire" pleineLargeur taille="lg" onPress={() => setInscrit(true)}>
            S'inscrire gratuitement
          </Bouton>
        )}
        <Bouton variante="fantome" pleineLargeur onPress={handleShare}>
          Partager cette activité
        </Bouton>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: couleurs.ivoire },
  hero: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacement.sm,
    paddingTop: espacement.md,
  },
  backBtn: {
    position: 'absolute', top: espacement.md, left: espacement.lg,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroActions: {
    position: 'absolute', top: espacement.md, right: espacement.lg,
    flexDirection: 'row', gap: espacement.sm,
  },
  heroBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroEmoji: { color: couleurs.blanc, fontSize: 64 },
  content: { flex: 1 },
  section: {
    paddingHorizontal: espacement.lg,
    paddingTop: espacement.xl,
    gap: espacement.md,
  },
  organisateurLigne: { flexDirection: 'row', alignItems: 'center', gap: espacement.md },
  orgAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: couleurs.primaire,
    alignItems: 'center', justifyContent: 'center',
  },
  noteLigne: { flexDirection: 'row', alignItems: 'center' },
  infoGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: espacement.lg,
    paddingTop: espacement.xl,
    gap: espacement.md,
  },
  infoCarteItem: { width: '47%', gap: espacement.sm },
  infoIcone: {
    width: 40, height: 40, borderRadius: arrondi.lg,
    alignItems: 'center', justifyContent: 'center',
  },
  mapPlaceholder: {
    gap: espacement.md, alignItems: 'center',
    backgroundColor: couleurs.brumeLight,
    borderRadius: arrondi.xl, minHeight: 140,
    justifyContent: 'center',
  },
  accessLigne: { flexDirection: 'row', alignItems: 'center', gap: espacement.md },
  avisHeader: { flexDirection: 'row', alignItems: 'center', gap: espacement.md },
  avisAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: couleurs.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  ctaContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: couleurs.blanc,
    padding: espacement.lg,
    paddingBottom: espacement.xl,
    gap: espacement.md,
    borderTopWidth: 1, borderTopColor: couleurs.bordure,
    ...(ombres.lg as object),
  },
})
