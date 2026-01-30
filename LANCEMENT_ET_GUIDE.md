# Guide de Lancement - Application Gestion des Projets

## Prérequis
- Flutter 3.38.5 ou supérieur
- Dart 3.10.4 ou supérieur
- Un appareil Android, iOS ou simulateur

## Installation et Lancement

### 1. Installer les dépendances
```bash
cd c:\Users\jxk\Documents\gestion_projet
flutter pub get
```

### 2. Lancer l'application
```bash
flutter run
```

Ou pour une plateforme spécifique :
```bash
flutter run -d android          # Android
flutter run -d iphone           # iOS
flutter run -d windows          # Windows
flutter run -d linux            # Linux
flutter run -d web              # Web
```

### 3. Lancer en mode release (pour performances optimales)
```bash
flutter run --release
```

## Architecture de l'Application

### Fichiers Créés

1. **lib/models.dart** (170 lignes)
   - `GroupRegistration` : Gère les inscriptions des groupes
   - `Subject` : Représente un sujet de présentation
   - `CardState` : Représente l'état d'une carte de jeu
   - `GameState` : Gère l'état complet du jeu

2. **lib/pages/home_page.dart** (157 lignes)
   - Interface d'accueil avec statistiques
   - Buttons pour l'inscription et l'administration
   - Affichage des inscriptions en attente et approuvées

3. **lib/pages/registration_page.dart** (145 lignes)
   - Formulaire d'inscription pour les chefs de groupe
   - Validation des données
   - Feedback utilisateur

4. **lib/pages/admin_page.dart** (215 lignes)
   - Gestion des inscriptions en attente
   - Approbation/Refus des groupes
   - Démarrage du jeu (5+ groupes approuvés)

5. **lib/pages/game_page.dart** (280 lignes)
   - Interface du jeu avec 6 cartes retournées
   - Animations flip 3D
   - Animations de succès élastique
   - Gestion de la sélection des cartes

6. **lib/main.dart** (64 lignes)
   - Point d'entrée principal
   - Navigation entre les pages
   - Gestion d'état global

## Flux Utilisateur

### Scénario 1 : Chef de Groupe

1. Lance l'app → Page d'accueil
2. Clique sur "S'inscrire comme chef de groupe"
3. Remplit le formulaire (Nom + Nom du groupe)
4. Soumet l'inscription
5. Attend l'approbation de l'admin
6. Une fois approuvé et tous les groupes inscrits → Accès au jeu
7. Sélectionne une lettre pour révéler le sujet

### Scénario 2 : Administrateur

1. Lance l'app → Page d'accueil
2. Clique sur "Accès administrateur"
3. Navigue vers `/ithiel`
4. Voit la liste des inscriptions en attente
5. Approuve ou refuse les groupes
6. Une fois 6 groupes approuvés → Bouton "Démarrer le jeu"
7. Clique sur "Démarrer le jeu" pour commencer

## Sujets de Présentation

Les 6 sujets attribués aléatoirement :

| Lettre | Sujet |
|--------|-------|
| A | Le plan de gestion « PRISM » |
| B | Le plan de gestion « Lean Six Sigma » |
| C | Le plan de gestion « PMBOK » |
| D | Le plan de gestion « Waterfall » |
| E | Le plan de gestion « PRINCE 2 » |
| F | Le plan de gestion « Agile » |

## Fonctionnalités Spéciales

✨ **Animations**
- Retournement fluide des cartes (flip 3D)
- Animation élastique au succès
- Gradient backgrounds pour une meilleure UX

🔐 **Sécurité**
- Route `/ithiel` pour accès administrateur
- Validation des formulaires
- Confirmation avant refus d'inscriptions

📊 **Statistiques**
- Affichage du nombre d'inscriptions
- Compteur des groupes approuvés
- Statut du jeu en temps réel

## Dépannage

### L'app ne se lance pas
```bash
flutter clean
flutter pub get
flutter run
```

### Erreurs de compilation
```bash
flutter doctor
# Assurez-vous que tout est ✓
```

### Problèmes de hot reload
```bash
# Arrêtez l'app et relancez avec:
flutter run --full-restart
```

## Personnalisation

### Ajouter/Modifier les sujets
Éditez `lib/models.dart`, la liste `subjects` dans `GameState`:

```dart
subjects = [
  'Votre nouveau sujet 1',
  'Votre nouveau sujet 2',
  // ... etc
];
```

### Modifier les couleurs
Changez les constantes de couleur dans chaque page (ex: `Colors.deepPurple`)

### Ajuster les durées d'animation
Dans `game_page.dart`, modifiez:
```dart
duration: const Duration(milliseconds: 600), // Durée du flip
```

## Support

Pour toute question ou bug, consultez les fichiers source :
- Page d'accueil : [lib/pages/home_page.dart](lib/pages/home_page.dart)
- Admin : [lib/pages/admin_page.dart](lib/pages/admin_page.dart)
- Jeu : [lib/pages/game_page.dart](lib/pages/game_page.dart)

---

**Développé avec ❤️ en Flutter**
Version 1.0.0
