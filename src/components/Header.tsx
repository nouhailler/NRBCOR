import React from 'react';

interface HeaderProps {
  currentTitle?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenSources?: () => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTitle = 'Accueil',
  subtitle = 'Protection Civile & Risques NRBC',
  showBack = false,
  onBack,
  onOpenSources,
  onOpenSettings,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#f8f9ff]/90 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e4efff]">
      <div className="h-20 px-4 flex items-center justify-between gap-2 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showBack && onBack ? (
            <button
              aria-label="Retour"
              onClick={onBack}
              className="w-11 h-11 flex items-center justify-center text-[#001126] hover:bg-[#e4efff] active:bg-[#dce9fd] rounded transition-colors flex-shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : null}

          <img
            alt="NRBCOR Logo"
            className="h-8 w-auto object-contain flex-shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1Xo7U3HPKKmxnuJ96QQVw3LocJQOQGQAc9MYQczqZ25Oo8mlGMbO-OR53n0hMxJA8fqrdD1ozfwJRvQ1dZm7c_wp0ujLf0mOArc2MLxvGFwt1jMirwa4uK6cs3YdWVkCOHTLVqg7aEPB0Mlvj3zfB22on0L1IQ2rtALIWf45wj1i-7XcC0u15i6-1-CkXDcsbZETv5XuC1UuJSHTrZWcN0tipJvD2rKul1mT9UyHlimt59WpYnGhaYUgw"
          />

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-['Space_Grotesk'] text-[14px] text-[#001126] tracking-wide uppercase font-bold truncate">
                NRBCOR
              </span>
              <span className="font-['Space_Grotesk'] text-[11px] px-1.5 py-0.5 rounded bg-[#98f6c5] text-[#005236] uppercase font-semibold">
                ACTIF
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-[11px] font-['Space_Grotesk'] text-[#3f9d73] truncate">
              <span>● Guides 100% Hors ligne</span>
              <span className="text-[#c4c6ce]">•</span>
              <span className="text-[#001126] font-medium truncate">{currentTitle}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onOpenSources}
            title="Sources & Traçabilité (v2.4)"
            className="w-9 h-9 rounded-full bg-[#001126] hover:bg-[#12263f] text-white flex items-center justify-center transition-colors shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">policy</span>
          </button>
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              title="Paramètres, Accessibilité & Données"
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
