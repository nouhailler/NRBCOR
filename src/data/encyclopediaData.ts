/**
 * NRBCOR — Base de Connaissances Encyclopédique & Glossaire
 * Risque NRBC : Histoire, Conceptualisation Géopolitique, Doctrines Militaires & Outils Développés
 */

export interface GlossaryTerm {
  id: string;
  term: string;
  acronym?: string;
  category: 'nucleaire' | 'radiologique' | 'biologique' | 'chimique' | 'secours' | 'materiel' | 'reglementaire';
  shortDef: string;
  fullDef: string;
  contextUsage: string;
  historicalNote?: string;
  seeAlso?: string[];
}

export interface HistoricalEra {
  id: string;
  title: string;
  period: string;
  headline: string;
  summary: string;
  keyEvents: {
    year: string;
    title: string;
    location: string;
    description: string;
    lessonLearned: string;
  }[];
  doctrinalImpact: string;
}

export interface CountryDoctrine {
  id: string;
  country: string;
  flag: string;
  doctrineName: string;
  organization: string;
  posture: string;
  keyConcepts: string[];
  civilProtectionModel: string;
  militaryUnits: string[];
  historicalEvolution: string;
  strengthsAndLimitations: {
    strengths: string[];
    limitations: string[];
  };
}

export interface NrbcToolCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  tools: {
    name: string;
    category: string;
    principle: string;
    history: string;
    limits: string;
    civilianEquivalent?: string;
  }[];
}

