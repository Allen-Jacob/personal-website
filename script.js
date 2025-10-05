/**
 * Script simplifié pour Linktree
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

// Système de tracking des clics
function trackClick(buttonName) {
    // Récupérer les stats existantes
    let stats = JSON.parse(localStorage.getItem('linkStats') || '{}');

    // Incrémenter le compteur pour ce bouton
    stats[buttonName] = (stats[buttonName] || 0) + 1;

    // Sauvegarder
    localStorage.setItem('linkStats', JSON.stringify(stats));
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

document.addEventListener('DOMContentLoaded', () => {
    createStars();
    initTracking();
    console.log('✨ Linktree chargé');
});
