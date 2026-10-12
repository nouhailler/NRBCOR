// Script de contrôle automatisé du corpus de sécurité NRBCOR (Section 5.1 & 8.3)
import fs from 'fs';
import path from 'path';

console.log('🔍 Exécution du contrôle de conformité éditoriale et de traçabilité...');

const protocolsPath = path.resolve('./src/data/protocols.ts');
const sourcesPath = path.resolve('./src/data/sourcesData.ts');

if (!fs.existsSync(protocolsPath) || !fs.existsSync(sourcesPath)) {
  console.error('❌ Erreur critique : Fichiers de données introuvables.');
  process.exit(1);
}

const protocolsContent = fs.readFileSync(protocolsPath, 'utf8');
const sourcesContent = fs.readFileSync(sourcesPath, 'utf8');

let errors = [];

// 1. Vérification de la présence des 4 fiches majeures NRBC
['bio', 'chimique', 'nucleaire', 'confinement'].forEach((id) => {
  if (!protocolsContent.includes(`id: '${id}'`)) {
    errors.push(`Protocole manquant : ${id}`);
  }
});

// 2. Vérification de l'attribution réglementaire (DGSCGC, ASNR, SGDSN, etc.)
if (!protocolsContent.includes('DGSCGC') && !protocolsContent.includes('Sécurité Civile')) {
  errors.push('Aucune référence à la DGSCGC / Sécurité Civile détectée.');
}
if (!protocolsContent.includes('ASNR') && !protocolsContent.includes('ASN')) {
  errors.push('Aucune référence à l\'ASNR / IRSN détectée pour le nucléaire.');
}

// 3. Vérification des doctrines d'État
['PIRATOX', 'BIOTOX', 'PIRANET'].forEach((doctrine) => {
  if (!sourcesContent.includes(doctrine)) {
    errors.push(`Doctrine interministérielle manquante dans les sources : ${doctrine}`);
  }
});

// 4. Vérification de la règle d'interdiction formelle d'automédication iode
if (!protocolsContent.includes('iode') && !protocolsContent.includes('Iode')) {
  errors.push('Avertissement légal sur l\'iode manquant.');
}

if (errors.length > 0) {
  console.error('❌ Échec du contrôle éditorial :');
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

console.log('✅ Tous les contrôles de conformité éditoriale et de traçabilité ont réussi (Corpus v2.4 Approuvé).');
process.exit(0);
