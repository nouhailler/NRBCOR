import { RiskItem } from '../types';

export interface CommuneInfo {
  name: string;
  postalCode: string;
  insee: string;
  lat: number;
  lng: number;
  departement?: string;
  description?: string;
}

export const CURRENT_COMMUNE: CommuneInfo = {
  name: 'Lyon 3e Arrondissement',
  postalCode: '69003',
  insee: '69383',
  lat: 45.7602,
  lng: 4.8357,
  departement: '69',
  description: 'Pôle métropolitain dense, proximité du couloir de la chimie Sud et faisceaux ferroviaires TMD.'
};

export const AVAILABLE_COMMUNES: CommuneInfo[] = [
  {
    name: 'Lyon 3e Arrondissement',
    postalCode: '69003',
    insee: '69383',
    lat: 45.7602,
    lng: 4.8357,
    departement: '69',
    description: 'Proximité du couloir de la chimie (Sud) et axe TMD Lyon Part-Dieu.'
  },
  {
    name: 'Feyzin (Couloir de la Chimie)',
    postalCode: '69320',
    insee: '69085',
    lat: 45.6706,
    lng: 4.8583,
    departement: '69',
    description: 'Raffinerie et plateformes pétrochimiques majeures (Seveso Seuil Haut, PPRT).'
  },
  {
    name: 'Saint-Vulbas (Centrale Bugey)',
    postalCode: '01150',
    insee: '01390',
    lat: 45.8322,
    lng: 5.2917,
    departement: '01',
    description: 'Centrale nucléaire de production d’électricité (CNPE Bugey - Périmètre PPI 20km).'
  },
  {
    name: 'Rouen (Bassin Industriel Seine)',
    postalCode: '76000',
    insee: '76540',
    lat: 49.4432,
    lng: 1.0999,
    departement: '76',
    description: 'Sites chimiques Seveso Seuil Haut (zone Lubrizol/Normandie Logistique, TMD fluvial).'
  },
  {
    name: 'Dunkerque (Pôle Énergie & Mer)',
    postalCode: '59140',
    insee: '59183',
    lat: 51.0343,
    lng: 2.3768,
    departement: '59',
    description: 'Complexe sidérurgique, terminal méthanier, Seveso et proximité CNPE Gravelines.'
  },
  {
    name: 'Fos-sur-Mer (Bassin Industriel Sud)',
    postalCode: '13270',
    insee: '13039',
    lat: 43.4375,
    lng: 4.9458,
    departement: '13',
    description: 'Zone industrialo-portuaire dense, raffineries, chimie lourde et stockage de gaz.'
  },
  {
    name: 'Paris 1er Arrondissement',
    postalCode: '75001',
    insee: '75101',
    lat: 48.8606,
    lng: 2.3376,
    departement: '75',
    description: 'Centre urbain dense, nœuds de transport multimodaux et flux souterrains d’énergie.'
  },
  {
    name: 'Marseille 2e Arrondissement',
    postalCode: '13002',
    insee: '13202',
    lat: 43.3039,
    lng: 5.3678,
    departement: '13',
    description: 'Zone portuaire, flux TMD maritimes et installations logistiques régionales.'
  },
  {
    name: 'Toulouse Centre',
    postalCode: '31000',
    insee: '31555',
    lat: 43.6047,
    lng: 1.4442,
    departement: '31',
    description: 'Pôle aérospatial et technologique, historique PPRT bassin chimique.'
  }
];

/**
 * Calcul géodésique hors-ligne (Haversine) pour associer une coordonnée GPS à la commune de référence la plus proche
 */
export function findClosestCommune(lat: number, lng: number, list: CommuneInfo[] = AVAILABLE_COMMUNES): {
  commune: CommuneInfo;
  distanceKm: number;
} {
  let closest = list[0];
  let minDistance = Infinity;

  const R = 6371; // Rayon de la Terre en km
  for (const c of list) {
    const dLat = (c.lat - lat) * (Math.PI / 180);
    const dLng = (c.lng - lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * (Math.PI / 180)) * Math.cos(c.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const d = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    if (d < minDistance) {
      minDistance = d;
      closest = c;
    }
  }

  return { commune: closest, distanceKm: Math.round(minDistance * 10) / 10 };
}

export const GEORISQUES_ITEMS: RiskItem[] = [
  {
    id: 'r1',
    category: 'RISQUE CHIMIQUE & INDUSTRIEL',
    title: 'Couloir de la Chimie (Sites Seveso)',
    tag: 'SEVESO SEUIL HAUT',
    tagColor: 'bg-error-container text-on-error-container',
    distance: 'Périmètre de vigilance à 4,2 km (Sud-Ouest)',
    desc: 'Usines de synthèse chimique de base et plateformes de stockage de chlore et ammoniac. Plan de Prévention des Risques Technologiques (PPRT) formellement approuvé.',
    measureTitle: 'Mesures de sauvegarde associées',
    measureDesc: "Périmètre PPI en vigueur. Signal d'alerte par le Réseau National d'Alerte (RNA) : sirène montante/descendante de 1 min 41s répétée 3 fois.",
    protocolKey: 'chimique',
    protocolLabel: 'Guide Réflexe'
  },
  {
    id: 'r2',
    category: 'TRANSPORT DE MATIÈRES DANGEREUSES (TMD)',
    title: 'Faisceau Part-Dieu / Guillotière & Axe M7',
    tag: 'AXE CRITIQUE',
    tagColor: 'bg-surface-container-high text-primary',
    distance: 'Traversée directe de la commune (< 800 m)',
    desc: 'Transit ferroviaire cadencé de wagons-citernes et transport routier de composés toxiques volatils, gaz inflammables et produits corrosifs.',
    measureTitle: 'Consigne locale immédiate',
    measureDesc: "En cas d'accident de transport : Ne pas s'approcher du panache. S'abriter sans délai dans un bâtiment en dur, perpendiculairement à l'axe du vent.",
    protocolKey: 'confinement',
    protocolLabel: 'Confinement'
  },
  {
    id: 'r3',
    category: 'RISQUE NUCLÉAIRE & RADIOLOGIQUE DIFFÉRÉ',
    title: 'Centrale Nucléaire du Bugey (CNPE)',
    tag: 'RAYON 30-40 KM',
    tagColor: 'bg-surface-container-high text-primary',
    distance: 'Hors rayon PPI immédiat (20 km) • Vigilance élargie',
    desc: "Commune située au-delà de la zone de distribution préventive systématique des comprimés d'iode stable. Stockage d'iode pris en charge par les réserves d'État en cas d'accident majeur.",
    measureTitle: 'Règle sanitaire formelle',
    measureDesc: "Ne pas ingérer de comprimés d'iode sans ordre explicite de l'autorité préfectorale. Une prise inopinée est inutile et peut s'avérer toxique.",
    protocolKey: 'nucleaire',
    protocolLabel: 'Fiche Iode'
  }
];
