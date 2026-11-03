import React, { useState, useMemo } from 'react';
import { getLocalizedEmergencyScenarios } from '../i18n/content/localizedCoherenceMatrix';
import { useTranslation } from '../i18n/I18nContext';

export interface EmergencyScenarioDefinition {
  id: string;
  title: string;
  category: 'confinement' | 'evacuation' | 'inconnu' | 'hors-ligne' | 'donnee_manquante' | 'arbitrage_officiel';
  icon: string;
  officialInstruction: string;
  immediateAction: string;
  fatalTraps: string[];
  antiFalseSecurityChecks: string[];
  civilSecurityReference: string;
}

export const EMERGENCY_SCENARIOS: EmergencyScenarioDefinition[] = [
  {
    id: 'confinement',
    title: '1. Alerte officielle avec consigne de confinement',
    category: 'confinement',
    icon: 'home_pin',
    officialInstruction: 'Rejoindre immédiatement le bâtiment en dur le plus proche. Calfeutrer fenêtres, portes et aérations.',
    immediateAction: 'Entrer en dur, couper toute ventilation (VMC, hottes, clim), fermer fenêtres/volets, écouter France Bleu FM.',
    fatalTraps: [
      'Aller chercher ses enfants à l\'école (interdit : le Plan Particulier de Mise en Sûreté PPMS les protège déjà, sortir vous expose et bloque les secours).',
      'Téléphoner sans motif vital (risque de saturer les réseaux cellulaires nécessaires aux secours).',
      'Allumer une flamme ou une bougie (risque d\'explosion en atmosphère inflammable ou asphyxie en milieu calfeutré).'
    ],
    antiFalseSecurityChecks: [
      'L\'application ne présente JAMAIS une pièce comme 100% étanche sans calfeutrage actif.',
      'L\'application interdit formellement de sortir avant la sirène de fin d\'alerte ou confirmation radio officielle.',
      'Ne retarde jamais l\'accès aux 3 consignes vitales par des formulaires ou des diagnostics secondaires.'
    ],
    civilSecurityReference: 'Guide National d\'Alerte & PPMS Éducation Nationale / Ministère de l\'Intérieur'
  },
  {
    id: 'evacuation',
    title: '2. Demande d\'évacuation par les autorités',
    category: 'evacuation',
    icon: 'directions_run',
    officialInstruction: 'Évacuation ordonnée UNIQUEMENT sur ordre formel du Préfet ou des forces de sécurité intérieure.',
    immediateAction: 'Prendre le kit d\'urgence 72h + documents vitaux + ordonnances, couper eau/gaz/électricité, emprunter strictement l\'axe fixé par les secours.',
    fatalTraps: [
      'Évacuation spontanée non ordonnée : fuir sur les axes routiers peut vous piéger en plein panache toxique et bloquer les véhicules d\'intervention.',
      'Fuir dans l\'axe du vent au lieu d\'un déplacement perpendiculaire à la trajectoire du nuage.',
      'Retourner chercher un objet oublié au domicile.'
    ],
    antiFalseSecurityChecks: [
      'L\'application rappelle expressément qu\'une fuite spontanée est dangereuse et que l\'évacuation ne se fait que sur ordre.',
      'Les itinéraires d\'évacuation réels sont dictés par les forces de l\'ordre sur le terrain, l\'appli ne simule pas un itinéraire fantaisiste.',
      'Rappel que le confinement reste la règle par défaut tant que l\'évacuation n\'est pas formellement ordonnée.'
    ],
    civilSecurityReference: 'Doctrine Opérationnelle Plan ORSEC Nombreuses Victimes / Évacuation Préfectorale'
  },
  {
    id: 'inconnu',
    title: '3. Événement dont la nature est inconnue',
    category: 'inconnu',
    icon: 'help',
    officialInstruction: 'Alerte générale par sirène nationale ou FR-Alert : mise à l\'abri universelle immédiate sans chercher à identifier le toxique.',
    immediateAction: 'Mise à l\'abri en dur, fermeture de toutes les issues, coupure VMC, allumage du poste radio FM sur fréquence de service public.',
    fatalTraps: [
      'Prendre des comprimés d\'iode de manière spontanée : L\'iode ne protège QUE la thyroïde de l\'iode radioactif 131. Inutile et contre-indiqué en cas d\'accident chimique.',
      'Sortir pour filmer, observer ou renifler l\'odeur anormale.',
      'Attendre de savoir s\'il s\'agit d\'un accident biologique, chimique ou industriel pour se mettre à l\'abri.'
    ],
    antiFalseSecurityChecks: [
      'L\'application affiche le réflexe universel « Confinement + Écoute radio » en premier sans questionnaire préalable.',
      'L\'automédication à l\'iode est strictement interdite sans ordre express du Préfet.',
      'L\'interface avertit que l\'odeur ou l\'absence d\'odeur n\'est pas un indicateur d\'innocuité (nombreux toxiques incolores et inodores).'
    ],
    civilSecurityReference: 'Instruction Interministérielle relative à la réponse opérationnelle aux menaces NRBC-E'
  },
  {
    id: 'hors-ligne',
    title: '4. Coupure de réseau pendant la consultation',
    category: 'hors-ligne',
    icon: 'wifi_off',
    officialInstruction: 'Réseaux mobiles saturés ou coupés : basculer immédiatement sur l\'information hertzienne analogique FM.',
    immediateAction: 'Activer la radio FM à piles/manivelle (bande 87.5 - 108 MHz). Se fier aux fiches locales préchargées sans attendre internet.',
    fatalTraps: [
      'Penser que l\'absence de nouvelles sur son smartphone signifie que l\'alerte est terminée (« Absence de signal ≠ Fin de danger »).',
      'Passer des appels répétés vidant la batterie du téléphone indispensable pour de futurs appels SOS.',
      'Faire confiance à des rumeurs de voisinage non vérifiées.'
    ],
    antiFalseSecurityChecks: [
      '100% des contenus critiques, fiches réflexes et calculs d\'autonomie restent opérationnels sans connexion.',
      'L\'application affiche explicitement le badge hors-ligne et rappelle que l\'absence de données en direct ne garantit pas la fin de l\'incident.',
      'Zéro blocage ou écran blanc si l\'API réseau échoue.'
    ],
    civilSecurityReference: 'Guide Résilience Télécom & Continuité d\'Activité ANSSI / DGSCGC'
  },
  {
    id: 'donnee_manquante',
    title: '5. Fiche absente, ancienne ou non validée',
    category: 'donnee_manquante',
    icon: 'troubleshoot',
    officialInstruction: 'Principe de précaution opérationnel : en cas d\'incertitude territoriale ou de données manquantes, appliquer le niveau de protection maximal.',
    immediateAction: 'Adopter la posture conservatrice : confinement strict en dur, calfeutrage, écoute radio, inventaire des moyens de survie.',
    fatalTraps: [
      'Conclure qu\'une zone géographique est « sûre » parce qu\'elle ne figure pas dans une base de données.',
      'Considérer une estimation provisoire comme une mesure certifiée.',
      'Ignorer un danger réel sous prétexte qu\'aucune fiche détaillée n\'est disponible.'
    ],
    antiFalseSecurityChecks: [
      'L\'application ne conclut JAMAIS à un risque nul ou à une sécurité garantie à partir de données territoriales manquantes.',
      'Les estimations ou données anciennes sont explicitement marquées avec date de capture et statut « Approximatif / Donnée non mesurée ».',
      'Une case cochée dans une checklist n\'est jamais assimilée à une quantité d\'eau ou de vivres certifiée.'
    ],
    civilSecurityReference: 'Code de la Sécurité Intérieure — Principe Général de Précaution Civile'
  },
  {
    id: 'arbitrage_officiel',
    title: '6. Contradiction entre fiche et consigne officielle récente',
    category: 'arbitrage_officiel',
    icon: 'gavel',
    officialInstruction: 'Hiérarchie juridique absolue : Les ordres diffusés par le Préfet de département, la DGSCGC et les forces de l\'ordre prévalent sur toute documentation.',
    immediateAction: 'Exécuter sans hésitation l\'ordre officiel transmis par FR-Alert, mégaphone, sirène ou radio publique France Bleu.',
    fatalTraps: [
      'Contester un ordre d\'évacuation ou de confinement préfectoral sous prétexte qu\'une application ou un tutoriel indique autre chose.',
      'Privilégier une recommandation générale théorique par rapport à une consigne tactique adaptée au terrain.',
      'Retarder l\'exécution de l\'ordre en cherchant des confirmations sur les réseaux sociaux.'
    ],
    antiFalseSecurityChecks: [
      'L\'application rappelle sur CHAQUE écran d\'urgence que les ordres du Préfet et des secours priment en toutes circonstances.',
      'L\'application se définit strictement comme un outil pédagogique et logistique, JAMAIS comme une autorité de commandement opérationnel.',
      'Tout utilisateur peut vérifier à tout moment ce principe de subordination aux consignes réelles.'
    ],
    civilSecurityReference: 'Articles L742-1 et suivants du Code de la Sécurité Intérieure (Prérogatives de Police et Direction des Opérations de Secours)'
  }
];

