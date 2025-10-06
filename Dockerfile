# ============================================
# Dockerfile : Frontend uniquement (Nginx)
# ============================================

FROM nginx:alpine

# Créer les répertoires nécessaires
RUN mkdir -p /usr/share/nginx/html

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
RUN rm -f /etc/nginx/conf.d/default.conf
COPY <<EOF /etc/nginx/conf.d/default.conf
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

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]