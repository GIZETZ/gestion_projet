# 🚀 DÉMARRAGE RAPIDE (2 minutes)

## Étape 1️⃣ : Vérifier Flutter (30 secondes)

```bash
flutter --version
```

Vous devez voir: `Flutter 3.38.5` ou supérieur

## Étape 2️⃣ : Aller au projet (10 secondes)

```bash
cd c:\Users\jxk\Documents\gestion_projet
```

## Étape 3️⃣ : Installer les dépendances (20 secondes)

```bash
flutter pub get
```

## Étape 4️⃣ : Lancer l'app! (30 secondes)

```bash
flutter run
```

Choisissez votre appareil/émulateur et c'est parti! 🎉

---

## 📖 Les 3 Rôles

### 👨‍🎓 Chef de Groupe
1. Ouvre l'app
2. Clique "S'inscrire comme chef de groupe"
3. Remplit nom et groupe
4. Attend l'approbation
5. Sélectionne une lettre (A-F)

### 👨‍💼 Administrateur
1. Ouvre l'app
2. Clique "Accès administrateur"
3. Approuve les 6 groupes
4. Clique "Démarrer le jeu"

### 🎮 Joueur/Observateur
- Voit les cartes se retourner
- Voit quel groupe a quel sujet

---

## 🎯 3 Sujets = 3 Actions

| Action | Où | Comment |
|--------|-----|---------|
| **S'inscrire** | HomePage | Bouton "S'inscrire" |
| **Approuver** | `/ithiel` | Bouton "Approuver" |
| **Jouer** | GamePage | Taper une carte |

---

## ⚡ Commandes Utiles

```bash
# Lancer
flutter run

# Lancer et garder l'écran allumé
flutter run --keep-app-running

# Lancer en release (meilleure performance)
flutter run --release

# Nettoyer et relancer (si bugs)
flutter clean && flutter pub get && flutter run

# Vérifier la configuration
flutter doctor
```

---

## ❓ FAQ (30 secondes)

**Q: Où sont les 6 sujets?**
A: Dans `lib/models.dart`, classe `GameState`

**Q: Comment changer les couleurs?**
A: Ouvrez `lib/main.dart`, ligne ~42, changez `Colors.deepPurple`

**Q: Comment accéder à l'admin?**
A: URL/route `/ithiel` depuis HomePage

**Q: Combien de groupes max?**
A: Exactement 6 (système bloqué à 6)

**Q: Les animations sont lentes?**
A: Lancez en mode release: `flutter run --release`

---

## 🎨 Fichiers Importants

| Fichier | Modifie | Quand |
|---------|---------|--------|
| `lib/models.dart` | Sujets, données | Ajouter contenu |
| `lib/main.dart` | Routes, couleurs | Personnaliser |
| `lib/pages/home_page.dart` | Accueil | Ajouter logo |
| `lib/pages/admin_page.dart` | Admin | Ajouter auth |
| `lib/pages/game_page.dart` | Jeu, animations | Modifier gameplay |

---

## 🔧 Erreurs Courantes & Solutions

### ❌ "Target of URI doesn't exist"
```bash
flutter pub get
flutter run
```

### ❌ "Undefined class"
```bash
# Vérifier l'import
import '../models.dart';
```

### ❌ "The connection is refused"
```bash
# Redémarrer le simulateur
flutter emulators
flutter emulators launch emulator_id
```

### ❌ Animations saccadées
```bash
# Utiliser le mode release
flutter run --release
```

---

## 🎬 Scénario Complet (5 minutes)

1. **Ouvrir l'app** (30 sec)
2. **S'inscrire 6 fois** comme chef (2 min)
3. **Aller à `/ithiel`** (10 sec)
4. **Approuver les 6 groupes** (1 min)
5. **Cliquer "Démarrer"** (10 sec)
6. **Jouer!** Sélectionner les cartes (1 min)

---

## 📱 Appareil/Émulateur?

### Android Émulateur
```bash
flutter emulators
flutter emulators launch Pixel_3a_API_30
flutter run -d emulator-5554
```

### iOS Simulateur
```bash
open -a Simulator
flutter run -d ios
```

### Appareil Physique
```bash
# Activer debug USB
flutter devices
flutter run -d device_id
```

### Web (optionnel)
```bash
flutter run -d chrome
```

---

## ✅ Checklists de Test

### ✓ Inscription
- [ ] Remplir nom + groupe
- [ ] Message de succès
- [ ] Apparaît dans admin

### ✓ Admin
- [ ] Voit les 6 inscriptions
- [ ] Peut approuver
- [ ] Bouton "Démarrer" actif
- [ ] Redirige vers jeu

### ✓ Jeu
- [ ] 6 cartes affichées
- [ ] Lettres visibles
- [ ] Tap → flip
- [ ] Sujet + groupe visibles
- [ ] Animations fluides

---

## 🏁 Vous Êtes Prêts!

- ✓ Code compilé
- ✓ Pas d'erreurs
- ✓ Prêt à tester
- ✓ Prêt à déployer

**Amusez-vous! 🎉**

---

## 📚 Documentation Complète

- **RESUME_IMPLEMENTATION.md** - Aperçu complet
- **LANCEMENT_ET_GUIDE.md** - Guide détaillé
- **ROUTES_ET_NAVIGATION.md** - Navigation
- **ANIMATIONS_GUIDE.md** - Animations
- **STRUCTURE_DU_PROJET.md** - Architecture
- **GUIDE_PERSONNALISATION.md** - Modifications

---

**Besoin d'aide?** Consultez les fichiers MD correspondants! 📖
