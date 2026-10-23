import React, { useState, useEffect } from 'react';
import { SubScreen } from '../types';
import {
  IMMERSION_SCENARIOS,
  ADDITIONAL_MODULES,
  QUIZ_IRRADIATION_CONTAMINATION,
  QUIZ_DECONTAMINATION,
  DetailedQuiz,
} from '../data/quizData';
import { playRNASiren, stopSiren } from '../utils/sirenAudio';
import { CrisisDrillModal } from '../components/CrisisDrillModal';

interface FormationViewProps {
  onBack: () => void;
  onOpenSubScreen: (screen: SubScreen) => void;
  onGoToGuides: () => void;
}

export const FormationView: React.FC<FormationViewProps> = ({
  onBack,
  onOpenSubScreen,
  onGoToGuides,
}) => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const currentScenario = IMMERSION_SCENARIOS[scenarioIndex];
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D'>('B');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('tous');
  const [trainerMode, setTrainerMode] = useState(false);

  // Compétences travaillées en local (sans serveur)
  const [competencies, setCompetencies] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nrbcor_competencies_tracked');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['Confinement étanche', 'Priorité Radio FM France Bleu'];
  });

  const recordCompetency = (comp: string) => {
    if (!competencies.includes(comp)) {
      const updated = [...competencies, comp];
      setCompetencies(updated);
      try {
        localStorage.setItem('nrbcor_competencies_tracked', JSON.stringify(updated));
      } catch {}
    }
  };

  // Drill state
  const [showDrillModal, setShowDrillModal] = useState(false);
  const [drillSeconds, setDrillSeconds] = useState(900); // 15 min
  const [drillRunning, setDrillRunning] = useState(false);
  const [drillStepsChecked, setDrillStepsChecked] = useState<{ [key: number]: boolean }>({});
  const [drillFinished, setDrillFinished] = useState(false);

  // Siren audio test state
  const [sirenPlaying, setSirenPlaying] = useState<'alerte' | 'fin' | null>(null);

  // Interactive Quiz Modal State
  const [activeQuiz, setActiveQuiz] = useState<DetailedQuiz | null>(null);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [qIdx: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Drill timer effect
  useEffect(() => {
    let interval: any = null;
    if (drillRunning && drillSeconds > 0) {
      interval = setInterval(() => {
        setDrillSeconds((s) => s - 1);
      }, 1000);
    } else if (drillSeconds === 0 && drillRunning) {
      setDrillRunning(false);
      setDrillFinished(true);
    }
    return () => clearInterval(interval);
  }, [drillRunning, drillSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNextScenario = () => {
    const nextIdx = (scenarioIndex + 1) % IMMERSION_SCENARIOS.length;
    setScenarioIndex(nextIdx);
    // Default to the correct option or neutral
    setSelectedOption(IMMERSION_SCENARIOS[nextIdx].options.find((o) => o.isCorrect)?.letter || 'B');
  };

  const handleToggleSiren = (type: 'alerte' | 'fin') => {
    if (sirenPlaying === type) {
      stopSiren();
      setSirenPlaying(null);
    } else {
      setSirenPlaying(type);
      playRNASiren(type, () => setSirenPlaying(null));
    }
  };

  const openInteractiveQuiz = (quiz: DetailedQuiz) => {
    setActiveQuiz(quiz);
    setQuizQuestionIndex(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const calculateQuizScore = () => {
    if (!activeQuiz) return 0;
    let score = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="flex flex-col w-full pt-20 pb-28 min-h-screen max-w-xl mx-auto">
      {/* Sentinel */}
      <aside className="w-full bg-[#002c1b] text-[#98f6c5] py-2 px-4 flex items-center justify-between border-b border-[#005236]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-block w-2 h-2 rounded-full bg-[#98f6c5] animate-pulse"></span>
          <span className="font-['Space_Grotesk'] text-[11px] tracking-wider uppercase font-bold truncate">
            100% Hors-Ligne • Sauvegarde IndexedDB
          </span>
        </div>
        <span className="font-['Space_Grotesk'] text-[11px] font-bold text-white bg-[#001126] px-2 py-0.5 rounded">
          BASE LOCALE v2.4
        </span>
      </aside>

      <div className="px-4 py-3 flex flex-col gap-4">
        {/* Hub d'urgence return button */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            type="button"
            className="h-12 px-3 bg-[#dce9fd] hover:bg-[#d6e4f8] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold rounded flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>RETOUR</span>
          </button>
          <span className="font-['Space_Grotesk'] text-[11px] bg-[#dee1ff] text-[#001258] px-2 py-1 rounded font-bold uppercase">
            ENTRAÎNEMENT CITOYEN
          </span>
        </div>

        {/* Framing Header */}
        <header className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="font-['Space_Grotesk'] text-[11px] px-2 py-0.5 rounded bg-[#12263f] text-white uppercase font-bold tracking-wider">
              Programme d'entraînement citoyen
            </span>
            <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] font-medium">
              Sec. 4.11 Civ. Prot
            </span>
          </div>
          <h1 className="text-[24px] text-[#001126] tracking-tight font-bold">
            Formation, Quiz & Exercices
          </h1>
          <p className="text-[13px] text-[#44474d] leading-relaxed">
            Développez des automatismes de survie face aux aléas technologiques majeurs. Entraînez-vous à froid avant l'urgence.
          </p>

          {/* Legal Disclaimer */}
          <section className="mt-1 rounded-xl bg-[#eef4ff] p-3.5 flex items-start gap-2.5 shadow-sm border border-[#d6e4f8]">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[22px] flex-shrink-0 mt-0.5">
              gavel
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="font-['Space_Grotesk'] text-[11px] text-[#ba1a1a] uppercase font-bold tracking-wide">
                Avertissement Réglementaire (Art. 4.11)
              </span>
              <p className="text-[12px] text-[#0f1c2b] leading-tight">
                <strong>EXERCICE & FORMATION FICTIFS :</strong> Aucun score ne confère d'habilitation opérationnelle ni de certificat d'intervention en zone d'exclusion NRBC. En situation réelle, appliquez sans délai les consignes de la Préfecture.
              </p>
            </div>
          </section>

          {/* Mode Formateur / Animateur Toggle */}
          <div className="mt-1 p-3 bg-white rounded-xl border border-[#c4c6ce] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#0036ce]">co_present</span>
              <div>
                <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] block">
                  Mode Formateur / Animateur d'Exercice
                </span>
                <span className="text-[10px] text-[#44474d]">
                  Affiche les notes pédagogiques, objectifs et débriefing pour animer un groupe
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={trainerMode}
                onChange={(e) => setTrainerMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-[#0036ce]"></div>
            </label>
          </div>
        </header>

        {/* Compétences Civiles Travaillées en Local */}
        <section className="bg-[#f8f9ff] rounded-xl p-3 border border-[#d6e4f8] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#0036ce] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Compétences Civiles Validées ({competencies.length}) :
            </span>
            <span className="text-[10px] text-gray-500 font-medium">Historique local</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {competencies.map((comp, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full bg-white text-[#005236] border border-[#98f6c5] font-['Space_Grotesk'] text-[11px] font-bold flex items-center gap-1 shadow-xs"
              >
                <span className="material-symbols-outlined text-[13px] text-[#005236]">check</span>
                <span>{comp}</span>
              </span>
            ))}
          </div>
        </section>

        {/* Overall Training Progress Widget */}
        <section className="rounded-xl bg-white p-4 shadow-sm flex flex-col gap-3 border border-[#c4c6ce]">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <span className="font-['Space_Grotesk'] text-[11px] text-[#0036ce] uppercase font-bold tracking-wider">
                Indicateur de Réactivité
              </span>
              <h2 className="text-[18px] text-[#001126] font-bold">
                Préparation du foyer : 72%
              </h2>
              <span className="text-[12px] text-[#44474d]">3 modules complétés sur 5</span>
            </div>
            <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#e4efff]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-[#0036ce]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="72, 100"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute font-['Space_Grotesk'] text-[13px] text-[#001126] font-bold">
                72%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#eef4ff] rounded-lg p-2.5 flex flex-col border border-[#d6e4f8]">
              <span className="font-['Space_Grotesk'] text-[20px] text-[#001126] font-bold">18</span>
              <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d]">Questions traitées</span>
            </div>
            <div className="bg-[#eef4ff] rounded-lg p-2.5 flex flex-col border border-[#d6e4f8]">
              <div className="flex items-center gap-1">
                <span className="font-['Space_Grotesk'] text-[20px] text-[#001126] font-bold">16</span>
                <span className="material-symbols-outlined text-[18px] text-[#3f9d73]">
                  check_circle
                </span>
              </div>
              <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d]">Réflexes validés</span>
            </div>
          </div>

          <div className="w-full bg-[#e4efff] rounded-full h-2 overflow-hidden">
            <div className="bg-[#0036ce] h-full rounded-full" style={{ width: '72%' }}></div>
          </div>
        </section>

        {/* Module d'Entraînement Sonore : Reconnaissance de la Sirène RNA */}
        <section className="bg-white rounded-xl p-4 shadow-sm border border-[#c4c6ce] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[22px]">campaign</span>
              <h3 className="text-[16px] font-bold text-[#001126]">
                Reconnaissance Sonore • Sirène RNA
              </h3>
            </div>
            <span className="font-['Space_Grotesk'] text-[10px] px-2 py-0.5 rounded bg-[#98f6c5] text-[#005236] font-bold uppercase">
              AUDIO LOCAL SYNTHÉTISÉ
            </span>
          </div>
          <p className="text-[12px] text-[#44474d] leading-relaxed">
            Testez la sirène d'alerte officielle (signal modulé montant/descendant de 1 min 41s répété 3 fois) et le signal continu de fin d'alerte (30 secondes).
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleToggleSiren('alerte')}
              type="button"
              className={`min-h-[48px] rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center justify-center gap-2 transition-all shadow-sm ${
                sirenPlaying === 'alerte'
                  ? 'bg-[#ba1a1a] text-white animate-pulse'
                  : 'bg-[#ffdad6] text-[#93000a] hover:bg-[#ffb4ab]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {sirenPlaying === 'alerte' ? 'stop' : 'volume_up'}
              </span>
              <span>{sirenPlaying === 'alerte' ? 'Arrêter sirène' : 'Simuler Alerte (RNA)'}</span>
            </button>

            <button
              onClick={() => handleToggleSiren('fin')}
              type="button"
              className={`min-h-[48px] rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center justify-center gap-2 transition-all shadow-sm ${
                sirenPlaying === 'fin'
                  ? 'bg-[#002c1b] text-white'
                  : 'bg-[#eef4ff] text-[#001126] hover:bg-[#dce9fd] border border-[#c4c6ce]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {sirenPlaying === 'fin' ? 'stop' : 'check_circle'}
              </span>
              <span>{sirenPlaying === 'fin' ? 'Arrêter son' : 'Fin d\'alerte (30s)'}</span>
            </button>
          </div>
        </section>

        {/* Filter Category Chips */}
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'tous', label: 'Tous les modules (4)' },
            { id: 'nuc', label: 'Nucléaire & Radio' },
            { id: 'chem', label: 'Chimique & TMD' },
            { id: 'gestes', label: 'Gestes Réflexes Foyer' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              type="button"
              className={`flex-shrink-0 min-h-[44px] px-3.5 py-1.5 rounded-full font-['Space_Grotesk'] text-[12px] font-bold transition-all ${
                activeCategoryFilter === cat.id
                  ? 'bg-[#001126] text-white shadow-sm'
                  : 'bg-white hover:bg-[#e4efff] text-[#44474d] border border-[#c4c6ce]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        {/* ACTIVE EXERCISE CARD: Interactive Simulation Question in Progress */}
        <section className="rounded-xl bg-white p-4 shadow-md flex flex-col gap-3 border border-[#c4c6ce]">
          <div className="flex items-center justify-between gap-1 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-['Space_Grotesk'] text-[10px] px-2 py-0.5 rounded bg-[#dee1ff] text-[#001258] font-bold uppercase tracking-wider">
                {currentScenario.scenarioType}
              </span>
              <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] font-bold">
                {currentScenario.scenarioNumber}
              </span>
            </div>
            <span className="font-['Space_Grotesk'] text-[10px] text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded font-bold uppercase">
              {currentScenario.badge}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-[17px] text-[#001126] font-bold leading-tight">
              {currentScenario.title}
            </h2>
            <div className="p-3 rounded-lg bg-[#eef4ff] text-[13px] text-[#0f1c2b] leading-relaxed border border-[#d6e4f8] italic">
              {currentScenario.context}
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="font-['Space_Grotesk'] text-[11px] text-[#0036ce] font-bold uppercase tracking-wider">
              Évaluation Réflexe
            </span>
            <p className="text-[14px] text-[#001126] font-bold leading-snug">
              {currentScenario.question}
            </p>
          </div>

          {/* Fiche Animateur / Coaching de Groupe */}
          {trainerMode && (
            <div className="p-3 bg-[#fff9ea] rounded-xl border border-[#ffe082] text-[11px] text-[#5c3e00] flex flex-col gap-1.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 font-bold uppercase font-['Space_Grotesk'] text-[#7a5200]">
                <span className="material-symbols-outlined text-[16px]">school</span>
                <span>Fiche Formateur • Animation de Groupe</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 leading-snug">
                <div>
                  <strong>Objectif pédagogique : </strong>
                  Déconstruire les fausses croyances (fuite en véhicule, saturation d'appels, prise d'iode non ordonnée) et ancrer le réflexe de confinement immédiat en bâtiment dur.
                </div>
                <div>
                  <strong>Conseil d'animation : </strong>
                  Faire émerger les réponses spontanées du groupe avant d'afficher la correction. Rappeler que le PPMS protège les enfants dans les écoles.
                </div>
              </div>
            </div>
          )}

          {/* Simulation Options with instant didactic feedback states */}
          <div className="flex flex-col gap-2.5">
            {currentScenario.options.map((opt) => {
              const isSelected = selectedOption === opt.letter;

              if (opt.isCorrect) {
                return (
                  <div
                    key={opt.letter}
                    onClick={() => {
                      setSelectedOption(opt.letter);
                      recordCompetency(currentScenario.title.slice(0, 30));
                    }}
                    className={`rounded-lg p-3 cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-[#98f6c5] border-[#005236] text-[#002c1b] shadow-sm'
                        : 'bg-[#98f6c5]/50 border-[#98f6c5] text-[#002c1b]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[#005236] text-[22px] mt-0.5 shrink-0">
                          check_circle
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[13px] font-bold text-[#002c1b]">
                            Option {opt.letter} : {opt.text}
                          </span>
                        </div>
                      </div>
                      <span className="font-['Space_Grotesk'] text-[10px] px-1.5 py-0.5 rounded bg-white text-[#005236] uppercase font-bold shrink-0">
                        {isSelected ? 'SÉLECTIONNÉ' : 'CONSEILLÉ'}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="ml-7 mt-2 p-2 rounded bg-white text-[#0f1c2b] text-[12px] border border-[#98f6c5] leading-relaxed">
                        <span className="font-['Space_Grotesk'] text-[11px] text-[#005236] uppercase font-bold block mb-0.5">
                          {opt.tag}
                        </span>
                        {opt.explanation}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={opt.letter}
                  onClick={() => setSelectedOption(opt.letter)}
                  className={`rounded-lg p-3 cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#ffdad6] border-[#ba1a1a]'
                      : 'bg-[#eef4ff]/60 border-[#d6e4f8]'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`material-symbols-outlined text-[20px] mt-0.5 shrink-0 ${
                      isSelected ? 'text-[#ba1a1a]' : 'text-[#74777e]'
                    }`}>
                      {isSelected ? 'cancel' : 'radio_button_unchecked'}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className={`text-[13px] font-bold ${
                        isSelected ? 'text-[#93000a]' : 'text-[#0f1c2b]'
                      }`}>
                        Option {opt.letter} : {opt.text}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="ml-7 mt-2 p-2 rounded bg-white text-[#0f1c2b] text-[12px] border border-[#ffdad6] leading-relaxed">
                      <span className="font-['Space_Grotesk'] text-[11px] text-[#ba1a1a] uppercase font-bold block mb-0.5">
                        {opt.tag}
                      </span>
                      {opt.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <footer className="pt-2 flex items-center justify-between text-[#44474d] text-[12px] font-['Space_Grotesk'] border-t border-[#e4efff]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Source : {currentScenario.source}
            </span>
            <button
              onClick={handleNextScenario}
              type="button"
              className="font-bold text-[#0036ce] flex items-center gap-1 hover:underline min-h-[44px] px-2 items-center"
            >
              <span>Simulation suivante ({scenarioIndex + 1}/{IMMERSION_SCENARIOS.length})</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </footer>
        </section>

        {/* Scénarios d'Entraînement Foyer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <h3 className="text-[18px] text-[#001126] font-bold">
              Scénarios d'Entraînement Foyer
            </h3>
            <span className="text-[12px] text-[#44474d]">
              Modules certifiés conformes aux doctrines civiles
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-[11px] text-[#0036ce] font-bold uppercase bg-[#e4efff] px-2 py-1 rounded">
            3 Disponibles
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {ADDITIONAL_MODULES.map((mod) => (
            <article
              key={mod.id}
              className="rounded-xl bg-white p-4 shadow-sm flex flex-col gap-2.5 border border-[#c4c6ce]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`font-['Space_Grotesk'] text-[10px] px-2 py-0.5 rounded font-bold uppercase ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                    {mod.duration && (
                      <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d]">
                        Durée : {mod.duration}
                      </span>
                    )}
                  </div>
                  <h4 className="text-[16px] text-[#001126] font-bold leading-snug">
                    {mod.title}
                  </h4>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#e4efff] flex items-center justify-center flex-shrink-0 text-[#001126]">
                  <span className="material-symbols-outlined text-[22px]">
                    {mod.id === 'm-confinement-drill'
                      ? 'meeting_room'
                      : mod.id === 'm-radio-quiz'
                      ? 'verified'
                      : 'shower'}
                  </span>
                </div>
              </div>

              <p className="text-[13px] text-[#44474d] leading-relaxed">
                {mod.description}
              </p>

              {mod.checklist && (
                <ul className="flex flex-col gap-1 py-1">
                  {mod.checklist.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-[12px] text-[#0f1c2b]">
                      <span className="material-symbols-outlined text-[16px] text-[#3f9d73]">
                        check
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {mod.keyDirective && (
                <div className="p-2.5 rounded-lg bg-[#eef4ff] flex items-start gap-2 border border-[#d6e4f8]">
                  <span className="material-symbols-outlined text-[#0036ce] text-[18px] mt-0.5 shrink-0">
                    info
                  </span>
                  <p className="text-[12px] text-[#0f1c2b] leading-snug">
                    <strong>Consigne clé :</strong> {mod.keyDirective}
                  </p>
                </div>
              )}

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (mod.id === 'm-confinement-drill') {
                      setShowDrillModal(true);
                      setDrillRunning(false);
                      setDrillSeconds(900);
                      setDrillFinished(false);
                    } else if (mod.id === 'm-radio-quiz') {
                      openInteractiveQuiz(QUIZ_IRRADIATION_CONTAMINATION);
                    } else if (mod.id === 'm-decontamination-quiz') {
                      openInteractiveQuiz(QUIZ_DECONTAMINATION);
                    }
                  }}
                  className={`w-full min-h-[48px] rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm ${
                    mod.id === 'm-decontamination-quiz'
                      ? 'bg-[#0036ce] text-white hover:bg-[#194cfe]'
                      : 'bg-[#001126] text-white hover:bg-[#12263f]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {mod.id === 'm-confinement-drill' ? 'play_arrow' : 'quiz'}
                  </span>
                  <span>{mod.actionText}</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Practical Field Realism Image Feature */}
        <section className="rounded-xl overflow-hidden bg-white shadow-sm flex flex-col border border-[#c4c6ce]">
          <div className="relative w-full h-44 bg-[#001126]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnIiYmI9wvJF_SYUP_MdxrkSbd32EZA49I-5xsgxJwME3bbpvdkvsUSlPYFQ4hFORbdkjO5Q8wNuGKjaHC0JlwOgA6YwA5G367gXWWKYWH-m_17LfhCNI-f2xF9SJTBKGFdsSY3WOXOrJsZjIqWNZGsvUbMmLad-rhMVtWCpJVZvABkJS-ceEz5K_W-Rtwbq4oKOXoYbcoDaf7yP3VyG4HBcTs0h-jBgjjk70vJrjQ0hZaatuB05g"
              alt="Le Kit 72h Scellé du Foyer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001126]/90 via-transparent to-transparent flex items-end p-4">
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[10px] text-[#98f6c5] uppercase font-bold tracking-wider">
                  Atelier Matériel
                </span>
                <span className="text-[17px] text-white font-bold">
                  Le Kit 72h Scellé du Foyer
                </span>
              </div>
            </div>
          </div>
          <div className="p-3.5 flex items-center justify-between gap-3">
            <p className="text-[12px] text-[#44474d] leading-snug">
              Vérifiez semestriellement les dates de péremption de vos filtres, réserves d'eau et piles.
            </p>
            <button
              onClick={() => onOpenSubScreen({ type: 'protocol', id: 'confinement' })}
              type="button"
              className="flex-shrink-0 min-h-[44px] px-3.5 rounded-lg bg-[#e4efff] hover:bg-[#dce9fd] text-[#001126] font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 border border-[#c4c6ce]"
            >
              Inventaire
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Fundamental Pedagogical Disclaimer Card */}
        <footer className="rounded-xl bg-[#eef4ff] p-4 flex flex-col gap-3 text-[#0f1c2b] shadow-sm border border-[#d6e4f8]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#001126] flex items-center justify-center flex-shrink-0 text-white">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <h4 className="text-[15px] font-bold text-[#001126] leading-tight">
                Rappel Pédagogique Fondamental
              </h4>
              <p className="text-[12px] text-[#44474d] leading-relaxed">
                Aucune application ni aucun quiz théorique ne remplace l'entraînement pratique délivré par la Sécurité Civile (formations PSC1, gestes qui sauvent) ni l'autorité exclusive du Préfet de département lors d'un accident technologique ou d'une crise NRBC.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => window.print()}
              type="button"
              className="w-full min-h-[48px] bg-[#001126] hover:bg-[#12263f] text-white rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:opacity-90 shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              Télécharger le Mémo d'Exercice Foyer (PDF Hors-ligne)
            </button>
            <button
              onClick={onGoToGuides}
              type="button"
              className="w-full min-h-[48px] bg-white hover:bg-[#e4efff] text-[#001126] rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-[#c4c6ce]"
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              Consulter les Fiches Réflexes Officielles
            </button>
          </div>
        </footer>
      </div>

      {/* Modal Exercice Chronométré Immersif de Crise */}
      <CrisisDrillModal
        isOpen={showDrillModal}
        onClose={() => setShowDrillModal(false)}
        onGoToGuides={onGoToGuides}
      />


      {/* Modal Quiz Interactif Complet */}
      {activeQuiz && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001126]/60 backdrop-blur-sm"
        >
          <div className="bg-white max-w-sm w-full rounded-xl p-5 shadow-2xl border border-[#c4c6ce] flex flex-col gap-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e4efff] pb-2">
              <div>
                <span className="font-['Space_Grotesk'] text-[10px] uppercase font-bold text-[#0036ce]">
                  {activeQuiz.authority}
                </span>
                <h3 className="text-[16px] font-bold text-[#001126] leading-tight">
                  {activeQuiz.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveQuiz(null)}
                className="text-[#44474d] hover:text-[#001126]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {!quizSubmitted ? (
              <>
                <div className="flex items-center justify-between text-[11px] font-['Space_Grotesk'] text-[#44474d]">
                  <span>
                    Question {quizQuestionIndex + 1} sur {activeQuiz.questions.length}
                  </span>
                  <span>Score actuel : {calculateQuizScore()} pts</span>
                </div>

                <div className="w-full bg-[#e4efff] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0036ce] h-full rounded-full transition-all"
                    style={{
                      width: `${((quizQuestionIndex + 1) / activeQuiz.questions.length) * 100}%`,
                    }}
                  ></div>
                </div>

                <p className="text-[14px] font-bold text-[#001126] leading-snug">
                  {activeQuiz.questions[quizQuestionIndex].question}
                </p>

                <div className="flex flex-col gap-2 pt-1">
                  {activeQuiz.questions[quizQuestionIndex].options.map((opt, optIdx) => {
                    const isPicked = quizAnswers[quizQuestionIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => {
                          setQuizAnswers((prev) => ({
                            ...prev,
                            [quizQuestionIndex]: optIdx,
                          }));
                        }}
                        className={`p-3 rounded-lg text-left text-[13px] transition-all border ${
                          isPicked
                            ? 'bg-[#001126] text-white border-[#001126] font-semibold'
                            : 'bg-[#eef4ff] hover:bg-[#e4efff] text-[#0f1c2b] border-[#d6e4f8]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#e4efff]">
                  <button
                    type="button"
                    disabled={quizQuestionIndex === 0}
                    onClick={() => setQuizQuestionIndex((i) => i - 1)}
                    className="h-10 px-3 rounded bg-[#eef4ff] disabled:opacity-40 text-[#001126] font-['Space_Grotesk'] text-[11px] font-bold uppercase"
                  >
                    Précédent
                  </button>

                  {quizQuestionIndex < activeQuiz.questions.length - 1 ? (
                    <button
                      type="button"
                      disabled={quizAnswers[quizQuestionIndex] === undefined}
                      onClick={() => setQuizQuestionIndex((i) => i + 1)}
                      className="h-10 px-4 rounded bg-[#001126] disabled:opacity-40 text-white font-['Space_Grotesk'] text-[11px] font-bold uppercase shadow-sm"
                    >
                      Suivant
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={quizAnswers[quizQuestionIndex] === undefined}
                      onClick={() => setQuizSubmitted(true)}
                      className="h-10 px-4 rounded bg-[#0036ce] text-white font-['Space_Grotesk'] text-[11px] font-bold uppercase shadow-sm"
                    >
                      Valider le quiz
                    </button>
                  )}
                </div>
              </>
            ) : (
              // Quiz Results View
              <div className="flex flex-col gap-3">
                <div className="bg-[#98f6c5] p-4 rounded-xl text-center text-[#002c1b] border border-[#005236]">
                  <span className="material-symbols-outlined text-[36px] text-[#005236]">
                    emoji_events
                  </span>
                  <h4 className="text-[18px] font-bold">
                    Score : {calculateQuizScore()} / {activeQuiz.questions.length}
                  </h4>
                  <p className="text-[12px] font-medium mt-0.5">
                    {calculateQuizScore() === activeQuiz.questions.length
                      ? 'Félicitations ! Vous maîtrisez les automatismes de sécurité civile.'
                      : 'Bonne révision. Consultez les fiches réflexes pour consolider vos réflexes.'}
                  </p>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {activeQuiz.questions.map((q, idx) => {
                    const isRight = quizAnswers[idx] === q.correctIndex;
                    return (
                      <div key={idx} className="p-2.5 rounded-lg bg-[#eef4ff] text-[12px] border border-[#d6e4f8]">
                        <p className="font-bold text-[#001126] flex items-center gap-1.5">
                          <span
                            className={`material-symbols-outlined text-[16px] ${
                              isRight ? 'text-[#3f9d73]' : 'text-[#ba1a1a]'
                            }`}
                          >
                            {isRight ? 'check_circle' : 'cancel'}
                          </span>
                          {q.question}
                        </p>
                        <p className="mt-1 text-[#44474d]">{q.explanation}</p>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveQuiz(null)}
                  className="w-full h-11 rounded-lg bg-[#001126] text-white font-['Space_Grotesk'] text-[12px] font-bold uppercase"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
