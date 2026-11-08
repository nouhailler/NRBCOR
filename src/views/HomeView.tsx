import React, { useState, useEffect } from 'react';
import { TabType, SubScreen } from '../types';
import { FamilyPlanData, AppSettings } from '../services/storage/StorageRepository';
import { storageService } from '../services/storage/IndexedDbStorage';
import { triggerHaptic } from '../utils/haptics';
import { useTranslation } from '../i18n/I18nContext';

interface HomeViewProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenSubScreen: (screen: SubScreen) => void;
  kitCompletionPercent?: number;
  canInstall?: boolean;
  onInstallClick?: () => void;
  onOpenWipeModal?: () => void;
  onStartTour?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateTab,
  onOpenSubScreen,
  kitCompletionPercent = 68,
  canInstall = false,
  onInstallClick,
  onOpenWipeModal,
  onStartTour,
}) => {
  const { t, language } = useTranslation();
  const [familyPlan, setFamilyPlan] = useState<FamilyPlanData | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    storageService.getFamilyPlan().then((plan) => {
      setFamilyPlan(plan);
    });
    storageService.getSettings().then((s) => {
      setSettings(s);
    });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex flex-col w-full px-4 pt-24 pb-28 gap-4 max-w-xl mx-auto">
      {/* 1. Bannière de statut réseau & fraîcheur doctrinale proéminente */}
      <section data-tour="home-status" className="w-full bg-[#eef4ff] rounded-xl p-4 shadow-sm border border-[#d6e4f8] flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full shrink-0 ${isOnline ? 'bg-[#16a34a] animate-pulse' : 'bg-[#dc2626]'}`}></span>
            <span className="font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider text-[#001126]">
              {isOnline
                ? (language === 'fr' ? 'Connectivité Réseau Détectée' : 'Network Connection Active')
                : (language === 'fr' ? 'Mode Déconnecté (Hors-Ligne)' : 'Disconnected (Offline Mode)')}
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-[10px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-bold uppercase">
            {language === 'fr' ? 'LOCAL EMBARQUÉ' : 'LOCAL SOVEREIGN'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[12px] pt-1.5 border-t border-[#d6e4f8]/80">
          <div className="flex flex-col bg-white p-2.5 rounded-lg border border-[#c4c6ce]">
            <span className="text-[10px] uppercase font-['Space_Grotesk'] text-[#44474d] font-bold">
              {language === 'fr' ? 'Disponibilité locale :' : 'Local availability:'}
            </span>
            <span className="font-semibold text-[#001126] mt-0.5">
              {language === 'fr'
                ? '100% autonome (5 protocoles complets, déshabillage & kits)'
                : '100% autonomous (5 complete CBRN protocols, undressing & kits)'}
            </span>
          </div>

          <div className="flex flex-col bg-white p-2.5 rounded-lg border border-[#c4c6ce]">
            <span className="text-[10px] uppercase font-['Space_Grotesk'] text-[#44474d] font-bold">
              {language === 'fr' ? 'Fraîcheur doctrinale du corpus :' : 'Doctrinal freshness:'}
            </span>
            <span className="font-semibold text-[#0036ce] mt-0.5">
              {language === 'fr'
                ? 'Dernière révision : 18 Oct. 2026 (IRSN / DGSCGC / SPF)'
                : 'Latest review: Oct 18, 2026 (IRSN / DGSCGC / SPF)'}
            </span>
          </div>
        </div>
      </section>

      {/* Raccourci Installation PWA sur l'écran d'accueil pour utilisateurs novices */}
      {onInstallClick && (
        <section className="w-full bg-[#dee1ff] text-[#001258] rounded-xl p-3.5 shadow-sm border border-[#b9c3ff] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#001258] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">install_mobile</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wide truncate">
                {t('home.installTitle')}
              </span>
              <span className="text-[11px] text-[#44474d] truncate">
                {t('home.installSubtitle')}
              </span>
            </div>
          </div>
          <button
            onClick={onInstallClick}
            type="button"
            className="h-10 px-3.5 rounded-lg bg-[#001258] hover:bg-[#0024a8] text-white font-['Space_Grotesk'] text-[11px] font-bold uppercase shrink-0 transition-colors shadow-xs cursor-pointer"
          >
            {t('home.installBtn')}
          </button>
        </section>
      )}

      {/* Découverte guidée automatique de l'application */}
      {onStartTour && (
        <section className="w-full bg-[#001126] text-white rounded-xl p-3.5 shadow-sm border border-[#1e3a5f] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#98f6c5]/20 text-[#98f6c5] flex items-center justify-center shrink-0 border border-[#98f6c5]/30">
              <span className="material-symbols-outlined text-[20px]">explore</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-['Space_Grotesk'] text-[12px] font-bold text-white truncate">
                {t('tour.startTour')}
              </span>
              <span className="text-[11px] text-[#94a3b8] truncate">
                {t('tour.startTourDesc')}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onStartTour}
            className="h-9 px-3.5 rounded-lg bg-[#98f6c5] hover:bg-[#b2f8d4] text-[#001126] font-['Space_Grotesk'] text-[11px] font-bold uppercase shrink-0 transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px]">play_circle</span>
            <span>{language === 'fr' ? 'Lancer' : 'Start'}</span>
          </button>
        </section>
      )}

      {/* 2. Bloc prioritaire d'urgence 'RÉAGIR MAINTENANT' */}
      <section data-tour="urgent-alert" className="w-full bg-[#ffdad6] text-[#93000a] rounded-xl p-5 shadow-md relative overflow-hidden border border-[#ffb4ab]">
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ba1a1a] flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-white text-[24px]">
                  emergency
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[11px] tracking-wider uppercase font-bold text-[#ba1a1a]">
                  {t('home.vitalPriority')}
                </span>
                <span className="text-[20px] font-bold text-[#93000a] leading-tight">
                  {t('home.urgentSection')}
                </span>
              </div>
            </div>
            <span className="w-3 h-3 rounded-full bg-[#ba1a1a] animate-ping"></span>
          </div>

          <p className="text-[15px] text-[#93000a] font-medium leading-relaxed">
            {t('home.urgentDesc')}
          </p>

          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => onOpenSubScreen({ type: 'mode-crise' })}
              type="button"
              className="w-full min-h-[52px] bg-[#ba1a1a] hover:bg-[#93000a] active:scale-[0.99] text-white rounded-xl flex items-center justify-center gap-2 px-4 shadow-md transition-all font-['Space_Grotesk'] text-[14px] uppercase font-black cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
              <span>{t('home.openCrisis')}</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => onNavigateTab('reagir')}
                type="button"
                className="min-h-[44px] bg-white hover:bg-[#ffdad6] text-[#93000a] border border-[#ffb4ab] rounded-xl flex items-center justify-center gap-1.5 px-3 text-[12px] font-['Space_Grotesk'] font-bold uppercase transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>{t('home.openReact')}</span>
              </button>

              <button
                onClick={() => onOpenSubScreen({ type: 'carte-perimetres' })}
                type="button"
                className="min-h-[44px] bg-[#001126] hover:bg-[#12263f] text-[#98f6c5] rounded-xl flex items-center justify-center gap-1.5 px-3 text-[12px] font-['Space_Grotesk'] font-bold uppercase transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">radar</span>
                <span>{t('home.openRadar')}</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 pt-0.5 text-center">
              <span className="material-symbols-outlined text-[15px] text-[#93000a]/80">info</span>
              <span className="text-[11px] text-[#93000a]/90 font-medium">
                {t('home.noAutoCall')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Grille des 4 risques NRBC */}
      <section data-tour="cbrn-cards" className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#001126] text-[20px]">shield</span>
            <h2 className="text-[18px] text-[#001126] font-bold">
              {language === 'fr' ? 'Protocoles NRBC' : 'CBRN Protocols'}
            </h2>
          </div>
          <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] font-medium">
            {language === 'fr' ? '4 Risques Majeurs' : '4 Major Threats'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Nucléaire */}
          <article className="bg-white rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3 border border-[#c4c6ce]">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#e4efff] flex items-center justify-center text-[#001126]">
                  <span className="material-symbols-outlined text-[22px]">blur_on</span>
                </div>
                <span className="font-['Space_Grotesk'] text-[11px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-semibold">
                  {language === 'fr' ? 'Hors ligne' : 'Offline'}
                </span>
              </div>
              <h3 className="text-[17px] text-[#001126] font-bold mt-1">
                {language === 'fr' ? 'Nucléaire' : 'Nuclear'}
              </h3>
              <p className="text-[13px] text-[#44474d] line-clamp-2">
                {language === 'fr'
                  ? 'Accidents industriels, centrales et installations civiles.'
                  : 'Reactor accidents, nuclear facilities, and civil fallout.'}
              </p>
            </div>
            <button
              onClick={() => onOpenSubScreen({ type: 'protocol', id: 'nucleaire' })}
              type="button"
              className="min-h-[48px] w-full bg-[#e4efff] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold rounded-lg flex items-center justify-between px-3 hover:bg-[#dce9fd] transition-colors cursor-pointer"
            >
              <span>{language === 'fr' ? 'Consulter les guides' : 'View emergency protocol'}</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </article>

          {/* Radiologique */}
          <article className="bg-white rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3 border border-[#c4c6ce]">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#e4efff] flex items-center justify-center text-[#001126]">
                  <span className="material-symbols-outlined text-[22px]">radiology</span>
                </div>
                <span className="font-['Space_Grotesk'] text-[11px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-semibold">
                  {language === 'fr' ? 'Hors ligne' : 'Offline'}
                </span>
              </div>
              <h3 className="text-[17px] text-[#001126] font-bold mt-1">
                {language === 'fr' ? 'Radiologique' : 'Radiological'}
              </h3>
              <p className="text-[13px] text-[#44474d] line-clamp-2">
                {language === 'fr'
                  ? 'Sources orphelines, dispersion radiologique et irradiation.'
                  : 'Orphan sources, dirty bombs, dispersion and external gamma.'}
              </p>
            </div>
            <button
              onClick={() => onOpenSubScreen({ type: 'protocol', id: 'radiologique' })}
              type="button"
              className="min-h-[48px] w-full bg-[#e4efff] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold rounded-lg flex items-center justify-between px-3 hover:bg-[#dce9fd] transition-colors cursor-pointer"
            >
              <span>{language === 'fr' ? 'Consulter les guides' : 'View emergency protocol'}</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </article>

          {/* Biologique */}
          <article className="bg-white rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3 border border-[#c4c6ce]">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#e4efff] flex items-center justify-center text-[#001126]">
                  <span className="material-symbols-outlined text-[22px]">coronavirus</span>
                </div>
                <span className="font-['Space_Grotesk'] text-[11px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-semibold">
                  {language === 'fr' ? 'Hors ligne' : 'Offline'}
                </span>
              </div>
              <h3 className="text-[17px] text-[#001126] font-bold mt-1">
                {language === 'fr' ? 'Biologique' : 'Biological'}
              </h3>
              <p className="text-[13px] text-[#44474d] line-clamp-2">
                {language === 'fr'
                  ? 'Agents pathogènes, épidémies et toxines biologiques.'
                  : 'Pathogenic agents, epidemics, spores and biological toxins.'}
              </p>
            </div>
            <button
              onClick={() => onOpenSubScreen({ type: 'protocol', id: 'bio' })}
              type="button"
              className="min-h-[48px] w-full bg-[#e4efff] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold rounded-lg flex items-center justify-between px-3 hover:bg-[#dce9fd] transition-colors cursor-pointer"
            >
              <span>{language === 'fr' ? 'Consulter les guides' : 'View emergency protocol'}</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </article>

          {/* Chimique */}
          <article className="bg-white rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3 border border-[#c4c6ce]">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#e4efff] flex items-center justify-center text-[#001126]">
                  <span className="material-symbols-outlined text-[22px]">science</span>
                </div>
                <span className="font-['Space_Grotesk'] text-[11px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-semibold">
                  {language === 'fr' ? 'Hors ligne' : 'Offline'}
                </span>
              </div>
              <h3 className="text-[17px] text-[#001126] font-bold mt-1">
                {language === 'fr' ? 'Chimique' : 'Chemical'}
              </h3>
              <p className="text-[13px] text-[#44474d] line-clamp-2">
                {language === 'fr'
                  ? "Fuites toxiques d'usines, transports et produits industriels."
                  : 'Toxic factory releases, chemical transport leaks and industrial vapors.'}
              </p>
            </div>
            <button
              onClick={() => onOpenSubScreen({ type: 'protocol', id: 'chimique' })}
              type="button"
              className="min-h-[48px] w-full bg-[#e4efff] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold rounded-lg flex items-center justify-between px-3 hover:bg-[#dce9fd] transition-colors cursor-pointer"
            >
              <span>{language === 'fr' ? 'Consulter les guides' : 'View emergency protocol'}</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </article>
        </div>
      </section>

      {/* Raccourcis Opérationnels Pas-à-Pas */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#001126] text-[20px]">bolt</span>
            <h2 className="text-[17px] text-[#001126] font-bold">
              {t('home.stepByStep')}
            </h2>
          </div>
          <span className="font-['Space_Grotesk'] text-[11px] bg-[#eef4ff] text-[#0036ce] px-2 py-0.5 rounded font-bold uppercase">
            {t('home.immediate')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Déshabillage */}
          <button
            onClick={() => onOpenSubScreen({ type: 'deshabillage' })}
            type="button"
            className="p-3 bg-white rounded-xl shadow-sm border border-[#c4c6ce] hover:border-[#002c1b] text-left flex flex-col gap-1.5 transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#002c1b] text-[#98f6c5] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">sanitizer</span>
            </div>
            <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] leading-snug group-hover:text-[#002c1b]">
              {language === 'fr' ? 'Déshabillage Décontamination' : 'Undressing & Decontamination'}
            </span>
            <span className="text-[11px] text-[#44474d] leading-tight">
              {language === 'fr' ? '8 étapes sans dispersion & rinçage' : '8 dispersion-free steps & rinsing'}
            </span>
          </button>

          {/* Confinement Étanche */}
          <button
            onClick={() => onOpenSubScreen({ type: 'confinement-guide' })}
            type="button"
            className="p-3 bg-white rounded-xl shadow-sm border border-[#c4c6ce] hover:border-[#0036ce] text-left flex flex-col gap-1.5 transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0036ce] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">meeting_room</span>
            </div>
            <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] leading-snug group-hover:text-[#0036ce]">
              {language === 'fr' ? 'Guide Confinement Étanche' : 'Airtight Sheltering Guide'}
            </span>
            <span className="text-[11px] text-[#44474d] leading-tight">
              {language === 'fr' ? "Calfeutrage & calcul d'oxygène" : 'Sealing joints & oxygen calculation'}
            </span>
          </button>

          {/* Fiche Iode */}
          <button
            onClick={() => onOpenSubScreen({ type: 'iode' })}
            type="button"
            className="p-3 bg-white rounded-xl shadow-sm border border-[#c4c6ce] hover:border-[#ba1a1a] text-left flex flex-col gap-1.5 transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">medication</span>
            </div>
            <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] leading-snug group-hover:text-[#ba1a1a]">
              {language === 'fr' ? 'Fiche Iode Stable' : 'Stable Iodine Prophylaxis'}
            </span>
            <span className="text-[11px] text-[#44474d] leading-tight">
              {language === 'fr' ? 'Calculateur de posologie KI' : 'KI 65mg dosage calculator'}
            </span>
          </button>

          {/* Sirène d'alerte RNA */}
          <button
            onClick={() => onOpenSubScreen({ type: 'siren-guide' })}
            type="button"
            className="p-3 bg-white rounded-xl shadow-sm border border-[#c4c6ce] hover:border-[#001126] text-left flex flex-col gap-1.5 transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#12263f] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">campaign</span>
            </div>
            <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] leading-snug group-hover:text-[#001126]">
              {language === 'fr' ? "Signaux d'Alerte RNA" : 'Civil Siren Warning Signals'}
            </span>
            <span className="text-[11px] text-[#44474d] leading-tight">
              {language === 'fr' ? 'Simulateur sonore & FR-Alert' : 'Audio simulator & Cell Broadcast'}
            </span>
          </button>

          {/* Encyclopédie & Histoire */}
          <button
            onClick={() => onOpenSubScreen({ type: 'encyclopedie', tab: 'histoire' })}
            type="button"
            className="p-3 bg-white rounded-xl shadow-sm border border-[#c4c6ce] hover:border-[#0036ce] text-left flex flex-col gap-1.5 transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#001126] text-[#98f6c5] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">history_edu</span>
            </div>
            <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] leading-snug group-hover:text-[#0036ce]">
              {language === 'fr' ? 'Histoire & Doctrines' : 'History & CBRN Doctrines'}
            </span>
            <span className="text-[11px] text-[#44474d] leading-tight">
              {language === 'fr' ? 'Origines, armées & traités' : 'Military origins & countermeasures'}
            </span>
          </button>

          {/* Glossaire A-Z */}
          <button
            onClick={() => onOpenSubScreen({ type: 'encyclopedie', tab: 'glossaire' })}
            type="button"
            className="p-3 bg-white rounded-xl shadow-sm border border-[#c4c6ce] hover:border-[#005236] text-left flex flex-col gap-1.5 transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#005236] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">spellcheck</span>
            </div>
            <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] leading-snug group-hover:text-[#005236]">
              {language === 'fr' ? 'Glossaire A-Z' : 'A-Z Glossary'}
            </span>
            <span className="text-[11px] text-[#44474d] leading-tight">
              {language === 'fr' ? 'Dictionnaire & acronymes' : 'Dictionary & acronym index'}
            </span>
          </button>
        </div>
      </section>

      {/* 4. Tableau de Bord « Suis-je prêt ? » & Résilience du Foyer */}
      <section className="w-full bg-[#001126] text-white rounded-2xl p-5 shadow-md flex flex-col gap-3.5 border border-[#12263f] relative overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#0036ce] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[26px]">speed</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <h2 className="text-[18px] font-bold text-white">{t('home.dashboardTitle')}</h2>
                <span className="font-['Space_Grotesk'] text-[10px] bg-[#98f6c5] text-[#005236] px-1.5 py-0.2 rounded font-bold uppercase">
                  {language === 'fr' ? 'Nouveau' : 'New'}
                </span>
              </div>
              <span className="text-[12px] text-[#c4c6ce]">
                {t('home.dashboardSubtitle')}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenSubScreen({ type: 'suis-je-pret' })}
            className="font-['Space_Grotesk'] text-[13px] font-bold text-[#98f6c5] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            {t('home.viewScore')}
          </button>
        </div>

        {/* Jauge d'autonomie et points vitaux */}
        <div className="flex flex-col gap-1.5">
          <div className="w-full h-3 bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#98f6c5] rounded-full transition-all duration-500"
              style={{ width: `${Math.max(20, kitCompletionPercent)}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[#c4c6ce] font-['Space_Grotesk'] text-[11px]">
            <span>{t('home.targetAutonomy')}</span>
            <span className="text-[#98f6c5] font-semibold">{t('home.calculatedLocally')}</span>
          </div>
        </div>

        {/* 3 piliers rapides */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-2 rounded-xl border border-white/10">
            <span className="material-symbols-outlined text-[16px] text-[#98f6c5]">water_drop</span>
            <div className="flex flex-col min-w-0">
              <span className="font-['Space_Grotesk'] text-[10px] text-[#c4c6ce] uppercase">
                {language === 'fr' ? 'Eau 72h' : 'Water 72h'}
              </span>
              <span className="text-[11px] font-bold text-white truncate">3L / d / person</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-2 rounded-xl border border-white/10">
            <span className="material-symbols-outlined text-[16px] text-[#ffd599]">cell_tower</span>
            <div className="flex flex-col min-w-0">
              <span className="font-['Space_Grotesk'] text-[10px] text-[#c4c6ce] uppercase">
                {language === 'fr' ? 'Info Alerte' : 'Alert info'}
              </span>
              <span className="text-[11px] font-bold text-white truncate">FM / DAB+</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-2 rounded-xl border border-white/10">
            <span className="material-symbols-outlined text-[16px] text-[#98f6c5]">manage_accounts</span>
            <div className="flex flex-col min-w-0">
              <span className="font-['Space_Grotesk'] text-[10px] text-[#c4c6ce] uppercase">
                {language === 'fr' ? 'Besoins' : 'Needs'}
              </span>
              <span className="text-[11px] font-bold text-white truncate">
                {language === 'fr' ? 'Ajustables' : 'Adjustable'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            onClick={() => onOpenSubScreen({ type: 'suis-je-pret' })}
            type="button"
            className="min-h-[46px] flex-1 bg-[#0036ce] hover:bg-[#002ba8] active:scale-[0.99] text-white rounded-xl flex items-center justify-center gap-2 transition-all font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">speed</span>
            <span>{language === 'fr' ? 'Ouvrir mon tableau de bord' : 'Open Readiness Dashboard'}</span>
          </button>
          <button
            onClick={() => onNavigateTab('preparation')}
            type="button"
            className="min-h-[46px] px-4 bg-white/10 hover:bg-white/15 text-white rounded-xl flex items-center justify-center gap-1.5 transition-colors font-['Space_Grotesk'] text-[12px] font-semibold cursor-pointer"
          >
            <span>{language === 'fr' ? 'Kit détaillé' : 'Detailed Kit'}</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </section>

      {/* 5. Carte Plan Familial */}
      {(() => {
        const hasPoint = familyPlan?.assemblyPoints && familyPlan.assemblyPoints.length > 0;
        const primaryPointName = hasPoint ? familyPlan.assemblyPoints![0].name : null;
        const contactCount = (familyPlan?.outZoneContact ? 1 : 0) + (familyPlan?.localContacts?.length || 0);
        const membersCount = familyPlan?.members?.length || 0;
        const isPlanConfigured = hasPoint || contactCount > 0 || membersCount > 0;

        return (
          <section className="w-full bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-[#c4c6ce]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#e4efff] flex items-center justify-center text-[#001126]">
                  <span className="material-symbols-outlined text-[20px]">family_restroom</span>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[18px] font-bold text-[#001126]">
                    {language === 'fr' ? 'Plan Familial' : 'Family Emergency Plan'}
                  </h2>
                  <span className="text-[13px] text-[#44474d]">
                    {language === 'fr' ? 'Dispositif de rassemblement hors ligne' : 'Offline rally and contact blueprint'}
                  </span>
                </div>
              </div>
              {isPlanConfigured ? (
                <span
                  className="material-symbols-outlined text-[#3f9d73] text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  title={language === 'fr' ? 'Fiche configurée' : 'Configured'}
                >
                  verified
                </span>
              ) : (
                <span className="font-['Space_Grotesk'] text-[11px] bg-[#ffd599] text-[#723b00] px-2 py-0.5 rounded font-bold uppercase">
                  {language === 'fr' ? 'À configurer' : 'Pending setup'}
                </span>
              )}
            </div>

            <div className="bg-[#eef4ff] rounded-lg p-3 flex flex-col gap-2 border border-[#d6e4f8]">
              <div className="flex items-center gap-2 text-[#0f1c2b]">
                <span className="material-symbols-outlined text-[18px] text-[#001126]">pin_drop</span>
                <div className="flex flex-col">
                  <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d]">
                    {hasPoint
                      ? (language === 'fr' ? 'Point de ralliement défini' : 'Designated rally point')
                      : (language === 'fr' ? 'Point de ralliement' : 'Rally point')}
                  </span>
                  <span className="text-[15px] font-bold text-[#001126]">
                    {primaryPointName || (language === 'fr' ? 'Non défini (feuille blanche)' : 'Not set')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 pt-1 text-[#44474d] font-['Space_Grotesk'] text-[11px]">
                <span className="material-symbols-outlined text-[16px] text-[#0036ce]">contact_phone</span>
                <span>
                  {contactCount > 0
                    ? (language === 'fr'
                        ? `${contactCount} contact${contactCount > 1 ? 's' : ''} d'urgence enregistré${contactCount > 1 ? 's' : ''} en mémoire locale`
                        : `${contactCount} emergency contact${contactCount > 1 ? 's' : ''} saved locally`)
                    : (language === 'fr' ? 'Aucun contact enregistré (0 contact)' : 'No contacts saved yet')}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('mon-plan')}
              type="button"
              className="min-h-[48px] w-full bg-[#e4efff] hover:bg-[#dce9fd] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold uppercase rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <span>{isPlanConfigured
                ? (language === 'fr' ? 'Gérer les membres et le protocole' : 'Manage members & protocols')
                : (language === 'fr' ? 'Configurer mon plan familial maintenant' : 'Configure family plan now')}</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </section>
        );
      })()}

      {/* 6. Risques locaux & Géorisques */}
      <section className="w-full bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-[#c4c6ce]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#e4efff] flex items-center justify-center text-[#001126]">
              <span className="material-symbols-outlined text-[20px]">near_me</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-[18px] font-bold text-[#001126]">
                {language === 'fr' ? 'Risques locaux & Géorisques' : 'Local Risks & Georisques'}
              </h2>
              <span className="font-['Space_Grotesk'] text-[12px] font-semibold text-[#001126]">
                {language === 'fr' ? 'Commune :' : 'Municipality:'} {settings?.savedCommune?.name || (language === 'fr' ? 'Non configurée (définir dans Géorisques)' : 'Not configured')}
              </span>
            </div>
          </div>
          <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] bg-[#dce9fd] px-2 py-0.5 rounded">
            {settings?.savedCommune ? (language === 'fr' ? 'Données Géorisques' : 'Georisques Data') : (language === 'fr' ? 'Non synchronisé' : 'Unsynchronized')}
          </span>
        </div>

        {/* Aperçu de la cartographie géorisque locale */}
        <div
          onClick={() => onOpenSubScreen({ type: 'georisques' })}
          className="w-full h-32 rounded-lg relative overflow-hidden bg-[#e4efff] shadow-inner cursor-pointer group border border-[#c4c6ce]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD4be-zzzr9iZWTNMjH0UnIb-D0VZXYXMqrhS6uEYAHmjfHy7urZFptFy0-fChD4zNX9zz8vaYirDq1LRZ2WJdmk17_MnflfbxMiUmsibD-ht7HWEw5Hv9GbRBP64ThtaAGI2RPG8_fx7sI9AHUUYTP2FZP6r4Bwwp6ga2OO_ibHOxelm2hp7J59TInll7PQtjRLM5e0oBE66sUOnm2eFiiClmtEXFarw8dchUrIXbod0U9WtM8fk0')`
            }}
          ></div>
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[#001126] font-['Space_Grotesk'] text-[11px] flex items-center gap-1.5 shadow-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-[#0036ce]"></span>
            <span>{language === 'fr' ? 'Zone Seveso seuil haut à 4.2 km' : 'Upper-tier Seveso site at 4.2 km'}</span>
          </div>
          <div className="absolute top-2 right-2 bg-[#001126]/80 text-white px-2 py-0.5 rounded text-[11px] font-['Space_Grotesk'] flex items-center gap-1">
            <span>{language === 'fr' ? 'Ouvrir la carte' : 'Open map'}</span>
            <span className="material-symbols-outlined text-[14px]">open_in_full</span>
          </div>
        </div>

        <div className="bg-[#eef4ff] rounded-lg p-2.5 flex items-start gap-2 border border-[#d6e4f8]">
          <span className="material-symbols-outlined text-[#74777e] text-[18px] shrink-0 mt-0.5">policy</span>
          <p className="text-[12px] text-[#44474d] leading-snug">
            {language === 'fr'
              ? 'Mention de transparence : Aucun risque affiché ne garantit une zone exempte de danger. Consultez régulièrement les plans communaux de sauvegarde.'
              : 'Transparency note: The absence of displayed risks never guarantees a hazard-free zone. Periodically check municipal safeguarding directives.'}
          </p>
        </div>
      </section>

      {/* Raccourcis Modules Complémentaires */}
      <section className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onOpenSubScreen({ type: 'formation' })}
          type="button"
          className="p-3 bg-white rounded-xl shadow-sm border border-[#c4c6ce] text-left hover:bg-[#eef4ff] transition-colors flex items-center gap-2 min-h-[52px] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#0036ce] text-[24px]">school</span>
          <div className="min-w-0">
            <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] uppercase block truncate">
              {language === 'fr' ? 'Quiz & Entraînement' : 'Quiz & Drills'}
            </span>
            <span className="text-[11px] text-[#44474d]">{language === 'fr' ? 'Exercices civils' : 'Civic simulations'}</span>
          </div>
        </button>

        <button
          onClick={() => onOpenSubScreen({ type: 'tracabilite' })}
          type="button"
          className="p-3 bg-white rounded-xl shadow-sm border border-[#c4c6ce] text-left hover:bg-[#eef4ff] transition-colors flex items-center gap-2 min-h-[52px] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#3f9d73] text-[24px]">verified_user</span>
          <div className="min-w-0">
            <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] uppercase block truncate">
              {language === 'fr' ? 'Sources & Traçabilité' : 'Sources & Audit'}
            </span>
            <span className="text-[11px] text-[#44474d]">{language === 'fr' ? "Doctrines d'État" : 'State doctrines'}</span>
          </div>
        </button>
      </section>

      {/* 7. Bloc de gestion des données du prototype */}
      {onOpenWipeModal && (
        <section className="w-full bg-[#f0f4f9] rounded-xl p-3.5 border border-[#c4c6ce] flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#001126] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">restart_alt</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] uppercase tracking-wide truncate">
                  {language === 'fr' ? 'Données du prototype' : 'Prototype data'}
                </span>
                <span className="font-['Space_Grotesk'] text-[10px] bg-[#e4efff] text-[#0036ce] px-1.5 py-0.2 rounded font-bold uppercase">
                  {language === 'fr' ? 'Feuille blanche' : 'Clean slate'}
                </span>
              </div>
              <span className="text-[11px] text-[#44474d] truncate">
                {language === 'fr'
                  ? "Effacer les données d'exemple pour démarrer propre de zéro"
                  : 'Clear demo items to start sovereign from scratch'}
              </span>
            </div>
          </div>
          <button
            onClick={onOpenWipeModal}
            type="button"
            className="h-9 px-3 rounded-lg bg-white hover:bg-[#ffdad6] text-[#ba1a1a] border border-[#ffb4ab] font-['Space_Grotesk'] text-[11px] font-bold uppercase shrink-0 transition-colors shadow-xs cursor-pointer"
          >
            {language === 'fr' ? 'Remise à zéro' : 'Reset'}
          </button>
        </section>
      )}

      {/* 8. Pied d'information institutionnelle */}
      <footer className="w-full bg-[#eef4ff] rounded-xl p-4 flex flex-col gap-3 text-[#44474d] border border-[#d6e4f8]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#001126]">
            <span className="material-symbols-outlined text-[18px]">account_balance</span>
            <span className="font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider">
              {language === 'fr' ? 'Portails Officiels & Références' : 'Official Portals & References'}
            </span>
          </div>
          <p className="text-[13px] text-[#44474d]">
            {language === 'fr'
              ? "Données d'instructions harmonisées d'après les directives de la Sécurité Civile et des agences de santé :"
              : 'Instruction guidelines harmonized with Civil Security and Public Health Agencies:'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 font-['Space_Grotesk'] text-[11px]">
          <a
            className="min-h-[48px] bg-white hover:bg-[#e4efff] rounded-lg p-2.5 flex items-center justify-between text-[#001126] border border-[#c4c6ce] font-medium transition-colors"
            href="https://www.gouvernement.fr/risques"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="truncate">Info.gouv.fr</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
          <a
            className="min-h-[48px] bg-white hover:bg-[#e4efff] rounded-lg p-2.5 flex items-center justify-between text-[#001126] border border-[#c4c6ce] font-medium transition-colors"
            href="https://www.interieur.gouv.fr"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="truncate">Min. Intérieur</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
          <a
            className="min-h-[48px] bg-white hover:bg-[#e4efff] rounded-lg p-2.5 flex items-center justify-between text-[#001126] border border-[#c4c6ce] font-medium transition-colors"
            href="https://www.asn.fr"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="truncate">ASNR Nucléaire</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
          <a
            className="min-h-[48px] bg-white hover:bg-[#e4efff] rounded-lg p-2.5 flex items-center justify-between text-[#001126] border border-[#c4c6ce] font-medium transition-colors"
            href="https://www.santepubliquefrance.fr"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="truncate">Santé Publique Fr.</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
        </div>

        {/* Avertissement FR-Alert */}
        <div className="p-3 bg-[#ffdad6]/60 rounded-lg flex items-start gap-2 border border-[#ffb4ab]">
          <span className="material-symbols-outlined text-[#ba1a1a] text-[18px] shrink-0 mt-0.5">
            notifications_off
          </span>
          <p className="text-[12px] text-[#0f1c2b] font-medium leading-snug">
            {language === 'fr'
              ? "Rappel d'autorité : Cette application ne reçoit pas les alertes prioritaires FR-Alert transmises par diffusion cellulaire. En situation d'urgence réelle, fiez-vous au signal sonore national des sirènes (RNA) et aux canaux radio FM officiels (France Bleu, France Info)."
              : 'Operational Reminder: This application does not receive broadcast cell alerts (FR-Alert / Alertswiss / BE-Alert). In real emergencies, prioritize civil defense siren alerts and national emergency radio broadcasts.'}
          </p>
        </div>
      </footer>
    </div>
  );
};
