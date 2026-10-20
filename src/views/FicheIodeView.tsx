import React, { useState } from 'react';
import { Tooltip } from '../components/Tooltip';

interface FicheIodeViewProps {
  onBack: () => void;
}

interface DoseProfile {
  id: string;
  label: string;
  ageRange: string;
  tablets: string;
  mgKI: string;
  desc: string;
  recommendation: string;
  isWarning?: boolean;
}

const DOSES: DoseProfile[] = [
  {
    id: 'bebe',
    label: 'Nouveau-né (< 1 mois)',
    ageRange: 'Moins de 1 mois',
    tablets: '1/4 de comprimé',
    mgKI: '16,25 mg',
    desc: 'Broyer le quart de comprimé et le dissoudre dans quelques millilitres d’eau, de lait maternel ou de biberon. Ne jamais forcer.',
    recommendation: 'Priorité absolue : les nouveau-nés sont les plus sensibles à la fixation thyroïdienne radio-induite.'
  },
  {
    id: 'nourrisson',
    label: 'Nourrisson (1 mois à 3 ans)',
    ageRange: 'De 1 mois à 3 ans révolus',
    tablets: '1/2 comprimé',
    mgKI: '32,5 mg',
    desc: 'Dissoudre le demi-comprimé dans une petite cuillère avec de l’eau, du sirop ou de la compote.',
    recommendation: 'Très haute sensibilité de la glande thyroïde en croissance.'
  },
  {
    id: 'enfant',
    label: 'Enfant (3 ans à 12 ans)',
    ageRange: 'De 3 ans à 12 ans révolus',
    tablets: '1 comprimé entier',
    mgKI: '65 mg',
    desc: 'À avaler avec un grand verre d’eau ou à dissoudre si l’enfant a des difficultés de déglutition.',
    recommendation: 'Dose pédiatrique standard de référence.'
  },
  {
    id: 'ado_adulte',
    label: 'Adolescent (> 12 ans) & Adulte (jusqu’à 40 ans)',
    ageRange: 'De 12 à 40 ans',
    tablets: '2 comprimés entiers',
    mgKI: '130 mg',
    desc: 'Prendre les 2 comprimés en une seule prise unique avec un grand verre d’eau.',
    recommendation: 'Dose complète de saturation de la thyroïde pour adulte jeune.'
  },
  {
    id: 'enceinte',
    label: 'Femme enceinte ou allaitante',
    ageRange: 'Quel que soit le terme de la grossesse',
    tablets: '2 comprimés entiers',
    mgKI: '130 mg',
    desc: 'La prise protège simultanément la mère et le fœtus ou le nouveau-né allaité. Prise unique.',
    recommendation: 'Priorité absolue : la thyroïde fœtale concentre avidement l’iode dès la 10e-12e semaine de grossesse.'
  },
  {
    id: 'senior',
    label: 'Adulte de plus de 40 ans',
    ageRange: 'Plus de 40 ans',
    tablets: 'Prise NON recommandée',
    mgKI: '0 mg',
    desc: 'Le risque de cancer thyroïdien radio-induit devient quasi nul après 40 ans, alors que le risque d’effets indésirables cardiaques sévères et d’hyperthyroïdie aiguë est nettement accru.',
    recommendation: 'La prise d’iode ne doit être envisagée chez les plus de 40 ans que sur consigne médicale formelle et explicite en cas d’exposition radiologique extrême.',
    isWarning: true
  }
];

