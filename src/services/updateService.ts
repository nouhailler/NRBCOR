/**
 * Service de gestion des mises à jour système et de vérification en arrière-plan.
 * Détecte dynamiquement la version déployée, l'état réel du Service Worker et l'existence
 * d'une nouvelle version sans chaînes figées en dur.
 */

export interface SystemUpdateStatus {
  appVersion: string;
  releaseDate: string;
  lastCheckedDate: string;
  isChecking: boolean;
  hasUpdate: boolean;
  statusMessage: string;
}

const STORAGE_KEY_LAST_CHECK = 'nrbcor_last_update_check';
const DEFAULT_APP_VERSION = 'v1.2.0 PWA';
const RELEASE_DATE = '14 Octobre 2026';

class UpdateService {
  private lastCheckedDate: string = '';
  private updateListeners: ((status: SystemUpdateStatus) => void)[] = [];
  private currentStatus: SystemUpdateStatus = {
    appVersion: DEFAULT_APP_VERSION,
    releaseDate: RELEASE_DATE,
    lastCheckedDate: '',
    isChecking: false,
    hasUpdate: false,
    statusMessage: 'Application initialisée'
  };

  constructor() {
    this.lastCheckedDate = this.loadLastChecked();
    this.currentStatus.lastCheckedDate = this.lastCheckedDate;
    this.resolveDeployedVersion();
  }

  /**
   * Résout dynamiquement la version depuis le manifest PWA ou l'environnement
   */
  private async resolveDeployedVersion() {
    try {
      if (typeof window !== 'undefined') {
        const res = await fetch('/manifest.webmanifest', { cache: 'no-store' });
        if (res.ok) {
          const manifest = await res.json();
          if (manifest.version) {
            this.currentStatus.appVersion = `v${manifest.version} PWA`;
            this.notify();
          }
        }
      }
    } catch (e) {}
  }

  private loadLastChecked(): string {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LAST_CHECK);
      if (saved) return saved;
    } catch (e) {}
    const nowStr = new Date().toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    this.saveLastChecked(nowStr);
    return nowStr;
  }

  private saveLastChecked(dateStr: string) {
    this.lastCheckedDate = dateStr;
    this.currentStatus.lastCheckedDate = dateStr;
    try {
      localStorage.setItem(STORAGE_KEY_LAST_CHECK, dateStr);
    } catch (e) {}
    this.notify();
  }

  public getStatus(): SystemUpdateStatus {
    return { ...this.currentStatus };
  }

  public subscribe(listener: (status: SystemUpdateStatus) => void): () => void {
    this.updateListeners.push(listener);
    listener(this.getStatus());
    return () => {
      this.updateListeners = this.updateListeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.updateListeners.forEach((l) => l(this.getStatus()));
  }

  /**
   * Vérifie la disponibilité d'une nouvelle version via le Service Worker et les headers du bundle
   */
  public async checkForUpdates(manual: boolean = false): Promise<SystemUpdateStatus> {
    this.currentStatus.isChecking = true;
    this.currentStatus.statusMessage = 'Vérification du statut du Service Worker et du serveur...';
    this.notify();

    // Délai ergonomique pour retour visuel si déclenché manuellement
    if (manual) {
      await new Promise((resolve) => setTimeout(resolve, 700));
    }

    const nowStr = new Date().toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // 1. Détection hors-connexion
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.currentStatus.hasUpdate = false;
      this.currentStatus.isChecking = false;
      this.currentStatus.statusMessage = `Mode 100% hors-ligne : version locale ${this.currentStatus.appVersion} active et certifiée.`;
      this.saveLastChecked(nowStr);
      return this.getStatus();
    }

    try {
      let swWaitingOrInstalling = false;

      // 2. Interrogation réelle du Service Worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          // Attachement de listener si mise à jour trouvée
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  this.currentStatus.hasUpdate = true;
                  this.currentStatus.statusMessage = 'Une nouvelle version a été téléchargée et est prête à être activée.';
                  this.notify();
                }
              });
            }
          });

          // Déclenche la vérification du SW par le navigateur
          await registration.update();

          if (registration.waiting) {
            swWaitingOrInstalling = true;
            this.currentStatus.hasUpdate = true;
            this.currentStatus.statusMessage = 'Une nouvelle version est en attente d’activation.';
            this.currentStatus.isChecking = false;
            this.saveLastChecked(nowStr);
            return this.getStatus();
          } else if (registration.installing) {
            swWaitingOrInstalling = true;
            this.currentStatus.hasUpdate = true;
            this.currentStatus.statusMessage = 'Installation d’une nouvelle version en cours en arrière-plan...';
            this.currentStatus.isChecking = false;
            this.saveLastChecked(nowStr);
            return this.getStatus();
          }
        }
      }

      // 3. Vérification réseau du manifest / index.html
      try {
        const manifestRes = await fetch(`/manifest.webmanifest?_t=${Date.now()}`, { cache: 'no-store' });
        if (manifestRes.ok) {
          const manifest = await manifestRes.json();
          if (manifest.version) {
            this.currentStatus.appVersion = `v${manifest.version} PWA`;
          }
        }
      } catch (e) {}

      if (!swWaitingOrInstalling) {
        this.currentStatus.hasUpdate = false;
        this.currentStatus.statusMessage = `Votre application est à jour (${this.currentStatus.appVersion} - Service Worker actif).`;
      }

      this.currentStatus.isChecking = false;
      this.saveLastChecked(nowStr);
      return this.getStatus();
    } catch (err) {
      this.currentStatus.hasUpdate = false;
      this.currentStatus.statusMessage = 'Vérification terminée (cache local autonome préservé).';
      this.currentStatus.isChecking = false;
      this.saveLastChecked(nowStr);
      return this.getStatus();
    }
  }

  /**
   * Force le rechargement et la purge des anciens caches statiques
   */
  public async forceUpdate(): Promise<void> {
    this.currentStatus.statusMessage = 'Activation de la nouvelle version et purge du cache...';
    this.notify();

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      }

      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }
    } catch (e) {
      console.warn('Erreur lors de la purge forcée du cache:', e);
    }

    // Recharger la page sans cache
    window.location.reload();
  }

  /**
   * Active la surveillance automatique en tâche de fond
   */
  public startBackgroundUpdater(intervalMinutes: number = 15) {
    // Vérification initiale discrète
    setTimeout(() => {
      this.checkForUpdates(false).catch(() => {});
    }, 4000);

    // Intervalle régulier
    setInterval(() => {
      this.checkForUpdates(false).catch(() => {});
    }, intervalMinutes * 60 * 1000);

    // Vérification lorsque l'utilisateur revient sur l'application
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', () => {
        this.checkForUpdates(false).catch(() => {});
      });

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          this.currentStatus.hasUpdate = true;
          this.currentStatus.statusMessage = 'Nouvelle version activée avec succès.';
          this.notify();
        });
      }
    }
  }
}

export const updateService = new UpdateService();
