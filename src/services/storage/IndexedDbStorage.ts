import {
  AppSettings,
  InventoryItem,
  LocalRiskSnapshot,
  QuizProgress,
  FamilyPlanData,
  StorageDiagnostics,
  StorageRepository
} from './StorageRepository';
import { KitItem, SpecificNeedsConfig } from '../../types';
import { INITIAL_KIT_ITEMS } from '../../data/kitData';
import {
  INITIAL_MEMBERS,
  OUT_OF_ZONE_CONTACT,
  LOCAL_CONTACTS,
  INITIAL_PLAN_TASKS,
  INITIAL_ASSEMBLY_POINTS
} from '../../data/familyPlanData';

const DB_NAME = 'nrbc-preparation-db';
const DB_VERSION = 2;

export const DEFAULT_SPECIFIC_NEEDS: SpecificNeedsConfig = {
  adultsCount: 2,
  childrenCount: 1,
  infantsCount: 0,
  elderlyCount: 0,
  hasPmr: false,
  hasChronicCondition: false,
  petsCount: 1,
  isNearSevesoOrNpp: false,
  targetDurationDays: 3,
};

export const CLEAN_SPECIFIC_NEEDS: SpecificNeedsConfig = {
  adultsCount: 1,
  childrenCount: 0,
  infantsCount: 0,
  elderlyCount: 0,
  hasPmr: false,
  hasChronicCondition: false,
  petsCount: 0,
  isNearSevesoOrNpp: false,
  targetDurationDays: 3,
};

export const DEFAULT_SETTINGS: AppSettings = {
  id: 'main',
  householdSize: 3,
  preparednessHours: 72,
  preferredTheme: 'light',
  textScale: 'normal',
  savedCommune: {
    name: 'Lyon 3e Arrondissement',
    postalCode: '69003',
    inseeCode: '69383'
  },
  specificNeeds: DEFAULT_SPECIFIC_NEEDS,
  profileMode: 'simplified',
  onboardingCompleted: false,
  createdAt: '2026-10-12T00:00:00.000Z',
  updatedAt: '2026-10-14T08:00:00.000Z'
};

export const CLEAN_SETTINGS: AppSettings = {
  id: 'main',
  householdSize: 1,
  preparednessHours: 72,
  preferredTheme: 'light',
  textScale: 'normal',
  savedCommune: undefined,
  specificNeeds: CLEAN_SPECIFIC_NEEDS,
  profileMode: 'simplified',
  onboardingCompleted: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    name: "Packs d'eau minérale plate (6x1.5L)",
    category: 'Eau & Hydratation',
    quantity: 3,
    unit: 'packs (27L)',
    expiryDate: '2028-06-30',
    lastCheckedAt: '2026-10-01',
    notes: "Stocké à l'abri de la lumière dans le cellier.",
    createdAt: '2026-10-12T00:00:00Z',
    updatedAt: '2026-10-12T00:00:00Z'
  },
  {
    id: 'inv-2',
    name: 'Conserves de légumes et féculents variés',
    category: 'Alimentation de Survie',
    quantity: 18,
    unit: 'boîtes',
    expiryDate: '2027-11-15',
    lastCheckedAt: '2026-10-01',
    notes: 'Plats cuisinés consommables froids sans cuisson obligatoire.',
    createdAt: '2026-10-12T00:00:00Z',
    updatedAt: '2026-10-12T00:00:00Z'
  },
  {
    id: 'inv-3',
    name: "Comprimés de purification d'eau (Micropur Forte)",
    category: 'Eau & Hydratation',
    quantity: 1,
    unit: 'boîte (100 comp.)',
    expiryDate: '2029-01-01',
    lastCheckedAt: '2026-10-04',
    notes: "1 comprimé par litre d'eau claire. Laisser agir 30 min (bactéries) à 2h (kystes/amibes).",
    createdAt: '2026-10-12T00:00:00Z',
    updatedAt: '2026-10-12T00:00:00Z'
  },
  {
    id: 'inv-4',
    name: 'Masques de protection respiratoire FFP3',
    category: 'Protection NRBC',
    quantity: 10,
    unit: 'masques ensachés',
    expiryDate: '2029-12-31',
    lastCheckedAt: '2026-09-15',
    notes: 'Attention : filtration particules et poussières radioactives/biologiques UNIQUEMENT. Ne protège pas contre gaz chimiques purs.',
    createdAt: '2026-10-12T00:00:00Z',
    updatedAt: '2026-10-12T00:00:00Z'
  },
  {
    id: 'inv-5',
    name: 'Piles alcalines AA et D longue durée',
    category: 'Lumière & Énergie',
    quantity: 16,
    unit: 'piles',
    expiryDate: '2032-12-31',
    lastCheckedAt: '2026-10-01',
    notes: "Pour radio d'urgence et lampes torches.",
    createdAt: '2026-10-12T00:00:00Z',
    updatedAt: '2026-10-12T00:00:00Z'
  },
  {
    id: 'inv-6',
    name: 'Flacon de solution antiseptique (Chlorhexidine)',
    category: 'Premiers Soins & Pharmacie',
    quantity: 2,
    unit: 'flacons 250ml',
    expiryDate: '2026-11-01',
    lastCheckedAt: '2026-08-20',
    notes: 'Date de péremption proche : à renouveler lors du prochain passage en pharmacie.',
    createdAt: '2026-10-12T00:00:00Z',
    updatedAt: '2026-10-12T00:00:00Z'
  },
  {
    id: 'inv-7',
    name: 'Gros ruban adhésif toilé blindé (Duck tape 50m)',
    category: 'Confinement & Calfeutrage',
    quantity: 2,
    unit: 'rouleaux',
    expiryDate: undefined,
    lastCheckedAt: '2026-10-04',
    notes: 'Pour le calfeutrage hermétique immédiat des bas de portes et aérations de la pièce aveugle.',
    createdAt: '2026-10-12T00:00:00Z',
    updatedAt: '2026-10-12T00:00:00Z'
  }
];

