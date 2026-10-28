/**
 * NRBCOR - Script d'Audit et de Contrôle Automatisé du Corpus Doctrinal
 * Priorité P0 / P1 - Conforme au Codex d'Excellence Déontologique
 * 
 * Exécution :
 *   npm run check:content
 *   ou : npx tsx scripts/verify-corpus.ts
 */

import { SECURITY_CORPUS_ITEMS, SecurityCorpusItem } from '../src/data/securityCorpus';
import { PROTOCOLS_DATA } from '../src/data/protocols';
import { DOCTRINES_LIST } from '../src/data/sourcesData';

interface AuditResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalCorpusItems: number;
    validatedItems: number;
    pendingItems: number;
    draftItems: number;
    totalProtocols: number;
    totalDoctrines: number;
    urlsChecked: number;
    validUrls: number;
  };
}

const RFC_URL_REGEX = /^https?:\/\/(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::[0-9]{1,5})?(?:\/[^\s]*)?$/;

export function runCorpusAudit(): AuditResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  let totalUrls = 0;
  let validUrls = 0;

  // 1. Détection des doublons d'identifiants
  const corpusIds = new Set<string>();
  SECURITY_CORPUS_ITEMS.forEach((item) => {
    if (corpusIds.has(item.id)) {
      errors.push(`Doublon d'ID détecté dans le corpus : '${item.id}'`);
    }
    corpusIds.add(item.id);
  });

  const protocolIds = new Set<string>();
  Object.keys(PROTOCOLS_DATA).forEach((id) => {
    if (protocolIds.has(id)) {
      errors.push(`Doublon d'ID détecté dans les protocoles : '${id}'`);
    }
    protocolIds.add(id);
  });

  const doctrineIds = new Set<string>();
  DOCTRINES_LIST.forEach((doc) => {
    if (doctrineIds.has(doc.id)) {
      errors.push(`Doublon d'ID détecté dans les doctrines : '${doc.id}'`);
    }
    doctrineIds.add(doc.id);
  });

  // 2. Vérification des champs obligatoires et intégrité de chaque fiche de corpus
  const requiredCorpusFields: (keyof SecurityCorpusItem)[] = [
    'id',
    'title',
    'category',
    'scenarioPerimeter',
    'sourceOrganization',
    'officialUrl',
    'officialDirectDocumentUrl',
    'exactDocumentTitle',
    'exactReferenceSection',
    'publicationDate',
    'editorialVerificationDate',
    'editorialReviewer',
    'editorialQualification',
    'validationLevel',
    'verificationStatus',
    'securityWarnings',
    'proofSheet',
    'modificationHistory'
  ];

  let validatedCount = 0;
  let pendingCount = 0;
  let draftCount = 0;

  SECURITY_CORPUS_ITEMS.forEach((item) => {
    // Vérification des champs obligatoires
    requiredCorpusFields.forEach((field) => {
      const val = item[field];
      if (val === undefined || val === null || val === '') {
        errors.push(`Fiche '${item.id}' : Champ obligatoire manquant ou vide : '${String(field)}'`);
      }
    });

    // Statut de validation
    if (item.validationLevel === 'valide') validatedCount++;
    else if (item.validationLevel === 'a_verifier') {
      pendingCount++;
      warnings.push(`Fiche '${item.id}' en attente de validation collégiale ('a_verifier')`);
    } else if (item.validationLevel === 'brouillon') {
      draftCount++;
      warnings.push(`Fiche '${item.id}' au statut 'brouillon' - Ne doit pas être invoquée en urgence.`);
    }

    // Vérification des URLs (syntaxe RFC)
    [item.officialUrl, item.officialDirectDocumentUrl].forEach((url) => {
      if (url) {
        totalUrls++;
        if (RFC_URL_REGEX.test(url)) {
          validUrls++;
        } else {
          errors.push(`Fiche '${item.id}' : URL non conforme au format RFC : '${url}'`);
        }
      }
    });

    // Vérification de la fiche de preuve
    if (item.proofSheet) {
      if (!item.proofSheet.justifiedRule || item.proofSheet.justifiedRule.trim().length < 10) {
        errors.push(`Fiche '${item.id}' : Règle doctrinale vitale (proofSheet.justifiedRule) incomplète`);
      }
      if (!item.proofSheet.legalBasis || item.proofSheet.legalBasis.trim().length < 5) {
        errors.push(`Fiche '${item.id}' : Base juridique ou scientifique (proofSheet.legalBasis) insuffisante`);
      }
      if (!item.proofSheet.legalExcerpt || item.proofSheet.legalExcerpt.trim().length < 15) {
        errors.push(`Fiche '${item.id}' : Extrait verbatim opposable (proofSheet.legalExcerpt) manquant`);
      }
    }

    // Cohérence des dates
    if (item.editorialVerificationDate && item.editorialVerificationDate !== 'En attente') {
      if (item.editorialVerificationDate === '2026-10-14 08:00:00') {
        errors.push(`Fiche '${item.id}' : Date artificielle hardcodée détectée ('${item.editorialVerificationDate}').`);
      }
    }
  });

  // 3. Traçabilité des autorités institutionnelles officielles
  const allCorpusText = JSON.stringify(SECURITY_CORPUS_ITEMS) + JSON.stringify(DOCTRINES_LIST) + JSON.stringify(PROTOCOLS_DATA);

  const officialAuthorities = [
    { country: 'France', name: 'DGSCGC (Sécurité Civile)', match: /DGSCGC|Sécurité Civile/i },
    { country: 'France', name: 'ASNR / IRSN (Sûreté Nucléaire)', match: /ASNR|IRSN|Sûreté Nucléaire/i },
    { country: 'France', name: 'Ineris (Risques Technologiques)', match: /Ineris/i },
    { country: 'France', name: 'SGDSN (Défense & Sécurité Nationale)', match: /SGDSN|PIRATOX|BIOTOX/i },
    { country: 'France', name: 'Santé Publique France & ARS', match: /Santé Publique France|DGS|ARS/i },
    { country: 'Suisse', name: 'OFPP / BABS (Protection Population)', match: /OFPP|BABS|Alertswiss/i },
    { country: 'Suisse', name: 'CENAL (Centrale d’Alarme Nationale)', match: /CENAL/i },
    { country: 'Belgique', name: 'NCCN / AFCN (Crise & Nucléaire Belge)', match: /NCCN|AFCN|Centre de Crise/i },
    { country: 'International', name: 'AIEA / IAEA (Nucléaire)', match: /AIEA|IAEA/i },
    { country: 'International', name: 'OMS / WHO (Santé)', match: /OMS|WHO/i }
  ];

  officialAuthorities.forEach((auth) => {
    if (!auth.match.test(allCorpusText)) {
      errors.push(`Autorité officielle absente du référentiel : [${auth.country}] ${auth.name}`);
    }
  });

  // 4. Contrôle des 4 règles doctrinales capitales de sécurité civile
  // A. Verrou strict automédication iode
  const iodineProtocol = PROTOCOLS_DATA['nucleaire']?.institutionalClause?.text +
    JSON.stringify(SECURITY_CORPUS_ITEMS.find((c) => c.id === 'fiche-iode'));
  if (!/ordre du préfet|sur ordre|autorité compétente/i.test(iodineProtocol)) {
    errors.push("Règle capitale violée : L'obligation d'ordre préalable pour la prise d'iode n'est pas explicite.");
  }

  // B. Décontamination : proscription du frottement cutané agressif
  const decontamProtocol = PROTOCOLS_DATA['chimique']?.reflexesTitle +
    JSON.stringify(SECURITY_CORPUS_ITEMS.find((c) => c.id === 'guide-deshabillage'));
  if (!/frotter|abras|tampon|doux/i.test(decontamProtocol)) {
    errors.push("Règle capitale violée : L'interdiction du frottement abrasif de la peau en décontamination n'est pas stipulée.");
  }

  // C. Confinement et renouvellement d'air
  const confinementProtocol = PROTOCOLS_DATA['confinement']?.title +
    JSON.stringify(SECURITY_CORPUS_ITEMS.find((c) => c.id === 'guide-confinement'));
  if (!/aér|fin d'alerte|ventilat/i.test(confinementProtocol)) {
    errors.push("Règle capitale violée : Les consignes d'arrêt VMC et d'aération post-fin d'alerte sont absentes.");
  }

  // D. Risque chimique : distinction gaz lourds vs gaz légers
  const chemProtocol = JSON.stringify(SECURITY_CORPUS_ITEMS.find((c) => c.id === 'protocole-chimique'));
  if (!/dense|lourd|léger|accumul/i.test(chemProtocol)) {
    warnings.push("Risque chimique : La distinction physique gaz denses vs gaz légers mérite un renforcement.");
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalCorpusItems: SECURITY_CORPUS_ITEMS.length,
      validatedItems: validatedCount,
      pendingItems: pendingCount,
      draftItems: draftCount,
      totalProtocols: Object.keys(PROTOCOLS_DATA).length,
      totalDoctrines: DOCTRINES_LIST.length,
      urlsChecked: totalUrls,
      validUrls: validUrls
    }
  };
}

