import React from 'react';
import { useTranslation } from '../i18n/I18nContext';
import { Language } from '../i18n/types';
import { triggerHaptic } from '../utils/haptics';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'compact',
  className = ''
}) => {
  const { language, setLanguage } = useTranslation();

  const handleSelectLanguage = (lang: Language) => {
    if (lang !== language) {
      triggerHaptic('light');
      setLanguage(lang);
    }
  };

  if (variant === 'compact') {
    return (
      <div
        role="radiogroup"
        aria-label="Sélection de langue / Language selection"
        className={`inline-flex items-center bg-[#e4efff] p-0.5 rounded-lg border border-[#c4c6ce] shadow-2xs ${className}`}
      >
        <button
          type="button"
          role="radio"
          aria-checked={language === 'fr'}
          onClick={() => handleSelectLanguage('fr')}
          className={`h-7 px-2 rounded-md font-['Space_Grotesk'] text-[11px] font-bold uppercase transition-all cursor-pointer ${
            language === 'fr'
              ? 'bg-[#001126] text-white shadow-xs'
              : 'text-[#44474d] hover:text-[#001126]'
          }`}
          title="Afficher l'application en Français"
        >
          FR
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={language === 'en'}
          onClick={() => handleSelectLanguage('en')}
          className={`h-7 px-2 rounded-md font-['Space_Grotesk'] text-[11px] font-bold uppercase transition-all cursor-pointer ${
            language === 'en'
              ? 'bg-[#001126] text-white shadow-xs'
              : 'text-[#44474d] hover:text-[#001126]'
          }`}
          title="Display application in English"
        >
          EN
        </button>
      </div>
    );
  }

  // Variant "full" pour le menu hamburger et les paramètres
  return (
    <div
      role="radiogroup"
      aria-label="Sélection de la langue de l'application"
      className={`flex flex-col gap-2 ${className}`}
    >
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          role="radio"
          aria-checked={language === 'fr'}
          onClick={() => handleSelectLanguage('fr')}
          className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
            language === 'fr'
              ? 'bg-[#eef4ff] border-[#0036ce] text-[#001258] shadow-xs'
              : 'bg-white border-[#c4c6ce] text-[#44474d] hover:border-[#0036ce]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-[18px]">🇫🇷</span>
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-[13px] font-bold text-[#001126]">
                Français
              </span>
              <span className="text-[10px] text-[#74777e]">Langue officielle de référence</span>
            </div>
          </div>
          {language === 'fr' && (
            <span className="material-symbols-outlined text-[18px] text-[#0036ce]">check_circle</span>
          )}
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={language === 'en'}
          onClick={() => handleSelectLanguage('en')}
          className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
            language === 'en'
              ? 'bg-[#eef4ff] border-[#0036ce] text-[#001258] shadow-xs'
              : 'bg-white border-[#c4c6ce] text-[#44474d] hover:border-[#0036ce]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-[18px]">🇬🇧</span>
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-[13px] font-bold text-[#001126]">
                English
              </span>
              <span className="text-[10px] text-[#74777e]">Full international version</span>
            </div>
          </div>
          {language === 'en' && (
            <span className="material-symbols-outlined text-[18px] text-[#0036ce]">check_circle</span>
          )}
        </button>
      </div>
    </div>
  );
};
