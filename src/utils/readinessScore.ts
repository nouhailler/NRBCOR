import { KitItem, SpecificNeedsConfig, ReadinessScoreResult, ScorePillar } from '../types';
import { InventoryItem, FamilyPlanData } from '../services/storage/StorageRepository';
import { KIT_CATEGORIES } from '../data/kitData';

export interface AutonomyMetric {
  title: string;
  currentValue: number;
  currentUnit: string;
  targetValue: number;
  targetUnit: string;
  autonomyHours: number;
  autonomyDays: number;
  status: 'optimal' | 'warning' | 'critical' | 'insufficient_data';
  isEstimatedFromCheckboxOnly?: boolean;
  hasInsufficientData?: boolean;
  details: string;
  hypothesis?: string;
  recommendation?: string;
}

export interface HouseholdAutonomySummary {
  water: AutonomyMetric;
  food: AutonomyMetric;
  lighting: AutonomyMetric;
  energy: AutonomyMetric;
}

export interface MissingKitItemEntry {
  item: KitItem;
  priority: 1 | 2 | 3; // 1: Vital, 2: Sécurité, 3: Logistique
  categoryName: string;
}

export interface ExpiryAuditEntry {
  expired: InventoryItem[];
  expiringSoon: { item: InventoryItem; daysRemaining: number }[];
  compliantCount: number;
  lastCheckedDate: string | null;
  daysSinceLastCheck: number;
  needsPeriodicReview: boolean;
}

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  pointsGain: number;
  icon: string;
  actionType: 'check_kit' | 'water_adjust' | 'inventory_renew' | 'family_plan' | 'needs_adjust';
  targetId?: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface HouseholdSummaryInfo {
  totalPersons: number;
  adults: number;
  children: number;
  infants: number;
  elderly: number;
  pets: number;
  targetDays: number;
  hasPmr: boolean;
  hasChronicCondition: boolean;
}

export interface ReadinessDashboardData {
  scoreResult: ReadinessScoreResult;
  autonomy: HouseholdAutonomySummary;
  missingItems: MissingKitItemEntry[];
  expiries: ExpiryAuditEntry;
  recommendedActions: RecommendedAction[];
  householdSummary: HouseholdSummaryInfo;
}

/**
 * Calcule l'autonomie en eau potable à partir de l'inventaire mesuré et des paramètres du foyer.
 * Distingue rigoureusement les quantités mesurées en litres des simples cases cochées dans le kit.
 */
