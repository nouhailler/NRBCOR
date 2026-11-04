import { fr, FR_TRANSLATIONS } from '../src/i18n/locales/fr';
import { en, EN_TRANSLATIONS } from '../src/i18n/locales/en';
import { PROTOCOLS_DATA } from '../src/data/protocols';
import { PROTOCOLS_DATA_EN } from '../src/i18n/content/protocols.en';
import { getLocalizedProtocol, getAllLocalizedProtocols } from '../src/i18n/content/localizedProtocols';
import { INITIAL_KIT_ITEMS, KIT_CATEGORIES } from '../src/data/kitData';
import { INITIAL_KIT_ITEMS_EN, KIT_CATEGORIES_EN } from '../src/i18n/content/kit.en';
import { getLocalizedKitItems, getLocalizedKitCategories } from '../src/i18n/content/localizedKit';
import { GLOSSARY_TERMS, HISTORICAL_ERAS, COUNTRY_DOCTRINES, NRBC_TOOL_CATEGORIES } from '../src/data/encyclopediaData';
import { GLOSSARY_TERMS_EN, HISTORICAL_ERAS_EN, COUNTRY_DOCTRINES_EN, NRBC_TOOL_CATEGORIES_EN } from '../src/i18n/content/encyclopedia.en';
import { getLocalizedEncyclopedia } from '../src/i18n/content/localizedEncyclopedia';
import { IMMERSION_SCENARIOS, QUIZ_IRRADIATION_CONTAMINATION, QUIZ_DECONTAMINATION } from '../src/data/quizData';
import { IMMERSION_SCENARIOS_EN, QUIZ_IRRADIATION_CONTAMINATION_EN, QUIZ_DECONTAMINATION_EN, TRAINER_SCENARIOS_EN } from '../src/i18n/content/quiz.en';
import { getLocalizedQuizData, getLocalizedTrainerScenarios } from '../src/i18n/content/localizedQuiz';
import { EMERGENCY_SCENARIOS } from '../src/components/EmergencyCoherenceMatrixModal';
import { EMERGENCY_SCENARIOS_EN } from '../src/i18n/content/coherenceMatrix.en';
import { getLocalizedEmergencyScenarios } from '../src/i18n/content/localizedCoherenceMatrix';
import { INITIAL_PLAN_TASKS, INITIAL_MEMBERS } from '../src/data/familyPlanData';
import { INITIAL_PLAN_TASKS_EN, INITIAL_MEMBERS_EN } from '../src/i18n/content/familyPlan.en';
import { getLocalizedFamilyPlan, getLocalizedPlanTasks } from '../src/i18n/content/localizedFamilyPlan';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failed++;
  }
}

console.log('========================================================');
console.log('🧪 SUITE DE TESTS D\'INTERNATIONALISATION NRBCOR (FR/EN)');
console.log('========================================================');

// 1. DICTIONARY PARITY & INTEGRITY
console.log('\n--- 1. PARITÉ ET INTÉGRITÉ DES DICTIONNAIRES (FR / EN) ---');

const frKeys = Object.keys(FR_TRANSLATIONS);
const enKeys = Object.keys(EN_TRANSLATIONS);

assert(frKeys.length > 80, `Le dictionnaire FR contient ${frKeys.length} clés (> 80 attendu)`);
assert(enKeys.length > 80, `Le dictionnaire EN contient ${enKeys.length} clés (> 80 attendu)`);
assert(frKeys.length === enKeys.length, `Parité stricte du nombre de clés : FR=${frKeys.length}, EN=${enKeys.length}`);

// Vérifier que chaque clé FR existe en EN
const missingInEn = frKeys.filter((k) => !(k in EN_TRANSLATIONS));
assert(missingInEn.length === 0, `0 clé manquante en anglais (${missingInEn.length} manquantes : ${missingInEn.join(', ')})`);

// Vérifier que chaque clé EN existe en FR
const missingInFr = enKeys.filter((k) => !(k in FR_TRANSLATIONS));
assert(missingInFr.length === 0, `0 clé obsolète en anglais (${missingInFr.length} orphelines : ${missingInFr.join(', ')})`);