// Exécution CLI
const result = runCorpusAudit();

console.log('================================================================');
console.log(' 🛡️  NRBCOR — AUDIT AUTOMATISÉ DU CORPUS DE SÉCURITÉ CIVILE');
console.log('================================================================');
console.log(`• Fiches de corpus contrôlées : ${result.stats.totalCorpusItems}`);
console.log(`  - Validées collégialement   : ${result.stats.validatedItems}`);
console.log(`  - En attente de validation  : ${result.stats.pendingItems}`);
console.log(`  - Ébauches / Brouillons     : ${result.stats.draftItems}`);
console.log(`• Fiches réflexes protocolaires: ${result.stats.totalProtocols}`);
console.log(`• Textes & doctrines d'État   : ${result.stats.totalDoctrines}`);
console.log(`• Liens officiels validés     : ${result.stats.validUrls} / ${result.stats.urlsChecked}`);
console.log('----------------------------------------------------------------');

console.log('\n📋 RÉPARTITION DES RESPONSABILITÉS D’AUDIT :');
console.log('┌───────────────────────────────────────────────────────────────┐');
console.log('│ 🤖 VALIDATIONS AUTOMATISABLES (Ce script)                     │');
console.log('├───────────────────────────────────────────────────────────────┤');
console.log('│  [x] Schémas JSON et complétude des métadonnées requises       │');
console.log('│  [x] Validité syntaxique des URLs officielles (format RFC)    │');
console.log('│  [x] Unicité absolue des identifiants (zéro collision)        │');
console.log('│  [x] Détection des dates d’actualisation factices             │');
console.log('│  [x] Traçabilité des autorités (FR, CH, BE, International)   │');
console.log('│  [x] Présence des avertissements doctrinaux capitaux         │');
console.log('├───────────────────────────────────────────────────────────────┤');
console.log('│ 👨‍⚕️ VALIDATIONS HUMAINES EXPERTES (Collège médical & civils)  │');
console.log('├───────────────────────────────────────────────────────────────┤');
console.log('│  [ ] Exactitude posologique selon autorisations AMM pédiatrie │');
console.log('│  [ ] Alignement opérationnel avec les derniers décrets PPI    │');
console.log('│  [ ] Conformité tactique des manœuvres de déshabillage d’urgence│');
console.log('│  [ ] Validation des protocoles transfrontaliers (CH / BE / LU)│');
console.log('└───────────────────────────────────────────────────────────────┘');

if (result.warnings.length > 0) {
  console.log('\n⚠️  AVERTISSEMENTS ÉDITORIAUX DÉTECTÉS :');
  result.warnings.forEach((w) => console.log(`   - ${w}`));
}

if (!result.passed) {
  console.error('\n❌ ÉCHEC DE L’AUDIT DU CORPUS (Erreurs bloquantes détectées) :');
  result.errors.forEach((e) => console.error(`   ✖ ${e}`));
  console.error('\nLe processus s’est interrompu avec le code de sortie 1.');
  process.exit(1);
} else {
  console.log('\n✅ SUCCÈS : Tous les contrôles automatisés du corpus sont validés avec succès.');
  console.log('Corpus conforme aux normes de sécurité civile NRBCOR v2.4.\n');
  process.exit(0);
}
