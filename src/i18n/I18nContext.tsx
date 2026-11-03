import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Language, I18nContextType } from './types';
import { fr } from './locales/fr';
import { en } from './locales/en';
import { storageService } from '../services/storage/IndexedDbStorage';

const translations: Record<Language, Record<string, string>> = {
  fr,
  en
};

const I18nContext = createContext<I18nContextType | null>(null);

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // 1. Priorité au choix explicitement stocké localement
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem('nrbcor_language');
        if (stored === 'en' || stored === 'fr') {
          return stored;
        }
      }
    } catch (e) {
      // Ignorer l'accès au storage en mode strict
    }

    // 2. Par défaut : Français (principe d'intégrité déontologique NRBCOR)
    return 'fr';
  });

  // Mettre à jour l'attribut lang du DOM HTML
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  // Synchroniser avec les réglages IndexedDB sans bloquer le rendu
  useEffect(() => {
    storageService.getSettings().then((settings) => {
      if (settings && (settings as any).language !== language) {
        storageService.saveSettings({
          ...settings,
          language
        } as any).catch(() => {});
      }
    }).catch(() => {});
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('nrbcor_language', lang);
      }
    } catch (e) {}
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  const locale = language === 'en' ? 'en-US' : 'fr-FR';

  const t = (key: string, params?: Record<string, string | number>): string => {
    const dict = translations[language] || translations.fr;
    let template = dict[key];

    // Fallback gracieux sur le français si la clé anglaise n'est pas trouvée
    if (template === undefined) {
      template = translations.fr[key];
    }

    if (template === undefined) {
      return key;
    }

    if (!params) {
      return template;
    }

    return template.replace(/\{(\w+)\}/g, (_, k) => {
      return params[k] !== undefined ? String(params[k]) : `{${k}}`;
    });
  };

  const formatDate = (date: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
    try {
      const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
      if (isNaN(d.getTime())) return String(date);
      return new Intl.DateTimeFormat(locale, options || {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(d);
    } catch (e) {
      return String(date);
    }
  };

  const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
    try {
      return new Intl.NumberFormat(locale, options).format(value);
    } catch (e) {
      return String(value);
    }
  };

  const formatRelativeTime = (date: Date | string | number): string => {
    try {
      const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
      const now = new Date();
      const diffSec = Math.round((now.getTime() - d.getTime()) / 1000);

      if (diffSec < 60) {
        return language === 'en' ? 'Just now' : "À l'instant";
      }
      const diffMin = Math.round(diffSec / 60);
      if (diffMin < 60) {
        return language === 'en' ? `${diffMin}m ago` : `Il y a ${diffMin} min`;
      }
      const diffHours = Math.round(diffMin / 60);
      if (diffHours < 24) {
        return language === 'en' ? `${diffHours}h ago` : `Il y a ${diffHours} h`;
      }
      const diffDays = Math.round(diffHours / 24);
      return language === 'en' ? `${diffDays}d ago` : `Il y a ${diffDays} j`;
    } catch (e) {
      return '';
    }
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      formatDate,
      formatNumber,
      formatRelativeTime,
      locale
    }),
    [language, locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useTranslation = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    // Fallback sécurisé si utilisé hors provider (tests, utilitaires)
    return {
      language: 'fr',
      setLanguage: () => {},
      t: (key) => fr[key as keyof typeof fr] || key,
      formatDate: (d) => String(d),
      formatNumber: (n) => String(n),
      formatRelativeTime: () => '',
      locale: 'fr-FR'
    };
  }
  return context;
};
