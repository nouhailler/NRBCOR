# Checklist d'Audit et de Recette Opérationnelle NRBCOR

Ce protocole de test permet d'auditer l'intégrité fonctionnelle, ergonomique et doctrinale de l'application avant toute mise en production ou exercice de terrain.

---

## 1. Tests de Résilience Hors-Ligne & PWA (P0)

- [ ] **Déconnexion réseau totale (Mode Avion) :**
  - Activer le mode avion sur le terminal ou couper le réseau dans les DevTools (`Network: Offline`).
  - L'application se charge instantanément sans page blanche ni écran d'erreur 500.
  - La bannière indique explicitement « Hors-Ligne • Données Embarquées ».
- [ ] **Persistance du Service Worker :**
  - Vérifier la mise en cache des assets statiques (`dist/assets/*`, fonts, manifest).
- [ ] **Accès complet aux guides d'urgence hors-ligne :**
  - Les 5 guides (Nucléaire, Radiologique, Biologique, Chimique, Confinement) sont consultables avec l'ensemble des étapes réflexes et schémas.
- [ ] **Radar et Carte Hors-Ligne :**
  - Le radar concentrique (50 km) et la carte vectorielle nationale (41 sites majeurs) fonctionnent sans aucune requête externe vers OpenStreetMap, Google Maps ou Mapbox.
  - La recherche de communes et le calcul de distance haversine s'exécutent localement en mémoire en moins de 10 ms.

---

## 2. Tests de Sécurité Doctrinale & Cohérence Opérationnelle (P0 / P1)

- [ ] **Verrou d'automédication iode :**
  - Ouvrir le calculateur d'iode ou la fiche réflexe nucléaire.
  - Vérifier la présence du bandeau rouge d'interdiction formelle de prise préventive sans ordre préfectoral.
  - Vérifier la mention de l'absence de bénéfice au-delà de 40 ans et de l'inefficacité totale face aux accidents chimiques.
- [ ] **Matrice des 6 scénarios de crise :**
  - Ouvrir la Matrice de Cohérence depuis le Mode Crise ou l'onglet Réagir.
  - Tester les 6 scénarios :
    1. Consigne de confinement officiel.
    2. Ordre d'évacuation immédiate.
    3. Événement de nature inconnue (odeur, déflagration).
    4. Coupure complète du réseau cellulaire.
    5. Fiche absente ou non validée.
    6. Contradiction entre fiche pédagogique et consigne préfectorale récente.
  - Confirmer que chaque fiche rappelle que l'ordre officiel des autorités prévaut systématiquement.
- [ ] **Triage d'Urgence "Que faire maintenant ?" :**
  - Ouvrir le modal depuis l'onglet Réagir.
  - Tester les 4 pays (France, Suisse, Belgique, Luxembourg) : les bons numéros de secours apparaissent avec le préfixe d'appel `tel:`.
  - La trame de message type aux secours (Qui, Où, Quoi, Combien, Actions) est accessible en 1 clic.

---

## 3. Tests du Tableau de Bord de Préparation & Calculs d'Autonomie (P1)

- [ ] **Explicabilité de l'autonomie en eau :**
  - Définir un foyer de 3 personnes et une réserve de 27 L.
  - Vérifier que l'application calcule exactement 3 jours d'autonomie sur l'hypothèse explicite de 3 litres / jour / personne (2L boisson + 1L hygiène minimale).
  - Modifier les paramètres de besoins spécifiques (présence d'un nourrisson ou animal) : vérifier que le calcul s'ajuste et documente les hypothèses.
- [ ] **Différenciation "Case cochée" vs "Stock physique vérifié" :**
  - Cocher un item dans la checklist sans avoir renseigné de quantité dans l'inventaire : le tableau de bord distingue le statut qualitatif de la réserve physique mesurée.
- [ ] **Affichage des 3 actions prioritaires :**
  - Lorsque des stocks critiques sont à zéro, les 3 actions recommandées les plus urgentes sont mises en avant dans l'encadré dédié.
- [ ] **Indicateur d'évolution :**
  - Effectuer une modification de préparation : le badge de progression (+/- X%) s'affiche par rapport à l'évaluation précédente.

---

## 4. Tests du Dossier de Secours Personnel & Confidentialité (P1)

- [ ] **Sélection granulaire des rubriques :**
  - Ouvrir le générateur de dossier personnel depuis Mon Plan.
  - Cocher/décocher les contacts prioritaires, les points de rassemblement, les besoins PMR et les données médicales.
- [ ] **Confidentialité absolue des données médicales :**
  - Vérifier que l'avertissement de non-partage est bien visible.
  - Les données de santé ne sont JAMAIS envoyées vers un serveur ni injectées par défaut dans les QR codes d'échange.
- [ ] **Impression papier propre (Print Stylesheet) :**
  - Déclencher l'impression du dossier (Ctrl+P ou bouton Imprimer).
  - Le document sort en noir et blanc haute lisibilité, compact (format A4 recto ou fiche de poche), avec les blocs de découpe clairs.

---

## 5. Tests du Mode Formateur & Exercices Collectifs (P1)

- [ ] **Sélection des 4 scénarios d'entraînement :**
  - 1. Nuage toxique industriel Seveso.
  - 2. Alerte confinement école / crèche.
  - 3. Rejet radiologique et rumeurs d'iode.
  - 4. Coupure générale d'énergie et réseau en hiver.
- [ ] **Objectifs pédagogiques et pièges mortels :**
  - Vérifier que chaque scénario liste les compétences travaillées et les erreurs fatales à proscrire (ex: aller chercher les enfants à l'école pendant un confinement).
- [ ] **Fiche de débriefing imprimable :**
  - Générer le compte-rendu d'exercice avec notes locales et grille de compétences.

---

## 6. Tests de Sauvegarde, Restauration & Diagnostic Stockage (P1)

- [ ] **Export JSON :**
  - Cliquer sur « Exporter la sauvegarde intégrale ».
  - Un fichier `nrbcor-backup-YYYY-MM-DD.json` est téléchargé avec le schéma versionné `NRBCOR_BACKUP_V2`.
- [ ] **Validation pré-import :**
  - Tester l'import d'un fichier JSON corrompu : un message d'erreur clair empêche tout écrasement.
  - Tester l'import d'une sauvegarde valide : la pré-visualisation détaille le nombre d'items avant validation explicite par l'utilisateur.
- [ ] **Zéro Cloud :**
  - Examiner l'onglet Network des DevTools lors des exports/imports : aucune requête HTTP sortante n'est émise.

---

## 7. Commandes de Validation Automatisées (CI)

```bash
# Vérification du typage strict
npm run lint

# Contrôle automatisé du corpus doctrinal (RFC, métadonnées, dates, autorités)
npm run check:content

# Suite de tests automatisés (227 assertions)
npm test

# Compilation de production PWA
npm run build
```
