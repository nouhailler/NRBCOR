import { KitItem, FamilyMember, ContactPerson, SpecificNeedsConfig, AssemblyPoint } from '../../types';
import { PlanTask } from '../../data/familyPlanData';

export interface AppSettings {
  id: 'main';
  householdSize: number;
  preparednessHours: number;
  preferredTheme: 'system' | 'light' | 'dark';
  textScale: 'normal' | 'large' | 'extraLarge';
  savedCommune?: {
    inseeCode?: string;
    name: string;
    postalCode?: string;
  };
  specificNeeds?: SpecificNeedsConfig;
  profileMode?: 'simplified' | 'expert';
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  lastCheckedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyPlanData {
  tasks: PlanTask[];
  members: FamilyMember[];
  outZoneContact?: ContactPerson | null;
  localContacts: ContactPerson[];
  assemblyPoints?: AssemblyPoint[];
  updatedAt?: string;
}

export interface LocalRiskSnapshot {
  id: string;
  communeName: string;
  inseeCode?: string;
  retrievedAt: string;
  sourceId: string;
  sourceUrl: string;
  dataVersion?: string;
  summary: string;
  items: {
    id: string;
    title: string;
    category: string;
    description?: string;
    officialUrl?: string;
  }[];
  staleAfter: string;
}

export interface QuizProgress {
  quizId: string;
  completedQuestionIds: string[];
  correctAnswers: number;
  totalAnswered: number;
  updatedAt: string;
}

export interface StorageDiagnostics {
  isIndexedDbSupported: boolean;
  activeEngine: 'IndexedDB (Prioritaire)' | 'localStorage (Secours)';
  stores: {
    name: string;
    label: string;
    itemCount: number;
    status: 'ok' | 'empty' | 'warning';
  }[];
  lastExportedBackupDate?: string;
  lastSyncDate: string;
  quotaEstimate?: {
    usageBytes: number;
    quotaBytes: number;
    percentage: number;
  };
}

export interface StorageRepository {
  // Settings & Theme
  getSettings(): Promise<AppSettings>;
  saveSettings(settings: AppSettings): Promise<void>;
  
  // Kit d'urgence 72h
  getKitItems(): Promise<KitItem[]>;
  saveKitItems(items: KitItem[]): Promise<void>;

  // Plan Familial de Mise en Sûreté (PFMS)
  getFamilyPlan(): Promise<FamilyPlanData>;
  saveFamilyPlan(plan: FamilyPlanData): Promise<void>;

  // Inventaire physique des vivres & matériel
  getInventoryItems(): Promise<InventoryItem[]>;
  saveInventoryItem(item: InventoryItem): Promise<void>;
  deleteInventoryItem(id: string): Promise<void>;

  // Géorisques snapshots
  getLocalRiskSnapshot(communeName: string): Promise<LocalRiskSnapshot | null>;
  saveLocalRiskSnapshot(snapshot: LocalRiskSnapshot): Promise<void>;

  // Quiz & Formation
  getQuizProgress(quizId: string): Promise<QuizProgress | null>;
  saveQuizProgress(progress: QuizProgress): Promise<void>;

  // Diagnostic d'intégrité & Santé du stockage
  getDiagnostics(): Promise<StorageDiagnostics>;
  testStorageHealth(): Promise<{ indexedDbOk: boolean; localStorageOk: boolean; quotaUsagePercent?: number; isPrivateMode: boolean }>;

  // Migration & Synchronisation transparente
  migrateLegacyData(): Promise<{ migratedCount: number; errors: string[] }>;
  getInitialTheme(): 'light' | 'dark' | 'system';
  getInitialKitItems(): KitItem[];

  // Sauvegarde & Restauration unifiée
  exportAllData(): Promise<Record<string, any>>;
  importAllData(data: Record<string, any>): Promise<{ success: boolean; error?: string }>;
  clearAllData(): Promise<void>;
  resetToCleanState(): Promise<void>;
  resetToDemoState(): Promise<void>;
}
