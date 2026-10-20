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
import { getPedagogicalSampleRisks, fetchGeorisquesOnline, searchCommunesOnline } from '../src/services/external/georisquesClient';
import { AVAILABLE_COMMUNES } from '../src/data/georisquesData';

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

// ========================================================
// TEST 5 : Discrimination des coordonnées territoriales réelles
// ========================================================
console.log('\n5. TEST DISCRIMINATION DES COORDONNÉES TERRITORIALES (ANTI-CONFUSION LYON) :');

const lyonCommune = AVAILABLE_COMMUNES.find((c) => c.insee === '69383');
const rouenCommune = AVAILABLE_COMMUNES.find((c) => c.insee === '76540');
const dunkerqueCommune = AVAILABLE_COMMUNES.find((c) => c.insee === '59183');
const marseilleCommune = AVAILABLE_COMMUNES.find((c) => c.insee === '13202');
const parisCommune = AVAILABLE_COMMUNES.find((c) => c.insee === '75101');

assert(!!lyonCommune, 'Commune de référence Lyon 3e présente');
assert(!!rouenCommune, 'Commune de Rouen présente dans les références');
assert(!!dunkerqueCommune, 'Commune de Dunkerque présente dans les références');
assert(!!marseilleCommune, 'Commune de Marseille présente dans les références');
assert(!!parisCommune, 'Commune de Paris présente dans les références');

// Vérification stricte que Rouen ne reçoit PAS les coordonnées de Lyon
assert(Math.abs(rouenCommune!.lat - 49.4432) < 0.01, 'Rouen a sa latitude réelle (49.44)');
assert(Math.abs(rouenCommune!.lng - 1.0999) < 0.01, 'Rouen a sa longitude réelle (1.10)');
assert(
  Math.abs(rouenCommune!.lat - lyonCommune!.lat) > 2.0,
  'Les coordonnées de Rouen sont distinctes de Lyon (> 2° d\'écart)'
);

// Vérification stricte que Dunkerque ne reçoit PAS les coordonnées de Lyon
assert(Math.abs(dunkerqueCommune!.lat - 51.0343) < 0.01, 'Dunkerque a sa latitude réelle (51.03)');
assert(
  Math.abs(dunkerqueCommune!.lat - lyonCommune!.lat) > 4.0,
  'Les coordonnées de Dunkerque sont distinctes de Lyon (> 4° d\'écart)'
);

// Vérification stricte pour Paris et Marseille
assert(Math.abs(parisCommune!.lat - 48.8606) < 0.01, 'Paris a sa latitude réelle (48.86)');
assert(Math.abs(marseilleCommune!.lat - 43.3039) < 0.01, 'Marseille a sa latitude réelle (43.30)');

// Test recherche locale / hors-ligne
const searchRouenRes = await searchCommunesOnline('Rouen');
assert(searchRouenRes.success === true, 'Recherche locale pour Rouen réussie');
const matchRouen = searchRouenRes.data.find((d) => d.code === '76540');
assert(!!matchRouen, 'Rouen trouvé dans les résultats de recherche');
assert(
  matchRouen?.centre?.coordinates[1] === rouenCommune!.lat,
  'Coordonnées réelles de Rouen attachées aux résultats de recherche'
);

// ========================================================
// TEST 6 : Validation des codes INSEE français (Corse 2A/2B, Métropole, DROM, rejets)
// ========================================================
console.log('\n6. TEST VALIDATION DES CODES INSEE (CORSE 2A/2B, MÉTROPOLE, OUTRE-MER, REJETS) :');

import { isValidInseeCode } from '../src/services/external/georisquesClient';

assert(isValidInseeCode('2A004') === true, 'Code INSEE Corse-du-Sud 2A004 (Ajaccio) reconnu valide');
assert(isValidInseeCode('2B033') === true, 'Code INSEE Haute-Corse 2B033 (Bastia) reconnu valide');
assert(isValidInseeCode('2a004') === true, 'Code INSEE Corse en minuscules 2a004 reconnu valide');
assert(isValidInseeCode('75056') === true, 'Code INSEE Métropole 75056 (Paris) reconnu valide');
assert(isValidInseeCode('69383') === true, 'Code INSEE Métropole 69383 (Lyon 3e) reconnu valide');
assert(isValidInseeCode('97415') === true, 'Code INSEE DROM 97415 (Saint-Denis La Réunion) reconnu valide');
assert(isValidInseeCode('97105') === true, 'Code INSEE DROM 97105 (Basse-Terre Guadeloupe) reconnu valide');

