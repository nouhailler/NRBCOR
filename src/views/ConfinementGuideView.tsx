import React, { useState } from 'react';
import { Tooltip } from '../components/Tooltip';
import { triggerHaptic } from '../utils/haptics';

interface ConfinementGuideViewProps {
  onBack: () => void;
  onGoToKit: () => void;
}

type ConfinementScenario = 'chimique' | 'nucleaire' | 'biologique';

interface ScenarioInstruction {
  badge: string;
  badgeBg: string;
  idealLocation: string;
  forbiddenLocation: string;
  keyRule: string;
  rationale: string;
  airRenewalWarning: string;
}

const SCENARIO_DETAILS: Record<ConfinementScenario, ScenarioInstruction> = {
  chimique: {
    badge: 'RISQUE CHIMIQUE • INCIDENT INDUSTRIEL OU TRANSPORT',
    badgeBg: 'bg-[#0036ce] text-white',
    idealLocation: 'Pièce fermée au cœur du bâti, sans ouvrant direct vers l’extérieur (selon consignes préfectorales diffusées)',
    forbiddenLocation: 'Locaux présentant des prises d’air extérieures non obturables ou sous toiture perméable',
    keyRule: 'Mise à l’abri immédiate, fermeture des ouvrants, écoute stricte des ordres diffusés en direct par les autorités.',
    rationale: 'Le comportement d’un panache toxique dépend de la température de rejet, du vent, de la topographie et de la cinétique du sinistre. Il n’existe aucune règle universelle sur l’étage ou le sous-sol (les notions théoriques de gaz dense ou léger ne préjugent pas de la trajectoire réelle d’un nuage mélangé à l’air). Les ordres sectoriels diffusés par la Préfecture et FR-Alert priment toujours sur toute disposition générale.',
    airRenewalWarning: 'Attendez impérativement le message officiel de fin d’alerte émis par la Préfecture avant toute aération ou sortie.'
  },
  nucleaire: {
    badge: 'RISQUE NUCLÉAIRE & RADIOLOGIQUE • RETOMBÉES & RAYONNEMENTS',
    badgeBg: 'bg-[#ba1a1a] text-white',
    idealLocation: 'Sous-sol bétonné ou pièce centrale du rez-de-chaussée entourée de maçonnerie dense',
    forbiddenLocation: 'Pièces sous combles légers, vérandas, balcons ou pièces à simples parois vitrées',
    keyRule: 'Interposition maximale de matière dense (béton, brique pleine) pour atténuer le rayonnement ionisant.',
    rationale: 'Face aux rayonnements ionisants directs (gamma) et aux poussières radioactives, la densité des parois agit comme un écran protecteur. La mise à l’abri doit être maintenue jusqu’aux instructions préfectorales de déconfinement ou d’évacuation graduée.',
    airRenewalWarning: 'Le confinement protège du panache et des retombées directes. Attendez formellement l’ordre préfectoral avant d’aérer ou de sortir.'
  },
  biologique: {
    badge: 'RISQUE BIOLOGIQUE • AÉROSOLS & AGENTS PATHOGÈNES',
    badgeBg: 'bg-[#005236] text-white',
    idealLocation: 'Pièce isolée avec point d’eau sanitaire permettant un sas d’hygiène',
    forbiddenLocation: 'Espaces partagés ventilés par une VMC collective non filtrée',
    keyRule: 'Port d’un masque FFP3/FFP2 ajusté, lavage des mains fréquent, séparation des flux d’air.',
    rationale: 'Les bio-agents se propagent sous forme de fines gouttelettes ou spores aéroportées. L’arrêt immédiat des flux mécaniques et la mise en place d’une barrière respiratoire stricte évitent la contamination interne.',
    airRenewalWarning: 'Ne ventilez que sur consigne des autorités sanitaires en fonction du mode de transmission de l’agent identifié.'
  }
};

interface ConfinementStep {
  id: string;
  order: number;
  title: string;
  icon: string;
  desc: string;
  tip: string;
  scenarioNote?: string;
  essential: boolean;
}

