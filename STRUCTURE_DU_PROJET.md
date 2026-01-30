# Structure du Projet

## Vue d'ensemble de l'arborescence

```
gestion_projet/
├── android/                    # Configuration Android
├── ios/                        # Configuration iOS
├── linux/                      # Configuration Linux
├── macos/                      # Configuration macOS
├── web/                        # Configuration Web
├── windows/                    # Configuration Windows
├── lib/                        # Code source Dart (MAIN)
│   ├── main.dart              # Point d'entrée + routing
│   ├── models.dart            # Modèles de données
│   └── pages/
│       ├── home_page.dart     # Accueil
│       ├── registration_page.dart  # Inscription
│       ├── admin_page.dart    # Administration
│       └── game_page.dart     # Jeu
├── test/                       # Tests unitaires
├── build/                      # Build Flutter (généré)
├── pubspec.yaml               # Dépendances
├── analysis_options.yaml      # Configuration analyse
└── README.md                  # Documentation
```

## Détail des Fichiers Clés

### 1. `lib/main.dart` (64 lignes)
**Rôle**: Point d'entrée et gestion globale

**Contenu**:
- `void main()` - Lance l'application
- `class MyApp extends StatefulWidget` - Widget racine
- `class _MyAppState` - Gestion d'état global
- Navigation entre les pages
- Routes nommées (`/ithiel`)

**Dépendances**:
```dart
import 'models.dart';
import 'pages/home_page.dart';
import 'pages/admin_page.dart';
import 'pages/game_page.dart';
```

### 2. `lib/models.dart` (170 lignes)
**Rôle**: Définir les structures de données

**Classes**:
```dart
class GroupRegistration {
  final String groupName;
  final String leaderName;
  final String id;
  bool isApproved;
}

class CardState {
  final String letter;
  final String title;
  String? selectedByGroup;
  bool isRevealed;
}

class GameState {
  final List<GroupRegistration> pendingRegistrations;
  final List<GroupRegistration> approvedGroups;
  final List<CardState> cards;
  final List<String> subjects;
  
  void initializeGame() { ... }
}
```

### 3. `lib/pages/home_page.dart` (157 lignes)
**Rôle**: Interface d'accueil

**Widgets**:
- Appbar avec titre
- Affichage des statistiques
- Bouton "S'inscrire"
- Bouton "Accès Admin"
- Dégradé de fond

**État**:
- Stateless (UI statique)

### 4. `lib/pages/registration_page.dart` (145 lignes)
**Rôle**: Formulaire d'inscription

**Widgets**:
- Form avec validation
- TextFormField pour nom du chef
- TextFormField pour nom du groupe
- Bouton d'envoi
- Dialog de succès

**État**:
- Stateful (gère les contrôleurs)

### 5. `lib/pages/admin_page.dart` (215 lignes)
**Rôle**: Gestion administrative

**Widgets**:
- AppBar (rouge)
- ListView des inscriptions en attente
- Boutons Approuver/Refuser
- Affichage des groupes approuvés
- Bouton "Démarrer le jeu"

**État**:
- Stateful (met à jour les inscriptions)

### 6. `lib/pages/game_page.dart` (280 lignes)
**Rôle**: Interface de jeu

**Widgets**:
- `GamePage` - Container principal
  - GridView avec 6 cartes
- `GameCard` - Chaque carte
  - Animation flip 3D
  - Verso avec lettre
  - Recto avec sujet et groupe

**Animations**:
- Flip controller (600ms)
- Success controller (800ms)

## Flux de Données

```
main.dart (_MyAppState)
  |
  +-- GameState (état global)
  |    |
  |    +-- List<GroupRegistration>
  |    +-- List<CardState>
  |    +-- List<String> (sujets)
  |
  +-- Pages
       |
       +-- HomePage
       |    +-- RegistrationPage (nested)
       |
       +-- AdminPage
       |
       +-- GamePage
            +-- GameCard (x6)
```

## Dépendances Entre Fichiers

