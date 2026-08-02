(() => {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (finePointer && !reducedMotion) {
    const cards = document.querySelectorAll(".tile, .equipment-card, .content-card, .hero-copy, .hero-aside, .legal-card, .learning-item, .referral-links a");

    cards.forEach((card) => {
      card.classList.add("tilt-enabled");
      let frame = 0;

      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const pointerX = event.clientX - rect.left;
        const pointerY = event.clientY - rect.top;
        const x = pointerX / rect.width - 0.5;
        const y = pointerY / rect.height - 0.5;

        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          card.style.setProperty("--pointer-x", `${pointerX}px`);
          card.style.setProperty("--pointer-y", `${pointerY}px`);
          card.style.transform = `perspective(900px) rotateX(${(-y * 11).toFixed(2)}deg) rotateY(${(x * 11).toFixed(2)}deg) translateY(-5px) scale(1.025)`;

          if (card.classList.contains("statement-card")) {
            card.style.setProperty("--orbit-shift-x", `${(x * 12).toFixed(1)}px`);
            card.style.setProperty("--orbit-shift-y", `${(y * 12).toFixed(1)}px`);
          }
        });
      }, { passive: true });

      card.addEventListener("pointerleave", () => {
        cancelAnimationFrame(frame);
        card.style.transform = "";
        card.style.removeProperty("--orbit-shift-x");
        card.style.removeProperty("--orbit-shift-y");
      }, { passive: true });
    });
  }
})();
