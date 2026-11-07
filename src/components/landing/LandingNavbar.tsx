import React from 'react';
import { LandingTranslations } from '../../i18n/landingTranslations';
import { LANDING_CONFIG } from '../../config/landingConfig';

interface LandingNavbarProps {
  t: LandingTranslations;
  language: 'fr' | 'en';
  onToggleLanguage: (lang: 'fr' | 'en') => void;
  onLaunchApp: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  t,
  language,
  onToggleLanguage,
  onLaunchApp,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#001126]/95 backdrop-blur-md border-b border-[#12263f] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1 : Brand & Wordmark */}
        <a
          href="#top"
          className="flex items-center gap-3 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3f9d73] rounded-lg shrink-0"
        >
          <img
            src="/logo.svg"
            alt="NRBCOR Logo"
            className="w-9 h-9 object-contain shrink-0"
          />
          <div className="flex flex-col">
            <span className="font-['Space_Grotesk'] text-xl font-bold tracking-tight text-white whitespace-nowrap leading-none">
              NRBCOR
            </span>
            <span className="text-[10px] font-['Space_Grotesk'] tracking-wider uppercase text-[#98f6c5] font-semibold mt-1 hidden sm:inline">
              Protection Civile
            </span>
          </div>
        </a>

        {/* Zone 2 : Liens de navigation textuels élégants */}
        <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-[#c4c6ce]">
          <a
            href="#why"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
          >
            {t.nav.why}
          </a>
          <a
            href="#risks"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
          >
            {t.nav.risks}
          </a>
          <a
            href="#features"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
          >
            {t.nav.features}
          </a>
          <a
            href="#offline"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
          >
            {t.nav.offline}
          </a>
          <a
            href="#gallery"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
          >
            {t.nav.gallery}
          </a>
        </nav>

        {/* Zone 3 : Sélecteur FR/EN & Action Primaire Unique */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Sélecteur de langue bilingue */}
          <div
            role="group"
            aria-label="Language selection"
            className="flex items-center p-0.5 bg-[#05172e] rounded-lg border border-[#1e3a5f]"
          >
            <button
              type="button"
              onClick={() => onToggleLanguage('fr')}
              aria-pressed={language === 'fr'}
              className={`px-2.5 py-1 text-xs font-['Space_Grotesk'] font-bold rounded-md transition-all ${
                language === 'fr'
                  ? 'bg-[#3f9d73] text-white shadow-xs'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => onToggleLanguage('en')}
              aria-pressed={language === 'en'}
              className={`px-2.5 py-1 text-xs font-['Space_Grotesk'] font-bold rounded-md transition-all ${
                language === 'en'
                  ? 'bg-[#3f9d73] text-white shadow-xs'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Lien GitHub discret */}
          <a
            href={LANDING_CONFIG.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={t.nav.github}
            className="w-9 h-9 rounded-lg border border-[#1e3a5f] bg-[#05172e] text-[#c4c6ce] hover:text-white hover:border-[#3f9d73] transition-colors flex items-center justify-center shrink-0"
            aria-label="GitHub Repository"
          >
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* Action Primaire Unique */}
          <button
            type="button"
            onClick={onLaunchApp}
            className="px-4 py-2 text-xs sm:text-sm font-['Space_Grotesk'] font-bold text-[#001126] bg-[#98f6c5] hover:bg-[#b2f8d4] rounded-lg transition-colors whitespace-nowrap shadow-sm hover:shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <span>{t.nav.launchApp}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </header>
  );
};
