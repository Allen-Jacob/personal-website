# 📊 Linktree Analytics API

API Node.js avec Express et MongoDB pour tracker les clics sur votre Linktree.

## 🚀 Démarrage rapide

### Avec Docker Compose (Recommandé)

```bash
# Depuis le dossier racine du projet
docker-compose up -d
```

Cela va démarrer :
- Frontend Nginx sur `http://localhost:8080`
- API sur `http://localhost:3000`
- MongoDB sur `localhost:27017`

### Sans Docker (Développement local)

1. Installer les dépendances :
```bash
cd api
npm install
```

2. Créer le fichier `.env` :
```bash
cp .env.example .env
```

3. Démarrer MongoDB localement ou utiliser MongoDB Atlas

4. Démarrer l'API :
```bash
npm start
# Ou en mode dev avec auto-reload :
npm run dev
```

## 🔧 Configuration

Variables d'environnement (fichier `.env`) :

```env
MONGODB_URI=mongodb://localhost:27017/linktree-analytics
PORT=3000
ALLOWED_ORIGINS=http://localhost:8080,https://votredomaine.com
```

## 📡 Endpoints API

### Health Check
```
GET /api/health
```

### Enregistrer un clic
```
POST /api/clicks
Content-Type: application/json

{
  "linkName": "Site Principal"
}
```

### Obtenir toutes les statistiques
```
GET /api/stats

Response:
{
  "totalClicks": 150,
  "linksCount": 5,
  "stats": [
    {
      "name": "Site Principal",
      "clicks": 50,
      "lastClick": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

### Obtenir les stats d'un lien spécifique
```
GET /api/stats/:linkName
```

### Réinitialiser les statistiques
```
DELETE /api/stats
Content-Type: application/json

{
  "confirm": "RESET_ALL_STATS"
}
```

## 🗄️ Base de données

### Structure MongoDB

Collection: `clicks`

```javascript
{
  linkName: String,      // Nom du lien cliqué
  timestamp: Date,       // Date/heure du clic
  userAgent: String,     // User agent du visiteur
  ipAddress: String      // IP du visiteur
}
```

## 🔐 Sécurité

- CORS configuré pour autoriser uniquement vos domaines
- Validation des données entrantes
- Gestion d'erreurs complète
- Pas d'authentification requise (ajoutez-la si nécessaire)

## 📦 Technologies

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM MongoDB
- **CORS** - Gestion des origines
- **dotenv** - Variables d'environnement
