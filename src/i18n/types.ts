/**
 * NRBCOR Internationalization (i18n) Type Definitions
 * Strict TypeScript typing for English and French translations.
 */

export type Language = 'fr' | 'en';

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatRelativeTime: (date: Date | string | number) => string;
  locale: string;
}
