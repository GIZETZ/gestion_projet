# Routes de Navigation

## Vue d'ensemble des routes

```
/                 → Page d'accueil (HomePage)
/ithiel           → Page d'administration (AdminPage)
(Gameplay)        → Page de jeu (GamePage)
```

## Détail des Routes

### 1. Route `/` - Page d'Accueil
**Accessibilité**: Publique
**Composant**: `HomePage`
**Actions**:
- Affiche un aperçu du statut du jeu
- Affiche le nombre d'inscriptions en attente et approuvées
- Bouton "S'inscrire" → Navigation vers `RegistrationPage`
- Bouton "Accès Admin" → Navigation vers `/ithiel`

### 2. Route `/ithiel` - Administration
**Accessibilité**: Publique (pas d'authentification actuellement)
**Composant**: `AdminPage`
**Prérequis**:
- Accessible sans restriction (vous pouvez ajouter une authentification)

**Actions**:
- Affiche la liste des inscriptions en attente
- Boutons "Approuver" et "Refuser" pour chaque inscription
- Affiche les groupes approuvés
- Bouton "Démarrer le jeu" (visible seulement si 6+ groupes approuvés)

**Comportement au démarrage**:
1. Initialise les 6 cartes avec sujets aléatoires
2. Redirige vers `/` (GamePage)
3. Bascule `_gameStarted = true`

### 3. Route de Jeu - Page de Jeu
**Accessibilité**: Après démarrage du jeu par l'admin
**Composant**: `GamePage`
**Affichage**:
- Grille 2x3 de 6 cartes
- Cartes avec lettres (A-F) au verso
- Sujets avec noms des groupes au recto

**Interactions**:
- Tap sur une carte → Retournement avec animation
- Sélection unique par carte

## Navigation Programmatique

### Depuis HomePage
```dart
// Vers la page d'inscription
Navigator.of(context).push(
  MaterialPageRoute(builder: (context) => RegistrationPage(...))
);

// Vers l'admin
Navigator.of(context).pushNamed('/ithiel');
```

### Depuis RegistrationPage
```dart
// Retour à l'accueil
Navigator.of(context).pop();
```

### Depuis AdminPage
```dart
// Au démarrage du jeu
Navigator.of(context).pushNamedAndRemoveUntil('/', (route) => false);
```

## Structure de Navigation

```
MyApp (root)
├── HomePage (/)
│   ├── RegistrationPage (push)
│   └── → /ithiel (named)
│
├── AdminPage (/ithiel)
│   └── → / (pushNamedAndRemoveUntil au démarrage)
│
└── GamePage (après démarrage du jeu)
    └── → / (après jeu)
```

## Gestion d'État Globale

L'application utilise `_MyAppState` pour gérer:
- `_gameState` : État du jeu (inscriptions, cartes, groupes)
- `_gameStarted` : Indicateur du jeu commencé
- `_onStateChanged()` : Callback pour les mises à jour UI

## Sécurité des Routes

⚠️ **Note**: Actuellement, la route `/ithiel` est publique. Pour la sécuriser:

```dart
// Ajouter une authentification
bool _isAdmin = false;

// Vérifier avant d'accéder à /ithiel
if (!_isAdmin) {
  showDialog(context: context, builder: (_) => AlertDialog(...));
  return;
}
```

## Transitions Personnalisées

Vous pouvez ajouter des transitions personnalisées:

```dart
Navigator.of(context).push(
  PageRouteBuilder(
    pageBuilder: (_, __, ___) => RegistrationPage(...),
    transitionsBuilder: (_, animation, __, child) {
      return FadeTransition(opacity: animation, child: child);
    },
  ),
);
```

## Points d'Extension Futurs

1. **Authentification** : Protéger `/ithiel` avec un code PIN ou mot de passe
2. **Persistance** : Sauvegarder les inscriptions dans une base de données
3. **Notifications** : Notifier les groupes quand le jeu commence
4. **Partage** : Permettre le partage de résultats
5. **Historique** : Garder un historique des jeux passés

---

Pour modifier le comportement de la navigation, éditez:
- Routes nommées : [lib/main.dart](lib/main.dart) ligne 45
- Navigation push : Chaque page
- Transitions : `PageRouteBuilder` dans les navigations
