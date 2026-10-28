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
  },
  {
    id: 'doc-suisse-ofpp',
    authority: 'SUISSE • OFPP / BABS & CENAL',
    title: 'Directives de Protection Civile & Centrale Nationale d’Alarme (CENAL)',
    refLegal: 'Loi fédérale sur la protection de la population (LPPCi) & Alertswiss',
    originalDate: '2023-2025',
    integrationDate: '24 Oct. 2026 (v2.4.2)',
    summary: 'Alarme générale de la population (sirène son oscillant 1 min), application Alertswiss, abris de protection civile et doctrine iode suisse (rayon 50 km CNPE Beznau, Gösgen, Leibstadt).',
    status: 'Conforme'
  },
  {
    id: 'doc-suisse-ofsp',
    authority: 'SUISSE • OFSP / BAG',
    title: 'Ordonnance sur la distribution de comprimés d’iode (OCI)',
    refLegal: 'RS 814.52 - Distribution préventive 50 km',
    originalDate: '2024',
    integrationDate: '24 Oct. 2026 (v2.4.2)',
    summary: 'Recommandations médicales fédérales suisses : délivrance par pharmacie, ordre fédéral de prise déclenché par la CENAL.',
    status: 'Conforme'
  },
  {
    id: 'doc-belgique-nccn',
    authority: 'BELGIQUE • Centre de Crise National (NCCN) & AFCN',
    title: 'Plan d’Urgence Nucléaire et Radiologique National',
    refLegal: 'Arrêté Royal du 17 octobre 2003 révisé & BE-Alert',
    originalDate: '2023',
    integrationDate: '24 Oct. 2026 (v2.4.2)',
    summary: 'Zones de planification d’urgence (20 km pour Doel / Tihange / Chooz), distribution préventive en pharmacie et système d’alerte BE-Alert.',
    status: 'Conforme'
  },
  {
    id: 'doc-international-aiea',
    authority: 'INTERNATIONAL • AIEA / IAEA & OMS / WHO',
    title: 'Preparedness and Response for a Nuclear or Radiological Emergency',
    refLegal: 'IAEA Safety Standards Series No. GSR Part 7 / WHO EPR-2023',
    originalDate: '2020-2023',
    integrationDate: '20 Oct. 2026 (v2.4.1)',
    summary: 'Niveaux d’intervention génériques opérationnels (OILs), justification de la mise à l’abri et décontamination d’urgence des populations civiles.',
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
