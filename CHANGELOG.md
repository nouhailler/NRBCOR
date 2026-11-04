# CHANGELOG - NRBCOR Protection Civile

Toutes les modifications notables apportées au projet **NRBCOR** sont consignées dans ce document.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/), et ce projet adhère aux principes de gestion sémantique de version.

---

## [1.6.0] - 2026-11-04

### 🌐 Internationalisation Intégrale Bilingue & Parité 100% (Français & Anglais)
- **Architecture i18n Décentralisée & Hors-Ligne (`src/i18n/`)** :
  - `src/i18n/I18nContext.tsx` : Contexte React léger avec persistance double (IndexedDB et miroir synchrone `localStorage['nrbcor_language']`), synchronisation automatique de l'attribut `<html lang="...">`, formatage natif `Intl.DateTimeFormat` et `Intl.NumberFormat`.
  - `src/i18n/locales/fr.ts` & `src/i18n/locales/en.ts` : 248 paires de clés parfaitement symétriques couvrant l'ensemble des modules applicatifs.
  - **Traduction intégrale des jeux de données doctrinaux et pédagogiques** :
    - `src/i18n/content/protocols.en.ts` & `localizedProtocols.ts` : Les 5 protocoles CBRN complets (Nucléaire, Radiologique, Biologique, Chimique, Confinement).
    - `src/i18n/content/kit.en.ts` & `localizedKit.ts` : 18 articles du kit 72h et 6 catégories, avec préservation stricte des IDs canoniques (`k1`..`k18`).
    - `src/i18n/content/encyclopedia.en.ts` & `localizedEncyclopedia.ts` : 25 termes du glossaire NRBC, 4 grandes ères historiques, 5 doctrines géopolitiques et 4 catégories d'arsenal technologique.
    - `src/i18n/content/quiz.en.ts` & `localizedQuiz.ts` : 4 scénarios d'immersion opérationnelle, 2 quiz complets (Irradiation/Contamination & Décontamination d'urgence), 3 modules complémentaires et 4 scénarios de formation collective.
    - `src/i18n/content/coherenceMatrix.en.ts` & `localizedCoherenceMatrix.ts` : 6 scénarios de cohérence d'urgence anti-fausse sécurité.
    - `src/i18n/content/familyPlan.en.ts` & `localizedFamilyPlan.ts` : Tâches canoniques (`t1`..`t5`), membres du foyer et points de rassemblement.
- **Sélecteur de Langue Ergonomique & Accessible (`src/components/LanguageSwitcher.tsx`)** :
  - Variante compacte intégrée en tête d'application (`Header.tsx`) pour une permutation instantanée 1-tap.
  - Variante complète avec drapeaux et descriptifs dans le menu hamburger (`HamburgerMenu.tsx`) et dans les paramètres (`SettingsView.tsx`).
- **Suppression du parasite visuel "NU x _" sur les cartes CNPE (`CartePerimetresView.tsx`)** :
  - Remplacement de l'artefact par un composant d'icône SVG vectoriel autonome et épuré (`src/components/icons/NuclearPowerIcon.tsx`) représentant fidèlement une tour de réfrigération aéroréfrigérante de centrale nucléaire (CNPE).
- **Contrôles Automatisés de Non-Régression & CI (`npm test`)** :
  - **469 vérifications automatisées réussies à 100%** :
    - `scripts/run-readiness-tests.ts` : 227 tests d'autonomie, fraîcheur Géorisques, calculs de besoins du foyer et matrice anti-fausse sécurité.
    - `scripts/run-i18n-tests.ts` : 242 tests de parité des dictionnaires, intégrité des IDs canoniques, non-régression des magasins de données et validité des formats régionaux.

---

## [1.5.0] - 2026-11-01

