/**
 * Registre de Traçabilité Doctrinale, Fiches de Preuve & Sécurité NRBCOR
 * 
 * Exigences de rigueur déontologique :
 * - Lien direct vers le document officiel exact (Légifrance, IRSN, Ineris, SGDSN)
 * - Page, article ou paragraphe justifiant chaque consigne critique
 * - Date de publication officielle et date de dernière vérification, clairement distinctes
 * - Statut de vérification unifié : 'verifie' | 'a_revalider' | 'source_introuvable'
 * - Historique des modifications et motif documenté pour chaque correction
 * - Collège éditorial vérifiable, adossé aux textes réglementaires opposables
 */

export type ValidationLevel = 'brouillon' | 'a_verifier' | 'valide';
export type VerificationStatus = 'verifie' | 'a_revalider' | 'source_introuvable';

export interface ProtocolModification {
  version: string;
  date: string;
  author: string;
  reason: string; // Motif obligatoire de la correction
  changesSummary: string;
}

export interface ProofSheetItem {
  justifiedRule: string; // Règle doctrinale vitale justifiée
  legalBasis: string; // Base juridique ou scientifique précise (code, article, décret)
  pageOrParagraph: string; // Page, article ou paragraphe exact
  legalExcerpt: string; // Extrait verbatim ou synthèse opposable
  verificationMethod: string; // Modalité de vérification (contrôle croisé Légifrance / SGDSN)
  statusJustification: string; // Justification du statut 'verifie' ou 'a_revalider'
}

export interface SecurityCorpusItem {
  id: string;
  title: string;
  category: 'Chimique' | 'Nucléaire' | 'Radiologique' | 'Biologique' | 'Transversal / Confinement' | 'Alerte & Décontamination' | 'Prospective / Expérimental';
  scenarioPerimeter: string; // Scénario et périmètre d'application
  sourceOrganization: string; // Organisme officiel source
  officialUrl: string; // Portail institutionnel de l'organisme
  officialDirectDocumentUrl: string; // Lien direct vers le texte réglementaire ou PDF officiel
  exactDocumentTitle: string; // Titre exact du document officiel de référence
  exactReferenceSection: string; // Page, article ou section précise
  publicationDate: string; // Date de publication ou de dernière révision officielle
  editorialVerificationDate: string; // Date de dernière vérification par NRBCOR
  editorialReviewer: string; // Collège éditorial vérificateur
  editorialQualification: string; // Qualifications et cadre de référence déontologique
  validationLevel: ValidationLevel; // brouillon, a_verifier, valide
  verificationStatus: VerificationStatus; // verifie, a_revalider, source_introuvable
  securityWarnings: string[]; // Avertissements doctrinaux clés
  modificationHistory: ProtocolModification[];
  proofSheet: ProofSheetItem; // Fiche de preuve détaillée pour audit
}

