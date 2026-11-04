/**
 * English Translation Dictionary (Secondary full language)
 * NRBCOR Civil Protection & CBRN Resilience
 */

import { TranslationDictionary } from './fr';

export const en: TranslationDictionary = {
  // -------------------------------------------------------------
  // COMMON & GLOBAL UI
  // -------------------------------------------------------------
  'common.appName': 'NRBCOR',
  'common.appSubtitle': 'Civil Protection & CBRN Risks',
  'common.offline': 'Offline',
  'common.online': 'Online',
  'common.offlineBadge': 'Offline Mode • 100% Embedded',
  'common.onlineBadge': 'Network Detected • Direct Official Data',
  'common.back': 'Back',
  'common.close': 'Close',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.save': 'Save',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.add': 'Add',
  'common.search': 'Search',
  'common.filter': 'Filter',
  'common.all': 'All',
  'common.print': 'Print',
  'common.export': 'Export',
  'common.import': 'Import',
  'common.loading': 'Loading...',
  'common.empty': 'No items found',
  'common.error': 'An error occurred',
  'common.success': 'Operation successful',
  'common.warning': 'Warning',
  'common.critical': 'Critical',
  'common.info': 'Information',
  'common.days': 'days',
  'common.hours': 'hours',
  'common.minutes': 'minutes',
  'common.seconds': 'seconds',
  'common.liters': 'liters',
  'common.people': 'people',
  'common.person': 'person',
  'common.verified': 'Verified',
  'common.pending': 'Needs review',
  'common.draft': 'Draft',
  'common.officialDoctrines': 'Official Doctrines',
  'common.zeroCloud': '100% Offline • Zero-Cloud',

  // -------------------------------------------------------------
  // NAVIGATION & HEADER
  // -------------------------------------------------------------
  'nav.home': 'Home',
  'nav.react': 'React',
  'nav.guides': 'Guides',
  'nav.prep': 'Preparedness',
  'nav.myPlan': 'My Plan',
  'nav.crisis': 'Crisis',
  'nav.crisisButton': 'CRISIS',
  'nav.openMenu': 'Open full menu',
  'nav.profileMode': 'Profile mode',
  'nav.simplified': 'General Public',
  'nav.expert': 'Expert',
  'nav.install': 'Install',
  'nav.theme': 'Theme',
  'nav.themeLight': 'Light Theme',
  'nav.themeDark': 'Dark Theme',
  'nav.language': 'Language',
  'nav.sources': 'Sources & Traceability',
  'nav.settings': 'Settings',
  'header.autonomousStorage': 'Autonomous Storage',
  'header.installTitle': 'Install application on your mobile device or computer',
  'header.profileSimplifiedTooltip': 'Current mode: General Public (Click for Expert Mode)',
  'header.profileExpertTooltip': 'Current mode: Expert / Trainer (Click for General Public Mode)',

  // Hamburger Menu Categories
  'menu.catUrgence': '1. Emergency & Immediate Reflexes',
  'menu.modeCrise': 'Simplified Crisis Mode (Big Buttons)',
  'menu.reagirNow': 'React Now Mode',
  'menu.deshabillage': 'Emergency Undressing & Decontamination (8 steps)',
  'menu.confinement': 'Shelter-in-Place Airtight Guide',
  'menu.siren': 'National Alert Sirens & Audio Simulator',
  
  'menu.catDoctrines': '2. CBRN Risk Sheets & Doctrines',
  'menu.allGuides': 'Full Guides Catalogue',
  'menu.ficheNucleaire': 'Nuclear Sheet (Power Plant / Reactor Incident)',
  'menu.ficheChimique': 'Chemical Sheet (Seveso / Toxic Releases)',
  'menu.ficheBio': 'Biological Sheet (Pathogens / Toxins)',
  'menu.ficheRadiologique': 'Radiological Sheet (Orphan Sources / Irradiations)',
  'menu.ficheIode': 'Stable Iodine Sheet (KI 65mg Dosage)',
  'menu.encyclopedia': 'CBRN Risk Encyclopedia & History',
  'menu.glossary': 'A-Z Glossary of Terms & Acronyms',

  'menu.catResilience': '3. Resilience & Preparedness',
  'menu.suisJePret': 'Readiness Dashboard "Am I Ready?"',
  'menu.kit72h': '72-Hour Emergency Kit Checklist',
  'menu.inventory': 'Supplies Inventory & Expiry Tracking',
  'menu.familyPlan': 'Family Emergency Safety Plan',
  'menu.georisques': 'Local Hazards & Géorisques (Live / Cache)',
  'menu.cartePerimetres': 'Offline Perimeters Map (100% Autonomous)',

  'menu.catExercices': '4. Training & Drills',
  'menu.formation': 'Crisis Immersion Simulations & CBRN Quiz',

  'menu.catSysteme': '5. System Settings & Data',
  'menu.systemSettings': 'Updates & System Settings',
  'menu.preferences': 'Preferences, Text Scale & Data Export',
  'menu.legal': 'Legal Notice & Onboarding',
  'menu.wipe': 'Reset Application Data',
  'menu.wipeDesc': 'Start from a clean slate or reload demo data',

  // -------------------------------------------------------------
  // HOME VIEW
  // -------------------------------------------------------------
  'home.badgePwa': '100% OFFLINE PWA • SOVEREIGN LOCAL STORAGE',
  'home.title': 'Civil Protection & CBRN Resilience',
  'home.subtitle': 'Emergency protocols, 72h survival kit and guides for technological hazards.',
  'home.installTitle': 'Install application on this device',
  'home.installSubtitle': 'Available fully offline directly from your home screen.',
  'home.installBtn': 'Install',
  'home.urgentSection': 'Emergency or Active Alert?',
  'home.urgentDesc': 'Immediate guidance without internet. Shelter-in-place, decontamination, and vital safety actions.',
  'home.vitalPriority': 'Vital Priority',
  'home.openCrisis': 'Simplified Crisis Mode (Big Buttons)',
  'home.openReact': 'React Guides',
  'home.openRadar': 'Perimeters Map (PPI Radar)',
  'home.noAutoCall': 'Does not trigger automatic calls to emergency services',
  'home.stepByStep': 'Step-by-Step Emergency Procedures',
  'home.immediate': 'IMMEDIATE',
  'home.dashboardTitle': 'Am I ready?',
  'home.dashboardSubtitle': 'Personalized readiness dashboard & household autonomy',
  'home.viewScore': 'View score',
  'home.targetAutonomy': 'Target autonomy: 72 hours',
  'home.calculatedLocally': 'Calculated 100% on-device',
  'home.water72h': 'Water 72h',
  'home.waterNorm': '3L / day / pers',
  'home.infoAlert': 'Alert Info',
  'home.radioFm': 'FM Radio',
  'home.needs': 'Needs',
  'home.adjustable': 'Customizable',
  'home.openDashboard': 'Open my household resilience dashboard',

  // -------------------------------------------------------------
  // REACT VIEW
  // -------------------------------------------------------------
  'react.stressNormal': 'Standard Mode',
  'react.stressExtreme': 'High-Contrast Extreme Mode',
  'react.listenAudio': 'Read Instructions Aloud',
  'react.stopAudio': 'Stop Speech',
  'react.whatToDoNow': 'WHAT TO DO RIGHT NOW? (0-60s Triage)',
  'react.countriesBadge': 'FR • CH • BE • LU',
  'react.crisisSimplified': 'Simplified Crisis Mode',
  'react.crisisSimplifiedDesc': '4 large-format vital actions (Shelter / Evacuate / Decontaminate / Call)',
  'react.openReflexScreen': 'Open reflex screen',
  'react.sixScenarios': '6 Critical Scenarios P1',
  'react.radarPpi': 'PPI Radar',
  'react.officialWarning': 'OFFICIAL NOTICE: Instructions broadcast by local Prefectures, civil protection, and emergency services (FR-Alert, Alertswiss, BE-Alert, public radio) ALWAYS supersede educational guidelines.',
  'react.selectHazard': 'Select the hazard type to display immediate safety reflexes:',
  'react.nuclearTitle': 'Nuclear',
  'react.radiologicalTitle': 'Radiological',
  'react.biologicalTitle': 'Biological',
  'react.chemicalTitle': 'Chemical',
  'react.fullProtocol': 'Consult full operational protocol',
  'react.immediateReflexes': 'IMMEDIATE REFLEXES (0 - 15 MIN)',
  'react.vitalRule': 'VITAL RULE:',
  'react.forbiddenActions': 'STRICTLY PROHIBITED ACTIONS:',
  'react.iodineBanner': 'Do NOT take stable iodine without an explicit official order',
  'react.iodineConsult': 'View Stable Iodine Guidelines & Dosage',
  'react.allGuidesCatalog': 'Browse complete guides catalogue',
  'react.traceabilityRegister': 'Consult Traceability Register & Official Sources (v2.4.1)',

  // -------------------------------------------------------------
  // CRISIS VIEW
  // -------------------------------------------------------------
  'crisis.title': 'IMMEDIATE CRISIS MODE',
  'crisis.subtitle': 'Stress-Adapted Reflex Orientation • 4 Vital Actions',
  'crisis.exit': 'Exit crisis mode',
  'crisis.btnConfine': '1. SHELTER-IN-PLACE',
  'crisis.btnConfineDesc': 'Central room, seal openings, shut off ventilation, air out post-alert',
  'crisis.btnEvacuate': '2. EVACUATE',
  'crisis.btnEvacuateDesc': 'ONLY upon formal instruction from authorities',
  'crisis.btnDecontam': '3. DECONTAMINATE',
  'crisis.btnDecontamDesc': 'Undress top-to-bottom without shaking, wash gently without scrubbing',
  'crisis.btnCall': '4. CALL EMERGENCY SERVICES',
  'crisis.btnCallDesc': 'Official emergency lines (112, 18, 15, 144, 100)',
  'crisis.orderWarning': 'Civil protection and governmental orders take precedence at all times.',

  // -------------------------------------------------------------
  // WHAT TO DO RIGHT NOW? (EMERGENCY REFLEX MODAL)
  // -------------------------------------------------------------
  'reflex.modalTitle': 'What to do right now?',
  'reflex.modalSubtitle': '0-60 Seconds Reflex Triage • Civil Protection Conduct',
  'reflex.tabReflexes': '4 Vital Reflexes',
  'reflex.tabNumbers': 'Emergency Numbers',
  'reflex.tabMessage': 'Emergency Call Script',
  'reflex.close': 'Close reflex guide',
  'reflex.case1Title': 'I hear the emergency siren or received an alert notification',
  'reflex.case1Points': 'Immediately seek shelter in the nearest solid masonry building. Close and seal windows, doors, and vents. Turn off HVAC/VMC systems. Tune in to public radio (France Bleu / RTS / RTBF). Keep phone lines free for emergency calls.',
  'reflex.case2Title': 'Abnormal chemical smell, dense vapor cloud or stinging sensations',
  'reflex.case2Points': 'Move crosswind (perpendicular to wind direction) if outdoors. Protect mouth and nose with a damp cloth without rubbing. Never shelter in basements or cellars (heavy toxic gases sink into low points).',
  'reflex.case3Title': 'Nuclear alert / Radiological fallout',
  'reflex.case3Points': 'Shelter in the center or basement of a heavy building (dense walls attenuate gamma radiation). Strict iodine rule: NEVER ingest potassium iodide tablets without formal government order. Avoid rainwater, cisterns, and fresh garden vegetables.',
  'reflex.case4Title': 'Person contaminated or sprayed by toxic substance',
  'reflex.case4Points': 'Carefully remove outer clothing from top to bottom without shaking (eliminates 80-90% of toxic load). Gently wash skin with lukewarm water and mild soap without abrasive scrubbing. Double-bag contaminated textiles outside the living area.',
  'reflex.messageScriptTitle': 'Standard emergency call script (112 / 18 / 15 / 144)',
  'reflex.scriptWho': '1. WHO: My name, identity, and callback phone number.',
  'reflex.scriptWhere': '2. WHERE: Exact address, municipality, floor, visual landmarks.',
  'reflex.scriptWhat': '3. WHAT: Nature of danger observed (smoke, odor, explosion, sirens).',
  'reflex.scriptHowMany': '4. HOW MANY: Number of people present and visible symptoms.',
  'reflex.scriptActions': '5. ACTIONS: Shelter sealed, ventilation off, no unprescribed medication.',

  // -------------------------------------------------------------
  // READINESS DASHBOARD (SUIS-JE PRÊT ?)
  // -------------------------------------------------------------
  'readiness.title': 'Household Readiness Dashboard',
  'readiness.subtitle': 'Objective, transparent measure of domestic emergency preparedness',
  'readiness.scoreLabel': 'Overall Resilience Score',
  'readiness.points': 'pts',
  'readiness.hypothesesTitle': 'Transparent Calculation Hypotheses',
  'readiness.waterHypothesis': 'Drinking water: 3 Liters / person / day (2L hydration + 1L basic hygiene) + 0.5L / pet.',
  'readiness.foodHypothesis': 'Food supplies: 2,000 kcal / adult / day without cooking required in case of gas/power outage.',
  'readiness.householdBreakdownTitle': 'Calculated Household Needs',
  'readiness.missingDataTitle': 'Missing Data & Estimates',
  'readiness.topThreeTitle': 'Top 3 Recommended Actions Next',
  'readiness.pointsGain': 'Estimated gain',
  'readiness.pillarsTitle': '5 Pillars of Civil Preparedness',
  'readiness.pillarWater': 'Vital Supplies (Water & Food Storage)',
  'readiness.pillarEnergy': 'Energy, Lighting & Emergency Communications',
  'readiness.pillarHealth': 'Health, First Aid & Specific Needs',
  'readiness.pillarPlan': 'Family Emergency Plan & Evacuation Routes',
  'readiness.pillarLogistics': 'Logistics Vigilance & Expiry Maintenance',
  'readiness.modifyHousehold': 'Edit household configuration',

  // -------------------------------------------------------------
  // PERSONAL EMERGENCY DOSSIER
  // -------------------------------------------------------------
  'dossier.title': 'Personal Emergency Dossier',
  'dossier.subtitle': 'Printable offline emergency record with granular selection',
  'dossier.privacyWarning': 'Strict Privacy Guarantee: Your personal and medical information remains exclusively stored on your local device. It is never transmitted to remote servers nor included in shared QR codes.',
  'dossier.selectSections': 'Select sections to include in the printed record:',
  'dossier.sectionContacts': 'Priority contacts (family and out-of-zone relay)',
  'dossier.sectionAssembly': 'Designated family assembly points',
  'dossier.sectionSpecific': 'Assistance requirements & mobility needs',
  'dossier.sectionMedical': 'Critical medical details (treatments, allergies, blood type)',
  'dossier.printBtn': 'Print Emergency Dossier (A4 / Pocket Format)',

  // -------------------------------------------------------------
  // TRAINER MODE
  // -------------------------------------------------------------
  'trainer.title': 'Trainer Mode & Collective Drills',
  'trainer.subtitle': 'Civic workshop facilitation and crisis drill simulation without servers',
  'trainer.selectScenario': 'Select drill scenario:',
  'trainer.pedagogicalGoals': 'Pedagogical objectives of the session:',
  'trainer.fatalTraps': 'Fatal mistakes to deconstruct in debriefing:',
  'trainer.startDrill': 'Launch timed drill exercise',
  'trainer.printDebrief': 'Print training debrief sheet',

  // -------------------------------------------------------------
  // OFFLINE PERIMETERS MAP
  // -------------------------------------------------------------
  'carte.title': 'Offline Perimeters Map',
  'carte.subtitle': 'Autonomous database of 19 nuclear power plants and 22 major Seveso industrial sites.',
  'carte.refPosition': 'Reference location',
  'carte.gpsLocal': 'Local GPS',
  'carte.radarMode': 'Concentric Radar (50 km)',
  'carte.franceMode': 'National Map (41 Sites)',
  'carte.inReflex': 'Immediate Reflex Zone (< 5 km)',
  'carte.inPpi': 'Emergency Planning Zone (PPI)',
  'carte.inVigilance': 'Vigilance Perimeter (50 km)',
  'carte.outPpi': 'Outside Planning Zone',

  // -------------------------------------------------------------
  // GÉORISQUES & LOCAL HAZARDS
  // -------------------------------------------------------------
  'georisques.title': 'Territorial Risk Assessment',
  'georisques.subtitle': 'Prefectural orders, technological risk plans (PPRT), and Seveso sites.',
  'georisques.freshnessTitle': 'Data Freshness State',
  'georisques.originLive': 'Direct Official Géorisques Stream',
  'georisques.originCache': 'Saved Local Offline Cache',
  'georisques.originPreload': 'Preloaded Autonomous Dataset',
  'georisques.originNone': 'Not Synchronized',
  'georisques.searchCommune': 'Search municipality by name or postal code...',
  'georisques.inspectSources': 'View official data sources',

  // -------------------------------------------------------------
  // SETTINGS & SYSTEM
  // -------------------------------------------------------------
  'settings.title': 'Settings & Storage',
  'settings.subtitle': 'Sovereign management of your local offline data and display.',
  'settings.languageSection': 'Application Language',
  'settings.langFr': 'Français (French)',
  'settings.langEn': 'English',
  'settings.themeSection': 'Visual Theme',
  'settings.textSizeSection': 'Text Size',
  'settings.backupSection': 'Local Backup & Restore',
  'settings.exportBackup': 'Download full backup (JSON)',
  'settings.restoreBackup': 'Restore data backup (JSON)',
  'settings.wipeSection': 'Danger Zone',
  'settings.wipeBtn': 'Wipe all local data',

  // -------------------------------------------------------------
  // ENCYCLOPEDIA & GLOSSARY
  // -------------------------------------------------------------
  'encyclo.title': 'CBRN Risk Encyclopedia & Glossary',
  'encyclo.subtitle': 'History, geopolitical doctrines, technological countermeasures and terminology.',
  'encyclo.tabGlossary': 'A-Z Glossary',
  'encyclo.tabHistory': 'History & Origins',
  'encyclo.tabDoctrines': 'Doctrines & Nations',
  'encyclo.tabTools': 'Tools & Countermeasures',
  'encyclo.searchPlaceholder': 'Search term, acronym (Sarin, ALARA, Sievert, MOPP, CBRN)...',
  'encyclo.termsCount': 'terms indexed',
  'encyclo.fullDefinition': 'Full definition:',
  'encyclo.contextApplication': 'Operational context & field application:',
  'encyclo.historicalOrigin': 'Historical origin:',
  'encyclo.seeAlso': 'See also:'
};

export const EN_TRANSLATIONS = en;

