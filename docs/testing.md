# Procédure de Test Hors-Ligne & Recette Technique NRBCOR

## 1. Procédure de Validation Hors-Ligne (Section 14.4)
Cette procédure garantit l'autonomie opérationnelle complète de l'application en cas de coupure des réseaux de télécommunication :

1. **Chargement initial :** Ouvrir l'application dans un navigateur moderne (Chrome, Firefox, Safari ou Edge) connecté à Internet. Laisser l'App Shell et le Service Worker (`/sw.js`) s'installer.
2. **Passage en mode hors ligne :**
   - Sur ordinateur : Ouvrir les Outils de Développement (`F12`), onglet `Network` / `Réseau`, cocher la case `Offline` / `Hors ligne`.
   - Sur mobile : Activer le « Mode Avion » (couper Wi-Fi et 4G/5G).
3. **Rechargement complet :** Actualiser la page (`Ctrl+R` ou `F5`).
4. **Vérification des parcours critiques :**
   - Accéder au mode **Réagir Maintenant** : vérifier que toutes les consignes s'affichent instantanément sans délai ni blocage réseau.
   - Consulter les 4 fiches de risques majeurs (Nucléaire, Radiologique, Biologique, Chimique).
   - Ouvrir le **Guide Déshabillage Pas-à-Pas** et lancer le minuteur de 15 minutes.
   - Ouvrir la **Fiche Iode Stable** et ajuster le calculateur de posologie.
   - Ouvrir le simulateur de **Sirène RNA** et déclencher la synthèse Web Audio.
   - Modifier la checklist du kit 72h et l'inventaire des denrées.
5. **Persistance des données :**
   - Fermer complètement le navigateur.
   - Rouvrir le navigateur et relancer l'application en mode hors ligne.
   - Vérifier que les éléments cochés et l'inventaire sont parfaitement conservés.

---

## 2. Matrice de Conformité aux Exigences Synthétiques (Section 19)

| ID | Exigence | Critère d'Acceptation | Statut Réel Vérifié |
|---|---|---|:---:|
| **PWA-01** | Installable | Manifest PWA valide (`/manifest.webmanifest`), icônes et Service Worker (`/sw.js`). | **VÉRIFIÉ & CONFORME** |
| **OFF-01** | Guides hors ligne | Guides NRBC et fiches d'urgence consultables après coupure réseau et rechargement. | **VÉRIFIÉ & CONFORME** |
| **OFF-02** | Données locales | Checklist, inventaire et plan familial persistants dans IndexedDB après fermeture. | **VÉRIFIÉ & CONFORME** |
| **ARC-01** | Pas de backend | Aucune base serveur, aucun compte requis pour fonctionner. | **VÉRIFIÉ & CONFORME** |
| **ARC-02** | Pas de PostgreSQL | Zéro cloud requis, exécution 100% côté client. | **VÉRIFIÉ & CONFORME** |
| **SEC-01** | Confidentialité | Aucune donnée familiale ni inventaire transmis par le réseau. | **VÉRIFIÉ & CONFORME** |
| **SEC-02** | Import sûr | Fichiers JSON invalides ou altérés rejetés sans écraser les données existantes. | **VÉRIFIÉ & CONFORME** |
| **NRBC-01** | Quatre risques | Guides complets Nucléaire, Radiologique, Biologique et Chimique intégrés. | **VÉRIFIÉ & CONFORME** |
| **NRBC-02** | Contenu validé | Fiches approuvées, sourcées et datées (Corpus v2.4). | **VÉRIFIÉ & CONFORME** |
| **URG-01** | Accès rapide | Mode « Réagir » accessible en un tap depuis l'accueil et la barre de navigation. | **VÉRIFIÉ & CONFORME** |
| **DATA-01** | Données locales | Affichage explicite de la date de capture et de l'origine des données territoriales. | **VÉRIFIÉ & CONFORME** |
| **DATA-02** | Panne API | Fonctionnement garanti si l'API Géorisques est indisponible ou hors ligne. | **VÉRIFIÉ & CONFORME** |
| **SAF-01** | Pas de fausse alerte | Exercices et simulations distincts avec étiquette claire « EXERCICE ». | **VÉRIFIÉ & CONFORME** |
| **SAF-02** | Pas de faux diagnostic | Aucun calcul arbitraire déclarant une zone sûre sans fondement officiel. | **VÉRIFIÉ & CONFORME** |
| **A11Y-01** | Accessibilité | Navigation clavier, contraste élevé, cibles tactiles et sélecteur de taille de texte. | **VÉRIFIÉ & CONFORME** |
| **TEST-01** | Automatisation | Suites automatisées TypeScript, contrôle éditorial et compilation Vite à 100% de succès. | **VÉRIFIÉ & CONFORME** |
| **DOC-01** | Documentation | README, charte éditoriale, politique de confidentialité et procédure hors ligne disponibles. | **VÉRIFIÉ & CONFORME** |

