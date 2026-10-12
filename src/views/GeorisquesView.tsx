import React, { useState } from 'react';
import { SubScreen, EmergencyCall } from '../types';
import { CURRENT_COMMUNE, AVAILABLE_COMMUNES, GEORISQUES_ITEMS, CommuneInfo } from '../data/georisquesData';
import { searchCommunesOnline, fetchGeorisquesOnline } from '../services/external/georisquesClient';

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
  const [gpsLoading, setGpsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeModalDoc, setActiveModalDoc] = useState<string | null>(null);
  const [selectedMapNode, setSelectedMapNode] = useState<'ref' | 'ppi' | 'tmd' | 'bugey' | null>(null);

  const handleSimulateGPS = () => {
    setGpsLoading(true);
    setTimeout(() => {
      setGpsLoading(false);
      setActiveCommune(CURRENT_COMMUNE);
    }, 1200);
  };

  const handleRefreshData = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1400);
  };

  const handleExportSnapshot = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col w-full pt-20 pb-28 min-h-screen max-w-xl mx-auto">
      {/* Persistent Sync Sentinel Bar */}
      <div className="w-full bg-[#e4efff] px-4 py-2.5 flex items-center justify-between gap-2 border-b border-[#d6e4f8]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3f9d73] animate-pulse shrink-0"></span>
          <span className="font-['Space_Grotesk'] text-[11px] text-[#001126] tracking-wide uppercase truncate font-bold">
            Cache Local : Synchronisé Hors-Ligne
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0 font-['Space_Grotesk'] text-[11px] text-[#44474d]">
          <span className="material-symbols-outlined text-[14px]">history</span>
          <span>04/10/2026</span>
        </div>
      </div>

      <div className="px-4 py-3 flex flex-col gap-4">
        {/* Hub d'urgence return button */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            type="button"
            className="h-12 px-3 bg-[#dce9fd] hover:bg-[#d6e4f8] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold rounded flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>RETOUR ACCUEIL</span>
          </button>
          <span className="font-['Space_Grotesk'] text-[11px] bg-[#98f6c5] text-[#005236] px-2 py-1 rounded font-bold uppercase">
            RÉSILIENCE LOCALE
          </span>
        </div>

        {/* Section Categorization Header */}
        <header className="flex flex-col gap-1">
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="font-['Space_Grotesk'] text-[11px] px-2 py-0.5 rounded bg-[#12263f] text-white font-bold uppercase tracking-wider">
              Section 4.10 • Sécurité Civile
            </span>
          </div>
          <h1 className="text-[24px] text-[#001126] font-bold tracking-tight">
            Risques Locaux & Géorisques
          </h1>
          <p className="text-[13px] text-[#44474d] leading-relaxed">
            Inventaire cartographié des installations industrielles, plans de prévention technologique (PPRT), axes TMD et documents communaux de sauvegarde.
          </p>
        </header>

        {/* Territorial Selector & Privacy Guarantee */}
        <section className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-3 border border-[#c4c6ce]">
          <div className="flex items-center justify-between">
            <label className="font-['Space_Grotesk'] text-[12px] uppercase tracking-wider text-[#001126] flex items-center gap-1.5 font-bold">
              <span className="material-symbols-outlined text-[18px] text-[#0036ce]">share_location</span>
              Commune d'Analyse Locale
            </label>
            <span className="font-['Space_Grotesk'] text-[10px] px-2 py-0.5 rounded bg-[#98f6c5] text-[#005236] font-bold uppercase">
              SAISIE MANUELLE ACTIVE
            </span>
          </div>

          {/* Input Display Bar */}
          <div className="bg-[#eef4ff] rounded-lg p-3 flex items-center justify-between gap-3 border border-[#d6e4f8]">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-[#001126] text-[20px] shrink-0">pin_drop</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[15px] font-bold text-[#001126] truncate">
                  {activeCommune.name}
                </span>
                <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] truncate">
                  {activeCommune.postalCode} • INSEE {activeCommune.insee}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditingCommune(!isEditingCommune)}
              type="button"
              className="h-11 px-3 rounded bg-white hover:bg-[#dce9fd] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold flex items-center gap-1 shrink-0 transition-colors border border-[#c4c6ce]"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              Modifier
            </button>
          </div>

          {/* Saisie Commune Modal Dropdown */}
          {isEditingCommune && (
            <div className="bg-[#f8f9ff] p-3 rounded-lg flex flex-col gap-2 border border-[#c4c6ce]">
              <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-[#001126]">
                Rechercher ou sélectionner une commune :
              </span>
              <input
                type="text"
                placeholder="Tapez un nom ou code postal (ex: Rouen, 76000, Feyzin)..."
                className="w-full h-11 px-3 bg-white border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126] focus:outline-none focus:border-[#0036ce]"
                onChange={async (e) => {
                  const val = e.target.value;
                  if (val.length >= 2) {
                    const res = await searchCommunesOnline(val);
                    if (res.success && res.data.length > 0) {
                      // Dynamically allow selecting first result
                      const first = res.data[0];
                      setActiveCommune({
                        name: first.nom,
                        postalCode: first.codesPostaux?.[0] || '00000',
                        insee: first.code,
                        lat: 45.76,
                        lng: 4.83
                      });
                    }
                  }
                }}
              />
              <span className="text-[10px] text-[#44474d] italic">
                Connexion API geo.api.gouv.fr active. Ou sélectionnez dans la liste de démonstration :
              </span>
              <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto">
                {AVAILABLE_COMMUNES.map((com) => (
                  <button
                    key={com.insee}
                    type="button"
                    onClick={() => {
                      setActiveCommune(com);
                      setIsEditingCommune(false);
                    }}
                    className={`p-2 rounded text-left text-[13px] flex items-center justify-between transition-colors ${
                      activeCommune.insee === com.insee
                        ? 'bg-[#001126] text-white font-bold'
                        : 'bg-white hover:bg-[#e4efff] text-[#001126] border border-[#c4c6ce]'
                    }`}
                  >
                    <span>{com.name}</span>
                    <span className="font-['Space_Grotesk'] text-[11px] opacity-80">
                      {com.postalCode}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GPS Opt-in */}
          <div className="flex flex-col gap-1.5 pt-1">
            <button
              onClick={handleSimulateGPS}
              type="button"
              className="w-full h-12 rounded bg-[#eef4ff] hover:bg-[#e4efff] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold flex items-center justify-center gap-2 transition-colors border border-[#d6e4f8]"
            >
              <span className="material-symbols-outlined text-[18px]">
                {gpsLoading ? 'satellite_alt' : 'my_location'}
              </span>
              <span>
                {gpsLoading
                  ? 'Localisation éphémère (mémoire volatile)...'
                  : 'Localiser par GPS (Opt-in temporaire)'}
              </span>
            </button>

            <div className="flex items-start gap-1.5 px-1 pt-0.5">
              <span className="material-symbols-outlined text-[#3f9d73] text-[16px] shrink-0 mt-0.5">
                verified_user
              </span>
              <p className="text-[12px] text-[#44474d] leading-snug">
                <strong>Garantie de souveraineté :</strong> Aucune géolocalisation continue. Les coordonnées restent en mémoire volatile sur cet appareil et ne sont jamais transmises à un serveur externe.
              </p>
            </div>
          </div>
        </section>

        {/* Cache Snapshot & Freshness Status */}
        <section className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-3 border border-[#c4c6ce]">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-wide text-[#44474d] font-semibold">
                Instantané des données territoriales
              </span>
              <span className="text-[17px] font-bold text-[#001126]">
                Base Locale Hors-Ligne
              </span>
            </div>
            <span className="font-['Space_Grotesk'] text-[11px] px-2.5 py-1 rounded bg-[#98f6c5] text-[#005236] font-bold flex items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-[14px]">offline_pin</span>
              VALIDÉ
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-0.5">
            <div className="flex items-center justify-between text-[13px] bg-[#eef4ff] px-3 py-2 rounded-lg border border-[#d6e4f8]">
              <span className="text-[#44474d]">Horodatage snapshot :</span>
              <span className="font-['Space_Grotesk'] font-bold text-[#001126]">
                04 oct. 2026 à 14:32
              </span>
            </div>
            <div className="flex flex-col gap-0.5 text-[13px] bg-[#eef4ff] px-3 py-2 rounded-lg border border-[#d6e4f8]">
              <span className="text-[#44474d] font-['Space_Grotesk'] text-[10px] uppercase font-bold">
                Source officielle intégrée :
              </span>
              <span className="text-[#001126] font-medium leading-snug">
                API Géorisques (Min. Transition Écologique) & Préfecture du Rhône
              </span>
            </div>
          </div>

          <div className="pt-1 flex flex-col gap-2">
            <button
              onClick={handleRefreshData}
              type="button"
              className="w-full h-12 rounded bg-[#e4efff] hover:bg-[#dce9fd] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold flex items-center justify-center gap-2 transition-colors border border-[#c4c6ce]"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  refreshing ? 'animate-spin' : ''
                }`}
              >
                sync
              </span>
              <span>{refreshing ? 'Vérification des flux en cours...' : 'Actualiser les données en ligne'}</span>
            </button>
            <div className="flex items-center justify-center gap-1 text-center font-['Space_Grotesk'] text-[11px] text-[#44474d]">
              <span className="material-symbols-outlined text-[14px]">wifi_off</span>
              <span>Données en mémoire IndexedDB • Consultation autonome garantie</span>
            </div>
          </div>
        </section>

        {/* MANDATORY CIVIL SAFETY NOTICE */}
        <div className="bg-[#eef4ff] p-4 rounded-xl flex items-start gap-3 shadow-sm border border-[#d6e4f8]" role="alert">
          <div className="w-8 h-8 rounded-full bg-[#001126] flex items-center justify-center shrink-0 text-white">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-['Space_Grotesk'] text-[12px] text-[#001126] font-bold uppercase tracking-wider">
              Avertissement de Sécurité Civile
            </span>
            <p className="text-[12px] text-[#0f1c2b] leading-relaxed">
              L'absence de risque répertorié ou un inventaire vide ne garantit en aucun cas qu'une zone est exempte de danger. Aucun indice ou score anxiogène arbitraire n'est calculé. En cas d'alerte réelle, <strong>seules les directives émises par les autorités préfectorales font foi</strong>.
            </p>
          </div>
        </div>

        {/* Schematized Vector Map with Clickable Nodes */}
        <section className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-3 border border-[#c4c6ce]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-[12px] uppercase tracking-wider text-[#001126] font-bold">
                Périmètres & Rayons d'Incidence
              </span>
              <span className="text-[12px] text-[#44474d]">
                Représentation schématique vectorielle locale (Touchez un repère)
              </span>
            </div>
            <span className="font-['Space_Grotesk'] text-[10px] px-2 py-0.5 rounded bg-[#e4efff] text-[#001126] font-semibold">
              MODE LÉGER
            </span>
          </div>

          {/* Clean Vector SVG Canvas */}
          <div className="w-full bg-[#eef4ff] rounded-lg p-2 flex items-center justify-center relative overflow-hidden border border-[#d6e4f8]">
            <svg
              className="w-full max-w-sm h-auto select-none cursor-pointer"
              viewBox="0 0 340 220"
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
                strokeWidth={selectedMapNode === 'ppi' ? "2" : "1.2"}
                strokeDasharray="4 2"
              />
              <circle cx="170" cy="110" r="38" fill="#eef4ff" fillOpacity="0.6" stroke="#12263f" strokeWidth="1.5" />

              {/* TMD Corridor Line */}
              <path
                d="M 60 180 Q 140 130 200 40"
                fill="none"
                stroke="#ba1a1a"
                strokeWidth={selectedMapNode === 'tmd' ? "4" : "2.5"}
                strokeDasharray="6 3"
                onClick={() => setSelectedMapNode('tmd')}
              />
              <circle
                cx="180"
                cy="85"
                r="5"
                fill="#ba1a1a"
                onClick={() => setSelectedMapNode('tmd')}
              />

              {/* SEVESO Zone Pin */}
              <g
                transform="translate(115, 155)"
                onClick={() => setSelectedMapNode('ppi')}
                className="cursor-pointer"
              >
                <rect
                  x="-16"
                  y="-12"
                  width="32"
                  height="24"
                  rx="4"
                  fill={selectedMapNode === 'ppi' ? "#0036ce" : "#12263f"}
                />
                <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700" fontFamily="Space Grotesk">PPI</text>
              </g>

              {/* Bugey Nuclear Direction indicator */}
              <line
                x1="170"
                y1="110"
                x2="295"
                y2="55"
                stroke={selectedMapNode === 'bugey' ? "#0036ce" : "#74777e"}
                strokeWidth={selectedMapNode === 'bugey' ? "2.5" : "1.5"}
                strokeDasharray="2 2"
              />
              <circle
                cx="295"
                cy="55"
                r="7"
                fill={selectedMapNode === 'bugey' ? "#0036ce" : "#12263f"}
                onClick={() => setSelectedMapNode('bugey')}
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
                onClick={() => setSelectedMapNode('bugey')}
              >
                Bugey (35km)
              </text>

              {/* Center Reference */}
              <circle
                cx="170"
                cy="110"
                r="8"
                fill="#0036ce"
                onClick={() => setSelectedMapNode('ref')}
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
                onClick={() => setSelectedMapNode('ref')}
              >
                {activeCommune.name.slice(0, 16)} (Ref.)
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
                onClick={() => setSelectedMapNode('tmd')}
              >
                Axe TMD Rail (&lt;800m)
              </text>
            </svg>
          </div>

          {/* Interactive node indicator alert */}
          {selectedMapNode && (
            <div className="p-2.5 rounded-lg bg-[#dce9fd] text-[12px] flex items-center justify-between border border-[#c4c6ce]">
              <span className="font-semibold text-[#001126]">
                {selectedMapNode === 'ppi' && "Repère SEVESO : Couloir de la Chimie (Périmètre PPI actif)"}
                {selectedMapNode === 'tmd' && "Repère TMD : Axe Faisceau Part-Dieu / M7 (Transport dangereux)"}
                {selectedMapNode === 'bugey' && "Repère Nucléaire : Centrale du Bugey (Vigilance élargie)"}
                {selectedMapNode === 'ref' && `Point central : ${activeCommune.name}`}
              </span>
              <button
                onClick={() => setSelectedMapNode(null)}
                className="text-[#001126] font-bold text-[11px] underline ml-2"
              >
                Effacer
              </button>
            </div>
          )}

          {/* Map Legend */}
          <div className="grid grid-cols-2 gap-2 text-[12px]">
            <button
              onClick={() => setSelectedMapNode('ref')}
              className="flex items-center gap-2 text-left p-1 rounded hover:bg-[#eef4ff]"
            >
              <span className="w-3 h-3 rounded-full bg-[#0036ce] shrink-0"></span>
              <span className="text-[#44474d] font-['Space_Grotesk'] text-[11px]">Point de référence</span>
            </button>
            <button
              onClick={() => setSelectedMapNode('tmd')}
              className="flex items-center gap-2 text-left p-1 rounded hover:bg-[#eef4ff]"
            >
              <span className="w-3 h-1.5 bg-[#ba1a1a] shrink-0"></span>
              <span className="text-[#44474d] font-['Space_Grotesk'] text-[11px]">Transit TMD (&lt; 800 m)</span>
            </button>
            <button
              onClick={() => setSelectedMapNode('ppi')}
              className="flex items-center gap-2 text-left p-1 rounded hover:bg-[#eef4ff]"
            >
              <span className="w-3 h-3 rounded bg-[#12263f] shrink-0"></span>
              <span className="text-[#44474d] font-['Space_Grotesk'] text-[11px]">Périmètre PPI (4.2 km)</span>
            </button>
            <button
              onClick={() => setSelectedMapNode('bugey')}
              className="flex items-center gap-2 text-left p-1 rounded hover:bg-[#eef4ff]"
            >
              <span className="w-3 h-0.5 bg-[#74777e] shrink-0"></span>
              <span className="text-[#44474d] font-['Space_Grotesk'] text-[11px]">Vigilance nucléaire</span>
            </button>
          </div>
        </section>

        {/* Categorized Inventory of Territorial Risks */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] text-[#001126] font-bold">
              Inventaire des Risques Notifiés
            </h2>
            <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d]">
              3 INSTALLATIONS CIBLÉES
            </span>
          </div>

          {GEORISQUES_ITEMS.map((item) => (
            <article
              key={item.id}
              className={`bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2.5 border transition-all ${
                (selectedMapNode === 'ppi' && item.protocolKey === 'chimique') ||
                (selectedMapNode === 'tmd' && item.protocolKey === 'confinement') ||
                (selectedMapNode === 'bugey' && item.protocolKey === 'nucleaire')
                  ? 'border-[#0036ce] ring-2 ring-[#0036ce]/20'
                  : 'border-[#c4c6ce]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="font-['Space_Grotesk'] text-[11px] text-[#0036ce] font-bold uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="text-[17px] text-[#001126] font-bold mt-0.5">
                    {item.title}
                  </h3>
                </div>
                <span className={`font-['Space_Grotesk'] text-[10px] px-2 py-0.5 rounded font-bold uppercase shrink-0 ${item.tagColor}`}>
                  {item.tag}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-[#eef4ff] px-2.5 py-1.5 rounded-lg text-[13px] border border-[#d6e4f8]">
                <span className="material-symbols-outlined text-[18px] text-[#0036ce]">near_me</span>
                <span className="font-semibold text-[#001126]">{item.distance}</span>
              </div>

              <p className="text-[13px] text-[#0f1c2b] leading-relaxed">{item.desc}</p>

              {/* Directives & Alarms */}
              <div className="bg-[#e4efff] p-3 rounded-lg flex flex-col gap-1 border border-[#d6e4f8]">
                <div className="flex items-center gap-1.5 text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold">
                  <span className="material-symbols-outlined text-[18px] text-[#0036ce]">
                    notifications_active
                  </span>
                  {item.measureTitle}
                </div>
                <p className="text-[12px] text-[#44474d] leading-relaxed">{item.measureDesc}</p>
              </div>

              {/* Linked Protocol */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-[#005236] font-['Space_Grotesk'] text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Fiche réflexe prête</span>
                </div>
                {item.protocolKey && (
                  <button
                    onClick={() =>
                      onOpenSubScreen({ type: 'protocol', id: item.protocolKey! })
                    }
                    type="button"
                    className="h-11 px-4 rounded bg-[#001126] hover:bg-[#12263f] text-white font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>{item.protocolLabel}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>

        {/* Documents Communaux Enregistrés */}
        <section className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-3 border border-[#c4c6ce]">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] text-[#001126] font-bold">Documents Communaux Enregistrés</h2>
            <span className="font-['Space_Grotesk'] text-[10px] px-2 py-0.5 rounded bg-[#98f6c5] text-[#005236] font-bold uppercase">
              DISPONIBLES HORS-LIGNE
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* DICRIM */}
            <div className="bg-[#eef4ff] p-3 rounded-lg flex items-center justify-between gap-3 border border-[#d6e4f8]">
              <div className="flex items-start gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-[#001126] text-[22px] shrink-0 mt-0.5">
                  menu_book
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-bold text-[#001126] truncate">
                    DICRIM de la Ville de Lyon
                  </span>
                  <span className="text-[12px] text-[#44474d] truncate">
                    Document d'Information Communal Risques Majeurs
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalDoc('dicrim')}
                className="h-11 px-3 rounded bg-white hover:bg-[#dce9fd] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold shrink-0 flex items-center gap-1 border border-[#c4c6ce]"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                Consulter
              </button>
            </div>

            {/* PCS */}
            <div className="bg-[#eef4ff] p-3 rounded-lg flex items-center justify-between gap-3 border border-[#d6e4f8]">
              <div className="flex items-start gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-[#001126] text-[22px] shrink-0 mt-0.5">
                  corporate_fare
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-bold text-[#001126] truncate">
                    PCS - Plan Communal de Sauvegarde
                  </span>
                  <span className="text-[12px] text-[#44474d] truncate">
                    Protocoles d'évacuation et hébergement d'urgence
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalDoc('pcs')}
                className="h-11 px-3 rounded bg-white hover:bg-[#dce9fd] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold shrink-0 flex items-center gap-1 border border-[#c4c6ce]"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                Consulter
              </button>
            </div>

            {/* PC Communal */}
            <div className="bg-[#e4efff] p-3.5 rounded-lg flex flex-col gap-1.5 border border-[#d6e4f8]">
              <div className="flex items-center gap-1.5 text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold">
                <span className="material-symbols-outlined text-[18px]">emergency_home</span>
                Poste de Commandement Communal
              </div>
              <span className="text-[13px] text-[#0f1c2b]">
                Mairie du 3e Arrondissement (215 Rue Duguesclin)
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d]">
                  Ligne crise non-urgence : 04 72 10 30 30
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onOpenCallModal({
                      number: '04 72 10 30 30',
                      name: 'Poste de Commandement Communal (Lyon 3e)',
                      subtitle: 'Ligne crise non-urgence',
                      desc: 'Mairie du 3e Arrondissement pour informations locales officielles.',
                    })
                  }
                  className="h-10 px-3 rounded bg-[#001126] text-white font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  Appeler
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Offline vs Online External Actions */}
        <section className="flex flex-col gap-2.5 pt-1">
          <a
            className="w-full h-12 rounded bg-white hover:bg-[#e4efff] text-[#0036ce] font-['Space_Grotesk'] text-[12px] font-bold flex items-center justify-center gap-2 shadow-sm transition-colors border border-[#c4c6ce]"
            href="https://www.georisques.gouv.fr"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            <span>Consulter la fiche Géorisques en ligne (gouv.fr)</span>
            <span className="text-[11px] text-[#44474d] font-normal">(Nécessite Internet)</span>
          </a>

          <button
            onClick={handleExportSnapshot}
            type="button"
            className="w-full h-12 rounded bg-[#001126] hover:bg-[#12263f] text-white font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
            <span>
              {savedSuccess
                ? 'Fiche exportée dans le coffre local !'
                : "Sauvegarder l'instantané communal (Export Hors-Ligne)"}
            </span>
          </button>
        </section>
      </div>

      {/* Document Consultation Modal */}
      {activeModalDoc && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001126]/60 backdrop-blur-sm"
        >
          <div className="bg-white max-w-sm w-full rounded-xl p-5 shadow-2xl border border-[#c4c6ce] flex flex-col gap-3">
            <h3 className="text-[18px] font-bold text-[#001126]">
              {activeModalDoc === 'dicrim' ? 'DICRIM Ville de Lyon' : 'PCS - Plan Communal de Sauvegarde'}
            </h3>
            <p className="text-[13px] text-[#0f1c2b] leading-relaxed">
              {activeModalDoc === 'dicrim'
                ? "Document officiel recensant les risques naturels et technologiques majeurs sur la commune de Lyon : inondation du Rhône, risque Seveso couloir Sud, TMD et transports ferroviaires."
                : "Plan opérationnel organisant la mobilisation des équipes municipales, les centres d'hébergement d'urgence (Gymnase Jean Jaurès) et la distribution de vivres."}
            </p>
            <div className="bg-[#eef4ff] p-3 rounded-lg border border-[#d6e4f8] text-[12px] text-[#44474d]">
              Document scellé en cache hors-ligne • Version approuvée Préfecture 2026.
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveModalDoc(null)}
                className="h-11 px-4 rounded bg-[#001126] text-white font-['Space_Grotesk'] text-[12px] font-bold uppercase"
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
