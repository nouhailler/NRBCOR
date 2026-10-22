/**
 * Service d'export PDF et d'impression haute fidélité pour le classeur de crise citoyen.
 * Génère des documents PDF téléchargeables hors-ligne via jsPDF et des fiches mémo imprimables A4.
 * Guides couverts :
 * 1. Déshabillage d'urgence en 8 étapes
 * 2. Fiche Iode stable & posologie officielle (subordonnée au Préfet)
 * 3. Guide de Confinement opérationnel (choix de pièce, calfeutrage, ventilation)
 * 4. Plan Familial de Mise à l'Abri synthétique
 * 5. Pack Complet Classeur de Crise (4 fiches en 1 document)
 */

import { jsPDF } from 'jspdf';
import { APP_VERSION } from '../constants/appInfo';
import { FamilyPlanData } from './storage/StorageRepository';

export type PrintableGuideKey = 'deshabillage' | 'iode' | 'confinement' | 'plan' | 'pack-complet';

export interface GuideMeta {
  key: PrintableGuideKey;
  title: string;
  subtitle: string;
  category: string;
  docId: string;
  authority: string;
}

export const CRISIS_GUIDES_METADATA: Record<PrintableGuideKey, GuideMeta> = {
  deshabillage: {
    key: 'deshabillage',
    title: 'Protocole de Déshabillage d’Urgence (8 Étapes)',
    subtitle: 'Élimination de 90% de la contamination surfacique sans dispersion ni transfert interne',
    category: 'DÉCONTAMINATION D’URGENCE • TOUS SCÉNARIOS NRBC',
    docId: 'NRBCOR-CLASSEUR-DESHAB-01',
    authority: 'DGSCGC • Service de Santé des Armées • INRS'
  },
  iode: {
    key: 'iode',
    title: 'Fiche Doctrinale Iode Stable (KI 65 mg)',
    subtitle: 'Tableau posologique par tranche d’âge et consignes impératives de primauté préfectorale',
    category: 'PROTECTION THYROÏDIENNE ACCIDENT DE RÉACTEUR NUCLÉAIRE',
    docId: 'NRBCOR-CLASSEUR-IODE-02',
    authority: 'Autorité de Sûreté Nucléaire (ASNR) • ANSM • Pharmacie Centrale des Armées'
  },
  confinement: {
    key: 'confinement',
    title: 'Guide Opérationnel du Confinement Étanche',
    subtitle: 'Mise à l’abri immédiate, choix de la pièce refuge, calfeutrage et gestion de la ventilation',
    category: 'SAUVEGARDE CIVILE IMMÉDIATE • HABITATION ET LOCAUX CLÔS',
    docId: 'NRBCOR-CLASSEUR-CONF-03',
    authority: 'DGSCGC • SGDSN • IRSN'
  },
  plan: {
    key: 'plan',
    title: 'Plan Familial de Mise à l’Abri Synthétique',
    subtitle: 'Points de ralliement, contact relais distant, membres du foyer et équipement vital 72h',
    category: 'PLAN FAMILIAL DE MISE EN SÛRETÉ (PFMS)',
    docId: 'NRBCOR-CLASSEUR-PFMS-04',
    authority: 'Direction Générale de la Sécurité Civile (DGSCGC)'
  },
  'pack-complet': {
    key: 'pack-complet',
    title: 'Classeur de Crise Citoyen NRBCOR (Pack Complet)',
    subtitle: 'Recueil des 4 guides indispensables à conserver imprimés dans le classeur physique du foyer',
    category: 'DOSSIER OPÉRATIONNEL COMPLET POUR CLASSEUR PAPIER',
    docId: 'NRBCOR-CLASSEUR-INTEGRAL-V2',
    authority: 'Corpus Interministériel SGDSN / DGSCGC / ASNR / IRSN'
  }
};

/**
 * Configure les en-têtes et pieds de page standardisés pour un document A4 dans jsPDF
 */
