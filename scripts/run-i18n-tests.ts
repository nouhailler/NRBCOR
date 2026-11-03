import { fr, FR_TRANSLATIONS } from '../src/i18n/locales/fr';
import { en, EN_TRANSLATIONS } from '../src/i18n/locales/en';
import { PROTOCOLS_DATA } from '../src/data/protocols';
import { PROTOCOLS_DATA_EN } from '../src/i18n/content/protocols.en';
import { getLocalizedProtocol, getAllLocalizedProtocols } from '../src/i18n/content/localizedProtocols';

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
