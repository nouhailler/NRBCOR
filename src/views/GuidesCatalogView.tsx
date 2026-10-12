import React, { useState } from 'react';
import { PROTOCOLS_DATA, ProtocolData } from '../data/protocols';
import { SubScreen } from '../types';

interface GuidesCatalogViewProps {
  onSelectProtocol: (id: 'bio' | 'chimique' | 'nucleaire' | 'confinement') => void;
  onOpenSubScreen: (screen: SubScreen) => void;
}

export const GuidesCatalogView: React.FC<GuidesCatalogViewProps> = ({
  onSelectProtocol,
  onOpenSubScreen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'n' | 'r' | 'b' | 'c'>('all');

  const protocolsList = Object.values(PROTOCOLS_DATA);

  const filtered = protocolsList.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.regulatoryBody.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'b') return p.id === 'bio';
    if (selectedFilter === 'c') return p.id === 'chimique';
    if (selectedFilter === 'n') return p.id === 'nucleaire';
    if (selectedFilter === 'r') return p.id === 'nucleaire' || p.id === 'confinement';
    return true;
  });

  return (
    <div className="flex flex-col w-full px-4 pt-24 pb-28 gap-4 max-w-xl mx-auto">
      {/* Offline sentinel */}
      <div className="bg-[#002c1b] text-[#98f6c5] py-2 px-3 rounded-lg flex items-center justify-between border border-[#005236]">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="material-symbols-outlined text-[18px]">local_library</span>
          <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold tracking-wider truncate">
            Catalogue Officiel • 4 Protocoles Majeurs
          </span>
        </div>
        <span className="font-['Space_Grotesk'] text-[10px] bg-[#001126] text-white px-2 py-0.5 rounded font-bold">
          100% DISPO
        </span>
      </div>

      {/* Header */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className="font-['Space_Grotesk'] text-[11px] px-2 py-0.5 rounded bg-[#12263f] text-white uppercase font-bold tracking-wider">
            Doctrines Interministérielles
          </span>
        </div>
        <h1 className="text-[24px] text-[#001126] font-bold tracking-tight">
          Guides & Fiches Réflexes NRBC
        </h1>
        <p className="text-[13px] text-[#44474d] leading-relaxed">
          Consultez l'ensemble des protocoles opérationnels complets, validés par le SGDSN, la Sécurité Civile et Santé Publique France.
        </p>
      </header>

      {/* Search Input */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-3 text-[#74777e] text-[20px]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un risque, iode, confinement, masque..."
          className="w-full h-12 pl-10 pr-4 bg-white border border-[#c4c6ce] rounded-xl text-[14px] text-[#001126] placeholder-[#74777e] focus:outline-none focus:border-[#0036ce] shadow-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-3 text-[#74777e] hover:text-[#001126]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Classification Quick Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'all', label: 'Tous (4)' },
          { id: 'b', label: 'B • Biologique' },
          { id: 'c', label: 'C • Chimique' },
          { id: 'n', label: 'N • Nucléaire' },
          { id: 'r', label: 'R • Radiologique' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setSelectedFilter(f.id as any)}
            className={`flex-shrink-0 min-h-[44px] px-3.5 py-1.5 rounded-full font-['Space_Grotesk'] text-[12px] font-bold transition-all ${
              selectedFilter === f.id
                ? 'bg-[#001126] text-white shadow-sm'
                : 'bg-white hover:bg-[#e4efff] text-[#44474d] border border-[#c4c6ce]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Protocols List */}
      <div className="flex flex-col gap-3">
        {filtered.map((proto: ProtocolData) => (
          <article
            key={proto.id}
            onClick={() => onSelectProtocol(proto.id)}
            className="bg-white rounded-xl shadow-sm border border-[#c4c6ce] overflow-hidden hover:border-[#0036ce] transition-all cursor-pointer group"
          >
            <div className="relative w-full h-36 bg-[#12263f]">
              <img
                src={proto.imageUrl}
                alt={proto.imageAlt}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001126]/90 via-transparent to-transparent flex flex-col justify-between p-3">
                <span className={`self-start px-2 py-0.5 rounded text-[10px] font-['Space_Grotesk'] uppercase font-bold ${proto.badgeBg} text-white`}>
                  {proto.badgeCriticality}
                </span>
                <span className="font-['Space_Grotesk'] text-[11px] text-[#dce9fd] font-bold">
                  {proto.regulatoryBody}
                </span>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-2">
              <h3 className="text-[17px] font-bold text-[#001126] leading-snug group-hover:text-[#0036ce] transition-colors">
                {proto.title}
              </h3>
              <p className="text-[13px] text-[#44474d] line-clamp-2 leading-relaxed">
                {proto.subtitle}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-[#e4efff] text-[12px]">
                <div className="flex items-center gap-1.5 text-[#3f9d73] font-['Space_Grotesk'] font-semibold">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>100% Hors-Ligne</span>
                </div>
                <div className="flex items-center gap-1 font-['Space_Grotesk'] text-[#0036ce] font-bold">
                  <span>Consulter la fiche</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Guides Pratiques & Procédures Pas-à-Pas */}
      <section className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-1.5 px-1">
          <span className="material-symbols-outlined text-[#001126] text-[20px]">handyman</span>
          <h2 className="text-[17px] text-[#001126] font-bold">Procédures Opérationnelles Pas-à-Pas</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {/* Guide Déshabillage */}
          <div
            onClick={() => onOpenSubScreen({ type: 'deshabillage' })}
            role="button"
            tabIndex={0}
            className="p-3.5 bg-white rounded-xl shadow-sm border border-[#c4c6ce] hover:border-[#002c1b] transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#002c1b] text-[#98f6c5] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">sanitizer</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-['Space_Grotesk'] text-[13px] font-bold text-[#001126] group-hover:text-[#002c1b]">
                  Déshabillage & Décontamination
                </span>
                <span className="font-['Space_Grotesk'] text-[10px] bg-[#98f6c5] text-[#005236] px-1.5 py-0.5 rounded font-bold">
                  8 ÉTAPES
                </span>
              </div>
              <p className="text-[12px] text-[#44474d] mt-0.5 line-clamp-2">
                Protocole sans dispersion : retrait des vêtements, double ensachage et minuteur de rinçage 15 min.
              </p>
            </div>
          </div>

          {/* Guide Confinement */}
          <div
            onClick={() => onOpenSubScreen({ type: 'confinement-guide' })}
            role="button"
            tabIndex={0}
            className="p-3.5 bg-white rounded-xl shadow-sm border border-[#c4c6ce] hover:border-[#0036ce] transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0036ce] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">meeting_room</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-['Space_Grotesk'] text-[13px] font-bold text-[#001126] group-hover:text-[#0036ce]">
                  Guide Confinement Étanche
                </span>
                <span className="font-['Space_Grotesk'] text-[10px] bg-[#dee1ff] text-[#001258] px-1.5 py-0.5 rounded font-bold">
                  CALFEUTRAGE
                </span>
              </div>
              <p className="text-[12px] text-[#44474d] mt-0.5 line-clamp-2">
                Checklist d'étanchéité, coupure VMC, choix de la pièce et simulateur d'autonomie en oxygène.
              </p>
            </div>
          </div>

          {/* Fiche Iode */}
          <div
            onClick={() => onOpenSubScreen({ type: 'iode' })}
            role="button"
            tabIndex={0}
            className="p-3.5 bg-white rounded-xl shadow-sm border border-[#c4c6ce] hover:border-[#ba1a1a] transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">medication</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-['Space_Grotesk'] text-[13px] font-bold text-[#001126] group-hover:text-[#ba1a1a]">
                  Fiche Iode Stable (KI 65mg)
                </span>
                <span className="font-['Space_Grotesk'] text-[10px] bg-[#ffdad6] text-[#ba1a1a] px-1.5 py-0.5 rounded font-bold">
                  CALCULATEUR
                </span>
              </div>
              <p className="text-[12px] text-[#44474d] mt-0.5 line-clamp-2">
                Posologie exacte par âge, fenêtres d'efficacité, règles légales et zones de distribution PPI.
              </p>
            </div>
          </div>

          {/* Sirène d'alerte */}
          <div
            onClick={() => onOpenSubScreen({ type: 'siren-guide' })}
            role="button"
            tabIndex={0}
            className="p-3.5 bg-white rounded-xl shadow-sm border border-[#c4c6ce] hover:border-[#001126] transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#12263f] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">campaign</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-['Space_Grotesk'] text-[13px] font-bold text-[#001126] group-hover:text-[#001126]">
                  Signaux d'Alerte RNA & FR-Alert
                </span>
                <span className="font-['Space_Grotesk'] text-[10px] bg-[#eef4ff] text-[#0036ce] px-1.5 py-0.5 rounded font-bold">
                  AUDIO
                </span>
              </div>
              <p className="text-[12px] text-[#44474d] mt-0.5 line-clamp-2">
                Simulateur acoustique des sirènes (Alerte, Fin d'alerte, Test mensuel) et fonctionnement FR-Alert.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Auxiliary Nav Links */}
      <section className="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onOpenSubScreen({ type: 'georisques' })}
          className="p-3 bg-white rounded-xl shadow-sm border border-[#c4c6ce] text-left hover:bg-[#eef4ff] transition-colors flex items-center gap-2 min-h-[52px]"
        >
          <span className="material-symbols-outlined text-[#0036ce] text-[22px]">map</span>
          <div className="min-w-0">
            <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] uppercase block truncate">
              Géorisques
            </span>
            <span className="text-[11px] text-[#44474d]">Carte & TMD</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onOpenSubScreen({ type: 'formation' })}
          className="p-3 bg-white rounded-xl shadow-sm border border-[#c4c6ce] text-left hover:bg-[#eef4ff] transition-colors flex items-center gap-2 min-h-[52px]"
        >
          <span className="material-symbols-outlined text-[#3f9d73] text-[22px]">school</span>
          <div className="min-w-0">
            <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] uppercase block truncate">
              Entraînement
            </span>
            <span className="text-[11px] text-[#44474d]">Exercices & Quiz</span>
          </div>
        </button>
      </section>
    </div>
  );
};
