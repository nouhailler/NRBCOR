import React, { useState } from 'react';
import { Tooltip } from './Tooltip';

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
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [showDisclaimerDetails, setShowDisclaimerDetails] = useState(false);
  const [validationError, setValidationError] = useState(false);

  if (!isOpen) return null;

  const handleStart = () => {
    if (!acceptedDisclaimer) {
      setValidationError(true);
      return;
    }
    onComplete({ householdSize, communeName: commune });
  };

  const handleGuides = () => {
    if (!acceptedDisclaimer) {
      setValidationError(true);
      return;
    }
    onGoDirectToGuides();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001126]/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-[#c4c6ce] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Banner Souveraineté & Offline */}
        <div className="bg-[#001126] text-white p-5 flex flex-col gap-2 relative border-b border-[#12263f]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="NRBCOR Logo" className="h-7 w-auto invert" />
              <span className="font-['Space_Grotesk'] text-[11px] font-bold tracking-wider uppercase text-[#98f6c5]">
                V1.2.0 PWA
              </span>
            </div>
            <span className="font-['Space_Grotesk'] text-[10px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-bold uppercase">
              100% Hors-Ligne
            </span>
          </div>

          <h2 id="onboarding-title" className="text-[21px] font-bold text-white tracking-tight leading-tight mt-1">
            Bienvenue sur NRBCOR Protection Civile
          </h2>
          <p className="text-[13px] text-[#b4c8e8] leading-relaxed">
            Votre guide numérique de résilience et d'autonomie pour préparer votre foyer et réagir face aux risques nucléaires, radiologiques, biologiques et chimiques.
          </p>
        </div>

        {/* Corps de configuration initiale */}
        <div className="p-5 flex flex-col gap-4 text-[#0f1c2b] overflow-y-auto max-h-[62vh]">
          {/* Avertissement Fondamental avec Infobulle */}
          <div className="p-3 bg-[#eef4ff] rounded-xl border border-[#d6e4f8] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#0036ce] text-[22px] shrink-0 mt-0.5">
              shield
            </span>
            <div className="text-[12px] text-[#0f1c2b] leading-relaxed flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <strong className="font-semibold text-[#001126]">Principe d'autonomie hors-ligne</strong>
                <Tooltip
                  title="Fonctionnement sans réseau"
                  content="L'intégralité des 4 fiches NRBC, le plan familial, la checklist et les guides réflexes sont embarqués dans votre appareil. Aucun accès Internet n'est requis."
                />
              </div>
              Toutes les consignes réflexes restent disponibles même en cas de panne électrique ou de coupure réseau.
            </div>
          </div>

          {/* Configuration : Taille du foyer avec infobulle */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-[#001126] flex items-center gap-1.5">
                <span>Taille de votre foyer :</span>
                <Tooltip
                  title="Calcul automatique des rations"
                  content="Permet d'estimer instantanément votre réserve vitale d'eau (3L/jour/personne) et le nombre de rations nécessaires pour 72 heures."
                />
              </label>
              <span className="font-['Space_Grotesk'] text-[#0036ce] text-[14px] font-bold">
                {householdSize} {householdSize > 1 ? 'personnes' : 'personne'}
              </span>
            </div>
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
          </div>

          {/* Configuration : Commune avec infobulle */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-[#001126] flex items-center gap-1.5">
                <span>Commune de référence :</span>
                <Tooltip
                  title="Données Géorisques locales"
                  content="Permet de précharger les installations Seveso, axes TMD et documents communaux (DICRIM/PCS) de votre commune sans transmettre vos coordonnées GPS."
                />
              </label>
            </div>
            <input
              type="text"
              value={commune}
              onChange={(e) => setCommune(e.target.value)}
              placeholder="Ex : Lyon, Rouen, Villeurbanne..."
              className="w-full h-11 px-3 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126] focus:outline-none focus:border-[#0036ce]"
            />
          </div>

          {/* MENTIONS LÉGALES & DÉCHARGE FORMELLE DE RESPONSABILITÉ (EXIGENCE UTILISATEUR) */}
          <div className={`p-3.5 rounded-xl border flex flex-col gap-2 transition-all ${
            validationError && !acceptedDisclaimer
              ? 'bg-[#ffdad6]/60 border-[#ba1a1a] shadow-xs'
              : 'bg-[#f8f9ff] border-[#c4c6ce]'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider text-[#001126] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">gavel</span>
                Mentions Légales & Non-Responsabilité
              </span>
              <button
                type="button"
                onClick={() => setShowDisclaimerDetails(!showDisclaimerDetails)}
                className="text-[11px] text-[#0036ce] font-bold underline font-['Space_Grotesk']"
              >
                {showDisclaimerDetails ? 'Masquer texte complet' : 'Lire le détail juridique'}
              </button>
            </div>

            <p className="text-[12px] text-[#0f1c2b] leading-relaxed">
              <strong className="text-[#ba1a1a]">Décharge formelle :</strong> L'éditeur et l'auteur de l'application déclinent expressément toute responsabilité quant aux données, informations, calculs et protocoles fournis dans l'application. Vous reconnaissez que l'utilisation des contenus s'effectue sous votre seule et entière responsabilité. En cas de crise réelle, seules les consignes des autorités publiques (Préfet, Sécurité Civile, SAMU 15, Pompiers 18, Police/Gendarmerie 17) font foi.
            </p>

            {showDisclaimerDetails && (
              <div className="p-2.5 bg-white rounded-lg border border-[#c4c6ce] text-[11px] text-[#44474d] flex flex-col gap-1.5 animate-in fade-in duration-150 leading-relaxed">
                <p>
                  1. L'éditeur n'est aucunement responsable des données, approximations cartographiques ou fiches intégrées.
                </p>
                <p>
                  2. L'application ne réalise aucun diagnostic médical, ne dispense aucun traitement individuel et rappelle que la prise d'iode stable (KI) sans consigne préfectorale formelle est strictement contre-indiquée.
                </p>
                <p>
                  3. L'application n'émet ni ne relaye les alertes officielles FR-Alert par diffusion cellulaire. En cas d'alerte réelle, écoutez la radio France Bleu ou France Inter.
                </p>
              </div>
            )}

            {/* Checkbox d'acceptation obligatoire */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-1 mt-1 border-t border-[#e4efff]">
              <input
                type="checkbox"
                checked={acceptedDisclaimer}
                onChange={(e) => {
                  setAcceptedDisclaimer(e.target.checked);
                  if (e.target.checked) setValidationError(false);
                }}
                className="w-5 h-5 mt-0.5 rounded text-[#001126] accent-[#001126] cursor-pointer shrink-0"
              />
              <span className="text-[12px] font-semibold text-[#001126] leading-snug">
                Je reconnais que l'éditeur n'est pas responsable des données fournies dans l'application et j'accepte d'utiliser ces outils à titre purement indicatif.
              </span>
            </label>

            {validationError && !acceptedDisclaimer && (
              <span className="text-[11px] text-[#ba1a1a] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                Veuillez cocher la case confirmant la décharge de responsabilité pour continuer.
              </span>
            )}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="p-4 bg-[#f8f9ff] border-t border-[#c4c6ce] flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={handleGuides}
            className="min-h-[46px] px-4 rounded-xl bg-white hover:bg-[#eef4ff] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold uppercase transition-colors border border-[#c4c6ce] flex-1 text-center"
          >
            Consulter les guides
          </button>
          <button
            type="button"
            onClick={handleStart}
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