function applyPdfHeaderFooter(doc: jsPDF, pageNum: number, totalPages: number, title: string, docId: string) {
  // Barre supérieure bleue foncée
  doc.setFillColor(0, 17, 38);
  doc.rect(10, 10, 190, 14, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('RÉPUBLIQUE FRANÇAISE • SÉCURITÉ CIVILE • CLASSEUR DE CRISE NRBCOR', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(152, 246, 197);
  doc.text(`VERSION ${APP_VERSION} HORS-LIGNE`, 170, 18);

  // Pied de page
  doc.setDrawColor(196, 198, 206);
  doc.line(10, 282, 200, 282);

  doc.setFontSize(7.5);
  doc.setTextColor(68, 71, 77);
  doc.text(`Document de sauvegarde citoyenne • ${docId} • Consultation papier d'urgence`, 10, 287);
  doc.text(`Page ${pageNum} / ${totalPages}`, 180, 287);
}

/**
 * Génère et déclenche le téléchargement direct d'un PDF pour le guide sélectionné
 */
export async function downloadGuidePdf(guideKey: PrintableGuideKey, familyPlan?: FamilyPlanData | null): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const meta = CRISIS_GUIDES_METADATA[guideKey];

  if (guideKey === 'deshabillage') {
    renderDeshabillagePdf(doc, meta);
  } else if (guideKey === 'iode') {
    renderIodePdf(doc, meta);
  } else if (guideKey === 'confinement') {
    renderConfinementPdf(doc, meta);
  } else if (guideKey === 'plan') {
    renderPlanPdf(doc, meta, familyPlan);
  } else if (guideKey === 'pack-complet') {
    renderPackCompletPdf(doc, familyPlan);
  }

  const filename = `NRBCOR_Classeur_Crise_${guideKey.toUpperCase()}.pdf`;
  doc.save(filename);
}

function renderDeshabillagePdf(doc: jsPDF, meta: GuideMeta) {
  applyPdfHeaderFooter(doc, 1, 1, meta.title, meta.docId);

  // Titre principal
  doc.setTextColor(0, 17, 38);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(meta.title, 10, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(68, 71, 77);
  doc.text(meta.subtitle, 10, 37);

  // Cadre avertissement
  doc.setFillColor(255, 218, 214);
  doc.rect(10, 42, 190, 16, 'F');
  doc.setDrawColor(255, 180, 171);
  doc.rect(10, 42, 190, 16, 'S');

  doc.setTextColor(147, 0, 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('RÈGLE CARDINALE DE DÉSHABILLAGE D’URGENCE (TOUT RISQUE NRBC) :', 13, 47);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Retirer 90% des toxiques sans jamais secouer les vêtements. Ne jamais frotter vigoureusement la peau.', 13, 52);
  doc.text('Ensacher doublement les effets usagés dans des sacs étanches fermés à l’extérieur du lieu de confinement.', 13, 56);

  // Les 8 étapes numérotées
  const steps = [
    { num: 1, title: 'Sas d’entrée & sas tampon', desc: 'S’arrêter sur le pas de porte ou dans un sas avant de pénétrer dans la pièce refuge.' },
    { num: 2, title: 'Déchaussage sans les mains', desc: 'Retirer les chaussures de l’extérieur sans toucher les semelles contaminées.' },
    { num: 3, title: 'Dégagement des gants / mains', desc: 'Retirer le premier gant en pinçant la paume, puis le second en glissant un doigt nu à l’intérieur.' },
    { num: 4, title: 'Déshabillage du haut vers le bas', desc: 'Ouvrir les fermetures sans secouer. Enrouler les vêtements sur l’envers (face propre visible).' },
    { num: 5, title: 'Passage de tête précautionneux', desc: 'Tirer les pulls et tee-shirts vers l’avant en fermant les yeux et la bouche sans frotter le visage.' },
    { num: 6, title: 'Double ensachage hermétique', desc: 'Glisser les vêtements dans un premier sac poubelle épais, fermer avec du ruban adhésif, placer dans un 2e sac.' },
    { num: 7, title: 'Douche tiède savonneuse sans friction', desc: 'Laver doucement cheveux, visage et corps au savon doux. Ne pas brosser ni exfolier la peau.' },
    { num: 8, title: 'Habillage de rechange & hydratation', desc: 'Enfiler des vêtements propres stockés dans le kit. Boire uniquement de l’eau minérale scellée.' }
  ];

  let y = 64;
  doc.setFontSize(9);

  steps.forEach((st) => {
    // Boîte étape
    doc.setFillColor(238, 244, 255);
    doc.roundedRect(10, y, 190, 23, 2, 2, 'F');
    doc.setDrawColor(214, 228, 248);
    doc.roundedRect(10, y, 190, 23, 2, 2, 'S');

    // Numéro
    doc.setFillColor(0, 17, 38);
    doc.circle(18, y + 11.5, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(String(st.num), 16.5, y + 13);

    // Titre et description
    doc.setTextColor(0, 17, 38);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(`Étape ${st.num} : ${st.title}`, 26, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(68, 71, 77);
    doc.text(st.desc, 26, y + 15, { maxWidth: 165 });

    y += 26;
  });
}

function renderIodePdf(doc: jsPDF, meta: GuideMeta) {
  applyPdfHeaderFooter(doc, 1, 1, meta.title, meta.docId);

  // Titre principal
  doc.setTextColor(0, 17, 38);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(meta.title, 10, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(68, 71, 77);
  doc.text(meta.subtitle, 10, 37);

  // Avertissement formel préfectoral
  doc.setFillColor(255, 218, 214);
  doc.rect(10, 42, 190, 20, 'F');
  doc.setDrawColor(186, 26, 26);
  doc.setLineWidth(0.8);
  doc.rect(10, 42, 190, 20, 'S');

  doc.setTextColor(147, 0, 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('AVERTISSEMENT FORMEL : SUBORDINATION STRICTE À L’ORDRE DU PRÉFET', 13, 48);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Ce document est purement indicatif. Ne prenez JAMAIS d’iode de manière préventive ou anticipée.', 13, 53);
  doc.text('La prise doit intervenir STRICTEMENT et EXCLUSIVEMENT au signal officiel de la Préfecture (FR-Alert / Radio).', 13, 57);

  // Tableau posologique officiel
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 17, 38);
  doc.text('Tableau Posologique Officiel (Iodure de Potassium KI 65 mg sécable)', 10, 68);

  const rows = [
    { age: 'Nouveau-né (moins de 1 mois)', dose: '1/4 comprimé', ki: '16,25 mg', iode: '12,5 mg', note: 'Dissoudre dans lait ou eau tiède' },
    { age: 'Nourrisson (1 mois à 3 ans)', dose: '1/2 comprimé', ki: '32,5 mg', iode: '25 mg', note: 'Écraser dans compote ou boisson' },
    { age: 'Enfant de 3 à 12 ans', dose: '1 comprimé', ki: '65 mg', iode: '50 mg', note: 'À croquer ou dissoudre' },
    { age: 'Adulte et enfant de plus de 12 ans', dose: '2 comprimés', ki: '130 mg', iode: '100 mg', note: 'Prise unique avec un grand verre d’eau' },
    { age: 'Femmes enceintes ou allaitantes', dose: '2 comprimés', ki: '130 mg', iode: '100 mg', note: 'Priorité vitale de protection fœtale' },
    { age: 'Adultes de plus de 40 ans', dose: 'NON recommandé', ki: '0 mg', iode: '0 mg', note: 'Sauf consigne préfectorale exceptionnelle' }
  ];

  let y = 74;
  // En-tête tableau
  doc.setFillColor(0, 17, 38);
  doc.rect(10, y, 190, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Tranche d’âge & Profil', 12, y + 5.5);
  doc.text('Posologie (KI 65mg)', 70, y + 5.5);
  doc.text('Équiv. Iode', 115, y + 5.5);
  doc.text('Modalités de prise', 145, y + 5.5);

  y += 8;

  rows.forEach((r, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 238 : 255, isEven ? 244 : 255, isEven ? 255 : 255);
    doc.rect(10, y, 190, 11, 'F');
    doc.setDrawColor(214, 228, 248);
    doc.rect(10, y, 190, 11, 'S');

    doc.setTextColor(0, 17, 38);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(r.age, 12, y + 7);

    doc.setTextColor(r.dose === 'NON recommandé' ? 186 : 0, r.dose === 'NON recommandé' ? 26 : 54, r.dose === 'NON recommandé' ? 26 : 206);
    doc.text(r.dose, 70, y + 7);

    doc.setTextColor(68, 71, 77);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(r.iode, 115, y + 7);
    doc.text(r.note, 145, y + 7);

    y += 11;
  });

  // Points doctrinaux clés
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 17, 38);
  doc.text('Rappels Doctrinaux Essentiels (IRSN / ASNR) :', 10, y);

  y += 6;
  const doctrinals = [
    '• Fenêtre d’efficacité maximale : entre 2 heures avant le passage du panache et 2 heures après son début.',
    '• Inutilité totale contre les autres rayonnements : l’iode stable ne protège PAS contre l’irradiation globale gamma ni contre le Césium-137.',
    '• Inefficacité hors réacteur nucléaire : strictement inopérant en cas de bombe sale, fuite chimique ou source scellée orpheline.',
    '• Contre-indications : antécédent de choc anaphylactique au comprimé d’iode, dermatite herpétiforme, vascularite hypocomplémentémique.',
    '• Conservation : plaquettes aluminium scellées, température inférieure à 25°C, strictement hors de portée des jeunes enfants.'
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(68, 71, 77);
  doctrinals.forEach((line) => {
    doc.text(line, 10, y, { maxWidth: 190 });
    y += 7;
  });
}

function renderConfinementPdf(doc: jsPDF, meta: GuideMeta) {
  applyPdfHeaderFooter(doc, 1, 1, meta.title, meta.docId);

  // Titre principal
  doc.setTextColor(0, 17, 38);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(meta.title, 10, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(68, 71, 77);
  doc.text(meta.subtitle, 10, 37);

  // Cadre avertissement
  doc.setFillColor(222, 225, 255);
  doc.rect(10, 42, 190, 16, 'F');
  doc.setDrawColor(185, 195, 255);
  doc.rect(10, 42, 190, 16, 'S');

  doc.setTextColor(0, 18, 88);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('CONSIGNE FONDAMENTALE DE SÉCURITÉ CIVILE (DGSCGC) :', 13, 47);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Le confinement immédiat dans un bâtiment en dur clos divise par plus de 10 l’exposition aux toxiques extérieurs.', 13, 52);
  doc.text('Ne quittez le local sous aucun prétexte avant l’annonce officielle de fin d’alerte (sirène continue 30s ou FR-Alert).', 13, 56);

  // 4 Piliers du confinement
  const pillars = [
    {
      num: 1,
      title: '1. CHOIX DE LA PIÈCE REFUGE',
      items: [
        'Nucléaire / Radiologique : Sous-sol bétonné ou pièce centrale du rez-de-chaussée entourée de maçonnerie dense (écran gamma).',
        'Chimique : Pièce centrale fermée sans prise d’air directe. Suivre impérativement les consignes diffusées en temps réel par la Préfecture (pas de règle universelle d’étage).',
        'Éviter impérativement : vérandas, combles légers sous toiture, pièces à simples vitrages ou parois minces.'
      ]
    },
    {
      num: 2,
      title: '2. CALFEUTRAGE HERMÉTIQUE',
      items: [
        'Fermer et verrouiller portes, fenêtres et volets (premier écran mécanique et thermique).',
        'Obturer les entrées d’air en feuillure de fenêtre avec du ruban adhésif toilé épais (type duct tape).',
        'Disposer des serviettes ou linges tassés humidifiés sous les portes pour freiner les courants d’air.'
      ]
    },
    {
      num: 3,
      title: '3. ARRÊT TOTAL DES VENTILATIONS ET APPAREILS THERMIQUES',
      items: [
        'Couper immédiatement la VMC, climatiseurs réversibles et hottes aspirantes (disjoncteur dédié au tableau électrique).',
        'Éteindre cheminées, poêles et chaudières à tirage pour éviter appel d’air et intoxication au CO.',
        'Fermer le registre des conduits de fumée si possible.'
      ]
    },
    {
      num: 4,
      title: '4. VEILLE INFORMATIVE & SILENCE TÉLÉPHONIQUE',
      items: [
        'Allumer la radio à piles ou manivelle sur France Bleu ou réseau d’alerte régional.',
        'Consulter les messages FR-Alert sur smartphone.',
        'NE PAS TÉLÉPHONER : préserver les lignes cellulaires pour le 15, 18 et 112 (secours d’urgence).'
      ]
    }
  ];

  let y = 63;
  pillars.forEach((pil) => {
    doc.setFillColor(238, 244, 255);
    doc.roundedRect(10, y, 190, 48, 2, 2, 'F');
    doc.setDrawColor(214, 228, 248);
    doc.roundedRect(10, y, 190, 48, 2, 2, 'S');

    doc.setTextColor(0, 17, 38);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(pil.title, 14, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(68, 71, 77);

    let itemY = y + 15;
    pil.items.forEach((it) => {
      doc.text(`• ${it}`, 14, itemY, { maxWidth: 180 });
      itemY += 10;
    });

    y += 52;
  });
}

function renderPlanPdf(doc: jsPDF, meta: GuideMeta, plan?: FamilyPlanData | null) {
  applyPdfHeaderFooter(doc, 1, 1, meta.title, meta.docId);

  // Titre principal
  doc.setTextColor(0, 17, 38);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(meta.title, 10, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(68, 71, 77);
  doc.text(meta.subtitle, 10, 37);

  // Cadre de confidentialité
  doc.setFillColor(238, 244, 255);
  doc.rect(10, 41, 190, 14, 'F');
  doc.setDrawColor(214, 228, 248);
  doc.rect(10, 41, 190, 14, 'S');

  doc.setTextColor(0, 54, 206);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('DONNÉES FAMILIALES CONFIDENTIELLES • SUPPORT PAPIER PHYSIQUE', 13, 46);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(68, 71, 77);
  doc.text('Conservez cette fiche dans votre classeur de crise, à proximité du kit 72h. Ne la diffusez pas en ligne.', 13, 51);

  let y = 60;

  // 1. Contact Relais Hors Zone
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(0, 17, 38);
  doc.text('1. CONTACT RELAIS HORS ZONE (> 100 KM) :', 10, y);

  y += 5;
  doc.setFillColor(0, 17, 38);
  doc.roundedRect(10, y, 190, 20, 2, 2, 'F');

  doc.setTextColor(152, 246, 197);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`Nom : ${plan?.outZoneContact?.name || 'À renseigner (ex: Grand-parent / Proche en province)'}`, 14, y + 7);
  doc.text(`Téléphone SMS : ${plan?.outZoneContact?.phone || 'À renseigner'}`, 14, y + 14);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Distance : ${plan?.outZoneContact?.dist || 'À distance de la zone de crise'}`, 130, y + 7);
  doc.text('Format SMS : « Suis à l’abri / Tout va bien »', 130, y + 14);

  // 2. Points de Ralliement
  y += 28;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(0, 17, 38);
  doc.text('2. POINTS DE RALLIEMENT DU FOYER :', 10, y);

  y += 5;
  const pts = plan?.assemblyPoints && plan.assemblyPoints.length > 0 ? plan.assemblyPoints : [
    { type: 'primary', name: 'Point Primaire (Quartier proche)', desc: 'Kiosque du square ou sortie de quartier', coords: '48.8566 N, 2.3522 E' },
    { type: 'secondary', name: 'Point Secondaire (Hors agglomération)', desc: 'Mairie de commune limitrophe ou salle polyvalente', coords: 'En dehors de la zone de danger' }
  ];

  pts.forEach((pt) => {
    doc.setFillColor(238, 244, 255);
    doc.roundedRect(10, y, 190, 16, 2, 2, 'F');
    doc.setDrawColor(214, 228, 248);
    doc.roundedRect(10, y, 190, 16, 2, 2, 'S');

    doc.setTextColor(0, 17, 38);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`[${pt.type === 'primary' ? 'PRIMAIRE' : 'SECONDAIRE'}] ${pt.name}`, 14, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(68, 71, 77);
    doc.text(`${pt.desc} • Coordonnées / Repère : ${pt.coords}`, 14, y + 12);

    y += 19;
  });

  // 3. Membres du Foyer et besoins
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(0, 17, 38);
  doc.text('3. MEMBRES DU FOYER ET BESOINS SPÉCIFIQUES :', 10, y);

  y += 5;
  const members = plan?.members && plan.members.length > 0 ? plan.members : [
    { role: 'Responsable du foyer', details: 'Détenteur des clés du local de confinement et radio FM' },
    { role: 'Personne vulnérable / Enfant', details: 'Médication spécifique, lunettes, doudou / réconfort' }
  ];

  members.slice(0, 4).forEach((m) => {
    doc.setFillColor(248, 249, 255);
    doc.roundedRect(10, y, 190, 12, 1.5, 1.5, 'F');
    doc.setDrawColor(196, 198, 206);
    doc.roundedRect(10, y, 190, 12, 1.5, 1.5, 'S');

    doc.setTextColor(0, 17, 38);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(`• ${m.role}`, 14, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(68, 71, 77);
    doc.text(m.details, 14, y + 9.5, { maxWidth: 180 });

    y += 14;
  });

  // 4. Checklist récapitulative
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(0, 17, 38);
  doc.text('4. RÈGLES D’OR EN CAS D’ALERTE :', 10, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 17, 38);
  const checklist = [
    '[ ] Ne JAMAIS prendre sa voiture (engorgement mortel et habitacle non étanche).',
    '[ ] Ne JAMAIS aller chercher les enfants à l’école (le PPMS de l’école les protège).',
    '[ ] Calfeutrer hermétiquement les fenêtres et couper la VMC.',
    '[ ] Écouter France Bleu sur le récepteur radio à piles ou à manivelle.',
    '[ ] Zéro prise d’iode sans ordre formel et explicite de la Préfecture.'
  ];

  checklist.forEach((c) => {
    doc.text(c, 12, y);
    y += 6;
  });
}

function renderPackCompletPdf(doc: jsPDF, familyPlan?: FamilyPlanData | null) {
  // Page 1 : Déshabillage
  renderDeshabillagePdf(doc, CRISIS_GUIDES_METADATA.deshabillage);

  // Page 2 : Iode
  doc.addPage('a4', 'portrait');
  renderIodePdf(doc, CRISIS_GUIDES_METADATA.iode);

  // Page 3 : Confinement
  doc.addPage('a4', 'portrait');
  renderConfinementPdf(doc, CRISIS_GUIDES_METADATA.confinement);

  // Page 4 : Plan Familial
  doc.addPage('a4', 'portrait');
  renderPlanPdf(doc, CRISIS_GUIDES_METADATA.plan, familyPlan);
}
