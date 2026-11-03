import React, { useState } from 'react';
import { triggerHaptic } from '../utils/haptics';
import { useTranslation } from '../i18n/I18nContext';

interface EmergencyReflexModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProtocol?: (protocolId: string) => void;
}

type CountryCode = 'FR' | 'CH' | 'BE' | 'LU';

interface EmergencyNumber {
  number: string;
  label: string;
  labelEn: string;
  sublabel: string;
  sublabelEn: string;
  isPrimary?: boolean;
}

const COUNTRY_EMERGENCY_DATA: Record<CountryCode, {
  name: string;
  nameEn: string;
  flag: string;
  numbers: EmergencyNumber[];
  sirenType: string;
  sirenTypeEn: string;
}> = {
  FR: {
    name: 'France',
    nameEn: 'France',
    flag: '🇫🇷',
    sirenType: 'RNA : 3 cycles de 1 min 41 s (son montant et descendant) + FR-Alert',
    sirenTypeEn: 'RNA : 3 cycles of 1 min 41 s (rising & falling pitch) + FR-Alert',
    numbers: [
      { number: '112', label: '112 - Urgences Européennes', labelEn: '112 - European Emergency', sublabel: 'Accessible gratuitement depuis tout terminal', sublabelEn: 'Toll-free from any mobile or landline', isPrimary: true },
      { number: '18', label: '18 - Sapeurs-Pompiers', labelEn: '18 - Fire & CBRN Rescue (Pompiers)', sublabel: 'Incendies, secours à personnes et interventions NRBC (CMIC)', sublabelEn: 'Fire, Hazmat & CBRN decontamination response' },
      { number: '15', label: '15 - SAMU Médical', labelEn: '15 - Emergency Medical Services (SAMU)', sublabel: 'Urgences vitales, détresse respiratoire ou intoxications graves', sublabelEn: 'Critical medical dispatch & toxicological triage' },
      { number: '17', label: '17 - Police / Gendarmerie', labelEn: '17 - Police & Gendarmerie', sublabel: 'Périmètres de bouclage et évacuations ordonnées', sublabelEn: 'Cordon enforcement & directed evacuations' },
      { number: '114', label: '114 - SMS Urgence Sourds', labelEn: '114 - Silent SMS Emergency for Deaf', sublabel: 'Canal silencieux par SMS / application', sublabelEn: 'Silent channel via SMS or emergency app' }
    ]
  },
  CH: {
    name: 'Suisse (Romandie)',
    nameEn: 'Switzerland (Romandy)',
    flag: '🇨🇭',
    sirenType: 'Alarme générale : son oscillant continu 1 minute + Alertswiss',
    sirenTypeEn: 'General alarm: continuous oscillating tone for 1 minute + Alertswiss',
    numbers: [
      { number: '112', label: '112 - Urgence Générale', labelEn: '112 - Universal European Emergency', sublabel: 'Numéro d’urgence européen utilisable en Suisse', sublabelEn: 'Universal emergency line valid in Switzerland', isPrimary: true },
      { number: '144', label: '144 - Urgences Santé / Ambulances', labelEn: '144 - Medical Emergency & Ambulances', sublabel: 'Secours médicaux et réanimation cantonale', sublabelEn: 'Cantonal medical response & emergency resuscitation' },
      { number: '118', label: '118 - Sapeurs-Pompiers', labelEn: '118 - Fire & Chemical Rescue', sublabel: 'Protection civile, sauvetage et risques chimiques', sublabelEn: 'Civil protection, Hazmat & industrial mitigation' },
      { number: '117', label: '117 - Police Cantonale', labelEn: '117 - Cantonal Police', sublabel: 'Sécurité et ordre public', sublabelEn: 'Public safety & security' },
      { number: '145', label: '145 - Tox Info Suisse', labelEn: '145 - Swiss National Poison Center', sublabel: 'Conseil médical toxicologique H24 (intoxications aiguës)', sublabelEn: '24/7 toxicological guidance (acute poisonings)' }
    ]
  },
  BE: {
    name: 'Belgique (Wallonie / Bxl)',
    nameEn: 'Belgium (Wallonia / Brussels)',
    flag: '🇧🇪',
    sirenType: 'Sirènes d’alerte électronique (son modulé) + BE-Alert',
    sirenTypeEn: 'Electronic alert sirens (modulated tone) + BE-Alert',
    numbers: [
      { number: '112', label: '112 - Pompiers & Ambulances', labelEn: '112 - Firefighters & Ambulances', sublabel: 'Centrale d’urgence secours d’État', sublabelEn: 'State emergency dispatch center', isPrimary: true },
      { number: '101', label: '101 - Police Fédérale', labelEn: '101 - Federal Police', sublabel: 'Interventions urgentes et secours policiers', sublabelEn: 'Urgent police response & perimeter control' },
      { number: '070245245', label: '070 245 245 - Centre Antipoisons', labelEn: '070 245 245 - Poison Center', sublabel: 'Urgences toxicologiques H24', sublabelEn: '24/7 acute toxicological emergencies' }
    ]
  },
  LU: {
    name: 'Luxembourg',
    nameEn: 'Luxembourg',
    flag: '🇱🇺',
    sirenType: 'Sirène nationale d’alarme (3 sons de 20s) + LU-Alert / GouvAlert',
    sirenTypeEn: 'National alarm siren (3 tones of 20s) + LU-Alert / GouvAlert',
    numbers: [
      { number: '112', label: '112 - Secours Médical & Pompiers (CGDIS)', labelEn: '112 - Medical Rescue & Firefighters (CGDIS)', sublabel: 'Corps grand-ducal d’incendie et de secours', sublabelEn: 'Grand-ducal fire and rescue corps', isPrimary: true },
      { number: '113', label: '113 - Police Grand-Ducale', labelEn: '113 - Grand-Ducal Police', sublabel: 'Permanence policière nationale', sublabelEn: 'National police duty line' }
    ]
  }
};

