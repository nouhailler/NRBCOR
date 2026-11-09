import React, { useState } from 'react';
import { PROTOCOLS_DATA, ProtocolData } from '../data/protocols';
import { SubScreen } from '../types';
import { ExportPdfModal } from '../components/ExportPdfModal';
import { PrintableGuideKey } from '../services/pdfExportService';

interface GuidesCatalogViewProps {
  onSelectProtocol: (id: 'bio' | 'chimique' | 'nucleaire' | 'confinement' | 'radiologique') => void;
  onOpenSubScreen: (screen: SubScreen) => void;
}

export const GuidesCatalogView: React.FC<GuidesCatalogViewProps> = ({
  onSelectProtocol,
  onOpenSubScreen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'n' | 'r' | 'b' | 'c'>('all');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportKey, setExportKey] = useState<PrintableGuideKey>('pack-complet');

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
    if (selectedFilter === 'r') return p.id === 'radiologique';
    return true;
  });

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 pt-20 lg:pt-24 pb-28 lg:pb-12 gap-4 max-w-xl lg:max-w-5xl mx-auto">
      {/* Offline sentinel */}
      <div className="bg-ok-deep text-ok-bright py-2 px-3 rounded-lg flex items-center justify-between border border-ok-ink">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="material-symbols-outlined text-[18px]">local_library</span>
          <span className="font-label text-[11px] uppercase font-bold tracking-wider truncate">
            Catalogue Officiel • 5 Protocoles Majeurs
          </span>
        </div>
        <span className="font-label text-[10px] bg-navy text-white px-2 py-0.5 rounded font-bold">
          100% DISPO
        </span>
      </div>

      {/* Header */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className="font-label text-[11px] px-2 py-0.5 rounded bg-navy-2 text-white uppercase font-bold tracking-wider">
            Doctrines Interministérielles
          </span>
        </div>
        <h1 className="text-[24px] text-ink font-bold tracking-tight">
          Guides & Fiches Réflexes NRBC
        </h1>
        <p className="text-[13px] text-ink-muted leading-relaxed">
          Consultez l'ensemble des protocoles opérationnels complets, validés par le SGDSN, la Sécurité Civile et Santé Publique France.
        </p>
      </header>

      {/* Printable Crisis Binder Card */}
      <div data-tour="guides-pack" className="bg-gradient-to-r from-navy to-navy-2 text-white p-4 rounded-xl shadow-md border border-ink flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-brand text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">menu_book</span>
            </div>
            <div>
              <span className="font-label text-[10px] uppercase font-bold text-ok-bright tracking-wider block">
                Sécurité Hors-Ligne & Classeur Papier
              </span>
              <h2 className="text-[15px] font-bold text-white leading-tight">
                Pack Guides Clés & Fiches Mémo
              </h2>
            </div>
          </div>
          <span className="font-label text-[10px] bg-white/10 text-white px-2 py-0.5 rounded font-bold uppercase shrink-0">
            PDF A4
          </span>
        </div>
        <p className="text-[12px] text-on-navy-soft leading-relaxed">
          En cas de black-out ou d'urgence cinétique, vos téléphones peuvent être déchargés ou inaccessibles. Imprimez vos fiches réflexes (Déshabillage 8 étapes, Fiche Iode, Confinement 4 piliers, Plan familial) pour votre classeur d'urgence.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setExportKey('pack-complet');
              setShowExportModal(true);
            }}
            className="flex-1 min-h-[44px] bg-ok-soft hover:bg-ok-soft text-ok-ink font-label text-[12px] uppercase font-bold px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span>Pack Complet 4-en-1</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setExportKey('deshabillage');
              setShowExportModal(true);
            }}
            className="min-h-[44px] bg-white/10 hover:bg-white/20 text-white font-label text-[11px] uppercase font-bold px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-white/20"
          >
            <span>Choisir un guide</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Bannière Découverte : Encyclopédie & Glossaire NRBC */}
      <div className="bg-card rounded-xl border-2 border-brand-ink/30 p-3.5 shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-ink text-[22px]">auto_stories</span>
            <span className="font-label text-[12px] font-bold text-ink uppercase">
              Encyclopédie & Glossaire des Risques NRBC
            </span>
          </div>
          <span className="font-label text-[10px] bg-subtle text-brand-ink px-2 py-0.5 rounded font-bold uppercase">
            Nouveau v2.5
          </span>
        </div>
        <p className="text-[12px] text-ink-muted leading-relaxed">
          Comprendre ce qu'est le risque NRBC, son histoire (d'Ypres 1915 à Fukushima et Novitchok), les doctrines des armées (France, Suisse, USA, Russie, Israël) et l'arsenal technologique développé pour le combattre.
        </p>
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => onOpenSubScreen({ type: 'encyclopedie', tab: 'histoire' })}
            className="p-2.5 rounded-lg bg-navy hover:bg-navy-2 text-white font-label text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-ok-bright">history_edu</span>
            <span>Histoire & Doctrines</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenSubScreen({ type: 'encyclopedie', tab: 'glossaire' })}
            className="p-2.5 rounded-lg bg-subtle hover:bg-tint text-brand-ink font-label text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 transition-colors border border-line cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">spellcheck</span>
            <span>Glossaire A-Z</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-3 text-ink-faint text-[20px]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un risque, iode, confinement, masque..."
          className="w-full h-12 pl-10 pr-4 bg-card border border-line-strong rounded-xl text-[14px] text-ink placeholder-ink-faint focus:outline-none focus:border-brand-ink shadow-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-3 text-ink-faint hover:text-ink"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Classification Quick Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'all', label: 'Tous (5)' },
          { id: 'b', label: 'B • Biologique' },
          { id: 'c', label: 'C • Chimique' },
          { id: 'n', label: 'N • Nucléaire' },
          { id: 'r', label: 'R • Radiologique' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setSelectedFilter(f.id as any)}
            className={`flex-shrink-0 min-h-[44px] px-3.5 py-1.5 rounded-full font-label text-[12px] font-bold transition-all ${
              selectedFilter === f.id
                ? 'bg-navy text-white shadow-sm'
                : 'bg-card hover:bg-tint text-ink-muted border border-line-strong'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Protocols List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map((proto: ProtocolData) => (
          <article
            key={proto.id}
            onClick={() => onSelectProtocol(proto.id)}
            className="bg-card rounded-xl shadow-sm border border-line-strong overflow-hidden hover:border-brand-ink transition-all cursor-pointer group"
          >
            <div className="relative w-full h-36 bg-navy-2">
              <img
                src={proto.imageUrl}
                alt={proto.imageAlt}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent flex flex-col justify-between p-3">
                <span className={`self-start px-2 py-0.5 rounded text-[10px] font-label uppercase font-bold ${proto.badgeBg} text-white`}>
                  {proto.badgeCriticality}
                </span>
                <span className="font-label text-[11px] text-on-navy-soft font-bold">
                  {proto.regulatoryBody}
                </span>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-2">
              <h3 className="text-[17px] font-bold text-ink leading-snug group-hover:text-brand-ink transition-colors">
                {proto.title}
              </h3>
              <p className="text-[13px] text-ink-muted line-clamp-2 leading-relaxed">
                {proto.subtitle}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-line text-[12px]">
                <div className="flex items-center gap-1.5 text-ok-ink font-label font-semibold">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>100% Hors-Ligne</span>
                </div>
                <div className="flex items-center gap-1 font-label text-brand-ink font-bold">
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
          <span className="material-symbols-outlined text-ink text-[20px]">handyman</span>
          <h2 className="text-[17px] text-ink font-bold">Procédures Opérationnelles Pas-à-Pas</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {/* Guide Déshabillage */}
          <div
            onClick={() => onOpenSubScreen({ type: 'deshabillage' })}
            role="button"
            tabIndex={0}
            className="p-3.5 bg-card rounded-xl shadow-sm border border-line-strong hover:border-ok-ink transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-ok-deep text-ok-bright flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">sanitizer</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label text-[13px] font-bold text-ink group-hover:text-ok-ink">
                  Déshabillage & Décontamination
                </span>
                <span className="font-label text-[10px] bg-ok-soft text-ok-ink px-1.5 py-0.5 rounded font-bold">
                  8 ÉTAPES
                </span>
              </div>
              <p className="text-[12px] text-ink-muted mt-0.5 line-clamp-2">
                Protocole sans dispersion : retrait des vêtements, double ensachage et minuteur de rinçage 15 min.
              </p>
            </div>
          </div>

          {/* Guide Confinement */}
          <div
            onClick={() => onOpenSubScreen({ type: 'confinement-guide' })}
            role="button"
            tabIndex={0}
            className="p-3.5 bg-card rounded-xl shadow-sm border border-line-strong hover:border-brand-ink transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">meeting_room</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label text-[13px] font-bold text-ink group-hover:text-brand-ink">
                  Guide Confinement Étanche
                </span>
                <span className="font-label text-[10px] bg-tint text-brand-ink px-1.5 py-0.5 rounded font-bold">
                  CALFEUTRAGE
                </span>
              </div>
              <p className="text-[12px] text-ink-muted mt-0.5 line-clamp-2">
                Checklist d'étanchéité, coupure VMC, choix de la pièce et simulateur d'autonomie en oxygène.
              </p>
            </div>
          </div>

          {/* Fiche Iode */}
          <div
            onClick={() => onOpenSubScreen({ type: 'iode' })}
            role="button"
            tabIndex={0}
            className="p-3.5 bg-card rounded-xl shadow-sm border border-line-strong hover:border-danger-ink transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-danger-soft text-danger-ink flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">medication</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label text-[13px] font-bold text-ink group-hover:text-danger-ink">
                  Fiche Iode Stable (KI 65mg)
                </span>
                <span className="font-label text-[10px] bg-danger-soft text-danger-ink px-1.5 py-0.5 rounded font-bold">
                  CALCULATEUR
                </span>
              </div>
              <p className="text-[12px] text-ink-muted mt-0.5 line-clamp-2">
                Posologie exacte par âge, fenêtres d'efficacité, règles légales et zones de distribution PPI.
              </p>
            </div>
          </div>

          {/* Sirène d'alerte */}
          <div
            onClick={() => onOpenSubScreen({ type: 'siren-guide' })}
            role="button"
            tabIndex={0}
            className="p-3.5 bg-card rounded-xl shadow-sm border border-line-strong hover:border-ink transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-navy-2 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">campaign</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label text-[13px] font-bold text-ink group-hover:text-ink">
                  Signaux d'Alerte RNA & FR-Alert
                </span>
                <span className="font-label text-[10px] bg-subtle text-brand-ink px-1.5 py-0.5 rounded font-bold">
                  AUDIO
                </span>
              </div>
              <p className="text-[12px] text-ink-muted mt-0.5 line-clamp-2">
                Simulateur acoustique des sirènes (Alerte, Fin d'alerte, Test mensuel) et fonctionnement FR-Alert.
              </p>
            </div>
          </div>

          {/* Guide Animaux de Compagnie */}
          <div
            onClick={() => onOpenSubScreen({ type: 'animaux' })}
            role="button"
            tabIndex={0}
            className="p-3.5 bg-card rounded-xl shadow-sm border border-line-strong hover:border-ok-ink transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-ok-deep text-ok-bright flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">pets</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label text-[13px] font-bold text-ink group-hover:text-ok-ink">
                  Animaux de Compagnie en Milieu NRBC
                </span>
                <span className="font-label text-[10px] bg-ok-soft text-ok-ink px-1.5 py-0.5 rounded font-bold">
                  VÉTÉRINAIRE
                </span>
              </div>
              <p className="text-[12px] text-ink-muted mt-0.5 line-clamp-2">
                Confinement, interdiction de l'iode humain, décontamination douce du pelage et règles CARE d'évacuation.
              </p>
            </div>
          </div>

          {/* Guide Cyber & Hybride */}
          <div
            onClick={() => onOpenSubScreen({ type: 'formation' })}
            role="button"
            tabIndex={0}
            className="p-3.5 bg-card rounded-xl shadow-sm border border-line-strong hover:border-brand-ink transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#6750a4] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">bolt</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label text-[13px] font-bold text-ink group-hover:text-brand-ink">
                  Crise Hybride : Blackout + Alerte NRBC
                </span>
                <span className="font-label text-[10px] bg-subtle text-[#21005d] px-1.5 py-0.5 rounded font-bold">
                  SCÉNARIO CYBER
                </span>
              </div>
              <p className="text-[12px] text-ink-muted mt-0.5 line-clamp-2">
                Piratage réseau, coupure 4G/5G, pompes à l'arrêt, radio France Bleu FM sur piles et proscription absolue des bougies.
              </p>
            </div>
          </div>

          {/* Carte Hors-Ligne des Périmètres */}
          <div
            onClick={() => onOpenSubScreen({ type: 'carte-perimetres' })}
            role="button"
            tabIndex={0}
            className="p-3.5 bg-card rounded-xl shadow-sm border border-line-strong hover:border-brand-ink transition-all cursor-pointer flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-navy text-ok-bright flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">radar</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label text-[13px] font-bold text-ink group-hover:text-brand-ink">
                  Carte Hors-Ligne des Périmètres
                </span>
                <span className="font-label text-[10px] bg-ok-soft text-ok-ink px-1.5 py-0.5 rounded font-bold">
                  RADAR PPI
                </span>
              </div>
              <p className="text-[12px] text-ink-muted mt-0.5 line-clamp-2">
                19 CNPE nucléaires et 22 sites Seveso Seuil Haut. Calcul géodésique local immédiat sans réseau.
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
          className="p-3 bg-card rounded-xl shadow-sm border border-line-strong text-left hover:bg-subtle transition-colors flex items-center gap-2 min-h-[52px]"
        >
          <span className="material-symbols-outlined text-brand-ink text-[22px]">map</span>
          <div className="min-w-0">
            <span className="font-label text-[12px] font-bold text-ink uppercase block truncate">
              Géorisques
            </span>
            <span className="text-[11px] text-ink-muted">Carte & TMD</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onOpenSubScreen({ type: 'formation' })}
          className="p-3 bg-card rounded-xl shadow-sm border border-line-strong text-left hover:bg-subtle transition-colors flex items-center gap-2 min-h-[52px]"
        >
          <span className="material-symbols-outlined text-ok-ink text-[22px]">school</span>
          <div className="min-w-0">
            <span className="font-label text-[12px] font-bold text-ink uppercase block truncate">
              Entraînement
            </span>
            <span className="text-[11px] text-ink-muted">Exercices & Quiz</span>
          </div>
        </button>
      </section>

      {/* Modal Export PDF */}
      <ExportPdfModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        initialGuideKey={exportKey}
      />
    </div>
  );
};
