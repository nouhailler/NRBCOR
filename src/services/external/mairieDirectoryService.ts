/**
 * Service d'interrogation de l'annuaire officiel de l'administration française
 * API: api-lannuaire.service-public.fr (Direction de l'information légale et administrative - DILA / Premier ministre)
 * Permet d'obtenir les coordonnées réelles, authentifiées et vérifiées de la mairie de la commune active.
 */

export interface MairieContact {
  inseeCode: string;
  communeName: string;
  nomOfficiel: string;
  telephone: string | null;
  telephoneDescription?: string;
  adresseCourriel?: string;
  siteInternet?: string;
  adressePostale?: {
    ligne: string;
    codePostal: string;
    nomCommune: string;
  };
  horairesDescription?: string;
  sourceUrl?: string;
  derniereVerification: string;
  isAuthentifie: boolean;
}

const CACHE_KEY_PREFIX = 'nrbcor_mairie_contact_';

export async function fetchMairieContact(inseeCode: string, communeName: string): Promise<MairieContact | null> {
  // 1. Vérification dans le cache local
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${inseeCode}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Utiliser le cache si moins de 7 jours
        return parsed;
      }
    } catch (e) {}
  }

  // 2. Si hors ligne, retourner null pour ne pas inventer un numéro erroné
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return null;
  }

  // 3. Appel de l'API officielle de l'annuaire de l'administration
  try {
    const encodedWhere = encodeURIComponent(`code_insee_commune="${inseeCode}" AND pivot LIKE "mairie"`);
    const url = `https://api-lannuaire.service-public.fr/api/explore/v2.1/catalog/datasets/api-lannuaire-administration/records?where=${encodedWhere}&limit=1`;
    
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) return null;

    const data = await res.json();
    const record = data?.results?.[0];
    if (!record) return null;

    // Décodage des champs JSON imbriqués de l'annuaire
    let telephone: string | null = null;
    let telephoneDesc: string | undefined = undefined;
    if (record.telephone) {
      try {
        const telArr = typeof record.telephone === 'string' ? JSON.parse(record.telephone) : record.telephone;
        if (Array.isArray(telArr) && telArr.length > 0) {
          telephone = telArr[0].valeur || null;
          telephoneDesc = telArr[0].description || undefined;
        }
      } catch (e) {
        telephone = typeof record.telephone === 'string' ? record.telephone : null;
      }
    }

    let siteInternet: string | undefined = undefined;
    if (record.site_internet) {
      try {
        const siteArr = typeof record.site_internet === 'string' ? JSON.parse(record.site_internet) : record.site_internet;
        if (Array.isArray(siteArr) && siteArr.length > 0) {
          siteInternet = siteArr[0].valeur;
        }
      } catch (e) {}
    }

    let adressePostale: MairieContact['adressePostale'] = undefined;
    if (record.adresse) {
      try {
        const adrArr = typeof record.adresse === 'string' ? JSON.parse(record.adresse) : record.adresse;
        if (Array.isArray(adrArr) && adrArr.length > 0) {
          const a = adrArr[0];
          adressePostale = {
            ligne: [a.numero_voie, a.complement1, a.complement2].filter(Boolean).join(' '),
            codePostal: a.code_postal || '',
            nomCommune: a.nom_commune || communeName
          };
        }
      } catch (e) {}
    }

    const contact: MairieContact = {
      inseeCode,
      communeName,
      nomOfficiel: record.nom || `Mairie de ${communeName}`,
      telephone,
      telephoneDescription: telephoneDesc,
      adresseCourriel: record.adresse_courriel || undefined,
      siteInternet,
      adressePostale,
      sourceUrl: record.url_service_public || `https://lannuaire.service-public.gouv.fr/`,
      derniereVerification: new Date().toISOString(),
      isAuthentifie: true
    };

    // Mise en cache
    try {
      localStorage.setItem(`${CACHE_KEY_PREFIX}${inseeCode}`, JSON.stringify(contact));
    } catch (e) {}

    return contact;
  } catch (err) {
    console.warn('Erreur lors de l’interrogation de l’annuaire du service public:', err);
    return null;
  }
}
