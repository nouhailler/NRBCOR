import React, { useState } from 'react';

interface ConfinementGuideViewProps {
  onBack: () => void;
  onGoToKit: () => void;
}

interface ConfinementStep {
  id: string;
  order: number;
  title: string;
  icon: string;
  desc: string;
  tip: string;
  essential: boolean;
}

const CONFINEMENT_STEPS: ConfinementStep[] = [
  {
    id: 'c1',
    order: 1,
    title: 'Fermer portes, fenêtres et volets',
    icon: 'window',
    desc: 'Verrouillez hermétiquement tous les ouvrants donnant sur l’extérieur. Fermez les volets pour créer un premier écran thermique et mécanique.',
    tip: 'Si les fenêtres ont des aérations en partie haute, préparez-vous à les masquer avec du scotch large.',
    essential: true
  },
  {
    id: 'c2',
    order: 2,
    title: 'Couper VMC, hottes et climatisation',
    icon: 'mode_fan_off',
    desc: 'Coupez immédiatement la ventilation mécanique contrôlée (VMC) au tableau électrique (disjoncteur VMC), ainsi que toute climatisation ou hotte aspirante.',
    tip: 'La VMC aspire l’air extérieur et propagerait le gaz ou panache toxique dans l’ensemble du logement en moins de 10 minutes.',
    essential: true
  },
  {
    id: 'c3',
    order: 3,
    title: 'Éteindre chaudières et foyers ouverts',
    icon: 'fire_extinguisher',
    desc: 'Éteignez toute chaudière à tirage, poêle à bois, cheminée ou appareil à gaz pour éviter tout appel d’air et intoxication au monoxyde de carbone.',
    tip: 'Fermez la vanne générale de gaz si un risque d’explosion ou d’onde de choc est annoncé.',
    essential: true
  },
  {
    id: 'c4',
    order: 4,
    title: 'Rejoindre la pièce centrale choisie',
    icon: 'meeting_room',
    desc: 'Rassemblez tous les occupants dans la pièce la plus étanche : de préférence une pièce centrale, aveugle (sans fenêtre extérieure) et à mi-hauteur du bâtiment.',
    tip: 'Évitez les caves/sous-sols (les gaz toxiques lourds comme le chlore s’y accumulent) et le dernier étage sous toiture (gaz légers comme l’ammoniac).',
    essential: true
  },
  {
    id: 'c5',
    order: 5,
    title: 'Calfeutrer les interstices et bas de porte',
    icon: 'tape',
    desc: 'Appliquez du ruban adhésif large et épais (gros scotch toilé type blindé) sur le pourtour de la porte de la pièce. Placez des serviettes ou linges humides tassés sous la porte.',
    tip: 'L’eau emprisonnée dans le tissu humide retient une partie des gaz solubles et particules fines.',
    essential: true
  },
  {
    id: 'c6',
    order: 6,
    title: 'Allumer la radio à piles ou smartphone',
    icon: 'radio',
    desc: 'Réglez votre poste de radio sur France Bleu ou France Inter (réseau de diffusion prioritaire d’alerte). Coupez le Wi-Fi non essentiel pour économiser la batterie.',
    tip: 'Ne téléphonez qu’en cas de danger vital immédiat pour ne pas saturer les réseaux nécessaires aux secours.',
    essential: true
  },
  {
    id: 'c7',
    order: 7,
    title: 'Attendre l’ordre officiel de fin d’alerte',
    icon: 'hourglass_empty',
    desc: 'Restez strictement confinés jusqu’à l’annonce officielle diffusée par la radio, la sirène (son continu de 30 secondes) ou les haut-parleurs des forces de l’ordre.',
    tip: 'Une accalmie extérieure (absence d’odeur apparente ou de fumée visible) ne signifie pas la disparition du danger toxique.',
    essential: true
  }
];

