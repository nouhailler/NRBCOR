import { ProtocolData } from '../../data/protocols';

export const PROTOCOLS_DATA_EN: Record<string, ProtocolData> = {
  bio: {
    id: 'bio',
    title: 'Major Biological Alert & Pathogenic Agents',
    subtitle: 'Immediate protective measures, airtight sheltering and hygiene barrier protocols.',
    categoryLabel: 'RISK B • BIO-PATHOGEN',
    categoryIcon: 'coronavirus',
    reviewDate: 'REVIEWED: OCT 14, 2026',
    regulatoryBody: 'SGDSN / SPF / DGSCGC • BIOTOX',
    badgeCriticality: 'RISK B • BIO-PATHOGEN',
    badgeBg: 'bg-error',
    docId: 'DOC-ID: BIO-R02',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtN5Wu8YQzHl8Uad8fKzbCO_A_CKTZS7F-dtxnWnm4EsQe1433IyWpXlW-7gxZqE1fjDORt2uD_bF5SG1C9ik06oEjJFVEKsNXS0e7if83vIHjZKTpxzP0Trt91n_o_rBoA-wwn_lJxFqSHz7XkROiwAOGE9b4RIeNUrk5mfoERKwVdSl3Kq78iLTe9kI-HNbGL_7WZErnE8aonBR8_liWF_aRRQY6xNcMav-xVtltsFp56oF0w1Q',
    imageAlt: 'Civil protection team preparing FFP3 biological equipment and virucidal decontamination solutions',
    imageTags: ['BIOTOX PLAN & PUBLIC HEALTH', 'PHYSICAL & EPIDEMIC BARRIERS'],
    imageCaption: 'Strategic stock & Zonal emergency reserve',
    imageSpec: 'EN 149 / FFP3',
    offlineBannerText: 'OFFLINE MODE ACTIVE • SOVEREIGN LOCAL DATA SECURE',
    reflexesTitle: '4 IMMEDIATE REFLEXES (0 - 15 MIN)',
    reflexesPriority: 'PRIORITY 1',
    reflexes: [
      {
        num: 1,
        title: 'Strict respiratory & ocular barrier',
        description: 'Immediately don an airtight FFP3 or FFP2 respirator (tighten nose bridge, perform seal check via rapid negative pressure inhalation). If unavailable, multi-layer moistened cloth without rubbing.'
      },
      {
        num: 2,
        title: 'Immediate contact-free isolation',
        description: 'Immediately withdraw into a secure enclosed space. Maintain minimum 2-meter physical distance. Avoid touch, hugs, or gatherings. Shut down unfiltered mechanical ventilation systems.'
      },
      {
        num: 3,
        title: 'Buffer airlock & safe undressing',
        description: 'Remove outer garments without shaking to prevent aerosol resuspension. Thoroughly wash hands and face with soap for 60 seconds (or ≥70% alcohol-based hand rub).'
      },
      {
        num: 4,
        title: 'Radio listening & medical regulation',
        description: 'Follow official civil defense directives. Do not rush to emergency rooms unannounced to avoid cross-contamination and preserve critical care capacity.'
      }
    ],
    phases: {
      avant: [
        {
          title: 'Respiratory Barrier & Hygiene Kit',
          icon: 'inventory_2',
          items: [
            'Airtight stock of individually packaged certified FFP2 / FFP3 respirators (minimum 10 units/person).',
            'Box of powder-free nitrile single-use examination gloves (sized for household).',
            'Bottles of certified virucidal alcohol-based hand sanitizer (EN 14476 standard, alcohol ≥ 70%).',
            'Mild liquid soap and disposable paper towels.'
          ]
        },
        {
          title: 'Quarantine Autonomy (14 Days)',
          icon: 'shelves',
          items: [
            'Shelf-stable non-perishable food without cold-chain dependence.',
            'Sealed bottled mineral water (minimum 2L/person/day).',
            'Chronic prescription medications and certified digital clinical thermometer.',
            'Heavy-duty 100L waste bags and wide waterproof duct tape.'
          ]
        }
      ],
      pendant: [
        {
          title: 'Delineation of Isolation Chamber',
          icon: 'meeting_room',
          desc: 'Select a dedicated room (ideally with adjoining bathroom and water supply). Keep the door closed at all times. Place a damp towel across the door threshold.'
        },
        {
          title: 'Management of Contaminated Clothing & Waste',
          icon: 'cleaning_services',
          desc: 'All clothing worn outdoors must immediately be sealed in double 100L heavy-duty plastic bags taped securely. Do not shake or sort garments.'
        },
        {
          title: 'Domestic Airflows & Ventilation',
          icon: 'air',
          desc: 'Shut down mechanical ventilation systems (VMC/HVAC) if external aerosolization is suspected. If transmission is solely person-to-person, brief airing (10 min) of empty rooms is permitted if approved by local authorities.'
        }
      ],
      apres: [
        {
          title: 'Twice-Daily Health Self-Monitoring',
          icon: 'thermostat',
          desc: 'Record body temperature morning and night for each family member. Log any early symptoms: sudden high fever, cough, chest discomfort, skin eruptions, severe headaches.'
        },
        {
          title: 'Medical Clearance & Reporting Protocol',
          icon: 'call_log',
          desc: 'Never enter a medical facility without prior coordination. Rely on dedicated telemedicine triage or official crisis hotlines to arrange home sampling.'
        }
      ]
    },
    forbiddenActions: [
      {
        title: 'NEVER fetch children from school',
        description: 'Schools execute specialized containment protocols (PPMS). Attempting pickup breaches safety cordons and endangers children.'
      },
      {
        title: 'NEVER show up unannounced at emergency departments',
        description: 'Lethal hazard of contaminating medical personnel and immunocompromised patients. Always call medical dispatch (15 / 112).'
      },
      {
        title: 'NEVER shake clothes or sweep dry floors',
        description: 'Sweeping or shaking resuspends bacterial spores (e.g., anthrax) and viral droplets into ambient air. Use damp wipe-down techniques only.'
      },
      {
        title: 'NEVER self-medicate with antibiotics or antivirals',
        description: 'Antibiotics are strictly ineffective against viruses. Inappropriate self-medication induces drug resistance and masks critical symptoms without targeted biological diagnosis.'
      },
      {
        title: 'NEVER ingest potassium iodide tablets',
        description: 'Potassium iodide ONLY protects the thyroid against radioactive iodine (nuclear reactor accidents). It has zero effect against biological bacteria, viruses, or toxins.'
      }
    ],
    pedagogy: {
      title: 'Classification of Biological Agents & Risk Matrix',
      subtitle: 'Pathogen taxonomy according to European biological safety directives (Groups 1 to 4)',
      cards: [
        {
          title: 'Group 4 Pathogens (Viral Hemorrhagic Fevers)',
          tag: 'LEVEL 4 • CRITICAL',
          tagClass: 'bg-error text-white',
          examples: 'Ebola, Marburg, Lassa, Crimean-Congo viruses',
          specificity: 'High mortality rate, absence of universally effective treatment, strict BSL-4 isolation containment required.',
          icon: 'dangerous'
        },
        {
          title: 'Group 3 Pathogens (Bacterial Spores & Highly Infectious)',
          tag: 'LEVEL 3 • HIGH RISK',
          tagClass: 'bg-warning text-black',
          examples: 'Bacillus anthracis (Anthrax), Yersinia pestis (Plague), Tularemia',
          specificity: 'Severe illness, persistent environmental spore resistance, aerosol threat requiring post-exposure prophylaxis.',
          icon: 'coronavirus'
        },
        {
          title: 'Biological Toxins of Natural Origin',
          tag: 'HIGH TOXICITY TOXINS',
          tagClass: 'bg-navy text-white',
          examples: 'Botulinum toxin, Ricin, Staphylococcal enterotoxin B',
          specificity: 'Non-replicating proteins with extreme acute toxicity, requiring supportive intensive care and specific antitoxins.',
          icon: 'science'
        }
      ]
    },
    emergencySymptoms: {
      title: 'Clinical Alarm Signs',
      intro: 'Seek emergency triage if any of the following symptoms manifest:',
      symptoms: [
        'Sudden high fever (> 39°C) with shivering or prostration',
        'Acute respiratory distress, hemoptysis or stridor',
        'Petechial rash, purpura, or spontaneous cutaneous ecchymoses',
        'Sudden neurological confusion or persistent loss of consciousness'
      ],
      alertNote: 'Report suspected biological exposure immediately to emergency medical services before approaching responders.'
    },
    institutionalClause: {
      title: 'Institutional Civil Protection Reference',
      text: 'Guidelines synchronized with SGDSN Biotox circulars, Santé Publique France epidemiological directives, and WHO International Health Regulations.'
    }
  },

  confinement: {
    id: 'confinement',
    title: 'Airtight Containment & Rapid Calfeutrage Protocol',
    subtitle: 'Universal indoor sheltering techniques against toxic plumes, airborne biologicals, and fallout.',
    categoryLabel: 'UNIVERSAL DEFENSE • SHELTER-IN-PLACE',
    categoryIcon: 'meeting_room',
    reviewDate: 'REVIEWED: OCT 14, 2026',
    regulatoryBody: 'DGSCGC / SGDSN • CALFEUTRAGE',
    badgeCriticality: 'UNIVERSAL DEFENSE',
    badgeBg: 'bg-brand',
    docId: 'DOC-ID: CONF-U01',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtN5Wu8YQzHl8Uad8fKzbCO_A_CKTZS7F-dtxnWnm4EsQe1433IyWpXlW-7gxZqE1fjDORt2uD_bF5SG1C9ik06oEjJFVEKsNXS0e7if83vIHjZKTpxzP0Trt91n_o_rBoA-wwn_lJxFqSHz7XkROiwAOGE9b4RIeNUrk5mfoERKwVdSl3Kq78iLTe9kI-HNbGL_7WZErnE8aonBR8_liWF_aRRQY6xNcMav-xVtltsFp56oF0w1Q',
    imageAlt: 'Family sealing windows and door gaps with tape and plastic foil during a containment exercise',
    imageTags: ['HERMETIC AIR-TIGHT SHELTER', 'CRISIS KIT 72H'],
    imageCaption: 'Airtight containment room sealing',
    imageSpec: 'CALFEUTRAGE LEVEL 2',
    offlineBannerText: 'OFFLINE MODE ACTIVE • SOVEREIGN LOCAL DATA SECURE',
    reflexesTitle: '4 IMMEDIATE REFLEXES (0 - 15 MIN)',
    reflexesPriority: 'PRIORITY 1',
    reflexes: [
      {
        num: 1,
        title: 'Shelter in an internal solid room',
        description: 'Choose a room with minimal exterior walls and few or no windows (hallway, central bathroom, interior pantry). Solid construction attenuates external risks.'
      },
      {
        num: 2,
        title: 'Complete mechanical air shutoff',
        description: 'Turn off all mechanical ventilation units, air conditioning, extractors, and kitchen range hoods. Close all chimney dampers.'
      },
      {
        num: 3,
        title: 'Tape and block all air gaps',
        description: 'Use wide waterproof adhesive duct tape to seal gaps around window frames, keyholes, and door edges. Place damp towels across door thresholds.'
      },
      {
        num: 4,
        title: 'Radio station standby & battery saving',
        description: 'Turn on battery radio to emergency channels. Keep smartphone charged and in low-power mode for Cell Broadcast alert reception.'
      }
    ],
    phases: {
      avant: [
        {
          title: 'Pre-cut Sealing Materials',
          icon: 'inventory_2',
          items: [
            'Duct tape (wide waterproof polyethylene or cloth tape).',
            'Pre-cut heavy plastic sheets to cover window panes.',
            'Towels designated for moist threshold dampening.'
          ]
        }
      ],
      pendant: [
        {
          title: 'Shelter Maintenance',
          icon: 'meeting_room',
          desc: 'Do not open the door under any circumstances until authorities sound the all-clear siren.'
        }
      ],
      apres: [
        {
          title: 'Flushing and Airing',
          icon: 'air',
          desc: 'Once the plume has dispersed and the all-clear signal is confirmed, open all windows wide for at least 30 minutes to ventilate the home.'
        }
      ]
    },
    forbiddenActions: [
      {
        title: 'NEVER fetch children from school',
        description: 'PPMS rules are absolute: schools are sealed and autonomous. Arriving compromises children and paralyzes emergency convoys.'
      },
      {
        title: 'NEVER light candles or combustion space heaters',
        description: 'Severe risk of carbon monoxide poisoning and uncontrollable fire inside a sealed airtight room.'
      },
      {
        title: 'NEVER open doors or windows to look outside',
        description: 'Never ventilate voluntarily until the official prefectural all-clear siren sounds.'
      },
      {
        title: 'NEVER place non-urgent voice phone calls',
        description: 'Voice calls saturate cell towers critical for emergency responders; send a single brief SMS to an out-of-area contact (>100 km away).'
      },
      {
        title: 'NEVER attempt wild vehicle evacuation',
        description: 'Fatal traffic jams trapped directly within toxic plumes, totally obstructing civil security convoys.'
      }
    ],
    pedagogy: {
      title: 'Airtight Calfeutrage Steps',
      cards: [
        {
          title: 'Level 1: Basic Window & Door Closure',
          tag: 'BASIC CLOSURE',
          tagClass: 'bg-subtle text-ink',
          specificity: 'Locks all latches and window handles. Reduces air infiltration by 40%.',
          icon: 'door_front'
        },
        {
          title: 'Level 2: Taped Sealing & Damp Barrier',
          tag: 'RECOMMENDED CIVIL DEFENSE STANDARD',
          tagClass: 'bg-ok-soft text-ok-ink',
          specificity: 'Heavy adhesive tape along all joints plus soaked towels at thresholds. Eliminates 90% of toxic particle infiltration.',
          icon: 'meeting_room'
        }
      ]
    },
    emergencySymptoms: {
      title: 'Signs of Infiltration',
      intro: 'If you smell unusual odors (chlorine, bitter almonds, rotten eggs) or notice eye stinging:',
      symptoms: [
        'Immediate wet cloth breathing protection',
        'Move to higher or lower room depending on gas density',
        'Double tape potential infiltration seams'
      ]
    },
    institutionalClause: {
      title: 'Official Civil Defense Reference',
      text: 'Conforming to the National Civil Security Guide for Domestic Sheltering (Guide National de Confinement Calfeutrage - DGSCGC).'
    }
  },

  chimique: {
    id: 'chimique',
    title: 'Industrial Toxic Release & Major Chemical Risk',
    subtitle: 'Emergency shelter-in-place, vapor containment, decontamination and acute toxicity mitigation.',
    categoryLabel: 'RISK C • INDUSTRIAL & CHEMICAL TOXIC',
    categoryIcon: 'science',
    reviewDate: 'REVIEWED: OCT 14, 2026',
    regulatoryBody: 'DGSCGC / SEVESO / INRS • PPI CHIMIQUE',
    badgeCriticality: 'RISK C • CHEMICAL TOXIC',
    badgeBg: 'bg-error',
    docId: 'DOC-ID: CHIM-R01',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtN5Wu8YQzHl8Uad8fKzbCO_A_CKTZS7F-dtxnWnm4EsQe1433IyWpXlW-7gxZqE1fjDORt2uD_bF5SG1C9ik06oEjJFVEKsNXS0e7if83vIHjZKTpxzP0Trt91n_o_rBoA-wwn_lJxFqSHz7XkROiwAOGE9b4RIeNUrk5mfoERKwVdSl3Kq78iLTe9kI-HNbGL_7WZErnE8aonBR8_liWF_aRRQY6xNcMav-xVtltsFp56oF0w1Q',
    imageAlt: 'Chemical response team deploying containment barriers and atmospheric monitoring',
    imageTags: ['SEVESO UPPER TIER DIRECTIVE', 'TOXIC GAS CONTAINMENT'],
    imageCaption: 'Upper-tier Seveso industrial perimeter',
    imageSpec: 'EN 14387 / ABEK-P3',
    offlineBannerText: 'OFFLINE MODE ACTIVE • SOVEREIGN LOCAL DATA SECURE',
    reflexesTitle: '4 IMMEDIATE REFLEXES (0 - 15 MIN)',
    reflexesPriority: 'PRIORITY 1',
    reflexes: [
      {
        num: 1,
        title: 'Immediate indoor shelter (Shelter-in-place)',
        description: 'Enter the nearest solid building immediately. Do not stay inside a car (vehicles are not airtight). Move upstairs if vapors are heavier than air (chlorine, ammonia).'
      },
      {
        num: 2,
        title: 'Hermetic room sealing',
        description: 'Close all doors, windows, and chimney flues. Shut down mechanical ventilation (VMC), air conditioning and heating. Seal gaps with adhesive tape and damp cloths.'
      },
      {
        num: 3,
        title: 'Zero ignition & electrical lock',
        description: 'Do not smoke, switch on lights, or operate electrical appliances. Risk of flammable explosion (BLEVE, UVCE) or catalytic spark ignition.'
      },
      {
        num: 4,
        title: 'Emergency radio broadcast monitoring',
        description: 'Tune into public service radio (France Bleu, BBC Radio, RTS, RTBF depending on jurisdiction). Await official sirens and Cell Broadcast all-clear signals.'
      }
    ],
    phases: {
      avant: [
        {
          title: 'Shelter Sealing Equipment',
          icon: 'inventory_2',
          items: [
            'Rolls of heavy-duty waterproof duct tape (minimum 50mm width).',
            'Pre-cut heavy polyethylene sheeting for window and door apertures.',
            'Battery or hand-crank emergency FM/AM/DAB+ radio with spare batteries.',
            'Sealed chemical goggles and emergency half-mask with ABEK-P3 filters if in PPI zone.'
          ]
        },
        {
          title: 'Local Risk Identification',
          icon: 'map',
          items: [
            'Identify Seveso plants and rail/road hazardous transport routes within 5km.',
            'Memorize distinct toxic gas warning siren signals (modulated rising/falling tone).',
            'Store emergency water reserves inside sealed hermetic containers inside the shelter room.'
          ]
        }
      ],
      pendant: [
        {
          title: 'Active Shelter Hermetization',
          icon: 'meeting_room',
          desc: 'Seal under doors with soaked wet towels. Tape perimeter of all window frames and electrical conduit entries. Avoid rooms with exterior air vents.'
        },
        {
          title: 'Respiratory Protection in Case of Infiltration',
          icon: 'air',
          desc: 'If chemical odor penetrates, breathe through a thick folded cloth saturated with water. Lie flat or move higher depending on known toxic cloud density.'
        },
        {
          title: 'Strict Communication Discipline',
          icon: 'phone_disabled',
          desc: 'Do not use telephone networks except to report severe life threats, to avoid collapsing saturated emergency network lines.'
        }
      ],
      apres: [
        {
          title: 'Awaiting the All-Clear Siren Signal',
          icon: 'campaign',
          desc: 'Do not leave shelter until authorities sound the continuous 30-second all-clear siren signal or confirm via Cell Broadcast.'
        },
        {
          title: 'Controlled Decontamination & Thorough Venting',
          icon: 'air',
          desc: 'Open all windows fully to flush residual vapors out once external cloud has passed. Wash outdoor clothing separately.'
        }
      ]
    },
    forbiddenActions: [
      {
        title: 'NEVER flee inside an automobile',
        description: 'Cars are not airtight: vehicle ventilation actively draws in toxic vapor clouds. Traffic jams trap you directly inside the plume.'
      },
      {
        title: 'NEVER fetch children from school',
        description: 'Schools are fortified sheltering locations managed by educational teams under PPMS. Leaving to fetch them blocks rescue corridors.'
      },
      {
        title: 'NEVER rely on basic particulate masks (FFP2/FFP3) against gases',
        description: 'FFP2/FFP3 masks only trap solid particles. They offer ABSOLUTELY ZERO protection against chemical vapors, chlorine, ammonia, or acid fumes.'
      },
      {
        title: 'NEVER ingest stable potassium iodide (KI 65mg)',
        description: 'Potassium iodide ONLY protects the thyroid against radioactive iodine during nuclear accidents. It provides zero protection against chemical gases and risks dangerous side effects.'
      },
      {
        title: 'NEVER attempt to sniff-identify an unknown chemical substance',
        description: 'Never approach, smell, or taste suspect clouds or puddles. Multiple toxic compounds (e.g., H2S) instantly paralyze olfactory nerves upon first inhalation.'
      }
    ],
    pedagogy: {
      title: 'Major Toxic Chemical Agents & Antidotes',
      cards: [
        {
          title: 'Choking Agents (Pulmonary Toxics)',
          tag: 'CHLORINE / PHOSGENE',
          tagClass: 'bg-error text-white',
          examples: 'Chlorine (Cl2), Phosgene (CG), Ammonia (NH3)',
          specificity: 'Heavy dense gases that accumulate in low spots, causing severe pulmonary edema. Immediate vertical relocation recommended.',
          icon: 'air'
        },
        {
          title: 'Blood Agents (Cellular Respiration Inhibitors)',
          tag: 'CYANIDES',
          tagClass: 'bg-error text-white',
          examples: 'Hydrogen cyanide (HCN), Cyanogen chloride',
          specificity: 'Blocks cellular oxygen uptake. Rapid incapacitation. Antidotes: Hydroxocobalamin (Cyanokit) administered by mobile medical units (SAMU).',
          icon: 'science'
        },
        {
          title: 'Organophosphate Nerve Agents',
          tag: 'ORGANOPHOSPHATES',
          tagClass: 'bg-black text-white',
          examples: 'Sarin, VX, Soman, Novichok derivatives',
          specificity: 'Acetylcholinesterase inhibitors. Symptoms: Extreme miosis, rhinorrhea, convulsions. Immediate antidote: Atropine + Pralidoxime.',
          icon: 'dangerous'
        }
      ]
    },
    emergencySymptoms: {
      title: 'Toxicity Signs & Symptoms',
      intro: 'Immediate symptoms indicating exposure to industrial hazardous vapors:',
      symptoms: [
        'Acute burning sensation in eyes, lacrimation, photophobia',
        'Sudden violent coughing, bronchial spasm, suffocating sensation',
        'Intense chest pain, throat irritation, respiratory distress',
        'Dizziness, nausea, vomiting, sudden loss of balance'
      ]
    },
    institutionalClause: {
      title: 'Regulatory & Civil Protection Framework',
      text: 'Conforming to European Seveso III directives, DGSCGC PPI guides, and French National Chemical Risk Protection doctrines.'
    }
  },

  nucleaire: {
    id: 'nucleaire',
    title: 'Nuclear Power Plant Emergency & Severe Radiological Incident',
    subtitle: 'Protective actions within PPI perimeters, stable iodine KI intake doctrine and radioactive release containment.',
    categoryLabel: 'RISK N • NUCLEAR POWER PLANT & CORE ACCIDENT',
    categoryIcon: 'blur_on',
    reviewDate: 'REVIEWED: OCT 14, 2026',
    regulatoryBody: 'ASN / IRSN / DGSCGC • PPI NUCLÉAIRE',
    badgeCriticality: 'RISK N • NUCLEAR & PPI',
    badgeBg: 'bg-error',
    docId: 'DOC-ID: NUC-R01',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtN5Wu8YQzHl8Uad8fKzbCO_A_CKTZS7F-dtxnWnm4EsQe1433IyWpXlW-7gxZqE1fjDORt2uD_bF5SG1C9ik06oEjJFVEKsNXS0e7if83vIHjZKTpxzP0Trt91n_o_rBoA-wwn_lJxFqSHz7XkROiwAOGE9b4RIeNUrk5mfoERKwVdSl3Kq78iLTe9kI-HNbGL_7WZErnE8aonBR8_liWF_aRRQY6xNcMav-xVtltsFp56oF0w1Q',
    imageAlt: 'Nuclear power plant cooling towers and civil protection containment zone',
    imageTags: ['SPECIAL INTERVENTION PLAN (PPI)', 'STABLE IODINE KI PROPHYLAXIS'],
    imageCaption: 'Commercial reactor perimeter (20km PPI)',
    imageSpec: 'KI 65mg / INES 1-7',
    offlineBannerText: 'OFFLINE MODE ACTIVE • SOVEREIGN LOCAL DATA SECURE',
    reflexesTitle: '4 IMMEDIATE REFLEXES (0 - 15 MIN)',
    reflexesPriority: 'PRIORITY 1',
    reflexes: [
      {
        num: 1,
        title: 'Immediate solid sheltering (Shelter-in-place)',
        description: 'Enter a solid stone or concrete building immediately. Thick walls significantly shield from external gamma radiation. Stay in central rooms away from external openings.'
      },
      {
        num: 2,
        title: 'Hermetic ventilation shutdown',
        description: 'Block all air intakes, chimney dampers, and windows. Turn off mechanical ventilation and heat pumps to prevent radioactive particulate fallout from penetrating indoors.'
      },
      {
        num: 3,
        title: 'NO iodine ingestion without formal government order',
        description: 'Potassium iodide (KI) must only be ingested upon explicit instructions broadcast by the Prefect / Civil Security. Premature ingestion destroys protective efficiency.'
      },
      {
        num: 4,
        title: 'Continuous official emergency radio listening',
        description: 'Maintain radio listening on national public broadcasters (France Bleu, BBC, RTS). Do not trust unverified social media rumors regarding evacuation routes.'
      }
    ],
    phases: {
      avant: [
        {
          title: 'Stable Iodine (KI) Readiness',
          icon: 'medication',
          items: [
            'Store unexpired boxes of Potassium Iodide 65mg tablets in their original blister packs within the 20km PPI zone.',
            'Keep tablets in a dry, accessible location out of reach of young children.',
            'Ensure exact dosage knowledge for each family member (especially pregnant women, infants, and youths < 18).'
          ]
        },
        {
          title: 'Shelter Kit Preparation',
          icon: 'inventory_2',
          items: [
            'Airtight water supplies (minimum 3L/person/day for drinking and cooking).',
            'Canned and sealed shelf-stable foods.',
            'Battery-powered radio with fresh spare batteries and spare antenna.'
          ]
        }
      ],
      pendant: [
        {
          title: 'Sheltering & Radiation Attenuation',
          icon: 'meeting_room',
          desc: 'Remain in the center of the structure or in the basement. Heavy concrete and stone provide high half-value layer radiation shielding.'
        },
        {
          title: 'Strict Hygiene & Tap Water Discipline',
          icon: 'water_drop',
          desc: 'Do not drink tap water, collect rainwater, or consume garden vegetables until radioprotection agencies declare water and food safe.'
        },
        {
          title: 'Execute Iodine Order if Decreed',
          icon: 'medication',
          desc: 'If the Prefect broadcasts the iodine distribution/intake order, administer exact prescribed single doses dissolved in water or fruit juice.'
        }
      ],
      apres: [
        {
          title: 'Organized Evacuation if Commanded',
          icon: 'directions_run',
          desc: 'If evacuation is ordered, use exclusively designated evacuation routes to Decontamination and Reception Centers (PZO). Never improvise routes through plume fallout.'
        },
        {
          title: 'Personal Decontamination & Clothing Disposal',
          icon: 'sanitizer',
          desc: 'Execute 8-step undressing. Strip outer layers carefully, place in sealed thick bags, and wash hair and skin with lukewarm water without scrubbing.'
        }
      ]
    },
    forbiddenActions: [
      {
        title: 'NEVER flee inside an automobile',
        description: 'Immediate road gridlock. A car interior offers zero radiation shielding against airborne radioactive plumes.'
      },
      {
        title: 'NEVER fetch children from schools',
        description: 'Schools execute hermetic PPMS shelter protocols. Showing up exposes you and compromises school sealing.'
      },
      {
        title: 'NEVER drink tap water or eat fresh local garden produce',
        description: 'Taps, vegetable gardens, and local milk receive radioelement deposits (Cesium-137, Iodine-131). Consume closed canned reserves only.'
      },
      {
        title: 'NEVER swallow Potassium Iodide preemptively without official order',
        description: 'Premature ingestion uselessly saturates the thyroid gland and can trigger severe thyroid disorders without conferring lasting protection.'
      }
    ],
    pedagogy: {
      title: 'Radiation Types & Health Impact',
      cards: [
        {
          title: 'Alpha Radiation (α)',
          tag: 'INTERNAL HAZARD',
          tagClass: 'bg-warning text-black',
          examples: 'Plutonium, Americium, Radon particles',
          specificity: 'Stopped by a simple sheet of paper or dead skin layer. Highly lethal if inhaled or ingested into lung alveoli or GI tract.',
          icon: 'shield'
        },
        {
          title: 'Beta Radiation (β)',
          tag: 'CONTACT & SURFACE HAZARD',
          tagClass: 'bg-warning text-black',
          examples: 'Strontium-90, Iodine-131',
          specificity: 'Penetrates several millimeters into skin. Causes cutaneous radiation burns. Stopped by thin aluminum or glass layers.',
          icon: 'health_and_safety'
        },
        {
          title: 'Gamma Radiation (γ)',
          tag: 'DEEP PENETRATING HAZARD',
          tagClass: 'bg-error text-white',
          examples: 'Cesium-137, Cobalt-60',
          specificity: 'High-energy photons that penetrate deeply through buildings. Requires dense shielding (lead, thick concrete, packed earth).',
          icon: 'warning'
        }
      ]
    },
    emergencySymptoms: {
      title: 'Acute Radiation Syndrome (ARS) Signs',
      intro: 'Symptoms occurring after significant acute ionizing radiation exposure (> 1 Gy):',
      symptoms: [
        'Rapid onset nausea and uncontrollable vomiting within 1 to 4 hours',
        'Extreme prostration, severe generalized fatigue and fever',
        'Erythema (skin reddening resembling severe sunburn)',
        'Diarrhea, electrolyte loss and mucosal breakdown'
      ]
    },
    institutionalClause: {
      title: 'Institutional Reference',
      text: 'Synchronized with ASN (Autorité de Sûreté Nucléaire), IRSN, DGSCGC guidelines and European post-accident nuclear emergency codes.'
    }
  },

  radiologique: {
    id: 'radiologique',
    title: 'Radiological Dispersion Incident & Orphan Sources',
    subtitle: 'Emergency protocols for radiological dispersal devices (dirty bombs), lost medical/industrial sources and severe gamma irradiation.',
    categoryLabel: 'RISK R • RADIOLOGICAL & DISPERSION',
    categoryIcon: 'radiology',
    reviewDate: 'REVIEWED: OCT 14, 2026',
    regulatoryBody: 'IRSN / ASN / DGSCGC • PIRATOX-PIRANET',
    badgeCriticality: 'RISK R • RADIOLOGICAL',
    badgeBg: 'bg-warning',
    docId: 'DOC-ID: RAD-R01',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtN5Wu8YQzHl8Uad8fKzbCO_A_CKTZS7F-dtxnWnm4EsQe1433IyWpXlW-7gxZqE1fjDORt2uD_bF5SG1C9ik06oEjJFVEKsNXS0e7if83vIHjZKTpxzP0Trt91n_o_rBoA-wwn_lJxFqSHz7XkROiwAOGE9b4RIeNUrk5mfoERKwVdSl3Kq78iLTe9kI-HNbGL_7WZErnE8aonBR8_liWF_aRRQY6xNcMav-xVtltsFp56oF0w1Q',
    imageAlt: 'Radiological detection probe measuring contamination levels on protective suits',
    imageTags: ['ORPHAN SOURCES & RDD', 'DOSE RATE & SHIELDING'],
    imageCaption: 'Radiological inspection & dosimetric control',
    imageSpec: 'mSv/h • ALARA PRINCIPLE',
    offlineBannerText: 'OFFLINE MODE ACTIVE • SOVEREIGN LOCAL DATA SECURE',
    reflexesTitle: '4 IMMEDIATE REFLEXES (0 - 15 MIN)',
    reflexesPriority: 'PRIORITY 1',
    reflexes: [
      {
        num: 1,
        title: 'Apply the ALARA Triad immediately',
        description: 'Maximize Distance from the source, minimize Time of exposure, and place maximum Shielding (walls, vehicles, terrain) between you and the suspect item.'
      },
      {
        num: 2,
        title: 'Protect airway from radioactive dust',
        description: 'Cover nose and mouth with an FFP2/FFP3 respirator or thick fabric to avoid internal contamination via inhalation of dispersed radioactive particulate matter.'
      },
      {
        num: 3,
        title: 'Retreat upwind and uphill',
        description: 'Move crosswind and upwind from any blast, fire, or dust cloud to prevent walking into the downwind dispersion zone.'
      },
      {
        num: 4,
        title: 'Report suspect object to security forces',
        description: 'Never touch a metallic container marked with trefoils, dense lead containers, or unexploded ordnance. Dial 17 / 112 immediately.'
      }
    ],
    phases: {
      avant: [
        {
          title: 'Knowledge of Trefoil Warning Symbols',
          icon: 'warning',
          items: [
            'Recognize standard international ionizing radiation trefoil markers on yellow or red backgrounds.',
            'Understand that Potassium Iodide (KI) is ineffective against non-nuclear radiological sources (Cobalt, Cesium, Iridium).'
          ]
        }
      ],
      pendant: [
        {
          title: 'Immediate Distance Evacuation',
          icon: 'directions_run',
          desc: 'Evacuate at least 300 meters away from the source or blast epicenter immediately.'
        },
        {
          title: 'Prevent Dust Inhalation & Ingestion',
          icon: 'masks',
          desc: 'Keep respirator sealed against face. Do not eat, drink, or smoke in the vicinity of any blast debris.'
        }
      ],
      apres: [
        {
          title: 'Complete Body Washing & Monitoring',
          icon: 'sanitizer',
          desc: 'Report to civil protection radiometric checkpoints for dosimetric screening and skin decontamination.'
        }
      ]
    },
    forbiddenActions: [
      {
        title: 'NEVER touch or pick up a suspect radioactive object',
        description: 'An orphan sealed source (industrial gammagraphy, irradiator capsule) can deliver a lethal dose in mere minutes of contact, without smell or warmth.'
      },
      {
        title: 'NEVER take iodine tablets without a nuclear reactor accident',
        description: 'Radiological emergencies (lost sources, dirty bombs) involve metallic gamma/beta emitters. Iodine provides zero shielding and causes unnecessary side effects.'
      },
      {
        title: 'NEVER scrub contaminated skin with abrasive brushes',
        description: 'Mechanical abrasion creates skin micro-lesions that transform external surface contamination into dangerous internal contamination through the bloodstream.'
      },
      {
        title: 'NEVER approach a Class 7 hazardous transport accident',
        description: 'Maintain a safety perimeter of at least 100 to 300 meters awaiting the arrival of the specialized Radiological Intervention Unit (CMIR).'
      }
    ],
    pedagogy: {
      title: 'The ALARA Protection Principle',
      cards: [
        {
          title: 'Time Factor',
          tag: 'EXPOSURE DURATION',
          tagClass: 'bg-navy text-white',
          specificity: 'Accumulated radiation dose is directly proportional to exposure time: Halving the time halves the dose.',
          icon: 'timer'
        },
        {
          title: 'Distance Factor',
          tag: 'INVERSE SQUARE LAW',
          tagClass: 'bg-brand text-white',
          specificity: 'Dose rate decreases with the square of the distance: Doubling your distance divides the radiation intensity by four.',
          icon: 'straighten'
        },
        {
          title: 'Shielding Factor',
          tag: 'MASS ATTENUATION',
          tagClass: 'bg-ok-deep text-white',
          specificity: 'Dense materials (concrete, lead, water, packed earth) absorb and scatter ionizing radiation photons.',
          icon: 'security'
        }
      ]
    },
    emergencySymptoms: {
      title: 'Localized Radiation Injury Indicators',
      intro: 'Physical signs of intense external gamma or beta irradiation:',
      symptoms: [
        'Local skin redness (erythema) without thermal burn source',
        'Dry or wet desquamation of fingers or palms',
        'Hair loss (epilation) localized to exposed body areas',
        'Subcutaneous swelling and acute burning sensation'
      ]
    },
    institutionalClause: {
      title: 'Civil Security Directive',
      text: 'Compliant with IRSN emergency radiological response doctrine and Piratox/Piranet interministerial emergency frameworks.'
    }
  }
};
