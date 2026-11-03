/**
 * NRBCOR — Encyclopedic Knowledge Base & Glossary (English Translation)
 * CBRN Threat: History, Geopolitical Doctrine, Military Concepts & Countermeasures
 */

import { GlossaryTerm, HistoricalEra, CountryDoctrine, NrbcToolCategory } from '../../data/encyclopediaData';

// --------------------------------------------------------------------------
// 1. GLOSSARY A-Z (ENGLISH)
// --------------------------------------------------------------------------
export const GLOSSARY_TERMS_EN: GlossaryTerm[] = [
  {
    id: 'nrbc',
    term: 'CBRN / NRBC',
    acronym: 'Chemical, Biological, Radiological, Nuclear',
    category: 'reglementaire',
    shortDef: 'Global classification of risks and threats involving unconventional mass destruction agents.',
    fullDef: 'Universal operational framework designating hazards arising from the release of toxic chemical agents, pathogenic biological agents, radioactive materials, or nuclear detonations. In NATO and international treaties, the acronym CBRN (or CBRNE including Explosive/dispersive improvised devices) is standard. France historically referenced NRBC.',
    contextUsage: 'Used by armed forces, civil protection agencies, emergency medical services (EMS), and governmental crisis cells to classify emergency response protocols.',
    historicalNote: 'Originated during the Cold War as "NBC" (Nuclear, Biological, Chemical), with the subsequent vital distinction of the Radiological risk (dirty bombs/orphan sources without nuclear fission).',
    seeAlso: ['alara', 'cmic', 'sgdsn', 'piratox']
  },
  {
    id: 'alara',
    term: 'ALARA Principle',
    acronym: 'As Low As Reasonably Achievable',
    category: 'radiologique',
    shortDef: 'Core radiation protection principle mandating minimal radiation exposure.',
    fullDef: 'Golden rule formulated by the International Commission on Radiological Protection (ICRP). It rests on the foundational operational triad: Minimize exposure TIME, Maximize DISTANCE from the radioactive source (inverse-square law: doubling distance quarters the dose rate), and Interpose dense SHIELDING (lead, concrete, packed earth, water).',
    contextUsage: 'Enforced in radiological emergency response, nuclear power plants, and hospital nuclear medicine departments.',
    historicalNote: 'Formally codified in ICRP Publication 26 in 1977 to prevent deterministic acute radiation sickness and limit stochastic risks (cancers, genetic mutations).',
    seeAlso: ['sievert', 'becquerel', 'iode-ki']
  },
  {
    id: 'sievert',
    term: 'Sievert (Sv)',
    acronym: 'Sv / mSv / µSv',
    category: 'nucleaire',
    shortDef: 'Standard legal unit measuring equivalent and effective radiation biological dose in living tissue.',
    fullDef: 'Quantifies the biological harm caused by ionizing radiation to human tissue. Unlike the Gray (Gy), which measures raw physical energy absorbed per kilogram (1 Gy = 1 J/kg), the Sievert applies radiation weighting factors (Wr) and tissue weighting factors (Wt) accounting for radiation type (alpha, beta, gamma, neutrons) and organ sensitivity.',
    contextUsage: 'Average natural background exposure: ~2.4 to 4.5 mSv/year. Legal annual limit for nuclear workers: 20 mSv/year. Acute Radiation Syndrome (ARS) onset threshold: > 1,000 mSv (1 Sv).',
    historicalNote: 'Named after Swedish medical physicist Rolf Sievert, pioneer of radiation dosimetry.',
    seeAlso: ['gray', 'becquerel', 'alara']
  },
  {
    id: 'gray',
    term: 'Gray (Gy)',
    category: 'nucleaire',
    shortDef: 'SI unit of absorbed physical radiation dose in matter.',
    fullDef: 'International System unit defined as the absorption of one Joule of ionizing radiation energy per kilogram of matter (1 Gy = 1 J/kg). It is a purely physical metric, regardless of biological tissue response.',
    contextUsage: 'Utilized in health physics and radiation oncology. In CBRN triage, an acute whole-body absorbed dose of 4 to 5 Gy results in 50% mortality without advanced intensive medical care (LD50).',
    seeAlso: ['sievert', 'becquerel']
  },
  {
    id: 'becquerel',
    term: 'Becquerel (Bq)',
    category: 'radiologique',
    shortDef: 'SI unit of radioactive source activity (one nuclear disintegration per second).',
    fullDef: 'One Becquerel equals exactly one atomic nucleus disintegration per second. It is a very small unit: a healthy adult human body naturally emits ~8,000 Bq internally (predominantly from Potassium-40 and Carbon-14). One gram of Radium-226 yields ~37 billion Bq (1 Curie).',
    contextUsage: 'Used to measure contamination in soil (Bq/m²), drinking water (Bq/L), and food supplies (Bq/kg) following a radiological emergency.',
    historicalNote: 'Named after Henri Becquerel, discoverer of uranium radioactivity in 1896 (Nobel Prize 1903 alongside Pierre and Marie Curie).',
    seeAlso: ['sievert', 'cesium-137', 'iode-131']
  },
  {
    id: 'iode-131',
    term: 'Iodine-131 (¹³¹I)',
    category: 'nucleaire',
    shortDef: 'Volatile fission product released in nuclear reactor core accidents, concentrated by the thyroid.',
    fullDef: 'Radioactive isotope of iodine with a half-life of 8.02 days, emitting beta and gamma radiation. During severe reactor accidents involving core damage (Chernobyl, Fukushima), Iodine-131 is released in gaseous and aerosol plumes. Inhaled or ingested via food, it concentrates heavily in the thyroid gland, triggering thyroid nodules and cancer, particularly in children.',
    contextUsage: 'Medical prophylaxis requires timely ingestion of stable potassium iodide (KI 65 mg) strictly under government decree to saturate thyroid receptors before plume passage.',
    historicalNote: 'Chernobyl (1986) induced over 6,000 pediatric thyroid cancer cases across Belarus, Ukraine, and Russia due to consumption of contaminated dairy without timely KI prophylaxis.',
    seeAlso: ['iode-ki', 'cesium-137']
  },
  {
    id: 'iode-ki',
    term: 'Potassium Iodide (KI 65 mg)',
    category: 'nucleaire',
    shortDef: 'Thyroid-blocking pharmaceutical agent against radioactive iodine inhalation.',
    fullDef: 'Stable, non-radioactive iodine salt. Taken orally, it floods and saturates thyroid receptor sites with harmless iodine, preventing subsequent uptake of carcinogenic radioactive Iodine-131. Protective efficacy exceeds 95% if taken between 2 hours before plume arrival and up to 2 hours after. It ONLY shields the thyroid and provides ZERO protection against external radiation or other radioisotopes (Cesium, Cobalt).',
    contextUsage: 'Pre-distributed to households within special response zones (PPI 0-20 km in France, 0-50 km in Switzerland). Must NEVER be taken without formal prefectural or civil protection orders.',
    seeAlso: ['iode-131', 'ppi']
  },
  {
    id: 'cesium-137',
    term: 'Cesium-137 (¹³⁷Cs)',
    category: 'nucleaire',
    shortDef: 'Major long-lived fission radionuclide (30-year half-life) causing persistent ground contamination.',
    fullDef: 'Potent beta and gamma-emitting isotope (via decay daughter Barium-137m). Chemically mimicking potassium, it is rapidly absorbed by vegetation, fungi, and livestock, bioaccumulating in human muscle tissue. Its 30.1-year half-life makes it the primary contributor to long-term exclusion zones after severe nuclear releases.',
    contextUsage: 'Tracked via ground and aerial gamma spectrometry. Medical countermeasure in acute internal contamination: Prussian Blue (insoluble), which binds cesium in the gut and accelerates fecal excretion.',
    seeAlso: ['iode-131', 'gray']
  },
  {
    id: 'sarin',
    term: 'Sarin (Agent GB)',
    category: 'chimique',
    shortDef: 'Volatile organophosphate nerve agent of the G-series, irreversibly inhibiting acetylcholinesterase.',
    fullDef: 'Colorless, odorless liquid nerve agent developed in Germany in 1938. Irreversibly binds acetylcholinesterase, producing hyperstimulation of nervous and neuromuscular junctions through acetylcholine overload. Symptoms: extreme pinpoint pupils (miosis), profuse salivation, severe bronchospasm, violent convulsions, and fatal asphyxiation within minutes.',
    contextUsage: 'Schedule 1 Chemical Weapon under the CWC. Emergency antidotes: atropine (muscarinic blocker) combined with an oxime (pralidoxime/obidoxime) and an anticonvulsant (diazepam).',
    historicalNote: 'Deployed by the Aum Shinrikyo cult in Matsumoto (1994) and Tokyo subway (1995), and in the Ghouta chemical attack in Syria (2013).',
    seeAlso: ['vx', 'tabun', 'novitchok', 'atropine']
  },
  {
    id: 'vx',
    term: 'VX Nerve Agent',
    category: 'chimique',
    shortDef: 'Persistent organophosphate nerve agent lethal via minimal skin contact.',
    fullDef: 'Amber, oily, odorless liquid with low volatility, developed at the British Porton Down research facility in 1952. Unlike G-agents which are primarily inhalation hazards, VX is designed for extreme ground persistence (weeks) and rapid transdermal penetration: a single droplet (10 mg) on bare skin is fatal to an adult human in under 15 minutes.',
    contextUsage: 'Requires full impermeable barrier ensembles (MOPP 4 or Level A hazmat suits) because standard respirators offer zero protection against skin absorption.',
    historicalNote: 'Used in the 2017 assassination of Kim Jong-nam at Kuala Lumpur International Airport.',
    seeAlso: ['sarin', 'novitchok', 'mopp']
  },
  {
    id: 'novitchok',
    term: 'Novichok Agents ("Newcomer")',
    category: 'chimique',
    shortDef: 'Fourth-generation ultra-lethal binary nerve agents developed in the USSR.',
    fullDef: 'Military-grade organophosphates developed by Moscow State Organic Chemistry Institute (GosNIIOKhT) in the 1970s–1990s under the "Foliant" program. Many are binary formulations (two relatively safe precursors blended immediately prior to deployment). Engineered to evade CWC detection thresholds and demonstrate high resistance to conventional oximes.',
    contextUsage: 'Identified in the poisoning of Sergei and Yulia Skripal in Salisbury (UK, 2018) and Alexei Navalny (Russia, 2020).',
    seeAlso: ['sarin', 'vx']
  },
  {
    id: 'yperite',
    term: 'Mustard Gas / Yperite (Sulfur Mustard)',
    category: 'chimique',
    shortDef: 'Persistent blister agent causing severe delayed chemical burns to skin, eyes, and lungs.',
    fullDef: 'Bis(2-chloroethyl) sulfide. Oily liquid with a characteristic garlic or mustard odor. Powerful alkylating cytotoxic agent that crosslinks DNA. Highly insidious: completely painless upon exposure, followed by an asymptomatic latency period of 4 to 12 hours before giant fluid-filled blisters (phlyctenes), corneal necrosis causing blindness, and severe pulmonary edema develop.',
    contextUsage: 'Immediate skin decontamination within the first 2 minutes is critical; beyond this window, the agent fixes irreversibly into skin tissue.',
    historicalNote: 'First deployed at Ypres on July 12, 1917 by the German Army. Re-employed in the Iran-Iraq War (1980–1988) and in the Italo-Ethiopian War (1935).',
    seeAlso: ['deshabillage', 'cmic']
  },
  {
    id: 'phosgene',
    term: 'Phosgene (Agent CG)',
    category: 'chimique',
    shortDef: 'Industrial and military choking agent inducing delayed fatal pulmonary edema.',
    fullDef: 'Carbonyl dichloride (COCl2). Dense, colorless gas smelling of freshly cut hay or green corn. Reacts with alveolar membranes in the lungs, destroying capillaries and leaking plasma into air sacs. Its hallmark danger is an asymptomatic clinical latency period (6 to 24 hours): victims may feel completely fine before abruptly drowning internally in massive pulmonary edema.',
    contextUsage: 'Massively synthesized industrial chemical for polyurethane and pesticide manufacture. Requires immediate absolute bedrest with zero physical exertion for all suspected exposed individuals.',
    seeAlso: ['chlore', 'confinement']
  },
  {
    id: 'chlore',
    term: 'Chlorine Gas (Cl₂)',
    category: 'chimique',
    shortDef: 'Dense, corrosive greenish-yellow choking gas with a pungent, suffocating odor.',
    fullDef: 'Industrial commodity produced in millions of tons annually. In contact with moist respiratory and ocular tissues, chlorine forms hydrochloric and hypochlorous acids, triggering laryngeal spasms, bronchial chemical burns, and respiratory arrest. Being 2.5 times heavier than air, it hugs the ground and settles into basements, trenches, and subway corridors.',
    contextUsage: 'In industrial chlorine leaks, NEVER seek shelter in basements or underground structures; move to upper floors of an airtight, sealed building.',
    historicalNote: 'First modern mass-scale chemical attack on April 22, 1915 at Ypres by the German Imperial Army.',
    seeAlso: ['phosgene', 'confinement']
  },
  {
    id: 'anthrax',
    term: 'Anthrax (Bacillus anthracis)',
    category: 'biologique',
    shortDef: 'Spore-forming bacterial pathogen producing lethal toxins; premier historical biological warfare agent.',
    fullDef: 'Gram-positive, rod-shaped bacterium capable of forming endospores exceptionally resistant to heat, desiccation, UV light, and standard disinfectants, surviving for decades in soil. Inhalational anthrax carries a mortality rate > 85% without aggressive early post-exposure antibiotic therapy (ciprofloxacin/doxycycline). Spores are not transmissible person-to-person.',
    contextUsage: 'Biosafety Level 3 agent. Handled under national civil protection biodefense emergency frameworks (BIOTOX).',
    historicalNote: 'Amerithrax postal attacks of autumn 2001 in the US (5 dead, 17 infected). Gruinard Island in Scotland remained quarantined for 48 years following British 1942 bio-trials.',
    seeAlso: ['biotox', 'ricine']
  },
  {
    id: 'ricine',
    term: 'Ricin Toxin',
    category: 'biologique',
    shortDef: 'Ribosome-inactivating protein toxin extracted from castor oil seeds (Ricinus communis).',
    fullDef: 'Type 2 ribosome-inactivating protein (RIP). A single ricin molecule entering a cell\'s cytosol halts protein synthesis by inactivating over 1,500 ribosomes per minute, causing rapid cell death. Inhalation produces massive necrotizing airway lesions and fatal pulmonary edema within 36 to 72 hours. No approved human antidote exists.',
    contextUsage: 'Regulated jointly under the Chemical Weapons Convention (Schedule 1) and biological defense protocols.',
    historicalNote: 'Utilized by the Bulgarian Secret Service in the 1978 London umbrella assassination of dissident Georgi Markov using an engineered platinum micro-pellet.',
    seeAlso: ['anthrax', 'biotox']
  },
  {
    id: 'cmic',
    term: 'CMIC / CMIR (Specialized Hazmat Units)',
    acronym: 'Mobile Chemical & Radiological Intervention Teams',
    category: 'secours',
    shortDef: 'Elite CBRN hazmat response units within French, Swiss, and European emergency services.',
    fullDef: 'Specialized departmental units of fire and civil protection departments (SDIS, Paris Fire Brigade BSPP, Marseille Naval Fire Battalion BMPM). Equipped with armored CBRN reconnaissance vehicles, FTIR and Raman spectrometers, multi-gas monitors, Level A encapsulating hazmat suits, and mobile decontamination corridor modules.',
    contextUsage: 'Dispatched whenever industrial Seveso leaks, toxic transportation accidents, orphan radioactive sources, or suspected terror incidents occur.',
    seeAlso: ['prv', 'sgdsn', 'piratox']
  },
  {
    id: 'prv',
    term: 'Victim Assembly & Triage Point (PRV)',
    category: 'secours',
    shortDef: 'Secure triage and emergency decontamination perimeter established before hospital transfer.',
    fullDef: 'Tactical field installation erected at the boundary between the exclusion zone (Hot Zone) and controlled perimeter (Warm Zone). Victims undergo rapid medical triage, emergency dry or wet decontamination (undressing, gentle wash, patting dry) to prevent secondary contamination of clean hospitals ("protecting the medical chain"), followed by advanced stabilization.',
    contextUsage: 'Foundational component of mass-casualty protocols (NOVI, ORSEC-NRBC).',
    seeAlso: ['cmic', 'deshabillage']
  },
  {
    id: 'mopp',
    term: 'MOPP Gear',
    acronym: 'Mission Oriented Protective Posture',
    category: 'materiel',
    shortDef: 'Standard NATO military CBRN protective ensemble readiness scale (Levels MOPP 0 to 4).',
    fullDef: 'NATO standard governing individual CBRN defense configurations: MOPP 0 (gear carried, none worn), MOPP 1 (permeable charcoal-impregnated overgarment worn), MOPP 2 (overgarment and protective overboots worn), MOPP 3 (mask and hood donned, gloves carried), MOPP 4 (complete sealed encapsulation with butyl rubber gloves and hood sealed).',
    contextUsage: 'Enables commanders to balance CBRN protection against acute heat stress in military personnel.',
    seeAlso: ['tld', 'abek2p3']
  },
  {
    id: 'tld',
    term: 'Light Decontamination Suit (TLD)',
    category: 'materiel',
    shortDef: 'Protective filtering or waterproof coverall shielding against radioactive dust and aerosols.',
    fullDef: 'Employed by civil and military response teams. Encompasses either non-porous encapsulating suits (liquid/gas-impermeable but causing rapid thermal buildup) or air-permeable suits with activated carbon spherical adsorber beads (allowing sweat vapor dissipation while trapping toxic chemical fumes).',
    contextUsage: 'Standard wear for fire service hazmat teams and military CBRN defense battalions.',
    seeAlso: ['mopp', 'abek2p3']
  },
  {
    id: 'abek2p3',
    term: 'ABEK2P3 Multi-Gas Filtration Canister',
    category: 'materiel',
    shortDef: 'Universal combined filter protecting against the four major toxic gas classes and particulates.',
    fullDef: 'European Standard (EN 14387) canister designation for respirators: Brown band A (organic vapors boiling > 65°C), Grey band B (inorganic gases like chlorine, hydrogen cyanide), Yellow band E (sulfur dioxide, acid gases), Green band K (ammonia and organic amines), Class 2 (medium capacity), paired with a P3 particulate filter (White band, capturing 99.95% of airborne particles, biological spores, and radioactive dust).',
    contextUsage: 'WARNING: An ABEK canister DOES NOT generate oxygen! Using it in oxygen-deficient spaces (< 19.5% O₂) or carbon monoxide-saturated fires is fatal.',
    seeAlso: ['mopp', 'confinement']
  },
  {
    id: 'sgdsn',
    term: 'SGDSN (National Defense & Security Secretariat)',
    acronym: 'General Secretariat for National Defense and Security (France)',
    category: 'reglementaire',
    shortDef: 'French interministerial crisis planning body answering directly to the Prime Minister.',
    fullDef: 'Coordinates nationwide defense and civil resilience strategies. Drafts, audits, and maintains primary national contingency frameworks: PIRATOX (chemical attacks), BIOTOX (biological threats), PIRATOME (nuclear/radiological incidents), and PIRANET (critical infrastructure cyberattacks).',
    contextUsage: 'Directs the strategic national stockpiles of emergency antidotes, personal protective equipment, and civil defense assets.',
    seeAlso: ['piratox', 'biotox', 'dgscgc']
  },
  {
    id: 'piratox',
    term: 'PIRATOX National Emergency Plan',
    category: 'reglementaire',
    shortDef: 'French national governmental contingency plan for chemical terror attacks and major incidents.',
    fullDef: 'Classified national security protocol defining chain of command, military CBRN asset mobilization (2nd Dragoon Regiment), expedited airlift of strategic antidote stockpiles (atropine, oximes), and forensic isolation of contaminated zones.',
    contextUsage: 'Triggered by Prime Ministerial directive upon intelligence warnings or confirmed chemical release.',
    seeAlso: ['biotox', 'sgdsn']
  },
  {
    id: 'biotox',
    term: 'BIOTOX National Emergency Plan',
    category: 'reglementaire',
    shortDef: 'French governmental plan against biological warfare, bioterrorism, and deliberate epidemics.',
    fullDef: 'Established following the 2001 anthrax incidents. Governs accelerated real-time syndromic surveillance, BSL-3/BSL-4 laboratory security, strategic prepositioning of smallpox vaccines and bulk antibiotics, and water reservoir security.',
    contextUsage: 'Coordinated by the Ministry of Health and SGDSN.',
    seeAlso: ['anthrax', 'sgdsn']
  },
  {
    id: 'cenal',
    term: 'NEOC / Alertswiss (CENAL - Switzerland)',
    acronym: 'National Emergency Operations Centre (Switzerland)',
    category: 'secours',
    shortDef: 'Swiss federal authority managing radiological, chemical, and major civilian technological disasters.',
    fullDef: 'Division of the Federal Office for Civil Protection (FOCP / BABS) headquartered in Bern. Continuously monitors the Swiss radiological landscape through 76 automatic NADAM dose probes and border monitoring arrays. Dispatches nationwide civil siren alarms, broadcasts real-time directives via the Alertswiss smartphone app, and oversees potassium iodide distribution.',
    contextUsage: 'Swiss primary 24/7 liaison point with the IAEA and cross-border civil defense agencies in France, Germany, Italy, and Austria.',
    seeAlso: ['alara', 'iode-ki']
  }
];