export const INITIAL_FAMILY_PLAN: FamilyPlanData = {
  tasks: INITIAL_PLAN_TASKS,
  members: INITIAL_MEMBERS,
  outZoneContact: OUT_OF_ZONE_CONTACT,
  localContacts: LOCAL_CONTACTS,
  assemblyPoints: INITIAL_ASSEMBLY_POINTS,
  updatedAt: '2026-10-14T08:00:00.000Z'
};

export const CLEAN_FAMILY_PLAN: FamilyPlanData = {
  tasks: INITIAL_PLAN_TASKS.map((t) => ({ ...t, done: false })),
  members: [],
  outZoneContact: null,
  localContacts: [],
  assemblyPoints: [],
  updatedAt: new Date().toISOString()
};

class IndexedDbStorageService implements StorageRepository {
  private dbPromise: Promise<IDBDatabase | null> | null = null;

  private async getDB(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return null;
    }
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve) => {
      try {
        const req = window.indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e: any) => {
          const db = e.target.result as IDBDatabase;
          const storeNames = [
            'settings',
            'checklistItems',
            'inventoryItems',
            'familyPlans',
            'localRiskSnapshots',
            'quizProgress',
            'metadata'
          ];
          storeNames.forEach((name) => {
            if (!db.objectStoreNames.contains(name)) {
              db.createObjectStore(name, { keyPath: 'id' });
            }
          });
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => {
          console.warn('IndexedDB inaccessible, mode dégradé localStorage actif');
          resolve(null);
        };
      } catch (err) {
        console.warn('IndexedDB init error', err);
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  // ==========================================
  // 1. PARAMÈTRES & THÈME (DUAL STORAGE)
  // ==========================================
  async getSettings(): Promise<AppSettings> {
    try {
      const db = await this.getDB();
      if (db) {
        const fromDb = await new Promise<AppSettings | null>((resolve) => {
          const tx = db.transaction('settings', 'readonly');
          const req = tx.objectStore('settings').get('main');
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        });
        if (fromDb) return fromDb;
      }
    } catch (e) {}

    return this.getSettingsFromLocalFallback();
  }

  private getSettingsFromLocalFallback(): AppSettings {
    try {
      const saved = localStorage.getItem('nrbc_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // S'assurer de la cohérence avec le thème rapide
        const fastTheme = localStorage.getItem('nrbcor_theme_mode');
        if (fastTheme && (fastTheme === 'light' || fastTheme === 'dark' || fastTheme === 'system')) {
          parsed.preferredTheme = fastTheme;
        }
        return parsed;
      }
    } catch (e) {}

    // Fallback minimal si seul le thème était stocké
    const fastTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('nrbcor_theme_mode') : null;
    const isClean = typeof localStorage !== 'undefined' && localStorage.getItem('nrbc_clean_slate_active') === 'true';

    if (fastTheme && (fastTheme === 'light' || fastTheme === 'dark' || fastTheme === 'system')) {
      const base = isClean ? CLEAN_SETTINGS : DEFAULT_SETTINGS;
      return { ...base, preferredTheme: fastTheme as any };
    }

    return isClean ? CLEAN_SETTINGS : DEFAULT_SETTINGS;
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    const enriched: AppSettings = {
      ...settings,
      updatedAt: new Date().toISOString()
    };

    // Miroir synchrone immédiat (évite tout flash de thème au rechargement)
    try {
      localStorage.setItem('nrbc_settings', JSON.stringify(enriched));
      localStorage.setItem('nrbcor_theme_mode', enriched.preferredTheme);
    } catch (e) {}

    // Persistance durable IndexedDB
    try {
      const db = await this.getDB();
      if (db) {
        const tx = db.transaction('settings', 'readwrite');
        tx.objectStore('settings').put(enriched);
      }
    } catch (e) {}
  }

  // ==========================================
  // 2. KIT D'URGENCE 72H (CHECKLIST ITEMS)
  // ==========================================
  async getKitItems(): Promise<KitItem[]> {
    try {
      const db = await this.getDB();
      if (db) {
        const fromDb = await new Promise<{ id: string; items: KitItem[] } | null>((resolve) => {
          const tx = db.transaction('checklistItems', 'readonly');
          const req = tx.objectStore('checklistItems').get('current');
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        });
        if (fromDb && Array.isArray(fromDb.items) && fromDb.items.length > 0) {
          return fromDb.items;
        }
      }
    } catch (e) {}

    return this.getKitItemsFromLocalFallback();
  }

  private getKitItemsFromLocalFallback(): KitItem[] {
    try {
      const saved = localStorage.getItem('nrbcor_kit_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    if (typeof localStorage !== 'undefined' && localStorage.getItem('nrbc_clean_slate_active') === 'true') {
      return INITIAL_KIT_ITEMS.map((it) => ({ ...it, completed: false }));
    }

    return INITIAL_KIT_ITEMS;
  }

  async saveKitItems(items: KitItem[]): Promise<void> {
    // Miroir synchrone
    try {
      localStorage.setItem('nrbcor_kit_items', JSON.stringify(items));
    } catch (e) {}

    // Persistance durable IndexedDB
    try {
      const db = await this.getDB();
      if (db) {
        const tx = db.transaction('checklistItems', 'readwrite');
        tx.objectStore('checklistItems').put({
          id: 'current',
          items,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (e) {}
  }

  // ==========================================
  // 3. PLAN FAMILIAL DE MISE EN SÛRETÉ (PFMS)
  // ==========================================
  async getFamilyPlan(): Promise<FamilyPlanData> {
    try {
      const db = await this.getDB();
      if (db) {
        const fromDb = await new Promise<{ id: string; plan: FamilyPlanData } | null>((resolve) => {
          const tx = db.transaction('familyPlans', 'readonly');
          const req = tx.objectStore('familyPlans').get('current');
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        });
        if (fromDb && fromDb.plan) {
          return fromDb.plan;
        }
      }
    } catch (e) {}

    return this.getFamilyPlanFromLocalFallback();
  }

  private getFamilyPlanFromLocalFallback(): FamilyPlanData {
    try {
      const saved = localStorage.getItem('nrbcor_family_plan');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.tasks)) return parsed;
      }

      // Rétrocompatibilité avec les anciennes clés séparées
      const sTasks = localStorage.getItem('nrbcor_plan_tasks');
      const sMembers = localStorage.getItem('nrbcor_family_members');
      const sOut = localStorage.getItem('nrbcor_out_contact');
      const sLocal = localStorage.getItem('nrbcor_local_contacts');

      if (sTasks || sMembers || sOut || sLocal) {
        return {
          tasks: sTasks ? JSON.parse(sTasks) : INITIAL_PLAN_TASKS,
          members: sMembers ? JSON.parse(sMembers) : [],
          outZoneContact: sOut ? JSON.parse(sOut) : null,
          localContacts: sLocal ? JSON.parse(sLocal) : [],
          assemblyPoints: [],
          updatedAt: new Date().toISOString()
        };
      }
    } catch (e) {}

    if (typeof localStorage !== 'undefined' && localStorage.getItem('nrbc_clean_slate_active') === 'true') {
      return CLEAN_FAMILY_PLAN;
    }

    return INITIAL_FAMILY_PLAN;
  }

  async saveFamilyPlan(plan: FamilyPlanData): Promise<void> {
    const enriched: FamilyPlanData = {
      ...plan,
      updatedAt: new Date().toISOString()
    };

    // Miroir synchrone unifié + clés d'accès rapide
    try {
      localStorage.setItem('nrbcor_family_plan', JSON.stringify(enriched));
      localStorage.setItem('nrbcor_plan_tasks', JSON.stringify(enriched.tasks));
      localStorage.setItem('nrbcor_family_members', JSON.stringify(enriched.members));
      localStorage.setItem('nrbcor_out_contact', JSON.stringify(enriched.outZoneContact || null));
      localStorage.setItem('nrbcor_local_contacts', JSON.stringify(enriched.localContacts));
      if (enriched.assemblyPoints) {
        localStorage.setItem('nrbcor_assembly_points', JSON.stringify(enriched.assemblyPoints));
      }
    } catch (e) {}

    // Persistance durable IndexedDB
    try {
      const db = await this.getDB();
      if (db) {
        const tx = db.transaction('familyPlans', 'readwrite');
        tx.objectStore('familyPlans').put({
          id: 'current',
          plan: enriched,
          updatedAt: enriched.updatedAt
        });
      }
    } catch (e) {}
  }

  // ==========================================
  // 4. INVENTAIRE PHYSIQUE DE SURVIE
  // ==========================================
  async getInventoryItems(): Promise<InventoryItem[]> {
    try {
      const db = await this.getDB();
      if (db) {
        const items = await new Promise<InventoryItem[]>((resolve) => {
          const tx = db.transaction('inventoryItems', 'readonly');
          const req = tx.objectStore('inventoryItems').getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        });
        if (typeof localStorage !== 'undefined' && localStorage.getItem('nrbc_clean_slate_active') === 'true') {
          return items;
        }
        if (items.length > 0) return items;
      }
    } catch (e) {}

    return this.getInventoryFromLocalFallback();
  }

  private getInventoryFromLocalFallback(): InventoryItem[] {
    try {
      const saved = localStorage.getItem('nrbc_inventory');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    if (typeof localStorage !== 'undefined' && localStorage.getItem('nrbc_clean_slate_active') === 'true') {
      return [];
    }
    return INITIAL_INVENTORY;
  }

  async saveInventoryItem(item: InventoryItem): Promise<void> {
    const current = await this.getInventoryItems();
    const idx = current.findIndex((i) => i.id === item.id);
    let updated: InventoryItem[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = item;
    } else {
      updated = [item, ...current];
    }

    try {
      localStorage.setItem('nrbc_inventory', JSON.stringify(updated));
      const db = await this.getDB();
      if (db) {
        const tx = db.transaction('inventoryItems', 'readwrite');
        tx.objectStore('inventoryItems').put(item);
      }
    } catch (e) {}
  }

  async deleteInventoryItem(id: string): Promise<void> {
    const current = await this.getInventoryItems();
    const updated = current.filter((i) => i.id !== id);
    try {
      localStorage.setItem('nrbc_inventory', JSON.stringify(updated));
      const db = await this.getDB();
      if (db) {
        const tx = db.transaction('inventoryItems', 'readwrite');
        tx.objectStore('inventoryItems').delete(id);
      }
    } catch (e) {}
  }

  // ==========================================
  // 5. GÉORISQUES INSTANTANÉS
  // ==========================================
  async getLocalRiskSnapshot(communeName: string): Promise<LocalRiskSnapshot | null> {
    try {
      const db = await this.getDB();
      if (db) {
        const snap = await new Promise<LocalRiskSnapshot | null>((resolve) => {
          const tx = db.transaction('localRiskSnapshots', 'readonly');
          const req = tx.objectStore('localRiskSnapshots').get(communeName);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        });
        if (snap) return snap;
      }
    } catch (e) {}

    try {
      const saved = localStorage.getItem(`nrbc_georisques_${communeName}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  }

  async saveLocalRiskSnapshot(snapshot: LocalRiskSnapshot): Promise<void> {
    try {
      localStorage.setItem(`nrbc_georisques_${snapshot.communeName}`, JSON.stringify(snapshot));
      const db = await this.getDB();
      if (db) {
        const tx = db.transaction('localRiskSnapshots', 'readwrite');
        tx.objectStore('localRiskSnapshots').put(snapshot);
      }
    } catch (e) {}
  }

  // ==========================================
  // 6. QUIZ & FORMATION
  // ==========================================
  async getQuizProgress(quizId: string): Promise<QuizProgress | null> {
    try {
      const db = await this.getDB();
      if (db) {
        const progress = await new Promise<QuizProgress | null>((resolve) => {
          const tx = db.transaction('quizProgress', 'readonly');
          const req = tx.objectStore('quizProgress').get(quizId);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        });
        if (progress) return progress;
      }
    } catch (e) {}

    try {
      const saved = localStorage.getItem(`nrbc_quiz_${quizId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  }

  async saveQuizProgress(progress: QuizProgress): Promise<void> {
    try {
      localStorage.setItem(`nrbc_quiz_${progress.quizId}`, JSON.stringify(progress));
      const db = await this.getDB();
      if (db) {
        const tx = db.transaction('quizProgress', 'readwrite');
        tx.objectStore('quizProgress').put({
          id: progress.quizId,
          ...progress
        });
      }
    } catch (e) {}
  }

  // ==========================================
  // 7. DIAGNOSTICS & SANTÉ DU STOCKAGE
  // ==========================================
  async getDiagnostics(): Promise<StorageDiagnostics> {
    const isIndexedDbSupported = typeof window !== 'undefined' && 'indexedDB' in window;
    let activeEngine: 'IndexedDB (Prioritaire)' | 'localStorage (Secours)' = 'localStorage (Secours)';

    const db = await this.getDB();
    if (db) {
      activeEngine = 'IndexedDB (Prioritaire)';
    }

    const settings = await this.getSettings();
    const kitItems = await this.getKitItems();
    const familyPlan = await this.getFamilyPlan();
    const inventory = await this.getInventoryItems();

    let quotaEstimate: { usageBytes: number; quotaBytes: number; percentage: number } | undefined = undefined;
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        if (estimate.usage !== undefined && estimate.quota !== undefined && estimate.quota > 0) {
          quotaEstimate = {
            usageBytes: estimate.usage,
            quotaBytes: estimate.quota,
            percentage: Math.min(100, Math.round((estimate.usage / estimate.quota) * 100))
          };
        }
      } catch (e) {}
    }

    const lastBackup = typeof localStorage !== 'undefined' ? localStorage.getItem('nrbcor_last_backup_date') || undefined : undefined;

    return {
      isIndexedDbSupported,
      activeEngine,
      stores: [
        {
          name: 'settings',
          label: 'Paramètres & Préférences Générales',
          itemCount: settings ? 1 : 0,
          status: settings ? 'ok' : 'warning'
        },
        {
          name: 'checklistItems',
          label: 'Kit d’Urgence 72h (Checklist)',
          itemCount: kitItems.length,
          status: kitItems.length > 0 ? 'ok' : 'warning'
        },
        {
          name: 'familyPlans',
          label: 'Plan Familial de Mise en Sûreté',
          itemCount: familyPlan.tasks.length + familyPlan.members.length,
          status: familyPlan.tasks.length > 0 ? 'ok' : 'warning'
        },
        {
          name: 'inventoryItems',
          label: 'Inventaire Vivres & Matériel',
          itemCount: inventory.length,
          status: inventory.length > 0 ? 'ok' : 'empty'
        },
        {
          name: 'localRiskSnapshots',
          label: 'Instantanés & Cache Géorisques',
          itemCount: 1,
          status: 'ok'
        }
      ],
      lastExportedBackupDate: lastBackup,
      lastSyncDate: new Date().toISOString(),
      quotaEstimate
    };
  }

  // ==========================================
  // 8. EXPORTATION COMPLÈTE UNIFIÉE (V2)
  // ==========================================
  // 8. EXPORTATION COMPLÈTE UNIFIÉE (V2)
  // ==========================================
  async exportAllData(): Promise<Record<string, any>> {
    const settings = await this.getSettings();
    const kitItems = await this.getKitItems();
    const familyPlan = await this.getFamilyPlan();
    const inventory = await this.getInventoryItems();
    const nowIso = new Date().toISOString();

    // Collecter les instantanés de risques locaux
    let localRiskSnapshots: LocalRiskSnapshot[] = [];
    try {
      const db = await this.getDB();
      if (db) {
        localRiskSnapshots = await new Promise((resolve) => {
          const tx = db.transaction('localRiskSnapshots', 'readonly');
          const req = tx.objectStore('localRiskSnapshots').getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        });
      }
    } catch (e) {}

    try {
      localStorage.setItem('nrbcor_last_backup_date', nowIso);
    } catch (e) {}

    return {
      format: 'NRBCOR_BACKUP_V2',
      versionApplication: '1.2.0 PWA',
      exportedAt: nowIso,
      exportedAtFormatted: new Date().toLocaleString('fr-FR'),
      storageEngine: 'IndexedDB+DualMirror',
      settings,
      kitItems,
      familyPlan,
      inventory,
      localRiskSnapshots,
      meta: {
        description: 'Sauvegarde intégrale unifiée des données civiles NRBCOR (Protection Civile & Résilience)',
        totalKitItems: kitItems.length,
        totalInventoryItems: inventory.length,
        totalPlanTasks: familyPlan.tasks.length,
        totalRiskSnapshots: localRiskSnapshots.length
      }
    };
  }

  // ==========================================
  // 9. RESTAURATION STRICTE & RÉTROCOMPATIBLE
  // ==========================================
  async importAllData(data: Record<string, any>): Promise<{ success: boolean; error?: string }> {
    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Format de fichier non reconnu (JSON attendu)' };
    }

    // Accepter le format unifié V2, le format V1 ou tout backup valide
    const isV2 = data.format === 'NRBCOR_BACKUP_V2';
    const isV1 = data.format === 'NRBCOR_BACKUP_V1';
    const hasKnownEntities = Boolean(data.settings || data.kitItems || data.inventory || data.familyPlan || data.localRiskSnapshots);

    if (!isV2 && !isV1 && !hasKnownEntities) {
      return { success: false, error: 'Signature de sauvegarde incompatible ou fichier altéré' };
    }

    try {
      // 1. Paramètres
      if (data.settings && typeof data.settings === 'object') {
        await this.saveSettings({
          ...DEFAULT_SETTINGS,
          ...data.settings,
          updatedAt: new Date().toISOString()
        });
      }

      // 2. Kit d'urgence
      if (Array.isArray(data.kitItems)) {
        await this.saveKitItems(data.kitItems);
      }

      // 3. Plan familial (sans réinjection forcée de données fictives si vide)
      if (data.familyPlan && typeof data.familyPlan === 'object') {
        const planToSave: FamilyPlanData = {
          tasks: Array.isArray(data.familyPlan.tasks) ? data.familyPlan.tasks : [],
          members: Array.isArray(data.familyPlan.members) ? data.familyPlan.members : [],
          outZoneContact: data.familyPlan.outZoneContact !== undefined ? data.familyPlan.outZoneContact : null,
          localContacts: Array.isArray(data.familyPlan.localContacts) ? data.familyPlan.localContacts : [],
          assemblyPoints: Array.isArray(data.familyPlan.assemblyPoints) ? data.familyPlan.assemblyPoints : [],
          updatedAt: new Date().toISOString()
        };
        await this.saveFamilyPlan(planToSave);
      }

      // 4. Inventaire
      if (Array.isArray(data.inventory)) {
        try {
          localStorage.setItem('nrbc_inventory', JSON.stringify(data.inventory));
          const db = await this.getDB();
          if (db) {
            const tx = db.transaction('inventoryItems', 'readwrite');
            const store = tx.objectStore('inventoryItems');
            store.clear();
            data.inventory.forEach((it: InventoryItem) => store.put(it));
          }
        } catch (e) {}
      }

      // 5. Données de risque territoriales (localRiskSnapshots)
      if (Array.isArray(data.localRiskSnapshots)) {
        for (const snap of data.localRiskSnapshots) {
          if (snap && snap.communeName) {
            await this.saveLocalRiskSnapshot(snap);
          }
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Erreur lors de la réinjection des données' };
    }
  }

  // ==========================================
  // 10. PURGE INTÉGRALE & SÉCURISÉE (WIPE)
  // ==========================================
  async clearAllData(): Promise<void> {
    try {
      // Nettoyage de toutes les clés liées à l'application dans localStorage
      const keysToRemove = [
        'nrbc_settings',
        'nrbcor_theme_mode',
        'nrbcor_kit_items',
        'nrbcor_family_plan',
        'nrbcor_plan_tasks',
        'nrbcor_family_members',
        'nrbcor_out_contact',
        'nrbcor_local_contacts',
        'nrbc_inventory',
        'nrbcor_last_backup_date',
        'georisques_last_exported_snapshot'
      ];
      keysToRemove.forEach((k) => localStorage.removeItem(k));

      // Nettoyage de toutes les clés dynamiques de cache Géorisques
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('georisques_cache_') || key.startsWith('nrbc_'))) {
          localStorage.removeItem(key);
        }
      }

      // Nettoyage des magasins IndexedDB
      const db = await this.getDB();
      if (db) {
        const storeNames = [
          'settings',
          'checklistItems',
          'inventoryItems',
          'familyPlans',
          'localRiskSnapshots',
          'quizProgress',
          'metadata'
        ];
        storeNames.forEach((name) => {
          try {
            const tx = db.transaction(name, 'readwrite');
            tx.objectStore(name).clear();
          } catch (e) {}
        });
      }
    } catch (e) {}
  }

  // ==========================================
  // 11. REMISE À ZÉRO : FEUILLE BLANCHE (PROPRE)
  // ==========================================
  async resetToCleanState(): Promise<void> {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('nrbc_clean_slate_active', 'true');
      }

      // 1. Paramètres propres (1 personne, aucun risque artificiel)
      await this.saveSettings(CLEAN_SETTINGS);

      // 2. Checklist Kit 72h à 0% (tous les éléments présents mais non acquis)
      const cleanKit = INITIAL_KIT_ITEMS.map((it) => ({ ...it, completed: false }));
      await this.saveKitItems(cleanKit);

      // 3. Plan familial 100% vierge (aucun membre fictif, aucun contact fictif, aucun point de ralliement)
      await this.saveFamilyPlan(CLEAN_FAMILY_PLAN);

      // 4. Inventaire vide (0 vivres ou matériel factices)
      try {
        localStorage.setItem('nrbc_inventory', JSON.stringify([]));
        const db = await this.getDB();
        if (db) {
          const tx = db.transaction('inventoryItems', 'readwrite');
          tx.objectStore('inventoryItems').clear();
        }
      } catch (e) {}

      // 5. Caches et quiz réinitialisés
      const db = await this.getDB();
      if (db) {
        ['localRiskSnapshots', 'quizProgress'].forEach((name) => {
          try {
            const tx = db.transaction(name, 'readwrite');
            tx.objectStore(name).clear();
          } catch (e) {}
        });
      }

      if (typeof localStorage !== 'undefined') {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('georisques_cache_') || key.startsWith('nrbc_quiz_'))) {
            localStorage.removeItem(key);
          }
        }
      }
    } catch (err) {
      console.error('Erreur lors de la remise à zéro', err);
    }
  }

  // ==========================================
  // 12. RESTAURATION DU SCÉNARIO DE DÉMONSTRATION
  // ==========================================
  async resetToDemoState(): Promise<void> {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('nrbc_clean_slate_active');
      }

      // 1. Paramètres du scénario de démonstration
      await this.saveSettings(DEFAULT_SETTINGS);

      // 2. Checklist avec exemples acquis
      await this.saveKitItems(INITIAL_KIT_ITEMS);

      // 3. Plan familial modèle complet (Marc D., Sophie M., Parc des Cèdres)
      await this.saveFamilyPlan(INITIAL_FAMILY_PLAN);

      // 4. Stocks d'inventaire complets
      try {
        localStorage.setItem('nrbc_inventory', JSON.stringify(INITIAL_INVENTORY));
        const db = await this.getDB();
        if (db) {
          const tx = db.transaction('inventoryItems', 'readwrite');
          const store = tx.objectStore('inventoryItems');
          store.clear();
          INITIAL_INVENTORY.forEach((it) => store.put(it));
        }
      } catch (e) {}
    } catch (err) {
      console.error('Erreur lors du rechargement de la démo', err);
    }
  }

  // ==========================================
  // 13. ACCÈS SYNCHRONE CENTRALISÉ AU BOOT
  // ==========================================
  getInitialTheme(): 'light' | 'dark' | 'system' {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('nrbcor_theme_mode');
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          return saved;
        }
      }
    } catch (e) {}
    return 'light';
  }

  getInitialKitItems(): KitItem[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const isClean = localStorage.getItem('nrbc_clean_slate_active') === 'true';
        const saved = localStorage.getItem('nrbcor_kit_items');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
        if (isClean) {
          return INITIAL_KIT_ITEMS.map((it) => ({ ...it, completed: false }));
        }
      }
    } catch (e) {}
    return INITIAL_KIT_ITEMS;
  }

  // ==========================================
  // 14. MIGRATION AUTOMATIQUE LOCALSTORAGE -> INDEXEDDB
  // ==========================================
  async migrateLegacyData(): Promise<{ migratedCount: number; errors: string[] }> {
    const errors: string[] = [];
    let migratedCount = 0;

    try {
      if (typeof localStorage === 'undefined') {
        return { migratedCount: 0, errors: [] };
      }

      const isMigrated = localStorage.getItem('nrbcor_v2_migrated');
      if (isMigrated === 'true') {
        return { migratedCount: 0, errors: [] };
      }

      const db = await this.getDB();
      if (!db) {
        return { migratedCount: 0, errors: ['IndexedDB non disponible pour la migration'] };
      }

      // 1. Migration Kit Items
      const rawKit = localStorage.getItem('nrbcor_kit_items');
      if (rawKit) {
        try {
          const parsed = JSON.parse(rawKit);
          if (Array.isArray(parsed) && parsed.length > 0) {
            await this.saveKitItems(parsed);
            migratedCount++;
          }
        } catch (e: any) {
          errors.push(`Kit items: ${e?.message}`);
        }
      }

      // 2. Migration Settings
      const rawSettings = localStorage.getItem('nrbc_settings');
      if (rawSettings) {
        try {
          const parsed = JSON.parse(rawSettings);
          if (parsed && typeof parsed === 'object') {
            await this.saveSettings(parsed);
            migratedCount++;
          }
        } catch (e: any) {
          errors.push(`Settings: ${e?.message}`);
        }
      }

      // 3. Migration Plan Familial
      const rawPlan = localStorage.getItem('nrbcor_family_plan');
      if (rawPlan) {
        try {
          const parsed = JSON.parse(rawPlan);
          if (parsed && typeof parsed === 'object') {
            await this.saveFamilyPlan(parsed);
            migratedCount++;
          }
        } catch (e: any) {
          errors.push(`Family plan: ${e?.message}`);
        }
      }

      // 4. Migration Inventaire
      const rawInv = localStorage.getItem('nrbc_inventory');
      if (rawInv) {
        try {
          const parsed = JSON.parse(rawInv);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const tx = db.transaction('inventoryItems', 'readwrite');
            const store = tx.objectStore('inventoryItems');
            parsed.forEach((it) => store.put(it));
            migratedCount++;
          }
        } catch (e: any) {
          errors.push(`Inventory: ${e?.message}`);
        }
      }

      localStorage.setItem('nrbcor_v2_migrated', 'true');
    } catch (err: any) {
      errors.push(`General: ${err?.message}`);
    }

    return { migratedCount, errors };
  }

  // ==========================================
  // 15. TEST DE SANTÉ ET D'ÉCHEC DU STOCKAGE (QUOTA & PRIVATE BROWSING)
  // ==========================================
  async testStorageHealth(): Promise<{
    indexedDbOk: boolean;
    localStorageOk: boolean;
    quotaUsagePercent?: number;
    isPrivateMode: boolean;
  }> {
    let localStorageOk = false;
    let indexedDbOk = false;
    let isPrivateMode = false;
    let quotaUsagePercent: number | undefined = undefined;

    // Test localStorage
    try {
      const testKey = '__nrbcor_test__';
      localStorage.setItem(testKey, '1');
      const val = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      localStorageOk = val === '1';
    } catch (e) {
      localStorageOk = false;
      isPrivateMode = true;
    }

    // Test IndexedDB
    try {
      const db = await this.getDB();
      if (db) {
        const tx = db.transaction('metadata', 'readwrite');
        const store = tx.objectStore('metadata');
        store.put({ id: '__health_test__', timestamp: Date.now() });
        indexedDbOk = true;
      }
    } catch (e) {
      indexedDbOk = false;
    }

    // Quota estimate
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const est = await navigator.storage.estimate();
        if (est.quota && est.usage) {
          quotaUsagePercent = Math.round((est.usage / est.quota) * 100);
        }
      }
    } catch (e) {}

    return {
      indexedDbOk,
      localStorageOk,
      quotaUsagePercent,
      isPrivateMode
    };
  }
}

export const storageService: StorageRepository = new IndexedDbStorageService();
