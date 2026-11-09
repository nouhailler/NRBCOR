import React, { useState, useEffect } from 'react';
import { InventoryItem, FamilyPlanData } from '../services/storage/StorageRepository';
import { storageService, INITIAL_INVENTORY, DEFAULT_SPECIFIC_NEEDS } from '../services/storage/IndexedDbStorage';
import { AuditReminderModal } from '../components/AuditReminderModal';
import { getAuditStatus, AuditStatus } from '../services/notificationService';
import { calculateReadinessScore, ReadinessDashboardData } from '../utils/readinessScore';
import { KitItem, SpecificNeedsConfig } from '../types';

interface InventoryViewProps {
  onBack: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ onBack }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [kitItems, setKitItems] = useState<KitItem[]>([]);
  const [config, setConfig] = useState<SpecificNeedsConfig>(DEFAULT_SPECIFIC_NEEDS);
  const [familyPlan, setFamilyPlan] = useState<FamilyPlanData>({ tasks: [], members: [], localContacts: [] });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'expiry' | 'category' | 'status'>('expiry');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showShoppingListModal, setShowShoppingListModal] = useState(false);
  const [showScoreExplainer, setShowScoreExplainer] = useState(false);
  const [auditStatus, setAuditStatus] = useState<AuditStatus>(() => getAuditStatus());
  const [copiedShoppingList, setCopiedShoppingList] = useState(false);

  // New item form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Alimentation de Survie');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('unités');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    Promise.all([
      storageService.getInventoryItems(),
      storageService.getKitItems(),
      storageService.getSettings(),
      storageService.getFamilyPlan()
    ]).then(([loadedInv, loadedKit, loadedSettings, loadedPlan]) => {
      setItems(loadedInv);
      setKitItems(loadedKit);
      if (loadedSettings.specificNeeds) {
        setConfig(loadedSettings.specificNeeds);
      }
      if (loadedPlan) {
        setFamilyPlan(loadedPlan);
      }
      setLoading(false);
    });
  }, []);

  const getExpiryStatus = (dateStr?: string): {
    status: 'expired' | 'soon' | 'ok' | 'none';
    label: string;
    badgeClass: string;
  } => {
    if (!dateStr) {
      return { status: 'none', label: 'Non périssable', badgeClass: 'bg-subtle text-ink-muted' };
    }

    const exp = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const diffDays = Math.round((exp - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        status: 'expired',
        label: 'Date dépassée (À renouveler)',
        badgeClass: 'bg-danger-soft text-danger-ink font-bold'
      };
    } else if (diffDays <= 60) {
      return {
        status: 'soon',
        label: `À vérifier (${diffDays} j restants)`,
        badgeClass: 'bg-warn-soft text-warn-ink font-bold'
      };
    } else {
      return {
        status: 'ok',
        label: 'Conforme',
        badgeClass: 'bg-ok-soft text-ok-ink font-semibold'
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

    const updated = [newItem, ...items];
    setItems(updated);
    await storageService.saveInventoryItem(newItem);

    // Reset form
    setName('');
    setQuantity(1);
    setUnit('unités');
    setExpiryDate('');
    setNotes('');
    setShowAddModal(false);
  };

  const handleResetDefault = async () => {
    if (window.confirm("Réinitialiser l'inventaire avec les articles de référence ?")) {
      for (const item of INITIAL_INVENTORY) {
        await storageService.saveInventoryItem(item);
      }
      setItems(INITIAL_INVENTORY);
    }
  };

  // Dashboard calculation using authoritative readinessScore engine
  const dashboardData: ReadinessDashboardData = calculateReadinessScore(
    config,
    kitItems,
    items,
    familyPlan
  );

  const expiredCount = items.filter((i) => {
    if (!i.expiryDate) return false;
    return new Date(i.expiryDate).getTime() < new Date().getTime();
  }).length;

  const soonCount = items.filter((i) => {
    if (!i.expiryDate) return false;
    const diff = Math.round((new Date(i.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 60;
  }).length;

  // Filter & sort items
  const filtered = items.filter((it) => {
    if (filterCategory === 'all') return true;
    return it.category === filterCategory;
  });

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
      const getPrio = (d?: string) => {
        if (!d) return 3;
        const diff = (new Date(d).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
        if (diff < 0) return 0;
        if (diff <= 60) return 1;
        return 2;
      };
      return getPrio(a.expiryDate) - getPrio(b.expiryDate);
    }
    return 0;
  });

  const categories = Array.from(new Set(items.map((i) => i.category)));

  // Generate shopping list text
  const generateShoppingListText = () => {
    const lines: string[] = [
      `=== LISTE DE COURSES D'URGENCE & RÉAPPROVISIONNEMENT NRBCOR ===`,
      `Date : ${new Date().toLocaleDateString('fr-FR')}`,
      `Foyer : ${dashboardData.householdSummary.totalPersons} personnes (${dashboardData.householdSummary.adults} adultes, ${dashboardData.householdSummary.children} enfants, ${dashboardData.householdSummary.infants} nourrissons, ${dashboardData.householdSummary.pets} animaux)`,
      `Objectif d'autonomie : ${dashboardData.householdSummary.targetDays} jours\n`,
      `--- BESOINS VITAUX EN DÉFICIT ---`,
      `• Eau potable : ${dashboardData.autonomy.water.currentValue}L en stock / ${dashboardData.autonomy.water.targetValue}L requis ${dashboardData.autonomy.water.currentValue < dashboardData.autonomy.water.targetValue ? `(MANQUE ${dashboardData.autonomy.water.targetValue - dashboardData.autonomy.water.currentValue}L)` : '(CONFORME)'}`,
      `• Alimentation : ${dashboardData.autonomy.food.currentValue} rations / ${dashboardData.autonomy.food.targetValue} rations requises ${dashboardData.autonomy.food.currentValue < dashboardData.autonomy.food.targetValue ? `(MANQUE ${dashboardData.autonomy.food.targetValue - dashboardData.autonomy.food.currentValue} rations)` : '(CONFORME)'}\n`,
      `--- ARTICLES PÉRIMÉS OU À RENOUVELER (<60j) ---`,
    ];

    items.forEach((it) => {
      const st = getExpiryStatus(it.expiryDate);
      if (st.status === 'expired' || st.status === 'soon') {
        lines.push(`• [${st.label}] ${it.name} (${it.quantity} ${it.unit})`);
      }
    });

    if (dashboardData.missingItems && dashboardData.missingItems.length > 0) {
      lines.push(`\n--- ÉQUIPEMENTS MANQUANTS DU KIT 72H ---`);
      dashboardData.missingItems.slice(0, 10).forEach((m) => {
        lines.push(`• [Priorité ${m.priority}] ${m.item.title} (${m.categoryName})`);
      });
    }

    return lines.join('\n');
  };

  const handleCopyShoppingList = () => {
    navigator.clipboard.writeText(generateShoppingListText()).then(() => {
      setCopiedShoppingList(true);
      setTimeout(() => setCopiedShoppingList(false), 2500);
    });
  };

  return (
    <div className="flex flex-col w-full pt-20 pb-28 lg:pb-12 min-h-screen max-w-xl lg:max-w-5xl mx-auto px-4 sm:px-6 gap-4">
      {/* Sentinel bar */}
      <div className="w-full bg-navy text-white py-2 px-3 rounded-lg flex items-center justify-between border border-ink">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[18px] text-ok-bright">inventory</span>
          <span className="font-label text-[11px] font-bold uppercase tracking-wider truncate">
            Inventaire Intelligent & Stocks du Foyer
          </span>
        </div>
        <span className="font-label text-[10px] bg-ok-soft text-ok-ink px-2 py-0.5 rounded font-bold uppercase">
          100% LOCAL
        </span>
      </div>

      {/* Return Action & Quick Shopping List */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          type="button"
          className="h-12 px-3 bg-tint hover:bg-tint text-ink font-label text-[12px] font-bold rounded flex items-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>RETOUR</span>
        </button>

        <button
          onClick={() => setShowShoppingListModal(true)}
          type="button"
          className="h-12 px-3.5 bg-navy hover:bg-navy-2 text-white font-label text-[11px] font-bold rounded flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
          <span>Liste de courses</span>
        </button>
      </div>

      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-[24px] text-ink font-bold tracking-tight">
          Inventaire Intelligent du Foyer
        </h1>
        <p className="text-[13px] text-ink-muted leading-relaxed">
          Réconciliation continue entre les besoins calculés pour votre foyer et les denrées réellement présentes dans vos placards.
        </p>
      </header>

      {/* TABLEAU DE BORD INTELLIGENT : BESOINS CALCULÉS VS STOCKS RÉELS */}
      <section className="bg-card p-4 rounded-xl border border-line-strong shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-ink text-[22px]">balance</span>
            <h2 className="text-[15px] font-bold text-ink">
              Bilan des Besoins vs Stocks Réels ({config.targetDurationDays} jours)
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowScoreExplainer(!showScoreExplainer)}
            className="text-[11px] font-label text-brand-ink font-bold uppercase underline"
          >
            {showScoreExplainer ? 'Masquer détail' : 'Comprendre le score'}
          </button>
        </div>

        {/* 2 Cartes Clés : Eau & Nourriture avec calcul exact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
          {/* Eau */}
          <div className={`p-3 rounded-xl border flex flex-col gap-1.5 ${
            dashboardData.autonomy.water.currentValue < dashboardData.autonomy.water.targetValue
              ? 'bg-danger-soft border-danger-bright'
              : 'bg-ok-soft border-ok-line'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-label text-[11px] font-bold uppercase text-ink flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-blue-600">water_drop</span>
                Eau Potable (3L/j/pers + 1.5L/anim)
              </span>
              <span className={`font-label text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                dashboardData.autonomy.water.currentValue < dashboardData.autonomy.water.targetValue
                  ? 'bg-red-200 text-red-900'
                  : 'bg-emerald-200 text-emerald-900'
              }`}>
                {dashboardData.autonomy.water.currentValue < dashboardData.autonomy.water.targetValue ? 'Déficit' : 'Conforme'}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[22px] font-black font-label text-ink">
                {dashboardData.autonomy.water.currentValue} L
              </span>
              <span className="text-ink-muted text-[12px]">
                / {dashboardData.autonomy.water.targetValue} L requis
              </span>
            </div>
            <p className="text-[11px] text-ink-muted">
              {dashboardData.autonomy.water.currentValue < dashboardData.autonomy.water.targetValue
                ? `Il vous manque ${dashboardData.autonomy.water.targetValue - dashboardData.autonomy.water.currentValue} litres pour tenir ${config.targetDurationDays} jours.`
                : `Autonomie couverte pour l'ensemble du foyer (${dashboardData.householdSummary.totalPersons} personnes + ${dashboardData.householdSummary.pets} animaux).`}
            </p>
          </div>

          {/* Nourriture */}
          <div className={`p-3 rounded-xl border flex flex-col gap-1.5 ${
            dashboardData.autonomy.food.currentValue < dashboardData.autonomy.food.targetValue
              ? 'bg-danger-soft border-danger-bright'
              : 'bg-ok-soft border-ok-line'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-label text-[11px] font-bold uppercase text-ink flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-amber-600">restaurant</span>
                Alimentation de Survie
              </span>
              <span className={`font-label text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                dashboardData.autonomy.food.currentValue < dashboardData.autonomy.food.targetValue
                  ? 'bg-red-200 text-red-900'
                  : 'bg-emerald-200 text-emerald-900'
              }`}>
                {dashboardData.autonomy.food.currentValue < dashboardData.autonomy.food.targetValue ? 'Déficit' : 'Conforme'}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[22px] font-black font-label text-ink">
                {dashboardData.autonomy.food.currentValue}
              </span>
              <span className="text-ink-muted text-[12px]">
                / {dashboardData.autonomy.food.targetValue} rations requises
              </span>
            </div>
            <p className="text-[11px] text-ink-muted">
              {dashboardData.autonomy.food.currentValue < dashboardData.autonomy.food.targetValue
                ? `Il manque ${dashboardData.autonomy.food.targetValue - dashboardData.autonomy.food.currentValue} rations caloriques et conserves non périssables.`
                : `Stock alimentaire suffisant pour ${config.targetDurationDays} jours d'autonomie.`}
            </p>
          </div>
        </div>

        {/* Besoins Particuliers Déclarés */}
        {(config.infantsCount > 0 || config.petsCount > 0 || config.hasPmr || config.hasChronicCondition) && (
          <div className="p-3 bg-canvas rounded-lg border border-line flex flex-col gap-1.5 text-[11px]">
            <span className="font-label font-bold text-brand-ink uppercase">
              Besoins Spécifiques Intégrés au Calcul :
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {config.infantsCount > 0 && (
                <div className="p-2 bg-card rounded border border-line">
                  <strong>👶 Nourrissons ({config.infantsCount}) :</strong>
                  <span className="block text-ink-muted">Lait infantile, couches, eau faiblement minéralisée.</span>
                </div>
              )}
              {config.petsCount > 0 && (
                <div className="p-2 bg-card rounded border border-line">
                  <strong>🐾 Animaux ({config.petsCount}) :</strong>
                  <span className="block text-ink-muted">Croquettes, eau dédiée (+1.5L/j) et cage de transport.</span>
                </div>
              )}
              {config.hasChronicCondition && (
                <div className="p-2 bg-card rounded border border-line">
                  <strong>💊 Traitements :</strong>
                  <span className="block text-ink-muted">Réserve 15 jours de traitements et ordonnances papier.</span>
                </div>
              )}
              {config.hasPmr && (
                <div className="p-2 bg-card rounded border border-line">
                  <strong>♿ Mobilité Réduite :</strong>
                  <span className="block text-ink-muted">Aides techniques et itinéraire adapté pré-identifié.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Explication Décomposée du Score (Anti-fausse promesse) */}
        {showScoreExplainer && (
          <div className="p-3 bg-subtle rounded-xl border border-line-strong text-[11px] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <strong className="font-label uppercase text-ink">
                Score Total Réel : {dashboardData.scoreResult.totalScore}% (Explicable sans artifice)
              </strong>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {dashboardData.scoreResult.pillars.map((pil) => (
                <div key={pil.id} className="p-2 bg-card rounded border border-gray-200 flex flex-col gap-0.5">
                  <span className="font-bold text-ink">{pil.title}</span>
                  <span className="font-label text-brand-ink font-bold">
                    {pil.score} / {pil.maxScore} pts
                  </span>
                  <span className="text-[10px] text-gray-500">{pil.formulaExplanation}</span>
                </div>
              ))}
            </div>
            <p className="text-danger-ink font-semibold italic bg-card p-2 rounded border border-red-200">
              Clause déontologique : {dashboardData.scoreResult.disclaimer}
            </p>
          </div>
        )}
      </section>

      {/* Audit Semestriel Sentinel */}
      <div className="bg-navy-2 text-white p-3.5 rounded-xl border border-ink flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="material-symbols-outlined text-[24px] text-ok-bright shrink-0">
            event_repeat
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-label text-[11px] font-bold text-ok-bright uppercase tracking-wider">
                Audit Semestriel (6 mois)
              </span>
              {auditStatus.isDue && (
                <span className="bg-danger-soft text-danger-ink text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                  Échu
                </span>
              )}
            </div>
            <p className="text-[12px] text-on-navy truncate">
              {auditStatus.isDue
                ? "Audit nécessaire : vérifiez vos stocks d'urgence"
                : `Prochain audit dans ${auditStatus.daysRemaining} jours (${auditStatus.nextAuditDate})`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAuditModal(true)}
          className="min-h-[40px] px-3 bg-ok-soft hover:bg-ok-soft text-ok-ink font-label text-[11px] font-bold uppercase rounded-lg flex items-center gap-1 shrink-0 transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">notifications_active</span>
          <span>Gérer</span>
        </button>
      </div>

      {/* Synthèse Alertes Péremptions */}
      <div className="grid grid-cols-2 gap-2">
        <div className={`p-3 rounded-xl border flex flex-col gap-1 ${
          expiredCount > 0 ? 'bg-danger-soft/50 border-danger-line' : 'bg-subtle border-line'
        }`}>
          <span className="font-label text-[11px] uppercase font-bold text-ink-muted">
            Articles Dépassés
          </span>
          <span className={`font-label text-[20px] font-bold ${
            expiredCount > 0 ? 'text-danger-ink' : 'text-ink'
          }`}>
            {expiredCount} {expiredCount > 1 ? 'articles' : 'article'}
          </span>
          <span className="text-[11px] text-ink-muted">À renouveler au cellier</span>
        </div>

        <div className={`p-3 rounded-xl border flex flex-col gap-1 ${
          soonCount > 0 ? 'bg-warn-soft/50 border-warn-bright' : 'bg-subtle border-line'
        }`}>
          <span className="font-label text-[11px] uppercase font-bold text-ink-muted">
            À Vérifier Bientôt (&lt; 60j)
          </span>
          <span className={`font-label text-[20px] font-bold ${
            soonCount > 0 ? 'text-warn-ink' : 'text-ink'
          }`}>
            {soonCount} {soonCount > 1 ? 'articles' : 'article'}
          </span>
          <span className="text-[11px] text-ink-muted">Vérification recommandée</span>
        </div>
      </div>

      {/* Barre de contrôles et filtres */}
      <section className="bg-card p-3 rounded-xl border border-line-strong shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="font-label text-[11px] font-bold uppercase text-ink-muted">
            Trier les articles par :
          </span>
          <button
            onClick={() => setShowAddModal(true)}
            type="button"
            className="h-9 px-3 bg-navy text-white rounded-lg font-label text-[11px] font-bold uppercase flex items-center gap-1 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Ajouter article</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => setSortBy('expiry')}
            type="button"
            className={`min-h-[40px] rounded-lg font-label text-[11px] font-bold uppercase transition-colors ${
              sortBy === 'expiry' ? 'bg-navy text-white' : 'bg-subtle text-ink'
            }`}
          >
            Péremption
          </button>
          <button
            onClick={() => setSortBy('status')}
            type="button"
            className={`min-h-[40px] rounded-lg font-label text-[11px] font-bold uppercase transition-colors ${
              sortBy === 'status' ? 'bg-navy text-white' : 'bg-subtle text-ink'
            }`}
          >
            Statut
          </button>
          <button
            onClick={() => setSortBy('category')}
            type="button"
            className={`min-h-[40px] rounded-lg font-label text-[11px] font-bold uppercase transition-colors ${
              sortBy === 'category' ? 'bg-navy text-white' : 'bg-subtle text-ink'
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
            className={`px-3 py-1 rounded-full text-[11px] font-label font-bold shrink-0 ${
              filterCategory === 'all'
                ? 'bg-brand text-white'
                : 'bg-subtle text-ink-muted'
            }`}
          >
            Toutes ({items.length})
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              type="button"
              className={`px-3 py-1 rounded-full text-[11px] font-label font-bold shrink-0 ${
                filterCategory === c
                  ? 'bg-brand text-white'
                  : 'bg-subtle text-ink-muted'
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
              className="p-3.5 bg-card rounded-xl border border-line-strong shadow-sm flex flex-col gap-2 hover:border-brand-ink transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <span className="font-label text-[10px] uppercase font-bold text-ink-muted">
                    {item.category}
                  </span>
                  <h3 className="text-[15px] font-bold text-ink leading-snug">
                    {item.name}
                  </h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-label uppercase shrink-0 ${expInfo.badgeClass}`}>
                  {expInfo.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[12px] bg-canvas p-2.5 rounded-lg border border-on-navy">
                <div>
                  <span className="text-ink-muted block text-[10px] uppercase font-bold font-label">
                    Quantité en stock :
                  </span>
                  <span className="font-bold text-ink font-label text-[14px]">
                    {item.quantity} {item.unit}
                  </span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[10px] uppercase font-bold font-label">
                    Date de péremption :
                  </span>
                  <span className="font-bold text-ink font-label text-[13px]">
                    {item.expiryDate || 'Non renseignée'}
                  </span>
                </div>
              </div>

              {item.notes && (
                <p className="text-[11px] text-ink-muted italic px-1">
                  Note : {item.notes}
                </p>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-on-navy">
                <span className="text-[10px] text-ink-muted">
                  Vérifié le : {item.lastCheckedAt || 'Non audité'}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMarkCheckedToday(item.id)}
                    className="h-8 px-2.5 bg-subtle hover:bg-tint text-brand-ink rounded font-label text-[10px] font-bold uppercase flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">done</span>
                    <span>Audité aujourd'hui</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 rounded bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 flex items-center justify-center transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Bouton Réinitialiser l'inventaire avec les articles de référence */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleResetDefault}
          className="w-full h-11 border border-gray-300 hover:bg-gray-50 text-ink-muted rounded-xl font-label text-[11px] font-bold uppercase transition-colors"
        >
          Réinitialiser l'inventaire type de survie
        </button>
      </div>

      {/* Modal Ajout Article */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <form
            onSubmit={handleAddItem}
            className="bg-card rounded-2xl p-4 max-w-md w-full shadow-2xl border border-line-strong flex flex-col gap-3 text-ink"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-[16px]">Ajouter un article en stock</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-label font-bold uppercase text-ink-muted">
                Désignation de l'article :
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Eau minérale 6x1.5L, Barres protéinées..."
                className="h-10 px-3 bg-card border border-line-strong rounded-lg text-[13px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-label font-bold uppercase text-ink-muted">
                  Quantité :
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                  className="h-10 px-3 bg-card border border-line-strong rounded-lg text-[13px]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-label font-bold uppercase text-ink-muted">
                  Unité :
                </label>
                <input
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="litres, rations, unités..."
                  className="h-10 px-3 bg-card border border-line-strong rounded-lg text-[13px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-label font-bold uppercase text-ink-muted">
                  Catégorie :
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-10 px-2 bg-card border border-line-strong rounded-lg text-[12px]"
                >
                  <option value="Eau & Hydratation">Eau & Hydratation</option>
                  <option value="Alimentation de Survie">Alimentation de Survie</option>
                  <option value="Énergie & Éclairage">Énergie & Éclairage</option>
                  <option value="Hygiène & Santé">Hygiène & Santé</option>
                  <option value="Besoins Spécifiques (Bébé / Animaux)">Besoins Spécifiques</option>
                  <option value="Sécurité & Confinement">Sécurité & Confinement</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-label font-bold uppercase text-ink-muted">
                  Péremption (si applicable) :
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="h-10 px-2 bg-card border border-line-strong rounded-lg text-[12px]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-label font-bold uppercase text-ink-muted">
                Notes / Emplacement :
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Placard entrée, carton n°2..."
                className="h-10 px-3 bg-card border border-line-strong rounded-lg text-[12px]"
              />
            </div>

            <button
              type="submit"
              className="mt-2 h-11 bg-navy text-white font-label text-[12px] font-bold uppercase rounded-xl hover:bg-navy-2 transition-colors"
            >
              Enregistrer l'article
            </button>
          </form>
        </div>
      )}

      {/* Modal Checklist & Liste de courses d'urgence */}
      {showShoppingListModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card text-ink w-full max-w-lg rounded-2xl shadow-2xl border border-line-strong flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-4 bg-navy text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-ok-bright">shopping_cart</span>
                <h3 className="font-bold text-[16px]">Liste de Courses d'Urgence</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShoppingListModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex flex-col gap-3 text-[12px]">
              <p className="text-ink-muted leading-relaxed">
                Cette liste récapitule vos déficits calculés pour le foyer ({config.adultsCount} adultes, {config.childrenCount} enfants, {config.infantsCount} bébés, {config.petsCount} animaux sur {config.targetDurationDays} jours) et les articles arrivés à expiration.
              </p>

              <pre className="p-3 bg-subtle rounded-xl font-mono text-[11px] text-ink whitespace-pre-wrap border border-line-strong max-h-72 overflow-y-auto">
                {generateShoppingListText()}
              </pre>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleCopyShoppingList}
                className="h-10 px-4 bg-navy hover:bg-navy-2 text-white rounded-xl font-label text-[12px] font-bold uppercase flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copiedShoppingList ? 'check' : 'content_copy'}
                </span>
                <span>{copiedShoppingList ? 'Liste Copiée !' : 'Copier le texte'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="h-10 px-4 bg-card border border-gray-300 text-ink rounded-xl font-label text-[12px] font-bold uppercase flex items-center gap-1 hover:bg-gray-100"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Imprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Audit Périodique */}
      {showAuditModal && (
        <AuditReminderModal
          isOpen={showAuditModal}
          onClose={() => setShowAuditModal(false)}
          inventoryItems={items}
          onAuditCompleted={() => {
            setAuditStatus(getAuditStatus());
            setShowAuditModal(false);
          }}
        />
      )}
    </div>
  );
};
