import React, { useState, useMemo } from 'react';
import { GlossaryTerm } from '../data/encyclopediaData';
import { getLocalizedEncyclopedia } from '../i18n/content/localizedEncyclopedia';
import { useTranslation } from '../i18n/I18nContext';
import { triggerHaptic } from '../utils/haptics';

interface EncyclopedieViewProps {
  onBack: () => void;
  initialTab?: 'histoire' | 'doctrines' | 'outils' | 'glossaire';
}

type TabKey = 'histoire' | 'doctrines' | 'outils' | 'glossaire';

export const EncyclopedieView: React.FC<EncyclopedieViewProps> = ({
  onBack,
  initialTab = 'glossaire'
}) => {
  const { language, t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [glossarySearch, setGlossarySearch] = useState('');
  const [glossaryCategory, setGlossaryCategory] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('all');
  const [expandedEra, setExpandedEra] = useState<string | null>('era-ww1');
  const [selectedCountryId, setSelectedCountryId] = useState<string>('france');
  const [expandedToolCategory, setExpandedToolCategory] = useState<string | null>('detection');
  const [expandedGlossaryId, setExpandedGlossaryId] = useState<string | null>(null);

  // Dynamic localized data according to active language
  const { glossaryTerms, historicalEras, countryDoctrines, toolCategories } = useMemo(
    () => getLocalizedEncyclopedia(language),
    [language]
  );

  // Alphabet pour le filtre rapide du glossaire
  const alphabet = useMemo(() => {
    const letters = new Set<string>();
    glossaryTerms.forEach((t) => {
      const first = t.term.trim()[0].toUpperCase();
      if (first >= 'A' && first <= 'Z') {
        letters.add(first);
      }
    });
    return Array.from(letters).sort();
  }, [glossaryTerms]);

  // Filtrage du glossaire
  const filteredGlossary = useMemo(() => {
    return glossaryTerms.filter((term) => {
      const q = glossarySearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        term.term.toLowerCase().includes(q) ||
        (term.acronym && term.acronym.toLowerCase().includes(q)) ||
        term.shortDef.toLowerCase().includes(q) ||
        term.fullDef.toLowerCase().includes(q);

      const matchesCat =
        glossaryCategory === 'all' || term.category === glossaryCategory;

      const firstLetter = term.term.trim()[0].toUpperCase();
      const matchesLetter =
        selectedLetter === 'all' || firstLetter === selectedLetter;

      return matchesSearch && matchesCat && matchesLetter;
    });
  }, [glossaryTerms, glossarySearch, glossaryCategory, selectedLetter]);

  const selectedCountry = useMemo(() => {
    return countryDoctrines.find((c) => c.id === selectedCountryId) || countryDoctrines[0];
  }, [countryDoctrines, selectedCountryId]);

  const handleTabChange = (tab: TabKey) => {
    triggerHaptic('light');
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isEn = language === 'en';

  return (
    <div className="flex-1 w-full bg-[#f8f9ff] text-[#001126] flex flex-col pb-28">
      {/* Top Header Editorial */}
      <div className="bg-[#001126] text-white px-4 pt-4 pb-5 border-b border-[#12263f]">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 text-[#98f6c5] hover:text-white transition-colors font-['Space_Grotesk'] text-[13px] font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>{t('common.back')}</span>
            </button>
            <div className="flex items-center gap-1.5 bg-[#98f6c5]/20 text-[#98f6c5] border border-[#98f6c5]/30 px-2 py-0.5 rounded-full font-['Space_Grotesk'] text-[10px] uppercase font-bold">
              <span className="material-symbols-outlined text-[14px]">local_library</span>
              <span>{isEn ? 'Encyclopedia & CBRN Knowledge' : 'Encyclopédie & Savoirs NRBC'}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#98f6c5] text-[26px]">menu_book</span>
              <h1 className="text-[22px] font-extrabold text-white tracking-tight">
                {t('encyclo.title')}
              </h1>
            </div>
            <p className="text-[12px] text-[#dce9fd] mt-1 leading-relaxed">
              {t('encyclo.subtitle')}
            </p>
          </div>

          {/* Onglets de navigation principaux */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-2 border-t border-white/10">
            {[
              { key: 'glossaire', label: t('encyclo.tabGlossary'), icon: 'spellcheck' },
              { key: 'histoire', label: t('encyclo.tabHistory'), icon: 'history_edu' },
              { key: 'doctrines', label: t('encyclo.tabDoctrines'), icon: 'public' },
              { key: 'outils', label: t('encyclo.tabTools'), icon: 'build' }
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key as TabKey)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg font-['Space_Grotesk'] text-[12px] font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-[#98f6c5] text-[#002c1b] shadow-sm'
                    : 'text-[#dce9fd] hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-3 sm:px-4 flex flex-col gap-5 mt-4">
        {/* ==================================================================== */}
        {/* 1. ONGLET GLOSSAIRE A-Z                                              */}
        {/* ==================================================================== */}
        {activeTab === 'glossaire' && (
          <div className="flex flex-col gap-4">
            {/* Barre de recherche & Filtres */}
            <div className="bg-white p-3.5 rounded-xl border border-[#c4c6ce] shadow-xs flex flex-col gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#74777e] text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder={t('encyclo.searchPlaceholder')}
                  className="w-full h-11 pl-10 pr-10 bg-[#f8f9ff] border border-[#c4c6ce] rounded-xl text-[14px] text-[#001126] placeholder-[#74777e] focus:outline-none focus:border-[#0036ce]"
                />
                {glossarySearch && (
                  <button
                    type="button"
                    onClick={() => setGlossarySearch('')}
                    className="absolute right-3 top-2.5 text-[#74777e] hover:text-[#001126]"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>

              {/* Filtres par catégorie */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: isEn ? 'All' : 'Tous' },
                  { id: 'chimique', label: isEn ? 'Chemical' : 'Chimique' },
                  { id: 'nucleaire', label: isEn ? 'Nuclear' : 'Nucléaire' },
                  { id: 'radiologique', label: isEn ? 'Radiological' : 'Radiologique' },
                  { id: 'biologique', label: isEn ? 'Biological' : 'Biologique' },
                  { id: 'materiel', label: isEn ? 'Gear & PPE' : 'Matériel & EPI' },
                  { id: 'secours', label: isEn ? 'Civil Rescue' : 'Secours' },
                  { id: 'reglementaire', label: isEn ? 'Doctrines' : 'Doctrines' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setGlossaryCategory(cat.id);
                    }}
                    className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-['Space_Grotesk'] font-bold border transition-colors cursor-pointer ${
                      glossaryCategory === cat.id
                        ? 'bg-[#001126] text-white border-[#001126]'
                        : 'bg-[#f8f9ff] text-[#44474d] border-[#c4c6ce] hover:border-[#001126]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Raccourcis alphabétiques */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1 border-t border-[#eef4ff]">
                <button
                  type="button"
                  onClick={() => setSelectedLetter('all')}
                  className={`w-7 h-7 rounded text-[11px] font-['Space_Grotesk'] font-bold shrink-0 transition-colors ${
                    selectedLetter === 'all'
                      ? 'bg-[#0036ce] text-white'
                      : 'text-[#74777e] hover:bg-[#eef4ff]'
                  }`}
                >
                  {isEn ? 'All' : 'Tous'}
                </button>
                {alphabet.map((letter) => (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedLetter(letter);
                    }}
                    className={`w-7 h-7 rounded text-[11px] font-['Space_Grotesk'] font-bold shrink-0 transition-colors ${
                      selectedLetter === letter
                        ? 'bg-[#0036ce] text-white'
                        : 'text-[#44474d] hover:bg-[#eef4ff]'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            {/* Compteur de résultats */}
            <div className="flex items-center justify-between px-1 text-[12px] font-['Space_Grotesk'] text-[#74777e]">
              <span>
                {filteredGlossary.length} {isEn ? (filteredGlossary.length > 1 ? 'terms indexed' : 'term indexed') : (filteredGlossary.length > 1 ? 'termes répertoriés' : 'terme répertorié')}
              </span>
              <span>Glossaire NRBCOR v2.5</span>
            </div>

            {/* Liste des cartes du glossaire */}
            <div className="flex flex-col gap-2.5">
              {filteredGlossary.map((term) => {
                const isExpanded = expandedGlossaryId === term.id;
                const categoryBadge =
                  term.category === 'chimique'
                    ? { bg: 'bg-[#ffdad6]', text: 'text-[#93000a]', label: isEn ? 'Chemical' : 'Chimique' }
                    : term.category === 'nucleaire'
                    ? { bg: 'bg-[#ffd8e4]', text: 'text-[#31111d]', label: isEn ? 'Nuclear' : 'Nucléaire' }
                    : term.category === 'radiologique'
                    ? { bg: 'bg-[#ffeedd]', text: 'text-[#7c2d12]', label: isEn ? 'Radiological' : 'Radiologique' }
                    : term.category === 'biologique'
                    ? { bg: 'bg-[#dcfce7]', text: 'text-[#14532d]', label: isEn ? 'Biological' : 'Biologique' }
                    : term.category === 'materiel'
                    ? { bg: 'bg-[#e0e7ff]', text: 'text-[#3730a3]', label: isEn ? 'Equipment' : 'Équipements' }
                    : term.category === 'secours'
                    ? { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]', label: isEn ? 'Civil Rescue' : 'Sécurité Civile' }
                    : { bg: 'bg-[#e2e8f0]', text: 'text-[#1e293b]', label: 'Doctrines' };

                return (
                  <div
                    key={term.id}
                    className="bg-white rounded-xl border border-[#c4c6ce] shadow-xs p-3.5 flex flex-col gap-2 transition-all hover:border-[#0036ce]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-[15px] font-bold text-[#001126]">
                            {term.term}
                          </h3>
                          <span
                            className={`font-['Space_Grotesk'] text-[10px] uppercase font-bold px-2 py-0.5 rounded ${categoryBadge.bg} ${categoryBadge.text}`}
                          >
                            {categoryBadge.label}
                          </span>
                        </div>
                        {term.acronym && (
                          <span className="text-[11px] font-['Space_Grotesk'] text-[#74777e] mt-0.5">
                            {term.acronym}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          setExpandedGlossaryId(isExpanded ? null : term.id);
                        }}
                        className="p-1 rounded-lg hover:bg-[#eef4ff] text-[#0036ce] transition-colors"
                        title={isExpanded ? (isEn ? 'Collapse' : 'Réduire') : (isEn ? 'Expand details' : 'Développer la notice')}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>
                    </div>

                    <p className="text-[13px] text-[#44474d] leading-relaxed">
                      {term.shortDef}
                    </p>

                    {isExpanded && (
                      <div className="pt-2 border-t border-[#eef4ff] flex flex-col gap-2.5 text-[12px] animate-in fade-in duration-150">
                        <div className="bg-[#f8f9ff] p-3 rounded-lg border border-[#e4efff] text-[#001126] leading-relaxed">
                          <strong>{t('encyclo.fullDefinition')} </strong>
                          {term.fullDef}
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="font-['Space_Grotesk'] text-[11px] font-bold text-[#74777e] uppercase">
                            {t('encyclo.contextApplication')}
                          </span>
                          <p className="text-[#44474d] leading-relaxed">
                            {term.contextUsage}
                          </p>
                        </div>

                        {term.historicalNote && (
                          <div className="p-2.5 bg-[#fef3c7] text-[#92400e] rounded-lg text-[11px] leading-relaxed flex items-start gap-1.5">
                            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">
                              history
                            </span>
                            <span>
                              <strong>{t('encyclo.historicalOrigin')}</strong> {term.historicalNote}
                            </span>
                          </div>
                        )}

                        {term.seeAlso && term.seeAlso.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-1">
                            <span className="font-['Space_Grotesk'] text-[10px] uppercase font-bold text-[#74777e]">
                              {t('encyclo.seeAlso')}
                            </span>
                            {term.seeAlso.map((relatedId) => {
                              const related = glossaryTerms.find((r) => r.id === relatedId);
                              if (!related) return null;
                              return (
                                <button
                                  key={relatedId}
                                  type="button"
                                  onClick={() => {
                                    triggerHaptic('light');
                                    setGlossarySearch(related.term);
                                    setExpandedGlossaryId(related.id);
                                  }}
                                  className="px-2 py-0.5 rounded bg-[#eef4ff] hover:bg-[#dce9fd] text-[#0036ce] font-['Space_Grotesk'] text-[11px] font-bold transition-colors cursor-pointer"
                                >
                                  {related.term}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredGlossary.length === 0 && (
                <div className="bg-white p-8 rounded-xl border border-[#c4c6ce] text-center flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-[36px] text-[#74777e]">search_off</span>
                  <span className="text-[14px] font-bold text-[#001126]">
                    {isEn ? 'No terms match your search' : 'Aucun terme ne correspond à votre recherche'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setGlossarySearch('');
                      setGlossaryCategory('all');
                      setSelectedLetter('all');
                    }}
                    className="mt-2 px-3 py-1.5 bg-[#001126] text-white rounded-lg text-[12px] font-['Space_Grotesk'] font-bold"
                  >
                    {isEn ? 'Reset filters' : 'Réinitialiser les filtres'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 2. ONGLET HISTOIRE & ORIGINES DU RISQUE NRBC                         */}
        {/* ==================================================================== */}
        {activeTab === 'histoire' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#001126] text-white p-4 rounded-xl border border-[#12263f] flex flex-col gap-2">
              <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-[#98f6c5]">
                {isEn ? 'Historical Perspective & Doctrinal Evolution' : 'Perspective Historique & Évolution Doctrinale'}
              </span>
              <h2 className="text-[18px] font-bold text-white">
                {isEn ? 'How Humanity Learned to Combat the Invisible' : "Comment l'Homme a Appris à Combattre l'Invisible"}
              </h2>
              <p className="text-[12px] text-[#dce9fd] leading-relaxed">
                {isEn
                  ? 'CBRN hazards emerged progressively from the chemical revolution (1915), nuclear physics (1945), industrial bio-manipulation (1970), and the acute vulnerability of modern urban societies.'
                  : "Le risque NRBC n'est pas né d'un seul bloc : il résulte de la rencontre successive de la révolution chimique (1915), de la physique nucléaire (1945), des manipulations biologiques industrielles (1970) et de la vulnérabilité des sociétés urbaines interconnectées."}
              </p>
            </div>

            {/* Liste chronologique des 4 grandes ères */}
            <div className="flex flex-col gap-3">
              {historicalEras.map((era) => {
                const isExpanded = expandedEra === era.id;

                return (
                  <div
                    key={era.id}
                    className="bg-white rounded-xl border border-[#c4c6ce] shadow-xs overflow-hidden transition-all"
                  >
                    <div
                      onClick={() => {
                        triggerHaptic('light');
                        setExpandedEra(isExpanded ? null : era.id);
                      }}
                      className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#f8f9ff] transition-colors"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-[#0036ce]">
                          {era.period}
                        </span>
                        <h3 className="text-[16px] font-bold text-[#001126]">
                          {era.title}
                        </h3>
                        <p className="text-[12px] text-[#74777e] mt-0.5 line-clamp-1">
                          {era.headline}
                        </p>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-[#eef4ff] text-[#0036ce] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">
                          {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-[#eef4ff] flex flex-col gap-3.5 mt-2 text-[13px]">
                        <p className="text-[#44474d] leading-relaxed bg-[#f8f9ff] p-3 rounded-lg border border-[#e4efff]">
                          {era.summary}
                        </p>

                        <div className="flex flex-col gap-3">
                          <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-[#001126] tracking-wide">
                            {isEn ? 'Landmark Events & Key Lessons Learned:' : 'Événements Fondateurs & Leçons Apprises :'}
                          </span>

                          <div className="space-y-3">
                            {era.keyEvents.map((evt, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-xl border border-[#c4c6ce] bg-white flex flex-col gap-2 relative pl-4 border-l-4 border-l-[#0036ce]"
                              >
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <span className="font-['Space_Grotesk'] text-[11px] font-bold text-[#ba1a1a]">
                                    {evt.year} • {evt.location}
                                  </span>
                                </div>
                                <h4 className="text-[14px] font-bold text-[#001126]">
                                  {evt.title}
                                </h4>
                                <p className="text-[12px] text-[#44474d] leading-relaxed">
                                  {evt.description}
                                </p>
                                <div className="p-2 bg-[#eef4ff] text-[#001126] rounded-lg text-[11px] leading-snug flex items-start gap-1.5 border border-[#dce9fd]">
                                  <span className="material-symbols-outlined text-[15px] text-[#0036ce] shrink-0 mt-0.5">
                                    psychology
                                  </span>
                                  <span>
                                    <strong>{isEn ? 'Tactical & doctrinal takeaway:' : 'Leçon tactique & doctrinale :'}</strong> {evt.lessonLearned}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 bg-[#e8f5e9] text-[#1b5e20] rounded-xl border border-[#c8e6c9] text-[12px] flex items-start gap-2">
                          <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
                            military_tech
                          </span>
                          <div>
                            <strong>{isEn ? 'Impact on security doctrine:' : 'Impact sur la doctrine de sécurité :'}</strong> {era.doctrinalImpact}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 3. ONGLET DOCTRINES PAR PAYS & ARMÉES                                */}
        {/* ==================================================================== */}
        {activeTab === 'doctrines' && (
          <div className="flex flex-col gap-4">
            {/* Sélecteur de pays */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-white p-1.5 rounded-xl border border-[#c4c6ce]">
              {countryDoctrines.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedCountryId(c.id);
                  }}
                  className={`flex-1 min-h-[42px] px-3 py-1.5 rounded-lg font-['Space_Grotesk'] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedCountryId === c.id
                      ? 'bg-[#001126] text-white shadow-sm'
                      : 'text-[#44474d] hover:bg-[#eef4ff]'
                  }`}
                >
                  <span className="text-[16px]">{c.flag}</span>
                  <span>{c.country}</span>
                </button>
              ))}
            </div>

            {/* Fiche détaillée du pays sélectionné */}
            <div className="bg-white rounded-xl border border-[#c4c6ce] shadow-sm p-4 sm:p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3 border-b border-[#eef4ff] pb-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[24px]">{selectedCountry.flag}</span>
                    <h2 className="text-[18px] font-bold text-[#001126]">
                      {isEn ? `${selectedCountry.country} Doctrine` : `Doctrine ${selectedCountry.country}`}
                    </h2>
                  </div>
                  <span className="font-['Space_Grotesk'] text-[12px] font-semibold text-[#0036ce] mt-0.5">
                    {selectedCountry.doctrineName}
                  </span>
                </div>
              </div>

              {/* Organisation & Posture */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
                <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#e4efff]">
                  <span className="font-['Space_Grotesk'] text-[10px] uppercase font-bold text-[#74777e] block mb-1">
                    {isEn ? 'Agencies & Command Structure:' : 'Organismes & Commandement :'}
                  </span>
                  <span className="font-semibold text-[#001126]">
                    {selectedCountry.organization}
                  </span>
                </div>
                <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#e4efff]">
                  <span className="font-['Space_Grotesk'] text-[10px] uppercase font-bold text-[#74777e] block mb-1">
                    {isEn ? 'Strategic Posture:' : 'Posture Stratégique :'}
                  </span>
                  <span className="text-[#44474d] leading-relaxed">
                    {selectedCountry.posture}
                  </span>
                </div>
              </div>

              {/* Piliers conceptuels */}
              <div className="flex flex-col gap-2">
                <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-[#001126]">
                  {isEn ? 'Key Concepts & National Specifics:' : 'Concepts Clés & Spécificités Nationales :'}
                </span>
                <div className="space-y-1.5">
                  {selectedCountry.keyConcepts.map((concept, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-[#eef4ff] text-[#001126] text-[12px] leading-relaxed flex items-start gap-2 border border-[#dce9fd]"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#0036ce] shrink-0 mt-0.5">
                        verified
                      </span>
                      <span>{concept}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modèle de Protection Civile */}
              <div className="p-3.5 bg-white rounded-xl border border-[#c4c6ce] flex flex-col gap-1.5">
                <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-[#ba1a1a] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">shield</span>
                  {isEn ? 'Civil Protection & Sheltering Architecture:' : 'Modèle de Protection Civile des Populations :'}
                </span>
                <p className="text-[12px] text-[#44474d] leading-relaxed">
                  {selectedCountry.civilProtectionModel}
                </p>
              </div>

              {/* Unités d'élite */}
              <div className="flex flex-col gap-1.5">
                <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-[#74777e]">
                  {isEn ? 'Primary Military & Specialized Units:' : 'Unités Militaires & Spécialisées Majeures :'}
                </span>
                <ul className="text-[12px] text-[#001126] space-y-1 pl-5 list-disc">
                  {selectedCountry.militaryUnits.map((u, i) => (
                    <li key={i} className="leading-snug">
                      {u}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Forces et limites */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#eef4ff] text-[12px]">
                <div className="p-3 bg-[#e8f5e9] rounded-xl border border-[#c8e6c9] flex flex-col gap-1">
                  <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-[#1b5e20] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">add_circle</span>
                    {isEn ? 'Strategic Strengths:' : 'Points Forts du Dispositif :'}
                  </span>
                  <ul className="space-y-1 text-[#2e7d32] pl-4 list-disc text-[11px]">
                    {selectedCountry.strengthsAndLimitations.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-[#fff3e0] rounded-xl border border-[#ffe0b2] flex flex-col gap-1">
                  <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-[#e65100] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">warning</span>
                    {isEn ? 'Limitations & Vulnerabilities:' : 'Limites & Vulnérabilités :'}
                  </span>
                  <ul className="space-y-1 text-[#b26a00] pl-4 list-disc text-[11px]">
                    {selectedCountry.strengthsAndLimitations.limitations.map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 4. ONGLET OUTILS & TECHNOLOGIES                                      */}
        {/* ==================================================================== */}
        {activeTab === 'outils' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#001126] text-white p-4 rounded-xl border border-[#12263f] flex flex-col gap-2">
              <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-[#98f6c5]">
                {isEn ? 'Technological Countermeasures & Gear' : 'Arsenal Technologique & Contre-Mesures'}
              </span>
              <h2 className="text-[18px] font-bold text-white">
                {isEn ? 'Survival Technologies Against the Invisible Hazard' : 'Les Armes de la Survie face au Péril Invisible'}
              </h2>
              <p className="text-[12px] text-[#dce9fd] leading-relaxed">
                {isEn
                  ? 'From Nikolai Zelinsky\'s 1915 activated carbon canister to modern laser Raman spectrometers, explore the physical and chemical principles developed to detect, filter, decontaminate, and treat.'
                  : 'De la cartouche de charbon actif de Nicolaï Zelinsky en 1915 aux spectromètres Raman à visée laser contemporains, découvrez le fonctionnement physique et chimique des outils créés pour détecter, filtrer, décontaminer et soigner.'}
              </p>
            </div>

            {/* Catégories d'outils */}
            <div className="flex flex-col gap-3">
              {toolCategories.map((cat) => {
                const isExpanded = expandedToolCategory === cat.id;

                return (
                  <div
                    key={cat.id}
                    className="bg-white rounded-xl border border-[#c4c6ce] shadow-xs overflow-hidden transition-all"
                  >
                    <div
                      onClick={() => {
                        triggerHaptic('light');
                        setExpandedToolCategory(isExpanded ? null : cat.id);
                      }}
                      className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#f8f9ff] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-[#eef4ff] ${cat.color} flex items-center justify-center shrink-0`}>
                          <span className="material-symbols-outlined text-[24px]">
                            {cat.icon}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-[15px] font-bold text-[#001126]">
                            {cat.name}
                          </h3>
                          <span className="text-[11px] text-[#74777e] line-clamp-1">
                            {cat.description}
                          </span>
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-[#f8f9ff] text-[#74777e] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">
                          {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-[#eef4ff] flex flex-col gap-4 mt-2">
                        <p className="text-[12px] text-[#44474d] leading-relaxed italic">
                          {cat.description}
                        </p>

                        <div className="space-y-3">
                          {cat.tools.map((tool, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl border border-[#c4c6ce] bg-[#f8f9ff] flex flex-col gap-2"
                            >
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <h4 className="text-[14px] font-bold text-[#001126]">
                                  {tool.name}
                                </h4>
                                <span className="font-['Space_Grotesk'] text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#001126] text-white">
                                  {tool.category}
                                </span>
                              </div>

                              <div className="text-[12px] text-[#44474d] leading-relaxed">
                                <strong>{isEn ? 'Operating Principle:' : 'Principe de fonctionnement : '}</strong>
                                {tool.principle}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                                <div className="p-2 bg-white rounded-lg border border-[#c4c6ce] text-[#001126]">
                                  <strong className="block text-[#0036ce] font-['Space_Grotesk']">
                                    {isEn ? 'Historical Inception:' : 'Genèse historique :'}
                                  </strong>
                                  <span>{tool.history}</span>
                                </div>
                                <div className="p-2 bg-[#ffdad6]/40 rounded-lg border border-[#ffdad6] text-[#93000a]">
                                  <strong className="block text-[#ba1a1a] font-['Space_Grotesk']">
                                    {isEn ? 'Operational Limits:' : 'Limites opérationnelles :'}
                                  </strong>
                                  <span>{tool.limits}</span>
                                </div>
                              </div>

                              {tool.civilianEquivalent && (
                                <div className="p-2 bg-[#eef4ff] text-[#001126] rounded-lg text-[11px] flex items-start gap-1.5 border border-[#dce9fd]">
                                  <span className="material-symbols-outlined text-[15px] text-[#0036ce] shrink-0 mt-0.5">
                                    person
                                  </span>
                                  <span>
                                    <strong>{isEn ? 'Civilian Equivalent / Application:' : 'Équivalent / Application civile :'}</strong> {tool.civilianEquivalent}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

