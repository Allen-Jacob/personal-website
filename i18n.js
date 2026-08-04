(() => {
  const englishPath = /^\/en(?:\/|$)/.test(location.pathname);
  const pagePaths = new Set(["/", "/about", "/matos", "/mentions-legales"]);
  const frenchPath = (location.pathname.replace(/^\/en(?=\/|$)/, "") || "/")
    .replace(/\.html$/, "")
    .replace(/\/$/, "") || "/";

  const translations = {
    "Aller au contenu": "Skip to content",
    "Jacob Allen - Accueil": "Jacob Allen - Home",
    "Jacob Allen — Accueil": "Jacob Allen — Home",
    "Navigation principale": "Main navigation",
    "Accueil": "Home",
    "À propos": "About",
    "Matériel": "Gear",
    "Me contacter": "Get in touch",
    "Présentation de Jacob Allen": "Introduction to Jacob Allen",
    "Profil / 01": "Profile / 01",
    "Étudiant en techniques de l’informatique": "Computer science technology student",
    "Centres d’intérêt": "Interests",
    "Réseaux": "Networking",
    "Plein air": "Outdoors",
    "Jacob Allen devant un paysage de montagne et de mer": "Jacob Allen in front of a mountain and ocean landscape",
    "En ce moment / 02": "Right now / 02",
    "CANADA ; Québec": "CANADA · Québec",
    "Je construis,": "I build,",
    "j’héberge,": "I host,",
    "j’apprends.": "I learn.",
    "Je transforme ma curiosité pour les réseaux et Linux en projets concrets — un service, un conteneur et une idée à la fois.": "I turn my curiosity for networking and Linux into real projects — one service, one container and one idea at a time.",
    "Voir mes projets": "View my projects",
    "Voir le GitHub de Jacob": "View Jacob’s GitHub",
    "Projets & dépôts": "Projects & repositories",
    "Voir les activités Strava de Jacob": "View Jacob’s Strava activities",
    "Profil - connexion parfois requise": "Profile - sign-in may be required",
    "Voir l’Instagram de Jacob": "View Jacob’s Instagram",
    "Mon réseau social préféré": "My favourite social network",
    "Voir le profil X de Jacob": "View Jacob’s X profile",
    "Jacob Allen sur X": "Jacob Allen on X",
    "Veille & idées": "Tech watch & ideas",
    "Mon parcours / 03": "My journey / 03",
    "Curieux par nature.": "Curious by nature.",
    "Technique par passion.": "Technical by passion.",
    "Découvrir mon histoire, ce que j’apprends et ce qui m’anime loin des écrans.": "Discover my story, what I’m learning and what drives me away from screens.",
    "Base / 04": "Home base / 04",
    "Faire tourner la boussole du Québec": "Rotate the Québec compass",
    "Glisser": "Drag",
    "Connecté au réseau.": "Connected to the network.",
    "Souvent dehors.": "Often outdoors.",
    "Les outils derrière mes projets.": "The tools behind my projects.",
    "Explorer mon matériel": "Explore my gear",
    "Bons plans / 07": "Recommendations / 07",
    "Mes liens de parrainage": "My referral links",
    "Je peux recevoir un avantage si vous passez par ces liens, sans coût supplémentaire pour vous.": "I may receive a benefit if you use these links, at no extra cost to you.",
    "Un mois offert · lien de parrainage": "One month free · referral link",
    "VPS · lien de parrainage": "VPS · referral link",
    "Un petit signe / 08": "A little sign / 08",
    "Vous aimez le site ?": "Enjoying the site?",
    "Un clic suffit — aucun compte nécessaire.": "One click is enough — no account required.",
    "J’aime": "Like",
    "Nombre de mentions J’aime": "Number of likes",
    "Conçu avec curiosité au Québec": "Made with curiosity in Québec",
    "Mentions légales": "Legal notice",
    "À propos / 01": "About / 01",
    "Curieux depuis": "Curious since",
    "toujours.": "day one.",
    "Je m’appelle Jacob. J’aime comprendre comment les choses fonctionnent, connecter des systèmes et transformer une idée en quelque chose de concret.": "I’m Jacob. I enjoy understanding how things work, connecting systems and turning an idea into something real.",
    "Ma façon de faire": "How I work",
    "« Tester, casser, comprendre, recommencer. »": "“Test, break, understand, start again.”",
    "— La meilleure façon d’apprendre": "— The best way to learn",
    "Le parcours de Jacob": "Jacob’s journey",
    "Le parcours / 02": "The journey / 02",
    "De la curiosité au métier": "From curiosity to a career",
    "Je vis au Québec et j’entre en": "I live in Québec and I’m starting a",
    "techniques de l’informatique": "Computer Science Technology",
    "au cégep. Mon objectif est de poursuivre vers l’ingénierie informatique grâce à un parcours DEC–BAC qui me permettra d’apprendre le métier de façon concrète.": "program at CEGEP. My goal is to continue into computer engineering through a DEC–BAC pathway that lets me learn the profession hands-on.",
    "Ce qui m’attire dans ce domaine, ce n’est pas seulement la technologie : c’est le plaisir de chercher, de résoudre un problème et de comprendre tout ce qui se passe derrière l’écran.": "What draws me to this field is not only the technology: it’s the satisfaction of investigating, solving problems and understanding everything happening behind the screen.",
    "Le labo / 03": "The lab / 03",
    "Un réseau à moi pour expérimenter": "My own network for experimenting",
    "Mon homelab est mon terrain de jeu. J’y explore": "My homelab is my playground. I use it to explore",
    "Linux, Docker, les VPN, la virtualisation": "Linux, Docker, VPNs and virtualization",
    "et différents services auto-hébergés.": "along with a variety of self-hosted services.",
    "J’essaie aussi de reprendre le contrôle de mes données et de moins dépendre des grandes plateformes — même si Apple garde encore une bonne place dans mon quotidien.": "I’m also trying to take back control of my data and rely less on major platforms — even though Apple still has a solid place in my daily life.",
    "En apprentissage / 04": "Currently learning / 04",
    "Ce que j’explore maintenant": "What I’m exploring now",
    "UniFi, Omada, NetBird et les architectures qui relient tout.": "UniFi, Omada, NetBird and the architectures that connect everything.",
    "Auto-hébergement": "Self-hosting",
    "Docker, Linux et déploiement de services personnels.": "Docker, Linux and deploying personal services.",
    "Développement": "Development",
    "Des projets pratiques — notamment le site que vous consultez.": "Hands-on projects — including the site you’re viewing.",
    "Hors ligne / 05": "Offline / 05",
    "Quand je quitte les écrans": "When I step away from screens",
    "Je recharge mes batteries en vélo de montagne, en ski et à la course. Je découvre aussi la photographie, avec l’envie de mieux observer ce qui m’entoure — et peut-être bientôt avec un véritable appareil photo.": "I recharge through mountain biking, skiing and running. I’m also discovering photography, with a desire to better observe the world around me — perhaps soon with a dedicated camera.",
    "Voir mon GitHub": "View my GitHub",
    "← Retour à l’accueil": "← Back to home",
    "Matériel / 01": "Gear / 01",
    "Les outils derrière": "The tools behind",
    "mes projets.": "my projects.",
    "Pas une vitrine de gadgets : simplement le matériel que j’utilise vraiment pour étudier, créer, expérimenter et partir dehors.": "Not a gadget showcase: simply the gear I actually use to study, create, experiment and head outdoors.",
    "Principe": "Principle",
    "« Je privilégie du matériel durable que je conserve longtemps. »": "“I choose durable gear that I can keep for a long time.”",
    "— Un principe pour chaque achat": "— A principle for every purchase",
    "Informatique": "Computing",
    "Mon ordinateur principal pour les études, le développement et l’administration de mes services.": "My main computer for studying, development and managing my services.",
    "Fiche officielle ↗": "Official page ↗",
    "Mon appareil de tous les jours, aussi utilisé pour la photo et la vidéo.": "My everyday device, also used for photography and video.",
    "Caractéristiques ↗": "Specifications ↗",
    "Pour suivre mes activités, mes entraînements et ma récupération.": "For tracking my activities, training and recovery.",
    "Pour la musique et la concentration grâce à la réduction active du bruit.": "For music and focus with active noise cancellation.",
    "Bureau": "Desk",
    "Deux écrans 24 pouces": "Two 24-inch displays",
    "Un espace confortable pour coder, lire la documentation et surveiller mes services.": "A comfortable workspace for coding, reading documentation and monitoring my services.",
    "Station ThinkPad USB-C": "ThinkPad USB-C dock",
    "Le point central qui relie mon portable aux écrans et aux périphériques.": "The central hub connecting my laptop, displays and peripherals.",
    "Mon clavier principal, compact et confortable pour travailler au quotidien.": "My compact, comfortable everyday keyboard.",
    "Réseau & serveurs": "Networking & servers",
    "Une connexion transportable, particulièrement utile au chalet.": "A portable connection that is especially useful at the cabin.",
    "Lien de parrainage ↗": "Referral link ↗",
    "Mon routeur de voyage pour garder un réseau privé et prévisible.": "My travel router for keeping a private, predictable network.",
    "Mon environnement d’essai pour Docker, les VPN, la virtualisation et l’auto-hébergement.": "My test environment for Docker, VPNs, virtualization and self-hosting.",
    "Un serveur Ubuntu distant pour héberger et tester mes services.": "A remote Ubuntu server for hosting and testing my services.",
    "Photo & vidéo": "Photo & video",
    "Une caméra robuste pour filmer mes sorties de vélo, de ski et de motoneige.": "A rugged camera for filming mountain biking, skiing and snowmobiling.",
    "Toujours à portée de main pour les images spontanées du quotidien.": "Always within reach for spontaneous everyday images.",
    "Informations / 01": "Information / 01",
    "Mentions": "Legal",
    "légales.": "notice.",
    "Les informations essentielles concernant l’édition, l’hébergement et la confidentialité de jacoballen.ca.": "Essential information about the publication, hosting and privacy of jacoballen.ca.",
    "Dernière mise à jour": "Last updated",
    "3 août 2026": "August 3, 2026",
    "Pour toute question : contact@jacoballen.ca": "Questions: contact@jacoballen.ca",
    "Informations légales": "Legal information",
    "Éditeur / 02": "Publisher / 02",
    "Responsable du site": "Site publisher",
    "Ce site personnel est édité par": "This personal website is published by",
    ", au Québec, Canada.": ", in Québec, Canada.",
    "Site": "Website",
    "Hébergement / 03": "Hosting / 03",
    "Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.": "This website is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, United States.",
    "Confidentialité / 04": "Privacy / 04",
    "Mesure d’audience et ressources": "Analytics and resources",
    "Ce site utilise Vercel Web Analytics et Speed Insights afin de mesurer de façon agrégée la fréquentation et les performances techniques. Web Analytics ne dépose pas de témoins publicitaires (« cookies ») et les statistiques ne sont pas utilisées pour vous identifier personnellement. Des données techniques comme la page consultée, le type d’appareil, le navigateur, le pays approximatif et les mesures de performance peuvent être traitées par Vercel.": "This website uses Vercel Web Analytics and Speed Insights to measure aggregate traffic and technical performance. Web Analytics does not place advertising cookies, and statistics are not used to identify you personally. Technical data such as the page viewed, device type, browser, approximate country and performance measurements may be processed by Vercel.",
    "Le bouton J’aime conserve dans le stockage local du navigateur un identifiant aléatoire afin de reconnaître votre choix sans créer de compte. Cet identifiant et la page aimée sont enregistrés dans une base Supabase; ils ne contiennent ni nom ni adresse courriel et peuvent être supprimés en retirant votre J’aime.": "The Like button stores a random identifier in your browser’s local storage to remember your choice without creating an account. This identifier and the liked page are stored in a Supabase database; they contain neither a name nor an email address and can be deleted by removing your Like.",
    "Les polices et les icônes du site sont hébergées localement : leur affichage ne crée aucune requête vers Google Fonts ou cdnjs. Aucun compte utilisateur, formulaire, infolettre ou espace de commentaire n’est proposé sur ce site.": "The site’s fonts and icons are hosted locally, so displaying them creates no requests to Google Fonts or cdnjs. This site offers no user accounts, forms, newsletter or comment section.",
    "Contenu / 05": "Content / 05",
    "Propriété intellectuelle et liens externes": "Intellectual property and external links",
    "Sauf mention contraire, les textes, photographies et éléments graphiques de ce site appartiennent à Jacob Allen. Leur reproduction ou réutilisation substantielle nécessite une autorisation préalable.": "Unless otherwise stated, the text, photographs and graphic elements on this website belong to Jacob Allen. Their reproduction or substantial reuse requires prior permission.",
    "Les liens externes et les liens de parrainage dirigent vers des services tiers qui appliquent leurs propres conditions et politiques de confidentialité. Certains liens de parrainage peuvent procurer un avantage à Jacob Allen sans frais supplémentaires pour le visiteur.": "External and referral links lead to third-party services that apply their own terms and privacy policies. Some referral links may provide a benefit to Jacob Allen at no additional cost to the visitor.",
    "Une question ?": "Questions?",
    "Cette page s’est perdue.": "This page got lost.",
    "Elle a peut-être changé d’adresse ou n’a jamais existé.": "It may have moved or never existed.",
    "Retourner à l’accueil": "Return home"
  };

  const metadata = {
    "/": {
      title: "Jacob Allen - Computing, networking and the outdoors",
      description: "Jacob Allen’s portfolio: computing, networking, self-hosting, sports and personal projects in Québec.",
      ogDescription: "I build, host and learn — from Québec."
    },
    "/about": {
      title: "About — Jacob Allen",
      description: "Jacob Allen’s journey, his computer science studies, homelab and passion for the outdoors.",
      ogDescription: "Curious by nature, technical by passion."
    },
    "/matos": {
      title: "My gear — Jacob Allen",
      description: "The computing, desk, networking, photography and video gear used by Jacob Allen.",
      ogDescription: "The tools behind my projects."
    },
    "/mentions-legales": {
      title: "Legal notice and privacy — Jacob Allen",
      description: "Legal notice, hosting information and privacy policy for jacoballen.ca.",
      ogDescription: "Legal notice and privacy information for jacoballen.ca."
    }
  };

  function translateTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (node.parentElement?.closest("script, style")) return;
      const value = node.nodeValue;
      const trimmed = value.trim();
      if (!translations[trimmed]) return;
      node.nodeValue = value.replace(trimmed, translations[trimmed]);
    });
  }

  function updatePageLinks() {
    document.querySelectorAll('a[href^="/"]').forEach((link) => {
      const raw = link.getAttribute("href");
      const clean = raw.replace(/\.html$/, "").replace(/\/$/, "") || "/";
      if (!pagePaths.has(clean)) return;
      link.setAttribute("href", englishPath ? `/en${clean === "/" ? "" : clean}` : clean);
    });
    if (englishPath) {
      document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.setAttribute("href", `${location.pathname}${link.getAttribute("href")}`);
      });
    }
  }

  document.documentElement.lang = englishPath ? "en" : "fr";

  if (englishPath) {
    translateTextNodes(document.body);
    document.querySelectorAll("[aria-label], [alt]").forEach((element) => {
      ["aria-label", "alt"].forEach((attribute) => {
        const value = element.getAttribute(attribute);
        if (translations[value]) element.setAttribute(attribute, translations[value]);
      });
    });

    const pageMetadata = metadata[frenchPath] || metadata["/"];
    document.title = pageMetadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", pageMetadata.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", pageMetadata.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", pageMetadata.ogDescription);
    document.querySelector('meta[property="og:locale"]')?.setAttribute("content", "en_CA");

    document.querySelectorAll('a[href*="apple.com/ca/fr/"]').forEach((link) => {
      link.href = link.href.replace("/ca/fr/", "/ca/");
    });
    document.querySelectorAll('a[href*="support.apple.com/fr-ca/"]').forEach((link) => {
      link.href = link.href.replace("/fr-ca/", "/en-ca/");
    });
  }

  updatePageLinks();

  const languageSwitch = document.querySelector("[data-language-switch]");
  if (languageSwitch) {
    languageSwitch.href = englishPath ? frenchPath : `/en${frenchPath === "/" ? "" : frenchPath}`;
    languageSwitch.textContent = englishPath ? "FR" : "EN";
    languageSwitch.hreflang = englishPath ? "fr" : "en";
    languageSwitch.setAttribute("aria-label", englishPath ? "Afficher le site en français" : "View this site in English");
  }

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = `https://jacoballen.ca${englishPath ? `/en${frenchPath === "/" ? "" : frenchPath}` : frenchPath}`;
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonical?.href || location.href);
  const englishAlternate = document.querySelector('link[hreflang="en"]');
  const frenchAlternate = document.querySelector('link[hreflang="fr"]');
  if (englishAlternate) englishAlternate.href = `https://jacoballen.ca/en${frenchPath === "/" ? "" : frenchPath}`;
  if (frenchAlternate) frenchAlternate.href = `https://jacoballen.ca${frenchPath}`;

  try {
    localStorage.setItem("jacoballen-language", englishPath ? "en" : "fr");
  } catch (_) {}
})();
