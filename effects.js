/**
 * effects.js
 * ---------------------------------------------------------------
 * Deux petites fonctions, aucune dépendance, partagées par les 3 pages :
 *
 * 1. initStars()  — remplit <div class="stars"> avec des <span class="star">
 *    placées et animées aléatoirement (position, taille, vitesse). Chaque
 *    page en génère un jeu différent à chaque chargement.
 *
 * 2. initCursorGlow() — fait suivre un halo très discret à la souris,
 *    via <div class="cursor-glow">. Désactivé sur mobile/tactile (pas de
 *    curseur) et si la personne a activé "réduire les animations".
 *
 * Pour changer le NOMBRE d'étoiles : modifie STAR_COUNT plus bas.
 * Pour changer la force de la lampe torche : modifie l'opacité dans
 * le dégradé de .cursor-glow, dans style.css (pas ici).
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

  function initCursorGlow() {
    if (!hasFinePointer || prefersReducedMotion) return;

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.append(glow);

    window.addEventListener('mousemove', (event) => {
      glow.style.transform = `translate3d(${event.clientX - 110}px,${event.clientY - 110}px,0)`;
      glow.classList.add('is-visible');
    });

    document.addEventListener('mouseleave', () => {
      glow.classList.remove('is-visible');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initStars();
    initCursorGlow();
  });
})();
