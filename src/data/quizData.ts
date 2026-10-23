export interface QuizQuestion {
  id: string;
  scenarioNumber: string;
  scenarioType: string;
  badge: string;
  title: string;
  context: string;
  question: string;
  source: string;
  options: {
    letter: 'A' | 'B' | 'C' | 'D';
    text: string;
    isCorrect: boolean;
    tag: string;
    tagColor: string;
    explanation: string;
  }[];
}

export const IMMERSION_SCENARIOS: QuizQuestion[] = [
  {
    id: 'q-chimique-03',
    scenarioNumber: 'N°03 • CHIMIQUE',
    scenarioType: "Situation d'immersion",
    badge: "Signal National d'Alerte Actif",
    title: 'Panache toxique à 800 mètres et sirène montante',
    context: '« Vous entendez le signal de sirène (1 min 41s à 3 reprises) et un panache blanc épais est visible à proximité. Vos deux enfants sont en cours à l\'école élémentaire du secteur. »',
    question: 'Quelle est la conduite immédiate obligatoire conforme aux consignes de sécurité civile ?',
    source: 'Min. Intérieur & Protocole CMIC',
    options: [
      {
        letter: 'A',
        text: 'Prendre la voiture pour récupérer les enfants à l\'école',
        isCorrect: false,
        tag: 'À PROSCRIRE ABSOLUMENT',
        tagColor: 'text-error',
        explanation: 'Encombre les voies pour les convois de secours. Les écoles appliquent le Plan Particulier de Mise en Sûreté (PPMS) et sont hermétiquement calfeutrées. Vos enfants y sont en sécurité.'
      },
      {
        letter: 'B',
        text: 'Entrer dans un bâtiment en dur, calfeutrer et écouter France Bleu',
        isCorrect: true,
        tag: 'RÉFLEXE VITAL VALIDÉ',
        tagColor: 'text-on-tertiary-container',
        explanation: 'Mise à l\'abri immédiate dans le local le plus étanche. Coupez impérativement la VMC et climatisation, scellez les aérations avec ruban large et laissez la radio allumée pour les directives.'
      },
      {
        letter: 'C',
        text: 'Prendre un comprimé d\'iode de potassium et attendre en extérieur',
        isCorrect: false,
        tag: 'INUTILE & CONTRE-PRODUCTIF',
        tagColor: 'text-on-surface',
        explanation: 'L\'iode protège exclusivement la thyroïde contre l\'iode radioactif (131) et n\'a aucun effet face aux toxiques chimiques. Elle ne doit être ingérée que sur ordre formel du Préfet.'
      }
    ]
  },
  {
    id: 'q-nucleaire-01',
    scenarioNumber: 'N°01 • NUCLÉAIRE',
    scenarioType: "Alerte Rejets Radioactifs",
    badge: 'Notification FR-Alert Reçue',
    title: 'Rejets atmosphériques d\'une centrale à 15 km',
    context: '« Le préfet déclenche le PPI de la centrale. Une notification FR-Alert ordonne le confinement et annonce la mise à disposition de comprimés d\'iode pour les personnes exposées sous le vent. »',
    question: 'À quel moment précis devez-vous ingérer les comprimés d\'iode stable ?',
    source: 'ASNR / IRSN • Doctrine Nationale',
    options: [
      {
        letter: 'A',
        text: 'Immédiatement par précaution dès le déclenchement de l\'alerte',
        isCorrect: false,
        tag: 'ERREUR GRAVE',
        tagColor: 'text-error',
        explanation: 'Une prise trop précoce (plus de 24h avant le panache) ou inutile sature prématurément la thyroïde sans efficacité durable et peut provoquer des effets secondaires.'
      },
      {
        letter: 'B',
        text: 'Strictement sur ordre explicite du Préfet diffusé par les médias officiels',
        isCorrect: true,
        tag: 'CONDUITE CONFORME',
        tagColor: 'text-on-tertiary-container',
        explanation: 'L\'efficacité optimale de l\'iode stable se situe entre 2 heures avant et le moment précis du passage du nuage radioactif. Seule l\'autorité préfectorale possède la modélisation météo pour donner l\'ordre.'
      },
      {
        letter: 'C',
        text: 'Uniquement après avoir été secouru par les équipes médicales à domicile',
        isCorrect: false,
        tag: 'TARDIF',
        tagColor: 'text-on-surface',
        explanation: 'L\'ingestion post-exposition (>12h) perd plus de 90% de son pouvoir protecteur face à l\'iode radioactif inhalé.'
      }
    ]
  },
  {
    id: 'q-biologique-02',
    scenarioNumber: 'N°02 • BIOLOGIQUE',
    scenarioType: "Alerte Épidémique Majeure",
    badge: 'Plan BIOTOX Activé',
    title: 'Suspicion d\'agent pathogène aéroporté hautement contagieux',
    context: '« Une détection d\'agent biologique respiratoire est confirmée dans le métro de votre métropole. Les autorités imposent l\'isolement immédiat à domicile. »',
    question: 'Quel équipement barrière respiratoire est indispensable pour bloquer les aérosols infectieux ?',
    source: 'Santé Publique France & SGDSN',
    options: [
      {
        letter: 'A',
        text: 'Un masque chirurgical standard à plis ou un foulard en coton',
        isCorrect: false,
        tag: 'INSUFFISANT',
        tagColor: 'text-error',
        explanation: 'Les masques chirurgicaux et tissus ne sont pas étanches sur les contours du visage et ne filtrent pas les micro-aérosols biologiques inhalés.'
      },
      {
        letter: 'B',
        text: 'Un masque de protection FFP2 ou FFP3 sans soupape correctement ajusté',
        isCorrect: true,
        tag: 'BARRIÈRE EFFICACE',
        tagColor: 'text-on-tertiary-container',
        explanation: 'Les masques FFP2/FFP3 sans valve garantissent une étanchéité faciale minimale et arrêtent au moins 94% à 99% des micro-particules aéroportées.'
      },
      {
        letter: 'C',
        text: 'Une cartouche filtrante pour vapeurs organiques',
        isCorrect: false,
        tag: 'INADAPTÉ',
        tagColor: 'text-on-surface',
        explanation: 'Les cartouches de gaz sans filtre à particules P3 ne bloquent pas les virus et bactéries.'
      }
    ]
  },
  {
    id: 'q-travail-04',
    scenarioNumber: 'N°04 • LIEU DE TRAVAIL / ENTREPRISE',
    scenarioType: "Alerte Majeure en Milieu Professionnel",
    badge: 'EXERCICE DIDACTIQUE — AUCUNE ALERTE RÉELLE',
    title: 'Une alerte officielle est diffusée pendant que vous êtes au travail',
    context: '« Il est 14h15, vous êtes dans les bureaux ou l\'atelier de votre entreprise. Une alerte de sécurité civile retentit (sirène ou notification d\'urgence). Un incident industriel majeur est signalé dans la zone d\'activités voisine. »',
    question: 'Que faites-vous immédiatement pour préserver votre vie et celle de vos collègues ?',
    source: 'Code du Travail (Art. R4227-28) & INRS / DGSCGC',
    options: [
      {
        letter: 'A',
        text: 'Prendre vos clés de voiture pour rentrer immédiatement chez vous rejoindre vos proches',
        isCorrect: false,
        tag: 'DANGER MORTEL & ENCOMBREMENT',
        tagColor: 'text-error',
        explanation: 'La fuite spontanée en véhicule vous expose directement au panache toxique dans l\'habitacle non étanche, et paralyse les axes prioritaires réservés aux pompiers et au SAMU.'
      },
      {
        letter: 'B',
        text: 'Rester dans les locaux en dur, couper la ventilation (CTA), calfeutrer et appliquer le plan de confinement',
        isCorrect: true,
        tag: 'RÉFLEXE OPÉRATIONNEL VALIDÉ',
        tagColor: 'text-on-tertiary-container',
        explanation: 'Le bâtiment d\'entreprise constitue un abri collectif solide. Coupez impérativement la centrale de traitement d\'air (CTA) et climatisation, calfeutrez les ouvrants et écoutez France Bleu FM sans saturer les lignes.'
      },
      {
        letter: 'C',
        text: 'Passer des appels téléphoniques à chaque membre de votre famille',
        isCorrect: false,
        tag: 'SATURATION DU RÉSEAU',
        tagColor: 'text-error',
        explanation: 'Les communications téléphoniques saturent les antennes relais locales et bloquent les transmissions radio des secours. Utilisez un SMS unique et court vers votre contact hors-zone.'
      },
      {
        letter: 'D',
        text: 'Sortir sur le parking pour inspecter visuellement l\'origine de l\'alerte',
        isCorrect: false,
        tag: 'EXPOSITION DIRECTE',
        tagColor: 'text-error',
        explanation: 'Sortir à découvert vous expose instantanément aux retombées toxiques inodores ou invisibles et aux effets de souffle éventuels.'
      }
    ]
  }
];

