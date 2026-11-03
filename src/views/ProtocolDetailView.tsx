import React, { useState } from 'react';
import { ProtocolData } from '../data/protocols';
import { EmergencyCall } from '../types';
import { playRNASiren, stopSiren } from '../utils/sirenAudio';
import { triggerHaptic } from '../utils/haptics';
import { useTranslation } from '../i18n/I18nContext';
import { getLocalizedProtocol } from '../i18n/content/localizedProtocols';

interface ProtocolDetailViewProps {
  protocol: ProtocolData;
  onBack: () => void;
  onOpenCallModal: (call: EmergencyCall) => void;
  profileMode?: 'simplified' | 'expert';
}

export const ProtocolDetailView: React.FC<ProtocolDetailViewProps> = ({
  protocol: initialProtocol,
  onBack,
  onOpenCallModal,
  profileMode = 'simplified',
}) => {
  const { t, language } = useTranslation();
  const protocol = getLocalizedProtocol(initialProtocol.id, language);

  const [activePhase, setActivePhase] = useState<'avant' | 'pendant' | 'apres'>('pendant');
  const [sirenActive, setSirenActive] = useState(false);

  const toggleSirenAudio = () => {
    triggerHaptic(sirenActive ? 'light' : 'heavy');
    if (sirenActive) {
      stopSiren();
      setSirenActive(false);
    } else {
      setSirenActive(true);
      playRNASiren('alerte', () => setSirenActive(false));
    }
  };

  const handlePrintProtocol = () => {
    window.print();
  };

  return (
    <div className="flex flex-col w-full pt-20 pb-28 min-h-screen max-w-xl mx-auto">
      {/* Action Bar Sub-Header */}
      <div className="px-4 pt-3 pb-2 flex flex-col gap-2">
        {/* Hub d'urgence return button & Criticality badge */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            type="button"
            className="h-12 px-3 bg-[#dce9fd] hover:bg-[#d6e4f8] active:bg-[#cedbef] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>{language === 'fr' ? "HUB D'URGENCE" : 'EMERGENCY HUB'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrintProtocol}
              type="button"
              title={language === 'fr' ? "Imprimer cette fiche réflexe pour le classeur d'urgence" : 'Print emergency card'}
              className="h-12 w-12 bg-white border border-[#c4c6ce] hover:bg-[#e4efff] text-[#001126] rounded flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">print</span>
            </button>

            <div className={`h-12 px-3 ${protocol.badgeBg} text-white rounded flex items-center gap-1.5 font-['Space_Grotesk'] text-[11px] uppercase tracking-wider font-bold shadow-sm`}>
              <span className="material-symbols-outlined text-[18px] animate-pulse">
                priority_high
              </span>
              <span className="truncate">{protocol.badgeCriticality}</span>
            </div>
          </div>
        </div>

        {/* Traçabilité cryptographique et doctrinale */}
        <div className="flex items-center justify-between text-[#44474d] font-['Space_Grotesk'] text-[11px] bg-[#eef4ff] px-3 py-2 rounded border border-[#d6e4f8]">
          <span className="truncate">{protocol.regulatoryBody}</span>
          <span className="text-[#0036ce] font-semibold shrink-0">{protocol.reviewDate}</span>
        </div>

        {/* Titre de la Fiche Réflexe */}
        <div>
          <h2 className="text-[24px] text-[#001126] font-bold tracking-tight leading-tight">
            {protocol.title}
          </h2>
          <p className="text-[13px] text-[#44474d] mt-1 leading-relaxed">
            {protocol.subtitle}
          </p>
        </div>
      </div>

      {/* Visuel Documentaire Technique */}
      <div className="px-4 my-2">
        <div className="relative w-full rounded-xl overflow-hidden shadow-sm bg-[#12263f] border border-[#c4c6ce]">
          <img
            src={protocol.imageUrl}
            alt={protocol.imageAlt}
            className="w-full h-52 object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001126]/95 via-[#001126]/30 to-transparent flex flex-col justify-between p-3.5">
            <div className="flex flex-wrap gap-1.5 items-start">
              {protocol.imageTags.map((tag, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 rounded text-[10px] font-['Space_Grotesk'] uppercase font-bold tracking-wider ${
                    i === 0 ? 'bg-[#0036ce] text-white' : 'bg-white text-[#001126]'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-[#dee1ff] text-[18px]">
                  verified_user
                </span>
                <span className="font-['Space_Grotesk'] text-[11px] text-white truncate">
                  {protocol.imageCaption}
                </span>
              </div>
              <span className="font-['Space_Grotesk'] text-[11px] text-[#dce9fd] font-bold shrink-0">
                {protocol.imageSpec}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bandeau Persistant Système Hors-Ligne & Bouton Sirène */}
      <div className="mx-4 mb-4 flex flex-col gap-2">
        <div className="bg-[#002c1b] text-[#3f9d73] px-3 py-2 rounded-lg flex items-center justify-between border border-[#005236]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#98f6c5]">cloud_off</span>
            <span className="font-['Space_Grotesk'] text-[11px] font-bold tracking-wide">
              {protocol.offlineBannerText}
            </span>
          </div>
          <span className="text-[#98f6c5] text-[11px] font-['Space_Grotesk'] font-bold">
            {language === 'fr' ? '100% DISPO' : '100% READY'}
          </span>
        </div>

        {/* Bouton de test audio de sirène intégrée */}
        <button
          onClick={toggleSirenAudio}
          type="button"
          className={`h-11 px-3 rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center justify-between transition-all border cursor-pointer ${
            sirenActive
              ? 'bg-[#ba1a1a] text-white border-[#ba1a1a] animate-pulse'
              : 'bg-white hover:bg-[#ffdad6]/60 text-[#ba1a1a] border-[#ffdad6]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">
              {sirenActive ? 'volume_off' : 'volume_up'}
            </span>
            <span>
              {sirenActive
                ? (language === 'fr' ? "Arrêter la sirène d'alerte RNA" : 'Stop civil defense siren')
                : (language === 'fr' ? "Écouter le signal sonore national d'alerte (1 min 41s)" : 'Play national alert siren signal (1 min 41s)')}
            </span>
          </div>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
            {sirenActive ? (language === 'fr' ? 'LECTURE' : 'PLAYING') : (language === 'fr' ? 'TEST HORS-LIGNE' : 'OFFLINE TEST')}
          </span>
        </button>
      </div>

      {/* Profil Doctrinal Display Banner */}
      <div className="mx-4 mb-3">
        {profileMode === 'simplified' ? (
          <div className="bg-[#eef4ff] p-3 rounded-xl border border-[#0036ce]/30 flex flex-col gap-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-['Space_Grotesk'] text-[11px] font-bold text-[#0036ce] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">person</span>
                {language === 'fr' ? 'Grand Public • 3 Réflexes Vitaux Absolus' : 'General Public • 3 Vital Absolute Reflexes'}
              </span>
              <span className="text-[10px] bg-[#0036ce] text-white px-1.5 py-0.2 rounded font-bold uppercase">
                {language === 'fr' ? 'Priorité Immédiate' : 'Immediate Priority'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center pt-0.5">
              <div className="bg-white p-2 rounded-lg border border-[#d6e4f8] flex flex-col items-center gap-0.5">
                <span className="material-symbols-outlined text-[#0036ce] text-[18px]">meeting_room</span>
                <span className="font-bold text-[11px] text-[#001126] leading-tight">
                  {language === 'fr' ? '1. Confinez-vous' : '1. Shelter inside'}
                </span>
                <span className="text-[10px] text-[#44474d]">
                  {language === 'fr' ? 'En dur, coupez VMC' : 'Solid walls, cut HVAC'}
                </span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-[#d6e4f8] flex flex-col items-center gap-0.5">
                <span className="material-symbols-outlined text-[#0036ce] text-[18px]">radio</span>
                <span className="font-bold text-[11px] text-[#001126] leading-tight">
                  {language === 'fr' ? '2. Écoutez Radio' : '2. Listen to Radio'}
                </span>
                <span className="text-[10px] text-[#44474d]">
                  {language === 'fr' ? 'France Bleu FM' : 'Emergency FM/DAB+'}
                </span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-[#d6e4f8] flex flex-col items-center gap-0.5">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">medication</span>
                <span className="font-bold text-[11px] text-[#ba1a1a] leading-tight">
                  {language === 'fr' ? '3. Iode sur ordre' : '3. Iodine on order'}
                </span>
                <span className="text-[10px] text-[#44474d]">
                  {language === 'fr' ? 'Inopérant hors fission' : 'Fission only'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#001126] text-white p-3.5 rounded-xl border border-[#12263f] flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <span className="font-['Space_Grotesk'] text-[11px] font-bold text-[#98f6c5] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">school</span>
                {language === 'fr' ? 'Volet Formateur & Références Doctrinales' : 'Trainer Panel & Regulatory Doctrinal References'}
              </span>
              <span className="text-[10px] bg-[#98f6c5] text-[#002c1b] px-1.5 py-0.2 rounded font-bold uppercase">
                {t('nav.expert')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white/5 p-2 rounded border border-white/10">
                <strong className="text-[#98f6c5] block">{language === 'fr' ? 'Cadre Réglementaire :' : 'Regulatory Framework:'}</strong>
                <span className="text-[#dce9fd] text-[10.5px]">CSI Art. L741-1 • Plans PIRATOX/PIRANET • Directive Seveso III</span>
              </div>
              <div className="bg-white/5 p-2 rounded border border-white/10">
                <strong className="text-[#98f6c5] block">{language === 'fr' ? 'Seuils Dosimétriques :' : 'Dosimetric Thresholds:'}</strong>
                <span className="text-[#dce9fd] text-[10.5px]">Seuil thyroïde 50 mSv (KI) • Zone PPI 10-20km • Débit alerte 10 µSv/h</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 1 : LES 4 RÉFLEXES ESSENTIELS IMMÉDIATS (0 - 15 MIN) */}
      <section className="mx-4 mb-5 bg-[#12263f] text-white rounded-xl p-4 shadow-md border border-[#001126]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffdad6] text-[22px]">timer</span>
            <h3 className="font-['Space_Grotesk'] text-[13px] uppercase tracking-wide text-white font-bold">
              {protocol.reflexesTitle}
            </h3>
          </div>
          <span className="px-2 py-0.5 bg-[#ba1a1a] text-white rounded font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider">
            {protocol.reflexesPriority}
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {protocol.reflexes.map((reflex) => (
            <div
              key={reflex.num}
              className="bg-[#001126]/60 p-3 rounded-lg flex gap-3 items-start border border-[#354862]/40"
            >
              <div className="w-8 h-8 rounded bg-[#ba1a1a] text-white flex items-center justify-center font-['Space_Grotesk'] font-bold shrink-0 text-[15px]">
                {reflex.num}
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-[16px] text-white font-bold leading-tight">
                  {reflex.title}
                </h4>
                <p className="text-[13px] text-[#dce9fd] mt-1 leading-relaxed">
                  {reflex.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2 : SÉQUENÇAGE OPÉRATIONNEL INTERACTIF (AVANT / PENDANT / APRÈS) */}
      <section className="mx-4 mb-5 bg-white rounded-xl p-4 shadow-sm border border-[#c4c6ce]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0036ce] text-[22px]">
              format_list_bulleted
            </span>
            <h3 className="text-[18px] text-[#001126] font-bold">
              {language === 'fr' ? 'Séquençage Opérationnel' : 'Operational Sequencing'}
            </h3>
          </div>
          <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] font-semibold">
            {language === 'fr' ? "3 PHASES D'ACTION" : '3 ACTION PHASES'}
          </span>
        </div>

        {/* Sélecteur d'onglets (Boutons 48px minimum) */}
        <div className="grid grid-cols-3 gap-1 bg-[#e4efff] p-1 rounded-lg mb-4" role="tablist">
          <button
            onClick={() => setActivePhase('avant')}
            role="tab"
            aria-selected={activePhase === 'avant'}
            className={`h-12 rounded font-['Space_Grotesk'] text-[12px] font-bold transition-all flex items-center justify-center cursor-pointer ${
              activePhase === 'avant'
                ? 'bg-[#001126] text-white shadow-sm'
                : 'text-[#44474d] hover:text-[#001126]'
            }`}
          >
            {language === 'fr' ? '1. AVANT' : '1. BEFORE'}
          </button>
          <button
            onClick={() => setActivePhase('pendant')}
            role="tab"
            aria-selected={activePhase === 'pendant'}
            className={`h-12 rounded font-['Space_Grotesk'] text-[12px] font-bold transition-all flex items-center justify-center cursor-pointer ${
              activePhase === 'pendant'
                ? 'bg-[#001126] text-white shadow-sm'
                : 'text-[#44474d] hover:text-[#001126]'
            }`}
          >
            {language === 'fr' ? '2. PENDANT' : '2. DURING'}
          </button>
          <button
            onClick={() => setActivePhase('apres')}
            role="tab"
            aria-selected={activePhase === 'apres'}
            className={`h-12 rounded font-['Space_Grotesk'] text-[12px] font-bold transition-all flex items-center justify-center cursor-pointer ${
              activePhase === 'apres'
                ? 'bg-[#001126] text-white shadow-sm'
                : 'text-[#44474d] hover:text-[#001126]'
            }`}
          >
            {language === 'fr' ? '3. APRÈS' : '3. AFTER'}
          </button>
        </div>

        {/* Contenu selon la phase */}
        <div className="flex flex-col gap-3">
          {protocol.phases[activePhase].map((step, idx) => (
            <div key={idx} className="bg-[#eef4ff] p-3 rounded-lg border border-[#d6e4f8]">
              <h4 className="font-['Space_Grotesk'] text-[13px] text-[#001126] font-bold flex items-center gap-1.5 mb-1.5">
                <span className="material-symbols-outlined text-[#0036ce] text-[18px]">
                  {step.icon}
                </span>
                <span>{step.title}</span>
              </h4>
              {step.desc && (
                <p className="text-[13px] text-[#44474d] leading-relaxed">
                  {step.desc}
                </p>
              )}
              {step.items && (
                <ul className="flex flex-col gap-1.5 mt-2">
                  {step.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-[12.5px] text-[#001126] flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#0036ce] text-[14px] shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 : LES GESTES STRICTEMENT INTERDITS */}
      <section className="mx-4 mb-5 bg-[#ffdad6] rounded-xl p-4 shadow-sm border border-[#ffb4ab]">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[#ba1a1a] text-[24px]">
            do_not_disturb_on
          </span>
          <h3 className="text-[18px] text-[#ba1a1a] font-bold">
            {language === 'fr' ? 'Gestes Strictement Interdits' : 'Strictly Prohibited Actions'}
          </h3>
        </div>

        <div className="flex flex-col gap-2.5">
          {protocol.forbiddenActions.map((action, idx) => (
            <div key={idx} className="bg-white p-3 rounded-lg border border-[#ffb4ab] flex flex-col gap-1">
              <span className="text-[14px] font-bold text-[#ba1a1a]">
                {action.title}
              </span>
              <p className="text-[12.5px] text-[#44474d] leading-relaxed">
                {action.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 : PÉDAGOGIE & CARTE D'AGENTS */}
      {protocol.pedagogy && (
        <section className="mx-4 mb-5 bg-white rounded-xl p-4 shadow-sm border border-[#c4c6ce]">
          <h3 className="text-[18px] text-[#001126] font-bold mb-1">
            {protocol.pedagogy.title}
          </h3>
          {protocol.pedagogy.subtitle && (
            <p className="text-[12px] text-[#74777e] mb-3">
              {protocol.pedagogy.subtitle}
            </p>
          )}

          <div className="grid grid-cols-1 gap-2.5">
            {protocol.pedagogy.cards.map((card, i) => (
              <div key={i} className="bg-[#f8f9ff] p-3 rounded-lg border border-[#d6e4f8] flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[13px] text-[#001126]">
                    {card.title}
                  </span>
                  <span className={`text-[10px] font-['Space_Grotesk'] font-bold px-2 py-0.5 rounded uppercase ${card.tagClass}`}>
                    {card.tag}
                  </span>
                </div>
                {card.examples && (
                  <span className="text-[11px] text-[#0036ce] font-semibold">
                    {language === 'fr' ? 'Exemples :' : 'Examples:'} {card.examples}
                  </span>
                )}
                <p className="text-[12px] text-[#44474d] leading-relaxed">
                  {card.specificity}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 5 : SIGNES CLINIQUES D'ALERTE */}
      <section className="mx-4 mb-5 bg-white rounded-xl p-4 shadow-sm border border-[#c4c6ce]">
        <h3 className="text-[18px] text-[#001126] font-bold mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ba1a1a]">medical_services</span>
          <span>{protocol.emergencySymptoms.title}</span>
        </h3>
        <p className="text-[12px] text-[#74777e] mb-2">
          {protocol.emergencySymptoms.intro}
        </p>

        <ul className="flex flex-col gap-1.5">
          {protocol.emergencySymptoms.symptoms.map((s, idx) => (
            <li key={idx} className="text-[12.5px] text-[#001126] flex items-start gap-2">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[16px] shrink-0 mt-0.5">
                warning
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ul>

        {protocol.emergencySymptoms.alertNote && (
          <div className="mt-3 p-2.5 bg-[#ffdad6]/50 rounded border border-[#ffb4ab] text-[11.5px] text-[#93000a] font-semibold">
            {protocol.emergencySymptoms.alertNote}
          </div>
        )}
      </section>

      {/* Raccourcis d'Urgence Téléphonique Directe */}
      <section className="mx-4 mb-4 flex flex-col gap-2">
        <h3 className="font-['Space_Grotesk'] text-[12px] uppercase font-bold text-[#44474d] px-1">
          {language === 'fr' ? 'Numéros d\'urgence officiels' : 'Official Emergency Numbers'}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() =>
              onOpenCallModal({
                number: '15',
                name: 'SAMU - Urgences Médicales',
                subtitle: '15 • SAMU',
                desc: language === 'fr' ? "Appel d'urgence vitale pour régulation médicale immédiate." : 'Urgent medical triage & critical response.',
              })
            }
            type="button"
            className="h-12 bg-[#001126] active:bg-[#12263f] text-white rounded-lg flex items-center justify-center gap-2 font-['Space_Grotesk'] text-[13px] font-bold transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#ffdad6]">
              phone_in_talk
            </span>
            <span>15 • SAMU</span>
          </button>

          <button
            onClick={() =>
              onOpenCallModal({
                number: '18',
                name: 'Sapeurs-Pompiers',
                subtitle: '18 • POMPIERS',
                desc: language === 'fr' ? 'Secours incendie, toxiques et risques imminents.' : 'Firefighters & hazardous materials response.',
              })
            }
            type="button"
            className="h-12 bg-[#001126] active:bg-[#12263f] text-white rounded-lg flex items-center justify-center gap-2 font-['Space_Grotesk'] text-[13px] font-bold transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#ffdad6]">
              fire_truck
            </span>
            <span>18 • POMPIERS</span>
          </button>

          <button
            onClick={() =>
              onOpenCallModal({
                number: '112',
                name: "112 - Urgence Européenne",
                subtitle: '112 • EUROPE',
                desc: language === 'fr' ? "Numéro universel d'urgence européen." : 'Universal European emergency number.',
              })
            }
            type="button"
            className="h-12 bg-white active:bg-[#e4efff] text-[#001126] border border-[#c4c6ce] rounded-lg flex items-center justify-center gap-2 font-['Space_Grotesk'] text-[13px] font-bold transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>112 • EUROPE</span>
          </button>

          <button
            onClick={() =>
              onOpenCallModal({
                number: '114',
                name: '114 - SMS Sourds & Muets',
                subtitle: '114 • SMS SOURDS',
                desc: language === 'fr' ? 'Contact silencieux par SMS.' : 'Silent SMS contact for deaf / hearing impaired.',
              })
            }
            type="button"
            className="h-12 bg-white active:bg-[#e4efff] text-[#001126] border border-[#c4c6ce] rounded-lg flex items-center justify-center gap-2 font-['Space_Grotesk'] text-[13px] font-bold transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">sms</span>
            <span>114 • SMS</span>
          </button>
        </div>
      </section>

      {/* Cartouche de Traçabilité & Validation Éditoriale */}
      <div className="mx-4 mb-3 p-3 bg-white rounded-xl border border-[#c4c6ce] text-[12px] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#3f9d73] text-[22px]">verified</span>
          <div className="flex flex-col">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold text-[#001126] uppercase">
              {language === 'fr' ? 'Statut Doctrinal : Corpus Validé' : 'Doctrinal Status: Validated Corpus'}
            </span>
            <span className="text-[11px] text-[#44474d]">
              {language === 'fr'
                ? 'Source officielle vérifiée • Révision éditoriale du 16 Octobre 2026'
                : 'Verified official source • Editorial revision Oct 16, 2026'}
            </span>
          </div>
        </div>
        <span className="font-['Space_Grotesk'] text-[10px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-bold uppercase shrink-0">
          {language === 'fr' ? 'CONFORME ÉTAT' : 'GOV COMPLIANT'}
        </span>
      </div>

      {/* SECTION 6 : CLAUSE INSTITUTIONNELLE DE PRIMAUTÉ & CADRE LÉGAL */}
      <footer className="mx-4 mb-4 p-3.5 bg-[#eef4ff] rounded-xl text-[#44474d] text-[12px] leading-relaxed border border-[#d6e4f8]">
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-[#001126] text-[20px] shrink-0 mt-0.5">
            policy
          </span>
          <div>
            <p className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-[#001126] mb-1">
              {protocol.institutionalClause.title}
            </p>
            <p className="leading-relaxed">
              {protocol.institutionalClause.text}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
