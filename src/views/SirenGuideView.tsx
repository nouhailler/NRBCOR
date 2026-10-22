import React, { useState } from 'react';
import { playRNASiren, stopSiren } from '../utils/sirenAudio';
import { triggerHaptic } from '../utils/haptics';

interface SirenGuideViewProps {
  onBack: () => void;
  onGoToConfinement: () => void;
}

export const SirenGuideView: React.FC<SirenGuideViewProps> = ({
  onBack,
  onGoToConfinement
}) => {
  const [playingSiren, setPlayingSiren] = useState<'alerte' | 'fin' | null>(null);

  const toggleSound = (type: 'alerte' | 'fin') => {
    triggerHaptic(playingSiren === type ? 'light' : 'heavy');
    if (playingSiren === type) {
      stopSiren();
      setPlayingSiren(null);
    } else {
      setPlayingSiren(type);
      playRNASiren(type, () => setPlayingSiren(null));
    }
  };

  return (
    <div className="flex flex-col w-full pt-20 pb-28 min-h-screen max-w-xl mx-auto px-4 gap-4">
      {/* Sentinel bar */}
      <div className="w-full bg-[#001126] text-white py-2 px-3 rounded-lg flex items-center justify-between border border-[#12263f]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[18px] text-[#ffdad6]">campaign</span>
          <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wider truncate">
            Système d'Alerte et d'Information des Populations (SAIP / RNA)
          </span>
        </div>
        <span className="font-['Space_Grotesk'] text-[10px] bg-[#98f6c5] text-[#005236] px-2 py-0.5 rounded font-bold uppercase">
          ALERTE OFFICIELLE
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
        <button
          onClick={onGoToConfinement}
          type="button"
          className="h-12 px-3 bg-[#001126] hover:bg-[#12263f] text-white font-['Space_Grotesk'] text-[11px] font-bold rounded flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">meeting_room</span>
          <span>GUIDE CONFINEMENT</span>
        </button>
      </div>

      {/* Header title */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-['Space_Grotesk'] text-[11px] px-2 py-0.5 rounded bg-[#ba1a1a] text-white font-bold uppercase">
            SIGNAL NATIONAL D'ALERTE (RNA) & FR-ALERT
          </span>
        </div>
        <h1 className="text-[24px] text-[#001126] font-bold tracking-tight">
          Reconnaître les Signaux d'Alerte
        </h1>
        <p className="text-[13px] text-[#44474d] leading-relaxed">
          Apprenez à distinguer le signal d'alerte majeur du test mensuel et du son de fin d'alerte grâce au simulateur acoustique officiel.
        </p>
      </header>

      {/* Simulateur Acoustique Interactif */}
      <section className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#001126] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0036ce]">volume_up</span>
            <span>Simulateur Acoustique des Sirènes</span>
          </h2>
          <span className="font-['Space_Grotesk'] text-[11px] bg-[#eef4ff] text-[#0036ce] px-2 py-0.5 rounded font-bold uppercase">
            Web Audio Synth
          </span>
        </div>

        <p className="text-[12px] text-[#44474d]">
          Cliquez sur un signal pour écouter la modulation sonore caractéristique générée en temps réel par l'application :
        </p>

        {/* 1. Signal National d'Alerte */}
        <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#c4c6ce] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </span>
              <div>
                <h3 className="text-[14px] font-bold text-[#001126]">Signal National d'Alerte (RNA)</h3>
                <span className="text-[11px] text-[#ba1a1a] font-semibold">Danger immédiat (NRBC, PPI, Catastrophe)</span>
              </div>
            </div>
          </div>

          <p className="text-[12px] text-[#44474d] leading-snug">
            Son modulé montant et descendant de <strong>3 cycles de 1 minute et 41 secondes</strong>, chacun espacé d'un intervalle de 5 secondes de silence.
          </p>

          <button
            onClick={() => toggleSound('alerte')}
            type="button"
            className={`min-h-[44px] w-full rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center justify-center gap-2 transition-all ${
              playingSiren === 'alerte'
                ? 'bg-[#ba1a1a] text-white shadow-md animate-pulse'
                : 'bg-[#001126] hover:bg-[#12263f] text-white shadow-sm'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {playingSiren === 'alerte' ? 'stop' : 'play_arrow'}
            </span>
            <span>{playingSiren === 'alerte' ? 'Arrêter la sirène d’alerte' : 'Écouter la sirène d’alerte (Modulée)'}</span>
          </button>
        </div>

        {/* 2. Signal de Fin d'Alerte */}
        <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#c4c6ce] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#98f6c5] text-[#005236] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
              </span>
              <div>
                <h3 className="text-[14px] font-bold text-[#001126]">Signal de Fin d'Alerte</h3>
                <span className="text-[11px] text-[#005236] font-semibold">Danger écarté / Levée du confinement</span>
              </div>
            </div>
          </div>

          <p className="text-[12px] text-[#44474d] leading-snug">
            Son continu fixe de <strong>30 secondes</strong> sans modulation de fréquence.
          </p>

          <button
            onClick={() => toggleSound('fin')}
            type="button"
            className={`min-h-[44px] w-full rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center justify-center gap-2 transition-all ${
              playingSiren === 'fin'
                ? 'bg-[#3f9d73] text-white shadow-md'
                : 'bg-[#e4efff] hover:bg-[#d6e4f8] text-[#001126]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {playingSiren === 'fin' ? 'stop' : 'play_arrow'}
            </span>
            <span>{playingSiren === 'fin' ? 'Arrêter le son continu' : 'Écouter la fin d’alerte (30s continu)'}</span>
          </button>
        </div>

        {/* 3. Test Mensuel */}
        <div className="p-3 bg-[#eef4ff] rounded-lg border border-[#d6e4f8] flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[#0036ce] text-[20px] shrink-0 mt-0.5">
            calendar_month
          </span>
          <div className="text-[12px] text-[#0f1c2b] leading-snug">
            <strong>Essai mensuel des sirènes :</strong> Le 1er mercredi de chaque mois à 12h00 précises, la sirène retentit pendant un unique cycle court de 1 minute 41 secondes. Aucun confinement n’est requis lors de cet exercice récurrent.
          </div>
        </div>
      </section>

      {/* Dispositif FR-Alert */}
      <section className="bg-white p-4 rounded-xl shadow-sm border border-[#c4c6ce] flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0036ce] text-[22px]">smartphone</span>
          <h2 className="text-[16px] font-bold text-[#001126]">FR-Alert : Alerte sur Smartphone</h2>
        </div>

        <p className="text-[12px] text-[#44474d] leading-relaxed">
          Complémentaire aux sirènes RNA, le système national <strong>FR-Alert</strong> diffuse des notifications prioritaires directement sur tous les téléphones portables présents dans la zone de danger géographique :
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[12px]">
          <div className="p-2.5 bg-[#f8f9ff] rounded-lg border border-[#c4c6ce] flex flex-col gap-1">
            <span className="font-bold text-[#001126] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#0036ce]">cell_tower</span>
              Diffusion cellulaire (Cell Broadcast)
            </span>
            <span className="text-[#44474d]">
              Ne nécessite aucune application ni connexion Internet. Traverse le mode silencieux et ne sature pas les réseaux.
            </span>
          </div>

          <div className="p-2.5 bg-[#f8f9ff] rounded-lg border border-[#c4c6ce] flex flex-col gap-1">
            <span className="font-bold text-[#001126] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#0036ce]">sms</span>
              SMS géolocalisé
            </span>
            <span className="text-[#44474d]">
              Envoi ciblé d'un SMS institutionnel aux téléphones bornant sur les antennes relais de la commune concernée.
            </span>
          </div>
        </div>
      </section>

      {/* 3 Réflexes de Survie immédiats */}
      <section className="bg-[#12263f] text-white p-4 rounded-xl shadow-sm border border-[#001126] flex flex-col gap-3">
        <h2 className="text-[15px] font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[#98f6c5]">checklist</span>
          <span>Les 3 Réflexes de Survie Dès le Signal</span>
        </h2>

        <div className="flex flex-col gap-2 text-[13px]">
          <div className="p-2.5 bg-white/10 rounded-lg flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#98f6c5] text-[#005236] flex items-center justify-center font-bold text-[12px] shrink-0">
              1
            </div>
            <span className="font-semibold text-white">Rejoindre immédiatement un bâtiment clos (se confiner)</span>
          </div>

          <div className="p-2.5 bg-white/10 rounded-lg flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#98f6c5] text-[#005236] flex items-center justify-center font-bold text-[12px] shrink-0">
              2
            </div>
            <span className="font-semibold text-white">Écouter la radio officielle (France Bleu, France Inter)</span>
          </div>

          <div className="p-2.5 bg-white/10 rounded-lg flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#98f6c5] text-[#005236] flex items-center justify-center font-bold text-[12px] shrink-0">
              3
            </div>
            <span className="font-semibold text-white">Ne pas saturer les téléphones et ne pas aller chercher les enfants</span>
          </div>
        </div>
      </section>
    </div>
  );
};
