# CONTEXT - NRBCOR Protection Civile & Résilience NRBC

## 1. Contexte Opérationnel et Objectifs

La France et l'Europe font face à une multiplication des vulnérabilités technologiques, géopolitiques et industrielles :
- **Sites industriels à haut risque (Seveso)** : Près de 1 300 sites Seveso seuil haut et seuil bas en France métropolitaine.
- **Parc électronucléaire** : 56 réacteurs répartis sur 18 centrales civiles.
- **Transports de Matières Dangereuses (TMD)** : Flux ferroviaires et autoroutiers constants traversant les bassins denses de population.
- **Menaces asymétriques et conflits hybrides** : Risques de dissémination biologique, chimique ou d'incidents radiologiques (sources industrielles/médicales orphelines, bombes sales).

Dans ce contexte, les premières minutes suivant un incident (« la fenêtre réflexe de 0 à 15 minutes ») sont critiques :
- Les réseaux téléphoniques mobiles s'effondrent souvent sous la surcharge en quelques minutes.
- L'électricité et l'approvisionnement en eau potable peuvent être coupés.
- Les citoyens doivent connaître immédiatement les gestes de sauvegarde : se confiner, boucher les aérations, couper la VMC, ne pas aller chercher les enfants à l'école (protégés par le PPMS scolaire), et ne jamais prendre d'iode sans ordre préfectoral explicite.

---

## 2. Principes Fondamentaux d'Architecture

