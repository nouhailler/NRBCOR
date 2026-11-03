import { EMERGENCY_SCENARIOS, EmergencyScenarioDefinition } from '../../components/EmergencyCoherenceMatrixModal';
import { EMERGENCY_SCENARIOS_EN } from './coherenceMatrix.en';
import { Language } from '../types';

export function getLocalizedEmergencyScenarios(lang: Language): EmergencyScenarioDefinition[] {
  if (lang === 'en') {
    return EMERGENCY_SCENARIOS_EN;
  }
  return EMERGENCY_SCENARIOS;
}