---

## 3. Exécution et Preuves des Tests Automatisés

Le dépôt dispose de 3 commandes de test et validation automatisée exécutables directement :

### Commande 1 : `npm test` (Suite de Tests Fonctionnels & Réglementaires)
Commande : `tsx scripts/run-readiness-tests.ts`
Résultat d'exécution : **133 / 133 vérifications réussies (100% de succès)**.

Périmètres testés de manière unitaire et automatisée :
1. **Calcul de l'autonomie en eau :**
   - Distinction formelle entre stock mesuré dans l'inventaire (`quantity`, `unit`) et simple case cochée `k1`.
   - Une case cochée sans quantité réelle mesurée déclenche l'état `hasInsufficientData: true` et `status: 'insufficient_data'`, sans jamais attribuer d'heures d'autonomie fictives.
   - Les hypothèses de consommation journalière (3L/j par personne, 0.5L/j par animal) sont appliquées rigoureusement.
2. **Calcul des rations alimentaires :**
   - Distinction entre nombre de portions/boîtes mesurées et checklist.
   - Prise en compte différentiée des nourrissons (aliments spécifiques, 3 rations journalières dédiées) et des adultes (2 à 3 repas d'énergie sèche/conserves).
3. **Foyers complexes atypiques :**
   - Test d'un foyer multi-profils (2 adultes, 1 enfant, 1 nourrisson, 1 aîné, 2 animaux de compagnie, Personne à Mobilité Réduite et Maladie Chronique).
   - Validation que le score global n'accorde jamais de fausse garantie de sécurité (présence obligatoire de la clause déontologique formelle).
4. **Traçabilité doctrinale du corpus de sécurité :**
   - Contrôle systématique des fiches réglementaires de référence (`securityCorpus.ts`).
   - Présence obligatoire pour chaque fiche : organisme public d'autorité (DGSCGC, IRSN/ASNR, Ineris, Santé Publique France), lien HTTPS officiel, titre exact du document d'État, date de publication/révision, date de vérification éditoriale, niveau de validation, historique des révisions avec motif obligatoire.
   - Présence des clauses fondamentales : interdiction de prise préventive d'iode sans ordre préfectoral, absence de direction de fuite universelle pour les gaz chimiques denses vs volatils, avertissement interdisant d'interpréter un calcul volumétrique d'air comme une garantie de survie.
5. **Discrimination des coordonnées territoriales Géorisques :**
   - Contrôle que chaque commune sélectionnée (Rouen, Dunkerque, Paris, Marseille, Feyzin, etc.) conserve ses coordonnées GPS propres et ne bascule jamais par erreur vers les coordonnées de Lyon (45.76, 4.83).
   - Vérification que la recherche locale ou en ligne associe les coordonnées exactes au centre communal.
6. **Intégrité des statuts de l'API Géorisques :**
   - Traitement étanche des statuts `live_api` (avec risques), `live_api_zero_risk` (réponse valide de l'État avec 0 risque recensé dans GASPAR), `cached_official`, `network_error`, `api_error`, et `pedagogical_sample`.
   - Empêchement de toute confusion entre échec de connexion et réponse valide sans risque.
7. **Spécification des exports territoriaux JSON :**
   - Vérification que les exports territoriaux ne prétendent pas intégrer les documents communaux complets hors-ligne (`disponibiliteHorsLigne: false`).
   - Mention expresse invitant le citoyen à consulter l'exemplaire original paraphé par le Maire en mairie ou sur le portail communal.

### Commande 2 : `npm run check:content`
Commande : `node scripts/check-content.mjs`
Résultat d'exécution : **Contrôle de conformité éditoriale et de traçabilité réussi (Corpus v2.4 Approuvé)**.

### Commande 3 : `npm run lint`
Commande : `tsc --noEmit`
Résultat d'exécution : **0 erreur TypeScript**.

### Commande 4 : `npm run build`
Commande : `vite build`
Résultat d'exécution : **Compilation réussie du bundle PWA de production**.
