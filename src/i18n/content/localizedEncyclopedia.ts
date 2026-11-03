import {
  GLOSSARY_TERMS,
  HISTORICAL_ERAS,
  COUNTRY_DOCTRINES,
  NRBC_TOOL_CATEGORIES,
  GlossaryTerm,
  HistoricalEra,
  CountryDoctrine,
  NrbcToolCategory
} from '../../data/encyclopediaData';
import {
  GLOSSARY_TERMS_EN,
  HISTORICAL_ERAS_EN,
  COUNTRY_DOCTRINES_EN,
  NRBC_TOOL_CATEGORIES_EN
} from './encyclopedia.en';
import { Language } from '../types';

export interface LocalizedEncyclopediaData {
  glossaryTerms: GlossaryTerm[];
  historicalEras: HistoricalEra[];
  countryDoctrines: CountryDoctrine[];
  toolCategories: NrbcToolCategory[];
}

/**
 * Returns localized datasets for the Encyclopedia view based on active language
 */
export function getLocalizedEncyclopedia(lang: Language): LocalizedEncyclopediaData {
  if (lang === 'en') {
    return {
      glossaryTerms: GLOSSARY_TERMS_EN,
      historicalEras: HISTORICAL_ERAS_EN,
      countryDoctrines: COUNTRY_DOCTRINES_EN,
      toolCategories: NRBC_TOOL_CATEGORIES_EN
    };
  }

  return {
    glossaryTerms: GLOSSARY_TERMS,
    historicalEras: HISTORICAL_ERAS,
    countryDoctrines: COUNTRY_DOCTRINES,
    toolCategories: NRBC_TOOL_CATEGORIES
  };
}