// --------------------------------------------------------------------------
// 1. GLOSSAIRE A-Z
// --------------------------------------------------------------------------
export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'nrbc',
    term: 'NRBC / CBRN',
    acronym: 'Nucléaire, Radiologique, Biologique, Chimique',
    category: 'reglementaire',
    shortDef: 'Ensemble des risques et menaces liés aux agents destructeurs non conventionnels.',
    fullDef: 'Classification universelle désignant les aléas résultant de la dispersion d’agents toxiques chimiques, d’agents biologiques pathogènes, de matières radioactives ou de détonations nucléaires. À l’international et au sein de l’OTAN, on utilise le sigle CBRN (Chemical, Biological, Radiological, Nuclear). La lettre « E » (NRBC-E) y adjoint parfois la composante « Explosif » ou « Engins explosifs improvisés dispersifs ».',
    contextUsage: 'Utilisé par les armées, la sécurité civile, les SAMU et les préfectures pour classifier les plans d’urgence et les unités spécialisées.',
    historicalNote: 'Apparu au cours de la Guerre Froide pour succéder à l’appellation « NBC » (Nucléaire, Biologique, Chimique), avec la dissociation tardive mais cruciale du risque Radiologique (dispersion sans fission).',
    seeAlso: ['alara', 'cmic', 'sgdsn', 'piratox']
  },
  {
    id: 'alara',
    term: 'Principe ALARA',
    acronym: 'As Low As Reasonably Achievable',
    category: 'radiologique',
    shortDef: 'Principe fondamental de radioprotection visant à maintenir l’exposition au niveau le plus bas possible.',
    fullDef: 'Règle d’or internationale formulée par la Commission Internationale de Protection Radiologique (CIPR). Elle repose sur le triptyque opérationnel fondamental : Réduire le TEMPS d’exposition au minimum, Augmenter la DISTANCE par rapport à la source radioactive (loi en 1/d² : doubler la distance divise le débit de dose par 4), et Interposer des ÉCRANS denses (plomb, béton, eau, terre).',
    contextUsage: 'Appliqué dans les interventions d’urgence radiologique, les centrales nucléaires et les services de médecine nucléaire hospitaliers.',
    historicalNote: 'Introduit formellement par la CIPR dans sa publication n° 26 en 1977 pour limiter l’induction d’effets stochastiques (cancers, mutations génétiques).',
    seeAlso: ['sievert', 'becquerel', 'iode-ki']
  },
  {
    id: 'sievert',
    term: 'Sievert (Sv)',
    acronym: 'Sv / mSv / µSv',
    category: 'nucleaire',
    shortDef: 'Unité légale de mesure de la dose efficace et de la nocivité biologique des rayonnements ionisants.',
    fullDef: 'Le Sievert évalue l’impact biologique réel des rayonnements ionisants sur les tissus vivants. Contrairement au Gray (Gy) qui mesure l’énergie physique brute absorbée par kilogramme (1 Gy = 1 J/kg), le Sievert applique des facteurs de pondération radiologique (Wr) et tissulaire (Wt) tenant compte de la dangerosité spécifique du type de rayonnement (alpha, bêta, gamma, neutrons) et de la sensibilité des organes.',
    contextUsage: 'Exposition naturelle moyenne en France : ~4,5 mSv/an. Limite annuelle réglementaire des travailleurs du nucléaire : 20 mSv/an. Seuil d’apparition du syndrome aigu d’irradiation : > 1 000 mSv (1 Sv).',
    historicalNote: 'Nommé en l’honneur du physicien suédois Rolf Sievert, pionnier de la dosimétrie radiologique.',
    seeAlso: ['gray', 'becquerel', 'alara']
  },
  {
    id: 'gray',
    term: 'Gray (Gy)',
    category: 'nucleaire',
    shortDef: 'Unité de dose radioactive absorbée par la matière.',
    fullDef: 'Unité du Système International correspondant à l’absorption d’une énergie d’un Joule par un kilogramme de matière irradiée (1 Gy = 1 J/kg). Il s’agit d’une grandeur physique pure, indépendante de la nature biologique du tissu récepteur.',
    contextUsage: 'Utilisé par les physiciens et en radiothérapie médicale. En urgence NRBC, 4 à 5 Gy reçus en dose aiguë corporelle totale entraînent 50 % de mortalité sans soins lourds (DL50).',
    seeAlso: ['sievert', 'becquerel']
  },
  {
    id: 'becquerel',
    term: 'Becquerel (Bq)',
    category: 'radiologique',
    shortDef: 'Unité de mesure de l’activité radioactive d’une source (nombre de désintégrations par seconde).',
    fullDef: 'Un Becquerel correspond exactement à la désintégration d’un seul noyau atomique par seconde. C’est une unité extrêmement petite : un corps humain adulte présente une radioactivité naturelle interne d’environ 8 000 Bq (due principalement au Potassium-40 et au Carbone-14). Un gramme de Radium-226 produit environ 37 milliards de Bq (1 Curie).',
    contextUsage: 'Utilisé pour mesurer la contamination des sols (Bq/m²), de l’eau (Bq/L) ou des denrées alimentaires (Bq/kg) après un accident radiologique.',
    historicalNote: 'Nommé d’après Henri Becquerel, découvreur de la radioactivité spontanée de l’uranium en 1896 (prix Nobel 1903 avec Pierre et Marie Curie).',
    seeAlso: ['sievert', 'cesium-137', 'iode-131']
  },
  {
    id: 'iode-131',
    term: 'Iode-131 (¹³¹I)',
    category: 'nucleaire',
    shortDef: 'Radionucléide volatil émis lors d’un accident de réacteur nucléaire, capté par la glande thyroïde.',
    fullDef: 'Radio-isotope de l’iode ayant une demi-vie radioactive de 8,02 jours. Émetteur bêta moins et gamma. En cas d’accident majeur avec fusion du cœur (comme Tchernobyl ou Fukushima), l’iode-131 est relâché en grande quantité sous forme gazeuse ou d’aérosols. Inhalé ou ingéré, il est concentré avidement par la glande thyroïde qu’il irradie de l’intérieur, provoquant nodules et cancers, en particulier chez les nourrissons et enfants.',
    contextUsage: 'La parade médicale consiste en la prise préventive de comprimés d’iodure de potassium stable (KI 65 mg) sur ordre des autorités pour saturer la thyroïde avant le passage du panache.',
    historicalNote: 'Tchernobyl (1986) a provoqué plus de 6 000 cancers thyroïdiens chez les enfants biélorusses et ukrainiens ayant consommé du lait contaminé en l’absence de prophylaxie iodée.',
    seeAlso: ['iode-ki', 'cesium-137']
  },
  {
    id: 'iode-ki',
    term: 'Iodure de Potassium (KI 65 mg)',
    category: 'nucleaire',
    shortDef: 'Médicament de saturation thyroïdienne préventive contre l’iode radioactif.',
    fullDef: 'Sel d’iode non radioactif (stable). Administré par voie orale, il sature les récepteurs thyroïdiens en iode sain, empêchant l’absorption ultérieure de l’iode-131 radioactif cancérigène. Son efficacité est maximale (> 95 %) s’il est ingéré entre 2 heures avant le passage du panache et 2 heures après. Il ne protège QUE la glande thyroïde et n’a aucun effet contre les autres radioéléments ni contre les irradiations externes.',
    contextUsage: 'Distribué préventivement aux populations résidant dans le rayon PPI des centrales nucléaires (0-20 km en France, 0-50 km en Suisse). Prise strictement conditionnée à un ordre officiel du Préfet.',
    seeAlso: ['iode-131', 'ppi']
  },
  {
    id: 'cesium-137',
    term: 'Césium-137 (¹³⁷Cs)',
    category: 'nucleaire',
    shortDef: 'Produit de fission majeur à vie longue (30 ans), responsable de la contamination radioactive durable des sols.',
    fullDef: 'Isotope radioactif émetteur bêta et gamma puissant (via son isotope fils le Baryum-137m). Chimiquement analogue au potassium, il est rapidement absorbé par les végétaux, les champignons et la chaîne alimentaire, se fixant dans les muscles des animaux et de l’homme. Sa période radioactive de 30,1 ans en fait le principal contributeur à la contamination environnementale à long terme après un sinistre nucléaire.',
    contextUsage: 'Détectable par spectrométrie gamma terrestre ou aéroportée. Contre-mesure médicale en cas d’ingestion massive : administration de Bleu de Prusse (insoluble), qui capte le césium dans le tractus digestif et accélère son élimination fécale.',
    seeAlso: ['iode-131', 'gray']
  },
  {
    id: 'sarin',
    term: 'Sarin (Agent GB)',
    category: 'chimique',
    shortDef: 'Neurotoxique organophosphoré volatil de la famille des agents G, bloquant l’acétylcholinestérase.',
    fullDef: 'Gaz de combat organophosphoré liquide incolore et inodore à température ambiante, découvert en Allemagne en 1938. Il inhibe de façon irréversible l’acétylcholinestérase, entraînant une accumulation toxique d’acétylcholine dans les synapses nerveuses et neuromusculaires. Conséquences immédiates : myosis extrême (contraction des pupilles), hypersalivation, bronchoconstriction sévère, convulsions généralisées, paralysie respiratoire et mort par asphyxie en quelques minutes.',
    contextUsage: 'Arme chimique de destruction massive classée au Tableau 1 de la CIAC. Antidote d’urgence : atropine (antagoniste cholinergique) couplée à un réactivateur enzymatique (oximes : pralidoxime, obidoxime) et anticonvulsivant (diazépam).',
    historicalNote: 'Utilisé par la secte Aum Shinrikyo dans le métro de Tokyo (1995, 13 morts, 6 000 intoxiqués) et lors du massacre de la Ghouta en Syrie (2013, plus d’un millier de victimes).',
    seeAlso: ['vx', 'tabun', 'novitchok', 'atropine']
  },
  {
    id: 'vx',
    term: 'Agent VX',
    category: 'chimique',
    shortDef: 'Neurotoxique organophosphoré persistant de la famille des agents V, létal par simple contact cutané.',
    fullDef: 'Liquide huileux ambré, inodore et très peu volatil, développé par le centre de recherche militaire britannique de Porton Down en 1952. Contrairement aux agents G qui agissent surtout par inhalation, le VX est conçu pour la persistance au sol (plusieurs semaines) et la pénétration transcutanée fulgurante : une gouttelette microscopique (10 milligrammes) déposée sur la peau intacte est létale pour un être humain adulte en moins de 15 minutes.',
    contextUsage: 'Exige une protection corporelle intégrale étanche (tenue MOPP 4 ou TLD) car un masque respiratoire seul ne protège pas contre la contamination percutanée.',
    historicalNote: 'Employé pour l’assassinat de Kim Jong-nam à l’aéroport de Kuala Lumpur en 2017 au moyen d’une application faciale combinée.',
    seeAlso: ['sarin', 'novitchok', 'mopp']
  },
  {
    id: 'novitchok',
    term: 'Agents Novitchok (« Nouveau venu »)',
    category: 'chimique',
    shortDef: 'Famille de neurotoxiques binaires de 4e génération développés en URSS, d’une toxicité extrême.',
    fullDef: 'Agents chimiques militaires organophosphorés ultra-létaux conçus par l’Institut de chimie organique d’État de Moscou (GosNIIOKhT) dans les années 1970-1990 sous le programme « Foliant ». Nombre d’entre eux sont des composés binaires (deux précurseurs moins toxiques mélangés juste avant l’emploi). Ils ont été étudiés pour contourner les inspections de la CIAC et résister aux antidotes classiques comme les oximes usuelles.',
    contextUsage: 'Identifiés lors de l’empoisonnement de Sergueï et Ioulia Skripal à Salisbury au Royaume-Uni (2018) et d’Alexeï Navalny en Russie (2020).',
    seeAlso: ['sarin', 'vx']
  },
  {
    id: 'yperite',
    term: 'Ypérite / Gaz Moutarde',
    category: 'chimique',
    shortDef: 'Agent vésicant persistant majeur causant de graves brûlures chimiques cutanées et oculaires.',
    fullDef: 'Sulfure d’éthyle dichloré. Liquide huileux à forte odeur d’ail ou de moutarde. Agent alkylant cytotoxique puissant qui détruit l’ADN cellulaire. Ses effets sont insidieux : aucun symptôme immédiat à l’exposition, puis après une période de latence de 4 à 12 heures, apparition de cloques géantes purulentes (phlyctènes), d’une cécité temporaire ou définitive par nécrose cornéenne, et d’un œdème pulmonaire aigu.',
    contextUsage: 'Décontamination cutanée immédiate impérative dans les 2 premières minutes (au-delà, l’ypérite s’est fixée de manière irréversible dans l’épiderme).',
    historicalNote: 'Utilisé pour la première fois à Ypres le 12 juillet 1917 par l’armée allemande. Réutilisé lors du conflit Iran-Irak (1980-1988) et par l’Italie en Éthiopie (1935).',
    seeAlso: ['deshabillage', 'cmic']
  },
  {
    id: 'phosgene',
    term: 'Phosgène (Agent CG)',
    category: 'chimique',
    shortDef: 'Gaz suffocant industriel et de guerre provoquant un œdème aigu du poumon retardé.',
    fullDef: 'Dichlorure de carbonyle (COCl2). Gaz dense, incolore, sentant le foin fraîchement coupé. Il s’attaque aux alvéoles pulmonaires en hydrolysant les membranes et en provoquant la destruction des capillaires. Sa caractéristique la plus dangereuse est sa période de latence clinique (6 à 24 heures) : la victime peut se sentir en parfaite santé avant de développer subitement un œdème aigu du poumon massif et mortel par « noyade interne ».',
    contextUsage: 'Substance chimique de synthèse industrielle massive (fabrication des polyuréthanes et pesticides). Nécessite une mise au repos absolu sans aucun effort de toute personne suspectée d’exposition.',
    seeAlso: ['chlore', 'confinement']
  },
  {
    id: 'chlore',
    term: 'Chlore (Cl₂)',
    category: 'chimique',
    shortDef: 'Gaz suffocant et corrosif vert-jaunâtre, dense (2,5 fois plus lourd que l’air), à odeur piquante.',
    fullDef: 'Produit chimique industriel produit par millions de tonnes pour la javellisation et la synthèse industrielle. Au contact de l’humidité des yeux et des voies respiratoires, le chlore se transforme en acide chlorhydrique et acide hypochloreux, occasionnant spasmes laryngés, brûlures chimiques des bronches et détresse respiratoire. Étant 2,5 fois plus lourd que l’air, il rampe au sol et s’accumule dans les caves, tranchées et stations souterraines.',
    contextUsage: 'En cas de fuite industrielle de chlore, interdiction absolue de se réfugier en sous-sol ou en excavation ; gagner les étages supérieurs d’un bâtiment en dur calfeutré.',
    historicalNote: 'Premier gaz de combat moderne utilisé à grande échelle le 22 avril 1915 à Ypres par l’armée allemande.',
    seeAlso: ['phosgene', 'confinement']
  },
  {
    id: 'anthrax',
    term: 'Charbon / Anthrax (Bacillus anthracis)',
    category: 'biologique',
    shortDef: 'Bactérie sporulée hautement pathogène produisant des toxines létales, arme biologique historique.',
    fullDef: 'Bacillus anthracis est une bactérie Gram positif capable de former des endospores extrêmement résistantes à la chaleur, aux UV et aux désinfectants usuels, pouvant survivre des décennies dans le sol. Forme pulmonaire contractée par inhalation d’aérosols (taux de mortalité > 85 % en l’absence d’antibiothérapie précoce massive par ciprofloxacine/doxycycline). Les spores ne sont ni volatiles spontanément ni contagieuses d’homme à homme.',
    contextUsage: 'Classé au niveau 3/4 de biosécurité. Traité dans le plan gouvernemental BIOTOX.',
    historicalNote: 'Attaques postales de l’automne 2001 aux États-Unis (« Amerithrax » : 5 morts, 17 contaminés, panique mondiale). L’île écossaise de Gruinard est restée contaminée pendant 48 ans suite à des tests britanniques en 1942.',
    seeAlso: ['biotox', 'ricine']
  },
  {
    id: 'ricine',
    term: 'Ricine',
    category: 'biologique',
    shortDef: 'Toxine végétale protéique extraite des graines de ricin, bloquant la synthèse cellulaire.',
    fullDef: 'Toxine ribosome-inactivatrice (RIP de type 2) extraite de la plante Ricinus communis. Une seule molécule de ricine pénétrant dans le cytosol d’une cellule humaine désactive jusqu’à 1 500 ribosomes par minute, stoppant toute production de protéines et conduisant à la mort cellulaire. Par inhalation, elle provoque nécrose des voies aériennes et œdème létal en 36 à 72 heures. Il n’existe aucun antidote homologué pour l’homme.',
    contextUsage: 'Substance surveillée conjointement au titre des armes chimiques (tableau 1 CIAC) et des agents biologiques de catégorie B.',
    historicalNote: 'Utilisée par les services secrets bulgares pour assassiner le dissident Georgi Markov à Londres en 1978 à l’aide d’un parapluie injecteur à micro-bille de platine.',
    seeAlso: ['anthrax', 'biotox']
  },
  {
    id: 'cmic',
    term: 'CMIC / CMIR',
    acronym: 'Cellule Mobile d’Intervention Chimique / Radiologique',
    category: 'secours',
    shortDef: 'Unités opérationnelles d’élite des sapeurs-pompiers français dédiées aux urgences technologiques.',
    fullDef: 'Unités spécialisées départementales des Services Départementaux d’Incendie et de Secours (SDIS), de la Brigade de Sapeurs-Pompiers de Paris (BSPP) et du Bataillon de Marins-Pompiers de Marseille (BMPM). Équipées de véhicules de reconnaissance NRBC (VR-NRBC), de spectromètres infrarouge/Raman, de détecteurs multigaz, de tenues scaphandres étanches étiquetées Type 1a et de sas de décontamination mobile pour intervenants et victimes.',
    contextUsage: 'Engagées dès qu’une suspicion de pollution toxique, fuite Seveso, colis suspect radioactif ou explosion d’usine est signalée.',
    seeAlso: ['prv', 'sgdsn', 'piratox']
  },
  {
    id: 'prv',
    term: 'PRV (Point de Rassemblement des Victimes)',
    category: 'secours',
    shortDef: 'Zone sécurisée de triage médical et de décontamination avant évacuation hospitalière.',
    fullDef: 'Structure de secours déployée à la frontière de la zone d’exclusion (zone rouge) et de la zone contrôlée (zone orange). Les victimes y subissent un tri d’urgence, une décontamination d’urgence (déshabillage, aspersion contrôlée tiède et séchage doux) pour éviter le transfert de toxiques vers les hôpitaux (« non-contamination de la chaîne de soins »), puis un bilan médical avant évacuation vers les PMA (Postes Médicaux Avancés).',
    contextUsage: 'Élément clé des plans NOVI (Nombreuses Victimes) et ORSEC-NRBC.',
    seeAlso: ['cmic', 'deshabillage']
  },
  {
    id: 'mopp',
    term: 'Tenue MOPP',
    acronym: 'Mission Oriented Protective Posture',
    category: 'materiel',
    shortDef: 'Doctrine militaire de graduation des tenues de protection NRBC (niveaux MOPP 0 à 4).',
    fullDef: 'Standard de l’OTAN définissant 5 niveaux d’équipement du combattant face à la menace CBRN : MOPP 0 (équipement transporté mais non porté), MOPP 1 (survêtement filtrant enfilé), MOPP 2 (survêtement et bottes enfilées), MOPP 3 (masque et capuchon enfilés, gants prêts), MOPP 4 (protection intégrale hermétique avec gants en butyle scellés).',
    contextUsage: 'Permet aux commandants de moduler la protection en fonction du renseignement pour limiter la fatigue thermique extrême subie par les soldats en MOPP 4.',
    seeAlso: ['tld', 'abek2p3']
  },
  {
    id: 'tld',
    term: 'Tenue TLD / Tenue Légère de Décontamination',
    category: 'materiel',
    shortDef: 'Combinaison filtrante ou étanche de protection contre les particules radioactives et aérosols.',
    fullDef: 'Tenues utilisées en milieu civil et militaire. On distingue les combinaisons étanches non poreuses (Type 1 ou 3, imperméables aux gaz mais générant un stress thermique en moins de 30 minutes) et les tenues filtrantes perméables à l’air contenant une couche de billes de charbon actif adsorbantes (permettant l’évacuation de la sueur tout en capturant les vapeurs chimiques toxiques).',
    contextUsage: 'Standard équipant les unités d’intervention des sapeurs-pompiers et le 2e Régiment de Dragons de l’Armée de Terre.',
    seeAlso: ['mopp', 'abek2p3']
  },
  {
    id: 'abek2p3',
    term: 'Cartouche Filtrante ABEK2P3',
    category: 'materiel',
    shortDef: 'Filtre combiné polyvalent universel protégeant contre les 4 grandes familles de gaz et les poussières.',
    fullDef: 'Norme européenne (EN 14387) définissant les filtres de masques respiratoires à cartouche : bande Marron A (vapeurs organiques de point d’ébullition > 65°C), bande Grise B (gaz et vapeurs inorganiques comme le chlore, cyanure d’hydrogène), bande Jaune E (dioxyde de soufre et acides), bande Verte K (ammoniac et dérivés aminés), classe 2 (capacité moyenne), associée à un filtre à particules haute efficacité P3 (bande Blanche, arrêt de 99,95 % des particules et bio-aérosols).',
    contextUsage: 'Attention : un filtre ABEK ne fournit pas d’oxygène ! Il est mortel de l’utiliser dans un local où le taux d’O₂ est descendu sous 19,5 % ou saturé en monoxyde de carbone (CO).',
    seeAlso: ['mopp', 'confinement']
  },
  {
    id: 'sgdsn',
    term: 'SGDSN',
    acronym: 'Secrétariat Général de la Défense et de la Sécurité Nationale',
    category: 'reglementaire',
    shortDef: 'Organisme interministériel français rattaché au Premier Ministre, chargé de la planification de crise.',
    fullDef: 'Haut organisme d’État assurant la coordination de la sécurité nationale et de la résilience du pays. Il élabore et maintient à jour les plans gouvernementaux majeurs de réponse aux attaques et accidents d’ampleur exceptionnelle : plan PIRATOX (attaques chimiques), plan BIOTOX (menaces biologiques), plan PIRATOME (terrorisme nucléaire/radiologique) et plan PIRANET (cyberattaques critiques).',
    contextUsage: 'Autorité centrale fixant la doctrine d’emploi des stocks stratégiques d’antidotes et d’équipements de protection civile.',
    seeAlso: ['piratox', 'biotox', 'dgscgc']
  },
  {
    id: 'piratox',
    term: 'Plan Gouvernemental PIRATOX',
    category: 'reglementaire',
    shortDef: 'Plan de réponse de l’État français face à une attaque ou un incident chimique majeur.',
    fullDef: 'Plan classifié secret de la défense nationale (avec volet public de sécurité civile) précisant la chaîne de commandement, la mobilisation des unités militaires (2e Régiment de Dragons), l’acheminement des antidotes des stocks stratégiques nationaux (atropine, oximes) et le bouclage judiciaire des zones d’attentat chimique.',
    contextUsage: 'Déclenché par décision du Premier Ministre sur alerte de renseignement ou constatation d’un attentat par agent chimique.',
    seeAlso: ['biotox', 'sgdsn']
  },
  {
    id: 'biotox',
    term: 'Plan Gouvernemental BIOTOX',
    category: 'reglementaire',
    shortDef: 'Dispositif national de prévention et de riposte face aux actes de bioterrorisme et épidémies délibérées.',
    fullDef: 'Mis en place en 2001 suite aux attaques à l’anthrax. Il organise la surveillance épidémiologique accélérée en temps réel (réseau Sentinelles, urgences hospitalières), la sécurisation des laboratoires P3/P4, le pré-positionnement de stocks de vaccins (variole) et d’antibiotiques de masse, ainsi que la protection des stations d’épuration et réseaux d’eau potable.',
    contextUsage: 'Coordonné par le Ministère de la Santé (DGS) et le SGDSN.',
    seeAlso: ['anthrax', 'sgdsn']
  },
  {
    id: 'cenal',
    term: 'CENAL / Alertswiss',
    acronym: 'Centrale Nationale d’Alarme (Suisse)',
    category: 'secours',
    shortDef: 'Organe fédéral suisse de gestion des événements radiologiques, chimiques et catastrophes majeures.',
    fullDef: 'Division de l’Office fédéral de la protection de la population (OFPP/BABS) basée à Berne. Elle surveille en permanence la situation radiologique helvétique via son réseau de 76 sondes NADAM automatiques et les débits de dose aux frontières. En cas d’accident, elle déclenche les 5 000 sirènes fixes d’alarme générale, diffuse les consignes sur l’application smartphone Alertswiss et gère la distribution d’iode sous mandat de l’OFSP.',
    contextUsage: 'Point de contact unique helvétique avec l’AIEA et les pays voisins (France, Allemagne, Italie, Autriche).',
    seeAlso: ['alara', 'iode-ki']
  }
];