export function calculateWaterAutonomy(
  config: SpecificNeedsConfig,
  inventoryItems: InventoryItem[],
  kitItems: KitItem[]
): AutonomyMetric {
  const totalPersons = Math.max(1, config.adultsCount + config.childrenCount + config.infantsCount + config.elderlyCount);
  // Norme Sécurité Civile : 3.0 L/jour/personne (2L hydratation vitale + 1L hygiène minimale et réhydratation) + 0.5 L/jour/animal
  const dailyNeedLitres = totalPersons * 3.0 + config.petsCount * 0.5;
  const targetLitres = dailyNeedLitres * config.targetDurationDays;

  // Détection des réserves d'eau réelles et mesurées dans l'inventaire
  let stockLitres = 0;
  let itemsCount = 0;
  for (const item of inventoryItems) {
    const cat = (item.category || '').toLowerCase();
    const name = (item.name || '').toLowerCase();
    const unit = (item.unit || '').toLowerCase();

    if (cat.includes('eau') || name.includes('eau') || name.includes('pack')) {
      itemsCount++;
      // Détection de packs "6x1.5L" (= 9L par pack)
      if (name.includes('6x1.5') || unit.includes('27l') || name.includes("packs d'eau") || unit.includes('pack (9l)')) {
        stockLitres += item.quantity * 9;
      } else if (unit.includes('l') || unit.includes('litres')) {
        const match = unit.match(/(\d+(?:\.\d+)?)\s*l/i);
        if (match) {
          stockLitres += item.quantity * parseFloat(match[1]);
        } else {
          stockLitres += item.quantity * 1.5;
        }
      } else {
        stockLitres += item.quantity * 1.5;
      }
    }
  }

  const waterKitItem = kitItems.find((it) => it.id === 'k1');
  const targetHours = config.targetDurationDays * 24;
  const hypothesis = `Hypothèse réglementaire : 3,0 L/j/personne (2L boisson vitale + 1L hygiène minimale) + 0,5 L/j/animal domestique sur ${config.targetDurationDays} jours.`;

  // 1. Cas où l'utilisateur a renseigné des articles mesurés dans l'inventaire
  if (stockLitres > 0) {
    const hours = dailyNeedLitres > 0 ? Math.round((stockLitres / dailyNeedLitres) * 24) : 0;
    const days = Math.round((hours / 24) * 10) / 10;
    let status: 'optimal' | 'warning' | 'critical' = 'critical';
    if (hours >= targetHours) {
      status = 'optimal';
    } else if (hours >= 24) {
      status = 'warning';
    }

    return {
      title: 'Eau Potable Vitale',
      currentValue: Math.round(stockLitres * 10) / 10,
      currentUnit: 'Litres mesurés',
      targetValue: Math.round(targetLitres * 10) / 10,
      targetUnit: 'Litres requis',
      autonomyHours: hours,
      autonomyDays: days,
      status,
      isEstimatedFromCheckboxOnly: false,
      hasInsufficientData: false,
      details: `${Math.round(stockLitres)}L mesurés pour ${totalPersons} pers. + ${config.petsCount} animal(aux) (${dailyNeedLitres}L/jour requis).`,
      hypothesis,
      recommendation:
        stockLitres < targetLitres
          ? `Ajouter ${Math.ceil(targetLitres - stockLitres)}L d'eau scellée dans l'inventaire pour sécuriser ${targetHours}h.`
          : undefined
    };
  }

  // 2. Cas où l'utilisateur a coché la case k1 ("Pack d'eau") mais sans article mesuré dans l'inventaire
  // ATTENTION : Ne JAMAIS considérer que l'objectif est atteint par magie ! Signaler explicitement "données insuffisantes"
  if (waterKitItem?.completed) {
    return {
      title: 'Eau Potable Vitale',
      currentValue: 0,
      currentUnit: 'Litres non quantifiés',
      targetValue: Math.round(targetLitres * 10) / 10,
      targetUnit: 'Litres requis',
      autonomyHours: 0,
      autonomyDays: 0,
      status: 'insufficient_data',
      isEstimatedFromCheckboxOnly: true,
      hasInsufficientData: true,
      details: 'Données insuffisantes : élément coché dans la liste du kit mais aucun volume mesuré dans l’inventaire. Renseignez vos packs d’eau pour calculer l’autonomie réelle en heures.',
      hypothesis,
      recommendation: 'Ajouter vos packs d\'eau (ex: 6x1.5L) dans l\'onglet Inventaire pour certifier votre autonomie réelle.'
    };
  }

  // 3. Aucun stock mesuré et case k1 non cochée
  return {
    title: 'Eau Potable Vitale',
    currentValue: 0,
    currentUnit: 'Litres',
    targetValue: Math.round(targetLitres * 10) / 10,
    targetUnit: 'Litres requis',
    autonomyHours: 0,
    autonomyDays: 0,
    status: 'critical',
    isEstimatedFromCheckboxOnly: false,
    hasInsufficientData: false,
    details: `Aucune réserve d'eau potable recensée pour ${totalPersons} personne(s). Risque vital dès 24h de coupure.`,
    hypothesis,
    recommendation: `Constituer immédiatement une réserve scellée d'au moins ${Math.ceil(targetLitres)}L (3L/pers/jour).`
  };
}

/**
 * Calcule l'autonomie en nourriture prête sans cuisson à partir de l'inventaire mesuré.
 * Ne confond pas le nombre d'articles avec des rations complètes équilibrées (2 000 kcal/adulte/jour).
 */