// --------------------------------------------------------------------------
// 2. HISTORICAL ERAS (ENGLISH)
// --------------------------------------------------------------------------
export const HISTORICAL_ERAS_EN: HistoricalEra[] = [
  {
    id: 'era-ww1',
    title: '1. Birth of Modern Chemical Warfare (1914 - 1925)',
    period: '1914 - 1925',
    headline: 'From industrial synthesis to the trenches of Ypres: the shock of the invisible weapon',
    summary: 'While tear gas munitions were tested as early as autumn 1914, large-scale industrial chemical warfare was conceptualized and unleashed in spring 1915 by German chemist Fritz Haber. In months, the Western Front devolved into an escalating race between choking agents (chlorine, phosgene), blister agents (mustard gas), and improvised respirators.',
    keyEvents: [
      {
        year: 'April 22, 1915',
        title: 'Battle of Ypres: First Mass Chlorine Cloud Attack',
        location: 'Ypres, Belgium',
        description: 'The German Imperial Army opened 5,730 pressurized cylinders containing 168 metric tons of chlorine gas across a 6 km front facing French and Canadian lines. A dense greenish wall 2 meters high swept with the wind, asphyxiating unprepared troops: 5,000 dead and 10,000 casualties within hours.',
        lessonLearned: 'Inception of civil passive defense: soldiers discovered the lethal inadequacy of urine-soaked rags, prompting the urgent development of neutralizing pads and carbon canister gas masks.'
      },
      {
        year: '1915 - 1916',
        title: 'Introduction of Phosgene and the Zelinsky-Kummant Activated Carbon Canister',
        location: 'Western Front',
        description: 'Deployment of phosgene, ten times more lethal than chlorine and difficult to detect immediately. Belligerents introduced the French M2 mask and Nikolai Zelinsky\'s activated charcoal canister mask (adopted across Allied and Russian imperial armies).',
        lessonLearned: 'Activated charcoal became the permanent, non-negotiable core adsorbent for all modern respiratory protection.'
      },
      {
        year: 'July 12, 1917',
        title: 'First Deployment of Mustard Gas (Yellow Cross)',
        location: 'Ypres, Belgium',
        description: 'The German High Command fired artillery shells filled with sulfur mustard. For the first time, gas masks were insufficient: the agent penetrated uniform fabrics, attacked moist skin with massive blisters, and rendered battlegrounds uninhabitable for weeks.',
        lessonLearned: 'Discovery of the percutaneous threat, sparking research into impermeable body suits and chemical soil decontamination.'
      },
      {
        year: 'June 17, 1925',
        title: 'Signing of the Geneva Protocol',
        location: 'Geneva, Switzerland (League of Nations)',
        description: 'Confronting the catastrophic toll (over 100,000 fatalities and 1.2 million gas casualties in WWI), 38 nations signed the treaty prohibiting the wartime use of asphyxiating, poisonous gases and bacteriological weapons.',
        lessonLearned: 'First landmark international limitation treaty, though it prohibited use rather than production or stockpiling and retained retaliation clauses.'
      }
    ],
    doctrinalImpact: 'Creation of military chemical corps and recognition that chemical dispersion is strictly dictated by micrometeorology (wind vectors, thermal gradients, relative humidity).'
  },
  {
    id: 'era-ww2',
    title: '2. World War II: Nerve Agents & Entry into the Atomic Age (1936 - 1945)',
    period: '1936 - 1945',
    headline: 'Synthesis of organophosphates, biological atrocities, and nuclear detonations',
    summary: 'World War II saw mutual chemical deterrence on the European front: Hitler and Churchill stockpiled tens of thousands of tons of poison gas without battlefield deployment for fear of devastating retaliatory strikes on civilian cities. Behind the scenes, Germany synthesized G-series nerve agents, Japan conducted lethal biological human experiments, and the United States achieved military nuclear fission.',
    keyEvents: [
      {
        year: '1936 - 1938',
        title: 'Synthesis of Tabun and Sarin by Gerhard Schrader',
        location: 'IG Farben Laboratories, Elberfeld, Germany',
        description: 'While researching organophosphate agricultural insecticides, Schrader synthesized compounds of unprecedented toxicity. The Third Reich classified the work Top Secret, building the underground Dyhernfurth plant to mass-produce Tabun and Sarin.',
        lessonLearned: 'Emergence of agents lethal in microgram quantities via autonomic nervous paralysis. Conventional gas masks had to be paired with injectable antidotes.'
      },
      {
        year: '1937 - 1945',
        title: 'Unit 731 and Biological Warfare in China',
        location: 'Pingfan, Manchuria',
        description: 'Under General Shiro Ishii, Unit 731 conducted large-scale human experiments with plague, cholera, and anthrax, dropping infected flea ceramics on Chinese cities (Ningbo, Changde).',
        lessonLearned: 'Demonstrated the uncontrollable nature and operational complexity of living bio-agents (epidemic backfire, environmental persistence).'
      },
      {
        year: 'July 16 & August 1945',
        title: 'Trinity Test and Atomic Bombings of Hiroshima and Nagasaki',
        location: 'New Mexico, Hiroshima, and Nagasaki, Japan',
        description: 'The first plutonium device detonated at Alamogordo. On August 6, Little Boy devastated Hiroshima; on August 9, Fat Man struck Nagasaki. Over 200,000 civilians perished from blast waves, thermal radiation, and acute radiation sickness.',
        lessonLearned: 'Humanity entered the nuclear era. The "N" component immediately eclipsed all existing civil defense paradigms.'
      }
    ],
    doctrinalImpact: 'Military staffs abandoned trench-level tactical planning to focus on national survival under thermonuclear strikes capable of vaporizing urban centers in milliseconds.'
  },
  {
    id: 'era-coldwar',
    title: '3. The Cold War: Mutually Assured Destruction & Radiological Risk (1947 - 1991)',
    period: '1947 - 1991',
    headline: 'Megaton race, MAD doctrine, VX emergence, and civilian reactor disasters',
    summary: 'For nearly forty years, the East-West confrontation structured global CBRN doctrine. The acronym NBC (Nuclear, Biological, Chemical) became standard across NATO and Warsaw Pact manuals. The superpowers amassed over 60,000 nuclear warheads, engineered persistent nerve agents (VX, Novichok), and constructed colossal covert biological infrastructure like the Soviet Biopreparat network.',
    keyEvents: [
      {
        year: '1952',
        title: 'Discovery of VX at Porton Down and 2nd-Generation Patents',
        location: 'United Kingdom / Pine Bluff Arsenal, USA',
        description: 'Synthesis of persistent V-series nerve agents, ten times more toxic than sarin via inhalation and several hundred times more lethal through intact skin.',
        lessonLearned: 'Mandated continuous protective combat suits (the origin of NATO\'s standard MOPP gear).'
      },
      {
        year: 'April 1979',
        title: 'Sverdlovsk Military Anthrax Leak',
        location: 'Sverdlovsk (Yekaterinburg), USSR',
        description: 'A missing exhaust air filter at a secret Biopreparat facility triggered an accidental release of aerosolized anthrax spores. At least 68 citizens died of inhalational anthrax downwind, exposing clandestine Soviet violations of the 1972 BWC treaty.',
        lessonLearned: 'Demonstrated the extreme lethal footprint of industrial bio-manipulation and the absolute necessity of certified, redundant HEPA bio-containment filtration.'
      },
      {
        year: 'April 26, 1986',
        title: 'Chernobyl Nuclear Power Plant Catastrophe',
        location: 'Pripyat, Ukraine (USSR)',
        description: 'The explosion of Reactor No. 4 released billions of billions of Becquerels across the European continent. Approximately 600,000 emergency liquidators were mobilized in lethal radiological fields to extinguish core graphite fires and erect the initial sarcophagus.',
        lessonLearned: 'Civil nuclear accidents demonstrated their borderless nature. Led to automated transboundary radiation sensor networks (Téléray in France, NADAM in Switzerland) and mandatory potassium iodide distribution around nuclear stations.'
      }
    ],
    doctrinalImpact: 'Formalization of the ALARA radiation doctrine and crucial conceptual separation between nuclear fission weapons (Nuclear) and passive isotopic contamination (Radiological).'
  },
  {
    id: 'era-contemporary',
    title: '4. Contemporary Era: Asymmetric Risks, Seveso & Hybrid Threats (1995 - Present)',
    period: '1995 - Present',
    headline: 'Postal bioterrorism, targeted nerve agent hits, industrial mega-disasters, and civil resilience',
    summary: 'Following the fall of the Iron Curtain, CBRN hazards shifted from superpower battlefield confrontations to asymmetric non-state terrorism (Tokyo 1995, Amerithrax 2001), targeted covert nerve agent assassinations (Salisbury 2018), high-density industrial Seveso disasters (Toulouse AZF 2001, Fukushima 2011, Lubrizol Rouen 2019), and hybrid strikes on critical energy infrastructure.',
    keyEvents: [
      {
        year: 'March 20, 1995',
        title: 'Tokyo Subway Sarin Attack by Aum Shinrikyo',
        location: 'Tokyo, Japan',
        description: 'Cult operatives punctured plastic pouches of liquid sarin using umbrella tips across five converging subway trains beneath Tokyo\'s government district. 13 died, 6,000 were poisoned, and hospitals were overwhelmed by thousands of panicked citizens.',
        lessonLearned: 'Civilians became the frontline. Municipal first responders (fire, paramedics) had to be equipped with CBRN gear previously reserved for elite military units.'
      },
      {
        year: 'Autumn 2001',
        title: 'Amerithrax Postal Attacks',
        location: 'Washington DC, New York, Florida, USA',
        description: 'Envelopes containing highly weaponized, fluidized anthrax spore powder were mailed to US Senators and media outlets, halting global postal networks.',
        lessonLearned: 'Creation of France\'s BIOTOX framework and deployment of mobile hazardous-powder containment units across emergency services.'
      },
      {
        year: 'March 11, 2011',
        title: 'Fukushima Daiichi Nuclear Disaster',
        location: 'Fukushima Prefecture, Japan',
        description: 'A magnitude 9.0 earthquake and ensuing tsunami disabled backup generators, leading to fuel meltdowns in three reactors and major atmospheric and oceanic radiological releases.',
        lessonLearned: 'Over 150,000 civilians evacuated; prompted worldwide expansion of nuclear emergency planning zones (expanded to 20 km PPI in France) and revised IAEA Operational Intervention Levels.'
      },
      {
        year: '2018 - 2020',
        title: 'Skripal and Navalny Cases: Novichok Resurgence',
        location: 'Salisbury (UK) and Tomsk (Russia)',
        description: 'Deployment of 4th-generation binary nerve agents for targeted assassinations in civilian spaces, resulting in secondary contamination of bystanders and police officers.',
        lessonLearned: 'Confirmed that military chemical weapons stocks persist and that surface persistence on doorknobs and common items is an active tactical threat.'
      }
    ],
    doctrinalImpact: 'Codified the critical role of the prepared citizen: the first 15 minutes in a CBRN event belong entirely to civilians before specialized hazmat units arrive, cementing the necessity of offline tools like NRBCOR.'
  }
];