// --------------------------------------------------------------------------
// 2. HISTOIRE DU RISQUE NRBC : GRANDES ÉTAPES CHRONOLOGIQUES
// --------------------------------------------------------------------------
export const HISTORICAL_ERAS: HistoricalEra[] = [
  {
    id: 'era-ww1',
    title: '1. Naissance de la Guerre Chimique Moderne (1914 - 1925)',
    period: '1914 - 1925',
    headline: 'De la chimie industrielle aux tranchées d’Ypres : le choc de l’arme invisible',
    summary: 'Bien que des munitions lacrymogènes aient été expérimentées dès l’automne 1914, c’est au printemps 1915 que la guerre chimique industrielle est théorisée et mise en œuvre par le chimiste allemand Fritz Haber. En quelques mois, le conflit bascule dans une course effrénée entre agents suffocants (chlore, phosgène), agents vésicants (ypérite) et masques respiratoires de fortune.',
    keyEvents: [
      {
        year: '22 Avril 1915',
        title: 'Bataille d’Ypres : Premier nuage toxique massif de chlore',
        location: 'Ypres, Belgique',
        description: 'L’armée allemande ouvre 5 730 cylindres sous pression contenant 168 tonnes de chlore gazeux sur un front de 6 km face aux troupes françaises et canadiennes. Un mur de fumée verdâtre dense de 2 mètres de haut avance avec le vent. Les soldats suffoquent sans protection : 5 000 morts et 10 000 intoxiqués en quelques heures.',
        lessonLearned: 'Naissance du concept de défense passive : les soldats découvrent l’inefficacité des mouchoirs trempés d’urine et la nécessité de masques à tampon neutralisant puis à cartouche filtrante.'
      },
      {
        year: '1915 - 1916',
        title: 'Apparition du Phosgène et Masques M2 / boîte filtrante',
        location: 'Front Ouest',
        description: 'Introduction du phosgène, dix fois plus toxique que le chlore et presque indétectable immédiatement. Les belligérants développent le masque français M2 puis le masque à cartouche de charbon actif de Nicolaï Zelinsky (adopté par les Alliés et l’armée impériale russe).',
        lessonLearned: 'Le charbon de bois activé devient la matière première incontournable de toute la filtration respiratoire moderne.'
      },
      {
        year: '12 Juillet 1917',
        title: 'Première utilisation de l’Ypérite (« Gaz Moutarde »)',
        location: 'Ypres, Belgique',
        description: 'L’état-major allemand introduit des obus au sulfure d’éthyle dichloré (Croix Jaune). Pour la première fois, le masque à gaz ne suffit plus : le toxique pénètre les tissus des uniformes, ronge la peau sous forme d’immenses ampoules et rend le terrain inhabitable pendant des semaines.',
        lessonLearned: 'Compréhension du risque percutané et début des recherches sur les tenues imperméables intégrales et la décontamination des sols.'
      },
      {
        year: '17 Juin 1925',
        title: 'Signature du Protocole de Genève',
        location: 'Genève, Suisse (Société des Nations)',
        description: 'Sous le choc du bilan effroyable (plus de 100 000 morts et 1,2 million de gazés pendant la Grande Guerre), 38 États signent le protocole prohibant l’emploi à la guerre de gaz asphyxiants, toxiques ou similaires et de moyens bactériologiques.',
        lessonLearned: 'Premier traité international de limitation, bien que n’interdisant ni la production ni le stockage, et comportant une clause de réciprocité en cas d’attaque ennemie.'
      }
    ],
    doctrinalImpact: 'Création des premiers corps de chimistes militaires et prise de conscience que l’arme chimique dépend entièrement de la météo (vent, température, hygrométrie).'
  },
  {
    id: 'era-ww2',
    title: '2. Seconde Guerre Mondiale : Neurotoxiques & Entrée dans l’Ère Atomique (1936 - 1945)',
    period: '1936 - 1945',
    headline: 'Découverte des agents organophosphorés, atrocités bactériologiques et détonation nucléaire',
    summary: 'La Seconde Guerre Mondiale voit une dissuasion mutuelle chimique sur le front européen : Hitler comme Churchill stockent des dizaines de milliers de tonnes de toxiques sans oser les employer sur le champ de bataille par crainte de représailles massives sur leurs villes. En coulisses, l’Allemagne invente les neurotoxiques de la série G, le Japon expérimente les armes biologiques sur des civils, et les États-Unis déclenchent la première réaction en chaîne nucléaire militaire.',
    keyEvents: [
      {
        year: '1936 - 1938',
        title: 'Synthèse du Tabun puis du Sarin par Gerhard Schrader',
        location: 'Laboratoires IG Farben, Elberfeld, Allemagne',
        description: 'En travaillant sur des insecticides organophosphorés pour l’agriculture, le chimiste Schrader synthétise des molécules d’une létalité sans précédent. Le Troisième Reich classe immédiatement ces travaux secret d’État et construit l’usine souterraine de Dyhernfurth produisant des milliers de tonnes de Tabun et de Sarin.',
        lessonLearned: 'Apparition des agents agissant sur le système nerveux autonome en quelques microgrammes. Les masques à gaz ordinaires doivent être associés à des antidotes injectables.'
      },
      {
        year: '1937 - 1945',
        title: 'Unité 731 japonaise et guerre bactériologique en Chine',
        location: 'Pingfan, Mandchourie',
        description: 'Sous la direction du général Shiro Ishii, l’Unité 731 mène des expérimentations humaines à grande échelle avec la peste, le choléra et le charbon, dispersant des puces infectées par bombardement aérien sur des villes chinoises (Ningbo, Changteh).',
        lessonLearned: 'Démonstration de la cruauté et de la complexité logistique des agents vivants (perte de contrôle de l’épidémie, résistance des vecteurs).'
      },
      {
        year: '16 Juillet & Août 1945',
        title: 'Essai Trinity et bombardements d’Hiroshima et Nagasaki',
        location: 'Nouveau-Mexique, Hiroshima et Nagasaki, Japon',
        description: 'La première bombe atomique au plutonium explose à Alamogordo. Le 6 août 1945, la bombe à l’uranium Little Boy détruit Hiroshima ; le 9 août, Fat Man frappe Nagasaki. Plus de 200 000 personnes meurent sous le souffle, le flash thermique et le syndrome aigu d’irradiation.',
        lessonLearned: 'L’humanité entre dans l’âge atomique. La composante « N » supplante immédiatement toutes les autres doctrines de défense civile mondiales.'
      }
    ],
    doctrinalImpact: 'Les états-majors abandonnent la vision tactique de tranchée pour penser la survie des nations face à des frappes de destruction massive capables de raser une métropole en une fraction de seconde.'
  },
  {
    id: 'era-coldwar',
    title: '3. La Guerre Froide : L’Équilibre de la Terreur & le Risque Radiologique (1947 - 1991)',
    period: '1947 - 1991',
    headline: 'Course aux mégatonnes, doctrine MAD, émergence du VX et accidents de réacteurs civils',
    summary: 'Pendant près de quarante ans, l’affrontement Est-Ouest structure la doctrine NRBC mondiale. L’acronyme NBC (Nucléaire, Biologique, Chimique) s’impose dans tous les manuels de l’OTAN et du Pacte de Varsovie. Les deux superpuissances accumulent plus de 60 000 ogives nucléaires, créent le VX et le Novitchok, et bâtissent des complexes biologiques secrets monumentaux comme Biopreparat en URSS.',
    keyEvents: [
      {
        year: '1952',
        title: 'Découverte du VX à Porton Down et brevets de 2e génération',
        location: 'Royaume-Uni / Arsenal de Pine Bluff, USA',
        description: 'Synthèse des agents neurotoxiques persistants de la série V. Dix fois plus toxique que le Sarin par voie respiratoire et plusieurs centaines de fois plus létal par voie cutanée.',
        lessonLearned: 'Obligation de concevoir des tenues de combat filtrantes permanentes (futur standard MOPP de l’OTAN).'
      },
      {
        year: 'Avril 1979',
        title: 'Accident d’anthrax militaire de Sverdlovsk',
        location: 'Sverdlovsk (Iekaterinbourg), URSS',
        description: 'Un filtre à air manquant dans un laboratoire militaire secret du complexe Biopreparat provoque la libération accidentelle d’un nuage d’aérosols de spores de charbon. Au moins 68 personnes meurent du charbon pulmonaire sous le vent de l’installation, révélant au grand jour la violation clandestine de la convention de 1972 par l’Union Soviétique.',
        lessonLearned: 'Prise de conscience du danger mortel des bio-manipulations industrielles et de l’importance capitale des systèmes de filtration HEPA sécurisés.'
      },
      {
        year: '26 Avril 1986',
        title: 'Catastrophe nucléaire de Tchernobyl',
        location: 'Centrale Lénine, Pripiat, Ukraine (URSS)',
        description: 'L’explosion du réacteur n° 4 libère un panache radiologique de plusieurs milliards de milliards de Becquerels traversant toute l’Europe. Près de 600 000 « liquidateurs » sont mobilisés dans des conditions dosimétriques dantesques pour étouffer le cœur en fusion et construire le premier sarcophage.',
        lessonLearned: 'Le risque nucléaire civil démontre son caractère transfrontalier absolu. Création de réseaux de balises télé-dosimétriques automatiques (Téléray en France, NADAM en Suisse) et institution de la distribution préventive d’iode stable aux populations riveraines.'
      }
    ],
    doctrinalImpact: 'Formalisation de la doctrine ALARA, séparation conceptuelle claire entre l’arme atomique à fission/fusion (Nucléaire) et la contamination par dispersion passive de radioéléments (Radiologique).'
  },
  {
    id: 'era-contemporary',
    title: '4. Ère Contemporaine : Risques Asymétriques, Seveso & Menaces Hybrides (1995 - Présent)',
    period: '1995 - Aujourd’hui',
    headline: 'Bioterrorisme postal, attaques au neurotoxique ciblé, accidents industriels et résilience citoyenne',
    summary: 'Avec la chute du rideau de fer, la menace ne se résume plus à un conflit frontal entre grandes armées. Elle se dissémine dans le terrorisme non étatique (Tokyo 1995, Amerithrax 2001), les assassinats ciblés aux armes de guerre chimique (Salisbury 2018), les accidents industriels majeurs au cœur des bassins urbains (Toulouse AZF 2001, Fukushima 2011, Lubrizol Rouen 2019) et les risques hybrides de frappes sur infrastructures critiques.',
    keyEvents: [
      {
        year: '20 Mars 1995',
        title: 'Attentat au Sarin dans le métro de Tokyo par Aum Shinrikyo',
        location: 'Tokyo, Japon',
        description: 'Des membres de la secte percent des poches plastiques de sarin liquide avec des pointes de parapluie dans cinq rames de métro convergent vers les ministères. 13 morts, 6 000 intoxiqués, engorgement total des hôpitaux par des milliers de « faux malades » (victimes de panique anxieuse).',
        lessonLearned: 'Prise de conscience que les civils sont désormais en première ligne. Les services de secours municipaux (pompiers, SAMU) doivent être équipés d’équipements NRBC jusque-là réservés aux militaires.'
      },
      {
        year: 'Automne 2001',
        title: 'Attaques à l’Anthrax postal (« Amerithrax »)',
        location: 'Washington, New York, Floride, USA',
        description: 'Des lettres contenant une poudre de spores d’anthrax hautement militarisée et fluidifiée sont envoyées à des sénateurs et médias américains, paralysant les services postaux mondiaux.',
        lessonLearned: 'Création en France du plan gouvernemental BIOTOX et dotation des sapeurs-pompiers de sas de décontamination mobiles pour les colis suspects.'
      },
      {
        year: '11 Mars 2011',
        title: 'Catastrophe de Fukushima Daiichi',
        location: 'Préfecture de Fukushima, Japon',
        description: 'Un séisme de magnitude 9 suivi d’un tsunami détruit les générateurs de secours de la centrale, causant la fusion partielle de 3 réacteurs et des rejets atmosphériques et maritimes majeurs.',
        lessonLearned: 'Évacuation de plus de 150 000 personnes, révision mondiale des périmètres PPI (élargissement à 20 km en France) et redéfinition des seuils d’intervention d’urgence (OILs) par l’AIEA.'
      },
      {
        year: '2018 - 2020',
        title: 'Affaires Skripal et Navalny : résurgence des Novitchok',
        location: 'Salisbury (Royaume-Uni) et Tomsk (Russie)',
        description: 'Emploi ciblé d’agents neurotoxiques de 4e génération pour des tentatives d’assassinat en plein environnement civil urbain, provoquant la contamination secondaire de passants et de policiers.',
        lessonLearned: 'Preuve que les arsenaux chimiques militaires n’ont pas tous été détruits et que la persistance sur les poignées de porte et objets du quotidien est une réalité tactique.'
      }
    ],
    doctrinalImpact: 'Consécration du rôle fondamental du citoyen : les premières 15 minutes appartiennent à la population avant l’arrivée des secours spécialisés (d’où l’absolue nécessité d’applications pédagogiques hors-ligne comme NRBCOR).'
  }
];

