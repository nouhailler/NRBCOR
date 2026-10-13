# Charte de Confidentialité & Sécurité des Données Locales

## 1. Minimisation Absolue des Données
L'application NRBCOR respecte le principe de « Privacy by Design » le plus strict :
- **Zéro compte utilisateur :** Aucune inscription, aucune adresse e-mail, aucun identifiant demandé.
- **Zéro serveur applicatif :** Aucune donnée saisie (taille du foyer, plan de famille, inventaire, contacts d'urgence) ne quitte le navigateur de l'utilisateur.
- **Zéro télémétrie :** Aucun traceur tiers, aucun cookie publicitaire, aucun script d'analytics intrusif.

## 2. Emplacement et Sécurité du Stockage
Les données sont conservées localement dans le profil de l'utilisateur via l'API standard `IndexedDB` (base de données `nrbc-preparation-db`).
- **Avertissement :** Les données conservées dans le navigateur ne sont pas chiffrées par un mot de passe maître applicatif. Un utilisateur disposant d'un accès physique direct à la session peut consulter les données locales.
- **Mode Discret :** Un mode d'affichage masqué permet d'occulter les noms et coordonnées sensibles à l'écran.
- **Purge Instantanée :** L'utilisateur dispose à tout moment d'une fonction d'effacement complet ("Wipe") supprimant toutes les données locales en un clic.

## 3. Requêtes Réseau
Seules les requêtes d'information publique suivantes sont exécutées (uniquement à la demande de l'utilisateur lorsqu'il est connecté) :
- `geo.api.gouv.fr` : recherche du code INSEE et du nom de commune sans transmettre de nom d'utilisateur ni d'adresse précise.
- `georisques.gouv.fr` : consultation publique des fiches de risques et installations Seveso communales.
En cas de coupure de réseau, l'application bascule automatiquement sur les données certifiées en cache local sans bloquer l'interface.
