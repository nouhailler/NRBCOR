/**
 * Référentiel Hors-Ligne des Périmètres Industriels & Nucléaires Français
 * 100% Autonome (Zero-Cloud / Zero-Réseau)
 * 
 * Contient :
 * - Les 19 Centres Nucléaires de Production d'Électricité (CNPE EDF / CEA)
 * - Les 22 Plateformes & Sites Seveso Seuil Haut majeurs (Vallée de la Chimie, Fos, Seine, etc.)
 * - Calcul géodésique local (Haversine) pour déterminer en millisecondes le statut PPI et le rayon d'exposition
 */

export type SiteCategory = 'cnpe' | 'seveso';

export interface IndustrialSite {
  id: string;
  name: string;
  shortName: string;
  category: SiteCategory;
  operator: string;
  department: string;
  commune: string;
  lat: number;
  lng: number;
  ppiRadiusKm: number; // Rayon officiel du PPI (ex: 20 km CNPE, 5 km Seveso)
  reflexZoneRadiusKm: number; // Zone réflexe immédiate (ex: 5 km CNPE, 2 km Seveso)
  extendedVigilanceKm: number; // Vigilance élargie (ex: 50 km CNPE, 10 km Seveso)
  description: string;
  keyHazards: string[];
  officialDoctrine: {
    immediateReflex: string;
    iodineRule: string;
    sirenType: string;
    shelterInstruction: string;
  };
}

