/**
 * Traductions bilingues complètes (FR / EN) pour la Landing Page NRBCOR
 * Structure rigoureusement calquée sur les 11 sections demandées.
 */

export interface LandingTranslations {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    why: string;
    risks: string;
    features: string;
    offline: string;
    gallery: string;
    launchApp: string;
    github: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    slogan: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    proofPwa: string;
    proofOffline: string;
    proofBilingual: string;
    proofPrivacy: string;
    imageCaption: string;
  };
  why: {
    kicker: string;
    title: string;
    intro: string;
    pillars: {
      title: string;
      desc: string;
      icon: string;
    }[];
    offlineBox: {
      title: string;
      desc: string;
    };
  };
  risks: {
    kicker: string;
    title: string;
    subtitle: string;
    items: {
      id: string;
      letter: string;
      name: string;
      tagline: string;
      description: string;
      keyReflex: string;
      color: string;
      accent: string;
    }[];
  };
  features: {
    kicker: string;
    title: string;
    subtitle: string;
    list: {
      number: string;
      title: string;
      summary: string;
      details: string;
      icon: string;
      tag: string;
    }[];
  };
  offline: {
    kicker: string;
    title: string;
    mainQuote: string;
    intro: string;
    features: {
      title: string;
      desc: string;
      icon: string;
    }[];
    nuanceAlert: string;
  };
  bilingual: {
    kicker: string;
    title: string;
    subtitle: string;
    description: string;
    doctrines: {
      country: string;
      flag: string;
      details: string;
    }[];
    disclaimer: string;
  };
  audiences: {
    kicker: string;
    title: string;
    subtitle: string;
    profiles: {
      title: string;
      role: string;
      description: string;
      icon: string;
      points: string[];
    }[];
  };
  privacy: {
    kicker: string;
    title: string;
    mainQuote: string;
    intro: string;
    points: {
      title: string;
      desc: string;
      icon: string;
    }[];
  };
  gallery: {
    kicker: string;
    title: string;
    subtitle: string;
    openPrompt: string;
    closeLabel: string;
    items: {
      id: string;
      title: string;
      device: string;
      src: string;
      description: string;
    }[];
  };
  disclaimer: {
    kicker: string;
    title: string;
    notice: string;
    rule: string;
    points: string[];
  };
  cta: {
    kicker: string;
    title: string;
    text: string;
    primaryBtn: string;
    secondaryBtn: string;
    installHint: string;
  };
  footer: {
    description: string;
    navigationHeader: string;
    resourcesHeader: string;
    legalHeader: string;
    openSourceNote: string;
    rights: string;
  };
}

