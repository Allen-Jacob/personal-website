# ============================================
# Dockerfile pour déployer le site Linktree
# avec Nginx (image Alpine légère)
# ============================================

FROM nginx:alpine

# Métadonnées
LABEL maintainer="Jacob Allen"
LABEL description="Site Linktree personnel avec Nginx"

# Supprimer la config Nginx par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copier les fichiers du site dans le répertoire Nginx
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Optionnel: Copier un dossier d'images si vous en avez
# COPY images/ /usr/share/nginx/html/images/

# Configuration Nginx personnalisée (optionnelle)
# Si vous voulez ajouter des headers de sécurité ou configurer le cache
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Compression gzip
    gzip on;
    gzip_types text/css application/javascript text/html;

    # Headers de sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache pour les assets statiques
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Redirection 404 vers index.html
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Page d'erreur personnalisée (optionnel)
    error_page 404 /index.html;
}
EOF

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
