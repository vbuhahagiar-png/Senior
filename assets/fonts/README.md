# Polices requises

Téléchargez et placez les fichiers suivants dans ce dossier :

## Fraunces (display)
Source : https://fonts.google.com/specimen/Fraunces

- Fraunces-Regular.ttf
- Fraunces-SemiBold.ttf
- Fraunces-Bold.ttf

## Nunito (body)
Source : https://fonts.google.com/specimen/Nunito

- Nunito-Regular.ttf
- Nunito-SemiBold.ttf
- Nunito-Bold.ttf

## Installation rapide
```bash
# Avec curl depuis Google Fonts (exemple)
curl -L "https://fonts.gstatic.com/s/fraunces/v31/Qs..." -o Fraunces-Regular.ttf
```

Ou utilisez le package npm :
```bash
npx expo install @expo-google-fonts/fraunces @expo-google-fonts/nunito
```
Et adaptez le chargement des polices dans `app/_layout.tsx`.
