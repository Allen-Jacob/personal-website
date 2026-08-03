(() => {
  const button = document.querySelector("[data-like-button]");
  if (!button) return;

  const countElement = button.querySelector("[data-like-count]");
  const labelElement = button.querySelector("[data-like-label]");
  const statusElement = document.querySelector("[data-like-status]");
  const isEnglish = document.documentElement.lang === "en";
  const page = "home";
  let liked = false;

  const messages = isEnglish
    ? { like: "Like", liked: "Liked", error: "Likes are temporarily unavailable." }
    : { like: "J’aime", liked: "Aimé", error: "Les J’aime sont temporairement indisponibles." };

  function visitorId() {
    const storageKey = "jacoballen-like-visitor-id";
    try {
      const existing = localStorage.getItem(storageKey);
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(existing || "")) return existing;
      const created = crypto.randomUUID();
      localStorage.setItem(storageKey, created);
      return created;
    } catch (_) {
      return crypto.randomUUID();
    }
  }

  const visitor = visitorId();

  function render(state) {
    liked = Boolean(state.liked);
    button.setAttribute("aria-pressed", String(liked));
    labelElement.textContent = liked ? messages.liked : messages.like;
    countElement.textContent = new Intl.NumberFormat(isEnglish ? "en-CA" : "fr-CA").format(state.count || 0);
    button.disabled = false;
  }

  async function request(options = {}) {
    const response = await fetch(`/api/likes?page=${page}&visitor=${encodeURIComponent(visitor)}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      ...options
    });
    if (!response.ok) throw new Error(`Likes API: ${response.status}`);
    return response.json();
  }

  request().then(render).catch(() => {
    statusElement.textContent = messages.error;
    button.disabled = true;
  });

  button.addEventListener("click", async () => {
    button.disabled = true;
    statusElement.textContent = "";
    try {
      render(await request({ method: "POST", body: JSON.stringify({ liked: !liked }) }));
      const heart = button.querySelector(".like-heart");
      heart.style.animation = "none";
      requestAnimationFrame(() => { heart.style.animation = "like-pop .35s ease"; });
    } catch (_) {
      statusElement.textContent = messages.error;
      button.disabled = false;
    }
  });
})();
