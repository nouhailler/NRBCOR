import React, { useState, useEffect } from 'react';
import { playRNASiren, stopSiren } from '../utils/sirenAudio';
import { triggerHaptic } from '../utils/haptics';

export interface DrillScenario {
  id: string;
  type: 'seveso' | 'nucleaire' | 'radiologique' | 'biologique' | 'cyber-hybride';
  title: string;
  subtitle: string;
  badge: string;
  badgeBg: string;
  context: string;
  initialTimeSec: number;
  essentialSteps: {
    id: number;
    text: string;
    points: number;
    timeHint: string;
  }[];
  dilemmas: {
    id: number;
    question: string;
    options: {
      id: string;
      label: string;
      pointsDelta: number;
      feedback: string;
      isTrap?: boolean;
    }[];
  }[];
}

export const DRILL_SCENARIOS: DrillScenario[] = [
  {
    id: 'drill-seveso',
    type: 'seveso',
    title: 'Alerte Seveso Seuil Haut : Nuage Toxique de Chlore',
    subtitle: 'Rupture de cuve industrielle sous le vent à 1,8 km de votre domicile',
    badge: 'CHIMIQUE • SEVESO SEUIL HAUT',
    badgeBg: 'bg-[#ba1a1a]',
    context: 'La sirène nationale retentit (son modulé 1 min 41 s). Une odeur piquante et suffocante est perceptible dans la rue. Le panache se déplace rapidement vers votre zone.',
    initialTimeSec: 180, // 3 min chrono d'adrénaline
    essentialSteps: [
      { id: 1, text: 'Rejoindre immédiatement une pièce fermée au cœur du bâtiment', points: 15, timeHint: '0-30s' },
      { id: 2, text: 'Couper la VMC, hottes et climatiseurs (disjoncteur tableau)', points: 15, timeHint: '0-60s' },
      { id: 3, text: 'Calfeutrer les aérations et bas de porte avec adhésif ou linge humide tassé', points: 15, timeHint: '0-90s' },
      { id: 4, text: 'Allumer la radio locale (France Bleu) sur piles ou récepteur secours', points: 15, timeHint: '0-120s' }
    ],
    dilemmas: [
      {
        id: 101,
        question: 'Dilemme 1 : Vos enfants sont à l’école primaire à 800 mètres. Que faites-vous ?',
        options: [
          {
            id: 'd1-a',
            label: 'Prendre ma voiture pour aller les chercher d’urgence',
            pointsDelta: -35,
            isTrap: true,
            feedback: 'PIÈGE MORTEL : Fuir en voiture vous expose au nuage toxique (habitacle perméable) et bloque les secours. Les écoles appliquent le PPMS et sont calfeutrées.'
          },
          {
            id: 'd1-b',
            label: 'Les laisser à l’école sous protection du Plan Particulier de Mise en Sûreté (PPMS)',
            pointsDelta: 20,
            feedback: 'EXCELLENT RÉFLEXE : Les enseignants calfeutrent l’école et protègent les élèves. Venir sur place compromettrait l’étanchéité de l’école.'
          }
        ]
      },
      {
        id: 102,
        question: 'Dilemme 2 : Un voisin paniqué frappe à la porte et vous propose un comprimé d’iode. Que faites-vous ?',
        options: [
          {
            id: 'd2-a',
            label: 'Avaler le comprimé d’iode immédiatement par précaution',
            pointsDelta: -30,
            isTrap: true,
            feedback: 'ERREUR GRAVE : L’iode stable est TOTALEMENT INOPÉRANT contre les rejets chimiques industriels (chlore, ammoniac). Risque d’intoxication thyroïdienne inutile.'
          },
          {
            id: 'd2-b',
            label: 'Refuser formellement : l’iode ne protège pas du risque chimique',
            pointsDelta: 20,
            feedback: 'PARFAIT : L’iode stable ne protège que la thyroïde contre l’iode 131 d’un réacteur nucléaire. Strictement inutile ici.'
          }
        ]
      }
    ]
  },
  {
    id: 'drill-nucleaire',
    type: 'nucleaire',
    title: 'Accident Réacteur Nucléaire : Panache Radioactif Immédiat',
    subtitle: 'Rejet atmosphérique majeur dans le périmètre PPI (Plan Particulier d’Intervention)',
    badge: 'NUCLÉAIRE • REJET VOLATIL',
    badgeBg: 'bg-[#001126]',
    context: 'Notification FR-Alert : Défaillance de confinement sur le CNPE voisin. Retombées d’aérosols radioactifs imminentes sous 15 minutes.',
    initialTimeSec: 240, // 4 min
    essentialSteps: [
      { id: 1, text: 'Gagner le sous-sol bétonné ou une pièce centrale entourée de maçonnerie dense', points: 15, timeHint: '0-45s' },
      { id: 2, text: 'Verrouiller fermement fenêtres et volets (premier écran contre le panache)', points: 15, timeHint: '0-90s' },
      { id: 3, text: 'Couper la ventilation mécanique et fermer les trappes de cheminée', points: 15, timeHint: '0-120s' },
      { id: 4, text: 'Rassembler les boîtes d’iode stable (sans les ouvrir) et le récepteur radio', points: 15, timeHint: '0-150s' }
    ],
    dilemmas: [
      {
        id: 201,
        question: 'Dilemme 1 : Quand devez-vous ingérer vos comprimés d’iodure de potassium (KI 65 mg) ?',
        options: [
          {
            id: 'd3-a',
            label: 'Dès maintenant, sans attendre, pour saturer la thyroïde avant le panache',
            pointsDelta: -30,
            isTrap: true,
            feedback: 'DANGEREUX : La prise prématurée fatigue la thyroïde et perd son effet protecteur si le panache arrive plus tard. Seul le Préfet fixe l’heure exacte de prise.'
          },
          {
            id: 'd3-b',
            label: 'Strictement et uniquement sur ordre explicite du Préfet (FR-Alert ou France Bleu)',
            pointsDelta: 20,
            feedback: 'DOCTRINE EXACTE : La prise d’iode est un acte médical d’urgence sous commandement préfectoral strict au timing exact du rejet.'
          }
        ]
      },
      {
        id: 202,
        question: 'Dilemme 2 : Vous avez soif. Que buvez-vous ?',
        options: [
          {
            id: 'd4-a',
            label: 'L’eau du robinet de la cuisine pour économiser les bouteilles',
            pointsDelta: -25,
            isTrap: true,
            feedback: 'RISQUÉ : En phase de passage d’un panache, les captages et châteaux d’eau peuvent être contaminés par des dépôts radioactifs.'
          },
          {
            id: 'd4-b',
            label: 'Exclusivement l’eau minérale en bouteille scellée du kit 72h',
            pointsDelta: 20,
            feedback: 'RÈGLE D’OR : Ne consommer que des réserves hermétiquement fermées avant le début de l’incident.'
          }
        ]
      }
    ]
  },
  {
    id: 'drill-radiologique',
    type: 'radiologique',
    title: 'Urgence Radiologique : Source Industrielle Perdue & Débris',
    subtitle: 'Chantier urbain : explosion et dispersion suspecte de matière radioactive (Classe 7)',
    badge: 'RADIOLOGIQUE • ALARA & DISPERSION',
    badgeBg: 'bg-[#7c2d12]',
    context: 'Une explosion accidentelle s’est produite sur un chantier. Des débris portent le symbole trifolium noir sur fond jaune (Classe 7). Vous étiez dans la rue à proximité.',
    initialTimeSec: 180,
    essentialSteps: [
      { id: 1, text: 'S’éloigner au plus vite perpendiculairement au vent (doctrine ALARA)', points: 15, timeHint: '0-30s' },
      { id: 2, text: 'Pénétrer dans le bâtiment en dur le plus proche et fermer les portes', points: 15, timeHint: '0-60s' },
      { id: 3, text: 'Procéder au déshabillage complet sans secouer les vêtements', points: 15, timeHint: '0-120s' },
      { id: 4, text: 'Douche tiède savonneuse très douce (sans jamais frotter ni brosser la peau)', points: 15, timeHint: '0-150s' }
    ],
    dilemmas: [
      {
        id: 301,
        question: 'Dilemme 1 : Pendant la douche de décontamination d’urgence, comment laver votre peau ?',
        options: [
          {
            id: 'd5-a',
            label: 'Frotter énergiquement avec un gant de crin pour décoller toutes les poussières',
            pointsDelta: -35,
            isTrap: true,
            feedback: 'DANGER : Frotter agressivement crée des microlésions cutanées qui font pénétrer les particules radioactives dans le sang (contamination interne grave).'
          },
          {
            id: 'd5-b',
            label: 'Savonnage très doux du bout des doigts à l’eau tiède sans aucune friction mécanique',
            pointsDelta: 20,
            feedback: 'PARFAIT : L’eau tiède et le savon doux émulsionnent les poussières sans ouvrir les pores ni léser la barrière épidermique.'
          }
        ]
      },
      {
        id: 302,
        question: 'Dilemme 2 : Un proche vous demande de prendre de l’iode stable pour une source de Césium-137. Réponse ?',
        options: [
          {
            id: 'd6-a',
            label: 'Prendre l’iode : cela protège contre tous les rayonnements radioactifs',
            pointsDelta: -30,
            isTrap: true,
            feedback: 'FAUX : L’iode stable ne protège QUE contre l’iode 131. Elle n’a strictement AUCUN effet sur le Césium-137, le Cobalt-60 ou l’Iridium-192.'
          },
          {
            id: 'd6-b',
            label: 'Refuser : l’iode n’a aucune efficacité contre le Césium ou les sources orphelines',
            pointsDelta: 20,
            feedback: 'RÉFLEXE EXPERT : L’iode stable ne protège que la thyroïde lors d’un accident de réacteur à fission.'
          }
        ]
      }
    ]
  },
  {
    id: 'drill-cyber-hybride',
    type: 'cyber-hybride',
    title: 'Attaque Cyber & Crise Hybride : Blackout + Alerte NRBC',
    subtitle: 'Coupure électrique générale, perte du réseau 4G/5G et émanation chimique simultanée',
    badge: 'HYBRIDE • BLACKOUT + NRBC',
    badgeBg: 'bg-[#6750a4]',
    context: 'Cyberattaque sur le réseau de transport électrique (RTE) entraînant un blackout massif. Par effet domino, les systèmes de ventilation et d’abattage d’une usine chimique proche s’arrêtent. Aucune 4G, coupure des pompes à eau, sirène RNA audible en ville.',
    initialTimeSec: 210, // 3 min 30 s
    essentialSteps: [
      { id: 1, text: 'Allumer immédiatement la radio analogique AM/FM à piles sur la fréquence France Bleu locale', points: 15, timeHint: '0-30s' },
      { id: 2, text: 'Gagner la pièce de confinement sans ascenseur et sans tenter d’évacuer en voiture', points: 15, timeHint: '0-60s' },
      { id: 3, text: 'Calfeutrer manuellement ouvertures, bas de portes et bouches d’aération avec adhésif ou linge humide', points: 15, timeHint: '0-100s' },
      { id: 4, text: 'Discipline stricte d’éclairage : lampes torches LED uniquement (INTERDICTION ABSOLUE de bougies/flammes)', points: 15, timeHint: '0-130s' }
    ],
    dilemmas: [
      {
        id: 401,
        question: 'Dilemme 1 : Le réseau mobile est saturé ("Aucun service"). Votre batterie est à 35%. Que faites-vous ?',
        options: [
          {
            id: 'd7-a',
            label: 'Composer en boucle les numéros d’urgence et laisser l’écran allumé en recherche réseau',
            pointsDelta: -30,
            isTrap: true,
            feedback: 'PIÈGE CRITIQUE : La recherche d’antenne-relais inexistante vide la batterie en moins de 45 minutes. En blackout, les lignes d’urgence sont saturées. Écoutez la radio publique.'
          },
          {
            id: 'd7-b',
            label: 'Activer le mode économie d’énergie maximal, couper Bluetooth/Wi-Fi et basculer sur la radio FM',
            pointsDelta: 20,
            feedback: 'RÉFLEXE EXEMPLAIRE : Préserver la batterie pour un éventuel SMS de crise ou repérage de fin d’alerte. La radio FM sur piles est l’unique vecteur résilient en blackout.'
          }
        ]
      },
      {
        id: 402,
        question: 'Dilemme 2 : Il fait nuit noire dans la pièce calfeutrée et la température baisse. Que faites-vous ?',
        options: [
          {
            id: 'd8-a',
            label: 'Allumer des bougies pour s’éclairer et réchauffer l’air ambiant',
            pointsDelta: -40,
            isTrap: true,
            feedback: 'DANGER MORTEL : Les bougies en pièce confinée calfeutrée consument l’oxygène vital, émettent du monoxyde de carbone (CO) et risquent d’enflammer d’éventuelles vapeurs toxiques ou solvants.'
          },
          {
            id: 'd8-b',
            label: 'Utiliser une lampe frontale/torche LED à faisceau doux et s’envelopper dans des couvertures de survie',
            pointsDelta: 20,
            feedback: 'EXCELLENT : Zéro consommation d’oxygène, aucun risque d’incendie ou d’explosion thermique. La couverture isolante préserve la chaleur corporelle.'
          }
        ]
      },
      {
        id: 403,
        question: 'Dilemme 3 : L’eau du robinet ne coule plus (surpresseurs à l’arrêt). Que faire des sanitaires ?',
        options: [
          {
            id: 'd9-a',
            label: 'Vider vos bouteilles d’eau minérale en réserve pour évacuer les WC',
            pointsDelta: -35,
            isTrap: true,
            feedback: 'GRAVE GASPILLAGE : L’eau potable en bouteille est réservée à l’hydratation vitale (3L/j) et aux soins d’urgence. Utilisez un sac poubelle étanche dans la cuvette pour les déjections.'
          },
          {
            id: 'd9-b',
            label: 'Interdire l’usage de l’eau potable pour les WC et utiliser des sacs étanches fermés hermétiquement',
            pointsDelta: 20,
            feedback: 'PARFAIT : Principe de résilience sous blackout : l’eau potable est un bien trop précieux pour être sacrifié dans les canalisations.'
          }
        ]
      }
    ]
  }
];

