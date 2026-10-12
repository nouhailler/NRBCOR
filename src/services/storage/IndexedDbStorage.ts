import { AppSettings, InventoryItem, LocalRiskSnapshot, QuizProgress, StorageRepository } from './StorageRepository';

const DB_NAME = 'nrbc-preparation-db';
const DB_VERSION = 1;

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
  onboardingCompleted: false,
  createdAt: '2026-10-12T00:00:00.000Z',
  updatedAt: '2026-10-12T00:00:00.000Z'
};

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Packs d\'eau minérale plate (6x1.5L)',
    category: 'Eau & Hydratation',
    quantity: 3,
    unit: 'packs (27L)',
    expiryDate: '2028-06-30',
    lastCheckedAt: '2026-10-01',
    notes: 'Stocké à l\'abri de la lumière dans le cellier.',
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
    name: 'Comprimés de purification d\'eau (Micropur Forte)',
    category: 'Eau & Hydratation',
    quantity: 1,
    unit: 'boîte (100 comp.)',
    expiryDate: '2029-01-01',
    lastCheckedAt: '2026-10-04',
    notes: '1 comprimé par litre d\'eau claire. Laisser agir 30 min (bactéries) à 2h (kystes/amibes).',
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
    notes: 'Pour radio d\'urgence et lampes torches.',
    createdAt: '2026-10-12T00:00:00Z',
    updatedAt: '2026-10-12T00:00:00Z'
  },
  {
    id: 'inv-6',
    name: 'Flacon de solution antiseptique (Chlorhexidine)',
    category: 'Premiers Soins & Pharmacie',
    quantity: 2,
    unit: 'flacons 250ml',
    expiryDate: '2026-11-01', // Date proche pour démonstration "À vérifier"
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
          console.warn('IndexedDB inaccessible, fallback localStorage actif');
          resolve(null);
        };
      } catch (err) {
        console.warn('IndexedDB init error', err);
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  async getSettings(): Promise<AppSettings> {
    try {
      const db = await this.getDB();
      if (db) {
        return new Promise((resolve) => {
          const tx = db.transaction('settings', 'readonly');
          const req = tx.objectStore('settings').get('main');
          req.onsuccess = () => {
            if (req.result) resolve(req.result);
            else resolve(this.getSettingsFromLocalFallback());
          };
          req.onerror = () => resolve(this.getSettingsFromLocalFallback());
        });
      }
    } catch (e) {}
    return this.getSettingsFromLocalFallback();
  }

  private getSettingsFromLocalFallback(): AppSettings {
    try {
      const saved = localStorage.getItem('nrbc_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_SETTINGS;
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      localStorage.setItem('nrbc_settings', JSON.stringify(settings));
      const db = await this.getDB();
      if (db) {
        const tx = db.transaction('settings', 'readwrite');
        tx.objectStore('settings').put(settings);
      }
    } catch (e) {}
  }

  async getInventoryItems(): Promise<InventoryItem[]> {
    try {
      const db = await this.getDB();
      if (db) {
        return new Promise((resolve) => {
          const tx = db.transaction('inventoryItems', 'readonly');
          const req = tx.objectStore('inventoryItems').getAll();
          req.onsuccess = () => {
            if (req.result && req.result.length > 0) resolve(req.result);
            else resolve(this.getInventoryFromLocalFallback());
          };
          req.onerror = () => resolve(this.getInventoryFromLocalFallback());
        });
      }
    } catch (e) {}
    return this.getInventoryFromLocalFallback();
  }

  private getInventoryFromLocalFallback(): InventoryItem[] {
    try {
      const saved = localStorage.getItem('nrbc_inventory');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
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

  async getLocalRiskSnapshot(communeName: string): Promise<LocalRiskSnapshot | null> {
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

  async getQuizProgress(quizId: string): Promise<QuizProgress | null> {
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
        tx.objectStore('quizProgress').put(progress);
      }
    } catch (e) {}
  }

  async exportAllData(): Promise<Record<string, any>> {
    const settings = await this.getSettings();
    const inventory = await this.getInventoryItems();
    let familyPlan = null;
    let kitItems = null;
    try {
      familyPlan = JSON.parse(localStorage.getItem('nrbcor_family_plan') || 'null');
      kitItems = JSON.parse(localStorage.getItem('nrbcor_kit_items') || 'null');
    } catch (e) {}

    return {
      format: 'NRBCOR_BACKUP_V1',
      exportedAt: new Date().toISOString(),
      settings,
      inventory,
      familyPlan,
      kitItems
    };
  }

  async importAllData(data: Record<string, any>): Promise<{ success: boolean; error?: string }> {
    // SEC-02 Strict Schema Validation
    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Format de fichier invalide (JSON attendu)' };
    }
    if (data.format !== 'NRBCOR_BACKUP_V1' && !data.settings && !data.inventory) {
      return { success: false, error: 'Signature de sauvegarde incompatible ou altérée' };
    }

    try {
      if (data.settings && typeof data.settings === 'object') {
        await this.saveSettings(data.settings);
      }
      if (Array.isArray(data.inventory)) {
        localStorage.setItem('nrbc_inventory', JSON.stringify(data.inventory));
        const db = await this.getDB();
        if (db) {
          const tx = db.transaction('inventoryItems', 'readwrite');
          const store = tx.objectStore('inventoryItems');
          store.clear();
          data.inventory.forEach((it: InventoryItem) => store.put(it));
        }
      }
      if (data.kitItems) {
        localStorage.setItem('nrbcor_kit_items', JSON.stringify(data.kitItems));
      }
      if (data.familyPlan) {
        localStorage.setItem('nrbcor_family_plan', JSON.stringify(data.familyPlan));
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Erreur lors de la restauration' };
    }
  }

  async clearAllData(): Promise<void> {
    try {
      localStorage.clear();
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
}

export const storageService: StorageRepository = new IndexedDbStorageService();
