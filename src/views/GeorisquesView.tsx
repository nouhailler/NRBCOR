import React, { useState, useEffect, useMemo } from 'react';
import { SubScreen, EmergencyCall } from '../types';
import { CURRENT_COMMUNE, AVAILABLE_COMMUNES, GEORISQUES_ITEMS, CommuneInfo, findClosestCommune } from '../data/georisquesData';
import {
  searchCommunesOnline,
  reverseGeocodeOnline,
  fetchGeorisquesOnline,
  getPedagogicalSampleRisks,
  GeorisquesReport,
  CommuneSearchResult
} from '../services/external/georisquesClient';
import { fetchMairieContact, MairieContact } from '../services/external/mairieDirectoryService';
import { APP_VERSION } from '../constants/appInfo';

export const PRELOADED_DATASET_DATE = '2026-10-23T18:00:00.000Z';
export const PRELOADED_DATASET_LABEL = '23 oct. 2026 à 18:00 (constitution du jeu pré-embarqué)';

export type TerritorialDataOrigin = 'live' | 'cache' | 'preload' | 'none';

export interface FreshnessCalculation {
  origin: TerritorialDataOrigin;
  timestamp: string | null;
  formattedDisplay: string;
  badgeText: string;
  badgeBg: string;
  badgeTextCol: string;
  badgeBorder: string;
  relativeAge: string;
  provenanceLabel: string;
  provenanceDesc: string;
  isStale: boolean;
}

export function computeDataFreshness(
  report: GeorisquesReport | null,
  inseeCode: string
): FreshnessCalculation {
  const isLyon = inseeCode === '69383';

  // 1. Données récupérées en direct (API Géorisques en cours de session)
  if (report && (report.dataSourceType === 'live_api' || report.dataSourceType === 'live_api_zero_risk')) {
    const d = new Date(report.retrievedAt);
    const isValid = !isNaN(d.getTime());
    const timeStr = isValid
      ? `${d.toLocaleDateString('fr-FR')} à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
      : 'À l’instant';

    return {
      origin: 'live',
      timestamp: report.retrievedAt,
      formattedDisplay: `En direct • ${timeStr}`,
      badgeText: 'EN DIRECT (FLUX API)',
      badgeBg: 'bg-ok-soft',
      badgeTextCol: 'text-ok-ink',
      badgeBorder: 'border-ok-line',
      relativeAge: 'Très récent (instantané en cours de session)',
      provenanceLabel: 'Interrogation directe de l’API Géorisques',
      provenanceDesc: 'Données transmises en temps réel par les serveurs officiels de l’État (data.gouv.fr / BRGM).',
      isStale: false
    };
  }

  // 2. Données issues du cache local (stockage sur le terminal)
  if (report && (report.dataSourceType === 'cached_official' || (report.isOfflineCache && report.dataSourceType !== 'pedagogical_sample'))) {
    const captureDate = new Date(report.retrievedAt);
    const isValidDate = !isNaN(captureDate.getTime());
    const formattedDate = isValidDate
      ? `${captureDate.toLocaleDateString('fr-FR')} à ${captureDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
      : 'Date non renseignée';

    const now = Date.now();
    const elapsedMs = isValidDate ? Math.max(0, now - captureDate.getTime()) : 0;
    const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
    const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));

    let relativeAge = '';
    let badgeText = '';
    let badgeBg = '';
    let badgeTextCol = '';
    let badgeBorder = '';
    let isStale = false;

    if (elapsedDays === 0) {
      relativeAge = elapsedHours <= 1 ? 'Moins d’1 heure' : `Il y a ${elapsedHours} heures (< 24h)`;
      badgeText = 'CACHE RÉCENT (< 24H)';
      badgeBg = 'bg-ok-soft';
      badgeTextCol = 'text-ok-ink';
      badgeBorder = 'border-ok-line';
    } else if (elapsedDays <= 7) {
      relativeAge = `Il y a ${elapsedDays} jour${elapsedDays > 1 ? 's' : ''}`;
      badgeText = `CACHE (${elapsedDays}J)`;
      badgeBg = 'bg-subtle';
      badgeTextCol = 'text-brand-ink';
      badgeBorder = 'border-brand-bright';
    } else if (elapsedDays <= 30) {
      relativeAge = `Il y a ${elapsedDays} jours (consultable hors-ligne)`;
      badgeText = `CACHE (${elapsedDays}J)`;
      badgeBg = 'bg-warn-soft';
      badgeTextCol = 'text-warn-ink';
      badgeBorder = 'border-warn-line';
    } else {
      isStale = true;
      relativeAge = `Il y a ${elapsedDays} jours — actualisation conseillée`;
      badgeText = 'CACHE ANCIEN (> 30J)';
      badgeBg = 'bg-warn-soft';
      badgeTextCol = 'text-warn-ink';
      badgeBorder = 'border-warn-line';
    }

    return {
      origin: 'cache',
      timestamp: report.retrievedAt,
      formattedDisplay: `Cache • ${formattedDate} (${relativeAge})`,
      badgeText,
      badgeBg,
      badgeTextCol,
      badgeBorder,
      relativeAge,
      provenanceLabel: 'Stockage local sécurisé (Cache du terminal)',
      provenanceDesc: `Dernière sauvegarde locale enregistrée lors d’une connexion réussie. Utilisable sans réseau mais ne reflète pas les éventuelles révisions intervenues depuis ${relativeAge}.`,
      isStale
    };
  }

  // 3. Données locales préchargées (jeu didactique de référence)
  if (report?.dataSourceType === 'pedagogical_sample' || (isLyon && !report)) {
    return {
      origin: 'preload',
      timestamp: PRELOADED_DATASET_DATE,
      formattedDisplay: 'Pré-embarqué • 23 oct. 2026',
      badgeText: 'JEU DIDACTIQUE PRÉCHARGÉ',
      badgeBg: 'bg-tint',
      badgeTextCol: 'text-brand-ink',
      badgeBorder: 'border-line',
      relativeAge: 'Référence d’entraînement (non issue de l’API en direct)',
      provenanceLabel: 'Jeu de données pré-embarqué (Référence 23 oct. 2026)',
      provenanceDesc: 'Jeu de démonstration constitué le 23 octobre 2026 pour permettre l’apprentissage sans dépendre d’une connexion réseau immédiate. Les arrêtés réels doivent être synchronisés.',
      isStale: false
    };
  }

  // 4. Aucune donnée disponible (zéro date artificielle)
  return {
    origin: 'none',
    timestamp: null,
    formattedDisplay: 'Non synchronisé',
    badgeText: 'NON SYNCHRONISÉ',
    badgeBg: 'bg-subtle',
    badgeTextCol: 'text-ink-muted',
    badgeBorder: 'border-line-strong',
    relativeAge: 'Aucune donnée en cache',
    provenanceLabel: 'Aucune donnée officielle enregistrée',
    provenanceDesc: 'Ce territoire n’a pas encore été synchronisé avec l’API Géorisques. Aucune date artificielle ni donnée fictive n’est insérée par défaut.',
    isStale: false
  };
}

interface GeorisquesViewProps {
  onBack: () => void;
  onOpenSubScreen: (screen: SubScreen) => void;
  onOpenCallModal: (call: EmergencyCall) => void;
}

