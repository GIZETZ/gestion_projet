# Guide des Animations

## Vue d'ensemble

L'application comprend plusieurs animations fluides pour améliorer l'expérience utilisateur:

| Animation | Durée | Courbe | Effet |
|-----------|-------|--------|-------|
| Flip Card | 600ms | easeInOut | Retournement 3D |
| Success | 800ms | elasticOut | Rebond élastique |
| Background | Continue | - | Gradient fluide |

## Animation 1: Card Flip (Retournement de Carte)

### Localisation
`lib/pages/game_page.dart` → Classe `GameCard`

### Description
Crée un effet de retournement 3D quand une carte est sélectionnée.

### Code
```dart
late AnimationController _flipController;
late Animation<double> _flipAnimation;

@override
void initState() {
  super.initState();
  _flipController = AnimationController(
    duration: const Duration(milliseconds: 600),
    vsync: this,
  );

  _flipAnimation = Tween<double>(begin: 0, end: 1).animate(
    CurvedAnimation(parent: _flipController, curve: Curves.easeInOut),
  );
}
```

### Déclenchement
```dart
if (widget.isRevealed && !oldWidget.isRevealed) {
  _flipController.forward();
}
```

### Visualisation
```
Verso (angle=0)
    ↓
Retournement 3D (angle=0 à π)
    ↓
Recto (angle=π)
```

### Personnalisation
- **Durée** : Modifier `Duration(milliseconds: 600)`
- **Courbe** : Changer `Curves.easeInOut` (voir les options ci-dessous)
- **Direction** : Inverser avec `_flipController.reverse()`

## Animation 2: Success Bounce (Rebond de Succès)

### Localisation
`lib/pages/game_page.dart` → Classe `_GamePageState`

### Description
Crée un effet élastique quand une carte est sélectionnée avec succès.

### Code
```dart
_successAnimationController = AnimationController(
  duration: const Duration(milliseconds: 800),
  vsync: this,
);

_successAnimation = Tween<double>(begin: 0, end: 1).animate(
  CurvedAnimation(parent: _successAnimationController, curve: Curves.elasticOut),
);
```

### Déclenchement
```dart
_successAnimationController.forward().then((_) {
  _successAnimationController.reverse();
});
```

### Effet Visuel
```dart
ScaleTransition(
  scale: isSelected ? _successAnimation : AlwaysStoppedAnimation(1.0),
  child: GameCard(...),
)
```

- **Scale 0** : Carte à sa taille normale
- **Scale 1** : Carte agrandie avec effet élastique
- **Scale 0** : Retour à la taille normale

### Personnalisation
- **Durée** : Modifier `Duration(milliseconds: 800)`
- **Courbe** : Essayer `Curves.elasticIn`, `Curves.bounceOut`, etc.
- **Amplitude** : Modifier le `Tween<double>(begin: 0, end: 1)` pour plus/moins de rebond

## Courbes d'Animation Disponibles

```dart
// Courbes lineaires
Curves.linear              // Constant speed

// Courbes d'entrée (slow start)
Curves.easeIn             // Commence lent
Curves.easeInCirc         // Circulaire
Curves.easeInCubic        // Cubique

// Courbes de sortie (slow end)
Curves.easeOut            // Finit lent
Curves.easeOutCirc        // Circulaire
Curves.easeOutBounce      // Rebond final

// Courbes élastiques
Curves.elasticIn          // Entrée élastique
Curves.elasticOut         // Sortie élastique
Curves.elasticInOut       // Élastique bidirectionnel

// Autres courbes
Curves.bounceIn           // Rebond d'entrée
Curves.bounceOut          // Rebond de sortie
Curves.fastOutSlowIn      // Animation douce
```

## Animation 3: Background Gradient

### Localisation
`lib/pages/game_page.dart` → Container de GamePage

### Description
Crée un dégradé fluide comme arrière-plan.

### Code
```dart
Container(
  decoration: BoxDecoration(
    gradient: LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [
        Colors.deepPurple.shade50,
        Colors.blue.shade50,
      ],
    ),
  ),
)
```

### Personnalisation
- **Direction** : Changer `begin` et `end`
- **Couleurs** : Modifier la liste `colors`
- **Animation** : Ajouter une `AnimatedBuilder` pour animer

## Exemple: Ajouter une Animation Personnalisée

### Objectif
Ajouter une rotation continue aux cartes non-révélées.

### Code à Ajouter
```dart
// Dans GameCard
@override
void initState() {
  super.initState();
  // ... autre code ...
  
  _rotationController = AnimationController(
    duration: const Duration(seconds: 2),
    vsync: this,
  )..repeat();
  
  _rotationAnimation = Tween<double>(begin: 0, end: 6.28).animate(
    _rotationController,
  );
}

// Dans le build
Transform.rotate(
  angle: !widget.isRevealed ? _rotationAnimation.value : 0,
  child: _buildHiddenCard(),
)
```

## Optimisation des Performances

### 1. Utiliser `SingleTickerProviderStateMixin`
```dart
class GameCard extends StatefulWidget {
  @override
  State<GameCard> createState() => _GameCardState();
}

class _GameCardState extends State<GameCard> 
    with SingleTickerProviderStateMixin { // ← Important!
  // ...
}
```

### 2. Disposer correctement des contrôleurs
```dart
@override
void dispose() {
  _flipController.dispose();
  super.dispose();
}
```

### 3. Éviter les rebuilds inutiles
```dart
// ✓ Bon - Utiliser `const`
const SizedBox(height: 16)

// ✗ Mauvais
SizedBox(height: 16)
```

## Tester les Animations

### Mode Debug
```bash
flutter run
```

### Mode Performance
```bash
flutter run --profile
```

### Hot Reload pour Tester Rapidement
1. Faites vos modifications d'animation
2. Appuyez sur `R` pour hot reload
3. Observez les changements en temps réel

## Déboguer les Animations

### Afficher les frontières
```bash
flutter run
# Appuyez sur 'P' pour Show/Hide debug paint
```

### Ralentir les animations (mode debug)
```dart
// Dans main() ou initState()
timeDilation = 5.0; // Ralentir 5x
// timeDilation = 1.0; // Normal
```

### Vérifier les FPS
```bash
flutter run
# Appuyez sur 'L' pour afficher les statistiques
```

## Ressources

- [Flutter Animation API](https://flutter.dev/docs/development/ui/animations)
- [Curves Class](https://api.flutter.dev/flutter/animation/Curves-class.html)
- [AnimationController](https://api.flutter.dev/flutter/animation/AnimationController-class.html)

## Points d'Extension Futurs

1. **Animations Parallèles** : Animer plusieurs propriétés ensemble
2. **Animations Staggered** : Animer les cartes une par une
3. **Lottie Animations** : Intégrer des animations complexes
4. **Sound Effects** : Ajouter des effets sonores aux animations

---

Pour éditer les animations:
- Flip : [lib/pages/game_page.dart](lib/pages/game_page.dart#L250)
- Success : [lib/pages/game_page.dart](lib/pages/game_page.dart#L50)
- Background : [lib/pages/game_page.dart](lib/pages/game_page.dart#L85)
