import { ProtocolData, PROTOCOLS_DATA } from '../../data/protocols';
import { PROTOCOLS_DATA_EN } from './protocols.en';
import { Language } from '../types';

/**
 * Returns the localized ProtocolData for a given protocol ID according to the current language.
 * Falls back to French canonical doctrine if an English field is missing.
 */
export function getLocalizedProtocol(id: string, lang: Language): ProtocolData {
  if (lang === 'en' && PROTOCOLS_DATA_EN[id]) {
    return PROTOCOLS_DATA_EN[id];
  }
  return PROTOCOLS_DATA[id] || PROTOCOLS_DATA['nucleaire'];
}

/**
 * Returns all protocols as a record in the desired language.
 */
export function getAllLocalizedProtocols(lang: Language): Record<string, ProtocolData> {
  if (lang === 'en') {
    return PROTOCOLS_DATA_EN;
  }
  return PROTOCOLS_DATA;
}
