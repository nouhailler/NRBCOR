import React, { useState, useEffect } from 'react';
import { SubScreen } from '../types';
import { DetailedQuiz } from '../data/quizData';
import { useTranslation } from '../i18n/I18nContext';
import { getLocalizedQuizData } from '../i18n/content/localizedQuiz';
import { playRNASiren, stopSiren } from '../utils/sirenAudio';
import { CrisisDrillModal } from '../components/CrisisDrillModal';
import { TrainerSessionModal } from '../components/TrainerSessionModal';

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
  const { t, language } = useTranslation();
  const isEn = language === 'en';
  const localizedData = getLocalizedQuizData(language);
  const { immersionScenarios, additionalModules, quizIrradiation, quizDecontamination } = localizedData;

  const [scenarioIndex, setScenarioIndex] = useState(0);
  const currentScenario = immersionScenarios[scenarioIndex] || immersionScenarios[0];
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D'>('B');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('tous');
  const [trainerMode, setTrainerMode] = useState(false);
  const [showTrainerModal, setShowTrainerModal] = useState(false);

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
    const nextIdx = (scenarioIndex + 1) % immersionScenarios.length;
    setScenarioIndex(nextIdx);
    // Default to the correct option or neutral
    setSelectedOption(immersionScenarios[nextIdx].options.find((o) => o.isCorrect)?.letter || 'B');
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
    <div className="flex flex-col w-full pt-20 pb-28 lg:pb-12 min-h-screen max-w-xl lg:max-w-5xl mx-auto">
      {/* Sentinel */}
      <aside className="w-full bg-ok-deep text-ok-bright py-2 px-4 flex items-center justify-between border-b border-ok-ink">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-block w-2 h-2 rounded-full bg-ok-soft animate-pulse"></span>
          <span className="font-label text-[11px] tracking-wider uppercase font-bold truncate">
            {isEn ? '100% Offline • Sovereign IndexedDB Storage' : '100% Hors-Ligne • Sauvegarde IndexedDB'}
          </span>
        </div>
        <span className="font-label text-[11px] font-bold text-white bg-navy px-2 py-0.5 rounded">
          {isEn ? 'LOCAL BASE v2.4' : 'BASE LOCALE v2.4'}
        </span>
      </aside>

      <div className="px-4 py-3 flex flex-col gap-4">
        {/* Hub d'urgence return button */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            type="button"
            className="h-12 px-3 bg-tint hover:bg-tint text-ink font-label text-[12px] font-bold rounded flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>{isEn ? 'BACK' : 'RETOUR'}</span>
          </button>
          <span className="font-label text-[11px] bg-tint text-brand-ink px-2 py-1 rounded font-bold uppercase">
            {isEn ? 'CITIZEN PREPAREDNESS' : 'ENTRAÎNEMENT CITOYEN'}
          </span>
        </div>

        {/* Framing Header */}
        <header className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="font-label text-[11px] px-2 py-0.5 rounded bg-navy-2 text-white uppercase font-bold tracking-wider">
              {isEn ? 'Citizen preparedness program' : "Programme d'entraînement citoyen"}
            </span>
            <span className="font-label text-[11px] text-ink-muted font-medium">
              Sec. 4.11 Civ. Prot
            </span>
          </div>
          <h1 className="text-[24px] text-ink tracking-tight font-bold">
            {isEn ? 'Training, Quizzes & Drills' : 'Formation, Quiz & Exercices'}
          </h1>
          <p className="text-[13px] text-ink-muted leading-relaxed">
            {isEn
              ? 'Develop instinctive survival habits against major technological hazards. Practice ahead of time before real emergencies.'
              : "Développez des automatismes de survie face aux aléas technologiques majeurs. Entraînez-vous à froid avant l'urgence."}
          </p>

          {/* Legal Disclaimer */}
          <section className="mt-1 rounded-xl bg-subtle p-3.5 flex items-start gap-2.5 shadow-sm border border-line">
            <span className="material-symbols-outlined text-danger-ink text-[22px] flex-shrink-0 mt-0.5">
              gavel
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="font-label text-[11px] text-danger-ink uppercase font-bold tracking-wide">
                {isEn ? 'Regulatory Notice (Art. 4.11)' : 'Avertissement Réglementaire (Art. 4.11)'}
              </span>
              <p className="text-[12px] text-ink leading-tight">
                <strong>{isEn ? 'SIMULATED TRAINING & EXERCISE: ' : 'EXERCICE & FORMATION FICTIFS : '}</strong>
                {isEn
                  ? 'No score confers operational qualification or certification for deployment into CBRN hot zones. In real events, immediately obey instructions from the Civil Protection authorities.'
                  : "Aucun score ne confère d'habilitation opérationnelle ni de certificat d'intervention en zone d'exclusion NRBC. En situation réelle, appliquez sans délai les consignes de la Préfecture."}
              </p>
            </div>
          </section>

          {/* Mode Formateur / Animateur Toggle */}
          <div className="mt-1 p-3 bg-card rounded-xl border border-line-strong shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-brand-ink">co_present</span>
              <div>
                <span className="font-label text-[12px] font-bold text-ink block">
                  {isEn ? 'Trainer / Drill Instructor Mode' : "Mode Formateur / Animateur d'Exercice"}
                </span>
                <span className="text-[10px] text-ink-muted">
                  {isEn
                    ? 'Displays teaching notes, objectives and debriefing guides to lead a group'
                    : 'Affiche les notes pédagogiques, objectifs et débriefing pour animer un groupe'}
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-brand"></div>
            </label>
          </div>

          {/* Console Formateur quand actif */}
          {trainerMode && (
            <div className="p-3.5 bg-gradient-to-r from-blue-900 to-navy text-white rounded-xl shadow-md border border-blue-400/40 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-150">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px] text-blue-300">co_present</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-label text-[12px] font-bold text-white uppercase tracking-wider">
                      {isEn ? 'Trainer Collective Drill Console' : "Console d'Exercice Collectif Formateur"}
                    </span>
                    <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-bold uppercase">
                      {isEn ? 'Local / Zero-Server' : 'Local / Hors-Serveur'}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-300">
                    {isEn
                      ? '4 drill scenarios • Pedagogical objectives • Printable sheet for group debriefing'
                      : '4 scénarios de simulation • Objectifs pédagogiques • Bilan imprimable pour débriefing'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowTrainerModal(true)}
                className="w-full sm:w-auto h-9 px-4 bg-card hover:bg-gray-100 text-ink rounded-lg font-label text-[11px] font-bold uppercase transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">play_circle</span>
                <span>{isEn ? 'Lead a Drill' : 'Animer un Exercice'}</span>
              </button>
            </div>
          )}
        </header>

        {/* Compétences Civiles Travaillées en Local */}
        <section className="bg-canvas rounded-xl p-3 border border-line flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label text-[11px] font-bold uppercase text-brand-ink flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              {isEn ? `Validated Civil Skills (${competencies.length}):` : `Compétences Civiles Validées (${competencies.length}) :`}
            </span>
            <span className="text-[10px] text-gray-500 font-medium">{isEn ? 'Local history' : 'Historique local'}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {competencies.map((comp, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full bg-card text-ok-ink border border-ok-bright font-label text-[11px] font-bold flex items-center gap-1 shadow-xs"
              >
                <span className="material-symbols-outlined text-[13px] text-ok-ink">check</span>
                <span>{comp}</span>
              </span>
            ))}
          </div>
        </section>

        {/* Overall Training Progress Widget */}
        <section className="rounded-xl bg-card p-4 shadow-sm flex flex-col gap-3 border border-line-strong">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <span className="font-label text-[11px] text-brand-ink uppercase font-bold tracking-wider">
                {isEn ? 'Responsiveness Index' : 'Indicateur de Réactivité'}
              </span>
              <h2 className="text-[18px] text-ink font-bold">
                {isEn ? 'Household preparedness: 72%' : 'Préparation du foyer : 72%'}
              </h2>
              <span className="text-[12px] text-ink-muted">
                {isEn ? '3 modules completed out of 5' : '3 modules complétés sur 5'}
              </span>
            </div>
            <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-on-navy-soft"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-brand-ink"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="72, 100"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute font-label text-[13px] text-ink font-bold">
                72%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-subtle rounded-lg p-2.5 flex flex-col border border-line">
              <span className="font-label text-[20px] text-ink font-bold">18</span>
              <span className="font-label text-[11px] text-ink-muted">
                {isEn ? 'Questions answered' : 'Questions traitées'}
              </span>
            </div>
            <div className="bg-subtle rounded-lg p-2.5 flex flex-col border border-line">
              <div className="flex items-center gap-1">
                <span className="font-label text-[20px] text-ink font-bold">16</span>
                <span className="material-symbols-outlined text-[18px] text-ok-ink">
                  check_circle
                </span>
              </div>
              <span className="font-label text-[11px] text-ink-muted">
                {isEn ? 'Mastered reflexes' : 'Réflexes validés'}
              </span>
            </div>
          </div>

          <div className="w-full bg-tint rounded-full h-2 overflow-hidden">
            <div className="bg-brand h-full rounded-full" style={{ width: '72%' }}></div>
          </div>
        </section>

        {/* Module d'Entraînement Sonore : Reconnaissance de la Sirène RNA */}
        <section className="bg-card rounded-xl p-4 shadow-sm border border-line-strong flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-danger-ink text-[22px]">campaign</span>
              <h3 className="text-[16px] font-bold text-ink">
                {isEn ? 'Audio Recognition • National Alert Siren' : 'Reconnaissance Sonore • Sirène RNA'}
              </h3>
            </div>
            <span className="font-label text-[10px] px-2 py-0.5 rounded bg-ok-soft text-ok-ink font-bold uppercase">
              {isEn ? 'LOCAL SYNTHESIZED AUDIO' : 'AUDIO LOCAL SYNTHÉTISÉ'}
            </span>
          </div>
          <p className="text-[12px] text-ink-muted leading-relaxed">
            {isEn
              ? 'Test the official national alert siren (rising/falling modulated signal of 1 min 41s repeated 3 times) and the all-clear continuous signal (30 seconds).'
              : "Testez la sirène d'alerte officielle (signal modulé montant/descendant de 1 min 41s répété 3 fois) et le signal continu de fin d'alerte (30 secondes)."}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleToggleSiren('alerte')}
              type="button"
              className={`min-h-[48px] rounded-lg font-label text-[12px] font-bold uppercase flex items-center justify-center gap-2 transition-all shadow-sm ${
                sirenPlaying === 'alerte'
                  ? 'bg-danger text-white animate-pulse'
                  : 'bg-danger-soft text-danger-ink-strong hover:bg-danger-soft'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {sirenPlaying === 'alerte' ? 'stop' : 'volume_up'}
              </span>
              <span>
                {sirenPlaying === 'alerte'
                  ? (isEn ? 'Stop siren' : 'Arrêter sirène')
                  : (isEn ? 'Simulate Alert Siren' : 'Simuler Alerte (RNA)')}
              </span>
            </button>

            <button
              onClick={() => handleToggleSiren('fin')}
              type="button"
              className={`min-h-[48px] rounded-lg font-label text-[12px] font-bold uppercase flex items-center justify-center gap-2 transition-all shadow-sm ${
                sirenPlaying === 'fin'
                  ? 'bg-ok-deep text-white'
                  : 'bg-subtle text-ink hover:bg-tint border border-line-strong'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {sirenPlaying === 'fin' ? 'stop' : 'check_circle'}
              </span>
              <span>
                {sirenPlaying === 'fin'
                  ? (isEn ? 'Stop sound' : 'Arrêter son')
                  : (isEn ? 'All-clear (30s)' : "Fin d'alerte (30s)")}
              </span>
            </button>
          </div>
        </section>

        {/* Filter Category Chips */}
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'tous', label: isEn ? 'All modules (4)' : 'Tous les modules (4)' },
            { id: 'nuc', label: isEn ? 'Nuclear & Radiation' : 'Nucléaire & Radio' },
            { id: 'chem', label: isEn ? 'Chemical & Hazmat' : 'Chimique & TMD' },
            { id: 'gestes', label: isEn ? 'Household Reflex Habits' : 'Gestes Réflexes Foyer' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              type="button"
              className={`flex-shrink-0 min-h-[44px] px-3.5 py-1.5 rounded-full font-label text-[12px] font-bold transition-all ${
                activeCategoryFilter === cat.id
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-card hover:bg-tint text-ink-muted border border-line-strong'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        {/* ACTIVE EXERCISE CARD: Interactive Simulation Question in Progress */}
        <section className="rounded-xl bg-card p-4 shadow-md flex flex-col gap-3 border border-line-strong">
          <div className="flex items-center justify-between gap-1 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-label text-[10px] px-2 py-0.5 rounded bg-tint text-brand-ink font-bold uppercase tracking-wider">
                {currentScenario.scenarioType}
              </span>
              <span className="font-label text-[11px] text-ink-muted font-bold">
                {currentScenario.scenarioNumber}
              </span>
            </div>
            <span className="font-label text-[10px] text-danger-ink bg-danger-soft px-2 py-0.5 rounded font-bold uppercase">
              {currentScenario.badge}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-[17px] text-ink font-bold leading-tight">
              {currentScenario.title}
            </h2>
            <div className="p-3 rounded-lg bg-subtle text-[13px] text-ink leading-relaxed border border-line italic">
              {currentScenario.context}
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="font-label text-[11px] text-brand-ink font-bold uppercase tracking-wider">
              {isEn ? 'Reflex Assessment' : 'Évaluation Réflexe'}
            </span>
            <p className="text-[14px] text-ink font-bold leading-snug">
              {currentScenario.question}
            </p>
          </div>

          {/* Fiche Animateur / Coaching de Groupe */}
          {trainerMode && (
            <div className="p-3 bg-warn-soft rounded-xl border border-warn-bright text-[11px] text-warn-ink flex flex-col gap-1.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 font-bold uppercase font-label text-warn-ink">
                <span className="material-symbols-outlined text-[16px]">school</span>
                <span>{isEn ? 'Trainer Guide • Group Facilitation' : 'Fiche Formateur • Animation de Groupe'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 leading-snug">
                <div>
                  <strong>{isEn ? 'Pedagogical objective: ' : 'Objectif pédagogique : '}</strong>
                  {isEn
                    ? 'Dispel misconceptions (vehicular flight, phone line saturation, uncommanded iodine intake) and anchor immediate shelter-in-place habits.'
                    : "Déconstruire les fausses croyances (fuite en véhicule, saturation d'appels, prise d'iode non ordonnée) et ancrer le réflexe de confinement immédiat en bâtiment dur."}
                </div>
                <div>
                  <strong>{isEn ? 'Facilitation tip: ' : "Conseil d'animation : "}</strong>
                  {isEn
                    ? 'Solicit spontaneous answers from the group before revealing solutions. Remind that schools safeguard children via internal safety plans (PPMS).'
                    : "Faire émerger les réponses spontanées du groupe avant d'afficher la correction. Rappeler que le PPMS protège les enfants dans les écoles."}
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
                        ? 'bg-ok-soft border-ok-ink text-ok-ink shadow-sm'
                        : 'bg-ok-soft/50 border-ok-bright text-ok-ink'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-ok-ink text-[22px] mt-0.5 shrink-0">
                          check_circle
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[13px] font-bold text-ok-ink">
                            {isEn ? `Option ${opt.letter}: ` : `Option ${opt.letter} : `}{opt.text}
                          </span>
                        </div>
                      </div>
                      <span className="font-label text-[10px] px-1.5 py-0.5 rounded bg-card text-ok-ink uppercase font-bold shrink-0">
                        {isSelected ? (isEn ? 'SELECTED' : 'SÉLECTIONNÉ') : (isEn ? 'RECOMMENDED' : 'CONSEILLÉ')}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="ml-7 mt-2 p-2 rounded bg-card text-ink text-[12px] border border-ok-bright leading-relaxed">
                        <span className="font-label text-[11px] text-ok-ink uppercase font-bold block mb-0.5">
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
                      ? 'bg-danger-soft border-danger-ink'
                      : 'bg-subtle/60 border-line'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`material-symbols-outlined text-[20px] mt-0.5 shrink-0 ${
                      isSelected ? 'text-danger-ink' : 'text-ink-faint'
                    }`}>
                      {isSelected ? 'cancel' : 'radio_button_unchecked'}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className={`text-[13px] font-bold ${
                        isSelected ? 'text-danger-ink-strong' : 'text-ink'
                      }`}>
                        {isEn ? `Option ${opt.letter}: ` : `Option ${opt.letter} : `}{opt.text}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="ml-7 mt-2 p-2 rounded bg-card text-ink text-[12px] border border-danger-bright leading-relaxed">
                      <span className="font-label text-[11px] text-danger-ink uppercase font-bold block mb-0.5">
                        {opt.tag}
                      </span>
                      {opt.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <footer className="pt-2 flex items-center justify-between text-ink-muted text-[12px] font-label border-t border-line">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              {isEn ? 'Source: ' : 'Source : '}{currentScenario.source}
            </span>
            <button
              onClick={handleNextScenario}
              type="button"
              className="font-bold text-brand-ink flex items-center gap-1 hover:underline min-h-[44px] px-2 items-center"
            >
              <span>
                {isEn
                  ? `Next simulation (${scenarioIndex + 1}/${immersionScenarios.length})`
                  : `Simulation suivante (${scenarioIndex + 1}/${immersionScenarios.length})`}
              </span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </footer>
        </section>

        {/* Scénarios d'Entraînement Foyer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <h3 className="text-[18px] text-ink font-bold">
              {isEn ? 'Household Preparedness Scenarios' : "Scénarios d'Entraînement Foyer"}
            </h3>
            <span className="text-[12px] text-ink-muted">
              {isEn ? 'Modules strictly adhering to civil defense doctrines' : 'Modules certifiés conformes aux doctrines civiles'}
            </span>
          </div>
          <span className="font-label text-[11px] text-brand-ink font-bold uppercase bg-tint px-2 py-1 rounded">
            {isEn ? `${additionalModules.length} Available` : `${additionalModules.length} Disponibles`}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {additionalModules.map((mod) => (
            <article
              key={mod.id}
              className="rounded-xl bg-card p-4 shadow-sm flex flex-col gap-2.5 border border-line-strong"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`font-label text-[10px] px-2 py-0.5 rounded font-bold uppercase ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                    {mod.duration && (
                      <span className="font-label text-[11px] text-ink-muted">
                        {isEn ? 'Duration: ' : 'Durée : '}{mod.duration}
                      </span>
                    )}
                  </div>
                  <h4 className="text-[16px] text-ink font-bold leading-snug">
                    {mod.title}
                  </h4>
                </div>
                <div className="w-10 h-10 rounded-lg bg-tint flex items-center justify-center flex-shrink-0 text-ink">
                  <span className="material-symbols-outlined text-[22px]">
                    {mod.id === 'm-confinement-drill'
                      ? 'meeting_room'
                      : mod.id === 'm-radio-quiz'
                      ? 'verified'
                      : 'shower'}
                  </span>
                </div>
              </div>

              <p className="text-[13px] text-ink-muted leading-relaxed">
                {mod.description}
              </p>

              {mod.checklist && (
                <ul className="flex flex-col gap-1 py-1">
                  {mod.checklist.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-[12px] text-ink">
                      <span className="material-symbols-outlined text-[16px] text-ok-ink">
                        check
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {mod.keyDirective && (
                <div className="p-2.5 rounded-lg bg-subtle flex items-start gap-2 border border-line">
                  <span className="material-symbols-outlined text-brand-ink text-[18px] mt-0.5 shrink-0">
                    info
                  </span>
                  <p className="text-[12px] text-ink leading-snug">
                    <strong>{isEn ? 'Key directive: ' : 'Consigne clé : '}</strong> {mod.keyDirective}
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
                      openInteractiveQuiz(quizIrradiation);
                    } else if (mod.id === 'm-decontamination-quiz') {
                      openInteractiveQuiz(quizDecontamination);
                    }
                  }}
                  className={`w-full min-h-[48px] rounded-lg font-label text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm ${
                    mod.id === 'm-decontamination-quiz'
                      ? 'bg-brand text-white hover:bg-brand'
                      : 'bg-navy text-white hover:bg-navy-2'
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
        <section className="rounded-xl overflow-hidden bg-card shadow-sm flex flex-col border border-line-strong">
          <div className="relative w-full h-44 bg-navy">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnIiYmI9wvJF_SYUP_MdxrkSbd32EZA49I-5xsgxJwME3bbpvdkvsUSlPYFQ4hFORbdkjO5Q8wNuGKjaHC0JlwOgA6YwA5G367gXWWKYWH-m_17LfhCNI-f2xF9SJTBKGFdsSY3WOXOrJsZjIqWNZGsvUbMmLad-rhMVtWCpJVZvABkJS-ceEz5K_W-Rtwbq4oKOXoYbcoDaf7yP3VyG4HBcTs0h-jBgjjk70vJrjQ0hZaatuB05g"
              alt={isEn ? 'The Household Sealed 72h Kit' : 'Le Kit 72h Scellé du Foyer'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent flex items-end p-4">
              <div className="flex flex-col">
                <span className="font-label text-[10px] text-ok-bright uppercase font-bold tracking-wider">
                  {isEn ? 'Equipment Workshop' : 'Atelier Matériel'}
                </span>
                <span className="text-[17px] text-white font-bold">
                  {isEn ? 'The Household Sealed 72h Kit' : 'Le Kit 72h Scellé du Foyer'}
                </span>
              </div>
            </div>
          </div>
          <div className="p-3.5 flex items-center justify-between gap-3">
            <p className="text-[12px] text-ink-muted leading-snug">
              {isEn
                ? 'Check expiration dates of your filters, water rations, and batteries twice a year.'
                : "Vérifiez semestriellement les dates de péremption de vos filtres, réserves d'eau et piles."}
            </p>
            <button
              onClick={() => onOpenSubScreen({ type: 'protocol', id: 'confinement' })}
              type="button"
              className="flex-shrink-0 min-h-[44px] px-3.5 rounded-lg bg-tint hover:bg-tint text-ink font-label text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 border border-line-strong"
            >
              {isEn ? 'Inventory' : 'Inventaire'}
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Fundamental Pedagogical Disclaimer Card */}
        <footer className="rounded-xl bg-subtle p-4 flex flex-col gap-3 text-ink shadow-sm border border-line">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center flex-shrink-0 text-white">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <h4 className="text-[15px] font-bold text-ink leading-tight">
                {isEn ? 'Fundamental Civil Protection Reminder' : 'Rappel Pédagogique Fondamental'}
              </h4>
              <p className="text-[12px] text-ink-muted leading-relaxed">
                {isEn
                  ? 'No app or theoretical quiz replaces certified practical first responder training delivered by Civil Protection (PSC1, basic emergency gestures) nor the exclusive legal authority of government civil protection authorities in technological accidents or CBRN emergencies.'
                  : "Aucune application ni aucun quiz théorique ne remplace l'entraînement pratique délivré par la Sécurité Civile (formations PSC1, gestes qui sauvent) ni l'autorité exclusive du Préfet de département lors d'un accident technologique ou d'une crise NRBC."}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => window.print()}
              type="button"
              className="w-full min-h-[48px] bg-navy hover:bg-navy-2 text-white rounded-lg font-label text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:opacity-90 shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              {isEn ? 'Download Household Drill Memo (Offline PDF)' : "Télécharger le Mémo d'Exercice Foyer (PDF Hors-ligne)"}
            </button>
            <button
              onClick={onGoToGuides}
              type="button"
              className="w-full min-h-[48px] bg-card hover:bg-tint text-ink rounded-lg font-label text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-line-strong"
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              {isEn ? 'Consult Official Immediate Reflex Guides' : 'Consulter les Fiches Réflexes Officielles'}
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm"
        >
          <div className="bg-card max-w-sm w-full rounded-xl p-5 shadow-2xl border border-line-strong flex flex-col gap-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <div>
                <span className="font-label text-[10px] uppercase font-bold text-brand-ink">
                  {activeQuiz.authority}
                </span>
                <h3 className="text-[16px] font-bold text-ink leading-tight">
                  {activeQuiz.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveQuiz(null)}
                className="text-ink-muted hover:text-ink"
                aria-label={isEn ? 'Close quiz' : 'Fermer le quiz'}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {!quizSubmitted ? (
              <>
                <div className="flex items-center justify-between text-[11px] font-label text-ink-muted">
                  <span>
                    {isEn
                      ? `Question ${quizQuestionIndex + 1} of ${activeQuiz.questions.length}`
                      : `Question ${quizQuestionIndex + 1} sur ${activeQuiz.questions.length}`}
                  </span>
                  <span>
                    {isEn ? 'Current score: ' : 'Score actuel : '}{calculateQuizScore()} pts
                  </span>
                </div>

                <div className="w-full bg-tint h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand h-full rounded-full transition-all"
                    style={{
                      width: `${((quizQuestionIndex + 1) / activeQuiz.questions.length) * 100}%`,
                    }}
                  ></div>
                </div>

                <p className="text-[14px] font-bold text-ink leading-snug">
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
                            ? 'bg-navy text-white border-ink font-semibold'
                            : 'bg-subtle hover:bg-tint text-ink border-line'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-line">
                  <button
                    type="button"
                    disabled={quizQuestionIndex === 0}
                    onClick={() => setQuizQuestionIndex((i) => i - 1)}
                    className="h-10 px-3 rounded bg-subtle disabled:opacity-40 text-ink font-label text-[11px] font-bold uppercase"
                  >
                    {isEn ? 'Previous' : 'Précédent'}
                  </button>

                  {quizQuestionIndex < activeQuiz.questions.length - 1 ? (
                    <button
                      type="button"
                      disabled={quizAnswers[quizQuestionIndex] === undefined}
                      onClick={() => setQuizQuestionIndex((i) => i + 1)}
                      className="h-10 px-4 rounded bg-navy disabled:opacity-40 text-white font-label text-[11px] font-bold uppercase shadow-sm"
                    >
                      {isEn ? 'Next' : 'Suivant'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={quizAnswers[quizQuestionIndex] === undefined}
                      onClick={() => setQuizSubmitted(true)}
                      className="h-10 px-4 rounded bg-brand text-white font-label text-[11px] font-bold uppercase shadow-sm"
                    >
                      {isEn ? 'Submit Quiz' : 'Valider le quiz'}
                    </button>
                  )}
                </div>
              </>
            ) : (
              // Quiz Results View
              <div className="flex flex-col gap-3">
                <div className="bg-ok-soft p-4 rounded-xl text-center text-ok-ink border border-ok-ink">
                  <span className="material-symbols-outlined text-[36px] text-ok-ink">
                    emoji_events
                  </span>
                  <h4 className="text-[18px] font-bold">
                    Score : {calculateQuizScore()} / {activeQuiz.questions.length}
                  </h4>
                  <p className="text-[12px] font-medium mt-0.5">
                    {calculateQuizScore() === activeQuiz.questions.length
                      ? (isEn
                          ? 'Congratulations! You master civil defense emergency instincts.'
                          : 'Félicitations ! Vous maîtrisez les automatismes de sécurité civile.')
                      : (isEn
                          ? 'Good practice! Consult the reflex guides to strengthen your habits.'
                          : 'Bonne révision. Consultez les fiches réflexes pour consolider vos réflexes.')}
                  </p>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {activeQuiz.questions.map((q, idx) => {
                    const isRight = quizAnswers[idx] === q.correctIndex;
                    return (
                      <div key={idx} className="p-2.5 rounded-lg bg-subtle text-[12px] border border-line">
                        <p className="font-bold text-ink flex items-center gap-1.5">
                          <span
                            className={`material-symbols-outlined text-[16px] ${
                              isRight ? 'text-ok-ink' : 'text-danger-ink'
                            }`}
                          >
                            {isRight ? 'check_circle' : 'cancel'}
                          </span>
                          {q.question}
                        </p>
                        <p className="mt-1 text-ink-muted">{q.explanation}</p>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveQuiz(null)}
                  className="w-full h-11 rounded-lg bg-navy text-white font-label text-[12px] font-bold uppercase"
                >
                  {isEn ? 'Close' : 'Fermer'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Console d'Animation & Exercice Collectif Formateur */}
      {showTrainerModal && (
        <TrainerSessionModal
          onClose={() => setShowTrainerModal(false)}
          onCompetencyMastered={recordCompetency}
        />
      )}
    </div>
  );
};
