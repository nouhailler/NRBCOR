import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/I18nContext';
import { getLocalizedTrainerScenarios } from '../i18n/content/localizedQuiz';

export interface TrainerExerciseScenario {
  id: string;
  title: string;
  hazardType: 'chimique' | 'nucleaire' | 'telecom' | 'scolaire';
  badge: string;
  situation: string;
  pedagogicalObjectives: string[];
  groupDilemma: string;
  expectedReflex: string;
  fatalTraps: string[];
  targetedCompetencies: string[];
}

export const TRAINER_SCENARIOS: TrainerExerciseScenario[] = [
  {
    id: 'chimique-seveso',
    title: 'Exercice 1 : Fuite Toxique Industrielle Seveso (Nuage Chlore/Ammoniac)',
    hazardType: 'chimique',
    badge: 'TMD / Industrie Seveso',
    situation: 'Une odeur âcre et piquante est signalée. La sirène RNA retentit. Le vent souffle en direction de la zone pavillonnaire.',
    pedagogicalObjectives: [
      'Démontrer que la fuite en voiture vers l\'extérieur est le piège mortel numéro 1.',
      'Faire expérimenter le calfeutrage rapide d\'une pièce (adhésif large, serviettes humides sous les portes).',
      'Rappeler l\'interdiction stricte de toute flamme ou appareil électrique susceptible de générer une étincelle.'
    ],
    groupDilemma: 'Une partie du groupe souhaite prendre la voiture pour fuir avant que le nuage n\'arrive. Que décidez-vous ?',
    expectedReflex: 'Confinement immédiat en dur, calfeutrage total, coupure VMC, écoute de France Bleu sur récepteur FM.',
    fatalTraps: [
      'Fuir en voiture et se retrouver bloqué dans un embouteillage sous le nuage toxique.',
      'Sortir inspecter la provenance de l\'odeur.',
      'Téléphoner au 18/15 pour se renseigner.'
    ],
    targetedCompetencies: [
      'Confinement d\'urgence sous atmosphère toxique',
      'Calfeutrage actif des aérations',
      'Discipline radio FM sans saturation réseau'
    ]
  },
  {
    id: 'nucleaire-cnpe',
    title: 'Exercice 2 : Rejet Radioactif Accidentel (Centrale CNPE)',
    hazardType: 'nucleaire',
    badge: 'Risque Radiologique',
    situation: 'Un message FR-Alert annonce un incident radiologique classé INES 4 sur un réacteur à 15 km.',
    pedagogicalObjectives: [
      'Déconstruire le réflexe d\'ingérer des comprimés d\'iode sans ordre formel du Préfet.',
      'Expliquer la différence vitale entre irradiation (exposition externe) et contamination (dépôt ou inhalation de poussières).',
      'Identifier la pièce la plus protectrice du bâtiment (centre, parois épaisses, pas de fenêtres directes).'
    ],
    groupDilemma: 'Un participant a une boîte de comprimés d\'iode et propose à tout le monde d\'en prendre immédiatement « par précaution ». Que faites-vous ?',
    expectedReflex: 'Refus formel d\'ingestion sans ordre explicite du Préfet diffusé par radio. Confinement au centre du bâtiment.',
    fatalTraps: [
      'Ingestion spontanée d\'iode stable inutile ou à contretemps (danger pour la thyroïde si mal dosé).',
      'Sortir récupérer du matériel exposé à l\'air libre.',
      'Se frotter vigoureusement la peau au lieu d\'un rinçage doux en cas de doute de poussières.'
    ],
    targetedCompetencies: [
      'Doctrine stricte de l\'iode stable sur ordre préfectoral',
      'Protection contre le panache radiologique',
      'Différenciation irradiation vs contamination'
    ]
  },
  {
    id: 'telecom-blackout',
    title: 'Exercice 3 : Blackout Télécom & Séparation Familiale',
    hazardType: 'telecom',
    badge: 'Rupture de Réseau',
    situation: 'Tempête majeure et coupure électrique générale : le réseau cellulaire 4G/5G s\'effondre. Vous êtes séparés de vos proches.',
    pedagogicalObjectives: [
      'Apprendre à appliquer le protocole de rendez-vous programmé sans dépendre du smartphone (H+2, H+6, H+24).',
      'Tester le contact relais hors-zone par SMS unique.',
      'Exploiter la radio FM analogique comme seule source d\'information descendante fiable.'
    ],
    groupDilemma: 'Sans réseau, certains membres veulent partir à la recherche des autres à travers la ville sans plan convenu. Que mettez-vous en place ?',
    expectedReflex: 'Rejoindre le point de rassemblement convenu à l\'heure prévue ou envoyer un SMS court unique au relais distant.',
    fatalTraps: [
      'Errements aléatoires dans les rues sans repères.',
      'Épuisement de la batterie du téléphone par des tentatives d\'appels répétés.',
      'Ignorer le poste radio FM à piles.'
    ],
    targetedCompetencies: [
      'Protocole de ralliement hors-réseau (H+2, H+6, H+24)',
      'Utilisation du contact relais hors-zone',
      'Gestion de l\'énergie et veille radio FM'
    ]
  },
  {
    id: 'ppms-scolaire',
    title: 'Exercice 4 : Alerte Majeure et Enfants à l\'École (Protocole PPMS)',
    hazardType: 'scolaire',
    badge: 'Sécurité Civile & PPMS',
    situation: 'Une alerte industrielle retentit à 14h30 alors que vos enfants sont en classe à l\'école primaire.',
    pedagogicalObjectives: [
      'Inculquer l\'interdiction absolue d\'aller chercher les enfants à l\'école.',
      'Expliquer le rôle protecteur du Plan Particulier de Mise en Sûreté (PPMS) de l\'Éducation Nationale.',
      'Comprendre que la rue est le lieu le plus dangereux pendant la crise.'
    ],
    groupDilemma: 'L\'angoisse parentale pousse plusieurs personnes à vouloir courir à l\'école pour récupérer leurs enfants. Comment réagissez-vous ?',
    expectedReflex: 'Rester confiné là où l\'on se trouve. Les enseignants et la direction sont formés et protègent les enfants dans des locaux sécurisés.',
    fatalTraps: [
      'Prendre son véhicule pour aller à l\'école (bloque l\'arrivée des pompiers et expose les parents au danger).',
      'Tenter d\'extraire un enfant de l\'école contre les consignes du directeur d\'établissement.',
      'Téléphoner à l\'école et saturer le standard réservé aux liaisons de crise avec la mairie.'
    ],
    targetedCompetencies: [
      'Maîtrise de la règle PPMS scolaire',
      'Gestion du stress parental face au confinement',
      'Subordination aux consignes de sécurité civile'
    ]
  }
];

