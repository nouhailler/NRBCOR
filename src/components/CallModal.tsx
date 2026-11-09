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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm bg-card rounded-xl shadow-2xl p-5 flex flex-col gap-4 border border-line-strong">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-danger-soft text-danger-ink-strong flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              phone_in_talk
            </span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-label text-[11px] uppercase tracking-wider text-danger-ink font-bold">
              Confirmation d'appel d'urgence
            </span>
            <h3 className="text-[18px] font-bold text-ink leading-tight mt-0.5">
              {call.name}
            </h3>
          </div>
        </div>

        <div className="bg-subtle p-3 rounded-lg flex flex-col gap-1 border border-line">
          <span className="font-label text-[11px] text-ink-muted uppercase font-bold">
            Numéro de composition
          </span>
          <span className="font-label text-[28px] font-bold text-ink tracking-wider">
            {call.number}
          </span>
          <p className="text-[13px] text-ink mt-1 leading-snug">
            {call.desc}
          </p>
        </div>

        <p className="text-[11px] text-ink-muted text-center font-medium leading-relaxed">
          Tout appel abusif bloque la ligne pour les détresses réelles (Art. 322-14 du Code Pénal).
        </p>

        <div className="flex flex-col gap-2 pt-1">
          <a
            href={call.number === '114' ? 'sms:114' : `tel:${call.number}`}
            className="w-full min-h-[48px] bg-danger text-white rounded-lg font-label text-[14px] uppercase font-bold flex items-center justify-center gap-2 active:bg-danger-strong transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">
              {call.number === '114' ? 'sms' : 'call'}
            </span>
            <span>Confirmer et composer le numéro</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[48px] bg-tint hover:bg-tint text-ink rounded-lg font-label text-[14px] uppercase font-bold flex items-center justify-center transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};
