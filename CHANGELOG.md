# CHANGELOG - NRBCOR Protection Civile

Toutes les modifications notables apportées au projet **NRBCOR** sont consignées dans ce document.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/), et ce projet adhère aux principes de gestion sémantique de version.

---

## [1.2.0] - 2026-10-14

### ✨ Ajouté
- **Menu Hamburger avec Regroupement Catégoriel** :
  - Tiroir latéral animé regroupant l'intégralité des fonctionnalités en 5 grandes rubriques :
    1. *Urgence & Réflexes Immédiats* (Mode Réagir, Déshabillage 8 étapes, Confinement étanche, Alerte RNA)
    2. *Fiches & Risques NRBC* (Nucléaire, Chimique, Biologique, Fiche Iode KI 65mg)
    3. *Résilience & Préparation* (Kit 72h, Inventaire & Péremptions, Plan Familial, Géorisques)
    4. *Formation & Exercices* (Simulateurs d'immersion, Minuteur, Quiz interactif)
    5. *Paramètres Système & Données* (Mises à jour, Accessibilité, Sauvegarde JSON, Mentions Légales)
- **Menu Paramètres Système & Gestion des Versions** :
  - Affichage de la date de sortie officielle (`13 Octobre 2026`).
  - Affichage et mémorisation locale de la date de la dernière vérification effectuée.
  - Bouton interactif **« Vérifier les mises à jour »** avec indicateur d'état en direct.
  - Bouton **« Forcer la mise à jour »** avec purge du cache Service Worker et rechargement propre.
- **Mises à Jour Automatiques en Arrière-Plan** :
  - Service Worker doté d'un cycle de vérification périodique (toutes les 15 minutes et lors de la reconnexion réseau) pour installer silencieusement les correctifs doctrinaux et techniques.
  - Interrupteur d'activation / désactivation du service de surveillance en tâche de fond.
- **Support Complet du Thème Clair (Mode Jour)** :
  - Implémentation du sélecteur Thème Clair / Thème Sombre / Système dans l'en-tête, le menu hamburger et les paramètres.
  - Ajustement des contrastes lumineux (WCAG AA) et de la balise `<meta name="theme-color">`.
- **Onboarding Juridique & Décharge Formelle de Responsabilité** :
  - Écran d'accueil au premier lancement avec clause juridique expresse stipulant que l'éditeur et le développeur ne sont pas responsables des données, des protocoles ou des calculs fournis.
  - Case à cocher obligatoire pour débloquer l'accès initial et rappel du caractère strictement indicatif de l'application face aux autorités publiques officielles.
  - Possibilité de revoir à tout moment l'onboarding et les mentions légales depuis le menu hamburger ou les paramètres.
- **Onboarding Contextuel & Infobulles d'Aide (Tooltips)** :
  - Composant `Tooltip` interactif intégré sur les notions clés (calcul d'eau 3L/pers/jour, fenêtre d'iode stable, pièces déconseillées en confinement, contact hors-zone, limitation des appels mobiles).
- **Bouton d'Installation PWA Facile (« Installer l'application »)** :
  - Bouton visible dans le header, le menu hamburger et la page d'accueil pour accompagner les utilisateurs novices.
  - Modal d'instructions détaillée pour iOS (Safari), Android (Chrome) et Desktop (Chrome, Edge).
- **Visuels & Documentation** :
  - Capture d'écran haute résolution de présentation (`public/nrbcor_screenshot.jpg`).
  - Logo officiel SVG vectoriel (`public/logo.svg`).
  - Refonte complète du `README.md` avec badges, tableaux, markdown enrichi et icônes attrayantes.
  - Création des fichiers `CONTEXT.md` et `CHANGELOG.md`.

---

## [1.1.0] - 2026-10-12

### ✨ Ajouté
- **Guides Opérationnels Spécialisés Pas-à-Pas** :
  - Déshabillage et Décontamination d'Urgence (séquence méthodique en 8 étapes avec gestion du sas souillé).
  - Guide Opérationnel du Confinement Étanche avec simulateur de cubage d'air et calcul de durée respiratoire sans VMC.
  - Fiche Iode Stable (Iodure de potassium KI 65mg) avec calculateur posologique par tranche d'âge et avertissement de non-ingestion sans ordre préfectoral.
  - Guide et Synthétiseur Sonore du Signal National d'Alerte (RNA - 3 cycles de 1 min 41 s) et signal de fin d'alerte (30 s continu).
- Catalogue unifié des fiches réflexes opérationnelles.

---

## [1.0.0] - 2026-10-10

### ✨ Version Initiale
- Socle PWA 100% hors-ligne avec cache Workbox.
- 4 grandes fiches réflexes NRBC (Nucléaire, Radiologique, Biologique, Chimique).
- Checklist paramétrique du kit d'urgence 72h avec calculateur de vivres.
- Plan familial de mise en sûreté avec points de ralliement et mode discret.
- Module Géorisques avec recherche de commune, carte radar locale et mise en cache sans régression réseau.
- Simulateur d'immersion et quiz interactif avec score de résilience.
- Sauvegarde, restauration et purge sécurisée locale dans IndexedDB (`nrbc-preparation-db`).
