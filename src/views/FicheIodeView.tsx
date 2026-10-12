import React, { useState } from 'react';

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
    desc: 'Broyer le quart de comprimé et le dissoudre dans quelques millilitres d’eau, de lait maternel ou artificiel. Ne jamais forcer.',
    recommendation: 'Priorité absolue : les nouveau-nés sont les plus sensibles au risque radio-induit.'
  },
  {
    id: 'nourrisson',
    label: 'Nourrisson (1 mois à 3 ans)',
    ageRange: 'De 1 mois à 3 ans révolus',
    tablets: '1/2 comprimé',
    mgKI: '32,5 mg',
    desc: 'Dissoudre le demi-comprimé dans une petite cuillère avec de l’eau, du sirop ou de la compote de pommes.',
    recommendation: 'Très haute sensibilité thyroïdienne.'
  },
  {
    id: 'enfant',
    label: 'Enfant (3 ans à 12 ans)',
    ageRange: 'De 3 ans à 12 ans révolus',
    tablets: '1 comprimé entier',
    mgKI: '65 mg',
    desc: 'À avaler avec un grand verre d’eau ou à dissoudre si l’enfant a des difficultés de déglutition.',
    recommendation: 'Dose standard pédiatrique.'
  },
  {
    id: 'ado_adulte',
    label: 'Adolescent (> 12 ans) & Adulte (jusqu’à 40 ans)',
    ageRange: 'De 12 à 40 ans',
    tablets: '2 comprimés entiers',
    mgKI: '130 mg',
    desc: 'Prendre les 2 comprimés en une seule prise unique avec un grand verre d’eau.',
    recommendation: 'Dose complète de saturation thyroïdienne pour adulte jeune.'
  },
  {
    id: 'enceinte',
    label: 'Femme enceinte ou qui allaite',
    ageRange: 'Quel que soit le terme de la grossesse',
    tablets: '2 comprimés entiers',
    mgKI: '130 mg',
    desc: 'La prise protège simultanément la thyroïde de la mère et celle du fœtus / nouveau-né allaité.',
    recommendation: 'Prioritaire : la thyroïde fœtale concentre fortement l’iode dès la 10e-12e semaine de grossesse.'
  },
  {
    id: 'senior',
    label: 'Adulte de plus de 40 ans',
    ageRange: 'Plus de 40 ans',
    tablets: 'Prise NON recommandée',
    mgKI: '0 mg',
    desc: 'Le risque de cancer thyroïdien radio-induit est quasi nul après 40 ans, alors que le risque d’effets secondaires cardiaques et d’hyperthyroïdie est nettement plus élevé.',
    recommendation: 'La prise d’iode ne doit être envisagée chez les plus de 40 ans que sur consigne médicale explicite en cas de contamination radioactive extrême.',
    isWarning: true
  }
];

