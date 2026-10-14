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
