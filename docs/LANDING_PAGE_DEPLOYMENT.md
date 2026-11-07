# Guide de Déploiement : Landing Page NRBCOR

Ce document fournit les instructions pas-à-pas pour déployer la **Landing Page NRBCOR** de manière autonome et gratuite sur **Cloudflare Pages** ou **Netlify**.

---

## 1. Caractéristiques Techniques de la Landing Page

- **Framework :** React 19, TypeScript, Vite, Tailwind CSS v4.
- **Ressources statiques :** 100% statique, sans backend ni base de données distante.
- **Internationalisation :** Français (par défaut) et Anglais (parité 100%).
- **SEO & Partage :** Métadonnées complètes, OpenGraph, Twitter Cards, Schema.org JSON-LD (`WebApplication`), `sitemap.xml`, `robots.txt`.
- **Fichiers de routage préconfigurés dans `/public` :**
  - `_redirects` : Redirection automatique des alias `/landing` et `/presentation` vers `landing.html`.
  - `_headers` : En-têtes HTTP de sécurité (CSP, X-Content-Type-Options, Permissions-Policy) et mise en cache des assets statiques.

---

## 2. Déploiement Gratuit sur Cloudflare Pages

### Option A : Déploiement Direct depuis GitHub (Recommandé)

1. Connectez-vous à votre tableau de bord **Cloudflare** et rendez-vous dans **Workers & Pages**.
2. Cliquez sur **Create application** > onglet **Pages** > **Connect to Git**.
3. Sélectionnez le dépôt `nouhailler/NRBCOR`.
4. Configurez les paramètres de build :
   - **Framework preset :** `Vite` (ou `None`)
   - **Build command :** `npm run build`
   - **Build output directory :** `dist`
   - **Node.js version :** `20` ou `22` (ajouter la variable d'environnement `NODE_VERSION=20` si nécessaire).
5. (Optionnel) Variable d'environnement pour lier l'application PWA hébergée :
   - `VITE_APP_URL` : `https://votre-app-nrbcor.domaine.fr`
6. Cliquez sur **Save and Deploy**.
7. En moins de 60 secondes, votre landing page est en ligne avec certificat SSL gratuit, CDN mondial et protection DDoS automatique.

### Option B : Déploiement via Wrangler CLI

```bash
# Compiler le projet
npm run build

# Déployer le dossier dist sur Cloudflare Pages
npx wrangler pages deploy dist --project-name=nrbcor-landing
```

---

## 3. Déploiement Gratuit sur Netlify

### Option A : Déploiement Automatique via Git

1. Rendez-vous sur [Netlify](https://app.netlify.com) et cliquez sur **Add new site** > **Import an existing project**.
2. Liez votre compte GitHub et sélectionnez `nouhailler/NRBCOR`.
3. Renseignez la configuration de build :
   - **Base directory :** Laisser vide (racine)
   - **Build command :** `npm run build`
   - **Publish directory :** `dist`
4. Cliquez sur **Deploy site**.
5. Netlify prendra automatiquement en compte les fichiers `_redirects` et `_headers` situés dans `dist/`.

### Option B : Déploiement Manuel par Glisser-Déposer (Netlify Drop)

1. Exécutez en local :
   ```bash
   npm run build
   ```
2. Rendez-vous sur [app.netlify.com/drop](https://app.netlify.com/drop).
3. Glissez-déposez l'intégralité du dossier `dist/` généré. Le site est immédiatement accessible.

---

## 4. Configuration Personnalisée des Liens (`src/config/landingConfig.ts`)

Tous les liens sont centralisés dans le fichier `src/config/landingConfig.ts` :

```typescript
export const LANDING_CONFIG = {
  appName: 'NRBCOR',
  githubUrl: 'https://github.com/nouhailler/NRBCOR',
  docsUrl: 'https://github.com/nouhailler/NRBCOR#readme',
  releasesUrl: 'https://github.com/nouhailler/NRBCOR/releases',
  appUrl: import.meta.env.VITE_APP_URL || '/?view=app', // URL vers l'app PWA
  version: 'v1.6.0',
  author: 'Patrick Nouhailler',
  license: 'Open Source MIT'
};
```

Pour pointer le bouton « Découvrir l'application » vers une URL externe distincte de la landing page, définissez simplement la variable d'environnement `VITE_APP_URL` lors du build (ex. dans Cloudflare ou Netlify).

---

## 5. Vérification du Référencement & Social Share

- **Linter OpenGraph :** Utilisez [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) ou [Twitter Card Validator](https://cards-dev.twitter.com/validator) pour vérifier l'affichage des cartes d'aperçu avec l'image `nrbcor_screenshot.jpg`.
- **Sitemap :** Disponible sur `/sitemap.xml`.
- **Robots :** Configuré sur `/robots.txt` autorisant l'indexation de tous les moteurs de recherche.
