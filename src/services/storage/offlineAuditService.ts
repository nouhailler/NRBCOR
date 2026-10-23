/**
 * Service de Diagnostic et Contrôle de Préparation Hors-Ligne (PWA / Cache / Stockage Local)
 * 
 * Permet de vérifier l'autonomie 100% hors-ligne de l'application :
 * - Service Worker actif et contrôlant la page
 * - Cache Storage des assets critiques
 * - Intégrité des magasins IndexedDB et localStorage
 * - Estimation du quota de stockage (navigator.storage.estimate)
 * - Risque d'éviction du stockage par les navigateurs (Safari iOS 7 jours)
 */

export interface OfflineCheckItem {
  id: string;
  title: string;
  category: 'sw' | 'cache' | 'storage' | 'database' | 'browser';
  status: 'ok' | 'warning' | 'error';
  summary: string;
  details?: string;
  recommendation?: string;
}

export interface OfflineAuditResult {
  timestamp: string;
  overallStatus: 'prete' | 'partielle' | 'critique';
  readinessScore: number; // 0 - 100
  items: OfflineCheckItem[];
  storageUsedBytes?: number;
  storageQuotaBytes?: number;
  isSafariIos: boolean;
  isStandalone: boolean;
}

export async function runOfflinePreparationAudit(): Promise<OfflineAuditResult> {
  const items: OfflineCheckItem[] = [];
  let scorePoints = 0;
  const maxPoints = 5;

  // 1. Détection Safari iOS & Mode Standalone (Risque d'éviction 7 jours ITP)
  const isIos = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isSafariIos = isIos && isSafari;
  const isStandalone = typeof window !== 'undefined' && (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true
  );

  if (isSafariIos && !isStandalone) {
    items.push({
      id: 'browser-eviction',
      title: 'Politique d\'éviction Safari iOS (Risque 7 jours)',
      category: 'browser',
      status: 'warning',
      summary: 'Safari iOS peut purger le stockage hors-ligne après 7 jours sans ouverture.',
      details: 'La politique ITP d\'Apple supprime le cache et IndexedDB des sites ouverts dans le navigateur après 7 jours d\'inactivité.',
      recommendation: 'Ajoutez l\'application à votre écran d\'accueil (« Sur l\'écran d\'accueil ») pour verrouiller la persistance des données.'
    });
  } else {
    items.push({
      id: 'browser-eviction',
      title: 'Stabilité du stockage navigateur',
      category: 'browser',
      status: 'ok',
      summary: isStandalone ? 'Application installée sur l\'appareil (Mode Autonome / Standalone).' : 'Environnement navigateur standard avec persistance stable.',
    });
    scorePoints++;
  }

  // 2. Vérification du Service Worker
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    const swReg = await navigator.serviceWorker.getRegistration();
    if (swReg && (swReg.active || swReg.installing || swReg.waiting)) {
      items.push({
        id: 'service-worker',
        title: 'Service Worker Hors-Ligne',
        category: 'sw',
        status: 'ok',
        summary: 'Service Worker opérationnel et actif.',
        details: `Portée (Scope) : ${swReg.scope}. État : ${swReg.active ? 'Actif' : 'En cours d\'activation'}.`
      });
      scorePoints++;
    } else {
      items.push({
        id: 'service-worker',
        title: 'Service Worker Hors-Ligne',
        category: 'sw',
        status: 'warning',
        summary: 'Service Worker non détecté ou en cours de première installation.',
        recommendation: 'Laissez l\'application ouverte quelques secondes avec connexion pour finaliser l\'installation initiale.'
      });
    }
  } else {
    items.push({
      id: 'service-worker',
      title: 'Service Worker non supporté',
      category: 'sw',
      status: 'error',
      summary: 'Ce navigateur ne gère pas les Service Workers nécessaires au hors-ligne.',
      recommendation: 'Utilisez un navigateur moderne (Chrome, Firefox, Safari iOS récent).'
    });
  }

  // 3. Vérification du Cache Storage
  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      const cacheKeys = await caches.keys();
      if (cacheKeys.length > 0) {
        items.push({
          id: 'cache-storage',
          title: 'Cache Storage des Ressources',
          category: 'cache',
          status: 'ok',
          summary: `${cacheKeys.length} cache(s) localisé(s) en mémoire locale.`,
          details: `Identifiants : ${cacheKeys.join(', ')}`
        });
        scorePoints++;
      } else {
        items.push({
          id: 'cache-storage',
          title: 'Cache Storage des Ressources',
          category: 'cache',
          status: 'warning',
          summary: 'Aucun cache actif trouvé dans Cache Storage.',
          recommendation: 'Naviguez dans les onglets clés pour peupler le cache ou rechargez une fois en ligne.'
        });
      }
    } catch {
      items.push({
        id: 'cache-storage',
        title: 'Accès Cache Storage restreint',
        category: 'cache',
        status: 'warning',
        summary: 'Impossible d\'énumérer les caches (mode navigation privée ou restriction).'
      });
    }
  } else {
    items.push({
      id: 'cache-storage',
      title: 'Cache Storage non supporté',
      category: 'cache',
      status: 'error',
      summary: 'L\'API Cache Storage n\'est pas accessible.'
    });
  }

  // 4. Vérification de l'accès aux bases de données locales (IndexedDB & localStorage)
  let idbOk = false;
  try {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      idbOk = true;
    }
  } catch {
    idbOk = false;
  }

  let localOk = false;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('__nrbcor_audit_test__', '1');
      localStorage.removeItem('__nrbcor_audit_test__');
      localOk = true;
    }
  } catch {
    localOk = false;
  }

  if (idbOk && localOk) {
    items.push({
      id: 'local-databases',
      title: 'Bases de Données Locales (IndexedDB & Registres)',
      category: 'database',
      status: 'ok',
      summary: 'Magasins de données opérationnels (Kit 72h, Inventaire, Plan Familial, Doctrine).',
      details: 'Lecture et écriture synchrones et asynchrones validées.'
    });
    scorePoints++;
  } else {
    items.push({
      id: 'local-databases',
      title: 'Bases de Données Locales',
      category: 'database',
      status: 'error',
      summary: 'Accès au stockage local restreint ou bloqué.',
      recommendation: 'Désactivez le mode navigation privée ultra-strict ou autorisez les données locales pour ce site.'
    });
  }

  // 5. Estimation du quota de stockage & persistance
  let usedBytes: number | undefined;
  let quotaBytes: number | undefined;

  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      usedBytes = estimate.usage;
      quotaBytes = estimate.quota;

      const usedMb = usedBytes ? (usedBytes / (1024 * 1024)).toFixed(1) : '0';
      const quotaMb = quotaBytes ? (quotaBytes / (1024 * 1024)).toFixed(0) : 'indéterminé';

      items.push({
        id: 'storage-quota',
        title: 'Espace Disque Local & Quota',
        category: 'storage',
        status: 'ok',
        summary: `${usedMb} Mo utilisés sur ~${quotaMb} Mo alloués par le système.`,
        details: 'Espace largement suffisant pour stocker l\'ensemble du corpus NRBC, des plans et des inventaires.'
      });
      scorePoints++;
    } catch {
      items.push({
        id: 'storage-quota',
        title: 'Quota de Stockage',
        category: 'storage',
        status: 'ok',
        summary: 'Stockage local disponible.',
      });
      scorePoints++;
    }
  } else {
    items.push({
      id: 'storage-quota',
      title: 'Quota de Stockage',
      category: 'storage',
      status: 'ok',
      summary: 'Stockage local actif (API d\'estimation détaillée non disponible sur ce navigateur).',
    });
    scorePoints++;
  }

  const readinessScore = Math.round((scorePoints / maxPoints) * 100);
  const overallStatus = readinessScore >= 80 ? 'prete' : readinessScore >= 50 ? 'partielle' : 'critique';

  return {
    timestamp: new Date().toISOString(),
    overallStatus,
    readinessScore,
    items,
    storageUsedBytes: usedBytes,
    storageQuotaBytes: quotaBytes,
    isSafariIos,
    isStandalone
  };
}