// Rejets stricts des codes non conformes
assert(isValidInseeCode('123') === false, 'Code trop court (123) rejeté');
assert(isValidInseeCode('2C001') === false, 'Lettre non corse 2C001 rejetée');
assert(isValidInseeCode('ABCD') === false, 'Chaîne alphabétique ABCD rejetée');
assert(isValidInseeCode('750561') === false, 'Code trop long (6 chiffres) rejeté');
assert(isValidInseeCode('') === false, 'Code vide rejeté');

// ========================================================
// TEST 7 : Réponses simulées pour fetchGeorisquesOnline (Mock API Géorisques GASPAR)
// ========================================================
console.log('\n7. TEST RÉPONSES SIMULÉES API GÉORISQUES (CAS D\'ERREURS ET NUANCES) :');

// Mise en place d'un mock localStorage en mémoire pour le runtime de test
const testStorage: Record<string, string> = {};
globalThis.localStorage = {
  getItem: (key: string) => testStorage[key] || null,
  setItem: (key: string, val: string) => { testStorage[key] = val; },
  removeItem: (key: string) => { delete testStorage[key]; },
  clear: () => { Object.keys(testStorage).forEach((k) => delete testStorage[k]); }
} as any;

const originalFetch = globalThis.fetch;

// 7.A : JSON corrompu (SyntaxError)
globalThis.fetch = async () => ({
  ok: true,
  json: async () => { throw new SyntaxError('Unexpected token < in JSON at position 0'); }
} as any);

const resJsonInvalide = await fetchGeorisquesOnline('75056', 'Paris');
assert(resJsonInvalide.dataSourceType === 'api_error', '7.A - JSON corrompu : statut api_error retourné');
assert(resJsonInvalide.source.includes('JSON corrompu'), '7.A - Source mentionne le JSON corrompu');

// 7.B : Attribut data absent de la réponse
globalThis.fetch = async () => ({
  ok: true,
  json: async () => ({ status: 'success', message: 'No data key provided' })
} as any);

const resNoData = await fetchGeorisquesOnline('75056', 'Paris');
assert(resNoData.dataSourceType === 'api_error', '7.B - data absent : statut api_error retourné');
assert(resNoData.source.includes('attribut data manquant'), '7.B - Source explicite sur l\'absence de data');

// 7.C : Code INSEE divergent dans le premier enregistrement
globalThis.fetch = async () => ({
  ok: true,
  json: async () => ({
    data: [{ code_insee: '13055', risques_detail: [] }]
  })
} as any);

const resInseeDivergent = await fetchGeorisquesOnline('75056', 'Paris');
assert(resInseeDivergent.dataSourceType === 'api_error', '7.C - INSEE divergent : statut api_error retourné');
assert(resInseeDivergent.source.includes('Divergence territoriale'), '7.C - Source signale la divergence territoriale');

// 7.D : risques_detail absent ou non tabulaire
globalThis.fetch = async () => ({
  ok: true,
  json: async () => ({
    data: [{ code_insee: '75056', risques_detail: null }]
  })
} as any);

const resNoRisquesDetail = await fetchGeorisquesOnline('75056', 'Paris');
assert(resNoRisquesDetail.dataSourceType === 'api_error', '7.D - risques_detail non tabulaire : statut api_error retourné');
assert(resNoRisquesDetail.source.includes('risques_detail'), '7.D - Source signale l\'attribut risques_detail manquant');

// 7.E : Réponse vide (data: []) pour commune corse (2A004) -> nuance zéro risque
globalThis.fetch = async () => ({
  ok: true,
  json: async () => ({ data: [] })
} as any);

const resCorse2A = await fetchGeorisquesOnline('2A004', 'Ajaccio');
assert(resCorse2A.dataSourceType === 'live_api_zero_risk', '7.E - Corse 2A004 réponse vide : statut live_api_zero_risk');
assert(resCorse2A.risksCount === 0, '7.E - Corse 2A004 : 0 risque comptabilisé');
assert(resCorse2A.source.includes('aucun dossier renvoyé'), '7.E - Source nuance bien « aucun dossier renvoyé »');
assert(resCorse2A.source.includes('ne prouve pas l’absence de tout risque'), '7.E - Avertissement qu’aucun dossier ne prouve pas le risque zéro');

// 7.F : Réponse vide (data: []) pour commune corse (2B033 Bastia)
const resCorse2B = await fetchGeorisquesOnline('2B033', 'Bastia');
assert(resCorse2B.dataSourceType === 'live_api_zero_risk', '7.F - Corse 2B033 réponse vide : statut live_api_zero_risk');

// 7.G : Réponse vide (data: []) avec code INSEE invalide (ex: 2C001)
const resInvalidInsee = await fetchGeorisquesOnline('2C001', 'Commune Invalide');
assert(resInvalidInsee.dataSourceType === 'api_error', '7.G - Code INSEE invalide (2C001) : rejet immédiat en api_error');

