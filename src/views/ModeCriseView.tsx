import React, { useState, useEffect, useRef } from 'react';
import { EmergencyCall, SubScreen } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface ModeCriseViewProps {
  onBack: () => void;
  onOpenCallModal: (call: EmergencyCall) => void;
  onOpenSubScreen: (screen: SubScreen) => void;
}

type CrisisScenario = 'inconnu' | 'chimique' | 'nucleaire' | 'biologique';
type CrisisCountry = 'fr' | 'be' | 'ch' | 'lu';

interface CountryEmergencyData {
  code: CrisisCountry;
  name: string;
  flag: string;
  numbers: {
    number: string;
    label: string;
    desc: string;
    role: string;
  }[];
}

const EMERGENCY_COUNTRIES: CountryEmergencyData[] = [
  {
    code: 'fr',
    name: 'France',
    flag: '🇫🇷',
    numbers: [
      { number: '15', label: 'SAMU', desc: 'Détresse vitale, malaise, intoxication sévère', role: 'Médical' },
      { number: '18', label: 'POMPIERS', desc: 'Incendie, explosion, fuite de gaz, sauvetage', role: 'Sinistre' },
      { number: '17', label: 'POLICE / GENDARMERIE', desc: 'Sécurité publique, ordre, bouclage', role: 'Sécurité' },
      { number: '112', label: '112 EUROPE', desc: 'Numéro d\'urgence européen universel (même sans SIM)', role: 'Toutes urgences' },
      { number: '114', label: '114 SMS', desc: 'Numéro silencieux par SMS pour personnes sourdes ou discrétion', role: 'Silencieux' },
    ]
  },
  {
    code: 'be',
    name: 'Belgique',
    flag: '🇧🇪',
    numbers: [
      { number: '112', label: '112 SECOURS', desc: 'Ambulance et pompiers (gratuit 24/7)', role: 'Secours' },
      { number: '100', label: '100 MÉDICAL', desc: 'Aide médicale urgente et pompiers', role: 'Médical' },
      { number: '101', label: '101 POLICE', desc: 'Police fédérale et interventions urgentes', role: 'Police' },
      { number: '070245245', label: 'ANTIPOISON', desc: 'Centre antipoisons belge (intoxications aiguës)', role: 'Toxicologie' },
    ]
  },
  {
    code: 'ch',
    name: 'Suisse',
    flag: '🇨🇭',
    numbers: [
      { number: '144', label: '144 AMBULANCE', desc: 'Urgences médicales et sauvetage sanitaire', role: 'Médical' },
      { number: '118', label: '118 POMPIERS', desc: 'Incendie, sinistres industriels et chimiques', role: 'Pompiers' },
      { number: '117', label: '117 POLICE', desc: 'Police cantonale et ordre public', role: 'Police' },
      { number: '145', label: '145 TOX INFO', desc: 'Centre national toxicologique suisse', role: 'Toxicologie' },
    ]
  },
  {
    code: 'lu',
    name: 'Luxembourg',
    flag: '🇱🇺',
    numbers: [
      { number: '112', label: '112 SECOURS', desc: 'Corps grand-ducal d\'incendie et de secours (CGDIS)', role: 'Secours' },
      { number: '113', label: '113 POLICE', desc: 'Police grand-ducale', role: 'Police' },
    ]
  }
];