export const LANDING_FR: LandingTranslations = {
  meta: {
    title: 'NRBCOR — Protection civile et résilience face aux risques NRBC',
    description: 'Une application citoyenne pour comprendre les risques NRBC, préparer son foyer et disposer des bons réflexes face aux situations d’urgence. 100% autonome hors-ligne.'
  },
  nav: {
    why: 'Pourquoi NRBCOR',
    risks: 'Risques NRBC',
    features: 'Fonctionnalités',
    offline: 'Hors-Ligne',
    gallery: 'Aperçus',
    launchApp: 'Découvrir l\'application',
    github: 'Dépôt GitHub'
  },
  hero: {
    badge: 'Application Citoyenne • Protection Civile & Sécurité',
    titleLine1: 'NRBCOR',
    titleLine2: 'Protection civile et résilience face aux risques NRBC',
    slogan: 'Anticiper les risques. Préparer ses proches. Savoir réagir.',
    subtitle: 'Une application citoyenne pour comprendre les risques NRBC, préparer son foyer et disposer des bons réflexes face aux situations d\'urgence. Accessible partout, même sans connexion Internet.',
    primaryCta: 'Découvrir l\'application',
    secondaryCta: 'Explorer les fonctionnalités',
    proofPwa: 'PWA installable sur smartphone & PC',
    proofOffline: 'Fonctionnement 100% hors-ligne',
    proofBilingual: 'Bilingue Français & English',
    proofPrivacy: 'Données conservées exclusivement en local',
    imageCaption: 'Interface réelle de l\'application NRBCOR en mode mobile et desktop'
  },
  why: {
    kicker: 'ENJEUX DE PRÉPARATION CITOYENNE',
    title: 'Pourquoi disposer d’un outil comme NRBCOR ?',
    intro: 'Les situations d\'urgence technologique ou non-conventionnelle ne laissent aucune place à l\'improvisation. La sécurité des personnes repose sur des fondations claires acquises en amont.',
    pillars: [
      {
        title: 'Compréhension rigoureuse des risques',
        desc: 'Démystifier les dangers nucléaires, radiologiques, biologiques et chimiques sans catastrophisme, avec une terminologie vérifiée.',
        icon: 'menu_book'
      },
      {
        title: 'Réflexes vitaux immédiats (0–60s)',
        desc: 'Connaître les gestes qui sauvent sans hésitation : calfeutrage hermétique, sens d’évacuation, coupure des ventilations, distance.',
        icon: 'timer'
      },
      {
        title: 'Préparation matérielle méthodique',
        desc: 'Constituer un kit d’urgence 72h calibré selon la taille réelle du foyer, avec calcul d’autonomie en eau potable et nourriture.',
        icon: 'inventory_2'
      },
      {
        title: 'Organisation et coordination familiale',
        desc: 'Définir les points de rassemblement, les rôles précis et les canaux de communication hors-réseau téléphonique.',
        icon: 'groups'
      },
      {
        title: 'Accès permanent à une information fiable',
        desc: 'Consulter des consignes conformes aux autorités publiques, même lorsque les relais 4G/5G et le réseau électrique sont saturés ou coupés.',
        icon: 'verified_user'
      }
    ],
    offlineBox: {
      title: 'L’autonomie numérique : une nécessité opérationnelle',
      desc: 'En cas de crise technologique majeure, les réseaux cellulaires saturent en moins de 15 minutes. Une application dépendante d’un serveur cloud devient immédiatement inaccessible. NRBCOR embarque l’intégralité de ses bases de données et protocoles dans votre navigateur.'
    }
  },
  risks: {
    kicker: 'LES 4 COMPOSANTES FONDAMENTALES',
    title: 'Les quatre grandes familles de risques NRBC',
    subtitle: 'L\'application aborde chaque menace de manière scientifique et opérationnelle, conformément aux doctrines de sécurité civile.',
    items: [
      {
        id: 'nucleaire',
        letter: 'N',
        name: 'Nucléaire',
        tagline: 'Accidents de réacteurs & Rejets atmosphériques',
        description: 'Comprendre les accidents de centrales de production d’énergie nucléaire, les panaches de produits de fission, le confinement hermétique et l’usage encadré des comprimés d’iode stable (KI 65mg).',
        keyReflex: 'Confinement immédiat en dur • Fermeture des aérations • Iode uniquement sur ordre préfectoral',
        color: 'from-amber-500/20 to-amber-500/5',
        accent: '#d97706'
      },
      {
        id: 'radiologique',
        letter: 'R',
        name: 'Radiologique',
        tagline: 'Sources orphelines & Dispersions industrielles',
        description: 'Distinguer nettement l’irradiation externe de la contamination surfacique. Maîtriser le principe fondamental ALARA (Temps, Distance, Écran) et comprendre l’inutilité de l’iode stable hors réacteur.',
        keyReflex: 'Règle ALARA : s’éloigner immédiatement • Ne jamais toucher une source • S’abriter derrière un écran dense',
        color: 'from-orange-500/20 to-orange-500/5',
        accent: '#ea580c'
      },
      {
        id: 'biologique',
        letter: 'B',
        name: 'Biologique',
        tagline: 'Pathogènes, Toxines & Épidémies soudaines',
        description: 'Identifier les modes de transmission des agents infectieux (aérosols, contact, vecteurs). Mettre en place des barrières physiques étanches, l’utilisation des masques FFP3 et la désinfection virucide EN 14476.',
        keyReflex: 'Port de protection respiratoire FFP3 non valvée • Isolement immédiat • Lavage méticuleux sans abrasion',
        color: 'from-emerald-500/20 to-emerald-500/5',
        accent: '#059669'
      },
      {
        id: 'chimique',
        letter: 'C',
        name: 'Chimique',
        tagline: 'Accidents industriels Seveso & Toxiques de guerre',
        description: 'Comprendre le comportement des nuages gazeux toxiques (chlore, ammoniac, neurotoxiques). Savoir fuir perpendiculairement au vent et choisir le niveau du bâtiment selon la densité des gaz.',
        keyReflex: 'Fuir perpendiculairement au vent • Calfeutrer fenêtres avec ruban adhésif • Couper VMC et climatisations',
        color: 'from-rose-500/20 to-rose-500/5',
        accent: '#e11d48'
      }
    ]
  },
  features: {
    kicker: 'FONCTIONNALITÉS OPÉRATIONNELLES',
    title: 'Une suite complète pour se préparer et savoir agir',
    subtitle: 'Chaque module a été développé sur la base des manuels officiels de défense civile et des standards d’autonomie citoyenne.',
    list: [
      {
        number: '01',
        title: 'Mode Réagir Immédiat',
        summary: 'Guide réflexe haute lisibilité conçu pour être utilisé sous stress intense.',
        details: 'Accès en 1 clic aux 4 réflexes vitaux, aux 5 interdits absolus et aux numéros d’urgence opérationnels sans friction.',
        icon: 'crisis_alert',
        tag: 'Urgence'
      },
      {
        number: '02',
        title: 'Encyclopédie & Histoire NRBC',
        summary: 'Base de connaissances complète retraçant l’histoire des doctrines et des menaces.',
        details: '4 grandes ères historiques (de 1914 à nos jours), doctrines comparées (France, Suisse, USA, Russie, Israël) et moyens de détection.',
        icon: 'auto_stories',
        tag: 'Savoir'
      },
      {
        number: '03',
        title: 'Fiches Pratiques & Protocoles',
        summary: 'Guides détaillés illustrés étape par étape.',
        details: 'Procédure de déshabillage d’urgence en 8 étapes (retrait sans auto-contamination), calfeutrage étanche, signaux de sirène RNA et protection des animaux.',
        icon: 'task_alt',
        tag: 'Protocoles'
      },
      {
        number: '04',
        title: 'Checklist Kit d’Urgence 72h',
        summary: 'Constitution et suivi du matériel de survie autonome pour 3 jours.',
        details: '18 articles essentiels avec dates de péremption, suivi des réserves d’eau (3L/jour/personne), alimentation sans cuisson et éclairage autonome.',
        icon: 'backpack',
        tag: 'Logistique'
      },
      {
        number: '05',
        title: 'Plan Familial de Mise en Sûreté',
        summary: 'Organisation préalable des proches face à l’imprévu.',
        details: 'Fiches membres du foyer, contacts prioritaires, points de rassemblement alternatif et attribution des 5 tâches critiques.',
        icon: 'family_restroom',
        tag: 'Famille'
      },
      {
        number: '06',
        title: 'Tableau de Bord « Suis-je prêt ? »',
        summary: 'Calculateur d’autonomie explicable et score de préparation objectif.',
        details: 'Décomposition mathématique des besoins en eau et calories, inventaire réel, données estimées et 3 prochaines actions prioritaires.',
        icon: 'insights',
        tag: 'Évaluation'
      },
      {
        number: '07',
        title: 'Géorisques & Périmètres Hors-Ligne',
        summary: 'Sensibilisation aux risques technologiques territoriaux.',
        details: 'Carte embarquée des 19 CNPE nucléaires et 20+ sites Seveso Seuil Haut majeurs, zones PPI de 20 km et consultation Géorisques en direct/cache.',
        icon: 'map',
        tag: 'Territoire'
      },
      {
        number: '08',
        title: 'Formation, Quiz & Mode Formateur',
        summary: 'Entraînement citoyen et outils pour animateurs de sécurité civile.',
        details: '4 scénarios d’immersion chronométrés, quiz IRSN, reconnaissance audio des sirènes et générateur de fiches de débriefing imprimables.',
        icon: 'school',
        tag: 'Pédagogie'
      },
      {
        number: '09',
        title: 'Glossaire Terminologique A-Z',
        summary: 'Dictionnaire exhaustif des termes et acronymes techniques.',
        details: '25 notices expertes (ALARA, Sievert, Becquerel, ABEK2P3, MOPP, CMIC, PPI, SGDSN, etc.) avec contexte d’utilisation terrain et liens croisés.',
        icon: 'spellcheck',
        tag: 'Lexique'
      },
      {
        number: '10',
        title: 'Dossier Personnel de Secours',
        summary: 'Fiche d’urgence synthétique imprimable confidentielle.',
        details: 'Génération d’une fiche de poche pliable ou classeur de secours contenant les informations vitales sélectionnées par l’utilisateur.',
        icon: 'badge',
        tag: 'Dossier'
      }
    ]
  },
  offline: {
    kicker: 'AUTONOMIE & RÉSILIENCE NUMÉRIQUE',
    title: 'Une application qui fonctionne partout, 100% hors-ligne',
    mainQuote: '« Votre préparation ne doit pas dépendre de votre connexion Internet. »',
    intro: 'En situation de crise majeure, les réseaux télécoms et le courant électrique font souvent défaut. NRBCOR a été architecturée dès la première ligne de code pour fonctionner en autonomie absolue.',
    features: [
      {
        title: 'Technologie Progressive Web App (PWA)',
        desc: 'S’installe en un clic sur Android, iPhone, iPad, Mac ou PC comme une application native sans passer obligatoirement par un store.',
        icon: 'install_mobile'
      },
      {
        title: 'Stockage Local Souverain (IndexedDB)',
        desc: 'Vos listes d’inventaire, composition familiale et fiches de secours sont stockées directement dans la mémoire de votre appareil.',
        icon: 'storage'
      },
      {
        title: 'Sauvegarde & Restauration Fichiers JSON',
        desc: 'Exportez vos données sous forme de fichier JSON clair pour les transférer sur un autre appareil ou les conserver dans vos archives.',
        icon: 'file_download'
      },
      {
        title: 'Zéro Dépendance Serveur & Zéro Télémétrie',
        desc: 'Aucun appel vers un serveur d’application central, aucun cookie publicitaire, aucun pistage comportemental.',
        icon: 'lock_open'
      }
    ],
    nuanceAlert: 'Transparence opérationnelle : L’intégralité des guides, protocoles, quiz, cartes de périmètres et outils de calcul fonctionne sans aucun réseau. Seules la synchronisation en direct des dossiers municipaux Géorisques et la consultation des liens externes officiels nécessitent un accès Internet actif.'
  },
  bilingual: {
    kicker: 'ACCESSIBILITÉ INTERNATIONALE',
    title: 'Une application intégralement bilingue (Français & English)',
    subtitle: 'La sécurité civile ne s’arrête pas aux frontières linguistiques.',
    description: 'NRBCOR propose une parité stricte à 100% entre le français et l’anglais : 248 paires de clés d’interface, 5 fiches protocolaires complètes, l’ensemble des 18 articles du kit, l’encyclopédie, les 25 termes du glossaire et tous les quiz d’entraînement sont traduits avec la terminologie CBRN internationale reconnue (AIEA, OMS, protection civile européenne).',
    doctrines: [
      {
        country: 'France',
        flag: '🇫🇷',
        details: 'Plans gouvernementaux PIRATOX/BIOTOX, PPI 20 km, doctrines DGSCGC, IRSN, ASN et numéros 15 / 18 / 17 / 112 / 114.'
      },
      {
        country: 'Suisse',
        flag: '🇨🇭',
        details: 'Modèle fédéral de protection civile, abris étanches universels, rayon d’iode 50 km, centrale CENAL et numéros 144 / 118 / 117 / 145.'
      },
      {
        country: 'Belgique',
        flag: '🇧🇪',
        details: 'Plans d’urgence provinciaux et nationaux, pré-distribution d’iode stable, SPF Intérieur et numéros 112 / 101 / 100 / 070 245 245.'
      },
      {
        country: 'Luxembourg',
        flag: '🇱🇺',
        details: 'Dispositif national de protection en cas d’accident nucléaire, CGDIS Secours et numéros 112 / 113.'
      }
    ],
    disclaimer: 'La version anglaise conserve fidèlement les spécificités réglementaires et numéros d’urgence locaux de chaque pays sans les remplacer arbitrairement par des standards génériques anglo-saxons.'
  },
  audiences: {
    kicker: 'POUR QUI ?',
    title: 'Conçu pour tous ceux qui veulent agir avec lucidité',
    subtitle: 'De la sensibilisation citoyenne à l’entraînement d’équipes de terrain.',
    profiles: [
      {
        title: 'Chefs de Foyer & Particuliers',
        role: 'Autonomie & Sérénité',
        description: 'Pour anticiper les coupures d’énergie, préparer 72h de réserves sans gaspillage et connaître les gestes qui protègent la maison.',
        icon: 'home',
        points: ['Calculateur d’eau et nourriture', 'Checklist du matériel de survie', 'Dossier de secours personnel']
      },
      {
        title: 'Familles avec Enfants & Proches',
        role: 'Coordination & Sécurité',
        description: 'Pour s’accorder à l’avance sur les points de ralliement, comprendre pourquoi il ne faut pas aller chercher les enfants à l’école (PPMS) et se coordonner.',
        icon: 'escalator_warning',
        points: ['Plan familial de mise en sûreté', 'Compréhension du plan PPMS scolaire', 'Fiches de poche individuelles']
      },
      {
        title: 'Riverains de Sites Industriels & CNPE',
        role: 'Vigilance & Réflexes',
        description: 'Pour les résidents situés en zone Seveso ou dans les rayons PPI de centrales nucléaires, souhaitant connaître leur périmètre exact.',
        icon: 'factory',
        points: ['Carte hors-ligne des 19 CNPE et sites Seveso', 'Règles d’utilisation des comprimés d’iode', 'Reconnaissance des signaux d’alerte']
      },
      {
        title: 'Formateurs & Associations de Secours',
        role: 'Pédagogie & Débriefing',
        description: 'Pour les animateurs de sessions de sensibilisation, secouristes et enseignants souhaitant des simulations immersives et interactives.',
        icon: 'co_present',
        points: ['Mode Formateur dédié', 'Scénarios d’immersion chronométrés', 'Grille de débriefing imprimable']
      }
    ]
  },
  privacy: {
    kicker: 'CONFIDENTIALITÉ & SOUVERAINETÉ',
    title: 'Vos informations personnelles restent sous votre contrôle exclusif',
    mainQuote: '« Aucune donnée sur votre foyer ne quitte votre téléphone ou ordinateur. »',
    intro: 'La préparation aux situations de crise touche à des données intimes : effectif du foyer, lieu de résidence, ordonnances médicales, points de rencontre. NRBCOR applique le principe du zéro-serveur pour vos données privées.',
    points: [
      {
        title: 'Aucun compte obligatoire',
        desc: 'Accédez à 100% des fonctions sans créer d’identifiant, sans fournir d’adresse e-mail et sans mot de passe.',
        icon: 'no_accounts'
      },
      {
        title: 'Stockage strictement local',
        desc: 'L’ensemble de vos saisies (membres, kit, tâches) est écrit dans la base locale IndexedDB de votre navigateur.',
        icon: 'devices'
      },
      {
        title: 'Zéro Cloud pour vos informations privées',
        desc: 'Aucune donnée n’est transmise vers des serveurs tiers ou bases distantes. Votre vie privée est inviolable.',
        icon: 'cloud_off'
      },
      {
        title: 'Exportation et portabilité intégrale',
        desc: 'Générez à tout moment une sauvegarde JSON ou un document imprimable et effacez vos données locales en un clic.',
        icon: 'download_done'
      }
    ]
  },
  gallery: {
    kicker: 'APERÇUS DU LOGICIEL',
    title: 'Une interface épurée, conçue pour l’efficacité terrain',
    subtitle: 'Captures réelles de l’application NRBCOR en conditions réelles d’utilisation.',
    openPrompt: 'Cliquer sur une capture pour l’agrandir',
    closeLabel: 'Fermer',
    items: [
      {
        id: 'capture-hero',
        title: 'Vue d’ensemble Mobile & Desktop',
        device: 'Multi-plateforme',
        src: '/nrbcor_screenshot.jpg',
        description: 'L’application s’adapte naturellement aux smartphones verticaux et aux grands écrans d’ordinateur, avec lisibilité immédiate.'
      },
      {
        id: 'capture-home',
        title: 'Écran d’Accueil & Détection Réseau',
        device: 'Vue Smartphone',
        src: '/assets/aistudio/image_f04dc6c2.png',
        description: 'Indicateur de statut hors-ligne/en ligne, bouton d’urgence prioritaire et accès immédiat aux protocoles.'
      },
      {
        id: 'capture-perimetres',
        title: 'Carte Hors-Ligne des Périmètres',
        device: 'Vue Smartphone',
        src: '/assets/aistudio/image_5fb083c2.png',
        description: 'Recensement géographique complet des centrales nucléaires (CNPE) et sites Seveso seuil haut avec calcul des distances géodésiques.'
      },
      {
        id: 'capture-privacy',
        title: 'Stockage Local Zéro-Serveur',
        device: 'Vue Détail',
        src: '/assets/aistudio/image_bed71ae5.png',
        description: 'Interface de confirmation de souveraineté des données garantissant la persistance exclusive dans IndexedDB.'
      }
    ]
  },
  disclaimer: {
    kicker: 'CADRE INSTITUTIONNEL & RESPONSABILITÉ',
    title: 'Avertissement important de sécurité civile',
    notice: 'NRBCOR est une application citoyenne indépendante d’information, de sensibilisation et d’organisation préalable face aux risques majeurs.',
    rule: 'Elle ne remplace en aucun cas les autorités publiques, les services d’incendie et de secours (sapeurs-pompiers, CMIC, CMIR), les forces de sécurité intérieure ni les recommandations des organismes officiels compétents.',
    points: [
      'En situation d’urgence réelle, les ordres et consignes diffusés par les autorités (Préfet de département, FR-Alert, sirènes RNA, radio France Bleu) prévalent impérativement sur toute recommandation générale.',
      'Ne consommez jamais de comprimés d’iode stable (KI) sans ordre formel et explicite des autorités préfectorales.',
      'Ne quittez jamais un abri calfeutré et ne prenez pas la route sans consigne officielle expresse d’évacuation.'
    ]
  },
  cta: {
    kicker: 'PASSER À L’ACTION',
    title: 'La préparation commence avant l’urgence.',
    text: 'Prenez quelques minutes dès aujourd’hui pour découvrir NRBCOR, préparer votre foyer et mieux comprendre les risques auxquels vous pourriez être confronté.',
    primaryBtn: 'Accéder à l\'application NRBCOR',
    secondaryBtn: 'Consulter le projet sur GitHub',
    installHint: 'Gratuit • Open Source • 100% Hors-Ligne • Sans Publicité'
  },
  footer: {
    description: 'Application citoyenne souveraine de préparation aux risques technologiques majeurs et aux situations d’urgence NRBC. Conçue pour une autonomie totale sans dépendance réseau.',
    navigationHeader: 'Navigation',
    resourcesHeader: 'Ressources & Doctrines',
    legalHeader: 'Transparence & Cadre',
    openSourceNote: 'Projet citoyen distribué sous licence MIT. Code source ouvert et auditable.',
    rights: 'NRBCOR Protection Civile • Tous droits réservés.'
  }
};