export const MAIN_EXERCISE = IMMERSION_SCENARIOS[0];

export interface DetailedQuiz {
  id: string;
  title: string;
  authority: string;
  description: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export const QUIZ_IRRADIATION_CONTAMINATION: DetailedQuiz = {
  id: 'quiz-rad',
  title: 'Quiz : Distinguer Irradiation et Contamination',
  authority: 'Doctrines ASNR / IRSN',
  description: '5 questions pour vérifier votre compréhension entre exposition à distance et dépôt physique de matière radioactive.',
  questions: [
    {
      question: "Une personne ayant subi une irradiation par une source gamma externe devient-elle radioactive ?",
      options: [
        "Oui, elle émet des rayons dangereux pour ses proches",
        "Non, une personne irradiée ne devient pas radioactive (similaire à une radiographie médicale)",
        "Oui, mais uniquement pendant les premières 24 heures",
        "Oui, ses vêtements doivent être brûlés à l'extérieur"
      ],
      correctIndex: 1,
      explanation: "L'irradiation est une exposition à des ondes électromagnétiques traversantes. Dès que l'on s'éloigne de la source, l'exposition cesse et le corps ne garde aucune radioactivité résiduelle."
    },
    {
      question: "Quelle est la définition exacte de la contamination radioactive ?",
      options: [
        "La simple présence dans une zone sous le vent d'une centrale sans contact",
        "Le dépôt effectif de poussières ou liquides radioactifs sur la peau/vêtements ou leur absorption interne",
        "La sensation de chaleur cutanée provoquée par le rayonnement",
        "La coloration anormale de l'air ambiant"
      ],
      correctIndex: 1,
      explanation: "La contamination implique une présence physique de particules radioactives (Césium, Iode, Strontium) sur le corps, les habits, ou ingérées/inhalées."
    },
    {
      question: "Quels sont les 3 facteurs fondamentaux pour réduire une irradiation externe ?",
      options: [
        "Temps d'exposition, Distance à la source, Écran (matière protectrice)",
        "Masque en tissu, Prise d'antibiotiques, Ventilation",
        "Douche chaude avec savon abrasif, Eau de javel, Aspiration",
        "Courir vite, Baisser la tête, Fermer les yeux"
      ],
      correctIndex: 0,
      explanation: "La triade de la radioprotection : minimiser le TEMPS, maximiser la DISTANCE, et s'interposer derrière un ÉCRAN dense (murs de béton, plomb, terre)."
    },
    {
      question: "En cas de contamination externe sur les vêtements, quelle action élimine immédiatement jusqu'à 90% des particules ?",
      options: [
        "Brosser énergiquement les vêtements au grand air",
        "Retirer délicatement les vêtements extérieurs par retournement sans les secouer et les ensacher",
        "Les asperger d'alcool ménager",
        "Les passer au fer à repasser chaud"
      ],
      correctIndex: 1,
      explanation: "Le déshabillage méticuleux du haut vers le bas sans secouer retire la très grande majorité du dépôt avant qu'il ne migre vers la peau ou les voies respiratoires."
    },
    {
      question: "L'iode stable protège-t-elle contre l'irradiation globale ou les autres radioéléments comme le Césium ?",
      options: [
        "Oui, elle bloque tous les rayonnements ionisants",
        "Non, elle sature uniquement la thyroïde pour empêcher la fixation exclusive de l'Iode 131",
        "Oui, mais à condition de doubler la posologie",
        "Uniquement si elle est mélangée à du vinaigre blanc"
      ],
      correctIndex: 1,
      explanation: "L'iode stable (iodure de potassium) n'a qu'une seule cible : saturer la glande thyroïde pour qu'elle n'absorbe pas l'iode 131 radioactif. Elle est sans effet contre le Césium, le Cobalt ou les rayonnements gamma directs."
    }
  ]
};

export const QUIZ_DECONTAMINATION: DetailedQuiz = {
  id: 'quiz-decon',
  title: 'Décontamination d\'Urgence : Les 4 Gestes Sous Stress',
  authority: 'Hygiène d\'extrême urgence • Sécurité Civile',
  description: '4 questions pratiques sur la conduite à tenir en zone tampon pour stopper la pénétration cutanée des toxiques.',
  questions: [
    {
      question: "Pourquoi est-il formellement interdit de frotter énergiquement la peau lors du rinçage ?",
      options: [
        "Pour ne pas user le savon",
        "Parce que le frottement dilate les pores et fait pénétrer les agents toxiques à travers la barrière cutanée",
        "Parce que l'eau chaude s'évapore plus vite",
        "Pour éviter de tacher la baignoire"
      ],
      correctIndex: 1,
      explanation: "Frotter avec un gant ou une brosse abrasive crée des micro-lésions et ouvre les pores, favorisant l'absorption systémique rapide des molécules chimiques ou toxines."
    },
    {
      question: "Comment doit être effectuée l'élimination des vêtements souillés ?",
      options: [
        "Les laver immédiatement en machine à 30°C avec le reste du linge",
        "Les enfermer dans un double sac plastique étanche scellé au ruban adhésif",
        "Les jeter par la fenêtre dans la rue",
        "Les étendre sur le balcon au soleil"
      ],
      correctIndex: 1,
      explanation: "Le double ensachage hermétique bloque les vapeurs et évite toute contamination secondaire des pièces de vie et des secours."
    },
    {
      question: "Quelle est la durée minimale recommandée pour le rinçage des yeux ou de la peau exposée à une projection caustique ?",
      options: [
        "30 secondes",
        "2 minutes",
        "15 minutes à l'eau tempérée courante sans pression excessive",
        "1 heure au bain glacé"
      ],
      correctIndex: 2,
      explanation: "15 minutes de rinçage continu à l'eau tiède (15-20°C) sans pression dilue et neutralise les acides/bases sans aggraver les brûlures thermiques."
    },
    {
      question: "En arrivant de l'extérieur en zone d'isolement, où doit être aménagé le déshabillage ?",
      options: [
        "Dans la chambre à coucher principale",
        "Dans un sas d'entrée ou pièce tampon isolée avant de rejoindre la zone de confinement propre",
        "Dans la cuisine près des denrées alimentaires",
        "Dans le salon pour être assis confortablement"
      ],
      correctIndex: 1,
      explanation: "Le sas d'entrée ou la salle d'eau fait office de zone tampon pour préserver l'étanchéité et la pureté de l'air de la pièce de confinement refuge."
    }
  ]
};

export interface AdditionalModule {
  id: string;
  badge: string;
  badgeColor: string;
  duration?: string;
  authority: string;
  title: string;
  description: string;
  checklist?: string[];
  keyDirective?: string;
  status: 'valide' | 'a-faire' | 'pratique';
  score?: string;
  actionText: string;
}

export const ADDITIONAL_MODULES: AdditionalModule[] = [
  {
    id: 'm-confinement-drill',
    badge: 'Simulation à Domicile',
    badgeColor: 'bg-secondary-fixed text-on-secondary-fixed-variant',
    duration: '15 min',
    authority: 'Sécurité Civile Foyer',
    title: 'Exercice Annuel de Confinement Foyer',
    description: 'Test chronométré en conditions réelles avec tous les occupants du domicile.',
    checklist: [
      'Repérage coupure rapide VMC et tableau électrique',
      'Inspection des joints de la pièce-refuge & ruban adhésif',
      'Localisation immédiate du sac d\'urgence 72 heures'
    ],
    status: 'pratique',
    actionText: 'Lancer le guide pas-à-pas chronométré'
  },
  {
    id: 'm-radio-quiz',
    badge: 'Validé (5/5)',
    badgeColor: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    authority: 'Doctrines ASNR / IRSN',
    title: 'Quiz : Distinguer Irradiation et Contamination',
    description: '5 questions validées. Vous maîtrisez la différence fondamentale entre exposition à distance (source externe) et dépôt de particules radioactives.',
    status: 'valide',
    score: '5/5',
    actionText: 'Revoir les réponses'
  },
  {
    id: 'm-decontamination-quiz',
    badge: 'À Faire • 4 Questions',
    badgeColor: 'bg-error-container text-on-error-container',
    authority: 'Hygiène d\'extrême urgence',
    title: 'Décontamination d\'Urgence : Les 4 Gestes Sous Stress',
    description: 'Procédure immédiate de déshabillage et rinçage corporel d\'urgence sans frottement.',
    keyDirective: 'Déshabillage sans frotter du haut vers le bas (retire 90% du dépôt toxique) et double ensachage 100L hermétique.',
    status: 'a-faire',
    actionText: 'Démarrer le quiz décontamination'
  }
];
