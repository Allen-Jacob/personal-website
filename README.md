# jacoballen.ca — page de liens

Site statique (HTML + CSS pur, zéro dépendance) prêt à déployer sur Vercel.

## Fichiers

- `index.html` — la page d’accueil et les liens essentiels
- `about.html` — la présentation personnelle
- `matos.html` — le matériel, regroupé par catégories
- `404.html` — la page d’erreur personnalisée
- `style.css` — les couleurs, composants et adaptations mobiles
- `effects.js` — les étoiles et le halo pour les appareils avec souris
- `sitemap.xml` et `robots.txt` — les fichiers d’indexation
- `vercel.json` — les redirections d'URL courtes (ex. `jacoballen.ca/youtube`)
- `README.md` — ce fichier

## Déployer sur Vercel

1. Crée un compte sur [vercel.com](https://vercel.com) si ce n'est pas déjà fait.
2. Mets ce dossier dans un repo GitHub (ou glisse-le directement dans Vercel avec "Add New… → Project → Deploy" en important le dossier).
3. Dans les réglages du projet Vercel, ajoute ton domaine `jacoballen.ca` (Settings → Domains).
4. Pousse tes changements : Vercel redéploie automatiquement à chaque `git push`.

## Ajouter / enlever une case de lien

Dans `index.html`, chaque case est un bloc du genre :

```html
<a class="card" href="/instagram">
  <span class="card-icon"> ... svg ... </span>
  <span class="card-text">
    <span class="card-title">Instagram</span>
  </span>
  <span class="card-chevron">›</span>
</a>
```

- **Pour enlever une case** : supprime tout le bloc `<a class="card">…</a>`.
- **Pour ajouter une case** : copie un bloc existant, colle-le où tu veux dans la liste, change le `href`, l'icône (SVG) et le texte.
- Pour une case avec sous-titre coloré (style "Parrainages"), ajoute une deuxième ligne :
  `<span class="card-subtitle">Ton texte</span>` juste après `card-title`, et mets la classe `card sponsor` sur le `<a>`.

Tu n'as pas besoin de toucher au CSS pour ajouter/enlever des cases — le style s'applique automatiquement.

## Gérer les liens courts (jacoballen.ca/youtube → ta vraie URL)

Tout se passe dans `vercel.json`. Chaque ligne fait un lien court :

```json
{ "source": "/youtube", "destination": "https://youtube.com/@tonpseudo", "permanent": false }
```

- `source` = le chemin court après ton domaine (donc `jacoballen.ca/youtube`)
- `destination` = l'URL complète vers laquelle rediriger
- `permanent: false` = redirection 307 (temporaire). Utile pendant que tu changes encore tes liens.
  Une fois que tes URLs sont stables, tu peux mettre `true` pour une redirection 301 (permanente, mieux
  référencée), mais les navigateurs et Google mettent alors le résultat en cache plus longtemps.

**Pour ajouter un lien court** : ajoute une ligne dans le tableau `redirects` (n'oublie pas la virgule entre
les lignes). Redéploie (`git push`), et Vercel s'occupe du reste — pas besoin de créer de nouvelle page.

**Important :** les valeurs `TON-PSEUDO`, `TON-LIEN-DE-BOOKING`, etc. dans `vercel.json` et les `href`
dans `index.html` sont des exemples à remplacer par tes vraies infos avant de déployer.

## Outils de diagnostic Vercel (déjà branchés dans le code)

Le fichier `index.html` contient déjà les balises `<script>` pour :

- **Vercel Web Analytics** (trafic, pages vues)
- **Vercel Speed Insights** (performance, Core Web Vitals)

Pour qu'ils fonctionnent, il faut juste les **activer côté dashboard** (aucun code à ajouter en plus) :

1. Va sur [vercel.com](https://vercel.com/dashboard) → ton projet.
2. Onglet **Analytics** → clique **Enable**.
3. Onglet **Speed Insights** → clique **Enable**.
4. Redéploie une fois si les onglets viennent d'être activés.

Les données apparaissent après quelques visites réelles sur le site.

## Personnaliser l'avatar

Par défaut l'avatar est un cercle avec les initiales "JA". Pour utiliser une vraie photo :

```html
<div class="avatar">
  <img src="ta-photo.jpg" alt="Jacob Allen" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">
</div>
```

Mets `ta-photo.jpg` dans le même dossier que `index.html`.