// Vérifier qu'aucune traduction n'est vide
const emptyFr = frKeys.filter((k) => !(FR_TRANSLATIONS as any)[k] || (FR_TRANSLATIONS as any)[k].trim() === '');
const emptyEn = enKeys.filter((k) => !(EN_TRANSLATIONS as any)[k] || (EN_TRANSLATIONS as any)[k].trim() === '');
assert(emptyFr.length === 0, `Aucune chaîne vide dans FR (${emptyFr.length})`);
assert(emptyEn.length === 0, `Aucune chaîne vide dans EN (${emptyEn.length})`);

// 2. PROTOCOLES CBRN MULTILINGUES
console.log('\n--- 2. LOCALISATION DU CORPUS DOCTRINAL CBRN ---');

const canonicalIds = ['bio', 'chimique', 'nucleaire', 'radiologique', 'confinement'];

canonicalIds.forEach((id) => {
  const frProto = PROTOCOLS_DATA[id];
  const enProto = PROTOCOLS_DATA_EN[id];

  assert(!!frProto, `Protocole FR "${id}" présent dans PROTOCOLS_DATA`);
  assert(!!enProto, `Protocole EN "${id}" présent dans PROTOCOLS_DATA_EN`);
  assert(enProto.id === id, `Conservation stricte de l'ID canonique "${id}" en EN`);
  assert(enProto.title !== frProto.title, `Titre traduit en EN pour "${id}" (${enProto.title})`);
  assert(enProto.reflexes.length === frProto.reflexes.length, `Même nombre de réflexes vitaux (4) pour "${id}"`);
  assert(enProto.forbiddenActions.length === frProto.forbiddenActions.length, `Même nombre d'actions interdites pour "${id}"`);
});

// Helper de résolution selon langue
const resolvedFr = getLocalizedProtocol('nucleaire', 'fr');
const resolvedEn = getLocalizedProtocol('nucleaire', 'en');

assert(resolvedFr.title.includes('Nucléaire'), 'Résolution FR retourne le titre français');
assert(resolvedEn.title.includes('Nuclear'), 'Résolution EN retourne le titre anglais');

// 3. PRÉSERVATION DES DOCTRINES NATIONALES (FR, CH, BE, LU)
console.log('\n--- 3. PRÉSERVATION DES DOCTRINES TRANSFRONTALIÈRES ---');

assert(
  EN_TRANSLATIONS['crisis.btnCallDesc'].includes('112') &&
  EN_TRANSLATIONS['crisis.btnCallDesc'].includes('18') &&
  EN_TRANSLATIONS['crisis.btnCallDesc'].includes('15') &&
  EN_TRANSLATIONS['crisis.btnCallDesc'].includes('144'),
  'La version EN préserve les numéros nationaux 112, 18, 15, 144 sans les remplacer par un standard étranger'
);

assert(
  EN_TRANSLATIONS['reflex.case3Points'].includes('potassium iodide') &&
  EN_TRANSLATIONS['reflex.case3Points'].includes('government order'),
  'La version EN rappelle formellement que l\'iode est soumis à l\'ordre gouvernemental'
);

assert(
  EN_TRANSLATIONS['carte.subtitle'].includes('19 nuclear power plants') &&
  EN_TRANSLATIONS['carte.subtitle'].includes('22 major Seveso'),
  'La version EN préserve le périmètre exact des 41 sites industriels français'
);

// 4. FORMATS RÉGIONAUX ET INTL
console.log('\n--- 4. FORMATS RÉGIONAUX ET INTL ---');

const testDate = new Date('2026-10-18T10:00:00Z');
const frDateStr = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(testDate);
const enDateStr = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(testDate);

assert(frDateStr.includes('octobre 2026'), `Formatage date FR conforme : ${frDateStr}`);
assert(enDateStr.includes('October') && enDateStr.includes('2026'), `Formatage date EN conforme : ${enDateStr}`);

const testNumber = 1234.5;
const frNumStr = new Intl.NumberFormat('fr-FR').format(testNumber);
const enNumStr = new Intl.NumberFormat('en-US').format(testNumber);

assert(frNumStr.includes(',') || frNumStr.includes(' '), `Formatage nombre FR (virgule décimale) : ${frNumStr}`);
assert(enNumStr.includes('.'), `Formatage nombre EN (point décimal) : ${enNumStr}`);

// 5. LOCALISATION DU KIT D'URGENCE 72H
console.log('\n--- 5. LOCALISATION DU KIT D\'URGENCE 72H ---');

