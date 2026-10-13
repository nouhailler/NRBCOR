import React, { useState, useEffect } from 'react';
import { AppSettings } from '../services/storage/StorageRepository';
import { storageService, DEFAULT_SETTINGS } from '../services/storage/IndexedDbStorage';

interface SettingsViewProps {
  onBack: () => void;
  onOpenWipeModal: () => void;
  onTriggerOnboarding: () => void;
  textScale: 'normal' | 'large' | 'extraLarge';
  onChangeTextScale: (scale: 'normal' | 'large' | 'extraLarge') => void;
  theme?: 'light' | 'dark' | 'system';
  onChangeTheme?: (theme: 'light' | 'dark' | 'system') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onBack,
  onOpenWipeModal,
  onTriggerOnboarding,
  textScale,
  onChangeTextScale,
  theme = 'light',
  onChangeTheme,
}) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    storageService.getSettings().then((s) => {
      setSettings(s);
    });
  }, []);

  const handleUpdate = async (patch: Partial<AppSettings>) => {
    const updated: AppSettings = {
      ...settings,
      ...patch,
      updatedAt: new Date().toISOString()
    };
    setSettings(updated);
    await storageService.saveSettings(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleExportJSON = async () => {
    const backup = await storageService.exportAllData();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `NRBCOR_Sauvegarde_Locale_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const res = await storageService.importAllData(json);
        if (res.success) {
          setImportStatus({ message: 'Restauration réussie ! Les données ont été actualisées.', isError: false });
          const refreshed = await storageService.getSettings();
          setSettings(refreshed);
        } else {
          setImportStatus({ message: res.error || 'Fichier JSON invalide', isError: true });
        }
      } catch (err) {
        setImportStatus({ message: 'Erreur de lecture du fichier JSON (format corrompu)', isError: true });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col w-full pt-20 pb-28 min-h-screen max-w-xl mx-auto px-4 gap-4">
      {/* Sentinel bar */}
      <div className="w-full bg-[#001126] text-white py-2 px-3 rounded-lg flex items-center justify-between border border-[#12263f]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[18px] text-[#98f6c5]">settings</span>
          <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider truncate">
            Paramètres, Confidentialité & Stockage Local
          </span>
        </div>
        <span className="font-['Space_Grotesk'] text-[10px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-bold uppercase">
          ÉCRAN L
        </span>
      </div>

      {/* Return button */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          type="button"
          className="h-12 px-3 bg-[#dce9fd] hover:bg-[#d6e4f8] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold rounded flex items-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>RETOUR</span>
        </button>
        {saveToast && (
          <span className="font-['Space_Grotesk'] text-[11px] bg-[#98f6c5] text-[#005236] px-3 py-1.5 rounded font-bold animate-fade-in">
            Enregistré en local ✓
          </span>
        )}
      </div>

      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-[24px] text-[#001126] font-bold tracking-tight">
          Paramètres & Gestion des Données
        </h1>
        <p className="text-[13px] text-[#44474d] leading-relaxed">
          Personnalisez le calcul de vos réserves d'urgence, l'accessibilité visuelle et gérez l'archivage de vos données locales.
        </p>
      </header>

      {/* Section 1 : Configuration du foyer */}
      <section className="bg-white p-4 rounded-xl border border-[#c4c6ce] shadow-sm flex flex-col gap-3">
        <h2 className="text-[16px] font-bold text-[#001126] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0036ce]">family_restroom</span>
          <span>Paramètres du Foyer</span>
        </h2>

        <div>
          <label className="text-[12px] font-bold text-[#44474d] uppercase font-['Space_Grotesk'] block mb-1">
            Nombre de personnes à charge : {settings.householdSize}
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleUpdate({ householdSize: num })}
                className={`min-h-[40px] rounded-lg font-['Space_Grotesk'] text-[12px] font-bold transition-all ${
                  settings.householdSize === num
                    ? 'bg-[#001126] text-white'
                    : 'bg-[#f0f4f9] text-[#001126]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[12px] font-bold text-[#44474d] uppercase font-['Space_Grotesk'] block mb-1">
            Durée de préparation visée : {settings.preparednessHours} heures
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { h: 48, label: '48 Heures (2j)' },
              { h: 72, label: '72 Heures (3j)' },
              { h: 168, label: '7 Jours' }
            ].map((d) => (
              <button
                key={d.h}
                type="button"
                onClick={() => handleUpdate({ preparednessHours: d.h })}
                className={`min-h-[40px] rounded-lg font-['Space_Grotesk'] text-[11px] font-bold transition-all ${
                  settings.preparednessHours === d.h
                    ? 'bg-[#001126] text-white'
                    : 'bg-[#f0f4f9] text-[#001126]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[12px] font-bold text-[#44474d] uppercase font-['Space_Grotesk'] block mb-1">
            Commune enregistrée :
          </label>
          <input
            type="text"
            value={settings.savedCommune?.name || ''}
            onChange={(e) =>
              handleUpdate({
                savedCommune: {
                  ...settings.savedCommune,
                  name: e.target.value
                }
              })
            }
            className="w-full h-11 px-3 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126] focus:outline-none focus:border-[#0036ce]"
          />
        </div>
      </section>

      {/* Section 2 : Accessibilité Visuelle (A11Y-01) */}
      <section className="bg-white p-4 rounded-xl border border-[#c4c6ce] shadow-sm flex flex-col gap-3">
        <h2 className="text-[16px] font-bold text-[#001126] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0036ce]">format_size</span>
          <span>Accessibilité & Taille du Texte (WCAG AA)</span>
        </h2>
        <p className="text-[12px] text-[#44474d]">
          Agrandissez la taille de la typographie pour une meilleure lisibilité sous stress ou sur petit écran :
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'normal', label: 'Normal (100%)' },
            { id: 'large', label: 'Grand (115%)' },
            { id: 'extraLarge', label: 'Très Grand (130%)' }
          ].map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => {
                onChangeTextScale(sc.id as any);
                handleUpdate({ textScale: sc.id as any });
              }}
              className={`min-h-[44px] rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase transition-all ${
                textScale === sc.id
                  ? 'bg-[#0036ce] text-white shadow-sm'
                  : 'bg-[#f0f4f9] text-[#001126]'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </section>

      {/* Section 2b : Thème Clair / Sombre / Système */}
      {onChangeTheme && (
        <section className="bg-white p-4 rounded-xl border border-[#c4c6ce] shadow-sm flex flex-col gap-3">
          <h2 className="text-[16px] font-bold text-[#001126] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0036ce]">palette</span>
            <span>Thème Visuel (Mode Clair / Sombre)</span>
          </h2>
          <p className="text-[12px] text-[#44474d]">
            Basculez entre le Thème Clair (recommandé de jour et sous le soleil) et le Thème Sombre (confinement et faible luminosité) :
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => onChangeTheme('light')}
              className={`min-h-[44px] rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                theme === 'light'
                  ? 'bg-[#001126] text-white shadow-sm'
                  : 'bg-[#f0f4f9] text-[#001126]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">light_mode</span>
              <span>Clair</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeTheme('dark')}
              className={`min-h-[44px] rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                theme === 'dark'
                  ? 'bg-[#001126] text-white shadow-sm'
                  : 'bg-[#f0f4f9] text-[#001126]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">dark_mode</span>
              <span>Sombre</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeTheme('system')}
              className={`min-h-[44px] rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                theme === 'system'
                  ? 'bg-[#001126] text-white shadow-sm'
                  : 'bg-[#f0f4f9] text-[#001126]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">settings_brightness</span>
              <span>Auto</span>
            </button>
          </div>
        </section>
      )}

      {/* Section 3 : Sauvegarde & Import / Export Local (SEC-02) */}
      <section className="bg-white p-4 rounded-xl border border-[#c4c6ce] shadow-sm flex flex-col gap-3">
        <h2 className="text-[16px] font-bold text-[#001126] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0036ce]">save</span>
          <span>Gestion des Données Locales (Sans Cloud)</span>
        </h2>
        <p className="text-[12px] text-[#44474d]">
          Exportez un fichier de sauvegarde au format JSON sur votre appareil, ou restaurez un fichier existant :
        </p>

        {importStatus && (
          <div className={`p-3 rounded-lg text-[12px] font-semibold flex items-center gap-2 ${
            importStatus.isError ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#98f6c5]/50 text-[#005236]'
          }`}>
            <span className="material-symbols-outlined text-[18px]">
              {importStatus.isError ? 'error' : 'check_circle'}
            </span>
            <span>{importStatus.message}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExportJSON}
            type="button"
            className="min-h-[46px] rounded-lg bg-[#001126] hover:bg-[#12263f] text-white font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Exporter JSON</span>
          </button>

          <label className="min-h-[46px] rounded-lg bg-[#eef4ff] hover:bg-[#e4efff] text-[#001126] font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 border border-[#d6e4f8] cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">upload</span>
            <span>Importer JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        <button
          onClick={onOpenWipeModal}
          type="button"
          className="min-h-[44px] w-full rounded-lg bg-[#ffdad6]/40 hover:bg-[#ffdad6] text-[#ba1a1a] font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 border border-[#ffdad6] transition-colors mt-1"
        >
          <span className="material-symbols-outlined text-[18px]">delete_forever</span>
          <span>Purger toutes les données locales</span>
        </button>
      </section>

      {/* Section 4 : Mentions de Confidentialité & Limites Légales (Section 9.5) */}
      <section className="bg-[#12263f] text-white p-4 rounded-xl border border-[#001126] flex flex-col gap-2.5">
        <h2 className="text-[15px] font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[#98f6c5]">lock</span>
          <span>Charte de Confidentialité & Limites d'Usage</span>
        </h2>
        <div className="flex flex-col gap-1.5 text-[12px] text-[#d4e3ff] leading-relaxed">
          <p>
            • <strong>Zéro serveur applicatif :</strong> Aucune donnée personnelle, plan de famille ou inventaire ne quitte cet appareil.
          </p>
          <p>
            • <strong>Stockage IndexedDB :</strong> Données conservées localement dans le profil de votre navigateur web.
          </p>
          <p>
            • <strong>Limites officielles :</strong> Cette application est un outil civique d'information. Elle ne remplace pas les secours (15, 18, 112), ni les alertes officielles diffusées par les autorités.
          </p>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#b4c8e8] font-['Space_Grotesk']">
          <span>PWA Version : 1.0 (Octobre 2026)</span>
          <span>Corpus Doctrinal : v2.4</span>
        </div>

        <button
          onClick={onTriggerOnboarding}
          type="button"
          className="mt-1 text-[11px] text-[#98f6c5] underline font-['Space_Grotesk'] text-left"
        >
          Revoir l'écran de bienvenue initial
        </button>
      </section>
    </div>
  );
};
