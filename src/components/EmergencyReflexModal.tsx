import React, { useState } from 'react';
import { triggerHaptic } from '../utils/haptics';

interface EmergencyReflexModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProtocol?: (protocolId: string) => void;
}

type CountryCode = 'FR' | 'CH' | 'BE' | 'LU';

interface EmergencyNumber {
  number: string;
  label: string;
  sublabel: string;
  isPrimary?: boolean;
}

const COUNTRY_EMERGENCY_DATA: Record<CountryCode, { name: string; flag: string; numbers: EmergencyNumber[]; sirenType: string }> = {
  FR: {
    name: 'France',
    flag: '🇫🇷',
    sirenType: 'RNA : 3 cycles de 1 min 41 s (son montant et descendant) + FR-Alert',
    numbers: [
      { number: '112', label: '112 - Urgences Européennes', sublabel: 'Accessible gratuitement depuis tout terminal', isPrimary: true },
      { number: '18', label: '18 - Sapeurs-Pompiers', sublabel: 'Incendies, secours à personnes et interventions NRBC (CMIC)' },
      { number: '15', label: '15 - SAMU Médical', sublabel: 'Urgences vitales, détresse respiratoire ou intoxications graves' },
      { number: '17', label: '17 - Police / Gendarmerie', sublabel: 'Périmètres de bouclage et évacuations ordonnées' },
      { number: '114', label: '114 - SMS Urgence Sourds', sublabel: 'Canal silencieux par SMS / application' }
    ]
  },
  CH: {
    name: 'Suisse (Romandie)',
    flag: '🇨🇭',
    sirenType: 'Alarme générale : son oscillant continu 1 minute + Alertswiss',
    numbers: [
      { number: '112', label: '112 - Urgence Générale', sublabel: 'Numéro d’urgence européen utilisable en Suisse', isPrimary: true },
      { number: '144', label: '144 - Urgences Santé / Ambulances', sublabel: 'Secours médicaux et réanimation cantonale' },
      { number: '118', label: '118 - Sapeurs-Pompiers', sublabel: 'Protection civile, sauvetage et risques chimiques' },
      { number: '117', label: '117 - Police Cantonale', sublabel: 'Sécurité et ordre public' },
      { number: '145', label: '145 - Tox Info Suisse', sublabel: 'Conseil médical toxicologique H24 (intoxications aiguës)' }
    ]
  },
  BE: {
    name: 'Belgique (Wallonie / Bxl)',
    flag: '🇧🇪',
    sirenType: 'Sirènes d’alerte électronique (son modulé) + BE-Alert',
    numbers: [
      { number: '112', label: '112 - Pompiers & Ambulances', sublabel: 'Centrale d’urgence secours d’État', isPrimary: true },
      { number: '101', label: '101 - Police Fédérale', sublabel: 'Interventions urgentes et secours policiers' },
      { number: '070245245', label: '070 245 245 - Centre Antipoisons', sublabel: 'Urgences toxicologiques H24' }
    ]
  },
  LU: {
    name: 'Luxembourg',
    flag: '🇱🇺',
    sirenType: 'Sirène nationale d’alarme (3 sons de 20s) + LU-Alert / GouvAlert',
    numbers: [
      { number: '112', label: '112 - Secours Médical & Pompiers (CGDIS)', sublabel: 'Corps grand-ducal d’incendie et de secours', isPrimary: true },
      { number: '113', label: '113 - Police Grand-Ducale', sublabel: 'Permanence policière nationale' }
    ]
  }
};

