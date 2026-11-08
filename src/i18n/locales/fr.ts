/**
 * Dictionnaire de traduction Français (Langue par défaut)
 * NRBCOR Protection Civile
 */

export const fr = {
  // -------------------------------------------------------------
  // COMMUN & UI GLOBALE
  // -------------------------------------------------------------
  'common.appName': 'NRBCOR',
  'common.appSubtitle': 'Protection Civile & Risques NRBC',
  'common.offline': 'Hors Ligne',
  'common.online': 'En Ligne',
  'common.offlineBadge': 'Mode Hors-Ligne • 100% Embarqué',
  'common.onlineBadge': 'Réseau Détecté • Données Officielles Directes',
  'common.back': 'Retour',
  'common.close': 'Fermer',
  'common.cancel': 'Annuler',
  'common.confirm': 'Confirmer',
  'common.save': 'Enregistrer',
  'common.delete': 'Supprimer',
  'common.edit': 'Modifier',
  'common.add': 'Ajouter',
  'common.search': 'Rechercher',
  'common.filter': 'Filtrer',
  'common.all': 'Tous',
  'common.print': 'Imprimer',
  'common.export': 'Exporter',
  'common.import': 'Importer',
  'common.loading': 'Chargement...',
  'common.empty': 'Aucun élément trouvé',
  'common.error': 'Une erreur est survenue',
  'common.success': 'Opération réussie',
  'common.warning': 'Avertissement',
  'common.critical': 'Critique',
  'common.info': 'Information',
  'common.days': 'jours',
  'common.hours': 'heures',
  'common.minutes': 'minutes',
  'common.seconds': 'secondes',
  'common.liters': 'litres',
  'common.people': 'personnes',
  'common.person': 'personne',
  'common.verified': 'Vérifié',
  'common.pending': 'À revalider',
  'common.draft': 'Brouillon',
  'common.officialDoctrines': 'Doctrines Officielles',
  'common.zeroCloud': '100% Hors-Ligne • Zero-Cloud',

  // -------------------------------------------------------------
  // NAVIGATION & EN-TÊTE
  // -------------------------------------------------------------
  'nav.home': 'Accueil',
  'nav.react': 'Réagir',
  'nav.guides': 'Guides',
  'nav.prep': 'Préparation',
  'nav.myPlan': 'Mon Plan',
  'nav.crisis': 'Crise',
  'nav.crisisButton': 'CRISE',
  'nav.openMenu': 'Ouvrir le menu complet',
  'nav.profileMode': 'Mode profil',
  'nav.simplified': 'Grand Public',
  'nav.expert': 'Expert',
  'nav.install': 'Installer',
  'nav.theme': 'Thème',
  'nav.themeLight': 'Thème Clair',
  'nav.themeDark': 'Thème Sombre',
  'nav.language': 'Langue',
  'nav.sources': 'Sources & Traçabilité',
  'nav.settings': 'Paramètres',
  'header.autonomousStorage': 'Stockage Autonome',
  'header.installTitle': 'Installer l\'application sur votre écran mobile ou ordinateur',
  'header.profileSimplifiedTooltip': 'Mode actuel : Grand Public Simplifié (Cliquer pour Mode Expert)',
  'header.profileExpertTooltip': 'Mode actuel : Expert / Formateur (Cliquer pour Mode Grand Public)',

  // Menu Hamburger Rubriques
  'menu.catUrgence': '1. Urgence & Réflexes Immédiats',
  'menu.modeCrise': 'Mode Crise Simplifié (Gros Boutons)',
  'menu.reagirNow': 'Mode Réagir Maintenant',
  'menu.deshabillage': 'Déshabillage & Décontamination (8 étapes)',
  'menu.confinement': 'Guide Confinement Étanche',
  'menu.siren': 'Signaux d\'Alerte RNA & Simulateur Sonore',
  
  'menu.catDoctrines': '2. Fiches & Risques NRBC',
  'menu.allGuides': 'Catalogue Complet des Guides',
  'menu.ficheNucleaire': 'Fiche Nucléaire (Centrale / Accident)',
  'menu.ficheChimique': 'Fiche Chimique (Seveso / Toxiques)',
  'menu.ficheBio': 'Fiche Biologique (Pathogènes / Toxines)',
  'menu.ficheRadiologique': 'Fiche Radiologique (Sources / Irradiations)',
  'menu.ficheIode': 'Fiche Iode Stable (KI 65mg & Posologie)',
  'menu.encyclopedia': 'Encyclopédie & Histoire du Risque NRBC',
  'menu.glossary': 'Glossaire des Termes & Acronymes A-Z',

  'menu.catResilience': '3. Résilience & Préparation',
  'menu.suisJePret': 'Tableau de bord « Suis-je prêt ? »',
  'menu.kit72h': 'Checklist Kit d\'Urgence 72h',
  'menu.inventory': 'Inventaire & Dates de Péremption',
  'menu.familyPlan': 'Mon Plan Familial de Mise en Sûreté',
  'menu.georisques': 'Risques Locaux & Géorisques (En ligne / Cache)',
  'menu.cartePerimetres': 'Carte Hors-Ligne des Périmètres (100% Autonome)',

  'menu.catExercices': '4. Formation & Exercices',
  'menu.formation': 'Simulations d\'Immersion & Quiz NRBC',

  'menu.catSysteme': '5. Paramètres Système & Données',
  'menu.systemSettings': 'Mises à Jour & Paramètres Système',
  'menu.preferences': 'Préférences, Taille du Texte & Export',
  'menu.legal': 'Mentions Légales & Onboarding',
  'menu.wipe': 'Réinitialiser le prototype',
  'menu.wipeDesc': 'Partir d\'une feuille blanche ou recharger démo',

  // -------------------------------------------------------------
  // ACCUEIL (HOME VIEW)
  // -------------------------------------------------------------
  'home.badgePwa': 'PWA 100% HORS-LIGNE • STOCKAGE LOCAL SOUVERAIN',
  'home.title': 'Protection Civile & Résilience NRBC',
  'home.subtitle': 'Protocoles d\'urgence, kit 72h et guides face aux risques majeurs.',
  'home.installTitle': 'Installer l\'application sur cet appareil',
  'home.installSubtitle': 'Disponible hors connexion depuis votre écran d\'accueil.',
  'home.installBtn': 'Installer',
  'home.urgentSection': 'Urgence ou Alerte en cours ?',
  'home.urgentDesc': 'Consignes immédiates sans connexion. Confinement, décontamination et gestes réflexes d\'urgence.',
  'home.vitalPriority': 'Priorité Vitale',
  'home.openCrisis': 'Mode Crise Simplifié (Gros Boutons)',
  'home.openReact': 'Fiches Réagir',
  'home.openRadar': 'Carte Périmètres (Radar PPI)',
  'home.noAutoCall': 'Ne déclenche pas d\'appel automatique aux secours',
  'home.stepByStep': 'Gestes & Procédures Pas-à-Pas',
  'home.immediate': 'IMMÉDIAT',
  'home.dashboardTitle': 'Suis-je prêt ?',
  'home.dashboardSubtitle': 'Tableau de bord personnalisé & autonomie du foyer',
  'home.viewScore': 'Voir score',
  'home.targetAutonomy': 'Autonomie visée : 72 heures',
  'home.calculatedLocally': 'Parcours calculé en local',
  'home.water72h': 'Eau 72h',
  'home.waterNorm': '3L / j / pers',
  'home.infoAlert': 'Info Alerte',
  'home.radioFm': 'Radio FM',
  'home.needs': 'Besoins',
  'home.adjustable': 'Ajustables',
  'home.openDashboard': 'Ouvrir mon tableau de bord de résilience',

  // -------------------------------------------------------------
  // RÉAGIR (REACT VIEW)
  // -------------------------------------------------------------
  'react.stressNormal': 'Mode Normal',
  'react.stressExtreme': 'Mode Lisibilité Extrême',
  'react.listenAudio': 'Écouter Consignes',
  'react.stopAudio': 'Arrêter Voix',
  'react.whatToDoNow': 'QUE FAIRE MAINTENANT ? (Triage 0-60s)',
  'react.countriesBadge': 'FR • CH • BE • LU',
  'react.crisisSimplified': 'Mode Crise Simplifié',
  'react.crisisSimplifiedDesc': '4 actions réflexes grand format (Confiner / Évacuer / Décontaminer / Appeler)',
  'react.openReflexScreen': 'Ouvrir l\'écran réflexe',
  'react.sixScenarios': '6 Scénarios P1',
  'react.radarPpi': 'Radar PPI',
  'react.officialWarning': 'ALERTE OFFICIELLE : Les consignes diffusées par la Préfecture et les services de secours (FR-Alert, radio locale de service public) prévalent TOUJOURS sur les guides pédagogiques.',
  'react.selectHazard': 'Sélectionnez la nature du danger pour afficher les réflexes immédiats :',
  'react.nuclearTitle': 'Nucléaire',
  'react.radiologicalTitle': 'Radiologique',
  'react.biologicalTitle': 'Biologique',
  'react.chemicalTitle': 'Chimique',
  'react.fullProtocol': 'Consulter le protocole complet',
  'react.immediateReflexes': 'RÉFLEXES IMMÉDIATS (0 - 15 MIN)',
  'react.vitalRule': 'RÈGLE VITALE :',
  'react.forbiddenActions': 'ACTIONS STRICTEMENT PROSCRITES :',
  'react.iodineBanner': 'Ne pas prendre d\'iode sans ordre préfectoral',
  'react.iodineConsult': 'Consulter la Fiche Iode Stable & Posologie',
  'react.allGuidesCatalog': 'Consulter le catalogue complet des guides',
  'react.traceabilityRegister': 'Consulter le Registre de Traçabilité & Sources Officielles (v2.4.1)',

  // -------------------------------------------------------------
  // MODE CRISE (CRISIS VIEW)
  // -------------------------------------------------------------
  'crisis.title': 'MODE CRISE IMMÉDIAT',
  'crisis.subtitle': 'Orientation Réflexe Sous Stress • 4 Gestes Vitaux',
  'crisis.exit': 'Quitter le mode crise',
  'crisis.btnConfine': '1. CONFINER',
  'crisis.btnConfineDesc': 'Pièce centrale close, couper VMC, aérer post-alerte',
  'crisis.btnEvacuate': '2. ÉVACUER',
  'crisis.btnEvacuateDesc': 'UNIQUEMENT sur ordre formel des autorités',
  'crisis.btnDecontam': '3. DÉCONTAMINER',
  'crisis.btnDecontamDesc': 'Déshabiller de haut en bas sans secouer, laver sans frotter',
  'crisis.btnCall': '4. APPELER LES SECOURS',
  'crisis.btnCallDesc': 'Numéros d\'urgence officiels (112, 18, 15, 144, 100)',
  'crisis.orderWarning': 'Les ordres de la Sécurité Civile priment en toutes circonstances.',

  // -------------------------------------------------------------
  // QUE FAIRE MAINTENANT ? (EMERGENCY REFLEX MODAL)
  // -------------------------------------------------------------
  'reflex.modalTitle': 'Que faire maintenant ?',
  'reflex.modalSubtitle': 'Triage Réflexe 0-60 secondes • Conduite de Sécurité Civile',
  'reflex.tabReflexes': '4 Réflexes Vitaux',
  'reflex.tabNumbers': 'Numéros d\'Urgence',
  'reflex.tabMessage': 'Message Type aux Secours',
  'reflex.close': 'Fermer le guide réflexe',
  'reflex.case1Title': 'J\'entends la sirène ou j\'ai reçu une alerte mobile',
  'reflex.case1Points': 'Abri immédiat dans le bâtiment en dur le plus proche. Fermer et calfeutrer fenêtres et VMC. Écouter la radio publique (France Bleu / RTS / RTBF). Ne pas saturer les lignes téléphoniques.',
  'reflex.case2Title': 'Odeur anormale, fumée dense ou picotements',
  'reflex.case2Points': 'Dégagement perpendiculaire au vent si en extérieur. Protection respiratoire par tissu humide sans friction. Ne pas descendre en cave (accumulation de gaz lourds).',
  'reflex.case3Title': 'Alerte nucléaire / Retombées radiologiques',
  'reflex.case3Points': 'Confinement au centre ou au sous-sol d\'un bâtiment dense (atténuation gamma). Verrou absolu sur l\'iode : JAMAIS sans ordre préfectoral formel. Proscription des légumes frais du potager et de l\'eau de citerne.',
  'reflex.case4Title': 'Personne contaminée ou aspergée',
  'reflex.case4Points': 'Déshabillage de haut en bas sans secouer (élimine 80 à 90% du toxique). Tamponnement doux au savon sans brosser la peau. Double ensachage hermétique des vêtements souillés à l\'extérieur.',
  'reflex.messageScriptTitle': 'Trame d\'appel aux services de secours (112 / 18 / 15 / 144)',
  'reflex.scriptWho': '1. QUI : Mon identité et numéro de rappel.',
  'reflex.scriptWhere': '2. OÙ : Adresse précise, commune, étage, repères.',
  'reflex.scriptWhat': '3. QUOI : Nature du danger constaté (odeur, nuage, alerte).',
  'reflex.scriptHowMany': '4. COMBIEN : Nombre d\'occupants et symptômes éventuels.',
  'reflex.scriptActions': '5. ACTIONS : Calfeutrage en cours, VMC coupée, pas d\'automédication.',

  // -------------------------------------------------------------
  // SUIS-JE PRÊT ? (READINESS VIEW)
  // -------------------------------------------------------------
  'readiness.title': 'Tableau de Bord de Préparation',
  'readiness.subtitle': 'Mesure objective et transparente de la résilience du foyer',
  'readiness.scoreLabel': 'Score Global de Résilience',
  'readiness.points': 'pts',
  'readiness.hypothesesTitle': 'Hypothèses de Calcul Transparentes',
  'readiness.waterHypothesis': 'Eau potable : 3 Litres / personne / jour (2L hydratation + 1L hygiène minimale) + 0,5L / animal.',
  'readiness.foodHypothesis': 'Alimentation : 2 000 kcal / jour / adulte sans cuisson requise en cas de rupture gaz/électricité.',
  'readiness.householdBreakdownTitle': 'Besoins Calculés du Foyer',
  'readiness.missingDataTitle': 'Données Manquantes & Estimations',
  'readiness.topThreeTitle': 'Les 3 Actions les Plus Utiles Ensuite',
  'readiness.pointsGain': 'Gain estimé',
  'readiness.pillarsTitle': 'Les 5 Piliers de Résilience Civile',
  'readiness.pillarWater': 'Réserves Vitales (Eau & Alimentation)',
  'readiness.pillarEnergy': 'Énergie, Éclairage & Communication d\'Alerte',
  'readiness.pillarHealth': 'Santé, Hygiène & Besoins Spécifiques',
  'readiness.pillarPlan': 'Plan Familial & Procédures de Repli',
  'readiness.pillarLogistics': 'Vigilance Logistique & Maintenance',
  'readiness.modifyHousehold': 'Modifier les paramètres du foyer',

  // -------------------------------------------------------------
  // DOSSIER PERSONNEL DE SECOURS
  // -------------------------------------------------------------
  'dossier.title': 'Dossier Personnel de Secours',
  'dossier.subtitle': 'Fiche imprimable d\'urgence avec sélection granulaire',
  'dossier.privacyWarning': 'Confidentialité absolue : Vos données personnelles et médicales restent strictement stockées sur votre appareil. Elles ne sont jamais transmises à des serveurs distants ni incluses dans les QR codes partagés.',
  'dossier.selectSections': 'Sélectionnez les rubriques à inclure sur la fiche :',
  'dossier.sectionContacts': 'Contacts prioritaires (proches et relais hors-zone)',
  'dossier.sectionAssembly': 'Points de rassemblement familiaux',
  'dossier.sectionSpecific': 'Besoins d\'assistance & vulnérabilités spécifiques',
  'dossier.sectionMedical': 'Informations médicales vitales (traitements, allergies, groupe sanguin)',
  'dossier.printBtn': 'Imprimer la Fiche de Secours (A4 / Fiche de poche)',

  // -------------------------------------------------------------
  // MODE FORMATEUR
  // -------------------------------------------------------------
  'trainer.title': 'Mode Formateur & Exercices Collectifs',
  'trainer.subtitle': 'Animation d\'ateliers civiques et simulation de crise sans serveur',
  'trainer.selectScenario': 'Choisir un scénario d\'exercice :',
  'trainer.pedagogicalGoals': 'Objectifs pédagogiques de la séance :',
  'trainer.fatalTraps': 'Pièges mortels à déconstruire en débriefing :',
  'trainer.startDrill': 'Lancer l\'exercice chronométré',
  'trainer.printDebrief': 'Imprimer la fiche de bilan pédagogique',

  // -------------------------------------------------------------
  // CARTE & PÉRIMÈTRES HORS-LIGNE
  // -------------------------------------------------------------
  'carte.title': 'Carte Hors-Ligne des Périmètres',
  'carte.subtitle': 'Base autonome des 19 CNPE nucléaires et 22 plateformes Seveso Seuil Haut.',
  'carte.refPosition': 'Position de référence',
  'carte.gpsLocal': 'GPS Local',
  'carte.radarMode': 'Radar Concentrique (50 km)',
  'carte.franceMode': 'Carte Nationale (41 Sites)',
  'carte.inReflex': 'Zone Réflexe Immédiate (< 5 km)',
  'carte.inPpi': 'Périmètre PPI',
  'carte.inVigilance': 'Zone de Vigilance (50 km)',
  'carte.outPpi': 'Hors Périmètre',

  // -------------------------------------------------------------
  // GÉORISQUES & RISQUES LOCAUX
  // -------------------------------------------------------------
  'georisques.title': 'Diagnostic Territorial des Risques',
  'georisques.subtitle': 'Consultation des arrêtés préfectoraux, PPRT et sites industriels.',
  'georisques.freshnessTitle': 'État de Fraîcheur des Données',
  'georisques.originLive': 'Flux Officiel Direct Géorisques',
  'georisques.originCache': 'Cache Local Sauvegardé',
  'georisques.originPreload': 'Jeu de Données Préchargé',
  'georisques.originNone': 'Non Synchronisé',
  'georisques.searchCommune': 'Rechercher une commune par nom ou code postal...',
  'georisques.inspectSources': 'Consulter les sources officielles',

  // -------------------------------------------------------------
  // PARAMÈTRES & SYSTÈME
  // -------------------------------------------------------------
  'settings.title': 'Paramètres & Données',
  'settings.subtitle': 'Gestion souveraine de votre stockage local et affichage.',
  'settings.languageSection': 'Langue de l\'application',
  'settings.langFr': 'Français (French)',
  'settings.langEn': 'English (Anglais)',
  'settings.themeSection': 'Thème Visuel',
  'settings.textSizeSection': 'Taille du Texte',
  'settings.backupSection': 'Sauvegarde & Restauration Locale',
  'settings.exportBackup': 'Télécharger la sauvegarde complète (JSON)',
  'settings.restoreBackup': 'Restaurer une sauvegarde (JSON)',
  'settings.wipeSection': 'Zone de Danger',
  'settings.wipeBtn': 'Purger toutes les données locales',

  // -------------------------------------------------------------
  // ENCYCLOPÉDIE & GLOSSAIRE
  // -------------------------------------------------------------
  'encyclo.title': 'Encyclopédie & Glossaire NRBC',
  'encyclo.subtitle': 'Histoire, doctrines géopolitiques, arsenal technologique et dictionnaire des termes.',
  'encyclo.tabGlossary': 'Glossaire A-Z',
  'encyclo.tabHistory': 'Histoire & Origines',
  'encyclo.tabDoctrines': 'Doctrines & Pays',
  'encyclo.tabTools': 'Outils & Technologies',
  'encyclo.searchPlaceholder': 'Rechercher un terme, acronyme (Sarin, ALARA, Sievert, MOPP, CMIC)...',
  'encyclo.termsCount': 'termes répertoriés',
  'encyclo.fullDefinition': 'Définition complète :',
  'encyclo.contextApplication': 'Contexte d\'application & Réalité terrain :',
  'encyclo.historicalOrigin': 'Origine historique :',
  'encyclo.seeAlso': 'Voir aussi :',

  // -------------------------------------------------------------
  // VISITE GUIDÉE & DÉCOUVERTE AUTOMATIQUE
  // -------------------------------------------------------------
  'tour.startTour': 'Visite Guidée Automatique',
  'tour.startTourDesc': 'Découvrir progressivement toutes les fonctionnalités de l\'application.',
  'tour.menuButton': 'Visite Guidée (Découverte)',
  'tour.homePrompt': 'Découvrir NRBCOR en visite automatique',
  'tour.pause': 'Pause',
  'tour.resume': 'Continuer',
  'tour.previous': 'Précédent',
  'tour.next': 'Suivant',
  'tour.quit': 'Quitter',
  'tour.step': 'Étape',
  'tour.of': 'sur',
  'tour.completedTitle': 'Visite Guidée Terminée',
  'tour.completedDesc': 'Vous disposez désormais de tous les repères pour utiliser NRBCOR en autonomie.',
  'tour.finishBtn': 'Accéder à l\'application',
  'tour.restartBtn': 'Recommencer la visite'
};

export const FR_TRANSLATIONS = fr;

export type TranslationDictionary = typeof fr;