assert(INITIAL_KIT_ITEMS_EN.length === INITIAL_KIT_ITEMS.length, `Parité du nombre d'articles du kit (18 attendus : ${INITIAL_KIT_ITEMS_EN.length})`);
assert(KIT_CATEGORIES_EN.length === KIT_CATEGORIES.length, `Parité du nombre de catégories du kit (6 attendues : ${KIT_CATEGORIES_EN.length})`);

INITIAL_KIT_ITEMS.forEach((frItem) => {
  const enItem = INITIAL_KIT_ITEMS_EN.find((it) => it.id === frItem.id);
  assert(!!enItem, `Article de kit ${frItem.id} présent en EN`);
  if (enItem) {
    assert(enItem.title.length > 0 && enItem.title !== frItem.title, `Titre traduit pour ${frItem.id}: "${enItem.title}"`);
    assert(enItem.subtitle.length > 0 && enItem.subtitle !== frItem.subtitle, `Sous-titre traduit pour ${frItem.id}`);
  }
});

const localizedEnKit = getLocalizedKitItems(INITIAL_KIT_ITEMS, 'en');
assert(localizedEnKit[0].title === INITIAL_KIT_ITEMS_EN[0].title, 'getLocalizedKitItems traduit dynamiquement les titres en EN');
assert(localizedEnKit[0].id === INITIAL_KIT_ITEMS[0].id, 'getLocalizedKitItems préserve l\'ID canonique k1');

// 6. LOCALISATION DE L'ENCYCLOPÉDIE & GLOSSAIRE NRBC
console.log('\n--- 6. LOCALISATION DE L\'ENCYCLOPÉDIE & GLOSSAIRE NRBC ---');

assert(GLOSSARY_TERMS_EN.length === GLOSSARY_TERMS.length, `Parité des termes du glossaire (25 attendus : ${GLOSSARY_TERMS_EN.length})`);
assert(HISTORICAL_ERAS_EN.length === HISTORICAL_ERAS.length, `Parité des ères historiques (4 attendues : ${HISTORICAL_ERAS_EN.length})`);
assert(COUNTRY_DOCTRINES_EN.length === COUNTRY_DOCTRINES.length, `Parité des doctrines nationales (5 attendues : ${COUNTRY_DOCTRINES_EN.length})`);
assert(NRBC_TOOL_CATEGORIES_EN.length === NRBC_TOOL_CATEGORIES.length, `Parité de l'arsenal technologique (4 attendus : ${NRBC_TOOL_CATEGORIES_EN.length})`);

GLOSSARY_TERMS.forEach((frTerm) => {
  const enTerm = GLOSSARY_TERMS_EN.find((t) => t.id === frTerm.id);
  assert(!!enTerm, `Terme glossaire ${frTerm.id} présent en EN`);
  if (enTerm) {
    assert(enTerm.shortDef.length > 10, `Définition courte valide en EN pour ${frTerm.id}`);
    assert(enTerm.fullDef.length > 30, `Définition complète valide en EN pour ${frTerm.id}`);
  }
});

const localizedEncyclo = getLocalizedEncyclopedia('en');
assert(localizedEncyclo.historicalEras[0].id === 'era-ww1', 'Ère 1 canonique préservée (era-ww1)');
assert(localizedEncyclo.historicalEras[0].title.includes('World War I') || localizedEncyclo.historicalEras[0].title.includes('Origins') || localizedEncyclo.historicalEras[0].period.includes('1914'), 'Ère 1 traduite en EN');
assert(localizedEncyclo.countryDoctrines[0].id === 'france', 'Doctrine France canonique préservée');
assert(localizedEncyclo.countryDoctrines[0].country.includes('France'), 'Doctrine France traduite en EN');

// 7. LOCALISATION DES QUIZ & EXERCICES COLLECTIFS
console.log('\n--- 7. LOCALISATION DES QUIZ & EXERCICES FORMATEUR ---');

assert(IMMERSION_SCENARIOS_EN.length === IMMERSION_SCENARIOS.length, `Parité scénarios immersion (4 attendus : ${IMMERSION_SCENARIOS_EN.length})`);
assert(QUIZ_IRRADIATION_CONTAMINATION_EN.questions.length === QUIZ_IRRADIATION_CONTAMINATION.questions.length, 'Parité questions quiz irradiation/contamination');
assert(QUIZ_DECONTAMINATION_EN.questions.length === QUIZ_DECONTAMINATION.questions.length, 'Parité questions quiz décontamination');
assert(TRAINER_SCENARIOS_EN.length === 4, '4 scénarios formateur disponibles en EN');