export const OFFLINE_INDUSTRIAL_SITES: IndustrialSite[] = [
  // ==========================================
  // LES 19 SITES NUCLÉAIRES (CNPE EDF / CEA)
  // ==========================================
  {
    id: 'cnpe-gravelines',
    name: 'Centrale Nucléaire de Gravelines (CNPE)',
    shortName: 'CNPE Gravelines',
    category: 'cnpe',
    operator: 'EDF',
    department: '59 - Nord',
    commune: 'Gravelines',
    lat: 51.0150,
    lng: 2.1360,
    ppiRadiusKm: 20,
    reflexZoneRadiusKm: 5,
    extendedVigilanceKm: 50,
    description: 'Plus puissante centrale nucléaire d’Europe de l’Ouest (6 réacteurs de 900 MWe). Proximité de Dunkerque et de la côte de la mer du Nord.',
    keyHazards: ['Iode-131 volatil', 'Gaz rares radioactifs', 'Césium-137 / Panache', 'Contamination surfacique'],
    officialDoctrine: {
      immediateReflex: "Mise à l'abri immédiate en bâtiment en dur, calfeutrage des fenêtres et écoute de France Bleu Nord.",
      iodineRule: "Distribution préventive 0-20 km. Ingestion des comprimés de KI UNIQUEMENT sur ordre formel du Préfet.",
      sirenType: 'Sirène PPI montante/descendante de 1 min 41s répétée 3 fois + FR-Alert.',
      shelterInstruction: 'Sous-sol ou pièce centrale sans fenêtre extérieure, couper immédiatement toute VMC.'
    }
  },
  {
    id: 'cnpe-chooz',
    name: 'Centrale Nucléaire de Chooz (CNPE)',
    shortName: 'CNPE Chooz',
    category: 'cnpe',
    operator: 'EDF',
    department: '08 - Ardennes',
    commune: 'Chooz',
    lat: 50.0903,
    lng: 4.7894,
    ppiRadiusKm: 20,
    reflexZoneRadiusKm: 5,
    extendedVigilanceKm: 50,
    description: 'Pointe de Givet, frontière franco-belge. 2 réacteurs de palier N4 de 1450 MWe.',
    keyHazards: ['Rejets atmosphériques sous pression', 'Iode-131', 'Retombées transfrontalières'],
    officialDoctrine: {
      immediateReflex: "Confinement réflexe. Coordination préfectorale conjointe France-Belgique.",
      iodineRule: "Stockage préventif obligatoire. Ne jamais ingérer préventivement sans directive préfectorale.",
      sirenType: 'Réseau National d\'Alerte (RNA) + sirènes belges transfrontalières.',
      shelterInstruction: 'Murs épais en béton, calfeutrage adhésif des ouvertures.'
    }
  },
  {
    id: 'cnpe-cattenom',
    name: 'Centrale Nucléaire de Cattenom (CNPE)',
    shortName: 'CNPE Cattenom',
    category: 'cnpe',
    operator: 'EDF',
    department: '57 - Moselle',
    commune: 'Cattenom',
    lat: 49.4161,
    lng: 6.2181,
    ppiRadiusKm: 20,
    reflexZoneRadiusKm: 5,
    extendedVigilanceKm: 50,
    description: 'Bassin mosellan, 4 réacteurs de 1300 MWe. Périmètre transfrontalier (Luxembourg et Allemagne).',
    keyHazards: ['Iode radioactif', 'Gaz nobles', 'Aérosols de produits de fission'],
    officialDoctrine: {
      immediateReflex: "Arrêt immédiat de toute ventilation et fermeture étanche des conduits.",
      iodineRule: "Distribution préventive en pharmacie sur rayon 20 km. Prise ordonnée uniquement par le Préfet.",
      sirenType: 'Sirène RNA 3 cycles de 101 secondes.',
      shelterInstruction: 'Pièce au rez-de-chaussée ou sous-sol, point d’eau intérieur si disponible.'
    }
  },
  {
    id: 'cnpe-paluel',
    name: 'Centrale Nucléaire de Paluel (CNPE)',
    shortName: 'CNPE Paluel',
    category: 'cnpe',
    operator: 'EDF',
    department: '76 - Seine-Maritime',
    commune: 'Paluel',
    lat: 49.8581,
    lng: 0.6347,
    ppiRadiusKm: 20,
    reflexZoneRadiusKm: 5,
    extendedVigilanceKm: 50,
    description: 'Littoral de la Manche, 4 réacteurs de 1300 MWe. Zone maritime et plateaux cauchois.',
    keyHazards: ['Panache radioactif maritime ou terrestre selon le régime des vents d\'ouest'],
    officialDoctrine: {
      immediateReflex: "S'abriter dans l'habitation la plus proche, ne pas prendre la route du littoral.",
      iodineRule: "Comprimés de 65 mg de KI disponibles en pharmacie conventionnée (rayon 20 km).",
      sirenType: 'Sirènes PPI + FR-Alert sur le littoral cauchois.',
      shelterInstruction: 'Calfeutrage au ruban large sur portes et fenêtres exposées au vent.'
    }
  },
  {
    id: 'cnpe-penly',
    name: 'Centrale Nucléaire de Penly (CNPE)',
    shortName: 'CNPE Penly',
    category: 'cnpe',
    operator: 'EDF',
    department: '76 - Seine-Maritime',
    commune: 'Penly / Petit-Caux',
    lat: 49.9758,
    lng: 1.2125,
    ppiRadiusKm: 20,
    reflexZoneRadiusKm: 5,
    extendedVigilanceKm: 50,
    description: 'Falaise côtière entre Dieppe et Le Tréport. 2 réacteurs de 1300 MWe (site sélectionné pour la première paire d’EPR2).',
    keyHazards: ['Iode-131', 'Tritium', 'Retombées différées'],
    officialDoctrine: {
      immediateReflex: "Confinement immédiat, pas d’évacuation spontanée sur le réseau routier.",
      iodineRule: "Ingestion strictement subordonnée à l'ordre préfectoral (diffusion France Bleu Normandie).",
      sirenType: 'Sirène PPI 3 séquences de 101s.',
      shelterInstruction: 'Bâtiment maçonné, calfeutrage des conduits de cheminée et aérateurs.'
    }
  },
  {
    id: 'cnpe-flamanville',
    name: 'Centrale Nucléaire de Flamanville (CNPE)',
    shortName: 'CNPE Flamanville',
    category: 'cnpe',
    operator: 'EDF',
    department: '50 - Manche',
    commune: 'Flamanville',
    lat: 49.5367,
    lng: -1.8808,
    ppiRadiusKm: 20,
    reflexZoneRadiusKm: 5,
    extendedVigilanceKm: 50,
    description: 'Presqu’île du Cotentin. 2 réacteurs de 1300 MWe + 1 réacteur EPR de 1650 MWe.',
    keyHazards: ['Rejets en régime maritime', 'Exposition gamma externe', 'Inhalation d’iode radioactif'],
    officialDoctrine: {
      immediateReflex: "Mise à l'abri immédiate, écoute de France Bleu Cotentin.",
      iodineRule: "Campagne de distribution permanente 0-20 km. Prise formellement interdite sans ordre préfectoral.",
      sirenType: 'Sirène RNA + FR-Alert.',
      shelterInstruction: 'Éviter les vérandas ou façades vitrées côtières. Privilégier les pièces aveugles.'
    }
  },
  {
    id: 'cnpe-nogent',
    name: 'Centrale Nucléaire de Nogent-sur-Seine (CNPE)',
    shortName: 'CNPE Nogent-sur-Seine',
    category: 'cnpe',
    operator: 'EDF',
    department: '10 - Aube',
    commune: 'Nogent-sur-Seine',
    lat: 48.5153,
    lng: 3.5186,
    ppiRadiusKm: 20,
    reflexZoneRadiusKm: 5,
    extendedVigilanceKm: 50,
    description: 'Vallée de la Seine en amont de Paris (à 100 km de la région parisienne). 2 réacteurs de 1300 MWe avec tours aéroréfrigérantes de 165 m.',
    keyHazards: ['Panache radioactif potentiel en direction de l’Île-de-France selon météo', 'Iode-131'],
    officialDoctrine: {
      immediateReflex: "Confinement immédiat, coupure des ventilations forcées et fermeture des cheminées.",
      iodineRule: "Zone PPI 20 km couverte par dotation préventive. Ne pas prendre d'iode hors consigne officielle.",
      sirenType: 'Sirène PPI 1 min 41s x 3.',
      shelterInstruction: 'Pièce centrale maçonnée, linges humides sous les bas de portes.'
    }
  },
  {
    id: 'cnpe-dampierre',
    name: 'Centrale Nucléaire de Dampierre (CNPE)',
    shortName: 'CNPE Dampierre',
    category: 'cnpe',
    operator: 'EDF',
    department: '45 - Loiret',
    commune: 'Dampierre-en-Burly',
    lat: 47.7333,
    lng: 2.5189,
    ppiRadiusKm: 20,
    reflexZoneRadiusKm: 5,
    extendedVigilanceKm: 50,
    description: 'Val de Loire, 4 réacteurs de 900 MWe. À proximité de Gien et Montargis.',
    keyHazards: ['Iode-131', 'Nuage d\'aérosols radioactifs', 'Contamination des sols'],
    officialDoctrine: {
      immediateReflex: "Mise à l'abri, fermeture hermétique des issues et coupure VMC.",
      iodineRule: "Ne prendre les comprimés QUE si la préfecture en donne l'ordre formel à la radio.",
      sirenType: 'Sirène RNA + FR-Alert.',
      shelterInstruction: 'Bâtiment en pierre ou béton, pièce la moins ventilée.'
    }
  },
  {
    id: 'cnpe-saint-laurent',
    name: 'Centrale Nucléaire de Saint-Laurent (CNPE)',
    shortName: 'CNPE Saint-Laurent',
    category: 'cnpe',
    operator: 'EDF',
    department: '41 - Loir-et-Cher',
    commune: 'Saint-Laurent-des-Eaux',
    lat: 47.7200,
    lng: 1.5786,
    ppiRadiusKm: 20,
    reflexZoneRadiusKm: 5,
    extendedVigilanceKm: 50,
    description: 'Bords de Loire entre Blois et Orléans. 2 réacteurs REP de 900 MWe en service + 2 anciens réacteurs UNGG en démantèlement.',
    keyHazards: ['Produits de fission volatils', 'Gaz nobles', 'Rejets iodes'],
    officialDoctrine: {
      immediateReflex: "Confinement réflexe sans fuite sur les axes routiers.",
      iodineRule: "Distribution assurée en pharmacie sur rayon 20 km. Zéro automédication.",
      sirenType: 'Sirène PPI 3 cycles.',
      shelterInstruction: 'Calfeutrage au ruban adhésif des aérations.'
    }
  },
  {
    id: 'cnpe-chinon',
    name: 'Centrale Nucléaire de Chinon (CNPE)',
    shortName: 'CNPE Chinon',
    category: 'cnpe',
    operator: 'EDF',
    department: '37 - Indre-et-Loire',
    commune: 'Avoine',
    lat: 47.2306,
    lng: 0.1708,
    ppiRadiusKm: 20,
    reflexZoneRadiusKm: 5,
    extendedVigilanceKm: 50,
    description: 'Confluence Loire-Vienne. 4 réacteurs REP de 900 MWe + réacteurs historiques en démantèlement.',
    keyHazards: ['Iode-131', 'Césium', 'Irradiation externe panache'],
    officialDoctrine: {
      immediateReflex: "S'abriter dans le bâtiment en dur le plus proche, écoute France Bleu Touraine.",
      iodineRule: "Dotation en officine pour tout habitant du périmètre 20 km. Ingestion sur ordre.",
      sirenType: 'Sirène RNA + diffusion FR-Alert.',
      shelterInstruction: 'Local intérieur étanche, réserves d’eau potable en bouteille.'
    }
  },
  {
    id: 'cnpe-civaux',
    name: 'Centrale Nucléaire de Civaux (CNPE)',
    shortName: 'CNPE Civaux',
    category: 'cnpe',
    operator: 'EDF',
    department: '86 - Vienne',
    commune: 'Civaux',
    lat: 46.4567,
    lng: 0.6536,
    ppiRadiusKm: 20,
    reflexZoneRadiusKm: 5,
    extendedVigilanceKm: 50,
    description: 'Bords de la Vienne au sud-est de Poitiers. 2 réacteurs les plus récents du palier N4 (1450 MWe chacun).',
    keyHazards: ['Rejets sous pression de produits radioactifs', 'Iodes'],
    officialDoctrine: {
      immediateReflex: "Rentrer immédiatement à l'intérieur, ne pas aller chercher les enfants à l'école.",
      iodineRule: "Comprimés de KI disponibles en mairie/pharmacie dans le rayon 20 km.",
      sirenType: 'Sirène PPI 3 cycles de 101s.',
      shelterInstruction: 'Sous-sol ou rez-de-chaussée protégé des ouvertures directes.'
    }
  },
  {
    id: 'cnpe-blayais',
    name: 'Centrale Nucléaire du Blayais (CNPE)',
    shortName: 'CNPE Blayais',
    category: 'cnpe',
    operator: 'EDF',
    department: '33 - Gironde',
    commune: 'Braud-et-Saint-Louis',
    lat: 45.2561,
    lng: -0.6936,
    ppiRadiusKm: 20,
    reflexZoneRadiusKm: 5,
    extendedVigilanceKm: 50,
    description: 'Estuaire de la Gironde au nord de Bordeaux. 4 réacteurs REP de 900 MWe.',
    keyHazards: ['Panache radioactif estuarien', 'Iode-131', 'Retombées sur vignobles et cultures'],
    officialDoctrine: {
      immediateReflex: "Confinement immédiat, pas de sortie en extérieur, écoute de France Bleu Gironde.",
      iodineRule: "Distribution préventive 20 km. Ne jamais prendre sans ordre du Préfet.",
      sirenType: 'Sirène RNA + FR-Alert.',
      shelterInstruction: 'Murs épais, couper climatisations et cheminées.'
    }
  },
  {
    id: 'cnpe-golfech',
    name: 'Centrale Nucléaire de Golfech (CNPE)',
    shortName: 'CNPE Golfech',
    category: 'cnpe',
    operator: 'EDF',
    department: '82 - Tarn-et-Garonne',
    commune: 'Golfech',
    lat: 44.1114,
    lng: 0.8447,
    ppiRadiusKm: 20,
    reflexZoneRadiusKm: 5,
    extendedVigilanceKm: 50,
    description: 'Bords de la Garonne entre Agen et Montauban. 2 réacteurs de 1300 MWe avec tours réfrigérantes de 178 m.',
    keyHazards: ['Iode-131', 'Aérosols de fission', 'Contamination du bassin de la Garonne'],
    officialDoctrine: {
      immediateReflex: "Mise à l'abri, calfeutrage et arrêt des prises d'air extérieures.",
      iodineRule: "Iode distribué sur le périmètre 20 km. Réservé à l'ordre préfectoral.",
      sirenType: 'Sirène PPI 3 séquences de 101s.',
      shelterInstruction: 'Pièce centrale fermée, calfeutrage des bas de portes.'
    }
  },
  {
    id: 'cnpe-tricastin',
    name: 'Site Nucléaire du Tricastin (CNPE & Orano)',
    shortName: 'Site Tricastin',
    category: 'cnpe',
    operator: 'EDF / Orano',
    department: '26 - Drôme',
    commune: 'Saint-Paul-Trois-Châteaux',
    lat: 44.3311,
    lng: 4.7322,
    ppiRadiusKm: 20,
    reflexZoneRadiusKm: 5,
    extendedVigilanceKm: 50,
    description: 'Vallée du Rhône (Drôme, Vaucluse, Gard, Ardèche). 4 réacteurs REP de 900 MWe + usine d’enrichissement Georges Besse II et chimie de l’uranium.',
    keyHazards: ['Iode-131', 'Hexafluorure d’uranium (UF6 - risque chimique combiné)', 'Gaz de fission'],
    officialDoctrine: {
      immediateReflex: "Confinement réflexe immédiat compte tenu du double risque radiochimique (uranium/HF).",
      iodineRule: "Comprimés KI disponibles en permanence. Ingestion sur ordre préfectoral.",
      sirenType: 'Sirène PPI + avertisseur spécifique site.',
      shelterInstruction: 'Bâtiment fermé hermétiquement, pas de déplacement sous le panache.'
    }
  },
  {
    id: 'cnpe-cruas',
    name: 'Centrale Nucléaire de Cruas-Meysse (CNPE)',
    shortName: 'CNPE Cruas-Meysse',
    category: 'cnpe',
    operator: 'EDF',
    department: '07 - Ardèche',
    commune: 'Cruas',
    lat: 44.7333,
    lng: 4.7558,
    ppiRadiusKm: 20,
    reflexZoneRadiusKm: 5,
    extendedVigilanceKm: 50,
    description: 'Vallée du Rhône entre Montélimar et Privas. 4 réacteurs REP de 900 MWe sur appuis antisismiques.',
    keyHazards: ['Iode-131', 'Panache de vallée du Rhône (couloir Mistral)'],
    officialDoctrine: {
      immediateReflex: "Mise à l'abri immédiate dans les habitations, calfeutrage soigné.",
      iodineRule: "Campagne de distribution 20 km. Ingestion interdite sans ordre de la préfecture.",
      sirenType: 'Sirène RNA 3 cycles.',
      shelterInstruction: 'Local clos au centre du logement, boucher fentes et chatières.'
    }
  },
  {
    id: 'cnpe-saint-alban',
    name: 'Centrale Nucléaire de Saint-Alban (CNPE)',
    shortName: 'CNPE Saint-Alban',
    category: 'cnpe',
    operator: 'EDF',
    department: '38 - Isère',
    commune: 'Saint-Alban-du-Rhône',
    lat: 45.4039,
    lng: 4.7550,
    ppiRadiusKm: 20,
    reflexZoneRadiusKm: 5,
    extendedVigilanceKm: 50,
    description: 'Vallée du Rhône à 50 km au sud de Lyon. 2 réacteurs de 1300 MWe.',
    keyHazards: ['Iode-131', 'Produits de fission', 'Propagation nord/sud le long du sillon rhodanien'],
    officialDoctrine: {
      immediateReflex: "Confinement étanche, écoute immédiate de France Bleu Isère / France Bleu Drôme.",
      iodineRule: "Pré-distribution 20 km. Prise UNIQUEMENT sur consigne officielle des autorités.",
      sirenType: 'Sirène PPI 1 min 41s x 3.',
      shelterInstruction: 'Pièce sans ouverture directe vers le couloir rhodanien.'
    }
  },
  {
    id: 'cnpe-bugey',
    name: 'Centrale Nucléaire du Bugey (CNPE)',
    shortName: 'CNPE Bugey',
    category: 'cnpe',
    operator: 'EDF',
    department: '01 - Ain',
    commune: 'Saint-Vulbas',
    lat: 45.7994,
    lng: 5.2711,
    ppiRadiusKm: 20,
    reflexZoneRadiusKm: 5,
    extendedVigilanceKm: 50,
    description: 'Plaine de l’Ain à 35 km à l’est de la métropole de Lyon. 4 réacteurs REP de 900 MWe en service + 1 réacteur UNGG en démantèlement.',
    keyHazards: ['Iode-131 volatil', 'Nuage radioactif en direction possible de l’agglomération lyonnaise'],
    officialDoctrine: {
      immediateReflex: "Mise à l'abri immédiate dans un bâtiment maçonné, coupure des ventilations.",
      iodineRule: "Comprimés KI pré-distribués dans le rayon 20 km. Au-delà (Lyon métropole ~35 km), distribution différée sur stocks nationaux si nécessaire.",
      sirenType: 'Sirène RNA + FR-Alert sur le secteur Est-Lyonnais et Plaine de l’Ain.',
      shelterInstruction: 'Sous-sol ou pièce centrale sans prise d\'air directe.'
    }
  },
  {
    id: 'cnpe-belleville',
    name: 'Centrale Nucléaire de Belleville (CNPE)',
    shortName: 'CNPE Belleville',
    category: 'cnpe',
    operator: 'EDF',
    department: '18 - Cher',
    commune: 'Belleville-sur-Loire',
    lat: 47.5097,
    lng: 2.8767,
    ppiRadiusKm: 20,
    reflexZoneRadiusKm: 5,
    extendedVigilanceKm: 50,
    description: 'Val de Loire aux confins du Cher, de la Nièvre, du Loiret et de l’Yonne. 2 réacteurs de 1300 MWe.',
    keyHazards: ['Iode-131', 'Panache de produits de fission'],
    officialDoctrine: {
      immediateReflex: "Confinement réflexe, ne pas s'enfuir en voiture.",
      iodineRule: "Dotation en pharmacie 20 km. Ingestion subordonnée à l'ordre préfectoral.",
      sirenType: 'Sirène RNA 3 cycles.',
      shelterInstruction: 'Habitation fermée, calfeutrage des conduits d\'aération.'
    }
  },
  {
    id: 'cnpe-marcoule',
    name: 'Site Nucléaire de Marcoule (CEA / Melox)',
    shortName: 'Site Marcoule / CEA',
    category: 'cnpe',
    operator: 'CEA / Orano',
    department: '30 - Gard',
    commune: 'Chusclan / Codolet',
    lat: 44.1436,
    lng: 4.7083,
    ppiRadiusKm: 20,
    reflexZoneRadiusKm: 5,
    extendedVigilanceKm: 50,
    description: 'Site pionnier du nucléaire français. Installations de recherche Atalante, fabrication de combustible MOX (usine Melox), démantèlement Phénix.',
    keyHazards: ['Poussières d’actinides / plutonium', 'Contamination alpha/bêta', 'Rejets radiologiques'],
    officialDoctrine: {
      immediateReflex: "Confinement hermétique impératif contre les particules en suspension (alpha/bêta).",
      iodineRule: "Stockage préventif en zone PPI. Comprimés inefficaces contre les émetteurs alpha purs (utiles uniquement si iode radioactif).",
      sirenType: 'Sirène PPI d\'établissement + RNA.',
      shelterInstruction: 'Fermeture étanche des fenêtres, port d\'un masque ou linge humide si brèche d\'étanchéité.'
    }
  },

  // ==========================================
  // LES 22 SITES SEVESO SEUIL HAUT MAJEURS
  // ==========================================
  {
    id: 'seveso-feyzin',
    name: 'Raffinerie & Plateforme Pétrochimique de Feyzin',
    shortName: 'Raffinerie de Feyzin',
    category: 'seveso',
    operator: 'TotalEnergies',
    department: '69 - Rhône',
    commune: 'Feyzin',
    lat: 45.6706,
    lng: 4.8583,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Raffinerie de pétrole brut, vapocraqueur, stockage de GPL et hydrocarbures sous pression. Site Seveso Seuil Haut majeur au sud de Lyon (A7 / M7).',
    keyHazards: ['Explosion UVCE (nuage de gaz)', 'Incendie BLEVE', 'Nuage toxique de dioxyde de soufre (SO2)', 'Fumées d’hydrocarbures'],
    officialDoctrine: {
      immediateReflex: "S'éloigner immédiatement des vitres (risque de bris par surpression d'onde de choc). Confinement dans une pièce opposée au site.",
      iodineRule: "Comprimés d'iode STRICTEMENT INUTILES face aux risques chimiques et pétroliers.",
      sirenType: 'Corne / Sirène PPI spécifique Seveso + diffusion FR-Alert.',
      shelterInstruction: 'Bâtiment fermé, calfeutrage des fenêtres, pas de flamme ni d’étincelle (interrupteurs).'
    }
  },
  {
    id: 'seveso-saint-fons',
    name: 'Plateformes Chimiques de Saint-Fons (Couloir de la Chimie)',
    shortName: 'Chimie Saint-Fons',
    category: 'seveso',
    operator: 'Kem One / Solvay / Elkem',
    department: '69 - Rhône',
    commune: 'Saint-Fons',
    lat: 45.7083,
    lng: 4.8536,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Cœur historique de la chimie de spécialités et de polymères. Synthèse chlorée, silicones, intermédiaires aromatiques.',
    keyHazards: ['Chlore gazeux (toxique létal par inhalation)', 'Chlorure de vinyle monomère (CVM)', 'Acide chlorhydrique'],
    officialDoctrine: {
      immediateReflex: "Le chlore étant plus lourd que l'air, NE PAS descendre en sous-sol ou en cave. Monter aux étages supérieurs, calfeutrer.",
      iodineRule: "L'iode stable n'a aucun effet protecteur face aux intoxications par le chlore ou les acides.",
      sirenType: 'Sirène PPI Seveso.',
      shelterInstruction: 'Étage surélevé, pièce aveugle sans ventilation, serviettes imbibées d\'eau au bas des portes.'
    }
  },
  {
    id: 'seveso-rouen-lubrizol',
    name: 'Pôle Chimique Seine-Aval / Rouen (Lubrizol & NL)',
    shortName: 'Bassin Chimique Rouen',
    category: 'seveso',
    operator: 'Lubrizol France / Normandie Logistique',
    department: '76 - Seine-Maritime',
    commune: 'Rouen',
    lat: 49.4286,
    lng: 1.0583,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Additifs pour lubrifiants industriels, stockages chimiques denses en bord de Seine au cœur de l’agglomération rouennaise.',
    keyHazards: ['Fumées d’incendie chargées en hydrocarbures lourds, soufre et phosphore', 'Odeurs mercaptans / H2S'],
    officialDoctrine: {
      immediateReflex: "Confinement étanche, fermeture immédiate des fenêtres, pas d’exposition sous les retombées de suie.",
      iodineRule: "Aucun rôle de l'iode stable. Protocole purement chimique et toxique.",
      sirenType: 'Sirène RNA + alerte préfectorale.',
      shelterInstruction: 'Rester à l’intérieur tant que le panache de fumées est visible ou odorant.'
    }
  },
  {
    id: 'seveso-le-havre-gonfreville',
    name: 'Plateforme Pétrochimique de Gonfreville-l’Orcher / Le Havre',
    shortName: 'Pétrochimie Gonfreville',
    category: 'seveso',
    operator: 'TotalEnergies Raffinage / Cabot',
    department: '76 - Seine-Maritime',
    commune: 'Gonfreville-l’Orcher',
    lat: 49.4975,
    lng: 0.2361,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'La plus grande raffinerie de France (Normandie) associée à un vapocraqueur et un complexe de noir de carbone.',
    keyHazards: ['Explosion d’hydrocarbures', 'Fuite de gaz toxiques de raffinage (H2S, CO)', 'Incendie majeur de bacs pétroliers'],
    officialDoctrine: {
      immediateReflex: "S'abriter dans un local en dur, éteindre toute source de chaleur ou flamme.",
      iodineRule: "Iode strictement inutile pour les risques pétrochimiques.",
      sirenType: 'Sirène PPI d’établissement.',
      shelterInstruction: 'Pièce côté opposé aux unités de raffinage, calfeutrage des fenêtres.'
    }
  },
  {
    id: 'seveso-port-jerome',
    name: 'Plateforme Industrielle de Port-Jérôme-sur-Seine',
    shortName: 'Chimie Port-Jérôme',
    category: 'seveso',
    operator: 'ExxonMobil Chemical / Synthos',
    department: '76 - Seine-Maritime',
    commune: 'Port-Jérôme-sur-Seine',
    lat: 49.4800,
    lng: 0.5280,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Complexe pétrochimique majeur en bordure de la boucle de la Seine. Production d’éthylène, propylène et élastomères.',
    keyHazards: ['Incendie de gaz liquéfiés', 'Dispersion de composés organiques volatils (COV)'],
    officialDoctrine: {
      immediateReflex: "Mise à l'abri réflexe et arrêt complet des systèmes de ventilation.",
      iodineRule: "Aucun comprimé d'iode requis.",
      sirenType: 'Sirène PPI 1 min 41s.',
      shelterInstruction: 'Logement en dur, rideaux tirés pour limiter l’effet thermique en cas de torche.'
    }
  },
  {
    id: 'seveso-fos-mer',
    name: 'Zone Industrialo-Portuaire de Fos-sur-Mer',
    shortName: 'ZIP Fos-sur-Mer',
    category: 'seveso',
    operator: 'ArcelorMittal / Kem One / Elengy / Gaz de France',
    department: '13 - Bouches-du-Rhône',
    commune: 'Fos-sur-Mer',
    lat: 43.4375,
    lng: 4.9458,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'L’une des plus vastes zones industrialo-portuaires d’Europe : sidérurgie lourde, terminaux méthaniers GNL, chlorochimie et vapocraquage.',
    keyHazards: ['Fuite massive de chlore', 'Nuage inflammable de gaz naturel (GNL)', 'Monoxyde de carbone (CO) sidérurgique'],
    officialDoctrine: {
      immediateReflex: "Confinement d'urgence. Pour le chlore : ne pas aller en sous-sol. Écoute France Bleu Provence.",
      iodineRule: "Zéro comprimé d'iode pour les accidents Seveso.",
      sirenType: 'Réseau de sirènes PPI Fos / Golfe de Fos.',
      shelterInstruction: 'Étage supérieur, calfeutrage des fenêtres face à la mer et aux installations.'
    }
  },
  {
    id: 'seveso-lavera',
    name: 'Plateforme Pétrochimique de Lavéra / Martigues',
    shortName: 'Pétrochimie Lavéra',
    category: 'seveso',
    operator: 'Ineos / Petroineos / Naphtachimie',
    department: '13 - Bouches-du-Rhône',
    commune: 'Martigues',
    lat: 43.3853,
    lng: 5.0117,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Raffinerie, vapocraqueur et stockages d’éthylène, d’oxyde d’éthylène et de butadiène entre mer et étang de Berre.',
    keyHazards: ['Oxyde d’éthylène (toxique et hautement explosif)', 'Vapeurs d’hydrocarbures', 'Surpression'],
    officialDoctrine: {
      immediateReflex: "Confinement immédiat, calfeutrage et protection contre les bris de verre.",
      iodineRule: "Pas d'iode médical pour ce risque.",
      sirenType: 'Sirène PPI d’établissement.',
      shelterInstruction: 'Pièce centrale isolée des ouvertures maritimes.'
    }
  },
  {
    id: 'seveso-berre',
    name: 'Pôle Pétrochimique de Berre-l’Étang',
    shortName: 'Pétrochimie Berre',
    category: 'seveso',
    operator: 'LyondellBasell Chemical',
    department: '13 - Bouches-du-Rhône',
    commune: 'Berre-l’Étang',
    lat: 43.4833,
    lng: 5.1667,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Polymères, polypropylène, vapocraqueur et parc de stockage de carburants sur les rives de l’Étang de Berre.',
    keyHazards: ['Incendie de bacs d’hydrocarbures', 'Fumées noires opaques', 'Panache de combustion'],
    officialDoctrine: {
      immediateReflex: "S'abriter dans un bâtiment en dur, calfeutrer les aérations.",
      iodineRule: "Inutilité stricte de l'iode.",
      sirenType: 'Sirène PPI Seveso.',
      shelterInstruction: 'Éviter toute exposition aux fumées et suies toxiques.'
    }
  },
  {
    id: 'seveso-dunkerque',
    name: 'Plateforme Industrielle de Mardyck / Dunkerque',
    shortName: 'Industrie Dunkerque / Mardyck',
    category: 'seveso',
    operator: 'TotalEnergies / Aluminium Dunkerque / Polimeri',
    department: '59 - Nord',
    commune: 'Mardyck / Dunkerque',
    lat: 51.0286,
    lng: 2.2981,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Complexe industriel lourd du littoral dunkerquois. Chimie fine, lubrifiants, dépôts pétroliers et métallurgie.',
    keyHazards: ['Acide fluorhydrique (HF)', 'Ammoniac', 'Gaz inflammables sous pression'],
    officialDoctrine: {
      immediateReflex: "Mise à l'abri réflexe, ne pas s'enfuir vers le port ou les axes autoroutiers côtiers.",
      iodineRule: "L'iode stable ne protège aucunement contre les acides ou l'ammoniac.",
      sirenType: 'Sirène PPI + RNA.',
      shelterInstruction: 'Calfeutrage au ruban adhésif des fenêtres.'
    }
  },
  {
    id: 'seveso-donges',
    name: 'Raffinerie de Donges (Estuaire de la Loire)',
    shortName: 'Raffinerie de Donges',
    category: 'seveso',
    operator: 'TotalEnergies',
    department: '44 - Loire-Atlantique',
    commune: 'Donges',
    lat: 47.3192,
    lng: -2.0736,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Deuxième plus grande raffinerie française, située le long de la voie ferrée Nantes-Saint-Nazaire.',
    keyHazards: ['Incendie majeur d’hydrocarbures', 'Fuite de gaz de raffinage (H2S)', 'Explosion de réservoirs'],
    officialDoctrine: {
      immediateReflex: "Confinement réflexe. Éteindre chaudières et appareils à combustion.",
      iodineRule: "Aucune indication pour l'iode stable.",
      sirenType: 'Sirène PPI de raffinerie.',
      shelterInstruction: 'Pièce côté opposé à l’estuaire et aux voies ferrées.'
    }
  },
  {
    id: 'seveso-lacq',
    name: 'Bassin Chimique de Lacq / Mourenx',
    shortName: 'Bassin Chimique de Lacq',
    category: 'seveso',
    operator: 'Arkema / Sobegi / Toray',
    department: '64 - Pyrénées-Atlantiques',
    commune: 'Lacq / Mourenx',
    lat: 43.4117,
    lng: -0.6186,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Pôle historique du gaz acide et de la thiochimie mondiale (chimie du soufre). Synthèse de mercaptans et fibres de carbone.',
    keyHazards: ['Hydrogène sulfuré (H2S - toxique létal immédiat à faible dose)', 'Mercaptans', 'Dioxyde de soufre'],
    officialDoctrine: {
      immediateReflex: "Le gaz H2S étant mortel par inhalation et lourd : monter en hauteur, calfeutrage ultra-serré immédiat.",
      iodineRule: "L'iode stable est inopérant contre l'hydrogène sulfuré.",
      sirenType: 'Sirène spécifique PPI Lacq (signal sonore modulé puissant).',
      shelterInstruction: 'Étage supérieur, ruban adhésif et tissus mouillés sous les portes.'
    }
  },
  {
    id: 'seveso-pont-de-claix',
    name: 'Plateforme Chimique de Pont-de-Claix',
    shortName: 'Plateforme Pont-de-Claix',
    category: 'seveso',
    operator: 'Vencorex / ChlorAlp',
    department: '38 - Isère',
    commune: 'Le Pont-de-Claix',
    lat: 45.1264,
    lng: 5.6983,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Au sud de l’agglomération grenobloise. Chlorochimie de base, synthèse d’isocyanates et d’acide chlorhydrique.',
    keyHazards: ['Chlore gazeux (lourd)', 'Phosgène (hautement toxique pulmonaire)', 'Isocyanates (TDI/HDI)'],
    officialDoctrine: {
      immediateReflex: "Alerte chlore/phosgène : MONTER DANS LES ÉTAGES (gaz plus lourds que l'air), interdiction des caves et sous-sols.",
      iodineRule: "Aucun rôle de l'iode.",
      sirenType: 'Sirène PPI de la plateforme chimique.',
      shelterInstruction: 'Étage supérieur, pièce borgne calfeutrée au ruban toilé.'
    }
  },
  {
    id: 'seveso-jarrie',
    name: 'Plateforme Chimique de Jarrie',
    shortName: 'Chimie Jarrie',
    category: 'seveso',
    operator: 'Arkema / Framatome',
    department: '38 - Isère',
    commune: 'Jarrie',
    lat: 45.0975,
    lng: 5.7486,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Production de dérivés chlorés, eau oxygénée (H2O2) et métallurgie du zirconium pour l’industrie nucléaire.',
    keyHazards: ['Chlore gazeux', 'Peroxyde d’hydrogène concentré', 'Toxiques respiratoires'],
    officialDoctrine: {
      immediateReflex: "Confinement sans délai. Pas d’abri en sous-sol face aux gaz denses.",
      iodineRule: "Comprimés d'iode inutiles.",
      sirenType: 'Sirène PPI d’établissement.',
      shelterInstruction: 'Étage supérieur maçonné, ventilation scellée.'
    }
  },
  {
    id: 'seveso-roussillon',
    name: 'Plateforme Chimique de Roussillon',
    shortName: 'Chimie Roussillon',
    category: 'seveso',
    operator: 'GIE Osiris / Novapex / Adisseo',
    department: '38 - Isère',
    commune: 'Roussillon',
    lat: 45.3672,
    lng: 4.8028,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Pôle chimique majeur de la vallée du Rhône. Synthèse de phénol, acétone, méthionine et solvants chlorés.',
    keyHazards: ['Ammoniac anhydre', 'Phénol', 'Chlorure de méthyle', 'Incendie solvants'],
    officialDoctrine: {
      immediateReflex: "Confinement réflexe. Écoute de France Bleu Isère.",
      iodineRule: "Pas d'iode préventif pour ce site chimique.",
      sirenType: 'Sirène PPI Seveso.',
      shelterInstruction: 'Pièce centrale isolée, coupure de la chaudière.'
    }
  },
  {
    id: 'seveso-carling',
    name: 'Plateforme Chemesis de Carling / Saint-Avold',
    shortName: 'Plateforme Chemesis Carling',
    category: 'seveso',
    operator: 'TotalEnergies / Arkema / SNF',
    department: '57 - Moselle',
    commune: 'Carling / Saint-Avold',
    lat: 49.1628,
    lng: 6.7139,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Ancien bassin houiller reconverti en complexe pétrochimique et de chimie de spécialités (résines, polymères, monomères acryliques).',
    keyHazards: ['Acrylonitrile (toxique cyanuré)', 'Vapeurs d’ammoniac', 'Explosion d’hydrocarbures'],
    officialDoctrine: {
      immediateReflex: "Confinement immédiat, calfeutrage des conduits.",
      iodineRule: "Iode inefficace pour ce risque.",
      sirenType: 'Sirène PPI Seveso.',
      shelterInstruction: 'Bâtiment fermé hermétiquement.'
    }
  },
  {
    id: 'seveso-tavaux',
    name: 'Plateforme Chimique de Tavaux (Solvay / Inovyn)',
    shortName: 'Solvay Tavaux',
    category: 'seveso',
    operator: 'Inovyn / Solvay',
    department: '39 - Jura',
    commune: 'Tavaux',
    lat: 47.0450,
    lng: 5.4089,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Plaine jurassienne aux portes de Dole. Électrolyse chlore-soude, chlorure de vinyle et polymères fluorés.',
    keyHazards: ['Chlore gazeux liquéfié', 'Chlorure d’allyle', 'Acide chlorhydrique'],
    officialDoctrine: {
      immediateReflex: "Alerte chlore : monter aux étages, boucher toutes les fentes, calfeutrage.",
      iodineRule: "Zéro utilité de l'iode.",
      sirenType: 'Sirène PPI Seveso Tavaux.',
      shelterInstruction: 'Étage surélevé, pas de refuge en cave.'
    }
  },
  {
    id: 'seveso-balan',
    name: 'Usine Chimique Arkema de Balan',
    shortName: 'Arkema Balan',
    category: 'seveso',
    operator: 'Arkema',
    department: '01 - Ain',
    commune: 'Balan',
    lat: 45.8344,
    lng: 5.0978,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Plaine de l’Ain à 20 km au nord-est de Lyon. Synthèse et polymérisation de PVC à partir de chlorure de vinyle monomère (CVM).',
    keyHazards: ['Chlorure de vinyle monomère (CVM - inflammable et toxique)', 'Incendie majeur polymères'],
    officialDoctrine: {
      immediateReflex: "Confinement étanche, fermeture des aérateurs.",
      iodineRule: "Aucun iode requis.",
      sirenType: 'Sirène PPI d’établissement.',
      shelterInstruction: 'Habitation fermée, pièce centrale.'
    }
  },
  {
    id: 'seveso-toulouse',
    name: 'Pôle Industriel & Chimique du Bassin Toulousain',
    shortName: 'Pôle Chimique Toulouse',
    category: 'seveso',
    operator: 'TotalEnergies / SNPE / ArianeGroup',
    department: '31 - Haute-Garonne',
    commune: 'Toulouse',
    lat: 43.5600,
    lng: 1.4250,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Zone sud de Toulouse le long de la Garonne (héritage historique PPRT post-AZF, pyrotechnie et énergies aérospatiales).',
    keyHazards: ['Composés nitrés', 'Gaz sous pression', 'Substances pyrotechniques'],
    officialDoctrine: {
      immediateReflex: "S'abriter dans un bâtiment solide à l'écart des baies vitrées.",
      iodineRule: "Iode inopérant.",
      sirenType: 'Sirène RNA + FR-Alert.',
      shelterInstruction: 'Pièce aveugle maçonnée.'
    }
  },
  {
    id: 'seveso-bassens',
    name: 'Zone Industrielle Portuaire de Bassens (Bordeaux)',
    shortName: 'ZIP Bassens / Bordeaux',
    category: 'seveso',
    operator: 'Michelin / Dépôts Pétroliers / SPM',
    department: '33 - Gironde',
    commune: 'Bassens',
    lat: 44.9083,
    lng: -0.5283,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Rive droite de la Garonne dans l’agglomération bordelaise. Stockages massifs d’hydrocarbures, élastomères de synthèse et produits chimiques.',
    keyHazards: ['Incendie de dépôts de carburants', 'Vapeurs toxiques', 'Butadiène'],
    officialDoctrine: {
      immediateReflex: "Confinement réflexe immédiat, fermer portes et volets.",
      iodineRule: "Pas d'iode.",
      sirenType: 'Sirène PPI Seveso.',
      shelterInstruction: 'Côté opposé aux installations portuaires.'
    }
  },
  {
    id: 'seveso-chalampe',
    name: 'Plateforme Usine Alsachimie de Chalampé',
    shortName: 'Alsachimie Chalampé',
    category: 'seveso',
    operator: 'Alsachimie / Butachimie / BASF',
    department: '68 - Haut-Rhin',
    commune: 'Chalampé',
    lat: 47.8183,
    lng: 7.5458,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Bords du Grand Canal d’Alsace, frontière franco-allemande. Plus grande unité mondiale de production d’intermédiaires pour polyamides (Nylon 6.6).',
    keyHazards: ['Acide cyanhydrique (HCN - hautement toxique)', 'Ammoniac', 'Butadiène'],
    officialDoctrine: {
      immediateReflex: "Toxicité extrême des dérivés cyanurés : confinement ultra-rapide et calfeutrage hermétique des pièces d'habitation.",
      iodineRule: "L'iode stable ne protège en aucun cas contre l'acide cyanhydrique.",
      sirenType: 'Sirène PPI d’établissement transfrontalière.',
      shelterInstruction: 'Pièce la plus étanche de l’habitation, linges imbibés aux fentes.'
    }
  },
  {
    id: 'seveso-douchy',
    name: 'Pôle Logistique & Chimie Hainaut (Douchy-les-Mines)',
    shortName: 'Chimie Douchy-les-Mines',
    category: 'seveso',
    operator: 'Plateforme Seveso Hainaut',
    department: '59 - Nord',
    commune: 'Douchy-les-Mines',
    lat: 50.3017,
    lng: 3.3933,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Bassin minier du Nord entre Valenciennes et Cambrai. Stockage de produits chimiques industriels et gaz inflammables.',
    keyHazards: ['Incendie de stockage chimique', 'Fumées d’oxydes d’azote et soufre'],
    officialDoctrine: {
      immediateReflex: "Mise à l'abri, coupure des aérations mécaniques.",
      iodineRule: "Aucun iode.",
      sirenType: 'Sirène RNA.',
      shelterInstruction: 'Bâtiment maçonné, volets fermés.'
    }
  },
  {
    id: 'seveso-gennevilliers',
    name: 'Dépôts Pétroliers & Fluides de Gennevilliers',
    shortName: 'Dépôts Gennevilliers',
    category: 'seveso',
    operator: 'TotalEnergies / Dépôts Pétroliers d\'Île-de-France',
    department: '92 - Hauts-de-Seine',
    commune: 'Gennevilliers',
    lat: 48.9333,
    lng: 2.2958,
    ppiRadiusKm: 5,
    reflexZoneRadiusKm: 2,
    extendedVigilanceKm: 10,
    description: 'Premier port fluvial d’Île-de-France sur la boucle de la Seine aux portes de Paris. Stockage massif d’hydrocarbures raffinés et fluides sous pression.',
    keyHazards: ['Incendie de bacs pétroliers majeurs', 'Panache de fumées denses sur la métropole parisienne', 'Onde de surpression'],
    officialDoctrine: {
      immediateReflex: "S'éloigner des baies vitrées, s'abriter en dur, fermer toutes les ouvertures d'air.",
      iodineRule: "Inutilité totale de l'iode pour les dépôts pétroliers.",
      sirenType: 'Sirène RNA + FR-Alert Île-de-France.',
      shelterInstruction: 'Pièce aveugle ou côté opposé aux dépôts pétroliers du port.'
    }
  }
];