// --------------------------------------------------------------------------
// 3. DOCTRINES PAR PAYS & ARMÉES
// --------------------------------------------------------------------------
export const COUNTRY_DOCTRINES: CountryDoctrine[] = [
  {
    id: 'france',
    country: 'France',
    flag: '🇫🇷',
    doctrineName: 'Continuum Défense / Sécurité Nationale & Plans Interministériels',
    organization: 'SGDSN (Secrétariat Général de la Défense), Ministère de l’Intérieur (DGSCGC), Service de Santé des Armées (SSA)',
    posture: 'Dissuasion nucléaire souveraine stricte en amont, et organisation unifiée de la Sécurité Civile (ORSEC / Plans de Secours Spécialisés) en aval.',
    keyConcepts: [
      'Concept de continuum de sécurité : aucune rupture entre armée et sécurité civile en cas d’attaque intérieure.',
      'Plans gouvernementaux dédiés : PIRATOX (chimique), BIOTOX (biologique), PIRANET (cyber), PIRATOME (nucléaire/radiologique).',
      'Chaîne de décontamination hospitalière stricte : interdiction formelle d’accueillir des victimes non décontaminées dans les urgences ordinaires.',
      'Réseau d’alerte hertzien et cellulaire unifié (RNA sirènes 120 dB + FR-Alert sur smartphones 4G/5G).'
    ],
    civilProtectionModel: 'Modèle professionnalisé et volontaire sous commandement préfectoral. Les sapeurs-pompiers territoriaux arment les cellules spécialisées CMIC (chimique) et CMIR (radiologique). Le citoyen est appelé à la résilience passive (confinement en pièce close, pas de masque étatique distribué à l’avance).',
    militaryUnits: [
      '2e Régiment de Dragons (2e RD) de Fontevraud : Unique régiment de l’Armée de Terre spécialisé dans la reconnaissance, le prélèvement et la décontamination NRBC lourde.',
      'Service de Santé des Armées (SSA) : Détachements d’intervention médicale NRBC et gestion de la Pharmacie Centrale des Armées (fabrication des lots d’iode et auto-injecteurs).',
      'CMIR / CMIC de la BSPP (Paris) et du BMPM (Marseille).'
    ],
    historicalEvolution: 'Forgée après la Première Guerre mondiale, refondue en 2001 post-attentats du 11-Septembre avec le Livre Blanc sur la Défense et la doctrine de résilience territoriale globale.',
    strengthsAndLimitations: {
      strengths: [
        'Excellence mondiale du Service de Santé des Armées et des sapeurs-pompiers (CMIC/CMIR).',
        'Parc nucléaire hautement surveillé par l’ASNR / IRSN avec plans PPI quinquennaux rigoureux.',
        'Système FR-Alert sans téléchargement préalable utilisant la diffusion cellulaire.'
      ],
      limitations: [
        'Peu d’abris antiatomiques ou anti-gaz dédiés pour la population civile générale.',
        'Culture de résilience citoyenne historiquement plus faible que dans les pays nordiques ou en Suisse.'
      ]
    }
  },
  {
    id: 'suisse',
    country: 'Suisse',
    flag: '🇨🇭',
    doctrineName: 'Modèle Fédéral de Protection Civile Intégrale & Abris Systématiques',
    organization: 'Office Fédéral de la Protection de la Population (OFPP / BABS), Centrale Nationale d’Alarme (CENAL), Armée suisse',
    posture: 'Neutralité armée, défense territoriale globale et autosuffisance totale des populations civiles en milieu dégradé.',
    keyConcepts: [
      'Principe constitutionnel : « Chaque habitant doit disposer d’une place protégée dans un abri à proximité de son domicile » (loi LPPCi).',
      'Parc national unique au monde de près de 370 000 abris civils offrant 9 millions de places (taux de couverture supérieur à 100 % de la population).',
      'Filtration d’air militaire NBC standardisée (ventilations VA-40/VA-75 avec filtres à gaz et préfiltres antiaérosols dans chaque abri).',
      'Distribution préventive de boîtes de comprimés d’iode stable à domicile dans un rayon élargi de 50 km autour des centrales nucléaires (Beznau, Gösgen, Leibstadt).'
    ],
    civilProtectionModel: 'Protection Civile (PCi) obligatoire avec service de milice. Organisation fédérale décentralisée aux 26 cantons, synchronisée par la CENAL et l’application Alertswiss.',
    militaryUnits: [
      'Bataillon de défense NBC 10 de l’Armée suisse (Spiez) : Centre d’excellence et laboratoire mondial de référence pour l’analyse des toxiques (Laboratoire de Spiez).',
      'Compagnies cantonales d’intervention de la Protection Civile.'
    ],
    historicalEvolution: 'Bâti dès les années 1960 au cœur de la Guerre Froide pour garantir la survie de la nation helvétique même en cas de frappe nucléaire tactique sur le théâtre européen.',
    strengthsAndLimitations: {
      strengths: [
        'Capacité d’accueil physique sous abri ventilé pour l’ensemble de la population.',
        'Culture civique remarquable des stocks d’urgence domestiques (réserve de secours 7-14 jours).',
        'Laboratoire de Spiez mondialement accrédité par l’OIAC et l’ONU.'
      ],
      limitations: [
        'Coût d’entretien colossal du parc immobilier d’abris et vieillissement des filtres individuels.',
        'Densité industrielle chimique élevée dans le bassin rhénan (Bâle).'
      ]
    }
  },
  {
    id: 'usa',
    country: 'États-Unis',
    flag: '🇺🇸',
    doctrineName: 'Joint CBRN Defense Program (JPEO-CBRND) & Homeland Security',
    organization: 'Department of Defense (DoD), FEMA, DTRA (Defense Threat Reduction Agency), CDC',
    posture: 'Capacité expéditionnaire globale projetable mondialement, posture de frappe de représailles et protection du territoire national contre les attaques terroristes de masse.',
    keyConcepts: [
      'Doctrine MOPP (Mission Oriented Protective Posture) standardisée pour les forces armées.',
      'Stratégie de « layered defense » (détection précoce transfrontalière, interception, décontamination rapide).',
      'Strategic National Stockpile (SNS) : immenses dépôts d’antidotes, antibiotiques et masques répartis sur le sol fédéral capables de livrer n’importe quel État en 12 heures.',
      'Sensibilisation du public via le programme fédéral « Ready.gov ».'
    ],
    civilProtectionModel: 'Modèle fédéral décentralisé coordonné par la FEMA et les autorités locales d’États (National Guard WMD-CST).',
    militaryUnits: [
      '20th CBRNE Command de l’US Army : Commandement opérationnel réunissant spécialistes chimiques, biologiques, nucléaires et artificiers (EOD).',
      'WMD-CST (Weapons of Mass Destruction Civil Support Teams) : 57 équipes permanentes de la Garde Nationale déployables en 4 heures dans chaque État américain.',
      'USAMRIID (Fort Detrick) : Institut militaire de recherche médicale sur les maladies infectieuses.'
    ],
    historicalEvolution: 'Passage d’une posture de guerre symétrique contre l’URSS à une lutte tous azimuts contre la prolifération et le terrorisme asymétrique après 2001.',
    strengthsAndLimitations: {
      strengths: [
        'Budget de recherche et développement le plus colossal de la planète (détecteurs quantiques, biosenseurs autonomes).',
        'Capacité logistique de déploiement d’antidotes du SNS.',
        'Forces de frappe scientifique civile et militaire intégrées.'
      ],
      limitations: [
        'Territoire gigantesque rendant complexe la couverture équitable des populations rurales.',
        'Absence d’abris civils collectifs systématiques pour les citoyens ordinaires.'
      ]
    }
  },
  {
    id: 'russie',
    country: 'Russie / Ex-URSS',
    flag: '🇷🇺',
    doctrineName: 'Troupes RKhBZ (Protection Radiologique, Chimique & Biologique)',
    organization: 'Ministère de la Défense (Troupes RKhBZ), Ministère des Situations d’Urgence (EMERCOM / MChS)',
    posture: 'Sanctuarisation lourde, moyens mécanisés industriels massifs de décontamination et intégration tactique permanente du combat en ambiance contaminée.',
    keyConcepts: [
      'Arme à part entière : les troupes RKhBZ sont une branche militaire autonome dotée de blindés lourds spécifiques et de lance-flammes lourds (TOS-1A).',
      'Décontamination thermique cinétique massive : utilisation de turboréacteurs d’avions montés sur camions (TMS-65) pour vaporiser des solutions décontaminantes sur des colonnes entières de blindés.',
      'Réseau d’abris profonds métropolitains : les métros de Moscou, Saint-Pétersbourg et Kiev ont été conçus dès l’origine comme d’immenses abris antiatomiques hermétiques dotés de portes blindées étanches de plusieurs tonnes.',
      'Distribution historique de kits individuels d’antidotes de combat (trousses AI-2 puis AI-4 avec taren et oximes).'
    ],
    civilProtectionModel: 'Modèle très centralisé et militarisé sous l’égide d’EMERCOM (MChS), disposant de ses propres régiments de sauveteurs, hélicoptères et centres de commandement de crise souterrains.',
    militaryUnits: [
      'Troupes RKhBZ des Forces armées russes (présentes dans chaque armée interarmes).',
      '27e Brigade scientifique RKhBZ (Koursk).',
      'Centres de recherche virologique militaires (Kirov, Serguiev Possad).'
    ],
    historicalEvolution: 'Héritière directe de la doctrine soviétique de la Troisième Guerre Mondiale, où des divisions entières étaient entraînées à traverser des zones irradiées en Europe centrale sous protection de blindés pressurisés (série BMP et BTR).',
    strengthsAndLimitations: {
      strengths: [
        'Moyens mécanisés lourds sans équivalent (véhicules de décontamination thermique, engins de reconnaissance RKhM).',
        'Infrastructures souterraines métropolitaines extrêmement résilientes.'
      ],
      limitations: [
        'Opacité persistante sur l’héritage des arsenaux chimiques et biologiques (programmes passés Novitchok et Biopreparat).',
        'Équipements individuels parfois vieillissants ou de maintenance inégale.'
      ]
    }
  },
  {
    id: 'israel',
    country: 'Israël',
    flag: '🇮🇱',
    doctrineName: 'Défense Passive Totale & Espaces Protégés Résidentiels (Mamad)',
    organization: 'Home Front Command (Pikoud HaOref - Tsahal), Ministère de la Défense, Magen David Adom',
    posture: 'Survie nationale permanente face aux menaces balistiques non conventionnelles aux frontières immédiates.',
    keyConcepts: [
      'Concept de Mamad (abris résidentiels obligatoires) : depuis 1992, chaque appartement ou maison neuf doit obligatoirement comporter une pièce renforcée en béton armé dotée d’une porte et fenêtre étanches aux gaz et d’un système de filtration d’air autonome.',
      'Distribution universelle de kits de masques à gaz civils à chaque citoyen dès la naissance (modèles adultes, masques pédiatriques et tentes étanches pour berceaux de nourrissons Shapan) lors de la guerre du Golfe.',
      'Alerte balistique et toxique ultra-localisée (application Pikoud HaOref, sirènes et diffusion ciblée par quartier en quelques secondes).'
    ],
    civilProtectionModel: 'Défense passive confiée directement à une armée unifiée (le commandement de l’arrière de Tsahal) travaillant main dans la main avec les municipalités et les hôpitaux fortifiés en sous-sol.',
    militaryUnits: [
      'Pikoud HaOref (Commandement du Front Intérieur de Tsahal).',
      'Bataillons mixtes de sauvetage et d’intervention NRBC (Shahar, Kedem, Tavor).',
      'Laboratoire de recherche biologique d’IiPhone/Ness Ziona.'
    ],
    historicalEvolution: 'Bouleversée par la guerre du Golfe de 1991, où 39 missiles Scud irakiens ont frappé Tel Aviv sous la menace permanente de têtes chimiques, entraînant le confinement de tout le pays masques au visage.',
    strengthsAndLimitations: {
      strengths: [
        'Culture de préparation et de réflexe civique la plus élevée au monde.',
        'Hôpitaux souterrains capables de continuer les chirurgies en ambiance toxique.',
        'Système d’alerte en temps réel le plus réactif du globe.'
      ],
      limitations: [
        'Stress psychologique permanent pesant sur les populations civiles.',
        'Dépendance à la maintenance des filtres résidentiels privés.'
      ]
    }
  }
];

