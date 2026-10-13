import React, { useState, useEffect } from 'react';
import { updateService, SystemUpdateStatus } from '../services/updateService';
import { Tooltip } from '../components/Tooltip';

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

  useEffect(() => {
    const unsub = updateService.subscribe((s) => setStatus(s));
    return unsub;
  }, []);

  const handleManualCheck = async () => {
    const res = await updateService.checkForUpdates(true);
    setToastMessage(res.statusMessage);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleForceUpdate = async () => {
    await updateService.forceUpdate();
  };

  return (
    <div className="flex flex-col w-full pt-20 pb-28 min-h-screen max-w-xl mx-auto px-4 gap-4">
      {/* Sentinel bar */}
      <div className="w-full bg-[#001126] text-white py-2 px-3 rounded-lg flex items-center justify-between border border-[#12263f]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[18px] text-[#98f6c5]">system_update</span>
          <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider truncate">
            Paramètres Système & Mises à Jour
          </span>
        </div>
        <span className="font-['Space_Grotesk'] text-[10px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-bold uppercase">
          PWA V1.2.0
        </span>
      </div>

      {/* Return button & install shortcut */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          type="button"
          className="h-12 px-3 bg-[#dce9fd] hover:bg-[#d6e4f8] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold rounded flex items-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>RETOUR</span>
        </button>
        {onInstallClick && (
          <button
            onClick={onInstallClick}
            type="button"
            className="h-12 px-3.5 bg-[#001126] hover:bg-[#12263f] text-white font-['Space_Grotesk'] text-[11px] font-bold rounded flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">install_mobile</span>
            <span>Installer l'application</span>
          </button>
        )}
      </div>

      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-[24px] text-[#001126] font-bold tracking-tight">
          Système & Mises à Jour Automatiques
        </h1>
        <p className="text-[13px] text-[#44474d] leading-relaxed">
          Surveillance continue des versions, fraîcheur des fiches réflexes et contrôle du moteur hors-ligne PWA.
        </p>
      </header>

      {/* Notification Toast */}
      {toastMessage && (
        <div className="p-3 bg-[#001126] text-[#98f6c5] rounded-xl border border-[#005236] text-[12px] font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Bloc Choix du Thème : Clair / Sombre / Système */}
      {onChangeTheme && (
        <section className="bg-white p-4 rounded-xl border border-[#c4c6ce] shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#001126] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0036ce]">palette</span>
              <span>Thème d'Affichage Visuel</span>
            </h2>
            <Tooltip
              title="Thème Clair vs Sombre"
              content="Le thème Clair offre une lisibilité maximale en plein soleil ou en déplacement extérieur. Le thème Sombre favorise l'autonomie de batterie et la discrétion en pièce confinée."
            />
          </div>

          <p className="text-[12px] text-[#44474d] leading-relaxed">
            Choisissez l'apparence de l'application adaptée à vos conditions d'utilisation :
          </p>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onChangeTheme('light')}
              className={`min-h-[46px] rounded-xl font-['Space_Grotesk'] text-[12px] font-bold uppercase flex flex-col items-center justify-center gap-1 transition-all ${
                theme === 'light'
                  ? 'bg-[#001126] text-white shadow-sm ring-2 ring-[#001126]'
                  : 'bg-[#f0f4f9] hover:bg-[#e4efff] text-[#001126] border border-[#c4c6ce]'
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
              className={`min-h-[46px] rounded-xl font-['Space_Grotesk'] text-[12px] font-bold uppercase flex flex-col items-center justify-center gap-1 transition-all ${
                theme === 'dark'
                  ? 'bg-[#001126] text-white shadow-sm ring-2 ring-[#001126]'
                  : 'bg-[#f0f4f9] hover:bg-[#e4efff] text-[#001126] border border-[#c4c6ce]'
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
              className={`min-h-[46px] rounded-xl font-['Space_Grotesk'] text-[12px] font-bold uppercase flex flex-col items-center justify-center gap-1 transition-all ${
                theme === 'system'
                  ? 'bg-[#001126] text-white shadow-sm ring-2 ring-[#001126]'
                  : 'bg-[#f0f4f9] hover:bg-[#e4efff] text-[#001126] border border-[#c4c6ce]'
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

      {/* 2. Bloc Informations de Version, Date de Sortie & Dernière Vérification */}
      <section className="bg-white p-4 rounded-xl border border-[#c4c6ce] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#001126] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0036ce]">verified</span>
            <span>Version & Cycle de Publication</span>
          </h2>
          <span className="font-['Space_Grotesk'] text-[11px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-bold">
            ACTIF
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
          <div className="p-3 bg-[#eef4ff] rounded-lg border border-[#d6e4f8] flex flex-col gap-0.5">
            <span className="text-[#44474d] text-[11px] font-['Space_Grotesk'] uppercase font-semibold">
              Date de sortie officielle :
            </span>
            <span className="text-[15px] font-bold text-[#001126] font-['Space_Grotesk']">
              {status.releaseDate}
            </span>
            <span className="text-[10px] text-[#3f9d73] font-bold">Version v1.2.0 PWA Stable</span>
          </div>

          <div className="p-3 bg-[#eef4ff] rounded-lg border border-[#d6e4f8] flex flex-col gap-0.5">
            <span className="text-[#44474d] text-[11px] font-['Space_Grotesk'] uppercase font-semibold">
              Date de la dernière vérification :
            </span>
            <span className="text-[14px] font-bold text-[#001126] font-['Space_Grotesk']">
              {status.lastCheckedDate || 'À l\'instant'}
            </span>
            <span className="text-[10px] text-[#44474d]">Automatique en arrière-plan</span>
          </div>
        </div>

        {/* Message de statut */}
        <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#c4c6ce] flex items-center gap-2 text-[12px] text-[#0f1c2b]">
          <span className={`material-symbols-outlined text-[18px] ${status.isChecking ? 'animate-spin text-[#0036ce]' : 'text-[#3f9d73]'}`}>
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
            className="min-h-[46px] rounded-xl bg-[#001126] hover:bg-[#12263f] disabled:opacity-50 text-white font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span className={`material-symbols-outlined text-[18px] ${status.isChecking ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>Vérifier les mises à jour</span>
          </button>

          <button
            onClick={handleForceUpdate}
            type="button"
            className="min-h-[46px] rounded-xl bg-[#e4efff] hover:bg-[#dce9fd] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-[#c4c6ce]"
          >
            <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">
              restart_alt
            </span>
            <span>Forcer la mise à jour</span>
          </button>
        </div>
      </section>

      {/* 3. Mises à Jour Automatiques en Arrière-Plan */}
      <section className="bg-white p-4 rounded-xl border border-[#c4c6ce] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0036ce]">autorenew</span>
            <h2 className="text-[15px] font-bold text-[#001126]">
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
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-[#001126]"></div>
          </label>
        </div>

        <p className="text-[12px] text-[#44474d] leading-relaxed">
          Le Service Worker vérifie périodiquement toutes les 15 minutes et lors de chaque retour en ligne la disponibilité d'une nouvelle version ou de fiches doctrinales actualisées, et les installe automatiquement en tâche de fond sans perturber votre navigation.
        </p>

        <div className="p-2.5 bg-[#f8fffb] rounded-lg border border-[#98f6c5] flex items-center gap-2 text-[11px] text-[#005236] font-medium">
          <span className="material-symbols-outlined text-[16px]">security_update_good</span>
          <span>Surveillance d'arrière-plan active via Service Worker Cache-First (`/sw.js`).</span>
        </div>
      </section>

      {/* 4. Guide & Bouton Installation PWA pour utilisateurs novices */}
      <section className="bg-white p-4 rounded-xl border border-[#c4c6ce] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-[#001126] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0036ce]">add_to_home_screen</span>
            <span>Installer l'application sur l'écran d'accueil</span>
          </h2>
          <Tooltip
            title="Pourquoi installer l'application ?"
            content="L'installation permet d'accéder à NRBCOR en 1 clic sans ouvrir votre navigateur web, en plein écran, avec conservation intégrale du stockage hors-ligne sans risque de vidage par le navigateur."
          />
        </div>

        <p className="text-[12px] text-[#44474d] leading-relaxed">
          Très pratique pour les utilisateurs novices : ajoutez NRBCOR directement sur l'écran de votre mobile ou sur le bureau de votre ordinateur pour un accès instantané en cas d'urgence.
        </p>

        <div className="grid grid-cols-1 gap-2 text-[12px]">
          <div className="p-2.5 bg-[#f8f9ff] rounded-lg border border-[#e4efff] flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#001126] shrink-0">phone_android</span>
            <div>
              <strong className="text-[#001126] block">Sur Android / Chrome :</strong>
              <span className="text-[#44474d]">Appuyez sur le menu (⋮) puis sur <em>« Installer l'application »</em> ou <em>« Ajouter à l'écran d'accueil »</em>.</span>
            </div>
          </div>

          <div className="p-2.5 bg-[#f8f9ff] rounded-lg border border-[#e4efff] flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#001126] shrink-0">phone_iphone</span>
            <div>
              <strong className="text-[#001126] block">Sur iPhone / Safari :</strong>
              <span className="text-[#44474d]">Appuyez sur le bouton Partager (<span className="font-bold">⎋ icône carré avec flèche vers le haut</span>) puis choisissez <em>« Sur l'écran d'accueil »</em>.</span>
            </div>
          </div>

          <div className="p-2.5 bg-[#f8f9ff] rounded-lg border border-[#e4efff] flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#001126] shrink-0">laptop</span>
            <div>
              <strong className="text-[#001126] block">Sur Ordinateur (Chrome, Edge, Brave) :</strong>
              <span className="text-[#44474d]">Cliquez sur la petite icône d'installation dans la barre d'adresse à droite.</span>
            </div>
          </div>
        </div>

        {onInstallClick && (
          <button
            onClick={onInstallClick}
            type="button"
            className="w-full min-h-[46px] rounded-xl bg-[#001126] hover:bg-[#12263f] text-white font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center justify-center gap-2 shadow-sm transition-colors mt-1"
          >
            <span className="material-symbols-outlined text-[20px]">install_mobile</span>
            <span>Installer l'application maintenant</span>
          </button>
        )}
      </section>
    </div>
  );
};
