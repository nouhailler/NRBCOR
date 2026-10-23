import React, { useState, useEffect } from 'react';

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
  profileMode?: 'simplified' | 'expert';
  onToggleProfileMode?: () => void;
  onOpenModeCrise?: () => void;
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
  profileMode = 'simplified',
  onToggleProfileMode,
  onOpenModeCrise,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="fixed top-0 w-full z-40 bg-[#f8f9ff]/95 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e4efff]">
      <div className="h-20 px-3 sm:px-4 flex items-center justify-between gap-2 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Bouton Hamburger ou Retour */}
          {showBack && onBack ? (
            <button
              aria-label="Retour"
              onClick={onBack}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-[#001126] hover:bg-[#e4efff] active:bg-[#dce9fd] rounded-xl transition-colors shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : (
            <button
              aria-label="Ouvrir le menu complet"
              onClick={onOpenMenu}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-[#001126] hover:bg-[#e4efff] active:bg-[#dce9fd] rounded-xl transition-colors shrink-0 border border-[#c4c6ce] shadow-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
          )}

          {/* Logo vectoriel SVG */}
          <div className="flex items-center gap-2 min-w-0">
            <img
              alt="NRBCOR Logo"
              className="h-7 sm:h-8 w-auto object-contain shrink-0"
              src="/logo.svg"
            />

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-nowrap">
                <span className="font-['Space_Grotesk'] text-[13px] sm:text-[14px] text-[#001126] tracking-wide uppercase font-bold shrink-0">
                  NRBCOR
                </span>
                <span
                  title={isOnline ? 'Réseau Internet détecté et opérationnel' : 'Aucun réseau détecté - Fonctionnement sur base locale'}
                  className={`font-['Space_Grotesk'] text-[10px] px-1.5 py-0.5 rounded uppercase font-bold flex items-center gap-1 shrink-0 ${
                    isOnline
                      ? 'bg-[#98f6c5] text-[#005236]'
                      : 'bg-[#ffdad6] text-[#93000a]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isOnline ? 'bg-[#005236]' : 'bg-[#93000a]'}`}></span>
                  <span>{isOnline ? 'En Ligne' : 'Hors Ligne'}</span>
                </span>
                <span className="font-['Space_Grotesk'] text-[9px] px-1 py-0.5 rounded bg-[#eef4ff] text-[#0036ce] uppercase font-bold hidden md:inline-block border border-[#d6e4f8] shrink-0">
                  Base Locale Prête
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-[11px] font-['Space_Grotesk'] text-[#44474d] truncate">
                <span className="text-[#001126] font-semibold truncate">{currentTitle}</span>
                <span className="text-[#c4c6ce] hidden sm:inline">•</span>
                <span className="text-[#3f9d73] font-medium truncate hidden sm:inline">Stockage Autonome v1.2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Droite */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Bouton SOS Mode Crise Simplifié (Accessible en 1 tap direct depuis n'importe où, prioritaire en mobile) */}
          {onOpenModeCrise && (
            <button
              onClick={onOpenModeCrise}
              title="Activer le Mode Crise Immédiat (Gros Boutons Réflexes)"
              className="h-9 px-2 sm:px-2.5 rounded-lg bg-[#ba1a1a] hover:bg-[#93000a] text-white flex items-center gap-1 font-['Space_Grotesk'] text-[11px] font-black uppercase transition-all shadow-md active:scale-95 animate-pulse border border-red-400 shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">emergency</span>
              <span>CRISE</span>
            </button>
          )}

          {/* Bascule Mode Grand Public vs Expert (Tablette et Desktop) */}
          {onToggleProfileMode && (
            <button
              onClick={onToggleProfileMode}
              title={profileMode === 'simplified' ? "Mode actuel : Grand Public Simplifié (Cliquer pour Mode Expert)" : "Mode actuel : Expert / Formateur (Cliquer pour Mode Grand Public)"}
              className={`h-9 px-2 rounded-lg items-center gap-1 font-['Space_Grotesk'] text-[11px] font-bold uppercase transition-all border cursor-pointer shrink-0 hidden sm:flex ${
                profileMode === 'simplified'
                  ? 'bg-[#eef4ff] hover:bg-[#dce9fd] text-[#0036ce] border-[#0036ce]/30'
                  : 'bg-[#001126] hover:bg-[#12263f] text-[#98f6c5] border-[#98f6c5]/40 shadow-xs'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {profileMode === 'simplified' ? 'person' : 'school'}
              </span>
              <span>
                {profileMode === 'simplified' ? 'Grand Public' : 'Expert'}
              </span>
            </button>
          )}

          {/* Bouton Installer PWA (Desktop/Tablette uniquement, déjà présent dans le menu burger sur mobile) */}
          {onInstallClick && (
            <button
              onClick={onInstallClick}
              title="Installer l'application sur votre écran mobile ou ordinateur"
              className="h-9 px-2.5 rounded-lg bg-[#001258] hover:bg-[#0024a8] text-white items-center gap-1.5 font-['Space_Grotesk'] text-[11px] font-bold uppercase transition-colors shadow-xs shrink-0 hidden md:flex"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">install_mobile</span>
              <span>Installer</span>
            </button>
          )}

          {/* Bouton Thème Clair / Sombre (Tablette et Desktop) */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Basculer en Thème Clair' : 'Basculer en Thème Sombre'}
              className="w-9 h-9 rounded-full bg-white hover:bg-[#e4efff] text-[#001126] items-center justify-center transition-colors shadow-xs border border-[#c4c6ce] shrink-0 hidden sm:flex"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          )}

          {/* Bouton Sources (Tablette et Desktop) */}
          <button
            onClick={onOpenSources}
            title="Sources & Traçabilité (v2.4)"
            className="w-9 h-9 rounded-full bg-[#001126] hover:bg-[#12263f] text-white items-center justify-center transition-colors shadow-sm shrink-0 hidden sm:flex"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">policy</span>
          </button>

          {/* Bouton Paramètres Système (Tablette et Desktop) */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              title="Paramètres Système & Mises à jour"
              className="w-9 h-9 rounded-full bg-[#e4efff] hover:bg-[#dce9fd] text-[#001126] items-center justify-center transition-colors shadow-sm shrink-0 hidden sm:flex"
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
