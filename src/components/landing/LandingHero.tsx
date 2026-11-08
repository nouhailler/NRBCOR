import React from 'react';
import { LandingTranslations } from '../../i18n/landingTranslations';

interface LandingHeroProps {
  t: LandingTranslations;
  onLaunchApp: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ t, onLaunchApp }) => {
  return (
    <section id="top" className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-[#001126] text-white">
      {/* Fond subtil architectural & gradients discrets */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0a274c] via-[#001126] to-[#000a17] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-40 right-10 w-96 h-96 rounded-full bg-[#3f9d73] blur-[120px]" />
        <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-[#0036ce] blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Colonne Gauche : Argumentaire & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Kicker sobre unboxed avec logo */}
            <div className="flex items-center gap-3 text-xs font-['Space_Grotesk'] tracking-wider uppercase text-[#98f6c5] font-bold mb-4">
              <img src="/logo.svg" alt="" className="w-6 h-6 object-contain" aria-hidden="true" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Titre Principal & Slogan */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-['Space_Grotesk'] font-bold tracking-tight text-white leading-tight mb-4 text-balance">
              {t.hero.slogan}
            </h1>

            {/* Nom officiel institutionnel */}
            <p className="text-sm sm:text-base font-semibold text-[#98f6c5] mb-4 tracking-wide font-['Space_Grotesk']">
              {t.hero.titleLine2}
            </p>

            {/* Sous-titre synthétique */}
            <p className="text-base sm:text-lg text-[#c4c6ce] leading-relaxed mb-8 max-w-2xl">
              {t.hero.subtitle}
            </p>

            {/* Deux boutons d'action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <button
                type="button"
                onClick={onLaunchApp}
                className="min-h-[50px] px-7 py-3 rounded-xl bg-[#98f6c5] hover:bg-[#b2f8d4] text-[#001126] font-['Space_Grotesk'] font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>{t.hero.primaryCta}</span>
                <span className="material-symbols-outlined text-[18px]">launch</span>
              </button>

              <a
                href="#features"
                className="min-h-[50px] px-6 py-3 rounded-xl bg-[#05172e] hover:bg-[#0b2447] text-white border border-[#1e3a5f] hover:border-[#3f9d73] font-['Space_Grotesk'] font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>{t.hero.secondaryCta}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
              </a>
            </div>

            {/* Indicateurs visuels unboxed (zéro pill discipline, séparateurs ·) */}
            <div className="pt-6 border-t border-[#12263f] w-full flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-[#94a3b8] font-['Space_Grotesk']">
              <span className="flex items-center gap-1.5 text-white">
                <span className="material-symbols-outlined text-[15px] text-[#98f6c5]">offline_pin</span>
                <span>{t.hero.proofOffline}</span>
              </span>
              <span aria-hidden="true" className="text-[#334155]">·</span>
              <span className="flex items-center gap-1.5 text-white">
                <span className="material-symbols-outlined text-[15px] text-[#98f6c5]">install_mobile</span>
                <span>{t.hero.proofPwa}</span>
              </span>
              <span aria-hidden="true" className="text-[#334155]">·</span>
              <span className="flex items-center gap-1.5 text-white">
                <span className="material-symbols-outlined text-[15px] text-[#98f6c5]">translate</span>
                <span>{t.hero.proofBilingual}</span>
              </span>
              <span aria-hidden="true" className="text-[#334155]">·</span>
              <span className="flex items-center gap-1.5 text-white">
                <span className="material-symbols-outlined text-[15px] text-[#98f6c5]">lock</span>
                <span>{t.hero.proofPrivacy}</span>
              </span>
            </div>
          </div>

          {/* Colonne Droite : Composition visuelle des captures d'écran réelles */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none rounded-2xl p-2 bg-[#05172e]/90 border border-[#1e3a5f] shadow-2xl backdrop-blur-sm group">
              <div className="overflow-hidden rounded-xl bg-[#000a17] border border-[#12263f]">
                <img
                  src="/screenshots/nrbcor_desktop_home.png"
                  alt={t.hero.imageCaption}
                  className="w-full h-auto object-cover rounded-xl transition-all duration-300"
                  loading="eager"
                />
              </div>

              {/* Incrustation d'un smartphone réel en bas à droite */}
              <div className="hidden sm:block absolute -bottom-6 -right-4 w-44 rounded-2xl p-1 bg-[#05172e] border-2 border-[#1e3a5f] shadow-2xl overflow-hidden transition-transform hover:scale-105">
                <img
                  src="/screenshots/nrbcor_mobile_reagir.png"
                  alt="Aperçu Smartphone NRBCOR"
                  className="w-full h-auto rounded-xl object-cover"
                  loading="eager"
                />
              </div>

              {/* Légende discrète sous l'image */}
              <div className="px-3 py-2.5 flex items-center justify-between text-[11px] font-['Space_Grotesk'] text-[#94a3b8]">
                <span className="flex items-center gap-1 text-[#98f6c5]">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  <span>{t.hero.imageCaption}</span>
                </span>
                <span className="text-[#64748b]">v1.6.0 PWA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
