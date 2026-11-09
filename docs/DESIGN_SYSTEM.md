# Design System NRBCOR — « Modern Civil Protection Dashboard »

Source unique : `src/index.css`. Tous les écrans utilisent ces tokens via les utilitaires Tailwind (`bg-*`, `text-*`, `border-*`).

## Couleurs (tokens sémantiques)

| Rôle | Fond (`bg-`) | Contenu (`text-` / `border-`) | Usage |
|---|---|---|---|
| Structure | `navy`, `navy-2` | `on-navy`, `on-navy-soft`, `on-navy-muted` | Bandeaux, panneaux sombres |
| Action principale | `brand`, `brand-strong` | `brand-ink` | Boutons primaires, liens |
| Fonds | `canvas` (page), `card` (cartes), `subtle`, `tint`, `tint-strong` | — | Surfaces neutres |
| Textes | — | `ink`, `ink-muted`, `ink-faint` | Principal, secondaire, discret |
| Bordures | — | `line`, `line-strong` | Séparateurs, contours |
| Disponible / favorable | `ok`, `ok-soft`, `ok-deep` | `ok-ink`, `ok-line`, `ok-bright` | **Vert** |
| Vigilance | `warn`, `warn-soft` | `warn-ink`, `warn-line`, `warn-bright` | **Orange** |
| Danger / urgence | `danger`, `danger-strong`, `danger-soft` | `danger-ink`, `danger-line`, `danger-bright` | **Rouge — réservé aux alertes et actions critiques** |

Règles : fonds neutres, couleurs en accent ; pas de nouvelle couleur hexadécimale codée en dur.

## Thèmes
- `.dark` sur `<html>` (piloté par `App.tsx`, appliqué avant rendu dans `index.html`) redéfinit les tokens.
- La palette Tailwind (`gray`, `amber`, …) est adaptée par rôle : fonds clairs assombris, textes foncés éclaircis.
- `.theme-fixed` restaure les valeurs claires : utilisé par le **mode CRISE**, conçu à contraste fixe.

## Typographie
Inter (local, `public/fonts/`), hiérarchie : `ds-page-title` (24→28 px), `ds-section-title` (17 px), texte 14–15 px, `ds-eyebrow` (11 px capitales). Icônes : Material Symbols Outlined (local).

## Composants
`ds-container` · `ds-card` · `ds-btn` + `ds-btn-primary | secondary | ghost | danger` · `ds-icon-btn` · `ds-badge` + `ds-badge-ok | warn | danger | info | neutral` · `ds-progress` · `ds-input`.
Cibles tactiles ≥ 44 px ; rayons 12–14 px ; ombres légères (`--shadow-card`, `--shadow-raised`).

## Vérifier
```bash
npx vite preview --port 4173 &
npx tsx scripts/ux-capture.ts ux-shots http://localhost:4173 light   # ou dark
npx tsx scripts/ux-smoke.ts
```
