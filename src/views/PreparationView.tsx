import React, { useState } from 'react';
import { KitItem } from '../types';
import { KIT_CATEGORIES } from '../data/kitData';

interface PreparationViewProps {
  items: KitItem[];
  onToggleItem: (id: string) => void;
  onResetItems: () => void;
  onAddItem: (item: KitItem) => void;
  onOpenInventory?: () => void;
}

export const PreparationView: React.FC<PreparationViewProps> = ({
  items,
  onToggleItem,
  onResetItems,
  onAddItem,
  onOpenInventory,
}) => {
  const [peopleCount, setPeopleCount] = useState<number>(3);
  const [durationDays, setDurationDays] = useState<number>(3);
  const [filterMode, setFilterMode] = useState<'all' | 'todo'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(1);

  // Dynamic calculations
  const totalWaterLitres = peopleCount * 3 * durationDays;
  const totalRations = peopleCount * durationDays;

  const totalItems = items.length;
  const completedCount = items.filter((it) => it.completed).length;
  const missingCount = totalItems - completedCount;
  const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const filteredItems = filterMode === 'all' ? items : items.filter((it) => !it.completed);

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: KitItem = {
      id: `custom-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      subtitle: 'Article personnalisé ajouté par le foyer.',
      tag: 'Personnalisé',
      completed: false,
    };
    onAddItem(newItem);
    setNewTitle('');
    setShowAddModal(false);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="flex flex-col w-full px-4 pt-24 pb-28 gap-4 max-w-xl mx-auto">
      {/* Sentinel Bandeau Hors-Ligne & Souveraineté Locale */}
      <div className="py-2.5 px-3 bg-[#e4efff] text-[#0f1c2b] flex items-center justify-between gap-2 rounded-lg border border-[#d6e4f8]">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="material-symbols-outlined text-[#3f9d73] text-[18px] flex-shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            cloud_off
          </span>
          <span className="font-['Space_Grotesk'] text-[11px] font-semibold truncate text-[#001126]">
            Stockage 100% local (IndexedDB) • Aucune donnée transmise
          </span>
        </div>
        <span className="font-['Space_Grotesk'] text-[11px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-bold uppercase flex-shrink-0">
          Chiffré
        </span>
      </div>

      {/* En-tête contextuel */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className="font-['Space_Grotesk'] text-[11px] text-[#0036ce] font-bold tracking-wider uppercase">
            Section 4.7 • Résilience Citoyenne
          </span>
        </div>
        <h1 className="text-[24px] text-[#001126] font-bold tracking-tight">
          Kit d'urgence 72h
        </h1>
        <p className="text-[13px] text-[#44474d] leading-relaxed">
          Autonomie et résilience logistique du foyer en situation de rupture d'approvisionnement.
        </p>

        {/* Note Méthodologique Officielle */}
        <div className="mt-2 p-3 bg-white rounded-xl shadow-sm flex items-start gap-2.5 border border-[#c4c6ce]">
          <span className="material-symbols-outlined text-[#001126] text-[20px] flex-shrink-0 mt-0.5">
            verified_user
          </span>
          <p className="text-[12px] text-[#44474d] leading-relaxed">
            <strong className="font-semibold text-[#001126]">Objectif indicatif :</strong> Basé sur les protocoles officiels de la Sécurité Civile et du portail <span className="font-semibold text-[#001126]">Info.gouv.fr</span>. Vise une autonomie minimale de 72 heures sans substitution des prescriptions médicales personnelles.
          </p>
        </div>
      </header>

      {/* Calculateur Paramétrique Interactif */}
      <section className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-['Space_Grotesk'] text-[12px] uppercase tracking-wider text-[#001126] font-bold">
            Configuration du foyer
          </span>
          <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] font-medium">
            Variables ajustables
          </span>
        </div>

        {/* Sélecteur Taille de Foyer */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] text-[#0f1c2b] font-medium">
              Personnes à charge :
            </span>
            <span className="font-['Space_Grotesk'] text-[13px] text-[#001126] font-bold">
              {peopleCount} {peopleCount > 1 ? 'personnes' : 'personne'}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setPeopleCount(val)}
                className={`min-h-[48px] flex items-center justify-center font-['Space_Grotesk'] text-[13px] rounded-lg transition-colors ${
                  peopleCount === val
                    ? 'bg-[#001126] text-white font-bold shadow-sm'
                    : 'bg-[#eef4ff] text-[#0f1c2b] hover:bg-[#e4efff]'
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
            <span className="text-[13px] text-[#0f1c2b] font-medium">
              Durée de coupure visée :
            </span>
            <span className="font-['Space_Grotesk'] text-[13px] text-[#0036ce] font-bold">
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
                className={`min-h-[48px] flex items-center justify-center font-['Space_Grotesk'] text-[12px] rounded-lg transition-colors ${
                  durationDays === d.days
                    ? 'bg-[#001126] text-white font-bold shadow-sm'
                    : 'bg-[#eef4ff] text-[#0f1c2b] hover:bg-[#e4efff]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rations Calculées */}
        <div className="grid grid-cols-1 gap-2 pt-1">
          <div className="p-3 bg-[#eef4ff] rounded-lg flex items-center gap-3 border border-[#d6e4f8]">
            <div className="w-10 h-10 rounded-lg bg-[#dee1ff] text-[#001258] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">water_drop</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-['Space_Grotesk'] text-[11px] uppercase font-semibold text-[#44474d]">
                  Eau Vitale Recommandée
                </span>
                <span className="font-['Space_Grotesk'] text-[15px] text-[#001126] font-bold">
                  {totalWaterLitres} Litres
                </span>
              </div>
              <p className="text-[11px] text-[#44474d] truncate mt-0.5">
                3L / jour / pers (1,5L boisson + 1,5L hygiène/cuisson)
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#eef4ff] rounded-lg flex items-center gap-3 border border-[#d6e4f8]">
            <div className="w-10 h-10 rounded-lg bg-[#dce9fd] text-[#001126] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">inventory_2</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-['Space_Grotesk'] text-[11px] uppercase font-semibold text-[#44474d]">
                  Alimentation De Survie
                </span>
                <span className="font-['Space_Grotesk'] text-[15px] text-[#001126] font-bold">
                  {totalRations} Rations
                </span>
              </div>
              <p className="text-[11px] text-[#44474d] truncate mt-0.5">
                Conserves non périssables, repas lyophilisés, fruits secs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Barre de Progression Globale Dynamique */}
      <section className="bg-[#12263f] p-4 rounded-xl text-white shadow-sm border border-[#001126]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[#98f6c5] text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              task_alt
            </span>
            <span className="font-['Space_Grotesk'] text-[12px] font-bold tracking-wide uppercase text-white">
              État de Préparation
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-[16px] font-bold text-[#98f6c5]">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden mb-2">
          <div
            className="bg-[#98f6c5] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between text-[#b4c8e8] font-['Space_Grotesk'] text-[11px]">
          <span>{completedCount} sur {totalItems} éléments opérationnels</span>
          <span className="uppercase text-[#98f6c5] font-bold tracking-wider">
            {missingCount} Manquants
          </span>
        </div>
      </section>

      {/* Raccourci vers Écran G : Inventaire & Péremptions */}
      {onOpenInventory && (
        <button
          onClick={onOpenInventory}
          type="button"
          className="p-3 bg-[#eef4ff] hover:bg-[#e4efff] rounded-xl border border-[#d6e4f8] flex items-center justify-between gap-2 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#001126] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">inventory</span>
            </span>
            <div>
              <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] block">
                Inventaire Détaillé & Dates de Péremption
              </span>
              <span className="text-[11px] text-[#44474d]">
                Suivi des lots, unités stockées et alertes à renouveler (Écran G)
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#0036ce] text-[20px]">arrow_forward</span>
        </button>
      )}

      {/* Filtres d'affichage & Ajout d'article */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-1">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`min-h-[48px] px-3 rounded-lg font-['Space_Grotesk'] text-[11px] uppercase font-bold flex-1 flex items-center justify-center transition-colors ${
              filterMode === 'all'
                ? 'bg-[#001126] text-white shadow-sm'
                : 'bg-[#e4efff] text-[#44474d] hover:text-[#001126]'
            }`}
          >
            Tout ({totalItems})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('todo')}
            className={`min-h-[48px] px-3 rounded-lg font-['Space_Grotesk'] text-[11px] uppercase font-bold flex-1 flex items-center justify-center transition-colors ${
              filterMode === 'todo'
                ? 'bg-[#001126] text-white shadow-sm'
                : 'bg-[#e4efff] text-[#44474d] hover:text-[#001126]'
            }`}
          >
            À compléter ({missingCount})
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          title="Ajouter un article personnalisé"
          className="min-h-[48px] w-12 rounded-lg bg-[#dce9fd] hover:bg-[#d6e4f8] text-[#001126] flex items-center justify-center flex-shrink-0 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>
      </div>

      {/* Catégories Normées avec Checkbox Touch-Friendly */}
      <div className="flex flex-col gap-4">
        {KIT_CATEGORIES.map((cat) => {
          const categoryItems = filteredItems.filter((it) => it.category === cat.id);
          if (categoryItems.length === 0 && filterMode === 'todo') return null;

          return (
            <div key={cat.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between pb-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#0036ce] text-[20px]">
                    {cat.icon}
                  </span>
                  <h2 className="font-['Space_Grotesk'] text-[12px] font-bold tracking-wider text-[#001126] uppercase">
                    {cat.name}
                  </h2>
                </div>
                <span className={`font-['Space_Grotesk'] text-[11px] px-2 py-0.5 rounded font-bold uppercase ${cat.badgeColor}`}>
                  {cat.badge}
                </span>
              </div>

              {categoryItems.map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm min-h-[56px] cursor-pointer border border-[#c4c6ce] hover:bg-[#f8f9ff] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => onToggleItem(item.id)}
                    className="w-6 h-6 mt-0.5 rounded text-[#001126] flex-shrink-0 accent-[#001126] cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[14px] font-semibold ${
                          item.completed
                            ? 'line-through text-[#74777e]'
                            : 'text-[#001126]'
                        }`}
                      >
                        {item.title}
                      </span>
                      <span
                        className={`font-['Space_Grotesk'] text-[11px] px-1.5 py-0.5 rounded font-bold flex-shrink-0 ${
                          item.completed
                            ? 'bg-[#98f6c5] text-[#005236]'
                            : item.tag === 'Manquant'
                            ? 'bg-[#ffdad6] text-[#93000a]'
                            : 'bg-[#e4efff] text-[#001126]'
                        }`}
                      >
                        {item.completed ? 'Prêt' : item.tag}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#44474d] mt-0.5 leading-snug">
                      {item.id === 'k1'
                        ? `Statut : Réserve calculée pour ${peopleCount} pers. / ${durationDays} jours = ${totalWaterLitres}L.`
                        : item.id === 'k3'
                        ? `Conserves, céréales et rations (${totalRations} rations calculées).`
                        : item.subtitle}
                    </p>
                  </div>
                </label>
              ))}

              {/* Rappel Sanitaire Iode dans Catégorie 5 */}
              {cat.id === 5 && (
                <div className="p-3 bg-[#eef4ff] rounded-lg flex items-start gap-2.5 border border-[#d6e4f8] mt-1">
                  <span className="material-symbols-outlined text-[#0036ce] text-[20px] flex-shrink-0 mt-0.5">
                    info
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-[#0036ce]">
                      Rappel Légal & Sanitaire
                    </span>
                    <p className="text-[12px] text-[#44474d] mt-0.5 leading-snug">
                      Les comprimés d'<strong className="text-[#001126] font-semibold">iode stable (iodure de potassium)</strong> ne doivent JAMAIS faire l'objet d'une automédication préventive sans consigne préfectorale explicite (distribution réservée aux rayons PPI nucléaires ou stocks d'État).
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
          className="w-full min-h-[48px] rounded-lg bg-[#001126] hover:bg-[#12263f] text-white text-[14px] font-bold flex items-center justify-center gap-2 active:opacity-90 shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
          <span>Exporter l'inventaire (PDF / Impression locale)</span>
        </button>

        <button
          onClick={onResetItems}
          type="button"
          className="w-full min-h-[48px] rounded-lg bg-[#eef4ff] hover:bg-[#e4efff] text-[#001126] font-['Space_Grotesk'] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#d6e4f8]"
        >
          <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          <span>Réinitialiser les états cochés</span>
        </button>

        <div className="text-center px-2 py-2">
          <p className="text-[12px] text-[#44474d] leading-relaxed">
            Recommandations conformes au guide <span className="font-medium text-[#001126]">« Tous Responsables »</span> (Ministère de l'Intérieur) et au Plan d'Urgence Familial de la Direction Générale de la Sécurité Civile (DGSCGC).
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3f9d73]"></span>
            <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-wider text-[#44474d] font-bold">
              NRBCOR PWA v4.7 • Mode Hors-Ligne Prêt
            </span>
          </div>
        </div>
      </div>

      {/* Modal Ajout Article */}
      {showAddModal && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001126]/60 backdrop-blur-sm"
        >
          <div className="bg-white max-w-sm w-full rounded-xl p-5 shadow-2xl border border-[#c4c6ce] flex flex-col gap-3">
            <h3 className="text-[18px] font-bold text-[#001126]">Ajouter un article</h3>
            <form onSubmit={handleAddNewItem} className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                  Nom de l'article :
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex : Masque FFP3 enfant, piles D..."
                  className="w-full h-12 px-3 border border-[#c4c6ce] rounded-lg text-[14px] text-[#001126] focus:outline-none focus:border-[#0036ce]"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[12px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                  Catégorie :
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(Number(e.target.value))}
                  className="w-full h-12 px-3 border border-[#c4c6ce] rounded-lg text-[14px] text-[#001126] bg-white focus:outline-none focus:border-[#0036ce]"
                >
                  {KIT_CATEGORIES.map((c) => (
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
                  className="h-11 px-4 rounded-lg bg-[#eef4ff] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold uppercase"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="h-11 px-4 rounded-lg bg-[#001126] text-white font-['Space_Grotesk'] text-[12px] font-bold uppercase shadow-sm"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