const CONFINEMENT_STEPS: ConfinementStep[] = [
  {
    id: 'c1',
    order: 1,
    title: 'Fermer portes, fenêtres et volets',
    icon: 'window',
    desc: 'Verrouillez hermétiquement tous les ouvrants donnant sur l’extérieur. Fermez les volets pour créer un premier écran thermique, mécanique et radiologique.',
    tip: 'Si les fenêtres possèdent des aérations permanentes en feuillure haute, bouchez-les avec du ruban adhésif toilé épais.',
    scenarioNote: 'Valable pour tous les scénarios NRBC.',
    essential: true
  },
  {
    id: 'c2',
    order: 2,
    title: 'Gérer la ventilation selon les consignes d’urgence',
    icon: 'mode_fan_off',
    desc: 'Coupez les systèmes aspirant l’air extérieur (VMC, climatisation, hottes) et obturez les aérations directes selon les instructions des secours. Veillez à ne pas créer de risque secondaire si des appareils à tirage fonctionnent.',
    tip: 'L’arrêt de la ventilation réduit l’aspiration des rejets extérieurs, mais ne remplace pas une étanchéité soignée et le respect des consignes préfectorales.',
    scenarioNote: 'Suivre les consignes diffusées en temps réel pour le secteur concerné.',
    essential: true
  },
  {
    id: 'c3',
    order: 3,
    title: 'Éteindre chaudières et foyers ouverts',
    icon: 'fire_extinguisher',
    desc: 'Éteignez toute chaudière à tirage, poêle à bois, cheminée ou appareil à gaz pour éviter tout appel d’air et intoxication mortelle au monoxyde de carbone.',
    tip: 'Fermez la vanne générale de gaz si un risque d’explosion ou d’onde de choc est annoncé par les autorités.',
    scenarioNote: 'Évite l’asphyxie et le risque ATEX (atmosphère explosive).',
    essential: true
  },
  {
    id: 'c4',
    order: 4,
    title: 'Rejoindre la pièce adéquate selon le scénario',
    icon: 'meeting_room',
    desc: 'Adaptez le choix de la pièce selon les ordres de la Préfecture : privilégiez une pièce centrale avec le minimum d’ouvertures. Attention : il n’existe pas de règle universelle d’étage pour les gaz chimiques (la dispersion dépend de la météo et du produit). Pour le nucléaire, recherchez une pièce centrale bétonnée (effet écran).',
    tip: 'Consultez les messages officiels FR-Alert et la radio pour connaître les consignes sectorielles précises.',
    scenarioNote: 'Les ordres diffusés en temps réel par les autorités prévalent toujours sur toute disposition générale.',
    essential: true
  },
  {
    id: 'c5',
    order: 5,
    title: 'Calfeutrer les interstices et bas de porte',
    icon: 'tape',
    desc: 'Appliquez du ruban adhésif large et épais (toilé blindé) sur le pourtour des dormants. Placez des serviettes ou linges épais tassés sous les portes.',
    tip: 'Le linge au bas de porte agit comme un obturateur mécanique contre les courants d’air mais ne filtre pas les gaz toxiques.',
    scenarioNote: 'Mesure de fortune pour limiter les infiltrations rapides.',
    essential: true
  },
  {
    id: 'c6',
    order: 6,
    title: 'Allumer la radio à piles ou smartphone',
    icon: 'radio',
    desc: 'Réglez votre poste de radio sur France Bleu ou France Inter (réseau de diffusion prioritaire d’alerte). Restez à l’écoute des messages de la Préfecture et FR-Alert.',
    tip: 'Ne téléphonez qu’en cas de détresse vitale immédiate pour laisser les réseaux disponibles aux services de secours.',
    scenarioNote: 'Les ordres diffusés en direct prévalent sur toute autre consigne.',
    essential: true
  },
  {
    id: 'c7',
    order: 7,
    title: 'Attendre l’ordre officiel de fin d’alerte',
    icon: 'hourglass_empty',
    desc: 'Restez strictement confinés jusqu’à l’annonce officielle diffusée par la radio, la sirène (son continu de 30 secondes) ou les haut-parleurs des forces de l’ordre.',
    tip: 'Une accalmie extérieure (absence d’odeur apparente ou de fumée visible) ne signifie pas la disparition du danger toxique.',
    scenarioNote: 'Seule la Préfecture a autorité pour lever le confinement.',
    essential: true
  }
];

