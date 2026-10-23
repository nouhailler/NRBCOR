export type TabType = 'accueil' | 'reagir' | 'guides' | 'preparation' | 'mon-plan';

export type SubScreen = 
  | null
  | { type: 'protocol'; id: 'bio' | 'chimique' | 'nucleaire' | 'confinement' | 'radiologique' }
  | { type: 'georisques' }
  | { type: 'formation' }
  | { type: 'tracabilite' }
  | { type: 'deshabillage' }
  | { type: 'iode' }
  | { type: 'confinement-guide' }
  | { type: 'siren-guide' }
  | { type: 'animaux' }
  | { type: 'cyber-hybride' }
  | { type: 'carte-perimetres' }
  | { type: 'mode-crise' }
  | { type: 'inventory' }
  | { type: 'settings' }
  | { type: 'system-settings' }
  | { type: 'suis-je-pret' };

export type ProfileMode = 'simplified' | 'expert';

export interface EmergencyCall {
  number: string;
  name: string;
  subtitle: string;
  desc: string;
  badge?: string;
  color?: string;
}

export interface KitItem {
  id: string;
  title: string;
  subtitle: string;
  category: number;
  completed: boolean;
  tag: string;
  isEssential?: boolean;
}

export interface HouseholdConfig {
  peopleCount: number;
  durationDays: number;
}

export interface SpecificNeedsConfig {
  adultsCount: number;
  childrenCount: number;
  infantsCount: number;
  elderlyCount: number;
  hasPmr: boolean;
  hasChronicCondition: boolean;
  petsCount: number;
  isNearSevesoOrNpp: boolean;
  targetDurationDays: number; // 2 (48h), 3 (72h), 7 (7j)
}

export interface ScoreDetailItem {
  label: string;
  earned: number;
  max: number;
  comment: string;
}

export interface ScorePillar {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  icon: string;
  status: 'optimal' | 'warning' | 'critical';
  formulaExplanation: string;
  details: ScoreDetailItem[];
}

export interface ReadinessScoreResult {
  totalScore: number;
  level: {
    number: number;
    title: string;
    badge: string;
    color: string;
    description: string;
  };
  pillars: ScorePillar[];
  disclaimer: string;
}

export interface FamilyMember {
  id: string;
  role: string;
  details: string;
  icon: string;
}

export interface AssemblyPoint {
  type: string;
  radius: string;
  name: string;
  desc: string;
  coords: string;
  color: string;
}

export interface ContactPerson {
  id: string;
  name: string;
  role: string;
  phone: string;
  dist: string;
  icon: string;
  isOutZone?: boolean;
}

export interface RiskItem {
  id: string;
  category: string;
  title: string;
  tag: string;
  tagColor: string;
  distance: string;
  desc: string;
  measureTitle: string;
  measureDesc: string;
  protocolKey?: 'bio' | 'chimique' | 'nucleaire' | 'confinement';
  protocolLabel: string;
}
