import { defineScenario, type RuntimeStep } from '@nouhailler/video-studio';

export const tutorielFr = defineScenario<RuntimeStep>({
  id: 'tutoriel-fr',
  title: 'NRBCOR — Tutoriel complet de l’application citoyenne de préparation aux risques NRBC',
  lang: 'fr',
  steps: [
    // ==================== INTRO (~15s) ====================
    {
      highlight: 'home-status-badges',
      zoom: 1.1,
      narrate:
        'Bienvenue dans ce tutoriel complet de NRBCOR, l’application citoyenne de préparation et de protection face aux risques nucléaires, radiologiques, biologiques et chimiques. Conçue pour fonctionner à cent pour cent hors connexion et sans serveur, elle rassemble protocoles officiels, calculateurs vitaux et outils d’organisation familiale.',
      readingPause: 800,
    },

    // ==================== CHAPITRE 1 — Découverte & Tableau de bord (~35s) ====================
    {
      chapter: {
        title: 'Chapitre 1',
        subtitle: 'Découverte & Tableau de bord',
      },
      transition: 'fade',
    },
    {
      highlight: 'home-urgent-card',
      zoom: 1.15,
      narrate:
        'Sur l’écran d’accueil, le bandeau supérieur confirme immédiatement que l’application est prête hors ligne. En priorité absolue, la carte Urgence vitale donne un accès direct au Mode Crise, aux réflexes immédiats et au Radar des périmètres.',
      readingPause: 600,
    },
    {
      highlight: 'home-score-card',
      zoom: 1.18,
      narrate:
        'Juste en dessous, la jauge globale affiche votre niveau de préparation sur cent, calculé exclusivement à partir de vos données enregistrées sur l’appareil.',
      readingPause: 600,
    },
    {
      highlight: 'home-indicators-grid',
      zoom: 1.12,
      narrate:
        'Les quatre indicateurs synthétisent votre progression en temps réel : avancement du Kit soixante-douze heures, tâches du Plan familial, alertes de péremption et actions recommandées.',
      readingPause: 600,
    },
    {
      highlight: 'home-cbrn-cards',
      zoom: 1.12,
      narrate:
        'Enfin, les raccourcis N R B C permettent d’ouvrir en un geste chaque fiche de conduite à tenir selon la nature du danger.',
      readingPause: 500,
    },

    // ==================== CHAPITRE 2 — Réagir dans l'urgence & Mode Crise (~45s) ====================
    {
      chapter: {
        title: 'Chapitre 2',
        subtitle: 'Réagir dans l’urgence & Mode Crise',
      },
      transition: 'fade',
    },
    {
      action: 'navigate',
      target: 'nav-reagir',
      narrate:
        'En situation d’alerte, l’onglet Réagir centralise les premiers gestes de sauvegarde et le triage zéro à soixante secondes.',
      readingPause: 600,
    },
    {
      action: 'click',
      target: 'reagir-stress-btn',
      zoom: 1.15,
      narrate:
        'D’un simple toucher, le Mode Lisibilité Extrême bascule l’interface en contraste maximal pour faciliter la lecture sous stress.',
      readingPause: 700,
    },
    {
      action: 'click',
      target: 'reagir-stress-btn',
      readingPause: 350,
    },
    {
      highlight: 'reagir-speech-btn',
      zoom: 1.15,
      narrate:
        'Une synthèse vocale intégrée permet aussi d’écouter les consignes vitales mains libres pendant la mise à l’abri.',
      readingPause: 500,
    },
    {
      highlight: 'reagir-reflex-grid',
      narrate:
        'Les quatre parcours réflexes détaillent les numéros d’urgence, le confinement en dur et l’orientation par type de menace.',
      readingPause: 600,
    },
    {
      action: 'navigate',
      target: 'reagir-mode-crise-btn',
      narrate:
        'Pour l’action pure, ouvrons le Mode Crise sombre à très gros boutons.',
      readingPause: 700,
    },
    {
      action: 'click',
      target: 'crise-scenario-chimique',
      zoom: 1.16,
      narrate:
        'Sans retarder le confinement, on peut adapter le scénario sur Chimique pour une fuite industrielle Seveso.',
      readingPause: 500,
    },
    {
      action: 'click',
      target: 'crise-scenario-nucleaire',
      zoom: 1.16,
      narrate:
        'Ou sur Nucléaire, qui rappelle qu’aucun comprimé d’iode ne doit être pris sans ordre formel du Préfet.',
      readingPause: 600,
    },
    {
      action: 'click',
      target: 'crise-action-decon',
      zoom: 1.14,
      narrate:
        'Les quatre volets guident pour confiner, évacuer sur ordre, appeler les secours ou lancer une décontamination d’urgence.',
      readingPause: 600,
    },
    {
      action: 'click',
      target: 'crise-decon-timer-start',
      zoom: 1.2,
      narrate:
        'On démarre ici le minuteur officiel de rinçage de quinze minutes à l’eau tiède sans frotter.',
      readingPause: 600,
    },
    {
      action: 'click',
      target: 'crise-torch-btn',
      zoom: 1.18,
      narrate:
        'Et en cas de coupure électrique, un bouton allume l’écran blanc comme lampe de secours sans bougie.',
      readingPause: 600,
    },
    {
      action: 'click',
      target: 'crise-torch-close-btn',
      readingPause: 350,
    },
    {
      action: 'navigate',
      target: 'crise-quit-btn',
      readingPause: 450,
    },

    // ==================== CHAPITRE 3 — Guides réflexes & Encyclopédie NRBC (~40s) ====================
    {
      chapter: {
        title: 'Chapitre 3',
        subtitle: 'Guides réflexes & Encyclopédie NRBC',
      },
      transition: 'fade',
    },
    {
      action: 'navigate',
      target: 'nav-guides',
      narrate:
        'L’onglet Guides réunit tout le corpus documentaire embarqué hors ligne, y compris le classeur papier P D F prêt à imprimer.',
      readingPause: 600,
    },
    {
      action: 'click',
      target: 'guides-filter-n',
      zoom: 1.16,
      narrate:
        'On filtre facilement les protocoles majeurs par catégorie de menace.',
      readingPause: 550,
    },
    {
      action: 'click',
      target: 'guides-filter-all',
      readingPause: 350,
    },
    {
      action: 'navigate',
      target: 'guides-card-iode',
      narrate:
        'Ouvrons la fiche pratique sur l’iode stable et son calculateur posologique officiel.',
      readingPause: 700,
    },
    {
      action: 'click',
      target: 'iode-profile-enfant',
      zoom: 1.16,
      narrate:
        'En choisissant le profil Enfant de trois à douze ans, le calculateur indique aussitôt la dose théorique d’un comprimé à soixante-cinq milligrammes, toujours subordonnée à l’ordre préfectoral.',
      readingPause: 750,
    },
    {
      action: 'navigate',
      target: 'iode-back-btn',
      readingPause: 400,
    },
    {
      action: 'navigate',
      target: 'guides-encyclo-glossaire-btn',
      narrate:
        'L’Encyclopédie N R B C complète cet apprentissage avec un glossaire alphabétique, une frise historique et les doctrines comparées.',
      readingPause: 700,
    },
    {
      action: 'type',
      target: 'encyclo-search-input',
      value: 'ALARA',
      zoom: 1.15,
      narrate:
        'Une recherche instantanée retrouve par exemple le principe de radioprotection ALARA.',
      readingPause: 650,
    },
    {
      action: 'click',
      target: 'encyclo-tab-doctrines',
      zoom: 1.15,
      narrate:
        'Et l’onglet Doctrines compare l’organisation de la protection civile en France, Suisse et à l’international.',
      readingPause: 700,
    },
    {
      action: 'navigate',
      target: 'encyclo-back-btn',
      readingPause: 400,
    },

    // ==================== CHAPITRE 4 — Préparation du foyer, Kit 72h & Inventaire (~45s) ====================
    {
      chapter: {
        title: 'Chapitre 4',
        subtitle: 'Préparation du foyer, Kit 72h & Inventaire',
      },
      transition: 'fade',
    },
    {
      action: 'navigate',
      target: 'nav-preparation',
      narrate:
        'Passons à l’onglet Préparation, qui s’ouvre sur le tableau de bord Suis-je prêt.',
      readingPause: 650,
    },
    {
      highlight: 'prep-score-hero',
      zoom: 1.15,
      narrate:
        'Il décompose le score sur cinq piliers transparents, sans aucune promesse irréaliste.',
      readingPause: 600,
    },
    {
      highlight: 'prep-autonomy-grid',
      zoom: 1.12,
      narrate:
        'Quatre jauges mesurent votre autonomie réelle en eau potable, alimentation sans cuisson, éclairage et énergie radio.',
      readingPause: 650,
    },
    {
      highlight: 'prep-top3-actions',
      zoom: 1.12,
      narrate:
        'Le moteur identifie ensuite le Top trois des actions à plus fort impact pour votre foyer.',
      readingPause: 600,
    },
    {
      action: 'click',
      target: 'prep-view-switch-kit',
      zoom: 1.15,
      narrate:
        'Basculons maintenant vers le Kit soixante-douze heures détaillé.',
      readingPause: 600,
    },
    {
      highlight: 'prep-kit-calculator',
      zoom: 1.15,
      narrate:
        'Le calculateur ajuste automatiquement les litres d’eau à raison de trois litres par jour et par personne.',
      readingPause: 600,
    },
    {
      action: 'click',
      target: 'prep-kit-item-k1',
      zoom: 1.18,
      narrate:
        'Chaque article coché met immédiatement à jour la barre d’état de préparation.',
      readingPause: 650,
    },
    {
      action: 'navigate',
      target: 'prep-open-inventory-btn',
      narrate:
        'Pour suivre les stocks réels, ouvrons l’Inventaire intelligent.',
      readingPause: 700,
    },
    {
      highlight: 'inventory-balance-card',
      zoom: 1.15,
      narrate:
        'On y voit les déficits éventuels ainsi que les alertes sur les produits proches de la péremption.',
      readingPause: 650,
    },
    {
      action: 'click',
      target: 'inventory-shopping-btn',
      zoom: 1.15,
      narrate:
        'Un bouton génère la liste de courses d’urgence prête à copier ou imprimer.',
      readingPause: 700,
    },
    {
      action: 'click',
      target: 'inventory-shopping-close',
      readingPause: 350,
    },
    {
      action: 'navigate',
      target: 'inventory-back-btn',
      readingPause: 400,
    },

    // ==================== CHAPITRE 5 — Plan Familial, Risques Locaux & Entraînement (~45s) ====================
    {
      chapter: {
        title: 'Chapitre 5',
        subtitle: 'Plan Familial, Risques Locaux & Entraînement',
      },
      transition: 'fade',
    },
    {
      action: 'navigate',
      target: 'nav-mon-plan',
      narrate:
        'L’onglet Mon Plan organise le plan familial de mise en sûreté en stockage zéro serveur.',
      readingPause: 600,
    },
    {
      action: 'click',
      target: 'plan-discreet-btn',
      zoom: 1.16,
      narrate:
        'Le mode discret masque instantanément noms et numéros sur l’écran.',
      readingPause: 650,
    },
    {
      action: 'click',
      target: 'plan-discreet-btn',
      readingPause: 350,
    },
    {
      highlight: 'plan-assembly-section',
      zoom: 1.12,
      narrate:
        'On y regroupe les membres du foyer, les points de ralliement et le contact relais hors zone à plus de cent kilomètres.',
      readingPause: 650,
    },
    {
      action: 'click',
      target: 'plan-qr-btn',
      zoom: 1.15,
      narrate:
        'Ce plan complet se transfère à un proche par QR Code chiffré localement, sans réseau ni cloud.',
      readingPause: 700,
    },
    {
      action: 'click',
      target: 'plan-qr-close-btn',
      readingPause: 350,
    },
    {
      action: 'click',
      target: 'header-menu-btn',
      readingPause: 450,
    },
    {
      action: 'navigate',
      target: 'drawer-radar-btn',
      narrate:
        'Depuis le menu, le Radar P P I calcule hors ligne votre distance aux centrales nucléaires et sites Seveso.',
      readingPause: 700,
    },
    {
      action: 'click',
      target: 'perimetres-view-france',
      zoom: 1.15,
      narrate:
        'On peut aussi afficher la carte vectorielle des quarante et un sites nationaux référencés.',
      readingPause: 700,
    },
    {
      action: 'navigate',
      target: 'perimetres-back-btn',
      readingPause: 400,
    },
    {
      action: 'click',
      target: 'header-menu-btn',
      readingPause: 450,
    },
    {
      action: 'navigate',
      target: 'drawer-formation-btn',
      narrate:
        'La section Entraînement propose des mises en situation interactives et le simulateur sonore de sirène R N A.',
      readingPause: 700,
    },
    {
      action: 'click',
      target: 'formation-trainer-toggle',
      zoom: 1.18,
      narrate:
        'Les formateurs disposent d’un mode dédié affichant fiches pédagogiques et console d’exercice collectif.',
      readingPause: 700,
    },
    {
      action: 'navigate',
      target: 'formation-back-btn',
      readingPause: 400,
    },

    // ==================== CHAPITRE 6 — Réglages, Sauvegarde & Installation PWA (~30s) ====================
    {
      chapter: {
        title: 'Chapitre 6',
        subtitle: 'Réglages, Sauvegarde & Installation PWA',
      },
      transition: 'fade',
    },
    {
      action: 'click',
      target: 'header-menu-btn',
      readingPause: 450,
    },
    {
      action: 'navigate',
      target: 'drawer-settings-btn',
      narrate:
        'Dans les Paramètres, changez de langue entre français et anglais ou adaptez le profil Simplifié vers Expert.',
      readingPause: 650,
    },
    {
      action: 'click',
      target: 'settings-theme-dark',
      zoom: 1.15,
      narrate:
        'Le thème sombre économise la batterie en confinement prolongé, et une exportation JSON permet de sauvegarder tout votre dossier.',
      readingPause: 700,
    },
    {
      action: 'click',
      target: 'settings-theme-light',
      readingPause: 400,
    },
    {
      action: 'navigate',
      target: 'settings-back-btn',
      readingPause: 400,
    },
    {
      action: 'click',
      target: 'header-menu-btn',
      readingPause: 450,
    },
    {
      action: 'navigate',
      target: 'drawer-system-btn',
      narrate:
        'Enfin, le diagnostic système vérifie en un clic que tout le corpus est scellé hors ligne pour installer l’application P W A.',
      readingPause: 650,
    },
    {
      action: 'click',
      target: 'system-audit-btn',
      zoom: 1.15,
      readingPause: 800,
    },
    {
      action: 'navigate',
      target: 'system-back-btn',
      readingPause: 400,
    },

    // ==================== OUTRO (~15s) ====================
    {
      action: 'navigate',
      target: 'nav-accueil',
      narrate:
        'Anticiper, préparer ses proches et savoir réagir : NRBCOR reste disponible à tout moment, même sans réseau. Essayez l’application sur n r b c o r point pages point dev et préparez votre foyer dès aujourd’hui.',
      readingPause: 1200,
    },
  ],
});
