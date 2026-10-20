import { AVAILABLE_COMMUNES } from '../../data/georisquesData';

export interface CommuneSearchResult {
  nom: string;
  code: string; // Code INSEE
  codeDepartement: string;
  codesPostaux: string[];
  population?: number;
  centre?: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
}

export interface GeorisquesReportRisk {
  id: string;
  category: string;
  title: string;
  description: string;
  officialDocumentUrl?: string;
  protocolKey?: 'chimique' | 'nucleaire' | 'confinement' | 'bio';
}

export interface GeorisquesReport {
  communeName: string;
  inseeCode: string;
  retrievedAt: string;
  source: string;
  isOfflineCache: boolean;
  dataSourceType:
    | 'live_api'
    | 'live_api_zero_risk'
    | 'cached_official'
    | 'unverified_empty'
    | 'pedagogical_sample'
    | 'network_error'
    | 'api_error';
  risksCount: number;
  risks: GeorisquesReportRisk[];
}

const TIMEOUT_MS = 5000;

/**
 * Recherche de communes par nom ou code postal via l'API publique geo.api.gouv.fr
 * Inclut le centre géographique réel [longitude, latitude] pour géolocaliser précisément la commune
 * En mode hors-connexion, filtre automatiquement le corpus territorial local pré-embarqué.
 */
export async function searchCommunesOnline(query: string): Promise<{
  success: boolean;
  data: CommuneSearchResult[];
  error?: string;
  isOfflineLocal?: boolean;
}> {
  if (!query || query.trim().length < 2) {
    return { success: true, data: [] };
  }

  const q = query.trim().toLowerCase();

  // Si hors-ligne strict, recherche immédiate dans les bassins de référence locaux
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    const localMatches = AVAILABLE_COMMUNES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.postalCode.includes(q) ||
        c.insee.includes(q)
    ).map((c) => ({
      nom: c.name,
      code: c.insee,
      codeDepartement: c.departement || '',
      codesPostaux: [c.postalCode],
      centre: {
        type: 'Point',
        coordinates: [c.lng, c.lat] as [number, number]
      }
    }));
    return { success: true, data: localMatches, isOfflineLocal: true };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const isPostal = /^\d{2,5}$/.test(query.trim());
    const url = isPostal
      ? `https://geo.api.gouv.fr/communes?codePostal=${encodeURIComponent(query.trim())}&fields=nom,code,codeDepartement,codesPostaux,population,centre&limit=6`
      : `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(query.trim())}&fields=nom,code,codeDepartement,codesPostaux,population,centre&limit=6`;

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });

    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`API Indisponible (${res.status})`);
    }

    const data: CommuneSearchResult[] = await res.json();
    return { success: true, data };
  } catch (err: any) {
    clearTimeout(timer);

    // En cas d'échec réseau, repli transparent sur la base locale avec coordonnées certifiées
    const localMatches = AVAILABLE_COMMUNES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.postalCode.includes(q) ||
        c.insee.includes(q)
    ).map((c) => ({
      nom: c.name,
      code: c.insee,
      codeDepartement: c.departement || '',
      codesPostaux: [c.postalCode],
      centre: {
        type: 'Point',
        coordinates: [c.lng, c.lat] as [number, number]
      }
    }));

    if (localMatches.length > 0) {
      return { success: true, data: localMatches, isOfflineLocal: true };
    }

    return {
      success: false,
      data: [],
      error:
        err.name === 'AbortError'
          ? 'Délai d\'attente dépassé (mode hors-ligne actif)'
          : 'Connexion réseau indisponible - consultation du cache local'
    };
  }
}

/**
 * Géocodage inverse : retrouve la commune officielle française à partir de coordonnées GPS (W3C Geolocation)
 */
export async function reverseGeocodeOnline(lat: number, lon: number): Promise<{
  success: boolean;
  commune?: CommuneSearchResult;
  error?: string;
}> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `https://geo.api.gouv.fr/communes?lat=${lat}&lon=${lon}&fields=nom,code,codeDepartement,codesPostaux,population,centre`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });

    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`Erreur reverse geocoding (${res.status})`);
    }

    const list: CommuneSearchResult[] = await res.json();
    if (!list || list.length === 0) {
      return { success: false, error: 'Aucune commune française trouvée à ces coordonnées' };
    }

    return { success: true, commune: list[0] };
  } catch (err: any) {
    clearTimeout(timer);
    return {
      success: false,
      error:
        err.name === 'AbortError'
          ? 'Délai d\'attente dépassé (mode hors-ligne)'
          : 'Impossible d\'effectuer le géocodage inverse'
    };
  }
}

