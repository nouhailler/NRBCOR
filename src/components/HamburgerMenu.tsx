import React from 'react';
import { TabType, SubScreen } from '../types';
import { NuclearPowerIcon } from './icons/NuclearPowerIcon';
import { useTranslation } from '../i18n/I18nContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenSubScreen: (screen: SubScreen) => void;
  onInstallClick?: () => void;
  canInstall?: boolean;
  theme?: 'light' | 'dark' | 'system';
  onChangeTheme?: (theme: 'light' | 'dark' | 'system') => void;
  onTriggerOnboarding?: () => void;
  onOpenWipeModal?: () => void;
  onStartTour?: () => void;
  profileMode?: 'simplified' | 'expert';
  onChangeProfileMode?: (mode: 'simplified' | 'expert') => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenSubScreen,
  onInstallClick,
  canInstall = false,
  theme = 'light',
  onChangeTheme,
  onTriggerOnboarding,
  onOpenWipeModal,
  onStartTour,
  profileMode = 'simplified',
  onChangeProfileMode,
}) => {
  const { t, language } = useTranslation();

  // Fermeture au clavier (Échap)
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectTab = (tab: TabType) => {
    onNavigateTab(tab);
    onClose();
  };

  const handleSelectSub = (screen: SubScreen) => {
    onOpenSubScreen(screen);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={language === 'fr' ? 'Menu de navigation' : 'Navigation menu'}
      className="fixed inset-0 z-50 flex bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-sm bg-canvas text-ink h-full shadow-2xl flex flex-col border-r border-line-strong overflow-hidden animate-in slide-in-from-left duration-250"
      >
        {/* Header Drawer */}
        <div className="bg-navy text-white p-4 flex items-center justify-between border-b border-ink">
          <div className="flex items-center gap-2.5">
            <img src="/icon.svg" alt="" aria-hidden="true" className="h-9 w-9" />
            <div className="flex flex-col">
              <span className="font-label text-[15px] font-bold tracking-wide">
                {language === 'fr' ? 'MENU GLOBAL' : 'MAIN MENU'}
              </span>
              <span className="font-label text-[10px] text-ok-bright uppercase tracking-wider font-semibold">
                ● {t('common.zeroCloud')}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('common.close')}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Bouton Installer PWA */}
        {onInstallClick && (
          <div className="p-3 bg-tint border-b border-brand-bright">
            <button
              onClick={() => {
                onInstallClick();
                onClose();
              }}
              type="button"
              className="w-full min-h-[44px] bg-brand-strong hover:bg-brand text-white rounded-xl font-label text-[12px] uppercase font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">install_mobile</span>
              <span>{t('home.installTitle')}</span>
            </button>
          </div>
        )}

        {/* Sélecteur de Langue (FR / EN) & Thème */}
        <div className="p-3 bg-card border-b border-line-strong flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-label text-[11px] font-bold uppercase text-ink-muted flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">language</span>
              {t('nav.language')}
            </span>
          </div>
          <LanguageSwitcher variant="full" />

          {onChangeTheme && (
            <div className="pt-2 border-t border-line flex items-center justify-between gap-2">
              <span className="font-label text-[11px] font-bold uppercase text-ink-muted flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">palette</span>
                {t('nav.theme')} :
              </span>
              <div className="flex items-center gap-1 bg-subtle p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => onChangeTheme('light')}
                  className={`px-2.5 py-1 rounded text-[11px] font-label font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-navy text-white shadow-xs'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">light_mode</span>
                  <span>{language === 'fr' ? 'Clair' : 'Light'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeTheme('dark')}
                  className={`px-2.5 py-1 rounded text-[11px] font-label font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-navy text-white shadow-xs'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">dark_mode</span>
                  <span>{language === 'fr' ? 'Sombre' : 'Dark'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeTheme('system')}
                  className={`px-2.5 py-1 rounded text-[11px] font-label font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    theme === 'system'
                      ? 'bg-navy text-white shadow-xs'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">settings_brightness</span>
                  <span>Auto</span>
                </button>
              </div>
            </div>
          )}

          {onChangeProfileMode && (
            <div className="pt-2 border-t border-line flex items-center justify-between gap-2">
              <span className="font-label text-[11px] font-bold uppercase text-ink-muted flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]" aria-hidden="true">badge</span>
                {t('nav.profileMode')} :
              </span>
              <div className="flex items-center gap-1 bg-subtle p-1 rounded-lg" role="group" aria-label={t('nav.profileMode')}>
                {(['simplified', 'expert'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={profileMode === mode}
                    onClick={() => onChangeProfileMode(mode)}
                    className={`px-2.5 py-1 rounded text-[11px] font-label font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      profileMode === mode ? 'bg-navy text-white shadow-xs' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]" aria-hidden="true">{mode === 'simplified' ? 'person' : 'school'}</span>
                    <span>{mode === 'simplified' ? t('nav.simplified') : t('nav.expert')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 text-[13px]">
          {/* Catégorie 1: Urgence Immédiate */}
          <div className="flex flex-col gap-1.5">
            <span className="font-label text-[11px] font-bold uppercase tracking-wider text-danger-ink flex items-center gap-1.5 px-1">
              <span className="material-symbols-outlined text-[16px]">emergency</span>
              {t('menu.catUrgence')}
            </span>
            <div className="flex flex-col gap-1 bg-card rounded-xl p-1.5 border border-danger-line shadow-xs">
              <button
                onClick={() => handleSelectSub({ type: 'mode-crise' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left bg-danger-soft hover:bg-danger-soft text-danger-ink-strong font-black transition-colors border border-danger-bright cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-danger-ink">crisis_alert</span>
                <span>{t('menu.modeCrise')}</span>
              </button>
              <button
                onClick={() => handleSelectTab('reagir')}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-danger-soft/40 text-danger-ink-strong font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-danger-ink">bolt</span>
                <span>{t('menu.reagirNow')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'deshabillage' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-subtle text-ink transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-ok-ink">sanitizer</span>
                <span>{t('menu.deshabillage')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'confinement-guide' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-subtle text-ink transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-brand-ink">meeting_room</span>
                <span>{t('menu.confinement')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'siren-guide' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-subtle text-ink transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-danger-ink">campaign</span>
                <span>{t('menu.siren')}</span>
              </button>
            </div>
          </div>

          {/* Catégorie 2: Doctrines & Risques NRBC */}
          <div className="flex flex-col gap-1.5">
            <span className="font-label text-[11px] font-bold uppercase tracking-wider text-brand-ink flex items-center gap-1.5 px-1">
              <span className="material-symbols-outlined text-[16px]">shield</span>
              {t('menu.catDoctrines')}
            </span>
            <div className="flex flex-col gap-1 bg-card rounded-xl p-1.5 border border-line-strong shadow-xs">
              <button
                onClick={() => handleSelectTab('guides')}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-subtle text-brand-ink font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
                <span>{t('menu.allGuides')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'protocol', id: 'nucleaire' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-subtle text-ink transition-colors cursor-pointer"
              >
                <NuclearPowerIcon className="w-[18px] h-[18px] text-danger-ink" />
                <span>{t('menu.ficheNucleaire')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'protocol', id: 'chimique' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-subtle text-ink transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-danger-ink">science</span>
                <span>{t('menu.ficheChimique')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'protocol', id: 'bio' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-subtle text-ink transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-ok-ink">coronavirus</span>
                <span>{t('menu.ficheBio')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'iode' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-subtle text-ink transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-danger-ink">medication</span>
                <span>{t('menu.ficheIode')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'encyclopedie', tab: 'histoire' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left bg-subtle hover:bg-tint text-brand-ink font-bold transition-colors border border-line mt-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-brand-ink">history_edu</span>
                <span>{t('menu.encyclopedia')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'encyclopedie', tab: 'glossaire' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left bg-canvas hover:bg-subtle text-ink font-semibold transition-colors border border-line cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-ok-ink">spellcheck</span>
                <span>{t('menu.glossary')}</span>
              </button>
            </div>
          </div>

          {/* Catégorie 3: Résilience & Préparation */}
          <div className="flex flex-col gap-1.5">
            <span className="font-label text-[11px] font-bold uppercase tracking-wider text-ok-ink flex items-center gap-1.5 px-1">
              <span className="material-symbols-outlined text-[16px]">backpack</span>
              {t('menu.catResilience')}
            </span>
            <div className="flex flex-col gap-1 bg-card rounded-xl p-1.5 border border-line-strong shadow-xs">
              <button
                onClick={() => handleSelectSub({ type: 'suis-je-pret' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left bg-subtle hover:bg-tint text-brand-ink font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-brand-ink">speed</span>
                <span>{t('menu.suisJePret')}</span>
              </button>
              <button
                onClick={() => handleSelectTab('preparation')}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-subtle text-ink font-semibold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-brand-ink">inventory_2</span>
                <span>{t('menu.kit72h')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'inventory' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-subtle text-ink transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-ink">receipt_long</span>
                <span>{t('menu.inventory')}</span>
              </button>
              <button
                onClick={() => handleSelectTab('mon-plan')}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-subtle text-ink transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-ok-ink">family_restroom</span>
                <span>{t('menu.familyPlan')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'georisques' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-subtle text-ink transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-brand-ink">radar</span>
                <span>{t('menu.georisques')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'carte-perimetres' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left bg-subtle hover:bg-tint text-brand-ink font-bold transition-colors border border-line-strong cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-brand-ink">map</span>
                <span>{t('menu.cartePerimetres')}</span>
              </button>
            </div>
          </div>

          {/* Catégorie 4: Exercices & Entraînement */}
          <div className="flex flex-col gap-1.5">
            <span className="font-label text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5 px-1">
              <span className="material-symbols-outlined text-[16px]">school</span>
              {t('menu.catExercices')}
            </span>
            <div className="flex flex-col gap-1 bg-card rounded-xl p-1.5 border border-line-strong shadow-xs">
              <button
                onClick={() => handleSelectSub({ type: 'formation' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-subtle text-ink transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-ok-ink">quiz</span>
                <span>{t('menu.formation')}</span>
              </button>
            </div>
          </div>

          {/* Catégorie 5: Système, Mises à Jour & Mentions Légales */}
          <div className="flex flex-col gap-1.5">
            <span className="font-label text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5 px-1">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              {t('menu.catSysteme')}
            </span>
            <div className="flex flex-col gap-1 bg-card rounded-xl p-1.5 border border-line-strong shadow-xs">
              <button
                onClick={() => handleSelectSub({ type: 'landing' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left bg-subtle hover:bg-tint text-brand-ink font-bold transition-colors cursor-pointer border border-line-strong/30 mb-0.5"
              >
                <span className="material-symbols-outlined text-[18px] text-brand-ink">public</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-bold">
                    {language === 'fr' ? 'Site de Présentation / Landing Page' : 'Overview Landing Page'}
                  </span>
                  <span className="text-[10px] text-ink-muted font-normal leading-tight">
                    {language === 'fr' ? 'Présentation citoyenne et partage' : 'Citizen overview & presentation'}
                  </span>
                </div>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'system-settings' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-subtle text-brand-ink font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">system_update</span>
                <span>{t('menu.systemSettings')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'settings' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-subtle text-ink transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
                <span>{t('menu.preferences')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'tracabilite' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-subtle text-ink transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-ok-ink">policy</span>
                <span>{t('nav.sources')} (v2.4)</span>
              </button>
              {onStartTour && (
                <button
                  onClick={() => {
                    onStartTour();
                    onClose();
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-subtle text-brand-ink font-bold transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-brand-ink">explore</span>
                  <span>{t('tour.menuButton')}</span>
                </button>
              )}
              {onTriggerOnboarding && (
                <button
                  onClick={() => {
                    onTriggerOnboarding();
                    onClose();
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-subtle text-ink-muted transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-ink-muted">gavel</span>
                  <span>{t('menu.legal')}</span>
                </button>
              )}
              {onOpenWipeModal && (
                <button
                  onClick={() => {
                    onOpenWipeModal();
                    onClose();
                  }}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg text-left bg-danger-soft/40 hover:bg-danger-soft text-danger-ink transition-colors border border-danger-line mt-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px] text-danger-ink">restart_alt</span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label text-[12px] font-bold">{t('menu.wipe')}</span>
                    <span className="text-[10px] text-danger-ink-strong leading-tight">{t('menu.wipeDesc')}</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Drawer */}
        <div className="p-3 bg-card border-t border-line-strong flex items-center justify-between text-[11px] font-label text-ink-muted">
          <span>NRBCOR v1.2.0 PWA</span>
          <span className="text-ok-ink font-bold">
            {language === 'fr' ? '13 Octobre 2026' : 'October 13, 2026'}
          </span>
        </div>
      </div>

      {/* Backdrop touch area */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};
