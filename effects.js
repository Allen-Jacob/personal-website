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
