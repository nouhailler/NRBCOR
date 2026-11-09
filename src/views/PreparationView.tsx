import React, { useState, useMemo } from 'react';
import { KitItem, SubScreen, TabType } from '../types';
import { getLocalizedKitCategories, getLocalizedKitItems } from '../i18n/content/localizedKit';
import { useTranslation } from '../i18n/I18nContext';
import { Tooltip } from '../components/Tooltip';
import { SuisJePretView } from './SuisJePretView';

interface PreparationViewProps {
  items: KitItem[];
  onToggleItem: (id: string) => void;
  onResetItems: () => void;
  onAddItem: (item: KitItem) => void;
  onOpenInventory?: () => void;
  onNavigateTab?: (tab: TabType) => void;
  onOpenSubScreen?: (screen: SubScreen) => void;
  defaultMode?: 'suis-je-pret' | 'kit';
}

export const PreparationView: React.FC<PreparationViewProps> = ({
  items,
  onToggleItem,
  onResetItems,
  onAddItem,
  onOpenInventory,
  onNavigateTab,
  onOpenSubScreen,
  defaultMode = 'suis-je-pret',
}) => {
  const { language, t } = useTranslation();
  const isEn = language === 'en';

  const [viewMode, setViewMode] = useState<'suis-je-pret' | 'kit'>(defaultMode);
  const [peopleCount, setPeopleCount] = useState<number>(3);
  const [durationDays, setDurationDays] = useState<number>(3);
  const [filterMode, setFilterMode] = useState<'all' | 'todo'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(1);

  // Localized categories and items
  const kitCategories = useMemo(() => getLocalizedKitCategories(language), [language]);
  const localizedItems = useMemo(() => getLocalizedKitItems(items, language), [items, language]);

  // Dynamic calculations
  const totalWaterLitres = peopleCount * 3 * durationDays;
  const totalRations = peopleCount * durationDays;

  const totalItems = localizedItems.length;
  const completedCount = localizedItems.filter((it) => it.completed).length;
  const missingCount = totalItems - completedCount;
  const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const filteredItems = filterMode === 'all' ? localizedItems : localizedItems.filter((it) => !it.completed);

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: KitItem = {
      id: `custom-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      subtitle: isEn ? 'Custom household item added by user.' : 'Article personnalisé ajouté par le foyer.',
      tag: isEn ? 'Custom' : 'Personnalisé',
      completed: false,
    };
    onAddItem(newItem);
    setNewTitle('');
    setShowAddModal(false);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const switcher = (
    <div className="flex items-center gap-1.5 bg-subtle p-1.5 rounded-xl border border-line-strong">
      <button
        type="button"
        onClick={() => setViewMode('suis-je-pret')}
        className={`flex-1 min-h-[42px] px-3 rounded-lg font-label text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all ${
          viewMode === 'suis-je-pret'
            ? 'bg-navy text-white shadow-xs'
            : 'text-ink-muted hover:text-ink hover:bg-white/60'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">speed</span>
        <span>{t('readiness.title')}</span>
      </button>

      <button
        type="button"
        onClick={() => setViewMode('kit')}
        className={`flex-1 min-h-[42px] px-3 rounded-lg font-label text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all ${
          viewMode === 'kit'
            ? 'bg-navy text-white shadow-xs'
            : 'text-ink-muted hover:text-ink hover:bg-white/60'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">backpack</span>
        <span>
          {isEn
            ? `Detailed 72h Kit (${completedCount}/${totalItems})`
            : `Kit 72h détaillé (${completedCount}/${totalItems})`}
        </span>
      </button>
    </div>
  );

  if (viewMode === 'suis-je-pret') {
    return (
      <SuisJePretView
        items={localizedItems}
        onToggleItem={onToggleItem}
        onOpenInventory={onOpenInventory}
        onNavigateTab={onNavigateTab}
        onOpenSubScreen={onOpenSubScreen}
        headerSlot={switcher}
      />
    );
  }

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 pt-20 lg:pt-24 pb-28 lg:pb-12 gap-4 max-w-xl lg:max-w-5xl mx-auto">
      {/* Sélecteur de vue : Suis-je prêt ? vs Kit détaillé */}
      {switcher}

      {/* Sentinel Bandeau Hors-Ligne & Souveraineté Locale */}
      <div className="py-2.5 px-3 bg-tint text-ink flex items-center justify-between gap-2 rounded-lg border border-line">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="material-symbols-outlined text-ok-ink text-[18px] flex-shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            cloud_off
          </span>
          <span className="font-label text-[11px] font-semibold truncate text-ink">
            {isEn ? '100% Local Storage (IndexedDB) • Zero data sent' : 'Stockage 100% local (IndexedDB) • Aucune donnée transmise'}
          </span>
        </div>
        <span className="font-label text-[11px] bg-ok-soft text-ok-ink px-2 py-0.5 rounded font-bold uppercase flex-shrink-0">
          {isEn ? 'Encrypted' : 'Chiffré'}
        </span>
      </div>

      {/* En-tête contextuel */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className="font-label text-[11px] text-brand-ink font-bold tracking-wider uppercase">
            Section 4.7 • Résilience Citoyenne
          </span>
        </div>
        <h1 className="text-[24px] text-ink font-bold tracking-tight">
          Kit d'urgence 72h
        </h1>
        <p className="text-[13px] text-ink-muted leading-relaxed">
          Autonomie et résilience logistique du foyer en situation de rupture d'approvisionnement.
        </p>

        {/* Note Méthodologique Officielle */}
        <div className="mt-2 p-3 bg-card rounded-xl shadow-sm flex items-start gap-2.5 border border-line-strong">
          <span className="material-symbols-outlined text-ink text-[20px] flex-shrink-0 mt-0.5">
            verified_user
          </span>
          <p className="text-[12px] text-ink-muted leading-relaxed">
            <strong className="font-semibold text-ink">Objectif indicatif :</strong> Basé sur les protocoles officiels de la Sécurité Civile et du portail <span className="font-semibold text-ink">Info.gouv.fr</span>. Vise une autonomie minimale de 72 heures sans substitution des prescriptions médicales personnelles.
          </p>
        </div>
      </header>

      {/* Calculateur Paramétrique Interactif */}
      <section className="bg-card p-4 rounded-xl shadow-sm border border-line-strong flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-label text-[12px] uppercase tracking-wider text-ink font-bold">
            Configuration du foyer
          </span>
          <span className="font-label text-[11px] text-ink-muted font-medium">
            Variables ajustables
          </span>
        </div>

        {/* Sélecteur Taille de Foyer */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] text-ink font-medium">
              Personnes à charge :
            </span>
            <span className="font-label text-[13px] text-ink font-bold">
              {peopleCount} {peopleCount > 1 ? 'personnes' : 'personne'}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setPeopleCount(val)}
                className={`min-h-[48px] flex items-center justify-center font-label text-[13px] rounded-lg transition-colors ${
                  peopleCount === val
                    ? 'bg-navy text-white font-bold shadow-sm'
                    : 'bg-subtle text-ink hover:bg-tint'
                }`}
              >
                {val === 5 ? '5+' : val}
              </button>
            ))}
          </div>
        </div>

        {/* Sélecteur Durée */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] text-ink font-medium">
              Durée de coupure visée :
            </span>
            <span className="font-label text-[13px] text-brand-ink font-bold">
              {durationDays === 2 ? '48 Heures (2 jours)' : durationDays === 3 ? '72 Heures (3 jours)' : '7 Jours'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { days: 2, label: '48 Heures' },
              { days: 3, label: '72 Heures' },
              { days: 7, label: '7 Jours' },
            ].map((d) => (
              <button
                key={d.days}
                type="button"
                onClick={() => setDurationDays(d.days)}
                className={`min-h-[48px] flex items-center justify-center font-label text-[12px] rounded-lg transition-colors ${
                  durationDays === d.days
                    ? 'bg-navy text-white font-bold shadow-sm'
                    : 'bg-subtle text-ink hover:bg-tint'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rations Calculées */}
        <div className="grid grid-cols-1 gap-2 pt-1">
          <div className="p-3 bg-subtle rounded-lg flex items-center gap-3 border border-line">
            <div className="w-10 h-10 rounded-lg bg-tint text-brand-ink flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">water_drop</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-label text-[11px] uppercase font-semibold text-ink-muted">
                    Eau Vitale Recommandée
                  </span>
                  <Tooltip
                    title="Norme Sécurité Civile (3L/jour/personne)"
                    content="Prévoir au minimum 2 litres pour l'hydratation quotidienne vitale et 1 litre pour l'hygiène minimale ou la réhydratation alimentaire. Stocker en bouteilles scellées fermées à l'abri de la lumière."
                  />
                </div>
                <span className="font-label text-[15px] text-ink font-bold">
                  {totalWaterLitres} Litres
                </span>
              </div>
              <p className="text-[11px] text-ink-muted truncate mt-0.5">
                3L / jour / pers (1,5L boisson + 1,5L hygiène/cuisson)
              </p>
            </div>
          </div>

          <div className="p-3 bg-subtle rounded-lg flex items-center gap-3 border border-line">
            <div className="w-10 h-10 rounded-lg bg-tint text-ink flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">inventory_2</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-label text-[11px] uppercase font-semibold text-ink-muted">
                    Alimentation De Survie
                  </span>
                  <Tooltip
                    title="Aliments sans cuisson"
                    content="Privilégier les conserves à ouverture facile (sans ouvre-boîte), barres énergétiques, fruits secs et repas prêts à consommer froids sans gaz ni électricité."
                  />
                </div>
                <span className="font-label text-[15px] text-ink font-bold">
                  {totalRations} Rations
                </span>
              </div>
              <p className="text-[11px] text-ink-muted truncate mt-0.5">
                Conserves non périssables, repas lyophilisés, fruits secs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Barre de Progression Globale Dynamique */}
      <section className="bg-navy-2 p-4 rounded-xl text-white shadow-sm border border-ink">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-ok-bright text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              task_alt
            </span>
            <span className="font-label text-[12px] font-bold tracking-wide uppercase text-white">
              État de Préparation
            </span>
          </div>
          <span className="font-label text-[16px] font-bold text-ok-bright">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden mb-2">
          <div
            className="bg-ok-soft h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between text-brand-bright font-label text-[11px]">
          <span>{completedCount} sur {totalItems} éléments opérationnels</span>
          <span className="uppercase text-ok-bright font-bold tracking-wider">
            {missingCount} Manquants
          </span>
        </div>
      </section>

      {/* Raccourci vers Écran G : Inventaire & Péremptions */}
      {onOpenInventory && (
        <button
          onClick={onOpenInventory}
          type="button"
          className="p-3 bg-subtle hover:bg-tint rounded-xl border border-line flex items-center justify-between gap-2 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-navy text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">inventory</span>
            </span>
            <div>
              <span className="font-label text-[12px] font-bold text-ink block">
                Inventaire Détaillé & Dates de Péremption
              </span>
              <span className="text-[11px] text-ink-muted">
                Suivi des lots, unités stockées et alertes à renouveler (Écran G)
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-brand-ink text-[20px]">arrow_forward</span>
        </button>
      )}

      {/* Filtres d'affichage & Ajout d'article */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-1">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`min-h-[48px] px-3 rounded-lg font-label text-[11px] uppercase font-bold flex-1 flex items-center justify-center transition-colors ${
              filterMode === 'all'
                ? 'bg-navy text-white shadow-sm'
                : 'bg-tint text-ink-muted hover:text-ink'
            }`}
          >
            {isEn ? `All (${totalItems})` : `Tout (${totalItems})`}
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('todo')}
            className={`min-h-[48px] px-3 rounded-lg font-label text-[11px] uppercase font-bold flex-1 flex items-center justify-center transition-colors ${
              filterMode === 'todo'
                ? 'bg-navy text-white shadow-sm'
                : 'bg-tint text-ink-muted hover:text-ink'
            }`}
          >
            {isEn ? `To Complete (${missingCount})` : `À compléter (${missingCount})`}
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          title={isEn ? 'Add custom item' : 'Ajouter un article personnalisé'}
          className="min-h-[48px] w-12 rounded-lg bg-tint hover:bg-tint text-ink flex items-center justify-center flex-shrink-0 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>
      </div>

      {/* Catégories Normées avec Checkbox Touch-Friendly */}
      <div className="flex flex-col gap-4">
        {kitCategories.map((cat) => {
          const categoryItems = filteredItems.filter((it) => it.category === cat.id);
          if (categoryItems.length === 0 && filterMode === 'todo') return null;

          return (
            <div key={cat.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between pb-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-brand-ink text-[20px]">
                    {cat.icon}
                  </span>
                  <h2 className="font-label text-[12px] font-bold tracking-wider text-ink uppercase">
                    {cat.name}
                  </h2>
                </div>
                <span className={`font-label text-[11px] px-2 py-0.5 rounded font-bold uppercase ${cat.badgeColor}`}>
                  {cat.badge}
                </span>
              </div>

              {categoryItems.map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-3 p-3 bg-card rounded-xl shadow-sm min-h-[56px] cursor-pointer border border-line-strong hover:bg-canvas transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => onToggleItem(item.id)}
                    className="w-6 h-6 mt-0.5 rounded text-ink flex-shrink-0 accent-ink cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[14px] font-semibold ${
                          item.completed
                            ? 'line-through text-ink-faint'
                            : 'text-ink'
                        }`}
                      >
                        {item.title}
                      </span>
                      <span
                        className={`font-label text-[11px] px-1.5 py-0.5 rounded font-bold flex-shrink-0 ${
                          item.completed
                            ? 'bg-ok-soft text-ok-ink'
                            : item.tag === 'Manquant' || item.tag === 'Missing'
                            ? 'bg-danger-soft text-danger-ink-strong'
                            : 'bg-tint text-ink'
                        }`}
                      >
                        {item.completed ? (isEn ? 'Ready' : 'Prêt') : item.tag}
                      </span>
                    </div>
                    <p className="text-[12px] text-ink-muted mt-0.5 leading-snug">
                      {item.id === 'k1'
                        ? (isEn
                            ? `Status: Calculated reserve for ${peopleCount} pers. / ${durationDays} days = ${totalWaterLitres}L.`
                            : `Statut : Réserve calculée pour ${peopleCount} pers. / ${durationDays} jours = ${totalWaterLitres}L.`)
                        : item.id === 'k3'
                        ? (isEn
                            ? `Canned goods, grains and rations (${totalRations} calculated rations).`
                            : `Conserves, céréales et rations (${totalRations} rations calculées).`)
                        : item.subtitle}
                    </p>
                  </div>
                </label>
              ))}

              {/* Rappel Sanitaire Iode dans Catégorie 5 */}
              {cat.id === 5 && (
                <div className="p-3 bg-subtle rounded-lg flex items-start gap-2.5 border border-line mt-1">
                  <span className="material-symbols-outlined text-brand-ink text-[20px] flex-shrink-0 mt-0.5">
                    info
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="font-label text-[11px] uppercase font-bold text-brand-ink">
                      {isEn ? 'Legal & Health Notice' : 'Rappel Légal & Sanitaire'}
                    </span>
                    <p className="text-[12px] text-ink-muted mt-0.5 leading-snug">
                      {isEn
                        ? 'Stable potassium iodide (KI) tablets must NEVER be self-administered without an explicit government decree (distribution restricted to nuclear emergency response zones or national stockpiles).'
                        : "Les comprimés d'iode stable (iodure de potassium) ne doivent JAMAIS faire l'objet d'une automédication préventive sans consigne préfectorale explicite (distribution réservée aux rayons PPI nucléaires ou stocks d'État)."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions Opérationnelles Bas de Page */}
      <div className="mt-4 flex flex-col gap-2.5">
        <button
          onClick={handleExportPDF}
          type="button"
          className="w-full min-h-[48px] rounded-lg bg-navy hover:bg-navy-2 text-white text-[14px] font-bold flex items-center justify-center gap-2 active:opacity-90 shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
          <span>{isEn ? 'Export inventory (PDF / Local Print)' : "Exporter l'inventaire (PDF / Impression locale)"}</span>
        </button>

        <button
          onClick={onResetItems}
          type="button"
          className="w-full min-h-[48px] rounded-lg bg-subtle hover:bg-tint text-ink font-label text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-line"
        >
          <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          <span>{isEn ? 'Reset completed checklist' : 'Réinitialiser les états cochés'}</span>
        </button>

        <div className="text-center px-2 py-2">
          <p className="text-[12px] text-ink-muted leading-relaxed">
            {isEn
              ? 'Recommendations aligned with European Civil Protection guidelines and French DGSCGC Family Disaster Plan.'
              : 'Recommandations conformes au guide « Tous Responsables » (Ministère de l\'Intérieur) et au Plan d\'Urgence Familial de la Direction Générale de la Sécurité Civile (DGSCGC).'}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ok"></span>
            <span className="font-label text-[11px] uppercase tracking-wider text-ink-muted font-bold">
              NRBCOR PWA v4.7 • {isEn ? 'Offline Mode Active' : 'Mode Hors-Ligne Prêt'}
            </span>
          </div>
        </div>
      </div>

      {/* Modal Ajout Article */}
      {showAddModal && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm"
        >
          <div className="bg-card max-w-sm w-full rounded-xl p-5 shadow-2xl border border-line-strong flex flex-col gap-3">
            <h3 className="text-[18px] font-bold text-ink">
              {isEn ? 'Add Custom Item' : 'Ajouter un article'}
            </h3>
            <form onSubmit={handleAddNewItem} className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-label text-ink-muted uppercase font-bold block mb-1">
                  {isEn ? 'Item title:' : "Nom de l'article :"}
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={isEn ? 'E.g., Pediatric FFP3 mask, D batteries...' : 'Ex : Masque FFP3 enfant, piles D...'}
                  className="w-full h-12 px-3 border border-line-strong rounded-lg text-[14px] text-ink focus:outline-none focus:border-brand-ink"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[12px] font-label text-ink-muted uppercase font-bold block mb-1">
                  {isEn ? 'Category:' : 'Catégorie :'}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(Number(e.target.value))}
                  className="w-full h-12 px-3 border border-line-strong rounded-lg text-[14px] text-ink bg-card focus:outline-none focus:border-brand-ink"
                >
                  {kitCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-11 px-4 rounded-lg bg-subtle text-ink font-label text-[12px] font-bold uppercase"
                >
                  {isEn ? 'Cancel' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="h-11 px-4 rounded-lg bg-navy text-white font-label text-[12px] font-bold uppercase shadow-sm"
                >
                  {isEn ? 'Add' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
