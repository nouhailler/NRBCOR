# CHANGELOG - NRBCOR Protection Civile

Toutes les modifications notables apportées au projet **NRBCOR** sont consignées dans ce document.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/), et ce projet adhère aux principes de gestion sémantique de version.

---

## [1.3.0] - 2026-10-15

### ✨ Ajouté
- **Priorité 5 — Tableau de bord « Suis-je prêt ? » (Parcours de Résilience Concret & Mesurable)** :
  - **Score de Préparation Explicite du Foyer (100 Pts)** :
    - Algorithme transparent fondé sur 5 piliers audités sans boîte noire :
      1. *Réserves Vitales (Eau & Alimentation)* — 25 pts (3L/jour/personne + 0,5L/jour/animal, rations sans cuisson, purification).
      2. *Énergie, Éclairage & Communication d'Alerte* — 20 pts (Radio FM/DAB+ indépendante, lampes frontales/torches, Powerbank, piles neuves).
      3. *Santé, Hygiène & Besoins Spécifiques* — 20 pts (Trousse normée DIN 13164, réserve 15-30j ordonnances chroniques, prise en compte PMR/nourrisson/animaux).
      4. *Plan Familial & Procédures de Repli* — 20 pts (Relais hors-zone > 100 km, point de ralliement, vannes d'arrêt eau/gaz/VMC validées).
      5. *Vigilance Logistique & Maintenance* — 15 pts (Suivi semestriel, 0 produit périmé, kit calfeutrage hermétique & masques FFP3).
    - **Avertissement déontologique rigoureux** : Exclusion absolue de toute fausse promesse d'invulnérabilité ou d'immunité face aux sinistres majeurs ; rappel continu de la primauté des ordres de la Sécurité Civile.
  - **Prise en Compte Personnalisée du Foyer & Vulnérabilités Spécifiques** :
    - Compteurs configurables : adultes, enfants (4-12 ans, PPMS école), nourrissons (lait infantile, couches, sérum physiologique), personnes âgées et animaux de compagnie.
    - Interrupteurs pour personnes à mobilité réduite (PMR), affections de longue durée (ALD) sous traitement vital, et voisinage d'installations Seveso ou centrales nucléaires (périmètre PPI).
    - Durée de coupure visée paramétrable (48h, 72h ou 7 jours).
  - **Jauges d'Autonomie Réelle en Coupure Totale** :
    - *Eau Potable* : Autonomie calculée en heures et jours selon les besoins vitaux réels, avec bouton d'ajout rapide d'un pack de 9L.
    - *Alimentation de Survie* : Nombre de rations sans cuisson sécurisées et heures d'autonomie.
    - *Éclairage Autonome* : Heures d'éclairage LED disponibles estimées selon le stock de piles.
    - *Énergie & Info Radio* : Nombre de recharges smartphone et confirmation de la radio d'urgence FM autonome.
  - **Audit des Éléments Manquants & Actions de Progrès** :
    - Liste triée par criticité (Vital, Sécurité, Logistique) avec bouton d'acquisition en 1 clic mettant à jour IndexedDB et le score en direct.
    - Détection automatique des produits périmés ou à renouveler sous 60 jours avec bouton de validation d'audit semestriel.
    - File d'actions recommandées hiérarchisées avec mention du gain de points (+3 à +8 pts).
  - **Fiche Synthèse Imprimable** :
    - Bouton d'impression locale de la fiche mémo pour affichage au domicile ou insertion dans le classeur de crise familial.

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
- **Priorité 1 — Fiabilisation Doctrinale des Consignes de Sécurité** :
  - **Confinement différencié par scénario** : Sélecteur interactif Chimique / Nucléaire / Biologique avec consignes d'emplacement adaptées (interdiction stricte des sous-sols et combles en chimique vs sous-sol bétonné hautement protecteur pour l'atténuation gamma en nucléaire).
  - **Simulateur d'Air & Montée en CO2** : Avertissement explicite de non-substitution opérationnelle, plafonnement doctrinal à la fenêtre critique (2h à 6h), et rappel impératif d'aérer dès la fin d'alerte officielle sans différer l'ordre des autorités.
  - **Fiche Iode Stable (KI 65mg)** : Onglets interactifs détaillant les posologies ASN certifiées, la fenêtre temporelle critique (1-2h avant passage du nuage, inutile après 24h), les contre-indications médicales officielles et une mise en garde formelle contre les faux remèdes mortels (ingestion de Bétadine ou sel de cuisine).
  - **Risques Chimiques** : Intégration de la consigne d'évacuation perpendiculaire au vent (90°), rappel de l'inefficacité totale des masques FFP2/FFP3 contre les gaz toxiques, et limitation du linge humide comme pis-aller temporaire d'ultime recours.
- **Audit & Opérationnalité du Module Géorisques** :
  - **Géolocalisation GPS Réelle W3C** : Remplacement de la simulation par l'appel effectif à `navigator.geolocation.getCurrentPosition`, reverse-geocoding officiel via `geo.api.gouv.fr` et projection géodésique hors-ligne (Haversine) sur base locale enrichie (Lyon, Feyzin, Saint-Vulbas, Rouen, Dunkerque, Fos-sur-Mer, etc.).
  - **Actualisation Réelle en Ligne** : Connexion effective à l'API publique nationale Géorisques (data.gouv.fr / GASPAR) avec parsing des arrêtés préfectoraux et gestion explicite du blocage hors-ligne sans fausse simulation.
  - **Export Réel d'Instantané Territorial** : Génération et téléchargement réel d'un fichier normé `instantane-georisques-[commune]-[date].json` sur le terminal utilisateur avec sauvegarde locale.
  - **Panneau de Transparence Doctrinale** : Distinction claire et visible entre fonctions opérationnelles (🟢), schématisation didactique locale (🟡) et fonctionnalités nécessitant un accès réseau (🔵).
- **Priorité 4 — Unification de la Persistance Locale & Stratégie Double-Niveau** :
  - **IndexedDB en Moteur Principal d'Autorité** : Centralisation de l'ensemble des collections de données (`settings`, `checklistItems`, `familyPlans`, `inventoryItems`, `localRiskSnapshots`, `quizProgress`) dans la base locale `nrbc-preparation-db`.
  - **Miroir Local Synchrone (`localStorage`)** : Cache d'amorçage pour le thème clair/sombre et les paramètres de démarrage garantissant un rendu sans clignotement ni latence.
  - **Archive de Sauvegarde Intégrale V2 (`NRBCOR_BACKUP_V2`)** : Export et import unifiés incluant le Kit 72h, le Plan Familial, l'Inventaire des vivres et les préférences avec validation stricte du schéma et rétrocompatibilité V1.
  - **Purge Sécurisée Totale (Wipe)** : Réinitialisation propre et simultanée de tous les magasins IndexedDB et des clés de cache miroir sans résidu.
  - **Tableau de Bord Diagnostique** : Monitoring en direct de l'état des magasins et de l'espace alloué par le navigateur (`navigator.storage.estimate`) dans l'écran Paramètres.
- **Visuels & Documentation** :
  - Capture d'écran haute résolution de présentation (`public/nrbcor_screenshot.jpg`).
  - Logo officiel SVG vectoriel (`public/logo.svg`).
  - Refonte complète du `README.md` avec badges, tableaux, markdown enrichi et icônes attrayantes.
  - Création et enrichissement des fichiers `CONTEXT.md` et `CHANGELOG.md`.

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