interface TrainerSessionModalProps {
  onClose: () => void;
  onCompetencyMastered: (comp: string) => void;
}

export const TrainerSessionModal: React.FC<TrainerSessionModalProps> = ({
  onClose,
  onCompetencyMastered
}) => {
  const { t, language } = useTranslation();
  const isEn = language === 'en';
  const scenarios = getLocalizedTrainerScenarios(language);

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('chimique-seveso');
  const [groupName, setGroupName] = useState<string>(
    isEn ? 'Citizen Resilience Group - Session 1' : 'Groupe Citoyen Résilience - Session 1'
  );
  const [participantsCount, setParticipantsCount] = useState<number>(6);
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [exerciseRunning, setExerciseRunning] = useState<boolean>(false);
  const [exerciseTimer, setExerciseTimer] = useState<number>(0);
  const [validatedCompetencies, setValidatedCompetencies] = useState<{ [comp: string]: boolean }>({});
  const [showDebriefSheet, setShowDebriefSheet] = useState<boolean>(false);

  const scenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (exerciseRunning) {
      interval = setInterval(() => {
        setExerciseTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [exerciseRunning]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleCompetency = (comp: string) => {
    const next = !validatedCompetencies[comp];
    setValidatedCompetencies({ ...validatedCompetencies, [comp]: next });
    if (next) {
      onCompetencyMastered(comp);
    }
  };

  const handlePrintDebrief = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="bg-white text-black w-full max-w-3xl rounded-2xl shadow-2xl border-2 border-[#0036ce] flex flex-col max-h-[92vh] overflow-hidden">
        {/* En-tête */}
        <div className="p-4 bg-[#001126] text-white flex items-center justify-between shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0036ce] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">school</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-bold font-['Space_Grotesk'] text-white">
                  {isEn ? 'Trainer Mode • Collective Drill Facilitation' : "Mode Formateur • Animation d'Exercice Collectif"}
                </h2>
                <span className="text-[10px] bg-amber-400 text-black font-['Space_Grotesk'] font-extrabold px-2 py-0.5 rounded uppercase">
                  {isEn ? 'Educational' : 'Pédagogique'}
                </span>
              </div>
              <p className="text-[11px] text-[#c4c6ce]">
                {isEn
                  ? 'Zero-server execution • Local sovereign storage • Printable debrief memo'
                  : "Animation sans serveur • Stockage local • Bilan d'exercice imprimable"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isEn ? 'Close modal' : 'Fermer'}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Bannière de distinction déontologique obligatoire */}
        <div className="bg-amber-100 border-b border-amber-300 p-2.5 px-4 flex items-center gap-2 text-[11px] text-amber-950">
          <span className="material-symbols-outlined text-amber-800 text-[18px] shrink-0">warning</span>
          <span className="leading-snug">
            <strong>{isEn ? 'MANDATORY ETHICAL NOTICE: ' : 'DISTINCTION MAJEURE : '}</strong>
            {isEn
              ? 'This drill is an educational simulation. In real emergency events, directives broadcast by Civil Protection authorities strictly prevail.'
              : "Cet exercice est une simulation pédagogique. En cas d'événement réel, les consignes diffusées par le Préfet et la Sécurité Civile priment immédiatement."}
          </span>
        </div>

        {/* Corps avec onglets/modes */}
        <div className="p-4 sm:p-5 overflow-y-auto flex flex-col gap-4 text-[12px]">
          {/* Paramètres de session */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-700 mb-0.5">
                {isEn ? 'Workshop / Group Title:' : "Intitulé de l'Atelier / Groupe :"}
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded text-[12px]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-700 mb-0.5">
                {isEn ? 'Participants Count:' : 'Effectif Participants :'}
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={participantsCount}
                onChange={(e) => setParticipantsCount(parseInt(e.target.value) || 1)}
                className="w-full p-1.5 border border-gray-300 rounded text-[12px]"
              />
            </div>
            <div className="flex flex-col justify-end">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExerciseRunning(!exerciseRunning)}
                  className={`w-full h-8 rounded-lg font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 transition-colors ${
                    exerciseRunning
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-[#0036ce] hover:bg-[#0024a8] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {exerciseRunning ? 'pause' : 'play_arrow'}
                  </span>
                  <span>
                    {exerciseRunning
                      ? (isEn ? `Running (${formatTimer(exerciseTimer)})` : `En cours (${formatTimer(exerciseTimer)})`)
                      : (isEn ? 'Start timer' : 'Lancer chrono')}
                  </span>
                </button>
                {exerciseTimer > 0 && !exerciseRunning && (
                  <button
                    type="button"
                    onClick={() => setExerciseTimer(0)}
                    className="h-8 px-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 text-[11px] font-bold"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sélecteur de scénario */}
          <div className="flex flex-col gap-1.5">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-gray-600">
              {isEn ? 'Choose collective exercise scenario:' : "Choisir le scénario de l'exercice collectif :"}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scenarios.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setSelectedScenarioId(sc.id)}
                  className={`p-3 rounded-xl text-left border flex flex-col gap-1 transition-all ${
                    sc.id === selectedScenarioId
                      ? 'bg-[#eef4ff] border-[#0036ce] ring-2 ring-[#0036ce]/30'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-['Space_Grotesk'] text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-gray-100 text-gray-800">
                      {sc.badge}
                    </span>
                    {sc.id === selectedScenarioId && (
                      <span className="text-[10px] font-bold text-[#0036ce]">
                        {isEn ? 'Active' : 'Actif'}
                      </span>
                    )}
                  </div>
                  <strong className="text-[12px] text-[#001126] leading-snug">
                    {sc.title}
                  </strong>
                </button>
              ))}
            </div>
          </div>

          {/* Détail du scénario actif */}
          <div className="p-4 bg-white rounded-xl border border-gray-300 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#0036ce]">
                {isEn ? 'Situation presented to the group:' : 'Situation posée au groupe :'}
              </span>
              <p className="text-[13px] text-gray-900 bg-gray-50 p-2.5 rounded-lg border border-gray-200 italic leading-relaxed">
                « {scenario.situation} »
              </p>
            </div>

            {/* Dilemme et débat */}
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-red-950 font-bold uppercase text-[11px]">
                <span className="material-symbols-outlined text-[16px] text-red-700">psychology_alt</span>
                <span>{isEn ? 'Dilemma to submit for group debate:' : 'Dilemme à soumettre au débat du groupe :'}</span>
              </div>
              <p className="text-[12px] text-red-900 leading-snug">
                {scenario.groupDilemma}
              </p>
            </div>

            {/* Objectifs pédagogiques & Pièges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex flex-col gap-1.5">
                <strong className="text-blue-950 uppercase font-['Space_Grotesk']">
                  {isEn ? 'Key Pedagogical Objectives:' : 'Objectifs Pédagogiques Clés :'}
                </strong>
                <ul className="flex flex-col gap-1 text-blue-900 leading-relaxed">
                  {scenario.pedagogicalObjectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex flex-col gap-1.5">
                <strong className="text-amber-950 uppercase font-['Space_Grotesk']">
                  {isEn ? 'Fatal Traps to Deconstruct:' : 'Pièges mortels à déconstruire :'}
                </strong>
                <ul className="flex flex-col gap-1 text-amber-900 leading-relaxed">
                  {scenario.fatalTraps.map((trap, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-700 font-bold">✕</span>
                      <span>{trap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Évaluation des compétences travaillées */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <strong className="text-[#001126] uppercase font-['Space_Grotesk'] text-[11px]">
                  {isEn ? 'Validation of skills practiced by the group:' : 'Validation des compétences travaillées par le groupe :'}
                </strong>
                <span className="text-[10px] text-gray-500">
                  {isEn ? 'Check to validate' : 'Cocher pour valider'}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {scenario.targetedCompetencies.map((comp) => {
                  const isChecked = !!validatedCompetencies[comp];
                  return (
                    <label
                      key={comp}
                      className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleCompetency(comp)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span className="font-medium text-[12px]">{comp}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        isChecked ? 'bg-emerald-200 text-emerald-900' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isChecked ? (isEn ? 'Mastered' : 'Acquis') : (isEn ? 'In progress' : 'À travailler')}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Remarques & observations formateur */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-700 mb-0.5">
                {isEn ? 'Facilitator debrief observations & notes:' : "Observations & points de débriefing de l'animateur :"}
              </label>
              <textarea
                rows={2}
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder={
                  isEn
                    ? 'E.g.: The group quickly rejected fleeing by car but hesitated on the strict protocol for iodine tablets...'
                    : "Ex: Le groupe a rapidement écarté la fuite en véhicule mais a hésité sur l'usage des comprimés d'iode..."
                }
                className="w-full p-2 border border-gray-300 rounded text-[12px]"
              />
            </div>
          </div>

          {/* BILAN IMPRIMABLE DE SESSION (DÉPLIABLE OU DIRECT) */}
          <div className="border-t border-gray-300 pt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-['Space_Grotesk'] text-[12px] font-bold uppercase text-black">
                {isEn ? 'Session Pedagogical Memo (Printable B&W format):' : 'Bilan Pédagogique de la Session (Format Imprimable N&B) :'}
              </span>
              <button
                type="button"
                onClick={() => setShowDebriefSheet(!showDebriefSheet)}
                className="text-[11px] font-bold text-[#0036ce] underline"
              >
                {showDebriefSheet
                  ? (isEn ? 'Hide debrief sheet' : 'Masquer fiche')
                  : (isEn ? 'Preview debrief sheet' : 'Prévisualiser fiche bilan')}
              </button>
            </div>

            {showDebriefSheet && (
              <div className="p-4 border-2 border-black rounded-xl bg-white flex flex-col gap-3 font-sans print:border-black print:m-0 print:p-2">
                <div className="border-b-2 border-black pb-2 flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-[14px] uppercase font-['Space_Grotesk']">
                      {isEn ? 'CIVIL DEFENSE DRILL SUMMARY • NRBCOR' : "BILAN D'EXERCICE DE SÉCURITÉ CIVILE • NRBCOR"}
                    </h3>
                    <p className="text-[11px] text-gray-600">
                      {isEn ? 'Citizen Resilience Preparedness • Educational Support' : 'Formation à la Résilience Citoyenne • Support Pédagogique'}
                    </p>
                  </div>
                  <div className="text-right text-[10px]">
                    <span className="font-bold block">
                      DATE : {new Intl.DateTimeFormat(isEn ? 'en-US' : 'fr-FR', { dateStyle: 'long' }).format(new Date())}
                    </span>
                    <span>{isEn ? 'DURATION: ' : 'DURÉE : '}{formatTimer(exerciseTimer)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-gray-300 pb-2">
                  <div><strong>{isEn ? 'Session: ' : 'Session : '}</strong> {groupName}</div>
                  <div><strong>{isEn ? 'Participants: ' : 'Participants : '}</strong> {participantsCount} {isEn ? 'people' : 'personnes'}</div>
                  <div className="col-span-2"><strong>{isEn ? 'Practiced scenario: ' : 'Scénario travaillé : '}</strong> {scenario.title}</div>
                </div>

                <div className="text-[11px] flex flex-col gap-1">
                  <strong className="uppercase">
                    {isEn ? 'Targeted & Validated Skills:' : 'Compétences Travaillées & Validées :'}
                  </strong>
                  <div className="space-y-0.5">
                    {scenario.targetedCompetencies.map((comp) => {
                      const isOk = !!validatedCompetencies[comp];
                      return (
                        <div key={comp} className="flex justify-between py-0.5 border-b border-gray-200">
                          <span>{comp}</span>
                          <span className="font-bold">
                            {isOk
                              ? (isEn ? 'VALIDATED ✓' : 'VALIDÉ ✓')
                              : (isEn ? 'NOT VALIDATED ✕' : 'NON VALIDÉ ✕')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {sessionNotes && (
                  <div className="text-[11px] border-t border-gray-300 pt-1.5">
                    <strong>{isEn ? 'Facilitator Observations:' : 'Observations Formateur :'}</strong>
                    <p className="text-gray-700 italic mt-0.5">{sessionNotes}</p>
                  </div>
                )}

                <div className="border-t-2 border-black pt-2 text-[9px] text-gray-600 flex justify-between">
                  <span>{isEn ? 'Local educational memo generated without server.' : 'Document pédagogique local généré sans serveur.'}</span>
                  <span>{isEn ? 'Notice: Orders from Civil Protection authorities strictly prevail at all times.' : 'Rappel : Les ordres de la Préfecture et de la Sécurité Civile prévalent toujours.'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pied de page modal */}
        <div className="p-4 bg-gray-100 border-t border-gray-300 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrintDebrief}
            className="h-10 px-4 bg-black text-white hover:bg-gray-800 rounded-xl font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>{isEn ? 'Print Session Debrief' : 'Imprimer Bilan de Session'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 bg-white border border-gray-400 hover:bg-gray-50 text-gray-800 rounded-xl font-['Space_Grotesk'] text-[12px] font-bold uppercase transition-colors"
          >
            {isEn ? 'Close' : 'Fermer'}
          </button>
        </div>
      </div>
    </div>
  );
};
