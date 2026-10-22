/**
 * Service de notifications locales et de suivi d'audit semestriel du matériel de crise.
 * Utilise la Web Notification API standard en 100% local (sans serveur ni cloud).
 * Surveille les dates de péremption des réserves (eau, nourriture, filtres, iode)
 * et alerte l'utilisateur tous les 6 mois pour l'audit physique de son Kit 72h.
 */

import { InventoryItem } from './storage/StorageRepository';

const AUDIT_STORAGE_KEY = 'nrbcor_last_audit_date';
const SEMESTER_DAYS = 180; // 6 mois

export interface AuditStatus {
  lastAuditDate: string | null;
  daysSinceLastAudit: number;
  isAuditDue: boolean;
  isDue: boolean;
  daysRemaining: number;
  nextAuditDate: string;
  expiredItems: { item: InventoryItem; daysDiff: number }[];
  soonExpiringItems: { item: InventoryItem; daysDiff: number }[];
  totalTrackedWithExpiry: number;
}

export const notificationService = {
  /**
   * Vérifie si les notifications sont supportées par le navigateur
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  /**
   * Retourne la permission actuelle
   */
  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  },

  /**
   * Demande formellement la permission à l'utilisateur
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (e) {
      return 'denied';
    }
  },

  /**
   * Envoie une notification locale immédiate (via Service Worker si dispo, sinon constructeur)
   */
  async sendLocalNotification(title: string, options: NotificationOptions = {}): Promise<boolean> {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false;
    }

    const defaultOptions: NotificationOptions = {
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag: 'nrbcor-alert',
      ...options
    };

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration && registration.showNotification) {
          await registration.showNotification(title, defaultOptions);
          return true;
        }
      }

      new Notification(title, defaultOptions);
      return true;
    } catch (err) {
      console.warn('Échec envoi notification locale:', err);
      return false;
    }
  },

  /**
   * Calcule le statut complet de l'audit semestriel et des péremptions d'inventaire
   */
  getAuditStatus(inventoryItems: InventoryItem[] = []): AuditStatus {
    let lastAuditDate: string | null = null;
    try {
      lastAuditDate = localStorage.getItem(AUDIT_STORAGE_KEY);
    } catch (e) {}

    const now = new Date();
    let daysSinceLastAudit = 0;

    if (lastAuditDate) {
      const last = new Date(lastAuditDate);
      daysSinceLastAudit = Math.max(0, Math.floor((now.getTime() - last.getTime()) / (1000 * 3600 * 24)));
    } else {
      // Si jamais audité, considérer qu'un premier audit est recommandé
      daysSinceLastAudit = SEMESTER_DAYS + 1;
    }

    const isAuditDue = daysSinceLastAudit >= SEMESTER_DAYS;

    const nextDate = lastAuditDate ? new Date(new Date(lastAuditDate).getTime() + SEMESTER_DAYS * 24 * 3600 * 1000) : now;
    const nextAuditDate = nextDate.toLocaleDateString('fr-FR');

    const expiredItems: { item: InventoryItem; daysDiff: number }[] = [];
    const soonExpiringItems: { item: InventoryItem; daysDiff: number }[] = [];
    let totalTrackedWithExpiry = 0;

    inventoryItems.forEach((item) => {
      if (!item.expiryDate) return;
      totalTrackedWithExpiry++;

      const exp = new Date(item.expiryDate);
      const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 3600 * 24));

      if (diffDays < 0) {
        expiredItems.push({ item, daysDiff: Math.abs(diffDays) });
      } else if (diffDays <= 30) {
        soonExpiringItems.push({ item, daysDiff: diffDays });
      }
    });

    return {
      lastAuditDate,
      daysSinceLastAudit,
      isAuditDue,
      isDue: isAuditDue,
      daysRemaining: Math.max(0, SEMESTER_DAYS - daysSinceLastAudit),
      nextAuditDate,
      expiredItems,
      soonExpiringItems,
      totalTrackedWithExpiry
    };
  },

  /**
   * Enregistre que l'audit semestriel vient d'être validé par l'utilisateur
   */
  markAuditCompleted(): void {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, new Date().toISOString());
    } catch (e) {}
  },

  /**
   * Déclenche une vérification locale et émet une notification si nécessaire
   */
  async checkAndNotifyIfDue(inventoryItems: InventoryItem[] = []): Promise<boolean> {
    if (this.getPermission() !== 'granted') return false;

    const status = this.getAuditStatus(inventoryItems);

    if (status.expiredItems.length > 0) {
      await this.sendLocalNotification('NRBCOR • Péremption d’urgence détectée', {
        body: `${status.expiredItems.length} article(s) de votre kit 72h ont dépassé leur date limite de consommation (ex: ${status.expiredItems[0].item.name}).`,
        data: { url: '/?tab=preparation' }
      });
      return true;
    }

    if (status.isAuditDue) {
      await this.sendLocalNotification('NRBCOR • Audit semestriel du kit requis', {
        body: `6 mois se sont écoulés depuis le dernier contrôle de votre kit de crise. Vérifiez les piles, filtres et réserves d'eau.`,
        data: { url: '/?tab=preparation' }
      });
      return true;
    }

    if (status.soonExpiringItems.length > 0) {
      await this.sendLocalNotification('NRBCOR • Renouvellement à prévoir sous 30 j', {
        body: `${status.soonExpiringItems.length} réserve(s) arrivent à échéance prochainement (${status.soonExpiringItems[0].item.name}).`,
        data: { url: '/?tab=preparation' }
      });
      return true;
    }

    return false;
  }
};

export const getAuditStatus = (inventoryItems: InventoryItem[] = []): AuditStatus => {
  return notificationService.getAuditStatus(inventoryItems);
};
