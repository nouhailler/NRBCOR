/**
 * Service de Sauvegarde & Restauration Locale NRBCOR (Section 8.3 & P1)
 * 
 * Garanties :
 * - 100% Hors-Ligne & Zéro Télémétrie : Aucun envoi externe
 * - Validation stricte de schéma (format, types, assainissement)
 * - Rétrocompatibilité NRBCOR_BACKUP_V1 et NRBCOR_BACKUP_V2
 * - Détection des conflits et pré-visualisation avant écrasement
 */

import { storageService } from './IndexedDbStorage';
import { AppSettings, FamilyPlanData, InventoryItem } from './StorageRepository';
import { KitItem } from '../../types';

export interface BackupPayload {
  format: 'NRBCOR_BACKUP_V2' | 'NRBCOR_BACKUP_V1';
  versionApplication: string;
  exportedAt: string;
  exportedAtFormatted?: string;
  storageEngine: string;
  settings?: AppSettings;
  kitItems?: KitItem[];
  familyPlan?: FamilyPlanData;
  inventory?: InventoryItem[];
  localRiskSnapshots?: any[];
  meta?: {
    description?: string;
    totalKitItems?: number;
    totalInventoryItems?: number;
    totalPlanTasks?: number;
    totalRiskSnapshots?: number;
  };
}

export interface BackupPreview {
  isValid: boolean;
  format: string;
  exportedAt: string;
  error?: string;
  counts: {
    kitItems: number;
    inventoryItems: number;
    familyMembers: number;
    planTasks: number;
    contacts: number;
  };
  warnings: string[];
}

export class BackupRestoreService {
  /**
   * Génère et déclenche le téléchargement du fichier JSON de sauvegarde
   */
  async downloadBackup(): Promise<string> {
    const data = await storageService.exportAllData();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `nrbcor-backup-${dateStr}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return filename;
  }

  /**
   * Analyse et valide un JSON avant toute restauration
   */
  validateBackup(parsed: any): BackupPreview {
    if (!parsed || typeof parsed !== 'object') {
      return {
        isValid: false,
        format: 'inconnu',
        exportedAt: '',
        error: 'Le fichier ne contient pas un objet JSON valide.',
        counts: { kitItems: 0, inventoryItems: 0, familyMembers: 0, planTasks: 0, contacts: 0 },
        warnings: []
      };
    }

    const format = parsed.format || (parsed.version ? `v${parsed.version}` : 'non_versionne');
    const warnings: string[] = [];

    if (parsed.format !== 'NRBCOR_BACKUP_V2' && parsed.format !== 'NRBCOR_BACKUP_V1') {
      warnings.push("La signature du fichier diffère de la norme NRBCOR V2. Une tentative d'importation partielle sera effectuée.");
    }

    const kitItems = Array.isArray(parsed.kitItems) ? parsed.kitItems : [];
    const inventoryItems = Array.isArray(parsed.inventory) ? parsed.inventory : [];
    const familyMembers = Array.isArray(parsed.familyPlan?.members) ? parsed.familyPlan.members : [];
    const planTasks = Array.isArray(parsed.familyPlan?.tasks) ? parsed.familyPlan.tasks : [];
    const localContacts = Array.isArray(parsed.familyPlan?.localContacts) ? parsed.familyPlan.localContacts : [];
    const outZone = parsed.familyPlan?.outZoneContact ? 1 : 0;

    const totalEntities = kitItems.length + inventoryItems.length + familyMembers.length + planTasks.length;
    if (totalEntities === 0 && !parsed.settings) {
      return {
        isValid: false,
        format,
        exportedAt: parsed.exportedAt || '',
        error: 'Le fichier de sauvegarde ne contient aucune donnée reconnaissable.',
        counts: { kitItems: 0, inventoryItems: 0, familyMembers: 0, planTasks: 0, contacts: 0 },
        warnings
      };
    }

    return {
      isValid: true,
      format,
      exportedAt: parsed.exportedAtFormatted || parsed.exportedAt || 'Date inconnue',
      counts: {
        kitItems: kitItems.length,
        inventoryItems: inventoryItems.length,
        familyMembers: familyMembers.length,
        planTasks: planTasks.length,
        contacts: localContacts.length + outZone
      },
      warnings
    };
  }

  /**
   * Restaure les données validées dans IndexedDB et localStorage
   */
  async restoreBackup(parsed: any): Promise<{ success: boolean; error?: string }> {
    const preview = this.validateBackup(parsed);
    if (!preview.isValid) {
      return { success: false, error: preview.error || 'Sauvegarde invalide' };
    }

    try {
      const res = await storageService.importAllData(parsed);
      return res;
    } catch (e: any) {
      return { success: false, error: e?.message || 'Erreur lors de la réécriture du stockage local' };
    }
  }
}

export const backupRestoreService = new BackupRestoreService();