const localizedQuiz = getLocalizedQuizData('en');
assert(localizedQuiz.immersionScenarios[0].id === 'q-chimique-03', 'Scénario immersion 1 ID canonique préservé');
assert(localizedQuiz.immersionScenarios[0].title.includes('Chlorine') || localizedQuiz.immersionScenarios[0].title.includes('Toxic'), 'Titre scénario 1 traduit en EN');
assert(localizedQuiz.quizIrradiation.authority.includes('IRSN') || localizedQuiz.quizIrradiation.authority.includes('ASN'), 'Autorité de sûreté préservée dans quiz EN');

// 8. LOCALISATION DE LA MATRICE DE COHÉRENCE
console.log('\n--- 8. LOCALISATION DE LA MATRICE DE COHÉRENCE ---');

assert(EMERGENCY_SCENARIOS_EN.length === EMERGENCY_SCENARIOS.length, `Parité des scénarios d'urgence (6 attendus : ${EMERGENCY_SCENARIOS_EN.length})`);
EMERGENCY_SCENARIOS.forEach((frSc) => {
  const enSc = EMERGENCY_SCENARIOS_EN.find((s) => s.id === frSc.id);
  assert(!!enSc, `Scénario de cohérence ${frSc.id} présent en EN`);
  if (enSc) {
    assert(enSc.immediateAction.length > 10, `Action immédiate définie pour scénario ${frSc.id}`);
    assert(enSc.fatalTraps.length === frSc.fatalTraps.length, `Même nombre de pièges mortels pour scénario ${frSc.id}`);
  }
});

const localizedScenarios = getLocalizedEmergencyScenarios('en');
assert(localizedScenarios[0].id === 'confinement', 'Scénario confinement canonique préservé');
assert(localizedScenarios[0].title.includes('Shelter') || localizedScenarios[0].title.includes('Alert'), 'Scénario 1 traduit en EN');

// 9. LOCALISATION DU PLAN FAMILIAL
console.log('\n--- 9. LOCALISATION DU PLAN FAMILIAL & TÂCHES ---');

assert(INITIAL_PLAN_TASKS_EN.length === INITIAL_PLAN_TASKS.length, `Parité des tâches du plan (5 attendues : ${INITIAL_PLAN_TASKS_EN.length})`);
assert(INITIAL_MEMBERS_EN.length === INITIAL_MEMBERS.length, `Parité des membres du plan (3 attendus : ${INITIAL_MEMBERS_EN.length})`);

const mappedPlanTasks = getLocalizedPlanTasks(INITIAL_PLAN_TASKS, 'en');
assert(mappedPlanTasks[0].id === 't1', 'Tâche t1 canonique préservée');
assert(mappedPlanTasks[0].label !== INITIAL_PLAN_TASKS[0].label, 'Tâche t1 traduite en EN');

// 10. PRÉSERVATION DE L'INTÉGRITÉ DES CLÉS CANONIQUES DANS LE STOCKAGE LOCAL
console.log('\n--- 10. CONSERVATION STRICTE DES IDENTIFIANTS CANONIQUES ---');

const canonicalKitIds = ['k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'k7', 'k8', 'k9', 'k10', 'k11', 'k12', 'k13', 'k14', 'k15', 'k16', 'k17', 'k18'];
canonicalKitIds.forEach((id) => {
  assert(INITIAL_KIT_ITEMS_EN.some((it) => it.id === id), `ID canonique kit "${id}" intact en EN`);
});

const canonicalTaskIds = ['t1', 't2', 't3', 't4', 't5'];
canonicalTaskIds.forEach((id) => {
  assert(INITIAL_PLAN_TASKS_EN.some((t) => t.id === id), `ID canonique tâche "${id}" intact en EN`);
});

console.log('========================================================');
if (failed === 0) {
  console.log(`🎉 SUITE I18N : ${passed} / ${passed} VÉRIFICATIONS RÉUSSIES (100% SUCCÈS)`);
  console.log('========================================================');
  process.exit(0);
} else {
  console.error(`💥 ÉCHEC : ${failed} tests ont échoué, ${passed} réussis.`);
  console.log('========================================================');
  process.exit(1);
}
