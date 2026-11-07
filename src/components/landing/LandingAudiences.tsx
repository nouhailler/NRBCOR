import React from 'react';
import { LandingTranslations } from '../../i18n/landingTranslations';

interface LandingAudiencesProps {
  t: LandingTranslations;
}

export const LandingAudiences: React.FC<LandingAudiencesProps> = ({ t }) => {
  return (
    <section className="py-20 lg:py-28 bg-[#f8f9ff] text-[#001126] border-b border-[#e4efff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-['Space_Grotesk'] font-bold tracking-wider text-[#0036ce] uppercase mb-2 block">
            {t.audiences.kicker}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-['Space_Grotesk'] font-bold text-[#001126] tracking-tight mb-4 text-balance">
            {t.audiences.title}
          </h2>
          <p className="text-base text-[#44474d] leading-relaxed">
            {t.audiences.subtitle}
          </p>
        </div>

        {/* 4 Profils Publics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.audiences.profiles.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-[#c4c6ce]/70 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#eef4ff] text-[#0036ce] flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[26px]">{p.icon}</span>
                </div>
                <span className="text-[11px] font-['Space_Grotesk'] font-bold uppercase tracking-wider text-[#3f9d73] block mb-1">
                  {p.role}
                </span>
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-[#001126] mb-3">
                  {p.title}
                </h3>
                <p className="text-xs text-[#44474d] leading-relaxed mb-6">
                  {p.description}
                </p>
              </div>

              {/* Points d'apport clé */}
              <ul className="pt-4 border-t border-[#f0f4f9] space-y-2 text-xs text-[#44474d]">
                {p.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#3f9d73] shrink-0">
                      check
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
