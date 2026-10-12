export interface AppSettings {
  id: "main";
  householdSize: number;
  preparednessHours: number;
  preferredTheme: "system" | "light" | "dark";
  textScale: "normal" | "large" | "extraLarge";
  savedCommune?: {
    inseeCode?: string;
    name: string;
    postalCode?: string;
  };
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

export interface StorageRepository {
  getSettings(): Promise<AppSettings>;
  saveSettings(settings: AppSettings): Promise<void>;
  
  getInventoryItems(): Promise<InventoryItem[]>;
  saveInventoryItem(item: InventoryItem): Promise<void>;
  deleteInventoryItem(id: string): Promise<void>;

  getLocalRiskSnapshot(communeName: string): Promise<LocalRiskSnapshot | null>;
  saveLocalRiskSnapshot(snapshot: LocalRiskSnapshot): Promise<void>;

  getQuizProgress(quizId: string): Promise<QuizProgress | null>;
  saveQuizProgress(progress: QuizProgress): Promise<void>;

  exportAllData(): Promise<Record<string, any>>;
  importAllData(data: Record<string, any>): Promise<{ success: boolean; error?: string }>;
  clearAllData(): Promise<void>;
}
