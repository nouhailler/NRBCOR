import React from 'react';
import { LandingTranslations } from '../../i18n/landingTranslations';

interface LandingBilingualProps {
  t: LandingTranslations;
}

export const LandingBilingual: React.FC<LandingBilingualProps> = ({ t }) => {
  return (
    <section className="py-20 lg:py-28 bg-white text-[#001126] border-b border-[#e4efff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-['Space_Grotesk'] font-bold tracking-wider text-[#0036ce] uppercase mb-2 block">
            {t.bilingual.kicker}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-['Space_Grotesk'] font-bold text-[#001126] tracking-tight mb-4 text-balance">
            {t.bilingual.title}
          </h2>
          <p className="text-base text-[#44474d] leading-relaxed mb-6">
            {t.bilingual.description}
          </p>
        </div>

        {/* 4 Cartes Doctrines Transfrontalières (FR, CH, BE, LU) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {t.bilingual.doctrines.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#f8f9ff] border border-[#c4c6ce]/60 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-2xl" role="img" aria-label={item.country}>
                    {item.flag}
                  </span>
                  <h3 className="text-lg font-bold font-['Space_Grotesk'] text-[#001126]">
                    {item.country}
                  </h3>
                </div>
                <p className="text-xs text-[#44474d] leading-relaxed">
                  {item.details}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Note de mise en garde sur les spécificités réglementaires */}
        <div className="max-w-3xl mx-auto p-4 rounded-xl bg-[#eef4ff] border border-[#dce9fd] text-center text-xs text-[#0036ce] font-medium">
          <span className="material-symbols-outlined text-[16px] align-middle mr-1.5">
            verified
          </span>
          {t.bilingual.disclaimer}
        </div>
      </div>
    </section>
  );
};