export const ConfinementGuideView: React.FC<ConfinementGuideViewProps> = ({
  onBack,
  onGoToKit
}) => {
  const [checkedSteps, setCheckedSteps] = useState<{ [id: string]: boolean }>({});
  const [roomArea, setRoomArea] = useState<number>(15); // m²
  const [occupants, setOccupants] = useState<number>(3);

  const toggleCheck = (id: string) => {
    setCheckedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / CONFINEMENT_STEPS.length) * 100);

  // Estimation indicative de volume d'air et durée de confinement sécuritaire
  const ceilingHeight = 2.5; // m
  const roomVolumeM3 = Math.round(roomArea * ceilingHeight);
  // Volume d'air consommé : environ 0.5 m³/h d'air par personne au repos
  // Seuil recommandé de sécurité sans ventilation étanche : environ 24 à 48 heures max
  const estimatedSafeHours = Math.min(48, Math.max(8, Math.round((roomVolumeM3 / (occupants * 0.8)) * 0.7)));

  return (
    <div className="flex flex-col w-full pt-20 pb-28 min-h-screen max-w-xl mx-auto px-4 gap-4">
      {/* Sentinel bar */}
      <div className="w-full bg-[#001126] text-white py-2 px-3 rounded-lg flex items-center justify-between border border-[#12263f]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[18px] text-[#98f6c5]">shield</span>
          <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider truncate">
            Protocole Confinement Hermétique • DGSCGC
          </span>
        </div>
        <span className="font-['Space_Grotesk'] text-[10px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-bold uppercase">
          PROTECTION N°1
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
          <span>RETOUR</span>
        </button>
        <button
          onClick={onGoToKit}
          type="button"
          className="h-12 px-3 bg-[#eef4ff] hover:bg-[#e4efff] text-[#001126] font-['Space_Grotesk'] text-[11px] font-bold rounded flex items-center gap-1.5 transition-colors border border-[#d6e4f8]"
        >
          <span className="material-symbols-outlined text-[18px]">inventory_2</span>
          <span>VOIR KIT 72H</span>
        </button>
      </div>

      {/* Header title */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-['Space_Grotesk'] text-[11px] px-2 py-0.5 rounded bg-[#0036ce] text-white font-bold uppercase">
            REFLEXE UNIVERSEL NRBC
          </span>
        </div>
        <h1 className="text-[24px] text-[#001126] font-bold tracking-tight">
          Guide du Confinement d'Urgence
        </h1>
        <p className="text-[13px] text-[#44474d] leading-relaxed">
          Le confinement dans un local clos et calfeutré est la mesure de protection la plus efficace contre les panaches toxiques industriels, biologiques ou les retombées radioactives.
        </p>
      </header>

      {/* Checklist étanchéité */}
      <section className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0036ce] text-[22px]">fact_check</span>
            <h2 className="text-[16px] font-bold text-[#001126]">Checklist Étanchéité Immédiate</h2>
          </div>
          <span className="font-['Space_Grotesk'] text-[14px] font-bold text-[#0036ce]">
            {completedCount} / {CONFINEMENT_STEPS.length}
          </span>
        </div>

        <div className="w-full bg-[#f1f3f9] rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#0036ce] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className="flex flex-col gap-2.5 mt-1">
          {CONFINEMENT_STEPS.map((step) => {
            const isChecked = !!checkedSteps[step.id];
            return (
              <label
                key={step.id}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                  isChecked
                    ? 'bg-[#f0f8ff] border-[#0036ce]'
                    : 'bg-[#f8f9ff] border-[#e0e2eb] hover:bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCheck(step.id)}
                  className="w-5 h-5 mt-0.5 rounded text-[#0036ce] accent-[#0036ce] cursor-pointer shrink-0"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-[#001126]">
                      {step.icon}
                    </span>
                    <span className="text-[14px] font-bold text-[#001126]">
                      {step.order}. {step.title}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#44474d] mt-1 leading-snug">{step.desc}</p>
                  <p className="text-[11px] text-[#0036ce] mt-1 font-medium bg-white/80 p-1.5 rounded border border-[#d6e4f8]">
                    💡 {step.tip}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      {/* Simulateur Volume & Autonomie d'Air de la Pièce */}
      <section className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-[#001126] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0036ce]">air</span>
            <span>Simulateur d'Air & Volume de Confinement</span>
          </h2>
          <span className="font-['Space_Grotesk'] text-[11px] bg-[#eef4ff] text-[#0036ce] px-2 py-0.5 rounded font-bold uppercase">
            Estimatif
          </span>
        </div>

        <p className="text-[12px] text-[#44474d]">
          Ajustez les dimensions pour vérifier l'autonomie d'air sans renouvellement extérieur :
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-['Space_Grotesk'] uppercase font-bold text-[#44474d] block mb-1">
              Surface pièce : {roomArea} m²
            </label>
            <input
              type="range"
              min={8}
              max={40}
              value={roomArea}
              onChange={(e) => setRoomArea(Number(e.target.value))}
              className="w-full accent-[#0036ce]"
            />
          </div>

          <div>
            <label className="text-[11px] font-['Space_Grotesk'] uppercase font-bold text-[#44474d] block mb-1">
              Occupants : {occupants} {occupants > 1 ? 'personnes' : 'personne'}
            </label>
            <input
              type="range"
              min={1}
              max={8}
              value={occupants}
              onChange={(e) => setOccupants(Number(e.target.value))}
              className="w-full accent-[#0036ce]"
            />
          </div>
        </div>

        <div className="p-3 bg-[#eef4ff] rounded-lg border border-[#d6e4f8] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#44474d] block">Volume d'air disponible :</span>
            <span className="font-['Space_Grotesk'] text-[15px] font-bold text-[#001126]">
              ~{roomVolumeM3} m³ d'air
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-semibold text-[#44474d] block">Autonomie conseillée :</span>
            <span className="font-['Space_Grotesk'] text-[15px] font-bold text-[#0036ce]">
              jusqu'à {estimatedSafeHours} heures
            </span>
          </div>
        </div>
      </section>

      {/* Règles strictes pendant le confinement */}
      <section className="bg-[#12263f] text-white p-4 rounded-xl shadow-sm border border-[#001126] flex flex-col gap-2.5">
        <h2 className="text-[15px] font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ffdad6]">do_not_disturb_on</span>
          <span>Interdictions Formelles Pendant le Confinement</span>
        </h2>
        <div className="flex flex-col gap-1.5 text-[12px] text-[#d4e3ff]">
          <div className="flex items-center gap-2">
            <span className="text-[#ffb4ab] font-bold">✕</span>
            <span>Ne fumez jamais et n’allumez aucune bougie ou allumette</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#ffb4ab] font-bold">✕</span>
            <span>Ne sortez pas chercher vos enfants à l’école (ils sont protégés par le PPMS scolaire)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#ffb4ab] font-bold">✕</span>
            <span>N’ouvrez pas la porte aux voisins sans vérification de non-contamination</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#ffb4ab] font-bold">✕</span>
            <span>Ne buvez pas l’eau du robinet si un doute existe sur le réseau public</span>
          </div>
        </div>
      </section>
    </div>
  );
};