export const LANDING_EN: LandingTranslations = {
  meta: {
    title: 'NRBCOR — Civil Protection & CBRN Hazard Preparedness',
    description: 'A citizen emergency application to understand CBRN hazards, prepare your household, and master vital safety reflexes. 100% offline autonomous.'
  },
  nav: {
    why: 'Why NRBCOR',
    risks: 'CBRN Hazards',
    features: 'Features',
    offline: 'Offline Ready',
    gallery: 'Previews',
    launchApp: 'Launch Application',
    github: 'GitHub Repo'
  },
  hero: {
    badge: 'Citizen Application • Civil Protection & Resilience',
    titleLine1: 'NRBCOR',
    titleLine2: 'Civil protection & resilience against CBRN risks',
    slogan: 'Anticipate risks. Prepare your household. Know how to react.',
    subtitle: 'A citizen application to understand CBRN hazards, prepare your household, and master vital reflexes during emergencies. Accessible everywhere, even with no Internet connection.',
    primaryCta: 'Launch Application',
    secondaryCta: 'Explore Features',
    proofPwa: 'Installable PWA for Mobile & PC',
    proofOffline: '100% Offline Autonomous',
    proofBilingual: 'Bilingual French & English',
    proofPrivacy: 'Data Stored Exclusively Locally',
    imageCaption: 'Real interface of the NRBCOR application across mobile and desktop environments'
  },
  why: {
    kicker: 'CIVILIAN READINESS IMPERATIVES',
    title: 'Why prepare with an application like NRBCOR?',
    intro: 'Major technological and unconventional crises leave zero margin for improvisation. Household survival and safety rely on clear knowledge established before danger strikes.',
    pillars: [
      {
        title: 'Rigorous Understanding of Hazards',
        desc: 'Demystifying nuclear, radiological, biological, and chemical risks without fearmongering, using verified terminology.',
        icon: 'menu_book'
      },
      {
        title: 'Vital Immediate Reflexes (0–60s)',
        desc: 'Knowing lifesavers by heart: hermetic sheltering, wind alignment, shutting down HVAC, staying low or gaining elevation.',
        icon: 'timer'
      },
      {
        title: 'Methodical Material Readiness',
        desc: 'Building a 72-hour emergency go-bag tailored to actual household size, with exact drinking water and caloric metrics.',
        icon: 'inventory_2'
      },
      {
        title: 'Family Organization & Safe Havens',
        desc: 'Designating alternative assembly points, emergency tasks, and non-cellular contact procedures.',
        icon: 'groups'
      },
      {
        title: 'Permanent Access to Reliable Guidelines',
        desc: 'Consulting official civil security procedures even when 4G/5G towers and the power grid collapse.',
        icon: 'verified_user'
      }
    ],
    offlineBox: {
      title: 'Digital Autonomy: An Operational Necessity',
      desc: 'During severe industrial or national emergencies, mobile network cells saturate within 15 minutes. An app relying on remote cloud servers fails instantly. NRBCOR packages all protocols, databases, and calculators directly inside your local browser.'
    }
  },
  risks: {
    kicker: 'THE 4 CORE HAZARD PILLARS',
    title: 'The four major CBRN hazard families',
    subtitle: 'NRBCOR addresses each threat with scientific accuracy, aligning with international civil defense standards.',
    items: [
      {
        id: 'nucleaire',
        letter: 'N',
        name: 'Nuclear',
        tagline: 'Reactor Accidents & Atmospheric Releases',
        description: 'Understand nuclear power plant incidents, fission fallout plumes, indoor hermetic sheltering, and strict regulated usage of potassium iodide (KI 65mg).',
        keyReflex: 'Immediate indoor shelter • Seal all air intakes • Take KI tablets only upon governmental directive',
        color: 'from-amber-500/20 to-amber-500/5',
        accent: '#d97706'
      },
      {
        id: 'radiologique',
        letter: 'R',
        name: 'Radiological',
        tagline: 'Orphan Sources & Industrial Dispersions',
        description: 'Clearly separate external irradiation from surface contamination. Master the ALARA principle (Time, Distance, Shielding) and understand why iodine is useless against radiological dirty bombs.',
        keyReflex: 'ALARA rule: maximize distance immediately • Never touch orphan sources • Shield behind dense masonry',
        color: 'from-orange-500/20 to-orange-500/5',
        accent: '#ea580c'
      },
      {
        id: 'biologique',
        letter: 'B',
        name: 'Biological',
        tagline: 'Pathogens, Toxins & Sudden Outbreaks',
        description: 'Identify infection routes (aerosols, direct contact, vectors). Establish sealed physical barriers, unvalved FFP3 particle filtration, and certified virucidal sanitization (EN 14476).',
        keyReflex: 'Wear unvalved FFP3 mask • Immediate quarantine • Gentle skin washing without abrasive scrubbing',
        color: 'from-emerald-500/20 to-emerald-500/5',
        accent: '#059669'
      },
      {
        id: 'chimique',
        letter: 'C',
        name: 'Chemical',
        tagline: 'Seveso Industrial Releases & Toxic War Agents',
        description: 'Analyze toxic gas behaviors (chlorine, ammonia, nerve agents). Evacuate strictly perpendicular to the wind axis and choose building height according to vapor density.',
        keyReflex: 'Flee crosswind (perpendicular) • Seal doors/windows with tape • Cut off all ventilation systems',
        color: 'from-rose-500/20 to-rose-500/5',
        accent: '#e11d48'
      }
    ]
  },
  features: {
    kicker: 'REAL-WORLD CAPABILITIES',
    title: 'A complete suite to prepare, drill, and react',
    subtitle: 'Every module is built upon official civil protection frameworks and civilian resilience best practices.',
    list: [
      {
        number: '01',
        title: 'Immediate React Mode',
        summary: 'High-visibility reflex dashboard built for extreme crisis stress.',
        details: '1-click access to 4 vital actions, 5 deadly traps, and direct operational emergency dispatch numbers.',
        icon: 'crisis_alert',
        tag: 'Emergency'
      },
      {
        number: '02',
        title: 'CBRN Encyclopedia & History',
        summary: 'Comprehensive knowledge base detailing the history and doctrines of unconventional weapons.',
        details: '4 historical eras (from 1914 to present), comparative national doctrines (France, Switzerland, USA, Russia, Israel), and detection instruments.',
        icon: 'auto_stories',
        tag: 'Knowledge'
      },
      {
        number: '03',
        title: 'Field Guides & Step-by-Step Protocols',
        summary: 'Actionable emergency procedures illustrated in sequential order.',
        details: '8-step emergency undressing without self-contamination, airtight room sealing, national alarm siren sounds, and CBRN pet care.',
        icon: 'task_alt',
        tag: 'Protocols'
      },
      {
        number: '04',
        title: '72-Hour Emergency Go-Bag Kit',
        summary: 'Household supply tracking for 3 days of complete off-grid autonomy.',
        details: '18 certified items with expiry tracking, water reservoir management (3L/day/person), no-cook nutrition, and autonomous lighting.',
        icon: 'backpack',
        tag: 'Supplies'
      },
      {
        number: '05',
        title: 'Family Safe Haven Plan',
        summary: 'Prearranged family coordination plan for unexpected disasters.',
        details: 'Household member profiles, priority phone contacts, backup rally locations, and division of 5 critical survival roles.',
        icon: 'family_restroom',
        tag: 'Family'
      },
      {
        number: '06',
        title: '“Am I Ready?” Dashboard',
        summary: 'Explainable autonomy calculator and objective preparedness assessment.',
        details: 'Mathematical water and calorie requirements, actual inventory tracking, estimated gaps, and top 3 prioritized improvement actions.',
        icon: 'insights',
        tag: 'Readiness'
      },
      {
        number: '07',
        title: 'Géorisques & Offline Perimeters Map',
        summary: 'Territorial awareness of nearby industrial and nuclear hazards.',
        details: 'Embedded offline database of all 19 French nuclear plants and 20+ top-tier Seveso facilities, 20km PPI safety radiuses, and live/cached Géorisques data.',
        icon: 'map',
        tag: 'Territory'
      },
      {
        number: '08',
        title: 'Drills, Quizzes & Trainer Suite',
        summary: 'Citizen training drills and tools for civil protection instructors.',
        details: '4 timed crisis immersion scenarios, IRSN radiological quiz, siren audio recognition, and printable debriefing report generator.',
        icon: 'school',
        tag: 'Training'
      },
      {
        number: '09',
        title: 'A-Z Technical Glossary',
        summary: 'Jargon-free definitions of complex technical acronyms.',
        details: '25 expert entries (ALARA, Sievert, Becquerel, ABEK2P3, MOPP, CMIC, PPI, SGDSN, etc.) with operational field context and cross-references.',
        icon: 'spellcheck',
        tag: 'Glossary'
      },
      {
        number: '10',
        title: 'Personal Emergency Dossier',
        summary: 'Confidential printable emergency wallet card and emergency binder.',
        details: 'Generates a folding pocket card or printable disaster binder containing vital contacts, medical notes, and safe meeting points.',
        icon: 'badge',
        tag: 'Dossier'
      }
    ]
  },
  offline: {
    kicker: 'DIGITAL SOVEREIGNTY & AUTONOMY',
    title: 'An application that functions anywhere, 100% offline',
    mainQuote: '“Your preparedness must never depend on an active Internet connection.”',
    intro: 'During severe industrial or military emergencies, cellular towers crash and municipal power lines often go down. NRBCOR was engineered from line one for total standalone autonomy.',
    features: [
      {
        title: 'Progressive Web App (PWA) Standard',
        desc: 'Installs in 1-click on Android, iPhone, iPad, Mac, or Windows PC as a native application without mandatory app store intermediaries.',
        icon: 'install_mobile'
      },
      {
        title: 'Sovereign Local Storage (IndexedDB)',
        desc: 'Your emergency inventory, family roster, and disaster dossier remain stored exclusively inside your local device sandbox.',
        icon: 'storage'
      },
      {
        title: 'Encrypted JSON Backup & Restore',
        desc: 'Export your records as a human-readable JSON file to transfer between devices or safeguard in your offline archives.',
        icon: 'file_download'
      },
      {
        title: 'Zero Remote Server & Zero Telemetry',
        desc: 'No remote analytics, no advertising trackers, no central cloud databases, and zero telemetry pings.',
        icon: 'lock_open'
      }
    ],
    nuanceAlert: 'Operational transparency: All emergency guides, protocols, drills, perimeters maps, and survival calculators function with zero network access. Only real-time Géorisques territorial queries and outbound links to government sites require an active Internet connection.'
  },
  bilingual: {
    kicker: 'CROSS-BORDER ACCESSIBILITY',
    title: 'A fully bilingual application (Français & English)',
    subtitle: 'Civil defense recognizes no linguistic boundaries.',
    description: 'NRBCOR guarantees 100% strict bilingual parity: 248 UI key pairs, 5 complete CBRN protocol guides, 18 survival kit items, the full encyclopedia, 25 glossary terms, and all interactive training drills are professionally localized following international CBRN standards (IAEA, WHO, European Civil Protection).',
    doctrines: [
      {
        country: 'France',
        flag: '🇫🇷',
        details: 'Governmental PIRATOX/BIOTOX plans, 20 km PPI radius, DGSCGC, IRSN, ASN doctrines, and emergency hotlines 15 / 18 / 17 / 112 / 114.'
      },
      {
        country: 'Switzerland',
        flag: '🇨🇭',
        details: 'Federal civil protection model, universal air-raid blast shelters, 50 km potassium iodide radius, NEOC (CENAL), and hotlines 144 / 118 / 117 / 145.'
      },
      {
        country: 'Belgium',
        flag: '🇧🇪',
        details: 'Provincial and national emergency response plans, pre-distributed stable iodine, Federal Public Service, and hotlines 112 / 101 / 100 / 070 245 245.'
      },
      {
        country: 'Luxembourg',
        flag: '🇱🇺',
        details: 'National nuclear response framework, CGDIS Emergency Rescue Corps, and hotlines 112 / 113.'
      }
    ],
    disclaimer: 'The English edition preserves each country’s legal specifics and operational phone numbers without replacing them with generic Anglo-Saxon shortcuts.'
  },
  audiences: {
    kicker: 'WHO IS IT FOR?',
    title: 'Built for everyone seeking clarity before a disaster',
    subtitle: 'From personal household safety to civil defense instructor drills.',
    profiles: [
      {
        title: 'Household Heads & Individuals',
        role: 'Autonomy & Preparedness',
        description: 'Anticipate blackouts, build 72-hour food/water reserves without waste, and master protective home sheltering.',
        icon: 'home',
        points: ['Water & calorie calculators', '72h emergency supply checklist', 'Personal emergency wallet dossier']
      },
      {
        title: 'Families with Children & Elders',
        role: 'Coordination & Safety',
        description: 'Agree in advance on alternative meeting locations, understand school confinement protocols (PPMS), and coordinate roles.',
        icon: 'escalator_warning',
        points: ['Family safety action plan', 'School emergency plan (PPMS) guidelines', 'Pocket family cards']
      },
      {
        title: 'Residents Near Nuclear & Seveso Plants',
        role: 'Vigilance & Fast Reflexes',
        description: 'Understand your exact distance to high-risk facilities, evacuation transit corridors, and proper potassium iodide usage.',
        icon: 'factory',
        points: ['Offline map of 19 NPPs & Seveso hubs', 'Safe potassium iodide usage rules', 'National siren audio recognition']
      },
      {
        title: 'Instructors & Civil Defense Trainers',
        role: 'Education & Debriefing',
        description: 'Conduct interactive civilian readiness workshops, emergency simulations, and print structured debriefing sheets.',
        icon: 'co_present',
        points: ['Dedicated Instructor Mode', 'Timed immersion simulation drills', 'Printable exercise debriefing rubric']
      }
    ]
  },
  privacy: {
    kicker: 'PRIVACY & DATA SOVEREIGNTY',
    title: 'Your personal data remains strictly under your control',
    mainQuote: '“No data regarding your household ever leaves your phone or computer.”',
    intro: 'Disaster preparedness involves sensitive personal details: family composition, residential address, medical prescriptions, and rally points. NRBCOR enforces a zero-server privacy architecture.',
    points: [
      {
        title: 'No Mandatory User Accounts',
        desc: 'Access 100% of capabilities without creating a profile, submitting your email address, or setting passwords.',
        icon: 'no_accounts'
      },
      {
        title: 'Strictly Local Storage',
        desc: 'All user entries (family members, kit checks, inventory) are written to your browser’s isolated local IndexedDB.',
        icon: 'storage'
      },
      {
        title: 'Zero Cloud Storage for Private Data',
        desc: 'No personal details are transmitted to external servers, cloud databases, or third-party vendors.',
        icon: 'cloud_off'
      },
      {
        title: 'Complete Portability & Instant Erasure',
        desc: 'Export your data to a clean JSON file at any time, or purge all local storage with a single click.',
        icon: 'download_done'
      }
    ]
  },
  gallery: {
    kicker: 'INTERFACE PREVIEWS',
    title: 'Clean, distraction-free interface built for field utility',
    subtitle: 'Authentic screenshots from the NRBCOR application in real operating conditions.',
    openPrompt: 'Click on any preview to expand in full screen',
    closeLabel: 'Close',
    items: [
      {
        id: 'capture-hero',
        title: 'Mobile & Desktop Overview',
        device: 'Multi-Device Suite',
        src: '/nrbcor_screenshot.jpg',
        description: 'The interface adjusts seamlessly to mobile touchscreens and desktop monitors with optimal contrast and typographic clarity.'
      },
      {
        id: 'capture-home',
        title: 'Home Screen & Network Sensor',
        device: 'Smartphone View',
        src: '/assets/aistudio/image_f04dc6c2.png',
        description: 'Real-time offline/online detector, prominent crisis button, and instant 1-tap access to vital CBRN reflex protocols.'
      },
      {
        id: 'capture-perimetres',
        title: 'Offline Perimeters Map',
        device: 'Smartphone View',
        src: '/assets/aistudio/image_5fb083c2.png',
        description: 'Geographic listing of all 19 French nuclear plants and top-tier Seveso chemical plants with precise geodesic distance calculation.'
      },
      {
        id: 'capture-privacy',
        title: 'Zero-Server Local Storage',
        device: 'Settings View',
        src: '/assets/aistudio/image_bed71ae5.png',
        description: 'Data sovereignty confirmation assuring users that all records stay confined strictly to browser IndexedDB.'
      }
    ]
  },
  disclaimer: {
    kicker: 'INSTITUTIONAL FRAMEWORK & LEGAL NOTICE',
    title: 'Important civil protection disclaimer',
    notice: 'NRBCOR is an independent civilian awareness, preparedness, and training application.',
    rule: 'It does not replace public authorities, fire and rescue services (sapeurs-pompiers, CMIC, CMIR), law enforcement, or official governmental directives.',
    points: [
      'In a real-world emergency, directives issued by official authorities (Departmental Prefect, FR-Alert broadcasts, RNA sirens, France Bleu radio) take precedence over any general recommendation.',
      'Never consume stable potassium iodide (KI) tablets without explicit and formal orders from prefectural authorities.',
      'Never leave an airtight shelter or embark on unauthorized spontaneous evacuation routes without formal orders.'
    ]
  },
  cta: {
    kicker: 'GET STARTED TODAY',
    title: 'Preparedness begins before the emergency.',
    text: 'Take a few minutes today to discover NRBCOR, organize your household safety, and understand the technological risks around you.',
    primaryBtn: 'Open NRBCOR Application',
    secondaryBtn: 'View Project on GitHub',
    installHint: 'Free • Open Source • 100% Offline Capable • No Advertisements'
  },
  footer: {
    description: 'Sovereign citizen application for technological disaster readiness and CBRN civil protection. Engineered for complete off-grid autonomy with zero cloud dependency.',
    navigationHeader: 'Navigation',
    resourcesHeader: 'Resources & Doctrines',
    legalHeader: 'Legal & Framework',
    openSourceNote: 'Open-source citizen project distributed under the MIT License. Freely auditable code.',
    rights: 'NRBCOR Civil Protection • All rights reserved.'
  }
};