export const ModeCriseView: React.FC<ModeCriseViewProps> = ({
  onBack,
  onOpenCallModal,
  onOpenSubScreen
}) => {
  // Scénario sélectionné : Par défaut 'inconnu' pour mise à l'abri immédiate SANS retard de diagnostic
  const [selectedScenario, setSelectedScenario] = useState<CrisisScenario>('inconnu');
  const [activeAction, setActiveAction] = useState<
    'none' | 'confiner' | 'evacuer' | 'decontamination' | 'appeler'
  >('confiner'); // Par défaut confiner déployé pour réflexe immédiat

  const [selectedCountry, setSelectedCountry] = useState<CrisisCountry>(() => {
    try {
      const saved = localStorage.getItem('nrbcor_crisis_country');
      if (saved && ['fr', 'be', 'ch', 'lu'].includes(saved)) return saved as CrisisCountry;
    } catch {}
    return 'fr';
  });

  const [isTorchActive, setIsTorchActive] = useState(false);
  const [speechState, setSpeechState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [deconTimer, setDeconTimer] = useState<number | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const countryData = EMERGENCY_COUNTRIES.find((c) => c.code === selectedCountry) || EMERGENCY_COUNTRIES[0];

  // Minuteur de décontamination (15 minutes de rinçage recommandé par la Sécurité Civile)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (deconTimer !== null && deconTimer > 0) {
      interval = setInterval(() => {
        setDeconTimer((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [deconTimer]);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleStartDeconTimer = () => {
    triggerHaptic('success');
    setDeconTimer(15 * 60); // 15 minutes
  };

  const handleStopDeconTimer = () => {
    triggerHaptic('medium');
    setDeconTimer(null);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Controllable Speech Synthesis (Play, Pause, Resume, Stop)
  const getScenarioSpokenText = () => {
    if (selectedScenario === 'chimique') {
      return "Alerte Risque Chimique ou Nuage Toxique. Consigne numéro un : rentrez immédiatement dans le bâtiment en dur le plus proche. Coupez toute ventilation mécanique, hottes et climatisation. Fermez portes et fenêtres et calfeutrez les jointures avec de l'adhésif large. Respirez à travers un linge humide. N'allez pas chercher vos enfants à l'école. Écoutez France Bleu FM.";
    }
    if (selectedScenario === 'nucleaire') {
      return "Alerte Risque Nucléaire ou Radiologique. Consigne vitale : confinez-vous immédiatement dans un bâtiment en maçonnerie lourde, idéalement au centre ou au sous-sol. Coupez les aérations. Ne prenez aucun comprimé d'iode sans ordre formel et explicite du Préfet. Lavez-vous à l'eau tiède sans frotter en cas de doute de dépôt de poussières. Écoutez la radio publique France Bleu.";
    }
    if (selectedScenario === 'biologique') {
      return "Alerte Risque Biologique ou Aérosol Infectieux. Isolez-vous dans une pièce dédiée. Portez un masque filtrant adapté. Lavez-vous les mains fréquemment. Ne partagez aucun ustensile. Suivez les instructions sanitaires diffusées par les autorités.";
    }
    // Inconnu / Alerte générale (Doctrine universelle)
    return "Alerte de Sécurité Civile non identifiée. Ne perdez pas de temps à diagnostiquer le risque. Premier réflexe immédiat : confinez-vous dans le bâtiment en dur le plus proche. Coupez toute ventilation et climatisation. Fermez et calfeutrez portes et fenêtres. N'allez pas chercher vos enfants à l'école, ils sont pris en charge par le plan de mise en sûreté. Écoutez France Bleu sur récepteur radio à piles. Ne prenez aucun comprimé d'iode de manière spontanée sans ordre formel de la Préfecture.";
  };

  const handlePlaySpeech = () => {
    triggerHaptic('medium');
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speechState === 'paused') {
      window.speechSynthesis.resume();
      setSpeechState('playing');
      return;
    }

    window.speechSynthesis.cancel();
    const text = getScenarioSpokenText();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.95;
    utterance.onend = () => setSpeechState('idle');
    utterance.onerror = () => setSpeechState('idle');

    speechRef.current = utterance;
    setSpeechState('playing');
    window.speechSynthesis.speak(utterance);
  };

  const handlePauseSpeech = () => {
    triggerHaptic('light');
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setSpeechState('paused');
    }
  };

  const handleStopSpeech = () => {
    triggerHaptic('light');
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeechState('idle');
    }
  };

  const handleSelectCountry = (country: CrisisCountry) => {
    setSelectedCountry(country);
    try {
      localStorage.setItem('nrbcor_crisis_country', country);
    } catch {}
    triggerHaptic('light');
  };

  // Mode lampe torche / écran blanc stroboscopique pour blackout
  if (isTorchActive) {
    return (
      <div
        onClick={() => {
          setIsTorchActive(false);
          triggerHaptic('medium');
        }}
        className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-between p-6 cursor-pointer select-none"
      >
        <div className="pt-8 text-center text-black font-['Space_Grotesk'] text-[16px] font-extrabold uppercase">
          Éclairage d'urgence blanc actif
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-[64px] text-black animate-pulse">
            light_mode
          </span>
          <p className="text-black font-['Space_Grotesk'] text-[14px] font-bold text-center">
            Touchez n'importe où pour revenir au Mode Crise
          </p>
          <span className="text-[12px] text-gray-700 bg-gray-200 px-3 py-1 rounded-full font-bold">
            ZÉRO BOUGIE EN MILIEU CONFINÉ
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsTorchActive(false)}
          className="w-full max-w-sm h-14 bg-black text-white rounded-2xl font-['Space_Grotesk'] font-bold text-[16px] uppercase tracking-wider"
        >
          Éteindre l'éclairage
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#050b14] text-white flex flex-col pb-28 pt-2 select-none">
      {/* Bandeau d'Urgence Supérieur */}
      <div className="max-w-2xl mx-auto w-full px-3 py-2 flex items-center justify-between border-b border-red-900/60 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
          </span>
          <div>
            <h1 className="font-['Space_Grotesk'] text-[16px] font-extrabold tracking-wider text-red-400 uppercase">
              Mode Crise Immédiat
            </h1>
            <span className="text-[10px] text-gray-400 font-['Space_Grotesk'] uppercase font-bold tracking-widest">
              Réflexes vitaux • Sans fioriture
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Bouton Lampe Torche Écran */}
          <button
            type="button"
            onClick={() => {
              setIsTorchActive(true);
              triggerHaptic('medium');
            }}
            title="Activer l'écran blanc pour s'éclairer sans bougie"
            className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[22px]">flashlight_on</span>
          </button>

          {/* Bouton Quitter */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onBack();
            }}
            className="h-10 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-[12px] font-['Space_Grotesk'] font-bold uppercase transition-colors"
          >
            Quitter
          </button>
        </div>
      </div>

      {/* RAPPEL DE PRIMAUTÉ ABSOLUE DES AUTORITÉS (SÉCURITÉ CIVILE) */}
      <div className="max-w-2xl mx-auto w-full px-3 mt-2">
        <div className="p-2.5 bg-red-950/80 border-2 border-red-600 rounded-xl flex items-center gap-2 text-[11px] text-white">
          <span className="material-symbols-outlined text-[20px] text-red-400 shrink-0">emergency</span>
          <span className="leading-snug">
            <strong>PRIMAUTÉ DES POUVOIRS PUBLICS :</strong> Les ordres de la Préfecture, des forces de l'ordre et des pompiers priment en toutes circonstances sur cette application.
          </span>
        </div>
      </div>

      {/* SÉLECTEUR DE SCÉNARIO AVEC OPTION INCONNU PAR DÉFAUT */}
      <div className="max-w-2xl mx-auto w-full px-3 mt-3 flex flex-col gap-1.5">
        <span className="text-[10px] font-['Space_Grotesk'] text-gray-400 uppercase font-bold tracking-wider">
          Nature de l'événement (Ne jamais retarder la mise à l'abri pour diagnostiquer) :
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setSelectedScenario('inconnu');
              triggerHaptic('light');
            }}
            className={`p-2 rounded-xl text-left border flex flex-col gap-0.5 transition-all ${
              selectedScenario === 'inconnu'
                ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-300'
                : 'bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800'
            }`}
          >
            <span className="font-['Space_Grotesk'] text-[11px] font-black uppercase">
              ❓ Inconnu / Alerte
            </span>
            <span className="text-[9px] opacity-80 leading-tight">
              Réflexe universel
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedScenario('chimique');
              triggerHaptic('light');
            }}
            className={`p-2 rounded-xl text-left border flex flex-col gap-0.5 transition-all ${
              selectedScenario === 'chimique'
                ? 'bg-amber-600 text-white border-amber-400 ring-2 ring-amber-300'
                : 'bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800'
            }`}
          >
            <span className="font-['Space_Grotesk'] text-[11px] font-black uppercase">
              ☣️ Chimique
            </span>
            <span className="text-[9px] opacity-80 leading-tight">
              Gaz / Fuite Seveso
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedScenario('nucleaire');
              triggerHaptic('light');
            }}
            className={`p-2 rounded-xl text-left border flex flex-col gap-0.5 transition-all ${
              selectedScenario === 'nucleaire'
                ? 'bg-yellow-600 text-black border-yellow-400 ring-2 ring-yellow-300'
                : 'bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800'
            }`}
          >
            <span className="font-['Space_Grotesk'] text-[11px] font-black uppercase">
              ☢️ Nucléaire
            </span>
            <span className="text-[9px] opacity-80 leading-tight">
              Rejet CNPE / Retombées
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedScenario('biologique');
              triggerHaptic('light');
            }}
            className={`p-2 rounded-xl text-left border flex flex-col gap-0.5 transition-all ${
              selectedScenario === 'biologique'
                ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-300'
                : 'bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800'
            }`}
          >
            <span className="font-['Space_Grotesk'] text-[11px] font-black uppercase">
              🦠 Biologique
            </span>
            <span className="text-[9px] opacity-80 leading-tight">
              Bio-aérosol / Épidémie
            </span>
          </button>
        </div>
      </div>

      {/* SYNTHÈSE VOCALE CONTRÔLABLE & RADIO OFFICIELLE */}
      <div className="max-w-2xl mx-auto w-full px-3 mt-3">
        <div className="p-3 bg-[#0a1526] rounded-xl border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">radio</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-['Space_Grotesk'] text-[12px] font-bold text-blue-300 truncate">
                RADIO D'URGENCE : France Bleu FM
              </span>
              <span className="text-[10px] text-gray-300 truncate">
                Seule source officielle opérationnelle en blackout
              </span>
            </div>
          </div>

          {/* Contrôleur Vocal Avancé (Play / Pause / Stop) */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
            {speechState === 'idle' ? (
              <button
                type="button"
                onClick={handlePlaySpeech}
                className="h-9 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">volume_up</span>
                <span>Lire consignes</span>
              </button>
            ) : (
              <div className="flex items-center gap-1 bg-gray-900 p-1 rounded-lg border border-gray-700">
                {speechState === 'playing' ? (
                  <button
                    type="button"
                    onClick={handlePauseSpeech}
                    className="h-8 px-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-['Space_Grotesk'] text-[10px] font-bold uppercase flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">pause</span>
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePlaySpeech}
                    className="h-8 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-['Space_Grotesk'] text-[10px] font-bold uppercase flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                    <span>Reprendre</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleStopSpeech}
                  className="h-8 px-2 bg-red-700 hover:bg-red-600 text-white rounded font-['Space_Grotesk'] text-[10px] font-bold uppercase flex items-center"
                >
                  <span className="material-symbols-outlined text-[15px]">stop</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LES 4 GROS BOUTONS D'ACTION MASSIVES */}
      <div className="max-w-2xl mx-auto w-full px-3 flex flex-col gap-3 mt-3 flex-1">
        {/* BOUTON 1 : CONFINER IMMÉDIATEMENT */}
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('warning');
              setActiveAction(activeAction === 'confiner' ? 'none' : 'confiner');
            }}
            className={`w-full min-h-[82px] p-4 rounded-2xl flex items-center justify-between gap-3 text-left transition-all active:scale-[0.99] border-2 cursor-pointer shadow-lg ${
              activeAction === 'confiner'
                ? 'bg-[#0024a8] border-[#98f6c5] text-white'
                : 'bg-[#00135c] hover:bg-[#001d87] border-[#2952d7] text-white'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-[#82b1ff] flex items-center justify-center shrink-0 border border-blue-400/30">
                <span className="material-symbols-outlined text-[34px]">meeting_room</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-['Space_Grotesk'] text-[11px] tracking-wider text-blue-300 uppercase font-black">
                  Action Prioritaire 1
                </span>
                <span className="text-[20px] sm:text-[22px] font-black tracking-tight leading-tight">
                  CONFINER EN DUR
                </span>
                <span className="text-[12px] text-blue-200 mt-0.5 line-clamp-1">
                  Rentrer, fermer, calfeutrer et couper les VMC
                </span>
              </div>
            </div>

            <span className="material-symbols-outlined text-[28px] text-blue-300 shrink-0">
              {activeAction === 'confiner' ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {/* Volet Déployé Confinement */}
          {activeAction === 'confiner' && (
            <div className="mt-2 p-4 bg-[#081838] border border-blue-500/40 rounded-2xl flex flex-col gap-3 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-3 bg-[#0c224e] rounded-xl border border-blue-400/20">
                  <div className="flex items-center gap-2 text-blue-300 font-['Space_Grotesk'] font-bold text-[13px]">
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-black flex items-center justify-center text-[11px] font-black">1</span>
                    <span>Rentrer en dur</span>
                  </div>
                  <p className="text-[12px] text-gray-200 mt-1">
                    Bâtiment maçonné. Éviter les véhicules et tentes qui n'offrent aucune étanchéité.
                  </p>
                </div>

                <div className="p-3 bg-[#0c224e] rounded-xl border border-blue-400/20">
                  <div className="flex items-center gap-2 text-blue-300 font-['Space_Grotesk'] font-bold text-[13px]">
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-black flex items-center justify-center text-[11px] font-black">2</span>
                    <span>Couper la VMC</span>
                  </div>
                  <p className="text-[12px] text-gray-200 mt-1">
                    Disjoncteur général VMC, fermer hottes, climatisations et trappes de cheminée.
                  </p>
                </div>

                <div className="p-3 bg-[#0c224e] rounded-xl border border-blue-400/20">
                  <div className="flex items-center gap-2 text-blue-300 font-['Space_Grotesk'] font-bold text-[13px]">
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-black flex items-center justify-center text-[11px] font-black">3</span>
                    <span>Calfeutrer</span>
                  </div>
                  <p className="text-[12px] text-gray-200 mt-1">
                    Ruban adhésif large sur jointures de fenêtres et linges humides sous les portes.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl flex items-center gap-2 text-[12px] text-red-200 font-semibold">
                <span className="material-symbols-outlined text-[20px] text-red-400 shrink-0">warning</span>
                <span>
                  <strong>NE PAS ALLER CHERCHER LES ENFANTS À L'ÉCOLE :</strong> Ils sont mis à l'abri par les enseignants selon le PPMS. Ne pas les exposer au panache toxique.
                </span>
              </div>

              {selectedScenario === 'nucleaire' && (
                <div className="p-3 bg-yellow-950/60 border border-yellow-500/50 rounded-xl text-[12px] text-yellow-200">
                  <strong>AVERTISSEMENT IODE STABLE :</strong> Ne prenez AUCUN comprimé d'iode sans ordre explicite du Préfet. L'iode est inutile si le rejet ne contient pas d'iode radioactif.
                </div>
              )}

              <button
                type="button"
                onClick={() => onOpenSubScreen({ type: 'confinement-guide' })}
                className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-['Space_Grotesk'] text-[13px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <span>Consulter le Guide Calfeutrage Complet</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          )}
        </div>

        {/* BOUTON 2 : ÉVACUER (UNIQUEMENT SUR ORDRE) */}
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('warning');
              setActiveAction(activeAction === 'evacuer' ? 'none' : 'evacuer');
            }}
            className={`w-full min-h-[82px] p-4 rounded-2xl flex items-center justify-between gap-3 text-left transition-all active:scale-[0.99] border-2 cursor-pointer shadow-lg ${
              activeAction === 'evacuer'
                ? 'bg-[#9a3412] border-[#fef08a] text-white'
                : 'bg-[#5c1d04] hover:bg-[#7c2d12] border-[#ea580c] text-white'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-[#fed7aa] flex items-center justify-center shrink-0 border border-amber-400/30">
                <span className="material-symbols-outlined text-[34px]">directions_run</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-['Space_Grotesk'] text-[11px] tracking-wider text-amber-300 uppercase font-black">
                  Action Conditionnelle 2
                </span>
                <span className="text-[20px] sm:text-[22px] font-black tracking-tight leading-tight">
                  ÉVACUER (SUR ORDRE)
                </span>
                <span className="text-[12px] text-amber-200 mt-0.5 line-clamp-1">
                  Uniquement si le Préfet l'ordonne formellement
                </span>
              </div>
            </div>

            <span className="material-symbols-outlined text-[28px] text-amber-300 shrink-0">
              {activeAction === 'evacuer' ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {/* Volet Déployé Évacuation */}
          {activeAction === 'evacuer' && (
            <div className="mt-2 p-4 bg-[#2e1005] border border-orange-500/40 rounded-2xl flex flex-col gap-3 animate-fadeIn">
              <div className="p-3 bg-red-900/50 border border-red-500/50 rounded-xl">
                <span className="font-['Space_Grotesk'] text-[13px] font-black uppercase text-amber-300 block mb-1">
                  INTERDICTION DE FUITE SPONTANÉE
                </span>
                <p className="text-[12px] text-gray-200 leading-relaxed">
                  Prendre votre véhicule sans ordre officiel vous expose directement au panache toxique et encombre les axes réservés aux véhicules de secours (pompiers, SMUR).
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-amber-300">
                  Emporter strictement :
                </span>
                <ul className="text-[12px] text-gray-200 space-y-1.5 list-disc pl-5">
                  <li>Sac d'urgence 72h préparé (eau en gourde, vivres, lampe LED).</li>
                  <li>Pièces d'identité, carnet de santé et ordonnances vitales.</li>
                  <li>Animaux en caisse rigide fermée avec laisse et muselière.</li>
                  <li>Vêtements couvrants (manches longues, veste imperméable, masque/chapeau).</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onOpenSubScreen({ type: 'preparation' as any })}
                className="w-full h-11 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-['Space_Grotesk'] text-[13px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <span>Vérifier mon Sac d'Urgence 72h</span>
                <span className="material-symbols-outlined text-[16px]">backpack</span>
              </button>
            </div>
          )}
        </div>

        {/* BOUTON 3 : DÉCONTAMINATION D'URGENCE */}
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('warning');
              setActiveAction(activeAction === 'decontamination' ? 'none' : 'decontamination');
            }}
            className={`w-full min-h-[82px] p-4 rounded-2xl flex items-center justify-between gap-3 text-left transition-all active:scale-[0.99] border-2 cursor-pointer shadow-lg ${
              activeAction === 'decontamination'
                ? 'bg-[#005236] border-[#98f6c5] text-white'
                : 'bg-[#002c1b] hover:bg-[#003d27] border-[#007b53] text-white'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-[#98f6c5] flex items-center justify-center shrink-0 border border-emerald-400/30">
                <span className="material-symbols-outlined text-[34px]">sanitizer</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-['Space_Grotesk'] text-[11px] tracking-wider text-emerald-300 uppercase font-black">
                  Action Réflexe 3
                </span>
                <span className="text-[20px] sm:text-[22px] font-black tracking-tight leading-tight">
                  DÉCONTAMINATION
                </span>
                <span className="text-[12px] text-emerald-200 mt-0.5 line-clamp-1">
                  Retrait vêtements sans secouer et rinçage 15 min
                </span>
              </div>
            </div>

            <span className="material-symbols-outlined text-[28px] text-emerald-300 shrink-0">
              {activeAction === 'decontamination' ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {/* Volet Déployé Décontamination */}
          {activeAction === 'decontamination' && (
            <div className="mt-2 p-4 bg-[#001f13] border border-emerald-500/40 rounded-2xl flex flex-col gap-3 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-3 bg-[#003822] rounded-xl border border-emerald-400/20">
                  <span className="text-emerald-300 font-['Space_Grotesk'] font-bold text-[12px] block">
                    1. Déshabillage
                  </span>
                  <p className="text-[11px] text-gray-200 mt-1">
                    Enlever les vêtements par le haut sans secouer (élimine 80 à 90% des toxiques ou retombées).
                  </p>
                </div>

                <div className="p-3 bg-[#003822] rounded-xl border border-emerald-400/20">
                  <span className="text-emerald-300 font-['Space_Grotesk'] font-bold text-[12px] block">
                    2. Double Sac
                  </span>
                  <p className="text-[11px] text-gray-200 mt-1">
                    Enfermer les vêtements dans deux sacs poubelle superposés et scotcher hermétiquement.
                  </p>
                </div>

                <div className="p-3 bg-[#003822] rounded-xl border border-emerald-400/20">
                  <span className="text-emerald-300 font-['Space_Grotesk'] font-bold text-[12px] block">
                    3. Douche Tiède
                  </span>
                  <p className="text-[11px] text-gray-200 mt-1">
                    Eau tiède + savon doux. NE PAS FROTTER pour ne pas ouvrir les pores cutanés.
                  </p>
                </div>
              </div>

              {/* Minuteur Rinçage 15 minutes */}
              <div className="p-3 bg-[#002f1d] rounded-xl border border-emerald-400/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px] text-emerald-400">timer</span>
                  <div>
                    <span className="font-['Space_Grotesk'] text-[12px] font-bold text-white block">
                      Minuteur de rinçage recommandé (15 min)
                    </span>
                    <span className="text-[18px] font-['Space_Grotesk'] font-black text-emerald-300">
                      {deconTimer !== null ? formatTimer(deconTimer) : '15:00'}
                    </span>
                  </div>
                </div>

                {deconTimer === null ? (
                  <button
                    type="button"
                    onClick={handleStartDeconTimer}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase transition-colors"
                  >
                    Démarrer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopDeconTimer}
                    className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase transition-colors"
                  >
                    Arrêter
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => onOpenSubScreen({ type: 'deshabillage' })}
                className="w-full h-11 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-['Space_Grotesk'] text-[13px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <span>Guide Déshabillage Pas-à-Pas (8 étapes)</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          )}
        </div>

        {/* BOUTON 4 : APPELER LES SECOURS (ADAPTÉ AU PAYS CHOISI) */}
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('warning');
              setActiveAction(activeAction === 'appeler' ? 'none' : 'appeler');
            }}
            className={`w-full min-h-[82px] p-4 rounded-2xl flex items-center justify-between gap-3 text-left transition-all active:scale-[0.99] border-2 cursor-pointer shadow-lg ${
              activeAction === 'appeler'
                ? 'bg-[#ba1a1a] border-white text-white'
                : 'bg-[#7a0b0b] hover:bg-[#8f1212] border-[#ff897d] text-white'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-red-500/30 text-white flex items-center justify-center shrink-0 border border-red-300/40">
                <span className="material-symbols-outlined text-[34px]">call</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-['Space_Grotesk'] text-[11px] tracking-wider text-red-200 uppercase font-black">
                  Liaisons d'Urgence ({countryData.flag} {countryData.name})
                </span>
                <span className="text-[20px] sm:text-[22px] font-black tracking-tight leading-tight">
                  APPELER LES SECOURS
                </span>
                <span className="text-[12px] text-red-200 mt-0.5 line-clamp-1">
                  {countryData.numbers.map((n) => n.number).join(' • ')}
                </span>
              </div>
            </div>

            <span className="material-symbols-outlined text-[28px] text-red-200 shrink-0">
              {activeAction === 'appeler' ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {/* Volet Déployé Appels d'Urgence avec sélecteur de pays */}
          {activeAction === 'appeler' && (
            <div className="mt-2 p-4 bg-[#380606] border border-red-500/50 rounded-2xl flex flex-col gap-3 animate-fadeIn">
              {/* Sélecteur de pays */}
              <div className="flex items-center justify-between gap-2 border-b border-red-800 pb-2">
                <span className="text-[11px] font-['Space_Grotesk'] uppercase text-red-200 font-bold">
                  Pays d'intervention :
                </span>
                <div className="flex gap-1">
                  {EMERGENCY_COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleSelectCountry(c.code)}
                      className={`px-2 py-1 rounded text-[11px] font-['Space_Grotesk'] font-bold transition-all ${
                        selectedCountry === c.code
                          ? 'bg-red-600 text-white shadow'
                          : 'bg-red-950/80 text-gray-300 hover:bg-red-900'
                      }`}
                    >
                      {c.flag} {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <span className="text-[11px] text-red-200 italic">
                Ne pas encombrer les lignes sauf urgence vitale avérée :
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {countryData.numbers.map((num) => (
                  <button
                    key={num.number}
                    type="button"
                    onClick={() =>
                      onOpenCallModal({
                        number: num.number,
                        name: `${num.number} - ${num.label}`,
                        subtitle: num.role,
                        desc: num.desc
                      })
                    }
                    className="p-3 bg-red-900/60 hover:bg-red-800 rounded-xl border border-red-400/40 flex items-center gap-3 text-left active:scale-95 transition-all"
                  >
                    <span className="font-['Space_Grotesk'] text-[24px] font-black text-white shrink-0">
                      {num.number}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-['Space_Grotesk'] text-[12px] font-bold text-white truncate">
                        {num.label}
                      </span>
                      <span className="text-[10px] text-red-200 line-clamp-1">
                        {num.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Accès Rapide Carte Hors-Ligne des Périmètres */}
        <button
          type="button"
          onClick={() => onOpenSubScreen({ type: 'carte-perimetres' as any })}
          className="w-full mt-1 p-3.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/50 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/30">
              <span className="material-symbols-outlined text-[22px]">radar</span>
            </div>
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-[13px] font-bold text-white">
                Carte Hors-Ligne des Périmètres (Radar PPI)
              </span>
              <span className="text-[11px] text-gray-400">
                Vérifier si vous êtes dans un rayon de 5 km, 20 km ou 50 km d'un CNPE ou Seveso
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[20px] text-gray-400">arrow_forward</span>
        </button>

        {/* Accès Fiche de Doctrine Complète (sans surcharger l'écran initial) */}
        <button
          type="button"
          onClick={() => onOpenSubScreen({ type: 'tracabilite' as any })}
          className="w-full p-3 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/30 rounded-2xl flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-blue-300">menu_book</span>
            <span className="font-['Space_Grotesk'] text-[12px] font-bold text-blue-200">
              Consulter la Fiche de Doctrine Officielle Complète
            </span>
          </div>
          <span className="material-symbols-outlined text-[18px] text-blue-300">open_in_new</span>
        </button>
      </div>
    </div>
  );
};
