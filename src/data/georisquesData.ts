import { RiskItem } from '../types';

export interface CommuneInfo {
  name: string;
  postalCode: string;
  insee: string;
  lat: number;
  lng: number;
}

export const CURRENT_COMMUNE: CommuneInfo = {
  name: 'Lyon 3e Arrondissement',
  postalCode: '69003',
  insee: '69383',
  lat: 45.7602,
  lng: 4.8357
};

export const AVAILABLE_COMMUNES: CommuneInfo[] = [
  { name: 'Lyon 3e Arrondissement', postalCode: '69003', insee: '69383', lat: 45.7602, lng: 4.8357 },
  { name: 'Feyzin (Couloir de la Chimie)', postalCode: '69320', insee: '69085', lat: 45.6706, lng: 4.8583 },
  { name: 'Saint-Vulbas (Centrale Bugey)', postalCode: '01150', insee: '01390', lat: 45.8322, lng: 5.2917 },
  { name: 'Paris 1er Arrondissement', postalCode: '75001', insee: '75101', lat: 48.8606, lng: 2.3376 },
  { name: 'Marseille 2e Arrondissement', postalCode: '13002', insee: '13202', lat: 43.3039, lng: 5.3678 },
  { name: 'Toulouse Centre', postalCode: '31000', insee: '31555', lat: 43.6047, lng: 1.4442 }
];

export const GEORISQUES_ITEMS: RiskItem[] = [
  {
    id: 'r1',
    category: 'RISQUE CHIMIQUE & INDUSTRIEL',
    title: 'Couloir de la Chimie',
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
    title: 'Centrale Nucléaire du Bugey',
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
