import React from 'react';
import { TabType } from '../types';
import { useTranslation } from '../i18n/I18nContext';

export const NAV_TABS: { id: TabType; labelKey: string; icon: string; isEmergency?: boolean }[] = [
  { id: 'accueil', labelKey: 'nav.home', icon: 'home' },
  { id: 'reagir', labelKey: 'nav.react', icon: 'emergency', isEmergency: true },
  { id: 'guides', labelKey: 'nav.guides', icon: 'local_library' },
  { id: 'preparation', labelKey: 'nav.prep', icon: 'backpack' },
  { id: 'mon-plan', labelKey: 'nav.myPlan', icon: 'group' },
];

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isSubScreen?: boolean;
}

/**
 * Navigation inférieure (mobile & tablette). Masquée à partir de lg :
 * la navigation principale est alors intégrée à l'en-tête.
 */
export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab, isSubScreen = false }) => {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t('ui.mainNav')}
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 pb-safe bg-card/95 backdrop-blur-xl border-t border-line"
    >
      <div className="flex items-stretch justify-around h-16 px-1 max-w-2xl mx-auto">
        {NAV_TABS.map((tab) => {
          const isActive = !isSubScreen && currentTab === tab.id;
          const color = tab.isEmergency
            ? 'text-danger-ink'
            : isActive
            ? 'text-brand-ink'
            : 'text-ink-muted hover:text-ink';
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center flex-1 min-w-0 gap-0.5 transition-colors cursor-pointer ${color}`}
            >
              <span
                className={`flex items-center justify-center h-7 w-12 rounded-full transition-colors ${
                  isActive ? (tab.isEmergency ? 'bg-danger-soft' : 'bg-tint') : ''
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  aria-hidden="true"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {tab.icon}
                </span>
              </span>
              <span className={`text-[11px] max-[359px]:text-[10px] max-[359px]:tracking-tight leading-tight truncate max-w-full ${isActive || tab.isEmergency ? 'font-bold' : 'font-medium'}`}>
                {t(tab.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
