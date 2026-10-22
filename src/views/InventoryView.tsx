import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../services/storage/StorageRepository';
import { storageService, INITIAL_INVENTORY } from '../services/storage/IndexedDbStorage';
import { AuditReminderModal } from '../components/AuditReminderModal';
import { getAuditStatus, AuditStatus } from '../services/notificationService';

interface InventoryViewProps {
  onBack: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ onBack }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'expiry' | 'category' | 'status'>('expiry');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditStatus, setAuditStatus] = useState<AuditStatus>(() => getAuditStatus());

  // New item form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Alimentation de Survie');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('unités');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    storageService.getInventoryItems().then((loaded) => {
      setItems(loaded);
      setLoading(false);
    });
  }, []);

  const getExpiryStatus = (dateStr?: string): {
    status: 'expired' | 'soon' | 'ok' | 'none';
    label: string;
    badgeClass: string;
  } => {
    if (!dateStr) {
      return { status: 'none', label: 'Non périssable', badgeClass: 'bg-[#f0f4f9] text-[#44474d]' };
    }

    const exp = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const diffDays = Math.round((exp - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        status: 'expired',
        label: 'Date dépassée (À renouveler)',
        badgeClass: 'bg-[#ffdad6] text-[#ba1a1a] font-bold'
      };
    } else if (diffDays <= 60) {
      return {
        status: 'soon',
        label: `À vérifier (${diffDays} j restants)`,
        badgeClass: 'bg-[#fff0c2] text-[#855300] font-bold'
      };
    } else {
      return {
        status: 'ok',
        label: 'Conforme',
        badgeClass: 'bg-[#98f6c5] text-[#005236] font-semibold'
      };
    }
  };

  const handleMarkCheckedToday = async (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = items.map((it) => (it.id === id ? { ...it, lastCheckedAt: today } : it));
    setItems(updated);
    const target = updated.find((i) => i.id === id);
    if (target) {
      await storageService.saveInventoryItem(target);
    }
  };

  const handleDelete = async (id: string) => {
    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
    await storageService.deleteInventoryItem(id);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: name.trim(),
      category,
      quantity,
      unit,
      expiryDate: expiryDate ? expiryDate : undefined,
      lastCheckedAt: new Date().toISOString().split('T')[0],
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const next = [newItem, ...items];
    setItems(next);
    await storageService.saveInventoryItem(newItem);

    setName('');
    setQuantity(1);
    setExpiryDate('');
    setNotes('');
    setShowAddModal(false);
  };

  const handleAuditCompleted = async () => {
    setAuditStatus(getAuditStatus());
    const loaded = await storageService.getInventoryItems();
    setItems(loaded);
  };

  // Filtrage et tri
  const filtered = items.filter((it) => filterCategory === 'all' || it.category === filterCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'expiry') {
      if (!a.expiryDate) return 1;
      if (!b.expiryDate) return -1;
      return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
    }
    if (sortBy === 'category') {
      return a.category.localeCompare(b.category);
    }
    if (sortBy === 'status') {
      const statOrder = { expired: 0, soon: 1, ok: 2, none: 3 };
      return statOrder[getExpiryStatus(a.expiryDate).status] - statOrder[getExpiryStatus(b.expiryDate).status];
    }
    return 0;
  });

  const categories = Array.from(new Set(items.map((it) => it.category)));
  const expiredCount = items.filter((i) => getExpiryStatus(i.expiryDate).status === 'expired').length;
  const soonCount = items.filter((i) => getExpiryStatus(i.expiryDate).status === 'soon').length;

  return (
    <div className="flex flex-col w-full pt-20 pb-28 min-h-screen max-w-xl mx-auto px-4 gap-4">
      {/* Sentinel bar */}
      <div className="w-full bg-[#001126] text-white py-2 px-3 rounded-lg flex items-center justify-between border border-[#12263f]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[18px] text-[#98f6c5]">inventory</span>
          <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider truncate">
            Inventaire Matériel & Dates de Péremption
          </span>
        </div>
        <span className="font-['Space_Grotesk'] text-[10px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-bold uppercase">
          ÉCRAN G
        </span>
      </div>

      {/* Return button */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          type="button"
          className="h-12 px-3 bg-[#dce9fd] hover:bg-[#d6e4f8] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold rounded flex items-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>RETOUR</span>
        </button>
        <button
          onClick={() => window.print()}
          type="button"
          className="h-12 px-3 bg-white border border-[#c4c6ce] hover:bg-[#eef4ff] text-[#001126] font-['Space_Grotesk'] text-[11px] font-bold rounded flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">print</span>
          <span>IMPRIMER</span>
        </button>
      </div>

      {/* Title */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-['Space_Grotesk'] text-[11px] px-2 py-0.5 rounded bg-[#0036ce] text-white font-bold uppercase">
            RÉSERVES CITOYENNES
          </span>
        </div>
        <h1 className="text-[24px] text-[#001126] font-bold tracking-tight">
          Inventaire & Suivi des Péremptions
        </h1>
        <p className="text-[13px] text-[#44474d] leading-relaxed">
          Surveillez l'état de fraîcheur de vos denrées, piles, cartouches filtrantes et médicaments d'urgence pour éviter les mauvaises surprises le jour J.
        </p>
      </header>

      {/* Audit Semestriel & Rappels Web Notification */}
      <div className="bg-[#001126] text-white p-3.5 rounded-xl border border-[#12263f] flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#0036ce] text-[#98f6c5] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">event_repeat</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-['Space_Grotesk'] text-[11px] font-bold text-[#98f6c5] uppercase tracking-wider">
                Audit Semestriel (6 mois)
              </span>
              {auditStatus.isDue && (
                <span className="bg-[#ffdad6] text-[#ba1a1a] text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                  Échu
                </span>
              )}
            </div>
            <p className="text-[12px] text-[#eef4ff] truncate">
              {auditStatus.isDue
                ? "Audit nécessaire : vérifiez vos stocks d'urgence"
                : `Prochain audit dans ${auditStatus.daysRemaining} jours (${auditStatus.nextAuditDate})`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAuditModal(true)}
          className="min-h-[40px] px-3 bg-[#98f6c5] hover:bg-[#80e5b3] text-[#002c1b] font-['Space_Grotesk'] text-[11px] font-bold uppercase rounded-lg flex items-center gap-1 shrink-0 transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">notifications_active</span>
          <span>Gérer</span>
        </button>
      </div>

      {/* Synthèse Alertes Péremptions */}
      <div className="grid grid-cols-2 gap-2">
        <div className={`p-3 rounded-xl border flex flex-col gap-1 ${
          expiredCount > 0 ? 'bg-[#ffdad6]/50 border-[#ffb4ab]' : 'bg-[#eef4ff] border-[#d6e4f8]'
        }`}>
          <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-[#44474d]">
            Articles Dépassés
          </span>
          <span className={`font-['Space_Grotesk'] text-[20px] font-bold ${
            expiredCount > 0 ? 'text-[#ba1a1a]' : 'text-[#001126]'
          }`}>
            {expiredCount} {expiredCount > 1 ? 'articles' : 'article'}
          </span>
          <span className="text-[11px] text-[#44474d]">À renouveler au cellier</span>
        </div>

        <div className={`p-3 rounded-xl border flex flex-col gap-1 ${
          soonCount > 0 ? 'bg-[#fff0c2]/50 border-[#ffe082]' : 'bg-[#eef4ff] border-[#d6e4f8]'
        }`}>
          <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-[#44474d]">
            À Vérifier Bientôt (&lt; 60j)
          </span>
          <span className={`font-['Space_Grotesk'] text-[20px] font-bold ${
            soonCount > 0 ? 'text-[#855300]' : 'text-[#001126]'
          }`}>
            {soonCount} {soonCount > 1 ? 'articles' : 'article'}
          </span>
          <span className="text-[11px] text-[#44474d]">Vérification recommandée</span>
        </div>
      </div>

      {/* Barre de contrôles et filtres */}
      <section className="bg-white p-3 rounded-xl border border-[#c4c6ce] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#44474d]">
            Trier les articles par :
          </span>
          <button
            onClick={() => setShowAddModal(true)}
            type="button"
            className="h-9 px-3 bg-[#001126] text-white rounded-lg font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center gap-1 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Ajouter article</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => setSortBy('expiry')}
            type="button"
            className={`min-h-[40px] rounded-lg font-['Space_Grotesk'] text-[11px] font-bold uppercase transition-colors ${
              sortBy === 'expiry' ? 'bg-[#001126] text-white' : 'bg-[#f0f4f9] text-[#001126]'
            }`}
          >
            Péremption
          </button>
          <button
            onClick={() => setSortBy('status')}
            type="button"
            className={`min-h-[40px] rounded-lg font-['Space_Grotesk'] text-[11px] font-bold uppercase transition-colors ${
              sortBy === 'status' ? 'bg-[#001126] text-white' : 'bg-[#f0f4f9] text-[#001126]'
            }`}
          >
            Statut
          </button>
          <button
            onClick={() => setSortBy('category')}
            type="button"
            className={`min-h-[40px] rounded-lg font-['Space_Grotesk'] text-[11px] font-bold uppercase transition-colors ${
              sortBy === 'category' ? 'bg-[#001126] text-white' : 'bg-[#f0f4f9] text-[#001126]'
            }`}
          >
            Catégorie
          </button>
        </div>

        {/* Filtre catégorie */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setFilterCategory('all')}
            type="button"
            className={`px-3 py-1 rounded-full text-[11px] font-['Space_Grotesk'] font-bold shrink-0 ${
              filterCategory === 'all'
                ? 'bg-[#0036ce] text-white'
                : 'bg-[#f0f4f9] text-[#44474d]'
            }`}
          >
            Toutes ({items.length})
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              type="button"
              className={`px-3 py-1 rounded-full text-[11px] font-['Space_Grotesk'] font-bold shrink-0 ${
                filterCategory === c
                  ? 'bg-[#0036ce] text-white'
                  : 'bg-[#f0f4f9] text-[#44474d]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Liste des articles d'inventaire */}
      <section className="flex flex-col gap-2.5">
        {sorted.map((item) => {
          const expInfo = getExpiryStatus(item.expiryDate);
          return (
            <article
              key={item.id}
              className="p-3.5 bg-white rounded-xl border border-[#c4c6ce] shadow-sm flex flex-col gap-2 hover:border-[#0036ce] transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <span className="font-['Space_Grotesk'] text-[10px] uppercase font-bold text-[#44474d]">
                    {item.category}
                  </span>
                  <h3 className="text-[15px] font-bold text-[#001126] leading-snug">
                    {item.name}
                  </h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-['Space_Grotesk'] shrink-0 ${expInfo.badgeClass}`}>
                  {expInfo.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[12px] bg-[#f8f9ff] p-2.5 rounded-lg border border-[#e4efff]">
                <div>
                  <span className="text-[#44474d] block text-[11px]">Quantité stockée :</span>
                  <span className="font-bold text-[#001126] font-['Space_Grotesk']">
                    {item.quantity} {item.unit}
                  </span>
                </div>
                <div>
                  <span className="text-[#44474d] block text-[11px]">Date limite :</span>
                  <span className="font-bold text-[#001126] font-['Space_Grotesk']">
                    {item.expiryDate || 'Non renseignée'}
                  </span>
                </div>
              </div>

              {item.notes && (
                <p className="text-[12px] text-[#44474d] italic bg-white p-2 rounded border border-[#e4efff]">
                  "{item.notes}"
                </p>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-[#f0f4f9] text-[11px] text-[#44474d]">
                <span>Dernière vérif. : {item.lastCheckedAt || 'Jamais'}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleMarkCheckedToday(item.id)}
                    type="button"
                    className="px-2 py-1 rounded bg-[#eef4ff] hover:bg-[#dce9fd] text-[#0036ce] font-bold font-['Space_Grotesk'] transition-colors"
                  >
                    Vérifié aujourd'hui
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    type="button"
                    title="Supprimer l'article"
                    className="p-1 rounded text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {sorted.length === 0 && (
          <div className="bg-white p-6 rounded-xl border border-[#c4c6ce] shadow-sm flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#f0f4f9] flex items-center justify-center text-[#44474d]">
              <span className="material-symbols-outlined text-[28px]">inventory_2</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-['Space_Grotesk'] text-[15px] font-bold text-[#001126]">
                Inventaire vide (Feuille blanche)
              </h3>
              <p className="text-[12px] text-[#44474d] max-w-sm">
                Aucun article n'est actuellement répertorié. Ajoutez vos packs d'eau, conserves ou piles pour suivre leurs péremptions.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              type="button"
              className="min-h-[44px] px-4 rounded-xl bg-[#001126] text-white font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Ajouter mon premier article</span>
            </button>
          </div>
        )}
      </section>

      {/* Modal Ajout Article */}
      {showAddModal && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001126]/60 backdrop-blur-sm"
        >
          <div className="bg-white max-w-sm w-full rounded-xl p-5 shadow-2xl border border-[#c4c6ce] flex flex-col gap-3">
            <h3 className="text-[18px] font-bold text-[#001126]">Ajouter un article d'inventaire</h3>
            <form onSubmit={handleAddItem} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                  Nom de l'article :
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex : Boîtes de sardines à l'huile..."
                  className="w-full h-11 px-3 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126] focus:outline-none focus:border-[#0036ce]"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                  Catégorie :
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126] bg-white"
                >
                  <option value="Eau & Hydratation">Eau & Hydratation</option>
                  <option value="Alimentation de Survie">Alimentation de Survie</option>
                  <option value="Lumière & Énergie">Lumière & Énergie</option>
                  <option value="Protection NRBC">Protection NRBC</option>
                  <option value="Premiers Soins & Pharmacie">Premiers Soins & Pharmacie</option>
                  <option value="Confinement & Calfeutrage">Confinement & Calfeutrage</option>
                  <option value="Hygiène & Survie">Hygiène & Survie</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                    Quantité :
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full h-11 px-3 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                    Unité :
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="boîtes, litres..."
                    className="w-full h-11 px-3 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                  Date d'expiration (facultative) :
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full h-11 px-3 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126]"
                />
              </div>

              <div>
                <label className="text-[11px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                  Notes de stockage :
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Lieu de stockage, conditions..."
                  className="w-full h-11 px-3 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-10 px-3.5 rounded bg-[#f0f4f9] text-[#001126] font-['Space_Grotesk'] text-[11px] font-bold uppercase"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="h-10 px-4 rounded bg-[#001126] text-white font-['Space_Grotesk'] text-[11px] font-bold uppercase shadow-sm"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Audit Semestriel & Rappels */}
      <AuditReminderModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        inventoryItems={items}
        onAuditCompleted={handleAuditCompleted}
      />
    </div>
  );
};
