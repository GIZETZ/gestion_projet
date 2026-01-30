# Gestion des Projets - Application Flutter

Une application interactive pour permettre aux groupes de classe de sélectionner aléatoirement des sujets de présentation via un système de cartes retournées.

## Fonctionnalités

### 1. Page d'Accueil
- Affichage du nombre d'inscriptions en attente et approuvées
- Bouton pour s'inscrire comme chef de groupe
- Accès sécurisé à la page d'administration

### 2. Inscription des Groupes
- Les chefs de groupe entrent leur nom et le nom du groupe
- Validation des formulaires
- Confirmation de l'inscription

### 3. Page d'Administration (/ithiel)
- Affichage des inscriptions en attente
- Boutons pour approuver ou refuser chaque inscription
- Affichage des groupes approuvés
- Bouton pour démarrer le jeu (seulement quand 6 groupes sont approuvés)

### 4. Page de Jeu
- Affichage de 6 cartes avec des lettres (A à F)
- Les cartes se retournent quand un chef de groupe les sélectionne
- Chaque carte révèle le sujet attribué
- Le nom du groupe s'affiche sur la carte
- Animations fluides avec :
  - Animation de retournement (flip)
  - Animation d'élasticité au succès

## Sujets Disponibles

1. Le plan de gestion « PRISM »
2. Le plan de gestion « Lean Six Sigma »
3. Le plan de gestion « PMBOK »
4. Le plan de gestion « Waterfall »
5. Le plan de gestion « PRINCE 2 »
6. Le plan de gestion « Agile »

## Navigation

- **Accueil (/)** : Page d'accueil avec options
- **/ithiel** : Page d'administration (sécurisée)
- **/jeu** : Page de jeu (après démarrage)

## Structure du Code

### Models (`lib/models.dart`)
- `GroupRegistration` : Représente une inscription de groupe
- `Subject` : Représente un sujet
- `CardState` : Représente l'état d'une carte
- `GameState` : Gère l'état global du jeu

### Pages
- `lib/pages/home_page.dart` : Page d'accueil
- `lib/pages/registration_page.dart` : Inscription des groupes
- `lib/pages/admin_page.dart` : Gestion administrative
- `lib/pages/game_page.dart` : Interface du jeu

## Démarrage de l'Application

```bash
flutter pub get
flutter run
```

## Flux d'Utilisation

1. Les chefs de groupe arrivent sur la page d'accueil
2. Ils s'inscrivent en entrant leur nom et le nom du groupe
3. L'administrateur accède à `/ithiel` pour approuver les inscriptions
4. Une fois 6 groupes approuvés, l'administrateur clique sur "Démarrer le jeu"
5. Les chefs de groupe sélectionnent une lettre pour révéler le sujet
6. Les cartes se retournent avec le sujet et le nom du groupe

## Animations

- **Flip Animation** : Rotation 3D lors du retournement des cartes
- **Success Animation** : Élan élastique quand une carte est sélectionnée
- **Gradient Backgrounds** : Dégradés pour une meilleure expérience visuelle
