import React, { useState, useEffect, useMemo } from 'react';
import { KitItem, SpecificNeedsConfig, SubScreen, TabType } from '../types';
import { InventoryItem, FamilyPlanData, AppSettings } from '../services/storage/StorageRepository';
import { storageService, DEFAULT_SPECIFIC_NEEDS, INITIAL_INVENTORY, INITIAL_FAMILY_PLAN } from '../services/storage/IndexedDbStorage';
import { calculateReadinessScore, ReadinessDashboardData, RecommendedAction } from '../utils/readinessScore';
import { Tooltip } from '../components/Tooltip';

interface SuisJePretViewProps {
  onBack?: () => void;
  onNavigateTab?: (tab: TabType) => void;
  onOpenSubScreen?: (screen: SubScreen) => void;
  items: KitItem[];
  onToggleItem: (id: string) => void;
  onOpenInventory?: () => void;
  headerSlot?: React.ReactNode;
}

export const SuisJePretView: React.FC<SuisJePretViewProps> = ({
  onBack,
  onNavigateTab,
  onOpenSubScreen,
  items,
  onToggleItem,
  onOpenInventory,
  headerSlot
}) => {
  const [config, setConfig] = useState<SpecificNeedsConfig>(() => {
    try {
      const saved = localStorage.getItem('nrbcor_specific_needs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_SPECIFIC_NEEDS;
  });

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [familyPlan, setFamilyPlan] = useState<FamilyPlanData>(INITIAL_FAMILY_PLAN);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'missing' | 'expiries' | 'formula'>('dashboard');
  const [expandedPillarId, setExpandedPillarId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Charger la configuration et les données réelles
  useEffect(() => {
    Promise.all([
      storageService.getSettings(),
      storageService.getInventoryItems(),
      storageService.getFamilyPlan()
    ]).then(([settings, inv, plan]) => {
      if (settings.specificNeeds) {
        setConfig(settings.specificNeeds);
      }
      setInventoryItems(inv);
      if (plan) {
        setFamilyPlan(plan);
      }
      setLoading(false);
    });
  }, []);

  // Sauvegarder la configuration dès modification
  const updateConfig = async (newConfig: SpecificNeedsConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('nrbcor_specific_needs', JSON.stringify(newConfig));
    } catch (e) {}

    const currSettings = await storageService.getSettings();
    const total = newConfig.adultsCount + newConfig.childrenCount + newConfig.infantsCount + newConfig.elderlyCount;
    await storageService.saveSettings({
      ...currSettings,
      householdSize: Math.max(1, total),
      preparednessHours: newConfig.targetDurationDays * 24,
      specificNeeds: newConfig
    });
    showToast('Configuration du foyer mise à jour');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Calcul du score et des métriques
  const dashboardData: ReadinessDashboardData = useMemo(() => {
    return calculateReadinessScore(config, items, inventoryItems, familyPlan);
  }, [config, items, inventoryItems, familyPlan]);

  const { scoreResult, autonomy, missingItems, expiries, recommendedActions, householdSummary } = dashboardData;

  // Actions rapides
  const handleAddWaterPack = async () => {
    // Ajouter un pack d'eau 6x1.5L (9L) dans l'inventaire
    const newWater: InventoryItem = {
      id: `water-${Date.now()}`,
      name: "Pack d'eau minérale plate (6x1.5L)",
      category: 'Eau & Hydratation',
      quantity: 1,
      unit: 'pack (9L)',
      expiryDate: '2028-12-31',
      lastCheckedAt: new Date().toISOString().split('T')[0],
      notes: 'Ajout rapide depuis le tableau de bord Suis-je prêt ?',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newWater, ...inventoryItems];
    setInventoryItems(updated);
    await storageService.saveInventoryItem(newWater);

    // Valider également l'élément de kit k1 si pas encore coché
    const waterKit = items.find((i) => i.id === 'k1');
    if (waterKit && !waterKit.completed) {
      onToggleItem('k1');
    }
    showToast('+9 Litres d\'eau ajoutés au stock');
  };

  const handleMarkAllCheckedToday = async () => {
    const today = new Date().toISOString().split('T')[0];
    const updated = inventoryItems.map((it) => ({
      ...it,
      lastCheckedAt: today
    }));
    setInventoryItems(updated);
    for (const item of updated) {
      await storageService.saveInventoryItem(item);
    }
    showToast('Audit semestriel validé ce jour');
  };

  const handleExecuteAction = (action: RecommendedAction) => {
    if (action.actionType === 'water_adjust') {
      handleAddWaterPack();
    } else if (action.actionType === 'check_kit' && action.targetId) {
      onToggleItem(action.targetId);
      showToast(`Article "${action.title}" validé dans le kit`);
    } else if (action.actionType === 'inventory_renew') {
      if (onOpenInventory) {
        onOpenInventory();
      } else if (onOpenSubScreen) {
        onOpenSubScreen({ type: 'inventory' });
      }
    } else if (action.actionType === 'family_plan') {
      if (onNavigateTab) {
        onNavigateTab('mon-plan');
      }
    } else if (action.actionType === 'needs_adjust') {
      setShowConfigModal(true);
    }
  };

  const handlePrint = () => {
    showToast('Préparation du bilan imprimable...');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="flex flex-col w-full px-4 pt-24 pb-28 gap-4 max-w-2xl mx-auto">
      {/* Toast de confirmation */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#001126] text-white px-4 py-2 rounded-xl shadow-xl border border-white/20 text-[13px] font-['Space_Grotesk'] flex items-center gap-2 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-[#98f6c5] text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Slot (e.g. Navigation switch when embedded) */}
      {headerSlot && <div className="w-full">{headerSlot}</div>}

      {/* Bandeau de Souveraineté Locale */}
      <div className="py-2.5 px-3 bg-[#e4efff] text-[#0f1c2b] flex items-center justify-between gap-2 rounded-xl border border-[#d6e4f8]">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="material-symbols-outlined text-[#3f9d73] text-[20px] flex-shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified_user
          </span>
          <div className="flex flex-col min-w-0">
            <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] truncate">
              Tableau de bord « Suis-je prêt ? »
            </span>
            <span className="text-[11px] text-[#44474d] truncate">
              Parcours d'autonomie personnalisé • 100% Hors-ligne en local
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            aria-label="Imprimer le bilan"
            className="w-9 h-9 rounded-lg bg-white hover:bg-[#d6e4f8] text-[#001126] border border-[#c4c6ce] flex items-center justify-center transition-colors shadow-xs"
            title="Imprimer le bilan de préparation"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
          </button>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Retour"
              className="w-9 h-9 rounded-lg bg-white hover:bg-[#d6e4f8] text-[#001126] border border-[#c4c6ce] flex items-center justify-center transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* CARTE HERO : Score Global de Préparation */}
      <section className="w-full bg-[#001126] text-white rounded-2xl p-5 shadow-lg border border-[#12263f] flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#0036ce]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Jauge circulaire stylisée */}
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={scoreResult.level.color}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - scoreResult.totalScore / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[26px] font-['Space_Grotesk'] font-bold leading-none text-white">
                  {scoreResult.totalScore}
                </span>
                <span className="text-[10px] font-['Space_Grotesk'] text-[#c4c6ce] uppercase tracking-wider">
                  / 100 pts
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="font-['Space_Grotesk'] text-[11px] font-bold px-2 py-0.5 rounded-full uppercase"
                  style={{
                    backgroundColor: `${scoreResult.level.color}33`,
                    color: scoreResult.totalScore >= 70 ? '#98f6c5' : '#ffd599'
                  }}
                >
                  {scoreResult.level.badge}
                </span>
              </div>
              <h1 className="text-[20px] font-bold text-white tracking-tight leading-snug">
                {scoreResult.level.title}
              </h1>
              <p className="text-[12px] text-[#c4c6ce] mt-0.5 leading-relaxed">
                {scoreResult.level.description}
              </p>
            </div>
          </div>

          <div className="flex flex-row sm:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="h-10 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 text-white font-['Space_Grotesk'] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-white/15"
            >
              <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
              <span>Ajuster mon foyer</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'formula' ? 'dashboard' : 'formula')}
              className="h-10 px-3 rounded-xl bg-[#0036ce] hover:bg-[#002ba8] text-white font-['Space_Grotesk'] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">calculate</span>
              <span>{activeTab === 'formula' ? 'Fermer calcul' : 'Comprendre le score'}</span>
            </button>
          </div>
        </div>

        {/* Note déontologique obligatoire sans fausse garantie */}
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[#ffdad6] text-[20px] shrink-0 mt-0.5">
            shield_with_heart
          </span>
          <p className="text-[11px] text-[#e4efff] leading-relaxed">
            <strong className="font-semibold text-white">Principe de transparence :</strong> Ce score évalue l'état de vos réserves logistiques et de vos procédures face aux coupures de réseaux courantes (72h). <span className="underline decoration-white/40">Il ne constitue pas une garantie d'immunité face aux sinistres extrêmes</span>. Suivez toujours les ordres officiels de la Sécurité Civile.
          </p>
        </div>

        {/* Aperçu rapide des 5 Piliers Explicites */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 border-t border-white/10">
          {scoreResult.pillars.map((pillar) => (
            <div
              key={pillar.id}
              onClick={() => {
                setActiveTab('formula');
                setExpandedPillarId(pillar.id);
              }}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex flex-col gap-1"
            >
              <div className="flex items-center justify-between text-[11px] text-[#c4c6ce]">
                <span className="material-symbols-outlined text-[16px] text-white">
                  {pillar.icon}
                </span>
                <span className="font-['Space_Grotesk'] font-bold text-white">
                  {pillar.score}/{pillar.maxScore}
                </span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(pillar.score / pillar.maxScore) * 100}%`,
                    backgroundColor:
                      pillar.score / pillar.maxScore >= 0.8
                        ? '#98f6c5'
                        : pillar.score / pillar.maxScore >= 0.5
                        ? '#ffd599'
                        : '#ffb4ab'
                  }}
                />
              </div>
              <span className="text-[10px] text-[#c4c6ce] truncate">
                {pillar.title.split('(')[0]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Onglets de navigation du tableau de bord */}
      <div className="flex items-center gap-1.5 bg-[#f0f4f9] p-1 rounded-xl border border-[#c4c6ce]/60 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 min-h-[38px] px-3 rounded-lg font-['Space_Grotesk'] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-[#001126] text-white shadow-xs'
              : 'text-[#44474d] hover:text-[#001126] hover:bg-white/50'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">dashboard</span>
          <span>Autonomie & Synthèse</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('missing')}
          className={`flex-1 min-h-[38px] px-3 rounded-lg font-['Space_Grotesk'] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'missing'
              ? 'bg-[#001126] text-white shadow-xs'
              : 'text-[#44474d] hover:text-[#001126] hover:bg-white/50'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">checklist</span>
          <span>Manquants ({missingItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('expiries')}
          className={`flex-1 min-h-[38px] px-3 rounded-lg font-['Space_Grotesk'] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'expiries'
              ? 'bg-[#001126] text-white shadow-xs'
              : 'text-[#44474d] hover:text-[#001126] hover:bg-white/50'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">history</span>
          <span>Péremptions ({expiries.expired.length + expiries.expiringSoon.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('formula')}
          className={`flex-1 min-h-[38px] px-3 rounded-lg font-['Space_Grotesk'] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'formula'
              ? 'bg-[#001126] text-white shadow-xs'
              : 'text-[#44474d] hover:text-[#001126] hover:bg-white/50'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">rule</span>
          <span>Critères Explicites</span>
        </button>
      </div>

      {/* VUE 1 : SYNTHÈSE & AUTONOMIE */}
      {activeTab === 'dashboard' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          {/* SECTION : Résumé du foyer & variables de calcul */}
          <section className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#001126] text-[20px]">
                  family_restroom
                </span>
                <span className="font-['Space_Grotesk'] text-[13px] font-bold uppercase tracking-wider text-[#001126]">
                  Paramètres du foyer pris en compte
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(true)}
                className="text-[12px] text-[#0036ce] font-['Space_Grotesk'] font-bold hover:underline flex items-center gap-1"
              >
                <span>Modifier</span>
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-[12px]">
              <span className="bg-[#eef4ff] text-[#001126] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#0036ce]">group</span>
                {householdSummary.totalPersons} {householdSummary.totalPersons > 1 ? 'personnes' : 'personne'} (
                {householdSummary.adults} adulte{householdSummary.adults > 1 ? 's' : ''}
                {householdSummary.children > 0 ? `, ${householdSummary.children} enfant(s)` : ''}
                {householdSummary.infants > 0 ? `, ${householdSummary.infants} bébé(s)` : ''}
                {householdSummary.elderly > 0 ? `, ${householdSummary.elderly} aîné(s)` : ''})
              </span>

              <span className="bg-[#eef4ff] text-[#001126] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#0036ce]">timer</span>
                Objectif visé : {householdSummary.targetDays * 24}h ({householdSummary.targetDays} jours)
              </span>

              {config.petsCount > 0 && (
                <span className="bg-[#fff0c2] text-[#855300] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">pets</span>
                  {config.petsCount} animal(aux) (+{config.petsCount * 0.5}L eau/j)
                </span>
              )}

              {config.hasChronicCondition && (
                <span className="bg-[#ffe8e5] text-[#93000a] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">prescriptions</span>
                  Traitement vital chronique (stock 15-30j requis)
                </span>
              )}

              {config.hasPmr && (
                <span className="bg-[#dee1ff] text-[#001258] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">accessible</span>
                  Mobilité réduite / PMR (plan évacuation)
                </span>
              )}

              {config.isNearSevesoOrNpp && (
                <span className="bg-[#fff0c2] text-[#855300] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  Zone Seveso / PPI Nucléaire (Calfeutrage & masques)
                </span>
              )}
            </div>
          </section>

          {/* SECTION : 4 Jauges d'Autonomie Vitale (Eau, Nourriture, Éclairage, Énergie) */}
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="font-['Space_Grotesk'] text-[12px] uppercase tracking-wider font-bold text-[#001126]">
                Autonomie estimée en coupure complète
              </span>
              <span className="text-[11px] text-[#44474d] font-['Space_Grotesk']">
                Objectif standard : 72 heures
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* JAUGE 1 : Eau */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#dee1ff] text-[#001258] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">water_drop</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-['Space_Grotesk'] text-[13px] font-bold text-[#001126]">
                          Eau Potable
                        </span>
                        <Tooltip
                          title="Norme Sécurité Civile (3L/jour/personne)"
                          content="2 litres pour la boisson vitale + 1 litre pour l'hygiène minimale et la réhydratation des repas froids."
                        />
                      </div>
                      <span className="text-[11px] text-[#44474d]">
                        {autonomy.water.currentValue}L / {autonomy.water.targetValue}L nécessaires
                      </span>
                    </div>
                  </div>
                  <span
                    className={`font-['Space_Grotesk'] text-[12px] font-bold px-2 py-0.5 rounded ${
                      autonomy.water.status === 'optimal'
                        ? 'bg-[#98f6c5] text-[#005236]'
                        : autonomy.water.status === 'warning'
                        ? 'bg-[#fff0c2] text-[#855300]'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    {autonomy.water.autonomyHours} Heures
                  </span>
                </div>

                {/* Barre de progression */}
                <div className="w-full bg-[#eef4ff] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      autonomy.water.status === 'optimal'
                        ? 'bg-[#005236]'
                        : autonomy.water.status === 'warning'
                        ? 'bg-[#855300]'
                        : 'bg-[#ba1a1a]'
                    }`}
                    style={{
                      width: `${Math.min(100, (autonomy.water.currentValue / Math.max(1, autonomy.water.targetValue)) * 100)}%`
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#eef4ff]">
                  <span className="text-[#44474d] truncate">{autonomy.water.details}</span>
                  <button
                    type="button"
                    onClick={handleAddWaterPack}
                    className="text-[#0036ce] font-['Space_Grotesk'] font-bold hover:underline shrink-0 ml-2"
                  >
                    +9L (Pack)
                  </button>
                </div>
              </div>

              {/* JAUGE 2 : Nourriture */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#dce9fd] text-[#001126] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">restaurant</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-['Space_Grotesk'] text-[13px] font-bold text-[#001126]">
                          Alimentation de Survie
                        </span>
                        <Tooltip
                          title="Repas froids sans cuisson"
                          content="Conserves prêtes à consommer, barres hypercaloriques, fruits oléagineux consommables sans gaz ni électricité."
                        />
                      </div>
                      <span className="text-[11px] text-[#44474d]">
                        {autonomy.food.currentValue} rations / {autonomy.food.targetValue} requises
                      </span>
                    </div>
                  </div>
                  <span
                    className={`font-['Space_Grotesk'] text-[12px] font-bold px-2 py-0.5 rounded ${
                      autonomy.food.status === 'optimal'
                        ? 'bg-[#98f6c5] text-[#005236]'
                        : autonomy.food.status === 'warning'
                        ? 'bg-[#fff0c2] text-[#855300]'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    {autonomy.food.autonomyHours} Heures
                  </span>
                </div>

                <div className="w-full bg-[#eef4ff] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      autonomy.food.status === 'optimal'
                        ? 'bg-[#005236]'
                        : autonomy.food.status === 'warning'
                        ? 'bg-[#855300]'
                        : 'bg-[#ba1a1a]'
                    }`}
                    style={{
                      width: `${Math.min(100, (autonomy.food.currentValue / Math.max(1, autonomy.food.targetValue)) * 100)}%`
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#eef4ff]">
                  <span className="text-[#44474d] truncate">{autonomy.food.details}</span>
                  <button
                    type="button"
                    onClick={() => onOpenInventory?.()}
                    className="text-[#0036ce] font-['Space_Grotesk'] font-bold hover:underline shrink-0 ml-2"
                  >
                    Gérer
                  </button>
                </div>
              </div>

              {/* JAUGE 3 : Éclairage */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#fff0c2] text-[#855300] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">flashlight_on</span>
                    </div>
                    <div>
                      <span className="font-['Space_Grotesk'] text-[13px] font-bold text-[#001126] block">
                        Éclairage Autonome
                      </span>
                      <span className="text-[11px] text-[#44474d]">
                        Torches LED & piles de rechange
                      </span>
                    </div>
                  </div>
                  <span
                    className={`font-['Space_Grotesk'] text-[12px] font-bold px-2 py-0.5 rounded ${
                      autonomy.lighting.status === 'optimal'
                        ? 'bg-[#98f6c5] text-[#005236]'
                        : autonomy.lighting.status === 'warning'
                        ? 'bg-[#fff0c2] text-[#855300]'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    {autonomy.lighting.autonomyHours} Heures
                  </span>
                </div>

                <div className="w-full bg-[#eef4ff] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#855300] rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (autonomy.lighting.autonomyHours / 72) * 100)}%`
                    }}
                  />
                </div>

                <p className="text-[11px] text-[#44474d] truncate pt-1 border-t border-[#eef4ff]">
                  {autonomy.lighting.details}
                </p>
              </div>

              {/* JAUGE 4 : Énergie & Information Radio */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#e4efff] text-[#0036ce] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">cell_tower</span>
                    </div>
                    <div>
                      <span className="font-['Space_Grotesk'] text-[13px] font-bold text-[#001126] block">
                        Énergie & Info Radio
                      </span>
                      <span className="text-[11px] text-[#44474d]">
                        Radio d'alerte FM & Powerbanks
                      </span>
                    </div>
                  </div>
                  <span
                    className={`font-['Space_Grotesk'] text-[12px] font-bold px-2 py-0.5 rounded ${
                      autonomy.energy.status === 'optimal'
                        ? 'bg-[#98f6c5] text-[#005236]'
                        : autonomy.energy.status === 'warning'
                        ? 'bg-[#fff0c2] text-[#855300]'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    {autonomy.energy.autonomyHours} Heures
                  </span>
                </div>

                <div className="w-full bg-[#eef4ff] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0036ce] rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (autonomy.energy.autonomyHours / 72) * 100)}%`
                    }}
                  />
                </div>

                <p className="text-[11px] text-[#44474d] truncate pt-1 border-t border-[#eef4ff]">
                  {autonomy.energy.details}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION : Actions Recommandées pour Progresser */}
          <section className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0036ce] text-[20px]">
                  trending_up
                </span>
                <span className="font-['Space_Grotesk'] text-[13px] font-bold uppercase tracking-wider text-[#001126]">
                  Actions recommandées pour progresser
                </span>
              </div>
              <span className="font-['Space_Grotesk'] text-[11px] bg-[#eef4ff] text-[#0036ce] px-2 py-0.5 rounded font-bold">
                {recommendedActions.length} suggestions
              </span>
            </div>

            {recommendedActions.length === 0 ? (
              <div className="p-4 bg-[#eef4ff] text-[#005236] rounded-xl flex items-center gap-3">
                <span className="material-symbols-outlined text-[24px]">verified</span>
                <div>
                  <p className="text-[13px] font-bold">Félicitations, aucun point bloquant critique !</p>
                  <p className="text-[11px] text-[#44474d]">
                    Votre foyer répond à l'ensemble des critères fondamentaux d'autonomie pour les 72 premières heures.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {recommendedActions.map((action) => (
                  <div
                    key={action.id}
                    className="p-3 bg-[#f8f9ff] hover:bg-[#eef4ff] rounded-xl border border-[#d6e4f8] flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-white border border-[#c4c6ce] text-[#001126] flex items-center justify-center shrink-0 shadow-xs">
                        <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-[#001126] truncate">
                            {action.title}
                          </span>
                          <span className="font-['Space_Grotesk'] text-[10px] bg-[#98f6c5] text-[#005236] px-1.5 py-0.2 rounded font-bold">
                            +{action.pointsGain} pts
                          </span>
                        </div>
                        <p className="text-[11px] text-[#44474d] line-clamp-1">
                          {action.description}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleExecuteAction(action)}
                      className="px-3 py-1.5 rounded-lg bg-[#001126] hover:bg-[#0024a8] text-white font-['Space_Grotesk'] text-[11px] font-bold uppercase shrink-0 transition-colors shadow-xs"
                    >
                      Agir
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* VUE 2 : ARTICLES MANQUANTS DANS LE KIT */}
      {activeTab === 'missing' && (
        <div className="flex flex-col gap-3 animate-in fade-in duration-200">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-bold text-[#001126]">
                Éléments manquants dans votre kit 72h
              </h2>
              <p className="text-[12px] text-[#44474d]">
                {missingItems.length} article(s) à acquérir pour sécuriser l'autonomie matérielle du foyer.
              </p>
            </div>
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('preparation')}
                className="px-3 py-1.5 rounded-lg bg-[#eef4ff] text-[#0036ce] font-['Space_Grotesk'] text-[11px] font-bold uppercase hover:bg-[#dee1ff] transition-colors shrink-0"
              >
                Kit complet
              </button>
            )}
          </div>

          {missingItems.length === 0 ? (
            <div className="p-8 bg-white rounded-xl shadow-sm border border-[#c4c6ce] text-center flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[#3f9d73] text-[48px]">
                task_alt
              </span>
              <h3 className="text-[16px] font-bold text-[#001126]">
                Votre kit est 100% complet !
              </h3>
              <p className="text-[12px] text-[#44474d] max-w-md">
                Tous les articles recommandés par les guides de la Sécurité Civile ont été validés pour votre foyer.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {missingItems.map(({ item, priority, categoryName }) => (
                <div
                  key={item.id}
                  className="bg-white p-3.5 rounded-xl shadow-sm border border-[#c4c6ce] flex items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className={`font-['Space_Grotesk'] text-[10px] uppercase font-bold px-2 py-0.5 rounded shrink-0 mt-0.5 ${
                        priority === 1
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : priority === 2
                          ? 'bg-[#fff0c2] text-[#855300]'
                          : 'bg-[#f0f4f9] text-[#44474d]'
                      }`}
                    >
                      {priority === 1 ? 'Vital' : priority === 2 ? 'Sécurité' : 'Logistique'}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-bold text-[#001126] leading-tight">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-[#44474d] mt-0.5 line-clamp-1">
                        {item.subtitle}
                      </span>
                      <span className="text-[10px] text-[#0036ce] font-['Space_Grotesk'] mt-0.5">
                        Catégorie : {categoryName}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onToggleItem(item.id);
                      showToast(`Article "${item.title}" marqué comme acquis`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#001126] hover:bg-[#0024a8] text-white font-['Space_Grotesk'] text-[11px] font-bold uppercase shrink-0 transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span>Acquis</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VUE 3 : ÉCHÉANCES & PÉREMPTIONS */}
      {activeTab === 'expiries' && (
        <div className="flex flex-col gap-3 animate-in fade-in duration-200">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-bold text-[#001126]">
                Échéances de vérification & Maintenance logistique
              </h2>
              <p className="text-[12px] text-[#44474d]">
                Dernière vérification générale :{' '}
                <strong className="text-[#001126]">
                  {expiries.lastCheckedDate
                    ? `${expiries.lastCheckedDate} (il y a ${expiries.daysSinceLastCheck} jours)`
                    : 'Jamais effectuée'}
                </strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMarkAllCheckedToday}
                className="px-3 py-1.5 rounded-lg bg-[#001126] hover:bg-[#0024a8] text-white font-['Space_Grotesk'] text-[11px] font-bold uppercase transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">done_all</span>
                <span>Vérifié aujourd'hui</span>
              </button>
              {onOpenInventory && (
                <button
                  type="button"
                  onClick={onOpenInventory}
                  className="px-3 py-1.5 rounded-lg bg-[#eef4ff] text-[#0036ce] font-['Space_Grotesk'] text-[11px] font-bold uppercase hover:bg-[#dee1ff] transition-colors shrink-0"
                >
                  Inventaire
                </button>
              )}
            </div>
          </div>

          {/* Alertes d'articles périmés */}
          {expiries.expired.length > 0 && (
            <div className="p-4 bg-[#ffdad6] text-[#93000a] rounded-xl border border-[#ffb4ab] flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">
                  error
                </span>
                <span className="font-['Space_Grotesk'] text-[13px] font-bold uppercase tracking-wider">
                  {expiries.expired.length} article(s) à renouveler sans délai
                </span>
              </div>
              <div className="flex flex-col gap-1.5 mt-1">
                {expiries.expired.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-white/70 rounded-lg flex items-center justify-between text-[12px]"
                  >
                    <div>
                      <span className="font-bold text-[#ba1a1a]">{item.name}</span>
                      <span className="text-[#44474d] ml-2">
                        Périmé depuis le {item.expiryDate}
                      </span>
                    </div>
                    <span className="font-['Space_Grotesk'] text-[10px] bg-[#ba1a1a] text-white px-2 py-0.5 rounded font-bold">
                      À remplacer
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Articles bientôt périmés (< 60 jours) */}
          {expiries.expiringSoon.length > 0 && (
            <div className="p-4 bg-[#fff0c2] text-[#855300] rounded-xl border border-[#ffd599] flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#855300] text-[20px]">
                  notification_important
                </span>
                <span className="font-['Space_Grotesk'] text-[13px] font-bold uppercase tracking-wider">
                  {expiries.expiringSoon.length} article(s) à renouveler sous 60 jours
                </span>
              </div>
              <div className="flex flex-col gap-1.5 mt-1">
                {expiries.expiringSoon.map(({ item, daysRemaining }) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-white/70 rounded-lg flex items-center justify-between text-[12px]"
                  >
                    <div>
                      <span className="font-bold text-[#855300]">{item.name}</span>
                      <span className="text-[#44474d] ml-2">
                        Expire le {item.expiryDate} ({daysRemaining} jours restants)
                      </span>
                    </div>
                    <span className="font-['Space_Grotesk'] text-[10px] bg-[#855300] text-white px-2 py-0.5 rounded font-bold">
                      À planifier
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {expiries.expired.length === 0 && expiries.expiringSoon.length === 0 && (
            <div className="p-8 bg-white rounded-xl shadow-sm border border-[#c4c6ce] text-center flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[#3f9d73] text-[48px]">
                verified
              </span>
              <h3 className="text-[16px] font-bold text-[#001126]">
                Tous vos stocks sont à jour
              </h3>
              <p className="text-[12px] text-[#44474d] max-w-md">
                Aucun produit périmé ni proche de la date limite détecté dans votre inventaire.
              </p>
            </div>
          )}
        </div>
      )}

      {/* VUE 4 : CRITÈRES EXPLICITES & FORMULE DU SCORE */}
      {activeTab === 'formula' && (
        <div className="flex flex-col gap-3 animate-in fade-in duration-200">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0036ce] text-[22px]">
                balance
              </span>
              <h2 className="text-[16px] font-bold text-[#001126]">
                Transparence & Calcul Explicite du Score (100 Pts)
              </h2>
            </div>
            <p className="text-[12px] text-[#44474d] leading-relaxed">
              Le score de préparation n'est pas un algorithme opaque : il est la somme exacte de 5 piliers décomposés ci-dessous. Chaque point correspond à une ressource physique ou une consigne vérifiable.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {scoreResult.pillars.map((pillar) => {
              const isExpanded = expandedPillarId === pillar.id;
              return (
                <div
                  key={pillar.id}
                  className="bg-white rounded-xl shadow-sm border border-[#c4c6ce] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedPillarId(isExpanded ? null : pillar.id)}
                    className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-[#f8f9ff] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#001126] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[22px]">
                          {pillar.icon}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-[#001126]">
                          {pillar.title}
                        </span>
                        <span className="text-[11px] text-[#44474d]">
                          {pillar.formulaExplanation}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex flex-col items-end">
                        <span className="font-['Space_Grotesk'] text-[15px] font-bold text-[#001126]">
                          {pillar.score} / {pillar.maxScore} pts
                        </span>
                        <span
                          className={`text-[10px] font-['Space_Grotesk'] font-bold uppercase ${
                            pillar.status === 'optimal'
                              ? 'text-[#005236]'
                              : pillar.status === 'warning'
                              ? 'text-[#855300]'
                              : 'text-[#ba1a1a]'
                          }`}
                        >
                          {pillar.status === 'optimal' ? 'Conforme' : pillar.status === 'warning' ? 'À compléter' : 'Critique'}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-[20px] text-[#44474d]">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </div>
                  </button>

                  {/* Détail des critères du pilier */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-[#eef4ff] bg-[#f8f9ff] flex flex-col gap-2">
                      <span className="text-[11px] font-['Space_Grotesk'] font-bold text-[#44474d] uppercase tracking-wider">
                        Détail des points attribués :
                      </span>
                      {pillar.details.map((detail, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-white rounded-lg border border-[#d6e4f8] flex items-center justify-between gap-3 text-[12px]"
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-[#001126]">{detail.label}</span>
                            <span className="text-[11px] text-[#44474d]">{detail.comment}</span>
                          </div>
                          <span
                            className={`font-['Space_Grotesk'] text-[13px] font-bold shrink-0 px-2 py-0.5 rounded ${
                              detail.earned === detail.max
                                ? 'bg-[#98f6c5] text-[#005236]'
                                : detail.earned > 0
                                ? 'bg-[#fff0c2] text-[#855300]'
                                : 'bg-[#ffdad6] text-[#ba1a1a]'
                            }`}
                          >
                            {detail.earned} / {detail.max}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL : Configuration détaillée du foyer & besoins spécifiques */}
      {showConfigModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001126]/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="w-full max-w-lg bg-white rounded-2xl p-5 shadow-2xl border border-[#c4c6ce] flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#eef4ff] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#001126] text-[24px]">
                  manage_accounts
                </span>
                <h3 className="text-[17px] font-bold text-[#001126]">
                  Personnalisation du foyer & Besoins
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="w-8 h-8 rounded-full bg-[#f0f4f9] text-[#001126] flex items-center justify-center hover:bg-[#e4efff]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Compteurs de personnes */}
            <div className="flex flex-col gap-3">
              <span className="font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider text-[#44474d]">
                1. Composition des personnes du foyer
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Adultes */}
                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#d6e4f8] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#001126]">Adultes</span>
                    <span className="text-[10px] text-[#44474d]">13 ans et plus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateConfig({ ...config, adultsCount: Math.max(1, config.adultsCount - 1) })
                      }
                      className="w-8 h-8 rounded-lg bg-white border border-[#c4c6ce] font-bold text-[#001126] hover:bg-[#e4efff]"
                    >
                      -
                    </button>
                    <span className="font-['Space_Grotesk'] font-bold text-[15px] min-w-[20px] text-center">
                      {config.adultsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateConfig({ ...config, adultsCount: config.adultsCount + 1 })}
                      className="w-8 h-8 rounded-lg bg-white border border-[#c4c6ce] font-bold text-[#001126] hover:bg-[#e4efff]"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Enfants */}
                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#d6e4f8] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#001126]">Enfants</span>
                    <span className="text-[10px] text-[#44474d]">4 à 12 ans (PPMS)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateConfig({ ...config, childrenCount: Math.max(0, config.childrenCount - 1) })
                      }
                      className="w-8 h-8 rounded-lg bg-white border border-[#c4c6ce] font-bold text-[#001126] hover:bg-[#e4efff]"
                    >
                      -
                    </button>
                    <span className="font-['Space_Grotesk'] font-bold text-[15px] min-w-[20px] text-center">
                      {config.childrenCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateConfig({ ...config, childrenCount: config.childrenCount + 1 })}
                      className="w-8 h-8 rounded-lg bg-white border border-[#c4c6ce] font-bold text-[#001126] hover:bg-[#e4efff]"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Nourrissons */}
                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#d6e4f8] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#001126]">Nourrissons</span>
                    <span className="text-[10px] text-[#44474d]">0 à 3 ans (Lait/Couches)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateConfig({ ...config, infantsCount: Math.max(0, config.infantsCount - 1) })
                      }
                      className="w-8 h-8 rounded-lg bg-white border border-[#c4c6ce] font-bold text-[#001126] hover:bg-[#e4efff]"
                    >
                      -
                    </button>
                    <span className="font-['Space_Grotesk'] font-bold text-[15px] min-w-[20px] text-center">
                      {config.infantsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateConfig({ ...config, infantsCount: config.infantsCount + 1 })}
                      className="w-8 h-8 rounded-lg bg-white border border-[#c4c6ce] font-bold text-[#001126] hover:bg-[#e4efff]"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Aînés */}
                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#d6e4f8] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#001126]">Aînés</span>
                    <span className="text-[10px] text-[#44474d]">Personnes âgées</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateConfig({ ...config, elderlyCount: Math.max(0, config.elderlyCount - 1) })
                      }
                      className="w-8 h-8 rounded-lg bg-white border border-[#c4c6ce] font-bold text-[#001126] hover:bg-[#e4efff]"
                    >
                      -
                    </button>
                    <span className="font-['Space_Grotesk'] font-bold text-[15px] min-w-[20px] text-center">
                      {config.elderlyCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateConfig({ ...config, elderlyCount: config.elderlyCount + 1 })}
                      className="w-8 h-8 rounded-lg bg-white border border-[#c4c6ce] font-bold text-[#001126] hover:bg-[#e4efff]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Animaux */}
              <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#d6e4f8] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#001126]">Animaux de compagnie</span>
                  <span className="text-[10px] text-[#44474d]">
                    +0,5L d'eau/jour/animal + caisse de transport
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateConfig({ ...config, petsCount: Math.max(0, config.petsCount - 1) })
                    }
                    className="w-8 h-8 rounded-lg bg-white border border-[#c4c6ce] font-bold text-[#001126] hover:bg-[#e4efff]"
                  >
                    -
                  </button>
                  <span className="font-['Space_Grotesk'] font-bold text-[15px] min-w-[20px] text-center">
                    {config.petsCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateConfig({ ...config, petsCount: config.petsCount + 1 })}
                    className="w-8 h-8 rounded-lg bg-white border border-[#c4c6ce] font-bold text-[#001126] hover:bg-[#e4efff]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Besoins spécifiques à cocher */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#eef4ff]">
              <span className="font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider text-[#44474d]">
                2. Besoins spécifiques & Vulnérabilités
              </span>

              <label className="flex items-center justify-between p-3 rounded-xl border border-[#d6e4f8] bg-[#f8f9ff] cursor-pointer hover:bg-[#eef4ff]">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#001126]">accessible</span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#001126]">
                      Personne à mobilité réduite (PMR) / Handicap
                    </span>
                    <span className="text-[11px] text-[#44474d]">
                      Fauteuil de transport ou assistance évacuation escalier
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.hasPmr}
                  onChange={(e) => updateConfig({ ...config, hasPmr: e.target.checked })}
                  className="w-5 h-5 rounded text-[#001126]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-[#d6e4f8] bg-[#f8f9ff] cursor-pointer hover:bg-[#eef4ff]">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#ba1a1a]">prescriptions</span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#001126]">
                      Affection de longue durée / Traitement vital
                    </span>
                    <span className="text-[11px] text-[#44474d]">
                      Nécessite stock tampon 15-30j + ordonnances papier scellées
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.hasChronicCondition}
                  onChange={(e) => updateConfig({ ...config, hasChronicCondition: e.target.checked })}
                  className="w-5 h-5 rounded text-[#001126]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-[#d6e4f8] bg-[#f8f9ff] cursor-pointer hover:bg-[#eef4ff]">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#855300]">warning</span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#001126]">
                      Voisinage site Seveso seuil haut ou centrale nucléaire PPI
                    </span>
                    <span className="text-[11px] text-[#44474d]">
                      Exige calfeutrage renforcé, masques FFP3 et comprimés d'iode
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.isNearSevesoOrNpp}
                  onChange={(e) => updateConfig({ ...config, isNearSevesoOrNpp: e.target.checked })}
                  className="w-5 h-5 rounded text-[#001126]"
                />
              </label>
            </div>

            {/* Durée cible */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#eef4ff]">
              <span className="font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider text-[#44474d]">
                3. Durée de coupure visée
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { days: 2, label: '48 Heures (2 jours)' },
                  { days: 3, label: '72 Heures (Standard)' },
                  { days: 7, label: '7 Jours (Avancé)' }
                ].map((d) => (
                  <button
                    key={d.days}
                    type="button"
                    onClick={() => updateConfig({ ...config, targetDurationDays: d.days })}
                    className={`min-h-[44px] px-2 rounded-xl font-['Space_Grotesk'] text-[12px] font-bold transition-all ${
                      config.targetDurationDays === d.days
                        ? 'bg-[#001126] text-white shadow-xs'
                        : 'bg-[#f0f4f9] text-[#44474d] hover:bg-[#e4efff]'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowConfigModal(false)}
              className="w-full min-h-[44px] rounded-xl bg-[#001126] hover:bg-[#0024a8] text-white font-['Space_Grotesk'] text-[13px] font-bold uppercase transition-colors shadow-xs mt-2"
            >
              Enregistrer et recalculer mon score
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
