export interface ProtocolData {
  id: 'bio' | 'chimique' | 'nucleaire' | 'confinement' | 'radiologique';
  title: string;
  subtitle: string;
  categoryLabel: string;
  categoryIcon: string;
  reviewDate: string;
  regulatoryBody: string;
  badgeCriticality: string;
  badgeBg: string;
  docId: string;
  imageUrl: string;
  imageAlt: string;
  imageTags: string[];
  imageCaption: string;
  imageSpec: string;
  offlineBannerText: string;
  reflexesTitle: string;
  reflexesPriority: string;
  reflexes: {
    num: number;
    title: string;
    description: string;
  }[];
  phases: {
    avant: { title: string; desc?: string; items?: string[]; tip?: string; tipIcon?: string; tipColor?: string; icon: string }[];
    pendant: { title: string; desc?: string; items?: string[]; tip?: string; tipIcon?: string; tipColor?: string; icon: string }[];
    apres: { title: string; desc?: string; items?: string[]; tip?: string; tipIcon?: string; tipColor?: string; icon: string }[];
  };
  forbiddenActions: {
    title: string;
    description: string;
  }[];
  pedagogy?: {
    title: string;
    subtitle?: string;
    cards: {
      title: string;
      tag: string;
      tagClass: string;
      examples?: string;
      specificity: string;
      icon: string;
    }[];
    table?: {
      title: string;
      authority: string;
      desc: string;
      rows: { label: string; value: string; isHighlighted?: boolean; isWarning?: boolean }[];
      footnote?: string;
    };
    disinfection?: {
      title: string;
      items: { name: string; condition: string }[];
    };
  };
  technicalSection?: {
    title: string;
    badge: string;
    steps: { icon: string; title: string; desc: string }[];
  };
  emergencySymptoms: {
    title: string;
    intro: string;
    symptoms: string[];
    alertNote?: string;
  };
  institutionalClause: {
    title: string;
    text: string;
  };
}

