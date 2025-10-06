# ============================================
# Dockerfile pour l'API Analytics
# ============================================

FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier le code de l'API
COPY server.js ./

# Exposer le port
EXPOSE 3000

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3000

# Démarrer l'application
CMD ["node", "server.js"]
