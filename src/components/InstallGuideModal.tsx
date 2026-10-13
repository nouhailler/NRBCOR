import React from 'react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNativeInstall?: () => void;
  canNativeInstall?: boolean;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  onNativeInstall,
  canNativeInstall = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001126]/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-[#c4c6ce] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 text-[#0f1c2b]">
        {/* En-tête modal */}
        <div className="bg-[#001126] text-white p-5 flex items-center justify-between border-b border-[#12263f]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#98f6c5] flex items-center justify-center text-[#005236]">
              <span className="material-symbols-outlined text-[22px]">install_mobile</span>
            </div>
            <div className="flex flex-col">
              <h2 id="install-title" className="font-['Space_Grotesk'] text-[16px] font-bold tracking-tight">
                Installer l'application NRBCOR
              </h2>
              <span className="text-[11px] text-[#98f6c5] font-['Space_Grotesk'] uppercase font-semibold">
                Accès direct 100% hors-ligne
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Corps des instructions pas-à-pas pour utilisateurs novices */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[70vh] text-[13px]">
          <p className="text-[#44474d] leading-relaxed">
            L'installation de l'application permet de l'ajouter sur votre écran d'accueil comme une application native, consultable même en cas de panne de réseau Internet ou de coupure électrique.
          </p>

          {/* Si installation native en 1-clic possible */}
          {canNativeInstall && onNativeInstall && (
            <button
              onClick={() => {
                onNativeInstall();
                onClose();
              }}
              type="button"
              className="w-full min-h-[48px] bg-[#001126] hover:bg-[#12263f] text-white rounded-xl font-['Space_Grotesk'] text-[13px] uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              <span>Installer directement en 1 clic</span>
            </button>
          )}

          {/* Guide spécifique iPhone / iPad (Safari) */}
          <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#d6e4f8] flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#001126] font-bold">
              <span className="material-symbols-outlined text-[#0036ce] text-[20px]">phone_iphone</span>
              <span>Sur iPhone ou iPad (Safari) :</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-[12px] text-[#44474d] leading-snug pl-1">
              <li>
                Appuyez sur le bouton <strong>Partager</strong> en bas de Safari (<span className="text-[#0036ce] font-bold">icône rectangle avec flèche vers le haut ⎋</span>).
              </li>
              <li>
                Faites défiler vers le bas et touchez <strong>« Sur l'écran d'accueil »</strong> (<span className="font-bold">icône ⊕</span>).
              </li>
              <li>
                Touchez <strong>« Ajouter »</strong> en haut à droite. L'icône NRBCOR apparaît sur votre écran !
              </li>
            </ol>
          </div>

          {/* Guide spécifique Android (Chrome / Firefox / Samsung Internet) */}
          <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#d6e4f8] flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#001126] font-bold">
              <span className="material-symbols-outlined text-[#3f9d73] text-[20px]">phone_android</span>
              <span>Sur Mobile Android :</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-[12px] text-[#44474d] leading-snug pl-1">
              <li>
                Appuyez sur le menu du navigateur (<strong className="font-bold">les 3 petits points ⋮</strong> en haut à droite).
              </li>
              <li>
                Sélectionnez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.
              </li>
              <li>
                Confirmez l'installation. L'application s'installe comme une appli native.
              </li>
            </ol>
          </div>

          {/* Guide Ordinateur Desktop (Chrome, Edge, Brave) */}
          <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#d6e4f8] flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#001126] font-bold">
              <span className="material-symbols-outlined text-[#001126] text-[20px]">laptop</span>
              <span>Sur Ordinateur (Desktop) :</span>
            </div>
            <p className="text-[12px] text-[#44474d] leading-snug">
              Cliquez sur l'icône d'installation située tout à droite dans la barre d'adresse de votre navigateur (<span className="font-semibold">icône écran avec flèche ⭳ ou bouton Installer</span>).
            </p>
          </div>
        </div>

        {/* Footer modal */}
        <div className="p-4 bg-[#f8f9ff] border-t border-[#c4c6ce] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[42px] px-5 rounded-xl bg-[#001126] hover:bg-[#12263f] text-white font-['Space_Grotesk'] text-[12px] font-bold uppercase transition-colors"
          >
            Fermer le guide
          </button>
        </div>
      </div>
    </div>
  );
};