export const EmergencyReflexModal: React.FC<EmergencyReflexModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, language } = useTranslation();
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
                {t('reflex.modalTitle')}
              </h2>
              <p className="text-[11px] text-white/90 font-['Space_Grotesk'] font-medium">
                {t('reflex.modalSubtitle')}
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
            className={`flex-1 py-2.5 text-[12px] font-['Space_Grotesk'] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'reflexes'
                ? 'bg-[#ba1a1a] text-white'
                : 'text-[#dce9fd] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>{t('reflex.tabReflexes')}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('numbers');
            }}
            className={`flex-1 py-2.5 text-[12px] font-['Space_Grotesk'] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'numbers'
                ? 'bg-[#ba1a1a] text-white'
                : 'text-[#dce9fd] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>{t('reflex.tabNumbers')}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('message');
            }}
            className={`flex-1 py-2.5 text-[12px] font-['Space_Grotesk'] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'message'
                ? 'bg-[#ba1a1a] text-white'
                : 'text-[#dce9fd] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>{t('reflex.tabMessage')}</span>
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
                  <strong>{language === 'fr' ? 'Doctrine Officielle :' : 'Official Doctrine:'}</strong> {language === 'fr'
                    ? 'Les consignes diffusées par les autorités préfectorales et les services de secours (FR-Alert, radio, sirènes) priment TOUJOURS sur les guides pédagogiques.'
                    : 'Instructions broadcast by governmental civil defense authorities (Cell Broadcast, radio, sirens) ALWAYS supersede pedagogical guidelines.'}
                </div>
              </div>

              {/* Cas 1: Alerte Sirène / FR-Alert */}
              <div className="bg-[#12263f] p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center text-[12px] font-black">
                    1
                  </span>
                  <h3 className="text-[14px] font-bold text-white">
                    {t('reflex.case1Title')}
                  </h3>
                </div>
                <p className="text-[12px] text-[#dce9fd] pl-8 leading-relaxed">
                  {t('reflex.case1Points')}
                </p>
              </div>

              {/* Cas 2: Odeur suspecte / Nuage chimique */}
              <div className="bg-[#12263f] p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#f97316] text-white flex items-center justify-center text-[12px] font-black">
                    2
                  </span>
                  <h3 className="text-[14px] font-bold text-white">
                    {t('reflex.case2Title')}
                  </h3>
                </div>
                <p className="text-[12px] text-[#dce9fd] pl-8 leading-relaxed">
                  {t('reflex.case2Points')}
                </p>
              </div>

              {/* Cas 3: Alerte nucléaire / Iode */}
              <div className="bg-[#12263f] p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#a855f7] text-white flex items-center justify-center text-[12px] font-black">
                    3
                  </span>
                  <h3 className="text-[14px] font-bold text-white">
                    {t('reflex.case3Title')}
                  </h3>
                </div>
                <p className="text-[12px] text-[#dce9fd] pl-8 leading-relaxed">
                  {t('reflex.case3Points')}
                </p>
              </div>

              {/* Cas 4: Contamination corporelle */}
              <div className="bg-[#12263f] p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#06b6d4] text-white flex items-center justify-center text-[12px] font-black">
                    4
                  </span>
                  <h3 className="text-[14px] font-bold text-white">
                    {t('reflex.case4Title')}
                  </h3>
                </div>
                <p className="text-[12px] text-[#dce9fd] pl-8 leading-relaxed">
                  {t('reflex.case4Points')}
                </p>
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
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[12px] font-['Space_Grotesk'] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      selectedCountry === c
                        ? 'bg-[#ba1a1a] text-white'
                        : 'text-[#dce9fd] hover:text-white'
                    }`}
                  >
                    <span>{COUNTRY_EMERGENCY_DATA[c].flag}</span>
                    <span>{language === 'fr' ? COUNTRY_EMERGENCY_DATA[c].name.split(' ')[0] : COUNTRY_EMERGENCY_DATA[c].nameEn.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Signal d'alerte spécifique */}
              <div className="p-2.5 bg-[#12263f] rounded-xl border border-white/10 text-[11px] text-[#dce9fd] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#ff897d]">campaign</span>
                <span>{language === 'fr' ? COUNTRY_EMERGENCY_DATA[selectedCountry].sirenType : COUNTRY_EMERGENCY_DATA[selectedCountry].sirenTypeEn}</span>
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
                        {language === 'fr' ? item.label : item.labelEn}
                      </div>
                      <div className="text-[11px] text-[#dce9fd] leading-tight">
                        {language === 'fr' ? item.sublabel : item.sublabelEn}
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
                      <span>{language === 'fr' ? `Appeler ${item.number}` : `Call ${item.number}`}</span>
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
                  {t('reflex.messageScriptTitle')}
                </h3>
                <p className="text-[11px] text-[#a4a7ae]">
                  {language === 'fr'
                    ? 'Parlez calmement. Ne raccrochez JAMAIS le premier, attendez les instructions du régulateur.'
                    : 'Speak calmly. NEVER hang up first; wait for the dispatcher to terminate the call.'}
                </p>

                <div className="bg-[#001126] p-3 rounded-lg border border-white/10 space-y-2 text-[12px]">
                  <div>
                    <span className="text-[#ff897d] font-bold font-['Space_Grotesk']">
                      {t('reflex.scriptWho').split(':')[0]}:
                    </span>
                    <span className="text-white ml-1">
                      {t('reflex.scriptWho').split(':').slice(1).join(':')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#ff897d] font-bold font-['Space_Grotesk']">
                      {t('reflex.scriptWhere').split(':')[0]}:
                    </span>
                    <span className="text-white ml-1">
                      {t('reflex.scriptWhere').split(':').slice(1).join(':')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#ff897d] font-bold font-['Space_Grotesk']">
                      {t('reflex.scriptWhat').split(':')[0]}:
                    </span>
                    <span className="text-white ml-1">
                      {t('reflex.scriptWhat').split(':').slice(1).join(':')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#ff897d] font-bold font-['Space_Grotesk']">
                      {t('reflex.scriptHowMany').split(':')[0]}:
                    </span>
                    <span className="text-white ml-1">
                      {t('reflex.scriptHowMany').split(':').slice(1).join(':')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#ff897d] font-bold font-['Space_Grotesk']">
                      {t('reflex.scriptActions').split(':')[0]}:
                    </span>
                    <span className="text-white ml-1">
                      {t('reflex.scriptActions').split(':').slice(1).join(':')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#001833] border-t border-[#12263f] flex items-center justify-between">
          <span className="text-[10px] text-[#a4a7ae] font-['Space_Grotesk']">
            NRBCOR • {language === 'fr' ? 'Sécurité Civile Transfrontalière' : 'Cross-Border Civil Defense'}
          </span>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[12px] font-['Space_Grotesk'] font-bold transition-colors cursor-pointer"
          >
            {t('reflex.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