export const EmergencyReflexModal: React.FC<EmergencyReflexModalProps> = ({
  isOpen,
  onClose,
  onNavigateToProtocol
}) => {
  const [activeTab, setActiveTab] = useState<'reflexes' | 'numbers' | 'message'>('reflexes');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('FR');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#001126] text-white w-full max-w-xl max-h-[92vh] rounded-2xl flex flex-col shadow-2xl border-2 border-[#ba1a1a] overflow-hidden">
        {/* Header Urgence Haute Priorité */}
        <div className="bg-[#ba1a1a] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-white animate-pulse">
              emergency
            </span>
            <div>
              <h2 className="text-[17px] font-black uppercase tracking-wide text-white">
                Que faire maintenant ?
              </h2>
              <p className="text-[11px] text-white/90 font-['Space_Grotesk'] font-medium">
                Triage Réflexe 0-60 secondes • Conduite de Sécurité Civile
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navigation par Onglets */}
        <div className="flex border-b border-[#12263f] bg-[#001833]">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('reflexes');
            }}
            className={`flex-1 py-2.5 text-[12px] font-['Space_Grotesk'] font-bold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'reflexes'
                ? 'bg-[#ba1a1a] text-white'
                : 'text-[#dce9fd] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>4 Réflexes Vitaux</span>
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('numbers');
            }}
            className={`flex-1 py-2.5 text-[12px] font-['Space_Grotesk'] font-bold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'numbers'
                ? 'bg-[#ba1a1a] text-white'
                : 'text-[#dce9fd] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>Numéros d'Urgence</span>
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('message');
            }}
            className={`flex-1 py-2.5 text-[12px] font-['Space_Grotesk'] font-bold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'message'
                ? 'bg-[#ba1a1a] text-white'
                : 'text-[#dce9fd] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>Message Type aux Secours</span>
          </button>
        </div>

        {/* Contenu Défilant */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'reflexes' && (
            <div className="space-y-3">
              <div className="p-3 bg-[#ba1a1a]/20 border border-[#ba1a1a]/40 rounded-xl text-[12px] text-[#ffdad6] flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#ff897d] shrink-0 mt-0.5">
                  warning
                </span>
                <div>
                  <strong>Doctrine Officielle :</strong> Les consignes diffusées par les autorités préfectorales et les services de secours (FR-Alert, radio, sirènes) priment TOUJOURS sur les guides pédagogiques.
                </div>
              </div>

              {/* Cas 1: Alerte Sirène / FR-Alert */}
              <div className="bg-[#12263f] p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center text-[12px] font-black">
                    1
                  </span>
                  <h3 className="text-[14px] font-bold text-white">
                    J'entends la sirène ou j'ai reçu une alerte mobile
                  </h3>
                </div>
                <ul className="text-[12px] text-[#dce9fd] space-y-1.5 pl-8 list-disc">
                  <li><strong>Abri immédiat :</strong> Entrez dans le bâtiment en dur le plus proche. Ne restez JAMAIS dans un véhicule.</li>
                  <li><strong>Fermer et calfeutrer :</strong> Portes, fenêtres, bouches d'aération. Coupez impérativement VMC et climatisation.</li>
                  <li><strong>Écouter les médias :</strong> Allumez la radio FM/DAB+ sur le réseau public d'urgence (France Bleu 107.1 / RTS / RTBF).</li>
                  <li><strong>Ne saturez pas les réseaux :</strong> N'appelez les secours qu'en cas de danger vital avéré.</li>
                </ul>
              </div>

              {/* Cas 2: Odeur suspecte / Nuage chimique */}
              <div className="bg-[#12263f] p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#f97316] text-white flex items-center justify-center text-[12px] font-black">
                    2
                  </span>
                  <h3 className="text-[14px] font-bold text-white">
                    Odeur anormale, fumée dense ou picotements
                  </h3>
                </div>
                <ul className="text-[12px] text-[#dce9fd] space-y-1.5 pl-8 list-disc">
                  <li><strong>Dégagement perpendiculaire :</strong> Si vous êtes en extérieur, éloignez-vous perpendiculairement à la direction du vent.</li>
                  <li><strong>Protection respiratoire :</strong> Protégez nez et bouche avec un tissu humide sans frotter.</li>
                  <li><strong>Attention aux caves :</strong> Les gaz lourds (chlore, propane) s'accumulent au sol. Ne descendez JAMAIS en sous-sol en cas de fuite toxique industrielle.</li>
                </ul>
              </div>

              {/* Cas 3: Alerte nucléaire / Iode */}
              <div className="bg-[#12263f] p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#a855f7] text-white flex items-center justify-center text-[12px] font-black">
                    3
                  </span>
                  <h3 className="text-[14px] font-bold text-white">
                    Alerte nucléaire / Retombées radiologiques
                  </h3>
                </div>
                <ul className="text-[12px] text-[#dce9fd] space-y-1.5 pl-8 list-disc">
                  <li><strong>Confinement central :</strong> Restez au centre d'un bâtiment ou en sous-sol (les parois denses réduisent l'irradiation gamma).</li>
                  <li><strong>VERROU IODE :</strong> Ne prenez JAMAIS de comprimé d'iode stable sans ordre formel des autorités transmis à la radio.</li>
                  <li><strong>Aliments :</strong> Ne consommez aucun légume frais de jardin, ni eau de citerne ou de toiture.</li>
                </ul>
              </div>

              {/* Cas 4: Contamination corporelle */}
              <div className="bg-[#12263f] p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#06b6d4] text-white flex items-center justify-center text-[12px] font-black">
                    4
                  </span>
                  <h3 className="text-[14px] font-bold text-white">
                    Personne contaminée ou aspergée
                  </h3>
                </div>
                <ul className="text-[12px] text-[#dce9fd] space-y-1.5 pl-8 list-disc">
                  <li><strong>Déshabillage sans secouer :</strong> Retirez les vêtements de haut vers le bas (retire 80 à 90% des toxiques).</li>
                  <li><strong>NE PAS FROTTER :</strong> Tamponnez délicatement avec de l'eau tiède et du savon doux pour préserver la barrière cutanée.</li>
                  <li><strong>Double sac étanche :</strong> Enfermez les textiles souillés dans un sac poubelle hermétique à l'extérieur de la pièce de vie.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'numbers' && (
            <div className="space-y-3">
              {/* Sélecteur de pays */}
              <div className="flex items-center justify-between gap-1.5 bg-[#001833] p-1 rounded-xl">
                {(['FR', 'CH', 'BE', 'LU'] as CountryCode[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedCountry(c);
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[12px] font-['Space_Grotesk'] font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      selectedCountry === c
                        ? 'bg-[#ba1a1a] text-white'
                        : 'text-[#dce9fd] hover:text-white'
                    }`}
                  >
                    <span>{COUNTRY_EMERGENCY_DATA[c].flag}</span>
                    <span>{COUNTRY_EMERGENCY_DATA[c].name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Signal d'alerte spécifique */}
              <div className="p-2.5 bg-[#12263f] rounded-xl border border-white/10 text-[11px] text-[#dce9fd] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#ff897d]">campaign</span>
                <span>{COUNTRY_EMERGENCY_DATA[selectedCountry].sirenType}</span>
              </div>

              {/* Liste des numéros avec appel direct */}
              <div className="space-y-2">
                {COUNTRY_EMERGENCY_DATA[selectedCountry].numbers.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      item.isPrimary
                        ? 'bg-[#ba1a1a]/15 border-[#ba1a1a]'
                        : 'bg-[#12263f] border-white/10'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-[14px] font-extrabold text-white">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-[#dce9fd] leading-tight">
                        {item.sublabel}
                      </div>
                    </div>

                    <a
                      href={`tel:${item.number}`}
                      onClick={() => triggerHaptic('success')}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-lg font-['Space_Grotesk'] text-[12px] font-bold flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 ${
                        item.isPrimary
                          ? 'bg-[#ba1a1a] hover:bg-[#93000a] text-white shadow-md'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">call</span>
                      <span>Appeler {item.number}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'message' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-[#12263f] rounded-xl border border-white/10 text-[12px] text-[#dce9fd] space-y-2">
                <h3 className="font-bold text-white text-[13px] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ff897d] text-[18px]">record_voice_over</span>
                  Trame d'appel aux services de secours (112 / 18 / 15 / 144)
                </h3>
                <p className="text-[11px] text-[#a4a7ae]">
                  Parlez calmement. Ne raccrochez JAMAIS le premier, attendez les instructions du régulateur.
                </p>

                <div className="bg-[#001126] p-3 rounded-lg border border-white/10 space-y-2 text-[12px]">
                  <div>
                    <span className="text-[#ff897d] font-bold font-['Space_Grotesk']">1. QUI :</span>
                    <span className="text-white ml-1">Mon nom, prénom et mon numéro de téléphone de rappel.</span>
                  </div>
                  <div>
                    <span className="text-[#ff897d] font-bold font-['Space_Grotesk']">2. OÙ :</span>
                    <span className="text-white ml-1">Adresse exacte, commune, étage, points de repère visuels.</span>
                  </div>
                  <div>
                    <span className="text-[#ff897d] font-bold font-['Space_Grotesk']">3. QUOI :</span>
                    <span className="text-white ml-1">Nature de l'événement (odeur, nuage, explosion, alerte sirène).</span>
                  </div>
                  <div>
                    <span className="text-[#ff897d] font-bold font-['Space_Grotesk']">4. COMBIEN :</span>
                    <span className="text-white ml-1">Nombre d'occupants avec moi, symptômes constatés (toux, brûlures, nausées).</span>
                  </div>
                  <div>
                    <span className="text-[#ff897d] font-bold font-['Space_Grotesk']">5. ACTIONS RÉALISÉES :</span>
                    <span className="text-white ml-1">Confinement étanche en cours, VMC coupée, pas de prise d'iode non autorisée.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#001833] border-t border-[#12263f] flex items-center justify-between">
          <span className="text-[10px] text-[#a4a7ae] font-['Space_Grotesk']">
            NRBCOR • Sécurité Civile Transfrontalière
          </span>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[12px] font-['Space_Grotesk'] font-bold transition-colors cursor-pointer"
          >
            Fermer le guide réflexe
          </button>
        </div>
      </div>
    </div>
  );
};
