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

| ID | Exigence | Critère d'Acceptation | Statut |
|---|---|---|:---:|
| **PWA-01** | Installable | Manifest PWA valide (`/manifest.webmanifest`), icônes et Service Worker (`/sw.js`). | **CONFORME** |
| **OFF-01** | Guides hors ligne | Guides NRBC et fiches d'urgence consultables après coupure réseau et rechargement. | **CONFORME** |
| **OFF-02** | Données locales | Checklist, inventaire et plan familial persistants dans IndexedDB après fermeture. | **CONFORME** |
| **ARC-01** | Pas de backend | Aucune base serveur, aucun compte requis pour fonctionner. | **CONFORME** |
| **ARC-02** | Pas de PostgreSQL | Zéro cloud requis, exécution 100% côté client. | **CONFORME** |
| **SEC-01** | Confidentialité | Aucune donnée familiale ni inventaire transmis par le réseau. | **CONFORME** |
| **SEC-02** | Import sûr | Fichiers JSON invalides ou altérés rejetés sans écraser les données existantes. | **CONFORME** |
| **NRBC-01** | Quatre risques | Guides complets Nucléaire, Radiologique, Biologique et Chimique intégrés. | **CONFORME** |
| **NRBC-02** | Contenu validé | Fiches approuvées, sourcées et datées (Corpus v2.4). | **CONFORME** |
| **URG-01** | Accès rapide | Mode « Réagir » accessible en un tap depuis l'accueil et la barre de navigation. | **CONFORME** |
| **DATA-01** | Données locales | Affichage explicite de la date de capture et de l'origine des données territoriales. | **CONFORME** |
| **DATA-02** | Panne API | Fonctionnement garanti si l'API Géorisques est indisponible ou hors ligne. | **CONFORME** |
| **SAF-01** | Pas de fausse alerte | Exercices et simulations distincts avec étiquette claire « EXERCICE ». | **CONFORME** |
| **SAF-02** | Pas de faux diagnostic | Aucun calcul arbitraire déclarant une zone sûre sans fondement officiel. | **CONFORME** |
| **A11Y-01** | Accessibilité | Navigation clavier, contraste élevé, cibles tactiles et sélecteur de taille de texte. | **CONFORME** |
| **TEST-01** | Automatisation | Build Vite et scripts de validation éditoriale (`npm run check:content`) opérationnels. | **CONFORME** |
| **DOC-01** | Documentation | README, charte éditoriale, politique de confidentialité et procédure hors ligne disponibles. | **CONFORME** |
