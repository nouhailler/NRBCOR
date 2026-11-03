import { QuizQuestion, DetailedQuiz, AdditionalModule } from '../../data/quizData';
import { TrainerExerciseScenario } from '../../components/TrainerSessionModal';

export const IMMERSION_SCENARIOS_EN: QuizQuestion[] = [
  {
    id: 'q-chimique-03',
    scenarioNumber: 'NO. 03 • CHEMICAL',
    scenarioType: 'Immersion Scenario',
    badge: 'National Alert Siren Active',
    title: 'Toxic plume 800 meters away and rising siren',
    context: '« You hear the national alert siren (1 min 41s, 3 times) and a dense white plume is visible nearby. Your two children are currently in class at the local primary school. »',
    question: 'What is the mandatory immediate action compliant with civil protection directives?',
    source: 'Ministry of the Interior & Hazmat CMIC Protocol',
    options: [
      {
        letter: 'A',
        text: 'Take your car to pick up your children from school',
        isCorrect: false,
        tag: 'STRICTLY FORBIDDEN',
        tagColor: 'text-error',
        explanation: 'Jams routes reserved for emergency convoys. Schools enforce the Safe Haven Plan (PPMS) and are hermetically sealed. Your children are safe under teacher supervision.'
      },
      {
        letter: 'B',
        text: 'Enter a solid building, seal vents/windows, and listen to public FM radio',
        isCorrect: true,
        tag: 'VERIFIED VITAL REFLEX',
        tagColor: 'text-on-tertiary-container',
        explanation: 'Immediate shelter in the most airtight room. Shut down ventilation/HVAC, seal cracks and air intakes with wide duct tape, and keep the radio tuned for official directives.'
      },
      {
        letter: 'C',
        text: 'Take a potassium iodide tablet and wait outside',
        isCorrect: false,
        tag: 'USELESS & COUNTERPRODUCTIVE',
        tagColor: 'text-on-surface',
        explanation: 'Iodine ONLY protects the thyroid against radioactive iodine (I-131) and has zero effect against chemical toxins. It must only be ingested upon formal decree from authorities.'
      }
    ]
  },
  {
    id: 'q-nucleaire-01',
    scenarioNumber: 'NO. 01 • NUCLEAR',
    scenarioType: 'Radioactive Release Alert',
    badge: 'FR-Alert Notification Received',
    title: 'Atmospheric release from a nuclear reactor 15 km away',
    context: '« The Prefect triggers the Special Intervention Plan (PPI). A cellular emergency notification orders sheltering and announces that potassium iodide tablets will be distributed downwind. »',
    question: 'At what exact moment must you ingest stable potassium iodide (KI) tablets?',
    source: 'Nuclear Safety Authority / IRSN • National Doctrine',
    options: [
      {
        letter: 'A',
        text: 'Immediately as a precaution as soon as the alert is declared',
        isCorrect: false,
        tag: 'SEVERE ERROR',
        tagColor: 'text-error',
        explanation: 'Taking KI prematurely (> 24h before plume arrival) saturates the thyroid without lasting benefit during plume passage and carries medical side effects.'
      },
      {
        letter: 'B',
        text: 'Strictly upon explicit order from the Prefect broadcast over official radio/media',
        isCorrect: true,
        tag: 'CORRECT ACTION',
        tagColor: 'text-on-tertiary-container',
        explanation: 'Optimal efficacy occurs within 2 hours before and during radioactive plume passage. Only emergency authorities possess the atmospheric dispersion modeling to time the order.'
      },
      {
        letter: 'C',
        text: 'Only after being rescued by medical teams at home',
        isCorrect: false,
        tag: 'TOO LATE',
        tagColor: 'text-on-surface',
        explanation: 'Post-exposure ingestion (> 12 hours) loses over 90% of its protective effect against inhaled radioactive iodine.'
      }
    ]
  },
  {
    id: 'q-biologique-02',
    scenarioNumber: 'NO. 02 • BIOLOGICAL',
    scenarioType: 'Major Epidemic Alert',
    badge: 'BIOTOX Emergency Plan Active',
    title: 'Suspicion of highly contagious airborne pathogen',
    context: '« An airborne biological agent is detected in the central subway network. Civil authorities order immediate home quarantine and sheltering. »',
    question: 'Which respiratory barrier equipment is indispensable to block infectious bio-aerosols?',
    source: 'Public Health Agency & National Defense Secretariat',
    options: [
      {
        letter: 'A',
        text: 'A standard surgical pleated mask or a cotton bandana',
        isCorrect: false,
        tag: 'INSUFFICIENT',
        tagColor: 'text-error',
        explanation: 'Surgical and cloth masks lack an airtight facial seal and cannot filter inhaled microscopic bio-aerosols.'
      },
      {
        letter: 'B',
        text: 'A properly fitted unvalved FFP2 or FFP3 particle respirator mask',
        isCorrect: true,
        tag: 'EFFECTIVE BARRIER',
        tagColor: 'text-on-tertiary-container',
        explanation: 'Unvalved FFP2/FFP3 masks guarantee an airtight facial seal and capture at least 94% to 99% of airborne infectious micro-particles.'
      },
      {
        letter: 'C',
        text: 'An organic vapor gas cartridge without a particle filter',
        isCorrect: false,
        tag: 'UNSUITABLE',
        tagColor: 'text-on-surface',
        explanation: 'Gas cartridges lacking a P3 mechanical particulate filter do not capture biological viruses and bacterial spores.'
      }
    ]
  },
  {
    id: 'q-travail-04',
    scenarioNumber: 'NO. 04 • WORKPLACE / COMMERCIAL FACILITY',
    scenarioType: 'Major Workplace Emergency Alert',
    badge: 'TRAINING EXERCISE — NO REAL ALERT',
    title: 'An official emergency siren sounds while you are at work',
    context: '« It is 2:15 PM, and you are in your office or workshop. A civil protection alert sounds (siren or cell broadcast). A major industrial incident is reported in the adjacent business park. »',
    question: 'What do you do immediately to safeguard your life and your colleagues?',
    source: 'Labor Code & Occupational Health & Safety Institute (INRS)',
    options: [
      {
        letter: 'A',
        text: 'Grab your car keys to drive home immediately to join your family',
        isCorrect: false,
        tag: 'LETHAL HAZARD & GRIDLOCK',
        tagColor: 'text-error',
        explanation: 'Fleeing in a vehicle exposes you directly to toxic gas inside a non-airtight cabin, while clogging emergency corridors needed by fire and rescue teams.'
      },
      {
        letter: 'B',
        text: 'Stay inside the solid building, shut off HVAC/ventilation, seal doors, and execute shelter plan',
        isCorrect: true,
        tag: 'VALIDATED VITAL REFLEX',
        tagColor: 'text-on-tertiary-container',
        explanation: 'Workplace buildings provide robust collective protection. Shut down air handlers (HVAC), seal openings, and monitor public FM radio without overloading phone networks.'
      },
      {
        letter: 'C',
        text: 'Make phone calls to every single family member',
        isCorrect: false,
        tag: 'NETWORK CONGESTION',
        tagColor: 'text-error',
        explanation: 'Voice calls saturate local cell towers and block vital emergency 911/112 transmissions. Send a single short SMS to your pre-agreed out-of-area contact.'
      },
      {
        letter: 'D',
        text: 'Walk outside into the parking lot to visually inspect the plume',
        isCorrect: false,
        tag: 'DIRECT EXPOSURE',
        tagColor: 'text-error',
        explanation: 'Exiting into the open exposes you instantly to odorless or invisible toxic vapors and potential blast wave overpressures.'
      }
    ]
  }
];

