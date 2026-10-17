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
  dataSourceType: 'live_api' | 'cached_official' | 'unverified_empty' | 'pedagogical_sample';
  risksCount: number;
  risks: GeorisquesReportRisk[];
}

const TIMEOUT_MS = 5000;

/**
 * Recherche de communes par nom ou code postal via l'API publique geo.api.gouv.fr
 * Inclut le centre géographique réel [longitude, latitude] pour géolocaliser précisément la commune
 */
export async function searchCommunesOnline(query: string): Promise<{
  success: boolean;
  data: CommuneSearchResult[];
  error?: string;
}> {
  if (!query || query.trim().length < 2) {
    return { success: true, data: [] };
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
    return {
      success: false,
      data: [],
      error: err.name === 'AbortError'
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
      error: err.name === 'AbortError'
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
 * Si aucune donnée n'est disponible, signale explicitement l'absence de données au lieu d'inventer un inventaire factice.
 */
export async function fetchGeorisquesOnline(inseeCode: string, communeName: string): Promise<GeorisquesReport> {
  const cacheKey = `georisques_cache_${inseeCode}`;
  
  // Tente de vérifier si un cache local authentifié existe déjà
  let cached: GeorisquesReport | null = null;
  try {
    const s = localStorage.getItem(cacheKey);
    if (s) cached = JSON.parse(s);
  } catch (e) {}

  // Si pas de réseau et un cache authentifié existe, renvoie immédiatement le cache
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
      const data = await res.json();
      const firstEntry = data?.data?.[0];
      const rawRisks = firstEntry?.risques_detail || [];

      if (rawRisks.length > 0) {
        // Traitement des risques officiels notifiés dans GASPAR
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
    }
  } catch (err) {
    clearTimeout(timer);
  }

  // 1. Si un cache authentifié antérieur existe pour cette commune, l'utiliser avec mention explicite de cache
  if (cached) {
    return { ...cached, isOfflineCache: true, dataSourceType: 'cached_official' };
  }

  // 2. Si aucune donnée authentifiée n'est disponible (échec réseau et zéro cache pour cette commune) :
  // NE JAMAIS injecter de faux risques Seveso/nucléaire présentés comme certifiés locaux !
  return {
    communeName,
    inseeCode,
    retrievedAt: new Date().toISOString(),
    source: 'Non synchronisé (Aucune donnée en cache local pour cette commune)',
    isOfflineCache: false,
    dataSourceType: 'unverified_empty',
    risksCount: 0,
    risks: []
  };
}
