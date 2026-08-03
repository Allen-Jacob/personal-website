(() => {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  function adaptLinksForLiveServer() {
    const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
    const port = Number(location.port);
    const isLiveServer = localHosts.has(location.hostname) && port >= 5500 && port < 5600;
    if (!isLiveServer) return;

    const localPages = new Map([
      ["/about", "/about.html"],
      ["/matos", "/matos.html"],
      ["/mentions-legales", "/mentions-legales.html"]
    ]);

    document.querySelectorAll('a[href^="/"]').forEach((link) => {
      const cleanPath = link.getAttribute("href");
      if (localPages.has(cleanPath)) link.setAttribute("href", localPages.get(cleanPath));
    });

    fetch("/vercel.json", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((configuration) => {
        if (!configuration?.redirects) return;
        const redirects = new Map(configuration.redirects.map(({ source, destination }) => [source, destination]));

        document.querySelectorAll('a[href^="/"]').forEach((link) => {
          const source = link.getAttribute("href");
          if (redirects.has(source)) link.setAttribute("href", redirects.get(source));
        });
      })
      .catch(() => {});
  }

  adaptLinksForLiveServer();

  function showEasterToast(french, english) {
    document.querySelector(".easter-toast")?.remove();
    const toast = document.createElement("div");
    toast.className = "easter-toast";
    toast.setAttribute("role", "status");
    toast.textContent = document.documentElement.lang === "en" ? english : french;
    document.body.append(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  let brandClicks = 0;
  let brandTimer = 0;
  document.querySelector(".brand")?.addEventListener("click", (event) => {
    const currentPath = location.pathname.replace(/\/$/, "") || "/";
    if (!["/", "/en"].includes(currentPath)) return;
    event.preventDefault();
    brandClicks += 1;
    clearTimeout(brandTimer);
    brandTimer = setTimeout(() => { brandClicks = 0; }, 1800);
    if (brandClicks < 5) return;
    brandClicks = 0;
    document.body.classList.toggle("homelab-mode");
    showEasterToast("Mode homelab activé. Les paquets circulent.", "Homelab mode enabled. Packets are flowing.");
  });

  const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let konamiIndex = 0;
  addEventListener("keydown", (event) => {
    konamiIndex = event.key.toLowerCase() === konami[konamiIndex].toLowerCase() ? konamiIndex + 1 : 0;
    if (konamiIndex !== konami.length) return;
    konamiIndex = 0;
    showEasterToast("Code accepté — +30 points de curiosité.", "Code accepted — +30 curiosity points.");
    if (reducedMotion) return;
    for (let index = 0; index < 24; index += 1) {
      const particle = document.createElement("span");
      particle.className = "easter-particle";
      particle.textContent = index % 3 ? "🍁" : "⚡";
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.setProperty("--fall-x", `${Math.random() * 180 - 90}px`);
      particle.style.setProperty("--fall-duration", `${2 + Math.random() * 1.7}s`);
      document.body.append(particle);
      setTimeout(() => particle.remove(), 4000);
    }
  });

  console.info("%c👋 Bien trouvé. Essaie le code Konami.", "color:#ff5b35;font:bold 14px sans-serif");

  if (finePointer && !reducedMotion) {
    const cardsWithPointerGlow = document.querySelectorAll(".link-tile, .equipment-card");

    cardsWithPointerGlow.forEach((card) => {
      let frame = 0;

      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const pointerX = event.clientX - rect.left;
        const pointerY = event.clientY - rect.top;

        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          card.style.setProperty("--pointer-x", `${pointerX}px`);
          card.style.setProperty("--pointer-y", `${pointerY}px`);
        });
      }, { passive: true });

      card.addEventListener("pointerleave", () => {
        cancelAnimationFrame(frame);
      }, { passive: true });
    });
  }
})();