/**
 * Échantillon pédagogique de démonstration pour la formation, clairement séparé de tout inventaire communal réel
 */
export function getPedagogicalSampleRisks(): GeorisquesReportRisk[] {
  return [
    {
      id: 'pedago-1',
      category: 'Exemple Pédagogique • Risque Chimique (Seveso)',
      title: 'Installation Industrielle Seveso (Exemple illustratif)',
      description: 'Exemple de fiche pour établissement classé sous PPRT. Confinement étanche prioritaire sauf ordre formel d’évacuation.',
      officialDocumentUrl: 'https://www.georisques.gouv.fr/',
      protocolKey: 'chimique'
    },
    {
      id: 'pedago-2',
      category: 'Exemple Pédagogique • TMD',
      title: 'Transport de Matières Dangereuses (Exemple illustratif)',
      description: 'Transit ferroviaire ou routier de matières dangereuses. Dégagement perpendiculaire à l’axe du vent si surpris en extérieur.',
      officialDocumentUrl: 'https://www.georisques.gouv.fr/',
      protocolKey: 'confinement'
    },
    {
      id: 'pedago-3',
      category: 'Exemple Pédagogique • Risque Nucléaire',
      title: 'Bassin Régional PPI Nucléaire (Exemple illustratif)',
      description: 'Écran de protection gamma dans bâtiment en dur. Aucune prise d’iode préventive sans ordre formel du Préfet.',
      officialDocumentUrl: 'https://www.asnr.fr/',
      protocolKey: 'nucleaire'
    }
  ];
}

/**
 * Récupère la synthèse des risques locaux pour une commune via l'API officielle Géorisques (data.gouv.fr)
 * avec mise en cache locale et gestion stricte hors-ligne.
 * Distingue rigoureusement :
 * - Une réponse officielle valide avec risques notifiés ('live_api')
 * - Une réponse officielle valide sans risque notifié ('live_api_zero_risk')
 * - Une restitution d'un cache local officiel antérieur ('cached_official')
 * - Un échec réseau / hors-ligne ('network_error')
 * - Une erreur de structure / HTTP de l'API ('api_error')
 */
/**
 * Validation de conformité des codes INSEE français :
 * - France métropolitaine : 5 chiffres (ex: 75056, 69383)
 * - Corse : 2A + 3 chiffres (ex: 2A004 Ajaccio) ou 2B + 3 chiffres (ex: 2B033 Bastia)
 * - Départements et régions d'outre-mer (DROM) : 5 chiffres commençant par 97 ou 98 (ex: 97415 Saint-Denis)
 */
export function isValidInseeCode(inseeCode: string): boolean {
  if (!inseeCode || typeof inseeCode !== 'string') return false;
  return /^(?:[0-9]{5}|2[AB][0-9]{3})$/i.test(inseeCode.trim());
}

