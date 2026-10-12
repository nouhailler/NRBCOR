import React, { useState } from 'react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (config: { householdSize: number; communeName: string }) => void;
  onGoDirectToGuides: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onGoDirectToGuides
}) => {
  const [householdSize, setHouseholdSize] = useState(3);
  const [commune, setCommune] = useState('Lyon 3e Arrondissement');

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001126]/75 backdrop-blur-md overflow-y-auto"
    >
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-[#c4c6ce] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Banner Souveraineté & Offline */}
        <div className="bg-[#001126] text-white p-5 flex flex-col gap-2 relative border-b border-[#12263f]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#98f6c5] text-[#005236] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">shield</span>
              </div>
              <span className="font-['Space_Grotesk'] text-[13px] font-bold tracking-wider uppercase text-[#98f6c5]">
                NRBCOR • V1.0
              </span>
            </div>
            <span className="font-['Space_Grotesk'] text-[10px] bg-white/10 px-2 py-0.5 rounded text-[#dce9fd] font-bold uppercase">
              100% Hors-Ligne
            </span>
          </div>

          <h2 id="onboarding-title" className="text-[22px] font-bold text-white tracking-tight leading-tight mt-1">
            Préparation Civile & Résilience aux Risques NRBC
          </h2>
          <p className="text-[13px] text-[#b4c8e8] leading-relaxed">
            Application citoyenne autonome pour se préparer, stocker ses réserves et réagir avec calme face aux accidents technologiques et menaces majeures.
          </p>
        </div>

        {/* Corps de configuration initiale */}
        <div className="p-5 flex flex-col gap-4 text-[#0f1c2b] overflow-y-auto max-h-[60vh]">
          {/* Avertissement Officiel Non Négociable (Section 4.2) */}
          <div className="p-3 bg-[#eef4ff] rounded-xl border border-[#d6e4f8] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#0036ce] text-[22px] shrink-0 mt-0.5">
              info
            </span>
            <div className="text-[12px] text-[#0f1c2b] leading-relaxed">
              <strong className="font-semibold text-[#001126]">Principe fondamental :</strong> Les guides et protocoles réflexes essentiels sont <span className="font-semibold text-[#005236]">100% disponibles sans connexion Internet</span>. En situation de crise réelle, les alertes prioritaires et consignes d'évacuation doivent être consultées via les canaux officiels de l'État (FR-Alert et radio publique).
            </div>
          </div>

          {/* Configuration facultative : Taille du foyer */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#001126] flex items-center justify-between">
              <span>Taille de votre foyer (facultatif) :</span>
              <span className="font-['Space_Grotesk'] text-[#0036ce] text-[14px]">
                {householdSize} {householdSize > 1 ? 'personnes' : 'personne'}
              </span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setHouseholdSize(num)}
                  className={`min-h-[44px] rounded-lg font-['Space_Grotesk'] text-[13px] font-bold transition-all ${
                    householdSize === num
                      ? 'bg-[#001126] text-white shadow-sm'
                      : 'bg-[#f0f4f9] hover:bg-[#e4efff] text-[#001126]'
                  }`}
                >
                  {num === 5 ? '5+' : num}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-[#44474d]">
              Sert au calcul indicatif automatique de votre réserve d'eau (3L/jour/pers) et rations pour 72h.
            </span>
          </div>

          {/* Configuration facultative : Commune locale */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#001126]">
              Commune de résidence (facultatif) :
            </label>
            <input
              type="text"
              value={commune}
              onChange={(e) => setCommune(e.target.value)}
              placeholder="Ex : Lyon, Villeurbanne, Rouen..."
              className="w-full h-11 px-3 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126] focus:outline-none focus:border-[#0036ce]"
            />
            <span className="text-[11px] text-[#44474d]">
              Permet de charger les fiches de risques locaux (Géorisques & DICRIM communal).
            </span>
          </div>

          {/* Explication courte du stockage local (Section 4.2 & 9.1) */}
          <div className="p-3 bg-[#f8fffb] rounded-xl border border-[#98f6c5] flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#005236] text-[20px] shrink-0">
              lock
            </span>
            <p className="text-[11px] text-[#005236] font-medium leading-snug">
              <strong>Confidentialité absolue :</strong> Aucun compte utilisateur requis. Vos données restent exclusivement sur cet appareil dans la base locale sécurisée IndexedDB.
            </p>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="p-4 bg-[#f8f9ff] border-t border-[#c4c6ce] flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onGoDirectToGuides}
            className="min-h-[46px] px-4 rounded-xl bg-white hover:bg-[#eef4ff] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold uppercase transition-colors border border-[#c4c6ce] flex-1 text-center"
          >
            Accéder directement aux guides
          </button>
          <button
            type="button"
            onClick={() => onComplete({ householdSize, communeName: commune })}
            className="min-h-[46px] px-5 rounded-xl bg-[#001126] hover:bg-[#12263f] text-white font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider transition-colors shadow-sm flex-1 text-center flex items-center justify-center gap-1.5"
          >
            <span>Commencer</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