export const QUIZ_IRRADIATION_CONTAMINATION_EN: DetailedQuiz = {
  id: 'quiz-rad',
  title: 'Quiz: Distinguishing Irradiation vs Contamination',
  authority: 'Nuclear Safety Authority / IRSN Doctrines',
  description: '5 questions to test your comprehension between standoff radiation exposure and physical particulate deposition.',
  questions: [
    {
      question: 'Does a person who has received external gamma radiation become radioactive?',
      options: [
        'Yes, they emit dangerous radiation to bystanders and family',
        'No, an irradiated person does not become radioactive (identical to receiving a medical dental X-ray)',
        'Yes, but only for the first 24 hours',
        'Yes, their clothes must be burned outdoors'
      ],
      correctIndex: 1,
      explanation: 'Irradiation is exposure to penetrating electromagnetic waves. As soon as you move away from the source, exposure stops and the human body retains zero residual radioactivity.'
    },
    {
      question: 'What is the precise definition of radioactive contamination?',
      options: [
        'Merely standing downwind of a nuclear power plant without contact',
        'The physical deposition of radioactive dust or liquids on skin/clothing, or internal absorption into the body',
        'The subjective sensation of skin warmth caused by radiation',
        'Abnormal discoloration of ambient air'
      ],
      correctIndex: 1,
      explanation: 'Contamination involves the physical presence of radioactive particles (Cesium, Iodine, Strontium) on the body, clothing, or ingested/inhaled internally.'
    },
    {
      question: 'What are the 3 fundamental tenets to minimize external radiation exposure?',
      options: [
        'Exposure Time, Standoff Distance, Dense Shielding (ALARA triad)',
        'Cloth mask, Antibiotic course, Window ventilation',
        'Hot scrub shower, Bleach rinse, Vacuum cleaning',
        'Sprint fast, Lower head, Shut eyes'
      ],
      correctIndex: 0,
      explanation: 'The ALARA radiation triad: minimize exposure TIME, maximize standoff DISTANCE, and interpose dense SHIELDING (thick concrete walls, lead, earth).'
    },
    {
      question: 'In external radioactive clothing contamination, which action immediately removes up to 90% of particulates?',
      options: [
        'Vigorously brushing garments in the open breeze',
        'Gently peeling outerwear off by rolling it outward without shaking and double-bagging it',
        'Spraying clothes with rubbing alcohol',
        'Ironing clothes with a high-heat steam iron'
      ],
      correctIndex: 1,
      explanation: 'Meticulous undressing from top to bottom without shaking eliminates the vast majority of toxic or radioactive deposition before it reaches the skin or airways.'
    },
    {
      question: 'Does potassium iodide (KI) shield against whole-body irradiation or other radioisotopes like Cesium?',
      options: [
        'Yes, it neutralizes all ionizing radiation',
        'No, it solely saturates the thyroid gland to block the uptake of radioactive Iodine-131',
        'Yes, provided the dose is doubled',
        'Only if mixed with white distilled vinegar'
      ],
      correctIndex: 1,
      explanation: 'Stable potassium iodide targets exclusively the thyroid gland to prevent radioactive Iodine-131 uptake. It offers zero protection against Cesium, Cobalt, or direct gamma rays.'
    }
  ]
};