### 📚 Encyclopédie & Glossaire Exhaustif du Risque NRBC
- **Mini-Encyclopédie Documentée du Risque NRBC (`src/data/encyclopediaData.ts` & `src/views/EncyclopedieView.tsx`)** :
  - **Définition & Ontologie du Risque** : Nature insidieuse et invisible des agents non conventionnels, différence entre accident industriel/technologique et menace asymétrique/terroriste, composante psychologique et effets de panique.
  - **Grande Fresque Historique (4 Époques Majeures)** :
    1. *Naissance de la guerre chimique moderne (1914-1925)* : Ypres 1915 (Fritz Haber et nuage de chlore), phosgène, ypérite en 1917, premiers masques à gaz et Protocole de Genève de 1925.
    2. *Seconde Guerre Mondiale & Âge Atomique (1936-1945)* : Découverte des neurotoxiques organophosphorés (Tabun, Sarin par Gerhard Schrader), crimes biologiques de l'Unité 731 en Chine, projet Manhattan et détonations d'Hiroshima et Nagasaki.
    3. *Guerre Froide & Équilibre de la Terreur (1947-1991)* : Synthèse du VX, course aux mégatonnes et doctrine MAD, accident biologique de Sverdlovsk (1979), catastrophe nucléaire de Tchernobyl (1986) et formalisation de la radioprotection ALARA.
    4. *Ère Contemporaine & Menaces Hybrides (1995-Présent)* : Attentat au Sarin dans le métro de Tokyo par Aum Shinrikyo (1995), attaques à l'anthrax postal (2001), accident de Fukushima (2011), résurgence des Novitchok (Salisbury 2018).
  - **Conceptualisation par les Différents Pays & Armées** :
    - *France* : Continuum Défense/Sécurité Nationale, SGDSN, plans gouvernementaux PIRATOX/BIOTOX/PIRATOME, 2e Régiment de Dragons, détachements spécialisés CMIC/CMIR des sapeurs-pompiers et Service de Santé des Armées.
    - *Suisse* : Modèle fédéral unique au monde de protection civile intégrale, 370 000 abris civils couvrant plus de 100% de la population, centrale CENAL et application Alertswiss, distribution préventive d'iode sur 50 km.
    - *États-Unis* : Joint CBRN Defense Program (JPEO-CBRND), doctrine MOPP 0 à 4, Strategic National Stockpile (SNS), 20th CBRNE Command et équipes WMD-CST.
    - *Russie / Ex-URSS* : Troupes autonomes RKhBZ, décontamination thermique massive sur turboréacteurs (TMS-65), abris profonds métropolitains étanches.
    - *Israël* : Défense passive universelle (Pikoud HaOref), obligation légale des abris résidentiels renforcés (Mamad) dans chaque logement, distribution universelle de kits de masques à gaz civils.
  - **Arsenal Technologique Développé pour le Combattre** :
    - *Détection & Mesure* : Compteurs Geiger-Müller, spectromètres de mobilité ionique (IMS), tubes colorimétriques réactifs Dräger, PCR mobile et bandelettes immunologiques.
    - *Protection Individuelle & Collective* : Masques panoramiques à cartouche combinée ABEK2P3 (explication des bandes A, B, E, K, P3), tenues étanches pressurisées Type 1, abris ventilés sous surpression avec préfiltres et charbon actif.
    - *Décontamination* : Déshabillage d'urgence méthodique, gants poudreurs à la Terre de Foulon, solutions alcalines et douches tièdes sans abrasion.
    - *Antidotes & Contre-Mesures* : Auto-injecteurs atropine + pralidoxime contre neurotoxiques, iodure de potassium KI 65 mg pour saturation thyroïdienne, chélateurs (Bleu de Prusse, DTPA).
- **Glossaire Terminologique Complet A-Z** :
  - Dictionnaire de plus de 20 notices détaillées couvrant les composantes N, R, B, C, matériel, secours et doctrines.
  - Recherche textuelle en direct, filtres par catégorie, index alphabétique et liens croisés.
- **Intégration Ergonomique dans l'Applet** :
  - Accessible depuis le menu hamburger (Catégorie 2), la grille d'accueil et le catalogue des guides.

---

## [1.4.0] - 2026-10-28

### 🛡️ P0 & P1 - Audit Déontologique & Corpus de Sécurité Civile
- **Vérificateur Automatisé de Corpus (`scripts/verify-corpus.ts`)** :
  - Validation syntaxique RFC 3986 de 100% des URLs institutionnelles (Légifrance, ASNR, Ineris, SGDSN, etc.).
  - Vérification des champs obligatoires, unicité des identifiants et intégrité des métadonnées juridiques.
  - Élimination des dates de révision hardcodées factices ; distinction rigoureuse entre validation automatisable par machine et validation humaine médicale/opérationnelle.
  - Intégration et contrôle des doctrines transfrontalières (Suisse: OFPP/BABS, CENAL, OFSP/BAG ; Belgique: NCCN, AFCN ; International: AIEA, OMS).
