import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/I18nContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { TabType } from '../types';
import { NAV_TABS } from './BottomNav';

interface HeaderProps {
  currentTitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenMenu: () => void;
  onOpenSettings?: () => void;
  profileMode?: 'simplified' | 'expert';
  onToggleProfileMode?: () => void;
  onOpenModeCrise?: () => void;
  currentTab?: TabType;
  isSubScreen?: boolean;
  onSelectTab?: (tab: TabType) => void;
}

/**
 * En-tête unifié NRBCOR
 * - Mobile : [Menu|Retour] [Logo + titre de page] … [statut réseau] [FR/EN] [CRISE]
 * - Desktop (≥ lg) : navigation principale intégrée ; fonctions secondaires regroupées dans le menu.
 */
export const Header: React.FC<HeaderProps> = ({
  currentTitle,
  showBack = false,
  onBack,
  onOpenMenu,
  onOpenSettings,
  profileMode = 'simplified',
  onToggleProfileMode,
  onOpenModeCrise,
  currentTab,
  isSubScreen = false,
  onSelectTab,
}) => {
  const { t } = useTranslation();
  const displayTitle = currentTitle || t('nav.home');
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
    };
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-card/90 backdrop-blur-xl pt-safe border-b border-line">
      <div data-tour="header-controls" className="ds-container h-16 flex items-center gap-2 lg:gap-4">
        {/* Gauche : menu / retour + identité */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 lg:flex-none">
          {showBack && onBack ? (
            <button
              aria-label={t('common.back')}
              onClick={onBack}
              className="ds-icon-btn shrink-0 -ml-1.5"
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]" aria-hidden="true">arrow_back</span>
            </button>
          ) : (
            <button
              aria-label={t('nav.openMenu')}
              onClick={onOpenMenu}
              className="ds-icon-btn shrink-0 -ml-1.5"
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]" aria-hidden="true">menu</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onSelectTab?.('accueil')}
            className="flex items-center gap-2 min-w-0 overflow-hidden rounded-lg cursor-pointer"
            aria-label={`NRBCOR — ${t('nav.home')}`}
          >
            <img alt="" aria-hidden="true" className="h-8 w-8 shrink-0" src="/icon.svg" />
            <span className="flex flex-col min-w-0 items-start leading-none max-[359px]:sr-only">
              <span className="text-[15px] font-extrabold tracking-[0.04em] text-ink">NRBCOR</span>
              <span className="text-[12px] font-medium text-ink-muted truncate max-w-[40vw] sm:max-w-[16rem] mt-1 lg:hidden">
                {displayTitle}
              </span>
              <span className="hidden lg:block text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-faint mt-1">
                {t('ui.brandTagline')}
              </span>
            </span>
          </button>
        </div>

        {/* Centre (desktop) : navigation principale */}
        {onSelectTab && (
          <nav aria-label={t('ui.mainNav')} className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {NAV_TABS.map((tab) => {
              const active = !isSubScreen && currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`h-10 px-2.5 xl:px-3 rounded-lg flex items-center gap-1.5 text-[14px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-tint text-ink'
                      : tab.isEmergency
                      ? 'text-danger-ink hover:bg-danger-soft'
                      : 'text-ink-muted hover:text-ink hover:bg-subtle'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[20px] hidden xl:inline-block"
                    aria-hidden="true"
                    style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {tab.icon}
                  </span>
                  <span>{t(tab.labelKey)}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Droite : statut, profil, langue, paramètres, CRISE */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span
            role="status"
            title={isOnline ? t('common.onlineBadge') : t('common.offlineBadge')}
            className={`ds-badge ${isOnline ? 'ds-badge-ok' : 'ds-badge-warn'} max-[379px]:hidden max-sm:px-1.5 max-sm:py-1.5`}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${isOnline ? 'bg-ok' : 'bg-warn'}`} aria-hidden="true"></span>
            <span className="hidden sm:inline">{isOnline ? t('common.online') : t('common.offline')}</span>
            <span className="sr-only sm:hidden">{isOnline ? t('common.online') : t('common.offline')}</span>
          </span>

          {onToggleProfileMode && (
            <button
              onClick={onToggleProfileMode}
              title={profileMode === 'simplified' ? t('header.profileSimplifiedTooltip') : t('header.profileExpertTooltip')}
              className="hidden 2xl:inline-flex h-9 px-2.5 rounded-lg items-center gap-1.5 text-[12.5px] font-semibold border border-line-strong text-ink hover:bg-subtle transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-brand-ink" aria-hidden="true">
                {profileMode === 'simplified' ? 'person' : 'school'}
              </span>
              <span>{profileMode === 'simplified' ? t('nav.simplified') : t('nav.expert')}</span>
            </button>
          )}

          <LanguageSwitcher variant="compact" />

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              title={t('nav.settings')}
              aria-label={t('nav.settings')}
              className="ds-icon-btn hidden md:inline-flex w-10 h-10"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">settings</span>
            </button>
          )}

          {onOpenModeCrise && (
            <button
              onClick={onOpenModeCrise}
              title={t('crisis.subtitle')}
              className="h-10 px-3 sm:px-3.5 rounded-xl bg-danger hover:bg-danger-strong text-white inline-flex items-center gap-1.5 text-[13px] font-extrabold tracking-wide uppercase transition-colors shadow-sm cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">emergency</span>
              <span>{t('nav.crisisButton')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