export function calculateFoodAutonomy(
  config: SpecificNeedsConfig,
  inventoryItems: InventoryItem[],
  kitItems: KitItem[]
): AutonomyMetric {
  const adultsAndKids = Math.max(1, config.adultsCount + config.childrenCount + config.elderlyCount);
  // Hypothèse : 2 portions énergétiques complètes sans cuisson/adulte et enfant/jour (~2 000 kcal)
  // + 3 rations spécifiques (laits infantiles prêts, petits pots) si nourrisson présent
  const dailyRationsNeeded = adultsAndKids * 2 + config.infantsCount * 3;
  const targetRations = dailyRationsNeeded * config.targetDurationDays;
  const targetHours = config.targetDurationDays * 24;

  let rationsInStock = 0;
  for (const item of inventoryItems) {
    const cat = (item.category || '').toLowerCase();
    const name = (item.name || '').toLowerCase();
    if (cat.includes('aliment') || name.includes('conserve') || name.includes('ration') || name.includes('barre') || name.includes('repas')) {
      // Une boîte de conserve standard ou une barre énergétique = 1 ration / portion énergétique
      rationsInStock += item.quantity;
    }
  }

  const foodKitItem = kitItems.find((it) => it.id === 'k3');
  const hypothesis = `Hypothèse nutritionnelle : 2 rations complètes sans cuisson (conserves prêtes, barres denses ~2 000 kcal/j) par adulte/enfant + 3 portions adaptées/jour par nourrisson.`;

  // 1. Stock mesuré présent dans l'inventaire
  if (rationsInStock > 0) {
    const days = dailyRationsNeeded > 0 ? Math.round((rationsInStock / dailyRationsNeeded) * 10) / 10 : 0;
    const hours = Math.round(days * 24);
    let status: 'optimal' | 'warning' | 'critical' = 'critical';
    if (hours >= targetHours) {
      status = 'optimal';
    } else if (hours >= 24) {
      status = 'warning';
    }

    return {
      title: 'Alimentation de Survie',
      currentValue: rationsInStock,
      currentUnit: 'rations mesurées',
      targetValue: targetRations,
      targetUnit: 'rations requises',
      autonomyHours: hours,
      autonomyDays: days,
      status,
      isEstimatedFromCheckboxOnly: false,
      hasInsufficientData: false,
      details: `${rationsInStock} portions prêtes sans cuisson (${dailyRationsNeeded}/jour nécessaires pour le foyer).`,
      hypothesis,
      recommendation:
        rationsInStock < targetRations
          ? `Compléter avec ${targetRations - rationsInStock} rations ou conserves prêtes sans réchauffage.`
          : undefined
    };
  }

  // 2. Case cochée k3 ("Nourriture non périssable") sans article mesuré dans l'inventaire
  // Ne pas inventer que le foyer a ses 72h de vivres !
  if (foodKitItem?.completed) {
    return {
      title: 'Alimentation de Survie',
      currentValue: 0,
      currentUnit: 'non quantifié',
      targetValue: targetRations,
      targetUnit: 'rations requises',
      autonomyHours: 0,
      autonomyDays: 0,
      status: 'insufficient_data',
      isEstimatedFromCheckboxOnly: true,
      hasInsufficientData: true,
      details: 'Données insuffisantes : vivres cochés dans le kit sans quantité mesurée dans l’inventaire. Une boîte ou un sachet ne correspond pas nécessairement à un repas complet pour une personne.',
      hypothesis,
      recommendation: 'Ajouter vos conserves, barres et petits pots dans l’Inventaire pour évaluer précisément la couverture calorique du foyer.'
    };
  }

  // 3. Aucun aliment mesuré et non coché
  return {
    title: 'Alimentation de Survie',
    currentValue: 0,
    currentUnit: 'rations',
    targetValue: targetRations,
    targetUnit: 'rations requises',
    autonomyHours: 0,
    autonomyDays: 0,
    status: 'critical',
    isEstimatedFromCheckboxOnly: false,
    hasInsufficientData: false,
    details: 'Aucune ration sans cuisson renseignée. Nécessité de vivres consommables sans gaz ni électricité.',
    hypothesis,
    recommendation: `Constituer un stock de ${targetRations} rations (conserves ouverture facile, fruits secs, barres).`
  };
}

/**
 * Calcule l'autonomie d'éclairage
 */
export function calculateLightingAutonomy(
  inventoryItems: InventoryItem[],
  kitItems: KitItem[]
): AutonomyMetric {
  const hasTorch = kitItems.find((it) => it.id === 'k7')?.completed ?? false;
  let batteryCount = 0;

  for (const item of inventoryItems) {
    const name = (item.name || '').toLowerCase();
    const cat = (item.category || '').toLowerCase();
    if (name.includes('pile') || cat.includes('lumière') || cat.includes('énergie')) {
      batteryCount += item.quantity;
    }
  }

  // 1 jeu de 4 piles = ~30h d'éclairage LED intermittent
  const estimatedHours = hasTorch ? Math.min(240, 20 + Math.floor(batteryCount / 2) * 15) : 0;
  const days = Math.round((estimatedHours / 24) * 10) / 10;

  let status: 'optimal' | 'warning' | 'critical' = 'critical';
  if (hasTorch && batteryCount >= 8) {
    status = 'optimal';
  } else if (hasTorch) {
    status = 'warning';
  }

  return {
    title: 'Éclairage Autonome',
    currentValue: estimatedHours,
    currentUnit: 'heures d\'éclairage',
    targetValue: 72,
    targetUnit: 'heures',
    autonomyHours: estimatedHours,
    autonomyDays: days,
    status,
    details: `${hasTorch ? 'Lampe frontale/torche active' : 'Aucune lampe'} • ${batteryCount} piles en réserve.`,
    recommendation: !hasTorch
      ? 'Ajouter une lampe torche LED étanche ou frontale.'
      : batteryCount < 8
      ? 'Compléter le lot de piles alcalines de secours.'
      : undefined
  };
}

/**
 * Calcule l'autonomie énergétique & radio
 */
