import React, { useState, useMemo, useEffect } from 'react';
import {
  IndustrialSite,
  SiteCategory,
  OFFLINE_INDUSTRIAL_SITES,
  diagnoseUserPerimeters,
  calculateHaversineDistanceKm,
  SiteProximityResult
} from '../data/perimetresData';
import { AVAILABLE_COMMUNES, CommuneInfo } from '../data/georisquesData';
import { triggerHaptic } from '../utils/haptics';

interface CartePerimetresViewProps {
  onBack: () => void;
  onOpenSubScreen?: (screen: any) => void;
}

export const CartePerimetresView: React.FC<CartePerimetresViewProps> = ({
  onBack,
  onOpenSubScreen
}) => {
  // Coordonnées utilisateur (par défaut Lyon 3e ou position sauvée)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; label: string }>({
    lat: 45.7602,
    lng: 4.8357,
    label: 'Lyon 3e Arrondissement'
  });

  const [activeCategory, setActiveCategory] = useState<'all' | SiteCategory>('all');
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'radar' | 'france'>('radar');

  // Diagnostic géodésique recalculé localement en instantané
  const diagnostic = useMemo(() => {
    return diagnoseUserPerimeters(userLocation.lat, userLocation.lng);
  }, [userLocation.lat, userLocation.lng]);

  // Sites filtrés et triés par distance
  const filteredSites = useMemo(() => {
    let list = diagnostic.allSitesSorted;
    if (activeCategory !== 'all') {
      list = list.filter((r) => r.site.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.site.name.toLowerCase().includes(q) ||
          r.site.commune.toLowerCase().includes(q) ||
          r.site.department.toLowerCase().includes(q) ||
          r.site.operator.toLowerCase().includes(q)
      );
    }
    return list;
  }, [diagnostic, activeCategory, searchQuery]);

  // Site sélectionné pour la fiche d'inspection
  const selectedSite = useMemo(() => {
    if (!selectedSiteId) {
      return diagnostic.allSitesSorted[0] || null;
    }
    return diagnostic.allSitesSorted.find((r) => r.site.id === selectedSiteId) || null;
  }, [selectedSiteId, diagnostic]);

  // Géolocalisation GPS locale 100% hors-ligne (ne transmet rien à l'extérieur)
  const handleLocateMe = () => {
    triggerHaptic('medium');
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("La géolocalisation n'est pas prise en charge par ce terminal.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: `Position GPS (${pos.coords.latitude.toFixed(3)}°, ${pos.coords.longitude.toFixed(3)}°)`
        });
        triggerHaptic('success');
      },
      (err) => {
        setIsLocating(false);
        setGeoError(
          err.code === 1
            ? "Accès à la position refusé. Choisissez une commune dans la liste."
            : "Impossible de déterminer votre position GPS."
        );
        triggerHaptic('warning');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSelectCommune = (c: CommuneInfo) => {
    triggerHaptic('light');
    setUserLocation({
      lat: c.lat,
      lng: c.lng,
      label: c.name
    });
    setGeoError(null);
  };

  // Coordonnées de projection cartographique pour la carte vectorielle de France
  // Bounding box France métropolitaine : Min Lat 42.0, Max Lat 51.5 | Min Lng -5.0, Max Lng 8.5
  const projectToMap = (lat: number, lng: number) => {
    const minLat = 42.0;
    const maxLat = 51.5;
    const minLng = -5.0;
    const maxLng = 8.5;
    const x = ((lng - minLng) / (maxLng - minLng)) * 360 + 20;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 360 + 20;
    return { x, y };
  };

  return (
    <div className="flex-1 w-full bg-[#f8f9ff] text-[#001126] flex flex-col pb-24">
      {/* Top Header & Actions */}
      <div className="bg-[#001126] text-white px-4 pt-4 pb-5 border-b border-[#12263f]">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 text-[#98f6c5] hover:text-white transition-colors font-['Space_Grotesk'] text-[13px] font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Retour</span>
            </button>
            <div className="flex items-center gap-1.5 bg-[#98f6c5]/20 text-[#98f6c5] border border-[#98f6c5]/30 px-2 py-0.5 rounded-full font-['Space_Grotesk'] text-[10px] uppercase font-bold">
              <span className="material-symbols-outlined text-[14px]">offline_bolt</span>
              <span>100% Hors-Ligne • Zero-Cloud</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#98f6c5] text-[24px]">radar</span>
              <h1 className="text-[20px] font-extrabold text-white tracking-tight">
                Carte Hors-Ligne des Périmètres
              </h1>
            </div>
            <p className="text-[12px] text-[#dce9fd] mt-1 leading-relaxed">
              Base autonome des 19 CNPE nucléaires et 22 plateformes Seveso Seuil Haut. Calcul géodésique local immédiat sans réseau ni serveur.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-3 sm:px-4 flex flex-col gap-4 mt-3">
        {/* Localisation & Détection GPS */}
        <div className="bg-white p-3.5 rounded-xl border border-[#c4c6ce] shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#eef4ff] text-[#0036ce] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-['Space_Grotesk'] text-[10px] text-[#74777e] uppercase font-bold">
                  Position de référence
                </span>
                <span className="text-[14px] font-bold text-[#001126] truncate">
                  {userLocation.label}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLocateMe}
              disabled={isLocating}
              className="min-h-[40px] px-3 bg-[#001126] hover:bg-[#12263f] text-white rounded-lg flex items-center gap-1.5 font-['Space_Grotesk'] text-[12px] font-bold uppercase transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span className={`material-symbols-outlined text-[16px] ${isLocating ? 'animate-spin' : ''}`}>
                {isLocating ? 'refresh' : 'my_location'}
              </span>
              <span>{isLocating ? 'Localisation...' : 'GPS Local'}</span>
            </button>
          </div>

          {geoError && (
            <div className="p-2 bg-[#ffdad6] text-[#93000a] rounded-lg text-[12px] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
              <span>{geoError}</span>
            </div>
          )}

          {/* Raccourcis Villes Communes */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[11px] font-['Space_Grotesk'] text-[#74777e] font-semibold shrink-0">
              Villes tests :
            </span>
            {AVAILABLE_COMMUNES.slice(0, 7).map((c) => (
              <button
                key={c.insee}
                type="button"
                onClick={() => handleSelectCommune(c)}
                className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-['Space_Grotesk'] font-bold border transition-colors ${
                  userLocation.label === c.name
                    ? 'bg-[#0036ce] text-white border-[#0036ce]'
                    : 'bg-[#f8f9ff] text-[#44474d] border-[#c4c6ce] hover:border-[#0036ce]'
                }`}
              >
                {c.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Diagnostic Territorial Instantané */}
        <div
          className={`p-4 rounded-xl border-2 transition-all ${
            diagnostic.overallStatus === 'in_reflex'
              ? 'bg-[#ba1a1a]/10 border-[#ba1a1a]'
              : diagnostic.overallStatus === 'in_ppi'
              ? 'bg-[#6750a4]/10 border-[#6750a4]'
              : diagnostic.overallStatus === 'in_vigilance'
              ? 'bg-[#fef3c7] border-[#d97706]'
              : 'bg-[#eef4ff] border-[#0036ce]/40'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span
                  className={`font-['Space_Grotesk'] text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${diagnostic.statusBadgeColor} ${diagnostic.statusBadgeTextColor}`}
                >
                  {diagnostic.statusTitle}
                </span>
                <span className="text-[11px] text-[#44474d] font-['Space_Grotesk'] font-semibold">
                  Distance minimale : {Math.min(diagnostic.closestCnpe.distanceKm, diagnostic.closestSeveso.distanceKm)} km
                </span>
              </div>
              <p className="text-[13px] font-semibold text-[#001126] mt-1 leading-snug">
                {diagnostic.directiveSummary}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-black/10">
            {/* Nucléaire le plus proche */}
            <div
              onClick={() => {
                setSelectedSiteId(diagnostic.closestCnpe.site.id);
                triggerHaptic('light');
              }}
              className="p-2.5 bg-white/90 rounded-lg border border-black/10 flex items-center justify-between cursor-pointer hover:border-[#0036ce] transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded bg-[#ffd8e4] text-[#31111d] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px]">nuclear_power</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-['Space_Grotesk'] text-[#74777e] uppercase font-bold">
                    CNPE le plus proche
                  </span>
                  <span className="text-[12px] font-bold text-[#001126] truncate">
                    {diagnostic.closestCnpe.site.shortName}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-['Space_Grotesk'] text-[13px] font-extrabold text-[#001126]">
                  {diagnostic.closestCnpe.distanceKm} km
                </span>
                <span className="block text-[9px] uppercase font-bold text-[#6750a4]">
                  {diagnostic.closestCnpe.isWithinPpi ? 'DANS PPI 20km' : 'HORS PPI'}
                </span>
              </div>
            </div>

            {/* Seveso le plus proche */}
            <div
              onClick={() => {
                setSelectedSiteId(diagnostic.closestSeveso.site.id);
                triggerHaptic('light');
              }}
              className="p-2.5 bg-white/90 rounded-lg border border-black/10 flex items-center justify-between cursor-pointer hover:border-[#ba1a1a] transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded bg-[#ffdad6] text-[#93000a] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-['Space_Grotesk'] text-[#74777e] uppercase font-bold">
                    Seveso Seuil Haut
                  </span>
                  <span className="text-[12px] font-bold text-[#001126] truncate">
                    {diagnostic.closestSeveso.site.shortName}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-['Space_Grotesk'] text-[13px] font-extrabold text-[#001126]">
                  {diagnostic.closestSeveso.distanceKm} km
                </span>
                <span className="block text-[9px] uppercase font-bold text-[#ba1a1a]">
                  {diagnostic.closestSeveso.isWithinPpi ? 'DANS PPI 5km' : 'HORS PPI'}
                </span>
              </div>
            </div>
          </div>

          {/* Règle sanitaire iode */}
          <div className="mt-2.5 pt-2 flex items-start gap-1.5 text-[11px] text-[#44474d] leading-relaxed">
            <span className="material-symbols-outlined text-[15px] text-[#ba1a1a] shrink-0 mt-0.5">
              medication
            </span>
            <span>
              <strong>Doctrine Iode Stable : </strong> {diagnostic.iodineAdvice}
            </span>
          </div>
        </div>

        {/* Sélecteur de Mode d'Affichage : Radar Local vs Carte de France */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-[#e4efff] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setViewMode('radar');
                triggerHaptic('light');
              }}
              className={`px-3 py-1.5 rounded-lg font-['Space_Grotesk'] text-[12px] font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'radar'
                  ? 'bg-white text-[#001126] shadow-xs'
                  : 'text-[#44474d] hover:text-[#001126]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">radar</span>
              <span>Radar Concentrique (50 km)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('france');
                triggerHaptic('light');
              }}
              className={`px-3 py-1.5 rounded-lg font-['Space_Grotesk'] text-[12px] font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'france'
                  ? 'bg-white text-[#001126] shadow-xs'
                  : 'text-[#44474d] hover:text-[#001126]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
              <span>Carte Nationale (41 Sites)</span>
            </button>
          </div>

          <span className="font-['Space_Grotesk'] text-[11px] text-[#74777e] font-bold hidden sm:inline">
            41 Sites référencés
          </span>
        </div>

        {/* 1. VUE RADAR CONCENTRIQUE */}
        {viewMode === 'radar' && (
          <div className="bg-[#001126] rounded-2xl p-4 text-white shadow-md relative overflow-hidden flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-[11px] font-['Space_Grotesk'] text-[#dce9fd] mb-2 z-10">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#98f6c5] animate-ping"></span>
                <span>Portée radar : 80 km autour de votre position</span>
              </span>
              <span className="text-[#98f6c5] font-bold">Nord ↑</span>
            </div>

            <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center my-2">
              <svg viewBox="0 0 340 340" className="w-full h-full">
                {/* Anneau 50 km - Zone Vigilance */}
                <circle
                  cx="170"
                  cy="170"
                  r="140"
                  fill="rgba(255, 255, 255, 0.03)"
                  stroke="#44474d"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text x="174" y="38" fill="#a4a7ae" fontSize="9" fontFamily="Space Grotesk">
                  50 km (Vigilance)
                </text>

                {/* Anneau 20 km - Périmètre PPI Nucléaire */}
                <circle
                  cx="170"
                  cy="170"
                  r="85"
                  fill="rgba(103, 80, 164, 0.1)"
                  stroke="#a38de8"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
                <text x="174" y="94" fill="#a38de8" fontSize="9" fontFamily="Space Grotesk" fontWeight="bold">
                  20 km (PPI CNPE)
                </text>

                {/* Anneau 5 km - Zone Réflexe Immédiate */}
                <circle
                  cx="170"
                  cy="170"
                  r="32"
                  fill="rgba(186, 26, 26, 0.2)"
                  stroke="#ba1a1a"
                  strokeWidth="2"
                />
                <text x="174" y="145" fill="#ffdad6" fontSize="8" fontFamily="Space Grotesk" fontWeight="bold">
                  5 km (Réflexe)
                </text>

                {/* Lignes de visée cardinales */}
                <line x1="170" y1="10" x2="170" y2="330" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="10" y1="170" x2="330" y2="170" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                {/* Centre : Position de l'utilisateur */}
                <circle cx="170" cy="170" r="6" fill="#388df8" stroke="#ffffff" strokeWidth="2" />
                <circle cx="170" cy="170" r="12" fill="rgba(56, 141, 248, 0.3)" />

                {/* Tracé des sites à portée radar (< 80 km) */}
                {diagnostic.allSitesSorted
                  .filter((r) => r.distanceKm <= 85)
                  .map((r) => {
                    // Calcul de la projection polaire par rapport à la position utilisateur
                    const dKm = r.distanceKm;
                    const maxKm = 80;
                    const rPixel = Math.min((dKm / maxKm) * 140, 150);

                    // Calcul de l'azimut approximatif
                    const dLat = r.site.lat - userLocation.lat;
                    const dLng = (r.site.lng - userLocation.lng) * Math.cos(userLocation.lat * (Math.PI / 180));
                    const angle = Math.atan2(dLng, dLat); // 0 = Nord, PI/2 = Est

                    const x = 170 + rPixel * Math.sin(angle);
                    const y = 170 - rPixel * Math.cos(angle);

                    const isSelected = selectedSite?.site.id === r.site.id;
                    const isNuclear = r.site.category === 'cnpe';

                    return (
                      <g
                        key={r.site.id}
                        className="cursor-pointer group"
                        onClick={() => {
                          setSelectedSiteId(r.site.id);
                          triggerHaptic('light');
                        }}
                      >
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? 10 : 7}
                          fill={isNuclear ? '#ffd8e4' : '#ffdad6'}
                          stroke={isNuclear ? '#930058' : '#93000a'}
                          strokeWidth={isSelected ? 3 : 1.5}
                        />
                        <text
                          x={x + 9}
                          y={y + 3}
                          fill={isSelected ? '#98f6c5' : '#ffffff'}
                          fontSize="9"
                          fontFamily="Space Grotesk"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                        >
                          {r.site.shortName} ({r.distanceKm}km)
                        </text>
                      </g>
                    );
                  })}
              </svg>
            </div>

            <div className="w-full flex items-center justify-between text-[11px] font-['Space_Grotesk'] text-[#dce9fd] pt-2 border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffd8e4] border border-[#930058]"></span>
                  <span>Nucléaire (CNPE)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffdad6] border border-[#93000a]"></span>
                  <span>Seveso Seuil Haut</span>
                </span>
              </div>
              <span>Point bleu = Votre position</span>
            </div>
          </div>
        )}

        {/* 2. VUE CARTE NATIONALE VECTORIELLE */}
        {viewMode === 'france' && (
          <div className="bg-[#001126] rounded-2xl p-4 text-white shadow-md flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-[11px] font-['Space_Grotesk'] text-[#dce9fd] mb-2">
              <span>Carte des 41 sites majeurs de France métropolitaine</span>
              <span className="text-[#98f6c5] font-bold">100% Vectoriel Hors-Ligne</span>
            </div>

            <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center my-1">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* Silhouette schématique du littoral et frontières métropolitaines */}
                <path
                  d="M 120 40 L 190 20 L 250 35 L 290 60 L 340 70 L 370 120 L 360 170 L 340 220 L 370 270 L 340 330 L 290 350 L 220 370 L 160 380 L 130 330 L 90 290 L 70 210 L 40 180 L 30 140 L 70 120 L 110 110 Z"
                  fill="rgba(255, 255, 255, 0.04)"
                  stroke="#23354d"
                  strokeWidth="2"
                />

                {/* Tracé de tous les sites */}
                {OFFLINE_INDUSTRIAL_SITES.map((site) => {
                  const { x, y } = projectToMap(site.lat, site.lng);
                  const isSelected = selectedSite?.site.id === site.id;
                  const isNuclear = site.category === 'cnpe';

                  return (
                    <g
                      key={site.id}
                      className="cursor-pointer group"
                      onClick={() => {
                        setSelectedSiteId(site.id);
                        triggerHaptic('light');
                      }}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 8 : 4.5}
                        fill={isNuclear ? '#e8b5d3' : '#ff897d'}
                        stroke={isNuclear ? '#ffffff' : '#ffffff'}
                        strokeWidth={isSelected ? 2 : 1}
                      />
                      {isSelected && (
                        <circle cx={x} cy={y} r={14} fill="none" stroke="#98f6c5" strokeWidth="1.5" className="animate-ping" />
                      )}
                    </g>
                  );
                })}

                {/* Point utilisateur sur la carte de France */}
                {(() => {
                  const userP = projectToMap(userLocation.lat, userLocation.lng);
                  return (
                    <g>
                      <circle cx={userP.x} cy={userP.y} r={6} fill="#388df8" stroke="#ffffff" strokeWidth="2" />
                      <circle cx={userP.x} cy={userP.y} r={14} fill="rgba(56, 141, 248, 0.25)" />
                    </g>
                  );
                })()}
              </svg>
            </div>

            <p className="text-[11px] font-['Space_Grotesk'] text-[#dce9fd] text-center mt-1">
              Touchez un point sur la carte pour afficher sa fiche PPI détaillée ci-dessous.
            </p>
          </div>
        )}

        {/* Fiche d'Inspection du Site Sélectionné */}
        {selectedSite && (
          <div className="bg-white rounded-xl border border-[#c4c6ce] shadow-sm p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2 border-b border-[#e4efff] pb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedSite.site.category === 'cnpe'
                      ? 'bg-[#ffd8e4] text-[#31111d]'
                      : 'bg-[#ffdad6] text-[#93000a]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {selectedSite.site.category === 'cnpe' ? 'nuclear_power' : 'factory'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`font-['Space_Grotesk'] text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        selectedSite.site.category === 'cnpe'
                          ? 'bg-[#6750a4] text-white'
                          : 'bg-[#ba1a1a] text-white'
                      }`}
                    >
                      {selectedSite.site.category === 'cnpe' ? 'Nucléaire • CNPE' : 'Chimie • Seveso Seuil Haut'}
                    </span>
                    <span className="text-[11px] font-['Space_Grotesk'] text-[#74777e] font-semibold">
                      {selectedSite.site.operator}
                    </span>
                  </div>
                  <h2 className="text-[16px] font-bold text-[#001126] mt-0.5">
                    {selectedSite.site.name}
                  </h2>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-['Space_Grotesk'] text-[18px] font-black text-[#001126]">
                  {selectedSite.distanceKm} km
                </span>
                <span
                  className={`block font-['Space_Grotesk'] text-[10px] font-extrabold uppercase ${
                    selectedSite.isWithinReflex
                      ? 'text-[#ba1a1a]'
                      : selectedSite.isWithinPpi
                      ? 'text-[#6750a4]'
                      : 'text-[#3f9d73]'
                  }`}
                >
                  {selectedSite.isWithinReflex
                    ? 'Zone Réflexe'
                    : selectedSite.isWithinPpi
                    ? 'Périmètre PPI'
                    : selectedSite.isWithinVigilance
                    ? 'Vigilance'
                    : 'Hors Périmètre'}
                </span>
              </div>
            </div>

            <p className="text-[13px] text-[#44474d] leading-relaxed">
              {selectedSite.site.description}
            </p>

            {/* Dangers & Produits cliquables */}
            <div>
              <span className="text-[11px] font-['Space_Grotesk'] text-[#74777e] uppercase font-bold block mb-1">
                Substances & Risques Dominants :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSite.site.keyHazards.map((h, i) => (
                  <span
                    key={i}
                    className="font-['Space_Grotesk'] text-[11px] px-2.5 py-0.5 rounded-full bg-[#f8f9ff] text-[#001126] border border-[#c4c6ce] font-semibold"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Consigne d'alerte immédiate */}
            <div className="p-3 bg-[#eef4ff] rounded-xl border border-[#0036ce]/20 flex flex-col gap-1.5">
              <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-wider text-[#0036ce] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">security</span>
                Réflexe de Sécurité Civile (PPI {selectedSite.site.ppiRadiusKm} km)
              </span>
              <p className="text-[12px] text-[#001126] font-semibold leading-snug">
                {selectedSite.site.officialDoctrine.immediateReflex}
              </p>
              <div className="pt-1 text-[11px] text-[#44474d] flex items-center gap-1 border-t border-[#0036ce]/10">
                <span className="material-symbols-outlined text-[14px] text-[#ba1a1a]">campaign</span>
                <span>{selectedSite.site.officialDoctrine.sirenType}</span>
              </div>
            </div>

            {/* Raccourcis d'action vers les guides */}
            <div className="flex flex-wrap gap-2 pt-1">
              {selectedSite.site.category === 'cnpe' ? (
                <button
                  type="button"
                  onClick={() => onOpenSubScreen?.({ type: 'iode' })}
                  className="flex-1 min-h-[42px] bg-[#ffd8e4] hover:bg-[#ffc1d7] text-[#31111d] font-['Space_Grotesk'] text-[12px] font-bold px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">medication</span>
                  <span>Calculateur Posologie Iode</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenSubScreen?.({ type: 'protocol', id: 'chimique' })}
                  className="flex-1 min-h-[42px] bg-[#ffdad6] hover:bg-[#ffc2bb] text-[#93000a] font-['Space_Grotesk'] text-[12px] font-bold px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  <span>Protocole Risque Chimique</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onOpenSubScreen?.({ type: 'confinement-guide' })}
                className="min-h-[42px] bg-[#001126] hover:bg-[#12263f] text-white font-['Space_Grotesk'] text-[12px] font-bold px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">meeting_room</span>
                <span>Guide Calfeutrage</span>
              </button>
            </div>
          </div>
        )}

        {/* Liste Complète & Filtrage des Sites */}
        <div className="flex flex-col gap-2.5 mt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-['Space_Grotesk'] text-[14px] font-bold text-[#001126] uppercase">
              Répertoire National des Sites ({filteredSites.length})
            </h3>
            <span className="text-[11px] text-[#74777e] font-['Space_Grotesk']">
              Classé par proximité
            </span>
          </div>

          {/* Filtres de catégorie */}
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'Tous (41)' },
              { id: 'cnpe', label: 'Nucléaire CNPE (19)' },
              { id: 'seveso', label: 'Seveso Seuil Haut (22)' }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setActiveCategory(f.id as any);
                  triggerHaptic('light');
                }}
                className={`flex-1 min-h-[38px] px-2 rounded-lg font-['Space_Grotesk'] text-[11px] font-bold uppercase transition-all ${
                  activeCategory === f.id
                    ? 'bg-[#001126] text-white shadow-xs'
                    : 'bg-white text-[#44474d] border border-[#c4c6ce] hover:border-[#001126]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#74777e] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom de centrale, usine, commune ou département..."
              className="w-full h-10 pl-9 pr-4 bg-white border border-[#c4c6ce] rounded-xl text-[13px] text-[#001126] placeholder-[#74777e] focus:outline-none focus:border-[#0036ce]"
            />
          </div>

          {/* Liste des cartes de sites */}
          <div className="flex flex-col gap-2">
            {filteredSites.map((r: SiteProximityResult) => {
              const isSelected = selectedSite?.site.id === r.site.id;
              const isNuclear = r.site.category === 'cnpe';

              return (
                <div
                  key={r.site.id}
                  onClick={() => {
                    setSelectedSiteId(r.site.id);
                    triggerHaptic('light');
                  }}
                  className={`p-3 bg-white rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-[#0036ce] ring-1 ring-[#0036ce] shadow-sm'
                      : 'border-[#c4c6ce] hover:border-[#74777e]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isNuclear ? 'bg-[#ffd8e4] text-[#31111d]' : 'bg-[#ffdad6] text-[#93000a]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isNuclear ? 'nuclear_power' : 'factory'}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-bold text-[#001126] truncate">
                        {r.site.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#74777e] font-['Space_Grotesk']">
                        <span>{r.site.department}</span>
                        <span>•</span>
                        <span>PPI {r.site.ppiRadiusKm} km</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-['Space_Grotesk'] text-[15px] font-extrabold text-[#001126]">
                      {r.distanceKm} km
                    </span>
                    <span
                      className={`block font-['Space_Grotesk'] text-[10px] font-bold uppercase ${
                        r.isWithinReflex
                          ? 'text-[#ba1a1a]'
                          : r.isWithinPpi
                          ? 'text-[#6750a4]'
                          : 'text-[#74777e]'
                      }`}
                    >
                      {r.isWithinReflex ? 'Réflexe' : r.isWithinPpi ? 'Dans PPI' : 'Hors PPI'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