### 2.1 Souveraineté Totale & Zéro Serveur (0-Cloud)
- **Aucun serveur d'application distant** : L'ensemble de la logique métier, des fiches de protocoles et des simulateurs fonctionne à 100% dans le navigateur de l'utilisateur.
- **Persistance IndexedDB** (`nrbc-preparation-db`) : Les données sensibles (plan familial, inventaire du matériel, adresses de ralliement, contacts d'urgence) ne quittent jamais la mémoire locale du terminal.
- **Mode Discret** : Possibilité de masquer immédiatement d'une pression tous les noms et numéros de téléphone affichés à l'écran en cas de consultation en lieu public ou en présence de tiers.

### 2.2 Fonctionnement 100% Hors-Ligne (PWA & Service Worker)
- **Architecture App Shell Cache-First** via Service Worker (`/sw.js`).
- Après un chargement initial unique en présence de réseau, l'application reste totalement opérationnelle en mode avion, en sous-sol ou en coupure de télécommunications.
- **Surveillance automatique des versions en arrière-plan** : Lorsqu'une connectivité réseau est rétablie, le Service Worker inspecte discrètement la disponibilité de nouvelles fiches doctrinales sans déranger l'utilisateur.

---

## 3. Corpus Doctrinal et Sources de Référence

Le contenu de l'application s'appuie scrupuleusement sur la doctrine publique française et internationale :
1. **Secrétariat Général de la Défense et de la Sécurité Nationale (SGDSN)** :
   - Plan PIRATOX (Risque chimique)
   - Plan BIOTOX (Risque biologique)
   - Plan PIRANET (Risque cyber & infrastructures d'alerte)
2. **Direction Générale de la Sécurité Civile et de la Gestion des Crises (DGSCGC)** :
   - Fiches réflexes du Ministère de l'Intérieur
   - Guides du Plan Familial de Mise en Sûreté (PFMS)
   - Normes de réserve vitale (3 litres d'eau / jour / personne pour 72 heures)
3. **Autorité de Sûreté Nucléaire (ASN) & IRSN** :
   - Règles de distribution et d'ingestion de l'iodure de potassium (KI 65mg)
   - Interdiction formelle d'automédication sans consigne de la Préfecture
4. **Santé Publique France & SAMU / SMUR** :
   - Procédures de décontamination d'urgence par déshabillage et rinçage cutané doux sans abrasion mécanique.

---

## 4. Cadre Légal et Décharge de Responsabilité

- L'application est un outil civique d'information, de vulgarisation pédagogique et d'aide à la préparation personnelle.
- L'éditeur et l'auteur rappellent formellement qu'ils **ne sont pas responsables des données, des approximations cartographiques ou des conséquences d'actions menées par les utilisateurs**.
- L'application **ne se substitue aucunement aux canaux officiels de l'État** (FR-Alert, préfectures, radios de service public France Bleu / France Inter) ni aux services de secours (112, 15, 18, 17).
- Un écran d'onboarding obligatoire matérialise cette décharge juridique dès le premier lancement.

---

## 5. Fiabilisation des Consignes de Sécurité (Priorité 1)

Face aux risques de confusion entre une simulation théorique et une consigne opérationnelle de crise :
1. **Confinement contextualisé** :
   - Risque chimique : interdiction formelle des caves et sous-sols (accumulation de gaz denses au sol) et des combles (gaz légers). Confinement à mi-hauteur.
   - Risque radiologique / nucléaire : le sous-sol bétonné offre une barrière physique d'atténuation contre le rayonnement gamma (facteur de réduction 10 à 20x supérieur aux étages hauts).
2. **Calculateur d'air disponible non opérationnel** :
   - Les durées affichées sont des estimations de cinétique d'accumulation de CO2 (< 1%).
   - Rappel impératif que le confinement civil d'urgence dure généralement entre 2 et 4 heures (temps de passage du panache).
   - Une simulation ne justifie en aucun cas de refuser l'aération immédiate dès la fin d'alerte officielle ou l'ordre d'évacuation préfectoral.
3. **Iode stable (KI 65mg)** :
   - Prise conditionnée exclusivement à l'ordre du Préfet.
   - Fenêtre temporelle critique (1-2h avant le nuage, inutile après 24h).
   - Avertissement formel contre les faux remèdes mortels (ingestion de Bétadine ou de sel de table).
4. **Risques chimiques** :
   - Fuite à 90° de la direction du vent en extérieur.
   - Clarification sur l'inefficacité totale des masques FFP2/FFP3 contre les gaz et vapeurs toxiques.

---

## 6. Audit & Opérationnalité du Module Géorisques

Pour garantir l'intégrité technique face aux exigences citoyennes de sécurité civile :
1. **Fonctions réellement opérationnelles** :
   - *Géolocalisation GPS W3C* : Récupération des coordonnées réelles matérielles via l'API navigateur `navigator.geolocation`. Reverse-geocoding dynamique en direct auprès de `geo.api.gouv.fr` ou association géodésique hors-ligne (formule de Haversine) sans aucun appel réseau.
   - *Recherche de communes* : Requêtes réelles auprès du référentiel géographique officiel de l'État français (35 000 communes).
   - *Export d'instantané* : Génération et téléchargement réel d'un fichier JSON structuré contenant l'état complet du dossier territorial communal, ses risques notifiés et ses consignes de sauvegarde.
   - *Consultation hors-ligne* : Accès autonome aux documents DICRIM, PCS et fiches réflexes certifiées.
2. **Démonstration & schéma pédagogique** :
   - *Carte vectorielle SVG locale* : Schéma didactique représentant les cercles d'incidence PPI, les axes TMD et l'orientation des installations à risque, évitant la dépendance à un serveur cartographique externe qui s'effondrerait en cas de crise.
3. **Fonctionnalités indisponibles hors-connexion** :
   - *Actualisation en direct de l'API Géorisques* (`georisques.gouv.fr / GASPAR`) : Nécessite une connectivité Internet. En cas de coupure réseau, l'application bloque explicitement la requête sans planter et affiche un avertissement clair informant que les données du cache local font foi.

---

## 7. Unification de la Persistance Locale & Stratégie Double-Niveau (Priorité 4)

Face aux risques de fragmentation et de perte de données entre `localStorage` et `IndexedDB` :
1. **Rôle d'autorité conféré à IndexedDB** :
   - `IndexedDB` stocke de façon asynchrone, structurée et durable toutes les données à volumétrie variable (magasins `settings`, `checklistItems`, `familyPlans`, `inventoryItems`, `localRiskSnapshots`, `quizProgress`).
   - Supprime le risque de saturation ou de corruption du quota strict de 5 Mo de `localStorage`.
2. **Cache miroir synchrone (`localStorage`)** :
   - Utilisé exclusivement comme cache d'amorçage pour le thème et l'état visuel initial, garantissant une absence totale de scintillement au premier rendu sans bloquer le fil d'exécution.
3. **Format d'export / import unifié V2 (`NRBCOR_BACKUP_V2`)** :
   - Intègre l'ensemble de l'état de l'application en une seule archive JSON vérifiable.
   - Validation stricte de structure (vérification de schéma à l'import) et rétrocompatibilité avec les versions antérieures.
4. **Purge atomique sécurisée (Wipe)** :
   - Réinitialisation complète et simultanée d'IndexedDB et des clés de cache miroir sur confirmation utilisateur.
5. **Observabilité & Diagnostic** :
   - Suivi en direct du statut de chaque magasin et estimation du quota alloué par le navigateur dans l'écran Paramètres.