interface CrisisDrillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToGuides?: () => void;
}

export const CrisisDrillModal: React.FC<CrisisDrillModalProps> = ({
  isOpen,
  onClose,
  onGoToGuides
}) => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const scenario = DRILL_SCENARIOS[scenarioIndex];

  const [isRunning, setIsRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(scenario.initialTimeSec);
  const [checkedSteps, setCheckedSteps] = useState<{ [id: number]: boolean }>({});
  const [selectedDilemmaOptions, setSelectedDilemmaOptions] = useState<{ [dilemmaId: number]: string }>({});
  const [isFinished, setIsFinished] = useState(false);
  const [sirenPlaying, setSirenPlaying] = useState(false);

  // Score live
  const calculateLiveScore = () => {
    let score = 50; // base de départ

    // Points des étapes essentielles
    scenario.essentialSteps.forEach((st) => {
      if (checkedSteps[st.id]) {
        score += st.points;
      }
    });

    // Points des dilemmes
    scenario.dilemmas.forEach((d) => {
      const chosenOptId = selectedDilemmaOptions[d.id];
      if (chosenOptId) {
        const opt = d.options.find((o) => o.id === chosenOptId);
        if (opt) {
          score += opt.pointsDelta;
        }
      }
    });

    // Bonus de rapidité si fini avant la moitié du temps
    if (isFinished && secondsRemaining > scenario.initialTimeSec / 2) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  };

  // Timer
  useEffect(() => {
    let timer: any = null;
    if (isRunning && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((s) => s - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isRunning) {
      triggerHaptic('heavy');
      setIsRunning(false);
      setIsFinished(true);
      if (sirenPlaying) {
        stopSiren();
        setSirenPlaying(false);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsRemaining, sirenPlaying]);

  if (!isOpen) return null;

  const handleStartDrill = () => {
    triggerHaptic('medium');
    setIsRunning(true);
    setIsFinished(false);
  };

  const handleToggleSiren = () => {
    triggerHaptic('warning');
    if (sirenPlaying) {
      stopSiren();
      setSirenPlaying(false);
    } else {
      setSirenPlaying(true);
      playRNASiren('alerte', () => setSirenPlaying(false));
    }
  };

  const handleNextRandomScenario = () => {
    triggerHaptic('light');
    if (sirenPlaying) {
      stopSiren();
      setSirenPlaying(false);
    }
    const nextIdx = (scenarioIndex + 1) % DRILL_SCENARIOS.length;
    setScenarioIndex(nextIdx);
    const newScen = DRILL_SCENARIOS[nextIdx];
    setSecondsRemaining(newScen.initialTimeSec);
    setIsRunning(false);
    setIsFinished(false);
    setCheckedSteps({});
    setSelectedDilemmaOptions({});
  };

  const handleResetCurrent = () => {
    triggerHaptic('light');
    if (sirenPlaying) {
      stopSiren();
      setSirenPlaying(false);
    }
    setSecondsRemaining(scenario.initialTimeSec);
    setIsRunning(false);
    setIsFinished(false);
    setCheckedSteps({});
    setSelectedDilemmaOptions({});
  };

  const handleFinishEarly = () => {
    triggerHaptic('success');
    if (sirenPlaying) {
      stopSiren();
      setSirenPlaying(false);
    }
    setIsRunning(false);
    setIsFinished(true);
  };

  const formatClock = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const liveScore = calculateLiveScore();

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#001126]/75 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white max-w-lg w-full rounded-2xl p-4 sm:p-5 shadow-2xl border border-[#c4c6ce] flex flex-col gap-3.5 my-auto max-h-[92vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-start justify-between border-b border-[#e4efff] pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[24px]">
                timer
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-['Space_Grotesk'] text-[10px] text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  EXERCICE — AUCUNE ALERTE RÉELLE
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-700 font-bold">
                  SIMULATION
                </span>
              </div>
              <h3 className="text-[17px] font-bold text-[#001126] leading-tight mt-0.5">
                {scenario.title}
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              if (sirenPlaying) stopSiren();
              onClose();
            }}
            type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#44474d] hover:text-[#001126] hover:bg-[#eef4ff]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Bouton de tirage aléatoire d'un autre scénario */}
        {!isRunning && !isFinished && (
          <div className="flex items-center justify-between gap-2 p-2 bg-[#f8f9ff] rounded-xl border border-[#d6e4f8]">
            <span className="text-[11px] text-[#44474d]">
              Scénario {scenarioIndex + 1} sur {DRILL_SCENARIOS.length}
            </span>
            <button
              type="button"
              onClick={handleNextRandomScenario}
              className="px-2.5 py-1 bg-[#eef4ff] hover:bg-[#dce9fd] text-[#001126] rounded-lg font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">shuffle</span>
              <span>Changer de scénario</span>
            </button>
          </div>
        )}

        {/* Contexte opérationnel sous stress */}
        <div className="bg-[#dee1ff] p-3 rounded-xl border border-[#b9c3ff] text-[12px] text-[#001258] leading-relaxed">
          <strong className="block text-[11px] font-['Space_Grotesk'] uppercase tracking-wider mb-0.5">
            Mise en situation d'urgence :
          </strong>
          {scenario.context}
        </div>

        {/* Chronomètre & Barre de Score en Temps Réel */}
        <div className="grid grid-cols-2 gap-2">
          {/* Chrono Box */}
          <div className={`p-3 rounded-xl text-center flex flex-col justify-center items-center shadow-inner border transition-colors ${
            secondsRemaining < 30 && isRunning
              ? 'bg-[#ba1a1a] text-white border-[#ff897d] animate-pulse'
              : 'bg-[#001126] text-white border-[#12263f]'
          }`}>
            <span className="font-['Space_Grotesk'] text-[32px] font-bold tracking-wider leading-none">
              {formatClock(secondsRemaining)}
            </span>
            <span className="text-[10px] font-['Space_Grotesk'] uppercase opacity-80 mt-1">
              {isFinished ? 'Temps Écoulé' : isRunning ? 'Chrono en cours' : 'Temps Alloué'}
            </span>
          </div>

          {/* Score Live Box */}
          <div className="bg-[#f0fdf4] p-3 rounded-xl text-center border border-[#bbf7d0] flex flex-col justify-center items-center">
            <div className="flex items-baseline gap-1">
              <span className="font-['Space_Grotesk'] text-[32px] font-bold text-[#166534] leading-none">
                {liveScore}
              </span>
              <span className="text-[12px] text-[#166534] font-bold">/ 100</span>
            </div>
            <span className="text-[10px] font-['Space_Grotesk'] uppercase text-[#15803d] font-bold mt-1">
              Score Réflexe Live
            </span>
          </div>
        </div>

        {/* Commandes audio & actions du chrono */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleToggleSiren}
            className={`flex-1 min-h-[40px] px-3 rounded-xl font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 border transition-all ${
              sirenPlaying
                ? 'bg-[#ba1a1a] text-white border-[#ba1a1a] animate-pulse'
                : 'bg-white hover:bg-[#eef4ff] text-[#001126] border-[#c4c6ce]'
            }`}
            title="Activer la sirène nationale en fond pour un entraînement sous stress sonore réaliste"
          >
            <span className="material-symbols-outlined text-[17px]">
              {sirenPlaying ? 'volume_off' : 'campaign'}
            </span>
            <span>{sirenPlaying ? 'Arrêter Sirène' : 'Ambiance Sirène RNA'}</span>
          </button>

          {!isRunning && !isFinished ? (
            <button
              type="button"
              onClick={handleStartDrill}
              className="flex-1 min-h-[40px] px-3 bg-[#001126] hover:bg-[#12263f] text-[#98f6c5] rounded-xl font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[17px]">play_arrow</span>
              <span>Lancer l'Exercice</span>
            </button>
          ) : isRunning ? (
            <button
              type="button"
              onClick={handleFinishEarly}
              className="flex-1 min-h-[40px] px-3 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[17px]">check_circle</span>
              <span>Terminer & Débriefing</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleResetCurrent}
              className="flex-1 min-h-[40px] px-3 bg-[#eef4ff] text-[#001126] rounded-xl font-['Space_Grotesk'] text-[11px] font-bold uppercase border border-[#c4c6ce]"
            >
              Recommencer
            </button>
          )}
        </div>

        {/* CORPS DE L'EXERCICE (Pendant l'exercice) */}
        {!isFinished ? (
          <div className="flex flex-col gap-3 pt-1">
            {/* 1. Étapes tactiques indispensables */}
            <div className="flex flex-col gap-1.5">
              <span className="font-['Space_Grotesk'] text-[11px] text-[#001126] font-bold uppercase tracking-wider">
                1. Gestes vitaux sous le chronomètre :
              </span>
              <div className="space-y-1.5">
                {scenario.essentialSteps.map((st) => (
                  <label
                    key={st.id}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-[12px] cursor-pointer transition-colors ${
                      checkedSteps[st.id]
                        ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]'
                        : 'bg-[#f8f9ff] border-[#d6e4f8] text-[#001126] hover:bg-[#eef4ff]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedSteps[st.id]}
                      onChange={() => {
                        triggerHaptic('light');
                        setCheckedSteps((prev) => ({ ...prev, [st.id]: !prev[st.id] }));
                      }}
                      className="w-4 h-4 accent-[#16a34a] rounded"
                    />
                    <span className="flex-1 font-medium">{st.text}</span>
                    <span className="text-[10px] font-['Space_Grotesk'] text-[#44474d] shrink-0 font-bold">
                      {st.timeHint}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Dilemmes tactiques sous stress */}
            <div className="flex flex-col gap-2 pt-1 border-t border-[#e4efff]">
              <span className="font-['Space_Grotesk'] text-[11px] text-[#001126] font-bold uppercase tracking-wider">
                2. Décisions critiques & pièges opérationnels :
              </span>

              {scenario.dilemmas.map((d) => (
                <div key={d.id} className="p-3 bg-[#eef4ff] rounded-xl border border-[#d6e4f8] flex flex-col gap-2">
                  <p className="text-[12px] font-bold text-[#001126] leading-snug">
                    {d.question}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {d.options.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic(opt.isTrap ? 'warning' : 'success');
                          setSelectedDilemmaOptions((prev) => ({ ...prev, [d.id]: opt.id }));
                        }}
                        className={`p-2.5 rounded-lg text-left text-[12px] border transition-all ${
                          selectedDilemmaOptions[d.id] === opt.id
                            ? opt.isTrap
                              ? 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a] font-bold'
                              : 'bg-[#001126] text-white border-[#001126] font-bold shadow-xs'
                            : 'bg-white hover:bg-[#e4efff] text-[#001126] border-[#c4c6ce]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Feedback en temps réel si option choisie */}
                  {selectedDilemmaOptions[d.id] && (
                    <div className="text-[11px] p-2 rounded bg-white border border-[#c4c6ce] text-[#44474d] leading-relaxed">
                      {d.options.find((o) => o.id === selectedDilemmaOptions[d.id])?.feedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ÉCRAN DE DÉBRIEFING APPROFONDI */
          <div className="flex flex-col gap-3 py-1">
            <div className={`p-4 rounded-xl border text-center flex flex-col gap-1 shadow-sm ${
              liveScore >= 85
                ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]'
                : liveScore >= 65
                ? 'bg-[#fefce8] border-[#fef08a] text-[#854d0e]'
                : 'bg-[#ffdad6] border-[#ffb4ab] text-[#93000a]'
            }`}>
              <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold tracking-wider">
                Débriefing Opérationnel • Bilan d'Exercice
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-['Space_Grotesk'] text-[42px] font-bold">
                  {liveScore}
                </span>
                <span className="text-[16px] font-bold">/ 100</span>
              </div>
              <strong className="text-[14px]">
                {liveScore >= 85
                  ? '🏅 Mention Exceptionnelle : Résilience & Réflexes Parfaits'
                  : liveScore >= 65
                  ? '⚠️ Mention Satisfaisante : Quelques Vulnérabilités Détectées'
                  : '❌ Échec Critique : Comportements à Risque Mortel Détectés'}
              </strong>
            </div>

            {/* Analyse détaillée des choix */}
            <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#d6e4f8] flex flex-col gap-2">
              <span className="font-['Space_Grotesk'] text-[11px] text-[#001126] font-bold uppercase">
                Points Clés Doctrিনaux de Sécurité Civile :
              </span>
              <ul className="space-y-1.5 text-[11.5px] text-[#0f1c2b]">
                <li className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#16a34a] shrink-0 mt-0.5">check_circle</span>
                  <span><strong>Confinement immédiat :</strong> Divise par plus de 90% l'exposition aux toxiques aéroportés par rapport à une fuite extérieure.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#ba1a1a] shrink-0 mt-0.5">cancel</span>
                  <span><strong>Interdiction de fuite en voiture :</strong> L'habitacle automobile n'offre aucune étanchéité et crée des embouteillages paralysant les secours.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#ba1a1a] shrink-0 mt-0.5">cancel</span>
                  <span><strong>Zéro automédication d'iode :</strong> L'iode n'agit que contre l'iode 131 d'un réacteur nucléaire. Inutile contre le chlore ou le Césium.</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-2 pt-1 border-t border-[#e4efff]">
              <button
                type="button"
                onClick={handleNextRandomScenario}
                className="flex-1 min-h-[46px] bg-[#001126] hover:bg-[#12263f] text-[#98f6c5] rounded-xl font-['Space_Grotesk'] text-[11px] uppercase font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[17px]">shuffle</span>
                <span>Scénario Aléatoire Suivant</span>
              </button>

              {onGoToGuides && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onGoToGuides();
                  }}
                  className="px-3 min-h-[46px] bg-white text-[#001126] rounded-xl font-['Space_Grotesk'] text-[11px] uppercase font-bold border border-[#c4c6ce]"
                >
                  Fiches Réflexes
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