export const QUIZ_DECONTAMINATION_EN: DetailedQuiz = {
  id: 'quiz-decon',
  title: 'Emergency Decontamination: The 4 High-Stress Actions',
  authority: 'Extreme Emergency Hygiene • Civil Protection',
  description: '4 practical questions on managing buffer zones to arrest transdermal penetration of toxic agents.',
  questions: [
    {
      question: 'Why is it strictly forbidden to vigorously scrub the skin during emergency rinsing?',
      options: [
        'To avoid wasting emergency soap bars',
        'Because scrubbing dilates pores and drives toxic chemical molecules directly through the cutaneous epidermal barrier',
        'Because hot water evaporates too quickly',
        'To prevent staining bathroom fixtures'
      ],
      correctIndex: 1,
      explanation: 'Scrubbing with rough washcloths creates micro-abrasions and dilates vascular pores, promoting rapid systemic absorption of nerve agents and biological toxins.'
    },
    {
      question: 'How must contaminated clothing be safely isolated and disposed of?',
      options: [
        'Wash immediately in a 30°C washing machine cycle with regular laundry',
        'Seal inside heavy-duty double plastic bags hermetically taped with duct tape',
        'Throw garments out the window onto the street',
        'Hang clothes on the outdoor balcony in the sun'
      ],
      correctIndex: 1,
      explanation: 'Hermetic double-bagging traps toxic chemical vapors and fallout dust, preventing secondary contamination of living quarters and medical responders.'
    },
    {
      question: 'What is the recommended minimum duration for flushing eyes or skin exposed to caustic chemicals?',
      options: [
        '30 seconds',
        '2 minutes',
        '15 continuous minutes under gentle, low-pressure lukewarm running water',
        '1 hour in an ice bath'
      ],
      correctIndex: 2,
      explanation: '15 continuous minutes of gentle lukewarm water irrigation (15–20°C) without excessive pressure dilutes and flushes acids/bases without inducing hypothermia or tissue damage.'
    },
    {
      question: 'When returning from outside into an isolation shelter, where should undressing take place?',
      options: [
        'In the primary master bedroom',
        'In an entryway airlock or isolated buffer room before entering the clean shelter zone',
        'In the kitchen near food preparation surfaces',
        'In the living room on comfortable seating'
      ],
      correctIndex: 1,
      explanation: 'An entryway or bathroom acts as a dirty-to-clean buffer airlock, protecting the hermetic seal and clean breathable air of the refuge room.'
    }
  ]
};

