import React from 'react';
import { TabType, SubScreen } from '../types';

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
}) => {
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
                MENU GLOBAL
              </span>
              <span className="font-['Space_Grotesk'] text-[10px] text-[#98f6c5] uppercase tracking-wider font-semibold">
                ● 100% Hors-Ligne Actif
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer le menu"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
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
              className="w-full min-h-[44px] bg-[#001258] hover:bg-[#001d8c] text-white rounded-xl font-['Space_Grotesk'] text-[12px] uppercase font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">install_mobile</span>
              <span>Installer l'application sur l'appareil</span>
            </button>
          </div>
        )}

        {/* Sélecteur de Thème (Thème Clair / Thème Sombre / Système) */}
        {onChangeTheme && (
          <div className="px-4 py-2.5 bg-white border-b border-[#c4c6ce] flex items-center justify-between gap-2">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#44474d] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">palette</span>
              Thème :
            </span>
            <div className="flex items-center gap-1 bg-[#f0f4f9] p-1 rounded-lg">
              <button
                type="button"
                onClick={() => onChangeTheme('light')}
                className={`px-2.5 py-1 rounded text-[11px] font-['Space_Grotesk'] font-bold flex items-center gap-1 transition-all ${
                  theme === 'light'
                    ? 'bg-[#001126] text-white shadow-xs'
                    : 'text-[#44474d] hover:text-[#001126]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">light_mode</span>
                <span>Clair</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeTheme('dark')}
                className={`px-2.5 py-1 rounded text-[11px] font-['Space_Grotesk'] font-bold flex items-center gap-1 transition-all ${
                  theme === 'dark'
                    ? 'bg-[#001126] text-white shadow-xs'
                    : 'text-[#44474d] hover:text-[#001126]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">dark_mode</span>
                <span>Sombre</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeTheme('system')}
                className={`px-2.5 py-1 rounded text-[11px] font-['Space_Grotesk'] font-bold flex items-center gap-1 transition-all ${
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

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 text-[13px]">
          {/* Catégorie 1: Urgence Immédiate */}
          <div className="flex flex-col gap-1.5">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider text-[#ba1a1a] flex items-center gap-1.5 px-1">
              <span className="material-symbols-outlined text-[16px]">emergency</span>
              1. Urgence & Réflexes Immédiats
            </span>
            <div className="flex flex-col gap-1 bg-white rounded-xl p-1.5 border border-[#ffb4ab] shadow-xs">
              <button
                onClick={() => handleSelectTab('reagir')}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#ffdad6]/40 text-[#93000a] font-bold transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">bolt</span>
                <span>Mode Réagir Maintenant</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'deshabillage' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#002c1b]">sanitizer</span>
                <span>Déshabillage & Décontamination (8 étapes)</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'confinement-guide' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#0036ce]">meeting_room</span>
                <span>Guide Confinement Étanche</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'siren-guide' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">campaign</span>
                <span>Signaux d'Alerte RNA & Simulateur Sonore</span>
              </button>
            </div>
          </div>

          {/* Catégorie 2: Doctrines & Risques NRBC */}
          <div className="flex flex-col gap-1.5">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider text-[#0036ce] flex items-center gap-1.5 px-1">
              <span className="material-symbols-outlined text-[16px]">shield</span>
              2. Fiches & Risques NRBC
            </span>
            <div className="flex flex-col gap-1 bg-white rounded-xl p-1.5 border border-[#c4c6ce] shadow-xs">
              <button
                onClick={() => handleSelectTab('guides')}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#eef4ff] text-[#0036ce] font-bold transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
                <span>Catalogue Complet des Guides</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'protocol', id: 'nucleaire' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">nuclear_power</span>
                <span>Fiche Nucléaire (Centrale / Accident)</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'protocol', id: 'chimique' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">science</span>
                <span>Fiche Chimique (Seveso / Toxiques)</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'protocol', id: 'bio' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#005236]">coronavirus</span>
                <span>Fiche Biologique (Pathogènes / Toxines)</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'iode' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">medication</span>
                <span>Fiche Iode Stable (KI 65mg & Posologie)</span>
              </button>
            </div>
          </div>

          {/* Catégorie 3: Résilience & Préparation */}
          <div className="flex flex-col gap-1.5">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider text-[#002c1b] flex items-center gap-1.5 px-1">
              <span className="material-symbols-outlined text-[16px]">backpack</span>
              3. Résilience & Préparation
            </span>
            <div className="flex flex-col gap-1 bg-white rounded-xl p-1.5 border border-[#c4c6ce] shadow-xs">
              <button
                onClick={() => handleSelectTab('preparation')}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#0036ce]">inventory_2</span>
                <span>Checklist Kit d'Urgence 72h</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'inventory' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#001126]">receipt_long</span>
                <span>Inventaire & Dates de Péremption (Écran G)</span>
              </button>
              <button
                onClick={() => handleSelectTab('mon-plan')}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#3f9d73]">family_restroom</span>
                <span>Mon Plan Familial de Mise en Sûreté</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'georisques' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#0036ce]">radar</span>
                <span>Risques Locaux & Géorisques (Carte radar)</span>
              </button>
            </div>
          </div>

          {/* Catégorie 4: Exercices & Entraînement */}
          <div className="flex flex-col gap-1.5">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider text-[#44474d] flex items-center gap-1.5 px-1">
              <span className="material-symbols-outlined text-[16px]">school</span>
              4. Formation & Exercices
            </span>
            <div className="flex flex-col gap-1 bg-white rounded-xl p-1.5 border border-[#c4c6ce] shadow-xs">
              <button
                onClick={() => handleSelectSub({ type: 'formation' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#3f9d73]">quiz</span>
                <span>Simulations d'Immersion & Quiz NRBC</span>
              </button>
            </div>
          </div>

          {/* Catégorie 5: Système, Mises à Jour & Mentions Légales */}
          <div className="flex flex-col gap-1.5">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider text-[#44474d] flex items-center gap-1.5 px-1">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              5. Paramètres Système & Données
            </span>
            <div className="flex flex-col gap-1 bg-white rounded-xl p-1.5 border border-[#c4c6ce] shadow-xs">
              <button
                onClick={() => handleSelectSub({ type: 'system-settings' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#eef4ff] text-[#0036ce] font-bold transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">system_update</span>
                <span>Mises à Jour & Paramètres Système</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'settings' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
                <span>Préférences, Taille du Texte & Export</span>
              </button>
              <button
                onClick={() => handleSelectSub({ type: 'tracabilite' })}
                className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#001126] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#3f9d73]">policy</span>
                <span>Sources Officielles & Traçabilité (v2.4)</span>
              </button>
              {onTriggerOnboarding && (
                <button
                  onClick={() => {
                    onTriggerOnboarding();
                    onClose();
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-[#f0f4f9] text-[#ba1a1a] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">gavel</span>
                  <span>Mentions Légales & Onboarding</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Drawer */}
        <div className="p-3 bg-white border-t border-[#c4c6ce] flex items-center justify-between text-[11px] font-['Space_Grotesk'] text-[#44474d]">
          <span>NRBCOR v1.2.0 PWA</span>
          <span className="text-[#3f9d73] font-bold">13 Octobre 2026</span>
        </div>
      </div>

      {/* Backdrop touch area */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};