export function calculateEnergyAutonomy(
  inventoryItems: InventoryItem[],
  kitItems: KitItem[]
): AutonomyMetric {
  const hasPowerbank = kitItems.find((it) => it.id === 'k8')?.completed ?? false;
  const hasRadio = kitItems.find((it) => it.id === 'k5')?.completed ?? false;

  // 1 Powerbank 20 000 mAh = ~4 recharges de téléphone = ~96h d'autonomie GSM frugale
  const estimatedHours = hasPowerbank ? 96 : 12;
  const days = Math.round((estimatedHours / 24) * 10) / 10;

  let status: 'optimal' | 'warning' | 'critical' = 'critical';
  if (hasPowerbank && hasRadio) {
    status = 'optimal';
  } else if (hasPowerbank || hasRadio) {
    status = 'warning';
  }

  return {
    title: 'Énergie & Info Radio',
    currentValue: estimatedHours,
    currentUnit: 'heures de veille',
    targetValue: 72,
    targetUnit: 'heures',
    autonomyHours: estimatedHours,
    autonomyDays: days,
    status,
    details: `${hasPowerbank ? 'Powerbank chargée (~4 recharges)' : 'Pas de batterie secours'} • ${
      hasRadio ? 'Radio FM alerte opérationnelle' : 'Pas de radio autonome'
    }.`,
    recommendation: !hasRadio
      ? 'Se procurer une radio FM/DAB+ à manivelle ou à piles (priorité Sécurité Civile).'
      : !hasPowerbank
      ? 'Prévoir une batterie externe 20 000 mAh maintenue chargée.'
      : undefined
  };
}

/**
 * Moteur principal de calcul du score de préparation explicite (100 pts)
 */
