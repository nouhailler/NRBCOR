import React from 'react';

interface HeaderProps {
  currentTitle?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenMenu: () => void;
  onOpenSources?: () => void;
  onOpenSettings?: () => void;
  onInstallClick?: () => void;
  canInstall?: boolean;
  theme?: 'light' | 'dark' | 'system';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTitle = 'Accueil',
  subtitle = 'Protection Civile & Risques NRBC',
  showBack = false,
  onBack,
  onOpenMenu,
  onOpenSources,
  onOpenSettings,
  onInstallClick,
  canInstall = false,
  theme = 'light',
  onToggleTheme,
}) => {
  return (
    <header className="fixed top-0 w-full z-40 bg-[#f8f9ff]/95 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e4efff]">
      <div className="h-20 px-3 sm:px-4 flex items-center justify-between gap-2 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Bouton Hamburger ou Retour */}
          {showBack && onBack ? (
            <button
              aria-label="Retour"
              onClick={onBack}
              className="w-11 h-11 flex items-center justify-center text-[#001126] hover:bg-[#e4efff] active:bg-[#dce9fd] rounded-xl transition-colors shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : (
            <button
              aria-label="Ouvrir le menu complet"
              onClick={onOpenMenu}
              className="w-11 h-11 flex items-center justify-center text-[#001126] hover:bg-[#e4efff] active:bg-[#dce9fd] rounded-xl transition-colors shrink-0 border border-[#c4c6ce] shadow-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
          )}

          {/* Logo vectoriel SVG */}
          <div className="flex items-center gap-2 min-w-0">
            <img
              alt="NRBCOR Logo"
              className="h-8 w-auto object-contain shrink-0"
              src="/logo.svg"
            />

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-['Space_Grotesk'] text-[14px] text-[#001126] tracking-wide uppercase font-bold truncate">
                  NRBCOR
                </span>
                <span className="font-['Space_Grotesk'] text-[10px] px-1.5 py-0.5 rounded bg-[#98f6c5] text-[#005236] uppercase font-bold">
                  ACTIF
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-[11px] font-['Space_Grotesk'] text-[#3f9d73] truncate">
                <span>● 100% Hors-Ligne</span>
                <span className="text-[#c4c6ce]">•</span>
                <span className="text-[#001126] font-medium truncate">{currentTitle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Droite */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Bouton Installer PWA (Accessible et toujours pratique pour novices) */}
          {onInstallClick && (
            <button
              onClick={onInstallClick}
              title="Installer l'application sur votre écran mobile ou ordinateur"
              className="h-9 px-2.5 rounded-lg bg-[#001258] hover:bg-[#0024a8] text-white flex items-center gap-1.5 font-['Space_Grotesk'] text-[11px] font-bold uppercase transition-colors shadow-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">install_mobile</span>
              <span className="hidden sm:inline">Installer</span>
            </button>
          )}

          {/* Bouton Thème Clair / Sombre */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Basculer en Thème Clair' : 'Basculer en Thème Sombre'}
              className="w-9 h-9 rounded-full bg-white hover:bg-[#e4efff] text-[#001126] flex items-center justify-center transition-colors shadow-xs border border-[#c4c6ce]"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          )}

          {/* Bouton Sources */}
          <button
            onClick={onOpenSources}
            title="Sources & Traçabilité (v2.4)"
            className="w-9 h-9 rounded-full bg-[#001126] hover:bg-[#12263f] text-white flex items-center justify-center transition-colors shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">policy</span>
          </button>

          {/* Bouton Paramètres Système */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              title="Paramètres Système & Mises à jour"
              className="w-9 h-9 rounded-full bg-[#e4efff] hover:bg-[#dce9fd] text-[#001126] flex items-center justify-center transition-colors shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