export const ADDITIONAL_MODULES_EN: AdditionalModule[] = [
  {
    id: 'm-confinement-drill',
    badge: 'Home Simulation Drill',
    badgeColor: 'bg-secondary-fixed text-on-secondary-fixed-variant',
    duration: '15 min',
    authority: 'Household Civil Protection',
    title: 'Annual Household Sheltering Drill',
    description: 'Timed real-condition drill conducted with all household members in your designated refuge room.',
    checklist: [
      'Locate emergency HVAC shutoff switch and circuit breaker',
      'Inspect window/door perimeter gaskets & duct tape supply',
      'Instant retrieval and check of 72h go-bag'
    ],
    status: 'pratique',
    actionText: 'Launch timed step-by-step drill'
  },
  {
    id: 'm-radio-quiz',
    badge: 'Validated (5/5)',
    badgeColor: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    authority: 'ASN / IRSN Doctrines',
    title: 'Quiz: Distinguishing Irradiation vs Contamination',
    description: '5 validated questions. You master the fundamental difference between external radiation exposure and radioactive dust deposition.',
    status: 'valide',
    score: '5/5',
    actionText: 'Review answers'
  },
  {
    id: 'm-decontamination-quiz',
    badge: 'To Do • 4 Questions',
    badgeColor: 'bg-error-container text-on-error-container',
    authority: 'Extreme Emergency Hygiene',
    title: 'Emergency Decontamination: The 4 High-Stress Actions',
    description: 'Immediate procedures for unassisted undressing and gentle unscrubbed body rinsing under stress.',
    keyDirective: 'Gentle top-to-bottom undressing without scrubbing (removes 90% of toxic load) and 100L hermetic double-bagging.',
    status: 'a-faire',
    actionText: 'Start decontamination quiz'
  }
];

