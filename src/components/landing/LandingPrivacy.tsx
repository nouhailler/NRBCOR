import React from 'react';
import { LandingTranslations } from '../../i18n/landingTranslations';

interface LandingPrivacyProps {
  t: LandingTranslations;
}

export const LandingPrivacy: React.FC<LandingPrivacyProps> = ({ t }) => {
  return (
    <section className="py-20 lg:py-28 bg-white text-[#001126] border-b border-[#e4efff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-['Space_Grotesk'] font-bold tracking-wider text-[#3f9d73] uppercase mb-2 block">
            {t.privacy.kicker}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-['Space_Grotesk'] font-bold text-[#001126] tracking-tight mb-4 text-balance">
            {t.privacy.title}
          </h2>
          <blockquote className="text-lg font-['Space_Grotesk'] font-semibold text-[#0036ce] mb-4">
            {t.privacy.mainQuote}
          </blockquote>
          <p className="text-base text-[#44474d] leading-relaxed">
            {t.privacy.intro}
          </p>
        </div>

        {/* 4 Garanties de Souveraineté */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.privacy.points.map((pt, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#f8f9ff] border border-[#c4c6ce]/70 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-[#c4c6ce]/60 text-[#3f9d73] flex items-center justify-center mb-4 shadow-2xs">
                  <span className="material-symbols-outlined text-[26px]">{pt.icon}</span>
                </div>
                <h3 className="text-base font-bold font-['Space_Grotesk'] text-[#001126] mb-2">
                  {pt.title}
                </h3>
                <p className="text-xs text-[#44474d] leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
