import React from 'react';

interface WipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const WipeModal: React.FC<WipeModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001126]/60 backdrop-blur-sm"
    >
      <div className="bg-white max-w-sm w-full rounded-xl p-5 space-y-4 shadow-2xl border border-[#c4c6ce]">
        <div className="flex items-center gap-3 text-[#ba1a1a]">
          <div className="w-10 h-10 rounded-full bg-[#ffdad6] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[24px]">warning</span>
          </div>
          <div>
            <h3 className="text-[18px] text-[#001126] font-bold">Confirmation d'effacement</h3>
            <p className="font-['Space_Grotesk'] text-[11px] text-[#ba1a1a] font-bold uppercase tracking-wider">
              ACTION IRRÉVERSIBLE
            </p>
          </div>
        </div>

        <p className="text-[13px] text-[#0f1c2b] leading-relaxed">
          Êtes-vous sûr de vouloir supprimer intégralement le Plan Familial stocké dans la base locale IndexedDB de cet appareil ? Toutes les consignes et contacts seront détruits immédiatement.
        </p>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] px-4 bg-[#e4efff] hover:bg-[#dce9fd] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold uppercase rounded transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-[48px] px-4 bg-[#ba1a1a] hover:bg-[#93000a] text-white font-['Space_Grotesk'] text-[12px] font-bold uppercase rounded transition-colors shadow-sm"
          >
            Confirmer l'effacement
          </button>
        </div>
      </div>
    </div>
  );
};