export const TRAINER_SCENARIOS_EN: TrainerExerciseScenario[] = [
  {
    id: 'chimique-seveso',
    title: 'Exercise 1: Industrial Seveso Toxic Release (Chlorine/Ammonia Cloud)',
    hazardType: 'chimique',
    badge: 'Hazmat Transport / Seveso Industry',
    situation: 'An acrid, pungent odor is reported. The national alert siren sounds. Wind is blowing toward the residential neighborhood.',
    pedagogicalObjectives: [
      'Demonstrate that fleeing in a car into gridlock is the number one lethal mistake.',
      'Practice rapid room sealing (wide duct tape, damp towels under door gaps).',
      'Enforce the strict prohibition of any flame or electrical switch that could spark an explosive atmosphere.'
    ],
    groupDilemma: 'Part of the group wants to jump into cars to flee before the cloud arrives. What do you decide?',
    expectedReflex: 'Immediate indoor sheltering, complete window sealing, HVAC shut down, tune to public FM radio.',
    fatalTraps: [
      'Fleeing by car and getting stuck in toxic smoke traffic gridlock.',
      'Going outside to investigate the source of the smell.',
      'Calling 911/112 just to ask for routine information.'
    ],
    targetedCompetencies: [
      'Emergency sheltering in toxic atmosphere',
      'Active sealing of room ventilation and openings',
      'FM radio discipline without cellular network congestion'
    ]
  },
  {
    id: 'nucleaire-cnpe',
    title: 'Exercise 2: Accidental Radiological Release (Nuclear Power Plant)',
    hazardType: 'nucleaire',
    badge: 'Radiological Hazard',
    situation: 'An emergency cell broadcast announces an INES 4 radiological incident at a nuclear reactor 15 km away.',
    pedagogicalObjectives: [
      'Deconstruct the dangerous reflex of ingesting iodine pills without a formal government order.',
      'Clarify the vital difference between irradiation (external standoff) and contamination (particulate dust deposition).',
      'Identify the most structurally shielding room in the building (interior core, thick walls, no direct exterior windows).'
    ],
    groupDilemma: 'A participant has a box of potassium iodide pills and urges everyone to swallow them immediately "as a precaution". What do you do?',
    expectedReflex: 'Firm refusal of ingestion without explicit prefectural radio instructions. Sheltering in the building\'s core room.',
    fatalTraps: [
      'Spontaneous, premature iodine ingestion (thyroid saturation too early or unnecessary side effects).',
      'Stepping outside to retrieve belongings left in the open air.',
      'Vigorously scrubbing skin instead of gentle rinsing when radioactive dust is suspected.'
    ],
    targetedCompetencies: [
      'Strict potassium iodide doctrine under official decree',
      'Shielding against radioactive plume exposure',
      'Differentiation of irradiation vs contamination'
    ]
  },
  {
    id: 'telecom-blackout',
    title: 'Exercise 3: Telecom Blackout & Family Separation',
    hazardType: 'telecom',
    badge: 'Network Blackout',
    situation: 'A severe storm and widespread power grid blackout collapse the 4G/5G mobile network. You are separated from family members.',
    pedagogicalObjectives: [
      'Apply the pre-arranged family rendezvous plan without reliance on instant messaging or cell calls.',
      'Designate a single out-of-area emergency contact located far from the disaster region.',
      'Prioritize battery conservation on smartphones for true distress emergencies.'
    ],
    groupDilemma: 'Phone calls fail. One person panics and wants to drive across the metropolitan area searching for their spouse.',
    expectedReflex: 'Remain in a secure location, send a single brief SMS to the out-of-area contact, tune FM radio, and await designated rendezvous time.',
    fatalTraps: [
      'Driving into flooded, blocked, or blackout streets during chaos.',
      'Repeatedly placing calls that rapidly drain emergency smartphone batteries.',
      'Trusting unverified rumors in the absence of cellular news.'
    ],
    targetedCompetencies: [
      'Asynchronous emergency family plan execution',
      'Use of analog FM broadcast receivers',
      'Zero-network battery and communications discipline'
    ]
  },
  {
    id: 'scolaire-ppms',
    title: 'Exercise 4: School Alert & PPMS Shelter Protocol',
    hazardType: 'scolaire',
    badge: 'School Safe Haven (PPMS)',
    situation: 'An industrial emergency siren sounds at 2:00 PM while children are in class at the municipal elementary school.',
    pedagogicalObjectives: [
      'Strictly enforce the non-negotiable rule: NEVER drive to pick up children from school during a civil protection alert.',
      'Explain that school staff are trained, classrooms are sealed under PPMS protocols, and children are safer inside than on the road.',
      'Understand that parents converging on schools block fire trucks and expose themselves and children to outdoor hazards.'
    ],
    groupDilemma: 'An anxious parent insists on running to the school 800 meters away to bring their child home.',
    expectedReflex: 'Stay sheltered at home, seal doors/windows, do NOT travel to school, await the official all-clear broadcast.',
    fatalTraps: [
      'Arriving at school gates and attempting to force entry during active PPMS lockdown.',
      'Exposing oneself to toxic plumes or flying debris during uncoordinated outdoor travel.',
      'Flooding school administrative phone lines.'
    ],
    targetedCompetencies: [
      'Parental compliance with School Safe Haven (PPMS) protocols',
      'Civic road discipline during mass civil emergencies',
      'De-escalation of acute panic behaviors'
    ]
  }
];
