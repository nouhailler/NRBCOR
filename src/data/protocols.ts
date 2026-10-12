export interface ProtocolData {
  id: 'bio' | 'chimique' | 'nucleaire' | 'confinement';
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
      intro: "Alerte sensorielle immédiate : odeurs suspectes persistantes (piquante, amande amère, œuf pourri, chlore), picotements oculaires ou toux sèche : mettre immédiatement un masque FFP3 ou une étoffe humide sur les voies respiratoires, se déplacer dans la pièce la plus éloignée du vent et composer les numéros ci-dessous.",
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
        title: 'Rejoindre immédiatement un bâtiment clos',
        description: "Mise à l'abri sans délai. Ne restez pas en plein air, ne cherchez pas à observer le panache toxique."
      },
      {
        num: 2,
        title: 'Calfeutrer portes, fenêtres et couper la VMC',
        description: "Arrêtez climatisation, chauffage et bouchez les aérations avec ruban adhésif ou linges humides."
      },
      {
        num: 3,
        title: 'Écouter France Bleu & préfecture',
        description: "Radio publique (FM ou radio à manivelle) et notifications officielles FR-Alert sur smartphone."
      },
      {
        num: 4,
        title: 'Ne pas téléphoner',
        description: "Laissez les réseaux cellulaires et filaires intégralement disponibles pour les services de secours."
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
          title: '1. Rester confiné à l\'intérieur',
          icon: 'door_front',
          desc: "Choisissez si possible une pièce centrale, sans ouverture vers l'extérieur ou avec le moins de fenêtres possible. Évitez les sous-sols et caves (certains gaz toxiques plus lourds que l'air s'y accumulent)."
        },
        {
          title: '2. Respirer à travers un tissu humide',
          icon: 'masks',
          desc: "En présence d'une odeur piquante ou suspecte à l'intérieur, appliquez immédiatement un tissu ou une serviette imbibée d'eau sur le nez et la bouche pour absorber temporairement une fraction des vapeurs solubles."
        },
        {
          title: '3. Flammes et étincelles strictement proscrites',
          icon: 'no_photography',
          desc: "Ne fumez pas, n'allumez aucune bougie ni appareil électrique produisant une étincelle. De nombreux gaz industriels présentent une double toxicité explosive et inflammable."
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
          desc: "Ne retirez les bandes adhésives et n'ouvrez les fenêtres qu'après la diffusion du message de fin d'alerte par la préfecture ou par signal continu de sirène (30 secondes). Créez ensuite un courant d'air complet."
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
        description: "Les masques FFP2 ne filtrent que les poussières et aérosols mécaniques. Ils n'offrent strictement aucune protection contre les vapeurs, chlore, ammoniac ou gaz acides toxiques."
      },
      {
        title: "Ne JAMAIS tenter d'identifier une substance ou odeur",
        description: "Ne cherchez pas à approcher, humer ou goûter une nappe de gaz ou un liquide suspect. Plusieurs composés neutralisent l'odorat dès les premières inspirations (ex: H2S)."
      }
    ],
    emergencySymptoms: {
      title: "Quand contacter les secours ?",
      intro: "Afin de ne pas encombrer les standards de régulation, réservez vos appels téléphoniques exclusivement aux critères d'intoxication avérée ci-dessous :",
      symptoms: [
        'Gêne respiratoire aiguë (étouffement, sifflements, brûlure trachéale, cyanose)',
        'Brûlures chimiques cutanées ou oculaires (rincer 15 min à l\'eau tempérée)',
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
        title: 'Posologie Officielle Iode Stable',
        authority: 'Santé Publique France',
        desc: "Comprimés de Iodure de Potassium (65 mg). À dissoudre dans de l'eau, du lait ou du jus de fruits.",
        rows: [
          { label: 'Adulte & enfant > 12 ans', value: '2 comprimés (100 mg)' },
          { label: 'Enfant de 3 à 12 ans', value: '1 comprimé (50 mg)' },
          { label: 'Nourrisson (1 mois à 3 ans)', value: '1/2 comprimé (25 mg)' },
          { label: 'Nouveau-né (< 1 mois)', value: '1/4 comprimé (12.5 mg)' },
          { label: 'Femmes enceintes / allaitantes', value: '2 comprimés (priorité)', isHighlighted: true },
          { label: 'Adultes de plus de 45 ans', value: 'Prise déconseillée*', isWarning: true }
        ],
        footnote: "*Risque d'effets secondaires supérieur au bénéfice (vulnérabilité très faible au cancer thyroïdien radio-induit à cet âge)."
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
  }
};
