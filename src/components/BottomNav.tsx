import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { id: TabType; label: string; icon: string; isEmergency?: boolean }[] = [
    { id: 'accueil', label: 'Accueil', icon: 'home' },
    { id: 'reagir', label: 'Réagir', icon: 'emergency', isEmergency: true },
    { id: 'guides', label: 'Guides', icon: 'local_library' },
    { id: 'preparation', label: 'Préparation', icon: 'backpack' },
    { id: 'mon-plan', label: 'Mon Plan', icon: 'group' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#f8f9ff]/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.06)] border-t border-[#e4efff]">
      <div className="flex items-center justify-around h-16 px-1 max-w-4xl mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;

          if (tab.isEmergency) {
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                type="button"
                className={`flex flex-col items-center justify-center flex-1 h-full min-h-[48px] transition-all active:scale-95 ${
                  isActive ? 'text-[#ba1a1a] font-bold' : 'text-[#ba1a1a] hover:opacity-90'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-[24px]"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {tab.icon}
                  </span>
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse"></span>
                </div>
                <span className="font-['Space_Grotesk'] text-[11px] tracking-tight mt-0.5 text-[#ba1a1a] font-bold">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              type="button"
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[48px] transition-colors ${
                isActive
                  ? 'text-[#001126] font-semibold'
                  : 'text-[#44474d] hover:text-[#001126]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className="font-['Space_Grotesk'] text-[11px] tracking-tight mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
