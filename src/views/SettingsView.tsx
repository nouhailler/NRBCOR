import React, { useState, useEffect } from 'react';
import { AppSettings, StorageDiagnostics } from '../services/storage/StorageRepository';
import { storageService, DEFAULT_SETTINGS } from '../services/storage/IndexedDbStorage';
import { useTranslation } from '../i18n/I18nContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

interface SettingsViewProps {
  onBack: () => void;
  onOpenWipeModal: () => void;
  onTriggerOnboarding: () => void;
  textScale: 'normal' | 'large' | 'extraLarge';
  onChangeTextScale: (scale: 'normal' | 'large' | 'extraLarge') => void;
  theme?: 'light' | 'dark' | 'system';
  onChangeTheme?: (theme: 'light' | 'dark' | 'system') => void;
  profileMode?: 'simplified' | 'expert';
  onChangeProfileMode?: (mode: 'simplified' | 'expert') => void;
  onDataReloaded?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onBack,
  onOpenWipeModal,
  onTriggerOnboarding,
  textScale,
  onChangeTextScale,
  theme = 'light',
  onChangeTheme,
  profileMode = 'simplified',
  onChangeProfileMode,
  onDataReloaded,
}) => {
  const { t, language } = useTranslation();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [diagnostics, setDiagnostics] = useState<StorageDiagnostics | null>(null);
  const [diagnosticsLoading, setDiagnosticsLoading] = useState(false);
  const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  const [easyReadMode, setEasyReadMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nrbcor_easy_read_mode') === 'true';
    } catch {}
    return false;
  });

  const toggleEasyRead = (enabled: boolean) => {
    setEasyReadMode(enabled);
    try {
      localStorage.setItem('nrbcor_easy_read_mode', enabled ? 'true' : 'false');
      if (enabled) {
        document.documentElement.classList.add('falc-mode');
      } else {
        document.documentElement.classList.remove('falc-mode');
      }
    } catch {}
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const refreshDiagnostics = async () => {
    setDiagnosticsLoading(true);
    try {
      const diag = await storageService.getDiagnostics();
      setDiagnostics(diag);
    } catch (e) {
      console.warn('Diagnostics error', e);
    } finally {
      setDiagnosticsLoading(false);
    }
  };

  useEffect(() => {
    storageService.getSettings().then((s) => {
      setSettings(s);
    });
    refreshDiagnostics();
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
    refreshDiagnostics();
  };

  const handleExportJSON = async () => {
    const backup = await storageService.exportAllData();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `NRBCOR_Sauvegarde_Unifiee_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    refreshDiagnostics();
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
          setImportStatus({
            message: language === 'fr'
              ? 'Restauration réussie ! Tous les magasins (Kit, Plan, Vivres, Préférences) ont été réinjectés.'
              : 'Restore successful! All stores (Kit, Plan, Food, Settings) restored.',
            isError: false
          });
          const refreshed = await storageService.getSettings();
          setSettings(refreshed);
          if (onDataReloaded) {
            onDataReloaded();
          }
          refreshDiagnostics();
        } else {
          setImportStatus({ message: res.error || (language === 'fr' ? 'Fichier JSON invalide' : 'Invalid JSON file'), isError: true });
        }
      } catch (err) {
        setImportStatus({
          message: language === 'fr'
            ? 'Erreur de lecture du fichier JSON (format corrompu)'
            : 'Error reading JSON file (corrupted format)',
          isError: true
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col w-full pt-20 pb-28 lg:pb-12 min-h-screen max-w-xl lg:max-w-5xl mx-auto px-4 sm:px-6 gap-4">
      {/* Sentinel bar */}
      <div className="w-full bg-navy text-white py-2 px-3 rounded-lg flex items-center justify-between border border-ink">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[18px] text-ok-bright">settings</span>
          <span className="font-label text-[11px] font-bold uppercase tracking-wider truncate">
            {t('settings.title')} & {t('common.zeroCloud')}
          </span>
        </div>
        <span className="font-label text-[10px] bg-ok-soft text-ok-ink px-2 py-0.5 rounded font-bold uppercase">
          {language === 'fr' ? 'ÉCRAN L' : 'SCREEN L'}
        </span>
      </div>

      {/* Return button */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          type="button"
          className="h-12 px-3 bg-tint hover:bg-tint text-ink font-label text-[12px] font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>{t('common.back').toUpperCase()}</span>
        </button>
        {saveToast && (
          <span className="font-label text-[11px] bg-ok-soft text-ok-ink px-3 py-1.5 rounded font-bold animate-fade-in">
            {language === 'fr' ? 'Enregistré en local ✓' : 'Saved locally ✓'}
          </span>
        )}
      </div>

      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-[24px] text-ink font-bold tracking-tight">
          {t('settings.title')}
        </h1>
        <p className="text-[13px] text-ink-muted leading-relaxed">
          {language === 'fr'
            ? 'Personnalisez le calcul de vos réserves d\'urgence, l\'accessibilité visuelle, la langue et gérez l\'archivage de vos données locales.'
            : 'Customize emergency reserve calculations, visual accessibility, language and manage local sovereign data archiving.'}
        </p>
      </header>

      {/* Section 0 : Langue de l'application (Internationalisation FR / EN) */}
      <section className="bg-card p-4 rounded-xl border border-line-strong shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1 border-b border-line">
          <h2 className="text-[16px] font-bold text-ink flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-ink">language</span>
            <span>{t('settings.language')}</span>
          </h2>
          <span className="font-label text-[10px] bg-subtle text-brand-ink px-2 py-0.5 rounded font-bold uppercase">
            {language === 'fr' ? 'Bilingue FR/EN' : 'Bilingual FR/EN'}
          </span>
        </div>
        <p className="text-[12px] text-ink-muted leading-relaxed">
          {language === 'fr'
            ? 'Choisissez votre langue d\'utilisation. Les traductions sont stockées localement et fonctionnent à 100% hors-ligne.'
            : 'Select your interface language. Translations are stored locally and work 100% offline.'}
        </p>
        <LanguageSwitcher variant="full" />
      </section>

      {/* Section 1 : Configuration du foyer */}
      <section className="bg-card p-4 rounded-xl border border-line-strong shadow-sm flex flex-col gap-3">
        <h2 className="text-[16px] font-bold text-ink flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-ink">family_restroom</span>
          <span>{t('settings.household')}</span>
        </h2>

        <div>
          <label className="text-[12px] font-bold text-ink-muted uppercase font-label block mb-1">
            {t('settings.householdSize')} : {settings.householdSize}
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleUpdate({ householdSize: num })}
                className={`min-h-[40px] rounded-lg font-label text-[12px] font-bold transition-all cursor-pointer ${
                  settings.householdSize === num
                    ? 'bg-navy text-white'
                    : 'bg-subtle text-ink'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[12px] font-bold text-ink-muted uppercase font-label block mb-1">
            {t('settings.autonomyHours')} : {settings.preparednessHours} {t('common.hours')}
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { h: 48, label: language === 'fr' ? '48 Heures (2j)' : '48 Hours (2d)' },
              { h: 72, label: language === 'fr' ? '72 Heures (3j)' : '72 Hours (3d)' },
              { h: 168, label: language === 'fr' ? '7 Jours' : '7 Days' }
            ].map((d) => (
              <button
                key={d.h}
                type="button"
                onClick={() => handleUpdate({ preparednessHours: d.h })}
                className={`min-h-[40px] rounded-lg font-label text-[11px] font-bold transition-all cursor-pointer ${
                  settings.preparednessHours === d.h
                    ? 'bg-navy text-white'
                    : 'bg-subtle text-ink'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[12px] font-bold text-ink-muted uppercase font-label block mb-1">
            {language === 'fr' ? 'Commune enregistrée :' : 'Registered municipality:'}
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
            className="w-full h-11 px-3 border border-line-strong rounded-lg text-[13px] text-ink focus:outline-none focus:border-brand-ink"
          />
        </div>
      </section>

      {/* Section : Niveau de Complexité & Profil Doctrinal */}
      <section className="bg-card p-4 rounded-xl border border-line-strong shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1 border-b border-line">
          <h2 className="text-[16px] font-bold text-ink flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-ink">tune</span>
            <span>{t('settings.profileMode')}</span>
          </h2>
          <span className="font-label text-[10px] bg-subtle text-brand-ink px-2 py-0.5 rounded font-bold uppercase">
            {profileMode === 'simplified' ? t('nav.simplified') : t('nav.expert')}
          </span>
        </div>

        <p className="text-[12px] text-ink-muted leading-relaxed">
          {language === 'fr'
            ? 'Adaptez le niveau d\'information et la profondeur technique selon votre situation ou votre fonction :'
            : 'Tailor information density and technical depth according to your operational role:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Option Grand Public */}
          <button
            type="button"
            onClick={() => {
              onChangeProfileMode?.('simplified');
              handleUpdate({ profileMode: 'simplified' });
            }}
            className={`p-3 rounded-xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
              profileMode === 'simplified'
                ? 'bg-subtle border-brand-ink ring-2 ring-brand-ink/20'
                : 'bg-canvas border-line-strong hover:border-brand-ink/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-[14px] text-ink">
                <span className="material-symbols-outlined text-brand-ink text-[20px]">person</span>
                <span>{t('nav.simplified')}</span>
              </div>
              {profileMode === 'simplified' && (
                <span className="w-2.5 h-2.5 rounded-full bg-brand"></span>
              )}
            </div>
            <p className="text-[11.5px] text-ink-muted leading-snug">
              {language === 'fr'
                ? 'Priorité aux 3 réflexes vitaux immédiats (Confinement, Radio, Pas d\'iode sans ordre). Fiches concises et scannables sans jargon technique.'
                : 'Priority on 3 vital immediate reflexes (Shelter-in-place, Radio, No iodine without orders). Concise, scannable cards without technical jargon.'}
            </p>
          </button>

          {/* Option Expert / Formateur */}
          <button
            type="button"
            onClick={() => {
              onChangeProfileMode?.('expert');
              handleUpdate({ profileMode: 'expert' });
            }}
            className={`p-3 rounded-xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
              profileMode === 'expert'
                ? 'bg-navy border-ink text-white ring-2 ring-ok-bright/30 shadow-xs'
                : 'bg-canvas border-line-strong hover:border-ink/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-[14px] text-inherit">
                <span className={`material-symbols-outlined text-[20px] ${profileMode === 'expert' ? 'text-ok-bright' : 'text-ink'}`}>school</span>
                <span>{t('nav.expert')}</span>
              </div>
              {profileMode === 'expert' && (
                <span className="w-2.5 h-2.5 rounded-full bg-ok-soft"></span>
              )}
            </div>
            <p className={`text-[11.5px] leading-snug ${profileMode === 'expert' ? 'text-on-navy-soft' : 'text-ink-muted'}`}>
              {language === 'fr'
                ? 'Références réglementaires précises (SGDSN, ASN/IRSN, CAS toxicologie, seuils dosimétriques mSv/Gray, zonages PPI/POI, notes pour formateurs).'
                : 'Precise regulatory references (SGDSN, ASN/IRSN, toxicology CAS, dosimetry thresholds mSv/Gray, PPI/POI zoning, notes for trainers).'}
            </p>
          </button>
        </div>
      </section>

      {/* Section 2 : Accessibilité Visuelle (A11Y-01) */}
      <section className="bg-card p-4 rounded-xl border border-line-strong shadow-sm flex flex-col gap-3">
        <h2 className="text-[16px] font-bold text-ink flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-ink">format_size</span>
          <span>{t('settings.textSize')} (WCAG AA)</span>
        </h2>
        <p className="text-[12px] text-ink-muted">
          {language === 'fr'
            ? 'Agrandissez la taille de la typographie pour une meilleure lisibilité sous stress ou sur petit écran :'
            : 'Scale typography size for optimal legibility under stress or on compact displays:'}
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'normal', label: language === 'fr' ? 'Normal (100%)' : 'Normal (100%)' },
            { id: 'large', label: language === 'fr' ? 'Grand (115%)' : 'Large (115%)' },
            { id: 'extraLarge', label: language === 'fr' ? 'Très Grand (130%)' : 'Extra Large (130%)' }
          ].map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => {
                onChangeTextScale(sc.id as any);
                handleUpdate({ textScale: sc.id as any });
              }}
              className={`min-h-[44px] rounded-lg font-label text-[12px] font-bold uppercase transition-all cursor-pointer ${
                textScale === sc.id
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-subtle text-ink'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>

        {/* Mode Lecture Facile (FALC) */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col min-w-0 pr-2">
            <span className="font-label text-[13px] font-bold text-ink flex items-center gap-1.5">
              <span className="material-symbols-outlined text-brand-ink text-[18px]">accessibility_new</span>
              {language === 'fr' ? 'Mode « Lecture Facile » (FALC)' : 'Easy-to-Read Mode (FALC)'}
            </span>
            <span className="text-[11px] text-ink-muted leading-snug">
              {language === 'fr'
                ? 'Vocabulaire simple, phrases courtes, contrastes renforcés et une action par écran pour personnes en situation de stress ou handicap cognitif.'
                : 'Simple vocabulary, short sentences, high contrast and single-action screen layout for high-stress or cognitive accessibility.'}
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={easyReadMode}
              onChange={(e) => toggleEasyRead(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-brand"></div>
          </label>
        </div>

        {/* Cibles tactiles et lecteurs d'écran */}
        <div className="p-2.5 bg-canvas rounded-lg border border-line text-[11px] text-ink-muted flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-ok-ink">check_circle</span>
          <span>{language === 'fr'
            ? 'Cibles tactiles conformes ≥ 48px • Balisage ARIA pour synthèse vocale et lecteurs d\'écran.'
            : 'Compliant touch targets ≥ 48px • Full ARIA semantics for screen readers and speech synthesis.'}</span>
        </div>
      </section>

      {/* Section 2b : Thème Clair / Sombre / Système */}
      {onChangeTheme && (
        <section className="bg-card p-4 rounded-xl border border-line-strong shadow-sm flex flex-col gap-3">
          <h2 className="text-[16px] font-bold text-ink flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-ink">palette</span>
            <span>{t('settings.theme')}</span>
          </h2>
          <p className="text-[12px] text-ink-muted">
            {language === 'fr'
              ? 'Basculez entre le Thème Clair (recommandé de jour et sous le soleil) et le Thème Sombre (confinement et faible luminosité) :'
              : 'Toggle between Light Theme (daylight and outdoor) and Dark Theme (sheltering and low-light battery saving):'}
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => onChangeTheme('light')}
              className={`min-h-[44px] rounded-lg font-label text-[12px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                theme === 'light'
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-subtle text-ink'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">light_mode</span>
              <span>{language === 'fr' ? 'Clair' : 'Light'}</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeTheme('dark')}
              className={`min-h-[44px] rounded-lg font-label text-[12px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-subtle text-ink'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">dark_mode</span>
              <span>{language === 'fr' ? 'Sombre' : 'Dark'}</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeTheme('system')}
              className={`min-h-[44px] rounded-lg font-label text-[12px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                theme === 'system'
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-subtle text-ink'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">settings_brightness</span>
              <span>Auto</span>
            </button>
          </div>
        </section>
      )}

      {/* Section 3 : Architecture & Santé de la Persistance Unifiée */}
      <section className="bg-card p-4 rounded-xl border border-line-strong shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-ink flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-ink">database</span>
            <span>{t('settings.storageStatus')}</span>
          </h2>
          <span className="font-label text-[10px] px-2 py-0.5 rounded bg-ok-soft text-ok-ink font-bold uppercase">
            {diagnostics?.activeEngine || (language === 'fr' ? 'IndexedDB Actif' : 'IndexedDB Active')}
          </span>
        </div>

        <div className="p-3 bg-ok-soft rounded-lg border border-ok-line flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-ok-ink text-[18px]">verified_user</span>
            <span className="text-[12px] font-bold text-ok-ink font-label uppercase">
              {language === 'fr' ? 'Stratégie de Fiabilisation à Deux Niveaux' : 'Dual-Tier Reliability Strategy'}
            </span>
          </div>
          <p className="text-[11px] text-ok-ink leading-relaxed">
            • <strong>IndexedDB ({language === 'fr' ? 'Niveau 1 - Autorité' : 'Tier 1 - Authority'})</strong> : {language === 'fr' ? 'Stockage asynchrone volumineux pour Kit 72h, Plan Familial, Inventaire et Géorisques. Zéro risque d\'éviction.' : 'Large asynchronous sovereign store for 72h Kit, Family Plan, Inventory, and Georisks. Zero eviction risk.'}<br />
            • <strong>{language === 'fr' ? 'Miroir Local (Niveau 2)' : 'Local Mirror (Tier 2)'}</strong> : {language === 'fr' ? 'Démarrage immédiat sans clignotement ni latence même hors-ligne.' : 'Instant boot without flicker or latency even completely offline.'}<br />
            • <strong>{language === 'fr' ? 'Zéro Transit Réseau' : 'Zero Network Transit'}</strong> : {language === 'fr' ? 'Aucune donnée personnelle ne quitte ce navigateur.' : 'No personal data ever leaves this device.'}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label text-[11px] uppercase font-bold text-ink-muted">
              {language === 'fr' ? 'État des Magasins de Données :' : 'Data Stores Status:'}
            </span>
            <button
              type="button"
              onClick={refreshDiagnostics}
              disabled={diagnosticsLoading}
              className="text-[11px] text-brand-ink font-label font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[14px] ${diagnosticsLoading ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{language === 'fr' ? 'Actualiser diagnostic' : 'Refresh diagnostics'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
            {diagnostics?.stores.map((store) => (
              <div
                key={store.name}
                className="p-2.5 rounded-lg border border-line bg-canvas flex items-center justify-between"
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="font-bold text-ink truncate">{store.label}</span>
                  <span className="text-[10px] text-ink-faint font-mono">{store.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-label font-bold text-ink text-[11px]">
                    {store.itemCount} {store.itemCount > 1 ? (language === 'fr' ? 'éléments' : 'items') : (language === 'fr' ? 'élément' : 'item')}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-ok"></span>
                </div>
              </div>
            ))}
          </div>

          {diagnostics?.quotaEstimate && (
            <div className="text-[11px] text-ink-faint flex items-center justify-between pt-1">
              <span>{language === 'fr' ? 'Espace alloué par le navigateur :' : 'Browser allocated storage:'}</span>
              <span className="font-mono font-semibold text-ink">
                {(diagnostics.quotaEstimate.usageBytes / (1024 * 1024)).toFixed(2)} MB / {(diagnostics.quotaEstimate.quotaBytes / (1024 * 1024 * 1024)).toFixed(1)} GB
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Section 4 : Sauvegarde & Restauration Intégrale Unifiée */}
      <section className="bg-card p-4 rounded-xl border border-line-strong shadow-sm flex flex-col gap-3">
        <h2 className="text-[16px] font-bold text-ink flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-ink">save</span>
          <span>{t('settings.exportBackup')} (Format V2)</span>
        </h2>
        <p className="text-[12px] text-ink-muted">
          {language === 'fr'
            ? 'Exportez une archive complète scellée (Kit 72h, Plan Familial, Inventaire, Paramètres) ou réinjectez une sauvegarde existante en cas de changement de terminal :'
            : 'Export a sealed complete backup archive (72h Kit, Family Plan, Inventory, Settings) or restore an existing backup:'}
        </p>

        {importStatus && (
          <div className={`p-3 rounded-lg text-[12px] font-semibold flex items-center gap-2 ${
            importStatus.isError ? 'bg-danger-soft text-danger-ink' : 'bg-ok-soft/50 text-ok-ink'
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
            className="min-h-[46px] rounded-lg bg-navy hover:bg-navy-2 text-white font-label text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>{t('settings.exportBackup')}</span>
          </button>

          <label className="min-h-[46px] rounded-lg bg-subtle hover:bg-tint text-ink font-label text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 border border-line cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">upload</span>
            <span>{t('settings.importBackup')}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        <div className="pt-2 border-t border-on-navy flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label text-[12px] font-bold text-ink">
              {language === 'fr' ? 'Cycle de vie des données du prototype' : 'Prototype data lifecycle'}
            </span>
            <span className="font-label text-[10px] bg-tint text-brand-ink px-2 py-0.5 rounded font-bold uppercase">
              100% Local
            </span>
          </div>
          <p className="text-[11px] text-ink-muted">
            {language === 'fr'
              ? 'Effacez toutes les données d\'exemple pour partir d\'une feuille blanche avec vos véritables informations, ou rechargez le scénario pédagogique :'
              : 'Wipe all demo sample data to start from a blank sovereign sheet, or reload the instructional simulation:'}
          </p>
          <button
            onClick={onOpenWipeModal}
            type="button"
            className="min-h-[44px] w-full rounded-lg bg-danger-soft/50 hover:bg-danger-soft text-danger-ink font-label text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 border border-danger-line transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            <span>{t('settings.wipeData')}</span>
          </button>
        </div>
      </section>

      {/* Section 5 : Mentions de Confidentialité & Limites Légales */}
      <section className="bg-navy-2 text-white p-4 rounded-xl border border-ink flex flex-col gap-2.5">
        <h2 className="text-[15px] font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-ok-bright">lock</span>
          <span>{language === 'fr' ? 'Charte de Confidentialité & Limites d\'Usage' : 'Privacy Charter & Operational Boundaries'}</span>
        </h2>
        <div className="flex flex-col gap-1.5 text-[12px] text-brand-bright leading-relaxed">
          <p>
            • <strong>{language === 'fr' ? 'Zéro serveur applicatif :' : 'Zero remote application servers:'}</strong> {language === 'fr' ? 'Aucune donnée personnelle, plan de famille ou inventaire ne quitte cet appareil.' : 'No personal data, family plan or inventory ever leaves this device.'}
          </p>
          <p>
            • <strong>{language === 'fr' ? 'Stockage IndexedDB souverain :' : 'Sovereign IndexedDB storage:'}</strong> {language === 'fr' ? 'Données conservées localement dans le profil de votre navigateur web.' : 'Data stored locally in your browser sandbox.'}
          </p>
          <p>
            • <strong>{language === 'fr' ? 'Limites officielles :' : 'Official civil boundaries:'}</strong> {language === 'fr' ? 'Cette application est un outil civique d\'information. Elle ne remplace pas les secours (15, 18, 112), ni les alertes officielles diffusées par les autorités.' : 'This app is a civic preparation aid. It never replaces emergency services (112, 911, 15, 18) or official government sirens and cell-broadcast alerts.'}
          </p>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-brand-bright font-label">
          <span>PWA Version : 1.2.0 (2026)</span>
          <span>Corpus Doctrinal : v2.4</span>
        </div>

        <button
          onClick={onTriggerOnboarding}
          type="button"
          className="mt-1 text-[11px] text-ok-bright underline font-label text-left cursor-pointer"
        >
          {language === 'fr' ? 'Revoir l\'écran de bienvenue initial' : 'Review initial onboarding tutorial'}
        </button>
      </section>
    </div>
  );
};
