/**
 * Script simplifié pour Linktree
 * Utilise localStorage uniquement (pas d'API)
 */

// Créer les points animés (étoiles)
function createStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;

    const numberOfStars = 50;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Position aléatoire
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        // Délai d'animation aléatoire
        star.style.animationDelay = `${Math.random() * 3}s`;

        // Durée d'animation aléatoire entre 2 et 4 secondes
        star.style.animationDuration = `${2 + Math.random() * 2}s`;

        starsContainer.appendChild(star);
    }
}

// Système de tracking des clics (localStorage uniquement)
function trackClick(buttonName) {
    try {
        let stats = JSON.parse(localStorage.getItem('linkStats') || '{}');
        stats[buttonName] = (stats[buttonName] || 0) + 1;
        localStorage.setItem('linkStats', JSON.stringify(stats));
    } catch (error) {
        console.error('Error tracking click:', error);
    }
}

// Initialiser le tracking sur tous les boutons
function initTracking() {
    const buttons = document.querySelectorAll('.link-button, .social-icon');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Obtenir le nom du bouton (texte ou aria-label)
            const buttonName = this.querySelector('span')?.textContent ||
                              this.getAttribute('aria-label') ||
                              'Unknown';

            trackClick(buttonName);
        });
    });
}

// Créer et afficher l'horloge du Québec
function createQuebecClock() {
    // Créer l'élément de l'horloge
    const clockDiv = document.createElement('div');
    clockDiv.className = 'quebec-clock';
    clockDiv.innerHTML = `
        <span class="clock-time" id="quebecTime">--:--</span>
        <span class="clock-label">QC</span>
    `;
    document.body.appendChild(clockDiv);

    // Fonction pour mettre à jour l'heure
    function updateQuebecTime() {
        const now = new Date();
        
        // Convertir en heure du Québec (America/Montreal, UTC-5 ou UTC-4 selon DST)
        const quebecTime = new Date(now.toLocaleString('en-US', { 
            timeZone: 'America/Montreal' 
        }));

        // Formater l'heure en HH:MM
        const hours = quebecTime.getHours().toString().padStart(2, '0');
        const minutes = quebecTime.getMinutes().toString().padStart(2, '0');
        
        // Mettre à jour l'affichage
        const timeElement = document.getElementById('quebecTime');
        if (timeElement) {
            timeElement.textContent = `${hours}:${minutes}`;
        }
    }

    // Mettre à jour immédiatement
    updateQuebecTime();

    // Mettre à jour toutes les secondes
    setInterval(updateQuebecTime, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    createStars();
    initTracking();
    createQuebecClock();
    console.log('✨ Linktree chargé avec horloge QC (localStorage uniquement)');
});