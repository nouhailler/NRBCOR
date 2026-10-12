import React, { useState, useEffect } from 'react';
import { EmergencyCall } from '../types';

interface DeshabillageViewProps {
  onBack: () => void;
  onOpenCallModal: (call: EmergencyCall) => void;
}

interface StepItem {
  id: number;
  title: string;
  tag: string;
  tagColor: string;
  icon: string;
  desc: string;
  warning?: string;
  actions: string[];
}

const STEPS: StepItem[] = [
  {
    id: 1,
    title: "Sas d'entrée / Zone Tampon",
    tag: "Zone Souillée",
    tagColor: "bg-[#ffdad6] text-[#ba1a1a]",
    icon: "door_front",
    desc: "Arrêtez-vous immédiatement dès le seuil de votre logement (vestibule, garage ou balcon). Ne pénétrez sous aucun prétexte dans les pièces de vie ou la zone de confinement avec vos vêtements d'extérieur potentiellement contaminés.",
    warning: "Interdiction formelle de secouer ou battre les vêtements pour éviter la mise en suspension d'aérosols ou de poussières toxiques.",
    actions: [
      "Délimitez une zone au sol avec un plastique ou un drap si possible",
      "Éloignez les autres membres du foyer à au moins 3 mètres",
      "Gardez votre protection respiratoire (masque FFP3 ou foulard) jusqu'à l'étape 4"
    ]
  },
  {
    id: 2,
    title: "Retrait des chaussures",
    tag: "Semelles",
    tagColor: "bg-[#e4efff] text-[#001126]",
    icon: "footprint",
    desc: "Déchaussez-vous sans toucher la semelle extérieure ni la tige externe avec les mains nues. Laissez les chaussures sur le pas de la porte.",
    actions: [
      "Décroisez les lacets délicatement sans projection",
      "Enlevez les chaussures en les maintenant par l'intérieur du contrefort",
      "Déposez-les dans un premier sac poubelle épais"
    ]
  },
  {
    id: 3,
    title: "Déshabillage par retournement (de haut en bas)",
    tag: "Vêtements",
    tagColor: "bg-[#dee1ff] text-[#001258]",
    icon: "checkroom",
    desc: "Retirez les vêtements de haut en bas en les roulant sur l'envers. La face extérieure potentiellement contaminée doit se retrouver emprisonnée à l'intérieur du vêtement enroulé.",
    warning: "Pour les pulls ou t-shirts qui s'enfilent par la tête : fendez-les ou coupez-les avec des ciseaux si possible pour éviter de frotter la matière contaminée contre les yeux, la bouche et le nez.",
    actions: [
      "Manteau/veste : glissez les bras et enroulez les manches sur l'envers",
      "Pantalons : déroulez vers le bas jusqu'aux chevilles sans frotter la peau",
      "Chaussettes : retirez en les retournant sur elles-mêmes"
    ]
  },
  {
    id: 4,
    title: "Retrait du masque et des lunettes",
    tag: "Protection Faciale",
    tagColor: "bg-[#98f6c5] text-[#005236]",
    icon: "masks",
    desc: "Retirez la protection respiratoire en dernier. Saisissez uniquement les élastiques à l'arrière de la tête sans jamais toucher la face filtrante avant.",
    actions: [
      "Penchez la tête légèrement vers l'avant",
      "Tirez l'élastique inférieur puis supérieur vers l'avant",
      "Laissez tomber le masque directement dans le sac sans le comprimer"
    ]
  },
  {
    id: 5,
    title: "Double ensachage hermétique",
    tag: "Confinement Déchets",
    tagColor: "bg-[#ffdad6] text-[#93000a]",
    icon: "shopping_bag",
    desc: "Placez tous les effets retirés dans un sac plastique épais (sac poubelle 50L ou 100L). Fermez-le hermétiquement avec du ruban adhésif toilé ou un nœud serré, puis insérez-le dans un second sac propre.",
    warning: "Ne jetez jamais ces sacs dans les ordures ménagères publiques. Stockez-les hors du logement (garage ou balcon) en attendant les consignes des services de secours.",
    actions: [
      "Chassez doucement l'excès d'air sans inhaler",
      "Scellez le premier sac avec du ruban adhésif",
      "Placez dans le second sac, scellez et étiquetez si possible"
    ]
  },
  {
    id: 6,
    title: "Lavage cutané abondant à l'eau claire",
    tag: "Décontamination",
    tagColor: "bg-[#002c1b] text-[#98f6c5]",
    icon: "shower",
    desc: "Prenez une douche tiède immédiate avec un savon doux ordinaire (savon de Marseille ou gel douche neutre). Rincez abondamment pendant au moins 10 à 15 minutes.",
    warning: "NE FROTTEZ PAS VIGOUREUSEMENT LA PEAU ! L'abrasion ou les brosses ouvrent les pores et provoquent des micro-lésions qui favorisent le passage des toxiques dans le sang.",
    actions: [
      "Lavez d'abord la tête et les cheveux en penchant la tête en arrière pour que l'eau ne coule pas sur le visage",
      "Rincez abondamment les yeux à l'eau tiède ou au sérum physiologique de l'intérieur vers l'extérieur",
      "Nettoyez les mains, les ongles délicatement et les plis cutanés",
      "Évitez l'eau trop chaude qui provoque une vasodilatation cutanée"
    ]
  },
  {
    id: 7,
    title: "Séchage et vêtements de rechange propres",
    tag: "Zone Propre",
    tagColor: "bg-[#dce9fd] text-[#001126]",
    icon: "dry_cleaning",
    desc: "Séchez-vous en tamponnant doucement la peau avec une serviette propre (ne frottez pas). Enfilez des vêtements propres stockés préalablement dans le logement.",
    actions: [
      "Tamponnez doucement la peau avec une serviette propre",
      "Isolez la serviette utilisée dans un sac séparé",
      "Enfilez des vêtements propres à manches longues et jambes longues"
    ]
  },
  {
    id: 8,
    title: "Entrée en pièce de confinement sécurisée",
    tag: "Mise à l'abri",
    tagColor: "bg-[#001126] text-white",
    icon: "verified_user",
    desc: "Rejoignez la pièce de confinement hermétique préparée. Buvez de l'eau provenant exclusivement de bouteilles scellées. Allumez la radio FM officielle pour suivre les bilans d'exposition.",
    actions: [
      "Refermez la porte de la pièce tampon",
      "Hydratez-vous à l'eau minérale embouteillée",
      "En cas d'apparition de symptômes (brûlures, nausées, difficultés respiratoires), contactez le 15 ou le 114"
    ]
  }
];

