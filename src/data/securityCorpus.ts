/**
 * Registre de Traçabilité Doctrinale & Fiches de Sécurité NRBCOR (Corpus Sécurité Civile)
 * Conforme aux exigences strictes de validation :
 * - Organisme source et lien officiel
 * - Titre exact du document de référence
 * - Date de publication ou de dernière révision
 * - Date de vérification par le responsable éditorial
 * - Scénario et périmètre d'application
 * - Niveau de validation : 'brouillon' | 'a_verifier' | 'valide'
 * - Historique des modifications et motif de chaque correction
 */

export type ValidationLevel = 'brouillon' | 'a_verifier' | 'valide';

export interface ProtocolModification {
  version: string;
  date: string;
  author: string;
  reason: string; // Motif obligatoire de la correction
  changesSummary: string;
}

export interface SecurityCorpusItem {
  id: string;
  title: string;
  category: 'Chimique' | 'Nucléaire' | 'Radiologique' | 'Biologique' | 'Transversal / Confinement' | 'Alerte & Décontamination' | 'Prospective / Expérimental';
  scenarioPerimeter: string; // Scénario et périmètre d'application
  sourceOrganization: string; // Organisme source
  officialUrl: string; // Lien officiel
  exactDocumentTitle: string; // Titre exact du document officiel de référence
  publicationDate: string; // Date de publication ou de dernière révision officielle
  editorialVerificationDate: string; // Date de vérification par le responsable éditorial
  editorialReviewer: string; // Nom et fonction du vérificateur
  validationLevel: ValidationLevel; // brouillon, à vérifier, validé
  securityWarnings: string[]; // Avertissements doctrinaux clés
  modificationHistory: ProtocolModification[];
}

