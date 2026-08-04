(() => {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  function initializeRevealAnimations() {
    if (reducedMotion || !("IntersectionObserver" in window)) return;

    const elements = [...document.querySelectorAll(".reveal")];
    if (!elements.length) return;

    document.documentElement.classList.add("js-motion");

    const orderByParent = new Map();
    elements.forEach((element) => {
      const order = orderByParent.get(element.parentElement) || 0;
      element.style.setProperty("--reveal-delay", `${Math.min(order * 65, 390)}ms`);
      orderByParent.set(element.parentElement, order + 1);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

    elements.forEach((element) => observer.observe(element));
  }

  initializeRevealAnimations();

  function initializeCompass() {
    const compass = document.querySelector("[data-compass]");
    if (!compass) return;

    let angle = 0;
    let dragging = false;
    let moved = false;
    let lastPointerAngle = 0;

    const normalizeAngle = (value) => ((value % 360) + 360) % 360;
    const pointerAngle = (event) => {
      const rect = compass.getBoundingClientRect();
      return Math.atan2(event.clientY - (rect.top + rect.height / 2), event.clientX - (rect.left + rect.width / 2)) * 180 / Math.PI + 90;
    };
    const updateCompass = (nextAngle) => {
      angle = normalizeAngle(nextAngle);
      compass.style.setProperty("--compass-angle", `${angle}deg`);
      const roundedAngle = Math.round(angle) % 360;
      compass.setAttribute("aria-label", document.documentElement.lang === "en"
        ? `Québec compass, ${roundedAngle} degrees. Drag or use the arrow keys to rotate it.`
        : `Boussole du Québec, ${roundedAngle} degrés. Glissez ou utilisez les flèches pour la tourner.`);
    };
    const endDrag = (event, rotateOnTap) => {
      if (!dragging) return;
      dragging = false;
      compass.classList.remove("is-dragging");
      if (compass.hasPointerCapture(event.pointerId)) compass.releasePointerCapture(event.pointerId);
      if (rotateOnTap && !moved) updateCompass(angle + 45);
    };

    compass.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      event.preventDefault();
      dragging = true;
      moved = false;
      lastPointerAngle = pointerAngle(event);
      compass.setPointerCapture(event.pointerId);
      compass.classList.add("is-dragging");
    });
    compass.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const currentPointerAngle = pointerAngle(event);
      let delta = currentPointerAngle - lastPointerAngle;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      if (Math.abs(delta) > 2) moved = true;
      updateCompass(angle + delta);
      lastPointerAngle = currentPointerAngle;
    });
    compass.addEventListener("pointerup", (event) => endDrag(event, true));
    compass.addEventListener("pointercancel", (event) => endDrag(event, false));
    compass.addEventListener("click", (event) => {
      if (event.detail === 0) updateCompass(angle + 45);
    });
    compass.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") updateCompass(0);
      else updateCompass(angle + (["ArrowRight", "ArrowUp"].includes(event.key) ? 15 : -15));
    });

    updateCompass(0);
  }

  initializeCompass();

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

    document.querySelectorAll("[data-tilt]").forEach((card) => {
      let frame = 0;

      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateX(${-y * 2.5}deg) rotateY(${x * 3.5}deg) translateY(-2px)`;
          card.style.setProperty("--orbit-shift-x", `${x * 14}px`);
          card.style.setProperty("--orbit-shift-y", `${y * 14}px`);
        });
      }, { passive: true });

      card.addEventListener("pointerleave", () => {
        cancelAnimationFrame(frame);
        card.style.removeProperty("transform");
        card.style.setProperty("--orbit-shift-x", "0px");
        card.style.setProperty("--orbit-shift-y", "0px");
      }, { passive: true });
    });
  }
})();
