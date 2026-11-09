import React, { useState, useEffect } from 'react';
import { updateService, SystemUpdateStatus } from '../services/updateService';
import { Tooltip } from '../components/Tooltip';
import { runOfflinePreparationAudit, OfflineAuditResult } from '../services/storage/offlineAuditService';

interface SystemSettingsViewProps {
  onBack: () => void;
  onInstallClick?: () => void;
  canInstall?: boolean;
  theme?: 'light' | 'dark' | 'system';
  onChangeTheme?: (t: 'light' | 'dark' | 'system') => void;
}

export const SystemSettingsView: React.FC<SystemSettingsViewProps> = ({
  onBack,
  onInstallClick,
  canInstall = false,
  theme = 'light',
  onChangeTheme,
}) => {
  const [status, setStatus] = useState<SystemUpdateStatus>(updateService.getStatus());
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Offline Audit State
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditResult, setAuditResult] = useState<OfflineAuditResult | null>(null);

  // Territorial and local cache metadata
  const [territorialCacheDate, setTerritorialCacheDate] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const unsub = updateService.subscribe((s) => setStatus(s));

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check last cached commune
    try {
      const keys = Object.keys(localStorage);
      const georisquesKeys = keys.filter((k) => k.startsWith('georisques_cache_'));
      if (georisquesKeys.length > 0) {
        const lastData = localStorage.getItem(georisquesKeys[0]);
        if (lastData) {
          const parsed = JSON.parse(lastData);
          if (parsed.retrievedAt) {
            const d = new Date(parsed.retrievedAt);
            setTerritorialCacheDate(`${d.toLocaleDateString('fr-FR')} à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`);
          }
        }
      }
    } catch {}

    return () => {
      unsub();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualCheck = async () => {
    const res = await updateService.checkForUpdates(true);
    setToastMessage(res.statusMessage);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleForceUpdate = async () => {
    await updateService.forceUpdate();
  };

  const handleRunAudit = async () => {
    setAuditRunning(true);
    try {
      const res = await runOfflinePreparationAudit();
      setAuditResult(res);
    } finally {
      setAuditRunning(false);
    }
  };

  return (
    <div className="flex flex-col w-full pt-20 pb-28 lg:pb-12 min-h-screen max-w-xl lg:max-w-5xl mx-auto px-4 sm:px-6 gap-4">
      {/* Sentinel bar */}
      <div className="w-full bg-navy text-white py-2 px-3 rounded-lg flex items-center justify-between border border-ink">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[18px] text-ok-bright">system_update</span>
          <span className="font-label text-[11px] font-bold uppercase tracking-wider truncate">
            Paramètres Système & Diagnostic Hors-Ligne
          </span>
        </div>
        <span className="font-label text-[10px] bg-ok-soft text-ok-ink px-2 py-0.5 rounded font-bold uppercase">
          PWA V1.2.0
        </span>
      </div>

      {/* Return button & install shortcut */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          type="button"
          className="h-12 px-3 bg-tint hover:bg-tint text-ink font-label text-[12px] font-bold rounded flex items-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>RETOUR</span>
        </button>
        {onInstallClick && (
          <button
            onClick={onInstallClick}
            type="button"
            className="h-12 px-3.5 bg-navy hover:bg-navy-2 text-white font-label text-[11px] font-bold rounded flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">install_mobile</span>
            <span>Installer l'application</span>
          </button>
        )}
      </div>

      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-[24px] text-ink font-bold tracking-tight">
          Système & Diagnostic Hors-Ligne
        </h1>
        <p className="text-[13px] text-ink-muted leading-relaxed">
          Contrôle de la disponibilité 100% autonome, intégrité des caches, fraîcheur des données locales et politique d'éviction du navigateur.
        </p>
      </header>

      {/* Notification Toast */}
      {toastMessage && (
        <div className="p-3 bg-navy text-ok-bright rounded-xl border border-ok-ink text-[12px] font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SECTION 1 : TABLEAU DE BORD DE TRANSPARENCE HORS-LIGNE */}
      <section className="bg-card p-4 rounded-xl border border-line-strong shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-ink flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-ink">signal_wifi_statusbar_not_connected</span>
            <span>Transparence du Fonctionnement Hors-Ligne</span>
          </h2>
          <span className={`font-label text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
            isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {isOnline ? 'Connecté (Réseau actif)' : 'Mode Hors-Ligne Actif'}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-[12px]">
          {/* État 1 : Application disponible hors ligne */}
          <div className="p-2.5 rounded-lg border bg-gray-50 border-gray-200 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-ok-ink shrink-0 mt-0.5">offline_pin</span>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-ink">1. Application & Doctrine Hors-Ligne</span>
              <span className="text-ink-muted text-[11px]">
                Disponible et scellée dans l'appareil via Service Worker. 100% des guides de confinement, fiches réflexes et calculs locaux fonctionnent sans réseau.
              </span>
            </div>
          </div>

          {/* État 2 : Données locales disponibles */}
          <div className="p-2.5 rounded-lg border bg-gray-50 border-gray-200 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-ok-ink shrink-0 mt-0.5">inventory_2</span>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-ink">2. Données Personnelles Locales (IndexedDB)</span>
              <span className="text-ink-muted text-[11px]">
                Kit 72h, inventaire alimentaire, membres du foyer et plan d'urgence enregistrés sur cet appareil.
              </span>
            </div>
          </div>

          {/* État 3 : Données territoriales issues du cache */}
          <div className="p-2.5 rounded-lg border bg-canvas border-line flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-brand-ink shrink-0 mt-0.5">cached</span>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-ink">3. Risques Territoriaux (Géorisques)</span>
              <span className="text-ink-muted text-[11px]">
                {territorialCacheDate
                  ? `Dernière sauvegarde en cache local le ${territorialCacheDate}.`
                  : 'Aucune commune consultée et mise en cache pour le moment.'}
              </span>
            </div>
          </div>

          {/* État 4 : Sources externes indisponibles en cas de coupure */}
          <div className="p-2.5 rounded-lg border bg-amber-50/70 border-amber-200 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0 mt-0.5">cloud_off</span>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-amber-900">4. Sources Externes & API de l'État</span>
              <span className="text-amber-800 text-[11px]">
                {isOnline
                  ? 'Accessibles actuellement (Recherche de nouvelles communes et annuaire des mairies opérationnels).'
                  : 'Indisponibles hors réseau : seules les communes précédemment enregistrées en cache restent consultables.'}
              </span>
            </div>
          </div>

          {/* État 5 : Mises à jour */}
          <div className="p-2.5 rounded-lg border bg-gray-50 border-gray-200 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-ink shrink-0 mt-0.5">update</span>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-ink">5. Cycle de Mise à Jour de l'Application</span>
              <span className="text-ink-muted text-[11px]">
                {status.hasUpdate ? 'Une mise à jour a été téléchargée et attend son application.' : 'Version locale synchronisée et à jour avec le référentiel de production.'}
              </span>
            </div>
          </div>
        </div>

        {/* Bouton de Diagnostic Interactif */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleRunAudit}
            disabled={auditRunning}
            className="w-full min-h-[48px] bg-navy hover:bg-navy-2 text-white rounded-xl font-label text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <span className={`material-symbols-outlined text-[20px] ${auditRunning ? 'animate-spin' : 'text-ok-bright'}`}>
              {auditRunning ? 'sync' : 'network_check'}
            </span>
            <span>{auditRunning ? 'Diagnostic en cours...' : 'Vérifier ma préparation hors ligne'}</span>
          </button>
        </div>

        {/* Résultats du Diagnostic */}
        {auditResult && (
          <div className="mt-2 p-3.5 bg-subtle rounded-xl border border-line-strong flex flex-col gap-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[22px] ${
                  auditResult.overallStatus === 'prete' ? 'text-ok-ink' : 'text-amber-700'
                }`}>
                  {auditResult.overallStatus === 'prete' ? 'check_circle' : 'warning'}
                </span>
                <span className="font-label text-[13px] font-bold text-ink uppercase">
                  Score d'autonomie : {auditResult.readinessScore}%
                </span>
              </div>
              <span className={`font-label text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                auditResult.overallStatus === 'prete'
                  ? 'bg-ok-soft text-ok-ink'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {auditResult.overallStatus === 'prete' ? 'PRÊT POUR LE HORS-LIGNE' : 'AUTONOMIE PARTIELLE'}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {auditResult.items.map((item) => (
                <div key={item.id} className="p-2.5 bg-card rounded-lg border border-gray-200 text-[11px] flex flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink">{item.title}</span>
                    <span className={`font-label text-[10px] font-bold uppercase ${
                      item.status === 'ok' ? 'text-ok-ink' : item.status === 'warning' ? 'text-amber-700' : 'text-red-700'
                    }`}>
                      {item.status === 'ok' ? 'CONFORME' : item.status === 'warning' ? 'ATTENTION' : 'ERREUR'}
                    </span>
                  </div>
                  <p className="text-ink-muted">{item.summary}</p>
                  {item.details && <p className="text-gray-500 italic">{item.details}</p>}
                  {item.recommendation && (
                    <div className="mt-1 p-1.5 bg-amber-50 text-amber-900 rounded font-medium">
                      Conseil : {item.recommendation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Avertissement spécifique Safari iOS */}
            {auditResult.isSafariIos && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-900 leading-snug">
                <strong>Attention utilisateurs Safari iOS :</strong> Pour empêcher le navigateur d'effacer les fiches et vos stocks après 7 jours sans connexion, appuyez sur le bouton Partager (<span className="font-bold">⎋</span>) puis <strong>« Sur l'écran d'accueil »</strong>.
              </div>
            )}
          </div>
        )}
      </section>

      {/* SECTION 2 : Choix du Thème : Clair / Sombre / Système */}
      {onChangeTheme && (
        <section className="bg-card p-4 rounded-xl border border-line-strong shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-ink flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-ink">palette</span>
              <span>Thème d'Affichage Visuel</span>
            </h2>
            <Tooltip
              title="Thème Clair vs Sombre"
              content="Le thème Clair offre une lisibilité maximale en plein soleil. Le thème Sombre favorise l'autonomie de batterie et la discrétion en pièce confinée."
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onChangeTheme('light')}
              className={`min-h-[46px] rounded-xl font-label text-[12px] font-bold uppercase flex flex-col items-center justify-center gap-1 transition-all ${
                theme === 'light'
                  ? 'bg-navy text-white shadow-sm ring-2 ring-ink'
                  : 'bg-subtle hover:bg-tint text-ink border border-line-strong'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">light_mode</span>
                <span>Clair</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onChangeTheme('dark')}
              className={`min-h-[46px] rounded-xl font-label text-[12px] font-bold uppercase flex flex-col items-center justify-center gap-1 transition-all ${
                theme === 'dark'
                  ? 'bg-navy text-white shadow-sm ring-2 ring-ink'
                  : 'bg-subtle hover:bg-tint text-ink border border-line-strong'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">dark_mode</span>
                <span>Sombre</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onChangeTheme('system')}
              className={`min-h-[46px] rounded-xl font-label text-[12px] font-bold uppercase flex flex-col items-center justify-center gap-1 transition-all ${
                theme === 'system'
                  ? 'bg-navy text-white shadow-sm ring-2 ring-ink'
                  : 'bg-subtle hover:bg-tint text-ink border border-line-strong'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">settings_brightness</span>
                <span>Auto</span>
              </div>
            </button>
          </div>
        </section>
      )}

      {/* SECTION 3 : Informations de Version & Contrôles Manuels */}
      <section className="bg-card p-4 rounded-xl border border-line-strong shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-ink flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-ink">verified</span>
            <span>Version & Cycle de Publication</span>
          </h2>
          <span className="font-label text-[11px] bg-ok-soft text-ok-ink px-2 py-0.5 rounded font-bold">
            ACTIF
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
          <div className="p-3 bg-subtle rounded-lg border border-line flex flex-col gap-0.5">
            <span className="text-ink-muted text-[11px] font-label uppercase font-semibold">
              Date de sortie officielle :
            </span>
            <span className="text-[15px] font-bold text-ink font-label">
              {status.releaseDate}
            </span>
            <span className="text-[10px] text-ok-ink font-bold">Version v1.2.0 PWA Stable</span>
          </div>

          <div className="p-3 bg-subtle rounded-lg border border-line flex flex-col gap-0.5">
            <span className="text-ink-muted text-[11px] font-label uppercase font-semibold">
              Date de la dernière vérification :
            </span>
            <span className="text-[14px] font-bold text-ink font-label">
              {status.lastCheckedDate || 'À l\'instant'}
            </span>
            <span className="text-[10px] text-ink-muted">Automatique en arrière-plan</span>
          </div>
        </div>

        {/* Message de statut */}
        <div className="p-3 bg-canvas rounded-lg border border-line-strong flex items-center gap-2 text-[12px] text-ink">
          <span className={`material-symbols-outlined text-[18px] ${status.isChecking ? 'animate-spin text-brand-ink' : 'text-ok-ink'}`}>
            {status.isChecking ? 'sync' : 'cloud_done'}
          </span>
          <span className="font-medium">{status.statusMessage}</span>
        </div>

        {/* Boutons « Vérifier les mises à jour » et « Forcer la mise à jour » */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleManualCheck}
            disabled={status.isChecking}
            type="button"
            className="min-h-[46px] rounded-xl bg-navy hover:bg-navy-2 disabled:opacity-50 text-white font-label text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span className={`material-symbols-outlined text-[18px] ${status.isChecking ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>Vérifier les mises à jour</span>
          </button>

          <button
            onClick={handleForceUpdate}
            type="button"
            className="min-h-[46px] rounded-xl bg-tint hover:bg-tint text-ink font-label text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-line-strong"
          >
            <span className="material-symbols-outlined text-[18px] text-danger-ink">
              restart_alt
            </span>
            <span>Forcer la mise à jour</span>
          </button>
        </div>
      </section>

      {/* SECTION 4 : Mises à Jour Automatiques en Arrière-Plan */}
      <section className="bg-card p-4 rounded-xl border border-line-strong shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-ink">autorenew</span>
            <h2 className="text-[15px] font-bold text-ink">
              Mises à Jour Automatiques en Arrière-Plan
            </h2>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoUpdateEnabled}
              onChange={(e) => setAutoUpdateEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-navy"></div>
          </label>
        </div>

        <p className="text-[12px] text-ink-muted leading-relaxed">
          Le Service Worker vérifie périodiquement toutes les 15 minutes et lors de chaque retour en ligne la disponibilité d'une nouvelle version ou de fiches doctrinales actualisées, et les installe automatiquement en tâche de fond.
        </p>

        <div className="p-2.5 bg-ok-soft rounded-lg border border-ok-bright flex items-center gap-2 text-[11px] text-ok-ink font-medium">
          <span className="material-symbols-outlined text-[16px]">security_update_good</span>
          <span>Surveillance d'arrière-plan active via Service Worker Cache-First (`/sw.js`).</span>
        </div>
      </section>

      {/* SECTION 5 : Guide & Bouton Installation PWA pour utilisateurs novices */}
      <section className="bg-card p-4 rounded-xl border border-line-strong shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-ink flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-ink">add_to_home_screen</span>
            <span>Installer l'application sur l'écran d'accueil</span>
          </h2>
          <Tooltip
            title="Pourquoi installer l'application ?"
            content="L'installation permet d'accéder à NRBCOR en 1 clic sans ouvrir votre navigateur web, en plein écran, avec conservation intégrale du stockage hors-ligne sans risque de vidage par le navigateur."
          />
        </div>

        <p className="text-[12px] text-ink-muted leading-relaxed">
          Pour les urgences : ajoutez NRBCOR sur l'écran d'accueil de votre mobile ou sur le bureau pour un accès direct et pour empêcher Safari iOS de vider les données locales après 7 jours.
        </p>

        <div className="grid grid-cols-1 gap-2 text-[12px]">
          <div className="p-2.5 bg-canvas rounded-lg border border-line flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-ink shrink-0">phone_android</span>
            <div>
              <strong className="text-ink block">Sur Android / Chrome :</strong>
              <span className="text-ink-muted">Appuyez sur le menu (⋮) puis sur <em>« Installer l'application »</em> ou <em>« Ajouter à l'écran d'accueil »</em>.</span>
            </div>
          </div>

          <div className="p-2.5 bg-canvas rounded-lg border border-line flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-ink shrink-0">phone_iphone</span>
            <div>
              <strong className="text-ink block">Sur iPhone / Safari :</strong>
              <span className="text-ink-muted">Appuyez sur le bouton Partager (<span className="font-bold">⎋ icône carré avec flèche</span>) puis choisissez <em>« Sur l'écran d'accueil »</em>.</span>
            </div>
          </div>

          <div className="p-2.5 bg-canvas rounded-lg border border-line flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-ink shrink-0">laptop</span>
            <div>
              <strong className="text-ink block">Sur Ordinateur (Chrome, Edge, Brave) :</strong>
              <span className="text-ink-muted">Cliquez sur la petite icône d'installation dans la barre d'adresse à droite.</span>
            </div>
          </div>
        </div>

        {onInstallClick && (
          <button
            onClick={onInstallClick}
            type="button"
            className="w-full min-h-[46px] rounded-xl bg-navy hover:bg-navy-2 text-white font-label text-[12px] font-bold uppercase flex items-center justify-center gap-2 shadow-sm transition-colors mt-1"
          >
            <span className="material-symbols-outlined text-[20px]">install_mobile</span>
            <span>Installer l'application maintenant</span>
          </button>
        )}
      </section>
    </div>
  );
};
