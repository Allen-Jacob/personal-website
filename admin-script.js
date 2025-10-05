/**
 * Script pour la page admin - Analytics
 */

// Créer les étoiles (réutilisé du script principal)
function createStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;

    const numberOfStars = 50;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.animationDuration = `${2 + Math.random() * 2}s`;

        starsContainer.appendChild(star);
    }
}

// Charger et afficher les statistiques
function loadStats() {
    const stats = JSON.parse(localStorage.getItem('linkStats') || '{}');
    const statsArray = Object.entries(stats).map(([name, clicks]) => ({
        name,
        clicks
    }));

    // Trier par nombre de clics (décroissant)
    statsArray.sort((a, b) => b.clicks - a.clicks);

    // Calculer le total
    const totalClicks = statsArray.reduce((sum, item) => sum + item.clicks, 0);

    // Mettre à jour les cartes de résumé
    document.getElementById('totalClicks').textContent = totalClicks.toLocaleString();
    document.getElementById('activeLinks').textContent = statsArray.length;

    // Afficher le tableau
    displayStatsTable(statsArray, totalClicks);
}

// Afficher le tableau de statistiques
function displayStatsTable(statsArray, totalClicks) {
    const tbody = document.getElementById('statsBody');

    if (statsArray.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4">
                    <div class="empty-state">
                        <i class="fas fa-chart-line"></i>
                        <p>Aucune statistique disponible</p>
                        <p style="font-size: 0.875rem; margin-top: 0.5rem;">
                            Les clics sur vos liens apparaîtront ici
                        </p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = statsArray.map(item => {
        const percentage = totalClicks > 0 ? ((item.clicks / totalClicks) * 100).toFixed(1) : 0;

        return `
            <tr>
                <td class="link-name">${item.name}</td>
                <td class="click-count">${item.clicks.toLocaleString()}</td>
                <td class="percentage">${percentage}%</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Actualiser les statistiques
function refreshStats() {
    loadStats();

    // Animation de feedback
    const btn = event.target.closest('.btn');
    const icon = btn.querySelector('i');
    icon.style.animation = 'spin 0.5s linear';

    setTimeout(() => {
        icon.style.animation = '';
    }, 500);
}

// Réinitialiser les statistiques
function resetStats() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les statistiques ? Cette action est irréversible.')) {
        localStorage.removeItem('linkStats');
        loadStats();

        // Feedback visuel
        alert('Statistiques réinitialisées avec succès !');
    }
}

// Animation de rotation pour le bouton refresh
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Configuration du mot de passe
const ADMIN_PASSWORD = 'admin123'; // Changez ce mot de passe !

// Vérifier l'authentification
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('adminAuth') === 'true';

    if (!isAuthenticated) {
        showLoginModal();
        return false;
    }
    return true;
}

// Afficher le modal de connexion
function showLoginModal() {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div class="auth-overlay">
            <div class="auth-modal">
                <div class="auth-header">
                    <i class="fas fa-lock"></i>
                    <h2>Accès Admin</h2>
                    <p>Veuillez entrer le mot de passe</p>
                </div>
                <form id="loginForm" onsubmit="return handleLogin(event)">
                    <input
                        type="password"
                        id="passwordInput"
                        placeholder="Mot de passe"
                        autocomplete="current-password"
                        required
                    >
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-sign-in-alt"></i> Se connecter
                    </button>
                    <p class="error-message" id="errorMessage"></p>
                </form>
                <a href="index.html" class="btn btn-secondary" style="margin-top: 1rem;">
                    <i class="fas fa-arrow-left"></i> Retour au site
                </a>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('passwordInput').focus();
}

// Gérer la connexion
function handleLogin(event) {
    event.preventDefault();

    const password = document.getElementById('passwordInput').value;
    const errorMessage = document.getElementById('errorMessage');

    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminAuth', 'true');
        document.querySelector('.auth-overlay').remove();
        loadStats();
        startAutoRefresh();
    } else {
        errorMessage.textContent = 'Mot de passe incorrect';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();

        // Animation shake
        const modal = document.querySelector('.auth-modal');
        modal.style.animation = 'shake 0.5s';
        setTimeout(() => {
            modal.style.animation = '';
        }, 500);
    }

    return false;
}

// Déconnexion
function logout() {
    if (confirm('Voulez-vous vous déconnecter ?')) {
        sessionStorage.removeItem('adminAuth');
        location.reload();
    }
}

// Démarrer l'auto-refresh
function startAutoRefresh() {
    setInterval(loadStats, 5000);
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    createStars();

    if (checkAuth()) {
        loadStats();
        startAutoRefresh();
    }

    console.log('📊 Admin Dashboard chargé');
});
