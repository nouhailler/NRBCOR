import React from 'react';
import { TabType, SubScreen } from '../types';
import { Tooltip } from '../components/Tooltip';

interface HomeViewProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenSubScreen: (screen: SubScreen) => void;
  kitCompletionPercent?: number;
  canInstall?: boolean;
  onInstallClick?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateTab,
  onOpenSubScreen,
  kitCompletionPercent = 68,
  canInstall = false,
  onInstallClick,
}) => {
  return (
    <div className="flex flex-col w-full px-4 pt-24 pb-28 gap-4 max-w-xl mx-auto">
      {/* 1. Bannière de statut de disponibilité locale */}
      <section className="w-full bg-[#eef4ff] rounded-xl p-4 shadow-sm border border-[#d6e4f8]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#98f6c5] flex items-center justify-center shrink-0 mt-0.5">
            <span
              className="material-symbols-outlined text-[#005236] text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              cloud_done
            </span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5">
                <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-[#002c1b] bg-[#98f6c5]/60 px-2 py-0.5 rounded">
                  Mode local actif
                </span>
                <Tooltip
                  title="Architecture 100% Locale"
                  content="Les 4 fiches NRBC, le plan familial, la checklist et les guides de déshabillage sont enregistrés directement dans votre appareil. Aucun compte ni connexion nécessaires."
                />
              </div>
              <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] font-medium">
                PWA v1.2.0 (Oct. 2026)
              </span>
            </div>
            <p className="text-[13px] text-[#0f1c2b] leading-snug">
              100% des guides et données de secours disponibles sans connexion Internet.
            </p>
          </div>
        </div>
      </section>

      {/* Raccourci Installation PWA sur l'écran d'accueil pour utilisateurs novices */}
      {onInstallClick && (
        <section className="w-full bg-[#dee1ff] text-[#001258] rounded-xl p-3.5 shadow-sm border border-[#b9c3ff] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#001258] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">install_mobile</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wide truncate">
                Installer l'application
              </span>
              <span className="text-[11px] text-[#44474d] truncate">
                Ajoutez NRBCOR sur votre écran mobile ou bureau
              </span>
            </div>
          </div>
          <button
            onClick={onInstallClick}
            type="button"
            className="h-10 px-3.5 rounded-lg bg-[#001258] hover:bg-[#0024a8] text-white font-['Space_Grotesk'] text-[11px] font-bold uppercase shrink-0 transition-colors shadow-xs"
          >
            Installer
          </button>
        </section>
      )}

      {/* 2. Bloc prioritaire d'urgence 'RÉAGIR MAINTENANT' */}
      <section className="w-full bg-[#ffdad6] text-[#93000a] rounded-xl p-5 shadow-md relative overflow-hidden border border-[#ffb4ab]">
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ba1a1a] flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-white text-[24px]">
                  emergency
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[11px] tracking-wider uppercase font-bold text-[#ba1a1a]">
                  Priorité Vitale
                </span>
                <span className="text-[20px] font-bold text-[#93000a] leading-tight">
                  Urgence ou Alerte en cours ?
                </span>
              </div>
            </div>
            <span className="w-3 h-3 rounded-full bg-[#ba1a1a] animate-ping"></span>
          </div>

          <p className="text-[15px] text-[#93000a] font-medium leading-relaxed">
            Consignes immédiates sans connexion. Confinement, décontamination et gestes réflexes d'urgence.
          </p>

          <div className="flex flex-col gap-1.5 pt-1">
            <button
              onClick={() => onNavigateTab('reagir')}
              type="button"
              className="w-full min-h-[52px] bg-[#ba1a1a] hover:bg-[#93000a] active:scale-[0.99] text-white rounded-xl flex items-center justify-center gap-2 px-4 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[24px]">bolt</span>
              <span className="font-['Space_Grotesk'] text-[14px] tracking-wide uppercase font-bold text-center">
                Ouvrir le mode Réagir maintenant
              </span>
            </button>
            <div className="flex items-center justify-center gap-1.5 pt-1 text-center">
              <span className="material-symbols-outlined text-[16px] text-[#93000a]/80">info</span>
              <span className="text-[12px] text-[#93000a]/90 font-medium">
                Ne déclenche pas d'appel automatique aux secours
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Grille des 4 risques NRBC */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#001126] text-[20px]">shield</span>
            <h2 className="text-[18px] text-[#001126] font-bold">Protocoles NRBC</h2>
          </div>
          <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] font-medium">
            4 Risques Majeurs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Nucléaire */}
          <article className="bg-white rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3 border border-[#c4c6ce]">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#e4efff] flex items-center justify-center text-[#001126]">
                  <span className="material-symbols-outlined text-[22px]">blur_on</span>
                </div>
                <span className="font-['Space_Grotesk'] text-[11px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-semibold">
                  Hors ligne
                </span>
              </div>
              <h3 className="text-[17px] text-[#001126] font-bold mt-1">Nucléaire</h3>
              <p className="text-[13px] text-[#44474d] line-clamp-2">
                Accidents industriels, centrales et installations civiles.
              </p>
            </div>
            <button
              onClick={() => onOpenSubScreen({ type: 'protocol', id: 'nucleaire' })}
              type="button"
              className="min-h-[48px] w-full bg-[#e4efff] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold rounded-lg flex items-center justify-between px-3 hover:bg-[#dce9fd] transition-colors"
            >
              <span>Consulter les guides</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </article>

          {/* Radiologique */}
          <article className="bg-white rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3 border border-[#c4c6ce]">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#e4efff] flex items-center justify-center text-[#001126]">
                  <span className="material-symbols-outlined text-[22px]">radiology</span>
                </div>
                <span className="font-['Space_Grotesk'] text-[11px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-semibold">
                  Hors ligne
                </span>
              </div>
              <h3 className="text-[17px] text-[#001126] font-bold mt-1">Radiologique</h3>
              <p className="text-[13px] text-[#44474d] line-clamp-2">
                Sources orphelines, dispersion radiologique et irradiation.
              </p>
            </div>
            <button
              onClick={() => onOpenSubScreen({ type: 'protocol', id: 'nucleaire' })}
              type="button"
              className="min-h-[48px] w-full bg-[#e4efff] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold rounded-lg flex items-center justify-between px-3 hover:bg-[#dce9fd] transition-colors"
            >
              <span>Consulter les guides</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </article>

          {/* Biologique */}
          <article className="bg-white rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3 border border-[#c4c6ce]">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#e4efff] flex items-center justify-center text-[#001126]">
                  <span className="material-symbols-outlined text-[22px]">coronavirus</span>
                </div>
                <span className="font-['Space_Grotesk'] text-[11px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-semibold">
                  Hors ligne
                </span>
              </div>
              <h3 className="text-[17px] text-[#001126] font-bold mt-1">Biologique</h3>
              <p className="text-[13px] text-[#44474d] line-clamp-2">
                Agents pathogènes, épidémies et toxines biologiques.
              </p>
            </div>
            <button
              onClick={() => onOpenSubScreen({ type: 'protocol', id: 'bio' })}
              type="button"
              className="min-h-[48px] w-full bg-[#e4efff] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold rounded-lg flex items-center justify-between px-3 hover:bg-[#dce9fd] transition-colors"
            >
              <span>Consulter les guides</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </article>

          {/* Chimique */}
          <article className="bg-white rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3 border border-[#c4c6ce]">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#e4efff] flex items-center justify-center text-[#001126]">
                  <span className="material-symbols-outlined text-[22px]">science</span>
                </div>
                <span className="font-['Space_Grotesk'] text-[11px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-semibold">
                  Hors ligne
                </span>
              </div>
              <h3 className="text-[17px] text-[#001126] font-bold mt-1">Chimique</h3>
              <p className="text-[13px] text-[#44474d] line-clamp-2">
                Fuites toxiques d'usines, transports et produits industriels.
              </p>
            </div>
            <button
              onClick={() => onOpenSubScreen({ type: 'protocol', id: 'chimique' })}
              type="button"
              className="min-h-[48px] w-full bg-[#e4efff] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold rounded-lg flex items-center justify-between px-3 hover:bg-[#dce9fd] transition-colors"
            >
              <span>Consulter les guides</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </article>
        </div>
      </section>

      {/* Raccourcis Opérationnels Pas-à-Pas */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#001126] text-[20px]">bolt</span>
            <h2 className="text-[17px] text-[#001126] font-bold">Gestes & Procédures Pas-à-Pas</h2>
          </div>
          <span className="font-['Space_Grotesk'] text-[11px] bg-[#eef4ff] text-[#0036ce] px-2 py-0.5 rounded font-bold uppercase">
            IMMÉDIAT
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Déshabillage */}
          <button
            onClick={() => onOpenSubScreen({ type: 'deshabillage' })}
            type="button"
            className="p-3 bg-white rounded-xl shadow-sm border border-[#c4c6ce] hover:border-[#002c1b] text-left flex flex-col gap-1.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#002c1b] text-[#98f6c5] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">sanitizer</span>
            </div>
            <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] leading-snug group-hover:text-[#002c1b]">
              Déshabillage Décontamination
            </span>
            <span className="text-[11px] text-[#44474d] leading-tight">
              8 étapes sans dispersion & rinçage
            </span>
          </button>

          {/* Confinement Étanche */}
          <button
            onClick={() => onOpenSubScreen({ type: 'confinement-guide' })}
            type="button"
            className="p-3 bg-white rounded-xl shadow-sm border border-[#c4c6ce] hover:border-[#0036ce] text-left flex flex-col gap-1.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0036ce] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">meeting_room</span>
            </div>
            <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] leading-snug group-hover:text-[#0036ce]">
              Guide Confinement Étanche
            </span>
            <span className="text-[11px] text-[#44474d] leading-tight">
              Calfeutrage & calcul d'oxygène
            </span>
          </button>

          {/* Fiche Iode */}
          <button
            onClick={() => onOpenSubScreen({ type: 'iode' })}
            type="button"
            className="p-3 bg-white rounded-xl shadow-sm border border-[#c4c6ce] hover:border-[#ba1a1a] text-left flex flex-col gap-1.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">medication</span>
            </div>
            <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] leading-snug group-hover:text-[#ba1a1a]">
              Fiche Iode Stable
            </span>
            <span className="text-[11px] text-[#44474d] leading-tight">
              Calculateur de posologie KI
            </span>
          </button>

          {/* Sirène d'alerte RNA */}
          <button
            onClick={() => onOpenSubScreen({ type: 'siren-guide' })}
            type="button"
            className="p-3 bg-white rounded-xl shadow-sm border border-[#c4c6ce] hover:border-[#001126] text-left flex flex-col gap-1.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#12263f] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">campaign</span>
            </div>
            <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] leading-snug group-hover:text-[#001126]">
              Signaux d'Alerte RNA
            </span>
            <span className="text-[11px] text-[#44474d] leading-tight">
              Simulateur sonore & FR-Alert
            </span>
          </button>
        </div>
      </section>

      {/* 4. Carte Synthèse Kit d'urgence 72h */}
      <section className="w-full bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-[#c4c6ce]">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#dce9fd] flex items-center justify-center text-[#001126]">
              <span className="material-symbols-outlined text-[24px]">backpack</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-[18px] font-bold text-[#001126]">Kit d'urgence 72h</h2>
              <span className="text-[13px] text-[#44474d]">
                Autonomie minimale des premières heures
              </span>
            </div>
          </div>
          <span className="font-['Space_Grotesk'] text-[14px] font-bold text-[#0036ce] bg-[#eef4ff] px-2.5 py-1 rounded">
            {kitCompletionPercent}%
          </span>
        </div>

        {/* Jauge de progression */}
        <div className="flex flex-col gap-1.5">
          <div className="w-full h-3 bg-[#e4efff] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0036ce] rounded-full transition-all duration-300"
              style={{ width: `${kitCompletionPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[#44474d] font-['Space_Grotesk'] text-[11px]">
            <span>14 / 22 articles essentiels prêts</span>
            <span>Dernière vérification il y a 12 jours</span>
          </div>
        </div>

        {/* Items rapides aperçu */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <div className="flex items-center gap-1 bg-[#eef4ff] px-2 py-1.5 rounded-lg border border-[#d6e4f8]">
            <span
              className="material-symbols-outlined text-[16px] text-[#3f9d73]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span className="font-['Space_Grotesk'] text-[11px] truncate text-[#0f1c2b]">Eau (9L)</span>
          </div>
          <div className="flex items-center gap-1 bg-[#eef4ff] px-2 py-1.5 rounded-lg border border-[#d6e4f8]">
            <span
              className="material-symbols-outlined text-[16px] text-[#3f9d73]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span className="font-['Space_Grotesk'] text-[11px] truncate text-[#0f1c2b]">Radio pile</span>
          </div>
          <div className="flex items-center gap-1 bg-[#dce9fd] px-2 py-1.5 rounded-lg border border-[#c4c6ce]">
            <span className="material-symbols-outlined text-[16px] text-[#74777e]">
              radio_button_unchecked
            </span>
            <span className="font-['Space_Grotesk'] text-[11px] truncate text-[#44474d]">Filtres NRBC</span>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('preparation')}
          type="button"
          className="min-h-[48px] w-full bg-[#12263f] hover:bg-[#001126] text-white rounded-xl flex items-center justify-center gap-2 transition-colors font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider"
        >
          <span>Compléter mon kit</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </section>

      {/* 5. Carte Plan Familial */}
      <section className="w-full bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-[#c4c6ce]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#e4efff] flex items-center justify-center text-[#001126]">
              <span className="material-symbols-outlined text-[20px]">family_restroom</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-[18px] font-bold text-[#001126]">Plan Familial</h2>
              <span className="text-[13px] text-[#44474d]">Dispositif de rassemblement hors ligne</span>
            </div>
          </div>
          <span
            className="material-symbols-outlined text-[#3f9d73] text-[22px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
        </div>

        <div className="bg-[#eef4ff] rounded-lg p-3 flex flex-col gap-2 border border-[#d6e4f8]">
          <div className="flex items-center gap-2 text-[#0f1c2b]">
            <span className="material-symbols-outlined text-[18px] text-[#001126]">pin_drop</span>
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d]">Point de ralliement défini</span>
              <span className="text-[15px] font-bold text-[#001126]">Parc des Cèdres</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 pt-1 text-[#44474d] font-['Space_Grotesk'] text-[11px]">
            <span className="material-symbols-outlined text-[16px] text-[#0036ce]">contact_phone</span>
            <span>2 contacts d'urgence enregistrés en mémoire locale</span>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('mon-plan')}
          type="button"
          className="min-h-[48px] w-full bg-[#e4efff] hover:bg-[#dce9fd] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold uppercase rounded-lg flex items-center justify-center gap-1 transition-colors"
        >
          <span>Gérer les membres et le protocole</span>
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </section>

      {/* 6. Risques locaux & Géorisques */}
      <section className="w-full bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-[#c4c6ce]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#e4efff] flex items-center justify-center text-[#001126]">
              <span className="material-symbols-outlined text-[20px]">near_me</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-[18px] font-bold text-[#001126]">Risques locaux & Géorisques</h2>
              <span className="font-['Space_Grotesk'] text-[12px] font-semibold text-[#001126]">
                Commune : Lyon 3e
              </span>
            </div>
          </div>
          <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] bg-[#dce9fd] px-2 py-0.5 rounded">
            Cache 04/10/2026
          </span>
        </div>

        {/* Aperçu de la cartographie géorisque locale */}
        <div
          onClick={() => onOpenSubScreen({ type: 'georisques' })}
          className="w-full h-32 rounded-lg relative overflow-hidden bg-[#e4efff] shadow-inner cursor-pointer group border border-[#c4c6ce]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD4be-zzzr9iZWTNMjH0UnIb-D0VZXYXMqrhS6uEYAHmjfHy7urZFptFy0-fChD4zNX9zz8vaYirDq1LRZ2WJdmk17_MnflfbxMiUmsibD-ht7HWEw5Hv9GbRBP64ThtaAGI2RPG8_fx7sI9AHUUYTP2FZP6r4Bwwp6ga2OO_ibHOxelm2hp7J59TInll7PQtjRLM5e0oBE66sUOnm2eFiiClmtEXFarw8dchUrIXbod0U9WtM8fk0')`
            }}
          ></div>
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[#001126] font-['Space_Grotesk'] text-[11px] flex items-center gap-1.5 shadow-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-[#0036ce]"></span>
            <span>Zone Seveso seuil haut à 4.2 km</span>
          </div>
          <div className="absolute top-2 right-2 bg-[#001126]/80 text-white px-2 py-0.5 rounded text-[11px] font-['Space_Grotesk'] flex items-center gap-1">
            <span>Ouvrir la carte</span>
            <span className="material-symbols-outlined text-[14px]">open_in_full</span>
          </div>
        </div>

        <div className="bg-[#eef4ff] rounded-lg p-2.5 flex items-start gap-2 border border-[#d6e4f8]">
          <span className="material-symbols-outlined text-[#74777e] text-[18px] shrink-0 mt-0.5">policy</span>
          <p className="text-[12px] text-[#44474d] leading-snug">
            Mention de transparence : Aucun risque affiché ne garantit une zone exempte de danger. Consultez régulièrement les plans communaux de sauvegarde.
          </p>
        </div>
      </section>

      {/* Raccourcis Modules Complémentaires */}
      <section className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onOpenSubScreen({ type: 'formation' })}
          type="button"
          className="p-3 bg-white rounded-xl shadow-sm border border-[#c4c6ce] text-left hover:bg-[#eef4ff] transition-colors flex items-center gap-2 min-h-[52px]"
        >
          <span className="material-symbols-outlined text-[#0036ce] text-[24px]">school</span>
          <div className="min-w-0">
            <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] uppercase block truncate">
              Quiz & Entraînement
            </span>
            <span className="text-[11px] text-[#44474d]">Exercices civils</span>
          </div>
        </button>

        <button
          onClick={() => onOpenSubScreen({ type: 'tracabilite' })}
          type="button"
          className="p-3 bg-white rounded-xl shadow-sm border border-[#c4c6ce] text-left hover:bg-[#eef4ff] transition-colors flex items-center gap-2 min-h-[52px]"
        >
          <span className="material-symbols-outlined text-[#3f9d73] text-[24px]">verified_user</span>
          <div className="min-w-0">
            <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126] uppercase block truncate">
              Sources & Traçabilité
            </span>
            <span className="text-[11px] text-[#44474d]">Doctrines d'État</span>
          </div>
        </button>
      </section>

      {/* 7. Pied d'information institutionnelle */}
      <footer className="w-full bg-[#eef4ff] rounded-xl p-4 flex flex-col gap-3 text-[#44474d] border border-[#d6e4f8]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#001126]">
            <span className="material-symbols-outlined text-[18px]">account_balance</span>
            <span className="font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider">
              Portails Officiels & Références
            </span>
          </div>
          <p className="text-[13px] text-[#44474d]">
            Données d'instructions harmonisées d'après les directives de la Sécurité Civile et des agences de santé :
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 font-['Space_Grotesk'] text-[11px]">
          <a
            className="min-h-[48px] bg-white hover:bg-[#e4efff] rounded-lg p-2.5 flex items-center justify-between text-[#001126] border border-[#c4c6ce] font-medium transition-colors"
            href="https://www.gouvernement.fr/risques"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="truncate">Info.gouv.fr</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
          <a
            className="min-h-[48px] bg-white hover:bg-[#e4efff] rounded-lg p-2.5 flex items-center justify-between text-[#001126] border border-[#c4c6ce] font-medium transition-colors"
            href="https://www.interieur.gouv.fr"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="truncate">Min. Intérieur</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
          <a
            className="min-h-[48px] bg-white hover:bg-[#e4efff] rounded-lg p-2.5 flex items-center justify-between text-[#001126] border border-[#c4c6ce] font-medium transition-colors"
            href="https://www.asn.fr"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="truncate">ASNR Nucléaire</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
          <a
            className="min-h-[48px] bg-white hover:bg-[#e4efff] rounded-lg p-2.5 flex items-center justify-between text-[#001126] border border-[#c4c6ce] font-medium transition-colors"
            href="https://www.santepubliquefrance.fr"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="truncate">Santé Publique Fr.</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
        </div>

        {/* Avertissement FR-Alert */}
        <div className="p-3 bg-[#ffdad6]/60 rounded-lg flex items-start gap-2 border border-[#ffb4ab]">
          <span className="material-symbols-outlined text-[#ba1a1a] text-[18px] shrink-0 mt-0.5">
            notifications_off
          </span>
          <p className="text-[12px] text-[#0f1c2b] font-medium leading-snug">
            Rappel d'autorité : Cette application ne reçoit pas les alertes prioritaires FR-Alert transmises par diffusion cellulaire. En situation d'urgence réelle, fiez-vous au signal sonore national des sirènes (RNA) et aux canaux radio FM officiels (France Bleu, France Info).
          </p>
        </div>
      </footer>
    </div>
  );
};
