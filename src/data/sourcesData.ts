export interface DoctrineItem {
  id: string;
  authority: string;
  title: string;
  refLegal: string;
  originalDate: string;
  integrationDate: string;
  summary: string;
  status: string;
}

export const DOCTRINES_LIST: DoctrineItem[] = [
  {
    id: 'doc-interieur',
    authority: "MINISTÈRE DE L'INTÉRIEUR • DGSCGC",
    title: 'Guide National "Tous Responsables" & Plans NRBC',
    refLegal: 'Circulaire 451/SGDSN',
    originalDate: '18 Fév. 2022',
    integrationDate: '02 Oct. 2026 (v2.4)',
    summary: "Fiches de confinement citoyen, étanchéification des locaux face aux panaches toxiques et consignes d'alerte des populations.",
    status: 'Conforme'
  },
  {
    id: 'doc-nucleaire',
    authority: 'SÛRETÉ NUCLÉAIRE • ASNR / IRSN',
    title: 'Doctrine Nationale Iode Stable & Radioprotection',
    refLegal: 'Campagne PPI 2024-2029',
    originalDate: '15 Mai 2024',
    integrationDate: '14 Oct. 2026 (v2.4)',
    summary: "Protocoles de prise d'iode (posologie par tranche d'âge), délais d'efficacité thyroïdienne et vulgarisation des seuils en Sieverts.",
    status: 'Conforme'
  },
  {
    id: 'doc-defense',
    authority: 'DÉFENSE NATIONALE • SGDSN',
    title: "Plans d'Intervention PIRATOX, BIOTOX & PIRANET / PIRATOME",
    refLegal: 'Directives NRBC-E 2023',
    originalDate: '10 Nov. 2023',
    integrationDate: '12 Jan. 2026 (v2.0)',
    summary: "Identification préliminaire des vecteurs dispersifs, gestes d'urgence immédiats en cas d'exposition à des agents neurotoxiques, bactériologiques ou radiologiques.",
    status: 'Conforme'
  },
  {
    id: 'doc-sante',
    authority: 'SANTÉ PUBLIQUE FRANCE & ARS',
    title: 'Décontamination Cutanée & Intoxications Aiguës',
    refLegal: 'Protocole DGS/VSS-2025',
    originalDate: '03 Mars 2025',
    integrationDate: '18 Juin 2026 (v2.3)',
    summary: "Déshabillage sans dispersion, lavage doux non abrasif, rinçage abondant et gestion des brûlures par caustiques.",
    status: 'Conforme'
  },
  {
    id: 'doc-georisques',
    authority: 'TRANSITION ÉCOLOGIQUE • DGPR',
    title: 'Base Géorisques & Sites SEVESO Seuil Haut/Bas',
    refLegal: 'API OpenData Géo-ICPE',
    originalDate: 'Septembre 2026',
    integrationDate: '01 Oct. 2026 (v2.4)',
    summary: 'Inventaire cartographique des 1 312 établissements industriels à haut risque et plans de prévention des risques technologiques (PPRT).',
    status: 'Conforme'
  }
];

export interface ChangelogItem {
  version: string;
  date: string;
  desc: string;
}

export const CHANGELOG_ITEMS: ChangelogItem[] = [
  {
    version: 'Version 2.4',
    date: 'Octobre 2026',
    desc: "Mise à jour des fiches réflexes face au risque chimique (PPI Seveso). Intégration de la cartographie Géo-ICPE 2026 et synchronisation des seuils ASNR d'iode stable."
  },
  {
    version: 'Version 2.3',
    date: 'Juin 2026',
    desc: "Actualisation intégrale des permanences téléphoniques des Centres Antipoison (CAP) et harmonisation des recommandations d'aspersion d'urgence avec les ARS."
  },
  {
    version: 'Version 2.0',
    date: 'Janvier 2026',
    desc: 'Déploiement initial de l\'architecture PWA 100% hors-ligne. Consolidation multi-risques (Nucléaire, Radiologique, Biologique, Chimique).'
  }
];
