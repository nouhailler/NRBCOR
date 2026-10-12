import React from 'react';
import { EmergencyCall } from '../types';

interface CallModalProps {
  call: EmergencyCall | null;
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ call, onClose }) => {
  if (!call) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001126]/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-5 flex flex-col gap-4 border border-[#c4c6ce]">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#ffdad6] text-[#93000a] flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              phone_in_talk
            </span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-wider text-[#ba1a1a] font-bold">
              Confirmation d'appel d'urgence
            </span>
            <h3 className="text-[18px] font-bold text-[#001126] leading-tight mt-0.5">
              {call.name}
            </h3>
          </div>
        </div>

        <div className="bg-[#eef4ff] p-3 rounded-lg flex flex-col gap-1 border border-[#d6e4f8]">
          <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] uppercase font-bold">
            Numéro de composition
          </span>
          <span className="font-['Space_Grotesk'] text-[28px] font-bold text-[#001126] tracking-wider">
            {call.number}
          </span>
          <p className="text-[13px] text-[#0f1c2b] mt-1 leading-snug">
            {call.desc}
          </p>
        </div>

        <p className="text-[11px] text-[#44474d] text-center font-medium leading-relaxed">
          Tout appel abusif bloque la ligne pour les détresses réelles (Art. 322-14 du Code Pénal).
        </p>

        <div className="flex flex-col gap-2 pt-1">
          <a
            href={call.number === '114' ? 'sms:114' : `tel:${call.number}`}
            className="w-full min-h-[48px] bg-[#ba1a1a] text-white rounded-lg font-['Space_Grotesk'] text-[14px] uppercase font-bold flex items-center justify-center gap-2 active:bg-[#93000a] transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">
              {call.number === '114' ? 'sms' : 'call'}
            </span>
            <span>Confirmer et composer le numéro</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[48px] bg-[#e4efff] hover:bg-[#dce9fd] text-[#001126] rounded-lg font-['Space_Grotesk'] text-[14px] uppercase font-bold flex items-center justify-center transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};
