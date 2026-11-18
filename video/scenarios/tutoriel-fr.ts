import { defineScenario, type RuntimeStep } from '@nouhailler/video-studio';

export default defineScenario<RuntimeStep>({
  id: 'tutoriel-fr',
  video: {
    title: 'NRBCOR — Tutoriel complet de l’application citoyenne de préparation aux risques NRBC',
    description:
      'Découverte guidée de NRBCOR : tableau de bord de résilience, Mode Crise, guides réflexes, Kit 72h, inventaire, plan familial hors ligne, radar PPI, mode formateur et installation PWA.',
    language: 'fr',
    voiceEnabled: true,
    resolution: { width: 1920, height: 1080 },
    fps: 30,
    clock: '2026-10-14T10:00:00+02:00',
    location: { city: 'Lyon', lat: 45.7578, lng: 4.8606 },
    firstChapter: 'Découverte & Tableau de bord',
    intro: {
      eyebrow: 'Protection civile & résilience citoyenne',
      title: 'NRBCOR',
      tagline: 'Anticiper les risques. Préparer ses proches. Savoir réagir.',
      narration:
        'Bienvenue dans ce tutoriel complet de NRBCOR, l’application citoyenne de préparation et de protection face aux risques nucléaires, radiologiques, biologiques et chimiques.',
    },
    outro: {
      eyebrow: '100 % hors ligne & zéro serveur',
      title: 'Préparez votre foyer dès aujourd’hui',
      bullets: [
        'Mode Crise & consignes vitales accessibles sans réseau',
        'Kit 72h, calculateurs d’eau potable & d’iode stable',
        'Plan familial chiffré par QR Code & Radar PPI',
      ],
      links: [
        { label: 'Application web', url: 'https://nrbcor.pages.dev' },
        { label: 'Code source GitHub', url: 'https://github.com/nouhailler/NRBCOR' },
      ],
      narration:
        'Anticiper, préparer ses proches et savoir réagir : NRBCOR reste disponible à tout moment, même sans réseau. Essayez l’application sur nrbcor.pages.dev et préparez votre foyer dès aujourd’hui.',
    },
  },
  scenario: {
    name: 'tutoriel-fr',
    label: 'Tutoriel complet NRBCOR (FR)',
    steps: [
      // ==================== CHAPITRE 1 — Découverte & Tableau de bord ====================
      {
        type: 'highlight',
        target: 'home-status-badges',
        narrate:
          'Conçue pour fonctionner à cent pour cent hors connexion et sans serveur, NRBCOR affiche dès l’accueil son état hors ligne et vos badges de profil.',
        video: { zoom: 1.1, readingPause: 600 },
      },
      {
        type: 'highlight',
        target: 'home-urgent-card',
        narrate:
          'En priorité absolue, la carte Urgence vitale donne un accès direct au Mode Crise, aux réflexes immédiats et au Radar des périmètres.',
        video: { zoom: 1.15, readingPause: 600 },
      },
      {
        type: 'highlight',
        target: 'home-score-card',
        narrate:
          'Juste en dessous, la jauge globale affiche votre niveau de préparation sur cent, calculé exclusivement à partir de vos données enregistrées sur l’appareil.',
        video: { zoom: 1.18, readingPause: 600 },
      },
      {
        type: 'highlight',
        target: 'home-indicators-grid',
        narrate:
          'Les quatre indicateurs synthétisent votre progression en temps réel : avancement du Kit soixante-douze heures, tâches du Plan familial, alertes de péremption et actions recommandées.',
        video: { zoom: 1.12, readingPause: 600 },
      },
      {
        type: 'highlight',
        target: 'home-cbrn-cards',
        narrate:
          'Enfin, les raccourcis NRBC permettent d’ouvrir en un geste chaque fiche de conduite à tenir selon la nature du danger.',
        video: { zoom: 1.12, readingPause: 500 },
      },

      // ==================== CHAPITRE 2 — Réagir dans l'urgence & Mode Crise ====================
      {
        type: 'navigate',
        target: 'nav-reagir',
        narrate:
          'En situation d’alerte, l’onglet Réagir centralise les premiers gestes de sauvegarde et le triage zéro à soixante secondes.',
        video: {
          chapter: 'Réagir dans l’urgence & Mode Crise',
          transition: 'fade',
          readingPause: 600,
        },
      },
      {
        type: 'click',
        target: 'reagir-stress-btn',
        narrate:
          'D’un simple toucher, le Mode Lisibilité Extrême bascule l’interface en contraste maximal pour faciliter la lecture sous stress.',
        video: { zoom: 1.15, readingPause: 700 },
      },
      {
        type: 'click',
        target: 'reagir-stress-btn',
        video: { narration: false, readingPause: 300 },
      },
      {
        type: 'highlight',
        target: 'reagir-speech-btn',
        narrate:
          'Une synthèse vocale intégrée permet aussi d’écouter les consignes vitales mains libres pendant la mise à l’abri.',
        video: { zoom: 1.15, readingPause: 500 },
      },
      {
        type: 'highlight',
        target: 'reagir-reflex-grid',
        narrate:
          'Les quatre parcours réflexes détaillent les numéros d’urgence, le confinement en dur et l’orientation par type de menace.',
        video: { readingPause: 600 },
      },
      {
        type: 'navigate',
        target: 'reagir-mode-crise-btn',
        narrate:
          'Pour l’action pure, ouvrons le Mode Crise sombre à très gros boutons.',
        video: { readingPause: 700 },
      },
      {
        type: 'click',
        target: 'crise-scenario-chimique',
        narrate:
          'Sans retarder le confinement, on peut adapter le scénario sur Chimique pour une fuite industrielle Seveso.',
        video: { zoom: 1.16, readingPause: 500 },
      },
      {
        type: 'click',
        target: 'crise-scenario-nucleaire',
        narrate:
          'Ou sur Nucléaire, qui rappelle qu’aucun comprimé d’iode ne doit être pris sans ordre formel du Préfet.',
        video: { zoom: 1.16, readingPause: 600 },
      },
      {
        type: 'click',
        target: 'crise-action-decon',
        narrate:
          'Les quatre volets guident pour confiner, évacuer sur ordre, appeler les secours ou lancer une décontamination d’urgence.',
        video: { zoom: 1.14, readingPause: 600 },
      },
      {
        type: 'click',
        target: 'crise-decon-timer-start',
        narrate:
          'On démarre ici le minuteur officiel de rinçage de quinze minutes à l’eau tiède sans frotter.',
        video: { zoom: 1.2, readingPause: 600 },
      },
      {
        type: 'click',
        target: 'crise-torch-btn',
        narrate:
          'Et en cas de coupure électrique, un bouton allume l’écran blanc comme lampe de secours sans bougie.',
        video: { zoom: 1.18, readingPause: 600 },
      },
      {
        type: 'click',
        target: 'crise-torch-close-btn',
        video: { narration: false, readingPause: 350 },
      },
      {
        type: 'navigate',
        target: 'crise-quit-btn',
        video: { narration: false, readingPause: 400 },
      },

      // ==================== CHAPITRE 3 — Guides réflexes & Encyclopédie NRBC ====================
      {
        type: 'navigate',
        target: 'nav-guides',
        narrate:
          'L’onglet Guides réunit tout le corpus documentaire embarqué hors ligne, y compris le classeur papier PDF prêt à imprimer.',
        video: {
          chapter: 'Guides réflexes & Encyclopédie NRBC',
          transition: 'fade',
          readingPause: 600,
        },
      },
      {
        type: 'click',
        target: 'guides-filter-n',
        narrate:
          'On filtre facilement les protocoles majeurs par catégorie de menace.',
        video: { zoom: 1.16, readingPause: 550 },
      },
      {
        type: 'click',
        target: 'guides-filter-all',
        video: { narration: false, readingPause: 300 },
      },
      {
        type: 'navigate',
        target: 'guides-card-iode',
        narrate:
          'Ouvrons la fiche pratique sur l’iode stable et son calculateur posologique officiel.',
        video: { readingPause: 700 },
      },
      {
        type: 'click',
        target: 'iode-profile-enfant',
        narrate:
          'En choisissant le profil Enfant de trois à douze ans, le calculateur indique la dose théorique d’un comprimé à soixante-cinq milligrammes, toujours sur ordre préfectoral.',
        video: { zoom: 1.16, readingPause: 750 },
      },
      {
        type: 'navigate',
        target: 'iode-back-btn',
        video: { narration: false, readingPause: 350 },
      },
      {
        type: 'navigate',
        target: 'guides-encyclo-glossaire-btn',
        narrate:
          'L’Encyclopédie NRBC complète cet apprentissage avec un glossaire alphabétique, une frise historique et les doctrines comparées.',
        video: { readingPause: 700 },
      },
      {
        type: 'type',
        target: 'encyclo-search-input',
        text: 'ALARA',
        narrate:
          'Une recherche instantanée retrouve par exemple le principe de radioprotection ALARA.',
        video: { zoom: 1.15, readingPause: 650 },
      },
      {
        type: 'click',
        target: 'encyclo-tab-doctrines',
        narrate:
          'Et l’onglet Doctrines compare l’organisation de la protection civile en France, Suisse et à l’international.',
        video: { zoom: 1.15, readingPause: 700 },
      },
      {
        type: 'navigate',
        target: 'encyclo-back-btn',
        video: { narration: false, readingPause: 350 },
      },

      // ==================== CHAPITRE 4 — Préparation du foyer, Kit 72h & Inventaire ====================
      {
        type: 'navigate',
        target: 'nav-preparation',
        narrate:
          'Passons à l’onglet Préparation, qui s’ouvre sur le tableau de bord Suis-je prêt.',
        video: {
          chapter: 'Préparation du foyer, Kit 72h & Inventaire',
          transition: 'fade',
          readingPause: 650,
        },
      },
      {
        type: 'highlight',
        target: 'prep-score-hero',
        narrate:
          'Il décompose le score sur cinq piliers transparents, sans aucune promesse irréaliste.',
        video: { zoom: 1.15, readingPause: 600 },
      },
      {
        type: 'highlight',
        target: 'prep-autonomy-grid',
        narrate:
          'Quatre jauges mesurent votre autonomie réelle en eau potable, alimentation sans cuisson, éclairage et énergie radio.',
        video: { zoom: 1.12, readingPause: 650 },
      },
      {
        type: 'highlight',
        target: 'prep-top3-actions',
        narrate:
          'Le moteur identifie ensuite le Top trois des actions à plus fort impact pour votre foyer.',
        video: { zoom: 1.12, readingPause: 600 },
      },
      {
        type: 'click',
        target: 'prep-view-switch-kit',
        narrate:
          'Basculons maintenant vers le Kit soixante-douze heures détaillé.',
        video: { zoom: 1.15, readingPause: 600 },
      },
      {
        type: 'highlight',
        target: 'prep-kit-calculator',
        narrate:
          'Le calculateur ajuste automatiquement les litres d’eau à raison de trois litres par jour et par personne.',
        video: { zoom: 1.15, readingPause: 600 },
      },
      {
        type: 'click',
        target: 'prep-kit-item-k1',
        narrate:
          'Chaque article coché met immédiatement à jour la barre d’état de préparation.',
        video: { zoom: 1.18, readingPause: 650 },
      },
      {
        type: 'navigate',
        target: 'prep-open-inventory-btn',
        narrate:
          'Pour suivre les stocks réels, ouvrons l’Inventaire intelligent.',
        video: { readingPause: 700 },
      },
      {
        type: 'highlight',
        target: 'inventory-balance-card',
        narrate:
          'On y voit les déficits éventuels ainsi que les alertes sur les produits proches de la péremption.',
        video: { zoom: 1.15, readingPause: 650 },
      },
      {
        type: 'click',
        target: 'inventory-shopping-btn',
        narrate:
          'Un bouton génère la liste de courses d’urgence prête à copier ou imprimer.',
        video: { zoom: 1.15, readingPause: 700 },
      },
      {
        type: 'click',
        target: 'inventory-shopping-close',
        video: { narration: false, readingPause: 300 },
      },
      {
        type: 'navigate',
        target: 'inventory-back-btn',
        video: { narration: false, readingPause: 350 },
      },

      // ==================== CHAPITRE 5 — Plan Familial, Risques Locaux & Entraînement ====================
      {
        type: 'navigate',
        target: 'nav-mon-plan',
        narrate:
          'L’onglet Mon Plan organise le plan familial de mise en sûreté en stockage zéro serveur.',
        video: {
          chapter: 'Plan Familial, Risques Locaux & Entraînement',
          transition: 'fade',
          readingPause: 600,
        },
      },
      {
        type: 'click',
        target: 'plan-discreet-btn',
        narrate:
          'Le mode discret masque instantanément noms et numéros sur l’écran.',
        video: { zoom: 1.16, readingPause: 650 },
      },
      {
        type: 'click',
        target: 'plan-discreet-btn',
        video: { narration: false, readingPause: 300 },
      },
      {
        type: 'highlight',
        target: 'plan-assembly-section',
        narrate:
          'On y regroupe les membres du foyer, les points de ralliement et le contact relais hors zone à plus de cent kilomètres.',
        video: { zoom: 1.12, readingPause: 650 },
      },
      {
        type: 'click',
        target: 'plan-qr-btn',
        narrate:
          'Ce plan complet se transfère à un proche par QR Code chiffré localement, sans réseau ni cloud.',
        video: { zoom: 1.15, readingPause: 700 },
      },
      {
        type: 'click',
        target: 'plan-qr-close-btn',
        video: { narration: false, readingPause: 300 },
      },
      {
        type: 'click',
        target: 'header-menu-btn',
        video: { narration: false, readingPause: 400 },
      },
      {
        type: 'navigate',
        target: 'drawer-radar-btn',
        narrate:
          'Depuis le menu, le Radar PPI calcule hors ligne votre distance aux centrales nucléaires et sites Seveso.',
        video: { readingPause: 700 },
      },
      {
        type: 'click',
        target: 'perimetres-view-france',
        narrate:
          'On peut aussi afficher la carte vectorielle des quarante et un sites nationaux référencés.',
        video: { zoom: 1.15, readingPause: 700 },
      },
      {
        type: 'navigate',
        target: 'perimetres-back-btn',
        video: { narration: false, readingPause: 350 },
      },
      {
        type: 'click',
        target: 'header-menu-btn',
        video: { narration: false, readingPause: 400 },
      },
      {
        type: 'navigate',
        target: 'drawer-formation-btn',
        narrate:
          'La section Entraînement propose des mises en situation interactives et le simulateur sonore de sirène RNA.',
        video: { readingPause: 700 },
      },
      {
        type: 'click',
        target: 'formation-trainer-toggle',
        narrate:
          'Les formateurs disposent d’un mode dédié affichant fiches pédagogiques et console d’exercice collectif.',
        video: { zoom: 1.18, readingPause: 700 },
      },
      {
        type: 'navigate',
        target: 'formation-back-btn',
        video: { narration: false, readingPause: 350 },
      },

      // ==================== CHAPITRE 6 — Réglages, Sauvegarde & Installation PWA ====================
      {
        type: 'click',
        target: 'header-menu-btn',
        video: {
          chapter: 'Réglages, Sauvegarde & Installation PWA',
          transition: 'fade',
          narration: false,
          readingPause: 400,
        },
      },
      {
        type: 'navigate',
        target: 'drawer-settings-btn',
        narrate:
          'Dans les Paramètres, changez de langue entre français et anglais ou adaptez le profil Simplifié vers Expert.',
        video: { readingPause: 650 },
      },
      {
        type: 'click',
        target: 'settings-theme-dark',
        narrate:
          'Le thème sombre économise la batterie en confinement prolongé, et une exportation JSON permet de sauvegarder tout votre dossier.',
        video: { zoom: 1.15, readingPause: 700 },
      },
      {
        type: 'click',
        target: 'settings-theme-light',
        video: { narration: false, readingPause: 350 },
      },
      {
        type: 'navigate',
        target: 'settings-back-btn',
        video: { narration: false, readingPause: 350 },
      },
      {
        type: 'click',
        target: 'header-menu-btn',
        video: { narration: false, readingPause: 400 },
      },
      {
        type: 'navigate',
        target: 'drawer-system-btn',
        narrate:
          'Enfin, le diagnostic système vérifie en un clic que tout le corpus est scellé hors ligne pour installer l’application PWA.',
        video: { readingPause: 650 },
      },
      {
        type: 'click',
        target: 'system-audit-btn',
        video: { zoom: 1.15, narration: false, readingPause: 800 },
      },
      {
        type: 'navigate',
        target: 'system-back-btn',
        video: { narration: false, readingPause: 350 },
      },
      {
        type: 'navigate',
        target: 'nav-accueil',
        video: { narration: false, readingPause: 600 },
      },
    ],
  },
});
