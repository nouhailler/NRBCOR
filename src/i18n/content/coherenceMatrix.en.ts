import { EmergencyScenarioDefinition } from '../../components/EmergencyCoherenceMatrixModal';

export const EMERGENCY_SCENARIOS_EN: EmergencyScenarioDefinition[] = [
  {
    id: 'confinement',
    title: '1. Official Alert with Sheltering Directive',
    category: 'confinement',
    icon: 'home_pin',
    officialInstruction: 'Immediately enter the nearest solid building. Hermetically seal windows, doors, and all ventilation intakes.',
    immediateAction: 'Get indoors, shut down all mechanical ventilation (HVAC, cooker hoods), close windows/shutters, tune to public FM radio.',
    fatalTraps: [
      'Going to pick up children from school (Forbidden: school Safe Haven Plans (PPMS) already protect them; traveling exposes you and blocks first responders).',
      'Placing non-vital phone calls (saturates cellular networks needed for life-threatening distress calls).',
      'Lighting matches or candles (explosion hazard in flammable atmospheres and depletes residual oxygen in sealed rooms).'
    ],
    antiFalseSecurityChecks: [
      'The application NEVER describes a room as 100% airtight without active tape sealing.',
      'The application strictly forbids leaving the shelter before the official all-clear siren or broadcast confirmation.',
      'Never delays access to the 3 vital directives through secondary surveys or diagnostics.'
    ],
    civilSecurityReference: 'National Alert Guide & National Education / Interior Ministry Safe Haven Plan (PPMS)'
  },
  {
    id: 'evacuation',
    title: '2. Evacuation Order from Authorities',
    category: 'evacuation',
    icon: 'directions_run',
    officialInstruction: 'Orderly evacuation conducted ONLY upon formal order from the Prefect or law enforcement authorities.',
    immediateAction: 'Take 72h go-bag + vital identity papers + prescriptions, shut off gas/water/electricity mains, strictly follow the transit corridor established by police.',
    fatalTraps: [
      'Spontaneous, uncoordinated flight: fleeing onto highways can trap you directly in the toxic plume and block emergency convoys.',
      'Fleeing downwind in the plume axis instead of traveling perpendicular to the wind direction.',
      'Returning home to retrieve forgotten personal items.'
    ],
    antiFalseSecurityChecks: [
      'The application explicitly warns that spontaneous flight is lethal and evacuation is carried out only on official orders.',
      'Actual evacuation routes are designated on the ground by police and civil protection; the app does not simulate fictional transit paths.',
      'Reiterates that indoor sheltering remains the default protective rule until evacuation is formally mandated.'
    ],
    civilSecurityReference: 'Operational Doctrine ORSEC Mass Casualties / Prefectural Evacuation Framework'
  },
  {
    id: 'inconnu',
    title: '3. Hazard of Unknown Nature',
    category: 'inconnu',
    icon: 'help',
    officialInstruction: 'General siren alarm or emergency cell broadcast: immediate universal sheltering without delaying to identify the specific toxic agent.',
    immediateAction: 'Take shelter inside a solid building, close all doors/windows, shut off HVAC/ventilation, turn on FM radio to public broadcast frequencies.',
    fatalTraps: [
      'Spontaneous self-administration of potassium iodide: KI ONLY protects the thyroid against radioactive Iodine-131. Useless and medically contraindicated during chemical releases.',
      'Stepping outside to film, observe, or sniff unusual odors.',
      'Delaying shelter to determine whether the accident is biological, chemical, or radiological.'
    ],
    antiFalseSecurityChecks: [
      'The application displays the universal "Shelter + Radio" reflex first without prior questionnaires.',
      'Iodine self-medication is strictly prohibited without an explicit government decree.',
      'The interface warns that the presence or absence of odor is never proof of safety (many lethal agents are completely odorless and colorless).'
    ],
    civilSecurityReference: 'Interministerial Directive on Operational Response to CBRN-E Threats'
  },
  {
    id: 'hors-ligne',
    title: '4. Network Blackout During Consultation',
    category: 'hors-ligne',
    icon: 'wifi_off',
    officialInstruction: 'Cellular networks saturated or disabled: switch immediately to analog terrestrial FM radio broadcasts.',
    immediateAction: 'Activate hand-crank or battery FM radio (87.5 - 108 MHz). Rely on pre-cached offline guides without waiting for internet connectivity.',
    fatalTraps: [
      'Assuming that the lack of smartphone notifications means the danger has passed ("Absence of signal ≠ End of danger").',
      'Placing repeated cellular calls that drain critical battery reserves needed for SOS distress calls.',
      'Relying on unverified neighborhood rumors.'
    ],
    antiFalseSecurityChecks: [
      '100% of vital content, action guides, and autonomy calculations remain fully operational without internet.',
      'The application displays an explicit offline banner and reminds users that offline status does not imply safety.',
      'Zero UI lockups or blank screens when external network calls fail.'
    ],
    civilSecurityReference: 'Telecom Resilience & Business Continuity Guide (ANSSI / DGSCGC)'
  },
  {
    id: 'donnee_manquante',
    title: '5. Missing, Outdated, or Unverified Data Sheet',
    category: 'donnee_manquante',
    icon: 'troubleshoot',
    officialInstruction: 'Operational precautionary principle: in the face of territorial uncertainty or missing data, apply maximum protective posture.',
    immediateAction: 'Adopt the conservative stance: strict indoor sheltering, sealing openings, monitoring emergency radio, inventorying survival supplies.',
    fatalTraps: [
      'Concluding that a geographic area is "safe" merely because it is not listed in a specific database.',
      'Treating a preliminary estimate as a certified physical measurement.',
      'Ignoring a real hazard because a detailed local risk sheet is unavailable.'
    ],
    antiFalseSecurityChecks: [
      'The application NEVER concludes zero hazard or guaranteed safety based on missing territorial records.',
      'Estimates or cached records are prominently marked with capture dates and status ("Approximate / Unverified Record").',
      'A checked box in a readiness checklist is never equated with certified physical quantities of food or water.'
    ],
    civilSecurityReference: 'Homeland Security Code — General Civil Precautionary Principle'
  },
  {
    id: 'arbitrage_officiel',
    title: '6. Conflict Between Guide and Recent Official Directives',
    category: 'arbitrage_officiel',
    icon: 'gavel',
    officialInstruction: 'Absolute legal hierarchy: Directives broadcast in real time by the Prefect, civil security commanders, and police supersede all documentation.',
    immediateAction: 'Execute without hesitation the official order transmitted via cell broadcast, megaphone, civil siren, or public radio.',
    fatalTraps: [
      'Challenging an official evacuation or shelter order on the grounds that an app or handbook indicates otherwise.',
      'Prioritizing generic theoretical advice over tactical instructions adapted to real-time ground conditions.',
      'Delaying compliance to seek confirmation on social media.'
    ],
    antiFalseSecurityChecks: [
      'The application reiterates on EVERY emergency screen that prefectural and rescue orders prevail at all times.',
      'The application strictly defines itself as an educational preparedness tool, NEVER as an operational command authority.',
      'Users can verify this subordination principle on every relevant screen at any time.'
    ],
    civilSecurityReference: 'Homeland Security Code Articles L742-1 et seq. (Police Powers and Direction of Rescue Operations)'
  }
];
