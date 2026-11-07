/**
 * Configuration centralisée pour la Landing Page NRBCOR
 * 
 * Les URLs publiques sont configurables ici ou via des variables d'environnement (VITE_APP_URL, etc.).
 * Si aucune URL absolue externe n'est spécifiée, le lien bascule directement vers l'application PWA embarquée.
 */

export interface LandingConfig {
  appName: string;
  appFullName: string;
  taglineFr: string;
  taglineEn: string;
  githubUrl: string;
  docsUrl: string;
  releasesUrl: string;
  appUrl: string; // URL vers l'application PWA (configurable)
  version: string;
  author: string;
  license: string;
  keywords: string[];
}

// Récupération de l'URL de l'application via les variables d'environnement si disponibles
const envAppUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_URL) as string | undefined;

export const LANDING_CONFIG: LandingConfig = {
  appName: 'NRBCOR',
  appFullName: 'Protection civile et résilience face aux risques NRBC',
  taglineFr: 'Anticiper les risques. Préparer ses proches. Savoir réagir.',
  taglineEn: 'Anticipate risks. Prepare your household. Know how to react.',
  githubUrl: 'https://github.com/nouhailler/NRBCOR',
  docsUrl: 'https://github.com/nouhailler/NRBCOR#readme',
  releasesUrl: 'https://github.com/nouhailler/NRBCOR/releases',
  // URL de l'application : si spécifiée dans l'environnement, on l'utilise, sinon navigation vers l'app locale
  appUrl: envAppUrl && envAppUrl.trim().length > 0 ? envAppUrl.trim() : '/?view=app',
  version: 'v1.6.0',
  author: 'Patrick Nouhailler',
  license: 'Open Source MIT',
  keywords: [
    'NRBC', 'CBRN', 'protection civile', 'survie 72h', 'kit urgence', 
    'nucléaire', 'radiologique', 'biologique', 'chimique', 'PWA hors-ligne',
    'confinement', 'décontamination', 'Géorisques', 'résilience citoyenne'
  ]
};
