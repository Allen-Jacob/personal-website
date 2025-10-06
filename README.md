# 🔗 Linktree Personnel - Jacob Allen

Site web Linktree épuré avec fond spatial noir, analytics MongoDB et page admin protégée.

## ✨ Fonctionnalités

- 🎨 **Design minimaliste** avec fond spatial noir et étoiles animées
- 📊 **Analytics centralisés** avec MongoDB - tracking multi-appareils
- 🔐 **Page admin protégée** par mot de passe avec statistiques détaillées
- 📱 **100% Responsive** - fonctionne sur tous les appareils
- 🚀 **Déploiement facile** avec Docker (Frontend + API + Nginx)
- ⚡ **Performances optimisées** - un seul conteneur pour tout

## 📁 Structure du projet

```
Linktree/
├── index.html              # Page principale
├── admin.html              # Page d'administration (protégée)
├── styles.css              # Styles du site
├── admin-styles.css        # Styles de l'admin
├── script.js               # Tracking des clics
├── admin-script.js         # Dashboard analytics
├── env.js                  # Config (mot de passe admin + API URL)
├── env.example.js          # Template de configuration
├── img/                    # Images (avatar, etc.)
│   └── avatar.jpg
├── api/                    # API Node.js + MongoDB
│   ├── server.js           # Serveur Express
│   ├── package.json        # Dépendances
│   ├── .env                # Config MongoDB
│   └── .env.example        # Template
├── Dockerfile              # Conteneur combiné (Nginx + Node.js)
├── .dockerignore           # Fichiers exclus
└── .gitignore              # Fichiers non versionnés

```

## 🚀 Déploiement avec Dokploy

### 1. Créer deux applications dans Dokploy

**Application 1 : Linktree (Frontend + API)**
- Type : Docker
- Build from : Git ou dossier
- Dockerfile : `./Dockerfile` (déjà configuré)
- Port : 80
- Variables d'environnement :
  ```env
  MONGODB_URI=mongodb://[URL-MONGODB-DOKPLOY]:27017/linktree-analytics
  ALLOWED_ORIGINS=https://link.jacoballen.ca
  ```

**Application 2 : MongoDB**
- Type : MongoDB (template intégré Dokploy)
- Pas de configuration spéciale nécessaire
- Dokploy vous donnera l'URL de connexion

### 2. Configuration

1. **Mettre à jour `env.js`** :
   ```javascript
   window.ENV = {
       ADMIN_PASSWORD: 'votre-mot-de-passe-securise',
       API_URL: '/api'
   };
   ```

2. **Pousser sur Git** et déployer via Dokploy

3. **Accéder à l'admin** : `https://link.jacoballen.ca/admin.html`

## 🛠️ Personnalisation

### 1. Modifier les liens

Dans [index.html](index.html), section `<div class="links-container">` :

```html
<a href="https://votre-site.com" class="link-button" target="_blank">
    <i class="fas fa-globe"></i>
    <span>Mon Site</span>
</a>
```

### 2. Changer le mot de passe admin

Dans [env.js](env.js) :
```javascript
window.ENV = {
    ADMIN_PASSWORD: 'nouveau-mot-de-passe-super-securise',
    API_URL: '/api'
};
```

### 3. Modifier les réseaux sociaux

Dans [index.html](index.html), section `<div class="social-links">` :

```html
<a href="https://github.com/votre-username" class="social-icon" aria-label="GitHub">
    <i class="fab fa-github"></i>
</a>
```

### 4. Changer l'avatar

Remplacez `img/avatar.jpg` par votre propre image.

## 📊 Page Admin

- **URL** : `/admin.html`
- **Mot de passe** : Défini dans `env.js`
- **Fonctionnalités** :
  - Total de clics en temps réel
  - Statistiques par lien
  - Pourcentages et graphiques
  - Réinitialisation des stats
  - Auto-refresh toutes les 5 secondes

## 🔧 API Endpoints

L'API est disponible sur `/api` :

- `GET /api/health` - Health check
- `POST /api/clicks` - Enregistrer un clic
- `GET /api/stats` - Obtenir toutes les statistiques
- `GET /api/stats/:linkName` - Stats d'un lien spécifique
- `DELETE /api/stats` - Réinitialiser (confirmation requise)

## 🧪 Test en local

```bash
# Build l'image
docker build -t linktree-test .

# Lancer MongoDB
docker run -d --name mongo-test -p 27017:27017 mongo:7-jammy

# Lancer le site
docker run -d -p 8080:80 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/linktree-analytics \
  --name linktree-test \
  linktree-test

# Accéder au site
# Frontend: http://localhost:8080
# Admin: http://localhost:8080/admin.html
```

## 🔐 Sécurité

- ✅ Mot de passe admin stocké dans `env.js` (gitignored)
- ✅ CORS configuré pour votre domaine uniquement
- ✅ Validation des données côté serveur
- ✅ Headers de sécurité Nginx
- ⚠️ **Important** : Ne commitez JAMAIS `env.js` dans Git !

## 📦 Technologies

**Frontend:**
- HTML5, CSS3, JavaScript
- Font Awesome 6
- Google Fonts (Inter)

**Backend:**
- Node.js 20
- Express.js
- MongoDB (Mongoose)
- Nginx Alpine

**Infrastructure:**
- Docker (multi-stage build)
- Dokploy (déploiement)

## 🐛 Dépannage

**Les stats ne s'enregistrent pas :**
- Vérifiez que `MONGODB_URI` est correctement configuré
- Vérifiez les logs : `docker logs [nom-conteneur]`

**Page admin inaccessible :**
- Vérifiez le mot de passe dans `env.js`
- Le fichier `env.js` doit être copié dans le conteneur

**API ne répond pas :**
- Vérifiez que le port 3000 est accessible en interne
- Nginx doit proxy `/api/` vers `http://localhost:3000/api/`

## 📝 Licence

Libre d'utilisation. Personnalisez à votre guise !

## 🤝 Support

Pour toute question ou suggestion :
- 🌐 Site : https://jacoballen.ca
- 📧 Email : contact@jacoballen.ca

---

**Créé avec ❤️ par Jacob Allen**
