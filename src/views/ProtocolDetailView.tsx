import React, { useState } from 'react';
import { ProtocolData } from '../data/protocols';
import { EmergencyCall } from '../types';
import { playRNASiren, stopSiren } from '../utils/sirenAudio';

interface ProtocolDetailViewProps {
  protocol: ProtocolData;
  onBack: () => void;
  onOpenCallModal: (call: EmergencyCall) => void;
}

export const ProtocolDetailView: React.FC<ProtocolDetailViewProps> = ({
  protocol,
  onBack,
  onOpenCallModal,
}) => {
  const [activePhase, setActivePhase] = useState<'avant' | 'pendant' | 'apres'>('pendant');
  const [sirenActive, setSirenActive] = useState(false);

  const toggleSirenAudio = () => {
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
            className="h-12 px-3 bg-[#dce9fd] hover:bg-[#d6e4f8] active:bg-[#cedbef] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold rounded flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>HUB D'URGENCE</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrintProtocol}
              type="button"
              title="Imprimer cette fiche réflexe pour le classeur d'urgence"
              className="h-12 w-12 bg-white border border-[#c4c6ce] hover:bg-[#e4efff] text-[#001126] rounded flex items-center justify-center transition-colors shadow-sm"
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
          <span className="text-[#98f6c5] text-[11px] font-['Space_Grotesk'] font-bold">100% DISPO</span>
        </div>

        {/* Bouton de test audio de sirène intégrée */}
        <button
          onClick={toggleSirenAudio}
          type="button"
          className={`h-11 px-3 rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center justify-between transition-all border ${
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
                ? "Arrêter la sirène d'alerte RNA"
                : "Écouter le signal sonore national d'alerte (1 min 41s)"}
            </span>
          </div>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
            {sirenActive ? 'LECTURE' : 'TEST HORS-LIGNE'}
          </span>
        </button>
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
              Séquençage Opérationnel
            </h3>
          </div>
          <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] font-semibold">
            3 PHASES D'ACTION
          </span>
        </div>

        {/* Sélecteur d'onglets (Boutons 48px minimum) */}
        <div className="grid grid-cols-3 gap-1 bg-[#e4efff] p-1 rounded-lg mb-4" role="tablist">
          <button
            onClick={() => setActivePhase('avant')}
            role="tab"
            aria-selected={activePhase === 'avant'}
            className={`h-12 rounded font-['Space_Grotesk'] text-[12px] font-bold transition-all flex items-center justify-center ${
              activePhase === 'avant'
                ? 'bg-[#001126] text-white shadow-sm'
                : 'text-[#44474d] hover:text-[#001126]'
            }`}
          >
            1. AVANT
          </button>
          <button
            onClick={() => setActivePhase('pendant')}
            role="tab"
            aria-selected={activePhase === 'pendant'}
            className={`h-12 rounded font-['Space_Grotesk'] text-[12px] font-bold transition-all flex items-center justify-center ${
              activePhase === 'pendant'
                ? 'bg-[#001126] text-white shadow-sm'
                : 'text-[#44474d] hover:text-[#001126]'
            }`}
          >
            2. PENDANT
          </button>
          <button
            onClick={() => setActivePhase('apres')}
            role="tab"
            aria-selected={activePhase === 'apres'}
            className={`h-12 rounded font-['Space_Grotesk'] text-[12px] font-bold transition-all flex items-center justify-center ${
              activePhase === 'apres'
                ? 'bg-[#001126] text-white shadow-sm'
                : 'text-[#44474d] hover:text-[#001126]'
            }`}
          >
            3. APRÈS
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
                {step.title}
              </h4>
              {step.desc && (
                <p className="text-[13px] text-[#0f1c2b] leading-relaxed">{step.desc}</p>
              )}
              {step.items && (
                <ul className="text-[13px] text-[#0f1c2b] space-y-1.5 list-disc list-inside">
                  {step.items.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              )}
              {step.tip && (
                <div className={`mt-2 p-2 bg-white rounded flex items-center gap-2 border border-[#c4c6ce] ${step.tipColor || 'text-[#44474d]'}`}>
                  <span className="material-symbols-outlined text-[18px] text-[#0036ce]">
                    {step.tipIcon || 'info'}
                  </span>
                  <span className="text-[12px] font-medium leading-snug">{step.tip}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 : À NE JAMAIS FAIRE • DANGERS MORTELS */}
      <section className="mx-4 mb-5 bg-[#ffdad6] text-[#93000a] rounded-xl p-4 shadow-sm border border-[#ffb4ab]">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[#ba1a1a] text-[24px]">dangerous</span>
          <h3 className="text-[18px] text-[#ba1a1a] font-bold uppercase tracking-tight">
            À NE JAMAIS FAIRE • DANGERS MORTELS
          </h3>
        </div>

        <div className="flex flex-col gap-2.5">
          {protocol.forbiddenActions.map((action, i) => (
            <div
              key={i}
              className="bg-white p-3 rounded-lg flex gap-2.5 items-start border border-[#ffdad6]"
            >
              <span className="material-symbols-outlined text-[#ba1a1a] shrink-0 text-[20px] mt-0.5">
                cancel
              </span>
              <div className="text-[#0f1c2b]">
                <h4 className="font-['Space_Grotesk'] text-[13px] font-bold text-[#ba1a1a]">
                  {action.title}
                </h4>
                <p className="text-[13px] text-[#44474d] mt-0.5 leading-relaxed">
                  {action.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 : TECHNIQUE DE CALFEUTREMENT (Si disponible pour Confinement) */}
      {protocol.technicalSection && (
        <section className="mx-4 mb-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] text-[#001126] font-bold">
              {protocol.technicalSection.title}
            </h3>
            <span className="font-['Space_Grotesk'] text-[11px] bg-[#e4efff] px-2 py-0.5 rounded text-[#0036ce] font-bold">
              {protocol.technicalSection.badge}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {protocol.technicalSection.steps.map((st, i) => (
              <div
                key={i}
                className="bg-white p-3.5 rounded-xl shadow-sm flex items-start gap-3 border border-[#c4c6ce]"
              >
                <div className="w-10 h-10 rounded-lg bg-[#e4efff] text-[#001126] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">{st.icon}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="font-['Space_Grotesk'] text-[13px] font-bold text-[#001126]">
                    {st.title}
                  </h4>
                  <p className="text-[13px] text-[#44474d] mt-0.5 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 4 BIS : PÉDAGOGIE / TYPOLOGIE / TABLE IODE */}
      {protocol.pedagogy && (
        <section className="mx-4 mb-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] text-[#001126] font-bold">
              {protocol.pedagogy.title}
            </h3>
            {protocol.pedagogy.subtitle && (
              <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d]">
                {protocol.pedagogy.subtitle}
              </span>
            )}
          </div>

          {protocol.pedagogy.cards.map((card, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-['Space_Grotesk'] text-[12px] uppercase font-bold text-[#001126] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#0036ce]">
                    {card.icon}
                  </span>
                  {card.title}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-['Space_Grotesk'] font-bold ${card.tagClass}`}>
                  {card.tag}
                </span>
              </div>
              {card.examples && (
                <p className="text-[13px] text-[#0f1c2b] mb-2 italic">
                  <em>Exemples :</em> {card.examples}
                </p>
              )}
              <div className="bg-[#eef4ff] p-2.5 rounded text-[13px] text-[#44474d] leading-relaxed border border-[#d6e4f8]">
                <strong>Spécificité :</strong> {card.specificity}
              </div>
            </div>
          ))}

          {/* Table Posologie Iode (si applicable) */}
          {protocol.pedagogy.table && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce]">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-[#001126] font-bold">
                  <span className="material-symbols-outlined text-[#0036ce] text-[20px]">
                    vaccines
                  </span>
                  <h4 className="font-['Space_Grotesk'] text-[13px] uppercase">
                    {protocol.pedagogy.table.title}
                  </h4>
                </div>
                <span className="font-['Space_Grotesk'] text-[11px] bg-[#e4efff] px-2 py-0.5 rounded text-[#44474d]">
                  {protocol.pedagogy.table.authority}
                </span>
              </div>
              <p className="text-[12px] text-[#44474d] mb-3">
                {protocol.pedagogy.table.desc}
              </p>

              <div className="flex flex-col gap-1.5">
                {protocol.pedagogy.table.rows.map((row, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-[13px] ${
                      row.isWarning
                        ? 'bg-[#dce9fd] text-[#ba1a1a] font-bold'
                        : 'bg-[#eef4ff] text-[#001126]'
                    }`}
                  >
                    <span>{row.label}</span>
                    <span className="font-['Space_Grotesk'] font-bold">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
              {protocol.pedagogy.table.footnote && (
                <p className="text-[11px] text-[#44474d] italic mt-2">
                  {protocol.pedagogy.table.footnote}
                </p>
              )}
            </div>
          )}

          {/* Protocoles de désinfection domestique (si applicable) */}
          {protocol.pedagogy.disinfection && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce]">
              <div className="flex items-center gap-1.5 mb-2 text-[#002c1b] font-['Space_Grotesk'] text-[12px] font-bold uppercase">
                <span className="material-symbols-outlined text-[18px] text-[#3f9d73]">
                  sanitizer
                </span>
                {protocol.pedagogy.disinfection.title}
              </div>
              <div className="grid grid-cols-1 gap-2 text-[13px]">
                {protocol.pedagogy.disinfection.items.map((it, i) => (
                  <div
                    key={i}
                    className="p-2 bg-[#eef4ff] rounded flex items-center justify-between border border-[#d6e4f8]"
                  >
                    <span>{it.name}</span>
                    <span className="font-['Space_Grotesk'] text-[11px] font-bold text-[#001126]">
                      {it.condition}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* SECTION 5 : SIGNES D'URGENCE & PAVÉ D'APPEL DIRECT */}
      <section className="mx-4 mb-5 bg-[#dce9fd] rounded-xl p-4 shadow-sm border border-[#c4c6ce]">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-[#ba1a1a] text-[22px]">emergency</span>
          <h3 className="text-[18px] text-[#001126] font-bold">
            {protocol.emergencySymptoms.title}
          </h3>
        </div>
        <p className="text-[13px] text-[#0f1c2b] mb-3 leading-relaxed">
          {protocol.emergencySymptoms.intro}
        </p>

        {/* Puces critères médicaux */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-[13px] text-[#0f1c2b]">
          {protocol.emergencySymptoms.symptoms.map((symp, i) => (
            <div
              key={i}
              className="bg-white p-2 rounded-lg flex items-center gap-1.5 border border-[#c4c6ce]"
            >
              <span className="material-symbols-outlined text-[#ba1a1a] text-[16px] shrink-0">
                priority_high
              </span>
              <span className="leading-snug">{symp}</span>
            </div>
          ))}
        </div>

        {/* Pavé de boutons d'appel direct */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() =>
              onOpenCallModal({
                number: '15',
                name: 'SAMU - Urgences Médicales',
                subtitle: '15 • SAMU',
                desc: 'Appel d\'urgence vitale pour régulation médicale immédiate.',
              })
            }
            type="button"
            className="h-12 bg-[#001126] active:bg-[#12263f] text-white rounded-lg flex items-center justify-center gap-2 font-['Space_Grotesk'] text-[13px] font-bold transition-colors shadow-sm"
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
                desc: 'Secours incendie, toxiques et risques imminents.',
              })
            }
            type="button"
            className="h-12 bg-[#001126] active:bg-[#12263f] text-white rounded-lg flex items-center justify-center gap-2 font-['Space_Grotesk'] text-[13px] font-bold transition-colors shadow-sm"
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
                desc: "Numéro universel d'urgence européen.",
              })
            }
            type="button"
            className="h-12 bg-white active:bg-[#e4efff] text-[#001126] border border-[#c4c6ce] rounded-lg flex items-center justify-center gap-2 font-['Space_Grotesk'] text-[13px] font-bold transition-colors shadow-sm"
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
                desc: 'Contact silencieux par SMS.',
              })
            }
            type="button"
            className="h-12 bg-white active:bg-[#e4efff] text-[#001126] border border-[#c4c6ce] rounded-lg flex items-center justify-center gap-2 font-['Space_Grotesk'] text-[13px] font-bold transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">sms</span>
            <span>114 • SMS SOURDS</span>
          </button>
        </div>
      </section>

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
