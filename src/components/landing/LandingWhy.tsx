import React from 'react';
import { LandingTranslations } from '../../i18n/landingTranslations';

interface LandingWhyProps {
  t: LandingTranslations;
}

export const LandingWhy: React.FC<LandingWhyProps> = ({ t }) => {
  return (
    <section id="why" className="py-20 lg:py-28 bg-[#f8f9ff] text-[#001126] border-b border-[#e4efff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-['Space_Grotesk'] font-bold tracking-wider text-[#0036ce] uppercase mb-2 block">
            {t.why.kicker}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-['Space_Grotesk'] font-bold text-[#001126] tracking-tight mb-4 text-balance">
            {t.why.title}
          </h2>
          <p className="text-base text-[#44474d] leading-relaxed">
            {t.why.intro}
          </p>
        </div>

        {/* Grille des 5 piliers de la résilience citoyenne */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {t.why.pillars.map((pillar, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl bg-white border border-[#c4c6ce]/60 shadow-xs hover:shadow-md transition-all flex flex-col items-start ${
                idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-[#eef4ff] text-[#0036ce] flex items-center justify-center mb-4 shrink-0">
                <span className="material-symbols-outlined text-[24px]">{pillar.icon}</span>
              </div>
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-[#001126] mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-[#44474d] leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Encadré d'autonomie numérique : Réseaux coupés en situation de crise */}
        <div className="rounded-2xl p-6 sm:p-8 bg-[#001126] text-white border border-[#12263f] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#3f9d73]/20 border border-[#3f9d73]/40 text-[#98f6c5] flex items-center justify-center shrink-0 mt-1">
              <span className="material-symbols-outlined text-[28px]">signal_cellular_nodata</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white mb-1">
                {t.why.offlineBox.title}
              </h3>
              <p className="text-sm text-[#c4c6ce] leading-relaxed max-w-3xl">
                {t.why.offlineBox.desc}
              </p>
            </div>
          </div>
          <a
            href="#offline"
            className="px-5 py-2.5 rounded-xl bg-[#05172e] hover:bg-[#0b2447] text-[#98f6c5] border border-[#1e3a5f] hover:border-[#3f9d73] text-xs font-['Space_Grotesk'] font-bold tracking-wide whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>En savoir plus</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </a>
        </div>
      </div>
    </section>
  );
};
