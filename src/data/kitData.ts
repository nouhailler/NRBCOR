import { KitItem } from '../types';

export interface KitCategory {
  id: number;
  name: string;
  badge: string;
  badgeColor: string;
  icon: string;
}

export const KIT_CATEGORIES: KitCategory[] = [
  { id: 1, name: '1. Eau & Hydratation', badge: 'Indispensable', badgeColor: 'bg-error-container text-on-error-container', icon: 'water_drop' },
  { id: 2, name: '2. Alimentation de Survie', badge: '72H Min', badgeColor: 'bg-surface-container-high text-on-surface-variant', icon: 'restaurant' },
  { id: 3, name: '3. Énergie & Communication', badge: 'Alerte RBN', badgeColor: 'bg-surface-container text-primary', icon: 'cell_tower' },
  { id: 4, name: '4. Santé & Premiers Soins', badge: 'Médical', badgeColor: 'bg-surface-container-high text-on-surface-variant', icon: 'medical_services' },
  { id: 5, name: '5. Spécifique NRBC & Confinement', badge: 'Spécifique NRBCOR', badgeColor: 'bg-secondary-fixed text-on-secondary-fixed-variant', icon: 'security' },
  { id: 6, name: '6. Documents & Hygiène', badge: 'Résilience', badgeColor: 'bg-surface-container-high text-on-surface-variant', icon: 'folder_shared' },
];

export const INITIAL_KIT_ITEMS: KitItem[] = [
  // 1. Eau
  {
    id: 'k1',
    category: 1,
    title: 'Eau minérale scellée en bouteilles',
    subtitle: 'Statut : Réserve calculée selon la taille du foyer. Rations en packs hermétiques.',
    tag: 'Calculée',
    completed: false,
    isEssential: true
  },
  {
    id: 'k2',
    category: 1,
    title: "Pastilles de purification d'eau (Micropur)",
    subtitle: "Scellée. Traitement d'urgence pour eau de captage (1 comprimé / 1 Litre).",
    tag: '1 Boîte',
    completed: true,
    isEssential: true
  },

  // 2. Alimentation
  {
    id: 'k3',
    category: 2,
    title: 'Aliments sans cuisson (Conserves & barres)',
    subtitle: 'Conserves à ouverture facile, barres de céréales, compotes, fruits oléagineux.',
    tag: 'Rations',
    completed: true,
    isEssential: true
  },
  {
    id: 'k4',
    category: 2,
    title: 'Ouvre-boîtes mécanique & couverts',
    subtitle: 'Ouvre-boîtes manuel sans assistance électrique, couteau polyvalent pliable.',
    tag: 'Kit 3p',
    completed: true
  },

  // 3. Énergie & Communication
  {
    id: 'k5',
    category: 3,
    title: 'Radio FM à manivelle ou à piles',
    subtitle: 'Canal prioritaire officiel en cas de saturation GSM (France Bleu / Préfecture).',
    tag: 'Obligatoire',
    completed: true,
    isEssential: true
  },
  {
    id: 'k6',
    category: 3,
    title: 'Piles de rechange adaptées (AA / AAA)',
    subtitle: "Lot de 8 piles alcalines neuves sous emballage étanche d'origine.",
    tag: 'Manquant',
    completed: false,
    isEssential: true
  },
  {
    id: 'k7',
    category: 3,
    title: 'Lampe torche LED étanche ou frontale',
    subtitle: 'IPX6 minimum. Éclairage directionnel faible consommation.',
    tag: 'Prêt',
    completed: true
  },
  {
    id: 'k8',
    category: 3,
    title: 'Batterie externe (Powerbank 20 000 mAh)',
    subtitle: 'Charge complète vérifiée le 01 du mois. Câbles USB renforcés inclus.',
    tag: '100%',
    completed: true
  },

  // 4. Santé & Premiers Soins
  {
    id: 'k9',
    category: 4,
    title: 'Trousse de secours normée DIN 13164',
    subtitle: 'Pansements, compresses stériles, antiseptique chlorhexidine, ciseaux jesco.',
    tag: 'Complet',
    completed: true,
    isEssential: true
  },
  {
    id: 'k10',
    category: 4,
    title: 'Traitements médicaux chroniques (7 à 14j)',
    subtitle: 'Ordonnances papier récentes jointes sous sachet étanche étiqueté.',
    tag: 'À jour',
    completed: true,
    isEssential: true
  },
  {
    id: 'k11',
    category: 4,
    title: 'Couvertures de survie isothermiques',
    subtitle: '1 couverture double face (or/argent) par membre du foyer.',
    tag: '3 Unités',
    completed: true
  },

  // 5. Spécifique NRBC & Confinement
  {
    id: 'k12',
    category: 5,
    title: 'Ruban adhésif toilé épais (Duct Tape 50mm)',
    subtitle: "Obligatoire pour calfeutrage hermétique des bouches d'aération et fenêtres.",
    tag: '2 Rouleaux',
    completed: true,
    isEssential: true
  },
  {
    id: 'k13',
    category: 5,
    title: 'Bâches polyéthylène épaisses prédécoupées',
    subtitle: "Sas de confinement d'urgence et occultation d'ouvertures brisées.",
    tag: '20 m²',
    completed: true
  },
  {
    id: 'k14',
    category: 5,
    title: 'Sacs poubelles étanches 100L haute résistance',
    subtitle: 'Destiné au double ensachage étanche des vêtements potentiellement contaminés.',
    tag: 'Manquant',
    completed: false,
    isEssential: true
  },
  {
    id: 'k15',
    category: 5,
    title: 'Masques de protection FFP3 non-soupapés',
    subtitle: 'Arrêt des poussières et retombées radioactives. Inefficace contre les gaz toxiques purs.',
    tag: '6 Masques',
    completed: true,
    isEssential: true
  },

  // 6. Documents & Hygiène
  {
    id: 'k16',
    category: 6,
    title: "Copies scellées des documents d'identité",
    subtitle: 'CNI, passeport, livret de famille, carnet vaccinal sous pochette zippée étanche.',
    tag: 'Pochette',
    completed: true,
    isEssential: true
  },
  {
    id: 'k17',
    category: 6,
    title: 'Argent liquide en petites coupures',
    subtitle: 'Billets de 5€, 10€ et 20€ (DAB et terminaux CB inopérants en blackout).',
    tag: 'Manquant',
    completed: false
  },
  {
    id: 'k18',
    category: 6,
    title: 'Gel hydroalcoolique & lingettes épaisses',
    subtitle: "Hygiène corporelle d'urgence sans consommation de l'eau potable stockée.",
    tag: 'Prêt',
    completed: true
  }
];
