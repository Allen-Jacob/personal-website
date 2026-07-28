/**
 * effects.js
 * ---------------------------------------------------------------
 * Deux petites fonctions, aucune dépendance, partagées par les 3 pages :
 *
 * 1. initStars()  — remplit <div class="stars"> avec des <span class="star">
 *    placées et animées aléatoirement (position, taille, vitesse). Chaque
 *    page en génère un jeu différent à chaque chargement.
 *
 * 2. initCursorLight() — fait suivre un halo très discret à la souris,
 *    via <div class="cursor-light">. Désactivé sur mobile/tactile (pas de
 *    curseur) et si la personne a activé "réduire les animations".
 *
 * Pour changer le NOMBRE d'étoiles : modifie STAR_COUNT plus bas.
 * Pour changer la force de la lampe torche : modifie l'opacité dans
 * le dégradé de .cursor-light, dans style.css (pas ici).
 * ---------------------------------------------------------------
 */

(function () {
  const STAR_COUNT = 26;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function initStars() {
    const container = document.querySelector('.stars');
    if (!container) return;

    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement('span');
      star.className = 'star';

      const size = (Math.random() * 1.6 + 1).toFixed(2);       // 1px  -> 2.6px
      const duration = (Math.random() * 3 + 3).toFixed(2);      // 3s   -> 6s
      const delay = (Math.random() * 5).toFixed(2);             // 0s   -> 5s
      const driftX = (Math.random() * 8 - 4).toFixed(1);        // -4px -> 4px
      const driftY = (Math.random() * 8 - 4).toFixed(1);        // -4px -> 4px

      star.style.setProperty('--top', Math.random() * 100 + '%');
      star.style.setProperty('--left', Math.random() * 100 + '%');
      star.style.setProperty('--size', size + 'px');
      star.style.setProperty('--duration', prefersReducedMotion ? '0s' : duration + 's');
      star.style.setProperty('--delay', delay + 's');
      star.style.setProperty('--drift-x', driftX + 'px');
      star.style.setProperty('--drift-y', driftY + 'px');

      container.appendChild(star);
    }
  }

  function initCursorLight() {
    const light = document.querySelector('.cursor-light');
    if (!light) return;

    // Pas de vraie souris (mobile/tactile) ou préférence "moins de mouvement" -> on n'active rien.
    if (!hasFinePointer || prefersReducedMotion) return;

    window.addEventListener('mousemove', (e) => {
      const xPercent = (e.clientX / window.innerWidth) * 100;
      const yPercent = (e.clientY / window.innerHeight) * 100;
      light.style.setProperty('--mx', xPercent + '%');
      light.style.setProperty('--my', yPercent + '%');
      light.classList.add('is-active');
    });

    // On cache le halo si la souris quitte la fenêtre.
    document.addEventListener('mouseleave', () => light.classList.remove('is-active'));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initStars();
    initCursorLight();
  });
})();