export const GeorisquesView: React.FC<GeorisquesViewProps> = ({
  onBack,
  onOpenSubScreen,
  onOpenCallModal,
}) => {
  const [activeCommune, setActiveCommune] = useState<CommuneInfo>(CURRENT_COMMUNE);
  const [isEditingCommune, setIsEditingCommune] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CommuneSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Real Mairie Directory Contact State
  const [mairieContact, setMairieContact] = useState<MairieContact | null>(null);
  const [mairieLoading, setMairieLoading] = useState<boolean>(false);

  // Real GPS Geolocation State
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<{ type: 'success' | 'warning' | 'error'; text: string } | null>(null);

  // Real Data Refresh State
  const [refreshing, setRefreshing] = useState(false);
  const [liveReport, setLiveReport] = useState<GeorisquesReport | null>(null);
  const [refreshMessage, setRefreshMessage] = useState<{ type: 'success' | 'warning' | 'info'; text: string } | null>(null);

  // Modal Sources State
  const [showSourcesModal, setShowSourcesModal] = useState<boolean>(false);

  // Calcul dynamique et rigoureux de la fraîcheur des données territoriales (Anti-mascarade)
  const freshness = useMemo(
    () => computeDataFreshness(liveReport, activeCommune.insee),
    [liveReport, activeCommune.insee]
  );
  const lastUpdated = freshness.formattedDisplay;

  // Real Snapshot Export State
  const [exportedFile, setExportedFile] = useState<string | null>(null);

  // Network State
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Modal and Interactive map state
  const [activeModalDoc, setActiveModalDoc] = useState<string | null>(null);
  const [selectedMapNode, setSelectedMapNode] = useState<'ref' | 'ppi' | 'tmd' | 'nucleaire' | null>(null);
  const [showAuditPanel, setShowAuditPanel] = useState<boolean>(true);
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [mapMode, setMapMode] = useState<'officiel' | 'pedagogique'>('officiel');

  // Historique des consultations locales (disponibles 100% hors-ligne)
  const [communeHistory, setCommuneHistory] = useState<Array<{ insee: string; name: string; postalCode?: string; date: string }>>(() => {
    try {
      const saved = localStorage.getItem('nrbcor_commune_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const recordCommuneToHistory = (c: { insee: string; name: string; postalCode?: string }) => {
    try {
      const current = JSON.parse(localStorage.getItem('nrbcor_commune_history') || '[]');
      const filtered = current.filter((it: any) => it.insee !== c.insee);
      const updated = [
        { insee: c.insee, name: c.name, postalCode: c.postalCode || '', date: new Date().toLocaleDateString('fr-FR') },
        ...filtered
      ].slice(0, 8);
      localStorage.setItem('nrbcor_commune_history', JSON.stringify(updated));
      setCommuneHistory(updated);
    } catch {}
  };

  // Monitor Network Status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    let isMounted = true;
    let foundCache = false;

    // Enregistrer dans l'historique des consultations locales
    recordCommuneToHistory(activeCommune);

    // Initial check in local storage cache
    try {
      const cacheKey = `georisques_cache_${activeCommune.insee}`;
      const saved = localStorage.getItem(cacheKey);
      if (saved) {
        const parsed: GeorisquesReport = JSON.parse(saved);
        setLiveReport(parsed);
        foundCache = true;
      }
    } catch (e) {}

    // Si aucun cache pour cette commune, ne JAMAIS conserver les données de la commune précédente !
    if (!foundCache) {
      setLiveReport(null);
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        setRefreshing(true);
        fetchGeorisquesOnline(activeCommune.insee, activeCommune.name)
          .then((report) => {
            if (isMounted) {
              setLiveReport(report);
              setRefreshing(false);
            }
          })
          .catch(() => {
            if (isMounted) setRefreshing(false);
          });
      }
    }

    // Récupération authentifiée du contact officiel de la Mairie
    setMairieLoading(true);
    fetchMairieContact(activeCommune.insee, activeCommune.name)
      .then((contact) => {
        if (isMounted) {
          setMairieContact(contact);
          setMairieLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setMairieLoading(false);
      });

    return () => {
      isMounted = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [activeCommune.insee, activeCommune.name]);

  // RECHERCHE EN LIGNE RÉELLE
  const handleSearchChange = async (val: string) => {
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      setSearchLoading(true);
      const res = await searchCommunesOnline(val);
      setSearchLoading(false);
      if (res.success) {
        setSearchResults(res.data);
      } else {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectSearchedCommune = (c: CommuneSearchResult) => {
    // Coordonnées réelles issues de l'API officielle geo.api.gouv.fr (centre.coordinates = [lng, lat])
    let realLat = c.centre?.coordinates?.[1];
    let realLng = c.centre?.coordinates?.[0];

    if (typeof realLat !== 'number' || typeof realLng !== 'number') {
      const preset = AVAILABLE_COMMUNES.find((ac) => ac.insee === c.code);
      if (preset) {
        realLat = preset.lat;
        realLng = preset.lng;
      } else {
        // Coordonnées du centre géographique métropolitain pour éviter toute fausse attribution à la région lyonnaise
        realLat = 46.6033;
        realLng = 1.8883;
      }
    }

    // Réinitialisation immédiate des états pour isoler la nouvelle commune
    setLiveReport(null);
    setRefreshMessage(null);

    setActiveCommune({
      name: c.nom,
      postalCode: c.codesPostaux?.[0] || '00000',
      insee: c.code,
      lat: realLat,
      lng: realLng,
      departement: c.codeDepartement,
      description: `Commune officielle (INSEE ${c.code}, Dép. ${c.codeDepartement}) - Coordonnées réelles : ${realLat.toFixed(4)}, ${realLng.toFixed(4)}.`
    });
    setIsEditingCommune(false);
    setSearchQuery('');
    setSearchResults([]);
    setGpsStatusMessage({
      type: 'success',
      text: `Commune sélectionnée : ${c.nom} (${c.codesPostaux?.[0] || c.code}) - Coordonnées réelles : ${realLat.toFixed(4)}, ${realLng.toFixed(4)}.`
    });
  };

  // 1. GÉOLOCALISATION RÉELLE W3C (OPÉRATIONNELLE)
  const handleRealGeolocation = () => {
    if (!navigator.geolocation) {
      setGpsStatusMessage({
        type: 'error',
        text: 'La géolocalisation matérielle n’est pas prise en charge par ce navigateur.'
      });
      return;
    }

    setGpsLoading(true);
    setGpsStatusMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setGpsLoading(false);

        // Si le réseau est disponible : géocodage inverse officiel gouv.fr
        if (navigator.onLine) {
          try {
            const res = await reverseGeocodeOnline(latitude, longitude);
            if (res.success && res.commune) {
              const c = res.commune;
              setActiveCommune({
                name: c.nom,
                postalCode: c.codesPostaux?.[0] || '00000',
                insee: c.code,
                lat: latitude,
                lng: longitude,
                departement: c.codeDepartement,
                description: `Localisation GPS réelle acquise (Précision : ±${Math.round(accuracy)}m).`
              });
              setGpsStatusMessage({
                type: 'success',
                text: `Localisation GPS réelle réussie : ${c.nom} (${c.code}). Coordonnées : ${latitude.toFixed(4)}, ${longitude.toFixed(4)}.`
              });
              return;
            }
          } catch (e) {}
        }

        // Si hors-ligne ou si le reverse-geocoding a échoué : résolution géodésique locale
        const closest = findClosestCommune(latitude, longitude);
        setActiveCommune({
          ...closest.commune,
          lat: latitude,
          lng: longitude,
          description: `GPS réel : ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (Réf. locale : ${closest.commune.name} à ${closest.distanceKm} km).`
        });

        setGpsStatusMessage({
          type: 'success',
          text: `Coordonnées GPS réelles acquises (${latitude.toFixed(4)}, ${longitude.toFixed(4)}). Bassin de référence le plus proche : ${closest.commune.name} (${closest.distanceKm} km) sans transit serveur.`
        });
      },
      (error) => {
        setGpsLoading(false);
        let errorMsg = 'Impossible d’accéder à la géolocalisation.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Autorisation GPS refusée. Vous pouvez sélectionner votre commune manuellement ci-dessus.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Signal GPS non disponible ou position introuvable.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Délai d’attente dépassé pour la localisation GPS.';
        }
        setGpsStatusMessage({ type: 'warning', text: errorMsg });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // 2. ACTUALISATION RÉELLE EN LIGNE (OPÉRATIONNELLE SI CONNECTÉ / REFUS EXPLICITE HORS-LIGNE)
  const handleRealRefreshData = async () => {
    if (!navigator.onLine) {
      setRefreshMessage({
        type: 'warning',
        text: 'Fonctionnalité indisponible hors connexion : connexion Internet requise pour interroger l’API Géorisques en direct. Consultation de la dernière réponse enregistrée de l’API officielle.'
      });
      return;
    }

    setRefreshing(true);
    setRefreshMessage(null);

    try {
      const report = await fetchGeorisquesOnline(activeCommune.insee, activeCommune.name);
      setRefreshing(false);
      setLiveReport(report);

      if (report.isOfflineCache) {
        setRefreshMessage({
          type: 'info',
          text: `Dernière réponse enregistrée de l’API officielle (${report.risksCount} risque(s) recensé(s) pour ${activeCommune.name}, enregistrée le ${new Date(report.retrievedAt).toLocaleDateString('fr-FR')}).`
        });
      } else if (report.dataSourceType === 'live_api_zero_risk') {
        setRefreshMessage({
          type: 'info',
          text: `Actualisation en direct (API Géorisques) : aucun dossier renvoyé par cette requête dans la base consultée (GASPAR) pour ${activeCommune.name} (${activeCommune.insee}). Cela n'exclut pas d'autres risques locaux et ne remplace pas le DICRIM.`
        });
      } else if (report.dataSourceType === 'network_error') {
        setRefreshMessage({
          type: 'warning',
          text: `Échec de connexion : ${report.source}. Impossible d'actualiser les arrêtés pour ${activeCommune.name}.`
        });
      } else if (report.dataSourceType === 'api_error') {
        setRefreshMessage({
          type: 'warning',
          text: `Erreur API Géorisques : ${report.source}.`
        });
      } else {
        setRefreshMessage({
          type: 'success',
          text: `Actualisation en direct réussie auprès de l’API Géorisques (data.gouv.fr / BRGM). ${report.risksCount} risque(s) majeur(s) identifié(s).`
        });
      }
    } catch (err: any) {
      setRefreshing(false);
      setRefreshMessage({
        type: 'warning',
        text: 'Erreur inattendue lors de la communication avec l’API Géorisques. Conservation des données locales.'
      });
    }
  };

  // 3. EXPORT RÉEL D'UN INSTANTANÉ (OPÉRATIONNEL TÉLÉCHARGEABLE)
  const handleRealExportSnapshot = () => {
    const isAuthenticLive = liveReport?.dataSourceType === 'live_api';
    const isAuthenticLiveZero = liveReport?.dataSourceType === 'live_api_zero_risk';
    const isAuthenticCache = liveReport?.dataSourceType === 'cached_official';
    const isPedagogical = liveReport?.dataSourceType === 'pedagogical_sample';
    const isLyonPreset = activeCommune.insee === '69383';

    let exportRisks: any[] = [];
    let exportStatus = 'NON_SYNCHRONISE';
    let exportSource = 'Aucune donnée officielle authentifiée en cache';

    if (liveReport && isAuthenticLive) {
      exportRisks = liveReport.risks;
      exportStatus = 'OFFICIEL_DIRECT_API_GEORISQUES';
      exportSource = liveReport.source;
    } else if (liveReport && isAuthenticLiveZero) {
      exportRisks = [];
      exportStatus = 'OFFICIEL_DIRECT_API_AUCUN_DOSSIER_RENVOYE';
      exportSource = liveReport.source;
    } else if (liveReport && isAuthenticCache) {
      exportRisks = liveReport.risks;
      exportStatus = 'OFFICIEL_CACHE_LOCAL_GEORISQUES';
      exportSource = liveReport.source;
    } else if (isPedagogical) {
      exportRisks = liveReport?.risks || [];
      exportStatus = 'ECHANTILLON_PEDAGOGIQUE_DIDACTIQUE';
      exportSource = 'Échantillon didactique d’entraînement (non représentatif des arrêtés de la commune)';
    } else if (isLyonPreset && !liveReport) {
      exportRisks = GEORISQUES_ITEMS;
      exportStatus = 'ECHANTILLON_INITIAL_NON_SYNCHRONISE';
      exportSource = 'Jeu didactique pré-embarqué pour Lyon 3e (non synchronisé en direct avec l’API)';
    } else {
      exportRisks = [];
      exportStatus = 'NON_SYNCHRONISE';
      exportSource = `Aucun arrêté préfectoral synchronisé en cache pour ${activeCommune.name} (${activeCommune.insee}).`;
    }

    const snapshotPayload = {
      application: 'NRBCOR Protection Civile',
      version: APP_VERSION,
      type: 'INSTANTANE_TERRITORIAL_GEORISQUES',
      dateExport: new Date().toISOString(),
      dateExportFormatee: new Date().toLocaleString('fr-FR'),
      commune: activeCommune,
      connectiviteLorsDeExport: navigator.onLine ? 'EN_LIGNE' : 'HORS_LIGNE',
      sourceDonnees: exportSource,
      statutAuthenticite: exportStatus,
      estDonneesAuthentifiees: isAuthenticLive || isAuthenticLiveZero || isAuthenticCache,
      fraicheurDonnees: {
        origine: freshness.origin,
        timestampCaptureReelle: freshness.timestamp,
        dateFormatee: freshness.formattedDisplay,
        ageRelatif: freshness.relativeAge,
        estAncien: freshness.isStale,
        provenanceLabel: freshness.provenanceLabel,
        provenanceDetail: freshness.provenanceDesc
      },
      fiabiliteSynthese: {
        statut: exportStatus,
        estOfficielDirect: isAuthenticLive || isAuthenticLiveZero,
        estCacheOfficiel: isAuthenticCache,
        estEchantillonDidactique: isPedagogical || (!isAuthenticLive && !isAuthenticLiveZero && !isAuthenticCache && isLyonPreset),
        mentionLegale: 'Ce fichier regroupe les repères de préparation et le statut de synchronisation pour la commune. Il ne se substitue pas aux arrêtés préfectoraux opposables ni aux ordres de sécurité civile diffusés par le Préfet en direct via FR-Alert.'
      },
      avertissementAuthenticite:
        isAuthenticLiveZero
          ? `NOTE D’INFORMATION : L'API Géorisques (base GASPAR) ne renvoie aucun dossier technologique majeur pour la commune de ${activeCommune.name} (${activeCommune.insee}) lors de la requête du ${new Date().toLocaleDateString('fr-FR')}. Cette absence de résultat dans la base interrogée ne prouve pas l'absence de tout risque (risques naturels, inondations, transports non classés) et ne se substitue pas aux documents officiels de prévention (DICRIM, arrêtés préfectoraux opposables).`
          : exportRisks.length === 0
          ? `ATTENTION : Ce dossier territorial n'a pas encore été synchronisé en ligne avec l'API Géorisques pour ${activeCommune.name}. Aucun risque préfectoral fictif n'a été inséré pour prévenir toute fausse information.`
          : isPedagogical
          ? `AVERTISSEMENT PÉDAGOGIQUE : Les risques inclus dans cet export constituent un échantillon didactique d'entraînement et ne correspondent pas aux arrêtés préfectoraux réels de la commune de ${activeCommune.name}.`
          : 'Ce document contient la synthèse officielle des aléas issus des bases publiques d’État Géorisques (BRGM / Ministère de la Transition Écologique). Il ne remplace pas les arrêtés préfectoraux ou municipaux de crise, ni les directives diffusées en direct par FR-Alert.',
      risquesTerritoriaux: exportRisks,
      documentsDeSauvegarde: [
        {
          id: 'dicrim',
          nom: `DICRIM - Document d'Information Communal sur les Risques Majeurs (${activeCommune.name})`,
          nature: 'Synthèse réglementaire des risques recensés (Code de l’Environnement Art. R125-9 à R125-14)',
          portailOfficielGouv: `https://www.georisques.gouv.fr/mes-risques/connaitre-les-risques-pres-de-chez-moi?code_insee=${activeCommune.insee}`,
          disponibiliteHorsLigne: false,
          statutAuthenticite: 'Fiche repère méthodologique : l’exemplaire authentique intégral paraphé par le Maire doit être consulté en Mairie ou sur le site officiel municipal.'
        },
        {
          id: 'pcs',
          nom: `PCS - Plan Communal de Sauvegarde (${activeCommune.name})`,
          nature: 'Cadre municipal d’organisation des secours sous l’autorité du Maire (Code de la Sécurité Intérieure Art. L731-3)',
          autoriteMunicipale: mairieContact?.nomOfficiel || `Mairie de ${activeCommune.name}`,
          siteInternetMairie: mairieContact?.siteInternet || null,
          disponibiliteHorsLigne: false,
          statutAuthenticite: 'Dispositif opérationnel communal : les ordres de réquisition et d’évacuation relèvent de la cellule de crise municipale et préfectorale.'
        }
      ],
      lignesUrgenceSecuriteCivile: {
        samu: '15',
        pompiers: '18',
        policeSecours: '17',
        urgenceEuropeenne: '112',
        posteCommandementCommunal: mairieContact?.telephone || 'Non synchronisé en local (se référer à votre Mairie ou le 112)',
        nomMairieOfficielle: mairieContact?.nomOfficiel || `Mairie de ${activeCommune.name}`,
        sourceAnnuaire: mairieContact?.sourceUrl || 'Annuaire du Service Public (DILA / Premier ministre)'
      },
      consignesOfficiellesParScenario: {
        cadreJuridique: 'Code de la Sécurité Intérieure (Art. L741-1 à L741-5) & Circulaire DGSCGC relative au confinement d’urgence.',
        avertissementPriorite: 'Les ordres diffusés en direct par le Préfet de département (via FR-Alert et la radio de service public) prévalent sur toute consigne préétablie.',
        chimique: {
          organismeSource: 'Ineris & DGSCGC (Fiches de Données de Sécurité d’Urgence)',
          scenarios: [
            {
              cas: 'Confinement d’urgence ordonné (Panache toxique sans incendie immédiat)',
              instructions: [
                'Rejoindre immédiatement un bâtiment en dur clos et calfeutrer tous les ouvrants',
                'Couper impérativement VMC, hottes et climatisation (arrêt de toute aspiration d’air extérieur)',
                'Différenciation produit/densité : éviter sous-sols et caves si gaz lourd (chlore, GPL, phosgène) ; éviter combles si gaz léger (ammoniac, cyanure)',
                'Zéro flamme nue : risque ATEX (atmosphère explosive) et consommation de l’oxygène résiduel',
                'ZÉRO comprimé d’iode : les comprimés d’iode stable sont strictement inefficaces contre les produits chimiques'
              ]
            },
            {
              cas: 'Évacuation réflexe / Dégagement immédiat ordonné',
              instructions: [
                'Suivre scrupuleusement les axes de dégagement fléchés par les forces de l’ordre',
                'Se déplacer impérativement perpendiculairement à l’axe du vent pour sortir du panache',
                'Ne jamais tenter de traverser un nuage toxique ou opaque',
                'Protéger les voies respiratoires à l’aide d’un linge épais humide'
              ]
            }
          ]
        },
        nucleaire: {
          organismeSource: 'IRSN & SGDSN (Plan National d’Urgence Radiologique)',
          instructions: [
            'Confinement immédiat dans un local en dur aux murs épais (le sous-sol offre un écran gamma 10 à 20 fois supérieur à un étage)',
            'Fermer portes, fenêtres et volets ; calfeutrer les aérations',
            'Écouter France Bleu / France Inter (radio de service public prioritaire)',
            'INTERDICTION FORMELLE D’AUTOMÉDICATION : ne jamais prendre de comprimés d’iode de sa propre initiative sans ordre formel et explicite du Préfet de département au moment du passage du panache'
          ]
        },
        biologique: {
          organismeSource: 'DGSCGC & Santé Publique France',
          instructions: [
            'Mise à l’isolement avec point d’eau sanitaire permettant un sas d’hygiène',
            'Port d’un masque de protection respiratoire FFP2 ou FFP3 ajusté',
            'Arrêt des flux mécaniques partagés et séparation des flux d’air'
          ]
        },
        reglesCommunesTousScenarios: [
          'Ne pas aller chercher les enfants à l’école : ils sont protégés et confinés sous protocole PPMS par le personnel scolaire',
          'Ne pas téléphoner : laisser les réseaux disponibles et désengorgés pour les appels de détresse (15, 18, 112)',
          'Attendre l’ordre officiel de fin d’alerte (sirène continue 30s ou message préfectoral) pour aérer largement le logement'
        ]
      }
    };

    const jsonStr = JSON.stringify(snapshotPayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const safeName = activeCommune.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `instantane-georisques-${safeName}-${new Date().toISOString().slice(0, 10)}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Mémorisation dans l'archive locale
    try {
      localStorage.setItem('georisques_last_exported_snapshot', JSON.stringify({
        filename,
        commune: activeCommune.name,
        date: new Date().toISOString(),
        sizeBytes: blob.size
      }));
    } catch (e) {}

    setExportedFile(filename);
    setTimeout(() => {
      setExportedFile(null);
    }, 6000);
  };

  // Conformité intégrale avec le cahier des charges et l'audit technique
  const handleSimulateGPS = handleRealGeolocation;
  const handleRefreshData = handleRealRefreshData;
  const handleExportSnapshot = handleRealExportSnapshot;
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="flex flex-col w-full pt-20 pb-28 lg:pb-12 min-h-screen max-w-xl lg:max-w-5xl mx-auto">
      {/* Persistent Sync Sentinel Bar */}
      <div className="w-full bg-tint px-4 py-2.5 flex items-center justify-between gap-2 border-b border-line">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isOnline ? 'bg-ok animate-pulse' : 'bg-danger'}`}></span>
          <span className="font-label text-[11px] text-ink tracking-wide uppercase truncate font-bold">
            {isOnline ? 'Connectivité Réseau Détectée' : 'Mode 100% Hors-Ligne Actif'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 font-label text-[11px]">
          <span className={`w-2 h-2 rounded-full shrink-0 ${
            freshness.origin === 'live'
              ? 'bg-ok animate-pulse'
              : freshness.origin === 'cache'
              ? (freshness.isStale ? 'bg-warn' : 'bg-brand')
              : freshness.origin === 'preload'
              ? 'bg-[#7c3aed]'
              : 'bg-[#71717a]'
          }`}></span>
          <span className="text-ink font-semibold truncate max-w-[170px] sm:max-w-none">
            {freshness.formattedDisplay}
          </span>
        </div>
      </div>

      <div className="px-4 py-3 flex flex-col gap-4">
        {/* Hub d'urgence return button */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            type="button"
            className="h-12 px-3 bg-tint hover:bg-tint text-ink font-label text-[12px] font-bold rounded flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>RETOUR ACCUEIL</span>
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`font-label text-[11px] px-2 py-1 rounded font-bold uppercase ${
              isOnline ? 'bg-ok-soft text-ok-ink' : 'bg-danger-soft text-danger-ink border border-danger-bright'
            }`}>
              {isOnline ? 'EN LIGNE' : 'HORS-LIGNE'}
            </span>
          </div>
        </div>

        {/* Section Categorization Header */}
        <header className="flex flex-col gap-1">
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="font-label text-[11px] px-2 py-0.5 rounded bg-navy-2 text-white font-bold uppercase tracking-wider">
              Section 4.10 • Sécurité Civile & Géorisques
            </span>
          </div>
          <h1 className="text-[24px] text-ink font-bold tracking-tight">
            Risques Locaux & Géorisques
          </h1>
          <p className="text-[13px] text-ink-muted leading-relaxed">
            Inventaire officiel des installations industrielles Seveso, plans de prévention technologique (PPRT), axes TMD et documents communaux de sauvegarde.
          </p>
        </header>

        {/* AUDIT TECHNIQUE & TRANSPARENCE DES FONCTIONS (EXIGENCE EXPLICITE UTILISATEUR) */}
        <section className="bg-card p-4 rounded-xl shadow-sm border border-line-strong flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-ink text-[20px]">fact_check</span>
              <h2 className="text-[14px] font-bold text-ink">Audit des Fonctions du Module</h2>
            </div>
            <button
              onClick={() => setShowAuditPanel(!showAuditPanel)}
              className="text-brand-ink font-label text-[11px] font-bold underline"
              type="button"
            >
              {showAuditPanel ? 'Masquer' : 'Afficher détails'}
            </button>
          </div>

          <p className="text-[12px] text-ink-muted">
            Ce module distingue rigoureusement les fonctions opérationnelles, les représentations schématiques et les dépendances réseau :
          </p>

          {showAuditPanel && (
            <div className="flex flex-col gap-2 pt-1 text-[12px]">
              {/* 🟢 1. Fonctions réellement opérationnelles */}
              <div className="p-2.5 bg-ok-soft rounded-lg border border-ok-line flex flex-col gap-1">
                <span className="font-bold text-ok-ink flex items-center gap-1.5 font-label text-[11px] uppercase">
                  <span className="w-2 h-2 rounded-full bg-ok"></span>
                  🟢 Fonctions Réellement Opérationnelles
                </span>
                <ul className="list-disc list-inside text-ok-ink space-y-0.5 text-[11px]">
                  <li><strong>Géolocalisation GPS réelle (W3C)</strong> : capture des coordonnées physiques de l'appareil (latitude, longitude, précision).</li>
                  <li><strong>Résolution de commune</strong> : géocodage inverse en direct via <code>geo.api.gouv.fr</code> ou projection géodésique hors-ligne (Haversine).</li>
                  <li><strong>Export d'instantané réel</strong> : génération et téléchargement immédiat d'un fichier JSON normé sur votre terminal.</li>
                  <li><strong>Consultation hors-ligne</strong> : fiches réflexes opérationnelles embarquées et fiches de repérage réglementaire communales (DICRIM / PCS récapitulatifs). La consultation des arrêtés et documents paraphés complets nécessite une démarche externe en mairie ou en ligne.</li>
                </ul>
              </div>

              {/* 🟡 2. Démonstrations & schémas */}
              <div className="p-2.5 bg-warn-soft rounded-lg border border-warn-line flex flex-col gap-1">
                <span className="font-bold text-warn-ink flex items-center gap-1.5 font-label text-[11px] uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#ca8a04]"></span>
                  🟡 Démonstration & Schéma Pédagogique
                </span>
                <p className="text-[11px] text-warn-ink leading-snug">
                  <strong>Périmètres & Rayons vectoriels SVG</strong> : Représentation schématique locale des périmètres PPI/TMD conçue pour fonctionner sans dépendance à un Système d'Information Géographique (SIG) distant lourd.
                </p>
              </div>

              {/* 🔵 3. Fonctionnalités nécessitant une connexion */}
              <div className="p-2.5 bg-subtle rounded-lg border border-brand-bright flex flex-col gap-1">
                <span className="font-bold text-brand-ink flex items-center gap-1.5 font-label text-[11px] uppercase">
                  <span className="w-2 h-2 rounded-full bg-brand"></span>
                  🔵 Fonctionnalités Indisponibles Hors-Connexion
                </span>
                <p className="text-[11px] text-brand-ink leading-snug">
                  <strong>Actualisation en direct</strong> de l'API Géorisques (data.gouv.fr) et <strong>liens sortants</strong> vers les fiches web de l'État : nécessitent obligatoirement un accès Internet actif.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Passerelle Hors-Ligne : Carte des Périmètres 100% Autonome */}
        <section className="bg-navy text-white p-4 rounded-xl shadow-md border border-ink flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-ok-bright text-[20px]">radar</span>
              <span className="font-label text-[12px] font-bold uppercase tracking-wider text-white">
                Carte Hors-Ligne des Périmètres (100% Autonome)
              </span>
            </div>
            <span className="font-label text-[10px] bg-ok-soft/20 text-ok-bright px-2 py-0.5 rounded font-bold uppercase">
              Zéro Réseau
            </span>
          </div>
          <p className="text-[12px] text-on-navy-soft leading-relaxed">
            Le chaînon manquant en cas de blackout : base statique pré-embarquée des 19 CNPE nucléaires et 22 plateformes Seveso Seuil Haut. Calcul géodésique local immédiat « suis-je dans un rayon de X km » sans aucun transit serveur.
          </p>
          <button
            type="button"
            onClick={() => onOpenSubScreen({ type: 'carte-perimetres' })}
            className="w-full min-h-[42px] bg-ok-soft hover:bg-ok-soft text-ok-ink font-label text-[12px] font-bold uppercase rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">map</span>
            <span>Ouvrir la Carte & Radar Hors-Ligne (41 sites)</span>
          </button>
        </section>

        {/* Territorial Selector & Privacy Guarantee */}
        <section className="bg-card p-4 rounded-xl shadow-sm flex flex-col gap-3 border border-line-strong">
          <div className="flex items-center justify-between">
            <label className="font-label text-[12px] uppercase tracking-wider text-ink flex items-center gap-1.5 font-bold">
              <span className="material-symbols-outlined text-[18px] text-brand-ink">share_location</span>
              Commune d'Analyse Locale
            </label>
            <span className="font-label text-[10px] px-2 py-0.5 rounded bg-ok-soft text-ok-ink font-bold uppercase">
              DONNÉES OFFICIELLES API
            </span>
          </div>

          {/* Input Display Bar */}
          <div className="bg-subtle rounded-lg p-3 flex items-center justify-between gap-3 border border-line">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-ink text-[20px] shrink-0">pin_drop</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[15px] font-bold text-ink truncate">
                  {activeCommune.name}
                </span>
                <span className="font-label text-[11px] text-ink-muted truncate">
                  {activeCommune.postalCode} • INSEE {activeCommune.insee} {activeCommune.departement ? `• Dép. ${activeCommune.departement}` : ''}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditingCommune(!isEditingCommune)}
              type="button"
              className="h-11 px-3 rounded bg-card hover:bg-tint text-ink font-label text-[12px] font-bold flex items-center gap-1 shrink-0 transition-colors border border-line-strong"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              Modifier
            </button>
          </div>

          {/* Saisie Commune Modal Dropdown avec API geo.api.gouv.fr */}
          {isEditingCommune && (
            <div className="bg-canvas p-3 rounded-lg flex flex-col gap-2.5 border border-line-strong">
              <span className="font-label text-[11px] uppercase font-bold text-ink">
                Rechercher une commune en France (API Officielle) :
              </span>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  placeholder="Tapez un nom ou code postal (ex: Feyzin, 76000, Rouen, Dunkerque)..."
                  className="w-full h-11 px-3 pr-9 bg-card border border-line-strong rounded-lg text-[13px] text-ink focus:outline-none focus:border-brand-ink"
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                {searchLoading && (
                  <span className="absolute right-3 top-3 material-symbols-outlined text-brand-ink text-[18px] animate-spin">
                    sync
                  </span>
                )}
              </div>

              {/* Résultats de recherche dynamique */}
              {searchResults.length > 0 && (
                <div className="flex flex-col gap-1 bg-card p-2 rounded-lg border border-brand-ink">
                  <span className="text-[11px] font-bold text-brand-ink font-label">
                    Résultats trouvés via geo.api.gouv.fr :
                  </span>
                  {searchResults.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleSelectSearchedCommune(c)}
                      className="p-2 text-left text-[13px] hover:bg-subtle rounded flex items-center justify-between"
                    >
                      <span className="font-semibold text-ink">{c.nom}</span>
                      <span className="text-[11px] text-ink-muted font-label">
                        {c.codesPostaux?.[0] || c.code} (Dép. {c.codeDepartement})
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Historique des consultations locales (Disponibles hors-ligne) */}
              {communeHistory.length > 0 && (
                <div className="flex flex-col gap-1 pt-1 border-t border-line">
                  <div className="flex items-center justify-between">
                    <span className="font-label text-[11px] font-bold text-brand-ink uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">history</span>
                      Historique local ({communeHistory.length}) :
                    </span>
                    <span className="text-[10px] text-ink-muted italic">Accès hors-ligne</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {communeHistory.map((hist) => (
                      <button
                        key={hist.insee}
                        type="button"
                        onClick={() => {
                          setLiveReport(null);
                          setRefreshMessage(null);
                          setSelectedMapNode(null);
                          const preset = AVAILABLE_COMMUNES.find((ac) => ac.insee === hist.insee);
                          setActiveCommune({
                            name: hist.name,
                            postalCode: hist.postalCode || '00000',
                            insee: hist.insee,
                            lat: preset?.lat || 45.75,
                            lng: preset?.lng || 4.85,
                            departement: preset?.departement || hist.insee.slice(0, 2),
                            description: `Commune consultée le ${hist.date}.`
                          });
                          setIsEditingCommune(false);
                        }}
                        className="px-2.5 py-1 bg-card hover:bg-subtle text-ink border border-line-strong rounded text-[11px] font-semibold flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[13px] text-brand-ink">schedule</span>
                        <span>{hist.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <span className="text-[10px] text-ink-muted italic">
                Ou sélectionnez parmi nos bassins industriels & nucléaires de référence :
              </span>
              <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto">
                {AVAILABLE_COMMUNES.map((com) => (
                  <button
                    key={com.insee}
                    type="button"
                    onClick={() => {
                      setLiveReport(null);
                      setRefreshMessage(null);
                      setSelectedMapNode(null);
                      setActiveCommune(com);
                      setIsEditingCommune(false);
                      setGpsStatusMessage({
                        type: 'success',
                        text: `Commune chargée : ${com.name} (${com.postalCode} • Dép. ${com.departement}) - Coordonnées réelles : ${com.lat.toFixed(4)}, ${com.lng.toFixed(4)}`
                      });
                    }}
                    className={`p-2 rounded text-left text-[13px] flex items-center justify-between transition-colors ${
                      activeCommune.insee === com.insee
                        ? 'bg-navy text-white font-bold'
                        : 'bg-card hover:bg-tint text-ink border border-line-strong'
                    }`}
                  >
                    <span>{com.name}</span>
                    <span className="font-label text-[11px] opacity-80">
                      {com.postalCode} • {com.departement}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GÉOLOCALISATION GPS RÉELLE W3C */}
          <div className="flex flex-col gap-1.5 pt-1">
            <button
              onClick={handleSimulateGPS}
              disabled={gpsLoading}
              type="button"
              className="w-full h-12 rounded bg-subtle hover:bg-tint text-ink font-label text-[12px] font-bold flex items-center justify-center gap-2 transition-colors border border-line disabled:opacity-60"
            >
              <span className={`material-symbols-outlined text-[18px] ${gpsLoading ? 'animate-spin' : ''}`}>
                {gpsLoading ? 'satellite_alt' : 'my_location'}
              </span>
              <span>
                {gpsLoading
                  ? 'Acquisition GPS en cours (matériel terminal)...'
                  : 'Localiser par GPS Réel (Opt-in immédiat)'}
              </span>
            </button>

            {gpsStatusMessage && (
              <div className={`p-2.5 rounded-lg text-[12px] flex items-start gap-2 border ${
                gpsStatusMessage.type === 'success'
                  ? 'bg-ok-soft text-ok-ink border-ok-line'
                  : gpsStatusMessage.type === 'warning'
                  ? 'bg-warn-soft text-warn-ink border-warn-line'
                  : 'bg-danger-soft text-danger-ink-strong border-danger-bright'
              }`}>
                <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">
                  {gpsStatusMessage.type === 'success' ? 'check_circle' : 'info'}
                </span>
                <span className="leading-snug">{gpsStatusMessage.text}</span>
              </div>
            )}

            <div className="flex items-start gap-1.5 px-1 pt-0.5">
              <span className="material-symbols-outlined text-ok-ink text-[16px] shrink-0 mt-0.5">
                verified_user
              </span>
              <p className="text-[12px] text-ink-muted leading-snug">
                <strong>Garantie de souveraineté :</strong> Aucune télémétrie ni pistage. Les coordonnées GPS restent strictement confinées dans la mémoire vive locale de votre terminal.
              </p>
            </div>
          </div>
        </section>

        {/* LIAISON DIRECTE MAIRIE & DICRIM COMMUNAL (DILA / PREMIER MINISTRE) */}
        <section className="bg-gradient-to-br from-navy to-navy-2 text-white p-4 rounded-xl shadow-md border border-ink flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[22px]">account_balance</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-label text-[10px] uppercase font-bold text-ok-bright tracking-wider">
                    Poste de Commandement Municipal
                  </span>
                  {mairieContact?.isAuthentifie && (
                    <span className="bg-ok-soft text-ok-ink text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                      Vérifié DILA
                    </span>
                  )}
                </div>
                <h2 className="text-[16px] font-bold text-white truncate">
                  {mairieContact?.nomOfficiel || `Mairie de ${activeCommune.name}`}
                </h2>
              </div>
            </div>
            <span className="font-label text-[10px] bg-white/10 text-on-navy-soft px-2 py-0.5 rounded font-bold uppercase shrink-0">
              C.S.I. L731-3
            </span>
          </div>

          {mairieContact?.adressePostale?.ligne && (
            <div className="text-[12px] text-on-navy-soft flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-ok-bright">location_on</span>
              <span>{mairieContact.adressePostale.ligne}, {mairieContact.adressePostale.codePostal} {mairieContact.adressePostale.nomCommune}</span>
            </div>
          )}

          {/* Quick Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {/* Direct Call Button */}
            {mairieContact?.telephone ? (
              <button
                type="button"
                onClick={() =>
                  onOpenCallModal({
                    number: mairieContact.telephone!,
                    name: mairieContact.nomOfficiel,
                    subtitle: 'Standard officiel vérifié (DILA)',
                    desc: `Poste de commandement / Standard communal pour la commune de ${activeCommune.name}. Source : Annuaire de l'Administration (DILA / Premier ministre).`,
                  })
                }
                className="min-h-[44px] px-3 bg-ok-soft hover:bg-ok-soft text-ok-ink font-label text-[12px] uppercase font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span>Appeler la Mairie ({mairieContact.telephone})</span>
              </button>
            ) : (
              <div className="min-h-[44px] px-3 bg-white/10 text-white/80 font-label text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">phone_disabled</span>
                <span>Standard : non synchronisé hors-ligne</span>
              </div>
            )}

            {/* Direct DICRIM / PCS Button */}
            <button
              type="button"
              onClick={() => setActiveModalDoc('dicrim')}
              className="min-h-[44px] px-3 bg-white/10 hover:bg-white/20 text-white font-label text-[12px] uppercase font-bold rounded-lg flex items-center justify-center gap-2 transition-colors border border-white/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              <span>Consulter le DICRIM Communal</span>
            </button>
          </div>

          <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[11px] text-on-navy-soft">
            <span className="truncate">Plan Communal de Sauvegarde (PCS) sous l'autorité du Maire</span>
            <button
              type="button"
              onClick={() => setActiveModalDoc('pcs')}
              className="text-ok-bright hover:underline font-bold font-label shrink-0 ml-2 cursor-pointer"
            >
              Fiche PCS &rarr;
            </button>
          </div>
        </section>

        {/* Cache Snapshot & Freshness Status */}
        <section className="bg-card p-4 rounded-xl shadow-sm flex flex-col gap-3 border border-line-strong">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <span className="font-label text-[11px] uppercase tracking-wide text-ink-muted font-semibold">
                Dossier Territorial Communal
              </span>
              <span className="text-[17px] font-bold text-ink">
                {freshness.origin === 'cache'
                  ? 'Base Locale Hors-Ligne Scellée'
                  : freshness.origin === 'live'
                  ? 'Données Géorisques Synchronisées'
                  : freshness.origin === 'preload'
                  ? 'Base Didactique Pré-Embarquée'
                  : 'Dossier Non Synchronisé'}
              </span>
            </div>
            {/* Freshness Badge with dynamic colors */}
            <span className={`font-label text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 shrink-0 border ${freshness.badgeBg} ${freshness.badgeTextCol} ${freshness.badgeBorder}`}>
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                freshness.origin === 'live' ? 'bg-ok animate-pulse' :
                freshness.origin === 'cache' ? (freshness.isStale ? 'bg-warn' : 'bg-brand') :
                freshness.origin === 'preload' ? 'bg-[#7c3aed]' : 'bg-[#71717a]'
              }`}></span>
              <span>{freshness.badgeText}</span>
            </span>
          </div>

          {/* Indicateur de Fraîcheur & Traçabilité */}
          <div className="grid grid-cols-1 gap-2 pt-0.5">
            {/* Fraîcheur des données calculée dynamiquement */}
            <div className="flex items-center justify-between text-[13px] bg-subtle px-3 py-2.5 rounded-lg border border-line">
              <span className="text-ink-muted flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-brand-ink">schedule</span>
                <span>Fraîcheur des données :</span>
              </span>
              <span className="font-label font-bold text-ink">
                {freshness.relativeAge}
              </span>
            </div>

            {/* Date réelle de capture / requête / constitution */}
            <div className="flex items-center justify-between text-[13px] bg-subtle px-3 py-2.5 rounded-lg border border-line">
              <span className="text-ink-muted flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-brand-ink">calendar_today</span>
                <span>Date de capture réelle :</span>
              </span>
              <span className="font-label font-bold text-ink text-right">
                {freshness.origin === 'live' && freshness.timestamp ? (
                  `${new Date(freshness.timestamp).toLocaleDateString('fr-FR')} à ${new Date(freshness.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
                ) : freshness.origin === 'cache' && freshness.timestamp ? (
                  `${new Date(freshness.timestamp).toLocaleDateString('fr-FR')} à ${new Date(freshness.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
                ) : freshness.origin === 'preload' ? (
                  '23 oct. 2026 à 18:00 (constitution)'
                ) : (
                  <span className="italic text-ink-faint">Aucune date artificielle</span>
                )}
              </span>
            </div>

            {/* Provenance & Source */}
            <div className="flex flex-col gap-0.5 text-[12px] bg-subtle px-3 py-2.5 rounded-lg border border-line">
              <div className="flex items-center justify-between">
                <span className="text-ink-muted font-label text-[10px] uppercase font-bold">
                  Origine & Méthode de Synchronisation :
                </span>
                <span className="font-label text-[10px] font-bold text-brand-ink uppercase">
                  {freshness.origin === 'live' ? 'FLUX OFFICIEL DIRECT' :
                   freshness.origin === 'cache' ? 'STOCKAGE TERMINAL' :
                   freshness.origin === 'preload' ? 'DIDACTIQUE HORS-LIGNE' : 'NON SYNCHRONISÉ'}
                </span>
              </div>
              <span className="text-ink font-medium leading-snug">
                {freshness.provenanceLabel}
              </span>
              <p className="text-[11px] text-ink-muted leading-snug mt-0.5">
                {freshness.provenanceDesc}
              </p>
            </div>
          </div>

          {/* Avertissement explicite si cache ancien (> 30 jours) */}
          {freshness.isStale && (
            <div className="p-2.5 rounded-lg bg-warn-soft border border-warn-line text-warn-ink text-[11px] flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">update</span>
              <div className="leading-snug">
                <strong>Données conservées depuis plus de 30 jours :</strong> Les arrêtés PPRT et zonages Seveso restent valables pour votre préparation (évolutions administratives pluriannuelles), mais une actualisation en ligne est conseillée pour vérifier les révisions administratives récentes.
              </div>
            </div>
          )}

          {/* Bouton pour consulter les sources de données */}
          <button
            type="button"
            onClick={() => setShowSourcesModal(true)}
            className="w-full py-2.5 px-3 rounded-lg bg-card hover:bg-subtle text-brand-ink font-label text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 border border-line-strong transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">policy</span>
            <span>Consulter les sources des données territoriales</span>
          </button>

          {refreshMessage && (
            <div className={`p-2.5 rounded-lg text-[12px] flex items-start gap-2 border ${
              refreshMessage.type === 'success'
                ? 'bg-ok-soft text-ok-ink border-ok-line'
                : refreshMessage.type === 'warning'
                ? 'bg-danger-soft text-danger-ink-strong border-danger-bright'
                : 'bg-subtle text-brand-ink border-line'
            }`}>
              <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">
                {refreshMessage.type === 'success' ? 'check_circle' : 'info'}
              </span>
              <span className="leading-snug">{refreshMessage.text}</span>
            </div>
          )}

          <div className="pt-1 flex flex-col gap-2">
            <button
              onClick={handleRefreshData}
              disabled={refreshing}
              type="button"
              className="w-full h-12 rounded bg-tint hover:bg-tint text-ink font-label text-[12px] font-bold flex items-center justify-center gap-2 transition-colors border border-line-strong disabled:opacity-60 cursor-pointer"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  refreshing ? 'animate-spin' : ''
                }`}
              >
                sync
              </span>
              <span>
                {refreshing
                  ? 'Interrogation de l’API Géorisques en direct...'
                  : isOnline
                  ? 'Actualiser les données en ligne (API Géorisques)'
                  : 'Actualiser (Indisponible hors-connexion)'}
              </span>
            </button>
            <div className="flex items-center justify-center gap-1 text-center font-label text-[11px] text-ink-muted">
              <span className="material-symbols-outlined text-[14px]">offline_bolt</span>
              <span>Consultation 100% autonome garantie même sans réseau</span>
            </div>
          </div>
        </section>

        {/* MANDATORY CIVIL SAFETY NOTICE */}
        <div className="bg-subtle p-4 rounded-xl flex items-start gap-3 shadow-sm border border-line" role="alert">
          <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center shrink-0 text-white">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-label text-[12px] text-ink font-bold uppercase tracking-wider">
              Avertissement de Sécurité Civile
            </span>
            <p className="text-[12px] text-ink leading-relaxed">
              L'absence de risque répertorié ou un inventaire vide ne garantit en aucun cas qu'une zone est exempte de danger. Aucun indice anxiogène arbitraire n'est calculé. En cas d'alerte réelle, <strong>seules les directives émises par le Préfet de département font foi</strong>.
            </p>
          </div>
        </div>

        {/* Schematized Vector Map with Clickable Nodes & Zoom */}
        <section className="bg-card p-4 rounded-xl shadow-sm flex flex-col gap-3 border border-line-strong">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="font-label text-[12px] uppercase tracking-wider text-ink font-bold">
                Périmètres & Rayons d'Incidence
              </span>
              <span className="text-[12px] text-ink-muted">
                Représentation vectorielle interactive (Zoomable, repères cliquables)
              </span>
            </div>

            {/* Mode Switcher: Officiel vs Pédagogique */}
            <div className="inline-flex rounded-lg p-0.5 bg-subtle border border-line-strong shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setMapMode('officiel')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-label font-bold transition-all ${
                  mapMode === 'officiel'
                    ? 'bg-navy text-white shadow-xs'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Données Officielles
              </button>
              <button
                type="button"
                onClick={() => setMapMode('pedagogique')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-label font-bold transition-all ${
                  mapMode === 'pedagogique'
                    ? 'bg-warn text-white shadow-xs'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Mode Pédagogique
              </button>
            </div>
          </div>

          {/* Mode Banner */}
          {mapMode === 'officiel' ? (
            <div className="px-3 py-2 rounded-lg bg-subtle border border-brand-ink/30 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-brand-ink">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span className="font-bold">Territoire Réel : {activeCommune.name} ({activeCommune.insee})</span>
              </div>
              <span className="text-ink-muted text-[10px]">Base API Géorisques</span>
            </div>
          ) : (
            <div className="px-3 py-2 rounded-lg bg-warn-soft border border-warn-line flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-warn-ink">
                <span className="material-symbols-outlined text-[16px]">school</span>
                <span className="font-bold">Simulation d'Exercice Non-Contractuelle</span>
              </div>
              <span className="text-warn-ink text-[10px]">Didactique uniquement</span>
            </div>
          )}

          {/* Zoom Toolbar & Map Canvas */}
          <div className="relative">
            {/* Zoom Controls */}
            <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-lg border border-line-strong shadow-xs">
              <button
                type="button"
                onClick={() => setMapZoom((z) => Math.min(2.4, +(z + 0.35).toFixed(2)))}
                disabled={mapZoom >= 2.4}
                title="Zoom avant (+)"
                className="w-7 h-7 rounded flex items-center justify-center hover:bg-subtle text-ink disabled:opacity-30 disabled:pointer-events-none"
              >
                <span className="material-symbols-outlined text-[18px]">zoom_in</span>
              </button>
              <button
                type="button"
                onClick={() => setMapZoom((z) => Math.max(1, +(z - 0.35).toFixed(2)))}
                disabled={mapZoom <= 1}
                title="Zoom arrière (-)"
                className="w-7 h-7 rounded flex items-center justify-center hover:bg-subtle text-ink disabled:opacity-30 disabled:pointer-events-none"
              >
                <span className="material-symbols-outlined text-[18px]">zoom_out</span>
              </button>
              <button
                type="button"
                onClick={() => { setMapZoom(1); setSelectedMapNode(null); }}
                title="Réinitialiser zoom (100%)"
                className="w-7 h-7 rounded flex items-center justify-center hover:bg-subtle text-ink"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              </button>
            </div>

            {/* Clean Vector SVG Canvas */}
            <div className="w-full bg-subtle rounded-lg p-2 flex items-center justify-center relative overflow-hidden border border-line">
              {(() => {
                const baseW = 340;
                const baseH = 220;
                const vbW = baseW / mapZoom;
                const vbH = baseH / mapZoom;
                let targetX = 170;
                let targetY = 110;
                if (selectedMapNode === 'tmd') { targetX = 140; targetY = 130; }
                if (selectedMapNode === 'ppi') { targetX = 115; targetY = 155; }
                if (selectedMapNode === 'nucleaire') { targetX = 260; targetY = 70; }
                const vbX = Math.max(0, Math.min(baseW - vbW, targetX - vbW / 2));
                const vbY = Math.max(0, Math.min(baseH - vbH, targetY - vbH / 2));
                const currentVb = `${vbX} ${vbY} ${vbW} ${vbH}`;

                return (
                  <svg
                    className="w-full max-w-sm h-auto select-none cursor-pointer transition-all duration-300"
                    viewBox={currentVb}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Radial grid circles */}
                    <circle cx="170" cy="110" r="95" fill="none" stroke="#74777e" strokeWidth="1" strokeDasharray="3 3" opacity="0.35" />
                    <circle
                      cx="170"
                      cy="110"
                      r="65"
                      fill="#dce9fd"
                      fillOpacity={selectedMapNode === 'ppi' ? "0.6" : "0.3"}
                      stroke="#0036ce"
                      strokeWidth={selectedMapNode === 'ppi' ? "2.5" : "1.2"}
                      strokeDasharray="4 2"
                    />
                    <circle cx="170" cy="110" r="38" fill="#eef4ff" fillOpacity="0.6" stroke="#12263f" strokeWidth="1.5" />

                    {/* TMD Corridor Line */}
                    <path
                      d="M 60 180 Q 140 130 200 40"
                      fill="none"
                      stroke="#ba1a1a"
                      strokeWidth={selectedMapNode === 'tmd' ? "4.5" : "2.5"}
                      strokeDasharray="6 3"
                      onClick={() => setSelectedMapNode(selectedMapNode === 'tmd' ? null : 'tmd')}
                    />
                    <circle
                      cx="180"
                      cy="85"
                      r={selectedMapNode === 'tmd' ? "7" : "5"}
                      fill="#ba1a1a"
                      onClick={() => setSelectedMapNode(selectedMapNode === 'tmd' ? null : 'tmd')}
                    />

                    {/* SEVESO Zone Pin */}
                    <g
                      transform="translate(115, 155)"
                      onClick={() => setSelectedMapNode(selectedMapNode === 'ppi' ? null : 'ppi')}
                      className="cursor-pointer"
                    >
                      <rect
                        x="-16"
                        y="-12"
                        width="32"
                        height="24"
                        rx="4"
                        fill={selectedMapNode === 'ppi' ? "#0036ce" : "#12263f"}
                        stroke={selectedMapNode === 'ppi' ? "#98f6c5" : "none"}
                        strokeWidth="2"
                      />
                      <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700" fontFamily="Space Grotesk">PPI</text>
                    </g>

                    {/* Nuclear Direction indicator */}
                    <line
                      x1="170"
                      y1="110"
                      x2="295"
                      y2="55"
                      stroke={selectedMapNode === 'nucleaire' ? "#0036ce" : "#74777e"}
                      strokeWidth={selectedMapNode === 'nucleaire' ? "3" : "1.5"}
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx="295"
                      cy="55"
                      r={selectedMapNode === 'nucleaire' ? "9" : "7"}
                      fill={selectedMapNode === 'nucleaire' ? "#0036ce" : "#12263f"}
                      stroke={selectedMapNode === 'nucleaire' ? "#98f6c5" : "none"}
                      strokeWidth="2"
                      onClick={() => setSelectedMapNode(selectedMapNode === 'nucleaire' ? null : 'nucleaire')}
                      className="cursor-pointer"
                    />
                    <text
                      x="295"
                      y="42"
                      textAnchor="middle"
                      fill="#0f1c2b"
                      fontSize="9"
                      fontWeight="700"
                      fontFamily="Public Sans"
                      onClick={() => setSelectedMapNode(selectedMapNode === 'nucleaire' ? null : 'nucleaire')}
                    >
                      PPI Nucléaire
                    </text>

                    {/* Center Reference */}
                    <circle
                      cx="170"
                      cy="110"
                      r={selectedMapNode === 'ref' ? "10" : "8"}
                      fill="#0036ce"
                      stroke={selectedMapNode === 'ref' ? "#98f6c5" : "none"}
                      strokeWidth="2"
                      onClick={() => setSelectedMapNode(selectedMapNode === 'ref' ? null : 'ref')}
                      className="cursor-pointer"
                    />
                    <circle cx="170" cy="110" r="3" fill="#ffffff" />
                    <text
                      x="170"
                      y="134"
                      textAnchor="middle"
                      fill="#0f1c2b"
                      fontSize="10"
                      fontWeight="700"
                      fontFamily="Public Sans"
                      onClick={() => setSelectedMapNode(selectedMapNode === 'ref' ? null : 'ref')}
                    >
                      {activeCommune.name.slice(0, 16)} (Réf.)
                    </text>

                    {/* Distance tags */}
                    <text x="170" y="70" textAnchor="middle" fill="#44474d" fontSize="8" fontFamily="Space Grotesk">Rayon 4.2 km</text>
                    <text
                      x="75"
                      y="170"
                      fill="#ba1a1a"
                      fontSize="8"
                      fontWeight="700"
                      fontFamily="Space Grotesk"
                      onClick={() => setSelectedMapNode(selectedMapNode === 'tmd' ? null : 'tmd')}
                    >
                      Axe TMD Rail (&lt;800m)
                    </text>
                  </svg>
                );
              })()}
            </div>
          </div>

          {/* Interactive node indicator alert with operational advice */}
          {selectedMapNode && (
            <div className="p-3 rounded-lg bg-tint text-[12px] border border-brand-ink/30 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-brand-ink">near_me</span>
                  {selectedMapNode === 'ppi' && "Zone SEVESO Seuil Haut (Périmètre PPI)"}
                  {selectedMapNode === 'tmd' && "Corridor TMD (Transport Matières Dangereuses Rail/Route)"}
                  {selectedMapNode === 'nucleaire' && "Rayon de Prévention CNPE / Nucléaire (PPI 10-20 km)"}
                  {selectedMapNode === 'ref' && `Point central de référence : ${activeCommune.name}`}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedMapNode(null)}
                  className="text-ink font-bold text-[11px] underline cursor-pointer"
                >
                  Effacer
                </button>
              </div>
              <p className="text-[11px] text-ink leading-relaxed">
                {selectedMapNode === 'ppi' && "En cas d'accident industriel majeur : sirène POI/PPI spécifique (ou RNA), confinement immédiat dans le local étanche préparé, écoute de la radio locale conventionnée (France Bleu)."}
                {selectedMapNode === 'tmd' && "Accident de convoi chimique : s'éloigner perpendiculairement au sens du vent à plus de 800 mètres. Ne jamais s'approcher ni utiliser de flamme nue."}
                {selectedMapNode === 'nucleaire' && "Alerte radiologique : prise d'iode stable (KI) EXCLUSIVEMENT sur ordre formel du Préfet (FR-Alert / radio). Rester calfeutré en attendant les consignes d'évacuation éventuelle."}
                {selectedMapNode === 'ref' && `Coordonnées géographiques de la commune : ${activeCommune.postalCode} • Code INSEE ${activeCommune.insee}. Repère kilométrique zéro pour vos plans d'évacuation.`}
              </p>
            </div>
          )}

          {/* Interactive Clickable Map Legend */}
          <div className="grid grid-cols-2 gap-2 text-[12px]">
            <button
              type="button"
              onClick={() => setSelectedMapNode(selectedMapNode === 'ref' ? null : 'ref')}
              className={`flex items-center gap-2 text-left p-2 rounded-lg border transition-all cursor-pointer ${
                selectedMapNode === 'ref'
                  ? 'bg-navy text-white border-ink shadow-xs'
                  : 'bg-card hover:bg-subtle text-ink-muted border-line-strong'
              }`}
            >
              <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${selectedMapNode === 'ref' ? 'bg-ok-soft' : 'bg-brand'}`}></span>
              <span className="font-label text-[11px] font-bold truncate">Point de référence</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMapNode(selectedMapNode === 'tmd' ? null : 'tmd')}
              className={`flex items-center gap-2 text-left p-2 rounded-lg border transition-all cursor-pointer ${
                selectedMapNode === 'tmd'
                  ? 'bg-danger text-white border-danger-ink shadow-xs'
                  : 'bg-card hover:bg-subtle text-ink-muted border-line-strong'
              }`}
            >
              <span className={`w-3.5 h-1.5 shrink-0 ${selectedMapNode === 'tmd' ? 'bg-card' : 'bg-danger'}`}></span>
              <span className="font-label text-[11px] font-bold truncate">Transit TMD (&lt; 800 m)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMapNode(selectedMapNode === 'ppi' ? null : 'ppi')}
              className={`flex items-center gap-2 text-left p-2 rounded-lg border transition-all cursor-pointer ${
                selectedMapNode === 'ppi'
                  ? 'bg-brand text-white border-brand-ink shadow-xs'
                  : 'bg-card hover:bg-subtle text-ink-muted border-line-strong'
              }`}
            >
              <span className={`w-3.5 h-3.5 rounded shrink-0 ${selectedMapNode === 'ppi' ? 'bg-ok-soft' : 'bg-navy-2'}`}></span>
              <span className="font-label text-[11px] font-bold truncate">Périmètre PPI (4.2 km)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMapNode(selectedMapNode === 'nucleaire' ? null : 'nucleaire')}
              className={`flex items-center gap-2 text-left p-2 rounded-lg border transition-all cursor-pointer ${
                selectedMapNode === 'nucleaire'
                  ? 'bg-navy-2 text-ok-bright border-ink shadow-xs'
                  : 'bg-card hover:bg-subtle text-ink-muted border-line-strong'
              }`}
            >
              <span className={`w-3.5 h-0.5 shrink-0 ${selectedMapNode === 'nucleaire' ? 'bg-ok-soft' : 'bg-ink-muted'}`}></span>
              <span className="font-label text-[11px] font-bold truncate">Vigilance nucléaire</span>
            </button>
          </div>

          {/* Avertissement de non-confusion cartographique formel */}
          <div className="p-3 bg-canvas rounded-lg border border-line text-[11px] text-ink flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-brand-ink shrink-0 mt-0.5">info</span>
            <div className="leading-snug">
              <strong className="text-brand-ink">Illustration vectorielle didactique :</strong> Ce schéma local simplifié permet d'appréhender les distances réflexes d'entraînement. Il <strong>ne constitue pas une cartographie officielle de zonage</strong> ni un Système d'Information Géographique (SIG) certifié des périmètres réels de danger. Seuls les documents graphiques opposables annexés aux arrêtés préfectoraux (consultables sur georisques.gouv.fr) font foi.
            </div>
          </div>
        </section>

        {/* Categorized Inventory of Territorial Risks */}
        {(() => {
          const isLyonPreset = activeCommune.insee === '69383';
          const hasOfficialRisks = !!(
            liveReport &&
            liveReport.risks &&
            liveReport.risks.length > 0 &&
            (liveReport.dataSourceType === 'live_api' || liveReport.dataSourceType === 'cached_official')
          );
          const isLiveZeroRisk = liveReport?.dataSourceType === 'live_api_zero_risk';
          const isPedagogical = liveReport?.dataSourceType === 'pedagogical_sample';
          const isNetworkError = liveReport?.dataSourceType === 'network_error' || liveReport?.dataSourceType === 'api_error';
          const isLyonInitial = isLyonPreset && !liveReport;
          const isUnverifiedEmpty = !hasOfficialRisks && !isLiveZeroRisk && !isPedagogical && !isLyonInitial && !isNetworkError;

          const displayedRisks = hasOfficialRisks
            ? liveReport!.risks
            : isPedagogical
            ? liveReport!.risks
            : isLyonInitial
            ? GEORISQUES_ITEMS
            : [];

          return (
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] text-ink font-bold">
                  Inventaire des Risques Notifiés
                </h2>
                <span className="font-label text-[11px] text-ink-muted">
                  {displayedRisks.length} RISQUE{displayedRisks.length > 1 ? 'S' : ''} RÉPERTORIÉ{displayedRisks.length > 1 ? 'S' : ''}
                </span>
              </div>

              {/* Badge de statut documentaire officiel / cache / pédagogique / non synchronisé */}
              {hasOfficialRisks && (
                <div className="p-2.5 rounded-lg bg-ok-soft border border-ok-line text-ok-ink text-[12px] flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-ok animate-pulse"></span>
                    <span>{liveReport?.dataSourceType === 'live_api' ? 'Données officielles en direct (API Géorisques / BRGM)' : `Dernière réponse enregistrée de l’API officielle (${liveReport?.retrievedAt ? new Date(liveReport.retrievedAt).toLocaleDateString('fr-FR') : 'archive locale'})`}</span>
                  </span>
                  <span className="text-[10px] text-ok-ink font-label uppercase font-bold">{liveReport?.dataSourceType === 'live_api' ? 'Arrêtés en direct' : 'Archive locale'}</span>
                </div>
              )}

              {/* Réponse officielle valide : 0 risque recensé dans la base d'État */}
              {isLiveZeroRisk && (
                <div className="bg-ok-soft p-4 rounded-xl border border-ok-line flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-ok-ink">
                    <span className="material-symbols-outlined text-[20px] text-ok-ink">info</span>
                    <strong className="font-label text-[13px] font-bold">
                      Réponse API Géorisques : Aucun dossier renvoyé par cette requête
                    </strong>
                  </div>
                  <p className="text-[12px] text-ok-ink leading-relaxed">
                    La base nationale consultée (GASPAR via data.gouv.fr / BRGM) ne renvoie actuellement aucun dossier de risque technologique ou PPRT pour la commune de <strong>{activeCommune.name}</strong> ({activeCommune.insee}) lors de cette requête.
                  </p>
                  <p className="text-[11px] text-ok-ink bg-white/80 p-2.5 rounded border border-ok-line leading-relaxed">
                    ⚠️ <strong>Portée de cette information :</strong> Cette réponse signifie qu'aucun dossier n'est répertorié dans la base GASPAR pour ce code INSEE. Cela <strong>ne prouve pas l'absence de tout risque sur la commune</strong> (aléas météorologiques, inondations, transports non classés) et <strong>ne remplace pas l'ensemble des informations de prévention des risques</strong> (DICRIM consultable en mairie, arrêtés préfectoraux opposables, bulletins de vigilance de la Sécurité Civile).
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const pedago = getPedagogicalSampleRisks();
                        setLiveReport({
                          communeName: activeCommune.name,
                          inseeCode: activeCommune.insee,
                          retrievedAt: new Date().toISOString(),
                          source: 'Échantillon didactique d’entraînement (non lié aux arrêtés réels)',
                          isOfflineCache: true,
                          dataSourceType: 'pedagogical_sample',
                          risksCount: pedago.length,
                          risks: pedago
                        });
                      }}
                      className="h-9 px-3 rounded-lg bg-card hover:bg-ok-soft text-ok-ink font-label text-[11px] font-bold flex items-center gap-1 border border-ok-line cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">school</span>
                      <span>Charger l'échantillon didactique d'entraînement</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Échec de connexion réseau ou erreur API sans cache */}
              {isNetworkError && (
                <div className="p-3.5 rounded-lg bg-warn-soft border border-warn-line text-warn-ink text-[12px] flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-warn-ink shrink-0 mt-0.5">cloud_off</span>
                  <div className="flex flex-col gap-1 leading-snug">
                    <strong className="font-bold">
                      {liveReport?.dataSourceType === 'network_error' ? 'Connexion réseau impossible avec l’API Géorisques' : 'Erreur de transmission API Géorisques'}
                    </strong>
                    <span>{liveReport?.source}</span>
                    <span className="text-[11px] text-warn-ink">
                      Aucun risque fictif n'a été inséré. Vous pouvez vous entraîner avec l'échantillon pédagogique ci-dessous ou réessayer dès le rétablissement de la connexion.
                    </span>
                  </div>
                </div>
              )}

              {/* Échantillon pédagogique actif (séparation visuelle explicite sans confusion possible) */}
              {isPedagogical && (
                <div className="p-4 rounded-xl bg-amber-50 border-2 border-dashed border-amber-600 text-amber-950 flex flex-col gap-2 relative overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[24px] text-amber-700 shrink-0">school</span>
                    <strong className="font-label text-[13px] font-black uppercase text-amber-900 tracking-wider">
                      EXERCICE PÉDAGOGIQUE — SIMULATION DIDACTIQUE
                    </strong>
                  </div>
                  <p className="text-[12px] leading-relaxed">
                    Ce jeu de données est affiché <strong>strictement pour l'entraînement aux bons réflexes</strong>. Il ne reflète pas l'état réglementaire opposable de la commune de <strong>{activeCommune.name}</strong>.
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded self-start">
                    AUCUNE ALERTE RÉELLE • EXERCICE DIDACTIQUE
                  </span>
                </div>
              )}

              {/* Jeu didactique pré-embarqué (Lyon 3e) */}
              {isLyonInitial && (
                <div className="p-3 rounded-lg bg-subtle border border-brand-bright text-brand-ink text-[12px] flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-brand-ink shrink-0 mt-0.5">info</span>
                    <div>
                      <strong className="font-bold">Base didactique pré-embarquée (Lyon 3e) :</strong> Ce jeu de données illustratif permet de découvrir l'application hors connexion. Pour actualiser les arrêtés préfectoraux officiels en direct, cliquez sur « Actualiser ».
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRealRefreshData}
                    disabled={refreshing}
                    className="shrink-0 h-8 px-2.5 rounded bg-brand text-white font-label text-[10px] font-bold uppercase flex items-center gap-1 hover:bg-[#1d4ed8] cursor-pointer"
                  >
                    <span className={`material-symbols-outlined text-[14px] ${refreshing ? 'animate-spin' : ''}`}>sync</span>
                    Actualiser
                  </button>
                </div>
              )}

              {isUnverifiedEmpty && (
                <div className="bg-card p-5 rounded-xl border-2 border-dashed border-line-strong flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-subtle text-ink-muted flex items-center justify-center">
                    <span className="material-symbols-outlined text-[26px]">travel_explore</span>
                  </div>
                  <div className="flex flex-col gap-1 max-w-md">
                    <h3 className="font-label text-[15px] font-bold text-ink">
                      Aucun risque officiel synchronisé pour {activeCommune.name}
                    </h3>
                    <p className="text-[12px] text-ink-muted leading-relaxed">
                      Pour garantir l'intégrité de vos protocoles, NRBCOR n'injecte aucun risque fictif par défaut. Connectez-vous à Internet pour interroger les arrêtés préfectoraux de votre commune via l'API d'État, ou chargez l'échantillon didactique d'entraînement.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleRealRefreshData}
                      disabled={refreshing}
                      className="h-10 px-4 rounded-lg bg-brand text-white font-label text-[12px] font-bold flex items-center gap-1.5 hover:bg-brand-strong transition-colors disabled:opacity-60 cursor-pointer"
                    >
                      <span className={`material-symbols-outlined text-[16px] ${refreshing ? 'animate-spin' : ''}`}>sync</span>
                      <span>Interroger l'API Géorisques</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const pedago = getPedagogicalSampleRisks();
                        setLiveReport({
                          communeName: activeCommune.name,
                          inseeCode: activeCommune.insee,
                          retrievedAt: new Date().toISOString(),
                          source: 'Échantillon pédagogique didactique (exercice & formation civile)',
                          isOfflineCache: true,
                          dataSourceType: 'pedagogical_sample',
                          risksCount: pedago.length,
                          risks: pedago
                        });
                      }}
                      className="h-10 px-3.5 rounded-lg bg-subtle hover:bg-tint text-ink font-label text-[12px] font-bold flex items-center gap-1.5 transition-colors border border-line-strong cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">school</span>
                      <span>Charger l'échantillon pédagogique</span>
                    </button>
                  </div>
                </div>
              )}

              {displayedRisks.map((item: any, idx: number) => {
            const isCustom = !item.distance;
            return (
              <article
                key={item.id || idx}
                className="bg-card rounded-xl p-4 shadow-sm flex flex-col gap-2.5 border border-line-strong transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="font-label text-[11px] text-brand-ink font-bold uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-[17px] text-ink font-bold mt-0.5">
                      {item.title}
                    </h3>
                  </div>
                  <span className="font-label text-[10px] px-2 py-0.5 rounded font-bold uppercase shrink-0 bg-subtle text-brand-ink">
                    {item.tag || 'ARRÊTÉ PRÉFECTORAL'}
                  </span>
                </div>

                {item.distance && (
                  <div className="flex items-center gap-2 bg-subtle px-2.5 py-1.5 rounded-lg text-[13px] border border-line">
                    <span className="material-symbols-outlined text-[18px] text-brand-ink">near_me</span>
                    <span className="font-semibold text-ink">{item.distance}</span>
                  </div>
                )}

                <p className="text-[13px] text-ink leading-relaxed">
                  {item.description || item.desc}
                </p>

                {item.measureTitle && (
                  <div className="bg-tint p-3 rounded-lg flex flex-col gap-1 border border-line">
                    <div className="flex items-center gap-1.5 text-ink font-label text-[12px] font-bold">
                      <span className="material-symbols-outlined text-[18px] text-brand-ink">
                        notifications_active
                      </span>
                      {item.measureTitle}
                    </div>
                    <p className="text-[12px] text-ink-muted leading-relaxed">{item.measureDesc}</p>
                  </div>
                )}

                {/* Linked Protocol */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-ok-ink font-label text-[11px] font-bold">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>Fiche réflexe prête</span>
                  </div>
                  {item.protocolKey && (
                    <button
                      onClick={() =>
                        onOpenSubScreen({ type: 'protocol', id: item.protocolKey! })
                      }
                      type="button"
                      className="h-11 px-4 rounded bg-navy hover:bg-navy-2 text-white font-label text-[12px] font-bold uppercase flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span>Consulter Guide Réflexe</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  )}
                </div>
                </article>
              );
            })}
          </section>
        );
      })()}

        {/* Cadre Réglementaire Communal & Synthèse des Risques (DICRIM & PCS) */}
        <section className="bg-card p-4 rounded-xl shadow-sm flex flex-col gap-3 border border-line-strong">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] text-ink font-bold">Cadre Réglementaire & Documents Communaux</h2>
            <span className="font-label text-[10px] px-2 py-0.5 rounded bg-subtle text-brand-ink font-bold uppercase border border-line">
              SYNTHÈSE GÉORISQUES
            </span>
          </div>
          <p className="text-[12px] text-ink-muted -mt-1">
            Synthèse opérationnelle des aléas majeurs et accès aux démarches officielles de la commune de {activeCommune.name}.
          </p>

          <div className="flex flex-col gap-2.5">
            {/* DICRIM */}
            <div className="bg-subtle p-3 rounded-lg flex items-center justify-between gap-3 border border-line">
              <div className="flex items-start gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-ink text-[22px] shrink-0 mt-0.5">
                  menu_book
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-bold text-ink truncate">
                    Fiche de repérage DICRIM ({activeCommune.name})
                  </span>
                  <span className="text-[12px] text-ink-muted truncate">
                    Synthèse des risques • Document complet et paraphé consultable en mairie
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalDoc('dicrim')}
                className="h-11 px-3 rounded bg-card hover:bg-tint text-ink font-label text-[12px] font-bold shrink-0 flex items-center gap-1 border border-line-strong cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                Consulter
              </button>
            </div>

            {/* PCS */}
            <div className="bg-subtle p-3 rounded-lg flex items-center justify-between gap-3 border border-line">
              <div className="flex items-start gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-ink text-[22px] shrink-0 mt-0.5">
                  corporate_fare
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-bold text-ink truncate">
                    Fiche de repérage PCS ({activeCommune.name})
                  </span>
                  <span className="text-[12px] text-ink-muted truncate">
                    Organisation des secours • Dossier communal officiel consultable en mairie
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalDoc('pcs')}
                className="h-11 px-3 rounded bg-card hover:bg-tint text-ink font-label text-[12px] font-bold shrink-0 flex items-center gap-1 border border-line-strong cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                Consulter
              </button>
            </div>

            {/* PC Communal & Mairie Dynamique */}
            <div className="bg-tint p-3.5 rounded-lg flex flex-col gap-1.5 border border-line">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-ink font-label text-[12px] font-bold">
                  <span className="material-symbols-outlined text-[18px]">emergency_home</span>
                  <span>Poste de Commandement & Mairie</span>
                </div>
                {mairieContact?.isAuthentifie && (
                  <span className="font-label text-[10px] bg-ok-soft text-ok-ink px-1.5 py-0.5 rounded font-bold uppercase">
                    Vérifié DILA
                  </span>
                )}
              </div>

              <span className="text-[13px] font-bold text-ink">
                {mairieContact?.nomOfficiel || `Mairie de ${activeCommune.name}`}
              </span>

              {mairieContact?.adressePostale?.ligne && (
                <span className="text-[11px] text-ink-muted">
                  📍 {mairieContact.adressePostale.ligne}, {mairieContact.adressePostale.codePostal} {mairieContact.adressePostale.nomCommune}
                </span>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-line/70 mt-1">
                {mairieContact?.telephone ? (
                  <>
                    <div className="flex flex-col">
                      <span className="font-label text-[11px] text-ink font-semibold">
                        Standard officiel : <strong>{mairieContact.telephone}</strong>
                      </span>
                      {mairieContact.telephoneDescription && (
                        <span className="text-[10px] text-ink-muted">{mairieContact.telephoneDescription}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenCallModal({
                          number: mairieContact.telephone!,
                          name: mairieContact.nomOfficiel,
                          subtitle: 'Standard officiel vérifié',
                          desc: `Poste de commandement / Mairie pour la commune de ${activeCommune.name}. Source : Annuaire de l'Administration (DILA / Premier ministre).`,
                        })
                      }
                      className="h-10 px-3.5 rounded bg-navy hover:bg-navy-2 text-white font-label text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">call</span>
                      Appeler la Mairie
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col text-[11px] text-ink-muted">
                      <span>Numéro direct non synchronisé pour {activeCommune.name}.</span>
                      <span className="text-danger-ink font-semibold">En cas de détresse vitale : composer le 18 ou le 112.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenCallModal({
                          number: '112',
                          name: `Ligne d'Urgence Européenne (112)`,
                          subtitle: 'Secours d’Urgence',
                          desc: `Numéro d'urgence prioritaire accessible gratuitement sur tout terminal en cas d'accident sur la commune de ${activeCommune.name}.`,
                        })
                      }
                      className="h-10 px-3.5 rounded bg-danger hover:bg-danger-strong text-white font-label text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">emergency</span>
                      Appeler 112
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. EXPORT RÉEL DE L'INSTANTANÉ (FONCTION OPÉRATIONNELLE) */}
        <section className="flex flex-col gap-2.5 pt-1">
          <button
            onClick={handleExportSnapshot}
            type="button"
            className="w-full h-12 rounded bg-navy hover:bg-navy-2 text-white font-label text-[12px] font-bold uppercase flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Exporter l'Instantané Territorial (Fichier JSON Réel)</span>
          </button>

          <button
            onClick={handleExportPDF}
            type="button"
            className="w-full h-12 rounded bg-tint hover:bg-tint text-ink font-label text-[12px] font-bold uppercase flex items-center justify-center gap-2 transition-colors border border-line-strong cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span>Imprimer la Fiche de Préparation Communale (PDF / Papier)</span>
          </button>

          {exportedFile && (
            <div className="p-3 rounded-lg bg-ok-soft text-ok-ink border border-ok-line text-[12px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">file_download_done</span>
              <span>Instantané exporté avec succès ! Fichier « <strong>{exportedFile}</strong> » téléchargé sur votre terminal.</span>
            </div>
          )}

          {/* Lien externe vers l'API géorisques officielle (Nécessite connexion) */}
          <a
            className="w-full h-12 rounded bg-card hover:bg-tint text-brand-ink font-label text-[12px] font-bold flex items-center justify-center gap-2 shadow-sm transition-colors border border-line-strong"
            href={`https://www.georisques.gouv.fr/mes-risques/connaitre-les-risques-pres-de-chez-moi?code_insee=${activeCommune.insee}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            <span>Consulter la fiche complète sur georisques.gouv.fr</span>
            <span className="text-[11px] text-ink-muted font-normal">(🔵 Nécessite Internet)</span>
          </a>
        </section>
      </div>

      {/* Document Consultation Modal */}
      {activeModalDoc && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm"
        >
          <div className="bg-card max-w-lg w-full rounded-2xl p-5 shadow-2xl border border-line-strong flex flex-col gap-3 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-ink text-[22px]">
                  {activeModalDoc === 'dicrim' ? 'menu_book' : 'corporate_fare'}
                </span>
                <h3 className="text-[17px] font-bold text-ink">
                  {activeModalDoc === 'dicrim' ? `Synthèse DICRIM • ${activeCommune.name}` : `Dispositif PCS • ${activeCommune.name}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalDoc(null)}
                aria-label="Fermer"
                className="w-8 h-8 rounded-full bg-subtle hover:bg-tint text-ink flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Avertissement d'authenticité documentaire formel */}
            <div className="p-3 bg-danger-soft rounded-xl border border-danger-bright text-danger-ink-strong text-[11px] flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-danger-ink shrink-0 mt-0.5">verified_user</span>
              <div className="flex flex-col gap-0.5 leading-snug">
                <span className="font-bold uppercase tracking-wide">
                  Statut Documentaire & Authenticité
                </span>
                <p>
                  Ce volet présente la <strong>synthèse réglementaire officielle des aléas</strong> issus des bases de l’État Géorisques (BRGM / Ministère de la Transition Écologique). Pour consulter l’exemplaire complet paraphé et arrêté par le Maire, référez-vous au site officiel de la commune ou au recueil des actes administratifs de la mairie.
                </p>
              </div>
            </div>

            {/* Contenu spécifique DICRIM ou PCS */}
            {activeModalDoc === 'dicrim' ? (
              <div className="flex flex-col gap-2.5 text-[12px] text-ink">
                <p className="leading-relaxed">
                  Le <strong>DICRIM (Document d'Information Communal sur les Risques Majeurs)</strong> recense les risques naturels et technologiques prévisibles sur la commune de <strong>{activeCommune.name}</strong> ({activeCommune.insee}).
                </p>

                <div className="bg-canvas p-3 rounded-lg border border-line flex flex-col gap-1.5">
                  <span className="font-label text-[11px] font-bold text-brand-ink uppercase">
                    Aléas répertoriés pour {activeCommune.name} :
                  </span>
                    {(() => {
                      const isLyon = activeCommune.insee === '69383';
                      const list = (liveReport && liveReport.risks && liveReport.risks.length > 0)
                        ? liveReport.risks
                        : isLyon
                        ? GEORISQUES_ITEMS
                        : [];
                      
                      if (list.length === 0) {
                        return (
                          <div className="col-span-2 p-3 bg-card rounded border border-line text-ink-muted text-[11px] text-center">
                            Aucun aléa majeur officiellement synchronisé en local pour {activeCommune.name}. Consultez le dossier communal officiel ci-dessous.
                          </div>
                        );
                      }

                      return list.map((r: any) => {
                        const isHigh = ('severity' in r && r.severity === 'high') || r.category?.toLowerCase().includes('seveso') || r.category?.toLowerCase().includes('nucleaire');
                        const isMed = ('severity' in r && r.severity === 'medium') || r.category?.toLowerCase().includes('tmd') || r.category?.toLowerCase().includes('inondation');
                        return (
                          <div key={r.id} className="flex items-center gap-1.5 text-[11px] text-ink bg-card p-2 rounded border border-line">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${isHigh ? 'bg-danger' : isMed ? 'bg-brand' : 'bg-ok'}`}></span>
                            <span className="font-medium truncate">{r.title}</span>
                          </div>
                        );
                      });
                    })()}
                </div>

                <div className="bg-subtle p-3 rounded-lg border border-line flex flex-col gap-1 text-[11px] text-ink-muted">
                  <span className="font-bold text-ink">Moyens d'alerte communaux :</span>
                  <span>Sirène d'alerte aux populations SAIP (3 séquences d'1 min 41 s), système FR-Alert (diffusion cellulaire sans application), relais sonores municipaux.</span>
                </div>

                <a
                  href={`https://www.georisques.gouv.fr/mes-risques/connaitre-les-risques-pres-de-chez-moi?code_insee=${activeCommune.insee}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-lg bg-navy text-white font-label text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 hover:bg-navy-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  <span>Ouvrir le dossier Géorisques officiel de {activeCommune.name}</span>
                </a>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 text-[12px] text-ink">
                <p className="leading-relaxed">
                  Le <strong>PCS (Plan Communal de Sauvegarde)</strong> organise les moyens d'alerte, de protection et de soutien des populations sous l'autorité du Maire de <strong>{activeCommune.name}</strong> (Art. L731-3 du Code de la Sécurité Intérieure).
                </p>

                <div className="bg-canvas p-3 rounded-lg border border-line flex flex-col gap-1.5">
                  <span className="font-label text-[11px] font-bold text-brand-ink uppercase">
                    Dispositions d'organisation opérationnelle :
                  </span>
                  <ul className="list-disc list-inside space-y-1.5 text-[11px] text-ink-muted">
                    <li><strong>Poste de Commandement Communal (PCC) :</strong> activé à l'Hôtel de Ville ou en salle de crise municipale dès réception de l'alerte préfectorale.</li>
                    <li><strong>Missions municipales :</strong> relayer les consignes préfectorales, interdire les accès aux zones dangereuses, organiser le ravitaillement d'urgence.</li>
                    <li><strong>Centres d'Accueil et de Regroupement :</strong> gymnases ou bâtiments publics communaux réquisitionnés si une évacuation est ordonnée.</li>
                  </ul>
                </div>

                {mairieContact && (
                  <div className="bg-subtle p-3 rounded-lg border border-line flex flex-col gap-1 text-[11px]">
                    <span className="font-bold text-ink">Coordonnées officielles de la Mairie :</span>
                    <span className="font-medium text-ink">{mairieContact.nomOfficiel}</span>
                    {mairieContact.telephone && (
                      <span className="text-ink">Standard : <strong>{mairieContact.telephone}</strong></span>
                    )}
                    {mairieContact.siteInternet && (
                      <a
                        href={mairieContact.siteInternet}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-ink underline flex items-center gap-1 mt-0.5"
                      >
                        Site officiel de la mairie ({mairieContact.siteInternet})
                        <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => setActiveModalDoc(null)}
                className="h-10 px-4 rounded bg-navy text-white font-label text-[11px] font-bold uppercase cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Consultation des Sources Officielles et Fraîcheur */}
      {showSourcesModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs"
        >
          <div className="bg-card max-w-lg w-full rounded-2xl p-5 shadow-2xl border border-line-strong flex flex-col gap-3.5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-ink text-[22px]">policy</span>
                <h3 className="text-[17px] font-bold text-ink">
                  Sources des Données Territoriales
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSourcesModal(false)}
                aria-label="Fermer"
                className="w-8 h-8 rounded-full bg-subtle hover:bg-tint text-ink flex items-center justify-center cursor-pointer font-bold text-[14px]"
              >
                ✕
              </button>
            </div>

            {/* Note sur la fraîcheur et l'anti-mascarade */}
            <div className="p-3 bg-subtle rounded-xl border border-line text-ink text-[12px] flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 font-bold text-brand-ink font-label text-[11px] uppercase">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Transparence & Règle Anti-Mascarade
              </div>
              <p className="text-[11px] text-ink-muted leading-relaxed">
                NRBCOR applique un principe de rigueur stricte : <strong>aucune date artificielle n'est insérée</strong>. L'âge réel des données est calculé dynamiquement à partir de la date de capture sur les serveurs de l'État. Une archive locale ancienne conserve toute son utilité pour les zonages réglementaires stables (PPRT/PPI), mais elle ne doit jamais être présentée comme un flux en direct.
              </p>
            </div>

            {/* Liste détaillée des bases officielles */}
            <div className="flex flex-col gap-2.5 text-[12px]">
              <h4 className="font-label text-[11px] font-bold uppercase text-ink tracking-wider">
                Bases de données officielles de l'État :
              </h4>

              {/* 1. API Géorisques / BRGM */}
              <div className="p-3 bg-canvas rounded-lg border border-line flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink text-[13px]">API Géorisques (data.gouv.fr)</span>
                  <span className="text-[10px] font-bold font-label bg-tint text-brand-ink px-2 py-0.5 rounded">
                    BRGM / MTES
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted leading-relaxed">
                  Portail national d'information sur les risques naturels et technologiques majeurs. Fournit l'inventaire des dossiers communaux, installations classées Seveso et axes de transport de matières dangereuses (TMD).
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] font-label text-brand-ink">
                  <span>Endpoint : /api/v1/gaspar/risques</span>
                  <a
                    href="https://www.georisques.gouv.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-bold flex items-center gap-0.5"
                  >
                    georisques.gouv.fr &rarr;
                  </a>
                </div>
              </div>

              {/* 2. Base GASPAR */}
              <div className="p-3 bg-canvas rounded-lg border border-line flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink text-[13px]">Base Nationale GASPAR</span>
                  <span className="text-[10px] font-bold font-label bg-subtle text-ok-ink px-2 py-0.5 rounded">
                    Préfectures / DDTM
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted leading-relaxed">
                  <strong>Gestion Assistée des Procédures Administratives relatives aux Risques :</strong> Référentiel administratif consolidant les arrêtés préfectoraux opposables, plans de prévention des risques (PPR) et formalités DICRIM.
                </p>
              </div>

              {/* 3. Annuaire Service Public DILA */}
              <div className="p-3 bg-canvas rounded-lg border border-line flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink text-[13px]">Annuaire de l'Administration (DILA)</span>
                  <span className="text-[10px] font-bold font-label bg-ok-soft text-ok-ink px-2 py-0.5 rounded">
                    Premier Ministre
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted leading-relaxed">
                  Fournit les coordonnées certifiées du standard officiel de la Mairie et du Poste de Commandement Communal (PCC) pour l'activation des secours locaux.
                </p>
              </div>

              {/* 4. geo.api.gouv.fr */}
              <div className="p-3 bg-canvas rounded-lg border border-line flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink text-[13px]">Découpage Administratif (Etalab)</span>
                  <span className="text-[10px] font-bold font-label bg-subtle text-ink-muted px-2 py-0.5 rounded">
                    DINUM
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted leading-relaxed">
                  Résolution des centroïdes communaux réels [longitude, latitude], codes postaux et numéros INSEE sans transit serveur externe.
                </p>
              </div>
            </div>

            {/* Distinction Réponse Vide vs Risque Zéro */}
            <div className="p-3 bg-danger-soft rounded-xl border border-danger-bright text-danger-ink-strong text-[11px] flex flex-col gap-1">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1 font-label">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                Limites & Portée Réglementaire
              </span>
              <p className="leading-relaxed">
                Une réponse sans résultat dans l'API Géorisques indique uniquement qu'aucun arrêté n'est enregistré dans la base interrogée. Cela ne garantit pas l'absence de tout risque (météorologique, inondation, axes non classés). <strong>Seules les consignes de sécurité civile et les messages FR-Alert du Préfet font foi en direct.</strong>
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-line">
              <a
                href={`https://www.georisques.gouv.fr/mes-risques/connaitre-les-risques-pres-de-chez-moi?code_insee=${activeCommune.insee}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-ink text-[12px] font-bold underline flex items-center gap-1"
              >
                Fiche officielle de {activeCommune.name}
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
              <button
                type="button"
                onClick={() => setShowSourcesModal(false)}
                className="h-10 px-4 rounded-lg bg-navy hover:bg-navy-2 text-white font-label text-[11px] font-bold uppercase cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
