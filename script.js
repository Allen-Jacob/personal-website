/**
 * Script pour les animations interactives du site Linktree
 * - Génération de bulles colorées animées
 * - Effets de parallaxe au survol
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    bubbles: {
        count: 15,
        minSize: 20,
        maxSize: 80,
        colors: [
            'rgba(59, 130, 246, 0.3)',   // Bleu
            'rgba(6, 182, 212, 0.3)',    // Cyan
            'rgba(139, 92, 246, 0.3)',   // Violet
            'rgba(14, 165, 233, 0.3)',   // Bleu clair
        ],
        animationDuration: {
            min: 8,
            max: 15
        }
    }
};

// ============================================
// GÉNÉRATION DES BULLES
// ============================================
function createBubbles() {
    const container = document.getElementById('bubblesContainer');
    if (!container) return;

    for (let i = 0; i < CONFIG.bubbles.count; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        // Propriétés aléatoires
        const size = randomBetween(CONFIG.bubbles.minSize, CONFIG.bubbles.maxSize);
        const color = CONFIG.bubbles.colors[Math.floor(Math.random() * CONFIG.bubbles.colors.length)];
        const leftPosition = randomBetween(0, 100);
        const duration = randomBetween(CONFIG.bubbles.animationDuration.min, CONFIG.bubbles.animationDuration.max);
        const delay = randomBetween(0, 5);

        // Application des styles
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.background = `radial-gradient(circle at 30% 30%, ${color}, transparent)`;
        bubble.style.left = `${leftPosition}%`;
        bubble.style.animationDuration = `${duration}s`;
        bubble.style.animationDelay = `${delay}s`;

        container.appendChild(bubble);
    }
}

// ============================================
// EFFET DE PARALLAXE AU SURVOL
// ============================================
function initParallaxEffect() {
    const card = document.querySelector('.profile-card');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        const rotateX = deltaY * 5;
        const rotateY = deltaX * 5;

        card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
}

// ============================================
// ANIMATION DES BOUTONS AU SCROLL
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const buttons = document.querySelectorAll('.link-button');
    buttons.forEach(button => observer.observe(button));
}

// ============================================
// EFFET DE CLIC SUR LES BOUTONS
// ============================================
function initButtonClickEffects() {
    const buttons = document.querySelectorAll('.link-button');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Créer un effet de ripple
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.pointerEvents = 'none';

            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - 10;
            const y = e.clientY - rect.top - 10;

            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.style.animation = 'ripple-effect 0.6s ease-out';

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Ajouter l'animation CSS pour le ripple
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-effect {
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
            margin-left: -90px;
            margin-top: -90px;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// UTILITAIRES
// ============================================
function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    createBubbles();
    initParallaxEffect();
    initScrollAnimations();
    initButtonClickEffects();

    // Log de confirmation
    console.log('%c🎨 Site Linktree initialisé avec succès!', 'color: #3b82f6; font-size: 14px; font-weight: bold;');
});

// ============================================
// GESTION DU CHANGEMENT DE PHOTO DE PROFIL
// ============================================
// Pour changer votre photo, remplacez l'URL dans le HTML ou ajoutez une image locale
// Exemple: <img src="./images/profile.jpg" alt="Jacob Allen">
