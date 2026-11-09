# Déploiement de NRBCOR sur Cloudflare Pages

NRBCOR est un site 100 % statique (application PWA + page de présentation) : aucun backend, aucune variable secrète. Le build Vite produit `dist/`, que Cloudflare Pages sert depuis son CDN.

## Ce que contient le dépôt

| Fichier | Rôle |
|---|---|
| `wrangler.toml` | Projet Pages `nrbcor`, dossier publié `./dist` |
| `.node-version` | Node 22 pour le build Cloudflare (et en local avec nvm/fnm) |
| `.npmrc` | `legacy-peer-deps=true` : même résolution des dépendances partout |
| `.puppeteerrc.cjs` | Pas de téléchargement de Chromium en CI ni sur Cloudflare (`CI` / `CF_PAGES`) |
| `public/_headers` | En-têtes de sécurité (CSP, HSTS, Permissions-Policy…) et règles de cache |
| `public/_redirects` | `/presentation` → page de présentation |
| `public/404.html` | Vraie page 404 (désactive le repli SPA de Pages, voir plus bas) |
| `vite.config.ts` | Génère `dist/version.json` à chaque build (version, date, commit) |

## Option A — Connexion GitHub (recommandée)

1. Tableau de bord Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Choisir le dépôt `nouhailler/NRBCOR`, branche de production `main`.
3. Paramètres de build :
   - **Framework preset** : `None` (ou `Vite`)
   - **Build command** : `npm run build`
   - **Build output directory** : `dist`
   - **Variables d'environnement** : aucune n'est requise. `NODE_VERSION` est inutile grâce à `.node-version`. `VITE_APP_URL` est optionnelle (lien « Découvrir l'application » de la page de présentation).
4. **Save and Deploy**. Chaque push sur `main` déploie en production ; chaque PR obtient une URL de prévisualisation.

## Option B — Wrangler (ligne de commande)

```bash
npx wrangler login          # une seule fois
npm run cf:deploy           # build + wrangler pages deploy dist --project-name nrbcor
```

Le projet `nrbcor` est créé au premier déploiement s'il n'existe pas.

## Tester localement comme sur Cloudflare

```bash
npm run cf:dev              # build + wrangler pages dev dist (http://localhost:8788)
```

L'émulateur applique `_headers`, `_redirects` et la page 404. Pour vérifier qu'aucune ressource n'est bloquée par la CSP :

```bash
npx tsx scripts/ux-smoke.ts http://localhost:8788
npx tsx scripts/ux-capture.ts ux-shots http://localhost:8788 light   # signale les erreurs console
```

## Points d'attention

- **CSP** : `script-src 'self'` sans script inline. Le thème initial et l'enregistrement du Service Worker sont dans `public/theme-init.js` et `public/sw-register.js`. Si l'application appelle un nouveau service externe, ajoutez son hôte à `connect-src`, qui s'applique aussi aux `fetch()` du Service Worker. Pour une image, ajoutez-le aussi à `img-src`.
- **Pas de repli SPA** : sans `404.html`, Pages renvoie `index.html` pour toute URL inconnue, y compris un ancien fichier `/assets/…` après un redéploiement, avec le cache « immutable » d'un an. L'application n'utilisant que des paramètres (`?tab=`, `?sub=`), la page 404 est sans effet sur la navigation et protège les clients restés sur une ancienne version.
- **Mises à jour PWA** : `sw.js`, `version.json` et le manifeste ne sont jamais mis en cache par le navigateur ; les fichiers `/assets/*` (avec empreinte) le sont un an.
- **Caméra et géolocalisation** : autorisées pour la même origine (`Permissions-Policy`). Elles sont nécessaires au scan du QR code du plan familial et à la localisation Géorisques.
- **Domaine personnalisé** : `robots.txt` et `sitemap.xml` pointent vers `https://nrbcor.pages.dev`. Mettez-les à jour si vous ajoutez un domaine.
- **Images distantes** : les illustrations des protocoles viennent de `lh3.googleusercontent.com` et ne s'affichent pas hors ligne. Les rapatrier dans `public/` lèverait cette dépendance.