```
main.dart
├── imports: models.dart
├── imports: pages/home_page.dart
├── imports: pages/admin_page.dart
└── imports: pages/game_page.dart

home_page.dart
├── imports: models.dart
└── imports: pages/registration_page.dart

registration_page.dart
└── imports: models.dart

admin_page.dart
└── imports: models.dart

game_page.dart
└── imports: models.dart
```

## Gestion d'État

### État Global (main.dart)
```dart
class _MyAppState extends State<MyApp> {
  late GameState _gameState;           // État du jeu
  bool _gameStarted = false;            // Jeu commencé?
  
  void _onStateChanged() { setState(...); }
  void _onGameStarted() { setState(...); }
}
```

### État Local (pages)
```dart
// RegistrationPage - Gère les contrôleurs de formulaire
TextEditingController _groupNameController;
TextEditingController _leaderNameController;

// GamePage - Gère les animations
AnimationController _successAnimationController;
Animation<double> _successAnimation;

// GameCard - Gère l'animation de flip
AnimationController _flipController;
Animation<double> _flipAnimation;
```

## Modèle MVC (Model-View-Controller)

### Model (`models.dart`)
- `GroupRegistration`
- `CardState`
- `GameState`

### View (Pages)
- `HomePage` - Affiche l'accueil
- `RegistrationPage` - Formulaire
- `AdminPage` - Gestion admin
- `GamePage` - Jeu
- `GameCard` - Carte individuelle

### Controller (main.dart)
- Gère la navigation
- Gère l'état global
- Coordonne les pages

## Cycles de Vie des Widgets

### HomePage
```
HomePage (Stateless)
  └── Build UI statique
```

### RegistrationPage
```
RegistrationPage (Stateful)
  └── initState: Initialiser contrôleurs
      └── build: Afficher formulaire
      └── Utilisateur tape/soumet
      └── dispose: Nettoyer contrôleurs
```

### GameCard
```
GameCard (Stateful)
  └── initState: Créer animation controller
      └── build: Afficher carte
      └── didUpdateWidget: Vérifier si révélée
      └── dispose: Nettoyer animation controller
```

## Taille et Complexité

| Fichier | Lignes | Widgets | Animations | Complexité |
|---------|--------|---------|------------|-----------|
| main.dart | 64 | 3 | 0 | Basse |
| models.dart | 170 | 0 | 0 | Basse |
| home_page.dart | 157 | 8+ | 0 | Basse |
| registration_page.dart | 145 | 5+ | 0 | Basse |
| admin_page.dart | 215 | 6+ | 0 | Moyenne |
| game_page.dart | 280 | 3+ | 2 | Haute |
| **TOTAL** | **~1031** | **25+** | **2** | **Moyenne** |

## Guide de Modification

### Ajouter une nouvelle page
1. Créer `lib/pages/my_page.dart`
2. Importer `models.dart` et `Flutter`
3. Ajouter route dans `main.dart`
4. Ajouter bouton de navigation dans une page existante

### Ajouter une nouvelle animation
1. Créer `AnimationController` dans `initState()`
2. Créer `Animation` avec `Tween`
3. Utiliser `AnimatedBuilder` ou `Transition` pour appliquer
4. Disposer le contrôleur dans `dispose()`

### Modifier l'état
1. Éditer la classe correspondante dans `models.dart`
2. Ajouter `setState(() { ... })` dans les pages affectées
3. Passer les callbacks `onStateChanged` si global

## Performances

### Optimisations actuelles
- ✓ Widgets stateless où possible
- ✓ `const` constructors
- ✓ Animation controllers bien disposés
- ✓ GridView pour liste efficace

### Améliorations possibles
- Ajouter une cache pour les images
- Utiliser `RepaintBoundary` pour le rendering
- Implémenter une pagination
- Ajouter des tests unitaires

---

Pour une vue rapide de la structure:
```bash
cd gestion_projet
find lib -name "*.dart" | head -20
```