export const PROTOCOLS_DATA: Record<string, ProtocolData> = {
  bio: {
    id: 'bio',
    title: 'Alerte Biologique Majeure & Agents Pathogènes',
    subtitle: 'Mesures de protection immédiate, confinement hermétique et barrières sanitaires.',
    categoryLabel: 'RISQUE B • BIO-PATHOGÈNE',
    categoryIcon: 'coronavirus',
    reviewDate: 'REVUE : 14 OCT. 2026',
    regulatoryBody: 'SGDSN / SPF / DGSCGC • BIOTOX',
    badgeCriticality: 'RISQUE B • BIO-PATHOGÈNE',
    badgeBg: 'bg-error',
    docId: 'DOC-ID: BIO-R02',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtN5Wu8YQzHl8Uad8fKzbCO_A_CKTZS7F-dtxnWnm4EsQe1433IyWpXlW-7gxZqE1fjDORt2uD_bF5SG1C9ik06oEjJFVEKsNXS0e7if83vIHjZKTpxzP0Trt91n_o_rBoA-wwn_lJxFqSHz7XkROiwAOGE9b4RIeNUrk5mfoERKwVdSl3Kq78iLTe9kI-HNbGL_7WZErnE8aonBR8_liWF_aRRQY6xNcMav-xVtltsFp56oF0w1Q',
    imageAlt: "Équipe de sécurité civile en préparation de matériel biologique FFP3 et solutions virucides",
    imageTags: ['PLAN BIOTOX & SANTÉ PUBLIQUE', 'BARRIÈRES PHYSIQUES & ÉPIDÉMIQUES'],
    imageCaption: 'Stock stratégique & Réserve zonale',
    imageSpec: 'EN 149 / FFP3',
    offlineBannerText: 'MODE HORS-LIGNE ACTIF • DONNÉES LOCALES SÉCURISÉES',
    reflexesTitle: '4 RÉFLEXES IMMÉDIATS (0 - 15 MIN)',
    reflexesPriority: 'PRIORITÉ 1',
    reflexes: [
      {
        num: 1,
        title: 'Barrière respiratoire & oculaire stricte',
        description: "Pose immédiate d'un masque FFP3 ou FFP2 ajusté hermétiquement (pince-nez écrasé, contrôle d'étanchéité par inspiration sèche). À défaut, triple couche de tissu humidifié sans friction."
      },
      {
        num: 2,
        title: 'Isolement immédiat sans contact',
        description: "Regagner immédiatement un espace clos sécurisé. Distance physique minimale de 2 mètres. Proscrire tout contact tactile, accolades ou rassemblements. Stopper les VMC non filtrées."
      },
      {
        num: 3,
        title: 'Sas tampon & déshabillage hygiénique',
        description: "Retirer les vêtements extérieurs sans secouer pour éviter la remise en suspension. Lavage appuyé mains et visage au savon pendant 60 secondes (ou solution hydroalcoolique 70%)."
      },
      {
        num: 4,
        title: 'Écoute radio & régulation médicale',
        description: "Suivre les directives officielles (Santé Publique France, Préfecture). Ne pas saturer les hôpitaux spontanément pour préserver les circuits d'urgences et éviter les contaminations croisées."
      }
    ],
    phases: {
      avant: [
        {
          title: 'Kit Barrière Respiratoire & Hygiène',
          icon: 'inventory_2',
          items: [
            'Stock hermétique de masques certifiés FFP2 / FFP3 emballés individuellement (minimum 10 unités/personne).',
            'Boîte de gants nitrile à usage unique sans poudre (tailles adaptées au foyer).',
            'Flacons de solution hydroalcoolique (norme EN 14476 virucide, teneur en alcool ≥ 70%).',
            'Savon ordinaire liquide doux et rouleaux d\'essuie-tout jetable.'
          ]
        },
        {
          title: 'Autonomie de Quarantaine (14 Jours)',
          icon: 'shelves',
          items: [
            'Aliments secs non périssables et conserves sans rupture de chaîne de froid.',
            'Eau minérale encapsulée (2L/jour/personne minimum).',
            'Médicaments de traitement chronique et thermomètre médical digital vérifié.',
            'Sacs poubelles renforcés 100L et ruban adhésif large étanche.'
          ]
        }
      ],
      pendant: [
        {
          title: "Délimitation de la Zone d'Isolement",
          icon: 'meeting_room',
          desc: "Isoler une pièce dédiée (idéalement équipée de sanitaires et d'un point d'eau). Maintenir la porte fermée en permanence. Mettre un linge humide au bas de la porte."
        },
        {
          title: "Gestion du Linge & Déchets Contaminés",
          icon: 'cleaning_services',
          desc: "Tout vêtement porté en extérieur doit être immédiatement enfermé dans un double sac plastique 100L hermétiquement scellé au ruban adhésif. Ne pas brasser ni secouer."
        },
        {
          title: "Aération & Flux d'Air Domestiques",
          icon: 'air',
          desc: "Couper les systèmes de ventilation mécanique partagée (VMC collective) en cas d'aérosolisation extérieure. Si transmission strictement interhumaine, aération brève (10 min) de la pièce vide autorisée selon consignes préfectorales."
        }
      ],
      apres: [
        {
          title: 'Auto-surveillance Médicale Biquotidienne',
          icon: 'thermostat',
          desc: "Relever la température corporelle matin et soir pour chaque membre du foyer. Noter l'apparition éventuelle de signes précurseurs : toux, céphalées aiguës, éruptions cutanées, sueurs ou gêne respiratoire."
        },
        {
          title: 'Protocole de Levée de Doute ou Déclaration',
          icon: 'call_log',
          desc: "Ne vous déplacez jamais en cabinet médical ou laboratoire sans accord express. Utilisez en priorité la téléconsultation ou contactez le numéro vert dédié de crise pour planifier un prélèvement sécurisé à domicile."
        }
      ]
    },
    forbiddenActions: [
      {
        title: "Ne JAMAIS aller chercher les enfants à l'école",
        description: "Les écoles appliquent le protocole PPMS d'isolement étanche. Se rendre sur place brise la bulle sanitaire, expose inutilement votre famille et désorganise les secours."
      },
      {
        title: "Ne JAMAIS se présenter spontanément aux urgences",
        description: "Risque létal de contaminer les équipes soignantes et les autres patients vulnérables en salle d'attente. Composer impérativement le 15 ou le numéro de régulation."
      },
      {
        title: "Ne JAMAIS secouer les vêtements ou balayer",
        description: "Le balayage ou le secouage remet en suspension aéroportée les agents bactériens (ex. spores de charbon/anthrax) et gouttelettes virales. Utiliser uniquement le lavage humide."
      },
      {
        title: "Ne JAMAIS s’automédiquer (antibiotiques / antiviraux)",
        description: "Les antibiotiques sont strictement inefficaces contre les virus. L'automédication engendre des résistances critiques et masque des symptômes vitaux sans diagnostic biologique ciblé."
      },
      {
        title: "Ne JAMAIS consommer d'iode de potassium",
        description: "L'iode stable ne protège que la thyroïde contre l'iode radioactif (Risque RN). Il ne possède strictement aucun effet contre les bactéries, virus ou toxines biologiques."
      }
    ],
    pedagogy: {
      title: 'Typologie des Menaces Biologiques',
      cards: [
        {
          title: 'Agents Vivants (Bactéries & Virus)',
          tag: 'CONTAGIEUX',
          tagClass: 'bg-secondary-fixed text-on-secondary-fixed',
          examples: 'Peste pulmonaire, Variole, Fièvres hémorragiques, Grippe aviaire hautement pathogène (IAHP).',
          specificity: "Temps d'incubation silencieux (quelques heures à plusieurs jours). Risque d'amplification épidémique interhumaine exponentielle. Nécessite une étanchéité respiratoire FFP3 et une stricte quarantaine.",
          icon: 'coronavirus'
        },
        {
          title: 'Toxines d\'Origine Biologique',
          tag: 'NON REPRODUCTIBLE',
          tagClass: 'bg-surface-container-high text-primary',
          examples: 'Ricine (extraite de graines de ricin), Toxine botulique (Clostridium botulinum), Entérotoxine staphylococcique.',
          specificity: "Molécules létales synthétisées par le vivant sans dissémination secondaire directe de personne à personne. Danger par inhalation d’aérosol ou ingestion d'aliments ciblés.",
          icon: 'skull'
        }
      ],
      disinfection: {
        title: 'Désinfection Domestique Agréée',
        items: [
          { name: 'Eau de Javel diluée (chlore actif 0,5%)', condition: 'Contact 15 min' },
          { name: 'Alcool ménager ou éthanol 70%', condition: 'Surfaces lisses' },
          { name: 'Lavage textile en machine ≥ 60°C', condition: 'Cycle ≥ 30 min' }
        ]
      }
    },
    emergencySymptoms: {
      title: "Signes d'Urgence Absolue",
      intro: "Appelez immédiatement les secours régulés uniquement en présence de signes vitaux critiques :",
      symptoms: [
        'Détresse respiratoire',
        'Lèvres/doigts bleutés',
        'Perte de conscience',
        'Choc ou pâleur extrême'
      ]
    },
    institutionalClause: {
      title: 'Clause Institutionnelle de Primauté (SGDSN / SPF / DGSCGC)',
      text: "Cette fiche réflexe compile les doctrines standardisées du Secrétariat Général de la Défense et de la Sécurité Nationale (SGDSN - Plan BIOTOX), de Santé Publique France et de la Direction Générale de la Sécurité Civile (DGSCGC). En situation d'alerte sanitaire ou de menace biologique avérée, les consignes diffusées en temps réel par le Préfet de département et le Ministère de la Santé priment rigoureusement sur toute information préétablie."
    }
  },

  confinement: {
    id: 'confinement',
    title: "Confinement d'Urgence & Rupture des Réseaux",
    subtitle: "Protocole d'isolement hermétique immédiat, sécurisation du bâti et autonomie domestique sans flux extérieur.",
    categoryLabel: "CONFINEMENT GÉNÉRALISÉ • ISOLEMENT HERMÉTIQUE",
    categoryIcon: 'shelves',
    reviewDate: 'REVUE : 14 OCT. 2026',
    regulatoryBody: "DGSCGC • MINISTÈRE DE L'INTÉRIEUR",
    badgeCriticality: "CONFINEMENT GÉNÉRALISÉ",
    badgeBg: 'bg-error',
    docId: 'DOC-ID: REFLEX-G04',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8-fbXa5j8RjrAPalU7LTp7uULclxn6f6gakkSnjfM53D-yPwlIFWlNaoXAEMcoXh9AD9gymveLRm9yFlBih6JTWXgJFIO5ZPVGiSs4QAli2BuUhmSsZXcQZCBnkoDykyu1teGeavbWS0qAr7dD8rpkMWYdrJyyaumwz8E1lXjQBL36BVLYkY29xRklz07nXolKHhf785uD4SmgJ7Vgni5_dZGR0NsE7mJkwlF_Vet0Ck8ZrWU-IU',
    imageAlt: "Calfeutrement domestique d'urgence & autonomie hermétique",
    imageTags: ['CONFINEMENT CITOYEN', 'BÂTIMENT HERMÉTIQUE'],
    imageCaption: "Calfeutrement domestique d'urgence & autonomie hermétique",
    imageSpec: 'DOC-ID: REFLEX-G04',
    offlineBannerText: 'MODE HORS-LIGNE ACTIF • LOCAL 100% SÉCURISÉ',
    reflexesTitle: '4 RÉFLEXES IMMÉDIATS',
    reflexesPriority: '0 - 15 MIN • P1',
    reflexes: [
      {
        num: 1,
        title: 'Regagner immédiatement un local clos central',
        description: "Choisir une pièce sans fenêtre ou avec le minimum d'ouvertures, idéalement à l'étage intermédiaire ou pièce aveugle (salle d'eau)."
      },
      {
        num: 2,
        title: "Coupure générale des flux d'air & énergie",
        description: "Arrêter immédiatement VMC, climatisations, bouches d'aération, chaudières, cheminées (fermer trappe) et couper les arrivées de gaz si recommandé."
      },
      {
        num: 3,
        title: "Scellement hermétique d'urgence",
        description: "Poser ruban adhésif armé et bâches polyéthylène ou sacs étanches sur toutes les fentes, calfeutrer les bas de portes avec des linges humides."
      },
      {
        num: 4,
        title: "Allumer la radio d'urgence (FM / France Bleu)",
        description: "Garder le récepteur à piles ou à manivelle allumé. Ne pas téléphoner afin de libérer les réseaux pour les secours (SMS uniquement)."
      }
    ],
    phases: {
      avant: [
        {
          title: 'Vérification du Kit de Confinement 72h',
          icon: 'inventory_2',
          desc: "Rapprocher dans la pièce de repli l'ensemble des packs d'eau minérale, trousse de secours NRBC, rouleaux de ruban renforcé gris, radio à manivelle et aliments secs non périssables."
        },
        {
          title: 'Préparation des Ouvertures et Condamnations',
          icon: 'room_preferences',
          desc: "Fermer tous les volets extérieurs, battants intérieurs et fenêtres double vitrage. Repérer les entrées d'air résiduelles sous les portes."
        }
      ],
      pendant: [
        {
          title: "Gestion de l'Air & Atmosphère Intérieure",
          icon: 'air',
          desc: "Ne pas allumer de bougies ou flammes nues (consommation rapide d'oxygène et risque d'intoxication mortelle au monoxyde de carbone CO).",
          tip: "Utiliser exclusivement des lampes LED ou lampes frontales étanches.",
          tipIcon: 'flashlight_on'
        },
        {
          title: 'Rationnement & Hydratation Sécurisée',
          icon: 'water_bottle',
          desc: "Boire exclusivement l'eau en bouteilles scellées du kit (ration de sécurité : 3L/personne/jour).",
          tip: "Ne pas consommer l'eau du robinet tant que l'autorisation préfectorale n'est pas diffusée.",
          tipIcon: 'no_drinks',
          tipColor: 'text-error'
        },
        {
          title: 'Gestion Sanitaire & Déchets en Milieu Clos',
          icon: 'sanitizer',
          desc: "Double ensachage poubelle 100L scellé au ruban adhésif avec désinfectant/litière pour toilettes chimiques improvisées sans chasse d'eau."
        }
      ],
      apres: [
        {
          title: "Signal Officiel de Fin d'Alerte",
          icon: 'notifications_active',
          desc: "Attendre le message clair de la préfecture ou la sirène continue de fin d'alerte (son continu de 30 secondes). Ne sortir sous aucun prétexte avant cette notification."
        },
        {
          title: 'Aération et Décontamination de Sortie',
          icon: 'mode_fan',
          desc: "Retirer les calfeutrements plastiques avec gants et masque, aérer en grand en créant un courant d'air après passage complet du nuage ou du panache toxique."
        }
      ]
    },
    forbiddenActions: [
      {
        title: "Ne JAMAIS aller chercher les enfants à l'école",
        description: "Règle PPMS absolue, l'établissement est calfeutré et autonome. Les sorties exposent les enfants et paralysent les convois de secours."
      },
      {
        title: "Ne JAMAIS allumer de bougies ou chauffage d'appoint à combustion",
        description: "Risque asphyxie au CO et incendie incontrôlable dans un espace hermétiquement clos."
      },
      {
        title: "Ne JAMAIS ouvrir portes ou fenêtres pour observer",
        description: "Ne pas aérer spontanément avant le signal officiel préfectoral de fin d'alerte."
      },
      {
        title: "Ne JAMAIS téléphoner sur réseau vocal",
        description: "Cela sature les antennes relais indispensables aux coordinateurs de crise ; envoyer un unique SMS bref au contact relais distant (>100 km)."
      },
      {
        title: "Ne JAMAIS tenter une évacuation sauvage en voiture",
        description: "Embouteillages mortels piégés dans le panache toxique et obstruction complète des véhicules de sécurité civile."
      }
    ],
    technicalSection: {
      title: 'Technique de Calfeutrement Hermétique',
      badge: '4 ÉTAPES CLÉS',
      steps: [
        {
          icon: 'window',
          title: 'Fenêtres & Baies vitrées',
          desc: 'Ruban adhésif toilé épais 50mm posé à cheval sur les dormants et vantaux + film plastique polyéthylène tendu de bord à bord.'
        },
        {
          icon: 'hvac',
          title: 'Bouches de VMC & Aérateurs muraux',
          desc: 'Sacs poubelles étanches 50L plaqués et scellés sans interstice avec du ruban adhésif armé tout autour de l\'encadrement mural.'
        },
        {
          icon: 'fireplace',
          title: 'Conduits de fumée & Hottes aspirantes',
          desc: 'Fermer le clapet mécanique interne puis plaquer un carton rigide épais entièrement ceinturé d\'adhésif large étanche.'
        },
        {
          icon: 'door_front',
          title: 'Seuil de porte d\'entrée & Issues',
          desc: 'Serviette épaisse humidifiée roulée en boudin tassé contre la rainure du sol, doublée d\'une bande de ruban toilé fixée sur le chambranle.'
        }
      ]
    },
    emergencySymptoms: {
      title: "Signes de Rupture d'Herméticité ou Intoxication",
      intro: "Alerte sensorielle immédiate : odeurs suspectes persistantes (piquante, amande amère, œuf pourri, chlore), picotements oculaires ou toux sèche. ATTENTION : un masque FFP2/FFP3 ou un linge humide NE PROTÈGE PAS contre les gaz et vapeurs toxiques. Rejoindre immédiatement la zone la plus calfeutrée du logement, vérifier les étanchéités et composer immédiatement le 18 ou le 112 pour signaler une suspicion d'infiltration toxique.",
      symptoms: [
        'Odeurs chimiques suspectes persistantes',
        'Picotements oculaires ou irritation pharyngée',
        'Toux sèche ou dyspnée brutale',
        'Vertiges ou sensation d\'étourdissement'
      ]
    },
    institutionalClause: {
      title: 'CLAUSE INSTITUTIONNELLE & CADRE LÉGAL (DGSCGC / SGDSN)',
      text: "Ce protocole compile les directives interministérielles du Plan National Tous Responsables. En situation de crise, seuls les ordres diffusés par le Préfet de département (FR-Alert, radios du service public) font foi."
    }
  },

  chimique: {
    id: 'chimique',
    title: 'Incident Chimique & Fuite Toxique Industrielle',
    subtitle: 'Mise à l\'abri immédiate, protection contre les vapeurs caustiques et confinement hermétique.',
    categoryLabel: 'RISQUE CHIMIQUE [C]',
    categoryIcon: 'science',
    reviewDate: 'REVUE : 12 OCT. 2026',
    regulatoryBody: 'MINISTÈRE DE L\'INTÉRIEUR / SGDSN / INRS',
    badgeCriticality: 'RISQUE CHIMIQUE [C]',
    badgeBg: 'bg-primary-container',
    docId: 'DOC-ID: CHEM-C01',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvSgUQHuk7t51Z7EjUDui1oJAFmyw_q51DpOYOaA9Evug4SYmHAP8bVWVOzZ9f6oR2nqmYGMJTczf3ftlx2RINvWmHrXfmtxOv2amnYKlbJrjUwST7caFmsdrRENDH2K7uSGfT_ckxVE1Q_0bo0WHod5kr2Sy55FX9duGSeuxOmRHYlZQ0H9LAtQRoUmdBqEA-OISzhNpry9fwl8tiDKLuxtNRrT_fhndDI0LIo3I_tmG0bPx6hek',
    imageAlt: "Complexe industriel chimique moderne et capteurs de détection de gaz atmosphériques",
    imageTags: ['SITES SEVESO SEUIL HAUT & BAS', 'FRANCE DÉFENSE CIVILE'],
    imageCaption: 'Sites Seveso seuil haut & bas',
    imageSpec: 'FRANCE DÉFENSE CIVILE',
    offlineBannerText: 'PROTOCOLE LOCAL GARANTI • CACHE CRYPTÉ SHA-256',
    reflexesTitle: 'RÉFLEXES ESSENTIELS',
    reflexesPriority: 'IMMÉDIAT (0-5 MIN)',
    reflexes: [
      {
        num: 1,
        title: "Rejoindre immédiatement un bâtiment clos (Mise à l'abri prioritaire)",
        description: "Mise à l'abri sans délai. Attention : aucune direction de fuite ni aucun abri n'est universellement sûr. Si surpris dehors sans abri immédiat et avant formation du nuage au-dessus de vous, un dégagement transversal au vent peut être envisagé. Dès qu'un bâtiment en dur est accessible, confinez-vous et appliquez strictement les ordres diffusés par la Préfecture et FR-Alert."
      },
      {
        num: 2,
        title: 'Calfeutrer portes, fenêtres et couper impérativement la VMC',
        description: "Arrêtez ventilation, climatisation, hottes et chauffage. Bouchez les aérations avec du ruban adhésif toilé épais ou des linges humides."
      },
      {
        num: 3,
        title: 'Écouter France Bleu, France Inter & Préfecture',
        description: "Radio publique d'urgence (FM ou manivelle) et notifications officielles FR-Alert sur smartphone pour connaître la nature exacte du toxique et les consignes sectorielles."
      },
      {
        num: 4,
        title: 'Ne pas téléphoner (garder le réseau libre)',
        description: "Laissez les réseaux cellulaires et filaires intégralement disponibles pour les régulations des services de secours (15, 18, 112)."
      }
    ],
    phases: {
      avant: [
        {
          title: '1. Identifier les sites industriels Seveso',
          icon: 'map',
          desc: "Repérez les installations industrielles à risque et voies ferrées de transport de matières dangereuses situées dans un rayon de 5 à 10 km via le portail public Géorisques."
        },
        {
          title: '2. Préparer le matériel de calfeutrage',
          icon: 'construction',
          desc: "Regroupez dans un bac accessible du ruban adhésif toilé épais (type duct tape), des chiffons, des serpillières propres et des bâches plastiques pour obturer rapidement conduits et joints."
        },
        {
          title: '3. Stocker de l\'eau scellée en bouteille',
          icon: 'water_bottle',
          desc: "Prévoyez au moins 3 litres par personne et par jour (réserve de 72h). En cas d'accident chimique majeur, l'eau du réseau de distribution municipal peut être coupée ou temporairement contaminée."
        }
      ],
      pendant: [
        {
          title: '1. Choix de la pièce : priorité aux ordres préfectoraux',
          icon: 'door_front',
          desc: "Rejoignez une pièce centrale sans fenêtre donnant sur l'extérieur. Ne vous fiez à aucune règle universelle d'étage : la dispersion d'un gaz dépend de sa température de rejet, du vent et de la ventilation du bâtiment. Appliquez impérativement et en priorité les consignes préfectorales diffusées pour votre secteur."
        },
        {
          title: '2. Masques et linges : aucune protection contre les gaz',
          icon: 'masks',
          desc: "Ne comptez JAMAIS sur un masque FFP2/FFP3, chirurgical ou un linge humide pour vous protéger des gaz toxiques : ces dispositifs ne filtrent aucun composé gazeux toxique. La seule mesure efficace est de demeurer dans la pièce calfeutrée ou d'évacuer selon les ordres préfectoraux formels."
        },
        {
          title: '3. Flammes et étincelles strictement proscrites',
          icon: 'no_photography',
          desc: "Ne fumez pas, n'allumez aucune bougie ni appareil électrique produisant une étincelle. De nombreux gaz industriels présentent une toxicité doublée d'un risque explosif (ATEX)."
        },
        {
          title: '4. Ne pas aller chercher les enfants à l\'école',
          icon: 'family_restroom',
          desc: "Les établissements scolaires appliquent le Plan Particulier de Mise en Sûreté (PPMS). Les élèves sont calfeutrés et encadrés par les enseignants. Vous mettriez votre vie et la leur en danger sur la route."
        }
      ],
      apres: [
        {
          title: '1. Attendre l\'annonce officielle pour aérer',
          icon: 'air',
          desc: "Ne retirez les bandes adhésives et n'ouvrez les fenêtres qu'après la diffusion formelle du message de fin d'alerte par la préfecture (sirène continue 30s ou radio). Créez ensuite un courant d'air complet pour assainir l'air intérieur."
        },
        {
          title: '2. Consulter en cas d\'irritation persistante',
          icon: 'medical_services',
          desc: "En cas de picotements oculaires, toux résiduelle, nausées ou rougeurs cutanées survenues pendant l'épisode, contactez votre médecin traitant ou le SAMU (15) en précisant la nature de l'exposition."
        },
        {
          title: '3. Jeter denrées non hermétiques exposées',
          icon: 'delete_forever',
          desc: "Ne consommez aucun aliment laissé à l'air libre (fruits, légumes, pain, récipients ouverts). Seules les boîtes de conserve scellées et les contenants hermétiques nettoyés restent consommables."
        }
      ]
    },
    forbiddenActions: [
      {
        title: "Ne JAMAIS fuir en voiture",
        description: "L'habitacle d'une voiture n'est pas étanche : le système de ventilation aspire les particules et gaz toxiques. Les bouchons vous immobiliseraient en plein panache."
      },
      {
        title: "Ne JAMAIS aller chercher les enfants à l'école",
        description: "Les structures scolaires sont des forteresses de confinement dirigées par les équipes pédagogiques sous protocole PPMS. Votre déplacement bloque les axes d'intervention."
      },
      {
        title: "Ne JAMAIS utiliser un simple masque FFP2/FFP3 contre les gaz",
        description: "Les masques FFP2/FFP3 ne filtrent que les poussières mécaniques. Ils n'offrent STRICTEMENT AUCUNE protection contre les vapeurs, chlore, ammoniac ou gaz acides toxiques."
      },
      {
        title: "Ne JAMAIS prendre d'iode stable (KI 65mg)",
        description: "L'iode stable ne protège QUE la thyroïde contre l'iode radioactif (accident nucléaire). Il ne possède strictement aucun effet contre les gaz chimiques et risquerait de déclencher des effets indésirables graves."
      },
      {
        title: "Ne JAMAIS tenter d'identifier une substance à l'odeur",
        description: "Ne cherchez pas à approcher, humer ou goûter une nappe de gaz ou un liquide suspect. Plusieurs composés neutralisent l'odorat dès les premières inspirations (ex: H2S)."
      }
    ],
    pedagogy: {
      title: 'Typologie Indicative des Gaz Industriels (Principes Physiques Non Universels)',
      cards: [
        {
          title: 'Gaz à Tendance Lourde (Densité théorique > 1 à 20°C)',
          tag: 'TENDANCE BASSE (AIR CALME)',
          tagClass: 'bg-primary text-white',
          examples: 'Chlore (Cl2), Dioxyde de soufre (SO2), Phosgène, GPL / Propane / Butane.',
          specificity: "Ces gaz tendent à stagner dans les dépressions et sous-sols par temps calme. Attention : la température de rejet, le vent et les turbulences créent des mélanges complexes. Éviter caves et sous-sols non étanches, mais appliquer en priorité stricte les ordres d'évacuation ou de confinement diffusés par la Préfecture pour votre zone.",
          icon: 'south'
        },
        {
          title: 'Gaz à Tendance Légère (Densité théorique < 1 à 20°C)',
          tag: 'TENDANCE ASCENDANTE',
          tagClass: 'bg-secondary-fixed text-on-secondary-fixed',
          examples: 'Ammoniac (NH3), Méthane (CH4), Hydrogène (H2), Monoxyde de carbone (CO).',
          specificity: "Ces composés s'élèvent plus rapidement en milieu ouvert mais s'accumulent sous les toitures et combles mal isolés. Choisir une pièce centrale bien calfeutrée sans en faire une règle absolue : la dispersion réelle dépend des courants d'air et du bâti.",
          icon: 'north'
        }
      ]
    },
    emergencySymptoms: {
      title: "Quand contacter les secours ?",
      intro: "Afin de ne pas encombrer les standards de régulation, réservez vos appels téléphoniques exclusivement aux critères d'intoxication avérée ci-dessous :",
      symptoms: [
        'Gêne respiratoire aiguë (étouffement, sifflements, brûlure trachéale, cyanose)',
        'Brûlures chimiques cutanées ou oculaires (rincer 15 min à l\'eau tempérée sans frotter)',
        'Confusion mentale, somnolence brutale ou perte de conscience'
      ]
    },
    institutionalClause: {
      title: 'Avertissement opérationnel (CMIC / Sapeurs-Pompiers)',
      text: "Cette fiche ne remplace pas les ordres spécifiques des autorités ni l'intervention des sapeurs-pompiers spécialisés CMIC (Cellule Mobile d'Intervention Chimique). En situation de crise, appliquez toujours en priorité absolue les consignes diffusées par la Préfecture et les sirènes d'alerte."
    }
  },

  nucleaire: {
    id: 'nucleaire',
    title: 'Accident Nucléaire Majeur & Rejets Radioactifs',
    subtitle: 'Mise à l\'abri immédiate dans un bâtiment en dur, calfeutrage, radioprotection et prise d\'iode sur ordre.',
    categoryLabel: 'RISQUE NR • PPI ACTIF',
    categoryIcon: 'blur_on',
    reviewDate: 'REVUE : 14 OCT. 2026',
    regulatoryBody: 'ASNR / IRSN / SGDSN',
    badgeCriticality: 'RISQUE NR • PPI ACTIF',
    badgeBg: 'bg-error',
    docId: 'DOC-ID: NUC-N01',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBW9-kEF4ufqh1D31YiybioJ6h2V4n9NKKTTKOLjUXuvKx1aDXZSX3rxvBZF9az7GNROW6RMuIJEbigL7iyCA6ws_ud_oyWtMcbhHrFEhRbvd_VeJkz6sg8INP9B8GMK4A6_5BY3wcdH7wUOgG5KVCALg6_BUE7ylLjFWLZyk4m3vPB969yYC6MpDCk0UbrxzpRL-HINKU4dfwdl7IrnnFYKSSh7oTrDdIMefUa75uekKAVaq_uM90',
    imageAlt: "Contrôle dosimétrique et radioprotection dans un abri de crise civile",
    imageTags: ["INB & PLAN PARTICULIER D'INTERVENTION", 'RADIOPROTECTION CIVILE'],
    imageCaption: 'Contrôle de contamination et confinement hermétique en sous-sol renforcé',
    imageSpec: 'INB / PPI',
    offlineBannerText: 'PROTOCOLE LOCAL GARANTI • SHA-256',
    reflexesTitle: '0 - 15 MIN • RÉFLEXES ESSENTIELS',
    reflexesPriority: 'PRIORITÉ 1',
    reflexes: [
      {
        num: 1,
        title: "S'abriter immédiatement dans un bâtiment en dur",
        description: "Murs épais en béton ou brique (bloquent rayons gamma et flux bêta/alpha). Ne jamais rester en véhicule ou abri léger."
      },
      {
        num: 2,
        title: 'Calfeutrer hermétiquement & couper toute ventilation',
        description: "Fermer portes, fenêtres, cheminées. Couper impérativement VMC et climatisation pour stopper l'entrée d'aérosols radioactifs."
      },
      {
        num: 3,
        title: 'Écouter les consignes sur France Bleu ou FR-Alert',
        description: "Poste radio à piles/manivelle ou récepteur local. Suivre strictement les annonces de la Préfecture sans chercher de rumeurs web."
      },
      {
        num: 4,
        title: "Ne PAS prendre d'iode sans ordre préfectoral formel",
        description: "L'iode stable n'agit que contre l'iode 131 et doit être ingérée au timing exact du panache. Inutile contre l'irradiation globale externe."
      }
    ],
    phases: {
      avant: [
        {
          title: 'Identifier les Rayons PPI',
          icon: 'radar',
          desc: "Secteur 0-10 km : distribution préventive systématique en pharmacie. Secteur 10-20 km : réserves communales d'iode et plans d'évacuation préétablis."
        },
        {
          title: "Comprimés d'Iode Valides",
          icon: 'medication',
          desc: "Boîtes scellées avec notice officielle, stockées à l'abri de l'humidité (<25°C) et strictement hors de portée des enfants."
        },
        {
          title: 'Kit de Confinement Matériel',
          icon: 'inventory_2',
          desc: "Ruban adhésif toilé épais, films polyéthylène, ciseaux, eau minérale embouteillée hermétique (3 L/jour/personne pour 72 h minimum)."
        }
      ],
      pendant: [
        {
          title: 'Retranchement au Cœur du Bâtiment',
          icon: 'shield',
          desc: "S'installer au centre ou au sous-sol. La masse volumique du béton agit comme un écran atténuateur contre les rayonnements directs."
        },
        {
          title: 'Protection Voies Respiratoires',
          icon: 'masks',
          desc: "Si mouvement d'extrême urgence : masque FFP2/FFP3 bien ajusté ou linge humide plié sur nez et bouche pour bloquer les particules inhalables."
        },
        {
          title: 'Silence Téléphonique Strict',
          icon: 'phonelink_erase',
          desc: "Ne pas passer d'appels voix pour laisser le spectre libre aux secours. Envoyer uniquement un SMS unique et concis à un contact distant (>100 km)."
        }
      ],
      apres: [
        {
          title: "Attente du Signal Officiel de Fin",
          icon: 'campaign',
          desc: "Son continu de sirène (30 secondes) ou notification FR-Alert. Ne sortir sous aucun prétexte avant notification formelle des autorités."
        },
        {
          title: 'Déshabillage & Décontamination Sommaire',
          icon: 'shower',
          desc: "Si exposé dehors : retirer habits du haut vers le bas sans secouer, les ensacher doublement. Lavage corporel doux à l'eau tiède sans frotter la peau."
        }
      ]
    },
    forbiddenActions: [
      {
        title: "Ne JAMAIS fuir en voiture",
        description: "Congestion routière immédiate. L'habitacle d'une voiture offre une protection nulle contre le panache radioactif."
      },
      {
        title: "Ne JAMAIS aller chercher les enfants à l'école",
        description: "Les écoles appliquent le PPMS hermétique. Venir sur place vous expose et compromet le calfeutrement de l'établissement."
      },
      {
        title: "Ne JAMAIS consommer d'eau courante ni de produits frais locaux",
        description: "Robinet, potager et lait local sont sujets aux dépôts de radioéléments (Césium-137, Iode-131). Consommer exclusivement les réserves fermées."
      },
      {
        title: "Ne JAMAIS prendre d'iode de façon préventive sauvage",
        description: "Une ingestion prématurée sature inutilement la glande et peut déclencher des troubles thyroïdiens sévères sans conférer de protection durable."
      }
    ],
    pedagogy: {
      title: 'Repères Pédagogiques Clés',
      subtitle: 'Concepts Vitaux',
      cards: [
        {
          title: 'IRRADIATION',
          tag: 'Exposition à distance',
          tagClass: 'bg-surface-container text-secondary',
          specificity: "Exposition au flux de rayons émis par une source sans contact physique direct (similaire au soleil ou à une radiographie médicale). Règle d'or : Temps, Distance, Écran. Ne rend pas radioactif !",
          icon: 'flare'
        },
        {
          title: 'CONTAMINATION',
          tag: 'Dépôt physique',
          tagClass: 'bg-error-container text-on-error-container',
          specificity: "Présence effective de poussières ou liquides radioactifs sur la peau/vêtements (externe) ou ingérés/inhalés dans les organes internes (interne). Nécessite retrait des vêtements, lavage doux et prise d'iode sur ordre.",
          icon: 'grain'
        }
      ],
      table: {
        title: "Posologie Officielle d'Iode Stable (STRICTEMENT SOUMISE À ORDRE DU PRÉFET)",
        authority: 'Santé Publique France & Autorité de Sûreté Nucléaire (ASNR) / ANSM',
        desc: "Comprimés de Iodure de Potassium (KI 65 mg sécables - AMM PCA n° 34009 360 847 8 7). ATTENTION FORMELLE : Ce tableau est informatif. La prise d'iode dépend exclusivement et strictement des ordres diffusés en direct par les autorités (Préfet via FR-Alert / France Bleu) et ne doit jamais être décidée à partir du seul tableau de l'application ni par automédication préventive.",
        rows: [
          { label: 'Adulte & enfant > 12 ans', value: '2 comprimés (130 mg KI / 100 mg d’iode)' },
          { label: 'Enfant de 3 à 12 ans', value: '1 comprimé (65 mg KI / 50 mg d’iode)' },
          { label: 'Nourrisson (1 mois à 3 ans)', value: '1/2 comprimé (32,5 mg KI / 25 mg d’iode)' },
          { label: 'Nouveau-né (< 1 mois)', value: '1/4 comprimé (16,25 mg KI / 12,5 mg d’iode)' },
          { label: 'Femmes enceintes / allaitantes', value: '2 comprimés (priorité vitale fœtale)', isHighlighted: true },
          { label: 'Adultes de plus de 40 ans', value: 'Prise NON recommandée*', isWarning: true }
        ],
        footnote: "*Recommandation ASN/IRSN/ANSM : la prise est obligatoirement subordonnée à l'ordre préfectoral. Au-delà de 40 ans, le risque d'effets indésirables thyroïdiens et cardiovasculaires est supérieur au bénéfice (vulnérabilité au cancer thyroïdien radio-induit quasi nulle, sauf consigne exceptionnelle de la préfecture)."
      }
    },
    emergencySymptoms: {
      title: "Quand Appeler les Secours ?",
      intro: "Ne saturez pas les lignes pour de simples renseignements. Appels réservés aux situations de détresse absolue :",
      symptoms: [
        'Détresse vitale aiguë (inconscience, arrêt respiratoire)',
        'Brûlures thermiques/chimiques ou traumatismes graves lors du repli'
      ]
    },
    institutionalClause: {
      title: 'Clause Institutionnelle de Primauté (ASNR / IRSN / SGDSN)',
      text: "Cette fiche réflexe compile les doctrines standardisées de l'Autorité de Sûreté Nucléaire et de Radioprotection (ASNR), de l'Institut de Radioprotection et de Sûreté Nucléaire (IRSN) et du Secrétariat Général de la Défense et de la Sécurité Nationale (SGDSN). En situation réelle, les directives de Monsieur le Préfet de département diffusées via FR-Alert ou la radio locale priment sur toute consigne préétablie."
    }
  },
  radiologique: {
    id: 'radiologique',
    title: 'Urgence Radiologique & Sources Orphelines',
    subtitle: 'Rayonnements ionisants, sources scellées perdues, dispersion radiologique et protection ALARA.',
    categoryLabel: 'RISQUE R • RADIOLOGIQUE',
    categoryIcon: 'radiology',
    reviewDate: 'REVUE : 18 OCT. 2026',
    regulatoryBody: 'IRSN / ASNR / SGDSN • DOCTRINE RADIOLOGIQUE',
    badgeCriticality: 'RISQUE R • RADIOLOGIQUE',
    badgeBg: 'bg-[#7c2d12]',
    docId: 'DOC-ID: RAD-R01',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtN5Wu8YQzHl8Uad8fKzbCO_A_CKTZS7F-dtxnWnm4EsQe1433IyWpXlW-7gxZqE1fjDORt2uD_bF5SG1C9ik06oEjJFVEKsNXS0e7if83vIHjZKTpxzP0Trt91n_o_rBoA-wwn_lJxFqSHz7XkROiwAOGE9b4RIeNUrk5mfoERKwVdSl3Kq78iLTe9kI-HNbGL_7WZErnE8aonBR8_liWF_aRRQY6xNcMav-xVtltsFp56oF0w1Q',
    imageAlt: 'Symbole international de danger radiologique et équipement de radioprotection civile',
    imageTags: ['DOCTRINE ALARA (TEMPS / DISTANCE / ÉCRAN)', 'DISPERSION RADIOLOGIQUE & SOURCES INDUSTRIELLES'],
    imageCaption: 'Radioprotection opérationnelle • Doctrine IRSN / Sécurité Civile',
    imageSpec: 'NORMES IRSN / CIPR 103',
    offlineBannerText: 'MODE HORS-LIGNE ACTIF • FICHE RADIOLOGIQUE EMBARQUÉE',
    reflexesTitle: '4 RÉFLEXES VITAUX FACE AU RISQUE RADIOLOGIQUE',
    reflexesPriority: 'PRIORITÉ 1 VITALE',
    reflexes: [
      {
        num: 1,
        title: "Principe ALARA : Distance maximale immédiate",
        description: "Face à une source suspecte (marquage trèfle radioactif, conteneur en plomb égaré), s'éloigner sans délai. La dose diminue selon le carré de la distance : doubler sa distance divise par 4 le débit de dose reçu."
      },
      {
        num: 2,
        title: "Interposition d'écrans protecteurs denses",
        description: "Rejoindre un bâtiment en maçonnerie pleine ou béton armé. Les parois légères (verre, cloisons en plâtre, tôle) n'atténuent que faiblement les rayonnements gamma et les rayons X de haute énergie."
      },
      {
        num: 3,
        title: "Déshabillage immédiat en cas de dispersion (bombe sale)",
        description: "Si une explosion dispersive s'est produite : retirer immédiatement les vêtements extérieurs de haut en bas sans les secouer pour éliminer ~90% des particules déposées. Les ensacher hermétiquement."
      },
      {
        num: 4,
        title: "Comprimés d'iode STRICTEMENT INUTILES dans ce cas",
        description: "L'iode stable ne protège QUE contre l'iode 131 volatil d'un réacteur nucléaire à fission. Elle est totalement sans effet contre les radioéléments industriels ou médicaux (Césium-137, Cobalt-60, Iridium-192, Américium-241)."
      }
    ],
    phases: {
      avant: [
        {
          title: 'Reconnaissance des Marquages de Danger',
          icon: 'warning',
          desc: "Mémoriser le trèfle trifolium international (jaune et noir ou magenta) et les étiquettes de transport Classe 7 (Matières Radioactives). Ne jamais manipuler un cylindre ou conteneur métallique lourd abandonné."
        },
        {
          title: 'Kit de Décontamination Rapide Prépositionné',
          icon: 'inventory_2',
          desc: "Sacs étanches résistants 100L pour isoler les vêtements souillés, rouleau d'adhésif renforcé, gants nitrile épais, flacons de savon doux liquide."
        },
        {
          title: 'Canal d’Information de Secours',
          icon: 'radio',
          desc: "Poste radio FM/DAB+ à piles indépendant du réseau électrique pour capter les alertes de la Préfecture et de l'IRSN."
        }
      ],
      pendant: [
        {
          title: 'Éloignement et Protection Face au Vent',
          icon: 'near_me_disabled',
          desc: "Si une dispersion d'aérosols radioactifs est suspectée en extérieur, s'éloigner perpendiculairement à la direction du vent pour sortir de l'axe du panache."
        },
        {
          title: 'Confinement Étanche dans un Local Massif',
          icon: 'meeting_room',
          desc: "Rejoindre un local central sans fenêtre ou un sous-sol fermé. Fermer toutes les fenêtres, couper la VMC et boucher les aérations directes."
        },
        {
          title: 'Protection Respiratoire de Circonstance',
          icon: 'masks',
          desc: "Porter un masque FFP2/FFP3 ou couvrir le nez et la bouche avec un linge sec plié pour empêcher l'inhalation de particules radioactives alpha et bêta."
        }
      ],
      apres: [
        {
          title: 'Déshabillage Méthodique & Ensachage',
          icon: 'checkroom',
          desc: "Retirer chaussures et vêtements de l'extérieur vers l'intérieur en évitant tout contact avec le visage. Fermer les sacs de vêtements avec du ruban adhésif et les déposer à l'extérieur du lieu de vie."
        },
        {
          title: 'Douche Tiède Savonneuse Sans Friction',
          icon: 'shower',
          desc: "Se doucher à l'eau tiède avec du savon doux en insistant sur les mains, le cou, les cheveux et le visage. Ne JAMAIS frotter agressivement pour ne pas irriter la peau et favoriser la pénétration transcutanée."
        },
        {
          title: 'Signalement aux Secours (18 / 112)',
          icon: 'phone_in_talk',
          desc: "Indiquer précisément aux sapeurs-pompiers l'emplacement de l'incident, la présence éventuelle de marquages Classe 7 et votre état d'exposition pour organiser le triage radiologique."
        }
      ]
    },
    forbiddenActions: [
      {
        title: "Ne JAMAIS toucher ou ramasser un objet radioactif suspect",
        description: "Une source scellée orpheline (gammagraphie industrielle, capsule d'irradiation) peut délivrer une dose létale de rayonnement en quelques minutes de contact direct, sans odeur ni sensation immédiate."
      },
      {
        title: "Ne JAMAIS prendre de comprimés d'iode sans accident de centrale",
        description: "Les urgences radiologiques (sources perdues, bombes sales) impliquent des émetteurs gamma/bêta métalliques. La prise d'iode n'apporte aucune protection et expose à des effets indésirables inutiles."
      },
      {
        title: "Ne JAMAIS frotter la peau avec une brosse ou une éponge abrasive",
        description: "L'abrasion mécanique crée des micro-lésions épidermiques qui transforment une simple contamination surfacique externe en contamination interne par voie sanguine."
      },
      {
        title: "Ne JAMAIS s'approcher d'un accident de transport Classe 7",
        description: "Maintenir un périmètre de sécurité d'au moins 100 à 300 mètres en attendant l'arrivée de la Cellule Mobile d'Intervention Radiologique (CMIR)."
      }
    ],
    pedagogy: {
      title: 'Distinctions Doctrinales Fondamentales',
      subtitle: 'Comprendre pour réagir sans panique',
      cards: [
        {
          title: 'IRRADIATION EXTERNE',
          tag: 'Exposition à distance',
          tagClass: 'bg-surface-container text-secondary',
          specificity: "Exposition au flux de rayonnements ionisants (gamma, X) émis par une source à distance. Cesse dès que l'on s'éloigne ou s'abrite derrière un écran dense. La victime irradiée N'EST PAS radioactive et ne contamine pas les autres.",
          icon: 'flare'
        },
        {
          title: 'CONTAMINATION SURFACIQUE',
          tag: 'Dépôt physique',
          tagClass: 'bg-error-container text-on-error-container',
          specificity: "Présence de poussières ou liquides radioactifs déposés sur la peau ou les habits. Le simple retrait des vêtements élimine 90% du dépôt. Nécessite une douche tiède savonneuse sans frotter la peau.",
          icon: 'grain'
        },
        {
          title: 'INEFFICACITÉ DE L’IODE STABLE',
          tag: 'Subordonné à l’Iode 131',
          tagClass: 'bg-[#fef3c7] text-[#92400e]',
          specificity: "L'iodure de potassium (KI) ne protège QUE la thyroïde contre l'iode 131 volatil d'un accident de réacteur nucléaire. En cas de source orpheline ou de dispersion radiologique (Cobalt-60, Césium-137, Iridium-192), l'iode est totalement sans effet.",
          icon: 'medication'
        }
      ]
    },
    emergencySymptoms: {
      title: "Quand Appeler les Secours Radiologiques ?",
      intro: "Alerte immédiate des sapeurs-pompiers (18 ou 112) avec précision du risque radiologique :",
      symptoms: [
        'Découverte d\'un conteneur suspect portant le trèfle radioactif ou marquage Classe 7',
        'Exposition directe et prolongée à proximité immédiate d\'une source industrielle égarée',
        'Explosion avec suspicion de dissémination de poussières radioactives'
      ]
    },
    institutionalClause: {
      title: 'Doctrine de Radioprotection (IRSN / ASNR / CIPR)',
      text: "Les recommandations de cette fiche réflexe s'appuient sur les principes ALARA (As Low As Reasonably Achievable) de la Commission Internationale de Protection Radiologique (CIPR publication 103) et la doctrine de gestion des urgences radiologiques de l'Institut de Radioprotection et de Sûreté Nucléaire (IRSN). En situation réelle, les directives opérationnelles du Préfet de département et des équipes CMIR prévalent sur toute consigne préétablie."
    }
  }
};

