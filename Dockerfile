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

# Copier les fichiers admin
COPY admin.html /usr/share/nginx/html/
COPY admin-styles.css /usr/share/nginx/html/
COPY admin-script.js /usr/share/nginx/html/

# Copier le fichier de configuration (env.js) - optionnel
COPY env*.js /usr/share/nginx/html/

# Copier le dossier d'images
COPY img/ /usr/share/nginx/html/img/

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

    # Servir les fichiers statiques directement
    location / {
        try_files \$uri \$uri/ =404;
    }

    # Rediriger la racine vers index.html
    location = / {
        try_files /index.html =404;
    }
}
EOF

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
