# ============================================
# Dockerfile combiné : Frontend + API
# ============================================

# Stage 1 : Construire l'API Node.js
FROM node:20-alpine AS api-builder
WORKDIR /app/api
COPY api/package*.json ./
RUN npm install --production
COPY api/server.js ./

# Stage 2 : Image finale avec Nginx + Node.js
FROM node:20-alpine

# Installer Nginx
RUN apk add --no-cache nginx

# Créer les répertoires nécessaires
RUN mkdir -p /run/nginx /var/log/nginx /usr/share/nginx/html

# Copier l'API depuis le stage précédent
WORKDIR /app/api
COPY --from=api-builder /app/api ./

# Copier les fichiers frontend
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY admin.html /usr/share/nginx/html/
COPY admin-styles.css /usr/share/nginx/html/
COPY admin-script.js /usr/share/nginx/html/
COPY env*.js /usr/share/nginx/html/
COPY img/ /usr/share/nginx/html/img/

# Configuration Nginx
RUN rm -f /etc/nginx/http.d/default.conf
COPY <<EOF /etc/nginx/http.d/default.conf
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Compression gzip
    gzip on;
    gzip_types text/css application/javascript text/html application/json;

    # Headers de sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache pour les assets statiques
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy pour l'API
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Servir les fichiers statiques
    location / {
        try_files \$uri \$uri/ =404;
    }

    # Rediriger la racine vers index.html
    location = / {
        try_files /index.html =404;
    }
}
EOF

# Script de démarrage
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'echo "🚀 Démarrage de l API..."' >> /start.sh && \
    echo 'cd /app/api' >> /start.sh && \
    echo 'node server.js &' >> /start.sh && \
    echo 'echo "🌐 Démarrage de Nginx..."' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000
ENV MONGODB_URI=mongodb://mongodb:27017/linktree-analytics
ENV ALLOWED_ORIGINS=*

# Exposer le port 80
EXPOSE 80

# Démarrer les services
CMD ["/bin/sh", "/start.sh"]
