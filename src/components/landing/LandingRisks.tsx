import React from 'react';
import { LandingTranslations } from '../../i18n/landingTranslations';

interface LandingRisksProps {
  t: LandingTranslations;
  onLaunchApp: () => void;
}

export const LandingRisks: React.FC<LandingRisksProps> = ({ t, onLaunchApp }) => {
  return (
    <section id="risks" className="py-20 lg:py-28 bg-white text-[#001126] border-b border-[#e4efff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-['Space_Grotesk'] font-bold tracking-wider text-[#0036ce] uppercase mb-2 block">
            {t.risks.kicker}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-['Space_Grotesk'] font-bold text-[#001126] tracking-tight mb-4 text-balance">
            {t.risks.title}
          </h2>
          <p className="text-base text-[#44474d] leading-relaxed">
            {t.risks.subtitle}
          </p>
        </div>

        {/* 4 Cartes Illustrées des Risques NRBC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {t.risks.items.map((risk) => (
            <div
              key={risk.id}
              className="rounded-2xl border border-[#c4c6ce]/70 bg-white shadow-xs hover:shadow-md transition-all p-6 sm:p-8 flex flex-col justify-between hover:border-[#0036ce]/50 group"
            >
              <div>
                {/* En-tête carte avec lettre symbole */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-['Space_Grotesk'] text-xl font-black text-white shadow-xs"
                      style={{ backgroundColor: risk.accent }}
                    >
                      {risk.letter}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#001126]">
                        {risk.name}
                      </h3>
                      <span className="text-xs font-['Space_Grotesk'] text-[#74777e] font-semibold">
                        {risk.tagline}
                      </span>
                    </div>
                  </div>
                  <span
                    className="material-symbols-outlined text-[28px] text-[#74777e] group-hover:scale-110 transition-transform"
                    style={{ color: risk.accent }}
                  >
                    {risk.id === 'nucleaire'
                      ? 'nuclear_power'
                      : risk.id === 'radiologique'
                      ? 'radiology'
                      : risk.id === 'biologique'
                      ? 'coronavirus'
                      : 'science'}
                  </span>
                </div>

                {/* Description scientifique et didactique */}
                <p className="text-sm text-[#44474d] leading-relaxed mb-6">
                  {risk.description}
                </p>

                {/* Réflexe clé mis en valeur */}
                <div className="p-3.5 rounded-xl bg-[#f8f9ff] border border-[#e4efff] mb-6">
                  <span className="text-[11px] font-['Space_Grotesk'] font-bold text-[#74777e] uppercase block mb-1">
                    Réflexe Vital Recommandé :
                  </span>
                  <p className="text-xs text-[#001126] font-medium leading-relaxed">
                    {risk.keyReflex}
                  </p>
                </div>
              </div>

              {/* Bouton d'accès direct au protocole dans l'app */}
              <button
                type="button"
                onClick={onLaunchApp}
                className="w-full pt-3 border-t border-[#eef4ff] text-xs font-['Space_Grotesk'] font-bold text-[#0036ce] hover:text-[#0024a8] flex items-center justify-between group-hover:translate-x-0.5 transition-all cursor-pointer"
              >
                <span>Consulter la fiche réflexe {risk.name}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
