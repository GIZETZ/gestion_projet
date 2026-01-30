# Guide de Personnalisation

## Personnalisation Facile

### 1. Ajouter un Logo/Header Image

#### Dans `home_page.dart`
```dart
// Après le titre
Image.asset(
  'assets/logo.png',
  height: 100,
),
SizedBox(height: 16),
```

**Puis créer le dossier** `assets/` et placer votre image.

**Mettre à jour** `pubspec.yaml`:
```yaml
flutter:
  assets:
    - assets/logo.png
```

### 2. Changer les Couleurs Principales

#### Avant
```dart
backgroundColor: Colors.deepPurple,
colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
```

#### Après
```dart
backgroundColor: Colors.teal,
colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
```

### 3. Ajouter du Texte Personnalisé

#### Dans `home_page.dart` - Avant le titre
```dart
const Text(
  'Bienvenue à la sélection des sujets!',
  style: TextStyle(
    fontSize: 12,
    color: Colors.grey,
    fontStyle: FontStyle.italic,
  ),
),
SizedBox(height: 12),
```

### 4. Modifier les Sujets

#### Dans `models.dart`
```dart
subjects = [
  'Votre sujet 1',
  'Votre sujet 2',
  'Votre sujet 3',
  'Votre sujet 4',
  'Votre sujet 5',
  'Votre sujet 6',
];
```

**Important**: Garder exactement 6 sujets!

### 5. Changer la Durée des Animations

#### Animation de Flip - Dans `game_page.dart`
```dart
// Avant (600ms)
_flipController = AnimationController(
  duration: const Duration(milliseconds: 600), // ← Changer ici
  vsync: this,
);

// Après (1000ms)
_flipController = AnimationController(
  duration: const Duration(milliseconds: 1000),
  vsync: this,
);
```

#### Animation de Succès - Dans `game_page.dart`
```dart
// Avant (800ms)
_successAnimationController = AnimationController(
  duration: const Duration(milliseconds: 800), // ← Changer ici
  vsync: this,
);

// Après (1200ms)
_successAnimationController = AnimationController(
  duration: const Duration(milliseconds: 1200),
  vsync: this,
);
```

## Personnalisations Avancées

### 6. Ajouter une Validation Email

#### Dans `registration_page.dart`
```dart
TextFormField(
  controller: _emailController,  // Ajouter ce contrôleur
  decoration: InputDecoration(
    labelText: 'Email du groupe',
    hintText: 'exemple@ecole.fr',
    prefixIcon: const Icon(Icons.email),
    // ...
  ),
  validator: (value) {
    if (value == null || value.isEmpty) {
      return 'Email requis';
    }
    // Vérifier format email
    if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
      return 'Email invalide';
    }
    return null;
  },
),
```

**Et dans initState**:
```dart
final _emailController = TextEditingController();

@override
void dispose() {
  _emailController.dispose();  // Ajouter
  // ... reste du dispose
}
```

### 7. Ajouter une Authentification Admin

#### Dans `main.dart`
```dart
// Ajouter une variable
String _adminPin = '1234';
bool _isAdminAuthenticated = false;

// Modifier la route /ithiel
routes: {
  '/ithiel': (context) => _isAdminAuthenticated
      ? AdminPage(...)
      : AdminLoginPage(onSuccess: () {
        setState(() => _isAdminAuthenticated = true);
      }),
},
```

#### Créer `admin_login_page.dart`
```dart
import 'package:flutter/material.dart';

class AdminLoginPage extends StatefulWidget {
  final VoidCallback onSuccess;
  
  const AdminLoginPage({required this.onSuccess});

  @override
  State<AdminLoginPage> createState() => _AdminLoginPageState();
}

class _AdminLoginPageState extends State<AdminLoginPage> {
  final _pinController = TextEditingController();
  final _correctPin = '1234';

  @override
  void dispose() {
    _pinController.dispose();
    super.dispose();
  }

  void _checkPin() {
    if (_pinController.text == _correctPin) {
      widget.onSuccess();
      Navigator.of(context).pop();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('PIN incorrect')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Login'),
        backgroundColor: Colors.red.shade700,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Entrez le PIN administrateur',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24),
            TextField(
              controller: _pinController,
              obscureText: true,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                labelText: 'PIN',
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _checkPin,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red.shade700,
                padding: const EdgeInsets.symmetric(
                  horizontal: 40,
                  vertical: 16,
                ),
              ),
              child: const Text('Valider'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### 8. Ajouter Effets Sonores

#### Installer la dépendance
```bash
flutter pub add audioplayers
```

#### Utiliser dans `game_page.dart`
```dart
import 'package:audioplayers/audioplayers.dart';

