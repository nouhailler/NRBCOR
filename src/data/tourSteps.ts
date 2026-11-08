import { TourStep } from '../types/tour';

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'header-controls',
    tab: 'accueil',
    selector: '[data-tour="header-controls"]',
    badge: {
      fr: 'Contrôle & Profils',
      en: 'Control & Profiles'
    },
    title: {
      fr: 'Barre de Titre & Sélecteur de Profil',
      en: 'Top Bar & Profile Switcher'
    },
    description: {
      fr: 'Basculez en un clic entre le mode « Grand Public » (consignes synthétiques, gros boutons) et le mode « Expert » (dosimétrie, seuils de toxicité, doctrines militaires). Installez l’application en PWA pour un accès immédiat hors-ligne.',
      en: 'Toggle seamlessly between "Citizen" (simplified guides) and "Expert" mode (dosimetry, toxicity thresholds, military doctrines). Install the PWA on your device for immediate offline access.'
    },
    details: {
      fr: 'Accessible depuis n’importe quel écran, elle intègre aussi le changement de langue (FR/EN), le thème visuel et le bouton d’accès rapide au Mode Crise.',
      en: 'Accessible from any screen, it also includes language toggle (FR/EN), visual themes, and quick access to Crisis Mode.'
    },
    icon: 'tune',
    placement: 'bottom',
    durationMs: 7500
  },
  {
    id: 'home-status',
    tab: 'accueil',
    selector: '[data-tour="home-status"]',
    badge: {
      fr: 'Autonomie 100% Hors-Ligne',
      en: '100% Offline Autonomy'
    },
    title: {
      fr: 'Statut Réseau & Fraîcheur Doctrinale',
      en: 'Network Sensing & Official Corpus'
    },
    description: {
      fr: 'NRBCOR fonctionne sans aucune connexion Internet. Tous les protocoles, cartes et checklists sont intégrés dans le stockage local de votre appareil, révisés selon les doctrines officielles IRSN, DGSCGC et Santé Publique France.',
      en: 'NRBCOR operates without any internet connection. All protocols, maps, and checklists are embedded into device local storage, vetted against official IRSN, DGSCGC, and civil protection standards.'
    },
    details: {
      fr: 'Le voyant de connectivité indique en temps réel la bascule transparente entre le réseau actif et le mode de résilience déconnecté.',
      en: 'The status indicator shows seamless switching between live network access and disconnected offline resilience.'
    },
    icon: 'cloud_off',
    placement: 'bottom',
    durationMs: 7500
  },
  {
    id: 'urgent-alert',
    tab: 'accueil',
    selector: '[data-tour="urgent-alert"]',
    badge: {
      fr: 'Priorité Vitale',
      en: 'Vital Priority'
    },
    title: {
      fr: 'Bouton d’Urgence & Mode Crise Immédiat',
      en: 'Emergency Trigger & Crisis Mode'
    },
    description: {
      fr: 'En cas de détonation, de nuage toxique ou de sirène d’alerte aux populations (RNA), cette zone rouge prioritaire offre les consignes vitales immédiates : gestes de confinement étanche, déshabillage réflexe et accès direct au radar PPI.',
      en: 'In case of explosion, toxic plume, or civil defense siren, this emergency section guides you immediately: airtight sheltering, emergency undressing, and instant access to the concentric PPI radar.'
    },
    details: {
      fr: 'Un appui sur « Mode Crise Simplifié » passe l’application en affichage ergonomique d’extrême urgence avec 4 actions réflexes cardinales.',
      en: 'Tapping "Simplified Crisis Mode" switches the app into high-stress ergonomic mode featuring 4 core cardinal reflexes.'
    },
    icon: 'emergency',
    placement: 'bottom',
    durationMs: 8000
  },
  {
    id: 'cbrn-cards',
    tab: 'accueil',
    selector: '[data-tour="cbrn-cards"]',
    badge: {
      fr: '4 Menaces Majeures',
      en: '4 Major Hazards'
    },
    title: {
      fr: 'Protocoles Spécifiques : N, R, B et C',
      en: 'Dedicated CBRN Response Protocols'
    },
    description: {
      fr: 'Consultez les procédures opératoires propres à chaque risque : accidents industriels et centrales nucléaires (CNPE), dispersion radiologique et sources orphelines, agents biologiques pathogènes ou accidents chimiques Seveso.',
      en: 'Access actionable protocols for every hazard: nuclear power plant accidents, radioactive dispersion, biological pathogens, or industrial chemical releases.'
    },
    details: {
      fr: 'Chaque protocole intègre la reconnaissance des symptômes, les consignes d’air, la conduite à tenir pour l’eau et l’alimentation, et le protocole d’iode stable.',
      en: 'Each protocol includes symptom identification, air management, food/water safety guidance, and potassium iodide rules.'
    },
    icon: 'shield',
    placement: 'top',
    durationMs: 7500
  },
  {
    id: 'reagir-triage',
    tab: 'reagir',
    selector: '[data-tour="reagir-triage"]',
    badge: {
      fr: 'Action Sous Stress',
      en: 'Under-Stress Action'
    },
    title: {
      fr: 'Onglet Réagir : Triage 0-60s & Synthèse Vocale',
      en: 'React Tab: 0-60s Triage & Voice Guidance'
    },
    description: {
      fr: 'Conçu pour une manipulation sous panique ou avec les doigts tremblants : triage chronométré « Que faire maintenant ? », mode lisibilité extrême, lecture audio des consignes et appels d’urgence protégés par double validation.',
      en: 'Engineered for operation in the dark or under panic: timed 0-60s triage ("What to do now?"), extreme contrast readability, audio voice guidance, and protected emergency dispatch calls.'
    },
    details: {
      fr: 'Préserve les numéros nationaux d’urgence officiels (15 SAMU, 18 Pompiers, 112 Europe, 144 Suisse, 100 Belgique, 114 Sourd/Malentendant).',
      en: 'Preserves official emergency dispatch lines (15, 18, 112 Europe, 144 Switzerland, 100 Belgium, 114 Text).'
    },
    icon: 'bolt',
    placement: 'bottom',
    durationMs: 8000
  },
  {
    id: 'guides-pack',
    tab: 'guides',
    selector: '[data-tour="guides-pack"]',
    badge: {
      fr: 'Savoir & Prévention',
      en: 'Knowledge & Prevention'
    },
    title: {
      fr: 'Onglet Guides : Fiches Imprimables & Encyclopédie',
      en: 'Guides Tab: Printable Binder & Encyclopedia'
    },
    description: {
      fr: 'Générez en un clic votre pack de fiches d’urgence au format PDF A4 pour votre classeur de secours papier. Explorez également la mini-encyclopédie documentée et le glossaire de 25 termes experts (ALARA, Sievert, MOPP, ABEK2P3).',
      en: 'Generate your printable emergency PDF sheets for physical paper binders. Explore the documented CBRN mini-encyclopedia and complete doctrinal glossary (ALARA, Sievert, MOPP, ABEK2P3).'
    },
    details: {
      fr: 'Indispensable pour continuer à disposer des protocoles si vos appareils électroniques tombent en panne de batterie.',
      en: 'Essential to keep safety protocols readable even during severe prolonged telecom and power outages.'
    },
    icon: 'local_library',
    placement: 'bottom',
    durationMs: 8000
  },
  {
    id: 'prep-score',
    tab: 'preparation',
    selector: '[data-tour="prep-score"]',
    badge: {
      fr: 'Résilience Logistique',
      en: 'Household Resilience'
    },
    title: {
      fr: 'Onglet Préparation : Score d’Autonomie & Kit 72h',
      en: 'Preparation Tab: Resilience Score & 72h Kit'
    },
    description: {
      fr: 'Mesurez objectivement votre niveau de préparation avec le score explicable sur 100 points. Suivez vos réserves d’eau vitale (3 L/jour/personne), vos calories de subsistance et les dates de péremption de vos équipements de survie.',
      en: 'Objectively assess your household resilience with an explainable 100-point score. Track critical drinking water (3 L/day/person), calories, and survival kit expiration dates.'
    },
    details: {
      fr: 'La liste vérifie 18 articles essentiels répartis en 5 catégories logistiques avec alertes d’expiration semestrielles.',
      en: 'The checklist tracks 18 vital supplies across 5 logistical pillars with 6-month inspection reminders.'
    },
    icon: 'backpack',
    placement: 'bottom',
    durationMs: 8000
  },
  {
    id: 'plan-privacy',
    tab: 'mon-plan',
    selector: '[data-tour="plan-privacy"]',
    badge: {
      fr: 'Souveraineté des Données',
      en: 'Data Sovereignty'
    },
    title: {
      fr: 'Onglet Mon Plan : Plan Familial & Stockage Zéro-Serveur',
      en: 'My Plan Tab: Family Plan & Zero-Server Storage'
    },
    description: {
      fr: 'Coordonnez vos proches : contacts prioritaires, points de ralliement alternatifs et protocole école PPMS. Vos informations privées sont enregistrées exclusivement dans l’IndexedDB locale de votre navigateur, sans aucun serveur distant.',
      en: 'Coordinate household members: emergency contacts, alternative regrouping points, and school safety plans. Your sensitive data stays strictly confined to your device IndexedDB, never uploaded anywhere.'
    },
    details: {
      fr: 'Garantie Zéro-Compte, Zéro-Trace, Zéro-Cloud. Vous conservez la maîtrise intégrale avec export JSON et effacement instantané.',
      en: 'Zero-Account, Zero-Telemetry, Zero-Cloud guarantee. Complete data ownership with JSON export and instant wipe.'
    },
    icon: 'lock',
    placement: 'bottom',
    durationMs: 8500
  }
];