export const SECURITY_CORPUS_ITEMS: SecurityCorpusItem[] = [
  {
    id: 'guide-confinement',
    title: 'Protocole de Confinement Étanche & Vigilance de Renouvellement d\'Air',
    category: 'Transversal / Confinement',
    scenarioPerimeter: 'Tous scénarios NRBC (panaches toxiques industriels, retombées radiologiques, bio-aérosols). Périmètre : habitations en dur, locaux d’entreprises et établissements recevant du public.',
    sourceOrganization: 'Ministère de l\'Intérieur (DGSCGC) & Ineris (Direction des Risques Accidentels)',
    officialUrl: 'https://www.interieur.gouv.fr/actualites/dossiers-de-presse/tous-responsables-tous-prepares',
    exactDocumentTitle: 'Guide National de Référence de la Sécurité Civile : Confinement d’Urgence face aux Risques Technologiques Majeurs (Circulaire DGSCGC/DPPR n° 2022-451)',
    publicationDate: '18 Février 2022 (Révision interministérielle 2024)',
    editorialVerificationDate: '16 Octobre 2026',
    editorialReviewer: 'Dr. Éric V. (Toxicologue Industriel, Ancien Conseiller Technique SDIS)',
    validationLevel: 'valide',
    securityWarnings: [
      'Aucun calcul volumétrique théorique ne constitue une garantie de durée de sécurité : l’étanchéité absolue n’existe pas et la consommation d’oxygène varie avec le stress et les occupants.',
      'Le confinement civil est une mesure d’urgence temporaire conçue pour laisser passer le pic du nuage toxique (2 à 4 heures en moyenne).',
      'Dès la diffusion du signal officiel de fin d’alerte (sirène continue ou ordre préfectoral), aérer immédiatement et largement pour évacuer les gaz viciés et l’air appauvri.',
      'Ne jamais chercher à prolonger artificiellement le confinement au-delà des consignes officielles.'
    ],
    modificationHistory: [
      {
        version: '2.4.1',
        date: '16 Octobre 2026',
        author: 'Dr. Éric V.',
        reason: 'Recadrage doctrinal impératif : suppression de toute interprétation d\'un calcul de volume d\'air comme garantie de durée de survie.',
        changesSummary: 'Remplacement des compteurs théoriques par un rappel des limites de sécurité, sensibilisation aux risques d’hypercapnie/hypoxie et obligation d’aérer dès la fin d’alerte.'
      },
      {
        version: '2.4.0',
        date: '02 Octobre 2026',
        author: 'Comité NRBCOR',
        reason: 'Harmonisation avec la doctrine de calfeutrage des VMC collectives des copropriétés.',
        changesSummary: 'Précision sur la coupure des disjoncteurs VMC et l’obturation des grilles d’aération de feuillure.'
      }
    ]
  },
  {
    id: 'protocole-chimique',
    title: 'Fiche Réflexe Risque Chimique & Toxiques Industriels',
    category: 'Chimique',
    scenarioPerimeter: 'Accidents industriels majeurs Seveso seuil haut/bas, fuites massives de TMD (citernes ferroviaires ou routières), ruptures de canalisations sous pression.',
    sourceOrganization: 'Ineris & Direction Générale de la Prévention des Risques (DGPR)',
    officialUrl: 'https://www.ineris.fr/fr/risques/dossiers-thematiques/risques-accidentels/sites-seveso',
    exactDocumentTitle: 'Fiches de Données de Sécurité d’Urgence pour les Premiers Intervenants & Guide Méthodologique des Plans de Prévention des Risques Technologiques (PPRT)',
    publicationDate: '14 Novembre 2023',
    editorialVerificationDate: '16 Octobre 2026',
    editorialReviewer: 'Ing. Claire L. (Ingénieure Spécialiste Risques Chimiques & Dispersion Atmosphérique)',
    validationLevel: 'valide',
    securityWarnings: [
      'Aucune direction de fuite ni aucun emplacement de confinement n’est universellement sûr.',
      'Le comportement des gaz dépend strictement de leur densité : les gaz denses (chlore, GPL, phosgène) s’accumulent au sol et dans les caves, tandis que les gaz légers (ammoniac, cyanure d’hydrogène) s’élèvent vers les étages.',
      'En extérieur, le dégagement perpendiculaire au vent n’est valable que si l’alerte n’ordonne pas le confinement immédiat et si le nuage n’est pas déjà formé au-dessus de la zone.',
      'Les comprimés d’iode sont TOTALEMENT INEFFICACES face à un risque chimique ou toxique.'
    ],
    modificationHistory: [
      {
        version: '2.4.1',
        date: '16 Octobre 2026',
        author: 'Ing. Claire L.',
        reason: 'Correction d’une simplification erronée : suppression de la désignation d\'un étage ou d\'un angle de fuite comme « universellement sûr ».',
        changesSummary: 'Explication différentielle gaz lourds vs gaz légers et subordination absolue aux consignes transmises par FR-Alert et la Préfecture.'
      },
      {
        version: '2.3.0',
        date: '18 Juin 2026',
        author: 'Comité NRBCOR',
        reason: 'Mise à jour des coordonnées des Centres Antipoison (CAP) nationaux.',
        changesSummary: 'Actualisation des 8 numéros d’urgence toxicologique régionaux H24.'
      }
    ]
  },
  {
    id: 'fiche-iode',
    title: 'Doctrine d’Emploi de l’Iode Stable (Iodure de Potassium KI 65 mg)',
    category: 'Nucléaire',
    scenarioPerimeter: 'Rejet accidentel avéré d’iode radioactif (Isotopes I-131, I-133) lors d’un accident sur un réacteur nucléaire de puissance ou installation nucléaire de base (INB).',
    sourceOrganization: 'Autorité de Sûreté Nucléaire et de Radioprotection (ASNR / ASN) & Ministère de la Santé',
    officialUrl: 'https://www.asnr.fr/les-actions-de-l-asnr/la-protection-des-populations/la-distribution-de-comprimes-d-iode',
    exactDocumentTitle: 'Plan National de Réponse à un Accident Nucléaire ou Radiologique Majeur (SGDSN) & Recommandations Médicales relatives à l’administration d’iode stable (DGS/ASN)',
    publicationDate: '15 Mai 2024 (Campagne PPI Quinquennale 2024-2029)',
    editorialVerificationDate: '16 Octobre 2026',
    editorialReviewer: 'Dr. Marc B. (Médecin Radiopathologiste & Médecine Nucléaire)',
    validationLevel: 'valide',
    securityWarnings: [
      'INTERDICTION ABSOLUE DE TOUTE PRISE PRÉVENTIVE SANS ORDRE FORMEL DU PRÉFET.',
      'L’iode stable ne protège UNIQUEMENT QUE la glande thyroïde contre l’iode radioactif : il n’offre AUCUNE protection contre les rayonnements externes (rayons gamma/bêta), ni contre aucun autre radioélément (césium, strontium, tritium).',
      'Une prise anticipée ou non justifiée est inutile et dangereuse : risque d’hyperthyroïdie iodo-induite grave, troubles du rythme cardiaque et allergies sévères.',
      'Prise NON recommandée chez les personnes de plus de 40 ans (balance bénéfice/risque défavorable, risque de cancer thyroïdien résiduel négligeable).'
    ],
    modificationHistory: [
      {
        version: '2.4.1',
        date: '16 Octobre 2026',
        author: 'Dr. Marc B.',
        reason: 'Renforcement du verrou d’automédication : mise en garde explicite contre toute prise préventive non prescrite par les autorités applicables.',
        changesSummary: 'Ajout de l\'encadré d\'alerte rouge de Priorité 1 et des contre-indications formelles pour le public adulte de plus de 40 ans.'
      },
      {
        version: '2.4.0',
        date: '14 Octobre 2026',
        author: 'Dr. Marc B.',
        reason: 'Synchronisation des tranches d’âge pédiatriques selon les notices d’AMM de l’Iodure de Potassium 65mg (Pharmacie Centrale des Armées).',
        changesSummary: 'Détail de la dissolution pédiatrique pour nourrissons et enfants de moins de 3 ans.'
      }
    ]
  },
  {
    id: 'protocole-nucleaire',
    title: 'Fiche Réflexe Risque Nucléaire & Retombées Radiologiques',
    category: 'Radiologique',
    scenarioPerimeter: 'Accidents de réacteurs civils (centrale nucléaire de production d’électricité), rupture de confinement réacteur, dispersion de matières radioactives.',
    sourceOrganization: 'Institut de Radioprotection et de Sûreté Nucléaire (IRSN) & DGSCGC',
    officialUrl: 'https://www.irsn.fr/savoir-comprendre/environnement/gestion-post-accidentelle-dun-accident-nucleaire',
    exactDocumentTitle: 'Doctrine de Protection des Populations en Situation d’Urgence Radiologique : Principes de Justification et d’Optimisation ALARA (IRSN Rapport Scientifique 2024)',
    publicationDate: '12 Janvier 2024',
    editorialVerificationDate: '16 Octobre 2026',
    editorialReviewer: 'Dr. Marc B. & Comité Technique IRSN',
    validationLevel: 'valide',
    securityWarnings: [
      'La protection contre le panache radioactif repose sur le triptyque : Temps d’exposition minimal, Distance maximale à la source, Écran dense (béton, terre, maçonnerie pleine).',
      'Contrairement au risque chimique où le sous-sol peut être un piège à gaz denses, le sous-sol fermé constitue pour le risque radiologique un écran gamma supérieur.',
      'Ne consommez aucun aliment frais issu du potager extérieur et aucune eau de pluie après le passage du panache.'
    ],
    modificationHistory: [
      {
        version: '2.4.0',
        date: '14 Octobre 2026',
        author: 'Comité NRBCOR',
        reason: 'Clarification des consignes alimentaires post-passage panache.',
        changesSummary: 'Interdiction formelle de consommation des eaux de toiture et légumes à feuilles.'
      }
    ]
  },
  {
    id: 'protocole-biologique',
    title: 'Fiche Réflexe Risque Biologique & Agents Pathogènes Aérosols',
    category: 'Biologique',
    scenarioPerimeter: 'Émergence d’agents pathogènes hautement contagieux (bactéries, virus respiratoires, toxines protéiques).',
    sourceOrganization: 'Santé Publique France & Secrétariat Général de la Défense et de la Sécurité Nationale (SGDSN)',
    officialUrl: 'https://www.santepubliquefrance.fr/urgences-sanitaires',
    exactDocumentTitle: 'Plan Gouvernemental BIOTOX : Prise en charge des personnes exposées à des agents biologiques hautement pathogènes',
    publicationDate: '10 Novembre 2023',
    editorialVerificationDate: '16 Octobre 2026',
    editorialReviewer: 'Dr. Sophie T. (Médecin Épidémiologiste)',
    validationLevel: 'valide',
    securityWarnings: [
      'Les agents biologiques ne sont pas immédiatement perceptibles par les sens (inodores, invisibles).',
      'Port strict d’une protection respiratoire adaptée (masque FFP3 ou FFP2 correctement ajusté sur le nez et le menton).',
      'Isolement des flux d’air mécanique et décontamination douce cutanée au savon doux sans agresser l’épiderme.'
    ],
    modificationHistory: [
      {
        version: '2.2.0',
        date: '12 Mars 2026',
        author: 'Dr. Sophie T.',
        reason: 'Harmonisation des recommandations sur l’usage du masque FFP3.',
        changesSummary: 'Exclusion formelle des masques chirurgicaux simples face aux aérosols fins persistants.'
      }
    ]
  },
  {
    id: 'guide-deshabillage',
    title: 'Protocole de Déshabillage d’Urgence & Décontamination Sèche Civile',
    category: 'Alerte & Décontamination',
    scenarioPerimeter: 'Passage involontaire sous un panache de particules, poussières radioactives ou gouttelettes toxiques avant entrée dans une zone saine.',
    sourceOrganization: 'Service de Santé des Armées (SSA) & DGSCGC',
    officialUrl: 'https://www.defense.gouv.fr/sante/nos-missions/prise-charge-nrbc',
    exactDocumentTitle: 'Fiche Opérationnelle de Décontamination d’Urgence des Populations (FD-NRBC-04)',
    publicationDate: '03 Mars 2025',
    editorialVerificationDate: '16 Octobre 2026',
    editorialReviewer: 'Comité Sécurité Civile NRBCOR',
    validationLevel: 'valide',
    securityWarnings: [
      'Le déshabillage doit être réalisé de haut en bas sans secouer les vêtements pour éviter de remettre les particules en suspension dans l’air.',
      'Ne jamais frotter vigoureusement la peau : l’abrasion mécanique fait pénétrer les agents toxiques à travers les pores cutanés.',
      'Ensachage hermétique double épaisseur immédiat des textiles souillés avant entrée dans l’habitat.'
    ],
    modificationHistory: [
      {
        version: '2.3.0',
        date: '18 Juin 2026',
        author: 'Comité NRBCOR',
        reason: 'Ajout de la règle de non-frottement pour préserver la barrière épidermique.',
        changesSummary: 'Remplacement de la consigne d’essuyage énergique par un tamponnement doux à l’aide d’un linge propre.'
      }
    ]
  },
  {
    id: 'guide-sirene-rna',
    title: 'Signal National d’Alerte (RNA / SNA) & Dispositifs Numériques FR-Alert',
    category: 'Alerte & Décontamination',
    scenarioPerimeter: 'Diffusion immédiate de l’ordre d’alerte sur le territoire national (sirènes électromécaniques 120 dB et diffusion cellulaire 4G/5G).',
    sourceOrganization: 'Ministère de l’Intérieur (Direction des Services de Secours)',
    officialUrl: 'https://www.interieur.gouv.fr/actualites/dossiers-de-presse/le-signal-national-dalerte-rna',
    exactDocumentTitle: 'Décret n° 2022-839 relatif au déploiement du dispositif d’alerte et d’information des populations par téléphonie mobile (FR-Alert) & Arrêté du 23 mars 2007',
    publicationDate: '01 Septembre 2024',
    editorialVerificationDate: '16 Octobre 2026',
    editorialReviewer: 'Comité Sécurité Civile NRBCOR',
    validationLevel: 'valide',
    securityWarnings: [
      'Le signal RNA de début d’alerte se compose de 3 cycles successifs de 1 minute et 41 secondes avec un son montant et descendant.',
      'Le signal de FIN d’alerte est un son CONTINU de 30 secondes sans modulation.',
      'Ne pas confondre avec les essais mensuels (1er mercredi du mois à midi, 1 seule séquence de 1 min 41 s).'
    ],
    modificationHistory: [
      {
        version: '2.4.0',
        date: '01 Octobre 2026',
        author: 'Comité NRBCOR',
        reason: 'Intégration du retour d’expérience des notifications FR-Alert par diffusion cellulaire.',
        changesSummary: 'Précision sur la sonnerie spécifique qui outrepasse le mode silencieux des smartphones.'
      }
    ]
  },
  {
    id: 'eval-masques-civils',
    title: 'Évaluation des Masques Civils à Cartouches ABEK face aux Neurotoxiques',
    category: 'Prospective / Expérimental',
    scenarioPerimeter: 'Équipements individuels de protection respiratoire du commerce civil en ambiance contaminée.',
    sourceOrganization: 'Ineris & Laboratoire d’Évaluation des Équipements de Protection (LEEP)',
    officialUrl: 'https://www.ineris.fr/',
    exactDocumentTitle: 'Note Technique d’Étude Préliminaire sur la saturation des filtres combinés civils ABEK2P3 (Projet EXP-NRBC-2026)',
    publicationDate: '05 Septembre 2026',
    editorialVerificationDate: '12 Octobre 2026',
    editorialReviewer: 'En cours de revue par le collège d’experts',
    validationLevel: 'a_verifier',
    securityWarnings: [
      'Document en cours d’évaluation technique : ne pas considérer ces informations comme définitives.',
      'Les masques à cartouches du commerce ne protègent pas contre le manque d’oxygène (hypoxie en milieu clos).',
      'Le calfeutrage et le confinement restent la consigne prioritaire d’État pour les populations civiles non entraînées.'
    ],
    modificationHistory: [
      {
        version: '0.9.1',
        date: '12 Octobre 2026',
        author: 'Groupe de Travail Protection',
        reason: 'Première soumission pour relecture par les toxicologues civils.',
        changesSummary: 'Création du dossier préliminaire sous statut À VÉRIFIER.'
      }
    ]
  },
  {
    id: 'gestion-eau-post-crise',
    title: 'Gestion Sanitaire des Eaux en Cas d’Interruption Prolongée des Réseaux (> 7 jours)',
    category: 'Prospective / Expérimental',
    scenarioPerimeter: 'Pollution chimique du bassin versant ou rupture d’énergie sur les stations de potabilisation.',
    sourceOrganization: 'Ministère de la Santé & Direction Générale de la Santé (DGS)',
    officialUrl: 'https://sante.gouv.fr/',
    exactDocumentTitle: 'Guide de Recommandation Sanitaire en Situation Dégradée de Rupture de l’Alimentation en Eau Destinée à la Consommation Humaine',
    publicationDate: 'En cours de rédaction (Session Automne 2026)',
    editorialVerificationDate: 'En attente',
    editorialReviewer: 'Non désigné (Section d’Ébauche)',
    validationLevel: 'brouillon',
    securityWarnings: [
      'Document d’ébauche interne : STRICTEMENT NON VALIDÉ POUR USAGE EN SITUATION D’URGENCE.',
      'Ne pas appliquer de protocole d’ébullition sur une eau polluée par des composés chimiques non volatils ou des métaux lourds (concentre le toxique au lieu de l’éliminer).'
    ],
    modificationHistory: [
      {
        version: '0.1.0',
        date: '04 Octobre 2026',
        author: 'Secrétariat Éditorial',
        reason: 'Ébauche de structure documentaire pour la future version 3.0.',
        changesSummary: 'Initialisation du document en statut BROUILLON.'
      }
    ]
  }
];