class _GamePageState extends State<GamePage> {
  late AudioPlayer _audioPlayer;

  @override
  void initState() {
    super.initState();
    _audioPlayer = AudioPlayer();
  }

  @override
  void dispose() {
    _audioPlayer.dispose();
    super.dispose();
  }

  void _selectCard(int index) {
    // ... code existant ...
    
    // Jouer un son
    _audioPlayer.play(AssetSource('sounds/card_flip.mp3'));
  }
}
```

### 9. Ajouter une Base de Données

#### Installer Firebase
```bash
flutter pub add firebase_core firebase_firestore
```

#### Initialiser dans `main.dart`
```dart
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}
```

#### Sauvegarder dans Firestore
```dart
// Dans AdminPage - Après approbation
Future<void> _saveToFirestore(GroupRegistration registration) async {
  final firestore = FirebaseFirestore.instance;
  await firestore.collection('groups').doc(registration.id).set({
    'name': registration.groupName,
    'leader': registration.leaderName,
    'approved': registration.isApproved,
    'timestamp': FieldValue.serverTimestamp(),
  });
}
```

### 10. Ajouter des Statistiques/Graphiques

#### Installer Charts
```bash
flutter pub add fl_chart
```

#### Utiliser dans une nouvelle page
```dart
import 'package:fl_chart/fl_chart.dart';

BarChart(
  BarChartData(
    barGroups: [
      BarChartGroupData(
        x: 0,
        barRods: [BarChartRodData(toY: 5)], // Groupes approuvés
      ),
    ],
  ),
)
```

## Thèmes Prédéfinis

### Thème Sombre
```dart
// Dans main.dart
theme: ThemeData.dark().copyWith(
  colorScheme: ColorScheme.fromSeed(
    seedColor: Colors.blue,
    brightness: Brightness.dark,
  ),
),
```

### Thème Personnalisé Complet
```dart
theme: ThemeData(
  colorScheme: ColorScheme.fromSeed(
    seedColor: Colors.deepPurple,
    brightness: Brightness.light,
  ),
  useMaterial3: true,
  // Personnalisations supplémentaires
  appBarTheme: AppBarTheme(
    backgroundColor: Colors.deepPurple.shade700,
    foregroundColor: Colors.white,
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: Colors.deepPurple,
      foregroundColor: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    ),
  ),
),
```

## Responsabilité

### Adapter pour Mobile
```dart
// En haut du widget
final isMobile = MediaQuery.of(context).size.width < 600;

// Utiliser dans le build
gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
  crossAxisCount: isMobile ? 2 : 3,
  // ...
),
```

### Adapter pour Tablet
```dart
final isTablet = MediaQuery.of(context).size.width > 600 &&
                 MediaQuery.of(context).size.width < 1200;
```

## Internationalisation (i18n)

### Installer intl
```bash
flutter pub add intl flutter_localizations
```

### Créer des fichiers de traduction
```yaml
# pubspec.yaml
flutter:
  generate: true

flutter_intl:
  enabled: true
```

### Utiliser dans les widgets
```dart
Text(AppLocalizations.of(context)!.welcome)
```

## Tips & Tricks

### 1. Déboguer l'UI
```dart
// Ajouter des bordures temporaires
Container(
  decoration: BoxDecoration(
    border: Border.all(color: Colors.red),
  ),
)
```

### 2. Accélérer le développement
```bash
flutter run --fast-start
```

### 3. Générer des assets
```bash
# Ajouter des couleurs/icons rapidement
flutter pub global activate fluttergen
fluttergen -c pubspec.yaml
```

### 4. Performance
```dart
// Utiliser RepaintBoundary pour des animations complexes
RepaintBoundary(
  child: AnimatedWidget(...),
)
```

## Ressources Utiles

- [Flutter Pub](https://pub.dev/) - Packages disponibles
- [Material Design](https://material.io/) - Couleurs et composants
- [Flutter Docs](https://flutter.dev/docs) - Documentation officielle
- [Dartpad](https://dartpad.dev/) - Tester du code rapidement

---

**Conseil**: Testez toujours les modifications avec `flutter run` pour voir les changements en temps réel!