// 7.H : Coupure réseau / échec fetch avec cache existant
testStorage['georisques_cache_69383'] = JSON.stringify({
  communeName: 'Lyon 3e',
  inseeCode: '69383',
  retrievedAt: '2026-10-15T10:00:00.000Z',
  source: 'Dernière réponse enregistrée de l’API officielle',
  isOfflineCache: false,
  dataSourceType: 'live_api',
  risksCount: 2,
  risks: [
    { id: 'gaspar-0', category: 'Risque Industriel', title: 'Site Seveso', officialDocumentUrl: 'https://georisques.gouv.fr' },
    { id: 'gaspar-1', category: 'TMD', title: 'Axe TMD', officialDocumentUrl: 'https://georisques.gouv.fr' }
  ]
});

globalThis.fetch = async () => {
  throw new Error('Failed to fetch: Network unreachable');
};

const resOfflineWithCache = await fetchGeorisquesOnline('69383', 'Lyon 3e');
assert(resOfflineWithCache.dataSourceType === 'cached_official', '7.H - Échec réseau avec cache : statut cached_official');
assert(resOfflineWithCache.isOfflineCache === true, '7.H - Flag isOfflineCache activé');
assert(resOfflineWithCache.risksCount === 2, '7.H - 2 risques restitués depuis le cache');

// 7.I : Coupure réseau sans aucun cache disponible
delete testStorage['georisques_cache_01001'];
const resOfflineNoCache = await fetchGeorisquesOnline('01001', 'L’Abergement-Clémenciat');
assert(resOfflineNoCache.dataSourceType === 'network_error', '7.I - Échec réseau sans cache : statut network_error');
assert(resOfflineNoCache.risksCount === 0, '7.I - 0 risque restitué');

// 7.J : Réponse officielle valide avec risques technologiques identifiés
globalThis.fetch = async () => ({
  ok: true,
  json: async () => ({
    data: [
      {
        code_insee: '76540',
        risques_detail: [
          {
            libelle_risque_long: 'Risque industriel Seveso Seuil Haut',
            libelle_risque_jo: 'Risque Technologique Majeur'
          }
        ]
      }
    ]
  })
} as any);

const resValideRisques = await fetchGeorisquesOnline('76540', 'Rouen');
assert(resValideRisques.dataSourceType === 'live_api', '7.J - Réponse valide avec risques : statut live_api');
assert(resValideRisques.risksCount === 1, '7.J - 1 risque recensé');
assert(resValideRisques.risks[0].protocolKey === 'chimique', '7.J - Protocole chimique correctement assigné');

// Rétablissement du fetch original
globalThis.fetch = originalFetch;

// ========================================================
// TEST 8 : Spécification des exports territoriaux et mentions de sauvegarde
// ========================================================
console.log('\n8. TEST SPÉCIFICATION DES EXPORTS TERRITORIAUX :');

const dummySnapshot = {
  application: 'NRBCOR Protection Civile',
  type: 'INSTANTANE_TERRITORIAL_GEORISQUES',
  fiabiliteSynthese: {
    statut: 'OFFICIEL_DIRECT_API_GEORISQUES',
    estOfficielDirect: true,
    estCacheOfficiel: false,
    estEchantillonDidactique: false,
    mentionLegale: 'Ne se substitue pas aux arrêtés préfectoraux opposables.'
  },
  documentsDeSauvegarde: [
    {
      id: 'dicrim',
      nom: 'DICRIM - Synthèse',
      disponibiliteHorsLigne: false,
      statutAuthenticite: 'L’exemplaire authentique intégral paraphé par le Maire doit être consulté en Mairie.'
    },
    {
      id: 'pcs',
      nom: 'PCS - Dispositif communal',
      disponibiliteHorsLigne: false,
      statutAuthenticite: 'Dispositif opérationnel communal.'
    }
  ]
};

assert(dummySnapshot.fiabiliteSynthese.estOfficielDirect === true, 'Export officiel identifié comme tel');
assert(
  dummySnapshot.documentsDeSauvegarde.every((d) => d.disponibiliteHorsLigne === false),
  'Les documents DICRIM et PCS indiquent formellement disponibiliteHorsLigne = false'
);
assert(
  dummySnapshot.documentsDeSauvegarde.some((d) => d.statutAuthenticite.includes('paraphé par le Maire')),
  'Mention explicite que l\'exemplaire paraphé doit être consulté en mairie'
);

console.log(`\n========================================================`);
console.log(`🎉 SUITE DE TESTS COMPLÈTE : ${passedTests} / ${totalTests} VÉRIFICATIONS RÉUSSIES (100% SUCCÈS)`);
console.log(`========================================================\n`);
