import React from 'react';
import { LandingTranslations } from '../../i18n/landingTranslations';

interface LandingOfflineProps {
  t: LandingTranslations;
  onLaunchApp: () => void;
}

export const LandingOffline: React.FC<LandingOfflineProps> = ({ t, onLaunchApp }) => {
  return (
    <section id="offline" className="py-20 lg:py-28 bg-[#001126] text-white border-b border-[#12263f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-['Space_Grotesk'] font-bold tracking-wider text-[#98f6c5] uppercase mb-2 block">
            {t.offline.kicker}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-['Space_Grotesk'] font-bold text-white tracking-tight mb-4 text-balance">
            {t.offline.title}
          </h2>
          <blockquote className="text-lg sm:text-xl font-['Space_Grotesk'] font-semibold text-[#98f6c5] mb-4">
            {t.offline.mainQuote}
          </blockquote>
          <p className="text-base text-[#c4c6ce] leading-relaxed">
            {t.offline.intro}
          </p>
        </div>

        {/* 4 Piliers Techniques de l'Autonomie Hors-Ligne */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {t.offline.features.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#05172e] border border-[#1e3a5f] flex flex-col justify-between hover:border-[#3f9d73] transition-all"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#3f9d73]/20 text-[#98f6c5] flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[26px]">{item.icon}</span>
                </div>
                <h3 className="text-base font-bold font-['Space_Grotesk'] text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Encadré de Transparence Opérationnelle (Nuance Honnête Géorisques) */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#0b2447]/60 border border-[#1e3a5f] max-w-4xl mx-auto flex items-start gap-4 text-xs text-[#c4c6ce] leading-relaxed">
          <span className="material-symbols-outlined text-[24px] text-[#3f9d73] shrink-0 mt-0.5">
            info
          </span>
          <p>{t.offline.nuanceAlert}</p>
        </div>

        {/* Bouton d'installation / test */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onLaunchApp}
            className="px-6 py-3 rounded-xl bg-[#98f6c5] hover:bg-[#b2f8d4] text-[#001126] font-['Space_Grotesk'] font-bold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">install_mobile</span>
            <span>Installer l'application PWA hors-ligne</span>
          </button>
        </div>
      </div>
    </section>
  );
};