// --------------------------------------------------------------------------
// 3. COUNTRY & ARMED FORCES DOCTRINES (ENGLISH)
// --------------------------------------------------------------------------
export const COUNTRY_DOCTRINES_EN: CountryDoctrine[] = [
  {
    id: 'france',
    country: 'France',
    flag: '🇫🇷',
    doctrineName: 'Defense / Homeland Security Continuum & Interministerial Plans',
    organization: 'SGDSN (National Defense Secretariat), Ministry of the Interior (DGSCGC), Armed Forces Health Service (SSA)',
    posture: 'Strict sovereign nuclear deterrence upstream, paired with a unified Civil Protection architecture (ORSEC / Specialized Emergency Plans) downstream.',
    keyConcepts: [
      'Security continuum doctrine: seamless integration between military forces and civil protection during domestic attacks.',
      'Dedicated government frameworks: PIRATOX (chemical), BIOTOX (biological), PIRATOME (nuclear/radiological), PIRANET (cyber).',
      'Strict hospital decontamination barriers: absolute ban on admitting un-decontaminated casualties into standard emergency rooms.',
      'Unified cellular and terrestrial alerting (RNA siren network 120 dB + FR-Alert cellular broadcast on 4G/5G).'
    ],
    civilProtectionModel: 'Professional and volunteer fire-rescue model under Prefectural authority. Departmental fire services field specialized CMIC (chemical) and CMIR (radiological) teams. Citizens rely on passive sheltering in sealed rooms (no nationwide general gas mask distribution).',
    militaryUnits: [
      '2nd Dragoon Regiment (2e RD, Fontevraud): The French Army\'s sole dedicated regimental unit specialized in heavy CBRN reconnaissance, sampling, and decontamination.',
      'Armed Forces Health Service (SSA): CBRN medical intervention detachments and the Armed Forces Central Pharmacy (producing KI batches and auto-injectors).',
      'CMIR / CMIC elite detachments of the Paris Fire Brigade (BSPP) and Marseille Naval Fire Battalion (BMPM).'
    ],
    historicalEvolution: 'Forged after WWI, fundamentally restructured in 2001 post-9/11 through the Defense White Papers and total territorial resilience doctrine.',
    strengthsAndLimitations: {
      strengths: [
        'World-class CBRN medical capability (SSA) and specialized fire hazmat teams (CMIC/CMIR).',
        'Extensively monitored nuclear reactor fleet by ASN/ASNR and IRSN with audited 5-year PPI plans.',
        'Zero-download native FR-Alert cell broadcast technology.'
      ],
      limitations: [
        'Minimal specialized civilian fallout or gas shelter infrastructure for the general public.',
        'Civilian preparedness culture historically lower than in Switzerland or Nordic nations.'
      ]
    }
  },
  {
    id: 'suisse',
    country: 'Switzerland',
    flag: '🇨🇭',
    doctrineName: 'Federal Universal Civil Protection & Universal Sheltering Mandate',
    organization: 'Federal Office for Civil Protection (FOCP / BABS), National Emergency Operations Centre (NEOC / CENAL), Swiss Armed Forces',
    posture: 'Armed neutrality, comprehensive territorial defense, and total civilian self-sufficiency in degraded disaster environments.',
    keyConcepts: [
      'Constitutional mandate: "Every inhabitant must have a protected place in a shelter near their home" (LPPCi federal law).',
      'World\'s premier shelter infrastructure: nearly 370,000 reinforced bunkers offering 9 million shelter spaces (> 100% population coverage).',
      'Standardized military-grade NBC ventilation systems (VA-40/VA-75 air units with heavy charcoal gas filters in every shelter).',
      'Preventive home delivery of stable potassium iodide (KI) tablets to every residence within an expanded 50 km radius of nuclear stations.'
    ],
    civilProtectionModel: 'Mandatory Civil Protection (PCi) militia service. Decentralized across 26 cantons, centrally coordinated by NEOC/CENAL and the Alertswiss mobile application.',
    militaryUnits: [
      'Swiss Armed Forces NBC Defense Battalion 10 (Spiez): Global excellence center and OPCW/UN designated reference laboratory (Spiez Laboratory).',
      'Cantonal Civil Protection hazmat and intervention companies.'
    ],
    historicalEvolution: 'Built continuously since the 1960s during the Cold War to guarantee national survival even in the event of tactical nuclear strikes on the European theater.',
    strengthsAndLimitations: {
      strengths: [
        'Guaranteed reinforced bunker space with filtered positive-pressure air for 100% of the population.',
        'Deep-rooted civic culture of household emergency stocks (7–14 days food/water reserves).',
        'Spiez Laboratory globally recognized as the gold standard in forensic CBRN chemical/biological analysis.'
      ],
      limitations: [
        'Substantial financial maintenance costs for the bunker fleet and aging private shelter filter systems.',
        'High industrial chemical concentration in the Rhine river corridor (Basel).'
      ]
    }
  },
  {
    id: 'usa',
    country: 'United States',
    flag: '🇺🇸',
    doctrineName: 'Joint CBRN Defense Program (JPEO-CBRND) & Homeland Security',
    organization: 'Department of Defense (DoD), FEMA, DTRA (Defense Threat Reduction Agency), CDC',
    posture: 'Global expeditionary military projection capability, retaliatory strike posture, and federal domestic defense against asymmetric mass-casualty terrorism.',
    keyConcepts: [
      'MOPP (Mission Oriented Protective Posture) doctrine standard across all armed branches.',
      'Layered defense strategy (transboundary early warning, standoff detection, rapid battlefield decontamination).',
      'Strategic National Stockpile (SNS): massive federal depots of antidotes, antibiotics, and PPE capable of delivery within 12 hours nationwide.',
      'Citizen resilience education via the federal Ready.gov program.'
    ],
    civilProtectionModel: 'Decentralized federal system managed by FEMA, state emergency agencies, and National Guard WMD-Civil Support Teams.',
    militaryUnits: [
      '20th CBRNE Command (US Army): Operational command integrating chemical, biological, radiological, nuclear, and explosive ordnance disposal (EOD) specialists.',
      'WMD-CST (Weapons of Mass Destruction Civil Support Teams): 57 permanent National Guard teams deployable within 4 hours in every US state and territory.',
      'USAMRIID (Fort Detrick): Premier military medical research institute for infectious disease and bio-defense.'
    ],
    historicalEvolution: 'Transitioned from symmetrical Cold War defense against Soviet armor to global counter-proliferation and counter-terrorism post-2001.',
    strengthsAndLimitations: {
      strengths: [
        'World\'s largest CBRN R&D budget (quantum sensors, autonomous drone bio-sniffers).',
        'Massive logistics and supply capability through the Strategic National Stockpile.',
        'Deeply integrated military and civilian bio-surveillance networks.'
      ],
      limitations: [
        'Immense continental territory complicating uniform rapid response in rural zones.',
        'Absence of a universal collective fallout shelter network for the general public.'
      ]
    }
  },
  {
    id: 'russie',
    country: 'Russia / Former USSR',
    flag: '🇷🇺',
    doctrineName: 'RKhBZ Troops (Radiological, Chemical & Biological Defense)',
    organization: 'Ministry of Defense (RKhBZ Troops), Ministry of Emergency Situations (EMERCOM / MChS)',
    posture: 'Heavy military sanctuarization, industrial-scale mechanized thermal decontamination, and permanent operational integration of combat in contaminated environments.',
    keyConcepts: [
      'Independent military combat branch: RKhBZ Troops operate dedicated armored reconnaissance vehicles and heavy thermobaric systems (TOS-1A).',
      'Massive kinetic thermal decontamination: truck-mounted aircraft jet turbojets (TMS-65) spraying decontamination solutions over armored columns.',
      'Deep metropolitan underground bunker systems: Moscow, St. Petersburg, and Kyiv subways were engineered from the ground up as hermetic nuclear bomb shelters with multi-ton blast doors.',
      'Historical deployment of individual combat antidote kits (AI-2 and AI-4 kits with taren and oximes).'
    ],
    civilProtectionModel: 'Centralized and militarized under EMERCOM (MChS), operating dedicated rescue regiments, heavy aircraft, and deep underground crisis command bunkers.',
    militaryUnits: [
      'RKhBZ Troops of the Russian Armed Forces (embedded in every combined arms army).',
      '27th Scientific RKhBZ Brigade (Kursk).',
      'Military virology research institutes (Kirov, Sergiyev Posad).'
    ],
    historicalEvolution: 'Direct continuation of Soviet WWIII doctrine, where entire armored divisions trained to roll through irradiated European corridors inside positive-pressure NBC-sealed armor (BMP and BTR series).',
    strengthsAndLimitations: {
      strengths: [
        'Unmatched heavy mechanized decontamination assets (turbojet wash vehicles, RKhM armored scout vehicles).',
        'Extremely resilient deep metropolitan subway civil defense shelters.'
      ],
      limitations: [
        'Persistent lack of transparency surrounding historical chemical/biological programs (Novichok, Biopreparat).',
        'Aging individual protective gear and uneven maintenance in civil stockpiles.'
      ]
    }
  },
  {
    id: 'israel',
    country: 'Israel',
    flag: '🇮🇱',
    doctrineName: 'Total Passive Defense & Residential Protected Rooms (Mamad)',
    organization: 'Home Front Command (Pikud HaOref - IDF), Ministry of Defense, Magen David Adom',
    posture: 'Permanent national survival against immediate non-conventional ballistic and missile threats along proximate borders.',
    keyConcepts: [
      'Mamad building mandate: since 1992, every newly constructed home or apartment must include a reinforced concrete safe room fitted with a blast/gas-tight door and window and an autonomous NBC air filtration system.',
      'Historical universal civilian gas mask distributions from birth (adult hoods, pediatric masks, and sealed Shapan baby crib tents) during the Gulf War.',
      'Ultra-localized, neighborhood-specific ballistic and toxic alerting (Pikud HaOref app, precision sirens within 15–90 seconds).'
    ],
    civilProtectionModel: 'Civil defense entrusted directly to a unified military command (IDF Home Front Command) operating hand-in-hand with municipalities and fortified underground hospitals.',
    militaryUnits: [
      'Pikud HaOref (IDF Home Front Command).',
      'Mixed-gender Search, Rescue, and CBRN Defense Battalions (Shahar, Kedem, Tavor).',
      'Biological and medical research facilities at Ness Ziona (IIBR).'
    ],
    historicalEvolution: 'Transformed by the 1991 Gulf War, when 39 Iraqi Scud missiles struck Tel Aviv under the threat of chemical warheads, confining the entire nation in sealed rooms wearing masks.',
    strengthsAndLimitations: {
      strengths: [
        'Highest civic preparedness reflex and shelter awareness in the world.',
        'Fortified underground hospitals capable of conducting uninterrupted emergency surgeries in contaminated air.',
        'Fastest real-time civil defense warning apparatus globally.'
      ],
      limitations: [
        'Continuous psychological stress on the civilian population.',
        'Dependence on individual homeowners to regularly maintain private Mamad air filters.'
      ]
    }
  }
];

