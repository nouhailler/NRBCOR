import React from 'react';
import { LandingTranslations } from '../../i18n/landingTranslations';

interface LandingDisclaimerProps {
  t: LandingTranslations;
}

export const LandingDisclaimer: React.FC<LandingDisclaimerProps> = ({ t }) => {
  return (
    <section className="py-16 bg-white text-[#001126] border-b border-[#e4efff]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-[#fffbeb] border border-[#fef3c7] shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/20 text-[#b45309] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[24px]">gavel</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-['Space_Grotesk'] font-bold uppercase tracking-wider text-[#b45309] mb-1">
                {t.disclaimer.kicker}
              </span>
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-[#92400e] mb-2">
                {t.disclaimer.title}
              </h3>
              <p className="text-xs text-[#78350f] leading-relaxed mb-3">
                <strong>{t.disclaimer.notice}</strong> {t.disclaimer.rule}
              </p>

              <ul className="space-y-1.5 text-xs text-[#78350f] list-disc list-inside leading-relaxed">
                {t.disclaimer.points.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
