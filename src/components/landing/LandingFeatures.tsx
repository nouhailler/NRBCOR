import React, { useState } from 'react';
import { LandingTranslations } from '../../i18n/landingTranslations';

interface LandingFeaturesProps {
  t: LandingTranslations;
  onLaunchApp: () => void;
}

export const LandingFeatures: React.FC<LandingFeaturesProps> = ({ t, onLaunchApp }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'urgence' | 'prep' | 'pedago'>('all');

  const filteredList = t.features.list.filter((item) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'urgence') return ['01', '03', '10'].includes(item.number);
    if (selectedFilter === 'prep') return ['04', '05', '06', '07'].includes(item.number);
    if (selectedFilter === 'pedago') return ['02', '08', '09'].includes(item.number);
    return true;
  });

  return (
    <section id="features" className="py-20 lg:py-28 bg-[#f8f9ff] text-[#001126] border-b border-[#e4efff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-xs font-['Space_Grotesk'] font-bold tracking-wider text-[#0036ce] uppercase mb-2 block">
            {t.features.kicker}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-['Space_Grotesk'] font-bold text-[#001126] tracking-tight mb-4 text-balance">
            {t.features.title}
          </h2>
          <p className="text-base text-[#44474d] leading-relaxed">
            {t.features.subtitle}
          </p>

          {/* Filtres interactifs (functional segmented buttons) */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-['Space_Grotesk'] font-bold transition-all cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-[#001126] text-white shadow-xs'
                  : 'bg-white text-[#44474d] hover:bg-[#e4efff] border border-[#c4c6ce]/60'
              }`}
            >
              Toutes les fonctions (10)
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('urgence')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-['Space_Grotesk'] font-bold transition-all cursor-pointer ${
                selectedFilter === 'urgence'
                  ? 'bg-[#ba1a1a] text-white shadow-xs'
                  : 'bg-white text-[#44474d] hover:bg-[#e4efff] border border-[#c4c6ce]/60'
              }`}
            >
              Urgence & Réflexes
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('prep')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-['Space_Grotesk'] font-bold transition-all cursor-pointer ${
                selectedFilter === 'prep'
                  ? 'bg-[#3f9d73] text-white shadow-xs'
                  : 'bg-white text-[#44474d] hover:bg-[#e4efff] border border-[#c4c6ce]/60'
              }`}
            >
              Préparation & Famille
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('pedago')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-['Space_Grotesk'] font-bold transition-all cursor-pointer ${
                selectedFilter === 'pedago'
                  ? 'bg-[#0036ce] text-white shadow-xs'
                  : 'bg-white text-[#44474d] hover:bg-[#e4efff] border border-[#c4c6ce]/60'
              }`}
            >
              Pédagogie & Formation
            </button>
          </div>
        </div>

        {/* Grille des 10 Fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredList.map((feat) => (
            <div
              key={feat.number}
              className="rounded-2xl bg-white border border-[#c4c6ce]/70 p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#0036ce]/40 transition-all group"
            >
              <div>
                {/* En-tête de carte avec numéro et icône */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="font-['Space_Grotesk'] text-xs font-extrabold text-[#74777e]">
                      {feat.number}.
                    </span>
                    <span className="text-xs text-[#0036ce] font-semibold font-['Space_Grotesk']">
                      {feat.tag}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-[#f8f9ff] text-[#0036ce] group-hover:bg-[#0036ce] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">{feat.icon}</span>
                  </div>
                </div>

                {/* Titre & Résumé */}
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-[#001126] mb-2 group-hover:text-[#0036ce] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs font-semibold text-[#3f9d73] mb-2.5 leading-snug">
                  {feat.summary}
                </p>
                <p className="text-xs text-[#44474d] leading-relaxed mb-4">
                  {feat.details}
                </p>
              </div>

              {/* Bouton d'action */}
              <button
                type="button"
                onClick={onLaunchApp}
                className="pt-3 border-t border-[#f0f4f9] text-xs font-['Space_Grotesk'] font-bold text-[#0036ce] hover:text-[#001126] flex items-center justify-between cursor-pointer"
              >
                <span>Tester dans l'application</span>
                <span className="material-symbols-outlined text-[15px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* Bannière d'appel à tester l'ensemble des modules */}
        <div className="rounded-2xl p-6 bg-white border border-[#c4c6ce] text-center max-w-2xl mx-auto shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <span className="material-symbols-outlined text-[32px] text-[#3f9d73] shrink-0">
              check_circle
            </span>
            <div>
              <h4 className="text-sm font-bold text-[#001126]">100% des 10 modules sont opérationnels</h4>
              <p className="text-xs text-[#74777e]">Aucun module fictif ni maquette non implémentée.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLaunchApp}
            className="px-5 py-2.5 rounded-xl bg-[#001126] hover:bg-[#12263f] text-white text-xs font-['Space_Grotesk'] font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0"
          >
            Ouvrir l'application
          </button>
        </div>
      </div>
    </section>
  );
};