export async function fetchGeorisquesOnline(inseeCode: string, communeName: string): Promise<GeorisquesReport> {
  const cacheKey = `georisques_cache_${inseeCode}`;

  // Tente de vérifier si un cache local existe déjà
  let cached: GeorisquesReport | null = null;
  try {
    const s = localStorage.getItem(cacheKey);
    if (s) cached = JSON.parse(s);
  } catch (e) {}

  // Si pas de réseau et un cache existe, renvoie immédiatement la dernière réponse enregistrée
  if (typeof navigator !== 'undefined' && !navigator.onLine && cached) {
    return { ...cached, isOfflineCache: true, dataSourceType: 'cached_official' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `https://www.georisques.gouv.fr/api/v1/gaspar/risques?code_insee=${encodeURIComponent(inseeCode)}`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (res.ok) {
      let data: any = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        if (cached) return { ...cached, isOfflineCache: true, dataSourceType: 'cached_official' };
        return {
          communeName,
          inseeCode,
          retrievedAt: new Date().toISOString(),
          source: 'Format de réponse invalide de l’API Géorisques (JSON corrompu)',
          isOfflineCache: false,
          dataSourceType: 'api_error',
          risksCount: 0,
          risks: []
        };
      }

      // Validation de conformité du code INSEE demandé
      if (!isValidInseeCode(inseeCode)) {
        if (cached) return { ...cached, isOfflineCache: true, dataSourceType: 'cached_official' };
        return {
          communeName,
          inseeCode,
          retrievedAt: new Date().toISOString(),
          source: `Code INSEE invalide ou non conforme (${inseeCode}) : validation territoriale impossible`,
          isOfflineCache: false,
          dataSourceType: 'api_error',
          risksCount: 0,
          risks: []
        };
      }

      // Validation stricte de la structure GASPAR officielle
      // Format attendu : { data: [ { code_insee: "...", risques_detail: [...] } ] } ou { data: [] }
      if (!data || typeof data !== 'object' || !Array.isArray(data.data)) {
        if (cached) return { ...cached, isOfflineCache: true, dataSourceType: 'cached_official' };
        return {
          communeName,
          inseeCode,
          retrievedAt: new Date().toISOString(),
          source: 'Structure de réponse inattendue de l’API Géorisques (attribut data manquant ou non tabulaire)',
          isOfflineCache: false,
          dataSourceType: 'api_error',
          risksCount: 0,
          risks: []
        };
      }

      const dataArray = data.data;

      // Si le tableau data est explicitement vide : l'API a bien reçu la requête pour ce code INSEE et confirme zéro dossier renvoyé
      if (dataArray.length === 0) {
        const zeroRiskReport: GeorisquesReport = {
          communeName,
          inseeCode,
          retrievedAt: new Date().toISOString(),
          source: 'Réponse de l’API Géorisques (data.gouv.fr / BRGM) : aucun dossier renvoyé par cette requête dans la base consultée (GASPAR) à la date de vérification. Cela ne prouve pas l’absence de tout risque sur la commune et ne se substitue pas aux informations officielles de prévention (DICRIM, arrêtés préfectoraux, bulletins de vigilance).',
          isOfflineCache: false,
          dataSourceType: 'live_api_zero_risk',
          risksCount: 0,
          risks: []
        };

        try {
          localStorage.setItem(cacheKey, JSON.stringify(zeroRiskReport));
        } catch (e) {}

        return zeroRiskReport;
      }

      const firstEntry = dataArray[0];
      if (!firstEntry || typeof firstEntry !== 'object') {
        if (cached) return { ...cached, isOfflineCache: true, dataSourceType: 'cached_official' };
        return {
          communeName,
          inseeCode,
          retrievedAt: new Date().toISOString(),
          source: 'Structure de réponse inattendue de l’API Géorisques (premier enregistrement invalide)',
          isOfflineCache: false,
          dataSourceType: 'api_error',
          risksCount: 0,
          risks: []
        };
      }

      // Vérification obligatoire de la présence et cohérence du code INSEE retourné
      if (!firstEntry.code_insee || String(firstEntry.code_insee).trim() !== String(inseeCode).trim()) {
        if (cached) return { ...cached, isOfflineCache: true, dataSourceType: 'cached_official' };
        return {
          communeName,
          inseeCode,
          retrievedAt: new Date().toISOString(),
          source: `Divergence territoriale API : code INSEE reçu (${firstEntry.code_insee || 'absent'}) ne correspond pas au code sélectionné (${inseeCode})`,
          isOfflineCache: false,
          dataSourceType: 'api_error',
          risksCount: 0,
          risks: []
        };
      }

      // Vérification que le champ risques_detail est bien un tableau
      if (!Array.isArray(firstEntry.risques_detail)) {
        if (cached) return { ...cached, isOfflineCache: true, dataSourceType: 'cached_official' };
        return {
          communeName,
          inseeCode,
          retrievedAt: new Date().toISOString(),
          source: 'Structure de réponse inattendue de l’API Géorisques (champ risques_detail manquant ou non tabulaire)',
          isOfflineCache: false,
          dataSourceType: 'api_error',
          risksCount: 0,
          risks: []
        };
      }

      const rawRisks: any[] = firstEntry.risques_detail;

      // CAS 1 : Réponse officielle valide avec des risques recensés
      if (rawRisks.length > 0) {
        const parsedRisks: GeorisquesReportRisk[] = rawRisks.map((r: any, idx: number) => {
          const label = r.libelle_risque_long || r.libelle_risque_jo || 'Risque Technologique';
          let protocolKey: 'chimique' | 'nucleaire' | 'confinement' | 'bio' | undefined = undefined;
          let category = 'Risque Majeur Notifié';

          if (/industriel|seveso|chim|toxique/i.test(label)) {
            protocolKey = 'chimique';
            category = 'Risque Industriel & Seveso';
          } else if (/matières dangereuses|marchandises dangereuses|tmd/i.test(label)) {
            protocolKey = 'confinement';
            category = 'Transport Matières Dangereuses (TMD)';
          } else if (/radon|nucl|radioac/i.test(label)) {
            protocolKey = 'nucleaire';
            category = 'Risque Radiologique';
          } else if (/inondation|barrage|submersion/i.test(label)) {
            protocolKey = 'confinement';
            category = 'Risque Naturel / Rupture';
          }

          return {
            id: `gaspar-${idx}`,
            category,
            title: label,
            description: `Recensé dans le dossier communal d'information préfectoral (GASPAR/Géorisques).`,
            officialDocumentUrl: `https://www.georisques.gouv.fr/mes-risques/connaitre-les-risques-pres-de-chez-moi?code_insee=${inseeCode}`,
            protocolKey
          };
        });

        const report: GeorisquesReport = {
          communeName,
          inseeCode,
          retrievedAt: new Date().toISOString(),
          source: 'API Géorisques officielle en direct (data.gouv.fr / BRGM)',
          isOfflineCache: false,
          dataSourceType: 'live_api',
          risksCount: parsedRisks.length,
          risks: parsedRisks
        };

        try {
          localStorage.setItem(cacheKey, JSON.stringify(report));
        } catch (e) {}

        return report;
      }

      // CAS 2 : Réponse officielle valide mais AUCUN risque notifié dans GASPAR pour cette commune
      const zeroRiskReport: GeorisquesReport = {
        communeName,
        inseeCode,
        retrievedAt: new Date().toISOString(),
        source: 'Réponse de l’API Géorisques (data.gouv.fr / BRGM) : aucun dossier renvoyé par cette requête dans la base consultée (GASPAR) à la date de vérification. Cela ne prouve pas l’absence de tout risque sur la commune et ne remplace pas l’ensemble des informations officielles de prévention (DICRIM, arrêtés préfectoraux, bulletins de vigilance).',
        isOfflineCache: false,
        dataSourceType: 'live_api_zero_risk',
        risksCount: 0,
        risks: []
      };

      try {
        localStorage.setItem(cacheKey, JSON.stringify(zeroRiskReport));
      } catch (e) {}

      return zeroRiskReport;
    }

    // Erreur HTTP (ex: 500, 502, 404)
    if (cached) {
      return { ...cached, isOfflineCache: true, dataSourceType: 'cached_official' };
    }

    return {
      communeName,
      inseeCode,
      retrievedAt: new Date().toISOString(),
      source: `Erreur serveur API Géorisques (${res.status} ${res.statusText || 'Erreur'})`,
      isOfflineCache: false,
      dataSourceType: 'api_error',
      risksCount: 0,
      risks: []
    };
  } catch (err: any) {
    clearTimeout(timer);

    if (cached) {
      return { ...cached, isOfflineCache: true, dataSourceType: 'cached_official' };
    }

    const isTimeout = err?.name === 'AbortError';
    return {
      communeName,
      inseeCode,
      retrievedAt: new Date().toISOString(),
      source: isTimeout
        ? 'Délai d\'attente dépassé (API Géorisques injoignable ou réseau ralenti)'
        : 'Échec de connexion réseau (Terminal hors-ligne ou serveur inaccessible)',
      isOfflineCache: false,
      dataSourceType: 'network_error',
      risksCount: 0,
      risks: []
    };
  }
}
