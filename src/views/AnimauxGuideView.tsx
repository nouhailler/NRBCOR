import React, { useState } from 'react';
import { triggerHaptic } from '../utils/haptics';
import { ExportPdfModal } from '../components/ExportPdfModal';

interface AnimauxGuideViewProps {
  onBack: () => void;
  initialPetsCount?: number;
}

export const AnimauxGuideView: React.FC<AnimauxGuideViewProps> = ({
  onBack,
  initialPetsCount = 1
}) => {
  const [petsCount, setPetsCount] = useState<number>(Math.max(1, initialPetsCount));
  const [targetDays, setTargetDays] = useState<number>(3); // 72h standard
  const [activeTab, setActiveTab] = useState<'confinement' | 'decontamination' | 'iode' | 'kit' | 'evacuation'>('confinement');
  const [showExportModal, setShowExportModal] = useState(false);

  // Calculs dynamiques
  const waterLitersNeeded = petsCount * 0.5 * targetDays;
  const foodKgEstimated = +(petsCount * 0.25 * targetDays).toFixed(1);

  return (
    <div className="flex flex-col w-full pt-20 pb-28 lg:pb-12 min-h-screen max-w-xl lg:max-w-3xl mx-auto px-4 sm:px-6 gap-4">
      {/* Sentinel bar */}
      <div className="w-full bg-navy text-white py-2 px-3 rounded-lg flex items-center justify-between border border-ink">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[18px] text-ok-bright">pets</span>
          <span className="font-label text-[11px] font-bold uppercase tracking-wider truncate">
            Protocole Spécifique • Animaux de Compagnie en Milieu NRBC
          </span>
        </div>
        <span className="font-label text-[10px] bg-ok-soft text-ok-ink px-2 py-0.5 rounded font-bold uppercase">
          VÉTÉRINAIRE
        </span>
      </div>

      {/* Navigation retour & export */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          type="button"
          className="min-h-[44px] px-3 bg-tint hover:bg-tint text-ink font-label text-[12px] font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>RETOUR AUX GUIDES</span>
        </button>

        <button
          onClick={() => setShowExportModal(true)}
          type="button"
          className="min-h-[44px] px-3 bg-card border border-line-strong hover:bg-subtle text-ink font-label text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
          <span>EXPORTER EN PDF</span>
        </button>
      </div>

      {/* Titre & Doctrine */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-label text-[11px] px-2 py-0.5 rounded bg-brand text-white font-bold uppercase tracking-wider">
            RÉFLEXE FOYER & SÉCURITÉ CIVILE
          </span>
          <span className="font-label text-[11px] text-ink-muted font-semibold">
            • CHIENS, CHATS, NAC
          </span>
        </div>
        <h1 className="text-[24px] text-ink font-bold tracking-tight">
          Protection & Évacuation des Animaux
        </h1>
        <p className="text-[13px] text-ink-muted leading-relaxed">
          En cas d'accident chimique, radiologique ou nucléaire, les animaux de compagnie ne doivent pas être laissés à l'abandon ni devenir un vecteur de contamination secondaire pour la famille.
        </p>
      </header>

      {/* Avertissement Majeur : Iode Stable Proscrite */}
      <div className="p-3.5 bg-danger-soft/70 rounded-xl border border-danger-line text-[12px] text-danger-ink flex items-start gap-2.5 shadow-xs">
        <span className="material-symbols-outlined text-[20px] text-danger-ink shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
          warning
        </span>
        <div className="flex flex-col gap-0.5 leading-snug">
          <span className="font-bold text-[13px] uppercase font-label">
            INTERDICTION FORMELLE : NE PAS DONNER D'IODE HUMAIN AUX ANIMAUX
          </span>
          <p className="text-[11.5px] text-danger-ink-strong">
            Les comprimés d'iode stable (KI 65mg) distribués pour l'être humain sont <strong>toxiques et surdosés</strong> pour les chiens et les chats (risque aigu de nécrose thyroïdienne et défaillance rénale). <strong>Ne leur administrez jamais vos comprimés</strong> sans prescription expresse d'un vétérinaire ou de l'autorité sanitaire.
          </p>
        </div>
      </div>

      {/* Simulateur Rapide Réserves Animalières */}
      <section className="bg-card p-4 rounded-xl border border-line-strong shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-line">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-ink text-[20px]">calculate</span>
            <h2 className="text-[15px] font-bold text-ink">Calculateur Réserves 72h Dédiées</h2>
          </div>
          <span className="text-[10px] font-label uppercase font-bold bg-subtle text-brand-ink px-2 py-0.5 rounded">
            DOTATION MINIMALE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-label font-bold text-ink-muted uppercase block mb-1">
              Nombre d'animaux :
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { triggerHaptic('light'); setPetsCount((p) => Math.max(1, p - 1)); }}
                className="w-10 h-10 rounded-lg bg-subtle text-ink font-bold text-[16px] flex items-center justify-center hover:bg-tint"
              >
                -
              </button>
              <span className="font-label font-bold text-[16px] text-ink w-6 text-center">
                {petsCount}
              </span>
              <button
                type="button"
                onClick={() => { triggerHaptic('light'); setPetsCount((p) => Math.min(10, p + 1)); }}
                className="w-10 h-10 rounded-lg bg-subtle text-ink font-bold text-[16px] flex items-center justify-center hover:bg-tint"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-label font-bold text-ink-muted uppercase block mb-1">
              Durée de crise :
            </label>
            <div className="flex items-center gap-1.5">
              {[
                { d: 2, label: '48h' },
                { d: 3, label: '72h' },
                { d: 7, label: '7j' }
              ].map((opt) => (
                <button
                  key={opt.d}
                  type="button"
                  onClick={() => { triggerHaptic('light'); setTargetDays(opt.d); }}
                  className={`flex-1 h-10 rounded-lg font-label text-[11px] font-bold transition-all ${
                    targetDays === opt.d
                      ? 'bg-navy text-white shadow-xs'
                      : 'bg-subtle text-ink-muted hover:bg-subtle'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Résultats calculés */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-subtle p-2.5 rounded-lg border border-line flex flex-col">
            <span className="text-[11px] font-label text-ink-muted uppercase font-bold">
              Eau supplémentaire requise :
            </span>
            <span className="text-[18px] font-bold text-brand-ink font-label">
              {waterLitersNeeded} Litres
            </span>
            <span className="text-[10px] text-ink-muted">0,5 L / jour / animal (gamelle propre)</span>
          </div>

          <div className="bg-subtle p-2.5 rounded-lg border border-line flex flex-col">
            <span className="text-[11px] font-label text-ink-muted uppercase font-bold">
              Alimentation sèche sous sachet :
            </span>
            <span className="text-[18px] font-bold text-ink font-label">
              ~ {foodKgEstimated} kg
            </span>
            <span className="text-[10px] text-ink-muted">Pâtée ou croquettes en sac hermétique</span>
          </div>
        </div>
      </section>

      {/* Onglets d'action opérationnelle */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'confinement', label: '1. Confinement', icon: 'meeting_room' },
          { id: 'decontamination', label: '2. Lavage pelage', icon: 'sanitizer' },
          { id: 'kit', label: '3. Kit 72h animal', icon: 'medical_services' },
          { id: 'evacuation', label: '4. Évacuation', icon: 'forklift' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => { triggerHaptic('light'); setActiveTab(tab.id as any); }}
            className={`min-h-[42px] px-3 py-1.5 rounded-xl font-label text-[11px] font-bold uppercase flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-navy text-white shadow-xs'
                : 'bg-card text-ink-muted border border-line-strong hover:bg-subtle'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenu Onglet 1 : Confinement */}
      {activeTab === 'confinement' && (
        <article className="bg-card p-4 rounded-xl border border-line-strong shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center font-bold font-label text-[13px]">
              1
            </div>
            <h3 className="text-[16px] font-bold text-ink">
              Protocole de Confinement en Milieu NRBC
            </h3>
          </div>

          <div className="space-y-2 text-[13px] text-ink leading-relaxed">
            <div className="p-3 bg-canvas rounded-lg border border-line flex flex-col gap-1.5">
              <span className="font-bold text-ink flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-brand-ink">lock</span>
                Bloquer immédiatement tous les accès vers l'extérieur
              </span>
              <p className="text-[12px] text-ink-muted">
                Verrouiller et scotcher les <strong>chatières et trappes pour chiens</strong>. Ne jamais laisser sortir un animal faire ses besoins pendant le passage d'un panache chimique ou radioactif.
              </p>
            </div>

            <div className="p-3 bg-canvas rounded-lg border border-line flex flex-col gap-1.5">
              <span className="font-bold text-ink flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-brand-ink">shield</span>
                Garder l'animal dans la même pièce calfeutrée que le foyer
              </span>
              <p className="text-[12px] text-ink-muted">
                Les animaux ont une fréquence respiratoire plus élevée que l'homme (30 à 40 respirations/min pour un chat, jusqu'à 30 pour un chien). Toute fuite d'air les intoxiquerait plus rapidement.
              </p>
            </div>

            <div className="p-3 bg-canvas rounded-lg border border-line flex flex-col gap-1.5">
              <span className="font-bold text-ink flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-brand-ink">cleaning_services</span>
                Gestion des déjections sans ventiler
              </span>
              <p className="text-[12px] text-ink-muted">
                Utiliser des alèses absorbantes ou la litière. Fermer hermétiquement chaque sac de déjection dans un double sac poubelle avec lien serré. <strong>Ne jamais ouvrir de fenêtre</strong> pour aérer.
              </p>
            </div>
          </div>
        </article>
      )}

      {/* Contenu Onglet 2 : Décontamination pelage */}
      {activeTab === 'decontamination' && (
        <article className="bg-card p-4 rounded-xl border border-line-strong shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-ok-deep text-ok-bright flex items-center justify-center font-bold font-label text-[13px]">
              2
            </div>
            <h3 className="text-[16px] font-bold text-ink">
              Lavage d'Urgence du Pelage Contaminé
            </h3>
          </div>

          <p className="text-[12px] text-ink-muted">
            Si votre animal était dehors au moment du rejet ou du déclenchement de la sirène, son pelage retient les particules toxiques et radioactives.
          </p>

          <ol className="space-y-2.5 text-[12.5px] text-ink">
            <li className="flex items-start gap-2.5 p-2.5 bg-subtle rounded-lg">
              <span className="w-5 h-5 rounded-full bg-navy text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                A
              </span>
              <div>
                <strong>Équipez-vous d'abord :</strong> portez des gants étanches (vaisselle ou latex) et un masque de protection (FFP2 ou chirurgical) pour éviter d'inhaler les poussières soulevées du pelage.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-2.5 bg-subtle rounded-lg">
              <span className="w-5 h-5 rounded-full bg-navy text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                B
              </span>
              <div>
                <strong>Lavage doux à l'eau tiède :</strong> utilisez un shampoing pour animaux doux ou du savon de Marseille. <strong>Ne frottez pas énergiquement</strong> avec une brosse dure pour ne pas faire pénétrer les particules dans les pores de la peau.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-2.5 bg-subtle rounded-lg">
              <span className="w-5 h-5 rounded-full bg-navy text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                C
              </span>
              <div>
                <strong>Rinçage et séchage tamponné :</strong> rincez abondamment au jet doux (pas de nettoyeur haute pression). Séchez en tamponnant avec des serviettes jetables ou de vieux chiffons.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-2.5 bg-subtle rounded-lg">
              <span className="w-5 h-5 rounded-full bg-navy text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                D
              </span>
              <div>
                <strong>Double ensachage hermétique :</strong> enfermez toutes les serviettes utilisées dans un premier sac poubelle étanche, nouez-le, puis placez-le dans un second sac scellé au scotch.
              </div>
            </li>
          </ol>
        </article>
      )}

      {/* Contenu Onglet 3 : Kit 72h animal */}
      {activeTab === 'kit' && (
        <article className="bg-card p-4 rounded-xl border border-line-strong shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center font-bold font-label text-[13px]">
              3
            </div>
            <h3 className="text-[16px] font-bold text-ink">
              Checklist Kit 72h Spécifique pour Animaux
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
            <div className="p-3 bg-canvas rounded-lg border border-line flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-brand-ink shrink-0">water_drop</span>
              <div>
                <strong>Eau en bouteille scellée :</strong> dotation dédiée (ne pas puiser dans l'eau du robinet si risque de contamination du réseau).
              </div>
            </div>

            <div className="p-3 bg-canvas rounded-lg border border-line flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-brand-ink shrink-0">inventory_2</span>
              <div>
                <strong>Croquettes sous boîte étanche :</strong> évite la fixation de vapeurs chimiques ou de poussières de retombées radioactives.
              </div>
            </div>

            <div className="p-3 bg-canvas rounded-lg border border-line flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-brand-ink shrink-0">description</span>
              <div>
                <strong>Carnet de santé & I-CAD sous pochette plastique :</strong> numéro de puce électronique ou tatouage, preuves de vaccination antirabique.
              </div>
            </div>

            <div className="p-3 bg-canvas rounded-lg border border-line flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-brand-ink shrink-0">medication</span>
              <div>
                <strong>Traitements chroniques (7 jours) :</strong> médicaments réguliers prescrits par le vétérinaire (insuline, cardiovasculaire, etc.).
              </div>
            </div>

            <div className="p-3 bg-canvas rounded-lg border border-line flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-brand-ink shrink-0">cleaning_services</span>
              <div>
                <strong>Alèses étanches & sacs poubelle :</strong> pour gérer les selles et urines sans jamais aérer la pièce de confinement.
              </div>
            </div>

            <div className="p-3 bg-canvas rounded-lg border border-line flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-brand-ink shrink-0">badge</span>
              <div>
                <strong>Collier avec médaille gravée :</strong> nom de l'animal, téléphone avec indicatif (+33) et contact hors zone.
              </div>
            </div>
          </div>
        </article>
      )}

      {/* Contenu Onglet 4 : Évacuation & Réquisition */}
      {activeTab === 'evacuation' && (
        <article className="bg-card p-4 rounded-xl border border-line-strong shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-danger text-white flex items-center justify-center font-bold font-label text-[13px]">
              4
            </div>
            <h3 className="text-[16px] font-bold text-ink">
              Consignes d'Évacuation & Centres d'Hébergement
            </h3>
          </div>

          <div className="space-y-2 text-[12.5px] text-ink leading-relaxed">
            <div className="p-3 bg-warn-soft/60 rounded-lg border border-warn-bright">
              <strong className="text-warn-ink block mb-1">
                ⚠️ Règle des Centres d'Accueil et de Regroupement (CARE) :
              </strong>
              <p className="text-[11.5px] text-ink-muted">
                En France, les gymnases et structures réquisitionnés par la Sécurité Civile n'autorisent pas les animaux libres en salle commune pour des raisons sanitaires et de sécurité. <strong>Une cage de transport rigide étanche est obligatoire</strong> pour être admis, ainsi qu'une muselière pour les chiens de catégorie ou de grand gabarit.
              </p>
            </div>

            <div className="p-3 bg-subtle rounded-lg border border-line-strong flex flex-col gap-1.5">
              <span className="font-bold text-ink">Matériel d'évacuation impératif :</span>
              <ul className="list-disc pl-5 space-y-1 text-[12px] text-ink-muted">
                <li>Cage de transport rigide (nettoyable et calfeutrable temporairement avec un linge humide pendant le trajet).</li>
                <li>Laisse solide non rétractable + harnais ajusté.</li>
                <li>Muselière adaptée à la morphologie.</li>
                <li>Fiche d'identification scotché sur la caisse de transport (Nom, Coordonnées, Besoins alimentaires).</li>
              </ul>
            </div>
          </div>
        </article>
      )}

      {/* Modal Export PDF */}
      <ExportPdfModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        initialGuideKey="pack-complet"
      />
    </div>
  );
};