interface EmergencyCoherenceMatrixModalProps {
  onClose: () => void;
}

export const EmergencyCoherenceMatrixModal: React.FC<EmergencyCoherenceMatrixModalProps> = ({ onClose }) => {
  const { language } = useTranslation();
  const isEn = language === 'en';
  const scenarios = useMemo(() => getLocalizedEmergencyScenarios(language), [language]);

  const [selectedId, setSelectedId] = useState<string>('confinement');
  const currentScenario = scenarios.find((s) => s.id === selectedId) || scenarios[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-3xl bg-[#001126] text-white rounded-2xl shadow-2xl border border-red-500/40 flex flex-col max-h-[92vh] overflow-hidden">
        {/* En-tête */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-red-950/80 to-[#001126]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/40 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-bold font-['Space_Grotesk'] text-white">
                  {isEn ? 'Operational Coherence Matrix (6 Scenarios)' : 'Matrice de Cohérence Opérationnelle (6 Scénarios)'}
                </h2>
                <span className="text-[10px] bg-red-600 text-white font-['Space_Grotesk'] font-bold px-2 py-0.5 rounded uppercase">
                  {isEn ? 'Priority P1' : 'Priorité P1'}
                </span>
              </div>
              <p className="text-[11px] text-[#c4c6ce]">
                {isEn
                  ? 'Doctrinal guarantee: Zero false impression of safety • Absolute primacy of official orders'
                  : 'Garantie déontologique : Zéro fausse impression de sécurité • Primauté absolue des ordres officiels'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Barre de navigation des 6 scénarios */}
        <div className="p-2 bg-[#000a16] border-b border-white/10 overflow-x-auto flex gap-1.5 shrink-0">
          {scenarios.map((scenario) => {
            const isSelected = scenario.id === selectedId;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setSelectedId(scenario.id)}
                className={`px-3 py-2 rounded-xl text-left font-['Space_Grotesk'] text-[11px] font-bold flex items-center gap-2 shrink-0 transition-all ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-sm ring-1 ring-red-400'
                    : 'bg-white/5 text-[#c4c6ce] hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{scenario.icon}</span>
                <span className="truncate max-w-[170px]">{scenario.title.split('. ')[1] || scenario.title}</span>
              </button>
            );
          })}
        </div>

        {/* Contenu détaillé du scénario sélectionné */}
        <div className="p-4 sm:p-5 overflow-y-auto flex flex-col gap-4">
          {/* Bannière de doctrine */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-[20px]">policy</span>
              <span className="font-['Space_Grotesk'] text-[12px] font-bold text-amber-300 uppercase tracking-wider">
                {isEn ? 'Official Civil Protection Directive' : 'Consigne officielle de la Sécurité Civile'}
              </span>
            </div>
            <p className="text-[13px] text-white font-medium leading-snug">
              {currentScenario.officialInstruction}
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] text-[#c4c6ce]">
              <span className="font-bold text-white">{isEn ? 'Immediate action:' : 'Réflexe immédiat :'}</span>
              <span>{currentScenario.immediateAction}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Colonne Pièges fatals */}
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-red-300">
                <span className="material-symbols-outlined text-[20px]">block</span>
                <h3 className="font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider">
                  {isEn ? 'Fatal Traps & Prohibited Behaviors' : 'Pièges mortels & Comportements à proscrire'}
                </h3>
              </div>
              <ul className="flex flex-col gap-2 text-[11px] text-[#ffd599] leading-relaxed">
                {currentScenario.fatalTraps.map((trap, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span>{trap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne Anti-Fausse Sécurité */}
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-blue-300">
                <span className="material-symbols-outlined text-[20px]">verified</span>
                <h3 className="font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider">
                  {isEn ? 'NRBCOR Application Safeguards' : "Garanties de l'application NRBCOR"}
                </h3>
              </div>
              <ul className="flex flex-col gap-2 text-[11px] text-blue-100 leading-relaxed">
                {currentScenario.antiFalseSecurityChecks.map((check, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Référence juridique & déontologique */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-[11px] text-[#c4c6ce]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#ffd599]">gavel</span>
              <span><strong>{isEn ? 'Legal Reference:' : 'Cadre de référence :'}</strong> {currentScenario.civilSecurityReference}</span>
            </div>
            <span className="font-['Space_Grotesk'] text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
              {isEn ? 'DOCTRINE COMPLIANT' : 'CONFORME DOCTRINE'}
            </span>
          </div>
        </div>

        {/* Pied de page avec confirmation de primauté */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#000a16] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-red-300 text-center sm:text-left leading-tight">
            ⚠️ <strong>{isEn ? 'Strict rule:' : 'Rappel intangible :'}</strong> {isEn
              ? 'Directives from competent authorities (Prefect, civil protection, Police, Fire Services) always supersede this application.'
              : "Les instructions des autorités compétentes (Préfet, FR-Alert, Police, Pompiers) priment toujours sur l'application."}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-['Space_Grotesk'] text-[12px] font-bold uppercase transition-colors shrink-0 shadow-sm"
          >
            {isEn ? 'Understood & Close' : 'Compris & Fermer'}
          </button>
        </div>
      </div>
    </div>
  );
};

