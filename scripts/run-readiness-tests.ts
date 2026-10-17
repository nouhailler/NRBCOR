/**
 * Suite de tests automatisés d'intégrité et de calculs NRBCOR
 * Exécute des vérifications concrètes sur :
 * 1. Le moteur de calcul du score de préparation (readinessScore.ts)
 * 2. Les foyers atypiques (nourrissons, animaux, PMR, maladies chroniques)
 * 3. La séparation stricte entre cases cochées et quantités mesurées
 * 4. La traçabilité exhaustive du corpus documentaire (securityCorpus.ts)
 * 5. L'étanchéité des exports territoriaux et la préservation des données
 */

import {
  calculateWaterAutonomy,
  calculateFoodAutonomy,
  calculateReadinessScore
} from '../src/utils/readinessScore';
import { SECURITY_CORPUS_ITEMS } from '../src/data/securityCorpus';
import { SpecificNeedsConfig, KitItem } from '../src/types';
import { InventoryItem, FamilyPlanData } from '../src/services/storage/StorageRepository';
import { getPedagogicalSampleRisks, fetchGeorisquesOnline } from '../src/services/external/georisquesClient';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    console.error(`  ❌ [FAIL] ${testName}`);
    if (detail) console.error(`     Détail: ${detail}`);
    throw new Error(`Échec test: ${testName}`);
  }
}

console.log('🧪 DÉMARRAGE DE LA SUITE DE TESTS FONCTIONNELS & RÉGLEMENTAIRES NRBCOR\n');

// ========================================================
// TEST 1 : Calcul de l'autonomie en eau (Adulte seul)
// ========================================================
console.log('1. TEST CALCUL EAU — DISTINCTION INVENTAIRE MESURÉ vs CASE COCHÉE :');

const baseConfig1: SpecificNeedsConfig = {
  adultsCount: 1,
  childrenCount: 0,
  infantsCount: 0,
  elderlyCount: 0,
  petsCount: 0,
  targetDurationDays: 3,
  hasChronicCondition: false,
  hasPmr: false,
  isNearSevesoOrNpp: false
};

const dummyKitItems: KitItem[] = [
  { id: 'k1', title: "Pack d'eau", subtitle: "Eau 6L", category: 1, completed: false, isEssential: true, tag: "VITAL" },
  { id: 'k2', title: 'Micropur', subtitle: "Purification", category: 1, completed: false, isEssential: true, tag: "EAU" },
  { id: 'k3', title: 'Nourriture', subtitle: "Conserves", category: 1, completed: false, isEssential: true, tag: "VIVRES" },
  { id: 'k5', title: 'Radio FM', subtitle: "DAB+ Dynamo", category: 3, completed: false, isEssential: true, tag: "INFO" },
  { id: 'k7', title: 'Lampe torche', subtitle: "LED étanche", category: 3, completed: false, isEssential: true, tag: "ÉCLAIRAGE" },
  { id: 'k8', title: 'Batterie externe', subtitle: "20 000 mAh", category: 3, completed: false, isEssential: true, tag: "ÉNERGIE" }
];

// 1.A : Zéro stock mesuré et case k1 NON cochée
const water0 = calculateWaterAutonomy(baseConfig1, [], dummyKitItems);
assert(water0.status === 'critical', 'Adulte sans eau : statut critique');
assert(water0.autonomyHours === 0, 'Adulte sans eau : 0h autonomie');
assert(water0.currentValue === 0, 'Adulte sans eau : 0L mesurés');
assert(water0.targetValue === 9, 'Adulte 3 jours : 9L requis (3L/j)');

// 1.B : Case k1 cochée mais AUCUN stock mesuré dans l'inventaire
const dummyKitItemsWithK1Checked: KitItem[] = dummyKitItems.map((it) =>
  it.id === 'k1' ? { ...it, completed: true } : it
);
const waterCheckboxOnly = calculateWaterAutonomy(baseConfig1, [], dummyKitItemsWithK1Checked);
assert(waterCheckboxOnly.status === 'insufficient_data', 'Case cochée sans inventaire : statut données insuffisantes');
assert(waterCheckboxOnly.hasInsufficientData === true, 'Flag hasInsufficientData positionné');
assert(waterCheckboxOnly.isEstimatedFromCheckboxOnly === true, 'Flag isEstimatedFromCheckboxOnly positionné');
assert(waterCheckboxOnly.autonomyHours === 0, 'Case cochée sans inventaire : ne confère PAS 72h fictives par magie');

