export type TabType = 'accueil' | 'reagir' | 'guides' | 'preparation' | 'mon-plan';

export type SubScreen = 
  | null
  | { type: 'protocol'; id: 'bio' | 'chimique' | 'nucleaire' | 'confinement' }
  | { type: 'georisques' }
  | { type: 'formation' }
  | { type: 'tracabilite' }
  | { type: 'deshabillage' }
  | { type: 'iode' }
  | { type: 'confinement-guide' }
  | { type: 'siren-guide' }
  | { type: 'inventory' }
  | { type: 'settings' };

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
