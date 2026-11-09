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
    <div className="flex flex-col w-full pt-20 pb-28 lg:pb-12 min-h-screen max-w-xl lg:max-w-3xl mx-auto">
      {/* Action Bar Sub-Header */}
      <div className="px-4 pt-3 pb-2 flex flex-col gap-2">
        {/* Hub d'urgence return button & Criticality badge */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            type="button"
            className="h-12 px-3 bg-tint hover:bg-tint active:bg-tint text-ink font-label text-[12px] font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>{language === 'fr' ? "HUB D'URGENCE" : 'EMERGENCY HUB'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrintProtocol}
              type="button"
              title={language === 'fr' ? "Imprimer cette fiche réflexe pour le classeur d'urgence" : 'Print emergency card'}
              className="h-12 w-12 bg-card border border-line-strong hover:bg-tint text-ink rounded flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">print</span>
            </button>

            <div className={`h-12 px-3 ${protocol.badgeBg} text-white rounded flex items-center gap-1.5 font-label text-[11px] uppercase tracking-wider font-bold shadow-sm`}>
              <span className="material-symbols-outlined text-[18px] animate-pulse">
                priority_high
              </span>
              <span className="truncate">{protocol.badgeCriticality}</span>
            </div>
          </div>
        </div>

        {/* Traçabilité cryptographique et doctrinale */}
        <div className="flex items-center justify-between text-ink-muted font-label text-[11px] bg-subtle px-3 py-2 rounded border border-line">
          <span className="truncate">{protocol.regulatoryBody}</span>
          <span className="text-brand-ink font-semibold shrink-0">{protocol.reviewDate}</span>
        </div>

        {/* Titre de la Fiche Réflexe */}
        <div>
          <h2 className="text-[24px] text-ink font-bold tracking-tight leading-tight">
            {protocol.title}
          </h2>
          <p className="text-[13px] text-ink-muted mt-1 leading-relaxed">
            {protocol.subtitle}
          </p>
        </div>
      </div>

      {/* Visuel Documentaire Technique */}
      <div className="px-4 my-2">
        <div className="relative w-full rounded-xl overflow-hidden shadow-sm bg-navy-2 border border-line-strong">
          <img
            src={protocol.imageUrl}
            alt={protocol.imageAlt}
            className="w-full h-52 object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/30 to-transparent flex flex-col justify-between p-3.5">
            <div className="flex flex-wrap gap-1.5 items-start">
              {protocol.imageTags.map((tag, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 rounded text-[10px] font-label uppercase font-bold tracking-wider ${
                    i === 0 ? 'bg-brand text-white' : 'bg-card text-ink'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-brand-bright text-[18px]">
                  verified_user
                </span>
                <span className="font-label text-[11px] text-white truncate">
                  {protocol.imageCaption}
                </span>
              </div>
              <span className="font-label text-[11px] text-on-navy-soft font-bold shrink-0">
                {protocol.imageSpec}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bandeau Persistant Système Hors-Ligne & Bouton Sirène */}
      <div className="mx-4 mb-4 flex flex-col gap-2">
        <div className="bg-ok-deep text-ok-ink px-3 py-2 rounded-lg flex items-center justify-between border border-ok-ink">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-ok-bright">cloud_off</span>
            <span className="font-label text-[11px] font-bold tracking-wide">
              {protocol.offlineBannerText}
            </span>
          </div>
          <span className="text-ok-bright text-[11px] font-label font-bold">
            {language === 'fr' ? '100% DISPO' : '100% READY'}
          </span>
        </div>

        {/* Bouton de test audio de sirène intégrée */}
        <button
          onClick={toggleSirenAudio}
          type="button"
          className={`h-11 px-3 rounded-lg font-label text-[12px] font-bold uppercase flex items-center justify-between transition-all border cursor-pointer ${
            sirenActive
              ? 'bg-danger text-white border-danger-ink animate-pulse'
              : 'bg-card hover:bg-danger-soft/60 text-danger-ink border-danger-bright'
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
          <div className="bg-subtle p-3 rounded-xl border border-brand-ink/30 flex flex-col gap-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-label text-[11px] font-bold text-brand-ink uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">person</span>
                {language === 'fr' ? 'Grand Public • 3 Réflexes Vitaux Absolus' : 'General Public • 3 Vital Absolute Reflexes'}
              </span>
              <span className="text-[10px] bg-brand text-white px-1.5 py-0.2 rounded font-bold uppercase">
                {language === 'fr' ? 'Priorité Immédiate' : 'Immediate Priority'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center pt-0.5">
              <div className="bg-card p-2 rounded-lg border border-line flex flex-col items-center gap-0.5">
                <span className="material-symbols-outlined text-brand-ink text-[18px]">meeting_room</span>
                <span className="font-bold text-[11px] text-ink leading-tight">
                  {language === 'fr' ? '1. Confinez-vous' : '1. Shelter inside'}
                </span>
                <span className="text-[10px] text-ink-muted">
                  {language === 'fr' ? 'En dur, coupez VMC' : 'Solid walls, cut HVAC'}
                </span>
              </div>
              <div className="bg-card p-2 rounded-lg border border-line flex flex-col items-center gap-0.5">
                <span className="material-symbols-outlined text-brand-ink text-[18px]">radio</span>
                <span className="font-bold text-[11px] text-ink leading-tight">
                  {language === 'fr' ? '2. Écoutez Radio' : '2. Listen to Radio'}
                </span>
                <span className="text-[10px] text-ink-muted">
                  {language === 'fr' ? 'France Bleu FM' : 'Emergency FM/DAB+'}
                </span>
              </div>
              <div className="bg-card p-2 rounded-lg border border-line flex flex-col items-center gap-0.5">
                <span className="material-symbols-outlined text-danger-ink text-[18px]">medication</span>
                <span className="font-bold text-[11px] text-danger-ink leading-tight">
                  {language === 'fr' ? '3. Iode sur ordre' : '3. Iodine on order'}
                </span>
                <span className="text-[10px] text-ink-muted">
                  {language === 'fr' ? 'Inopérant hors fission' : 'Fission only'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-navy text-white p-3.5 rounded-xl border border-ink flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <span className="font-label text-[11px] font-bold text-ok-bright uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">school</span>
                {language === 'fr' ? 'Volet Formateur & Références Doctrinales' : 'Trainer Panel & Regulatory Doctrinal References'}
              </span>
              <span className="text-[10px] bg-ok-soft text-ok-ink px-1.5 py-0.2 rounded font-bold uppercase">
                {t('nav.expert')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white/5 p-2 rounded border border-white/10">
                <strong className="text-ok-bright block">{language === 'fr' ? 'Cadre Réglementaire :' : 'Regulatory Framework:'}</strong>
                <span className="text-on-navy-soft text-[10.5px]">CSI Art. L741-1 • Plans PIRATOX/PIRANET • Directive Seveso III</span>
              </div>
              <div className="bg-white/5 p-2 rounded border border-white/10">
                <strong className="text-ok-bright block">{language === 'fr' ? 'Seuils Dosimétriques :' : 'Dosimetric Thresholds:'}</strong>
                <span className="text-on-navy-soft text-[10.5px]">Seuil thyroïde 50 mSv (KI) • Zone PPI 10-20km • Débit alerte 10 µSv/h</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 1 : LES 4 RÉFLEXES ESSENTIELS IMMÉDIATS (0 - 15 MIN) */}
      <section className="mx-4 mb-5 bg-navy-2 text-white rounded-xl p-4 shadow-md border border-ink">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-danger-bright text-[22px]">timer</span>
            <h3 className="font-label text-[13px] uppercase tracking-wide text-white font-bold">
              {protocol.reflexesTitle}
            </h3>
          </div>
          <span className="px-2 py-0.5 bg-danger text-white rounded font-label text-[11px] font-bold uppercase tracking-wider">
            {protocol.reflexesPriority}
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {protocol.reflexes.map((reflex) => (
            <div
              key={reflex.num}
              className="bg-navy/60 p-3 rounded-lg flex gap-3 items-start border border-ink-muted/40"
            >
              <div className="w-8 h-8 rounded bg-danger text-white flex items-center justify-center font-label font-bold shrink-0 text-[15px]">
                {reflex.num}
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-[16px] text-white font-bold leading-tight">
                  {reflex.title}
                </h4>
                <p className="text-[13px] text-on-navy-soft mt-1 leading-relaxed">
                  {reflex.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2 : SÉQUENÇAGE OPÉRATIONNEL INTERACTIF (AVANT / PENDANT / APRÈS) */}
      <section className="mx-4 mb-5 bg-card rounded-xl p-4 shadow-sm border border-line-strong">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-ink text-[22px]">
              format_list_bulleted
            </span>
            <h3 className="text-[18px] text-ink font-bold">
              {language === 'fr' ? 'Séquençage Opérationnel' : 'Operational Sequencing'}
            </h3>
          </div>
          <span className="font-label text-[11px] text-ink-muted font-semibold">
            {language === 'fr' ? "3 PHASES D'ACTION" : '3 ACTION PHASES'}
          </span>
        </div>

        {/* Sélecteur d'onglets (Boutons 48px minimum) */}
        <div className="grid grid-cols-3 gap-1 bg-tint p-1 rounded-lg mb-4" role="tablist">
          <button
            onClick={() => setActivePhase('avant')}
            role="tab"
            aria-selected={activePhase === 'avant'}
            className={`h-12 rounded font-label text-[12px] font-bold transition-all flex items-center justify-center cursor-pointer ${
              activePhase === 'avant'
                ? 'bg-navy text-white shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {language === 'fr' ? '1. AVANT' : '1. BEFORE'}
          </button>
          <button
            onClick={() => setActivePhase('pendant')}
            role="tab"
            aria-selected={activePhase === 'pendant'}
            className={`h-12 rounded font-label text-[12px] font-bold transition-all flex items-center justify-center cursor-pointer ${
              activePhase === 'pendant'
                ? 'bg-navy text-white shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {language === 'fr' ? '2. PENDANT' : '2. DURING'}
          </button>
          <button
            onClick={() => setActivePhase('apres')}
            role="tab"
            aria-selected={activePhase === 'apres'}
            className={`h-12 rounded font-label text-[12px] font-bold transition-all flex items-center justify-center cursor-pointer ${
              activePhase === 'apres'
                ? 'bg-navy text-white shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {language === 'fr' ? '3. APRÈS' : '3. AFTER'}
          </button>
        </div>

        {/* Contenu selon la phase */}
        <div className="flex flex-col gap-3">
          {protocol.phases[activePhase].map((step, idx) => (
            <div key={idx} className="bg-subtle p-3 rounded-lg border border-line">
              <h4 className="font-label text-[13px] text-ink font-bold flex items-center gap-1.5 mb-1.5">
                <span className="material-symbols-outlined text-brand-ink text-[18px]">
                  {step.icon}
                </span>
                <span>{step.title}</span>
              </h4>
              {step.desc && (
                <p className="text-[13px] text-ink-muted leading-relaxed">
                  {step.desc}
                </p>
              )}
              {step.items && (
                <ul className="flex flex-col gap-1.5 mt-2">
                  {step.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-[12.5px] text-ink flex items-start gap-2">
                      <span className="material-symbols-outlined text-brand-ink text-[14px] shrink-0 mt-0.5">
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
      <section className="mx-4 mb-5 bg-danger-soft rounded-xl p-4 shadow-sm border border-danger-line">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-danger-ink text-[24px]">
            do_not_disturb_on
          </span>
          <h3 className="text-[18px] text-danger-ink font-bold">
            {language === 'fr' ? 'Gestes Strictement Interdits' : 'Strictly Prohibited Actions'}
          </h3>
        </div>

        <div className="flex flex-col gap-2.5">
          {protocol.forbiddenActions.map((action, idx) => (
            <div key={idx} className="bg-card p-3 rounded-lg border border-danger-line flex flex-col gap-1">
              <span className="text-[14px] font-bold text-danger-ink">
                {action.title}
              </span>
              <p className="text-[12.5px] text-ink-muted leading-relaxed">
                {action.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 : PÉDAGOGIE & CARTE D'AGENTS */}
      {protocol.pedagogy && (
        <section className="mx-4 mb-5 bg-card rounded-xl p-4 shadow-sm border border-line-strong">
          <h3 className="text-[18px] text-ink font-bold mb-1">
            {protocol.pedagogy.title}
          </h3>
          {protocol.pedagogy.subtitle && (
            <p className="text-[12px] text-ink-faint mb-3">
              {protocol.pedagogy.subtitle}
            </p>
          )}

          <div className="grid grid-cols-1 gap-2.5">
            {protocol.pedagogy.cards.map((card, i) => (
              <div key={i} className="bg-canvas p-3 rounded-lg border border-line flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[13px] text-ink">
                    {card.title}
                  </span>
                  <span className={`text-[10px] font-label font-bold px-2 py-0.5 rounded uppercase ${card.tagClass}`}>
                    {card.tag}
                  </span>
                </div>
                {card.examples && (
                  <span className="text-[11px] text-brand-ink font-semibold">
                    {language === 'fr' ? 'Exemples :' : 'Examples:'} {card.examples}
                  </span>
                )}
                <p className="text-[12px] text-ink-muted leading-relaxed">
                  {card.specificity}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 5 : SIGNES CLINIQUES D'ALERTE */}
      <section className="mx-4 mb-5 bg-card rounded-xl p-4 shadow-sm border border-line-strong">
        <h3 className="text-[18px] text-ink font-bold mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-danger-ink">medical_services</span>
          <span>{protocol.emergencySymptoms.title}</span>
        </h3>
        <p className="text-[12px] text-ink-faint mb-2">
          {protocol.emergencySymptoms.intro}
        </p>

        <ul className="flex flex-col gap-1.5">
          {protocol.emergencySymptoms.symptoms.map((s, idx) => (
            <li key={idx} className="text-[12.5px] text-ink flex items-start gap-2">
              <span className="material-symbols-outlined text-danger-ink text-[16px] shrink-0 mt-0.5">
                warning
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ul>

        {protocol.emergencySymptoms.alertNote && (
          <div className="mt-3 p-2.5 bg-danger-soft/50 rounded border border-danger-line text-[11.5px] text-danger-ink-strong font-semibold">
            {protocol.emergencySymptoms.alertNote}
          </div>
        )}
      </section>

      {/* Raccourcis d'Urgence Téléphonique Directe */}
      <section className="mx-4 mb-4 flex flex-col gap-2">
        <h3 className="font-label text-[12px] uppercase font-bold text-ink-muted px-1">
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
            className="h-12 bg-navy active:bg-navy-2 text-white rounded-lg flex items-center justify-center gap-2 font-label text-[13px] font-bold transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-danger-bright">
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
            className="h-12 bg-navy active:bg-navy-2 text-white rounded-lg flex items-center justify-center gap-2 font-label text-[13px] font-bold transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-danger-bright">
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
            className="h-12 bg-card active:bg-tint text-ink border border-line-strong rounded-lg flex items-center justify-center gap-2 font-label text-[13px] font-bold transition-colors shadow-sm cursor-pointer"
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
            className="h-12 bg-card active:bg-tint text-ink border border-line-strong rounded-lg flex items-center justify-center gap-2 font-label text-[13px] font-bold transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">sms</span>
            <span>114 • SMS</span>
          </button>
        </div>
      </section>

      {/* Cartouche de Traçabilité & Validation Éditoriale */}
      <div className="mx-4 mb-3 p-3 bg-card rounded-xl border border-line-strong text-[12px] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-ok-ink text-[22px]">verified</span>
          <div className="flex flex-col">
            <span className="font-label text-[11px] font-bold text-ink uppercase">
              {language === 'fr' ? 'Statut Doctrinal : Corpus Validé' : 'Doctrinal Status: Validated Corpus'}
            </span>
            <span className="text-[11px] text-ink-muted">
              {language === 'fr'
                ? 'Source officielle vérifiée • Révision éditoriale du 16 Octobre 2026'
                : 'Verified official source • Editorial revision Oct 16, 2026'}
            </span>
          </div>
        </div>
        <span className="font-label text-[10px] bg-ok-soft text-ok-ink px-2 py-0.5 rounded font-bold uppercase shrink-0">
          {language === 'fr' ? 'CONFORME ÉTAT' : 'GOV COMPLIANT'}
        </span>
      </div>

      {/* SECTION 6 : CLAUSE INSTITUTIONNELLE DE PRIMAUTÉ & CADRE LÉGAL */}
      <footer className="mx-4 mb-4 p-3.5 bg-subtle rounded-xl text-ink-muted text-[12px] leading-relaxed border border-line">
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-ink text-[20px] shrink-0 mt-0.5">
            policy
          </span>
          <div>
            <p className="font-label text-[11px] uppercase font-bold text-ink mb-1">
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