- **Intégration Continue GitHub Actions (`.github/workflows/ci.yml`)** :
  - Pipeline automatisé exécutant le linter TypeScript strict, l'audit du corpus doctrinal, les 227 tests de résilience et la compilation Vite PWA.

### 🚨 P1 & P2 - Parcours Réflexes d'Urgence & Cohérence Opérationnelle
- **Matrice de Cohérence des 6 Scénarios Critiques (`EmergencyCoherenceMatrixModal.tsx`)** :
  - Audit et vérification opérationnelle des 6 cas d'urgence :
    1. Alerte officielle avec consigne de confinement (calfeutrage, arrêt VMC, aération post-alerte).
    2. Demande d'évacuation immédiate (itinéraires, consignes d'emport minimal, kit 72h).
    3. Événement de nature inconnue (pas de déduction hâtive, triptyque temps/distance/écran).
    4. Coupure de réseau pendant la consultation (mode hors-ligne absolu, radio FM 107.1 / RTS / RTBF).
    5. Fiche absente, ancienne ou non validée (signalement explicite, prudence maximale).
    6. Contradiction entre fiche pédagogique et consigne préfectorale (primauté absolue des autorités).
- **Raccourci 1-Tap « Que faire maintenant ? » (`EmergencyReflexModal.tsx`)** :
  - Triage réflexe 0-60 secondes pour situation de stress extrême accessible en 1 clic.
  - Annuaire d'urgence multi-pays contextuel (France, Suisse, Belgique, Luxembourg) avec composition directe 1-tap (`tel:`).
  - Trame standardisée d'appel aux services de secours (Qui, Où, Quoi, Combien, Actions réalisées).

### 📊 P1 - Tableau de Bord de Préparation Réellement Explicable
- **Calculs Transparent et Hypothèses Documentées (`readinessScore.ts` & `SuisJePretView.tsx`)** :
  - Autonomie en eau et alimentation calculée sur une base claire (3 L/pers/jour + besoins spécifiques).
  - Détail des besoins ventilés selon la composition du foyer (adultes, enfants, nourrissons, aînés, PMR, animaux).
  - Section dédiée « Informations manquantes & Données estimées » pour ne jamais masquer les approximations.
  - File d'attente des « 3 actions les plus utiles à effectuer immédiatement ».
  - Badge d'évolution du score par rapport à l'évaluation précédente (+/- X%).
  - Distinction stricte entre case cochée dans une checklist et quantité physique mesurée dans l'inventaire.

### 📄 P1 - Dossier de Secours Personnel & Mode Formateur
- **Générateur de Fiche Personnelle de Secours (`PersonalEmergencyDossierModal.tsx`)** :
  - Sélection granulaire des rubriques à imprimer (contacts prioritaires, points de repli, besoins spécifiques, données médicales).
  - Confidentialité 100% locale : avertissement clair, exclusion stricte des données médicales des exports QR code ou partagés.
  - Feuille de style dédiée pour impression papier noir et blanc économique et compacte (fiche de poche A4).
- **Simulateur de Session Collective / Mode Formateur (`TrainerSessionModal.tsx`)** :
  - 4 scénarios d'exercice guidés (Nuage toxique Seveso, Alerte confinement école, Panache nucléaire, Coupure hivernale).
  - Objectifs pédagogiques formels, pièges mortels à débriefer et fiche de synthèse imprimable.

### 💾 P1 - Sauvegarde & Restauration Sécurisée
- **Service Dédié (`backupRestoreService.ts`)** :
  - Validation de schéma JSON avant restauration, protection anti-écrasement involontaire, comptage des entités et compatibilité descendante V1/V2.

### 🎨 P2 - Ergonomie & Correction Graphique
- **Suppression du texte parasite "NU x _"** :
  - Remplacement de la ligature défectueuse `nuclear_power` par le composant vectoriel SVG propre `NuclearPowerIcon.tsx` dans `CartePerimetresView.tsx` et `HamburgerMenu.tsx`.

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
