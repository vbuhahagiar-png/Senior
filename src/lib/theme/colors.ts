export const palette = {
  // Couleurs signature Senior+
  ivoire: '#F5F0E8',
  ivoireLight: '#FAF7F2',
  ivoireDark: '#EDE6D8',

  sauge: '#8A9E85',
  saugeLight: '#B5C9B1',
  saugeLighter: '#D8E8D5',
  saugeDark: '#6A7E65',
  saugeDarker: '#4E5F4A',

  terracotta: '#C4714A',
  terracottaLight: '#D99478',
  terracottaLighter: '#EEB99E',
  terracottaDark: '#A35A37',
  terracottaDarker: '#7D4228',

  ardoise: '#3D3D3D',
  ardoiseLight: '#6B6B6B',
  ardoiseLighter: '#9A9A9A',

  brume: '#D8D4CC',
  brumeLight: '#EAE6E0',
  brumeLighter: '#F2EFEB',

  // Neutres
  blanc: '#FFFFFF',
  noir: '#1A1A1A',

  // Sémantiques
  succes: '#4A8C5C',
  succesLight: '#D4EAD8',
  erreur: '#C44A4A',
  erreurLight: '#F5D4D4',
  attention: '#C4954A',
  attentionLight: '#F5E4D4',
  info: '#4A78C4',
  infoLight: '#D4E2F5',

  transparent: 'transparent',
} as const

// Aliases sémantiques (utilisés dans les composants)
export const couleurs = {
  fond: palette.ivoire,
  fondClair: palette.ivoireLight,
  surface: palette.blanc,
  surfaceElevee: palette.ivoireLight,
  bordure: palette.brume,
  bordureFocused: palette.sauge,

  primaire: palette.sauge,
  primaireClair: palette.saugeLight,
  primaireFonce: palette.saugeDark,

  accent: palette.terracotta,
  accentClair: palette.terracottaLight,
  accentFonce: palette.terracottaDark,

  texte: palette.ardoise,
  texteSecondaire: palette.ardoiseLight,
  texteTertiaire: palette.ardoiseLighter,
  texteInverse: palette.blanc,
  texteSurPrimaire: palette.blanc,
  texteSurAccent: palette.blanc,

  desactive: palette.brume,
  desactiveTexte: palette.ardoiseLighter,

  succes: palette.succes,
  succesBackground: palette.succesLight,
  erreur: palette.erreur,
  erreurBackground: palette.erreurLight,
  attention: palette.attention,
  attentionBackground: palette.attentionLight,
  info: palette.info,
  infoBackground: palette.infoLight,

  // Niveaux d'humeur (rituel matin)
  humeurExcellent: '#4A8C5C',
  humeurBien: '#8A9E85',
  humeurMoyen: '#C4954A',
  humeurPasTerrible: '#C4714A',
  humeurDifficile: '#C44A4A',

  // Intensités d'activité
  intensiteDouce: '#8A9E85',
  intensiteModeree: '#C4954A',
  intensiteIntense: '#C44A4A',
} as const

export type Palette = typeof palette
export type Couleurs = typeof couleurs