export const FicheIodeView: React.FC<FicheIodeViewProps> = ({ onBack }) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>('ado_adulte');
  const [activeTab, setActiveTab] = useState<'posologie' | 'timing' | 'contre_indications' | 'faux_remedes'>('posologie');

  const selectedDose = DOSES.find((d) => d.id === selectedProfileId) || DOSES[3];

  return (
    <div className="flex flex-col w-full pt-20 pb-28 min-h-screen max-w-xl mx-auto px-4 gap-4">
      {/* Sentinel bar */}
      <div className="w-full bg-[#12263f] text-[#d4e3ff] py-2 px-3 rounded-lg flex items-center justify-between border border-[#001126]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[18px] text-[#98f6c5]">medication</span>
          <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider truncate">
            Fiche Iode Stable (KI 65mg) • ASN / IRSN / Ministère de la Santé
          </span>
        </div>
        <span className="font-['Space_Grotesk'] text-[10px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-bold uppercase">
          DOCTRINE ÉTAT
        </span>
      </div>

      {/* Return button */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          type="button"
          className="h-12 px-3 bg-[#dce9fd] hover:bg-[#d6e4f8] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold rounded flex items-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>RETOUR</span>
        </button>
        <span className="font-['Space_Grotesk'] text-[11px] bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded font-bold uppercase border border-[#ffb4ab]">
          ORDRE PRÉFECTORAL REQUIS
        </span>
      </div>

      {/* Header title */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-['Space_Grotesk'] text-[11px] px-2 py-0.5 rounded bg-[#001126] text-white font-bold uppercase">
            RISQUE NUCLÉAIRE & RADIOLOGIQUE
          </span>
        </div>
        <h1 className="text-[24px] text-[#001126] font-bold tracking-tight">
          Prise d'Iode Stable (Iodure de Potassium)
        </h1>
        <p className="text-[13px] text-[#44474d] leading-relaxed">
          Guide officiel de posologie, fenêtres temporelles et contre-indications certifiées par l'Autorité de Sûreté Nucléaire (ASN) et l'IRSN.
        </p>
      </header>

      {/* Avertissement Vital Permanent (Priorité 1) */}
      <section
        role="alert"
        className="bg-[#ffdad6] text-[#93000a] p-4 rounded-xl border-2 border-[#ba1a1a] shadow-md flex flex-col gap-2.5"
      >
        <div className="flex items-start gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">priority_high</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-wider font-bold text-[#ba1a1a]">
              Avertissement Médical et Doctrinal Majeur (Priorité 1)
            </span>
            <div className="flex items-center gap-1.5">
              <h2 className="text-[16px] font-bold text-[#93000a] leading-tight">
                NE JAMAIS PRENDRE D'IODE À TITRE PRÉVENTIF SANS ORDRE FORMEL DU PRÉFET
              </h2>
              <Tooltip
                title="Consigne ASN & Ministère de la Santé"
                content="L'ingestion d'iode stable n'a d'utilité que pendant une fenêtre précise (1 à 2 heures avant le passage du panache ou dans les premières heures). Pris trop tôt, il est éliminé avant l'arrivée du nuage ; pris trop tard, il est inutile."
              />
            </div>
          </div>
        </div>

        <p className="text-[13px] font-medium leading-relaxed">
          <strong>Contre-indication stricte :</strong> Toute prise préventive non prescrite par les consignes officielles applicables est <strong>inutile et dangereuse</strong> (troubles cardiaques, dérèglement thyroïdien aigu). L'iode stable ne protège <strong>STRICTEMENT PAS</strong> contre les irradiations externes, ni contre aucun accident chimique ou biologique.
        </p>

        <p className="text-[12px] leading-relaxed">
          La prise d'iodure de potassium ne doit intervenir <strong>QUE sur ordre préfectoral formel</strong>, diffusé au moment opportun par :
        </p>

        <div className="grid grid-cols-2 gap-2 text-[12px] font-bold">
          <div className="bg-white/90 p-2.5 rounded-lg border border-[#ffb4ab] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a]">radio</span>
            <span>Radio France Bleu / Inter</span>
          </div>
          <div className="bg-white/90 p-2.5 rounded-lg border border-[#ffb4ab] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a]">notifications_active</span>
            <span>Notification FR-Alert</span>
          </div>
        </div>
      </section>

      {/* Onglets de navigation dans la fiche iode */}
      <div className="grid grid-cols-4 gap-1 bg-[#eef4ff] p-1 rounded-xl border border-[#d6e4f8]">
        <button
          type="button"
          onClick={() => setActiveTab('posologie')}
          className={`py-2 px-1 rounded-lg text-center font-['Space_Grotesk'] text-[11px] font-bold transition-all ${
            activeTab === 'posologie'
              ? 'bg-[#001126] text-white shadow-sm'
              : 'text-[#001126] hover:bg-white/60'
          }`}
        >
          Posologie
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('timing')}
          className={`py-2 px-1 rounded-lg text-center font-['Space_Grotesk'] text-[11px] font-bold transition-all ${
            activeTab === 'timing'
              ? 'bg-[#001126] text-white shadow-sm'
              : 'text-[#001126] hover:bg-white/60'
          }`}
        >
          Timing (Fenêtre)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('contre_indications')}
          className={`py-2 px-1 rounded-lg text-center font-['Space_Grotesk'] text-[11px] font-bold transition-all ${
            activeTab === 'contre_indications'
              ? 'bg-[#001126] text-white shadow-sm'
              : 'text-[#001126] hover:bg-white/60'
          }`}
        >
          Contre-Indic.
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('faux_remedes')}
          className={`py-2 px-1 rounded-lg text-center font-['Space_Grotesk'] text-[11px] font-bold transition-all ${
            activeTab === 'faux_remedes'
              ? 'bg-[#ba1a1a] text-white shadow-sm'
              : 'text-[#ba1a1a] hover:bg-white/60'
          }`}
        >
          ⚠️ Faux Remèdes
        </button>
      </div>

      {/* Contenu Onglet 1 : Posologie */}
      {activeTab === 'posologie' && (
        <>
          {/* Ce que l'iode protège / ne protège PAS */}
          <section className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col gap-3">
            <h2 className="text-[16px] font-bold text-[#001126] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0036ce]">shield</span>
              <span>Mécanisme et Limites de Protection</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="p-3 bg-[#eef4ff] rounded-lg border border-[#d6e4f8] flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[#005236]">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span className="font-['Space_Grotesk'] text-[12px] uppercase font-bold text-[#001126]">
                    Ce que l'iode protège
                  </span>
                </div>
                <p className="text-[12px] text-[#0f1c2b] leading-relaxed">
                  Il sature la glande thyroïde en iode sain pour empêcher la fixation de l’iode radioactif (I-131) inhalé ou ingéré, prévenant ainsi les cancers thyroïdiens.
                </p>
              </div>

              <div className="p-3 bg-[#ffdad6]/40 rounded-lg border border-[#ffdad6] flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[#ba1a1a]">
                  <span className="material-symbols-outlined text-[20px]">cancel</span>
                  <span className="font-['Space_Grotesk'] text-[12px] uppercase font-bold text-[#93000a]">
                    Ce que l'iode NE protège PAS
                  </span>
                </div>
                <p className="text-[12px] text-[#0f1c2b] leading-relaxed">
                  Il ne protège <strong>PAS</strong> contre l'irradiation globale externe (gamma/bêta), ni contre les autres radionucléides (Césium 137, Strontium 90). <strong>Seul le confinement dans un bâtiment solide en dur protège contre ces rayonnements.</strong>
                </p>
              </div>
            </div>
          </section>

          {/* Calculateur de Posologie Interactif */}
          <section className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#001126] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0036ce]">calculate</span>
                <span>Calculateur Posologique Officiel</span>
              </h2>
              <span className="font-['Space_Grotesk'] text-[11px] bg-[#eef4ff] text-[#0036ce] px-2 py-0.5 rounded font-bold uppercase">
                Comprimés KI 65 mg sécables
              </span>
            </div>

            {/* Avertissement formel de subordination de la décision */}
            <div className="p-3 bg-[#fff0ed] rounded-lg border-2 border-[#ba1a1a] text-[#93000a] text-[11px] flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#ba1a1a] shrink-0 mt-0.5">notification_important</span>
              <div className="flex flex-col gap-0.5 leading-snug">
                <strong className="uppercase font-bold tracking-wide">
                  Subordination Stricte à l'Ordre Préfectoral
                </strong>
                <p>
                  Ce tableau récapitule les doses fixées par l'ANSM (Notice RCP de l'Iodure de Potassium 65 mg PCA, AMM 34009 360 847 8 7) à titre purement informatif. <strong>La prise dépend exclusivement des instructions diffusées en temps réel par les autorités</strong> (Préfet de département via FR-Alert et Radio France) et <strong>ne doit en aucun cas être décidée à partir de ce seul tableau</strong>.
                </p>
              </div>
            </div>

            <p className="text-[13px] text-[#44474d]">
              Sélectionnez la tranche d'âge ou le profil pour consulter la posologie théorique de l'AMM :
            </p>

            <div className="grid grid-cols-2 gap-1.5">
              {DOSES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedProfileId(d.id)}
                  type="button"
                  className={`p-2.5 rounded-lg text-left transition-all border ${
                    selectedProfileId === d.id
                      ? 'bg-[#001126] text-white border-[#001126] shadow-sm'
                      : 'bg-[#eef4ff] hover:bg-[#e4efff] text-[#001126] border-[#d6e4f8]'
                  }`}
                >
                  <span className="font-['Space_Grotesk'] text-[11px] block font-bold leading-tight">
                    {d.label}
                  </span>
                  <span className={`text-[10px] block mt-0.5 ${selectedProfileId === d.id ? 'text-[#98f6c5]' : 'text-[#44474d]'}`}>
                    {d.ageRange}
                  </span>
                </button>
              ))}
            </div>

            {/* Fiche posologique détaillée du profil sélectionné */}
            <div className={`p-4 rounded-xl border flex flex-col gap-2.5 ${
              selectedDose.isWarning
                ? 'bg-[#fff0ed] border-[#ffdad6] text-[#93000a]'
                : 'bg-[#f0f8ff] border-[#0036ce] text-[#001126]'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-['Space_Grotesk'] text-[12px] uppercase font-bold tracking-wider">
                  {selectedDose.label}
                </span>
                <span className="font-['Space_Grotesk'] text-[11px] px-2 py-0.5 rounded bg-white font-bold border border-current">
                  {selectedDose.ageRange}
                </span>
              </div>

              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-[#c4c6ce]">
                <div className="w-12 h-12 rounded-lg bg-[#001126] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px] text-[#98f6c5]">
                    {selectedDose.isWarning ? 'block' : 'medication'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-semibold text-[#44474d]">Dose théorique AMM :</span>
                  <span className="font-['Space_Grotesk'] text-[20px] font-bold text-[#001126] leading-none">
                    {selectedDose.tablets}
                  </span>
                  <span className="text-[11px] font-medium text-[#0036ce]">
                    Équivalent KI : {selectedDose.mgKI}
                  </span>
                </div>
              </div>

              <div className="text-[12px] leading-relaxed">
                <strong>Mode d'administration :</strong> {selectedDose.desc}
              </div>

              <div className="text-[11px] p-2 bg-white/80 rounded border border-current font-medium">
                💡 <strong>Référence officielle ANSM / ASNR :</strong> {selectedDose.recommendation}
              </div>

              <div className="text-[10px] text-[#555962] italic pt-1 border-t border-current/20">
                Source : Notice légale ANSM - Pharmacie Centrale des Armées (AMM 34009 360 847 8 7). L'ingestion réelle reste obligatoirement conditionnée à l'ordre formel du Préfet.
              </div>
            </div>
          </section>
        </>
      )}

      {/* Contenu Onglet 2 : Timing & Fenêtre d'Efficacité */}
      {activeTab === 'timing' && (
        <section className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0036ce] text-[22px]">timer</span>
            <h2 className="text-[16px] font-bold text-[#001126]">Fenêtre Temporelle d'Efficacité</h2>
          </div>

          <p className="text-[13px] text-[#44474d] leading-relaxed">
            La saturation de la glande thyroïde doit être synchronisée avec le passage du panache radioactif :
          </p>

          <div className="flex flex-col gap-2">
            <div className="p-3 bg-[#eef4ff] rounded-lg border border-[#98f6c5] flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#005236] text-[22px] shrink-0">verified</span>
              <div className="text-[12px] text-[#001126]">
                <strong className="text-[#005236] block">Fenêtre Idéale : 1h à 2h AVANT le panache</strong>
                Efficacité de protection proche de 100%. La thyroïde est complètement saturée au moment où l'iode 131 arrive dans l'air.
              </div>
            </div>

            <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#c4c6ce] flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#0036ce] text-[22px] shrink-0">schedule</span>
              <div className="text-[12px] text-[#001126]">
                <strong className="text-[#0036ce] block">Prise à l'arrivée ou dans les premières heures</strong>
                Protection résiduelle estimée à ~80% après 2 heures, et ~50% après 6 heures. Reste bénéfique si ordonné par le Préfet.
              </div>
            </div>

            <div className="p-3 bg-[#fff0ed] rounded-lg border border-[#ffdad6] flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[22px] shrink-0">cancel</span>
              <div className="text-[12px] text-[#93000a]">
                <strong className="block">Inutile après 24 heures d'exposition</strong>
                L'iode radioactif a déjà été fixé par la thyroïde. Prendre des comprimés d'iode tardivement n'apporte plus aucun bénéfice et expose inutilement aux effets indésirables.
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#d6e4f8] text-[11px] text-[#0036ce]">
            ⏱️ <strong>Durée de saturation :</strong> Une prise unique protège la thyroïde pendant environ 24 heures. Une deuxième prise ne doit se faire <em>que</em> sur ordre préfectoral formel si les rejets persistent.
          </div>
        </section>
      )}

      {/* Contenu Onglet 3 : Contre-indications */}
      {activeTab === 'contre_indications' && (
        <section className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[22px]">medical_information</span>
            <h2 className="text-[16px] font-bold text-[#001126]">Contre-Indications Médicales Officielles</h2>
          </div>

          <p className="text-[13px] text-[#44474d] leading-relaxed">
            Bien que très bien toléré dans l'immense majorité de la population, l'iodure de potassium présente des contre-indications strictes définies par l'ANSM :
          </p>

          <div className="flex flex-col gap-2 text-[12px]">
            <div className="p-3 bg-[#fff0ed] rounded-lg border border-[#ffdad6] text-[#93000a] flex flex-col gap-1">
              <strong className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                1. Allergie avérée à l'iode ou excipients
              </strong>
              <p className="text-[11px] text-[#44474d]">
                Antécédent de choc anaphylactique ou de réaction cutanée sévère lors d'une prise antérieure d'iodure de potassium (attention : l'allergie aux produits de contraste radiologiques n'est généralement pas une allergie à l'iode lui-même, demandez avis médical préalable).
              </p>
            </div>

            <div className="p-3 bg-[#fff0ed] rounded-lg border border-[#ffdad6] text-[#93000a] flex flex-col gap-1">
              <strong className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                2. Maladies thyroïdiennes actives graves
              </strong>
              <p className="text-[11px] text-[#44474d]">
                Hyperthyroïdie non équilibrée, adénome toxique autonome, maladie de Basedow active : risque d'emballement thyroïdien aigu (crise thyréotoxique).
              </p>
            </div>

            <div className="p-3 bg-[#fff0ed] rounded-lg border border-[#ffdad6] text-[#93000a] flex flex-col gap-1">
              <strong className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                3. Maladies auto-immunes rares cutanées
              </strong>
              <p className="text-[11px] text-[#44474d]">
                Dermatite herpétiforme de Duhring-Brocq ou vascularite hypocomplémentémique.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Contenu Onglet 4 : Faux remèdes & Dangers mortels */}
      {activeTab === 'faux_remedes' && (
        <section className="bg-[#fff0ed] p-4 rounded-xl shadow-sm border-2 border-[#ba1a1a] flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[24px]">dangerous</span>
            <h2 className="text-[16px] font-bold text-[#93000a]">Mise en Garde Formelle Contre les Fausses Pratiques</h2>
          </div>

          <p className="text-[13px] text-[#93000a] leading-relaxed">
            Lors d'accidents nucléaires, de nombreuses fausses informations circulent sur internet. Certaines pratiques sont létales :
          </p>

          <div className="flex flex-col gap-2.5 text-[12px]">
            <div className="p-3 bg-white rounded-lg border border-[#ffdad6] flex flex-col gap-1">
              <strong className="text-[#ba1a1a] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">block</span>
                NE BUVEZ JAMAIS DE BÉTADINE OU D'ANTISEPTIQUE IODÉ
              </strong>
              <p className="text-[#44474d] text-[11px] leading-relaxed">
                La Bétadine (povidone iodée) est un antiseptique à usage externe strict. Avalée, elle provoque des brûlures caustiques sévères de l'œsophage et de l'estomac, des défaillances rénales et des intoxications mortelles.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#ffdad6] flex flex-col gap-1">
              <strong className="text-[#ba1a1a] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">block</span>
                NE CONSOMMEZ PAS DE GRANDES QUANTITÉS DE SEL IODÉ
              </strong>
              <p className="text-[#44474d] text-[11px] leading-relaxed">
                La teneur en iode du sel de cuisine est infime. Pour atteindre la dose d'un comprimé de KI 65mg, il faudrait ingérer plus de 5 kg de sel en une fois, ce qui provoque un arrêt cardiaque ou un œdème cérébral mortel par hypernatrémie.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#ffdad6] flex flex-col gap-1">
              <strong className="text-[#ba1a1a] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">block</span>
                NE PRENEZ PAS D'IODE CONTRE LES RISQUES CHIMIQUES OU BIOLOGIQUES
              </strong>
              <p className="text-[#44474d] text-[11px] leading-relaxed">
                L'iode n'offre strictement aucun effet contre les gaz toxiques (chlore, ammoniac, sarin) ni contre les bactéries ou virus.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Clause Institutionnelle ASN */}
      <footer className="p-3 bg-[#eef4ff] rounded-xl border border-[#d6e4f8] text-[11px] text-[#44474d] leading-relaxed">
        <strong>Source doctrinale :</strong> Circulaire interministérielle relative à la distribution d'iode stable, Autorité de Sûreté Nucléaire (ASN), IRSN et Santé Publique France. En situation réelle, les directives de la Préfecture prévalent sur tout document.
      </footer>
    </div>
  );
};