/**
 * Calcul géodésique précis (formule de Haversine)
 * Retourne la distance en kilomètres entre deux coordonnées géographiques
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Rayon moyen de la Terre en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export type OverallPpiStatus = 'in_reflex' | 'in_ppi' | 'in_vigilance' | 'outside';

export interface SiteProximityResult {
  site: IndustrialSite;
  distanceKm: number;
  isWithinReflex: boolean;
  isWithinPpi: boolean;
  isWithinVigilance: boolean;
}

export interface PerimeterDiagnostic {
  userLat: number;
  userLng: number;
  closestCnpe: SiteProximityResult;
  closestSeveso: SiteProximityResult;
  allSitesSorted: SiteProximityResult[];
  overallStatus: OverallPpiStatus;
  statusTitle: string;
  statusBadgeColor: string;
  statusBadgeTextColor: string;
  directiveSummary: string;
  iodineAdvice: string;
}

/**
 * Analyse complète et 100% hors-ligne du statut PPI pour n'importe quelle coordonnée géographique
 */
export function diagnoseUserPerimeters(
  userLat: number,
  userLng: number
): PerimeterDiagnostic {
  const results: SiteProximityResult[] = OFFLINE_INDUSTRIAL_SITES.map((site) => {
    const distanceKm = calculateHaversineDistanceKm(userLat, userLng, site.lat, site.lng);
    return {
      site,
      distanceKm,
      isWithinReflex: distanceKm <= site.reflexZoneRadiusKm,
      isWithinPpi: distanceKm <= site.ppiRadiusKm,
      isWithinVigilance: distanceKm <= site.extendedVigilanceKm
    };
  });

  results.sort((a, b) => a.distanceKm - b.distanceKm);

  const cnpeResults = results.filter((r) => r.site.category === 'cnpe');
  const sevesoResults = results.filter((r) => r.site.category === 'seveso');

  const closestCnpe = cnpeResults[0];
  const closestSeveso = sevesoResults[0];

  // Détermination du statut global
  let overallStatus: OverallPpiStatus = 'outside';
  let statusTitle = 'HORS PÉRIMÈTRE IMMÉDIAT';
  let statusBadgeColor = 'bg-[#eef4ff]';
  let statusBadgeTextColor = 'text-[#0036ce]';
  let directiveSummary = 'Vous êtes situé en dehors des zones de confinement réflexe immédiates (plus de 50 km d’un CNPE et plus de 10 km d’un site Seveso Seuil Haut majeur). Maintenez vos réflexes d’alerte générale.';
  let iodineAdvice = 'Aucun stockage préventif d’iode stable requis à votre domicile. En cas d’accident nucléaire national majeur, la distribution serait organisée par les préfets sur réquisition des stocks d’État.';

  const isReflex = closestCnpe.isWithinReflex || closestSeveso.isWithinReflex;
  const isPpi = closestCnpe.isWithinPpi || closestSeveso.isWithinPpi;
  const isVigilance = closestCnpe.isWithinVigilance || closestSeveso.isWithinVigilance;

  if (isReflex) {
    overallStatus = 'in_reflex';
    statusTitle = 'ZONE RÉFLEXE IMMÉDIATE (0-5 KM)';
    statusBadgeColor = 'bg-[#ba1a1a]';
    statusBadgeTextColor = 'text-white';
    directiveSummary = `ALERTE : Vous êtes à ${Math.min(closestCnpe.distanceKm, closestSeveso.distanceKm)} km d'un site à haut risque. En cas de sirène RNA, confinement réflexe sous 3 minutes sans attendre d'instruction téléphonique.`;
    iodineAdvice = closestCnpe.isWithinReflex
      ? `Vous DEVEZ détenir des comprimés d’iode de 65 mg pré-distribués. Ingestion STRICTEMENT subordonnée à l'ordre du Préfet.`
      : `Site Seveso chimique le plus proche : l'iode stable ne protège AUCUNEMENT contre les toxiques industriels.`;
  } else if (isPpi) {
    overallStatus = 'in_ppi';
    statusTitle = 'PÉRIMÈTRE DU PLAN PARTICULIER D’INTERVENTION (PPI)';
    statusBadgeColor = 'bg-[#6750a4]';
    statusBadgeTextColor = 'text-white';
    directiveSummary = `Vous résidez dans le périmètre officiel PPI (${closestCnpe.isWithinPpi ? `CNPE à ${closestCnpe.distanceKm} km` : `Seveso à ${closestSeveso.distanceKm} km`}). Vous êtes couvert par les plans de secours spécifiques et le système FR-Alert prioritaire.`;
    iodineAdvice = closestCnpe.isWithinPpi
      ? `Distribution préventive permanente en pharmacie (rayon 20 km). Comprimés à renouveler selon date de péremption. N’ingérer QUE sur ordre explicite préfectoral.`
      : `Risque chimique dominant : aucun comprimé d'iode utile. Seules les mesures de calfeutrage protègent contre les émanations toxiques.`;
  } else if (isVigilance) {
    overallStatus = 'in_vigilance';
    statusTitle = 'ZONE DE VIGILANCE ÉLARGIE';
    statusBadgeColor = 'bg-[#fef3c7]';
    statusBadgeTextColor = 'text-[#92400e]';
    directiveSummary = `Site le plus proche : ${results[0].site.shortName} à ${results[0].distanceKm} km. Vous êtes au-delà du PPI réflexe immédiat, mais dans la zone de retombées potentielles selon l'orientation des vents.`;
    iodineAdvice = closestCnpe.isWithinVigilance
      ? `Zone 20-50 km : Pas de dotation préventive individuelle obligatoire. Distribution différée par les autorités en cas de panache radioactif prolongé.`
      : `Hors zone de surpression directe. Vigilance sur les odeurs atmosphériques et coupure VMC si consigne officielle.`;
  }

  return {
    userLat,
    userLng,
    closestCnpe,
    closestSeveso,
    allSitesSorted: results,
    overallStatus,
    statusTitle,
    statusBadgeColor,
    statusBadgeTextColor,
    directiveSummary,
    iodineAdvice
  };
}
