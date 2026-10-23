import React, { useState, useEffect } from 'react';
import { SubScreen, EmergencyCall } from '../types';
import { Tooltip } from '../components/Tooltip';
import { triggerHaptic } from '../utils/haptics';

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
    <div className={`flex flex-col w-full px-4 pt-24 pb-28 gap-4 max-w-xl mx-auto transition-colors duration-200 ${
      isStressMode ? 'bg-black text-white min-h-screen' : ''
    }`}>
      {/* Barre de contrôle Stress & Accessibilité 1-Tap */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={toggleStressMode}
          type="button"
          className={`min-h-[48px] px-3.5 rounded-xl font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center gap-2 border transition-all ${
            isStressMode
              ? 'bg-[#f59e0b] text-black border-[#f59e0b] shadow-lg ring-2 ring-white'
              : 'bg-white hover:bg-[#eef4ff] text-[#001126] border-[#c4c6ce]'
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
          className={`min-h-[48px] px-3.5 rounded-xl font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center gap-2 border transition-all ${
            isSpeaking
              ? 'bg-[#dc2626] text-white border-[#dc2626] animate-pulse shadow-lg'
              : isStressMode
              ? 'bg-[#1e293b] text-white border-white'
              : 'bg-[#eef4ff] hover:bg-[#dce9fd] text-[#001126] border-[#d6e4f8]'
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
        isStressMode ? 'bg-[#18181b] border-white text-white' : 'bg-[#eef4ff] border-[#d6e4f8] text-[#001126]'
      }`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isOnline ? 'bg-[#16a34a] animate-pulse' : 'bg-[#dc2626]'}`}></span>
            <span className="font-['Space_Grotesk'] text-[11px] tracking-wider uppercase font-bold truncate">
              {isOnline ? 'Réseau Détecté • Données Officielles Directes' : 'Mode Hors-Ligne • Corpus Embarqué 100%'}
            </span>
          </div>
          <span className={`font-['Space_Grotesk'] text-[10px] px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
            isStressMode ? 'bg-white text-black' : 'bg-[#001126] text-white'
          }`}>
            V2.4.1 SEC
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-current/15">
          <span className="opacity-80">Corpus de sécurité civile révisé :</span>
          <span className="font-bold">18 Octobre 2026</span>
        </div>
      </aside>

      {/* Raccourci Proéminent Mode Crise Gros Boutons & Carte Hors-Ligne */}
      <section className="w-full bg-[#ffdad6] text-[#93000a] rounded-xl p-3.5 shadow-md border-2 border-[#ba1a1a] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-center shrink-0 animate-pulse">
            <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-['Space_Grotesk'] text-[13px] font-black uppercase text-[#93000a] leading-tight">
              Mode Crise Simplifié
            </span>
            <span className="text-[11px] text-[#93000a]/90 font-medium">
              4 actions réflexes grand format (Confiner / Évacuer / Décontaminer / Appeler)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => onOpenSubScreen({ type: 'mode-crise' })}
            className="flex-1 sm:flex-initial min-h-[44px] px-3.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-xl font-['Space_Grotesk'] text-[12px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <span>Ouvrir l'écran réflexe</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenSubScreen({ type: 'carte-perimetres' })}
            title="Carte & Radar PPI Hors-Ligne"
            className="min-h-[44px] px-3 bg-[#001126] hover:bg-[#12263f] text-[#98f6c5] rounded-xl font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center justify-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">radar</span>
            <span>Radar PPI</span>
          </button>
        </div>
      </section>

      {/* 1. Avertissement permanent supérieur encadré haute lisibilité */}
      <section
        role="alert"
        className="w-full bg-[#dee1ff] rounded-xl p-4 shadow-sm border border-[#b9c3ff]"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#001258] text-white flex items-center justify-center flex-shrink-0">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="font-['Space_Grotesk'] text-[12px] uppercase tracking-wider text-[#001258] font-bold">
                Notice Impérative
              </span>
              <span className="font-['Space_Grotesk'] text-[10px] text-[#0032c3] bg-white/80 px-1.5 py-0.5 rounded font-bold">
                AUTONOMIE LOCALE
              </span>
            </div>
            <p className="text-[14px] text-[#001258] font-semibold leading-snug">
              En cas de danger immédiat, suivez les ordres des autorités et contactez les secours. Cette application ne reçoit pas les alertes officielles.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Raccourcis d'appel d'urgence sécurisés */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-['Space_Grotesk'] text-[13px] uppercase tracking-wider text-[#001126] font-bold flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-[#ba1a1a] text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              call
            </span>
            Appels d'urgence sécurisés
          </h2>
          <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] font-medium">
            Double validation tactile
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
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
            className="w-full min-h-[56px] p-2.5 bg-white rounded-xl shadow-sm hover:bg-[#eef4ff] active:scale-[0.98] transition-transform flex items-center gap-2.5 text-left border border-[#c4c6ce]"
          >
            <div className="w-10 h-10 rounded-lg bg-[#eef4ff] flex items-center justify-center flex-shrink-0">
              <span className="font-['Space_Grotesk'] text-[18px] text-[#001126] font-bold">15</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-['Space_Grotesk'] text-[12px] text-[#001126] uppercase font-bold truncate">
                SAMU
              </span>
              <span className="text-[11px] text-[#44474d] truncate">Urgence médicale</span>
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
            className="w-full min-h-[56px] p-2.5 bg-white rounded-xl shadow-sm hover:bg-[#eef4ff] active:scale-[0.98] transition-transform flex items-center gap-2.5 text-left border border-[#c4c6ce]"
          >
            <div className="w-10 h-10 rounded-lg bg-[#ffdad6] flex items-center justify-center flex-shrink-0">
              <span className="font-['Space_Grotesk'] text-[18px] text-[#93000a] font-bold">18</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-['Space_Grotesk'] text-[12px] text-[#001126] uppercase font-bold truncate">
                Pompiers
              </span>
              <span className="text-[11px] text-[#44474d] truncate">Secours & Périls</span>
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
            className="w-full min-h-[56px] p-2.5 bg-white rounded-xl shadow-sm hover:bg-[#eef4ff] active:scale-[0.98] transition-transform flex items-center gap-2.5 text-left border border-[#c4c6ce]"
          >
            <div className="w-10 h-10 rounded-lg bg-[#d4e3ff] flex items-center justify-center flex-shrink-0">
              <span className="font-['Space_Grotesk'] text-[18px] text-[#061c35] font-bold">112</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-['Space_Grotesk'] text-[12px] text-[#001126] uppercase font-bold truncate">
                112 Europe
              </span>
              <span className="text-[11px] text-[#44474d] truncate">Sans réseau op.</span>
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
            className="w-full min-h-[56px] p-2.5 bg-white rounded-xl shadow-sm hover:bg-[#eef4ff] active:scale-[0.98] transition-transform flex items-center gap-2.5 text-left border border-[#c4c6ce]"
          >
            <div className="w-10 h-10 rounded-lg bg-[#dce9fd] flex items-center justify-center flex-shrink-0">
              <span className="font-['Space_Grotesk'] text-[18px] text-[#001126] font-bold">114</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-['Space_Grotesk'] text-[12px] text-[#001126] uppercase font-bold truncate">
                114 SMS
              </span>
              <span className="text-[11px] text-[#44474d] truncate">Texte silencieux</span>
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
          className="w-full min-h-[52px] p-3 bg-[#eef4ff] rounded-xl shadow-sm hover:bg-[#e4efff] active:scale-[0.99] transition-transform flex items-center justify-between gap-3 border border-[#d6e4f8]"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border border-[#c4c6ce]">
              <span
                className="material-symbols-outlined text-[#001126] text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                science
              </span>
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="font-['Space_Grotesk'] text-[12px] text-[#001126] uppercase font-bold truncate">
                Centre Antipoison Régional
              </span>
              <span className="text-[11px] text-[#44474d] truncate">
                Assistance toxicologique 24h/24
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-[#c4c6ce] flex-shrink-0">
            <span className="material-symbols-outlined text-[#001126] text-[16px]">touch_app</span>
            <span className="font-['Space_Grotesk'] text-[11px] text-[#001126] font-bold">
              Appui sécurisé
            </span>
          </div>
        </button>
      </section>

      {/* 3. Les 4 parcours réflexes guidés */}
      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between px-1">
          <h2 className="text-[18px] text-[#001126] font-bold tracking-tight">
            4 Parcours Réflexes Immédiats
          </h2>
          <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] font-medium">
            Priorité 0 à 15 min
          </span>
        </div>

        {/* Reflexe 1: Danger immédiat */}
        <article className="w-full bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 relative border border-[#c4c6ce]">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-center font-['Space_Grotesk'] text-[16px] font-bold flex-shrink-0">
                1
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-['Space_Grotesk'] text-[11px] text-[#ba1a1a] uppercase font-bold tracking-wider">
                  Action Physique Urgente
                </span>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[16px] text-[#001126] font-bold leading-tight truncate">
                    Je suis face à un danger immédiat
                  </h3>
                  <Tooltip
                    title="Pourquoi se confiner ?"
                    content="Un bâtiment en dur calfeutré réduit de plus de 90% l'inhalation d'aérosols toxiques ou de particules radioactives par rapport à l'extérieur."
                  />
                </div>
              </div>
            </div>
            <span className="font-['Space_Grotesk'] text-[11px] px-2 py-0.5 rounded bg-[#ffdad6] text-[#93000a] font-bold flex-shrink-0">
              CRITIQUE
            </span>
          </div>

          <p className="text-[14px] text-[#0f1c2b] font-medium leading-relaxed">
            Consigne immédiate de mise à l’abri : rejoignez au plus vite un bâtiment en dur clos et calfeutrez tous les accès. Ne cherchez pas à fuir au hasard en voiture : appliquez strictement les ordres diffusés par les autorités.
          </p>

          <div className="grid grid-cols-3 gap-1.5 pt-0.5">
            <div className="bg-[#eef4ff] p-2 rounded-lg flex flex-col items-center text-center border border-[#d6e4f8]">
              <span className="material-symbols-outlined text-[#001126] text-[20px] mb-0.5">campaign</span>
              <span className="font-['Space_Grotesk'] text-[11px] text-[#0f1c2b] font-semibold">
                Ordres d'État
              </span>
            </div>
            <div className="bg-[#eef4ff] p-2 rounded-lg flex flex-col items-center text-center border border-[#d6e4f8]">
              <span className="material-symbols-outlined text-[#001126] text-[20px] mb-0.5">
                apartment
              </span>
              <span className="font-['Space_Grotesk'] text-[11px] text-[#0f1c2b] font-semibold">
                Bâtiment dur
              </span>
            </div>
            <div className="bg-[#eef4ff] p-2 rounded-lg flex flex-col items-center text-center border border-[#d6e4f8]">
              <span className="material-symbols-outlined text-[#001126] text-[20px] mb-0.5">close</span>
              <span className="font-['Space_Grotesk'] text-[11px] text-[#0f1c2b] font-semibold">
                Calfeutrer sas
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onOpenSubScreen({ type: 'confinement-guide' })}
              type="button"
              className="min-h-[48px] flex-1 bg-[#001126] hover:bg-[#12263f] text-white rounded-lg font-['Space_Grotesk'] text-[12px] uppercase font-bold flex items-center justify-center gap-2 active:opacity-90 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">meeting_room</span>
              <span>Guide Confinement Étanche</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button
              onClick={() => onOpenSubScreen({ type: 'protocol', id: 'confinement' })}
              type="button"
              className="min-h-[48px] px-3 bg-[#e4efff] hover:bg-[#dce9fd] text-[#001126] rounded-lg font-['Space_Grotesk'] text-[12px] uppercase font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Fiche Réflexe</span>
            </button>
          </div>
        </article>

        {/* Reflexe 2: Alerte officielle reçue */}
        <article className="w-full bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 relative border border-[#c4c6ce]">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#0036ce] text-white flex items-center justify-center font-['Space_Grotesk'] text-[16px] font-bold flex-shrink-0">
                2
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-['Space_Grotesk'] text-[11px] text-[#0036ce] uppercase font-bold tracking-wider">
                  Ordre Préfectoral
                </span>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[16px] text-[#001126] font-bold leading-tight truncate">
                    Une alerte officielle a été reçue
                  </h3>
                  <Tooltip
                    title="Laissez les lignes libres"
                    content="Ne saturez pas les réseaux mobiles. Les secours (15, 18, 112) ont besoin de la bande passante. Informez-vous par la radio publique."
                  />
                </div>
              </div>
            </div>
            <span className="font-['Space_Grotesk'] text-[11px] px-2 py-0.5 rounded bg-[#dee1ff] text-[#001258] font-bold flex-shrink-0">
              FR-ALERT
            </span>
          </div>

          <p className="text-[14px] text-[#0f1c2b] font-medium leading-relaxed">
            Consignes de confinement immédiat : allumez France Bleu ou la radio locale. Ne vous déplacez sous aucun prétexte. Ne pas aller chercher les enfants à l'école.
          </p>

          <div className="bg-[#eef4ff] p-3 rounded-lg flex items-center gap-2.5 border border-[#d6e4f8]">
            <span
              className="material-symbols-outlined text-[#0036ce] text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              child_care
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-['Space_Grotesk'] text-[12px] text-[#001126] font-bold">
                Écoles sécurisées
              </span>
              <span className="text-[12px] text-[#44474d] leading-snug">
                Les équipes scolaires appliquent le PPMS pour protéger vos enfants.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onOpenSubScreen({ type: 'siren-guide' })}
              type="button"
              className="min-h-[48px] flex-1 bg-[#0036ce] hover:bg-[#0028a3] text-white rounded-lg font-['Space_Grotesk'] text-[12px] uppercase font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">campaign</span>
              <span>Reconnaître le Signal d'Alerte RNA</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button
              onClick={() => toggleExpand('r2')}
              type="button"
              className="min-h-[48px] px-3 bg-[#e4efff] hover:bg-[#dce9fd] text-[#001126] rounded-lg font-['Space_Grotesk'] text-[12px] uppercase font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">radio</span>
              <span>Fréquences</span>
            </button>
          </div>

          {expandedSection === 'r2' && (
            <div className="bg-[#f8f9ff] p-3 rounded-lg flex flex-col gap-1.5 text-[13px] text-[#0f1c2b] border border-[#c4c6ce]">
              <p className="font-bold text-[#001126]">Consignes prioritaires reçues :</p>
              <p>• Gardez la ligne téléphonique libre pour les services de secours.</p>
              <p>• Écoutez France Bleu (FM ou grandes ondes) ou France Inter pour les bulletins certifiés.</p>
              <p>• Tout déplacement extérieur non ordonné compromet la chaîne d'intervention.</p>
            </div>
          )}
        </article>

        {/* Reflexe 3: Suspicion contamination */}
        <article className="w-full bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 relative border border-[#c4c6ce]">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#002c1b] text-white flex items-center justify-center font-['Space_Grotesk'] text-[16px] font-bold flex-shrink-0">
                3
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-['Space_Grotesk'] text-[11px] text-[#3f9d73] uppercase font-bold tracking-wider">
                  Décontamination
                </span>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[16px] text-[#001126] font-bold leading-tight truncate">
                    Je suspecte une contamination
                  </h3>
                  <Tooltip
                    title="80% à 90% d'efficacité"
                    content="Retirer avec précaution les couches externes de vêtements élimine la quasi-totalité des contaminants déposés en surface."
                  />
                </div>
              </div>
            </div>
            <span className="font-['Space_Grotesk'] text-[11px] px-2 py-0.5 rounded bg-[#98f6c5] text-[#005236] font-bold flex-shrink-0">
              HYGIÈNE
            </span>
          </div>

          <p className="text-[14px] text-[#0f1c2b] font-medium leading-relaxed">
            Procédure d'urgence en zone tampon : déshabillage méthodique de la tête aux pieds, rinçage abondant à l'eau claire sans frotter, ensachage hermétique immédiat des vêtements.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#eef4ff] p-2.5 rounded-lg flex items-center gap-2 border border-[#d6e4f8]">
              <span className="material-symbols-outlined text-[#001126] text-[20px]">water_drop</span>
              <span className="font-['Space_Grotesk'] text-[12px] text-[#0f1c2b] font-semibold">
                Rincer sans frotter
              </span>
            </div>
            <div className="bg-[#eef4ff] p-2.5 rounded-lg flex items-center gap-2 border border-[#d6e4f8]">
              <span className="material-symbols-outlined text-[#001126] text-[20px]">shopping_bag</span>
              <span className="font-['Space_Grotesk'] text-[12px] text-[#0f1c2b] font-semibold">
                Double ensachage
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onOpenSubScreen({ type: 'deshabillage' })}
              type="button"
              className="min-h-[48px] flex-1 bg-[#002c1b] hover:bg-[#005236] text-[#98f6c5] rounded-lg font-['Space_Grotesk'] text-[12px] uppercase font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">sanitizer</span>
              <span>Guide Déshabillage Pas-à-Pas (8 étapes)</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button
              onClick={() => toggleExpand('r3')}
              type="button"
              className="min-h-[48px] px-3 bg-[#e4efff] hover:bg-[#dce9fd] text-[#001126] rounded-lg font-['Space_Grotesk'] text-[12px] uppercase font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Aperçu rapide</span>
              <span className="material-symbols-outlined text-[18px]">unfold_more</span>
            </button>
          </div>

          {expandedSection === 'r3' && (
            <div className="bg-[#f8f9ff] p-3 rounded-lg flex flex-col gap-1.5 text-[13px] text-[#0f1c2b] border border-[#c4c6ce]">
              <p className="font-bold text-[#001126]">Déshabillage sans dispersion :</p>
              <p>1. Déchaussez et retirez vêtements par retournement externe (enroulez sur l'envers).</p>
              <p>2. Isolez les vêtements dans un sac plastique épais fermé hermétiquement.</p>
              <p>3. Rincez le visage et les mains à l'eau tiède sans savon abrasif pendant 15 minutes.</p>
              <button
                onClick={() => onOpenSubScreen({ type: 'deshabillage' })}
                type="button"
                className="mt-1 text-[#0036ce] font-bold text-[12px] text-left underline flex items-center gap-1"
              >
                <span>Accéder au protocole interactif complet avec minuteur de rinçage</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          )}
        </article>

        {/* Reflexe 4: Classification NRBC */}
        <article className="w-full bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 relative border border-[#c4c6ce]">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#e4efff] text-[#001126] flex items-center justify-center font-['Space_Grotesk'] text-[16px] font-bold flex-shrink-0">
                4
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] uppercase font-bold tracking-wider">
                  Classification NRBC
                </span>
                <h3 className="text-[16px] text-[#001126] font-bold leading-tight truncate">
                  Je cherche les consignes d'un risque précis
                </h3>
              </div>
            </div>
          </div>

          <p className="text-[14px] text-[#0f1c2b] font-medium">
            Accès filtré selon la typologie de menace identifiée.
          </p>

          {/* Boutons sélecteurs N - R - B - C */}
          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={() => handleSelectRiskCode('N')}
              type="button"
              className={`min-h-[52px] rounded-xl flex flex-col items-center justify-center p-1 transition-all border ${
                selectedRisk?.code === 'N'
                  ? 'bg-[#001126] text-white border-[#001126] shadow-sm'
                  : 'bg-[#eef4ff] hover:bg-[#e4efff] text-[#001126] border-[#d6e4f8]'
              }`}
            >
              <span className="font-['Space_Grotesk'] text-[18px] font-bold">N</span>
              <span className="font-['Space_Grotesk'] text-[10px] uppercase font-semibold">
                Nucléaire
              </span>
            </button>

            <button
              onClick={() => handleSelectRiskCode('R')}
              type="button"
              className={`min-h-[52px] rounded-xl flex flex-col items-center justify-center p-1 transition-all border ${
                selectedRisk?.code === 'R'
                  ? 'bg-[#001126] text-white border-[#001126] shadow-sm'
                  : 'bg-[#eef4ff] hover:bg-[#e4efff] text-[#001126] border-[#d6e4f8]'
              }`}
            >
              <span className="font-['Space_Grotesk'] text-[18px] font-bold">R</span>
              <span className="font-['Space_Grotesk'] text-[10px] uppercase font-semibold">
                Radiolog.
              </span>
            </button>

            <button
              onClick={() => handleSelectRiskCode('B')}
              type="button"
              className={`min-h-[52px] rounded-xl flex flex-col items-center justify-center p-1 transition-all border ${
                selectedRisk?.code === 'B'
                  ? 'bg-[#001126] text-white border-[#001126] shadow-sm'
                  : 'bg-[#eef4ff] hover:bg-[#e4efff] text-[#001126] border-[#d6e4f8]'
              }`}
            >
              <span className="font-['Space_Grotesk'] text-[18px] font-bold">B</span>
              <span className="font-['Space_Grotesk'] text-[10px] uppercase font-semibold">
                Biologique
              </span>
            </button>

            <button
              onClick={() => handleSelectRiskCode('C')}
              type="button"
              className={`min-h-[52px] rounded-xl flex flex-col items-center justify-center p-1 transition-all border ${
                selectedRisk?.code === 'C'
                  ? 'bg-[#001126] text-white border-[#001126] shadow-sm'
                  : 'bg-[#eef4ff] hover:bg-[#e4efff] text-[#001126] border-[#d6e4f8]'
              }`}
            >
              <span className="font-['Space_Grotesk'] text-[18px] font-bold">C</span>
              <span className="font-['Space_Grotesk'] text-[10px] uppercase font-semibold">
                Chimique
              </span>
            </button>
          </div>

          {/* Panneau dynamique risque sélectionné */}
          {selectedRisk && (
            <div className="bg-[#eef4ff] p-3 rounded-lg flex flex-col gap-2 border border-[#d6e4f8]">
              <div className="flex items-center justify-between">
                <span className="font-['Space_Grotesk'] text-[12px] uppercase font-bold text-[#001126]">
                  RISQUE {selectedRisk.code} - {selectedRisk.name}
                </span>
                <span className="font-['Space_Grotesk'] text-[10px] bg-white px-2 py-0.5 rounded font-bold border border-[#c4c6ce]">
                  SYNTHÈSE
                </span>
              </div>
              <p className="text-[13px] text-[#0f1c2b] leading-snug">{selectedRisk.desc}</p>
              <button
                onClick={() =>
                  onOpenSubScreen({ type: 'protocol', id: selectedRisk.protocolKey })
                }
                type="button"
                className="min-h-[44px] w-full bg-[#001126] hover:bg-[#12263f] text-white rounded-lg font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Ouvrir la fiche complète {selectedRisk.name}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          )}
        </article>
      </section>

      {/* 4. Principes d'urgence immédiate (Points clés sous stress) */}
      <section className="w-full bg-[#eef4ff] rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-[#d6e4f8]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#001126] text-[22px]">checklist</span>
          <h2 className="text-[18px] text-[#001126] font-bold">Points Clés Sous Stress</h2>
        </div>
        <p className="text-[13px] text-[#44474d]">
          Règles immuables validées par la sécurité civile. Mémorisez ces quatre postures de survie :
        </p>

        <div className="flex flex-col gap-2">
          {/* Point 1 */}
          <div className="min-h-[48px] bg-white rounded-lg p-2.5 flex items-center gap-3 border border-[#c4c6ce]">
            <div className="w-8 h-8 rounded-full bg-[#e4efff] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#001126] text-[18px]">navigation</span>
            </div>
            <span className="text-[14px] font-semibold text-[#001126] flex-1">
              Se confiner ou s'éloigner selon le vent
            </span>
          </div>

          {/* Point 2 */}
          <div className="min-h-[48px] bg-white rounded-lg p-2.5 flex items-center gap-3 border border-[#c4c6ce]">
            <div className="w-8 h-8 rounded-full bg-[#e4efff] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#001126] text-[18px]">radio</span>
            </div>
            <span className="text-[14px] font-semibold text-[#001126] flex-1">
              Écouter la radio officielle (France Bleu, locales)
            </span>
          </div>

          {/* Point 3 */}
          <div className="min-h-[48px] bg-white rounded-lg p-2.5 flex items-center gap-3 border border-[#c4c6ce]">
            <div className="w-8 h-8 rounded-full bg-[#e4efff] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#001126] text-[18px]">
                phone_disabled
              </span>
            </div>
            <span className="text-[14px] font-semibold text-[#001126] flex-1">
              Ne pas encombrer les réseaux téléphoniques
            </span>
          </div>

          {/* Point 4 */}
          <div
            onClick={() => onOpenSubScreen({ type: 'iode' })}
            role="button"
            tabIndex={0}
            className="min-h-[52px] bg-white rounded-lg p-2.5 flex items-center gap-3 border border-[#ffdad6] bg-[#ffdad6]/30 hover:bg-[#ffdad6]/50 cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#ffdad6] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">
                medication
              </span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[14px] font-semibold text-[#001126]">
                Ne pas prendre d'iode sans ordre préfectoral
              </span>
              <span className="text-[11px] text-[#ba1a1a] font-bold underline flex items-center gap-1">
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
          className="w-full min-h-[52px] bg-[#dce9fd] hover:bg-[#d6e4f8] text-[#001126] rounded-xl font-['Space_Grotesk'] text-[13px] uppercase font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">menu_book</span>
          <span>Consulter le catalogue complet des guides</span>
        </button>

        <button
          onClick={() => onOpenSubScreen({ type: 'tracabilite' })}
          type="button"
          className="w-full py-2.5 px-3 bg-[#eef4ff] hover:bg-[#e4efff] border border-[#d6e4f8] rounded-xl flex items-center justify-center gap-2 text-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#3f9d73] text-[18px]">verified_user</span>
          <span className="font-['Space_Grotesk'] text-[11px] text-[#001126] font-bold">
            Consulter le Registre de Traçabilité & Sources Officielles (v2.4.1)
          </span>
        </button>
      </section>
    </div>
  );
};
