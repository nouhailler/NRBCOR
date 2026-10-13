# NRBCOR - Application PWA de Préparation Civile aux Risques NRBC

**Version :** 1.0  
**Corpus Doctrinal :** v2.4 (Octobre 2026)  
**Zone cible initiale :** France métropolitaine et outre-mer  
**Nature :** Progressive Web App (PWA) 100% autonome, installable et utilisable hors ligne.

---

## 1. Vision et Objectifs

NRBCOR est une application citoyenne d'information, de préparation et d'aide réflexe face aux risques Nucléaires, Radiologiques, Biologiques et Chimiques (NRBC). Elle centralise les fiches de sécurité validées, la gestion du kit d'urgence 72h, le plan familial de mise en sûreté et les données territoriales de prévention.

### Principes non négociables (Section 1.1)
- **100% Hors-Ligne :** Tous les guides, fiches réflexes, checklists et données locales fonctionnent sans aucune connexion Internet après le chargement initial.
- **Souveraineté des données & Zéro Cloud :** Aucun serveur applicatif, aucun compte utilisateur obligatoire, aucune base distante. Les données sont stockées exclusivement sur l'appareil dans IndexedDB (`nrbc-preparation-db`).
- **Doctrines officielles :** Contenus rédigés d'après les publications du SGDSN (PIRATOX, BIOTOX, PIRANET), de la DGSCGC (Sécurité Civile), de l'ASNR (Sûreté Nucléaire) et de Santé Publique France.
- **Transparence sur les limites :** L'application n'est ni un détecteur, ni un diagnostic médical, ni un substitut aux secours d'urgence (15, 18, 112) ou aux alertes officielles de l'État (FR-Alert).

---

## 2. Structure des Écrans (Cahier des Charges)

| Écran | Nom | Description |
|---|---|---|
| **A** | **Premier Lancement** | Onboarding explicatif, configuration facultative du foyer et de la commune, rappel légal. |
| **B** | **Accueil** | Tableau de bord avec statut hors ligne, priorité vitale, 4 fiches NRBC, synthèse kit 72h et Géorisques. |
| **C** | **Réagir Maintenant** | Écran sous stress avec gestes réflexes immédiats, guide déshabillage pas-à-pas et numéros d'urgence confirmés. |
| **D** | **Catalogue des Risques** | Consultation transversale des 4 risques avec filtres par typologie (N, R, B, C). |
| **E** | **Fiche Réflexe Détaillée** | Découpage avant / pendant / après, interdictions absolues, signes cliniques et impression locale. |
| **F** | **Checklist Kit 72h** | Calculateur paramétrique (eau et rations pour 72h), 6 catégories normées et ajout d'articles. |
| **G** | **Inventaire & Péremptions** | Suivi des stocks, dates limites, alertes de renouvellement et dernière date de vérification. |
| **H** | **Mon Plan Familial** | Lieux de ralliement, contacts hors-zone, mode discret (masquage à l'écran) et purge sécurisée. |
| **I** | **Risques Locaux (Géorisques)** | Carte radar locale, recherche de commune en ligne et cache certifié sans régression réseau. |
| **J** | **Formation & Exercices** | Scénarios d'immersion fictifs ("EXERCICE"), minuteur de confinement et quiz interactif. |
| **K** | **Sources & Traçabilité** | Vérification SHA-256 locale, calendrier de révision et attestation de conformité légale. |
| **L** | **Paramètres & Confidentialité** | Réglages du foyer, échelle de texte WCAG (accessibilité), export/import JSON et charte de minimisation. |

---

## 3. Commandes et Scripts de Développement

```bash
# Lancer le serveur de développement local
npm run dev

# Compiler l'application pour production
npm run build

# Valider la syntaxe et les types TypeScript
npm run lint

# Contrôler la conformité éditoriale et réglementaire du corpus
npm run check:content
```

---

## 4. Déploiement et Sécurité

L'application est servie en HTTPS statique. Le Service Worker (`/sw.js`) applique une politique Cache-First pour l'App Shell et Network-First avec fallback local pour les requêtes publiques d'information territoriale.
