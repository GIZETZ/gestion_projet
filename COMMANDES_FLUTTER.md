# 🖥️ COMMANDES FLUTTER UTILES

## 🚀 Lancement et Exécution

### Lancer l'application (mode debug)
```bash
flutter run
```

### Lancer sur un appareil/émulateur spécifique
```bash
flutter run -d device_name
```

### Lancer en mode release (optimisé)
```bash
flutter run --release
```

### Lancer en mode profile (pour mesurer performance)
```bash
flutter run --profile
```

### Garder l'app ouverte (mode watch)
```bash
flutter run --keep-app-running
```

## 📦 Gestion des Dépendances

### Télécharger/installer les dépendances
```bash
flutter pub get
```

### Mettre à jour les dépendances
```bash
flutter pub upgrade
```

### Ajouter un package
```bash
flutter pub add package_name
```

### Supprimer un package
```bash
flutter pub remove package_name
```

### Voir les packages obsolètes
```bash
flutter pub outdated
```

## 🔍 Diagnostic et Vérification

### Vérifier la configuration Flutter
```bash
flutter doctor
```

### Vérifier les appareils disponibles
```bash
flutter devices
```

### Voir plus de détails sur doctor
```bash
flutter doctor -v
```

### Voir la version de Flutter
```bash
flutter --version
```

### Analyser le code (linting)
```bash
flutter analyze
```

## 🔄 Hot Reload et Hot Restart

### Hot Reload (recharge le code, garde l'état)
Appuyez sur **R** dans le terminal

### Hot Restart (recharge tout, réinitialise l'état)
Appuyez sur **Shift+R** dans le terminal

### Full Restart depuis la ligne de commande
```bash
flutter run --full-restart
```

## 🧹 Nettoyage et Reconfiguration

### Nettoyer les fichiers générés
```bash
flutter clean
```

### Nettoyer et réinstaller
```bash
flutter clean && flutter pub get
```

### Nettoyer et relancer
```bash
flutter clean && flutter pub get && flutter run
```

### Réinitialiser les fichiers iOS
```bash
flutter clean
cd ios
rm -rf Pods Podfile.lock
cd ..
flutter pub get
```

### Réinitialiser Android
```bash
flutter clean
cd android
./gradlew clean
cd ..
flutter pub get
```

## 📱 Gestion des Émulateurs

### Lister les émulateurs disponibles
```bash
flutter emulators
```

### Lancer un émulateur
```bash
flutter emulators launch emulator_name
```

### Créer un nouvel émulateur Android
```bash
flutter emulators create --name my_emulator
```

## 🌐 Web et Plateforme Spécifique

### Lancer sur le web
```bash
flutter run -d chrome
```

### Lancer sur Firefox
```bash
flutter run -d firefox
```

### Lancer sur Windows
```bash
flutter run -d windows
```

### Lancer sur Linux
```bash
flutter run -d linux
```

### Lancer sur macOS
```bash
flutter run -d macos
```

## 🛠️ Build et Compilation

### Builder pour Android (APK)
```bash
flutter build apk
```

### Builder pour Android (AAB - pour Play Store)
```bash
flutter build appbundle
```

### Builder pour iOS
```bash
flutter build ios
```

### Builder pour web
```bash
flutter build web
```

### Builder pour Windows
```bash
flutter build windows
```

### Builder pour Linux
```bash
flutter build linux
```

### Builder pour macOS
```bash
flutter build macos
```

## 🧪 Tests

### Lancer les tests
```bash
flutter test
```

### Lancer les tests en watch mode
```bash
flutter test --watch
```

### Voir la couverture de code
```bash
flutter test --coverage
```

## 📊 Déboguer et Analyser

### Ouvrir DevTools
```bash
flutter pub global activate devtools
devtools
```

### Voir les logs en temps réel
```bash
flutter logs
```

### Voir les logs avec filtre
```bash
flutter logs --grep "MyApp"
```

### Analyser les performances
```bash
flutter run --profile
# Puis cliquez sur 'P' pour toggle debug painting
```

## 🎨 Génération de Code

### Générer les locales (i18n)
```bash
flutter pub global activate intl_utils
```

### Générer des assets
```bash
flutter pub global activate fluttergen
fluttergen -c pubspec.yaml
```

## 📝 Format et Lint

### Formater le code Dart
```bash
dart format lib/
```

### Formater un fichier spécifique
```bash
dart format lib/main.dart
```

### Vérifier le code avec linting
```bash
dart analyze
```

### Fixer automatiquement les problèmes de lint
```bash
dart fix --apply
```

## 🚀 Déploiement

### Android - Préparer pour Play Store
```bash
flutter build appbundle --release
```

### iOS - Préparer pour App Store
```bash
flutter build ios --release
```

### Web - Préparer pour production
```bash
flutter build web --web-renderer html
```

## 💡 Commandes Avancées

### Voir les stats du projet
```bash
dart pub global activate codepoint_analyzer
```

### Profiler la mémoire
```bash
flutter run --profile
# Puis utilisez DevTools pour analyser
```

### Exécuter avec arguments personnalisés
```bash
flutter run --dart-define=VAR=value
```

### Activer des flags expérimentaux
```bash
flutter run --enable-software-rendering
```

## 🔐 Authentification et Clés

### Générer une clé pour Android
```bash
keytool -genkey -v -keystore ~/key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias key
```

### Signer l'APK Android
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/key.jks app-unsigned.apk key
```

## 📚 Documentation et Aide

### Voir toutes les commandes disponibles
```bash
flutter help
```

### Voir l'aide pour une commande spécifique
```bash
flutter help run
flutter help build
flutter help test
```

### Ouvrir la documentation officielle
```bash
flutter help --version  # Voir la version
```

## 🎯 Commandes Recommandées au Quotidien

### Pour développer
```bash
flutter run          # Lancer l'app
# Appuyez sur R pour hot reload
# Appuyez sur Shift+R pour hot restart
# Appuyez sur P pour debug painting
```

### Pour déboguer
```bash
flutter run --profile
flutter logs
```

### Avant de commiter
```bash
flutter analyze
dart format lib/
flutter test
```

### Avant de déployer
```bash
flutter clean
flutter pub get
flutter test
flutter build [appbundle|ios|web] --release
```

## 📋 Checklist de Développement

```bash
# 1. Cloner/ouvrir le projet
cd mon_projet

# 2. Installer les dépendances
flutter pub get

# 3. Vérifier la config
flutter doctor

# 4. Développer
flutter run
# Modifier le code...
# Appuyer sur R pour recharger

# 5. Avant de commit
flutter analyze
dart format lib/

# 6. Avant de déployer
flutter clean
flutter pub get
flutter test
flutter build appbundle --release
```

## 🆘 Dépannage Rapide

### L'app ne se lance pas
```bash
flutter clean
flutter pub get
flutter run
```

### Erreur de dépendance
```bash
flutter pub get
flutter pub upgrade
```

### Erreur de build
```bash
flutter clean
cd ios && rm -rf Pods Podfile.lock && cd ..
flutter pub get
flutter run
```

### Performance mauvaise
```bash
flutter run --release
```

### Besoin d'une version spécifique de Flutter
```bash
flutter channel stable
flutter upgrade
flutter pub get
```

---

**Astuce**: Créez des alias pour les commandes courantes!

```bash
alias fr='flutter run'
alias fc='flutter clean && flutter pub get && flutter run'
alias fa='flutter analyze && dart format lib/'
```

**Bon développement! 💻**