// --------------------------------------------------------------------------
// 4. OUTILS ET TECHNOLOGIES POUR COMBATTRE LE RISQUE NRBC
// --------------------------------------------------------------------------
export const NRBC_TOOL_CATEGORIES: NrbcToolCategory[] = [
  {
    id: 'detection',
    name: '1. Détection, Mesure & Identification Rapide',
    icon: 'radar',
    color: 'text-brand-ink',
    description: 'Les agents NRBC étant pour la plupart invisibles, inodores et impalpables, la détection précoce est la première ligne de survie pour alerter et qualifier la menace.',
    tools: [
      {
        name: 'Compteurs Geiger-Müller & Radiamètres',
        category: 'Radiologique / Nucléaire',
        principle: 'Un tube métallique rempli d’un gaz noble sous basse pression est soumis à une haute tension. Chaque particule ionisante (alpha, bêta, gamma) traverse la fenêtre et ionise le gaz, créant une décharge électrique mesurable (bips sonores et affichage du débit de dose en µSv/h).',
        history: 'Inventé par Hans Geiger en 1908 et perfectionné par Walther Müller en 1928. Il reste l’instrument de détection primaire le plus robuste du monde.',
        limits: 'Ne permet pas d’identifier quel radioélément précis est présent (nécessite une spectrométrie gamma complémentaire pour distinguer l’Iode-131 du Césium-137).',
        civilianEquivalent: 'Radiamètres personnels numériques compacts (ex: Radex, GQ GMC, dosimètres électroniques d’intervention).'
      },
      {
        name: 'Spectromètres de Mobilité Ionique (IMS)',
        category: 'Chimique',
        principle: 'L’air ambiant est aspiré et ionisé. Les ions formés sont propulsés par un champ électrique dans un tube de dérive face à un contre-courant gazeux. Leur vitesse d’arrivée dépend strictement de leur masse, taille et géométrie moléculaire, permettant d’identifier l’empreinte exacte du toxique.',
        history: 'Développés massivement dans les années 1970-1980 pour l’armée américaine (CAM - Chemical Agent Monitor, puis AP4C ou LCD3).',
        limits: 'Risque de faux positifs en présence de vapeurs de solvants, de fumées d’incendie ou de produits de nettoyage à base d’ammoniac.',
        civilianEquivalent: 'Appareils de détection utilisés dans les aéroports pour le contrôle des bagages et par les cellules de pompiers CMIC.'
      },
      {
        name: 'Tubes Colorimétriques Réactifs (Système Dräger)',
        category: 'Chimique / Industriel',
        principle: 'Un volume d’air calibré est pompé manuellement à travers une ampoule de verre scellée contenant un réactif chimique spécifique immobilisé sur un gel de silice. La présence du gaz cible provoque un virage colorimétrique dont la longueur de la zone colorée indique la concentration en ppm (parties par million).',
        history: 'Inventés par Heinrich Dräger en Allemagne dans les années 1930 pour les sauveteurs des mines de charbon.',
        limits: 'Usage unique, lecture manuelle sensible aux erreurs d’interprétation visuelle, délai de pompage (quelques dizaines de secondes).',
        civilianEquivalent: 'Tubes réactifs Dräger ou Gastec largement utilisés dans l’industrie chimique et la sécurité au travail.'
      },
      {
        name: 'PCR Mobile & Bandelettes Immunologiques (LFD)',
        category: 'Biologique',
        principle: 'Les bandelettes utilisent des anticorps spécifiques conjugués à des nanoparticules d’or pour capturer une toxine (ricine, toxine botulique) et faire apparaître une ligne colorée (principe identique aux autotests Covid). La PCR mobile (Polymerase Chain Reaction) amplifie l’ADN/ARN bactérien ou viral en moins de 45 minutes.',
        history: 'Essor spectaculaire après les attaques à l’anthrax de 2001 (systèmes BioFire FilmArray, RAZOR EX).',
        limits: 'Les bandelettes nécessitent une concentration minimale de toxine pour réagir ; la PCR exige des réactifs conservés au frais et des opérateurs entraînés.',
        civilianEquivalent: 'Tests rapides d’orientation diagnostique (TROD) hospitaliers.'
      }
    ]
  },
  {
    id: 'protection',
    name: '2. Protection Individuelle & Collective (EPI & Abris)',
    icon: 'masks',
    color: 'text-danger-ink',
    description: 'Empêcher le toxique ou les retombées d’entrer en contact avec l’organisme (voies respiratoires, conjonctives, peau intacte ou lésée).',
    tools: [
      {
        name: 'Masques Panoramiques à Cartouche ABEK2P3',
        category: 'Chimique / Biologique / Radiologique',
        principle: 'Pièce faciale en élastomère de synthèse ou silicone hypoallergénique épousant hermétiquement le pourtour du visage (étanchéité assurée par dépression inspiratoire). L’air entrant traverse un filtre combiné associant charbon actif imprégné (neutralisation chimique par chimisorption) et papier plissé en microfibres de verre P3 (arrêt mécanique des aérosols et spores).',
        history: 'Évolution directe des masques M2 de 1915 et du modèle S6 britannique de la Guerre Froide vers les standards contemporains de l’OTAN (masque français ARFA / S10 / Avon M50).',
        limits: 'Inutilisable en atmosphère pauvre en oxygène (< 19,5 % O₂) ou face à des gaz non adsorbables comme le monoxyde de carbone (CO).',
        civilianEquivalent: 'Masques complets civils normés EN 136 classe 3 avec raccord standardisé universel OTAN RD40 (filetage 40 mm).'
      },
      {
        name: 'Tenues Étanches Scaphandres Type 1 (Scaphandre NRBC)',
        category: 'Chimique / Gazeux lourd',
        principle: 'Combinaison monobloc totalement étanche aux gaz et liquides constituée d’élastomères fluorés multicouches (Viton, Butyle, Teflon). L’appareil respiratoire isolant (ARI) à bouteille d’air comprimé est porté sous la combinaison, maintenant une surpression interne : en cas de micro-déchirure, l’air sort vers l’extérieur mais le toxique ne peut pénétrer.',
        history: 'Développées pour la maintenance des silos de missiles et les accidents pétrochimiques majeurs dès les années 1960.',
        limits: 'Poids élevé (15 à 20 kg), autonomie en air limitée à 20-30 minutes, stress thermique aigu (intervenant trempé de sueur en quelques minutes).',
        civilianEquivalent: 'Scaphandres d’intervention chimique des CMIC et des raffineries Seveso.'
      },
      {
        name: 'Abris Pressurisés & Systèmes de Ventilation Filtrée',
        category: 'Protection Collective',
        principle: 'Local clos en béton armé maintenu en surpression permanente (+50 à +100 Pascals par rapport à l’extérieur) au moyen d’une centrale de ventilation motorisée (avec manivelle manuelle de secours). L’air extérieur est forcé à travers une batterie de filtres lourds au charbon actif minéral. La surpression garantit qu’aucune fuite d’air non filtré ne pénètre par les interstices des portes étanches blindées.',
        history: 'Standardisé par la Suisse dès 1963 (normes de protection civile TWP) et adopté dans les bunkers militaires gouvernementaux mondiaux.',
        limits: 'Coût de construction lourd, nécessite le renouvellement régulier des filtres et un sas d’entrée hermétique étagé pour éviter de contaminer l’abri lors d’une entrée tardive.',
        civilianEquivalent: 'Abris de protection civile suisses, abris Mamad israéliens, pièces de confinement calfeutrées en France.'
      }
    ]
  },
  {
    id: 'decontamination',
    name: '3. Décontamination & Neutralisation',
    icon: 'sanitizer',
    color: 'text-ok-ink',
    description: 'Éliminer, désactiver ou neutraliser chimiquement les agents toxiques déposés sur le personnel, le matériel ou l’environnement.',
    tools: [
      {
        name: 'Déshabillage Méthodique & Décontamination Sèche Civile',
        category: 'Universel NRBC',
        principle: 'Retrait méthodique des vêtements de haut en bas sans les passer par-dessus la tête et sans les secouer. Cette action simple et universelle élimine à elle seule 80 à 90 % de la charge toxique ou radioactive déposée sur un individu en évitant la ré-aérosolisation.',
        history: 'Enseigné initialement aux équipages de sous-marins et personnels de santé lors des épidémies hautement contagieuses.',
        limits: 'Ne traite pas les toxiques ayant déjà traversé les vêtements ou déposés sur la peau exposée (mains, visage, cou).',
        civilianEquivalent: 'Protocole de déshabillage d’urgence 8 étapes documenté dans l’application NRBCOR.'
      },
      {
        name: 'Terre de Foulon & Gants Poudreurs Décontaminants',
        category: 'Chimique',
        principle: 'Argile naturelle smectique activée ultrafine possédant une capacité d’adsorption exceptionnelle. Appliquée par tamponnement à l’aide d’un gant poudreur, elle absorbe immédiatement les gouttelettes liquides de neurotoxiques (Sarin, VX, Ypérite) avant qu’elles ne traversent l’épiderme.',
        history: 'Utilisée dès la Première Guerre mondiale et standardisée dans les armées de l’OTAN (gant poudreur français modèle F1, kit américain M291/M295).',
        limits: 'Action purement physique (adsorption) : elle ne détruit pas le toxique mais le piège. La poudre souillée reste toxique et doit être incinérée.',
        civilianEquivalent: 'Farine, talc ou terre argileuse sèche en pis-aller civil de fortune.'
      },
      {
        name: 'Solutions Alcalines & Eau de Javel Diluée (Décontamination Humide)',
        category: 'Biologique / Chimique',
        principle: 'L’hypochlorite de sodium dilué (0,5 % de chlore actif) ou les formulations d’ammoniums quaternaires détruisent l’enveloppe protéique des virus et bactéries et hydrolysent les liaisons chimiques des neurotoxiques. Sur la peau, le lavage doit se faire exclusivement à l’eau tiède et au savon doux ordinaire pour préserver la barrière cornée.',
        history: 'Protocole hospitalier universel institué au XIXe siècle par Semmelweis et Lister, adapté aux doctrines CMIC des pompiers.',
        limits: 'Ne jamais utiliser d’eau de javel pure sur la peau humaine (brûlure caustique sévère et vasodilatation favorisant la pénétration des toxiques).',
        civilianEquivalent: 'Douche tiède savonneuse sans frotter et solutions chlorées pour le matériel inerte.'
      }
    ]
  },
  {
    id: 'antidotes',
    name: '4. Contre-Mesures Médicales & Antidotes Spécifiques',
    icon: 'medication',
    color: 'text-brand-ink',
    description: 'Traitements pharmacologiques d’urgence administrés pour contrer les effets toxiques intracellulaires ou accélérer l’élimination des radionucléides.',
    tools: [
      {
        name: 'Auto-Injecteurs Atropine + Pralidoxime (Seringues Bi-Compartiments)',
        category: 'Chimique (Neurotoxiques)',
        principle: 'L’atropine bloque les récepteurs muscariniques hyperstimulés par l’excès d’acétylcholine (lève le spasme bronchique et ralentit la mort par asphyxie). La pralidoxime (oxime) arrache le groupe organophosphoré de l’acétylcholinestérase, réactivant l’enzyme vitale si elle est administrée avant le phénomène de « vieillissement » de la liaison chimique.',
        history: 'Développés pendant la Guerre Froide pour chaque fantassin (auto-injecteurs ATNAA américain ou AIBC français de la Pharmacie Centrale des Armées).',
        limits: 'Doit être injecté dans les premières minutes suivant les symptômes (cuisse ou fesse à travers l’uniforme). Inefficace contre l’ypérite ou les toxines.',
        civilianEquivalent: 'Dotation des SMUR et trousses de secours des sapeurs-pompiers d’astreinte NRBC.'
      },
      {
        name: 'Comprimés d’Iodure de Potassium (KI 65 mg)',
        category: 'Nucléaire',
        principle: 'Saturation physique immédiate de la glande thyroïde par de l’iode stable 127 non radioactif. Les pompes à iodure thyroïdiennes saturées rejettent tout l’iode-131 radioactif inhalé qui est éliminé par les urines sans irradier l’organe.',
        history: 'Généralisé mondialement après le retour d’expérience tragique des cancers pédiatriques de Tchernobyl en 1986.',
        limits: 'Efficace UNIQUEMENT contre l’iode radioactif d’un réacteur de centrale. Totalement inutile contre une bombe sale radiologique ou les retombées de césium.',
        civilianEquivalent: 'Boîtes de comprimés distribuées en pharmacie dans les zones PPI.'
      },
      {
        name: 'Chélateurs : Bleu de Prusse & DTPA',
        category: 'Radiologique',
        principle: 'Le Bleu de Prusse (Radiogardase) est un pigment insoluble qui fixe le Césium-137 et le Thallium dans l’intestin en échangeant des ions potassium, empêchant leur réabsorption entero-hépatique. Le Ca-DTPA ou Zn-DTPA est un agent chélateur qui emprisonne les atomes de Plutonium, d’Américium et de Curium dans une cage chimique pour les évacuer par les reins.',
        history: 'Utilisés avec succès lors de l’accident radiologique majeur de Goiânia au Brésil en 1987 (dispersion de Césium-137 d’une machine de radiothérapie abandonnée).',
        limits: 'Administration intraveineuse ou orale hospitalière spécialisée nécessitant un suivi de la fonction rénale et électrolytique.',
        civilianEquivalent: 'Stocks nationaux de réserve sanitaire gérés par Santé Publique France.'
      }
    ]
  }
];