export const DeshabillageView: React.FC<DeshabillageViewProps> = ({
  onBack,
  onOpenCallModal
}) => {
  const [completedSteps, setCompletedSteps] = useState<{ [key: number]: boolean }>({});
  const [activeStepTab, setActiveStepTab] = useState<number>(1);
  
  // 15-minute rinse timer
  const [timerSeconds, setTimerSeconds] = useState(900); // 15 mins
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimerCompleted, setIsTimerCompleted] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setIsTimerCompleted(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const toggleStep = (id: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / STEPS.length) * 100);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(900);
    setIsTimerCompleted(false);
  };

  return (
    <div className="flex flex-col w-full pt-20 pb-28 min-h-screen max-w-xl mx-auto px-4 gap-4">
      {/* Sentinel bar */}
      <div className="w-full bg-[#002c1b] text-[#98f6c5] py-2 px-3 rounded-lg flex items-center justify-between border border-[#005236]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[18px]">sanitizer</span>
          <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider truncate">
            Protocole Déshabillage d'Urgence • SGDSN / BIOTOX
          </span>
        </div>
        <span className="font-['Space_Grotesk'] text-[10px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-bold uppercase">
          PRIORITÉ HYGIÈNE
        </span>
      </div>

      {/* Return button */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          type="button"
          className="h-12 px-3 bg-[#dce9fd] hover:bg-[#d6e4f8] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold rounded flex items-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>RETOUR RÉAGIR</span>
        </button>
        <button
          onClick={() => window.print()}
          type="button"
          className="h-12 px-3 bg-white border border-[#c4c6ce] hover:bg-[#eef4ff] text-[#001126] font-['Space_Grotesk'] text-[11px] font-bold rounded flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">print</span>
          <span>IMPRIMER</span>
        </button>
      </div>

      {/* Header title */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-['Space_Grotesk'] text-[11px] px-2 py-0.5 rounded bg-[#ba1a1a] text-white font-bold uppercase">
            RISQUE CHIMIQUE, BIOLOGIQUE & RADIOLOGIQUE
          </span>
        </div>
        <h1 className="text-[24px] text-[#001126] font-bold tracking-tight">
          Déshabillage & Décontamination Pas-à-Pas
        </h1>
        <p className="text-[13px] text-[#44474d] leading-relaxed">
          Séquence stricte en 8 étapes pour éliminer 90% des particules et agents toxiques déposés sur les vêtements et la peau sans disséminer la contamination dans le foyer.
        </p>
      </header>

      {/* Règle d'or absolue */}
      <section className="bg-[#ffdad6] text-[#93000a] p-4 rounded-xl border border-[#ffb4ab] flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[24px] text-[#ba1a1a]">warning</span>
          <h2 className="text-[16px] font-bold">Règle d'Or : De l'extérieur vers l'intérieur, du haut vers le bas</h2>
        </div>
        <p className="text-[13px] font-medium leading-relaxed">
          Ne touchez jamais l'extérieur des vêtements avec vos mains nues. Ne secouez rien. N'utilisez ni eau chaude (qui ouvre les pores) ni brosse abrasive (qui crée des micro-coupures cutanées).
        </p>
      </section>

      {/* Progression */}
      <section className="bg-[#12263f] text-white p-4 rounded-xl shadow-sm border border-[#001126] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#98f6c5] text-[20px]">checklist</span>
            <span className="font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider">
              Progression du Protocole
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-[16px] font-bold text-[#98f6c5]">
            {completedCount} / {STEPS.length} ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-[#98f6c5] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </section>

      {/* Minuteur Rinçage Cutané (15 min) */}
      <section className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0036ce] text-[22px]">timer</span>
            <div>
              <h2 className="text-[14px] font-bold text-[#001126]">Minuteur de Rinçage (15 min)</h2>
              <span className="text-[11px] text-[#44474d]">Durée minimale de lavage abondant à l'eau claire</span>
            </div>
          </div>
          <span className={`font-['Space_Grotesk'] text-[24px] font-bold ${
            isTimerCompleted ? 'text-[#3f9d73]' : isTimerRunning ? 'text-[#ba1a1a] animate-pulse' : 'text-[#001126]'
          }`}>
            {formatTimer(timerSeconds)}
          </span>
        </div>

        {isTimerCompleted && (
          <div className="bg-[#98f6c5]/30 p-2.5 rounded-lg border border-[#3f9d73] text-[12px] text-[#005236] font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>Rinçage de 15 minutes terminé. Passez au séchage par tamponnement doux.</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {!isTimerRunning ? (
            <button
              onClick={() => setIsTimerRunning(true)}
              type="button"
              className="flex-1 min-h-[44px] bg-[#001126] hover:bg-[#12263f] text-white rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              <span>Lancer le rinçage (15 min)</span>
            </button>
          ) : (
            <button
              onClick={() => setIsTimerRunning(false)}
              type="button"
              className="flex-1 min-h-[44px] bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">pause</span>
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleResetTimer}
            type="button"
            className="h-11 px-3 bg-[#eef4ff] hover:bg-[#e4efff] text-[#001126] rounded-lg font-['Space_Grotesk'] text-[12px] font-semibold transition-colors border border-[#d6e4f8]"
          >
            Réinitialiser
          </button>
        </div>
      </section>

      {/* Étapes détaillées */}
      <section className="flex flex-col gap-3">
        <h2 className="text-[16px] font-bold text-[#001126] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0036ce]">format_list_numbered</span>
          <span>Détail des 8 Étapes Opérationnelles</span>
        </h2>

        {STEPS.map((step) => {
          const isDone = !!completedSteps[step.id];
          return (
            <article
              key={step.id}
              className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${
                isDone ? 'border-[#3f9d73] bg-[#f8fffb]' : 'border-[#c4c6ce]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-['Space_Grotesk'] text-[15px] font-bold shrink-0 ${
                      isDone
                        ? 'bg-[#3f9d73] text-white'
                        : 'bg-[#001126] text-white'
                    }`}
                  >
                    {isDone ? '✓' : step.id}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] uppercase font-bold tracking-wider truncate">
                      Étape {step.id} • {step.tag}
                    </span>
                    <h3 className="text-[15px] font-bold text-[#001126] leading-snug">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => toggleStep(step.id)}
                  type="button"
                  className={`h-9 px-3 rounded-lg font-['Space_Grotesk'] text-[11px] font-bold uppercase transition-colors shrink-0 flex items-center gap-1 ${
                    isDone
                      ? 'bg-[#98f6c5] text-[#005236]'
                      : 'bg-[#e4efff] text-[#001126] hover:bg-[#dce9fd]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isDone ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  <span>{isDone ? 'Validé' : 'À valider'}</span>
                </button>
              </div>

              <p className="text-[13px] text-[#0f1c2b] mt-3 leading-relaxed">
                {step.desc}
              </p>

              {step.warning && (
                <div className="mt-2.5 p-2.5 bg-[#ffdad6]/60 rounded-lg border border-[#ffb4ab] text-[12px] text-[#93000a] flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#ba1a1a] shrink-0 mt-0.5">
                    dangerous
                  </span>
                  <span className="leading-snug">{step.warning}</span>
                </div>
              )}

              <div className="mt-3 bg-[#eef4ff] p-3 rounded-lg border border-[#d6e4f8] flex flex-col gap-1.5">
                <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-[#001126]">
                  Actions impératives :
                </span>
                {step.actions.map((act, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[12px] text-[#0f1c2b]">
                    <span className="text-[#0036ce] font-bold">•</span>
                    <span className="leading-snug">{act}</span>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      {/* Appel d'urgence en cas de symptômes sévères */}
      <section className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col gap-2">
        <h2 className="text-[15px] font-bold text-[#001126] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ba1a1a]">medical_services</span>
          <span>Symptômes d'Exposition Sévère ?</span>
        </h2>
        <p className="text-[12px] text-[#44474d] leading-relaxed">
          En cas de brûlures chimiques cutanées, toux suffocante, rétrécissement des pupilles (myosis), détresse respiratoire ou convulsions :
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() =>
              onOpenCallModal({
                number: "15",
                name: "SAMU Urgences Médicales",
                subtitle: "Secours d'urgence vitale",
                desc: "Signalez immédiatement au médecin régulateur la nature présumée du toxique et votre localisation précise."
              })
            }
            type="button"
            className="min-h-[48px] bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>Appeler le 15</span>
          </button>
          <button
            onClick={() =>
              onOpenCallModal({
                number: "01 40 05 48 48",
                name: "Centre Antipoison Régional",
                subtitle: "Toxico-vigilance et antidote",
                desc: "Conseils toxicologiques d'urgence sur les agents industriels et chimiques."
              })
            }
            type="button"
            className="min-h-[48px] bg-[#001126] hover:bg-[#12263f] text-white rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">emergency</span>
            <span>Antipoison</span>
          </button>
        </div>
      </section>
    </div>
  );
};