// --------------------------------------------------------------------------
// 4. CBRN COUNTERMEASURE TOOLS AND TECHNOLOGIES (ENGLISH)
// --------------------------------------------------------------------------
export const NRBC_TOOL_CATEGORIES_EN: NrbcToolCategory[] = [
  {
    id: 'detection',
    name: '1. Detection, Measurement & Rapid Identification',
    icon: 'radar',
    color: 'text-[#0036ce]',
    description: 'Because CBRN agents are predominantly invisible, odorless, and intangible, early detection is the primary line of survival to alert populations and qualify the hazard.',
    tools: [
      {
        name: 'Geiger-Müller Counters & Survey Radiacmeters',
        category: 'Radiological / Nuclear',
        principle: 'A sealed metal tube containing inert gas under low pressure subjected to high voltage. When an ionizing particle (alpha, beta, gamma) crosses the mica window, it ionizes the gas, producing a measurable electrical pulse (audible clicks and digital dose rate display in µSv/h).',
        history: 'Invented by Hans Geiger in 1908 and refined by Walther Müller in 1928. Remains the most resilient frontline detection tool worldwide.',
        limits: 'Cannot identify which specific radioisotope is present (requires complementary gamma spectrometry to differentiate Iodine-131 from Cesium-137).',
        civilianEquivalent: 'Personal digital survey meters (e.g., Radex, GQ GMC, field electronic dosimeters).'
      },
      {
        name: 'Ion Mobility Spectrometers (IMS)',
        category: 'Chemical',
        principle: 'Ambient air is drawn and ionized. The resulting ions are propelled by an electric field down a drift tube against a counter-flowing neutral gas. Arrival speed corresponds strictly to molecular mass, size, and geometry, fingerprinting the exact chemical agent.',
        history: 'Developed extensively in the 1970s–1980s for the military (CAM - Chemical Agent Monitor, AP4C, LCD3).',
        limits: 'Susceptible to false positives in the presence of paint vapors, heavy industrial diesel smoke, or ammonia-based cleaners.',
        civilianEquivalent: 'Airport explosive/narcotics luggage trace detectors and fire service CMIC monitors.'
      },
      {
        name: 'Colorimetric Reagent Tubes (Dräger System)',
        category: 'Chemical / Industrial',
        principle: 'A calibrated air volume is hand-pumped through a sealed glass tube containing chemical reagents bound to silica gel. The presence of the target gas triggers a visible chemical color shift; the length of the colored stain indicates concentration in ppm (parts per million).',
        history: 'Invented by Heinrich Dräger in Germany in the 1930s for coal mine rescue crews.',
        limits: 'Single-use, manual visual reading vulnerable to operator error, brief pumping delay (30–60 seconds).',
        civilianEquivalent: 'Dräger or Gastec chemical tubes widely used in industrial safety and occupational health.'
      },
      {
        name: 'Mobile PCR & Lateral Flow Strips (LFD)',
        category: 'Biological',
        principle: 'Lateral flow strips employ gold nanoparticle-conjugated antibodies to bind specific toxins (ricin, botulinum), generating a colored line (identical to Covid rapid tests). Mobile PCR (Polymerase Chain Reaction) amplifies bacterial or viral DNA/RNA within 45 minutes.',
        history: 'Accelerated dramatically following the 2001 postal anthrax attacks (BioFire FilmArray, RAZOR EX systems).',
        limits: 'Test strips require a minimum antigen threshold; mobile PCR requires refrigerated reagents and trained operators.',
        civilianEquivalent: 'Hospital rapid diagnostic orientation tests (RDOT).'
      }
    ]
  },
  {
    id: 'protection',
    name: '2. Personal & Collective Protection (PPE & Shelters)',
    icon: 'masks',
    color: 'text-[#ba1a1a]',
    description: 'Prevent hazardous particles, toxic vapors, or fallout from entering contact with the body (airways, eyes, mucous membranes, intact skin).',
    tools: [
      {
        name: 'Full-Face Panoramic Respirators with ABEK2P3 Filters',
        category: 'Chemical / Biological / Radiological',
        principle: 'Elastomer or silicone full-face mask creating an airtight seal against the face contour via negative inspiratory pressure. Inhaled air passes through an impregnated activated carbon bed (chemical chemisorption) and pleated P3 micro-glass fiber paper (mechanical arrest of 99.95% of aerosols and spores).',
        history: 'Direct evolution from 1915 M2 designs and Cold War S6/ARFA masks into modern NATO standards (Avon M50, French ARFA).',
        limits: 'Ineffective in oxygen-deficient spaces (< 19.5% O₂) or against carbon monoxide (CO).',
        civilianEquivalent: 'Civilian full-face masks certified EN 136 Class 3 with standardized NATO RD40 (40 mm thread) connector.'
      },
      {
        name: 'Level A / Type 1 Gas-Tight Encapsulating Hazmat Suits',
        category: 'Chemical / Heavy Gas',
        principle: 'Total gas- and liquid-tight one-piece coverall fabricated from multi-layer fluoropolymers (Viton, Butyl, Teflon). The self-contained breathing apparatus (SCBA) is worn inside the suit, maintaining positive internal pressure: in the event of a puncture, air leaks out but external contaminants cannot enter.',
        history: 'Developed for missile silo maintenance and severe petrochemical hazmat incidents in the 1960s.',
        limits: 'Heavy weight (15–20 kg), limited air endurance (20–30 minutes), severe heat stress within minutes.',
        civilianEquivalent: 'Hazmat suits deployed by fire department CMIC squads and Seveso petrochemical refineries.'
      },
      {
        name: 'Positive-Pressure Shelters & Filtered Ventilation Units',
        category: 'Collective Protection',
        principle: 'Enclosed reinforced concrete structure maintained under positive pressure (+50 to +100 Pascals relative to outside) via motor-driven ventilation (with manual backup crank). Intake air is forced through mineral carbon filter banks, ensuring no unpurified air infiltrates through blast door seals.',
        history: 'Standardized by Switzerland in 1963 (TWP civil protection codes) and adopted in government command bunkers worldwide.',
        limits: 'Substantial construction expense, requires regular filter replacements and airlock entry to prevent tracking contaminants into clean zones.',
        civilianEquivalent: 'Swiss civil protection shelters, Israeli Mamad safe rooms, and sealed confinement spaces in residential homes.'
      }
    ]
  },
  {
    id: 'decontamination',
    name: '3. Decontamination & Neutralization',
    icon: 'sanitizer',
    color: 'text-[#005236]',
    description: 'Remove, neutralize, or chemically inactivate toxic agents deposited on personnel, clothing, equipment, or living environments.',
    tools: [
      {
        name: 'Systematic Undressing & Civilian Dry Decontamination',
        category: 'Universal CBRN',
        principle: 'Careful removal of outerwear from top to bottom by rolling clothes outward without pulling over the head and without shaking. This simple, universally accessible procedure alone eliminates 80% to 90% of radioactive or toxic particulate load while preventing re-aerosolization.',
        history: 'Initially taught to submarine crews and healthcare workers during severe contagious outbreaks.',
        limits: 'Does not neutralize agents that have already soaked through fabrics or touched bare skin (face, neck, hands).',
        civilianEquivalent: 'The 8-step emergency undressing protocol documented in the NRBCOR application.'
      },
      {
        name: 'Fuller\'s Earth & Decontamination Powder Mitts',
        category: 'Chemical',
        principle: 'Ultrafine activated smectite natural clay possessing extraordinary physical adsorption properties. Patted onto skin via a powder mitt, it immediately traps liquid nerve agent droplets (Sarin, VX, Mustard) before they penetrate the epidermis.',
        history: 'Employed since WWI and standardized in NATO forces (French F1 mitt, US M291/M295 kits).',
        limits: 'Purely physical adsorption: traps rather than destroys the agent. Contaminated powder remains hazardous and requires proper disposal.',
        civilianEquivalent: 'Dry flour, talcum powder, or dry fine clay used as emergency civilian substitutes.'
      },
      {
        name: 'Alkaline Solutions & Dilute Bleach (Wet Decontamination)',
        category: 'Biological / Chemical',
        principle: 'Dilute sodium hypochlorite (0.5% active chlorine) or quaternary ammonium compounds lyse the protein capsids of viruses/bacteria and hydrolyze organophosphate chemical bonds. On human skin, washing must strictly use warm water and mild soap to protect the natural epidermal barrier.',
        history: 'Universal hospital antisepsis pioneered by Semmelweis and Lister, adapted for civil defense hazmat corridors.',
        limits: 'NEVER apply undiluted bleach to human skin (causes severe caustic burns and increases skin permeability).',
        civilianEquivalent: 'Gentle lukewarm soap shower without scrubbing, and diluted bleach wipes for inert equipment.'
      }
    ]
  },
  {
    id: 'antidotes',
    name: '4. Medical Countermeasures & Specific Antidotes',
    icon: 'medication',
    color: 'text-[#6750a4]',
    description: 'Emergency pharmaceuticals administered to counter intracellular toxic damage or accelerate the excretion of internal radionuclides.',
    tools: [
      {
        name: 'Atropine + Pralidoxime Dual-Chamber Auto-Injectors',
        category: 'Chemical (Nerve Agents)',
        principle: 'Atropine competitively blocks muscarinic receptors overwhelmed by excess acetylcholine (reversing bronchospasm and preventing asphyxiation). Pralidoxime (an oxime) cleaves the organophosphate group from acetylcholinesterase, reactivating the critical enzyme if given before covalent "aging".',
        history: 'Developed during the Cold War for individual infantry issue (US ATNAA or French military AIBC auto-injectors).',
        limits: 'Must be administered within minutes of symptoms via intramuscular injection (thigh/glute through clothing). Ineffective against blister agents or toxins.',
        civilianEquivalent: 'Hospital EMS paramedic drug caches and on-call CBRN emergency medical teams.'
      },
      {
        name: 'Potassium Iodide Tablets (KI 65 mg)',
        category: 'Nuclear',
        principle: 'Immediate thyroid saturation with stable non-radioactive Iodine-127. Flooded thyroid symporters reject inhaled radioactive Iodine-131, which is excreted safely via urine without radiating the gland.',
        history: 'Instituted globally following severe pediatric thyroid cancer rates following Chernobyl in 1986.',
        limits: 'Effective ONLY against radioactive iodine isotopes from nuclear reactor accidents. Completely useless against dirty bombs or cesium fallout.',
        civilianEquivalent: 'KI tablet packages pre-distributed to pharmacies and residences within nuclear emergency zones.'
      },
      {
        name: 'Chelating Agents: Prussian Blue & Ca-DTPA',
        category: 'Radiological',
        principle: 'Prussian Blue (Radiogardase) is an insoluble crystal pigment that binds Cesium-137 and Thallium in the intestine by exchanging potassium ions, blocking enterohepatic recirculation. Ca-DTPA and Zn-DTPA chelate heavy transuranic elements (Plutonium, Americium, Curium), forming complexes excreted by the kidneys.',
        history: 'Administered successfully during the 1987 Goiânia radiological disaster in Brazil (Cesium-137 capsule breach).',
        limits: 'Specialized hospital intravenous or oral therapy requiring careful monitoring of electrolyte and renal function.',
        civilianEquivalent: 'National health agency strategic stockpiles managed under civil emergency reserves.'
      }
    ]
  }
];
