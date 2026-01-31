# Topic Randomizer - Guide de Déploiement

## 🚀 Déploiement sur Render

### Prérequis
- Compte GitHub
- Compte Render (gratuit)

### Étapes de déploiement

1. **Pousser le code sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/Topic-Randomizer.git
   git push -u origin main
   ```

2. **Se connecter à Render**
   - Allez sur https://render.com
   - Cliquez sur "New" → "Web Service"
   - Sélectionnez votre dépôt GitHub

3. **Configurer le service**
   - **Name**: topic-randomizer
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Plan**: Free

4. **Variables d'environnement**
   - `NODE_ENV`: production
   - `PORT`: 10000
   - `SESSION_SECRET`: Générez une clé aléatoire sécurisée

5. **Déployer**
   - Cliquez sur "Create Web Service"
   - Render déploiera automatiquement à chaque push sur `main`

### URL de production
Votre application sera accessible à: `https://topic-randomizer.onrender.com`

## 🌐 Déploiement sur Netlify (Frontend uniquement)

Si vous voulez héberger le frontend sur Netlify et le backend sur Render:

1. **Construire le frontend**
   ```bash
   npm run build
   ```

2. **Déployer sur Netlify**
   - Connectez votre repo GitHub à Netlify
   - Build command: `npm run build`
   - Publish directory: `client/dist`

3. **Configurer les variables d'environnement**
   - `VITE_API_URL`: https://topic-randomizer.onrender.com (votre URL Render)

## 📝 Variables d'environnement requises

Créez un fichier `.env` basé sur `.env.example`:

```env
NODE_ENV=production
PORT=10000
SESSION_SECRET=your-secure-random-key
```

## ✅ Vérification post-déploiement

1. Accédez à l'URL de votre application
2. Testez l'enregistrement d'un utilisateur
3. Vérifiez que le jeu peut être lancé par l'admin
4. Testez le téléchargement du rapport PDF
5. Vérifiez les mises à jour en temps réel avec socket.io

## 🐛 Dépannage

### Erreur: "Cannot connect to server"
- Vérifiez que la variable `PORT` est définie à 10000 sur Render
- Vérifiez que le backend est en ligne sur Render

### PDF ne se télécharge pas
- Assurez-vous que pdfkit est installé: `npm install pdfkit`
- Vérifiez les logs du serveur pour les erreurs

### Socket.io ne se connecte pas
- Assurez-vous que socket.io-client est installé côté client
- Vérifiez que le serveur émet les événements correctement

## 📚 Ressources utiles

- [Documentation Render](https://render.com/docs)
- [Documentation Netlify](https://docs.netlify.com)
- [Socket.io Documentation](https://socket.io/docs/)
