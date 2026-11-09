import React, { useState, useEffect } from 'react';
import { SubScreen, EmergencyCall } from '../types';
import { Tooltip } from '../components/Tooltip';
import { triggerHaptic } from '../utils/haptics';
import { EmergencyCoherenceMatrixModal } from '../components/EmergencyCoherenceMatrixModal';
import { EmergencyReflexModal } from '../components/EmergencyReflexModal';

interface ReagirViewProps {
  onOpenSubScreen: (screen: SubScreen) => void;
  onOpenCallModal: (call: EmergencyCall) => void;
  onGoToGuides: () => void;
}

export const ReagirView: React.FC<ReagirViewProps> = ({
  onOpenSubScreen,
  onOpenCallModal,
  onGoToGuides,
}) => {
  const [selectedRisk, setSelectedRisk] = useState<{
    code: 'N' | 'R' | 'B' | 'C';
    name: string;
    desc: string;
    protocolKey: 'nucleaire' | 'radiologique' | 'bio' | 'chimique';
  } | null>({
    code: 'C',
    name: 'Chimique',
    desc: 'Fuite toxique industrielle Seveso / TMD. Attention : aucune direction de fuite ni pièce n\'est universellement sûre. Mise à l\'abri immédiate et écoute stricte des ordres préfectoraux.',
    protocolKey: 'chimique',
  });

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isStressMode, setIsStressMode] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showCoherenceModal, setShowCoherenceModal] = useState<boolean>(false);
  const [showReflexModal, setShowReflexModal] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleExpand = (id: string) => {
    triggerHaptic('light');
    setExpandedSection(expandedSection === id ? null : id);
  };

  const toggleStressMode = () => {
    triggerHaptic('warning');
    setIsStressMode((prev) => !prev);
  };

  const toggleSpeechSynthesis = (textToRead: string) => {
    triggerHaptic('medium');
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectRiskCode = (code: 'N' | 'R' | 'B' | 'C') => {
    triggerHaptic('light');
    switch (code) {
      case 'N':
        setSelectedRisk({
          code: 'N',
          name: 'Nucléaire',
          desc: "Accident de réacteur civil ou panache de retombées radioactives. Murs en béton épais (sous-sol protecteur contre les rayons gamma). Calfeutrage et coupure VMC. ZÉRO automédication : iode UNIQUEMENT sur ordre formel du Préfet !",
          protocolKey: 'nucleaire',
        });
        break;
      case 'R':
        setSelectedRisk({
          code: 'R',
          name: 'Radiologique',
          desc: "Sources orphelines, dispersion radiologique (bombe sale), irradiation externe vs contamination. Règle ALARA : Temps minimum, Distance maximale (dose divisée par 4 si distance doublée), Écran dense. Déshabillage sans secouer et douche tiède sans frotter la peau. ATTENTION : comprimés d'iode STRICTEMENT INUTILES dans ce cas !",
          protocolKey: 'radiologique',
        });
        break;
      case 'B':
        setSelectedRisk({
          code: 'B',
          name: 'Biologique',
          desc: "Agents pathogènes viraux/bactériens ou toxines. Masque FFP3 hermétique ajusté, isolement physique, arrêt des VMC collectives et décontamination au savon/chlore actif.",
          protocolKey: 'bio',
        });
        break;
      case 'C':
        setSelectedRisk({
          code: 'C',
          name: 'Chimique',
          desc: "Fuite toxique industrielle Seveso / TMD. Attention : aucune direction de fuite ni emplacement n'est universellement sûr. Les actions dépendent du produit (gaz lourd vs léger), de la météo et impérativement des consignes officielles. Aucun comprimé d'iode !",
          protocolKey: 'chimique',
        });
        break;
    }
  };

  const getEmergencySpeechText = (): string => {
    if (!selectedRisk) {
      return "Consignes d'urgence vitale : Rejoignez immédiatement un bâtiment en dur clos. Fermez toutes les portes et fenêtres. Coupez la ventilation. Écoutez la radio locale France Bleu ou les notifications FR-Alert. Ne téléphonez qu'en cas d'urgence absolue pour laisser le réseau aux secours.";
    }
    return `Alerte risque ${selectedRisk.name}. ${selectedRisk.desc} Règle vitale : Rejoignez un local clos en dur, calfeutrez les accès, coupez la VMC. Écoutez France Bleu et suivez scrupuleusement les consignes de la préfecture.`;
  };

  return (
    <div className={`flex flex-col w-full px-4 sm:px-6 pt-20 lg:pt-24 pb-28 lg:pb-12 gap-4 max-w-xl lg:max-w-5xl mx-auto transition-colors duration-200 ${
      isStressMode ? 'bg-black text-white min-h-screen' : ''
    }`}>
      {/* Barre de contrôle Stress & Accessibilité 1-Tap */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={toggleStressMode}
          type="button"
          className={`min-h-[48px] px-3.5 rounded-xl font-label text-[12px] font-bold uppercase flex items-center gap-2 border transition-all ${
            isStressMode
              ? 'bg-warn text-black border-warn-ink shadow-lg ring-2 ring-white'
              : 'bg-card hover:bg-subtle text-ink border-line-strong'
          }`}
          title="Bascule vers le mode lisibilité maximale pour doigts tremblants ou situation de stress"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isStressMode ? 'contrast' : 'tonality'}
          </span>
          <span>{isStressMode ? 'Mode Normal' : 'Mode Lisibilité Extrême'}</span>
        </button>

        <button
          onClick={() => toggleSpeechSynthesis(getEmergencySpeechText())}
          type="button"
          className={`min-h-[48px] px-3.5 rounded-xl font-label text-[12px] font-bold uppercase flex items-center gap-2 border transition-all ${
            isSpeaking
              ? 'bg-danger text-white border-danger-ink animate-pulse shadow-lg'
              : isStressMode
              ? 'bg-[#1e293b] text-white border-white'
              : 'bg-subtle hover:bg-tint text-ink border-line'
          }`}
          title="Écouter la synthèse vocale des consignes vitales"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isSpeaking ? 'stop_circle' : 'volume_up'}
          </span>
          <span>{isSpeaking ? 'Arrêter Voix' : 'Écouter Consignes'}</span>
        </button>
      </div>

      {/* Bannière de fraîcheur doctrinale et connectivité proéminente */}
      <aside className={`w-full rounded-xl p-3 flex flex-col gap-2 shadow-sm border ${
        isStressMode ? 'bg-[#18181b] border-white text-white' : 'bg-subtle border-line text-ink'
      }`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isOnline ? 'bg-ok animate-pulse' : 'bg-danger'}`}></span>
            <span className="font-label text-[11px] tracking-wider uppercase font-bold truncate">
              {isOnline ? 'Réseau Détecté • Données Officielles Directes' : 'Mode Hors-Ligne • Corpus Embarqué 100%'}
            </span>
          </div>
          <span className={`font-label text-[10px] px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
            isStressMode ? 'bg-card text-black' : 'bg-navy text-white'
          }`}>
            V2.4.1 SEC
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-current/15">
          <span className="opacity-80">Corpus de sécurité civile révisé :</span>
          <span className="font-bold">18 Octobre 2026</span>
        </div>
      </aside>

      {/* Raccourci d'Urgence Immédiate 1-Tap : Que faire maintenant ? + Mode Crise */}
      <div data-tour="reagir-triage" className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('warning');
            setShowReflexModal(true);
          }}
          className="w-full min-h-[50px] px-4 bg-danger hover:bg-danger-strong text-white rounded-xl font-label text-[13px] font-black uppercase tracking-wider flex items-center justify-between shadow-lg border-2 border-white/20 active:scale-98 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-amber-300 animate-pulse">
              bolt
            </span>
            <span className="text-left font-black">
              QUE FAIRE MAINTENANT ? (Triage 0-60s)
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-200">
            <span>FR • CH • BE • LU</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </div>
        </button>

        {/* Raccourci Proéminent Mode Crise Gros Boutons & Carte Hors-Ligne */}
        <section className="w-full bg-danger-soft text-danger-ink-strong rounded-xl p-3.5 border-2 border-danger-ink flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-danger text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]" aria-hidden="true">crisis_alert</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label text-[13px] font-black uppercase text-danger-ink-strong leading-tight">
                Mode Crise Simplifié
              </span>
              <span className="text-[11px] text-danger-ink-strong/90 font-medium">
                4 actions réflexes grand format (Confiner / Évacuer / Décontaminer / Appeler)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 min-[480px]:grid-cols-[1fr_auto_auto] gap-2 w-full lg:w-auto shrink-0">
            <button
              type="button"
              onClick={() => onOpenSubScreen({ type: 'mode-crise' })}
              className="col-span-2 min-[480px]:col-span-1 min-h-[44px] px-3.5 bg-danger hover:bg-danger-strong text-white rounded-xl font-label text-[12px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <span>Ouvrir l'écran réflexe</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setShowCoherenceModal(true);
              }}
              title="Matrice de Cohérence Opérationnelle (6 Scénarios Critiques)"
              className="min-h-[44px] px-3 bg-red-800 hover:bg-red-700 text-white rounded-xl font-label text-[11px] font-bold uppercase flex items-center justify-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">fact_check</span>
              <span>6 Scénarios P1</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenSubScreen({ type: 'carte-perimetres' })}
              title="Carte & Radar PPI Hors-Ligne"
              className="min-h-[44px] px-3 bg-navy hover:bg-navy-2 text-ok-bright rounded-xl font-label text-[11px] font-bold uppercase flex items-center justify-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">radar</span>
              <span>Radar PPI</span>
            </button>
          </div>
        </section>
      </div>

      {/* 1. Avertissement permanent supérieur encadré haute lisibilité */}
      <section
        role="alert"
        className="w-full bg-tint rounded-xl p-4 shadow-sm border border-brand-bright"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-strong text-white flex items-center justify-center flex-shrink-0">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="font-label text-[12px] uppercase tracking-wider text-brand-ink font-bold">
                Notice Impérative
              </span>
              <span className="font-label text-[10px] text-brand-ink bg-white/80 px-1.5 py-0.5 rounded font-bold">
                AUTONOMIE LOCALE
              </span>
            </div>
            <p className="text-[14px] text-brand-ink font-semibold leading-snug">
              En cas de danger immédiat, suivez les ordres des autorités et contactez les secours. Cette application ne reçoit pas les alertes officielles.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Raccourcis d'appel d'urgence sécurisés */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-label text-[13px] uppercase tracking-wider text-ink font-bold flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-danger-ink text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              call
            </span>
            Appels d'urgence sécurisés
          </h2>
          <span className="font-label text-[11px] text-ink-muted font-medium">
            Double validation tactile
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {/* 15 SAMU */}
          <button
            onClick={() =>
              onOpenCallModal({
                number: '15',
                name: 'SAMU - Urgences Médicales Graves',
                subtitle: 'Urgence médicale',
                desc: 'Affections aiguës, intoxications respiratoires ou défaillances vitales.',
              })
            }
            type="button"
            className="w-full min-h-[56px] p-2.5 bg-card rounded-xl shadow-sm hover:bg-subtle active:scale-[0.98] transition-transform flex items-center gap-2.5 text-left border border-line-strong"
          >
            <div className="w-10 h-10 rounded-lg bg-subtle flex items-center justify-center flex-shrink-0">
              <span className="font-label text-[18px] text-ink font-bold">15</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label text-[12px] text-ink uppercase font-bold truncate">
                SAMU
              </span>
              <span className="text-[11px] text-ink-muted truncate">Urgence médicale</span>
            </div>
          </button>

          {/* 18 Pompiers */}
          <button
            onClick={() =>
              onOpenCallModal({
                number: '18',
                name: 'Sapeurs-Pompiers',
                subtitle: 'Secours & Périls',
                desc: "Secours d'incendie, fuites toxiques industrielles, accidents et périls imminents.",
              })
            }
            type="button"
            className="w-full min-h-[56px] p-2.5 bg-card rounded-xl shadow-sm hover:bg-subtle active:scale-[0.98] transition-transform flex items-center gap-2.5 text-left border border-line-strong"
          >
            <div className="w-10 h-10 rounded-lg bg-danger-soft flex items-center justify-center flex-shrink-0">
              <span className="font-label text-[18px] text-danger-ink-strong font-bold">18</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label text-[12px] text-ink uppercase font-bold truncate">
                Pompiers
              </span>
              <span className="text-[11px] text-ink-muted truncate">Secours & Périls</span>
            </div>
          </button>

          {/* 112 Europe */}
          <button
            onClick={() =>
              onOpenCallModal({
                number: '112',
                name: "112 - Numéro d'Urgence Européen",
                subtitle: 'Sans réseau op.',
                desc: 'Accessible depuis tout mobile en Europe, y compris sans carte SIM déverrouillée.',
              })
            }
            type="button"
            className="w-full min-h-[56px] p-2.5 bg-card rounded-xl shadow-sm hover:bg-subtle active:scale-[0.98] transition-transform flex items-center gap-2.5 text-left border border-line-strong"
          >
            <div className="w-10 h-10 rounded-lg bg-tint flex items-center justify-center flex-shrink-0">
              <span className="font-label text-[18px] text-[#061c35] font-bold">112</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label text-[12px] text-ink uppercase font-bold truncate">
                112 Europe
              </span>
              <span className="text-[11px] text-ink-muted truncate">Sans réseau op.</span>
            </div>
          </button>

          {/* 114 SMS Sourds/Malentendants */}
          <button
            onClick={() =>
              onOpenCallModal({
                number: '114',
                name: '114 - Urgences Sourds & Malentendants',
                subtitle: 'Texte silencieux',
                desc: 'Contact SMS silencieux dédié aux personnes sourdes ou en situation de discrétion absolue.',
              })
            }
            type="button"
            className="w-full min-h-[56px] p-2.5 bg-card rounded-xl shadow-sm hover:bg-subtle active:scale-[0.98] transition-transform flex items-center gap-2.5 text-left border border-line-strong"
          >
            <div className="w-10 h-10 rounded-lg bg-tint flex items-center justify-center flex-shrink-0">
              <span className="font-label text-[18px] text-ink font-bold">114</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label text-[12px] text-ink uppercase font-bold truncate">
                114 SMS
              </span>
              <span className="text-[11px] text-ink-muted truncate">Texte silencieux</span>
            </div>
          </button>
        </div>

        {/* Centre Antipoison Pleine Largeur */}
        <button
          onClick={() =>
            onOpenCallModal({
              number: '01 40 05 48 48',
              name: 'Centre National Antipoison',
              subtitle: 'Assistance toxicologique 24h/24',
              desc: "Ligne médicale d'urgence pour expositions toxiques, inhalations chimiques et ingestions de substances suspectes.",
            })
          }
          type="button"
          className="w-full min-h-[52px] p-3 bg-subtle rounded-xl shadow-sm hover:bg-tint active:scale-[0.99] transition-transform flex items-center justify-between gap-3 border border-line"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-card flex items-center justify-center flex-shrink-0 border border-line-strong">
              <span
                className="material-symbols-outlined text-ink text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                science
              </span>
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="font-label text-[12px] text-ink uppercase font-bold truncate">
                Centre Antipoison Régional
              </span>
              <span className="text-[11px] text-ink-muted truncate">
                Assistance toxicologique 24h/24
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-card px-2 py-1 rounded-lg border border-line-strong flex-shrink-0">
            <span className="material-symbols-outlined text-ink text-[16px]">touch_app</span>
            <span className="font-label text-[11px] text-ink font-bold">
              Appui sécurisé
            </span>
          </div>
        </button>
      </section>

      {/* 3. Les 4 parcours réflexes guidés */}
      <section className="grid grid-cols-1 lg:grid-cols-2 lg:items-start gap-3">
        <div className="flex items-baseline justify-between px-1 lg:col-span-2">
          <h2 className="text-[18px] text-ink font-bold tracking-tight">
            4 Parcours Réflexes Immédiats
          </h2>
          <span className="font-label text-[11px] text-ink-muted font-medium">
            Priorité 0 à 15 min
          </span>
        </div>

        {/* Reflexe 1: Danger immédiat */}
        <article className="w-full bg-card rounded-xl p-4 shadow-sm flex flex-col gap-3 relative border border-line-strong">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-danger text-white flex items-center justify-center font-label text-[16px] font-bold flex-shrink-0">
                1
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label text-[11px] text-danger-ink uppercase font-bold tracking-wider">
                  Action Physique Urgente
                </span>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[16px] text-ink font-bold leading-tight truncate">
                    Je suis face à un danger immédiat
                  </h3>
                  <Tooltip
                    title="Pourquoi se confiner ?"
                    content="Un bâtiment en dur calfeutré réduit de plus de 90% l'inhalation d'aérosols toxiques ou de particules radioactives par rapport à l'extérieur."
                  />
                </div>
              </div>
            </div>
            <span className="font-label text-[11px] px-2 py-0.5 rounded bg-danger-soft text-danger-ink-strong font-bold flex-shrink-0">
              CRITIQUE
            </span>
          </div>

          <p className="text-[14px] text-ink font-medium leading-relaxed">
            Consigne immédiate de mise à l’abri : rejoignez au plus vite un bâtiment en dur clos et calfeutrez tous les accès. Ne cherchez pas à fuir au hasard en voiture : appliquez strictement les ordres diffusés par les autorités.
          </p>

          <div className="grid grid-cols-3 gap-1.5 pt-0.5">
            <div className="bg-subtle p-2 rounded-lg flex flex-col items-center text-center border border-line">
              <span className="material-symbols-outlined text-ink text-[20px] mb-0.5">campaign</span>
              <span className="font-label text-[11px] text-ink font-semibold">
                Ordres d'État
              </span>
            </div>
            <div className="bg-subtle p-2 rounded-lg flex flex-col items-center text-center border border-line">
              <span className="material-symbols-outlined text-ink text-[20px] mb-0.5">
                apartment
              </span>
              <span className="font-label text-[11px] text-ink font-semibold">
                Bâtiment dur
              </span>
            </div>
            <div className="bg-subtle p-2 rounded-lg flex flex-col items-center text-center border border-line">
              <span className="material-symbols-outlined text-ink text-[20px] mb-0.5">close</span>
              <span className="font-label text-[11px] text-ink font-semibold">
                Calfeutrer sas
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onOpenSubScreen({ type: 'confinement-guide' })}
              type="button"
              className="min-h-[48px] flex-1 bg-navy hover:bg-navy-2 text-white rounded-lg font-label text-[12px] uppercase font-bold flex items-center justify-center gap-2 active:opacity-90 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">meeting_room</span>
              <span>Guide Confinement Étanche</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button
              onClick={() => onOpenSubScreen({ type: 'protocol', id: 'confinement' })}
              type="button"
              className="min-h-[48px] px-3 bg-tint hover:bg-tint text-ink rounded-lg font-label text-[12px] uppercase font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Fiche Réflexe</span>
            </button>
          </div>
        </article>

        {/* Reflexe 2: Alerte officielle reçue */}
        <article className="w-full bg-card rounded-xl p-4 shadow-sm flex flex-col gap-3 relative border border-line-strong">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center font-label text-[16px] font-bold flex-shrink-0">
                2
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label text-[11px] text-brand-ink uppercase font-bold tracking-wider">
                  Ordre Préfectoral
                </span>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[16px] text-ink font-bold leading-tight truncate">
                    Une alerte officielle a été reçue
                  </h3>
                  <Tooltip
                    title="Laissez les lignes libres"
                    content="Ne saturez pas les réseaux mobiles. Les secours (15, 18, 112) ont besoin de la bande passante. Informez-vous par la radio publique."
                  />
                </div>
              </div>
            </div>
            <span className="font-label text-[11px] px-2 py-0.5 rounded bg-tint text-brand-ink font-bold flex-shrink-0">
              FR-ALERT
            </span>
          </div>

          <p className="text-[14px] text-ink font-medium leading-relaxed">
            Consignes de confinement immédiat : allumez France Bleu ou la radio locale. Ne vous déplacez sous aucun prétexte. Ne pas aller chercher les enfants à l'école.
          </p>

          <div className="bg-subtle p-3 rounded-lg flex items-center gap-2.5 border border-line">
            <span
              className="material-symbols-outlined text-brand-ink text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              child_care
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-label text-[12px] text-ink font-bold">
                Écoles sécurisées
              </span>
              <span className="text-[12px] text-ink-muted leading-snug">
                Les équipes scolaires appliquent le PPMS pour protéger vos enfants.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onOpenSubScreen({ type: 'siren-guide' })}
              type="button"
              className="min-h-[48px] flex-1 bg-brand hover:bg-[#0028a3] text-white rounded-lg font-label text-[12px] uppercase font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">campaign</span>
              <span>Reconnaître le Signal d'Alerte RNA</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button
              onClick={() => toggleExpand('r2')}
              type="button"
              className="min-h-[48px] px-3 bg-tint hover:bg-tint text-ink rounded-lg font-label text-[12px] uppercase font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">radio</span>
              <span>Fréquences</span>
            </button>
          </div>

          {expandedSection === 'r2' && (
            <div className="bg-canvas p-3 rounded-lg flex flex-col gap-1.5 text-[13px] text-ink border border-line-strong">
              <p className="font-bold text-ink">Consignes prioritaires reçues :</p>
              <p>• Gardez la ligne téléphonique libre pour les services de secours.</p>
              <p>• Écoutez France Bleu (FM ou grandes ondes) ou France Inter pour les bulletins certifiés.</p>
              <p>• Tout déplacement extérieur non ordonné compromet la chaîne d'intervention.</p>
            </div>
          )}
        </article>

        {/* Reflexe 3: Suspicion contamination */}
        <article className="w-full bg-card rounded-xl p-4 shadow-sm flex flex-col gap-3 relative border border-line-strong">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-ok-deep text-white flex items-center justify-center font-label text-[16px] font-bold flex-shrink-0">
                3
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label text-[11px] text-ok-ink uppercase font-bold tracking-wider">
                  Décontamination
                </span>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[16px] text-ink font-bold leading-tight truncate">
                    Je suspecte une contamination
                  </h3>
                  <Tooltip
                    title="80% à 90% d'efficacité"
                    content="Retirer avec précaution les couches externes de vêtements élimine la quasi-totalité des contaminants déposés en surface."
                  />
                </div>
              </div>
            </div>
            <span className="font-label text-[11px] px-2 py-0.5 rounded bg-ok-soft text-ok-ink font-bold flex-shrink-0">
              HYGIÈNE
            </span>
          </div>

          <p className="text-[14px] text-ink font-medium leading-relaxed">
            Procédure d'urgence en zone tampon : déshabillage méthodique de la tête aux pieds, rinçage abondant à l'eau claire sans frotter, ensachage hermétique immédiat des vêtements.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-subtle p-2.5 rounded-lg flex items-center gap-2 border border-line">
              <span className="material-symbols-outlined text-ink text-[20px]">water_drop</span>
              <span className="font-label text-[12px] text-ink font-semibold">
                Rincer sans frotter
              </span>
            </div>
            <div className="bg-subtle p-2.5 rounded-lg flex items-center gap-2 border border-line">
              <span className="material-symbols-outlined text-ink text-[20px]">shopping_bag</span>
              <span className="font-label text-[12px] text-ink font-semibold">
                Double ensachage
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onOpenSubScreen({ type: 'deshabillage' })}
              type="button"
              className="min-h-[48px] flex-1 bg-ok-deep hover:bg-ok text-ok-bright rounded-lg font-label text-[12px] uppercase font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">sanitizer</span>
              <span>Guide Déshabillage Pas-à-Pas (8 étapes)</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button
              onClick={() => toggleExpand('r3')}
              type="button"
              className="min-h-[48px] px-3 bg-tint hover:bg-tint text-ink rounded-lg font-label text-[12px] uppercase font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Aperçu rapide</span>
              <span className="material-symbols-outlined text-[18px]">unfold_more</span>
            </button>
          </div>

          {expandedSection === 'r3' && (
            <div className="bg-canvas p-3 rounded-lg flex flex-col gap-1.5 text-[13px] text-ink border border-line-strong">
              <p className="font-bold text-ink">Déshabillage sans dispersion :</p>
              <p>1. Déchaussez et retirez vêtements par retournement externe (enroulez sur l'envers).</p>
              <p>2. Isolez les vêtements dans un sac plastique épais fermé hermétiquement.</p>
              <p>3. Rincez le visage et les mains à l'eau tiède sans savon abrasif pendant 15 minutes.</p>
              <button
                onClick={() => onOpenSubScreen({ type: 'deshabillage' })}
                type="button"
                className="mt-1 text-brand-ink font-bold text-[12px] text-left underline flex items-center gap-1"
              >
                <span>Accéder au protocole interactif complet avec minuteur de rinçage</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          )}
        </article>

        {/* Reflexe 4: Classification NRBC */}
        <article className="w-full bg-card rounded-xl p-4 shadow-sm flex flex-col gap-3 relative border border-line-strong">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-tint text-ink flex items-center justify-center font-label text-[16px] font-bold flex-shrink-0">
                4
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label text-[11px] text-ink-muted uppercase font-bold tracking-wider">
                  Classification NRBC
                </span>
                <h3 className="text-[16px] text-ink font-bold leading-tight truncate">
                  Je cherche les consignes d'un risque précis
                </h3>
              </div>
            </div>
          </div>

          <p className="text-[14px] text-ink font-medium">
            Accès filtré selon la typologie de menace identifiée.
          </p>

          {/* Boutons sélecteurs N - R - B - C */}
          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={() => handleSelectRiskCode('N')}
              type="button"
              className={`min-h-[52px] rounded-xl flex flex-col items-center justify-center p-1 transition-all border ${
                selectedRisk?.code === 'N'
                  ? 'bg-navy text-white border-ink shadow-sm'
                  : 'bg-subtle hover:bg-tint text-ink border-line'
              }`}
            >
              <span className="font-label text-[18px] font-bold">N</span>
              <span className="font-label text-[10px] uppercase font-semibold">
                Nucléaire
              </span>
            </button>

            <button
              onClick={() => handleSelectRiskCode('R')}
              type="button"
              className={`min-h-[52px] rounded-xl flex flex-col items-center justify-center p-1 transition-all border ${
                selectedRisk?.code === 'R'
                  ? 'bg-navy text-white border-ink shadow-sm'
                  : 'bg-subtle hover:bg-tint text-ink border-line'
              }`}
            >
              <span className="font-label text-[18px] font-bold">R</span>
              <span className="font-label text-[10px] uppercase font-semibold">
                Radiolog.
              </span>
            </button>

            <button
              onClick={() => handleSelectRiskCode('B')}
              type="button"
              className={`min-h-[52px] rounded-xl flex flex-col items-center justify-center p-1 transition-all border ${
                selectedRisk?.code === 'B'
                  ? 'bg-navy text-white border-ink shadow-sm'
                  : 'bg-subtle hover:bg-tint text-ink border-line'
              }`}
            >
              <span className="font-label text-[18px] font-bold">B</span>
              <span className="font-label text-[10px] uppercase font-semibold">
                Biologique
              </span>
            </button>

            <button
              onClick={() => handleSelectRiskCode('C')}
              type="button"
              className={`min-h-[52px] rounded-xl flex flex-col items-center justify-center p-1 transition-all border ${
                selectedRisk?.code === 'C'
                  ? 'bg-navy text-white border-ink shadow-sm'
                  : 'bg-subtle hover:bg-tint text-ink border-line'
              }`}
            >
              <span className="font-label text-[18px] font-bold">C</span>
              <span className="font-label text-[10px] uppercase font-semibold">
                Chimique
              </span>
            </button>
          </div>

          {/* Panneau dynamique risque sélectionné */}
          {selectedRisk && (
            <div className="bg-subtle p-3 rounded-lg flex flex-col gap-2 border border-line">
              <div className="flex items-center justify-between">
                <span className="font-label text-[12px] uppercase font-bold text-ink">
                  RISQUE {selectedRisk.code} - {selectedRisk.name}
                </span>
                <span className="font-label text-[10px] bg-card px-2 py-0.5 rounded font-bold border border-line-strong">
                  SYNTHÈSE
                </span>
              </div>
              <p className="text-[13px] text-ink leading-snug">{selectedRisk.desc}</p>
              <button
                onClick={() =>
                  onOpenSubScreen({ type: 'protocol', id: selectedRisk.protocolKey })
                }
                type="button"
                className="min-h-[44px] w-full bg-navy hover:bg-navy-2 text-white rounded-lg font-label text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Ouvrir la fiche complète {selectedRisk.name}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          )}
        </article>
      </section>

      {/* 4. Principes d'urgence immédiate (Points clés sous stress) */}
      <section className="w-full bg-subtle rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-line">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-ink text-[22px]">checklist</span>
          <h2 className="text-[18px] text-ink font-bold">Points Clés Sous Stress</h2>
        </div>
        <p className="text-[13px] text-ink-muted">
          Règles immuables validées par la sécurité civile. Mémorisez ces quatre postures de survie :
        </p>

        <div className="flex flex-col gap-2">
          {/* Point 1 */}
          <div className="min-h-[48px] bg-card rounded-lg p-2.5 flex items-center gap-3 border border-line-strong">
            <div className="w-8 h-8 rounded-full bg-tint flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-ink text-[18px]">navigation</span>
            </div>
            <span className="text-[14px] font-semibold text-ink flex-1">
              Se confiner ou s'éloigner selon le vent
            </span>
          </div>

          {/* Point 2 */}
          <div className="min-h-[48px] bg-card rounded-lg p-2.5 flex items-center gap-3 border border-line-strong">
            <div className="w-8 h-8 rounded-full bg-tint flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-ink text-[18px]">radio</span>
            </div>
            <span className="text-[14px] font-semibold text-ink flex-1">
              Écouter la radio officielle (France Bleu, locales)
            </span>
          </div>

          {/* Point 3 */}
          <div className="min-h-[48px] bg-card rounded-lg p-2.5 flex items-center gap-3 border border-line-strong">
            <div className="w-8 h-8 rounded-full bg-tint flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-ink text-[18px]">
                phone_disabled
              </span>
            </div>
            <span className="text-[14px] font-semibold text-ink flex-1">
              Ne pas encombrer les réseaux téléphoniques
            </span>
          </div>

          {/* Point 4 */}
          <div
            onClick={() => onOpenSubScreen({ type: 'iode' })}
            role="button"
            tabIndex={0}
            className="min-h-[52px] bg-card rounded-lg p-2.5 flex items-center gap-3 border border-danger-bright bg-danger-soft/30 hover:bg-danger-soft/50 cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-danger-soft flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-danger-ink text-[18px]">
                medication
              </span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[14px] font-semibold text-ink">
                Ne pas prendre d'iode sans ordre préfectoral
              </span>
              <span className="text-[11px] text-danger-ink font-bold underline flex items-center gap-1">
                <span>Consulter la Fiche Iode Stable & Posologie</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Sortie et retour rapide au catalogue */}
      <section className="w-full pt-1 flex flex-col gap-2">
        <button
          onClick={onGoToGuides}
          type="button"
          className="w-full min-h-[52px] bg-tint hover:bg-tint text-ink rounded-xl font-label text-[13px] uppercase font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">menu_book</span>
          <span>Consulter le catalogue complet des guides</span>
        </button>

        <button
          onClick={() => onOpenSubScreen({ type: 'tracabilite' })}
          type="button"
          className="w-full py-2.5 px-3 bg-subtle hover:bg-tint border border-line rounded-xl flex items-center justify-center gap-2 text-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-ok-ink text-[18px]">verified_user</span>
          <span className="font-label text-[11px] text-ink font-bold">
            Consulter le Registre de Traçabilité & Sources Officielles (v2.4.1)
          </span>
        </button>
      </section>

      {/* Modal Matrice de Cohérence des 6 Scénarios d'Urgence P1 */}
      {showCoherenceModal && (
        <EmergencyCoherenceMatrixModal onClose={() => setShowCoherenceModal(false)} />
      )}

      {/* Modal Que faire maintenant ? (Triage Réflexe 0-60s) */}
      <EmergencyReflexModal
        isOpen={showReflexModal}
        onClose={() => setShowReflexModal(false)}
        onNavigateToProtocol={(key) => onOpenSubScreen({ type: 'protocol', id: key as any })}
      />
    </div>
  );
};
