# Corpus Doctrinal de Sécurité Civile NRBCOR (v2.4.2)

Ce document formalise la doctrine, les sources officielles opposables et le cadre déontologique régissant l'application **NRBCOR** (Nucléaire, Radiologique, Biologique, Chimique - Outil de Résilience).

---

## 1. Principes Déontologiques Fondamentaux

1. **Subordination absolue aux autorités publiques :**
   Les consignes données par les autorités compétentes (Préfecture, DGSCGC, FR-Alert, Alertswiss, BE-Alert, radio de service public) prévalent **toujours et sans exception** sur les fiches de l'application. NRBCOR n'est pas un canal d'ordre mais un outil pédagogique et un assistant réflexe de terrain.

2. **Zéro approximation médicale & Verrou de l'iode stable :**
   Il est strictement interdit d'encourager ou d'autoriser une prise préventive d'iodure de potassium sans ordre explicite de l'autorité préfectorale. L'iode ne protège que la glande thyroïde contre l'iode radioactif (I-131) et ne confère aucune protection contre les irradiations externes ou les autres radionucléides (Césium, Strontium) ni contre les accidents chimiques.

3. **Différenciation physique des menaces :**
   - **Nucléaire / Radiologique :** Les sous-sols et parois lourdes (béton plein) constituent un écran physique essentiel atténuant l'irradiation gamma.
   - **Chimique :** Les caves et excavations peuvent devenir des pièges mortels par accumulation de gaz denses plus lourds que l'air (chlore, propane, phosgène). L'étanchéification et l'écoute des consignes météo/panache sont prioritaires.
   - **Biologique :** Barrières respiratoires normalisées (FFP3/FFP2 ajustées) et absence de dispersion aérosol.

4. **Décontamination sans abrasion :**
   Le déshabillage d'urgence de haut en bas élimine 80 à 90 % de la contamination externe. Le lavage corporel doit être doux (eau tiède, savon ordinaire), sans frotter vigoureusement afin de ne pas léser la couche cornée cutanée.

---

## 2. Référentiel des Autorités Officielles Opposables

### France (Doctrine Nationale)
- **DGSCGC (Direction Générale de la Sécurité Civile et de la Gestion des Crises) :** Guide National de Référence Confinement, Plans de Secours Spécialisés PPI.
- **ASNR / ASN & IRSN :** Campagne nationale de distribution d'iode stable (rayon 20 km CNPE), principes ALARA, seuils dosimétriques.
- **Ineris (Direction des Risques Accidentels) :** Fiches de Données de Sécurité (FDS) d'urgence, guides méthodologiques PPRT, base ICPE/Seveso.
- **SGDSN (Secrétariat Général de la Défense et de la Sécurité Nationale) :** Plans gouvernementaux PIRATOX, BIOTOX, PIRANET / PIRATOME.
- **Santé Publique France & ARS :** Prise en charge des intoxications aiguës et coordination des 8 Centres Antipoison (CAP) H24.

### Suisse (Confédération & Cantons)
- **OFPP / BABS (Office fédéral de la protection de la population) :** Directives d'alarme générale et application Alertswiss.
- **CENAL / NEOC (Centrale nationale d'alarme) :** Déclenchement fédéral de l'alarme et suivi dosimétrique.
- **OFSP / BAG (Office fédéral de la santé publique) :** Ordonnance sur les comprimés d'iode (rayon 50 km autour des CNPE de Beznau, Gösgen, Leibstadt).

### Belgique
- **Centre de Crise National (NCCN) :** Plan d'urgence nucléaire et radiologique national, réseau d'alerte BE-Alert.
- **AFCN (Agence fédérale de contrôle nucléaire) :** Surveillance radiologique et zones de planification (Doel, Tihange, Chooz transfrontalier).

### International
- **AIEA / IAEA (Agence Internationale de l'Énergie Atomique) :** Normes de sûreté GSR Part 7 (Operational Intervention Levels - OILs).
- **OMS / WHO :** Directives de gestion sanitaire de l'eau en situation dégradée et urgences chimiques.

---

## 3. Matrice de Validation du Corpus

| Type de contrôle | Méthode | Responsabilité | Fréquence |
|---|---|---|---|
| **Intégrité syntaxique & URLs** | Script automatisé (`scripts/verify-corpus.ts`) | CI / GitHub Actions | À chaque commit / PR |
| **Complétude des champs & Schémas** | Script automatisé (`scripts/verify-corpus.ts`) | CI / GitHub Actions | À chaque commit / PR |
| **Unicité des identifiants** | Set de validation JS/TS | CI / GitHub Actions | À chaque commit / PR |
| **Cohérence des dates & Traçabilité** | Comparaison dates publication / revue | Script + Audit | Mensuelle |
| **Exactitude médicale & Posologies** | Revue par professionnels de santé / pharmaciens | Collège Médical Humain | Semestrielle ou à chaque décret |
| **Conformité doctrines d'État** | Recoupement Légifrance, arrêtés PPI, circulaires | Collège Sécurité Civile Humain | Continue |

---

## 4. Statuts de Publication

- `valide` : Fiche validée collégialement, adossée à une publication officielle opposable en vigueur.
- `a_verifier` : Donnée issue de retours d'expérience ou de pré-publications techniques nécessitant confirmation collégiale.
- `brouillon` : Ébauche prospective interne. **Ne doit jamais être présentée comme consigne opérationnelle en situation d'urgence.**