export const FicheIodeView: React.FC<FicheIodeViewProps> = ({ onBack }) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>('ado_adulte');

  const selectedDose = DOSES.find((d) => d.id === selectedProfileId) || DOSES[3];

  return (
    <div className="flex flex-col w-full pt-20 pb-28 min-h-screen max-w-xl mx-auto px-4 gap-4">
      {/* Sentinel bar */}
      <div className="w-full bg-[#12263f] text-[#d4e3ff] py-2 px-3 rounded-lg flex items-center justify-between border border-[#001126]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[18px] text-[#98f6c5]">medication</span>
          <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider truncate">
            Fiche Iode Stable (KI 65mg) • ASN / IRSN
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
          Guide officiel de posologie et de saturation thyroïdienne en cas d'accident sur une installation nucléaire civile ou militaire.
        </p>
      </header>

      {/* Avertissement Vital Permanent (Encadré Rouge Clignotant / Haute Priorité) */}
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
              Avertissement Sanitaire & Légal Majeur
            </span>
            <h2 className="text-[16px] font-bold text-[#93000a] leading-tight">
              NE PRENEZ JAMAIS D'IODE SANS ORDRE DU PRÉFET
            </h2>
          </div>
        </div>

        <p className="text-[13px] font-medium leading-relaxed">
          Une prise d’iode stable prématurée ou inutile est <strong>inefficace</strong> et peut être <strong>nocive</strong>. L’iode ne doit être absorbé que sur instruction explicite des autorités, diffusée par :
        </p>

        <div className="grid grid-cols-2 gap-2 text-[12px] font-bold">
          <div className="bg-white/80 p-2.5 rounded-lg border border-[#ffb4ab] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a]">radio</span>
            <span>Radio France Bleu / Inter</span>
          </div>
          <div className="bg-white/80 p-2.5 rounded-lg border border-[#ffb4ab] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a]">notifications_active</span>
            <span>Notification FR-Alert</span>
          </div>
        </div>
      </section>

      {/* Ce que l'iode protège / ne protège PAS */}
      <section className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col gap-3">
        <h2 className="text-[16px] font-bold text-[#001126] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0036ce]">shield</span>
          <span>Mécanisme et Limites de Protection</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Ce qu'il protège */}
          <div className="p-3 bg-[#eef4ff] rounded-lg border border-[#d6e4f8] flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[#005236]">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span className="font-['Space_Grotesk'] text-[12px] uppercase font-bold text-[#001126]">
                Ce que l'iode protège
              </span>
            </div>
            <p className="text-[12px] text-[#0f1c2b] leading-relaxed">
              Il sature la glande thyroïde en iode sain (non radioactif) pour empêcher la fixation de l’iode radioactif (I-131) inhalé ou ingéré, prévenant ainsi les cancers thyroïdiens.
            </p>
          </div>

          {/* Ce qu'il NE protège PAS */}
          <div className="p-3 bg-[#ffdad6]/40 rounded-lg border border-[#ffdad6] flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[20px]">cancel</span>
              <span className="font-['Space_Grotesk'] text-[12px] uppercase font-bold text-[#93000a]">
                Ce que l'iode NE protège PAS
              </span>
            </div>
            <p className="text-[12px] text-[#0f1c2b] leading-relaxed">
              Il ne protège PAS contre l'irradiation externe (rayonnements gamma/bêta), ni contre les autres radionucléides (Césium 137, Strontium 90). <strong>Seul le confinement dans un bâtiment solide protège contre ces rayonnements.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Calculateur de Posologie Interactif */}
      <section className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#001126] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0036ce]">calculate</span>
            <span>Calculateur de Dose selon le Profil</span>
          </h2>
          <span className="font-['Space_Grotesk'] text-[11px] bg-[#eef4ff] text-[#0036ce] px-2 py-0.5 rounded font-bold uppercase">
            Comprimés KI 65 mg
          </span>
        </div>

        <p className="text-[13px] text-[#44474d]">
          Sélectionnez la catégorie d’âge ou de situation pour afficher la posologie exacte recommandée par l'Agence Nationale de Sécurité du Médicament (ANSM) :
        </p>

        {/* Sélecteur de profil */}
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

        {/* Carte de posologie affichée */}
        <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
          selectedDose.isWarning
            ? 'bg-[#ffdad6]/40 border-[#ffb4ab]'
            : 'bg-[#12263f] text-white border-[#001126]'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`font-['Space_Grotesk'] text-[12px] uppercase font-bold ${
              selectedDose.isWarning ? 'text-[#93000a]' : 'text-[#98f6c5]'
            }`}>
              {selectedDose.label}
            </span>
            <span className={`font-['Space_Grotesk'] text-[18px] font-bold px-3 py-1 rounded ${
              selectedDose.isWarning
                ? 'bg-[#ba1a1a] text-white'
                : 'bg-[#98f6c5] text-[#005236]'
            }`}>
              {selectedDose.tablets}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[12px]">
            <div>
              <span className={selectedDose.isWarning ? 'text-[#44474d]' : 'text-[#b4c8e8]'}>Dose active :</span>
              <p className={`font-bold font-['Space_Grotesk'] ${selectedDose.isWarning ? 'text-[#93000a]' : 'text-white'}`}>
                {selectedDose.mgKI}
              </p>
            </div>
            <div>
              <span className={selectedDose.isWarning ? 'text-[#44474d]' : 'text-[#b4c8e8]'}>Fréquence :</span>
              <p className={`font-bold font-['Space_Grotesk'] ${selectedDose.isWarning ? 'text-[#93000a]' : 'text-white'}`}>
                Prise UNIQUE (ne pas renouveler sans ordre)
              </p>
            </div>
          </div>

          <div className={`p-3 rounded-lg text-[12px] leading-relaxed ${
            selectedDose.isWarning
              ? 'bg-white border border-[#ffb4ab] text-[#93000a]'
              : 'bg-white/10 text-[#d4e3ff]'
          }`}>
            <p className="font-medium">{selectedDose.desc}</p>
            <p className="mt-1 font-semibold text-[11px] uppercase tracking-wide">
              {selectedDose.recommendation}
            </p>
          </div>
        </div>
      </section>

      {/* Fenêtre temporelle d'efficacité */}
      <section className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col gap-2.5">
        <h2 className="text-[16px] font-bold text-[#001126] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0036ce]">schedule</span>
          <span>Fenêtre d'Efficacité Temporelle</span>
        </h2>
        <p className="text-[13px] text-[#44474d] leading-relaxed">
          Le moment de la prise est crucial. La saturation thyroïdienne est optimale si l'iode est absorbé :
        </p>
        <div className="flex flex-col gap-2 text-[12px]">
          <div className="p-2.5 bg-[#98f6c5]/30 rounded-lg border border-[#3f9d73] flex items-center justify-between">
            <span className="font-bold text-[#005236]">1 à 2 heures AVANT le rejet</span>
            <span className="font-['Space_Grotesk'] font-bold text-[#005236]">98% d'efficacité</span>
          </div>
          <div className="p-2.5 bg-[#eef4ff] rounded-lg border border-[#d6e4f8] flex items-center justify-between">
            <span className="font-semibold text-[#001126]">Jusqu'à 6 heures APRÈS le rejet</span>
            <span className="font-['Space_Grotesk'] font-bold text-[#0036ce]">~50% d'efficacité</span>
          </div>
          <div className="p-2.5 bg-[#ffdad6]/40 rounded-lg border border-[#ffdad6] flex items-center justify-between">
            <span className="font-semibold text-[#93000a]">Après 24 heures</span>
            <span className="font-['Space_Grotesk'] font-bold text-[#ba1a1a]">Inefficace (0%)</span>
          </div>
        </div>
      </section>

      {/* Zones PPI et distribution */}
      <section className="bg-[#eef4ff] p-4 rounded-xl border border-[#d6e4f8] flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#001126] text-[20px]">location_on</span>
          <h2 className="text-[15px] font-bold text-[#001126]">Distribution et Périmètres PPI</h2>
        </div>
        <p className="text-[12px] text-[#44474d] leading-relaxed">
          En France, les foyers situés dans un rayon de 0 à 10 km et de 10 à 20 km autour d’une centrale nucléaire reçoivent des boîtes de comprimés à retirer gratuitement en pharmacie (campagnes PPI régulières). En dehors de ces zones, les comprimés sont stockés dans les plateformes zonales de l’État et ne sont distribués qu'en cas d’accident majeur.
        </p>
      </section>
    </div>
  );
};