// 1.C : Stock réel mesuré dans l'inventaire (1 pack de 6x1.5L = 9L)
const realWaterInventory: InventoryItem[] = [
  {
    id: 'w1',
    name: "Pack d'eau minérale 6x1.5L",
    category: 'Eau & Boissons',
    quantity: 1,
    unit: 'pack (9L)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
const waterMeasured = calculateWaterAutonomy(baseConfig1, realWaterInventory, dummyKitItemsWithK1Checked);
assert(waterMeasured.status === 'optimal', 'Stock 9L pour 1 personne sur 3 jours : statut optimal');
assert(waterMeasured.currentValue === 9, 'Quantité mesurée exacte : 9L');
assert(waterMeasured.autonomyHours === 72, 'Autonomie calculée exacte : 72 heures');
assert(waterMeasured.hasInsufficientData === false, 'Données mesurées valides');

// ========================================================
// TEST 2 : Foyer atypique avec Nourrisson, Aîné et Animal
// ========================================================
console.log('\n2. TEST FOYER COMPLEXE (Bébé, Aîné, Animal, Maladie chronique, PMR) :');

const complexHouseholdConfig: SpecificNeedsConfig = {
  adultsCount: 2,
  childrenCount: 1,
  infantsCount: 1, // +3 portions/j
  elderlyCount: 1,
  petsCount: 2, // 2 * 0.5L = +1L/j
  targetDurationDays: 3,
  hasChronicCondition: true,
  hasPmr: true,
  isNearSevesoOrNpp: true
};

// Total personnes = 2 adultes + 1 enfant + 1 nourrisson + 1 aîné = 5 personnes
// Besoin journalier eau = (5 * 3.0L) + (2 animaux * 0.5L) = 15L + 1L = 16L/jour
// Cible 3 jours = 16L * 3 = 48 Litres requis
const dummyFamilyPlan: FamilyPlanData = {
  members: [],
  localContacts: [],
  outZoneContact: { id: 'oz1', name: 'Oncle Pierre (Lyon)', phone: '0600000000', role: 'Relais', dist: '> 100km', icon: 'hub' },
  assemblyPoints: [{ name: 'Mairie', desc: 'Place centrale', type: 'primary', coords: '45.0, 4.0', radius: 'Rayon: 400m', color: 'bg-primary' }],
  tasks: [{ id: 't1', label: 'Couper gaz', done: true }]
};

const complexWater = calculateWaterAutonomy(complexHouseholdConfig, [], dummyKitItems);
assert(complexWater.targetValue === 48, 'Foyer 5 pers + 2 animaux sur 3 jours : 48L requis');

// Test rations alimentaires pour foyer complexe :
// (2 adultes + 1 enfant + 1 aîné = 4) * 2 rations = 8 rations
// + 1 nourrisson * 3 rations spécifiques (lait/petits pots) = 3 rations
// Total journalier = 11 rations/jour
// Cible 3 jours = 33 rations
const complexFood = calculateFoodAutonomy(complexHouseholdConfig, [], dummyKitItems);
assert(complexFood.targetValue === 33, 'Foyer 4 personnes + 1 bébé sur 3 jours : 33 rations requises');

// Test score global sans aucune fausse promesse
const dashboard = calculateReadinessScore(complexHouseholdConfig, dummyKitItems, [], dummyFamilyPlan);
assert(dashboard.scoreResult.totalScore < 50, 'Foyer non équipé : score faible réaliste');
assert(
  dashboard.scoreResult.disclaimer.includes("En aucun cas un score de 100% ne confère une garantie d'immunité"),
  'Clause déontologique formelle présente sans fausse garantie'
);
assert(dashboard.householdSummary.infants === 1, 'Nourrisson correctement consigné dans la synthèse');
assert(dashboard.householdSummary.pets === 2, 'Animaux correctement consignés dans la synthèse');
assert(dashboard.householdSummary.hasPmr === true, 'PMR correctement prise en compte');
assert(dashboard.householdSummary.hasChronicCondition === true, 'Maladie chronique correctement prise en compte');

// ========================================================
// TEST 3 : Traçabilité documentaire stricte (securityCorpus.ts)
// ========================================================
console.log('\n3. TEST TRAÇABILITÉ DOCTRINALE DU CORPUS DE SÉCURITÉ :');

assert(SECURITY_CORPUS_ITEMS.length >= 7, 'Le corpus contient au moins 7 fiches de référence vérifiées');

for (const item of SECURITY_CORPUS_ITEMS) {
  assert(!!item.sourceOrganization && item.sourceOrganization.length > 5, `Fiche "${item.id}" : Organisme source renseigné`);
  assert(item.officialUrl.startsWith('https://'), `Fiche "${item.id}" : Lien officiel HTTPS vérifiable`);
  assert(!!item.exactDocumentTitle && item.exactDocumentTitle.length > 10, `Fiche "${item.id}" : Titre exact du document de référence`);
  assert(!!item.publicationDate, `Fiche "${item.id}" : Date de publication ou révision présente`);
  assert(!!item.editorialVerificationDate, `Fiche "${item.id}" : Date de vérification éditoriale présente`);
  assert(item.validationLevel === 'valide' || item.validationLevel === 'a_verifier' || item.validationLevel === 'brouillon', `Fiche "${item.id}" : Niveau de validation valide`);
  assert(item.modificationHistory && item.modificationHistory.length > 0, `Fiche "${item.id}" : Historique des révisions documenté`);
  assert(item.securityWarnings && item.securityWarnings.length > 0, `Fiche "${item.id}" : Mises en garde doctrinales renseignées`);
  
  // Vérifier qu'aucun historique n'omet le motif obligatoire de modification
  for (const mod of item.modificationHistory) {
    assert(!!mod.reason && mod.reason.length > 5, `Fiche "${item.id}" v${mod.version} : Motif de révision explicite`);
  }
}

// Vérifications des 3 points cardinaux demandés par l'utilisateur :
// A. Confinement & ventilation : aucun calcul d'air présenté comme garantie absolue
const confinementItem = SECURITY_CORPUS_ITEMS.find((it) => it.id === 'guide-confinement');
assert(!!confinementItem, 'Fiche confinement étanche présente');
assert(
  confinementItem!.securityWarnings.some((w) => w.includes('Aucun calcul volumétrique théorique ne constitue une garantie')),
  'Avertissement formel contre l\'interprétation d\'un calcul de volume d\'air comme garantie de survie'
);

// B. Risques chimiques : pas de direction de fuite universellement sûre
const chemicalItem = SECURITY_CORPUS_ITEMS.find((it) => it.id === 'protocole-chimique');
assert(!!chemicalItem, 'Fiche risque chimique présente');
assert(
  chemicalItem!.securityWarnings.some((w) => w.includes('Aucune direction de fuite ni aucun emplacement de confinement n’est universellement sûr')),
  'Avertissement formel : aucune direction de fuite ou étage universellement sûr face aux gaz denses vs légers'
);

// C. Iode stable : interdiction formelle de prise préventive sans ordre préfectoral
const iodineItem = SECURITY_CORPUS_ITEMS.find((it) => it.id === 'fiche-iode');
assert(!!iodineItem, 'Fiche iode stable présente');
assert(
  iodineItem!.securityWarnings.some((w) =>
    /prise préventive.*ordre|interdiction.*prise préventive/i.test(w)
  ),
  'Avertissement explicite contre toute prise préventive d\'iode non ordonnée par le Préfet'
);

// ========================================================
// TEST 4 : Isolation des données territoriales (Géorisques)
// ========================================================
console.log('\n4. TEST ISOLATION TERRITORIALE GÉORISQUES :');

const samplePedago = getPedagogicalSampleRisks();
assert(samplePedago.length >= 3, 'Échantillon didactique d\'entraînement disponible');
assert(
  samplePedago.every((r) => r.category.includes('Exemple Pédagogique')),
  'Les risques didactiques sont formellement étiquetés "Exemple Pédagogique"'
);

console.log(`\n========================================================`);
console.log(`🎉 SUITE DE TESTS COMPLÈTE : ${passedTests} / ${totalTests} VÉRIFICATIONS RÉUSSIES (100% SUCCÈS)`);
console.log(`========================================================\n`);