export const ConfinementGuideView: React.FC<ConfinementGuideViewProps> = ({
  onBack,
  onGoToKit
}) => {
  const [selectedScenario, setSelectedScenario] = useState<ConfinementScenario>('chimique');
  const [checkedSteps, setCheckedSteps] = useState<{ [id: string]: boolean }>({});

  const toggleCheck = (id: string) => {
    triggerHaptic('success');
    setCheckedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / CONFINEMENT_STEPS.length) * 100);

  const currentScenario = SCENARIO_DETAILS[selectedScenario];

  return (
    <div className="flex flex-col w-full pt-20 pb-28 min-h-screen max-w-xl mx-auto px-4 gap-4">
      {/* Sentinel bar */}
      <div className="w-full bg-[#001126] text-white py-2 px-3 rounded-lg flex items-center justify-between border border-[#12263f]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[18px] text-[#98f6c5]">shield</span>
          <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider truncate">
            Protocole Confinement & Sécurité Doctrinale • DGSCGC
          </span>
        </div>
        <span className="font-['Space_Grotesk'] text-[10px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-bold uppercase">
          CONFORME ÉTAT
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
            CONSIGNE MAJEURE DE SÉCURITÉ CIVILE
          </span>
        </div>
        <h1 className="text-[24px] text-[#001126] font-bold tracking-tight">
          Guide Opérationnel du Confinement
        </h1>
        <p className="text-[13px] text-[#44474d] leading-relaxed">
          Le confinement dans un local clos et calfeutré est la première mesure de sauvegarde face aux panaches toxiques industriels, biologiques ou aux retombées radioactives.
        </p>
      </header>

      {/* AVERTISSEMENT DOCTRINAL DE PRIMAUTÉ PRÉFECTORALE (PRIORITÉ 1) */}
      <section
        role="alert"
        className="bg-[#dee1ff] p-3.5 rounded-xl border border-[#b9c3ff] flex flex-col gap-2"
      >
        <div className="flex items-center gap-2 text-[#001258]">
          <span className="material-symbols-outlined text-[22px] text-[#001258]">verified_user</span>
          <h2 className="font-['Space_Grotesk'] text-[12px] uppercase font-bold tracking-wider">
            Priorité 1 — Fiabilité des Consignes et Ordres Officiels
          </h2>
        </div>
        <p className="text-[12px] text-[#001258] leading-relaxed">
          Les recommandations présentées ici sont issues du corpus interministériel (DGSCGC, SGDSN, IRSN, Ineris). <strong>Elles ne constituent pas un substitut aux ordres donnés en temps réel par le Préfet de département</strong> (via FR-Alert ou la radio de service public). En cas de divergence avec la situation locale sur le terrain, suivez toujours les instructions opérationnelles diffusées par les secours.
        </p>
      </section>

      {/* SÉLECTEUR DE SCÉNARIO PRÉCIS (CHIMIQUE vs NUCLÉAIRE vs BIOLOGIQUE) */}
      <section className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0036ce] text-[20px]">tune</span>
            <h2 className="text-[15px] font-bold text-[#001126]">Adapter au Scénario d'Accident</h2>
          </div>
          <span className="font-['Space_Grotesk'] text-[10px] bg-[#eef4ff] text-[#0036ce] px-2 py-0.5 rounded font-bold uppercase">
            Crucial
          </span>
        </div>

        <p className="text-[12px] text-[#44474d]">
          La consigne d'emplacement varie radicalement selon la nature du risque :
        </p>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedScenario('chimique')}
            className={`p-2 rounded-lg text-center transition-all border ${
              selectedScenario === 'chimique'
                ? 'bg-[#0036ce] text-white border-[#0036ce] shadow-sm font-bold'
                : 'bg-[#f8f9ff] text-[#001126] border-[#d6e4f8] hover:bg-[#eef4ff]'
            }`}
          >
            <span className="font-['Space_Grotesk'] text-[11px] block uppercase">Chimique</span>
            <span className="text-[9px] block opacity-80 truncate">Fuite / Usine</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedScenario('nucleaire')}
            className={`p-2 rounded-lg text-center transition-all border ${
              selectedScenario === 'nucleaire'
                ? 'bg-[#ba1a1a] text-white border-[#ba1a1a] shadow-sm font-bold'
                : 'bg-[#f8f9ff] text-[#001126] border-[#d6e4f8] hover:bg-[#eef4ff]'
            }`}
          >
            <span className="font-['Space_Grotesk'] text-[11px] block uppercase">Nucléaire</span>
            <span className="text-[9px] block opacity-80 truncate">Retombées RN</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedScenario('biologique')}
            className={`p-2 rounded-lg text-center transition-all border ${
              selectedScenario === 'biologique'
                ? 'bg-[#005236] text-white border-[#005236] shadow-sm font-bold'
                : 'bg-[#f8f9ff] text-[#001126] border-[#d6e4f8] hover:bg-[#eef4ff]'
            }`}
          >
            <span className="font-['Space_Grotesk'] text-[11px] block uppercase">Biologique</span>
            <span className="text-[9px] block opacity-80 truncate">Pathogène</span>
          </button>
        </div>

        {/* Détails du scénario actif */}
        <div className="bg-[#f8f9ff] p-3 rounded-lg border border-[#c4c6ce] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className={`font-['Space_Grotesk'] text-[10px] px-2 py-0.5 rounded font-bold uppercase ${currentScenario.badgeBg}`}>
              {currentScenario.badge}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
            <div className="p-2 bg-white rounded border border-[#98f6c5] flex flex-col gap-0.5">
              <span className="text-[#005236] font-bold text-[11px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                Localisation Recommandée :
              </span>
              <span className="text-[#001126] font-semibold">{currentScenario.idealLocation}</span>
            </div>

            <div className="p-2 bg-white rounded border border-[#ffdad6] flex flex-col gap-0.5">
              <span className="text-[#ba1a1a] font-bold text-[11px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">cancel</span>
                Endroit Strictement Proscrit :
              </span>
              <span className="text-[#93000a] font-semibold">{currentScenario.forbiddenLocation}</span>
            </div>
          </div>

          <div className="p-2 bg-white rounded border border-[#d6e4f8] text-[11px] text-[#0f1c2b]">
            <span className="font-bold text-[#0036ce] block mb-0.5">Pourquoi cette consigne ?</span>
            <p className="leading-snug">{currentScenario.rationale}</p>
          </div>

          <div className="p-2 bg-[#eef4ff] rounded border border-[#d6e4f8] text-[11px] text-[#0036ce] flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#0036ce] shrink-0">air</span>
            <span className="font-medium">{currentScenario.airRenewalWarning}</span>
          </div>
        </div>
      </section>

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
                  {step.scenarioNote && (
                    <span className="text-[10px] text-[#555962] font-semibold mt-1">
                      📌 {step.scenarioNote}
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </section>

      {/* VIGILANCE SUR LE RENOUVELLEMENT D'AIR & DANGERS D'ATMOSPHÈRE APPAUVRIE (PRIORITÉ 1) */}
      <section className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h2 className="text-[15px] font-bold text-[#001126] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ba1a1a]">air</span>
              <span>Vigilance Respiratoire & Renouvellement d'Air</span>
            </h2>
            <Tooltip
              title="Limites du confinement hermétique"
              content="Un local clos protège des toxiques extérieurs mais piège l'air vicié. Il ne doit être maintenu que le temps strictement nécessaire au passage du panache."
            />
          </div>
          <span className="font-['Space_Grotesk'] text-[11px] bg-[#fff0ed] text-[#ba1a1a] px-2 py-0.5 rounded font-bold uppercase border border-[#ffdad6]">
            Sécurité Vitale
          </span>
        </div>

        {/* Encadré d'avertissement doctrinal strict */}
        <div className="p-3.5 bg-[#fff0ed] rounded-xl border-2 border-[#ffdad6] text-[#93000a] text-[12px] flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[22px] text-[#ba1a1a] shrink-0 mt-0.5">warning</span>
          <div className="flex flex-col gap-1 leading-relaxed">
            <span className="font-bold text-[13px] uppercase tracking-wide">
              Mise en garde doctrinale : aucun calcul ne garantit votre sécurité respiratoire
            </span>
            <p>
              Les conditions réelles varient considérablement : la consommation d’oxygène augmente fortement avec le stress et l’effort, l’étanchéité des parois n’est jamais mathématiquement uniforme, et une <strong>atmosphère appauvrie en oxygène (hypoxie)</strong> ou <strong>saturée en dioxyde de carbone (hypercapnie)</strong> peut rapidement devenir dangereuse voire mortelle.
            </p>
          </div>
        </div>

        {/* 3 Principes de Sauvegarde DGSCGC */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[12px]">
          <div className="p-3 bg-[#eef4ff] rounded-lg border border-[#d6e4f8] flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#001126] font-['Space_Grotesk'] font-bold">
              <span className="material-symbols-outlined text-[18px] text-[#0036ce]">timer</span>
              <span>1. Durée Temporaire</span>
            </div>
            <p className="text-[#44474d] text-[11px] leading-snug">
              Le confinement civil d'urgence est conçu pour une fenêtre maximale de <strong>2 à 4 heures</strong> (temps de passage du pic du panache toxique).
            </p>
          </div>

          <div className="p-3 bg-[#eef4ff] rounded-lg border border-[#d6e4f8] flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#001126] font-['Space_Grotesk'] font-bold">
              <span className="material-symbols-outlined text-[18px] text-[#3f9d73]">air</span>
              <span>2. Aérer dès la Fin d'Alerte</span>
            </div>
            <p className="text-[#44474d] text-[11px] leading-snug">
              Dès l’ordre officiel de fin de crise diffusé par la Préfecture (sirène continue ou radio), <strong>ouvrez en grand tous les ouvrants</strong> pour assainir l'habitat.
            </p>
          </div>

          <div className="p-3 bg-[#eef4ff] rounded-lg border border-[#d6e4f8] flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#001126] font-['Space_Grotesk'] font-bold">
              <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">do_not_disturb</span>
              <span>3. Zéro Flamme Nue</span>
            </div>
            <p className="text-[#44474d] text-[11px] leading-snug">
              N'allumez aucune bougie ni briquet : une flamme consume l'oxygène résiduel à grande vitesse et produit du monoxyde de carbone mortel.
            </p>
          </div>
        </div>

        {/* Signes d'alerte vitale en milieu confiné */}
        <div className="bg-[#f8f9ff] p-3 rounded-lg border border-[#c4c6ce] flex flex-col gap-1 text-[12px]">
          <span className="font-['Space_Grotesk'] font-bold text-[#001126] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">emergency</span>
            Signes d'intoxication au CO2 ou de manque d'oxygène :
          </span>
          <p className="text-[#44474d] leading-relaxed">
            Maux de tête battants, étourdissements, respiration accélérée et involontaire, sueurs froides ou confusion. En présence de ces symptômes : restez immobiles pour minimiser la consommation d'air, calmez votre respiration et contactez immédiatement les secours (15/18/112) si vous disposez d'un réseau disponible.
          </p>
        </div>
      </section>

      {/* Règles strictes pendant le confinement */}
      <section className="bg-[#12263f] text-white p-4 rounded-xl shadow-sm border border-[#001126] flex flex-col gap-2.5">
        <h2 className="text-[15px] font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ffdad6]">do_not_disturb_on</span>
          <span>Interdictions Formelles Pendant le Confinement</span>
        </h2>
        <div className="flex flex-col gap-2 text-[12px] text-[#d4e3ff]">
          <div className="flex items-center gap-2">
            <span className="text-[#ffb4ab] font-bold">✕</span>
            <span><strong>Ne fumez jamais</strong> et n’allumez aucune bougie ou allumette (consomme l’air et risque d’inflammation).</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#ffb4ab] font-bold">✕</span>
            <span><strong>Ne sortez pas chercher vos enfants à l’école</strong> : ils sont protégés et confinés sous protocole PPMS par les enseignants.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#ffb4ab] font-bold">✕</span>
            <span><strong>N’ouvrez pas la porte</strong> sans vérification préalable d'absence de contamination.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#ffb4ab] font-bold">✕</span>
            <span><strong>Ne buvez pas l’eau du robinet</strong> si un avis de coupure ou d'alerte sur le réseau public d'eau a été émis.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#ffb4ab] font-bold">✕</span>
            <span><strong>Ne prenez pas de comprimés d’iode de votre propre initiative</strong> sans ordre formel du Préfet de département.</span>
          </div>
        </div>
      </section>
    </div>
  );
};
