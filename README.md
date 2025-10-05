# 🔗 Linktree Personnel - Jacob Allen

Site web moderne de type Linktree/Bento avec un design bleu sombre, des animations fluides (vagues et bulles) et une mise en page responsive.

## ✨ Fonctionnalités

- 🎨 **Design moderne** avec thème bleu sombre
- 🌊 **Animations fluides** : vagues en arrière-plan et bulles colorées
- 📱 **Responsive** : adapté mobile et desktop
- ✨ **Effets interactifs** : hover glow, parallaxe au survol, animations au clic
- 🚀 **Déploiement facile** avec Docker et Nginx
- 🔧 **Facile à personnaliser** : code propre et bien commenté

## 📁 Structure du projet

```
Linktree/
├── index.html          # Structure HTML principale
├── styles.css          # Styles et animations
├── script.js           # Interactions JavaScript
├── Dockerfile          # Configuration Docker
├── .dockerignore       # Fichiers exclus de Docker
└── README.md           # Ce fichier
```

## 🛠️ Personnalisation

### 1. Modifier vos informations personnelles

Ouvrez [index.html](index.html) et modifiez :

**Photo de profil** (ligne ~35) :
```html
<img src="https://via.placeholder.com/150" alt="Jacob Allen" id="profilePhoto">
```
Remplacez par votre propre image :
```html
<img src="./images/ma-photo.jpg" alt="Jacob Allen" id="profilePhoto">
```

**Description** (ligne ~43) :
```html
<p class="profile-description">
    Développeur passionné par la création d'expériences web modernes et innovantes.
</p>
```

### 2. Modifier les liens

Dans [index.html](index.html), section `<!-- Boutons de liens -->` (lignes ~48-80) :

```html
<!-- Site principal -->
<a href="https://jacobalone.ca" class="link-button" target="_blank">
    <i class="fas fa-globe"></i>
    <span>Site Principal</span>
    <i class="fas fa-arrow-right arrow-icon"></i>
</a>

<!-- YouTube -->
<a href="https://youtube.com/@votre-chaine" class="link-button" target="_blank">
    <i class="fab fa-youtube"></i>
    <span>YouTube</span>
    <i class="fas fa-arrow-right arrow-icon"></i>
</a>
```

**Remplacez simplement les URLs** par vos propres liens.

### 3. Modifier les couleurs

Dans [styles.css](styles.css), section `:root` (lignes ~4-15) :

```css
:root {
    --primary-bg: #0a1628;      /* Couleur de fond principale */
    --accent-blue: #3b82f6;     /* Bleu d'accentuation */
    --accent-cyan: #06b6d4;     /* Cyan */
    --accent-purple: #8b5cf6;   /* Violet */
}
```

## 🚀 Déploiement

### Option 1 : Ouvrir directement (développement)

Double-cliquez sur [index.html](index.html) pour l'ouvrir dans votre navigateur.

### Option 2 : Serveur local simple

```bash
# Python 3
python -m http.server 8000

# Node.js (avec npx)
npx http-server -p 8000
```

Puis ouvrez http://localhost:8000

### Option 3 : Docker (production)

#### Prérequis
- [Docker](https://www.docker.com/get-started) installé sur votre machine

#### Build de l'image

```bash
# Construire l'image Docker
docker build -t linktree-jacob .
```

#### Lancer le conteneur

```bash
# Lancer le conteneur sur le port 8080
docker run -d -p 8080:80 --name my-linktree linktree-jacob
```

Le site sera accessible sur : **http://localhost:8080**

#### Commandes Docker utiles

```bash
# Voir les conteneurs en cours d'exécution
docker ps

# Arrêter le conteneur
docker stop my-linktree

# Redémarrer le conteneur
docker start my-linktree

# Voir les logs
docker logs my-linktree

# Supprimer le conteneur
docker rm my-linktree

# Supprimer l'image
docker rmi linktree-jacob
```

### Option 4 : Déploiement cloud

#### Netlify / Vercel (gratuit)

1. Créez un compte sur [Netlify](https://netlify.com) ou [Vercel](https://vercel.com)
2. Glissez-déposez le dossier du projet
3. Votre site sera en ligne en quelques secondes !

#### Docker Hub

```bash
# Tag de l'image
docker tag linktree-jacob votre-username/linktree-jacob:latest

# Push vers Docker Hub
docker push votre-username/linktree-jacob:latest
```

## 🎨 Ajout d'images

Pour ajouter votre photo de profil ou d'autres images :

1. Créez un dossier `images/` :
```bash
mkdir images
```

2. Placez votre photo (ex: `profile.jpg`) dans ce dossier

3. Décommentez la ligne dans le [Dockerfile](Dockerfile) :
```dockerfile
COPY images/ /usr/share/nginx/html/images/
```

4. Modifiez [index.html](index.html) :
```html
<img src="./images/profile.jpg" alt="Jacob Allen">
```

## 🔧 Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Animations, gradients, backdrop-filter
- **JavaScript** : Animations interactives, parallaxe
- **Font Awesome 6** : Icônes
- **Google Fonts** : Police Inter
- **Nginx Alpine** : Serveur web léger
- **Docker** : Conteneurisation

## 📝 Licence

Libre d'utilisation. Personnalisez à votre guise !

## 🤝 Support

Pour toute question ou suggestion :
- 🌐 Site : https://jacobalone.ca
- 📧 Email : [votre-email]

---

**Créé avec ❤️ par Jacob Allen**
