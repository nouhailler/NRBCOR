import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TourStep } from '../types/tour';
import { TOUR_STEPS } from '../data/tourSteps';
import { TabType, SubScreen } from '../types';
import { useTranslation } from '../i18n/I18nContext';
import { triggerHaptic } from '../utils/haptics';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenSubScreen: (screen: SubScreen) => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenSubScreen
}) => {
  const { language } = useTranslation();
  const isEn = language === 'en';

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100%
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStep: TourStep = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];
  const totalSteps = TOUR_STEPS.length;
  const durationMs = currentStep.durationMs || 7500;

  // Référence pour animation frame du timer
  const lastTickTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<number | null>(null);

  // Synchronisation de la vue de l'application avec l'étape courante
  const syncViewForStep = useCallback((step: TourStep) => {
    if (step.subScreen) {
      onOpenSubScreen(step.subScreen);
    } else {
      onOpenSubScreen(null);
      onNavigateTab(step.tab);
    }
  }, [onNavigateTab, onOpenSubScreen]);

  // Mesure de la position de l'élément cible
  const updateTargetRect = useCallback(() => {
    if (!currentStep.selector) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(currentStep.selector);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }
  }, [currentStep.selector]);

  // Initialisation lors de l'ouverture
  useEffect(() => {
    if (isOpen) {
      setIsCompleted(false);
      setCurrentStepIndex(0);
      setProgress(0);
      setIsPlaying(true);
      lastTickTimeRef.current = Date.now();
      syncViewForStep(TOUR_STEPS[0]);
    }
  }, [isOpen, syncViewForStep]);

  // Changement d'étape : changer la vue, scroller et cibler l'élément
  useEffect(() => {
    if (!isOpen || isCompleted) return;

    syncViewForStep(currentStep);
    setProgress(0);
    lastTickTimeRef.current = Date.now();

    // Laisser le DOM se rafraîchir avant de calculer la boîte de l'élément
    const timer = setTimeout(() => {
      const el = document.querySelector(currentStep.selector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(updateTargetRect, 300);
      } else {
        setTargetRect(null);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [currentStepIndex, isOpen, isCompleted, currentStep, syncViewForStep, updateTargetRect]);

  // Écouteur de redimensionnement et défilement
  useEffect(() => {
    if (!isOpen) return;
    const handleRecalc = () => updateTargetRect();
    window.addEventListener('resize', handleRecalc);
    window.addEventListener('scroll', handleRecalc, true);
    return () => {
      window.removeEventListener('resize', handleRecalc);
      window.removeEventListener('scroll', handleRecalc, true);
    };
  }, [isOpen, updateTargetRect]);

  // Boucle de défilement automatique
  useEffect(() => {
    if (!isOpen || !isPlaying || isCompleted) {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      return;
    }

    lastTickTimeRef.current = Date.now();

    const tick = () => {
      const now = Date.now();
      const elapsed = now - lastTickTimeRef.current;
      lastTickTimeRef.current = now;

      setProgress((prev) => {
        const next = prev + (elapsed / durationMs) * 100;
        if (next >= 100) {
          // Passage automatique à l'étape suivante
          if (currentStepIndex < totalSteps - 1) {
            triggerHaptic('light');
            setCurrentStepIndex((curr) => curr + 1);
            return 0;
          } else {
            // Tour terminé avec succès
            triggerHaptic('success');
            setIsCompleted(true);
            setIsPlaying(false);
            return 100;
          }
        }
        return next;
      });

      timerRef.current = requestAnimationFrame(tick);
    };

    timerRef.current = requestAnimationFrame(tick);

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [isOpen, isPlaying, isCompleted, currentStepIndex, durationMs, totalSteps]);

  // Gestion des actions utilisateur
  const handleTogglePlay = () => {
    triggerHaptic('medium');
    setIsPlaying((prev) => !prev);
    lastTickTimeRef.current = Date.now();
  };

  const handlePrev = () => {
    triggerHaptic('light');
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    triggerHaptic('light');
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      setIsCompleted(true);
      setIsPlaying(false);
    }
  };

  const handleQuit = () => {
    triggerHaptic('warning');
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    onClose();
  };

  const handleRestart = () => {
    triggerHaptic('medium');
    setIsCompleted(false);
    setCurrentStepIndex(0);
    setProgress(0);
    setIsPlaying(true);
    syncViewForStep(TOUR_STEPS[0]);
  };

  // Raccourcis clavier (Espace = pause/continuer, Flèches = précédent/suivant, Échap = quitter)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleQuit();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleTogglePlay, handleNext, handlePrev]);

  if (!isOpen) return null;

  // Calcul du placement de la carte explicative
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const isMobile = viewportWidth < 640;

  // Déterminer si l'élément cible est plutôt en haut ou en bas pour positionner la carte
  let cardPositionStyle: React.CSSProperties = {};
  if (isMobile) {
    // Sur mobile : ancrage propre en bas avec marges et safe-area
    // Sauf si l'élément cible est tout en bas (ex: barre de navigation), on le met en haut
    const isTargetNearBottom = targetRect && targetRect.bottom > viewportHeight - 180;
    if (isTargetNearBottom) {
      cardPositionStyle = {
        top: '16px',
        left: '12px',
        right: '12px'
      };
    } else {
      cardPositionStyle = {
        bottom: '16px',
        left: '12px',
        right: '12px'
      };
    }
  } else if (targetRect) {
    // Sur écran large : positionner intelligemment par rapport à l'élément cible
    const cardWidth = Math.min(480, viewportWidth - 32);
    let left = targetRect.left + targetRect.width / 2 - cardWidth / 2;
    left = Math.max(16, Math.min(viewportWidth - cardWidth - 16, left));

    if (targetRect.top > 320) {
      // Élément en bas : carte au-dessus
      cardPositionStyle = {
        bottom: `${viewportHeight - targetRect.top + 16}px`,
        left: `${left}px`,
        width: `${cardWidth}px`
      };
    } else {
      // Élément en haut : carte en-dessous
      cardPositionStyle = {
        top: `${targetRect.bottom + 16}px`,
        left: `${left}px`,
        width: `${cardWidth}px`
      };
    }
  } else {
    // Si pas de cible mesurée : centré en bas
    cardPositionStyle = {
      bottom: '32px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'min(92vw, 500px)'
    };
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEn ? 'Automatic Discovery Tour' : 'Visite Guidée Découverte Automatique'}
      className="fixed inset-0 z-50 pointer-events-auto select-none font-body"
    >
      {/* 1. Découpe SVG pour le spotlight / halo lumineux sur l'élément cible */}
      {targetRect && !isCompleted ? (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-300 ease-out"
          style={{ width: '100vw', height: '100vh' }}
        >
          <defs>
            <mask id="tour-spotlight-mask">
              {/* Fond blanc complet = masque opaque */}
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {/* Trou noir = découpe transparente laissant voir l'élément ciblé */}
              <rect
                x={Math.max(0, targetRect.left - 6)}
                y={Math.max(0, targetRect.top - 6)}
                width={targetRect.width + 12}
                height={targetRect.height + 12}
                rx="16"
                ry="16"
                fill="black"
              />
            </mask>
          </defs>

          {/* Voile sombre avec la découpe appliquée */}
          <rect
            x="0"
            y="0"
            width="100%" height="100%"
            fill="rgba(0, 17, 38, 0.75)"
            mask="url(#tour-spotlight-mask)"
          />

          {/* Cadre lumineux et vibrant autour de l'élément cible */}
          <rect
            x={Math.max(0, targetRect.left - 6)}
            y={Math.max(0, targetRect.top - 6)}
            width={targetRect.width + 12}
            height={targetRect.height + 12}
            rx="16"
            ry="16"
            fill="none"
            stroke="#98f6c5"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
        </svg>
      ) : (
        /* Voile sombre intégral uniforme si pas de cible ou tour terminé */
        <div className="absolute inset-0 bg-navy/75 backdrop-blur-xs transition-opacity duration-300" />
      )}

      {/* 2. Écran de Clôture / Félicitations si la visite est terminée */}
      {isCompleted ? (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-navy text-white rounded-2xl p-6 sm:p-8 border border-ink shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-ok-soft/20 text-ok-bright border border-ok-bright/40 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[36px]">verified</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-label tracking-wider uppercase text-ok-bright font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-ok-soft"></span>
              <span>{isEn ? 'Tour Completed' : 'Visite Guidée Terminée'}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-label text-white mb-3">
              {isEn ? 'You are ready to explore NRBCOR' : 'Vous connaissez désormais les bases de NRBCOR'}
            </h3>

            <p className="text-sm text-on-navy-muted leading-relaxed mb-6">
              {isEn
                ? 'All protocols, maps, and offline data are now at your fingertips. You can restart this guided tour anytime from the main menu.'
                : 'Tous les protocoles, cartes radar PPI, guides et checklists sont disponibles sans connexion. Vous pouvez relancer cette visite à tout moment depuis le menu principal.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                type="button"
                onClick={handleRestart}
                className="min-h-[46px] px-4 rounded-xl bg-navy-2 hover:bg-navy-2 text-white border border-ink font-label font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">replay</span>
                <span>{isEn ? 'Restart Tour' : 'Recommencer la visite'}</span>
              </button>

              <button
                type="button"
                onClick={handleQuit}
                className="min-h-[46px] px-6 rounded-xl bg-ok-soft hover:bg-ok-soft text-ink font-label font-bold text-xs tracking-wide transition-all shadow-md flex-1 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <span>{isEn ? 'Start Using App' : 'Accéder à l’application'}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 3. Carte d'Explication Flottante & Barre de Contrôle Interactive */
        <div
          style={cardPositionStyle}
          className="absolute z-10 animate-in fade-in zoom-in-95 duration-200 transition-all"
        >
          <div className="bg-navy text-white rounded-2xl shadow-2xl border border-ink overflow-hidden backdrop-blur-md flex flex-col">
            {/* Ligne fine de progression du timer automatique */}
            <div className="w-full h-1.5 bg-navy-2 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-brand via-ok to-ok-soft transition-all duration-75"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>

            {/* En-tête de la carte : Numéro d'étape + Indicateur automatique + Bouton Fermer */}
            <div className="p-4 sm:p-5 pb-3 flex items-center justify-between border-b border-ink">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-ok-soft/15 text-ok-bright border border-ok-bright/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    {currentStep.icon}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-label font-bold tracking-wider uppercase text-ok-bright">
                      {isEn ? currentStep.badge.en : currentStep.badge.fr}
                    </span>
                    <span aria-hidden="true" className="text-ink-muted text-xs">·</span>
                    <span className="text-[11px] font-label text-on-navy-muted font-semibold">
                      {isEn ? `Step ${currentStepIndex + 1} of ${totalSteps}` : `Étape ${currentStepIndex + 1} sur ${totalSteps}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* État automatique / en pause & Bouton Quitter */}
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-label font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                  isPlaying ? 'bg-ok-soft/20 text-ok-bright' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-ok-soft animate-ping' : 'bg-amber-400'}`}></span>
                  <span>{isPlaying ? (isEn ? 'Auto' : 'Auto') : (isEn ? 'Paused' : 'En pause')}</span>
                </span>

                <button
                  type="button"
                  onClick={handleQuit}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title={isEn ? 'Exit tour (Esc)' : 'Quitter la visite (Échap)'}
                  aria-label={isEn ? 'Close tour' : 'Fermer la visite'}
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            </div>

            {/* Corps de la carte : Titre & Explication contextuelle */}
            <div className="p-4 sm:p-5 pt-3.5 flex flex-col gap-2">
              <h4 className="text-base sm:text-lg font-bold font-label text-white leading-snug">
                {isEn ? currentStep.title.en : currentStep.title.fr}
              </h4>

              <p className="text-xs sm:text-sm text-on-navy-muted leading-relaxed">
                {isEn ? currentStep.description.en : currentStep.description.fr}
              </p>

              {currentStep.details && (
                <p className="text-[11px] sm:text-xs text-ok-bright/90 bg-navy-2 p-2.5 rounded-xl border border-ink mt-1 leading-relaxed">
                  💡 {isEn ? currentStep.details.en : currentStep.details.fr}
                </p>
              )}
            </div>

            {/* Barre de Commandes Obligatoires : Précédent, Pause / Continuer, Suivant, Quitter */}
            <div className="p-3 sm:p-4 bg-navy-2 border-t border-ink flex items-center justify-between gap-2 flex-wrap">
              {/* Bouton Quitter discret à gauche */}
              <button
                type="button"
                onClick={handleQuit}
                className="px-3 py-2 rounded-xl text-[12px] font-label font-bold text-on-navy-muted hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
                <span>{isEn ? 'Exit' : 'Quitter'}</span>
              </button>

              {/* Bloc de commandes de navigation centrale */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* 1. Commande Précédent */}
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  className={`px-3 py-2 rounded-xl font-label font-semibold text-xs flex items-center gap-1 transition-all ${
                    currentStepIndex === 0
                      ? 'opacity-40 cursor-not-allowed text-ink-muted'
                      : 'bg-white/10 hover:bg-white/20 text-white cursor-pointer active:scale-95'
                  }`}
                  title={isEn ? 'Previous step (Left Arrow)' : 'Étape précédente (Flèche Gauche)'}
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span className="hidden sm:inline">{isEn ? 'Previous' : 'Précédent'}</span>
                </button>

                {/* 2. Commande Pause / Continuer (Bouton d'état central) */}
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className={`px-3.5 py-2 rounded-xl font-label font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 ${
                    isPlaying
                      ? 'bg-amber-400 hover:bg-amber-300 text-ink'
                      : 'bg-ok-soft hover:bg-ok-soft text-ink'
                  }`}
                  title={isEn ? 'Pause or Resume (Space)' : 'Mettre en pause ou reprendre (Espace)'}
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                  <span>
                    {isPlaying ? (isEn ? 'Pause' : 'Pause') : (isEn ? 'Continue' : 'Continuer')}
                  </span>
                </button>

                {/* 3. Commande Suivant / Passer */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-label font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                  title={isEn ? 'Next step (Right Arrow)' : 'Étape suivante (Flèche Droite)'}
                >
                  <span>{currentStepIndex === totalSteps - 1 ? (isEn ? 'Finish' : 'Terminer') : (isEn ? 'Next' : 'Suivant')}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
