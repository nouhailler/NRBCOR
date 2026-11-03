import { KitCategory } from '../../data/kitData';
import { KitItem } from '../../types';

export const KIT_CATEGORIES_EN: KitCategory[] = [
  { id: 1, name: '1. Water & Hydration', badge: 'Vital', badgeColor: 'bg-error-container text-on-error-container', icon: 'water_drop' },
  { id: 2, name: '2. Emergency Survival Rations', badge: '72H Min', badgeColor: 'bg-surface-container-high text-on-surface-variant', icon: 'restaurant' },
  { id: 3, name: '3. Energy & Off-Grid Comms', badge: 'CBRN Alert', badgeColor: 'bg-surface-container text-primary', icon: 'cell_tower' },
  { id: 4, name: '4. Health & First Aid', badge: 'Medical', badgeColor: 'bg-surface-container-high text-on-surface-variant', icon: 'medical_services' },
  { id: 5, name: '5. CBRN & Sheltering Specifics', badge: 'NRBCOR Core', badgeColor: 'bg-secondary-fixed text-on-secondary-fixed-variant', icon: 'security' },
  { id: 6, name: '6. Vital Documents & Hygiene', badge: 'Resilience', badgeColor: 'bg-surface-container-high text-on-surface-variant', icon: 'folder_shared' },
];

export const INITIAL_KIT_ITEMS_EN: KitItem[] = [
  // 1. Water
  {
    id: 'k1',
    category: 1,
    title: 'Factory-sealed bottled mineral water',
    subtitle: 'Status: Household-sized reserve (3L/person/day for 72h). Stored in sealed packs away from heat and light.',
    tag: 'Calculated',
    completed: false,
    isEssential: true
  },
  {
    id: 'k2',
    category: 1,
    title: 'Water purification tablets (Micropur / Katadyn)',
    subtitle: 'Hermetically sealed. Emergency chemical disinfection for collected water (1 tablet per 1 liter).',
    tag: '1 Box',
    completed: true,
    isEssential: true
  },

  // 2. Food
  {
    id: 'k3',
    category: 2,
    title: 'Ready-to-eat no-cook food (Canned & energy bars)',
    subtitle: 'Easy-open cans, protein/cereal bars, dried fruits, nut butters, and compotes requiring zero cooking or water.',
    tag: '72h Rations',
    completed: true,
    isEssential: true
  },
  {
    id: 'k4',
    category: 2,
    title: 'Mechanical manual can opener & field cutlery',
    subtitle: 'Zero-power manual can opener, durable multipurpose camping knife, and eating utensils.',
    tag: '3-Piece Set',
    completed: true
  },

  // 3. Energy & Off-Grid Comms
  {
    id: 'k5',
    category: 3,
    title: 'Hand-crank or battery-powered AM/FM radio receiver',
    subtitle: 'Mandatory primary channel during cellular blackout to receive official prefectural and emergency broadcasts.',
    tag: 'Mandatory',
    completed: true,
    isEssential: true
  },
  {
    id: 'k6',
    category: 3,
    title: 'Spare alkaline batteries (AA / AAA sizes)',
    subtitle: 'Fresh pack of 8 alkaline batteries preserved in original waterproof sealed pouch.',
    tag: 'Missing',
    completed: false,
    isEssential: true
  },
  {
    id: 'k7',
    category: 3,
    title: 'Waterproof LED flashlight or headlamp',
    subtitle: 'IPX6 rating minimum. Hands-free headlamp or low-consumption beam with spare torch.',
    tag: 'Ready',
    completed: true
  },
  {
    id: 'k8',
    category: 3,
    title: 'Heavy-duty power bank (20,000 mAh capacity)',
    subtitle: 'Full charge verified on the 1st of every month. Braided multi-connector USB cables included.',
    tag: '100%',
    completed: true
  },

  // 4. Health & First Aid
  {
    id: 'k9',
    category: 4,
    title: 'DIN 13164 certified first aid trauma kit',
    subtitle: 'Sterile compresses, pressure bandages, chlorhexidine antiseptic, trauma shears, tourniquet.',
    tag: 'Complete',
    completed: true,
    isEssential: true
  },
  {
    id: 'k10',
    category: 4,
    title: 'Chronic personal medications (7 to 14 days supply)',
    subtitle: 'Updated paper prescriptions included inside a waterproof, labeled ziplock pouch.',
    tag: 'Updated',
    completed: true,
    isEssential: true
  },
  {
    id: 'k11',
    category: 4,
    title: 'Isothermal foil emergency survival blankets',
    subtitle: 'Heavy-duty double-sided (gold/silver) thermal blankets (1 per household member).',
    tag: '3 Units',
    completed: true
  },

  // 5. CBRN & Sheltering Specifics
  {
    id: 'k12',
    category: 5,
    title: 'Heavy-duty cloth duct tape (50mm width)',
    subtitle: 'Mandatory for airtight sealing of vents, windows, door frames, and air intake registers.',
    tag: '2 Rolls',
    completed: true,
    isEssential: true
  },
  {
    id: 'k13',
    category: 5,
    title: 'Heavy-duty pre-cut polyethylene sheeting (tarp)',
    subtitle: 'Emergency shelter airlock creation and covering shattered window openings.',
    tag: '20 m²',
    completed: true
  },
  {
    id: 'k14',
    category: 5,
    title: 'Heavy-duty 100L waterproof plastic waste bags',
    subtitle: 'Mandatory for double-bagging and hermetically sealing contaminated outerwear and shoes.',
    tag: 'Missing',
    completed: false,
    isEssential: true
  },
  {
    id: 'k15',
    category: 5,
    title: 'Unvalved FFP3 particle filtration respirators',
    subtitle: 'Blocks radioactive fallout dust and infectious aerosols. Ineffective against chemical vapours/gases.',
    tag: '6 Masks',
    completed: true,
    isEssential: true
  },

  // 6. Vital Documents & Hygiene
  {
    id: 'k16',
    category: 6,
    title: 'Waterproof pouch with duplicate identity documents',
    subtitle: 'Certified paper copies of IDs, passports, family record book, vaccination booklet, and insurance.',
    tag: 'Pouch',
    completed: true,
    isEssential: true
  },
  {
    id: 'k17',
    category: 6,
    title: 'Emergency cash in small denomination bills',
    subtitle: 'Small banknotes (€5, €10, €20). ATMs and electronic payment terminals fail during blackouts.',
    tag: 'Missing',
    completed: false
  },
  {
    id: 'k18',
    category: 6,
    title: 'Hydroalcoholic gel & thick body hygiene wet wipes',
    subtitle: 'Personal sanitation without consuming drinking water reserves in a contaminated shelter.',
    tag: 'Ready',
    completed: true
  }
];