export function calculateReadinessScore(
  config: SpecificNeedsConfig,
  kitItems: KitItem[],
  inventoryItems: InventoryItem[],
  familyPlan: FamilyPlanData
): ReadinessDashboardData {
  const totalPersons = Math.max(1, config.adultsCount + config.childrenCount + config.infantsCount + config.elderlyCount);

  // 1. Calcul des autonomies
  const waterAutonomy = calculateWaterAutonomy(config, inventoryItems, kitItems);
  const foodAutonomy = calculateFoodAutonomy(config, inventoryItems, kitItems);
  const lightingAutonomy = calculateLightingAutonomy(inventoryItems, kitItems);
  const energyAutonomy = calculateEnergyAutonomy(inventoryItems, kitItems);

  // 2. Audit des dates de péremption
  const now = new Date().getTime();
  const expired: InventoryItem[] = [];
  const expiringSoon: { item: InventoryItem; daysRemaining: number }[] = [];
  let compliantCount = 0;
  let mostRecentCheck: number | null = null;

  for (const item of inventoryItems) {
    if (item.lastCheckedAt) {
      const t = new Date(item.lastCheckedAt).getTime();
      if (!mostRecentCheck || t > mostRecentCheck) {
        mostRecentCheck = t;
      }
    }

    if (!item.expiryDate) {
      compliantCount++;
      continue;
    }

    const exp = new Date(item.expiryDate).getTime();
    const diffDays = Math.round((exp - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      expired.push(item);
    } else if (diffDays <= 60) {
      expiringSoon.push({ item, daysRemaining: diffDays });
    } else {
      compliantCount++;
    }
  }

  const daysSinceLastCheck = mostRecentCheck
    ? Math.max(0, Math.round((now - mostRecentCheck) / (1000 * 60 * 60 * 24)))
    : 999;
  const needsPeriodicReview = daysSinceLastCheck > 180 || expired.length > 0;

  // 3. Éléments manquants dans le kit
  const missingItems: MissingKitItemEntry[] = [];
  for (const it of kitItems) {
    if (!it.completed) {
      const cat = KIT_CATEGORIES.find((c) => c.id === it.category);
      let priority: 1 | 2 | 3 = 3;
      if (it.isEssential || it.category === 1 || it.category === 3) {
        priority = 1;
      } else if (it.category === 4 || it.category === 5) {
        priority = 2;
      }
      missingItems.push({
        item: it,
        priority,
        categoryName: cat?.name || 'Général'
      });
    }
  }
  missingItems.sort((a, b) => a.priority - b.priority);

  // 4. Calcul des 5 Piliers Explicites
  // --- PILIER 1 : Réserves Vitales (25 points max) ---
  const waterTargetHours = config.targetDurationDays * 24;
  let waterPoints = 0;
  let waterComment = '';

  if (waterAutonomy.hasInsufficientData) {
    // Case cochée dans le kit mais sans inventaire mesuré : points déclaratifs partiels plafonnés à 4/15
    waterPoints = 4;
    waterComment = 'Coché dans le kit mais volume non mesuré en inventaire (4/15 pts déclaratifs). Renseignez vos packs d’eau pour valider les 15 pts.';
  } else if (waterAutonomy.autonomyHours > 0) {
    const waterRatio = Math.min(1, waterAutonomy.autonomyHours / Math.max(1, waterTargetHours));
    waterPoints = Math.round(waterRatio * 15);
    waterComment = `${waterAutonomy.currentValue}L mesurés • ${waterAutonomy.autonomyHours}h d'autonomie certifiée (${waterPoints}/15 pts).`;
  } else {
    waterPoints = 0;
    waterComment = `Aucune réserve d'eau (0/15 pts) - Risque vital dès 24h.`;
  }

  let foodPoints = 0;
  let foodComment = '';
  if (foodAutonomy.hasInsufficientData) {
    // Vivres cochés dans le kit mais sans inventaire mesuré : points déclaratifs partiels plafonnés à 2/7
    foodPoints = 2;
    foodComment = 'Coché dans le kit sans quantification en inventaire (2/7 pts déclaratifs). Renseignez vos rations pour valider les 7 pts.';
  } else if (foodAutonomy.autonomyHours > 0) {
    const foodRatio = Math.min(1, foodAutonomy.autonomyHours / Math.max(1, waterTargetHours));
    foodPoints = Math.round(foodRatio * 7);
    foodComment = `${foodAutonomy.currentValue} portions mesurées • ${foodAutonomy.autonomyHours}h de repas sécurisés (${foodPoints}/7 pts).`;
  } else {
    foodPoints = 0;
    foodComment = 'Aucune ration sans cuisson renseignée (0/7 pts).';
  }

  const hasWaterPurification = kitItems.find((it) => it.id === 'k2')?.completed ?? false;
  const purificationPoints = hasWaterPurification ? 3 : 0;

  const pillar1Score = Math.min(25, waterPoints + foodPoints + purificationPoints);
  const pillar1: ScorePillar = {
    id: 'reserves',
    title: 'Réserves Vitales (Eau & Alimentation)',
    score: pillar1Score,
    maxScore: 25,
    icon: 'water_drop',
    status: pillar1Score >= 20 ? 'optimal' : pillar1Score >= 12 ? 'warning' : 'critical',
    formulaExplanation:
      'Dimensionnement proportionnel aux personnes du foyer (3L/jour/pers) et aux rations sans cuisson. Distingue rigoureusement les quantités mesurées en inventaire des simples cases cochées.',
    details: [
      {
        label: `Eau Potable (${waterAutonomy.currentValue}L / ${waterAutonomy.targetValue}L requis)`,
        earned: waterPoints,
        max: 15,
        comment: waterComment
      },
      {
        label: `Nourriture sans cuisson (${foodAutonomy.currentValue} / ${foodAutonomy.targetValue} rations)`,
        earned: foodPoints,
        max: 7,
        comment: foodComment
      },
      {
        label: 'Purification d\'eau de secours (Micropur)',
        earned: purificationPoints,
        max: 3,
        comment: hasWaterPurification ? 'Pastilles présentes dans le kit.' : 'Pastilles non validées.'
      }
    ]
  };

  // --- PILIER 2 : Énergie, Éclairage & Communication (20 points max) ---
  const hasRadio = kitItems.find((it) => it.id === 'k5')?.completed ?? false;
  const radioPoints = hasRadio ? 8 : 0;

  const hasTorch = kitItems.find((it) => it.id === 'k7')?.completed ?? false;
  const torchPoints = hasTorch ? 5 : 0;

  const hasPowerbank = kitItems.find((it) => it.id === 'k8')?.completed ?? false;
  const powerbankPoints = hasPowerbank ? 4 : 0;

  const hasSpareBatteries = kitItems.find((it) => it.id === 'k6')?.completed ?? false;
  const spareBatteriesPoints = hasSpareBatteries ? 3 : 0;

  const pillar2Score = Math.min(20, radioPoints + torchPoints + powerbankPoints + spareBatteriesPoints);
  const pillar2: ScorePillar = {
    id: 'energie_comms',
    title: 'Énergie, Éclairage & Réception d\'Alerte',
    score: pillar2Score,
    maxScore: 20,
    icon: 'cell_tower',
    status: pillar2Score >= 16 ? 'optimal' : pillar2Score >= 10 ? 'warning' : 'critical',
    formulaExplanation:
      'Garantie de réception des ordres de la Sécurité Civile (radio FM/DAB+ indépendante) et continuité d\'éclairage.',
    details: [
      {
        label: 'Radio d\'urgence autonome (manivelle / piles)',
        earned: radioPoints,
        max: 8,
        comment: hasRadio ? 'Canal officiel FM/DAB+ opérationnel.' : 'Manquante (canal d\'alerte prioritaire).'
      },
      {
        label: 'Lampe frontale ou torche LED étanche',
        earned: torchPoints,
        max: 5,
        comment: hasTorch ? 'Éclairage directionnel prêt.' : 'Non validée.'
      },
      {
        label: 'Batterie externe smartphone (Powerbank)',
        earned: powerbankPoints,
        max: 4,
        comment: hasPowerbank ? 'Alimentation mobile sécurisée.' : 'Non cochée.'
      },
      {
        label: 'Piles de rechange adaptées en stock',
        earned: spareBatteriesPoints,
        max: 3,
        comment: hasSpareBatteries ? 'Lot de piles scellées.' : 'Manquantes.'
      }
    ]
  };

  // --- PILIER 3 : Santé, Hygiène & Besoins Spécifiques (20 points max) ---
  const hasFirstAid = kitItems.find((it) => it.id === 'k9')?.completed ?? false;
  const firstAidPoints = hasFirstAid ? 6 : 0;

  // Traitement chronique : si activé, vérifier kit k10 ; si désactivé, points accordés
  const chronicKit = kitItems.find((it) => it.id === 'k10')?.completed ?? false;
  let chronicPoints = 5;
  let chronicComment = 'Aucun traitement lourd permanent déclaré.';
  if (config.hasChronicCondition) {
    chronicPoints = chronicKit ? 5 : 0;
    chronicComment = chronicKit
      ? 'Réserve 15-30j + ordonnances papier validées.'
      : 'Traitement chronique déclaré mais réserve non validée.';
  }

  // Besoins spécifiques (bébé, PMR, animaux)
  let specificNeedsPoints = 5;
  const specificRemarks: string[] = [];
  if (config.infantsCount > 0) {
    specificRemarks.push('Nourrisson pris en compte');
  }
  if (config.hasPmr) {
    specificRemarks.push('Mobilité réduite anticipée');
  }
  if (config.petsCount > 0) {
    specificRemarks.push(`Animaux (${config.petsCount}) prévus`);
  }
  if (config.isNearSevesoOrNpp) {
    specificRemarks.push('Zone industrielle/PPI surveillée');
  }

  const hasHygiene = kitItems.find((it) => it.id === 'k18')?.completed ?? false;
  const hygienePoints = hasHygiene ? 4 : 1;

  const pillar3Score = Math.min(20, firstAidPoints + chronicPoints + specificNeedsPoints + hygienePoints);
  const pillar3: ScorePillar = {
    id: 'sante_besoins',
    title: 'Santé, Hygiène & Besoins Spécifiques',
    score: pillar3Score,
    maxScore: 20,
    icon: 'medical_services',
    status: pillar3Score >= 16 ? 'optimal' : pillar3Score >= 10 ? 'warning' : 'critical',
    formulaExplanation:
      'Trousse de premiers secours normée, couverture médicale personnelle et adaptation aux particularités du foyer.',
    details: [
      {
        label: 'Trousse de premiers secours normée',
        earned: firstAidPoints,
        max: 6,
        comment: hasFirstAid ? 'Matériel de premiers soins complet.' : 'Trousse incomplète.'
      },
      {
        label: 'Traitements médicaux & ordonnances',
        earned: chronicPoints,
        max: 5,
        comment: chronicComment
      },
      {
        label: 'Besoins spécifiques du foyer (PMR, bébés, animaux)',
        earned: specificNeedsPoints,
        max: 5,
        comment: specificRemarks.length > 0 ? specificRemarks.join(' • ') : 'Configuration standard sans contrainte.'
      },
      {
        label: 'Hygiène sans eau & sacs étanches',
        earned: hygienePoints,
        max: 4,
        comment: hasHygiene ? 'Gel, lingettes et ensachage disponibles.' : 'À compléter.'
      }
    ]
  };

  // --- PILIER 4 : Plan Familial & Procédures de Crise (20 points max) ---
  const hasOutZoneContact = !!familyPlan?.outZoneContact?.name && familyPlan.outZoneContact.name.length > 2;
  const outZonePoints = hasOutZoneContact ? 6 : 0;

  const doneTasks = familyPlan?.tasks?.filter((t) => t.done).length || 0;
  const totalTasks = familyPlan?.tasks?.length || 1;
  const taskRatio = Math.min(1, doneTasks / Math.max(1, totalTasks));
  const planTasksPoints = Math.round(taskRatio * 8);

  const hasIdCopies = kitItems.find((it) => it.id === 'k16')?.completed ?? false;
  const idCopiesPoints = hasIdCopies ? 3 : 0;

  const hasSurvivalBlankets = kitItems.find((it) => it.id === 'k11')?.completed ?? false;
  const blanketsPoints = hasSurvivalBlankets ? 3 : 0;

  const pillar4Score = Math.min(20, outZonePoints + planTasksPoints + idCopiesPoints + blanketsPoints);
  const pillar4: ScorePillar = {
    id: 'plan_famille',
    title: 'Plan Familial & Procédures de Repli',
    score: pillar4Score,
    maxScore: 20,
    icon: 'group',
    status: pillar4Score >= 16 ? 'optimal' : pillar4Score >= 10 ? 'warning' : 'critical',
    formulaExplanation:
      'Désignation d\'un relais hors-zone, connaissance des vannes d\'arrêt d\'urgence et point de ralliement convenu.',
    details: [
      {
        label: 'Contact relais hors-zone (> 100 km)',
        earned: outZonePoints,
        max: 6,
        comment: hasOutZoneContact
          ? `${familyPlan.outZoneContact?.name} désigné.`
          : 'Non renseigné (crucial si saturation locale GSM).'
      },
      {
        label: `Missions & consignes de repli (${doneTasks}/${totalTasks} actions)`,
        earned: planTasksPoints,
        max: 8,
        comment: 'Vannes gaz/eau, disjoncteur et PPMS école validés.'
      },
      {
        label: 'Copies étanches des pièces d\'identité',
        earned: idCopiesPoints,
        max: 3,
        comment: hasIdCopies ? 'Dossier scellé prêt.' : 'À imprimer et ensacher.'
      },
      {
        label: 'Couvertures de survie pour chaque membre',
        earned: blanketsPoints,
        max: 3,
        comment: hasSurvivalBlankets ? 'Protection thermique présente.' : 'Non cochée.'
      }
    ]
  };

  // --- PILIER 5 : Vigilance Logistique & Suivi des Péremptions (15 points max) ---
  let expiryPoints = 6;
  if (expired.length > 0) {
    expiryPoints = Math.max(0, 6 - expired.length * 2);
  }

  let auditPoints = 5;
  if (daysSinceLastCheck > 180) {
    auditPoints = 1;
  } else if (daysSinceLastCheck > 90) {
    auditPoints = 3;
  }

  const hasNrbcMaterial =
    (kitItems.find((it) => it.id === 'k12')?.completed ?? false) &&
    (kitItems.find((it) => it.id === 'k15')?.completed ?? false);
  const nrbcPoints = hasNrbcMaterial ? 4 : 2;

  const pillar5Score = Math.min(15, expiryPoints + auditPoints + nrbcPoints);
  const pillar5: ScorePillar = {
    id: 'logistique_audit',
    title: 'Vigilance Logistique & Maintenance',
    score: pillar5Score,
    maxScore: 15,
    icon: 'inventory_2',
    status: pillar5Score >= 12 ? 'optimal' : pillar5Score >= 7 ? 'warning' : 'critical',
    formulaExplanation:
      'Contrôle semestriel des stocks, élimination des périmés et présence du matériel de calfeutrage.',
    details: [
      {
        label: `Dates de péremption (${expired.length} dépassé${expired.length > 1 ? 's' : ''})`,
        earned: expiryPoints,
        max: 6,
        comment: expired.length === 0 ? 'Aucun produit périmé détecté.' : `${expired.length} article(s) à renouveler sans délai.`
      },
      {
        label: `Dernier contrôle semestriel (${daysSinceLastCheck === 999 ? 'Jamais' : `Il y a ${daysSinceLastCheck} j`})`,
        earned: auditPoints,
        max: 5,
        comment: daysSinceLastCheck <= 90 ? 'Audit récent à jour.' : 'Révision périodique recommandée.'
      },
      {
        label: 'Kit de calfeutrage hermétique & masques FFP3',
        earned: nrbcPoints,
        max: 4,
        comment: hasNrbcMaterial ? 'Ruban toilé & filtration prêts.' : 'À vérifier.'
      }
    ]
  };

  // Score total sur 100
  const totalScore = pillar1Score + pillar2Score + pillar3Score + pillar4Score + pillar5Score;

  // Définition du niveau de progression
  let level = {
    number: 1,
    title: 'Phase 1 — Démarrage & Vulnérabilité',
    badge: 'Niveau 1',
    color: '#ba1a1a',
    description: 'Besoins vitaux de base non sécurisés. Un événement imprévu entraînerait une rupture rapide de l\'autonomie.'
  };

  if (totalScore >= 90) {
    level = {
      number: 4,
      title: 'Phase 4 — Résilience Complète & Maîtrise',
      badge: 'Niveau 4 • Opérationnel',
      color: '#005236',
      description: 'Excellente anticipation des 72h. Stocks dimensionnés, plan familial rodé et suivi logistique rigoureux.'
    };
  } else if (totalScore >= 70) {
    level = {
      number: 3,
      title: 'Phase 3 — Résilience 72h Consolidée',
      badge: 'Niveau 3 • Consolidé',
      color: '#0036ce',
      description: 'L\'essentiel des besoins vitaux et des consignes d\'urgence est acquis pour les 3 premiers jours de crise.'
    };
  } else if (totalScore >= 40) {
    level = {
      number: 2,
      title: 'Phase 2 — Autonomie Initiale (24h-48h)',
      badge: 'Niveau 2 • En progrès',
      color: '#855300',
      description: 'Premières mesures prises. Il reste des angles morts majeurs en communication ou réserves d\'eau.'
    };
  }

  // 5. Génération dynamique des Actions Recommandées prioritaires
  const recommendedActions: RecommendedAction[] = [];

  if (waterAutonomy.autonomyHours < waterTargetHours) {
    const missingLitres = Math.ceil(waterAutonomy.targetValue - waterAutonomy.currentValue);
    recommendedActions.push({
      id: 'act-water',
      title: `Ajouter ${missingLitres}L d'eau potable`,
      description: `Atteindre ${waterAutonomy.targetValue}L pour assurer l'autonomie vitale de ${totalPersons} personne(s) sur ${config.targetDurationDays} jours.`,
      pointsGain: 6,
      icon: 'water_drop',
      actionType: 'water_adjust',
      urgency: 'high'
    });
  }

  if (!hasRadio) {
    recommendedActions.push({
      id: 'act-radio',
      title: 'Acquérir une radio FM d\'urgence autonome',
      description: 'Indispensable pour capter les messages préfectoraux (France Bleu) lors des coupures de réseau électrique et mobile.',
      pointsGain: 8,
      icon: 'cell_tower',
      actionType: 'check_kit',
      targetId: 'k5',
      urgency: 'high'
    });
  }

  if (expired.length > 0) {
    recommendedActions.push({
      id: 'act-expired',
      title: `Renouveler ${expired.length} produit(s) périmé(s)`,
      description: `Articles périmés identifiés : ${expired.map((e) => e.name).slice(0, 2).join(', ')}${
        expired.length > 2 ? '...' : ''
      }.`,
      pointsGain: 4,
      icon: 'warning',
      actionType: 'inventory_renew',
      urgency: 'high'
    });
  }

  if (!hasOutZoneContact) {
    recommendedActions.push({
      id: 'act-contact',
      title: 'Désigner un contact hors-zone dans Mon Plan',
      description: 'Choisir un proche résidant à plus de 100 km comme relais centralisateur des SMS du foyer.',
      pointsGain: 6,
      icon: 'hub',
      actionType: 'family_plan',
      urgency: 'medium'
    });
  }

  if (!hasSpareBatteries) {
    recommendedActions.push({
      id: 'act-batteries',
      title: 'Constituer une réserve de piles neuves',
      description: 'Piles alcalines scellées au format de vos lampes et de votre radio d\'urgence.',
      pointsGain: 3,
      icon: 'battery_charging_full',
      actionType: 'check_kit',
      targetId: 'k6',
      urgency: 'medium'
    });
  }

  if (needsPeriodicReview && expired.length === 0) {
    recommendedActions.push({
      id: 'act-audit',
      title: 'Effectuer la vérification semestrielle des stocks',
      description: 'Contrôler l\'état des boîtes, l\'étanchéité des packs et la charge de la batterie externe.',
      pointsGain: 4,
      icon: 'fact_check',
      actionType: 'inventory_renew',
      urgency: 'low'
    });
  }

  if (config.hasChronicCondition && !chronicKit) {
    recommendedActions.push({
      id: 'act-chronic',
      title: 'Préparer le stock tampon de médicaments vitaux',
      description: 'Conserver 15 à 30 jours de traitement en avance avec photocopies papier des ordonnances.',
      pointsGain: 5,
      icon: 'prescriptions',
      actionType: 'check_kit',
      targetId: 'k10',
      urgency: 'high'
    });
  }

  return {
    scoreResult: {
      totalScore,
      level,
      pillars: [pillar1, pillar2, pillar3, pillar4, pillar5],
      disclaimer:
        'Ce score est un indicateur déclaratif d\'anticipation matérielle établi d\'après les référentiels de la Sécurité Civile. En aucun cas un score de 100% ne confère une garantie d\'immunité face aux sinistres majeurs, effondrements ou contaminations sévères. Respectez toujours les consignes opérationnelles officielles diffusées par les autorités.'
    },
    autonomy: {
      water: waterAutonomy,
      food: foodAutonomy,
      lighting: lightingAutonomy,
      energy: energyAutonomy
    },
    missingItems,
    expiries: {
      expired,
      expiringSoon,
      compliantCount,
      lastCheckedDate: mostRecentCheck ? new Date(mostRecentCheck).toISOString().split('T')[0] : null,
      daysSinceLastCheck,
      needsPeriodicReview
    },
    recommendedActions,
    householdSummary: {
      totalPersons,
      adults: config.adultsCount,
      children: config.childrenCount,
      infants: config.infantsCount,
      elderly: config.elderlyCount,
      pets: config.petsCount,
      targetDays: config.targetDurationDays,
      hasPmr: !!config.hasPmr,
      hasChronicCondition: !!config.hasChronicCondition
    }
  };
}