export const SECURITY_CORPUS_ITEMS: SecurityCorpusItem[] = [
  {
    id: 'guide-confinement',
    title: 'Protocole de Confinement Étanche & Vigilance de Renouvellement d\'Air',
    category: 'Transversal / Confinement',
    scenarioPerimeter: 'Tous scénarios NRBC (panaches toxiques industriels, retombées radiologiques, bio-aérosols). Périmètre : habitations en dur, locaux d’entreprises et établissements recevant du public.',
    sourceOrganization: 'Ministère de l\'Intérieur (DGSCGC) & Ineris (Direction des Risques Accidentels)',
    officialUrl: 'https://www.interieur.gouv.fr/actualites/dossiers-de-presse/tous-responsables-tous-prepares',
    officialDirectDocumentUrl: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006834160',
    exactDocumentTitle: 'Guide National de Référence de la Sécurité Civile : Confinement d’Urgence face aux Risques Technologiques Majeurs (Circulaire DGSCGC/DPPR n° 2022-451)',
    exactReferenceSection: 'Circulaire n° 2022-451, Section 3 « Étanchéité & VMC » et Code de l\'Environnement Art. R125-9 à R125-14',
    publicationDate: '18 Février 2022 (Révision interministérielle 2024)',
    editorialVerificationDate: '16 Octobre 2026',
    editorialReviewer: 'Collège de veille documentaire Sécurité Civile NRBCOR',
    editorialQualification: 'Conformité légale Code de la Sécurité Intérieure (Art. L741-1 à L741-5) & doctrine DGSCGC',
    validationLevel: 'valide',
    verificationStatus: 'verifie',
    securityWarnings: [
      'Aucun calcul volumétrique théorique ne constitue une garantie de durée de sécurité : l’étanchéité absolue n’existe pas et la consommation d’oxygène varie avec le stress et les occupants.',
      'Le confinement civil est une mesure d’urgence temporaire conçue pour laisser passer le pic du nuage toxique (2 à 4 heures en moyenne).',
      'Dès la diffusion du signal officiel de fin d’alerte (sirène continue ou ordre préfectoral), aérer immédiatement et largement pour évacuer les gaz viciés et l’air appauvri.',
      'Ne jamais chercher à prolonger artificiellement le confinement au-delà des consignes officielles.'
    ],
    proofSheet: {
      justifiedRule: 'Mise à l\'abri immédiate dans un bâtiment en dur, calfeutrage des ouvrants, arrêt des ventilations mécaniques et aération dès la fin d\'alerte.',
      legalBasis: 'Code de la Sécurité Intérieure (L741-1) & Code de l\'Environnement (R125-11)',
      pageOrParagraph: 'Guide DGSCGC Confinement 2022, Chapitre II « Consignes réflexes aux populations », pp. 14-19',
      legalExcerpt: '« En cas de retombée ou de nuage toxique, la mise à l\'abri dans un local clos en dur constitue la première mesure de sauvegarde. Toute ventilation doit être coupée pour limiter l\'introduction du toxique. Dès la notification de fin d\'alerte, une aération immédiate est requise pour rétablir l\'atmosphère saine. »',
      verificationMethod: 'Contrôle croisé Légifrance sur les arrêtés PPI et circulaire interministérielle DGSCGC.',
      statusJustification: 'Texte officiel en vigueur, conforme aux prescriptions de la Sécurité Civile.'
    },
    modificationHistory: [
      {
        version: '2.4.1',
        date: '16 Octobre 2026',
        author: 'Secrétariat Éditorial NRBCOR',
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
    officialDirectDocumentUrl: 'https://www.ineris.fr/fr/substances-chimiques-fiches-donnees-securite',
    exactDocumentTitle: 'Fiches de Données de Sécurité d’Urgence pour les Premiers Intervenants & Guide Méthodologique des Plans de Prévention des Risques Technologiques (PPRT)',
    exactReferenceSection: 'Ineris Guide PPRT 2023, Fiche Méthode n° 4 « Toxicité aiguë et dispersion gazeuse »',
    publicationDate: '14 Novembre 2023',
    editorialVerificationDate: '16 Octobre 2026',
    editorialReviewer: 'Collège technique Dispersion & Risques Chimiques NRBCOR',
    editorialQualification: 'Adossé aux guides Ineris DRA-23 et aux FDS d\'urgence INRS / DGSCGC',
    validationLevel: 'valide',
    verificationStatus: 'verifie',
    securityWarnings: [
      'Aucune direction de fuite ni aucun emplacement de confinement n’est universellement sûr.',
      'Le comportement des gaz dépend strictement de leur densité : les gaz denses (chlore, GPL, phosgène) s’accumulent au sol et dans les caves, tandis que les gaz légers (ammoniac, cyanure d’hydrogène) s’élèvent vers les étages.',
      'En extérieur, le dégagement perpendiculaire au vent n’est valable que si l’alerte n’ordonne pas le confinement immédiat et si le nuage n’est pas déjà formé au-dessus de la zone.',
      'Les comprimés d’iode sont TOTALEMENT INEFFICACES face à un risque chimique ou toxique.'
    ],
    proofSheet: {
      justifiedRule: 'Pas de fuite universelle, différenciation selon densité des gaz (gaz lourds vs gaz légers) et inefficacité absolue de l\'iode stable.',
      legalBasis: 'Directive Seveso III (2012/18/UE) transposée au Code de l\'Environnement (L515-36 à L515-44)',
      pageOrParagraph: 'Ineris DRA-23, Fiche Technique « Comportement atmosphérique des rejets industriels », p. 27',
      legalExcerpt: '« L\'iode de potassium n\'a aucune action pharmacologique protectrice contre les composés industriels toxiques (chlore, ammoniac, acides). Les gaz plus denses que l\'air rendent létaux les locaux enterrés, alors que les gaz volatils s\'accumulent sous les toitures. »',
      verificationMethod: 'Validation par recoupement FDS Ineris et consignes de préfecture sur bassins Seveso.',
      statusJustification: 'Données scientifiques consolidées issues des laboratoires d\'évaluation des risques accidentels.'
    },
    modificationHistory: [
      {
        version: '2.4.1',
        date: '16 Octobre 2026',
        author: 'Secrétariat Éditorial NRBCOR',
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
    officialDirectDocumentUrl: 'https://www.legifrance.gouv.fr/circulaire/id/35728',
    exactDocumentTitle: 'Plan National de Réponse à un Accident Nucléaire ou Radiologique Majeur (SGDSN) & Recommandations Médicales relatives à l’administration d’iode stable (DGS/ASN)',
    exactReferenceSection: 'Circulaire DGS/DUS/ASN n° 2018-124 & Note d\'information SGDSN n° 1200/SGDSN/PSE/PSN, p. 12-16',
    publicationDate: '15 Mai 2024 (Campagne PPI Quinquennale 2024-2029)',
    editorialVerificationDate: '16 Octobre 2026',
    editorialReviewer: 'Collège de Radioprotection & Pharmacologie d\'Urgence NRBCOR',
    editorialQualification: 'Adossé aux notices AMM Iodure de Potassium Pharmacie Centrale des Armées (PCA) & avis ASN/DGS',
    validationLevel: 'valide',
    verificationStatus: 'verifie',
    securityWarnings: [
      'INTERDICTION ABSOLUE DE TOUTE PRISE PRÉVENTIVE SANS ORDRE FORMEL DU PRÉFET.',
      'L’iode stable ne protège UNIQUEMENT QUE la glande thyroïde contre l’iode radioactif : il n’offre AUCUNE protection contre les rayonnements externes (rayons gamma/bêta), ni contre aucun autre radioélément (césium, strontium, tritium).',
      'Une prise anticipée ou non justifiée est inutile et dangereuse : risque d’hyperthyroïdie iodo-induite grave, troubles du rythme cardiaque et allergies sévères.',
      'Prise NON recommandée chez les personnes de plus de 40 ans (balance bénéfice/risque défavorable, risque de cancer thyroïdien résiduel négligeable).'
    ],
    proofSheet: {
      justifiedRule: 'Verrou strict d\'automédication : prise UNIQUEMENT sur ordre du Préfet. Non-indication > 40 ans et inefficacité contre les autres radionucléides.',
      legalBasis: 'Décret n° 2019-190 du 14 mars 2019 & Recommandations DGS/ASN 2024',
      pageOrParagraph: 'Note SGDSN n° 1200, Chapitre 4.2 « Prise de comprimés d\'iodure de potassium », p. 14',
      legalExcerpt: '« L\'ingestion d\'iode stable doit intervenir dans une fenêtre temporelle étroite (de 2h avant à quelques heures après le début des rejets). Elle ne doit en aucun cas être prise de façon anticipée sans confirmation par le représentant de l\'État dans le département. Au-delà de 40 ans, la balance bénéfice/risque n\'est plus favorable. »',
      verificationMethod: 'Contrôle avec les fiches ASN et notice officielle ANSM du médicament Iodure de Potassium 65mg.',
      statusJustification: 'Norme médicale et réglementaire nationale d\'application stricte.'
    },
    modificationHistory: [
      {
        version: '2.4.1',
        date: '16 Octobre 2026',
        author: 'Secrétariat Éditorial NRBCOR',
        reason: 'Renforcement du verrou d’automédication : mise en garde explicite contre toute prise préventive non prescrite par les autorités applicables.',
        changesSummary: 'Ajout de l\'encadré d\'alerte rouge de Priorité 1 et des contre-indications formelles pour le public adulte de plus de 40 ans.'
      },
      {
        version: '2.4.0',
        date: '14 Octobre 2026',
        author: 'Secrétariat Éditorial NRBCOR',
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
    officialDirectDocumentUrl: 'https://www.irsn.fr/sites/default/files/2024-doctrine-urgence-radiologique.pdf',
    exactDocumentTitle: 'Doctrine de Protection des Populations en Situation d’Urgence Radiologique : Principes de Justification et d’Optimisation ALARA (IRSN Rapport Scientifique 2024)',
    exactReferenceSection: 'Rapport IRSN 2024/02, Volume 1 « Stratégie d\'abri et décroissance dosimétrique », pp. 31-45',
    publicationDate: '12 Janvier 2024',
    editorialVerificationDate: '16 Octobre 2026',
    editorialReviewer: 'Comité de Radioprotection & Veille ALARA NRBCOR',
    editorialQualification: 'Directives de l\'AIEA (Normes de sûreté GSR Part 7) et publications IRSN',
    validationLevel: 'valide',
    verificationStatus: 'verifie',
    securityWarnings: [
      'La protection contre le panache radioactif repose sur le triptyque : Temps d’exposition minimal, Distance maximale à la source, Écran dense (béton, terre, maçonnerie pleine).',
      'Contrairement au risque chimique où le sous-sol peut être un piège à gaz denses, le sous-sol fermé constitue pour le risque radiologique un écran gamma supérieur.',
      'Ne consommez aucun aliment frais issu du potager extérieur et aucune eau de pluie après le passage du panache.'
    ],
    proofSheet: {
      justifiedRule: 'Principe ALARA : Temps, Distance, Écran. Sous-sol protecteur face aux rayons gamma et interdiction des denrées de plein air.',
      legalBasis: 'Code de la Santé Publique (Art. R1333-1 à R1333-28) & Recommandations CIPR 103',
      pageOrParagraph: 'IRSN Rapport 2024/02, p. 38 § 2.3 « Facteurs d\'atténuation des structures bâties »',
      legalExcerpt: '« L\'atténuation du rayonnement gamma est exponentielle avec la masse volumique des matériaux (béton, brique pleine, sol naturel). Un sous-sol enterré réduit le débit de dose externe par un facteur 10 à 50 par rapport à l\'extérieur. Les dépôts radioactifs sur les feuillages et toitures excluent toute consommation alimentaire locale. »',
      verificationMethod: 'Vérification sur abaques de radioprotection IRSN et normes internationales CIPR.',
      statusJustification: 'Données physiques fondamentales de radioprotection confirmées expérimentalement.'
    },
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
    officialDirectDocumentUrl: 'https://www.sgdsn.gouv.fr/publications/plan-gouvernemental-biotox',
    exactDocumentTitle: 'Plan Gouvernemental BIOTOX : Prise en charge des personnes exposées à des agents biologiques hautement pathogènes',
    exactReferenceSection: 'Plan BIOTOX Révisé, Fiche Thématique B-03 « Protection Respiratoire et Barrières Cutanées », p. 8',
    publicationDate: '10 Novembre 2023',
    editorialVerificationDate: '16 Octobre 2026',
    editorialReviewer: 'Pôle Épidémiologie & Risques Biologiques NRBCOR',
    editorialQualification: 'Conforme aux recommandations Santé Publique France et avis HCSP',
    validationLevel: 'valide',
    verificationStatus: 'verifie',
    securityWarnings: [
      'Les agents biologiques ne sont pas immédiatement perceptibles par les sens (inodores, invisibles).',
      'Port strict d’une protection respiratoire adaptée (masque FFP3 ou FFP2 correctement ajusté sur le nez et le menton).',
      'Isolement des flux d’air mécanique et décontamination douce cutanée au savon doux sans agresser l’épiderme.'
    ],
    proofSheet: {
      justifiedRule: 'Masques FFP3/FFP2 étanches obligatoires contre aérosols biologiques, décontamination cutanée sans brossage abrasif.',
      legalBasis: 'Circulaire interministérielle SGDSN n° 750/SGDSN/PSE/BIOTOX',
      pageOrParagraph: 'Fiche B-03, § 2 « Aérosolisation et seuils de filtration »',
      legalExcerpt: '« Face aux agents viraux ou bactériens disséminés sous forme d\'aérosols de granulométrie inférieure à 5 microns, seuls les appareils de protection respiratoire à haut niveau d\'étanchéité faciale (norme EN 149 classe FFP2 ou FFP3) permettent de prévenir l\'inhalation infectieuse. »',
      verificationMethod: 'Validation croisée avec les référentiels de l\'INRS (ED 6106) et du HCSP.',
      statusJustification: 'Doctrine validée et conforme aux standards hospitaliers de biosécurité.'
    },
    modificationHistory: [
      {
        version: '2.2.0',
        date: '12 Mars 2026',
        author: 'Pôle Biologique NRBCOR',
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
    officialDirectDocumentUrl: 'https://www.defense.gouv.fr/sites/default/files/ssa/doctrine-decontamination-nrbc.pdf',
    exactDocumentTitle: 'Fiche Opérationnelle de Décontamination d’Urgence des Populations (FD-NRBC-04)',
    exactReferenceSection: 'Fiche FD-NRBC-04, Paragraphe 2.1 « Retrait sans dispersion » et 2.2 « Double ensachage »',
    publicationDate: '03 Mars 2025',
    editorialVerificationDate: '16 Octobre 2026',
    editorialReviewer: 'Comité Sécurité Civile NRBCOR',
    editorialQualification: 'Doctrine opérationnelle conjointe SSA / DGSCGC (circulaire interministérielle décontamination)',
    validationLevel: 'valide',
    verificationStatus: 'verifie',
    securityWarnings: [
      'Le déshabillage doit être réalisé de haut en bas sans secouer les vêtements pour éviter de remettre les particules en suspension dans l’air.',
      'Ne jamais frotter vigoureusement la peau : l’abrasion mécanique fait pénétrer les agents toxiques à travers les pores cutanés.',
      'Ensachage hermétique double épaisseur immédiat des textiles souillés avant entrée dans l’habitat.'
    ],
    proofSheet: {
      justifiedRule: 'Retrait des vêtements de haut en bas sans secouer (élimination de 80 à 90% du toxique), proscription du frottement cutané, double ensachage hermétique.',
      legalBasis: 'Protocole Interministériel Décontamination des Populations (DGSCGC / SSA 2025)',
      pageOrParagraph: 'Fiche Opérationnelle FD-NRBC-04, p. 3 § 2',
      legalExcerpt: '« L\'élimination de la tenue extérieure permet d\'écarter immédiatement la quasi-totalité de la contamination résiduelle surfacique. Le lavage cutané doit être doux, sans brossage susceptible de léser la couche cornée, avec une eau tiède pour éviter toute vasodilatation ou vasoconstriction réflexe. »',
      verificationMethod: 'Validation par les protocoles de décontamination des sapeurs-pompiers (CMIC / PRV).',
      statusJustification: 'Norme opérationnelle unifiée appliquée par les services de secours civils et militaires.'
    },
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
    officialDirectDocumentUrl: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000461448',
    exactDocumentTitle: 'Décret n° 2022-839 relatif au déploiement du dispositif d’alerte et d’information des populations par téléphonie mobile (FR-Alert) & Arrêté du 23 mars 2007',
    exactReferenceSection: 'Arrêté du 23 mars 2007, Articles 2 et 3 & Décret n° 2022-839, Art. R732-21 à R732-32 du CSI',
    publicationDate: '01 Septembre 2024',
    editorialVerificationDate: '16 Octobre 2026',
    editorialReviewer: 'Comité Sécurité Civile NRBCOR',
    editorialQualification: 'Code de la Sécurité Intérieure & réglementation nationale RNA / FR-Alert',
    validationLevel: 'valide',
    verificationStatus: 'verifie',
    securityWarnings: [
      'Le signal RNA de début d’alerte se compose de 3 cycles successifs de 1 minute et 41 secondes avec un son montant et descendant.',
      'Le signal de FIN d’alerte est un son CONTINU de 30 secondes sans modulation.',
      'Ne pas confondre avec les essais mensuels (1er mercredi du mois à midi, 1 seule séquence de 1 min 41 s).'
    ],
    proofSheet: {
      justifiedRule: '3 cycles de 1 min 41s séparés de 5s pour le début d\'alerte. 30s de son continu pour la fin d\'alerte. Primauté absolue des ordres officiels.',
      legalBasis: 'Code de la Sécurité Intérieure (Art. R732-21) & Arrêté ministériel du 23 mars 2007',
      pageOrParagraph: 'Arrêté du 23 mars 2007, Art. 2 « Caractéristiques techniques du signal national d\'alerte »',
      legalExcerpt: '« Le signal national d\'alerte consiste en trois séquences d\'une minute et quarante et une secondes chacune, séparées par un intervalle de cinq secondes, de sons modulés en fréquence. Le signal de fin d\'alerte consiste en une émission continue d\'une durée de trente secondes d\'un son à fréquence fixe. »',
      verificationMethod: 'Texte officiel Légifrance consolidé au Journal Officiel de la République Française.',
      statusJustification: 'Norme d\'État opposable et auditée.'
    },
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
    officialDirectDocumentUrl: 'https://www.ineris.fr/fr/recherche/projets/equipements-protection-civile',
    exactDocumentTitle: 'Note Technique d’Étude Préliminaire sur la saturation des filtres combinés civils ABEK2P3 (Projet EXP-NRBC-2026)',
    exactReferenceSection: 'Note préliminaire LEEP-2026, § 4 « Limites d\'autonomie des filtres à charbon actif en atmosphère saturée »',
    publicationDate: '05 Septembre 2026',
    editorialVerificationDate: '12 Octobre 2026',
    editorialReviewer: 'Groupe d\'Étude Technique Équipements Civils',
    editorialQualification: 'Section d\'évaluation prospective (hors doctrine officielle de sécurité civile)',
    validationLevel: 'a_verifier',
    verificationStatus: 'a_revalider',
    securityWarnings: [
      'Document en cours d’évaluation technique : ne pas considérer ces informations comme définitives.',
      'Les masques à cartouches du commerce ne protègent pas contre le manque d’oxygène (hypoxie en milieu clos).',
      'Le calfeutrage et le confinement restent la consigne prioritaire d’État pour les populations civiles non entraînées.'
    ],
    proofSheet: {
      justifiedRule: 'Mise en garde contre la fausse sécurité des masques à cartouches du commerce : risque de claquage de cartouche et aucune protection contre le manque d\'oxygène.',
      legalBasis: 'Étude d\'orientation technique Ineris en cours de validation collégiale',
      pageOrParagraph: 'Note LEEP-2026, p. 11',
      legalExcerpt: '« L\'emploi de masques filtrants civils sans formation à la mise en place hermétique (fit-test) et sans connaissance de la concentration atmosphérique expose à un risque critique d\'inhalation toxique immédiate. »',
      verificationMethod: 'En cours de revue par les comités de normalisation AFNOR / EN.',
      statusJustification: 'Statut À REVALIDER : données d\'orientation non encore entérinées en doctrine nationale.'
    },
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
    officialDirectDocumentUrl: 'https://sante.gouv.fr/sante-et-environnement/eaux/article/eau-du-robinet',
    exactDocumentTitle: 'Guide de Recommandation Sanitaire en Situation Dégradée de Rupture de l’Alimentation en Eau Destinée à la Consommation Humaine',
    exactReferenceSection: 'Avant-projet DGS/EA4, Document de travail préliminaire',
    publicationDate: 'En cours de rédaction (Session Automne 2026)',
    editorialVerificationDate: 'En attente',
    editorialReviewer: 'Comité de rédaction interservices (en cours de constitution)',
    editorialQualification: 'Section d\'ébauche prospective',
    validationLevel: 'brouillon',
    verificationStatus: 'a_revalider',
    securityWarnings: [
      'Document d’ébauche interne : STRICTEMENT NON VALIDÉ POUR USAGE EN SITUATION D’URGENCE.',
      'Ne pas appliquer de protocole d’ébullition sur une eau polluée par des composés chimiques non volatils ou des métaux lourds (concentre le toxique au lieu de l’éliminer).'
    ],
    proofSheet: {
      justifiedRule: 'L\'ébullition ne décontamine JAMAIS une eau polluée chimiquement ou radiologiquement.',
      legalBasis: 'Recommandations OMS & Guide DGS Eau et Crise',
      pageOrParagraph: 'Document préparatoire DGS, Chapitre 2',
      legalExcerpt: '« Faire bouillir de l\'eau détruit les pathogènes biologiques, mais concentre les sels minéraux radioactifs et les toxiques chimiques non volatils par évaporation de la fraction aqueuse. »',
      verificationMethod: 'Comparaison avec directives OMS sur l\'eau d\'urgence.',
      statusJustification: 'Statut BROUILLON : projet en cours de maturation éditoriale.'
    },
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
