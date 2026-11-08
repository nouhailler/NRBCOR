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
}) => {
  const { t, language } = useTranslation();

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
      className="fixed inset-0 z-50 flex bg-[#001126]/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-sm bg-[#f8f9ff] text-[#0f1c2b] h-full shadow-2xl flex flex-col border-r border-[#c4c6ce] overflow-hidden animate-in slide-in-from-left duration-250"
      >
        {/* Header Drawer */}
        <div className="bg-[#001126] text-white p-4 flex items-center justify-between border-b border-[#12263f]">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="NRBCOR" className="h-8 w-auto invert" />
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-[15px] font-bold tracking-wide">
                {language === 'fr' ? 'MENU GLOBAL' : 'MAIN MENU'}
              </span>
              <span className="font-['Space_Grotesk'] text-[10px] text-[#98f6c5] uppercase tracking-wider font-semibold">
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
          <div className="p-3 bg-[#dee1ff] border-b border-[#b9c3ff]">
            <button
              onClick={() => {
                onInstallClick();
                onClose();
              }}
              type="button"
              className="w-full min-h-[44px] bg-[#001258] hover:bg-[#001d8c] text-white rounded-xl font-['Space_Grotesk'] text-[12px] uppercase font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">install_mobile</span>
              <span>{t('home.installTitle')}</span>
            </button>
          </div>
        )}

        {/* Sélecteur de Langue (FR / EN) & Thème */}
        <div className="p-3 bg-white border-b border-[#c4c6ce] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#44474d] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">language</span>
              {t('nav.language')}
            </span>
          </div>
          <LanguageSwitcher variant="full" />

          {onChangeTheme && (
            <div className="pt-2 border-t border-[#e4efff] flex items-center justify-between gap-2">
              <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#44474d] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">palette</span>
                {t('nav.theme')} :
              </span>
              <div className="flex items-center gap-1 bg-[#f0f4f9] p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => onChangeTheme('light')}
                  className={`px-2.5 py-1 rounded text-[11px] font-['Space_Grotesk'] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-[#001126] text-white shadow-xs'
                      : 'text-[#44474d] hover:text-[#001126]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">light_mode</span>
                  <span>{language === 'fr' ? 'Clair' : 'Light'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeTheme('dark')}
                  className={`px-2.5 py-1 rounded text-[11px] font-['Space_Grotesk'] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-[#001126] text-white shadow-xs'
                      : 'text-[#44474d] hover:text-[#001126]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">dark_mode</span>
                  <span>{language === 'fr' ? 'Sombre' : 'Dark'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeTheme('system')}
                  className={`px-2.5 py-1 rounded text-[11px] font-['Space_Grotesk'] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    theme === 'system'
                      ? 'bg-[#001126] text-white shadow-xs'
                      : 'text-[#44474d] hover:text-[#001126]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">settings_brightness</span>
                  <span>Auto</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 text-[13px]">
          {/* Catégorie 1: Urgence Immédiate */}
          <div className="flex flex-col gap-1.5">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider text-[#ba1a1a] flex items-center gap-1.5 px-1">
              <span className="material-symbols-outlined text-[16px]">emergency</span>
              {t('menu.catUrgence')}
            </span>
            <div className="flex flex-col gap-1 bg-white rounded-xl p-1.5 border border-[#ffb4ab] shadow-xs">
              <button
                onClick={() => handleSelectSub({ type: 'mode-crise' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#93000a] font-black transition-colors border border-[#ff897d] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">crisis_alert</span>
                <span>{t('menu.modeCrise')}</span>
              </button>
              <button
                onClick={() => handleSelectTab('reagir')}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#ffdad6]/40 text-[#93000a] font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">bolt</span>
                <span>{t('menu.reagirNow')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'deshabillage' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#002c1b]">sanitizer</span>
                <span>{t('menu.deshabillage')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'confinement-guide' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#0036ce]">meeting_room</span>
                <span>{t('menu.confinement')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'siren-guide' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">campaign</span>
                <span>{t('menu.siren')}</span>
              </button>
            </div>
          </div>

          {/* Catégorie 2: Doctrines & Risques NRBC */}
          <div className="flex flex-col gap-1.5">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider text-[#0036ce] flex items-center gap-1.5 px-1">
              <span className="material-symbols-outlined text-[16px]">shield</span>
              {t('menu.catDoctrines')}
            </span>
            <div className="flex flex-col gap-1 bg-white rounded-xl p-1.5 border border-[#c4c6ce] shadow-xs">
              <button
                onClick={() => handleSelectTab('guides')}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#eef4ff] text-[#0036ce] font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
                <span>{t('menu.allGuides')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'protocol', id: 'nucleaire' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors cursor-pointer"
              >
                <NuclearPowerIcon className="w-[18px] h-[18px] text-[#ba1a1a]" />
                <span>{t('menu.ficheNucleaire')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'protocol', id: 'chimique' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">science</span>
                <span>{t('menu.ficheChimique')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'protocol', id: 'bio' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#005236]">coronavirus</span>
                <span>{t('menu.ficheBio')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'iode' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">medication</span>
                <span>{t('menu.ficheIode')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'encyclopedie', tab: 'histoire' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left bg-[#eef4ff] hover:bg-[#dce9fd] text-[#001258] font-bold transition-colors border border-[#d6e4f8] mt-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#0036ce]">history_edu</span>
                <span>{t('menu.encyclopedia')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'encyclopedie', tab: 'glossaire' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left bg-[#f8f9ff] hover:bg-[#eef4ff] text-[#001126] font-semibold transition-colors border border-[#e4efff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#005236]">spellcheck</span>
                <span>{t('menu.glossary')}</span>
              </button>
            </div>
          </div>

          {/* Catégorie 3: Résilience & Préparation */}
          <div className="flex flex-col gap-1.5">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider text-[#002c1b] flex items-center gap-1.5 px-1">
              <span className="material-symbols-outlined text-[16px]">backpack</span>
              {t('menu.catResilience')}
            </span>
            <div className="flex flex-col gap-1 bg-white rounded-xl p-1.5 border border-[#c4c6ce] shadow-xs">
              <button
                onClick={() => handleSelectSub({ type: 'suis-je-pret' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left bg-[#eef4ff] hover:bg-[#dee1ff] text-[#001258] font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#0036ce]">speed</span>
                <span>{t('menu.suisJePret')}</span>
              </button>
              <button
                onClick={() => handleSelectTab('preparation')}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] font-semibold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#0036ce]">inventory_2</span>
                <span>{t('menu.kit72h')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'inventory' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#001126]">receipt_long</span>
                <span>{t('menu.inventory')}</span>
              </button>
              <button
                onClick={() => handleSelectTab('mon-plan')}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#3f9d73]">family_restroom</span>
                <span>{t('menu.familyPlan')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'georisques' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#0036ce]">radar</span>
                <span>{t('menu.georisques')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'carte-perimetres' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left bg-[#eef4ff] hover:bg-[#dee1ff] text-[#001258] font-bold transition-colors border border-[#c4c6ce] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#6750a4]">map</span>
                <span>{t('menu.cartePerimetres')}</span>
              </button>
            </div>
          </div>

          {/* Catégorie 4: Exercices & Entraînement */}
          <div className="flex flex-col gap-1.5">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider text-[#44474d] flex items-center gap-1.5 px-1">
              <span className="material-symbols-outlined text-[16px]">school</span>
              {t('menu.catExercices')}
            </span>
            <div className="flex flex-col gap-1 bg-white rounded-xl p-1.5 border border-[#c4c6ce] shadow-xs">
              <button
                onClick={() => handleSelectSub({ type: 'formation' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#3f9d73]">quiz</span>
                <span>{t('menu.formation')}</span>
              </button>
            </div>
          </div>

          {/* Catégorie 5: Système, Mises à Jour & Mentions Légales */}
          <div className="flex flex-col gap-1.5">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider text-[#44474d] flex items-center gap-1.5 px-1">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              {t('menu.catSysteme')}
            </span>
            <div className="flex flex-col gap-1 bg-white rounded-xl p-1.5 border border-[#c4c6ce] shadow-xs">
              <button
                onClick={() => handleSelectSub({ type: 'landing' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left bg-[#eef4ff] hover:bg-[#dce9fd] text-[#0036ce] font-bold transition-colors cursor-pointer border border-[#c4c6ce]/30 mb-0.5"
              >
                <span className="material-symbols-outlined text-[18px] text-[#0036ce]">public</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-bold">
                    {language === 'fr' ? 'Site de Présentation / Landing Page' : 'Overview Landing Page'}
                  </span>
                  <span className="text-[10px] text-[#44474d] font-normal leading-tight">
                    {language === 'fr' ? 'Présentation citoyenne et partage' : 'Citizen overview & presentation'}
                  </span>
                </div>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'system-settings' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#eef4ff] text-[#0036ce] font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">system_update</span>
                <span>{t('menu.systemSettings')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'settings' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
                <span>{t('menu.preferences')}</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'tracabilite' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#3f9d73]">policy</span>
                <span>{t('nav.sources')} (v2.4)</span>
              </button>
              {onStartTour && (
                <button
                  onClick={() => {
                    onStartTour();
                    onClose();
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#eef4ff] text-[#0036ce] font-bold transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#0036ce]">explore</span>
                  <span>{t('tour.menuButton')}</span>
                </button>
              )}
              {onTriggerOnboarding && (
                <button
                  onClick={() => {
                    onTriggerOnboarding();
                    onClose();
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#44474d] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#44474d]">gavel</span>
                  <span>{t('menu.legal')}</span>
                </button>
              )}
              {onOpenWipeModal && (
                <button
                  onClick={() => {
                    onOpenWipeModal();
                    onClose();
                  }}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg text-left bg-[#ffdad6]/40 hover:bg-[#ffdad6] text-[#ba1a1a] transition-colors border border-[#ffb4ab] mt-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px] text-[#ba1a1a]">restart_alt</span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-['Space_Grotesk'] text-[12px] font-bold">{t('menu.wipe')}</span>
                    <span className="text-[10px] text-[#93000a] leading-tight">{t('menu.wipeDesc')}</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Drawer */}
        <div className="p-3 bg-white border-t border-[#c4c6ce] flex items-center justify-between text-[11px] font-['Space_Grotesk'] text-[#44474d]">
          <span>NRBCOR v1.2.0 PWA</span>
          <span className="text-[#3f9d73] font-bold">
            {language === 'fr' ? '13 Octobre 2026' : 'October 13, 2026'}
          </span>
        </div>
      </div>

      {/* Backdrop touch area */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};
